export type BrandDescriptionBlock =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string };

export function parseBrandDescription(value: string): BrandDescriptionBlock[] {
  const blocks: BrandDescriptionBlock[] = [];
  let paragraphLines: string[] = [];
  let hasExplicitHeading = false;

  function flushParagraph() {
    if (!paragraphLines.length) return;
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ").replace(/\s+/g, " ").trim() });
    paragraphLines = [];
  }

  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      hasExplicitHeading = true;
      blocks.push({ type: `h${heading[1].length}` as "h1" | "h2" | "h3", text: heading[2].trim() });
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return hasExplicitHeading ? blocks : inferPlainTextHeadings(blocks);
}

function inferPlainTextHeadings(blocks: BrandDescriptionBlock[]): BrandDescriptionBlock[] {
  return blocks.map((block, index) => {
    if (block.type !== "paragraph") return block;
    if (index === 0 && blocks.length > 1) return { type: "h1", text: block.text };
    if (index === 1 && block.text.length <= 140) return { type: "h2", text: block.text };
    if (block.text.length <= 110 && block.text.endsWith("?")) return { type: "h2", text: block.text };
    return block;
  });
}
