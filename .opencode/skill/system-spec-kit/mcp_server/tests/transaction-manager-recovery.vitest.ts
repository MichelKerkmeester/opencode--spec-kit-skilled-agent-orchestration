import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  recoverPendingFile,
  recoverAllPendingFiles,
  getPendingPath,
  findPendingFiles,
  resetMetrics,
  getMetrics,
} from '../lib/storage/transaction-manager';

const tempDirs: string[] = [];
const originalSpecKitDbDir = process.env.SPEC_KIT_DB_DIR;
const originalSpeckitDbDir = process.env.SPECKIT_DB_DIR;

function ensureDefaultRecoveryDb(rootDir: string): string {
  const dbDir = path.join(rootDir, 'db-fixture');
  const dbPath = path.join(dbDir, 'context-index.sqlite');
  fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(dbPath, '', 'utf-8');
  process.env.SPEC_KIT_DB_DIR = dbDir;
  delete process.env.SPECKIT_DB_DIR;
  return dbPath;
}

function createTempDir(label: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `txn-mgr-recovery-${label}-`));
  tempDirs.push(dir);
  resetMetrics();
  ensureDefaultRecoveryDb(dir);
  return dir;
}

function createPendingFile(
  rootDir: string,
  relativeOriginalPath: string,
  content: string = 'pending content'
): { originalPath: string; pendingPath: string } {
  const originalPath = path.join(rootDir, relativeOriginalPath);
  fs.mkdirSync(path.dirname(originalPath), { recursive: true });
  const pendingPath = getPendingPath(originalPath);
  fs.writeFileSync(pendingPath, content, 'utf-8');
  return { originalPath, pendingPath };
}

afterEach(() => {
  for (const dir of tempDirs.splice(0, tempDirs.length)) {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch {
      // Best-effort cleanup
    }
  }

  if (originalSpecKitDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalSpecKitDbDir;
  }

  if (originalSpeckitDbDir === undefined) {
    delete process.env.SPECKIT_DB_DIR;
  } else {
    process.env.SPECKIT_DB_DIR = originalSpeckitDbDir;
  }
});

describe('transaction-manager recovery committed vs uncommitted (T007)', () => {
  it('T007-R1: recovers when no isCommittedInDb callback is provided', () => {
    const dir = createTempDir('r1');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/001/memory/r1.md', '# pending r1');

    const result = recoverPendingFile(pendingPath);

    expect(result.path).toBe(pendingPath);
    expect(result.recovered).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.existsSync(pendingPath)).toBe(false);
    expect(fs.readFileSync(originalPath, 'utf-8')).toBe('# pending r1');
    expect(getMetrics().totalRecoveries).toBe(1);
  });

  it('T007-R2: recovers when isCommittedInDb returns true', () => {
    const dir = createTempDir('r2');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/001/memory/r2.md', '# pending r2');
    const callbackPaths: string[] = [];

    const result = recoverPendingFile(pendingPath, (dbPath) => {
      callbackPaths.push(dbPath);
      return true;
    });

    expect(result.recovered).toBe(true);
    expect(callbackPaths).toEqual([originalPath]);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.existsSync(pendingPath)).toBe(false);
    expect(getMetrics().totalRecoveries).toBe(1);
  });

  it('T007-R3: marks pending file as stale when isCommittedInDb returns false', () => {
    const dir = createTempDir('r3');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/001/memory/r3.md', '# pending r3');

    const result = recoverPendingFile(pendingPath, () => false);

    expect(result.path).toBe(pendingPath);
    expect(result.recovered).toBe(false);
    expect(result.error).toContain('Stale');
    expect(fs.existsSync(originalPath)).toBe(false);
    expect(getMetrics().totalRecoveries).toBe(0);
  });

  it('T007-R4: does not delete stale pending file', () => {
    const dir = createTempDir('r4');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/001/memory/r4.md', '# pending r4');

    const result = recoverPendingFile(pendingPath, () => false);

    expect(result.recovered).toBe(false);
    expect(result.error).toContain('Stale');
    expect(fs.existsSync(pendingPath)).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(false);
  });

  it('T007-R4b: callback exceptions surface as recovery errors and leave the pending file in place', () => {
    const dir = createTempDir('r4b');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/001/memory/r4b.md', '# pending r4b');

    const result = recoverPendingFile(pendingPath, () => {
      throw new Error('db lookup failed');
    });

    expect(result.recovered).toBe(false);
    expect(result.error).toContain('db lookup failed');
    expect(fs.existsSync(pendingPath)).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(false);
    expect(getMetrics().totalErrors).toBe(1);
  });

  it('T011-R1: skips rename when original target is missing and DB probe says uncommitted', () => {
    const dir = createTempDir('t011-r1');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/011/memory/uncommitted.md', '# pending uncommitted');
    const dbPath = path.join(dir, 'db', 'context-index.sqlite');
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, '', 'utf-8');

    const result = recoverPendingFile(pendingPath, () => false, dbPath);

    expect(result.path).toBe(pendingPath);
    expect(result.recovered).toBe(false);
    expect(result.error).toContain('Stale');
    expect(fs.existsSync(pendingPath)).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(false);
  });

  it('T011-R2: renames pending file when DB probe says committed and original path exists', () => {
    const dir = createTempDir('t011-r2');
    const originalPath = path.join(dir, 'specs/011/memory/committed.md');
    fs.mkdirSync(path.dirname(originalPath), { recursive: true });
    fs.writeFileSync(originalPath, '# original committed', 'utf-8');
    const pendingPath = getPendingPath(originalPath);
    fs.writeFileSync(pendingPath, '# pending committed', 'utf-8');
    const dbPath = path.join(dir, 'db', 'context-index.sqlite');
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, '', 'utf-8');

    const result = recoverPendingFile(pendingPath, () => true, dbPath);

    expect(result.path).toBe(pendingPath);
    expect(result.recovered).toBe(true);
    expect(fs.existsSync(pendingPath)).toBe(false);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.readFileSync(originalPath, 'utf-8')).toBe('# pending committed');
  });

  it('T011-R3: without DB probe, recovery defaults to rename behavior', () => {
    const dir = createTempDir('t011-r3');
    const originalPath = path.join(dir, 'specs/011/memory/no-probe.md');
    fs.mkdirSync(path.dirname(originalPath), { recursive: true });
    fs.writeFileSync(originalPath, '# original no probe', 'utf-8');
    const pendingPath = getPendingPath(originalPath);
    fs.writeFileSync(pendingPath, '# pending no probe', 'utf-8');

    const result = recoverPendingFile(pendingPath);

    expect(result.path).toBe(pendingPath);
    expect(result.recovered).toBe(true);
    expect(fs.existsSync(pendingPath)).toBe(false);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.readFileSync(originalPath, 'utf-8')).toBe('# pending no probe');
  });

  it('T007-R5: recoverAllPendingFiles passes isCommittedInDb callback to each pending file', () => {
    const dir = createTempDir('r5');
    const p1 = createPendingFile(dir, 'specs/a/memory/one.md', 'one');
    const p2 = createPendingFile(dir, 'specs/b/memory/two.md', 'two');
    const callbackPaths: string[] = [];

    const results = recoverAllPendingFiles(dir, (dbPath) => {
      callbackPaths.push(dbPath);
      return true;
    });

    expect(results).toHaveLength(2);
    expect(results.every((r) => r.recovered)).toBe(true);
    expect(callbackPaths.slice().sort()).toEqual([p1.originalPath, p2.originalPath].sort());
  });

  it('T007-R6: recoverAllPendingFiles returns mixed committed and stale results correctly', () => {
    const dir = createTempDir('r6');
    const committedA = createPendingFile(dir, 'specs/memory/committed-a.md', 'A');
    const stale = createPendingFile(dir, 'specs/memory/stale.md', 'S');
    const committedB = createPendingFile(dir, 'specs/memory/committed-b.md', 'B');

    const results = recoverAllPendingFiles(dir, (dbPath) => path.basename(dbPath) !== 'stale.md');
    const byPendingPath = new Map(results.map((result) => [result.path, result]));

    expect(results).toHaveLength(3);
    expect(byPendingPath.get(committedA.pendingPath)?.recovered).toBe(true);
    expect(byPendingPath.get(committedB.pendingPath)?.recovered).toBe(true);
    expect(byPendingPath.get(stale.pendingPath)?.recovered).toBe(false);
    expect(byPendingPath.get(stale.pendingPath)?.error).toContain('Stale');

    expect(fs.existsSync(committedA.originalPath)).toBe(true);
    expect(fs.existsSync(committedA.pendingPath)).toBe(false);
    expect(fs.existsSync(committedB.originalPath)).toBe(true);
    expect(fs.existsSync(committedB.pendingPath)).toBe(false);
    expect(fs.existsSync(stale.originalPath)).toBe(false);
    expect(fs.existsSync(stale.pendingPath)).toBe(true);
  });

  it('T007-R7: findPendingFiles returns only _pending files', () => {
    const dir = createTempDir('r7');
    const root = path.join(dir, 'specs', 'pending-scan');
    fs.mkdirSync(path.join(root, 'nested'), { recursive: true });

    const pending1 = path.join(root, 'doc_pending.md');
    const pending2 = path.join(root, 'nested', 'note_pending.txt');
    const pending3 = path.join(root, 'nested', 'deep_pending.md');
    const normal1 = path.join(root, 'doc.md');
    const normal2 = path.join(root, 'nested', 'almost_pendingness.md');

    fs.writeFileSync(pending1, 'p1', 'utf-8');
    fs.writeFileSync(pending2, 'p2', 'utf-8');
    fs.writeFileSync(pending3, 'p3', 'utf-8');
    fs.writeFileSync(normal1, 'n1', 'utf-8');
    fs.writeFileSync(normal2, 'n2', 'utf-8');

    const pendingFiles = findPendingFiles(dir);
    const pendingSet = new Set(pendingFiles);

    expect(pendingFiles).toHaveLength(3);
    expect(pendingSet.has(pending1)).toBe(true);
    expect(pendingSet.has(pending2)).toBe(true);
    expect(pendingSet.has(pending3)).toBe(true);
    expect(pendingSet.has(normal1)).toBe(false);
    expect(pendingSet.has(normal2)).toBe(false);
  });

  it('T007-R8: when original is newer, pending is deleted and file is not recovered', () => {
    const dir = createTempDir('r8');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/001/memory/r8.md', '# pending r8');
    fs.writeFileSync(originalPath, '# original r8', 'utf-8');

    const nowSeconds = Date.now() / 1000;
    fs.utimesSync(pendingPath, nowSeconds - 120, nowSeconds - 120);
    fs.utimesSync(originalPath, nowSeconds, nowSeconds);

    const result = recoverPendingFile(pendingPath);

    expect(result.recovered).toBe(false);
    expect(result.error).toContain('Original is newer');
    expect(fs.existsSync(pendingPath)).toBe(false);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.readFileSync(originalPath, 'utf-8')).toBe('# original r8');
  });

  it('T007-R9: skips recovery when DB file is missing even if callback reports committed', () => {
    const dir = createTempDir('r9');
    const { originalPath, pendingPath } = createPendingFile(dir, 'specs/001/memory/r9.md', '# pending r9');
    const missingDbPath = path.join(dir, 'missing-db', 'context-index.sqlite');

    const result = recoverPendingFile(pendingPath, () => true, missingDbPath);

    expect(result.recovered).toBe(false);
    expect(result.error).toContain('Database file missing');
    expect(fs.existsSync(pendingPath)).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(false);
  });
});
