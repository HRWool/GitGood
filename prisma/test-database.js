// Finds TEST_DATABASE_URL (from the environment or .env) for the automated tests.
// The tests create and delete rows, so they only run against a LOCAL database whose
// name ends in "_test" (for example gitgood_test). Your gitgood dev data is never touched.
const fs = require("node:fs");
const path = require("node:path");

function readEnvFile() {
  const file = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(file)) return {};
  const values = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) values[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return values;
}

// Returns { url } when a safe test database is configured, or { reason } explaining why not.
function testDatabaseUrl() {
  const url = process.env.TEST_DATABASE_URL || readEnvFile().TEST_DATABASE_URL;
  if (!url) return { reason: "TEST_DATABASE_URL is not set (see docs/database-setup.md)" };
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { reason: "TEST_DATABASE_URL is not a valid connection URL" };
  }
  const name = parsed.pathname.slice(1);
  if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(parsed.hostname)) {
    return { reason: "TEST_DATABASE_URL must point at a local database" };
  }
  if (!name.endsWith("_test")) return { reason: "the test database name must end in _test (for example gitgood_test)" };
  return { url };
}

module.exports = { testDatabaseUrl };
