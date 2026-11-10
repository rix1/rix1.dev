export const title = "Status";
export const description =
  "Page hit counters for rix1.dev, split into humans and declared crawlers. No cookies.";
export const url = "/status/";

const statCardClass = "bg-white border border-gray-200 rounded-lg p-4";
const statLabelClass =
  "block text-xs font-extrabold uppercase tracking-wide text-gray-500";
const statValueClass = "block mt-2 text-3xl leading-none";
const sectionClass =
  "bg-white border border-gray-200 rounded-lg mt-4 overflow-hidden";
const sectionHeaderClass =
  "m-0 px-5 py-4 border-b border-gray-200 text-base font-semibold";
const thBase =
  "px-4 py-3 border-b border-gray-200 text-xs font-extrabold uppercase tracking-wide text-gray-500";
const thClass = `${thBase} text-left`;
const numThClass = `${thBase} text-right w-24`;

const statusScript = `
const fmt = new Intl.NumberFormat("en");
const pillClass = "mr-1.5 mb-1.5 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700";
const cellClass = "px-4 py-3 border-b border-gray-200 align-top";
const numCellClass = cellClass + " text-right tabular-nums";
const famCellClass = cellClass + " min-w-[18rem]";

function pill(label, count, recent) {
  const el = document.createElement("span");
  el.className = pillClass;
  const name = document.createElement("span");
  name.textContent = label;
  const value = document.createElement("b");
  value.className = "text-primary tabular-nums";
  value.textContent = fmt.format(count);
  el.append(name, value);
  if (recent !== undefined) {
    const week = document.createElement("span");
    week.className = "text-xs text-gray-500 tabular-nums";
    week.textContent = fmt.format(recent) + " this week";
    el.append(week);
  }
  return el;
}

function row(page) {
  const tr = document.createElement("tr");
  const link = document.createElement("td");
  link.className = cellClass;
  const a = document.createElement("a");
  a.href = page.path;
  a.textContent = page.path;
  link.append(a);
  const hits = document.createElement("td");
  hits.className = numCellClass;
  hits.textContent = fmt.format(page.hits);
  const humans = document.createElement("td");
  humans.className = numCellClass;
  humans.textContent = fmt.format(page.humans);
  const bots = document.createElement("td");
  bots.className = numCellClass;
  bots.textContent = fmt.format(page.bots);
  const fams = document.createElement("td");
  fams.className = famCellClass;
  page.botFamilies.forEach((f) => fams.append(pill(f.label, f.count)));
  tr.append(link, hits, humans, bots, fams);
  return tr;
}

const botColor = "bg-[#2a78d6]";
const humanColor = "bg-[#eb6834]";

function niceMax(value) {
  if (value <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  return [1, 2, 4, 5, 10].map((m) => m * pow).find((step) => value <= step);
}

function dayLabel(day) {
  return new Date(day + "T00:00:00Z").toLocaleDateString("en", { day: "numeric", month: "short", timeZone: "UTC" });
}

function count(n, noun) {
  return fmt.format(n) + " " + noun + (n === 1 ? "" : "s");
}

function segment(color, value, max, rounded) {
  const el = document.createElement("div");
  el.className = color + " w-full max-w-6 min-h-0.5" + (rounded ? " rounded-t" : "");
  el.style.height = (value / max * 100) + "%";
  return el;
}

function renderChart(days) {
  const max = niceMax(Math.max(...days.map((d) => d.humans + d.bots)));
  const readout = document.getElementById("chart-readout");
  const total = days.reduce((sum, d) => ({ humans: sum.humans + d.humans, bots: sum.bots + d.bots }), { humans: 0, bots: 0 });
  const summary = "Last " + days.length + " days: " + count(total.bots, "bot") + ", " + count(total.humans, "human");
  readout.textContent = summary;

  document.getElementById("chart-axis").replaceChildren(
    ...[max, max / 2, 0].map((tick) => {
      const el = document.createElement("span");
      el.textContent = fmt.format(tick);
      return el;
    })
  );

  const bars = document.getElementById("chart-bars");
  bars.replaceChildren(
    ...days.map((d) => {
      const col = document.createElement("div");
      col.className = "flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-0.5 rounded-t hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none";
      col.tabIndex = 0;
      const text = dayLabel(d.day) + ": " + count(d.bots, "bot") + ", " + count(d.humans, "human");
      col.setAttribute("aria-label", text);
      if (d.humans) col.append(segment(humanColor, d.humans, max, true));
      if (d.bots) col.append(segment(botColor, d.bots, max, !d.humans));
      const show = () => { readout.textContent = text; };
      const reset = () => { readout.textContent = summary; };
      col.addEventListener("pointerenter", show);
      col.addEventListener("focus", show);
      col.addEventListener("pointerleave", reset);
      col.addEventListener("blur", reset);
      return col;
    })
  );

  const ends = [days[0], days[Math.floor(days.length / 2)], days[days.length - 1]];
  document.getElementById("chart-days").replaceChildren(
    ...ends.map((d) => {
      const el = document.createElement("span");
      el.textContent = dayLabel(d.day);
      return el;
    })
  );
}

function emptyRow(message) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 5;
  td.className = "px-4 py-6 text-center text-sm text-gray-500";
  td.textContent = message;
  tr.append(td);
  return tr;
}

try {
  const res = await fetch("/api/status");
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  document.getElementById("stat-hits").textContent = fmt.format(data.totals.hits);
  document.getElementById("stat-humans").textContent = fmt.format(data.totals.humans);
  document.getElementById("stat-bots").textContent = fmt.format(data.totals.bots);
  document.getElementById("stat-bots-recent").textContent = fmt.format(data.recent.bots);
  if (data.since) {
    const since = new Date(data.since + "T00:00:00Z");
    document.getElementById("since").textContent = " Counting since " +
      since.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) + ".";
  }
  renderChart(data.days);
  const crawlers = document.getElementById("crawlers");
  crawlers.replaceChildren(
    ...(data.botFamilies.length
      ? data.botFamilies.map((f) => pill(f.label, f.count, f.recent))
      : [Object.assign(document.createElement("span"), { className: "text-sm text-gray-500", textContent: "No crawler hits counted yet." })])
  );
  const tbody = document.getElementById("page-rows");
  tbody.replaceChildren(
    ...(data.pages.length ? data.pages.map(row) : [emptyRow("No hits counted yet.")])
  );
} catch (error) {
  document.getElementById("status-error").textContent = "Could not load status data.";
  console.error(error);
}
`;

export default ({ comp, url }: Lume.Data) => {
  const canonicalUrl = new URL(url, "https://rix1.dev").href;

  return (
    <html>
      <head>
        <comp.MetaTags canonicalUrl={canonicalUrl} />
        <title>{title} - rix1.dev</title>
      </head>
      <body class="relative min-h-screen pb-40">
        <main class="mx-auto box-border w-full max-w-5xl px-5 pt-12 pb-16">
          <div class="mb-7 flex items-end justify-between gap-6 max-md:block">
            <div>
              <h1 class="bricolage-grotesque-heavy m-0 text-5xl leading-none md:text-6xl">
                Status
              </h1>
              <p class="mt-3 max-w-xl text-base leading-relaxed text-gray-500">
                Every page load counts as a hit, split into humans and declared
                crawlers by user agent. No cookies; no IP addresses or raw user
                agents are stored.
                <span id="since"></span>
              </p>
            </div>
            <a
              href="/"
              class="shrink-0 text-sm font-bold uppercase text-gray-500 max-md:mt-4 max-md:inline-block"
            >
              Back home
            </a>
          </div>

          <p id="status-error" class="text-sm text-primary"></p>

          <div class="my-7 grid grid-cols-4 gap-3 max-md:grid-cols-2">
            <div class={statCardClass}>
              <span class={statLabelClass}>Page hits</span>
              <strong id="stat-hits" class={statValueClass}>—</strong>
            </div>
            <div class={statCardClass}>
              <span class={statLabelClass}>Humans</span>
              <strong id="stat-humans" class={statValueClass}>—</strong>
            </div>
            <div class={statCardClass}>
              <span class={statLabelClass}>Bots</span>
              <strong id="stat-bots" class={statValueClass}>—</strong>
            </div>
            <div class={statCardClass}>
              <span class={statLabelClass}>Bots, last 7 days</span>
              <strong id="stat-bots-recent" class={statValueClass}>—</strong>
            </div>
          </div>

          <section class={sectionClass}>
            <h2 class={sectionHeaderClass}>Hits per day</h2>
            <div class="px-5 pt-4 pb-5">
              <div class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-sm bg-[#2a78d6]"></span>
                  Bots
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-sm bg-[#eb6834]"></span>
                  Humans
                </span>
                <span
                  id="chart-readout"
                  aria-live="polite"
                  class="ml-auto tabular-nums text-gray-500"
                >
                </span>
              </div>
              <div class="flex gap-3">
                <div
                  id="chart-axis"
                  class="flex h-40 w-8 shrink-0 flex-col justify-between text-right text-xs leading-none tabular-nums text-gray-500"
                >
                </div>
                <div class="min-w-0 flex-1">
                  <div class="relative h-40">
                    <div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
                      <div class="border-t border-gray-100"></div>
                      <div class="border-t border-gray-100"></div>
                      <div class="border-t border-gray-300"></div>
                    </div>
                    <div
                      id="chart-bars"
                      class="relative flex h-full items-end gap-0.5"
                    >
                    </div>
                  </div>
                  <div
                    id="chart-days"
                    class="mt-2 flex justify-between text-xs text-gray-500"
                  >
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class={sectionClass}>
            <h2 class={sectionHeaderClass}>Crawler breakdown</h2>
            <div id="crawlers" class="px-5 pt-4 pb-3 text-sm text-gray-500">
              Loading…
            </div>
          </section>

          <section class={sectionClass}>
            <h2 class={sectionHeaderClass}>Pages</h2>
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class={thClass}>Page</th>
                  <th class={numThClass}>Hits</th>
                  <th class={numThClass}>Humans</th>
                  <th class={numThClass}>Bots</th>
                  <th class={thClass}>Crawlers</th>
                </tr>
              </thead>
              <tbody id="page-rows">
                <tr>
                  <td
                    colspan="5"
                    class="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Loading…
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>

        <comp.SiteFooter />
        <script type="module">{{ __html: statusScript }}</script>
      </body>
    </html>
  );
};
