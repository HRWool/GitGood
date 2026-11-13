// Data-access layer for the "save my sign-up" user story (issue #44).
// Every function takes a PrismaClient so the server and the tests can pass in
// their own client (the tests use a separate gitgood_test database).

const UNCC_EMAIL = /^[^\s@]+@(charlotte|uncc)\.edu$/i;
const USERNAME = /^[a-z0-9_]{3,18}$/i;
const MAX_SKILLS = 12;
const MAX_SKILL_NAME = 24;

// Same built-in skills as SKILLS in js/data.js (a test keeps the two in sync).
const BUILT_IN_SKILLS = [
  { name: "Python", icon: "🐍" },
  { name: "Java", icon: "☕" },
  { name: "Web", icon: "🌐" },
  { name: "SQL", icon: "🗄️" },
  { name: "DSA", icon: "🧩" },
  { name: "Git", icon: "🔀" },
  { name: "PHP", icon: "🐘" },
  { name: "C++", icon: "⚙️" },
];
// Same avatars as AVATARS in js/data.js.
const AVATARS = ["🦊", "🐢", "🦉", "🐙", "🐝", "🦖", "🐧", "🐲"];

class ValidationError extends Error {
  constructor(errors) {
    super(Object.values(errors)[0]);
    this.name = "ValidationError";
    this.status = 400;
    this.errors = errors;
  }
}

class ConflictError extends Error {
  constructor(errors) {
    super(Object.values(errors)[0]);
    this.name = "ConflictError";
    this.status = 409;
    this.errors = errors;
  }
}

class NotFoundError extends Error {
  constructor(message = "No student account was found.") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

const normalize = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();

function validateEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!email) throw new ValidationError({ email: "Enter your UNCC email." });
  if (email.length > 254 || !UNCC_EMAIL.test(email)) {
    throw new ValidationError({ email: "Git Good is for Niners only — use your @charlotte.edu or @uncc.edu email." });
  }
  return email;
}

function validateSignup(input) {
  const body = input && typeof input === "object" ? input : {};
  const errors = {};
  let email = "";
  try { email = validateEmail(body.email); } catch (err) { errors.email = err.errors.email; }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  if (!USERNAME.test(username)) errors.username = "3–18 letters, numbers or underscores.";

  const avatar = body.avatar === undefined ? AVATARS[0] : body.avatar;
  if (!AVATARS.includes(avatar)) errors.avatar = "Pick one of the avatars shown.";

  if (Object.keys(errors).length) throw new ValidationError(errors);
  return { email, username, avatar };
}

function validateSkills(value) {
  if (!Array.isArray(value)) throw new ValidationError({ skills: "Skills must be a list." });
  const seen = new Set();
  const skills = [];
  for (const raw of value) {
    const name = typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : "";
    if (!name || name.length > MAX_SKILL_NAME) {
      throw new ValidationError({ skills: `Each skill needs 1–${MAX_SKILL_NAME} characters.` });
    }
    const key = normalize(name);
    if (seen.has(key)) continue;
    seen.add(key);
    skills.push(name);
  }
  if (!skills.length) throw new ValidationError({ skills: "Pick at least one skill." });
  if (skills.length > MAX_SKILLS) throw new ValidationError({ skills: `Pick at most ${MAX_SKILLS} skills.` });
  return skills;
}

const profileInclude = {
  skills: { include: { skill: true }, orderBy: [{ selectedAt: "asc" }, { skillId: "asc" }] },
};

function toProfile(student) {
  return {
    id: student.id,
    email: student.email,
    username: student.username,
    avatar: student.avatar,
    createdAt: student.createdAt.toISOString(),
    skills: (student.skills || []).map(({ skill }) => ({ name: skill.name, icon: skill.icon, custom: Boolean(skill.ownerStudentId) })),
  };
}

// Prisma reports unique-constraint violations as P2002 with the column names in meta.target.
function conflictFromPrisma(err) {
  if (!err || err.code !== "P2002") return null;
  const target = [].concat((err.meta && err.meta.target) || []).join(",");
  if (target.includes("username")) return new ConflictError({ username: "That username is taken. Try another one." });
  return new ConflictError({ email: "That email already has an account." });
}

async function createStudent(prisma, input) {
  const data = validateSignup(input);
  const [byEmail, byUsername] = await Promise.all([
    prisma.student.findUnique({ where: { email: data.email }, select: { id: true } }),
    prisma.student.findUnique({ where: { username: data.username }, select: { id: true } }),
  ]);
  const errors = {};
  if (byEmail) errors.email = "That email already has an account.";
  if (byUsername) errors.username = "That username is taken. Try another one.";
  if (Object.keys(errors).length) throw new ConflictError(errors);

  try {
    const student = await prisma.student.create({ data, include: profileInclude });
    return toProfile(student);
  } catch (err) {
    throw conflictFromPrisma(err) || err;
  }
}

async function getStudent(prisma, id) {
  if (typeof id !== "string" || !id || id.length > 64) throw new NotFoundError();
  const student = await prisma.student.findUnique({ where: { id }, include: profileInclude });
  if (!student) throw new NotFoundError();
  return toProfile(student);
}

async function findStudentByEmail(prisma, rawEmail) {
  const email = validateEmail(rawEmail);
  const student = await prisma.student.findUnique({ where: { email }, include: profileInclude });
  if (!student) throw new NotFoundError("No account uses that email yet.");
  return toProfile(student);
}

// Built-in skills are shared rows (no owner); anything else is a custom skill owned by the student.
async function resolveSkill(tx, studentId, name) {
  const normalizedName = normalize(name);
  const builtIn = BUILT_IN_SKILLS.find((s) => normalize(s.name) === normalizedName);
  if (builtIn) {
    const existing = await tx.skill.findFirst({ where: { ownerStudentId: null, normalizedName } });
    if (existing) return existing;
    return tx.skill.create({ data: { name: builtIn.name, normalizedName, icon: builtIn.icon } });
  }
  return tx.skill.upsert({
    where: { ownerStudentId_normalizedName: { ownerStudentId: studentId, normalizedName } },
    update: {},
    create: { name, normalizedName, icon: "✨", ownerStudentId: studentId },
  });
}

async function setStudentSkills(prisma, id, rawSkills) {
  const skills = validateSkills(rawSkills);
  await getStudent(prisma, id); // 404 before writing anything
  await prisma.$transaction(async (tx) => {
    const rows = [];
    for (const name of skills) rows.push(await resolveSkill(tx, id, name));
    await tx.studentSkill.deleteMany({ where: { studentId: id } });
    // Stagger selectedAt by a millisecond so skills come back in the order they were picked.
    const start = Date.now();
    await tx.studentSkill.createMany({
      data: rows.map((skill, i) => ({ studentId: id, skillId: skill.id, selectedAt: new Date(start + i) })),
    });
  });
  return getStudent(prisma, id);
}

module.exports = {
  AVATARS,
  BUILT_IN_SKILLS,
  ConflictError,
  NotFoundError,
  ValidationError,
  createStudent,
  findStudentByEmail,
  getStudent,
  setStudentSkills,
  validateSignup,
  validateSkills,
};
