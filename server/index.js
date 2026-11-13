// Starts Git Good locally: the site plus the database API at http://localhost:8000.
// Prisma reads DATABASE_URL from .env (see docs/database-setup.md).
const { PrismaClient } = require("@prisma/client");
const { createServer } = require("./app");

const port = Number(process.env.PORT) || 8000;
const prisma = new PrismaClient();
const server = createServer(prisma);

server.listen(port, () => {
  console.log(`Git Good is running at http://localhost:${port}/`);
  prisma.$queryRaw`SELECT 1`
    .then(() => console.log("Connected to the database."))
    .catch(() => console.warn("Warning: could not reach the database. Sign-up will show an error until PostgreSQL is running."));
});

function shutdown() {
  server.close(() => prisma.$disconnect().finally(() => process.exit(0)));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
