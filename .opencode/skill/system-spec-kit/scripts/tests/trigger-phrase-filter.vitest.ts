// ───────────────────────────────────────────────────────────────
// TEST: filterTriggerPhrases — 3-stage trigger phrase filter pipeline
// Phase 004 CHK-021, CHK-042: Path fragments, short tokens, shingle dedup.
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { filterTriggerPhrases } from '../core/workflow';

/* ───────────────────────────────────────────────────────────────
   STAGE 1: PATH-LIKE PHRASE REMOVAL
──────────────────────────────────────────────────────────────── */

describe('filterTriggerPhrases', () => {

  describe('Stage 1: path-like phrase removal', () => {

    it('removes phrases containing forward slash', () => {
      const result = filterTriggerPhrases(['system/spec-kit', 'memory pipeline']);
      expect(result).toEqual(['memory pipeline']);
    });

    it('removes phrases containing backslash', () => {
      const result = filterTriggerPhrases(['system\\spec-kit', 'memory pipeline']);
      expect(result).toEqual(['memory pipeline']);
    });

    it('removes phrases with leading numeric prefix', () => {
      const result = filterTriggerPhrases(['022 hybrid rag fusion', 'memory pipeline']);
      expect(result).toEqual(['memory pipeline']);
    });

    it('retains phrases without path separators', () => {
      const input = ['memory pipeline', 'quality scorer'];
      const result = filterTriggerPhrases(input);
      expect(result).toEqual(input);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     STAGE 2: SHORT TOKEN REMOVAL
  ──────────────────────────────────────────────────────────────── */

  describe('Stage 2: short token removal', () => {

    it('removes single-character tokens not in allow-list', () => {
      const result = filterTriggerPhrases(['a', 'memory pipeline']);
      expect(result).toEqual(['memory pipeline']);
    });

    it('removes two-character tokens not in allow-list', () => {
      const result = filterTriggerPhrases(['of', 'to', 'memory pipeline']);
      expect(result).toEqual(['memory pipeline']);
    });

    it('retains allow-listed short tokens', () => {
      const allowListed = ['rag', 'bm25', 'mcp', 'adr', 'jwt', 'api', 'cli', 'llm', 'ai'];
      const result = filterTriggerPhrases(allowListed);
      expect(result).toEqual(allowListed);
    });

    it('retains multi-word phrases where at least one word >= 3 chars', () => {
      const input = ['of the memory', 'on ai models'];
      const result = filterTriggerPhrases(input);
      expect(result).toEqual(input);
    });

    it('removes multi-word phrases where all words < 3 chars and none in allow-list', () => {
      const result = filterTriggerPhrases(['of to by']);
      expect(result).toEqual([]);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     STAGE 3: N-GRAM SHINGLE SUBSET REMOVAL
  ──────────────────────────────────────────────────────────────── */

  describe('Stage 3: n-gram shingle subset removal', () => {

    it('removes shorter phrase that is substring of longer retained phrase', () => {
      const result = filterTriggerPhrases(['memory', 'memory pipeline architecture']);
      expect(result).toEqual(['memory pipeline architecture']);
    });

    it('retains both phrases when neither is substring of the other', () => {
      const input = ['memory pipeline', 'quality scorer'];
      const result = filterTriggerPhrases(input);
      expect(result).toEqual(input);
    });

    it('handles case-insensitive substring check', () => {
      const result = filterTriggerPhrases(['Memory', 'memory pipeline']);
      expect(result).toEqual(['memory pipeline']);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     COMBINED PIPELINE
  ──────────────────────────────────────────────────────────────── */

  describe('combined pipeline', () => {

    it('applies all three stages in sequence', () => {
      const input = ['system/spec-kit', 'of', 'rag', 'memory', 'memory pipeline'];
      const result = filterTriggerPhrases(input);
      // Stage 1 removes "system/spec-kit"
      // Stage 2 removes "of"
      // Stage 3 removes "memory" (substring of "memory pipeline")
      // "rag" is allow-listed and not a substring of "memory pipeline"
      expect(result).toEqual(['rag', 'memory pipeline']);
    });

    it('returns empty array for all-filtered input', () => {
      const result = filterTriggerPhrases(['a/b', 'of']);
      expect(result).toEqual([]);
    });

    it('returns empty array for empty input', () => {
      const result = filterTriggerPhrases([]);
      expect(result).toEqual([]);
    });

    it('is idempotent — applying twice produces same output', () => {
      const input = ['system/spec-kit', 'rag', 'memory', 'memory pipeline', 'of'];
      const first = filterTriggerPhrases(input);
      const second = filterTriggerPhrases(first);
      expect(second).toEqual(first);
    });
  });
});
