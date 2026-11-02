// Issue #3: daily quests match the skills the student selected.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(
  `${fs.readFileSync(path.join(__dirname, "..", "js", "data.js"), "utf8")}
  ;globalThis.__data = { SKILLS, QUESTS, DAILY, dailyQuestsFor };`,
  sandbox
);
const { SKILLS, QUESTS, DAILY } = sandbox.__data;
// Copy results into this realm so deepEqual compares plain arrays.
const dailyQuestsFor = (...args) => [...sandbox.__data.dailyQuestsFor(...args)];
const skillOf = (ids) => ids.map((id) => QUESTS[id].skill);

test("every built-in skill has at least one daily quest", () => {
  for (const s of SKILLS) assert.ok(DAILY.some((id) => QUESTS[id].skill === s.id), `no daily quest for ${s.id}`);
});

test("only returns quests from the selected skills", () => {
  for (const skills of [["Python"], ["Java"], ["Web", "Git"], ["SQL", "DSA", "C++"]]) {
    for (const s of skillOf(dailyQuestsFor(skills))) assert.ok(skills.includes(s), `${s} not in ${skills}`);
  }
});

test("handles multiple skills by giving each one a turn", () => {
  assert.deepEqual(skillOf(dailyQuestsFor(["Python", "Web"])), ["Python", "Web"]);
  assert.deepEqual(skillOf(dailyQuestsFor(["SQL", "DSA", "C++"])), ["SQL", "DSA", "C++"]);
});

test("caps the day at three quests", () => {
  assert.equal(dailyQuestsFor(SKILLS.map((s) => s.id)).length, 3);
});

test("follows the current skills when they change", () => {
  assert.deepEqual(skillOf(dailyQuestsFor(["Python"])), ["Python"]);
  assert.deepEqual(skillOf(dailyQuestsFor(["Python", "Java"])), ["Python", "Java"]);
});

test("ignores custom, unknown, duplicate and missing skills", () => {
  assert.deepEqual(dailyQuestsFor(["React"]), []);
  assert.deepEqual(dailyQuestsFor([]), []);
  assert.deepEqual(dailyQuestsFor(undefined), []);
  assert.deepEqual(skillOf(dailyQuestsFor(["Java", "Java", "React"])), ["Java"]);
});
