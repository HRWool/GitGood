<p align="center"><img src="assets/logo.svg" width="520" alt="Git Good — Quit Forking Around."></p>

# Git Good — *Quit Forking Around.*

**ITSC 3155 Software Engineering · UNC Charlotte · Fall 2026 · Group 7**

Git Good is a gamified coding-practice app, just for UNCC computing students, that turns short daily practice into a habit and lets students earn shareable proof of their progress.

### ▶ Live prototype: **https://hrwool.github.io/GitGood/**
### 🗂 Sprint documents (standups + retro): **[Sprint Documents](Sprint%20Documents/)**
### ✅ Sprint 1 testing evidence: **[docs/testing-evidence.md](docs/testing-evidence.md)**
### 🗄️ Sprint 2 database setup: **[docs/database-setup.md](docs/database-setup.md)** · AI design review: **[docs/ai-design-review.md](docs/ai-design-review.md)**
### 📖 Design story (storyboard + sketches): **https://hrwool.github.io/GitGood/story**

This is a **clickable prototype** for collecting feedback. Every link works, and progress (XP, streak, badges) is saved in your browser. When you run it locally with `npm start`, sign-up, chosen skills and the Profile screen are saved in and loaded from a PostgreSQL database (Sprint 2, #44). The GitHub Pages site has no server, so there everything stays in the browser.

- On a laptop, the app sits inside a phone frame. The left panel jumps to any screen, and the right panel lists feedback questions for that screen.
- On a phone, it runs full-screen. Tap **☰ Screens** to jump around.
- **⏩ Fast-forward one week** loads a week-in account with a streak, ranks and badges. **↺ Restart demo** starts over.

## Demo script (persona: Maya, busy CS sophomore)

| # | Screen | What to try |
|---|---|---|
| 1 | [Welcome](https://hrwool.github.io/GitGood/) | Get started |
| 2 | [Sign up](https://hrwool.github.io/GitGood/signup.html) | Try a `@gmail.com` email (rejected), then a `@charlotte.edu` one |
| 3 | [Pick skills](https://hrwool.github.io/GitGood/skills.html) | Choose skills, add a custom one |
| 4 | [First quest](https://hrwool.github.io/GitGood/quiz-intro.html) | Customer-story intro (skippable) |
| 5 | [Exercise](https://hrwool.github.io/GitGood/exercise.html?q=first) | Fill the blanks (`orders`, `+=`), Run → confetti, XP, mystery chest, first badge |
| 6 | [Home](https://hrwool.github.io/GitGood/home.html) | Start the featured quest; expand “Today's other quests” and “Explore more” for the rest |
| 7 | [Notifications](https://hrwool.github.io/GitGood/notifications.html) | Toggle reminder types |
| 8 | [Profile](https://hrwool.github.io/GitGood/profile.html) | Add a skill, pin badges |
| 9 | [Classrooms](https://hrwool.github.io/GitGood/classes.html) | AI-led seasonal classes; one is recommended |
| 10 | [Class home](https://hrwool.github.io/GitGood/class.html?c=python) | Prof. Byte's weekly quests, class standing |
| 11 | [Season results](https://hrwool.github.io/GitGood/season.html) | Top-3 badge → share / pick Season 2 |
| 12 | [Leaderboard](https://hrwool.github.io/GitGood/leaderboard.html) | "40 XP to pass Sam" → Start the suggested quest → "You moved to #11" |
| 13 | [Achievements](https://hrwool.github.io/GitGood/achievements.html) | Tap badges, Share → copy link / QR |
| 14 | [Verify page](https://hrwool.github.io/GitGood/verify.html) | What an employer sees |
| 15 | [Design story](https://hrwool.github.io/GitGood/storyboard.html) | Storyboard + sketches behind each screen |

## Team and Scrum roles

| Member | GitHub | Features designed |
|---|---|---|
| AJ Blocker | [@ajblocker](https://github.com/ajblocker) | Profile, Streaks page |
| Athena Deese | [@Athena-Deese](https://github.com/Athena-Deese) | Quest page, Pathway |
| Heidi Wooldridge | [@HRWool](https://github.com/HRWool) | Achievements, Leaderboard, Classrooms |
| Idol Hunter | [@ThatsIdol](https://github.com/ThatsIdol) | Skill quiz, Streak notifications |

We share the Scrum roles instead of giving each one to a single person. Every member has held every role at some point, and we rotate them from sprint to sprint.

| Scrum role | Held by | What it looks like on our team |
|---|---|---|
| Product Owner | Shared: AJ, Athena, Heidi, Idol | Everyone writes and refines user stories from the user tests, and we prioritize the backlog together at sprint planning. |
| Scrum Master | Shared, rotating: AJ, Athena, Heidi, Idol | Whoever is up that sprint runs the standups, keeps the Project board current, and clears blockers. |
| Development Team | AJ, Athena, Heidi, Idol | Everyone takes issues, builds on a feature branch, and reviews each other's pull requests. |

## Engagement research behind the design
- **Streaks and streak-saver reminders** are Duolingo's strongest retention levers → streak calendar, at-risk banner, streak freezes.
- **Hook Model** (Nir Eyal): trigger → action → variable reward → investment → customer-request reminders, 5-minute quests, mystery chest, skills/avatar/pinned badges.
- **Self-Determination Theory**: competence, autonomy, relatedness → levels and progress bars, user choice everywhere, class and friend boards.
- **Leaderboards motivate when they feel winnable** → centered on your neighbors, exact XP gap, weekly and seasonal resets.

## Tech
Plain HTML, CSS and vanilla JS with no build step, hosted on GitHub Pages.
- `css/style.css`: design tokens and components (UNCC green `#005035` and gold `#B3A369`, plus brighter accents)
- `js/data.js`: seed data (quests, classrooms, badges, leaderboards, screen list) and the daily-quest filter
- `js/app.js`: shared state (localStorage), the `GG.api` client for the database API, bottom nav, demo panels, toasts, sheets, confetti
- `server/`: a small Node server (`npm start`) that serves the site and a JSON API. `server/students.js` is the data-access layer; it uses the Prisma client to read and write PostgreSQL
- `prisma/`: the Prisma schema, migrations, seed and connection check
- `tests/`: unit tests that use Node's built-in test runner
- `eslint.config.mjs`: lint rules for `js/` and the inline scripts in every page



### Data model
The PostgreSQL/Prisma schema is in [`prisma/schema.prisma`](prisma/schema.prisma) (30 models, applied by the migration in `prisma/migrations/`). Sprint 2 connects the first user story to it: **sign-up and skills (#44)** are saved as `Student`, `Skill` and `StudentSkill` rows through these API routes:

| Route | What it does |
|---|---|
| `POST /api/students` | Validates and creates a student (UNCC email, 3–18 character username, avatar). 400 for invalid input, 409 if the email or username is taken. |
| `PUT /api/students/:id/skills` | Replaces the student's skills. Built-in skills reuse shared `Skill` rows; custom skills become the student's own `Skill`. |
| `GET /api/students/:id` | Loads the profile and skills (used by the Profile screen). |
| `GET /api/students?email=` | Finds a saved account by email ("Load my saved account" on the sign-up screen). |
| `GET /api/health` | Reports whether the database is reachable. |

If PostgreSQL is down, the API answers 503 and the screens show a message. Everything else in the prototype is still simulated in localStorage. These objects in `js/data.js` are that simulated data:
- **Student state** (`DEFAULT_STATE` / `FRESH_STATE`) contains `onboarded`, `fresh`, `name`, `username`, `email`, `avatar`, selected `skills`, `xp`, `classXp`, current `streak`, `bestStreak`, the seven-day Monday-to-Sunday `week` array, `freezes`, earned badge IDs and `earnedOn` dates, `justUnlocked`, `newBadge`, pinned badge IDs, `doneToday` quest IDs, `classDone` quest IDs, `questsTotal`, per-student `badgeProgress`, `joinedClass`, notification `prefs` (`streak`, `quest`, `leaderboard`), friend `invites` / `accepted` / `pending` lists, and `lastRankMove` (`from` / `to`). Pending invites contain `name` and `sentOn`. `js/app.js` loads, updates, and saves this shared state in localStorage; badge definitions contain no student-specific progress.
- **Skill** (`SKILLS`): `id` and `icon`.
- **Quest** (`QUESTS`): `title`, `skill`, `level`, `xp`, `minutes`, `practiced` concepts, `icon`, customer `speaker` (`name`, `who`, `role`) and `story`, exercise `prompt`, `code`, accepted `answers`, `tests`, `hint`, and optional `acceptAny`, `timed`, `badge`, `next`, `classQuest`, and `fromLeaderboard` fields. `DAILY` stores quest IDs.
- **Badge** (`BADGES`): `id`, `name`, `icon`, `type`, `requirement`, and `slug`; progress badges also have a numeric `goal` and optional `track`. The student's current amount is held in `state.badgeProgress` or derived from the student's streak.
- **Classroom** (`CLASSES`): `id`, `name`, `level`, `members`, `icon`, `color`, associated `skill`, `topic`, current `week` and total `weeks`, instructor message (`byte`), optional `locked`, `dark`, and `rotatedOut` flags, and `quests` (`id`, `title`, `meta`, `q`). `LB_APP`, `LB_CLASS`, and `LB_FRIENDS` contain sample `[name, avatar, xp]` rows; `FEED` contains sample `[avatar, name, activity]` rows.

XP totals, streaks, ranks, and badge progress are intended to be derived from dated activity and transaction records rather than stored as independent counters. The schema provides relations and uniqueness constraints; domain checks that span multiple rows (such as the three-quest daily limit, badge pin limit, friendship-pair ordering, valid classroom completion, and nonnegative inventory balances) must be enforced transactionally by the future backend. Normalize emails, usernames, and custom skill names before writes. Learning paths and leaderboard snapshots are included as schema support for the screens' existing previews.

UML documentation: [domain class diagram](docs/uml/class-diagram.svg) ([PlantUML source](docs/uml/class-diagram.puml)), the [save-sign-up sequence diagram](docs/uml/sequence-save-signup.svg) for the implemented story ([PlantUML source](docs/uml/sequence-save-signup.puml)), and the planned [start-quiz sequence diagram](docs/uml/sequence-start-quiz.svg) ([PlantUML source](docs/uml/sequence-start-quiz.puml)). AI-generated design decisions we reviewed and corrected are in [docs/ai-design-review.md](docs/ai-design-review.md).

## Run it locally
You need Node.js 18+ and PostgreSQL. Set up the database once by following [docs/database-setup.md](docs/database-setup.md), then:

```bash
git clone https://github.com/HRWool/GitGood.git
cd GitGood
npm install
cp .env.example .env    # then put your local gitgood_app password in .env (keep it private)
npm run db:setup        # generate the Prisma client, apply migrations, seed, check the connection
npm start               # site + database API
```
Open http://localhost:8000 and sign up. Your account and skills are saved in PostgreSQL; the Profile screen says **"Saved in the database"**. Stop the server (Ctrl+C) and run `npm start` again: the account is still there. On a cleared browser, enter the same email on the sign-up screen and press **Load my saved account**.

To look at the screens without a database, `npm run start:static` (Python 3) serves the site the way GitHub Pages does, with everything saved in the browser.

`npm run db:setup` refuses to seed anything but a local database named `gitgood`. Individual commands are `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, and `npm run db:check`.

## Implemented features (Sprint 1)
| Issue | Feature | Pull request |
|---|---|---|
| #1 | **Skills practiced summary.** After passing a quest, the reward screen lists the quest's skill and the concepts it covered, so students can review them before pressing Continue. | #9 |
| #3 | **Quests match your skills.** Daily quests come only from the skills picked at sign-up or added on Profile. With several skills, quests take turns between them (up to 3 a day). If none of your skills have quests yet, Home says so. | #10 |
| #2 | **Decluttered home dashboard.** One featured quest, with the rest tucked into expandable sections. | committed to `main` |
| #6 | **Friend invites** on the Friends leaderboard. | committed to `main` |
| #7 | **Linting** with ESLint. | #8 |

## Testing
📸 **[Testing evidence with screenshots](docs/testing-evidence.md)**: every acceptance criterion for Sprint 1, with the screenshot or test that shows it was met.

**Automated**
```bash
npm test          # unit tests (node --test "tests/*.test.js")
npm run lint      # ESLint; must report 0 problems
```
- `tests/skills-practiced.test.js` (#1): every quest has a known skill and a non-empty, unique list of practiced concepts.
- `tests/daily-quests.test.js` (#3): only selected skills are used, several skills take turns, the 3-a-day cap holds, changing skills updates the quests, and custom, unknown or missing skills are ignored.
- `tests/student-validation.test.js` (#44): sign-up and skill validation (UNCC email, username rules, skill list limits), and that the server's skills and avatars match the screens.
- `tests/students-api.test.js` (#44): against a real PostgreSQL **test** database: creating a student and reading it back on a new connection, duplicate email/username (409), saving built-in and custom skills, invalid skills leaving data unchanged, not-found lookups, and the full sign-up → skills → profile API flow. Error handling that runs without any database: 503 when PostgreSQL is down, 400 for invalid input and malformed JSON.

The database tests need a separate local database named `gitgood_test` (see [docs/database-setup.md](docs/database-setup.md#automated-tests-and-the-test-database)); without it they are skipped and everything else still runs.

**Manual (acceptance criteria)**
1. **#1:** Open `exercise.html?q=first`, type `orders` and `+=`, and press Run. The reward screen shows **Skills practiced: Python · for loops · lists · running totals** and stays open until you press Continue.
2. **#3:** Press **↺ Restart demo**, sign up with a `@charlotte.edu` email, and pick only **Java**. Home offers only the Java quest. On Profile, add **SQL**. Home now offers Java and SQL.
3. **#3, no matches:** Sign up and pick only a custom skill (for example "React"). Home shows "No daily quests yet" with an **Add a skill** button.

## AI usage disclosure
Each team member lists the AI tools they used, what the tools helped with, and how they checked the results. Our professor told us the goal is to show the development workflow. Which tools we use matters less.

### Heidi W.
- **Tools:** Claude Code (Anthropic). I also connected GitHub Copilot, VS Code and the Figma MCP server, following the Sprint 1 setup.
- **What they helped with:**
  - building and refining the clickable prototype
  - writing and refining the Sprint 1 user stories (#1 to #7)
  - setting up ESLint (#8)
  - implementing and testing #1 and #3 (#9, #10)
  - writing the README (#11, #12)
- **How I checked the results:** I checked each change against its issue's acceptance criteria, ran the app in a browser, ran `npm run lint` and `npm test`, and reviewed the pull request before merging.
- **Commit history:** commits authored by **Claude** (the `claude` GitHub account) were made by Claude Code on Heidi's behalf, in her pull requests. She reviewed and merged each one.

### AJ B.
- **Tools:** VS Code, GitHub Copilot and the Figma MCP server, set up following the Sprint 1 instructions.
- **What they helped with:** decluttering the home dashboard (#2, commit 37fe499).
- **How I checked the results:** After changing and implementing the results, I verified the UI changes made within vsCode internal browser to make sure each component was still working and coherent within the prototype

### Athena D.
- **Tools:** VSCode (Microsoft), GitHub Copilot (Set up as listed)
- **What they helped with:** Introduced idea to declutter the UI, created the friend invite system.
- **How I checked the results:** Manually checked against the acceptance criteria to make sure that the addition was working. Checked adding a friend, checked the friend appearing, checked multiple friend additions, checked if friends remain after refresh.

### Idol H.
- **Tools:** Visual Studio Code, GitHub Copilot
- **What they helped with:**
  - suggested and implemented user interface changes to reduce visual clutter based on user story
  - some changes were made manually by myself
- **How I checked the results:**
  - previewed changes in the browser and compared against acceptance criteria
  - verified changes did not affect other features
