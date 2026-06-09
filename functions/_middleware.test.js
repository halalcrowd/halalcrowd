import { describe, expect, it, vi } from "vitest";
import { lowercaseRedirectUrl, onRequest } from "./_middleware.js";

describe("lowercase path middleware", () => {
  it("redirects mixed-case indexed URLs to their lowercase path", () => {
    expect(lowercaseRedirectUrl("https://halalcrowd.sg/halal-food-places/Pizza-hut-left-126C-Tengah-Drive/?ref=gsc")).toBe(
      "https://halalcrowd.sg/halal-food-places/pizza-hut-left-126c-tengah-drive/?ref=gsc"
    );
  });

  it("leaves lowercase indexed URLs and unrelated assets alone", () => {
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
