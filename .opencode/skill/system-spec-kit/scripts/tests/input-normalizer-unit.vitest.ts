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
