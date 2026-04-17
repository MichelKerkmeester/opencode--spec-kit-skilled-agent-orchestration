// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Readiness Contract (Shared)
// ───────────────────────────────────────────────────────────────
// Phase 017 / T-CGC-01: shared readiness contract for code-graph
// handlers. Extracted from handlers/code-graph/query.ts so the
// query handler and its 6 siblings (scan, status, context,
// ccc-status, ccc-reindex, ccc-feedback) can converge on one
// readiness vocabulary — see T-W1-CGC-03 (Wave B) for the
// propagation task that wires this contract into the remaining
// handlers.
//
// Scope: 4 helpers that map ensure-ready `GraphFreshness`
// ('fresh'|'stale'|'empty') onto:
//   1. the canonical ops-hardening `StructuralReadiness`
//      vocabulary ('ready'|'stale'|'missing') used by
//      session_bootstrap / session_resume, and
//   2. the shared-payload `SharedPayloadTrustState` axis
//      ('live'|'stale'|'absent' subset of the 8-state canonical).
//
// IMPORTANT: this module does NOT introduce a new trust-state
// enum. It consumes the canonical `SharedPayloadTrustState` from
// lib/context/shared-payload.ts (see M8 / T-SHP-01, R9-001). The
// handler-level helpers below only emit a 3-value subset
// (live|stale|absent) because ensure-ready only knows about
// three freshness states — that subset is a safe, forward-
// compatible projection over the canonical type.

import * as graphDb from './code-graph-db.js';
import type { ReadyResult } from './ensure-ready.js';
import type { StructuralReadiness } from './ops-hardening.js';
import type { SharedPayloadTrustState } from '../context/shared-payload.js';

// Re-export the surface types that downstream consumers (query.ts
// and its Wave B siblings) need so they can import everything
// readiness-related from a single module.
export type { ReadyResult } from './ensure-ready.js';
export type { StructuralReadiness } from './ops-hardening.js';
export type { SharedPayloadTrustState } from '../context/shared-payload.js';

/**
 * Map ensure-ready `GraphFreshness` onto the canonical
 * ops-hardening `StructuralReadiness` vocabulary. The canonical
 * vocabulary is the one emitted by session_bootstrap /
 * session_resume, so aligning query / scan / status / context
 * readiness on it gives consumers a single vocabulary across
 * every code-graph surface.
 *
 * Mapping:
 *   'fresh' → 'ready'
 *   'stale' → 'stale'
 *   'empty' → 'missing'
 *
 * Origin: M8 / T-CGQ-11 (R22-001, R23-001).
 */
export function canonicalReadinessFromFreshness(
  freshness: ReadyResult['freshness'],
): StructuralReadiness {
  switch (freshness) {
    case 'fresh':
      return 'ready';
    case 'stale':
      return 'stale';
    case 'empty':
      return 'missing';
  }
}

/**
 * Map ensure-ready `GraphFreshness` onto the shared-payload
 * `SharedPayloadTrustState` axis. Adds 'absent' for 'empty'
 * graphs so queries against an uninitialised store don't
 * masquerade as 'stale'.
 *
 * Mapping:
 *   'fresh' → 'live'
 *   'stale' → 'stale'
 *   'empty' → 'absent'
 *
 * The return type is the full canonical 8-state union
 * (`SharedPayloadTrustState`); the projection is a 3-value
 * subset. Callers must NOT narrow this to a custom 4-state enum —
 * see M8 / T-SHP-01 (R9-001).
 */
export function queryTrustStateFromFreshness(
  freshness: ReadyResult['freshness'],
): SharedPayloadTrustState {
  switch (freshness) {
    case 'fresh':
      return 'live';
    case 'stale':
      return 'stale';
    case 'empty':
      return 'absent';
  }
}

/**
 * Compute query-level detector provenance from the
 * last-persisted scan, returning an envelope that pairs the
 * provenance with its source label. Returns `undefined` when the
 * graph is empty (no scan has occurred) or when the db reports
 * no persisted provenance yet — callers should omit the
 * `graphMetadata` field entirely in that case rather than
 * surfacing a placeholder.
 *
 * Origin: M8 / T-CGQ-09 (R18-001, R20-003).
 */
export function buildQueryGraphMetadata(
  readiness: ReadyResult,
): Record<string, unknown> | undefined {
  if (readiness.freshness === 'empty') {
    return undefined;
  }

  const detectorProvenance = graphDb.getLastDetectorProvenance();
  if (!detectorProvenance) {
    return undefined;
  }

  return {
    detectorProvenance,
    detectorProvenanceSource: 'last-persisted-scan',
  };
}

/**
 * Build the readiness block emitted on every query-family
 * response payload. Preserves the raw ensure-ready fields so
 * existing consumers that key off `readiness.freshness` keep
 * working, and augments them with:
 *   - `canonicalReadiness` — the ops-hardening vocabulary
 *     (`ready|stale|missing`), aligned with session_bootstrap /
 *     session_resume.
 *   - `trustState` — the shared-payload axis
 *     (`live|stale|absent` subset of the canonical 8-state type).
 *
 * Origin: M8 / T-CGQ-11.
 */
export function buildReadinessBlock(readiness: ReadyResult) {
  return {
    ...readiness,
    canonicalReadiness: canonicalReadinessFromFreshness(readiness.freshness),
    trustState: queryTrustStateFromFreshness(readiness.freshness),
  };
}
