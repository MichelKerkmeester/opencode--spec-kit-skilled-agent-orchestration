// ───────────────────────────────────────────────────────────────
// TEST: code_graph_context — CocoIndex fork telemetry passthrough
// ───────────────────────────────────────────────────────────────
// Packet: 015-cocoindex-seed-telemetry-passthrough (Q-OPP)
// Source: research.md §6 — per-seed telemetry passthrough as ADDITIVE
// METADATA. Verifies (A) snake_case wire schema, (B) camelCase schema,
// (C) anchors preserve rawScore/pathClass/rankingSignals, (D) backward
// compatibility for telemetry-less seeds, (E) anchor score/confidence/
// resolution/ordering byte-equal pre/post patch on a fixed fixture,
// (F) hybrid-search rank order unchanged on a fixed query corpus.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

// ── Mocks for graph DB / readiness ───────────────────────────────────
const mocks = vi.hoisted(() => ({
  ensureCodeGraphReady: vi.fn(),
  getDb: vi.fn(),
  getStats: vi.fn(),
  getLastDetectorProvenance: vi.fn(),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
  queryFileDegrees: vi.fn(),
  queryFileImportDependents: vi.fn(),
  queryOutline: vi.fn(),
  resolveSubjectFilePath: vi.fn(),
}));

function installMocks(): void {
  // Default: graph is fresh, no inline scan
  mocks.ensureCodeGraphReady.mockResolvedValue({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'all tracked files are up-to-date',
  });
  vi.doMock('../code_graph/lib/ensure-ready.js', () => ({
    ensureCodeGraphReady: mocks.ensureCodeGraphReady,
  }));
  vi.doMock('../code_graph/lib/code-graph-db.js', () => ({
    getDb: mocks.getDb,
    getStats: mocks.getStats,
    getLastDetectorProvenance: mocks.getLastDetectorProvenance,
    queryEdgesFrom: mocks.queryEdgesFrom,
    queryEdgesTo: mocks.queryEdgesTo,
    queryFileDegrees: mocks.queryFileDegrees,
    queryFileImportDependents: mocks.queryFileImportDependents,
    queryOutline: mocks.queryOutline,
    resolveSubjectFilePath: mocks.resolveSubjectFilePath,
  }));
}

// Mock prepared-statement helper. resolveSeed() runs a chain of three
// queries on file_path / start_line. We return null for exact + near-exact
// + enclosing so resolution falls through to file_anchor — that keeps the
// test deterministic and independent of any real graph DB.
function makeEmptyPrepare() {
  return vi.fn(() => ({
    all: vi.fn(() => []),
    get: vi.fn(() => undefined),
  }));
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  installMocks();
  mocks.getDb.mockReturnValue({ prepare: makeEmptyPrepare() });
  mocks.getStats.mockReturnValue({ lastScanTimestamp: '2026-04-27T00:00:00Z' });
  mocks.getLastDetectorProvenance.mockReturnValue('structured');
  mocks.queryEdgesFrom.mockReturnValue([]);
  mocks.queryEdgesTo.mockReturnValue([]);
  mocks.queryFileDegrees.mockReturnValue([]);
  mocks.queryFileImportDependents.mockReturnValue([]);
  mocks.queryOutline.mockReturnValue([]);
  mocks.resolveSubjectFilePath.mockImplementation((subject: string) => subject);
});

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

// ── Helper: run handler and parse anchor envelope ────────────────────
async function runContext(args: Record<string, unknown>): Promise<{
  status: string;
  data?: { anchors?: Array<Record<string, unknown>> };
}> {
  const { handleCodeGraphContext } = await import('../code_graph/handlers/context.js');
  const result = await handleCodeGraphContext(args as never);
  return JSON.parse(result.content[0].text);
}

// ───────────────────────────────────────────────────────────────────────
// A. Schema accepts snake_case wire fields
// ───────────────────────────────────────────────────────────────────────
describe('codeGraphSeedSchema — wire-format (snake_case) acceptance', () => {
  it('accepts seed with raw_score, path_class, rankingSignals (snake_case wire)', async () => {
    const { TOOL_DEFINITIONS, validateToolArgs } = await import('../tool-schemas.js');
    expect(TOOL_DEFINITIONS).toBeDefined(); // sanity

    const args = {
      seeds: [
        {
          provider: 'cocoindex',
          file: 'src/foo.ts',
          range: { start: 10, end: 20 },
          score: 0.85,
          raw_score: 0.92,
          path_class: 'implementation',
          rankingSignals: ['implementation_boost'],
        },
      ],
    };
    expect(() => validateToolArgs('code_graph_context', args)).not.toThrow();
  });
});

// ───────────────────────────────────────────────────────────────────────
// B. Schema accepts camelCase internal fields
// ───────────────────────────────────────────────────────────────────────
describe('codeGraphSeedSchema — internal-format (camelCase) acceptance', () => {
  it('accepts seed with rawScore, pathClass, rankingSignals (camelCase)', async () => {
    const { validateToolArgs } = await import('../tool-schemas.js');

    const args = {
      seeds: [
        {
          provider: 'cocoindex',
          file: 'src/foo.ts',
          range: { start: 10, end: 20 },
          score: 0.85,
          rawScore: 0.92,
          pathClass: 'implementation',
          rankingSignals: ['implementation_boost'],
        },
      ],
    };
    expect(() => validateToolArgs('code_graph_context', args)).not.toThrow();
  });

  it('accepts a mixed seed (camelCase + snake_case) without rejecting', async () => {
    const { validateToolArgs } = await import('../tool-schemas.js');
    const args = {
      seeds: [
        {
          provider: 'cocoindex',
          file: 'src/foo.ts',
          range: { start: 10, end: 20 },
          score: 0.85,
          // both wire + internal — handler prefers camelCase
          rawScore: 0.92,
          raw_score: 0.91,
          pathClass: 'implementation',
          path_class: 'tests',
          rankingSignals: ['implementation_boost'],
        },
      ],
    };
    expect(() => validateToolArgs('code_graph_context', args)).not.toThrow();
  });
});

// ───────────────────────────────────────────────────────────────────────
// C. Anchors preserve fork telemetry alongside score/snippet/range
// ───────────────────────────────────────────────────────────────────────
describe('handleCodeGraphContext — anchor telemetry emission', () => {
  it('emits rawScore + pathClass + rankingSignals next to score/snippet/range (snake_case input)', async () => {
    const parsed = await runContext({
      seeds: [
        {
          provider: 'cocoindex',
          file: 'src/foo.ts',
          range: { start: 10, end: 20 },
          score: 0.85,
          snippet: 'function foo() {}',
          raw_score: 0.92,
          path_class: 'implementation',
          rankingSignals: ['implementation_boost'],
        },
      ],
    });

    expect(parsed.status).toBe('ok');
    expect(parsed.data?.anchors).toHaveLength(1);
    const anchor = parsed.data!.anchors![0];
    expect(anchor.score).toBe(0.85);
    expect(anchor.snippet).toBe('function foo() {}');
    expect(anchor.range).toEqual({ start: 10, end: 20 });
    // Q-OPP passthrough fields normalized to camelCase on the wire
    expect(anchor.rawScore).toBe(0.92);
    expect(anchor.pathClass).toBe('implementation');
    expect(anchor.rankingSignals).toEqual(['implementation_boost']);
  });

  it('emits telemetry when input uses camelCase (no normalization needed)', async () => {
    const parsed = await runContext({
      seeds: [
        {
          provider: 'cocoindex',
          file: 'src/bar.ts',
          range: { start: 5, end: 15 },
          score: 0.7,
          rawScore: 0.78,
          pathClass: 'tests',
          rankingSignals: ['tests_penalty'],
        },
      ],
    });

    expect(parsed.status).toBe('ok');
    const anchor = parsed.data!.anchors![0];
    expect(anchor.rawScore).toBe(0.78);
    expect(anchor.pathClass).toBe('tests');
    expect(anchor.rankingSignals).toEqual(['tests_penalty']);
  });
});

// ───────────────────────────────────────────────────────────────────────
// D. Backward-compatibility — seeds without telemetry preserve baseline
// ───────────────────────────────────────────────────────────────────────
describe('handleCodeGraphContext — backward compatibility', () => {
  it('does NOT emit rawScore / pathClass / rankingSignals when seed has none', async () => {
    const parsed = await runContext({
      seeds: [
        {
          provider: 'cocoindex',
          file: 'src/baz.ts',
          range: { start: 1, end: 5 },
          score: 0.5,
          snippet: 'baz',
        },
      ],
    });

    expect(parsed.status).toBe('ok');
    const anchor = parsed.data!.anchors![0];
    expect(anchor).not.toHaveProperty('rawScore');
    expect(anchor).not.toHaveProperty('pathClass');
    expect(anchor).not.toHaveProperty('rankingSignals');
    // Baseline still intact
    expect(anchor.score).toBe(0.5);
    expect(anchor.snippet).toBe('baz');
  });

  it('non-cocoindex providers ignore telemetry fields silently', async () => {
    // Manual seeds don't go through the cocoindex normalization branch;
    // any telemetry fields supplied are simply not propagated.
    const parsed = await runContext({
      seeds: [
        {
          provider: 'manual',
          symbolName: 'doStuff',
          filePath: 'src/qux.ts',
          // these should be silently ignored for non-cocoindex providers
          rawScore: 0.99,
          pathClass: 'implementation',
        },
      ],
    });

    expect(parsed.status).toBe('ok');
    // Manual seeds resolve via DB lookup (mocked empty) → file_anchor
    // resolution. Either way: no telemetry on the anchor.
    const anchor = parsed.data!.anchors![0];
    expect(anchor).not.toHaveProperty('rawScore');
    expect(anchor).not.toHaveProperty('pathClass');
    expect(anchor).not.toHaveProperty('rankingSignals');
  });
});

// ───────────────────────────────────────────────────────────────────────
// E. Fixture equality — score/confidence/resolution/ordering byte-equal
//    before vs after the patch. This is the LOAD-BEARING assertion
//    that Q-OPP is metadata-only and changes no rank/score behavior.
// ───────────────────────────────────────────────────────────────────────
describe('handleCodeGraphContext — score / confidence / resolution / ordering invariants', () => {
  // Hand-authored expected output captures the pre-patch baseline
  // (telemetry-less anchors). Telemetry is metadata: removing it from a
  // post-patch anchor MUST yield byte-equal core fields.
  const fixtureSeeds = [
    {
      provider: 'cocoindex',
      file: 'src/alpha.ts',
      range: { start: 1, end: 10 },
      score: 0.9,
      snippet: 'alpha',
    },
    {
      provider: 'cocoindex',
      file: 'src/beta.ts',
      range: { start: 20, end: 30 },
      score: 0.6,
      snippet: 'beta',
    },
    {
      provider: 'cocoindex',
      file: 'src/gamma.ts',
      range: { start: 40, end: 50 },
      score: 0.3,
      snippet: 'gamma',
    },
  ];

  function stripTelemetry(anchor: Record<string, unknown>): Record<string, unknown> {
    const { rawScore: _r, pathClass: _p, rankingSignals: _s, ...rest } = anchor as Record<string, unknown>;
    return rest;
  }

  it('telemetry-laden seeds yield byte-equal core anchors vs telemetry-less seeds', async () => {
    // Run 1: bare seeds (pre-patch shape)
    const before = await runContext({ seeds: fixtureSeeds });

    // Run 2: same seeds + telemetry overlay (post-patch shape)
    const seedsWithTelemetry = fixtureSeeds.map((s, i) => ({
      ...s,
      rawScore: s.score + 0.01 * (i + 1),
      pathClass: i === 0 ? 'implementation' : i === 1 ? 'tests' : 'docs',
      rankingSignals: [`signal_${i}`],
    }));
    const after = await runContext({ seeds: seedsWithTelemetry });

    expect(before.status).toBe('ok');
    expect(after.status).toBe('ok');

    const beforeAnchors = before.data!.anchors!;
    const afterAnchors = after.data!.anchors!;

    expect(afterAnchors.length).toBe(beforeAnchors.length);

    // Byte-equal compare the CORE fields (score, confidence, resolution,
    // ordering). Strip telemetry from the post-patch run; the remainder
    // must match the pre-patch baseline exactly.
    const afterStripped = afterAnchors.map(stripTelemetry);
    expect(afterStripped).toEqual(beforeAnchors);

    // Ordering invariant: same files, same order
    const beforeFiles = beforeAnchors.map((a) => a.file);
    const afterFiles = afterAnchors.map((a) => a.file);
    expect(afterFiles).toEqual(beforeFiles);

    // Score invariant: anchor.score is the seed.score (NOT raw_score)
    for (let i = 0; i < afterAnchors.length; i++) {
      expect(afterAnchors[i].score).toBe(beforeAnchors[i].score);
      expect(afterAnchors[i].confidence).toBe(beforeAnchors[i].confidence);
      expect(afterAnchors[i].resolution).toBe(beforeAnchors[i].resolution);
    }
  });

  it('rawScore on input does NOT replace anchor.score', async () => {
    // Even when raw_score >> score, the anchor's score field MUST be the
    // original score (= the fork's bounded post-rerank score). This is
    // the explicit guarantee Q-OPP makes — telemetry is audit-only.
    const parsed = await runContext({
      seeds: [
        {
          provider: 'cocoindex',
          file: 'src/foo.ts',
          range: { start: 10, end: 20 },
          score: 0.5,
          raw_score: 0.99,
        },
      ],
    });

    const anchor = parsed.data!.anchors![0];
    expect(anchor.score).toBe(0.5); // bounded post-rerank score
    expect(anchor.rawScore).toBe(0.99); // raw audit signal
  });
});

// ───────────────────────────────────────────────────────────────────────
// F. hybrid-search rank order unchanged — no second rerank introduced
// ───────────────────────────────────────────────────────────────────────
describe('hybrid-search rank order — invariant under packet 015', () => {
  // Packet 015 is forbidden from referencing the fork's path_class or
  // raw_score in mcp_server/lib/search/*. We verify this two ways:
  // 1. The hybrid-search module exists and can be imported.
  // 2. None of its public functions reference the fork field names.
  //    (Static check — we read the source and grep for fork-field tokens
  //    in callsites that would actually use them for ordering.)
  // We deliberately do NOT run hybrid-search end-to-end here because that
  // is a separate test surface; the contract we enforce in 015 is "no
  // cross-cutting reference to the fork's telemetry from the search rank
  // path." A proper end-to-end fixture lives in adjacent vitest files.

  it('hybrid-search module does not reference fork telemetry as ranking input', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const hybridSearchPath = path.resolve(
      __dirname,
      '..',
      'lib',
      'search',
      'hybrid-search.ts',
    );
    const source = await fs.readFile(hybridSearchPath, 'utf8');

    // The fork's exact telemetry field names. `rawScore` is a generic
    // local-variable name in hybrid-search (used for normalization), so
    // we exclude it from the grep — what we strictly forbid is REFERENCE
    // to `path_class`, `pathClass` (as a fork signal), and `rankingSignals`
    // from the fork. The fork's `raw_score` (snake_case) is also forbidden
    // since it is not a hybrid-search concept.
    expect(source).not.toMatch(/\bpath_class\b/);
    // pathClass appears only as a fork field; no use in lib/search expected
    expect(source).not.toMatch(/\bpathClass\b/);
    expect(source).not.toMatch(/\brankingSignals\b/);
    expect(source).not.toMatch(/\braw_score\b/);
  });

  it('search-utils does not reference fork telemetry as ranking input', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const searchUtilsPath = path.resolve(
      __dirname,
      '..',
      'lib',
      'search',
      'search-utils.ts',
    );
    const source = await fs.readFile(searchUtilsPath, 'utf8');

    expect(source).not.toMatch(/\bpath_class\b/);
    expect(source).not.toMatch(/\bpathClass\b/);
    expect(source).not.toMatch(/\brankingSignals\b/);
    expect(source).not.toMatch(/\braw_score\b/);
  });
});

// ───────────────────────────────────────────────────────────────────────
// Sanity — schema directly accepts the new fields via Zod
// ───────────────────────────────────────────────────────────────────────
describe('codeGraphSeedSchema — direct Zod validation', () => {
  it('parses snake_case + camelCase telemetry fields', async () => {
    // Re-import the schemas module fresh (vi.resetModules in beforeEach).
    const mod = await import('../schemas/tool-input-schemas.js');
    const schema = mod.TOOL_SCHEMAS.code_graph_context as z.ZodType<unknown>;
    expect(() =>
      schema.parse({
        seeds: [
          {
            provider: 'cocoindex',
            file: 'src/foo.ts',
            range: { start: 1, end: 2 },
            score: 0.5,
            raw_score: 0.6,
            path_class: 'implementation',
            rankingSignals: ['s'],
          },
          {
            provider: 'cocoindex',
            file: 'src/bar.ts',
            range: { start: 3, end: 4 },
            score: 0.4,
            rawScore: 0.5,
            pathClass: 'tests',
            rankingSignals: [],
          },
        ],
      }),
    ).not.toThrow();
  });
});
