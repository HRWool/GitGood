# Sprint Standup Document

“In many sports like (American) football and rugby, the team huddles before each play. The huddle is strategic: it keeps the team informed, connected, and calibrated throughout the game. For software teams, the stand-up is like the team’s huddle. It’s even commonly known as the daily scrum, and reinforces “we” to keep everyone aware of the team’s landscape and progress.” - <https://www.atlassian.com/agile/scrum/standups>

## Outcome

The goal of the standup is for everyone to align on what everyone else is doing. This way, if there are any blockers or conflicts, they can be resolved before everyone begins working for the day. In real life, this also gives the product and project teams insight into what the engineers are doing, but in our class, we only have engineers. In the industry, different teams have a different number of stand ups per week. Sometimes every day, sometimes 3 times a week, and sometimes even only twice a week. To get full credit, you need to have at least 3 stand ups per 2-week sprint and turn in a copy of this document for every standup.

## Steps

There are many ways to run a stand up, however most teams use the following format. Go from team member to team member and have each person answer the following questions.

1. **What did I work on since the last stand up?** - Give an update of what you did since the last time you met. If you were not able to complete what you wanted, explain why, but keep in mind that it is totally fine to have not met your goals as long as you know why and can work to improve next time. Perhaps you had assignments in too many other courses, the goals were too high/unobtainable, or you were blocked.
2. **What will I work on before the next stand up?** - Explain what you will work on and what you hope to complete before the next meeting. Sometimes, you may work on a task from your scrum board that you know you will not have done by the next stand up. That is okay, just give your best estimate of what you want to have accomplished.
3. **What blockers do I have, if any?** - Explain what external obstacles you have which would prevent you from accomplishing your current goals. It may be that you do not have a good understanding of databases to complete your database related task, another team member has to complete their task before you can start yours, or even a completely external blocker like you will be out of town during the sprint. While everyone is answering this question, take notes. After the meeting, review the blockers and see if the team can work together to find solutions to them before continuing the sprint.

## Team Name - Group 7 (Git Good)

## Sprint Name - Sprint 2

## Stand Up Date - 11/13/2026

*If a team member is absent, list them as absent. If they have a valid reason, like an illness, they should contact the TAs and/or instructor so they do not lose points for this stand up.*

### Update for AJ Blocker

1. What have I accomplished - Verified my local PostgreSQL database with the Prisma setup (`npm run db:setup` plus the insert, read and update check) and marked it Verified in docs/database-setup.md. Reviewed the Part 3 and 4 issues (#23–#29) and closed the ones that are complete.
2. What will I accomplish - Pull the latest main, run the new migrations and the database tests on my machine, and review the database-integrated sign-up pull request.
3. What blockers do I have - None.

### Update for Athena Deese

1. What have I accomplished - Finished the database connection check on my machine and reworked the student data model so badge progress belongs to each student instead of the shared badge list (commit cb55b40). Chose the user story for Part 5: saving a student's sign-up and skills to the database (#44).
2. What will I accomplish - Review and demo the database-integrated sign-up feature (#44), confirm it meets the acceptance criteria, and close #22 once it is merged.
3. What blockers do I have - None now that the database setup from parts 1–4 is merged.

### Update for Heidi Wooldridge

1. What have I accomplished - Reviewed and merged the Prisma and setup-guide pull requests (#41–#43) and kept the issues and board up to date. Coordinated the Sprint 2 wrap-up: the sign-up feature, database tests, AI design review and release notes are in a pull request for team review.
2. What will I accomplish - Run the automated tests and lint against my local test database, commit the test evidence, update the GitHub Project board, and create the R2 release (parts 7 and 8).
3. What blockers do I have - The sign-up pull request needs a teammate's approval and merge before the release can be tagged.

### Update for Idol Hunter

1. What have I accomplished - Built the Prisma schema, migration, seed script and UML diagrams for parts 1 and 2, and verified my local database.
2. What will I accomplish - Review docs/ai-design-review.md for accuracy and render the new sign-up sequence diagram to SVG.
3. What blockers do I have - None.

### Blockers

After everyone gives updates, discuss and write down what your team will do to alleviate any blockers that came up in the meeting.

Everyone needs the latest main on their machine before the release: `git pull`, `npm install`, `npm run db:migrate`, then create `gitgood_test` and run `npm run db:test:setup` so the database tests run locally. The steps are in docs/database-setup.md. One teammate reviews the sign-up pull request so it can merge before Heidi tags R2.
