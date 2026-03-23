---
title: "Implementation Plan: manual-testing-per-playbook evaluation phase"
description: "Execute 2 evaluation scenarios from the manual testing playbook covering ablation studies and reporting dashboard."
trigger_phrases:
  - "evaluation test plan"
  - "ablation test plan"
  - "dashboard test plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook evaluation phase

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
| **Storage** | SQLite (eval.db, memory_index.db) |
| **Testing** | Manual execution per playbook scenario |

### Overview
Execute 2 manual test scenarios for the evaluation category. EX-026 runs an ablation study measuring per-channel Recall@20 deltas, requiring SPECKIT_ABLATION=true. EX-027 generates the reporting dashboard in both text and JSON formats, requiring prior eval run data. EX-026 should run before EX-027 so the dashboard has data to display.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] MCP server running and healthy (memory_health returns OK)
- [ ] SPECKIT_ABLATION=true confirmed in environment
- [ ] Ground truth queries exist for ablation evaluation
- [ ] Playbook scenario files accessible for reference

### Definition of Done
- [ ] Both scenarios executed with pass/fail verdicts
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
- **Playbook scenarios**: 2 files in `../../manual_testing_playbook/07--evaluation/`
- **MCP tools under test**: eval_run_ablation, eval_reporting_dashboard
- **Evidence capture**: Tool output saved as verdict evidence

### Data Flow
Read playbook scenario -> Verify preconditions (flag, data) -> Execute MCP tool call -> Compare response to expected behavior -> Record pass/fail verdict -> Capture evidence
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight
- [ ] Verify MCP server health
- [ ] Confirm SPECKIT_ABLATION=true is set
- [ ] Confirm ground truth queries exist for ablation
- [ ] Check eval database for prior run data (for EX-027)

### Phase 2: Ablation Scenario (EX-026)
- [ ] EX-026: Run eval_run_ablation with channels [vector, bm25, graph] and storeResults:true
- [ ] Verify per-channel Recall@20 deltas in response
- [ ] Confirm results stored in eval_metric_snapshots

### Phase 3: Dashboard Scenario (EX-027)
- [ ] EX-027: Run eval_reporting_dashboard with format:text
- [ ] EX-027: Run eval_reporting_dashboard with format:json
- [ ] Verify both outputs contain sprint/channel trend data

### Phase 4: Wrap-up
- [ ] Record all verdicts in tasks.md and checklist.md
- [ ] Complete implementation-summary.md with findings
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each of the 2 evaluation scenarios | MCP tool calls |
| Verification | Response structure and content | Visual inspection of tool output |
| Evidence | Capture tool responses | Copy/paste tool output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server | Internal | Green | Cannot execute any scenarios |
| SPECKIT_ABLATION=true | Internal | Yellow | EX-026 returns disabled-flag error |
| Ground truth queries | Internal | Yellow | Ablation cannot compute Recall@20 without ground truth |
| Prior eval run data | Internal | Yellow | EX-027 dashboard returns empty sprint list |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable (evaluation tools are non-destructive read/measure operations)
- **Procedure**: Ablation metric snapshots written during EX-026 can be identified by timestamp and removed if needed; no other data mutations occur
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Pre-flight) --> Phase 2 (Ablation EX-026) --> Phase 3 (Dashboard EX-027) --> Phase 4 (Wrap-up)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-flight | None | Ablation, Dashboard |
| Ablation | Pre-flight | Dashboard (populates eval data) |
| Dashboard | Ablation | Wrap-up |
| Wrap-up | Dashboard | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Pre-flight | Low | 5 minutes |
| Ablation (1 scenario) | Medium | 10 minutes |
| Dashboard (1 scenario) | Low | 10 minutes |
| Wrap-up | Low | 5 minutes |
| **Total** | | **~30 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Not applicable (non-destructive evaluation operations)

### Rollback Procedure
- Not applicable (no persistent state changes beyond eval snapshots)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Eval metric snapshots from EX-026 can be identified by timestamp if cleanup needed
<!-- /ANCHOR:enhanced-rollback -->
