// ---------------------------------------------------------------
// MODULE: Test — Folder Discovery
// ---------------------------------------------------------------
// Tests: extractDescription, extractKeywords, findRelevantFolders,
//        generateFolderDescriptions, loadDescriptionCache,
//        saveDescriptionCache

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
} from '../lib/search/folder-discovery';
import type { FolderDescription, DescriptionCache } from '../lib/search/folder-discovery';

/* -----------------------------------------------------------
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
});

/* -----------------------------------------------------------
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

/* -----------------------------------------------------------
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
    // specs/002-memory should score highly — has 'vector', 'memory', 'search'
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

/* -----------------------------------------------------------
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
    // noSpec has no spec.md; withSpec has one
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

/* -----------------------------------------------------------
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

/* -----------------------------------------------------------
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
