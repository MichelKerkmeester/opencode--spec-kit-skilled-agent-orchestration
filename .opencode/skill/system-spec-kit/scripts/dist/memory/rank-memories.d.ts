#!/usr/bin/env node
import { isArchived, getArchiveMultiplier, computeRecencyScore, simplifyFolderPath, TIER_WEIGHTS, SCORE_WEIGHTS, DECAY_RATE } from '@spec-kit/shared/scoring/folder-scoring';
/** Raw memory record read from input data. */
export interface RawMemory {
    id?: number;
    title?: string;
    specFolder?: string;
    importanceTier?: string;
    createdAt?: string;
    updatedAt?: string;
    filePath?: string | null;
    triggerCount?: number;
    importanceWeight?: number;
}
/** Memory record normalized for ranking and reporting. */
export interface NormalizedMemory {
    id: string | number;
    title: string;
    specFolder: string;
    importanceTier: string;
    createdAt: string;
    updatedAt: string;
    filePath: string | null;
    triggerCount: number;
    importanceWeight: number;
    /** Index signature for FolderMemoryInput compatibility (Record<string, unknown>) */
    [key: string]: unknown;
}
/** Ranked constitutional memory entry included in output summaries. */
export interface ConstitutionalEntry {
    id: string | number;
    title: string;
    specFolder: string;
    simplified: string;
}
/** Folder-level aggregate score entry used in ranking output. */
export interface FolderScoreEntry {
    folder: string;
    simplified: string;
    score: number;
    memoryCount: number;
    lastUpdate: string;
    lastUpdateRelative: string;
    topTier: string;
    isArchived: boolean;
}
/** Recent memory entry included in ranking summaries. */
export interface RecentMemoryEntry {
    id: string | number;
    title: string;
    specFolder: string;
    simplified: string;
    updatedAt: string;
    updatedAtRelative: string;
    tier: string;
}
/** Aggregate result returned from ranking memory records. */
export interface ProcessingResult {
    constitutional: ConstitutionalEntry[];
    recentlyActive: FolderScoreEntry[];
    highImportance: FolderScoreEntry[];
    recentMemories: RecentMemoryEntry[];
    stats: {
        totalMemories: number;
        totalFolders: number;
        activeFolders: number;
        archivedFolders: number;
        showingArchived: boolean;
    };
}
/** Options controlling memory ranking and output generation. */
export interface ProcessingOptions {
    showArchived?: boolean;
    folderLimit?: number;
    memoryLimit?: number;
}
/** CLI options accepted by the memory ranking script. */
export interface CLIOptions extends ProcessingOptions {
    format?: string;
    filePath?: string | null;
}
declare function formatRelativeTime(timestamp: string): string;
declare function computeFolderScore(folderPath: string, folderMemories: NormalizedMemory[]): number;
declare function processMemories(rawMemories: RawMemory[], options?: ProcessingOptions): ProcessingResult;
export { isArchived, getArchiveMultiplier, computeRecencyScore, simplifyFolderPath, TIER_WEIGHTS, SCORE_WEIGHTS, DECAY_RATE, formatRelativeTime, computeFolderScore, processMemories, };
//# sourceMappingURL=rank-memories.d.ts.map