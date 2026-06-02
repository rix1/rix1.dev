export const title = "Status";
export const description =
  "Privacy-friendly page counters for rix1.dev: anonymous human cookies and declared crawler families.";
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

function pill(label, count) {
  const el = document.createElement("span");
  el.className = pillClass;
  const name = document.createElement("span");
  name.textContent = label;
  const value = document.createElement("b");
  value.className = "text-primary tabular-nums";
  value.textContent = fmt.format(count);
  el.append(name, value);
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
  const humans = document.createElement("td");
  humans.className = numCellClass;
  humans.textContent = fmt.format(page.humans);
  const bots = document.createElement("td");
  bots.className = numCellClass;
  bots.textContent = fmt.format(page.bots);
  const fams = document.createElement("td");
  fams.className = famCellClass;
  page.botFamilies.forEach((f) => fams.append(pill(f.label, f.count)));
  tr.append(link, humans, bots, fams);
  return tr;
}

function emptyRow(message) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 4;
  td.className = "px-4 py-6 text-center text-sm text-gray-500";
  td.textContent = message;
  tr.append(td);
  return tr;
}

try {
  const res = await fetch("/api/status");
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  document.getElementById("stat-pages").textContent = fmt.format(data.totals.pages);
  document.getElementById("stat-humans").textContent = fmt.format(data.totals.humans);
  document.getElementById("stat-bots").textContent = fmt.format(data.totals.bots);
  const crawlers = document.getElementById("crawlers");
  crawlers.replaceChildren(
    ...(data.botFamilies.length
      ? data.botFamilies.map((f) => pill(f.label, f.count))
      : [Object.assign(document.createElement("span"), { className: "text-sm text-gray-500", textContent: "No crawler visits counted yet." })])
  );
  const tbody = document.getElementById("page-rows");
  tbody.replaceChildren(
    ...(data.pages.length ? data.pages.map(row) : [emptyRow("No visits counted yet.")])
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
                Privacy-friendly page counters: one anonymous human cookie per
                page, plus one declared crawler family per page. No IP
                addresses or raw user agents are stored.
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

          <div class="my-7 grid grid-cols-3 gap-3 max-md:grid-cols-1">
            <div class={statCardClass}>
              <span class={statLabelClass}>Pages counted</span>
              <strong id="stat-pages" class={statValueClass}>—</strong>
            </div>
            <div class={statCardClass}>
              <span class={statLabelClass}>Human page visitors</span>
              <strong id="stat-humans" class={statValueClass}>—</strong>
            </div>
            <div class={statCardClass}>
              <span class={statLabelClass}>Crawler families</span>
              <strong id="stat-bots" class={statValueClass}>—</strong>
            </div>
          </div>

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
                  <th class={numThClass}>Humans</th>
                  <th class={numThClass}>Crawlers</th>
                  <th class={thClass}>Families</th>
                </tr>
              </thead>
              <tbody id="page-rows">
                <tr>
                  <td
                    colspan="4"
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
