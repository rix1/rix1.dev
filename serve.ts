const root = `${Deno.cwd()}/_site`;

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=UTF-8",
  ".html": "text/html; charset=UTF-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".rss": "application/rss+xml; charset=UTF-8",
  ".svg": "image/svg+xml; charset=UTF-8",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=UTF-8",
};

function extension(path: string) {
  const index = path.lastIndexOf(".");
  return index === -1 ? "" : path.slice(index).toLowerCase();
}

function filePath(pathname: string) {
  let decodedPathname: string;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }

  if (!decodedPathname.startsWith("/") || decodedPathname.includes("\0")) {
    return undefined;
  }

  const segments = decodedPathname.split("/").filter(Boolean);

  if (segments.some((segment) => segment === "." || segment === "..")) {
    return undefined;
  }

  const path = `${root}/${segments.join("/")}`;
  return decodedPathname.endsWith("/") ? `${path}/index.html` : path;
}

async function readFile(path: string) {
  try {
    return await Deno.readFile(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return undefined;
    }

    throw error;
  }
}

async function serveFile(path: string, status = 200) {
  const body = await readFile(path);

  if (!body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(body, {
    status,
    headers: {
      "content-type": contentTypes[extension(path)] ??
        "application/octet-stream",
    },
  });
}

async function handler(request: Request) {
  const requestUrl = new URL(request.url);
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (hostname === "www.rix1.dev") {
    requestUrl.protocol = "https:";
    requestUrl.hostname = "rix1.dev";

    return Response.redirect(requestUrl, 308);
  }

  const path = filePath(requestUrl.pathname);

  if (!path) {
    return serveFile(`${root}/404.html`, 404);
  }

  const response = await serveFile(path);

  if (response.status === 404) {
    return serveFile(`${root}/404.html`, 404);
  }

  return response;
}

if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  Deno.serve(handler);
} else {
  Deno.serve({ port: 8000 }, handler);
  console.log("Listening on http://localhost:8000");
}
