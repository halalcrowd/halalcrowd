import { describe, expect, it, vi } from "vitest";
import { lowercaseRedirectUrl, onRequest } from "./_middleware.js";

describe("lowercase path middleware", () => {
  it("redirects mixed-case indexed URLs to their lowercase path", () => {
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/halal-food-places/Pizza-hut-left-126C-Tengah-Drive/?ref=gsc")).toBe(
      "https://halalcrowd.sg/halal-food-places/pizza-hut-left-126c-tengah-drive/?ref=gsc"
    );
  });

  it("redirects indexed page URLs without trailing slashes to their canonical page path", () => {
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/halal-food-places/kfc-lentor-modern")).toBe(
      "https://halalcrowd.sg/halal-food-places/kfc-lentor-modern/"
    );
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/malls/junction-10?ref=gsc")).toBe(
      "https://halalcrowd.sg/malls/junction-10/?ref=gsc"
    );
  });

  it("normalizes mixed-case and missing trailing slash indexed URLs in one redirect", () => {
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/brands/Dynamic-Dining-House")).toBe(
      "https://halalcrowd.sg/brands/dynamic-dining-house/"
    );
  });

  it("leaves lowercase indexed URLs and unrelated assets alone", () => {
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/halal-food-places/kfc-lentor-modern/")).toBeNull();
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/brands/mcdonalds/")).toBeNull();
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/assets/HalalCrowd.png")).toBeNull();
  });

  it("returns a 301 response for legacy mixed-case indexed paths", async () => {
    const next = vi.fn();
    const response = await onRequest[0]({
      request: new Request("https://halalcrowd.sg/brands/McDonalds-SG/"),
      next
    });

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://halalcrowd.sg/brands/mcdonalds-sg/");
    expect(next).not.toHaveBeenCalled();
  });
});
