import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';
/** Arguments for memory index scan requests. */
export interface MemoryIndexScanArgs {
    specFolder?: string | null;
    force?: boolean;
    includeConstitutional?: boolean;
    includeSpecDocs?: boolean;
    incremental?: boolean;
}
/** Initializes indexing runtime dependencies. */
export declare function initializeIndexingRuntime(): void;
/** Warms the embedding model and marks it as ready. */
export declare function warmEmbeddingModel(input?: string): Promise<EmbeddingProfile | null>;
/** Runs a memory index scan with the provided arguments. */
export declare function runMemoryIndexScan(args: MemoryIndexScanArgs): Promise<MCPResponse>;
/** Closes indexing runtime database connections. */
export declare function closeIndexingRuntime(): void;
//# sourceMappingURL=indexing.d.ts.map