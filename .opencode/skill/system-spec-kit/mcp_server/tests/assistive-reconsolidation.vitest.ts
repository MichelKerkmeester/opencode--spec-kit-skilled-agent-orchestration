// TEST: Assistive Reconsolidation (REQ-D4-005)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isAssistiveReconsolidationEnabled,
  classifyAssistiveSimilarity,
  classifySupersededOrComplement,
  logAssistiveRecommendation,
  ASSISTIVE_AUTO_MERGE_THRESHOLD,
  ASSISTIVE_REVIEW_THRESHOLD,
} from '../handlers/save/reconsolidation-bridge';
import type { AssistiveRecommendation } from '../handlers/save/reconsolidation-bridge';

/* ───────────────────────────────────────────────────────────────
   FEATURE FLAG
----------------------------------------------------------------*/

describe('Assistive Reconsolidation — Feature Flag', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isAssistiveReconsolidationEnabled returns true by default (graduated)', () => {
    vi.stubEnv('SPECKIT_ASSISTIVE_RECONSOLIDATION', '');
    expect(isAssistiveReconsolidationEnabled()).toBe(true);
  });

  it('isAssistiveReconsolidationEnabled returns true for "true"', () => {
    vi.stubEnv('SPECKIT_ASSISTIVE_RECONSOLIDATION', 'true');
    expect(isAssistiveReconsolidationEnabled()).toBe(true);
  });

  it('isAssistiveReconsolidationEnabled returns true for "1"', () => {
    vi.stubEnv('SPECKIT_ASSISTIVE_RECONSOLIDATION', '1');
    expect(isAssistiveReconsolidationEnabled()).toBe(true);
  });

  it('isAssistiveReconsolidationEnabled returns false for "false"', () => {
    vi.stubEnv('SPECKIT_ASSISTIVE_RECONSOLIDATION', 'false');
    expect(isAssistiveReconsolidationEnabled()).toBe(false);
  });

  it('isAssistiveReconsolidationEnabled returns false for "0"', () => {
    vi.stubEnv('SPECKIT_ASSISTIVE_RECONSOLIDATION', '0');
    expect(isAssistiveReconsolidationEnabled()).toBe(false);
  });
});

/* ───────────────────────────────────────────────────────────────
   CONSTANTS
----------------------------------------------------------------*/

describe('Assistive Reconsolidation — Constants', () => {
  it('ASSISTIVE_AUTO_MERGE_THRESHOLD is 0.96', () => {
    expect(ASSISTIVE_AUTO_MERGE_THRESHOLD).toBeCloseTo(0.96);
  });

  it('ASSISTIVE_REVIEW_THRESHOLD is 0.88', () => {
    expect(ASSISTIVE_REVIEW_THRESHOLD).toBeCloseTo(0.88);
  });

  it('auto-merge threshold is above review threshold', () => {
    expect(ASSISTIVE_AUTO_MERGE_THRESHOLD).toBeGreaterThan(ASSISTIVE_REVIEW_THRESHOLD);
  });
});

/* ───────────────────────────────────────────────────────────────
   SIMILARITY CLASSIFICATION
----------------------------------------------------------------*/

describe('Assistive Reconsolidation — classifyAssistiveSimilarity', () => {
  it('returns "auto_merge" for similarity >= 0.96', () => {
    expect(classifyAssistiveSimilarity(0.96)).toBe('auto_merge');
    expect(classifyAssistiveSimilarity(0.99)).toBe('auto_merge');
    expect(classifyAssistiveSimilarity(1.0)).toBe('auto_merge');
  });

  it('returns "review" for similarity in [0.88, 0.96)', () => {
    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
    expect(classifyAssistiveSimilarity(0.90)).toBe('review');
    expect(classifyAssistiveSimilarity(0.9599)).toBe('review');
  });

  it('returns "keep_separate" for similarity < 0.88', () => {
    expect(classifyAssistiveSimilarity(0.87)).toBe('keep_separate');
    expect(classifyAssistiveSimilarity(0.50)).toBe('keep_separate');
    expect(classifyAssistiveSimilarity(0.0)).toBe('keep_separate');
  });

  it('exact boundary 0.96 is auto_merge', () => {
    expect(classifyAssistiveSimilarity(0.96)).toBe('auto_merge');
  });

  it('exact boundary 0.88 is review', () => {
    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
  });

  it('just below 0.88 is keep_separate', () => {
    expect(classifyAssistiveSimilarity(0.8799)).toBe('keep_separate');
  });
});

/* ───────────────────────────────────────────────────────────────
   SUPERSEDE / COMPLEMENT CLASSIFICATION
----------------------------------------------------------------*/

describe('Assistive Reconsolidation — classifySupersededOrComplement', () => {
  it('returns "supersede" when newer content is similar length to older', () => {
    const older = 'This is the old memory content.';
    const newer = 'This is updated memory content.';
    expect(classifySupersededOrComplement(older, newer)).toBe('supersede');
  });

  it('returns "complement" when newer content is substantially longer (>1.2x)', () => {
    const older = 'Short old content.';
    // ~4x longer — clearly adds more information
    const newer = 'Short old content. Plus a lot of new detail that was not present before, with additional context and explanations that expand significantly on the original.';
    expect(classifySupersededOrComplement(older, newer)).toBe('complement');
  });

  it('returns "supersede" for equal-length content', () => {
    const older = 'ABCDEFGHIJ';
    const newer = 'KLMNOPQRST'; // same length
    expect(classifySupersededOrComplement(older, newer)).toBe('supersede');
  });

  it('handles empty older content gracefully', () => {
    const result = classifySupersededOrComplement('', 'Some new content that is non-empty.');
    // Non-empty newer > 0 * 1.2 → complement
    expect(result).toBe('complement');
  });

  it('handles empty newer content gracefully', () => {
    const result = classifySupersededOrComplement('Old content here.', '');
    // Empty newer is not longer → supersede
    expect(result).toBe('supersede');
  });

  it('returns "supersede" when newer is exactly at the 1.2x boundary', () => {
    const older = 'A'.repeat(100);
    // exactly 120 chars = 1.2 * 100 (NOT strictly greater)
    const newer = 'B'.repeat(120);
    expect(classifySupersededOrComplement(older, newer)).toBe('supersede');
  });

  it('returns "complement" when newer is just above the 1.2x boundary', () => {
    const older = 'A'.repeat(100);
    // 121 chars > 1.2 * 100 → complement
    const newer = 'B'.repeat(121);
    expect(classifySupersededOrComplement(older, newer)).toBe('complement');
  });
});

/* ───────────────────────────────────────────────────────────────
   LOG RECOMMENDATION
----------------------------------------------------------------*/

describe('Assistive Reconsolidation — logAssistiveRecommendation', () => {
  it('logs the recommendation to console.warn without throwing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rec: AssistiveRecommendation = {
      olderMemoryId: 10,
      newerMemoryId: 20,
      similarity: 0.92,
      classification: 'supersede',
      recommendedAt: Date.now(),
    };
    expect(() => logAssistiveRecommendation(rec)).not.toThrow();
    expect(warnSpy).toHaveBeenCalledOnce();
    const msg = warnSpy.mock.calls[0]![0] as string;
    expect(msg).toContain('assistive recommendation');
    expect(msg).toContain('supersede');
    expect(msg).toContain('10');
    expect(msg).toContain('20');
    expect(msg).toContain('0.920');
    warnSpy.mockRestore();
  });

  it('logs complement classification correctly', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rec: AssistiveRecommendation = {
      olderMemoryId: 5,
      newerMemoryId: 6,
      similarity: 0.89,
      classification: 'complement',
      recommendedAt: Date.now(),
    };
    logAssistiveRecommendation(rec);
    const msg = warnSpy.mock.calls[0]![0] as string;
    expect(msg).toContain('complement');
    warnSpy.mockRestore();
  });
});

/* ───────────────────────────────────────────────────────────────
   THRESHOLD TIER INTEGRATION
----------------------------------------------------------------*/

describe('Assistive Reconsolidation — Threshold Tier Integration', () => {
  it('covers all three tiers with non-overlapping ranges', () => {
    // auto_merge
    expect(classifyAssistiveSimilarity(1.0)).toBe('auto_merge');
    expect(classifyAssistiveSimilarity(0.96)).toBe('auto_merge');

    // review
    expect(classifyAssistiveSimilarity(0.959)).toBe('review');
    expect(classifyAssistiveSimilarity(0.88)).toBe('review');

    // keep_separate
    expect(classifyAssistiveSimilarity(0.879)).toBe('keep_separate');
    expect(classifyAssistiveSimilarity(0.0)).toBe('keep_separate');
  });

  it('no destructive action below 0.88 threshold', () => {
    // Verify that similarity below ASSISTIVE_REVIEW_THRESHOLD maps to keep_separate
    // (no merge, no recommendation)
    const tier = classifyAssistiveSimilarity(ASSISTIVE_REVIEW_THRESHOLD - 0.001);
    expect(tier).toBe('keep_separate');
  });

  it('auto-merge only fires at >= 0.96', () => {
    // Similarity of 0.9599 must not trigger auto-merge
    const tier = classifyAssistiveSimilarity(ASSISTIVE_AUTO_MERGE_THRESHOLD - 0.001);
    expect(tier).toBe('review');
    // Similarity of 0.96 must trigger auto-merge
    const mergeTier = classifyAssistiveSimilarity(ASSISTIVE_AUTO_MERGE_THRESHOLD);
    expect(mergeTier).toBe('auto_merge');
  });
});
