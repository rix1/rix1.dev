---
name: add-project
description: Add a new project to the rix1.dev landing page. Use when Rikard wants a new project, site or experiment listed on his homepage.
---

# Add a project to rix1.dev

Projects live in `_data/index.js` as the `repos` array, rendered by
`_includes/layouts/landing.tsx` and sorted by `when` descending (array order
breaks ties within a year — newest first).

## Steps

1. **Sync first**: `git pull --rebase`. This checkout is often behind the
   remote, and `_data/index.js` is where conflicts land.

2. **Prepend an entry** to `repos` in `_data/index.js`:

   ```js
   {
     title: "Project name",
     when: "2026",              // year as a string
     ai: true,                  // only if substantially AI-built
     wip: true,                 // only if unfinished/experimental
     description:
       "One casual sentence. Markdown links work. Optionally end with 'Built with X.'",
     link: "https://project.rix1.dev",   // live site preferred; repo URL if none
     repo: "https://github.com/rix1/project",  // OPTIONAL — omit entirely if the repo is private
   },
   ```

   - `repo` is rendered conditionally; a private repo link would 404 for
     visitors, so leave the field out rather than pointing at a 404.
   - Match the existing tone: short, playful, first person.

3. **Verify the build**:

   ```sh
   deno task build
   grep "Project name" _site/index.html
   ```

4. **Commit and push** (no GPG — signing hangs in non-interactive shells):

   ```sh
   git add _data/index.js
   git commit --no-gpg-sign -m "Add <project> to projects"
   git push
   ```

   Deno Deploy publishes automatically on push to `main`.
