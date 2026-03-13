// ---------------------------------------------------------------
// MODULE: Test — Folder Discovery Integration
// ---------------------------------------------------------------
// Tests: ensureDescriptionCache, isCacheStale, discoverSpecFolder,
//        getSpecsBasePaths, graceful degradation

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  getSpecsBasePaths,
  isCacheStale,
  ensureDescriptionCache,
  discoverSpecFolder,
  generateFolderDescriptions,
  saveDescriptionCache,
  loadDescriptionCache,
  generatePerFolderDescription,
  savePerFolderDescription,
  loadPerFolderDescription,
  isPerFolderDescriptionStale,
} from '../lib/search/folder-discovery';
import type { DescriptionCache, PerFolderDescription } from '../lib/search/folder-discovery';
import { isFolderDiscoveryEnabled } from '../lib/search/search-flags';

/* --- HELPER: env var backup/restore --- */

let envBackup: Record<string, string | undefined>;

beforeEach(() => {
  envBackup = {
    SPECKIT_FOLDER_DISCOVERY: process.env.SPECKIT_FOLDER_DISCOVERY,
  };
});

afterEach(() => {
  for (const [key, val] of Object.entries(envBackup)) {
    if (val === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = val;
    }
  }
});

/* --- HELPER: temp directory with spec folders --- */

function createTempWorkspace(): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-t046-'));
  return tmpDir;
}

function createSpecFolder(basePath: string, folderName: string, specContent: string): string {
  const specDir = path.join(basePath, 'specs', folderName);
  fs.mkdirSync(specDir, { recursive: true });
  fs.writeFileSync(path.join(specDir, 'spec.md'), specContent, 'utf-8');
  return specDir;
}

function cleanup(tmpDir: string): void {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch (_error: unknown) { /* best effort */ }
}

/* ═══════════════════════════════════════════════════════════════
   1. Feature Flag
   ═══════════════════════════════════════════════════════════════ */

describe('PI-B3: Feature flag', () => {
  it('T046-01: isFolderDiscoveryEnabled returns true by default (graduated flag)', () => {
    delete process.env.SPECKIT_FOLDER_DISCOVERY;
    expect(isFolderDiscoveryEnabled()).toBe(true);
  });

  it('T046-02: isFolderDiscoveryEnabled returns true when set', () => {
    process.env.SPECKIT_FOLDER_DISCOVERY = 'true';
    expect(isFolderDiscoveryEnabled()).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════════════
   2. getSpecsBasePaths
   ═══════════════════════════════════════════════════════════════ */

describe('PI-B3: getSpecsBasePaths', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempWorkspace();
  });

  afterEach(() => {
    cleanup(tmpDir);
  });

  it('T046-03: resolves existing specs/ directory', () => {
    const specsDir = path.join(tmpDir, 'specs');
    fs.mkdirSync(specsDir, { recursive: true });

    const result = getSpecsBasePaths(tmpDir);
    expect(result).toContain(specsDir);
  });

  it('T046-04: returns empty array when no specs directories exist', () => {
    const result = getSpecsBasePaths(tmpDir);
    expect(result).toEqual([]);
  });

  it('T046-05: resolves both specs/ and .opencode/specs/ when both exist', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const openCodeSpecsDir = path.join(tmpDir, '.opencode', 'specs');
    fs.mkdirSync(specsDir, { recursive: true });
    fs.mkdirSync(openCodeSpecsDir, { recursive: true });

    const result = getSpecsBasePaths(tmpDir);
    expect(result).toHaveLength(2);
    expect(result).toContain(specsDir);
    expect(result).toContain(openCodeSpecsDir);
  });

  it('T046-05a: deduplicates specs symlink that points to .opencode/specs', () => {
    const openCodeSpecsDir = path.join(tmpDir, '.opencode', 'specs');
    const specsLinkPath = path.join(tmpDir, 'specs');
    fs.mkdirSync(openCodeSpecsDir, { recursive: true });

    try {
      fs.symlinkSync(openCodeSpecsDir, specsLinkPath, 'dir');
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === 'EPERM' || code === 'EEXIST') {
        expect(true).toBe(true);
        return;
      }
      throw error;
    }

    const result = getSpecsBasePaths(tmpDir);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(path.resolve(specsLinkPath));
  });

  it('T046-05b: generates stable folder identities regardless of alias root order', () => {
    const openCodeSpecsDir = path.join(tmpDir, '.opencode', 'specs');
    const specsLinkPath = path.join(tmpDir, 'specs');
    const canonicalSpecDir = path.join(openCodeSpecsDir, '001-auth');
    fs.mkdirSync(canonicalSpecDir, { recursive: true });
    fs.writeFileSync(path.join(canonicalSpecDir, 'spec.md'), '# Authentication System', 'utf-8');

    try {
      fs.symlinkSync(openCodeSpecsDir, specsLinkPath, 'dir');
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === 'EPERM' || code === 'EEXIST') {
        expect(true).toBe(true);
        return;
      }
      throw error;
    }

    const linkFirst = generateFolderDescriptions([specsLinkPath, openCodeSpecsDir]);
    const realFirst = generateFolderDescriptions([openCodeSpecsDir, specsLinkPath]);

    expect(linkFirst.folders.map((folder) => folder.specFolder)).toEqual(['001-auth']);
    expect(realFirst.folders.map((folder) => folder.specFolder)).toEqual(['001-auth']);
    expect(linkFirst.folders).toHaveLength(1);
    expect(realFirst.folders).toHaveLength(1);
  });
});

/* ═══════════════════════════════════════════════════════════════
   3. isCacheStale
   ═══════════════════════════════════════════════════════════════ */

describe('PI-B3: isCacheStale', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempWorkspace();
  });

  afterEach(() => {
    cleanup(tmpDir);
  });

  it('T046-06: returns true for null cache', () => {
    expect(isCacheStale(null, [])).toBe(true);
  });

  it('T046-07: returns true for cache with invalid generated timestamp', () => {
    const cache: DescriptionCache = { version: 1, generated: 'invalid-date', folders: [] };
    expect(isCacheStale(cache, [])).toBe(true);
  });

  it('T046-08: returns false when cache is newer than all spec.md files', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-test', '# Test Spec');

    // Cache generated in the future remains fresh when its folder set still matches discovery
    const cache: DescriptionCache = {
      version: 1,
      generated: new Date(Date.now() + 10000).toISOString(), // future
      folders: [
        {
          specFolder: '001-test',
          description: 'Test Spec',
          keywords: ['test', 'spec'],
          lastUpdated: new Date().toISOString(),
        },
      ],
    };

    expect(isCacheStale(cache, [specsDir])).toBe(false);
  });

  it('T046-09: returns true when spec.md is newer than cache', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-test', '# Test Spec');

    // Cache generated well in the past
    const cache: DescriptionCache = {
      version: 1,
      generated: new Date('2020-01-01').toISOString(),
      folders: [],
    };

    expect(isCacheStale(cache, [specsDir])).toBe(true);
  });

  it('T046-10: detects staleness in nested phase subfolders', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const parentDir = path.join(specsDir, '001-parent');
    const phaseDir = path.join(parentDir, '010-phase');
    fs.mkdirSync(phaseDir, { recursive: true });
    fs.writeFileSync(path.join(phaseDir, 'spec.md'), '# Phase Spec', 'utf-8');

    const cache: DescriptionCache = {
      version: 1,
      generated: new Date('2020-01-01').toISOString(),
      folders: [],
    };

    expect(isCacheStale(cache, [specsDir])).toBe(true);
  });

  it('T046-10a: detects staleness in 5-level nested spec paths', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const nestedSpecDir = path.join(
      specsDir,
      '001-parent',
      '010-phase',
      '020-subphase',
      '030-workstream',
      '040-task',
    );
    fs.mkdirSync(nestedSpecDir, { recursive: true });
    fs.writeFileSync(path.join(nestedSpecDir, 'spec.md'), '# Deeply Nested Spec', 'utf-8');

    const cache: DescriptionCache = {
      version: 1,
      generated: new Date('2020-01-01').toISOString(),
      folders: [],
    };

    expect(isCacheStale(cache, [specsDir])).toBe(true);
  });

  it('T046-10a2: discovers spec.md at exactly max discovery depth (8)', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const depth8SpecDir = path.join(
      specsDir,
      '001-l1',
      '002-l2',
      '003-l3',
      '004-l4',
      '005-l5',
      '006-l6',
      '007-l7',
      '008-l8',
    );
    fs.mkdirSync(depth8SpecDir, { recursive: true });
    fs.writeFileSync(path.join(depth8SpecDir, 'spec.md'), '# Depth 8 Spec', 'utf-8');

    const cache: DescriptionCache = {
      version: 1,
      generated: new Date('2020-01-01').toISOString(),
      folders: [],
    };

    // Depth 8 should be included (boundary acceptance)
    expect(isCacheStale(cache, [specsDir])).toBe(true);
    expect(generateFolderDescriptions([specsDir]).folders).toHaveLength(1);
  });

  it('T046-10b: ignores spec.md deeper than max discovery depth (8)', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const depth9SpecDir = path.join(
      specsDir,
      '001-l1',
      '002-l2',
      '003-l3',
      '004-l4',
      '005-l5',
      '006-l6',
      '007-l7',
      '008-l8',
      '009-l9',
    );
    fs.mkdirSync(depth9SpecDir, { recursive: true });
    fs.writeFileSync(path.join(depth9SpecDir, 'spec.md'), '# Depth 9 Spec', 'utf-8');

    const cache: DescriptionCache = {
      version: 1,
      generated: new Date('2020-01-01').toISOString(),
      folders: [],
    };

    expect(isCacheStale(cache, [specsDir])).toBe(false);
    expect(generateFolderDescriptions([specsDir]).folders).toHaveLength(0);
  });

  it('T046-10c: returns true when a cached spec folder has been deleted', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const deletedSpecDir = createSpecFolder(tmpDir, '001-deleted', '# Deleted Spec');

    const cache: DescriptionCache = {
      version: 1,
      generated: new Date(Date.now() + 10000).toISOString(),
      folders: [
        {
          specFolder: '001-deleted',
          description: 'Deleted Spec',
          keywords: ['deleted', 'spec'],
          lastUpdated: new Date().toISOString(),
        },
      ],
    };

    fs.rmSync(deletedSpecDir, { recursive: true, force: true });

    expect(isCacheStale(cache, [specsDir])).toBe(true);
  });

  it('T046-10d: returns true when a cached spec folder has been renamed', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const renamedSpecDir = createSpecFolder(tmpDir, '001-original', '# Original Spec');

    const cache: DescriptionCache = {
      version: 1,
      generated: new Date(Date.now() + 10000).toISOString(),
      folders: [
        {
          specFolder: '001-original',
          description: 'Original Spec',
          keywords: ['original', 'spec'],
          lastUpdated: new Date().toISOString(),
        },
      ],
    };

    fs.renameSync(renamedSpecDir, path.join(specsDir, '001-renamed'));

    expect(isCacheStale(cache, [specsDir])).toBe(true);
  });

  it('T046-10e: regenerates cache when a previously cached spec folder is removed', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-keep', '# Keep Spec');
    const deletedSpecDir = createSpecFolder(tmpDir, '002-delete', '# Delete Spec');

    const initialCache = ensureDescriptionCache([specsDir]);
    expect(initialCache).not.toBeNull();
    expect(initialCache!.folders.map((folder) => folder.specFolder)).toContain('002-delete');

    fs.rmSync(deletedSpecDir, { recursive: true, force: true });

    const refreshedCache = ensureDescriptionCache([specsDir]);
    expect(refreshedCache).not.toBeNull();
    expect(refreshedCache!.folders.map((folder) => folder.specFolder)).toEqual(['001-keep']);
  });
});

/* ═══════════════════════════════════════════════════════════════
   4. ensureDescriptionCache (CHK-PI-B3-001)
   ═══════════════════════════════════════════════════════════════ */

describe('CHK-PI-B3-001: ensureDescriptionCache', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempWorkspace();
  });

  afterEach(() => {
    cleanup(tmpDir);
  });

  it('T046-11: creates descriptions.json when none exists', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-auth', '# Authentication System');

    const cache = ensureDescriptionCache([specsDir]);

    expect(cache).not.toBeNull();
    expect(cache!.version).toBe(1);
    expect(cache!.folders.length).toBeGreaterThan(0);

    // Verify file was written
    const cachePath = path.join(specsDir, 'descriptions.json');
    expect(fs.existsSync(cachePath)).toBe(true);
  });

  it('T046-12: loads existing fresh cache without regenerating', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-auth', '# Authentication System');

    // Pre-generate and save a cache with future timestamp
    const preCache: DescriptionCache = {
      version: 1,
      generated: new Date(Date.now() + 60000).toISOString(),
      folders: [{
        specFolder: '001-auth',
        description: 'Pre-existing',
        keywords: ['pre'],
        lastUpdated: new Date().toISOString(),
      }],
    };
    const cachePath = path.join(specsDir, 'descriptions.json');
    saveDescriptionCache(preCache, cachePath);

    const result = ensureDescriptionCache([specsDir]);

    // Should return the pre-existing cache, not regenerate
    expect(result).not.toBeNull();
    expect(result!.folders[0].description).toBe('Pre-existing');
  });

  it('T046-13: regenerates when cache is stale', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-auth', '# Authentication System');

    // Pre-generate a stale cache
    const staleCache: DescriptionCache = {
      version: 1,
      generated: new Date('2020-01-01').toISOString(),
      folders: [{ specFolder: 'old', description: 'Stale', keywords: ['stale'], lastUpdated: new Date('2020-01-01').toISOString() }],
    };
    const cachePath = path.join(specsDir, 'descriptions.json');
    saveDescriptionCache(staleCache, cachePath);

    const result = ensureDescriptionCache([specsDir]);

    expect(result).not.toBeNull();
    // Should have regenerated — no longer contains the stale "old" folder
    expect(result!.folders.some(f => f.description === 'Stale')).toBe(false);
    expect(result!.folders.some(f => f.description === 'Authentication System')).toBe(true);
  });

  it('T046-14: returns null for empty basePaths', () => {
    const result = ensureDescriptionCache([]);
    expect(result).toBeNull();
  });
});

/* ═══════════════════════════════════════════════════════════════
   5. discoverSpecFolder (CHK-PI-B3-002 / CHK-PI-B3-004)
   ═══════════════════════════════════════════════════════════════ */

describe('CHK-PI-B3-002: discoverSpecFolder', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempWorkspace();
  });

  afterEach(() => {
    cleanup(tmpDir);
  });

  it('T046-15: discovers matching spec folder for relevant query', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-authentication', '# Authentication and Login System');
    createSpecFolder(tmpDir, '002-database', '# Database Migration Tools');

    const result = discoverSpecFolder('authentication login', [specsDir]);

    expect(result).not.toBeNull();
    expect(result!).toBe('001-authentication');
    expect(path.isAbsolute(result!)).toBe(false);
  });

  it('T046-16: returns null when no folder meets threshold', () => {
    const specsDir = path.join(tmpDir, 'specs');
    createSpecFolder(tmpDir, '001-auth', '# Authentication System');

    // Query that doesn't match any keywords
    const result = discoverSpecFolder('quantum physics rocket science', [specsDir]);

    expect(result).toBeNull();
  });

  it('T046-17: returns null for empty base paths', () => {
    const result = discoverSpecFolder('anything', []);
    expect(result).toBeNull();
  });
});

/* ═══════════════════════════════════════════════════════════════
   6. Graceful Degradation (CHK-PI-B3-004)
   ═══════════════════════════════════════════════════════════════ */

describe('CHK-PI-B3-004: Graceful degradation', () => {
  it('T046-18: discoverSpecFolder returns null on nonexistent base path', () => {
    const result = discoverSpecFolder('test query', ['/nonexistent/path/that/does/not/exist']);
    expect(result).toBeNull();
  });

  it('T046-19: ensureDescriptionCache returns an empty cache on nonexistent base path', () => {
    const result = ensureDescriptionCache(['/nonexistent/path/that/does/not/exist']);
    // Should not throw, returns a cache (possibly with 0 folders)
    expect(result).not.toBeNull();
    expect(result!.folders).toEqual([]);
  });

  it('T046-20: isCacheStale handles missing base paths gracefully', () => {
    const cache: DescriptionCache = {
      version: 1,
      generated: new Date().toISOString(),
      folders: [],
    };

    // Should not throw
    const result = isCacheStale(cache, ['/nonexistent/path']);
    expect(typeof result).toBe('boolean');
  });

  it('T046-21: getSpecsBasePaths returns empty for nonexistent workspace', () => {
    const result = getSpecsBasePaths('/nonexistent/workspace/path');
    expect(result).toEqual([]);
  });
});

/* ═══════════════════════════════════════════════════════════════
   7. Per-Folder Description Integration
   ═══════════════════════════════════════════════════════════════ */

describe('PI-B3: Per-folder description preference', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempWorkspace();
  });

  afterEach(() => {
    cleanup(tmpDir);
  });

  it('T046-22: uses per-folder description.json when fresh', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const specDir = createSpecFolder(tmpDir, '001-auth', '# Authentication System');

    // Create a per-folder description.json with custom description
    const perFolder: PerFolderDescription = {
      specFolder: '001-auth',
      description: 'Custom per-folder description',
      keywords: ['custom', 'per-folder'],
      lastUpdated: new Date().toISOString(),
      specId: '001',
      folderSlug: 'auth',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    savePerFolderDescription(perFolder, specDir);

    const cache = generateFolderDescriptions([specsDir]);
    expect(cache.folders).toHaveLength(1);
    expect(cache.folders[0].description).toBe('Custom per-folder description');
  });

  it('T046-23: falls back to spec.md when description.json is stale', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const specDir = createSpecFolder(tmpDir, '001-auth', '# Fresh Authentication Title');

    // Create a stale description.json (written before spec.md)
    const descPath = path.join(specDir, 'description.json');
    const staleDesc: PerFolderDescription = {
      specFolder: '001-auth',
      description: 'Stale description',
      keywords: ['stale'],
      lastUpdated: new Date('2020-01-01').toISOString(),
      specId: '001',
      folderSlug: 'auth',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    fs.writeFileSync(descPath, JSON.stringify(staleDesc));
    // Set description.json mtime to past to ensure staleness
    const pastTime = new Date('2020-01-01');
    fs.utimesSync(descPath, pastTime, pastTime);

    const cache = generateFolderDescriptions([specsDir]);
    expect(cache.folders).toHaveLength(1);
    // Should fall back to spec.md extraction
    expect(cache.folders[0].description).toBe('Fresh Authentication Title');

    const repaired = loadPerFolderDescription(specDir);
    expect(repaired).not.toBeNull();
    expect(repaired!.description).toBe('Fresh Authentication Title');
  });

  it('T046-24: mixed mode aggregation with fresh and stale descriptions', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const freshDir = createSpecFolder(tmpDir, '001-fresh', '# Fresh From SpecMd');
    const perFolderDir = createSpecFolder(tmpDir, '002-perfolder', '# Ignored SpecMd Title');

    // Only 002 has a fresh per-folder description
    const perFolder: PerFolderDescription = {
      specFolder: '002-perfolder',
      description: 'Per-folder wins',
      keywords: ['perfolder'],
      lastUpdated: new Date().toISOString(),
      specId: '002',
      folderSlug: 'perfolder',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    savePerFolderDescription(perFolder, perFolderDir);

    const cache = generateFolderDescriptions([specsDir]);
    expect(cache.folders).toHaveLength(2);

    const fresh = cache.folders.find(f => f.specFolder === '001-fresh');
    const pf = cache.folders.find(f => f.specFolder === '002-perfolder');
    expect(fresh!.description).toBe('Fresh From SpecMd');
    expect(pf!.description).toBe('Per-folder wins');
  });
});

describe('F12: mixed-mode aggregation with corrupt/missing/stale combinations', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempWorkspace();
  });

  afterEach(() => {
    cleanup(tmpDir);
  });

  it('includes all folders and falls back to spec.md for stale/corrupt/missing description.json', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const freshDir = createSpecFolder(tmpDir, '001-fresh-valid', '# Fresh Spec Title');
    const staleDir = createSpecFolder(tmpDir, '002-stale-json', '# Stale Spec Title');
    const corruptDir = createSpecFolder(tmpDir, '003-corrupt-json', '# Corrupt Spec Title');
    createSpecFolder(tmpDir, '004-no-json', '# Missing Json Spec Title');

    const freshDescription: PerFolderDescription = {
      specFolder: '001-fresh-valid',
      description: 'Fresh per-folder description',
      keywords: ['fresh'],
      lastUpdated: new Date().toISOString(),
      specId: '001',
      folderSlug: 'fresh-valid',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    savePerFolderDescription(freshDescription, freshDir);

    const staleDescription: PerFolderDescription = {
      specFolder: '002-stale-json',
      description: 'Stale per-folder description',
      keywords: ['stale'],
      lastUpdated: new Date('2020-01-01').toISOString(),
      specId: '002',
      folderSlug: 'stale-json',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    savePerFolderDescription(staleDescription, staleDir);
    const staleDescPath = path.join(staleDir, 'description.json');
    const pastTime = new Date('2020-01-01');
    fs.utimesSync(staleDescPath, pastTime, pastTime);

    fs.writeFileSync(path.join(corruptDir, 'description.json'), '{invalid-json', 'utf-8');

    const cache = generateFolderDescriptions([specsDir]);
    expect(cache.folders).toHaveLength(4);

    const fresh = cache.folders.find(f => f.specFolder === '001-fresh-valid');
    const stale = cache.folders.find(f => f.specFolder === '002-stale-json');
    const corrupt = cache.folders.find(f => f.specFolder === '003-corrupt-json');
    const missing = cache.folders.find(f => f.specFolder === '004-no-json');

    expect(fresh).toBeDefined();
    expect(stale).toBeDefined();
    expect(corrupt).toBeDefined();
    expect(missing).toBeDefined();

    expect(fresh!.description).toBe('Fresh per-folder description');
    expect(stale!.description).toBe('Stale Spec Title');
    expect(corrupt!.description).toBe('Corrupt Spec Title');
    expect(missing!.description).toBe('Missing Json Spec Title');
  });

  it('repairs stale and corrupt description.json files during discovery when the file already exists', () => {
    const specsDir = path.join(tmpDir, 'specs');
    const staleDir = createSpecFolder(tmpDir, '005-stale-repair', '# Stale Repair Title');
    const corruptDir = createSpecFolder(tmpDir, '006-corrupt-repair', '# Corrupt Repair Title');

    const staleDescription: PerFolderDescription = {
      specFolder: '005-stale-repair',
      description: 'Old stale text',
      keywords: ['stale'],
      lastUpdated: new Date('2020-01-01').toISOString(),
      specId: '005',
      folderSlug: 'stale-repair',
      parentChain: [],
      memorySequence: 3,
      memoryNameHistory: ['old.md'],
    };
    savePerFolderDescription(staleDescription, staleDir);
    const staleDescPath = path.join(staleDir, 'description.json');
    const pastTime = new Date('2020-01-01');
    fs.utimesSync(staleDescPath, pastTime, pastTime);

    fs.writeFileSync(path.join(corruptDir, 'description.json'), '{invalid-json', 'utf-8');

    const cache = generateFolderDescriptions([specsDir]);
    expect(cache.folders.find((folder) => folder.specFolder === '005-stale-repair')!.description).toBe('Stale Repair Title');
    expect(cache.folders.find((folder) => folder.specFolder === '006-corrupt-repair')!.description).toBe('Corrupt Repair Title');

    const repairedStale = loadPerFolderDescription(staleDir);
    expect(repairedStale).not.toBeNull();
    expect(repairedStale!.description).toBe('Stale Repair Title');
    expect(repairedStale!.memorySequence).toBe(3);
    expect(repairedStale!.memoryNameHistory).toEqual(['old.md']);

    const repairedCorrupt = loadPerFolderDescription(corruptDir);
    expect(repairedCorrupt).not.toBeNull();
    expect(repairedCorrupt!.description).toBe('Corrupt Repair Title');
  });
});

/* --- C2 path containment integration test --- */

describe('C2: generatePerFolderDescription path containment', () => {
  let td: string;
  beforeEach(() => { td = createTempWorkspace(); });
  afterEach(() => { cleanup(td); });

  it('T046-28: rejects specs-evil sibling via path.sep boundary check', () => {
    const specsDir = path.join(td, 'specs');
    const evilDir = path.join(td, 'specs-evil', '001-bad');
    fs.mkdirSync(path.join(specsDir, '001-ok'), { recursive: true });
    fs.mkdirSync(evilDir, { recursive: true });
    fs.writeFileSync(path.join(specsDir, '001-ok', 'spec.md'), '# OK Spec', 'utf-8');
    fs.writeFileSync(path.join(evilDir, 'spec.md'), '# Evil Spec', 'utf-8');

    const result = generatePerFolderDescription(evilDir, specsDir);
    expect(result).toBeNull();
  });
});

/* --- 010-CHK-024: Stale detection incorporates description.json mtime --- */

describe('CHK-024: description.json mtime staleness', () => {
  let td: string;
  beforeEach(() => { td = createTempWorkspace(); });
  afterEach(() => { cleanup(td); });

  it('T046-25: editing description.json makes aggregate cache stale', () => {
    const specsDir = path.join(td, 'specs');
    const folderDir = createSpecFolder(td, '001-test', '# Test Spec');

    // Generate initial cache
    const cache = generateFolderDescriptions([specsDir]);
    const cachePath = path.join(specsDir, 'descriptions.json');
    saveDescriptionCache(cache, cachePath);

    // Touch description.json to make it newer than cache
    const descPath = path.join(folderDir, 'description.json');
    fs.writeFileSync(descPath, JSON.stringify({ specFolder: '001-test', description: 'updated' }));
    const futureTime = new Date(Date.now() + 5000);
    fs.utimesSync(descPath, futureTime, futureTime);

    expect(isCacheStale(cache, [specsDir])).toBe(true);
  });

  it('T046-25b: editing spec.md makes per-folder description stale and regeneration picks up changes', () => {
    const specsDir = path.join(td, 'specs');
    const folderDir = createSpecFolder(td, '001-stale-test', '# Original Title');

    // Generate and save initial description.json
    const desc = generatePerFolderDescription(folderDir, specsDir);
    expect(desc).not.toBeNull();
    savePerFolderDescription(desc!, folderDir);
    expect(isPerFolderDescriptionStale(folderDir)).toBe(false);

    // Touch spec.md to make it newer than description.json
    const futureTime = new Date(Date.now() + 5000);
    fs.utimesSync(path.join(folderDir, 'spec.md'), futureTime, futureTime);

    // Per-folder description should now be stale
    expect(isPerFolderDescriptionStale(folderDir)).toBe(true);

    // Regenerate and verify it picks up current spec.md content
    const refreshed = generatePerFolderDescription(folderDir, specsDir);
    expect(refreshed).not.toBeNull();
    expect(refreshed!.description).toBe('Original Title');
    savePerFolderDescription(refreshed!, folderDir);

    // Set description.json mtime beyond spec.md's future mtime to verify freshness
    const descPath = path.join(folderDir, 'description.json');
    const farFuture = new Date(Date.now() + 10000);
    fs.utimesSync(descPath, farFuture, farFuture);
    expect(isPerFolderDescriptionStale(folderDir)).toBe(false);
  });
});

/* --- 010-CHK-028: loadPerFolderDescription performance benchmark --- */

describe('CHK-028: Per-folder description.json read performance', () => {
  let td: string;
  beforeEach(() => { td = createTempWorkspace(); });
  afterEach(() => { cleanup(td); });

  it('T046-26: loadPerFolderDescription completes in <5ms', () => {
    const folderDir = createSpecFolder(td, '001-perf', '# Perf Test');
    const perFolder: PerFolderDescription = {
      specFolder: '001-perf',
      description: 'Performance test folder',
      keywords: ['perf', 'test', 'benchmark'],
      lastUpdated: new Date().toISOString(),
      specId: '001',
      folderSlug: 'perf',
      parentChain: [],
      memorySequence: 0,
      memoryNameHistory: [],
    };
    savePerFolderDescription(perFolder, folderDir);

    const start = performance.now();
    const result = loadPerFolderDescription(folderDir);
    const elapsed = performance.now() - start;

    expect(result).not.toBeNull();
    expect(elapsed).toBeLessThan(5);
  });
});

/* --- 010-CHK-029: Full aggregation scan performance benchmark --- */

describe('CHK-029: generateFolderDescriptions scan performance', () => {
  let td: string;
  beforeEach(() => { td = createTempWorkspace(); });
  afterEach(() => { cleanup(td); });

  it('T046-27: generateFolderDescriptions scan completes in <2s for 500 folders', { timeout: 10000 }, () => {
    const specsDir = path.join(td, 'specs');

    // Create 500 spec folders to exercise the scan path at production scale
    for (let i = 1; i <= 500; i++) {
      const id = String(i).padStart(3, '0');
      createSpecFolder(td, `${id}-bench-folder`, `# Bench Folder ${i}`);
    }

    const start = performance.now();
    const cache = generateFolderDescriptions([specsDir]);
    const elapsed = performance.now() - start;

    expect(cache.folders.length).toBeGreaterThanOrEqual(500);
    expect(elapsed).toBeLessThan(2000);
  });
});
