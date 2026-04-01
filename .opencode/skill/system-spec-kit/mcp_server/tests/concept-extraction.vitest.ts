// TEST: Phase B T022 — Concept Extraction
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getConceptExpansionTerms,
  nounPhrases,
  routeQueryConcepts,
} from '../lib/search/entity-linker';

describe('concept extraction helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('nounPhrases()', () => {
    it('extracts meaningful words from "Semantic Search"', () => {
      expect(nounPhrases('Semantic Search')).toEqual(['semantic', 'search']);
    });

    it('handles empty string', () => {
      expect(nounPhrases('')).toEqual([]);
    });
  });

  describe('routeQueryConcepts()', () => {
    it('with no db returns empty concepts (graphActivated: false)', () => {
      expect(routeQueryConcepts('completely unrelated zebra unicorn')).toEqual({
        concepts: [],
        graphActivated: false,
      });
    });
  });

  describe('getConceptExpansionTerms()', () => {
    it('returns expansion terms excluding original tokens', () => {
      const expansionTerms = getConceptExpansionTerms(
        ['search'],
        ['semantic', 'search'],
      );

      expect(expansionTerms).toEqual(expect.arrayContaining(['retrieval', 'query', 'lookup']));
      expect(expansionTerms).not.toContain('semantic');
      expect(expansionTerms).not.toContain('search');
    });

    it('respects maxTerms limit', () => {
      const expansionTerms = getConceptExpansionTerms(['search', 'embedding'], [], 2);

      expect(expansionTerms).toHaveLength(2);
    });
  });
});
