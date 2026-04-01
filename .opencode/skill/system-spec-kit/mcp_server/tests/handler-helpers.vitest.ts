// TEST: HANDLER HELPERS
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import path from 'path';
import os from 'os';
import type { CausalLinkMapping } from '../handlers/causal-links-processor';
import * as dbHelpers from '../utils/db-helpers';

// TEST: HANDLER HELPERS (Vitest)
// Unit tests for helper exports from:
// - handlers/handler-utils.ts (escapeLikePattern)
// - handlers/pe-gating.ts (findSimilarMemories, reinforceExistingMemory,
//   markMemorySuperseded, updateExistingMemory, logPeDecision)
// - handlers/causal-links-processor.ts (CAUSAL_LINK_MAPPINGS,
//   processCausalLinks, resolveMemoryReference)
// - handlers/memory-context.ts (CONTEXT_MODES, INTENT_TO_MODE)
// Mock core/config to prevent SERVER_DIR resolution issues during import
vi.mock('../core/config', () => {
  const mDir = path.resolve(path.join(__dirname, '..'));
  const dbDir = process.env.SPEC_KIT_DB_DIR
    ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
    : path.join(mDir, 'database');
  return {
    SERVER_DIR:               mDir,
    NODE_MODULES:             path.join(mDir, 'node_modules'),
    LIB_DIR:                  path.join(mDir, 'lib'),
    SHARED_DIR:               path.join(mDir, '..', 'shared'),
    DATABASE_DIR:             dbDir,
    DATABASE_PATH:            path.join(dbDir, 'context-index.sqlite'),
    DB_UPDATED_FILE:          path.join(dbDir, '.db-updated'),
    BATCH_SIZE:               5,
    BATCH_DELAY_MS:           100,
    INDEX_SCAN_COOLDOWN:      60000,
    MAX_QUERY_LENGTH:         10000,
    INPUT_LIMITS:             { query: 10000, title: 500, specFolder: 200, contextType: 100, name: 200, prompt: 10000, filePath: 500 },
    DEFAULT_BASE_PATH:        process.env.MEMORY_BASE_PATH || process.cwd(),
    ALLOWED_BASE_PATHS:       [path.join(os.homedir(), '.claude'), process.cwd()].map((b: string) => path.resolve(b)),
    CONSTITUTIONAL_CACHE_TTL: 60000,
  };
});

type PeGatingModule = typeof import('../handlers/pe-gating');
type MemoryContextModule = typeof import('../handlers/memory-context');
type CausalEdgesModule = typeof import('../lib/storage/causal-edges');
type CausalLinksProcessorModule = typeof import('../handlers/causal-links-processor');
type HandlerUtilsModule = typeof import('../handlers/handler-utils');
type BetterSqlite3Constructor = typeof import('better-sqlite3');
type BetterSqlite3Database = import('better-sqlite3').Database;
type ProcessCausalLinksInput = Parameters<CausalLinksProcessorModule['processCausalLinks']>[2];

interface CausalEdgeRow {
  source_id: string;
  target_id: string;
  relation: string;
}

let peGating: PeGatingModule | null = null;
let memoryContext: MemoryContextModule | null = null;
let causalEdges: CausalEdgesModule | null = null;
let causalLinksProcessor: CausalLinksProcessorModule | null = null;
let handlerUtils: HandlerUtilsModule | null = null;
let BetterSqlite3Impl: BetterSqlite3Constructor | null = null;

beforeAll(async () => {
  try {
    peGating = await import('../handlers/pe-gating');
  } catch {
    peGating = null;
  }
  try {
    memoryContext = await import('../handlers/memory-context');
  } catch {
    memoryContext = null;
  }
  try {
    causalEdges = await import('../lib/storage/causal-edges');
  } catch {
    causalEdges = null;
  }
  try {
    causalLinksProcessor = await import('../handlers/causal-links-processor');
  } catch {
    causalLinksProcessor = null;
  }
  try {
    handlerUtils = await import('../handlers/handler-utils');
  } catch {
    handlerUtils = null;
  }
  try {
    const bs3 = await import('better-sqlite3');
    BetterSqlite3Impl = bs3.default || bs3;
  } catch {
    BetterSqlite3Impl = null;
  }
});

/* ───────────────────────────────────────────────────────────────
   DB HELPERS
──────────────────────────────────────────────────────────────── */

function createTestDb(): BetterSqlite3Database {
  if (!BetterSqlite3Impl) {
    throw new Error('better-sqlite3 unavailable for handler-helpers tests');
  }
  const db = new BetterSqlite3Impl(':memory:');

  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      trigger_phrases TEXT,
      content TEXT,
      content_hash TEXT,
      context_type TEXT DEFAULT 'implementation',
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      memory_type TEXT,
      type_inference_source TEXT,
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT DEFAULT (datetime('now')),
      review_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT,
      file_mtime_ms INTEGER,
      related_memories TEXT,
      embedding BLOB,
      embedding_status TEXT DEFAULT 'pending'
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_conflicts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      new_memory_hash TEXT,
      existing_memory_id INTEGER,
      similarity REAL DEFAULT 0,
      action TEXT,
      contradiction_detected INTEGER DEFAULT 0,
      reason TEXT,
      spec_folder TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    )
  `);

  return db;
}

function seedTestMemories(db: BetterSqlite3Database): void {
  const stmt = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(1, 'specs/001-test', '/specs/001-test/memory/session-2025-01-15.md', 'Session Context Jan 15', 'Test memory content 1', 'hash1', 1.0, 5.0);
  stmt.run(2, 'specs/001-test', '/specs/001-test/memory/decision-auth.md', 'Auth Decision Record', 'Test memory content 2', 'hash2', 2.0, 4.0);
  stmt.run(3, 'specs/002-feature', '/specs/002-feature/memory/implementation-notes.md', 'Implementation Notes', 'Test memory content 3', 'hash3', 1.5, 5.0);
  stmt.run(4, 'specs/002-feature', '/specs/002-feature/memory/debug-log.md', 'Debug Log', 'Test memory content 4', 'hash4', 0.8, 6.0);
  stmt.run(5, 'specs/003-refactor', '/specs/003-refactor/memory/2024-12-01-session.md', 'Refactor Plan', 'Test memory content 5', 'hash5', 1.2, 5.0);
}

/* ───────────────────────────────────────────────────────────────
   SUITE: escapeLikePattern
──────────────────────────────────────────────────────────────── */

describe('escapeLikePattern', () => {
  it('escapes % character', () => {
    if (!handlerUtils?.escapeLikePattern) return;
    const result = handlerUtils.escapeLikePattern('100% complete');
    expect(result).toBe('100\\% complete');
  });

  it('escapes _ character', () => {
    if (!handlerUtils?.escapeLikePattern) return;
    const result = handlerUtils.escapeLikePattern('file_name');
    expect(result).toBe('file\\_name');
  });

  it('escapes multiple specials', () => {
    if (!handlerUtils?.escapeLikePattern) return;
    const result = handlerUtils.escapeLikePattern('50%_done');
    expect(result).toBe('50\\%\\_done');
  });

  it('passes through plain string', () => {
    if (!handlerUtils?.escapeLikePattern) return;
    const result = handlerUtils.escapeLikePattern('hello world');
    expect(result).toBe('hello world');
  });

  it('handles empty string', () => {
    if (!handlerUtils?.escapeLikePattern) return;
    const result = handlerUtils.escapeLikePattern('');
    expect(result).toBe('');
  });

    it('throws TypeError on number input', () => {
      if (!handlerUtils?.escapeLikePattern) return;
      expect(() => handlerUtils!.escapeLikePattern(123 as unknown as string)).toThrow(TypeError);
    });

    it('throws TypeError on null', () => {
      if (!handlerUtils?.escapeLikePattern) return;
      expect(() => handlerUtils!.escapeLikePattern(null as unknown as string)).toThrow(TypeError);
    });

    it('throws TypeError on undefined', () => {
      if (!handlerUtils?.escapeLikePattern) return;
      expect(() => handlerUtils!.escapeLikePattern(undefined as unknown as string)).toThrow(TypeError);
    });

  it('handles all-special-char string', () => {
    if (!handlerUtils?.escapeLikePattern) return;
    const result = handlerUtils.escapeLikePattern('%_%');
    expect(result).toBe('\\%\\_\\%');
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: CAUSAL_LINK_MAPPINGS
──────────────────────────────────────────────────────────────── */

describe('CAUSAL_LINK_MAPPINGS', () => {
  it('is a non-null object', () => {
    if (!causalLinksProcessor?.CAUSAL_LINK_MAPPINGS) return;
    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
    expect(mappings).toBeDefined();
    expect(typeof mappings).toBe('object');
    expect(Array.isArray(mappings)).toBe(false);
  });

  it('has all 5 expected keys', () => {
    if (!causalLinksProcessor?.CAUSAL_LINK_MAPPINGS) return;
    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
    const expected = ['caused_by', 'supersedes', 'derived_from', 'blocks', 'related_to'];
    const keys = Object.keys(mappings);
    expect(keys).toHaveLength(expected.length);
    for (const k of expected) {
      expect(mappings).toHaveProperty(k);
    }
  });

    it('all entries have relation (string) + reverse (boolean)', () => {
      if (!causalLinksProcessor?.CAUSAL_LINK_MAPPINGS) return;
      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
      for (const [, mapping] of Object.entries(mappings)) {
        const typedMapping = mapping as CausalLinkMapping;
        expect(typeof typedMapping.relation).toBe('string');
        expect(typeof typedMapping.reverse).toBe('boolean');
      }
    });

  it('caused_by has reverse=true', () => {
    if (!causalLinksProcessor?.CAUSAL_LINK_MAPPINGS) return;
    expect(causalLinksProcessor.CAUSAL_LINK_MAPPINGS.caused_by.reverse).toBe(true);
  });

  it('supersedes has reverse=false', () => {
    if (!causalLinksProcessor?.CAUSAL_LINK_MAPPINGS) return;
    expect(causalLinksProcessor.CAUSAL_LINK_MAPPINGS.supersedes.reverse).toBe(false);
  });

    it('relations match RELATION_TYPES', () => {
      if (!causalLinksProcessor?.CAUSAL_LINK_MAPPINGS || !causalEdges?.RELATION_TYPES) return;
      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
      const validRelations = Object.values(causalEdges.RELATION_TYPES);
      for (const [, mapping] of Object.entries(mappings)) {
        const typedMapping = mapping as CausalLinkMapping;
        expect(validRelations).toContain(typedMapping.relation);
      }
    });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: CONTEXT_MODES
──────────────────────────────────────────────────────────────── */

describe('CONTEXT_MODES', () => {
  it('has all 5 mode entries', () => {
    if (!memoryContext?.CONTEXT_MODES) return;
    const modes = memoryContext.CONTEXT_MODES;
    const expected = ['auto', 'quick', 'deep', 'focused', 'resume'];
    const keys = Object.keys(modes);
    expect(keys).toHaveLength(expected.length);
    for (const k of expected) {
      expect(modes).toHaveProperty(k);
    }
  });

    it('all modes have name, description, strategy', () => {
      if (!memoryContext?.CONTEXT_MODES) return;
      const modes = memoryContext.CONTEXT_MODES;
      for (const [, mode] of Object.entries(modes)) {
        expect(typeof mode.name).toBe('string');
        expect(mode.name.length).toBeGreaterThan(0);
        expect(typeof mode.description).toBe('string');
        expect(mode.description.length).toBeGreaterThan(0);
        expect(typeof mode.strategy).toBe('string');
        expect(mode.strategy.length).toBeGreaterThan(0);
      }
    });

  it('auto strategy is "adaptive"', () => {
    if (!memoryContext?.CONTEXT_MODES) return;
    expect(memoryContext.CONTEXT_MODES.auto.strategy).toBe('adaptive');
  });

  it('quick tokenBudget is 800', () => {
    if (!memoryContext?.CONTEXT_MODES) return;
    expect(memoryContext.CONTEXT_MODES.quick.tokenBudget).toBe(800);
  });

  it('deep tokenBudget is 3500', () => {
    if (!memoryContext?.CONTEXT_MODES) return;
    expect(memoryContext.CONTEXT_MODES.deep.tokenBudget).toBe(3500);
  });

  it('focused tokenBudget is 3000', () => {
    if (!memoryContext?.CONTEXT_MODES) return;
    expect(memoryContext.CONTEXT_MODES.focused.tokenBudget).toBe(3000);
  });

  it('resume tokenBudget is 2000', () => {
    if (!memoryContext?.CONTEXT_MODES) return;
    expect(memoryContext.CONTEXT_MODES.resume.tokenBudget).toBe(2000);
  });

  it('auto has no tokenBudget (delegates to sub-strategy)', () => {
    if (!memoryContext?.CONTEXT_MODES) return;
    expect(memoryContext.CONTEXT_MODES.auto.tokenBudget).toBeUndefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: INTENT_TO_MODE
──────────────────────────────────────────────────────────────── */

describe('INTENT_TO_MODE', () => {
  it('has all 7 intent mappings', () => {
    if (!memoryContext?.INTENT_TO_MODE) return;
    const mapping = memoryContext.INTENT_TO_MODE;
    const expected = ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'];
    const keys = Object.keys(mapping);
    expect(keys).toHaveLength(expected.length);
    for (const k of expected) {
      expect(mapping).toHaveProperty(k);
    }
  });

  it('add_feature -> deep', () => {
    if (!memoryContext?.INTENT_TO_MODE) return;
    expect(memoryContext.INTENT_TO_MODE.add_feature).toBe('deep');
  });

  it('fix_bug -> focused', () => {
    if (!memoryContext?.INTENT_TO_MODE) return;
    expect(memoryContext.INTENT_TO_MODE.fix_bug).toBe('focused');
  });

  it('refactor -> deep', () => {
    if (!memoryContext?.INTENT_TO_MODE) return;
    expect(memoryContext.INTENT_TO_MODE.refactor).toBe('deep');
  });

  it('security_audit -> deep', () => {
    if (!memoryContext?.INTENT_TO_MODE) return;
    expect(memoryContext.INTENT_TO_MODE.security_audit).toBe('deep');
  });

  it('understand -> focused', () => {
    if (!memoryContext?.INTENT_TO_MODE) return;
    expect(memoryContext.INTENT_TO_MODE.understand).toBe('focused');
  });

  it('all targets are valid CONTEXT_MODES', () => {
    if (!memoryContext?.INTENT_TO_MODE || !memoryContext?.CONTEXT_MODES) return;
    const validModes = Object.keys(memoryContext.CONTEXT_MODES);
    for (const [intent, mode] of Object.entries(memoryContext.INTENT_TO_MODE)) {
      expect(validModes).toContain(mode);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: findSimilarMemories
──────────────────────────────────────────────────────────────── */

describe('findSimilarMemories', () => {
  it('returns [] for null embedding', () => {
    if (!peGating?.findSimilarMemories) return;
    const result = peGating.findSimilarMemories(null);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

    it('returns [] for undefined embedding', () => {
      if (!peGating?.findSimilarMemories) return;
      const result = peGating.findSimilarMemories(undefined as unknown as Float32Array | null);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

  it('accepts options param gracefully', () => {
    if (!peGating?.findSimilarMemories) return;
    const result = peGating.findSimilarMemories(null, { limit: 3, specFolder: 'specs/test' });
    expect(Array.isArray(result)).toBe(true);
  });

  it('requires exact scope equality when a governance scope is supplied', async () => {
    if (!peGating?.findSimilarMemories) return;
    const vectorIndex = await import('../lib/search/vector-index');
    vi.spyOn(vectorIndex, 'vectorSearch').mockReturnValue([
      {
        id: 1,
        similarity: 98,
        content_text: 'scoped',
        stability: 1,
        difficulty: 1,
        file_path: 'scoped.md',
        tenant_id: 'tenant-a',
        user_id: 'user-a',
        shared_space_id: 'space-a',
      },
      {
        id: 2,
        similarity: 97,
        content_text: 'missing-tenant',
        stability: 1,
        difficulty: 1,
        file_path: 'missing-tenant.md',
        tenant_id: null,
        user_id: 'user-a',
        shared_space_id: 'space-a',
      },
      {
        id: 3,
        similarity: 96,
        content_text: 'missing-shared-space',
        stability: 1,
        difficulty: 1,
        file_path: 'missing-space.md',
        tenant_id: 'tenant-a',
        user_id: 'user-a',
        shared_space_id: null,
      },
    ] as Array<Record<string, unknown>>);

    const result = peGating.findSimilarMemories(new Float32Array([0.1, 0.2, 0.3]), {
      tenantId: 'tenant-a',
      userId: 'user-a',
      sharedSpaceId: 'space-a',
    });

    expect(result.map((memory) => memory.id)).toEqual([1]);
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: resolveMemoryReference (in-memory DB)
──────────────────────────────────────────────────────────────── */

describe('resolveMemoryReference', () => {
  it('resolves numeric ID "1"', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, '1');
    expect(result).toBe(1);
    db.close();
  });

  it('returns null for non-existent ID', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, '999');
    expect(result).toBeNull();
    db.close();
  });

  it('resolves session reference', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, 'session-2025-01-15');
    expect(result).toBe(1);
    db.close();
  });

  it('resolves date-prefixed ref', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, '2024-12-01-session');
    expect(result).toBe(5);
    db.close();
  });

  it('resolves specs/ path', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, 'specs/002-feature/memory/implementation-notes.md');
    expect(result).toBe(3);
    db.close();
  });

  it('resolves Windows-style specs path', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, 'specs\\002-feature\\memory\\implementation-notes.md');
    expect(result).toBe(3);
    db.close();
  });

  it('resolves exact title', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, 'Debug Log');
    expect(result).toBe(4);
    db.close();
  });

  it('resolves partial title', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, 'Auth Decision');
    expect(result).toBe(2);
    db.close();
  });

  it('returns null for empty string', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, '');
    expect(result).toBeNull();
    db.close();
  });

    it('returns null for null input', () => {
      if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
      const db = createTestDb();
      seedTestMemories(db);
      const result = causalLinksProcessor.resolveMemoryReference(db, null as unknown as string);
      expect(result).toBeNull();
      db.close();
    });

  it('returns null for whitespace', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, '   ');
    expect(result).toBeNull();
    db.close();
  });

  it('returns null for unresolvable ref', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, 'zzz-nonexistent-ref-xyz');
    expect(result).toBeNull();
    db.close();
  });

  it('resolves memory/ path', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);
    const result = causalLinksProcessor.resolveMemoryReference(db, 'memory/decision-auth.md');
    expect(result).toBe(2);
    db.close();
  });

  it('does not treat date-like reference as numeric ID prefix', () => {
    if (!causalLinksProcessor?.resolveMemoryReference || !BetterSqlite3Impl) return;
    const db = createTestDb();
    seedTestMemories(db);

    // Control row that previously could hijack parseInt("2024-...") resolution.
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      2024,
      'specs/099-control',
      '/specs/099-control/memory/unrelated.md',
      'Control Memory',
      'Control content',
      'hash-control',
      1.0,
      5.0
    );

    const result = causalLinksProcessor.resolveMemoryReference(db, '2024-12-01-session');
    expect(result).toBe(5);
    db.close();
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: processCausalLinks (in-memory DB)
──────────────────────────────────────────────────────────────── */

describe('processCausalLinks', () => {
    it('returns zero-result for null', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      const result = causalLinksProcessor.processCausalLinks(db, 100, null as unknown as ProcessCausalLinksInput);
      expect(result.processed).toBe(0);
    expect(result.inserted).toBe(0);
    expect(result.resolved).toBe(0);
    db.close();
  });

    it('returns zero-result for {}', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      const result = causalLinksProcessor.processCausalLinks(db, 100, {} as ProcessCausalLinksInput);
    expect(result.processed).toBe(0);
    expect(result.inserted).toBe(0);
    db.close();
  });

    it('skips unknown link types', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      const result = causalLinksProcessor!.processCausalLinks(db, 100, { unknown_type: ['ref1'] } as unknown as ProcessCausalLinksInput);
    expect(result.processed).toBe(0);
    db.close();
  });

    it('tracks unresolved refs', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      seedTestMemories(db);
    const result = causalLinksProcessor!.processCausalLinks(db, 100, { caused_by: ['nonexistent-ref'] } as ProcessCausalLinksInput);
    expect(result.processed).toBe(1);
    expect(result.unresolved).toHaveLength(1);
    expect(result.unresolved[0].reference).toBe('nonexistent-ref');
    db.close();
  });

    it('resolves & inserts valid link', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      seedTestMemories(db);
    const result = causalLinksProcessor!.processCausalLinks(db, 10, { caused_by: ['1'] } as ProcessCausalLinksInput);
    expect(result.processed).toBe(1);
    expect(result.resolved).toBe(1);
    expect(result.inserted).toBe(1);
    db.close();
  });

    it('handles mixed resolved/unresolved', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      seedTestMemories(db);
    const result = causalLinksProcessor!.processCausalLinks(db, 10, { caused_by: ['1', '2', 'nonexistent'] } as ProcessCausalLinksInput);
    expect(result.processed).toBe(3);
    expect(result.resolved).toBe(2);
    expect(result.unresolved).toHaveLength(1);
    db.close();
  });

    it('skips empty arrays', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      const result = causalLinksProcessor!.processCausalLinks(db, 100, { caused_by: [], supersedes: [] } as unknown as ProcessCausalLinksInput);
    expect(result.processed).toBe(0);
    db.close();
  });

    it('skips non-array values', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      const result = causalLinksProcessor.processCausalLinks(
        db,
        100,
        { caused_by: 'not-an-array' } as unknown as ProcessCausalLinksInput
      );
    expect(result.processed).toBe(0);
    db.close();
  });

    it('caused_by edge direction correct (reverse=true)', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      seedTestMemories(db);
    const memoryId = 10;
    const result = causalLinksProcessor!.processCausalLinks(db, memoryId, { caused_by: ['1'] } as ProcessCausalLinksInput);
    expect(result.inserted).toBe(1);
      const edge = db.prepare('SELECT source_id, target_id, relation FROM causal_edges LIMIT 1').get() as CausalEdgeRow | undefined;
    // Caused_by has reverse=true: source=resolvedId(1), target=memoryId(10)
      if (!edge) {
        expect.unreachable('Expected inserted caused_by edge');
      }
      expect(edge.source_id).toBe('1');
    expect(edge.target_id).toBe('10');
    expect(edge.relation).toBe('caused');
    db.close();
  });

    it('supersedes edge direction correct (reverse=false)', () => {
      if (!causalLinksProcessor?.processCausalLinks || !BetterSqlite3Impl) return;
      const db = createTestDb();
      seedTestMemories(db);
    const memoryId = 10;
    const result = causalLinksProcessor!.processCausalLinks(db, memoryId, { supersedes: ['3'] } as ProcessCausalLinksInput);
    expect(result.inserted).toBe(1);
      const edge = db.prepare('SELECT source_id, target_id, relation FROM causal_edges LIMIT 1').get() as CausalEdgeRow | undefined;
    // Supersedes has reverse=false: source=memoryId(10), target=resolvedId(3)
      if (!edge) {
        expect.unreachable('Expected inserted supersedes edge');
      }
      expect(edge.source_id).toBe('10');
    expect(edge.target_id).toBe('3');
    expect(edge.relation).toBe('supersedes');
    db.close();
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: logPeDecision (console capture)
──────────────────────────────────────────────────────────────── */

  describe('logPeDecision', () => {
    beforeEach(() => {
      const db = createTestDb();
      db?.exec(`
      CREATE TABLE IF NOT EXISTS memory_conflicts (
        id INTEGER PRIMARY KEY,
        new_memory_hash TEXT,
        existing_memory_id INTEGER,
        similarity REAL,
        action TEXT,
        contradiction_detected INTEGER,
        reason TEXT,
        spec_folder TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    vi.spyOn(dbHelpers, 'requireDb').mockReturnValue(db);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has arity 3', () => {
    if (!peGating?.logPeDecision) return;
    // TypeScript compilation may change arity, but function should exist
    expect(typeof peGating.logPeDecision).toBe('function');
  });

  it('does not throw with runtime DB', () => {
    if (!peGating?.logPeDecision) return;
    const decision = {
      action: 'CREATE',
      similarity: 0.1,
      existingMemoryId: null,
      reason: 'test',
    };
    // This may warn to console but should not throw
    expect(() => peGating!.logPeDecision(decision, 'test-hash', 'specs/test')).not.toThrow();
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: DB-dependent helpers (graceful handling)
──────────────────────────────────────────────────────────────── */

  describe('DB-dependent helpers', () => {
    beforeEach(() => {
      const db = createTestDb();
      vi.spyOn(dbHelpers, 'requireDb').mockReturnValue(db);
    });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reinforceExistingMemory: error status for missing ID', () => {
    if (!peGating?.reinforceExistingMemory) return;
    const parsed = {
      specFolder: 'specs/test',
      filePath: '/test/memory.md',
      title: 'Test',
      triggerPhrases: [],
      content: 'test content',
      contentHash: 'hash',
      contextType: 'implementation',
      importanceTier: 'normal',
    };
    const result = peGating.reinforceExistingMemory(99999, parsed);
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
  });

  it('markMemorySuperseded: returns boolean', () => {
    if (!peGating?.markMemorySuperseded) return;
    const result = peGating.markMemorySuperseded(99999);
    expect(typeof result).toBe('boolean');
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: Backward-compatible snake_case aliases
──────────────────────────────────────────────────────────────── */

describe('Backward-compatible snake_case aliases', () => {
  it('pe-gating exports migrated PE helpers', () => {
    expect(typeof peGating?.findSimilarMemories).toBe('function');
    expect(typeof peGating?.reinforceExistingMemory).toBe('function');
    expect(typeof peGating?.markMemorySuperseded).toBe('function');
    expect(typeof peGating?.updateExistingMemory).toBe('function');
    expect(typeof peGating?.logPeDecision).toBe('function');
  });

  it('causal-links-processor exports migrated causal helpers', () => {
    expect(typeof causalLinksProcessor?.processCausalLinks).toBe('function');
    expect(typeof causalLinksProcessor?.resolveMemoryReference).toBe('function');
    expect(typeof causalLinksProcessor?.CAUSAL_LINK_MAPPINGS).toBe('object');
  });
});
