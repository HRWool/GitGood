// Issue #44: the sign-up API and data-access layer against a real PostgreSQL test database.
// Needs TEST_DATABASE_URL pointing at a local *_test database (see docs/database-setup.md);
// without it the database tests are skipped. The error-handling tests at the bottom always run.
const test = require("node:test");
const assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");
const { createServer } = require("../server/app");
const students = require("../server/students");
const { testDatabaseUrl } = require("../prisma/test-database");

const { url: TEST_URL, reason } = testDatabaseUrl();
const skip = TEST_URL ? false : `no test database: ${reason}`;
const run = Date.now().toString(36).slice(-6);
const email = (name) => `${name}.${run}@charlotte.edu`;
const username = (name) => `${name}_${run}`.slice(0, 18);

// Starts the real HTTP server on a free port and returns a small fetch helper.
async function startServer(prisma) {
  const server = createServer(prisma);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, body) => {
    const res = await fetch(base + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  };
  return { call, close: () => new Promise((resolve) => server.close(resolve)) };
}

test.describe("sign-up saved in PostgreSQL", { skip }, () => {
  let prisma;
  let api;

  test.before(async () => {
    prisma = new PrismaClient({ datasourceUrl: TEST_URL });
    api = await startServer(prisma);
  });
  test.after(async () => {
    // Remove only the rows this run created (custom skills cascade with their student).
    await prisma.student.deleteMany({ where: { email: { contains: `.${run}@` } } });
    await api.close();
    await prisma.$disconnect();
  });

  test("creating a student saves it and a new client reads it back", async () => {
    const created = await students.createStudent(prisma, { email: email("Ava").toUpperCase(), username: username("ava"), avatar: "🦉", password: "ava-password" });
    assert.equal(created.email, email("ava"));
    assert.deepEqual(created.skills, []);

    // A separate PrismaClient is a fresh connection, like the app after a restart.
    const restarted = new PrismaClient({ datasourceUrl: TEST_URL });
    try {
      const row = await restarted.student.findUnique({ where: { id: created.id } });
      assert.equal(row.username, username("ava"));
      assert.equal(row.avatar, "🦉");
      assert.notEqual(row.passwordHash, "ava-password");
    } finally {
      await restarted.$disconnect();
    }
  });

  test("a duplicate email or username is rejected and nothing extra is saved", async () => {
    await students.createStudent(prisma, { email: email("ben"), username: username("ben"), password: "ben-password" });
    await assert.rejects(
      students.createStudent(prisma, { email: email("ben"), username: username("ben2"), password: "ben-password" }),
      (err) => err instanceof students.ConflictError && Boolean(err.errors.email),
    );
    await assert.rejects(
      students.createStudent(prisma, { email: email("ben3"), username: username("ben"), password: "ben-password" }),
      (err) => err instanceof students.ConflictError && Boolean(err.errors.username),
    );
    assert.equal(await prisma.student.count({ where: { email: { in: [email("ben"), email("ben3")] } } }), 1);
  });

  test("saving skills links built-in skills and creates the student's custom skill", async () => {
    const student = await students.createStudent(prisma, { email: email("cam"), username: username("cam"), password: "cam-password" });
    const saved = await students.setStudentSkills(prisma, student.id, ["Java", "sql", "Project management"]);
    assert.deepEqual(saved.skills.map((s) => [s.name, s.custom]), [["Java", false], ["SQL", false], ["Project management", true]]);

    // Replacing the list removes skills that were unpicked.
    const updated = await students.setStudentSkills(prisma, student.id, ["Python"]);
    assert.deepEqual(updated.skills.map((s) => s.name), ["Python"]);
    assert.equal(await prisma.studentSkill.count({ where: { studentId: student.id } }), 1);
  });

  test("invalid skills leave the saved skills unchanged", async () => {
    const student = await students.createStudent(prisma, { email: email("dee"), username: username("dee"), password: "dee-password" });
    await students.setStudentSkills(prisma, student.id, ["Web"]);
    await assert.rejects(students.setStudentSkills(prisma, student.id, []), students.ValidationError);
    await assert.rejects(students.setStudentSkills(prisma, student.id, ["x".repeat(30)]), students.ValidationError);
    assert.deepEqual((await students.getStudent(prisma, student.id)).skills.map((s) => s.name), ["Web"]);
  });

  test("looking up a student that does not exist is a not-found error", async () => {
    await assert.rejects(students.getStudent(prisma, "no-such-student"), students.NotFoundError);
    await assert.rejects(students.setStudentSkills(prisma, "no-such-student", ["Java"]), students.NotFoundError);
  });

  test("API: sign up, sign in, and save selected skills", async () => {
    const signup = await api.call("POST", "/api/students", { email: email("eli"), username: username("eli"), avatar: "🐙", password: "eli-password" });
    assert.equal(signup.status, 201);
    const { id } = signup.body.student;
    assert.equal("passwordHash" in signup.body.student, false);

    const login = await api.call("POST", "/api/auth/login", { email: email("eli"), password: "eli-password" });
    assert.equal(login.status, 200);
    assert.equal(login.body.student.id, id);
    const denied = await api.call("POST", "/api/auth/login", { email: email("eli"), password: "wrong-password" });
    assert.equal(denied.status, 401);

    const skills = await api.call("PUT", `/api/students/${id}/skills`, { skills: ["Git", "DSA"] });
    assert.equal(skills.status, 200);
    assert.deepEqual(skills.body.student.skills.map((s) => s.name), ["Git", "DSA"]);

    const byId = await api.call("GET", `/api/students/${id}`);
    assert.equal(byId.status, 200);
    assert.equal(byId.body.student.username, username("eli"));
    assert.deepEqual(byId.body.student.skills.map((s) => s.name), ["Git", "DSA"]);

  });

  test("API: invalid and duplicate sign-ups get 400 and 409 with field messages", async () => {
    const bad = await api.call("POST", "/api/students", { email: "eli@gmail.com", username: "x" });
    assert.equal(bad.status, 400);
    assert.ok(bad.body.errors.email && bad.body.errors.username);

    await api.call("POST", "/api/students", { email: email("fay"), username: username("fay"), password: "fay-password" });
    const dup = await api.call("POST", "/api/students", { email: email("fay"), username: username("fay"), password: "fay-password" });
    assert.equal(dup.status, 409);
    assert.ok(dup.body.errors.email && dup.body.errors.username);

    const missing = await api.call("GET", "/api/students/no-such-student");
    assert.equal(missing.status, 404);
  });
});

test.describe("API error handling without a database", () => {
  // Port 1 refuses connections, so every query fails the way it would if PostgreSQL were stopped.
  const offline = new PrismaClient({ datasourceUrl: "postgresql://nobody:nopass@127.0.0.1:1/gitgood_test" });
  let api;
  test.before(async () => { api = await startServer(offline); });
  test.after(async () => { await api.close(); await offline.$disconnect(); });

  test("sign-up returns 503 with a clear message when the database is down", async () => {
    const res = await api.call("POST", "/api/students", { email: "gus@charlotte.edu", username: "gus_test", password: "gus-password" });
    assert.equal(res.status, 503);
    assert.match(res.body.error, /database is not reachable/);
  });

  test("sign-in returns 503 with a clear message when the database is down", async () => {
    const res = await api.call("POST", "/api/auth/login", { email: "gus@charlotte.edu", password: "gus-password" });
    assert.equal(res.status, 503);
    assert.match(res.body.error, /database is not reachable/);
  });

  test("invalid input is rejected before the database is used", async () => {
    const res = await api.call("POST", "/api/students", { email: "gus@gmail.com", username: "gus_test" });
    assert.equal(res.status, 400);
    assert.match(res.body.errors.email, /Niners only/);
  });

  test("a malformed JSON body is a 400, not a crash", async () => {
    const res = await api.call("POST", "/api/students", "{not json");
    assert.equal(res.status, 400);
    assert.match(res.body.error, /valid JSON/);
  });

  test("the health check reports the database as down", async () => {
    const res = await api.call("GET", "/api/health");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true, database: false });
  });
});
