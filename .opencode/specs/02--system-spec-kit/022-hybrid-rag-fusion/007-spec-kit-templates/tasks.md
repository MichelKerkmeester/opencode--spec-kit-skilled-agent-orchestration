---
title: "Tasks: SpecKit Template ToC Policy Enforcement [007-spec-kit-templates/tasks.md]"
description: "Execution checklist for Level 2 documentation creation, retro ToC cleanup, and validation reporting."
trigger_phrases:
  - "tasks"
  - "spec kit"
  - "toc"
  - "cleanup"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Template ToC Policy Enforcement

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
## Phase 1: Preparation

- [x] T001 Read `speckit` playbook and system-spec-kit Level 2 templates.
- [x] T002 Scan scoped standard artifacts for ToC occurrences.
- [x] T003 Confirm cleanup file list across `039`, `040`, and `041` folders.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Documentation Updates

- [x] T004 Create `spec.md` in `007-spec-kit-templates` with task-specific Level 2 content.
- [x] T005 Create `plan.md` in `007-spec-kit-templates` with execution and verification flow.
- [x] T006 Create `tasks.md` in `007-spec-kit-templates` and mark execution state.
- [x] T007 Create `checklist.md` in `007-spec-kit-templates` with evidence-backed verification status.
- [x] T008 Create `implementation-summary.md` in `007-spec-kit-templates`.
- [x] T009 Remove ToC sections from scoped non-research standard artifacts under `039`.
- [x] T010 Remove ToC sections from scoped non-research standard artifacts under `040`.
- [x] T011 Remove ToC sections from scoped non-research standard artifacts under `041`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run ToC policy scan to confirm no ToC sections remain in scoped standard artifacts.
- [x] T013 Run `validate.sh` for `007-spec-kit-templates`.
- [x] T014 Run `validate.sh` for `039-sk-code-opencode-alignment-hardening`.
- [x] T015 Run `validate.sh` for `040-sk-doc-visual-hardening`.
- [x] T016 Run `validate.sh` for `041-code-review-skill`.
- [x] T017 Compile concise output report: files changed + validation outcomes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] All requested validation commands executed and recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
