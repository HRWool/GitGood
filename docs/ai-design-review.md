# AI design review (Sprint 2)

Our data model, migrations, UML diagrams and much of the setup code were generated with AI help (GitHub Copilot Agent Mode with Figma MCP, and Claude Code), as described in the README's AI disclosure. The assignment asks us to review that output rather than accept it as-is. This page records the AI-generated design decisions the team reviewed, what was wrong or risky, and what we changed.

| # | AI-generated decision | Problem found in review | What we did | Where |
|---|---|---|---|---|
| 1 | One shared `Skill` table for built-in and custom skills, protected by `@@unique([ownerStudentId, normalizedName])` | Built-in skills have `ownerStudentId = NULL`. PostgreSQL treats every `NULL` as different, so the unique index does **not** stop two shared "Python" rows from being created. The generated schema looked safe but wasn't. | The data-access layer looks up a shared skill by `normalizedName` before creating it, so built-in skills are reused instead of duplicated. Custom skills keep the unique index, which works because they always have an owner. | `server/students.js` (`resolveSkill`), test "saving skills links built-in skills…" |
| 2 | Badge progress (`have`) stored on the shared badge definitions in `js/data.js` | Progress belongs to a student, not to a badge. Stored on the definition, every student would share the same progress, and it didn't match the schema, which keeps `Badge` and `StudentBadge` separate. | Moved progress into per-student state (`badgeProgress`) and kept badge definitions student-free, matching the `Badge` / `StudentBadge` split. | `js/data.js`, `js/app.js` (commit cb55b40), `tests/student-state.test.js` |
| 3 | Two database setups: a raw SQL schema and seed (`db/schema.sql`, database `gitgood_dev`) and a Prisma schema with migrations (database `gitgood`) | Two sources of truth for the same tables meant teammates' databases could drift apart, and the raw SQL wasn't used by the ORM. | Kept Prisma as the single source of truth, deleted the raw SQL files, and rewrote the setup guide around `npm run db:setup`. | PR #41, PR #42, `docs/database-setup.md` |
| 4 | Seed script that writes sample rows to whatever `DATABASE_URL` points at | Running it against the wrong database (a teammate's, or a future hosted one) would overwrite real data. | The seed only runs on a local database named `gitgood`, and the automated tests only run on a local database whose name ends in `_test`. | `prisma/seed.js`, `prisma/test-database.js` |
| 5 | UML sequence diagram for "start an assignment or quiz" | It described a target design that the app doesn't implement, so it didn't accurately represent our implementation. | Added a sequence diagram for the story we built (sign-up and skills saved to PostgreSQL), traced against the actual API routes and Prisma calls. The quiz diagram is kept as a planned design. | `docs/uml/sequence-save-signup.puml`, `docs/uml/sequence-start-quiz.puml` |

## What we kept, and why

- **Derived totals instead of stored counters.** The generated schema records XP, quest attempts and inventory as dated transaction rows (`XpTransaction`, `QuestAttempt`, `InventoryTransaction`) rather than single counters on `Student`. We kept this: totals, streaks and ranks can be recalculated and audited, and they can't drift out of sync.
- **Rules the schema can't enforce.** The three-quest daily limit, the three pinned badges limit, and friend-pair ordering span several rows, so they belong in application code. They are listed in the README's data model section for the backend to enforce.

## Follow-up

- Add a partial unique index for shared skills (`CREATE UNIQUE INDEX … ON "Skill"("normalizedName") WHERE "ownerStudentId" IS NULL`) in a raw-SQL Prisma migration next sprint, so the database enforces item 1 as well as the code.
