// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_status — reports graph health.

import * as graphDb from '../lib/code-graph-db.js';
import {
  EDGE_DRIFT_JSD_THRESHOLD,
  EDGE_DRIFT_PSI_THRESHOLD,
  EDGE_DRIFT_SHARE_THRESHOLD,
  buildEdgeDistribution,
  computeEdgeShare,
  computeJSD,
  computePSI,
  type EdgeDistribution,
} from '../lib/edge-drift.js';
import { getGraphFreshness, getGraphReadinessSnapshot } from '../lib/ensure-ready.js';
import { isRecord } from '../lib/query-result-adapter.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';

type GoldVerificationTrust = 'live' | 'stale' | 'absent';

interface VerificationPassPolicy {
  overall_pass_rate: number;
  edge_focus_pass_rate: number;
}

interface EdgeDriftSummary {
  share_drift: Record<string, number>;
  psi: number;
  jsd: number;
  flagged: boolean;
}

const GOLD_VERIFICATION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getPersistedEdgeDistributionBaseline(): EdgeDistribution | null {
  const rawBaseline = graphDb.getCodeGraphMetadata('edge_distribution_baseline');
  if (!rawBaseline) {
    return null;
  }

  try {
    const parsedBaseline = JSON.parse(rawBaseline) as unknown;
    if (!isRecord(parsedBaseline)) {
      return null;
    }

    return buildEdgeDistribution(parsedBaseline);
  } catch {
    return null;
  }
}

function buildEdgeDriftSummary(edgesByType: Record<string, number>): EdgeDriftSummary | null {
  const baselineShare = getPersistedEdgeDistributionBaseline();
  if (!baselineShare) {
    return null;
  }

  const currentShare = computeEdgeShare(buildEdgeDistribution(edgesByType));
  const shareDrift = Object.fromEntries(
    Object.keys(currentShare).map((edgeType) => [
      edgeType,
      currentShare[edgeType as keyof typeof currentShare]
      - baselineShare[edgeType as keyof typeof baselineShare],
    ]),
  ) as Record<string, number>;
  const psi = computePSI(currentShare, baselineShare);
  const jsd = computeJSD(currentShare, baselineShare);
  const maxShareDrift = Object.values(shareDrift).reduce(
    (max, value) => Math.max(max, Math.abs(value)),
    0,
  );

  return {
    share_drift: shareDrift,
    psi,
    jsd,
    flagged: psi >= EDGE_DRIFT_PSI_THRESHOLD
      || jsd >= EDGE_DRIFT_JSD_THRESHOLD
      || maxShareDrift >= EDGE_DRIFT_SHARE_THRESHOLD,
  };
}

function getVerificationPassPolicy(
  verification: object | null,
): VerificationPassPolicy | undefined {
  if (!isRecord(verification) || !isRecord(verification.pass_policy)) {
    return undefined;
  }

  const { overall_pass_rate, edge_focus_pass_rate } = verification.pass_policy;
  if (
    typeof overall_pass_rate !== 'number'
    || typeof edge_focus_pass_rate !== 'number'
  ) {
    return undefined;
  }

  return {
    overall_pass_rate,
    edge_focus_pass_rate,
  };
}

function getVerificationTimestampMs(
  verification: object | null,
  lastPersistedAt: string | null,
): number | null {
  if (isRecord(verification)) {
    const persistedTimestamp = verification.verifiedAt ?? verification.executedAt;
    if (typeof persistedTimestamp === 'string') {
      const parsedPersistedTimestamp = Date.parse(persistedTimestamp);
      if (!Number.isNaN(parsedPersistedTimestamp)) {
        return parsedPersistedTimestamp;
      }
    }
  }

  if (typeof lastPersistedAt !== 'string') {
    return null;
  }

  const parsedLastPersistedAt = Date.parse(lastPersistedAt);
  return Number.isNaN(parsedLastPersistedAt) ? null : parsedLastPersistedAt;
}

function getGoldVerificationTrust(
  verification: object | null,
  freshness: ReturnType<typeof getGraphFreshness>,
  lastPersistedAt: string | null,
): GoldVerificationTrust {
  if (!verification) {
    return 'absent';
  }

  if (freshness !== 'fresh') {
    return 'stale';
  }

  const verificationTimestampMs = getVerificationTimestampMs(verification, lastPersistedAt);
  if (verificationTimestampMs === null) {
    return 'stale';
  }

  if (Date.now() - verificationTimestampMs > GOLD_VERIFICATION_MAX_AGE_MS) {
    return 'stale';
  }

  if (isRecord(verification) && verification.passed === false) {
    return 'stale';
  }

  return 'live';
}

/** Handle code_graph_status tool call */
export async function handleCodeGraphStatus(): Promise<{ content: Array<{ type: string; text: string }> }> {
  // Packet 016 / F-003: read the readiness snapshot FIRST so the degraded
  // envelope still surfaces even when `graphDb.getStats()` throws (e.g. DB
  // file corrupted or locked). Previously stats was called first; on crash
  // the catch path returned a generic "Code graph not initialized" error
  // and packet 014's whole point — surfacing action-level readiness — was
  // defeated. The snapshot helper is read-only (packet 014, REQ-001) so
  // calling it earlier never causes side effects.
  const snapshot = getGraphReadinessSnapshot(process.cwd());
  const freshness = snapshot.freshness;

  // Stats is isolated so an unavailable DB never suppresses the readiness
  // snapshot. On failure we ship the snapshot + degraded envelope and
  // surface stats-derived fields as null/empty fallbacks.
  let stats: ReturnType<typeof graphDb.getStats> | null = null;
  let statsError: string | null = null;
  try {
    stats = graphDb.getStats();
  } catch (err: unknown) {
    statsError = err instanceof Error ? err.message : String(err);
  }

  if (!stats) {
    // DB unavailable: surface the readiness snapshot + clear recovery signal
    // (`rg` fallback per shared degraded-readiness vocabulary; see decision-
    // record.md ADR-001) instead of returning a generic init error string.
    const readinessReason = snapshot.reason && snapshot.reason.length > 0
      ? snapshot.reason
      : (statsError ? `code-graph stats unavailable: ${statsError}` : 'code-graph stats unavailable');
    const readinessBlock = buildReadinessBlock({
      freshness,
      action: snapshot.action,
      inlineIndexPerformed: false,
      reason: readinessReason,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          message: `code_graph_not_initialized: ${statsError ?? 'stats unavailable'}`,
          data: {
            degraded: true,
            graphAnswersOmitted: true,
            blockReason: 'stats_unavailable',
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' },
          },
        }, null, 2),
      }],
    };
  }

  try {
    const edgeDriftSummary = buildEdgeDriftSummary(stats.edgesByType);
    const lastGoldVerification = graphDb.getLastGoldVerification();
    const goldVerificationTrust = getGoldVerificationTrust(
      lastGoldVerification,
      freshness,
      stats.lastScanTimestamp,
    );
    const verificationPassPolicy = getVerificationPassPolicy(lastGoldVerification);
    // PR 4 / F71 step 7: switch on the unified V2 freshness enum so each
    // canonical state has its own status reason (no more V4 string-mapping
    // that swallowed 'error' as 'missing'). Packet 014: prefer the snapshot
    // reason when present (it carries action-level detail like "graph is
    // empty (0 nodes)" or "<N> stale files exceed selective threshold");
    // fall back to the canonical state reason otherwise.
    let statusReason: string;
    switch (freshness) {
      case 'fresh':
        statusReason = 'status probe reports graph is ready';
        break;
      case 'stale':
        statusReason = 'status probe reports graph is stale';
        break;
      case 'empty':
        statusReason = 'status probe reports graph is missing';
        break;
      case 'error':
        statusReason = 'status probe crashed; graph is unavailable';
        break;
    }
    const readinessReason = snapshot.reason && snapshot.reason.length > 0
      ? snapshot.reason
      : statusReason;
    const readinessBlock = buildReadinessBlock({
      freshness,
      action: snapshot.action,
      inlineIndexPerformed: false,
      reason: readinessReason,
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            totalFiles: stats.totalFiles,
            totalNodes: stats.totalNodes,
            totalEdges: stats.totalEdges,
            freshness,
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            lastScanAt: stats.lastScanTimestamp,
            lastPersistedAt: stats.lastScanTimestamp,
            lastGitHead: stats.lastGitHead,
            dbFileSize: stats.dbFileSize,
            schemaVersion: stats.schemaVersion,
            nodesByKind: stats.nodesByKind,
            edgesByType: stats.edgesByType,
            edgeDriftSummary,
            parseHealth: stats.parseHealthSummary,
            graphQualitySummary: stats.graphQualitySummary,
            goldVerificationTrust,
            ...(lastGoldVerification ? { lastGoldVerification } : {}),
            ...(verificationPassPolicy ? { verificationPassPolicy } : {}),
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    // Packet 016 / F-003: preserve the readiness snapshot when the post-stats
    // path fails (e.g. drift summary / verification trust calculation throws).
    // Operators must still see action-level readiness instead of a generic
    // init error. Falls back to the snapshot we computed at the top of the
    // handler, which is read-only and never throws (returns 'error'
    // freshness if the underlying probe crashes).
    const message = err instanceof Error ? err.message : String(err);
    const readinessReason = snapshot.reason && snapshot.reason.length > 0
      ? snapshot.reason
      : `status path failed: ${message}`;
    const readinessBlock = buildReadinessBlock({
      freshness,
      action: snapshot.action,
      inlineIndexPerformed: false,
      reason: readinessReason,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          message: `code_graph_not_initialized: ${message}`,
          data: {
            degraded: true,
            graphAnswersOmitted: true,
            blockReason: 'status_path_failed',
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            fallbackDecision: { nextTool: 'rg', reason: 'status_path_failed' },
          },
        }, null, 2),
      }],
    };
  }
}
