export type SafePath = { decoded: string; segments: string[] };

export function safePath(pathname: string): SafePath | undefined {
  let decoded: string;

  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }

  if (!decoded.startsWith("/") || decoded.includes("\0")) {
    return undefined;
  }

  const segments = decoded.split("/").filter(Boolean);

  if (segments.some((segment) => segment === "." || segment === "..")) {
    return undefined;
  }

  return { decoded, segments };
}

export function normalizePagePath(pathname: string) {
  const parsed = safePath(pathname);

  if (!parsed || parsed.segments.length === 0) {
    return "/";
  }

  return `/${parsed.segments.join("/")}/`;
}
