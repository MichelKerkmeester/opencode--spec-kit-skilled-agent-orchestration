/**
 * Describes the WatcherConfig shape.
 */
export interface WatcherConfig {
    paths: string[];
    reindexFn: (filePath: string) => Promise<unknown>;
    removeFn?: (filePath: string) => Promise<unknown>;
    debounceMs?: number;
    watchFactory?: (paths: string[], options: Record<string, unknown>) => FSWatcher;
}
/**
 * Describes the FSWatcher shape.
 */
export interface FSWatcher {
    on: (event: string, listener: (...args: unknown[]) => void) => FSWatcher;
    close: () => Promise<void>;
}
/** Return accumulated watcher metrics for diagnostics. */
export declare function getWatcherMetrics(): {
    filesReindexed: number;
    avgReindexTimeMs: number;
};
export declare function resetWatcherMetrics(): void;
declare function isDotfilePath(filePath: string): boolean;
declare function isMarkdownPath(filePath: string): boolean;
declare function shouldIgnoreWatchTarget(targetPath: string): boolean;
declare function getWatchScopedPath(targetPath: string, watchRoots: string[]): string | null;
declare function isSqliteBusyError(error: unknown): boolean;
/**
 * Provides the startFileWatcher helper.
 */
export declare function startFileWatcher(config: WatcherConfig): FSWatcher;
/**
 * Defines the __testables constant.
 */
export declare const __testables: {
    getWatchScopedPath: typeof getWatchScopedPath;
    isDotfilePath: typeof isDotfilePath;
    isMarkdownPath: typeof isMarkdownPath;
    shouldIgnoreWatchTarget: typeof shouldIgnoreWatchTarget;
    isSqliteBusyError: typeof isSqliteBusyError;
    resetWatcherMetrics: typeof resetWatcherMetrics;
};
export {};
//# sourceMappingURL=file-watcher.d.ts.map