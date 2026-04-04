import { type CodeGraphSeed, type ArtifactRef } from './seed-resolver.js';
export type QueryMode = 'neighborhood' | 'outline' | 'impact';
export interface ContextArgs {
    input?: string;
    queryMode?: QueryMode;
    subject?: string;
    seeds?: CodeGraphSeed[];
    budgetTokens?: number;
    deadlineMs?: number;
    profile?: 'quick' | 'research' | 'debug';
    includeTrace?: boolean;
}
export interface ContextResult {
    queryMode: QueryMode;
    resolvedAnchors: ArtifactRef[];
    graphContext: GraphContextSection[];
    textBrief: string;
    combinedSummary: string;
    nextActions: string[];
    metadata: {
        totalNodes: number;
        totalEdges: number;
        budgetUsed: number;
        budgetLimit: number;
        freshness: {
            lastScanAt: string | null;
            staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
        };
    };
}
interface GraphContextSection {
    anchor: string;
    nodes: {
        name: string;
        kind: string;
        file: string;
        line: number;
    }[];
    edges: {
        from: string;
        to: string;
        type: string;
    }[];
}
/** Build context from resolved anchors using specified query mode */
export declare function buildContext(args: ContextArgs): ContextResult;
export {};
//# sourceMappingURL=code-graph-context.d.ts.map