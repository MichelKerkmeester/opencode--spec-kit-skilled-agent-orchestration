// ───────────────────────────────────────────────────────────────
// MODULE: Atomic Index Memory
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import * as transactionManager from '../../lib/storage/transaction-manager.js';

import type {
  AtomicSaveOptions,
  AtomicSaveParams,
  AtomicSaveResult,
  IndexResult,
} from './types.js';
import { withSpecFolderLock } from './spec-folder-mutex.js';

// Feature catalog: Canonical continuity writer
// Feature catalog: Atomic-save parity and partial-indexing hints

interface AtomicIndexOriginalState {
  existed: boolean;
  content: string | null;
}

interface AtomicIndexPendingCleanupResult {
  cleaned: boolean;
  existed: boolean;
  error?: string;
}

interface AtomicIndexRestoreResult {
  restored: boolean;
  error?: string;
}

export interface AtomicIndexReady<TPrepared = unknown> {
  status: 'ready';
  prepared: TPrepared;
  specFolder: string;
  persistedContent?: string;
  persistedFilePath?: string;
}

export interface AtomicIndexTerminal {
  status: 'abort' | 'rejected';
  result: AtomicSaveResult;
}

export type AtomicIndexPreparation<TPrepared = unknown> =
  | AtomicIndexReady<TPrepared>
  | AtomicIndexTerminal;

export interface AtomicIndexAttemptContext {
  attempt: number;
  force: boolean;
}

export interface AtomicIndexLockedContext<TPrepared = unknown> extends AtomicIndexAttemptContext {
  params: AtomicSaveParams;
  ready: AtomicIndexReady<TPrepared>;
  specFolderLockAlreadyHeld: true;
}

export interface AtomicIndexDependencies<TPrepared = unknown> {
  prepare: (
    params: AtomicSaveParams,
    context: AtomicIndexAttemptContext,
  ) => Promise<AtomicIndexPreparation<TPrepared>> | AtomicIndexPreparation<TPrepared>;
  indexPrepared: (
    context: AtomicIndexLockedContext<TPrepared>,
  ) => Promise<IndexResult> | IndexResult;
  mapSuccessResult?: (
    indexResult: IndexResult,
    context: AtomicIndexLockedContext<TPrepared>,
  ) => Promise<AtomicSaveResult> | AtomicSaveResult;
  maxIndexAttempts?: number;
  getPendingPath?: (filePath: string) => string;
  withSpecFolderLock?: typeof withSpecFolderLock;
  captureOriginalState?: (filePath: string) => AtomicIndexOriginalState;
  restoreOriginalState?: (
    filePath: string,
    originalState: AtomicIndexOriginalState,
  ) => AtomicIndexRestoreResult;
  cleanupPendingFile?: (pendingPath: string) => AtomicIndexPendingCleanupResult;
  writePendingAndPromote?: (pendingPath: string, filePath: string, content: string) => void;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function deleteFileIfPresent(filePath: string): { deleted: boolean; existed: boolean; error?: string } {
  const existed = fs.existsSync(filePath);
  if (!existed) {
    return { deleted: false, existed: false };
  }

  try {
    fs.unlinkSync(filePath);
    return { deleted: true, existed: true };
  } catch (error: unknown) {
    return {
      deleted: false,
      existed: true,
      error: toErrorMessage(error),
    };
  }
}

function captureOriginalState(filePath: string): AtomicIndexOriginalState {
  if (!fs.existsSync(filePath)) {
    return { existed: false, content: null };
  }

  return {
    existed: true,
    content: fs.readFileSync(filePath, 'utf-8'),
  };
}

function restoreOriginalState(
  filePath: string,
  originalState: AtomicIndexOriginalState,
): AtomicIndexRestoreResult {
  try {
    if (!originalState.existed) {
      const deleteResult = deleteFileIfPresent(filePath);
      if (!deleteResult.existed || deleteResult.deleted) {
        return { restored: true };
      }
      return {
        restored: false,
        error: deleteResult.error ?? `Failed to remove promoted file at ${filePath}`,
      };
    }

    if (typeof originalState.content !== 'string') {
      return { restored: false, error: 'Original file content is unavailable for rollback' };
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, originalState.content, 'utf-8');
    return { restored: true };
  } catch (error: unknown) {
    return {
      restored: false,
      error: toErrorMessage(error),
    };
  }
}

function cleanupPendingFile(pendingPath: string): AtomicIndexPendingCleanupResult {
  const deleteResult = deleteFileIfPresent(pendingPath);
  if (!deleteResult.existed || deleteResult.deleted) {
    return {
      cleaned: true,
      existed: deleteResult.existed,
    };
  }
  return {
    cleaned: false,
    existed: deleteResult.existed,
    error: deleteResult.error ?? `Failed to remove pending file at ${pendingPath}`,
  };
}

function writePendingAndPromote(pendingPath: string, filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
  fs.writeFileSync(pendingPath, content, 'utf-8');
  fs.renameSync(pendingPath, filePath);
}

function defaultPendingPath(filePath: string): string {
  const basePendingPath = transactionManager.getPendingPath(filePath);
  return `${basePendingPath}.${randomUUID().slice(0, 8)}`;
}

function buildRejectedResult(
  filePath: string,
  indexResult: IndexResult,
  rollbackSucceeded: boolean,
  errorMetadata: Record<string, string> | null,
): AtomicSaveResult {
  return {
    success: false,
    filePath,
    status: 'rejected',
    id: indexResult.id,
    specFolder: indexResult.specFolder,
    title: indexResult.title,
    summary: rollbackSucceeded
      ? 'Atomic index rejected after file promotion rollback'
      : 'Atomic index rejected but original file rollback failed',
    message: indexResult.message ?? indexResult.rejectionReason ?? 'Memory save rejected',
    embeddingStatus: indexResult.embeddingStatus,
    hints: [
      rollbackSucceeded
        ? 'Original file content was restored because the save was rejected after promotion'
        : 'Original file rollback failed after rejection; manual recovery may be required',
    ],
    ...(rollbackSucceeded ? {} : { error: 'Original file rollback failed after rejected save' }),
    ...(rollbackSucceeded || !errorMetadata ? {} : { errorMetadata }),
  };
}

function buildSuccessResult(filePath: string, indexResult: IndexResult): AtomicSaveResult {
  const message = indexResult.message ?? (
    indexResult.status === 'duplicate'
      ? 'Memory skipped (duplicate content)'
      : `Memory ${indexResult.status} successfully`
  );

  const hints: string[] = [];
  if (indexResult.embeddingStatus === 'pending') {
    hints.push('Memory will be fully indexed when embedding provider becomes available');
  }
  if (indexResult.embeddingStatus === 'partial') {
    hints.push('Large file indexed via chunking: parent record + individual chunk records with embeddings');
  }

  const maybePostMutationHooks = (indexResult as Record<string, unknown>).postMutationHooks;

  return {
    success: true,
    filePath,
    status: indexResult.status,
    id: indexResult.id,
    specFolder: indexResult.specFolder,
    title: indexResult.title,
    summary: message,
    message,
    embeddingStatus: indexResult.embeddingStatus,
    ...(maybePostMutationHooks && typeof maybePostMutationHooks === 'object'
      ? { postMutationHooks: maybePostMutationHooks as AtomicSaveResult['postMutationHooks'] }
      : {}),
    ...(hints.length > 0 ? { hints } : {}),
  };
}

function buildRetryFailureResult(
  filePath: string,
  indexError: Error | null,
  rollbackSucceeded: boolean,
  errorMetadata: Record<string, string> | null,
): AtomicSaveResult {
  const rollbackError = errorMetadata?.rollbackError ? ` (rollback error: ${errorMetadata.rollbackError})` : '';
  const finalErrorMetadata = errorMetadata ?? {};

  return {
    success: false,
    filePath,
    status: 'error',
    summary: rollbackSucceeded
      ? 'Atomic index failed after retry and restored original file state'
      : 'Atomic index failed after retry and rollback was incomplete',
    message: indexError?.message ?? 'Indexing failed after retry',
    hints: [
      rollbackSucceeded
        ? 'Original file content was preserved or restored because indexing failed before completion'
        : 'Pending file cleanup failed after indexing error; manual cleanup may be required',
      'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
    ],
    error: `Indexing failed after retry${rollbackError}: ${indexError?.message ?? 'unknown'}`,
    ...(Object.keys(finalErrorMetadata).length > 0 ? { errorMetadata: finalErrorMetadata } : {}),
  };
}

export async function atomicIndexMemory<TPrepared = unknown>(
  params: AtomicSaveParams,
  options: AtomicSaveOptions = {},
  dependencies: AtomicIndexDependencies<TPrepared>,
): Promise<AtomicSaveResult> {
  const { file_path, content } = params;
  const { force = false } = options;

  const maxIndexAttempts = dependencies.maxIndexAttempts ?? 2;

  let indexResult: IndexResult | null = null;
  let indexError: Error | null = null;
  let restoredOriginalAfterFailure = false;
  let anyPromotionAttempted = false;
  let errorMetadata: Record<string, string> | null = null;
  let successfulLockedContext: AtomicIndexLockedContext<TPrepared> | null = null;
  let lastEffectiveFilePath = file_path;
  let lastPendingPath = (dependencies.getPendingPath ?? defaultPendingPath)(file_path);

  const mergeErrorMetadata = (entry: Record<string, string> | null): void => {
    if (!entry) {
      return;
    }
    errorMetadata = {
      ...(errorMetadata ?? {}),
      ...entry,
    };
  };

  for (let attempt = 1; attempt <= maxIndexAttempts; attempt += 1) {
    let promotedToFinalPath = false;
    let handledFailureWhileLocked = false;
    let rollbackSucceededAfterRejectedSave = false;

    try {
      const prepared = await dependencies.prepare(params, { attempt, force });
      if (prepared.status !== 'ready') {
        return prepared.result;
      }

      const effectiveFilePath = prepared.persistedFilePath ?? file_path;
      const persistedContent = prepared.persistedContent ?? content;
      const pendingPath = (dependencies.getPendingPath ?? defaultPendingPath)(effectiveFilePath);
      const originalState = (dependencies.captureOriginalState ?? captureOriginalState)(effectiveFilePath);
      lastEffectiveFilePath = effectiveFilePath;
      lastPendingPath = pendingPath;
      const lockedContext: AtomicIndexLockedContext<TPrepared> = {
        attempt,
        force,
        params,
        ready: prepared,
        specFolderLockAlreadyHeld: true,
      };

      const runWithLock = dependencies.withSpecFolderLock ?? withSpecFolderLock;

      indexResult = await runWithLock(prepared.specFolder, async () => {
        try {
          (dependencies.writePendingAndPromote ?? writePendingAndPromote)(pendingPath, effectiveFilePath, persistedContent);
          promotedToFinalPath = true;
          anyPromotionAttempted = true;

          const lockedIndexResult = await dependencies.indexPrepared(lockedContext);

          if (lockedIndexResult.status === 'rejected') {
            handledFailureWhileLocked = true;
            const rollbackResult = (dependencies.restoreOriginalState ?? restoreOriginalState)(effectiveFilePath, originalState);
            rollbackSucceededAfterRejectedSave = rollbackResult.restored;
            if (!rollbackResult.restored && rollbackResult.error) {
              mergeErrorMetadata({ rollbackError: rollbackResult.error });
            }
          }

          return lockedIndexResult;
        } catch (lockedError: unknown) {
          handledFailureWhileLocked = true;
          const pendingCleanupResult = (dependencies.cleanupPendingFile ?? cleanupPendingFile)(pendingPath);
          if (!pendingCleanupResult.cleaned && pendingCleanupResult.error) {
            mergeErrorMetadata({ pendingCleanupError: pendingCleanupResult.error });
          }

          if (promotedToFinalPath) {
            const rollbackResult = (dependencies.restoreOriginalState ?? restoreOriginalState)(effectiveFilePath, originalState);
            restoredOriginalAfterFailure = rollbackResult.restored;
            if (!rollbackResult.restored && rollbackResult.error) {
              mergeErrorMetadata({ rollbackError: rollbackResult.error });
            }
            if (!restoredOriginalAfterFailure) {
              const message = toErrorMessage(lockedError);
              throw new Error(`Original file rollback failed after promote-before-index path: ${message}`);
            }
          }

          throw lockedError;
        }
      });

      if (indexResult.status === 'error') {
        throw new Error(indexResult.message ?? indexResult.error ?? 'atomicIndexMemory indexPrepared returned status=error');
      }

      if (indexResult.status === 'rejected') {
        return buildRejectedResult(effectiveFilePath, indexResult, rollbackSucceededAfterRejectedSave, errorMetadata);
      }

      successfulLockedContext = lockedContext;
      indexError = null;
      break;
    } catch (error: unknown) {
      if (!handledFailureWhileLocked) {
        const pendingCleanupResult = (dependencies.cleanupPendingFile ?? cleanupPendingFile)(lastPendingPath);
        if (!pendingCleanupResult.cleaned && pendingCleanupResult.error) {
          mergeErrorMetadata({ pendingCleanupError: pendingCleanupResult.error });
        }
      }
      indexError = error instanceof Error ? error : new Error(toErrorMessage(error));
      if (attempt === maxIndexAttempts) {
        break;
      }
    }
  }

  if (!indexResult || indexError) {
    return buildRetryFailureResult(
      lastEffectiveFilePath,
      indexError,
      anyPromotionAttempted ? restoredOriginalAfterFailure : true,
      errorMetadata,
    );
  }

  if (dependencies.mapSuccessResult && successfulLockedContext) {
    return await dependencies.mapSuccessResult(indexResult, successfulLockedContext);
  }

  return buildSuccessResult(successfulLockedContext?.ready.persistedFilePath ?? file_path, indexResult);
}

const atomic_index_memory = atomicIndexMemory;

export { atomic_index_memory };
