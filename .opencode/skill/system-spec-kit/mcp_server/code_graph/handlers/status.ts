// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_status — reports graph health.

import * as graphDb from '../lib/code-graph-db.js';
import {
  buildEdgeDistribution,
  computeEdgeShare,
  computeJSD,
  computePSI,
  type EdgeDistribution,
} from '../lib/edge-drift.js';
import { getGraphFreshness } from '../lib/ensure-ready.js';
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
const EDGE_DRIFT_PSI_THRESHOLD = 0.25;
const EDGE_DRIFT_JSD_THRESHOLD = 0.10;
const EDGE_DRIFT_SHARE_THRESHOLD = 0.05;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
  try {
    const stats = graphDb.getStats();
    const edgeDriftSummary = buildEdgeDriftSummary(stats.edgesByType);
    const freshness = getGraphFreshness(process.cwd());
    const lastGoldVerification = graphDb.getLastGoldVerification();
    const goldVerificationTrust = getGoldVerificationTrust(
      lastGoldVerification,
      freshness,
      stats.lastScanTimestamp,
    );
    const verificationPassPolicy = getVerificationPassPolicy(lastGoldVerification);
    // PR 4 / F71 step 7: switch on the unified V2 freshness enum so each
    // canonical state has its own status reason (no more V4 string-mapping
    // that swallowed 'error' as 'missing').
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
    const readinessBlock = buildReadinessBlock({
      freshness,
      action: 'none',
      inlineIndexPerformed: false,
      reason: statusReason,
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
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `Code graph not initialized: ${err instanceof Error ? err.message : String(err)}`,
        }),
      }],
    };
  }
}
