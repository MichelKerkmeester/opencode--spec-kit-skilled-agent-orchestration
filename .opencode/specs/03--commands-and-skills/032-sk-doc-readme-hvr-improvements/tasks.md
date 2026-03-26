---
title: "Tasks: sk-doc README and HVR Improvements"
description: "Task Format: T### [P?] Description (file path)"
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
## Phase 1: Research and Brief Preparation

- [ ] T001 Read and annotate exemplar READMEs for pattern extraction
- [ ] T002 Draft agent brief for D1: HVR rules upgrade (`hvr_rules.md`)
- [ ] T003 Draft agent brief for D2: README template upgrade (`readme_template.md`)
- [ ] T004 Draft agent brief for D3: readme_creation reference (`readme_creation.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Parallel Agent Implementation

- [ ] T005 [P] Dispatch Agent 1 via cli-codex: HVR rules upgrade (`references/global/hvr_rules.md`)
- [ ] T006 [P] Dispatch Agent 2 via cli-codex: README template upgrade (`assets/documentation/readme_template.md`)
- [ ] T007 [P] Dispatch Agent 3 via cli-codex: readme_creation reference (`references/specific/readme_creation.md`)
- [ ] T008 Collect and stage all agent outputs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Review and Refinement

- [ ] T009 Review Agent 1 output: HVR compliance, format, content accuracy
- [ ] T010 Review Agent 2 output: HVR compliance, format, two-tier voice
- [ ] T011 Review Agent 3 output: HVR compliance, format, workflow completeness
- [ ] T012 Refine voice and prose in all files (rewrite GPT-sounding passages)
- [ ] T013 Fix cross-references between all three files
- [ ] T014 Write final versions to disk
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T015 Verify frontmatter, anchors and heading format in all files
- [ ] T016 Verify hvr_rules.md covers structural AND word-level AI tells
- [ ] T017 Verify readme_template.md reflects two-tier voice pattern
- [ ] T018 Verify readme_creation.md covers full README creation workflow
- [ ] T019 Verify no regressions to install_guide_creation.md
- [ ] T020 Cross-reference links all resolve
- [ ] T021 Update spec folder docs (tasks.md, checklist.md, implementation-summary.md)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All three deliverables pass HVR compliance (0 hard blockers)
- [ ] All cross-references verified
- [ ] Checklist.md P0 items all marked with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
