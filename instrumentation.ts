export async function register() {
  // ioredis and the auth adapter are Node-only; `register()` also fires in
  // the Edge runtime, so skip there.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { ensureInitialAdmin } = await import("@/lib/auth-bootstrap");
  await ensureInitialAdmin();
}
