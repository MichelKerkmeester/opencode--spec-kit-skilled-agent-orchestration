# Audit: QA3-O06 — git-context-extractor.ts

**File:** `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts`
**LOC:** 187
**Auditor:** @review (Claude Opus 4.6)
**Date:** 2026-03-09
**Spec:** 013-improve-stateless-mode
**Review Mode:** Focused File Review (Mode 3)

---

## Score Breakdown

| Dimension        | Score | Max | Notes                                                                |
| ---------------- | ----- | --- | -------------------------------------------------------------------- |
| Correctness      | 24    | 30  | Minor edge cases in parsing; good error recovery at top level        |
| Security         | 22    | 25  | No injection vectors found; minor hardening recommendations          |
| Patterns         | 18    | 20  | Follows project conventions; minor deviation in error handling style  |
| Maintainability  | 13    | 15  | Clear structure; some functions could use JSDoc                      |
| Performance      | 9     | 10  | Reasonable; minor redundant git calls                                |
| **TOTAL**        | **86**| 100 | **ACCEPTABLE** — Pass with notes                                    |

---

## Adversarial Self-Check (P0/P1 Findings)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final |
|---|---------|-----------------|-------------------|-----------------|-------|
| 1 | `runGitCommand` accepts arbitrary `command` string — future caller could inject | P0 | `projectRoot` comes from `CONFIG.PROJECT_ROOT` (deterministic `path.resolve`); all command strings are hardcoded literals at call sites; no user input flows into commands; function is non-exported | Downgraded — no current injection vector, but API shape is risky | P2 |
| 2 | `HEAD~${diffWindow}` interpolation in shell command (line 109) | P0 | `diffWindow` = `Math.min(revCount, MAX_DIFF_COMMITS)` where `revCount` is `parseInt` of git output, `MAX_DIFF_COMMITS` is const 5; result is always a safe integer 1-5 | Dropped — integer arithmetic, no string injection possible | -- |
| 3 | Top-level catch swallows all errors silently (line 184) | P1 | This is intentional defensive design — extractor is non-critical enrichment; pipeline must not crash if git is unavailable; returns `emptyResult()` gracefully | Downgraded — correct for this use case, but loses diagnostic info | P2 |
| 4 | No validation that `projectRoot` is a real directory before execSync | P1 | execSync with invalid cwd throws ENOENT, caught by top-level catch; `emptyResult()` returned; no crash | Confirmed valid concern but handled by catch — downgrade | P2 |
| 5 | `git rev-list --count HEAD` fails in empty repo (no commits) | P1 | Would throw, caught by top-level catch, returns `emptyResult()` — graceful degradation | Confirmed — correct behavior for empty repo, but no specific handling | P2 |
| 6 | `parseStatScores` regex may not match all `git diff --stat` formats | P1 | Regex `^\s*(.+?)\s+\|\s+(\d+)\s+[+\-]+$` handles standard format; binary files show "Bin X -> Y bytes" which won't match (correct: skip binary); renames show `{old => new}` which the `.+?` captures correctly | Confirmed minor — binary files silently skipped (acceptable), but rename paths may include braces in FILE_PATH | P1 |

---

## Findings

### P0 — BLOCKERS

**None confirmed.** All candidate P0 findings were disproved or downgraded via adversarial self-check.

### P1 — REQUIRED

#### P1-1: `parseStatScores` captures brace-wrapped rename paths verbatim

**File:line:** `git-context-extractor.ts:89-93`
**Evidence:**
```typescript
const match = line.match(/^\s*(.+?)\s+\|\s+(\d+)\s+[+\-]+$/);
```
**Issue:** When git reports a rename in `--stat` output, the format is:
```
 src/{old-name.ts => new-name.ts} | 15 +++---
```
The regex captures `src/{old-name.ts => new-name.ts}` as the file path. This brace-wrapped path is then passed to `normalizeFilePath` which does not unwrap it, resulting in a `FILE_PATH` like `src/{old-name.ts => new-name.ts}` that will never match the clean path from `--name-status` output (which reports the destination path only). This causes the `changeScores` map to have orphaned entries that never correlate with actual files.

**Impact:** Silent data quality issue — rename change scores are lost, affecting the `topFiles` ranking. Not a crash or security issue, but produces incorrect output for renamed files.

**Fix:** After regex match, detect brace-wrapped renames and extract the destination path:
```typescript
let rawPath = match[1];
const renameMatch = rawPath.match(/\{.+? => (.+?)\}/);
if (renameMatch) {
  rawPath = rawPath.replace(/\{.+? => .+?\}/, renameMatch[1]);
}
```

---

### P2 — SUGGESTIONS

#### P2-1: `runGitCommand` API shape allows arbitrary command injection by future callers

**File:line:** `git-context-extractor.ts:51-58`
**Evidence:**
```typescript
function runGitCommand(projectRoot: string, command: string): string {
  return execSync(command, { cwd: projectRoot, ... }).trim();
}
```
**Current state:** All 7 call sites pass hardcoded string literals or safe integer interpolations. The function is module-private (not exported). `projectRoot` comes exclusively from `CONFIG.PROJECT_ROOT` (deterministic `path.resolve` computation at config load time — see `config.ts:240`).

**Concern:** The function signature accepts any arbitrary string as `command`. A future developer adding a call site could accidentally interpolate unsanitized input. The API shape does not enforce safety.

**Recommendation:** Consider one of:
- (a) Replace the generic `command` parameter with a structured API: `runGitCommand(projectRoot, 'diff', ['--name-status', 'HEAD~5'])` using `execFileSync('git', args, opts)` which avoids shell interpretation entirely.
- (b) Add a JSDoc warning: `@internal — command MUST be a hardcoded literal or safe integer interpolation. Never interpolate user-controlled strings.`
- (c) Add a runtime guard: `if (!/^git\s/.test(command)) throw new Error('...')`.

Option (a) is the strongest defense as `execFileSync` bypasses the shell entirely.

#### P2-2: Top-level catch discards error context

**File:line:** `git-context-extractor.ts:184-186`
**Evidence:**
```typescript
} catch {
  return emptyResult();
}
```
**Issue:** All errors (timeout, ENOENT for git binary, permission denied, corrupt repo) are silently swallowed. When git enrichment silently fails, diagnosing "why is git context empty?" becomes difficult.

**Recommendation:** Log a structured warning before returning:
```typescript
} catch (error: unknown) {
  structuredLog('warn', `Git context extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  return emptyResult();
}
```
This preserves the graceful degradation behavior while providing diagnostic breadcrumbs.

#### P2-3: No timeout on `git rev-parse --is-inside-work-tree` (line 119)

**File:line:** `git-context-extractor.ts:119`
**Evidence:** `runGitCommand` already applies `GIT_TIMEOUT_MS = 5000` to all calls including this one. This finding is **not an issue** — the timeout is correctly inherited. Included for completeness of the audit trail.

**Status:** No action needed.

#### P2-4: `getDiffOutput` makes two separate git calls for the same diff window

**File:line:** `git-context-extractor.ts:107-116, 127-131`
**Evidence:**
```typescript
const diffEntries = getDiffOutput(projectRoot, revCount, '--name-status')...
const changeScores = parseStatScores(projectRoot, getDiffOutput(projectRoot, revCount, '--stat'));
```
**Issue:** Two separate `execSync` calls to git for the same commit range — one for `--name-status` and one for `--stat`. This doubles the git process spawning overhead.

**Recommendation:** Combine into a single `git diff --name-status --stat HEAD~N` call and split the output. Low priority since the 5-second timeout per call is generous and the calls are fast for small repos.

#### P2-5: Missing JSDoc on exported interface and function

**File:line:** `git-context-extractor.ts:26-46, 117`
**Evidence:** `GitContextExtraction` interface and `extractGitContext` function lack JSDoc documentation describing their purpose, parameters, and return semantics.

**Recommendation:** Add JSDoc blocks for API documentation, especially since this is an exported function consumed by `workflow.ts`.

#### P2-6: Shallow clone edge case — `git rev-list --count HEAD` succeeds but returns misleading count

**File:line:** `git-context-extractor.ts:124`
**Evidence:**
```typescript
const revCount = Number.parseInt(runGitCommand(projectRoot, 'git rev-list --count HEAD'), 10);
```
**Issue:** In a shallow clone (`git clone --depth 1`), `git rev-list --count HEAD` returns the number of commits in the shallow history (typically 1), not the full repository count. This is actually correct behavior for this extractor's purpose — it only needs to know how many commits are available locally for diff computation. The `Math.min(revCount, MAX_DIFF_COMMITS)` in `getDiffOutput` further limits the window.

**Status:** Not a bug. The shallow clone case is handled correctly by accident — the limited count naturally limits the diff window. However, adding a comment documenting this would prevent future confusion:
```typescript
// Note: In shallow clones, rev-list returns shallow history count — this is intentional,
// as we only diff against locally available commits.
```

#### P2-7: `SYNTHETIC_TIMESTAMP` used for uncommitted changes may confuse downstream consumers

**File:line:** `git-context-extractor.ts:13, 152`
**Evidence:**
```typescript
const SYNTHETIC_TIMESTAMP = new Date(0).toISOString(); // "1970-01-01T00:00:00.000Z"
// ...
timestamp: SYNTHETIC_TIMESTAMP, // for uncommitted changes
```
**Issue:** Using epoch zero as the timestamp for uncommitted changes means they sort before all real commits. Downstream consumers (like memory indexing) might interpret this as "very old" rather than "current/unknown". The `_synthetic: true` flag partially mitigates this.

**Recommendation:** Consider using `new Date().toISOString()` for uncommitted changes (they are current), or document that epoch-zero means "timestamp unavailable, not epoch-old."

---

## Checklist Results

### Correctness
- [x] Function returns expected types for all code paths — `emptyResult()` on all error paths, full result on success
- [x] Error cases handled explicitly — top-level try/catch with graceful degradation
- [x] Edge cases identified — empty repo, shallow clone, no uncommitted changes all degrade gracefully
- [x] Async operations properly awaited — function is async, all internal calls are synchronous (execSync)
- [ ] Resource cleanup in error paths — N/A (no resources to clean up; execSync handles process lifecycle)

### Security
- [x] No hardcoded credentials or secrets
- [x] User input validated before use — `projectRoot` is not user input (computed from `__dirname`)
- [x] SQL/NoSQL injection prevention — N/A
- [x] XSS prevention — N/A
- [x] Auth/authz checks — N/A
- [x] Sensitive data not logged — no logging at all (see P2-2)
- [x] Command injection prevention — all execSync commands are hardcoded literals or safe integer interpolations

### Patterns
- [x] Follows project initialization patterns — matches `session-extractor.ts` style
- [x] Consistent naming conventions — camelCase functions, PascalCase types
- [x] Proper module structure — types at top, helpers in middle, exported function at bottom
- [x] Uses existing utilities — N/A (standalone extractor, no shared utils needed)
- [ ] Event handling follows project patterns — N/A

### Maintainability
- [x] Functions have clear single purpose
- [ ] Comments explain "why" not "what" — some functions lack any comments
- [x] Complexity reasonable — simple control flow throughout
- [x] Magic numbers extracted to constants — `GIT_TIMEOUT_MS`, `MAX_FILES`, `MAX_COMMITS`, `MAX_DIFF_COMMITS`
- [x] Dead code removed

### Performance
- [x] No N+1 query patterns
- [x] Large datasets use streaming/pagination — `MAX_FILES` and `MAX_COMMITS` cap output
- [ ] Expensive operations cached where appropriate — two git diff calls for same range (P2-4)
- [x] Event listeners properly cleaned up — N/A
- [x] No memory leaks from closures

---

## Comparison with Peer Extractor: `session-extractor.ts`

The `session-extractor.ts` (line 134) also uses `execSync` for git commands:
```typescript
const branch = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe']
}).trim();
```

**Notable differences:**
- `session-extractor.ts` does NOT set a timeout on its execSync calls — `git-context-extractor.ts` is actually better here with `GIT_TIMEOUT_MS = 5000`.
- Both use `CONFIG.PROJECT_ROOT` as cwd (trusted, deterministic path).
- Both use try/catch with graceful fallback.
- `git-context-extractor.ts` runs more git commands (7 in a full execution vs. 2 in session-extractor), so its timeout protection is more important.

---

## Recommendation

**PASS** — Score 86/100 (ACCEPTABLE band).

No P0 blockers. One P1 finding (rename path parsing in `parseStatScores`) that causes silent data quality issues for renamed files but does not affect security, crash safety, or core functionality. Six P2 suggestions for hardening and maintainability.

**Priority fixes:**
1. P1-1: Fix rename path unwrapping in `parseStatScores` regex
2. P2-2: Add structured logging to the catch block
3. P2-1: Consider migrating to `execFileSync` for defense-in-depth

---

## Confidence

**HIGH** — All 187 lines read. All 7 `runGitCommand` call sites verified. Trust boundary of `projectRoot` traced to `CONFIG.PROJECT_ROOT` (deterministic `path.resolve` from `__dirname`). Only call site in codebase confirmed at `workflow.ts:445`. Adversarial self-check completed on all candidate P0/P1 findings.
