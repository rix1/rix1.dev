export const title = "Status";
export const description =
  "Privacy-friendly page counters for rix1.dev: anonymous human cookies and declared crawler families.";
export const url = "/status/";

const statusScript = `
const fmt = new Intl.NumberFormat("en");
const numCell = "text-right tabular-nums px-4 py-3 border-b border-gray-200 align-top";
const linkCell = "px-4 py-3 border-b border-gray-200 align-top";
const famCell = "px-4 py-3 border-b border-gray-200 align-top min-w-[18rem]";

function pill(label, count) {
  const el = document.createElement("span");
  el.className = "inline-flex items-center gap-2 mr-1.5 mb-1.5 px-2 py-1 border border-gray-200 rounded-full bg-gray-50 text-gray-700 text-sm whitespace-nowrap";
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
  link.className = linkCell;
  const a = document.createElement("a");
  a.href = page.path;
  a.textContent = page.path;
  link.append(a);
  const humans = document.createElement("td");
  humans.className = numCell;
  humans.textContent = fmt.format(page.humans);
  const bots = document.createElement("td");
  bots.className = numCell;
  bots.textContent = fmt.format(page.bots);
  const fams = document.createElement("td");
  fams.className = famCell;
  page.botFamilies.forEach((f) => fams.append(pill(f.label, f.count)));
  tr.append(link, humans, bots, fams);
  return tr;
}

function emptyRow() {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 4;
  td.className = "px-4 py-6 text-center text-gray-500";
  td.textContent = "No visits counted yet.";
  tr.append(td);
  return tr;
}

try {
  const res = await fetch("/api/status");
  const data = await res.json();
  document.getElementById("stat-pages").textContent = fmt.format(data.totals.pages);
  document.getElementById("stat-humans").textContent = fmt.format(data.totals.humans);
  document.getElementById("stat-bots").textContent = fmt.format(data.totals.bots);
  const crawlers = document.getElementById("crawlers");
  crawlers.replaceChildren(...data.botFamilies.map((f) => pill(f.label, f.count)));
  const tbody = document.getElementById("page-rows");
  tbody.replaceChildren(...(data.pages.length ? data.pages.map(row) : [emptyRow()]));
} catch (error) {
  document.getElementById("status-error").textContent = "Could not load status data.";
  console.error(error);
}
`;

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
                    colSpan={4}
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
