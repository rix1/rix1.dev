# rix1.dev &middot; my personal website

Welcome to the source repository of my personal website,
[rix1.dev](https://rix1.dev)! I'm a product developer based
in Oslo, Norway. My website showcases previous and ongoing projects as
well as my professional journey.

## About the Site

Built with Lume and served by a small Cloudflare Worker, the site reflects my
interest in products, technology, and design.

### Features

- **Project Showcases**: Detailed overviews of my latest and past projects.
- **Blog**: Insights into my professional experiences and personal interests.

![CleanShot 2024-05-11 at 13 01 33@2x](https://github.com/rix1/rix1.dev/assets/2470775/81c90cb0-8924-4f3e-9d5a-c053edc629c4)

## Built and deployed with

- [Lume](https://lume.land) - A static site generator built with Deno.
- [Deno](https://deno.land) - A secure runtime for JavaScript and TypeScript.
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - Serves the
  site and its small API.
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - Privacy-friendly page
  and crawler counters.

## Local Development

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have [Deno](https://deno.land/#installation) installed on your
machine. To install Deno, run:

```bash
curl -fsSL https://deno.land/install.sh | sh
```

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/rix1/rix1.dev.git
   cd rix1.dev
   ```
2. Start the Lume development server:
   ```bash
   deno task dev
   ```

The site should now be running on `http://localhost:3000`. Open your browser to
this address to view the site.

To test the production Worker locally (static site plus `/status`,
`/api/visitor-count` and the visitor counter, backed by a local D1 database):

```bash
deno task preview
```

## Production Runtime

Production is a Cloudflare Worker (`worker/index.ts`) that serves the Lume
build in `_site/` as static assets and counts page views in D1.

Deploys are git-ops: pushing to `main` triggers Cloudflare Workers Builds,
which builds the site and deploys the Worker. The build token has no D1 access,
so new migrations in `migrations/` are applied by hand:

```bash
deno task wrangler d1 migrations apply rix1-dev --remote
```

The visitor counter is intentionally privacy-friendly: it stores anonymous
per-page human visitor hashes and declared crawler families, but not IP
addresses or raw user agents. The hashes are salted with the
`VISITOR_COUNTER_SALT` secret:

```bash
deno task wrangler secret put VISITOR_COUNTER_SALT
```

If the salt changes later, existing anonymous visitor IDs will no longer match
new hashes, so counts may start incrementing again for returning visitors.

## Writing Posts

Posts live in `posts/*.md`. To publish a new one, add a Markdown file with this
front matter:

```yaml
---
title: My post title
description: A short summary used for the overview, RSS, and social previews.
date: 2026-05-18
topic: Build
---
```

The shared defaults in `posts/_data.yml` add the post layout, author data, and
the `post` tag automatically. For interactive posts, prefer a small browser
script or web component in `assets/` and opt into it from the post:

```yaml
scripts:
  - /assets/my-post-widget.js
```

Blog images can be normalized to the site's wide image format with ImageMagick:

```bash
deno task image:blog input.jpg assets/my-post/output.jpg
```

This exports a stripped sRGB JPEG at `1600x900` and quality `84`.

Drafts live in `drafts/*.md` with `draft: true`. Lume renders drafts while
serving locally, but `deno task build` ignores the whole `drafts/` folder so
they do not deploy.

## Contributing

I would be surprised if anyone would like to contribute to this site, but if you
find any typos feel or want to change my opinion about something, feel free to
open a PR:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b fix/your-opinion`)
3. Commit your Changes (`git commit -m 'Adjust your attitude towards X'`)
4. Push to the Branch (`git push origin fix/your-opinion`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

- @rix1 - [Twitter](https://twitter.com/rix1)
- Project Link:
  [https://github.com/rix1/rix1.dev](https://github.com/rix1/rix1.dev)
- Website: [rix1.dev](https://rix1.dev)
