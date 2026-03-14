// TEST: Query Expander (C138-P3)
// Rule-based synonym expansion for mode="deep" multi-query RAG.
// Verifies expansion logic, max variants, synonym maps, edge cases.
import { describe, it, expect } from 'vitest';
import { expandQuery, DOMAIN_VOCABULARY_MAP } from '../lib/search/query-expander';

const MAX_VARIANTS = 3;

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('C138-P3 Query Expander', () => {

  // ---- T1: Original query always first ----
  it('T1: original query is always the first variant', () => {
    const result = expandQuery('fix login error');
    expect(result[0]).toBe('fix login error');
  });

  // ---- T2: Known terms are expanded ----
  it('T2: known domain terms produce synonym variants', () => {
    const result = expandQuery('fix login error');
    expect(result.length).toBeGreaterThan(1);

    // Should contain at least one variant with synonym substitution
    const hasVariant = result.some(v => v !== 'fix login error');
    expect(hasVariant).toBe(true);
  });

  // ---- T3: Max 3 variants ----
  it('T3: never returns more than MAX_VARIANTS', () => {
    // Query with many expandable terms
    const result = expandQuery('fix login error bug crash');
    expect(result.length).toBeLessThanOrEqual(MAX_VARIANTS);
  });

  // ---- T4: Unknown terms return only original ----
  it('T4: query with no known terms returns only original', () => {
    const result = expandQuery('xyzzy foobar quux');
    expect(result).toEqual(['xyzzy foobar quux']);
  });

  // ---- T5: Empty query returns empty ----
  it('T5: empty string returns array with empty string', () => {
    const result = expandQuery('');
    expect(result).toEqual(['']);
  });

  // ---- T6: Single known word expands ----
  it('T6: single known word produces variant', () => {
    const result = expandQuery('login');
    expect(result.length).toBe(2); // original + one synonym
    expect(result).toContain('login');
    expect(result.some(v => v.includes('authentication'))).toBe(true);
  });

  // ---- T7: Case insensitive matching ----
  it('T7: synonym matching is case-insensitive', () => {
    const result = expandQuery('Fix Login Error');
    expect(result.length).toBeGreaterThan(1);
  });

  // ---- T8: No duplicates ----
  it('T8: variants are unique (no duplicates)', () => {
    const result = expandQuery('fix the error');
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  // ---- T9: Compound expansion ----
  it('T9: multiple terms each get expanded in separate variants', () => {
    const result = expandQuery('fix error');
    // 'fix' → 'patch', 'error' → 'exception'
    // Should have original + up to 2 variants
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  // ---- T10: Vocabulary map is populated ----
  it('T10: domain vocabulary map has expected entries', () => {
    expect(DOMAIN_VOCABULARY_MAP.login).toBeDefined();
    expect(DOMAIN_VOCABULARY_MAP.error).toBeDefined();
    expect(DOMAIN_VOCABULARY_MAP.api).toBeDefined();
    expect(DOMAIN_VOCABULARY_MAP.refactor).toBeDefined();

    // Each entry has at least 1 synonym
    for (const [key, synonyms] of Object.entries(DOMAIN_VOCABULARY_MAP)) {
      expect(synonyms.length, `${key} has no synonyms`).toBeGreaterThan(0);
    }
  });

  // ---- T11: Special characters in query ----
  it('T11: handles special characters without crashing', () => {
    const result = expandQuery('fix login (auth) [error]');
    expect(result[0]).toBe('fix login (auth) [error]');
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
