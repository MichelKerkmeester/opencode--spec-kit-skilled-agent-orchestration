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
import { onIndex, isGraphRefreshEnabled, type OnIndexSkipReason } from '../../lib/search/graph-lifecycle.js';
import {
  clearBudget,
  emitRetryTelemetry,
  getRetryBudgetEntry,
  recordFailure,
  shouldRetry,
} from '../../lib/enrichment/retry-budget.js';
import { assertNever } from '../../lib/utils/exhaustiveness.js';
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

export type EnrichmentStepName = keyof EnrichmentStatus;

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

const ON_INDEX_SKIP_REASON_TO_ENRICHMENT_SKIP_REASON = {
  graph_refresh_disabled: 'graph_refresh_disabled',
  entity_linking_disabled: 'entity_linking_disabled',
  empty_content: 'empty_content',
  onindex_exception: 'graph_lifecycle_no_op',
} satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>;

const CAUSAL_LINK_RETRY_STEP = 'causal_links';
const CAUSAL_LINK_RETRY_REASON = 'partial_causal_link_unresolved';

function emitCausalLinkRetryTelemetry(
  memoryId: number,
  attempt: number,
  outcome: 'retry' | 'give_up' | 'resolved',
  timestamp: string,
): void {
  emitRetryTelemetry({
    type: 'event',
    event: 'retry_attempt',
    memoryId: String(memoryId),
    step: CAUSAL_LINK_RETRY_STEP,
    reason: CAUSAL_LINK_RETRY_REASON,
    attempt,
    outcome,
    timestamp,
  });
}

export function shouldRunPostInsertEnrichment(plannerMode: SavePlannerMode = 'plan-only'): boolean {
  return plannerMode === 'full-auto' || isPostInsertEnrichmentEnabled();
}

function normalizeEnrichmentSkipReason(reason: EnrichmentSkipReason): EnrichmentSkipReason {
  switch (reason) {
    case 'feature_disabled':
    case 'nothing_to_do':
    case 'planner_first_mode':
    case 'density_guard':
    case 'graph_lifecycle_no_op':
    case 'graph_refresh_disabled':
    case 'entity_linking_disabled':
    case 'empty_content':
    case 'extraction_not_ran':
    case 'summary_not_stored':
      return reason;
    default:
      return assertNever(reason, 'enrichment-skip-reason');
  }
}

function normalizeEnrichmentFailureReason(reason: EnrichmentFailureReason): EnrichmentFailureReason {
  switch (reason) {
    case 'causal_links_exception':
    case 'entity_extraction_exception':
    case 'summary_exception':
    case 'entity_linking_exception':
    case 'graph_lifecycle_exception':
    case 'partial_causal_link_unresolved':
    case 'partial_causal_link_errors':
      return reason;
    default:
      return assertNever(reason, 'enrichment-failure-reason');
  }
}

function makeSkipped(reason: EnrichmentSkipReason): EnrichmentStepResult {
  return { status: 'skipped', reason: normalizeEnrichmentSkipReason(reason) };
}

function makeDeferred(): EnrichmentStepResult {
  return { status: 'deferred', reason: normalizeEnrichmentSkipReason('planner_first_mode') };
}

function makeFailed(reason: EnrichmentFailureReason, warnings?: string[]): EnrichmentStepResult {
  return {
    status: 'failed',
    reason: normalizeEnrichmentFailureReason(reason),
    ...(warnings && warnings.length > 0 ? { warnings } : {}),
  };
}

function deriveFailureReason(name: EnrichmentStepName): EnrichmentFailureReason {
  switch (name) {
    case 'causalLinks':
      return 'causal_links_exception';
    case 'entityExtraction':
      return 'entity_extraction_exception';
    case 'summaries':
      return 'summary_exception';
    case 'entityLinking':
      return 'entity_linking_exception';
    case 'graphLifecycle':
      return 'graph_lifecycle_exception';
    default:
      return assertNever(name, 'enrichment-step-name');
  }
}

function getEnrichmentFailureLogPrefix(name: EnrichmentStepName): string {
  switch (name) {
    case 'causalLinks':
      return '[memory-save] Causal links processing failed';
    case 'entityExtraction':
      return '[memory-save] R10 entity extraction failed';
    case 'summaries':
      return '[memory-save] R8 summary generation failed';
    case 'entityLinking':
      return '[memory-save] S5 entity linking failed';
    case 'graphLifecycle':
      return '[memory-save] D3 graph-lifecycle enrichment failed';
    default:
      return assertNever(name, 'enrichment-step-log-prefix');
  }
}

/**
 * Run one enrichment lane with shared flag gating, error classification, and
 * typed success/skip/failure output.
 */
export async function runEnrichmentStep<T>(
  name: EnrichmentStepName,
  isEnabled: () => boolean,
  runner: () => Promise<T>,
  successHandler: (result: T) => EnrichmentStepResult,
  options?: { skipReason?: EnrichmentSkipReason },
): Promise<EnrichmentStepResult> {
  if (!isEnabled()) {
    return makeSkipped(options?.skipReason ?? 'feature_disabled');
  }

  try {
    const result = await runner();
    return successHandler(result);
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn(`${getEnrichmentFailureLogPrefix(name)}: ${message}`);
    return makeFailed(deriveFailureReason(name), [message]);
  }
}

interface CausalLinksStepState {
  result: CausalLinksResult | null;
  retryAttempts: number | null;
  shouldRetry: boolean;
}

function buildCausalLinksStepResult(
  id: number,
  result: CausalLinksResult,
  state: CausalLinksStepState,
): EnrichmentStepResult {
  if (result.inserted > 0) {
    console.error(`[causal-links] Processed ${result.inserted} causal edges for memory #${id}`);
  }
  if (result.unresolved.length > 0) {
    console.warn(`[causal-links] ${result.unresolved.length} references could not be resolved`);
  }

  const warnings: string[] = [];
  if (result.unresolved.length > 0) {
    warnings.push(`${result.unresolved.length} causal reference(s) unresolved`);
  }
  if (result.errors.length > 0) {
    warnings.push(`${result.errors.length} causal reference(s) errored`);
  }
  if (warnings.length === 0) {
    return { status: 'ran' };
  }

  const reason: EnrichmentFailureReason = result.errors.length > 0
    ? 'partial_causal_link_errors'
    : 'partial_causal_link_unresolved';
  if (reason === CAUSAL_LINK_RETRY_REASON) {
    state.shouldRetry = shouldRetry(id, CAUSAL_LINK_RETRY_STEP, reason);
    const retryEntry = recordFailure(id, CAUSAL_LINK_RETRY_STEP, reason);
    state.retryAttempts = retryEntry.attempts;
    emitCausalLinkRetryTelemetry(
      id,
      retryEntry.attempts - 1,
      state.shouldRetry ? 'retry' : 'give_up',
      retryEntry.lastFailedAt,
    );
  }
  return { status: 'partial', reason, warnings };
}

async function runCausalLinksStep(
  database: BetterSqlite3.Database,
  id: number,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  state: CausalLinksStepState,
): Promise<EnrichmentStepResult> {
  return runEnrichmentStep(
    'causalLinks',
    () => parsed.hasCausalLinks && Boolean(parsed.causalLinks),
    async () => {
      state.result = processCausalLinks(database, id, parsed.causalLinks!);
      return state.result;
    },
    (result) => buildCausalLinksStepResult(id, result, state),
    { skipReason: 'nothing_to_do' },
  );
}

async function runEntityExtractionStep(
  database: BetterSqlite3.Database,
  id: number,
  content: string,
): Promise<EnrichmentStepResult> {
  return runEnrichmentStep(
    'entityExtraction',
    () => isAutoEntitiesEnabled(),
    async () => {
      const rawEntities = extractEntities(content);
      const filtered = filterEntities(rawEntities);
      return refreshAutoEntitiesForMemory(database, id, filtered);
    },
    (entityResult) => {
      if (entityResult.stored > 0) {
        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
      }
      return { status: 'ran' };
    },
  );
}

async function runSummariesStep(
  database: BetterSqlite3.Database,
  id: number,
  content: string,
): Promise<EnrichmentStepResult> {
  return runEnrichmentStep(
    'summaries',
    () => isMemorySummariesEnabled(),
    async () => generateAndStoreSummary(
      database,
      id,
      content,
      (text: string) => embeddings.generateQueryEmbedding(text),
    ),
    (summaryResult) => {
      if (summaryResult.stored) {
        console.error(`[memory-summaries] Generated summary for memory #${id}`);
        return { status: 'ran' };
      }
      return makeSkipped('summary_not_stored');
    },
  );
}

async function runEntityLinkingStep(
  database: BetterSqlite3.Database,
  id: number,
  extractionRan: boolean,
): Promise<EnrichmentStepResult> {
  return runEnrichmentStep(
    'entityLinking',
    () => isEntityLinkingEnabled() && isAutoEntitiesEnabled() && extractionRan,
    async () => runEntityLinkingForMemory(database, id),
    (linkResult) => {
      if (linkResult.skippedByDensityGuard) {
        const density = typeof linkResult.edgeDensity === 'number'
          ? linkResult.edgeDensity.toFixed(3)
          : 'unknown';
        const threshold = typeof linkResult.densityThreshold === 'number'
          ? linkResult.densityThreshold.toFixed(3)
          : 'unknown';
        console.error(`[entity-linking] Skipped by density guard (density=${density}, threshold=${threshold})`);
        return {
          status: 'skipped',
          reason: 'density_guard',
          warnings: [`density=${density}, threshold=${threshold}`],
        };
      }
      if (linkResult.linksCreated > 0) {
        console.error(`[entity-linking] Created ${linkResult.linksCreated} cross-doc links from ${linkResult.crossDocMatches} entity matches`);
      }
      return { status: 'ran' };
    },
    { skipReason: extractionRan ? 'feature_disabled' : 'extraction_not_ran' },
  );
}

async function runGraphLifecycleStep(
  database: BetterSqlite3.Database,
  id: number,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
): Promise<EnrichmentStepResult> {
  return runEnrichmentStep(
    'graphLifecycle',
    () => isGraphRefreshEnabled() || isEntityLinkingEnabled(),
    async () => onIndex(database, id, parsed.content, {
      qualityScore: typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 0,
    }),
    (indexResult) => {
      if (indexResult.skipped) {
        if (indexResult.skipReason === 'onindex_exception') {
          return makeFailed(
            'graph_lifecycle_exception',
            ['onIndex internal exception; see logs for details'],
          );
        }
        return makeSkipped(resolveGraphLifecycleSkipReason(indexResult.skipReason));
      }
      if (indexResult.edgesCreated > 0) {
        console.error(`[graph-lifecycle] Created ${indexResult.edgesCreated} typed edges for memory #${id}`);
      }
      if (indexResult.llmBackfillScheduled) {
        console.error(`[graph-lifecycle] LLM backfill scheduled for memory #${id}`);
      }
      return { status: 'ran' };
    },
  );
}

function buildExecutionStatus(
  enrichmentStatus: EnrichmentStatus,
  id: number,
  causalLinksState: CausalLinksStepState,
): PostInsertExecutionStatus {
  const failedSteps = (Object.entries(enrichmentStatus) as Array<[keyof EnrichmentStatus, EnrichmentStepResult]>)
    .filter(([, step]) => step.status === 'failed')
    .map(([name]) => name);
  const partialSteps = (Object.entries(enrichmentStatus) as Array<[keyof EnrichmentStatus, EnrichmentStepResult]>)
    .filter(([, step]) => step.status === 'partial')
    .map(([name]) => name);

  const causalLinkRetryExhausted = enrichmentStatus.causalLinks.status === 'partial'
    && enrichmentStatus.causalLinks.reason === 'partial_causal_link_unresolved'
    && !causalLinksState.shouldRetry;
  if (causalLinkRetryExhausted) {
    const attempts = causalLinksState.retryAttempts ?? 'unknown';
    console.warn(
      `[memory-save] Retry budget exhausted for memory #${id} step=causal_links reason=partial_causal_link_unresolved attempts=${attempts}`,
    );
  }

  const shouldScheduleBackfill = failedSteps.length > 0
    || partialSteps.some((step) => step !== 'causalLinks')
    || (
      enrichmentStatus.causalLinks.status === 'partial'
      && enrichmentStatus.causalLinks.reason !== 'partial_causal_link_unresolved'
    )
    || (
      enrichmentStatus.causalLinks.status === 'partial'
      && enrichmentStatus.causalLinks.reason === 'partial_causal_link_unresolved'
      && !causalLinkRetryExhausted
    );
  const followUpAction = shouldScheduleBackfill ? 'runEnrichmentBackfill' : undefined;

  if (failedSteps.length > 0) {
    return {
      status: 'failed',
      reason: 'enrichment_step_failed',
      ...(followUpAction ? { followUpAction } : {}),
      failedSteps,
      ...(partialSteps.length > 0 ? { partialSteps } : {}),
    };
  }
  if (partialSteps.length > 0) {
    return {
      status: 'partial',
      reason: 'enrichment_step_partial',
      ...(followUpAction ? { followUpAction } : {}),
      partialSteps,
    };
  }

  const resolvedRetryEntry = getRetryBudgetEntry(id, CAUSAL_LINK_RETRY_STEP, CAUSAL_LINK_RETRY_REASON);
  if (resolvedRetryEntry) {
    emitCausalLinkRetryTelemetry(
      id,
      resolvedRetryEntry.attempts - 1,
      'resolved',
      new Date().toISOString(),
    );
  }
  clearBudget(id);
  return { status: 'ran' };
}

function resolveGraphLifecycleSkipReason(skipReason: unknown): EnrichmentSkipReason {
  if (skipReason === undefined || skipReason === null) {
    return normalizeEnrichmentSkipReason('graph_lifecycle_no_op');
  }
  if (typeof skipReason === 'string' && Object.prototype.hasOwnProperty.call(ON_INDEX_SKIP_REASON_TO_ENRICHMENT_SKIP_REASON, skipReason)) {
    return normalizeEnrichmentSkipReason(
      ON_INDEX_SKIP_REASON_TO_ENRICHMENT_SKIP_REASON[skipReason as OnIndexSkipReason],
    );
  }
  if (typeof skipReason === 'string') {
    console.warn(
      `[memory-save] ${JSON.stringify({
        event: 'unmapped_onindex_skip_reason',
        skipReason,
      })}`,
    );
    return normalizeEnrichmentSkipReason('graph_lifecycle_no_op');
  }
  return assertNever(skipReason as never, 'onindex-skip-reason');
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
  const enrichmentStatus: EnrichmentStatus = {
    causalLinks: makeSkipped('nothing_to_do'),
    entityExtraction: makeSkipped('feature_disabled'),
    summaries: makeSkipped('feature_disabled'),
    entityLinking: makeSkipped('feature_disabled'),
    graphLifecycle: makeSkipped('feature_disabled'),
  };
  const causalLinksState: CausalLinksStepState = {
    result: null,
    retryAttempts: null,
    shouldRetry: true,
  };

  enrichmentStatus.causalLinks = await runCausalLinksStep(database, id, parsed, causalLinksState);
  enrichmentStatus.entityExtraction = await runEntityExtractionStep(database, id, parsed.content);
  enrichmentStatus.summaries = await runSummariesStep(database, id, parsed.content);
  const extractionRan = enrichmentStatus.entityExtraction.status === 'ran';
  enrichmentStatus.entityLinking = await runEntityLinkingStep(database, id, extractionRan);
  enrichmentStatus.graphLifecycle = await runGraphLifecycleStep(database, id, parsed);

  return {
    causalLinksResult: causalLinksState.result,
    enrichmentStatus,
    executionStatus: buildExecutionStatus(enrichmentStatus, id, causalLinksState),
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
