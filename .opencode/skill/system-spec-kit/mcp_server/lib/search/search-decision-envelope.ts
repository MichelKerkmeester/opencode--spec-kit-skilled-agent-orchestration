// ───────────────────────────────────────────────────────────────
// MODULE: Search Decision Envelope
// ───────────────────────────────────────────────────────────────
// Request-scoped telemetry contract for search/RAG decisions.
// Builders in this module are pure and must not alter ranking, routing, or
// refusal behavior.

import {
  buildTrustTree,
  type BuildTrustTreeInput,
  type TrustTree,
} from '../rag/trust-tree.js';
import type { QueryPlan } from '../query/query-plan.js';
import type { RerankGateDecision } from './rerank-gate.js';
import type { CocoIndexCalibrationTelemetry } from './cocoindex-calibration.js';

export interface ShadowDeltaTelemetry {
  prompt?: string;
  recommendation?: string;
  liveScore: number;
  shadowScore: number;
  delta: number;
  dominantLane: string | null;
  timestamp: string;
}

export interface CocoIndexCalibrationEnvelopeTelemetry extends CocoIndexCalibrationTelemetry {
  recommendedMultiplier: number;
}

export interface DegradedReadinessTelemetry {
  freshness?: string;
  action?: string;
  canonicalReadiness?: string;
  trustState?: string;
  reason?: string;
  blocked?: boolean;
  degraded?: boolean;
  graphAnswersOmitted?: boolean;
  requiredAction?: string;
  fallbackDecision?: Record<string, unknown>;
}

export interface SearchDecisionEnvelope {
  envelopeVersion: 1;
  requestId: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  queryPlan: QueryPlan;
  trustTree?: TrustTree;
  rerankGateDecision?: RerankGateDecision;
  shadowDeltas?: ShadowDeltaTelemetry[];
  cocoindexCalibration?: CocoIndexCalibrationEnvelopeTelemetry;
  degradedReadiness?: DegradedReadinessTelemetry;
  pipelineTiming?: Record<string, number>;
  timestamp: string;
  latencyMs: number;
}

export interface BuildSearchDecisionEnvelopeInput {
  requestId: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  queryPlan: QueryPlan;
  trustTree?: TrustTree;
  trustTreeInput?: BuildTrustTreeInput;
  rerankGateDecision?: RerankGateDecision;
  shadowDeltas?: readonly ShadowDeltaTelemetry[];
  cocoindexCalibration?: CocoIndexCalibrationTelemetry;
  degradedReadiness?: DegradedReadinessTelemetry;
  pipelineTiming?: Record<string, number>;
  timestamp?: string;
  latencyMs?: number;
}

function buildSearchDecisionEnvelope(input: BuildSearchDecisionEnvelopeInput): SearchDecisionEnvelope {
  const envelope: SearchDecisionEnvelope = {
    envelopeVersion: 1,
    requestId: input.requestId,
    ...(input.tenantId ? { tenantId: input.tenantId } : {}),
    ...(input.userId ? { userId: input.userId } : {}),
    ...(input.agentId ? { agentId: input.agentId } : {}),
    queryPlan: cloneJson(input.queryPlan),
    ...(input.pipelineTiming ? { pipelineTiming: cloneJson(input.pipelineTiming) } : {}),
    timestamp: input.timestamp ?? new Date().toISOString(),
    latencyMs: normalizeLatency(input.latencyMs),
  };

  const trustTree = input.trustTree ?? (input.trustTreeInput ? buildTrustTree(input.trustTreeInput) : undefined);
  return attachDegradedReadiness(
    attachCocoIndexCalibration(
      attachShadowDeltas(
        attachRerankDecision(
          attachTrustTree(envelope, trustTree),
          input.rerankGateDecision,
        ),
        input.shadowDeltas,
      ),
      input.cocoindexCalibration,
    ),
    input.degradedReadiness,
  );
}

function attachTrustTree(envelope: SearchDecisionEnvelope, trustTree?: TrustTree): SearchDecisionEnvelope {
  if (!trustTree) return { ...envelope };
  return {
    ...envelope,
    trustTree: cloneJson(trustTree),
  };
}

function attachRerankDecision(
  envelope: SearchDecisionEnvelope,
  rerankGateDecision?: RerankGateDecision,
): SearchDecisionEnvelope {
  if (!rerankGateDecision) return { ...envelope };
  return {
    ...envelope,
    rerankGateDecision: cloneJson(rerankGateDecision),
  };
}

function attachShadowDeltas(
  envelope: SearchDecisionEnvelope,
  shadowDeltas?: readonly ShadowDeltaTelemetry[],
): SearchDecisionEnvelope {
  if (!shadowDeltas || shadowDeltas.length === 0) return { ...envelope };
  return {
    ...envelope,
    shadowDeltas: shadowDeltas.map((delta) => cloneJson(delta)),
  };
}

function attachCocoIndexCalibration(
  envelope: SearchDecisionEnvelope,
  calibration?: CocoIndexCalibrationTelemetry,
): SearchDecisionEnvelope {
  if (!calibration) return { ...envelope };
  const recommendedMultiplier = calibration.duplicateDensity >= 0.35 ? 4 : 1;
  return {
    ...envelope,
    cocoindexCalibration: {
      ...cloneJson(calibration),
      recommendedMultiplier,
    },
  };
}

function attachDegradedReadiness(
  envelope: SearchDecisionEnvelope,
  degradedReadiness?: DegradedReadinessTelemetry,
): SearchDecisionEnvelope {
  if (!degradedReadiness) return { ...envelope };
  return {
    ...envelope,
    degradedReadiness: cloneJson(degradedReadiness),
  };
}

function normalizeLatency(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : 0;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export {
  attachCocoIndexCalibration,
  attachDegradedReadiness,
  attachRerankDecision,
  attachShadowDeltas,
  attachTrustTree,
  buildSearchDecisionEnvelope,
};
