/**
 * Get the absolute path to the CocoIndex binary.
 * Uses the resolved project root instead of process.cwd().
 */
export declare function getCocoIndexBinaryPath(): string;
/**
 * Check whether the CocoIndex binary exists on disk.
 */
export declare function isCocoIndexAvailable(): boolean;
/** Reset cached root (for testing only). */
export declare function _resetCachedRoot(): void;
//# sourceMappingURL=cocoindex-path.d.ts.map