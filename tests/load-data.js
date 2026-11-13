// Loads js/data.js (a classic browser script) into a sandbox so tests can read its globals.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

module.exports = function loadData() {
  const src = fs.readFileSync(path.join(__dirname, "..", "js", "data.js"), "utf8");
  const names = ["SKILLS", "AVATARS", "QUESTS", "DAILY", "BADGES", "CLASSES", "DEFAULT_STATE", "FRESH_STATE", "answerIsAccepted", "firstQuestFor"];
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${src}\n;globalThis.__data = { ${names.join(", ")} };`, sandbox);
  return sandbox.__data;
};
