import { describe, expect, it } from "vitest";
import { indexablePath } from "./routes";

describe("route helpers", () => {
  it("builds internal page links with trailing slashes", () => {
    expect(indexablePath("/directory")).toBe("/directory/");
    expect(indexablePath("/halal-food-places/mcdonalds-singapore-zoo")).toBe(
      "/halal-food-places/mcdonalds-singapore-zoo/"
    );
  });

  it("preserves anchors and already canonical paths", () => {
    expect(indexablePath("/brands/mcdonalds/")).toBe("/brands/mcdonalds/");
    expect(indexablePath("/search#results")).toBe("/search/#results");
    expect(indexablePath("/")).toBe("/");
  });
});
