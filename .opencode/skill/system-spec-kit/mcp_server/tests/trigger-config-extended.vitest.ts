import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import type { MemoryTypeConfig, MemoryTypeName } from '../lib/config/memory-types';
import type {
  CacheStats,
  ExecutionLogEntry,
  MemoryByPhrase,
  TriggerCacheEntry,
  TriggerMatcherDegradedState,
  TriggerMatchWithStats,
  TriggerMatcherConfig,
} from '../lib/parsing/trigger-matcher';

// TEST: TRIGGER-MATCHER + MEMORY-TYPES + TYPE-INFERENCE (extended)
// Covers previously untested exports across three modules.

/* ─────────────────────────────────────────────────────────────
   MODULE LOADING  (mock vector-index for trigger-matcher)
──────────────────────────────────────────────────────────────── */

type DatabaseModule = typeof import('better-sqlite3');
type DatabaseInstance = import('better-sqlite3').Database;
type TriggerMatcherModule = typeof import('../lib/parsing/trigger-matcher');

type InferenceSource =
  | 'frontmatter_explicit'
  | 'importance_tier'
  | 'file_path'
  | 'keywords'
  | 'default';

interface MockMemoryRow {
  id: number;
  spec_folder: string;
  file_path: string;
  title: string;
  trigger_phrases: string;
  importance_weight: number;
  embedding_status?: string;
}

interface VectorIndexMockExports {
  initializeDb: () => void;
  getDb: () => DatabaseInstance | null;
}

interface HalfLifeValidationResult {
  valid: boolean;
  errors: string[];
}

interface MemoryTypesModule {
  getValidTypes: () => MemoryTypeName[];
  isValidType: (type: string | null | undefined) => boolean;
  getTypeConfig: (type: string | null | undefined) => MemoryTypeConfig | null;
  getHalfLife: (type: string | null | undefined) => number | null;
  isDecayEnabled: (type: string | null | undefined) => boolean;
  getDefaultType: () => MemoryTypeName;
  getDefaultHalfLives: () => Record<MemoryTypeName, number | null>;
  validateHalfLifeConfig: (config: Record<string, unknown> | null | undefined) => HalfLifeValidationResult;
}

interface InferenceResult {
  type: MemoryTypeName;
  source: InferenceSource;
  confidence: number;
}

interface DetailedTypeSuggestion extends InferenceResult {
  explanation: string;
  typeConfig: MemoryTypeConfig;
}

interface TypeValidationResult {
  valid: boolean;
  warnings: string[];
}

interface BatchInferenceMemory {
  filePath?: string;
  file_path?: string;
  content?: string;
  title?: string;
  triggerPhrases?: string[] | string;
  importanceTier?: string | null;
  importance_tier?: string | null;
}

interface TypeInferenceModule {
  TIER_TO_TYPE_MAP: Readonly<Record<string, MemoryTypeName>>;
  inferMemoryTypesBatch: (memories: BatchInferenceMemory[]) => Map<string, InferenceResult>;
  getTypeSuggestionDetailed: (params: BatchInferenceMemory) => DetailedTypeSuggestion;
  validateInferredType: (inferredType: string, filePath: string | null | undefined) => TypeValidationResult;
}

const { dbHolder, mockInitializeDb, mockGetDb } = vi.hoisted(() => {
  const state = { current: null };
  return {
    dbHolder: state,
    mockInitializeDb: vi.fn(() => {}),
    mockGetDb: vi.fn(() => state.current),
  };
});

vi.mock('../lib/search/vector-index.js', () => ({
  initializeDb: mockInitializeDb,
  getDb: mockGetDb,
}));

const Database = require('better-sqlite3') as DatabaseModule;

// Create in-memory DB with the memory_index table trigger-matcher expects
function createMockDb(rows: MockMemoryRow[] = []): DatabaseInstance {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id              INTEGER PRIMARY KEY,
      spec_folder     TEXT NOT NULL,
      file_path       TEXT NOT NULL,
      title           TEXT,
      trigger_phrases TEXT,
      importance_weight REAL,
      embedding_status TEXT DEFAULT 'success'
    )
  `);
  const insert = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, trigger_phrases, importance_weight, embedding_status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const r of rows) {
    insert.run(r.id, r.spec_folder, r.file_path, r.title, r.trigger_phrases, r.importance_weight, r.embedding_status ?? 'success');
  }
  return db;
}

let mockDb: DatabaseInstance = createMockDb();
dbHolder.current = mockDb;

let triggerMatcher: TriggerMatcherModule;
let memoryTypes: MemoryTypesModule;
let typeInference: TypeInferenceModule;

function updateVectorIndexDb(db: DatabaseInstance): void {
  mockDb = db;
  dbHolder.current = mockDb;
  mockInitializeDb.mockImplementation(() => {});
  mockGetDb.mockImplementation(() => dbHolder.current as DatabaseInstance | null);
}

/** Helper: replace the mock DB and clear cache so trigger-matcher re-reads */
function setMockDb(rows: MockMemoryRow[]): void {
  updateVectorIndexDb(createMockDb(rows));
  if (triggerMatcher?.clearCache) triggerMatcher.clearCache();
}

/* ─────────────────────────────────────────────────────────────
   TEST SUITES
──────────────────────────────────────────────────────────────── */

describe('EXTENDED TESTS: trigger-matcher + memory-types + type-inference', () => {
  beforeAll(async () => {
    triggerMatcher = await import('../lib/parsing/trigger-matcher.js') as TriggerMatcherModule;
    memoryTypes = await import('../lib/config/memory-types.js') as MemoryTypesModule;
    typeInference = await import('../lib/config/type-inference.js') as TypeInferenceModule;
    updateVectorIndexDb(mockDb);
  });

  beforeEach(() => {
    updateVectorIndexDb(mockDb);
    triggerMatcher?.clearCache?.();
  });

  // --- --- 3. TRIGGER-MATCHER TESTS --- ---

  // ---------- 3.1 logExecutionTime ----------

  describe('logExecutionTime', () => {
    it('3.1.1 fast call returns PASS entry', () => {
      const fn = triggerMatcher.logExecutionTime;
      if (!fn) return; // skip if not exported
      const entry = fn('test_op', 10, { foo: 'bar' });
      expect(entry).toBeDefined();
      expect(entry!.operation).toBe('test_op');
      expect(entry!.durationMs).toBe(10);
      expect(entry!.target).toBe('PASS');
      expect(entry!.foo).toBe('bar');
    });

    it('3.1.2 slow call returns SLOW entry', () => {
      const fn = triggerMatcher.logExecutionTime;
      if (!fn) return;
      const entry = fn('slow_op', 200);
      expect(entry).toBeDefined();
      expect(entry!.target).toBe('SLOW');
    });

    it('3.1.3 includes ISO timestamp', () => {
      const fn = triggerMatcher.logExecutionTime;
      if (!fn) return;
      const entry = fn('ts_check', 5);
      expect(entry).toBeDefined();
      expect(typeof entry!.timestamp).toBe('string');
      expect(entry!.timestamp.length).toBeGreaterThan(0);
    });

    it('3.1.4 disabled returns undefined', () => {
      const fn = triggerMatcher.logExecutionTime;
      if (!fn) return;
      const origFlag = triggerMatcher.CONFIG.LOG_EXECUTION_TIME;
      triggerMatcher.CONFIG.LOG_EXECUTION_TIME = false;
      const entry = fn('disabled_op', 5);
      triggerMatcher.CONFIG.LOG_EXECUTION_TIME = origFlag;
      expect(entry).toBeUndefined();
    });

    it('3.1.5 extra details merged into entry', () => {
      const fn = triggerMatcher.logExecutionTime;
      if (!fn) return;
      const entry = fn('details_op', 1, { extra: 42, nested: { a: 1 } });
      expect(entry).toBeDefined();
      expect(entry!.extra).toBe(42);
    });
  });

  // ---------- 3.2 getCachedRegex (indirect) ----------

  describe('getCachedRegex (indirect via cache behavior)', () => {
    it('3.2.1 loading cache populates regex cache', () => {
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["alpha phrase","beta phrase"]', importance_weight: 0.5 },
      ]);
      triggerMatcher.loadTriggerCache();
      const stats = triggerMatcher.getCacheStats();
      expect(stats.regexCacheSize).toBeGreaterThanOrEqual(2);
    });

    it('3.2.2 cache entries have RegExp objects', () => {
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["test regex"]', importance_weight: 0.5 },
      ]);
      const cache = triggerMatcher.loadTriggerCache();
      expect(cache.length).toBeGreaterThanOrEqual(1);
      expect(cache[0].regex).toBeInstanceOf(RegExp);
    });

    it('3.2.3 regex word boundary works', () => {
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["save context"]', importance_weight: 0.5 },
      ]);
      const cache = triggerMatcher.loadTriggerCache();
      const regex = cache[0].regex;
      expect(regex.test(' save context ')).toBe(true);
      expect(regex.test('unsavecontext')).toBe(false);
    });

    it('3.2.4 LRU eviction at capacity', () => {
      triggerMatcher.clearCache();
      const origMax = triggerMatcher.CONFIG.MAX_REGEX_CACHE_SIZE;
      triggerMatcher.CONFIG.MAX_REGEX_CACHE_SIZE = 3;

      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["phrase one","phrase two","phrase three","phrase four","phrase five"]', importance_weight: 0.5 },
      ]);
      triggerMatcher.loadTriggerCache();
      const stats = triggerMatcher.getCacheStats();
      triggerMatcher.CONFIG.MAX_REGEX_CACHE_SIZE = origMax;

      expect(stats.regexCacheSize).toBeLessThanOrEqual(3);
    });

    it('3.2.5 clearCache resets regex cache to 0', () => {
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["some phrase"]', importance_weight: 0.5 },
      ]);
      triggerMatcher.loadTriggerCache();
      triggerMatcher.clearCache();
      const stats = triggerMatcher.getCacheStats();
      expect(stats.regexCacheSize).toBe(0);
    });
  });

  // ---------- 3.3 loadTriggerCache ----------

  describe('loadTriggerCache', () => {
    it('3.3.1 empty DB returns []', () => {
      const fn = triggerMatcher.loadTriggerCache;
      if (!fn) return;
      setMockDb([]);
      const cache = fn();
      expect(Array.isArray(cache)).toBe(true);
      expect(cache.length).toBe(0);
    });

    it('3.3.2 loads rows with valid trigger_phrases JSON', () => {
      const fn = triggerMatcher.loadTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 'specs/001', file_path: '/a.md', title: 'Test A', trigger_phrases: '["save context","memory"]', importance_weight: 0.8 },
        { id: 2, spec_folder: 'specs/002', file_path: '/b.md', title: 'Test B', trigger_phrases: '["debug"]', importance_weight: 0.6 },
      ]);
      const cache = fn();
      expect(cache.length).toBe(3);
    });

    it('3.3.3 skips rows with invalid JSON trigger_phrases', () => {
      const fn = triggerMatcher.loadTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: 'NOT_JSON', importance_weight: 0.5 },
        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T', trigger_phrases: '["valid"]', importance_weight: 0.5 },
      ]);
      const cache = fn();
      expect(cache.length).toBe(1);
      expect(cache[0].phrase).toBe('valid');
    });

    it('3.3.4 filters phrases shorter than MIN_PHRASE_LENGTH', () => {
      const fn = triggerMatcher.loadTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["ab","abc","a"]', importance_weight: 0.5 },
      ]);
      const cache = fn();
      expect(cache.length).toBe(1);
      expect(cache[0].phrase).toBe('abc');
    });

    it('3.3.4b filters single-word stopword trigger phrases', () => {
      const fn = triggerMatcher.loadTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["the","save context","debug"]', importance_weight: 0.5 },
      ]);
      const cache = fn();
      expect(cache.map((entry) => entry.phrase)).toEqual(['save context', 'debug']);
    });

    it('3.3.5 returns cached data within TTL', () => {
      const fn = triggerMatcher.loadTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["hello"]', importance_weight: 0.5 },
      ]);
      const cache1 = fn();
      // Swap DB without clearing cache
      const newDb = createMockDb([
        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T2', trigger_phrases: '["different"]', importance_weight: 0.5 },
      ]);
      updateVectorIndexDb(newDb);
      const cache2 = fn();
      expect(cache2.length).toBe(1);
      expect(cache2[0].phrase).toBe('hello');
    });

    it('3.3.6 skips non-success embedding_status', () => {
      const fn = triggerMatcher.loadTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["alpha"]', importance_weight: 0.5, embedding_status: 'success' },
        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T', trigger_phrases: '["beta"]', importance_weight: 0.5, embedding_status: 'pending' },
      ]);
      const cache = fn();
      expect(cache.length).toBe(1);
      expect(cache[0].phrase).toBe('alpha');
    });
  });

  // ---------- 3.4 matchTriggerPhrasesWithStats ----------

  describe('matchTriggerPhrasesWithStats', () => {
    it('3.4.1 returns {matches, stats}', () => {
      const fn = triggerMatcher.matchTriggerPhrasesWithStats;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["save context"]', importance_weight: 0.8 },
      ]);
      const result = fn('please save context now');
      expect(result).toBeDefined();
      expect(Array.isArray(result.matches)).toBe(true);
      expect(result.stats).toBeDefined();
      expect(typeof result.stats.promptLength).toBe('number');
    });

    it('3.4.2 stats reflect correct values', () => {
      const fn = triggerMatcher.matchTriggerPhrasesWithStats;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["save context","memory save"]', importance_weight: 0.8 },
        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T2', trigger_phrases: '["other phrase"]', importance_weight: 0.5 },
      ]);
      const result = fn('I need to save context and do memory save');
      const s = result.stats;
      expect(s.promptLength).toBeGreaterThan(0);
      expect(s.cacheSize).toBe(3);
      expect(s.matchCount).toBe(1);
      expect(s.totalMatchedPhrases).toBe(2);
    });

    it('3.4.3 returns degraded stats when source parsing fails', () => {
      const fn = triggerMatcher.matchTriggerPhrasesWithStats;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/bad.md', title: 'Bad', trigger_phrases: 'NOT_JSON', importance_weight: 0.5 },
        { id: 2, spec_folder: 's', file_path: '/good.md', title: 'Good', trigger_phrases: '["valid trigger"]', importance_weight: 0.7 },
      ]);
      const result = fn('valid trigger') as TriggerMatchWithStats & {
        stats: TriggerMatchWithStats['stats'] & { degraded?: TriggerMatcherDegradedState };
      };
      expect(result.stats.degraded?.code).toBe('E_TRIGGER_SOURCE_PARSE');
      expect(result.stats.degraded?.failedEntries).toBe(1);
    });

    it('3.4.4 empty prompt returns 0 matches', () => {
      const fn = triggerMatcher.matchTriggerPhrasesWithStats;
      if (!fn) return;
      const result = fn('');
      expect(result.matches.length).toBe(0);
      expect(result.stats.matchCount).toBe(0);
    });

    it('3.4.5 matchTimeMs is a non-negative number', () => {
      const fn = triggerMatcher.matchTriggerPhrasesWithStats;
      if (!fn) return;
      const result = fn('anything');
      expect(typeof result.stats.matchTimeMs).toBe('number');
      expect(result.stats.matchTimeMs).toBeGreaterThanOrEqual(0);
    });
  });

  // ---------- 3.5 getAllPhrases ----------

  describe('getAllPhrases', () => {
    it('3.5.1 empty DB returns []', () => {
      const fn = triggerMatcher.getAllPhrases;
      if (!fn) return;
      setMockDb([]);
      const phrases = fn();
      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases.length).toBe(0);
    });

    it('3.5.2 deduplicates across rows', () => {
      const fn = triggerMatcher.getAllPhrases;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["alpha","beta"]', importance_weight: 0.5 },
        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T', trigger_phrases: '["beta","gamma"]', importance_weight: 0.5 },
      ]);
      const phrases = fn();
      const sorted = [...phrases].sort();
      expect(sorted.length).toBe(3);
      expect(sorted[0]).toBe('alpha');
      expect(sorted[1]).toBe('beta');
      expect(sorted[2]).toBe('gamma');
    });

    it('3.5.3 returns lowercase phrases', () => {
      const fn = triggerMatcher.getAllPhrases;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["Hello World"]', importance_weight: 0.5 },
      ]);
      const phrases = fn();
      expect(phrases.length).toBe(1);
      expect(phrases[0]).toBe(phrases[0].toLowerCase());
    });
  });

  // ---------- 3.6 getMemoriesByPhrase ----------

  describe('getMemoriesByPhrase', () => {
    const sampleRows = [
      { id: 1, spec_folder: 'specs/001', file_path: '/a.md', title: 'Memory A', trigger_phrases: '["save context","memory"]', importance_weight: 0.8 },
      { id: 2, spec_folder: 'specs/002', file_path: '/b.md', title: 'Memory B', trigger_phrases: '["save context"]', importance_weight: 0.6 },
      { id: 3, spec_folder: 'specs/003', file_path: '/c.md', title: 'Memory C', trigger_phrases: '["different"]', importance_weight: 0.5 },
    ];

    it('3.6.1 finds 2 memories for "save context"', () => {
      const fn = triggerMatcher.getMemoriesByPhrase;
      if (!fn) return;
      setMockDb(sampleRows);
      const mems = fn('save context');
      expect(mems.length).toBe(2);
    });

    it('3.6.2 returns correct MemoryByPhrase structure', () => {
      const fn = triggerMatcher.getMemoriesByPhrase;
      if (!fn) return;
      setMockDb(sampleRows);
      const mems = fn('memory');
      expect(mems.length).toBe(1);
      expect(mems[0].memoryId).toBe(1);
      expect(mems[0].specFolder).toBe('specs/001');
      expect(mems[0].filePath).toBe('/a.md');
      expect(mems[0].title).toBe('Memory A');
      expect(typeof mems[0].importanceWeight).toBe('number');
    });

    it('3.6.3 no match returns []', () => {
      const fn = triggerMatcher.getMemoriesByPhrase;
      if (!fn) return;
      setMockDb(sampleRows);
      const mems = fn('nonexistent phrase xyz');
      expect(mems.length).toBe(0);
    });

    it('3.6.4 case-insensitive lookup', () => {
      const fn = triggerMatcher.getMemoriesByPhrase;
      if (!fn) return;
      setMockDb(sampleRows);
      const mems = fn('SAVE CONTEXT');
      expect(mems.length).toBe(2);
    });
  });

  // ---------- 3.7 refreshTriggerCache ----------

  describe('refreshTriggerCache', () => {
    it('3.7.1 forces reload with new data', () => {
      const fn = triggerMatcher.refreshTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["old phrase"]', importance_weight: 0.5 },
      ]);
      triggerMatcher.loadTriggerCache();

      const newDb = createMockDb([
        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T2', trigger_phrases: '["new phrase"]', importance_weight: 0.7 },
      ]);
      updateVectorIndexDb(newDb);

      const entries = fn();
      expect(entries.length).toBe(1);
      expect(entries[0].phrase).toBe('new phrase');
    });

    it('3.7.2 returns TriggerCacheEntry[]', () => {
      const fn = triggerMatcher.refreshTriggerCache;
      if (!fn) return;
      setMockDb([
        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["test"]', importance_weight: 0.5 },
      ]);
      const entries = fn();
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBe(1);
      expect(typeof entries[0].phrase).toBe('string');
      expect(entries[0].regex).toBeInstanceOf(RegExp);
    });
  });

  // --- --- 4. MEMORY-TYPES TESTS --- ---

  // ---------- 4.1 getValidTypes ----------

  describe('getValidTypes', () => {
    it('4.1.1 returns 9 types', () => {
      const fn = memoryTypes.getValidTypes;
      if (!fn) return;
      const types = fn();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBe(9);
    });

    it('4.1.2 returns fresh copy each call', () => {
      const fn = memoryTypes.getValidTypes;
      if (!fn) return;
      const t1 = fn();
      const t2 = fn();
      expect(t1).not.toBe(t2);
    });
  });

  // ---------- 4.2 isValidType ----------

  describe('isValidType', () => {
    it('4.2.1 known types return true', () => {
      const fn = memoryTypes.isValidType;
      if (!fn) return;
      expect(fn('episodic')).toBe(true);
      expect(fn('meta-cognitive')).toBe(true);
      expect(fn('working')).toBe(true);
    });

    it('4.2.2 unknown types return false', () => {
      const fn = memoryTypes.isValidType;
      if (!fn) return;
      expect(fn('nonexistent')).toBe(false);
      expect(fn('random')).toBe(false);
    });

    it('4.2.3 null/undefined/empty returns false', () => {
      const fn = memoryTypes.isValidType;
      if (!fn) return;
      expect(fn(null)).toBe(false);
      expect(fn(undefined)).toBe(false);
      expect(fn('')).toBe(false);
    });

    it('4.2.4 case-insensitive', () => {
      const fn = memoryTypes.isValidType;
      if (!fn) return;
      expect(fn('EPISODIC')).toBe(true);
      expect(fn('Meta-Cognitive')).toBe(true);
    });
  });

  // ---------- 4.3 getTypeConfig ----------

  describe('getTypeConfig', () => {
    it('4.3.1 returns config for valid type', () => {
      const fn = memoryTypes.getTypeConfig;
      if (!fn) return;
      const config = fn('working');
      expect(config).toBeDefined();
      expect(config!.halfLifeDays).toBe(1);
      expect(typeof config!.description).toBe('string');
      expect(config!.decayEnabled).toBe(true);
    });

    it('4.3.2 invalid type returns null', () => {
      const fn = memoryTypes.getTypeConfig;
      if (!fn) return;
      expect(fn('nonexistent')).toBeNull();
    });

    it('4.3.3 null/undefined returns null', () => {
      const fn = memoryTypes.getTypeConfig;
      if (!fn) return;
      expect(fn(null)).toBeNull();
      expect(fn(undefined)).toBeNull();
    });

    it('4.3.4 meta-cognitive has decayEnabled=false', () => {
      const fn = memoryTypes.getTypeConfig;
      if (!fn) return;
      const config = fn('meta-cognitive');
      expect(config).toBeDefined();
      expect(config!.decayEnabled).toBe(false);
      expect(config!.halfLifeDays).toBeNull();
    });
  });

  // ---------- 4.4 getHalfLife ----------

  describe('getHalfLife', () => {
    it('4.4.1 known types return correct values', () => {
      const fn = memoryTypes.getHalfLife;
      if (!fn) return;
      expect(fn('working')).toBe(1);
      expect(fn('episodic')).toBe(7);
      expect(fn('semantic')).toBe(180);
    });

    it('4.4.2 meta-cognitive returns null', () => {
      const fn = memoryTypes.getHalfLife;
      if (!fn) return;
      expect(fn('meta-cognitive')).toBeNull();
    });

    it('4.4.3 unknown type returns 60 (default)', () => {
      const fn = memoryTypes.getHalfLife;
      if (!fn) return;
      expect(fn('nonexistent')).toBe(60);
    });

    it('4.4.4 null/undefined returns 60', () => {
      const fn = memoryTypes.getHalfLife;
      if (!fn) return;
      expect(fn(null)).toBe(60);
      expect(fn(undefined)).toBe(60);
    });
  });

  // ---------- 4.5 isDecayEnabled ----------

  describe('isDecayEnabled', () => {
    it('4.5.1 decaying types return true', () => {
      const fn = memoryTypes.isDecayEnabled;
      if (!fn) return;
      expect(fn('working')).toBe(true);
      expect(fn('episodic')).toBe(true);
      expect(fn('semantic')).toBe(true);
    });

    it('4.5.2 meta-cognitive returns false', () => {
      const fn = memoryTypes.isDecayEnabled;
      if (!fn) return;
      expect(fn('meta-cognitive')).toBe(false);
    });

    it('4.5.3 invalid/null defaults to true', () => {
      const fn = memoryTypes.isDecayEnabled;
      if (!fn) return;
      expect(fn('nonexistent')).toBe(true);
      expect(fn(null)).toBe(true);
    });
  });

  // ---------- 4.6 getDefaultType ----------

  describe('getDefaultType', () => {
    it('4.6.1 returns "declarative"', () => {
      const fn = memoryTypes.getDefaultType;
      if (!fn) return;
      expect(fn()).toBe('declarative');
    });
  });

  // ---------- 4.7 getDefaultHalfLives ----------

  describe('getDefaultHalfLives', () => {
    it('4.7.1 returns 9 types', () => {
      const fn = memoryTypes.getDefaultHalfLives;
      if (!fn) return;
      const defaults = fn();
      expect(Object.keys(defaults).length).toBe(9);
    });

    it('4.7.2 values match MEMORY_TYPES', () => {
      const fn = memoryTypes.getDefaultHalfLives;
      if (!fn) return;
      const defaults = fn();
      expect(defaults.working).toBe(1);
      expect(defaults.episodic).toBe(7);
      expect(defaults.procedural).toBe(90);
      expect(defaults['meta-cognitive']).toBeNull();
      expect(defaults.autobiographical).toBe(365);
    });
  });

  // ---------- 4.8 validateHalfLifeConfig ----------

  describe('validateHalfLifeConfig', () => {
    it('4.8.1 valid config passes', () => {
      const fn = memoryTypes.validateHalfLifeConfig;
      if (!fn) return;
      const validConfig = memoryTypes.getDefaultHalfLives();
      const result = fn(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('4.8.2 null config fails', () => {
      const fn = memoryTypes.validateHalfLifeConfig;
      if (!fn) return;
      const result = fn(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('4.8.3 missing types reported', () => {
      const fn = memoryTypes.validateHalfLifeConfig;
      if (!fn) return;
      const partial = { working: 1, episodic: 7 };
      const result = fn(partial);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(7);
    });

    it('4.8.4 negative value rejected', () => {
      const fn = memoryTypes.validateHalfLifeConfig;
      if (!fn) return;
      const badConfig = { ...memoryTypes.getDefaultHalfLives(), working: -5 };
      const result = fn(badConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('working'))).toBe(true);
    });

    it('4.8.5 string value rejected', () => {
      const fn = memoryTypes.validateHalfLifeConfig;
      if (!fn) return;
      const badConfig = { ...memoryTypes.getDefaultHalfLives(), episodic: 'seven' };
      const result = fn(badConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('episodic'))).toBe(true);
    });
  });

  // --- --- 5. TYPE-INFERENCE TESTS --- ---

  // ---------- 5.1 TIER_TO_TYPE_MAP ----------

  describe('TIER_TO_TYPE_MAP', () => {
    it('5.1.1 has all 6 tiers', () => {
      const map = typeInference.TIER_TO_TYPE_MAP;
      if (!map) return;
      const tiers = Object.keys(map);
      const expected = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
      expect(tiers.length).toBe(6);
      for (const t of expected) {
        expect(tiers).toContain(t);
      }
    });

    it('5.1.2 correct mappings', () => {
      const map = typeInference.TIER_TO_TYPE_MAP;
      if (!map) return;
      expect(map.constitutional).toBe('meta-cognitive');
      expect(map.critical).toBe('semantic');
      expect(map.temporary).toBe('working');
      expect(map.deprecated).toBe('episodic');
    });
  });

  // ---------- 5.2 inferMemoryTypesBatch ----------

  describe('inferMemoryTypesBatch', () => {
    it('5.2.1 empty input returns empty Map', () => {
      const fn = typeInference.inferMemoryTypesBatch;
      if (!fn) return;
      const result = fn([]);
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('5.2.2 single item inference', () => {
      const fn = typeInference.inferMemoryTypesBatch;
      if (!fn) return;
      const result = fn([{ filePath: '/project/scratch/temp.md' }]);
      const entry = result.get('/project/scratch/temp.md');
      expect(entry).toBeDefined();
      expect(entry!.type).toBe('working');
      expect(entry!.source).toBe('file_path');
    });

    it('5.2.3 multiple items with different sources', () => {
      const fn = typeInference.inferMemoryTypesBatch;
      if (!fn) return;
      const items = [
        { filePath: '/scratch/temp.md' },
        { file_path: '/architecture.md' },
        { filePath: '/random.md', content: '---\nmemory_type: procedural\n---\nContent' },
      ];
      const result = fn(items);
      expect(result.size).toBe(3);
      expect(result.get('/scratch/temp.md')?.type).toBe('working');
      expect(result.get('/architecture.md')?.type).toBe('semantic');
      expect(result.get('/random.md')?.type).toBe('procedural');
    });

    it('5.2.4 uses importance_tier fallback', () => {
      const fn = typeInference.inferMemoryTypesBatch;
      if (!fn) return;
      const items = [{ file_path: '/todo-list.md', importance_tier: 'constitutional' }];
      const result = fn(items);
      const entry = result.get('/todo-list.md');
      expect(entry).toBeDefined();
      expect(entry!.type).toBe('meta-cognitive');
      expect(entry!.source).toBe('importance_tier');
    });
  });

  // ---------- 5.3 getTypeSuggestionDetailed ----------

  describe('getTypeSuggestionDetailed', () => {
    it('5.3.1 has explanation + typeConfig', () => {
      const fn = typeInference.getTypeSuggestionDetailed;
      if (!fn) return;
      const result = fn({ filePath: '/project/architecture.md' });
      expect(result).toBeDefined();
      expect(typeof result.explanation).toBe('string');
      expect(result.explanation.length).toBeGreaterThan(0);
      expect(result.typeConfig).toBeDefined();
    });

    it('5.3.2 typeConfig matches type', () => {
      const fn = typeInference.getTypeSuggestionDetailed;
      if (!fn) return;
      const result = fn({ filePath: '/project/scratch/tmp.md' });
      expect(result.type).toBe('working');
      expect(result.typeConfig.halfLifeDays).toBe(1);
    });

    it('5.3.3 default fallback has explanation', () => {
      const fn = typeInference.getTypeSuggestionDetailed;
      if (!fn) return;
      const result = fn({ filePath: '/project/unknown-xyz.md' });
      expect(result.source).toBe('default');
      expect(result.explanation).toContain('default');
    });
  });

  // ---------- 5.4 validateInferredType ----------

  describe('validateInferredType', () => {
    it('5.4.1 constitutional mismatch warns', () => {
      const fn = typeInference.validateInferredType;
      if (!fn) return;
      const result = fn('declarative', '/project/constitutional/rules.md');
      expect(result.valid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('constitutional');
    });

    it('5.4.2 constitutional correct is valid', () => {
      const fn = typeInference.validateInferredType;
      if (!fn) return;
      const result = fn('meta-cognitive', '/project/constitutional/rules.md');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('5.4.3 scratch slow-decay warns', () => {
      const fn = typeInference.validateInferredType;
      if (!fn) return;
      const result = fn('semantic', '/project/scratch/temp.md');
      expect(result.valid).toBe(false);
      expect(result.warnings.some((w: string) => w.includes('Temporary'))).toBe(true);
    });

    it('5.4.4 scratch working is valid', () => {
      const fn = typeInference.validateInferredType;
      if (!fn) return;
      const result = fn('working', '/project/scratch/temp.md');
      expect(result.valid).toBe(true);
    });

    it('5.4.5 null path is valid', () => {
      const fn = typeInference.validateInferredType;
      if (!fn) return;
      const result = fn('declarative', null);
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('5.4.6 /temp/ slow-decay warns', () => {
      const fn = typeInference.validateInferredType;
      if (!fn) return;
      const result = fn('procedural', '/project/temp/notes.md');
      expect(result.valid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
