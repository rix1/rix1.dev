export default ({ comp, title, alignment, children, url }: Lume.Data) => {
  const canonicalUrl = new URL(url, "https://rix1.dev").href;

  return (
    <html>
      <head>
        <comp.MetaTags canonicalUrl={canonicalUrl} />

        <title>{title}</title>
      </head>

      <body class="relative min-h-screen mt-12 pb-40">
        <main
          class={[
            "px-4 sm:px-6 lg:px-8 mx-auto prose lg:prose-xl prose-headings:bricolage-grotesque-heavy",
            alignment === "center" ? "text-center" : "text-left",
          ].join(" ")}
        >
          <h1 class="mb-0">{title}</h1>
          {children}
          <comp.ShareIcons withBlob />
        </main>

        <comp.SiteFooter />
        <div id="blur"></div>
      </body>
    </html>
  );
};
