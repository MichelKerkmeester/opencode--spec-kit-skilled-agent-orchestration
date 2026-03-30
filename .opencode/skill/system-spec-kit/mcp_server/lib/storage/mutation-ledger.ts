// ───────────────────────────────────────────────────────────────
// MODULE: Mutation Ledger
// ───────────────────────────────────────────────────────────────
// Feature catalog: Transaction wrappers on mutation handlers
// Append-only audit trail for all memory mutations
// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
import { createHash } from 'crypto';
import type Database from 'better-sqlite3';
import { runInTransaction } from './transaction-manager.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';

interface MutationLedgerEntry {
  id: number;
  timestamp: string;
  mutation_type: MutationType;
  reason: string;
  prior_hash: string | null;
  new_hash: string;
  linked_memory_ids: string; // JSON array
  decision_meta: string;     // JSON object
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
  since?: string;    // ISO timestamp
  until?: string;    // ISO timestamp
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

/* ───────────────────────────────────────────────────────────────
   2. SCHEMA SQL
----------------------------------------------------------------*/

const LEDGER_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS mutation_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),
    reason TEXT NOT NULL,
    prior_hash TEXT,
    new_hash TEXT NOT NULL,
    linked_memory_ids TEXT NOT NULL DEFAULT '[]',
    decision_meta TEXT NOT NULL DEFAULT '{}',
    actor TEXT NOT NULL,
    session_id TEXT
  )
`;

const LEDGER_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_ledger_type ON mutation_ledger(mutation_type);
  CREATE INDEX IF NOT EXISTS idx_ledger_actor ON mutation_ledger(actor);
  CREATE INDEX IF NOT EXISTS idx_ledger_timestamp ON mutation_ledger(timestamp);
  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id);
  CREATE INDEX IF NOT EXISTS idx_ledger_memory_type_created_at ON mutation_ledger(
    CAST(json_extract(linked_memory_ids, '$[0]') AS INTEGER),
    mutation_type,
    timestamp
  )
`;

const LEDGER_TRIGGER_SQL = `
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
`;

/* ───────────────────────────────────────────────────────────────
   3. INITIALIZATION
----------------------------------------------------------------*/

function initLedger(db: Database.Database): void {
  db.exec(LEDGER_SCHEMA_SQL);
  db.exec(LEDGER_INDEX_SQL);
  db.exec(LEDGER_TRIGGER_SQL);
}

/* ───────────────────────────────────────────────────────────────
   4. HASH COMPUTATION
----------------------------------------------------------------*/

function computeHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/* ───────────────────────────────────────────────────────────────
   5. APPEND ENTRY
----------------------------------------------------------------*/

function appendEntry(db: Database.Database, entry: AppendEntryInput): MutationLedgerEntry {
  const linkedJson = JSON.stringify(entry.linked_memory_ids);
  const metaJson = JSON.stringify(entry.decision_meta);

  const stmt = db.prepare(`
    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    entry.mutation_type,
    entry.reason,
    entry.prior_hash,
    entry.new_hash,
    linkedJson,
    metaJson,
    entry.actor,
    entry.session_id ?? null
  );

  const id = (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;

  const row = db.prepare('SELECT * FROM mutation_ledger WHERE id = ?').get(id) as MutationLedgerEntry;
  return row;
}

/* ───────────────────────────────────────────────────────────────
   6. QUERY ENTRIES
----------------------------------------------------------------*/

function getEntries(db: Database.Database, opts: GetEntriesOptions = {}): MutationLedgerEntry[] {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (opts.mutation_type) {
    conditions.push('mutation_type = ?');
    params.push(opts.mutation_type);
  }
  if (opts.actor) {
    conditions.push('actor = ?');
    params.push(opts.actor);
  }
  if (opts.session_id) {
    conditions.push('session_id = ?');
    params.push(opts.session_id);
  }
  if (opts.since) {
    conditions.push('timestamp >= ?');
    params.push(opts.since);
  }
  if (opts.until) {
    conditions.push('timestamp <= ?');
    params.push(opts.until);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  // String interpolation in LIMIT/OFFSET is safe here because both values
  // Are coerced to non-negative integers via Math.floor + Math.max before use —
  // Math.floor guarantees no decimal component, Math.max(1,…)/Math.max(0,…)
  // Guarantees no negative value. No user-supplied string reaches the SQL directly.
  const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
  // F-13 — OFFSET without LIMIT is invalid SQLite syntax.
  // When offset is set but limit is not, emit LIMIT -1 (all rows) before OFFSET.
  const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';
  const effectiveLimit = !limit && offset ? 'LIMIT -1' : limit;

  // String interpolation constructs IN(?,?,?) placeholder list only —
  // All user values are parameterized. Accepted exception per audit H-08.
  const sql = `SELECT * FROM mutation_ledger ${where} ORDER BY id ASC ${effectiveLimit} ${offset}`;
  return db.prepare(sql).all(...params) as MutationLedgerEntry[];
}

function getEntryCount(db: Database.Database): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM mutation_ledger').get() as { count: number };
  return row.count;
}

/* ───────────────────────────────────────────────────────────────
   7. LINKED ENTRIES LOOKUP
----------------------------------------------------------------*/

function getLinkedEntries(db: Database.Database, memoryId: number): MutationLedgerEntry[] {
  // SQLite json_each can expand JSON arrays for matching
  const sql = `
    SELECT ml.* FROM mutation_ledger ml, json_each(ml.linked_memory_ids) je
    WHERE je.value = ?
    ORDER BY ml.id ASC
  `;
  return db.prepare(sql).all(memoryId) as MutationLedgerEntry[];
}

/* ───────────────────────────────────────────────────────────────
   8. APPEND-ONLY VERIFICATION
----------------------------------------------------------------*/

/**
 * Verify that append-only triggers exist on the mutation_ledger table.
 * Returns true if both UPDATE and DELETE triggers are present.
 */
function verifyAppendOnly(db: Database.Database): boolean {
  const triggers = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = 'mutation_ledger'"
  ).all() as Array<{ name: string }>;

  const names = triggers.map(t => t.name);
  return names.includes('prevent_ledger_update') && names.includes('prevent_ledger_delete');
}

/* ───────────────────────────────────────────────────────────────
   9. DIVERGENCE RETRY + ESCALATION HOOKS
----------------------------------------------------------------*/

const DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES = 3;
const DIVERGENCE_RECONCILE_REASON = 'alias_divergence_auto_reconcile';
const DIVERGENCE_RECONCILE_ESCALATION_REASON = 'alias_divergence_auto_reconcile_escalated';
const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';

function normalizeMaxRetries(maxRetries?: number): number {
  if (!Number.isFinite(maxRetries) || (maxRetries ?? 0) < 1) {
    return DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES;
  }
  return Math.max(1, Math.floor(maxRetries as number));
}

function normalizePath(value: string): string {
  return value.trim().replace(/\\/g, '/');
}

function normalizeVariants(variants?: string[]): string[] {
  if (!Array.isArray(variants)) {
    return [];
  }

  const unique = new Set<string>();
  for (const variant of variants) {
    if (typeof variant !== 'string' || variant.trim().length === 0) {
      continue;
    }
    unique.add(normalizePath(variant));
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

function getDivergenceReconcileAttemptCount(db: Database.Database, normalizedPath: string): number {
  const targetPath = normalizePath(normalizedPath);
  if (targetPath.length === 0) {
    return 0;
  }

  // Use COUNT(*) with json_extract to filter by path in SQL rather than scanning
  // All decision_meta rows in application code (O(1) vs O(n) full-table scan).
  const row = db.prepare(`
    SELECT COUNT(*) AS cnt
    FROM mutation_ledger
    WHERE mutation_type = 'reindex'
      AND reason = ?
      AND json_extract(decision_meta, '$.normalizedPath') = ?
  `).get(DIVERGENCE_RECONCILE_REASON, targetPath) as { cnt: number } | undefined;

  return row?.cnt ?? 0;
}

function hasDivergenceEscalationEntry(db: Database.Database, normalizedPath: string): boolean {
  const targetPath = normalizePath(normalizedPath);
  if (targetPath.length === 0) {
    return false;
  }

  // Use COUNT(*) with json_extract to avoid O(n) full-table scan in application code.
  const row = db.prepare(`
    SELECT COUNT(*) AS cnt
    FROM mutation_ledger
    WHERE mutation_type = 'reindex'
      AND reason = ?
      AND json_extract(decision_meta, '$.normalizedPath') = ?
  `).get(DIVERGENCE_RECONCILE_ESCALATION_REASON, targetPath) as { cnt: number } | undefined;

  return (row?.cnt ?? 0) > 0;
}

function buildDivergenceReconcilePolicy(
  normalizedPath: string,
  attemptsSoFar: number,
  maxRetries: number = DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES
): DivergenceReconcilePolicy {
  const boundedMaxRetries = normalizeMaxRetries(maxRetries);
  const safeAttempts = Math.max(0, Math.floor(attemptsSoFar));
  const nextAttempt = safeAttempts + 1;
  const shouldRetry = safeAttempts < boundedMaxRetries;

  return {
    normalizedPath: normalizePath(normalizedPath),
    attemptsSoFar: safeAttempts,
    nextAttempt,
    maxRetries: boundedMaxRetries,
    shouldRetry,
    exhausted: !shouldRetry,
  };
}

function buildDivergenceEscalationPayload(
  policy: DivergenceReconcilePolicy,
  variants: string[]
): DivergenceEscalationPayload {
  return {
    code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED',
    normalizedPath: policy.normalizedPath,
    attempts: policy.attemptsSoFar,
    maxRetries: policy.maxRetries,
    recommendation: 'manual_triage_required',
    reason: `Auto-reconcile exhausted after ${policy.maxRetries} attempt(s)`,
    variants: normalizeVariants(variants),
  };
}

function recordDivergenceReconcileHook(
  db: Database.Database,
  input: RecordDivergenceReconcileInput
): RecordDivergenceReconcileResult {
  initLedger(db);

  const normalizedPath = normalizePath(input.normalizedPath);
  if (normalizedPath.length === 0) {
    throw new Error('normalizedPath is required for divergence reconciliation');
  }

  const maxRetries = normalizeMaxRetries(input.maxRetries);
  const actor = input.actor ?? DIVERGENCE_RECONCILE_ACTOR;
  const variants = normalizeVariants(input.variants);

  return runInTransaction(db, () => {
    const attemptsSoFar = getDivergenceReconcileAttemptCount(db, normalizedPath);
    const policy = buildDivergenceReconcilePolicy(normalizedPath, attemptsSoFar, maxRetries);

    if (policy.shouldRetry) {
      const retryEntry = appendEntry(db, {
        mutation_type: 'reindex',
        reason: DIVERGENCE_RECONCILE_REASON,
        prior_hash: null,
        new_hash: computeHash(`${normalizedPath}|attempt:${policy.nextAttempt}|max:${policy.maxRetries}`),
        linked_memory_ids: [],
        decision_meta: {
          normalizedPath,
          attempt: policy.nextAttempt,
          maxRetries: policy.maxRetries,
          boundedRetry: true,
          status: 'retry_scheduled',
          variants,
        },
        actor,
        session_id: input.session_id ?? null,
      });

      return {
        policy,
        retryEntryId: retryEntry.id,
        escalationEntryId: null,
        escalation: null,
      };
    }

    const escalation = buildDivergenceEscalationPayload(policy, variants);
    if (hasDivergenceEscalationEntry(db, normalizedPath)) {
      return {
        policy,
        retryEntryId: null,
        escalationEntryId: null,
        escalation,
      };
    }

    const escalationEntry = appendEntry(db, {
      mutation_type: 'reindex',
      reason: DIVERGENCE_RECONCILE_ESCALATION_REASON,
      prior_hash: null,
      new_hash: computeHash(`${normalizedPath}|escalated|attempts:${policy.attemptsSoFar}|max:${policy.maxRetries}`),
      linked_memory_ids: [],
      decision_meta: {
        normalizedPath,
        attempts: policy.attemptsSoFar,
        maxRetries: policy.maxRetries,
        boundedRetry: true,
        status: 'escalated',
        escalation,
      },
      actor,
      session_id: input.session_id ?? null,
    });

    return {
      policy,
      retryEntryId: null,
      escalationEntryId: escalationEntry.id,
      escalation,
    };
  });
}

/* ───────────────────────────────────────────────────────────────
   10. EXPORTS
----------------------------------------------------------------*/

export {
  LEDGER_SCHEMA_SQL,
  LEDGER_INDEX_SQL,
  LEDGER_TRIGGER_SQL,

  initLedger,
  computeHash,
  appendEntry,
  getEntries,
  getEntryCount,
  getLinkedEntries,
  verifyAppendOnly,
  DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES,
  DIVERGENCE_RECONCILE_REASON,
  DIVERGENCE_RECONCILE_ESCALATION_REASON,
  getDivergenceReconcileAttemptCount,
  buildDivergenceReconcilePolicy,
  buildDivergenceEscalationPayload,
  recordDivergenceReconcileHook,
};

/**
 * Re-exports related public types.
 */
export type {
  MutationType,
  MutationLedgerEntry,
  AppendEntryInput,
  GetEntriesOptions,
  DivergenceReconcilePolicy,
  DivergenceEscalationPayload,
  RecordDivergenceReconcileInput,
  RecordDivergenceReconcileResult,
};
