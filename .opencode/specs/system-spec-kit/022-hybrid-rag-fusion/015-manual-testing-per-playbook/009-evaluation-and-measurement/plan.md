---
title: "Implemen [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/009-evaluation-and-measurement/plan]"
description: "Execution plan for running all 16 evaluation-and-measurement manual test scenarios from the hybrid-rag-fusion playbook."
trigger_phrases:
  - "evaluation and measurement plan"
  - "manual testing plan"
  - "eval run ablation execution"
  - "playbook execution plan"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/009-evaluation-and-measurement"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Manual Testing — Evaluation and Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js MCP server |
| **Framework** | spec-kit-memory MCP, SQLite via better-sqlite3 |
| **Storage** | SQLite (memory_index.db, eval_metric_snapshots) |
| **Testing** | Manual execution via MCP tool calls |

### Overview

This plan covers sequential manual execution of 16 playbook scenarios that verify the evaluation and measurement subsystem in the hybrid-rag-fusion memory system. Scenarios have strict ordering dependencies: the eval schema (005) must be verified before metric computation (006), and the ground truth corpus (010) must exist before the BM25 baseline (011). Each scenario is executed, observed, and the result is recorded in checklist.md and tasks.md. No code changes are expected — this is a verification-only phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] MCP server is running and responding to tool calls
- [ ] eval_metric_snapshots table exists (run scenario 005 first to verify)
- [ ] SPECKIT_ABLATION=true is set in environment (required for scenarios 014, 015)
- [ ] A ground truth corpus is available or can be generated (scenario 010)
- [ ] Tester has read the playbook file for each scenario before starting

### Definition of Done

- [ ] All 16 scenario tasks marked complete in tasks.md
- [ ] All 16 P0 checklist items checked with evidence in checklist.md
- [ ] implementation-summary.md filled in with overall result and date
- [ ] No unresolved FAIL findings without a tracked follow-up
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Manual test execution — dependency-ordered scenario runner

### Key Components

- **Playbook files**: Source of truth for each scenario's steps and expected outcomes. Located in `.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/`
- **MCP tool chain**: Scenarios executed via `mcp__spec_kit_memory__eval_run_ablation`, `memory_search`, `memory_stats`, and related tools
- **eval_metric_snapshots table**: Stores ablation and metric results; must exist before metric computation scenarios run
- **Ground truth corpus**: Required for BM25 baseline and ablation scenarios; generated via scenario 010
- **checklist.md**: Evidence log — one P0 item per scenario, updated as runs complete
- **tasks.md**: Progress tracker — one task per scenario, marked complete on pass

### Data Flow

Tester reads playbook scenario → sets required env flags → executes MCP calls → observes response → compares to expected outcome → records PASS/FAIL in checklist and tasks
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Environment Setup

- [ ] Confirm MCP server is running (`memory_health` call succeeds)
- [ ] Confirm SPECKIT_ABLATION=true is set
- [ ] Verify eval_metric_snapshots table exists (or run scenario 005 to create it)
- [ ] Create a named checkpoint: `checkpoint_create({ name: "pre-009-testing" })`

### Phase 2: Schema and Metric Foundation (005–009)

- [ ] Execute scenario 005 — Evaluation database and schema (R13-S1)
- [ ] Execute scenario 006 — Core metric computation (R13-S1)
- [ ] Execute scenario 007 — Observer effect mitigation (D4)
- [ ] Execute scenario 008 — Full-context ceiling evaluation (A2)
- [ ] Execute scenario 009 — Quality proxy formula (B7)
- [ ] Record PASS/FAIL with evidence for each in checklist.md

### Phase 3: Ground Truth and Baseline (010–012)

- [ ] Execute scenario 010 — Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)
- [ ] Execute scenario 011 — BM25-only baseline (G-NEW-1)
- [ ] Execute scenario 012 — Agent consumption instrumentation (G-NEW-2)
- [ ] Record PASS/FAIL with evidence for each in checklist.md

### Phase 4: Reporting and Shadow Scoring (013–015)

- [ ] Execute scenario 013 — Scoring observability (T010)
- [ ] Execute scenario 014 — Full reporting and ablation study framework (R13-S3)
- [ ] Execute scenario 015 — Shadow scoring and channel attribution (R13-S2)
- [ ] Record PASS/FAIL with evidence for each in checklist.md

### Phase 5: Fixes, Validation, and Snapshots (072, 082, 088, 090, 126)

- [ ] Execute scenario 072 — Test quality improvements
- [ ] Execute scenario 082 — Evaluation and housekeeping fixes
- [ ] Execute scenario 088 — Cross-AI validation fixes (Tier 4)
- [ ] Execute scenario 090 — INT8 quantization evaluation (R5)
- [ ] Execute scenario 126 — Memory roadmap baseline snapshot
- [ ] Record PASS/FAIL with evidence for each in checklist.md

### Phase 6: Wrap-Up

- [ ] Confirm all 16 tasks complete in tasks.md
- [ ] Confirm all 16 P0 checklist items checked
- [ ] Fill in implementation-summary.md
- [ ] Restore from checkpoint if DB state was modified destructively
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each of the 16 evaluation scenarios | MCP tool calls |
| Verification | Response structure and metric accuracy | Visual inspection of tool output |
| Evidence | Capture tool responses | Copy/paste tool output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server | Internal | Green | Cannot execute any scenarios |
| SPECKIT_ABLATION=true | Internal | Yellow | Scenarios 014, 015 return disabled-flag error |
| eval_metric_snapshots table | Internal | Yellow | Metric computation scenarios need schema present |
| Ground truth corpus | Internal | Yellow | BM25 baseline and ablation need queries to run against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Eval metric snapshots corrupted or checkpoint needed
- **Procedure**: Restore from checkpoint created in Phase 1; verify eval table integrity; rerun affected scenario

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| SPECKIT_ABLATION not set | Medium | Scenarios 014, 015 return no-op | Check env before starting Phase 4 |
| eval_metric_snapshots table missing | Medium | Scenario 006 fails silently | Run 005 first; verify table presence |
| Scenario 010 corpus generation fails | Low | Blocks 011 and 014 | Document error; manually seed minimal corpus if needed |
| INT8 backend absent for scenario 090 | Medium | Cannot complete quantization path | Mark step as SKIP-ENV; proceed with rest of scenario |
| Cross-AI provider unavailable for 088 | Medium | Cannot validate cross-provider consistency | Mark as SKIP-ENV; document single-provider result |
<!-- /ANCHOR:rollback -->
