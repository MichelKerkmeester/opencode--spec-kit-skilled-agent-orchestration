import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
import type { PeDecision, MemoryScopeMatch } from './types.js';
export type { MemoryScopeMatch };
interface LineageRoutingDecision {
    predecessorMemoryId: number | null;
    transitionEvent: 'CREATE' | 'UPDATE' | 'SUPERSEDE';
    causalSupersedesMemoryId: number | null;
}
export declare function resolveCreateRecordLineage(peDecision: PeDecision, samePathExistingId: number | null): LineageRoutingDecision;
export declare function findSamePathExistingMemory(database: BetterSqlite3.Database, specFolder: string, canonicalFilePath: string, filePath: string, scope?: MemoryScopeMatch): {
    id: number;
    title: string | null;
    content_hash?: string | null;
} | undefined;
/**
 * Creates a memory row with metadata, optional BM25 entry, and save history.
 * Returns the persisted memory id for downstream save handlers.
 */
export declare function createMemoryRecord(database: BetterSqlite3.Database, parsed: ReturnType<typeof memoryParser.parseMemoryFile>, filePath: string, embedding: Float32Array | null, embeddingFailureReason: string | null, peDecision: PeDecision, scope?: MemoryScopeMatch): number;
//# sourceMappingURL=create-record.d.ts.map