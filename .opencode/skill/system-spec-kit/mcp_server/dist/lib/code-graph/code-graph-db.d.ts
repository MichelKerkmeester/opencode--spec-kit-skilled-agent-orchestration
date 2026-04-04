import Database from 'better-sqlite3';
import type { CodeNode, CodeEdge } from './indexer-types.js';
export interface StartupHighlight {
    name: string;
    kind: string;
    filePath: string;
    callCount: number;
}
/** Schema version for migration tracking */
export declare const SCHEMA_VERSION = 3;
/** Initialize (or get) the code graph database */
export declare function initDb(dbDir: string): Database.Database;
/** Get the current database instance (lazy-initializes if needed) */
export declare function getDb(): Database.Database;
/** Close the database connection */
export declare function closeDb(): void;
export declare function getLastGitHead(): string | null;
export declare function setLastGitHead(head: string): void;
/** Insert or update a file record, returning the file ID */
export declare function upsertFile(filePath: string, language: string, contentHash: string, nodeCount: number, edgeCount: number, parseHealth: string, parseDurationMs: number): number;
/** Batch insert nodes for a file (deletes existing first) */
export declare function replaceNodes(fileId: number, nodes: CodeNode[]): void;
/** Batch insert edges (deletes edges from the source nodes first) */
export declare function replaceEdges(sourceIds: string[], edges: CodeEdge[]): void;
/** Check if a file needs re-indexing based on stored mtime */
export declare function isFileStale(filePath: string): boolean;
/** Batch stale check for a set of file paths */
export declare function ensureFreshFiles(filePaths: string[]): {
    stale: string[];
    fresh: string[];
};
/** Get all tracked file paths from the graph database */
export declare function getTrackedFiles(): string[];
/** Remove a file and its nodes/edges from the graph */
export declare function removeFile(filePath: string): void;
/** Query: get file outline (nodes sorted by line) */
export declare function queryOutline(filePath: string): CodeNode[];
/** Query: startup-friendly highlights — most-called project symbols (incoming calls). */
export declare function queryStartupHighlights(limit?: number): StartupHighlight[];
/** Query: get edges from a symbol */
export declare function queryEdgesFrom(symbolId: string, edgeType?: string): {
    edge: CodeEdge;
    targetNode: CodeNode | null;
}[];
/** Query: get edges to a symbol */
export declare function queryEdgesTo(symbolId: string, edgeType?: string): {
    edge: CodeEdge;
    sourceNode: CodeNode | null;
}[];
/** Get graph statistics */
export declare function getStats(): {
    totalFiles: number;
    totalNodes: number;
    totalEdges: number;
    nodesByKind: Record<string, number>;
    edgesByType: Record<string, number>;
    parseHealthSummary: Record<string, number>;
    lastScanTimestamp: string | null;
    lastGitHead: string | null;
    dbFileSize: number | null;
    schemaVersion: number;
};
/** Remove orphaned nodes whose files no longer exist in code_files */
export declare function cleanupOrphans(): number;
/** Compute token usage ratio (completion / total) for budget allocator consumption */
export declare function getTokenUsageRatio(sessionMetrics: {
    estimatedPromptTokens: number;
    estimatedCompletionTokens: number;
} | null): number;
//# sourceMappingURL=code-graph-db.d.ts.map