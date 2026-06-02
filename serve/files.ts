import { safePath } from "./paths.ts";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=UTF-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=UTF-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".webp": "image/webp",
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

export function filePath(root: string, pathname: string) {
  const parsed = safePath(pathname);

  if (!parsed) {
    return undefined;
  }

  const path = `${root}/${parsed.segments.join("/")}`;
  return parsed.decoded.endsWith("/") ? `${path}/index.html` : path;
}

async function loadFile(
  path: string,
): Promise<{ body: Uint8Array<ArrayBuffer>; path: string } | undefined> {
  try {
    return { body: await Deno.readFile(path), path };
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return undefined;
    }

    if (error instanceof Deno.errors.IsADirectory) {
      return loadFile(`${path}/index.html`);
    }

    throw error;
  }
}

export async function serveFile(path: string, status = 200) {
  const file = await loadFile(path);

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(file.body, {
    status,
    headers: {
      "content-type": contentTypes[extension(file.path)] ??
        "application/octet-stream",
    },
  });
}
