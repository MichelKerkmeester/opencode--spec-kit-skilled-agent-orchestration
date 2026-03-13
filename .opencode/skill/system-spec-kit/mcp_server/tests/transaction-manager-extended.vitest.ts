// Converted from: transaction-manager-extended.test.ts (custom runner)
// TEST: deleteFileIfExists (transaction-manager extended)
// Covers the single untested export from transaction-manager.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import {
  deleteFileIfExists,
  resetMetrics,
  getMetrics,
} from '../lib/storage/transaction-manager';

/* --- Helpers --- */

let TEST_DIR: string | null = null;

function setup(testName: string): string {
  const dir = path.join(os.tmpdir(), 'txn-mgr-ext-' + Date.now() + '-' + testName);
  fs.mkdirSync(dir, { recursive: true });
  TEST_DIR = dir;
  return dir;
}

function cleanup(): void {
  try {
    if (TEST_DIR && fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  } catch {
    // Best-effort cleanup
  }
  TEST_DIR = null;
}

/* --- Tests --- */

describe('deleteFileIfExists (transaction-manager extended)', () => {
  afterEach(() => {
    cleanup();
  });

  it('deletes an existing file and returns true', () => {
    const dir = setup('delete-existing');
    resetMetrics();
    const filePath = path.join(dir, 'to-delete.txt');
    fs.writeFileSync(filePath, 'temporary content');

    const result = deleteFileIfExists(filePath);

    expect(result).toBe(true);
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('returns false for non-existent file', () => {
    const dir = setup('no-file');
    resetMetrics();
    const filePath = path.join(dir, 'does-not-exist.txt');

    const result = deleteFileIfExists(filePath);

    expect(result).toBe(false);
  });

  it('returns false for non-existent directory', () => {
    resetMetrics();
    const filePath = path.join(os.tmpdir(), 'txn-no-dir-' + Date.now(), 'subdir', 'ghost.txt');

    const result = deleteFileIfExists(filePath);

    expect(result).toBe(false);
  });

  it('increments totalDeletes metric', () => {
    const dir = setup('metrics-delete');
    resetMetrics();
    const f1 = path.join(dir, 'a.txt');
    const f2 = path.join(dir, 'b.txt');
    fs.writeFileSync(f1, 'a');
    fs.writeFileSync(f2, 'b');

    deleteFileIfExists(f1);
    deleteFileIfExists(f2);

    const m = getMetrics();
    expect(m.totalDeletes).toBe(2);
    expect(m.lastOperationTime).toBeTruthy();
  });

  it('does not increment totalDeletes for missing file', () => {
    const dir = setup('metrics-no-delete');
    resetMetrics();
    const filePath = path.join(dir, 'nope.txt');

    deleteFileIfExists(filePath);

    const m = getMetrics();
    expect(m.totalDeletes).toBe(0);
  });

  it('works with paths containing spaces', () => {
    const dir = setup('spaces-in-path');
    resetMetrics();
    const spacedDir = path.join(dir, 'folder with spaces', 'sub dir');
    fs.mkdirSync(spacedDir, { recursive: true });
    const filePath = path.join(spacedDir, 'my file.txt');
    fs.writeFileSync(filePath, 'spaced content');

    const result = deleteFileIfExists(filePath);

    expect(result).toBe(true);
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('works with special characters in filename', () => {
    const dir = setup('special-chars');
    resetMetrics();
    const filePath = path.join(dir, 'file-with_special.chars (1).txt');
    fs.writeFileSync(filePath, 'special');

    const result = deleteFileIfExists(filePath);

    expect(result).toBe(true);
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('handles directory path (not a file) gracefully', () => {
    const dir = setup('dir-not-file');
    resetMetrics();
    const subDir = path.join(dir, 'a-directory');
    fs.mkdirSync(subDir, { recursive: true });

    // ExistsSync returns true for directories, but unlinkSync will throw
    // DeleteFileIfExists should catch the error and return false
    const result = deleteFileIfExists(subDir);

    expect(result).toBe(false);
    const m = getMetrics();
    expect(m.totalErrors).toBe(1);
  });

  it('updates lastOperationTime on successful delete', () => {
    const dir = setup('timestamp');
    resetMetrics();
    const filePath = path.join(dir, 'timestamped.txt');
    fs.writeFileSync(filePath, 'time');

    const before = new Date().toISOString();
    deleteFileIfExists(filePath);
    const after = new Date().toISOString();

    const m = getMetrics();
    expect(m.lastOperationTime).toBeTruthy();
    expect(m.lastOperationTime! >= before).toBe(true);
    expect(m.lastOperationTime! <= after).toBe(true);
  });

  it('repeated delete of same path returns true then false', () => {
    const dir = setup('double-delete');
    resetMetrics();
    const filePath = path.join(dir, 'once.txt');
    fs.writeFileSync(filePath, 'only once');

    const first = deleteFileIfExists(filePath);
    const second = deleteFileIfExists(filePath);

    expect(first).toBe(true);
    expect(second).toBe(false);
    const m = getMetrics();
    expect(m.totalDeletes).toBe(1);
  });
});
