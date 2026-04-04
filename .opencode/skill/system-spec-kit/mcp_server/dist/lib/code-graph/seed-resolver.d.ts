import type { SymbolKind } from './indexer-types.js';
/** A seed from CocoIndex or other providers */
export interface CodeGraphSeed {
    filePath: string;
    startLine?: number;
    endLine?: number;
    query?: string;
}
/** Native CocoIndex search result as a seed */
export interface CocoIndexSeed {
    provider: 'cocoindex';
    file: string;
    range: {
        start: number;
        end: number;
    };
    score: number;
    snippet?: string;
}
/** Manual seed with symbol name (no file path required) */
export interface ManualSeed {
    provider: 'manual';
    symbolName: string;
    filePath?: string;
    kind?: SymbolKind;
}
/** Pre-resolved graph node seed */
export interface GraphSeed {
    provider: 'graph';
    nodeId: string;
    symbolId: string;
}
/** Union type for all seed kinds */
export type AnySeed = CodeGraphSeed | CocoIndexSeed | ManualSeed | GraphSeed;
/** A resolved reference into the code graph */
export interface ArtifactRef {
    filePath: string;
    startLine: number;
    endLine: number;
    symbolId: string | null;
    fqName: string | null;
    kind: string | null;
    confidence: number;
    resolution: 'exact' | 'near_exact' | 'enclosing' | 'file_anchor';
}
/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
export declare function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef;
/** Resolve a ManualSeed by looking up the symbol name in the DB */
export declare function resolveManualSeed(seed: ManualSeed): ArtifactRef;
/** Resolve a GraphSeed by looking up the node by symbolId in the DB */
export declare function resolveGraphSeed(seed: GraphSeed): ArtifactRef;
/** Resolve a single seed to an ArtifactRef */
export declare function resolveSeed(seed: CodeGraphSeed): ArtifactRef;
/** Resolve multiple seeds, deduplicate overlapping refs */
export declare function resolveSeeds(seeds: AnySeed[]): ArtifactRef[];
//# sourceMappingURL=seed-resolver.d.ts.map