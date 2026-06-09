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

  const lowercasePath = url.pathname.toLowerCase();
  if (url.pathname === lowercasePath) return null;

  url.pathname = lowercasePath;
  return url.href;
}

export const onRequest = [
  async ({ request, next }) => {
    const redirectUrl = lowercaseRedirectUrl(request.url);
    if (redirectUrl) return Response.redirect(redirectUrl, 301);

    return next();
  }
];
