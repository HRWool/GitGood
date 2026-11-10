// Issue #5: student-facing data follows the shared model in js/data.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const { BADGES, DEFAULT_STATE, FRESH_STATE, QUESTS, SKILLS } = require("./load-data")();

test("each exercise quest contains the fields used by student screens", () => {
  const skillIds = SKILLS.map(({ id }) => id);
  for (const [id, quest] of Object.entries(QUESTS)) {
    assert.ok(skillIds.includes(quest.skill), `${id} has unknown skill ${quest.skill}`);
    assert.equal(typeof quest.level, "string", `${id} has no level`);
    assert.ok(Number.isFinite(quest.xp), `${id} has no XP value`);
    assert.ok(Number.isFinite(quest.minutes), `${id} has no duration`);
    assert.ok(Array.isArray(quest.practiced) && quest.practiced.length > 0, `${id} has no practiced concepts`);
  }
});

test("each badge has stable identity, category, requirement and a goal when it tracks progress", () => {
  for (const badge of BADGES) {
    assert.ok(badge.id, "badge has no id");
    assert.ok(badge.name, `${badge.id} has no name`);
    assert.ok(badge.type, `${badge.id} has no type`);
    assert.ok(badge.requirement, `${badge.id} has no requirement`);
    assert.equal(Object.hasOwn(badge, "have"), false, `${badge.id} stores student progress in the catalog`);
    if (badge.goal) assert.ok(badge.goal > 0, `${badge.id} has an invalid goal`);
  }
});

test("fresh and week-in accounts carry their own student and badge progress", () => {
  assert.deepEqual([...Object.keys(FRESH_STATE)].sort(), [...Object.keys(DEFAULT_STATE)].sort());
  assert.deepEqual([...Object.keys(FRESH_STATE.prefs)].sort(), [...Object.keys(DEFAULT_STATE.prefs)].sort());
  assert.deepEqual([...Object.keys(FRESH_STATE.friends)].sort(), [...Object.keys(DEFAULT_STATE.friends)].sort());
  assert.equal(FRESH_STATE.fresh, true);
  assert.equal(FRESH_STATE.xp, 0);
  assert.equal(FRESH_STATE.skills.length, 0);
  assert.equal(FRESH_STATE.earned.length, 0);
  assert.equal(DEFAULT_STATE.fresh, false);
  assert.ok(DEFAULT_STATE.xp > 0);
  assert.ok(DEFAULT_STATE.skills.length > 0);
  assert.ok(DEFAULT_STATE.earned.length > 0);

  for (const badge of BADGES.filter((entry) => entry.goal && entry.track !== "streak")) {
    assert.ok(Object.hasOwn(FRESH_STATE.badgeProgress, badge.id), `fresh state omits ${badge.id} progress`);
    assert.ok(Object.hasOwn(DEFAULT_STATE.badgeProgress, badge.id), "week-in state omits " + badge.id + " progress");
  }
});
