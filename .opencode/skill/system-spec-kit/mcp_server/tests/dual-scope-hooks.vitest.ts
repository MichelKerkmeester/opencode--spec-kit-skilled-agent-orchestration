// TEST: Dual-Scope Memory Auto-Surface Hooks
// Covers:
// - autoSurfaceAtToolDispatch: fires at tool dispatch lifecycle point
// - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
// - Token budget constants (4000 max per point)
// - Config flag disabling both hooks
// - No regression in existing autoSurfaceMemories behaviour
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';

// Mock transitive DB dependencies before importing the module under test
vi.mock('../lib/search/vector-index', () => ({
  initializeDb: vi.fn(),
  getDb: vi.fn(() => null),
}));

vi.mock('../lib/parsing/trigger-matcher', () => ({
  matchTriggerPhrases: vi.fn(() => []),
}));

import {
  TOOL_DISPATCH_TOKEN_BUDGET,
  COMPACTION_TOKEN_BUDGET,
  MEMORY_AWARE_TOOLS,
  CONSTITUTIONAL_CACHE_TTL,
  extractContextHint,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
  clearConstitutionalCache,
} from '../hooks/memory-surface';

import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as vectorIndex from '../lib/search/vector-index';

/* ───────────────────────────────────────────────────────────────
   Helper: build a minimal AutoSurfaceResult-like mock return value
──────────────────────────────────────────────────────────────── */

const makeTriggerMatch = (overrides = {}) => ({
  memoryId: 1,
  specFolder: 'specs/001-test',
  filePath: 'specs/001-test/memory/test.md',
  title: 'Test Memory',
  importanceWeight: 0.8,
  matchedPhrases: ['test phrase'],
  ...overrides,
});

/* ───────────────────────────────────────────────────────────────
   1. TOKEN BUDGET CONSTANTS
──────────────────────────────────────────────────────────────── */

describe('TM-05: Token Budget Constants', () => {
  it('TOOL_DISPATCH_TOKEN_BUDGET is 4000', () => {
    expect(TOOL_DISPATCH_TOKEN_BUDGET).toBe(4000);
  });

  it('COMPACTION_TOKEN_BUDGET is 4000', () => {
    expect(COMPACTION_TOKEN_BUDGET).toBe(4000);
  });

  it('Both budgets are numeric', () => {
    expect(typeof TOOL_DISPATCH_TOKEN_BUDGET).toBe('number');
    expect(typeof COMPACTION_TOKEN_BUDGET).toBe('number');
  });

  it('Both budgets are positive', () => {
    expect(TOOL_DISPATCH_TOKEN_BUDGET).toBeGreaterThan(0);
    expect(COMPACTION_TOKEN_BUDGET).toBeGreaterThan(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   2. autoSurfaceAtToolDispatch — BASIC BEHAVIOR
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtToolDispatch — basic behavior', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([]);
  });

  it('is exported as a function', () => {
    expect(typeof autoSurfaceAtToolDispatch).toBe('function');
  });

  it('returns a Promise', () => {
    const result = autoSurfaceAtToolDispatch('some_tool', { query: 'test query' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('returns null when no DB and no triggered memories (nothing to surface)', async () => {
    const result = await autoSurfaceAtToolDispatch('some_tool', { query: 'test query' });
    expect(result).toBeNull();
  });

  it('returns null when tool args contain no extractable context hint', async () => {
    const result = await autoSurfaceAtToolDispatch('some_tool', { unrelated_field: 123 });
    expect(result).toBeNull();
  });

  it('returns null for empty args object', async () => {
    const result = await autoSurfaceAtToolDispatch('some_tool', {});
    expect(result).toBeNull();
  });
});

/* ───────────────────────────────────────────────────────────────
   3. autoSurfaceAtToolDispatch — MEMORY-AWARE TOOL SKIP
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtToolDispatch — skips memory-aware tools', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);
  });

  it('returns null for memory_context (prevents recursive surfacing)', async () => {
    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
    expect(result).toBeNull();
  });

  it('returns null for memory_search', async () => {
    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
    expect(result).toBeNull();
  });

  it('returns null for memory_match_triggers', async () => {
    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
    expect(result).toBeNull();
  });

  it('returns null for memory_list', async () => {
    const result = await autoSurfaceAtToolDispatch('memory_list', { query: 'list query' });
    expect(result).toBeNull();
  });

  it('returns null for memory_save', async () => {
    const result = await autoSurfaceAtToolDispatch('memory_save', { filePath: '/some/path.md' });
    expect(result).toBeNull();
  });

  it('returns null for memory_index_scan', async () => {
    const result = await autoSurfaceAtToolDispatch('memory_index_scan', { specFolder: 'specs/001' });
    expect(result).toBeNull();
  });

  it('all MEMORY_AWARE_TOOLS are skipped', async () => {
    for (const toolName of MEMORY_AWARE_TOOLS) {
      const result = await autoSurfaceAtToolDispatch(toolName, { query: 'test', input: 'test', prompt: 'test' });
      expect(result).toBeNull();
    }
  });

  it('does not invoke trigger matcher for memory-aware tools', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    for (const toolName of MEMORY_AWARE_TOOLS) {
      await autoSurfaceAtToolDispatch(toolName, { query: 'recursive prevention check' });
    }

    expect(matchSpy).not.toHaveBeenCalled();
  });

  it('does NOT skip non-memory-aware tools', async () => {
    // With a trigger match present, a non-memory-aware tool should proceed
    // (result may still be null if DB is null + constitutional empty, but
    // The mock for matchTriggerPhrases returns a match, so if the function
    // Proceeds past the skip gate it will call matchTriggerPhrases)
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('bash', { query: 'run some command' });

    // MatchTriggerPhrases should have been called (meaning we did NOT skip)
    expect(matchSpy).toHaveBeenCalledTimes(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   4. autoSurfaceAtToolDispatch — CONFIG FLAG DISABLING
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtToolDispatch — config flag disabling', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);
  });

  it('returns null when enableToolDispatchHook is false', async () => {
    const result = await autoSurfaceAtToolDispatch(
      'bash',
      { query: 'some query' },
      { enableToolDispatchHook: false }
    );
    expect(result).toBeNull();
  });

  it('does NOT skip when enableToolDispatchHook is true', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch(
      'bash',
      { query: 'some query' },
      { enableToolDispatchHook: true }
    );

    expect(matchSpy).toHaveBeenCalledTimes(1);
  });

  it('does NOT skip when options are omitted (default enabled)', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('bash', { query: 'some query' });

    expect(matchSpy).toHaveBeenCalledTimes(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   5. autoSurfaceAtToolDispatch — CONTEXT EXTRACTION FROM TOOL ARGS
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtToolDispatch — context hint extraction from args', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([]);
  });

  it('extracts hint from "query" field', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('some_tool', { query: 'my search query' });
    expect(matchSpy).toHaveBeenCalledWith('my search query', 5);
  });

  it('extracts hint from "input" field', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('some_tool', { input: 'input context hint' });
    expect(matchSpy).toHaveBeenCalledWith('input context hint', 5);
  });

  it('extracts hint from "prompt" field', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('some_tool', { prompt: 'prompt based hint' });
    expect(matchSpy).toHaveBeenCalledWith('prompt based hint', 5);
  });

  it('skips args values shorter than 3 characters', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('some_tool', { query: 'ab' });
    expect(matchSpy).not.toHaveBeenCalled();
  });

  it('extracts hint from "concepts" array', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('some_tool', { concepts: ['memory', 'search'] });
    expect(matchSpy).toHaveBeenCalledWith('memory search', 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   5b. HOOK LIFECYCLE POINTS (DISPATCH + COMPACTION)
──────────────────────────────────────────────────────────────── */

describe('TM-05: hook lifecycle points', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([]);
  });

  it('fires matcher once at tool-dispatch and once at compaction lifecycle points', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtToolDispatch('bash', { query: 'dispatch lifecycle context' });
    await autoSurfaceAtCompaction('compaction lifecycle context');

    expect(matchSpy).toHaveBeenCalledTimes(2);
    expect(matchSpy).toHaveBeenNthCalledWith(1, 'dispatch lifecycle context', 5);
    expect(matchSpy).toHaveBeenNthCalledWith(2, 'compaction lifecycle context', 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   6. autoSurfaceAtToolDispatch — RESULT STRUCTURE WHEN SURFACE FIRES
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtToolDispatch — result structure', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
  });

  it('returns AutoSurfaceResult shape when triggered memories exist', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'some context query' });

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('constitutional');
    expect(result).toHaveProperty('triggered');
    expect(result).toHaveProperty('surfaced_at');
    expect(result).toHaveProperty('latencyMs');
  });

  it('result.constitutional is an array', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'some context query' });
    expect(Array.isArray(result?.constitutional)).toBe(true);
  });

  it('result.triggered is an array', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'some context query' });
    expect(Array.isArray(result?.triggered)).toBe(true);
  });

  it('result.triggered items have expected fields', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'some context query' });
    const triggered = result?.triggered ?? [];
    expect(triggered.length).toBeGreaterThan(0);
    expect(triggered[0]).toHaveProperty('memory_id');
    expect(triggered[0]).toHaveProperty('spec_folder');
    expect(triggered[0]).toHaveProperty('title');
    expect(triggered[0]).toHaveProperty('matched_phrases');
  });

  it('result.latencyMs is a non-negative number', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'some context query' });
    expect(typeof result?.latencyMs).toBe('number');
    expect(result?.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('result.surfaced_at is an ISO date string', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'some context query' });
    expect(typeof result?.surfaced_at).toBe('string');
    expect(() => new Date(result!.surfaced_at)).not.toThrow();
  });
});

/* ───────────────────────────────────────────────────────────────
   7. autoSurfaceAtCompaction — BASIC BEHAVIOR
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtCompaction — basic behavior', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([]);
  });

  it('is exported as a function', () => {
    expect(typeof autoSurfaceAtCompaction).toBe('function');
  });

  it('returns a Promise', () => {
    const result = autoSurfaceAtCompaction('Working on feature X in specs/010');
    expect(result).toBeInstanceOf(Promise);
  });

  it('returns null when no DB and no triggered matches (nothing to surface)', async () => {
    const result = await autoSurfaceAtCompaction('Some session context about the current task');
    expect(result).toBeNull();
  });

  it('returns null for empty string', async () => {
    const result = await autoSurfaceAtCompaction('');
    expect(result).toBeNull();
  });

  it('returns null for whitespace-only string', async () => {
    const result = await autoSurfaceAtCompaction('   ');
    expect(result).toBeNull();
  });

  it('returns null for strings shorter than 3 characters', async () => {
    const result = await autoSurfaceAtCompaction('ab');
    expect(result).toBeNull();
  });

  it('returns null for non-string input (null)', async () => {
    const result = await autoSurfaceAtCompaction(null as unknown as string);
    expect(result).toBeNull();
  });

  it('returns null for non-string input (undefined)', async () => {
    const result = await autoSurfaceAtCompaction(undefined as unknown as string);
    expect(result).toBeNull();
  });
});

/* ───────────────────────────────────────────────────────────────
   8. autoSurfaceAtCompaction — CONFIG FLAG DISABLING
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtCompaction — config flag disabling', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);
  });

  it('returns null when enableCompactionHook is false', async () => {
    const result = await autoSurfaceAtCompaction(
      'Long session context with meaningful content',
      { enableCompactionHook: false }
    );
    expect(result).toBeNull();
  });

  it('does NOT skip when enableCompactionHook is true', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtCompaction(
      'Long session context with meaningful content',
      { enableCompactionHook: true }
    );

    expect(matchSpy).toHaveBeenCalledTimes(1);
  });

  it('does NOT skip when options are omitted (default enabled)', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtCompaction('Long session context with meaningful content');

    expect(matchSpy).toHaveBeenCalledTimes(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   9. autoSurfaceAtCompaction — TRIMS WHITESPACE BEFORE SURFACING
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtCompaction — whitespace trimming', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([]);
  });

  it('trims leading/trailing whitespace from sessionContext', async () => {
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    await autoSurfaceAtCompaction('  session context trimmed  ');

    // Should be called with the trimmed value
    expect(matchSpy).toHaveBeenCalledWith('session context trimmed', 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   10. autoSurfaceAtCompaction — RESULT STRUCTURE
──────────────────────────────────────────────────────────────── */

describe('TM-05: autoSurfaceAtCompaction — result structure', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
  });

  it('returns AutoSurfaceResult shape when triggered memories exist', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtCompaction('Session context about memory search and spec kit');

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('constitutional');
    expect(result).toHaveProperty('triggered');
    expect(result).toHaveProperty('surfaced_at');
    expect(result).toHaveProperty('latencyMs');
  });

  it('result.triggered items have correct field names', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtCompaction('Session context about memory search');
    const triggered = result?.triggered ?? [];
    expect(triggered[0]).toHaveProperty('memory_id');
    expect(triggered[0]).toHaveProperty('spec_folder');
    expect(triggered[0]).toHaveProperty('title');
    expect(triggered[0]).toHaveProperty('matched_phrases');
  });

  it('result.latencyMs is non-negative', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);

    const result = await autoSurfaceAtCompaction('Session context about memory search');
    expect(result?.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   11. TOKEN BUDGET ENFORCEMENT
──────────────────────────────────────────────────────────────── */

describe('TM-05: Token budget enforcement (4000 max per point)', () => {
  it('TOOL_DISPATCH_TOKEN_BUDGET does not exceed 4000', () => {
    expect(TOOL_DISPATCH_TOKEN_BUDGET).toBeLessThanOrEqual(4000);
  });

  it('COMPACTION_TOKEN_BUDGET does not exceed 4000', () => {
    expect(COMPACTION_TOKEN_BUDGET).toBeLessThanOrEqual(4000);
  });

  it('trigger-matcher is limited to 5 results per surface call (per-budget control)', async () => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);

    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();
    matchSpy.mockReturnValue([]);

    await autoSurfaceAtToolDispatch('bash', { query: 'test budget enforcement query' });

    // The second argument to matchTriggerPhrases is the limit
    if (matchSpy.mock.calls.length > 0) {
      const limitArg = matchSpy.mock.calls[0][1];
      expect(limitArg).toBe(5);
    }
  });

  it('compaction hook also enforces result limit via matchTriggerPhrases', async () => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);

    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();
    matchSpy.mockReturnValue([]);

    await autoSurfaceAtCompaction('Session context to verify budget enforcement');

    if (matchSpy.mock.calls.length > 0) {
      const limitArg = matchSpy.mock.calls[0][1];
      expect(limitArg).toBe(5);
    }
  });

  it('tool-dispatch output boundary enforces estimated token budget', async () => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    const oversized = 'x'.repeat(6000);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([
      makeTriggerMatch({ title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 2, title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 3, title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 4, title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 5, title: oversized, matchedPhrases: [oversized] }),
    ]);

    const result = await autoSurfaceAtToolDispatch('bash', { query: 'explicit budget enforcement' });
    if (!result) {
      expect(result).toBeNull();
      return;
    }

    const estimatedTokens = estimateTokenCount(JSON.stringify(result));
    expect(estimatedTokens).toBeLessThanOrEqual(TOOL_DISPATCH_TOKEN_BUDGET);
  });

  it('compaction output boundary enforces estimated token budget', async () => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
    const oversized = 'y'.repeat(6000);
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([
      makeTriggerMatch({ title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 2, title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 3, title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 4, title: oversized, matchedPhrases: [oversized] }),
      makeTriggerMatch({ memoryId: 5, title: oversized, matchedPhrases: [oversized] }),
    ]);

    const result = await autoSurfaceAtCompaction('compaction context for budget enforcement');
    if (!result) {
      expect(result).toBeNull();
      return;
    }

    const estimatedTokens = estimateTokenCount(JSON.stringify(result));
    expect(estimatedTokens).toBeLessThanOrEqual(COMPACTION_TOKEN_BUDGET);
  });
});

/* ───────────────────────────────────────────────────────────────
   12. NO REGRESSION — existing autoSurfaceMemories behavior
──────────────────────────────────────────────────────────────── */

describe('TM-05: No regression in existing autoSurfaceMemories', () => {
  beforeEach(() => {
    clearConstitutionalCache();
    // @ts-expect-error Testing invalid input shape
    vi.mocked(vectorIndex.getDb).mockReturnValue(null);
  });

  it('autoSurfaceMemories is still exported', () => {
    expect(typeof autoSurfaceMemories).toBe('function');
  });

  it('autoSurfaceMemories returns null when nothing to surface', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([]);
    const result = await autoSurfaceMemories('some context hint');
    expect(result).toBeNull();
  });

  it('autoSurfaceMemories returns result when triggered matches exist', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);
    const result = await autoSurfaceMemories('some context hint');
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('constitutional');
    expect(result).toHaveProperty('triggered');
    expect(result).toHaveProperty('surfaced_at');
    expect(result).toHaveProperty('latencyMs');
  });

  it('autoSurfaceMemories does not throw on triggerMatcher error', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockImplementation(() => {
      throw new Error('Simulated matcher failure');
    });

    const result = await autoSurfaceMemories('context hint');
    expect(result).toBeNull();

    // Restore
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([]);
  });

  it('existing constants still exported correctly', () => {
    expect(MEMORY_AWARE_TOOLS).toBeInstanceOf(Set);
    expect(MEMORY_AWARE_TOOLS.size).toBeGreaterThan(0);
    expect(typeof CONSTITUTIONAL_CACHE_TTL).toBe('number');
    expect(CONSTITUTIONAL_CACHE_TTL).toBeGreaterThan(0);
  });

  it('extractContextHint still works correctly', () => {
    expect(extractContextHint({ query: 'my query' })).toBe('my query');
    expect(extractContextHint({ input: 'my input' })).toBe('my input');
    expect(extractContextHint({})).toBeNull();
    expect(extractContextHint(null)).toBeNull();
    expect(extractContextHint(undefined)).toBeNull();
  });

  it('new hook functions do not interfere with autoSurfaceMemories', async () => {
    vi.mocked(triggerMatcher.matchTriggerPhrases).mockReturnValue([makeTriggerMatch()]);
    const matchSpy = vi.mocked(triggerMatcher.matchTriggerPhrases);
    matchSpy.mockClear();

    // Call both new hooks and the original function
    await autoSurfaceAtToolDispatch('bash', { query: 'dispatch query' });
    await autoSurfaceAtCompaction('compaction session context');
    await autoSurfaceMemories('direct call context');

    // Each call chain invokes matchTriggerPhrases exactly once per call
    expect(matchSpy).toHaveBeenCalledTimes(3);
  });
});

/* ───────────────────────────────────────────────────────────────
   13. MODULE EXPORTS VERIFICATION
──────────────────────────────────────────────────────────────── */

describe('TM-05: Module exports verification', () => {
  it('TOOL_DISPATCH_TOKEN_BUDGET is exported', () => {
    expect(TOOL_DISPATCH_TOKEN_BUDGET).toBeDefined();
  });

  it('COMPACTION_TOKEN_BUDGET is exported', () => {
    expect(COMPACTION_TOKEN_BUDGET).toBeDefined();
  });

  it('autoSurfaceAtToolDispatch is exported', () => {
    expect(typeof autoSurfaceAtToolDispatch).toBe('function');
  });

  it('autoSurfaceAtCompaction is exported', () => {
    expect(typeof autoSurfaceAtCompaction).toBe('function');
  });

  it('all pre-existing exports are still present', () => {
    // Constants
    expect(MEMORY_AWARE_TOOLS).toBeDefined();
    expect(CONSTITUTIONAL_CACHE_TTL).toBeDefined();

    // Functions
    expect(typeof extractContextHint).toBe('function');
    expect(typeof autoSurfaceMemories).toBe('function');
    expect(typeof clearConstitutionalCache).toBe('function');
  });
});
