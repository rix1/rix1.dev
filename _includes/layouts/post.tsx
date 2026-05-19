const dateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(date: Date | string) {
  return dateFormatter.format(new Date(date));
}

export default ({
  comp,
  title,
  description,
  date,
  topic,
  readingInfo,
  scripts = [],
  children,
}: Lume.Data) => {
  return (
    <html>
      <head>
        <comp.MetaTags />
        <title>{title}</title>
      </head>

      <body class="relative min-h-screen mt-12 pb-40">
        <main class="px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
          <comp.SiteNav backHref="/posts/" backLabel="Back to posts" />

          <article
            class="prose lg:prose-xl prose-headings:bricolage-grotesque-heavy"
            data-pagefind-body
          >
            <header class="mb-10">
              <div class="not-prose mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                {topic && (
                  <span class="font-semibold uppercase tracking-wide text-primary">
                    {topic}
                  </span>
                )}
                {topic && <span aria-hidden="true">&middot;</span>}
                {date && (
                  <time dateTime={new Date(date).toISOString()}>
                    {formatDate(date)}
                  </time>
                )}
                {readingInfo?.minutes && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <span>{readingInfo.minutes} min read</span>
                  </>
                )}
              </div>
              <h1 class="mb-4">{title}</h1>
              {description && (
                <p class="not-prose max-w-2xl text-xl leading-8 text-gray-600">
                  {description}
                </p>
              )}
            </header>

            {children}
          </article>

          <footer class="mx-auto mt-14 max-w-prose border-t border-primary/10 pt-8">
            <a href="/posts/" class="clear font-semibold text-primary">
              Read more thoughts
            </a>
          </footer>
        </main>

        <div id="blur"></div>
        {(scripts as string[]).map((src) => (
          <script type="module" src={src}></script>
        ))}
      </body>
    </html>
  );
};
