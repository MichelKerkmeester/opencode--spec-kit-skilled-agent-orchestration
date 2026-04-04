// ───────────────────────────────────────────────────────────────
// MODULE: Graph Flags
// ───────────────────────────────────────────────────────────────
// Feature catalog: Typed-weighted degree channel
// Legacy compatibility shim retained for test/runtime imports.
import { isFeatureEnabled } from '../cognitive/rollout-policy.js';
import { resolveGraphWalkRolloutState, isTypedTraversalEnabled as resolveTypedTraversalFlag, } from './search-flags.js';
/**
 * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
 */
export function isGraphUnifiedEnabled() {
    return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
}
/**
 * Graph-walk rollout alignment shim.
 *
 * Keeps legacy graph-flag imports aligned with the newer graph-walk rollout
 * ladder defined in `search-flags.ts`.
 */
export function getGraphWalkRolloutState() {
    return resolveGraphWalkRolloutState();
}
/**
 * Whether graph-walk diagnostics should be visible on the trace path.
 */
export function isGraphWalkTraceEnabled() {
    return getGraphWalkRolloutState() !== 'off';
}
/**
 * Whether bounded graph-walk score adjustments are active at runtime.
 */
export function isGraphWalkRuntimeEnabled() {
    return getGraphWalkRolloutState() === 'bounded_runtime';
}
/**
 * Legacy export shim for the typed traversal rollout flag.
 */
export function isTypedTraversalEnabled() {
    return resolveTypedTraversalFlag();
}
//# sourceMappingURL=graph-flags.js.map