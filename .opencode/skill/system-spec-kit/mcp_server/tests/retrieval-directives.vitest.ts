// --- TEST: Retrieval Directives ---
// Constitutional memory as retrieval directives
//
// Tests cover:
// 1. Extraction from various constitutional memory content formats
// 2. Directive prefix patterns validated ("Always surface when:", "Prioritize when:")
// 3. Content with no clear rule pattern (title-only fallback)
// 4. Enrichment of result arrays (correct field attachment, no reordering)
// 5. No scoring logic changes (content transformation only)

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  extractRetrievalDirective,
  formatDirectiveMetadata,
  enrichWithRetrievalDirectives,
  type RetrievalDirective,
  type ConstitutionalResult,
} from '../lib/search/retrieval-directives';
import {
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  clearConstitutionalCache,
} from '../hooks/memory-surface';
import * as vectorIndex from '../lib/search/vector-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

/** Build a minimal ConstitutionalResult for testing. */
function makeResult(
  overrides: Partial<ConstitutionalResult> = {}
): ConstitutionalResult {
  return {
    id: 1,
    specFolder: 'specs/test',
    filePath: '',
    title: 'Test Rule',
    importanceTier: 'constitutional',
    ...overrides,
  };
}

function makeConstitutionalDb(rows: Array<Record<string, unknown>>): { prepare: (sql: string) => { all: () => Array<Record<string, unknown>> } } {
  return {
    prepare: vi.fn((_sql: string) => ({
      all: vi.fn(() => rows),
    })),
  };
}

/* ───────────────────────────────────────────────────────────────
   T-A4-01: EXTRACTION — IMPERATIVE CONTENT
──────────────────────────────────────────────────────────────── */

describe('T-A4-01: Extraction from imperative content', () => {
  it('T1: extracts from content with "always" keyword', () => {
    const content = 'Always read the file before editing.';
    const directive = extractRetrievalDirective(content, 'Read First Rule');
    expect(directive).not.toBeNull();
    expect(directive!.surfaceCondition).toMatch(/^Always surface when:/);
    expect(directive!.source).toBe('Read First Rule');
  });

  it('T2: extracts from content with "must" keyword', () => {
    const content = 'You must verify syntax before committing.';
    const directive = extractRetrievalDirective(content, 'Verify Syntax');
    expect(directive).not.toBeNull();
    expect(directive!.rulePattern).toContain('must verify');
  });

  it('T3: extracts from content with "never" keyword', () => {
    const content = 'Never skip pre-execution gates.';
    const directive = extractRetrievalDirective(content, 'Gate Rule');
    expect(directive).not.toBeNull();
    expect(directive!.surfaceCondition).toMatch(/^Always surface when:/);
  });

  it('T4: extracts from content with "should" keyword', () => {
    const content = 'Code should be reviewed before merging when changes touch the core.';
    const directive = extractRetrievalDirective(content, 'Review Rule');
    expect(directive).not.toBeNull();
    expect(directive!.priorityCondition).toMatch(/^Prioritize when:/);
  });

  it('T5: extracts condition clause from "when" keyword', () => {
    const content = 'Always ask for spec folder when file modification is detected.';
    const directive = extractRetrievalDirective(content, 'Spec Folder Gate');
    expect(directive).not.toBeNull();
    expect(directive!.surfaceCondition).toContain('file modification is detected');
  });

  it('T6: extracts condition clause from "if" keyword', () => {
    const content = 'Must stop if confidence is below 80%.';
    const directive = extractRetrievalDirective(content, 'Confidence Gate');
    expect(directive).not.toBeNull();
    expect(directive!.surfaceCondition).toContain('confidence is below 80%');
  });

  it('T7: extracts from multi-line content — uses first imperative line', () => {
    const content = [
      '# Read First Rule',
      '',
      'Context and background goes here.',
      '',
      'Always read a file before editing it.',
      'Never modify files without reading first.',
    ].join('\n');
    const directive = extractRetrievalDirective(content, 'Read First');
    expect(directive).not.toBeNull();
    // First imperative line is the "always" one
    expect(directive!.rulePattern.toLowerCase()).toContain('always');
  });

  it('T8: uses second imperative line for priority condition when available', () => {
    const content = [
      'Always read the file before editing.',
      'Never skip the gate when modifying core files.',
    ].join('\n');
    const directive = extractRetrievalDirective(content, 'Multi Rule');
    expect(directive).not.toBeNull();
    // Second line provides the priority condition
    expect(directive!.priorityCondition).toMatch(/^Prioritize when:/);
  });

  it('T9: extracts "do not" as imperative keyword', () => {
    const content = 'Do not commit without running tests.';
    const directive = extractRetrievalDirective(content, 'Test First');
    expect(directive).not.toBeNull();
    expect(directive!.rulePattern.toLowerCase()).toContain('do not');
  });

  it('T10: handles heading-prefixed imperative lines', () => {
    const content = '## Always verify syntax checks pass before claiming completion.';
    const directive = extractRetrievalDirective(content, 'Verify Completion');
    expect(directive).not.toBeNull();
    expect(directive!.surfaceCondition).toMatch(/^Always surface when:/);
  });
});

/* ───────────────────────────────────────────────────────────────
   T-A4-02: DIRECTIVE PREFIX PATTERNS
──────────────────────────────────────────────────────────────── */

describe('T-A4-02: Directive prefix patterns', () => {
  it('T11: surfaceCondition always starts with "Always surface when:"', () => {
    const cases = [
      'Always read before editing.',
      'Must verify before committing.',
      'Never skip gates.',
      'Should review changes when touching core.',
    ];
    for (const content of cases) {
      const d = extractRetrievalDirective(content, 'Rule');
      expect(d).not.toBeNull();
      expect(d!.surfaceCondition).toMatch(/^Always surface when:/);
    }
  });

  it('T12: priorityCondition always starts with "Prioritize when:"', () => {
    const cases = [
      'Always read before editing.',
      'Must verify before committing.',
      'Never skip gates.',
    ];
    for (const content of cases) {
      const d = extractRetrievalDirective(content, 'Rule');
      expect(d).not.toBeNull();
      expect(d!.priorityCondition).toMatch(/^Prioritize when:/);
    }
  });

  it('T13: source is set from title parameter', () => {
    const d = extractRetrievalDirective('Always do X.', 'My Important Rule');
    expect(d!.source).toBe('My Important Rule');
  });

  it('T14: source defaults to "constitutional memory" when title is undefined', () => {
    const d = extractRetrievalDirective('Always do X.', undefined);
    expect(d!.source).toBe('constitutional memory');
  });

  it('T15: rulePattern is not empty for imperative content', () => {
    const d = extractRetrievalDirective('Must always verify syntax.', 'Verify Rule');
    expect(d!.rulePattern.length).toBeGreaterThan(0);
  });

  it('T16: directive components are capped at 120 characters', () => {
    const longContent = 'Always ' + 'x'.repeat(200) + ' when conditions are met.';
    const d = extractRetrievalDirective(longContent, 'Long Rule');
    expect(d).not.toBeNull();
    expect(d!.surfaceCondition.length).toBeLessThanOrEqual(200); // prefix + capped body
    expect(d!.rulePattern.length).toBeLessThanOrEqual(121); // 120 + possible "…"
  });
});

/* ───────────────────────────────────────────────────────────────
   T-A4-03: FALLBACK — NO CLEAR RULE PATTERN
──────────────────────────────────────────────────────────────── */

describe('T-A4-03: Fallback when content has no imperative rules', () => {
  it('T17: falls back to title when content has no imperative keywords', () => {
    const content = 'This memory contains background context and history.';
    const d = extractRetrievalDirective(content, 'Background Context');
    expect(d).not.toBeNull();
    expect(d!.surfaceCondition).toContain('Background Context');
    expect(d!.source).toBe('Background Context');
  });

  it('T18: falls back to title when content is empty string', () => {
    const d = extractRetrievalDirective('', 'Empty Content Rule');
    expect(d).not.toBeNull();
    expect(d!.surfaceCondition).toMatch(/^Always surface when:/);
    expect(d!.surfaceCondition).toContain('Empty Content Rule');
  });

  it('T19: returns null when both content and title are absent', () => {
    const d = extractRetrievalDirective('', undefined);
    expect(d).toBeNull();
  });

  it('T20: fallback rulePattern equals the title', () => {
    const d = extractRetrievalDirective('', 'Fallback Rule Title');
    expect(d!.rulePattern).toBe('Fallback Rule Title');
  });

  it('T21: fallback priorityCondition includes the title in quotes', () => {
    const d = extractRetrievalDirective('', 'My Rule');
    expect(d!.priorityCondition).toContain('"My Rule"');
  });

  it('T22: very short content lines (< 8 chars) are skipped', () => {
    const content = 'always\nmust\nnever\nShort lines should not match.';
    const d = extractRetrievalDirective(content, 'Short Line Rule');
    // Short lines skipped; no full imperative sentence found
    // Falls through to title fallback
    expect(d).not.toBeNull();
    expect(d!.source).toBe('Short Line Rule');
  });

  it('T23: non-imperative descriptive content uses title fallback', () => {
    const content = [
      'This document describes how the system works.',
      'It was created in Sprint 1.',
      'Background: the design decision was made early.',
    ].join('\n');
    const d = extractRetrievalDirective(content, 'Design Context');
    expect(d).not.toBeNull();
    // No imperatives found; title used
    expect(d!.surfaceCondition).toContain('Design Context');
  });
});

/* ───────────────────────────────────────────────────────────────
   T-A4-04: FORMAT DIRECTIVE METADATA
──────────────────────────────────────────────────────────────── */

describe('T-A4-04: formatDirectiveMetadata', () => {
  it('T24: formats as "surfaceCondition | priorityCondition"', () => {
    const directive: RetrievalDirective = {
      surfaceCondition: 'Always surface when: gates are active',
      priorityCondition: 'Prioritize when: modifying core files',
      rulePattern: 'always check gates when active',
      source: 'Gate Rule',
    };
    const formatted = formatDirectiveMetadata(directive);
    expect(formatted).toBe(
      'Always surface when: gates are active | Prioritize when: modifying core files'
    );
  });

  it('T25: formatted string contains both prefix patterns', () => {
    const d = extractRetrievalDirective('Always verify syntax.', 'Verify Rule')!;
    const formatted = formatDirectiveMetadata(d);
    expect(formatted).toContain('Always surface when:');
    expect(formatted).toContain('Prioritize when:');
  });

  it('T26: formatted string uses pipe as separator', () => {
    const d = extractRetrievalDirective('Must never skip tests.', 'Test Rule')!;
    const formatted = formatDirectiveMetadata(d);
    expect(formatted).toContain(' | ');
  });
});

/* ───────────────────────────────────────────────────────────────
   T-A4-05: ENRICHMENT OF RESULT ARRAYS
──────────────────────────────────────────────────────────────── */

describe('T-A4-05: enrichWithRetrievalDirectives', () => {
  it('T27: returns same number of results as input', () => {
    const results = [
      makeResult({ id: 1, title: 'Rule A', filePath: '' }),
      makeResult({ id: 2, title: 'Rule B', filePath: '' }),
      makeResult({ id: 3, title: 'Rule C', filePath: '' }),
    ];
    const enriched = enrichWithRetrievalDirectives(results);
    expect(enriched).toHaveLength(3);
  });

  it('T28: results are returned in original order (no reordering)', () => {
    const results = [
      makeResult({ id: 10, title: 'Alpha' }),
      makeResult({ id: 20, title: 'Beta' }),
      makeResult({ id: 30, title: 'Gamma' }),
    ];
    const enriched = enrichWithRetrievalDirectives(results);
    expect(enriched[0].id).toBe(10);
    expect(enriched[1].id).toBe(20);
    expect(enriched[2].id).toBe(30);
  });

  it('T29: each enriched result has retrieval_directive field', () => {
    const results = [makeResult({ title: 'Always verify rule', filePath: '' })];
    const enriched = enrichWithRetrievalDirectives(results);
    expect(enriched[0].retrieval_directive).toBeDefined();
    expect(typeof enriched[0].retrieval_directive).toBe('string');
  });

  it('T30: retrieval_directive starts with "Always surface when:"', () => {
    const results = [makeResult({ title: 'My Constitutional Rule', filePath: '' })];
    const enriched = enrichWithRetrievalDirectives(results);
    expect(enriched[0].retrieval_directive).toMatch(/^Always surface when:/);
  });

  it('T31: enrichment does not modify other result fields', () => {
    const original = makeResult({ id: 42, specFolder: 'specs/core', importanceTier: 'constitutional' });
    const enriched = enrichWithRetrievalDirectives([original]);
    expect(enriched[0].id).toBe(42);
    expect(enriched[0].specFolder).toBe('specs/core');
    expect(enriched[0].importanceTier).toBe('constitutional');
  });

  it('T32: enrichment returns new objects (does not mutate originals)', () => {
    const original = makeResult({ title: 'Always check gates', filePath: '' });
    const enriched = enrichWithRetrievalDirectives([original]);
    // Original should not have retrieval_directive
    expect(original.retrieval_directive).toBeUndefined();
    // Enriched copy should have it
    expect(enriched[0].retrieval_directive).toBeDefined();
  });

  it('T33: empty array returns empty array', () => {
    const enriched = enrichWithRetrievalDirectives([]);
    expect(enriched).toHaveLength(0);
  });

  it('T34: handles result with non-existent filePath gracefully', () => {
    const results = [makeResult({ filePath: '/nonexistent/path/to/rule.md', title: 'Gate Rule' })];
    // Should not throw; falls back to title-only directive
    expect(() => enrichWithRetrievalDirectives(results)).not.toThrow();
    const enriched = enrichWithRetrievalDirectives(results);
    expect(enriched[0].retrieval_directive).toBeDefined();
  });

  it('T35: handles result with empty filePath gracefully', () => {
    const results = [makeResult({ filePath: '', title: 'Always apply rule' })];
    expect(() => enrichWithRetrievalDirectives(results)).not.toThrow();
    const enriched = enrichWithRetrievalDirectives(results);
    expect(enriched[0].retrieval_directive).toBeDefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T-A4-06: NO SCORING LOGIC CHANGES (content transformation only)
──────────────────────────────────────────────────────────────── */

describe('T-A4-06: Scoring invariants — content transformation only', () => {
  it('T36: enrichment does not add any numeric score field', () => {
    const results = [makeResult({ title: 'Always check gates', filePath: '' })];
    const enriched = enrichWithRetrievalDirectives(results);
    // No numeric score fields should appear
    expect((enriched[0] as unknown as Record<string, unknown>)['score']).toBeUndefined();
    expect((enriched[0] as unknown as Record<string, unknown>)['similarity']).toBeUndefined();
    expect((enriched[0] as unknown as Record<string, unknown>)['importance_weight']).toBeUndefined();
  });

  it('T37: extractRetrievalDirective does not modify input content string', () => {
    const content = 'Always verify before committing.';
    const original = content;
    extractRetrievalDirective(content, 'Test');
    expect(content).toBe(original);
  });

  it('T38: enrichment preserves importanceTier field unchanged', () => {
    const results = [makeResult({ importanceTier: 'constitutional' })];
    const enriched = enrichWithRetrievalDirectives(results);
    expect(enriched[0].importanceTier).toBe('constitutional');
  });

  it('T39: enrichment does not remove any field present on input', () => {
    const base = makeResult({
      id: 99,
      specFolder: 'specs/test',
      filePath: '',
      title: 'Test Rule',
      importanceTier: 'constitutional',
    });
    const enriched = enrichWithRetrievalDirectives([base]);
    const result = enriched[0];
    expect(result.id).toBe(base.id);
    expect(result.specFolder).toBe(base.specFolder);
    expect(result.filePath).toBe(base.filePath);
    expect(result.title).toBe(base.title);
    expect(result.importanceTier).toBe(base.importanceTier);
  });

  it('T40: multiple calls to extractRetrievalDirective with same input yield identical output', () => {
    const content = 'Always read before editing when modifying files.';
    const d1 = extractRetrievalDirective(content, 'Read First');
    const d2 = extractRetrievalDirective(content, 'Read First');
    expect(d1).toEqual(d2);
  });

  it('T41: enrichment is idempotent — re-enriching already-enriched results does not double-wrap', () => {
    const results = [makeResult({ title: 'Always verify', filePath: '' })];
    const firstPass = enrichWithRetrievalDirectives(results);
    const secondPass = enrichWithRetrievalDirectives(firstPass);
    // Both passes produce a retrieval_directive; second pass overwrites (no nesting)
    expect(typeof secondPass[0].retrieval_directive).toBe('string');
    expect(secondPass[0].retrieval_directive).not.toContain('Always surface when: Always surface when:');
  });
});

/* ───────────────────────────────────────────────────────────────
   T-A4-07: EDGE CASES
──────────────────────────────────────────────────────────────── */

describe('T-A4-07: Edge cases', () => {
  it('T42: content with only whitespace is treated as empty', () => {
    const d = extractRetrievalDirective('   \n  \t  ', 'Whitespace Rule');
    expect(d).not.toBeNull();
    // Falls back to title
    expect(d!.source).toBe('Whitespace Rule');
  });

  it('T43: very long title is capped in directive output', () => {
    const longTitle = 'A'.repeat(200);
    const d = extractRetrievalDirective('', longTitle);
    expect(d).not.toBeNull();
    // SurfaceCondition includes capped title
    expect(d!.surfaceCondition.length).toBeLessThanOrEqual(
      'Always surface when: '.length + 121
    );
  });

  it('T44: content with mixed case keywords is matched case-insensitively', () => {
    const content = 'ALWAYS verify syntax before committing changes.';
    const d = extractRetrievalDirective(content, 'Case Rule');
    expect(d).not.toBeNull();
    expect(d!.surfaceCondition).toMatch(/^Always surface when:/);
  });

  it('T45: extracts from content with "require" keyword', () => {
    const content = 'Requires a spec folder when implementing new features.';
    const d = extractRetrievalDirective(content, 'Spec Requirement');
    expect(d).not.toBeNull();
    expect(d!.rulePattern.toLowerCase()).toContain('require');
  });

  it('T46: extracts from content with "ensure" keyword', () => {
    const content = 'Ensure all tests pass before marking a task complete.';
    const d = extractRetrievalDirective(content, 'Completion Rule');
    expect(d).not.toBeNull();
    expect(d!.rulePattern.toLowerCase()).toContain('ensure');
  });

  it('T47: extracts from content with "avoid" keyword', () => {
    const content = 'Avoid scope creep when fixing bugs.';
    const d = extractRetrievalDirective(content, 'Scope Rule');
    expect(d).not.toBeNull();
    // "avoid" is an imperative keyword; directive should be generated
    expect(d!.surfaceCondition).toMatch(/^Always surface when:/);
    expect(d!.priorityCondition).toMatch(/^Prioritize when:/);
  });

  it('T48: formatDirectiveMetadata output is a non-empty string', () => {
    const d = extractRetrievalDirective('Must never skip gates.', 'Gate Rule')!;
    const formatted = formatDirectiveMetadata(d);
    expect(formatted.length).toBeGreaterThan(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   T-A4-08: AUTO-SURFACE INTEGRATION (constitutional injection path)
──────────────────────────────────────────────────────────────── */

describe('T-A4-08: constitutional auto-surface integration', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    clearConstitutionalCache();
    vi.restoreAllMocks();
  });

  it('T49: injects constitutional-tier memories with retrieval directives in autoSurfaceMemories()', async () => {
    const dbRows = [{
      id: 501,
      spec_folder: 'specs/501-constitutional',
      file_path: '',
      title: 'Always validate retrieval contracts',
      importance_tier: 'constitutional',
    }];

    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(
      makeConstitutionalDb(dbRows) as unknown as ReturnType<typeof vectorIndex.getDb>
    );
    vi.spyOn(triggerMatcher, 'matchTriggerPhrases').mockReturnValue([]);

    const result = await autoSurfaceMemories('validate retrieval contracts before changing scoring');

    expect(result).not.toBeNull();
    expect(result!.constitutional).toHaveLength(1);
    expect(result!.constitutional[0]).toMatchObject({
      id: 501,
      importanceTier: 'constitutional',
      title: 'Always validate retrieval contracts',
    });
    expect(result!.constitutional[0].retrieval_directive).toMatch(/^Always surface when:/);
    expect(result!.triggered).toEqual([]);
  });

  it('T50: includes constitutional memories in tool-dispatch auto-surface results when trigger path is active', async () => {
    const dbRows = [{
      id: 777,
      spec_folder: 'specs/777-governance',
      file_path: '',
      title: 'Never bypass constitutional guardrails',
      importance_tier: 'constitutional',
    }];

    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(
      makeConstitutionalDb(dbRows) as unknown as ReturnType<typeof vectorIndex.getDb>
    );
    vi.spyOn(triggerMatcher, 'matchTriggerPhrases').mockReturnValue([
      {
        memoryId: 42,
        specFolder: 'specs/042-signals',
        filePath: 'specs/042-signals/memory/triggered.md',
        title: 'Triggered Memory',
        importanceWeight: 0.9,
        matchedPhrases: ['guardrails'],
      },
    ]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'enforce guardrails for memory retrieval' });

    expect(result).not.toBeNull();
    expect(result!.constitutional).toHaveLength(1);
    expect(result!.constitutional[0].importanceTier).toBe('constitutional');
    expect(result!.constitutional[0].retrieval_directive).toContain('Always surface when:');
    expect(result!.triggered).toHaveLength(1);
    expect(result!.triggered[0]).toMatchObject({
      memory_id: 42,
      spec_folder: 'specs/042-signals',
      matched_phrases: ['guardrails'],
    });
  });
});
