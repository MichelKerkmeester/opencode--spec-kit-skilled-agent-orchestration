---
title: "Implementation Plan [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/005-lifecycle/plan]"
description: "Execution plan for Phase 005 lifecycle scenarios EX-015, EX-016, EX-017, EX-018, 097, 100, 114, 124, 134, 144. Read playbook context, set up environment, execute scenarios in dependency order, record evidence and verdicts."
trigger_phrases:
  - "lifecycle phase execution plan"
  - "phase 005 plan"
  - "checkpoint lifecycle plan"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/005-lifecycle"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: manual-testing-per-playbook lifecycle phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Tool Layer** | MCP — Spec Kit Memory + server lifecycle |
| **Scenarios** | EX-015, EX-016, EX-017, EX-018, 097, 100, 114, 124, 134, 144 |
| **Execution mode** | Manual, dependency-ordered |
| **Evidence capture** | Inline tool output or screenshot per scenario |

### Overview
Execute ten Phase 005 lifecycle scenarios. The checkpoint group (EX-015 to EX-018) must run in order because each scenario depends on state from the previous one. The remaining scenarios (097, 100, 114, 124, 134, 144) are executed per playbook ordering, with scenario 100 (server shutdown) run after all other MCP-dependent scenarios to avoid premature termination.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] MCP server is running and reachable
- [ ] At least one indexed memory available (for checkpoint and archival scenarios)
- [ ] Playbook context file read: `../scratch/context-playbook.md` §05--lifecycle
- [ ] Feature catalog context file read: `../scratch/context-feature-catalog.md` §05--lifecycle
- [ ] Execution order understood (checkpoint chain must run EX-015 → EX-016 → EX-017 → EX-018)

### Definition of Done
- [ ] All 10 scenarios executed and verdicts recorded
- [ ] All P0 checklist items checked with evidence
- [ ] implementation-summary.md filled with results
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-ordered manual execution — checkpoint group forms a stateful chain; other scenarios are largely independent

### Key Components
- **MCP runtime**: Hosts checkpoint, ingest, and archival tools
- **Server lifecycle**: Node.js process start/stop for scenarios 100 and 134
- **Playbook context**: `../scratch/context-playbook.md` — source of truth for prompts and pass criteria
- **This spec folder**: Records tasks, checklist, and results

### Data Flow
Tester reads playbook → Executes scenarios in dependency order → Captures each tool output → Compares against pass criteria → Records PASS / PARTIAL / FAIL verdict → Fills implementation-summary.md
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `../scratch/context-playbook.md` section 05--lifecycle for all 10 scenario definitions
- [ ] Read `../scratch/context-feature-catalog.md` section 05--lifecycle for feature background
- [ ] Verify MCP server is running and accepting tool calls
- [ ] Note current checkpoint list (run `checkpoint_list` as baseline)
- [ ] Note current memory count (run `memory_list` as baseline)

### Phase 2: Scenario Execution

#### Checkpoint Group (must run in order)

**EX-015 — Checkpoint creation (checkpoint_create)**
- [ ] Invoke `checkpoint_create` with a unique name as specified in the playbook
- [ ] Capture full tool output
- [ ] Verify checkpoint name is returned and creation is confirmed
- [ ] Record verdict: PASS / PARTIAL / FAIL

**EX-016 — Checkpoint listing (checkpoint_list)**
- [ ] Invoke `checkpoint_list` (no filter, or with specFolder per playbook)
- [ ] Capture full tool output
- [ ] Verify checkpoint from EX-015 is present in the list
- [ ] Record verdict: PASS / PARTIAL / FAIL

**EX-017 — Checkpoint restore (checkpoint_restore)**
- [ ] Invoke `checkpoint_restore` with the checkpoint name from EX-015
- [ ] Capture full tool output
- [ ] Verify restore completes without error
- [ ] Record verdict: PASS / PARTIAL / FAIL

**EX-018 — Checkpoint deletion (checkpoint_delete)**
- [ ] Invoke `checkpoint_delete` with name and confirmName matching the EX-015 checkpoint
- [ ] Capture full tool output
- [ ] Verify checkpoint is deleted and absent from a subsequent `checkpoint_list` call
- [ ] Record verdict: PASS / PARTIAL / FAIL

#### Async and Server Lifecycle Scenarios

**097 — Async ingestion job lifecycle**
- [ ] Invoke `memory_ingest_start` with target file paths per playbook
- [ ] Poll `memory_ingest_status` at playbook-specified intervals
- [ ] Capture status output at each poll step
- [ ] Verify job reaches completed state
- [ ] Record verdict: PASS / PARTIAL / FAIL

**114 — Path traversal validation**
- [ ] Submit a path traversal payload as specified in the playbook
- [ ] Capture the rejection response
- [ ] Verify a validation error is returned (not a success)
- [ ] Record verdict: PASS / PARTIAL / FAIL

**124 — Automatic archival lifecycle coverage**
- [ ] Follow playbook setup to ensure eligible memories exist for archival
- [ ] Trigger or wait for archival per playbook instructions
- [ ] Capture archival result
- [ ] Verify targeted memories are archived
- [ ] Record verdict: PASS / PARTIAL / FAIL

**134 — Startup pending-file recovery**
- [ ] Follow playbook setup to place a pending file in the queue before server start
- [ ] Restart the MCP server
- [ ] Capture startup output showing pending file recovery
- [ ] Verify pending file is indexed after startup
- [ ] Record verdict: PASS / PARTIAL / FAIL

**144 — Advisory ingest lifecycle forecast**
- [ ] Invoke the ingest forecast tool as specified in the playbook
- [ ] Capture full tool output
- [ ] Verify advisory forecast data is returned
- [ ] Record verdict: PASS / PARTIAL / FAIL

**100 — Async shutdown with deadline (run last among MCP scenarios)**
- [ ] Trigger async server shutdown with deadline per playbook instructions
- [ ] Capture shutdown output
- [ ] Verify server exits cleanly within the deadline
- [ ] Restart MCP server after this scenario if further work is needed
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
| Manual | EX-015 to EX-018: checkpoint create/list/restore/delete chain | MCP tool calls |
| Manual | 097: async ingestion job lifecycle | MCP tool calls + polling |
| Manual | 100: async shutdown with deadline | Server lifecycle |
| Manual | 114: path traversal validation | MCP tool call |
| Manual | 124: automatic archival | MCP tool call |
| Manual | 134: startup pending-file recovery | Server restart |
| Manual | 144: advisory ingest forecast | MCP tool call |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server runtime | Internal | Verify before start | Cannot execute any MCP-dependent scenario |
| Indexed memory corpus | Internal | Verify before start | Checkpoint and archival scenarios may produce empty results |
| `../scratch/context-playbook.md` | Internal | Available | Cannot confirm pass criteria without it |
| EX-015 checkpoint name | Internal (created during execution) | Created in Phase 2 | EX-016, EX-017, EX-018 depend on this |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: EX-017 restore produces unexpected state; scenario 100 leaves server unavailable
- **Procedure for EX-017**: Record exact output; verify memory state with `memory_list`; escalate if state is corrupt
- **Procedure for scenario 100**: Restart MCP server cleanly; continue remaining scenarios
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Execution) ──► Phase 3 (Verification)

Within Phase 2:
EX-015 ──► EX-016 ──► EX-017 ──► EX-018
097, 114, 124, 134, 144 (independent, after setup)
100 (run last — shuts down server)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | MCP server running | Execution |
| EX-015 | Setup complete | EX-016, EX-017, EX-018 |
| EX-016 | EX-015 | EX-017, EX-018 |
| EX-017 | EX-016 | EX-018 |
| EX-018 | EX-017 | None |
| 097, 114, 124, 144 | Setup | None (independent) |
| 134 | Setup | None (requires server restart) |
| 100 | All other MCP scenarios | Phase closure |
| Verification | All 10 scenarios executed | Phase closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10-15 minutes |
| Checkpoint Group (EX-015 to EX-018) | Low-Medium | 20-30 minutes |
| Async/Server Scenarios (097, 100, 114, 124, 134, 144) | Medium | 40-60 minutes |
| Verification | Low | 10-15 minutes |
| **Total** | | **80-120 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] Baseline checkpoint list noted before EX-015
- [ ] Baseline memory count noted before EX-017 (restore may change count)
- [ ] Scenario 100 scheduled as the last MCP-dependent scenario

### Rollback Procedure
1. If EX-017 restore corrupts memory state: stop, record exact output, escalate
2. If scenario 100 terminates server prematurely: restart MCP server; re-run any scenarios that were interrupted
3. If scenario 134 pending-file setup fails: record PARTIAL and note environment constraint
4. Record all observed state in implementation-summary.md

### Data Reversal
- **EX-017 has data side effects?** Yes — restores memory state to checkpoint snapshot
- **Scenario 100 has data side effects?** No — shutdown does not modify persisted data
- **Reversal procedure for EX-017**: Create a fresh checkpoint before EX-017 to enable restoration to pre-restore state if needed
<!-- /ANCHOR:enhanced-rollback -->
