// TEST: Structure-Aware Chunker (C138-P4)
// AST-based markdown chunking using remark-gfm that keeps
// Code blocks and tables atomic (never split mid-element).
import { describe, it, expect } from 'vitest';
import { chunkMarkdown, splitIntoBlocks } from '@spec-kit/shared/lib/structure-aware-chunker';
import type { Chunk } from '@spec-kit/shared/lib/structure-aware-chunker';

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('C138-P4 Structure-Aware Chunker', () => {

  // ---- T1: Code blocks are never split ----
  it('T1: fenced code block remains atomic in single chunk', () => {
    const md = `Some text before.

\`\`\`typescript
function foo() {
  return bar();
}
const x = 1;
const y = 2;
\`\`\`

Some text after.`;

    const chunks: Chunk[] = chunkMarkdown(md);
    const codeChunk = chunks.find((c: Chunk) => c.type === 'code');

    expect(codeChunk).toBeDefined();
    expect(codeChunk!.content).toContain('function foo()');
    expect(codeChunk!.content).toContain('const y = 2');
    expect(codeChunk!.content).toMatch(/^```/);
  });

  // ---- T2: Tables are never split ----
  it('T2: GFM table remains atomic in single chunk', () => {
    const md = `# Results

| Name | Score | Status |
|------|-------|--------|
| Alice | 95 | Pass |
| Bob | 82 | Pass |
| Carol | 67 | Fail |
| Dave | 91 | Pass |

More text.`;

    const chunks: Chunk[] = chunkMarkdown(md);
    const tableChunk = chunks.find((c: Chunk) => c.type === 'table');

    expect(tableChunk).toBeDefined();
    expect(tableChunk!.content).toContain('Alice');
    expect(tableChunk!.content).toContain('Dave');
    // All rows in same chunk
    expect(tableChunk!.content.split('\n').filter((l: string) => l.includes('|')).length).toBeGreaterThanOrEqual(5);
  });

  // ---- T3: Headings start new chunks ----
  it('T3: heading starts a new chunk', () => {
    const md = `# Section One

First paragraph.

## Section Two

Second paragraph.`;

    const chunks: Chunk[] = chunkMarkdown(md);

    // Should have at least 2 chunks (one per section)
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks.some((c: Chunk) => c.content.includes('Section One'))).toBe(true);
    expect(chunks.some((c: Chunk) => c.content.includes('Section Two'))).toBe(true);
  });

  // ---- T4: Chunk size limits respected for text ----
  it('T4: text chunks respect maxTokens limit', () => {
    // Create a long text that exceeds 500 tokens (2000 chars)
    const paragraph = 'Lorem ipsum dolor sit amet. '.repeat(100); // ~2800 chars
    const md = `# Test\n\n${paragraph}`;

    const chunks: Chunk[] = chunkMarkdown(md, 200);
    // Should produce multiple chunks from long text
    expect(chunks.length).toBeGreaterThan(1);
  });

  // ---- T5: Empty input ----
  it('T5: empty markdown returns empty chunks', () => {
    expect(chunkMarkdown('')).toEqual([]);
    expect(chunkMarkdown('   ')).toEqual([]);
  });

  // ---- T6: Large code block preserved even if exceeding maxTokens ----
  it('T6: large code block stays atomic even when exceeding maxTokens', () => {
    const bigCode = '```\n' + 'x = x + 1\n'.repeat(500) + '```';
    const chunks: Chunk[] = chunkMarkdown(bigCode, 100);

    const codeChunks = chunks.filter((c: Chunk) => c.type === 'code');
    expect(codeChunks).toHaveLength(1);
    expect(codeChunks[0].content).toContain('x = x + 1');
  });

  // ---- T7: Mixed content ordering ----
  it('T7: preserves order of mixed content types', () => {
    const md = `# Title

Intro paragraph.

\`\`\`js
code();
\`\`\`

| A | B |
|---|---|
| 1 | 2 |

Conclusion.`;

    const chunks: Chunk[] = chunkMarkdown(md);
    const types = chunks.map((c: Chunk) => c.type);

    // Should see heading, (text), code, table, text in some order
    expect(types).toContain('code');
    expect(types).toContain('table');
    const codeIdx = types.indexOf('code');
    const tableIdx = types.indexOf('table');
    expect(codeIdx).toBeLessThan(tableIdx);
  });

  // ---- T8: Token estimates are reasonable ----
  it('T8: token estimates use ~4 chars per token', () => {
    const md = 'A'.repeat(400); // 400 chars → ~100 tokens
    const chunks: Chunk[] = chunkMarkdown(md);

    expect(chunks).toHaveLength(1);
    // Ceil(400 / 4) = 100, but trailing newline from block processing may add 1
    expect(chunks[0].tokenEstimate).toBeGreaterThanOrEqual(100);
    expect(chunks[0].tokenEstimate).toBeLessThanOrEqual(101);
  });

  // ---- T9: splitIntoBlocks identifies block types correctly ----
  it('T9: block splitter correctly identifies code, table, heading, text', () => {
    const md = `# Heading

Text line.

\`\`\`
code
\`\`\`

| A | B |
|---|---|
| 1 | 2 |`;

    const blocks: Array<{ content: string; type: 'text' | 'code' | 'table' | 'heading' }> = splitIntoBlocks(md);
    const types = blocks.map((b: { content: string; type: 'text' | 'code' | 'table' | 'heading' }) => b.type);

    expect(types).toContain('heading');
    expect(types).toContain('text');
    expect(types).toContain('code');
    expect(types).toContain('table');
  });
});
