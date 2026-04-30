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
  readonly message?: string;
  readonly data?: {
    readonly requiredAction?: string;
    readonly graphAnswersOmitted?: boolean;
    readonly blockReason?: string;
    readonly anchors?: Array<{
      readonly file: string;
      readonly rawScore?: number;
      readonly pathClass?: string;
      readonly rankingSignals?: string[];
      readonly source?: string;
      readonly provider?: string;
    }>;
    readonly graphContext?: Array<{
      readonly edges: Array<{
        readonly reason: string | null;
        readonly step: string | null;
      }>;
    }>;
  };
}

describe('cg-008 — Context handler', () => {
  let tmpDir: string;
  let fixtureFile: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(process.cwd(), 'stress-cg-008-'));
    fixtureFile = join(tmpDir, 'workspace', 'normalization-fixture.ts');
    mkdirSync(join(tmpDir, 'workspace'), { recursive: true });
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

  function writeGraph(edges: CodeEdge[] = []): void {
    const content = 'export function root() {}\nexport function child() {}\n';
    const contentHash = generateContentHash(content);
    const nodes: CodeNode[] = [
      {
        symbolId: 'cg-008-root',
        filePath: fixtureFile,
        fqName: 'Normalization.root',
        kind: 'function',
        name: 'root',
        startLine: 1,
        endLine: 1,
        startColumn: 0,
        endColumn: 20,
        language: 'typescript',
        contentHash,
      },
      {
        symbolId: 'cg-008-child',
        filePath: fixtureFile,
        fqName: 'Normalization.child',
        kind: 'function',
        name: 'child',
        startLine: 2,
        endLine: 2,
        startColumn: 0,
        endColumn: 20,
        language: 'typescript',
        contentHash,
      },
    ];
    writeFileSync(fixtureFile, content, 'utf8');
    const fileId = upsertFile(fixtureFile, 'typescript', contentHash, nodes.length, edges.length, 'clean', 1, { fileMtimeMs: 0 });
    replaceNodes(fileId, nodes);
    replaceEdges(nodes.map((node) => node.symbolId), edges);
    upsertFile(fixtureFile, 'typescript', contentHash, nodes.length, edges.length, 'clean', 1);
  }

  it('normalizes CocoIndex snake_case telemetry into public anchor metadata', async () => {
    writeGraph();

    const response = parseResponse(await handleCodeGraphContext({
      queryMode: 'neighborhood',
      seeds: [{
        provider: 'cocoindex',
        file: fixtureFile,
        range: { start: 1, end: 1 },
        score: 0.87,
        raw_score: 12.4,
        path_class: 'exact-symbol',
        rankingSignals: ['bm25', 'vector'],
        source: 'stress-cocoindex',
      }],
    }));

    expect(response.status).toBe('ok');
    expect(response.data?.anchors?.[0]).toEqual(expect.objectContaining({
      file: fixtureFile,
      provider: 'cocoindex',
      source: 'stress-cocoindex',
      rawScore: 12.4,
      pathClass: 'exact-symbol',
      rankingSignals: ['bm25', 'vector'],
    }));
  });

  it('blocks adversarial edge reason and step strings from context output', async () => {
    writeGraph([{
      sourceId: 'cg-008-root',
      targetId: 'cg-008-child',
      edgeType: 'CALLS',
      weight: 0.8,
      metadata: {
        confidence: 0.93,
        detectorProvenance: 'structured',
        evidenceClass: 'EXTRACTED',
        reason: 'bad\u0000reason',
        step: 'x'.repeat(220),
      },
    }]);

    const response = parseResponse(await handleCodeGraphContext({
      queryMode: 'neighborhood',
      seeds: [{ provider: 'graph', nodeId: 'cg-008-root', symbolId: 'cg-008-root' }],
    }));

    expect(response.status).toBe('ok');
    expect(response.data?.graphContext?.[0]?.edges[0]).toEqual(expect.objectContaining({
      reason: null,
      step: null,
    }));
  });

  it('returns the blocked-output contract when readiness is saturated by an empty graph', async () => {
    const response = parseResponse(await handleCodeGraphContext({
      queryMode: 'neighborhood',
      subject: 'MissingSymbol',
      budgetTokens: 10,
    }));

    expect(response.status).toBe('blocked');
    expect(response.message).toContain('code_graph_full_scan_required');
    expect(response.data).toEqual(expect.objectContaining({
      requiredAction: 'code_graph_scan',
      graphAnswersOmitted: true,
      blockReason: 'full_scan_required',
    }));
  });
});
