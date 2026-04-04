export interface ScanArgs {
    rootDir?: string;
    includeGlobs?: string[];
    excludeGlobs?: string[];
    incremental?: boolean;
}
export interface ScanResult {
    filesScanned: number;
    filesIndexed: number;
    filesSkipped: number;
    totalNodes: number;
    totalEdges: number;
    errors: string[];
    durationMs: number;
    fullReindexTriggered?: boolean;
    currentGitHead?: string | null;
    previousGitHead?: string | null;
}
/** Handle code_graph_scan tool call */
export declare function handleCodeGraphScan(args: ScanArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=scan.d.ts.map