import type Database from 'better-sqlite3';
import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
export interface EmbeddingResult {
    embedding: Float32Array | null;
    status: 'success' | 'pending';
    failureReason: string | null;
    pendingCacheWrite?: {
        cacheKey: string;
        modelId: string;
        embeddingBuffer: Buffer;
        dimensions: number;
    };
}
export declare function generateOrCacheEmbedding(database: Database.Database, parsed: ParsedMemory, filePath: string, asyncEmbedding: boolean): Promise<EmbeddingResult>;
export declare function persistPendingEmbeddingCacheWrite(database: Database.Database, pendingCacheWrite: EmbeddingResult['pendingCacheWrite'], filePath: string): void;
//# sourceMappingURL=embedding-pipeline.d.ts.map