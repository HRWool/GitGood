# Local PostgreSQL and Prisma setup

This guide sets up a reproducible **local development database** for Git Good using **PostgreSQL** and the **Prisma ORM**. The tables come from the committed Prisma migration in `prisma/migrations/`, and sample data comes from `prisma/seed.js`, so every teammate gets the same schema.

The browser prototype still stores its interactive state in `localStorage`. `DATABASE_URL` must only be used by server-side code (Prisma scripts, tests, or a future backend), never by browser JavaScript.

## Why PostgreSQL and Prisma

Git Good's data is strongly relational: students pick skills, complete quests, earn badges and XP, join classrooms, and appear on leaderboards, and most of these link to each other. PostgreSQL is a free, widely used relational database that every teammate can run locally, and it enforces the keys, unique fields, and constraints this model needs. Prisma gives us one readable schema file (`prisma/schema.prisma`), a generated JavaScript client, and versioned migrations that everyone applies the same way, so all of our local databases stay consistent.

## One-time setup on each computer

Each computer you develop on needs its own PostgreSQL server, role, and database. A local database is only on the machine it was created on; it is **not** shared with teammates or your other computers.

1. Install **Node.js LTS** (18 or newer) and **PostgreSQL** (the EDB installer includes **pgAdmin 4**). Keep the default port `5432` and keep the `postgres` administrator password private.
2. In pgAdmin, connect to the local server (host `localhost`, port `5432`).
3. Create a login role: right-click **Login/Group Roles → Create → Login/Group Role**.
   - **General:** name `gitgood_app`
   - **Definition:** set a strong local password. Avoid `@`, `#`, `/`, `:` and `%`, or URL-encode them in the next step.
   - **Privileges:** turn on **Can login?** and **Create databases?** (`prisma migrate dev` creates a temporary "shadow" database and fails without this).
4. Create the database: right-click **Databases → Create → Database**. Name it exactly **`gitgood`** and set the owner to `gitgood_app`. The seed script refuses to run on any other database name or on a non-local host.
5. In the repository folder:

   ```sh
   git checkout main
   git pull
   npm install
   ```

6. Copy `.env.example` to `.env` and replace `replace-with-your-local-password` with the `gitgood_app` password:

   ```
   DATABASE_URL="postgresql://gitgood_app:YOUR_PASSWORD@localhost:5432/gitgood?schema=public"
   ```

   Keep `.env` local. Never commit it or share it in chat, issues, or screenshots.

7. Create the tables, load sample data, and test the connection:

   ```sh
   npm run db:setup
   ```

   This runs `prisma generate`, `prisma migrate dev`, `node prisma/seed.js`, and `node prisma/check-connection.js`. It should finish with `Connected to PostgreSQL database "gitgood" (schema "public").` The individual commands are `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, and `npm run db:check`. The seed is safe to run more than once and only uses `.test` / `.invalid` sample data.

8. Optional: confirm the seeded rows in pgAdmin's Query Tool (connected to `gitgood`). Prisma table and column names are case-sensitive, so keep the double quotes:

   ```sql
   SELECT id, username, email FROM "Student";
   SELECT id, name FROM "Skill";
   SELECT id, title FROM "Quest";
   ```

## Keeping your database up to date

After `git pull`, if a teammate added a new folder under `prisma/migrations/`, run `npm run db:migrate` to apply it to your local database. Change the schema only by editing `prisma/schema.prisma` and creating a migration (`npx prisma migrate dev --name describe-change`), then commit both the schema and the new migration folder. Never edit tables by hand or share database files.

## Part 3: Team database verification

Our team uses **local databases with a consistent committed schema** (the Prisma migration and seed), not one shared cloud database. Each member verifies their own database by running `npm run db:setup` and then performing a test insert, read, and update. Do not mark a row complete until that teammate has run the checks, and do not put credentials in this table.

| Member | Connection / operation verified | Result |
|---|---|---|
| AJ Blocker | `npm run db:setup`; insert, read, and update a test `Student` | Verified |
| Athena Deese | Pending: `npm run db:setup`; insert, read, and update a test `Student` |  Verified |
| Heidi Wooldridge | `npm run db:setup`; insert, read, and update a test `Student` | Verified |
| Idol Hunter | `npm run db:setup`; insert, read, and update a test `Student` | Verified |

Test operation (run in pgAdmin's Query Tool on `gitgood`; replace `yourname` with your own name). Prisma generates `id` and `updatedAt` in application code, so plain SQL has to supply them:

```sql
INSERT INTO "Student" (id, email, username, "displayName", "updatedAt")
VALUES ('check-yourname', 'check-yourname@example.invalid', 'check_yourname', 'Connection Check', now());

SELECT username, "displayName"
FROM "Student"
WHERE id = 'check-yourname';

UPDATE "Student"
SET "displayName" = 'Connection Check Verified', "updatedAt" = now()
WHERE id = 'check-yourname';
```

`username` can be at most 18 characters.

## Part 4: Credential protection

- `.gitignore` excludes `.env`, `.env.*`, private key files, and local database files. It explicitly allows `.env.example`.
- Commit `.env.example`, `prisma/schema.prisma`, `prisma/migrations/`, and `prisma/seed.js`. Do not commit `.env`, passwords, connection URLs with real credentials, or private keys.
- Before committing, check the ignore rule and tracked files:

  ```sh
  git check-ignore -v .env
  git ls-files .env
  git status --short
  ```

`git check-ignore -v .env` should show the matching `.gitignore` rule, and `git ls-files .env` should print nothing.
