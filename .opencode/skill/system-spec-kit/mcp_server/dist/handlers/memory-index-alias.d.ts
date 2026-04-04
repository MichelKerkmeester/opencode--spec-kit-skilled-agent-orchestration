import { requireDb } from '../utils/index.js';
import * as mutationLedger from '../lib/storage/mutation-ledger.js';
interface AliasConflictRow {
    file_path: string;
    content_hash: string | null;
}
interface AliasConflictSample {
    normalizedPath: string;
    hashState: 'identical' | 'divergent' | 'unknown';
    variants: string[];
}
export interface AliasConflictSummary {
    groups: number;
    rows: number;
    identicalHashGroups: number;
    divergentHashGroups: number;
    unknownHashGroups: number;
    samples: AliasConflictSample[];
}
export interface DivergenceReconcileSummary {
    enabled: boolean;
    candidates: number;
    retriesScheduled: number;
    escalated: number;
    maxRetries: number;
    escalations: mutationLedger.DivergenceEscalationPayload[];
    errors: string[];
}
interface DivergenceReconcileHookOptions {
    maxRetries?: number;
    actor?: string;
    requireDatabase?: typeof requireDb;
    reconcileHook?: typeof mutationLedger.recordDivergenceReconcileHook;
}
export declare const EMPTY_ALIAS_CONFLICT_SUMMARY: AliasConflictSummary;
export declare function createDefaultDivergenceReconcileSummary(maxRetries?: number): DivergenceReconcileSummary;
export declare function summarizeAliasConflicts(rows: AliasConflictRow[]): AliasConflictSummary;
export declare function detectAliasConflictsFromIndex(): AliasConflictSummary;
export declare function runDivergenceReconcileHooks(aliasConflicts: AliasConflictSummary, options?: DivergenceReconcileHookOptions): DivergenceReconcileSummary;
export {};
//# sourceMappingURL=memory-index-alias.d.ts.map