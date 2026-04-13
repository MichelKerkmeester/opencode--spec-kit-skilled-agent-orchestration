<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Improve Graph Metadata Key File Resolution - Tasks"
status: planned
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/006-key-file-resolution"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured implementation tasks for key-file resolution"
    next_safe_action: "Patch the parser and add focused verification"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T-V*` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [ ] T-01: Add cross-track resolution for `system-spec-kit/` and `skilled-agent-orchestration/`.
- [ ] T-02: Prune candidates for files deleted more than 30 days ago before the final cap.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [ ] T-03: Reject all `memory/metadata.json` references from derived `key_files`.
- [ ] T-04: Add focused graph-metadata coverage for cross-track hits, stale deletions, and metadata-json rejection.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [ ] T-05: Re-run the key-file quality measurement and record the before/after hit-rate evidence.
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when parser behavior, tests, and hit-rate evidence all support the new resolution path.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for the target fixes and `plan.md` for the parser-first rollout.<!-- /ANCHOR:cross-refs -->
