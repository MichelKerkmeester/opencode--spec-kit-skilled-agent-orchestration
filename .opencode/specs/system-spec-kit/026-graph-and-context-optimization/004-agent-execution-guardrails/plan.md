---
title: "Implementation Plan: Phase 4 — Agent Execution Guardrails"
description: "Phase 4 updates three AGENTS instruction files so request-analysis guidance stays under Critical Rules, duplicate support scaffolding is removed, later headings stay renumbered cleanly, and the execution guardrails remain explicit across all three targets."
trigger_phrases:
  - "phase 4 plan"
  - "agent execution guardrails plan"
  - "agents guardrail update plan"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-execution-guardrails"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Phase 4 — Agent Execution Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child + level2-verify | v2.2 -->

---

Phase 4 is a three-target instruction update. It begins with direct review of all three AGENTS files, then applies surgical wording changes that keep request-analysis guidance in Section 1 `## 1. CRITICAL RULES`, delete the old standalone request-analysis section, remove duplicate support scaffolding from the moved block, retain later heading renumbering, and preserve the requested execution guardrails across all three targets.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown instruction files in Public and Barter plus Level 2 packet docs |
| **Framework** | Spec Kit child-phase workflow with validator-based closeout |
| **Storage** | Repo-local markdown files in two workspaces across three AGENTS targets |
| **Testing** | Direct file review, guardrail-to-file evidence mapping, and `validate.sh --strict` |

### Overview

The implementation should behave like a narrow policy sync, not a broad rewrite. Review the three AGENTS targets first, identify the smallest instruction blocks that can carry the new behavior clearly, keep that guidance in Critical Rules, delete the old dedicated request-analysis section, strip duplicate scaffolding so the moved block contains only `Flow` plus `#### Execution Behavior`, keep the later top-level headings renumbered, then verify that the final wording covers all eight requested points without weakening existing safety rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] All three target AGENTS files are readable and their current section structure is understood.
- [ ] The packet scope is frozen to the three AGENTS targets plus packet docs and verification.
- [ ] The eight requested guardrails are mapped to planned wording before edits begin.

### Definition of Done

- [ ] All three AGENTS files contain explicit wording for the requested execution guardrails inside `### Request Analysis & Execution` under Critical Rules.
- [ ] The moved request-analysis block contains only `Flow` plus `#### Execution Behavior`, with duplicate scaffolding removed.
- [ ] The old standalone request-analysis top-level section is removed from all three AGENTS files, and later top-level sections are renumbered cleanly.
- [ ] Packet docs remain synchronized with the three-file scope and structure changes.
- [ ] Verification evidence maps all eight guardrails to the final AGENTS wording.
- [ ] `validate.sh --strict` exits cleanly for this phase folder.
- [ ] `implementation-summary.md` records the same-session change set honestly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-first inspection -> surgical instruction updates -> evidence-based verification.

### Key Components

- **Public enterprise example AGENTS file**: the example instruction surface in the Public workspace.
- **Public root AGENTS file**: the main Public runtime instruction surface.
- **Barter coder AGENTS file**: the live instruction surface in the Barter workspace.
- **Critical Rules request-analysis block**: the shared home for planning, research-first behavior, ownership, anti-permission wording, and data-based reasoning, now reduced to `Flow` plus `#### Execution Behavior`.
- **Eight-point guardrail matrix**: the checklist that keeps all three files aligned on meaning.
- **Phase packet docs**: the spec, plan, tasks, checklist, and implementation summary that define and verify the work.

### Data Flow

Read all three AGENTS files -> map current wording to the eight requested guardrails -> keep request-analysis guidance in Critical Rules -> delete the old standalone request-analysis section -> remove duplicate scaffolding from the moved block -> confirm direct transition into `### Tools & Search` -> compare final wording against the guardrail matrix and heading expectations -> validate the packet -> record results in `implementation-summary.md`.

### Edit Strategy

| Step | Goal | Constraint |
|------|------|------------|
| Inspect | Understand existing wording and local section fit | No assumptions or blind edits |
| Plan | Decide where each guardrail and structural simplification should live | Prefer parallel wording and heading structure across all three files |
| Patch | Delete duplicate scaffolding, keep the lean block shape, and tighten guidance with minimal churn | Keep edits surgical and in scope |
| Verify | Map final wording, lean block shape, and heading structure back to the required outcomes | Use direct file evidence, not recollection |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and evidence review

- [ ] Read `AGENTS_example_fs_enterprises.md` and identify the best insertion point under Section 1 `## 1. CRITICAL RULES`.
- [ ] Read `AGENTS.md` in the Public workspace and identify the matching insertion point there.
- [ ] Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` and identify the matching insertion point there.
- [ ] Build an eight-point guardrail matrix plus a structure checklist for the lean block shape, section deletion, later-heading renumbering, direct transition into `### Tools & Search`, and `§4 Confidence Framework` cross-reference.

### Phase 2: Surgical instruction updates

- [ ] Update the Public enterprise example AGENTS file so the moved request-analysis block keeps only `Flow` plus `#### Execution Behavior`, the old standalone request-analysis section stays removed, later headings remain renumbered, and the `§4 Confidence Framework` reference stays correct.
- [ ] Update the root Public `AGENTS.md` file with the same lean structural and wording changes.
- [ ] Update the Barter coder AGENTS file with the same lean structural and wording changes, adjusted only as needed for local section fit.
- [ ] Re-read all three files after editing to confirm the final wording still preserves existing safety and scope boundaries, the block shape stays lean, and the heading structure matches the new layout.

### Phase 3: Packet verification and closeout

- [ ] Update `checklist.md` with evidence that all three files contain all eight guardrails in the moved Critical Rules subsection, that the old standalone request-analysis section is gone, and that the moved block now contains only `Flow` plus `#### Execution Behavior`.
- [ ] Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-execution-guardrails --strict`.
- [ ] Record same-session results in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Direct content review | Confirm all three AGENTS files contain all requested guardrails in the moved Critical Rules subsection | `Read`, targeted content review |
| Lean block verification | Confirm the moved block contains only `Flow` plus `#### Execution Behavior` and then transitions to `### Tools & Search` | Targeted heading and section review |
| Scope verification | Confirm changes stayed inside the three AGENTS targets plus packet docs | File list review |
| Structure verification | Confirm the standalone request-analysis section was removed and later headings were renumbered to `## 5`, `## 6`, and `## 7` | Targeted heading review |
| Packet validation | Confirm required Level 2 docs and structure are valid | `validate.sh --strict` |
| Summary verification | Confirm implementation-summary matches actual work | Cross-read final files |

### Verification Plan

- Use a simple eight-row evidence map that ties each requested guardrail to wording in all three AGENTS files.
- Verify that the moved block now lives under `## 1. CRITICAL RULES` as `### Request Analysis & Execution` in all three targets.
- Verify that duplicate support scaffolding (`Principle` table, `CLARITY Triggers`, `Pre-Change Checklist`, `Five Checks`, `STOP CONDITIONS`) is absent and the block transitions directly into `### Tools & Search`.
- Verify that the old dedicated request-analysis section is absent and that later top-level headings now appear as `## 5. AGENT ROUTING`, `## 6. MCP CONFIGURATION`, and `## 7. SKILLS SYSTEM`.
- Re-check that anti-permission wording still respects existing safety blockers and escalation rules.
- Re-check that planning-first and research-first wording encourages decisive execution instead of adding friction.
- Re-check that the Clarify bullet now points to `§4 Confidence Framework` in all three targets.
- Validate the packet only after all packet docs reflect the same scope and guardrail language.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `AGENTS_example_fs_enterprises.md` availability | Workspace | Required | The Public guidance cannot be updated or verified. |
| `AGENTS.md` availability | Workspace | Required | The root Public guidance cannot be updated or verified. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` availability | External workspace | Required | Cross-repo parity cannot be established. |
| Existing safety rules in all three files | Policy | Required | New guardrails must fit without contradicting hard blockers. |
| Packet validator | Tooling | Required | Phase closeout cannot be claimed cleanly. |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| One file gets stronger wording than the others | Guardrail drift across workspaces | Verify all three files against the same eight-point matrix |
| Edits become larger than needed | Review noise and scope creep | Prefer local insertions and small text replacements |
| New guidance sounds motivational instead of operational | Weak downstream execution behavior | Use concrete imperative wording tied to action expectations |
| Existing conventions in `CLAUDE.md` are referenced weakly | Agents may still ignore local rules | Require explicit convention-recall wording and verify it directly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An AGENTS edit weakens an existing safety rule, adds scope beyond the request, or creates wording drift between the three targets.
- **Procedure**:
  1. Revert the affected wording block in the target file.
  2. Re-check the eight-point matrix to identify the exact missing or conflicting guardrail.
  3. Re-apply a smaller, more precise edit.
  4. Re-run direct verification and packet validation before closeout.

### Rollback Boundaries

- Keep edits localized so individual wording blocks can be reverted without disturbing unrelated policy text.
- Treat each AGENTS file as independently reversible, but do not close the phase until all three files are aligned again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Read Three AGENTS Files
        |
        v
Build Eight-Point Guardrail Matrix
        |
        v
Patch Public Enterprise AGENTS File --┐
Patch Public Root AGENTS File --------┼--> Cross-File Verification --> Packet Validation --> Summary
Patch Barter AGENTS File -------------┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup / Review | None | Editing |
| Public enterprise AGENTS update | Setup / Review | Cross-file verification |
| Public root AGENTS update | Setup / Review | Cross-file verification |
| Barter AGENTS update | Setup / Review | Cross-file verification |
| Cross-file verification | All three AGENTS updates | Packet validation |
| Packet validation / Summary | Cross-file verification | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup / Review | Medium | 20-30 minutes |
| Surgical AGENTS updates | Medium | 30-45 minutes |
| Verification / Summary | Low | 15-25 minutes |
| **Total** | | **65-100 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-close Checklist

- [ ] All three AGENTS files were re-read after editing.
- [ ] The eight requested guardrails map cleanly to all three files.
- [ ] Scope remained limited to the three AGENTS files plus packet documentation.

### Rollback Procedure

1. Remove or revert the exact wording block that introduced drift or contradiction.
2. Compare the remaining wording against the eight-point matrix.
3. Reinsert only the missing behavior with a narrower edit.
4. Re-verify all three AGENTS files and rerun packet validation.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
