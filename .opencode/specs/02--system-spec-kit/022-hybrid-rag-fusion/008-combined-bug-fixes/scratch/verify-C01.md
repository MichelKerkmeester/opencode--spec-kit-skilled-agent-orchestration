## Agent C01: git-context-extractor.ts Deep Review

**File:** `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts`
**Lines:** 188
**Review Date:** 2026-03-08
**Confidence:** HIGH (all files read, all evidence verified)

---

### Summary

| Dimension | Score | Notes |
|---|---|---|
| **Correctness** | 25/30 | Solid parsing, minor edge-case gaps |
| **Security** | 20/25 | No injection risk from external input, but `projectRoot` validation absent |
| **Patterns** | 18/20 | Provenance markers correct, matches project conventions |
| **Maintainability** | 13/15 | Clean structure, good constants, some docs missing |
| **Performance** | 8/10 | Reasonable caps, but worst-case 7 serial `execSync` calls |
| **TOTAL** | **84/100** | **ACCEPTABLE — PASS with notes** |

---

### Security Analysis

**1. `execSync` and Command Injection (PRIMARY CONCERN)**

The `runGitCommand` function at line 51-58 accepts a pre-built `command` string and passes it to `execSync`. The critical question is: can any attacker-controlled data reach the `command` parameter?

**Evidence chain:**
- `extractGitContext(projectRoot)` is the only export (line 117)
- `projectRoot` comes from `CONFIG.PROJECT_ROOT` (workflow.ts line 657)
- `CONFIG.PROJECT_ROOT` is computed at config.ts line 229 via `path.resolve(SCRIPTS_DIR, '..', '..', '..', '..')` — a static path derived from the module's filesystem location, not from user input
- No user/network-supplied strings are ever interpolated into git commands

**All git commands constructed in the file:**
| Line | Command | Input Source |
|---|---|---|
| 109 | `git diff ${format} HEAD~${diffWindow}` | `diffWindow` = `Math.min(revCount, MAX_DIFF_COMMITS)` — integer from `rev-list --count`, clamped |
| 112 | `git show --pretty=format: --name-status HEAD` | Literal |
| 113 | `git show --stat --format= HEAD` | Literal |
| 119 | `git rev-parse --is-inside-work-tree` | Literal |
| 120 | `git status --porcelain` | Literal |
| 124 | `git rev-list --count HEAD` | Literal |
| 133 | `git log --format="..." --since="24 hours ago" -${MAX_COMMITS}` | `MAX_COMMITS` = constant `20` |

**Verdict:** No command injection risk. `projectRoot` is used only as `cwd`, not interpolated into the command string. The `diffWindow` interpolation at line 109 is safe because it is derived from `parseInt` of a git command output, clamped to `MAX_DIFF_COMMITS` (5), and checked with `Number.isFinite`. `MAX_COMMITS` is a compile-time constant.

**One defensive gap:** `projectRoot` is not validated as an existing directory before use. If `CONFIG.PROJECT_ROOT` resolves to a non-existent path, `execSync` throws — but this is caught by the outer try/catch at line 184. This is adequate since `projectRoot` is not user-supplied.

---

### Error Handling

**Top-level try/catch (lines 118-186):**
The entire `extractGitContext` function is wrapped in a single try/catch that returns `emptyResult()` on any error. This is appropriate for an enrichment extractor — failure is non-fatal.

**Additionally**, the caller in workflow.ts (line 445) wraps it with `.catch(() => null)`, providing double protection.

**Specific scenarios analyzed:**

| Scenario | Behavior | Adequate? |
|---|---|---|
| Git not installed | `execSync` throws on `git rev-parse` → caught → `emptyResult()` | YES |
| Not a git repo | `rev-parse` returns non-`'true'` → early return `emptyResult()` | YES |
| Shallow clone | `rev-list --count HEAD` returns count; `HEAD~N` may fail if shallow depth < N → caught by outer try/catch | YES, but see P2-1 |
| Empty repo (no commits) | `rev-list --count HEAD` fails (no HEAD) → exception → `emptyResult()` | YES |
| `execSync` timeout (5s) | Throws → caught → `emptyResult()` | YES |
| Non-UTF-8 output | `encoding: 'utf-8'` is specified; Node will do best-effort decode | YES |

**Gap identified:** There is no per-command error handling. If `git status --porcelain` succeeds but `git rev-list --count HEAD` fails, ALL collected status data is discarded. The function returns `emptyResult()` rather than partial results. This is a design trade-off — simpler code at the cost of partial data loss.

---

### Edge Cases

**Files with spaces in names (line 77-84):**
The `parseNameStatusLine` function splits on `\s+` at line 77. For rename entries (`R\d*`), it takes `rest[rest.length - 1]` which handles the destination path. However, for non-rename entries, `rest.join(' ')` reconstitutes spaces. This is correct for `--name-status` output (tab-separated) but the regex `\s+` treats tabs and spaces identically, which could misparse filenames containing literal tabs (extremely rare edge case).

**Quoted paths from git (line 60):**
`normalizeFilePath` strips surrounding double-quotes (`/^"+|"+$/g`). Git quotes paths containing special characters (e.g., non-ASCII, spaces). However, git uses C-style escaping inside quotes (e.g., `\303\244` for `ä`). The current code strips quotes but does NOT unescape C-style octal sequences. This means non-ASCII filenames in git output will have mangled paths like `\303\244` instead of `ä`.

**Binary files in diff (line 89):**
`parseStatScores` uses a regex matching `file | N ++++---` format. Binary files show as `file | Bin 0 -> 1234 bytes` which won't match the regex — they are silently skipped. This is correct behavior.

**Very large repos:**
- `MAX_FILES = 50` caps output file entries
- `MAX_COMMITS = 20` caps log depth
- `MAX_DIFF_COMMITS = 5` limits diff window
- `GIT_TIMEOUT_MS = 5000` per command
- These caps are reasonable. `git status --porcelain` on a very large repo with many changes could still be slow, but the 5s timeout protects against hangs.

**Newly initialized repo (HEAD exists but no parent):**
`getDiffOutput` handles `revCount === 1` correctly (lines 110-113) by using `git show` instead of `git diff HEAD~1` which would fail.

**`revCount === 0` case:**
If `rev-list --count HEAD` returns 0 (shouldn't happen if HEAD exists), `getDiffOutput` returns `''` because `diffWindow = Math.min(0, 5) = 0` and neither branch at lines 109 or 110 is entered. This is safe.

---

### Provenance & Type Safety

**Provenance markers — VERIFIED COMPLETE:**

| Output location | `_provenance: 'git'` | `_synthetic: true` | Required? |
|---|---|---|---|
| `observations[]` (lines 148-157) | YES (line 155) | YES (line 156) | Both required |
| `observations[]` from commits (lines 159-170) | YES (line 167) | YES (line 168) | Both required |
| `FILES[]` (line 140) | YES | N/A (not in interface) | `_provenance` only |

The `GitContextExtraction` interface (lines 26-46) correctly types `_provenance: 'git'` as a string literal and `_synthetic: true` as a boolean literal. This is enforced at compile time.

**Type safety audit:**

| Item | Status |
|---|---|
| `any` types in file | NONE — zero `any` types |
| Interface completeness | Complete — all fields typed |
| Return type | `Promise<GitContextExtraction>` — explicit |
| Internal types | `ChangeAction`, `CommitInfo`, `ParsedEntry` — all well-defined |
| `Number.parseInt` safety | Checked with `Number.isFinite` at line 125 |
| `Number.parseInt` in `parseStatScores` | Checked with `Number.isFinite` at line 93 |

**Note:** The `FILES` array items do NOT have `_synthetic: true`. The interface definition at lines 37-42 does not include it. This is intentional — `_synthetic` marks observations (which are narrative assertions), not file entries (which are factual path records). This design is consistent.

---

### Data Flow Verification (Integration with workflow.ts)

**Import:** workflow.ts line 38 imports `extractGitContext` correctly.

**Call site:** workflow.ts line 445 calls `extractGitContext(projectRoot)` inside `Promise.all`, with `.catch(() => null)`.

**Merge logic (workflow.ts lines 497-521):**
1. `gitContext.observations` → appended to `collectedData.observations` — **compatible** (array concat)
2. `gitContext.FILES` → deduplicated by `FILE_PATH.toLowerCase()` then appended — **compatible**
3. `gitContext.summary` → appended to `collectedData.SUMMARY` — **compatible** (string concat)

**Potential issue in workflow.ts (not in reviewed file but relevant):**
At workflow.ts line 507, the deduplication uses `(f: any)` cast, which bypasses type safety. The git extractor's `FILES` items always have `FILE_PATH` (required in interface), so `f.FILE_PATH.toLowerCase()` at line 510 is safe. But the `any` cast in the consumer is a minor type-safety gap in workflow.ts, not in the reviewed file.

---

### Findings

#### Adversarial Self-Check (Hunter/Skeptic/Referee)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---|---|---|---|---|
| 1 | C-style octal escaping not decoded | P1 | Rare in practice; only affects non-ASCII filenames; paths still deduplicate consistently | Downgraded | **P2** |
| 2 | No partial results on mid-function failure | P1 | Intentional design: simpler code, enrichment is non-critical, double-wrapped in catch | Downgraded | **P2** |
| 3 | `projectRoot` not validated as directory | P1 | Static from CONFIG, not user input; exception caught; would never reach production with bad path | Dropped | **P2** |
| 4 | Total wall-clock up to 35s (7 commands x 5s) | P1 | Unlikely all 7 hit timeout; `Promise.all` in workflow means git runs parallel with spec-folder extraction; 5s per cmd is generous | Downgraded | **P2** |
| 5 | `\s+` split may misparse tab-containing filenames | P2 | Filenames with literal tabs are astronomically rare | Confirmed at P2 | **P2** |

#### P0 — BLOCKERS
None.

#### P1 — REQUIRED
None (all candidates downgraded after adversarial review).

#### P2 — SUGGESTIONS

**P2-1: Non-ASCII filename paths not unescaped**
- **File:** `git-context-extractor.ts:60`
- **Evidence:** `normalizeFilePath` strips quotes but does not decode git's C-style octal escapes (e.g., `\303\244` for `ä`)
- **Impact:** Non-ASCII filenames appear mangled in output. Deduplication still works (consistently mangled), but human-readable output is degraded.
- **Fix:** Add a C-style unescape step after quote stripping, e.g.: `cleanedPath.replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))`

**P2-2: All-or-nothing error handling discards partial data**
- **File:** `git-context-extractor.ts:184-186`
- **Evidence:** Single try/catch around entire function. If `git log` fails after `git status` succeeds, status data is lost.
- **Impact:** In shallow clones or repos with unusual history, valid uncommitted-change data may be discarded.
- **Fix:** Wrap individual command blocks in their own try/catch, accumulating partial results.

**P2-3: Worst-case cumulative timeout**
- **File:** `git-context-extractor.ts:9` (`GIT_TIMEOUT_MS = 5_000`)
- **Evidence:** Up to 7 `execSync` calls: `rev-parse`, `status`, `rev-list`, 2x `getDiffOutput`, `git log`, plus potential `git show` variants. Worst case: 7 x 5s = 35s.
- **Impact:** Unlikely in practice (timeouts mean git is unresponsive), but no aggregate timeout cap exists.
- **Fix:** Add cumulative elapsed-time check; abort early if total exceeds e.g. 15s.

**P2-4: Shallow clone edge case in `getDiffOutput`**
- **File:** `git-context-extractor.ts:109`
- **Evidence:** `git diff HEAD~${diffWindow}` fails if the shallow clone depth is less than `diffWindow`. Error is caught by outer try/catch but discards all data.
- **Fix:** Pre-check with `git rev-list --count HEAD` (already done at line 124) and clamp `diffWindow` to actual history depth. Currently `diffWindow = Math.min(revCount, MAX_DIFF_COMMITS)` already does this — so this is actually handled. **Confirmed safe after re-check; keeping as documentation note only.**

**P2-5: Tab-vs-space ambiguity in name-status parsing**
- **File:** `git-context-extractor.ts:77`
- **Evidence:** `split(/\s+/)` treats tabs and spaces identically; git `--name-status` uses tab separators.
- **Impact:** Only affects filenames containing literal tab characters (virtually nonexistent).
- **Fix:** Use `split(/\t/)` for `--name-status` output parsing to be pedantically correct.

#### Positive Highlights

1. **Excellent provenance discipline** — every output item carries `_provenance: 'git'` and observations carry `_synthetic: true`. The TypeScript interface enforces this at compile time with literal types.
2. **Zero `any` types** in the entire file — strong type safety throughout.
3. **Sensible resource caps** — `MAX_FILES`, `MAX_COMMITS`, `MAX_DIFF_COMMITS`, and per-command timeouts prevent runaway behavior.
4. **Clean handling of edge cases** — single-commit repos (`revCount === 1`) get `git show` instead of `git diff HEAD~1`; `Number.isFinite` guards all `parseInt` calls.
5. **Non-blocking integration** — the `async` signature and workflow.ts's `.catch(() => null)` wrapper ensure git extraction never blocks the pipeline.
6. **Well-structured code** — small, focused functions with clear responsibilities; good use of TypeScript literal types and type predicates.

---

### Verdict

**Score: 84/100 — ACCEPTABLE (PASS with notes)**

**Recommendation: APPROVE**

This is a well-written, defensively coded extractor with zero `any` types, complete provenance marking, and sensible resource guards. No security vulnerabilities or logic errors were found. The five P2 suggestions are minor improvements — non-ASCII path unescaping (P2-1) is the most impactful if the codebase handles internationalized filenames. The all-or-nothing error handling (P2-2) is a conscious trade-off appropriate for a non-critical enrichment pipeline.

The integration with workflow.ts is clean and correct: data shapes match, deduplication is handled, and failure is gracefully absorbed.
