import {
  serveVisitorCount,
  serveVisitorStatus,
  trackHtmlVisit,
} from "./counter.ts";
import type { Env, ExecutionContext } from "./types.ts";

// Serves the Lume build in _site/ as static assets. Every request runs through
// here first so page views can be counted.
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.hostname === "www.rix1.dev") {
      url.protocol = "https:";
      url.hostname = "rix1.dev";
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/api/visitor-count") {
      return serveVisitorCount(env.DB, url);
    }

    if (url.pathname === "/api/status") {
      return serveVisitorStatus(env.DB);
    }

    const asset = await env.ASSETS.fetch(request);
    const isPageView = request.method === "GET" && asset.status === 200 &&
      (asset.headers.get("content-type") ?? "").startsWith("text/html");

    if (!isPageView) {
      return asset;
    }

    const response = new Response(asset.body, asset);
    response.headers.set("cache-control", "no-store");

    try {
      const { cookie, write } = await trackHtmlVisit(
        env.DB,
        env.VISITOR_COUNTER_SALT ?? "rix1.dev visitor counter",
        request,
        url,
      );

      if (cookie) {
        response.headers.set("set-cookie", cookie);
      }

      ctx.waitUntil(
        write.catch((error) => console.warn("Visitor counter failed:", error)),
      );
    } catch (error) {
      console.warn("Visitor counter failed:", error);
    }

    return response;
  },
};
