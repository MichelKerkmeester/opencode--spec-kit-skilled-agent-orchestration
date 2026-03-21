// TEST: Contamination Filter — severity tracking and SEVERITY_RANK export
import { describe, expect, it } from 'vitest';

import { filterContamination, SEVERITY_RANK } from '../extractors/contamination-filter';
import { getSourceCapabilities } from '../utils/source-capabilities';

describe('filterContamination severity tracking', () => {
  it('reports low severity for preamble-only input', () => {
    const result = filterContamination('Let me check the logs. Let me read the config.');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('low');
  });

  it('escalates to high when low and high patterns co-occur', () => {
    const result = filterContamination('Let me check this. As an AI, I can help.');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
  });

  it('returns null severity when nothing matches', () => {
    const result = filterContamination('Decision: adopt deterministic scoring.');

    expect(result.hadContamination).toBe(false);
    expect(result.maxSeverity).toBeNull();
  });

  it('exports SEVERITY_RANK with low < medium < high', () => {
    expect(SEVERITY_RANK.low).toBe(0);
    expect(SEVERITY_RANK.medium).toBe(1);
    expect(SEVERITY_RANK.high).toBe(2);
    expect(SEVERITY_RANK.low).toBeLessThan(SEVERITY_RANK.medium);
    expect(SEVERITY_RANK.medium).toBeLessThan(SEVERITY_RANK.high);
  });

  it('reports medium severity for orchestration-only input', () => {
    const result = filterContamination("I'll execute this step by step");

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('medium');
  });

  it('escalates to medium when low and medium patterns co-occur', () => {
    const result = filterContamination("Let me check. I'll now review.");

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('medium');
  });

  // Covers: F-31 (Post-cleanup — orphaned punctuation, double-spaces, leading conjunctions)
  it('cleans git-like subjects containing medium-severity contamination', () => {
    const result = filterContamination("Modified via: I'll now handle the edge case");

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('medium');
    expect(result.cleanedText).not.toMatch(/I'll now/i);
  });

  it('catches API Error prefix with status code', () => {
    const result = filterContamination('API Error: 500 {"type":"error","error":{"type":"api_error"}}');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
    expect(result.matchedPatterns).toContain('api error prefix');
  });

  it('catches JSON error payload', () => {
    const result = filterContamination('Response was {"type": "error", "error": {"type": "overloaded_error"}}');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
    expect(result.matchedPatterns).toContain('json error payload');
  });

  it('catches request_id leak in text', () => {
    const result = filterContamination('Failed with "request_id": "req_011cz9eisjyoe5devttoidqk" in response');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
    expect(result.matchedPatterns).toContain('request id leak');
  });

  // Covers: F-10 (Unicode normalization + tool-path pattern)
  it('downgrades tool title with path severity for sources whose capabilities expect transcript-style tool titles', () => {
    const result = filterContamination(
      'Read tool on /src/file.ts',
      undefined,
      { sourceCapabilities: getSourceCapabilities('claude-code-capture') },
    );

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('low');
    expect(result.matchedPatterns).toContain('tool title with path');
  });

  it('preserves high severity for sources whose capabilities do not expect transcript-style tool titles', () => {
    const result = filterContamination(
      'Read tool on /src/file.ts',
      undefined,
      { sourceCapabilities: getSourceCapabilities('codex-cli-capture') },
    );

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
    expect(result.matchedPatterns).toContain('tool title with path');
  });

  it('keeps the same downgrade behavior when only captureSource is provided', () => {
    const result = filterContamination(
      'Read tool on /src/file.ts',
      undefined,
      { captureSource: 'claude-code-capture' },
    );

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('low');
    expect(result.matchedPatterns).toContain('tool title with path');
  });

  it('falls back to original severity when no source metadata is provided', () => {
    const result = filterContamination('Read tool on /src/file.ts');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
    expect(result.matchedPatterns).toContain('tool title with path');
  });
});
