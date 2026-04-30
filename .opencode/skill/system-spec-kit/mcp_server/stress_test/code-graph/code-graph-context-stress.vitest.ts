import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  closeDb,
  initDb,
  replaceEdges,
  replaceNodes,
  setLastDetectorProvenance,
  upsertFile,
} from '../../code_graph/lib/code-graph-db.js';
import { generateContentHash, type CodeEdge, type CodeNode } from '../../code_graph/lib/indexer-types.js';
import { handleCodeGraphContext } from '../../code_graph/handlers/context.js';

interface HandlerResponsePayload {
  readonly status: string;
  readonly data?: {
    readonly anchors: Array<{ readonly file: string; readonly symbol?: string }>;
    readonly graphContext: Array<{
      readonly nodes: unknown[];
      readonly edges: unknown[];
      readonly partial?: { readonly reason: string };
    }>;
    readonly textBrief: string;
    readonly metadata: {
      readonly totalNodes: number;
      readonly totalEdges: number;
      readonly budgetLimit: number;
      readonly partialOutput: {
        readonly isPartial: boolean;
        readonly reasons: string[];
        readonly truncatedText: boolean;
        readonly omittedAnchors: number;
      };
    };
  };
}

describe('cg-007 — code_graph_context', () => {
  let tmpDir: string;
  let fixtureFile: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(process.cwd(), 'stress-cg-007-'));
    fixtureFile = join(tmpDir, 'workspace', 'nested', 'context-fixture.ts');
    mkdirSync(join(tmpDir, 'workspace', 'nested'), { recursive: true });
    mkdirSync(join(tmpDir, 'db'), { recursive: true });
    initDb(join(tmpDir, 'db'));
    setLastDetectorProvenance('structured');
  });

  afterEach(() => {
    closeDb();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function parseResponse(response: { content: Array<{ type: string; text: string }> }): HandlerResponsePayload {
    return JSON.parse(response.content[0]?.text ?? '{}') as HandlerResponsePayload;
  }

  function node(index: number, contentHash: string): CodeNode {
    return {
      symbolId: `cg-007-symbol-${index}`,
      filePath: fixtureFile,
      fqName: `Fixture.symbol${index}`,
      kind: 'function',
      name: `symbol${index}`,
      startLine: index + 1,
      endLine: index + 1,
      startColumn: 0,
      endColumn: 20,
      language: 'typescript',
      contentHash,
    };
  }

  function writeGraph(nodeCount: number, edges: CodeEdge[]): CodeNode[] {
    const content = Array.from({ length: nodeCount }, (_, index) => `export function symbol${index}() { return ${index + 1}; }`).join('\n');
    const contentHash = generateContentHash(content);
    const nodes = Array.from({ length: nodeCount }, (_, index) => node(index, contentHash));
    writeFileSync(fixtureFile, content, 'utf8');
    const fileId = upsertFile(fixtureFile, 'typescript', contentHash, nodes.length, edges.length, 'clean', 1, { fileMtimeMs: 0 });
    replaceNodes(fileId, nodes);
    replaceEdges(nodes.map((entry) => entry.symbolId), edges);
    upsertFile(fixtureFile, 'typescript', contentHash, nodes.length, edges.length, 'clean', 1);
    return nodes;
  }

  it('returns partial context instead of failing when many seeds meet a tiny text budget', async () => {
    const nodes = writeGraph(120, []);

    const response = parseResponse(await handleCodeGraphContext({
      queryMode: 'outline',
      profile: 'quick',
      budgetTokens: 30,
      seeds: nodes.map((entry) => ({
        provider: 'graph',
        nodeId: entry.symbolId,
        symbolId: entry.symbolId,
      })),
    }));

    expect(response.status).toBe('ok');
    expect(response.data?.anchors).toHaveLength(120);
    expect(response.data?.metadata.budgetLimit).toBe(30);
    expect(response.data?.metadata.partialOutput.isPartial).toBe(true);
    expect(response.data?.metadata.partialOutput.reasons).toContain('budget');
    expect(response.data?.textBrief).toContain('[...truncated]');
  });

  it('expands a deeply nested impact chain without dropping the root anchor', async () => {
    const edges = Array.from({ length: 79 }, (_, index): CodeEdge => ({
      sourceId: `cg-007-symbol-${index}`,
      targetId: `cg-007-symbol-${index + 1}`,
      edgeType: 'CALLS',
      weight: 0.8,
      metadata: {
        confidence: 0.91,
        detectorProvenance: 'structured',
        evidenceClass: 'EXTRACTED',
        reason: `chain-${index}`,
      },
    }));
    const nodes = writeGraph(80, edges);
    const leaf = nodes[nodes.length - 1]!;

    const response = parseResponse(await handleCodeGraphContext({
      queryMode: 'impact',
      profile: 'research',
      budgetTokens: 800,
      seeds: [{ provider: 'graph', nodeId: leaf.symbolId, symbolId: leaf.symbolId }],
    }));

    expect(response.status).toBe('ok');
    expect(response.data?.anchors[0]).toEqual(expect.objectContaining({
      file: fixtureFile,
      symbol: leaf.fqName,
    }));
    expect(response.data?.graphContext[0]?.edges.length).toBeGreaterThanOrEqual(1);
    expect(response.data?.metadata.totalEdges).toBeGreaterThanOrEqual(1);
  });

  it('reports deadline pressure as a partial-output contract when expansion saturates', async () => {
    const edges = Array.from({ length: 1_500 }, (_, index): CodeEdge => ({
      sourceId: 'cg-007-symbol-0',
      targetId: `cg-007-symbol-${(index % 119) + 1}`,
      edgeType: 'CALLS',
      weight: 0.8,
      metadata: { confidence: 0.7, detectorProvenance: 'structured' },
    }));
    writeGraph(120, edges);

    const response = parseResponse(await handleCodeGraphContext({
      queryMode: 'neighborhood',
      budgetTokens: 200,
      seeds: [{ provider: 'graph', nodeId: 'cg-007-symbol-0', symbolId: 'cg-007-symbol-0' }],
    }));

    expect(response.status).toBe('ok');
    expect(response.data?.metadata.totalEdges).toBeGreaterThan(0);
    expect(response.data?.metadata.partialOutput.isPartial).toBe(true);
    expect(response.data?.metadata.partialOutput.reasons.length).toBeGreaterThan(0);
  });
});
