// TCOV-001: Focused unit tests for normalizeFileEntryLike via normalizeInputData
import { describe, expect, it } from 'vitest';
import { normalizeInputData } from '../utils/input-normalizer';
import type { RawInputData, NormalizedData, NormalizedFileEntry } from '../utils/input-normalizer';

/**
 * Helper: create minimal RawInputData with FILES array that routes through
 * the slow path (manual normalization) to exercise normalizeFileEntryLike.
 */
function makeInputWithFiles(files: Array<Record<string, unknown>>): RawInputData {
  return {
    sessionSummary: 'Test session',
    FILES: files as RawInputData['FILES'],
  };
}

function getFiles(result: NormalizedData | RawInputData): NormalizedFileEntry[] {
  return (result as NormalizedData).FILES || [];
}

// Covers: F-16 (Ensure FILES uses FileEntry format via normalizeFileEntryLike)
describe('normalizeFileEntryLike via normalizeInputData', () => {
  it('normalizes an empty object to defaults', () => {
    const result = normalizeInputData(makeInputWithFiles([{}]));
    const files = getFiles(result);
    expect(files).toHaveLength(1);
    expect(files[0].FILE_PATH).toBe('');
    expect(files[0].DESCRIPTION).toBe('Modified during session');
  });

  it('handles missing FILE_PATH and path gracefully', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { DESCRIPTION: 'some desc' },
    ]));
    const files = getFiles(result);
    expect(files[0].FILE_PATH).toBe('');
    expect(files[0].DESCRIPTION).toBe('some desc');
  });

  it('coerces non-string FILE_PATH (number) to string', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 42, DESCRIPTION: 'test' },
    ]));
    const files = getFiles(result);
    expect(files[0].FILE_PATH).toBe('42');
  });

  it('coerces non-string FILE_PATH (boolean) to string', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: true, DESCRIPTION: 'test' },
    ]));
    const files = getFiles(result);
    expect(files[0].FILE_PATH).toBe('true');
  });

  it('rejects object FILE_PATH and uses default', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: { nested: true }, DESCRIPTION: 'test' },
    ]));
    const files = getFiles(result);
    expect(files[0].FILE_PATH).toBe('');
  });

  it('rejects array DESCRIPTION and uses default', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts', DESCRIPTION: ['an', 'array'] },
    ]));
    const files = getFiles(result);
    expect(files[0].DESCRIPTION).toBe('Modified during session');
  });

  it('uses default for null FILE_PATH', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: null, DESCRIPTION: 'test' },
    ]));
    const files = getFiles(result);
    // null FILE_PATH with no path fallback → empty string default
    expect(files[0].FILE_PATH).toBe('');
  });

  it('prefers FILE_PATH over path when both present', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'src/main.ts', path: 'src/other.ts', DESCRIPTION: 'test' },
    ]));
    const files = getFiles(result);
    expect(files[0].FILE_PATH).toBe('src/main.ts');
  });

  it('falls back to path when FILE_PATH is absent', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { path: 'src/fallback.ts', DESCRIPTION: 'test' },
    ]));
    const files = getFiles(result);
    expect(files[0].FILE_PATH).toBe('src/fallback.ts');
  });

  it('handles missing DESCRIPTION with default', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'src/main.ts' },
    ]));
    const files = getFiles(result);
    expect(files[0].DESCRIPTION).toBe('Modified during session');
  });

  it('defaults invalid MODIFICATION_MAGNITUDE to unknown', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts', MODIFICATION_MAGNITUDE: 'huge' },
    ]));
    const files = getFiles(result);
    expect(files[0].MODIFICATION_MAGNITUDE).toBe('unknown');
  });

  it('preserves valid MODIFICATION_MAGNITUDE', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts', MODIFICATION_MAGNITUDE: 'large' },
    ]));
    const files = getFiles(result);
    expect(files[0].MODIFICATION_MAGNITUDE).toBe('large');
  });

  it('omits MODIFICATION_MAGNITUDE when not provided', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts' },
    ]));
    const files = getFiles(result);
    expect(files[0].MODIFICATION_MAGNITUDE).toBeUndefined();
  });

  it('trims and capitalizes ACTION', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts', ACTION: '  modified  ' },
    ]));
    const files = getFiles(result);
    expect(files[0].ACTION).toBe('Modified');
  });

  it('handles lowercase action field via fallback', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts', action: 'created' },
    ]));
    const files = getFiles(result);
    expect(files[0].ACTION).toBe('Created');
  });

  it('drops invalid _provenance values', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts', _provenance: 'invalid-source' },
    ]));
    const files = getFiles(result);
    expect(files[0]._provenance).toBeUndefined();
  });

  it('preserves valid _provenance values', () => {
    const result = normalizeInputData(makeInputWithFiles([
      { FILE_PATH: 'a.ts', _provenance: 'git' },
    ]));
    const files = getFiles(result);
    expect(files[0]._provenance).toBe('git');
  });
});

// Covers: F-15 (Field-by-field completion instead of early return — backfill missing arrays)
describe('normalizeInputData importanceTier propagation (BUG-006)', () => {
  it('propagates importanceTier through slow path', () => {
    const result = normalizeInputData({
      sessionSummary: 'Test',
      importanceTier: 'critical',
    });
    expect((result as NormalizedData).importanceTier).toBe('critical');
  });

  it('propagates importance_tier (snake_case) through slow path', () => {
    const result = normalizeInputData({
      sessionSummary: 'Test',
      importance_tier: 'temporary',
    });
    expect((result as NormalizedData).importanceTier).toBe('temporary');
  });

  it('propagates importanceTier through fast path', () => {
    const result = normalizeInputData({
      userPrompts: [{ prompt: 'test', timestamp: '2026-01-01T00:00:00Z' }],
      observations: [{ type: 'feature', title: 'test', narrative: 'test', facts: [] }],
      recentContext: [{ request: 'test', learning: 'test' }],
      importanceTier: 'important',
    });
    expect((result as NormalizedData).importanceTier).toBe('important');
  });

  it('does not set importanceTier when not provided', () => {
    const result = normalizeInputData({
      sessionSummary: 'Test',
    });
    expect((result as NormalizedData).importanceTier).toBeUndefined();
  });
});

describe('normalizeInputData explicit memory metadata propagation', () => {
  it('preserves explicit title, description, and causalLinks through the slow path', () => {
    const result = normalizeInputData({
      sessionSummary: 'Slow-path metadata propagation test.',
      title: 'Authored slow-path title',
      description: 'Authored slow-path description',
      causalLinks: {
        supersedes: ['previous-session'],
        derivedFrom: ['planning-session'],
      },
    }) as NormalizedData;

    expect(result.title).toBe('Authored slow-path title');
    expect(result.description).toBe('Authored slow-path description');
    expect(result.causalLinks).toMatchObject({
      supersedes: ['previous-session'],
      derivedFrom: ['planning-session'],
      derived_from: ['planning-session'],
    });
    expect(result.causal_links).toMatchObject({
      supersedes: ['previous-session'],
      derivedFrom: ['planning-session'],
    });
  });

  it('preserves explicit title, description, and causal_links through the fast path', () => {
    const result = normalizeInputData({
      userPrompts: [{ prompt: 'Existing prompt', timestamp: '2026-04-09T20:00:00.000Z' }],
      observations: [{ type: 'implementation', title: 'Existing observation', narrative: 'Existing narrative', facts: [] }],
      recentContext: [{ request: 'Existing request', learning: 'Existing learning' }],
      title: 'Authored fast-path title',
      description: 'Authored fast-path description',
      causal_links: {
        supersedes: ['fast-path-predecessor'],
        caused_by: ['root-cause-investigation'],
      },
    }) as NormalizedData;

    expect(result.title).toBe('Authored fast-path title');
    expect(result.description).toBe('Authored fast-path description');
    expect(result.causalLinks).toMatchObject({
      supersedes: ['fast-path-predecessor'],
      causedBy: ['root-cause-investigation'],
      caused_by: ['root-cause-investigation'],
    });
    expect(result.causal_links).toMatchObject({
      supersedes: ['fast-path-predecessor'],
      causedBy: ['root-cause-investigation'],
    });
  });
});

describe('normalizeInputData fast-path string coercion and enrichment merge', () => {
  it('coerces string arrays into structured fast-path objects', () => {
    const result = normalizeInputData({
      user_prompts: ['Capture the session context'],
      observations: ['Fast-path observations should survive. They must stay readable.'],
      recent_context: ['Investigated the failing save path'],
    } as RawInputData) as NormalizedData;

    expect(result.userPrompts).toHaveLength(1);
    expect(result.userPrompts[0].prompt).toBe('Capture the session context');
    expect(result.userPrompts[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    expect(result.observations).toHaveLength(1);
    expect(result.observations[0].title).toBe('Fast-path observations should survive.');
    expect(result.observations[0].narrative).toBe('Fast-path observations should survive. They must stay readable.');
    expect(result.observations[0].facts).toEqual([]);

    expect(result.recentContext).toEqual([
      {
        request: 'Investigated the failing save path',
        learning: 'Investigated the failing save path',
      },
    ]);
  });

  it('merges slow-path enrichments when fast-path arrays are already present', () => {
    const result = normalizeInputData({
      userPrompts: [{ prompt: 'Existing prompt', timestamp: '2026-04-08T10:00:00.000Z' }],
      observations: [{ type: 'feature', title: 'Existing observation', narrative: 'Existing narrative', facts: [] }],
      recentContext: [{ request: 'Existing request', learning: 'Existing learning' }],
      sessionSummary: 'Patched the fast-path normalizer and verified the save flow end to end.',
      keyDecisions: ['Chose additive coercion to preserve object-shaped callers.'],
      nextSteps: ['Run the regression suite'],
      filesModified: ['scripts/utils/input-normalizer.ts - add fast-path coercion'],
      toolCalls: [{ tool: 'Bash', title: 'npm run build' }],
      exchanges: [{ userInput: 'Can you fix the broken memory save?', assistantResponse: 'Yes.' }],
    } as RawInputData) as NormalizedData;

    expect(result.FILES).toEqual([
      {
        FILE_PATH: 'scripts/utils/input-normalizer.ts',
        DESCRIPTION: 'add fast-path coercion',
        ACTION: 'Modified',
      },
    ]);
    expect(result._manualDecisions).toHaveLength(1);
    expect(result.userPrompts.map((prompt) => prompt.prompt)).toContain('Can you fix the broken memory save?');
    expect(result.observations.some((observation) => observation.narrative === 'Patched the fast-path normalizer and verified the save flow end to end.')).toBe(true);
    expect(result.observations.some((observation) => observation.title === 'Tool: Bash' && observation.narrative === 'npm run build')).toBe(true);
    expect(result.observations.some((observation) => observation.title === 'Next Steps')).toBe(true);
    expect(result.observations.some((observation) => observation.type === 'decision')).toBe(true);
  });
});

describe('normalizeInputData Phase 016 regressions', () => {
  it('deduplicates duplicate observations in fast-path structured payloads', () => {
    const result = normalizeInputData({
      userPrompts: [{ prompt: 'test', timestamp: '2026-01-01T00:00:00Z' }],
      recentContext: [{ request: 'test', learning: 'test' }],
      observations: [
        { type: 'feature', title: 'First', narrative: 'same narrative', facts: [] },
        { type: 'feature', title: 'Second', narrative: 'same narrative', facts: [] },
      ],
    }) as NormalizedData;

    expect(result.observations).toHaveLength(1);
    expect(result.observations[0].title).toBe('First');
  });

  it('propagates projectPhase through fast-path structured payloads', () => {
    const result = normalizeInputData({
      userPrompts: [{ prompt: 'test', timestamp: '2026-01-01T00:00:00Z' }],
      recentContext: [{ request: 'test', learning: 'test' }],
      observations: [{ type: 'feature', title: 'test', narrative: 'test', facts: [] }],
      projectPhase: 'IMPLEMENTATION',
    }) as NormalizedData;

    expect(result.projectPhase).toBe('IMPLEMENTATION');
  });
});
