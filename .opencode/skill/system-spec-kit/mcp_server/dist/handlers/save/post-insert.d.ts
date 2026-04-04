import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
interface CausalLinksResult {
    processed: number;
    inserted: number;
    resolved: number;
    unresolved: {
        type: string;
        reference: string;
    }[];
    errors: {
        type: string;
        reference: string;
        error: string;
    }[];
}
export interface EnrichmentStatus {
    causalLinks: boolean;
    entityExtraction: boolean;
    summaries: boolean;
    entityLinking: boolean;
    graphLifecycle: boolean;
}
export interface PostInsertEnrichmentResult {
    causalLinksResult: CausalLinksResult | null;
    enrichmentStatus: EnrichmentStatus;
}
/**
 * Run post-insert enrichment pipeline for a newly saved memory.
 *
 * Sequentially executes: causal links processing, entity extraction (R10),
 * summary generation (R8), and cross-document entity linking (S5).
 * Each step is independently guarded by its feature flag and wrapped
 * in try-catch so a single failure does not block the others.
 *
 * @param database - The SQLite database instance.
 * @param id - The memory row ID to enrich.
 * @param parsed - Parsed memory file data from the memory parser.
 * @returns PostInsertEnrichmentResult with causal links outcome.
 */
export declare function runPostInsertEnrichment(database: BetterSqlite3.Database, id: number, parsed: ReturnType<typeof memoryParser.parseMemoryFile>): Promise<PostInsertEnrichmentResult>;
export {};
//# sourceMappingURL=post-insert.d.ts.map