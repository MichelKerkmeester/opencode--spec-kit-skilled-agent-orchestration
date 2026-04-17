// ───────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────
import { buildMutationHookFeedback } from '../../hooks/mutation-feedback.js';
import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
import type { SavePlannerMode } from '../../lib/search/search-flags.js';
import type { EnrichmentStatus, PostInsertExecutionStatus } from './post-insert.js';
import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Dry-run preflight for memory_save


export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export type PlannerFollowUpActionType =
  | 'apply'
  | 'reconsolidate'
  | 'enrich'
  | 'refresh-graph'
  | 'reindex';

export interface PlannerRouteTarget {
  routeCategory: RouteCategory;
  targetDocPath: string;
  canonicalFilePath?: string;
  targetAnchorId?: string | null;
  mergeMode?: MergeModeHint;
}

export interface PlannerProposedEdit {
  targetDocPath: string;
  targetAnchorId?: string | null;
  mergeMode?: MergeModeHint;
  routeCategory?: RouteCategory;
  summary: string;
  contentPreview?: string;
}

export interface PlannerBlocker {
  code: string;
  message: string;
  targetDocPath?: string;
  targetAnchorId?: string | null;
  routeCategory?: RouteCategory;
}

export interface PlannerAdvisory {
  code: string;
  message: string;
  targetDocPath?: string;
  targetAnchorId?: string | null;
  routeCategory?: RouteCategory;
}

export interface PlannerFollowUpAction {
  action: PlannerFollowUpActionType;
  title: string;
  description: string;
  tool?: 'memory_save' | 'memory_index_scan' | 'refreshGraphMetadata' | 'reindexSpecDocs' | 'runEnrichmentBackfill';
  args?: Record<string, unknown>;
}

export interface PlannerResponsePayload {
  plannerMode: Extract<SavePlannerMode, 'plan-only'>;
  routeTarget: PlannerRouteTarget;
  proposedEdits: PlannerProposedEdit[];
  blockers: PlannerBlocker[];
  advisories: PlannerAdvisory[];
  followUpActions: PlannerFollowUpAction[];
}

export interface SimilarMemory {
  id: number;
  similarity: number;
  content: string;
  stability: number;
  difficulty: number;
  file_path: string;
  [key: string]: unknown;
}

export interface PeDecision {
  action: string;
  similarity: number;
  existingMemoryId?: number | null;
  reason?: string;
  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
}

export type AssistiveClassification = 'supersede' | 'complement' | 'keep_separate';

export interface AssistiveRecommendation {
  action: 'review';
  similarity: number;
  candidateMemoryIds: number[];
  description: string;
  olderMemoryId: number;
  newerMemoryId: number | null;
  classification: AssistiveClassification;
  recommendedAt: number;
  advisory_stale?: boolean;
}

/**
 * T-RCB-09 (R11-004, R12-003): structured warning surfaced when the scope
 * filter or overfetch window dropped otherwise-relevant vector-search
 * candidates.  Emitted alongside plain string warnings so downstream
 * consumers can mechanically distinguish silent starvation from regular
 * scope mismatches.
 */
export interface ScopeFilterSuppressedCandidatesWarning {
  code: 'scope_filter_suppressed_candidates';
  candidates: number[];
  message?: string;
}

export type ReconStructuredWarning = ScopeFilterSuppressedCandidatesWarning;

export type ReconWarningList = string[] & {
  assistiveRecommendation?: AssistiveRecommendation | null;
  structuredWarnings?: ReconStructuredWarning[];
};

export type OperationStatus = 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial';

export interface OperationResult<TState> {
  status: OperationStatus;
  warnings?: string[];
  persistedState?: TState;
}

export type ReconsolidationOutcomeKind = 'merge' | 'conflict' | 'complement' | 'create' | 'review';

export type ReconsolidationFailureReason =
  | 'assistive_failed'
  | 'candidate_changed'
  | 'checkpoint_failed'
  | 'checkpoint_missing'
  | 'conflict_failed'
  | 'conflict_stale_predecessor'
  | 'scope_retagged'
  | 'similarity_failed';

export interface ReconsolidationOperationState {
  kind: ReconsolidationOutcomeKind;
  id?: number;
  existingMemoryId?: number;
  candidateMemoryIds?: number[];
  advisory_stale?: boolean;
}

export interface ReconsolidationOperationResult extends OperationResult<ReconsolidationOperationState> {
  reason?: ReconsolidationFailureReason;
}

export interface PostInsertOperationResult extends OperationResult<EnrichmentStatus> {
  reason?: PostInsertExecutionStatus['reason'];
  followUpAction?: PostInsertExecutionStatus['followUpAction'];
}

export interface IndexResult extends Record<string, unknown> {
  status: string;
  id: number;
  specFolder: string;
  title: string | null;
  triggerPhrases?: string[];
  contextType?: string;
  importanceTier?: string;
  memoryType?: string;
  memoryTypeSource?: string;
  embeddingStatus?: string;
  embeddingFailureReason?: string;
  warnings?: string[];
  pe_action?: string;
  pe_reason?: string;
  superseded_id?: number;
  related_ids?: number[];
  previous_stability?: number;
  newStability?: number;
  retrievability?: number;
  causalLinks?: Record<string, unknown>;
  postInsertEnrichment?: PostInsertOperationResult;
  saveTimeReconsolidation?: ReconsolidationOperationResult;
  message?: string;
  success?: boolean;
  error?: string;
  qualityScore?: number;
  qualityFlags?: string[];
  rejectionReason?: string;
  rejectionCode?: string;
  sufficiency?: MemorySufficiencyResult;
  assistiveRecommendation?: AssistiveRecommendation;
  routeCategory?: RouteCategory;
  mergeMode?: MergeModeHint;
  targetDocPath?: string;
  targetAnchorId?: string;
  qualityGate?: {
    pass: boolean;
    reasons: string[];
    layers: unknown;
  };
}

export interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

export type RouteCategory =
  | 'narrative_progress'
  | 'narrative_delivery'
  | 'decision'
  | 'handover_state'
  | 'research_finding'
  | 'task_update'
  | 'metadata_only'
  | 'drop';

export type MergeModeHint =
  | 'append-as-paragraph'
  | 'insert-new-adr'
  | 'append-table-row'
  | 'update-in-place'
  | 'append-section';

export interface AtomicIndexParams {
  file_path: string;
  content: string;
  plannerMode?: SavePlannerMode;
  routeAs?: RouteCategory;
  mergeModeHint?: MergeModeHint;
  targetAnchorId?: string;
}

export interface AtomicIndexOptions {
  force?: boolean;
}

export interface AtomicIndexResult {
  success: boolean;
  filePath: string;
  error?: string;
  errorMetadata?: Record<string, string>;
  dbCommitted?: boolean;
  status?: string;
  id?: number;
  specFolder?: string;
  title?: string | null;
  summary?: string;
  message?: string;
  embeddingStatus?: string;
  postMutationHooks?: ReturnType<typeof buildMutationHookFeedback>['data'];
  hints?: string[];
  routeCategory?: RouteCategory;
  mergeMode?: MergeModeHint;
  targetDocPath?: string;
  targetAnchorId?: string;
  plannerMode?: SavePlannerMode;
  routeTarget?: PlannerRouteTarget;
  proposedEdits?: PlannerProposedEdit[];
  blockers?: PlannerBlocker[];
  advisories?: PlannerAdvisory[];
  followUpActions?: PlannerFollowUpAction[];
}

// Backward-compatible aliases retained while the writer path migrates.
export type AtomicSaveParams = AtomicIndexParams;
export type AtomicSaveOptions = AtomicIndexOptions;
export type AtomicSaveResult = AtomicIndexResult;

export interface SaveArgs {
  filePath: string;
  force?: boolean;
  dryRun?: boolean;
  plannerMode?: SavePlannerMode;
  skipPreflight?: boolean;
  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
  routeAs?: RouteCategory;
  mergeModeHint?: MergeModeHint;
  targetAnchorId?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: 'keep' | 'ephemeral';
  deleteAfter?: string;
}

export interface PostInsertMetadataFields {
  content_hash?: string;
  context_type?: string;
  importance_tier?: string;
  memory_type?: string;
  type_inference_source?: string;
  stability?: number;
  difficulty?: number;
  review_count?: number;
  file_mtime_ms?: number | null;
  embedding_status?: string;
  encoding_intent?: string | null;
  document_type?: string;
  spec_level?: number | null;
  quality_score?: number;
  quality_flags?: string; // pre-stringified JSON
  parent_id?: number;
  chunk_index?: number;
  chunk_label?: string;
  tenant_id?: string;
  user_id?: string;
  agent_id?: string;
  provenance_source?: string;
  provenance_actor?: string;
  governed_at?: string;
  retention_policy?: string;
  delete_after?: string | null;
  governance_metadata?: string;
}

export interface PlannerResponseEnvelope extends PlannerResponsePayload {
  filePath: string;
  specFolder: string;
  title: string;
  status: 'planned' | 'blocked';
  message: string;
}

export type { ParsedMemory };

export interface MemoryScopeMatch {
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
  sessionId?: string | null;
}

export function normalizeScopeMatchValue(value?: string | null): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}
