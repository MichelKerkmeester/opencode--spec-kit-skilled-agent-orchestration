// ───────────────────────────────────────────────────────────────
// MODULE: Anchor Chunker
// ───────────────────────────────────────────────────────────────
// Feature catalog: Anchor-aware chunk thinning
// Splits large memory files into chunks using ANCHOR tags as
// Natural boundaries. Falls back to structure-aware markdown
// Splitting when anchors are absent.
/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Describes the AnchorChunk shape.
 */
export interface AnchorChunk {
  /** The text content of this chunk */
  content: string;
  /** Anchor IDs covered by this chunk (empty for fallback chunks) */
  anchorIds: string[];
  /** Human-readable label for this chunk */
  label: string;
  /** Approximate character count */
  charCount: number;
}

/**
 * Describes the ChunkingResult shape.
 */
export interface ChunkingResult {
  /** Strategy used: 'anchor' or 'structure' */
  strategy: 'anchor' | 'structure';
  /** The chunks produced */
  chunks: AnchorChunk[];
  /** Summary text for the parent record (first ~500 chars) */
  parentSummary: string;
}

interface AnchorSection {
  id: string;
  content: string;
  charCount: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Target chunk size in characters (~1000 tokens at 4 chars/token) */
const TARGET_CHUNK_CHARS = 4000;

/** Maximum chunk size — hard cap to stay under embedding token budget */
const MAX_CHUNK_CHARS = 12000;

/** Minimum file size (chars) to trigger chunking */
export const CHUNKING_THRESHOLD = 50000;

/** Max characters for parent summary (BM25 fallback) */
const PARENT_SUMMARY_LENGTH = 500;

/* ───────────────────────────────────────────────────────────────
   3. ANCHOR EXTRACTION
──────────────────────────────────────────────────────────────── */

const ANCHOR_OPEN_RE = /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/g;

/**
 * Extract anchor sections from content.
 * Returns sections between <!-- ANCHOR:id --> and <!-- /ANCHOR:id --> pairs.
 */
function extractAnchorSections(content: string): AnchorSection[] {
  const sections: AnchorSection[] = [];
  const openPattern = new RegExp(ANCHOR_OPEN_RE.source, 'gi');
  let match: RegExpExecArray | null;

  while ((match = openPattern.exec(content)) !== null) {
    const anchorId = match[1].trim();
    const startPos = match.index;

    // Find closing tag
    const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const closingPattern = new RegExp(
      `<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(anchorId)}\\s*-->`,
      'i'
    );
    const afterOpen = content.slice(startPos + match[0].length);
    const closeMatch = closingPattern.exec(afterOpen);

    if (closeMatch) {
      const endPos = startPos + match[0].length + closeMatch.index + closeMatch[0].length;
      const sectionContent = content.slice(startPos, endPos);

      sections.push({
        id: anchorId,
        content: sectionContent,
        charCount: sectionContent.length,
      });
    }
  }

  return sections;
}

/* ───────────────────────────────────────────────────────────────
   4. ANCHOR-BASED CHUNKING
──────────────────────────────────────────────────────────────── */

/**
 * Group anchor sections into chunks that stay under the target size.
 * Small adjacent anchors are merged; large anchors become their own chunk.
 */
function chunkByAnchors(sections: AnchorSection[]): AnchorChunk[] {
  const chunks: AnchorChunk[] = [];
  let currentContent = '';
  let currentAnchors: string[] = [];
  let currentSize = 0;

  function flush(): void {
    if (currentContent.trim()) {
      chunks.push({
        content: currentContent.trim(),
        anchorIds: [...currentAnchors],
        label: currentAnchors.length === 1
          ? currentAnchors[0]
          : `${currentAnchors[0]}..${currentAnchors[currentAnchors.length - 1]}`,
        charCount: currentContent.length,
      });
    }
    currentContent = '';
    currentAnchors = [];
    currentSize = 0;
  }

  for (const section of sections) {
    // F-10 — Oversized anchor sections must be further split to respect
    // MAX_CHUNK_CHARS. Previously they were emitted as single oversized chunks.
    if (section.charCount > MAX_CHUNK_CHARS) {
      flush();
      // Split oversized content into MAX_CHUNK_CHARS-sized sub-chunks
      const lines = section.content.split('\n');
      let subContent = '';
      let subIdx = 0;
      for (const line of lines) {
        if (subContent.length + line.length + 1 > MAX_CHUNK_CHARS && subContent.trim()) {
          chunks.push({
            content: subContent.trim(),
            anchorIds: [section.id],
            label: `${section.id}:${subIdx}`,
            charCount: subContent.length,
          });
          subContent = '';
          subIdx++;
        }
        // Handle single lines exceeding MAX_CHUNK_CHARS: split at char boundary
        if (line.length > MAX_CHUNK_CHARS && !subContent) {
          for (let c = 0; c < line.length; c += MAX_CHUNK_CHARS) {
            const slice = line.slice(c, c + MAX_CHUNK_CHARS);
            chunks.push({
              content: slice,
              anchorIds: [section.id],
              label: `${section.id}:${subIdx}`,
              charCount: slice.length,
            });
            subIdx++;
          }
          continue;
        }
        subContent += (subContent ? '\n' : '') + line;
      }
      if (subContent.trim()) {
        chunks.push({
          content: subContent.trim(),
          anchorIds: [section.id],
          label: subIdx > 0 ? `${section.id}:${subIdx}` : section.id,
          charCount: subContent.length,
        });
      }
      continue;
    }

    // Would adding this section exceed the target?
    if (currentSize + section.charCount > TARGET_CHUNK_CHARS && currentContent.trim()) {
      flush();
    }

    currentContent += (currentContent ? '\n\n' : '') + section.content;
    currentAnchors.push(section.id);
    currentSize += section.charCount;
  }

  flush();
  return chunks;
}

/* ───────────────────────────────────────────────────────────────
   5. STRUCTURE-BASED FALLBACK CHUNKING
──────────────────────────────────────────────────────────────── */

/**
 * Fall back to splitting by markdown headings and paragraphs.
 * Uses a simple approach: split on H1/H2 headings, group small sections.
 */
function chunkByStructure(content: string): AnchorChunk[] {
  const chunks: AnchorChunk[] = [];

  // Split on H1/H2 headings
  const parts = content.split(/(?=^#{1,2}\s)/m);
  let currentContent = '';
  let currentSize = 0;
  let chunkIdx = 0;

  function flush(): void {
    if (currentContent.trim()) {
      chunkIdx++;
      chunks.push({
        content: currentContent.trim(),
        anchorIds: [],
        label: `chunk-${chunkIdx}`,
        charCount: currentContent.length,
      });
    }
    currentContent = '';
    currentSize = 0;
  }

  for (const part of parts) {
    if (!part.trim()) continue;

    if (part.length > MAX_CHUNK_CHARS) {
      // Large section — split further by paragraphs
      flush();
      const paragraphs = part.split(/\n\n+/);
      for (const para of paragraphs) {
        if (!para.trim()) continue;
        if (currentSize + para.length > TARGET_CHUNK_CHARS && currentContent.trim()) {
          flush();
        }
        currentContent += (currentContent ? '\n\n' : '') + para;
        currentSize += para.length;
      }
      continue;
    }

    if (currentSize + part.length > TARGET_CHUNK_CHARS && currentContent.trim()) {
      flush();
    }

    currentContent += (currentContent ? '\n\n' : '') + part;
    currentSize += part.length;
  }

  flush();
  return chunks;
}

/* ───────────────────────────────────────────────────────────────
   6. MAIN ENTRY POINT
──────────────────────────────────────────────────────────────── */

/**
 * Chunk a large memory file into smaller pieces for indexing.
 *
 * Strategy:
 * 1. Try anchor-based splitting first (files with ANCHOR tags)
 * 2. Fall back to structure-aware markdown splitting
 *
 * @param content - The full file content
 * @returns ChunkingResult with strategy info and chunk array
 */
export function chunkLargeFile(content: string): ChunkingResult {
  const parentSummary = content.slice(0, PARENT_SUMMARY_LENGTH).trim();

  // Try anchor-based chunking first
  const anchorSections = extractAnchorSections(content);

  if (anchorSections.length >= 2) {
    const chunks = chunkByAnchors(anchorSections);
    if (chunks.length >= 2) {
      return { strategy: 'anchor', chunks, parentSummary };
    }
  }

  // Fall back to structure-based chunking
  const chunks = chunkByStructure(content);
  return { strategy: 'structure', chunks, parentSummary };
}

/**
 * Check if a file's content exceeds the chunking threshold.
 */
export function needsChunking(content: string): boolean {
  return content.length > CHUNKING_THRESHOLD;
}
