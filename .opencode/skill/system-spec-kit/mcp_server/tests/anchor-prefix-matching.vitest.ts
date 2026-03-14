// TEST: ANCHOR PREFIX MATCHING
import { describe, it, expect } from 'vitest';
import {
  formatSearchResults,
  type MemoryParserLike,
  type RawSearchResult,
} from '../formatters/search-results';

// TEST: ANCHOR PREFIX MATCHING (SK-005)
// Covers: Prefix matching in filterByAnchors / formatSearchResults
// Context: Session 5 — C1 fix added prefix fallback so 'summary'
// Matches 'summary-session-1770903150838-003' etc.
/**
 * Creates a mock MemoryParserLike that returns pre-defined anchor map.
 * This lets us control exactly what extractAnchors returns without
 * touching the filesystem.
 */
function mockParser(anchorMap: Record<string, string>): MemoryParserLike {
  return {
    extractAnchors(_content: string): Record<string, string> {
      return anchorMap;
    },
  };
}

/**
 * Minimal raw search result — only needs id, spec_folder, file_path.
 * The file won't actually be read because parserOverride is provided
 * (the override short-circuits extractAnchors but we still need the
 * content read to succeed). We build the content inline.
 */
function makeResult(overrides: Partial<RawSearchResult> = {}): RawSearchResult {
  return {
    id: 1,
    spec_folder: 'test-spec',
    file_path: '/dev/null', // Will be overridden by content path
    title: 'Test Memory',
    similarity: 95,
    ...overrides,
  };
}

/**
 * Pure-logic mirror of the prefix-matching algorithm from search-results.ts
 * lines 184-188. Extracted here for direct unit testing without needing
 * the full formatSearchResults pipeline.
 *
 * This is the EXACT algorithm:
 *   1. Exact match in `extracted[anchorId]` → use anchorId as key
 *   2. Else filter keys starting with `anchorId + '-'`, sort by length ascending,
 *      pick first (shortest match)
 *   3. Else undefined
 */
function resolveAnchorKey(
  anchorId: string,
  extracted: Record<string, string>
): string | undefined {
  if (extracted[anchorId] !== undefined) {
    return anchorId;
  }
  return (
    Object.keys(extracted)
      .filter((key) => key.startsWith(anchorId + '-'))
      .sort((a, b) => a.length - b.length)[0] ?? undefined
  );
}

// ===============================================================
// UNIT TESTS — resolveAnchorKey (pure logic)
// ===============================================================

describe('ANCHOR PREFIX MATCHING — resolveAnchorKey unit', () => {
  // ───────────────────────────────────────────────────────────────
  // 1. Exact match priority
  // ───────────────────────────────────────────────────────────────
  describe('Exact match priority', () => {
    it('P01: exact match returns the anchor ID itself', () => {
      const extracted = { summary: 'content A', 'summary-session-123': 'content B' };
      expect(resolveAnchorKey('summary', extracted)).toBe('summary');
    });

    it('P02: exact match even when multiple prefix candidates exist', () => {
      const extracted = {
        state: 'exact',
        'state-session-1': 'prefix-short',
        'state-session-1-extra': 'prefix-long',
      };
      expect(resolveAnchorKey('state', extracted)).toBe('state');
    });

    it('P03: exact match with empty string content still matches', () => {
      const extracted = { decisions: '' };
      expect(resolveAnchorKey('decisions', extracted)).toBe('decisions');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. Prefix fallback
  // ───────────────────────────────────────────────────────────────
  describe('Prefix fallback', () => {
    it('P04: prefix match when no exact key exists', () => {
      const extracted = { 'summary-session-1770903150838-003': 'content' };
      expect(resolveAnchorKey('summary', extracted)).toBe(
        'summary-session-1770903150838-003'
      );
    });

    it('P05: prefix matches on hyphen boundary only', () => {
      // 'sum' should NOT match 'summary-session-123' because
      // The algorithm checks startsWith(anchorId + '-'), i.e. 'sum-'
      // And 'summary-session-123' does NOT start with 'sum-'
      const extracted = { 'summary-session-123': 'content' };
      expect(resolveAnchorKey('sum', extracted)).toBeUndefined();
    });

    it('P06: prefix requires hyphen separator (no partial word match)', () => {
      // 'summar' + '-' = 'summar-' — 'summary-x' does NOT start with 'summar-'
      const extracted = { 'summary-session-123': 'content' };
      expect(resolveAnchorKey('summar', extracted)).toBeUndefined();
    });

    it('P07: prefix match with real-world composite ID', () => {
      const extracted = {
        'next-steps-session-1770903150838-02--system-spec-kit-111': 'do stuff',
      };
      expect(resolveAnchorKey('next-steps', extracted)).toBe(
        'next-steps-session-1770903150838-02--system-spec-kit-111'
      );
    });

    it('P08: prefix match with decisions anchor', () => {
      const extracted = {
        'decisions-session-1770903150838-003': 'decided X over Y',
      };
      expect(resolveAnchorKey('decisions', extracted)).toBe(
        'decisions-session-1770903150838-003'
      );
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. Shortest match selection
  // ───────────────────────────────────────────────────────────────
  describe('Shortest match selection', () => {
    it('P09: picks shortest key among multiple prefix matches', () => {
      const extracted = {
        'summary-session-1770903150838-02--system-spec-kit-111': 'long',
        'summary-session-1770903150838-003': 'short',
        'summary-session-1770903150838-003-extra-suffix': 'medium',
      };
      expect(resolveAnchorKey('summary', extracted)).toBe(
        'summary-session-1770903150838-003'
      );
    });

    it('P10: shortest match with only two candidates', () => {
      const extracted = {
        'state-v2': 'short',
        'state-v2-extended': 'long',
      };
      expect(resolveAnchorKey('state', extracted)).toBe('state-v2');
    });

    it('P11: single prefix candidate is selected (no ambiguity)', () => {
      const extracted = { 'metadata-session-abc': 'only one' };
      expect(resolveAnchorKey('metadata', extracted)).toBe('metadata-session-abc');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. No match
  // ───────────────────────────────────────────────────────────────
  describe('No match', () => {
    it('P12: returns undefined when no exact or prefix match', () => {
      const extracted = { 'summary-session-123': 'content' };
      expect(resolveAnchorKey('decisions', extracted)).toBeUndefined();
    });

    it('P13: returns undefined with empty extracted map', () => {
      expect(resolveAnchorKey('summary', {})).toBeUndefined();
    });

    it('P14: returns undefined when key is substring but not prefix+hyphen', () => {
      // 'next' should not match 'next-steps-session-123' because
      // 'next-steps-session-123'.startsWith('next-') is TRUE — so this DOES match!
      // But 'nextsteps' should not match.
      const extracted = { 'nextsteps-session-123': 'content' };
      expect(resolveAnchorKey('next', extracted)).toBeUndefined();
    });

    it('P15: anchor that is a suffix of a key does not match', () => {
      const extracted = { 'pre-summary': 'content' };
      expect(resolveAnchorKey('summary', extracted)).toBeUndefined();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. Edge cases
  // ───────────────────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('P16: empty anchor ID matches nothing (no key starts with just "-")', () => {
      const extracted = { 'summary-session-123': 'content', summary: 'exact' };
      // Empty string exact match — extracted[''] is undefined
      // Prefix: keys starting with '' + '-' = '-' — none start with '-'
      expect(resolveAnchorKey('', { 'summary-session-123': 'content' })).toBeUndefined();
    });

    it('P17: anchor with trailing hyphen does not double-hyphen', () => {
      // AnchorId = 'next-steps-' → filter checks startsWith('next-steps--')
      // 'next-steps-session-123' does NOT start with 'next-steps--'
      const extracted = { 'next-steps-session-123': 'content' };
      expect(resolveAnchorKey('next-steps-', extracted)).toBeUndefined();
    });

    it('P18: case sensitivity — anchor IDs are case-sensitive', () => {
      const extracted = { 'Summary-session-123': 'content' };
      // 'summary' !== 'Summary-session-123' (exact fail)
      // 'Summary-session-123'.startsWith('summary-') is false
      expect(resolveAnchorKey('summary', extracted)).toBeUndefined();
    });

    it('P19: anchor matches key of same name with hyphen suffix', () => {
      // Edge: 'next-steps' should match 'next-steps-session-123'
      // Because 'next-steps-session-123'.startsWith('next-steps-') = true
      // But 'next' should also match 'next-steps-session-123'
      // Because 'next-steps-session-123'.startsWith('next-') = true
      const extracted = { 'next-steps-session-123': 'content' };
      expect(resolveAnchorKey('next', extracted)).toBe('next-steps-session-123');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. Multiple anchors requested
  // ───────────────────────────────────────────────────────────────
  describe('Multiple anchors — mixed exact and prefix', () => {
    it('P20: resolves a batch of mixed anchors correctly', () => {
      const extracted = {
        summary: 'exact summary',
        'state-session-123': 'prefix state',
        'decisions-session-456': 'prefix decisions',
        'next-steps': 'exact next-steps',
      };

      const anchors = ['summary', 'state', 'decisions', 'next-steps', 'missing'];
      const results = anchors.map((a) => ({
        anchor: a,
        key: resolveAnchorKey(a, extracted),
      }));

      expect(results).toEqual([
        { anchor: 'summary', key: 'summary' },
        { anchor: 'state', key: 'state-session-123' },
        { anchor: 'decisions', key: 'decisions-session-456' },
        { anchor: 'next-steps', key: 'next-steps' },
        { anchor: 'missing', key: undefined },
      ]);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. Real-world composite IDs
  // ───────────────────────────────────────────────────────────────
  describe('Real-world composite IDs', () => {
    it('P21: all 12 anchor types resolve from composite IDs', () => {
      const sessionSuffix = '-session-1770903150838-02--system-spec-kit-111';
      const anchorTypes = [
        'summary',
        'state',
        'decisions',
        'next-steps',
        'session-history',
        'detailed-changes',
        'continue-session',
        'task-guide',
        'metadata',
        'recovery-hints',
        'preflight',
        'postflight',
      ];

      const extracted: Record<string, string> = {};
      for (const anchor of anchorTypes) {
        extracted[anchor + sessionSuffix] = `content for ${anchor}`;
      }

      for (const anchor of anchorTypes) {
        const key = resolveAnchorKey(anchor, extracted);
        expect(key).toBe(anchor + sessionSuffix);
      }
    });

    it('P22: mixed simple and composite IDs (post-migration scenario)', () => {
      // After template simplification some files have simple IDs, some have old composite
      const extracted = {
        summary: 'simple summary', // new style
        'state-session-1770903150838-003': 'old state', // old style
        decisions: 'simple decisions', // new style
      };

      expect(resolveAnchorKey('summary', extracted)).toBe('summary'); // exact
      expect(resolveAnchorKey('state', extracted)).toBe(
        'state-session-1770903150838-003'
      ); // prefix
      expect(resolveAnchorKey('decisions', extracted)).toBe('decisions'); // exact
    });
  });
});

// ===============================================================
// INTEGRATION TESTS — formatSearchResults with mock parser
// ===============================================================

describe('ANCHOR PREFIX MATCHING — formatSearchResults integration', () => {
  /**
   * Helper: call formatSearchResults with a mock parser and anchor filter,
   * return the first result's content and tokenMetrics.
   */
  async function formatWithAnchors(
    anchorMap: Record<string, string>,
    requestedAnchors: string[]
  ) {
    // We need a real file for fs.readFile — create a temp content string.
    // The trick: parserOverride.extractAnchors will return our anchorMap,
    // But formatSearchResults still reads the file via fs.readFile. We use
    // A file that exists and contains something.
    //
    // We'll use the vitest config file itself as a stand-in (it exists and is readable).
    const result = makeResult({
      file_path: __filename, // this test file exists on disk
    });

    const parser = mockParser(anchorMap);
    const response = await formatSearchResults(
      [result],
      'test-search',
      true, // include_content
      requestedAnchors,
      parser
    );

    // Extract from MCPResponse envelope
    const data = response.content[0]?.text
      ? JSON.parse(response.content[0].text)
      : null;
    const firstResult = data?.data?.results?.[0];
    return firstResult;
  }

  it('I01: exact anchor match returns wrapped content', async () => {
    const res = await formatWithAnchors(
      { summary: 'Session overview text' },
      ['summary']
    );

    expect(res.content).toContain('<!-- ANCHOR:summary -->');
    expect(res.content).toContain('Session overview text');
    expect(res.content).toContain('<!-- /ANCHOR:summary -->');
    expect(res.tokenMetrics.anchorsFound).toBe(1);
    expect(res.tokenMetrics.anchorsRequested).toBe(1);
  });

  it('I02: prefix anchor match returns content with composite key', async () => {
    const res = await formatWithAnchors(
      { 'summary-session-1770903150838-003': 'Prefix content here' },
      ['summary']
    );

    expect(res.content).toContain('<!-- ANCHOR:summary-session-1770903150838-003 -->');
    expect(res.content).toContain('Prefix content here');
    expect(res.tokenMetrics.anchorsFound).toBe(1);
  });

  it('I03: no matching anchor returns WARNING comment', async () => {
    const res = await formatWithAnchors(
      { 'unrelated-anchor': 'irrelevant' },
      ['summary']
    );

    expect(res.content).toContain('WARNING: Requested anchors not found: summary');
    expect(res.tokenMetrics.anchorsFound).toBe(0);
    expect(res.tokenMetrics.savingsPercent).toBe(100);
  });

  it('I04: mix of found and missing anchors includes warning', async () => {
    const res = await formatWithAnchors(
      {
        summary: 'Found content',
        'state-session-123': 'State content',
      },
      ['summary', 'state', 'nonexistent']
    );

    expect(res.content).toContain('<!-- ANCHOR:summary -->');
    expect(res.content).toContain('<!-- ANCHOR:state-session-123 -->');
    expect(res.content).toContain('WARNING: Requested anchors not found: nonexistent');
    expect(res.tokenMetrics.anchorsFound).toBe(2);
    expect(res.tokenMetrics.anchorsRequested).toBe(3);
  });

  it('I05: token metrics show savings when filtering to subset', async () => {
    const res = await formatWithAnchors(
      {
        summary: 'Short',
        'long-anchor': 'A'.repeat(5000),
      },
      ['summary']
    );

    expect(res.tokenMetrics.anchorsFound).toBe(1);
    expect(res.tokenMetrics.savingsPercent).toBeGreaterThan(0);
    expect(res.tokenMetrics.returnedTokens).toBeLessThan(res.tokenMetrics.originalTokens);
  });

  it('I06: empty anchors array returns full content (no filtering)', async () => {
    const result = makeResult({ file_path: __filename });
    const parser = mockParser({ summary: 'test' });

    const response = await formatSearchResults(
      [result],
      'test',
      true,
      [], // empty anchors
      parser
    );

    const data = JSON.parse(response.content[0].text);
    const firstResult = data.data.results[0];

    // With empty anchors array, the anchor filtering branch is NOT entered
    // (anchors.length > 0 is false), so full file content is returned
    expect(firstResult.tokenMetrics).toBeUndefined();
    expect(firstResult.content).toBeTruthy();
  });
});
