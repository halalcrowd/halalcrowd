export const getCanonicalUrl = (url: URL): string => {
  const canonical = new URL(url.pathname, url.origin);
  return canonical.href;
};

export const getRobotsContent = (noindex = false): string | undefined => {
  return noindex ? "noindex,follow" : undefined;
};
