// TEST: Anchor-Aware Chunk Thinning
// Scores chunks by anchor presence + content density, applies thinning threshold.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { scoreChunk, thinChunks, DEFAULT_THINNING_THRESHOLD, ANCHOR_WEIGHT, DENSITY_WEIGHT } from '../lib/chunking/chunk-thinning';
import { chunkLargeFile } from '../lib/chunking/anchor-chunker';
import type { AnchorChunk } from '../lib/chunking/anchor-chunker';

const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  delete process.env.SPEC_KIT_DB_DIR;
  delete process.env.MEMORY_ALLOWED_PATHS;
  delete process.env.MEMORY_DB_PATH;

  for (const dir of tempDirs.splice(0)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Ignore test cleanup failures
    }
  }
});

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

function makeChunk(overrides: Partial<AnchorChunk> = {}): AnchorChunk {
  return {
    content: overrides.content ?? '## Heading\n\nSome meaningful content here that is long enough to not be penalized for being short. '.repeat(3),
    anchorIds: overrides.anchorIds ?? [],
    label: overrides.label ?? 'test-chunk',
    charCount: overrides.charCount ?? (overrides.content?.length ?? 300),
  };
}

function makeAnchoredChunk(content?: string): AnchorChunk {
  return makeChunk({
    content: content ?? '<!-- ANCHOR:state -->\n## State\n\nThis is the current project state with meaningful content describing the architecture and decisions made during implementation.\n<!-- /ANCHOR:state -->',
    anchorIds: ['state'],
    label: 'state',
  });
}

function makeEmptyChunk(): AnchorChunk {
  return makeChunk({
    content: '',
    anchorIds: [],
    label: 'empty',
    charCount: 0,
  });
}

function makeWhitespaceChunk(): AnchorChunk {
  return makeChunk({
    content: '   \n\n\n   \t\t   \n\n   ',
    anchorIds: [],
    label: 'whitespace',
    charCount: 25,
  });
}

function makeCommentOnlyChunk(): AnchorChunk {
  return makeChunk({
    content: '<!-- This is a comment -->\n<!-- Another comment -->\n<!-- ANCHOR:foo --><!-- /ANCHOR:foo -->',
    anchorIds: [],
    label: 'comments-only',
    charCount: 90,
  });
}

/* ───────────────────────────────────────────────────────────────
   1. scoreChunk — anchor presence
──────────────────────────────────────────────────────────────── */

describe('scoreChunk — anchor presence', () => {
  it('should give anchorScore 1.0 for chunks with anchors', () => {
    const result = scoreChunk(makeAnchoredChunk());
    expect(result.anchorScore).toBe(1.0);
  });

  it('should give anchorScore 0.0 for chunks without anchors', () => {
    const chunk = makeChunk({ anchorIds: [] });
    const result = scoreChunk(chunk);
    expect(result.anchorScore).toBe(0.0);
  });

  it('should give anchorScore 1.0 for chunks with multiple anchors', () => {
    const chunk = makeChunk({
      anchorIds: ['state', 'next-steps', 'decisions'],
      content: '## Multi-anchor chunk\n\nThis chunk covers multiple anchors with substantial content for testing purposes.',
    });
    const result = scoreChunk(chunk);
    expect(result.anchorScore).toBe(1.0);
  });

  it('should produce higher composite score for anchored chunks than non-anchored', () => {
    const sameContent = '## Heading\n\nThis is some meaningful content that is long enough to have good density and not be penalized for being too short in the scoring function.';
    const anchored = scoreChunk(makeChunk({ content: sameContent, anchorIds: ['test'] }));
    const unanchored = scoreChunk(makeChunk({ content: sameContent, anchorIds: [] }));
    expect(anchored.score).toBeGreaterThan(unanchored.score);
  });
});

/* ───────────────────────────────────────────────────────────────
   2. scoreChunk — content density
──────────────────────────────────────────────────────────────── */

describe('scoreChunk — content density', () => {
  it('should give densityScore 0 for empty content', () => {
    const result = scoreChunk(makeEmptyChunk());
    expect(result.densityScore).toBe(0);
  });

  it('should give low densityScore for whitespace-only content', () => {
    const result = scoreChunk(makeWhitespaceChunk());
    expect(result.densityScore).toBe(0);
  });

  it('should give low densityScore for comment-only content', () => {
    const result = scoreChunk(makeCommentOnlyChunk());
    expect(result.densityScore).toBeLessThan(0.3);
  });

  it('should give higher densityScore for content-rich chunks', () => {
    const richContent = '## Architecture Decisions\n\n- Use SQLite for local storage\n- Implement vector search with cosine similarity\n- Cache embeddings with content hash keys\n\n```typescript\nconst db = new Database("speckit.db");\ndb.exec("CREATE TABLE memories (id INTEGER PRIMARY KEY)");\n```\n\nThis design balances performance with simplicity.';
    const result = scoreChunk(makeChunk({ content: richContent }));
    expect(result.densityScore).toBeGreaterThan(0.5);
  });

  it('should penalize very short chunks (< 100 chars stripped)', () => {
    const shortContent = 'Short.';
    const longContent = 'This is a much longer piece of meaningful content that exceeds one hundred characters after stripping and should not be penalized for length at all.';
    const shortResult = scoreChunk(makeChunk({ content: shortContent, anchorIds: [] }));
    const longResult = scoreChunk(makeChunk({ content: longContent, anchorIds: [] }));
    expect(shortResult.densityScore).toBeLessThan(longResult.densityScore);
  });

  it('should award structure bonus for headings, code blocks, and lists', () => {
    // Use content with significant whitespace so the base ratio is moderate,
    // Making the structure bonus the differentiating factor.
    const structured = '## Heading\n\n\n\n- Item one\n- Item two\n- Item three\n- Item four\n\n\n\n```ts\nconst x = 1;\n```\n\n\n\nExplanation text that is long enough to avoid the short content penalty in the density score calculation here.';
    const plain = 'word\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword\n\n\n\nword';
    const structuredScore = scoreChunk(makeChunk({ content: structured, anchorIds: [] }));
    const plainScore = scoreChunk(makeChunk({ content: plain, anchorIds: [] }));
    expect(structuredScore.densityScore).toBeGreaterThan(plainScore.densityScore);
  });
});

/* ───────────────────────────────────────────────────────────────
   3. scoreChunk — composite scoring
──────────────────────────────────────────────────────────────── */

describe('scoreChunk — composite scoring', () => {
  it('should compute score as weighted sum of anchor and density', () => {
    const chunk = makeAnchoredChunk();
    const result = scoreChunk(chunk);
    const expected = (ANCHOR_WEIGHT * result.anchorScore) + (DENSITY_WEIGHT * result.densityScore);
    expect(result.score).toBeCloseTo(expected, 5);
  });

  it('should produce score in 0-1 range', () => {
    const chunks = [
      makeEmptyChunk(),
      makeWhitespaceChunk(),
      makeCommentOnlyChunk(),
      makeAnchoredChunk(),
      makeChunk(),
    ];
    for (const chunk of chunks) {
      const result = scoreChunk(chunk);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   4. thinChunks — basic filtering
──────────────────────────────────────────────────────────────── */

describe('thinChunks — basic filtering', () => {
  it('should retain high-quality chunks and drop low-quality ones', () => {
    const chunks: AnchorChunk[] = [
      makeAnchoredChunk(),                        // high: anchored + content
      makeChunk({                                  // medium: no anchor, good content
        content: '## Good Content\n\nThis is a meaningful section with enough content to score well in the density calculation and not be dropped.',
      }),
      makeWhitespaceChunk(),                       // low: whitespace only
      makeCommentOnlyChunk(),                      // low: comments only
    ];

    const result = thinChunks(chunks);
    expect(result.retained.length).toBeGreaterThan(0);
    expect(result.retained.length).toBeLessThan(chunks.length);
    expect(result.dropped.length).toBeGreaterThan(0);
    expect(result.retained.length + result.dropped.length).toBe(chunks.length);
  });

  it('should preserve original array in result', () => {
    const chunks = [makeAnchoredChunk(), makeWhitespaceChunk()];
    const result = thinChunks(chunks);
    expect(result.original).toBe(chunks);
    expect(result.original.length).toBe(2);
  });

  it('should mark retained flag correctly on scores', () => {
    const chunks = [makeAnchoredChunk(), makeWhitespaceChunk()];
    const result = thinChunks(chunks);
    for (const s of result.scores) {
      if (s.score >= DEFAULT_THINNING_THRESHOLD) {
        expect(s.retained).toBe(true);
      } else {
        expect(s.retained).toBe(false);
      }
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   5. thinChunks — safety: never returns empty
──────────────────────────────────────────────────────────────── */

describe('thinChunks — safety', () => {
  it('should never return empty retained array when given chunks', () => {
    // All chunks are low quality
    const chunks: AnchorChunk[] = [
      makeWhitespaceChunk(),
      makeEmptyChunk(),
      makeCommentOnlyChunk(),
    ];
    const result = thinChunks(chunks);
    expect(result.retained.length).toBeGreaterThanOrEqual(1);
  });

  it('should return single chunk untouched when given one chunk', () => {
    const chunks = [makeWhitespaceChunk()];
    const result = thinChunks(chunks);
    expect(result.retained.length).toBe(1);
    expect(result.dropped.length).toBe(0);
    expect(result.retained[0]).toBe(chunks[0]);
  });

  it('should handle empty input gracefully', () => {
    const result = thinChunks([]);
    expect(result.retained.length).toBe(0);
    expect(result.dropped.length).toBe(0);
    expect(result.scores.length).toBe(0);
  });

  it('should keep the highest-scoring chunk when all are below threshold', () => {
    const chunks: AnchorChunk[] = [
      makeWhitespaceChunk(),
      makeCommentOnlyChunk(),
      makeEmptyChunk(),
    ];
    // Use an extremely high threshold so all fail
    const result = thinChunks(chunks, 0.99);
    expect(result.retained.length).toBe(1);
    // The retained chunk should be the one with the highest score
    const maxScore = Math.max(...result.scores.map(s => s.score));
    const retainedScore = result.scores.find(s => s.retained);
    expect(retainedScore).toBeDefined();
    expect(retainedScore!.score).toBe(maxScore);
  });
});

/* ───────────────────────────────────────────────────────────────
   6. thinChunks — threshold customization
──────────────────────────────────────────────────────────────── */

describe('thinChunks — threshold customization', () => {
  it('should retain more chunks with lower threshold', () => {
    const chunks: AnchorChunk[] = [
      makeAnchoredChunk(),
      makeChunk({
        content: '## Medium quality\n\nSome content that is long enough to have moderate density but no anchors attached to it.',
      }),
      makeCommentOnlyChunk(),
    ];

    const strict = thinChunks(chunks, 0.5);
    const lenient = thinChunks(chunks, 0.1);
    expect(lenient.retained.length).toBeGreaterThanOrEqual(strict.retained.length);
  });

  it('should retain all chunks with threshold 0', () => {
    const chunks: AnchorChunk[] = [
      makeAnchoredChunk(),
      makeWhitespaceChunk(),
      makeCommentOnlyChunk(),
    ];
    const result = thinChunks(chunks, 0);
    expect(result.retained.length).toBe(chunks.length);
    expect(result.dropped.length).toBe(0);
  });

  it('should use DEFAULT_THINNING_THRESHOLD when no threshold provided', () => {
    expect(DEFAULT_THINNING_THRESHOLD).toBe(0.3);
    const chunks = [makeAnchoredChunk(), makeWhitespaceChunk()];
    const withDefault = thinChunks(chunks);
    const withExplicit = thinChunks(chunks, DEFAULT_THINNING_THRESHOLD);
    expect(withDefault.retained.length).toBe(withExplicit.retained.length);
  });
});

/* ───────────────────────────────────────────────────────────────
   7. Constants export
──────────────────────────────────────────────────────────────── */

describe('constants', () => {
  it('should export correct weight values', () => {
    expect(ANCHOR_WEIGHT).toBe(0.6);
    expect(DENSITY_WEIGHT).toBe(0.4);
    expect(ANCHOR_WEIGHT + DENSITY_WEIGHT).toBe(1.0);
  });

  it('should export default threshold', () => {
    expect(DEFAULT_THINNING_THRESHOLD).toBe(0.3);
    expect(DEFAULT_THINNING_THRESHOLD).toBeGreaterThan(0);
    expect(DEFAULT_THINNING_THRESHOLD).toBeLessThan(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   8. Integration wiring — memory-save chunk flow uses thinChunks
──────────────────────────────────────────────────────────────── */

describe('R7 integration wiring', () => {
  // This integration hits the real chunk/index pipeline and can share a worker
  // With the long-running file-watcher suite during full runs.
  it('uses thinChunks retained set in indexChunkedMemoryFile active path', async () => {
    vi.resetModules();

    const tempDir = makeTempDir('s6-r7-integration-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    const dbPath = path.join(tempDir, 'context-index.sqlite');
    const filePath = path.join(tempDir, 'chunked-memory.md');

    const vectorIndex = await import('../lib/search/vector-index');
    const memorySave = await import('../handlers/memory-save');
    const embeddings = await import('../lib/providers/embeddings');

    const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
    process.env.MEMORY_DB_PATH = dbPath;
    try { vectorIndex.closeDb(); } catch { /* ignore */ }
    vectorIndex.initializeDb();
    if (previousMemoryDbPath === undefined) {
      delete process.env.MEMORY_DB_PATH;
    } else {
      process.env.MEMORY_DB_PATH = previousMemoryDbPath;
    }

    const embeddingSpy = vi
      .spyOn(embeddings, 'generateDocumentEmbedding')
      .mockResolvedValue(new Float32Array(1024).fill(0.1));

    const lowSignalSection = '# Low Signal\n\n' + '<!-- filler -->\n'.repeat(420);
    const highSignalSection =
      '# High Signal\n\n' +
      'This section contains meaningful architecture details, implementation context, and decisions.\n'.repeat(120);
    const content = `${lowSignalSection}\n\n${highSignalSection}`;

    const chunked = chunkLargeFile(content);
    const thinning = thinChunks(chunked.chunks);

    expect(chunked.chunks.length).toBeGreaterThanOrEqual(2);
    expect(thinning.dropped.length).toBeGreaterThan(0);

    const parsed = {
      specFolder: 'specs/02--system-spec-kit/test-r7',
      filePath,
      title: 'R7 chunk wiring test',
      triggerPhrases: [],
      content,
      contentHash: 'r7-thinning-wiring-hash',
      contextType: 'implementation',
      importanceTier: 'normal',
      memoryType: 'declarative',
      memoryTypeSource: 'default',
      documentType: 'memory',
      qualityScore: 0,
      qualityFlags: [],
    };

    try {
      const result = await memorySave.indexChunkedMemoryFile(filePath, parsed);
      const db = vectorIndex.getDb();
      expect(db).toBeTruthy();

      const childCountRow = db.prepare('SELECT COUNT(*) as count FROM memory_index WHERE parent_id = ?').get(result.id) as { count: number };
      expect(childCountRow.count).toBe(thinning.retained.length);

      expect(result.message).toContain(`${thinning.retained.length}`);
    } finally {
      embeddingSpy.mockRestore();
      vectorIndex.closeDb();
    }
  }, 60_000);
});
