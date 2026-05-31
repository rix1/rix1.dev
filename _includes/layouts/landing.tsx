type Project = {
  title: string;
  when: string;
  ai?: boolean;
  wip?: boolean;
  status?: "broken" | "live" | "unfinished";
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
      <body class="prose relative mx-auto my-12 max-w-7xl px-4 prose-headings:bricolage-grotesque-heavy sm:my-16 sm:px-6 sm:prose-lg lg:my-24 lg:px-8 lg:prose-xl">
        <main class="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)] lg:gap-14">
          <div class="max-w-2xl">
            <comp.FancyHeading>{heading}</comp.FancyHeading>
            {children}
          </div>
          <div class="mb-[1.2em] text-base sm:text-[1.25rem]">
            <div class="blob-wrapper relative mx-auto max-w-[min(100%,22rem)]">
              <div
                class="not-prose mx-auto my-0 p-0 [--image-size:240px] sm:[--image-size:280px] md:[--image-size:360px] lg:[--image-size:400px]"
                id="blobby-avatar"
              />
              <div id="blob"></div>
            </div>
            <comp.ShareIcons />
          </div>
        </main>

        <section class="mt-16 sm:mt-24">
          <h2 class="mb-8 text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {index.repos.length} of my latest creations:
          </h2>
          <div class="grid grid-flow-row grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3">
            {(index.repos as Project[]).sort(compareFn).map((project) => (
              <article key={project.title} class="mb-2 max-w-none">
                <p class="not-prose my-0 inline-flex flex-wrap items-baseline gap-2">
                  <a href={project.link} class="font-semibold underline">
                    {project.title}
                  </a>
                  &middot;
                  <span class="rounded-full text-sm">{project.when}</span>
                  {project.ai && (
                    <span class="rounded-full border border-primary/15 bg-primary/5 px-1.5 py-0.5 text-[0.68rem] font-medium uppercase leading-none tracking-wide text-primary/80">
                      AI
                    </span>
                  )}
                  {project.wip && (
                    <span class="rounded-full border border-gray-300/70 bg-gray-50 px-1.5 py-0.5 text-[0.68rem] font-medium uppercase leading-none tracking-wide text-gray-600">
                      WIP
                    </span>
                  )}
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
        <comp.SiteFooter />
        <div id="blur"></div>
      </body>
    </html>
  );
};
