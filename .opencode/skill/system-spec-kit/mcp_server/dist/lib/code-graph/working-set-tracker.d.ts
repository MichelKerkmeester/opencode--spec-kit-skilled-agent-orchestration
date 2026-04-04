/** A tracked file access entry */
export interface FileAccess {
    filePath: string;
    accessCount: number;
    lastAccessedAt: number;
    symbolRefs: string[];
}
/** In-memory working set for the current session */
export declare class WorkingSetTracker {
    private files;
    private readonly maxFiles;
    constructor(maxFiles?: number);
    /** Record a file access */
    trackFile(filePath: string, symbolRefs?: string[]): void;
    /** Get top N files by recency-weighted score */
    getTopRoots(n?: number): FileAccess[];
    /** Get all tracked file paths */
    getTrackedFiles(): string[];
    /** Serialize to JSON (for hook state persistence) */
    serialize(): Record<string, FileAccess>;
    /** Restore from serialized state */
    static deserialize(data: Record<string, FileAccess>): WorkingSetTracker;
    /** Remove oldest entries to stay within capacity */
    private evictOldest;
    /** Get current size */
    get size(): number;
    /** Clear all tracked files */
    clear(): void;
    private symbols;
    /** Record a symbol access */
    trackSymbol(symbolId: string, fqName: string, filePath: string): void;
    /** Get top N symbols by recency-weighted score */
    getTopSymbols(n?: number): SymbolAccess[];
    /** Get symbol count */
    get symbolCount(): number;
}
/** A tracked symbol access entry */
export interface SymbolAccess {
    symbolId: string;
    fqName: string;
    filePath: string;
    accessCount: number;
    lastAccessedAt: number;
}
//# sourceMappingURL=working-set-tracker.d.ts.map