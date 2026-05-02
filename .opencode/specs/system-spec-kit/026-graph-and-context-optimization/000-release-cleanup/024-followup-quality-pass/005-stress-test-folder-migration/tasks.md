---
title: "Tasks: 037/005 Stress Test Folder Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "037-005-stress-test-folder-migration"
  - "stress test folder"
  - "dedicated stress folder"
  - "mcp_server/stress_test"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/005-stress-test-folder-migration"
    last_updated_at: "2026-04-29T18:09:55+02:00"
    last_updated_by: "cli-codex"
    recent_action: "stress-test folder migration implemented; default npm test blocked by existing suite failures"
    next_safe_action: "Investigate broad npm test failures outside the moved stress suites"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/README"
      - ".opencode/skill/system-spec-kit/mcp_server/vitest.config.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/package.json"
      - "migration-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-005-stress-test-folder-migration"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Tasks: 037/005 Stress Test Folder Migration

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

- [x] T001 [P] Read `mcp_server/tests/` stress candidates
- [x] T002 [P] Read `mcp_server/vitest.config.ts`
- [x] T003 [P] Read `mcp_server/package.json`
- [x] T004 [P] Read MCP server README and tests README
- [x] T005 Run stress filename/content/reference searches
- [x] T006 Write `migration-plan.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Create `mcp_server/stress_test/`
- [x] T008 Move `session-manager-stress.vitest.ts`
- [x] T009 Move `code-graph-degraded-sweep.vitest.ts`
- [x] T010 Add `mcp_server/stress_test/README`
- [x] T011 Update `vitest.config.ts`
- [x] T012 Update `package.json`
- [x] T013 Update `tsconfig.json`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Update `mcp_server/README`
- [x] T015 Update `mcp_server/tests/README`
- [x] T016 Update direct moved-path references in 011 stress-remediation docs
- [x] T017 Create Level 2 packet docs
- [x] T018 Create packet metadata JSON files
- [x] T019 Run strict validator on this packet
- [x] T020 Run `npm run build`
- [ ] T021 Run `npm test`
- [x] T022 Run `npm run stress` smoke check
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Migration Plan**: See `migration-plan.md`
<!-- /ANCHOR:cross-refs -->
