// TEST: Validation Signals as Retrieval Metadata
//
// Tests for:
// - extractValidationMetadata: signal extraction from PipelineRow
// - enrichResultsWithValidationMetadata: batch enrichment of results
//
// Coverage areas:
// T1-T5   : extractValidationMetadata — quality score signals
// T6-T9   : extractValidationMetadata — SPECKIT_LEVEL extraction
// T10-T12 : extractValidationMetadata — completion status markers
// T13-T14 : extractValidationMetadata — checklist heuristic
// T15-T16 : extractValidationMetadata — edge cases (null / missing)
// T17-T20 : enrichResultsWithValidationMetadata — batch enrichment
// T21-T22 : score immutability invariant
import { describe, it, expect } from 'vitest';
import {
  extractValidationMetadata,
  enrichResultsWithValidationMetadata,
  TIER_QUALITY_SCORES,
  VALIDATION_COMPLETE_MARKERS,
} from '../lib/search/validation-metadata';
import type { ValidationMetadata } from '../lib/search/validation-metadata';
import type { PipelineRow } from '../lib/search/pipeline/types';
import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';

// -- Helpers --

function makeRow(overrides: Partial<PipelineRow> = {}): PipelineRow {
  return {
    id: 1,
    ...overrides,
  } as PipelineRow;
}

/* ───────────────────────────────────────────────────────────────
   T1-T5: Quality score signal extraction
   ──────────────────────────────────────────────────────────────── */

describe('extractValidationMetadata — quality score signals', () => {
  it('T1: extracts qualityScore from db quality_score when present and positive', () => {
    const row = makeRow({ quality_score: 0.85 });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull();
    expect(meta!.qualityScore).toBeCloseTo(0.85, 5);
  });

  it('T2: clamps qualityScore above 1.0 to 1.0; treats negative as absent (no tier fallback → null)', () => {
    // Values above 1 are clamped to 1.0.
    const rowHigh = makeRow({ quality_score: 1.5 });
    expect(extractValidationMetadata(rowHigh)!.qualityScore).toBe(1.0);

    // Negative quality_score is treated as absent. Without a tier, returns null.
    const rowLow = makeRow({ quality_score: -0.3 });
    expect(extractValidationMetadata(rowLow)).toBeNull();

    // Negative quality_score with a tier falls back to tier score.
    const rowLowWithTier = makeRow({ quality_score: -0.3, importance_tier: 'normal' });
    expect(extractValidationMetadata(rowLowWithTier)!.qualityScore).toBe(TIER_QUALITY_SCORES['normal']);
  });

  it('T3: falls back to tier score when quality_score is zero', () => {
    const row = makeRow({ quality_score: 0, importance_tier: 'critical' });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull();
    expect(meta!.qualityScore).toBe(TIER_QUALITY_SCORES['critical']);
  });

  it('T4: falls back to tier score when quality_score is absent', () => {
    const row = makeRow({ importance_tier: 'important' });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull();
    expect(meta!.qualityScore).toBe(TIER_QUALITY_SCORES['important']);
  });

  it('T5: maps all known importance tiers to expected quality scores', () => {
    const expected: Record<string, number> = {
      constitutional: 1.0,
      critical: 0.9,
      important: 0.75,
      normal: 0.5,
      temporary: 0.3,
      deprecated: 0.1,
    };

    for (const [tier, score] of Object.entries(expected)) {
      const row = makeRow({ importance_tier: tier });
      const meta = extractValidationMetadata(row);
      expect(meta).not.toBeNull();
      expect(meta!.qualityScore).toBe(score);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   T6-T9: SPECKIT_LEVEL extraction from content
   ──────────────────────────────────────────────────────────────── */

describe('extractValidationMetadata — SPECKIT_LEVEL from content', () => {
  it('T6: extracts specLevel 1 from <!-- SPECKIT_LEVEL: 1 --> marker', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: '<!-- SPECKIT_LEVEL: 1 -->\n# My Spec\nContent here.',
    });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull();
    expect(meta!.specLevel).toBe(1);
  });

  it('T7: extracts specLevel 2 and 3 from their respective markers', () => {
    const row2 = makeRow({ importance_tier: 'normal', content: '<!-- SPECKIT_LEVEL: 2 -->' });
    const row3 = makeRow({ importance_tier: 'normal', content: '<!-- SPECKIT_LEVEL: 3 -->' });

    expect(extractValidationMetadata(row2)!.specLevel).toBe(2);
    expect(extractValidationMetadata(row3)!.specLevel).toBe(3);
  });

  it('T8: maps SPECKIT_LEVEL: 3+ to specLevel 4', () => {
    const row = makeRow({
      importance_tier: 'critical',
      content: '<!-- SPECKIT_LEVEL: 3+ -->\n# Enterprise spec',
    });
    const meta = extractValidationMetadata(row);

    expect(meta!.specLevel).toBe(4);
  });

  it('T9: returns no specLevel when marker is absent from content', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: '# Just a regular spec\nNo level marker here.',
    });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull(); // tier provides a signal
    expect(meta!.specLevel).toBeUndefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T10-T12: Completion status from content markers
   ──────────────────────────────────────────────────────────────── */

describe('extractValidationMetadata — completion status', () => {
  it('T10: returns completionStatus=complete for <!-- VALIDATED --> marker', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: '<!-- VALIDATED -->\n# Validated spec',
    });
    const meta = extractValidationMetadata(row);

    expect(meta!.completionStatus).toBe('complete');
  });

  it('T10b: returns completionStatus=complete for <!-- VALIDATION: PASS --> marker', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: 'Done.\n<!-- VALIDATION: PASS -->\n',
    });
    expect(extractValidationMetadata(row)!.completionStatus).toBe('complete');
  });

  it('T10c: returns completionStatus=complete for <!-- CHECKLIST: COMPLETE --> marker', () => {
    const row = makeRow({
      importance_tier: 'important',
      content: '<!-- CHECKLIST: COMPLETE -->',
    });
    expect(extractValidationMetadata(row)!.completionStatus).toBe('complete');
  });

  it('T11: returns completionStatus=partial for [x] checklist items without completion marker', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: '- [x] Implement feature\n- [x] Write tests\n',
    });
    const meta = extractValidationMetadata(row);

    expect(meta!.completionStatus).toBe('partial');
  });

  it('T11b: returns completionStatus=partial when SPECKIT_LEVEL marker present without completion', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: '<!-- SPECKIT_LEVEL: 2 -->\nIn progress.',
    });
    const meta = extractValidationMetadata(row);

    expect(meta!.completionStatus).toBe('partial');
  });

  it('T12: does not set completionStatus when no markers present in content', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: 'Plain content with no markers.',
    });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull();
    expect(meta!.completionStatus).toBeUndefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T13-T14: Checklist heuristic from file_path
   ──────────────────────────────────────────────────────────────── */

describe('extractValidationMetadata — checklist file path heuristic', () => {
  it('T13: sets hasChecklist=true when file_path contains "checklist"', () => {
    const row = makeRow({ file_path: '/specs/007-auth/checklist.md' });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull();
    expect(meta!.hasChecklist).toBe(true);
  });

  it('T14: does not set hasChecklist when file_path is unrelated', () => {
    const row = makeRow({ file_path: '/specs/007-auth/spec.md' });
    const meta = extractValidationMetadata(row);

    // Only tier or content signals would be present — no hasChecklist
    expect(meta?.hasChecklist).toBeUndefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T15-T16: Edge cases — null and missing metadata
   ──────────────────────────────────────────────────────────────── */

describe('extractValidationMetadata — edge cases', () => {
  it('T15: returns null when row has no signals (no tier, no quality_score, no content)', () => {
    const row = makeRow({ id: 42 });
    const meta = extractValidationMetadata(row);

    expect(meta).toBeNull();
  });

  it('T15b: returns null for unknown/missing importance_tier with no other signals', () => {
    const row = makeRow({ importance_tier: 'unknown-tier-xyz' });
    const meta = extractValidationMetadata(row);

    // Unrecognised tier has no entry in TIER_QUALITY_SCORES → null
    expect(meta).toBeNull();
  });

  it('T16: handles content being an empty string gracefully', () => {
    const row = makeRow({ importance_tier: 'normal', content: '' });
    const meta = extractValidationMetadata(row);

    expect(meta).not.toBeNull();
    expect(meta!.qualityScore).toBe(0.5); // from tier
    expect(meta!.specLevel).toBeUndefined();
    expect(meta!.completionStatus).toBeUndefined();
  });

  it('T16b: prefers precomputedContent over content when both present', () => {
    const row = makeRow({
      importance_tier: 'normal',
      content: 'plain content',
      precomputedContent: '<!-- SPECKIT_LEVEL: 2 -->\n<!-- VALIDATED -->',
    });
    const meta = extractValidationMetadata(row);

    expect(meta!.specLevel).toBe(2);
    expect(meta!.completionStatus).toBe('complete');
  });
});

/* ───────────────────────────────────────────────────────────────
   T17-T20: enrichResultsWithValidationMetadata — batch enrichment
   ──────────────────────────────────────────────────────────────── */

describe('enrichResultsWithValidationMetadata — batch enrichment', () => {
  it('T17: attaches validationMetadata to rows that have signals', () => {
    const rows: PipelineRow[] = [
      makeRow({ id: 1, importance_tier: 'critical', quality_score: 0.9 }),
      makeRow({ id: 2, importance_tier: 'normal' }),
    ];

    const enriched = enrichResultsWithValidationMetadata(rows);

    expect(enriched).toHaveLength(2);
    expect((enriched[0] as Record<string, unknown>).validationMetadata).toBeDefined();
    expect((enriched[1] as Record<string, unknown>).validationMetadata).toBeDefined();
  });

  it('T18: rows without any signals pass through without validationMetadata key', () => {
    const rows: PipelineRow[] = [
      makeRow({ id: 1 }), // no signals
      makeRow({ id: 2, importance_tier: 'important' }), // has signal
    ];

    const enriched = enrichResultsWithValidationMetadata(rows);

    const noSignalRow = enriched[0] as Record<string, unknown>;
    const signalRow = enriched[1] as Record<string, unknown>;

    expect(noSignalRow.validationMetadata).toBeUndefined();
    expect(signalRow.validationMetadata).toBeDefined();
  });

  it('T19: returns empty array unchanged', () => {
    expect(enrichResultsWithValidationMetadata([])).toEqual([]);
  });

  it('T20: enriches all fields in a single row that has multiple signals', () => {
    const rows: PipelineRow[] = [
      makeRow({
        id: 10,
        importance_tier: 'critical',
        quality_score: 0.92,
        content: '<!-- SPECKIT_LEVEL: 3 -->\n<!-- VALIDATED -->\n2024-07-15 validated.',
        file_path: '/specs/010/checklist.md',
      }),
    ];

    const enriched = enrichResultsWithValidationMetadata(rows);
    const meta = (enriched[0] as Record<string, unknown>).validationMetadata as ValidationMetadata;

    expect(meta.qualityScore).toBeCloseTo(0.92, 5); // DB score takes priority
    expect(meta.specLevel).toBe(3);
    expect(meta.completionStatus).toBe('complete');
    expect(meta.hasChecklist).toBe(true);
    expect(meta.validationDate).toBe('2024-07-15');
  });
});

/* ───────────────────────────────────────────────────────────────
   T21-T22: Score immutability invariant
   ──────────────────────────────────────────────────────────────── */

describe('enrichResultsWithValidationMetadata — score immutability', () => {
  it('T21: does not modify score, rrfScore, or similarity fields', () => {
    const rows: PipelineRow[] = [
      makeRow({
        id: 1,
        score: 0.75,
        rrfScore: 0.68,
        similarity: 82,
        importance_tier: 'important',
        quality_score: 0.8,
      }),
    ];

    const enriched = enrichResultsWithValidationMetadata(rows);

    expect(enriched[0].score).toBe(0.75);
    expect(enriched[0].rrfScore).toBe(0.68);
    expect(enriched[0].similarity).toBe(82);
  });

  it('T22: does not modify intentAdjustedScore or importance_weight', () => {
    const rows: PipelineRow[] = [
      makeRow({
        id: 2,
        intentAdjustedScore: 0.91,
        importance_weight: 0.6,
        importance_tier: 'critical',
      }),
    ];

    const enriched = enrichResultsWithValidationMetadata(rows);

    expect(enriched[0].intentAdjustedScore).toBe(0.91);
    expect(enriched[0].importance_weight).toBe(0.6);
  });
});

/* ───────────────────────────────────────────────────────────────
   Exported constants completeness
   ──────────────────────────────────────────────────────────────── */

describe('TIER_QUALITY_SCORES and VALIDATION_COMPLETE_MARKERS exports', () => {
  it('TIER_QUALITY_SCORES covers all six standard tiers', () => {
    const expectedTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
    for (const tier of expectedTiers) {
      expect(TIER_QUALITY_SCORES[tier]).toBeDefined();
      expect(TIER_QUALITY_SCORES[tier]).toBeGreaterThanOrEqual(0);
      expect(TIER_QUALITY_SCORES[tier]).toBeLessThanOrEqual(1);
    }
  });

  it('TIER_QUALITY_SCORES values are ordered correctly (constitutional > deprecated)', () => {
    expect(TIER_QUALITY_SCORES['constitutional']).toBeGreaterThan(TIER_QUALITY_SCORES['critical']);
    expect(TIER_QUALITY_SCORES['critical']).toBeGreaterThan(TIER_QUALITY_SCORES['important']);
    expect(TIER_QUALITY_SCORES['important']).toBeGreaterThan(TIER_QUALITY_SCORES['normal']);
    expect(TIER_QUALITY_SCORES['normal']).toBeGreaterThan(TIER_QUALITY_SCORES['temporary']);
    expect(TIER_QUALITY_SCORES['temporary']).toBeGreaterThan(TIER_QUALITY_SCORES['deprecated']);
  });

  it('VALIDATION_COMPLETE_MARKERS has at least 3 known markers', () => {
    expect(VALIDATION_COMPLETE_MARKERS.length).toBeGreaterThanOrEqual(3);
    expect(VALIDATION_COMPLETE_MARKERS).toContain('<!-- VALIDATED -->');
  });
});

/* ───────────────────────────────────────────────────────────────
   Stage 2 integration: validation metadata contributes to ranking
   ──────────────────────────────────────────────────────────────── */

describe('Stage2 validation scoring integration', () => {
  it('applies higher score to higher-quality validation metadata', () => {
    const rows: PipelineRow[] = [
      makeRow({
        id: 1,
        score: 0.5,
        validationMetadata: {
          qualityScore: 0.95,
          specLevel: 3,
          completionStatus: 'complete',
          hasChecklist: true,
        },
      }),
      makeRow({
        id: 2,
        score: 0.5,
        validationMetadata: {
          qualityScore: 0.2,
          completionStatus: 'unknown',
          hasChecklist: false,
        },
      }),
    ];

    const adjusted = stage2Testables.applyValidationSignalScoring(rows);
    expect(adjusted[0].id).toBe(1);
    expect((adjusted[0].score as number)).toBeGreaterThan(adjusted[1].score as number);
  });

  it('leaves score unchanged when validation metadata is absent', () => {
    const rows: PipelineRow[] = [
      makeRow({ id: 10, score: 0.42 }),
      makeRow({ id: 11, score: 0.37 }),
    ];

    const adjusted = stage2Testables.applyValidationSignalScoring(rows);
    expect(adjusted[0].score).toBe(0.42);
    expect(adjusted[1].score).toBe(0.37);
  });
});
