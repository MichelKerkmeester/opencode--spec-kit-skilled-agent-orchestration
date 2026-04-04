import type BetterSqlite3 from 'better-sqlite3';
import type { CausalLinks } from '../lib/parsing/memory-parser.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
interface CausalLinkMapping {
    relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
    reverse: boolean;
}
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
declare const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping>;
/** Resolve a memory reference (ID, path, or title) to a numeric memory ID */
declare function resolveMemoryReference(database: BetterSqlite3.Database, reference: string): number | null;
/** Resolve many memory references in batch (exact first, fuzzy fallback). */
declare function resolveMemoryReferencesBatch(database: BetterSqlite3.Database, references: readonly string[]): Map<string, number | null>;
/** Process causal link declarations from a memory file and insert edges into the graph */
declare function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult;
export { processCausalLinks, resolveMemoryReference, resolveMemoryReferencesBatch, CAUSAL_LINK_MAPPINGS, };
export { detectSpecLevelFromParsed } from './handler-utils.js';
export type { CausalLinkMapping, CausalLinksResult, };
//# sourceMappingURL=causal-links-processor.d.ts.map