// TEST: TRANSACTION MANAGER
// Converted from: transaction-manager.test.ts (custom runner)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  getPendingPath,
  getOriginalPath,
  isPendingFile,
  runInTransaction,
  atomicWriteFile,
  executeAtomicSave,
  findPendingFiles,
  recoverPendingFile,
  recoverAllPendingFiles,
  getMetrics,
  resetMetrics,
  deleteFileIfExists,
  TEMP_SUFFIX,
  PENDING_SUFFIX,
} from '../lib/storage/transaction-manager';

let TEST_DIR: string | null = null;

function setup(testName: string = 'default'): void {
  TEST_DIR = path.join(os.tmpdir(), 'transaction-manager-vitest-' + Date.now() + '-' + testName);
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
  resetMetrics();
}

function cleanup(): void {
  try {
    if (TEST_DIR && fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  } catch (err: unknown) {
    console.warn('Cleanup warning:', (err as Error).message);
  }
  TEST_DIR = null;
}

/* ───────────────────────────────────────────────────────────────
   UNIT TESTS (T105-T107)
──────────────────────────────────────────────────────────────── */

describe('Transaction Manager Unit Tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('Pending path generation', () => {
    const original = '/path/to/memory/file.md';
    const pending = getPendingPath(original);

    expect(pending).toBe('/path/to/memory/file_pending.md');

    const recovered = getOriginalPath(pending);
    expect(recovered).toBe(original);

    expect(isPendingFile(pending)).toBe(true);
    expect(isPendingFile(original)).toBe(false);
  });

  it('Atomic write success', () => {
    setup('atomic-write');
    const filePath = path.join(TEST_DIR!, 'test-file.md');
    const content = '# Test Content\n\nThis is a test memory file.';

    const success = atomicWriteFile(filePath, content);

    expect(success).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
    const readContent = fs.readFileSync(filePath, 'utf-8');
    expect(readContent).toBe(content);
    expect(fs.existsSync(filePath + '.tmp')).toBe(false);
  });

  it('Execute atomic save success', () => {
    setup('save-success');
    const filePath = path.join(TEST_DIR!, 'memory', 'success.md');
    const content = '# Test Memory\n\nContent for successful save.';
    let dbOpCalled = false;

    const result = executeAtomicSave(
      filePath,
      content,
      () => { dbOpCalled = true; }
    );

    expect(result.success).toBe(true);
    expect(result.filePath).toBe(filePath);
    expect(dbOpCalled).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);

    const metrics = getMetrics();
    expect(metrics.totalAtomicWrites).toBe(1);
  });

  it('Execute atomic save with rollback', () => {
    setup('save-rollback');
    const filePath = path.join(TEST_DIR!, 'memory', 'rollback.md');
    const content = '# Test Memory\n\nContent for rollback test.';

    const result = executeAtomicSave(
      filePath,
      content,
      () => { throw new Error('Simulated DB failure'); }
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();

    const metrics = getMetrics();
    expect(metrics.totalErrors).toBe(1);
  });

  it('Execute atomic save with pending file cleanup on failure', () => {
    setup('save-pending');
    const filePath = path.join(TEST_DIR!, 'memory', 'pending.md');
    const content = '# Test Memory\n\nContent for pending test.';

    const result = executeAtomicSave(
      filePath,
      content,
      () => { throw new Error('Simulated DB failure'); }
    );

    expect(result.success).toBe(false);
    const pendingPath = getPendingPath(filePath);
    expect(fs.existsSync(pendingPath)).toBe(false);
  });

  it('Find pending files', () => {
    setup('find-pending');
    const memoryDir = path.join(TEST_DIR!, 'specs', '001-test', 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });

    fs.writeFileSync(path.join(memoryDir, 'normal.md'), 'Normal file');
    fs.writeFileSync(path.join(memoryDir, 'file1_pending.md'), 'Pending file 1');
    fs.writeFileSync(path.join(memoryDir, 'file2_pending.md'), 'Pending file 2');

    const pendingFiles = findPendingFiles(TEST_DIR!);

    expect(pendingFiles.length).toBe(2);
    expect(pendingFiles.every((f: string) => f.includes('_pending'))).toBe(true);
  });

  it('Recover pending file', () => {
    setup('recover-pending');
    const memoryDir = path.join(TEST_DIR!, 'specs', '002-test', 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });

    const originalPath = path.join(memoryDir, 'recovered.md');
    const pendingPath = getPendingPath(originalPath);
    const content = '# Recovered Memory\n\nThis was pending.';

    fs.writeFileSync(pendingPath, content);

    const result = recoverPendingFile(pendingPath);

    expect(result.recovered).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.existsSync(pendingPath)).toBe(false);

    const metrics = getMetrics();
    expect(metrics.totalRecoveries).toBe(1);
  });

  it('Recover all pending files', () => {
    setup('recover-all');
    const memoryDir = path.join(TEST_DIR!, 'specs', '003-test', 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });

    fs.writeFileSync(path.join(memoryDir, 'file1_pending.md'), 'Content 1');
    fs.writeFileSync(path.join(memoryDir, 'file2_pending.md'), 'Content 2');
    fs.writeFileSync(path.join(memoryDir, 'file3_pending.md'), 'Content 3');

    const results = recoverAllPendingFiles(TEST_DIR!);

    const recovered = results.filter(r => r.recovered).length;
    expect(recovered).toBe(3);

    expect(fs.existsSync(path.join(memoryDir, 'file1.md'))).toBe(true);
    expect(fs.existsSync(path.join(memoryDir, 'file2.md'))).toBe(true);
    expect(fs.existsSync(path.join(memoryDir, 'file3.md'))).toBe(true);
  });

  it('Metrics tracking', () => {
    setup('metrics');
    let metrics = getMetrics();
    expect(metrics.totalAtomicWrites).toBe(0);
    expect(metrics.totalErrors).toBe(0);

    const filePath = path.join(TEST_DIR!, 'metrics-test.md');
    atomicWriteFile(filePath, 'Test content');

    metrics = getMetrics();
    expect(metrics.totalAtomicWrites).toBe(1);

    resetMetrics();
    metrics = getMetrics();
    expect(metrics.totalAtomicWrites).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   T192-T200: TRANSACTION ATOMICITY TESTS
──────────────────────────────────────────────────────────────── */

describe('Transaction Atomicity Tests (T192-T200)', () => {
  afterEach(() => {
    cleanup();
  });

  it('T191a: runInTransaction reuses the outer transaction for nested calls', () => {
    const calls: string[] = [];
    const fakeDb = {
      inTransaction: false,
      transaction: (fn: () => string) => {
        calls.push('transaction');
        return () => {
          calls.push('wrapped');
          return fn();
        };
      },
    };

    const result = runInTransaction(fakeDb as never, () => {
      calls.push('outer');
      return runInTransaction(fakeDb as never, () => {
        calls.push('inner');
        return 'done';
      });
    });

    expect(result).toBe('done');
    expect(calls).toEqual(['transaction', 'wrapped', 'outer', 'inner']);
  });

  it('T191b: runInTransaction avoids reopening when database is already inTransaction', () => {
    let wrapped = false;
    const fakeDb = {
      inTransaction: true,
      transaction: () => {
        wrapped = true;
        return () => 'unexpected';
      },
    };

    const result = runInTransaction(fakeDb as never, () => 'inside-existing-tx');

    expect(result).toBe('inside-existing-tx');
    expect(wrapped).toBe(false);
  });

  it('T192: execute_atomic_save() wraps file + DB op in transaction', () => {
    setup('T192-atomic-wrapper');
    const filePath = path.join(TEST_DIR!, 'memory', 'atomic-test.md');
    const content = '# Atomic Test\n\nTransaction test content.';
    let dbOpCalled = false;

    const result = executeAtomicSave(
      filePath,
      content,
      () => { dbOpCalled = true; }
    );

    expect(result.success).toBe(true);
    expect(result.filePath).toBe(filePath);
    expect(dbOpCalled).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);

    const readContent = fs.readFileSync(filePath, 'utf-8');
    expect(readContent).toBe(content);
  });

  it('T193: temp file + rename strategy for atomic writes', () => {
    setup('T193-temp-rename');
    const filePath = path.join(TEST_DIR!, 'atomic-rename.md');
    const tempPath = filePath + TEMP_SUFFIX;
    const content = '# Temp File Test\n\nContent for temp file rename test.';

    expect(TEMP_SUFFIX).toBe('.tmp');

    const success = atomicWriteFile(filePath, content);
    expect(success).toBe(true);

    expect(fs.existsSync(filePath)).toBe(true);
    const readContent = fs.readFileSync(filePath, 'utf-8');
    expect(readContent).toBe(content);

    expect(fs.existsSync(tempPath)).toBe(false);
  });

  it('T194: file cleanup on DB operation failure', () => {
    setup('T194-rollback');
    const filePath = path.join(TEST_DIR!, 'memory', 'rollback-test.md');
    const content = '# Rollback Test\n\nThis file should be cleaned up on failure.';

    const result = executeAtomicSave(
      filePath,
      content,
      () => { throw new Error('Simulated DB failure for T194'); }
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(result.error).toContain('T194');

    const metrics = getMetrics();
    expect(metrics.totalErrors).toBe(1);
  });

  it('T195: PENDING_SUFFIX constant and path helpers', () => {
    setup('T195-pending');
    expect(PENDING_SUFFIX).toBe('_pending');

    const filePath = '/test/memory/file.md';
    const pendingPath = getPendingPath(filePath);
    expect(pendingPath).toContain('_pending');

    expect(isPendingFile(pendingPath)).toBe(true);
    expect(isPendingFile(filePath)).toBe(false);

    const recoveredPath = getOriginalPath(pendingPath);
    expect(recoveredPath).toBe(filePath);
  });

  it('T196: recover_pending_file() on startup scenario', () => {
    setup('T196-startup-recovery');
    const memoryDir = path.join(TEST_DIR!, 'specs', 'crash-test', 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });

    const originalPath = path.join(memoryDir, 'recovered-startup.md');
    const pendingPath = getPendingPath(originalPath);
    const content = '# Startup Recovery Test\n\nThis simulates a file left pending after crash.';

    fs.writeFileSync(pendingPath, content);

    const result = recoverPendingFile(pendingPath);

    expect(result.recovered).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.existsSync(pendingPath)).toBe(false);

    const readContent = fs.readFileSync(originalPath, 'utf-8');
    expect(readContent).toBe(content);
  });

  it('T197: find_pending_files() scans recursively', () => {
    setup('T197-recursive-scan');
    const dirs = [
      path.join(TEST_DIR!, 'level1'),
      path.join(TEST_DIR!, 'level1', 'level2'),
      path.join(TEST_DIR!, 'level1', 'level2', 'level3'),
      path.join(TEST_DIR!, 'specs', 'project-a', 'memory'),
      path.join(TEST_DIR!, 'specs', 'project-b', 'memory'),
    ];

    for (const dir of dirs) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dirs[0], 'file1_pending.md'), 'Level 1 pending');
    fs.writeFileSync(path.join(dirs[1], 'file2_pending.md'), 'Level 2 pending');
    fs.writeFileSync(path.join(dirs[2], 'file3_pending.md'), 'Level 3 pending');
    fs.writeFileSync(path.join(dirs[3], 'memory1_pending.md'), 'Project A pending');
    fs.writeFileSync(path.join(dirs[4], 'memory2_pending.md'), 'Project B pending');

    fs.writeFileSync(path.join(dirs[0], 'normal.md'), 'Normal file');
    fs.writeFileSync(path.join(dirs[2], 'another.md'), 'Another normal file');

    const pendingFiles = findPendingFiles(TEST_DIR!);

    expect(pendingFiles.length).toBe(5);
    expect(pendingFiles.every((f: string) => isPendingFile(f))).toBe(true);

    const fileNames = pendingFiles.map((f: string) => path.basename(f));
    expect(fileNames).toContain('file1_pending.md');
    expect(fileNames).toContain('file2_pending.md');
    expect(fileNames).toContain('file3_pending.md');
    expect(fileNames).toContain('memory1_pending.md');
    expect(fileNames).toContain('memory2_pending.md');
  });

  it('T198: recover_all_pending_files() processes files', () => {
    setup('T198-recover-all');
    const memoryDir = path.join(TEST_DIR!, 'specs', 'bulk-test', 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });

    const totalFiles = 10;
    for (let i = 1; i <= totalFiles; i++) {
      const fileName = `memory${String(i).padStart(3, '0')}_pending.md`;
      fs.writeFileSync(path.join(memoryDir, fileName), `# Memory ${i}\n\nContent for file ${i}.`);
    }

    const initialPending = findPendingFiles(TEST_DIR!);
    expect(initialPending.length).toBe(totalFiles);

    const results = recoverAllPendingFiles(TEST_DIR!);

    const recovered = results.filter(r => r.recovered).length;
    expect(recovered).toBe(totalFiles);

    const remainingPending = findPendingFiles(TEST_DIR!);
    expect(remainingPending.length).toBe(0);
  });

  it('T199: pending file recovery renames correctly', () => {
    setup('T199-reindex');
    const memoryDir = path.join(TEST_DIR!, 'specs', 'reindex-test', 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });

    const originalPath = path.join(memoryDir, 'reindex-memory.md');
    const pendingPath = getPendingPath(originalPath);
    const content = '# Reindex Test\n\nContent to be recovered.';

    fs.writeFileSync(pendingPath, content);

    const result = recoverPendingFile(pendingPath);

    expect(result.recovered).toBe(true);
    expect(fs.existsSync(originalPath)).toBe(true);
    expect(fs.existsSync(pendingPath)).toBe(false);

    const readContent = fs.readFileSync(originalPath, 'utf-8');
    expect(readContent).toBe(content);

    const metrics = getMetrics();
    expect(metrics.totalRecoveries).toBe(1);
  });

  it('T200: metrics tracking across multiple operations', () => {
    setup('T200-metrics');
    resetMetrics();

    let metrics = getMetrics();
    expect(metrics.totalAtomicWrites).toBe(0);
    expect(metrics.totalErrors).toBe(0);
    expect(metrics.totalRecoveries).toBe(0);

    // Cause 3 errors
    for (let i = 1; i <= 3; i++) {
      const filePath = path.join(TEST_DIR!, 'memory', `error${i}.md`);
      executeAtomicSave(
        filePath,
        `# Error ${i}\n\nContent ${i}`,
        () => { throw new Error(`Failure ${i}`); }
      );
    }

    metrics = getMetrics();
    expect(metrics.totalErrors).toBe(3);

    // Add 2 successful writes
    for (let i = 1; i <= 2; i++) {
      const filePath = path.join(TEST_DIR!, `success${i}.md`);
      atomicWriteFile(filePath, `# Success ${i}\n\nContent ${i}`);
    }

    metrics = getMetrics();
    expect(metrics.totalAtomicWrites).toBe(2);
    expect(metrics.totalErrors).toBe(3);
    expect(metrics.lastOperationTime).toBeTruthy();

    // Verify reset clears all
    resetMetrics();
    metrics = getMetrics();
    expect(metrics.totalAtomicWrites).toBe(0);
    expect(metrics.totalErrors).toBe(0);
    expect(metrics.totalRecoveries).toBe(0);
    expect(metrics.lastOperationTime).toBe(null);
  });
});
