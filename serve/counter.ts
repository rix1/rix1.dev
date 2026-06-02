import {
  botFamilyLabel,
  classifyVisitor,
  type VisitorClass,
} from "./bots.ts";
import { normalizePagePath } from "./paths.ts";

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

const visitorCookieName = "rix1_visitor_id";
let kvPromise: Promise<Deno.Kv | undefined> | undefined;

export function getKv() {
  kvPromise ??= Deno.openKv().catch((error) => {
    console.warn("Visitor counter unavailable:", error);
    return undefined;
  });

  return kvPromise;
}

function parseCookies(cookieHeader: string | null) {
  const cookies = new Map<string, string>();

  if (!cookieHeader) {
    return cookies;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    const value = rawValue.join("=");

    if (rawName && value) {
      cookies.set(rawName, decodeURIComponent(value));
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

async function hashIdentity(value: string) {
  const salt = Deno.env.get("VISITOR_COUNTER_SALT") ??
    "rix1.dev visitor counter";
  const bytes = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return base64Url(new Uint8Array(digest)).slice(0, 24);
}

async function visitorIdentity(
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
    return { id: await hashIdentity(`human:${existingId}`) };
  }

  const visitorId = crypto.randomUUID();
  const secure = requestUrl.protocol === "https:" ? "; Secure" : "";
  const cookie = `${visitorCookieName}=${
    encodeURIComponent(visitorId)
  }; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly${secure}`;

  return { id: await hashIdentity(`human:${visitorId}`), cookie };
}

export async function trackHtmlVisit(request: Request, requestUrl: URL) {
  const pagePath = normalizePagePath(requestUrl.pathname);
  const visitor = classifyVisitor(request);
  const { id, cookie } = await visitorIdentity(request, visitor, requestUrl);
  const kv = await getKv();

  if (!kv) {
    return { cookie };
  }

  const seenKey = ["visitor-counter", "seen", pagePath, visitor.kind, id];
  const countKey = ["visitor-counter", "count", pagePath, visitor.kind];
  let operation = kv.atomic()
    .check({ key: seenKey, versionstamp: null })
    .set(seenKey, true)
    .sum(countKey, 1n);

  if (visitor.kind === "bot") {
    operation = operation.sum([
      "visitor-counter",
      "count",
      pagePath,
      "bot-family",
      visitor.family,
    ], 1n);
  }

  await operation.commit();

  return { cookie };
}

function readKvU64(value: unknown) {
  if (value instanceof Deno.KvU64) {
    return Number(value.value);
  }

  return 0;
}

async function botFamilyCounts(kv: Deno.Kv, pagePath: string) {
  const families: BotFamilyCount[] = [];

  for await (
    const entry of kv.list<Deno.KvU64>({
      prefix: ["visitor-counter", "count", pagePath, "bot-family"],
    })
  ) {
    const family = entry.key.at(-1);

    if (typeof family !== "string") {
      continue;
    }

    families.push({
      family,
      label: botFamilyLabel(family),
      count: readKvU64(entry.value),
    });
  }

  return families.sort((a, b) =>
    b.count - a.count || a.label.localeCompare(b.label)
  );
}

async function visitorCounts(pagePath: string) {
  const kv = await getKv();

  if (!kv) {
    return { humans: 0, bots: 0, botFamilies: [] };
  }

  const [humans, bots] = await kv.getMany([
    ["visitor-counter", "count", pagePath, "human"],
    ["visitor-counter", "count", pagePath, "bot"],
  ]);
  const families = await botFamilyCounts(kv, pagePath);
  const familyTotal = families.reduce((total, family) => {
    return total + family.count;
  }, 0);

  return {
    humans: readKvU64(humans.value),
    bots: familyTotal || readKvU64(bots.value),
    botFamilies: families,
  };
}

export async function serveVisitorStatus() {
  return Response.json(await allVisitorCounts(), {
    headers: {
      "cache-control": "no-store",
    },
  });
}

export async function serveVisitorCount(requestUrl: URL) {
  const pagePath = normalizePagePath(
    requestUrl.searchParams.get("path") ?? "/",
  );

  return Response.json({
    path: pagePath,
    ...await visitorCounts(pagePath),
  }, {
    headers: {
      "cache-control": "no-store",
    },
  });
}

function emptyPageCounts(path: string): PageCounts {
  return {
    path,
    humans: 0,
    bots: 0,
    botFamilies: [],
  };
}

export async function allVisitorCounts() {
  const kv = await getKv();

  if (!kv) {
    return {
      kvAvailable: false,
      pages: [] as PageCounts[],
      totals: { pages: 0, humans: 0, bots: 0 },
      botFamilies: [] as BotFamilyCount[],
    };
  }

  const pages = new Map<string, PageCounts>();
  const botFamilyTotals = new Map<string, BotFamilyCount>();

  for await (
    const entry of kv.list<Deno.KvU64>({
      prefix: ["visitor-counter", "count"],
    })
  ) {
    const pagePath = entry.key[2];
    const countKind = entry.key[3];
    const family = entry.key[4];

    if (typeof pagePath !== "string" || typeof countKind !== "string") {
      continue;
    }

    const page = pages.get(pagePath) ?? emptyPageCounts(pagePath);
    const count = readKvU64(entry.value);

    if (countKind === "human") {
      page.humans = count;
    } else if (countKind === "bot") {
      page.bots = count;
    } else if (countKind === "bot-family" && typeof family === "string") {
      const label = botFamilyLabel(family);

      page.botFamilies.push({ family, label, count });

      const total = botFamilyTotals.get(family) ?? {
        family,
        label,
        count: 0,
      };
      total.count += count;
      botFamilyTotals.set(family, total);
    }

    pages.set(pagePath, page);
  }

  const sortedPages = [...pages.values()]
    .map((page) => {
      const familyTotal = page.botFamilies.reduce((total, family) => {
        return total + family.count;
      }, 0);

      page.bots = familyTotal || page.bots;
      page.botFamilies.sort((a, b) =>
        b.count - a.count || a.label.localeCompare(b.label)
      );

      return page;
    })
    .sort((a, b) =>
      (b.humans + b.bots) - (a.humans + a.bots) ||
      a.path.localeCompare(b.path)
    );

  const totals = sortedPages.reduce((total, page) => {
    total.humans += page.humans;
    total.bots += page.bots;
    return total;
  }, { pages: sortedPages.length, humans: 0, bots: 0 });

  return {
    kvAvailable: true,
    pages: sortedPages,
    totals,
    botFamilies: [...botFamilyTotals.values()].sort((a, b) =>
      b.count - a.count || a.label.localeCompare(b.label)
    ),
  };
}
