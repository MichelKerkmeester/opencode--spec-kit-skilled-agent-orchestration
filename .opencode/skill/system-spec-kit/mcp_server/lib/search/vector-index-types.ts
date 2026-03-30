// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Types
// ───────────────────────────────────────────────────────────────
// SCHEMA_VERSION is now canonical in vector-index-schema.ts
/** Maximum trigger phrases stored for each memory. */
export const MAX_TRIGGERS_PER_MEMORY = 10;

/** Supported embedding input shapes for vector search and mutation operations. */
export type EmbeddingInput = Float32Array | number[];

/** Stable error codes emitted by vector-index modules. */
export const VectorIndexErrorCode = {
  EMBEDDING_VALIDATION: 'EMBEDDING_VALIDATION',
  QUERY_FAILED: 'QUERY_FAILED',
  INTEGRITY_ERROR: 'INTEGRITY_ERROR',
  MUTATION_FAILED: 'MUTATION_FAILED',
  STORE_ERROR: 'STORE_ERROR',
} as const;

/** Enumerates the string codes used by {@link VectorIndexError}. */
export type VectorIndexErrorCode = typeof VectorIndexErrorCode[keyof typeof VectorIndexErrorCode];

/** Structured error used by vector-index query, mutation, and store helpers. */
export class VectorIndexError extends Error {
  code: VectorIndexErrorCode;

  constructor(message: string, code: VectorIndexErrorCode) {
    super(message);
    this.name = 'VectorIndexError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Represents a row from the memory index table. */
export interface MemoryIndexRow {
  id: number;
  spec_folder?: string;
  file_path?: string;
  anchor_id?: string | null;
  title?: string | null;
  trigger_phrases?: string | string[] | null;
  triggerPhrases?: string | string[];
  importance_weight?: number;
  created_at?: string;
  updated_at?: string;
  embedding_model?: string | null;
  embedding_generated_at?: string | null;
  embedding_status?: string;
  retry_count?: number;
  last_retry_at?: string | null;
  failure_reason?: string | null;
  importance_tier?: string;
  access_count?: number;
  last_accessed?: number;
  confidence?: number;
  validation_count?: number;
  is_pinned?: number;
  stability?: number;
  difficulty?: number;
  last_review?: string | null;
  review_count?: number;
  content_hash?: string | null;
  related_memories?: string | null;
  document_type?: string;
  spec_level?: number | null;
  quality_score?: number;
  quality_flags?: string | string[] | null;
  isConstitutional?: boolean;
  similarity?: number;
  keywordScore?: number;
  [key: string]: unknown;
}

/** Represents a vector-search memory row shared by query and store helpers. */
export interface MemoryRow {
  id: number;
  spec_folder: string;
  file_path: string;
  title?: string | null;
  trigger_phrases?: string | string[] | null;
  importance_tier?: string;
  importance_weight?: number;
  created_at?: string;
  access_count?: number;
  last_accessed?: number;
  confidence?: number;
  keyword_score?: number;
  similarity?: number;
  avg_similarity?: number;
  concept_similarities?: number[];
  smartScore?: number;
  relationSimilarity?: number;
  isConstitutional?: boolean;
  [key: string]: unknown;
}

/** Describes the inputs required to index a memory. */
export interface IndexMemoryParams {
  specFolder: string;
  filePath: string;
  parentId?: number | null;
  anchorId?: string | null;
  title?: string | null;
  triggerPhrases?: string[];
  importanceWeight?: number;
  embedding: EmbeddingInput;
  encodingIntent?: string;
  documentType?: string;
  specLevel?: number | null;
  contentText?: string | null;
  qualityScore?: number;
  qualityFlags?: string[];
}

/** Describes the fields that can be updated for a memory. */
export interface UpdateMemoryParams {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  embedding?: EmbeddingInput;
  encodingIntent?: string;
  documentType?: string;
  specLevel?: number | null;
  contentText?: string | null;
  qualityScore?: number;
  qualityFlags?: string[];
}

/** Controls vector search filtering and ranking behavior. */
export interface VectorSearchOptions {
  limit?: number;
  specFolder?: string | null;
  minSimilarity?: number;
  useDecay?: boolean;
  tier?: string | null;
  contextType?: string | null;
  includeConstitutional?: boolean;
  includeArchived?: boolean;
}

/** Represents an enriched search result returned to callers. */
export interface EnrichedSearchResult {
  rank: number;
  similarity?: number;
  avgSimilarity?: number;
  conceptSimilarities?: number[];
  title: string;
  specFolder: string;
  filePath: string;
  date: string | null;
  tags: string[];
  snippet: string;
  id: number;
  importanceWeight: number;
  created_at?: string;
  access_count?: number;
  smartScore?: number;
  spec_folder?: string;
  searchMethod?: string;
  isConstitutional: boolean;
  [key: string]: unknown;
}

/**
 * Converts an embedding vector into a binary buffer for sqlite-vec storage.
 * @param embedding - The embedding values to serialize.
 * @returns A binary buffer representing the embedding.
 */
export function to_embedding_buffer(embedding: EmbeddingInput): Buffer {
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  return Buffer.from(new Float32Array(embedding).buffer);
}

/**
 * Parses trigger phrase storage into a normalized string array.
 * @param value - The stored trigger phrase payload.
 * @returns Parsed trigger phrases, or an empty array on invalid input.
 */
export function parse_trigger_phrases(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_: unknown) {
    return [];
  }
}

/**
 * Extracts a human-readable message from an unknown error payload.
 * @param error - The caught error value.
 * @returns A descriptive error message.
 */
export function get_error_message(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return String(error);
}

/**
 * Extracts a string error code from an unknown error payload.
 * @param error - The caught error value.
 * @returns The error code when present.
 */
export function get_error_code(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') {
      return code;
    }
  }

  return undefined;
}

// EMBEDDING_DIM, DEFAULT_DB_PATH, getEmbeddingDim, getConfirmedEmbeddingDimension,
// ValidateEmbeddingDimension are exported from vector-index-store.ts (canonical)
