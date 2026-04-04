import Database from 'better-sqlite3';
import { IVectorStore } from '../interfaces/vector-store.js';
import type { EmbeddingInput, EnrichedSearchResult, MemoryRow, VectorSearchOptions } from './vector-index-types.js';
type SearchWeightsConfig = {
    maxTriggersPerMemory?: number;
    smartRanking?: {
        recencyWeight?: number;
        accessWeight?: number;
        relevanceWeight?: number;
    };
};
/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
export declare const search_weights: SearchWeightsConfig;
type EnhancedSearchOptions = {
    specFolder?: string | null;
    minSimilarity?: number;
    diversityFactor?: number;
    noDiversity?: boolean;
};
type JsonObject = Record<string, unknown>;
/** Default embedding dimension used by the vector index. */
export declare const EMBEDDING_DIM = 768;
/**
 * Gets the active embedding dimension for the current provider.
 * @returns The embedding dimension.
 */
export declare function get_embedding_dim(): number;
/**
 * Waits for the embedding provider to report a stable dimension.
 * @param timeout_ms - The maximum time to wait in milliseconds.
 * @returns A promise that resolves to the confirmed embedding dimension.
 */
export declare function get_confirmed_embedding_dimension(timeout_ms?: number): Promise<number>;
/**
 * Validates that stored vector dimensions match the provider.
 * @returns The validation result.
 */
export declare function validate_embedding_dimension(): {
    valid: boolean;
    stored: number | null;
    current: number | null;
    reason?: string;
    warning?: string;
};
/** Default path for the vector-index database file. */
export declare const DEFAULT_DB_PATH: string;
/**
 * Validates a file path against allowed local base paths.
 * @param file_path - The file path to validate.
 * @returns The validated file path, if allowed.
 */
export declare function validate_file_path_local(file_path: unknown): string | null;
/**
 * Reads a file asynchronously after validating the path.
 * @param file_path - The file path to read.
 * @returns A promise that resolves to the file contents or an empty string.
 */
export declare function safe_read_file_async(file_path: unknown): Promise<string>;
/**
 * Parses JSON with prototype-pollution safeguards.
 * @param json_string - The JSON string to parse.
 * @param default_value - The fallback value to return on failure.
 * @returns The parsed JSON value or the fallback.
 */
export declare function safe_parse_json(json_string: unknown, default_value?: never[]): unknown;
type DatabaseConnectionListener = (database: Database.Database, change: {
    previousDb: Database.Database | null;
    previousPath: string;
    nextPath: string;
}) => void;
/** Accessor for sqlite_vec_available (used by other modules) */
export declare function sqlite_vec_available(): boolean;
export declare function on_database_connection_change(listener: DatabaseConnectionListener): () => void;
type PreparedStatements = {
    count_all: Database.Statement<[], {
        count: number;
    }>;
    count_by_folder: Database.Statement<[string], {
        count: number;
    }>;
    get_by_id: Database.Statement<[number], MemoryRow | undefined>;
    get_by_path: Database.Statement<[string], MemoryRow | undefined>;
    get_by_folder_and_path: Database.Statement<[string, string, string, string | null, string | null], {
        id: number;
    } | undefined>;
    get_stats: Database.Statement<[], {
        total: number;
        complete: number;
        pending: number;
        failed: number;
    }>;
    list_base: Database.Statement<[number, number], MemoryRow[]>;
};
/**
 * Initializes cached prepared statements for common queries.
 * @param database - The database connection to prepare against.
 * @returns The prepared statements cache.
 */
export declare function init_prepared_statements(database: Database.Database): PreparedStatements;
/**
 * Clears cached prepared statements for a specific database or all databases.
 * @param database - Optional: clear only for this database. If omitted, the
 *   WeakMap self-cleans when the Database object is GC'd, so this is a no-op.
 * @returns Nothing.
 */
export declare function clear_prepared_statements(database?: Database.Database): void;
/**
 * Gets cached constitutional memories from the index.
 * @param database - The database connection to query.
 * @param spec_folder - The optional spec folder filter.
 * @param includeArchived - Whether archived memories should be included.
 * @returns The constitutional memory rows.
 */
export declare function get_constitutional_memories(database: Database.Database, spec_folder?: string | null, includeArchived?: boolean): MemoryRow[];
/**
 * Clears cached constitutional memories.
 * @param spec_folder - The optional spec folder cache key to clear.
 * @returns Nothing.
 */
export declare function clear_constitutional_cache(spec_folder?: string | null): void;
/**
 * Refreshes interference scores for memories in a folder.
 * @param database - The database connection to update.
 * @param specFolder - The spec folder whose scores should be refreshed.
 * @returns Nothing.
 */
export declare function refresh_interference_scores_for_folder(database: Database.Database, specFolder: string): void;
/**
 * Initializes the vector-index database connection.
 * @param custom_path - An optional database path override.
 * @returns The initialized database connection.
 * @throws {VectorIndexError} When database integrity validation fails during initialization.
 * @example
 * ```ts
 * const database = initialize_db();
 * ```
 */
export declare function initialize_db(custom_path?: string | null): Database.Database;
/**
 * Closes the shared vector-index database connection.
 * @returns Nothing.
 */
export declare function close_db(): void;
/**
 * Gets the active vector-index database path.
 * @returns The database path.
 */
export declare function get_db_path(): string;
/**
 * Gets the shared vector-index database connection.
 * @returns The database connection.
 */
export declare function get_db(): Database.Database;
/**
 * Reports whether sqlite-vec vector search is available.
 * @returns True when vector search is available.
 */
export declare function is_vector_search_available(): boolean;
/** Implements the vector-store interface on top of SQLite. */
export declare class SQLiteVectorStore extends IVectorStore {
    dbPath: string | null;
    _initialized: boolean;
    constructor(options?: {
        dbPath?: string;
    });
    _ensureInitialized(): void;
    _getDatabase(): Database.Database;
    /**
     * Searches indexed memories by embedding similarity.
     * @param embedding - The query embedding to search with.
     * @param topK - The maximum number of matches to return.
     * @param options - Optional ranking and filtering controls.
     * @returns Matching memory rows ordered by similarity.
     * @throws {VectorIndexError} When the embedding dimension is invalid or the store cannot initialize.
     * @example
     * ```ts
     * const rows = await store.search(queryEmbedding, 10, { specFolder: 'specs/001-demo' });
     * ```
     */
    search(embedding: EmbeddingInput, topK: number, options?: VectorSearchOptions): Promise<MemoryRow[]>;
    /**
     * Inserts or updates a memory row and its embedding metadata.
     * @param _id - Legacy identifier input retained for interface compatibility.
     * @param embedding - The embedding to persist.
     * @param metadata - Store metadata containing the spec folder and file path.
     * @returns The stored memory identifier.
     * @throws {VectorIndexError} When embedding validation fails or required metadata is missing.
     * @example
     * ```ts
     * const id = await store.upsert('ignored', embedding, { spec_folder: 'specs/001-demo', file_path: 'spec.md' });
     * ```
     */
    upsert(_id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number>;
    /**
     * Deletes a memory by identifier.
     * @param id - The memory identifier.
     * @returns True when a memory was deleted.
     * @throws {VectorIndexError} Propagates underlying delete failures from the mutation layer.
     * @example
     * ```ts
     * const deleted = await store.delete(42);
     * ```
     */
    delete(id: number): Promise<boolean>;
    /**
     * Retrieves a memory by identifier.
     * @param id - The memory identifier.
     * @returns The stored memory row, if found.
     * @throws {VectorIndexError} Propagates underlying store initialization failures.
     * @example
     * ```ts
     * const memory = await store.get(42);
     * ```
     */
    get(id: number): Promise<MemoryRow | null>;
    getStats(): Promise<{
        total: number;
        pending: number;
        success: number;
        failed: number;
        retry: number;
    }>;
    isAvailable(): boolean;
    getEmbeddingDimension(): number;
    close(): Promise<void>;
    deleteByPath(specFolder: string, filePath: string, anchorId?: string | null): Promise<boolean>;
    getByFolder(specFolder: string): Promise<MemoryRow[]>;
    searchEnriched(embedding: string, options?: {
        specFolder?: string | null;
        minSimilarity?: number;
    }): Promise<EnrichedSearchResult[]>;
    enhancedSearch(embedding: string, options?: EnhancedSearchOptions): Promise<EnrichedSearchResult[]>;
    getConstitutionalMemories(options?: {
        specFolder?: string | null;
        maxTokens?: number;
        includeArchived?: boolean;
    }): Promise<MemoryRow[]>;
    verifyIntegrity(options?: {
        autoClean?: boolean;
    }): Promise<{
        totalMemories: number;
        totalVectors: number;
        orphanedVectors: number;
        missingVectors: number;
        orphanedFiles: Array<{
            id: number;
            file_path: string;
            reason: string;
        }>;
        orphanedChunks: number;
        isConsistent: boolean;
        cleaned?: {
            vectors: number;
            chunks: number;
        };
    }>;
}
export { initialize_db as initializeDb };
export { close_db as closeDb };
export { get_db as getDb };
export { get_db_path as getDbPath };
export { get_confirmed_embedding_dimension as getConfirmedEmbeddingDimension };
export { get_embedding_dim as getEmbeddingDim };
export { validate_embedding_dimension as validateEmbeddingDimension };
export { validate_file_path_local as validateFilePath };
export { clear_constitutional_cache as clearConstitutionalCache };
export { is_vector_search_available as isVectorSearchAvailable };
export { on_database_connection_change as onDatabaseConnectionChange };
//# sourceMappingURL=vector-index-store.d.ts.map