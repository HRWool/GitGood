# Git Good — *Quit Forking Around.*

**ITSC 3155 Software Engineering · UNC Charlotte · Fall 2026 · Group 7**

Git Good is a gamified coding-practice app, just for UNCC computing students, that turns short daily practice into a habit and lets students earn shareable proof of their progress.

### ▶ Live prototype: **https://hrwool.github.io/GitGood/**

This is a **clickable prototype** for collecting feedback. Every link works, and progress (XP, streak, badges) is saved in your browser. There's no backend; all data is simulated.

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
| 6 | [Home](https://hrwool.github.io/GitGood/home.html) | Streak, daily goal, quests, pathway, live feed |
| 7 | [Notifications](https://hrwool.github.io/GitGood/notifications.html) | Toggle reminder types |
| 8 | [Profile](https://hrwool.github.io/GitGood/profile.html) | Add a skill, pin badges |
| 9 | [Classrooms](https://hrwool.github.io/GitGood/classes.html) | AI-led seasonal classes; one is recommended |
| 10 | [Class home](https://hrwool.github.io/GitGood/class.html?c=python) | Prof. Byte's weekly quests, class standing |
| 11 | [Season results](https://hrwool.github.io/GitGood/season.html) | Top-3 badge → share / pick Season 2 |
| 12 | [Leaderboard](https://hrwool.github.io/GitGood/leaderboard.html) | "40 XP to pass Sam" → Start the suggested quest → "You moved to #11" |
| 13 | [Achievements](https://hrwool.github.io/GitGood/achievements.html) | Tap badges, Share → copy link / QR |
| 14 | [Verify page](https://hrwool.github.io/GitGood/verify.html?a=7f3k) | What an employer sees |
| 15 | [Design story](https://hrwool.github.io/GitGood/storyboard.html) | Storyboard + sketches behind each screen |

## Team

| Member | Features designed |
|---|---|
| Heidi W. | Achievements, Leaderboard, Classrooms (+ this prototype) |
| Idol H. | Skill quiz, Streak notifications |
| Athena D. | Quest page, Pathway |
| AJ B. | Profile, Streaks page |

## Engagement research behind the design
- **Streaks and streak-saver reminders** are Duolingo's strongest retention levers → streak calendar, at-risk banner, streak freezes.
- **Hook Model** (Nir Eyal): trigger → action → variable reward → investment → customer-request reminders, 5-minute quests, mystery chest, skills/avatar/pinned badges.
- **Self-Determination Theory**: competence, autonomy, relatedness → levels and progress bars, user choice everywhere, class and friend boards.
- **Leaderboards motivate when they feel winnable** → centered on your neighbors, exact XP gap, weekly and seasonal resets.

## Tech
Plain HTML, CSS and vanilla JS with no build step, hosted on GitHub Pages.
- `css/style.css`: design tokens and components (UNCC green `#005035` and gold `#B3A369`, plus brighter accents)
- `js/data.js`: seed data (quests, classrooms, badges, leaderboards, screen list)
- `js/app.js`: shared state (localStorage), bottom nav, demo panels, toasts, sheets, confetti

To run locally: `python3 -m http.server`, then open http://localhost:8000.
