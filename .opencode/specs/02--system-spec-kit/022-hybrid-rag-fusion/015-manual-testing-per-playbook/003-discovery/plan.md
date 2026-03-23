---
title: "Implementation Plan: manual-testing-per-playbook discovery phase"
description: "Execution plan for Phase 003 discovery scenarios EX-011, EX-012, EX-013. Read playbook context, set up environment, execute each scenario in order, record evidence and verdicts."
trigger_phrases:
  - "discovery phase execution plan"
  - "phase 003 plan"
  - "EX-011 EX-012 EX-013 execution"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook discovery phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Tool Layer** | MCP — Spec Kit Memory |
| **Scenarios** | EX-011 (memory_list), EX-012 (memory_stats), EX-013 (memory_health) |
| **Execution mode** | Manual, sequential |
| **Evidence capture** | Inline tool output or screenshot per scenario |

### Overview
Execute the three Phase 003 discovery scenarios against a live MCP runtime with an indexed memory corpus. Each scenario is run in isolation in the prescribed order. Verdicts follow the review protocol defined in the canonical playbook.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] MCP server is running and reachable
- [ ] Memory corpus has at least one indexed memory (for EX-011/EX-012 to produce output)
- [ ] Playbook context file read: `../scratch/context-playbook.md` §03--discovery
- [ ] Feature catalog context file read: `../scratch/context-feature-catalog.md` §03--discovery

### Definition of Done
- [ ] EX-011 executed and verdict recorded
- [ ] EX-012 executed and verdict recorded
- [ ] EX-013 (full mode + divergent_aliases mode) executed and verdict recorded
- [ ] All P0 checklist items checked with evidence
- [ ] implementation-summary.md filled with results
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential manual execution — each scenario is an isolated MCP tool call sequence

### Key Components
- **MCP runtime**: Hosts memory_list, memory_stats, memory_health tools
- **Indexed corpus**: The memory database against which scenarios run
- **Playbook context**: `../scratch/context-playbook.md` — source of truth for prompts and pass criteria
- **This spec folder**: Records tasks, checklist, and results

### Data Flow
Tester reads playbook → Issues MCP tool call(s) per scenario → Captures tool output → Compares against pass criteria → Records PASS / PARTIAL / FAIL verdict
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `../scratch/context-playbook.md` section 03--discovery for all three scenario definitions
- [ ] Read `../scratch/context-feature-catalog.md` section 03--discovery for feature background
- [ ] Verify MCP server is running and accepting tool calls
- [ ] Confirm at least one memory is indexed (run a quick `memory_list` sanity check)

### Phase 2: Scenario Execution

#### EX-011 — Memory browser (memory_list)
- [ ] Invoke `memory_list` with `specFolder`, `limit`, and `offset` parameters as specified in the playbook
- [ ] Capture full tool output
- [ ] Verify paginated list is returned with memory items and total count
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-012 — System statistics (memory_stats)
- [ ] Invoke `memory_stats` with `folderRanking: "composite"` and `includeScores: true`
- [ ] Capture full tool output
- [ ] Verify dashboard fields are populated: counts, tiers, folder ranking with scores
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-013 — Health diagnostics (memory_health)
- [ ] Invoke `memory_health(reportMode: "full")` — capture output
- [ ] Invoke `memory_health(reportMode: "divergent_aliases")` — capture output
- [ ] Do NOT pass `autoRepair: true` or `confirmed: true`
- [ ] Verify both modes return a valid response with status and diagnostic data
- [ ] Record verdict: PASS / PARTIAL / FAIL

### Phase 3: Verification
- [ ] Transfer verdicts and evidence to implementation-summary.md
- [ ] Check all P0 items in checklist.md
- [ ] Check applicable P1 items (evidence captured, verdicts recorded)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | EX-011: memory_list pagination and counts | MCP tool call |
| Manual | EX-012: memory_stats composite ranking | MCP tool call |
| Manual | EX-013: memory_health full + divergent_aliases | MCP tool call (two calls) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server runtime | Internal | Verify before start | Cannot execute any scenario |
| Indexed memory corpus | Internal | Verify before start | EX-011/EX-012 may produce empty output |
| `../scratch/context-playbook.md` | Internal | Available | Cannot confirm pass criteria without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: EX-013 health check reveals index corruption or FTS mismatch
- **Procedure**: Record the exact diagnostic output as evidence; do not trigger autoRepair; escalate before proceeding
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Execution) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | MCP server running | Execution |
| Execution | Setup complete | Verification |
| Verification | All 3 scenarios executed | Phase closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5-10 minutes |
| Scenario Execution | Low | 15-20 minutes |
| Verification | Low | 5-10 minutes |
| **Total** | | **25-40 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] No autoRepair flags will be passed during discovery execution
- [ ] Corpus state noted before starting (rough count of indexed memories)

### Rollback Procedure
1. If a scenario produces unexpected mutations, stop immediately
2. Check corpus state with `memory_list` to assess change
3. If corruption detected, escalate — do not attempt self-repair in this phase
4. Record all observed state in implementation-summary.md

### Data Reversal
- **Has data side effects?** No — all three scenarios are read-only
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
