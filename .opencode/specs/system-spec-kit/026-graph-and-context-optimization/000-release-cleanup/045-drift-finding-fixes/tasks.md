---
title: "Tasks: Drift Finding Fixes"
description: "Task tracker for packet 045 — 4 drift fixes plus verification."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "045-drift-finding-fixes tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/045-drift-finding-fixes"
    last_updated_at: "2026-05-01T05:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored"
    next_safe_action: "Validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "045-tasks-init"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

# Tasks: Drift Finding Fixes

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

- [x] T001 Scaffold packet 045
- [x] T002 Explore agent maps drift findings to file:line
- [x] T003 Author spec/plan/tasks/checklist
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 sa-011 fix in `extract.ts` (3 surgical edits): stop merging prior derived into buckets; exclude graph-metadata from provenance; dedupe dependencies
- [x] T005 sa-011 fix in `sync.ts`: exclude `generated_at` from idempotency check; preserve existing derived on stable content
- [x] T006 sa-004 test cleanup (no product change): replace FIXME with catalog-anchored assertion
- [x] T007 sa-036 catalog: 52 → 51 to match fixture line count
- [x] T008 sa-037 catalog wording + remove FIXME: distinguish design envelope from CI gate
- [x] T009 Update `lifecycle-derived-metadata.vitest.ts` for new bucket semantics (16/16 pass)
- [x] T010 Run full `npm run stress` — confirm exit 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Fill implementation-summary.md
- [ ] T012 Run `generate-context.js` for 045
- [ ] T013 Run `validate.sh --strict` for 045 — exit 0
- [ ] T014 git commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` tasks
- [ ] `validate.sh --strict` exit 0
- [ ] `npm run stress` exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source files modified**:
  - `mcp_server/skill_advisor/lib/derived/extract.ts`
  - `mcp_server/skill_advisor/lib/derived/sync.ts`
  - `mcp_server/skill_advisor/feature_catalog/08--python-compat/02-regression-suite.md`
  - `mcp_server/skill_advisor/feature_catalog/08--python-compat/03-bench-runner.md`
  - 3 test files
<!-- /ANCHOR:cross-refs -->

---
