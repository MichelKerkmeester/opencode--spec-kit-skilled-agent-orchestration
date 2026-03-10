● skill(sk-code--review)

● Todo added: Audit memory filename flow

● Read .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  └ 198 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts
  └ 185 lines read

● Grep "generateContentSlug|ensureUniqueMemoryFilename|writeFilesAtomically|contextDir|memoryDir|slu
g|filename|filePath|target" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 19 lines found

● Grep "export async function|writeFilesAtomically|generateContentSlug|ensureUniqueMemoryFilename|co
ntentSlug|contextDir|memoryDir" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts)
  └ 11 lines found

● Grep "export function|ensureUniqueMemoryFilename|generateContentSlug|pickBestContentName|normalize
MemoryNameCandidate|truncateSlugAtWordBoundary" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts)
  └ 14 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 650-730
  └ 81 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 930-990
  └ 61 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1180-1295
  └ 116 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1296-1335
  └ 38 lines read

● Grep "function setupContextDirectory|const files: Record<string,
string>|files\[ctxFilename\]|metadata|ctxFilename|rawCtxFilename|writeFilesAtomically"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 22 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 40-130
  └ 90 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1040-1185
  └ 146 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts lines 1-220
  └ 107 lines read

● Grep "setupContextDirectory" in **/*.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 9 lines found

● Read .opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts lines 1-180
  └ 111 lines read

● Grep "path.resolve|realpath|contextDir|memory" (/Users/michelkerkmeester/MEGA/Development/Opencode
 Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts)
  └ 7 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 200-380
  └ 181 lines read

● Grep "function pickPreferredMemoryTask|function shouldEnrichTaskFromSpecTitle|function
extractSpecTitle|buildMemoryTitle|buildMemoryDashboardTitle"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 380-470
  └ 91 lines read

● Grep "pickPreferredMemoryTask|withWorkflowRunLock\(|runWorkflow\("
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Test mkdir on symlink path
  $ python - <<'PY'
  import os, tempfile, pathlib, shutil
  base = tempfile.mkdtemp(prefix='mkdir-symlink-test-')
  try:
      real = os.path.join(base, 'real')...
  └ 13 lines...

● Retest mkdir symlink path
  $ python3 - <<'PY'
  import os, tempfile, shutil
  base = tempfile.mkdtemp(prefix='mkdir-symlink-test-')
  try:
      real = os.path.join(base, 'real')...
  └ 13 lines...

● Test Node mkdir on symlink
  $ node - <<'NODE'
  const fs = require('fs/promises');
  const path = require('path');
  const os = require('os');
  (async () => {...
  └ 19 lines...

● Grep "ensureUniqueMemoryFilename|writeFilesAtomically|generateContentSlug|backupExistingFileAtomic
ally|verifyResolvedWriteTarget" in **/*.{ts,tsx,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 30 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts lines 300-360
  └ 61 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts lines 70-110
  └ 41 lines read

● Grep "uniqueMemoryFilename|memorySequence|duplicate|backup|rollback|atomic" in **/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 30 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js lines 1548-1595
  └ 48 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 548-560
  └ 13 lines read

● Verify rename overwrites existing file
  $ node - <<'NODE'
  const fs = require('fs/promises');
  const path = require('path');
  const os = require('os');
  (async () => {...
  └ 12 lines...

● Todo completed: audit-data-flow

### FINDING-01: Filename uniqueness is only advisory and can be lost under concurrent writers
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:553-554,969-971; .opencode/skill/system-spec-kit/scripts/core/file-writer.ts:123-145`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The slug wiring itself is correct: `preferredMemoryTask -> generateContentSlug -> rawCtxFilename -> ensureUniqueMemoryFilename -> ctxFilename`. But uniqueness is decided from a pre-write directory snapshot, and `writeFilesAtomically()` later backs up and renames onto whatever now exists at that path. Two concurrent processes can therefore choose the same filename, and the later one will overwrite the earlier file instead of getting a suffixed filename.
- **Expected Behavior:** Filename uniqueness should be enforced at write time so concurrent saves always end up with distinct filenames and never replace a just-created memory file.
- **Root Cause:** `ensureUniqueMemoryFilename()` uses `readdirSync()` as a detached preflight check, while the actual writer treats a destination collision as an overwrite case. `withWorkflowRunLock()` only serializes runs inside one process, not across separate CLI processes.
- **Suggested Fix:** Move uniqueness reservation into the writer: derive the base filename from the slug, then reserve the final candidate atomically with an interprocess-safe mechanism (`O_EXCL`/exclusive create or equivalent retry loop) before the rename.

### FINDING-02: The real write target is validated only after the rename already happened
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:95-116,143-145`
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** Pre-write containment uses `path.resolve()` on `contextDir` and `filePath`, but the canonical `realpath` check happens only after `fs.rename(tempPath, filePath)`. If `contextDir` or an intermediate component is symlinked, bytes can be committed outside the intended spec-folder memory directory before the code verifies the true destination.
- **Expected Behavior:** The canonical destination path should be resolved and validated before any write/rename occurs.
- **Root Cause:** The implementation does a lexical path-prefix check before writing, then performs the stronger symlink-aware check only after the side effect has already occurred.
- **Suggested Fix:** Resolve `contextDir` and each target parent with `realpath` before opening temp/final paths, reject symlinked parents that escape the allowed directory, and only then proceed with temp-file creation and rename.

### FINDING-03: The backup + atomic-write sequence is not crash-durable
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:27-44,129-145,191-195`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** The temp file is `sync()`ed before rename, which is good, but the backup creation and the final rename are never followed by an `fsync` on the containing directory. On a crash/power loss, the directory-entry update may be lost even though file contents were synced, and the success path may delete the `.bak` before the rename is durably committed.
- **Expected Behavior:** The operation should not be considered committed until the parent directory metadata is synced; backups should only be removed after that point.
- **Root Cause:** The sequence treats file-data sync as sufficient for atomic durability, but durable rename semantics also require syncing the directory entry.
- **Suggested Fix:** After creating the backup and after renaming the temp file into place, open the parent directory and `fsync` it; only then clean up the backup file.

### SUMMARY - Total: 3, Critical: 0, High: 2, Medium: 1, Low: 0


Total usage est:        1 Premium request
API time spent:         4m 57s
Total session time:     5m 13s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 1.1m in, 15.2k out, 1.0m cached (Est. 1 Premium request)
