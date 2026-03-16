---
title: "Implementation Plan: Manual Testing Playbook Phase 014 Pipeline Architecture"
description: "This plan defines how operators should prepare, sequence, and review the phase 014 pipeline-architecture scenarios. It packages prompts, execution modes, evidence expectations, and rollback guidance into a single runbook-aligned plan."
trigger_phrases:
  - "implementation plan"
  - "manual testing"
  - "pipeline architecture"
  - "phase 014"
  - "NEW-146"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Manual Testing Playbook Phase 014 Pipeline Architecture

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Documentation only; evidence lives in transcripts, logs, and test artifacts |
| **Testing** | manual + MCP |

### Overview
This plan covers the 18 pipeline-architecture scenarios assigned to phase 014 of the manual testing playbook effort. It turns the playbook rows, review protocol, and feature-catalog context into an execution pipeline that keeps non-destructive checks separate from restart, mutation, and rollback drills.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The canonical playbook rows for `NEW-049`, `NEW-050`, `NEW-051`, `NEW-052`, `NEW-053`, `NEW-054`, `NEW-067`, `NEW-071`, `NEW-076`, `NEW-078`, `NEW-080`, `NEW-087`, `NEW-095`, `NEW-112`, `NEW-115`, `NEW-129`, `NEW-130`, and `NEW-146` have been extracted.
- [ ] Every scenario is mapped to a `14--pipeline-architecture` feature file, including shared lineage coverage for `NEW-129` and `NEW-130`.
- [ ] The review protocol has been loaded so scenario, feature, and release verdicts use the same PASS/PARTIAL/FAIL rubric.
- [ ] Operators know which scenarios require restart control, checkpoints, or disposable sandboxes before execution begins.

### Definition of Done
- [ ] `spec.md` and `plan.md` exist in the phase 014 folder with all required sections and anchors.
- [ ] All 18 scenarios have exact prompts captured in the testing-strategy table.
- [ ] Destructive or state-changing scenarios are isolated with explicit sandbox, checkpoint, or rollback rules.
- [ ] The generated documents pass the targeted structural validation used for this documentation task.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation pipeline for manual test execution and review handoff.

### Key Components
- **Preconditions gate**: Confirms runtime access, sandbox availability, env-flag control, and checkpoint expectations before any scenario runs.
- **Scenario executor**: Runs the exact prompt and command sequence defined by the playbook for MCP calls, shell test suites, restarts, or mutation drills.
- **Evidence collector**: Captures transcripts, output snippets, DB/log references, and any restart or rollback artifacts required by the scenario.
- **Verdict reviewer**: Applies scenario acceptance checks from the playbook and feature/release verdict rules from `review_protocol.md`.

### Data Flow
Preconditions -> execute the exact scenario prompt and command sequence -> collect evidence artifacts -> compare observed behavior against PASS criteria -> assign scenario verdict -> roll up to feature verdict using the review protocol.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Confirm access to the phase-14 feature catalog, the merged playbook, and the review protocol.
- [ ] Prepare MCP runtime access for query-driven scenarios and shell access for restart, env-toggle, or Vitest-based scenarios.
- [ ] Establish a disposable sandbox or checkpoint-backed environment for any scenario that mutates DB state or simulates save failures.

### Phase 2: Non-Destructive Tests
- [ ] Execute pipeline-flow, scoring, metadata, and prompt-validation scenarios: `NEW-049`, `NEW-050`, `NEW-051`, `NEW-052`, `NEW-053`, `NEW-054`, `NEW-067`, `NEW-071`, `NEW-076`, `NEW-078`, `NEW-087`, `NEW-095`, `NEW-129`, and `NEW-146`.
- [ ] Use targeted MCP calls or read-only shell/test commands to gather evidence without changing durable state outside approved fixtures.
- [ ] Verify each scenario against its explicit PASS criteria before moving on.

### Phase 3: Destructive Tests
- [ ] Treat `NEW-080`, `NEW-112`, `NEW-115`, and `NEW-130` as state-changing or rollback-sensitive scenarios.
- [ ] Run these scenarios only in disposable sandboxes, isolated worktrees, or checkpoint-backed environments with clear restore points.
- [ ] Record the checkpoint name, mutated resource, and rollback evidence for each destructive drill before closing the scenario.

### Phase 4: Evidence Collection and Verdict
- [ ] Attach the exact prompt, command transcript, key output snippets, and artifact references for every scenario.
- [ ] Apply PASS/PARTIAL/FAIL at the scenario level using the playbook, then roll up feature verdicts with the review protocol.
- [ ] Confirm coverage remains 18/18 for the resolved phase scope, including the recovered `NEW-146` mapping.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|-----------|-------|-------|-------|
| NEW-049 | 4-stage pipeline refactor | `Trace one query through all 4 stages.` | MCP |
| NEW-050 | MPAB chunk-to-memory aggregation | `Verify MPAB chunk aggregation (R1).` | MCP |
| NEW-051 | Chunk ordering preservation | `Validate chunk ordering preservation (B2).` | MCP |
| NEW-052 | Template anchor optimization | `Verify template anchor optimization (S2).` | MCP |
| NEW-053 | Validation signals as retrieval metadata | `Validate S3 retrieval metadata weighting.` | MCP |
| NEW-054 | Learned relevance feedback | `Verify learned relevance feedback (R11).` | MCP |
| NEW-067 | Search pipeline safety | `Validate search pipeline safety bundle.` | MCP |
| NEW-071 | Performance improvements | `Verify performance improvements (Sprint 8).` | manual |
| NEW-076 | Activation window persistence | `Verify activation window persistence.` | manual |
| NEW-078 | Legacy V1 pipeline removal | `Verify legacy V1 removal.` | manual |
| NEW-080 | Pipeline and mutation hardening | `Validate phase-017 pipeline and mutation hardening.` | manual |
| NEW-087 | DB_PATH extraction and import standardization | `Validate DB_PATH extraction/import standardization.` | manual |
| NEW-095 | Strict Zod schema validation | `Validate SPECKIT_STRICT_SCHEMAS enforcement.` | MCP |
| NEW-112 | Cross-process DB hot rebinding | `Validate cross-process DB hot rebinding via marker file.` | manual |
| NEW-115 | Transaction atomicity on rename failure | `Simulate rename failure after DB commit and verify pending file survives` | manual |
| NEW-129 | Lineage state active projection and asOf resolution | `Run the lineage state verification suite.` | manual |
| NEW-130 | Lineage backfill rollback drill | `Run the lineage backfill + rollback verification suite.` | manual |
| NEW-146 | Dynamic server instructions at MCP initialization | `Validate dynamic server instructions at MCP initialization.` | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `manual_testing_playbook/manual_testing_playbook.md` | Internal source | Green | Exact prompts, commands, evidence, and PASS criteria cannot be reconstructed reliably. |
| `manual_testing_playbook/review_protocol.md` | Internal source | Green | Scenario execution could complete without a usable verdict rubric. |
| `../../feature_catalog/14--pipeline-architecture/` | Internal source | Green | Operators lose the feature intent and implementation context behind each scenario. |
| MCP runtime with Spec Kit Memory tools | Runtime | Yellow | MCP-tagged scenarios cannot be exercised or evidence cannot be captured. |
| Shell access for restarts, env toggles, and targeted Vitest suites | Runtime | Yellow | Restart and lineage/backfill scenarios cannot be executed as written. |
| Disposable sandbox/checkpoint workflow | Operational | Yellow | State-changing scenarios would be unsafe to run in shared environments. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The playbook, cross-reference index, or feature catalog changes in a way that invalidates the documented prompt set, mappings, or scenario count.
- **Procedure**: Re-read the canonical sources, update the phase docs to match the latest mapped IDs, and re-run the structural validation checks before reuse.
- **Operational rollback for execution**: For `NEW-080`, `NEW-112`, `NEW-115`, and `NEW-130`, restore the recorded checkpoint or dispose of the sandbox/worktree immediately after evidence capture.
<!-- /ANCHOR:rollback -->

---
