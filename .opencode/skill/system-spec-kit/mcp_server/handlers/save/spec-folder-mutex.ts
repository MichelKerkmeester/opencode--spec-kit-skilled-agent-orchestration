// ───────────────────────────────────────────────────────────────
// MODULE: Spec Folder Mutex
// ───────────────────────────────────────────────────────────────
// Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU).

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Atomic-save parity and partial-indexing hints

/** Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU) */
const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();

async function withSpecFolderLock<T>(specFolder: string, fn: () => Promise<T>): Promise<T> {
  const normalizedFolder = specFolder || '__global__';
  const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
    .catch((error: unknown) => {
      console.error('[memory-save] prior queued save failed:', error);
    })
    .then(() => fn());
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
