// Issue #5: fresh and fast-forward accounts use the same persistent student state.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createApp(savedState) {
  const storage = savedState ? { "gitgood-demo-v1": JSON.stringify(savedState) } : {};
  const sandbox = {
    document: { readyState: "loading", addEventListener() {} },
    location: { href: "" },
    localStorage: {
      getItem: (key) => storage[key] || null,
      setItem: (key, value) => { storage[key] = value; },
      removeItem: (key) => { delete storage[key]; },
    },
  };
  vm.createContext(sandbox);
  for (const file of ["data.js", "app.js"]) {
    const source = fs.readFileSync(path.join(__dirname, "..", "js", file), "utf8");
    vm.runInContext(source, sandbox);
  }
  vm.runInContext("globalThis.__GG = GG;", sandbox);
  return { GG: sandbox.__GG, storage };
}

test("fast-forward preserves the student profile and resets to the shared week-in model", () => {
  const { GG, storage } = createApp();
  GG.startFresh({ name: "Test Student", username: "test_student", email: "student@charlotte.edu", avatar: "🐢", skills: ["Java"] });
  assert.equal(GG.state.fresh, true);
  assert.equal(GG.state.xp, 0);

  GG.fastForward();
  assert.equal(GG.state.fresh, false);
  assert.equal(GG.state.name, "Test Student");
  assert.equal(GG.state.username, "test_student");
  assert.equal(GG.state.skills[0], "Java");
  assert.ok(GG.state.xp > 0);
  assert.equal(JSON.parse(storage["gitgood-demo-v1"]).name, "Test Student");
});

test("badge progress is saved per student and initialized for legacy localStorage", () => {
  const { GG } = createApp({ name: "Legacy Student", xp: 15 });
  assert.equal(GG.state.badgeProgress["speed-runner"], 4);
  GG.completeQuest("class-timed");
  assert.equal(GG.state.badgeProgress["speed-runner"], 5);

  GG.startFresh({ name: "New Student", skills: ["Python"] });
  assert.equal(GG.state.badgeProgress["speed-runner"], 0);
  GG.completeQuest("class-timed");
  assert.equal(GG.state.badgeProgress["speed-runner"], 1);
});

test("legacy fresh accounts do not inherit seeded demo badge progress", () => {
  const { GG } = createApp({ fresh: true, name: "Fresh Student", xp: 0 });
  assert.equal(GG.state.badgeProgress["speed-runner"], 0);
  assert.equal(GG.state.badgeProgress.helper, 0);
});
