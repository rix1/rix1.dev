import { botFamilyLabel, classifyVisitor } from "./bots.ts";
import { normalizePagePath } from "./paths.ts";
import type { D1Database } from "./types.ts";

export type BotFamilyCount = {
  family: string;
  label: string;
  count: number;
  recent: number;
};
export type PageCounts = {
  path: string;
  hits: number;
  humans: number;
  bots: number;
  botFamilies: BotFamilyCount[];
};

type HitRow = {
  path: string;
  kind: string;
  family: string;
  count: number;
  recent: number;
};

/** The status page's "recent" window, in days, counting today. */
const recentDays = 7;
/** How many days the status page's daily chart covers, counting today. */
const chartDays = 30;
const noStore = { "cache-control": "no-store" };

function utcDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function daysBack(days: number) {
  return utcDay(new Date(Date.now() - days * 86_400_000));
}

function recentSince() {
  return daysBack(recentDays - 1);
}

/** Hits per day for the last `chartDays` days, oldest first, zero-filled. */
async function dailyHits(db: D1Database) {
  const { results } = await db.prepare(
    "SELECT day, kind, SUM(count) AS count FROM page_hits WHERE day >= ? GROUP BY day, kind",
  ).bind(daysBack(chartDays - 1)).all<
    { day: string; kind: string; count: number }
  >();
  const days = new Map(
    Array.from({ length: chartDays }, (_, index) => {
      const day = daysBack(chartDays - 1 - index);
      return [day, { day, humans: 0, bots: 0 }];
    }),
  );

  for (const row of results) {
    const day = days.get(row.day);

    if (day) {
      day[row.kind === "bot" ? "bots" : "humans"] += row.count;
    }
  }

  return [...days.values()];
}

/**
 * Counts one page load. Every load counts: there is no cookie and no
 * de-duplication, so a visitor is only ever "human" or a crawler family.
 */
export function recordPageHit(
  db: D1Database,
  request: Request,
  requestUrl: URL,
) {
  const visitor = classifyVisitor(request);

  return db.prepare(
    "INSERT INTO page_hits (path, day, kind, family, count) VALUES (?, ?, ?, ?, 1) ON CONFLICT (path, day, kind, family) DO UPDATE SET count = count + 1",
  ).bind(
    normalizePagePath(requestUrl.pathname),
    utcDay(),
    visitor.kind,
    visitor.kind === "bot" ? visitor.family : "",
  ).run();
}

function sortFamilies(families: BotFamilyCount[]) {
  return families.sort((a, b) =>
    b.count - a.count || a.label.localeCompare(b.label)
  );
}

function aggregate(rows: HitRow[]) {
  const pages = new Map<string, PageCounts>();
  const botFamilyTotals = new Map<string, BotFamilyCount>();
  const recent = { hits: 0, humans: 0, bots: 0 };

  for (const row of rows) {
    const page = pages.get(row.path) ??
      { path: row.path, hits: 0, humans: 0, bots: 0, botFamilies: [] };

    page.hits += row.count;
    recent.hits += row.recent;

    if (row.kind === "bot") {
      const label = botFamilyLabel(row.family);
      const total = botFamilyTotals.get(row.family) ??
        { family: row.family, label, count: 0, recent: 0 };

      page.bots += row.count;
      page.botFamilies.push({
        family: row.family,
        label,
        count: row.count,
        recent: row.recent,
      });
      recent.bots += row.recent;
      total.count += row.count;
      total.recent += row.recent;
      botFamilyTotals.set(row.family, total);
    } else {
      page.humans += row.count;
      recent.humans += row.recent;
    }

    pages.set(row.path, page);
  }

  for (const page of pages.values()) {
    sortFamilies(page.botFamilies);
  }

  return {
    pages,
    recent,
    botFamilies: sortFamilies([...botFamilyTotals.values()]),
  };
}

const totalsQuery =
  "SELECT path, kind, family, SUM(count) AS count, SUM(CASE WHEN day >= ? THEN count ELSE 0 END) AS recent FROM page_hits";

export async function servePageCount(db: D1Database, requestUrl: URL) {
  const pagePath = normalizePagePath(
    requestUrl.searchParams.get("path") ?? "/",
  );
  const { results } = await db.prepare(
    `${totalsQuery} WHERE path = ? GROUP BY path, kind, family`,
  ).bind(recentSince(), pagePath).all<HitRow>();
  const page = aggregate(results).pages.get(pagePath);

  return Response.json({
    path: pagePath,
    hits: page?.hits ?? 0,
    humans: page?.humans ?? 0,
    bots: page?.bots ?? 0,
    botFamilies: page?.botFamilies ?? [],
  }, { headers: noStore });
}

export async function serveStatus(db: D1Database) {
  const { results } = await db.prepare(
    `${totalsQuery} GROUP BY path, kind, family`,
  ).bind(recentSince()).all<HitRow>();
  const first = await db.prepare("SELECT MIN(day) AS day FROM page_hits")
    .first<{ day: string | null }>();
  const days = await dailyHits(db);
  const { pages, recent, botFamilies } = aggregate(results);
  const sortedPages = [...pages.values()].sort((a, b) =>
    b.hits - a.hits || a.path.localeCompare(b.path)
  );
  const totals = sortedPages.reduce((total, page) => {
    total.hits += page.hits;
    total.humans += page.humans;
    total.bots += page.bots;
    return total;
  }, { pages: sortedPages.length, hits: 0, humans: 0, bots: 0 });

  return Response.json(
    {
      since: first?.day ?? null,
      recentDays,
      totals,
      recent,
      days,
      pages: sortedPages,
      botFamilies,
    },
    { headers: noStore },
  );
}
