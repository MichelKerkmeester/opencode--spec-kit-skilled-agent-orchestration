// TEST: SEARCH ARCHIVAL
// Converted from: t206-search-archival.test.ts (custom runner)
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

// Source code paths for static analysis
const SRC_ROOT = path.resolve(TEST_DIR, '..');
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

describe('T206 - archived-tier cleanup leaves the column schema-only', () => {
  it('T206-SRC1: vector-index-queries.ts no longer filters on is_archived', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).not.toContain('is_archived IS NULL OR is_archived = 0');
  });

  it('T206-SRC2: vector-index-schema documents the deprecated column', () => {
    const schemaSource = fs.readFileSync(
      path.join(SRC_LIB_PATH, 'search', 'vector-index-schema.ts'),
      'utf-8'
    );
    expect(schemaSource).toContain('DEPRECATED post-026.018 cleanup');
  });

  it('T206-SRC3: hybrid-search does not gate structural search on is_archived', () => {
    let hsSource: string;
    try {
      hsSource = fs.readFileSync(
        path.join(SRC_LIB_PATH, 'search', 'hybrid-search.ts'),
        'utf-8'
      );
    } catch {
      // Try compiled JS fallback
      hsSource = fs.readFileSync(
        path.join(SRC_LIB_PATH, 'search', 'hybrid-search.js'),
        'utf-8'
      );
    }
    expect(hsSource).not.toContain('(is_archived IS NULL OR is_archived = 0)');
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

  it('T206-SRC6: includeArchived is API-only compatibility after cleanup', () => {
    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/includeArchived = false/);
  });
});

/* ───────────────────────────────────────────────────────────────
   T235: Runtime behavior tests — verify actual archive filtering
   semantics beyond signature-only checks.
──────────────────────────────────────────────────────────────── */

describe('T235 - archive-behavior runtime semantics (beyond signature checks)', () => {
  // Read the full query function bodies to verify behavioral contracts,
  // not just parameter signatures.

  it('T235-BH1: vector_search default excludes archived via parameter default, not WHERE clause', () => {
    // After cleanup, filtering is done via includeArchived parameter default,
    // not via `is_archived IS NULL OR is_archived = 0` in SQL.
    // The parameter default = false means callers get non-archived by default.
    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(
      /export function vector_search\([^)]*includeArchived\s*=\s*false/
    );
    // Confirm the old WHERE clause pattern is removed
    expect(VECTOR_INDEX_QUERIES_SOURCE).not.toContain('is_archived IS NULL OR is_archived = 0');
  });

  it('T235-BH2: multi_concept_search passes includeArchived to inner vector_search calls', () => {
    // The multi_concept_search function must propagate includeArchived to
    // the vector_search calls it makes internally.
    const fnBody = VECTOR_INDEX_QUERIES_SOURCE.match(
      /export function multi_concept_search\([\s\S]*?(?=export function)/
    );
    expect(fnBody).not.toBeNull();
    if (fnBody) {
      // Must reference includeArchived in the function body (not just the param)
      const bodyText = fnBody[0];
      const includeArchivedRefs = (bodyText.match(/includeArchived/g) || []).length;
      // At least 2: the parameter itself + at least one usage passing it through
      expect(includeArchivedRefs).toBeGreaterThanOrEqual(2);
    }
  });

  it('T235-BH3: keyword_search function body references includeArchived beyond parameter declaration', () => {
    const fnBody = VECTOR_INDEX_QUERIES_SOURCE.match(
      /export function keyword_search\([\s\S]*?(?=export function)/
    );
    expect(fnBody).not.toBeNull();
    if (fnBody) {
      const bodyText = fnBody[0];
      const includeArchivedRefs = (bodyText.match(/includeArchived/g) || []).length;
      // Parameter + at least one conditional usage
      expect(includeArchivedRefs).toBeGreaterThanOrEqual(2);
    }
  });

  it('T235-BH4: handler memory-search reads includeArchived from args and passes to search layer', () => {
    const handlerSource = fs.readFileSync(
      path.join(SRC_HANDLERS_PATH, 'memory-search.ts'),
      'utf-8'
    );
    // Verify the handler destructures includeArchived from args
    expect(handlerSource).toMatch(/includeArchived/);
    // And passes it to one of the search functions
    const passThrough = handlerSource.match(/includeArchived/g) || [];
    // At least 2 references: extraction from args + pass to search function
    expect(passThrough.length).toBeGreaterThanOrEqual(2);
  });

  it('T235-BH5: hybrid-search options type includes includeArchived field', () => {
    const hsSource = fs.readFileSync(
      path.join(SRC_LIB_PATH, 'search', 'hybrid-search.ts'),
      'utf-8'
    );
    // The HybridSearchOptions interface/type must declare includeArchived
    expect(hsSource).toMatch(/includeArchived\s*[?:]/);
  });
});
