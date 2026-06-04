import { describe, expect, it } from "vitest";
import { parseBrandDescription } from "./rich-text";

describe("parseBrandDescription", () => {
  it("converts markdown-style headings and paragraphs into blog blocks", () => {
    expect(parseBrandDescription("# About\n\n## Signature menu\nChicken rice and nasi lemak.")).toEqual([
      { type: "h1", text: "About" },
      { type: "h2", text: "Signature menu" },
      { type: "paragraph", text: "Chicken rice and nasi lemak." }
    ]);
  });

  it("keeps multiline paragraphs together and ignores empty input", () => {
    expect(parseBrandDescription("First line\nsecond line\n\n")).toEqual([
      { type: "paragraph", text: "First line second line" }
    ]);
    expect(parseBrandDescription("  ")).toEqual([]);
  });

  it("infers blog headings from plain Airtable multiline copy", () => {
    expect(
      parseBrandDescription(
        "Brand Guide: What to Order\n\nA Halal Fast Food Favourite\n\nThis brand is popular with families.\n\nIs it halal-certified?\n\nYes, it is."
      )
    ).toEqual([
      { type: "h1", text: "Brand Guide: What to Order" },
      { type: "h2", text: "A Halal Fast Food Favourite" },
      { type: "paragraph", text: "This brand is popular with families." },
      { type: "h2", text: "Is it halal-certified?" },
      { type: "paragraph", text: "Yes, it is." }
    ]);
  });
});
