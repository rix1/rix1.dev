-- One row per (page, visitor kind, visitor id): a visitor is counted once per page.
-- Humans are identified by a salted hash of a first-party cookie, crawlers by their family name.
CREATE TABLE visitor_seen (
  path TEXT NOT NULL,
  kind TEXT NOT NULL,
  visitor TEXT NOT NULL,
  PRIMARY KEY (path, kind, visitor)
) WITHOUT ROWID;

-- kind is 'human', 'bot', or 'bot-family' (then family names the crawler; otherwise it is '').
CREATE TABLE visitor_counts (
  path TEXT NOT NULL,
  kind TEXT NOT NULL,
  family TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (path, kind, family)
) WITHOUT ROWID;
