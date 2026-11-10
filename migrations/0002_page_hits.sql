-- Page hit counter: every page load counts, bucketed per UTC day so the
-- status page can show how often crawlers come by.
-- kind is 'human' or 'bot'; family names the crawler for bots and is '' for humans.
-- The visitor_seen and visitor_counts tables from 0001 are no longer written to.
CREATE TABLE page_hits (
  path TEXT NOT NULL,
  day TEXT NOT NULL,
  kind TEXT NOT NULL,
  family TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (path, day, kind, family)
) WITHOUT ROWID;
