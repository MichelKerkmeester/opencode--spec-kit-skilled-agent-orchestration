---
title: "Tasks: sk-doc README and HVR Improvements [03--commands-and-skills/032-sk-doc-readme-hvr-improvements/tasks]"
description: "Task ledger for upgrading sk-doc HVR rules, README template guidance, and packet compliance."
trigger_phrases:
  - "hvr tasks"
  - "readme upgrade tasks"
  - "sk-doc tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: sk-doc README and HVR Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Research and Brief Preparation
- [x] T001 Read and annotate the exemplar READMEs under `.opencode/skill/system-spec-kit/`
- [x] T002 Draft the HVR rules upgrade brief for `.opencode/skill/sk-doc/references/global/hvr_rules.md`
- [x] T003 Draft the README template upgrade brief for `.opencode/skill/sk-doc/assets/documentation/readme_template.md`
- [x] T004 Draft the README creation reference brief for `.opencode/skill/sk-doc/references/specific/readme_creation.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Deliverable Workstreams
- [x] T005 [P] Upgrade `.opencode/skill/sk-doc/references/global/hvr_rules.md`
- [x] T006 [P] Upgrade `.opencode/skill/sk-doc/assets/documentation/readme_template.md`
- [x] T007 [P] Create `.opencode/skill/sk-doc/references/specific/readme_creation.md`
- [x] T008 Collect and stage the documentation changes for review

### Review and Refinement
- [x] T009 Review the HVR rules output for structure, format, and voice
- [x] T010 Review the README template output for two-tier voice and structural patterns
- [x] T011 Review the README creation reference for workflow completeness and cross-references
- [x] T012 Refine prose and normalize path references across the packet
- [x] T013 Sync related routing notes in `.opencode/skill/sk-doc/SKILL.md`
- [x] T014 Record the codex flag warning in `.opencode/skill/cli-codex/SKILL.md` and `.opencode/skill/cli-codex/assets/prompt_templates.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Packet Verification
- [ ] T015 Verify frontmatter, anchors, and template headers in all packet docs
- [ ] T016 Verify cited sk-doc, system-spec-kit, and cli-codex paths resolve in the repo
- [ ] T017 Re-run the verbose spec validator on this folder
- [ ] T018 Record any remaining non-blocking warnings for follow-up
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required packet docs are template-safe
- [ ] No hard validation errors remain for this folder
- [ ] The packet references only committed repo files or plain-text temporary artifacts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
