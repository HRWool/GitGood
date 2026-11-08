const { PrismaClient } = require("@prisma/client");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before seeding.");
}

const database = new URL(databaseUrl);
const databaseName = database.pathname.slice(1);

if (!["localhost", "127.0.0.1", "::1"].includes(database.hostname) || databaseName !== "gitgood") {
  throw new Error("Seeding is restricted to the local 'gitgood' development database.");
}

const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.upsert({
    where: { email: "maya.dev@example.test" },
    update: {
      username: "maya_dev",
      displayName: "Maya Developer",
    },
    create: {
      id: "dev-student-maya",
      email: "maya.dev@example.test",
      username: "maya_dev",
      displayName: "Maya Developer",
    },
  });

  const skill = await prisma.skill.upsert({
    where: { id: "dev-skill-python" },
    update: {
      name: "Python",
      normalizedName: "python",
      icon: "🐍",
    },
    create: {
      id: "dev-skill-python",
      name: "Python",
      normalizedName: "python",
      icon: "🐍",
    },
  });

  await prisma.studentSkill.upsert({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId: skill.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      skillId: skill.id,
    },
  });

  const quest = await prisma.quest.upsert({
    where: { id: "dev-quest-python-loops" },
    update: {
      title: "Count the Orders",
      skillId: skill.id,
      level: "EASY",
      xpReward: 25,
      estimatedMinutes: 5,
      prompt: "Use a loop to count each order.",
      story: "A neighborhood bakery needs a quick order counter.",
      speakerName: "Maya",
      speakerAvatar: "🦊",
      speakerRole: "Junior developer",
      hint: "Add one to the counter for each order.",
      codeTemplate: ["orders = [1, 2, 3]", "count = 0", "for order in orders:", "    count ___ 1"],
    },
    create: {
      id: "dev-quest-python-loops",
      title: "Count the Orders",
      skillId: skill.id,
      level: "EASY",
      xpReward: 25,
      estimatedMinutes: 5,
      prompt: "Use a loop to count each order.",
      story: "A neighborhood bakery needs a quick order counter.",
      speakerName: "Maya",
      speakerAvatar: "🦊",
      speakerRole: "Junior developer",
      hint: "Add one to the counter for each order.",
      codeTemplate: ["orders = [1, 2, 3]", "count = 0", "for order in orders:", "    count ___ 1"],
    },
  });

  await prisma.questConcept.upsert({
    where: { id: "dev-concept-python-loops" },
    update: {
      questId: quest.id,
      name: "for loops",
      position: 0,
    },
    create: {
      id: "dev-concept-python-loops",
      questId: quest.id,
      name: "for loops",
      position: 0,
    },
  });

  const blank = await prisma.questBlank.upsert({
    where: { id: "dev-blank-python-loops" },
    update: {
      questId: quest.id,
      position: 0,
    },
    create: {
      id: "dev-blank-python-loops",
      questId: quest.id,
      position: 0,
    },
  });

  await prisma.questAnswer.upsert({
    where: { id: "dev-answer-python-loops" },
    update: {
      blankId: blank.id,
      value: "+=",
      normalizedValue: "+=",
    },
    create: {
      id: "dev-answer-python-loops",
      blankId: blank.id,
      value: "+=",
      normalizedValue: "+=",
    },
  });

  await prisma.questTest.upsert({
    where: { id: "dev-test-python-loops" },
    update: {
      questId: quest.id,
      description: "The counter equals the number of orders.",
      position: 0,
    },
    create: {
      id: "dev-test-python-loops",
      questId: quest.id,
      description: "The counter equals the number of orders.",
      position: 0,
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await prisma.dailyQuestAssignment.upsert({
    where: {
      studentId_activityDate_questId: {
        studentId: student.id,
        activityDate: today,
        questId: quest.id,
      },
    },
    update: { position: 0 },
    create: {
      studentId: student.id,
      questId: quest.id,
      activityDate: today,
      position: 0,
    },
  });

  console.log("Seeded development student, Python skill, sample quest, and today's assignment.");
}

main()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
