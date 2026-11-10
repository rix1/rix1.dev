import { botFamilyLabel, classifyVisitor, type VisitorClass } from "./bots.ts";
import { normalizePagePath } from "./paths.ts";
import type { D1Database } from "./types.ts";

export type BotFamilyCount = {
  family: string;
  label: string;
  count: number;
};
export type PageCounts = {
  path: string;
  humans: number;
  bots: number;
  botFamilies: BotFamilyCount[];
};

type CountRow = { path: string; kind: string; family: string; count: number };

const visitorCookieName = "rix1_visitor_id";
const noStore = { "cache-control": "no-store" };

function parseCookies(cookieHeader: string | null) {
  const cookies = new Map<string, string>();

  if (!cookieHeader) {
    return cookies;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    const value = rawValue.join("=");

    if (rawName && value) {
      try {
        cookies.set(rawName, decodeURIComponent(value));
      } catch {
        // Ignore cookies that aren't valid URI-encoded strings.
      }
    }
  }

  return cookies;
}

function base64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function hashIdentity(salt: string, value: string) {
  const bytes = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return base64Url(new Uint8Array(digest)).slice(0, 24);
}

async function visitorIdentity(
  salt: string,
  request: Request,
  visitor: VisitorClass,
  requestUrl: URL,
) {
  if (visitor.kind === "bot") {
    return { id: visitor.family };
  }

  const cookies = parseCookies(request.headers.get("cookie"));
  const existingId = cookies.get(visitorCookieName);

  if (existingId?.match(/^[a-f0-9-]{36}$/i)) {
    return { id: await hashIdentity(salt, `human:${existingId}`) };
  }

  const visitorId = crypto.randomUUID();
  const secure = requestUrl.protocol === "https:" ? "; Secure" : "";
  const cookie = `${visitorCookieName}=${
    encodeURIComponent(visitorId)
  }; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly${secure}`;

  return { id: await hashIdentity(salt, `human:${visitorId}`), cookie };
}

async function recordVisit(
  db: D1Database,
  pagePath: string,
  visitor: VisitorClass,
  id: string,
) {
  // Only the first visit by this visitor to this page counts.
  const inserted = await db.prepare(
    "INSERT INTO visitor_seen (path, kind, visitor) VALUES (?, ?, ?) ON CONFLICT DO NOTHING RETURNING 1 AS inserted",
  ).bind(pagePath, visitor.kind, id).first();

  if (!inserted) {
    return;
  }

  const bump = (kind: string, family = "") =>
    db.prepare(
      "INSERT INTO visitor_counts (path, kind, family, count) VALUES (?, ?, ?, 1) ON CONFLICT (path, kind, family) DO UPDATE SET count = count + 1",
    ).bind(pagePath, kind, family);

  await db.batch(
    visitor.kind === "bot"
      ? [bump("bot"), bump("bot-family", visitor.family)]
      : [bump("human")],
  );
}

/**
 * Identifies the visitor and returns the cookie to set (for new humans) right away,
 * plus the database write as a promise for the caller to hand to `waitUntil`.
 */
export async function trackHtmlVisit(
  db: D1Database,
  salt: string,
  request: Request,
  requestUrl: URL,
) {
  const pagePath = normalizePagePath(requestUrl.pathname);
  const visitor = classifyVisitor(request);
  const { id, cookie } = await visitorIdentity(
    salt,
    request,
    visitor,
    requestUrl,
  );

  return { cookie, write: recordVisit(db, pagePath, visitor, id) };
}

function sortFamilies(families: BotFamilyCount[]) {
  return families.sort((a, b) =>
    b.count - a.count || a.label.localeCompare(b.label)
  );
}

function aggregate(rows: CountRow[]) {
  const pages = new Map<string, PageCounts>();
  const botFamilyTotals = new Map<string, BotFamilyCount>();

  for (const row of rows) {
    const page = pages.get(row.path) ??
      { path: row.path, humans: 0, bots: 0, botFamilies: [] };

    if (row.kind === "human") {
      page.humans = row.count;
    } else if (row.kind === "bot") {
      page.bots = row.count;
    } else if (row.kind === "bot-family" && row.family) {
      const label = botFamilyLabel(row.family);

      page.botFamilies.push({ family: row.family, label, count: row.count });

      const total = botFamilyTotals.get(row.family) ??
        { family: row.family, label, count: 0 };
      total.count += row.count;
      botFamilyTotals.set(row.family, total);
    }

    pages.set(row.path, page);
  }

  for (const page of pages.values()) {
    const familyTotal = page.botFamilies.reduce(
      (total, family) => total + family.count,
      0,
    );

    page.bots = familyTotal || page.bots;
    sortFamilies(page.botFamilies);
  }

  return { pages, botFamilies: sortFamilies([...botFamilyTotals.values()]) };
}

export async function serveVisitorCount(db: D1Database, requestUrl: URL) {
  const pagePath = normalizePagePath(
    requestUrl.searchParams.get("path") ?? "/",
  );
  const { results } = await db.prepare(
    "SELECT path, kind, family, count FROM visitor_counts WHERE path = ?",
  ).bind(pagePath).all<CountRow>();
  const page = aggregate(results).pages.get(pagePath);

  return Response.json({
    path: pagePath,
    humans: page?.humans ?? 0,
    bots: page?.bots ?? 0,
    botFamilies: page?.botFamilies ?? [],
  }, { headers: noStore });
}

export async function serveVisitorStatus(db: D1Database) {
  const { results } = await db.prepare(
    "SELECT path, kind, family, count FROM visitor_counts",
  ).all<CountRow>();
  const { pages, botFamilies } = aggregate(results);
  const sortedPages = [...pages.values()].sort((a, b) =>
    (b.humans + b.bots) - (a.humans + a.bots) ||
    a.path.localeCompare(b.path)
  );
  const totals = sortedPages.reduce((total, page) => {
    total.humans += page.humans;
    total.bots += page.bots;
    return total;
  }, { pages: sortedPages.length, humans: 0, bots: 0 });

  return Response.json(
    { pages: sortedPages, totals, botFamilies },
    { headers: noStore },
  );
}
