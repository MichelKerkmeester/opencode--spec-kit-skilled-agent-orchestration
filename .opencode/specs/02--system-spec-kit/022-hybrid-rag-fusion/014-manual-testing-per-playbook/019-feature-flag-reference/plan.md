---
title: "Implementation Plan: manual-testing-per-playbook feature-flag-reference phase [template:level_2/plan.md]"
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
| **Testing** | manual + MCP + node dist invocation |

### Overview
This plan converts the eight feature-flag-reference scenarios in the manual testing playbook into an ordered execution workflow for Phase 019. The phase covers read-only flag retrieval checks first (EX-028 through EX-034), verifying that six distinct flag groups can be surfaced and classified via memory_search and memory_context, and then the Hydra roadmap capability isolation scenario (125), which requires a compiled dist build and targeted env-var injection to verify that prefixed SPECKIT_HYDRA_* flags remain distinct from live runtime flags.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Exact prompts, command sequences, and pass criteria are loaded from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [ ] Feature mappings for all 8 feature-flag-reference tests are confirmed against the cross-reference index and feature-flag-reference catalog files.
- [ ] Verdict rules from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) are loaded for PASS/PARTIAL/FAIL handling.
- [ ] 125 dist build requirement and env-var isolation expectations are identified.
- [ ] MCP runtime access confirmed for `memory_search` and `memory_context`.

### Definition of Done
- [ ] All 8 feature-flag-reference scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 8/8 scenarios for Phase 019 with no skipped test IDs.
- [ ] 125 snapshot comparison outputs are captured before any env cleanup.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual feature-flag-reference test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature-flag-reference catalog links, indexed flag documentation corpus, and dist build for 125.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_search` and `memory_context`, and direct node invocations for 125 snapshots.
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
- [ ] Verify that flag reference documentation is indexed; run `memory_index_scan({ force:true })` if flag docs are absent from search results.
- [ ] Confirm the dist build at `.opencode/skill/system-spec-kit/mcp_server/dist/lib/config/capability-flags.js` is current for 125; run `npm run build` inside `mcp_server/` if in doubt.

### Phase 2: Non-Destructive Read-Only Tests
- [ ] Run EX-028: `memory_search({ query:"SPECKIT flags active inert deprecated", limit:20 })` then `memory_context({ mode:"deep", prompt:"Classify SPECKIT flags as active, inert, or deprecated", sessionId:"ex028" })`. Capture output and classify flags. If 0 results, triage via feature catalog cross-reference.
- [ ] Run EX-029: `memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 })`. Surface all required session/cache control keys.
- [ ] Run EX-030: `memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })`. Identify defaults and keys for MCP guardrails.
- [ ] Run EX-031: `memory_search({ query:"SPEC_KIT_DB_DIR SPECKIT_DB_DIR database path precedence", limit:20 })` then `memory_context({ mode:"focused", prompt:"Explain DB path precedence env vars", sessionId:"ex031" })`. Confirm DB path precedence chain.
- [ ] Run EX-032: `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 })`. Confirm provider routing and key precedence.
- [ ] Run EX-033: `memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20 })`. Separate opt-in from inert controls.
- [ ] Run EX-034: `memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 })`. Surface all listed branch env vars.
- [ ] If any EX-028 through EX-034 search returns 0 results, run `memory_index_scan({ force:true })` and retry once; if still 0, triage via feature catalog and document EVIDENCE GAP in evidence bundle.

### Phase 3: Hydra Snapshot Test
- [ ] Change to `.opencode/skill/system-spec-kit/mcp_server/` directory.
- [ ] Run 125 step 1: `SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))"` and capture JSON output.
- [ ] Run 125 step 2: `SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"` and capture JSON output.
- [ ] Confirm step 1 shows `phase:"shared-rollout"` with `capabilities.graphUnified:true` (live flag did NOT alter roadmap).
- [ ] Confirm step 2 shows `phase:"graph"` with `capabilities.graphUnified:false` (SPECKIT_HYDRA_* prefix successfully opts out).
- [ ] Unset all SPECKIT_HYDRA_* env vars after both snapshots are captured.

### Phase 4: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 8/8 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| EX-028 | Flag catalog verification | `List SPECKIT flags active/inert/deprecated` | MCP |
| EX-029 | Session policy audit | `Retrieve dedup/cache policy settings` | MCP |
| EX-030 | MCP limits audit | `Find MCP validation settings defaults` | MCP |
| EX-031 | Storage precedence check | `Explain DB path precedence env vars` | MCP |
| EX-032 | Provider selection audit | `Retrieve embedding provider selection rules` | MCP |
| EX-033 | Observability toggle check | `List telemetry/debug vars and separate opt-in flags from inert flags` | MCP |
| EX-034 | Branch metadata source audit | `Find branch env vars used in checkpoint metadata` | MCP |
| 125 | Hydra roadmap capability flags | `Validate memory roadmap flag snapshots without changing live graph-channel defaults.` | node/manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/19--feature-flag-reference/`](../../feature_catalog/19--feature-flag-reference/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_search` and `memory_context` | Internal | Yellow | EX-028 through EX-034 cannot be executed |
| Indexed flag documentation corpus | Internal | Yellow | EX-028 through EX-034 return 0 results; triage via feature catalog if absent |
| Dist build at `.opencode/skill/system-spec-kit/mcp_server/dist/lib/config/capability-flags.js` | Internal | Yellow | 125 cannot produce valid snapshot comparisons |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: 125 env-var injection leaves the shell environment in a state that could affect subsequent scenarios, or an unexpectedly stale dist build produces incorrect snapshot data.
- **Procedure**: Unset all injected `SPECKIT_*` env vars after 125 completes, rebuild with `npm run build` if snapshot values are inconsistent with expectations, discard compromised evidence, and rerun only 125 after the environment is clean. For read-only MCP scenarios EX-028 through EX-034, run `memory_index_scan({ force:true })` if search results remain sparse after the first attempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──► Phase 2 (Read-Only MCP) ──► Phase 3 (Hydra Snapshot) ──► Phase 4 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | All other phases |
| Read-Only MCP | Preconditions | Verdict |
| Hydra Snapshot | Preconditions | Verdict |
| Verdict | Read-Only MCP, Hydra Snapshot | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 15-30 min |
| Read-Only MCP Tests (EX-028 to EX-034) | Low | 30-60 min |
| Hydra Snapshot Test (125) | Medium | 15-30 min |
| Evidence Collection and Verdict | Low | 20-30 min |
| **Total** | | **1.5-2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] Flag documentation indexed (or feature catalog triage path documented)
- [ ] capability-flags.js dist build confirmed present
- [ ] All SPECKIT_HYDRA_* env vars confirmed unset before Phase 3

### Rollback Procedure
1. On 125 module not found: run `npm run build` inside `mcp_server/`; retry both node invocations.
2. On SPECKIT_HYDRA_* env var bleed: unset all SPECKIT_HYDRA_* vars, confirm with `env | grep SPECKIT_HYDRA`, restart from Phase 3 step 1.
3. On EX-028 to EX-034 persistent 0 results: run `memory_index_scan({ force:true })`, wait for completion, retry scenario; if still 0, document EVIDENCE GAP and triage via feature catalog.

### Data Reversal
- **Has data mutations?** No persistent data mutations; all tests are read-only or read-and-snapshot.
- **Reversal procedure**: Unset SPECKIT_HYDRA_* env vars after 125 completes. No other state restoration required.
<!-- /ANCHOR:enhanced-rollback -->

---
