// Issue #1: the reward screen lists the skills practiced in each quest.
const test = require("node:test");
const assert = require("node:assert/strict");
const { SKILLS, QUESTS } = require("./load-data")();

const skillIds = SKILLS.map((s) => s.id);

for (const [id, q] of Object.entries(QUESTS)) {
  test(`quest "${id}" lists the skills it practices`, () => {
    assert.ok(skillIds.includes(q.skill), `${id} has unknown skill ${q.skill}`);
    assert.ok(Array.isArray(q.practiced) && q.practiced.length > 0, `${id} has no practiced concepts`);
    for (const c of q.practiced) assert.equal(typeof c, "string");
    assert.equal(new Set(q.practiced).size, q.practiced.length, `${id} repeats a concept`);
  });
}
