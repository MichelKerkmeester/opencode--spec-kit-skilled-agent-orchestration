---
title: "Implementation Plan: [02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/006-analysis/plan]"
description: "Execute 7 analysis scenarios from the manual testing playbook covering causal graph tools and epistemic measurement."
trigger_phrases:
  - "analysis test plan"
  - "causal graph test plan"
  - "epistemic test plan"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook analysis phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | MCP tool calls via Spec Kit Memory |
| **Framework** | Manual testing playbook |
| **Storage** | SQLite (memory_index.db) |
| **Testing** | Manual execution per playbook scenario |

### Overview
Execute 7 manual test scenarios for the analysis category. Each scenario follows the playbook-defined steps: invoke the MCP tool with specified parameters, verify the response matches expected behavior, and capture evidence. Scenarios cover causal graph CRUD (EX-019 through EX-022) and epistemic measurement tools (EX-023 through EX-025).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] MCP server running and healthy (memory_health returns OK)
- [ ] Test memories exist in database for causal link operations
- [ ] Playbook scenario files accessible for reference
- [ ] Sandbox spec folder identified for EX-021 destructive test
- [ ] specFolder and taskId values agreed for EX-023/EX-024

### Definition of Done
- [ ] All 7 scenarios executed with pass/fail verdicts
- [ ] Evidence captured for each scenario
- [ ] Results recorded in tasks.md and checklist.md
- [ ] implementation-summary.md completed with findings
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution following playbook-defined scenarios.

### Key Components
- **Playbook scenarios**: 7 files in `../../manual_testing_playbook/06--analysis/`
- **MCP tools under test**: memory_causal_link, memory_causal_stats, memory_causal_unlink, memory_drift_why, task_preflight, task_postflight, memory_get_learning_history
- **Evidence capture**: Tool output saved as verdict evidence

### Data Flow
Read playbook scenario -> Execute MCP tool call -> Compare response to expected behavior -> Record pass/fail verdict -> Capture evidence
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight
- [ ] Verify MCP server health
- [ ] Confirm test memories exist for causal operations
- [ ] Create named checkpoint for sandbox before EX-021
- [ ] Agree on specFolder and taskId values for EX-023/EX-024

### Phase 2: Non-Destructive Causal Scenarios (EX-019, EX-020, EX-022)
- [ ] EX-019: Create causal edge between two memories and verify via memory_drift_why
- [ ] EX-020: Retrieve causal graph statistics and verify edge count/coverage
- [ ] EX-022: Trace causal chain bidirectionally to depth 4

### Phase 3: Epistemic Measurement Scenarios (EX-023, EX-024, EX-025)
- [ ] EX-023: Capture epistemic baseline (task_preflight)
- [ ] EX-024: Capture post-task measurement (task_postflight) -- must use same specFolder/taskId as EX-023
- [ ] EX-025: Retrieve learning history with onlyComplete:true

### Phase 4: Destructive Scenario (EX-021)
- [ ] Confirm sandbox isolation and checkpoint exist
- [ ] EX-021: Delete causal edge via memory_causal_unlink and verify removal via memory_drift_why
- [ ] Document checkpoint name and sandbox path in evidence

### Phase 5: Wrap-up
- [ ] Record all verdicts in tasks.md and checklist.md
- [ ] Complete implementation-summary.md with findings
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each of the 7 analysis scenarios | MCP tool calls |
| Verification | Response structure and content | Visual inspection of tool output |
| Evidence | Capture tool responses | Copy/paste tool output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server | Internal | Green | Cannot execute any scenarios |
| Existing memories | Internal | Green | Causal link tests need valid memory IDs |
| Prior spec folder | Internal | Green | Preflight/postflight need spec folder path |
| Sandbox checkpoint | Internal | Green | EX-021 cannot run safely without confirmed isolation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: EX-021 edge deletion taints causal graph state or sandbox isolation fails
- **Procedure**: Restore named sandbox checkpoint, discard compromised evidence, verify graph integrity with memory_causal_stats, and rerun EX-021 after baseline confirmed clean
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Pre-flight) --> Phase 2 (Non-Destructive Causal)
                     --> Phase 3 (Epistemic)
                     --> Phase 4 (Destructive)
                                              --> Phase 5 (Wrap-up)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-flight | None | All others |
| Non-Destructive Causal | Pre-flight | Wrap-up |
| Epistemic | Pre-flight | Wrap-up |
| Destructive | Pre-flight | Wrap-up |
| Wrap-up | Non-Destructive Causal, Epistemic, Destructive | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Pre-flight | Low | 5 minutes |
| Non-Destructive Causal (3 scenarios) | Medium | 15 minutes |
| Epistemic (3 scenarios) | Medium | 15 minutes |
| Destructive (1 scenario) | Medium | 10 minutes |
| Wrap-up | Low | 10 minutes |
| **Total** | | **~55 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Named checkpoint created before EX-021
- [ ] Sandbox spec folder confirmed isolated from active data

### Rollback Procedure
1. Restore named checkpoint via checkpoint_restore
2. Verify graph integrity via memory_causal_stats
3. Rerun only the affected scenario

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Restore checkpoint to undo EX-021 edge deletion; EX-019 edges can be removed via memory_causal_unlink
<!-- /ANCHOR:enhanced-rollback -->
