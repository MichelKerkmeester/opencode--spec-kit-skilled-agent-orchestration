---
title: "Feature Specification: manual-testing-per-playbook ux-hooks phase [template:level_2/spec.md]"
description: "Phase 018 documents the UX-hooks manual test packet for the Spec Kit Memory system. It breaks eleven UX-hooks scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "ux hooks manual testing"
  - "phase 018 ux hooks"
  - "103-107 166-169 179-180 mutation hooks checkpoint explainability"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook ux-hooks phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [017-governance](../017-governance/spec.md) |
| **Successor** | [019-feature-flag-reference](../019-feature-flag-reference/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual UX-hooks scenarios for the Spec Kit Memory system live inside the central playbook and require a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated UX-hooks packet, Phase 018 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results. Scenarios include result explainability, response profiles, progressive disclosure, session retrieval state, empty result recovery, and result confidence.

### Purpose
Provide a single UX-hooks-focused specification that maps all eleven Phase 018 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| 103 | UX hook module coverage (`mutation-feedback`, `response-hints`) | [`../../feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md`](../../feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md) | `Validate 103 hook module behavior for mutation feedback and response hints. Capture the evidence needed to prove Test output shows suite pass (6 tests), including latency/cache-clear booleans, errors field verification, error propagation hints, and finalized hint payload assertions. Return a concise user-facing pass/fail verdict with the main reason.` | `1) npx vitest run tests/hooks-ux-feedback.vitest.ts` |
| 104 | Mutation save-path UX parity and no-op hardening | [`../../feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md`](../../feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md) | `Run save-path UX scenarios and verify duplicate-save and unchanged-save no-op behavior, FSRS corruption guard, plus atomic-save parity. Capture the evidence needed to prove Suite passes and assertions show no false postMutationHooks on duplicate or unchanged saves, cache-left-unchanged messaging, FSRS fields not reset on no-op saves, and parity between standard and atomic save responses. Return a concise user-facing pass/fail verdict with the main reason.` | `1) npx vitest run tests/memory-save-ux-regressions.vitest.ts 2) inspect assertions covering duplicate-content and unchanged-content save no-op responses 3) inspect assertions verifying FSRS fields (review_count, last_review) are not reset on no-op saves 4) inspect assertions covering atomic-save postMutationHooks, hints, and partial-indexing guidance parity` |
| 105 | Context-server success-envelope finalization | [`../../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md`](../../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md) | `Validate the finalized context-server success-envelope path, including token metadata recomputation.` | `1) npx vitest run tests/context-server.vitest.ts 2) inspect assertions covering appended success hints 3) inspect assertions covering preserved autoSurfacedContext 4) inspect assertions covering final token metadata after hint append and before budget enforcement` |
| 106 | Hooks barrel + README synchronization | [`../../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md`](../../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md) | `Validate hook barrel and README coverage for the finalized UX-hook surface.` | `1) rg "mutation-feedback\|response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts 2) rg "mutation-feedback\|response-hints\|MutationHookResult\|postMutationHooks" .opencode/skill/system-spec-kit/mcp_server/hooks/README.md` |
| 107 | Checkpoint confirmName and schema enforcement | [`../../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md`](../../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md) | `Validate checkpoint delete confirmName enforcement across handler and schema layers. Capture the evidence needed to prove Validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting, and context-server Group 13b structural tests pass. Return a concise user-facing pass/fail verdict with the main reason.` | `1) npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts 2) npx vitest run tests/context-server.vitest.ts (Group 13b: T103–T106 structural source-code pattern verification) 3) inspect rejection assertions for missing confirmName 4) inspect success assertions for safetyConfirmationUsed=true` |
| 166 | Result Explainability | [`../../feature_catalog/18--ux-hooks/14-result-explainability.md`](../../feature_catalog/18--ux-hooks/14-result-explainability.md) | `Verify two-tier result explain output (SPECKIT_RESULT_EXPLAIN_V1).` | `1) Enable flag 2) Run memory_search with includeTrace 3) Inspect tier-1 summary explain 4) Inspect tier-2 detailed score breakdown 5) Disable flag fallback` |
| 167 | Response Profiles | [`../../feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md`](../../feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md) | `Verify quick/research/resume/debug response profile modes (SPECKIT_RESPONSE_PROFILE_V1).` | `1) Enable flag 2) Run query with profile=quick 3) Run query with profile=research 4) Run query with profile=resume 5) Run query with profile=debug 6) Compare output shape/verbosity across profiles 7) Disable flag fallback` |
| 168 | Progressive Disclosure | [`../../feature_catalog/18--ux-hooks/16-progressive-disclosure.md`](../../feature_catalog/18--ux-hooks/16-progressive-disclosure.md) | `Verify cursor-based progressive disclosure pagination (SPECKIT_PROGRESSIVE_DISCLOSURE_V1).` | `1) Enable flag 2) Run large-result query 3) Inspect initial page with cursor token 4) Request next page using cursor 5) Verify no duplicates across pages 6) Disable flag fallback` |
| 169 | Session Retrieval State | [`../../feature_catalog/18--ux-hooks/17-retrieval-session-state.md`](../../feature_catalog/18--ux-hooks/17-retrieval-session-state.md) | `Verify cross-turn dedup via session retrieval state (SPECKIT_SESSION_RETRIEVAL_STATE_V1).` | `1) Enable flag 2) Run first query 3) Run follow-up query in same session 4) Verify already-surfaced results are deprioritized or deduplicated 5) Start new session and verify state is reset 6) Disable flag fallback` |
| 179 | Empty Result Recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) | [`../../feature_catalog/18--ux-hooks/18-empty-result-recovery.md`](../../feature_catalog/18--ux-hooks/18-empty-result-recovery.md) | `Verifies structured recovery payloads for empty/weak search results across all 3 statuses.` | `1) Enable flag 2) Run empty-result query 3) Run weak-result query 4) Inspect structured recovery payloads across all 3 statuses 5) Disable flag fallback` |
| 180 | Result Confidence (SPECKIT_RESULT_CONFIDENCE_V1) | [`../../feature_catalog/18--ux-hooks/19-result-confidence.md`](../../feature_catalog/18--ux-hooks/19-result-confidence.md) | `Verifies per-result calibrated confidence scoring with 4-factor weighting.` | `1) Enable flag 2) Run representative search queries 3) Inspect per-result calibrated confidence fields 4) Verify 4-factor weighting in trace output 5) Disable flag fallback` |

### Out of Scope
- Executing the eleven UX-hooks scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-UX-hooks phases from other phase folders within `015-manual-testing-per-playbook/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 018 UX-hooks requirements, test inventory, and acceptance criteria |
| `plan.md` | Rewrite | Phase 018 UX-hooks execution plan and review workflow |
| `tasks.md` | Rewrite | Phase 018 task tracker — all tasks pending |
| `checklist.md` | Rewrite | Phase 018 verification checklist — all items unchecked |
| `implementation-summary.md` | Rewrite | Blank template pending execution |
| `description.json` | Rewrite | Reset to Draft, Not Started |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute 103 UX hook module coverage: run `hooks-ux-feedback.vitest.ts` and verify all 6 tests pass. | PASS if all 6 tests pass with latency/cache-clear booleans, `errors: string[]` field, error propagation hints, and finalized hint payload confirmed |
| REQ-002 | Execute 104 mutation save-path UX parity and no-op hardening: run `memory-save-ux-regressions.vitest.ts` and verify no-op assertions. | PASS if duplicate and unchanged no-ops suppress false hook metadata, FSRS fields are preserved, and atomic-save responses match the primary save contract |
| REQ-003 | Execute 105 context-server success-envelope finalization: run `context-server.vitest.ts` and verify envelope assertions. | PASS if suite passes and assertions cover the final success-envelope path end to end |
| REQ-004 | Execute 106 hooks barrel and README synchronization: run ripgrep checks and verify all 4 target terms present. | PASS if both files reference the new modules and contract fields |
| REQ-005 | Execute 107 checkpoint confirmName and schema enforcement: run three-suite vitest sequence plus context-server Group 13b. | PASS if all three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end |
| REQ-006 | Execute 166 Result Explainability: verify two-tier explain output with `SPECKIT_RESULT_EXPLAIN_V1` enabled and disabled. | PASS when flag ON: tier-1 summary and tier-2 score breakdown present, no ranking impact; PASS when flag OFF: no explain output. FAIL if explain missing at either tier with flag enabled, or appears with flag disabled. |
| REQ-007 | Execute 167 Response Profiles: verify quick/research/resume/debug profiles with `SPECKIT_RESPONSE_PROFILE_V1`. | PASS when flag ON: each profile produces distinct output shape; invalid profile falls back; PASS when flag OFF: default shape always used. FAIL if profiles produce identical output or an invalid name causes an error. |
| REQ-008 | Execute 168 Progressive Disclosure: verify cursor-based pagination with `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`. | PASS when flag ON: initial page has cursor, next pages non-duplicating, final page has no cursor; PASS when flag OFF: all results in single response. FAIL if pages contain duplicates or cursor missing from non-final pages. |
| REQ-009 | Execute 169 Session Retrieval State: verify cross-turn dedup with `SPECKIT_SESSION_RETRIEVAL_STATE_V1`. | PASS when flag ON: prior-session results deprioritized, new session resets state; PASS when flag OFF: no dedup. FAIL if state leaks across sessions or dedup activates with flag disabled. |
| REQ-010 | Execute 179 Empty Result Recovery: verify structured recovery payloads with `SPECKIT_EMPTY_RESULT_RECOVERY_V1`. | PASS when flag ON: empty and weak results return all 3 documented statuses; healthy results emit no recovery payload; PASS when flag OFF: no recovery payload. FAIL if any status is missing or payloads appear for healthy results. |
| REQ-011 | Execute 180 Result Confidence: verify per-result calibrated confidence with `SPECKIT_RESULT_CONFIDENCE_V1`. | PASS when flag ON: each result has calibrated confidence score reflecting 4-factor weighting, consistent across runs; PASS when flag OFF: no calibrated confidence field. FAIL if confidence missing with flag enabled or appears with flag disabled. |

No P1 items are defined for this phase; all eleven UX-hooks scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 UX-hooks scenarios (103, 104, 105, 106, 107, 166, 167, 168, 169, 179, 180) are executed with evidence captured per the review protocol.
- **SC-002**: Each scenario has a PASS, PARTIAL, or FAIL verdict with explicit rationale.
- **SC-003**: Coverage is reported as 11/11 with no skipped test IDs.
- **SC-004**: Flag-based scenarios (166–169, 179, 180) include evidence for both enabled and disabled flag states.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass criteria | Treat the playbook as source of truth; update this phase packet only from that document |
| Dependency | Playbook review protocol (embedded in playbook §4) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review; do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/18--ux-hooks/`](../../feature_catalog/18--ux-hooks/) | Supplies feature context for each UX-hooks scenario | Keep every test row linked to its mapped UX-hooks feature file |
| Dependency | MCP runtime and vitest test suite | Required to execute 103, 104, 105, 107 scenarios | Confirm vitest suite is compiled and test files exist before execution |
| Dependency | `ripgrep` (`rg`) CLI available in runtime environment | Required to execute 106 barrel and README checks | Verify `rg` is installed; fall back to `grep -r` if absent |
| Dependency | Feature flags (SPECKIT_RESULT_EXPLAIN_V1, SPECKIT_RESPONSE_PROFILE_V1, SPECKIT_PROGRESSIVE_DISCLOSURE_V1, SPECKIT_SESSION_RETRIEVAL_STATE_V1, SPECKIT_EMPTY_RESULT_RECOVERY_V1, SPECKIT_RESULT_CONFIDENCE_V1) | Required for scenarios 166–169, 179, 180 (all default OFF) | Confirm flag support before running each scenario; default OFF suppresses all enhanced output |
| Risk | 107 requires validating rejection of missing `confirmName` which could mask false positives if schema enforcement is incomplete | High | Run all three suites plus context-server Group 13b together; do not accept partial suite pass |
| Risk | 169 session state persistence may leak across sessions if session identity is not properly isolated | High | Verify session boundaries by running queries in two distinct sessions and confirming state reset |
| Risk | 168 cursor tokens may become invalid if the underlying data changes between page requests | Medium | Test with a stable corpus and verify that mid-stream mutations are either blocked or produce a clear error |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should 106 `rg` commands target the repository root or a specific `mcp_server/hooks/` path for consistent cross-machine results?
- Is there a vitest alias or npm script that wraps the three-suite 107 run, or must all three files be listed explicitly each time?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each vitest suite must complete within the default vitest timeout; flag any suite that exceeds 2 minutes.

### Security
- **NFR-S01**: No hardcoded secrets or real user data in evidence artifacts.
- **NFR-S02**: Flag-state mutations (enable/disable) must be documented and reverted after each flag-based scenario.

### Reliability
- **NFR-R01**: A vitest import failure (e.g., undefined reference) must be reported as a FAIL verdict with the specific error, not silently skipped.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- 166 with flag OFF: no explain field must appear; presence of explain field with flag off is a FAIL.
- 168 final page: no cursor token must be present; presence of cursor on final page is a FAIL.

### Error Scenarios
- vitest import crash (undefined function): report as FAIL with verbatim error message; do not mark as PARTIAL.
- `rg` not found: fall back to `grep -r`; document the substitution in the evidence bundle.

### State Transitions
- 169 session reset: new session must produce independent result set; no residual dedup state from prior session.
- 167 invalid profile name: must fall back to default shape; error thrown is a FAIL.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 11 scenarios, mix of vitest, ripgrep, MCP flag-based calls |
| Risk | 15/25 | vitest import failures, flag state leakage, session boundary isolation |
| Research | 6/20 | Exact prompts and commands already defined in playbook |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
