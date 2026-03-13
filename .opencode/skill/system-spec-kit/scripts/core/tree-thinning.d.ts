// ---------------------------------------------------------------
// MODULE: Tree Thinning Types
// ---------------------------------------------------------------
// Public declaration surface for tree-thinning helpers and config.

/** Represents thinning config. */
export interface ThinningConfig {
    /** Files under this token count are merged into parent document */
    mergeThreshold: number;
    /** Files under this token count use content directly as summary */
    contentAsTextThreshold: number;
    /** Memory-specific thinning trigger threshold */
    memoryThinThreshold: number;
    /** Memory-specific threshold where text itself is the summary */
    memoryTextThreshold: number;
}
/** Defines default thinning config. */
export declare const DEFAULT_THINNING_CONFIG: ThinningConfig;
/** Represents file entry. */
export interface FileEntry {
    path: string;
    content: string;
}
/** Represents thin file entry. */
export interface ThinFileEntry {
    path: string;
    content: string;
    tokenCount: number;
    action: 'keep' | 'content-as-summary' | 'merged-into-parent';
}
/** Represents merged file entry. */
export interface MergedFileEntry {
    parentPath: string;
    childPaths: string[];
    mergedSummary: string;
}
/** Represents thinning result. */
export interface ThinningResult {
    thinned: ThinFileEntry[];
    merged: MergedFileEntry[];
    stats: {
        totalFiles: number;
        thinnedCount: number;
        mergedCount: number;
        tokensSaved: number;
    };
}
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
export { estimateTokenCount };
/**
 * Determine whether a file path is a memory file.
 * Memory files live under any directory segment named "memory".
 */
export declare function isMemoryFile(filePath: string): boolean;
/**
 * Derive the parent path from a child path by stripping the last segment.
 * Returns null for top-level files (no parent directory component).
 */
export declare function deriveParentPath(filePath: string): string | null;
/**
 * Apply bottom-up tree thinning to a collection of spec folder files.
 *
 * Processing order:
 *   1. Estimate token count for each file.
 *   2. Resolve per-file action based on thresholds.
 *   3. Group files-to-merge by parent directory.
 *   4. Produce MergedFileEntry records (content preserved, no loss).
 *   5. Return ThinningResult with stats.
 *
 * This function is PURE (no I/O) and operates pre-pipeline.
 * It does NOT modify pipeline stages or scoring.
 */
export declare function applyTreeThinning(files: FileEntry[], config?: Partial<ThinningConfig>): ThinningResult;
//# sourceMappingURL=tree-thinning.d.ts.map
