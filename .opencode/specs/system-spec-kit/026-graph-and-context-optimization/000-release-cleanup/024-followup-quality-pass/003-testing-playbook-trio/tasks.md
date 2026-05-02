---
title: "Tasks: Testing Playbook Trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task ledger for packet 037/003 manual testing playbook updates."
trigger_phrases:
  - "037-003 testing playbook tasks"
  - "manual playbook trio tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/003-testing-playbook-trio"
    last_updated_at: "2026-04-29T15:41:05Z"
    last_updated_by: "cli-codex"
    recent_action: "Tasks created and implementation mostly complete"
    next_safe_action: "Run validation"
    blockers: []
    completion_pct: 90
---

# Tasks: Testing Playbook Trio

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

- [x] T001 Run playbook directory discovery commands. [EVIDENCE: `discovery-notes.md`]
- [x] T002 Run playbook file discovery commands. [EVIDENCE: `discovery-notes.md`]
- [x] T003 Document missing standalone code_graph playbook and actual code_graph category path. [EVIDENCE: `discovery-notes.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read sk-doc playbook creation reference. [EVIDENCE: sk-doc manual playbook creation reference]
- [x] T005 Read sk-doc playbook template. [EVIDENCE: sk-doc manual playbook template]
- [x] T006 Read cli-opencode sample entries. [EVIDENCE: cli-opencode base invocation and self-invocation refusal examples]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Add retention sweep playbook entry. [EVIDENCE: system-spec-kit playbook ID 278]
- [x] T008 Add advisor status/rebuild system-spec-kit entry. [EVIDENCE: system-spec-kit playbook ID 279]
- [x] T009 Add CLI matrix adapter entry. [EVIDENCE: system-spec-kit playbook ID 280]
- [x] T010 Add code_graph selective self-heal entry. [EVIDENCE: system-spec-kit playbook ID 281]
- [x] T011 Add code_graph packet 035 evidence entry. [EVIDENCE: system-spec-kit playbook ID 282]
- [x] T012 Add skill_advisor NC-006 entry. [EVIDENCE: skill_advisor playbook NC-006]
- [x] T013 Update root playbook indexes. [EVIDENCE: system-spec-kit and skill_advisor root playbooks]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] sk-doc validation passes or limitations are documented.
- [ ] Strict validator exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Discovery**: `discovery-notes.md`
<!-- /ANCHOR:cross-refs -->
