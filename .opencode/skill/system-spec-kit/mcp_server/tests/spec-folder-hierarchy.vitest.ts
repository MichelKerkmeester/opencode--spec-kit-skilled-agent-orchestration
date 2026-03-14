// TEST: Spec Folder Hierarchy
// Validates hierarchy-aware retrieval from spec folder paths.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  getParentPath,
  getAncestorPaths,
  buildHierarchyTree,
  invalidateHierarchyCache,
  getRelatedFolders,
  getSiblingPaths,
  getDescendantPaths,
  queryHierarchyMemories,
} from '../lib/search/spec-folder-hierarchy';

// ───────────────────────────────────────────────────────────────
// 1. TEST DB HELPERS
// ───────────────────────────────────────────────────────────────
function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      title TEXT,
      parent_id INTEGER,
      importance_tier TEXT DEFAULT 'normal',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  return db;
}

function insertMemory(
  db: Database.Database,
  id: number,
  specFolder: string,
  title: string | null = null,
  opts?: { parentId?: number; tier?: string },
): void {
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, title, parent_id, importance_tier)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, specFolder, title, opts?.parentId ?? null, opts?.tier ?? 'normal');
}

// ───────────────────────────────────────────────────────────────
// 2. getParentPath
// ───────────────────────────────────────────────────────────────
describe('getParentPath', () => {
  it('returns parent for 3-segment path', () => {
    expect(getParentPath('003-foo/140-bar/006-baz')).toBe('003-foo/140-bar');
  });

  it('returns parent for 2-segment path', () => {
    expect(getParentPath('003-foo/140-bar')).toBe('003-foo');
  });

  it('returns null for single-segment path', () => {
    expect(getParentPath('003-foo')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getParentPath('')).toBeNull();
  });

  it('strips trailing slashes before computing parent', () => {
    expect(getParentPath('003-foo/140-bar/')).toBe('003-foo');
  });

  it('strips multiple trailing slashes', () => {
    expect(getParentPath('003-foo/140-bar///')).toBe('003-foo');
  });

  it('handles deeply nested paths', () => {
    expect(getParentPath('a/b/c/d/e')).toBe('a/b/c/d');
  });

  it('returns null for path with leading slash only', () => {
    // "/foo" has lastSlash at 0, so <= 0 guard returns null
    expect(getParentPath('/foo')).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────────
// 3. getAncestorPaths
// ───────────────────────────────────────────────────────────────
describe('getAncestorPaths', () => {
  it('returns full ancestor chain for 3-segment path', () => {
    const ancestors = getAncestorPaths('003-foo/140-bar/006-baz');
    expect(ancestors).toEqual(['003-foo/140-bar', '003-foo']);
  });

  it('returns single ancestor for 2-segment path', () => {
    const ancestors = getAncestorPaths('003-foo/140-bar');
    expect(ancestors).toEqual(['003-foo']);
  });

  it('returns empty array for single-segment path', () => {
    expect(getAncestorPaths('003-foo')).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(getAncestorPaths('')).toEqual([]);
  });

  it('returns correct chain for 5-segment path', () => {
    const ancestors = getAncestorPaths('a/b/c/d/e');
    expect(ancestors).toEqual(['a/b/c/d', 'a/b/c', 'a/b', 'a']);
  });

  it('ancestors are ordered parent-first (nearest to farthest)', () => {
    const ancestors = getAncestorPaths('x/y/z');
    expect(ancestors[0]).toBe('x/y');
    expect(ancestors[1]).toBe('x');
  });
});

// ───────────────────────────────────────────────────────────────
// 4. buildHierarchyTree
// ───────────────────────────────────────────────────────────────
describe('buildHierarchyTree', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('builds tree with correct parent-child links', () => {
    insertMemory(db, 1, '003-foo');
    insertMemory(db, 2, '003-foo/140-bar');
    insertMemory(db, 3, '003-foo/140-bar/006-baz');

    const tree = buildHierarchyTree(db);

    const root = tree.nodeMap.get('003-foo');
    expect(root).toBeDefined();
    expect(root!.children).toHaveLength(1);
    expect(root!.children[0].path).toBe('003-foo/140-bar');

    const mid = tree.nodeMap.get('003-foo/140-bar');
    expect(mid).toBeDefined();
    expect(mid!.parent).toBe('003-foo');
    expect(mid!.children).toHaveLength(1);
    expect(mid!.children[0].path).toBe('003-foo/140-bar/006-baz');

    const leaf = tree.nodeMap.get('003-foo/140-bar/006-baz');
    expect(leaf).toBeDefined();
    expect(leaf!.parent).toBe('003-foo/140-bar');
    expect(leaf!.children).toHaveLength(0);
  });

  it('creates implicit parent nodes for gaps in hierarchy', () => {
    // Only leaf exists in DB; parent should be created implicitly with memoryCount 0
    insertMemory(db, 1, '003-foo/140-bar/006-baz');

    const tree = buildHierarchyTree(db);

    expect(tree.nodeMap.has('003-foo/140-bar')).toBe(true);
    expect(tree.nodeMap.get('003-foo/140-bar')!.memoryCount).toBe(0);

    expect(tree.nodeMap.has('003-foo')).toBe(true);
    expect(tree.nodeMap.get('003-foo')!.memoryCount).toBe(0);
  });

  it('counts memories per folder correctly', () => {
    insertMemory(db, 1, '003-foo');
    insertMemory(db, 2, '003-foo');
    insertMemory(db, 3, '003-foo');
    insertMemory(db, 4, '003-foo/140-bar');

    const tree = buildHierarchyTree(db);

    expect(tree.nodeMap.get('003-foo')!.memoryCount).toBe(3);
    expect(tree.nodeMap.get('003-foo/140-bar')!.memoryCount).toBe(1);
  });

  it('identifies roots correctly', () => {
    insertMemory(db, 1, '003-foo/140-bar');
    insertMemory(db, 2, '005-other/200-sub');

    const tree = buildHierarchyTree(db);

    const rootPaths = tree.roots.map(r => r.path).sort();
    expect(rootPaths).toEqual(['003-foo', '005-other']);
  });

  it('handles empty database gracefully', () => {
    const tree = buildHierarchyTree(db);

    expect(tree.roots).toHaveLength(0);
    expect(tree.nodeMap.size).toBe(0);
  });

  it('handles multiple siblings under one parent', () => {
    insertMemory(db, 1, '003-foo/001-alpha');
    insertMemory(db, 2, '003-foo/002-beta');
    insertMemory(db, 3, '003-foo/003-gamma');

    const tree = buildHierarchyTree(db);

    const parent = tree.nodeMap.get('003-foo');
    expect(parent).toBeDefined();
    expect(parent!.children).toHaveLength(3);

    const childPaths = parent!.children.map(c => c.path).sort();
    expect(childPaths).toEqual([
      '003-foo/001-alpha',
      '003-foo/002-beta',
      '003-foo/003-gamma',
    ]);
  });

  it('does not duplicate nodes or children', () => {
    insertMemory(db, 1, '003-foo/140-bar');
    insertMemory(db, 2, '003-foo/140-bar');
    insertMemory(db, 3, '003-foo/140-bar');

    const tree = buildHierarchyTree(db);

    // Only one node for this path, despite multiple memories
    const occurrences = [...tree.nodeMap.keys()].filter(k => k === '003-foo/140-bar');
    expect(occurrences).toHaveLength(1);

    // Root should have exactly one child, not duplicated
    const root = tree.nodeMap.get('003-foo');
    expect(root!.children).toHaveLength(1);
  });
});

// ───────────────────────────────────────────────────────────────
// 5. getSiblingPaths
// ───────────────────────────────────────────────────────────────
describe('getSiblingPaths', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns sibling folders under same parent', () => {
    insertMemory(db, 1, '003-foo/001-alpha');
    insertMemory(db, 2, '003-foo/002-beta');
    insertMemory(db, 3, '003-foo/003-gamma');

    const tree = buildHierarchyTree(db);
    const siblings = getSiblingPaths('003-foo/002-beta', tree);

    expect(siblings).toContain('003-foo/001-alpha');
    expect(siblings).toContain('003-foo/003-gamma');
    expect(siblings).not.toContain('003-foo/002-beta');
  });

  it('returns empty array for root-level folders', () => {
    insertMemory(db, 1, '003-foo');

    const tree = buildHierarchyTree(db);
    expect(getSiblingPaths('003-foo', tree)).toEqual([]);
  });

  it('returns empty array when folder has no siblings', () => {
    insertMemory(db, 1, '003-foo/001-only-child');

    const tree = buildHierarchyTree(db);
    expect(getSiblingPaths('003-foo/001-only-child', tree)).toEqual([]);
  });

  it('returns empty array when folder is not in tree', () => {
    insertMemory(db, 1, '003-foo/001-alpha');

    const tree = buildHierarchyTree(db);
    // Parent 'zzz-missing' does not exist in tree
    expect(getSiblingPaths('zzz-missing/001-alpha', tree)).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────
// 6. getDescendantPaths
// ───────────────────────────────────────────────────────────────
describe('getDescendantPaths', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns all descendants recursively', () => {
    insertMemory(db, 1, '003-foo');
    insertMemory(db, 2, '003-foo/140-bar');
    insertMemory(db, 3, '003-foo/140-bar/006-baz');
    insertMemory(db, 4, '003-foo/150-other');

    const tree = buildHierarchyTree(db);
    const descendants = getDescendantPaths('003-foo', tree);

    expect(descendants).toContain('003-foo/140-bar');
    expect(descendants).toContain('003-foo/140-bar/006-baz');
    expect(descendants).toContain('003-foo/150-other');
    expect(descendants).toHaveLength(3);
  });

  it('returns empty array for leaf nodes', () => {
    insertMemory(db, 1, '003-foo/140-bar/006-baz');

    const tree = buildHierarchyTree(db);
    expect(getDescendantPaths('003-foo/140-bar/006-baz', tree)).toEqual([]);
  });

  it('returns empty array for folder not in tree', () => {
    insertMemory(db, 1, '003-foo');

    const tree = buildHierarchyTree(db);
    expect(getDescendantPaths('zzz-nonexistent', tree)).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────
// 7. getRelatedFolders
// ───────────────────────────────────────────────────────────────
describe('getRelatedFolders', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns self + ancestors + siblings', () => {
    insertMemory(db, 1, '003-foo/001-alpha');
    insertMemory(db, 2, '003-foo/002-beta');
    insertMemory(db, 3, '003-foo/003-gamma');

    const tree = buildHierarchyTree(db);
    const related = getRelatedFolders('003-foo/002-beta', tree);

    // Self
    expect(related).toContain('003-foo/002-beta');
    // Ancestor
    expect(related).toContain('003-foo');
    // Siblings
    expect(related).toContain('003-foo/001-alpha');
    expect(related).toContain('003-foo/003-gamma');
  });

  it('self is always first in the list', () => {
    insertMemory(db, 1, '003-foo/001-alpha');
    insertMemory(db, 2, '003-foo/002-beta');

    const tree = buildHierarchyTree(db);
    const related = getRelatedFolders('003-foo/002-beta', tree);

    expect(related[0]).toBe('003-foo/002-beta');
  });

  it('ancestors appear before siblings', () => {
    insertMemory(db, 1, '003-foo/001-alpha');
    insertMemory(db, 2, '003-foo/002-beta');

    const tree = buildHierarchyTree(db);
    const related = getRelatedFolders('003-foo/002-beta', tree);

    const ancestorIdx = related.indexOf('003-foo');
    const siblingIdx = related.indexOf('003-foo/001-alpha');
    expect(ancestorIdx).toBeLessThan(siblingIdx);
  });

  it('returns only self for root-level folder with no siblings', () => {
    insertMemory(db, 1, '003-foo');

    const tree = buildHierarchyTree(db);
    const related = getRelatedFolders('003-foo', tree);

    expect(related).toEqual(['003-foo']);
  });

  it('includes all ancestors for deeply nested path', () => {
    insertMemory(db, 1, 'a/b/c/d');

    const tree = buildHierarchyTree(db);
    const related = getRelatedFolders('a/b/c/d', tree);

    expect(related).toContain('a/b/c/d');
    expect(related).toContain('a/b/c');
    expect(related).toContain('a/b');
    expect(related).toContain('a');
  });
});

// ───────────────────────────────────────────────────────────────
// 8. queryHierarchyMemories (DB integration)
// ───────────────────────────────────────────────────────────────
describe('queryHierarchyMemories', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns memories from self, parent, and sibling folders', () => {
    insertMemory(db, 1, '003-foo', 'root-memory');
    insertMemory(db, 2, '003-foo/140-bar', 'parent-memory');
    insertMemory(db, 3, '003-foo/140-bar/006-sprint', 'self-memory');
    insertMemory(db, 4, '003-foo/140-bar/007-sprint', 'sibling-memory');

    const results = queryHierarchyMemories(db, '003-foo/140-bar/006-sprint');

    expect(results.length).toBeGreaterThanOrEqual(3);

    const folders = results.map(r => r.spec_folder);
    expect(folders).toContain('003-foo/140-bar/006-sprint');
    expect(folders).toContain('003-foo/140-bar');
    expect(folders).toContain('003-foo');
  });

  it('assigns correct relevance scores', () => {
    insertMemory(db, 1, '003-foo', 'root-memory');
    insertMemory(db, 2, '003-foo/140-bar', 'parent-memory');
    insertMemory(db, 3, '003-foo/140-bar/006-sprint', 'self-memory');
    insertMemory(db, 4, '003-foo/140-bar/007-sprint', 'sibling-memory');

    const results = queryHierarchyMemories(db, '003-foo/140-bar/006-sprint');

    const selfResult = results.find(r => r.spec_folder === '003-foo/140-bar/006-sprint');
    const parentResult = results.find(r => r.spec_folder === '003-foo/140-bar');
    const rootResult = results.find(r => r.spec_folder === '003-foo');
    const siblingResult = results.find(r => r.spec_folder === '003-foo/140-bar/007-sprint');

    expect(selfResult!.relevance).toBeCloseTo(1.0, 10);
    expect(parentResult!.relevance).toBeCloseTo(0.8, 10);
    expect(rootResult!.relevance).toBeCloseTo(0.6, 10);
    expect(siblingResult!.relevance).toBeCloseTo(0.5, 10);
  });

  it('results are sorted by relevance (highest first)', () => {
    insertMemory(db, 1, '003-foo', 'root');
    insertMemory(db, 2, '003-foo/140-bar', 'parent');
    insertMemory(db, 3, '003-foo/140-bar/006-sprint', 'self');

    const results = queryHierarchyMemories(db, '003-foo/140-bar/006-sprint');

    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].relevance).toBeGreaterThanOrEqual(results[i].relevance);
    }
  });

  it('excludes deprecated memories', () => {
    insertMemory(db, 1, '003-foo/140-bar', 'deprecated-mem', { tier: 'deprecated' });
    insertMemory(db, 2, '003-foo/140-bar', 'active-mem', { tier: 'normal' });

    const results = queryHierarchyMemories(db, '003-foo/140-bar');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('active-mem');
  });

  it('excludes chunk children (parent_id not null)', () => {
    insertMemory(db, 1, '003-foo/140-bar', 'parent-record');
    insertMemory(db, 2, '003-foo/140-bar', 'chunk-child', { parentId: 1 });

    const results = queryHierarchyMemories(db, '003-foo/140-bar');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('parent-record');
  });

  it('respects limit parameter', () => {
    for (let i = 1; i <= 10; i++) {
      insertMemory(db, i, '003-foo', `memory-${i}`);
    }

    const results = queryHierarchyMemories(db, '003-foo', 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('returns empty array when no memories exist', () => {
    const results = queryHierarchyMemories(db, '003-nonexistent');
    expect(results).toEqual([]);
  });

  it('handles folder with no ancestors or siblings', () => {
    insertMemory(db, 1, '003-standalone', 'only-memory');

    const results = queryHierarchyMemories(db, '003-standalone');

    expect(results).toHaveLength(1);
    expect(results[0].relevance).toBe(1.0);
  });

  it('deep ancestor relevance floors at 0.3', () => {
    // 5 levels deep: self -> parent(0.8) -> gp(0.6) -> ggp(0.4) -> gggp(0.3)
    insertMemory(db, 1, 'a', 'root');
    insertMemory(db, 2, 'a/b', 'l2');
    insertMemory(db, 3, 'a/b/c', 'l3');
    insertMemory(db, 4, 'a/b/c/d', 'l4');
    insertMemory(db, 5, 'a/b/c/d/e', 'leaf');

    const results = queryHierarchyMemories(db, 'a/b/c/d/e');

    const rootResult = results.find(r => r.spec_folder === 'a');
    // 0.8 - 3*0.2 = 0.2, floored to 0.3
    expect(rootResult!.relevance).toBe(0.3);
  });
});

// ───────────────────────────────────────────────────────────────
// 9. Cache behavior (invalidations + TTL stale detection)
// ───────────────────────────────────────────────────────────────
describe('Hierarchy cache behavior', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    db.close();
  });

  it('returns cached tree within TTL and refreshes after explicit cache invalidation', () => {
    insertMemory(db, 1, '003-foo');
    const firstTree = buildHierarchyTree(db);

    insertMemory(db, 2, '003-foo/140-new-child');

    const cachedTree = buildHierarchyTree(db);
    expect(cachedTree).toBe(firstTree);
    expect(cachedTree.nodeMap.has('003-foo/140-new-child')).toBe(false);

    invalidateHierarchyCache(db);
    const refreshedTree = buildHierarchyTree(db);
    expect(refreshedTree).not.toBe(firstTree);
    expect(refreshedTree.nodeMap.has('003-foo/140-new-child')).toBe(true);
  });

  it('detects stale cache after TTL expiry and rebuilds hierarchy', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

    insertMemory(db, 1, '003-foo');
    const initialTree = buildHierarchyTree(db);

    insertMemory(db, 2, '003-foo/140-after-ttl');

    vi.setSystemTime(new Date('2026-01-01T00:00:30.000Z'));
    const withinTtlTree = buildHierarchyTree(db);
    expect(withinTtlTree).toBe(initialTree);
    expect(withinTtlTree.nodeMap.has('003-foo/140-after-ttl')).toBe(false);

    vi.setSystemTime(new Date('2026-01-01T00:01:01.000Z'));
    const staleRefreshedTree = buildHierarchyTree(db);
    expect(staleRefreshedTree).not.toBe(initialTree);
    expect(staleRefreshedTree.nodeMap.has('003-foo/140-after-ttl')).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// 10. EDGE CASES
// ───────────────────────────────────────────────────────────────
describe('Edge Cases', () => {
  it('getParentPath handles path with only slashes', () => {
    expect(getParentPath('///')).toBeNull();
  });

  it('getAncestorPaths handles trailing slash gracefully', () => {
    const ancestors = getAncestorPaths('003-foo/140-bar/');
    // After stripping trailing slash in getParentPath, this becomes '003-foo'
    expect(ancestors).toEqual(['003-foo']);
  });

  it('buildHierarchyTree excludes null and empty spec_folder values', () => {
    const db = createTestDb();
    // Manually insert a row with empty spec_folder (the query filters it)
    db.prepare(`INSERT INTO memory_index (id, spec_folder, title) VALUES (?, ?, ?)`).run(1, '', 'empty');
    db.prepare(`INSERT INTO memory_index (id, spec_folder, title) VALUES (?, ?, ?)`).run(2, '003-foo', 'valid');

    const tree = buildHierarchyTree(db);

    expect(tree.nodeMap.has('')).toBe(false);
    expect(tree.nodeMap.has('003-foo')).toBe(true);
  });

  it('queryHierarchyMemories with folder not in DB still resolves ancestors', () => {
    const db = createTestDb();
    insertMemory(db, 1, '003-foo', 'root-mem');
    // Query from a child that has no direct memories but ancestor does
    const results = queryHierarchyMemories(db, '003-foo/140-bar');

    expect(results).toHaveLength(1);
    expect(results[0].spec_folder).toBe('003-foo');
    expect(results[0].relevance).toBe(0.8);
  });
});
