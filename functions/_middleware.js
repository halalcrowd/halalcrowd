const INDEXED_PATH_PREFIXES = [
  "/halal-food-places/",
  "/brands/",
  "/neighbourhoods/",
  "/malls/",
  "/mrt-stations/"
];

export function lowercaseRedirectUrl(requestUrl) {
  const url = new URL(requestUrl);
  if (!INDEXED_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return null;

  let canonicalPath = url.pathname.toLowerCase();
  const lastSegment = canonicalPath.split("/").pop() ?? "";
  if (!canonicalPath.endsWith("/") && !lastSegment.includes(".")) {
    canonicalPath = `${canonicalPath}/`;
  }

  if (url.pathname === canonicalPath) return null;

  url.pathname = canonicalPath;
  return url.href;
}

export const onRequest = [
  async ({ request, next }) => {
    const redirectUrl = lowercaseRedirectUrl(request.url);
    if (redirectUrl) return Response.redirect(redirectUrl, 301);

    return next();
  }
];
