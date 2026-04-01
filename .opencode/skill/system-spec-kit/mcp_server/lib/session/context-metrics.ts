// ───────────────────────────────────────────────────────────────
// MODULE: Context Metrics
// ───────────────────────────────────────────────────────────────
// Phase 023: Lightweight session quality tracking.
// Collects events during MCP tool dispatch and computes quality scores.
// In-memory only — no DB persistence needed for now.

import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface SessionMetrics {
  sessionId: string;
  startedAt: string;
  lastToolCallAt: string | null;
  toolCallCount: number;
  memoryRecoveryCalls: number;
  codeGraphQueries: number;
  specFolderTransitions: number;
  currentSpecFolder: string | null;
  primed: boolean;
}

export type QualityLevel = 'healthy' | 'degraded' | 'critical';

export interface QualityScore {
  level: QualityLevel;
  score: number; // 0.0 – 1.0
  factors: {
    recency: number;        // 1.0 if recent tool call, decays over time
    recovery: number;       // 1.0 if memory recovered this session
    graphFreshness: number; // 1.0 fresh, 0.5 stale, 0.0 empty
    continuity: number;     // 1.0 if spec folder stable, lower on transitions
  };
}

export type MetricEventKind =
  | 'tool_call'
  | 'memory_recovery'
  | 'code_graph_query'
  | 'spec_folder_change'
  | 'bootstrap';

export type BootstrapSource = 'hook' | 'mcp_auto' | 'agent' | 'manual' | 'tool';
export type BootstrapCompleteness = 'full' | 'partial' | 'minimal';

export interface BootstrapRecord {
  source: BootstrapSource;
  durationMs: number;
  completeness: BootstrapCompleteness;
  timestamp: string;
}

export interface MetricEvent {
  kind: MetricEventKind;
  toolName?: string;
  specFolder?: string;
}

/* ───────────────────────────────────────────────────────────────
   2. STATE
──────────────────────────────────────────────────────────────── */

const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const startedAt = new Date().toISOString();

let lastToolCallAt: number | null = null;
let toolCallCount = 0;
let memoryRecoveryCalls = 0;
let codeGraphQueries = 0;
let specFolderTransitions = 0;
let currentSpecFolder: string | null = null;
let primed = false;
const bootstrapRecords: BootstrapRecord[] = [];

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;
// Matches the session-snapshot graph staleness threshold.
const GRAPH_FRESHNESS_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

/* ───────────────────────────────────────────────────────────────
   4. EVENT RECORDING
──────────────────────────────────────────────────────────────── */

/** Record a metric event from tool dispatch or lifecycle hooks. */
export function recordMetricEvent(event: MetricEvent): void {
  switch (event.kind) {
    case 'tool_call':
      toolCallCount++;
      lastToolCallAt = Date.now();
      if (!primed) primed = true;
      break;

    case 'memory_recovery':
      memoryRecoveryCalls++;
      break;

    case 'code_graph_query':
      codeGraphQueries++;
      break;

    case 'spec_folder_change':
      if (event.specFolder && event.specFolder !== currentSpecFolder) {
        specFolderTransitions++;
        currentSpecFolder = event.specFolder;
      }
      break;

    case 'bootstrap':
      // Handled by recordBootstrapEvent — no-op here
      break;
  }
}

/** Phase 024 / Item 9: Record a bootstrap telemetry event. */
export function recordBootstrapEvent(
  source: BootstrapSource,
  durationMs: number,
  completeness: BootstrapCompleteness,
): void {
  bootstrapRecords.push({
    source,
    durationMs,
    completeness,
    timestamp: new Date().toISOString(),
  });
}

/** Get all bootstrap records for diagnostics. */
export function getBootstrapRecords(): readonly BootstrapRecord[] {
  return bootstrapRecords;
}

/* ───────────────────────────────────────────────────────────────
   5. METRICS SNAPSHOT
──────────────────────────────────────────────────────────────── */

/** Return a read-only snapshot of current session metrics. */
export function getSessionMetrics(): SessionMetrics {
  return {
    sessionId,
    startedAt,
    lastToolCallAt: lastToolCallAt ? new Date(lastToolCallAt).toISOString() : null,
    toolCallCount,
    memoryRecoveryCalls,
    codeGraphQueries,
    specFolderTransitions,
    currentSpecFolder,
    primed,
  };
}

/* ───────────────────────────────────────────────────────────────
   6. QUALITY SCORING
──────────────────────────────────────────────────────────────── */

/** Compute recency factor: 1.0 if <5 min, linear decay to 0.0 at 60 min. */
function computeRecency(): number {
  if (lastToolCallAt === null) return 0;
  const elapsed = Date.now() - lastToolCallAt;
  if (elapsed <= FIVE_MINUTES_MS) return 1.0;
  if (elapsed >= SIXTY_MINUTES_MS) return 0.0;
  // Linear decay between 5 min and 60 min
  return 1.0 - (elapsed - FIVE_MINUTES_MS) / (SIXTY_MINUTES_MS - FIVE_MINUTES_MS);
}

/** Compute recovery factor: 1.0 if any memory recovery call, 0.0 otherwise. */
function computeRecovery(): number {
  return memoryRecoveryCalls > 0 ? 1.0 : 0.0;
}

/** Compute graph freshness: 1.0 fresh, 0.5 stale, 0.0 empty/error. */
function computeGraphFreshness(): number {
  try {
    const stats = getGraphStats();
    if (stats.totalFiles === 0) return 0.0;
    if (!stats.lastScanTimestamp) return 0.5;
    const age = Date.now() - new Date(stats.lastScanTimestamp).getTime();
    return age <= GRAPH_FRESHNESS_THRESHOLD_MS ? 1.0 : 0.5;
  } catch {
    return 0.0;
  }
}

/** Compute continuity: 1.0 if 0-1 transitions, 0.5 if 2-3, 0.0 if >3. */
function computeContinuity(): number {
  if (specFolderTransitions <= 1) return 1.0;
  if (specFolderTransitions <= 3) return 0.5;
  return 0.0;
}

/**
 * F047: Single source of truth for lastToolCallAt timestamp.
 * session-health.ts should use this instead of the memory-surface duplicate.
 */
export function getLastToolCallAt(): number | null {
  return lastToolCallAt;
}

/** Compute overall quality score and level. */
export function computeQualityScore(): QualityScore {
  const factors = {
    recency: computeRecency(),
    recovery: computeRecovery(),
    graphFreshness: computeGraphFreshness(),
    continuity: computeContinuity(),
  };

  // F065: Weight rationale for quality score factors:
  //
  //   recency (0.35)       — Highest weight because stale sessions are the primary
  //                          degradation signal. A 60-min gap almost certainly means
  //                          the LLM's working context has drifted from the codebase.
  //
  //   continuity (0.25)    — Second-highest. Frequent spec folder switches indicate
  //                          context fragmentation; stable focus correlates with quality.
  //
  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
  //                          reliable signal that the session has recovered prior state.
  //                          Binary (done/not-done) so lower weight than continuous factors.
  //
  //   graphFreshness (0.20) — A stale code graph means structural queries return
  //                          outdated symbols. Tied with recovery because both are
  //                          "enabling" factors rather than direct quality signals.
  //
  //   Total: 0.35 + 0.25 + 0.20 + 0.20 = 1.00
  const score = (
    factors.recency * 0.35 +
    factors.recovery * 0.20 +
    factors.graphFreshness * 0.20 +
    factors.continuity * 0.25
  );

  let level: QualityLevel;
  if (score > 0.7) level = 'healthy';
  else if (score > 0.4) level = 'degraded';
  else level = 'critical';

  return { level, score: Math.round(score * 1000) / 1000, factors };
}
