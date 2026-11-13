// Applies the committed Prisma migrations to the local test database (TEST_DATABASE_URL).
// Run once after creating gitgood_test, and again whenever a new migration is pulled.
const { spawnSync } = require("node:child_process");
const { testDatabaseUrl } = require("./test-database");

const { url, reason } = testDatabaseUrl();
if (!url) {
  console.error(`Cannot set up the test database: ${reason}.`);
  process.exit(1);
}

const result = spawnSync("npx prisma migrate deploy", {
  shell: true,
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: url },
});
if (result.status === 0) console.log("Test database is ready. Run `npm test`.");
process.exit(result.status ?? 1);
