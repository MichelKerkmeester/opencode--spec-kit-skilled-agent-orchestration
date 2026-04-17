// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.

import { buildContext, type ContextArgs, type QueryMode } from '../../lib/code-graph/code-graph-context.js';
import type { CodeGraphSeed } from '../../lib/code-graph/seed-resolver.js';
import { ensureCodeGraphReady, type ReadyResult } from '../../lib/code-graph/ensure-ready.js';
import * as graphDb from '../../lib/code-graph/code-graph-db.js';
import { buildReadinessBlock } from '../../lib/code-graph/readiness-contract.js';

export interface ContextHandlerArgs {
  input?: string;
  queryMode?: string;
  subject?: string;
  seeds?: Array<{
    filePath?: string;
    startLine?: number;
    endLine?: number;
    query?: string;
    provider?: string;
    source?: string;
    file?: string;
    range?: { start: number; end: number };
    score?: number;
    snippet?: string;
    symbolName?: string;
    kind?: string;
    nodeId?: string;
    symbolId?: string;
  }>;
  budgetTokens?: number;
  profile?: string;
  includeTrace?: boolean;
}

interface NormalizedSeedSource {
  source?: string;
  filePath: string;
  startLine?: number;
  endLine?: number;
  symbolId?: string;
  symbolName?: string;
}

type ContextReadiness = ReadyResult & { error?: string };

function resolveSeedSource(args: ContextHandlerArgs, anchor: {
  filePath: string;
  startLine: number;
  endLine: number;
  symbolId: string | null;
  fqName: string | null;
}): string | undefined {
  const normalizedSeeds: NormalizedSeedSource[] = (args.seeds ?? []).map((seed) => ({
    source: typeof seed.source === 'string' && seed.source.trim().length > 0
      ? seed.source
      : seed.provider,
    filePath: seed.provider === 'cocoindex'
      ? (seed.file ?? seed.filePath ?? '')
      : (seed.filePath ?? seed.file ?? ''),
    startLine: seed.provider === 'cocoindex' ? seed.range?.start : seed.startLine,
    endLine: seed.provider === 'cocoindex' ? seed.range?.end : seed.endLine,
    symbolId: seed.symbolId,
    symbolName: seed.symbolName,
  }));

  const match = normalizedSeeds.find((seed) => {
    if (seed.symbolId && anchor.symbolId) {
      return seed.symbolId === anchor.symbolId;
    }
    if (seed.symbolName && anchor.fqName) {
      return seed.symbolName === anchor.fqName || anchor.fqName.endsWith(`.${seed.symbolName}`);
    }
    if (seed.filePath !== anchor.filePath) {
      return false;
    }
    if (typeof seed.startLine === 'number' && seed.startLine !== anchor.startLine) {
      return false;
    }
    if (typeof seed.endLine === 'number' && seed.endLine !== anchor.endLine) {
      return false;
    }
    return true;
  });

  return match?.source;
}

/** Handle code_graph_context tool call */
export async function handleCodeGraphContext(args: ContextHandlerArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  let readiness: ContextReadiness = {
    freshness: 'empty' as const,
    action: 'none' as const,
    inlineIndexPerformed: false,
    reason: 'readiness check not run',
  };
  let readinessCheckCrashed = false;

  try {
    // Auto-trigger: ensure graph is fresh before querying
    try {
      readiness = await ensureCodeGraphReady(process.cwd(), {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });
    } catch (err: unknown) {
      readinessCheckCrashed = true;
      readiness = {
        freshness: 'empty' as const,
        action: 'none' as const,
        inlineIndexPerformed: false,
        reason: 'readiness_check_crashed',
        error: err instanceof Error ? err.message : String(err),
      };
    }

    const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '')
      ? args.queryMode as QueryMode
      : 'neighborhood');

    const seeds = (args.seeds ?? []).map((seed) => {
      const source = typeof seed.source === 'string' && seed.source.trim().length > 0
        ? seed.source
        : seed.provider;

      if (seed.provider === 'cocoindex' && seed.file) {
        return {
          provider: 'cocoindex' as const,
          file: seed.file,
          range: seed.range ?? { start: seed.startLine ?? 1, end: seed.endLine ?? seed.startLine ?? 1 },
          score: seed.score ?? 0,
          snippet: seed.snippet,
          source,
        };
      }

      if (seed.provider === 'manual' && seed.symbolName) {
        return {
          provider: 'manual' as const,
          symbolName: seed.symbolName,
          filePath: seed.filePath,
          kind: seed.kind,
          source,
        };
      }

      if (seed.provider === 'graph' && seed.symbolId) {
        return {
          provider: 'graph' as const,
          nodeId: seed.nodeId ?? seed.symbolId,
          symbolId: seed.symbolId,
          source,
        };
      }

      return {
        filePath: seed.filePath ?? seed.file ?? '',
        startLine: seed.startLine ?? seed.range?.start,
        endLine: seed.endLine ?? seed.range?.end,
        query: seed.query,
        source,
      };
    }) as unknown as CodeGraphSeed[];

    const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined) as ContextArgs['profile'];

    const contextArgs: ContextArgs = {
      input: args.input,
      queryMode,
      subject: args.subject,
      seeds,
      budgetTokens: args.budgetTokens ?? 1200,
      profile,
      includeTrace: args.includeTrace,
    };

    const result = buildContext(contextArgs);
    const readinessBlock = readinessCheckCrashed
      ? {
        ...buildReadinessBlock(readiness),
        reason: 'readiness_check_crashed',
        trustState: 'unavailable' as const,
      }
      : buildReadinessBlock(readiness);
    const lastPersistedAt = graphDb.getStats().lastScanTimestamp;

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            queryMode: result.queryMode,
            combinedSummary: result.combinedSummary,
            nextActions: result.nextActions,
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            lastPersistedAt,
            anchors: result.resolvedAnchors.map(a => ({
              file: a.filePath,
              line: a.startLine,
              symbol: a.fqName,
              resolution: a.resolution,
              confidence: a.confidence,
              source: resolveSeedSource(args, a),
            })),
            graphContext: result.graphContext,
            textBrief: result.textBrief,
            metadata: result.metadata,
            graphMetadata: {
              detectorProvenance: graphDb.getLastDetectorProvenance() ?? 'unknown',
            },
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    console.error('[code-graph-context] Unexpected failure:', err);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: 'code_graph_context failed',
        }),
      }],
    };
  }
}
