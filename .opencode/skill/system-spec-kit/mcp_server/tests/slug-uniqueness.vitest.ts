// ---------------------------------------------------------------
// MODULE: Test — Slug Uniqueness
// ---------------------------------------------------------------
// Tests: ensureUniqueMemoryFilename collision detection and resolution
// Note: Function is in scripts/utils/slug-utils.ts but tested here
//       where vitest infrastructure exists.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { ensureUniqueMemoryFilename } from '../../scripts/dist/utils/slug-utils';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-slug-'));
});

afterEach(() => {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch { /* best effort */ }
});

describe('ensureUniqueMemoryFilename', () => {
  it('returns original filename when no collision', () => {
    const result = ensureUniqueMemoryFilename(tmpDir, '08-03-26_10-24__my-slug.md');
    expect(result).toBe('08-03-26_10-24__my-slug.md');
  });

  it('returns original filename when directory does not exist', () => {
    const nonExistent = path.join(tmpDir, 'does-not-exist');
    const result = ensureUniqueMemoryFilename(nonExistent, 'test.md');
    expect(result).toBe('test.md');
  });

  it('appends -1 suffix on first collision', () => {
    fs.writeFileSync(path.join(tmpDir, '08-03-26_10-24__my-slug.md'), 'existing');
    const result = ensureUniqueMemoryFilename(tmpDir, '08-03-26_10-24__my-slug.md');
    expect(result).toBe('08-03-26_10-24__my-slug-1.md');
  });

  it('appends incrementing suffix for multiple collisions', () => {
    fs.writeFileSync(path.join(tmpDir, 'test.md'), 'existing');
    fs.writeFileSync(path.join(tmpDir, 'test-1.md'), 'existing');
    fs.writeFileSync(path.join(tmpDir, 'test-2.md'), 'existing');
    const result = ensureUniqueMemoryFilename(tmpDir, 'test.md');
    expect(result).toBe('test-3.md');
  });

  it('generates 10 unique filenames for 10 identical inputs', () => {
    const filenames = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const name = ensureUniqueMemoryFilename(tmpDir, 'collision.md');
      filenames.add(name);
      fs.writeFileSync(path.join(tmpDir, name), `content-${i}`);
    }
    expect(filenames.size).toBe(10);
  });

  it('ignores non-md files in collision check', () => {
    fs.writeFileSync(path.join(tmpDir, 'test.json'), 'json content');
    const result = ensureUniqueMemoryFilename(tmpDir, 'test.md');
    expect(result).toBe('test.md');
  });

  it('falls back to random hex suffix after 100 collisions (C5)', () => {
    // Create test.md plus test-1.md through test-100.md (101 files total)
    fs.writeFileSync(path.join(tmpDir, 'test.md'), 'base');
    for (let i = 1; i <= 100; i++) {
      fs.writeFileSync(path.join(tmpDir, `test-${i}.md`), `collision-${i}`);
    }

    const result = ensureUniqueMemoryFilename(tmpDir, 'test.md');
    // Should match test-<12-char-hex>.md pattern (randomBytes(6) → 12 hex chars)
    expect(result).toMatch(/^test-[0-9a-f]{12}\.md$/);
    // Must not collide with any existing file
    expect(fs.existsSync(path.join(tmpDir, result))).toBe(false);
  });
});
