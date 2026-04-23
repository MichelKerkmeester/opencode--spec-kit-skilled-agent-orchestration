// ───────────────────────────────────────────────────────────────
// MODULE: Spec Folder Mutex
// ───────────────────────────────────────────────────────────────
// Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU).

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Atomic-save parity and partial-indexing hints

const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();
const LOCK_ROOT = path.join(os.tmpdir(), 'spec-kit-memory-save-locks');
const LOCK_WAIT_MS = 25;
const LOCK_TIMEOUT_MS = 30_000;
const LOCK_STALE_MS = 5 * 60 * 1000;

interface InterprocessLockHandle {
  lockDir: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLockDir(specFolder: string): string {
  const digest = createHash('sha1').update(specFolder).digest('hex');
  return path.join(LOCK_ROOT, digest);
}

function isExistingDirectoryError(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'EEXIST');
}

function isStaleLock(lockDir: string): boolean {
  try {
    const stats = fs.statSync(lockDir);
    return (Date.now() - stats.mtimeMs) > LOCK_STALE_MS;
  } catch {
    return false;
  }
}

function releaseInterprocessLock(handle: InterprocessLockHandle): void {
  try {
    fs.rmSync(handle.lockDir, { recursive: true, force: true });
  } catch (error: unknown) {
    console.warn('[memory-save] failed to release interprocess spec-folder lock:', error);
  }
}

async function acquireInterprocessLock(specFolder: string): Promise<InterprocessLockHandle> {
  const lockDir = getLockDir(specFolder);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;

  fs.mkdirSync(LOCK_ROOT, { recursive: true });

  while (true) {
    try {
      fs.mkdirSync(lockDir);
      fs.writeFileSync(path.join(lockDir, 'owner.json'), JSON.stringify({
        pid: process.pid,
        specFolder,
        acquiredAt: new Date().toISOString(),
      }));
      return { lockDir };
    } catch (error: unknown) {
      if (!isExistingDirectoryError(error)) {
        throw error;
      }

      if (isStaleLock(lockDir)) {
        fs.rmSync(lockDir, { recursive: true, force: true });
        continue;
      }

      if (Date.now() >= deadline) {
        throw new Error(`Timed out acquiring interprocess spec-folder lock for ${specFolder}`);
      }

      await sleep(LOCK_WAIT_MS);
    }
  }
}

async function withSpecFolderLock<T>(specFolder: string, fn: () => Promise<T>): Promise<T> {
  const normalizedFolder = specFolder || '__global__';
  const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
    .catch((error: unknown) => {
      console.error('[memory-save] prior queued save failed:', error);
    })
    .then(async () => {
      const interprocessLock = await acquireInterprocessLock(normalizedFolder);
      try {
        return await fn();
      } finally {
        releaseInterprocessLock(interprocessLock);
      }
    });
  SPEC_FOLDER_LOCKS.set(normalizedFolder, chain);
  try {
    return await chain;
  } finally {
    if (SPEC_FOLDER_LOCKS.get(normalizedFolder) === chain) {
      SPEC_FOLDER_LOCKS.delete(normalizedFolder);
    }
  }
}

export { SPEC_FOLDER_LOCKS, withSpecFolderLock };
