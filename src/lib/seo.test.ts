import { describe, expect, it } from "vitest";
import { getCanonicalUrl, getRobotsContent } from "./seo";

describe("seo helpers", () => {
  it("builds canonical URLs without query strings or hashes", () => {
    const canonical = getCanonicalUrl(new URL("https://halalcrowd.sg/search/?q=subway#results"));

    expect(canonical).toBe("https://halalcrowd.sg/search/");
  });

  it("normalizes canonical URLs to trailing-slash page URLs", () => {
    const canonical = getCanonicalUrl(new URL("https://halalcrowd.sg/directory"));

    expect(canonical).toBe("https://halalcrowd.sg/directory/");
  });

  it("uses noindex,follow only for pages excluded from search results", () => {
    expect(getRobotsContent(true)).toBe("noindex,follow");
    expect(getRobotsContent(false)).toBeUndefined();
  });
});
