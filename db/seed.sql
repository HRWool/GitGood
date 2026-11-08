INSERT INTO skill (id, label) VALUES
  ('Python', 'Python'),
  ('Java', 'Java'),
  ('Web', 'Web'),
  ('SQL', 'SQL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO app_user (username, email, display_name, avatar, xp, streak)
VALUES ('maya_demo', 'maya.demo@example.invalid', 'Maya Chen', '🦊', 0, 0)
ON CONFLICT (username) DO NOTHING;

INSERT INTO user_skill (user_id, skill_id)
SELECT app_user.id, skill.id
FROM app_user
CROSS JOIN skill
WHERE app_user.username = 'maya_demo'
  AND skill.id IN ('Python', 'Web')
ON CONFLICT (user_id, skill_id) DO NOTHING;

INSERT INTO quest (id, title, skill_id, xp, minutes, difficulty, practiced)
VALUES (
  'first',
  'Count the café orders',
  'Python',
  50,
  5,
  'Easy',
  ARRAY['for loops', 'lists', 'running totals']
)
ON CONFLICT (id) DO NOTHING;
