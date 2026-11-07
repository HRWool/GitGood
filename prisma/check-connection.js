const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRaw`SELECT current_database() AS database, current_schema() AS schema`;
  const { database, schema } = rows[0];

  console.log(`Connected to PostgreSQL database "${database}" (schema "${schema}").`);
}

main()
  .catch((error) => {
    console.error("Database connection check failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
