-- DraftDesk database schema

CREATE TABLE IF NOT EXISTS enquiries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT    NOT NULL,
  contact       TEXT,                       -- phone or email
  details       TEXT    NOT NULL,           -- what the customer asked for
  status        TEXT    NOT NULL DEFAULT 'New'
                 CHECK (status IN ('New', 'Quoted', 'Won', 'Done')),
  draft         TEXT,                        -- the AI-generated reply, once created
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
