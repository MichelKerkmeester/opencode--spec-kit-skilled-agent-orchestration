---
title: "Implementation Plan [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/plan]"
description: "Execution plan for Phase 004 maintenance scenarios EX-014 and EX-035. Read playbook context, set up environment, execute each scenario in order, record evidence and verdicts."
trigger_phrases:
  - "maintenance phase execution plan"
  - "phase 004 plan"
  - "ex-014 ex-035 execution"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: manual-testing-per-playbook maintenance phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Tool Layer** | MCP — Spec Kit Memory + server startup |
| **Scenarios** | EX-014 (memory_index_scan), EX-035 (startup runtime compatibility guards) |
| **Execution mode** | Manual, sequential |
| **Evidence capture** | Inline tool output or screenshot per scenario |

### Overview
Execute the two Phase 004 maintenance scenarios: a workspace index scan via MCP tool call and a startup compatibility guard check via server startup simulation. Each scenario is executed in order per playbook instructions. Verdicts follow the review protocol.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] MCP server is running and reachable
- [ ] Target spec folder for EX-014 identified (at least one markdown file present)
- [ ] Playbook context file read: `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` §04--maintenance
- [ ] Feature catalog context file read: `../scratch/context-feature-catalog.md` §04--maintenance

### Definition of Done
- [ ] EX-014 executed and verdict recorded
- [ ] EX-035 executed and verdict recorded
- [ ] All P0 checklist items checked with evidence
- [ ] implementation-summary.md filled with results
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential manual execution — each scenario is an isolated tool call or server startup sequence

### Key Components
- **MCP runtime**: Hosts memory_index_scan tool (EX-014)
- **Server startup**: Node.js process startup sequence (EX-035)
- **Playbook context**: `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` — source of truth for prompts and pass criteria
- **This spec folder**: Records tasks, checklist, and results

### Data Flow
Tester reads playbook → Issues MCP tool call or triggers startup sequence → Captures output → Compares against pass criteria → Records PASS / PARTIAL / FAIL verdict
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` section 04--maintenance for both scenario definitions
- [ ] Read `../scratch/context-feature-catalog.md` section 04--maintenance for feature background
- [ ] Verify MCP server is running and accepting tool calls
- [ ] Identify a target spec folder with at least one markdown file for EX-014

### Phase 2: Scenario Execution

#### EX-014 — Workspace scanning and indexing (memory_index_scan)
- [ ] Invoke `memory_index_scan` with `specFolder` and `incremental: true` as specified in the playbook
- [ ] Capture full tool output (indexed count, skipped count, any errors)
- [ ] Verify scan completes and reports indexed/skipped breakdown
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-035 — Startup runtime compatibility guards
- [ ] Follow playbook instructions to trigger or simulate the runtime compatibility guard
- [ ] Capture diagnostic output from startup sequence
- [ ] Verify guard fires correctly and emits a clear diagnostic message on incompatibility
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-041 — Memory content update via memory_update
- [ ] Identify an existing memory ID in the sandbox corpus
- [ ] Invoke `memory_update` with updated content, title, or importance tier
- [ ] Capture full tool output (confirmation response)
- [ ] Invoke `memory_list` or `memory_search` to retrieve the updated memory
- [ ] Verify the updated fields reflect the new values and `updated_at` is refreshed
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-042 — Memory deletion via memory_delete
- [ ] Identify a memory ID to delete (use a sandbox/test memory)
- [ ] Invoke `memory_delete` with the target memory ID
- [ ] Capture full tool output (deletion confirmation)
- [ ] Invoke `memory_list` to confirm the memory no longer appears
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-043 — Bulk delete with filter criteria
- [ ] Create a checkpoint before executing (for rollback safety)
- [ ] Invoke `memory_bulk_delete` with a filter targeting a specific `specFolder` or `importanceTier` in the sandbox
- [ ] Capture full tool output (deletion count and confirmation)
- [ ] Verify reported deletion count matches expected number of targeted memories
- [ ] Verify non-matching memories are unaffected via `memory_list`
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-044 — Health check diagnostics
- [ ] Invoke `memory_health(reportMode: "full")`
- [ ] Capture full tool output
- [ ] Verify the diagnostic report includes status for: database connectivity, embedding provider, FTS integrity, alias conflicts
- [ ] Verify any detected issues are clearly flagged with severity
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### EX-045 — Index scan and repair
- [ ] Create a checkpoint before executing (for rollback safety)
- [ ] Invoke `memory_index_scan` with `force: true` to trigger full re-index
- [ ] Capture full tool output (indexed, updated, failed, staleDeleted counts)
- [ ] Invoke `memory_health(reportMode: "full")` to verify post-scan index integrity
- [ ] Verify health check shows no FTS mismatches or index corruption
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
| Manual | EX-014: memory_index_scan incremental mode | MCP tool call |
| Manual | EX-035: startup runtime compatibility guard | Server startup / Node.js process |
| Manual | EX-041: memory_update on existing memory | MCP tool call (mutating) |
| Manual | EX-042: memory_delete on a known ID | MCP tool call (mutating) |
| Manual | EX-043: memory_bulk_delete with filter | MCP tool call (mutating, sandbox) |
| Manual | EX-044: memory_health full diagnostics | MCP tool call |
| Manual | EX-045: memory_index_scan force + health check | MCP tool call (two calls, mutating) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server runtime | Internal | Verify before start | Cannot execute EX-014 |
| Node.js runtime version info | Internal | Verify before start | Cannot execute EX-035 |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Internal | Available | Cannot confirm pass criteria without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: EX-014 scan corrupts index state or EX-035 leaves server in bad state
- **Procedure**: Record exact diagnostic output; do not attempt self-repair; escalate before proceeding
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Execution) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | MCP server running | Execution |
| Execution | Setup complete | Verification |
| Verification | Both scenarios executed | Phase closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5-10 minutes |
| Scenario Execution (EX-014, EX-035) | Low-Medium | 20-30 minutes |
| Scenario Execution (EX-041 to EX-045) | Medium | 30-45 minutes |
| Verification | Low | 5-10 minutes |
| **Total** | | **60-95 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] Using incremental (not force) mode for EX-014 unless playbook requires force
- [ ] Corpus state noted before EX-014 (rough count of indexed memories)

### Rollback Procedure
1. If EX-014 produces unexpected state changes, stop and assess with `memory_list`
2. If EX-035 leaves server in bad state, restart the MCP server cleanly
3. Record all observed state in implementation-summary.md

### Data Reversal
- **EX-014 side effects?** Yes — index scan may add new entries; incremental mode minimizes impact
- **EX-035 side effects?** No — startup guard simulation does not modify persistent state
<!-- /ANCHOR:enhanced-rollback -->
