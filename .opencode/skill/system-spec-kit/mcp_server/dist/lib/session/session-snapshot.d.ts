import { type SharedPayloadProvenance } from '../context/shared-payload.js';
export interface SessionSnapshot {
    specFolder: string | null;
    currentTask: string | null;
    graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
    cocoIndexAvailable: boolean;
    sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
    lastToolCallAgoMs: number | null;
    primed: boolean;
    routingRecommendation: string;
}
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
/** Build a read-only snapshot of the current session state. */
export declare function getSessionSnapshot(): SessionSnapshot;
/**
 * Phase 027: Build a structural bootstrap contract for a given surface.
 * Reuses resolveGraphFreshness() and getGraphStats() from this module.
 * Keeps output compact (targets 250-400 tokens, ceiling 500).
 */
export declare function buildStructuralBootstrapContract(sourceSurface: StructuralBootstrapContract['sourceSurface']): StructuralBootstrapContract;
//# sourceMappingURL=session-snapshot.d.ts.map