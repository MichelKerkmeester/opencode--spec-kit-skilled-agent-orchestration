// ───────────────────────────────────────────────────────────────
// MODULE: Context Server
// ───────────────────────────────────────────────────────────────
// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
// Logic in tools/*.ts. This file retains server init, startup,
// Shutdown, and main orchestration only.
import fs from 'fs';
import path from 'path';

/* ───────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

// MCP SDK
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Core modules
import {
  DEFAULT_BASE_PATH,
  ALLOWED_BASE_PATHS,
  DATABASE_PATH,
  checkDatabaseUpdated,
  setEmbeddingModelReady, waitForEmbeddingModel,
  init as initDbState
} from './core/index.js';

// T303: Tool schemas and dispatch
import { TOOL_DEFINITIONS } from './tool-schemas.js';
import { dispatchTool } from './tools/index.js';

// Handler modules (only indexSingleFile needed directly for startup scan)
import {
  indexSingleFile,
  handleMemoryStats,
} from './handlers/index.js';
import * as memoryIndexDiscovery from './handlers/memory-index-discovery.js';
import { runPostMutationHooks } from './handlers/mutation-hooks.js';

// Utils
import { validateInputLengths } from './utils/index.js';

// History (audit trail for file-watcher deletes)
import { recordHistory } from './lib/storage/history.js';
import * as historyStore from './lib/storage/history.js';

// Hooks
import {
  MEMORY_AWARE_TOOLS,
  extractContextHint,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
  appendAutoSurfaceHints,
  syncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount,
  recordToolCall,
} from './hooks/index.js';
import { primeSessionIfNeeded } from './hooks/memory-surface.js';

// Architecture
import { getTokenBudget } from './lib/architecture/layer-definitions.js';
import { createMCPErrorResponse, wrapForMCP } from './lib/response/envelope.js';

// T303: Startup checks (extracted from this file)
import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks.js';
import {
  getStartupEmbeddingDimension,
  resolveStartupEmbeddingConfig,
  validateConfiguredEmbeddingsProvider,
} from '@spec-kit/shared/embeddings/factory';

// Lib modules (for initialization only)
import * as vectorIndex from './lib/search/vector-index.js';
import * as _embeddings from './lib/providers/embeddings.js';
import * as checkpointsLib from './lib/storage/checkpoints.js';
import * as accessTracker from './lib/storage/access-tracker.js';
import { runLineageBackfill } from './lib/storage/lineage-state.js';
import * as hybridSearch from './lib/search/hybrid-search.js';
import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn.js';
import { isGraphUnifiedEnabled } from './lib/search/graph-flags.js';
import * as graphDb from './lib/code-graph/code-graph-db.js';
import { detectRuntime, type RuntimeInfo } from './lib/code-graph/runtime-detection.js';
import * as sessionBoost from './lib/search/session-boost.js';
import * as causalBoost from './lib/search/causal-boost.js';
import * as bm25Index from './lib/search/bm25-index.js';
import * as memoryParser from './lib/parsing/memory-parser.js';
import { getSpecsBasePaths } from './lib/search/folder-discovery.js';
import {
  isDegreeBoostEnabled,
  isDynamicInitEnabled,
  isFileWatcherEnabled,
} from './lib/search/search-flags.js';
import { runCleanupStep, runAsyncCleanupStep } from './lib/utils/cleanup-helpers.js';
import { disposeLocalReranker } from './lib/search/local-reranker.js';
import * as workingMemory from './lib/cognitive/working-memory.js';
import * as attentionDecay from './lib/cognitive/attention-decay.js';
import * as coActivation from './lib/cognitive/co-activation.js';
import { initScoringObservability } from './lib/telemetry/scoring-observability.js';
// T059: Archival manager for automatic archival of ARCHIVED state memories
import * as archivalManager from './lib/cognitive/archival-manager.js';
// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
import * as retryManager from './lib/providers/retry-manager.js';
import { buildErrorResponse, getDefaultErrorCodeForTool, getRecoveryHint } from './lib/errors.js';
// T001-T004: Session deduplication
import * as sessionManager from './lib/session/session-manager.js';
import * as shadowEvaluationRuntime from './lib/feedback/shadow-evaluation-runtime.js';
// Phase 023: Context metrics — lightweight session quality tracking
import { recordMetricEvent } from './lib/session/context-metrics.js';

// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
import * as incrementalIndex from './lib/storage/incremental-index.js';
// T107: Transaction manager for pending file recovery on startup (REQ-033)
import * as transactionManager from './lib/storage/transaction-manager.js';
// KL-4: Tool cache cleanup on shutdown
import * as toolCache from './lib/cache/tool-cache.js';
import { initExtractionAdapter } from './lib/extraction/extraction-adapter.js';
import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
import { isLearnedFeedbackEnabled } from './lib/search/learned-feedback.js';
import { initIngestJobQueue } from './lib/ops/job-queue.js';
import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher.js';
import { getCanonicalPathKey } from './lib/utils/canonical-path.js';
import { runBatchLearning } from './lib/feedback/batch-learning.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface IndexResult {
  status: string;
  error?: string;
  [key: string]: unknown;
}

interface PendingRecoveryResult {
  found: number;
  processed: number;
  recovered: number;
  failed: number;
  results: unknown[];
}

interface ApiKeyValidation {
  valid: boolean;
  provider?: string;
  error?: string;
  errorCode?: string;
  warning?: string;
  actions?: string[];
  networkError?: boolean;
}

interface AutoSurfaceResult {
  constitutional: unknown[];
  triggered: unknown[];
  codeGraphStatus?: {
    status: 'ok' | 'error';
    data?: Record<string, unknown>;
    error?: string;
  };
  sessionPrimed?: boolean;
  primedTool?: string;
  /** T018: Structured Prime Package for non-hook CLI auto-priming */
  primePackage?: {
    specFolder: string | null;
    currentTask: string | null;
    codeGraphStatus: 'fresh' | 'stale' | 'empty';
    cocoIndexAvailable: boolean;
    recommendedCalls: string[];
  };
  surfaced_at?: string;
  latencyMs?: number;
}

interface ToolCallResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
  [key: string]: unknown;
}

interface DynamicMemoryStats {
  totalMemories: number;
  specFolderCount: number;
  activeCount: number;
  staleCount: number;
}

type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;

const afterToolCallbacks: Array<AfterToolCallback> = [];

/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
const EMBEDDING_MODEL_TIMEOUT_MS = 30_000;

/** Timeout (ms) for API key validation during startup. */
const API_KEY_VALIDATION_TIMEOUT_MS = 5_000;

const GRAPH_ENRICHMENT_TIMEOUT_MS = 250;
const GRAPH_ENRICHMENT_OUTLINE_LIMIT = 6;
const GRAPH_ENRICHMENT_NEIGHBOR_LIMIT = 6;
const GRAPH_ENRICHMENT_SYMBOL_LIMIT = 4;
const GRAPH_CONTEXT_EXCLUDED_TOOLS = new Set<string>([
  ...MEMORY_AWARE_TOOLS,
  'code_graph_query',
  'code_graph_context',
  'code_graph_scan',
  'code_graph_status',
]);

interface GraphContextNeighborSummary {
  filePath: string;
  relationTypes: string[];
  symbols: Array<{
    name: string;
    kind: string;
    line: number;
    direction: 'incoming' | 'outgoing';
    relation: string;
  }>;
}

interface GraphContextFileSummary {
  filePath: string;
  outline: Array<{
    name: string;
    kind: string;
    line: number;
  }>;
  neighbors: GraphContextNeighborSummary[];
}

interface DispatchGraphContextMeta {
  status: 'ok' | 'timeout' | 'unavailable';
  source: 'tool-dispatch';
  fileCount: number;
  filePaths: string[];
  latencyMs: number;
  files?: GraphContextFileSummary[];
  error?: string;
}

function isMutationStatus(status: string | undefined): boolean {
  return status === 'indexed' || status === 'updated' || status === 'reinforced' || status === 'deferred';
}

let generatedCallIdCounter = 0;
let detectedRuntime: RuntimeInfo | null = null;

export function getDetectedRuntime(): RuntimeInfo | null {
  return detectedRuntime;
}

function resolveToolCallId(request: { id?: unknown }): string {
  const requestId = request.id;
  if (typeof requestId === 'string' || typeof requestId === 'number') {
    return String(requestId);
  }
  generatedCallIdCounter += 1;
  return `generated-${generatedCallIdCounter}`;
}

function resolveSessionTrackingId(
  args: Record<string, unknown>,
  extra: unknown,
): string | undefined {
  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
    ? ((extra as { sessionId?: string }).sessionId ?? null)
    : null;
  const explicitSessionId = typeof args.sessionId === 'string'
    ? args.sessionId
    : typeof args.session_id === 'string'
      ? args.session_id
      : null;
  const codexThreadId = typeof process.env.CODEX_THREAD_ID === 'string'
    && process.env.CODEX_THREAD_ID.trim().length > 0
    ? process.env.CODEX_THREAD_ID.trim()
    : null;

  return explicitSessionId ?? transportSessionId ?? codexThreadId ?? undefined;
}

// REQ-014: Sticky session for follow_on_tool_use correlation.
// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
// that lack an explicit sessionId param can still correlate with a prior search.
// Safe for stdio (single client). TTL in query-flow-tracker bounds staleness.
let lastKnownSessionId: string | null = null;

function runAfterToolCallbacks(tool: string, callId: string, result: unknown): void {
  if (afterToolCallbacks.length === 0) {
    return;
  }

  queueMicrotask(() => {
    for (const callback of afterToolCallbacks) {
      void callback(tool, callId, result).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[context-server] afterTool callback failed for '${tool}' (${callId}): ${message}`);
      });
    }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function looksLikeGraphableFilePath(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('*') || trimmed.includes('?')) {
    return false;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('app://') ||
    trimmed.startsWith('plugin://')
  ) {
    return false;
  }

  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    trimmed.includes('/') ||
    trimmed.includes('\\') ||
    path.extname(trimmed).length > 0
  );
}

function normalizeGraphFilePath(value: string): string | null {
  if (!looksLikeGraphableFilePath(value)) {
    return null;
  }

  const normalized = path.isAbsolute(value)
    ? path.normalize(value)
    : path.resolve(process.cwd(), value);
  const workspaceRoot = path.resolve(process.cwd());
  const relativeToWorkspace = path.relative(workspaceRoot, normalized);

  if (
    relativeToWorkspace.startsWith('..') ||
    path.isAbsolute(relativeToWorkspace)
  ) {
    return null;
  }

  try {
    if (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile()) {
      return null;
    }
  } catch {
    return null;
  }

  return normalized;
}

function extractFilePathsFromToolArgs(args: unknown): string[] {
  const results = new Set<string>();
  const visited = new WeakSet<object>();

  const visit = (value: unknown, keyHint?: string): void => {
    if (typeof value === 'string') {
      const normalized = normalizeGraphFilePath(value);
      const keyLooksPathLike = keyHint
        ? /(^|_)(path|file|target|subject|seed)s?$/i.test(keyHint) || /path|file/i.test(keyHint)
        : false;
      if (normalized && (keyLooksPathLike || looksLikeGraphableFilePath(value))) {
        results.add(normalized);
      }
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item, keyHint);
      }
      return;
    }

    if (!isRecord(value)) {
      return;
    }

    if (visited.has(value)) {
      return;
    }
    visited.add(value);

    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      visit(nestedValue, nestedKey);
    }
  };

  visit(args);
  return Array.from(results).slice(0, GRAPH_ENRICHMENT_NEIGHBOR_LIMIT);
}

function buildDispatchGraphContext(
  filePaths: string[],
  deadlineMs: number,
): Omit<DispatchGraphContextMeta, 'latencyMs'> {
  const files: GraphContextFileSummary[] = [];

  for (const filePath of filePaths) {
    if (Date.now() >= deadlineMs) {
      break;
    }

    const outline = graphDb.queryOutline(filePath).slice(0, GRAPH_ENRICHMENT_OUTLINE_LIMIT);
    const neighbors = new Map<string, {
      relationTypes: Set<string>;
      symbols: GraphContextNeighborSummary['symbols'];
    }>();

    for (const node of outline) {
      if (Date.now() >= deadlineMs) {
        break;
      }

      for (const entry of graphDb.queryEdgesFrom(node.symbolId)) {
        if (Date.now() >= deadlineMs) {
          break;
        }

        const neighborNode = entry.targetNode;
        if (!neighborNode || neighborNode.filePath === filePath) {
          continue;
        }

        let bucket = neighbors.get(neighborNode.filePath);
        if (!bucket) {
          bucket = { relationTypes: new Set<string>(), symbols: [] };
          neighbors.set(neighborNode.filePath, bucket);
        }

        bucket.relationTypes.add(entry.edge.edgeType);
        if (bucket.symbols.length < GRAPH_ENRICHMENT_SYMBOL_LIMIT) {
          bucket.symbols.push({
            name: neighborNode.fqName,
            kind: neighborNode.kind,
            line: neighborNode.startLine,
            direction: 'outgoing',
            relation: entry.edge.edgeType,
          });
        }
      }

      for (const entry of graphDb.queryEdgesTo(node.symbolId)) {
        if (Date.now() >= deadlineMs) {
          break;
        }

        const neighborNode = entry.sourceNode;
        if (!neighborNode || neighborNode.filePath === filePath) {
          continue;
        }

        let bucket = neighbors.get(neighborNode.filePath);
        if (!bucket) {
          bucket = { relationTypes: new Set<string>(), symbols: [] };
          neighbors.set(neighborNode.filePath, bucket);
        }

        bucket.relationTypes.add(entry.edge.edgeType);
        if (bucket.symbols.length < GRAPH_ENRICHMENT_SYMBOL_LIMIT) {
          bucket.symbols.push({
            name: neighborNode.fqName,
            kind: neighborNode.kind,
            line: neighborNode.startLine,
            direction: 'incoming',
            relation: entry.edge.edgeType,
          });
        }
      }
    }

    files.push({
      filePath,
      outline: outline.map((node) => ({
        name: node.fqName,
        kind: node.kind,
        line: node.startLine,
      })),
      neighbors: Array.from(neighbors.entries())
        .map(([neighborPath, summary]) => ({
          filePath: neighborPath,
          relationTypes: Array.from(summary.relationTypes).sort(),
          symbols: summary.symbols,
        }))
        .sort((left, right) => right.symbols.length - left.symbols.length)
        .slice(0, GRAPH_ENRICHMENT_NEIGHBOR_LIMIT),
    });
  }

  return {
    status: 'ok',
    source: 'tool-dispatch',
    fileCount: files.length,
    filePaths,
    files,
  };
}

async function resolveDispatchGraphContext(
  toolName: string,
  args: Record<string, unknown>,
): Promise<DispatchGraphContextMeta | null> {
  if (GRAPH_CONTEXT_EXCLUDED_TOOLS.has(toolName)) {
    return null;
  }

  const filePaths = extractFilePathsFromToolArgs(args);
  if (filePaths.length === 0) {
    return null;
  }

  const startedAt = Date.now();
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const buildPromise = new Promise<DispatchGraphContextMeta>((resolve) => {
    queueMicrotask(() => {
      try {
        const context = buildDispatchGraphContext(
          filePaths,
          startedAt + GRAPH_ENRICHMENT_TIMEOUT_MS,
        );

        if (Date.now() - startedAt >= GRAPH_ENRICHMENT_TIMEOUT_MS) {
          return;
        }

        resolve({
          ...context,
          latencyMs: Date.now() - startedAt,
        });
      } catch (error: unknown) {
        resolve({
          status: 'unavailable',
          source: 'tool-dispatch',
          fileCount: filePaths.length,
          filePaths,
          latencyMs: Date.now() - startedAt,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  });

  const timeoutPromise = new Promise<DispatchGraphContextMeta>((resolve) => {
    timeoutHandle = setTimeout(() => {
      resolve({
        status: 'timeout',
        source: 'tool-dispatch',
        fileCount: filePaths.length,
        filePaths,
        latencyMs: Date.now() - startedAt,
      });
    }, GRAPH_ENRICHMENT_TIMEOUT_MS);
  });

  const graphContext = await Promise.race([buildPromise, timeoutPromise]);
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }
  return graphContext;
}

function injectSessionPrimeHints(
  envelope: Record<string, unknown>,
  meta: Record<string, unknown>,
  sessionPrimeContext: AutoSurfaceResult,
): void {
  const hints = Array.isArray(envelope.hints)
    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
    : [];
  envelope.hints = hints;

  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
    ? sessionPrimeContext.constitutional.length
    : 0;
  const codeGraphStatus = sessionPrimeContext.codeGraphStatus;
  const codeGraphState = codeGraphStatus?.status === 'ok'
    ? 'loaded code graph status'
    : 'code graph status unavailable';

  hints.push(
    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`
  );

  // T018: Include Prime Package hints for non-hook CLIs
  const pkg = sessionPrimeContext.primePackage;
  if (pkg) {
    if (pkg.specFolder) {
      hints.push(`Active spec folder: ${pkg.specFolder}`);
    }
    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
    if (pkg.recommendedCalls.length > 0) {
      hints.push(`Recommended next calls: ${pkg.recommendedCalls.join(', ')}`);
    }
  }

  meta.sessionPriming = sessionPrimeContext;
}

async function getMemoryStats(): Promise<DynamicMemoryStats> {
  try {
    const response = await handleMemoryStats({
      folderRanking: 'count',
      includeArchived: true,
      limit: 100,
    });
    const payload = response?.content?.[0]?.text;
    if (typeof payload !== 'string' || payload.length === 0) {
      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
    }

    const parsed = JSON.parse(payload) as Record<string, unknown>;
    const data = (parsed.data ?? {}) as Record<string, unknown>;
    const byStatus = (data.byStatus ?? {}) as Record<string, unknown>;
    const topFolders = Array.isArray(data.topFolders) ? data.topFolders : [];
    const success = typeof byStatus.success === 'number' ? byStatus.success : 0;
    const pending = typeof byStatus.pending === 'number' ? byStatus.pending : 0;
    const failed = typeof byStatus.failed === 'number' ? byStatus.failed : 0;
    const retry = typeof byStatus.retry === 'number' ? byStatus.retry : 0;
    const totalSpecFolders = typeof data.totalSpecFolders === 'number'
      ? data.totalSpecFolders
      : topFolders.length;

    return {
      totalMemories: typeof data.totalMemories === 'number' ? data.totalMemories : 0,
      specFolderCount: totalSpecFolders,
      activeCount: success,
      staleCount: pending + failed + retry,
    };
  } catch (_error: unknown) {
    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
  }
}

// (CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
// This is by design — instruction updates require MCP protocol re-negotiation which most clients
// Don't support. If index changes significantly, restart the server to refresh instructions.
async function buildServerInstructions(): Promise<string> {
  if (!isDynamicInitEnabled()) {
    return '';
  }

  const stats = await getMemoryStats();
  const channels: string[] = ['vector', 'fts5'];
  if (bm25Index.isBm25Enabled()) channels.push('bm25');
  if (isGraphUnifiedEnabled()) channels.push('graph');
  if (isDegreeBoostEnabled()) channels.push('degree');
  const staleWarning = stats.staleCount > 10
    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
    : '';

  const lines = [
    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
    `Search channels: ${channels.join(', ')}.`,
    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
    staleWarning.trim(),
  ];

  // Phase 024 / Item 4: Session recovery digest from session-snapshot
  try {
    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
    const snap = getSessionSnapshot();
    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
    if (hasData) {
      const recommended = !snap.primed ? 'call session_bootstrap()' :
        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
      lines.push('');
      lines.push('## Session Recovery');
      lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
      lines.push(`- Code graph: ${snap.graphFreshness}`);
      lines.push(`- Session quality: ${snap.sessionQuality}`);
      lines.push(`- Recommended: ${recommended}`);
    }
  } catch { /* session-snapshot not available — skip digest */ }

  // Phase 027: Structural bootstrap guidance for non-hook runtimes
  lines.push('');
  lines.push('## Structural Bootstrap (Phase 027)');
  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');

  // Phase 024: Tool routing decision tree
  try {
    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');
    const snap = getSnap();
    const routingRules: string[] = [];
    if (snap.cocoIndexAvailable) {
      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
    }
    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
    }
    routingRules.push('Exact text/regex matching → Grep tool');
    if (routingRules.length > 0) {
      lines.push('');
      lines.push('## Tool Routing');
      for (const rule of routingRules) {
        lines.push(`- ${rule}`);
      }
    }
  } catch { /* tool routing snapshot unavailable — skip */ }

  return lines.filter(Boolean).join(' ');
}

/** Register a callback to be invoked asynchronously after each tool call completes. */
export function registerAfterToolCallback(fn: AfterToolCallback): void {
  afterToolCallbacks.push(fn);
}

async function invalidateReinitializedDbCaches(): Promise<void> {
  const invalidatedEntries = toolCache.clear();

  try {
    const triggerMatcher = await import('./lib/parsing/trigger-matcher.js');
    if (typeof triggerMatcher.clearCache === 'function') {
      triggerMatcher.clearCache();
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[context-server] Failed to clear trigger cache after DB reinit: ${message}`);
  }

  if (invalidatedEntries > 0) {
    console.error(`[context-server] Cleared ${invalidatedEntries} tool-cache entries after DB reinitialization`);
  }
}

/* ───────────────────────────────────────────────────────────────
   3. SERVER INITIALIZATION
──────────────────────────────────────────────────────────────── */

const server = new Server(
  { name: 'context-server', version: '1.7.2' },
  { capabilities: { tools: {} } }
);
const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };

/* ───────────────────────────────────────────────────────────────
   4. TOOL DEFINITIONS (T303: from tool-schemas.ts)
──────────────────────────────────────────────────────────────── */

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFINITIONS
}));

/* ───────────────────────────────────────────────────────────────
   5. TOOL DISPATCH (T303: routed through tools/*.ts)
──────────────────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
server.setRequestHandler(CallToolRequestSchema, async (request, _extra: unknown): Promise<any> => {
  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
  const { name } = requestParams;
  const args: Record<string, unknown> = requestParams.arguments ?? {};
  const callId = resolveToolCallId(request as { id?: unknown });
  const sessionTrackingId = resolveSessionTrackingId(args, _extra);
  if (sessionTrackingId) lastKnownSessionId = sessionTrackingId;

  try {
    // SEC-003: Validate input lengths before processing (CWE-400 mitigation)
    validateInputLengths(args);
    // T304: Zod validation is applied per-tool inside each dispatch module
    // (tools/*.ts) to avoid double-validation overhead at the server layer.

    // T018: Track last tool call timestamp for all tools except session_health.
    if (name !== 'session_health') {
      recordToolCall(sessionTrackingId);

      // Phase 023: Record metric event for context quality tracking
      recordMetricEvent({ kind: 'tool_call', toolName: name });
    }
    // Classify specific tool calls for finer-grained metrics
    if (name === 'memory_context' && args.mode === 'resume') {
      recordMetricEvent({ kind: 'memory_recovery' });
    }
    if (name.startsWith('code_graph_')) {
      recordMetricEvent({ kind: 'code_graph_query' });
    }
    if (typeof args.specFolder === 'string' && args.specFolder) {
      recordMetricEvent({ kind: 'spec_folder_change', specFolder: args.specFolder as string });
    }

    const dbReinitialized = await checkDatabaseUpdated();
    if (dbReinitialized) {
      await invalidateReinitializedDbCaches();
    }

    let sessionPrimeContext: AutoSurfaceResult | null = null;
    try {
      sessionPrimeContext = await primeSessionIfNeeded(
        name,
        args,
        sessionTrackingId,
      );
    } catch (primeErr: unknown) {
      const msg = primeErr instanceof Error ? primeErr.message : String(primeErr);
      console.error(`[context-server] Session priming failed (non-fatal): ${msg}`);
    }

    // SK-004/TM-05: Auto-surface memories before dispatch (after validation)
    let autoSurfacedContext: AutoSurfaceResult | null = null;
    const isCompactionLifecycleCall =
      name === 'memory_context' && args.mode === 'resume';

    const autoSurfaceStart = Date.now();
    if (MEMORY_AWARE_TOOLS.has(name)) {
      const contextHint: string | null = extractContextHint(args);
      if (contextHint) {
        try {
          if (isCompactionLifecycleCall) {
            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
          } else {
            autoSurfacedContext = await autoSurfaceMemories(contextHint);
          }
        } catch (surfaceErr: unknown) {
          const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
          console.error(`[context-server] Auto-surface failed (non-fatal): ${msg}`);
        }
      }
    } else {
      try {
        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
      } catch (surfaceErr: unknown) {
        const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
        console.error(`[context-server] Tool-dispatch auto-surface failed (non-fatal): ${msg}`);
      }
    }
    const autoSurfaceLatencyMs = Date.now() - autoSurfaceStart;
    if (autoSurfaceLatencyMs > 250) {
      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
    }

    // Ensure database is initialized (safe no-op if already done)
    // P1-11 FIX: Module-level guard avoids redundant calls on every tool invocation
    if (!dbInitialized) {
      vectorIndex.initializeDb();
      dbInitialized = true;
    }

    // T303: Dispatch to tool modules
    const result = await dispatchTool(name, args) as ToolCallResponse | null;
    if (!result) {
      throw new Error(`Unknown tool: ${name}`);
    }

    let dispatchGraphContext: DispatchGraphContextMeta | null = null;
    if (!result.isError) {
      dispatchGraphContext = await resolveDispatchGraphContext(name, args);
    }

    runAfterToolCallbacks(name, callId, structuredClone(result));

    // REQ-014: Log follow_on_tool_use when a non-search tool is called after a recent search
    // Shadow-only: no ranking side effects. Fail-safe, never throws.
    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
      try {
        const { logFollowOnToolUse } = await import('./lib/feedback/query-flow-tracker.js');
        const { requireDb } = await import('./utils/index.js');
        const db = (() => { try { return requireDb(); } catch { return null; } })();
        const followOnSessionId = sessionTrackingId ?? lastKnownSessionId;
        if (db && followOnSessionId) {
          logFollowOnToolUse(db, followOnSessionId);
        }
      } catch { /* follow_on_tool_use logging must never break dispatch */ }
    }

    // Phase 024: Code-search redirect hint for memory tools
    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
      const queryStr = typeof args.query === 'string' ? args.query : typeof args.input === 'string' ? args.input : '';
      const codeSearchPattern = /\b(find code|implementation of|function that|where is|how does .+ work|class that|method for)\b/i;
      if (queryStr && codeSearchPattern.test(queryStr)) {
        try {
          const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
          if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
            const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
            envelope.hints = existingHints;
            result.content[0].text = JSON.stringify(envelope, null, 2);
          }
        } catch {
          // Response is not JSON envelope — skip hint injection
        }
      }
    }

    // F057: Passive context enrichment pipeline — adds code graph symbols
    // near mentioned file paths and session continuity warnings.
    if (result && !result.isError && result.content?.[0]?.text) {
      try {
        const { runPassiveEnrichment } = await import('./lib/enrichment/passive-enrichment.js');
        const enrichment = await runPassiveEnrichment(result.content[0].text);
        if (!enrichment.skipped && enrichment.hints.length > 0) {
          try {
            const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
            if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
              const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
              envelope.hints = [...existingHints, ...enrichment.hints];
              result.content[0].text = JSON.stringify(envelope, null, 2);
            }
          } catch {
            // Response is not JSON envelope — skip enrichment injection
          }
        }
      } catch (enrichErr: unknown) {
        // Passive enrichment is strictly non-fatal
        const msg = enrichErr instanceof Error ? enrichErr.message : String(enrichErr);
        console.warn(`[context-server] Passive enrichment failed (non-fatal): ${msg}`);
      }
    }

    // SK-004: Inject auto-surface hints before token-budget enforcement so
    // The final envelope metadata reflects the fully decorated response.
    if (autoSurfacedContext && result && !result.isError) {
      appendAutoSurfaceHints(result, autoSurfacedContext);
    }

    // Token Budget Hybrid: Inject tokenBudget into response metadata (CHK-072)
    // T205: Enforce per-layer token budgets with actual truncation
    if (result && result.content && result.content[0]?.text) {
      try {
        const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
        if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
          const metaValue = envelope.meta;
          const meta = isRecord(metaValue)
            ? metaValue as Record<string, unknown>
            : {};
          const dataValue = envelope.data;
          const data = isRecord(dataValue)
            ? dataValue as Record<string, unknown>
            : null;
          envelope.meta = meta;
          if (sessionPrimeContext && !result.isError) {
            injectSessionPrimeHints(envelope, meta, sessionPrimeContext);
          }
          if (autoSurfacedContext && !result.isError) {
            meta.autoSurfacedContext = autoSurfacedContext;
          }
          if (dispatchGraphContext && !result.isError) {
            meta.graphContext = dispatchGraphContext;
          }
          const budget = getTokenBudget(name);
          meta.tokenBudget = budget;
          syncEnvelopeTokenCount(envelope);

          if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
            console.error(`[token-budget] ${name} response (${meta.tokenCount} tokens) exceeds budget (${budget})`);

            // T205: Attempt to truncate results array to fit within budget
            const innerResults = data?.results;
            if (Array.isArray(innerResults) && innerResults.length > 1) {
              const originalCount = innerResults.length;
              // Results are typically sorted by score (highest first)
              // Remove from end (lowest-scored) until within budget
              while (innerResults.length > 1) {
                innerResults.pop();
                // P1-06 FIX: Recalculate token count from the full envelope
                // (not just results) so trace metadata is included in the budget.
                syncEnvelopeTokenCount(envelope);
                if (typeof meta.tokenCount === 'number' && meta.tokenCount <= budget) break;
              }
              if (data && data.count !== undefined) {
                data.count = innerResults.length;
              }
              if (Array.isArray(envelope.hints)) {
                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
              }
              meta.tokenBudgetTruncated = true;
              meta.originalResultCount = originalCount;
              meta.returnedResultCount = innerResults.length;
            } else {
              // No truncatable results array — add warning hint only
              if (Array.isArray(envelope.hints)) {
                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
              }
            }
          }
          result.content[0].text = serializeEnvelopeWithTokenCount(envelope);
        }
      } catch (_parseErr: unknown) {
        // Non-JSON response, skip token budget injection
      }
    }

    return result;
  } catch (error: unknown) {
    // REQ-004: Include recovery hints in all error responses
    const err = error instanceof Error ? error : new Error(String(error));
    try {
      const errorResponse = buildErrorResponse(name, err, args);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return wrapForMCP(errorResponse as any, true);
    } catch (wrapError: unknown) {
      const fallbackError = wrapError instanceof Error ? wrapError.message : String(wrapError);
      console.error(`[context-server] Failed to build MCP error envelope for '${name}': ${fallbackError}`);
      const fallbackCode = getDefaultErrorCodeForTool(name);
      return createMCPErrorResponse({
        tool: name,
        error: 'Request failed.',
        code: fallbackCode,
        recovery: getRecoveryHint(name, fallbackCode),
      });
    }
  }
});

/* ───────────────────────────────────────────────────────────────
   6. STARTUP SCAN & PENDING FILE RECOVERY
──────────────────────────────────────────────────────────────── */

let startupScanInProgress = false;

function getStartupWorkspaceRoots(basePath: string): string[] {
  const configuredMemoryRoot = process.env.MEMORY_BASE_PATH?.trim();
  const derivedMemoryRoot = configuredMemoryRoot ? path.resolve(process.cwd(), configuredMemoryRoot) : null;
  return Array.from(new Set(
    [basePath, derivedMemoryRoot, ...ALLOWED_BASE_PATHS]
      .filter((root): root is string => typeof root === 'string' && root.trim().length > 0)
      .map((root) => path.resolve(root))
  ));
}

function getPendingRecoveryLocations(basePath: string): string[] {
  const scanLocations: string[] = [];
  for (const root of getStartupWorkspaceRoots(basePath)) {
    scanLocations.push(path.join(root, 'specs'));
    scanLocations.push(path.join(root, '.opencode', 'specs'));
    const skillDir = path.join(root, '.opencode', 'skill');
    try {
      if (!fs.existsSync(skillDir)) continue;
      for (const entry of fs.readdirSync(skillDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
        const constDir = path.join(skillDir, entry.name, 'constitutional');
        if (fs.existsSync(constDir)) scanLocations.push(constDir);
      }
    } catch (_error: unknown) {
      // Non-fatal: constitutional directory discovery failed
    }
  }
  return Array.from(new Set(scanLocations.filter((location) => fs.existsSync(location))));
}

/**
 * T107: Recover pending memory files on MCP startup.
 * CHK-188: Pending files processed by recovery job on next startup.
 *
 * Scans for files with _pending suffix (created when index failed after file write)
 * and attempts to index them.
 */
async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
  console.error('[context-server] Checking for pending memory files...');

  try {
    // BUG-028 FIX: Restrict scan to known memory file locations to prevent OOM when scanning large workspaces.
    // P1-002-SCAN: share the same allowed-root expansion that startup indexing uses.
    const existingScanLocations = getPendingRecoveryLocations(basePath);

    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
    // VectorIndex.getDb() is an initializing accessor — always returns a valid DB after initializeDb().
    const database = vectorIndex.getDb();
    const isCommittedInDb = (originalPath: string): boolean => {
      const row = (database.prepare('SELECT 1 FROM memory_index WHERE file_path = ?') as import('better-sqlite3').Statement).get(originalPath);
      return !!row;
    };

    const rawResults = existingScanLocations.flatMap((location) =>
      transactionManager.recoverAllPendingFiles(location, isCommittedInDb)
    );

    // Aggregate per-file results into a summary
    const found = rawResults.length;
    const recovered = rawResults.filter(r => r.recovered).length;
    const failed = found - recovered;

    const recoveryResult: PendingRecoveryResult = {
      found,
      processed: found,
      recovered,
      failed,
      results: rawResults,
    };

    if (recoveryResult.found > 0) {
      console.error(`[context-server] Pending file recovery: ${recoveryResult.recovered} recovered, ${recoveryResult.failed} failed (${recoveryResult.found} total)`);
    } else {
      console.error('[context-server] No pending memory files found');
    }

    return recoveryResult;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[context-server] Pending file recovery error: ${message}`);
    return { found: 0, processed: 0, recovered: 0, failed: 0, results: [] };
  }
}

async function startupScan(basePath: string): Promise<void> {
  if (startupScanInProgress) {
    console.error('[context-server] Startup scan already in progress, skipping');
    return;
  }

  startupScanInProgress = true;
  try {
    console.error('[context-server] Waiting for embedding model to be ready...');
    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);

    if (!modelReady) {
      console.error('[context-server] Startup scan skipped: embedding model not ready');
      console.error('[context-server] Run memory_index_scan manually after model loads');
      return;
    }

    // T107: Recover any pending files from previous failed index operations
    await recoverPendingFiles(basePath);

    console.error('[context-server] Starting background scan for new memory files...');
    const scanRoots = Array.from(
      new Set(
        [basePath, ...ALLOWED_BASE_PATHS]
          .filter((root): root is string => typeof root === 'string' && root.trim().length > 0)
          .map((root) => path.resolve(root))
      )
    );
    const allFiles: string[] = [];
    const seen = new Set<string>();

    for (const root of scanRoots) {
      try {
        const rootFiles = [
          ...memoryParser.findMemoryFiles(root),
          ...memoryIndexDiscovery.findConstitutionalFiles(root),
          ...memoryIndexDiscovery.findSpecDocuments(root),
        ];

        for (const filePath of rootFiles) {
          const resolved = path.resolve(filePath);
          if (!seen.has(resolved)) {
            seen.add(resolved);
            allFiles.push(filePath);
          }
        }
      } catch (_error: unknown) {
        // Non-fatal: skip inaccessible startup roots.
      }
    }

    if (allFiles.length === 0) {
      console.error('[context-server] No memory files found in workspace');
      return;
    }

    console.error(`[context-server] Found ${allFiles.length} memory files, checking for changes...`);
    let indexed = 0, updated = 0, unchanged = 0, failed = 0;

    for (const filePath of allFiles) {
      try {
        const result: IndexResult = await indexSingleFile(filePath, false);
        if (result.status === 'indexed') indexed++;
        else if (result.status === 'updated') updated++;
        else unchanged++;
      } catch (error: unknown) {
        failed++;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${message}`);
      }
    }

    if (indexed > 0 || updated > 0) {
      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
    } else {
      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
    }

    if (indexed > 0 || updated > 0) {
      try {
        runPostMutationHooks('scan', {
          indexed,
          updated,
          staleDeleted: 0,
          staleDeleteFailed: 0,
          operation: 'startup-scan',
        });
      } catch (_error: unknown) {
        // Non-fatal: startup scan must continue even if invalidation hooks fail.
      }
    }

    // Log atomicity metrics for monitoring (CHK-190)
    const metrics = transactionManager.getMetrics();
    if (metrics.totalRecoveries > 0 || metrics.totalErrors > 0) {
      console.error(`[context-server] Atomicity metrics: ${metrics.totalAtomicWrites} successful, ${metrics.totalErrors} failed, ${metrics.totalRecoveries} recovered`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[context-server] Startup scan error: ${message}`);
  } finally {
    startupScanInProgress = false;
  }
}

/* ───────────────────────────────────────────────────────────────
   7. GRACEFUL SHUTDOWN
──────────────────────────────────────────────────────────────── */

let shuttingDown = false;
// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
let transport: StdioServerTransport | null = null;
// P1-11 FIX: Module-level guard to avoid redundant initializeDb() calls per tool invocation
let dbInitialized = false;
let fileWatcher: FSWatcher | null = null;

/** Maximum time (ms) to wait for async cleanup before force-exiting. */
const SHUTDOWN_DEADLINE_MS = 5000;

export const __testables = {
  runCleanupStep,
  runAsyncCleanupStep,
  main: () => main(),
  normalizeGraphFilePath,
  extractFilePathsFromToolArgs,
};

async function fatalShutdown(reason: string, exitCode: number): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error(`[context-server] ${reason}`);

  runCleanupStep('sessionManager', () => sessionManager.shutdown());
  runCleanupStep('archivalManager', () => archivalManager.cleanup());
  runCleanupStep('retryManager', () => retryManager.stopBackgroundJob());
  runCleanupStep('shadowEvaluationRuntime', () => shadowEvaluationRuntime.stopShadowEvaluationScheduler());
  runCleanupStep('accessTracker', () => accessTracker.reset());
  runCleanupStep('toolCache', () => toolCache.shutdown());

  let deadlineTimer: NodeJS.Timeout | undefined;
  const cleanup = (async () => {
    await runAsyncCleanupStep('fileWatcher', async () => {
      if (fileWatcher) {
        await fileWatcher.close();
        fileWatcher = null;
      }
    });
    await runAsyncCleanupStep('local-reranker', async () => {
      await disposeLocalReranker();
    });
    runCleanupStep('vectorIndex', () => vectorIndex.closeDb());
    // P1-09 FIX: Close MCP transport on shutdown
    runCleanupStep('transport', () => {
      if (transport) {
        transport.close();
        transport = null;
      }
    });
  })();

  const timedOut = await Promise.race([
    cleanup.then(() => false),
    new Promise<boolean>((resolve) => {
      deadlineTimer = setTimeout(() => resolve(true), SHUTDOWN_DEADLINE_MS);
    }),
  ]);

  if (deadlineTimer) {
    clearTimeout(deadlineTimer);
  }

  if (timedOut) {
    console.error(`[context-server] Shutdown deadline exceeded after ${SHUTDOWN_DEADLINE_MS}ms`);
  }

  process.exit(exitCode);
}

/** Remove indexed rows for watcher delete and rename events. */
async function removeIndexedMemoriesForFile(filePath: string): Promise<void> {
  const database = vectorIndex.getDb();
  if (!database) {
    return;
  }

  const canonicalPath = getCanonicalPathKey(filePath);
  let rows: Array<{ id: number; spec_folder: string | null }> = [];

  try {
    rows = database.prepare(`
      SELECT id, spec_folder
      FROM memory_index
      WHERE canonical_file_path = ? OR file_path = ?
      ORDER BY id ASC
    `).all(canonicalPath, filePath) as Array<{ id: number; spec_folder: string | null }>;
  } catch (_error: unknown) {
    rows = database.prepare(`
      SELECT id, spec_folder
      FROM memory_index
      WHERE file_path = ?
      ORDER BY id ASC
    `).all(filePath) as Array<{ id: number; spec_folder: string | null }>;
  }

  let deletedCount = 0;
  for (const row of rows) {
    if (typeof row.id === 'number') {
      if (vectorIndex.deleteMemory(row.id)) {
        deletedCount += 1;
        // Record DELETE history only after confirmed deletion.
        try {
          recordHistory(row.id, 'DELETE', filePath ?? null, null, 'mcp:file_watcher', row.spec_folder ?? null);
        } catch (_histErr: unknown) {
          // History recording is best-effort in file-watcher path
        }
      }
    }
  }

  if (deletedCount > 0) {
    try {
      runPostMutationHooks('delete', { filePath, deletedCount });
    } catch (_error: unknown) {
      // Non-throwing by design: file-watcher path must not crash the server.
    }
  }
}

process.on('SIGTERM', () => {
  void fatalShutdown('Received SIGTERM, shutting down...', 0);
});
process.on('SIGINT', () => {
  void fatalShutdown('Received SIGINT, shutting down...', 0);
});

process.on('uncaughtException', (err: Error) => {
  void fatalShutdown(`Uncaught exception: ${err.stack ?? err.message}`, 1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  void fatalShutdown(
    `Unhandled rejection at: ${String(promise)} reason: ${reason instanceof Error ? reason.stack ?? reason.message : String(reason)}`,
    1,
  );
});

/* ───────────────────────────────────────────────────────────────
   8. MAIN
──────────────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  // Node version mismatch detection (non-blocking)
  detectNodeVersionMismatch();
  detectedRuntime = detectRuntime();
  console.error(
    `[context-server] Detected runtime: ${detectedRuntime.runtime} (hookPolicy=${detectedRuntime.hookPolicy})`,
  );

  validateConfiguredEmbeddingsProvider();

  // T087-T090: Pre-Flight API Key Validation (REQ-029)
  // Validates API key at startup to fail fast with actionable error messages
  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
  let startupEmbeddingConfig: Awaited<ReturnType<typeof resolveStartupEmbeddingConfig>> | null = null;
  if (process.env.SPECKIT_SKIP_API_VALIDATION !== 'true') {
    console.error('[context-server] Validating embedding API key...');
    try {
      startupEmbeddingConfig = await resolveStartupEmbeddingConfig({ timeout: API_KEY_VALIDATION_TIMEOUT_MS });
      const validation: ApiKeyValidation = startupEmbeddingConfig.validation;

      if (!validation.valid) {
        if (validation.networkError) {
          // Transient network failure — warn and continue, validation will occur on first use
          console.warn('[context-server] ===== API KEY VALIDATION SKIPPED (network error) =====');
          console.warn(`[context-server] Provider: ${validation.provider}`);
          console.warn(`[context-server] Error: ${validation.error}`);
          if (validation.actions) {
            console.warn('[context-server] Recovery Actions:');
            validation.actions.forEach((action: string, i: number) => {
              console.warn(`[context-server]   ${i + 1}. ${action}`);
            });
          }
          console.warn('[context-server] Continuing startup — validation will occur on first use');
        } else {
          console.error('[context-server] ===== API KEY VALIDATION FAILED =====');
          console.error(`[context-server] Provider: ${validation.provider}`);
          console.error(`[context-server] Error: ${validation.error}`);
          console.error(`[context-server] Error Code: ${validation.errorCode || 'E050'}`);
          if (validation.actions) {
            console.error('[context-server] Recovery Actions:');
            validation.actions.forEach((action: string, i: number) => {
              console.error(`[context-server]   ${i + 1}. ${action}`);
            });
          }
          console.error('[context-server] =====================================');
          console.error('[context-server] FATAL: Cannot start MCP server with invalid API key');
          console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
          process.exit(1);
        }
      }

      if (validation.warning) {
        console.warn(`[context-server] API key warning: ${validation.warning}`);
      }

      if (validation.valid) {
        console.error(`[context-server] API key validated (provider: ${validation.provider})`);
      }
    } catch (validationError: unknown) {
      const message = validationError instanceof Error ? validationError.message : String(validationError);
      console.error(`[context-server] API key validation error: ${message}`);
      console.error('[context-server] Continuing startup - validation will occur on first use');
    }
  } else {
    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
  }

  if (!process.env.EMBEDDING_DIM) {
    process.env.EMBEDDING_DIM = String(
      startupEmbeddingConfig?.dimension ?? getStartupEmbeddingDimension(),
    );
  }

  console.error('[context-server] Initializing database...');
  vectorIndex.initializeDb();
  dbInitialized = true;
  console.error('[context-server] Database initialized');
  console.error('[context-server] Database path: ' + DATABASE_PATH);

  // Initialize db-state module with dependencies
  // P4-12/P4-19 FIX: Pass sessionManager and incrementalIndex so db-state can
  // Refresh their DB handles during reinitializeDatabase(), preventing stale refs.
  initDbState({
    vectorIndex,
    checkpoints: checkpointsLib,
    accessTracker,
    hybridSearch,
    sessionManager,
    incrementalIndex,
    dbConsumers: [
      sessionBoost,
      causalBoost,
      historyStore,
      workingMemory,
      attentionDecay,
      coActivation,
      archivalManager,
    ],
  });

  // T016-T019: Lazy loading only. The eager warmup gate remains hard-disabled
  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
  // Mark embedding as "ready" since it will self-initialize on first use
  setEmbeddingModelReady(true);

  // Integrity check and module initialization
  try {
    const report = vectorIndex.verifyIntegrity();
    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);

    // Validate embedding dimension matches database
    const dimValidation = vectorIndex.validateEmbeddingDimension();
    if (!dimValidation.valid) {
      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
      console.error(`[context-server] ${dimValidation.warning}`);
      console.error(`[context-server] =========================================`);
      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
      throw new Error(dimValidation.warning ?? 'Embedding dimension mismatch between provider and database');
    } else if (dimValidation.stored) {
      console.error(`[context-server] Embedding dimension validated: ${dimValidation.stored}`);
    }

    const database = vectorIndex.getDb();
    if (!database) {
      throw new Error('Database not initialized after initializeDb(). Cannot start server.');
    }

    try {
      initScoringObservability(database);
      console.error('[context-server] Scoring observability initialized');
    } catch (scoringObsErr: unknown) {
      const message = scoringObsErr instanceof Error ? scoringObsErr.message : String(scoringObsErr);
      console.warn('[context-server] Scoring observability init failed (non-fatal):', message);
    }

    if (isLearnedFeedbackEnabled()) {
      try {
        const migrated = migrateLearnedTriggers(database);
        const isolated = verifyFts5Isolation(database);
        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
      } catch (learnedErr: unknown) {
        const message = learnedErr instanceof Error ? learnedErr.message : String(learnedErr);
        throw new Error(`[context-server] Learned feedback migration/isolation failed: ${message}`);
      }
    }

    // Check SQLite version meets minimum requirement (3.35.0+)
    checkSqliteVersion(database);

    // T076: Verify WAL mode is active for operational concurrency guarantees.
    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
    if (journalMode !== 'wal') {
      database.pragma('journal_mode = WAL');
      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
    }

    const memoryCountRow = database.prepare('SELECT COUNT(*) as cnt FROM memory_index').get() as { cnt?: number } | undefined;
    const memoryCount = Number(memoryCountRow?.cnt ?? 0);
    let projectionCount = 0;
    let projectionTableExists = true;

    try {
      const projectionCountRow = database.prepare('SELECT COUNT(*) as cnt FROM active_memory_projection').get() as { cnt?: number } | undefined;
      projectionCount = Number(projectionCountRow?.cnt ?? 0);
    } catch {
      projectionTableExists = false;
    }

    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);

    if (memoryCount > 0 && (!projectionTableExists || projectionCount === 0)) {
      const result = runLineageBackfill(database);
      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
    }

    if (memoryCount === 0 && projectionCount === 0) {
      console.error('[context-server] WARNING: Database has 0 memories — search will return no results until memories are saved');
    }

    const graphSearchFn = isGraphUnifiedEnabled()
      ? createUnifiedGraphSearchFn(database)
      : null;

    checkpointsLib.init(database);
    accessTracker.init(database);
    hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);

    // Keep db-state reinitialization wiring aligned with startup search wiring.
    initDbState({ graphSearchFn });
    sessionBoost.init(database);
    causalBoost.init(database);
    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');

    // P3-04: Rebuild BM25 index from database on startup
    if (bm25Index.isBm25Enabled()) {
      try {
        const bm25 = bm25Index.getIndex();
        const count = bm25.rebuildFromDatabase(database);
        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
      } catch (bm25Err: unknown) {
        const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
        console.warn('[context-server] BM25 index rebuild failed:', message);
      }
    }

    // Cognitive memory modules
    try {
      workingMemory.init(database);
      attentionDecay.init(database);
      coActivation.init(database);
      console.error('[context-server] Cognitive memory modules initialized');
      console.error(`[context-server] Working memory: ${workingMemory.isEnabled()}, Co-activation: ${coActivation.isEnabled()}`);
    } catch (cognitiveErr: unknown) {
      const message = cognitiveErr instanceof Error ? cognitiveErr.message : String(cognitiveErr);
      console.warn('[context-server] Cognitive modules partially failed:', message);
    }

    try {
      initExtractionAdapter(database, registerAfterToolCallback);
      console.error('[context-server] Extraction adapter initialized');
    } catch (extractionErr: unknown) {
      const message = extractionErr instanceof Error ? extractionErr.message : String(extractionErr);
      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
    }

    // T059: Archival Manager for automatic archival of ARCHIVED state memories
    try {
      archivalManager.init(database);
      // Start background archival job (scans every hour by default)
      archivalManager.startBackgroundJob();
      if (archivalManager.isBackgroundJobRunning()) {
        console.error(`[context-server] Archival manager initialized (background job started)`);
      } else {
        console.error(`[context-server] Archival manager initialized (background job: not started)`);
      }
    } catch (archivalErr: unknown) {
      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);
      console.warn('[context-server] Archival manager failed:', message);
    }

    // T099: Background retry job for pending embeddings (REQ-031, CHK-179)
    // Processes memories with failed embeddings in the background
    try {
      const retryJobResult = retryManager.startBackgroundJob({
        intervalMs: 5 * 60 * 1000,  // Check every 5 minutes
        batchSize: 5,               // Process up to 5 pending items per run
      });
      if (retryJobResult) {
        console.error('[context-server] Background retry job started (interval: 5min, batch: 5)');
      } else {
        console.error('[context-server] Background retry job already running or disabled');
      }
    } catch (retryErr: unknown) {
      const message = retryErr instanceof Error ? retryErr.message : String(retryErr);
      console.warn('[context-server] Background retry job failed to start:', message);
    }

    // REQ-D4-006: Shadow feedback holdout evaluation background scheduler.
    // Replays recent production queries through a shadow-only path once the
    // weekly holdout cycle is due. Fail-safe and gated by SPECKIT_SHADOW_FEEDBACK.
    try {
      const shadowSchedulerStarted = shadowEvaluationRuntime.startShadowEvaluationScheduler(database);
      if (shadowSchedulerStarted) {
        console.error('[context-server] Shadow feedback evaluation scheduler started');
      } else {
        console.error('[context-server] Shadow feedback evaluation scheduler not started (already running or disabled)');
      }
    } catch (shadowEvalErr: unknown) {
      const message = shadowEvalErr instanceof Error ? shadowEvalErr.message : String(shadowEvalErr);
      console.warn('[context-server] Shadow feedback evaluation scheduler failed to start:', message);
    }

    // REQ-D4-004: Batch feedback learning — runs one cycle at startup (shadow-only, no live ranking mutations).
    // Feature-flag gated by SPECKIT_BATCH_LEARNED_FEEDBACK (default ON, graduated).
    try {
      const batchResult = runBatchLearning(database);
      if (batchResult.candidatesEvaluated > 0) {
        console.error(`[context-server] Batch learning: ${batchResult.shadowApplied} shadow-applied, ${batchResult.skippedMinSupport} skipped (min-support), window=${Math.round((batchResult.runAt - batchResult.windowStart) / 86_400_000)}d`);
      } else {
        console.error('[context-server] Batch learning: no eligible candidates in window (or flag disabled)');
      }
    } catch (batchErr: unknown) {
      const message = batchErr instanceof Error ? batchErr.message : String(batchErr);
      console.warn('[context-server] Batch learning failed (non-fatal):', message);
    }

    // T001-T004: Session deduplication module
    try {
      const sessionResult = sessionManager.init(database);
      if (sessionResult.success) {
        console.error(`[context-server] Session manager initialized (enabled: ${sessionManager.isEnabled()})`);

        // T073-T075: Crash Recovery Pattern (REQ-016)
        // Reset any sessions that were active when server last crashed
        const recoveryResult = sessionManager.resetInterruptedSessions();
        if (recoveryResult.interruptedCount > 0) {
          console.error(`[context-server] Crash recovery: marked ${recoveryResult.interruptedCount} sessions as interrupted`);
          // Log interrupted sessions for visibility
          const interrupted = sessionManager.getInterruptedSessions();
          if (interrupted.sessions && interrupted.sessions.length > 0) {
            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
          }
        }
      } else {
        console.warn('[context-server] Session manager initialization returned:', sessionResult.error);
      }
    } catch (sessionErr: unknown) {
      const message = sessionErr instanceof Error ? sessionErr.message : String(sessionErr);
      console.warn('[context-server] Session manager failed:', message);
    }

    // P0-3: Async ingestion job queue initialization + crash recovery reset.
    try {
      const ingestInit = initIngestJobQueue({
        processFile: async (filePath: string) => {
          await indexSingleFile(filePath, false);
        },
      });
      if (ingestInit.resetCount > 0) {
        console.error(`[context-server] Ingest crash recovery reset ${ingestInit.resetCount} incomplete job(s) to queued`);
      }
    } catch (ingestInitErr: unknown) {
      const message = ingestInitErr instanceof Error ? ingestInitErr.message : String(ingestInitErr);
      console.warn('[context-server] Ingest queue init failed:', message);
    }

    // P1-7: Optional real-time markdown watcher for automatic re-indexing.
    if (isFileWatcherEnabled()) {
      try {
        const watchPaths = getSpecsBasePaths(DEFAULT_BASE_PATH);
        if (watchPaths.length > 0) {
          fileWatcher = startFileWatcher({
            paths: watchPaths,
            reindexFn: async (filePath: string) => {
              const result = await indexSingleFile(filePath, false);
              if (isMutationStatus(result.status)) {
                try {
                  runPostMutationHooks('scan', {
                    indexed: result.status === 'indexed' || result.status === 'deferred' ? 1 : 0,
                    updated: result.status === 'updated' || result.status === 'reinforced' ? 1 : 0,
                    staleDeleted: 0,
                    staleDeleteFailed: 0,
                    operation: 'file-watcher-reindex',
                    filePath,
                    status: result.status,
                  });
                } catch (_error: unknown) {
                  // Non-fatal by design for file-watcher callback path.
                }
              }
            },
            removeFn: async (filePath: string) => {
              await removeIndexedMemoriesForFile(filePath);
            },
          });
          console.error(`[context-server] File watcher started for ${watchPaths.length} path(s)`);
        } else {
          console.warn('[context-server] File watcher enabled, but no spec directories were found');
        }
      } catch (watchErr: unknown) {
        const message = watchErr instanceof Error ? watchErr.message : String(watchErr);
        console.warn('[context-server] File watcher startup failed:', message);
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[context-server] Integrity check failed:', message);
    throw err instanceof Error ? err : new Error(message);
  }

  // P1-09: Assign to module-level transport (not const) so shutdown handlers can close it
  if (isDynamicInitEnabled()) {
    try {
      const dynamicInstructions = await buildServerInstructions();
      if (dynamicInstructions.length > 0) {
        serverWithInstructions.setInstructions?.(dynamicInstructions);
      }
    } catch (instructionErr: unknown) {
      const message = instructionErr instanceof Error ? instructionErr.message : String(instructionErr);
      console.warn('[context-server] Dynamic instructions init failed (non-fatal):', message);
    }
  }

  transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[context-server] Context MCP server running on stdio');

  // Background startup scan
  setImmediate(() => startupScan(DEFAULT_BASE_PATH));
}

const isMain = process.argv[1] && decodeURIComponent(import.meta.url).endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMain) {
  main().catch((err: unknown) => { console.error('[context-server] Fatal error:', err); process.exit(1); });
}
