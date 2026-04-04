import type Database from 'better-sqlite3';
/**
 * Check if folder relevance scoring is enabled.
 * Default: TRUE (graduated). Set SPECKIT_FOLDER_SCORING=false to disable.
 */
export declare function isFolderScoringEnabled(): boolean;
/**
 * Compute FolderScore for each spec folder from grouped search results.
 *
 * Formula: `FolderScore(F) = (1 / sqrt(M + 1)) * SUM(score(m))`
 * where M is the number of memories in folder F.
 *
 * The damping factor `1/sqrt(M+1)` prevents large folders from
 * dominating purely by volume. A folder with 100 low-scoring results
 * will not outrank a folder with 2 high-scoring results.
 *
 * @param results  - Array of scored search results
 * @param folderMap - Map of memoryId -> spec_folder
 * @returns Map of folder name -> FolderScore
 */
export declare function computeFolderRelevanceScores(results: Array<{
    id: number | string;
    score: number;
    [key: string]: unknown;
}>, folderMap: Map<number, string>): Map<string, number>;
/**
 * Look up spec_folder values for a list of memory IDs from the database.
 *
 * Uses a single query with IN clause for efficiency.
 *
 * @param database - better-sqlite3 Database instance
 * @param ids      - Array of memory IDs to look up
 * @returns Map of memoryId -> spec_folder
 */
export declare function lookupFolders(database: Database.Database, ids: number[]): Map<number, string>;
/**
 * Enrich search results with folder-level relevance metadata.
 *
 * Adds three fields to each result:
 * - `folderScore` — the computed FolderScore for the result's folder
 * - `folderRank`  — 1-based rank (1 = highest FolderScore)
 * - `specFolder`  — the spec folder name (from folderMap)
 *
 * Results whose ID is not in folderMap are returned with undefined
 * folder metadata (original fields preserved).
 *
 * @param results      - Original scored search results
 * @param folderScores - Map of folder -> FolderScore
 * @param folderMap    - Map of memoryId -> spec_folder
 * @returns Enriched results with folder metadata
 */
export declare function enrichResultsWithFolderScores<T extends {
    id: number | string;
    score: number;
}>(results: T[], folderScores: Map<string, number>, folderMap: Map<number, string>): Array<T & {
    folderScore?: number;
    folderRank?: number;
    specFolder?: string;
}>;
/**
 * Two-phase retrieval: first select top-K folders by FolderScore,
 * then return only results belonging to those folders (ordered by score).
 *
 * This narrows the result set to the most relevant spec folders,
 * filtering out noise from low-relevance folders.
 *
 * @param results      - Full set of scored results
 * @param folderScores - Map of folder -> FolderScore
 * @param folderMap    - Map of memoryId -> spec_folder
 * @param topK         - Number of top folders to keep (default: 5)
 * @returns Filtered results from top-K folders, sorted by score descending
 */
export declare function twoPhaseRetrieval<T extends {
    id: number | string;
    score: number;
}>(results: T[], folderScores: Map<string, number>, folderMap: Map<number, string>, topK?: number): T[];
//# sourceMappingURL=folder-relevance.d.ts.map