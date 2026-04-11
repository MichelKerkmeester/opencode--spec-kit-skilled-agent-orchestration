---
title: "Implementation Plan: Recursive Agent sk-doc Alignment [template:level_2/plan.md]"
description: "Plan for phase 003 under packet 041, focused on sk-doc alignment and honest packet closeout."
trigger_phrases:
  - "recursive agent doc alignment plan"
  - "041 phase 003 plan"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Recursive Agent sk-doc Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, JSON registry metadata |
| **Framework** | `sk-doc` validation + system-spec-kit phased packet workflow |
| **Storage** | Skill package docs, command/agent markdown, packet docs |
| **Testing** | `package_skill.py`, `validate_document.py`, `validate.sh --strict`, `python3` JSON validation |

### Overview
This phase closes the remaining structural debt after phases `001` and `002`: normalize `sk-improve-agent` package docs to `sk-doc`, normalize the related command and agent files, then update root packet `041` so the full program history shows `003` as the final closeout phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The failing `sk-doc` surfaces are identified
- [x] The parent packet continuation rule already points to a future `003-*` phase
- [x] Validation commands are known and reproducible

### Definition of Done
- [x] The skill package passes `package_skill.py --check`
- [x] README, command, agent, references, and markdown assets pass `validate_document.py`
- [x] Root `041` and phase `003` pass strict packet validation
- [x] Parent packet docs report `3 of 3 complete`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation truth-sync phase under an existing parent packet

### Key Components
- **Skill package docs**: `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/skill/sk-improve-agent/README.md`, `references/`, `assets/`
- **Related runtime docs**: canonical loop command and canonical loop agent
- **Parent packet docs**: root `041` phase map, tasks, checklist, and implementation summary
- **Registry metadata**: `.opencode/specs/descriptions.json`

### Data Flow
Normalize the package and related surfaces first, then update the packet docs to describe the newly complete phase, then re-run validators so the packet claims match the current repo state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet Setup

- [x] Create the new `003-sk-improve-agent-doc-alignment/` phase folder
- [x] Add phase `003` spec, plan, tasks, checklist, and implementation summary
- [x] Update root packet `041` to recognize phase `003`

### Phase 2: sk-doc Alignment

- [x] Align `.opencode/skill/sk-improve-agent/SKILL.md` and `.opencode/skill/sk-improve-agent/README.md`
- [x] Align all markdown references and markdown assets
- [x] Align the canonical loop command and canonical loop agent
- [x] Update packet-linked examples and metadata to point at the new phase

### Phase 3: Verification

- [x] Run package validation for `sk-improve-agent`
- [x] Run `validate_document.py` across the package, command, and agent surfaces
- [x] Run strict packet validation for root `041` and phase `003`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packaging | `sk-improve-agent` package shape | `python3 .opencode/skill/sk-doc/scripts/package_skill.py --check` |
| Validation | README | `validate_document.py --type readme` |
| Validation | Command and agent | `validate_document.py --type command` and `--type agent` |
| Validation | References and markdown assets | `validate_document.py --type reference` and `--type asset` |
| Packet Validation | Root `041` and phase `003` | `validate.sh --strict` |
| Parsing | Registry metadata | `python3` JSON parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc` validators | Internal | Green | Cannot prove documentation alignment |
| Root packet `041` | Internal | Green | Phase completion cannot be recorded honestly |
| `sk-improve-agent` skill package | Internal | Green | Core doc surfaces cannot be normalized |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validators fail after rewrite, or root `041` becomes inconsistent with the child phases.
- **Procedure**: Restore the previous doc shapes, reintroduce phase `003` only after the failing surface is understood, and re-run the validator set before claiming completion.

Future agent-improver work should continue as `004-*` and later child phases under `041-sk-improve-agent-loop/`.
<!-- /ANCHOR:rollback -->

---
