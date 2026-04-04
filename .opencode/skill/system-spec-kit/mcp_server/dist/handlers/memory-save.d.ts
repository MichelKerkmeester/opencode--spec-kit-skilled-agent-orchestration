import * as memoryParser from '../lib/parsing/memory-parser.js';
import type { MCPResponse } from './types.js';
import { indexChunkedMemoryFile } from './chunking-orchestrator.js';
import { type MemoryScopeMatch } from './save/create-record.js';
import type { IndexResult, SaveArgs, AtomicSaveParams, AtomicSaveOptions, AtomicSaveResult } from './save/index.js';
/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
declare function indexMemoryFile(filePath: string, { force, parsedOverride, asyncEmbedding, scope, qualityGateMode, }?: {
    force?: boolean | undefined;
    parsedOverride?: memoryParser.ParsedMemory | null | undefined;
    asyncEmbedding?: boolean | undefined;
    scope?: MemoryScopeMatch | undefined;
    qualityGateMode?: "enforce" | "warn-only" | undefined;
}): Promise<IndexResult>;
/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
declare function handleMemorySave(args: SaveArgs): Promise<MCPResponse>;
/**
 * Save memory content to disk with retry + rollback guarded indexing.
 *
 * The file write promotes a pending file while holding the per-spec-folder
 * mutex so concurrent saves cannot overwrite each other between disk
 * promotion and indexing. If indexing later fails, the original file content
 * is restored before the error is returned and before the lock is released.
 */
declare function atomicSaveMemory(params: AtomicSaveParams, options?: AtomicSaveOptions): Promise<AtomicSaveResult>;
/** Return transaction manager metrics for atomicity monitoring */
declare function getAtomicityMetrics(): Record<string, unknown>;
export { indexMemoryFile, indexChunkedMemoryFile, handleMemorySave, atomicSaveMemory, getAtomicityMetrics, };
declare const index_memory_file: typeof indexMemoryFile;
declare const index_chunked_memory_file: typeof indexChunkedMemoryFile;
declare const handle_memory_save: typeof handleMemorySave;
declare const atomic_save_memory: typeof atomicSaveMemory;
declare const get_atomicity_metrics: typeof getAtomicityMetrics;
export { index_memory_file, index_chunked_memory_file, handle_memory_save, atomic_save_memory, get_atomicity_metrics, };
//# sourceMappingURL=memory-save.d.ts.map