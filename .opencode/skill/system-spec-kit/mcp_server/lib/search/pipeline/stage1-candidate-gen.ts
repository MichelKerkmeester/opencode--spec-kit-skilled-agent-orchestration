// ───────────────────────────────────────────────────────────────
// MODULE: Stage1 Candidate Gen
// ───────────────────────────────────────────────────────────────
// 4-stage retrieval pipeline architecture
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage avoids downstream fusion/reranking, but may apply temporal
// Contiguity to raw vector-channel hits before later pipeline stages.
// Results are collected from the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
// Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: collectRawCandidates → falls back to vector on failure
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
//     - candidates contains raw channel scores; vector hits may include an
//       optional temporal-contiguity boost applied before downstream fusion
//     - Constitutional rows are always present when includeConstitutional=true and no tier filter
//     - All rows pass qualityThreshold (if set) and tier/contextType filters
// Side effects:
//     - Generates query embeddings via the embeddings provider (external call)
//     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
//
import type { Stage1Input, Stage1Output, PipelineRow } from './types.js';
import { resolveEffectiveScore } from './types.js';
import * as vectorIndex from '../vector-index.js';
import * as embeddings from '../../providers/embeddings.js';
import * as hybridSearch from '../hybrid-search.js';
import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
import { isMultiQueryEnabled, isEmbeddingExpansionEnabled, isMemorySummariesEnabled, isQueryDecompositionEnabled, isGraphConceptRoutingEnabled, isLlmReformulationEnabled, isHyDEEnabled, isQuerySurrogatesEnabled, isTemporalContiguityEnabled, isQueryConceptExpansionEnabled } from '../search-flags.js';
import { expandQuery } from '../query-expander.js';
import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries.js';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
import { requireDb } from '../../../utils/db-helpers.js';
import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces.js';
import { withTimeout } from '../../errors/core.js';
import { computeBackfillQualityScore } from '../../validation/save-quality-gate.js';
import {
  isMultiFacet,
  decompose,
  mergeByFacetCoverage as mergeFacetCoveragePools,
  MAX_FACETS,
} from '../query-decomposer.js';
import { routeQueryConcepts, nounPhrases, getConceptExpansionTerms } from '../entity-linker.js';
import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
import { runHyDE } from '../hyde.js';
import { matchSurrogates } from '../query-surrogates.js';
import { loadSurrogatesBatch } from '../surrogate-storage.js';

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

/** D2: Timeout for facet decomposition parallel searches (ms). */
const DECOMPOSITION_TIMEOUT_MS = 5000;
const MAX_QUERY_DECOMPOSITION_FACETS = MAX_FACETS;

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

function backfillMissingQualityScores(results: PipelineRow[]): PipelineRow[] {
  return results.map((row) => {
    if (row.quality_score !== 0 && row.quality_score != null) {
      return row;
    }

    return {
      ...row,
      quality_score: computeBackfillQualityScore(row),
    };
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

function mergeStringLists(...values: unknown[]): string[] {
  const merged = new Set<string>();
  for (const value of values) {
    if (!Array.isArray(value)) {
      continue;
    }
    for (const entry of value) {
      if (typeof entry === 'string' && entry.length > 0) {
        merged.add(entry);
      }
    }
  }
  return Array.from(merged);
}

function readFiniteScoreMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [key, score] of Object.entries(value as Record<string, unknown>)) {
    if (typeof score === 'number' && Number.isFinite(score)) {
      normalized[key] = score;
    }
  }
  return normalized;
}

function mergeScoreMaps(...maps: Array<Record<string, number>>): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const map of maps) {
    for (const [key, score] of Object.entries(map)) {
      if (!(key in merged) || score > merged[key]!) {
        merged[key] = score;
      }
    }
  }
  return merged;
}

function getCandidateSources(row: PipelineRow): string[] {
  const explicitSources = mergeStringLists(row.sources);
  if (explicitSources.length > 0) {
    return explicitSources;
  }
  return typeof row.source === 'string' && row.source.length > 0 ? [row.source] : [];
}

function getCandidateSourceScores(row: PipelineRow): Record<string, number> {
  const sourceScores = readFiniteScoreMap(row.sourceScores);
  if (Object.keys(sourceScores).length > 0) {
    return sourceScores;
  }

  const resolvedScore = resolveEffectiveScore(row);
  if (resolvedScore <= 0) {
    return {};
  }

  const fallbackScores: Record<string, number> = {};
  for (const source of getCandidateSources(row)) {
    fallbackScores[source] = resolvedScore;
  }
  return fallbackScores;
}

function annotateBranchScore(row: PipelineRow, branchLabel: string): Record<string, number> {
  const existingBranchScores = readFiniteScoreMap(row.stage1BranchScores);
  const effectiveScore = resolveEffectiveScore(row);
  if (branchLabel.length === 0 || !Number.isFinite(effectiveScore)) {
    return existingBranchScores;
  }
  return mergeScoreMaps(existingBranchScores, { [branchLabel]: effectiveScore });
}

function mergeCandidateRows(
  existing: PipelineRow | undefined,
  incoming: PipelineRow,
  branchLabel: string,
): PipelineRow {
  const incomingBranchScores = annotateBranchScore(incoming, branchLabel);
  if (!existing) {
    const sources = getCandidateSources(incoming);
    const channelAttribution = mergeStringLists(incoming.channelAttribution, sources);
    return {
      ...incoming,
      sources: sources.length > 0 ? sources : incoming.sources,
      channelAttribution: channelAttribution.length > 0 ? channelAttribution : incoming.channelAttribution,
      sourceScores: Object.keys(getCandidateSourceScores(incoming)).length > 0
        ? getCandidateSourceScores(incoming)
        : incoming.sourceScores,
      stage1BranchScores: Object.keys(incomingBranchScores).length > 0 ? incomingBranchScores : undefined,
      stage1BranchCount: Object.keys(incomingBranchScores).length || incoming.stage1BranchCount,
      channelCount: sources.length > 0 ? sources.length : incoming.channelCount,
    };
  }

  const existingScore = resolveEffectiveScore(existing);
  const incomingScore = resolveEffectiveScore(incoming);
  const primary = incomingScore > existingScore ? incoming : existing;
  const secondary = primary === incoming ? existing : incoming;

  const mergedSources = mergeStringLists(getCandidateSources(existing), getCandidateSources(incoming));
  const mergedChannelAttribution = mergeStringLists(
    existing.channelAttribution,
    incoming.channelAttribution,
    mergedSources,
  );
  const mergedSourceScores = mergeScoreMaps(
    getCandidateSourceScores(existing),
    getCandidateSourceScores(incoming),
  );
  const mergedBranchScores = mergeScoreMaps(
    readFiniteScoreMap(existing.stage1BranchScores),
    incomingBranchScores,
  );

  return {
    ...secondary,
    ...primary,
    sources: mergedSources.length > 0 ? mergedSources : primary.sources,
    source: typeof primary.source === 'string' && primary.source.length > 0
      ? primary.source
      : (mergedSources[0] ?? primary.source),
    channelAttribution: mergedChannelAttribution.length > 0
      ? mergedChannelAttribution
      : primary.channelAttribution,
    sourceScores: Object.keys(mergedSourceScores).length > 0
      ? mergedSourceScores
      : primary.sourceScores,
    stage1BranchScores: Object.keys(mergedBranchScores).length > 0
      ? mergedBranchScores
      : primary.stage1BranchScores,
    stage1BranchCount: Object.keys(mergedBranchScores).length || primary.stage1BranchCount,
    channelCount: mergedSources.length > 0 ? mergedSources.length : primary.channelCount,
  };
}

function mergeCandidateBatches(
  batches: Array<{ label: string; rows: PipelineRow[] }>,
  options: { seedCandidates?: PipelineRow[]; seedLabel?: string } = {},
): PipelineRow[] {
  const merged = new Map<string, PipelineRow>();
  const seedLabel = options.seedLabel ?? '';

  for (const row of options.seedCandidates ?? []) {
    const key = String(row.id);
    merged.set(key, mergeCandidateRows(merged.get(key), row, seedLabel));
  }

  for (const batch of batches) {
    for (const row of batch.rows) {
      const key = String(row.id);
      merged.set(key, mergeCandidateRows(merged.get(key), row, batch.label));
    }
  }

  return Array.from(merged.values());
}

/**
 * Build deep-mode query variants using rule-based synonym expansion.
 *
 * The original query is always the first variant. Up to `MAX_DEEP_QUERY_VARIANTS - 1`
 * additional variants are produced by `expandQuery`. If expansion fails or produces
 * no new terms, the array contains only the original query.
 *
 * Simple-query bypass (038): When R15 classifies the query as "simple",
 * rule-based expansion is skipped — consistent with the R12 embedding-expansion
 * path's `isExpansionActive()` gate. Simple queries do not benefit from synonym
 * expansion and the additional search channels add latency without recall gain.
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

    // Deep mode: ensure at least 2 variants so the multi-search branch fires.
    // When synonym expansion produces no new variants (simple/domain-specific queries),
    // generate a basic reformulation to trigger the parallel search path.
    if (variants.size < 2) {
      const words = query.trim().split(/\s+/);
      if (words.length >= 2) {
        variants.add(words.slice().reverse().join(' '));
      } else {
        variants.add(`what is ${query}`);
      }
    }

    return Array.from(variants).slice(0, MAX_DEEP_QUERY_VARIANTS);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[stage1-candidate-gen] buildDeepQueryVariants failed, using original query: ${msg}`
    );
    return [query];
  }
}

function normalizeFacetText(fragment: string): string {
  return fragment
    .replace(/^[\s,:;]+|[\s,.:;?!]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decomposeQueryFacets(query: string): string[] {
  const trimmed = normalizeFacetText(query);
  if (trimmed.length === 0) return [];

  const focusMatch = trimmed.match(/\babout\s+(.+?)[?.!]*$/i);
  const focusSegment = focusMatch?.[1]?.trim() ?? trimmed;

  const listLikeFacets = focusSegment
    .split(/\s*(?:,|\band\b|\bor\b|\balso\b|\bplus\b|\bas well as\b|\balong with\b)\s*/i)
    .map(normalizeFacetText)
    .filter((facet) => facet.length > 0);

  if (listLikeFacets.length >= 2) {
    return [...new Set(listLikeFacets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
  }

  if (!isMultiFacet(trimmed)) {
    return [trimmed];
  }

  const decomposedFacets = decompose(trimmed)
    .map(normalizeFacetText)
    .filter((facet) => facet.length > 0);

  if (decomposedFacets.length === 0) {
    return [trimmed];
  }

  return [...new Set(decomposedFacets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
}

function buildQueryDecompositionPool(query: string, mode?: string | null): string[] {
  const normalizedQuery = normalizeFacetText(query);
  if (mode !== 'deep' || !isQueryDecompositionEnabled()) {
    return [normalizedQuery];
  }

  const facets = decomposeQueryFacets(query).filter((facet) => facet !== normalizedQuery);
  return [normalizedQuery, ...facets];
}

function mergeQueryFacetCoverage(resultSets: PipelineRow[][]): PipelineRow[] {
  const firstSeenById = new Map<number, PipelineRow>();
  for (const resultSet of resultSets) {
    for (const row of resultSet) {
      if (!firstSeenById.has(row.id)) {
        firstSeenById.set(row.id, row);
      }
    }
  }
  return Array.from(firstSeenById.values());
}

// -- Stage 1 --

/**
 * Execute Stage 1: Candidate Generation.
 *
 * Selects and runs the appropriate search channel(s) based on `config.searchType`
 * and `config.mode`, then applies vector-channel temporal contiguity when
 * enabled, followed by constitutional injection, quality filtering, and
 * tier/contextType filtering.
 *
 * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
 * results may receive a temporal proximity boost before moving downstream.
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

  // -- D2 REQ-D2-002: Graph Concept Routing -----------------------------------
  //
  // When SPECKIT_GRAPH_CONCEPT_ROUTING is enabled, extract noun phrases from
  // the query and match them against the concept alias table. If concepts are
  // matched, log them to the trace for downstream use (graph channel activation
  // is surfaced via trace metadata; actual graph channel is handled in Stage 2).
  //
  // Phase B T016: When SPECKIT_QUERY_CONCEPT_EXPANSION is also enabled,
  // matched concepts are reverse-mapped to their alias terms and appended to
  // the query for the hybrid search channel, improving recall for alias-rich
  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
  //
  // Fail-open: any error leaves candidates unchanged.

  /** Effective query for hybrid search — may be expanded by concept routing. */
  let effectiveQuery = query;

  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
    try {
      let routingDb: Parameters<typeof routeQueryConcepts>[1];
      try {
        routingDb = requireDb();
      } catch (_dbErr: unknown) {
        routingDb = undefined;
      }
      const routing = routeQueryConcepts(query, routingDb);
      if (routing.graphActivated && routing.concepts.length > 0) {
        // Phase B T016: Expand query with concept alias terms
        if (isQueryConceptExpansionEnabled()) {
          try {
            const originalTokens = nounPhrases(query);
            const expansionTerms = getConceptExpansionTerms(
              routing.concepts,
              originalTokens,
              5,
            );
            if (expansionTerms.length > 0) {
              effectiveQuery = `${query} ${expansionTerms.join(' ')}`;
              if (trace) {
                addTraceEntry(trace, 'candidate', 0, 0, 0, {
                  channel: 'd2-concept-expansion',
                  originalQuery: query,
                  expandedQuery: effectiveQuery,
                  expansionTerms,
                  matchedConcepts: routing.concepts,
                });
              }
            }
          } catch (expansionErr: unknown) {
            const expansionMsg = expansionErr instanceof Error ? expansionErr.message : String(expansionErr);
            console.warn(`[stage1-candidate-gen] D2 concept expansion failed (fail-open): ${expansionMsg}`);
          }
        }

        if (trace) {
          addTraceEntry(trace, 'candidate', 0, 0, 0, {
            channel: 'd2-concept-routing',
            matchedConcepts: routing.concepts,
            graphActivated: true,
          });
        }
      }
    } catch (routingErr: unknown) {
      const routingMsg = routingErr instanceof Error ? routingErr.message : String(routingErr);
      console.warn(`[stage1-candidate-gen] D2 concept routing failed: ${routingMsg}`);
    }
  }

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
  //
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
      // -- D2 REQ-D2-001: Query Decomposition (SPECKIT_QUERY_DECOMPOSITION) ---
      //
      // When enabled and the query is multi-faceted, decompose into up to 3
      // sub-query facets and run hybrid search per facet. Results are merged
      // by facet coverage (items appearing in multiple facets rank higher).
      //
      // This block takes the place of the synonym-expansion path below when
      // decomposition fires. If decomposition is disabled, not applicable, or
      // fails, execution falls through to the existing expansion logic.

      if (isQueryDecompositionEnabled() && isMultiFacet(query)) {
        try {
          const normalizedQuery = normalizeFacetText(query);
          let facets: string[] = [];

          try {
            facets = buildQueryDecompositionPool(query, mode)
              .filter((facet) => facet !== normalizedQuery)
              .map(normalizeFacetText)
              .filter((facet) => facet.length > 0);
          } catch (facetErr: unknown) {
            const facetMsg = facetErr instanceof Error ? facetErr.message : String(facetErr);
            console.warn(
              `[stage1-candidate-gen] D2 faceted query decomposition failed, falling back to basic decomposition: ${facetMsg}`
            );
          }

          if (facets.length === 0) {
            facets = decompose(query)
              .map(normalizeFacetText)
              .filter((facet) => facet.length > 0 && facet !== normalizedQuery);
          }

          facets = [...new Set(facets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);

          if (facets.length > 0) {
            // Run hybrid for the original query plus each facet, in parallel
            const allQueries = [query, ...facets];
            // FIX #7: Use Promise.allSettled so one failing facet branch
            // does not discard results from all other branches.
            const facetSettledResults = await withTimeout(
              Promise.allSettled(
                allQueries.map(async (q): Promise<PipelineRow[]> => {
                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
                  if (!facetEmbedding) {
                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
                    return [];
                  }
                  return hybridSearch.collectRawCandidates(
                    q,
                    facetEmbedding,
                    { limit, specFolder, includeArchived }
                  ) as Promise<PipelineRow[]>;
                })
              ),
              DECOMPOSITION_TIMEOUT_MS,
              'D2 facet decomposition',
            );
            const facetResultSets = facetSettledResults.map((result, idx) => {
              if (result.status === 'fulfilled') return result.value;
              console.warn(`[stage1-candidate-gen] D2 facet branch ${idx} rejected: ${result.reason}`);
              return [] as PipelineRow[];
            });

            channelCount = allQueries.length;
            const pools = allQueries.map((q, i) => ({
              query: q,
              results: facetResultSets[i] ?? [],
            }));
            candidates = mergeFacetCoveragePools(pools);

            if (trace) {
              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
                channel: 'd2-query-decomposition',
                originalQuery: query,
                facets,
                facetCount: facets.length,
              });
            }

            // Skip the standard deep-mode expansion path below
            // (jump to post-channel processing via the else-if chain)
          }
        } catch (decompErr: unknown) {
          const decompMsg = decompErr instanceof Error ? decompErr.message : String(decompErr);
          console.warn(
            `[stage1-candidate-gen] D2 query decomposition failed, falling through to expansion: ${decompMsg}`
          );
          // Fall through to standard deep expansion path below (candidates is empty)
        }
      }

      // Only run existing expansion logic when decomposition did not produce results
      if (candidates.length === 0) {

      const queryVariants = await buildDeepQueryVariants(query);

      if (queryVariants.length > 1) {
        try {
          // F1: Wrap parallel variant searches with latency budget.
          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
          // FIX #7: Use Promise.allSettled so one failing variant does not
          // discard results from all other variant branches.
          const variantSettledResults = await withTimeout(
            Promise.allSettled(
              queryVariants.map(async (variant): Promise<PipelineRow[]> => {
                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
                if (!variantEmbedding) {
                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
                  return [];
                }
                const variantResults = await hybridSearch.collectRawCandidates(
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
          const variantResultSets: PipelineRow[][] = variantSettledResults.map((result, idx) => {
            if (result.status === 'fulfilled') return result.value;
            console.warn(`[stage1-candidate-gen] Deep variant branch ${idx} rejected: ${result.reason}`);
            return [] as PipelineRow[];
          });

          channelCount = queryVariants.length;

          // Merge variant results, deduplicate by id, preserve first-occurrence order
          candidates = mergeCandidateBatches(
            variantResultSets.map((rows, index) => ({
              label: queryVariants[index] ?? `deep-variant-${index}`,
              rows,
            })),
          );
        } catch (expandErr: unknown) {
          const expandMsg =
            expandErr instanceof Error ? expandErr.message : String(expandErr);
          console.warn(
            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
          );
          // Fall through to single hybrid search below
          channelCount = 1;
          candidates = (await hybridSearch.collectRawCandidates(
            query,
            effectiveEmbedding,
            { limit, specFolder, includeArchived }
          )) as PipelineRow[];
        }
      } else {
        // ExpandQuery returned only the original; treat as standard hybrid
        channelCount = 1;
        candidates = (await hybridSearch.collectRawCandidates(
          query,
          effectiveEmbedding,
          { limit, specFolder, includeArchived }
        )) as PipelineRow[];
      }

      } // end: if (candidates.length === 0)
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
              hybridSearch.collectRawCandidates(
                query,
                effectiveEmbedding,
                { limit, specFolder, includeArchived }
              ).catch((err: unknown): PipelineRow[] => {
                console.warn(
                  '[stage1-candidate-gen] Baseline candidate collection failed:',
                  err instanceof Error ? err.message : String(err)
                );
                return [];
              }),
              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
                async (expandedEmb): Promise<PipelineRow[]> => {
                  if (!expandedEmb) {
                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
                    return [];
                  }
                  return hybridSearch.collectRawCandidates(
                    expanded.combinedQuery,
                    expandedEmb,
                    { limit, specFolder, includeArchived }
                  ) as Promise<PipelineRow[]>;
                }
              ).catch((err: unknown): PipelineRow[] => {
                console.warn(
                  '[stage1-candidate-gen] Expansion candidate collection failed:',
                  err instanceof Error ? err.message : String(err)
                );
                return [];
              }),
            ]);

            channelCount = 2;
            r12ExpansionApplied = true;

            // Merge both result sets, deduplicate by id, baseline-first ordering
            // So baseline scores dominate when the same memory appears in both.
            candidates = mergeCandidateBatches([
              { label: query, rows: baselineResults as PipelineRow[] },
              { label: expanded.combinedQuery, rows: expansionResults as PipelineRow[] },
            ]);

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
      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
      if (!r12ExpansionApplied) {
        try {
          channelCount = 1;
          const hybridResults = (await hybridSearch.collectRawCandidates(
            effectiveQuery,
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
          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
            limit,
            specFolder,
            tier,
            contextType,
            includeConstitutional: false, // Constitutional managed separately below
            includeArchived,
          }) as PipelineRow[];
          if (isTemporalContiguityEnabled()) {
            vectorResults = (
              vectorSearchWithContiguity(
                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
                3600,
              ) as PipelineRow[] | null
            ) ?? vectorResults;
          }
          candidates = vectorResults;

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
    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
      limit,
      specFolder,
      tier,
      contextType,
      includeConstitutional: false, // Constitutional managed separately below
      includeArchived,
    }) as PipelineRow[];
    if (isTemporalContiguityEnabled()) {
      vectorResults = (
        vectorSearchWithContiguity(
          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
          3600,
        ) as PipelineRow[] | null
      ) ?? vectorResults;
    }
    candidates = vectorResults;
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

  // P0 fix: sessionId is for dedup/state tracking, NOT a governance boundary.
  // Including it here caused all candidates to be filtered out when memory_context
  // passed an ephemeral sessionId, because memories don't have session-scoped access.
  const hasGovernanceScope = Boolean(
    tenantId
    || userId
    || agentId
    || sharedSpaceId
  );
  const shouldApplyScopeFiltering = hasGovernanceScope || isScopeEnforcementEnabled();
  const scopeFilter = {
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
  };
  let allowedSharedSpaceIds: Set<string> | undefined;

  if (shouldApplyScopeFiltering) {
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
        // H12 FIX: Use shouldApplyScopeFiltering (not just hasGovernanceScope)
        // to ensure constitutional injection respects global scope enforcement
        const filteredConstitutional = shouldApplyScopeFiltering
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

  candidates = backfillMissingQualityScores(candidates);
  candidates = filterByMinQualityScore(candidates, qualityThreshold);

  // -- D2 REQ-D2-003: Corpus-Grounded LLM Reformulation ----------------------
  //
  // When SPECKIT_LLM_REFORMULATION is enabled and mode === 'deep':
  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
  //   2. Ask the LLM to produce a step-back abstraction + corpus-grounded variants.
  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
  //   4. Deduplicate and merge into candidates.
  //
  // Budget: 1 LLM call per cache miss (0 on cache hit).
  // Fail-open: any error leaves candidates unchanged.

  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
    try {
      const seeds = cheapSeedRetrieve(query, { limit: 3 });
      const reform = await llm.rewrite({ q: query, seeds, mode: 'step_back+corpus' });
      const allQueries = fanout([query, reform.abstract, ...reform.variants]);

      if (allQueries.length > 1) {
        const reformEmbedding: Float32Array | number[] | null =
          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

        if (reformEmbedding) {
          // FIX #7: Use Promise.allSettled so one failing reformulation
          // branch does not discard results from all other branches.
          const reformSettledResults = await Promise.allSettled(
            allQueries.map(async (q, idx): Promise<PipelineRow[]> => {
              // Reuse cached embedding for original query (idx 0); generate fresh for variants
              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
              if (!emb) {
                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
                return [];
              }
              return hybridSearch.collectRawCandidates(
                q,
                emb,
                { limit, specFolder, includeArchived }
              ) as Promise<PipelineRow[]>;
            })
          );
          const reformResultSets = reformSettledResults.map((result, idx) => {
            if (result.status === 'fulfilled') return result.value;
            console.warn(`[stage1-candidate-gen] D2 LLM reform branch ${idx} rejected: ${result.reason}`);
            return [] as PipelineRow[];
          });

          if (reformResultSets.length > 0) {
            const filteredReformSets = reformResultSets.map((resultSet, index) => {
              let rows = shouldApplyScopeFiltering
                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
                : resultSet;
              if (contextType) {
                rows = rows.filter((r) => resolveRowContextType(r) === contextType);
              }
              if (tier) {
                rows = applyTierFilter(rows, tier);
              }
              rows = backfillMissingQualityScores(rows);
              rows = filterByMinQualityScore(rows, qualityThreshold);
              return {
                label: allQueries[index] ?? `d2-reform-${index}`,
                rows,
              };
            });
            const reformMergedCount = filteredReformSets.reduce((sum, batch) => sum + batch.rows.length, 0);
            candidates = mergeCandidateBatches(filteredReformSets, {
              seedCandidates: candidates,
              seedLabel: query,
            });
            channelCount += allQueries.length - 1; // discount original (already counted)

            if (trace) {
              addTraceEntry(trace, 'candidate', allQueries.length - 1, reformMergedCount, 0, {
                channel: 'd2-llm-reformulation',
                abstract: reform.abstract,
                variantCount: reform.variants.length,
                fanoutCount: allQueries.length,
              });
            }
          }
        }
      }
    } catch (reformErr: unknown) {
      const reformMsg = reformErr instanceof Error ? reformErr.message : String(reformErr);
      console.warn(`[stage1-candidate-gen] D2 LLM reformulation failed: ${reformMsg}`);
    }
  }

  // -- D2 REQ-D2-004: HyDE Shadow Mode ----------------------------------------
  //
  // When SPECKIT_HYDE is enabled and mode === 'deep':
  //   - Check if the current baseline has low confidence.
  //   - If so, generate a HyDE pseudo-document and embed it.
  //   - Run a vector-only search with the pseudo-document embedding.
  //   - Shadow mode (SPECKIT_HYDE_ACTIVE=false): log results, do NOT merge.
  //   - Active mode (SPECKIT_HYDE_ACTIVE=true): merge into candidates.
  //
  // Budget: 1 LLM call per cache miss (shared cache with reformulation → ≤2 total).
  // Fail-open: any error leaves candidates unchanged.

  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
    try {
      const rawHydeCandidates = await runHyDE(query, candidates, limit, specFolder);
      const hydeCandidates = shouldApplyScopeFiltering
        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
        : rawHydeCandidates;
      if (hydeCandidates.length > 0) {
        let newHydeCandidates = hydeCandidates;
        // H11 FIX: Apply the same tier/context/quality filters as main candidates
        if (contextType) {
          newHydeCandidates = newHydeCandidates.filter((r) => resolveRowContextType(r) === contextType);
        }
        if (tier) {
          newHydeCandidates = applyTierFilter(newHydeCandidates, tier);
        }
        newHydeCandidates = backfillMissingQualityScores(newHydeCandidates);
        newHydeCandidates = filterByMinQualityScore(newHydeCandidates, qualityThreshold);
        candidates = mergeCandidateBatches([
          { label: 'hyde', rows: newHydeCandidates },
        ], {
          seedCandidates: candidates,
          seedLabel: query,
        });
        channelCount++;

        if (trace) {
          addTraceEntry(trace, 'candidate', 1, newHydeCandidates.length, 0, {
            channel: 'd2-hyde',
            hydeCandidates: newHydeCandidates.length,
          });
        }
      }
    } catch (hydeErr: unknown) {
      const hydeMsg = hydeErr instanceof Error ? hydeErr.message : String(hydeErr);
      console.warn(`[stage1-candidate-gen] D2 HyDE failed: ${hydeMsg}`);
    }
  }

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

            // F02-003: Batch-fetch instead of N+1 per-item queries
            const newSummaryIds = summaryResults
              .filter((sr) => !existingIds.has(String(sr.memoryId)))
              .map((sr) => sr.memoryId);

            if (newSummaryIds.length > 0) {
              const placeholders = newSummaryIds.map(() => '?').join(', ');
              const memRows = db.prepare(
                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
              ).all(...newSummaryIds) as PipelineRow[];

              const memRowMap = new Map(memRows.map((r) => [r.id, r]));
              for (const sr of summaryResults) {
                if (!existingIds.has(String(sr.memoryId))) {
                  const memRow = memRowMap.get(sr.memoryId);
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
            }

            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
            const tierFilteredSummaryHits = applyTierFilter(folderFilteredSummaryHits, tier);
            const contextFilteredSummaryHits = contextType
              ? tierFilteredSummaryHits.filter((r) => resolveRowContextType(r) === contextType)
              : tierFilteredSummaryHits;
            const scopeFilteredSummaryHits = shouldApplyScopeFiltering
              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)
              : contextFilteredSummaryHits;

            // Apply the same quality threshold that other candidates go through
            const backfilledSummaryHits = backfillMissingQualityScores(scopeFilteredSummaryHits);
            const filteredSummaryHits = filterByMinQualityScore(backfilledSummaryHits, qualityThreshold);

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

  // -- D2 REQ-D2-005: Query Surrogate Matching (SPECKIT_QUERY_SURROGATES) ----
  //
  // When SPECKIT_QUERY_SURROGATES is enabled, batch-load stored surrogates for
  // all candidate IDs and run matchSurrogates() against each. Candidates with
  // a surrogate match above MIN_MATCH_THRESHOLD receive a score boost (additive,
  // capped at 0.15) to improve ranking for vocabulary-mismatched queries.
  //
  // This is a lightweight post-candidate boost — no new candidates are added,
  // only existing ones are re-scored. No LLM calls on this path.
  //
  // Fail-open: any error leaves candidates unchanged.

  if (isQuerySurrogatesEnabled() && candidates.length > 0) {
    try {
      const surrogateDb = requireDb();
      const candidateIds = candidates
        .map((r) => r.id)
        .filter((id): id is number => typeof id === 'number');

      if (candidateIds.length > 0) {
        const surrogateMap = loadSurrogatesBatch(surrogateDb, candidateIds);

        if (surrogateMap.size > 0) {
          let boostedCount = 0;
          const SURROGATE_BOOST_CAP = 0.15;

          candidates = candidates.map((row) => {
            const surrogates = surrogateMap.get(row.id as number);
            if (!surrogates) return row;

            const matchResult = matchSurrogates(query, {
              aliases: surrogates.aliases,
              headings: surrogates.headings,
              summary: surrogates.summary,
              surrogateQuestions: surrogates.surrogateQuestions,
              generatedAt: surrogates.generatedAt,
            });

            if (matchResult.score > 0) {
              boostedCount++;
              // FIX #2: Use resolveEffectiveScore() as the base instead of
              // raw row.score. For vector-only rows with only `similarity`,
              // row.score may be undefined/0 while similarity is 0.82+.
              // Using the canonical fallback chain prevents overwriting
              // strong relevance signals with tiny surrogate boosts.
              const currentScore = resolveEffectiveScore(row);
              const boost = Math.min(matchResult.score * SURROGATE_BOOST_CAP, SURROGATE_BOOST_CAP);
              const boostedScore = Math.min(1, currentScore + boost);
              return {
                ...row,
                score: boostedScore,
                rrfScore: boostedScore,
                intentAdjustedScore: boostedScore,
                surrogateBoost: boost,
                surrogateMatches: matchResult.matchedSurrogates,
              };
            }

            return row;
          });

          if (trace && boostedCount > 0) {
            addTraceEntry(trace, 'candidate', 0, boostedCount, 0, {
              channel: 'd2-query-surrogates',
              surrogatesLoaded: surrogateMap.size,
              boostedCount,
            });
          }
        }
      }
    } catch (surrogateErr: unknown) {
      const surrogateMsg = surrogateErr instanceof Error ? surrogateErr.message : String(surrogateErr);
      console.warn(`[stage1-candidate-gen] D2 query surrogate matching failed: ${surrogateMsg}`);
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

  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
  // while channelCount counts parallel query variants. In hybrid mode both vector
  // and keyword channels are always active regardless of query variant count.
  const activeChannels = searchType === 'hybrid' ? 2 : 1;

  return {
    candidates,
    metadata: {
      searchType,
      channelCount,
      activeChannels,
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
  decomposeQueryFacets,
  mergeByFacetCoverage: mergeQueryFacetCoverage,
  buildQueryDecompositionPool,
  MAX_QUERY_DECOMPOSITION_FACETS,
};
