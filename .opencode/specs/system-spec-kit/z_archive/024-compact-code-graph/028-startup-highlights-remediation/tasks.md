---
title: "Tasks: Startup Highlights [system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/tasks]"
description: "Task tracking for P1 fixes in queryStartupHighlights()."
trigger_phrases:
  - "028 tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Startup Highlights Remediation

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` not started
- `[~]` in progress
- `[x]` completed with implementation or verification evidence
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **Task 1** Verify CALLS edge direction in the structural indexer so incoming-call ranking is based on the real edge contract.
- [x] Confirm the remediation remains scoped to startup-highlight output and does not reopen sibling startup-brief contract work.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase -->
## Phase 2: Implementation

- [x] **Task 2** Rewrite `queryStartupHighlights()` with the `filtered_nodes -> aggregated -> ranked` CTE chain.
- [x] Add path exclusion filters for vendored, generated, and test-heavy directories.
- [x] Group by display fields instead of raw symbol IDs so duplicate visible rows collapse correctly.
- [x] Switch call ranking from outgoing-call volume to incoming-call importance.
- [x] Preserve the existing max-two-results-per-file diversity behavior.
<!-- /ANCHOR:phase -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **Task 3** Extend verification coverage in `startup-brief.vitest.ts` and keep the focused runtime tests passing.
- [x] **Task 4** Run live verification against the current workspace graph and confirm zero duplicate plus zero vendored/test startup highlights.
- [x] Confirm the final output stays recognizable and project-relevant: `normalizeWhitespace`, `getDb`, `ensureSchema`, `hasTable`, `Finding`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All three deep-review findings (duplicate rows, vendored/test pollution, wrong call-direction heuristic) are addressed.
- Validation evidence shows the query still works with existing startup-brief consumers.
- Packet documentation reflects the completed remediation without claiming unrelated packet work.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deep review findings P1-001, P1-002, and P1-003 from `../review/review-report.md`
- Runtime implementation in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
- Focused verification in `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts`
<!-- /ANCHOR:cross-refs -->
