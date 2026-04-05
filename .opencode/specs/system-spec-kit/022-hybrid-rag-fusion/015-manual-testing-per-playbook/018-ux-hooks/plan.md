---
title: "Implementation Plan [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/018-ux-hooks/plan]"
description: "Phase 018 defines the execution plan for eleven UX-hooks manual tests in the Spec Kit Memory system. It sequences preconditions, vitest and ripgrep execution, flag-based MCP testing, evidence capture, and review-protocol verdicting."
trigger_phrases:
  - "ux hooks execution plan"
  - "phase 018 manual tests"
  - "mutation feedback verdict plan"
  - "hooks barrel review plan"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook ux-hooks phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L2 |
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + vitest + ripgrep + MCP flag calls |

### Overview
This plan converts the eleven UX-hooks scenarios in the manual testing playbook into an ordered execution workflow for Phase 018. The phase covers vitest-based hook module tests first (103, 104, 105, 107), then the ripgrep static inspection scenario (106), then feature-flag-controlled MCP scenarios (166, 167, 168, 169, 179, 180), and concludes with verdict review against the review protocol.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Exact prompts, command sequences, and pass criteria are loaded from [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md).
- [ ] Feature mappings for all 11 UX-hooks tests are confirmed against the cross-reference index and UX-hooks feature files.
- [ ] Verdict rules from the playbook review protocol are loaded for PASS/PARTIAL/FAIL handling.
- [ ] vitest test files confirmed to exist: `tests/hooks-ux-feedback.vitest.ts`, `tests/memory-save-ux-regressions.vitest.ts`, `tests/context-server.vitest.ts`, `tests/handler-checkpoints.vitest.ts`, `tests/tool-input-schema.vitest.ts`, `tests/mcp-input-validation.vitest.ts`.
- [ ] `rg` (ripgrep) confirmed available for 106 static inspection.
- [ ] Feature flag support confirmed for SPECKIT_RESULT_EXPLAIN_V1, SPECKIT_RESPONSE_PROFILE_V1, SPECKIT_PROGRESSIVE_DISCLOSURE_V1, SPECKIT_SESSION_RETRIEVAL_STATE_V1, SPECKIT_EMPTY_RESULT_RECOVERY_V1, SPECKIT_RESULT_CONFIDENCE_V1.

### Definition of Done
- [ ] All 11 UX-hooks scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 11/11 scenarios for Phase 018 with no skipped test IDs.
- [ ] No unresolved blocking triage items remain from any FAIL or PARTIAL verdict.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual UX-hooks test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, compiled vitest suite, ripgrep availability, and MCP flag baseline.
- **Execution layer**: vitest runs for 103, 104, 105, 107; ripgrep static inspection for 106; MCP flag-based calls for 166, 167, 168, 169, 179, 180.
- **Evidence bundle**: Test transcripts, assertion output snippets, ripgrep output, and MCP tool call results captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked UX-hooks feature files.
- [ ] Confirm vitest suite is compiled and all six test files listed in Quality Gates exist.
- [ ] Confirm `rg` (ripgrep) is available; note fallback `grep -r` if absent.
- [ ] Confirm feature flag support for all six UX-hooks flags (all default OFF).
- [ ] Record baseline environment before execution.

### Phase 2: vitest-Based Tests
- [ ] Run 103 (`npx vitest run tests/hooks-ux-feedback.vitest.ts`) and capture transcript confirming 6/6 tests pass with latency/cache-clear booleans, `errors: string[]` field, error propagation hints, and finalized hint payload.
- [ ] Run 104 (`npx vitest run tests/memory-save-ux-regressions.vitest.ts`) and inspect assertions for duplicate/unchanged no-op suppression, FSRS field preservation, and atomic-save parity.
- [ ] Run 105 (`npx vitest run tests/context-server.vitest.ts`) and inspect assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata.
- [ ] Run 107 three-suite + Group 13b sequence and inspect missing-`confirmName` rejection, `safetyConfirmationUsed=true` success, and structural source-code pattern verification.
- [ ] If any vitest run produces an import crash (undefined reference), record as FAIL with verbatim error; do not mark as PARTIAL.

### Phase 3: Static Inspection Test
- [ ] Run 106 ripgrep checks against source files (hooks index module and hooks README) and capture output confirming `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks` are all present.

### Phase 4: Feature-Flag MCP Tests
- [ ] Run 166 (SPECKIT_RESULT_EXPLAIN_V1): enable flag, run `memory_search` with `includeTrace`, inspect tier-1 and tier-2 explain outputs; disable flag and confirm no explain output.
- [ ] Run 167 (SPECKIT_RESPONSE_PROFILE_V1): enable flag, run queries with quick/research/resume/debug profiles, compare output shapes; disable flag and confirm default shape.
- [ ] Run 168 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1): enable flag, run large-result query, inspect cursor token, request next page, verify no duplicates, check final page has no cursor; disable flag and confirm single-response return.
- [ ] Run 169 (SPECKIT_SESSION_RETRIEVAL_STATE_V1): enable flag, run first and follow-up queries in same session, verify dedup; start new session, verify state reset; disable flag and confirm no dedup.
- [ ] Run 179 (SPECKIT_EMPTY_RESULT_RECOVERY_V1): enable flag, run empty-result and weak-result queries, inspect all 3 recovery statuses; run healthy result query and confirm no recovery payload; disable flag.
- [ ] Run 180 (SPECKIT_RESULT_CONFIDENCE_V1): enable flag, run representative search queries, inspect per-result confidence fields, verify 4-factor weighting in trace; disable flag and confirm no calibrated confidence field.

### Phase 5: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 11/11 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| 103 | UX hook module coverage | `Validate 103 hook module behavior for mutation feedback and response hints.` | vitest |
| 104 | Mutation save-path UX parity and no-op hardening | `Run save-path UX scenarios and verify duplicate-save and unchanged-save no-op behavior.` | vitest |
| 105 | Context-server success-envelope finalization | `Validate the finalized context-server success-envelope path, including token metadata recomputation.` | vitest |
| 106 | Hooks barrel + README synchronization | `Validate hook barrel and README coverage for the finalized UX-hook surface.` | ripgrep |
| 107 | Checkpoint confirmName and schema enforcement | `Validate checkpoint delete confirmName enforcement across handler and schema layers.` | vitest |
| 166 | Result Explainability | `Verify two-tier result explain output (SPECKIT_RESULT_EXPLAIN_V1).` | MCP |
| 167 | Response Profiles | `Verify quick/research/resume/debug response profile modes (SPECKIT_RESPONSE_PROFILE_V1).` | MCP |
| 168 | Progressive Disclosure | `Verify cursor-based progressive disclosure pagination (SPECKIT_PROGRESSIVE_DISCLOSURE_V1).` | MCP |
| 169 | Session Retrieval State | `Verify cross-turn dedup via session retrieval state (SPECKIT_SESSION_RETRIEVAL_STATE_V1).` | MCP |
| 179 | Empty Result Recovery | `Verifies structured recovery payloads for empty/weak search results across all 3 statuses.` | MCP |
| 180 | Result Confidence | `Verifies per-result calibrated confidence scoring with 4-factor weighting.` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| Playbook review protocol | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/18--ux-hooks/`](../../feature_catalog/18--ux-hooks/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| vitest + compiled test suite (6 files) | Internal | Yellow | 103, 104, 105, 107 cannot be executed |
| ripgrep (`rg`) CLI | Internal | Yellow | 106 cannot be executed; fall back to `grep -r` |
| MCP runtime + feature flag support | Internal | Yellow | 166–169, 179, 180 cannot be executed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A vitest run fails due to a broken test environment (import crash), or flag-based tests produce inconsistent results across repeated runs.
- **Procedure**: Isolate the failing scenario, verify the test file exists and compiles independently, re-run in isolation to confirm reproducibility, document environment state, and mark the scenario blocked instead of recording a false FAIL verdict. For flag-based scenarios, reset all flags to OFF and re-run from a clean state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──► Phase 2 (vitest) ──► Phase 3 (Static) ──► Phase 4 (Flag MCP) ──► Phase 5 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | All other phases |
| vitest Tests | Preconditions | Verdict |
| Static Inspection | Preconditions | Verdict |
| Flag MCP Tests | Preconditions | Verdict |
| Verdict | vitest, Static, Flag MCP | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 15-30 min |
| vitest Tests (103, 104, 105, 107) | Medium | 30-60 min |
| Static Inspection (106) | Low | 10-15 min |
| Flag MCP Tests (166-169, 179, 180) | High | 60-120 min |
| Evidence Collection and Verdict | Medium | 30-60 min |
| **Total** | | **2.5-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] All 6 vitest test files confirmed present
- [ ] All 6 feature flags confirmed default OFF
- [ ] ripgrep or grep fallback confirmed available

### Rollback Procedure
1. On vitest import crash: record the exact error, mark the scenario FAIL, continue to next scenario.
2. On flag state leak: reset all feature flags to OFF, restart MCP if needed, re-run from step 1 of the affected scenario.
3. On session state leak (169): start a new session with a fresh sessionId and re-run the affected query pair.
4. On cursor invalidation (168): re-run from a stable, non-mutating corpus state.

### Data Reversal
- **Has data mutations?** No persistent data mutations; flag state is runtime-only.
- **Reversal procedure**: Reset all feature flags to OFF after each flag-based scenario.
<!-- /ANCHOR:enhanced-rollback -->

---
