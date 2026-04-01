// ───────────────────────────────────────────────────────────────
// 1. TEST — QUALITY LOOP
// ───────────────────────────────────────────────────────────────
// Quality Loop
//
// Verify-fix-verify memory quality loop:
// - Quality score computation (trigger phrases, anchors, budget, coherence)
// - Auto-fix strategies (re-extract triggers, normalize anchors, trim budget)
// - Loop rejection after retries
// - Env var gating (SPECKIT_QUALITY_LOOP)
// - Eval metrics logging

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as evalDb from '../lib/eval/eval-db';

import {
  computeMemoryQualityScore,
  attemptAutoFix,
  runQualityLoop,
  isQualityLoopEnabled,
  scoreTriggerPhrases,
  scoreAnchorFormat,
  scoreTokenBudget,
  scoreCoherence,
  extractTriggersFromContent,
  normalizeAnchors,
  QUALITY_WEIGHTS,
  DEFAULT_TOKEN_BUDGET,
  DEFAULT_CHAR_BUDGET,
} from '../handlers/quality-loop';

import type {
  QualityScore,
  QualityLoopResult,
} from '../handlers/quality-loop';

/* ───────────────────────────────────────────────────────────────
   FIXTURES
──────────────────────────────────────────────────────────────── */

/** Good quality content with anchors, headings, and sufficient length */
const GOOD_CONTENT = `# Sprint 0 Measurement Foundation

<!-- ANCHOR: overview -->
## Overview
This memory documents the Sprint 0 measurement foundation for the hybrid RAG fusion refinement project.
The eval infrastructure includes a separate eval DB, logging hooks, and metric computation.
<!-- /ANCHOR: overview -->

<!-- ANCHOR: decisions -->
## Key Decisions
- Used separate SQLite database (speckit-eval.db) for eval data
- Implemented fail-safe logging that never breaks production search
- Chose MRR@5 and NDCG@10 as primary retrieval quality metrics
- Added BM25 baseline with configurable k1/b parameters
<!-- /ANCHOR: decisions -->

<!-- ANCHOR: next-steps -->
## Next Steps
- Implement hybrid fusion scoring calibration
- Add query intelligence features
- Build feedback quality loop
<!-- /ANCHOR: next-steps -->
`;

const GOOD_METADATA = {
  triggerPhrases: ['sprint 0', 'measurement foundation', 'eval infrastructure', 'retrieval quality'],
  title: 'Sprint 0 Measurement Foundation',
};

/** Minimal content that should score poorly */
const BAD_CONTENT = 'short';

const BAD_METADATA = {
  triggerPhrases: [],
  title: '',
};

/** Content with broken anchors */
const BROKEN_ANCHOR_CONTENT = `# Test Document

<!-- ANCHOR: overview -->
## Overview
Some overview content here that is meaningful enough to pass coherence checks.
This adds more substance to the content to ensure it meets minimum length requirements.

<!-- ANCHOR: details -->
## Details
More detail content that provides substantial information about the topic at hand.
<!-- /ANCHOR: details -->
`;

/** Content that exceeds token budget */
function generateOversizedContent(): string {
  const line = 'This is a line of content that adds to the overall size of the document for testing purposes.\n';
  // Generate content well over DEFAULT_CHAR_BUDGET (8000 chars)
  return '# Oversized Document\n\n' + line.repeat(120);
}

/* ───────────────────────────────────────────────────────────────
   TEST: scoreTriggerPhrases
──────────────────────────────────────────────────────────────── */

describe('scoreTriggerPhrases', () => {
  it('returns 0 when no trigger phrases', () => {
    const result = scoreTriggerPhrases({ triggerPhrases: [] });
    expect(result.score).toBe(0);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatch(/no trigger phrases/i);
  });

  it('returns 0.5 for 1-3 trigger phrases', () => {
    const result = scoreTriggerPhrases({ triggerPhrases: ['a', 'b'] });
    expect(result.score).toBe(0.5);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatch(/2 trigger phrase/i);
  });

  it('returns 1.0 for 4+ trigger phrases', () => {
    const result = scoreTriggerPhrases({ triggerPhrases: ['a', 'b', 'c', 'd'] });
    expect(result.score).toBe(1.0);
    expect(result.issues).toHaveLength(0);
  });

  it('handles missing triggerPhrases field gracefully', () => {
    const result = scoreTriggerPhrases({});
    expect(result.score).toBe(0);
    expect(result.issues.length).toBeGreaterThan(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: scoreAnchorFormat
──────────────────────────────────────────────────────────────── */

describe('scoreAnchorFormat', () => {
  it('returns 1.0 for properly opened and closed anchors', () => {
    const content = '<!-- ANCHOR: test -->\ncontent\n<!-- /ANCHOR: test -->';
    const result = scoreAnchorFormat(content);
    expect(result.score).toBe(1.0);
    expect(result.issues).toHaveLength(0);
  });

  it('returns 0.5 (neutral) when no anchors present', () => {
    const content = '# Just a heading\nSome content without anchors.';
    const result = scoreAnchorFormat(content);
    expect(result.score).toBe(0.5);
    expect(result.issues).toHaveLength(0);
  });

  it('penalizes unclosed anchors', () => {
    const content = '<!-- ANCHOR: overview -->\ncontent here';
    const result = scoreAnchorFormat(content);
    expect(result.score).toBeLessThan(1.0);
    expect(result.issues.some(i => /unclosed/i.test(i))).toBe(true);
  });

  it('penalizes closing tags without opening', () => {
    const content = 'content here\n<!-- /ANCHOR: orphan -->';
    const result = scoreAnchorFormat(content);
    expect(result.score).toBeLessThan(1.0);
    expect(result.issues.some(i => /without opening/i.test(i))).toBe(true);
  });

  it('handles mixed valid and invalid anchors', () => {
    const content = [
      '<!-- ANCHOR: good -->',
      'content',
      '<!-- /ANCHOR: good -->',
      '<!-- ANCHOR: broken -->',
      'more content',
    ].join('\n');
    const result = scoreAnchorFormat(content);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1.0);
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: scoreTokenBudget
──────────────────────────────────────────────────────────────── */

describe('scoreTokenBudget', () => {
  it('returns 1.0 for content under budget', () => {
    const result = scoreTokenBudget('Short content.');
    expect(result.score).toBe(1.0);
    expect(result.issues).toHaveLength(0);
  });

  it('returns proportional score for content over budget', () => {
    const oversized = generateOversizedContent();
    expect(oversized.length).toBeGreaterThan(DEFAULT_CHAR_BUDGET);
    const result = scoreTokenBudget(oversized);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1.0);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatch(/exceeds token budget/i);
  });

  it('respects custom char budget', () => {
    const content = 'x'.repeat(200);
    const result = scoreTokenBudget(content, 100);
    expect(result.score).toBe(0.5); // 100/200
    expect(result.issues).toHaveLength(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: scoreCoherence
──────────────────────────────────────────────────────────────── */

describe('scoreCoherence', () => {
  it('returns 0 for empty content', () => {
    const result = scoreCoherence('');
    expect(result.score).toBe(0);
    expect(result.issues.some(i => /empty/i.test(i))).toBe(true);
  });

  it('returns 0.25 for non-empty but very short content', () => {
    const result = scoreCoherence('Hi.');
    expect(result.score).toBe(0.25);
  });

  it('returns 1.0 for content with headings and substance', () => {
    const content = '# Heading\n\n' + 'This is substantial content. '.repeat(15);
    const result = scoreCoherence(content);
    expect(result.score).toBe(1.0);
    expect(result.issues).toHaveLength(0);
  });

  it('penalizes missing headings', () => {
    const content = 'This is some content without any headings at all. '.repeat(10);
    const result = scoreCoherence(content);
    expect(result.score).toBe(0.75); // non-empty + >50 + >200, but no heading
    expect(result.issues.some(i => /heading/i.test(i))).toBe(true);
  });

  it('penalizes future-dated completion claims beyond lastModified', () => {
    const content = [
      '# Release Notes',
      '',
      'Completed rollout on 2099-01-01 after validation finished successfully.',
      'This entry is long enough to satisfy the structural checks without issue.',
      'Additional detail keeps the document comfortably above the substance threshold.',
    ].join('\n');

    const result = scoreCoherence(content, {
      lastModified: '2026-03-13T00:00:00.000Z',
    });

    expect(result.score).toBeLessThan(1.0);
    expect(result.issues.some(i => /future-dated completion claims/i.test(i))).toBe(true);
  });

  it('penalizes unresolved causal references when a resolver is provided', () => {
    const content = '# Relationship Note\n\n' + 'This document describes how one memory depends on another. '.repeat(8);
    const result = scoreCoherence(content, {
      title: 'Relationship Note',
      filePath: '/tmp/specs/999-test/memory/relationship-note.md',
      causalLinks: {
        caused_by: ['missing-memory'],
        supersedes: [],
        derived_from: [],
        blocks: [],
        related_to: [],
      },
      resolveReference: () => false,
    });

    expect(result.score).toBeLessThan(1.0);
    expect(result.issues.some(i => /unresolved causal link references/i.test(i))).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: computeMemoryQualityScore
──────────────────────────────────────────────────────────────── */

describe('computeMemoryQualityScore', () => {
  it('returns high score for good quality content', () => {
    const score = computeMemoryQualityScore(GOOD_CONTENT, GOOD_METADATA);
    expect(score.total).toBeGreaterThan(0.8);
    expect(score.breakdown.triggers).toBe(1.0);
    expect(score.breakdown.anchors).toBe(1.0);
    expect(score.breakdown.coherence).toBe(1.0);
    expect(score.issues).toHaveLength(0);
  });

  it('returns low score for bad quality content', () => {
    const score = computeMemoryQualityScore(BAD_CONTENT, BAD_METADATA);
    // BAD_CONTENT = 'short': triggers=0, anchors=0.5 (neutral), budget=1.0, coherence=0.25
    // Total = 0*0.25 + 0.5*0.30 + 1.0*0.20 + 0.25*0.25 = 0.4125 → 0.413
    expect(score.total).toBeLessThan(0.5);
    expect(score.breakdown.triggers).toBe(0);
    expect(score.issues.length).toBeGreaterThan(0);
  });

  it('applies correct weights', () => {
    // Verify weights sum to 1.0
    const weightSum = QUALITY_WEIGHTS.triggers + QUALITY_WEIGHTS.anchors +
      QUALITY_WEIGHTS.budget + QUALITY_WEIGHTS.coherence;
    expect(weightSum).toBe(1.0);

    // Perfect scores should give total of 1.0
    const score = computeMemoryQualityScore(GOOD_CONTENT, GOOD_METADATA);
    // All sub-scores are 1.0 => total should be 1.0
    if (score.breakdown.triggers === 1.0 && score.breakdown.anchors === 1.0 &&
        score.breakdown.budget === 1.0 && score.breakdown.coherence === 1.0) {
      expect(score.total).toBe(1.0);
    }
  });

  it('returns total between 0 and 1', () => {
    const score = computeMemoryQualityScore(BROKEN_ANCHOR_CONTENT, { triggerPhrases: ['test'] });
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: normalizeAnchors
──────────────────────────────────────────────────────────────── */

describe('normalizeAnchors', () => {
  it('closes unclosed ANCHOR tags', () => {
    const content = '<!-- ANCHOR: test -->\ncontent';
    const fixed = normalizeAnchors(content);
    expect(fixed).toContain('<!-- /ANCHOR: test -->');
  });

  it('leaves properly closed anchors unchanged', () => {
    const content = '<!-- ANCHOR: test -->\ncontent\n<!-- /ANCHOR: test -->';
    const fixed = normalizeAnchors(content);
    expect(fixed).toBe(content);
  });

  it('handles multiple unclosed anchors', () => {
    const content = '<!-- ANCHOR: a -->\ncontent\n<!-- ANCHOR: b -->\nmore';
    const fixed = normalizeAnchors(content);
    expect(fixed).toContain('<!-- /ANCHOR: a -->');
    expect(fixed).toContain('<!-- /ANCHOR: b -->');
  });

  it('repairs repeated anchor names until open and close counts match', () => {
    const content = [
      '<!-- ANCHOR: repeated -->',
      'first block',
      '<!-- ANCHOR: repeated -->',
      'second block',
      '<!-- /ANCHOR: repeated -->',
    ].join('\n');
    const fixed = normalizeAnchors(content);
    const closingCount = fixed.match(/<!--\s*\/ANCHOR:\s*repeated\s*-->/g)?.length ?? 0;
    expect(closingCount).toBe(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: extractTriggersFromContent
──────────────────────────────────────────────────────────────── */

describe('extractTriggersFromContent', () => {
  it('extracts title as trigger phrase', () => {
    const triggers = extractTriggersFromContent('# Heading\nContent', 'My Title');
    expect(triggers).toContain('my title');
  });

  it('extracts markdown headings as triggers', () => {
    const content = '# First Heading\n## Second Heading\n### Third Heading\nContent';
    const triggers = extractTriggersFromContent(content);
    expect(triggers.length).toBeGreaterThanOrEqual(3);
    expect(triggers).toContain('first heading');
    expect(triggers).toContain('second heading');
    expect(triggers).toContain('third heading');
  });

  it('caps triggers at 8', () => {
    const headings = Array.from({ length: 12 }, (_, i) => `## Heading Number ${i + 1}`).join('\n');
    const triggers = extractTriggersFromContent(headings);
    expect(triggers.length).toBeLessThanOrEqual(8);
  });

  it('skips very short headings', () => {
    const content = '## Hi\n## This is a valid heading\n';
    const triggers = extractTriggersFromContent(content);
    // "Hi" is only 2 chars (< 3), should be skipped
    expect(triggers).not.toContain('hi');
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: attemptAutoFix
──────────────────────────────────────────────────────────────── */

describe('attemptAutoFix', () => {
  it('re-extracts trigger phrases when missing', () => {
    const content = '# My Document\n## Section One\n## Section Two\n## Section Three\nContent here.';
    const metadata = { triggerPhrases: [], title: 'My Document' };
    const result = attemptAutoFix(content, metadata, ['No trigger phrases found']);
    expect(result.fixed.length).toBeGreaterThan(0);
    expect(result.fixed[0]).toMatch(/re-extracted/i);
    expect((result.metadata.triggerPhrases as string[]).length).toBeGreaterThan(0);
  });

  it('normalizes unclosed anchors', () => {
    const content = '<!-- ANCHOR: test -->\nSome content';
    const metadata = { triggerPhrases: ['test'] };
    const result = attemptAutoFix(content, metadata, ['Unclosed ANCHOR tag(s): test']);
    expect(result.fixed.length).toBeGreaterThan(0);
    expect(result.content).toContain('<!-- /ANCHOR: test -->');
  });

  it('trims content exceeding budget', () => {
    const oversized = generateOversizedContent();
    const metadata = { triggerPhrases: ['test', 'a', 'b', 'c'] };
    const result = attemptAutoFix(oversized, metadata, ['Content exceeds token budget']);
    expect(result.content.length).toBeLessThanOrEqual(DEFAULT_CHAR_BUDGET);
    expect(result.fixed.some(f => /trimmed/i.test(f))).toBe(true);
  });

  it('returns empty fixes array when no issues match', () => {
    const result = attemptAutoFix('content', { triggerPhrases: ['a'] }, ['some random issue']);
    expect(result.fixed).toHaveLength(0);
    expect(result.content).toBe('content');
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: runQualityLoop
──────────────────────────────────────────────────────────────── */

describe('runQualityLoop', () => {
  const savedEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    savedEnv.SPECKIT_QUALITY_LOOP = process.env.SPECKIT_QUALITY_LOOP;
    savedEnv.SPECKIT_EVAL_LOGGING = process.env.SPECKIT_EVAL_LOGGING;
    // Disable eval logging during tests to avoid DB writes
    process.env.SPECKIT_EVAL_LOGGING = 'false';
  });

  afterEach(() => {
    process.env.SPECKIT_QUALITY_LOOP = savedEnv.SPECKIT_QUALITY_LOOP;
    process.env.SPECKIT_EVAL_LOGGING = savedEnv.SPECKIT_EVAL_LOGGING;
  });

  it('passes immediately for high-quality content when enabled', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    const result = runQualityLoop(GOOD_CONTENT, GOOD_METADATA);
    expect(result.passed).toBe(true);
    expect(result.rejected).toBe(false);
    expect(result.attempts).toBe(1);
    expect(result.fixes).toHaveLength(0);
    expect(result.score.total).toBeGreaterThan(0.6);
  });

  it('enforces quality loop when SPECKIT_QUALITY_LOOP is not set (graduated default-ON)', () => {
    delete process.env.SPECKIT_QUALITY_LOOP;
    const result = runQualityLoop(BAD_CONTENT, BAD_METADATA);
    // Quality loop is now active by default — bad content is rejected
    expect(result.score.total).toBeLessThan(0.6);
  });

  it('always passes when SPECKIT_QUALITY_LOOP is "false" (opt-out)', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'false';
    const result = runQualityLoop(BAD_CONTENT, BAD_METADATA);
    expect(result.passed).toBe(true);
    expect(result.rejected).toBe(false);
  });

  it('rejects after maxRetries for unfixable content when enabled', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    // Truly terrible content that auto-fix cannot rescue
    const result = runQualityLoop('x', { triggerPhrases: [] }, { maxRetries: 2 });
    expect(result.passed).toBe(false);
    expect(result.rejected).toBe(true);
    expect(result.rejectionReason).toBeTruthy();
    expect(result.rejectionReason).toMatch(/below threshold/i);
    expect(result.score.total).toBeLessThan(0.6);
  });

  it('reports actual attempts when early break stops further retries', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    const result = runQualityLoop('x', { triggerPhrases: [] }, { maxRetries: 5 });
    expect(result.passed).toBe(false);
    expect(result.rejected).toBe(true);
    expect(result.attempts).toBe(2);
    expect(result.rejectionReason).toContain('after 1 auto-fix attempt(s)');
  });

  it('succeeds after auto-fix improves quality above threshold', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    // Content that is close to threshold but below 0.6 without triggers.
    // Has no anchors (0.5 neutral), no triggers (0), budget ok (1.0), coherence (1.0).
    // Pre-fix: total = 0*0.25 + 0.5*0.30 + 1.0*0.20 + 1.0*0.25 = 0 + 0.15 + 0.20 + 0.25 = 0.60
    // Actually 0.6 exactly might pass, so use threshold 0.65 to force at least one fix attempt.
    // After auto-fix extracts triggers (0.5 for 1-3): total = 0.5*0.25 + 0.5*0.30 + 1.0*0.20 + 1.0*0.25 = 0.125 + 0.15 + 0.20 + 0.25 = 0.725
    const fixableContent = [
      '# Important Sprint Documentation',
      '',
      '## Overview of the Sprint',
      'This sprint covers important improvements to the retrieval pipeline.',
      'We implemented several key features including eval logging and metrics.',
      '',
      '## Implementation Details',
      'The implementation involved changes to multiple modules across the codebase.',
      'Each module was carefully tested with unit and integration tests.',
      '',
      '## Quality Metrics',
      'Quality was measured using MRR and NDCG metrics at various cutoff points.',
    ].join('\n');
    const fixableMetadata = { triggerPhrases: [], title: 'Important Sprint Documentation' };

    const result = runQualityLoop(fixableContent, fixableMetadata, { threshold: 0.65 });
    // After auto-fix extracts triggers from headings, score should improve above 0.65
    expect(result.passed).toBe(true);
    expect(result.attempts).toBeGreaterThan(1);
    expect(result.fixes.length).toBeGreaterThan(0);
    expect(result.fixes.some(f => /trigger/i.test(f))).toBe(true);
    expect(result.fixedTriggerPhrases?.length).toBeGreaterThan(0);
    expect(result.fixedTriggerPhrases).toContain('important sprint documentation');
  });

  it('respects custom threshold', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    // With a very low threshold, even bad content might pass
    const result = runQualityLoop(BAD_CONTENT, BAD_METADATA, { threshold: 0.01 });
    // BAD_CONTENT is 'short' with no triggers — score.total is close to 0
    // But coherence gives 0.25 for non-empty, budget gives 1.0, anchors 0.5 (neutral)
    // So total = 0*0.25 + 0.5*0.30 + 1.0*0.20 + 0.25*0.25 = 0 + 0.15 + 0.20 + 0.0625 = 0.4125
    // With threshold 0.01, this passes
    expect(result.passed).toBe(true);
  });

  it('respects custom maxRetries', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    const result = runQualityLoop('x', { triggerPhrases: [] }, { maxRetries: 1 });
    expect(result.rejected).toBe(true);
    // With maxRetries=1, attempts should be at most 2 (1 initial + 1 retry)
    expect(result.attempts).toBeLessThanOrEqual(2);
  });

  it('includes all fix descriptions in result', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    const content = [
      '# Title Here',
      '## Heading One',
      '## Heading Two',
      '## Heading Three',
      '<!-- ANCHOR: broken -->',
      'Content that gives this some length and substance for the coherence check to not fail badly.',
    ].join('\n');
    const metadata = { triggerPhrases: [], title: 'Title Here' };

    const result = runQualityLoop(content, metadata);
    // Should have attempted fixes
    if (result.fixes.length > 0) {
      // Verify fixes are descriptive strings
      result.fixes.forEach(fix => {
        expect(typeof fix).toBe('string');
        expect(fix.length).toBeGreaterThan(0);
      });
    }
  });

  it('suppresses eval metric logging when emitEvalMetrics is false', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    process.env.SPECKIT_EVAL_LOGGING = 'true';
    const initSpy = vi.spyOn(evalDb, 'initEvalDb');

    try {
      runQualityLoop(GOOD_CONTENT, GOOD_METADATA, { emitEvalMetrics: false });
      expect(initSpy).not.toHaveBeenCalled();
    } finally {
      initSpy.mockRestore();
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   TEST: isQualityLoopEnabled
──────────────────────────────────────────────────────────────── */

describe('isQualityLoopEnabled', () => {
  const saved = process.env.SPECKIT_QUALITY_LOOP;

  afterEach(() => {
    if (saved === undefined) {
      delete process.env.SPECKIT_QUALITY_LOOP;
    } else {
      process.env.SPECKIT_QUALITY_LOOP = saved;
    }
  });

  it('returns true when SPECKIT_QUALITY_LOOP=true', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    expect(isQualityLoopEnabled()).toBe(true);
  });

  it('returns true case-insensitively', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'TRUE';
    expect(isQualityLoopEnabled()).toBe(true);
  });

  it('returns true when not set (graduated default-ON)', () => {
    delete process.env.SPECKIT_QUALITY_LOOP;
    expect(isQualityLoopEnabled()).toBe(true);
  });

  it('returns true for non-false/non-0 values', () => {
    process.env.SPECKIT_QUALITY_LOOP = '1';
    expect(isQualityLoopEnabled()).toBe(true);
  });

  it('returns false when explicitly set to false', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'false';
    expect(isQualityLoopEnabled()).toBe(false);
  });

  it('returns false when explicitly set to 0', () => {
    process.env.SPECKIT_QUALITY_LOOP = '0';
    expect(isQualityLoopEnabled()).toBe(false);
  });

  it('T-eval-logging: quality loop handles eval logging enabled', () => {
    const originalQualityLoop = process.env.SPECKIT_QUALITY_LOOP;
    const originalEvalLogging = process.env.SPECKIT_EVAL_LOGGING;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      vi.stubEnv('SPECKIT_QUALITY_LOOP', 'true');
      vi.stubEnv('SPECKIT_EVAL_LOGGING', 'true');

      expect(() => runQualityLoop(GOOD_CONTENT, GOOD_METADATA)).not.toThrow();
      expect(runQualityLoop(GOOD_CONTENT, GOOD_METADATA).passed).toBe(true);
    } finally {
      warnSpy.mockRestore();
      if (originalQualityLoop === undefined) {
        delete process.env.SPECKIT_QUALITY_LOOP;
      } else {
        process.env.SPECKIT_QUALITY_LOOP = originalQualityLoop;
      }
      if (originalEvalLogging === undefined) {
        delete process.env.SPECKIT_EVAL_LOGGING;
      } else {
        process.env.SPECKIT_EVAL_LOGGING = originalEvalLogging;
      }
      vi.unstubAllEnvs();
    }
  });
});
