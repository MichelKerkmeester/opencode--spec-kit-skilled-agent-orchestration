// ────────────────────────────────────────────────────────────────
// 1. CONTEXT SERVER 
// ────────────────────────────────────────────────────────────────
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
  setEmbeddingModelReady, waitForEmbeddingModel,
  init as initDbState
} from './core';

// T303: Tool schemas and dispatch
import { TOOL_DEFINITIONS } from './tool-schemas';
import { dispatchTool } from './tools';

// Handler modules (only indexSingleFile needed directly for startup scan)
import {
  indexSingleFile,
  handleMemoryStats,
} from './handlers';
import { runPostMutationHooks } from './handlers/mutation-hooks';

// Utils
import { validateInputLengths } from './utils';

// History (audit trail for file-watcher deletes)
import { recordHistory } from './lib/storage/history';

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
} from './hooks';

// Architecture
import { getTokenBudget } from './lib/architecture/layer-definitions';

// T303: Startup checks (extracted from this file)
import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks';

// Lib modules (for initialization only)
import * as vectorIndex from './lib/search/vector-index';
import * as embeddings from './lib/providers/embeddings';
import * as checkpointsLib from './lib/storage/checkpoints';
import * as accessTracker from './lib/storage/access-tracker';
import * as hybridSearch from './lib/search/hybrid-search';
import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn';
import { isGraphUnifiedEnabled } from './lib/search/graph-flags';
import * as sessionBoost from './lib/search/session-boost';
import * as causalBoost from './lib/search/causal-boost';
import * as bm25Index from './lib/search/bm25-index';
import * as memoryParser from './lib/parsing/memory-parser';
import { getSpecsBasePaths } from './lib/search/folder-discovery';
import { isDegreeBoostEnabled, isFileWatcherEnabled } from './lib/search/search-flags';
import { disposeLocalReranker } from './lib/search/local-reranker';
import * as workingMemory from './lib/cache/cognitive/working-memory';
import * as attentionDecay from './lib/cache/cognitive/attention-decay';
import * as coActivation from './lib/cache/cognitive/co-activation';
import { initScoringObservability } from './lib/telemetry/scoring-observability';
// T059: Archival manager for automatic archival of ARCHIVED state memories
import * as archivalManager from './lib/cache/cognitive/archival-manager';
// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
import * as retryManager from './lib/providers/retry-manager';
import { buildErrorResponse } from './lib/errors';
// T001-T004: Session deduplication
import * as sessionManager from './lib/session/session-manager';

// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
import * as incrementalIndex from './lib/storage/incremental-index';
// T107: Transaction manager for pending file recovery on startup (REQ-033)
import * as transactionManager from './lib/storage/transaction-manager';
// KL-4: Tool cache cleanup on shutdown
import * as toolCache from './lib/cache/tool-cache';
import { initExtractionAdapter } from './lib/extraction/extraction-adapter';
import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema';
import { isLearnedFeedbackEnabled } from './lib/search/learned-feedback';
import { initIngestJobQueue } from './lib/ops/job-queue';
import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher';
import { getCanonicalPathKey } from './lib/utils/canonical-path';

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
}

interface AutoSurfaceResult { constitutional: unknown[]; triggered: unknown[]; }

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

function isMutationStatus(status: string | undefined): boolean {
  return status === 'indexed' || status === 'updated' || status === 'reinforced' || status === 'deferred';
}

let generatedCallIdCounter = 0;

function resolveToolCallId(request: { id?: unknown }): string {
  const requestId = request.id;
  if (typeof requestId === 'string' || typeof requestId === 'number') {
    return String(requestId);
  }
  generatedCallIdCounter += 1;
  return `generated-${generatedCallIdCounter}`;
}

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
  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
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

  return [
    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
    `Search channels: ${channels.join(', ')}.`,
    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
    staleWarning.trim(),
  ].filter(Boolean).join(' ');
}

/** Register a callback to be invoked asynchronously after each tool call completes. */
export function registerAfterToolCallback(fn: AfterToolCallback): void {
  afterToolCallbacks.push(fn);
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

server.setRequestHandler(CallToolRequestSchema, async (request, _extra: unknown) => {
  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
  const { name } = requestParams;
  const args: Record<string, unknown> = requestParams.arguments ?? {};
  const callId = resolveToolCallId(request as { id?: unknown });

  try {
    // SEC-003: Validate input lengths before processing (CWE-400 mitigation)
    validateInputLengths(args);
    // T304: Zod validation is applied per-tool inside each dispatch module
    // (tools/*.ts) to avoid double-validation overhead at the server layer.

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

    runAfterToolCallbacks(name, callId, result);

    // SK-004: Inject auto-surfaced context into successful responses before
    // Token-budget enforcement so metadata reflects the final envelope.
    if (autoSurfacedContext && result && !result.isError) {
      appendAutoSurfaceHints(result, autoSurfacedContext);
      result.autoSurfacedContext = autoSurfacedContext;
    }

    // Token Budget Hybrid: Inject tokenBudget into response metadata (CHK-072)
    // T205: Enforce per-layer token budgets with actual truncation
    if (result && result.content && result.content[0]?.text) {
      try {
        const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
        if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
          const metaValue = envelope.meta;
          const meta = (metaValue && typeof metaValue === 'object' && !Array.isArray(metaValue))
            ? metaValue as Record<string, unknown>
            : {};
          const dataValue = envelope.data;
          const data = (dataValue && typeof dataValue === 'object' && !Array.isArray(dataValue))
            ? dataValue as Record<string, unknown>
            : null;
          envelope.meta = meta;
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
    const errorResponse = buildErrorResponse(name, err, args);
    return {
      content: [{ type: 'text', text: JSON.stringify(errorResponse, null, 2) }],
      isError: true
    };
  }
});

/* ───────────────────────────────────────────────────────────────
   6. STARTUP SCAN & PENDING FILE RECOVERY
──────────────────────────────────────────────────────────────── */

let startupScanInProgress = false;

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
    // P1 follow-up: derive those known locations from all allowed memory roots so startup recovery matches ingest roots.
    const configuredMemoryRoot = process.env.MEMORY_BASE_PATH;
    const derivedMemoryRoot = configuredMemoryRoot && configuredMemoryRoot.trim().length > 0
      ? path.resolve(process.cwd(), configuredMemoryRoot)
      : null;
    const recoveryRoots = Array.from(
      new Set(
        [basePath, derivedMemoryRoot, ...ALLOWED_BASE_PATHS]
          .filter((root): root is string => typeof root === 'string' && root.trim().length > 0)
          .map((root) => path.resolve(root))
      )
    );

    const scanLocations: string[] = [];
    for (const root of recoveryRoots) {
      scanLocations.push(path.join(root, 'specs'));
      scanLocations.push(path.join(root, '.opencode', 'specs'));

      // Also scan constitutional directories (.opencode/skill/*/constitutional/)
      const skillDir = path.join(root, '.opencode', 'skill');
      try {
        if (fs.existsSync(skillDir)) {
          const entries = fs.readdirSync(skillDir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
              const constDir = path.join(skillDir, entry.name, 'constitutional');
              if (fs.existsSync(constDir)) {
                scanLocations.push(constDir);
              }
            }
          }
        }
      } catch (_error: unknown) {
        // Non-fatal: constitutional directory discovery failed
      }
    }

    const existingScanLocations = Array.from(
      new Set(scanLocations.filter((location) => fs.existsSync(location)))
    );

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
    const files: string[] = memoryParser.findMemoryFiles(basePath);
    if (files.length === 0) {
      console.error('[context-server] No memory files found in workspace');
      return;
    }

    console.error(`[context-server] Found ${files.length} memory files, checking for changes...`);
    let indexed = 0, updated = 0, unchanged = 0, failed = 0;

    for (const filePath of files) {
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

/** Run a shutdown cleanup step and log failures without aborting the sequence. */
function runCleanupStep(label: string, cleanupFn: () => void): void {
  try {
    cleanupFn();
  } catch (error: unknown) {
    console.error(`[context-server] ${label} cleanup failed:`, error);
  }
}

/** Await a shutdown cleanup step and log failures without aborting the sequence. */
async function runAsyncCleanupStep(label: string, cleanupFn: () => Promise<void>): Promise<void> {
  try {
    await cleanupFn();
  } catch (error: unknown) {
    console.error(`[context-server] ${label} cleanup failed:`, error);
  }
}

async function fatalShutdown(reason: string, exitCode: number): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error(`[context-server] ${reason}`);

  runCleanupStep('sessionManager', () => sessionManager.shutdown());
  runCleanupStep('archivalManager', () => archivalManager.cleanup());
  runCleanupStep('retryManager', () => retryManager.stopBackgroundJob());
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
  let rows: Array<{ id: number }> = [];

  try {
    rows = database.prepare(`
      SELECT id
      FROM memory_index
      WHERE canonical_file_path = ? OR file_path = ?
      ORDER BY id ASC
    `).all(canonicalPath, filePath) as Array<{ id: number }>;
  } catch (_error: unknown) {
    rows = database.prepare(`
      SELECT id
      FROM memory_index
      WHERE file_path = ?
      ORDER BY id ASC
    `).all(filePath) as Array<{ id: number }>;
  }

  let deletedCount = 0;
  for (const row of rows) {
    if (typeof row.id === 'number') {
      if (vectorIndex.deleteMemory(row.id)) {
        deletedCount += 1;
        // Record DELETE history only after confirmed deletion.
        try {
          recordHistory(row.id, 'DELETE', filePath ?? null, null, 'mcp:file_watcher');
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

  console.error('[context-server] Initializing database...');
  vectorIndex.initializeDb();
  dbInitialized = true;
  console.error('[context-server] Database initialized');

  // Initialize db-state module with dependencies
  // P4-12/P4-19 FIX: Pass sessionManager and incrementalIndex so db-state can
  // Refresh their DB handles during reinitializeDatabase(), preventing stale refs.
  initDbState({ vectorIndex, checkpoints: checkpointsLib, accessTracker, hybridSearch, sessionManager, incrementalIndex });

  // T087-T090: Pre-Flight API Key Validation (REQ-029)
  // Validates API key at startup to fail fast with actionable error messages
  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
  if (process.env.SPECKIT_SKIP_API_VALIDATION !== 'true') {
    console.error('[context-server] Validating embedding API key...');
    try {
      const validation: ApiKeyValidation = await embeddings.validateApiKey({ timeout: API_KEY_VALIDATION_TIMEOUT_MS });

      if (!validation.valid) {
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

      if (validation.warning) {
        console.warn(`[context-server] API key warning: ${validation.warning}`);
      }

      console.error(`[context-server] API key validated (provider: ${validation.provider})`);
    } catch (validationError: unknown) {
      const message = validationError instanceof Error ? validationError.message : String(validationError);
      console.error(`[context-server] API key validation error: ${message}`);
      console.error('[context-server] Continuing startup - validation will occur on first use');
    }
  } else {
    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
  }

  // T016-T019: Lazy Embedding Model Loading
  // Default: Skip warmup at startup for <500ms cold start
  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
  const eagerWarmup: boolean = embeddings.shouldEagerWarmup();

  if (eagerWarmup) {
    // Legacy behavior: Warm up embedding model synchronously at startup
    const WARMUP_TIMEOUT = 60000;
    let warmupCompleted = false;

    const warmupEmbedding = async (): Promise<boolean> => {
      try {
        console.error('[context-server] Warming up embedding model (eager mode)...');
        const startTime = Date.now();
        await embeddings.generateEmbedding('warmup test');
        warmupCompleted = true;
        setEmbeddingModelReady(true);
        console.error(`[context-server] Embedding model ready (${Date.now() - startTime}ms)`);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[context-server] Embedding warmup failed:', message);
        warmupCompleted = true;
        setEmbeddingModelReady(false);
        return false;
      }
    };

    await Promise.race([
      warmupEmbedding(),
      new Promise<void>(resolve => setTimeout(() => {
        if (!warmupCompleted) {
          console.warn('[context-server] Warmup timeout — marking embedding as ready to avoid undefined state');
          // P1-08 FIX: Mark embedding ready even on timeout so the system is usable
          setEmbeddingModelReady(true);
        }
        resolve();
      }, WARMUP_TIMEOUT))
    ]);
  } else {
    // T016-T019: Lazy loading - skip warmup, model loads on first use
    console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
    console.error('[context-server] Set SPECKIT_EAGER_WARMUP=true to restore eager warmup');
    // Mark embedding as "ready" since it will self-initialize on first use
    setEmbeddingModelReady(true);
  }

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
  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
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

main().catch((err: unknown) => { console.error('[context-server] Fatal error:', err); process.exit(1); });
