// Converted from: unit-path-security.test.ts (custom runner)
// TEST: PATH SECURITY (T001-T007)
// Phase 1: path-security.ts — realpathSync symlink traversal fix
import { describe, it, expect, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

/* --- Tests --- */

describe('Path Security (T001-T007)', () => {

  it('T001: valid path within ALLOWED_BASE_PATHS passes validation', () => {
    const cwd = process.cwd();
    const testPath = path.join(cwd, 'package.json');
    const result = validateFilePath(testPath, [cwd]);

    expect(result).not.toBeNull();
    expect(typeof result).toBe('string');
    expect(path.basename(result!)).toBe('package.json');
  });

  it('T002: path traversal attempt (../../etc/passwd) is rejected', () => {
    const cwd = process.cwd();
    const maliciousPath = path.join(cwd, '..', '..', '..', '..', 'etc', 'passwd');
    const result = validateFilePath(maliciousPath, [cwd]);

    expect(result).toBeNull();
  });

  it('T003: null bytes in path rejected', () => {
    const cwd = process.cwd();
    const nullBytePath = path.join(cwd, 'file\0.txt');
    const result = validateFilePath(nullBytePath, [cwd]);

    expect(result).toBeNull();
  });

  it('T004: path outside allowed bases rejected', () => {
    const allowedBase = '/tmp/test-allowed-base-does-not-exist';
    const outsidePath = '/usr/bin/node';
    const result = validateFilePath(outsidePath, [allowedBase]);

    expect(result).toBeNull();
  });

  it('T005: symlink resolution blocks escape from allowed base', () => {
    const tmpBase = path.join(os.tmpdir(), 'speckit-test-pathsec-' + Date.now());
    const allowedDir = path.join(tmpBase, 'allowed');
    const outsideDir = path.join(tmpBase, 'outside');
    const symlinkPath = path.join(allowedDir, 'sneaky-link');

    try {
      fs.mkdirSync(allowedDir, { recursive: true });
      fs.mkdirSync(outsideDir, { recursive: true });

      const targetFile = path.join(outsideDir, 'secret.txt');
      fs.writeFileSync(targetFile, 'secret data');

      fs.symlinkSync(targetFile, symlinkPath);

      const result = validateFilePath(symlinkPath, [allowedDir]);

      // After symlink resolution, target is outside allowedDir → should be rejected
      expect(result).toBeNull();
    } catch (e: unknown) {
      const code = e instanceof Error && 'code' in e ? String((e as { code?: unknown }).code) : '';
      if (code === 'EPERM' || code === 'EACCES') {
        // Skip on permission errors
        return;
      }
      throw e;
    } finally {
      try {
        if (fs.existsSync(symlinkPath)) fs.unlinkSync(symlinkPath);
        if (fs.existsSync(path.join(outsideDir, 'secret.txt'))) fs.unlinkSync(path.join(outsideDir, 'secret.txt'));
        if (fs.existsSync(outsideDir)) fs.rmdirSync(outsideDir);
        if (fs.existsSync(allowedDir)) fs.rmdirSync(allowedDir);
        if (fs.existsSync(tmpBase)) fs.rmdirSync(tmpBase);
      } catch {
        // Best-effort cleanup
      }
    }
  });

  it('T006: empty/null/undefined paths rejected', () => {
    const cwd = process.cwd();

    const result1 = validateFilePath('', [cwd]);
    expect(result1).toBeNull();

    const result2 = validateFilePath(null as unknown as string, [cwd]);
    expect(result2).toBeNull();

    const result3 = validateFilePath(undefined as unknown as string, [cwd]);
    expect(result3).toBeNull();
  });

  it('T007: empty/null/undefined allowed_base_paths rejected', () => {
    const testPath = '/tmp/test.txt';

    const result1 = validateFilePath(testPath, []);
    expect(result1).toBeNull();

    const result2 = validateFilePath(testPath, null as unknown as string[]);
    expect(result2).toBeNull();

    const result3 = validateFilePath(testPath, undefined as unknown as string[]);
    expect(result3).toBeNull();
  });
});
