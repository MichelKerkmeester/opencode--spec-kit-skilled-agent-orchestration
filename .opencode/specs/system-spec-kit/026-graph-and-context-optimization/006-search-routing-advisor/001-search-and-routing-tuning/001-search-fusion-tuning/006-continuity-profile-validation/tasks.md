---
title: "Tasks: Validate Continuity Profile Weights"
description: "Task Format: T### Description (file path)."
trigger_phrases:
  - "continuity profile validation"
  - "search fusion tuning"
  - "validate continuity profile weights"
  - "continuity profile validation tasks"
  - "system spec kit"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "...earch-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation/tasks]"
description: 'title: "Validate Continuity Profile Weights - Tasks"'
trigger_phrases:
  - "earch"
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "tasks"
  - "006"
  - "continuity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the continuity prompt enrichment and 12-query judged fixture"
    next_safe_action: "Resume from implementation-summary.md if follow-on continuity tuning is opened"
status: completed
---
# Tasks: Validate Continuity Profile Weights

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

**Task Format**: `T### Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the existing continuity prompt and K-sweep harness (`mcp_server/lib/routing/content-router.ts`, `mcp_server/tests/k-value-optimization.vitest.ts`)
- [x] T002 Confirm the packet-local verification and closeout requirements (`plan.md`, `tasks.md`, `checklist.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the user-directed 12-query judged continuity fixture (`mcp_server/tests/k-value-optimization.vitest.ts`)
- [x] T004 Record the keep recommendation for baseline `K=60` (`mcp_server/tests/k-value-optimization.vitest.ts`)
- [x] T005 Add the continuity prompt paragraph and prompt-contract assertion (`mcp_server/lib/routing/content-router.ts`, `mcp_server/tests/content-router.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T007 Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/k-value-optimization.vitest.ts tests/content-router.vitest.ts`
- [x] T008 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Judged continuity fixture, prompt update, and packet validation all passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
