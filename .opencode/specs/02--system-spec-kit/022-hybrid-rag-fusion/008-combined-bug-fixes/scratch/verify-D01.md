# Agent D01: Security Audit — Path Traversal & Input Validation

**Auditor:** D01 (Claude Opus 4.6, leaf agent)
**Date:** 2026-03-08
**Scope:** 4 files in `system-spec-kit/scripts/` — data-loader, collect-session-data, file-writer, git-context-extractor
**Focus:** CWE-22 path traversal, CWE-78 command injection, input validation, file I/O safety

---

## Summary

| Metric | Value |
|---|---|
| Files audited | 4 (+1 dependency: path-utils.ts) |
| Total findings | 8 |
| P0 (exploitable) | 0 |
| P1 (theoretical risk) | 2 |
| P2 (defense-in-depth) | 4 |
| P3 (informational) | 2 |
| Verdict | **PASS — no exploitable vulnerabilities found** |

The codebase demonstrates mature security awareness. Path traversal guards are present in all three files that handle file I/O. The `sanitizePath()` utility implements proper canonicalization via `fs.realpathSync()` with null-byte rejection. The `file-writer.ts` has a dual-layer filename check (absolute + `..` detection, then post-resolve boundary check). The `collect-session-data.ts` SPEC_FOLDER boundary guard is correctly implemented. The primary area of concern is `git-context-extractor.ts`, which passes `projectRoot` directly into `execSync` commands — while not currently exploitable due to the controlled origin of `CONFIG.PROJECT_ROOT`, this represents a theoretical command injection vector if the trust boundary changes.

---

## File-by-File Analysis

### 1. `scripts/loaders/data-loader.ts` (196 lines)

**Path handling:**
- Line 87-93: Constructs `dataFileAllowedBases` with `os.tmpdir()`, `/tmp`, `/private/tmp`, `process.cwd()`, and two subdirectories.
- Line 98: Delegates to `sanitizePath(dataFile, dataFileAllowedBases)` before any file read.
- Line 108: `fs.readFile` uses the validated path only.

**JSON parsing:**
- Line 109: `JSON.parse(dataContent)` — wrapped in the outer try/catch at line 117. The catch at line 124 specifically handles `SyntaxError`. PASS.

**Error handling:**
- Lines 119-138: Error paths log `dataFile` (the user-provided path) in console output and structured logs. See P3-01.

**Assessment:** Well-defended. The `sanitizePath` dependency (audited below) provides canonicalization and boundary checking.

### 2. `scripts/extractors/collect-session-data.ts` (840 lines)

**SPEC_FOLDER backfill (lines 617-655):**
- Line 621: `path.resolve(detectedFolder)` canonicalizes the detected folder.
- Lines 631-643: Iterates candidate specs directories, computes `path.relative()`, and rejects values that start with `../` or are absolute. This is a correct traversal guard.
- Lines 646-652: Fallback uses `lastIndexOf('/specs/')` to extract the relative portion, or `path.basename()` as final fallback. Both are safe — they only extract substrings, never construct traversal paths.

**SPEC_FOLDER boundary guard (lines 722-730):**
- Line 725: `path.resolve(activeSpecsDir, collectedData.SPEC_FOLDER)` — resolves user-supplied SPEC_FOLDER against the specs directory.
- Lines 726-728: Boundary check `candidate.startsWith(boundary + path.sep)` is the correct pattern. Also allows exact match (`candidate === boundary`). PASS.

**Object spread (line 816-817):**
- `...implementationGuide` and `...preflightPostflightData` and `...continueSessionData` — these spread objects with known, typed structures. No prototype pollution risk because the source objects are constructed within the module, not from raw user input. PASS.

**Assessment:** Sound. The SPEC_FOLDER guard at line 722-730 is correctly implemented.

### 3. `scripts/core/file-writer.ts` (129 lines)

**Filename validation (lines 67-74):**
- Line 68: `path.isAbsolute(filename) || filename.includes('..')` — rejects absolute paths and any path containing `..`. This is the first layer.
- Lines 72-73: `path.resolve(filePath).startsWith(path.resolve(contextDir) + path.sep)` — resolves both sides and checks containment. This is the second, canonical layer. Correct.

**Atomic write pattern (lines 86-92):**
- Line 87: Temp file uses `crypto.randomBytes(4).toString('hex')` suffix — unpredictable, avoids collision.
- Line 89: `fs.writeFile(tempPath, ...)` writes to temp.
- Line 92: `fs.rename(tempPath, filePath)` — atomic on POSIX.

**Rollback on failure (lines 97-110):**
- Properly iterates `written` array and restores backups or unlinks new files.

**`contextDir` validation:**
- The function does NOT validate that `contextDir` itself is within an expected boundary. It trusts the caller. See P2-01.

**Duplicate check (lines 30-53):**
- Line 43: `path.join(contextDir, existing)` — `existing` comes from `fs.readdir(contextDir)`, which returns actual directory entries. Not user-controlled. PASS.

**Assessment:** Strong dual-layer path check on filenames. The `contextDir` trust boundary is the only gap.

### 4. `scripts/extractors/git-context-extractor.ts` (188 lines)

**execSync usage (lines 51-58):**
- Line 52: `execSync(command, { cwd: projectRoot, ... })` — the `command` parameter is a string, not an array. The `projectRoot` value is used as `cwd`, not interpolated into the command string, so it does not enable command injection via `cwd`.

**Command construction (lines 109, 119-120, 124, 127, 131, 133):**
- Line 109: `` `git diff ${format} HEAD~${diffWindow}` `` — `format` is restricted to the union type `'--name-status' | '--stat'` (line 107), and `diffWindow` is `Math.min(revCount, MAX_DIFF_COMMITS)` which is always a number. PASS.
- Line 119: `'git rev-parse --is-inside-work-tree'` — static string. PASS.
- Line 120: `'git status --porcelain'` — static string. PASS.
- Line 124: `'git rev-list --count HEAD'` — static string. PASS.
- Line 133: `` `git log --format="%H%n%cI%n%s%n%b%n---" --since="24 hours ago" -${MAX_COMMITS}` `` — `MAX_COMMITS` is a module-level constant (20). PASS.

**No user input reaches command strings.** All interpolated values are either TypeScript-typed literals or numeric constants.

**File path normalization (lines 59-64):**
- Line 60: Strips quotes from raw git output.
- Line 62-63: Converts absolute paths to relative using `path.relative(projectRoot, ...)` and normalizes separators.
- These paths are used only in data structures, never in further file system operations within this module. PASS.

**Assessment:** Secure. Commands use only static strings or module constants. The `projectRoot` flows from `CONFIG.PROJECT_ROOT` which is derived from `path.resolve(SCRIPTS_DIR, '..', '..', '..', '..')` — a static computation, not user input.

### 5. Dependency: `scripts/utils/path-utils.ts` (108 lines)

**`sanitizePath` implementation:**
- Line 27: Null-byte check. PASS.
- Line 32: `path.resolve(inputPath)` — canonicalizes.
- Line 35: `fs.realpathSync(resolved)` — resolves symlinks. Falls back gracefully if path doesn't exist (lines 40-48).
- Lines 57-77: Iterates `allowedBases`, resolves each base canonically, computes `path.relative()`, and checks the result doesn't start with `..` and isn't absolute. This is the standard correct algorithm.

**Assessment:** Well-implemented CWE-22 mitigation. The symlink resolution via `realpathSync` is the gold standard approach.

---

## Security Findings

### P1 Findings (Theoretical Risk)

#### P1-01: `projectRoot` parameter in git-context-extractor has no boundary validation

**File:** `scripts/extractors/git-context-extractor.ts:117`
**Code:**
```typescript
export async function extractGitContext(projectRoot: string): Promise<GitContextExtraction> {
```

**Description:** The `projectRoot` parameter is accepted as an arbitrary string and used as `cwd` for all `execSync` calls (line 52). While the current call site passes `CONFIG.PROJECT_ROOT` (a statically derived path), the function's public API accepts any string. If a future caller passes user-controlled input, an attacker could point git operations at arbitrary directories on the filesystem, leaking file names and commit messages from other repositories.

**Exploitation scenario:** A hypothetical new caller does `extractGitContext(userInput)` where `userInput = '/etc'` or another sensitive directory. The function would execute `git status --porcelain` in that directory, and return file listings.

**Adversarial self-check:**
| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---|---|---|---|
| No boundary check on projectRoot | P0 | Currently only called from CONFIG.PROJECT_ROOT (config.ts:229, workflow.ts:445). TypeScript typing alone does not prevent misuse, but no user-facing entry point exists today. | Downgraded — theoretical, not currently exploitable | **P1** |

**Suggested fix:** Add a boundary assertion at function entry:
```typescript
const resolvedRoot = path.resolve(projectRoot);
if (!resolvedRoot.startsWith(path.resolve(CONFIG.PROJECT_ROOT))) {
  throw new Error('projectRoot outside expected boundary');
}
```

---

#### P1-02: `contextDir` parameter in file-writer.ts has no boundary validation

**File:** `scripts/core/file-writer.ts:56-57`
**Code:**
```typescript
export async function writeFilesAtomically(
  contextDir: string,
  files: Record<string, string>
): Promise<string[]> {
```

**Description:** The `contextDir` parameter is trusted without validation. While filenames are validated against `contextDir` (lines 68-74), if `contextDir` itself points to an attacker-controlled location, the dual-layer filename check becomes meaningless — it would correctly scope writes to the wrong directory. The function would create files, temp files, and backup files at the attacker-chosen location.

**Exploitation scenario:** A hypothetical caller passes `contextDir = '/tmp/attacker-dir'` — all file writes would land there. More critically, `contextDir = '/etc'` with `filename = 'crontab'` would pass the filename validation (it's relative, no `..`) and write to `/etc/crontab`.

**Adversarial self-check:**
| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---|---|---|---|
| No boundary on contextDir | P0 | The caller (workflow.ts) constructs contextDir from spec folder resolution which has its own boundary checks. No user-facing API accepts raw contextDir. | Downgraded — defense-in-depth gap, not currently exploitable | **P1** |

**Suggested fix:** Validate `contextDir` resolves within the project's specs/memory directory tree:
```typescript
const resolvedDir = path.resolve(contextDir);
const projectRoot = path.resolve(CONFIG.PROJECT_ROOT);
if (!resolvedDir.startsWith(projectRoot + path.sep) && resolvedDir !== projectRoot) {
  throw new Error(`contextDir outside project boundary: ${contextDir}`);
}
```

---

### P2 Findings (Defense-in-Depth)

#### P2-01: `dataFileAllowedBases` includes `process.cwd()` which may be broad

**File:** `scripts/loaders/data-loader.ts:91`
**Code:** `process.cwd(),`

**Description:** Including `process.cwd()` in the allowed bases means any file under the current working directory can be read. If the script is invoked from `/` or a high-level directory, this allowlist becomes effectively unrestricted. The risk is low because `sanitizePath` still canonicalizes and checks containment, but the blast radius depends on where the process runs.

**Suggested fix:** Consider restricting to `CONFIG.PROJECT_ROOT` instead of `process.cwd()`.

---

#### P2-02: `sanitizePath` fallback when `realpathSync` fails skips symlink resolution

**File:** `scripts/utils/path-utils.ts:46-48`
**Code:**
```typescript
// Fall back to the unresolved path when the parent cannot be canonicalized.
canonicalResolved = resolved;
```

**Description:** When both the path and its parent fail `realpathSync`, the function falls back to the `path.resolve()` result without symlink resolution. This means a crafted symlink chain where neither the target nor its parent exist yet could bypass the canonical check. However, the file wouldn't exist to be read in that scenario, making exploitation impractical.

**Suggested fix:** Document the fallback behavior. Consider logging at `warn` level when falling back.

---

#### P2-03: JSON.parse in data-loader lacks size limit before parsing

**File:** `scripts/loaders/data-loader.ts:108-109`
**Code:**
```typescript
const dataContent: string = await fs.readFile(validatedDataFilePath, 'utf-8');
const rawData: RawInputData = JSON.parse(dataContent) as RawInputData;
```

**Description:** No file size check before reading and parsing. A very large JSON file (e.g., multi-GB) could cause memory exhaustion. This is a denial-of-service vector, not a data integrity issue.

**Suggested fix:** Add a size check before read:
```typescript
const stats = await fs.stat(validatedDataFilePath);
if (stats.size > 50 * 1024 * 1024) { // 50MB limit
  throw new Error(`Data file too large: ${stats.size} bytes`);
}
```

---

#### P2-04: Backup files in file-writer use predictable directory location

**File:** `scripts/core/file-writer.ts:82`
**Code:**
```typescript
backupPath = `${filePath}.bak.${backupSuffix}`;
```

**Description:** Backup files are created alongside the target file with a `.bak.` extension and random suffix. While the suffix is cryptographically random (from `crypto.randomBytes`), the backup files are cleaned up only on success (line 122-126). If the process crashes between backup creation and cleanup, `.bak.*` files accumulate. This is not a security vulnerability but could leak previous file contents if the directory is readable by other users.

**Suggested fix:** Ensure backup files have restrictive permissions, or create them in a temp directory.

---

### P3 Findings (Informational)

#### P3-01: Error messages may leak file paths to console

**File:** `scripts/loaders/data-loader.ts:123, 130, 137`
**Code:**
```typescript
console.log(`   Warning  Data file not found: ${dataFile}`);
console.log(`   Warning  Invalid JSON in data file ${dataFile}: ${error.message}`);
```

**Description:** The user-supplied `dataFile` path is logged to console in error messages. In a local CLI tool this is expected behavior, but if console output were ever exposed to untrusted parties, it would reveal filesystem structure.

**Suggested fix:** No action needed for a CLI tool. If the tool becomes a service, sanitize path display.

---

#### P3-02: git-context-extractor silently swallows all errors

**File:** `scripts/extractors/git-context-extractor.ts:184-186`
**Code:**
```typescript
} catch {
  return emptyResult();
}
```

**Description:** The top-level catch in `extractGitContext` swallows all exceptions and returns an empty result. While this is intentional (git context is optional enrichment), it means security-relevant errors (e.g., `execSync` command injection attempts that throw) would be silently hidden. For debugging and security monitoring, logging the error type would be valuable.

**Suggested fix:** Add structured logging of the caught error for observability.

---

## Security Checklist Verification

| Check | Result | Evidence |
|---|---|---|
| No path traversal via `../` in file path construction | PASS | `file-writer.ts:68` rejects `..`; `collect-session-data.ts:638` rejects `../` prefix; `sanitizePath` uses `path.relative()` check |
| All paths canonicalized before use | PASS | `sanitizePath` uses `fs.realpathSync` (path-utils.ts:35); `file-writer.ts:72` uses `path.resolve()`; `collect-session-data.ts:621` uses `path.resolve()` |
| No user input directly in shell commands | PASS | `git-context-extractor.ts` interpolates only typed literals and numeric constants into commands; `projectRoot` used only as `cwd` option |
| File writes scoped to expected output directory | PASS (with P1-02 caveat) | `file-writer.ts:72-73` enforces containment within `contextDir`; `contextDir` itself lacks boundary check but callers currently pass validated paths |
| No symlink following that could escape intended directory | PASS | `sanitizePath` resolves symlinks via `fs.realpathSync` (path-utils.ts:35); fallback documented as P2-02 |
| readFileSync/writeFileSync paths validated | PASS | `data-loader.ts:98` validates via `sanitizePath`; `file-writer.ts:68-74` validates filenames; `git-context-extractor.ts` does no file I/O |
| JSON.parse wrapped in try/catch everywhere | PASS | `data-loader.ts:109` covered by outer try/catch (line 117) with specific SyntaxError handling (line 124) |
| No eval() or Function() constructor usage | PASS | Not found in any audited file |
| No prototype pollution in object merge operations | PASS | Spreads in `collect-session-data.ts` use module-constructed objects, not raw user input |
| Error messages don't leak sensitive paths | CONDITIONAL | CLI context makes path logging acceptable (P3-01); would need remediation for service deployment |

---

## Verdict

**PASS — No exploitable (P0) vulnerabilities found.**

The four audited files demonstrate consistently applied security practices:

1. **Path traversal:** Multi-layer defense via `sanitizePath()` (canonicalization + allowlist), filename rejection in `file-writer.ts`, and boundary guards in `collect-session-data.ts`.
2. **Command injection:** All `execSync` commands in `git-context-extractor.ts` use static strings or module constants. `projectRoot` is used only as `cwd`, never interpolated into command strings.
3. **Input validation:** JSON parsing is wrapped in try/catch. File paths go through `sanitizePath()` before any I/O.
4. **Atomic writes:** `file-writer.ts` implements proper temp-file-then-rename with rollback.

The two P1 findings (missing boundary validation on `projectRoot` and `contextDir` function parameters) are theoretical risks that depend on future callers violating the current trust assumptions. They represent defense-in-depth improvements, not currently exploitable vulnerabilities.

**Recommendation:** Address P1-01 and P1-02 to formalize the implicit trust boundary as explicit code. The P2 items are optional hardening.
