export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
export type GraphFreshness = 'fresh' | 'stale' | 'empty';
export interface ReadyResult {
    freshness: GraphFreshness;
    action: ReadyAction;
    files?: string[];
    inlineIndexPerformed: boolean;
    reason: string;
}
export interface EnsureReadyOptions {
    allowInlineIndex?: boolean;
    allowInlineFullScan?: boolean;
}
export declare function ensureCodeGraphReady(rootDir: string, options?: EnsureReadyOptions): Promise<ReadyResult>;
/**
 * Non-mutating freshness check for status display.
 * Does NOT trigger reindexing.
 */
export declare function getGraphFreshness(rootDir: string): GraphFreshness;
//# sourceMappingURL=ensure-ready.d.ts.map