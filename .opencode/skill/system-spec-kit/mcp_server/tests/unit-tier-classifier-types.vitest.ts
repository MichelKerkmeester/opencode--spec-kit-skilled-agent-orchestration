// TEST: TIER CLASSIFIER — TYPE UNIFICATION (TierInput)
// Validates cast-removal: deprecated MemoryRow → TierInput accepts
// Partial objects, mixed casing, and extra arbitrary fields.
import { describe, it, expect } from 'vitest';
import * as tierClassifier from '../lib/cognitive/tier-classifier';

/* ───────────────────────────────────────────────────────────────
   1. classifyTier with TierInput partial objects
──────────────────────────────────────────────────────────────── */

describe('Tier Classifier — Type Unification (TierInput)', () => {

  describe('classifyTier() with partial TierInput objects', () => {

    // T-TC-01: Minimal object {id: 1, importance_tier: 'normal'}
    it('T-TC-01: accepts minimal {id, importance_tier}', () => {
      const r = tierClassifier.classifyTier({ id: 1, importance_tier: 'normal' });
      expect(r).toBeTruthy();
      expect(typeof r.state).toBe('string');
      expect(typeof r.retrievability).toBe('number');
    });

    // T-TC-02: Constitutional tier with just {id, importance_tier}
    it('T-TC-02: Constitutional always HOT', () => {
      const r = tierClassifier.classifyTier({ id: 2, importance_tier: 'constitutional' });
      expect(r.state).toBe('HOT');
      expect(r.retrievability).toBe(1.0);
    });

    // T-TC-03: Critical tier with minimal input
    it('T-TC-03: Critical always HOT, null halfLife', () => {
      const r = tierClassifier.classifyTier({ id: 3, importance_tier: 'critical' });
      expect(r.state).toBe('HOT');
      expect(r.effectiveHalfLife).toBeNull();
    });

    // T-TC-04: Each importance_tier value with minimal object
    it.each([
      'constitutional',
      'critical',
      'important',
      'normal',
      'temporary',
      'deprecated',
    ])('T-TC-04-%s: classifyTier accepts tier="%s"', (tier) => {
      const r = tierClassifier.classifyTier({ id: 10, importance_tier: tier });
      const validStates = ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'];
      expect(r).toBeTruthy();
      expect(validStates).toContain(r.state);
    });

    // T-TC-05: Object with only {id} (no importance_tier)
    it('T-TC-05: Object with only {id} — defaults applied', () => {
      const r = tierClassifier.classifyTier({ id: 50 });
      expect(r).toBeTruthy();
      expect(typeof r.state).toBe('string');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     2. classifyTier with extra arbitrary fields
  ──────────────────────────────────────────────────────────────── */

  describe('classifyTier() with extra arbitrary fields (Record<string, unknown>)', () => {

    // T-TC-06: Extra fields should be ignored, not cause errors
    it('T-TC-06: Extra arbitrary fields accepted', () => {
      const r = tierClassifier.classifyTier({
        id: 100,
        importance_tier: 'normal',
        stability: 5.0,
        customField: 'should-be-ignored',
        _internal: { nested: true },
        similarity: 0.85,
        attentionScore: 0.9,
        memoryState: 'HOT',
      });
      expect(r).toBeTruthy();
      expect(typeof r.state).toBe('string');
    });

    // T-TC-07: Search-enriched object (typical handler output)
    it('T-TC-07: Search-enriched object accepted', () => {
      const searchResult = {
        id: 200,
        importance_tier: 'important',
        stability: 3.0,
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        // Search-enriched fields
        similarity: 0.92,
        attentionScore: 0.75,
        memoryState: 'WARM',
        retrievability: 0.6,
        content: 'Some memory content...',
        contextType: 'decision',
      };

      const r = tierClassifier.classifyTier(searchResult);
      expect(r).toBeTruthy();
      expect(typeof r.state).toBe('string');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     3. filterAndLimitByState with mixed-shape TierInput[]
  ──────────────────────────────────────────────────────────────── */

  describe('filterAndLimitByState() with mixed-shape objects', () => {

    // T-TC-08: Mix of MemoryDbRow-shaped (snake_case) and camelCase objects
    it('T-TC-08: Mixed-shape objects processed', () => {
      const memories = [
        // Snake_case (DB row style)
        { id: 1, importance_tier: 'constitutional', stability: 1.0, spec_folder: 'specs/001' },
        // CamelCase (Memory style)
        { id: 2, importanceTier: 'critical', stability: 1.0, specFolder: 'specs/002' },
        // Minimal
        { id: 3 },
        // Extra fields
        { id: 4, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString(), similarity: 0.9 },
      ];

      const filtered = tierClassifier.filterAndLimitByState(memories);
      expect(Array.isArray(filtered)).toBe(true);
    });

    // T-TC-09: Filter to HOT state with mixed shapes
    it('T-TC-09: HOT filter finds constitutional', () => {
      const memories = [
        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
        { id: 2, importance_tier: 'normal', stability: 0.01, created_at: new Date(Date.now() - 365 * 86400000).toISOString(), half_life_days: 0.001 },
      ];

      const filtered = tierClassifier.filterAndLimitByState(memories, 'HOT');
      // Constitutional should always be HOT
      const hasConstitutional = filtered.some((m) => m.id === 1);
      expect(hasConstitutional).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     4. getStateStats with TierInput[]
  ──────────────────────────────────────────────────────────────── */

  describe('getStateStats() with TierInput objects', () => {

    // T-TC-10: Stats work with partial objects
    it('T-TC-10: Stats count partial objects', () => {
      const memories = [
        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
        { id: 2, importance_tier: 'critical', stability: 1.0 },
        { id: 3 },  // Minimal — should still be counted
      ];

      const stats = tierClassifier.getStateStats(memories);
      expect(stats.total).toBe(3);
    });

    // T-TC-11: Stats with search-enriched objects
    it('T-TC-11: Stats with enriched objects', () => {
      const memories = [
        { id: 1, importance_tier: 'constitutional', similarity: 0.95, attentionScore: 1.0 },
        { id: 2, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString(), content: 'text' },
      ];

      const stats = tierClassifier.getStateStats(memories);
      expect(stats.total).toBe(2);
      expect('HOT' in stats).toBe(true);
      expect('WARM' in stats).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     5. formatStateResponse with TierInput[]
  ──────────────────────────────────────────────────────────────── */

  describe('formatStateResponse() with TierInput objects', () => {

    // T-TC-12: Mixed snake_case and camelCase field names
    it('T-TC-12: formatStateResponse with mixed shapes', () => {
      const memories = [
        { id: 1, title: 'Test One', spec_folder: 'specs/001', file_path: '/a.md', importance_tier: 'constitutional', stability: 1.0 },
        { id: 2, title: 'Test Two', specFolder: 'specs/002', filePath: '/b.md', importanceTier: 'normal', stability: 100, created_at: new Date().toISOString() },
      ];

      const formatted = tierClassifier.formatStateResponse(memories);
      expect(Array.isArray(formatted)).toBe(true);
      expect(formatted).toHaveLength(2);

      // Both should have all required fields
      const allValid = formatted.every((e) =>
        'id' in e && 'title' in e && 'state' in e && 'retrievability' in e
      );
      expect(allValid).toBe(true);
    });

    // T-TC-13: Object without title gets "Untitled"
    it('T-TC-13: Missing title defaults to "Untitled"', () => {
      const formatted = tierClassifier.formatStateResponse([
        { id: 99, importance_tier: 'constitutional', stability: 1.0, extraField: 'hello' },
      ]);
      expect(formatted[0].title).toBe('Untitled');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     6. shouldArchive with TierInput
  ──────────────────────────────────────────────────────────────── */

  describe('shouldArchive() with TierInput objects', () => {

    // T-TC-14: Partial object with extra fields
    it('T-TC-14: shouldArchive with extra fields', () => {
      const result = tierClassifier.shouldArchive({
        id: 1,
        importance_tier: 'normal',
        stability: 0.01,
        half_life_days: 0.001,
        created_at: new Date(Date.now() - 200 * 86400000).toISOString(),
        customField: 'extra',
      });
      expect(typeof result).toBe('boolean');
    });

    // T-TC-15: Constitutional with extra fields still never archives
    it('T-TC-15: Constitutional never archives (with extras)', () => {
      const result = tierClassifier.shouldArchive({
        id: 2,
        importance_tier: 'constitutional',
        stability: 0.01,
        created_at: new Date(Date.now() - 365 * 86400000).toISOString(),
        similarity: 0.1,
        randomProp: 42,
      });
      expect(result).toBe(false);
    });
  });
});
