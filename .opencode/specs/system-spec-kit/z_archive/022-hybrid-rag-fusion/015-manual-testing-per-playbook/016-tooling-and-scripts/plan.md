---
title: "Implementation [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/016-tooling-and-scripts/plan]"
description: "Execution plan for 65 tooling-and-scripts scenario IDs across 5 groups: phase workflow, main-agent review, session capturing pipeline quality, tooling utilities, runtime audits, command routing, and JSON mode structured summary hardening."
trigger_phrases:
  - "tooling scripts manual testing"
  - "016 testing"
  - "016 tooling and scripts plan"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/016-tooling-and-scripts"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: 016-Tooling-and-Scripts Manual Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell, Node.js, Python (tooling under test) |
| **Framework** | system-spec-kit manual testing playbook |
| **Storage** | Spec folder documentation + evidence artifacts |
| **Testing** | Manual execution per playbook scenario |

### Overview
This plan structures execution of 65 exact scenario IDs across 33 scenario files in the 16--tooling-and-scripts playbook category. The scenarios are organized into 5 groups: Phase Workflow (5 IDs), Main-Agent Review (1 ID), Session Capturing Pipeline Quality (18 IDs with sub-scenarios), Tooling Utilities and Runtime Audits (25 IDs), and JSON Mode Structured Summary Hardening (16 IDs with sub-scenarios). Execution proceeds from non-destructive inspections through sandbox-constrained destructive tests, with evidence captured per-scenario.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All 33 playbook scenario files exist in manual_testing_playbook/16--tooling-and-scripts/
- [ ] generate-context.js script is functional (required for M-007 group)
- [ ] Sandbox folders prepared for destructive tests (PHASE-002 through PHASE-005, 099, 113)
- [ ] MCP runtime available for memory_save and slash-command scenarios
- [ ] All 5 CLI environments identified for M-007e through M-007i (defer unavailable)

### Definition of Done
- [ ] All 65 exact scenario IDs have individual pass/fail evidence
- [ ] Checklist fully populated with evidence references
- [ ] Implementation-summary.md completed with execution results
- [ ] Zero untested scenarios remaining
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual testing pipeline with evidence-first verdicting

### Key Components
- **Playbook Scenarios**: 33 source files defining prompts, commands, and expected outcomes
- **Evidence Collection**: Per-scenario transcripts, logs, and command output
- **Verdict Assignment**: PASS / PARTIAL / FAIL per review protocol rules
- **Sub-Scenario Tracking**: Individual tracking for M-007a-q and 153-A-O expansions

### Data Flow
Playbook scenario -> execute commands -> capture evidence -> assign verdict -> record in checklist

### Sub-Scenario Grouping Strategy
Two groups have sub-scenario expansions that require individual tracking:

**M-007 (18 IDs total):** The parent scenario (M-007) defines the overall session capturing pipeline quality contract. Sub-scenarios M-007a through M-007q each test a specific aspect: JSON authority (a), thin rejection (b), CLI scoping (c), enrichment (d), five CLI fallback paths (e-i), hard-fail (j), version warnings (k-l), input modes (m-n), path handling (o), JSON coverage (p), and output hardening (q). Execute sequentially as some share pipeline state.

**153 (16 IDs total):** The parent scenario (153) defines the overall JSON mode structured summary hardening contract. Sub-scenarios 153-A through 153-O each test an independent field propagation or validation path. Can be parallelized as they are independent code paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify all 33 scenario files exist in playbook/16--tooling-and-scripts/
- [ ] Confirm generate-context.js runs without errors
- [ ] Prepare sandbox folders for PHASE-002 through PHASE-005
- [ ] Confirm MCP runtime for memory_save scenarios
- [ ] Identify available CLI environments for M-007e through M-007i

### Phase 2: Non-Destructive Tests (Group A partial + Group D partial)
- [ ] Execute PHASE-001 (phase detection scoring -- read-only)
- [ ] Execute 061, 062, 070, 089, 108, 127, 128, 181 (inspection and strict-validation scenarios)
- [ ] Execute 135, 136, 137, 138 (feature catalog and compliance checks)
- [ ] Execute M-009, M-010, M-011 (runtime family census, naming parity, Gemini path resolution)
- [ ] Execute 147 (constitutional memory manager -- read-only validation)
- [ ] Execute 150, 151, 152, 186 (alignment, structure, and `/memory:manage` routing validation)

### Phase 3: Sub-Scenario Expansions
- [ ] Execute M-007 parent scenario
- [ ] Execute M-007a through M-007q individually (17 sub-scenarios)
- [ ] Execute 153 parent scenario
- [ ] Execute 153-A through 153-O individually (15 sub-scenarios)

### Phase 4: Destructive / Sandbox Tests
- [ ] Execute M-004 (main-agent review -- requires agent interaction)
- [ ] Execute PHASE-002 through PHASE-005 (creates temporary folders)
- [ ] Execute 099 (filesystem watcher -- modifies watched directories)
- [ ] Execute 113 (admin CLI -- uses disposable scope)
- [ ] Execute 139 (session capturing -- pipeline mutations)
- [ ] Execute 149 (rendered memory template -- file validation)
- [ ] Execute 154 (JSON-primary deprecation -- rejection testing)

### Phase 5: Evidence Collection and Verdict
- [ ] Verify all 65 scenario IDs have captured evidence
- [ ] Assign PASS / PARTIAL / FAIL per scenario using review protocol rules
- [ ] Update checklist with evidence references
- [ ] Complete implementation-summary.md with results
- [ ] Clean up sandbox folders
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Group | Scenario Count | Execution Type | Notes |
|-------|---------------|----------------|-------|
| A: Phase Workflow | 5 | Manual shell | PHASE-001 non-destructive; PHASE-002 through PHASE-005 require sandbox |
| B: Main-Agent Review | 1 | Manual + agent | Requires agent interaction for verdict handoff |
| C: Session Capturing | 18 (1+17) | Manual + MCP | Sequential execution; CLI-specific sub-scenarios may need deferral |
| D: Tooling Utilities | 20 | Manual + Vitest | Mix of inspection, test suites, and validation scripts |
| E: JSON Mode Hardening | 16 (1+15) | Manual + MCP | Independent sub-scenarios; can parallelize |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Playbook scenario files (33) | Internal | Green | Cannot execute without source scenarios |
| generate-context.js | Internal | Green | M-007 group cannot be tested |
| MCP runtime | Runtime | Yellow | M-007, 147, 149 require live MCP |
| CLI environments (5) | External | Yellow | M-007e through M-007i may need deferral |
| Sandbox workspace | Infrastructure | Green | Destructive tests need disposable folders |
| create.sh / validate.sh | Internal | Green | PHASE scenarios depend on these scripts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Destructive test modifies non-sandbox content or evidence is captured incorrectly
- **Procedure**: Remove sandbox folders, revert any non-sandbox file changes, re-execute affected scenarios from clean state
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──► Phase 2 (Non-Destructive) ──► Phase 3 (Sub-Scenarios) ──► Phase 4 (Destructive) ──► Phase 5 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1: Preconditions | None | All other phases |
| 2: Non-Destructive | Phase 1 | Phase 5 |
| 3: Sub-Scenarios | Phase 1 | Phase 5 |
| 4: Destructive | Phase 1 | Phase 5 |
| 5: Verdict | Phases 2, 3, 4 | None |

Note: Phases 2, 3, and 4 can run in parallel after Phase 1 completes.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 30 min |
| Non-Destructive Tests | Medium | 2.5-3.5 hours (20 scenarios) |
| Sub-Scenario Expansions | High | 2-3 hours (34 scenarios with individual tracking) |
| Destructive / Sandbox Tests | Medium | 1-2 hours (11 scenarios) |
| Evidence and Verdict | Low | 30 min |
| **Total** | | **7-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Sandbox folders created and isolated from production content
- [ ] Checkpoint of current memory state (for M-007 and 153 groups)
- [ ] CLI environment availability confirmed

### Rollback Procedure
1. Remove all sandbox folders created during PHASE-002 through PHASE-005
2. Revert any memory files created during M-007 or 153 testing
3. Verify no production content was modified
4. Re-execute failed scenarios from clean state if needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete sandbox artifacts only
<!-- /ANCHOR:enhanced-rollback -->
