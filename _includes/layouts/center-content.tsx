export default ({ comp, title, alignment, children }: Lume.Data) => {
  return (
    <html>
      <head>
        <comp.MetaTags />

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

        <div id="blur"></div>
      </body>
    </html>
  );
};
