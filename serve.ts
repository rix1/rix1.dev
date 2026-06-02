import {
  serveVisitorCount,
  serveVisitorStatus,
  trackHtmlVisit,
} from "./serve/counter.ts";
import { filePath, serveFile } from "./serve/files.ts";

const root = `${Deno.cwd()}/_site`;

async function handler(request: Request) {
  const requestUrl = new URL(request.url);
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (requestUrl.pathname === "/api/visitor-count") {
    return serveVisitorCount(requestUrl);
  }

  if (requestUrl.pathname === "/api/status") {
    return serveVisitorStatus();
  }

  if (hostname === "www.rix1.dev") {
    requestUrl.protocol = "https:";
    requestUrl.hostname = "rix1.dev";

    return Response.redirect(requestUrl, 308);
  }

  const path = filePath(root, requestUrl.pathname);

  if (!path) {
    return serveFile(`${root}/404.html`, 404);
  }

  const response = await serveFile(path);

  if (response.status === 404) {
    return serveFile(`${root}/404.html`, 404);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (request.method === "GET" && contentType.startsWith("text/html")) {
    const { cookie } = await trackHtmlVisit(request, requestUrl);

    if (cookie) {
      response.headers.set("set-cookie", cookie);
    }

    response.headers.set("cache-control", "no-store");
  }

  return response;
}

if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  Deno.serve(handler);
} else {
  Deno.serve({ port: 8000 }, handler);
  console.log("Listening on http://localhost:8000");
}
