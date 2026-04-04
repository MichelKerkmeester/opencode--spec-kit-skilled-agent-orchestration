// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Types
// ───────────────────────────────────────────────────────────────
// SCHEMA_VERSION is now canonical in vector-index-schema.ts
/** Maximum trigger phrases stored for each memory. */
export const MAX_TRIGGERS_PER_MEMORY = 10;
/** Stable error codes emitted by vector-index modules. */
export const VectorIndexErrorCode = {
    EMBEDDING_VALIDATION: 'EMBEDDING_VALIDATION',
    QUERY_FAILED: 'QUERY_FAILED',
    INTEGRITY_ERROR: 'INTEGRITY_ERROR',
    MUTATION_FAILED: 'MUTATION_FAILED',
    STORE_ERROR: 'STORE_ERROR',
};
/** Structured error used by vector-index query, mutation, and store helpers. */
export class VectorIndexError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = 'VectorIndexError';
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
/**
 * Converts an embedding vector into a binary buffer for sqlite-vec storage.
 * @param embedding - The embedding values to serialize.
 * @returns A binary buffer representing the embedding.
 */
export function to_embedding_buffer(embedding) {
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
export function parse_trigger_phrases(value) {
    if (!value)
        return [];
    if (Array.isArray(value))
        return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (_) {
        return [];
    }
}
/**
 * Extracts a human-readable message from an unknown error payload.
 * @param error - The caught error value.
 * @returns A descriptive error message.
 */
export function get_error_message(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = error.message;
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
export function get_error_code(error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = error.code;
        if (typeof code === 'string') {
            return code;
        }
    }
    return undefined;
}
// EMBEDDING_DIM, DEFAULT_DB_PATH, getEmbeddingDim, getConfirmedEmbeddingDimension,
// ValidateEmbeddingDimension are exported from vector-index-store.ts (canonical)
//# sourceMappingURL=vector-index-types.js.map