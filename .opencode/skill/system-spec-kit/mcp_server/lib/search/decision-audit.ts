// ───────────────────────────────────────────────────────────────
// MODULE: Search Decision Audit
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, renameSync, statSync, appendFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { SearchDecisionEnvelope } from './search-decision-envelope.js';

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

export interface RecordSearchDecisionOptions {
  auditPath?: string;
  maxBytes?: number;
  now?: Date;
}

export interface RecordSearchDecisionResult {
  written: boolean;
  auditPath: string;
  error?: string;
}

export interface SearchDecisionSlaMetrics {
  count: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  decisionClassDistribution: Record<string, number>;
  refusalRate: number;
  rerankTriggerRate: number;
  latencyByStage: Record<string, { averageMs: number; p95Ms: number }>;
}

function defaultAuditPath(): string {
  return resolve(process.cwd(), '.opencode/skill/system-spec-kit/mcp_server/data/search-decisions.jsonl');
}

function resolveAuditPath(options: RecordSearchDecisionOptions = {}): string {
  return options.auditPath
    ?? process.env.SPECKIT_SEARCH_DECISION_AUDIT_PATH
    ?? defaultAuditPath();
}

function recordSearchDecision(
  envelope: SearchDecisionEnvelope,
  options: RecordSearchDecisionOptions = {},
): RecordSearchDecisionResult {
  const auditPath = resolveAuditPath(options);
  try {
    rotateIfNeeded(auditPath, options.maxBytes ?? DEFAULT_MAX_BYTES, options.now ?? new Date());
    mkdirSync(dirname(auditPath), { recursive: true });
    appendFileSync(auditPath, `${JSON.stringify(envelope)}\n`, 'utf8');
    return { written: true, auditPath };
  } catch (error: unknown) {
    return {
      written: false,
      auditPath,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function computeSearchDecisionSlaMetrics(
  envelopes: readonly SearchDecisionEnvelope[],
): SearchDecisionSlaMetrics {
  const latencies = envelopes.map((envelope) => envelope.latencyMs).filter(isFiniteNumber).sort(ascending);
  const decisionClassDistribution: Record<string, number> = {};
  const stageLatencies: Record<string, number[]> = {};
  let refusalCount = 0;
  let rerankTriggerCount = 0;

  for (const envelope of envelopes) {
    const decisionClass = envelope.trustTree?.decision ?? 'unknown';
    decisionClassDistribution[decisionClass] = (decisionClassDistribution[decisionClass] ?? 0) + 1;

    if (envelope.trustTree?.signals.some((signal) => (
      signal.source === 'memory.responsePolicy'
      && /refuse/i.test(signal.summary)
    ))) {
      refusalCount += 1;
    }

    if ((envelope.rerankGateDecision?.triggers.length ?? 0) > 0) {
      rerankTriggerCount += 1;
    }

    const timing = readPipelineTiming(envelope);
    for (const [stage, value] of Object.entries(timing)) {
      if (!isFiniteNumber(value)) continue;
      stageLatencies[stage] = [...(stageLatencies[stage] ?? []), value];
    }
  }

  const latencyByStage: SearchDecisionSlaMetrics['latencyByStage'] = {};
  for (const [stage, values] of Object.entries(stageLatencies)) {
    const sorted = values.slice().sort(ascending);
    latencyByStage[stage] = {
      averageMs: round(average(sorted)),
      p95Ms: round(percentile(sorted, 0.95)),
    };
  }

  return {
    count: envelopes.length,
    averageLatencyMs: round(average(latencies)),
    p95LatencyMs: round(percentile(latencies, 0.95)),
    decisionClassDistribution,
    refusalRate: envelopes.length > 0 ? round(refusalCount / envelopes.length) : 0,
    rerankTriggerRate: envelopes.length > 0 ? round(rerankTriggerCount / envelopes.length) : 0,
    latencyByStage,
  };
}

function rotateIfNeeded(auditPath: string, maxBytes: number, now: Date): void {
  if (!existsSync(auditPath)) return;
  const size = statSync(auditPath).size;
  if (size <= maxBytes) return;
  const suffix = now.toISOString().replace(/[:.]/g, '-');
  renameSync(auditPath, `${auditPath}.${suffix}.rotated`);
}

function readPipelineTiming(envelope: SearchDecisionEnvelope): Record<string, number> {
  const raw = (envelope as unknown as { pipelineTiming?: unknown }).pipelineTiming;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const timing: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (isFiniteNumber(value)) timing[key] = value;
  }
  return timing;
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function percentile(values: readonly number[], p: number): number {
  if (values.length === 0) return 0;
  const index = Math.min(values.length - 1, Math.ceil(values.length * p) - 1);
  return values[index] ?? 0;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function ascending(left: number, right: number): number {
  return left - right;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export {
  computeSearchDecisionSlaMetrics,
  recordSearchDecision,
};

