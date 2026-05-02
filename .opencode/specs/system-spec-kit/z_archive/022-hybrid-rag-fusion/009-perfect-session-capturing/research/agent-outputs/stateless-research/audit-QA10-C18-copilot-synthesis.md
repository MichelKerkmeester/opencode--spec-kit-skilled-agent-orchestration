# Audit QA10-C18: Copilot Synthesis

## Scope
- Reviewed all 17 Copilot audit files requested for spec 013 stateless-mode validation.
- Deduplicated overlapping findings across module-specific and cross-cutting audits.
- Ranked unique findings by severity first (P0 > P1 > P2), then by implementation/runtime impact.

## Totals
- Source audits reviewed: **17**
- Actionable issue statements reviewed: **72**
- Unique findings after deduplication: **31**
- Unique findings by severity:
  - **P0:** 10
  - **P1:** 15
  - **P2:** 6

## Top 10 Findings
1. **P0 — File-writer path safety is bypassable via symlink traversal and TOCTOU windows.**  
   Impact: highest security risk; can escape intended write boundaries or redirect rollback/write operations outside the target tree.  
   Sources: `audit-QA9-C15-fs-security.md`, `audit-QA9-C16-test-coverage.md`

2. **P0 — `writeFilesAtomically()` is not actually batch-atomic.**  
   Impact: partial writes can persist when a later file fails validation, breaking the advertised rollback guarantee.  
   Sources: `audit-QA7-C11-config-filewriter.md`, `audit-QA9-C16-test-coverage.md`

3. **P0 — Workflow git enrichment can reintroduce cross-spec contamination after the alignment guard passes.**  
   Impact: unrelated repo activity can leak into `observations`, `FILES`, and `SUMMARY`, defeating stateless contamination protections.  
   Sources: `audit-QA2-C01-workflow.md`

4. **P0 — `collect-session-data.ts` can corrupt spec identity by using the full nested path as `SPEC_FOLDER`/`TITLE` and anchor input.**  
   Impact: wrong spec numbering, path-shaped titles, and downstream extractor misidentification.  
   Sources: `audit-QA2-C02-collect-session-data.md`

5. **P0 — `input-normalizer.ts` still leaks cross-spec prompts because relevance filtering only protects `observations`.**  
   Impact: mixed-spec sessions can contaminate normalized prompt history even after the stateless filtering work.  
   Sources: `audit-QA2-C03-input-normalizer.md`, `audit-QA9-C16-test-coverage.md`

6. **P0 — OpenCode snake_case metadata is dropped during normalization.**  
   Impact: `session_title`, `session_id`, and `captured_at` are lost, degrading provenance and recent-context fallback quality.  
   Sources: `audit-QA2-C03-input-normalizer.md`

7. **P0 — No direct runtime coverage exists for the file-writer safety and rollback paths.**  
   Impact: the riskiest data-loss/security behaviors remain unverified in tests.  
   Sources: `audit-QA9-C16-test-coverage.md`

8. **P0 — The workflow stateless alignment guard has no direct regression coverage.**  
   Impact: the primary cross-spec save prevention control can regress silently.  
   Sources: `audit-QA9-C16-test-coverage.md`

9. **P0 — `input-normalizer.ts` validation and relevance-filter paths are untested.**  
   Impact: malformed JSON acceptance and prompt contamination regressions would be easy to miss.  
   Sources: `audit-QA9-C16-test-coverage.md`

10. **P0 — `collect-session-data.ts` spec traversal / related-doc loading guards are untested.**  
    Impact: critical containment and fallback behavior lacks direct verification.  
    Sources: `audit-QA9-C16-test-coverage.md`

## Ranked Deduplicated Findings

### P0
1. **Git enrichment reintroduces cross-spec contamination after the alignment guard.**  
   Sources: `audit-QA2-C01-workflow.md`
2. **`collect-session-data.ts` uses nested spec paths as identity data, corrupting `SPEC_FOLDER`, titles, and anchor generation.**  
   Sources: `audit-QA2-C02-collect-session-data.md`
3. **`input-normalizer.ts` drops OpenCode snake_case metadata (`session_title`, `session_id`, `captured_at`).**  
   Sources: `audit-QA2-C03-input-normalizer.md`
4. **`input-normalizer.ts` filters `observations` for relevance but not `userPrompts`, so foreign prompts can leak into stateless saves.**  
   Sources: `audit-QA2-C03-input-normalizer.md`, `audit-QA9-C16-test-coverage.md`
5. **`writeFilesAtomically()` is not truly batch-atomic and can leave partial writes behind.**  
   Sources: `audit-QA7-C11-config-filewriter.md`, `audit-QA9-C16-test-coverage.md`
6. **File-writer filesystem safety is vulnerable to symlink traversal and TOCTOU attacks.**  
   Sources: `audit-QA9-C15-fs-security.md`, `audit-QA9-C16-test-coverage.md`
7. **Missing direct test coverage for the workflow stateless alignment guard.**  
   Sources: `audit-QA9-C16-test-coverage.md`
8. **Missing direct test coverage for `collect-session-data.ts` path/traversal and related-doc guard behavior.**  
   Sources: `audit-QA9-C16-test-coverage.md`
9. **Missing direct test coverage for file-writer runtime safety, rollback, and overwrite recovery.**  
   Sources: `audit-QA9-C16-test-coverage.md`
10. **Missing direct test coverage for `input-normalizer.ts` validation, normalization, and relevance filtering.**  
    Sources: `audit-QA9-C16-test-coverage.md`

### P1
11. **The workflow contamination guard only runs when `observations` is truthy, so `FILES`-only payloads can bypass screening.**  
    Sources: `audit-QA2-C01-workflow.md`, `audit-QA9-C13-null-safety.md`
12. **Stateless enrichment and git extraction failures are swallowed or collapsed to empty results, including unborn-HEAD cases that drop valid uncommitted changes.**  
    Sources: `audit-QA2-C01-workflow.md`, `audit-QA4-C06-git-context-extractor.md`, `audit-QA9-C14-execsync-security.md`
13. **`continuationCount` uses `||` instead of `??`, corrupting valid zero-valued continuation state.**  
    Sources: `audit-QA2-C02-collect-session-data.md`, `audit-QA9-C13-null-safety.md`
14. **Manual input normalization inconsistently handles accepted `SPEC_FOLDER` fields and lets invalid “already normalized” shapes pass through.**  
    Sources: `audit-QA2-C03-input-normalizer.md`
15. **File extraction does not preserve ACTION/rename semantics reliably.**  
    Includes dropped later `ACTION`, unsupported `add|modify|delete|rename` aliases, and basename-only rename matching.  
    Sources: `audit-QA2-C04-file-extractor.md`, `audit-QA4-C07-integration.md`
16. **Spec-folder markdown table parsers can stitch malformed rows into invented file/requirement metadata.**  
    Sources: `audit-QA4-C05-spec-folder-extractor.md`
17. **Spec-folder decisions lose `chosen` and `rationale` during integration into `_manualDecisions`.**  
    Sources: `audit-QA4-C07-integration.md`
18. **OpenCode exchange reconstruction is unreliable.**  
    Includes nondeterministic prompt matching, first-chunk assistant capture, fragile timestamp parsing, and destructive truncation.  
    Sources: `audit-QA6-C08-opencode-capture.md`, `audit-QA9-C16-test-coverage.md`
19. **Session-extractor tool accounting is inaccurate and its git channel probe can block indefinitely.**  
    Includes undercounting modern tools, overcounting tool syntax in prompt text, and missing `execSync` timeout.  
    Sources: `audit-QA6-C09-session-extractor.md`, `audit-QA9-C14-execsync-security.md`, `audit-QA9-C16-test-coverage.md`
20. **Decision extraction is not robust to sparse/malformed arrays and cannot produce stable anchor IDs across runs.**  
    Sources: `audit-QA6-C10-decision-extractor.md`, `audit-QA9-C16-test-coverage.md`
21. **Config loading can leave `learningWeights` partially undefined and produce `NaN` in downstream calculations.**  
    Sources: `audit-QA7-C11-config-filewriter.md`
22. **Concurrent file writers can race and restore stale backups over successful writes.**  
    Sources: `audit-QA7-C11-config-filewriter.md`
23. **The contamination filter is denylist-based and easy to bypass, so orchestration chatter still leaks into summaries.**  
    Sources: `audit-QA7-C12-contamination-types.md`, `audit-QA9-C16-test-coverage.md`
24. **`SessionData` no longer matches the real runtime object shape, and the index signature hides the drift.**  
    Sources: `audit-QA7-C12-contamination-types.md`
25. **Spec-folder path handling still lacks project-root confinement.**  
    Includes trusted `specFolderPath` reads, symlinked specs-root acceptance, and `../../` escapes from `normalizeFilePath()`.  
    Sources: `audit-QA9-C15-fs-security.md`, `audit-QA9-C16-test-coverage.md`

### P2
26. **Workflow logging/default handling hides diagnostics or misreads intentional zero values.**  
    Includes direct `console.warn`, silent `description.json` update failures, and `warnThreshold || 20`.  
    Sources: `audit-QA2-C01-workflow.md`, `audit-QA9-C13-null-safety.md`
27. **`collect-session-data.ts` fabricates recency and summary defaults when source data is missing.**  
    Sources: `audit-QA2-C02-collect-session-data.md`
28. **`input-normalizer.ts` still needs stronger narrowing for untrusted JSON branches.**  
    Sources: `audit-QA2-C03-input-normalizer.md`
29. **Defense-in-depth hardening is still missing for helper APIs.**  
    Includes internal containment checks in `readDoc()` and argv-based git execution (`execFileSync`) instead of shell strings.  
    Sources: `audit-QA4-C05-spec-folder-extractor.md`, `audit-QA4-C06-git-context-extractor.md`, `audit-QA9-C14-execsync-security.md`
30. **Filesystem error handling still downgrades unexpected failures too aggressively, including symlink-dereferencing backups.**  
    Sources: `audit-QA7-C11-config-filewriter.md`, `audit-QA9-C15-fs-security.md`
31. **Secondary regression coverage is still missing for config loading, contamination-filter boundary cases, SessionData shape locking, and the `loadDataFn` stateless-mode edge.**  
    Sources: `audit-QA7-C12-contamination-types.md`, `audit-QA9-C16-test-coverage.md`, `audit-QA9-C17-regression.md`

## Systemic Patterns
1. **Contamination boundaries are still porous.**  
   The strongest recurring theme is cross-spec contamination risk: git enrichment after guard (`C01`), prompt leakage in normalization (`C03`), denylist-only contamination filtering (`C12`), parser-invented spec metadata (`C05`), and path escape surfaces in spec-folder handling (`C15`).

2. **Identity/schema drift is destabilizing the stateless pipeline.**  
   Multiple audits show producer/consumer mismatch: nested spec paths used as identity (`C02`), snake_case capture metadata dropped (`C03`), `SessionData` drift (`C12`), and unstable decision anchors (`C10`).

3. **The file-writer path is the highest operational risk area.**  
   It combines non-atomic batch writes (`C11`), concurrent writer races (`C11`), symlink/TOCTOU exposures (`C15`), and missing direct runtime tests (`C16`).

4. **Extractor robustness against malformed/sparse input is uneven.**  
   This shows up in table row stitching (`C05`), prompt matching/timestamp parsing/truncation (`C08`), null-array handling in decision extraction (`C10`), and over-broad empty-result fallback in git extraction (`C06`).

5. **Test coverage is concentrated away from the riskiest guardrails.**  
   Coverage is strongest around workflow/task-enrichment happy paths, but the critical safety controls and low-level extractors called out in `C16` remain largely unverified.

## Per-File Scores
_Lower score = weaker audit outcome / higher concern._

| Score | Audit file | Notes |
| ---: | --- | --- |
| 24 | `audit-QA9-C15-fs-security.md` | Worst score; concentrated filesystem and confinement risk |
| 31 | `audit-QA9-C16-test-coverage.md` | Broad missing coverage on critical guardrails |
| 46 | `audit-QA2-C03-input-normalizer.md` | Multiple P0 contamination/schema issues |
| 58 | `audit-QA6-C08-opencode-capture.md` | Exchange reconstruction reliability issues |
| 68 | `audit-QA2-C04-file-extractor.md` | ACTION/rename semantics drift |
| 71 | `audit-QA7-C11-config-filewriter.md` | Atomicity, config safety, and concurrency issues |
| 72 | `audit-QA2-C01-workflow.md` | Contamination regression and observability gaps |
| 72 | `audit-QA2-C02-collect-session-data.md` | Identity corruption and default-safety issues |
| 72 | `audit-QA4-C06-git-context-extractor.md` | Silent fallback / unborn-HEAD handling gaps |
| 74 | `audit-QA7-C12-contamination-types.md` | Bypassable contamination filter and schema drift |
| 80 | `audit-QA6-C10-decision-extractor.md` | Null-safety and anchor determinism issues |
| 84 | `audit-QA6-C09-session-extractor.md` | Tool-counting accuracy issues |
| 84 | `audit-QA9-C13-null-safety.md` | Duplicates confirm null/default handling bugs |
| 88 | `audit-QA4-C05-spec-folder-extractor.md` | Limited but real malformed-row parsing issues |
| 88 | `audit-QA9-C14-execsync-security.md` | Mostly defense-in-depth / timeout concerns |
| 91 | `audit-QA4-C07-integration.md` | Generally sound integration; one meaningful shape-loss bug |
| 95 | `audit-QA9-C17-regression.md` | Best score; one edge-case regression note only |

## Bottom Line
- **Immediate remediation priority:** harden `file-writer.ts`, close post-guard contamination paths, and fix spec identity normalization.
- **Confidence note:** the cross-cutting audits strongly reinforce the same risk areas rather than contradicting each other; the duplication is mostly corroborative, not conflicting.
