---
title: "Feature Specification: References and READMEs Lean-Trio Sync"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Doc-sync packet bringing 13 system-spec-kit reference and README docs into alignment with the shipped phase-parent lean-trio policy. No code changes; documentation only."
trigger_phrases:
  - "phase parent doc sync"
  - "references readme lean trio"
  - "phase definitions lean"
  - "save workflow phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/003-references-and-readme-sync"
    last_updated_at: "2026-04-27T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec.md from plan file"
    next_safe_action: "Author plan.md"
    blockers: []
    key_files: ["spec.md"]
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: References and READMEs Lean-Trio Sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `010-phase-parent-documentation` |
| **Predecessor** | `002-generator-and-polish` |
| **Successor** | None (current tail of 010) |
| **Handoff Criteria** | 001 + 002 already shipped: validator + detection + lean template + generator pointer + create.sh wire-up + resume redirect + content validator + e2e + base AGENTS/CLAUDE/SKILL doc sync. This packet completes the doc trail across the rest of the skill surface. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001 and 002 shipped the lean-trio policy end-to-end: validator phase-parent branches across five rules, the new content-discipline validator, the generator pointer-write and bubble-up, the resume pointer-first redirect, the lean phase-parent template, and base documentation in CLAUDE.md, AGENTS.md, AGENTS_Barter.md, AGENTS_example_fs_enterprises.md, and the system-spec-kit `SKILL.md`. But a deep audit of the rest of the skill surface (3 parallel Explore agents covering 30+ files) found 13 reference docs, READMEs, command docs, and assets still describing the pre-policy state. Three contradict shipped behavior outright: `references/structure/phase_definitions.md` shows phase parents with `plan.md`/`tasks.md`/`decision-record.md`/`memory/`; `references/memory/save_workflow.md` Output Format does not differentiate phase-parent saves; `templates/README.md` STRUCTURE table is missing rows for the new `phase_parent/` and `context-index.md` templates. The new `PHASE_PARENT_CONTENT` validator rule is not documented anywhere outside its own script and the validator-registry.

### Purpose
Bring those 13 files into alignment with shipped behavior in a single doc-only packet. Mirror canonical wording from already-updated docs (CLAUDE.md, AGENTS.md, SKILL.md, resume.md, skill-advisor-hook.md) rather than re-coining language. Outcome: future readers (human or AI) cannot be misled into authoring `plan.md` or `tasks.md` at a phase parent because a reference doc told them to.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five **CRITICAL** doc fixes that contradict shipped behavior or document missing rules:
  - `references/structure/phase_definitions.md` parent folder structure block
  - `references/memory/save_workflow.md` Output Format and Continuity Block sections
  - `references/validation/validation_rules.md` PHASE_PARENT_CONTENT rule entry + FILE_EXISTS phase-parent row
  - top-level `README.md` level matrix, structure diagram, phase decomposition narrative
  - `templates/README.md` STRUCTURE table + PHASE SYSTEM section
- Five **MEDIUM** clarity gaps:
  - `references/validation/template_compliance_contract.md` §8 PHASE FOLDER ADDENDA
  - `references/intake-contract.md` §1 OVERVIEW + §14 REFERENCE table
  - `references/workflows/quick_reference.md` resume ladder narrative
  - `assets/template_mapping.md` Required Templates by Level section
  - `command/spec_kit/plan.md` and `command/spec_kit/complete.md` `:with-phases` workflow descriptions
- Two **LOW** minor clarifications:
  - `references/structure/folder_routing.md` explicit-target-priority footnote
  - `references/config/hook_system.md` SessionStart phase-parent redirect mention

### Out of Scope
- Code changes of any kind. This packet is documentation only.
- Wholesale rewrite of any large doc; only the affected sections are edited.
- New templates or new validator rules. Both already shipped in 001 and 002.
- Soft deprecation of legacy phase-parent heavy docs (e.g. archiving 026's old `plan.md`/`tasks.md`). Tolerant policy stays; deprecation is a separate follow-on packet outside 010.
- Updating sibling repositories (`AGENTS_Barter.md` symbol-target repo if separate, `AGENTS_example_fs_enterprises.md` example repo). The local copies are already in sync from 001.

### Files to Change

| File Path | Change Type | Severity |
|-----------|-------------|----------|
| `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` | Modify | CRITICAL |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Modify | CRITICAL |
| `.opencode/skill/system-spec-kit/references/validation/validation_rules.md` | Modify | CRITICAL |
| `.opencode/skill/system-spec-kit/README.md` | Modify | CRITICAL |
| `.opencode/skill/system-spec-kit/templates/README.md` | Modify | CRITICAL |
| `.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md` | Modify | MEDIUM |
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Modify | MEDIUM |
| `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | MEDIUM |
| `.opencode/skill/system-spec-kit/assets/template_mapping.md` | Modify | MEDIUM |
| `.opencode/command/spec_kit/plan.md` | Modify | MEDIUM |
| `.opencode/command/spec_kit/complete.md` | Modify | MEDIUM |
| `.opencode/skill/system-spec-kit/references/structure/folder_routing.md` | Modify | LOW |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Modify | LOW |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `phase_definitions.md` parent structure block matches shipped policy. | Lines 86–109 show parent with only `spec.md`, `description.json`, `graph-metadata.json`; children have full level-N file set without `memory/` subfolders. New paragraph after the block names `is_phase_parent()` + `isPhaseParent()` as detection sources of truth. |
| REQ-002 | `save_workflow.md` documents phase-parent save routing. | New "Phase Parent Save Routing" sub-section after line 288 explains: at parent → write `last_active_child_id = null` + `last_active_at = now` to `graph-metadata.json`, no implementation-summary.md continuity; at child of phase parent → bubble up child's `packet_id`. References `scripts/memory/generate-context.ts:372` (atomic write) and `:428` (`updatePhaseParentPointersAfterSave`). |
| REQ-003 | `validation_rules.md` documents the new PHASE_PARENT_CONTENT rule. | Rule summary table includes a row `PHASE_PARENT_CONTENT` (severity: warn). FILE_EXISTS required-files matrix has a Phase Parent row showing the lean trio. New rule section describes detection (via `is_phase_parent`), forbidden tokens, code-fence + HTML-comment awareness, and remediation (move to `context-index.md`). |
| REQ-004 | Top-level `README.md` reflects phase-parent mode. | Level matrix table has Phase Parent row; Spec Folder Structure diagram notes phase-parent vs phase-child distinction; Phase Decomposition section names `templates/phase_parent/spec.md` as the parent template; validation-rules description block names PHASE_PARENT_CONTENT. |
| REQ-005 | `templates/README.md` STRUCTURE table includes new templates. | Two new rows between lines 53 and 55: `phase_parent/` and `context-index.md`. §5 PHASE SYSTEM (lines 93–105) gains a "Phase Parent Folder" sentence pointing to `templates/phase_parent/spec.md`. |
| REQ-006 | New 003 packet validates as L2 child. | `validate.sh --strict` against `003-references-and-readme-sync/` passes modulo expected SPEC_DOC_INTEGRITY forward-reference noise (same residual as 001 and 002). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `template_compliance_contract.md` §8 clarifies phase-parent exemption. | New paragraph states phase parents are NOT subject to Level 1–3+ structural contracts and use `templates/phase_parent/spec.md` exclusively; phase children still follow level contracts. |
| REQ-008 | `intake-contract.md` documents phase-parent mode. | §1 OVERVIEW gains a phase-parent note; §14 REFERENCE table gains a row pointing to `templates/phase_parent/spec.md`. |
| REQ-009 | `quick_reference.md` resume ladder is complete. | After line 507, a "Phase-Parent Resume Ladder" block describes pointer-first via `derived.last_active_child_id` (<24h fresh) → recurse to child; else list children with statuses; `--no-redirect` shows parent surface. |
| REQ-010 | `template_mapping.md` Required Templates by Level distinguishes phase parents. | Around lines 99–104, a Phase Parent block names required = lean trio, prohibited = heavy docs, optional = `context-index.md`. |
| REQ-011 | `plan.md` and `complete.md` `:with-phases` workflows name the lean parent template. | Both command docs explicitly state the parent created by `create.sh --phase` uses `templates/phase_parent/spec.md`; plan/tasks/checklist/decisions live in children. |

### P2 - Optional (defer with reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | `folder_routing.md` explicit-target-priority footnote. | Footnote near the explicit-target discussion clarifies that explicit `[spec-folder]` CLI argument always wins over auto-detect; at a phase parent that means pointer-write runs at parent (writes null). |
| REQ-013 | `hook_system.md` SessionStart phase-parent mention. | One-sentence addition near line 44 confirms `resume` priming respects the phase-parent pointer redirect documented in `references/hooks/skill-advisor-hook.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -nrE "├── plan\.md.*coordination|memory/.*Parent-level context" .opencode/skill/system-spec-kit/references/` returns zero matches (the specific stale phrases in `phase_definitions.md` are gone).
- **SC-002**: `grep -lE "Phase Parent Mode|lean trio|last_active_child_id|PHASE_PARENT_CONTENT" .opencode/skill/system-spec-kit/{SKILL.md,README.md,references/structure/phase_definitions.md,references/memory/save_workflow.md,references/validation/validation_rules.md,references/validation/template_compliance_contract.md,references/intake-contract.md,references/workflows/quick_reference.md,templates/README.md,assets/template_mapping.md} 2>/dev/null` lists ALL 10 P0+P1 files.
- **SC-003**: `validate.sh --strict` against the new `003-references-and-readme-sync/` packet passes modulo SPEC_DOC_INTEGRITY forward-reference noise.
- **SC-004**: `validate.sh --strict` regression on `026-graph-and-context-optimization/` introduces no new error rules vs current baseline.
- **SC-005**: A reader who lands on `references/structure/phase_definitions.md` learns the lean-trio policy from the parent structure block alone — no contradictions with other docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Edits in 81KB `README.md` ripple unintended changes elsewhere in the doc. | Low | Surgical edits only; no wholesale rewrite. Diff every section before saving. |
| Risk | New PHASE_PARENT_CONTENT rule documentation re-triggers the validator on this packet's own spec.md (mentioning forbidden tokens to document them). | Medium | Wrap forbidden-token examples inside HTML comments or fenced code blocks — the validator already skips both (shipped in 002). |
| Risk | Cross-doc wording inconsistency between updates and existing canonical sources. | Low | Mirror wording from CLAUDE.md / AGENTS.md / SKILL.md / resume.md / skill-advisor-hook.md verbatim where possible. |
| Dependency | Phase 001 + 002 + small follow-on validator extension all shipped. | Green | Already complete in this packet's parent. |
| Dependency | Existing canonical wording in CLAUDE.md / AGENTS.md / SKILL.md. | Green | Stable; mirror don't re-coin. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime impact (doc-only packet).

### Security
- **NFR-S01**: No new file-write paths beyond the canonical save / `Edit` tool.

### Reliability
- **NFR-R01**: Each edit is independent; partial completion leaves the docs in a not-worse state than current (still mostly stale, no contradictions added).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Doc Drift
- A future skill update may rename or restructure one of the 13 target files. Mitigation: each task in `tasks.md` cites a path AND a section anchor (where available) so a path change is detectable.

### Validator False-Positive
- If documenting forbidden tokens in `validation_rules.md` outside a code fence or HTML comment, PHASE_PARENT_CONTENT may flag this packet's spec.md as an advisory warning. Wrap examples in fences or comments. The validator does not run on the doc files we're editing — only on phase parents — so the risk is contained to this packet's own spec.md and the parent 010 spec.md.

### Cross-AI Drift
- AGENTS_Barter.md and AGENTS_example_fs_enterprises.md were synced in 001 — verify they still match the root AGENTS.md as part of REQ-004 verification.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 13 files, ~30–40 surgical edits, mostly 1–10 lines each |
| Risk | 8/25 | Doc-only; no runtime behavior change. Worst case: a few stale phrases survive — low severity |
| Research | 4/20 | All audit work done by 3 Explore agents in plan phase; canonical wording already exists |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should we extend AGENTS_Barter.md and AGENTS_example_fs_enterprises.md to mention `last_active_child_id`/`last_active_at` pointer fields? Currently they describe the lean-trio policy but not the pointer mechanism. Recommendation: defer — those siblings are out of scope per Out of Scope above; a future update can carry the pointer mention.
- Should `assets/level_decision_matrix.md` gain a phase-parent column? Recommendation: no — that doc is purely about level selection within a single spec, which doesn't apply to phase parents.
- Should we add a worked example for phase-decomposition to `references/workflows/worked_examples.md`? Recommendation: defer — the existing examples cover L1/L2/L3 and the new mode is sufficiently documented across the other files. A worked example is a polish item that can land later.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Predecessors (shipped)**: `../001-validator-and-docs/`, `../002-generator-and-polish/`
- **Plan source (audit findings)**: `/Users/michelkerkmeester/.claude/plans/do-a-deep-dive-peaceful-pine.md`
