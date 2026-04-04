import Database from 'better-sqlite3';
/**
 * Cosine similarity threshold for counting a memory as "interfering".
 * Memories in the same spec_folder with similarity above this threshold
 * are counted toward the interference score.
 * Initial calibration value — may be adjusted based on eval results.
 */
export declare const INTERFERENCE_SIMILARITY_THRESHOLD = 0.75;
/**
 * Penalty coefficient applied as: score += coefficient * interferenceScore.
 * Negative value means higher interference = lower composite score.
 * Initial calibration value — may be adjusted based on eval results.
 */
export declare const INTERFERENCE_PENALTY_COEFFICIENT = -0.08;
/**
 * Compute a simple text similarity score between two texts using
 * word overlap (Jaccard-like). Returns a value in [0, 1].
 *
 * This is a lightweight heuristic used when vector cosine similarity
 * is not available at scoring time.
 */
export declare function computeTextSimilarity(textA: string, textB: string): number;
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
export declare function computeInterferenceScore(database: Database.Database, memoryId: number, specFolder: string, threshold?: number): number;
/**
 * Batch compute interference scores for multiple memories.
 *
 * @param database - SQLite database instance
 * @param memoryIds - Array of memory IDs to compute interference for
 * @returns Map of memoryId -> interferenceScore
 */
export declare function computeInterferenceScoresBatch(database: Database.Database, memoryIds: number[], threshold?: number): Map<number, number>;
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
export declare function applyInterferencePenalty(score: number, interferenceScore: number): number;
//# sourceMappingURL=interference-scoring.d.ts.map