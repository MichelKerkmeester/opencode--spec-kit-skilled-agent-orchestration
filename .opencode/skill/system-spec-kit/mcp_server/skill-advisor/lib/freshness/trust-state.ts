// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Freshness Trust State
// ───────────────────────────────────────────────────────────────
// PR 4 / F71 / F17 / F18: canonical TrustState surface. This module is
// the SINGLE source of truth for the 4-value caller-trust axis used by
// every freshness producer (advisor, hook brief, code-graph handlers).
//
// Migration map (V1-V5 → canonical):
//   V1  ensure-ready GraphFreshness = 'fresh' | 'stale' | 'empty'
//       → DELETED, re-exported from ops-hardening (V2 superset).
//   V2  ops-hardening GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error'
//       → CANONICAL L1 storage vocabulary (graph internal state).
//   V3  ops-hardening StructuralReadiness = 'ready' | 'stale' | 'missing'
//       → CANONICAL L2 readiness vocabulary (handler-level summary).
//   V4  startup-brief graphState = 'ready' | 'stale' | 'empty' | 'missing'
//       → CANONICAL L4 startup-surface vocabulary (now also accepts
//         'error' via the trustStateFromGraphState mapper widening).
//   V5  SkillGraphTrustState = 'live' | 'stale' | 'absent' | 'unavailable'
//       → CANONICAL L3 caller-trust vocabulary (THIS module). Widened
//         to include 'unavailable' for unreachable scopes.
//
// Cross-module mapping (V2 → V5 via readiness-contract.ts):
//   'fresh' → 'live'
//   'stale' → 'stale'
//   'empty' → 'absent'
//   'error' → 'unavailable'  ← PR 4 widening
//
// During the migration window we keep the SharedPayloadTrustState super-
// type (8 values) as the wire-level union and re-export the 4-value
// SkillGraphTrustState here as the advisor-facing alias. External
// consumers should depend on `SkillGraphTrustState` from this module
// rather than carving out their own narrower unions.

import { isSpeckitMetricsEnabled, speckitMetrics } from '../metrics.js';

export type { GraphFreshness, StructuralReadiness } from '../../../code-graph/lib/ops-hardening.js';

export type SkillGraphTrustState = 'live' | 'stale' | 'absent' | 'unavailable';
export type StartupGraphState = 'ready' | 'stale' | 'empty' | 'missing' | 'error';

let lastObservedTrustState: SkillGraphTrustState | null = null;

function recordTrustStateTransition(next: SkillGraphTrustState): void {
  if (!isSpeckitMetricsEnabled()) {
    lastObservedTrustState = next;
    return;
  }
  const previous = lastObservedTrustState;
  if (previous !== null && previous !== next) {
    speckitMetrics.incrementCounter('spec_kit.freshness.state_transitions_total', { from_state: previous, to_state: next });
  }
  lastObservedTrustState = next;
}

/**
 * Canonical alias used by callers that previously imported a custom
 * `TrustState` type. Use `SkillGraphTrustState` for new code.
 *
 * @deprecated Use `SkillGraphTrustState` directly. Kept for one release
 *   so in-flight branches keep compiling against the canonical vocabulary.
 */
export type TrustState = SkillGraphTrustState;

export interface TrustStateSnapshot {
  readonly state: SkillGraphTrustState;
  readonly reason: string | null;
  readonly generation: number;
  readonly checkedAt: string;
  readonly lastLiveAt: string | null;
}

export interface TrustStateInput {
  readonly hasSources: boolean;
  readonly hasArtifact: boolean;
  readonly sourceChanged: boolean;
  readonly daemonAvailable: boolean;
  readonly generation: number;
  readonly reason?: string | null;
  readonly now?: Date;
  readonly lastLiveAt?: string | null;
}

export function createTrustState(input: TrustStateInput): TrustStateSnapshot {
  const checkedAt = (input.now ?? new Date()).toISOString();
  const snapshot = computeTrustState(input, checkedAt);
  recordTrustStateTransition(snapshot.state);
  return snapshot;
}

function computeTrustState(input: TrustStateInput, checkedAt: string): TrustStateSnapshot {
  if (!input.daemonAvailable) {
    return {
      state: 'unavailable',
      reason: input.reason ?? 'DAEMON_UNAVAILABLE',
      generation: input.generation,
      checkedAt,
      lastLiveAt: input.lastLiveAt ?? null,
    };
  }

  if (!input.hasSources || !input.hasArtifact) {
    return {
      state: 'absent',
      reason: input.reason ?? (input.hasSources ? 'SKILL_GRAPH_ABSENT' : 'SKILL_SOURCES_ABSENT'),
      generation: input.generation,
      checkedAt,
      lastLiveAt: input.lastLiveAt ?? null,
    };
  }

  if (input.sourceChanged) {
    return {
      state: 'stale',
      reason: input.reason ?? 'SOURCE_NEWER_THAN_SKILL_GRAPH',
      generation: input.generation,
      checkedAt,
      lastLiveAt: input.lastLiveAt ?? null,
    };
  }

  return {
    state: 'live',
    reason: null,
    generation: input.generation,
    checkedAt,
    lastLiveAt: input.lastLiveAt ?? checkedAt,
  };
}

export function failOpenTrustState(reason: string, generation = 0): TrustStateSnapshot {
  return createTrustState({
    hasSources: false,
    hasArtifact: false,
    sourceChanged: false,
    daemonAvailable: false,
    generation,
    reason,
  });
}

export function isReaderUsable(state: SkillGraphTrustState): boolean {
  return state === 'live' || state === 'stale';
}
