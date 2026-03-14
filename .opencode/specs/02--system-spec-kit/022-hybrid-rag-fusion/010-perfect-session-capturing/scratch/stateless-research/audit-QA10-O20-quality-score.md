# QA10-O20: Final Quality Score — 5-Dimension Rubric

**Date:** 2026-03-09
**Scope:** 14-file pipeline codebase under `.opencode/skill/system-spec-kit/scripts/`
**Scored by:** Claude Opus 4.6 (@review agent)
**Inputs:** O18 Opus Synthesis, O19 Cross-Model Reconciliation, direct source file verification
**Confidence:** HIGH — all 14 source files read, all P0/P1 findings verified against source

---

## 1. Executive Summary

| Dimension | Points Available | Score | Pct |
|---|---|---|---|
| Correctness | 30 | 19 | 63% |
| Security | 25 | 21 | 84% |
| Patterns | 20 | 13 | 65% |
| Maintainability | 15 | 10 | 67% |
| Performance | 10 | 8 | 80% |
| **TOTAL** | **100** | **71** | **71%** |

**Quality Band:** ACCEPTABLE (70-89) — PASS
**Gate Result:** PASS with notes
**Confidence:** HIGH

---

## 2. Dimension 1: Correctness (19/30)

### Confirmed Findings Impacting Score

| # | Finding | File:Line | Severity | Deduction | Evidence |
|---|---------|-----------|----------|-----------|----------|
| 1 | **ConversationCapture uses snake_case (`session_id`, `session_title`, `captured_at`) but OpencodeCapture interface uses camelCase (`sessionId`, `sessionTitle`, `capturedAt`). Consumers always read `undefined`.** | `opencode-capture.ts:79-95` vs `input-normalizer.ts:106-113` | P0 | -4 | Verified: `ConversationCapture` at L79-95 declares `session_id`, `session_title`, `captured_at`. `OpencodeCapture` at input-normalizer.ts:106-113 declares `sessionId`, `sessionTitle`, `capturedAt`. Consumer at L527-528 reads camelCase — always undefined from snake_case source. |
| 2 | **Learning weight swap: `du` (uncertainty delta) multiplied by `context` weight (0.35), `dc` (context delta) multiplied by `uncertainty` weight (0.25).** | `collect-session-data.ts:201-204` | P1 | -2 | Verified: L198-204 shows `du = deltaUncert`, `dc = deltaContext`. L202-203: `du * CONFIG.LEARNING_WEIGHTS.context` + `dc * CONFIG.LEARNING_WEIGHTS.uncertainty`. Confirmed: context=0.35, uncertainty=0.25 in config.ts:162-166. Coefficients are transposed. |
| 3 | **`continuationCount || 1` coerces valid zero to 1.** | `collect-session-data.ts:580` | P1 | -1 | Verified: L580 uses `||` not `??`. A legitimate `continuationCount` of `0` becomes `1`, silently corrupting session numbering. |
| 4 | **`SPEC_FOLDER` (SCREAMING_CASE) silently dropped during normalization.** | `input-normalizer.ts:233-234` | P1 | -1 | Verified: L233 maps only `data.specFolder` (camelCase). `RawInputData` interface at L47 declares `SPEC_FOLDER?: string` but `normalizeInputData` never reads it. |
| 5 | **Anchor IDs non-deterministic: `Date.now()` in hash input.** | `anchor-generator.ts:94` | P1 | -1 | Verified: L94 `generateShortHash(\`${sectionTitle}|${additionalContext}|${Date.now()}\`)`. Identical content produces different IDs on every run. |
| 6 | **`_manualTriggerPhrases` populated but never consumed by trigger extraction pipeline.** | `workflow.ts:467-472` vs `workflow.ts:842-884` | P1 | -1 | Verified: L467-472 populates `collectedData._manualTriggerPhrases`. L842-879 builds trigger phrases from summary, decisions, files, folder name — never reads `_manualTriggerPhrases`. |
| 7 | **Negative session duration unguarded.** | `session-extractor.ts:290` | P1 | -0.5 | Verified: L290 `Math.floor((lastTimestamp - firstTimestamp) / 60000)`. If first > last (e.g., fallback dates), produces negative minutes. No `Math.max(0, ...)`. |
| 8 | **Confidence score from regex unclamped (can exceed 100).** | `decision-extractor.ts:262` | P1 | -0.5 | Verified: L262 `parseInt(confidenceMatch[1], 10)` — no `Math.min(100, ...)` guard. Input text "confidence: 150%" would produce 150. |

### Adversarial Self-Check (P0/P1 findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final |
|---------|----------------|-------------------|-----------------|-------|
| Interface naming mismatch (O08-P0-1) | P0 | Could `as` cast mask this? No — runtime fields are literally named differently | Confirmed | P0 |
| Learning weight swap (O02-P1-01) | P1 | Could weights be intentional? No — variable names `du`/`dc` match delta-uncertainty/delta-context | Confirmed | P1 |
| continuationCount `||` vs `??` | P1 | Is zero ever legitimate? Yes — first continuation has count 0 | Confirmed | P1 |
| SPEC_FOLDER not mapped | P1 | Could upstream always provide camelCase? No — `RawInputData` explicitly declares SCREAMING_CASE | Confirmed | P1 |
| Anchor ID non-deterministic | P1 | Is non-determinism intended? No — anchors used for cross-referencing and dedup | Confirmed | P1 |
| Manual trigger phrases dead | P1 | Could another code path read them? Grep confirms zero read access | Confirmed | P1 |
| Negative duration | P1 | Could first > last happen? Yes — fallback `now` for missing timestamps | Confirmed | P1 |
| Unclamped confidence | P1 | Does regex guarantee <100? No — matches arbitrary digits | Confirmed | P1 |

**Dimension Score Rationale:**
- Base: 30 (full marks if all code paths correct, edge cases handled)
- P0 deduction: -4 (silent data loss on 3 fields in a primary data pathway)
- P1 deductions: -7 (7 confirmed logic errors with direct data corruption impact)
- **Final: 19/30**

---

## 3. Dimension 2: Security (21/25)

### Confirmed Findings Impacting Score

| # | Finding | File:Line | Severity | Deduction | Evidence |
|---|---------|-----------|----------|-----------|----------|
| 1 | **Git extractor operates at `projectRoot` scope — no spec-folder scoping.** | `git-context-extractor.ts:120-133` | P1 | -2 | Verified: L120 `git status --porcelain` and L133 `git log --since="24 hours ago"` run against full repo. No path filtering. Unrelated spec data leaks into memory files. Not a traditional security vulnerability but a data boundary violation. |
| 2 | **Enrichment `.catch(() => null)` silently swallows errors.** | `workflow.ts:444-445` | P1 | -1 | Verified: L444-445 both `extractSpecFolderContext` and `extractGitContext` have `.catch(() => null)`. Failures produce no diagnostic output. |
| 3 | **`getChannel()` uses `execSync` with no timeout.** | `session-extractor.ts:134-139` | P1 | -0.5 | Verified: L134 `execSync('git rev-parse --abbrev-ref HEAD', ...)` — the `stdio` pipes are set but no `timeout` option. Could hang on unresponsive git. Compare with git-context-extractor which sets `GIT_TIMEOUT_MS = 5_000`. |
| 4 | **`readJsonlTail` file handle leak on partial read errors.** | `opencode-capture.ts:133-172` | P1 | -0.5 | Verified: L139 opens `fileHandle`, L165 closes it in happy path. But L167 catch block returns `[]` without closing the handle. If readline throws mid-stream, the fd leaks. |

### Positive Security Observations

- **Session IDs use CSPRNG**: `session-extractor.ts:128` uses `crypto.randomBytes(6)` — 48 bits entropy
- **Path traversal guards present**: `file-writer.ts:68-74` validates filenames against directory escape, `collect-session-data.ts:736-744` validates SPEC_FOLDER against boundary
- **No command injection vectors**: All `execSync` calls use hardcoded commands (no user input interpolation)
- **No hardcoded credentials**: No secrets found in any file
- **`sanitizePath` and traversal boundary checks**: Multiple layers of path normalization
- **File-writer uses temp+rename pattern**: `file-writer.ts:88-92` — atomic writes prevent partial file corruption

### Disputed Findings (Downgraded)

- **file-writer symlink/TOCTOU** (Copilot P0 -> reconciled P2): Single-process context; upstream path sanitization already resolves symlinks
- **file-writer batch atomicity** (Copilot P0 -> reconciled P2): Pre-write validation errors are logic errors, not partial-write corruption; rollback mechanism exists (L97-119)

**Dimension Score Rationale:**
- Base: 25
- Deductions: -4 (data boundary violation in git, silent error swallowing, no exec timeout, fd leak)
- Strong path traversal guards, CSPRNG, atomic writes offset minor gaps
- **Final: 21/25**

---

## 4. Dimension 3: Patterns (13/20)

### Confirmed Findings Impacting Score

| # | Finding | File(s) | Severity | Deduction | Evidence |
|---|---------|---------|----------|-----------|----------|
| 1 | **Index signature abuse defeats TypeScript type safety.** | `session-types.ts:215`, `session-types.ts:22,49,71,82,96,131`, `file-extractor.ts:67`, `session-extractor.ts:36` | P1 | -3 | Verified: `SessionData` at L215 has `[key: string]: unknown`. `collect-session-data.ts:810-831` spreads `implementationGuide`, `preflightPostflightData`, and `continueSessionData` — 39 fields absorbed silently. Same pattern on 9 interfaces. |
| 2 | **Provenance markers created but stripped at transformation boundaries.** | `file-extractor.ts:238-267`, `file-extractor.ts:306-317` | P1 | -1.5 | Verified: `ObservationDetailed` (L44-54) has no `_provenance` or `_synthetic` fields. `buildObservationsWithAnchors` at L306-317 constructs new objects without them. `enhanceFilesWithSemanticDescriptions` at L238-242 returns new objects dropping `_provenance`/`_synthetic` on match. |
| 3 | **Duplicate/incompatible type definitions for same domain concepts.** | `session-extractor.ts:71-80` vs `file-extractor.ts:34-41` vs `input-normalizer.ts:12-24` | P1 | -1 | Verified: Three `Observation` types with incompatible `facts` signatures: `Array<string | { text?: string }>` vs `Array<string | { text?: string; files?: string[] }>` vs `string[]`. Three file types: `FileChange`, `FileEntry`, `FileInput`. |
| 4 | **Contamination filter only covers `userPrompts`, not enrichment data.** | `workflow.ts:736-748` | P1 | -1 | Verified: L736-748 maps only `rawUserPrompts` through `filterContamination()`. Git commit subjects/bodies at L159-169 (git-context-extractor) flow into observations unfiltered. |
| 5 | **`enrichStatelessData` mutates `collectedData` in-place without documented contract.** | `workflow.ts:433-527` | P1 | -0.5 | Verified: Function signature is `Promise<void>` — mutations on the argument are intentional but undocumented. No `@mutates` JSDoc annotation. |

### Positive Pattern Observations

- **Clean import graph**: O15 audit confirmed acyclic, clean layering, correct barrel exclusions
- **Consistent module structure**: All files follow `1. INTERFACES → 2. FUNCTIONS → N. EXPORTS` pattern
- **Consistent naming**: Functions use camelCase, interfaces use PascalCase, constants use SCREAMING_CASE
- **Barrel re-exports**: Canonical types defined in `session-types.ts`, re-exported for backward compatibility

**Dimension Score Rationale:**
- Base: 20
- Deductions: -7 (index sig abuse on 9 interfaces, provenance stripped, type fragmentation, narrow filter scope, mutation contract)
- Clean import graph and consistent module structure partially offset
- **Final: 13/20**

---

## 5. Dimension 4: Maintainability (10/15)

### Confirmed Findings Impacting Score

| # | Finding | File(s) | Severity | Deduction | Evidence |
|---|---------|---------|----------|-----------|----------|
| 1 | **Silent error swallowing hides diagnostic information.** | `git-context-extractor.ts:184-186`, `opencode-capture.ts:219,256,303,339`, `spec-folder-extractor.ts:38-42`, `workflow.ts:444-445` | P1 | -2 | Verified: Multiple empty `catch` blocks. `git-context-extractor.ts:184` catches everything and returns `emptyResult()` with zero logging. `opencode-capture.ts` has 4 catch blocks returning empty arrays silently. |
| 2 | **Dead code: `sessionDataFn` null check unreachable.** | `workflow.ts:667-674` | P1 | -0.5 | Verified: L667 assigns `collectSessionDataFn || collectSessionData`. `collectSessionData` is imported at L28 and always defined. The `if (!sessionDataFn)` check at L668 is unreachable dead code. |
| 3 | **Duplicate confidence scoring logic across two decision paths.** | `decision-extractor.ts:168` and `decision-extractor.ts:261` | P1 | -0.5 | Verified: Manual path at L168 `OPTIONS.length > 1 ? 70 : (rationale !== title ? 65 : 50)`. MCP path at L261 `OPTIONS.length > 1 ? 70 : RATIONALE !== narrative.substring(0, 200) ? 65 : 50`. Same logic duplicated with slightly different variable names. |
| 4 | **`sessionInfo` typed as `{}` loses type safety.** | `collect-session-data.ts:678` | P1 | -0.5 | Verified: L678 `const sessionInfo = collectedData.recentContext?.[0] || {};` — type is `{}`. Subsequently cast as `(sessionInfo as RecentContextEntry)` at L697, L710-711, L716-717. |
| 5 | **`getSimFactory()` wrapper provides no actual laziness.** | `collect-session-data.ts:604-607` | P2 | -0.5 | Verified: L604 `import * as simFactoryModule from '../lib/simulation-factory'` is a top-level static import. L605-607 `getSimFactory()` just returns the already-loaded module. Dead indirection. |
| 6 | **No test files exist for any of the 14 source files.** | All files | P1 | -1 | Verified: No `*.test.ts` or `*.spec.ts` files found alongside source files. No test directory for the pipeline. |

### Positive Maintainability Observations

- **Clear module header comments**: Every file has a consistent header block with module name and description
- **Section separators**: Logical sections divided with `/* ---- N. SECTION ---- */` markers
- **Exported interfaces are typed**: All public APIs have TypeScript interfaces
- **Re-export pattern**: Backward-compatible type re-exports documented

**Dimension Score Rationale:**
- Base: 15
- Deductions: -5 (silent error swallowing, dead code, duplicated logic, type erasure, no tests)
- Good structural organization and documentation format partially offset
- **Final: 10/15**

---

## 6. Dimension 5: Performance (8/10)

### Confirmed Findings Impacting Score

| # | Finding | File:Line | Severity | Deduction | Evidence |
|---|---------|-----------|----------|-----------|----------|
| 1 | **`getProjectId` uses synchronous I/O in async module.** | `opencode-capture.ts:193-224` | P1 | -1 | Verified: L196 `fsSync.existsSync`, L201 `fsSync.readdirSync`, L206 `fsSync.readdirSync`, L211 `fsSync.readFileSync`. Called from async `captureConversation` at L425. Blocks event loop during file enumeration. |
| 2 | **`checkForDuplicateContent` reads all existing .md files for SHA-256 comparison.** | `file-writer.ts:30-53` | P2 | -0.5 | Verified: L41-52 reads every existing `.md` file in the directory, computes SHA-256, and compares. Linear scan — acceptable for small directories but could become expensive. |
| 3 | **`readJsonlTail` reads entire file to get last N lines.** | `opencode-capture.ts:133-172` | P2 | -0.5 | Verified: Streams the entire JSONL file and keeps a sliding buffer. No seek-to-end optimization. Acceptable for typical sizes but not optimal. |

### Positive Performance Observations

- **Parallel extraction**: `workflow.ts:676-724` runs all 5 extractors via `Promise.all`
- **File dedup uses Map/Set**: `file-extractor.ts:117-163` uses `Map<string, ...>` for O(1) dedup
- **Bounded outputs**: `MAX_FILES_IN_MEMORY`, `MAX_SPEC_OBSERVATIONS`, `MAX_COMMITS` constants prevent unbounded growth
- **`git-context-extractor.ts:9` has `GIT_TIMEOUT_MS = 5000`** — prevents hanging git commands
- **Tree thinning**: `workflow.ts:784-796` reduces token overhead before pipeline stages

**Dimension Score Rationale:**
- Base: 10
- Deductions: -2 (sync I/O in async context, linear file scan, full-file-read for tail)
- Good use of parallel execution, bounded outputs, and timeouts
- **Final: 8/10**

---

## 7. Score Breakdown Summary

| Dimension | Score | Key Issues | Key Strengths |
|---|---|---|---|
| **Correctness** (30) | **19** | P0 interface naming mismatch, learning weight swap, 6 more P1 logic errors | Functional pipeline end-to-end, alignment guard, path traversal checks |
| **Security** (25) | **21** | Git cross-spec leakage, silent error swallowing, missing exec timeout, fd leak | CSPRNG session IDs, path traversal guards, atomic file writes, no injection vectors |
| **Patterns** (20) | **13** | 9 interfaces with index signatures, provenance stripped, type fragmentation | Clean acyclic imports, consistent module structure, canonical type definitions |
| **Maintainability** (15) | **10** | No test files, dead code, duplicate logic, silent catches | Consistent headers/sections, typed interfaces, backward-compat re-exports |
| **Performance** (10) | **8** | Sync I/O in async context, linear file scans | Parallel extraction, bounded outputs, timeouts, Map/Set for dedup |

---

## 8. Final Score

```
┌─────────────────────────────────────────────────┐
│                                                 │
│           FINAL QUALITY SCORE: 71/100           │
│                                                 │
│           Quality Band: ACCEPTABLE              │
│           Gate Result:  PASS                     │
│                                                 │
│   Correctness:     19/30  (63%)                 │
│   Security:        21/25  (84%)                 │
│   Patterns:        13/20  (65%)                 │
│   Maintainability: 10/15  (67%)                 │
│   Performance:      8/10  (80%)                 │
│                                                 │
│   P0 Blockers: 1 (must fix before release)      │
│   P1 Required: 30 (fix to maintain quality)     │
│   P2 Suggestions: 57 (improvement opportunities)│
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 9. Gate Recommendation

**Result: CONDITIONAL PASS**

The codebase scores 71/100 (ACCEPTABLE band), clearing the 70-point gate threshold. However, the single P0 blocker (ConversationCapture/OpencodeCapture interface naming mismatch causing silent data loss) MUST be fixed before next release.

### Priority Fix Order

1. **IMMEDIATE** (P0): Fix `ConversationCapture` field naming to match `OpencodeCapture` camelCase convention
2. **BATCH 1** (3 items): Learning weight swap, git spec-folder scoping, `continuationCount ?? 1`
3. **BATCH 2** (5 items): SPEC_FOLDER mapping, anchor determinism, trigger phrase consumption, timestamp epoch guard, path dedup key
4. **BATCH 3** (type safety): Extend `SessionData` from spread interfaces, unify type variants, propagate provenance markers
5. **BATCH 4** (hardening): Remaining P1 findings — config validation, parser fixes, dead code, test files

### Cross-Model Reconciliation Impact

The reconciliation (O19) confirmed that 21 findings were independently found by both Opus and Copilot, providing highest-confidence corroboration. The final score accounts for:
- 8 disputed severity findings reconciled to their evidence-based level
- 4 Copilot P0s downgraded to P2 (file-writer symlink/TOCTOU/atomicity — theoretical in single-process context)
- 1 Copilot P0 confirmed as true P0 (interface naming mismatch, independently found by both models)

---

*Quality score produced by @review agent (Claude Opus 4.6). Read-only analysis — no source files modified.*
