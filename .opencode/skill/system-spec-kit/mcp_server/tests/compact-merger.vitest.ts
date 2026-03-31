// ───────────────────────────────────────────────────────────────
// TEST: Compact Merger
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import { mergeCompactBrief, type MergeInput } from '../lib/code-graph/compact-merger.js';

describe('compact merger', () => {
  const createInput = (overrides: Partial<MergeInput> = {}): MergeInput => ({
    constitutional: 'Rule 1: Always read files first.',
    codeGraph: 'function parseFile in structural-indexer.ts:150',
    cocoIndex: 'Similar: memory-surface.ts autoSurfaceAtCompaction',
    triggered: 'Trigger: compaction recovery context',
    sessionState: 'Working on phase 001 PreCompact hook',
    ...overrides,
  });

  describe('mergeCompactBrief', () => {
    it('includes all non-empty sections', () => {
      const result = mergeCompactBrief(createInput());
      expect(result.sections.length).toBe(5);
      expect(result.text).toContain('Constitutional Rules');
      expect(result.text).toContain('Active Files');
      expect(result.text).toContain('Semantic Neighbors');
      expect(result.text).toContain('Session State');
      expect(result.text).toContain('Triggered Memories');
    });

    it('respects total token budget', () => {
      const result = mergeCompactBrief(createInput(), 4000);
      expect(result.metadata.totalTokenEstimate).toBeLessThanOrEqual(4000);
    });

    it('omits empty sections', () => {
      const result = mergeCompactBrief(createInput({ cocoIndex: '', triggered: '' }));
      expect(result.sections.length).toBe(3);
      expect(result.text).not.toContain('Semantic Neighbors');
      expect(result.text).not.toContain('Triggered Memories');
    });

    it('includes allocation metadata', () => {
      const result = mergeCompactBrief(createInput());
      expect(result.allocation).toBeDefined();
      expect(result.allocation.totalBudget).toBe(4000);
      expect(result.allocation.allocations.length).toBe(5);
    });

    it('includes merge timestamp', () => {
      const result = mergeCompactBrief(createInput());
      expect(result.metadata.mergedAt).toBeDefined();
      expect(new Date(result.metadata.mergedAt).getTime()).toBeGreaterThan(0);
    });

    it('keeps sessionState inside the caller budget', () => {
      const result = mergeCompactBrief(createInput({
        constitutional: '',
        codeGraph: '',
        cocoIndex: '',
        triggered: '',
        sessionState: 'S'.repeat(4000),
      }), 1);

      expect(result.metadata.totalTokenEstimate).toBeLessThanOrEqual(1);
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0]?.name).toBe('Session State / Next Steps');
    });

    it('skips zero-budget sections instead of rendering headers only', () => {
      const result = mergeCompactBrief(createInput({
        constitutional: '',
        codeGraph: 'A'.repeat(100),
        cocoIndex: 'B'.repeat(100),
        triggered: '',
        sessionState: '',
      }), 1);

      expect(result.metadata.totalTokenEstimate).toBeLessThanOrEqual(1);
      expect(result.text).toContain('Active Files & Structural Context');
      expect(result.text).not.toContain('Semantic Neighbors');
      expect(result.sections.every(section => section.tokenEstimate > 0)).toBe(true);
    });
  });
});
