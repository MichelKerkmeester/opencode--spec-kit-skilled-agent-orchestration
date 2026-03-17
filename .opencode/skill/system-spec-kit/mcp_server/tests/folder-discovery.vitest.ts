// ───────────────────────────────────────────────────────────────
// 1. TEST — FOLDER DISCOVERY
// ───────────────────────────────────────────────────────────────
// Tests: extractDescription, extractKeywords, findRelevantFolders,
// GenerateFolderDescriptions, loadDescriptionCache,
// SaveDescriptionCache, PerFolderDescription operations

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  extractDescription,
  extractKeywords,
  findRelevantFolders,
  generateFolderDescriptions,
  loadDescriptionCache,
  saveDescriptionCache,
  generatePerFolderDescription,
  loadPerFolderDescription,
  savePerFolderDescription,
  isPerFolderDescriptionStale,
  slugifyFolderName,
} from '../lib/search/folder-discovery';
import type { FolderDescription, DescriptionCache, PerFolderDescription } from '../lib/search/folder-discovery';

/* ───────────────────────────────────────────────────────────────
   1. extractDescription — spec.md content parsing
----------------------------------------------------------------*/

describe('T009 extractDescription', () => {
  it('extracts title from first # heading', () => {
    const content = `# Hybrid RAG Fusion Refinement\n\nThis spec describes the hybrid approach.`;
    expect(extractDescription(content)).toBe('Hybrid RAG Fusion Refinement');
  });

  it('extracts title when heading has extra whitespace', () => {
    const content = `#  My Spec Title Here  \n\nSome description below.`;
    expect(extractDescription(content)).toBe('My Spec Title Here');
  });

  it('extracts problem statement when no # heading is present', () => {
    const content = `## Problem Statement\n\nThe memory system lacks efficient folder routing for queries.\n\nMore detail here.`;
    expect(extractDescription(content)).toBe('The memory system lacks efficient folder routing for queries');
  });

  it('extracts problem statement for "Problem & Purpose" heading variant', () => {
    const content = `## Problem & Purpose\n\nThis module improves retrieval precision.`;
    expect(extractDescription(content)).toBe('This module improves retrieval precision');
  });

  it('extracts first non-heading line when no title or problem section exists', () => {
    const content = `\n\nThis is a plain description without any headings at all.`;
    expect(extractDescription(content)).toBe('This is a plain description without any headings at all');
  });

  it('handles empty string input', () => {
    expect(extractDescription('')).toBe('');
  });

  it('handles whitespace-only input', () => {
    expect(extractDescription('   \n\n  ')).toBe('');
  });

  it('handles null/undefined input gracefully', () => {
    expect(extractDescription(null as unknown as string)).toBe('');
    expect(extractDescription(undefined as unknown as string)).toBe('');
  });

  it('truncates description to 150 characters maximum', () => {
    const longTitle = '# ' + 'A'.repeat(200);
    const result = extractDescription(longTitle);
    expect(result.length).toBeLessThanOrEqual(150);
  });

  it('strips markdown bold markers from extracted text', () => {
    const content = `## Overview\n\n**Implements** a new caching layer for folder routing.`;
    const result = extractDescription(content);
    expect(result).not.toContain('**');
  });

  it('takes only first sentence (before period-space) from longer text', () => {
    const content = `## Problem Statement\n\nThis solves caching. It also does other things. More words here.`;
    const result = extractDescription(content);
    expect(result).toBe('This solves caching');
  });

  it('strips YAML frontmatter before parsing', () => {
    const content = `---\ntitle: My Spec\nstatus: active\n---\n# Real Title Here\n\nBody content.`;
    expect(extractDescription(content)).toBe('Real Title Here');
  });

  it('returns empty string for frontmatter-only content', () => {
    expect(extractDescription('---\ntitle: X\n---')).toBe('');
  });

  it('truncates long title to exactly 150 characters', () => {
    const longTitle = '# ' + 'B'.repeat(200);
    const result = extractDescription(longTitle);
    expect(result.length).toBe(150);
  });
});

/* ───────────────────────────────────────────────────────────────
   2. extractKeywords — stop word filtering and deduplication
----------------------------------------------------------------*/

describe('T009 extractKeywords', () => {
  it('returns significant words from a description', () => {
    const keywords = extractKeywords('Hybrid RAG fusion for memory retrieval');
    expect(keywords).toContain('hybrid');
    expect(keywords).toContain('rag');
    expect(keywords).toContain('fusion');
    expect(keywords).toContain('memory');
    expect(keywords).toContain('retrieval');
  });

  it('filters common stop words', () => {
    const keywords = extractKeywords('The memory system is a key part of the architecture');
    expect(keywords).not.toContain('the');
    expect(keywords).not.toContain('is');
    expect(keywords).not.toContain('a');
    expect(keywords).not.toContain('of');
  });

  it('filters words shorter than 3 characters', () => {
    const keywords = extractKeywords('An AI to do it all for us');
    expect(keywords).not.toContain('an');
    expect(keywords).not.toContain('to');
    expect(keywords).not.toContain('do');
    expect(keywords).not.toContain('it');
  });

  it('deduplicates identical keywords', () => {
    const keywords = extractKeywords('memory memory memory search search');
    const memCount = keywords.filter(k => k === 'memory').length;
    const searchCount = keywords.filter(k => k === 'search').length;
    expect(memCount).toBe(1);
    expect(searchCount).toBe(1);
  });

  it('lowercases all keywords', () => {
    const keywords = extractKeywords('BM25 Vector Hybrid SEARCH');
    expect(keywords).toContain('bm25');
    expect(keywords).toContain('vector');
    expect(keywords).toContain('hybrid');
    expect(keywords).toContain('search');
  });

  it('handles empty string input', () => {
    expect(extractKeywords('')).toEqual([]);
  });

  it('handles null/undefined input gracefully', () => {
    expect(extractKeywords(null as unknown as string)).toEqual([]);
    expect(extractKeywords(undefined as unknown as string)).toEqual([]);
  });

  it('handles description with only stop words', () => {
    const keywords = extractKeywords('the and or but is was were');
    expect(keywords).toEqual([]);
  });
});

/* ───────────────────────────────────────────────────────────────
   3. findRelevantFolders — keyword overlap scoring
----------------------------------------------------------------*/

describe('T009 findRelevantFolders', () => {
  const mockCache: DescriptionCache = {
    version: 1,
    generated: '2026-02-27T00:00:00.000Z',
    folders: [
      {
        specFolder: 'specs/001-auth',
        description: 'Authentication and authorization system for user login',
        keywords: ['authentication', 'authorization', 'system', 'user', 'login'],
        lastUpdated: '2026-02-27T00:00:00.000Z',
      },
      {
        specFolder: 'specs/002-memory',
        description: 'Semantic memory search with vector embeddings and BM25 index',
        keywords: ['semantic', 'memory', 'search', 'vector', 'embeddings', 'bm25', 'index'],
        lastUpdated: '2026-02-27T00:00:00.000Z',
      },
      {
        specFolder: 'specs/003-hybrid-rag',
        description: 'Hybrid RAG fusion pipeline combining vector and keyword retrieval',
        keywords: ['hybrid', 'rag', 'fusion', 'pipeline', 'combining', 'vector', 'keyword', 'retrieval'],
        lastUpdated: '2026-02-27T00:00:00.000Z',
      },
      {
        specFolder: 'specs/004-caching',
        description: 'Cache layer for fast folder description lookup and routing',
        keywords: ['cache', 'layer', 'fast', 'folder', 'description', 'lookup', 'routing'],
        lastUpdated: '2026-02-27T00:00:00.000Z',
      },
    ],
  };

  it('returns ranked results for a matching query', () => {
    const results = findRelevantFolders('vector search memory', mockCache);
    expect(results.length).toBeGreaterThan(0);
    // Specs/002-memory should score highly — has 'vector', 'memory', 'search'
    const memoryResult = results.find(r => r.specFolder === 'specs/002-memory');
    expect(memoryResult).toBeDefined();
    expect(memoryResult!.relevanceScore).toBeGreaterThan(0);
  });

  it('returns highest-scoring folder first', () => {
    const results = findRelevantFolders('hybrid rag fusion vector', mockCache);
    expect(results.length).toBeGreaterThan(0);
    // Each result score should be >= the next
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].relevanceScore).toBeGreaterThanOrEqual(results[i + 1].relevanceScore);
    }
  });

  it('returns empty array for a query with no keyword matches', () => {
    const results = findRelevantFolders('xyzzy completely unrelated nonsense term', mockCache);
    expect(results).toEqual([]);
  });

  it('respects the limit parameter', () => {
    // Use a query that matches multiple folders
    const results = findRelevantFolders('vector search routing', mockCache, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('defaults limit to 3 when not specified', () => {
    // All 4 folders have some overlap with a broad query
    const broadResults = findRelevantFolders('system memory vector fusion cache', mockCache);
    expect(broadResults.length).toBeLessThanOrEqual(3);
  });

  it('returns relevanceScore between 0 and 1 exclusive-inclusive', () => {
    const results = findRelevantFolders('memory search', mockCache);
    for (const r of results) {
      expect(r.relevanceScore).toBeGreaterThan(0);
      expect(r.relevanceScore).toBeLessThanOrEqual(1);
    }
  });

  it('handles empty query gracefully', () => {
    expect(findRelevantFolders('', mockCache)).toEqual([]);
  });

  it('handles cache with no folders', () => {
    const emptyCache: DescriptionCache = { version: 1, generated: '', folders: [] };
    expect(findRelevantFolders('memory search', emptyCache)).toEqual([]);
  });

  it('handles null cache gracefully', () => {
    expect(findRelevantFolders('memory', null as unknown as DescriptionCache)).toEqual([]);
  });

  it('scores perfect match (all query terms match) as 1.0', () => {
    // Query with exactly 1 term that exists in the folder's keywords
    const cache: DescriptionCache = {
      version: 1,
      generated: '',
      folders: [
        {
          specFolder: 'specs/test',
          description: 'authentication system',
          keywords: ['authentication', 'system'],
          lastUpdated: '',
        },
      ],
    };
    // Query: single keyword that exactly matches
    const results = findRelevantFolders('authentication system', cache);
    expect(results.length).toBe(1);
    expect(results[0].relevanceScore).toBe(1.0);
  });
});

/* ───────────────────────────────────────────────────────────────
   4. generateFolderDescriptions — file system scanning
----------------------------------------------------------------*/

describe('T009 generateFolderDescriptions', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'folder-discovery-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('generates descriptions from multiple spec folders', () => {
    // Create two spec folders, each with a spec.md
    const specA = path.join(tmpDir, '001-auth');
    const specB = path.join(tmpDir, '002-memory');
    fs.mkdirSync(specA, { recursive: true });
    fs.mkdirSync(specB, { recursive: true });
    fs.writeFileSync(path.join(specA, 'spec.md'), '# Authentication System\n\nHandles login and tokens.', 'utf-8');
    fs.writeFileSync(path.join(specB, 'spec.md'), '# Memory Search Module\n\nProvides semantic retrieval.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);

    expect(cache.folders).toHaveLength(2);
    const folderNames = cache.folders.map(f => path.basename(f.specFolder));
    expect(folderNames).toContain('001-auth');
    expect(folderNames).toContain('002-memory');
  });

  it('extracts correct descriptions from spec.md content', () => {
    const specDir = path.join(tmpDir, '001-test');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Test Specification\n\nThis is the body.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);

    const folder = cache.folders.find(f => f.specFolder === '001-test');
    expect(folder).toBeDefined();
    expect(folder!.description).toBe('Test Specification');
  });

  it('skips folders without a spec.md file', () => {
    const noSpec = path.join(tmpDir, 'no-spec-here');
    const withSpec = path.join(tmpDir, 'has-spec');
    fs.mkdirSync(noSpec, { recursive: true });
    fs.mkdirSync(withSpec, { recursive: true });
    // NoSpec has no spec.md; withSpec has one
    fs.writeFileSync(path.join(withSpec, 'spec.md'), '# Has Spec\n\nBody.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);
    const folderNames = cache.folders.map(f => path.basename(f.specFolder));
    expect(folderNames).not.toContain('no-spec-here');
    expect(folderNames).toContain('has-spec');
  });


  it('discovers spec folders nested 5+ levels deep', () => {
    const deepSpecDir = path.join(
      tmpDir,
      '001-parent',
      '002-track',
      '003-stream',
      '004-phase',
      '005-task',
    );
    fs.mkdirSync(deepSpecDir, { recursive: true });
    fs.writeFileSync(path.join(deepSpecDir, 'spec.md'), '# Deep Nested Spec\n\nBody.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);

    expect(
      cache.folders.some(
        (folder) => folder.specFolder === '001-parent/002-track/003-stream/004-phase/005-task'
      )
    ).toBe(true);
  });

  it('enforces max discovery depth of 8 levels', () => {
    const depth8Segments = [
      '001-l1',
      '002-l2',
      '003-l3',
      '004-l4',
      '005-l5',
      '006-l6',
      '007-l7',
      '008-l8',
    ];
    const depth9Segments = [...depth8Segments, '009-l9'];

    const depth8SpecDir = path.join(tmpDir, ...depth8Segments);
    const depth9SpecDir = path.join(tmpDir, ...depth9Segments);

    fs.mkdirSync(depth8SpecDir, { recursive: true });
    fs.mkdirSync(depth9SpecDir, { recursive: true });
    fs.writeFileSync(path.join(depth8SpecDir, 'spec.md'), '# Depth 8 Spec\n\nBody.', 'utf-8');
    fs.writeFileSync(path.join(depth9SpecDir, 'spec.md'), '# Depth 9 Spec\n\nBody.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);
    const discoveredFolders = new Set(cache.folders.map((folder) => folder.specFolder));

    expect(discoveredFolders.has(depth8Segments.join('/'))).toBe(true);
    expect(discoveredFolders.has(depth9Segments.join('/'))).toBe(false);
  });

  it('handles non-existent base path gracefully', () => {
    const nonExistent = path.join(tmpDir, 'does-not-exist');
    const cache = generateFolderDescriptions([nonExistent]);
    expect(cache.folders).toHaveLength(0);
    expect(cache.version).toBe(1);
  });

  it('returns empty folders array for empty base paths list', () => {
    const cache = generateFolderDescriptions([]);
    expect(cache.folders).toHaveLength(0);
  });

  it('populated cache has correct version field = 1', () => {
    const specDir = path.join(tmpDir, '001-test');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Test\n\nBody.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);
    expect(cache.version).toBe(1);
  });

  it('populates lastUpdated with an ISO timestamp', () => {
    const specDir = path.join(tmpDir, '001-ts');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# TS Test\n\nBody.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);
    expect(cache.folders[0].lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('includes keywords array with significant words', () => {
    const specDir = path.join(tmpDir, '001-kw');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Vector Search Engine\n\nBody.', 'utf-8');

    const cache = generateFolderDescriptions([tmpDir]);
    const folder = cache.folders[0];
    expect(Array.isArray(folder.keywords)).toBe(true);
    expect(folder.keywords.length).toBeGreaterThan(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   5. loadDescriptionCache + saveDescriptionCache — I/O roundtrip
----------------------------------------------------------------*/

describe('T009 loadDescriptionCache', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-io-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns null for a missing file', () => {
    const missing = path.join(tmpDir, 'nonexistent', 'descriptions.json');
    expect(loadDescriptionCache(missing)).toBeNull();
  });

  it('returns null for malformed JSON content', () => {
    const badPath = path.join(tmpDir, 'bad.json');
    fs.writeFileSync(badPath, '{ this is not valid json }', 'utf-8');
    expect(loadDescriptionCache(badPath)).toBeNull();
  });

  it('saveDescriptionCache + loadDescriptionCache roundtrip preserves data', () => {
    const cachePath = path.join(tmpDir, 'descriptions.json');
    const original: DescriptionCache = {
      version: 1,
      generated: '2026-02-27T12:00:00.000Z',
      folders: [
        {
          specFolder: 'specs/001-auth',
          description: 'Authentication module',
          keywords: ['authentication', 'module'],
          lastUpdated: '2026-02-27T12:00:00.000Z',
        },
      ],
    };

    saveDescriptionCache(original, cachePath);
    const loaded = loadDescriptionCache(cachePath);

    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(1);
    expect(loaded!.generated).toBe('2026-02-27T12:00:00.000Z');
    expect(loaded!.folders).toHaveLength(1);
    expect(loaded!.folders[0].specFolder).toBe('specs/001-auth');
    expect(loaded!.folders[0].description).toBe('Authentication module');
    expect(loaded!.folders[0].keywords).toEqual(['authentication', 'module']);
  });

  it('saveDescriptionCache creates parent directories if missing', () => {
    const nestedPath = path.join(tmpDir, 'nested', 'deep', 'descriptions.json');
    const cache: DescriptionCache = {
      version: 1,
      generated: '2026-02-27T00:00:00.000Z',
      folders: [],
    };

    expect(() => saveDescriptionCache(cache, nestedPath)).not.toThrow();
    expect(fs.existsSync(nestedPath)).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   6. Cache version constant
----------------------------------------------------------------*/

describe('T009 cache version', () => {
  it('cache version is always 1', () => {
    const cache = generateFolderDescriptions([]);
    expect(cache.version).toBe(1);
  });

  it('loaded cache retains version 1 after roundtrip', () => {
    const tmpDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'version-test-'));
    try {
      const cachePath = path.join(tmpDir2, 'descriptions.json');
      const original: DescriptionCache = { version: 1, generated: '', folders: [] };
      saveDescriptionCache(original, cachePath);
      const loaded = loadDescriptionCache(cachePath);
      expect(loaded!.version).toBe(1);
    } finally {
      fs.rmSync(tmpDir2, { recursive: true, force: true });
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   7. PerFolderDescription — per-folder description.json operations
----------------------------------------------------------------*/

describe('T009 PerFolderDescription schema', () => {
  it('has required specId field', () => {
    const desc: PerFolderDescription = {
      specFolder: '009-spec-descriptions',
      description: 'Test',
      keywords: ['test'],
      lastUpdated: new Date().toISOString(),
      specId: '010',
      folderSlug: 'spec-descriptions',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    expect(desc.specId).toBe('010');
  });

  it('has required folderSlug field', () => {
    const desc: PerFolderDescription = {
      specFolder: '009-spec-descriptions',
      description: 'Test',
      keywords: ['test'],
      lastUpdated: new Date().toISOString(),
      specId: '010',
      folderSlug: 'spec-descriptions',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    expect(desc.folderSlug).toBe('spec-descriptions');
  });

  it('parentChain is empty array for root folders', () => {
    const desc: PerFolderDescription = {
      specFolder: '010-test',
      description: 'Test',
      keywords: [],
      lastUpdated: '',
      specId: '010',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    expect(desc.parentChain).toEqual([]);
  });

  it('parentChain contains ancestor names for nested folders', () => {
    const desc: PerFolderDescription = {
      specFolder: '022-rag/001-epic',
      description: 'Test',
      keywords: [],
      lastUpdated: '',
      specId: '001',
      folderSlug: 'epic',
      parentChain: ['022-rag'],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    expect(desc.parentChain).toEqual(['022-rag']);
  });

  it('memorySequence starts at 0', () => {
    const desc: PerFolderDescription = {
      specFolder: 'test',
      description: 'Test',
      keywords: [],
      lastUpdated: '',
      specId: '',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    expect(desc.memorySequence).toBe(0);
  });

  it('memoryNameHistory is initially empty', () => {
    const desc: PerFolderDescription = {
      specFolder: 'test',
      description: 'Test',
      keywords: [],
      lastUpdated: '',
      specId: '',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    expect(desc.memoryNameHistory).toEqual([]);
  });

  it('memoryNameHistory acts as ring buffer (max 20)', () => {
    const history = Array.from({ length: 25 }, (_, i) => `file-${i}.md`);
    const desc: PerFolderDescription = {
      specFolder: 'test',
      description: 'Test',
      keywords: [],
      lastUpdated: '',
      specId: '',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: 25,
      memoryNameHistory: history.slice(-20),
    };
    expect(desc.memoryNameHistory).toHaveLength(20);
    expect(desc.memoryNameHistory[0]).toBe('file-5.md');
  });

  it('extends FolderDescription with all base fields', () => {
    const desc: PerFolderDescription = {
      specFolder: 'test',
      description: 'Base description',
      keywords: ['base', 'test'],
      lastUpdated: '2026-03-08T00:00:00.000Z',
      specId: '',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    // Verify it satisfies FolderDescription
    const base: FolderDescription = desc;
    expect(base.specFolder).toBe('test');
    expect(base.description).toBe('Base description');
    expect(base.keywords).toEqual(['base', 'test']);
  });
});

describe('T009 generatePerFolderDescription', () => {
  let tmpDir2: string;

  beforeEach(() => {
    tmpDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-pfolder-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir2, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('generates description from spec.md', () => {
    const specDir = path.join(tmpDir2, '010-my-feature');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# My Great Feature\n\nSome content.');

    const result = generatePerFolderDescription(specDir, tmpDir2);
    expect(result).not.toBeNull();
    expect(result!.specId).toBe('010');
    expect(result!.folderSlug).toBe('my-feature');
    expect(result!.description).toBe('My Great Feature');
    expect(result!.parentChain).toEqual([]);
  });

  it('computes parentChain for nested folders', () => {
    const nested = path.join(tmpDir2, '022-parent', '001-child');
    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(path.join(nested, 'spec.md'), '# Child Spec\n\nContent.');

    const result = generatePerFolderDescription(nested, tmpDir2);
    expect(result).not.toBeNull();
    expect(result!.parentChain).toEqual(['022-parent']);
    expect(result!.specId).toBe('001');
    expect(result!.folderSlug).toBe('child');
  });

  it('returns null for missing spec.md', () => {
    const emptyDir = path.join(tmpDir2, '005-empty');
    fs.mkdirSync(emptyDir, { recursive: true });

    const result = generatePerFolderDescription(emptyDir, tmpDir2);
    expect(result).toBeNull();
  });

  it('returns blank description metadata for whitespace-only spec.md', () => {
    const blankDir = path.join(tmpDir2, '006-blank-spec');
    fs.mkdirSync(blankDir, { recursive: true });
    fs.writeFileSync(path.join(blankDir, 'spec.md'), '\n   \n', 'utf-8');

    const result = generatePerFolderDescription(blankDir, tmpDir2);
    expect(result).not.toBeNull();
    expect(result!.specId).toBe('006');
    expect(result!.folderSlug).toBe('blank-spec');
    expect(result!.description).toBe('');
    expect(result!.keywords).toEqual([]);
  });

  it('preserves existing memorySequence on regeneration', () => {
    const specDir = path.join(tmpDir2, '010-feature');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Feature\n\nContent.');

    // Write an existing description.json with tracking data
    const existing: PerFolderDescription = {
      specFolder: '010-feature',
      description: 'Old description',
      keywords: [],
      lastUpdated: '',
      specId: '010',
      folderSlug: 'feature',
      parentChain: [],
      memorySequence: 5,
      memoryNameHistory: ['a.md', 'b.md'],
    };
    fs.writeFileSync(path.join(specDir, 'description.json'), JSON.stringify(existing));

    const result = generatePerFolderDescription(specDir, tmpDir2);
    expect(result).not.toBeNull();
    expect(result!.memorySequence).toBe(5);
    expect(result!.memoryNameHistory).toEqual(['a.md', 'b.md']);
    expect(result!.description).toBe('Feature'); // Updated from spec.md
  });
});

describe('T009 loadPerFolderDescription / savePerFolderDescription', () => {
  let tmpDir3: string;

  beforeEach(() => {
    tmpDir3 = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-pfio-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir3, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('roundtrips save and load', () => {
    const desc: PerFolderDescription = {
      specFolder: '010-test',
      description: 'Test description',
      keywords: ['test'],
      lastUpdated: '2026-03-08T00:00:00.000Z',
      specId: '010',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: 3,
      memoryNameHistory: ['a.md', 'b.md', 'c.md'],
    };

    savePerFolderDescription(desc, tmpDir3);
    const loaded = loadPerFolderDescription(tmpDir3);
    expect(loaded).toEqual(desc);
  });

  it('returns null for missing description.json', () => {
    const result = loadPerFolderDescription(tmpDir3);
    expect(result).toBeNull();
  });

  it('returns null for corrupt JSON', () => {
    fs.writeFileSync(path.join(tmpDir3, 'description.json'), '{invalid json');
    const result = loadPerFolderDescription(tmpDir3);
    expect(result).toBeNull();
  });

  it('returns null for schema violation (memorySequence as string)', () => {
    fs.writeFileSync(path.join(tmpDir3, 'description.json'), JSON.stringify({
      specFolder: 'test',
      description: 'Valid description',
      keywords: ['test'],
      lastUpdated: new Date().toISOString(),
      specId: '010',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: '5',
      memoryNameHistory: [],
    }));
    const result = loadPerFolderDescription(tmpDir3);
    expect(result).toBeNull();
  });

  it('creates parent directories if needed', () => {
    const nested = path.join(tmpDir3, 'deep', 'nested', 'dir');
    const desc: PerFolderDescription = {
      specFolder: 'test',
      description: 'Test',
      keywords: [],
      lastUpdated: '',
      specId: '',
      folderSlug: 'test',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    savePerFolderDescription(desc, nested);
    expect(fs.existsSync(path.join(nested, 'description.json'))).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   8. C2 path containment boundary tests
----------------------------------------------------------------*/

describe('T009 generatePerFolderDescription path containment (C2)', () => {
  let tmpDir5: string;

  beforeEach(() => {
    tmpDir5 = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-c2-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir5, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('rejects sibling directory with similar prefix (specs-evil vs specs)', () => {
    const specsBase = path.join(tmpDir5, 'specs');
    const evilBase = path.join(tmpDir5, 'specs-evil', '001-bad');
    fs.mkdirSync(path.join(specsBase, '001-ok'), { recursive: true });
    fs.mkdirSync(evilBase, { recursive: true });
    fs.writeFileSync(path.join(specsBase, '001-ok', 'spec.md'), '# OK Spec');
    fs.writeFileSync(path.join(evilBase, 'spec.md'), '# Evil Spec');

    const result = generatePerFolderDescription(evilBase, specsBase);
    expect(result).toBeNull();
  });

  it('accepts folder that is exactly the base path', () => {
    const specsBase = path.join(tmpDir5, 'specs');
    fs.mkdirSync(specsBase, { recursive: true });
    fs.writeFileSync(path.join(specsBase, 'spec.md'), '# Base Spec');

    const result = generatePerFolderDescription(specsBase, specsBase);
    expect(result).not.toBeNull();
  });

  it('returns null for non-existent folder path (broken symlink scenario)', () => {
    const result = generatePerFolderDescription('/nonexistent/broken/symlink/path', tmpDir5);
    expect(result).toBeNull();
  });
});

/* ───────────────────────────────────────────────────────────────
   9. C1 array element type validation tests
----------------------------------------------------------------*/

describe('T009 loadPerFolderDescription element type validation (C1)', () => {
  let tmpDir6: string;

  beforeEach(() => {
    tmpDir6 = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-c1-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir6, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  const validBase = {
    specFolder: 'test',
    description: 'Valid',
    lastUpdated: new Date().toISOString(),
    specId: '010',
    folderSlug: 'test',
    memorySequence: 0,
  };

  it('rejects parentChain with non-string elements', () => {
    fs.writeFileSync(path.join(tmpDir6, 'description.json'), JSON.stringify({
      ...validBase,
      keywords: ['test'],
      parentChain: [123],
      memoryNameHistory: [],
    }));
    expect(loadPerFolderDescription(tmpDir6)).toBeNull();
  });

  it('rejects memoryNameHistory with non-string elements', () => {
    fs.writeFileSync(path.join(tmpDir6, 'description.json'), JSON.stringify({
      ...validBase,
      keywords: ['test'],
      parentChain: [],
      memoryNameHistory: [true, false],
    }));
    expect(loadPerFolderDescription(tmpDir6)).toBeNull();
  });

  it('rejects keywords with non-string elements', () => {
    fs.writeFileSync(path.join(tmpDir6, 'description.json'), JSON.stringify({
      ...validBase,
      keywords: [1, 2, 3],
      parentChain: [],
      memoryNameHistory: [],
    }));
    expect(loadPerFolderDescription(tmpDir6)).toBeNull();
  });

  it('accepts valid arrays with all string elements', () => {
    fs.writeFileSync(path.join(tmpDir6, 'description.json'), JSON.stringify({
      ...validBase,
      keywords: ['test', 'valid'],
      parentChain: ['parent'],
      memoryNameHistory: ['a.md', 'b.md'],
    }));
    const result = loadPerFolderDescription(tmpDir6);
    expect(result).not.toBeNull();
    expect(result!.keywords).toEqual(['test', 'valid']);
    expect(result!.parentChain).toEqual(['parent']);
    expect(result!.memoryNameHistory).toEqual(['a.md', 'b.md']);
  });

  it('accepts empty arrays for optional array fields', () => {
    fs.writeFileSync(path.join(tmpDir6, 'description.json'), JSON.stringify({
      ...validBase,
      keywords: [],
      parentChain: [],
      memoryNameHistory: [],
    }));
    const result = loadPerFolderDescription(tmpDir6);
    expect(result).not.toBeNull();
    expect(result!.keywords).toEqual([]);
    expect(result!.parentChain).toEqual([]);
    expect(result!.memoryNameHistory).toEqual([]);
  });
});

describe('F13: loadPerFolderDescription required field validation', () => {
  let tmpDir7: string;

  beforeEach(() => {
    tmpDir7 = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-f13-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir7, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  const validBase: Record<string, unknown> = {
    specFolder: '009-spec-descriptions',
    description: 'Valid description',
    keywords: ['valid', 'description'],
    lastUpdated: new Date().toISOString(),
    specId: '010',
    folderSlug: 'spec-descriptions',
    parentChain: [],
    memorySequence: 0,
    memoryNameHistory: [],
  };

  const requiredStringFields = ['specFolder', 'description', 'lastUpdated'] as const;
  for (const field of requiredStringFields) {
    it('returns null when ' + field + ' is missing', () => {
      const invalid = { ...validBase };
      delete invalid[field];
      fs.writeFileSync(path.join(tmpDir7, 'description.json'), JSON.stringify(invalid));
      expect(loadPerFolderDescription(tmpDir7)).toBeNull();
    });

    it('returns null when ' + field + ' is wrong type', () => {
      const invalid = { ...validBase, [field]: 123 };
      fs.writeFileSync(path.join(tmpDir7, 'description.json'), JSON.stringify(invalid));
      expect(loadPerFolderDescription(tmpDir7)).toBeNull();
    });
  }

  it('returns null when keywords is not array', () => {
    fs.writeFileSync(path.join(tmpDir7, 'description.json'), JSON.stringify({
      ...validBase,
      keywords: 'string',
    }));
    expect(loadPerFolderDescription(tmpDir7)).toBeNull();
  });

  it('returns null when keywords contains non-strings', () => {
    fs.writeFileSync(path.join(tmpDir7, 'description.json'), JSON.stringify({
      ...validBase,
      keywords: [1, 2],
    }));
    expect(loadPerFolderDescription(tmpDir7)).toBeNull();
  });
});

describe('F14: slugifyFolderName', () => {
  it('strips numeric prefix and slugifies', () => {
    expect(slugifyFolderName('009-spec-descriptions')).toBe('spec-descriptions');
  });

  it('handles no numeric prefix', () => {
    expect(slugifyFolderName('my-folder')).toBe('my-folder');
  });

  it('handles empty string', () => {
    expect(slugifyFolderName('')).toBe('');
  });

  it('strips prefix-only', () => {
    expect(slugifyFolderName('010')).toBe('');
  });

  it('preserves numbers after prefix', () => {
    expect(slugifyFolderName('010-v2-update')).toBe('v2-update');
  });
});

/* ───────────────────────────────────────────────────────────────
    10. C7 CRLF frontmatter test
----------------------------------------------------------------*/

describe('T009 extractDescription CRLF frontmatter (C7)', () => {
  it('strips CRLF frontmatter correctly', () => {
    const content = '---\r\ntitle: X\r\n---\r\n# Real Title';
    expect(extractDescription(content)).toBe('Real Title');
  });

  it('strips LF frontmatter correctly', () => {
    const content = '---\ntitle: X\n---\n# Real Title';
    expect(extractDescription(content)).toBe('Real Title');
  });
});

/* ───────────────────────────────────────────────────────────────
   P1-4: loadPerFolderDescription with specId=""
----------------------------------------------------------------*/

describe('P1-4: loadPerFolderDescription with empty specId', () => {
  let tmpDirP14: string;

  beforeEach(() => {
    tmpDirP14 = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-p14-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDirP14, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('derives folderSlug from folder name when specId is empty', () => {
    // Create a folder without numeric prefix
    const folderDir = path.join(tmpDirP14, 'my-auth-spec');
    fs.mkdirSync(folderDir, { recursive: true });

    // Write a description.json with specId="" (empty string)
    const descContent = {
      specFolder: 'my-auth-spec',
      description: 'Auth spec description',
      keywords: ['auth', 'spec'],
      lastUpdated: new Date().toISOString(),
      specId: '',
      folderSlug: '',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    fs.writeFileSync(path.join(folderDir, 'description.json'), JSON.stringify(descContent));

    const result = loadPerFolderDescription(folderDir);
    expect(result).not.toBeNull();
    // F-36 upgrade-on-read: empty specId should stay empty (no numeric prefix on folder name)
    expect(result!.specId).toBe('');
    // F-36 upgrade-on-read: empty folderSlug should be derived from folder name
    expect(result!.folderSlug).toBe('my-auth-spec');
  });
});

describe('T009 isPerFolderDescriptionStale', () => {
  let tmpDir4: string;

  beforeEach(() => {
    tmpDir4 = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-stale-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir4, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('returns true when description.json is missing', () => {
    fs.writeFileSync(path.join(tmpDir4, 'spec.md'), '# Test');
    expect(isPerFolderDescriptionStale(tmpDir4)).toBe(true);
  });

  it('returns true when spec.md is missing', () => {
    fs.writeFileSync(path.join(tmpDir4, 'description.json'), '{}');
    expect(isPerFolderDescriptionStale(tmpDir4)).toBe(true);
  });

  it('returns false when description.json is newer than spec.md', () => {
    fs.writeFileSync(path.join(tmpDir4, 'spec.md'), '# Test');
    // Small delay to ensure different mtime
    const specMtime = fs.statSync(path.join(tmpDir4, 'spec.md')).mtimeMs;
    // Set description.json mtime to future
    fs.writeFileSync(path.join(tmpDir4, 'description.json'), '{}');
    const descMtime = fs.statSync(path.join(tmpDir4, 'description.json')).mtimeMs;
    // Description.json was written after spec.md, so descMtime >= specMtime
    expect(descMtime >= specMtime).toBe(true);
    expect(isPerFolderDescriptionStale(tmpDir4)).toBe(false);
  });
});
