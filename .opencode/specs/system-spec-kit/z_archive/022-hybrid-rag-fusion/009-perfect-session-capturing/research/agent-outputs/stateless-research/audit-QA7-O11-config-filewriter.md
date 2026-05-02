# Audit QA7-O11: core/config.ts + core/file-writer.ts

**Auditor:** @review (Claude Opus 4.6)
**Date:** 2026-03-09
**Files:**
- `.opencode/skill/system-spec-kit/scripts/core/config.ts` (311 LOC)
- `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts` (129 LOC)

**Spec:** 012 Perfect Session Capturing / 013 Improve Stateless Mode

---

## Score Breakdown

| Dimension        | Points | Max | Notes                                         |
| ---------------- | ------ | --- | --------------------------------------------- |
| Correctness      | 24     | 30  | learningWeights bypass; brace-depth fragility  |
| Security         | 22     | 25  | Good path safety; minor TOCTOU in file-writer  |
| Patterns         | 18     | 20  | Solid; CONFIG mutability is a design concern   |
| Maintainability  | 13     | 15  | Well-structured; minor doc gaps                |
| Performance      | 9      | 10  | Duplicate check reads all files in dir         |

**Total: 86/100 — ACCEPTABLE (PASS with notes)**

---

## Adversarial Self-Check (P0/P1 Findings)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final |
|---|---------|----------------|-------------------|-----------------|-------|
| 1 | learningWeights not validated | P1 | Defaults are sane; config.jsonc doesn't even set them | Confirmed — malformed user config silently propagates NaN into quality scores | P1 |
| 2 | Brace-depth parser ignores braces inside JSON strings | P1 | stripJsoncComments handles strings correctly, but brace-depth scan runs on *stripped* output which still has string values containing `{`/`}` | Confirmed — a JSON string value like `"pattern": "a{2}"` would mis-count depth | P1 |
| 3 | CONFIG object is mutable at module scope | P1 | Intentional — DATA_FILE/SPEC_FOLDER_ARG are set after load; tests mutate it too | Downgraded — design choice, not a bug, but a latent concurrency risk | P2 |
| 4 | TOCTOU between access() and writeFile() in file-writer | P1 | Atomic rename provides the actual safety; the backup TOCTOU window is very narrow and the tool runs single-threaded in practice | Downgraded — theoretical only in this single-process context | P2 |
| 5 | No symlink check on temp/backup paths in file-writer | P1 | contextDir is already sanitized upstream via sanitizePath with realpathSync; symlink at filename level is blocked by filename validation | Dropped — defense-in-depth already covers this path | -- |

---

## P0 Findings (Blockers)

None.

---

## P1 Findings (Required Fixes)

### P1-1: `learningWeights` sub-object is never validated

**File:** `config.ts:162-167, 210, 252`

**Evidence:**
`validateConfig()` (lines 79-140) validates all top-level numeric fields but skips the nested `learningWeights` object entirely. The shallow merge on line 210 (`{ ...defaultConfig, ...userConfig }`) means a user-supplied `learningWeights` completely replaces the default, even if it contains non-numeric or out-of-range values.

**Impact:** If `config.jsonc` is edited with `"learningWeights": { "knowledge": "high" }`, the downstream consumer at `collect-session-data.ts:202-204` computes:
```
dk * "high" → NaN
```
This silently corrupts quality scores used to gate memory saves.

**Fix:** Add validation for `learningWeights` inside `validateConfig()`:
- Each weight must be `typeof number && isFinite && >= 0 && <= 1`
- The three weights should sum to approximately 1.0 (tolerance 0.01)
- Deep-merge with defaults rather than shallow replace

---

### P1-2: Brace-depth JSON extraction ignores braces inside string values

**File:** `config.ts:179-201`

**Evidence:** After `stripJsoncComments()` strips comments, the brace-depth scanner (lines 184-201) iterates character-by-character and increments/decrements `braceDepth` for every `{` and `}`. It does **not** track whether the scanner is inside a JSON string literal.

**Current config.jsonc is safe** (no string values contain braces), but the parser is fragile. If any future config value contains a brace character (e.g., `"pattern": "a{2,5}"`), the depth counter will desynchronize, potentially:
- Truncating the JSON block early (depth hits 0 too soon)
- Including text beyond the JSON block (depth never reaches 0)

**Impact:** Silent config corruption — parsed JSON missing fields or containing garbage, caught only by JSON.parse throwing (which falls back to defaults with a warning).

**Fix:** Either:
- A) Track `inString` state during brace scanning (mirror the approach in `stripJsoncComments`)
- B) Replace the custom parser with `JSON.parse(stripped)` directly — if `stripJsoncComments` has already produced valid JSON, the brace-depth extraction is redundant
- C) Use a battle-tested JSONC library (e.g., `jsonc-parser` from VS Code)

Option B is simplest: after stripping comments, just `JSON.parse(stripped.trim())`. The brace-depth logic was likely added to handle preamble/postscript text around the JSON object, but `config.jsonc` has none.

---

## P2 Findings (Suggestions)

### P2-1: CONFIG is a mutable module-scope object

**File:** `config.ts:227-253`

**Evidence:** `CONFIG` is declared as `const` (prevents reassignment) but its properties are freely mutable. Production code (`generate-context.ts:260-301`) and tests (`task-enrichment.vitest.ts:597-598`) mutate `CONFIG.DATA_FILE` and `CONFIG.SPEC_FOLDER_ARG` at runtime.

**Concern:** If the module were ever loaded in a concurrent context (e.g., parallel test runners sharing the import cache), mutation of shared state would cause cross-contamination. Currently safe because Node runs single-threaded and tests use `--pool=forks`.

**Suggestion:** Consider `Object.freeze()` on CONFIG after initial construction, and use a setter function for the two runtime-mutable fields that validates inputs. This makes the mutation surface explicit.

---

### P2-2: TOCTOU window in file-writer backup logic

**File:** `file-writer.ts:78-85`

**Evidence:** The backup sequence is:
1. `fs.access(filePath)` — check existence (line 79)
2. `fs.copyFile(filePath, backupPath)` — create backup (line 83)

Between steps 1 and 2, another process could delete or modify the file. In practice this tool runs single-process and the window is microseconds, so this is theoretical.

**Suggestion:** Replace `access()` + `copyFile()` with a single `copyFile()` call wrapped in try/catch. If `ENOENT`, set `existedBefore = false`. This eliminates the TOCTOU window and simplifies the code.

---

### P2-3: Duplicate check reads all `.md` files in directory

**File:** `file-writer.ts:30-53`

**Evidence:** `checkForDuplicateContent()` reads every `.md` file in `contextDir` and hashes it. For directories with many memory files (50+), this becomes O(n) disk reads per file in the batch.

**Suggestion:** Consider maintaining a hash manifest (`.content-hashes.json`) in the memory directory, updated on each write. This converts O(n) reads to O(1) manifest lookup. Alternatively, skip duplicate checking when the directory has > N files and rely on the unique filename generator.

---

### P2-4: `void _error.message` is a no-op lint suppression

**File:** `config.ts:287`

**Evidence:** In `getAllExistingSpecsDirs()` (line 287):
```typescript
void _error.message;
```
This exists solely to suppress the "unused variable" lint warning. The pattern works but is unconventional and confusing to readers.

**Suggestion:** Use `_` prefix alone (already done with `_error`) which most TypeScript configs recognize as intentionally unused, or restructure the catch to not bind the error at all:
```typescript
} catch {
  // Keep original dir if realpath resolution fails
}
```

---

### P2-5: Missing integer enforcement on validated config values

**File:** `config.ts:83-106`

**Evidence:** The validation at line 99 checks `typeof number`, `isFinite`, and `> 0`, but does not check `Number.isInteger()`. Fields like `maxConversationMessages`, `maxFilesInMemory`, etc. semantically require integers but would accept `3.7` without warning.

**Suggestion:** Add `Number.isInteger(value)` to the positive-field validation, or use `Math.floor()` coercion with a warning.

---

### P2-6: No upper-bound validation on numeric config values

**File:** `config.ts:83-106`

**Evidence:** Fields like `maxConversationMessages` and `maxToolOutputLines` accept arbitrarily large values (e.g., `999999999`). While unlikely to cause crashes, extremely large values could cause excessive memory usage or processing time.

**Suggestion:** Add sensible upper bounds (e.g., `maxConversationMessages <= 10000`) and fall back to defaults if exceeded.

---

## Positive Highlights

1. **Atomic write pattern is correct** (`file-writer.ts:86-93`): Write to temp file with random suffix, verify size, then `fs.rename()`. Since `rename()` is atomic on POSIX when source and target are on the same filesystem, this prevents partial-write corruption.

2. **Batch rollback on failure** (`file-writer.ts:97-118`): If any file in the batch fails to write, all previously written files are rolled back (restored from backup or deleted). This is a well-implemented transactional write pattern.

3. **Path traversal prevention is thorough** (`file-writer.ts:68-74`): Double-check with both `path.isAbsolute()` / `..` detection AND `path.resolve().startsWith()` comparison. This defends against encoding tricks that bypass simple string checks.

4. **Upstream path sanitization is robust** (`path-utils.ts:19-89`): The `sanitizePath()` function used by `setupContextDirectory()` performs `realpathSync()` canonicalization, null-byte checks (CWE-22), and allowlist-based directory containment.

5. **Config validation with graceful fallback** (`config.ts:79-140`): Invalid config values produce structured warnings and fall back to safe defaults rather than crashing. The timezone range validation (-12 to +14) is correct per UTC offset standards.

6. **Content substance check** (`file-writer.ts:14-28`): Prevents writing empty/template-only files by stripping structural elements and requiring minimum content length.

---

## Files Reviewed

| File | Changes | P0 | P1 | P2 |
|------|---------|----|----|-----|
| `core/config.ts` (311 LOC) | Config loading, validation, export | 0 | 2 | 3 |
| `core/file-writer.ts` (129 LOC) | Atomic writes, rollback, path safety | 0 | 0 | 3 |
| `utils/path-utils.ts` (read for context) | Upstream path sanitization | -- | -- | -- |
| `utils/validation-utils.ts` (read for context) | Placeholder/anchor validation | -- | -- | -- |
| `shared/utils/jsonc-strip.ts` (read for context) | JSONC comment stripping | -- | -- | -- |
| `spec-folder/directory-setup.ts` (read for context) | contextDir construction | -- | -- | -- |

---

## Recommendation

**PASS with required fixes.** The two P1 findings (`learningWeights` validation gap and fragile brace-depth parser) should be addressed before the next release. Neither causes data loss today (the current `config.jsonc` does not trigger either issue), but both are latent correctness risks that would produce silent corruption if config content evolves.

Priority order:
1. **P1-2** (brace-depth parser) — simplest fix: replace with direct `JSON.parse(stripped.trim())`
2. **P1-1** (learningWeights validation) — add nested object validation to `validateConfig()`
