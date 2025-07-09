import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import reading_info from "lume/plugins/reading_info.ts";
import sitemap from "lume/plugins/sitemap.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import jsx from "lume/plugins/jsx.ts";
import googleFonts from "lume/plugins/google_fonts.ts";

const site = lume();

// Add assets
site.add("assets");

// Configure plugins in the correct order
site.use(jsx());
site.use(code_highlight());
site.use(date());
site.use(favicon());
site.use(reading_info());
site.use(
  googleFonts({
    cssFile: "globals.css",
    placeholder: "/* google-fonts */",
    fonts:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap",
  }),
);
site.use(tailwindcss());
site.use(feed());
site.use(sitemap());

// Add CSS files explicitly for processing
site.add([".css"]);

export default site;
