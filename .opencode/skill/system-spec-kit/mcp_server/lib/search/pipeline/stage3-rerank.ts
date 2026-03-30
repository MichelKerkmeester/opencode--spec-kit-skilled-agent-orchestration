// ───────────────────────────────────────────────────────────────
// MODULE: Stage3 Rerank
// ───────────────────────────────────────────────────────────────
// 4-Stage Retrieval Pipeline: Stage 3 of 4
//
// Responsibilities (in execution order):
// 1. Cross-encoder reranking   — re-scores results via neural model
// 2. MMR diversity pruning     — maximal marginal relevance (SPECKIT_MMR flag)
// 3. MPAB chunk collapse        — dedup chunks, reassemble parents
//
// Pipeline position constraint:
// MPAB MUST remain AFTER RRF fusion (Stage 2).
// Stage 3 is the only stage that may change scores after Stage 2.
//
// I/O CONTRACT:
// Input:  Stage3Input { scored: PipelineRow[], config }
// Output: Stage3Output { reranked: PipelineRow[], metadata }
// Key invariants:
//     - reranked is sorted descending by effective score after all steps
//     - Chunk rows (parent_id != null) are collapsed; only parent rows exit
//     - contentSource is set to 'reassembled_chunks' or 'file_read_fallback'
// Side effects:
//     - Cross-encoder model inference (external call, when SPECKIT_CROSS_ENCODER on)
//     - DB reads to fetch parent content during MPAB reassembly
//
// Score changes: YES

import { resolveEffectiveScore } from './types.js';
import type { Stage3Input, Stage3Output, PipelineRow } from './types.js';
import * as crossEncoder from '../cross-encoder.js';
import { rerankLocal } from '../local-reranker.js';
import { isCrossEncoderEnabled, isMMREnabled, isLocalRerankerEnabled } from '../search-flags.js';
import { computeMPAB } from '../../scoring/mpab-aggregation.js';
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
import { INTENT_LAMBDA_MAP } from '../intent-classifier.js';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
import { requireDb } from '../../../utils/index.js';
import { toErrorMessage } from '../../../utils/index.js';
import type Database from 'better-sqlite3';
import { compareDeterministicRows, sortDeterministicRows } from './ranking-contract.js';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Hybrid search pipeline


// -- Constants --------------------------------------------------

/** Minimum number of results required before cross-encoder is worth invoking. */
const MIN_RESULTS_FOR_RERANK = 2;

/** Minimum number of candidates required before MMR diversity pruning is worthwhile. */
const MMR_MIN_CANDIDATES = 2;

/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
const MMR_DEFAULT_LAMBDA = 0.7;

/** Column order priority for assembling display text sent to cross-encoder. */
const TEXT_FIELD_PRIORITY = ['content', 'file_path'] as const;

/**
 * Enforce non-negative score outputs at Stage 3 rerank boundaries.
 */
function floorScore(value: number): number {
  return Math.max(0, value);
}

function resolveRerankOutputScore(raw: unknown, fallback: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return floorScore(raw);
  }
  return floorScore(fallback);
}

// -- Internal Interfaces ----------------------------------------

/**
 * Document format consumed by the cross-encoder reranker.
 * Matches the RerankDocument interface in cross-encoder.ts:
 *   { id: number | string; content: string; title?: string; [key: string]: unknown }
 */
interface RerankDocument {
  id: string | number;
  content: string;
  score?: number;
  [key: string]: unknown;
}

/**
 * Aggregated statistics from the MPAB chunk-collapse pass.
 */
interface ChunkReassemblyStats {
  /** Number of child chunk rows removed from the result set. */
  collapsedChunkHits: number;
  /** Number of distinct parent IDs encountered among chunk hits. */
  chunkParents: number;
  /** Number of parents whose content was successfully reassembled from DB. */
  reassembled: number;
  /** Number of parents that fell back to using best-chunk content. */
  fallback: number;
}

/**
 * Internal representation of a chunk group — all chunks belonging
 * to a single parent, ready for collapse and reassembly.
 */
interface ChunkGroup {
  parentId: number;
  chunks: PipelineRow[];
  /** The chunk with the highest similarity/score — the representative row. */
  bestChunk: PipelineRow;
  /** Parent-level score derived from all chunk scores with a best-chunk floor. */
  parentScore: number;
}

type RerankProvider = 'cross-encoder' | 'local-gguf' | 'fallback-sort' | 'none';

// -- Stage 3 Entry Point ----------------------------------------

/**
 * Execute Stage 3: Rerank + Aggregate.
 *
 * Applies cross-encoder reranking (if enabled) and then collapses
 * chunked memory hits into their parent documents (MPAB). The order
 * is intentional: cross-encoder scores are computed on the raw chunks
 * (fine-grained text), then parent reassembly aggregates the results.
 *
 * @param input - Stage 3 input containing scored results from Stage 2
 *   and the shared pipeline configuration.
 * @returns Stage 3 output with reranked, aggregated results and metadata.
 */
export async function executeStage3(input: Stage3Input): Promise<Stage3Output> {
  const stageStart = Date.now();
  const { scored, config } = input;

  let results = scored;
  let rerankApplied = false;
  let rerankProvider: RerankProvider = 'none';

  // -- Step 1: Cross-encoder reranking ---------------------------
  const rerankStart = Date.now();
  const beforeRerank = results.length;

  // Destructure { rows, applied } — dedicated boolean flag replaces
  // Fragile reference inequality check `results !== scored` (A1-P2-3)
  const rerankResult = await applyCrossEncoderReranking(config.query, results, {
    rerank: config.rerank,
    applyLengthPenalty: config.applyLengthPenalty,
    limit: config.limit,
  });
  results = rerankResult.rows;
  rerankApplied = rerankResult.applied;
  rerankProvider = rerankResult.provider;

  if (config.trace) {
    addTraceEntry(
      config.trace,
      'rerank',
      beforeRerank,
      results.length,
      Date.now() - rerankStart,
      { rerankApplied, provider: rerankProvider }
    );
  }

  // -- Step 2: MMR diversity pruning ----------------------------
  // Gated behind SPECKIT_MMR feature flag. Retrieves embeddings from
  // Vec_memories and applies Maximal Marginal Relevance to diversify
  // The result set, matching the V1 hybrid-search behavior.
  if (isMMREnabled() && results.length >= MMR_MIN_CANDIDATES) {
    try {
      const db = requireDb() as Database.Database;
      const numericIds = results
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');

      if (numericIds.length >= MMR_MIN_CANDIDATES) {
        const placeholders = numericIds.map(() => '?').join(', ');
        const embRows = (db.prepare(
          `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
        ) as Database.Statement).all(...numericIds) as Array<{ rowid: number; embedding: Buffer }>;

        const embeddingMap = new Map<number, Float32Array>();
        for (const row of embRows) {
          if (Buffer.isBuffer(row.embedding)) {
            embeddingMap.set(
              row.rowid,
              new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
            );
          }
        }

        const mmrCandidates: MMRCandidate[] = [];
        for (const r of results) {
          const emb = embeddingMap.get(r.id);
          if (emb) {
            mmrCandidates.push({
              id: r.id,
              // Use effectiveScore() for consistent fallback chain
              score: floorScore(effectiveScore(r)),
              embedding: emb,
            });
          }
        }

        if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
          const originalPositionMap = new Map<number | string, number>();
          results.forEach((row, index) => originalPositionMap.set(row.id, index));
          const intent = config.detectedIntent ?? '';
          const mmrLambda = (INTENT_LAMBDA_MAP as Record<string, number>)[intent] ?? MMR_DEFAULT_LAMBDA;
          const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit: config.limit });

          // FIX #5: MMR can only diversify rows that have embeddings. Non-embedded
          // rows (lexical-only hits, graph injections) must be preserved and merged
          // back in their original relative order instead of being silently dropped.
          const embeddedIdSet = new Set(mmrCandidates.map(c => c.id));
          const nonEmbeddedRows = results.filter(r => !embeddedIdSet.has(r.id));

          // Rebuild PipelineRow[] from diversified candidates, preserving all original fields
          const rowMap = new Map<number | string, PipelineRow>();
          for (const r of results) rowMap.set(r.id, r);

          const diversifiedRows = diversified.map((candidate): PipelineRow => {
            const existing = rowMap.get(candidate.id);
            if (existing) return existing;
            return { id: candidate.id as number, score: candidate.score };
          });

          const positioned: Array<{ row: PipelineRow; pos: number }> = [];
          diversifiedRows.forEach((row, index) => positioned.push({ row, pos: index }));
          nonEmbeddedRows.forEach((row) => {
            const originalPosition = originalPositionMap.get(row.id) ?? results.length;
            positioned.push({ row, pos: originalPosition });
          });

          positioned.sort((left, right) => left.pos - right.pos);
          results = positioned.map(({ row }) => row);
        }
      }
    } catch (mmrErr: unknown) {
      // Non-critical — MMR failure does not block pipeline
      console.warn(`[stage3-rerank] MMR diversity pruning failed: ${toErrorMessage(mmrErr)}`);
    }
  }

  // -- Step 3: MPAB chunk collapse + parent reassembly -----------
  //
  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
  // Here in Stage 3 — never move it upstream.
  const mpabStart = Date.now();
  const beforeMpab = results.length;

  const { results: aggregated, stats: chunkStats } =
    await collapseAndReassembleChunkResults(results);

  results = aggregated;

  if (config.trace) {
    addTraceEntry(
      config.trace,
      'final-rank',
      beforeMpab,
      results.length,
      Date.now() - mpabStart,
      {
        collapsedChunkHits: chunkStats.collapsedChunkHits,
        chunkParents: chunkStats.chunkParents,
        reassembled: chunkStats.reassembled,
        fallback: chunkStats.fallback,
      }
    );
  }

  const metadata = {
    rerankApplied,
    rerankProvider,
    chunkReassemblyStats: chunkStats,
    durationMs: Date.now() - stageStart,
  };

  return {
    reranked: results,
    metadata,
  };
}

// -- Internal: Cross-Encoder Reranking -------------------------

/**
 * Apply cross-encoder reranking to a list of pipeline results.
 *
 * Returns the original array unchanged if:
 *   - The `rerank` option is not set
 *   - The `SPECKIT_CROSS_ENCODER` feature flag is disabled
 *   - There are fewer than {@link MIN_RESULTS_FOR_RERANK} results
 *
 * On any reranker error, logs a warning and returns the original
 * results unmodified (graceful degradation).
 *
 * @param query       - The user's search query string.
 * @param results     - Pipeline rows from Stage 2 fusion.
 * @param options     - Rerank configuration flags.
 * @returns Object with reranked rows, whether reranking was applied, and the
 * reranker path that executed.
 */
async function applyCrossEncoderReranking(
  query: string,
  results: PipelineRow[],
  options: {
    rerank: boolean;
    applyLengthPenalty: boolean;
    limit: number;
  }
): Promise<{ rows: PipelineRow[]; applied: boolean; provider: RerankProvider }> {
  // Feature-flag guard
  if (!options.rerank || !isCrossEncoderEnabled()) {
    return { rows: results, applied: false, provider: 'none' };
  }

  // Minimum-document guard
  if (results.length < MIN_RESULTS_FOR_RERANK) {
    return { rows: results, applied: false, provider: 'none' };
  }

  // Build a lookup map so we can restore all original PipelineRow fields
  // After reranking (the cross-encoder only knows about id + text + score).
  const rowMap = new Map<string | number, PipelineRow>();
  for (const row of results) {
    rowMap.set(row.id, row);
  }

  // Local GGUF reranker path (P1-5): RERANKER_LOCAL=true
  // On any failure/unavailable precondition, rerankLocal returns original rows unchanged.
  if (isLocalRerankerEnabled()) {
    try {
      const localReranked = await rerankLocal(query, results, options.limit);
      if (localReranked === results) {
        return { rows: results, applied: false, provider: 'local-gguf' };
      }

      const localRows: PipelineRow[] = localReranked.map((row) => {
        const original = rowMap.get(row.id);
        const rerankScoreRaw = row.rerankerScore ?? row.score;
        const rerankScore = resolveRerankOutputScore(
          rerankScoreRaw,
          original ? effectiveScore(original) : 0,
        );

        return {
          ...(original ?? row),
          ...row,
          stage2Score: original?.score,
          score: rerankScore,
          similarity: original?.similarity ?? row.similarity,
          rerankerScore: rerankScore,
          // F2.02 fix: Sync all score aliases for local reranker path too.
          rrfScore: rerankScore,
          intentAdjustedScore: rerankScore,
          attentionScore: original?.attentionScore ?? row.attentionScore,
        };
      });

      return { rows: localRows, applied: true, provider: 'local-gguf' };
    } catch (err: unknown) {
      console.warn(
        `[stage3-rerank] Local reranking failed: ${toErrorMessage(err)} — returning original results`
      );
      return { rows: results, applied: false, provider: 'local-gguf' };
    }
  }

  // Map PipelineRow → RerankDocument (uses `content` field per cross-encoder interface)
  // P1-015: Use effectiveScore() for consistent fallback chain
  const documents: RerankDocument[] = results.map((row) => ({
    id: row.id,
    content: resolveDisplayText(row),
    score: floorScore(effectiveScore(row)),
  }));

  try {
    // Cast through unknown: our local RerankDocument is structurally equivalent to
    // The cross-encoder module's internal RerankDocument but declared separately.
    const reranked = await crossEncoder.rerankResults(
      query,
      documents as unknown as Parameters<typeof crossEncoder.rerankResults>[1],
      {
        limit: options.limit,
        useCache: true,
        applyLengthPenalty: options.applyLengthPenalty,
      }
    );

    const rerankProvider: RerankProvider = reranked.some(
      (result) => result.scoringMethod === 'fallback'
    )
      ? 'fallback-sort'
      : 'cross-encoder';

    // Re-map reranked results back to PipelineRow, preserving all original
    // Fields and updating only the score-related values from the reranker.
    const rerankedRows: PipelineRow[] = [];
    for (const rerankResult of reranked) {
      const original = rowMap.get(rerankResult.id);
      if (!original) {
        // Defensive: reranker returned an unknown id — skip it
        continue;
      }
      const rerankScore = resolveRerankOutputScore(
        rerankResult.rerankerScore ?? rerankResult.score,
        effectiveScore(original),
      );
      rerankedRows.push({
        ...original,
        // P1-015: Preserve Stage 2 composite score for auditability
        stage2Score: original.score,
        score: rerankScore,
        similarity: original.similarity,
        rerankerScore: rerankScore,
        // F2.02 fix: Sync all score aliases so resolveEffectiveScore() returns
        // the reranked value instead of stale Stage 2 values.
        rrfScore: rerankScore,
        intentAdjustedScore: rerankScore,
        attentionScore: original.attentionScore,
      });
    }

    return { rows: rerankedRows, applied: true, provider: rerankProvider };
  } catch (err: unknown) {
    // Graceful degradation — return original results on any reranker failure
    console.warn(
      `[stage3-rerank] Cross-encoder reranking failed: ${toErrorMessage(err)} — returning original results`
    );
    return { rows: results, applied: false, provider: 'cross-encoder' };
  }
}

/**
 * Resolve the content string used for cross-encoder scoring for a given row.
 * Prefers `content` over `file_path`; falls back to an empty string if
 * neither is available (rare edge case for index-only entries).
 *
 * This value is placed into the `content` field of the RerankDocument sent
 * to the cross-encoder module.
 *
 * @param row - A pipeline result row.
 * @returns Content string for the cross-encoder.
 */
function resolveDisplayText(row: PipelineRow): string {
  for (const field of TEXT_FIELD_PRIORITY) {
    const value = row[field];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return '';
}

// -- Internal: MPAB Chunk Collapse + Parent Reassembly ---------

/**
 * Collapse chunk-level hits and reassemble parent memory documents.
 *
 * MPAB (Multi-Part Aggregation + Backfill) algorithm:
 *   1. Separate rows into chunks (has `parent_id`) and non-chunks.
 *   2. Group chunks by `parent_id`.
 *   3. For each group, elect the best chunk (highest score).
 *   4. Attempt to load the full parent content from the database.
 *   5. If the DB query succeeds, emit a reassembled parent row.
 *   6. If the DB query fails, fall back to the best-chunk content.
 *   7. Merge non-chunks + reassembled parents, sort by score descending.
 *
 * Pipeline position constraint: this function MUST NOT be called before
 * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
 *
 * @param results - Scored pipeline rows from (optionally reranked) Stage 3.
 * @returns Object with aggregated rows and chunk reassembly statistics.
 */
async function collapseAndReassembleChunkResults(
  results: PipelineRow[]
): Promise<{ results: PipelineRow[]; stats: ChunkReassemblyStats }> {
  const stats: ChunkReassemblyStats = {
    collapsedChunkHits: 0,
    chunkParents: 0,
    reassembled: 0,
    fallback: 0,
  };

  // Separate chunks from non-chunks
  const nonChunks: PipelineRow[] = [];
  const chunksByParent = new Map<number, PipelineRow[]>();

  for (const row of results) {
    const parentId = row.parent_id ?? row.parentId;
    if (parentId != null && typeof parentId === 'number') {
      // This row is a chunk — group by parent
      const group = chunksByParent.get(parentId);
      if (group) {
        group.push(row);
      } else {
        chunksByParent.set(parentId, [row]);
      }
    } else {
      nonChunks.push(row);
    }
  }

  if (chunksByParent.size === 0) {
    // No chunks to collapse — return results unchanged
    return { results, stats };
  }

  stats.chunkParents = chunksByParent.size;

  // Build chunk groups, electing the best chunk for each parent
  const chunkGroups: ChunkGroup[] = [];
  for (const [parentId, chunks] of chunksByParent) {
    const bestChunk = electBestChunk(chunks);
    const bestChunkScore = resolveEffectiveScore(bestChunk);
    const chunkScores = chunks.map(c => resolveEffectiveScore(c));
    const mpabScore = computeMPAB(chunkScores);
    const parentScore = Math.max(mpabScore, bestChunkScore);
    // Sort chunks by chunk_index (document order) for correct reassembly,
    // Not by score order which is the default from upstream stages (A8-P2-1)
    chunks.sort((a, b) => {
      const aIdx = ((a.chunk_index ?? a.chunkIndex) as number | undefined) ?? 0;
      const bIdx = ((b.chunk_index ?? b.chunkIndex) as number | undefined) ?? 0;
      return aIdx - bIdx;
    });
    chunkGroups.push({ parentId, chunks, bestChunk, parentScore });
    // All chunks beyond the best one are collapsed
    stats.collapsedChunkHits += chunks.length - 1;
  }

  // Attempt DB reassembly for each parent group (in parallel)
  const reassembledRows = await Promise.all(
    chunkGroups.map((group) => reassembleParentRow(group, stats))
  );

  // Merge non-chunks + reassembled parent rows, deduplicate by id (prefer highest score),
  // Then sort by effective score.
  // F-07 — Parent rows could appear in both nonChunks and reassembledRows
  // When a parent exists as a standalone row AND has chunk children.
  const mergedMap = new Map<unknown, PipelineRow>();
  for (const row of [...nonChunks, ...reassembledRows]) {
    const existing = mergedMap.get(row.id);
    if (!existing || floorScore(effectiveScore(row)) > floorScore(effectiveScore(existing))) {
      mergedMap.set(row.id, row);
    }
  }
  const merged = sortDeterministicRows(Array.from(mergedMap.values()) as Array<PipelineRow & { id: number }>);

  return { results: merged, stats };
}

/**
 * Elect the best representative chunk from a chunk group.
 * Selection criteria: highest `score`, breaking ties by `similarity`.
 *
 * @param chunks - All chunk rows for a single parent.
 * @returns The chunk with the highest effective score.
 */
function electBestChunk(chunks: PipelineRow[]): PipelineRow {
  return chunks.reduce((best, current) => (
    compareDeterministicRows(
      { ...current, score: floorScore(effectiveScore(current)) } as Record<string, unknown> & { id: number },
      { ...best, score: floorScore(effectiveScore(best)) } as Record<string, unknown> & { id: number },
    ) < 0 ? current : best
  ));
}

/**
 * Compute the effective numeric score for a pipeline row.
 * Checks all score fields in priority order to avoid silently
 * discarding Stage 2 signal enrichment.
 *
 * P1-015: Fallback chain expanded to include intentAdjustedScore
 * and rrfScore before raw score/similarity, matching Stage 2's
 * resolveBaseScore() pattern for defensive correctness.
 *
 * @param row - A pipeline result row.
 * @returns Numeric score value in [0, 1] for comparison.
 */
// Replaced local implementation with
// Shared resolveEffectiveScore() from types.ts for consistency with Stage 2.
const effectiveScore = resolveEffectiveScore;

/**
 * Attempt to reassemble a full parent memory row from the database.
 *
 * On success, returns a PipelineRow that merges:
 *   - All best-chunk fields as the base
 *   - Parent-level content from the DB (if available)
 *   - `contentSource: 'reassembled_chunks'` to mark provenance
 *
 * On failure, returns the best-chunk row with
 *   `contentSource: 'file_read_fallback'`.
 *
 * @param group  - The chunk group (parentId + chunks + bestChunk).
 * @param stats  - Mutable stats object updated in place.
 * @returns A PipelineRow representing the parent document.
 */
async function reassembleParentRow(
  group: ChunkGroup,
  stats: ChunkReassemblyStats
): Promise<PipelineRow> {
  const { parentId, bestChunk, parentScore } = group;

  try {
    const db = requireDb();

    // Query the parent memory row for content and metadata
    const parentRow = db
      .prepare(
        `SELECT id, file_path, content_text, importance_tier, importance_weight,
                quality_score, created_at, context_type
         FROM memory_index
         WHERE id = ?
         LIMIT 1`
      )
      .get(parentId) as Record<string, unknown> | undefined;

    if (!parentRow) {
      // Parent not found in DB — use best chunk as fallback
      stats.fallback++;
      return markFallback(bestChunk, parentScore);
    }

    const reassembledContent =
      (parentRow.content_text as string | undefined) ?? bestChunk.content;

    // Merge parent metadata onto the best-chunk base row
    const reassembled: PipelineRow = {
      ...bestChunk,
      // Override identity fields with parent values
      id: parentId,
      file_path: (parentRow.file_path as string | undefined) ?? bestChunk.file_path,
      importance_tier: (parentRow.importance_tier as string | undefined) ?? bestChunk.importance_tier,
      importance_weight: (parentRow.importance_weight as number | undefined) ?? bestChunk.importance_weight,
      quality_score: (parentRow.quality_score as number | undefined) ?? bestChunk.quality_score,
      created_at: (parentRow.created_at as string | undefined) ?? bestChunk.created_at,
      context_type: (parentRow.context_type as string | undefined) ?? bestChunk.context_type,
      // FIX #8: Sync content with precomputedContent after reassembly.
      // Previously, `content` still had the chunk fragment while
      // `precomputedContent` had the full reassembled parent text.
      content: reassembledContent,
      precomputedContent: reassembledContent,
      contentSource: 'reassembled_chunks',
      score: parentScore,
      rrfScore: parentScore,
      intentAdjustedScore: parentScore,
      // Clear chunk-specific fields on the reassembled parent
      parent_id: null,
      parentId: null,
      chunk_index: null,
      chunkIndex: null,
      chunk_label: null,
      chunkLabel: null,
      isChunk: false,
    };

    stats.reassembled++;
    return reassembled;
  } catch (err: unknown) {
    // DB error — gracefully fall back to best-chunk content
    console.warn(
      `[stage3-rerank] MPAB DB reassembly failed for parent ${parentId}: ${toErrorMessage(err)} — using chunk fallback`
    );
    stats.fallback++;
    return markFallback(bestChunk, parentScore);
  }
}

/**
 * Mark a pipeline row as a chunk-content fallback.
 * Clears chunk-specific identity fields and marks the content source.
 *
 * @param chunk - The elected best-chunk row.
 * @param parentScore - Parent-level score after MPAB aggregation.
 * @returns A new PipelineRow annotated as a fallback parent representation.
 */
function markFallback(chunk: PipelineRow, parentScore: number): PipelineRow {
  const parentId =
    chunk.parent_id ??
    chunk.parentId ??
    (chunk as { parentMemoryId?: number | null }).parentMemoryId ??
    chunk.id;

  return {
    ...chunk,
    id: parentId,
    contentSource: 'file_read_fallback',
    score: parentScore,
    rrfScore: parentScore,
    intentAdjustedScore: parentScore,
    // Promote chunk to parent-level identity by clearing chunk markers
    parent_id: null,
    parentId: null,
    chunk_index: undefined,
    chunkIndex: undefined,
    chunk_label: null,
    chunkLabel: null,
    isChunk: false,
    is_chunk: false,
  };
}

// -- Test Exports -----------------------------------------------

/**
 * Internal functions exported for unit testing.
 * Do not rely on these in production code — the API is not stable.
 *
 * @internal
 */
export const __testables = {
  applyCrossEncoderReranking,
  collapseAndReassembleChunkResults,
  electBestChunk,
  effectiveScore,
  resolveDisplayText,
  reassembleParentRow,
  markFallback,
};
