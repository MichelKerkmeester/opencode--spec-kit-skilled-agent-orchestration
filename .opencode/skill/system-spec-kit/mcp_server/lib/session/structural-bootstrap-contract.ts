// ───────────────────────────────────────────────────────────────
// MODULE: Structural Bootstrap Contract Type
// ───────────────────────────────────────────────────────────────
// F-017-D2-01: Type-only seam shared by `lib/session/session-snapshot.ts`
// (the contract producer) and `hooks/memory-surface.ts` (a contract consumer
// that previously imported from session-snapshot, creating a value-level
// cycle because session-snapshot in turn imported `isSessionPrimed` and
// `getLastActiveSessionId` from memory-surface). Extracting the type into
// this neutral module breaks the cycle: both modules depend inward on this
// type-only seam without depending on each other's runtime values.

import type { SharedPayloadProvenance } from '../context/shared-payload.js';

/**
 * Phase 027: Structural Bootstrap Contract — shared by all non-hook surfaces.
 * Single source of truth for structural context in startup/recovery flows.
 * Token budget: 250-400 tokens (hard ceiling 500 including guidance).
 */
export interface StructuralBootstrapContract {
  status: 'ready' | 'stale' | 'missing';
  summary: string;
  highlights?: string[];
  recommendedAction: string;
  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
  provenance?: SharedPayloadProvenance;
}
