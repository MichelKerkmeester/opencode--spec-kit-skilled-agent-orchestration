<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Improve Graph Metadata Key File Resolution - Tasks"
status: complete
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution"
    last_updated_at: "2026-04-13T14:24:00Z"
    last_updated_by: "codex"
    recent_action: "Completed parser fixes, focused tests, and repo-wide graph metadata refresh for key-file resolution"
    next_safe_action: "Reuse this phase if another key-file resolution regression appears in graph metadata"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T-V*` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [x] T-01: Add cross-track resolution for `system-spec-kit/` and `skilled-agent-orchestration/`.
- [x] T-02: Prune file-shaped candidates whose resolved file does not exist on disk before the final cap.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [x] T-03: Reject all `memory/metadata.json` references from derived `key_files`.
- [x] T-04: Add focused graph-metadata coverage for cross-track hits, stale deletions, and metadata-json rejection.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [x] T-05: Re-run the key-file quality measurement and record the before/after hit-rate evidence. Evidence: packet research baseline was `3,901 / 4,748` resolved (`82.16%`) with `847` misses; the post-refresh active scan now reports `4,516 / 4,516` resolved (`100%`) with `0` misses.
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when parser behavior, tests, and hit-rate evidence all support the new resolution path.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for the target fixes and `plan.md` for the parser-first rollout.<!-- /ANCHOR:cross-refs -->
