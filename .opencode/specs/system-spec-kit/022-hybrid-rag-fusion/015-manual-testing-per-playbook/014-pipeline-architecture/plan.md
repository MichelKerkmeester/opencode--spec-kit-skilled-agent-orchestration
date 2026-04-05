---
title: "Implementatio [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/014-pipeline-architecture/plan]"
description: "Execution plan for 18 pipeline architecture scenarios. Sequences preconditions, non-destructive execution, destructive execution, and evidence collection for PASS/FAIL/SKIP verdicts."
trigger_phrases:
  - "pipeline architecture execution plan"
  - "phase 014 plan"
  - "manual testing pipeline plan"
  - "pipeline test execution"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Manual Testing — Pipeline Architecture (Phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | MCP (Spec Kit Memory tools), shell, Vitest |
| **Framework** | spec-kit Level 2 |
| **Storage** | Evidence artifacts in scratch/; results recorded in checklist.md |
| **Testing** | Manual execution following playbook scenario steps |

### Overview
This plan sequences the execution of all 18 pipeline architecture scenarios assigned to Phase 014. It separates non-destructive query and inspection scenarios from state-changing scenarios that require sandbox isolation, and defines evidence collection and verdict assignment procedures for each.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Playbook scenario files for IDs 049, 050, 051, 052, 053, 054, 067, 071, 076, 078, 080, 087, 095, 112, 115, 129, 130, and 146 are accessible
- [ ] Feature catalog entries in `../../feature_catalog/14--pipeline-architecture/` are accessible
- [ ] Review protocol loaded: `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- [ ] MCP runtime available for MCP-tagged scenarios
- [ ] Disposable sandbox or checkpoint-backed environment available for scenarios 080, 112, 115, and 130

### Definition of Done
- [ ] All 18 scenarios executed and verdicted (PASS / FAIL / SKIP)
- [ ] Evidence captured per scenario (transcript, output snippet, or explicit skip reason)
- [ ] All FAIL verdicts have defect notes
- [ ] checklist.md P0 items marked with evidence
- [ ] implementation-summary.md updated with final results
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution pipeline with evidence-gated verdict assignment.

### Key Components
- **Preconditions gate**: Confirms runtime access, sandbox readiness, env-flag control, and checkpoint expectations before any scenario runs
- **Scenario executor**: Runs the exact prompt and command sequence defined by the playbook for each scenario
- **Evidence collector**: Captures transcripts, output snippets, DB or log references, and any restart or rollback artefacts
- **Verdict reviewer**: Applies acceptance checks from the playbook and verdict rules from the review protocol

### Data Flow
Preconditions confirmed → execute exact scenario prompt and commands → collect evidence → compare observed vs expected → assign PASS/FAIL/SKIP verdict → roll up to phase summary
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Load playbook rows for all 18 pipeline architecture scenario IDs
- [ ] Load review protocol verdict rules
- [ ] Confirm feature catalog links for all 18 scenarios
- [ ] Verify MCP runtime access for MCP-tagged scenarios (049, 050, 051, 052, 053, 054, 067, 095)
- [ ] Establish disposable sandbox or checkpoint for destructive scenarios: 080, 112, 115, 130

### Phase 2: Non-Destructive Scenarios
- [ ] Execute 049 — 4-stage pipeline refactor: `Trace one query through all 4 stages.`
- [ ] Execute 050 — MPAB chunk-to-memory aggregation: `Verify MPAB chunk aggregation (R1).`
- [ ] Execute 051 — Chunk ordering preservation: `Validate chunk ordering preservation (B2).`
- [ ] Execute 052 — Template anchor optimization: `Verify template anchor optimization (S2).`
- [ ] Execute 053 — Validation signals as retrieval metadata: `Validate S3 retrieval metadata weighting.`
- [ ] Execute 054 — Learned relevance feedback: `Verify learned relevance feedback (R11).`
- [ ] Execute 067 — Search pipeline safety: `Validate search pipeline safety bundle.`
- [ ] Execute 071 — Performance improvements: `Verify performance improvements (Sprint 8).`
- [ ] Execute 076 — Activation window persistence: `Verify activation window persistence.`
- [ ] Execute 078 — Legacy V1 pipeline removal: `Verify legacy V1 removal.`
- [ ] Execute 087 — DB_PATH extraction: `Validate DB_PATH extraction/import standardization.`
- [ ] Execute 095 — Strict Zod schema validation: `Validate SPECKIT_STRICT_SCHEMAS enforcement.`
- [ ] Execute 129 — Lineage state projection: `Run the lineage state verification suite.`
- [ ] Execute 146 — Dynamic server instructions: `Validate dynamic server instructions at MCP initialization.`

### Phase 3: Destructive and State-Changing Scenarios
- [ ] Execute 080 — Pipeline and mutation hardening in disposable sandbox: `Validate phase-017 pipeline and mutation hardening.`
- [ ] Execute 112 — Cross-process DB hot rebinding in isolated environment: `Validate cross-process DB hot rebinding via marker file.`
- [ ] Execute 115 — Transaction atomicity on rename failure in isolated fixture: `Simulate rename failure after DB commit and verify pending file survives.`
- [ ] Execute 130 — Lineage backfill rollback drill with pre-drill checkpoint: `Run the lineage backfill + rollback verification suite.`
- [ ] Record checkpoint name, mutated resource, and rollback evidence for each destructive drill

### Phase 4: Evidence Collection and Verdict
- [ ] Attach prompt, command transcript, key output snippets, and artefact references for every scenario
- [ ] Apply PASS/FAIL/SKIP at the scenario level using playbook acceptance criteria
- [ ] Confirm 18/18 scenarios are verdicted with no "Not Started" remaining
- [ ] Mark all P0 checklist items in checklist.md with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| 049 | 4-stage pipeline refactor | `Trace one query through all 4 stages.` | MCP |
| 050 | MPAB chunk-to-memory aggregation | `Verify MPAB chunk aggregation (R1).` | MCP |
| 051 | Chunk ordering preservation | `Validate chunk ordering preservation (B2).` | MCP |
| 052 | Template anchor optimization | `Verify template anchor optimization (S2).` | MCP |
| 053 | Validation signals as retrieval metadata | `Validate S3 retrieval metadata weighting.` | MCP |
| 054 | Learned relevance feedback | `Verify learned relevance feedback (R11).` | MCP |
| 067 | Search pipeline safety | `Validate search pipeline safety bundle.` | MCP |
| 071 | Performance improvements | `Verify performance improvements (Sprint 8).` | manual |
| 076 | Activation window persistence | `Verify activation window persistence.` | manual |
| 078 | Legacy V1 pipeline removal | `Verify legacy V1 removal.` | manual |
| 080 | Pipeline and mutation hardening | `Validate phase-017 pipeline and mutation hardening.` | manual (sandbox) |
| 087 | DB_PATH extraction and import standardisation | `Validate DB_PATH extraction/import standardization.` | manual |
| 095 | Strict Zod schema validation | `Validate SPECKIT_STRICT_SCHEMAS enforcement.` | MCP |
| 112 | Cross-process DB hot rebinding | `Validate cross-process DB hot rebinding via marker file.` | manual (sandbox) |
| 115 | Transaction atomicity on rename failure | `Simulate rename failure after DB commit and verify pending file survives.` | manual (sandbox) |
| 129 | Lineage state active projection and asOf resolution | `Run the lineage state verification suite.` | manual |
| 130 | Lineage backfill rollback drill | `Run the lineage backfill + rollback verification suite.` | manual (sandbox) |
| 146 | Dynamic server instructions | `Validate dynamic server instructions at MCP initialization.` | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Internal | Unknown | Exact prompts and pass criteria cannot be verified |
| `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Internal | Unknown | Verdict rules cannot be applied consistently |
| `../../feature_catalog/14--pipeline-architecture/` | Internal | Unknown | Feature context and review triage lose canonical reference |
| MCP runtime with Spec Kit Memory tools | Runtime | Unknown | MCP-tagged scenarios cannot be executed |
| Shell access for Vitest suites and env toggles | Runtime | Unknown | Vitest-based scenarios (129, 130) cannot be executed |
| Disposable sandbox or checkpoint workflow | Operational | Unknown | Destructive scenarios (080, 112, 115, 130) cannot be safely run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A destructive scenario (080, 112, 115, 130) leaves DB state in an unexpected condition
- **Procedure**: Restore the pre-scenario checkpoint or discard the disposable sandbox immediately. Do not continue to the next scenario until the baseline is clean
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──────┐
                              ├──► Phase 2 (Non-Destructive) ──► Phase 4 (Verdict)
Phase 1 (Preconditions) ──────┤
                              └──► Phase 3 (Destructive) ───────► Phase 4 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | All execution phases |
| Non-Destructive | Preconditions | Verdict |
| Destructive | Preconditions + sandbox ready | Verdict |
| Verdict | Non-Destructive + Destructive | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 30 minutes |
| Non-Destructive Scenarios (14) | Medium | 3-4 hours |
| Destructive Scenarios (4) | High | 2-3 hours |
| Verdict and Evidence | Low | 1 hour |
| **Total** | | **6-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Scenario Checklist (Destructive)
- [ ] Checkpoint created or sandbox confirmed disposable
- [ ] Baseline state recorded (DB path, relevant file list, edge counts)
- [ ] Recovery procedure documented before starting

### Rollback Procedure
1. Stop execution immediately on unexpected state change
2. Restore checkpoint or dispose of sandbox
3. Verify clean baseline before retrying
4. If baseline cannot be restored, mark scenario as SKIP with reason "sandbox isolation failure"

### Data Reversal
- **Has data mutations?** Yes (scenarios 080, 112, 115, 130)
- **Reversal procedure**: Restore pre-scenario checkpoint; discard disposable sandbox
<!-- /ANCHOR:enhanced-rollback -->
