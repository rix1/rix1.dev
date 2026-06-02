import { allVisitorCounts, type BotFamilyCount } from "./serve/counter.ts";

export const title = "Status";
export const description =
  "Privacy-friendly page counters for rix1.dev: anonymous human cookies and declared crawler families.";
export const url = "/status/";

const fmt = new Intl.NumberFormat("en");

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
const cellClass = "px-4 py-3 border-b border-gray-200 align-top";
const numCellClass = `${cellClass} text-right tabular-nums`;
const famCellClass = `${cellClass} min-w-[18rem]`;

const Pill = ({ family }: { family: BotFamilyCount }) => (
  <span class="mr-1.5 mb-1.5 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700">
    <span>{family.label}</span>
    <b class="text-primary tabular-nums">{fmt.format(family.count)}</b>
  </span>
);

export default async ({ comp, url }: Lume.Data) => {
  const counts = await allVisitorCounts();
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
                addresses or raw user agents are stored. Counts update at
                build time.
              </p>
            </div>
            <a
              href="/"
              class="shrink-0 text-sm font-bold uppercase text-gray-500 max-md:mt-4 max-md:inline-block"
            >
              Back home
            </a>
          </div>

          <div class="my-7 grid grid-cols-3 gap-3 max-md:grid-cols-1">
            <div class={statCardClass}>
              <span class={statLabelClass}>Pages counted</span>
              <strong class={statValueClass}>
                {fmt.format(counts.totals.pages)}
              </strong>
            </div>
            <div class={statCardClass}>
              <span class={statLabelClass}>Human page visitors</span>
              <strong class={statValueClass}>
                {fmt.format(counts.totals.humans)}
              </strong>
            </div>
            <div class={statCardClass}>
              <span class={statLabelClass}>Crawler families</span>
              <strong class={statValueClass}>
                {fmt.format(counts.totals.bots)}
              </strong>
            </div>
          </div>

          <section class={sectionClass}>
            <h2 class={sectionHeaderClass}>Crawler breakdown</h2>
            <div class="px-5 pt-4 pb-3">
              {counts.botFamilies.length === 0
                ? (
                  <span class="text-sm text-gray-500">
                    No crawler visits counted yet.
                  </span>
                )
                : counts.botFamilies.map((family) => (
                  <Pill family={family} />
                ))}
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
              <tbody>
                {counts.pages.length === 0
                  ? (
                    <tr>
                      <td
                        colspan="4"
                        class="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No visits counted yet.
                      </td>
                    </tr>
                  )
                  : counts.pages.map((page) => (
                    <tr>
                      <td class={cellClass}>
                        <a href={page.path}>{page.path}</a>
                      </td>
                      <td class={numCellClass}>{fmt.format(page.humans)}</td>
                      <td class={numCellClass}>{fmt.format(page.bots)}</td>
                      <td class={famCellClass}>
                        {page.botFamilies.map((family) => (
                          <Pill family={family} />
                        ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </main>

        <comp.SiteFooter />
      </body>
    </html>
  );
};
