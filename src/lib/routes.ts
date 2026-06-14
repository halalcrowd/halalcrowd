export const indexablePath = (path: string): string => {
  const suffixStart = path.search(/[?#]/);
  const pathname = suffixStart === -1 ? path : path.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? "" : path.slice(suffixStart);

  if (!pathname || pathname === "/" || pathname.endsWith("/")) {
    return `${pathname || "/"}${suffix}`;
  }

  return `${pathname}/${suffix}`;
};
