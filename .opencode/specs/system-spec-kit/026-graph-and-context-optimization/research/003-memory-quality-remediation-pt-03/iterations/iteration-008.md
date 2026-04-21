---
title: "Review Iteration 008: memory MCP server"
description: "Phase 7 drift audit of memory MCP server surfaces against the post-Phase-6 anchor and tool-contract baseline"
trigger_phrases:
  - "phase 7 review iteration 008"
  - "memory mcp server drift"
  - "anchor contract regression fixtures"
importance_tier: important
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/007-skill-catalog-sync"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-008.md"]

---

# Review Iteration 008: memory MCP server

## Surface Audited
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts`

## Findings

### P0 — must update before Sub-PR-14 ships
- **F008.1** — Pipeline-enforcement fixture still encodes the removed HTML-id scaffold and old `summary` anchor name
  - **Location**: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:138-169`
  - **Stale content**: The fixture builder still emits `<a id="..."></a>` markers and wraps the overview section in `<!-- ANCHOR:summary -->`.
  - **Why stale**: Phase 1 standardized the overview anchor on `overview`, and Phase 6 removed redundant HTML-id scaffolding from the live generated memory template. Leaving the enforcement fixture on the old contract makes the test surface describe a shape the template no longer emits.
  - **Required update**: Update the fixture content to use comment-based anchors only and rename the overview anchor to `overview`.

- **F008.2** — UX regression fixture still snapshots obsolete HTML ids and `summary` anchor markers
  - **Location**: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:64-95`
  - **Stale content**: The fixture hard-codes `<a id="continue-session"></a>`, `<a id="overview"></a>`, and `<!-- ANCHOR:summary -->`.
  - **Why stale**: This is the user-facing regression fixture for save responses, so it should reflect the same comment-only anchor contract as the live template.
  - **Required update**: Rewrite the fixture snapshot to remove HTML ids and rename the overview anchor block from `summary` to `overview`.

## Negative Cases (confirmed still accurate)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:669-674` still advertises the expected key tool surface, including `memory_context`, `memory_search`, `memory_save`, and `memory_index_scan`.
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:61-66` still exposes `memory_match_triggers` and `memory_save` from the memory tools module.

## Confidence
**0.94** — Audited the highest-signal runtime and fixture files. The tool-contract surface is current; the drift is isolated to test fixtures that still mirror the pre-Phase-6 anchor shape.

## Cross-Surface Notes
- This is the main non-`generate-context` theme in Phase 7: internal save fixtures still mirror the old anchor scaffold even though the live template has already moved on.
