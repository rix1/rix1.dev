type Project = {
  title: string;
  when: string;
  status: "broken" | "live" | "unfinished";
  description: string;
  link: string;
  repo?: string;
};

function markdownToHtmlLinks(markdown: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return markdown.replace(regex, '<a href="$2">$1</a>');
}

function compareFn(a: Project, b: Project) {
  return Number(b.when) - Number(a.when);
}

export default ({ comp, title, heading, children, index }: Lume.Data) => {
  return (
    <html>
      <head>
        <comp.MetaTags />

        <title>{title}</title>
      </head>
      <body class="relative mx-auto my-24 max-w-7xl px-4 sm:px-6 lg:px-8 prose lg:prose-xl prose-headings:bricolage-grotesque-heavy">
        <main class="grid items-end gap-4 md:grid-cols-2">
          <div>
            <comp.FancyHeading>{heading}</comp.FancyHeading>
            {children}
          </div>
          <div class="mb-[1.2em] font-[1.25rem]">
            <div class="relative blob-wrapper">
              <div
                class="not-prose mx-auto my-0 p-0 md:[--image-size:400px]"
                id="blobby-avatar"
              />
              <div id="blob"></div>
            </div>
            <comp.ShareIcons />
          </div>
        </main>

        <section class="mt-24">
          <h2 class="mb-8">{index.repos.length} of my latest creations:</h2>
          <div class="grid grid-flow-row grid-cols-2 gap-6 md:grid-cols-3 lg:grid-rows-3">
            {(index.repos as Project[]).sort(compareFn).map((project) => (
              <article key={project.title} class="mb-4 max-w-xs">
                <p class="not-prose my-0 inline-flex flex-wrap items-baseline gap-2">
                  <a href={project.link} class="font-semibold underline">
                    {project.title}
                  </a>
                  &middot;
                  <span class="rounded-full text-sm">{project.when}</span>
                </p>
                <p class="not-prose my-0 block">
                  {{ __html: markdownToHtmlLinks(project.description) }}
                </p>
                {project.repo && (
                  <div class="self-end">
                    <a
                      href={project.repo}
                      class="clear text-base no-underline group hover:bg-gray-100 px-2 py-1 rounded-md"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="mr-2 inline-block align-middle text-primary"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                      </svg>
                      Repository
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
        <div id="blur"></div>
      </body>
    </html>
  );
};
