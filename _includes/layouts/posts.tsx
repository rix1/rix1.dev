const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

type Post = Lume.Data & {
  title: string;
  description: string;
  date: Date | string;
  topic?: string;
  draft?: boolean;
  url: string;
  readingInfo?: {
    minutes?: number;
  };
};

function formatDate(date: Date | string) {
  return dateFormatter.format(new Date(date));
}

export default ({ comp, search, title, description }: Lume.Data) => {
  const posts = search.pages("type=post", "date=desc") as Post[];

  return (
    <html>
      <head>
        <comp.MetaTags />
        <title>rix1.dev: {title}</title>
      </head>

      <body class="relative min-h-screen mt-12 pb-40">
        <main class="px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
          <comp.SiteNav backHref="/" backLabel="Back home" />

          <header class="mb-12">
            <h1 class="bricolage-grotesque-heavy mb-4 text-4xl leading-tight sm:text-5xl">
              {title}
            </h1>
            <p class="max-w-3xl text-xl leading-8 text-gray-600">
              {description}
            </p>
          </header>

          <section class="mb-12" data-pagefind-ignore="all">
            <div id="search"></div>
          </section>

          <section class="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <article class="border-t border-primary/10 pt-6" key={post.url}>
                <a href={post.url} class="clear group block">
                  <div class="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    {post.topic && (
                      <span class="font-semibold uppercase tracking-wide text-primary">
                        {post.topic}
                      </span>
                    )}
                    {post.topic && <span aria-hidden="true">&middot;</span>}
                    <time dateTime={new Date(post.date).toISOString()}>
                      {formatDate(post.date)}
                    </time>
                    {post.draft && (
                      <span class="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-700">
                        Draft
                      </span>
                    )}
                  </div>
                  <h2 class="bricolage-grotesque-heavy mb-3 text-2xl leading-tight group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p class="leading-7 text-gray-600">{post.description}</p>
                  {post.readingInfo?.minutes && (
                    <p class="mt-5 text-sm font-medium text-gray-500">
                      {post.readingInfo.minutes} min read
                    </p>
                  )}
                </a>
              </article>
            ))}
          </section>
        </main>

        <comp.SiteFooter />
        <div id="blur"></div>
      </body>
    </html>
  );
};
