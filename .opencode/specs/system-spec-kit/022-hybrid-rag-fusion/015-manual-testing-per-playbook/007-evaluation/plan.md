---
title: "Implementation Plan [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/007-evaluation/plan]"
description: "Execute 2 evaluation scenarios from the manual testing playbook covering ablation studies and reporting dashboard."
trigger_phrases:
  - "evaluation test plan"
  - "ablation test plan"
  - "dashboard test plan"
importance_tier: "important"
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
- **Playbook scenarios**: `.opencode/skill/system-spec-kit/manual_testing_playbook/07--evaluation/` (EX-026/EX-027), `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/` (EX-046/EX-047/EX-048), and `.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/` (EX-049)
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

### Phase 4: Evaluation Dashboard Generation (EX-046)
- [ ] EX-046: Run eval_reporting_dashboard with format:json and a sprintFilter targeting a specific sprint label
- [ ] Verify the returned JSON only contains data for the filtered sprint
- [ ] Verify structure includes sprint metrics, channel breakdown, and trend data
- [ ] Record verdict: PASS / PARTIAL / FAIL

### Phase 5: Ablation Study with Custom Channels (EX-047)
- [ ] EX-047: Run eval_run_ablation with channels restricted to ["vector", "bm25"] only and storeResults:true
- [ ] Verify ablation output contains per-channel Recall@20 deltas only for vector and bm25
- [ ] Verify no graph channel data appears in results
- [ ] Verify results are stored in eval_metric_snapshots
- [ ] Record verdict: PASS / PARTIAL / FAIL

### Phase 6: Baseline Comparison Reporting (EX-048)
- [ ] EX-048a: Run eval_reporting_dashboard with format:text — capture output as baseline snapshot
- [ ] EX-048b: Run eval_run_ablation with storeResults:true to inject new eval data
- [ ] EX-048c: Run eval_reporting_dashboard with format:text again — capture output as comparison snapshot
- [ ] Compare the two dashboard outputs: verify the second reflects the new eval run data
- [ ] Verify sprint count or metric values differ between snapshots
- [ ] Record verdict: PASS / PARTIAL / FAIL

### Phase 7: Learning History Retrieval (EX-049)
- [ ] EX-049: Run memory_get_learning_history with a specFolder known to have prior context saves
- [ ] Verify the response contains a chronological list of entries with timestamps and session summaries
- [ ] Verify entries are ordered by date (oldest to newest or newest to oldest as documented)
- [ ] Record verdict: PASS / PARTIAL / FAIL

### Phase 8: Wrap-up
- [ ] Record all verdicts in tasks.md and checklist.md
- [ ] Complete implementation-summary.md with findings
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each of the 6 evaluation scenarios | MCP tool calls |
| Verification | Response structure and content | Visual inspection of tool output |
| Evidence | Capture tool responses | Copy/paste tool output |
| Comparison | EX-048 baseline vs. post-ablation dashboard | Side-by-side output diff |
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
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Pre-flight) --> Phase 2 (Ablation EX-026) --> Phase 3 (Dashboard EX-027) --> Phase 4 (EX-046) --> Phase 5 (EX-047) --> Phase 6 (EX-048) --> Phase 7 (EX-049) --> Phase 8 (Wrap-up)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-flight | None | Ablation, Dashboard |
| Ablation EX-026 | Pre-flight | Dashboard (populates eval data) |
| Dashboard EX-027 | Ablation | EX-046, EX-047 |
| Dashboard Gen EX-046 | EX-027 | EX-047 |
| Custom Ablation EX-047 | EX-046 | EX-048 |
| Baseline Comparison EX-048 | EX-047 | EX-049 |
| Learning History EX-049 | EX-048 | Wrap-up |
| Wrap-up | EX-049 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Pre-flight | Low | 5 minutes |
| Ablation EX-026 | Medium | 10 minutes |
| Dashboard EX-027 | Low | 10 minutes |
| Dashboard Generation EX-046 | Low | 10 minutes |
| Custom Ablation EX-047 | Medium | 10 minutes |
| Baseline Comparison EX-048 | Medium | 15 minutes |
| Learning History EX-049 | Low | 5 minutes |
| Wrap-up | Low | 5 minutes |
| **Total** | | **~70 minutes** |
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
