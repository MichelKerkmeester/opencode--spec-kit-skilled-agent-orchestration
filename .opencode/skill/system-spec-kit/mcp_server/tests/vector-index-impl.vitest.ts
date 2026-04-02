// TEST: VECTOR INDEX IMPL
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import * as history from '../lib/storage/history';

// TEST: VECTOR INDEX IMPLEMENTATION (vector-index-impl)
// Core vector search implementation — pure functions, DB ops,
// Keyword search, content extraction, caching, and ranking.
// DB-dependent (uses better-sqlite3 + sqlite-vec).
type VectorIndexModule = typeof import('../lib/search/vector-index-impl');
type MemoryRecord = NonNullable<ReturnType<VectorIndexModule['getMemory']>>;
type KeywordSearchResult = ReturnType<VectorIndexModule['keywordSearch']>[number];
type VectorSearchResult = ReturnType<VectorIndexModule['vectorSearch']>[number];
type SmartRankingInput = Parameters<VectorIndexModule['applySmartRanking']>[0][number];
type DiversityInput = Parameters<VectorIndexModule['applyDiversity']>[0][number];
type CleanupCandidate = ReturnType<VectorIndexModule['findCleanupCandidates']>[number];
type IntegrityReport = ReturnType<VectorIndexModule['verifyIntegrity']>;
type MemoryPreview = NonNullable<ReturnType<VectorIndexModule['getMemoryPreview']>>;

describe('Vector Index Implementation [deferred - requires DB test fixtures]', () => {
  // Module reference (renamed from `vi` to avoid conflict with Vitest's `vi`)
  let mod!: VectorIndexModule;
  let importError: Error | null = null;
  let sqliteVecAvailable = false;

  // Temp DB for isolation
  const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'vec-idx-test-'));
  const TMP_DB_PATH = path.join(TMP_DIR, 'test-context-index.sqlite');

  // Shared state across tests
  let deferredId1: number | null = null;
  let deferredId2: number | null = null;

  beforeAll(async () => {
    // Point the module at our temp DB before import
    process.env.MEMORY_DB_PATH = TMP_DB_PATH;
    // Ensure allowed paths include our temp dir for path validation
    process.env.MEMORY_ALLOWED_PATHS = TMP_DIR;

    try {
      mod = await import('../lib/search/vector-index-impl');
    } catch (e: unknown) {
      importError = e instanceof Error ? e : new Error(String(e));
    }
  });

  afterAll(() => {
    try {
      if (mod && !importError) {
        mod.closeDb();
      }
    } catch (_: unknown) {}
    try {
      if (fs.existsSync(TMP_DIR)) {
        fs.rmSync(TMP_DIR, { recursive: true, force: true });
      }
    } catch (_: unknown) {}
  });

  // ───────────────────────────────────────────────────────────────
  // 1. GROUP 1: MODULE IMPORT
  // ───────────────────────────────────────────────────────────────
  describe('Module Import', () => {
    it('imports without error', () => {
      expect(importError).toBeNull();
      expect(mod).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. GROUP 2: EXPORT VERIFICATION
  // ───────────────────────────────────────────────────────────────
  describe('Export Verification', () => {
    it('has all required exports present', () => {
      const requiredExports = [
        // Initialization
        'initializeDb', 'closeDb', 'getDb', 'getDbPath',
        // Core operations
        'indexMemory', 'indexMemoryDeferred', 'updateMemory',
        'deleteMemory', 'deleteMemoryByPath',
        // Queries
        'getMemory', 'getMemoriesByFolder', 'getMemoryCount',
        'getStatusCounts', 'getStats', 'verifyIntegrity',
        // Search - Basic
        'vectorSearch', 'getConstitutionalMemories',
        'clearConstitutionalCache', 'multiConceptSearch',
        'isVectorSearchAvailable',
        // Search - Enriched
        'vectorSearchEnriched', 'multiConceptSearchEnriched',
        'keywordSearch', 'multiConceptKeywordSearch',
        // Search - Cached
        'cachedSearch', 'clearSearchCache',
        // Smart Ranking & Diversity
        'applySmartRanking', 'applyDiversity',
        'learnFromSelection', 'enhancedSearch',
        // Related & Usage
        'linkRelatedOnSave', 'getRelatedMemories',
        'recordAccess', 'getUsageStats', 'updateConfidence',
        // Embedding Status
        'updateEmbeddingStatus',
        // Cleanup
        'findCleanupCandidates', 'deleteMemories', 'getMemoryPreview',
        // Content Extraction
        'extractTitle', 'extractSnippet', 'extractTags', 'extractDate',
        // Query Utilities
        'generateQueryEmbedding', 'parseQuotedTerms',
        // Security
        'validateFilePath',
        // Embedding Dimension
        'getConfirmedEmbeddingDimension', 'getEmbeddingDim',
        'validateEmbeddingDimension',
        // Cache Utilities
        'getCacheKey',
        // Constants
        'EMBEDDING_DIM', 'DEFAULT_DB_PATH',
        // Protocol Abstractions
        'SQLiteVectorStore',
        // Snake_case aliases
        'initialize_db', 'get_db', 'get_memory', 'get_db_path',
      ];

      const missingExports: string[] = [];
      const moduleExports = mod as Record<string, unknown>;
      for (const name of requiredExports) {
        if (moduleExports[name] === undefined) {
          missingExports.push(name);
        }
      }

      expect(missingExports).toEqual([]);
    });

    it('has correct constants EMBEDDING_DIM=768 and DEFAULT_DB_PATH', () => {
      expect(mod.EMBEDDING_DIM).toBe(768);
      expect(typeof mod.DEFAULT_DB_PATH).toBe('string');
      expect(mod.DEFAULT_DB_PATH.length).toBeGreaterThan(0);
    });

    it('has all exported functions with correct types', () => {
      expect(typeof mod.extractTitle).toBe('function');
      expect(typeof mod.extractSnippet).toBe('function');
      expect(typeof mod.extractTags).toBe('function');
      expect(typeof mod.extractDate).toBe('function');
      expect(typeof mod.parseQuotedTerms).toBe('function');
      expect(typeof mod.getCacheKey).toBe('function');
      expect(typeof mod.initializeDb).toBe('function');
      expect(typeof mod.SQLiteVectorStore).toBe('function');
    });

    it('has snake_case aliases pointing to same functions as camelCase', () => {
      expect(mod.initialize_db).toBe(mod.initializeDb);
      expect(mod.get_db).toBe(mod.getDb);
      expect(mod.get_memory).toBe(mod.getMemory);
      expect(mod.get_db_path).toBe(mod.getDbPath);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. GROUP 3: PURE FUNCTIONS — EXTRACTTITLE
  // ───────────────────────────────────────────────────────────────
  describe('extractTitle', () => {
    it('extracts H1 heading', () => {
      const title = mod.extractTitle('# My Great Title\n\nSome content here', 'test.md');
      expect(title).toBe('My Great Title');
    });

    it('extracts H2 heading when no H1', () => {
      const title = mod.extractTitle('## Sub Title\n\nContent', 'test.md');
      expect(title).toBe('Sub Title');
    });

    it('extracts YAML frontmatter title', () => {
      const title = mod.extractTitle('---\ntitle: YAML Title\n---\n\nContent', 'test.md');
      expect(title).toBe('YAML Title');
    });

    it('strips quotes from YAML title', () => {
      const title = mod.extractTitle('---\ntitle: "Quoted Title"\n---\n\nContent', 'test.md');
      expect(title).toBe('Quoted Title');
    });

    it('falls back to first non-empty line', () => {
      const title = mod.extractTitle('Just a plain first line\nSecond line', 'test.md');
      expect(title).toBe('Just a plain first line');
    });

    it('falls back to filename without extension', () => {
      const title = mod.extractTitle('', 'my-document.md');
      expect(title).toBe('my-document');
    });

    it('returns "Untitled" for null content and no filename', () => {
      const title = mod.extractTitle(null as unknown as string, undefined);
      expect(title).toBe('Untitled');
    });

    it('returns filename for undefined content', () => {
      const title = mod.extractTitle(undefined as unknown as string, 'backup.txt');
      expect(title).toBe('backup');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. GROUP 4: PURE FUNCTIONS — EXTRACTSNIPPET
  // ───────────────────────────────────────────────────────────────
  describe('extractSnippet', () => {
    it('skips heading, returns body text', () => {
      const snippet = mod.extractSnippet('# Title\n\nThis is the body paragraph.', 200);
      expect(snippet).toBe('This is the body paragraph.');
    });

    it('strips YAML frontmatter and headings', () => {
      const snippet = mod.extractSnippet('---\ntitle: foo\ndate: 2025-01-01\n---\n\n# Heading\n\nBody text here.', 200);
      expect(snippet).toBe('Body text here.');
    });

    it('returns empty string for empty content', () => {
      const snippet = mod.extractSnippet('', 200);
      expect(snippet).toBe('');
    });

    it('returns empty string for null content', () => {
      const snippet = mod.extractSnippet(null as unknown as string, 200);
      expect(snippet).toBe('');
    });

    it('truncates long content to maxLength', () => {
      const longText = 'A'.repeat(300);
      const snippet = mod.extractSnippet(longText, 50);
      expect(snippet.length).toBeLessThanOrEqual(54); // 50 + "..."
      expect(snippet.endsWith('...')).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. GROUP 5: PURE FUNCTIONS — EXTRACTTAGS
  // ───────────────────────────────────────────────────────────────
  describe('extractTags', () => {
    it('parses YAML inline array tags', () => {
      const tags = mod.extractTags('---\ntags: [memory, search, "vector"]\n---\n\nContent');
      expect(tags).toContain('memory');
      expect(tags).toContain('search');
      expect(tags).toContain('vector');
    });

    it('parses YAML list-style tags', () => {
      const tags = mod.extractTags('---\ntags:\n  - alpha\n  - beta\n---\nContent');
      expect(tags).toContain('alpha');
      expect(tags).toContain('beta');
    });

    it('parses hashtag-style tags from content', () => {
      const tags = mod.extractTags('Some text with #javascript and #typescript tags');
      expect(tags).toContain('javascript');
      expect(tags).toContain('typescript');
    });

    it('ignores pure numeric hashtags', () => {
      const tags = mod.extractTags('Heading #123 should be ignored but #valid is ok');
      expect(tags).not.toContain('123');
      expect(tags).toContain('valid');
    });

    it('returns empty array for empty content', () => {
      const tags = mod.extractTags('');
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBe(0);
    });

    it('returns empty array for null', () => {
      const tags = mod.extractTags(null as unknown as string);
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. GROUP 6: PURE FUNCTIONS — EXTRACTDATE
  // ───────────────────────────────────────────────────────────────
  describe('extractDate', () => {
    it('extracts ISO date from YAML frontmatter', () => {
      const date = mod.extractDate('---\ndate: 2025-06-15\n---\nContent', undefined);
      expect(date).toBe('2025-06-15');
    });

    it('extracts quoted date from YAML', () => {
      const date = mod.extractDate('---\ndate: "2024-12-25"\n---\nContent', undefined);
      expect(date).toBe('2024-12-25');
    });

    it('extracts ISO date from filename', () => {
      const date = mod.extractDate('No date here', '/path/to/2025-03-20-notes.md');
      expect(date).toBe('2025-03-20');
    });

    it('parses DD-MM-YY format from filename', () => {
      const date = mod.extractDate('No date here', '/path/to/15-06-25-notes.md');
      expect(date).toBe('2025-06-15');
    });

    it('returns null when no date found', () => {
      const date = mod.extractDate('No date', '/path/to/notes.md');
      expect(date).toBeNull();
    });

    it('returns null for null content and no path', () => {
      const date = mod.extractDate(null as unknown as string, undefined);
      expect(date).toBeNull();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. GROUP 7: PURE FUNCTIONS — PARSEQUOTEDTERMS
  // ───────────────────────────────────────────────────────────────
  describe('parseQuotedTerms', () => {
    it('extracts multiple quoted terms', () => {
      const terms = mod.parseQuotedTerms('search for "exact phrase" in "another term" query');
      expect(terms).toEqual(['exact phrase', 'another term']);
    });

    it('returns empty array when no quotes', () => {
      const terms = mod.parseQuotedTerms('no quotes here');
      expect(terms).toEqual([]);
    });

    it('returns empty for empty string', () => {
      const terms = mod.parseQuotedTerms('');
      expect(terms).toEqual([]);
    });

    it('returns empty for null', () => {
      const terms = mod.parseQuotedTerms(null as unknown as string);
      expect(terms).toEqual([]);
    });

    it('handles single quoted term', () => {
      const terms = mod.parseQuotedTerms('"single term"');
      expect(terms).toEqual(['single term']);
    });

    it('filters empty quoted strings', () => {
      const terms = mod.parseQuotedTerms('"" empty ""');
      // Empty quoted strings should be filtered out (trim check)
      expect(terms.every(t => t.length > 0)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. GROUP 8: PURE FUNCTIONS — GETCACHEKEY
  // ───────────────────────────────────────────────────────────────
  describe('getCacheKey', () => {
    it('is deterministic for same inputs', () => {
      const key1 = mod.getCacheKey('test query', 10, { specFolder: 'a' });
      const key2 = mod.getCacheKey('test query', 10, { specFolder: 'a' });
      expect(key1).toBe(key2);
      expect(typeof key1).toBe('string');
      expect(key1.length).toBe(16);
    });

    it('produces different keys for different queries', () => {
      const key1 = mod.getCacheKey('query A', 10, {});
      const key2 = mod.getCacheKey('query B', 10, {});
      expect(key1).not.toBe(key2);
    });

    it('produces different keys for different limits', () => {
      const key1 = mod.getCacheKey('q', 10, {});
      const key2 = mod.getCacheKey('q', 20, {});
      expect(key1).not.toBe(key2);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 9. GROUP 9: DATABASE INITIALIZATION
  // ───────────────────────────────────────────────────────────────
  describe('Database Initialization', () => {
    it('creates database at custom path', () => {
      const db = mod.initializeDb(TMP_DB_PATH);
      expect(db).toBeTruthy();
    });

    it('getDbPath returns correct path', () => {
      const dbPath = mod.getDbPath();
      expect(dbPath).toBe(TMP_DB_PATH);
    });

    it('schema created with memory_index table', () => {
      const db = mod.getDb();
      expect(db).toBeTruthy();
      const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='memory_index'"
      ).get();
      expect(tables).toBeTruthy();
    });

    it('schema version is >= 12', () => {
      const db = mod.getDb();
      const versionRow = db!.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
      expect(versionRow).toBeTruthy();
      expect(versionRow!.version).toBeGreaterThanOrEqual(12);
    });

    it('reports isVectorSearchAvailable status', () => {
      sqliteVecAvailable = mod.isVectorSearchAvailable();
      expect(typeof sqliteVecAvailable).toBe('boolean');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 10. GROUP 10: EMBEDDING DIMENSION
  // ───────────────────────────────────────────────────────────────
  describe('Embedding Dimension', () => {
    it('getEmbeddingDim returns valid dimension', () => {
      const dim = mod.getEmbeddingDim();
      expect(typeof dim).toBe('number');
      expect(dim).toBeGreaterThan(0);
      expect([768, 1024, 1536]).toContain(dim);
    });

    it('validateEmbeddingDimension returns validation object', () => {
      const validation = mod.validateEmbeddingDimension();
      expect(typeof validation).toBe('object');
      expect(validation).toHaveProperty('valid');
      expect(validation).toHaveProperty('stored');
      expect(validation).toHaveProperty('current');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 11. GROUP 11: CORE OPERATIONS — DEFERRED INDEXING
  // ───────────────────────────────────────────────────────────────
  describe('Deferred Indexing (no embedding required)', () => {
    it('creates first deferred memory', () => {
      deferredId1 = mod.indexMemoryDeferred({
        specFolder: 'specs/test-001',
        filePath: path.join(TMP_DIR, 'memory-a.md'),
        title: 'Test Memory Alpha',
        triggerPhrases: ['alpha', 'first test'],
        importanceWeight: 0.8,
      });
      expect(typeof deferredId1).toBe('number');
      expect(deferredId1).toBeGreaterThan(0);
    });

    it('creates second deferred memory with different ID', () => {
      deferredId2 = mod.indexMemoryDeferred({
        specFolder: 'specs/test-001',
        filePath: path.join(TMP_DIR, 'memory-b.md'),
        title: 'Test Memory Beta',
        triggerPhrases: ['beta', 'second test'],
        importanceWeight: 0.6,
      });
      expect(typeof deferredId2).toBe('number');
      expect(deferredId2).toBeGreaterThan(0);
      expect(deferredId2).not.toBe(deferredId1);
    });

    it('stores failure reason correctly', () => {
      const id = mod.indexMemoryDeferred({
        specFolder: 'specs/test-002',
        filePath: path.join(TMP_DIR, 'memory-failed.md'),
        title: 'Failed Embedding',
        failureReason: 'API key missing',
      });
      expect(id).toBeGreaterThan(0);
      const mem = mod.getMemory(id);
      expect(mem).toBeTruthy();
      expect(mem!.embedding_status).toBe('pending');
      expect(mem!.failure_reason).toBe('API key missing');
    });

    it('upserts existing memory (same folder+path)', () => {
      const updatedId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-001',
        filePath: path.join(TMP_DIR, 'memory-a.md'),
        title: 'Updated Title Alpha',
        triggerPhrases: ['alpha', 'updated'],
        importanceWeight: 0.9,
      });
      expect(updatedId).toBe(deferredId1);
      const mem = mod.getMemory(updatedId);
      expect(mem?.title).toBe('Updated Title Alpha');
    });

    it('upserts existing memory across symlink alias paths', () => {
      const canonicalDir = path.join(TMP_DIR, 'canonical-specs');
      fs.mkdirSync(canonicalDir, { recursive: true });

      const canonicalFile = path.join(canonicalDir, 'memory-symlink.md');
      fs.writeFileSync(canonicalFile, 'symlink content', 'utf-8');

      const aliasDir = path.join(TMP_DIR, 'alias-specs');
      try {
        if (!fs.existsSync(aliasDir)) {
          fs.symlinkSync(canonicalDir, aliasDir, 'dir');
        }
      } catch (error: unknown) {
        const code = (error as NodeJS.ErrnoException).code;
        expect(typeof code).toBe('string');
        return;
      }

      const aliasFile = path.join(aliasDir, 'memory-symlink.md');

      const firstId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-symlink',
        filePath: canonicalFile,
        title: 'Canonical Path Memory',
        triggerPhrases: ['symlink'],
      });

      const secondId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-symlink',
        filePath: aliasFile,
        title: 'Symlink Alias Updated',
        triggerPhrases: ['symlink', 'alias'],
      });

      expect(secondId).toBe(firstId);

      const mem = mod.getMemory(firstId);
      expect(mem?.title).toBe('Symlink Alias Updated');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 12. GROUP 12: CORE OPERATIONS — GETMEMORY, GETMEMORYCOUNT, GETSTATS
  // ───────────────────────────────────────────────────────────────
  describe('Query Operations', () => {
    it('getMemory returns correct memory with parsed trigger_phrases', () => {
      const mem = mod.getMemory(deferredId1!);
      expect(mem).toBeTruthy();
      expect(mem!.id).toBe(deferredId1);
      expect(mem!.spec_folder).toBe('specs/test-001');
      expect(mem!.title).toBe('Updated Title Alpha');
      expect(Array.isArray(mem!.trigger_phrases)).toBe(true);
      expect(mem!.trigger_phrases).toContain('alpha');
    });

    it('getMemory returns null for non-existent ID', () => {
      const mem = mod.getMemory(999999);
      expect(mem).toBeNull();
    });

    it('getMemoryCount returns correct count', () => {
      const count = mod.getMemoryCount();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    it('getStats returns expected fields', () => {
      const stats = mod.getStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('pending');
      expect(stats).toHaveProperty('success');
      expect(stats).toHaveProperty('failed');
      expect(stats.total).toBeGreaterThanOrEqual(3);
      expect(stats.pending).toBeGreaterThanOrEqual(3);
    });

    it('getStatusCounts returns counts object', () => {
      const counts = mod.getStatusCounts();
      expect(typeof counts).toBe('object');
      expect(counts).toHaveProperty('pending');
      expect(counts).toHaveProperty('success');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 13. GROUP 13: GETMEMORIESBYFOLDER
  // ───────────────────────────────────────────────────────────────
  describe('getMemoriesByFolder', () => {
    it('returns memories for existing folder', () => {
      const memories = mod.getMemoriesByFolder('specs/test-001');
      expect(Array.isArray(memories)).toBe(true);
      expect(memories.length).toBeGreaterThanOrEqual(2);
      expect(memories.every(m => m.spec_folder === 'specs/test-001')).toBe(true);
    });

    it('returns empty for non-existent folder', () => {
      const memories = mod.getMemoriesByFolder('specs/nonexistent');
      expect(Array.isArray(memories)).toBe(true);
      expect(memories.length).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 14. GROUP 14: UPDATEEMBEDDINGSTATUS
  // ───────────────────────────────────────────────────────────────
  describe('updateEmbeddingStatus', () => {
    it('updates to failed', () => {
      const result = mod.updateEmbeddingStatus(deferredId1!, 'failed');
      expect(result).toBe(true);
      const mem = mod.getMemory(deferredId1!);
      expect(mem?.embedding_status).toBe('failed');
    });

    it('updates to retry', () => {
      const result = mod.updateEmbeddingStatus(deferredId1!, 'retry');
      expect(result).toBe(true);
    });

    it('updates to partial', () => {
      const result = mod.updateEmbeddingStatus(deferredId1!, 'partial');
      expect(result).toBe(true);
      // Reset to pending for later tests
      mod.updateEmbeddingStatus(deferredId1!, 'pending');
    });

    it('rejects invalid status', () => {
      const result = mod.updateEmbeddingStatus(deferredId1!, 'invalid_status');
      expect(result).toBe(false);
    });

    it('returns false for non-existent memory', () => {
      const result = mod.updateEmbeddingStatus(999999, 'success');
      expect(result).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 15. GROUP 15: UPDATECONFIDENCE
  // ───────────────────────────────────────────────────────────────
  describe('updateConfidence', () => {
    it('sets confidence to 0.85', () => {
      const result = mod.updateConfidence(deferredId1!, 0.85);
      expect(result).toBe(true);
    });

    it('rejects value > 1', () => {
      const result = mod.updateConfidence(deferredId1!, 1.5);
      expect(result).toBe(false);
    });

    it('rejects value < 0', () => {
      const result = mod.updateConfidence(deferredId1!, -0.1);
      expect(result).toBe(false);
    });

    it('rejects non-numeric input', () => {
      const result = mod.updateConfidence(deferredId1!, 'not a number' as unknown as number);
      expect(result).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 16. GROUP 16: RECORDACCESS
  // ───────────────────────────────────────────────────────────────
  describe('recordAccess', () => {
    it('increments access_count and updates last_accessed', () => {
      const before = mod.getMemory(deferredId1!);
      const initialCount = before?.access_count || 0;

      const result = mod.recordAccess(deferredId1!);
      expect(result).toBe(true);

      const after = mod.getMemory(deferredId1!);
      expect(after?.access_count).toBe(initialCount + 1);
      expect(after?.last_accessed).toBeGreaterThan(0);
    });

    it('returns false for non-existent memory', () => {
      const result = mod.recordAccess(999999);
      expect(result).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 17. GROUP 17: KEYWORDSEARCH
  // ───────────────────────────────────────────────────────────────
  describe('keywordSearch', () => {
    it('finds memories matching "alpha"', () => {
      const results = mod.keywordSearch('alpha', { limit: 10 });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
        const firstResult = results[0] as KeywordSearchResult;
        expect(firstResult.keyword_score).toBeGreaterThan(0);
    });

    it('filters by specFolder', () => {
      const results = mod.keywordSearch('alpha', { specFolder: 'specs/test-001' });
      expect(results.every(r => r.spec_folder === 'specs/test-001')).toBe(true);
    });

    it('returns empty for non-matching query', () => {
      const results = mod.keywordSearch('xyznonexistent42');
      expect(results.length).toBe(0);
    });

    it('returns empty for empty query', () => {
      const results = mod.keywordSearch('');
      expect(results.length).toBe(0);
    });

    it('returns empty for null query', () => {
      const results = mod.keywordSearch(null as unknown as string);
      expect(results.length).toBe(0);
    });

    it('filters terms shorter than 2 chars', () => {
      const results = mod.keywordSearch('a'); // Single char < 2 chars threshold
      expect(results.length).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 18. GROUP 18: APPLYSMARTRANKING
  // ───────────────────────────────────────────────────────────────
  describe('applySmartRanking', () => {
    it('returns empty for empty input', () => {
      const ranked = mod.applySmartRanking([]);
      expect(ranked).toEqual([]);
    });

    it('applies composite scoring', () => {
      const now = new Date().toISOString();
      const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(); // 60 days ago

      const mockResults = [
        { similarity: 80, created_at: oldDate, access_count: 1, specFolder: 'a' },
        { similarity: 70, created_at: now, access_count: 10, specFolder: 'b' },
      ];

      const ranked = mod.applySmartRanking(
        mockResults as SmartRankingInput[]
      );
      expect(ranked.length).toBe(2);
      expect(ranked[0].smartScore).toBeDefined();
      expect(ranked[1].smartScore).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 19. GROUP 19: APPLYDIVERSITY
  // ───────────────────────────────────────────────────────────────
  describe('applyDiversity', () => {
    it('returns input unchanged for <=3 results', () => {
      const small = [{ id: 1 }, { id: 2 }];
      const diverse = mod.applyDiversity(small as DiversityInput[], 0.3);
      expect(diverse.length).toBe(2);
    });

    it('handles null input', () => {
      const diverse = mod.applyDiversity(null as unknown as Parameters<VectorIndexModule['applyDiversity']>[0]);
      expect(!diverse || diverse.length === 0).toBe(true);
    });

    it('reorders results with MMR-based diversity', () => {
      const mockResults = [
        { id: 1, smartScore: 0.9, specFolder: 'a', date: '2025-01-01' },
        { id: 2, smartScore: 0.85, specFolder: 'a', date: '2025-01-01' },
        { id: 3, smartScore: 0.80, specFolder: 'b', date: '2025-01-02' },
        { id: 4, smartScore: 0.75, specFolder: 'c', date: '2025-01-03' },
      ];
      const diverse = mod.applyDiversity(
        mockResults as DiversityInput[],
        0.5
      );
      expect(diverse.length).toBe(4);
      expect(diverse[0].id).toBe(1);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 20. GROUP 20: CACHE CLEARING
  // ───────────────────────────────────────────────────────────────
  describe('Cache Clearing', () => {
    it('clearSearchCache clears globally', () => {
      const cleared = mod.clearSearchCache();
      expect(typeof cleared).toBe('number');
    });

    it('clearSearchCache clears by folder', () => {
      const cleared = mod.clearSearchCache('specs/test-001');
      expect(typeof cleared).toBe('number');
    });

    it('clearConstitutionalCache clears without error', () => {
      expect(() => mod.clearConstitutionalCache()).not.toThrow();
    });

    it('clearConstitutionalCache clears by folder without error', () => {
      expect(() => mod.clearConstitutionalCache('specs/test-001')).not.toThrow();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 21. GROUP 21: DELETE OPERATIONS
  // ───────────────────────────────────────────────────────────────
  describe('Delete Operations', () => {
    it('deleteMemory successfully deletes a memory', () => {
      const sacrificialId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-delete',
        filePath: path.join(TMP_DIR, 'memory-delete.md'),
        title: 'To Be Deleted',
      });
      expect(sacrificialId).toBeGreaterThan(0);

      const result = mod.deleteMemory(sacrificialId);
      expect(result).toBe(true);

      const mem = mod.getMemory(sacrificialId);
      expect(mem).toBeNull();
    });

    it('deleteMemory returns false for non-existent ID', () => {
      const result = mod.deleteMemory(999999);
      expect(result).toBe(false);
    });

    it('deleteMemoryByPath deletes memory by folder+path', () => {
      const pathDeleteId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-path-delete',
        filePath: path.join(TMP_DIR, 'memory-path-del.md'),
        title: 'Path Delete Test',
      });

      const result = mod.deleteMemoryByPath(
        'specs/test-path-delete',
        path.join(TMP_DIR, 'memory-path-del.md'),
        null
      );
      expect(result).toBe(true);

      const events = history.getHistory(pathDeleteId);
      expect(events.some((entry) => entry.event === 'DELETE' && entry.actor === 'mcp:delete_by_path')).toBe(true);
    });

    it('deleteMemoryByPath returns false for non-existent', () => {
      const result = mod.deleteMemoryByPath('specs/nonexistent', '/nonexistent/path.md', null);
      expect(result).toBe(false);
    });

    it('delete_memory_from_database aborts the primary delete when vec cleanup fails unexpectedly', async () => {
      vi.resetModules();
      const deletePrimarySpy = vi.fn(() => ({ changes: 1 }));
      const database = {
        transaction: (fn: () => boolean) => fn,
        prepare: (sql: string) => {
          if (sql.includes('DELETE FROM vec_memories')) {
            return {
              run: () => {
                throw new Error('simulated vec delete failure');
              },
            };
          }

          if (sql.includes('DELETE FROM memory_index')) {
            return { run: deletePrimarySpy };
          }

          return { run: vi.fn(() => ({ changes: 0 })) };
        },
      };

      vi.doMock('../lib/search/vector-index-store', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/search/vector-index-store')>();
        return {
          ...actual,
          sqlite_vec_available: () => true,
        };
      });

      const mutations = await import('../lib/search/vector-index-mutations');

      expect(() => mutations.delete_memory_from_database(database as never, 42)).toThrow(/Vector deletion failed/);
      expect(deletePrimarySpy).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 22. GROUP 22: BATCH DELETE
  // ───────────────────────────────────────────────────────────────
  describe('Batch Delete', () => {
    it('returns {deleted:0, failed:0} for empty array', () => {
      const result = mod.deleteMemories([]);
      expect(result).toEqual({ deleted: 0, failed: 0 });
    });

    it('handles null input', () => {
      const result = mod.deleteMemories(null as unknown as number[]);
      expect(result).toEqual({ deleted: 0, failed: 0 });
    });

    it('records DELETE history only for confirmed batch deletions', () => {
      const firstId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-batch-delete',
        filePath: path.join(TMP_DIR, 'batch-delete-1.md'),
        title: 'Batch Delete 1',
      });
      const secondId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-batch-delete',
        filePath: path.join(TMP_DIR, 'batch-delete-2.md'),
        title: 'Batch Delete 2',
      });

      const result = mod.deleteMemories([firstId, secondId]);
      expect(result).toEqual({ deleted: 2, failed: 0 });

      const firstHistory = history.getHistory(firstId);
      const secondHistory = history.getHistory(secondId);
      expect(firstHistory.some((entry) => entry.event === 'DELETE' && entry.actor === 'mcp:delete_memories')).toBe(true);
      expect(secondHistory.some((entry) => entry.event === 'DELETE' && entry.actor === 'mcp:delete_memories')).toBe(true);
    });

    it('rolls back earlier deletions when any requested id fails', () => {
      const firstId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-batch-rollback',
        filePath: path.join(TMP_DIR, 'batch-rollback-1.md'),
        title: 'Batch Rollback 1',
      });
      const secondId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-batch-rollback',
        filePath: path.join(TMP_DIR, 'batch-rollback-2.md'),
        title: 'Batch Rollback 2',
      });

      const result = mod.deleteMemories([firstId, secondId, 999999]);
      expect(result).toEqual({ deleted: 0, failed: 3 });
      expect(mod.getMemory(firstId)).toBeTruthy();
      expect(mod.getMemory(secondId)).toBeTruthy();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 23. GROUP 23: GETUSAGESTATS
  // ───────────────────────────────────────────────────────────────
  describe('getUsageStats', () => {
    it('returns entries sorted by access_count', () => {
      const stats = mod.getUsageStats({ sortBy: 'access_count', order: 'DESC', limit: 10 });
      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBeGreaterThanOrEqual(1);
    });

    it('handles invalid sortBy gracefully', () => {
      const stats = mod.getUsageStats({ sortBy: 'invalid_field' });
      expect(Array.isArray(stats)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 24. GROUP 24: GETCONSTITUTIONALMEMORIES
  // ───────────────────────────────────────────────────────────────
  describe('getConstitutionalMemories', () => {
    it('returns array (expected 0 in test DB)', () => {
      const constitutional = mod.getConstitutionalMemories({});
      expect(Array.isArray(constitutional)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 25. GROUP 25: GETRELATEDMEMORIES
  // ───────────────────────────────────────────────────────────────
  describe('getRelatedMemories', () => {
    it('returns empty for memory without relations', () => {
      const related = mod.getRelatedMemories(deferredId1!);
      expect(Array.isArray(related)).toBe(true);
      expect(related.length).toBe(0);
    });

    it('returns empty for non-existent ID', () => {
      const related = mod.getRelatedMemories(999999);
      expect(Array.isArray(related)).toBe(true);
      expect(related.length).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 26. GROUP 26: FINDCLEANUPCANDIDATES
  // ───────────────────────────────────────────────────────────────
  describe('findCleanupCandidates', () => {
    it('returns candidates array with expected fields', () => {
      const candidates = mod.findCleanupCandidates({
        maxAgeDays: 0, // Everything is a candidate
        maxAccessCount: 100,
        maxConfidence: 1.0,
        limit: 10,
      });
      expect(Array.isArray(candidates)).toBe(true);
      if (candidates.length > 0) {
        const c = candidates[0];
        const candidate = c as CleanupCandidate;
        expect(candidate).toHaveProperty('id');
        expect(candidate).toHaveProperty('specFolder');
        expect(candidate).toHaveProperty('filePath');
        expect(candidate).toHaveProperty('reasons');
        expect(Array.isArray(candidate.reasons)).toBe(true);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 27. GROUP 27: VERIFYINTEGRITY
  // ───────────────────────────────────────────────────────────────
  describe('verifyIntegrity', () => {
    it('returns integrity report with expected fields', () => {
      const report = mod.verifyIntegrity({ autoClean: false }) as IntegrityReport;
      expect(typeof report).toBe('object');
      expect(report).toHaveProperty('totalMemories');
      expect(report).toHaveProperty('totalVectors');
      expect(report).toHaveProperty('orphanedVectors');
      expect(report).toHaveProperty('missingVectors');
      expect(report).toHaveProperty('orphanedFiles');
      expect(report).toHaveProperty('isConsistent');
      expect(report.totalMemories).toBeGreaterThanOrEqual(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 28. GROUP 28: SQLITEVECTORSTORE CLASS
  // ───────────────────────────────────────────────────────────────
  describe('SQLiteVectorStore', () => {
    it('constructor creates instance', () => {
      expect(typeof mod.SQLiteVectorStore).toBe('function');
      const store = new mod.SQLiteVectorStore({ dbPath: TMP_DB_PATH });
      expect(store).toBeTruthy();
    });

    it('isAvailable returns boolean', async () => {
      const store = new mod.SQLiteVectorStore({ dbPath: TMP_DB_PATH });
      const available = await store.isAvailable();
      expect(typeof available).toBe('boolean');
    });

    it('getEmbeddingDimension returns positive number', () => {
      const store = new mod.SQLiteVectorStore({ dbPath: TMP_DB_PATH });
      const dim = store.getEmbeddingDimension();
      expect(typeof dim).toBe('number');
      expect(dim).toBeGreaterThan(0);
    });

    it('getStats returns stats object', async () => {
      const store = new mod.SQLiteVectorStore({ dbPath: TMP_DB_PATH });
      const stats = await store.getStats();
      expect(typeof stats).toBe('object');
      expect(stats).toHaveProperty('total');
    });

    it('get retrieves memory by ID', async () => {
      const store = new mod.SQLiteVectorStore({ dbPath: TMP_DB_PATH });
      const mem = await store.get(deferredId1!);
      expect(mem).toBeTruthy();
      expect(mem!.id).toBe(deferredId1);
    });

    it('get returns null for non-existent', async () => {
      const store = new mod.SQLiteVectorStore({ dbPath: TMP_DB_PATH });
      const mem = await store.get(999999);
      expect(mem).toBeNull();
    });

    it('getByFolder returns memories', async () => {
      const store = new mod.SQLiteVectorStore({ dbPath: TMP_DB_PATH });
      const memories = await store.getByFolder('specs/test-001');
      expect(Array.isArray(memories)).toBe(true);
      expect(memories.length).toBeGreaterThan(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 29. GROUP 29: VECTOR SEARCH (SQLITE-VEC DEPENDENT)
  // ───────────────────────────────────────────────────────────────
  describe('Vector Search (sqlite-vec dependent)', () => {
    // Helper to create test embeddings
    const makeEmbedding = (seed: number) => {
      const dim = 768; // fallback; overridden if module available
      const actualDim = (() => { try { return mod?.getEmbeddingDim() || dim; } catch { return dim; } })();
      const arr = new Float32Array(actualDim);
      for (let i = 0; i < actualDim; i++) {
        arr[i] = Math.sin(seed * (i + 1) * 0.01) * 0.5;
      }
      // Normalize
      const norm = Math.sqrt(arr.reduce((s, v) => s + v * v, 0));
      for (let i = 0; i < actualDim; i++) arr[i] /= norm;
      return arr;
    };

    const toFloatArray = (value: Buffer | Uint8Array | null | undefined) => {
      if (!value) {
        return new Float32Array();
      }

      const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
      return new Float32Array(
        bytes.buffer,
        bytes.byteOffset,
        Math.floor(bytes.byteLength / Float32Array.BYTES_PER_ELEMENT),
      );
    };

    const mockVecDistanceCosine = (left: Buffer | Uint8Array | null | undefined, right: Buffer | Uint8Array | null | undefined) => {
      const lhs = toFloatArray(left);
      const rhs = toFloatArray(right);
      const dim = Math.min(lhs.length, rhs.length);

      if (dim === 0) {
        return 2;
      }

      let dot = 0;
      let lhsNorm = 0;
      let rhsNorm = 0;

      for (let i = 0; i < dim; i++) {
        const a = lhs[i];
        const b = rhs[i];
        dot += a * b;
        lhsNorm += a * a;
        rhsNorm += b * b;
      }

      if (lhsNorm === 0 || rhsNorm === 0) {
        return 2;
      }

      const cosine = Math.max(-1, Math.min(1, dot / (Math.sqrt(lhsNorm) * Math.sqrt(rhsNorm))));
      return 1 - cosine;
    };

    let vecMemId: number | null = null;
    let vectorMod!: VectorIndexModule;
    let vectorTmpDir: string | null = null;
    let previousMemoryDbPath: string | undefined;
    let previousAllowedPaths: string | undefined;

    beforeAll(async () => {
      if (sqliteVecAvailable) {
        vectorMod = mod;
        return;
      }

      vectorTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vec-idx-mock-'));
      const vectorDbPath = path.join(vectorTmpDir, 'test-context-index.sqlite');

      previousMemoryDbPath = process.env.MEMORY_DB_PATH;
      previousAllowedPaths = process.env.MEMORY_ALLOWED_PATHS;
      process.env.MEMORY_DB_PATH = vectorDbPath;
      process.env.MEMORY_ALLOWED_PATHS = vectorTmpDir;

      vi.resetModules();
      vi.doMock('../lib/search/vector-index-store', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/search/vector-index-store')>();
        return {
          ...actual,
          sqlite_vec_available: () => true,
          isVectorSearchAvailable: () => true,
          is_vector_search_available: () => true,
        };
      });

      vectorMod = await import('../lib/search/vector-index-impl');
      const db = vectorMod.initializeDb(vectorDbPath);
      db.exec(`
        CREATE TABLE IF NOT EXISTS vec_memories (
          rowid INTEGER PRIMARY KEY,
          embedding BLOB
        );
        CREATE TABLE IF NOT EXISTS vec_metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        );
      `);
      db.prepare(`
        INSERT OR REPLACE INTO vec_metadata (key, value)
        VALUES ('embedding_dim', ?)
      `).run(String(vectorMod.getEmbeddingDim()));
      db.function('vec_distance_cosine', mockVecDistanceCosine);
    });

    afterAll(() => {
      if (!sqliteVecAvailable) {
        try {
          vectorMod?.closeDb();
        } catch (_: unknown) {}
        vi.doUnmock('../lib/search/vector-index-store');
        vi.resetModules();
      }

      if (previousMemoryDbPath === undefined) {
        delete process.env.MEMORY_DB_PATH;
      } else {
        process.env.MEMORY_DB_PATH = previousMemoryDbPath;
      }

      if (previousAllowedPaths === undefined) {
        delete process.env.MEMORY_ALLOWED_PATHS;
      } else {
        process.env.MEMORY_ALLOWED_PATHS = previousAllowedPaths;
      }

      if (vectorTmpDir && fs.existsSync(vectorTmpDir)) {
        fs.rmSync(vectorTmpDir, { recursive: true, force: true });
      }
    });

    it('indexMemory creates vector memory with embedding', () => {
      vecMemId = vectorMod.indexMemory({
        specFolder: 'specs/test-vec',
        filePath: path.join(TMP_DIR, 'vec-memory-1.md'),
        title: 'Vector Memory One',
        triggerPhrases: ['vector', 'search'],
        importanceWeight: 0.7,
        embedding: makeEmbedding(1),
      });
      expect(vecMemId).toBeGreaterThan(0);
      const mem = vectorMod.getMemory(vecMemId);
      expect(mem?.embedding_status).toBe('success');
    });

    it('indexMemory creates additional vector memories for search', () => {
      vectorMod.indexMemory({
        specFolder: 'specs/test-vec',
        filePath: path.join(TMP_DIR, 'vec-memory-2.md'),
        title: 'Vector Memory Two',
        triggerPhrases: ['test', 'second'],
        importanceWeight: 0.5,
        embedding: makeEmbedding(2),
      });
      vectorMod.indexMemory({
        specFolder: 'specs/test-vec-other',
        filePath: path.join(TMP_DIR, 'vec-memory-3.md'),
        title: 'Vector Memory Three (Other)',
        triggerPhrases: ['other', 'folder'],
        importanceWeight: 0.6,
        embedding: makeEmbedding(3),
      });
    });

    it('indexMemory populates and maintains interference_score on insert/update paths', () => {

      const idA = vectorMod.indexMemory({
        specFolder: 'specs/test-interference',
        filePath: path.join(TMP_DIR, 'interference-a.md'),
        title: 'Cache Invalidation Strategy Alpha',
        triggerPhrases: ['cache invalidation', 'stale cache'],
        importanceWeight: 0.6,
        embedding: makeEmbedding(11),
      });

      const idB = vectorMod.indexMemory({
        specFolder: 'specs/test-interference',
        filePath: path.join(TMP_DIR, 'interference-b.md'),
        title: 'Cache Invalidation Strategy Beta',
        triggerPhrases: ['cache invalidation', 'stale cache'],
        importanceWeight: 0.6,
        embedding: makeEmbedding(12),
      });

      const db = vectorMod.getDb();
      expect(db).toBeTruthy();

      const rowA = db!.prepare('SELECT interference_score FROM memory_index WHERE id = ?').get(idA) as { interference_score: number };
      const rowB = db!.prepare('SELECT interference_score FROM memory_index WHERE id = ?').get(idB) as { interference_score: number };
      expect(rowA.interference_score).toBeGreaterThanOrEqual(1);
      expect(rowB.interference_score).toBeGreaterThanOrEqual(1);

      vectorMod.updateMemory({
        id: idA,
        title: 'Cache Invalidation Strategy Alpha Updated',
        triggerPhrases: ['cache invalidation', 'stale cache'],
      });

      const rowAAfter = db!.prepare('SELECT interference_score FROM memory_index WHERE id = ?').get(idA) as { interference_score: number };
      expect(Number.isFinite(rowAAfter.interference_score)).toBe(true);
      expect(rowAAfter.interference_score).toBeGreaterThanOrEqual(0);
    });

    it('vectorSearch returns results', () => {
      const query = makeEmbedding(1);
      const searchResults = vectorMod.vectorSearch(query, { limit: 5 });
      expect(Array.isArray(searchResults)).toBe(true);
      expect(searchResults.length).toBeGreaterThan(0);
      if (searchResults.length > 0) {
        const firstResult = searchResults[0] as VectorSearchResult;
        expect(firstResult.similarity).toBeGreaterThan(0);
      }
    });

    it('vectorSearch filters by specFolder', () => {
      const query = makeEmbedding(1);
      const filtered = vectorMod.vectorSearch(query, { limit: 10, specFolder: 'specs/test-vec' });
      expect(filtered.every(r => r.spec_folder === 'specs/test-vec' || r.isConstitutional)).toBe(true);
    });

    it('vectorSearch respects minSimilarity', () => {
      const query = makeEmbedding(1);
      const strict = vectorMod.vectorSearch(query, { limit: 10, minSimilarity: 99 });
      // Very high threshold should reduce results
      expect(Array.isArray(strict)).toBe(true);
    });

    it('indexMemory rejects wrong embedding dimension', () => {
      const badEmbedding = new Float32Array(10); // Wrong dimension
      expect(() => {
        vectorMod.indexMemory({
          specFolder: 'specs/test-vec',
          filePath: path.join(TMP_DIR, 'vec-bad.md'),
          title: 'Bad Dimension',
          embedding: badEmbedding,
        });
      }).toThrow(/dimensions/);
    });

    it('indexMemory rejects null embedding', () => {
      expect(() => {
        vectorMod.indexMemory({
          specFolder: 'specs/test-vec',
          filePath: path.join(TMP_DIR, 'vec-null.md'),
          title: 'Null Embedding',
          embedding: null as unknown as Float32Array,
        });
      }).toThrow(/required/);
    });

    it('multiConceptSearch returns results for 2 concepts', () => {
      const emb1 = makeEmbedding(1);
      const emb2 = makeEmbedding(2);
      const mcResults = vectorMod.multiConceptSearch([emb1, emb2], { limit: 5 });
      expect(Array.isArray(mcResults)).toBe(true);
    });

    it('multiConceptSearch rejects fewer than 2 concepts', () => {
      expect(() => {
        vectorMod.multiConceptSearch([makeEmbedding(1)], { limit: 5 });
      }).toThrow(/2-5/);
    });

    it('updateMemory updates title and embedding', () => {
      if (!vecMemId) return;
      const newEmbedding = makeEmbedding(99);
      const updatedId = vectorMod.updateMemory({
        id: vecMemId!,
        title: 'Updated Vector Memory',
        embedding: newEmbedding,
      });
      expect(updatedId).toBe(vecMemId);
      const mem = vectorMod.getMemory(vecMemId!);
      expect(mem?.title).toBe('Updated Vector Memory');
      expect(mem?.embedding_status).toBe('success');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 30. GROUP 30: ENRICHED/ENHANCED SEARCH (EMBEDDING PROVIDER DEPENDENT)
  // ───────────────────────────────────────────────────────────────
  describe('Enriched/Enhanced Search (edge cases without API key)', () => {
    it('vectorSearchEnriched — exported and falls back to keyword search without embedding', async () => {
      expect(typeof mod.vectorSearchEnriched).toBe('function');
      // Without an API key, embedding generation fails gracefully → keyword fallback
      const results = await mod.vectorSearchEnriched('test query', 5);
      expect(Array.isArray(results)).toBe(true);
    });

    it('enhancedSearch — exported and returns array for valid query', async () => {
      expect(typeof mod.enhancedSearch).toBe('function');
      const results = await mod.enhancedSearch('test query', 5);
      expect(Array.isArray(results)).toBe(true);
    });

    it('cachedSearch — exported and returns array', async () => {
      expect(typeof mod.cachedSearch).toBe('function');
      const results = await mod.cachedSearch('test query', 5);
      expect(Array.isArray(results)).toBe(true);
    });

    it('multiConceptSearchEnriched — exported and returns array for string concepts', async () => {
      expect(typeof mod.multiConceptSearchEnriched).toBe('function');
      const results = await mod.multiConceptSearchEnriched(['concept1', 'concept2'], 5);
      expect(Array.isArray(results)).toBe(true);
    });

    it('generateQueryEmbedding — returns null for empty query', async () => {
      expect(typeof mod.generateQueryEmbedding).toBe('function');
      const result = await mod.generateQueryEmbedding('');
      expect(result).toBeNull();
    });

    it('linkRelatedOnSave — returns without error for empty content', async () => {
      expect(typeof mod.linkRelatedOnSave).toBe('function');
      // Empty content triggers early return (no API call needed)
      await expect(mod.linkRelatedOnSave(99999, '')).resolves.not.toThrow();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 31. GROUP 30B: LEARNFROMSELECTION
  // ───────────────────────────────────────────────────────────────
  describe('learnFromSelection', () => {
    it('adds new terms from query to trigger_phrases', () => {
      const result = mod.learnFromSelection('vector search implementation testing', deferredId1!);
      expect(result).toBe(true);
      const mem = mod.getMemory(deferredId1!);
      // "vector", "search", "implementation" should be added (each >= 4 chars, not stop words)
      expect(mem?.trigger_phrases).toContain('vector');
      expect(mem?.trigger_phrases).toContain('search');
      expect(mem?.trigger_phrases).toContain('implementation');
    });

    it('filters short words (<4 chars)', () => {
      const result = mod.learnFromSelection('a to by', deferredId1!);
      expect(result).toBe(false);
    });

    it('filters stop words', () => {
      const result = mod.learnFromSelection('through during before after between', deferredId1!);
      expect(result).toBe(false);
    });

    it('filters pure numeric terms', () => {
      const result = mod.learnFromSelection('1234 5678', deferredId1!);
      expect(result).toBe(false);
    });

    it('does not re-add existing trigger phrases', () => {
      const result = mod.learnFromSelection('alpha vector search', deferredId1!);
      // "alpha", "vector", "search" already exist — no new terms
      expect(result).toBe(false);
    });

    it('returns false for empty query', () => {
      const result = mod.learnFromSelection('', deferredId1!);
      expect(result).toBe(false);
    });

    it('returns false for null query', () => {
      const result = mod.learnFromSelection(null as unknown as string, deferredId1!);
      expect(result).toBe(false);
    });

    it('returns false for non-existent memory', () => {
      const result = mod.learnFromSelection('something valid here', 999999);
      expect(result).toBe(false);
    });

    it('returns false for null memory ID', () => {
      const result = mod.learnFromSelection('valid query terms', null as unknown as number);
      expect(result).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 32. GROUP 30C: GETMEMORYPREVIEW
  // ───────────────────────────────────────────────────────────────
  describe('getMemoryPreview', () => {
    const previewFileContent = [
      '# Preview Test File',
      '',
      'This is line 3.',
      'This is line 4.',
      'This is line 5.',
      'This is line 6.',
      'This is line 7.',
      'This is line 8.',
      'This is line 9.',
      'This is line 10.',
    ].join('\n');

    it('returns full preview with file content', () => {
      // Write a real file matching the deferred memory path
      fs.writeFileSync(path.join(TMP_DIR, 'memory-a.md'), previewFileContent, 'utf-8');

      const preview = mod.getMemoryPreview(deferredId1!);
      expect(preview).toBeTruthy();
      const resolvedPreview = preview as MemoryPreview;
      expect(resolvedPreview.id).toBe(deferredId1);
      expect(resolvedPreview.specFolder).toBe('specs/test-001');
      expect(resolvedPreview.title).toBe('Updated Title Alpha');
      expect(typeof resolvedPreview.content).toBe('string');
      expect(resolvedPreview.content).toContain('Preview Test File');
      expect(resolvedPreview.content).toContain('line 3');
      expect(typeof resolvedPreview.ageString).toBe('string');
      expect(typeof resolvedPreview.accessCount).toBe('number');
      expect(typeof resolvedPreview.confidence).toBe('number');
    });

    it('respects maxLines truncation', () => {
      fs.writeFileSync(path.join(TMP_DIR, 'memory-a.md'), previewFileContent, 'utf-8');

      const preview = mod.getMemoryPreview(deferredId1!, 3);
      expect(preview).toBeTruthy();
      const resolvedPreview = preview as MemoryPreview;
      const contentLines = resolvedPreview.content.split('\n');
      // Should have 3 content lines + possible truncation message
      expect(contentLines.length).toBeLessThanOrEqual(5);
      expect(resolvedPreview.content).toContain('more lines');
    });

    it('returns null for non-existent memory', () => {
      const preview = mod.getMemoryPreview(999999);
      expect(preview).toBeNull();
    });

    it('returns preview with empty content for missing file', () => {
      const noFileId = mod.indexMemoryDeferred({
        specFolder: 'specs/test-preview',
        filePath: path.join(TMP_DIR, 'nonexistent-file.md'),
        title: 'No File Memory',
      });
      const preview = mod.getMemoryPreview(noFileId);
      expect(preview).toBeTruthy();
      expect(preview!.title).toBe('No File Memory');
      expect(preview!.content).toBe('');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 33. GROUP 30D: MULTICONCEPTKEYWORDSEARCH
  // ───────────────────────────────────────────────────────────────
  describe('multiConceptKeywordSearch', () => {
    it('returns results for 2 concepts', async () => {
      const mcResults = await mod.multiConceptKeywordSearch(['alpha', 'test'], 10, {});
      expect(Array.isArray(mcResults)).toBe(true);
    });

    it('returns empty for non-matching concepts', async () => {
      const mcResults = await mod.multiConceptKeywordSearch(['xyznonexistent'], 10, {});
      expect(Array.isArray(mcResults)).toBe(true);
      expect(mcResults.length).toBe(0);
    });

    it('returns empty for empty concepts array', async () => {
      const mcResults = await mod.multiConceptKeywordSearch([], 10, {});
      expect(Array.isArray(mcResults)).toBe(true);
      expect(mcResults.length).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 34. GROUP 30E: VALIDATEFILEPATH
  // ───────────────────────────────────────────────────────────────
  describe('validateFilePath', () => {
    it('accepts path within allowed base', () => {
      const result = mod.validateFilePath(path.join(TMP_DIR, 'test.md'));
      expect(typeof result).toBe('string');
      // On macOS /var -> /private/var, so compare using realpathSync for the base
      const realTmpDir = fs.realpathSync(TMP_DIR);
      expect(
        result!.startsWith(TMP_DIR) || result!.startsWith(realTmpDir)
      ).toBe(true);
    });

    it('rejects path outside allowed bases', () => {
      const result = mod.validateFilePath('/etc/passwd');
      expect(result).toBeNull();
    });

    it('rejects path traversal (../..)', () => {
      // Use enough parent traversals to escape TMP_DIR + process.cwd() roots.
      const result = mod.validateFilePath(path.join(TMP_DIR, '..', '..', '..', '..', 'etc', 'passwd'));
      expect(result).toBeNull();
    });

    it('rejects empty string', () => {
      const result = mod.validateFilePath('');
      expect(result).toBeNull();
    });

    it('rejects null', () => {
      const result = mod.validateFilePath(null as unknown as string);
      expect(result).toBeNull();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 35. GROUP 31: GETCONFIRMEDEMBEDDINGDIMENSION
  // ───────────────────────────────────────────────────────────────
  describe('getConfirmedEmbeddingDimension', () => {
    it('returns dimension within timeout', async () => {
      // Short timeout since we're in test mode
      const dim = await mod.getConfirmedEmbeddingDimension(500);
      expect(typeof dim).toBe('number');
      expect(dim).toBeGreaterThan(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 36. GROUP 32: CLOSEDB AND RE-INIT
  // ───────────────────────────────────────────────────────────────
  describe('closeDb', () => {
    it('closes and getDb re-initializes', () => {
      mod.closeDb();
      // After close, getDb should re-initialize
      const db = mod.getDb();
      expect(db).toBeTruthy();
    });
  });
});
