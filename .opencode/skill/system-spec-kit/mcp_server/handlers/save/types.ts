// ───────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────
import { buildMutationHookFeedback } from '../../hooks/mutation-feedback.js';
import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Dry-run preflight for memory_save


export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
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
}

export type ReconWarningList = string[] & {
  assistiveRecommendation?: AssistiveRecommendation | null;
};

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
  message?: string;
  success?: boolean;
  error?: string;
  qualityScore?: number;
  qualityFlags?: string[];
  rejectionReason?: string;
  rejectionCode?: string;
  sufficiency?: MemorySufficiencyResult;
  assistiveRecommendation?: AssistiveRecommendation;
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

export interface AtomicSaveParams {
  file_path: string;
  content: string;
}

export interface AtomicSaveOptions {
  force?: boolean;
}

export interface AtomicSaveResult {
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
}

export interface SaveArgs {
  filePath: string;
  force?: boolean;
  dryRun?: boolean;
  skipPreflight?: boolean;
  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  sharedSpaceId?: string;
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
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
  shared_space_id?: string;
  provenance_source?: string;
  provenance_actor?: string;
  governed_at?: string;
  retention_policy?: string;
  delete_after?: string | null;
  governance_metadata?: string;
}

export type { ParsedMemory };

export interface MemoryScopeMatch {
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
  sessionId?: string | null;
  sharedSpaceId?: string | null;
}

export function normalizeScopeMatchValue(value?: string | null): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}
