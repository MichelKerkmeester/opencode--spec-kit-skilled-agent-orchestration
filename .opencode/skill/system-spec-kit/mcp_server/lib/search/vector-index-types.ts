// ---------------------------------------------------------------
// MODULE: Vector Index Types
// ---------------------------------------------------------------

// SCHEMA_VERSION is now canonical in vector-index-schema.ts
export const MAX_TRIGGERS_PER_MEMORY = 10;

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

export interface IndexMemoryParams {
  specFolder: string;
  filePath: string;
  anchorId?: string | null;
  title?: string | null;
  triggerPhrases?: string[];
  importanceWeight?: number;
  embedding: Float32Array | number[];
  encodingIntent?: string;
  documentType?: string;
  specLevel?: number | null;
  contentText?: string | null;
  qualityScore?: number;
  qualityFlags?: string[];
}

export interface UpdateMemoryParams {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  embedding?: Float32Array | number[];
  encodingIntent?: string;
  documentType?: string;
  specLevel?: number | null;
  contentText?: string | null;
  qualityScore?: number;
  qualityFlags?: string[];
}

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
  searchMethod?: string;
  isConstitutional: boolean;
  [key: string]: unknown;
}

export function to_embedding_buffer(embedding: Float32Array | number[]): Buffer {
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  return Buffer.from(new Float32Array(embedding).buffer);
}

export function parse_trigger_phrases(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_: unknown) {
    return [];
  }
}

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
// validateEmbeddingDimension are exported from vector-index-store.ts (canonical)
