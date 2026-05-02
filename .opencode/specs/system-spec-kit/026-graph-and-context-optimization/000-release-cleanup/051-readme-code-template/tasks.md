---
title: "Tasks: README code template governance [template:level_2/tasks.md]"
description: "Task tracking for README code template phase documentation, diagram styling correction evidence, code-folder README batch evidence, explicit target manifest, final remediation evidence, final P1 cleanup evidence, and verification evidence."
trigger_phrases:
  - "readme code template tasks"
  - "task 2b evidence"
  - "task 2c phase docs"
  - "diagram styling correction evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template"
    last_updated_at: "2026-05-02T13:05:00Z"
    last_updated_by: "general"
    recent_action: "Recorded Task #31 final P1 README cleanup evidence"
    next_safe_action: "Use checklist.md for verification"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/assets/documentation/readme_template.md"
      - ".opencode/skill/sk-doc/assets/documentation/readme_code_template.md"
    session_dedup:
      fingerprint: "sha256:0510000000000000000000000000000000000000000000000000000000000003"
      session_id: "task-10-readme-code-template-diagram-evidence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task #25 code-folder README batch evidence is recorded with P1 batches complete, P2 batches 01-22 complete, validation summaries, and known exception notes."
      - "Task #28 explicit target manifest and final remediation evidence are recorded."
      - "Task #31 final P1 cleanup is recorded for code_graph and stress_test README evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: README code template governance

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm active phase packet (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template`) [Evidence: user-provided scope]
- [x] T002 Confirm documentation-only boundary [Evidence: no `sk-doc` template edits in Task #6]
- [x] T003 [P] Read existing phase docs before editing [Evidence: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record final general README template expansion for skill/project README alignment [Evidence: spec.md and implementation-summary.md]
- [x] T005 Record final code README template architecture and topology improvements [Evidence: spec.md and implementation-summary.md]
- [x] T006 Record `validate_document.py` exit 0 for both files with non-blocking `non_sequential_numbering` warnings from scaffold headings in code fences [Evidence: implementation-summary.md]
- [x] T007 Record `extract_structure.py` exit 0 for both files with DQI 99 excellent [Evidence: implementation-summary.md]
- [x] T008 Record HVR punctuation and banned-word scans with no matches [Evidence: implementation-summary.md]
- [x] T012 Record Task #9 diagram styling correction for `readme_code_template.md` [Evidence: implementation-summary.md]
- [x] T013 Record replacement of ASCII `+---`, `--->`, lowercase `v`, and bracket-list `->` diagram patterns [Evidence: implementation-summary.md]
- [x] T014 Record directory trees as intentional tree blocks, not diagrams requiring box drawing style [Evidence: implementation-summary.md]
- [x] T016 Record code-folder README P1 batches complete [Evidence: implementation-summary.md]
- [x] T017 Record code-folder README P2 batches 01-22 complete [Evidence: implementation-summary.md]
- [x] T018 Record final fix for `.opencode/skill/system-spec-kit/shared/README.md` [Evidence: checklist.md and implementation-summary.md]
- [x] T019 Record batch validation summaries [Evidence: checklist.md and implementation-summary.md]
- [x] T020 Record known exceptions and final-review notes [Evidence: checklist.md and implementation-summary.md]
- [x] T022 Record explicit README sweep target manifest [Evidence: implementation-summary.md]
- [x] T023 Record final blocker remediation evidence for shared README, HVR blockers, lowercase-v diagram blockers, and low-DQI files [Evidence: checklist.md and implementation-summary.md]
- [x] T025 Record final P1 cleanup for `mcp_server/code_graph/README.md` semicolon prose and `mcp_server/stress_test/README.md` command-text-only term exception [Evidence: checklist.md and implementation-summary.md]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Synchronize checklist with final Task #5 evidence [Evidence: checklist.md]
- [x] T010 Update implementation summary with delivery and verification state [Evidence: implementation-summary.md]
- [x] T011 Run strict phase validation [Evidence: `validate.sh --strict` result recorded in final response]
- [x] T015 Record Task #9 validator results and non-blocking flowchart-validator limitation [Evidence: checklist.md and implementation-summary.md]
- [x] T021 Run strict phase validation after Task #25 packet updates [Evidence: `validate.sh --strict` result recorded in final response]
- [x] T024 Run strict phase validation after Task #28 packet updates [Evidence: `validate.sh --strict` result recorded in final response]
- [x] T026 Run strict phase validation after Task #31 packet updates [Evidence: `validate.sh --strict` result recorded in final response]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [Evidence: T001-T026 complete]
- [x] No `[B]` blocked tasks remaining [Evidence: no blockers recorded]
- [x] Manual verification evidence recorded [Evidence: Task #5, Task #9, Task #25, Task #28, and Task #31 results captured in checklist.md and implementation-summary.md]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Delivery Record**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
