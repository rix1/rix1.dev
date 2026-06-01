const root = `${Deno.cwd()}/_site`;
const visitorCookieName = "rix1_visitor_id";

type VisitorClass =
  | { kind: "human" }
  | { kind: "bot"; family: string };
type BotFamilyCount = {
  family: string;
  label: string;
  count: number;
};
type PageCounts = {
  path: string;
  humans: number;
  bots: number;
  botFamilies: BotFamilyCount[];
};

// UA-only detection keeps the counter privacy-friendly; this is counting
// declared crawlers, not trying to prove identity by IP.
const botFamilies = [
  "addsearchbot",
  "ahrefs",
  "ai2bot-deepresearcheval",
  "ai2bot-dolma",
  "ai2bot",
  "aihitbot",
  "amazon-kendra",
  "amazonbot",
  "amazonbuyforme",
  "amzn-searchbot",
  "amzn-user",
  "andibot",
  "anthropic-ai",
  "apifybot",
  "apifywebsitecontentcrawler",
  "applebot-extended",
  "applebot",
  "azureai-searchbot",
  "baiduspider",
  "bedrockbot",
  "bingbot",
  "bigsur.ai",
  "bravebot",
  "brightbot",
  "buddybot",
  "bytespider",
  "ccbot",
  "channel3bot",
  "chatglm-spider",
  "chatgpt agent",
  "chatgpt-user",
  "claude-code",
  "claude-searchbot",
  "claude-user",
  "claude-web",
  "claudebot",
  "cloudflare-autorag",
  "cloudvertexbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "crawl4ai",
  "crawlspace",
  "curl",
  "deepseekbot",
  "devin",
  "diffbot",
  "discordbot",
  "dotbot",
  "duckassistbot",
  "duckduckbot",
  "echobot bot",
  "echoboxbot",
  "exabot",
  "facebookbot",
  "facebookexternalhit",
  "factset_spyderbot",
  "firecrawlagent",
  "friendlycrawler",
  "gemini-deep-research",
  "google-agent",
  "google-cloudvertexbot",
  "google-extended",
  "google-firebase",
  "google-gemini-cli",
  "google-notebooklm",
  "googleagent-mariner",
  "googlebot",
  "googleother-image",
  "googleother-video",
  "googleother",
  "gptbot",
  "headlesschrome",
  "iaskbot",
  "iaskspider",
  "ia_archiver",
  "iboubot",
  "icc-crawler",
  "imagesiftbot",
  "imagespider",
  "img2dataset",
  "isscyberriskcrawler",
  "kagi-fetcher",
  "kangaroo bot",
  "klaviyoaibot",
  "kunatocrawler",
  "laion-huggingface-processor",
  "laiondownloader",
  "linerbot",
  "linkedinbot",
  "linkupbot",
  "manus-user",
  "meta-externalagent",
  "meta-externalfetcher",
  "meta-webindexer",
  "mistralai-user",
  "mj12bot",
  "mycentralaiscraperbot",
  "nagetbot",
  "newsai",
  "notebooklm",
  "novaact",
  "oai-adsbot",
  "oai-searchbot",
  "openai",
  "opencode",
  "pangu bot",
  "pangubot",
  "perplexity-user",
  "perplexitybot",
  "petalbot",
  "phindbot",
  "pingdom",
  "poggio-citations",
  "poseidon research crawler",
  "python-requests",
  "qualifiedbot",
  "quillbot",
  "sbintuitionsbot",
  "scrapy",
  "semrushbot-ocob",
  "semrushbot-swa",
  "semrush",
  "shap-user",
  "shapbot",
  "slurp",
  "tavilybot",
  "telegrambot",
  "thinkbot",
  "tiktokspider",
  "timpibot",
  "twinagent",
  "uptime",
  "webzio-extended",
  "wget",
  "wrtnbot",
  "youbot",
];

const botFamilyLabels: Record<string, string> = {
  "ai2bot": "Ai2Bot",
  "ai2bot-deepresearcheval": "Ai2Bot-DeepResearchEval",
  "ai2bot-dolma": "Ai2Bot-Dolma",
  "amazonbot": "Amazonbot",
  "amzn-searchbot": "Amazon SearchBot",
  "amzn-user": "Amazon User",
  "anthropic-ai": "Anthropic AI",
  "applebot": "Applebot",
  "applebot-extended": "Applebot-Extended",
  "bingbot": "Bingbot",
  "bytespider": "Bytespider",
  "ccbot": "CCBot",
  "chatgpt agent": "ChatGPT Agent",
  "chatgpt-user": "ChatGPT-User",
  "claude-code": "Claude Code",
  "claude-searchbot": "Claude-SearchBot",
  "claude-user": "Claude-User",
  "claude-web": "Claude-Web",
  "claudebot": "ClaudeBot",
  "deepseekbot": "DeepSeekBot",
  "facebookbot": "FacebookBot",
  "gemini-deep-research": "Gemini Deep Research",
  "google-extended": "Google-Extended",
  "googlebot": "Googlebot",
  "gptbot": "GPTBot",
  "headlesschrome": "Headless Chrome",
  "meta-externalagent": "Meta-ExternalAgent",
  "meta-externalfetcher": "Meta-ExternalFetcher",
  "mistralai-user": "MistralAI-User",
  "oai-adsbot": "OAI-AdsBot",
  "oai-searchbot": "OAI-SearchBot",
  "perplexity-user": "Perplexity-User",
  "perplexitybot": "PerplexityBot",
  "python-requests": "python-requests",
  "semrush": "Semrush",
};

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=UTF-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=UTF-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".rss": "application/rss+xml; charset=UTF-8",
  ".svg": "image/svg+xml; charset=UTF-8",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=UTF-8",
};

const numberFormatter = new Intl.NumberFormat("en");
let kvPromise: Promise<Deno.Kv | undefined> | undefined;

function getKv() {
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

function botFamily(userAgent: string) {
  const normalized = userAgent.toLowerCase();
  const matchedFamily = botFamilies.find((family) =>
    normalized.includes(family)
  );

  if (matchedFamily) {
    return matchedFamily;
  }

  if (
    normalized.includes("bot") ||
    normalized.includes("crawler") ||
    normalized.includes("spider")
  ) {
    return "other-crawler";
  }
}

function classifyVisitor(request: Request): VisitorClass {
  const userAgent = request.headers.get("user-agent") ?? "";
  const family = botFamily(userAgent);

  return family ? { kind: "bot", family } : { kind: "human" };
}

function normalizePagePath(pathname: string) {
  let decodedPathname: string;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return "/";
  }

  if (!decodedPathname.startsWith("/") || decodedPathname.includes("\0")) {
    return "/";
  }

  const segments = decodedPathname.split("/").filter(Boolean);

  if (segments.some((segment) => segment === "." || segment === "..")) {
    return "/";
  }

  if (segments.length === 0) {
    return "/";
  }

  return `/${segments.join("/")}/`;
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

async function trackHtmlVisit(request: Request, requestUrl: URL) {
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

function botFamilyLabel(family: string) {
  return botFamilyLabels[family] ?? family;
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

async function serveVisitorCount(requestUrl: URL) {
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

async function allVisitorCounts() {
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

function escapeHtml(value: unknown) {
  return String(value).replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function safeEnv(name: string) {
  try {
    return Deno.env.get(name);
  } catch {
    return undefined;
  }
}

async function readTextFileIfAvailable(path: string) {
  try {
    return await Deno.readTextFile(path);
  } catch {
    return undefined;
  }
}

async function localGitCommit() {
  const gitPath = `${Deno.cwd()}/.git`;
  const head = (await readTextFileIfAvailable(`${gitPath}/HEAD`))?.trim();

  if (!head) {
    return undefined;
  }

  if (head.startsWith("ref: ")) {
    const ref = head.slice("ref: ".length);
    const commit = (await readTextFileIfAvailable(`${gitPath}/${ref}`))
      ?.trim();

    return commit?.slice(0, 12);
  }

  return head.slice(0, 12);
}

async function runtimeRows(kvAvailable: boolean) {
  const commit = safeEnv("DENO_DEPLOY_COMMIT_SHA") ??
    safeEnv("GITHUB_SHA") ??
    safeEnv("COMMIT_SHA") ??
    safeEnv("SOURCE_COMMIT") ??
    safeEnv("SOURCE_VERSION") ??
    safeEnv("VERCEL_GIT_COMMIT_SHA") ??
    safeEnv("CF_PAGES_COMMIT_SHA") ??
    await localGitCommit();

  return [
    ["Generated at", new Date().toISOString()],
    ["KV", kvAvailable ? "available" : "unavailable"],
    ["Deno", Deno.version.deno],
    ["Deployment", safeEnv("DENO_DEPLOYMENT_ID") ?? "not exposed"],
    [
      "Region",
      safeEnv("DENO_REGION") ?? safeEnv("DENO_DEPLOY_REGION") ??
        "not exposed",
    ],
    ["Commit", commit ?? "not exposed"],
  ];
}

function formatCount(count: number) {
  return numberFormatter.format(count);
}

function renderBotFamilyList(families: BotFamilyCount[]) {
  if (!families.length) {
    return "";
  }

  return families.map((family) =>
    `<span class="pill"><span>${escapeHtml(family.label)}</span><b>${
      formatCount(family.count)
    }</b></span>`
  ).join("");
}

function renderPageRows(pages: PageCounts[]) {
  if (!pages.length) {
    return `
      <tr>
        <td colspan="4" class="empty">No visits counted yet.</td>
      </tr>
    `;
  }

  return pages.map((page) => `
    <tr>
      <td><a href="${escapeHtml(page.path)}">${escapeHtml(page.path)}</a></td>
      <td class="num">${formatCount(page.humans)}</td>
      <td class="num">${formatCount(page.bots)}</td>
      <td class="families">${renderBotFamilyList(page.botFamilies)}</td>
    </tr>
  `).join("");
}

async function serveStatus() {
  const counts = await allVisitorCounts();
  const runtime = await runtimeRows(counts.kvAvailable);
  const runtimeItems = runtime.map(([label, value]) => `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `).join("");
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Status - rix1.dev</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f8fafc;
        --fg: #111827;
        --muted: #6b7280;
        --line: #e5e7eb;
        --panel: #ffffff;
        --accent: #0f766e;
      }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--fg);
        font-family: "Bricolage Grotesque", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        box-sizing: border-box;
        width: min(1120px, 100%);
        margin: 0 auto;
        padding: 48px 20px 64px;
      }
      a {
        color: inherit;
        text-decoration-color: color-mix(in srgb, var(--accent), transparent 45%);
        text-underline-offset: 4px;
      }
      .top {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 28px;
      }
      h1 {
        margin: 0;
        font-size: clamp(2rem, 6vw, 4rem);
        line-height: .95;
        letter-spacing: 0;
      }
      .lede {
        margin: 12px 0 0;
        max-width: 680px;
        color: var(--muted);
        font-size: 1rem;
        line-height: 1.6;
      }
      .back {
        flex: 0 0 auto;
        color: var(--muted);
        font-size: .9rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin: 28px 0;
      }
      .stat, section {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 8px;
      }
      .stat {
        padding: 18px;
      }
      .stat span {
        display: block;
        color: var(--muted);
        font-size: .78rem;
        font-weight: 800;
        text-transform: uppercase;
      }
      .stat strong {
        display: block;
        margin-top: 10px;
        font-size: 2rem;
        line-height: 1;
      }
      section {
        margin-top: 16px;
        overflow: hidden;
      }
      h2 {
        margin: 0;
        padding: 18px 20px;
        border-bottom: 1px solid var(--line);
        font-size: 1rem;
      }
      dl {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0;
        margin: 0;
      }
      dl div {
        padding: 16px 20px;
        border-bottom: 1px solid var(--line);
      }
      dt {
        color: var(--muted);
        font-size: .75rem;
        font-weight: 800;
        text-transform: uppercase;
      }
      dd {
        margin: 8px 0 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: .9rem;
        word-break: break-word;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
        text-align: left;
        vertical-align: top;
      }
      th {
        color: var(--muted);
        font-size: .75rem;
        font-weight: 800;
        text-transform: uppercase;
      }
      .num {
        width: 96px;
        font-variant-numeric: tabular-nums;
        text-align: right;
      }
      .families {
        min-width: 320px;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0 6px 6px 0;
        padding: 5px 8px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: #f9fafb;
        color: #374151;
        font-size: .82rem;
        white-space: nowrap;
      }
      .pill b {
        color: var(--accent);
        font-variant-numeric: tabular-nums;
      }
      .muted, .empty {
        color: var(--muted);
      }
      .empty {
        padding: 24px 20px;
        text-align: center;
      }
      @media (max-width: 760px) {
        main {
          padding-top: 32px;
        }
        .top {
          display: block;
        }
        .back {
          display: inline-block;
          margin-top: 18px;
        }
        .stats, dl {
          grid-template-columns: 1fr;
        }
        table, thead, tbody, tr, th, td {
          display: block;
        }
        thead {
          display: none;
        }
        tr {
          border-bottom: 1px solid var(--line);
          padding: 12px 0;
        }
        th, td {
          border-bottom: 0;
          padding: 8px 16px;
        }
        .num {
          width: auto;
          text-align: left;
        }
        .num::before {
          display: inline-block;
          width: 88px;
          color: var(--muted);
          font-size: .75rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        td:nth-child(2)::before {
          content: "Humans";
        }
        td:nth-child(3)::before {
          content: "Crawlers";
        }
        .families {
          min-width: 0;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="top">
        <div>
          <h1>Status</h1>
          <p class="lede">Privacy-friendly page counters: one anonymous human cookie per page, plus one declared crawler family per page. No IP addresses or raw user agents are stored.</p>
        </div>
        <a href="/" class="back">Back home</a>
      </div>

      <div class="stats">
        <div class="stat"><span>Pages counted</span><strong>${
    formatCount(counts.totals.pages)
  }</strong></div>
        <div class="stat"><span>Human page visitors</span><strong>${
    formatCount(counts.totals.humans)
  }</strong></div>
        <div class="stat"><span>Crawler families</span><strong>${
    formatCount(counts.totals.bots)
  }</strong></div>
      </div>

      <section>
        <h2>Crawler Breakdown</h2>
        <div style="padding: 18px 20px 12px">${
    renderBotFamilyList(counts.botFamilies)
  }</div>
      </section>

      <section>
        <h2>Pages</h2>
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th class="num">Humans</th>
              <th class="num">Crawlers</th>
              <th>Families</th>
            </tr>
          </thead>
          <tbody>${renderPageRows(counts.pages)}</tbody>
        </table>
      </section>

      <section>
        <h2>Runtime</h2>
        <dl>${runtimeItems}</dl>
      </section>
    </main>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=UTF-8",
    },
  });
}

function extension(path: string) {
  const index = path.lastIndexOf(".");
  return index === -1 ? "" : path.slice(index).toLowerCase();
}

function filePath(pathname: string) {
  let decodedPathname: string;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }

  if (!decodedPathname.startsWith("/") || decodedPathname.includes("\0")) {
    return undefined;
  }

  const segments = decodedPathname.split("/").filter(Boolean);

  if (segments.some((segment) => segment === "." || segment === "..")) {
    return undefined;
  }

  const path = `${root}/${segments.join("/")}`;
  return decodedPathname.endsWith("/") ? `${path}/index.html` : path;
}

async function readFile(path: string) {
  try {
    return await Deno.readFile(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return undefined;
    }

    throw error;
  }
}

async function serveFile(path: string, status = 200) {
  const body = await readFile(path);

  if (!body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(body, {
    status,
    headers: {
      "content-type": contentTypes[extension(path)] ??
        "application/octet-stream",
    },
  });
}

async function handler(request: Request) {
  const requestUrl = new URL(request.url);
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (requestUrl.pathname === "/api/visitor-count") {
    return serveVisitorCount(requestUrl);
  }

  if (hostname === "www.rix1.dev") {
    requestUrl.protocol = "https:";
    requestUrl.hostname = "rix1.dev";

    return Response.redirect(requestUrl, 308);
  }

  if (requestUrl.pathname === "/status" || requestUrl.pathname === "/status/") {
    return serveStatus();
  }

  const path = filePath(requestUrl.pathname);

  if (!path) {
    return serveFile(`${root}/404.html`, 404);
  }

  const response = await serveFile(path);

  if (response.status === 404) {
    return serveFile(`${root}/404.html`, 404);
  }

  if (request.method === "GET" && path.endsWith(".html")) {
    const { cookie } = await trackHtmlVisit(request, requestUrl);

    if (cookie) {
      response.headers.set("set-cookie", cookie);
    }

    response.headers.set("cache-control", "no-store");
  }

  return response;
}

if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  Deno.serve(handler);
} else {
  Deno.serve({ port: 8000 }, handler);
  console.log("Listening on http://localhost:8000");
}
