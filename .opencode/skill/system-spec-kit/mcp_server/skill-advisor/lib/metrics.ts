// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Hook Metrics Contract
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import type {
  AdvisorHookFreshness,
  AdvisorHookStatus,
  AdvisorRuntime,
} from './skill-advisor-brief.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export const ADVISOR_RUNTIME_VALUES = ['claude', 'gemini', 'copilot', 'codex'] as const;
export const ADVISOR_HOOK_STATUS_VALUES = ['ok', 'skipped', 'stale', 'degraded', 'fail_open'] as const;
export const ADVISOR_HOOK_FRESHNESS_VALUES = ['live', 'stale', 'absent', 'unavailable'] as const;
export const ADVISOR_ERROR_CODE_VALUES = [
  'TIMEOUT',
  'SCRIPT_MISSING',
  'SQLITE_BUSY',
  'PARSE_FAIL',
  'SIGNAL_KILLED',
  'GENERATION_COUNTER_CORRUPT',
  'PYTHON_MISSING',
  'NONZERO_EXIT',
  'SQLITE_BUSY_EXHAUSTED',
  'DELETED_SKILL',
  'UNKNOWN',
] as const;

export type AdvisorErrorCode = (typeof ADVISOR_ERROR_CODE_VALUES)[number];
export type AdvisorMetricType = 'counter' | 'histogram' | 'gauge';
export type AdvisorOutcome = 'accepted' | 'corrected' | 'ignored';

export interface AdvisorMetricDefinition {
  readonly name: string;
  readonly type: AdvisorMetricType;
  readonly labels: readonly string[];
}

export interface AdvisorHookDiagnosticRecord {
  readonly timestamp: string;
  readonly runtime: AdvisorRuntime;
  readonly status: AdvisorHookStatus;
  readonly freshness: AdvisorHookFreshness;
  readonly durationMs: number;
  readonly cacheHit: boolean;
  readonly errorCode?: AdvisorErrorCode;
  readonly errorDetails?: string;
  readonly skillLabel?: string;
  readonly generation?: number;
}

export interface AdvisorHookHealthSection {
  readonly key: 'advisor-hook-health';
  readonly lastInvocations: readonly AdvisorHookDiagnosticRecord[];
  readonly rollingCacheHitRate: number;
  readonly rollingP95Ms: number;
  readonly rollingFailOpenRate: number;
}

export interface AdvisorHookAlertThresholds {
  readonly failOpenWarnRate: number;
  readonly failOpenPageRate: number;
  readonly cacheHitP95WarnMs: number;
  readonly cacheHitP95PageMs: number;
}

export interface AdvisorHookMetricSnapshot {
  readonly definitions: readonly AdvisorMetricDefinition[];
  readonly records: readonly AdvisorHookDiagnosticRecord[];
}

export interface AdvisorHookOutcomeRecord {
  readonly timestamp: string;
  readonly runtime: AdvisorRuntime;
  readonly outcome: AdvisorOutcome;
  readonly skillLabel: string;
  readonly correctedSkillLabel?: string;
}

export interface AdvisorHookOutcomeSummary {
  readonly records: readonly AdvisorHookOutcomeRecord[];
  readonly totals: {
    readonly accepted: number;
    readonly corrected: number;
    readonly ignored: number;
  };
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const ADVISOR_HOOK_METRIC_DEFINITIONS = [
  {
    name: 'speckit_advisor_hook_duration_ms',
    type: 'histogram',
    labels: ['runtime', 'status', 'freshness', 'cacheHit'],
  },
  {
    name: 'speckit_advisor_hook_invocations_total',
    type: 'counter',
    labels: ['runtime', 'status'],
  },
  {
    name: 'speckit_advisor_hook_cache_hits_total',
    type: 'counter',
    labels: ['runtime'],
  },
  {
    name: 'speckit_advisor_hook_cache_misses_total',
    type: 'counter',
    labels: ['runtime'],
  },
  {
    name: 'speckit_advisor_hook_fail_open_total',
    type: 'counter',
    labels: ['runtime', 'errorCode'],
  },
  {
    name: 'speckit_advisor_hook_freshness_state',
    type: 'gauge',
    labels: ['runtime', 'state'],
  },
] as const satisfies readonly AdvisorMetricDefinition[];

const FORBIDDEN_DIAGNOSTIC_FIELDS = new Set([
  'prompt',
  'promptFingerprint',
  'promptExcerpt',
  'stdout',
  'stderr',
]);

const DEFAULT_ALERT_THRESHOLDS: AdvisorHookAlertThresholds = {
  failOpenWarnRate: 0.02,
  failOpenPageRate: 0.05,
  cacheHitP95WarnMs: 75,
  cacheHitP95PageMs: 150,
};

const MAX_HEALTH_RECORDS = 30;
const MAX_DURABLE_DIAGNOSTIC_RECORDS = 200;
const MAX_DURABLE_OUTCOME_RECORDS = 200;
const DURABLE_METRICS_ROOT = join(tmpdir(), 'speckit-skill-advisor-metrics');

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function enumIncludes<T extends readonly string[]>(values: T, value: unknown): value is T[number] {
  return typeof value === 'string' && values.includes(value);
}

function normalizeErrorCode(value: unknown): AdvisorErrorCode | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (enumIncludes(ADVISOR_ERROR_CODE_VALUES, value)) {
    return value;
  }
  if (value === 'JSON_PARSE_FAILED' || value === 'INVALID_JSON_SHAPE') {
    return 'PARSE_FAIL';
  }
  if (value === 'SQLITE_BUSY_EXHAUSTED') {
    return 'SQLITE_BUSY_EXHAUSTED';
  }
  if (value === 'NON_ZERO_EXIT' || value === 'NONZERO_EXIT') {
    return 'NONZERO_EXIT';
  }
  return 'UNKNOWN';
}

function sanitizeDiagnosticText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const compact = value.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
  return compact ? compact.slice(0, 240) : undefined;
}

function sanitizeSkillLabel(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const compact = value.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
  return compact ? compact.slice(0, 160) : undefined;
}

function percentile(values: readonly number[], percentileValue: number): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((percentileValue / 100) * sorted.length) - 1),
  );
  return Number(sorted[index]?.toFixed(3) ?? 0);
}

function envNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined) {
    return fallback;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ensureParentDir(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
}

function workspaceHash(workspaceRoot: string): string {
  return createHash('sha256')
    .update(resolve(workspaceRoot))
    .digest('hex')
    .slice(0, 16);
}

function durableMetricsPath(workspaceRoot: string, kind: 'diagnostics' | 'outcomes'): string {
  return join(DURABLE_METRICS_ROOT, `${workspaceHash(workspaceRoot)}-${kind}.jsonl`);
}

function readJsonlLines(path: string): string[] {
  if (!existsSync(path)) {
    return [];
  }
  return readFileSync(path, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function writeBoundedJsonl(path: string, line: string, maxRecords: number): void {
  ensureParentDir(path);
  const lines = readJsonlLines(path);
  lines.push(line);
  writeFileSync(path, `${lines.slice(-maxRecords).join('\n')}\n`, 'utf8');
}

function tryParseJsonLine(line: string): unknown | null {
  try {
    return JSON.parse(line) as unknown;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

/** Return the stable metric definitions emitted by advisor hook diagnostics. */
export function getAdvisorHookMetricDefinitions(): readonly AdvisorMetricDefinition[] {
  return ADVISOR_HOOK_METRIC_DEFINITIONS;
}

/** Read alert thresholds from environment with conservative defaults. */
export function getAdvisorHookAlertThresholds(): AdvisorHookAlertThresholds {
  return {
    failOpenWarnRate: envNumber('SPECKIT_ADVISOR_HOOK_FAILOPEN_WARN_RATE', DEFAULT_ALERT_THRESHOLDS.failOpenWarnRate),
    failOpenPageRate: envNumber('SPECKIT_ADVISOR_HOOK_FAILOPEN_PAGE_RATE', DEFAULT_ALERT_THRESHOLDS.failOpenPageRate),
    cacheHitP95WarnMs: envNumber('SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS', DEFAULT_ALERT_THRESHOLDS.cacheHitP95WarnMs),
    cacheHitP95PageMs: envNumber('SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_PAGE_MS', DEFAULT_ALERT_THRESHOLDS.cacheHitP95PageMs),
  };
}

/** Build a prompt-safe diagnostic record from hook execution metadata. */
export function createAdvisorHookDiagnosticRecord(input: {
  readonly runtime: AdvisorRuntime;
  readonly status: AdvisorHookStatus;
  readonly freshness: AdvisorHookFreshness;
  readonly durationMs: number;
  readonly cacheHit: boolean;
  readonly errorCode?: unknown;
  readonly errorDetails?: unknown;
  readonly skillLabel?: string | null;
  readonly generation?: number;
  readonly timestamp?: string;
}): AdvisorHookDiagnosticRecord {
  const errorCode = normalizeErrorCode(input.errorCode);
  const errorDetails = sanitizeDiagnosticText(input.errorDetails);
  return {
    timestamp: input.timestamp ?? new Date().toISOString(),
    runtime: input.runtime,
    status: input.status,
    freshness: input.freshness,
    durationMs: Math.max(0, Math.round(input.durationMs)),
    cacheHit: input.cacheHit,
    ...(errorCode ? { errorCode } : {}),
    ...(errorDetails ? { errorDetails } : {}),
    ...(input.skillLabel ? { skillLabel: input.skillLabel } : {}),
    ...(typeof input.generation === 'number' ? { generation: input.generation } : {}),
  };
}

/** Validate that a diagnostic record matches the prompt-free closed schema. */
export function validateAdvisorHookDiagnosticRecord(value: unknown): value is AdvisorHookDiagnosticRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  if ([...FORBIDDEN_DIAGNOSTIC_FIELDS].some((field) => field in record)) {
    return false;
  }
  return typeof record.timestamp === 'string'
    && enumIncludes(ADVISOR_RUNTIME_VALUES, record.runtime)
    && enumIncludes(ADVISOR_HOOK_STATUS_VALUES, record.status)
    && enumIncludes(ADVISOR_HOOK_FRESHNESS_VALUES, record.freshness)
    && typeof record.durationMs === 'number'
    && typeof record.cacheHit === 'boolean'
    && (record.errorCode === undefined || enumIncludes(ADVISOR_ERROR_CODE_VALUES, record.errorCode))
    && (record.errorDetails === undefined || typeof record.errorDetails === 'string')
    && (record.skillLabel === undefined || typeof record.skillLabel === 'string')
    && (record.generation === undefined || typeof record.generation === 'number');
}

/** Serialize a validated diagnostic record for JSONL emission. */
export function serializeAdvisorHookDiagnosticRecord(record: AdvisorHookDiagnosticRecord): string {
  if (!validateAdvisorHookDiagnosticRecord(record)) {
    throw new Error(
      `AdvisorHookDiagnosticRecord: expected prompt-free closed-schema diagnostic record; actual ${typeof record}.`,
    );
  }
  return JSON.stringify(record);
}

export function persistAdvisorHookDiagnosticRecord(
  workspaceRoot: string,
  record: AdvisorHookDiagnosticRecord,
): string {
  const path = durableMetricsPath(workspaceRoot, 'diagnostics');
  writeBoundedJsonl(path, serializeAdvisorHookDiagnosticRecord(record), MAX_DURABLE_DIAGNOSTIC_RECORDS);
  return path;
}

export function readAdvisorHookDiagnosticRecords(
  workspaceRoot: string,
  limit = MAX_DURABLE_DIAGNOSTIC_RECORDS,
): AdvisorHookDiagnosticRecord[] {
  return readJsonlLines(durableMetricsPath(workspaceRoot, 'diagnostics'))
    .slice(-limit)
    .map((line) => JSON.parse(line) as unknown)
    .filter(validateAdvisorHookDiagnosticRecord);
}

/** Build the rolling health section shown in advisor observability output. */
export function buildAdvisorHookHealthSection(
  records: readonly AdvisorHookDiagnosticRecord[],
): AdvisorHookHealthSection {
  const lastInvocations = records.slice(-MAX_HEALTH_RECORDS);
  const cacheHits = lastInvocations.filter((record) => record.cacheHit).length;
  const failOpen = lastInvocations.filter((record) => record.status === 'fail_open').length;
  return {
    key: 'advisor-hook-health',
    lastInvocations,
    rollingCacheHitRate: lastInvocations.length > 0 ? cacheHits / lastInvocations.length : 0,
    rollingP95Ms: percentile(
      lastInvocations.filter((record) => record.cacheHit).map((record) => record.durationMs),
      95,
    ),
    rollingFailOpenRate: lastInvocations.length > 0 ? failOpen / lastInvocations.length : 0,
  };
}

export function readAdvisorHookHealthSection(workspaceRoot: string): AdvisorHookHealthSection {
  return buildAdvisorHookHealthSection(readAdvisorHookDiagnosticRecords(workspaceRoot));
}

export function advisorHookDiagnosticsPath(workspaceRoot: string): string {
  return durableMetricsPath(workspaceRoot, 'diagnostics');
}

export function createAdvisorHookOutcomeRecord(input: {
  readonly runtime: AdvisorRuntime;
  readonly outcome: AdvisorOutcome;
  readonly skillLabel: string;
  readonly correctedSkillLabel?: string | null;
  readonly timestamp?: string;
}): AdvisorHookOutcomeRecord {
  return {
    timestamp: input.timestamp ?? new Date().toISOString(),
    runtime: input.runtime,
    outcome: input.outcome,
    skillLabel: sanitizeSkillLabel(input.skillLabel) ?? 'unknown-skill',
    ...(sanitizeSkillLabel(input.correctedSkillLabel) ? { correctedSkillLabel: sanitizeSkillLabel(input.correctedSkillLabel) } : {}),
  };
}

export function validateAdvisorHookOutcomeRecord(value: unknown): value is AdvisorHookOutcomeRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.timestamp === 'string'
    && enumIncludes(ADVISOR_RUNTIME_VALUES, record.runtime)
    && (record.outcome === 'accepted' || record.outcome === 'corrected' || record.outcome === 'ignored')
    && typeof record.skillLabel === 'string'
    && (record.correctedSkillLabel === undefined || typeof record.correctedSkillLabel === 'string');
}

export function persistAdvisorHookOutcomeRecord(
  workspaceRoot: string,
  record: AdvisorHookOutcomeRecord,
): string {
  const path = durableMetricsPath(workspaceRoot, 'outcomes');
  writeBoundedJsonl(path, JSON.stringify(record), MAX_DURABLE_OUTCOME_RECORDS);
  return path;
}

export function readAdvisorHookOutcomeRecords(
  workspaceRoot: string,
  limit = MAX_DURABLE_OUTCOME_RECORDS,
): AdvisorHookOutcomeRecord[] {
  return readJsonlLines(durableMetricsPath(workspaceRoot, 'outcomes'))
    .slice(-limit)
    .map((line) => tryParseJsonLine(line))
    .filter(validateAdvisorHookOutcomeRecord);
}

export function summarizeAdvisorHookOutcomeRecords(
  workspaceRoot: string,
): AdvisorHookOutcomeSummary {
  const records = readAdvisorHookOutcomeRecords(workspaceRoot);
  const totals = {
    accepted: records.filter((record) => record.outcome === 'accepted').length,
    corrected: records.filter((record) => record.outcome === 'corrected').length,
    ignored: records.filter((record) => record.outcome === 'ignored').length,
  };
  return { records, totals };
}

export function advisorHookOutcomesPath(workspaceRoot: string): string {
  return durableMetricsPath(workspaceRoot, 'outcomes');
}

/** Small in-memory collector for advisor hook metrics and health snapshots. */
export class AdvisorHookMetricsCollector {
  private readonly records: AdvisorHookDiagnosticRecord[] = [];

  record(record: AdvisorHookDiagnosticRecord): void {
    if (!validateAdvisorHookDiagnosticRecord(record)) {
      throw new Error(
        `AdvisorHookDiagnosticRecord: expected prompt-free closed-schema diagnostic record; actual ${typeof record}.`,
      );
    }
    this.records.push(record);
  }

  snapshot(): AdvisorHookMetricSnapshot {
    return {
      definitions: ADVISOR_HOOK_METRIC_DEFINITIONS,
      records: [...this.records],
    };
  }

  healthSection(): AdvisorHookHealthSection {
    return buildAdvisorHookHealthSection(this.records);
  }

  reset(): void {
    this.records.length = 0;
  }
}
