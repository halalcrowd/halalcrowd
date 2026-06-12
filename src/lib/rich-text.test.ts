import { describe, expect, it } from "vitest";
import { normalizeBrandDescriptionForPage, parseBrandDescription } from "./rich-text";

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

  it("normalizes Airtable description headings under the brand page H1", () => {
    expect(normalizeBrandDescriptionForPage("# About McDonald's\n\n## Singapore halal outlets\nA family-friendly brand.")).toEqual([
      { type: "h2", text: "About McDonald's" },
      { type: "h3", text: "Singapore halal outlets" },
      { type: "paragraph", text: "A family-friendly brand." }
    ]);
  });

  it("splits plain Airtable paragraphs that start with a section heading", () => {
    expect(
      normalizeBrandDescriptionForPage(
        "McDonald's Singapore: The Halal Place\n\nA Record-Breaking Beginning The story of McDonald's in Singapore begins at Liat Towers, where opening-day crowds made the brand part of the city's fast food history from the start."
      )
    ).toEqual([
      { type: "h2", text: "McDonald's Singapore: The Halal Place" },
      { type: "h3", text: "A Record-Breaking Beginning" },
      {
        type: "paragraph",
        text: "The story of McDonald's in Singapore begins at Liat Towers, where opening-day crowds made the brand part of the city's fast food history from the start."
      }
    ]);
  });

  it("keeps near-me wording inside the inferred heading", () => {
    expect(
      normalizeBrandDescriptionForPage(
        "McDonald's Singapore: The Halal Place\n\nWhere to Find McDonald's Near Me With more than 135 outlets across Singapore, the brand is never far away, especially around malls, MRT stations, and neighbourhood centres."
      )
    ).toEqual([
      { type: "h2", text: "McDonald's Singapore: The Halal Place" },
      { type: "h3", text: "Where to Find McDonald's Near Me" },
      {
        type: "paragraph",
        text: "With more than 135 outlets across Singapore, the brand is never far away, especially around malls, MRT stations, and neighbourhood centres."
      }
    ]);
  });

  it("does not promote body paragraphs that start with sentence copy", () => {
    expect(
      normalizeBrandDescriptionForPage(
        "McDonald's Singapore: The Halal Place\n\nBack then, a hamburger cost just $0.95, and for many Singaporeans a visit felt like a genuine occasion."
      )
    ).toEqual([
      { type: "h2", text: "McDonald's Singapore: The Halal Place" },
      {
        type: "paragraph",
        text: "Back then, a hamburger cost just $0.95, and for many Singaporeans a visit felt like a genuine occasion."
      }
    ]);
  });

  it("keeps title-case section names whole before splitting body copy", () => {
    expect(
      normalizeBrandDescriptionForPage(
        "McDonald's Singapore: The Halal Place\n\nThe Classics That Built the Brand The Big Mac is the global icon that needs no introduction and continues to be ordered at outlets across Singapore by families, commuters, and late-night diners."
      )
    ).toEqual([
      { type: "h2", text: "McDonald's Singapore: The Halal Place" },
      { type: "h3", text: "The Classics That Built the Brand" },
      {
        type: "paragraph",
        text: "The Big Mac is the global icon that needs no introduction and continues to be ordered at outlets across Singapore by families, commuters, and late-night diners."
      }
    ]);
  });

  it("keeps brand words that belong to the inferred section heading", () => {
    expect(
      normalizeBrandDescriptionForPage(
        "McDonald's Singapore: The Halal Place\n\nMcCafe: Coffee Culture at McDonald's McDonald's Singapore opened its first McCafe at Great World City, giving the brand a cafe dimension for customers."
      )
    ).toEqual([
      { type: "h2", text: "McDonald's Singapore: The Halal Place" },
      { type: "h3", text: "McCafe: Coffee Culture at McDonald's" },
      {
        type: "paragraph",
        text: "McDonald's Singapore opened its first McCafe at Great World City, giving the brand a cafe dimension for customers."
      }
    ]);

    expect(
      normalizeBrandDescriptionForPage(
        "McDonald's Singapore: The Halal Place\n\nThe McSpicy: Singapore's Favourite McDonald's Creation Among all the locally-inspired additions, none has achieved the status of the McSpicy with chilli lovers across the island."
      )
    ).toEqual([
      { type: "h2", text: "McDonald's Singapore: The Halal Place" },
      { type: "h3", text: "The McSpicy: Singapore's Favourite McDonald's Creation" },
      {
        type: "paragraph",
        text: "Among all the locally-inspired additions, none has achieved the status of the McSpicy with chilli lovers across the island."
      }
    ]);
  });
});
