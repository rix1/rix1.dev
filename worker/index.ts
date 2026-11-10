import { recordPageHit, servePageCount, serveStatus } from "./counter.ts";
import type { Env, ExecutionContext } from "./types.ts";

// Serves the Lume build in _site/ as static assets. Every request runs through
// here first so page hits can be counted.
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.hostname === "www.rix1.dev") {
      url.protocol = "https:";
      url.hostname = "rix1.dev";
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/api/visitor-count") {
      return servePageCount(env.DB, url);
    }

    if (url.pathname === "/api/status") {
      return serveStatus(env.DB);
    }

    const asset = await env.ASSETS.fetch(request);
    const isPageView = request.method === "GET" && asset.status === 200 &&
      (asset.headers.get("content-type") ?? "").startsWith("text/html");

    if (!isPageView) {
      return asset;
    }

    const response = new Response(asset.body, asset);
    // Every load has to reach the Worker to be counted.
    response.headers.set("cache-control", "no-store");
    // Workers assets send a bare `text/html`; without a charset browsers guess.
    response.headers.set("content-type", "text/html; charset=utf-8");

    try {
      ctx.waitUntil(
        recordPageHit(env.DB, request, url).catch((error) =>
          console.warn("Page hit counter failed:", error)
        ),
      );
    } catch (error) {
      console.warn("Page hit counter failed:", error);
    }

    return response;
  },
};
