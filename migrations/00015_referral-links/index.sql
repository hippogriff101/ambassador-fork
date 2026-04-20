CREATE TABLE IF NOT EXISTS referral_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'secondary',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT referral_links_code_format CHECK (code ~ '^AMB-[A-Z1-9]{8}$'),
  CONSTRAINT referral_links_kind_check CHECK (kind IN ('primary', 'secondary')),
  CONSTRAINT referral_links_name_check CHECK (char_length(BTRIM(name)) BETWEEN 1 AND 80)
);

CREATE UNIQUE INDEX IF NOT EXISTS referral_links_user_primary_unique
  ON referral_links(user_id)
  WHERE kind = 'primary';

CREATE UNIQUE INDEX IF NOT EXISTS referral_links_user_name_unique
  ON referral_links(user_id, LOWER(name));

CREATE INDEX IF NOT EXISTS referral_links_user_created_idx
  ON referral_links(user_id, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS referral_link_clicks (
  id TEXT PRIMARY KEY,
  referral_link_id TEXT NOT NULL REFERENCES referral_links(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS referral_link_clicks_link_created_idx
  ON referral_link_clicks(referral_link_id, created_at DESC);

WITH generated_primary_links AS (
  SELECT
    'ref_' || md5(users.id || ':primary') AS id,
    users.id AS user_id,
    'AMB-' || string_agg(
      substr(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
        (get_byte(decode(md5(users.id || ':primary'), 'hex'), positions.position) % 35) + 1,
        1
      ),
      ''
      ORDER BY positions.position
    ) AS code
  FROM users
  CROSS JOIN generate_series(0, 7) AS positions(position)
  WHERE NOT EXISTS (
    SELECT 1
    FROM referral_links
    WHERE referral_links.user_id = users.id
      AND referral_links.kind = 'primary'
  )
  GROUP BY users.id
)
INSERT INTO referral_links (id, user_id, code, name, kind)
SELECT id, user_id, code, 'Default', 'primary'
FROM generated_primary_links
WHERE NOT EXISTS (
  SELECT 1
  FROM posters
  WHERE posters.referral_code = generated_primary_links.code
)
ON CONFLICT DO NOTHING;
