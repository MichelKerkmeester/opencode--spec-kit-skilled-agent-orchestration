// TEST: Tree Thinning — Spec Folder Consolidation
// Sprint 5 PageIndex — pre-pipeline token reduction
//
// Run with: vitest run tests/tree-thinning.vitest.ts
// (requires vitest configured in this package, or run from mcp_server
//  After adjusting import path)
import { describe, it, expect } from 'vitest';
import {
  applyTreeThinning,
  estimateTokenCount,
  deriveParentPath,
} from '../core/tree-thinning';
import type { ThinFileInput, ThinningConfig } from '../core/tree-thinning';

/* ───────────────────────────────────────────────────────────────
   Helpers
------------------------------------------------------------------*/

/** Generate a string of approximately `tokens` tokens (4 chars each). */
function makeContent(tokens: number): string {
  return 'abcd'.repeat(tokens);
}

/** Build a ThinFileInput for a non-memory spec folder file. */
function specFile(name: string, tokens: number): ThinFileInput {
  return { path: `specs/001-feature/${name}`, content: makeContent(tokens) };
}

/* ───────────────────────────────────────────────────────────────
   T1: estimateTokenCount
------------------------------------------------------------------*/

describe('estimateTokenCount', () => {
  it('T1-A: returns 0 for empty string', () => {
    expect(estimateTokenCount('')).toBe(0);
  });

  it('T1-B: estimates 1 token for 4 chars', () => {
    expect(estimateTokenCount('abcd')).toBe(1);
  });

  it('T1-C: rounds up for partial chars', () => {
    expect(estimateTokenCount('abc')).toBe(1);   // ceil(3/4) = 1
    expect(estimateTokenCount('abcde')).toBe(2); // ceil(5/4) = 2
  });

  it('T1-D: scales linearly', () => {
    const tokens = 500;
    const content = makeContent(tokens);
    expect(estimateTokenCount(content)).toBe(tokens);
  });
});

/* ───────────────────────────────────────────────────────────────
   T2: deriveParentPath
------------------------------------------------------------------*/

describe('deriveParentPath', () => {
  it('T2-A: returns parent directory', () => {
    expect(deriveParentPath('specs/001-feature/spec.md')).toBe('specs/001-feature');
  });

  it('T2-B: returns null for top-level filename', () => {
    expect(deriveParentPath('spec.md')).toBeNull();
  });

  it('T2-C: handles nested paths', () => {
    expect(deriveParentPath('specs/001-feature/research/research.md')).toBe('specs/001-feature/research');
  });
});

/* ───────────────────────────────────────────────────────────────
   T4: Merge threshold (200 tokens) — standard files
------------------------------------------------------------------*/

describe('Merge threshold (200 tokens) — standard files', () => {
  it('T4-A: file with 199 tokens is marked merged-into-parent', () => {
    const files: FileEntry[] = [specFile('tiny.md', 199)];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].action).toBe('merged-into-parent');
    expect(result.stats.mergedCount).toBe(1);
  });

  it('T4-B: file with exactly 200 tokens is NOT merged (boundary: < 200)', () => {
    const files: FileEntry[] = [specFile('boundary.md', 200)];
    const result = applyTreeThinning(files);
    // 200 tokens >= mergeThreshold(200), so falls into content-as-summary range
    expect(result.thinned[0].action).toBe('content-as-summary');
  });

  it('T4-C: file with 1 token is merged', () => {
    const files: FileEntry[] = [specFile('empty-ish.md', 1)];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].action).toBe('merged-into-parent');
  });

  it('T4-D: merged files produce a MergedFileEntry per parent directory', () => {
    const files: FileEntry[] = [
      specFile('tiny-a.md', 50),
      specFile('tiny-b.md', 100),
    ];
    const result = applyTreeThinning(files);
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].childPaths).toHaveLength(2);
  });

  it('T4-E: files from different parents produce separate MergedFileEntry records', () => {
    const files: FileEntry[] = [
      { path: 'specs/001-feature/tiny.md', content: makeContent(50) },
      { path: 'specs/002-other/tiny.md', content: makeContent(50) },
    ];
    const result = applyTreeThinning(files);
    expect(result.merged).toHaveLength(2);
    const parents = result.merged.map((m) => m.parentPath).sort();
    expect(parents).toEqual(['specs/001-feature', 'specs/002-other']);
  });
});

/* ───────────────────────────────────────────────────────────────
   T5: Content-as-summary threshold (500 tokens) — standard files
------------------------------------------------------------------*/

describe('Content-as-summary threshold (500 tokens) — standard files', () => {
  it('T5-A: file with 499 tokens is content-as-summary', () => {
    const files: FileEntry[] = [specFile('medium.md', 499)];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].action).toBe('content-as-summary');
    expect(result.stats.thinnedCount).toBe(1);
  });

  it('T5-B: file with exactly 500 tokens is kept (boundary: < 500)', () => {
    const files: FileEntry[] = [specFile('at-boundary.md', 500)];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].action).toBe('keep');
  });

  it('T5-C: file with 600 tokens is kept', () => {
    const files: FileEntry[] = [specFile('large.md', 600)];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].action).toBe('keep');
    expect(result.stats.thinnedCount).toBe(0);
    expect(result.stats.mergedCount).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   T6: No content loss during merge
------------------------------------------------------------------*/

describe('No content loss during merge', () => {
  it('T6-A: merged summary contains all child content', () => {
    const childA = { path: 'specs/001/tiny-a.md', content: 'UNIQUE_CONTENT_A' };
    const childB = { path: 'specs/001/tiny-b.md', content: 'UNIQUE_CONTENT_B' };
    // Force merge by using very short content (< 200 tokens)
    const files: FileEntry[] = [childA, childB];
    const result = applyTreeThinning(files);

    expect(result.merged).toHaveLength(1);
    const mergedSummary = result.merged[0].mergedSummary;
    expect(mergedSummary).toContain('UNIQUE_CONTENT_A');
    expect(mergedSummary).toContain('UNIQUE_CONTENT_B');
  });

  it('T6-B: merged summary contains source path references', () => {
    const files: FileEntry[] = [
      { path: 'specs/001/tiny.md', content: 'hello world' },
    ];
    const result = applyTreeThinning(files);
    expect(result.merged[0].mergedSummary).toContain('specs/001/tiny.md');
  });

  it('T6-C: kept files retain their original content unchanged', () => {
    const original = makeContent(600);
    const files: FileEntry[] = [
      { path: 'specs/001/large.md', content: original },
    ];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].content).toBe(original);
    expect(result.thinned[0].action).toBe('keep');
  });

  it('T6-D: content-as-summary files retain their original content', () => {
    const original = makeContent(350);
    const files: FileEntry[] = [
      { path: 'specs/001/medium.md', content: original },
    ];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].content).toBe(original);
    expect(result.thinned[0].action).toBe('content-as-summary');
  });

  it('T6-E: empty file list produces empty result with zero stats', () => {
    const result = applyTreeThinning([]);
    expect(result.thinned).toHaveLength(0);
    expect(result.merged).toHaveLength(0);
    expect(result.stats.totalFiles).toBe(0);
    expect(result.stats.thinnedCount).toBe(0);
    expect(result.stats.mergedCount).toBe(0);
    expect(result.stats.tokensSaved).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   T8: Stats correctness
------------------------------------------------------------------*/

describe('Stats correctness', () => {
  it('T8-A: totalFiles matches input length', () => {
    const files: FileEntry[] = [
      specFile('a.md', 100),
      specFile('b.md', 300),
      specFile('c.md', 600),
    ];
    const result = applyTreeThinning(files);
    expect(result.stats.totalFiles).toBe(3);
  });

  it('T8-B: thinnedCount counts only content-as-summary actions', () => {
    const files: FileEntry[] = [
      specFile('merged.md', 100),    // merged-into-parent
      specFile('thinned.md', 300),   // content-as-summary
      specFile('kept.md', 600),      // keep
    ];
    const result = applyTreeThinning(files);
    expect(result.stats.thinnedCount).toBe(1);
    expect(result.stats.mergedCount).toBe(1);
  });

  it('T8-C: tokensSaved is non-negative', () => {
    const files: FileEntry[] = [
      specFile('a.md', 100),
      specFile('b.md', 300),
    ];
    const result = applyTreeThinning(files);
    expect(result.stats.tokensSaved).toBeGreaterThanOrEqual(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   T9: Pre-pipeline boundary — thinning does NOT affect pipeline stages
------------------------------------------------------------------*/

describe('Pre-pipeline boundary — thinning is pure, no side effects', () => {
  it('T9-A: applyTreeThinning is a pure function — same input always produces same output', () => {
    const files: FileEntry[] = [
      specFile('a.md', 100),
      specFile('b.md', 300),
      specFile('c.md', 600),
      specFile('context-summary.md', 50),
    ];
    const result1 = applyTreeThinning(files);
    const result2 = applyTreeThinning(files);
    expect(result1.stats).toEqual(result2.stats);
    expect(result1.thinned.map((f) => f.action)).toEqual(result2.thinned.map((f) => f.action));
  });

  it('T9-B: applyTreeThinning does not mutate input FileEntry objects', () => {
    const file: FileEntry = { path: 'specs/001/spec.md', content: makeContent(100) };
    const originalPath = file.path;
    const originalContent = file.content;
    applyTreeThinning([file]);
    expect(file.path).toBe(originalPath);
    expect(file.content).toBe(originalContent);
  });

  it('T9-C: thinned entries preserve tokenCount from estimation', () => {
    const content = makeContent(300);
    const files: FileEntry[] = [{ path: 'specs/001/spec.md', content }];
    const result = applyTreeThinning(files);
    expect(result.thinned[0].tokenCount).toBe(300);
  });

  it('T9-D: custom config overrides default thresholds', () => {
    const config: Partial<ThinningConfig> = {
      mergeThreshold: 50,
      contentAsTextThreshold: 150,
    };
    // 100-token file: < 150 but >= 50 → content-as-summary with custom config
    const files: FileEntry[] = [specFile('mid.md', 100)];
    const result = applyTreeThinning(files, config);
    expect(result.thinned[0].action).toBe('content-as-summary');
  });

  it('T9-E: Stage 1 inputs (kept files) are identical to original content — no transformation', () => {
    // Simulate what Stage 1 of the retrieval pipeline would receive:
    // Only "keep" files should be passed through, and their content must be pristine.
    const files: FileEntry[] = [
      specFile('big-a.md', 1000),
      specFile('big-b.md', 2000),
      specFile('small.md', 50),  // will be merged, not passed to Stage 1
    ];
    const result = applyTreeThinning(files);
    const keptFiles = result.thinned.filter((f) => f.action === 'keep');
    expect(keptFiles).toHaveLength(2);
    for (const kept of keptFiles) {
      const original = files.find((f) => f.path === kept.path);
      expect(kept.content).toBe(original!.content);
    }
  });
});
