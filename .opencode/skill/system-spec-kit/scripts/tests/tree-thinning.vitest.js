"use strict";
// TEST: Tree Thinning — Spec Folder Consolidation
// Sprint 5 PageIndex — pre-pipeline token reduction
//
// Run with: vitest run tests/tree-thinning.vitest.ts
// (requires vitest configured in this package, or run from mcp_server
//  After adjusting import path)
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const tree_thinning_1 = require("../core/tree-thinning");
/* ───────────────────────────────────────────────────────────────
   Helpers
------------------------------------------------------------------*/
/** Generate a string of approximately `tokens` tokens (4 chars each). */
function makeContent(tokens) {
    return 'abcd'.repeat(tokens);
}
/** Build a FileEntry for a non-memory spec folder file. */
function specFile(name, tokens) {
    return { path: `specs/001-feature/${name}`, content: makeContent(tokens) };
}
/** Build a FileEntry for a memory file. */
function memFile(name, tokens) {
    return { path: `specs/001-feature/memory/${name}`, content: makeContent(tokens) };
}
/* ───────────────────────────────────────────────────────────────
   T1: estimateTokenCount
------------------------------------------------------------------*/
(0, vitest_1.describe)('estimateTokenCount', () => {
    (0, vitest_1.it)('T1-A: returns 0 for empty string', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.estimateTokenCount)('')).toBe(0);
    });
    (0, vitest_1.it)('T1-B: estimates 1 token for 4 chars', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.estimateTokenCount)('abcd')).toBe(1);
    });
    (0, vitest_1.it)('T1-C: rounds up for partial chars', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.estimateTokenCount)('abc')).toBe(1); // ceil(3/4) = 1
        (0, vitest_1.expect)((0, tree_thinning_1.estimateTokenCount)('abcde')).toBe(2); // ceil(5/4) = 2
    });
    (0, vitest_1.it)('T1-D: scales linearly', () => {
        const tokens = 500;
        const content = makeContent(tokens);
        (0, vitest_1.expect)((0, tree_thinning_1.estimateTokenCount)(content)).toBe(tokens);
    });
});
/* ───────────────────────────────────────────────────────────────
   T2: isMemoryFile
------------------------------------------------------------------*/
(0, vitest_1.describe)('isMemoryFile', () => {
    (0, vitest_1.it)('T2-A: detects /memory/ segment', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.isMemoryFile)('specs/001-feature/memory/ctx.md')).toBe(true);
    });
    (0, vitest_1.it)('T2-B: false for non-memory paths', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.isMemoryFile)('specs/001-feature/spec.md')).toBe(false);
        (0, vitest_1.expect)((0, tree_thinning_1.isMemoryFile)('specs/001-feature/scratch/notes.md')).toBe(false);
    });
    (0, vitest_1.it)('T2-C: handles Windows-style paths', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.isMemoryFile)('specs\\001-feature\\memory\\ctx.md')).toBe(true);
    });
});
/* ───────────────────────────────────────────────────────────────
   T3: deriveParentPath
------------------------------------------------------------------*/
(0, vitest_1.describe)('deriveParentPath', () => {
    (0, vitest_1.it)('T3-A: returns parent directory', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.deriveParentPath)('specs/001-feature/spec.md')).toBe('specs/001-feature');
    });
    (0, vitest_1.it)('T3-B: returns null for top-level filename', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.deriveParentPath)('spec.md')).toBeNull();
    });
    (0, vitest_1.it)('T3-C: handles nested paths', () => {
        (0, vitest_1.expect)((0, tree_thinning_1.deriveParentPath)('specs/001-feature/memory/ctx.md')).toBe('specs/001-feature/memory');
    });
});
/* ───────────────────────────────────────────────────────────────
   T4: Merge threshold (200 tokens) — standard files
------------------------------------------------------------------*/
(0, vitest_1.describe)('Merge threshold (200 tokens) — standard files', () => {
    (0, vitest_1.it)('T4-A: file with 199 tokens is marked merged-into-parent', () => {
        const files = [specFile('tiny.md', 199)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
        (0, vitest_1.expect)(result.stats.mergedCount).toBe(1);
    });
    (0, vitest_1.it)('T4-B: file with exactly 200 tokens is NOT merged (boundary: < 200)', () => {
        const files = [specFile('boundary.md', 200)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        // 200 tokens >= mergeThreshold(200), so falls into content-as-summary range
        (0, vitest_1.expect)(result.thinned[0].action).toBe('content-as-summary');
    });
    (0, vitest_1.it)('T4-C: file with 1 token is merged', () => {
        const files = [specFile('empty-ish.md', 1)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
    });
    (0, vitest_1.it)('T4-D: merged files produce a MergedFileEntry per parent directory', () => {
        const files = [
            specFile('tiny-a.md', 50),
            specFile('tiny-b.md', 100),
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.merged).toHaveLength(1);
        (0, vitest_1.expect)(result.merged[0].childPaths).toHaveLength(2);
    });
    (0, vitest_1.it)('T4-E: files from different parents produce separate MergedFileEntry records', () => {
        const files = [
            { path: 'specs/001-feature/tiny.md', content: makeContent(50) },
            { path: 'specs/002-other/tiny.md', content: makeContent(50) },
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.merged).toHaveLength(2);
        const parents = result.merged.map((m) => m.parentPath).sort();
        (0, vitest_1.expect)(parents).toEqual(['specs/001-feature', 'specs/002-other']);
    });
});
/* ───────────────────────────────────────────────────────────────
   T5: Content-as-summary threshold (500 tokens) — standard files
------------------------------------------------------------------*/
(0, vitest_1.describe)('Content-as-summary threshold (500 tokens) — standard files', () => {
    (0, vitest_1.it)('T5-A: file with 499 tokens is content-as-summary', () => {
        const files = [specFile('medium.md', 499)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('content-as-summary');
        (0, vitest_1.expect)(result.stats.thinnedCount).toBe(1);
    });
    (0, vitest_1.it)('T5-B: file with exactly 500 tokens is kept (boundary: < 500)', () => {
        const files = [specFile('at-boundary.md', 500)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('keep');
    });
    (0, vitest_1.it)('T5-C: file with 600 tokens is kept', () => {
        const files = [specFile('large.md', 600)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('keep');
        (0, vitest_1.expect)(result.stats.thinnedCount).toBe(0);
        (0, vitest_1.expect)(result.stats.mergedCount).toBe(0);
    });
});
/* ───────────────────────────────────────────────────────────────
   T6: Memory-specific thresholds (300/100 tokens)
------------------------------------------------------------------*/
(0, vitest_1.describe)('Memory-specific thresholds (300/100 tokens)', () => {
    (0, vitest_1.it)('T6-A: memory file with 99 tokens is content-as-summary (text IS the summary)', () => {
        const files = [memFile('ctx.md', 99)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('content-as-summary');
    });
    (0, vitest_1.it)('T6-B: memory file with exactly 100 tokens is merged-into-parent (boundary: >= 100, < 300)', () => {
        const files = [memFile('ctx.md', 100)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
    });
    (0, vitest_1.it)('T6-C: memory file with 299 tokens is merged-into-parent', () => {
        const files = [memFile('ctx.md', 299)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
    });
    (0, vitest_1.it)('T6-D: memory file with exactly 300 tokens is kept (boundary: >= memoryThinThreshold)', () => {
        const files = [memFile('ctx.md', 300)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('keep');
    });
    (0, vitest_1.it)('T6-E: memory file with 400 tokens is kept', () => {
        const files = [memFile('ctx.md', 400)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('keep');
    });
    (0, vitest_1.it)('T6-F: memory thresholds do NOT apply to non-memory files', () => {
        // Non-memory file with 99 tokens must be merged (< 200), not content-as-summary
        const files = [specFile('notes.md', 99)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
    });
});
/* ───────────────────────────────────────────────────────────────
   T7: No content loss during merge
------------------------------------------------------------------*/
(0, vitest_1.describe)('No content loss during merge', () => {
    (0, vitest_1.it)('T7-A: merged summary contains all child content', () => {
        const childA = { path: 'specs/001/tiny-a.md', content: 'UNIQUE_CONTENT_A' };
        const childB = { path: 'specs/001/tiny-b.md', content: 'UNIQUE_CONTENT_B' };
        // Force merge by using very short content (< 200 tokens)
        const files = [childA, childB];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.merged).toHaveLength(1);
        const mergedSummary = result.merged[0].mergedSummary;
        (0, vitest_1.expect)(mergedSummary).toContain('UNIQUE_CONTENT_A');
        (0, vitest_1.expect)(mergedSummary).toContain('UNIQUE_CONTENT_B');
    });
    (0, vitest_1.it)('T7-B: merged summary contains source path references', () => {
        const files = [
            { path: 'specs/001/tiny.md', content: 'hello world' },
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.merged[0].mergedSummary).toContain('specs/001/tiny.md');
    });
    (0, vitest_1.it)('T7-C: kept files retain their original content unchanged', () => {
        const original = makeContent(600);
        const files = [
            { path: 'specs/001/large.md', content: original },
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].content).toBe(original);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('keep');
    });
    (0, vitest_1.it)('T7-D: content-as-summary files retain their original content', () => {
        const original = makeContent(350);
        const files = [
            { path: 'specs/001/medium.md', content: original },
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].content).toBe(original);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('content-as-summary');
    });
    (0, vitest_1.it)('T7-E: empty file list produces empty result with zero stats', () => {
        const result = (0, tree_thinning_1.applyTreeThinning)([]);
        (0, vitest_1.expect)(result.thinned).toHaveLength(0);
        (0, vitest_1.expect)(result.merged).toHaveLength(0);
        (0, vitest_1.expect)(result.stats.totalFiles).toBe(0);
        (0, vitest_1.expect)(result.stats.thinnedCount).toBe(0);
        (0, vitest_1.expect)(result.stats.mergedCount).toBe(0);
        (0, vitest_1.expect)(result.stats.tokensSaved).toBe(0);
    });
});
/* ───────────────────────────────────────────────────────────────
   T8: Stats correctness
------------------------------------------------------------------*/
(0, vitest_1.describe)('Stats correctness', () => {
    (0, vitest_1.it)('T8-A: totalFiles matches input length', () => {
        const files = [
            specFile('a.md', 100),
            specFile('b.md', 300),
            specFile('c.md', 600),
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.stats.totalFiles).toBe(3);
    });
    (0, vitest_1.it)('T8-B: thinnedCount counts only content-as-summary actions', () => {
        const files = [
            specFile('merged.md', 100), // merged-into-parent
            specFile('thinned.md', 300), // content-as-summary
            specFile('kept.md', 600), // keep
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.stats.thinnedCount).toBe(1);
        (0, vitest_1.expect)(result.stats.mergedCount).toBe(1);
    });
    (0, vitest_1.it)('T8-C: tokensSaved is non-negative', () => {
        const files = [
            specFile('a.md', 100),
            specFile('b.md', 300),
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.stats.tokensSaved).toBeGreaterThanOrEqual(0);
    });
});
/* ───────────────────────────────────────────────────────────────
   T9: Pre-pipeline boundary — thinning does NOT affect pipeline stages
------------------------------------------------------------------*/
(0, vitest_1.describe)('Pre-pipeline boundary — thinning is pure, no side effects', () => {
    (0, vitest_1.it)('T9-A: applyTreeThinning is a pure function — same input always produces same output', () => {
        const files = [
            specFile('a.md', 100),
            specFile('b.md', 300),
            specFile('c.md', 600),
            memFile('ctx.md', 50),
        ];
        const result1 = (0, tree_thinning_1.applyTreeThinning)(files);
        const result2 = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result1.stats).toEqual(result2.stats);
        (0, vitest_1.expect)(result1.thinned.map((f) => f.action)).toEqual(result2.thinned.map((f) => f.action));
    });
    (0, vitest_1.it)('T9-B: applyTreeThinning does not mutate input FileEntry objects', () => {
        const file = { path: 'specs/001/spec.md', content: makeContent(100) };
        const originalPath = file.path;
        const originalContent = file.content;
        (0, tree_thinning_1.applyTreeThinning)([file]);
        (0, vitest_1.expect)(file.path).toBe(originalPath);
        (0, vitest_1.expect)(file.content).toBe(originalContent);
    });
    (0, vitest_1.it)('T9-C: thinned entries preserve tokenCount from estimation', () => {
        const content = makeContent(300);
        const files = [{ path: 'specs/001/spec.md', content }];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        (0, vitest_1.expect)(result.thinned[0].tokenCount).toBe(300);
    });
    (0, vitest_1.it)('T9-D: custom config overrides default thresholds', () => {
        const config = {
            mergeThreshold: 50,
            contentAsTextThreshold: 150,
        };
        // 100-token file: < 150 but >= 50 → content-as-summary with custom config
        const files = [specFile('mid.md', 100)];
        const result = (0, tree_thinning_1.applyTreeThinning)(files, config);
        (0, vitest_1.expect)(result.thinned[0].action).toBe('content-as-summary');
    });
    (0, vitest_1.it)('T9-E: Stage 1 inputs (kept files) are identical to original content — no transformation', () => {
        // Simulate what Stage 1 of the retrieval pipeline would receive:
        // Only "keep" files should be passed through, and their content must be pristine.
        const files = [
            specFile('big-a.md', 1000),
            specFile('big-b.md', 2000),
            specFile('small.md', 50), // will be merged, not passed to Stage 1
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        const keptFiles = result.thinned.filter((f) => f.action === 'keep');
        (0, vitest_1.expect)(keptFiles).toHaveLength(2);
        for (const kept of keptFiles) {
            const original = files.find((f) => f.path === kept.path);
            (0, vitest_1.expect)(kept.content).toBe(original.content);
        }
    });
});
/* ───────────────────────────────────────────────────────────────
   T10: Mixed memory and non-memory files
------------------------------------------------------------------*/
(0, vitest_1.describe)('Mixed memory and non-memory files', () => {
    (0, vitest_1.it)('T10-A: each file uses its own threshold independently', () => {
        const files = [
            specFile('spec.md', 150), // 150 < 200 → merged-into-parent
            memFile('ctx.md', 150), // 100 <= 150 < 300 → merged-into-parent (memory)
            specFile('plan.md', 350), // 200 <= 350 < 500 → content-as-summary
            memFile('big-ctx.md', 350), // >= 300 → keep (memory)
        ];
        const result = (0, tree_thinning_1.applyTreeThinning)(files);
        const actionMap = Object.fromEntries(result.thinned.map((f) => [f.path.split('/').pop(), f.action]));
        (0, vitest_1.expect)(actionMap['spec.md']).toBe('merged-into-parent');
        (0, vitest_1.expect)(actionMap['ctx.md']).toBe('merged-into-parent');
        (0, vitest_1.expect)(actionMap['plan.md']).toBe('content-as-summary');
        (0, vitest_1.expect)(actionMap['big-ctx.md']).toBe('keep');
    });
    (0, vitest_1.it)('T10-B: DEFAULT_THINNING_CONFIG matches documented thresholds', () => {
        (0, vitest_1.expect)(tree_thinning_1.DEFAULT_THINNING_CONFIG.mergeThreshold).toBe(200);
        (0, vitest_1.expect)(tree_thinning_1.DEFAULT_THINNING_CONFIG.contentAsTextThreshold).toBe(500);
        (0, vitest_1.expect)(tree_thinning_1.DEFAULT_THINNING_CONFIG.memoryThinThreshold).toBe(300);
        (0, vitest_1.expect)(tree_thinning_1.DEFAULT_THINNING_CONFIG.memoryTextThreshold).toBe(100);
    });
});
//# sourceMappingURL=tree-thinning.vitest.js.map