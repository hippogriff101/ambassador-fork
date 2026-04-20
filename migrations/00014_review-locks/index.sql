CREATE TABLE IF NOT EXISTS review_locks (
  application_id TEXT PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
  locked_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  locked_by_name TEXT,
  locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS review_locks_locked_at_idx
  ON review_locks (locked_at);
