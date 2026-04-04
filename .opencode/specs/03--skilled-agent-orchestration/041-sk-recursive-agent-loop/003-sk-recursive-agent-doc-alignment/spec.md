---
title: "Feature Specification: Recursive Agent sk-doc Alignment [template:level_2/spec.md]"
description: "Phase 003 under packet 041 closes the remaining sk-doc alignment gaps across sk-agent-improver package surfaces, related command/agent docs, and parent packet continuation records."
trigger_phrases:
  - "recursive agent doc alignment"
  - "sk-agent-improver sk-doc alignment"
  - "041 phase 003"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Recursive Agent sk-doc Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [../002-sk-agent-improver-full-skill/](../002-sk-agent-improver-full-skill/) |
| **Successor** | [../004-sk-agent-improver-promotion-verification/](../004-sk-agent-improver-promotion-verification/) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `041-sk-agent-improver-loop` already completed the functional agent-improver work, but the package still had structural drift against `sk-doc` rules. The skill entrypoint at `.opencode/skill/sk-agent-improver/SKILL.md`, the skill README, the bundled references, markdown assets, the canonical loop agent, and the slash command all had section-shape or packaging issues that prevented clean `sk-doc` validation and kept packet `041` short of a true 100 percent closeout.

### Purpose
Add a dedicated phase that brings `sk-agent-improver` and its related command and agent surfaces into `sk-doc` alignment, updates the parent packet to record that closure honestly, and verifies the whole `041` packet family again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skill/sk-agent-improver/SKILL.md`
- `.opencode/skill/sk-agent-improver/README.md`
- Markdown files under `.opencode/skill/sk-agent-improver/references/`
- Markdown files under `.opencode/skill/sk-agent-improver/assets/`
- `.opencode/command/spec_kit/agent-improver.md`
- `.opencode/agent/agent-improver.md`
- Parent packet `041` docs and registry metadata needed to record phase `003`

### Out of Scope
- Rewriting loop runtime logic beyond documentation-structure alignment
- Expanding promotion eligibility or target scope
- Opening a new sibling packet outside `041`

### Files to Change
- `.opencode/skill/sk-agent-improver/`
- `.opencode/command/spec_kit/agent-improver.md`
- `.opencode/agent/agent-improver.md`
- `.opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/`
- `.opencode/specs/descriptions.json`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sk-agent-improver` packages cleanly | `package_skill.py --check` passes for `.opencode/skill/sk-agent-improver` |
| REQ-002 | README aligns with `sk-doc` | `validate_document.py --type readme` passes for the skill README |
| REQ-003 | Canonical loop command aligns with `sk-doc` | `validate_document.py --type command` passes for `.opencode/command/spec_kit/agent-improver.md` |
| REQ-004 | Canonical loop agent aligns with `sk-doc` | `validate_document.py --type agent` passes for `.opencode/agent/agent-improver.md` |
| REQ-005 | Skill references and markdown assets align with `sk-doc` | All reference and asset markdown files pass `validate_document.py` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Parent packet records the new completion phase | Root `041` docs list phase `003` and report `3 of 3 complete` |
| REQ-007 | Phase lineage stays explicit | Root docs, phase `002`, and registry metadata point to phase `003` where relevant |
| REQ-008 | Packet `041` remains fully validated after the new phase | Root `041` and phase `003` pass strict validation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-agent-improver` passes `package_skill.py --check`.
- **SC-002**: The skill README, all markdown references, all markdown assets, the canonical loop command, and the canonical loop agent pass `sk-doc` validation.
- **SC-003**: Root packet `041` clearly shows phases `001`, `002`, and `003` as complete.
- **SC-004**: The next operator can understand that future agent-improver work continues as later child phases under `041`.

### Acceptance Scenarios
1. **Given** a maintainer runs the skill packaging check, **when** the package is structurally aligned, **then** `sk-agent-improver` passes packaging without missing-section errors.
2. **Given** a maintainer validates the command and agent docs, **when** they use `sk-doc` validators, **then** both files pass with the required sections present.
3. **Given** a maintainer opens root packet `041`, **when** they inspect the phase map and implementation summary, **then** phase `003` appears as the doc-alignment closeout step.
4. **Given** strict validation is re-run, **when** root `041` and phase `003` are consistent, **then** both validations pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-doc` validation rules | They define the structural target | Use the validators, not prose judgment, as the closure gate |
| Risk | A doc rewrite breaks loop-specific meaning | Medium | Preserve the shipped behavior and only normalize structure and clarity |
| Risk | Parent packet remains out of sync after phase `003` | Medium | Update root spec, plan, tasks, checklist, implementation summary, and descriptions registry together |
| Risk | Phase `002` still looks like the end of the program | Low | Point phase `002` successor metadata to phase `003` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This phase exists to close a defined structural gap with explicit validators.
<!-- /ANCHOR:questions -->

---
