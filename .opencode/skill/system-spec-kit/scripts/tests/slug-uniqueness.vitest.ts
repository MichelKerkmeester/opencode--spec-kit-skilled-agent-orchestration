// ───────────────────────────────────────────────────────────────
// 1. TEST — SLUG UNIQUENESS
// ───────────────────────────────────────────────────────────────
// Tests: ensureUniqueMemoryFilename collision detection and resolution

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { ensureUniqueMemoryFilename } from '../utils/slug-utils';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-slug-'));
});

afterEach(() => {
  vi.restoreAllMocks();
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

  it('returns distinct random fallback names across repeated >100-collision calls', () => {
    fs.writeFileSync(path.join(tmpDir, 'test.md'), 'base');
    for (let i = 1; i <= 100; i++) {
      fs.writeFileSync(path.join(tmpDir, `test-${i}.md`), `collision-${i}`);
    }

    const first = ensureUniqueMemoryFilename(tmpDir, 'test.md');
    fs.writeFileSync(path.join(tmpDir, first), 'reserved first fallback');

    const second = ensureUniqueMemoryFilename(tmpDir, 'test.md');

    expect(first).toMatch(/^test-[0-9a-f]{12}\.md$/);
    expect(second).toMatch(/^test-[0-9a-f]{12}\.md$/);
    expect(second).not.toBe(first);
  });

  it('P1-5: re-throws EACCES error from fs.openSync', () => {
    // Make the directory read-only so O_CREAT | O_EXCL fails with EACCES
    fs.chmodSync(tmpDir, 0o555);

    try {
      expect(() => ensureUniqueMemoryFilename(tmpDir, 'test.md')).toThrow();

      try {
        ensureUniqueMemoryFilename(tmpDir, 'test.md');
      } catch (err: unknown) {
        expect((err as NodeJS.ErrnoException).code).toBe('EACCES');
      }
    } finally {
      // Restore write permissions for cleanup
      fs.chmodSync(tmpDir, 0o755);
    }
  });
});
