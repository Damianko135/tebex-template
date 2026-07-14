import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const SCHEMA_URL =
  "https://raw.githubusercontent.com/tebexio/TebexHeadless-OpenAPI/refs/heads/main/headless-api.yaml";
const OUT_FILE = path.join(process.cwd(), "openapi.yaml");

function fetchSchema(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const { statusCode, headers } = res;

        if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location) {
          res.resume();
          fetchSchema(headers.location).then(resolve, reject);
          return;
        }

        if (statusCode !== 200) {
          res.resume();
          reject(new Error(`Failed to fetch schema: ${statusCode} ${res.statusMessage}`));
          return;
        }

        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function main() {
  console.log(`Fetching latest schema from ${SCHEMA_URL}`);
  const schema = await fetchSchema(SCHEMA_URL);
  fs.writeFileSync(OUT_FILE, schema);
  console.log(`Wrote ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
