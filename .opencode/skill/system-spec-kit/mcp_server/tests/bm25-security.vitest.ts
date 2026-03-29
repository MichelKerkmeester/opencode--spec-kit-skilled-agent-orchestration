// TEST: BM25 SECURITY
import { describe, it, expect, vi } from 'vitest';
import type BetterSqlite3 from 'better-sqlite3';
import {
  BM25Index,
  sanitizeFTS5Query,
  getTermFrequencies,
  tokenize,
  getIndex,
  resetIndex,
} from '../lib/search/bm25-index';

type BetterSqliteDatabase = InstanceType<typeof BetterSqlite3>;

type RebuildRow = {
  id: number;
  title: string | null;
  content_text: string | null;
  trigger_phrases: string | null;
  file_path: string | null;
};

function createRebuildMockDb(rows: RebuildRow[]): BetterSqliteDatabase {
  return {
    prepare: vi.fn((sql: string) => {
      if (sql.includes('SELECT id, title, content_text, trigger_phrases, file_path')) {
        return {
          all: (...ids: number[]) => rows.filter((row) => ids.includes(row.id)),
        };
      }

      if (sql.includes('SELECT id')) {
        return {
          all: () => rows.map((row) => ({ id: row.id })),
        };
      }

      throw new Error(`Unexpected SQL in BM25 rebuild test: ${sql}`);
    }),
  } as unknown as BetterSqliteDatabase;
}

describe('BM25 Security & Coverage Gap Tests', () => {
  /* ═══════════════════════════════════════════════════════════
     sanitizeFTS5Query: Basic Passthrough
  ════════════════════════════════════════════════════════════ */

  describe('sanitizeFTS5Query: Basic Passthrough', () => {
    it('S01: Normal single word', () => {
      expect(sanitizeFTS5Query('memory')).toBe('"memory"');
    });

    it('S02: Multiple normal words', () => {
      expect(sanitizeFTS5Query('memory search retrieval')).toBe('"memory" "search" "retrieval"');
    });

    it('S03: Hyphenated words preserved', () => {
      expect(sanitizeFTS5Query('real-time')).toBe('"real-time"');
    });

    it('S04: Underscored words preserved', () => {
      expect(sanitizeFTS5Query('memory_index')).toBe('"memory_index"');
    });

    it('S05: Numbers pass through', () => {
      expect(sanitizeFTS5Query('version 42')).toBe('"version" "42"');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     sanitizeFTS5Query: SQL Injection Attempts
  ════════════════════════════════════════════════════════════ */

  describe('sanitizeFTS5Query: SQL Injection Attempts', () => {
    it('S06: Classic SQL injection neutralized', () => {
      const result = sanitizeFTS5Query("'; DROP TABLE memory_index; --");
      expect(result).toContain('"');
      expect(result).not.toContain('DROP TABLE memory_index');
      expect(result).toContain('"DROP"');
      expect(result).toContain('"TABLE"');
    });

    it('S07: UNION injection — terms separated', () => {
      const result = sanitizeFTS5Query("1 UNION SELECT * FROM sqlite_master");
      expect(result).not.toContain('UNION SELECT');
      expect(result).toContain('"UNION"');
      expect(result).toContain('"SELECT"');
    });

    it('S08: Comment injection neutralized', () => {
      const result = sanitizeFTS5Query("search -- comment injection");
      expect(result).toContain('"search"');
      expect(result).toContain('"--"');
    });

    it('S09: Stacked query injection neutralized', () => {
      const result = sanitizeFTS5Query("test; DELETE FROM memory_index WHERE 1=1;");
      expect(result).toMatch(/"test[;"]?/);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     sanitizeFTS5Query: FTS5 Operator Removal
  ════════════════════════════════════════════════════════════ */

  describe('sanitizeFTS5Query: FTS5 Operator Removal', () => {
    it('S10: AND operator removed', () => {
      expect(sanitizeFTS5Query('memory AND search')).toBe('"memory" "search"');
    });

    it('S11: OR operator removed', () => {
      expect(sanitizeFTS5Query('memory OR search')).toBe('"memory" "search"');
    });

    it('S12: NOT operator removed', () => {
      expect(sanitizeFTS5Query('memory NOT deleted')).toBe('"memory" "deleted"');
    });

    it('S13: NEAR operator removed', () => {
      expect(sanitizeFTS5Query('memory NEAR search')).toBe('"memory" "search"');
    });

    it('S14: NEAR/3 proximity operator removed', () => {
      const result = sanitizeFTS5Query('memory NEAR/3 search');
      expect(result).toContain('"memory"');
      expect(result).toContain('"search"');
      expect(result).not.toContain('NEAR');
    });

    it('S15: Mixed case operators removed', () => {
      const result = sanitizeFTS5Query('memory And search Or retrieval Not deleted near context');
      expect(result.toLowerCase()).not.toContain('"and"');
      expect(result.toLowerCase()).not.toContain('"or"');
      expect(result.toLowerCase()).not.toContain('"not"');
      expect(result.toLowerCase()).not.toContain('"near"');
      expect(result).toContain('"memory"');
      expect(result).toContain('"search"');
      expect(result).toContain('"retrieval"');
      expect(result).toContain('"deleted"');
      expect(result).toContain('"context"');
    });

    it('S16: All lowercase operators removed', () => {
      const result = sanitizeFTS5Query('memory and search or retrieval not deleted near context');
      expect(result).not.toContain('"and"');
      expect(result).not.toContain('"or"');
      expect(result).not.toContain('"not"');
      expect(result).not.toContain('"near"');
    });

    it('S17: Operator substrings preserved', () => {
      expect(sanitizeFTS5Query('android')).toBe('"android"');
      expect(sanitizeFTS5Query('fortune')).toBe('"fortune"');
      expect(sanitizeFTS5Query('notable')).toBe('"notable"');
      expect(sanitizeFTS5Query('nearby')).toBe('"nearby"');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     sanitizeFTS5Query: Special Character Handling
  ════════════════════════════════════════════════════════════ */

  describe('sanitizeFTS5Query: Special Character Handling', () => {
    it('S18: Wildcard * removed', () => {
      expect(sanitizeFTS5Query('mem* search')).toBe('"mem" "search"');
    });

    it('S19: Caret ^ removed', () => {
      expect(sanitizeFTS5Query('^memory search')).toBe('"memory" "search"');
    });

    it('S20: Parentheses removed', () => {
      expect(sanitizeFTS5Query('(memory search)')).toBe('"memory" "search"');
    });

    it('S21: Curly braces removed', () => {
      expect(sanitizeFTS5Query('{memory}')).toBe('"memory"');
    });

    it('S22: Square brackets removed', () => {
      expect(sanitizeFTS5Query('[memory]')).toBe('"memory"');
    });

    it('S23: Double quotes removed', () => {
      expect(sanitizeFTS5Query('"exact phrase"')).toBe('"exact" "phrase"');
    });

    it('S24: Column filter colon replaced with space', () => {
      expect(sanitizeFTS5Query('title:memory')).toBe('"title" "memory"');
    });

    it('S25: Multiple colons replaced', () => {
      expect(sanitizeFTS5Query('col1:val1 col2:val2')).toBe('"col1" "val1" "col2" "val2"');
    });

    it('S26: Non-FTS5 special chars preserved', () => {
      expect(sanitizeFTS5Query('!alert @user #tag $var %mod &ref')).toBe('"!alert" "@user" "#tag" "$var" "%mod" "&ref"');
    });

    it('S27: All FTS5 specials removed at once', () => {
      expect(sanitizeFTS5Query('*^(){}[]":test')).toBe('"test"');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     sanitizeFTS5Query: Whitespace & Empty Input
  ════════════════════════════════════════════════════════════ */

  describe('sanitizeFTS5Query: Whitespace & Empty Input', () => {
    it('S28: Empty string returns empty string', () => {
      expect(sanitizeFTS5Query('')).toBe('');
    });

    it('S29: Whitespace-only returns empty string', () => {
      expect(sanitizeFTS5Query('   ')).toBe('');
    });

    it('S30: Leading/trailing whitespace trimmed', () => {
      expect(sanitizeFTS5Query('  memory  ')).toBe('"memory"');
    });

    it('S31: Consecutive spaces collapsed', () => {
      expect(sanitizeFTS5Query('memory    search     retrieval')).toBe('"memory" "search" "retrieval"');
    });

    it('S32: Tabs treated as whitespace', () => {
      expect(sanitizeFTS5Query('memory\tsearch')).toBe('"memory" "search"');
    });

    it('S33: Newlines treated as whitespace', () => {
      expect(sanitizeFTS5Query('memory\nsearch\nretrieval')).toBe('"memory" "search" "retrieval"');
    });

    it('S34: Only operators returns empty string', () => {
      expect(sanitizeFTS5Query('AND OR NOT NEAR')).toBe('');
    });

    it('S35: Only special chars returns empty string', () => {
      expect(sanitizeFTS5Query('*^(){}[]"')).toBe('');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     sanitizeFTS5Query: Unicode & Encoding
  ════════════════════════════════════════════════════════════ */

  describe('sanitizeFTS5Query: Unicode & Encoding', () => {
    it('S36: Unicode accented chars preserved', () => {
      // Input is NFD (decomposed); sanitizeFTS5Query preserves encoding as-is
      expect(sanitizeFTS5Query('cafe\u0301 re\u0301sume\u0301')).toBe('"cafe\u0301" "re\u0301sume\u0301"');
    });

    it('S37: CJK characters preserved', () => {
      expect(sanitizeFTS5Query('\u30e1\u30e2\u30ea \u691c\u7d22')).toBe('"\u30e1\u30e2\u30ea" "\u691c\u7d22"');
    });

    it('S38: Emoji preserved', () => {
      expect(sanitizeFTS5Query('\ud83d\udd0d search')).toBe('"\ud83d\udd0d" "search"');
    });

    it('S39: Null bytes handled without crash', () => {
      const result = sanitizeFTS5Query('hello\x00world');
      expect(typeof result).toBe('string');
      expect(result).toContain('"hello');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     sanitizeFTS5Query: Complex Attack Vectors
  ════════════════════════════════════════════════════════════ */

  describe('sanitizeFTS5Query: Complex Attack Vectors', () => {
    it('S40: Nested quotes injection neutralized', () => {
      const result = sanitizeFTS5Query('test" OR "1"="1');
      expect(result).not.toContain('OR');
      expect(result).toContain('"test"');
    });

    it('S41: Column filter injection neutralized', () => {
      expect(sanitizeFTS5Query('content:memory OR title:admin')).toBe('"content" "memory" "title" "admin"');
    });

    it('S42: Prefix wildcard removed', () => {
      expect(sanitizeFTS5Query('mem*')).toBe('"mem"');
    });

    it('S43: Very long input truncated at 2000 chars', () => {
      const longInput = 'memory '.repeat(500).trim();
      const result = sanitizeFTS5Query(longInput);
      const termCount = result.split('" "').length;
      expect(typeof result).toBe('string');
      // Input is 3499 chars, truncated to 2000 → ~286 terms (2000/7 ≈ 285.7 + partial)
      expect(termCount).toBeLessThanOrEqual(300);
      expect(termCount).toBeGreaterThanOrEqual(280);
      expect(result).toMatch(/^"memory"/);
    });

    it('S44: Combined attack vector neutralized', () => {
      const result = sanitizeFTS5Query('(memory AND search*) OR NOT "title":admin NEAR/5 secret');
      expect(result).toContain('"memory"');
      expect(result).toContain('"search"');
      expect(result).toContain('"admin"');
      expect(result).toContain('"secret"');
      expect(result).not.toContain('AND');
      expect(result).not.toContain('OR');
      expect(result).not.toContain('NOT');
      expect(result).not.toContain('NEAR');
    });

    it('S45: Backslash sequences preserved', () => {
      expect(sanitizeFTS5Query('path\\to\\file')).toBe('"path\\to\\file"');
    });

    it('S46: Output format — all terms individually quoted', () => {
      const result = sanitizeFTS5Query('hello world test');
      const terms = result.split(' ');
      expect(terms.length).toBe(3);
      expect(terms.every((t: string) => t.startsWith('"') && t.endsWith('"'))).toBe(true);
    });

    it('S47: Single char after operator removal', () => {
      expect(sanitizeFTS5Query('OR x')).toBe('"x"');
    });

    it('S48: Operators at all positions removed', () => {
      expect(sanitizeFTS5Query('NOT memory AND search OR')).toBe('"memory" "search"');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     getTermFrequencies: Coverage
  ════════════════════════════════════════════════════════════ */

  describe('getTermFrequencies', () => {
    it('TF01: Empty array returns empty Map', () => {
      const freq = getTermFrequencies([]);
      expect(freq).toBeInstanceOf(Map);
      expect(freq.size).toBe(0);
    });

    it('TF02: Single token count=1', () => {
      const freq = getTermFrequencies(['memory']);
      expect(freq.get('memory')).toBe(1);
    });

    it('TF03: Repeated tokens counted', () => {
      const freq = getTermFrequencies(['memory', 'search', 'memory', 'memory', 'search']);
      expect(freq.get('memory')).toBe(3);
      expect(freq.get('search')).toBe(2);
    });

    it('TF04: All unique tokens count=1', () => {
      const freq = getTermFrequencies(['alpha', 'beta', 'gamma', 'delta']);
      expect(['alpha', 'beta', 'gamma', 'delta'].every(t => freq.get(t) === 1)).toBe(true);
      expect(freq.size).toBe(4);
    });

    it('TF05: Returns Map instance', () => {
      const freq = getTermFrequencies(['test']);
      expect(freq).toBeInstanceOf(Map);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     rebuildFromDatabase: Coverage
  ════════════════════════════════════════════════════════════ */

  describe('rebuildFromDatabase', () => {
    it('RD01: Database error returns 0', () => {
      const index = new BM25Index();
      const mockDb = {
        prepare: () => { throw new Error('Database is locked'); },
      };
      const count = index.rebuildFromDatabase(mockDb as unknown as BetterSqliteDatabase);
      expect(count).toBe(0);
    });

    it('RD02: Empty result set — clears & returns 0', () => {
      const index = new BM25Index();
      index.addDocument('existing', 'some content that should be cleared');
      const mockDb = {
        prepare: () => ({ all: () => [] }),
      };
      const count = index.rebuildFromDatabase(mockDb as unknown as BetterSqliteDatabase);
      const stats = index.getStats();
      expect(count).toBe(0);
      expect(stats.documentCount).toBe(0);
    });

    it('RD03: Rows indexed successfully', () => {
      vi.useFakeTimers();
      const index = new BM25Index();
      const mockDb = createRebuildMockDb([
        { id: 1, title: 'Memory System', content_text: 'Semantic search retrieval', trigger_phrases: 'memory,search', file_path: 'specs/001/spec.md' },
        { id: 2, title: 'Index Management', content_text: 'BM25 indexing pipeline', trigger_phrases: 'index,bm25', file_path: 'specs/002/spec.md' },
      ]);

      try {
        const count = index.rebuildFromDatabase(mockDb);
        expect(count).toBe(2);
        expect(index.getStats().documentCount).toBe(0);

        vi.runAllTimers();

        expect(index.getStats().documentCount).toBe(2);
      } finally {
        vi.useRealTimers();
      }
    });

    it('RD04: Null fields handled', () => {
      vi.useFakeTimers();
      const index = new BM25Index();
      const mockDb = createRebuildMockDb([
        { id: 10, title: 'Title Only', content_text: null, trigger_phrases: null, file_path: null },
        { id: 11, title: null, content_text: 'Content only text here', trigger_phrases: null, file_path: null },
      ]);

      try {
        const count = index.rebuildFromDatabase(mockDb);
        expect(count).toBe(2);
        expect(index.getStats().documentCount).toBe(0);

        vi.runAllTimers();

        expect(index.getStats().documentCount).toBe(2);
      } finally {
        vi.useRealTimers();
      }
    });

    it('RD05: Empty rows skipped, valid rows indexed', () => {
      vi.useFakeTimers();
      const index = new BM25Index();
      const mockDb = createRebuildMockDb([
        { id: 20, title: null, content_text: null, trigger_phrases: null, file_path: null },
        { id: 21, title: '', content_text: '', trigger_phrases: '', file_path: '' },
        { id: 22, title: 'Valid', content_text: 'Valid content here', trigger_phrases: null, file_path: null },
      ]);

      try {
        const count = index.rebuildFromDatabase(mockDb);
        expect(count).toBe(3);
        expect(index.getStats().documentCount).toBe(0);

        vi.runAllTimers();

        expect(index.getStats().documentCount).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it('RD06: Pre-existing docs cleared before rebuild', () => {
      vi.useFakeTimers();
      const index = new BM25Index();
      index.addDocument('pre-existing-1', 'this should be cleared before rebuild');
      index.addDocument('pre-existing-2', 'another doc to be cleared');
      const mockDb = createRebuildMockDb([
        { id: 100, title: 'Fresh', content_text: 'Fresh content only', trigger_phrases: null, file_path: null },
      ]);

      try {
        const count = index.rebuildFromDatabase(mockDb);
        expect(count).toBe(1);
        expect(index.getStats().documentCount).toBe(0);

        vi.runAllTimers();

        expect(index.getStats().documentCount).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════
     CamelCase Method Tests
  ════════════════════════════════════════════════════════════ */

  describe('CamelCase Method Tests', () => {
    it('DA01: addDocument works', () => {
      const index = new BM25Index();
      index.addDocument('alias1', 'test content for alias testing');
      expect(index.getStats().documentCount).toBe(1);
    });

    it('DA02: removeDocument works', () => {
      const index = new BM25Index();
      index.addDocument('alias2', 'test content for removal testing');
      const removed = index.removeDocument('alias2');
      expect(removed).toBe(true);
      expect(index.getStats().documentCount).toBe(0);
    });

    it('DA03: calculateIdf works', () => {
      const index = new BM25Index();
      index.addDocument('idf1', 'memory search retrieval testing');
      index.addDocument('idf2', 'different content about indexing');
      const idf = index.calculateIdf('memory');
      expect(typeof idf).toBe('number');
      expect(idf).toBeGreaterThanOrEqual(0);
    });

    it('DA04: calculateScore works', () => {
      const index = new BM25Index();
      index.addDocument('score1', 'memory search retrieval testing context');
      const score = index.calculateScore(['memory'], 'score1');
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThan(0);
    });

    it('DA05: addDocuments works', () => {
      const index = new BM25Index();
      index.addDocuments([
        { id: 'bulk-a1', text: 'first bulk document content' },
        { id: 'bulk-a2', text: 'second bulk document content' },
      ]);
      expect(index.getStats().documentCount).toBe(2);
    });
  });
});
