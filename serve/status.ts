import {
  allVisitorCounts,
  type BotFamilyCount,
  type PageCounts,
} from "./counter.ts";

const numberFormatter = new Intl.NumberFormat("en");

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

export async function serveStatus() {
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
