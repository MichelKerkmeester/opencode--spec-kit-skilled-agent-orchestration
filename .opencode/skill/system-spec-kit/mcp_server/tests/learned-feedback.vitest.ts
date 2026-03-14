// TEST: Learned Relevance Feedback (R11)
// Tests all 10 safeguards, auto-promotion (T002a), and negative
// Feedback confidence signal (T002b/A4).
import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import Database from 'better-sqlite3';

// Module under test: Feedback Denylist
import {
  DENYLIST,
  isOnDenylist,
  getDenylistSize,
} from '../lib/search/feedback-denylist';

// Module under test: Learned Triggers Schema
import {
  migrateLearnedTriggers,
  verifyFts5Isolation,
  rollbackLearnedTriggers,
  parseLearnedTriggers,
  serializeLearnedTriggers,
  LEARNED_TRIGGERS_COLUMN,
  type LearnedTriggerEntry,
} from '../lib/storage/learned-triggers-schema';

// Module under test: Learned Feedback Engine
import {
  isLearnedFeedbackEnabled,
  isMemoryEligible,
  extractLearnableTerms,
  recordSelection,
  applyLearnedTriggers,
  queryLearnedTriggers,
  expireLearnedTerms,
  clearAllLearnedTriggers,
  getAuditLog,
  FEATURE_FLAG,
  LEARNED_TRIGGER_WEIGHT,
  MAX_TERMS_PER_SELECTION,
  MAX_TERMS_PER_MEMORY,
  LEARNED_TERM_TTL_MS,
  MIN_MEMORY_AGE_MS,
  TOP_N_EXCLUSION,
  type AuditLogEntry,
  type LearnedTriggerMatch,
} from '../lib/search/learned-feedback';

// Module under test: Auto-Promotion
import {
  checkAutoPromotion,
  executeAutoPromotion,
  scanForPromotions,
  PROMOTE_TO_IMPORTANT_THRESHOLD,
  PROMOTE_TO_CRITICAL_THRESHOLD,
  MAX_PROMOTIONS_PER_WINDOW,
  PROMOTION_WINDOW_HOURS,
  PROMOTION_WINDOW_MS,
} from '../lib/search/auto-promotion';

// Module under test: Negative Feedback
import {
  computeConfidenceMultiplier,
  applyNegativeFeedback,
  CONFIDENCE_MULTIPLIER_BASE,
  CONFIDENCE_MULTIPLIER_FLOOR,
  NEGATIVE_PENALTY_PER_VALIDATION,
  RECOVERY_HALF_LIFE_MS,
} from '../lib/scoring/negative-feedback';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

type TestDatabase = InstanceType<typeof Database>;

/** Create a fresh test database with memory_index table + FTS5. */
function createTestDb(): { db: TestDatabase; path: string } {
  const tmpPath = path.join(os.tmpdir(), `learned-feedback-test-${Date.now()}-${Math.random().toString(36).slice(2)}.sqlite`);
  const testDb = new Database(tmpPath);

  testDb.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      trigger_phrases TEXT DEFAULT '[]',
      file_path TEXT DEFAULT '',
      content_text TEXT DEFAULT '',
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      spec_folder TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      is_archived INTEGER DEFAULT 0
    )
  `);

  // Create the FTS5 table matching the real schema (NO learned_triggers!)
  testDb.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
      title,
      trigger_phrases,
      file_path,
      content_text,
      content='memory_index',
      content_rowid='id'
    )
  `);

  return { db: testDb, path: tmpPath };
}

/** Insert a test memory with known created_at timestamp. */
function insertMemory(testDb: TestDatabase, id: number, opts: {
  title?: string;
  triggerPhrases?: string[];
  createdAt?: string;
  tier?: string;
  validationCount?: number;
  confidence?: number;
} = {}): void {
  const {
    title = `Memory ${id}`,
    triggerPhrases = [],
    createdAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago default
    tier = 'normal',
    validationCount = 0,
    confidence = 0.5,
  } = opts;

  testDb.prepare(`
    INSERT INTO memory_index (id, title, trigger_phrases, created_at, importance_tier, validation_count, confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, JSON.stringify(triggerPhrases), createdAt, tier, validationCount, confidence);
}

// ───────────────────────────────────────────────────────────────
// 1. DENYLIST TESTS
// ───────────────────────────────────────────────────────────────
describe('Feedback Denylist', () => {
  it('R11-DL01: denylist contains 100+ words', () => {
    expect(getDenylistSize()).toBeGreaterThanOrEqual(100);
  });

  it('R11-DL02: DENYLIST is a Set', () => {
    expect(DENYLIST).toBeInstanceOf(Set);
  });

  it('R11-DL03: common English stop words are present', () => {
    const expected = ['the', 'a', 'an', 'is', 'was', 'are', 'and', 'or', 'but', 'for'];
    for (const word of expected) {
      expect(DENYLIST.has(word)).toBe(true);
    }
  });

  it('R11-DL04: code keywords are present', () => {
    const expected = ['function', 'const', 'let', 'var', 'import', 'export', 'return'];
    for (const word of expected) {
      expect(DENYLIST.has(word)).toBe(true);
    }
  });

  it('R11-DL05: domain-specific words are present', () => {
    const expected = ['memory', 'session', 'context', 'spec', 'folder'];
    for (const word of expected) {
      expect(DENYLIST.has(word)).toBe(true);
    }
  });

  it('R11-DL06: isOnDenylist is case-insensitive', () => {
    expect(isOnDenylist('THE')).toBe(true);
    expect(isOnDenylist('The')).toBe(true);
    expect(isOnDenylist('tHe')).toBe(true);
    expect(isOnDenylist('the')).toBe(true);
  });

  it('R11-DL07: isOnDenylist returns false for non-stop words', () => {
    expect(isOnDenylist('authentication')).toBe(false);
    expect(isOnDenylist('kubernetes')).toBe(false);
    expect(isOnDenylist('optimization')).toBe(false);
  });

  it('R11-DL08: getDenylistSize returns accurate count', () => {
    expect(getDenylistSize()).toBe(DENYLIST.size);
  });
});

// ───────────────────────────────────────────────────────────────
// 2. SCHEMA MIGRATION TESTS
// ───────────────────────────────────────────────────────────────
describe('Learned Triggers Schema', () => {
  let testDb: TestDatabase;
  let testDbPath: string;

  beforeEach(() => {
    const setup = createTestDb();
    testDb = setup.db;
    testDbPath = setup.path;
  });

  afterEach(() => {
    try {
      if (testDb) testDb.close();
      if (testDbPath && fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    } catch { /* ignore */ }
  });

  it('R11-SCH01: migrateLearnedTriggers adds column', () => {
    const result = migrateLearnedTriggers(testDb);
    expect(result).toBe(true);

    const columns = testDb.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
    const hasColumn = columns.some(column => column.name === 'learned_triggers');
    expect(hasColumn).toBe(true);
  });

  it('R11-SCH02: migrateLearnedTriggers is idempotent', () => {
    migrateLearnedTriggers(testDb);
    const secondRun = migrateLearnedTriggers(testDb);
    expect(secondRun).toBe(false); // Already exists
  });

  it('R11-SCH03: CRITICAL - FTS5 isolation verified', () => {
    migrateLearnedTriggers(testDb);
    const isolated = verifyFts5Isolation(testDb);
    expect(isolated).toBe(true);
  });

  it('R11-SCH04: CRITICAL - verifyFts5Isolation throws if learned_triggers in FTS5', () => {
    // Create a deliberately wrong FTS5 table with learned_triggers
    const badSetup = createTestDb();
    const badDb = badSetup.db;

    // Drop the correct FTS5 and create a bad one
    badDb.exec('DROP TABLE IF EXISTS memory_fts');
    badDb.exec(`
      CREATE VIRTUAL TABLE memory_fts USING fts5(
        title,
        trigger_phrases,
        file_path,
        content_text,
        learned_triggers,
        content='memory_index',
        content_rowid='id'
      )
    `);

    expect(() => verifyFts5Isolation(badDb)).toThrow('CRITICAL');

    badDb.close();
    try { fs.unlinkSync(badSetup.path); } catch { /* ignore */ }
  });

  it('R11-SCH05: rollbackLearnedTriggers removes column', () => {
    migrateLearnedTriggers(testDb);
    const result = rollbackLearnedTriggers(testDb);
    expect(result).toBe(true);

    const columns = testDb.prepare('PRAGMA table_info(memory_index)').all();
    const hasColumn = columns.some((c: any) => c.name === 'learned_triggers');
    expect(hasColumn).toBe(false);
  });

  it('R11-SCH06: rollbackLearnedTriggers returns false if column absent', () => {
    const result = rollbackLearnedTriggers(testDb);
    expect(result).toBe(false);
  });

  it('R11-SCH07: parseLearnedTriggers handles empty/null', () => {
    expect(parseLearnedTriggers(null)).toEqual([]);
    expect(parseLearnedTriggers(undefined)).toEqual([]);
    expect(parseLearnedTriggers('[]')).toEqual([]);
    expect(parseLearnedTriggers('')).toEqual([]);
  });

  it('R11-SCH08: parseLearnedTriggers handles valid JSON', () => {
    const entries: LearnedTriggerEntry[] = [
      { term: 'auth', addedAt: 1000, source: 'q1', expiresAt: 2000 },
    ];
    const parsed = parseLearnedTriggers(JSON.stringify(entries));
    expect(parsed).toEqual(entries);
  });

  it('R11-SCH09: serializeLearnedTriggers produces valid JSON', () => {
    const entries: LearnedTriggerEntry[] = [
      { term: 'auth', addedAt: 1000, source: 'q1', expiresAt: 2000 },
    ];
    const serialized = serializeLearnedTriggers(entries);
    expect(JSON.parse(serialized)).toEqual(entries);
  });
});

/* ───────────────────────────────────────────────────────────────
   3. FEATURE FLAG & GATING TESTS
   ──────────────────────────────────────────────────────────────── */

describe('Learned Feedback Feature Flags', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('R11-FF01: isLearnedFeedbackEnabled returns true by default (graduated)', () => {
    delete process.env[FEATURE_FLAG];
    expect(isLearnedFeedbackEnabled()).toBe(true);
  });

  it('R11-FF02: isLearnedFeedbackEnabled returns true when set', () => {
    process.env[FEATURE_FLAG] = 'true';
    expect(isLearnedFeedbackEnabled()).toBe(true);
  });

  it('R11-FF03: isLearnedFeedbackEnabled is case-insensitive', () => {
    process.env[FEATURE_FLAG] = 'TRUE';
    expect(isLearnedFeedbackEnabled()).toBe(true);
  });

  it('R11-FF07: isMemoryEligible rejects <72h memories', () => {
    expect(isMemoryEligible(24 * 60 * 60 * 1000)).toBe(false);  // 24h
    expect(isMemoryEligible(48 * 60 * 60 * 1000)).toBe(false);  // 48h
    expect(isMemoryEligible(71 * 60 * 60 * 1000)).toBe(false);  // 71h
  });

  it('R11-FF08: isMemoryEligible accepts >=72h memories', () => {
    expect(isMemoryEligible(72 * 60 * 60 * 1000)).toBe(true);   // 72h exactly
    expect(isMemoryEligible(96 * 60 * 60 * 1000)).toBe(true);   // 96h
    expect(isMemoryEligible(7 * 24 * 60 * 60 * 1000)).toBe(true); // 1 week
  });
});

// ───────────────────────────────────────────────────────────────
// 3. TERM EXTRACTION TESTS
// ───────────────────────────────────────────────────────────────
describe('Term Extraction', () => {
  it('R11-TE01: filters out denylist words', () => {
    const result = extractLearnableTerms(
      ['the', 'authentication', 'function', 'kubernetes'],
      []
    );
    expect(result).not.toContain('the');
    expect(result).not.toContain('function');
    expect(result).toContain('authentication');
    expect(result).toContain('kubernetes');
  });

  it('R11-TE02: filters out existing triggers', () => {
    const result = extractLearnableTerms(
      ['authentication', 'authorization'],
      ['authentication']
    );
    expect(result).not.toContain('authentication');
    expect(result).toContain('authorization');
  });

  it('R11-TE03: rate cap - max 3 terms per selection', () => {
    const result = extractLearnableTerms(
      ['authentication', 'authorization', 'encryption', 'decryption', 'hashing'],
      []
    );
    expect(result.length).toBeLessThanOrEqual(MAX_TERMS_PER_SELECTION);
    expect(result.length).toBe(3);
  });

  it('R11-TE04: filters short terms (< MIN_TERM_LENGTH)', () => {
    const result = extractLearnableTerms(['ab', 'cd', 'authentication'], []);
    expect(result).not.toContain('ab');
    expect(result).not.toContain('cd');
    expect(result).toContain('authentication');
  });

  it('R11-TE05: case-insensitive deduplication', () => {
    const result = extractLearnableTerms(
      ['Authentication', 'authentication', 'AUTHENTICATION'],
      []
    );
    // All should collapse to one
    const authEntries = result.filter((t) => t === 'authentication');
    expect(authEntries.length).toBeLessThanOrEqual(1);
  });

  it('R11-TE06: accepts custom denylist', () => {
    const customDenylist = new Set(['custom', 'blocked']);
    const result = extractLearnableTerms(
      ['custom', 'allowed', 'blocked'],
      [],
      customDenylist
    );
    expect(result).not.toContain('custom');
    expect(result).not.toContain('blocked');
    expect(result).toContain('allowed');
  });
});

// ───────────────────────────────────────────────────────────────
// 4. CORE OPERATIONS TESTS
// ───────────────────────────────────────────────────────────────
describe('Learned Feedback Core Operations', () => {
  let testDb: any;
  let testDbPath: string;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    const setup = createTestDb();
    testDb = setup.db;
    testDbPath = setup.path;

    // Add learned_triggers column
    migrateLearnedTriggers(testDb);

    // Enable feature
    process.env[FEATURE_FLAG] = 'true';

    // Pre-populate audit table with an old entry to bypass the 7-day shadow period (Safeguard #6)
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS learned_feedback_audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        terms TEXT NOT NULL,
        source TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        shadow_mode INTEGER NOT NULL DEFAULT 0
      )
    `);
    testDb.prepare(
      'INSERT INTO learned_feedback_audit (memory_id, action, terms, timestamp, source, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(0, 'bootstrap', '[]', Date.now() - 8 * 24 * 60 * 60 * 1000, 'test-setup', 0);

    // Insert test memories (7 days old by default = past 72h threshold)
    insertMemory(testDb, 1, { title: 'Auth Module', triggerPhrases: ['login', 'oauth'] });
    insertMemory(testDb, 2, { title: 'Database Schema', triggerPhrases: ['migration', 'sql'] });
    insertMemory(testDb, 3, {
      title: 'New Memory',
      triggerPhrases: ['fresh'],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24h old (too new)
    });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    try {
      if (testDb) testDb.close();
      if (testDbPath && fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    } catch { /* ignore */ }
  });

  it('R11-CO01: recordSelection returns feature_disabled when off', () => {
    process.env[FEATURE_FLAG] = 'false';
    const result = recordSelection('q1', 1, ['authentication'], 5, testDb);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe('feature_disabled');
  });

  it('R11-CO02: recordSelection enforces top-3 exclusion (Safeguard #5)', () => {
    const result1 = recordSelection('q1', 1, ['authentication'], 1, testDb);
    expect(result1.applied).toBe(false);
    expect(result1.reason).toBe('top_3_exclusion');

    const result2 = recordSelection('q1', 1, ['authentication'], 2, testDb);
    expect(result2.applied).toBe(false);
    expect(result2.reason).toBe('top_3_exclusion');

    const result3 = recordSelection('q1', 1, ['authentication'], 3, testDb);
    expect(result3.applied).toBe(false);
    expect(result3.reason).toBe('top_3_exclusion');
  });

  it('R11-CO03: recordSelection rejects <72h memories (Safeguard #7)', () => {
    const result = recordSelection('q1', 3, ['authentication'], 5, testDb);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe('memory_too_new');
  });

  it('R11-CO04: recordSelection is log-only during shadow period (no learned trigger persistence)', () => {
    // Force shadow mode by replacing the bootstrap entry with a recent timestamp.
    testDb.exec('DELETE FROM learned_feedback_audit');
    testDb.prepare(
      'INSERT INTO learned_feedback_audit (memory_id, action, terms, timestamp, source, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);

    const result = recordSelection('q-shadow-core', 1, ['authentication'], 5, testDb);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe('shadow_period');
    expect(result.terms.length).toBeGreaterThan(0);

    // No write/apply effect: learned_triggers must remain empty.
    const row = testDb.prepare('SELECT learned_triggers FROM memory_index WHERE id = 1').get() as { learned_triggers?: string };
    const entries = parseLearnedTriggers(row.learned_triggers);
    expect(entries.length).toBe(0);

    // Audit still records the event and marks it as shadow mode.
    const audit = getAuditLog(testDb, 1);
    const shadowEntry = audit.find((a) => a.source === 'q-shadow-core');
    expect(shadowEntry).toBeDefined();
    expect(shadowEntry!.shadowMode).toBe(true);
  });

  it('R11-CO05: recordSelection applies terms when all safeguards pass', () => {
    const result = recordSelection('q1', 1, ['authentication', 'security'], 5, testDb);
    expect(result.applied).toBe(true);
    expect(result.terms.length).toBeGreaterThan(0);

    // Verify learned_triggers updated
    const row = testDb.prepare('SELECT learned_triggers FROM memory_index WHERE id = 1').get();
    const entries = parseLearnedTriggers(row.learned_triggers);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.some((e: any) => e.term === 'authentication')).toBe(true);
  });

  it('R11-CO06: rate cap - max 8 terms per memory (Safeguard #4)', () => {
    // Apply terms in multiple selections until we hit the cap
    for (let i = 0; i < 5; i++) {
      const terms = [`term${i}a`, `term${i}b`, `term${i}c`];
      recordSelection(`q${i}`, 1, terms, 5, testDb);
    }

    const row = testDb.prepare('SELECT learned_triggers FROM memory_index WHERE id = 1').get();
    const entries = parseLearnedTriggers(row.learned_triggers);
    expect(entries.length).toBeLessThanOrEqual(MAX_TERMS_PER_MEMORY);
  });

  it('R11-CO06b: applyLearnedTriggers deduplicates repeated terms within one call', () => {
    applyLearnedTriggers(1, ['Authentication', 'authentication', 'AUTHENTICATION'], testDb, 'test');

    const row = testDb.prepare('SELECT learned_triggers FROM memory_index WHERE id = 1').get();
    const entries = parseLearnedTriggers(row.learned_triggers);
    expect(entries.filter((entry) => entry.term === 'authentication').length).toBe(1);
  });

  it('R11-CO07: queryLearnedTriggers returns matches at 0.7x weight', () => {
    // Pre-populate learned triggers
    applyLearnedTriggers(1, ['authentication', 'security'], testDb, 'test');

    const matches = queryLearnedTriggers('authentication system', testDb);
    expect(matches.length).toBeGreaterThan(0);

    const match = matches.find((m) => m.memoryId === 1);
    expect(match).toBeDefined();
    expect(match!.weight).toBeLessThanOrEqual(LEARNED_TRIGGER_WEIGHT);
  });

  it('R11-CO08: queryLearnedTriggers returns empty when disabled', () => {
    process.env[FEATURE_FLAG] = 'false';
    applyLearnedTriggers(1, ['authentication'], testDb, 'test');
    const matches = queryLearnedTriggers('authentication', testDb);
    expect(matches).toEqual([]);
  });

  it('R11-CO09: shadow period enforced — queryLearnedTriggers returns empty during first 7 days', () => {
    // Replace the old audit entry with a very recent one to trigger shadow period
    testDb.exec('DELETE FROM learned_feedback_audit');
    testDb.prepare(
      'INSERT INTO learned_feedback_audit (memory_id, action, terms, timestamp, source, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);

    applyLearnedTriggers(1, ['authentication'], testDb, 'test');
    const matches = queryLearnedTriggers('authentication', testDb);
    // Safeguard #6 — shadow period enforced for first 7 days
    expect(matches.length).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   6. EXPIRY & ROLLBACK TESTS
   ──────────────────────────────────────────────────────────────── */

describe('Learned Feedback Expiry & Rollback', () => {
  let testDb: any;
  let testDbPath: string;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    const setup = createTestDb();
    testDb = setup.db;
    testDbPath = setup.path;
    migrateLearnedTriggers(testDb);
    insertMemory(testDb, 1, { title: 'Test Memory' });

    process.env[FEATURE_FLAG] = 'true';
    process.env.SPECKIT_LEARN_FROM_SELECTION_START = String(Date.now() - 8 * 24 * 60 * 60 * 1000);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    try {
      if (testDb) testDb.close();
      if (testDbPath && fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    } catch { /* ignore */ }
  });

  it('R11-EX01: expireLearnedTerms removes expired terms (Safeguard #2)', () => {
    // Manually insert expired entries
    const nowSeconds = Math.floor(Date.now() / 1000);
    const entries: LearnedTriggerEntry[] = [
      { term: 'expired1', addedAt: nowSeconds - 100000, source: 'old', expiresAt: nowSeconds - 1 },
      { term: 'valid1', addedAt: nowSeconds, source: 'new', expiresAt: nowSeconds + 100000 },
    ];

    testDb.prepare('UPDATE memory_index SET learned_triggers = ? WHERE id = 1')
      .run(serializeLearnedTriggers(entries));

    const affected = expireLearnedTerms(testDb);
    expect(affected).toBe(1);

    const row = testDb.prepare('SELECT learned_triggers FROM memory_index WHERE id = 1').get();
    const remaining = parseLearnedTriggers(row.learned_triggers);
    expect(remaining.length).toBe(1);
    expect(remaining[0].term).toBe('valid1');
  });

  it('R11-EX02: clearAllLearnedTriggers resets all memories (Safeguard #9)', () => {
    applyLearnedTriggers(1, ['authentication', 'security'], testDb, 'test');

    // Verify something is there
    let row = testDb.prepare('SELECT learned_triggers FROM memory_index WHERE id = 1').get();
    let entries = parseLearnedTriggers(row.learned_triggers);
    expect(entries.length).toBeGreaterThan(0);

    // Rollback
    const cleared = clearAllLearnedTriggers(testDb);
    expect(cleared).toBeGreaterThan(0);

    // Verify cleared
    row = testDb.prepare('SELECT learned_triggers FROM memory_index WHERE id = 1').get();
    entries = parseLearnedTriggers(row.learned_triggers);
    expect(entries.length).toBe(0);
  });

  it('R11-EX03: clearAllLearnedTriggers logs to audit', () => {
    applyLearnedTriggers(1, ['authentication'], testDb, 'test');
    clearAllLearnedTriggers(testDb);

    const audit = getAuditLog(testDb, 1);
    const clearEntry = audit.find((a) => a.action === 'clear');
    expect(clearEntry).toBeDefined();
  });
});

// ───────────────────────────────────────────────────────────────
// 5. AUDIT LOG TESTS
// ───────────────────────────────────────────────────────────────
describe('Learned Feedback Audit Log (Safeguard #10)', () => {
  let testDb: any;
  let testDbPath: string;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    const setup = createTestDb();
    testDb = setup.db;
    testDbPath = setup.path;
    migrateLearnedTriggers(testDb);
    insertMemory(testDb, 1, { title: 'Test Memory' });

    process.env[FEATURE_FLAG] = 'true';
    process.env.SPECKIT_LEARN_FROM_SELECTION_START = String(Date.now() - 8 * 24 * 60 * 60 * 1000);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    try {
      if (testDb) testDb.close();
      if (testDbPath && fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    } catch { /* ignore */ }
  });

  it('R11-AL01: getAuditLog returns entries after selection', () => {
    recordSelection('q-audit-1', 1, ['authentication'], 5, testDb);

    const audit = getAuditLog(testDb, 1);
    expect(audit.length).toBeGreaterThan(0);
    expect(audit[0].memoryId).toBe(1);
    expect(audit[0].action).toBe('add');
    expect(audit[0].source).toBe('q-audit-1');
  });

  it('R11-AL02: getAuditLog supports limit', () => {
    for (let i = 0; i < 5; i++) {
      recordSelection(`q-${i}`, 1, [`term${i}abc`], 5, testDb);
    }

    const audit = getAuditLog(testDb, 1, 2);
    expect(audit.length).toBeLessThanOrEqual(2);
  });

  it('R11-AL03: getAuditLog supports global query (no memoryId)', () => {
    recordSelection('q-global-1', 1, ['authentication'], 5, testDb);
    const audit = getAuditLog(testDb);
    expect(audit.length).toBeGreaterThan(0);
  });

  it('R11-AL04: audit entries set shadow mode true during shadow period', () => {
    recordSelection('q-shadow', 1, ['authentication'], 5, testDb);

    const audit = getAuditLog(testDb, 1);
    const entry = audit.find((a) => a.source === 'q-shadow');
    expect(entry).toBeDefined();
    expect(entry!.shadowMode).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   8. AUTO-PROMOTION TESTS (T002a)
   ──────────────────────────────────────────────────────────────── */

describe('Auto-Promotion Engine (T002a)', () => {
  let testDb: any;
  let testDbPath: string;

  beforeEach(() => {
    const setup = createTestDb();
    testDb = setup.db;
    testDbPath = setup.path;
  });

  afterEach(() => {
    try {
      if (testDb) testDb.close();
      if (testDbPath && fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    } catch { /* ignore */ }
  });

  it('R11-AP01: normal -> important at 5 validations', () => {
    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
    const result = checkAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(true);
    expect(result.previousTier).toBe('normal');
    expect(result.newTier).toBe('important');
  });

  it('R11-AP02: important -> critical at 10 validations', () => {
    insertMemory(testDb, 1, { tier: 'important', validationCount: 10 });
    const result = checkAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(true);
    expect(result.previousTier).toBe('important');
    expect(result.newTier).toBe('critical');
  });

  it('R11-AP03: below threshold - no promotion (normal with 3 validations)', () => {
    insertMemory(testDb, 1, { tier: 'normal', validationCount: 3 });
    const result = checkAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(false);
    expect(result.previousTier).toBe('normal');
    expect(result.newTier).toBe('normal');
  });

  it('R11-AP04: below threshold - no promotion (important with 7 validations)', () => {
    insertMemory(testDb, 1, { tier: 'important', validationCount: 7 });
    const result = checkAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(false);
    expect(result.reason).toContain('below_threshold');
  });

  it('R11-AP05: critical tier cannot be promoted further', () => {
    insertMemory(testDb, 1, { tier: 'critical', validationCount: 20 });
    const result = checkAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(false);
    expect(result.reason).toContain('tier_not_promotable');
  });

  it('R11-AP06: constitutional tier cannot be promoted', () => {
    insertMemory(testDb, 1, { tier: 'constitutional', validationCount: 100 });
    const result = checkAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(false);
    expect(result.reason).toContain('tier_not_promotable');
  });

  it('R11-AP07: executeAutoPromotion updates database', () => {
    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
    const result = executeAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(true);

    const row = testDb.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get();
    expect(row.importance_tier).toBe('important');
  });

  it('R11-AP08: executeAutoPromotion is no-op below threshold', () => {
    insertMemory(testDb, 1, { tier: 'normal', validationCount: 2 });
    const result = executeAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(false);

    const row = testDb.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get();
    expect(row.importance_tier).toBe('normal');
  });

  it('R11-AP09: does NOT demote - only promotes upward', () => {
    insertMemory(testDb, 1, { tier: 'critical', validationCount: 0 });
    const result = executeAutoPromotion(testDb, 1);
    expect(result.promoted).toBe(false);

    const row = testDb.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get();
    expect(row.importance_tier).toBe('critical');
  });

  it('R11-AP10: scanForPromotions finds eligible memories', () => {
    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
    insertMemory(testDb, 2, { tier: 'normal', validationCount: 2 });
    insertMemory(testDb, 3, { tier: 'important', validationCount: 10 });

    const eligible = scanForPromotions(testDb);
    expect(eligible.length).toBe(2);
  });

  it('R11-AP11: memory_not_found returns safe default', () => {
    const result = checkAutoPromotion(testDb, 9999);
    expect(result.promoted).toBe(false);
    expect(result.reason).toBe('memory_not_found');
  });

  it('R11-AP12: safeguards cap promotions to 3 per 8-hour rolling window', () => {
    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
    insertMemory(testDb, 2, { tier: 'normal', validationCount: 5 });
    insertMemory(testDb, 3, { tier: 'normal', validationCount: 5 });
    insertMemory(testDb, 4, { tier: 'normal', validationCount: 5 });

    const r1 = executeAutoPromotion(testDb, 1);
    const r2 = executeAutoPromotion(testDb, 2);
    const r3 = executeAutoPromotion(testDb, 3);
    const r4 = executeAutoPromotion(testDb, 4);

    expect(r1.promoted).toBe(true);
    expect(r2.promoted).toBe(true);
    expect(r3.promoted).toBe(true);
    expect(r4.promoted).toBe(false);
    expect(r4.reason).toContain('promotion_window_rate_limited');
    expect(r4.reason).toContain(`${MAX_PROMOTIONS_PER_WINDOW}`);
    expect(r4.reason).toContain(`${PROMOTION_WINDOW_HOURS}h`);
  });

  it('R11-AP13: old promotions outside the 8-hour window do not block promotion', () => {
    // Create audit table and seed historical promotion events outside the rolling window.
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_promotion_audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER NOT NULL,
        previous_tier TEXT NOT NULL,
        new_tier TEXT NOT NULL,
        validation_count INTEGER NOT NULL,
        promoted_at INTEGER NOT NULL
      )
    `);

    const oldTs = Date.now() - PROMOTION_WINDOW_MS - 1_000;
    for (let i = 0; i < MAX_PROMOTIONS_PER_WINDOW; i++) {
      testDb.prepare(`
        INSERT INTO memory_promotion_audit
          (memory_id, previous_tier, new_tier, validation_count, promoted_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(100 + i, 'normal', 'important', 5, oldTs);
    }

    insertMemory(testDb, 5, { tier: 'normal', validationCount: 5 });
    const result = executeAutoPromotion(testDb, 5);
    expect(result.promoted).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   9. NEGATIVE FEEDBACK TESTS (T002b / A4)
   ──────────────────────────────────────────────────────────────── */

describe('Negative Feedback Confidence Signal (T002b / A4)', () => {
  it('R11-NF01: no negatives -> multiplier is 1.0', () => {
    const multiplier = computeConfidenceMultiplier(0);
    expect(multiplier).toBe(CONFIDENCE_MULTIPLIER_BASE);
  });

  it('R11-NF02: each negative reduces multiplier by 0.1', () => {
    const m1 = computeConfidenceMultiplier(1, Date.now());
    expect(m1).toBeCloseTo(0.9, 2);

    const m2 = computeConfidenceMultiplier(2, Date.now());
    expect(m2).toBeCloseTo(0.8, 2);

    const m3 = computeConfidenceMultiplier(3, Date.now());
    expect(m3).toBeCloseTo(0.7, 2);
  });

  it('R11-NF03: multiplier floor at 0.3 (Safeguard)', () => {
    const multiplier = computeConfidenceMultiplier(100, Date.now());
    expect(multiplier).toBe(CONFIDENCE_MULTIPLIER_FLOOR);
    expect(multiplier).toBe(0.3);
  });

  it('R11-NF04: 7 negatives hits floor exactly', () => {
    // 1.0 - 7 * 0.1 = 0.3 (the floor)
    const multiplier = computeConfidenceMultiplier(7, Date.now());
    expect(multiplier).toBe(CONFIDENCE_MULTIPLIER_FLOOR);
  });

  it('R11-NF05: time-based recovery (30-day half-life)', () => {
    // 3 negatives, recent: 1.0 - 0.3 = 0.7
    const recent = computeConfidenceMultiplier(3, Date.now());
    expect(recent).toBeCloseTo(0.7, 2);

    // 3 negatives, 30 days ago: penalty halved (0.3 * 0.5 = 0.15), so 1.0 - 0.15 = 0.85
    const thirtyDaysAgo = Date.now() - RECOVERY_HALF_LIFE_MS;
    const recovered = computeConfidenceMultiplier(3, thirtyDaysAgo);
    expect(recovered).toBeCloseTo(0.85, 2);
  });

  it('R11-NF06: very old negatives nearly fully recovered', () => {
    // 5 negatives from 90 days ago (3 half-lives)
    // Penalty: 0.5 * 2^(-3) = 0.5 * 0.125 = 0.0625
    // Multiplier: 1.0 - 0.0625 = 0.9375
    const ninetyDaysAgo = Date.now() - 3 * RECOVERY_HALF_LIFE_MS;
    const multiplier = computeConfidenceMultiplier(5, ninetyDaysAgo);
    expect(multiplier).toBeGreaterThan(0.9);
  });

  it('R11-NF07: applyNegativeFeedback reduces score', () => {
    const originalScore = 0.8;
    const adjusted = applyNegativeFeedback(originalScore, 3, Date.now());
    expect(adjusted).toBeLessThan(originalScore);
    expect(adjusted).toBeCloseTo(0.8 * 0.7, 2);
  });

  it('R11-NF08: applyNegativeFeedback floor at score * 0.3', () => {
    const originalScore = 0.8;
    const adjusted = applyNegativeFeedback(originalScore, 100, Date.now());
    expect(adjusted).toBeCloseTo(originalScore * CONFIDENCE_MULTIPLIER_FLOOR, 2);
    expect(adjusted).toBeCloseTo(0.24, 2);
  });

  it('R11-NF09: applyNegativeFeedback with zero negatives returns original', () => {
    const score = 0.75;
    const adjusted = applyNegativeFeedback(score, 0);
    expect(adjusted).toBe(score);
  });

  it('R11-NF10: no lastNegativeAt -> no recovery decay applied', () => {
    // Without lastNegativeAt, full penalty is applied (no decay)
    const withoutTime = computeConfidenceMultiplier(3);
    const withRecentTime = computeConfidenceMultiplier(3, Date.now());

    // Both should show the same raw penalty (no recovery)
    expect(withoutTime).toBeCloseTo(0.7, 2);
    expect(withRecentTime).toBeCloseTo(0.7, 2);
  });

  it('R11-NF11: constants are correct values', () => {
    expect(CONFIDENCE_MULTIPLIER_BASE).toBe(1.0);
    expect(CONFIDENCE_MULTIPLIER_FLOOR).toBe(0.3);
    expect(NEGATIVE_PENALTY_PER_VALIDATION).toBe(0.1);
  });
});

/* ───────────────────────────────────────────────────────────────
   10. INTEGRATION: FTS5 ISOLATION ACROSS ALL OPERATIONS
   ──────────────────────────────────────────────────────────────── */

describe('FTS5 Isolation Integration (CRITICAL)', () => {
  let testDb: any;
  let testDbPath: string;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    const setup = createTestDb();
    testDb = setup.db;
    testDbPath = setup.path;
    migrateLearnedTriggers(testDb);
    insertMemory(testDb, 1, { title: 'FTS5 Test Memory' });

    process.env[FEATURE_FLAG] = 'true';
    process.env.SPECKIT_LEARN_FROM_SELECTION_START = String(Date.now() - 8 * 24 * 60 * 60 * 1000);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    try {
      if (testDb) testDb.close();
      if (testDbPath && fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    } catch { /* ignore */ }
  });

  it('R11-FTS01: learned_triggers NOT in FTS5 after migration', () => {
    expect(verifyFts5Isolation(testDb)).toBe(true);
  });

  it('R11-FTS02: learned_triggers NOT in FTS5 after applying triggers', () => {
    applyLearnedTriggers(1, ['authentication', 'security'], testDb, 'test');
    expect(verifyFts5Isolation(testDb)).toBe(true);
  });

  it('R11-FTS03: learned_triggers NOT in FTS5 after recordSelection', () => {
    recordSelection('q-fts', 1, ['authentication'], 5, testDb);
    expect(verifyFts5Isolation(testDb)).toBe(true);
  });

  it('R11-FTS04: learned_triggers NOT in FTS5 after expiry', () => {
    applyLearnedTriggers(1, ['authentication'], testDb, 'test');
    expireLearnedTerms(testDb);
    expect(verifyFts5Isolation(testDb)).toBe(true);
  });

  it('R11-FTS05: learned_triggers NOT in FTS5 after rollback', () => {
    applyLearnedTriggers(1, ['authentication'], testDb, 'test');
    clearAllLearnedTriggers(testDb);
    expect(verifyFts5Isolation(testDb)).toBe(true);
  });
});
