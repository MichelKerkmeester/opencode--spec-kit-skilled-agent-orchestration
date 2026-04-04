import type { IndexMemoryParams as SharedIndexMemoryParams, UpdateMemoryParams as SharedUpdateMemoryParams } from './vector-index-types.js';
import type Database from 'better-sqlite3';
type IndexMemoryParams = Readonly<SharedIndexMemoryParams> & {
    readonly appendOnly?: boolean;
};
type IndexMemoryDeferredParams = Omit<IndexMemoryParams, 'embedding'> & {
    readonly failureReason?: string | null;
};
type UpdateMemoryParams = Readonly<SharedUpdateMemoryParams> & {
    readonly canonicalFilePath?: string;
};
/**
 * Indexes a memory with an embedding payload.
 * @param params - The memory values to index.
 * @returns The indexed memory identifier.
 * @throws {VectorIndexError} When embedding validation fails or the mutation cannot be applied.
 * @example
 * ```ts
 * const id = index_memory({
 *   specFolder: 'specs/001-demo',
 *   filePath: 'spec.md',
 *   embedding,
 * });
 * ```
 */
export declare function index_memory(params: IndexMemoryParams, database?: Database.Database): number;
/**
 * Indexes a memory record without storing an embedding yet.
 * @param params - The deferred memory values to index.
 * @returns The indexed memory identifier.
 */
export declare function index_memory_deferred(params: IndexMemoryDeferredParams, database?: Database.Database): number;
/**
 * Updates stored memory metadata and embeddings.
 * @param params - The memory values to update.
 * @returns The updated memory identifier.
 * @throws {VectorIndexError} When embedding validation fails or the mutation transaction cannot complete.
 * @example
 * ```ts
 * const id = update_memory({ id: 42, title: 'Updated title', embedding });
 * ```
 */
export declare function update_memory(params: UpdateMemoryParams, database?: Database.Database): number;
/**
 * Deletes a memory and its related index records.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
 * @throws {VectorIndexError} Propagates mutation or store initialization failures from the delete pipeline.
 * @example
 * ```ts
 * const deleted = delete_memory(42);
 * ```
 */
export declare function delete_memory(id: number, database?: Database.Database): boolean;
/**
 * Deletes a memory and related index records using the provided database handle.
 * @param database - The database containing the target memory.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
 * @throws {VectorIndexError} Propagates mutation failures encountered while deleting the memory.
 * @example
 * ```ts
 * const deleted = delete_memory_from_database(database, 42);
 * ```
 */
export declare function delete_memory_from_database(database: Database.Database, id: number): boolean;
/**
 * Deletes the latest memory for a file path and optional anchor.
 * @param spec_folder - The owning spec folder.
 * @param file_path - The file path to delete.
 * @param anchor_id - The optional anchor identifier.
 * @returns True when a memory was deleted.
 * @throws {VectorIndexError} Propagates delete failures from the underlying mutation helpers.
 * @example
 * ```ts
 * const deleted = delete_memory_by_path('specs/001-demo', 'spec.md');
 * ```
 */
export declare function delete_memory_by_path(spec_folder: string, file_path: string, anchor_id?: string | null, database?: Database.Database): boolean;
/**
 * Deletes multiple memories in a single transaction.
 * @param memory_ids - The memory identifiers to delete.
 * @returns Counts for deleted and failed items.
 * @throws {VectorIndexError} When one or more deletes fail and the transaction is rolled back.
 * @example
 * ```ts
 * const outcome = delete_memories([1, 2, 3]);
 * ```
 */
export declare function delete_memories(memory_ids: number[], database?: Database.Database): {
    deleted: number;
    failed: number;
};
/**
 * Updates the embedding status for a memory.
 * @param id - The memory identifier.
 * @param status - The new embedding status.
 * @returns True when the status was updated.
 */
export declare function update_embedding_status(id: number, status: string, database?: Database.Database): boolean;
/**
 * Updates the confidence value for a memory.
 * @param memory_id - The memory identifier.
 * @param confidence - The confidence value to store.
 * @returns True when the confidence was updated.
 */
export declare function update_confidence(memory_id: number, confidence: number, database?: Database.Database): boolean;
export { index_memory as indexMemory };
export { index_memory_deferred as indexMemoryDeferred };
export { update_memory as updateMemory };
export { delete_memory as deleteMemory };
export { delete_memory_by_path as deleteMemoryByPath };
export { delete_memories as deleteMemories };
export { update_embedding_status as updateEmbeddingStatus };
export { update_confidence as updateConfidence };
//# sourceMappingURL=vector-index-mutations.d.ts.map