# Local PostgreSQL and pgAdmin setup

This guide sets up a reproducible **local development database** for Git Good. It does not configure a shared server or connect the static browser prototype to PostgreSQL. The prototype currently stores its interactive state in browser `localStorage`; `DATABASE_URL` must only be used by a future server-side component, never browser JavaScript.

## Create a local database in pgAdmin 4

1. Install and start a local PostgreSQL server, then open pgAdmin 4.
2. Register/connect to the local server. A typical local connection uses host `localhost` and port `5432`; use the administrator account configured during PostgreSQL installation.
3. In the server tree, create a login role named `gitgood_app`. Set a strong local password in pgAdmin's role properties. Do not put that password in repository files or screenshots.
4. Create a database named `gitgood_dev` and set `gitgood_app` as its owner.
5. Connect pgAdmin's Query Tool to `gitgood_dev`, open and execute `db/schema.sql`, then open and execute `db/seed.sql`.
6. Confirm the schema and sample records were created with:

   ```sql
   SELECT username, email FROM app_user;
   SELECT id, label FROM skill ORDER BY id;
   SELECT id, title, skill_id FROM quest;
   ```

The seed is safe to run more than once. It uses reserved `.invalid` sample data, not a real student's account.

## Per-developer configuration

Copy `.env.example` to `.env` and replace the placeholder password with the local role's password. URL-encode special characters in the password before putting it in the connection URL. Keep `.env` local; never commit or share it in chat, issues, or screenshots. `.env.example` is only a placeholder and is not an active connection for the current static app.

Each teammate who uses a local database needs their own PostgreSQL server, role/password, and `gitgood_dev` database. Share the committed `db/schema.sql` and `db/seed.sql`, not a local database file or credentials. A local database on one person's computer is **not** accessible to teammates. If the team needs one live shared database and shared records, use a team-approved hosted PostgreSQL development instance and give each teammate an authorized account instead.

## Part 3: Team database verification

Do not mark a row complete until that teammate has run the checks. For local databases, each person should verify their own database by querying the seeded rows and performing a test insert, read, and update. Do not put credentials in this table.

| Member | Connection / operation verified | Result |
|---|---|---|
| AJ Blocker | connect in pgAdmin; verify seeded rows; insert, read, and update a test record | Verified |
| Athena Deese | Pending: connect in pgAdmin; verify seeded rows; insert, read, and update a test record | Not yet verified |
| Heidi Wooldridge | Pending: connect in pgAdmin; verify seeded rows; insert, read, and update a test record | Not yet verified |
| Idol Hunter | Pending: connect in pgAdmin; verify seeded rows; insert, read, and update a test record | Not yet verified |

Example test operation (use a unique username for each local database):

```sql
INSERT INTO app_user (username, email, display_name)
VALUES ('connection_check', 'connection-check@example.invalid', 'Connection Check');

SELECT username, display_name
FROM app_user
WHERE username = 'connection_check';

UPDATE app_user
SET display_name = 'Connection Check Verified'
WHERE username = 'connection_check';
```

## Part 4: Credential protection

- `.gitignore` excludes `.env`, `.env.*`, private key files, and local database files. It explicitly allows `.env.example`.
- Commit `.env.example` and the schema/seed files; do not commit `.env`, passwords, connection URLs with real credentials, or private keys.
- Before committing, check the ignore rule and tracked files:

  ```sh
  git check-ignore -v .env
  git ls-files .env
  git status --short
  ```

`git check-ignore -v .env` should show the matching `.gitignore` rule, and `git ls-files .env` should print nothing.
