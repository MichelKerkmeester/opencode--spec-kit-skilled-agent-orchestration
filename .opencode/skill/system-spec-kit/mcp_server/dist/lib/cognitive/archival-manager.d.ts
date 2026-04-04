import type Database from 'better-sqlite3';
interface EmbeddingModule {
    generateDocumentEmbedding: (content: string) => Promise<Float32Array | null>;
}
declare function __setEmbeddingsModuleForTests(module: EmbeddingModule | null): void;
interface ArchivalConfigType {
    enabled: boolean;
    scanIntervalMs: number;
    batchSize: number;
    maxAgeDays: number;
    maxAccessCount: number;
    maxConfidence: number;
    protectedTiers: string[];
    backgroundJobIntervalMs: number;
}
declare const ARCHIVAL_CONFIG: ArchivalConfigType;
interface ArchivalCandidate {
    id: number;
    title: string | null;
    spec_folder: string;
    file_path: string;
    created_at: string;
    importance_tier: string;
    access_count: number;
    confidence: number;
    reason: string;
}
interface ArchivalStats {
    totalScanned: number;
    totalArchived: number;
    totalUnarchived: number;
    lastScanTime: string | null;
    errors: string[];
}
declare function init(database: Database.Database): void;
declare function ensureArchivedColumn(): void;
/**
 * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
 * as the authoritative decision.
 *
 * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
 * The FSRS-based tier classifier then determines which should actually be archived.
 * This unifies the dual archival paths (P5-05) — FSRS is primary, SQL is pre-filter.
 */
declare function getArchivalCandidates(limit?: number): ArchivalCandidate[];
declare function checkMemoryArchivalStatus(memoryId: number): {
    isArchived: boolean;
    shouldArchive: boolean;
};
declare function archiveMemory(memoryId: number): boolean;
declare function archiveBatch(memoryIds: number[]): {
    archived: number;
    failed: number;
};
declare function unarchiveMemory(memoryId: number): boolean;
declare function runArchivalScan(): {
    scanned: number;
    archived: number;
};
declare function startBackgroundJob(intervalMs?: number): void;
declare function stopBackgroundJob(): void;
declare function isBackgroundJobRunning(): boolean;
declare function getStats(): ArchivalStats;
declare function getRecentErrors(limit?: number): string[];
declare function resetStats(): void;
declare function cleanup(): void;
export { ARCHIVAL_CONFIG, init, ensureArchivedColumn, getArchivalCandidates, checkMemoryArchivalStatus, archiveMemory, archiveBatch, unarchiveMemory, runArchivalScan, startBackgroundJob, stopBackgroundJob, isBackgroundJobRunning, getStats, getRecentErrors, resetStats, cleanup, __setEmbeddingsModuleForTests, };
export type { ArchivalConfigType, ArchivalCandidate, ArchivalStats, };
//# sourceMappingURL=archival-manager.d.ts.map