// ───────────────────────────────────────────────────────────────
// MODULE: Interference Scoring
// ───────────────────────────────────────────────────────────────
// Interference scoring calibration
// Computes interference scores for memories — a measure of how many
// Similar memories exist in the same spec_folder. High interference
// Means the memory is one of many similar items, suggesting redundancy.
// Applied as a penalty in composite scoring to demote redundant results.
import Database from 'better-sqlite3';

// Feature catalog: Interference scoring


// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION

// ───────────────────────────────────────────────────────────────
/**
 * Cosine similarity threshold for counting a memory as "interfering".
 * Memories in the same spec_folder with similarity above this threshold
 * are counted toward the interference score.
 * Initial calibration value — may be adjusted based on eval results.
 */
export const INTERFERENCE_SIMILARITY_THRESHOLD = 0.75;

/**
 * Penalty coefficient applied as: score += coefficient * interferenceScore.
 * Negative value means higher interference = lower composite score.
 * Initial calibration value — may be adjusted based on eval results.
 */
export const INTERFERENCE_PENALTY_COEFFICIENT = -0.08;

interface MemoryIndexScopeInfo {
  hasActiveProjection: boolean;
  hasArchivedColumn: boolean;
  hasImportanceTierColumn: boolean;
}

function getMemoryIndexScopeInfo(database: Database.Database): MemoryIndexScopeInfo {
  const columns = database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name?: string }>;
  const columnSet = new Set(
    columns
      .map((column) => (typeof column.name === 'string' ? column.name : ''))
      .filter(Boolean),
  );

  return {
    hasActiveProjection: Boolean(
      database.prepare(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'active_memory_projection'"
      ).get(),
    ),
    hasArchivedColumn: columnSet.has('is_archived'),
    hasImportanceTierColumn: columnSet.has('importance_tier'),
  };
}

function buildRetrievableMemoryPredicates(alias: string, scopeInfo: MemoryIndexScopeInfo): string[] {
  const predicates = [`${alias}.parent_id IS NULL`];

  if (scopeInfo.hasArchivedColumn) {
    predicates.push(`COALESCE(${alias}.is_archived, 0) = 0`);
  }

  if (scopeInfo.hasImportanceTierColumn) {
    predicates.push(`COALESCE(${alias}.importance_tier, 'normal') != 'deprecated'`);
  }

  return predicates;
}

// ───────────────────────────────────────────────────────────────
// 3. TEXT SIMILARITY HEURISTIC

// ───────────────────────────────────────────────────────────────
/**
 * Compute a simple text similarity score between two texts using
 * word overlap (Jaccard-like). Returns a value in [0, 1].
 *
 * This is a lightweight heuristic used when vector cosine similarity
 * is not available at scoring time.
 */
export function computeTextSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;

  const tokenize = (text: string): Set<string> => {
    return new Set(
      text
        .toLowerCase()
        .split(/[\s,;|]+/)
        .filter(w => w.length > 2)
    );
  };

  const setA = tokenize(textA);
  const setB = tokenize(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const word of setA) {
    if (setB.has(word)) {
      intersectionCount++;
    }
  }

  // Jaccard similarity: |A ∩ B| / |A ∪ B|
  const unionCount = setA.size + setB.size - intersectionCount;
  if (unionCount === 0) return 0;

  return intersectionCount / unionCount;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE COMPUTATION

// ───────────────────────────────────────────────────────────────
/**
 * Compute interference score for a single memory.
 *
 * The interference score is the count of OTHER memories in the SAME
 * spec_folder with text similarity (based on title + trigger_phrases)
 * above the threshold.
 *
 * @param database - SQLite database instance
 * @param memoryId - ID of the memory to compute interference for
 * @param specFolder - spec_folder of the memory
 * @param threshold - similarity threshold (default: 0.75)
 * @returns interference count (0 = no similar memories)
 */
export function computeInterferenceScore(
  database: Database.Database,
  memoryId: number,
  specFolder: string,
  threshold: number = INTERFERENCE_SIMILARITY_THRESHOLD
): number {
  if (!specFolder) return 0;

  const scopeInfo = getMemoryIndexScopeInfo(database);
  const targetPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
  const siblingPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);

  // Get the target memory's text fields
  const targetRow = database.prepare(
    `SELECT m.title, m.trigger_phrases
     FROM memory_index m
     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
     WHERE m.id = ?
       AND ${targetPredicates.join('\n       AND ')}`
  ).get(memoryId) as { title: string | null; trigger_phrases: string | null } | undefined;

  if (!targetRow) return 0;

  const targetText = [targetRow.title || '', targetRow.trigger_phrases || ''].join(' ').trim();
  if (!targetText) return 0;

  // Get all other memories in the same spec_folder (excluding self and chunks)
  const siblings = database.prepare(
    `SELECT m.id, m.title, m.trigger_phrases
     FROM memory_index m
     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
     WHERE m.spec_folder = ?
       AND m.id != ?
       AND ${siblingPredicates.join('\n       AND ')}`
  ).all(specFolder, memoryId) as Array<{
    id: number;
    title: string | null;
    trigger_phrases: string | null;
  }>;

  let interferenceCount = 0;
  for (const sibling of siblings) {
    const siblingText = [sibling.title || '', sibling.trigger_phrases || ''].join(' ').trim();
    if (!siblingText) continue;

    const similarity = computeTextSimilarity(targetText, siblingText);
    if (similarity >= threshold) {
      interferenceCount++;
    }
  }

  return interferenceCount;
}

/**
 * Batch compute interference scores for multiple memories.
 *
 * @param database - SQLite database instance
 * @param memoryIds - Array of memory IDs to compute interference for
 * @returns Map of memoryId -> interferenceScore
 */
export function computeInterferenceScoresBatch(
  database: Database.Database,
  memoryIds: number[],
  // Threshold was hardcoded to
  // INTERFERENCE_SIMILARITY_THRESHOLD. Now configurable for testing/tuning.
  threshold: number = INTERFERENCE_SIMILARITY_THRESHOLD
): Map<number, number> {
  const results = new Map<number, number>();

  if (memoryIds.length === 0) return results;

  const scopeInfo = getMemoryIndexScopeInfo(database);
  const rowPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
  const folderPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);

  // Get all memories with their spec_folders in one query
  const placeholders = memoryIds.map(() => '?').join(',');
  const rows = database.prepare(
    `SELECT m.id, m.spec_folder, m.title, m.trigger_phrases
     FROM memory_index m
     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
     WHERE m.id IN (${placeholders})
       AND ${rowPredicates.join('\n       AND ')}`
  ).all(...memoryIds) as Array<{
    id: number;
    spec_folder: string | null;
    title: string | null;
    trigger_phrases: string | null;
  }>;

  // Group by spec_folder for efficient processing
  const byFolder = new Map<string, typeof rows>();
  for (const row of rows) {
    const folder = row.spec_folder || '';
    let folderRows = byFolder.get(folder);
    if (!folderRows) {
      folderRows = [];
      byFolder.set(folder, folderRows);
    }
    folderRows.push(row);
  }

  // For each folder, get all memories and compute pairwise interference
  for (const [folder, folderRows] of byFolder) {
    if (!folder) {
      // No spec_folder — interference score is 0
      for (const row of folderRows) {
        results.set(row.id, 0);
      }
      continue;
    }

    // Get ALL memories in this folder (not just the ones in our batch)
    const allInFolder = database.prepare(
      `SELECT m.id, m.title, m.trigger_phrases
       FROM memory_index m
       ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
       WHERE m.spec_folder = ?
         AND ${folderPredicates.join('\n         AND ')}`
    ).all(folder) as Array<{
      id: number;
      title: string | null;
      trigger_phrases: string | null;
    }>;

    // Build text map for all memories in folder
    const textMap = new Map<number, string>();
    for (const mem of allInFolder) {
      const text = [mem.title || '', mem.trigger_phrases || ''].join(' ').trim();
      textMap.set(mem.id, text);
    }

    // Compute interference for each target in our batch
    for (const row of folderRows) {
      const targetText = textMap.get(row.id) || '';
      if (!targetText) {
        results.set(row.id, 0);
        continue;
      }

      let count = 0;
      for (const mem of allInFolder) {
        if (mem.id === row.id) continue;
        const siblingText = textMap.get(mem.id) || '';
        if (!siblingText) continue;

        const similarity = computeTextSimilarity(targetText, siblingText);
        if (similarity >= threshold) {
          count++;
        }
      }

      results.set(row.id, count);
    }
  }

  // Set 0 for any memoryIds not found in the database
  for (const id of memoryIds) {
    if (!results.has(id)) {
      results.set(id, 0);
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// 5. PENALTY APPLICATION

// ───────────────────────────────────────────────────────────────
/**
 * Apply interference penalty to a composite score.
 *
 * Gated behind the SPECKIT_INTERFERENCE_SCORE environment variable.
 * When disabled, returns the score unchanged.
 *
 * @param score - Current composite score
 * @param interferenceScore - Number of interfering memories (0+)
 * @returns Adjusted score, clamped to [0, 1]
 */
export function applyInterferencePenalty(
  score: number,
  interferenceScore: number
): number {
  // Graduated: default-ON. Set SPECKIT_INTERFERENCE_SCORE=false to disable.
  if (process.env.SPECKIT_INTERFERENCE_SCORE?.toLowerCase() === 'false') return score;
  if (!interferenceScore || interferenceScore <= 0) return score;

  const penalty = INTERFERENCE_PENALTY_COEFFICIENT * interferenceScore;
  return Math.min(1, Math.max(0, score + penalty));
}
