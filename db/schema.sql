CREATE TABLE IF NOT EXISTS app_user (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🦊',
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_skill (
  user_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skill(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS quest (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  skill_id TEXT NOT NULL REFERENCES skill(id),
  xp INTEGER NOT NULL CHECK (xp >= 0),
  minutes INTEGER NOT NULL CHECK (minutes > 0),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  practiced TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS quest_completion (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL REFERENCES quest(id),
  xp_awarded INTEGER NOT NULL CHECK (xp_awarded >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quest_completion_user_completed_idx
  ON quest_completion (user_id, completed_at DESC);
