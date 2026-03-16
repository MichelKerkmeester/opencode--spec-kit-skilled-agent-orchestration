# QA10-C19: Prioritized Test Recommendations

## Scope
This plan converts the P0/P1 audit findings from:
- `audit-QA9-C16-test-coverage.md`
- `audit-QA10-O18-opus-synthesis.md`

into a concrete, prioritized test backlog. Priority ordering is **security > data integrity > correctness > quality**, with grouping by target module/file.

## Priority legend
- **Security**: prevents path traversal, cross-spec contamination, or unsafe writes
- **Data integrity**: prevents silent loss/corruption of captured or enriched data
- **Correctness**: keeps parsing, extraction, and derived outputs behaviorally correct
- **Quality**: enforces contracts, determinism, and maintainability

## Traceability matrix (every P0/P1 finding mapped)

> `QA9-*` IDs below are local labels for the ten P0/P1 coverage gaps called out in the QA9 audit.

| Finding ID | Priority class | Module/file | Recommended test case |
|---|---|---|---|
| QA9-P0-1 -- untested stateless alignment abort branch | Security | `core/workflow.ts` | `TC-WF-01` |
| QA9-P0-2 -- untested spec-root/path guard + related-doc fallback | Security | `extractors/collect-session-data.ts` | `TC-CS-01` |
| QA9-P0-3 -- untested atomic writer safety paths | Security | `core/file-writer.ts` | `TC-FW-01` |
| QA9-P0-4 -- untested input validation/manual normalization/relevance filtering | Data integrity | `utils/input-normalizer.ts` | `TC-IN-01` |
| QA9-P1-1 -- untested JSON/JSONL parsing + malformed-line/session discovery/tool extraction | Data integrity | `extractors/opencode-capture.ts` | `TC-OC-02`, `TC-OC-03` |
| QA9-P1-2 -- untested branch detection/classification/next-action extraction | Correctness | `extractors/session-extractor.ts` | `TC-SE-01` |
| QA9-P1-3 -- untested lexical fallback/option parsing/confidence/evidence extraction | Correctness | `extractors/decision-extractor.ts` | `TC-DE-01`, `TC-DE-02` |
| QA9-P1-4 -- untested path normalization/provenance merging/basename ambiguity/dedup | Data integrity | `extractors/file-extractor.ts` | `TC-FE-01`, `TC-FE-02` |
| QA9-P1-5 -- untested frontmatter/schema/progress/session-phase mining | Data integrity | `extractors/spec-folder-extractor.ts` | `TC-SF-01`, `TC-SF-02` |
| QA9-P1-6 -- untested porcelain parsing/rename handling/outside-worktree fallback/top-file ranking | Security | `extractors/git-context-extractor.ts` | `TC-GE-01`, `TC-GE-02` |
| O08-P0-1 | Data integrity | `extractors/opencode-capture.ts` + `utils/input-normalizer.ts` | `TC-OC-01` |
| O02-P1-01 | Data integrity | `extractors/collect-session-data.ts` | `TC-CS-02` |
| O02-P1-02 | Quality | `extractors/collect-session-data.ts` | `TC-CS-03` |
| O02-P1-03 | Quality | `extractors/collect-session-data.ts` | `TC-CS-03` |
| O03-P1-01 | Data integrity | `utils/input-normalizer.ts` | `TC-IN-01` |
| O03-P1-02 | Data integrity | `utils/input-normalizer.ts` | `TC-IN-01` |
| O03-P1-03 | Correctness | `utils/input-normalizer.ts` | `TC-IN-01` |
| O04-P1-1 | Data integrity | `extractors/file-extractor.ts` + `file-helpers.ts` | `TC-FE-01` |
| O05-P1-1 | Data integrity | `extractors/spec-folder-extractor.ts` | `TC-SF-02` |
| O05-P1-2 | Data integrity | `extractors/spec-folder-extractor.ts` | `TC-SF-01` |
| O06-P1-1 | Correctness | `extractors/git-context-extractor.ts` | `TC-GE-02` |
| O08-P1-1 | Data integrity | `extractors/opencode-capture.ts` | `TC-OC-02` |
| O08-P1-2 | Data integrity | `extractors/opencode-capture.ts` | `TC-OC-03` |
| O08-P1-3 | Correctness | `extractors/opencode-capture.ts` | `TC-OC-03` |
| O08-P1-4 | Quality | `extractors/opencode-capture.ts` | `TC-OC-04` |
| O08-P1-5 | Quality | `extractors/opencode-capture.ts` | `TC-OC-04` |
| O09-P1-01 | Correctness | `extractors/session-extractor.ts` | `TC-SE-01` |
| O10-P1-01 | Correctness | `extractors/decision-extractor.ts` | `TC-DE-01` |
| O10-P1-02 | Correctness | `extractors/decision-extractor.ts` | `TC-DE-01` |
| O10-P1-03 | Quality | `anchor-generator.ts` + `extractors/decision-extractor.ts` | `TC-DE-02` |
| O10-P1-04 | Correctness | `extractors/decision-extractor.ts` | `TC-DE-02` |
| O10-P1-05 | Quality | `extractors/decision-extractor.ts` | `TC-DE-01` |
| O11-P1-1 | Quality | `core/config.ts` | `TC-CFG-01` |
| O11-P1-2 | Correctness | `core/config.ts` | `TC-CFG-01` |
| O12-P1-01 / O14-F01 | Quality | `types/session-types.ts` + `collect-session-data.ts` | `TC-TY-01` |
| O12-P1-02 | Quality | `extractors/session-extractor.ts` | `TC-TY-02` |
| O13-F03 | Correctness | `core/workflow.ts` | `TC-WF-02` |
| O14-F02 | Quality | `extractors/session-extractor.ts` + `extractors/file-extractor.ts` | `TC-TY-02` |
| O14-F03 | Quality | multiple file-reference producers | `TC-TY-02` |
| O16-P1-01 | Data integrity | `extractors/file-extractor.ts` | `TC-FE-02` |
| O16-P1-02 | Data integrity | `extractors/file-extractor.ts` | `TC-FE-02` |
| O17-P1-1+2 | Security | `core/workflow.ts` + `extractors/git-context-extractor.ts` | `TC-WF-03` |
| O17-P1-3 | Security | `extractors/git-context-extractor.ts` | `TC-GE-01` |
| O01-F01 | Correctness | `core/workflow.ts` | `TC-WF-01` |
| O01-F02 | Quality | `core/workflow.ts` | `TC-WF-04` |
| O01-F03 | Quality | `core/workflow.ts` | `TC-WF-04` |
| O01-F04 | Quality | `core/workflow.ts` + `collect-session-data.ts` | `TC-CS-03`, `TC-WF-04` |

## Prioritized test backlog by module/file

### 1. `core/file-writer.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-FW-01` | Security | M | Exercise the high-risk write-safety matrix in one runtime suite: reject traversal filenames, reject duplicate normalized targets, roll back already-written files on mid-batch failure, and allow overwrite recovery only for intended paths. | Temporary output dir; file set containing `../escape.md`, duplicate logical filenames, and a mocked second write that throws after the first succeeds. | Writer throws explicit errors for traversal/duplicate cases; partial files are removed on failure; safe overwrite path leaves final contents consistent. | QA9-P0-3 |

### 2. `extractors/collect-session-data.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-CS-01` | Security | M | Verify `SPEC_FOLDER` and related-doc loading stay inside the intended spec root, including warning/fallback behavior when related docs are unreadable or missing. | Stateless fixture with valid spec root, `../../outside-spec` escape attempt, and one unreadable related doc stub. | Escape path is rejected, only in-root related docs are read, and unreadable docs emit warning/fallback instead of silent cross-root reads. | QA9-P0-2 |
| `TC-CS-02` | Data integrity | S | Lock the learning-index formula so `deltaUncertainty` and `deltaContext` use the correct configured weights. | Fixed `preflight/postflight` fixture with known deltas and non-symmetric weights. | Computed `LEARNING_INDEX` matches `(knowledge*0.4) + (context*0.35) + (uncertainty*0.25)` ordering exactly. | O02-P1-01 |
| `TC-CS-03` | Quality | S | Document and enforce mutation/shape behavior: either caller-owned input remains untouched or the mutation contract is explicit and stable, with typed `sessionInfo` fields preserved in the output. | Shared `collectedData` object reused across assertions plus typed `sessionInfo` fixture containing branch/phase/action fields. | Test proves the intended contract (clone vs mutate) and verifies the returned object exposes stable, named session info fields instead of opaque `{}`/`unknown`. | O02-P1-02, O02-P1-03, O01-F04 |

### 3. `core/workflow.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-WF-01` | Security | M | Hit the stateless alignment guard after enrichment and assert the workflow aborts before any save when the active session and target spec diverge. Include a matrix for `_source`/`isStatelessMode` combinations. | Enriched stateless fixture whose original capture belongs to spec A while output target is spec B; variants for `_source` and `isStatelessMode`. | Workflow throws/returns the alignment failure, performs no write, and applies a single consistent stateless-mode gate. | QA9-P0-1, O01-F01 |
| `TC-WF-02` | Correctness | S | Ensure `_manualTriggerPhrases` are merged into the final trigger extraction pipeline with deduplication and casing normalization. | `collectedData` fixture with generated triggers plus manual phrases containing case variants and one unique trigger. | Final trigger set contains the unique manual phrase once, lowercased/deduped with existing phrases. | O13-F03 |
| `TC-WF-03` | Security | M | Verify contamination filtering reaches enriched git/spec-derived text, not only raw user prompts. | Fixture containing raw prompts plus git commit subjects, enriched observations, and summary strings with contamination phrases such as "I'll implement" and "Let me analyze". | Filtered output removes/rewrites contamination phrases across all enriched text channels that are rendered into memory output. | O17-P1-1+2 |
| `TC-WF-04` | Quality | S | Add a narrow workflow smoke/contract test around collector wiring so unreachable null branches and `TOOL_COUNT` unsafe casts cannot regress silently. | Minimal stateless run fixture with known tool-count fields and non-null session-data producer. | Workflow completes through the intended path, preserves numeric tool counts, and never depends on an impossible null branch. | O01-F02, O01-F03 |

### 4. `utils/input-normalizer.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-IN-01` | Data integrity | M | Build a table-driven normalization suite covering malformed JSON rejection, manual-format normalization, `SPEC_FOLDER` alias preservation, epoch-seconds conversion, and short-but-valid relevance segments. | Cases: malformed JSON, manual capture object, uppercase `SPEC_FOLDER`, timestamp `1709913600`, short keywords like `ui`, `qa`, `git`, and mixed relevant/irrelevant tool paths. | Malformed input is rejected explicitly; manual format normalizes to canonical output; `SPEC_FOLDER` survives normalization; epoch-seconds become correct ISO dates; legitimate short relevance tokens are retained while unrelated items are filtered out. | QA9-P0-4, O03-P1-01, O03-P1-02, O03-P1-03 |

### 5. `extractors/opencode-capture.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-OC-01` | Data integrity | S | Lock the capture-field naming contract between `ConversationCapture` and normalized consumer data so session metadata cannot drop silently. | Capture fixture containing `sessionTitle`, `sessionId`, `capturedAt` equivalents in both camelCase and snake_case forms. | Consumer-visible normalized object exposes non-undefined title/id/captured-at fields and rejects/flags incompatible naming if mapping is missing. | O08-P0-1 |
| `TC-OC-02` | Data integrity | M | Cover JSON/JSONL parsing, malformed-line skipping, session discovery, tool/file extraction, and project-id resolution across multiple session files instead of only the first file. | Mixed JSONL fixture with valid sessions, malformed lines, two session files with project markers only in the second file, and tool/file events. | Parser keeps valid sessions, skips malformed lines with diagnostics, discovers sessions/tools/files correctly, and resolves project id by scanning all relevant session files. | QA9-P1-1, O08-P1-1 |
| `TC-OC-03` | Data integrity | M | Verify exchange pairing is deterministic when timestamps are missing or duplicated and that unmatched prompts are not greedily reused. | Prompt/response fixture with missing timestamps, duplicate timestamps, and overlapping candidate replies. | No `NaN` propagation; matcher pairs prompts/responses deterministically; once a response is consumed it is not reused for a later prompt. | O08-P1-2, O08-P1-3 |
| `TC-OC-04` | Quality | M | Force partial read errors in `readJsonlTail` and assert resource cleanup; add a regression that bans sync I/O in the async path. | Mocked file handle whose read throws mid-stream plus spies for sync fs APIs. | File handle is always closed on error, error surfaces cleanly, and async code path does not call sync fs primitives. | O08-P1-4, O08-P1-5 |

### 6. `extractors/git-context-extractor.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-GE-01` | Security | M | Add a spec-folder scoping regression for git enrichment, including outside-worktree fallback. | Mocked `git status`/`git log` output containing files from target spec, unrelated specs, and non-spec project files; second case throws outside-worktree error. | Only paths matching the active spec are retained; unrelated repo changes are ignored; outside-worktree case returns safe fallback instead of leaked/global data. | O17-P1-3, QA9-P1-6 |
| `TC-GE-02` | Correctness | S | Cover porcelain/stat parsing edge cases: brace-wrapped renames, commit summarization, and stable ranking of top files. | Git status lines with rename syntax like `src/{old => new}/file.ts`, commit log fixture, and mixed file frequencies. | Rename paths are normalized without braces artifacts, commit summaries remain readable, and top-file ranking is deterministic. | O06-P1-1, QA9-P1-6 |

### 7. `extractors/file-extractor.ts` (+ `file-helpers.ts`)

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-FE-01` | Data integrity | M | Verify file dedup uses a collision-safe key while preserving basename ambiguity context and normalized paths. | Two >60-char paths that truncate to the same display form, plus matching basename collisions from different folders. | Extractor keeps both files as distinct records, uses full normalized path for dedup, and surfaces enough context to disambiguate similar basenames. | QA9-P1-4, O04-P1-1 |
| `TC-FE-02` | Data integrity | M | Preserve provenance markers through semantic enhancement and observation-anchor building. | File and observation fixtures tagged with `_provenance`/`_synthetic`, including one semantic-description match path. | Returned files/observations retain provenance metadata after enrichment and anchor generation. | QA9-P1-4, O16-P1-01, O16-P1-02 |

### 8. `extractors/spec-folder-extractor.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-SF-01` | Data integrity | M | Parse frontmatter and description metadata across both supported schemas, including YAML list items following scalar strings. | Spec doc fixture with mixed frontmatter (`title: value` followed by list items) plus both new and legacy `description.json` shapes. | Scalar values remain intact, list items parse separately, and both description schemas normalize to the same internal representation. | QA9-P1-5, O05-P1-2 |
| `TC-SF-02` | Data integrity | M | Ensure observation capping does not erase checklist/progress/session-phase signals. | Large spec-folder fixture with many observations plus checklist/task progress and clear session-phase indicators. | Progress/checklist summaries and derived session phase survive even when observation count is capped. | QA9-P1-5, O05-P1-1 |

### 9. `extractors/session-extractor.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-SE-01` | Correctness | M | Cover branch detection success/failure, detached-head fallback, project-phase classification, next-action/blocker extraction, and negative-duration guarding. | Mocked `git` responses for normal branch, detached head, and failing `execSync`; transcript fixture with explicit next steps/blockers and reversed timestamps. | Extractor returns stable branch metadata/fallbacks, classifies phase consistently, extracts next actions/blockers, and clamps or rejects negative duration instead of returning invalid values. | QA9-P1-2, O09-P1-01 |

### 10. `extractors/decision-extractor.ts` (+ `anchor-generator.ts`)

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-DE-01` | Correctness | M | Table-driven decision extraction suite for lexical fallback, option parsing, evidence/follow-up harvesting, confidence clamping, and parity between manual/MCP confidence paths. | Transcript fixtures containing manual decisions, MCP-backed decisions, high-confidence regex hits, and explicit options/evidence/follow-ups. | Extractor finds the same decision semantics across both paths, clamps confidence to valid range, and emits parsed options/evidence/follow-ups consistently. | QA9-P1-3, O10-P1-01, O10-P1-02, O10-P1-05 |
| `TC-DE-02` | Quality | S | Make anchor generation deterministic and non-empty for both direct and post-processed/MCP decision paths. | Repeated identical decision fixtures run twice plus an MCP-path fixture that previously needed post-processing. | Same input produces the same anchor id across runs, and MCP-path decisions never expose empty anchor ids. | QA9-P1-3, O10-P1-03, O10-P1-04 |

### 11. `core/config.ts`

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-CFG-01` | Quality | S | Validate nested `learningWeights` and ensure JSON/JSONC brace parsing ignores braces inside strings. | Config fixture with malformed `learningWeights`, valid nested values, and string literals containing `{}` characters. | Invalid nested weights are rejected explicitly; valid configs load; brace characters inside strings do not break parsing. | O11-P1-1, O11-P1-2 |

### 12. Type-contract tests (`types/session-types.ts`, `extractors/session-extractor.ts`, `extractors/file-extractor.ts`)

| Test ID | Priority | Effort | Description | Input fixture | Expected behavior | Covers |
|---|---|---:|---|---|---|---|
| `TC-TY-01` | Quality | M | Add compile-time or shape-lock assertions that `SessionData` exposes every runtime field added by spread sources and does not hide them behind `unknown`. | Type-only fixture or `expectTypeOf` assertions against the concrete `collectSessionData()` return shape. | All spread-derived fields are named and typed; contract fails fast if hidden runtime fields reappear. | O12-P1-01, O14-F01 |
| `TC-TY-02` | Quality | M | Add contract tests that unify `ToolCounts`, `ObservationInput`, and file-reference shapes across producers/consumers. | Shared fixtures for tool counts, observations, and file references consumed by session/file extractors. | Missing required count keys or incompatible observation/file shapes fail the contract immediately instead of slipping through index signatures. | O12-P1-02, O14-F02, O14-F03 |

## Recommended execution order

### Wave 1 -- Must add first
1. `TC-FW-01`
2. `TC-WF-01`
3. `TC-CS-01`
4. `TC-GE-01`
5. `TC-WF-03`
6. `TC-OC-01`
7. `TC-IN-01`

### Wave 2 -- Silent data-loss / corruption guards
8. `TC-OC-02`
9. `TC-OC-03`
10. `TC-CS-02`
11. `TC-FE-01`
12. `TC-FE-02`
13. `TC-SF-01`
14. `TC-SF-02`

### Wave 3 -- Behavioral correctness
15. `TC-SE-01`
16. `TC-DE-01`
17. `TC-DE-02`
18. `TC-GE-02`
19. `TC-WF-02`

### Wave 4 -- Contract/maintenance hardening
20. `TC-CFG-01`
21. `TC-TY-01`
22. `TC-TY-02`
23. `TC-CS-03`
24. `TC-WF-04`
25. `TC-OC-04`

## Short conclusion
- The highest-value gaps are the **write-safety**, **cross-spec leakage**, **alignment guard**, and **capture normalization** tests because they directly protect security boundaries and silent data loss.
- After those land, the next biggest return comes from **parsing/dedup/provenance** regressions, which protect the integrity of saved memory artifacts.
- Type-contract and maintenance tests are still worth adding, but they should follow the boundary and data-integrity suites above.
