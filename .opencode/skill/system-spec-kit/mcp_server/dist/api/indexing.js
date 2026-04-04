// ────────────────────────────────────────────────────────────────
// MODULE: Indexing
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not core/ or handlers/ internals.
// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
// By reindex orchestration without widening the general public surface.
import { init as initDbState, setEmbeddingModelReady } from '../core/index.js';
import { handleMemoryIndexScan } from '../handlers/index.js';
import { generateEmbedding, getEmbeddingProfile } from './providers.js';
import { initHybridSearch, vectorIndex } from './search.js';
import { initAccessTracker, initCheckpoints } from './storage.js';
/** Initializes indexing runtime dependencies. */
export function initializeIndexingRuntime() {
    vectorIndex.initializeDb();
    initDbState({
        vectorIndex,
        checkpoints: { init: initCheckpoints },
        accessTracker: { init: initAccessTracker },
        hybridSearch: { init: initHybridSearch },
    });
    const database = vectorIndex.getDb();
    if (!database) {
        throw new Error('Database not initialized after initializeDb(). Cannot proceed.');
    }
    initCheckpoints(database);
    initAccessTracker(database);
    initHybridSearch(database, vectorIndex.vectorSearch);
}
/** Warms the embedding model and marks it as ready. */
export async function warmEmbeddingModel(input = 'warmup test') {
    await generateEmbedding(input);
    setEmbeddingModelReady(true);
    return getEmbeddingProfile();
}
/** Runs a memory index scan with the provided arguments. */
export async function runMemoryIndexScan(args) {
    return handleMemoryIndexScan(args);
}
/** Closes indexing runtime database connections. */
export function closeIndexingRuntime() {
    vectorIndex.closeDb();
}
//# sourceMappingURL=indexing.js.map