// Issue #44: input validation for the sign-up data-access layer. No database needed.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadData = require("./load-data");
const students = require("../server/students");

test("a UNCC sign-up is accepted and the email is normalized", () => {
  const data = students.validateSignup({ email: "  Maya.Chen@Charlotte.EDU ", username: "maya_codes", avatar: "🐢" });
  assert.deepEqual(data, { email: "maya.chen@charlotte.edu", username: "maya_codes", avatar: "🐢" });
});

test("a non-UNCC email is rejected with a clear message", () => {
  assert.throws(
    () => students.validateSignup({ email: "maya@gmail.com", username: "maya_codes" }),
    (err) => err instanceof students.ValidationError && err.status === 400 && /Niners only/.test(err.errors.email),
  );
});

test("every invalid sign-up field is reported at once", () => {
  assert.throws(
    () => students.validateSignup({ email: "", username: "a!", avatar: "💀" }),
    (err) => err instanceof students.ValidationError && ["email", "username", "avatar"].every((f) => err.errors[f]),
  );
});

test("usernames must be 3 to 18 letters, numbers or underscores", () => {
  for (const username of ["ab", "this_name_is_way_too_long", "has space", "semi;colon"]) {
    assert.throws(() => students.validateSignup({ email: "x@uncc.edu", username }), students.ValidationError);
  }
  assert.equal(students.validateSignup({ email: "x@uncc.edu", username: "abc_123" }).username, "abc_123");
});

test("skills are trimmed and de-duplicated, keeping the order picked", () => {
  assert.deepEqual(students.validateSkills([" Java ", "python", "Java", "Project  management"]), ["Java", "python", "Project management"]);
});

test("an empty, non-list or too-long skill list is rejected", () => {
  for (const bad of [[], "Python", [""], ["x".repeat(25)], Array.from({ length: 13 }, (_, i) => `Skill ${i}`)]) {
    assert.throws(() => students.validateSkills(bad), students.ValidationError);
  }
});

test("the server's built-in skills and avatars match the ones the screens show", () => {
  // JSON round-trip: the browser data is loaded in a separate VM context.
  const { SKILLS, AVATARS } = JSON.parse(JSON.stringify(loadData()));
  assert.deepEqual(students.BUILT_IN_SKILLS.map((s) => [s.name, s.icon]), SKILLS.map((s) => [s.id, s.icon]));
  assert.deepEqual(students.AVATARS, AVATARS);
});
