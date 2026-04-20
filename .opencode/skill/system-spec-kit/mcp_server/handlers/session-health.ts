// ───────────────────────────────────────────────────────────────
// MODULE: Session Health Handler
// ───────────────────────────────────────────────────────────────
// T018: MCP tool handler for session_health — reports session
// readiness, code graph freshness, and priming status.

import {
  isSessionPrimed,
  getSessionTimestamps,
  getLastActiveSessionId,
  getCodeGraphStatusSnapshot,
} from '../hooks/memory-surface.js';

import { computeQualityScore, getLastToolCallAt } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { QualityScore } from '../lib/session/context-metrics.js';
import {
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  trustStateFromStructuralStatus,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  type SharedPayloadTrustState,
} from '../lib/context/shared-payload.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../code-graph/lib/ops-hardening.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

type SessionStatus = 'ok' | 'warning' | 'stale';
// M8 / T-SHS-01: Section-level trust state reuses the canonical
// SharedPayloadTrustState vocabulary ('live' / 'stale' / 'absent' /
// 'unavailable'). Keeping the alias narrows to just the four states
// session-health observes (it never emits 'cached'/'imported'/etc.).
type SessionHealthSectionTrustState = Extract<
  SharedPayloadTrustState,
  'live' | 'stale' | 'absent' | 'unavailable'
>;

interface SessionHealthDetails {
  sessionAgeMs: number;
  lastToolCallAgoMs: number;
  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
  specFolder: string | null;
  primingStatus: 'primed' | 'not_primed';
}

interface SessionHealthSectionStructuralTrust {
  state: SessionHealthSectionTrustState;
  trustedAt: string;
}

interface SessionHealthSection {
  key: string;
  title: string;
  content: string;
  source: SharedPayloadSection['source'];
  structuralTrust: SessionHealthSectionStructuralTrust;
}

interface SessionHealthResult {
  status: SessionStatus;
  details: SessionHealthDetails;
  qualityScore: QualityScore;
  sections: SessionHealthSection[];
  structuralContext?: StructuralBootstrapContract;
  payloadContract?: SharedPayloadEnvelope;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function getSessionSectionTrustState(status: SessionStatus): SessionHealthSectionTrustState {
  return status === 'ok' ? 'live' : 'stale';
}

function getGraphSectionTrustState(
  graphFreshness: SessionHealthDetails['graphFreshness'],
): SessionHealthSectionTrustState {
  if (graphFreshness === 'fresh') {
    return 'live';
  }
  if (graphFreshness === 'stale') {
    return 'stale';
  }
  if (graphFreshness === 'empty') {
    return 'absent';
  }
  return 'unavailable';
}

function createSectionStructuralTrust(
  state: SessionHealthSectionTrustState,
  trustedAt: string | null | undefined,
  observedAt: string,
): SessionHealthSectionStructuralTrust {
  return {
    state,
    trustedAt: trustedAt ?? observedAt,
  };
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_health tool call */
export async function handleSessionHealth(): Promise<MCPResponse> {
  const now = Date.now();
  const { serverStartedAt } = getSessionTimestamps();
  // F047: Use context-metrics as single source of truth for lastToolCallAt
  // to eliminate dual-state drift with memory-surface's separate timestamp.
  const metricsLastToolCall = getLastToolCallAt();
  const lastToolCallAt = metricsLastToolCall ?? serverStartedAt;
  const primingSessionId = getLastActiveSessionId();
  const primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;

  // Determine graph freshness
  let graphFreshness: SessionHealthDetails['graphFreshness'] = 'error';
  // Wire specFolder from context-metrics (fixes P1: dead field)
  let specFolder: string | null = null;
  try {
    const { getSessionMetrics } = await import('../lib/session/context-metrics.js');
    specFolder = getSessionMetrics().currentSpecFolder;
  } catch { /* metrics module may not be loaded */ }
  try {
    const snapshot = getCodeGraphStatusSnapshot();
    if (snapshot.status === 'ok' && snapshot.data) {
      const totalFiles = snapshot.data.totalFiles ?? 0;
      const lastScan = snapshot.data.lastScanAt;
      if (totalFiles === 0) {
        graphFreshness = 'empty';
      } else if (!lastScan || (now - new Date(lastScan).getTime() > TWENTY_FOUR_HOURS_MS)) {
        graphFreshness = 'stale';
      } else {
        graphFreshness = 'fresh';
      }
    }
  } catch {
    graphFreshness = 'error';
  }

  // Phase 027: Structural bootstrap contract for health surface
  const structuralContext = buildStructuralBootstrapContract('session_health');

  const sessionAgeMs = now - serverStartedAt;
  const lastToolCallAgoMs = now - lastToolCallAt;
  const observedAt = new Date(now).toISOString();

  // Status determination logic
  let status: SessionStatus;
  if (!primed || lastToolCallAgoMs > SIXTY_MINUTES_MS) {
    status = 'stale';
  } else if (graphFreshness === 'stale' || graphFreshness === 'empty' || lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
    status = 'warning';
  } else {
    status = 'ok';
  }

  // Build human-readable hints
  const hints: string[] = [];
  if (!primed) {
    hints.push('Session has not been primed yet. Make any tool call to trigger auto-priming.');
  }
  if (structuralContext.status === 'stale') {
    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
  } else if (structuralContext.status === 'missing') {
    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
  }
  if (lastToolCallAgoMs > SIXTY_MINUTES_MS) {
    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
  } else if (lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
    hints.push('No tool calls in >15 min. Session context may be drifting.');
  }

  // Phase 023: Compute quality score from context metrics
  const qualityScore = computeQualityScore();
  const payloadStructuralTrust = buildStructuralContextTrust(structuralContext);
  const sessionHealthContent = `status=${status}; priming=${primed ? 'primed' : 'not_primed'}; graph=${graphFreshness}; specFolder=${specFolder ?? 'none'}`;
  const qualityScoreContent = `level=${qualityScore.level}; score=${qualityScore.score}`;

  const payloadContract = createSharedPayloadEnvelope({
    kind: 'health',
    sections: [
      {
        key: 'session-health',
        title: 'Session Health',
        content: sessionHealthContent,
        source: 'session',
      },
      {
        key: 'quality-score',
        title: 'Quality Score',
        content: qualityScoreContent,
        source: 'operational',
      },
      {
        key: 'structural-context',
        title: 'Structural Context',
        content: structuralContext.summary,
        source: 'code-graph',
        structuralTrust: payloadStructuralTrust,
      },
    ],
    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
    provenance: {
      producer: 'session_health',
      sourceSurface: 'session_health',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
      sourceRefs: ['memory-surface', 'context-metrics', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness,
    sourceSurface: 'session_health',
  });
  const sessionTrustedAt = new Date(lastToolCallAt).toISOString();
  const graphTrustedAt = structuralContext.provenance?.lastUpdated ?? observedAt;
  const graphSectionTrustState = getGraphSectionTrustState(graphFreshness);
  const sections: SessionHealthSection[] = [
    {
      key: 'session-health',
      title: 'Session Health',
      content: sessionHealthContent,
      source: 'session',
      structuralTrust: createSectionStructuralTrust(
        getSessionSectionTrustState(status),
        sessionTrustedAt,
        observedAt,
      ),
    },
    {
      key: 'quality-score',
      title: 'Quality Score',
      content: qualityScoreContent,
      source: 'operational',
      structuralTrust: createSectionStructuralTrust('live', observedAt, observedAt),
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      content: structuralContext.summary,
      source: 'code-graph',
      structuralTrust: createSectionStructuralTrust(
        graphSectionTrustState,
        graphTrustedAt,
        observedAt,
      ),
    },
    {
      key: 'code-graph-readiness',
      title: 'Code Graph Readiness',
      content: `canonical=${graphOps.readiness.canonical}; graphFreshness=${graphOps.readiness.graphFreshness}; summary=${graphOps.readiness.summary}`,
      source: 'code-graph',
      structuralTrust: createSectionStructuralTrust(
        graphSectionTrustState,
        graphTrustedAt,
        observedAt,
      ),
    },
  ];

  const result: SessionHealthResult = {
    status,
    details: {
      sessionAgeMs,
      lastToolCallAgoMs,
      graphFreshness,
      specFolder,
      primingStatus: primed ? 'primed' : 'not_primed',
    },
    qualityScore,
    sections,
    structuralContext,
    payloadContract,
    graphOps,
    hints,
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}
