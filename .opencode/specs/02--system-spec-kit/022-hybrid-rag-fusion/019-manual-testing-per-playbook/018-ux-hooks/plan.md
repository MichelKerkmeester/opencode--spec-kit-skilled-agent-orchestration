---
title: "Implementation Plan: manual-testing-per-playbook ux-hooks phase [template:level_1/plan.md]"
description: "Phase 018 defines the execution plan for five UX-hooks manual tests in the Spec Kit Memory system. It sequences preconditions, vitest and ripgrep execution, evidence capture, and review-protocol verdicting for UX-hooks-focused scenarios."
trigger_phrases:
  - "ux hooks execution plan"
  - "phase 018 manual tests"
  - "mutation feedback verdict plan"
  - "hooks barrel review plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook ux-hooks phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + vitest + ripgrep |

### Overview
This plan converts the UX-hooks scenarios in the manual testing playbook into an ordered execution workflow for Phase 018. The phase covers the vitest-based hook module tests first (NEW-103, NEW-104, NEW-105, NEW-107), then the ripgrep-based static inspection scenario (NEW-106), and concludes with verdict review against the review protocol.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 5 UX-hooks tests were confirmed against the cross-reference index and UX-hooks feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] Test file names and ripgrep target paths were confirmed from the playbook command sequences.

### Definition of Done
- [ ] All 5 UX-hooks scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 5/5 scenarios for Phase 018 with no skipped test IDs.
- [ ] No unresolved blocking triage items remain from any FAIL or PARTIAL verdict.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual UX-hooks test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, compiled vitest suite, and ripgrep availability.
- **Execution layer**: vitest runs for NEW-103, NEW-104, NEW-105, and NEW-107; ripgrep static inspection for NEW-106.
- **Evidence bundle**: Test transcripts, assertion output snippets, and ripgrep output captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked UX-hooks feature files.
- [ ] Confirm vitest suite is compiled and the following test files exist: `tests/hooks-ux-feedback.vitest.ts`, `tests/memory-save-ux-regressions.vitest.ts`, `tests/context-server.vitest.ts`, `tests/handler-checkpoints.vitest.ts`, `tests/tool-input-schema.vitest.ts`, `tests/mcp-input-validation.vitest.ts`.
- [ ] Confirm `rg` (ripgrep) is available for NEW-106 static inspection.
- [ ] Record baseline environment before execution.

### Phase 2: vitest-Based Tests
- [ ] Run NEW-103 (`npx vitest run tests/hooks-ux-feedback.vitest.ts`) and capture test transcript with passing assertion count.
- [ ] Run NEW-104 (`npx vitest run tests/memory-save-ux-regressions.vitest.ts`) and inspect assertions covering duplicate-save no-op suppression and atomic-save parity.
- [ ] Run NEW-105 (`npx vitest run tests/context-server.vitest.ts`) and inspect assertions for appended hints, preserved `autoSurfacedContext`, and final token metadata.
- [ ] Run NEW-107 (`npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts`) and inspect missing-`confirmName` rejection and `safetyConfirmationUsed=true` success assertions.

### Phase 3: Static Inspection Test
- [ ] Run NEW-106 ripgrep checks against `mcp_server/hooks/index.ts` and `mcp_server/hooks/README.md` and capture output confirming both files reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks`.

### Phase 4: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 5/5 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/vitest/ripgrep) |
|---------|---------------|--------------|-----------------------------------------|
| NEW-103 | UX hook module coverage | `Validate NEW-103 hook module behavior for mutation feedback and response hints.` | vitest |
| NEW-104 | Mutation save-path UX parity and no-op hardening | `Run save-path UX scenarios and verify duplicate-save no-op behavior plus atomic-save parity.` | vitest |
| NEW-105 | Context-server success-envelope finalization | `Validate the finalized context-server success-envelope path, including token metadata recomputation.` | vitest |
| NEW-106 | Hooks barrel + README synchronization | `Validate hook barrel and README coverage for the finalized UX-hook surface.` | ripgrep |
| NEW-107 | Checkpoint confirmName and schema enforcement | `Validate checkpoint delete confirmName enforcement across handler and schema layers.` | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/18--ux-hooks/`](../../feature_catalog/18--ux-hooks/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| vitest + compiled test suite (`hooks-ux-feedback`, `memory-save-ux-regressions`, `context-server`, `handler-checkpoints`, `tool-input-schema`, `mcp-input-validation`) | Internal | Yellow | NEW-103, NEW-104, NEW-105, and NEW-107 cannot be executed |
| ripgrep (`rg`) CLI | Internal | Yellow | NEW-106 barrel and README inspection cannot be executed; fall back to `grep -r` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A vitest run fails in a way that could indicate a broken test environment rather than a genuine feature regression, or ripgrep produces ambiguous output due to path differences across machines.
- **Procedure**: Isolate the failing scenario, verify the test file exists and compiles independently, re-run in isolation to confirm the failure is reproducible, document the environment state, and mark the scenario blocked instead of recording a false FAIL verdict.
<!-- /ANCHOR:rollback -->

---
