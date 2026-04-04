import type { FileChange } from '../types/session-types';
import type { ThinningResult } from './tree-thinning';
export type AlignmentTargets = {
    fileTargets: string[];
    keywordTargets: string[];
};
export declare function resolveAlignmentTargets(specFolderPath: string): Promise<AlignmentTargets>;
export declare function matchesAlignmentTarget(filePath: string, alignmentTargets: AlignmentTargets): boolean;
export declare function pickCarrierIndex(indices: number[], files: FileChange[]): number;
export declare function compactMergedContent(value: string): string;
/**
 * Apply tree-thinning decisions to the semantic file-change list that feeds
 * context template rendering.
 *
 * Behavior:
 * - `keep` and `content-as-summary` rows remain as individual entries.
 * - `merged-into-parent` rows are removed as standalone entries.
 * - Each merged group contributes a compact merge note to a carrier file in the
 *   same parent directory (or to a synthetic merged entry when no carrier exists).
 *
 * This makes tree thinning effective in the generated context output (instead of
 * only being computed/logged), while preserving merge provenance for recoverability.
 */
export declare function applyThinningToFileChanges(files: FileChange[], thinningResult: ThinningResult): FileChange[];
//# sourceMappingURL=alignment-validator.d.ts.map