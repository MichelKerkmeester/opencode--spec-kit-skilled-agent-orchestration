// ───────────────────────────────────────────────────────────────
// MODULE: Folder Relevance
// ───────────────────────────────────────────────────────────────
// Computes folder-level relevance scores from individual memory
// Scores using damped aggregation: FolderScore = (1/sqrt(M+1)) * SUM(score(m))
//
// Gated behind SPECKIT_FOLDER_SCORING env var (default: enabled, graduated-on).
// Pure scoring addition — NO schema changes, NO new tables.
//
// References:
//   - PI-A1: Folder-level relevance scoring via DocScore aggregation
//   - R-006: Weight rebalancing surface
//   - R-007: Post-reranker stage in scoring pipeline
// Type-only
import type Database from 'better-sqlite3';

// Feature catalog: Folder-level relevance scoring
// Feature catalog: Spec folder hierarchy as retrieval structure


// ───────────────────────────────────────────────────────────────
// 1. FEATURE FLAG

// ───────────────────────────────────────────────────────────────
/**
 * Check if folder relevance scoring is enabled.
 * Default: TRUE (graduated). Set SPECKIT_FOLDER_SCORING=false to disable.
 */
export function isFolderScoringEnabled(): boolean {
  return process.env.SPECKIT_FOLDER_SCORING?.toLowerCase() !== 'false';
}

// ───────────────────────────────────────────────────────────────
// 2. CORE COMPUTATION

// ───────────────────────────────────────────────────────────────
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
export function computeFolderRelevanceScores(
  results: Array<{ id: number | string; score: number; [key: string]: unknown }>,
  folderMap: Map<number, string>,
): Map<string, number> {
  const folderScores = new Map<string, number>();

  if (!results || results.length === 0) {
    return folderScores;
  }

  // Group scores by folder
  const folderGroups = new Map<string, number[]>();

  for (const result of results) {
    const numericId = typeof result.id === 'string' ? Number(result.id) : result.id;
    const folder = folderMap.get(numericId);
    if (folder === undefined) continue;

    let group = folderGroups.get(folder);
    if (!group) {
      group = [];
      folderGroups.set(folder, group);
    }
    group.push(result.score);
  }

  // Compute FolderScore for each folder
  for (const [folder, scores] of folderGroups) {
    const M = scores.length;
    const dampingFactor = 1 / Math.sqrt(M + 1);
    const scoreSum = scores.reduce((sum, s) => sum + s, 0);
    folderScores.set(folder, dampingFactor * scoreSum);
  }

  return folderScores;
}

// ───────────────────────────────────────────────────────────────
// 3. DATABASE LOOKUP

// ───────────────────────────────────────────────────────────────
/**
 * Look up spec_folder values for a list of memory IDs from the database.
 *
 * Uses a single query with IN clause for efficiency.
 *
 * @param database - better-sqlite3 Database instance
 * @param ids      - Array of memory IDs to look up
 * @returns Map of memoryId -> spec_folder
 */
export function lookupFolders(
  database: Database.Database,
  ids: number[],
): Map<number, string> {
  const folderMap = new Map<number, string>();

  if (!ids || ids.length === 0) {
    return folderMap;
  }

  // Build parameterized IN clause
  const placeholders = ids.map(() => '?').join(', ');
  const sql = `SELECT id, spec_folder FROM memory_index WHERE id IN (${placeholders})`;

  const rows = database.prepare(sql).all(...ids) as Array<{
    id: number;
    spec_folder: string;
  }>;

  for (const row of rows) {
    if (row.spec_folder) {
      folderMap.set(row.id, row.spec_folder);
    }
  }

  return folderMap;
}

// ───────────────────────────────────────────────────────────────
// 4. RESULT ENRICHMENT

// ───────────────────────────────────────────────────────────────
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
export function enrichResultsWithFolderScores<
  T extends { id: number | string; score: number },
>(
  results: T[],
  folderScores: Map<string, number>,
  folderMap: Map<number, string>,
): Array<T & { folderScore?: number; folderRank?: number; specFolder?: string }> {
  if (!results || results.length === 0) {
    return [];
  }

  // Build folder rank lookup (1-based, descending by FolderScore)
  const rankedFolders = Array.from(folderScores.entries())
    .sort((a, b) => b[1] - a[1]);
  const folderRankMap = new Map<string, number>();
  for (let i = 0; i < rankedFolders.length; i++) {
    folderRankMap.set(rankedFolders[i][0], i + 1);
  }

  return results.map((result) => {
    const numericId = typeof result.id === 'string' ? Number(result.id) : result.id;
    const folder = folderMap.get(numericId);

    if (folder === undefined) {
      return { ...result };
    }

    const score = folderScores.get(folder);
    const rank = folderRankMap.get(folder);

    return {
      ...result,
      folderScore: score,
      folderRank: rank,
      specFolder: folder,
    };
  });
}

// ───────────────────────────────────────────────────────────────
// 5. TWO-PHASE RETRIEVAL

// ───────────────────────────────────────────────────────────────
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
export function twoPhaseRetrieval<
  T extends { id: number | string; score: number },
>(
  results: T[],
  folderScores: Map<string, number>,
  folderMap: Map<number, string>,
  topK: number = 5,
): T[] {
  if (!results || results.length === 0) {
    return [];
  }

  if (folderScores.size === 0) {
    return [];
  }

  // Step 1: Rank folders by FolderScore, take top K
  const rankedFolders = Array.from(folderScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([folder]) => folder);

  const topFolderSet = new Set(rankedFolders);

  // Step 2: Filter results to top-K folders
  const filtered = results.filter((result) => {
    const numericId = typeof result.id === 'string' ? Number(result.id) : result.id;
    const folder = folderMap.get(numericId);
    return folder !== undefined && topFolderSet.has(folder);
  });

  // Sort by score descending
  return filtered.sort((a, b) => b.score - a.score);
}
