import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  closeDb,
  initDb,
  replaceEdges,
  replaceNodes,
  setCodeGraphMetadata,
  setLastGoldVerification,
  upsertFile,
} from '../../code_graph/lib/code-graph-db.js';
import { executeBattery, loadGoldBattery, type GoldBattery } from '../../code_graph/lib/gold-query-verifier.js';
import { generateContentHash, type CodeEdge, type CodeNode } from '../../code_graph/lib/indexer-types.js';
import { handleCodeGraphQuery } from '../../code_graph/handlers/query.js';
import { handleCodeGraphStatus } from '../../code_graph/handlers/status.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

interface ParsedPayload {
  readonly status: string;
  readonly data?: Record<string, unknown>;
  readonly result?: Record<string, unknown>;
  readonly readiness?: Record<string, unknown>;
  readonly error?: string;
}

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const BATTERY_PATH = join(TEST_DIR, '..', '..', 'code_graph', 'tests', 'assets', 'code-graph-gold-queries.json');
const tempDirs: string[] = [];
let originalCwd: string;
let tempRoot: string;

function parseResponse(response: HandlerResponse): ParsedPayload {
  return JSON.parse(response.content[0]?.text ?? '{}') as ParsedPayload;
}

function makeNode(filePath: string, name: string, startLine: number, endLine: number): CodeNode {
  return {
    symbolId: createHash('sha256').update(`${filePath}:${name}`).digest('hex').slice(0, 16),
    filePath,
    fqName: `fixture.${name}`,
    kind: 'function',
    name,
    startLine,
    endLine,
    startColumn: 0,
    endColumn: 20,
    language: 'typescript',
    signature: `export function ${name}()`,
    contentHash: `node-${name}`,
  };
}

function seedFile(relativePath: string, content: string, nodes: CodeNode[], edges: CodeEdge[] = []): string {
  const filePath = join(tempRoot, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
  const fileId = upsertFile(
    filePath,
    'typescript',
    generateContentHash(content),
    nodes.length,
    edges.length,
    'clean',
    1,
  );
  replaceNodes(fileId, nodes);
  replaceEdges(nodes.map((node) => node.symbolId), edges);
  return filePath;
}

function makeBattery(queryCount: number): GoldBattery {
  return {
    schema_version: 1,
    pass_policy: {
      overall_pass_rate: 1,
      edge_focus_pass_rate: 1,
    },
    queries: Array.from({ length: queryCount }, (_, index) => ({
      id: `verify-stress-${index}`,
      category: index % 2 === 0 ? 'mcp-tool' : 'cross-module',
      query: `Find handleVerify ${index}`,
      source_file: 'src/verify.ts',
      expected_top_K_symbols: ['handleVerify'],
    })),
  };
}

beforeEach(() => {
  originalCwd = process.cwd();
  tempRoot = mkdtempSync(join(tmpdir(), 'cg-manual-diagnostics-'));
  tempDirs.push(tempRoot);
  process.chdir(tempRoot);
  initDb(tempRoot);
});

afterEach(() => {
  closeDb();
  process.chdir(originalCwd);
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('cg-004,005 — manual diagnostics', () => {
  it('cg-004 executes a high-cardinality gold battery without losing query metadata', async () => {
    const filePath = join(tempRoot, 'src', 'verify.ts');
    const node = makeNode(filePath, 'handleVerify', 1, 1);
    seedFile('src/verify.ts', 'export function handleVerify() { return true; }\n', [node]);

    const result = await executeBattery(makeBattery(120), handleCodeGraphQuery, { includeDetails: true });

    expect(result.passed).toBe(true);
    expect(result.queryCount).toBe(120);
    expect(result.probes).toHaveLength(120);
    expect(result.probes[0]).toMatchObject({
      queryId: 'verify-stress-0',
      sourceFile: 'src/verify.ts',
      matchedSymbols: ['handleVerify'],
      status: 'passed',
    });
    expect(result.categoryPassRates).toMatchObject({
      'mcp-tool': 1,
      'cross-module': 1,
    });
  });

  it('cg-004 preserves blocked probe details when the graph read refuses verification', async () => {
    const result = await executeBattery(
      makeBattery(8),
      async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'blocked',
            data: { fallbackDecision: { nextTool: 'code_graph_scan', reason: 'full_scan_required' } },
          }),
        }],
      }),
      { includeDetails: true, failFast: false },
    );

    expect(result.passed).toBe(false);
    expect(result.unexpectedErrors).toHaveLength(8);
    expect(result.probes.every((probe) => probe.status === 'blocked')).toBe(true);
    expect(result.probes[0]).toMatchObject({
      missingSymbols: ['handleVerify'],
      reason: 'outline query returned status "blocked"',
    });
  });

  it('cg-005 reports graph quality, freshness, and live gold-verification trust from an isolated DB', async () => {
    const filePath = join(tempRoot, 'src', 'status.ts');
    const node = makeNode(filePath, 'statusProbe', 1, 3);
    seedFile('src/status.ts', 'export function statusProbe() { return 1; }\n', [node]);
    setCodeGraphMetadata('last_detector_provenance_summary', JSON.stringify({
      dominant: 'structured',
      counts: { structured: 1 },
    }));
    setCodeGraphMetadata('last_graph_edge_enrichment_summary', JSON.stringify({
      edgeEvidenceClass: 'direct_call',
      numericConfidence: 1,
    }));
    setLastGoldVerification({
      passed: true,
      verifiedAt: new Date().toISOString(),
      pass_policy: { overall_pass_rate: 1, edge_focus_pass_rate: 1 },
      overall_pass_rate: 1,
      edge_focus_pass_rate: 1,
    });

    const parsed = parseResponse(await handleCodeGraphStatus());

    expect(parsed.status).toBe('ok');
    expect(parsed.data).toMatchObject({
      totalFiles: 1,
      totalNodes: 1,
      totalEdges: 0,
      freshness: 'fresh',
      goldVerificationTrust: 'live',
      nodesByKind: { function: 1 },
      parseHealth: { clean: 1 },
    });
    expect(parsed.data?.readiness).toMatchObject({
      canonicalReadiness: 'ready',
      trustState: 'live',
    });
    expect(parsed.data?.graphQualitySummary).toMatchObject({
      detectorProvenanceSummary: { dominant: 'structured' },
      graphEdgeEnrichmentSummary: { edgeEvidenceClass: 'direct_call' },
    });
  });

  it('cg-005 stays read-only when tracked files become stale', async () => {
    const filePath = join(tempRoot, 'src', 'stale.ts');
    const node = makeNode(filePath, 'staleProbe', 1, 1);
    seedFile('src/stale.ts', 'export function staleProbe() { return 1; }\n', [node]);

    const before = parseResponse(await handleCodeGraphStatus());
    writeFileSync(filePath, 'export function staleProbe() { return 2; }\n', 'utf-8');
    const after = parseResponse(await handleCodeGraphStatus());

    expect(before.status).toBe('ok');
    expect(after.status).toBe('ok');
    expect(after.data).toMatchObject({
      totalFiles: 1,
      totalNodes: 1,
      freshness: 'stale',
    });
    expect(after.data?.readiness).toMatchObject({
      action: 'selective_reindex',
      inlineIndexPerformed: false,
    });
    expect(after.data?.lastPersistedAt).toBe(before.data?.lastPersistedAt);
    expect(loadGoldBattery(BATTERY_PATH).queries).toHaveLength(1);
  });
});
