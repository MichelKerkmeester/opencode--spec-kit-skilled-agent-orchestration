// ───────────────────────────────────────────────────────────────
// MODULE: Session Resume Handler
// ───────────────────────────────────────────────────────────────
// Phase 020: Composite MCP tool that merges memory resume context,
// code graph status, and CocoIndex availability into a single call.

import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
import { handleMemoryContext } from './memory-context.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  createSharedPayloadEnvelope,
  summarizeUnknown,
  trustStateFromStructuralStatus,
  type SharedPayloadEnvelope,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionResumeArgs {
  specFolder?: string;
  minimal?: boolean;
}

interface CodeGraphStatus {
  status: 'fresh' | 'stale' | 'empty' | 'error';
  lastScan: string | null;
  nodeCount: number;
  edgeCount: number;
  fileCount: number;
}

interface CocoIndexStatus {
  available: boolean;
  binaryPath: string;
}

interface SessionResumeResult {
  memory: Record<string, unknown>;
  codeGraph: CodeGraphStatus;
  cocoIndex: CocoIndexStatus;
  structuralContext?: StructuralBootstrapContract;
  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
  // F052: Record memory recovery metric for session_resume
  recordMetricEvent({ kind: 'memory_recovery' });

  // Phase 024: Record bootstrap telemetry
  const startMs = Date.now();
  const hints: string[] = [];

  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
  let memoryResult: Record<string, unknown> = {};
  if (args.minimal) {
    memoryResult = { skipped: true, reason: 'minimal mode' };
  } else {
    try {
      const mcpResponse = await handleMemoryContext({
        input: 'resume previous work continue session',
        mode: 'resume',
        profile: 'resume',
        specFolder: args.specFolder,
      });
      // Extract data from MCP envelope
      if (mcpResponse?.content?.[0]?.text) {
        try {
          const parsed = JSON.parse(mcpResponse.content[0].text);
          memoryResult = parsed?.data ?? parsed ?? {};
        } catch {
          memoryResult = { raw: mcpResponse.content[0].text };
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      memoryResult = { error: message };
      hints.push('Memory resume failed. Try memory_context manually.');
    }
  }

  // ── Sub-call 2: Code graph status ───────────────────────────
  let codeGraph: CodeGraphStatus = {
    status: 'error',
    lastScan: null,
    nodeCount: 0,
    edgeCount: 0,
    fileCount: 0,
  };
  try {
    const stats = graphDb.getStats();
    const freshness = getGraphFreshness(process.cwd());
    codeGraph = {
      status: freshness,
      lastScan: stats.lastScanTimestamp,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      fileCount: stats.totalFiles,
    };
    // Graph status hints deferred to structural contract (Phase 027)
    // — structural context hints at lines 128-130 provide preferred recovery path
  } catch {
    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
  }

  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
  const cocoIndex: CocoIndexStatus = {
    available: isCocoIndexAvailable(),
    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
  };
  if (!cocoIndex.available) {
    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
  }

  // Phase 027: Structural bootstrap contract for resume surface
  const structuralContext = buildStructuralBootstrapContract('session_resume');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
  }

  let sessionQuality: SessionResumeResult['sessionQuality'];
  if (args.minimal) {
    try {
      sessionQuality = computeQualityScore().level;
    } catch {
      sessionQuality = 'unknown';
    }
  }

  // ── Build composite result ──────────────────────────────────
  const payloadContract = createSharedPayloadEnvelope({
    kind: 'resume',
    sections: [
      {
        key: 'memory-resume',
        title: 'Memory Resume',
        content: summarizeUnknown(memoryResult),
        source: 'memory',
      },
      {
        key: 'code-graph-status',
        title: 'Code Graph Status',
        content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
        source: 'code-graph',
      },
      {
        key: 'cocoindex-status',
        title: 'CocoIndex Status',
        content: cocoIndex.available
          ? `available at ${cocoIndex.binaryPath}`
          : `unavailable; expected at ${cocoIndex.binaryPath}`,
        source: 'semantic',
      },
      {
        key: 'structural-context',
        title: 'Structural Context',
        content: structuralContext.summary,
        source: 'code-graph',
      },
    ],
    summary: `Resume payload: memory=${memoryResult.error ? 'degraded' : args.minimal ? 'minimal' : 'available'}, graph=${codeGraph.status}, cocoindex=${cocoIndex.available ? 'available' : 'missing'}`,
    provenance: {
      producer: 'session_resume',
      sourceSurface: 'session_resume',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: codeGraph.status as GraphFreshness,
    sourceSurface: 'session_resume',
  });

  const result: SessionResumeResult = {
    memory: memoryResult,
    codeGraph,
    cocoIndex,
    structuralContext,
    payloadContract,
    opencodeTransport: buildOpenCodeTransportPlan({
      resumePayload: payloadContract,
      specFolder: args.specFolder ?? null,
    }),
    graphOps,
    ...(sessionQuality ? { sessionQuality } : {}),
    hints,
  };

  // Phase 024 / Item 9: Record bootstrap telemetry
  if (!args.minimal) {
    recordBootstrapEvent(
      'tool',
      Date.now() - startMs,
      'full',
    );
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}
