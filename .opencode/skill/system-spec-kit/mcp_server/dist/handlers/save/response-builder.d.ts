import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
import type { MCPResponse } from '../types.js';
import type { IndexResult, PeDecision, ReconWarningList } from './types.js';
import type { EnrichmentStatus } from './post-insert.js';
interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
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
interface BuildIndexResultParams {
    database: BetterSqlite3.Database;
    existing: {
        id: number;
        content_hash: string;
    } | undefined;
    embeddingStatus: string;
    id: number;
    parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
    validation: ValidationResult;
    reconWarnings: ReconWarningList;
    peDecision: PeDecision;
    embeddingFailureReason: string | null;
    asyncEmbedding: boolean;
    causalLinksResult: CausalLinksResult | null;
    enrichmentStatus?: EnrichmentStatus;
    filePath: string;
}
interface BuildSaveResponseParams {
    result: IndexResult;
    filePath: string;
    asyncEmbedding: boolean;
    requestId: string;
}
export declare function buildIndexResult({ database, existing, embeddingStatus, id, parsed, validation, reconWarnings, peDecision, embeddingFailureReason, asyncEmbedding, causalLinksResult, enrichmentStatus, filePath, }: BuildIndexResultParams): IndexResult;
export declare function buildSaveResponse({ result, filePath, asyncEmbedding, requestId }: BuildSaveResponseParams): MCPResponse;
export {};
//# sourceMappingURL=response-builder.d.ts.map