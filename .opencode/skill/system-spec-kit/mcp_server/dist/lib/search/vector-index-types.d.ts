/** Maximum trigger phrases stored for each memory. */
export declare const MAX_TRIGGERS_PER_MEMORY = 10;
/** Supported embedding input shapes for vector search and mutation operations. */
export type EmbeddingInput = Float32Array | number[];
/** Stable error codes emitted by vector-index modules. */
export declare const VectorIndexErrorCode: {
    readonly EMBEDDING_VALIDATION: "EMBEDDING_VALIDATION";
    readonly QUERY_FAILED: "QUERY_FAILED";
    readonly INTEGRITY_ERROR: "INTEGRITY_ERROR";
    readonly MUTATION_FAILED: "MUTATION_FAILED";
    readonly STORE_ERROR: "STORE_ERROR";
};
/** Enumerates the string codes used by {@link VectorIndexError}. */
export type VectorIndexErrorCode = typeof VectorIndexErrorCode[keyof typeof VectorIndexErrorCode];
/** Structured error used by vector-index query, mutation, and store helpers. */
export declare class VectorIndexError extends Error {
    code: VectorIndexErrorCode;
    constructor(message: string, code: VectorIndexErrorCode);
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
export declare function to_embedding_buffer(embedding: EmbeddingInput): Buffer;
/**
 * Parses trigger phrase storage into a normalized string array.
 * @param value - The stored trigger phrase payload.
 * @returns Parsed trigger phrases, or an empty array on invalid input.
 */
export declare function parse_trigger_phrases(value: string | string[] | null | undefined): string[];
/**
 * Extracts a human-readable message from an unknown error payload.
 * @param error - The caught error value.
 * @returns A descriptive error message.
 */
export declare function get_error_message(error: unknown): string;
/**
 * Extracts a string error code from an unknown error payload.
 * @param error - The caught error value.
 * @returns The error code when present.
 */
export declare function get_error_code(error: unknown): string | undefined;
//# sourceMappingURL=vector-index-types.d.ts.map