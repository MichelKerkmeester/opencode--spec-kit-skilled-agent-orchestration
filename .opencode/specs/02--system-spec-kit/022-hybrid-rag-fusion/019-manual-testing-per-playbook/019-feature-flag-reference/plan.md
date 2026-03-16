---
title: "Implementation Plan: manual-testing-per-playbook feature-flag-reference phase [template:level_1/plan.md]"
description: "Phase 019 defines the execution plan for eight feature-flag-reference manual tests in the Spec Kit Memory system. It sequences preconditions, read-only retrieval checks, and the Hydra roadmap snapshot scenario with evidence capture and review-protocol verdicting."
trigger_phrases:
  - "feature flag reference execution plan"
  - "phase 019 manual tests"
  - "SPECKIT flag audit verdict plan"
  - "hybrid rag flag catalog review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook feature-flag-reference phase

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
| **Testing** | manual + MCP |

### Overview
This plan converts the feature-flag-reference scenarios in the manual testing playbook into an ordered execution workflow for Phase 019. The phase covers read-only flag retrieval checks first (EX-028 through EX-034), verifying that six distinct flag groups can be surfaced and classified via memory_search and memory_context, and then the Hydra roadmap capability isolation scenario (NEW-125), which requires a compiled dist build and targeted env-var injection to verify that prefixed SPECKIT_HYDRA_* flags remain distinct from live runtime flags.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 8 feature-flag-reference tests were confirmed against the cross-reference index and feature-flag-reference catalog files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] NEW-125 dist build requirement and env-var isolation expectations were identified.

### Definition of Done
- [ ] All 8 feature-flag-reference scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 8/8 scenarios for Phase 019 with no skipped test IDs.
- [ ] NEW-125 snapshot comparison outputs are captured before any env cleanup.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual feature-flag-reference test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature-flag-reference catalog links, indexed flag documentation corpus, and dist build for NEW-125.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_search` and `memory_context`, and direct node invocations for NEW-125 snapshots.
- **Evidence bundle**: Tool outputs, JSON snapshots from capability-flags.js, and reviewer notes captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and all linked feature-flag-reference catalog files.
- [ ] Confirm MCP runtime access for `memory_search` and `memory_context`.
- [ ] Verify that flag reference documentation is indexed (run `memory_index_scan(force:true)` if flag docs are absent from search results).
- [ ] Confirm the dist build at `.opencode/skill/system-spec-kit/mcp_server/dist/lib/config/capability-flags.js` is current for NEW-125.

### Phase 2: Non-Destructive Read-Only Tests
- [ ] Run EX-028 to classify SPECKIT flags as active, inert, or deprecated using memory_search and memory_context deep mode.
- [ ] Run EX-029 to surface session dedup and cache policy keys via memory_search.
- [ ] Run EX-030 to retrieve MCP validation settings defaults via memory_search.
- [ ] Run EX-031 to identify DB path precedence chain via memory_search and memory_context focused mode.
- [ ] Run EX-032 to retrieve embedding provider selection rules and key precedence via memory_search.
- [ ] Run EX-033 to identify debug and telemetry controls and separate opt-in from inert flags via memory_search.
- [ ] Run EX-034 to surface branch env vars used in checkpoint metadata via memory_search.

### Phase 3: Hydra Snapshot Test
- [ ] Run NEW-125 step 1 with `SPECKIT_GRAPH_UNIFIED=false` to obtain the first roadmap snapshot and confirm `phase:"shared-rollout"` with `capabilities.graphUnified:true`.
- [ ] Run NEW-125 step 2 with `SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false` to obtain the second roadmap snapshot and confirm `phase:"graph"` with `capabilities.graphUnified:false`.
- [ ] Confirm that the live runtime `SPECKIT_GRAPH_UNIFIED` flag does not alter roadmap metadata and that only `SPECKIT_HYDRA_*` vars override snapshot values.

### Phase 4: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 8/8 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-028 | Flag catalog verification | `List SPECKIT flags active/inert/deprecated` | MCP |
| EX-029 | Session policy audit | `Retrieve dedup/cache policy settings` | MCP |
| EX-030 | MCP limits audit | `Find MCP validation settings defaults` | MCP |
| EX-031 | Storage precedence check | `Explain DB path precedence env vars` | MCP |
| EX-032 | Provider selection audit | `Retrieve embedding provider selection rules` | MCP |
| EX-033 | Observability toggle check | `List telemetry/debug vars and separate opt-in flags from inert flags` | MCP |
| EX-034 | Branch metadata source audit | `Find branch env vars used in checkpoint metadata` | MCP |
| NEW-125 | Hydra roadmap capability flags | `Validate memory roadmap flag snapshots without changing live graph-channel defaults.` | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/19--feature-flag-reference/`](../../feature_catalog/19--feature-flag-reference/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_search` and `memory_context` | Internal | Yellow | EX-028 through EX-034 cannot be executed |
| Dist build at `.opencode/skill/system-spec-kit/mcp_server/dist/lib/config/capability-flags.js` | Internal | Yellow | NEW-125 cannot produce valid snapshot comparisons |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: NEW-125 env-var injection leaves the shell environment in a state that could affect subsequent scenarios, or an unexpectedly stale dist build produces incorrect snapshot data.
- **Procedure**: Unset all injected `SPECKIT_*` env vars after NEW-125 completes, rebuild the dist target with `npm run build` if snapshot values are inconsistent with expectations, discard compromised evidence, and rerun only NEW-125 after the environment is clean. For read-only MCP scenarios EX-028 through EX-034, re-run `memory_index_scan(force:true)` if search results remain sparse after the first attempt.
<!-- /ANCHOR:rollback -->

---
