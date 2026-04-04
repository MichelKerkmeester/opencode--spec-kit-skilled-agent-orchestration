import type Database from 'better-sqlite3';
type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
interface MutationLedgerEntry {
    id: number;
    timestamp: string;
    mutation_type: MutationType;
    reason: string;
    prior_hash: string | null;
    new_hash: string;
    linked_memory_ids: string;
    decision_meta: string;
    actor: string;
    session_id: string | null;
}
interface AppendEntryInput {
    mutation_type: MutationType;
    reason: string;
    prior_hash: string | null;
    new_hash: string;
    linked_memory_ids: number[];
    decision_meta: Record<string, unknown>;
    actor: string;
    session_id?: string | null;
}
interface GetEntriesOptions {
    mutation_type?: MutationType;
    actor?: string;
    session_id?: string;
    since?: string;
    until?: string;
    limit?: number;
    offset?: number;
}
interface DivergenceReconcilePolicy {
    normalizedPath: string;
    attemptsSoFar: number;
    nextAttempt: number;
    maxRetries: number;
    shouldRetry: boolean;
    exhausted: boolean;
}
interface DivergenceEscalationPayload {
    code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED';
    normalizedPath: string;
    attempts: number;
    maxRetries: number;
    recommendation: 'manual_triage_required';
    reason: string;
    variants: string[];
}
interface RecordDivergenceReconcileInput {
    normalizedPath: string;
    variants?: string[];
    actor?: string;
    session_id?: string | null;
    maxRetries?: number;
}
interface RecordDivergenceReconcileResult {
    policy: DivergenceReconcilePolicy;
    retryEntryId: number | null;
    escalationEntryId: number | null;
    escalation: DivergenceEscalationPayload | null;
}
declare const LEDGER_SCHEMA_SQL = "\n  CREATE TABLE IF NOT EXISTS mutation_ledger (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),\n    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),\n    reason TEXT NOT NULL,\n    prior_hash TEXT,\n    new_hash TEXT NOT NULL,\n    linked_memory_ids TEXT NOT NULL DEFAULT '[]',\n    decision_meta TEXT NOT NULL DEFAULT '{}',\n    actor TEXT NOT NULL,\n    session_id TEXT\n  )\n";
declare const LEDGER_INDEX_SQL = "\n  CREATE INDEX IF NOT EXISTS idx_ledger_type ON mutation_ledger(mutation_type);\n  CREATE INDEX IF NOT EXISTS idx_ledger_actor ON mutation_ledger(actor);\n  CREATE INDEX IF NOT EXISTS idx_ledger_timestamp ON mutation_ledger(timestamp);\n  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id);\n  CREATE INDEX IF NOT EXISTS idx_ledger_memory_type_created_at ON mutation_ledger(\n    CAST(json_extract(linked_memory_ids, '$[0]') AS INTEGER),\n    mutation_type,\n    timestamp\n  )\n";
declare const LEDGER_TRIGGER_SQL = "\n  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger\n  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;\n  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger\n  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END\n";
declare function initLedger(db: Database.Database): void;
declare function computeHash(content: string): string;
declare function appendEntry(db: Database.Database, entry: AppendEntryInput): MutationLedgerEntry;
declare function getEntries(db: Database.Database, opts?: GetEntriesOptions): MutationLedgerEntry[];
declare function getEntryCount(db: Database.Database): number;
declare function getLinkedEntries(db: Database.Database, memoryId: number): MutationLedgerEntry[];
/**
 * Verify that append-only triggers exist on the mutation_ledger table.
 * Returns true if both UPDATE and DELETE triggers are present.
 */
declare function verifyAppendOnly(db: Database.Database): boolean;
declare const DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES = 3;
declare const DIVERGENCE_RECONCILE_REASON = "alias_divergence_auto_reconcile";
declare const DIVERGENCE_RECONCILE_ESCALATION_REASON = "alias_divergence_auto_reconcile_escalated";
declare function getDivergenceReconcileAttemptCount(db: Database.Database, normalizedPath: string): number;
declare function buildDivergenceReconcilePolicy(normalizedPath: string, attemptsSoFar: number, maxRetries?: number): DivergenceReconcilePolicy;
declare function buildDivergenceEscalationPayload(policy: DivergenceReconcilePolicy, variants: string[]): DivergenceEscalationPayload;
declare function recordDivergenceReconcileHook(db: Database.Database, input: RecordDivergenceReconcileInput): RecordDivergenceReconcileResult;
export { LEDGER_SCHEMA_SQL, LEDGER_INDEX_SQL, LEDGER_TRIGGER_SQL, initLedger, computeHash, appendEntry, getEntries, getEntryCount, getLinkedEntries, verifyAppendOnly, DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES, DIVERGENCE_RECONCILE_REASON, DIVERGENCE_RECONCILE_ESCALATION_REASON, getDivergenceReconcileAttemptCount, buildDivergenceReconcilePolicy, buildDivergenceEscalationPayload, recordDivergenceReconcileHook, };
/**
 * Re-exports related public types.
 */
export type { MutationType, MutationLedgerEntry, AppendEntryInput, GetEntriesOptions, DivergenceReconcilePolicy, DivergenceEscalationPayload, RecordDivergenceReconcileInput, RecordDivergenceReconcileResult, };
//# sourceMappingURL=mutation-ledger.d.ts.map