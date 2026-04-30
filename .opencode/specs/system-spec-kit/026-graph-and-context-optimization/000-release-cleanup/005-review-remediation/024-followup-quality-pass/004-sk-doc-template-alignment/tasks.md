---
title: "Tasks: 037/004 sk-doc Template Alignment"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "037-004-sk-doc-template-alignment"
  - "sk-doc audit"
  - "template alignment 031-036"
  - "DQI compliance"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment"
    last_updated_at: "2026-04-29T17:41:50+02:00"
    last_updated_by: "cli-codex"
    recent_action: "sk-doc template audit and fixes completed"
    next_safe_action: "Run strict validator as final verification"
    blockers: []
    key_files:
      - "audit-target-list.md"
      - "audit-findings.md"
    session_dedup:
      fingerprint: "sha256:037004skdoctemplatealignmenttasks00000000000000000000000"
      session_id: "037-004-sk-doc-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 037/004 sk-doc Template Alignment

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

- [x] T001 Read `.opencode/skill/sk-doc/SKILL.md`
- [x] T002 [P] Read sk-doc references and asset templates
- [x] T003 [P] Read system-spec-kit Level 2 templates
- [x] T004 Discover markdown/text docs touched by packets 031 through 036
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write `audit-target-list.md`
- [x] T006 Audit README, reference, skill, command, spec and asset docs
- [x] T007 Apply safe README TOC and anchor fixes
- [x] T008 Apply reference frontmatter and section fixes
- [x] T009 Write `audit-findings.md`
- [x] T010 Create Level 2 packet docs and metadata
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run sk-doc validation on edited docs
- [x] T012 Check active target anchors and fenced code blocks
- [x] T013 Run strict validator on this packet and touched spec folders
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit Target List**: See `audit-target-list.md`
- **Audit Findings**: See `audit-findings.md`
<!-- /ANCHOR:cross-refs -->
