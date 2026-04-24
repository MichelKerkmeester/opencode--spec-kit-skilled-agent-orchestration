---
title: "...rch-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion/tasks]"
description: 'title: "Fix Handover vs Drop Routing Confusion - Tasks"'
trigger_phrases:
  - "rch"
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "tasks"
  - "002"
  - "fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
status: complete
---
# Tasks
- [x] T001: Split the `drop` cue table in `mcp_server/lib/routing/content-router.ts:409-411` into hard wrappers and soft operational commands using the seam defined in `../../../../research/010-search-and-routing-tuning-pt-02/research.md:40-53`.
- [x] T002: Extend the `handover_state` floor in `mcp_server/lib/routing/content-router.ts:1001-1014` with the state-first phrases named in `../../../../research/010-search-and-routing-tuning-pt-02/research.md:45-53`.
- [x] T003: Keep `extractHardNegativeFlags()` in `mcp_server/lib/routing/content-router.ts:1039-1049` limited to wrapper and boilerplate signals rather than ordinary commands.
- [x] T004: Refresh the state-vs-command balance in `mcp_server/lib/routing/routing-prototypes.json:83-129` for the handover examples cited in `../../../../research/010-search-and-routing-tuning-pt-02/research.md:42-48`.
- [x] T005: Add regression tests in `mcp_server/tests/content-router.vitest.ts:110-141` for handover chunks that include `git diff`, `force re-index`, or restart instructions.
## Verification
- [x] T901: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T902: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`
