// ───────────────────────────────────────────────────────────────
// MODULE: Session Resume Handler
// ───────────────────────────────────────────────────────────────
// Phase 020: Composite MCP tool that merges memory resume context,
// code graph status, and CocoIndex availability into a single call.

import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
import { handleMemoryContext } from './memory-context.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { recordMetricEvent } from '../lib/session/context-metrics.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionResumeArgs {
  specFolder?: string;
}

interface CodeGraphStatus {
  status: 'ok' | 'empty' | 'error';
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
  hints: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
  // F052: Record memory recovery metric for session_resume
  recordMetricEvent({ kind: 'memory_recovery' });
  const hints: string[] = [];

  // ── Sub-call 1: Memory context resume ───────────────────────
  let memoryResult: Record<string, unknown> = {};
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
    codeGraph = {
      status: stats.totalNodes > 0 ? 'ok' : 'empty',
      lastScan: stats.lastScanTimestamp,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      fileCount: stats.totalFiles,
    };
    if (codeGraph.status === 'empty') {
      hints.push('Code graph is empty. Run `code_graph_scan` to build structural context.');
    } else if (codeGraph.lastScan) {
      const ageMs = Date.now() - new Date(codeGraph.lastScan).getTime();
      if (ageMs > 24 * 60 * 60 * 1000) {
        hints.push('Code graph is >24h old. Run `code_graph_scan` to refresh.');
      }
    }
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

  // ── Build composite result ──────────────────────────────────
  const result: SessionResumeResult = {
    memory: memoryResult,
    codeGraph,
    cocoIndex,
    hints,
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}
