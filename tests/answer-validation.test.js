const test = require("node:test");
const assert = require("node:assert/strict");
const { QUESTS, answerIsAccepted } = require("./load-data")();

test("the Python countdown finale accepts any non-empty answer", () => {
  const quest = QUESTS["daily-py"];

  assert.equal(quest.acceptAny[0], false);
  assert.equal(quest.acceptAny[1], true);
  assert.equal(answerIsAccepted(quest.answers[1], "To the moon!", quest.acceptAny[1]), true);
  assert.equal(answerIsAccepted(quest.answers[1], "Liftoff", quest.acceptAny[1]), true);
  assert.equal(answerIsAccepted(quest.answers[1], "   ", quest.acceptAny[1]), false);
});

test("other answer blanks still require one of their accepted values", () => {
  assert.equal(answerIsAccepted(["0"], "0"), true);
  assert.equal(answerIsAccepted(["0"], "1"), false);
  assert.equal(answerIsAccepted(["<"], " < "), true);
});
