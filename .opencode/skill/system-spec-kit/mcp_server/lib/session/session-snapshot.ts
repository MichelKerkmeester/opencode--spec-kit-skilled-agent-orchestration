// ───────────────────────────────────────────────────────────────
// MODULE: Session Snapshot
// ───────────────────────────────────────────────────────────────
// Phase 024: Lightweight read-only snapshot of session state.
// Aggregates metrics, graph freshness, and priming status into a
// single object for buildServerInstructions() and agent bootstrap.

import { getSessionMetrics, computeQualityScore, getLastToolCallAt } from './context-metrics.js';
import { isSessionPrimed } from '../../hooks/memory-surface.js';
import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';
import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface SessionSnapshot {
  specFolder: string | null;
  currentTask: string | null;
  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
  cocoIndexAvailable: boolean;
  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
  lastToolCallAgoMs: number | null;
  primed: boolean;
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const GRAPH_STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function resolveGraphFreshness(): SessionSnapshot['graphFreshness'] {
  try {
    const stats = getGraphStats();
    if (stats.totalFiles === 0) return 'empty';
    if (!stats.lastScanTimestamp) return 'stale';
    const age = Date.now() - new Date(stats.lastScanTimestamp).getTime();
    return age <= GRAPH_STALE_THRESHOLD_MS ? 'fresh' : 'stale';
  } catch {
    return 'error';
  }
}

/* ───────────────────────────────────────────────────────────────
   4. PUBLIC API
──────────────────────────────────────────────────────────────── */

/** Build a read-only snapshot of the current session state. */
export function getSessionSnapshot(): SessionSnapshot {
  const now = Date.now();

  // Metrics (safe — in-memory only)
  let specFolder: string | null = null;
  let currentTask: string | null = null;
  try {
    const metrics = getSessionMetrics();
    specFolder = metrics.currentSpecFolder;
    // currentTask is not tracked by metrics; leave null
    currentTask = null;
  } catch { /* metrics unavailable */ }

  // Graph freshness
  const graphFreshness = resolveGraphFreshness();

  // CocoIndex availability
  let cocoIndexAvailable = false;
  try {
    cocoIndexAvailable = isCocoIndexAvailable();
  } catch { /* unavailable */ }

  // Quality score
  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
  try {
    const qs = computeQualityScore();
    sessionQuality = qs.level;
  } catch { /* unknown */ }

  // Last tool call
  let lastToolCallAgoMs: number | null = null;
  try {
    const last = getLastToolCallAt();
    if (last !== null) lastToolCallAgoMs = now - last;
  } catch { /* null */ }

  // Priming status
  let primed = false;
  try {
    primed = isSessionPrimed();
  } catch { /* not primed */ }

  return {
    specFolder,
    currentTask,
    graphFreshness,
    cocoIndexAvailable,
    sessionQuality,
    lastToolCallAgoMs,
    primed,
  };
}
