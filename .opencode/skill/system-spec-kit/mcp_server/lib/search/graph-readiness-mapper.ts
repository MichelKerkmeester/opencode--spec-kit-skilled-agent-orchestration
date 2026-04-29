// ───────────────────────────────────────────────────────────────
// MODULE: Graph Readiness Mapper
// ───────────────────────────────────────────────────────────────
// Maps code-graph readiness payloads onto SearchDecisionEnvelope telemetry.

import type { GraphReadinessSnapshot } from '../../code_graph/lib/ensure-ready.js';
import type { DegradedReadinessTelemetry } from './search-decision-envelope.js';

interface CodeGraphQueryReadinessTelemetrySource {
  readonly readiness?: Partial<GraphReadinessSnapshot> & {
    readonly canonicalReadiness?: unknown;
    readonly trustState?: unknown;
  };
  readonly canonicalReadiness?: unknown;
  readonly trustState?: unknown;
  readonly blocked?: unknown;
  readonly degraded?: unknown;
  readonly graphAnswersOmitted?: unknown;
  readonly requiredAction?: unknown;
  readonly fallbackDecision?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function optionalRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function isCodeGraphQueryReadinessSource(
  input: GraphReadinessSnapshot | CodeGraphQueryReadinessTelemetrySource,
): input is CodeGraphQueryReadinessTelemetrySource {
  return 'readiness' in input;
}

function mapSnapshotTelemetry(snapshot: GraphReadinessSnapshot): DegradedReadinessTelemetry {
  return {
    freshness: snapshot.freshness,
    action: snapshot.action,
    reason: snapshot.reason,
    degraded: snapshot.freshness !== 'fresh',
  };
}

function mapCodeGraphQueryTelemetry(
  source: CodeGraphQueryReadinessTelemetrySource,
): DegradedReadinessTelemetry {
  const readiness = source.readiness;
  const freshness = optionalString(readiness?.freshness);

  return {
    freshness,
    action: optionalString(readiness?.action),
    canonicalReadiness: optionalString(source.canonicalReadiness)
      ?? optionalString(readiness?.canonicalReadiness),
    trustState: optionalString(source.trustState) ?? optionalString(readiness?.trustState),
    reason: optionalString(readiness?.reason),
    blocked: optionalBoolean(source.blocked),
    degraded: optionalBoolean(source.degraded) ?? (freshness ? freshness !== 'fresh' : undefined),
    graphAnswersOmitted: optionalBoolean(source.graphAnswersOmitted),
    requiredAction: optionalString(source.requiredAction),
    fallbackDecision: optionalRecord(source.fallbackDecision),
  };
}

export function mapGraphReadinessToTelemetry(
  snapshot: GraphReadinessSnapshot,
): DegradedReadinessTelemetry;
export function mapGraphReadinessToTelemetry(
  source: CodeGraphQueryReadinessTelemetrySource,
): DegradedReadinessTelemetry;
export function mapGraphReadinessToTelemetry(
  input: GraphReadinessSnapshot | CodeGraphQueryReadinessTelemetrySource,
): DegradedReadinessTelemetry {
  return isCodeGraphQueryReadinessSource(input)
    ? mapCodeGraphQueryTelemetry(input)
    : mapSnapshotTelemetry(input);
}

