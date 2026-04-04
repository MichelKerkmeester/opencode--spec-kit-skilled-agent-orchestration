declare const SUPPORTED_PHASES_ARRAY: readonly ["baseline", "lineage", "graph", "adaptive", "scope-governance", "shared-rollout"];
/** Canonical rollout phases used by memory roadmap tracking. */
type MemoryRoadmapPhase = typeof SUPPORTED_PHASES_ARRAY[number];
/** Capability flags tracked for phased rollout. */
interface MemoryRoadmapCapabilityFlags {
    lineageState: boolean;
    graphUnified: boolean;
    adaptiveRanking: boolean;
    scopeEnforcement: boolean;
    governanceGuardrails: boolean;
    sharedMemory: boolean;
}
/** Rollout defaults snapshot for telemetry and migration checkpoints. */
interface MemoryRoadmapDefaults {
    phase: MemoryRoadmapPhase;
    capabilities: MemoryRoadmapCapabilityFlags;
    scopeDimensionsTracked: number;
}
/**
 * SPECKIT_PARSER — Structural parser backend selector.
 *
 * Controls which parsing backend the structural indexer uses for code-graph
 * symbol extraction. Evaluated at first parse call; cannot be changed mid-session.
 *
 * | Value        | Description                                                 |
 * |--------------|-------------------------------------------------------------|
 * | `treesitter` | (default) AST-accurate parsing via web-tree-sitter WASM    |
 * | `regex`      | Lightweight regex-based fallback — no WASM dependencies     |
 *
 * Runtime: `lib/code-graph/structural-indexer.ts::getParser()`
 * Example: `SPECKIT_PARSER=regex node context-server.js`
 */
declare const SPECKIT_PARSER_ENV: "SPECKIT_PARSER";
declare const CAPABILITY_ENV: {
    readonly lineageState: "SPECKIT_MEMORY_LINEAGE_STATE";
    readonly graphUnified: "SPECKIT_MEMORY_GRAPH_UNIFIED";
    readonly adaptiveRanking: "SPECKIT_MEMORY_ADAPTIVE_RANKING";
    readonly scopeEnforcement: "SPECKIT_MEMORY_SCOPE_ENFORCEMENT";
    readonly governanceGuardrails: "SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS";
    readonly sharedMemory: "SPECKIT_MEMORY_SHARED_MEMORY";
};
/** Returns the roadmap capability state, with optional default-off dormant flags. */
declare function isMemoryRoadmapCapabilityEnabled(flagNames: string | readonly string[], identity?: string, defaultValue?: boolean): boolean;
/** Resolves the active memory roadmap phase from env, defaulting to shared-rollout. */
declare function getMemoryRoadmapPhase(): MemoryRoadmapPhase;
/** Returns the full capability snapshot for memory roadmap controls. */
declare function getMemoryRoadmapCapabilityFlags(identity?: string): MemoryRoadmapCapabilityFlags;
/** Returns defaults consumed by telemetry/checkpoint paths for phase tracking. */
declare function getMemoryRoadmapDefaults(identity?: string): MemoryRoadmapDefaults;
export { 
/** @internal — test-only, not part of public API */
CAPABILITY_ENV, getMemoryRoadmapCapabilityFlags, getMemoryRoadmapDefaults, getMemoryRoadmapPhase, 
/** @internal — exposed for test utilities only */
isMemoryRoadmapCapabilityEnabled, 
/** F044: Documented parser backend env var name */
SPECKIT_PARSER_ENV, };
export type { MemoryRoadmapCapabilityFlags, MemoryRoadmapDefaults, MemoryRoadmapPhase, };
//# sourceMappingURL=capability-flags.d.ts.map