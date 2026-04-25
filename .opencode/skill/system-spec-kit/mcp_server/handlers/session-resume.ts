// ───────────────────────────────────────────────────────────────
// MODULE: Session Resume Handler
// ───────────────────────────────────────────────────────────────
// Phase 020: Composite MCP tool that merges memory resume context,
// code graph status, and CocoIndex availability into a single call.
// T-SRS-BND-01 (R2-P1-001): bind public session_resume sessionId input to the
// MCP transport caller context before cached-session lookups can consume it.
// Default mode is strict rejection; MCP_SESSION_RESUME_AUTH_MODE=permissive
// logs mismatches for staged canary rollout instead of rejecting immediately.

import { createHash } from 'node:crypto';
import { statSync } from 'node:fs';
import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
import * as graphDb from '../code_graph/lib/code-graph-db.js';
import { getGraphFreshness, type GraphFreshness } from '../code_graph/lib/ensure-ready.js';
import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../code_graph/lib/ops-hardening.js';
import { getCallerContext } from '../lib/context/caller-context.js';
import { loadMatchingStates, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
import { buildResumeLadder } from '../lib/resume/resume-ladder.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;
const SESSION_RESUME_AUTH_PERMISSIVE = process.env.MCP_SESSION_RESUME_AUTH_MODE === 'permissive';

export interface CachedSessionSummaryCandidate {
  schemaVersion: number;
  lastSpecFolder: string | null;
  summaryText: string | null;
  extractedAt: string | null;
  stateUpdatedAt: string | null;
  producerMetadata: HookProducerMetadata | null;
}

export interface CachedSessionSummary {
  schemaVersion: number;
  lastSpecFolder: string;
  summaryText: string;
  extractedAt: string;
  lastClaudeTurnAt: string;
  transcriptPath: string;
  transcriptFingerprint: string;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  continuityText: string;
  startupHint: string;
}

export interface CachedSessionSummaryDecision {
  status: 'accepted' | 'rejected';
  category: 'accepted' | 'fidelity' | 'freshness';
  reason:
    | 'accepted'
    | 'missing_state'
    | 'schema_mismatch'
    | 'missing_summary'
    | 'missing_producer_metadata'
    | 'missing_required_fields'
    | 'transcript_unreadable'
    | 'transcript_identity_mismatch'
    | 'stale_summary'
    | 'summary_precedes_producer_turn'
    | 'scope_mismatch'
    | 'unknown_scope';
  detail: string;
  cachedSummary: CachedSessionSummary | null;
}

interface SessionResumeArgs {
  specFolder?: string;
  sessionId?: string;
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
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract;
  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
}

interface SessionResumeMinimalResult {
  mode: 'minimal';
  codeGraph: CodeGraphStatus;
  cocoIndex: CocoIndexStatus;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext: StructuralBootstrapContract;
  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
  payloadContract: null;
  opencodeTransport: OpenCodeTransportPlan;
  graphOps: CodeGraphOpsContract;
  hints: string[];
}

interface SessionResumeTransportState {
  payloadContract?: SharedPayloadEnvelope | null;
  codeGraph: CodeGraphStatus;
  cocoIndex: CocoIndexStatus;
  structuralContext: StructuralBootstrapContract;
  structuralTrust: ReturnType<typeof buildStructuralContextTrust>;
  graphOps: CodeGraphOpsContract;
  specFolder: string | null;
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
  if (typeof specFolder !== 'string') {
    return null;
  }

  const trimmed = specFolder.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed.replace(/^\.opencode\//, '');
}

function buildMinimalResumePayload(state: SessionResumeTransportState): SharedPayloadEnvelope {
  const codeGraphCertainty: SharedPayloadCertainty = state.codeGraph.status === 'error' ? 'unknown' : 'exact';
  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
  const structuralCertainty: SharedPayloadCertainty = 'exact';

  return createSharedPayloadEnvelope({
    kind: 'resume',
    sections: [
      {
        key: 'code-graph-status',
        title: 'Code Graph Status',
        content: `status=${state.codeGraph.status}; files=${state.codeGraph.fileCount}; nodes=${state.codeGraph.nodeCount}; edges=${state.codeGraph.edgeCount}; lastScan=${state.codeGraph.lastScan ?? 'unknown'}`,
        source: 'code-graph',
        certainty: codeGraphCertainty,
      },
      {
        key: 'cocoindex-status',
        title: 'CocoIndex Status',
        content: state.cocoIndex.available
          ? `available at ${state.cocoIndex.binaryPath}`
          : `unavailable; expected at ${state.cocoIndex.binaryPath}`,
        source: 'semantic',
        certainty: cocoIndexCertainty,
      },
      {
        key: 'structural-context',
        title: 'Structural Context',
        content: state.structuralContext.summary,
        source: 'code-graph',
        certainty: structuralCertainty,
        structuralTrust: state.structuralTrust,
      },
    ],
    summary: `Minimal resume payload: ${summarizeCertaintyContract([
      { label: 'graph', certainty: codeGraphCertainty },
      { label: 'cocoindex', certainty: cocoIndexCertainty },
      { label: 'structural', certainty: structuralCertainty },
    ])}; graph=${state.codeGraph.status}; graphStatus=${state.codeGraph.status}`,
    provenance: {
      producer: 'session_resume',
      sourceSurface: 'session_resume',
      trustState: trustStateFromStructuralStatus(state.structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: state.structuralContext.provenance?.lastUpdated ?? state.codeGraph.lastScan,
      sourceRefs: ['code-graph-db', 'cocoindex-path', 'session-snapshot'],
    },
  });
}

function buildOpencodeTransport(
  state: SessionResumeTransportState,
  options: { minimal: boolean },
): OpenCodeTransportPlan {
  const resumePayload = options.minimal
    ? buildMinimalResumePayload(state)
    : state.payloadContract;

  if (!resumePayload) {
    throw new Error('OpenCode transport requires a resume payload.');
  }

  return buildOpenCodeTransportPlan({
    resumePayload,
    graphOps: state.graphOps,
    specFolder: state.specFolder,
  });
}

function parseIsoMs(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function buildTranscriptFingerprint(
  transcriptPath: string,
  sizeBytes: number,
  modifiedAtMs: number,
): string {
  return createHash('sha256')
    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
    .digest('hex')
    .slice(0, 16);
}

function rejectCachedSummary(
  category: 'fidelity' | 'freshness',
  reason: CachedSessionSummaryDecision['reason'],
  detail: string,
): CachedSessionSummaryDecision {
  return {
    status: 'rejected',
    category,
    reason,
    detail,
    cachedSummary: null,
  };
}

export function buildCachedSessionSummaryCandidate(
  state: HookState | null,
): CachedSessionSummaryCandidate | null {
  if (!state) {
    return null;
  }

  return {
    schemaVersion: state.schemaVersion ?? CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
    lastSpecFolder: state.lastSpecFolder,
    summaryText: state.sessionSummary?.text ?? null,
    extractedAt: state.sessionSummary?.extractedAt ?? null,
    stateUpdatedAt: state.updatedAt,
    producerMetadata: state.producerMetadata,
  };
}

export function evaluateCachedSessionSummaryCandidate(
  candidate: CachedSessionSummaryCandidate | null,
  options: {
    specFolder?: string;
    nowMs?: number;
    maxAgeMs?: number;
  } = {},
): CachedSessionSummaryDecision {
  if (!candidate) {
    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
  }

  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
    return rejectCachedSummary(
      'fidelity',
      'schema_mismatch',
      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
    );
  }

  const summaryText = candidate.summaryText?.trim() ?? '';
  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
    return rejectCachedSummary(
      'fidelity',
      'missing_summary',
      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
    );
  }

  const producerMetadata = candidate.producerMetadata;
  if (!producerMetadata) {
    return rejectCachedSummary(
      'fidelity',
      'missing_producer_metadata',
      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
    );
  }

  const transcript = producerMetadata.transcript;
  const cacheTokens = producerMetadata.cacheTokens;
  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
  if (
    producerTurnMs === null
    || !transcript
    || typeof transcript.path !== 'string'
    || transcript.path.trim().length === 0
    || typeof transcript.fingerprint !== 'string'
    || transcript.fingerprint.trim().length === 0
    || !isFiniteNonNegativeNumber(transcript.sizeBytes)
    || parseIsoMs(transcript.modifiedAt) === null
    || !cacheTokens
    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
  ) {
    return rejectCachedSummary(
      'fidelity',
      'missing_required_fields',
      'Producer metadata was missing required transcript identity or cache token fields.',
    );
  }

  let transcriptStat: ReturnType<typeof statSync>;
  try {
    transcriptStat = statSync(transcript.path);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return rejectCachedSummary(
      'fidelity',
      'transcript_unreadable',
      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,
    );
  }

  const expectedFingerprint = buildTranscriptFingerprint(
    transcript.path,
    transcriptStat.size,
    transcriptStat.mtimeMs,
  );
  if (
    transcript.sizeBytes !== transcriptStat.size
    || transcript.modifiedAt !== transcriptStat.mtime.toISOString()
    || transcript.fingerprint !== expectedFingerprint
  ) {
    return rejectCachedSummary(
      'fidelity',
      'transcript_identity_mismatch',
      'Transcript path, fingerprint, or file stats no longer match the persisted producer identity.',
    );
  }

  const extractedAtMs = parseIsoMs(candidate.extractedAt);
  const nowMs = options.nowMs ?? Date.now();
  const maxAgeMs = options.maxAgeMs ?? CACHED_SESSION_SUMMARY_MAX_AGE_MS;
  if (extractedAtMs === null || nowMs - extractedAtMs > maxAgeMs) {
    return rejectCachedSummary(
      'freshness',
      'stale_summary',
      `Cached summary age exceeded the freshness window of ${maxAgeMs}ms.`,
    );
  }

  if (extractedAtMs < producerTurnMs) {
    return rejectCachedSummary(
      'freshness',
      'summary_precedes_producer_turn',
      'Cached summary predates the latest producer turn metadata and is therefore invalidated.',
    );
  }

  const expectedSpecFolder = normalizeSpecFolder(options.specFolder);
  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
  if (expectedSpecFolder) {
    if (!cachedSpecFolder) {
      return rejectCachedSummary(
        'freshness',
        'unknown_scope',
        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
      );
    }

    if (cachedSpecFolder !== expectedSpecFolder) {
      return rejectCachedSummary(
        'freshness',
        'scope_mismatch',
        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
      );
    }
  } else if (!cachedSpecFolder) {
    return rejectCachedSummary(
      'freshness',
      'unknown_scope',
      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
    );
  }

  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
  return {
    status: 'accepted',
    category: 'accepted',
    reason: 'accepted',
    detail: 'Cached summary passed fidelity and freshness gates and may be used additively.',
    cachedSummary: {
      schemaVersion: candidate.schemaVersion,
      lastSpecFolder: cachedSpecFolder,
      summaryText,
      extractedAt: candidate.extractedAt!,
      lastClaudeTurnAt: producerMetadata.lastClaudeTurnAt!,
      transcriptPath: transcript.path,
      transcriptFingerprint: transcript.fingerprint,
      cacheCreationInputTokens: cacheTokens.cacheCreationInputTokens,
      cacheReadInputTokens: cacheTokens.cacheReadInputTokens,
      continuityText,
      startupHint: continuityText,
    },
  };
}

export function getCachedSessionSummaryDecision(
  options: {
    specFolder?: string;
    claudeSessionId?: string;
    nowMs?: number;
    maxAgeMs?: number;
    state?: HookState | null;
  } = {},
): CachedSessionSummaryDecision {
  // Caller supplied a specific state — evaluate it directly (test + explicit-state paths).
  if (options.state) {
    const candidate = buildCachedSessionSummaryCandidate(options.state);
    return evaluateCachedSessionSummaryCandidate(candidate, options);
  }

  // T-SRS-03 (R38-001 extension): retry candidate-by-candidate rather than
  // treating the single newest state as all-or-nothing.  Mirrors the per-file
  // isolation P0-D landed in loadMostRecentState but extends it to the fidelity/
  // freshness evaluation layer — if the newest state has a schema mismatch,
  // missing transcript fingerprint, or stale summary, fall back to the next
  // candidate before giving up.
  const matching = loadMatchingStates({
    maxAgeMs: options.maxAgeMs,
    scope: {
      specFolder: options.specFolder,
      claudeSessionId: options.claudeSessionId,
    },
  });

  if (matching.states.length === 0) {
    if (matching.reason === 'schema_mismatch') {
      return rejectCachedSummary(
        'fidelity',
        'schema_mismatch',
        matching.detail ?? 'Cached hook state schema version was rejected before session-resume could consume it.',
      );
    }
    return rejectCachedSummary(
      'fidelity',
      'missing_state',
      'No recent hook state was available for cached continuity reuse.',
    );
  }

  let lastDecision: CachedSessionSummaryDecision | null = null;
  for (const entry of matching.states) {
    const candidate = buildCachedSessionSummaryCandidate(entry.state);
    const decision = evaluateCachedSessionSummaryCandidate(candidate, options);
    if (decision.status === 'accepted') {
      return decision;
    }
    lastDecision = decision;
  }

  // All candidates rejected — surface the most informative rejection (from the
  // newest state, which is the canonical authoritative snapshot).
  return lastDecision ?? rejectCachedSummary(
    'fidelity',
    'missing_state',
    'No recent hook state was available for cached continuity reuse.',
  );
}

export function applyCachedSummaryAdditively<T extends Record<string, unknown>>(
  baseline: T,
  decision: CachedSessionSummaryDecision,
): T & { cachedSummary?: CachedSessionSummary } {
  if (decision.status !== 'accepted' || !decision.cachedSummary) {
    return { ...baseline };
  }

  return {
    ...baseline,
    cachedSummary: decision.cachedSummary,
  };
}

export function logCachedSummaryDecision(
  surface: string,
  decision: CachedSessionSummaryDecision,
): void {
  if (decision.status === 'accepted' || decision.reason === 'missing_state') {
    return;
  }

  console.error(
    `[${surface}] Cached summary rejected (${decision.category}): ${decision.reason} — ${decision.detail}`,
  );
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
  const callerCtx = getCallerContext();
  const requestedSessionId = typeof args.sessionId === 'string' && args.sessionId.trim().length > 0
    ? args.sessionId
    : null;

  // T-SRS-BND-01: under stdio, callerCtx.sessionId is vacuous because the MCP SDK
  // hard-codes an empty transport session field for stdio
  // (@modelcontextprotocol/sdk/dist/esm/shared/protocol.js:280-316). That is not a
  // security hole because stdio runs as a single-UID subprocess with no cross-trust
  // boundary; HTTP/WS callers still carry server-generated session IDs and hit this guard.
  if (requestedSessionId && callerCtx?.sessionId && requestedSessionId !== callerCtx.sessionId) {
    const message = `Session-ID mismatch: args.sessionId='${requestedSessionId}' vs callerContext.sessionId='${callerCtx.sessionId}'`;
    if (SESSION_RESUME_AUTH_PERMISSIVE) {
      console.warn(`[session-resume] ${message} (permissive mode — allowing)`);
    } else {
      throw new Error(`${message} — rejecting cross-session resume`);
    }
  }

  // F052: Record memory recovery metric for session_resume
  recordMetricEvent({ kind: 'memory_recovery' });

  // Phase 024: Record bootstrap telemetry
  const startMs = Date.now();
  const hints: string[] = [];

  const cachedSummaryDecision = getCachedSessionSummaryDecision({
    specFolder: args.specFolder,
    // Advanced targeted recovery selector: expose sessionId publicly for
    // operators, but keep default guidance focused on specFolder/bootstrap.
    claudeSessionId: requestedSessionId ?? callerCtx?.sessionId ?? undefined,
  });
  const scopeFallback = !args.specFolder && cachedSummaryDecision.status === 'accepted'
    ? cachedSummaryDecision.cachedSummary?.lastSpecFolder ?? null
    : null;
  const resolvedSpecFolder = args.specFolder ?? scopeFallback ?? null;
  if (cachedSummaryDecision.status === 'accepted' && scopeFallback) {
    hints.push('Using the cached session scope to resolve the resume target. Pass specFolder explicitly to override it.');
    console.warn(`[session_resume] Using cached fallback specFolder for OpenCode transport: ${scopeFallback}`);
  } else if (cachedSummaryDecision.status !== 'accepted') {
    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
  }

  // ── Sub-call 1: Code graph status ───────────────────────────
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

  const structuralTrust = buildStructuralContextTrust(structuralContext);

  let sessionQuality: SessionResumeResult['sessionQuality'] | SessionResumeMinimalResult['sessionQuality'];
  if (args.minimal) {
    try {
      sessionQuality = computeQualityScore().level;
    } catch {
      sessionQuality = 'unknown';
    }
  }

  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: codeGraph.status as GraphFreshness,
    sourceSurface: 'session_resume',
  });
  const transportStateBase = {
    codeGraph,
    cocoIndex,
    structuralContext,
    structuralTrust,
    graphOps,
    specFolder: resolvedSpecFolder,
  };

  if (args.minimal) {
    const minimalResult: SessionResumeMinimalResult = {
      mode: 'minimal',
      codeGraph,
      cocoIndex,
      cachedSummary: cachedSummaryDecision,
      structuralContext,
      sessionQuality: sessionQuality ?? 'unknown',
      payloadContract: null,
      opencodeTransport: buildOpencodeTransport(transportStateBase, { minimal: true }),
      graphOps,
      hints: [...new Set(hints)],
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ status: 'ok', data: minimalResult }, null, 2),
      }],
    };
  }

  // ── Sub-call 2: Resume ladder (filesystem-first, no SQL on happy path) ──
  const memoryResult = buildResumeLadder({
    specFolder: args.specFolder,
    fallbackSpecFolder: scopeFallback,
    workspacePath: process.cwd(),
  });
  hints.push(...memoryResult.hints);
  if (memoryResult.source === 'none') {
    hints.push('Resume ladder found no canonical recovery context. Pass specFolder explicitly or start with /spec_kit:plan.');
  }

  const memoryCertainty: SharedPayloadCertainty = memoryResult.source === 'none'
    ? 'defaulted'
    : 'exact';
  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
  const structuralCertainty: SharedPayloadCertainty = 'exact';

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'memory-resume',
      title: 'Memory Resume',
      content: summarizeUnknown(memoryResult),
      source: 'memory',
      certainty: memoryCertainty,
    },
  ];
  payloadSections.push(
    {
      key: 'code-graph-status',
      title: 'Code Graph Status',
      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
      source: 'code-graph',
      certainty: codeGraphCertainty,
    },
    {
      key: 'cocoindex-status',
      title: 'CocoIndex Status',
      content: cocoIndex.available
        ? `available at ${cocoIndex.binaryPath}`
        : `unavailable; expected at ${cocoIndex.binaryPath}`,
      source: 'semantic',
      certainty: cocoIndexCertainty,
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      content: structuralContext.summary,
      source: 'code-graph',
      certainty: structuralCertainty,
      structuralTrust,
    },
  );

  // ── Build composite result ──────────────────────────────────
  const payloadContract = createSharedPayloadEnvelope({
    kind: 'resume',
    sections: payloadSections,
    summary: `Resume payload: ${summarizeCertaintyContract([
      { label: 'memory', certainty: memoryCertainty },
      { label: 'graph', certainty: codeGraphCertainty },
      { label: 'cocoindex', certainty: cocoIndexCertainty },
      { label: 'structural', certainty: structuralCertainty },
    ])}; resumeSource=${memoryResult.source}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
    provenance: {
      producer: 'session_resume',
      sourceSurface: 'session_resume',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
      sourceRefs: ['resume-ladder', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
    },
  });
  const result: SessionResumeResult = {
    memory: memoryResult as unknown as Record<string, unknown>,
    codeGraph,
    cocoIndex,
    cachedSummary: cachedSummaryDecision,
    structuralContext,
    payloadContract,
    opencodeTransport: buildOpencodeTransport(
      { ...transportStateBase, payloadContract },
      { minimal: false },
    ),
    graphOps,
    ...(sessionQuality ? { sessionQuality } : {}),
    hints: [...new Set(hints)],
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
