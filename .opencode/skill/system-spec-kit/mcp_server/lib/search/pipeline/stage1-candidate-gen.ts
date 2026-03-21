// ───────────────────────────────────────────────────────────────
// MODULE: Stage1 Candidate Gen
// ───────────────────────────────────────────────────────────────
// 4-stage retrieval pipeline architecture
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage performs NO scoring modifications — it only retrieves candidates
// From the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
// Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: searchWithFallback → falls back to vector on failure
//   - vector: Direct vectorSearch
//
// Post-channel operations:
//   - Constitutional memory injection (if not already present)
//   - Quality score filtering
//   - Tier and contextType filtering
//
// I/O CONTRACT:
// Input:  Stage1Input { config: PipelineConfig }
// Output: Stage1Output { candidates: PipelineRow[], metadata }
// Key invariants:
//     - candidates contains raw scores assigned by the search channel (unchanged)
//     - Constitutional rows are always present when includeConstitutional=true and no tier filter
//     - All rows pass qualityThreshold (if set) and tier/contextType filters
// Side effects:
//     - Generates query embeddings via the embeddings provider (external call)
//     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
//
import type { Stage1Input, Stage1Output, PipelineRow } from './types';
import * as vectorIndex from '../vector-index';
import * as embeddings from '../../providers/embeddings';
import * as hybridSearch from '../hybrid-search';
import { isMultiQueryEnabled, isEmbeddingExpansionEnabled, isMemorySummariesEnabled } from '../search-flags';
import { expandQuery } from '../query-expander';
import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion';
import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
import { requireDb } from '../../../utils/db-helpers';
import { filterRowsByScope } from '../../governance/scope-governance';
import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces';
import { withTimeout } from '../../errors/core';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Hybrid search pipeline


// -- Constants --

/** Maximum number of deep-mode query variants to generate (original + expanded). */
const MAX_DEEP_QUERY_VARIANTS = 3;

/** F1: Deep-mode expansion timeout — fall back to base query if variants take too long. */
const DEEP_EXPANSION_TIMEOUT_MS = 5000;

/** Minimum cosine similarity for multi-concept search. */
const MULTI_CONCEPT_MIN_SIMILARITY = 0.5;

/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
const CONSTITUTIONAL_INJECT_LIMIT = 5;

/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
const DEFAULT_EXPANSION_CANDIDATE_LIMIT = 5;

// -- Helper Functions --

/**
 * Filter results by a minimum quality score threshold.
 *
 * - If no threshold is provided or it is not a finite number, all results pass.
 * - Threshold is clamped to [0, 1].
 * - Rows with a missing or non-finite `quality_score` are treated as 0.
 *
 * @param results - Candidate rows to filter.
 * @param threshold - Minimum quality score in [0, 1] (inclusive).
 * @returns Filtered array; original array returned unchanged when no threshold applies.
 */
function filterByMinQualityScore(
  results: PipelineRow[],
  threshold?: number
): PipelineRow[] {
  if (typeof threshold !== 'number' || !Number.isFinite(threshold)) {
    return results;
  }

  const clampedThreshold = Math.max(0, Math.min(1, threshold));

  return results.filter((row) => {
    const rawScore = row.quality_score as number | undefined;
    const score =
      typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
    return score >= clampedThreshold;
  });
}

function applyArchiveFilter(
  results: PipelineRow[],
  includeArchived: boolean
): PipelineRow[] {
  if (includeArchived) return results;
  return results.filter((row) => {
    const archived = row.is_archived ?? row.isArchived;
    if (archived == null) return true;
    if (typeof archived === 'number') return archived === 0;
    if (typeof archived === 'boolean') return archived === false;
    return true;
  });
}

function applyFolderFilter(
  results: PipelineRow[],
  specFolder?: string
): PipelineRow[] {
  if (!specFolder) return results;
  return results.filter((row) => {
    const rowSpecFolder = row.spec_folder ?? row.specFolder;
    return rowSpecFolder === specFolder;
  });
}

function applyTierFilter(
  results: PipelineRow[],
  tier?: string
): PipelineRow[] {
  if (!tier) return results;
  return results.filter((row) => row.importance_tier === tier);
}

/**
 * Resolve the effective context type from a pipeline row.
 *
 * Rows may carry context type under either `contextType` (camelCase) or
 * `context_type` (snake_case). This function normalises the lookup.
 *
 * @param row - The pipeline row to inspect.
 * @returns The context type string, or `undefined` if absent.
 */
function resolveRowContextType(row: PipelineRow): string | undefined {
  if (typeof row.contextType === 'string' && row.contextType.length > 0) {
    return row.contextType;
  }
  if (typeof row.context_type === 'string' && row.context_type.length > 0) {
    return row.context_type;
  }
  return undefined;
}

/**
 * Build deep-mode query variants using rule-based synonym expansion.
 *
 * The original query is always the first variant. Up to `MAX_DEEP_QUERY_VARIANTS - 1`
 * additional variants are produced by `expandQuery`. If expansion fails or produces
 * no new terms, the array contains only the original query.
 *
 * Duplicates are eliminated via `Set` deduplication before slicing.
 *
 * @param query - The original search query string.
 * @returns Array of distinct query variants, original first, capped at MAX_DEEP_QUERY_VARIANTS.
 */
async function buildDeepQueryVariants(query: string): Promise<string[]> {
  try {
    const expanded = expandQuery(query);
    const variants = new Set<string>(expanded);
    // ExpandQuery already includes the original as the first entry,
    // But be explicit in case the implementation changes.
    variants.add(query);
    return Array.from(variants).slice(0, MAX_DEEP_QUERY_VARIANTS);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[stage1-candidate-gen] buildDeepQueryVariants failed, using original query: ${msg}`
    );
    return [query];
  }
}

// -- Stage 1 --

/**
 * Execute Stage 1: Candidate Generation.
 *
 * Selects and runs the appropriate search channel(s) based on `config.searchType`
 * and `config.mode`, then applies constitutional injection, quality filtering,
 * and tier/contextType filtering.
 *
 * No scoring values are created or modified in this stage — results are returned
 * with whatever scores the underlying search channel assigns (similarity, rrfScore, etc.).
 *
 * @param input - Stage 1 input containing the resolved pipeline configuration.
 * @returns Stage 1 output with raw candidate rows and channel metadata.
 */
export async function executeStage1(input: Stage1Input): Promise<Stage1Output> {
  const startTime = Date.now();
  const { config } = input;
  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
  let cachedEmbedding: Float32Array | number[] | null = null;
  let constitutionalInjectedCount = 0;

  const {
    query,
    queryEmbedding,
    concepts,
    searchType,
    mode,
    limit,
    specFolder,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
    tier,
    contextType,
    includeArchived,
    includeConstitutional,
    qualityThreshold,
    trace,
  } = config;

  let candidates: PipelineRow[] = [];
  let channelCount = 0;

  // -- Channel: Multi-Concept --------------------------------------------------

  if (searchType === 'multi-concept' && Array.isArray(concepts) && concepts.length >= 2) {
    // Validate concept list: 2-5 non-empty strings
    if (concepts.length > 5) {
      throw new Error('[stage1-candidate-gen] Maximum 5 concepts allowed for multi-concept search');
    }

    for (const concept of concepts) {
      if (typeof concept !== 'string' || concept.trim().length === 0) {
        throw new Error('[stage1-candidate-gen] Each concept must be a non-empty string');
      }
    }

    // Generate one embedding per concept
    const conceptEmbeddings: Float32Array[] = [];
    for (const concept of concepts) {
      const emb = await embeddings.generateQueryEmbedding(concept);
      if (!emb) {
        throw new Error(
          `[stage1-candidate-gen] Failed to generate embedding for concept: "${concept}"`
        );
      }
      conceptEmbeddings.push(emb);
    }

    channelCount = 1;
    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
      minSimilarity: MULTI_CONCEPT_MIN_SIMILARITY,
      limit,
      specFolder,
      includeArchived,
    }) as PipelineRow[];
  }

  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------

  else if (searchType === 'hybrid') {
    // Resolve the query embedding — either pre-computed in config or generate now
    // Fix #16 — Cache this embedding for reuse in constitutional injection path
    // To avoid a duplicate generateQueryEmbedding() call.
    const effectiveEmbedding: Float32Array | number[] | null =
      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
    cachedEmbedding = effectiveEmbedding;

    if (!effectiveEmbedding) {
      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
    }

    // Deep mode: expand query into variants and run hybrid for each, then dedup
    if (mode === 'deep' && isMultiQueryEnabled()) {
      const queryVariants = await buildDeepQueryVariants(query);

      if (queryVariants.length > 1) {
        try {
          // F1: Wrap parallel variant searches with latency budget.
          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
          const variantResultSets: PipelineRow[][] = await withTimeout(
            Promise.all(
              queryVariants.map(async (variant): Promise<PipelineRow[]> => {
                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
                if (!variantEmbedding) return [];
                const variantResults = await hybridSearch.searchWithFallback(
                  variant,
                  variantEmbedding,
                  { limit, specFolder, includeArchived }
                );
                return variantResults as PipelineRow[];
              })
            ),
            DEEP_EXPANSION_TIMEOUT_MS,
            'Deep-mode query expansion',
          );

          channelCount = queryVariants.length;

          // Merge variant results, deduplicate by id, preserve first-occurrence order
          const seenIds = new Set<number>();
          const merged: PipelineRow[] = [];
          for (const variantResults of variantResultSets) {
            for (const row of variantResults) {
              if (!seenIds.has(row.id)) {
                seenIds.add(row.id);
                merged.push(row);
              }
            }
          }
          candidates = merged;
        } catch (expandErr: unknown) {
          const expandMsg =
            expandErr instanceof Error ? expandErr.message : String(expandErr);
          console.warn(
            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
          );
          // Fall through to single hybrid search below
          channelCount = 1;
          candidates = (await hybridSearch.searchWithFallback(
            query,
            effectiveEmbedding,
            { limit, specFolder, includeArchived }
          )) as PipelineRow[];
        }
      } else {
        // ExpandQuery returned only the original; treat as standard hybrid
        channelCount = 1;
        candidates = (await hybridSearch.searchWithFallback(
          query,
          effectiveEmbedding,
          { limit, specFolder, includeArchived }
        )) as PipelineRow[];
      }
    } else {
      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
      //
      // When R12 is enabled and R15 does not classify the query as "simple",
      // We expand the query using embedding similarity to find related terms
      // From the memory index. The expanded query is used as an additional
      // Hybrid search channel whose results are merged with the baseline.
      //
      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
      // The query as "simple", suppressing expansion with zero added latency.

      let r12ExpansionApplied = false;

      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
        try {
          // ExpandQueryWithEmbeddings requires a Float32Array; the effective
          // Embedding may be a number[] when generated by some providers, so
          // Convert if necessary before passing it in.
          const expansionEmbedding: Float32Array =
            effectiveEmbedding instanceof Float32Array
              ? effectiveEmbedding
              : Float32Array.from(effectiveEmbedding as number[]);

          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
            limit: DEFAULT_EXPANSION_CANDIDATE_LIMIT,
          });

          // Only run an extra channel if the expansion actually produced new terms
          if (expanded.expanded.length > 0 && expanded.combinedQuery !== query) {
            // Run the baseline and the expanded query in parallel
            const [baselineResults, expansionResults] = await Promise.all([
              hybridSearch.searchWithFallback(
                query,
                effectiveEmbedding,
                { limit, specFolder, includeArchived }
              ).catch((): PipelineRow[] => []),
              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
                async (expandedEmb): Promise<PipelineRow[]> => {
                  if (!expandedEmb) return [];
                  return hybridSearch.searchWithFallback(
                    expanded.combinedQuery,
                    expandedEmb,
                    { limit, specFolder, includeArchived }
                  ) as Promise<PipelineRow[]>;
                }
              ).catch((): PipelineRow[] => []),
            ]);

            channelCount = 2;
            r12ExpansionApplied = true;

            // Merge both result sets, deduplicate by id, baseline-first ordering
            // So baseline scores dominate when the same memory appears in both.
            const seenIds = new Set<number>();
            const merged: PipelineRow[] = [];
            for (const row of [...(baselineResults as PipelineRow[]), ...(expansionResults as PipelineRow[])]) {
              if (!seenIds.has(row.id)) {
                seenIds.add(row.id);
                merged.push(row);
              }
            }
            candidates = merged;

            if (trace) {
              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
                channel: 'r12-embedding-expansion',
                expandedTerms: expanded.expanded,
                combinedQuery: expanded.combinedQuery,
              });
            }
          }
        } catch (r12Err: unknown) {
          const r12Msg = r12Err instanceof Error ? r12Err.message : String(r12Err);
          console.warn(
            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
          );
        }
      }

      // Standard hybrid search — runs when R12 is off, suppressed by R15,
      // Or produced no results (candidates still empty from the try block above).
      if (!r12ExpansionApplied) {
        try {
          channelCount = 1;
          const hybridResults = (await hybridSearch.searchWithFallback(
            query,
            effectiveEmbedding,
            { limit, specFolder, includeArchived }
          )) as PipelineRow[];
          candidates = hybridResults;
        } catch (hybridErr: unknown) {
          const hybridMsg =
            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
          console.warn(
            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
          );

          // Fallback: pure vector search
          channelCount = 1;
          candidates = vectorIndex.vectorSearch(effectiveEmbedding, {
            limit,
            specFolder,
            tier,
            contextType,
            includeConstitutional: false, // Constitutional managed separately below
            includeArchived,
          }) as PipelineRow[];

          if (trace) {
            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
              reason: hybridMsg,
              channel: 'vector',
            });
          }
        }
      }
    }
  }

  // -- Channel: Vector ---------------------------------------------------------

  else if (searchType === 'vector') {
    const effectiveEmbedding: Float32Array | number[] | null =
      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

    if (!effectiveEmbedding) {
      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
    }

    channelCount = 1;
    candidates = vectorIndex.vectorSearch(effectiveEmbedding, {
      limit,
      specFolder,
      tier,
      contextType,
      includeConstitutional: false, // Constitutional managed separately below
      includeArchived,
    }) as PipelineRow[];
  }

  // -- Unknown search type -----------------------------------------------------

  else {
    throw new Error(
      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
    );
  }

  // -- Tier and contextType filtering -----------------------------------------
  //
  // Applied after candidate collection but before constitutional injection so
  // Injected constitutional rows are evaluated by the same filters.
  // Exception: for hybrid search, tier/contextType are applied here because
  // SearchWithFallback does not accept these parameters directly.
  // For vector search, tier/contextType were already passed to vectorSearch,
  // So this is a no-op guard for those fields.

  if (tier) {
    candidates = candidates.filter((r) => r.importance_tier === tier);
  }

  if (contextType) {
    candidates = candidates.filter(
      (r) => resolveRowContextType(r) === contextType
    );
  }

  const hasGovernanceScope = Boolean(
    tenantId
    || userId
    || agentId
    || config.sessionId
    || sharedSpaceId
  );
  const scopeFilter = {
    tenantId,
    userId,
    agentId,
    sessionId: config.sessionId,
    sharedSpaceId,
  };
  let allowedSharedSpaceIds: Set<string> | undefined;

  if (hasGovernanceScope) {
    try {
      const db = requireDb();
      allowedSharedSpaceIds = getAllowedSharedSpaceIds(db, scopeFilter);
      candidates = filterRowsByScope(
        candidates,
        scopeFilter,
        allowedSharedSpaceIds,
      );
    } catch (_error: unknown) {
      candidates = filterRowsByScope(candidates, scopeFilter);
    }
  }

  // -- Constitutional Memory Injection ----------------------------------------
  //
  // If includeConstitutional is requested and no constitutional results exist
  // In the current candidate set, fetch them separately via vector search.
  // They enter the pipeline here so all subsequent stages (scoring, reranking)
  // Treat them uniformly. Constitutional tier boost is applied in Stage 2.
  //
  // Injection is skipped when:
  //   - includeConstitutional is false
  //   - A tier filter is active (caller explicitly requested a specific tier)
  //   - Constitutional results already exist in the candidate set

  if (includeConstitutional && !tier) {
    const existingConstitutional = candidates.filter(
      (r) => r.importance_tier === 'constitutional'
    );

    if (existingConstitutional.length === 0) {
      // Fix #16 — Reuse cached embedding instead of generating a new one
      const constitutionalEmbedding: Float32Array | number[] | null =
        cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

      if (constitutionalEmbedding) {
        const constitutionalResults = vectorIndex.vectorSearch(
          constitutionalEmbedding,
          {
            limit: CONSTITUTIONAL_INJECT_LIMIT,
            specFolder,
            tier: 'constitutional',
            useDecay: false,
          }
        ) as PipelineRow[];

        // Only inject rows not already present
        const existingIds = new Set(candidates.map((r) => r.id));
        const uniqueConstitutional = constitutionalResults.filter(
          (r) => !existingIds.has(r.id)
        );

        // Re-apply filters after injection because constitutional rows fetched
        // via vector search bypass the earlier governance/context gate.
        const contextFilteredConstitutional = contextType
          ? uniqueConstitutional.filter((r) => resolveRowContextType(r) === contextType)
          : uniqueConstitutional;
        const filteredConstitutional = hasGovernanceScope
          ? filterRowsByScope(
            contextFilteredConstitutional,
            scopeFilter,
            allowedSharedSpaceIds,
          )
          : contextFilteredConstitutional;
        candidates = [...candidates, ...filteredConstitutional];
        constitutionalInjectedCount = filteredConstitutional.length;
      }
    }
  } else if (!includeConstitutional) {
    // Explicitly exclude constitutional results if flag is off
    candidates = candidates.filter(
      (r) => r.importance_tier !== 'constitutional'
    );
  }

  // -- Quality Score Filtering ------------------------------------------------

  candidates = filterByMinQualityScore(candidates, qualityThreshold);

  // -- R8: Summary Embedding Channel ---------------------------------------
  // When SPECKIT_MEMORY_SUMMARIES is enabled (default-ON) and scale gate is
  // Met (>5000 indexed), run a parallel search on summary embeddings and merge
  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
  // + deduplicate by ID.
  if (isMemorySummariesEnabled()) {
    try {
      const db = requireDb();
      if (checkScaleGate(db)) {
        const summaryEmbedding: Float32Array | number[] | null =
          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

        if (summaryEmbedding) {
          const summaryResults = querySummaryEmbeddings(db, summaryEmbedding, limit);
          if (summaryResults.length > 0) {
            const existingIds = new Set(candidates.map((r) => String(r.id)));
            const newSummaryHits: PipelineRow[] = [];

            for (const sr of summaryResults) {
              if (!existingIds.has(String(sr.memoryId))) {
                // Fetch full memory row for the summary match
                const memRow = db.prepare(
                  'SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id = ?'
                ).get(sr.memoryId) as PipelineRow | undefined;

                if (memRow) {
                  newSummaryHits.push({
                    ...memRow,
                    similarity: sr.similarity * 100,
                    score: sr.similarity,
                  });
                  existingIds.add(String(sr.memoryId));
                }
              }
            }

            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
            const tierFilteredSummaryHits = applyTierFilter(folderFilteredSummaryHits, tier);
            const contextFilteredSummaryHits = contextType
              ? tierFilteredSummaryHits.filter((r) => resolveRowContextType(r) === contextType)
              : tierFilteredSummaryHits;
            const scopeFilteredSummaryHits = hasGovernanceScope
              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)
              : contextFilteredSummaryHits;

            // Apply the same quality threshold that other candidates go through
            const filteredSummaryHits = filterByMinQualityScore(scopeFilteredSummaryHits, qualityThreshold);

            if (filteredSummaryHits.length > 0) {
              candidates = [...candidates, ...filteredSummaryHits];
              channelCount++;

              if (trace) {
                addTraceEntry(trace, 'candidate', 1, filteredSummaryHits.length, 0, {
                  channel: 'r8-summary-embeddings',
                  summaryHits: filteredSummaryHits.length,
                  preFilterCount: newSummaryHits.length,
                });
              }
            }
          }
        }
      }
    } catch (r8Err: unknown) {
      const r8Msg = r8Err instanceof Error ? r8Err.message : String(r8Err);
      console.warn(`[stage1-candidate-gen] R8 summary channel failed: ${r8Msg}`);
    }
  }

  // -- Trace ------------------------------------------------------------------

  const durationMs = Date.now() - startTime;

  if (trace) {
    addTraceEntry(
      trace,
      'candidate',
      channelCount,
      candidates.length,
      durationMs,
      {
        searchType,
        mode: mode ?? null,
        channelCount,
        deepExpansion: mode === 'deep' && isMultiQueryEnabled(),
        r12EmbeddingExpansion: isEmbeddingExpansionEnabled(),
      }
    );
  }

  return {
    candidates,
    metadata: {
      searchType,
      channelCount,
      candidateCount: candidates.length,
      constitutionalInjected: constitutionalInjectedCount,
      durationMs,
    },
  };
}

// -- Test Exports ------------------------------------------------------------

/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  filterByMinQualityScore,
  resolveRowContextType,
  buildDeepQueryVariants,
  DEFAULT_EXPANSION_CANDIDATE_LIMIT,
};
