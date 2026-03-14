// TESTS: Mutation Ledger (C136-11)
// Append-only audit trail with SQLite trigger enforcement
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import {
  initLedger,
  appendEntry,
  computeHash,
  getEntries,
  getEntryCount,
  getLinkedEntries,
  verifyAppendOnly,
  DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES,
  DIVERGENCE_RECONCILE_REASON,
  DIVERGENCE_RECONCILE_ESCALATION_REASON,
  getDivergenceReconcileAttemptCount,
  recordDivergenceReconcileHook,
} from '../lib/storage/mutation-ledger';
import type { AppendEntryInput } from '../lib/storage/mutation-ledger';

/* ───────────────────────────────────────────────────────────────
   HELPERS
----------------------------------------------------------------*/

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initLedger(db);
  return db;
}

function makeEntry(overrides: Partial<AppendEntryInput> = {}): AppendEntryInput {
  return {
    mutation_type: 'create',
    reason: 'test entry',
    prior_hash: null,
    new_hash: computeHash('test-content'),
    linked_memory_ids: [1, 2],
    decision_meta: { source: 'test' },
    actor: 'test-agent',
    session_id: 'sess-001',
    ...overrides,
  };
}

/* ───────────────────────────────────────────────────────────────
   TESTS
----------------------------------------------------------------*/

describe('Mutation Ledger', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  // 1. Table creation
  it('creates the mutation_ledger table with correct columns', () => {
    const columns = db.prepare('PRAGMA table_info(mutation_ledger)').all() as Array<{ name: string }>;
    const names = columns.map(c => c.name);

    expect(names).toContain('id');
    expect(names).toContain('timestamp');
    expect(names).toContain('mutation_type');
    expect(names).toContain('reason');
    expect(names).toContain('prior_hash');
    expect(names).toContain('new_hash');
    expect(names).toContain('linked_memory_ids');
    expect(names).toContain('decision_meta');
    expect(names).toContain('actor');
    expect(names).toContain('session_id');
  });

  // 2. Append returns entry with id and timestamp
  it('appends an entry and returns it with id and timestamp', () => {
    const entry = appendEntry(db, makeEntry());

    expect(entry.id).toBeGreaterThan(0);
    expect(entry.timestamp).toBeTruthy();
    expect(entry.mutation_type).toBe('create');
    expect(entry.reason).toBe('test entry');
    expect(entry.actor).toBe('test-agent');
    expect(entry.session_id).toBe('sess-001');
  });

  // 3. Hash determinism
  it('produces deterministic SHA-256 hashes', () => {
    const hash1 = computeHash('hello world');
    const hash2 = computeHash('hello world');
    const hash3 = computeHash('different content');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toHaveLength(64); // SHA-256 hex = 64 chars
  });

  // 4. UPDATE rejected
  it('rejects UPDATE on mutation_ledger', () => {
    appendEntry(db, makeEntry());

    expect(() => {
      db.prepare('UPDATE mutation_ledger SET reason = ? WHERE id = 1').run('modified');
    }).toThrow('mutation_ledger is append-only');
  });

  // 5. DELETE rejected
  it('rejects DELETE on mutation_ledger', () => {
    appendEntry(db, makeEntry());

    expect(() => {
      db.prepare('DELETE FROM mutation_ledger WHERE id = 1').run();
    }).toThrow('mutation_ledger is append-only');
  });

  // 6. Filter by mutation_type
  it('filters entries by mutation_type', () => {
    appendEntry(db, makeEntry({ mutation_type: 'create' }));
    appendEntry(db, makeEntry({ mutation_type: 'update' }));
    appendEntry(db, makeEntry({ mutation_type: 'delete' }));

    const creates = getEntries(db, { mutation_type: 'create' });
    expect(creates).toHaveLength(1);
    expect(creates[0].mutation_type).toBe('create');

    const updates = getEntries(db, { mutation_type: 'update' });
    expect(updates).toHaveLength(1);
  });

  // 7. Limit and offset
  it('respects limit and offset in queries', () => {
    for (let i = 0; i < 5; i++) {
      appendEntry(db, makeEntry({ reason: `entry-${i}` }));
    }

    const limited = getEntries(db, { limit: 2 });
    expect(limited).toHaveLength(2);
    expect(limited[0].reason).toBe('entry-0');

    const offsetted = getEntries(db, { limit: 2, offset: 3 });
    expect(offsetted).toHaveLength(2);
    expect(offsetted[0].reason).toBe('entry-3');
  });

  // 8. Linked entries lookup
  it('finds entries linked to a specific memory ID', () => {
    appendEntry(db, makeEntry({ linked_memory_ids: [10, 20] }));
    appendEntry(db, makeEntry({ linked_memory_ids: [20, 30] }));
    appendEntry(db, makeEntry({ linked_memory_ids: [30, 40] }));

    const linkedTo20 = getLinkedEntries(db, 20);
    expect(linkedTo20).toHaveLength(2);

    const linkedTo40 = getLinkedEntries(db, 40);
    expect(linkedTo40).toHaveLength(1);

    const linkedTo99 = getLinkedEntries(db, 99);
    expect(linkedTo99).toHaveLength(0);
  });

  // 9. Append-only verification
  it('verifies append-only triggers exist', () => {
    expect(verifyAppendOnly(db)).toBe(true);
  });

  it('verifyAppendOnly returns false when triggers are missing', () => {
    const rawDb = new Database(':memory:');
    rawDb.exec(`CREATE TABLE mutation_ledger (id INTEGER PRIMARY KEY, reason TEXT)`);
    expect(verifyAppendOnly(rawDb)).toBe(false);
  });

  // 10. Required fields present
  it('stores all required fields correctly', () => {
    const input = makeEntry({
      mutation_type: 'merge',
      reason: 'merging duplicates',
      prior_hash: computeHash('old-state'),
      new_hash: computeHash('new-state'),
      linked_memory_ids: [5, 6, 7],
      decision_meta: { confidence: 0.95, strategy: 'dedup' },
      actor: 'merge-agent',
      session_id: 'sess-merge-1',
    });

    const entry = appendEntry(db, input);

    expect(entry.mutation_type).toBe('merge');
    expect(entry.reason).toBe('merging duplicates');
    expect(entry.prior_hash).toBe(computeHash('old-state'));
    expect(entry.new_hash).toBe(computeHash('new-state'));
    expect(entry.actor).toBe('merge-agent');
    expect(entry.session_id).toBe('sess-merge-1');
  });

  // 11. JSON validity for linked_memory_ids and decision_meta
  it('stores valid JSON in linked_memory_ids and decision_meta', () => {
    const entry = appendEntry(db, makeEntry({
      linked_memory_ids: [100, 200, 300],
      decision_meta: { key: 'value', nested: { a: 1 } },
    }));

    const parsedIds = JSON.parse(entry.linked_memory_ids);
    expect(parsedIds).toEqual([100, 200, 300]);

    const parsedMeta = JSON.parse(entry.decision_meta);
    expect(parsedMeta).toEqual({ key: 'value', nested: { a: 1 } });
  });

  // 12. Entry count
  it('returns correct entry count', () => {
    expect(getEntryCount(db)).toBe(0);

    appendEntry(db, makeEntry());
    appendEntry(db, makeEntry());
    appendEntry(db, makeEntry());

    expect(getEntryCount(db)).toBe(3);
  });

  // 13. Filter by actor
  it('filters entries by actor', () => {
    appendEntry(db, makeEntry({ actor: 'agent-a' }));
    appendEntry(db, makeEntry({ actor: 'agent-b' }));
    appendEntry(db, makeEntry({ actor: 'agent-a' }));

    const agentA = getEntries(db, { actor: 'agent-a' });
    expect(agentA).toHaveLength(2);
  });

  // 14. prior_hash null for creates
  it('allows null prior_hash for create mutations', () => {
    const entry = appendEntry(db, makeEntry({
      mutation_type: 'create',
      prior_hash: null,
    }));
    expect(entry.prior_hash).toBeNull();
  });

  // 15. Invalid mutation_type rejected by CHECK constraint
  it('rejects invalid mutation_type via CHECK constraint', () => {
    expect(() => {
      db.prepare(`
        INSERT INTO mutation_ledger (mutation_type, reason, new_hash, actor)
        VALUES ('invalid_type', 'test', 'abc', 'test')
      `).run();
    }).toThrow();
  });

  // 16. Idempotent initLedger
  it('is idempotent — calling initLedger twice does not error', () => {
    expect(() => initLedger(db)).not.toThrow();
    // Table and triggers still work after re-init
    appendEntry(db, makeEntry());
    expect(getEntryCount(db)).toBe(1);
  });

  it('records deterministic bounded retry attempts for divergence reconciliation', () => {
    const normalizedPath = '/workspace/specs/02--system-spec-kit/700-test/memory/a.md';
    const variants = [
      '/workspace/specs/02--system-spec-kit/700-test/memory/a.md',
      '/workspace/.opencode/specs/02--system-spec-kit/700-test/memory/a.md',
    ];

    const first = recordDivergenceReconcileHook(db, { normalizedPath, variants });
    const second = recordDivergenceReconcileHook(db, { normalizedPath, variants });
    const third = recordDivergenceReconcileHook(db, { normalizedPath, variants });

    expect(DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES).toBe(3);
    expect(first.policy.nextAttempt).toBe(1);
    expect(second.policy.nextAttempt).toBe(2);
    expect(third.policy.nextAttempt).toBe(3);
    expect(first.policy.shouldRetry).toBe(true);
    expect(second.policy.shouldRetry).toBe(true);
    expect(third.policy.shouldRetry).toBe(true);
    expect(getDivergenceReconcileAttemptCount(db, normalizedPath)).toBe(3);

    const retryEntries = db.prepare(
      'SELECT reason, decision_meta FROM mutation_ledger WHERE reason = ? ORDER BY id ASC'
    ).all(DIVERGENCE_RECONCILE_REASON) as Array<{ reason: string; decision_meta: string }>;
    const attempts = retryEntries.map((row) => {
      const meta = JSON.parse(row.decision_meta) as { attempt?: number };
      return meta.attempt;
    });
    expect(attempts).toEqual([1, 2, 3]);
  });

  it('escalates with payload when divergence retries are exhausted', () => {
    const normalizedPath = '/workspace/specs/02--system-spec-kit/701-test/memory/b.md';
    const variants = [
      '/workspace/specs/02--system-spec-kit/701-test/memory/b.md',
      '/workspace/.opencode/specs/02--system-spec-kit/701-test/memory/b.md',
    ];

    recordDivergenceReconcileHook(db, { normalizedPath, variants, maxRetries: 2 });
    recordDivergenceReconcileHook(db, { normalizedPath, variants, maxRetries: 2 });
    const escalationResult = recordDivergenceReconcileHook(db, { normalizedPath, variants, maxRetries: 2 });

    expect(escalationResult.policy.shouldRetry).toBe(false);
    expect(escalationResult.policy.exhausted).toBe(true);
    expect(escalationResult.escalation).toBeTruthy();
    expect(escalationResult.escalation?.code).toBe('E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED');
    expect(escalationResult.escalation?.attempts).toBe(2);
    expect(escalationResult.escalation?.maxRetries).toBe(2);
    expect(escalationResult.escalation?.normalizedPath).toBe(normalizedPath);

    const escalationEntries = db.prepare(
      'SELECT reason, decision_meta FROM mutation_ledger WHERE reason = ? ORDER BY id ASC'
    ).all(DIVERGENCE_RECONCILE_ESCALATION_REASON) as Array<{ reason: string; decision_meta: string }>;
    expect(escalationEntries).toHaveLength(1);
    const escalationMeta = JSON.parse(escalationEntries[0].decision_meta) as {
      status?: string;
      escalation?: { code?: string; recommendation?: string };
    };
    expect(escalationMeta.status).toBe('escalated');
    expect(escalationMeta.escalation?.code).toBe('E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED');
    expect(escalationMeta.escalation?.recommendation).toBe('manual_triage_required');

    const repeatedEscalation = recordDivergenceReconcileHook(db, { normalizedPath, variants, maxRetries: 2 });
    expect(repeatedEscalation.escalation).toBeTruthy();
    expect(repeatedEscalation.escalationEntryId).toBeNull();

    const escalationEntriesAfterRepeat = db.prepare(
      'SELECT reason FROM mutation_ledger WHERE reason = ? ORDER BY id ASC'
    ).all(DIVERGENCE_RECONCILE_ESCALATION_REASON);
    expect(escalationEntriesAfterRepeat).toHaveLength(1);
  });
});
