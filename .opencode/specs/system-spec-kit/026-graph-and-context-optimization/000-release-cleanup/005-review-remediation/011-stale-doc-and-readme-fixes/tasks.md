---
title: "Tasks: Stale Doc + README Fixes"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task ledger for the 12 scoped stale documentation updates from 011 deep-review findings F-001/002/004/006 and the README staleness audit."
trigger_phrases:
  - "011-stale-doc-and-readme-fixes tasks"
  - "stale doc readme remediation tasks"
  - "readme staleness audit tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes"
    last_updated_at: "2026-04-29T11:12:30Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Closed 12 stale doc/README findings"
    next_safe_action: "Re-run README staleness audit to confirm 0 STALE-HIGH"
    blockers: []
    key_files:
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/spec.md"
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/plan.md"
    session_dedup:
      fingerprint: "sha256:011-stale-doc-and-readme-fixes-tasks"
      session_id: "011-stale-doc-and-readme-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Documentation-only scope is fixed by the packet contract."
---
# Tasks: Stale Doc + README Fixes

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read packet contract (`spec.md`)
- [x] T002 [P] Read README audit report (`/tmp/audit-readme-staleness-report.md`)
- [x] T003 [P] Attempt to read 011 deep-review findings registry (`review/deep-review-findings-registry.json`)
- [x] T004 [P] Read Level 1 plan/tasks templates
- [x] T005 Author packet plan (`plan.md`)
- [x] T006 Author packet task tracker (`tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Update TC-3 narrative in 023 implementation summary
- [x] T008 Remove stale typecheck-blocked state in 025 tasks
- [x] T009 Update 028 spec continuity to shipped state
- [x] T010 Update folder-structure deep-loop layout example
- [x] T011 Update MCP core README DB-state ownership prose
- [x] T012 Update MCP scripts README embedding/provider startup prose
- [x] T013 Update MCP search README rerank contract
- [x] T014 Update code graph README `fallbackDecision` surfaces
- [x] T015 Update code graph library README parser/module table
- [x] T016 Update deep-review README runtime-state layout
- [x] T017 Update deep-research README quick-start and runtime layout
- [x] T018 Update sk-doc README `playbook_feature` document type prose
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run removed-identifier grep on five code-adjacent READMEs
- [x] T020 Run `pt-01` grep on deep-review and deep-research READMEs
- [x] T021 Run strict validator on this packet
- [x] T022 Author implementation summary (`implementation-summary.md`)
- [x] T023 Update `spec.md` continuity to 100 percent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Grep checks pass
- [x] Strict validator exits 0
- [x] REQ-001 through REQ-005 disposition recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit**: See `/tmp/audit-readme-staleness-report.md`
<!-- /ANCHOR:cross-refs -->
