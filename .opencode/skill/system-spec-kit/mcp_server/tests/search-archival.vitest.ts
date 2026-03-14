// TEST: SEARCH ARCHIVAL
// Converted from: t206-search-archival.test.ts (custom runner)
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve(process.cwd(), 'tests');

// Source code paths for static analysis
const SRC_ROOT = path.resolve(__dirname, '..');
const SRC_LIB_PATH = path.join(SRC_ROOT, 'lib');
const SRC_HANDLERS_PATH = path.join(SRC_ROOT, 'handlers');
const VECTOR_INDEX_QUERIES_SOURCE = fs.readFileSync(
  path.join(SRC_LIB_PATH, 'search', 'vector-index-queries.ts'),
  'utf-8'
);

/* ───────────────────────────────────────────────────────────────
   Module loading — vector-index-impl.ts is plain JS and DB-dependent.
   Signature tests that call the functions need the DB, so they are skipped.
──────────────────────────────────────────────────────────────── */

describe('T206 - vector_search accepts includeArchived [deferred - DB dependency]', () => {
  it('T206-VS1: vectorSearch is exported', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('export { vector_search as vectorSearch };');
  });

  it('T206-VS2: vectorSearch accepts includeArchived option', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function vector_search\([\s\S]*?includeArchived = false/);
  });
});

describe('T206 - multi_concept_search accepts includeArchived [deferred - DB dependency]', () => {
  it('T206-MC1: multiConceptSearch is exported', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('export { multi_concept_search as multiConceptSearch };');
  });

  it('T206-MC2: multiConceptSearch accepts includeArchived', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function multi_concept_search\([\s\S]*?includeArchived = false/);
  });
});

describe('T206 - keyword_search accepts includeArchived [deferred - DB dependency]', () => {
  it('T206-KW1: keywordSearch is exported', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('export { keyword_search as keywordSearch };');
  });

  it('T206-KW2: keywordSearch accepts includeArchived', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function keyword_search\([\s\S]*?includeArchived = false/);
  });
});

describe('T206 - getConstitutionalMemories accepts includeArchived [deferred - DB dependency]', () => {
  it('T206-CM1: getConstitutionalMemories is exported', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('export { get_constitutional_memories_public as getConstitutionalMemories };');
  });

  it('T206-CM2: getConstitutionalMemories accepts includeArchived', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function get_constitutional_memories_public\([\s\S]*?includeArchived = false/);
  });
});

/* ───────────────────────────────────────────────────────────────
   Source code static analysis — these tests read source files directly
   and can run without DB dependencies.
──────────────────────────────────────────────────────────────── */

describe('T206 - Source code contains is_archived filter', () => {
  it('T206-SRC1: vector-index-queries.ts has is_archived filters (>= 3)', () => {
    const vsFilterCount = (VECTOR_INDEX_QUERIES_SOURCE.match(/is_archived IS NULL OR.*is_archived\s*=\s*0/g) || []).length;
    expect(vsFilterCount).toBeGreaterThanOrEqual(3);
  });

  it('T206-SRC2: multi_concept_search uses archival_filter', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('archival_filter');
    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('${archival_filter}');
  });

  it('T206-SRC3: hybrid-search has is_archived filter in ftsSearch', () => {
    let hsSource: string;
    try {
      hsSource = fs.readFileSync(
        path.join(SRC_LIB_PATH, 'search', 'hybrid-search.ts'),
        'utf-8'
      );
    } catch {
      // Try compiled JS fallback
      hsSource = fs.readFileSync(
        path.join(__dirname, '..', 'lib', 'search', 'hybrid-search.js'),
        'utf-8'
      );
    }
    expect(hsSource).toContain('is_archived');
  });

  it('T206-SRC4: HybridSearchOptions has includeArchived', () => {
    const hsTs = fs.readFileSync(
      path.join(SRC_LIB_PATH, 'search', 'hybrid-search.ts'),
      'utf-8'
    );
    expect(hsTs).toContain('includeArchived');
  });

  it('T206-SRC5: memory-search handler references includeArchived', () => {
    const handlerSource = fs.readFileSync(
      path.join(SRC_HANDLERS_PATH, 'memory-search.ts'),
      'utf-8'
    );
    expect(handlerSource).toContain('includeArchived');
    const count = (handlerSource.match(/includeArchived/g) || []).length;
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('T206-SRC6: Filter is NULL-safe (IS NULL OR = 0 pattern)', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('is_archived IS NULL OR is_archived = 0');
  });
});
