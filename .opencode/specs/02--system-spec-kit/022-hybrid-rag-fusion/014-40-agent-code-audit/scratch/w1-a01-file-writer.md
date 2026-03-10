● Todo added: Audit file-writer.ts

● Read .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  └ 198 lines read

● Run skill advisor
  $ python3 .opencode/skill/scripts/skill_advisor.py "Audit
  .opencode/skill/system-spec-kit/scripts/core/file-writer.ts for atomic write correctness, TOCTOU
  fix validation, rollback completeness, backup race conditions, verifyResolvedWriteTarget after
  rename, error handling in writeFileAtomic, and temp file cleanup on failure." --threshold 0.8
  └ 51 lines...

● Test rename into symlinked parent
  $ node <<'NODE'
  const fs = require('fs');
  const fsp = require('fs/promises');
  const path = require('path');
  const os = require('os');...
  └ 26 lines...

● Compare backup and temp file modes
  $ node <<'NODE'
  const fs = require('fs');
  const fsp = require('fs/promises');
  const os = require('os');
  const path = require('path');...
  └ 20 lines...

● Check copyFile destination mode
  $ node <<'NODE'
  const fs = require('fs');
  const fsp = require('fs/promises');
  const os = require('os');
  const path = require('path');...
  └ 17 lines...

● Todo completed: audit-file-writer

### FINDING-01: Post-rename realpath check still allows writes outside the target tree
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:15-25,95-116,143-163`
- **Severity:** CRITICAL
- **Category:** SECURITY
- **Current Behavior:** The code validates `filename` with `path.resolve(...)` before writing, but all actual I/O still uses unresolved paths, and `verifyResolvedWriteTarget(...)` runs only after `rename(tempPath, filePath)` has already committed the write. If any parent component inside `contextDir` is a symlink, the write/backup/rollback can occur outside the intended directory before detection.
- **Expected Behavior:** The target directory chain should be pinned to a canonical location before any backup, temp creation, rename, rollback, or cleanup occurs, so no write ever lands outside `contextDir`.
- **Root Cause:** The code mixes string-based path checks (`path.resolve`) with path-based I/O on live filesystem paths, then re-resolves the path after the rename, which is itself another TOCTOU window.
- **Suggested Fix:** Resolve and pin the real context root up front, resolve/validate each parent directory with `realpath`/`lstat` before writing, build temp/backup/final paths from the canonical parent path, and reject symlinked parents; do not rely on a post-rename `realpath` check for containment.

### FINDING-02: Current-file rollback failures are silently dropped
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:148-166,181-188`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** If restoring the current file fails in the catch block, that failure is swallowed and the final exception reports only the original write error plus rollback errors for previously written files.
- **Expected Behavior:** If rollback of the current file fails, that failure must be surfaced to the caller because the destination may now be corrupted or left in an unknown state.
- **Root Cause:** The catch blocks around current-file rollback (`copyFile`/`unlink`) ignore errors, while `rollbackErrors` only tracks failures from the `written` array loop.
- **Suggested Fix:** Capture current-file rollback failures into the same `rollbackErrors` collection and include them in the thrown error, ideally preserving the original write error as `cause`.

### FINDING-03: Rollback uses `copyFile` and rewrites untouched files
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:150-163`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** On failure, the code restores the current file with `fs.copyFile(backupPath, filePath)`, including the branch where `renamedIntoPlace` is `false` and the original file was never replaced. `copyFile` is non-atomic and can also change destination mode/metadata; on this platform it will widen a `0600` file to the backup's `0644`.
- **Expected Behavior:** If the rename never happened, the original file should be left alone; if the rename did happen, rollback should be atomic and preserve permissions as much as possible.
- **Root Cause:** The rollback path treats "backup exists" as equivalent to "destination must be rewritten" and uses a byte copy instead of an atomic rename.
- **Suggested Fix:** When `renamedIntoPlace` is `false`, skip destination restore entirely; when it is `true`, restore with an atomic `rename(backupPath, filePath)` (or equivalent) and preserve mode/metadata explicitly if needed.

### FINDING-04: No concurrency control means backup/rollback can lose other writers' data
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:123-145,150-172`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The function snapshots the old file once, then blindly renames the temp file into place. If another writer updates the file after the backup is taken but before this rename/rollback path runs, that newer content is overwritten, and rollback restores stale data from the old backup.
- **Expected Behavior:** Concurrent writes should either be serialized or detected so the function can fail instead of overwriting newer data.
- **Root Cause:** There is no lockfile, no inode/mtime/version check between backup and commit, and no compare-and-swap style verification before rollback.
- **Suggested Fix:** Add per-file locking or capture file identity (`lstat`/inode/mtime) before backup and verify it has not changed before rename/restore; abort on mismatch.

### FINDING-05: “Atomic” writes are not crash-durable because directory entries are never synced
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:27-44,129-145,191-195`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** The temp file itself is `fsync`'d, but backup creation, `rename(...)`, rollback renames, and backup deletion are not followed by a parent-directory sync. After a crash or power loss, the function can report success even though the rename or backup directory entry was never durably recorded.
- **Expected Behavior:** Once the function reports success or completed rollback, the filesystem metadata changes should also be durable.
- **Root Cause:** The code assumes file `fsync` alone makes the overall atomic write durable, but directory entry updates require syncing the containing directory.
- **Suggested Fix:** Sync the backup file after writing it and `fsync` the parent directory after backup creation, final rename, rollback rename, and backup cleanup.

### FINDING-06: Backup creation can widen file permissions
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:38-40,129-133,152-153,162`
- **Severity:** MEDIUM
- **Category:** SECURITY
- **Current Behavior:** Backups are created with default `writeFile` permissions (typically `0666 & ~umask`, observed as `0644` here), while temp files are created as `0600`. Because rollback uses `copyFile`, a restricted destination can be restored with broader backup permissions.
- **Expected Behavior:** Backup/restore logic should not make the file more readable than the original or the temp file path.
- **Root Cause:** `fs.writeFile(..., { flag: 'wx' })` does not specify a restrictive mode, and `copyFile` restore reuses the backup's metadata behavior.
- **Suggested Fix:** Create backups with an explicit secure mode (or clone the original file mode) and avoid `copyFile`-based restores.

### FINDING-07: Duplicate detection hides real I/O errors and is not safe under concurrency
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:65-88,100-105`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Any `readdir` or `readFile` error is ignored, so permission errors, transient I/O failures, or corrupted entries silently disable duplicate protection. Even when the scan succeeds, another process can create the same content after the scan and before the rename.
- **Expected Behavior:** Only explicitly tolerated cases like `ENOENT` should be ignored, and duplicate/idempotency logic should not imply stronger guarantees than it actually provides.
- **Root Cause:** Broad catch blocks swallow all failures, and the duplicate check is a pre-write scan with no commit-time verification.
- **Suggested Fix:** Only suppress expected errors, surface the rest, and if cross-process idempotency matters, add locking or an atomic compare step at commit time.

### FINDING-08: Multiline HTML comments bypass the “substance” validator
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:46-60`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** The validator removes `<!--.*?-->`, but `.` does not match newlines, so multiline HTML comments remain in the string and count toward the 200-character minimum.
- **Expected Behavior:** Hidden/template-only multiline comments should not count as substantive content.
- **Root Cause:** The comment-stripping regex is single-line only.
- **Suggested Fix:** Replace it with `/<!--[\\s\\S]*?-->/g`.

### FINDING-09: Temp/backup cleanup failures are completely invisible
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:149,181-195`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Failed `unlink` calls for temp and backup files are ignored with no warning or error detail, so stale `.tmp.*` or `.bak.*` files can accumulate silently.
- **Expected Behavior:** Cleanup failures should be observable so operators know the directory may contain leftover recovery artifacts.
- **Root Cause:** Best-effort cleanup discards all error information.
- **Suggested Fix:** Collect cleanup failures and append them to the thrown error or emit explicit warnings.

### SUMMARY - Total: 9, Critical: 1, High: 3, Medium: 3, Low: 2


Total usage est:        1 Premium request
API time spent:         4m 22s
Total session time:     4m 34s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 216.7k in, 16.0k out, 171.8k cached (Est. 1 Premium request)
