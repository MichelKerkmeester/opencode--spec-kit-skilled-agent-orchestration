import type Database from 'better-sqlite3';
import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
import type { PeDecision, IndexResult } from './types.js';
export interface PeOrchestrationResult {
    decision: PeDecision;
    earlyReturn: IndexResult | null;
    supersededId: number | null;
}
export declare function evaluateAndApplyPeDecision(database: Database.Database, parsed: ParsedMemory, embedding: Float32Array | null, force: boolean, validationWarnings: string[] | undefined, embeddingStatus: string, filePath: string, scope?: {
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    sessionId?: string | null;
    sharedSpaceId?: string | null;
}): PeOrchestrationResult;
//# sourceMappingURL=pe-orchestration.d.ts.map