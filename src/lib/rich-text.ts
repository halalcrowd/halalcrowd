export type BrandDescriptionBlock =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string };

export type PageBrandDescriptionBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
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

export function normalizeBrandDescriptionForPage(value: string): PageBrandDescriptionBlock[] {
  return parseBrandDescription(value).map((block) => {
    if (block.type === "h1") return { type: "h2", text: block.text };
    if (block.type === "h2") return { type: "h3", text: block.text };
    if (block.type === "h3") return { type: "h4", text: block.text };
    return block;
  });
}

function inferPlainTextHeadings(blocks: BrandDescriptionBlock[]): BrandDescriptionBlock[] {
  return blocks.flatMap((block, index) => {
    if (block.type !== "paragraph") return block;
    if (index === 0 && blocks.length > 1) return { type: "h1", text: block.text };
    if (index === 1 && block.text.length <= 140 && isTitleLikeHeading(block.text)) return { type: "h2", text: block.text };
    if (block.text.length <= 110 && block.text.endsWith("?")) return { type: "h2", text: block.text };
    if (index > 0) {
      const split = splitLeadingPlainTextHeading(block.text);
      if (split) return split;
    }
    return block;
  });
}

function splitLeadingPlainTextHeading(text: string): BrandDescriptionBlock[] | null {
  if (text.length < 150) return null;

  const words = text.split(/\s+/);
  for (let index = 3; index < Math.min(words.length - 4, 14); index += 1) {
    const word = stripWord(words[index]);
    const next = stripWord(words[index + 1]);
    const boundaryIndex = getPlainTextHeadingBoundary(word, next, words, index);

    if (!boundaryIndex) continue;

    const heading = words.slice(0, boundaryIndex).join(" ").trim();
    const paragraph = words.slice(boundaryIndex).join(" ").trim();
    if (!isTitleLikeHeading(heading) || heading.length < 12 || heading.length > 100 || paragraph.length < 60) {
      return null;
    }

    return [
      { type: "h2", text: heading },
      { type: "paragraph", text: paragraph }
    ];
  }

  return null;
}

function getPlainTextHeadingBoundary(word: string, next: string, words: string[], index: number): number | null {
  if (!word || !next) return null;
  const heading = words.slice(0, index).join(" ").trim();
  if (word === "McDonald's") {
    const previous = stripWord(words[index - 1] ?? "");
    if (heading.startsWith("Where to Find") || isAllowedTitleWord(previous) || next === "Creation") return null;
    return index;
  }
  if (
    ["Among", "Every", "From", "Launched", "The", "Today", "With"].includes(word)
  ) {
    return index;
  }
  if (startsUppercase(word) && startsLowercase(next) && !isAllowedTitleWord(next)) return index + 1;
  return null;
}

function stripWord(word: string): string {
  return word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9']+$/g, "");
}

function isTitleLikeHeading(heading: string): boolean {
  return heading.split(/\s+/).every((word) => {
    const stripped = stripWord(word);
    return startsUppercase(stripped) || isAllowedTitleWord(stripped);
  });
}

function isAllowedTitleWord(word: string): boolean {
  return ["a", "an", "and", "at", "by", "for", "from", "in", "near", "of", "or", "the", "to", "with"].includes(
    word.toLowerCase()
  );
}

function startsUppercase(word: string): boolean {
  return /^[A-Z0-9]/.test(word);
}

function startsLowercase(word: string): boolean {
  return /^[a-z]/.test(word);
}
