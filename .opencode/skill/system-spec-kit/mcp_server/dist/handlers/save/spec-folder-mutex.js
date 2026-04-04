// ───────────────────────────────────────────────────────────────
// MODULE: Spec Folder Mutex
// ───────────────────────────────────────────────────────────────
// Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU).
// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Atomic-save parity and partial-indexing hints
/** Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU) */
const SPEC_FOLDER_LOCKS = new Map();
async function withSpecFolderLock(specFolder, fn) {
    const normalizedFolder = specFolder || '__global__';
    const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
        .catch((error) => {
        console.error('[memory-save] prior queued save failed:', error);
    })
        .then(() => fn());
    SPEC_FOLDER_LOCKS.set(normalizedFolder, chain);
    try {
        return await chain;
    }
    finally {
        if (SPEC_FOLDER_LOCKS.get(normalizedFolder) === chain) {
            SPEC_FOLDER_LOCKS.delete(normalizedFolder);
        }
    }
}
export { SPEC_FOLDER_LOCKS, withSpecFolderLock };
//# sourceMappingURL=spec-folder-mutex.js.map