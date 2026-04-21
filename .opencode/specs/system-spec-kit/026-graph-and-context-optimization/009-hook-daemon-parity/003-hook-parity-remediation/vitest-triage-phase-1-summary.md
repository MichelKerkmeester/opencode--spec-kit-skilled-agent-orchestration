# Vitest Triage Phase 1 Summary

Date: 2026-04-21

Scope: 47 failing tests across 30 failing files from `/tmp/vitest-full-clean.log` and `/tmp/vitest-failures.txt`.

## Group A: Stale Or Deleted Fixtures

| Finding ID | File:line | Failing test name | Root cause hypothesis | Proposed fix category |
| --- | --- | --- | --- | --- |
| A-001 | `mcp_server/tests/transcript-planner-export.vitest.ts:147` | exports planner outputs and fallback summaries for packet 015 transcript prototypes | Test reads `.opencode/specs/.../015-save-flow-planner-first-trim/scratch/transcript-*.md`, but that historical packet fixture is deleted in the working tree. | Convert to self-contained fixture or skip obsolete historical packet dependency. |
| A-002 | `scripts/tests/memory-learn-command-docs.vitest.ts:24` | keeps active command and workspace docs aligned to the constitutional manager wording | Test reads `.opencode/command/spec_kit/debug.md`, which no longer exists in the active command layout. | Update test to current command docs or remove stale path assertion. |

## Group B: Post-027/028 Architecture Drift

| Finding ID | File:line | Failing test name | Root cause hypothesis | Proposed fix category |
| --- | --- | --- | --- | --- |
| B-001 | `mcp_server/tests/context-server.vitest.ts:334` | T17: All expected tools dispatched via modules | New `code_graph_*` and `ccc_*` tools are registered but dispatch regex expectations lag behind the modular dispatch surface. | Update dispatch coverage expectations or production dispatch wiring if genuinely missing. |
| B-002 | `mcp_server/tests/context-server.vitest.ts:354` | T18: Tool `code_graph_scan` uses parseArgs<T> | Code graph tool wrappers do not match the legacy `parseArgs<T>` regex contract. | Align wrappers with current parse contract or update test for delegated validators. |
| B-003 | `mcp_server/tests/context-server.vitest.ts:354` | T18: Tool `code_graph_query` uses parseArgs<T> | Same as B-002 for query wrapper. | Same as B-002. |
| B-004 | `mcp_server/tests/context-server.vitest.ts:354` | T18: Tool `code_graph_status` uses parseArgs<T> | Same as B-002 for status wrapper. | Same as B-002. |
| B-005 | `mcp_server/tests/context-server.vitest.ts:354` | T18: Tool `code_graph_context` uses parseArgs<T> | Same as B-002 for context wrapper. | Same as B-002. |
| B-006 | `mcp_server/tests/context-server.vitest.ts:354` | T18: Tool `ccc_status` uses parseArgs<T> | CocoIndex compatibility tool wrapper does not match the legacy parser regex. | Align wrapper or update parser contract test. |
| B-007 | `mcp_server/tests/context-server.vitest.ts:354` | T18: Tool `ccc_reindex` uses parseArgs<T> | Same as B-006 for reindex wrapper. | Same as B-006. |
| B-008 | `mcp_server/tests/context-server.vitest.ts:354` | T18: Tool `ccc_feedback` uses parseArgs<T> | Same as B-006 for feedback wrapper. | Same as B-006. |
| B-009 | `mcp_server/tests/graph-payload-validator.vitest.ts:98` | emits separate trust axes on code-graph payloads | Test mock for `code-graph-db.js` lacks newly required `resolveSubjectFilePath` export. | Update mock fixture to include the new export and keep trust assertions. |
| B-010 | `mcp_server/tests/graph-payload-validator.vitest.ts:138` | fails closed when query emission validation rejects the trust payload | Same mock export gap masks the intended trust validation failure. | Same as B-009. |
| B-011 | `mcp_server/tests/integration-138-pipeline.vitest.ts:321` | all 7 intent profiles include graphWeight and graphCausalBias | `INTENT_WEIGHT_PROFILES` now has 8 intents after architecture changes. | Update expected intent count if new intent is intentional. |
| B-012 | `mcp_server/tests/layer-definitions.vitest.ts:153` | every registered tool has a layer definition | New advisor tools are registered but missing from `TOOL_LAYER_MAP`. | Add advisor tools to layer map if public tool surface is intentional. |
| B-013 | `mcp_server/tests/layer-definitions.vitest.ts:173` | tool definition prefixes stay aligned with TOOL_LAYER_MAP | Advisor tool descriptions carry `L8` prefixes while the layer model still has only L1-L7. | Add or normalize mapping for advisor tools. |
| B-014 | `mcp_server/tests/review-fixes.vitest.ts:113` | total tool count matches expected | Registered tool count is now 50, but regression test expects 47. | Update expected count if new advisor tools are intentional. |
| B-015 | `mcp_server/tests/deep-loop/prompt-pack.vitest.ts:103` | both production templates load and render successfully with the expected bound variables | Production prompt template gained `{state_paths_delta_pattern}` but test bindings omit it. | Add missing binding to the test fixture. |
| B-016 | `scripts/tests/deep-review-reducer-schema.vitest.ts:64` | wires reducer refresh and machine-owned report guidance into both review workflows | Workflow/reference docs use artifact-dir resolver wording instead of older literal `{spec_folder}/review/deep-review-state.jsonl` string. | Update contract test to current resolver-aware wording, unless literal path is still required. |
| B-017 | `scripts/tests/deep-review-reducer-schema.vitest.ts:110` | documents reducer metrics and machine-owned report boundaries in the review references | Reference docs no longer contain expected reducer metric field names verbatim. | Update docs or expectations to current reducer contract. |
| B-018 | `scripts/tests/search-archival.vitest.ts:32` | T206-MC2: multiConceptSearch accepts includeArchived | Deprecated archival compatibility expectations conflict with newer cleanup tests in the same file. | Remove or update obsolete T206 expectations. |
| B-019 | `scripts/tests/search-archival.vitest.ts:49` | T206-KW2: keywordSearch accepts includeArchived | Same conflict as B-018; later T235 asserts keyword search does not accept includeArchived. | Remove or update obsolete T206 expectation. |

## Group C: Behavior Regressions Or Broken Assertions

| Finding ID | File:line | Failing test name | Root cause hypothesis | Proposed fix category |
| --- | --- | --- | --- | --- |
| C-001 | `scripts/tests/progressive-validation.vitest.ts:709` | T-PB2-07a: --level 4 output contains pipeline summary section | Full validation pipeline stalls or times out at level 4 on the fixture. | Investigate validation performance/fixture state; prefer production fix if timeout is real. |
| C-002 | `scripts/tests/progressive-validation.vitest.ts:758` | T-PB2-07e: --level 4 is the default | Default level 4 path times out against same fixture class. | Same as C-001. |
| C-003 | `scripts/tests/progressive-validation.vitest.ts:869` | T-PB2-09a: exit 0 for a passing spec | Passing fixture exits non-zero or times out in full pipeline. | Investigate validation output and fixture validity. |
| C-004 | `mcp_server/tests/progressive-validation.vitest.ts:661` | exit codes are consistent between levels | Level comparison no longer returns consistent exit codes for generated fixtures. | Investigate progressive validation script behavior. |
| C-005 | `mcp_server/tests/progressive-validation.vitest.ts:867` | level 3 runs detect, auto-fix, and suggest | Level 3 path times out on fixture. | Same as C-004. |
| C-006 | `mcp_server/tests/progressive-validation.vitest.ts:884` | level 4 is the default when no --level specified | Default level 4 path times out on fixture. | Same as C-004. |
| C-007 | `scripts/tests/test-integration.vitest.ts:128` | returns structured diagnostics for valid and invalid spec-folder states | Integration validation test times out at 30s. | Investigate validation command runtime and fixture setup. |
| C-008 | `mcp_server/tests/cli.vitest.ts:118` | bulk-delete removes matching tier and creates pre-delete checkpoint | Test seeds `memory_index` before initializing/migrating the test database schema. | Fix test setup or CLI init path to create schema before seed. |
| C-009 | `scripts/tests/task-enrichment.vitest.ts:1322` | rejects malformed rendered memories before write when the template contract is violated | Mocked `../spec-folder` module lacks newly imported `ensureSpecFolderExists`, masking intended quality gate assertion. | Update mock to include export. |
| C-010 | `scripts/tests/continuity-freshness.vitest.ts:172` | wires stale continuity into validate.sh strict mode as a warning failure | `validate.sh --strict` no longer promotes continuity freshness warning to exit 2. | Fix strict-mode warning promotion or update test if policy changed. |
| C-011 | `mcp_server/tests/memory-save-ux-regressions.vitest.ts:466` | keeps metadata-only planner guidance readable and continuity-focused | Planner now returns `blocked` for fixture that should be plan-only routable. | Investigate planner input requirements and route-target validation. |
| C-012 | `mcp_server/tests/gate-d-resume-perf.vitest.ts:91` | measures session-resume happy path using the canonical 3-level ladder | Session resume returns memory source `none` instead of `handover`. | Fix ladder fixture/source detection or update expectation if handover is no longer first source. |
| C-013 | `scripts/tests/session-cached-consumer.vitest.ts.test.ts:209` | matches the frozen corpus outcomes for stale, scope mismatch, fidelity failure, and valid reuse | Reason code changed from `schema_version_mismatch` to `schema_mismatch`. | Update frozen corpus if rename is intentional; otherwise restore old reason code. |
| C-014 | `mcp_server/tests/memory-save-integration.vitest.ts:526` | T511 planner-default and explicit full-auto agree on narrative-progress target | Planner returns `blocked` for force-enabled route. | Same root as C-011. |
| C-015 | `mcp_server/tests/memory-save-integration.vitest.ts:584` | T512 planner-default and explicit full-auto keep metadata-only continuity targeting identical | Planner returns `blocked` for metadata-only route. | Same root as C-011. |
| C-016 | `scripts/tests/memory-quality-phase2-pr3.test.ts:88` | keeps both serialized importance_tier locations aligned after managed-frontmatter rewrite | Frontmatter tier resolves to `normal` while metadata tier/session tier expect `important`. | Fix managed frontmatter rewrite to preserve/respect resolved tier. |
| C-017 | `scripts/tests/memory-quality-phase2-pr3.test.ts:157` | keeps the F-AC1 truncation fixture on a single resolved tier after Phase 2 lands | Same tier drift as C-016 on real workflow fixture. | Same as C-016. |
| C-018 | `scripts/tests/post-save-review.vitest.ts:59` | detects title mismatch and missing trigger phrases as HIGH issues | Post-save review still reports issues but no HIGH severity issue. | Restore HIGH classification for title/trigger phrase quality blockers or update severity policy. |
| C-019 | `scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:33` | filters prose-derived bigram noise without exposing a legacy context filename | Trigger phrase sanitizer/workflow now emits a stale prose-derived bigram or legacy filename. | Inspect rendered output and adjust sanitizer or expectation. |
| C-020 | `scripts/tests/quality-scorer-disambiguation.vitest.ts:42` | labels the low-quality warning note with input_completeness_score | Workflow warning text still uses old/generic score label. | Update warning label to `input_completeness_score`. |
| C-021 | `mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts:131` | keeps the 3-level happy-path resume ladder under the Gate D latency budget | Same `session_resume` source issue as C-012, possibly also perf-sensitive. | Same as C-012 plus preserve benchmark budget. |
| C-022 | `mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts:127` | keeps >0.96 in high-similarity note tier and preserves review-band recommendations | Reconsolidation thresholds/recommendation band drifted. | Investigate scoring change and update code or test. |
| C-023 | `mcp_server/tests/context-server-error-envelope.vitest.ts:7` | buildErrorResponse produces a structured error object with data.error and hints | Error envelope shape changed from test expectation. | Restore structured `data.error`/`hints` contract or update consumer test. |

## Group D: Theme 7 Dual-Runtime / Runtime Surface Drift

| Finding ID | File:line | Failing test name | Root cause hypothesis | Proposed fix category |
| --- | --- | --- | --- | --- |
| D-001 | `mcp_server/tests/stdio-logging-safety.vitest.ts:77` | uses stderr-safe logging in runtime sources | Newly added Codex hooks and advisor bench files use `console.log`/stdout in runtime-scanned sources. | Move runtime diagnostics to stderr or narrow test allowlist for benchmark CLIs if appropriate. |

## Group E: Codex Layout Or Policy Updates

| Finding ID | File:line | Failing test name | Root cause hypothesis | Proposed fix category |
| --- | --- | --- | --- | --- |
| E-001 | `mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts:220` | failOpenTimeout.json produces identical visible brief text across Claude, Gemini, Copilot, Codex, and plugin | Fail-open brief differs for one of the runtime/plugin renderers after Codex/plugin layout changes. | Normalize fail-open visible brief rendering across runtimes. |

## Group F: Other

| Finding ID | File:line | Failing test name | Root cause hypothesis | Proposed fix category |
| --- | --- | --- | --- | --- |
| F-001 | `mcp_server/tests/context-server.vitest.ts:1239` | T000b callbacks are triggered after dispatchTool and non-blocking | Source regex expects a specific dispatch/callback sequence that changed during refactor. | Update code shape if contract matters, otherwise make test assert behavior instead of exact regex. |
| F-002 | `scripts/tests/template-structure.vitest.ts:36` | suite import failure | `scripts/utils/template-structure.js` uses CommonJS `require` while `scripts/package.json` marks `.js` as ESM. | Convert helper to ESM or rename to `.cjs` with imports updated. |
