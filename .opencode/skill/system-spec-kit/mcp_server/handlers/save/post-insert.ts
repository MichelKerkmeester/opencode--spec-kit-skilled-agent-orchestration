// ───────────────────────────────────────────────────────────────
// MODULE: Post Insert
// ───────────────────────────────────────────────────────────────
import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';

import * as embeddings from '../../lib/providers/embeddings.js';
import { processCausalLinks } from '../causal-links-processor.js';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
  isPostInsertEnrichmentEnabled,
  type SavePlannerMode,
} from '../../lib/search/search-flags.js';
import {
  extractEntities,
  filterEntities,
  refreshAutoEntitiesForMemory,
} from '../../lib/extraction/entity-extractor.js';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries.js';
import { runEntityLinkingForMemory } from '../../lib/search/entity-linker.js';
import { onIndex, isGraphRefreshEnabled } from '../../lib/search/graph-lifecycle.js';
import { toErrorMessage } from '../../utils/index.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Duplicate-save no-op feedback hardening


interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

// M13: Per-step enum status refactor (R7-002, R8-001, R8-002, R11-005, R12-005, R14-003, R21-001).
// Replaces boolean-valued record that collapsed success / feature-disabled skip /
// nothing-to-do skip / deferral / density-guard skip / partial failure into `true`.
export type EnrichmentStepStatus = 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial';

export type EnrichmentSkipReason =
  | 'feature_disabled'
  | 'nothing_to_do'
  | 'planner_first_mode'
  | 'density_guard'
  | 'graph_lifecycle_no_op'
  | 'graph_refresh_disabled'
  | 'entity_linking_disabled'
  | 'empty_content'
  | 'extraction_not_ran'
  | 'summary_not_stored';

export type EnrichmentFailureReason =
  | 'causal_links_exception'
  | 'entity_extraction_exception'
  | 'summary_exception'
  | 'entity_linking_exception'
  | 'graph_lifecycle_exception'
  | 'partial_causal_link_unresolved'
  | 'partial_causal_link_errors';

export interface EnrichmentStepResult {
  status: EnrichmentStepStatus;
  reason?: EnrichmentSkipReason | EnrichmentFailureReason;
  warnings?: string[];
}

export interface EnrichmentStatus {
  causalLinks: EnrichmentStepResult;
  entityExtraction: EnrichmentStepResult;
  summaries: EnrichmentStepResult;
  entityLinking: EnrichmentStepResult;
  graphLifecycle: EnrichmentStepResult;
}

export type PostInsertExecutionReason =
  | 'planner-first-mode'
  | 'enrichment_step_failed'
  | 'enrichment_step_partial';

export interface PostInsertExecutionStatus {
  // T-PIN-07 (R17-002): an exception-driven step failure must NOT be reported
  // as `ran`.  When any step reports `failed`, execution status rolls up to
  // `failed`; when any step reports `partial`, it rolls up to `partial`.
  status: 'ran' | 'deferred' | 'failed' | 'partial';
  reason?: PostInsertExecutionReason;
  followUpAction?: 'runEnrichmentBackfill';
  failedSteps?: Array<keyof EnrichmentStatus>;
  partialSteps?: Array<keyof EnrichmentStatus>;
}

export interface PostInsertEnrichmentResult {
  causalLinksResult: CausalLinksResult | null;
  enrichmentStatus: EnrichmentStatus;
  executionStatus: PostInsertExecutionStatus;
}

export interface PostInsertEnrichmentOptions {
  plannerMode?: SavePlannerMode;
}

export function shouldRunPostInsertEnrichment(plannerMode: SavePlannerMode = 'plan-only'): boolean {
  return plannerMode === 'full-auto' || isPostInsertEnrichmentEnabled();
}

function makeSkipped(reason: EnrichmentSkipReason): EnrichmentStepResult {
  return { status: 'skipped', reason };
}

function makeDeferred(): EnrichmentStepResult {
  return { status: 'deferred', reason: 'planner_first_mode' };
}

/**
 * Run post-insert enrichment pipeline for a newly saved memory.
 *
 * Sequentially executes: causal links processing, entity extraction (R10),
 * summary generation (R8), and cross-document entity linking (S5).
 * Each step is independently guarded by its feature flag and wrapped
 * in try-catch so a single failure does not block the others.
 *
 * M13 (R8-001): Each step returns a typed `EnrichmentStepResult` with
 * distinct statuses for success ('ran'), skip ('skipped' + reason),
 * failure ('failed' + reason), and partial outcomes ('partial').
 *
 * @param database - The SQLite database instance.
 * @param id - The memory row ID to enrich.
 * @param parsed - Parsed memory file data from the memory parser.
 * @returns PostInsertEnrichmentResult with causal links outcome.
 */
export async function runPostInsertEnrichment(
  database: BetterSqlite3.Database,
  id: number,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
): Promise<PostInsertEnrichmentResult> {
  // M13: Track enrichment step outcomes with typed OperationResult shape
  const enrichmentStatus: EnrichmentStatus = {
    causalLinks: makeSkipped('nothing_to_do'),
    entityExtraction: makeSkipped('feature_disabled'),
    summaries: makeSkipped('feature_disabled'),
    entityLinking: makeSkipped('feature_disabled'),
    graphLifecycle: makeSkipped('feature_disabled'),
  };

  // CAUSAL LINKS PROCESSING
  let causalLinksResult: CausalLinksResult | null = null;
  if (parsed.hasCausalLinks && parsed.causalLinks) {
    try {
      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
      if (causalLinksResult.inserted > 0) {
        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
      }
      if (causalLinksResult.unresolved.length > 0) {
        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
      }
      // T-PIN-04 (R14-003): partial causal-link failures must surface as `partial`, not `ran`.
      const warnings: string[] = [];
      if (causalLinksResult.unresolved.length > 0) {
        warnings.push(`${causalLinksResult.unresolved.length} causal reference(s) unresolved`);
      }
      if (causalLinksResult.errors.length > 0) {
        warnings.push(`${causalLinksResult.errors.length} causal reference(s) errored`);
      }
      if (warnings.length > 0) {
        const reason: EnrichmentFailureReason = causalLinksResult.errors.length > 0
          ? 'partial_causal_link_errors'
          : 'partial_causal_link_unresolved';
        enrichmentStatus.causalLinks = { status: 'partial', reason, warnings };
      } else {
        enrichmentStatus.causalLinks = { status: 'ran' };
      }
    } catch (causal_err: unknown) {
      const message = toErrorMessage(causal_err);
      console.warn(`[memory-save] Causal links processing failed: ${message}`);
      enrichmentStatus.causalLinks = {
        status: 'failed',
        reason: 'causal_links_exception',
        warnings: [message],
      };
    }
  } else {
    // No causal links to process — explicit skip with reason, not a silent success.
    enrichmentStatus.causalLinks = makeSkipped('nothing_to_do');
  }

  // -- Auto Entity Extraction --
  // T-PIN-01 (R7-002): only mark as 'ran' when extraction actually completed; on failure,
  // downstream entity linking must NOT treat this row as having fresh entities.
  if (isAutoEntitiesEnabled()) {
    try {
      const rawEntities = extractEntities(parsed.content);
      const filtered = filterEntities(rawEntities);
      // Data integrity: clean stale auto-entities before re-extraction on update
      const entityResult = refreshAutoEntitiesForMemory(database, id, filtered);
      if (entityResult.stored > 0) {
        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
      }
      enrichmentStatus.entityExtraction = { status: 'ran' };
    } catch (entityErr: unknown) {
      const message = toErrorMessage(entityErr);
      console.warn(`[memory-save] R10 entity extraction failed: ${message}`);
      enrichmentStatus.entityExtraction = {
        status: 'failed',
        reason: 'entity_extraction_exception',
        warnings: [message],
      };
    }
  } else {
    enrichmentStatus.entityExtraction = makeSkipped('feature_disabled');
  }

  // -- R8: Memory Summary Generation --
  // T-PIN-05 (R11-005): distinguish "summary stored" from "summary generator ran but stored nothing".
  if (isMemorySummariesEnabled()) {
    try {
      const summaryResult = await generateAndStoreSummary(
        database,
        id,
        parsed.content,
        (text: string) => embeddings.generateQueryEmbedding(text)
      );
      if (summaryResult.stored) {
        console.error(`[memory-summaries] Generated summary for memory #${id}`);
        enrichmentStatus.summaries = { status: 'ran' };
      } else {
        enrichmentStatus.summaries = makeSkipped('summary_not_stored');
      }
    } catch (summaryErr: unknown) {
      const message = toErrorMessage(summaryErr);
      console.warn(`[memory-save] R8 summary generation failed: ${message}`);
      enrichmentStatus.summaries = {
        status: 'failed',
        reason: 'summary_exception',
        warnings: [message],
      };
    }
  } else {
    enrichmentStatus.summaries = makeSkipped('feature_disabled');
  }

  // -- S5: Cross-Document Entity Linking --
  // T-PIN-03 (R8-002): gate on `entityExtraction.status === 'ran'`, not just feature flags.
  // If extraction soft-failed or was skipped, linking must NOT run against stale rows.
  // T-PIN-06 (R12-005): density-guard skip surfaces as `skipped` with reason `density_guard`.
  const extractionRan = enrichmentStatus.entityExtraction.status === 'ran';
  if (isEntityLinkingEnabled() && isAutoEntitiesEnabled()) {
    if (!extractionRan) {
      // Extraction didn't run (failed or skipped) — do not run linking against stale entities.
      enrichmentStatus.entityLinking = makeSkipped('extraction_not_ran');
    } else {
      try {
        const linkResult = runEntityLinkingForMemory(database, id);
        if (linkResult.skippedByDensityGuard) {
          const density = typeof linkResult.edgeDensity === 'number'
            ? linkResult.edgeDensity.toFixed(3)
            : 'unknown';
          const threshold = typeof linkResult.densityThreshold === 'number'
            ? linkResult.densityThreshold.toFixed(3)
            : 'unknown';
          console.error(`[entity-linking] Skipped by density guard (density=${density}, threshold=${threshold})`);
          enrichmentStatus.entityLinking = {
            status: 'skipped',
            reason: 'density_guard',
            warnings: [`density=${density}, threshold=${threshold}`],
          };
        } else {
          if (linkResult.linksCreated > 0) {
            console.error(`[entity-linking] Created ${linkResult.linksCreated} cross-doc links from ${linkResult.crossDocMatches} entity matches`);
          }
          enrichmentStatus.entityLinking = { status: 'ran' };
        }
      } catch (linkErr: unknown) {
        const message = toErrorMessage(linkErr);
        console.warn(`[memory-save] S5 entity linking failed: ${message}`);
        enrichmentStatus.entityLinking = {
          status: 'failed',
          reason: 'entity_linking_exception',
          warnings: [message],
        };
      }
    }
  } else {
    enrichmentStatus.entityLinking = makeSkipped('feature_disabled');
  }

  // -- D3 REQ-D3-004: Graph Lifecycle — deterministic save-time enrichment --
  // Runs last; relies on entity extraction having completed above.
  // Gated via isGraphRefreshEnabled() OR SPECKIT_ENTITY_LINKING (any active graph flag).
  // T-PIN-05 (R11-005): distinguish "onIndex ran" from "onIndex returned skipped:true".
  // T-PIN-08 (R27-001): propagate the underlying onIndex skip reason rather than
  // collapsing every skip into `graph_lifecycle_no_op`; backfill can now key on
  // the specific reason (graph_refresh_disabled / entity_linking_disabled /
  // empty_content / onindex_exception) to decide whether to retry.
  if (isGraphRefreshEnabled() || isEntityLinkingEnabled()) {
    try {
      const indexResult = onIndex(database, id, parsed.content, {
        qualityScore: typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 0,
      });
      if (indexResult.skipped) {
        const reasonMap: Record<string, EnrichmentSkipReason> = {
          graph_refresh_disabled: 'graph_refresh_disabled',
          entity_linking_disabled: 'entity_linking_disabled',
          empty_content: 'empty_content',
        };
        if (indexResult.skipReason === 'onindex_exception') {
          // onIndex caught an internal exception — surface as failed, not skipped.
          enrichmentStatus.graphLifecycle = {
            status: 'failed',
            reason: 'graph_lifecycle_exception',
            warnings: ['onIndex internal exception; see logs for details'],
          };
        } else {
          const mapped = indexResult.skipReason ? reasonMap[indexResult.skipReason] : undefined;
          enrichmentStatus.graphLifecycle = makeSkipped(mapped ?? 'graph_lifecycle_no_op');
        }
      } else {
        if (indexResult.edgesCreated > 0) {
          console.error(`[graph-lifecycle] Created ${indexResult.edgesCreated} typed edges for memory #${id}`);
        }
        if (indexResult.llmBackfillScheduled) {
          console.error(`[graph-lifecycle] LLM backfill scheduled for memory #${id}`);
        }
        enrichmentStatus.graphLifecycle = { status: 'ran' };
      }
    } catch (glErr: unknown) {
      const message = toErrorMessage(glErr);
      console.warn(`[memory-save] D3 graph-lifecycle enrichment failed: ${message}`);
      enrichmentStatus.graphLifecycle = {
        status: 'failed',
        reason: 'graph_lifecycle_exception',
        warnings: [message],
      };
    }
  } else {
    enrichmentStatus.graphLifecycle = makeSkipped('feature_disabled');
  }

  // T-PIN-07 (R17-002): roll up per-step outcomes into the executionStatus so
  // an enrichment_step_failed never presents as ordinary success.  `runEnrichmentBackfill`
  // can then key on `failedSteps` + `partialSteps` rather than re-scanning the entire
  // enrichmentStatus tree.
  const failedSteps = (Object.entries(enrichmentStatus) as Array<[keyof EnrichmentStatus, EnrichmentStepResult]>)
    .filter(([, step]) => step.status === 'failed')
    .map(([name]) => name);
  const partialSteps = (Object.entries(enrichmentStatus) as Array<[keyof EnrichmentStatus, EnrichmentStepResult]>)
    .filter(([, step]) => step.status === 'partial')
    .map(([name]) => name);

  let executionStatus: PostInsertExecutionStatus;
  if (failedSteps.length > 0) {
    executionStatus = {
      status: 'failed',
      reason: 'enrichment_step_failed',
      followUpAction: 'runEnrichmentBackfill',
      failedSteps,
      ...(partialSteps.length > 0 ? { partialSteps } : {}),
    };
  } else if (partialSteps.length > 0) {
    executionStatus = {
      status: 'partial',
      reason: 'enrichment_step_partial',
      followUpAction: 'runEnrichmentBackfill',
      partialSteps,
    };
  } else {
    executionStatus = { status: 'ran' };
  }

  return {
    causalLinksResult,
    enrichmentStatus,
    executionStatus,
  };
}

export async function runPostInsertEnrichmentIfEnabled(
  database: BetterSqlite3.Database,
  id: number,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  options: PostInsertEnrichmentOptions = {},
): Promise<PostInsertEnrichmentResult> {
  if (!shouldRunPostInsertEnrichment(options.plannerMode)) {
    // M13: Deferral is NOT success — each step reports `deferred` so consumers
    // can route to runEnrichmentBackfill for recovery (R8-001, R21-001).
    return {
      causalLinksResult: null,
      enrichmentStatus: {
        causalLinks: makeDeferred(),
        entityExtraction: makeDeferred(),
        summaries: makeDeferred(),
        entityLinking: makeDeferred(),
        graphLifecycle: makeDeferred(),
      },
      executionStatus: {
        status: 'deferred',
        reason: 'planner-first-mode',
        followUpAction: 'runEnrichmentBackfill',
      },
    };
  }

  return runPostInsertEnrichment(database, id, parsed);
}
