## Audit QA7-C11: config.ts + file-writer.ts — Copilot Cross-Validation
### P0 Blockers: [1] — [file-writer.ts:61-74,95-119 findings]
- [file-writer.ts:61-74,95-119] `writeFilesAtomically()` is not actually batch-atomic for later validation failures. Placeholder checks, substance checks, duplicate detection, anchor validation, and path validation all run before the per-file `try/catch`, so if file A is already renamed into place and file B then fails one of those guards, the function exits immediately without entering the rollback path. The advertised "rollback on failure" only applies to failures after `tempPath` creation, which means a mixed-validity batch can leave partial writes behind.

### P1 Required: [2] — [config.ts:79-139,209-211; file-writer.ts:75-93,99-118 findings]
- [config.ts:79-139,209-211] Required nested config values are not fully protected. The merge is shallow, so a user-supplied partial `learningWeights` object replaces the whole default object, and `validateConfig()` never restores missing `knowledge/context/uncertainty` members or validates their numeric ranges. That leaves `CONFIG.LEARNING_WEIGHTS` able to carry `undefined` values into downstream arithmetic, which can turn score calculations into `NaN` instead of preserving safe defaults.
- [file-writer.ts:75-93,99-118] Concurrent writers are not coordinated. Each invocation creates independent backups and temp files, then blindly renames into the same destination without any lock, `O_EXCL` guard, or compare-and-swap check. Two overlapping calls targeting the same file can therefore race into last-writer-wins behavior, and a failing caller can restore its stale backup over another caller's successful write during rollback.

### P2 Suggestions: [1] — [file-writer.ts:35-39,48-51,78-85 findings]
- [file-writer.ts:35-39,48-51,78-85] Several pre-write filesystem errors are downgraded too aggressively. `checkForDuplicateContent()` silently ignores unreadable sibling files, and the backup probe treats any `access()` / `copyFile()` failure as "file does not exist." Narrow those catches to expected `ENOENT` cases and propagate unexpected I/O errors so duplicate detection and rollback guarantees are not weakened by permissions or transient filesystem faults.

### Score: [71]
