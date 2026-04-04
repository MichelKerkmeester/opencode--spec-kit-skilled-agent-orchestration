import type Database from 'better-sqlite3';
declare const MTIME_FAST_PATH_MS = 1000;
interface FileMetadata {
    path: string;
    mtime: number;
    size: number;
    exists: boolean;
}
interface StoredMetadata {
    file_path: string;
    canonical_file_path?: string | null;
    file_mtime_ms: number | null;
    content_hash: string | null;
    embedding_status: string;
}
type IndexDecision = 'skip' | 'reindex' | 'new' | 'deleted' | 'modified' | 'unknown';
interface CategorizedFiles {
    toIndex: string[];
    toUpdate: string[];
    toSkip: string[];
    toDelete: string[];
}
declare function init(database: Database.Database): void;
declare function getFileMetadata(filePath: string): FileMetadata;
declare function getStoredMetadata(filePath: string): StoredMetadata | null;
/**
 * 6-path decision logic for whether a file needs re-indexing.
 */
declare function shouldReindex(filePath: string): IndexDecision;
declare function updateFileMtime(filePath: string, mtimeMs: number): boolean;
declare function setIndexedMtime(filePath: string): boolean;
declare function categorizeFilesForIndexing(filePaths: string[]): CategorizedFiles;
declare function listStaleIndexedPaths(scannedFilePaths: string[]): string[];
declare function listIndexedRecordIdsForDeletedPaths(filePaths: string[]): number[];
declare function batchUpdateMtimes(filePaths: string[]): {
    updated: number;
    failed: number;
};
export { MTIME_FAST_PATH_MS, init, getFileMetadata, getStoredMetadata, shouldReindex, updateFileMtime, setIndexedMtime, categorizeFilesForIndexing, listStaleIndexedPaths, listIndexedRecordIdsForDeletedPaths, batchUpdateMtimes, };
/**
 * Re-exports related public types.
 */
export type { FileMetadata, StoredMetadata, IndexDecision, CategorizedFiles, };
//# sourceMappingURL=incremental-index.d.ts.map