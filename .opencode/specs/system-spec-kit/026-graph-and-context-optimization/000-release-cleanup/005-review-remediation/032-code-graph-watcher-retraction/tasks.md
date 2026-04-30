---
title: "Tasks: Code Graph Watcher Retraction"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task tracker for packet 032 structural code-graph watcher retraction."
trigger_phrases:
  - "032-code-graph-watcher-retraction"
  - "code-graph watcher retraction"
  - "structural watcher doc fix"
  - "read-path graph freshness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction"
    last_updated_at: "2026-04-29T13:58:12Z"
    last_updated_by: "cli-codex"
    recent_action: "Watcher claim retracted"
    next_safe_action: "Plan packet 033 next"
    blockers: []
    completion_pct: 100
---
# Tasks: Code Graph Watcher Retraction

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

- [x] T001 Read 013 research report P1-1 verdict and Packet 032 scope. [EVIDENCE: `research-report.md:84`, `research-report.md:129-147`]
- [x] T002 Read iteration 004 adversarial detail. [EVIDENCE: `iteration-004.md:67-72`]
- [x] T003 [P] Create packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`).
- [x] T004 [P] Create packet metadata (`description.json`, `graph-metadata.json`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Patch README code-graph freshness model. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:517-529`]
- [x] T006 Sweep watcher and real-time wording. [EVIDENCE: targeted `rg` checks over current operator docs]
- [x] T007 Confirm `.opencode/skill/system-spec-kit/SKILL.md` code-graph automation wording. [EVIDENCE: `.opencode/skill/system-spec-kit/SKILL.md:796-798`]
- [x] T008 Confirm `CLAUDE.md` recovery wording. [EVIDENCE: `CLAUDE.md:107`]
- [x] T009 Confirm `.opencode/skill/system-spec-kit/references/config/hook_system.md` has no structural watcher claim. [EVIDENCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:76-101`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run strict validator on packet 032. [EVIDENCE: initial validator run found doc-shape fixes]
- [x] T011 Inspect diff for runtime-code violations. [EVIDENCE: tracked diff only includes README; packet docs are documentation]
- [x] T012 Update completion continuity and summary. [EVIDENCE: frontmatter completion_pct=100]
- [x] T013 Re-run strict validator and record `RESULT: PASSED`. [EVIDENCE: final validator run]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validator exits 0.
- [x] Runtime code files remain read-only.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source research**: `../013-automation-reality-supplemental-research/research/research-report.md`
- **Adversarial detail**: `../013-automation-reality-supplemental-research/research/iterations/iteration-004.md`
<!-- /ANCHOR:cross-refs -->
