/** Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU) */
declare const SPEC_FOLDER_LOCKS: Map<string, Promise<unknown>>;
declare function withSpecFolderLock<T>(specFolder: string, fn: () => Promise<T>): Promise<T>;
export { SPEC_FOLDER_LOCKS, withSpecFolderLock };
//# sourceMappingURL=spec-folder-mutex.d.ts.map