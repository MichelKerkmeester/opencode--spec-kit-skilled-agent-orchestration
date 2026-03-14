// TEST: Anchor Metadata
//
// Covers: extractAnchorMetadata and enrichResultsWithAnchorMetadata
// From lib/search/anchor-metadata.ts, plus the Stage 2 wiring
// That calls enrichResultsWithAnchorMetadata as signal step 8.
import { describe, it, expect } from 'vitest';
import {
  extractAnchorMetadata,
  enrichResultsWithAnchorMetadata,
  type AnchorMetadata,
} from '../lib/search/anchor-metadata';
import type { PipelineRow } from '../lib/search/pipeline/types';

type EnrichedPipelineRow = PipelineRow & { anchorMetadata?: AnchorMetadata[] };

// ===============================================================
// SECTION 1: extractAnchorMetadata — core parsing
// ===============================================================

describe('extractAnchorMetadata — parsing', () => {
  // ───────────────────────────────────────────────────────────────
  // 1. 1 EMPTY / NULL-ISH INPUT
  // ───────────────────────────────────────────────────────────────
  describe('Empty and null-ish content', () => {
    it('E01: empty string returns empty array', () => {
      expect(extractAnchorMetadata('')).toEqual([]);
    });

    it('E02: null-like value (cast) returns empty array', () => {
      // TypeScript narrows the type, but the guard still protects at runtime
      expect(extractAnchorMetadata(null as unknown as string)).toEqual([]);
    });

    it('E03: undefined-like value (cast) returns empty array', () => {
      expect(extractAnchorMetadata(undefined as unknown as string)).toEqual([]);
    });

    it('E04: whitespace-only content returns empty array', () => {
      expect(extractAnchorMetadata('   \n  \t  ')).toEqual([]);
    });

    it('E05: content with no ANCHOR tags returns empty array', () => {
      const content = `# Memory Title\n\nSome body text without any anchor tags.`;
      expect(extractAnchorMetadata(content)).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. 2 SINGLE ANCHOR
  // ───────────────────────────────────────────────────────────────
  describe('Single anchor extraction', () => {
    it('A01: basic anchor pair is extracted with correct id and line numbers', () => {
      const content = [
        '# File header',               // line 1
        '<!-- ANCHOR:summary -->',      // line 2
        'Some summary content.',        // line 3
        '<!-- /ANCHOR:summary -->',     // line 4
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual<AnchorMetadata>({
        id: 'summary',
        type: 'summary',
        startLine: 2,
        endLine: 4,
      });
    });

    it('A02: structured ID with uppercase prefix extracts correct type', () => {
      const content = [
        '<!-- ANCHOR:DECISION-pipeline-003 -->',  // line 1
        'We decided to use RRF over BM25.',        // line 2
        '<!-- /ANCHOR:DECISION-pipeline-003 -->',  // line 3
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'DECISION-pipeline-003',
        type: 'DECISION',
        startLine: 1,
        endLine: 3,
      });
    });

    it('A03: mixed-case anchor ID without all-uppercase prefix uses full ID as type', () => {
      const content = [
        '<!-- ANCHOR:next-steps -->',   // line 1
        'Next steps content.',          // line 2
        '<!-- /ANCHOR:next-steps -->',  // line 3
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result[0]).toMatchObject({ id: 'next-steps', type: 'next-steps' });
    });

    it('A04: anchor with extra whitespace in tag is still parsed', () => {
      const content = [
        '<!--  ANCHOR:state  -->',      // line 1
        'state content',                // line 2
        '<!--  /ANCHOR:state  -->',     // line 3
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('state');
    });

    it('A05: startLine and endLine are 1-based', () => {
      const content = [
        'line 1',
        'line 2',
        '<!-- ANCHOR:decisions -->',    // line 3
        'content',                      // line 4
        '<!-- /ANCHOR:decisions -->',   // line 5
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result[0].startLine).toBe(3);
      expect(result[0].endLine).toBe(5);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. 3 MULTIPLE ANCHORS
  // ───────────────────────────────────────────────────────────────
  describe('Multiple anchors in one document', () => {
    it('M01: two sequential anchors both extracted', () => {
      const content = [
        '<!-- ANCHOR:summary -->',      // line 1
        'Summary text.',                // line 2
        '<!-- /ANCHOR:summary -->',     // line 3
        '<!-- ANCHOR:decisions -->',    // line 4
        'Decision text.',               // line 5
        '<!-- /ANCHOR:decisions -->',   // line 6
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('summary');
      expect(result[1].id).toBe('decisions');
    });

    it('M02: results are in document order (by startLine ascending)', () => {
      const content = [
        '<!-- ANCHOR:preflight -->',    // line 1
        'preflight content',            // line 2
        '<!-- /ANCHOR:preflight -->',   // line 3
        '',                             // line 4
        '<!-- ANCHOR:state -->',        // line 5
        'state content',                // line 6
        '<!-- /ANCHOR:state -->',       // line 7
        '',                             // line 8
        '<!-- ANCHOR:postflight -->',   // line 9
        'postflight content',           // line 10
        '<!-- /ANCHOR:postflight -->',  // line 11
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('preflight');
      expect(result[1].id).toBe('state');
      expect(result[2].id).toBe('postflight');
      // Verify ordering is by startLine
      expect(result[0].startLine).toBeLessThan(result[1].startLine);
      expect(result[1].startLine).toBeLessThan(result[2].startLine);
    });

    it('M03: structured IDs (uppercase prefix) extract correct types', () => {
      const content = [
        '<!-- ANCHOR:DECISION-use-rrF-001 -->',   // line 1
        'content',                                 // line 2
        '<!-- /ANCHOR:DECISION-use-rrF-001 -->',  // line 3
        '<!-- ANCHOR:ACTION-next-steps-002 -->',  // line 4
        'content',                                 // line 5
        '<!-- /ANCHOR:ACTION-next-steps-002 -->', // line 6
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('DECISION');
      expect(result[1].type).toBe('ACTION');
    });

    it('M04: mixed structured and simple IDs in one document', () => {
      const content = [
        '<!-- ANCHOR:summary -->',                // line 1
        'simple anchor',                           // line 2
        '<!-- /ANCHOR:summary -->',               // line 3
        '<!-- ANCHOR:DECISION-arch-001 -->',      // line 4
        'structured anchor',                       // line 5
        '<!-- /ANCHOR:DECISION-arch-001 -->',     // line 6
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result[0]).toMatchObject({ id: 'summary', type: 'summary' });
      expect(result[1]).toMatchObject({ id: 'DECISION-arch-001', type: 'DECISION' });
    });

    it('M05: five anchors all extracted correctly', () => {
      const ids = ['preflight', 'summary', 'state', 'decisions', 'postflight'];
      const lines: string[] = [];
      for (const id of ids) {
        lines.push(`<!-- ANCHOR:${id} -->`, `content for ${id}`, `<!-- /ANCHOR:${id} -->`);
      }

      const result = extractAnchorMetadata(lines.join('\n'));
      expect(result).toHaveLength(5);
      expect(result.map((r) => r.id)).toEqual(ids);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. 4 MALFORMED / EDGE-CASE CONTENT
  // ───────────────────────────────────────────────────────────────
  describe('Malformed anchor content', () => {
    it('F01: unmatched opening anchor is silently ignored', () => {
      const content = [
        '<!-- ANCHOR:orphan -->',
        'content without closing tag',
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(0);
    });

    it('F02: unmatched closing anchor is silently ignored', () => {
      const content = [
        'content without opening tag',
        '<!-- /ANCHOR:orphan -->',
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(0);
    });

    it('F03: mismatched open/close IDs are handled gracefully', () => {
      const content = [
        '<!-- ANCHOR:foo -->',
        'content',
        '<!-- /ANCHOR:bar -->',  // bar != foo
        '<!-- /ANCHOR:foo -->',
      ].join('\n');

      // Bar close has no matching open, so only foo is resolved
      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('foo');
    });

    it('F04: content with only one anchor and extra prose around it', () => {
      const content = [
        '# Memory File',
        '',
        'This is some intro text.',
        '',
        '<!-- ANCHOR:summary -->',
        '## Summary',
        'The gist of this memory.',
        '<!-- /ANCHOR:summary -->',
        '',
        'Footer text here.',
      ].join('\n');

      const result = extractAnchorMetadata(content);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('summary');
    });
  });
});

// ===============================================================
// SECTION 2: extractAnchorMetadata — type extraction rules
// ===============================================================

describe('extractAnchorMetadata — type extraction', () => {
  function typeOf(id: string): string {
    const content = `<!-- ANCHOR:${id} -->\ncontent\n<!-- /ANCHOR:${id} -->`;
    return extractAnchorMetadata(content)[0]?.type ?? '';
  }

  it('T01: all-uppercase first segment → that segment is the type', () => {
    expect(typeOf('DECISION-pipeline-003')).toBe('DECISION');
  });

  it('T02: mixed-case first segment → full ID is the type', () => {
    expect(typeOf('Decision-pipeline-003')).toBe('Decision-pipeline-003');
  });

  it('T03: lowercase first segment → full ID is the type', () => {
    expect(typeOf('decision-pipeline-003')).toBe('decision-pipeline-003');
  });

  it('T04: no hyphen → full ID is the type', () => {
    expect(typeOf('summary')).toBe('summary');
    expect(typeOf('SUMMARY')).toBe('SUMMARY');
  });

  it('T05: ACTION prefix is extracted correctly', () => {
    expect(typeOf('ACTION-next-steps-001')).toBe('ACTION');
  });

  it('T06: FINDING prefix is extracted correctly', () => {
    expect(typeOf('FINDING-regression-bug-042')).toBe('FINDING');
  });

  it('T07: two-part kebab-case simple ID maps to itself', () => {
    expect(typeOf('next-steps')).toBe('next-steps');
    expect(typeOf('session-history')).toBe('session-history');
  });

  it('T08: first segment with digits is not all-uppercase — full ID returned', () => {
    // "V1" is not /^[A-Z]+$/ (digits present), so full ID
    expect(typeOf('V1-some-anchor')).toBe('V1-some-anchor');
  });
});

// ===============================================================
// SECTION 3: enrichResultsWithAnchorMetadata — pipeline rows
// ===============================================================

describe('enrichResultsWithAnchorMetadata — annotation', () => {
  // ───────────────────────────────────────────────────────────────
  // 5. HELPERS
  // ───────────────────────────────────────────────────────────────
  function makeRow(overrides: Partial<EnrichedPipelineRow> = {}): EnrichedPipelineRow {
    return { id: 1, score: 0.8, ...overrides };
  }

  // ───────────────────────────────────────────────────────────────
  // 6. 1 EMPTY / EDGE-CASE INPUTS
  // ───────────────────────────────────────────────────────────────
  describe('Empty and edge-case inputs', () => {
    it('R01: empty array returns empty array', () => {
      expect(enrichResultsWithAnchorMetadata([])).toEqual([]);
    });

    it('R02: null/undefined cast returns empty array', () => {
      expect(enrichResultsWithAnchorMetadata(null as unknown as PipelineRow[])).toEqual([]);
    });

    it('R03: row without content field is returned unchanged (same reference)', () => {
      const row = makeRow({ content: undefined });
      const result = enrichResultsWithAnchorMetadata([row]);
      expect(result[0]).toBe(row); // same reference — no unnecessary spread
    });

    it('R04: row with empty content string is returned unchanged', () => {
      const row = makeRow({ content: '' });
      const result = enrichResultsWithAnchorMetadata([row]);
      expect(result[0]).toBe(row);
    });

    it('R05: row with content but no anchors is returned unchanged', () => {
      const row = makeRow({ content: 'Plain content, no anchor tags at all.' });
      const result = enrichResultsWithAnchorMetadata([row]);
      expect(result[0]).toBe(row);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. 2 ENRICHMENT OF ROWS WITH ANCHORS
  // ───────────────────────────────────────────────────────────────
  describe('Enrichment when anchors are present', () => {
    it('R06: row with one anchor receives anchorMetadata array', () => {
      const content = '<!-- ANCHOR:summary -->\nSome text.\n<!-- /ANCHOR:summary -->';
      const row = makeRow({ content });
      const result = enrichResultsWithAnchorMetadata([row]) as EnrichedPipelineRow[];

      expect(result[0].anchorMetadata).toBeDefined();
      expect(Array.isArray(result[0].anchorMetadata)).toBe(true);
      expect((result[0].anchorMetadata as AnchorMetadata[])).toHaveLength(1);
    });

    it('R07: enriched row has correct anchor id and type', () => {
      const content = [
        '<!-- ANCHOR:DECISION-use-rrf-001 -->',
        'content',
        '<!-- /ANCHOR:DECISION-use-rrf-001 -->',
      ].join('\n');

      const row = makeRow({ id: 42, content });
      const result = enrichResultsWithAnchorMetadata([row]) as EnrichedPipelineRow[];
      const anchors = result[0].anchorMetadata as AnchorMetadata[];

      expect(anchors[0].id).toBe('DECISION-use-rrf-001');
      expect(anchors[0].type).toBe('DECISION');
    });

    it('R08: enriched row preserves all original score fields unchanged', () => {
      const content = '<!-- ANCHOR:state -->\nstate content\n<!-- /ANCHOR:state -->';
      const row = makeRow({
        id: 7,
        score: 0.91,
        rrfScore: 0.85,
        similarity: 88,
        importance_weight: 0.7,
        content,
      });

      const result = enrichResultsWithAnchorMetadata([row]);
      const enriched = result[0];

      expect(enriched.id).toBe(7);
      expect(enriched.score).toBe(0.91);
      expect(enriched.rrfScore).toBe(0.85);
      expect(enriched.similarity).toBe(88);
      expect(enriched.importance_weight).toBe(0.7);
    });

    it('R09: row with multiple anchors gets all of them in anchorMetadata', () => {
      const content = [
        '<!-- ANCHOR:summary -->',
        'summary text',
        '<!-- /ANCHOR:summary -->',
        '<!-- ANCHOR:decisions -->',
        'decisions text',
        '<!-- /ANCHOR:decisions -->',
      ].join('\n');

      const row = makeRow({ content });
      const result = enrichResultsWithAnchorMetadata([row]) as EnrichedPipelineRow[];
      const anchors = result[0].anchorMetadata as AnchorMetadata[];

      expect(anchors).toHaveLength(2);
      expect(anchors[0].id).toBe('summary');
      expect(anchors[1].id).toBe('decisions');
    });

    it('R10: enriched row is a NEW object (not mutating the original)', () => {
      const content = '<!-- ANCHOR:preflight -->\ntext\n<!-- /ANCHOR:preflight -->';
      const row = makeRow({ content });
      const result = enrichResultsWithAnchorMetadata([row]) as EnrichedPipelineRow[];

      // The returned item must be a different reference
      expect(result[0]).not.toBe(row);
      // The original should still not have anchorMetadata
      expect(row.anchorMetadata).toBeUndefined();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. 3 MIXED BATCH (SOME ROWS WITH ANCHORS, SOME WITHOUT)
  // ───────────────────────────────────────────────────────────────
  describe('Mixed batch of rows', () => {
    it('R11: only rows with anchor content are annotated', () => {
      const withAnchorContent = '<!-- ANCHOR:summary -->\ntext\n<!-- /ANCHOR:summary -->';
      const rows = [
        makeRow({ id: 1, content: 'plain text' }),
        makeRow({ id: 2, content: withAnchorContent }),
        makeRow({ id: 3 }), // no content field
        makeRow({ id: 4, content: withAnchorContent }),
      ];

      const result = enrichResultsWithAnchorMetadata(rows) as EnrichedPipelineRow[];

      expect(result[0]).toBe(rows[0]); // unchanged reference
      expect(result[1]).not.toBe(rows[1]); // new object
      expect(result[2]).toBe(rows[2]); // unchanged reference
      expect(result[3]).not.toBe(rows[3]); // new object

      expect(result[0].anchorMetadata).toBeUndefined();
      expect(result[1].anchorMetadata).toHaveLength(1);
      expect(result[2].anchorMetadata).toBeUndefined();
      expect(result[3].anchorMetadata).toHaveLength(1);
    });

    it('R12: output array length equals input array length', () => {
      const rows = [
        makeRow({ id: 1 }),
        makeRow({ id: 2, content: '<!-- ANCHOR:x -->\ny\n<!-- /ANCHOR:x -->' }),
        makeRow({ id: 3, content: 'plain' }),
      ];

      const result = enrichResultsWithAnchorMetadata(rows);
      expect(result).toHaveLength(rows.length);
    });

    it('R13: result maintains input order', () => {
      const withAnchorContent = '<!-- ANCHOR:state -->\ncontent\n<!-- /ANCHOR:state -->';
      const rows = [
        makeRow({ id: 10, content: withAnchorContent }),
        makeRow({ id: 20, content: 'plain' }),
        makeRow({ id: 30, content: withAnchorContent }),
      ];

      const result = enrichResultsWithAnchorMetadata(rows);
      expect(result[0].id).toBe(10);
      expect(result[1].id).toBe(20);
      expect(result[2].id).toBe(30);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 9. 4 SCORE IMMUTABILITY INVARIANT
  // ───────────────────────────────────────────────────────────────
  describe('Score immutability (Stage 4 invariant)', () => {
    const SCORE_FIELDS = ['score', 'rrfScore', 'similarity', 'intentAdjustedScore', 'importance_weight'] as const;

    it('R14: no score field is added, removed, or changed by enrichment', () => {
      const content = [
        '<!-- ANCHOR:DECISION-arch-001 -->',
        'Architecture decision content.',
        '<!-- /ANCHOR:DECISION-arch-001 -->',
      ].join('\n');

      const row = makeRow({
        score: 0.75,
        rrfScore: 0.68,
        similarity: 72,
        intentAdjustedScore: 0.71,
        importance_weight: 0.6,
        content,
      });

      const result = enrichResultsWithAnchorMetadata([row]);
      const enriched = result[0];

      for (const field of SCORE_FIELDS) {
        expect(enriched[field]).toBe(row[field]);
      }
    });

    it('R15: anchorMetadata field is not a score-like number', () => {
      const content = '<!-- ANCHOR:summary -->\ntext\n<!-- /ANCHOR:summary -->';
      const row = makeRow({ content });
      const result = enrichResultsWithAnchorMetadata([row]) as EnrichedPipelineRow[];

      const meta = result[0].anchorMetadata;
      // Must be an array, not a numeric score field
      expect(Array.isArray(meta)).toBe(true);
      expect(typeof meta).not.toBe('number');
    });
  });
});

// ===============================================================
// SECTION 4: Interface shape verification
// ===============================================================

describe('AnchorMetadata interface shape', () => {
  it('I01: extracted object has all four required fields', () => {
    const content = '<!-- ANCHOR:summary -->\ntext\n<!-- /ANCHOR:summary -->';
    const result = extractAnchorMetadata(content);

    expect(result).toHaveLength(1);
    const meta = result[0];

    // All four interface fields must be present and correctly typed
    expect(typeof meta.id).toBe('string');
    expect(typeof meta.type).toBe('string');
    expect(typeof meta.startLine).toBe('number');
    expect(typeof meta.endLine).toBe('number');
  });

  it('I02: startLine is always <= endLine', () => {
    const content = [
      '<!-- ANCHOR:summary -->',
      'line2',
      'line3',
      '<!-- /ANCHOR:summary -->',
    ].join('\n');

    const result = extractAnchorMetadata(content);
    expect(result[0].startLine).toBeLessThanOrEqual(result[0].endLine);
  });

  it('I03: id and type are non-empty strings', () => {
    const content = '<!-- ANCHOR:state -->\ntext\n<!-- /ANCHOR:state -->';
    const result = extractAnchorMetadata(content);

    expect(result[0].id.length).toBeGreaterThan(0);
    expect(result[0].type.length).toBeGreaterThan(0);
  });
});

// ===============================================================
// SECTION 5: ANCHOR parsing does NOT mutate causal_edges (T011)
// ===============================================================

describe('ANCHOR parsing — no graph mutation (T011)', () => {
  it('N01: extractAnchorMetadata does not return edge-like objects', () => {
    const content = [
      '<!-- ANCHOR:DECISION-arch-001 -->',
      'Architecture decision.',
      '<!-- /ANCHOR:DECISION-arch-001 -->',
    ].join('\n');

    const result = extractAnchorMetadata(content);
    for (const meta of result) {
      // AnchorMetadata should NOT have source_id/target_id/relation fields
      expect(meta).not.toHaveProperty('source_id');
      expect(meta).not.toHaveProperty('target_id');
      expect(meta).not.toHaveProperty('relation');
      expect(meta).not.toHaveProperty('strength');
    }
  });

  it('N02: enrichResultsWithAnchorMetadata does not add causal edge fields', () => {
    const content = '<!-- ANCHOR:state -->\nstate info\n<!-- /ANCHOR:state -->';
    const row = { id: 1, score: 0.8, content } as PipelineRow;
    const result = enrichResultsWithAnchorMetadata([row]);

    for (const enriched of result) {
      expect(enriched).not.toHaveProperty('source_id');
      expect(enriched).not.toHaveProperty('target_id');
      expect(enriched).not.toHaveProperty('relation');
      expect(enriched).not.toHaveProperty('edge_id');
    }
  });

  it('N03: malformed ANCHOR tags produce no output (not partial edges)', () => {
    const malformedCases = [
      '<!-- ANCHOR: -->\ncontent\n<!-- /ANCHOR: -->', // empty ID
      '<!-- ANCHOR -->\ncontent\n<!-- /ANCHOR -->', // no colon
      '<!--ANCHOR:x-->\ncontent\n<!--/ANCHOR:x-->', // no spaces
      '<!-- ANCHOR:a -->\ncontent\n<!-- /ANCHOR:b -->', // mismatched
      '<!-- ANCHOR:unclosed -->\ncontent without closing tag', // unclosed
    ];

    for (const content of malformedCases) {
      const result = extractAnchorMetadata(content);
      // Should either return empty or valid AnchorMetadata objects only
      for (const meta of result) {
        expect(typeof meta.id).toBe('string');
        expect(meta.id.length).toBeGreaterThan(0);
        expect(typeof meta.startLine).toBe('number');
        expect(typeof meta.endLine).toBe('number');
      }
    }
  });

  it('N04: ANCHOR with special characters in ID is handled safely', () => {
    const content = [
      '<!-- ANCHOR:test/path.file#section -->',
      'content',
      '<!-- /ANCHOR:test/path.file#section -->',
    ].join('\n');

    const result = extractAnchorMetadata(content);
    // Should either parse or safely ignore — must not throw
    expect(Array.isArray(result)).toBe(true);
  });
});
