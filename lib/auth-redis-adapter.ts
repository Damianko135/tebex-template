import "server-only";

import { createAdapterFactory } from "better-auth/adapters";
import type { CleanedWhere, DBAdapterDebugLogOption } from "better-auth/adapters";

import { redis } from "./redis";

const KEY_PREFIX = "betterauth";

function rowKey(model: string, id: string): string {
  return `${KEY_PREFIX}:${model}:${id}`;
}

function indexKey(model: string): string {
  return `${KEY_PREFIX}:${model}:__index__`;
}

/**
 * Minimal key/value + set primitives, backed by Redis when configured and
 * by an in-process Map otherwise (mirrors the graceful fallback already used
 * by `lib/storage/storage.ts` for theme settings). Every auth record (user,
 * session, account, verification, and anything future plugins add) is stored
 * as one JSON blob per row under its own key, with a per-model Redis Set
 * tracking which ids exist - there's no relational engine underneath, so
 * `where`-clause filtering happens in JS after loading a model's rows.
 */
const memoryRows = new Map<string, string>();
const memoryIndexes = new Map<string, Set<string>>();

async function kvMGet(keys: string[]): Promise<(string | null)[]> {
  if (keys.length === 0) return [];
  if (redis) return redis.mget(keys);
  return keys.map((key) => memoryRows.get(key) ?? null);
}

async function kvSet(key: string, value: string): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }
  memoryRows.set(key, value);
}

async function kvDel(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }
  memoryRows.delete(key);
}

async function kvSAdd(key: string, member: string): Promise<void> {
  if (redis) {
    await redis.sadd(key, member);
    return;
  }
  const set = memoryIndexes.get(key) ?? new Set<string>();
  set.add(member);
  memoryIndexes.set(key, set);
}

async function kvSRem(key: string, member: string): Promise<void> {
  if (redis) {
    await redis.srem(key, member);
    return;
  }
  memoryIndexes.get(key)?.delete(member);
}

async function kvSMembers(key: string): Promise<string[]> {
  if (redis) return redis.smembers(key);
  return [...(memoryIndexes.get(key) ?? [])];
}

async function loadTable(model: string): Promise<Record<string, unknown>[]> {
  const ids = await kvSMembers(indexKey(model));
  if (ids.length === 0) return [];

  const raw = await kvMGet(ids.map((id) => rowKey(model, id)));
  const rows: Record<string, unknown>[] = [];
  const staleIds: string[] = [];

  raw.forEach((value, i) => {
    if (value === null) {
      // The index says this id exists but the row is gone (e.g. it expired
      // or was removed outside this adapter) - drop it from the index so
      // future scans don't keep paying for a dead lookup.
      staleIds.push(ids[i]!);
      return;
    }
    rows.push(JSON.parse(value) as Record<string, unknown>);
  });

  if (staleIds.length > 0) {
    await Promise.all(staleIds.map((id) => kvSRem(indexKey(model), id)));
  }

  return rows;
}

async function saveRow(model: string, row: Record<string, unknown>): Promise<void> {
  const id = String(row.id);
  await kvSet(rowKey(model, id), JSON.stringify(row));
  await kvSAdd(indexKey(model), id);
}

async function removeRow(model: string, id: string): Promise<void> {
  await kvDel(rowKey(model, id));
  await kvSRem(indexKey(model), id);
}

/** Orders two field values for gt/gte/lt/lte. Returns 0 (neither greater
 * nor less) for pairs that aren't both numbers, both strings, or both
 * dates, so those operators simply never match rather than throwing. */
function compareOrdered(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (a instanceof Date && typeof b === "string") return a.getTime() - new Date(b).getTime();
  if (typeof a === "string" && b instanceof Date) return new Date(a).getTime() - b.getTime();
  return 0;
}

function evalClause(record: Record<string, unknown>, clause: CleanedWhere): boolean {
  const { field, value, operator = "eq", mode = "sensitive" } = clause;
  const fieldValue = record[field];
  const insensitive =
    mode === "insensitive" &&
    (typeof value === "string" || (Array.isArray(value) && value.every((v) => typeof v === "string")));

  const toComparable = (v: unknown) =>
    insensitive && typeof v === "string" ? v.toLowerCase() : v;

  switch (operator) {
    case "in":
      if (!Array.isArray(value)) throw new Error("Value must be an array");
      return insensitive
        ? (value as string[]).some((v) => v.toLowerCase() === String(fieldValue ?? "").toLowerCase())
        : (value as unknown[]).includes(fieldValue);
    case "not_in":
      if (!Array.isArray(value)) throw new Error("Value must be an array");
      return insensitive
        ? !(value as string[]).some((v) => v.toLowerCase() === String(fieldValue ?? "").toLowerCase())
        : !(value as unknown[]).includes(fieldValue);
    case "contains":
      return typeof fieldValue === "string" && typeof value === "string"
        ? toComparable(fieldValue)!.toString().includes(toComparable(value) as string)
        : false;
    case "starts_with":
      return typeof fieldValue === "string" && typeof value === "string"
        ? toComparable(fieldValue)!.toString().startsWith(toComparable(value) as string)
        : false;
    case "ends_with":
      return typeof fieldValue === "string" && typeof value === "string"
        ? toComparable(fieldValue)!.toString().endsWith(toComparable(value) as string)
        : false;
    case "ne":
      return toComparable(fieldValue) !== toComparable(value);
    case "gt":
      return compareOrdered(fieldValue, value) > 0;
    case "gte":
      return compareOrdered(fieldValue, value) >= 0;
    case "lt":
      return compareOrdered(fieldValue, value) < 0;
    case "lte":
      return compareOrdered(fieldValue, value) <= 0;
    case "eq":
    default:
      if (value === null) return fieldValue == null;
      return toComparable(fieldValue) === toComparable(value);
  }
}

function matchesWhere(record: Record<string, unknown>, where: CleanedWhere[]): boolean {
  if (!where || where.length === 0) return true;
  let result = evalClause(record, where[0]!);
  for (const clause of where) {
    const clauseResult = evalClause(record, clause);
    result = clause.connector === "OR" ? result || clauseResult : result && clauseResult;
  }
  return result;
}

function applySort(
  records: Record<string, unknown>[],
  sortBy: { field: string; direction: "asc" | "desc" } | undefined
): Record<string, unknown>[] {
  if (!sortBy) return records;
  return [...records].sort((a, b) => {
    const aValue = a[sortBy.field];
    const bValue = b[sortBy.field];

    let comparison = 0;
    if (aValue == null && bValue == null) comparison = 0;
    else if (aValue == null) comparison = -1;
    else if (bValue == null) comparison = 1;
    else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }
    return sortBy.direction === "asc" ? comparison : -comparison;
  });
}

function applySelect(
  records: Record<string, unknown>[],
  select?: string[]
): Record<string, unknown>[] {
  if (!select || select.length === 0) return records;
  return records.map((record) =>
    Object.fromEntries(Object.entries(record).filter(([key]) => select.includes(key)))
  );
}

export interface RedisAdapterConfig {
  debugLogs?: DBAdapterDebugLogOption;
}

/**
 * Custom Better Auth database adapter backed by Redis (falling back to an
 * in-process store when `REDIS_URL` is unset). Each model's rows live as
 * individual `betterauth:{model}:{id}` keys plus a `betterauth:{model}:__index__`
 * Set of ids, so reads/writes touch only the rows involved instead of one
 * ever-growing blob. `where` filtering, sorting, and field selection are done
 * in JS after loading a model's rows - fine at admin-console scale (a handful
 * of admin users/sessions), not intended for high-volume data.
 *
 * `join` support is intentionally not implemented: Better Auth's core
 * email/password + session flow never requests it, and no enabled plugin
 * currently needs relational joins.
 */
export const redisAdapter = (config: RedisAdapterConfig = {}) =>
  createAdapterFactory({
    config: {
      adapterId: "redis-kv",
      adapterName: "Redis Adapter",
      usePlural: false,
      debugLogs: config.debugLogs ?? false,
      supportsJSON: true,
      supportsDates: true,
      supportsBooleans: true,
      supportsNumericIds: true,
      // No transactional guarantees across the read-then-write calls below;
      // acceptable for a low-concurrency, admin-only auth system. Set to
      // `false` so Better Auth runs multi-step operations sequentially
      // instead of expecting real rollback support.
      transaction: false,
    },
    adapter: () => ({
      create: async ({ model, data }) => {
        await saveRow(model, data as Record<string, unknown>);
        return data;
      },

      findOne: async ({ model, where, select }) => {
        const rows = await loadTable(model);
        const matches = rows.filter((row) => matchesWhere(row, where));
        const [match] = applySelect(matches, select);
        return (match ?? null) as never;
      },

      findMany: async ({ model, where, sortBy, limit, offset, select }) => {
        const rows = await loadTable(model);
        const matches = rows.filter((row) => matchesWhere(row, where ?? []));
        let sorted = applySort(matches, sortBy);
        if (offset !== undefined) sorted = sorted.slice(offset);
        if (limit !== undefined) sorted = sorted.slice(0, limit);
        return applySelect(sorted, select) as never;
      },

      count: async ({ model, where }) => {
        const rows = await loadTable(model);
        return rows.filter((row) => matchesWhere(row, where ?? [])).length;
      },

      update: async ({ model, where, update }) => {
        if (where.length === 0) return null;
        const rows = await loadTable(model);
        const match = rows.find((row) => matchesWhere(row, where));
        if (!match) return null;
        Object.assign(match, update);
        await saveRow(model, match);
        return match as never;
      },

      updateMany: async ({ model, where, update }) => {
        const rows = await loadTable(model);
        const matches = rows.filter((row) => matchesWhere(row, where));
        await Promise.all(
          matches.map((match) => {
            Object.assign(match, update);
            return saveRow(model, match);
          })
        );
        return matches.length;
      },

      delete: async ({ model, where }) => {
        if (where.length === 0) return;
        const rows = await loadTable(model);
        const match = rows.find((row) => matchesWhere(row, where));
        if (!match) return;
        await removeRow(model, String(match.id));
      },

      deleteMany: async ({ model, where }) => {
        const rows = await loadTable(model);
        const matches = rows.filter((row) => matchesWhere(row, where));
        await Promise.all(matches.map((match) => removeRow(model, String(match.id))));
        return matches.length;
      },
    }),
  });
