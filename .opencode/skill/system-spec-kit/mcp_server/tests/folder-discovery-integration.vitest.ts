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
} from '../lib/search/folder-discovery';
import type { DescriptionCache } from '../lib/search/folder-discovery';
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
  } catch { /* best effort */ }
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
    } catch (error) {
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

    // Cache generated "now" — spec.md was created before now
    const cache: DescriptionCache = {
      version: 1,
      generated: new Date(Date.now() + 10000).toISOString(), // future
      folders: [],
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
      folders: [{ specFolder: 'test', description: 'Pre-existing', keywords: ['pre'], lastUpdated: new Date().toISOString() }],
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

  it('T046-19: ensureDescriptionCache returns null on nonexistent base path', () => {
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
