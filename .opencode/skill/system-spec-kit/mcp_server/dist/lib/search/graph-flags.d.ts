import { type GraphWalkRolloutState } from './search-flags.js';
/**
 * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
 */
export declare function isGraphUnifiedEnabled(): boolean;
/**
 * Graph-walk rollout alignment shim.
 *
 * Keeps legacy graph-flag imports aligned with the newer graph-walk rollout
 * ladder defined in `search-flags.ts`.
 */
export declare function getGraphWalkRolloutState(): GraphWalkRolloutState;
/**
 * Whether graph-walk diagnostics should be visible on the trace path.
 */
export declare function isGraphWalkTraceEnabled(): boolean;
/**
 * Whether bounded graph-walk score adjustments are active at runtime.
 */
export declare function isGraphWalkRuntimeEnabled(): boolean;
/**
 * Legacy export shim for the typed traversal rollout flag.
 */
export declare function isTypedTraversalEnabled(): boolean;
//# sourceMappingURL=graph-flags.d.ts.map