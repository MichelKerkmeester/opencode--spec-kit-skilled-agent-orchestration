import { appendFileSync, mkdirSync } from 'node:fs';
import * as path from 'node:path';

export interface CanonicalContinuityRoutingAuditEntry {
  ts: string;
  component: 'content-router';
  code: 'CR001';
  chunk_id: string;
  chunk_text_preview: string;
  chunk_hash: string;
  tier_used: 1 | 2 | 3;
  category: string;
  confidence: number;
  target_doc: string;
  target_anchor: string;
  merge_mode: string;
  alternatives: Array<{ cat: string; conf: number }>;
  decision_latency_ms: number;
  spec_folder: string;
  session_id: string | null;
}

export interface CanonicalContinuityShadowRoute {
  category: string;
  confidence: number;
  tierUsed: 1 | 2 | 3;
  target: {
    docPath: string;
    anchorId: string;
    mergeMode: string;
  };
}

export interface CanonicalContinuityShadowPlanLike {
  status: 'planned' | 'refused' | 'unavailable';
  warnings: string[];
  legacyMemoryWritePreserved: boolean;
  route: CanonicalContinuityShadowRoute | null;
  continuity: {
    ok: boolean;
    bytes: number | null;
    errors: string[];
  };
  routingAudit?: CanonicalContinuityRoutingAuditEntry | null;
}

export interface CanonicalContinuityShadowCompareEntry {
  ts: string;
  component: 'canonical-continuity-shadow';
  code: 'CCS001';
  span: 'save.shadow.compare_write';
  spec_folder: string;
  rollout_state: 'shadow_only';
  result_kind: 'hit' | 'refuse' | 'fallback';
  shadow_result: 'match' | 'mismatch' | 'degraded';
  query_class: 'shadow';
  primary_metric: 'route_confidence';
  primary_value: number;
  confidence_tier: 'high' | 'audit' | 'warn' | 'refuse';
  legacy_doc_path: string;
  new_doc_path: string | null;
  new_anchor_id: string | null;
  merge_mode: string | null;
  route_category: string | null;
  tier_used: 'none' | 'tier1' | 'tier2' | 'tier3';
  continuity_ok: boolean;
  continuity_bytes: number | null;
  warning_count: number;
  error_count: number;
  legacy_memory_write_preserved: boolean;
  session_id: string | null;
}

export interface PersistCanonicalContinuityShadowArtifactsInput {
  now?: Date;
  specFolderAbsolute: string;
  specFolderRelative: string;
  sessionId?: string | null;
  legacyMemoryPath: string;
  plan: CanonicalContinuityShadowPlanLike;
}

export interface PersistCanonicalContinuityShadowArtifactsResult {
  routingAuditPath: string | null;
  shadowComparePath: string;
  shadowCompareEntry: CanonicalContinuityShadowCompareEntry;
}

function buildDailyJsonlPath(
  specFolderAbsolute: string,
  prefix: string,
  now: Date,
): string {
  const stamp = now.toISOString().slice(0, 10);
  return path.join(specFolderAbsolute, 'scratch', `${prefix}-${stamp}.jsonl`);
}

function appendJsonlEntry(targetPath: string, payload: object): void {
  mkdirSync(path.dirname(targetPath), { recursive: true });
  appendFileSync(targetPath, `${JSON.stringify(payload)}\n`, 'utf8');
}

function resolveResultKind(
  status: CanonicalContinuityShadowPlanLike['status'],
): CanonicalContinuityShadowCompareEntry['result_kind'] {
  if (status === 'planned') {
    return 'hit';
  }
  if (status === 'refused') {
    return 'refuse';
  }
  return 'fallback';
}

function resolveShadowResult(
  plan: CanonicalContinuityShadowPlanLike,
): CanonicalContinuityShadowCompareEntry['shadow_result'] {
  if (plan.status === 'unavailable') {
    return 'mismatch';
  }
  if (plan.status === 'refused' || !plan.continuity.ok) {
    return 'degraded';
  }
  return 'match';
}

function resolveConfidenceTier(
  plan: CanonicalContinuityShadowPlanLike,
): CanonicalContinuityShadowCompareEntry['confidence_tier'] {
  if (plan.status === 'refused') {
    return 'refuse';
  }
  const confidence = plan.route?.confidence ?? 0;
  if (confidence >= 0.9) {
    return 'high';
  }
  if (confidence >= 0.7) {
    return 'audit';
  }
  return 'warn';
}

function resolveTierUsed(
  route: CanonicalContinuityShadowPlanLike['route'],
): CanonicalContinuityShadowCompareEntry['tier_used'] {
  if (!route) {
    return 'none';
  }
  return `tier${route.tierUsed}` as CanonicalContinuityShadowCompareEntry['tier_used'];
}

function buildShadowCompareEntry(
  input: PersistCanonicalContinuityShadowArtifactsInput,
  now: Date,
): CanonicalContinuityShadowCompareEntry {
  return {
    ts: now.toISOString(),
    component: 'canonical-continuity-shadow',
    code: 'CCS001',
    span: 'save.shadow.compare_write',
    spec_folder: input.specFolderRelative,
    rollout_state: 'shadow_only',
    result_kind: resolveResultKind(input.plan.status),
    shadow_result: resolveShadowResult(input.plan),
    query_class: 'shadow',
    primary_metric: 'route_confidence',
    primary_value: input.plan.route?.confidence ?? 0,
    confidence_tier: resolveConfidenceTier(input.plan),
    legacy_doc_path: input.legacyMemoryPath,
    new_doc_path: input.plan.route?.target.docPath ?? null,
    new_anchor_id: input.plan.route?.target.anchorId ?? null,
    merge_mode: input.plan.route?.target.mergeMode ?? null,
    route_category: input.plan.route?.category ?? null,
    tier_used: resolveTierUsed(input.plan.route),
    continuity_ok: input.plan.continuity.ok,
    continuity_bytes: input.plan.continuity.bytes,
    warning_count: input.plan.warnings.length,
    error_count: input.plan.continuity.errors.length,
    legacy_memory_write_preserved: input.plan.legacyMemoryWritePreserved,
    session_id: input.sessionId ?? null,
  };
}

export function persistCanonicalContinuityShadowArtifacts(
  input: PersistCanonicalContinuityShadowArtifactsInput,
): PersistCanonicalContinuityShadowArtifactsResult {
  const now = input.now ?? new Date();
  const routingAuditPath = input.plan.routingAudit
    ? buildDailyJsonlPath(input.specFolderAbsolute, 'routing-audit', now)
    : null;
  if (routingAuditPath && input.plan.routingAudit) {
    appendJsonlEntry(routingAuditPath, input.plan.routingAudit);
  }

  const shadowCompareEntry = buildShadowCompareEntry(input, now);
  const shadowComparePath = buildDailyJsonlPath(input.specFolderAbsolute, 'shadow-compare', now);
  appendJsonlEntry(shadowComparePath, shadowCompareEntry);

  return {
    routingAuditPath,
    shadowComparePath,
    shadowCompareEntry,
  };
}
