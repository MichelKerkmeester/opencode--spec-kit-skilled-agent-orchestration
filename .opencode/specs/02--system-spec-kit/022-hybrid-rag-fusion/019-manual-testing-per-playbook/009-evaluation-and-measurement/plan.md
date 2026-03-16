---
title: "Implementation Plan: evaluation-and-measurement [template:level_1/plan.md]"
description: "Phase 009 execution plan for manual testing coverage of evaluation-and-measurement scenarios. Organizes the preconditions, run sequence, evidence collection, and verdict process for the 16 mapped measurement tests."
trigger_phrases:
  - "evaluation and measurement implementation plan"
  - "phase 009 measurement plan"
  - "manual testing measurement workflow"
  - "evaluation playbook execution plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: evaluation-and-measurement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Spec folder markdown files |
| **Testing** | manual + MCP |

### Overview
Phase 009 documents manual testing coverage for the 16 scenarios assigned to `09--evaluation-and-measurement`. The plan follows the playbook prompts and feature catalog summaries so each run can move from setup through execution, evidence capture, and verdict assignment without losing measurement-specific context such as isolated eval storage, ablation reporting, baseline snapshots, and INT8 decision review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase map confirms Phase 009 is `Measurement tests` with 16 scenarios.
- [x] Each test ID is mapped to one `09--evaluation-and-measurement` feature catalog entry.
- [x] Exact prompts and acceptance criteria are captured from the manual testing playbook.
- [ ] Runtime prerequisites for MCP-backed scenarios are available in the target sandbox.

### Definition of Done
- [ ] All 16 scenarios have documented prompts, commands or inspection steps, evidence expectations, and verdict notes.
- [ ] Evidence is sufficient to issue PASS, PARTIAL, or FAIL for every scenario.
- [ ] No mapped feature in Phase 009 ends with verdict FAIL for release-readiness review.
- [ ] Coverage remains 16/16 against the parent phase map.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution pipeline

### Key Components
- **Preconditions**: Confirm dataset, flags, isolated DB paths, and runtime access before any scenario begins.
- **Execute**: Run the exact prompt-driven workflow as a manual inspection or MCP-backed command sequence.
- **Evidence**: Capture transcripts, DB snapshots, logs, dashboard output, or code-inspection notes that match the playbook row.
- **Verdict**: Compare evidence to the scenario acceptance criteria and assign PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute -> evidence -> verdict`

The pipeline stays consistent across all measurement scenarios: establish the target eval/context state first, run the scenario with the exact prompt, collect proof artifacts, then decide the verdict using the playbook acceptance checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Confirm the Phase 009 mapping against the parent packet and the 16 feature catalog entries.
- [ ] Prepare isolated eval/context DB paths for scenarios that write measurement artifacts.
- [ ] Verify MCP runtime access, required flags, and any baseline corpus or fixture prerequisites.
- [ ] Decide which scenarios are inspection-only versus command-driven before execution starts.

### Phase 2: Non-Destructive Tests
- [ ] Run inspection-oriented scenarios first: NEW-009, NEW-010, NEW-072, NEW-088, NEW-090.
- [ ] Run reproducible runtime scenarios next: NEW-006, NEW-007, NEW-008, NEW-011, NEW-012, NEW-013, NEW-014, NEW-015.
- [ ] Reserve NEW-005, NEW-082, and NEW-126 for isolated runs where writes and persisted snapshots can be inspected clearly.

### Phase 3: Destructive Tests
- [ ] No dedicated destructive scenarios are defined for Phase 009.
- [ ] If a scenario requires mutating eval or context stores beyond disposable fixtures, run it only in a sandbox or after taking a checkpoint, then restore before the next scenario.
- [ ] Apply reset steps only when persistence or restart behavior is part of the acceptance check.

### Phase 4: Evidence Collection and Verdict
- [ ] Capture command transcripts, inspection notes, DB/log extracts, and dashboard or test-suite output for every scenario.
- [ ] Compare evidence against the exact PASS/FAIL criteria from the playbook row.
- [ ] Record PASS, PARTIAL, or FAIL with concise rationale and note any retry or escalation follow-up.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| NEW-005 | Evaluation database and schema | `Verify evaluation DB/schema writes.` | MCP |
| NEW-006 | Core metric computation | `Validate core metric computation (R13-S1).` | MCP |
| NEW-007 | Observer effect mitigation | `Check observer effect mitigation (D4).` | MCP |
| NEW-008 | Full-context ceiling evaluation | `Run full-context ceiling evaluation (A2).` | MCP |
| NEW-009 | Quality proxy formula | `Compute and verify quality proxy formula (B7).` | manual |
| NEW-010 | Synthetic ground truth corpus | `Audit synthetic ground-truth corpus coverage.` | manual |
| NEW-011 | BM25-only baseline | `Run BM25-only baseline measurement.` | MCP |
| NEW-012 | Agent consumption instrumentation | `Validate G-NEW-2 instrumentation behavior.` | MCP |
| NEW-013 | Scoring observability | `Verify scoring observability (T010).` | MCP |
| NEW-014 | Full reporting and ablation study framework | `Execute manual ablation run (R13-S3).` | MCP |
| NEW-015 | Shadow scoring and channel attribution | `Verify shadow scoring deactivation and attribution continuity.` | MCP |
| NEW-072 | Test quality improvements | `Audit test quality improvements.` | manual |
| NEW-082 | Evaluation and housekeeping fixes | `Validate evaluation and housekeeping fixes.` | MCP |
| NEW-088 | Cross-AI validation fixes | `Validate Phase 018 Tier-4 cross-AI fixes.` | manual |
| NEW-090 | INT8 quantization evaluation | `Re-evaluate INT8 quantization decision criteria.` | manual |
| NEW-126 | Memory roadmap baseline snapshot | `Run the memory roadmap baseline snapshot verification suite.` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Manual testing playbook source | Internal | Green | Exact prompts, evidence rules, and acceptance criteria for Phase 009 cannot be reconstructed accurately |
| Evaluation-and-measurement feature catalog | Internal | Green | Scenario context and feature-level grounding for isolated eval DBs, ablation reporting, baseline snapshots, and INT8 decision state are lost |
| MCP runtime and supporting test environment | Internal | Yellow | MCP-backed scenarios, dashboard checks, and `memory-state-baseline.vitest.ts` cannot be executed or verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scenario mapping is found to be wrong, execution guidance conflicts with the playbook, or sandbox instructions are unsafe for repeated runs.
- **Procedure**: Revert `spec.md` and `plan.md` for Phase 009 to the last correct version or remove the packet files and regenerate them from the Level 1 templates using the verified playbook and feature catalog inputs. For runtime test fallout, restore the sandbox or checkpointed eval/context databases before re-running the affected scenario.
<!-- /ANCHOR:rollback -->

---
