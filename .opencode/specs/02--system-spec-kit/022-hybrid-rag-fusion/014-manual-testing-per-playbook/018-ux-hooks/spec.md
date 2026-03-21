---
title: "Feature Specification: manual-testing-per-playbook ux-hooks phase [template:level_1/spec.md]"
description: "Phase 018 documents the UX-hooks manual test packet for the Spec Kit Memory system. It breaks nine UX-hooks scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "ux hooks manual testing"
  - "phase 018 ux hooks"
  - "mutation feedback hooks testing"
  - "checkpoint confirmName manual tests"
  - "166 167 168 169"
  - "result explainability"
  - "response profiles"
  - "progressive disclosure"
  - "session retrieval state"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook ux-hooks phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
| **Predecessor Phase** | `017-governance` |
| **Successor Phase** | `019-feature-flag-reference` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual UX-hooks scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated UX-hooks packet, Phase 018 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results. Wave 2-4 additions introduce result explainability, response profiles, progressive disclosure, and session retrieval state.

### Purpose
Provide a single UX-hooks-focused specification that maps all nine Phase 018 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
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
| 166 | Result Explainability | [`../../feature_catalog/18--ux-hooks/13-result-explainability.md`](../../feature_catalog/18--ux-hooks/13-result-explainability.md) | `Verify two-tier result explain output (SPECKIT_RESULT_EXPLAIN_V1).` | `1) Enable flag 2) Run memory_search with includeTrace 3) Inspect tier-1 summary explain 4) Inspect tier-2 detailed score breakdown 5) Disable flag fallback` |
| 167 | Response Profiles | [`../../feature_catalog/18--ux-hooks/14-response-profiles.md`](../../feature_catalog/18--ux-hooks/14-response-profiles.md) | `Verify quick/research/resume/debug response profile modes (SPECKIT_RESPONSE_PROFILE_V1).` | `1) Enable flag 2) Run query with profile=quick 3) Run query with profile=research 4) Run query with profile=resume 5) Run query with profile=debug 6) Compare output shape/verbosity across profiles 7) Disable flag fallback` |
| 168 | Progressive Disclosure | [`../../feature_catalog/18--ux-hooks/15-progressive-disclosure.md`](../../feature_catalog/18--ux-hooks/15-progressive-disclosure.md) | `Verify cursor-based progressive disclosure pagination (SPECKIT_PROGRESSIVE_DISCLOSURE_V1).` | `1) Enable flag 2) Run large-result query 3) Inspect initial page with cursor token 4) Request next page using cursor 5) Verify no duplicates across pages 6) Disable flag fallback` |
| 169 | Session Retrieval State | [`../../feature_catalog/18--ux-hooks/16-session-retrieval-state.md`](../../feature_catalog/18--ux-hooks/16-session-retrieval-state.md) | `Verify cross-turn dedup via session retrieval state (SPECKIT_SESSION_RETRIEVAL_STATE_V1).` | `1) Enable flag 2) Run first query 3) Run follow-up query in same session 4) Verify already-surfaced results are deprioritized or deduplicated 5) Start new session and verify state is reset 6) Disable flag fallback` |

### Out of Scope
- Executing the nine UX-hooks scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-UX-hooks phases from other phase folders within `014-manual-testing-per-playbook/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 018 UX-hooks requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 018 UX-hooks execution plan and review workflow |
| `tasks.md` | Create | Phase 018 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 018 verification checklist for QA validation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document 103 UX hook module coverage with its exact playbook prompt, vitest command, evidence target, and feature link. | PASS if `tests/hooks-ux-feedback.vitest.ts` passes all 6 tests with no failing assertions covering latency/cache-clear booleans, `errors: string[]` field in mutation feedback data, error propagation hint verification, and finalized hint payload |
| REQ-002 | Document 104 mutation save-path UX parity and no-op hardening with its exact prompt, multi-assertion command sequence, evidence target, and feature link. | PASS if both duplicate and unchanged no-ops suppress false hook metadata, FSRS fields are preserved, and atomic-save responses match the primary save contract |
| REQ-003 | Document 105 context-server success-envelope finalization with its exact prompt, four-step vitest sequence, evidence target, and feature link. | PASS if `tests/context-server.vitest.ts` passes and assertions cover the final success-envelope path end to end |
| REQ-004 | Document 106 hooks barrel and README synchronization with its exact prompt, ripgrep command sequence, evidence target, and feature link. | PASS if both files reference the new modules and contract fields |
| REQ-005 | Document 107 checkpoint confirmName and schema enforcement with its exact prompt, three-suite vitest sequence plus context-server Group 13b, evidence target, and feature link. | PASS if the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end |
| REQ-006 | Document 166 (Result Explainability) with its exact prompt, execution sequence, evidence target, and feature link. Feature flag: `SPECKIT_RESULT_EXPLAIN_V1` (default: OFF). | PASS when flag ON: tier-1 summary explain is included in search results, tier-2 detailed score breakdown is available when `includeTrace` is requested, and explain output does not affect ranking; PASS when flag OFF: no explain output is appended to search results. FAIL when explain output is missing at either tier with the flag enabled, when explain data alters result ranking, or when explain output appears with the flag disabled. |
| REQ-007 | Document 167 (Response Profiles) with its exact prompt, execution sequence, evidence target, and feature link. Feature flag: `SPECKIT_RESPONSE_PROFILE_V1` (default: OFF). | PASS when flag ON: `quick` mode returns concise results with minimal metadata, `research` mode returns full results with extended context, `resume` mode returns continuation-optimized results prioritizing recent activity, `debug` mode returns full trace and diagnostic data, and an unrecognized profile name falls back to the default output shape; PASS when flag OFF: all queries use the default output shape regardless of requested profile. FAIL when profile modes produce identical output, when an invalid profile name causes an error instead of fallback, or when profiles are applied with the flag disabled. |
| REQ-008 | Document 168 (Progressive Disclosure) with its exact prompt, execution sequence, evidence target, and feature link. Feature flag: `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` (default: OFF). | PASS when flag ON: large result sets return an initial page with a cursor token, subsequent page requests using the cursor return the next batch without duplicates, and the final page has no cursor; PASS when flag OFF: all results are returned in a single response with no cursor. FAIL when pages contain duplicate results, when the cursor token is missing from non-final pages, or when pagination activates with the flag disabled. |
| REQ-009 | Document 169 (Session Retrieval State) with its exact prompt, execution sequence, evidence target, and feature link. Feature flag: `SPECKIT_SESSION_RETRIEVAL_STATE_V1` (default: OFF). | PASS when flag ON: results already surfaced in earlier turns of the same session are deprioritized or deduplicated in subsequent queries, starting a new session resets the state, and the dedup does not suppress genuinely re-relevant results when the query context changes significantly; PASS when flag OFF: no cross-turn dedup occurs and every query returns results independently. FAIL when dedup state leaks across sessions, when previously surfaced results are suppressed despite a significant context change, or when dedup activates with the flag disabled. |

No P1 items are defined for this phase; all nine UX-hooks scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 UX-hooks tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for 103, 104, 105, 106, 107, 166, 167, 168, and 169 will be collected.
- **SC-003**: Reviewers can audit every Phase 018 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | Playbook review protocol (embedded in playbook §4) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/18--ux-hooks/`](../../feature_catalog/18--ux-hooks/) | Supplies feature context for each UX-hooks scenario | Keep every test row linked to its mapped UX-hooks feature file |
| Dependency | MCP runtime and vitest test suite for hook and save-path tests | Required to execute 103, 104, 105, and 107 scenarios | Confirm vitest suite is compiled and test files exist before execution |
| Dependency | `ripgrep` (`rg`) CLI tool available in runtime environment | Required to execute 106 barrel and README checks | Verify `rg` is installed; fall back to `grep -r` if absent |
| Dependency | `SPECKIT_RESULT_EXPLAIN_V1` feature flag | Required for 166; controls two-tier result explain output | Confirm flag support before running 166; default OFF suppresses explain output |
| Dependency | `SPECKIT_RESPONSE_PROFILE_V1` feature flag | Required for 167; controls response profile modes (quick/research/resume/debug) | Confirm flag support and profile name routing before running 167; default OFF uses default output shape |
| Dependency | `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` feature flag | Required for 168; controls cursor-based progressive disclosure pagination | Confirm flag support before running 168; default OFF returns all results in a single response |
| Dependency | `SPECKIT_SESSION_RETRIEVAL_STATE_V1` feature flag | Required for 169; controls cross-turn dedup via session retrieval state | Confirm flag support and session identity mechanism before running 169; default OFF disables cross-turn dedup |
| Risk | 107 involves validating rejection of missing `confirmName` which could mask false positives if schema enforcement is incomplete | High | Run all three suites (handler, tool-input-schema, mcp-input-validation) plus context-server Group 13b together; do not accept partial suite pass |
| Risk | 169 session state persistence may leak across sessions if session identity is not properly isolated | High | Verify session boundaries by running queries in two distinct sessions and confirming state reset between them |
| Risk | 168 cursor tokens may become invalid if the underlying data changes between page requests | Medium | Test with a stable corpus and verify that mid-stream mutations are either blocked or produce a clear error |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should 106 `rg` commands target the repository root or a specific `mcp_server/hooks/` path for consistent cross-machine results?
- Is there a vitest alias or npm script that wraps the three-suite 107 run, or must all three files be listed explicitly each time?
<!-- /ANCHOR:questions -->

---
