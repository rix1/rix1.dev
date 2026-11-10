-- One-off import of the pre-page-hits counter (visitor_counts, 0001) so pages
-- keep their history. Those numbers were unique visitors per page and crawler
-- families per page, not hits, so they undercount; the crawler ones especially.
-- Everything lands on 2026-06-02, the day the old counter went live, which
-- keeps it out of the daily chart. Leftover non-page paths are skipped.
INSERT INTO page_hits (path, day, kind, family, count)
SELECT
  path,
  '2026-06-02',
  CASE kind WHEN 'human' THEN 'human' ELSE 'bot' END,
  family,
  count
FROM visitor_counts
WHERE kind IN ('human', 'bot-family')
  AND count > 0
  AND path NOT IN ('/index.html/', '/404.html/', '/skills/add-project/SKILL/')
ON CONFLICT (path, day, kind, family) DO UPDATE SET count = count + excluded.count;
