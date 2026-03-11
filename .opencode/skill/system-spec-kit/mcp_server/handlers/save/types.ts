// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------

import { buildMutationHookFeedback } from '../../hooks/mutation-feedback';
import type { ParsedMemory } from '../../lib/parsing/memory-parser';

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
  asyncEmbedding?: boolean; // AI-TRACE:T306: When true, embedding generation is deferred (non-blocking)
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
}

export type { ParsedMemory };
