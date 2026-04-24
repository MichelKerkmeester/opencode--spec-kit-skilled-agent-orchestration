---
title: "Tasks: Non-Hook Auto-Priming & Session Health [system-spec-kit/024-compact-code-graph/018-non-hook-auto-priming/tasks]"
description: "Task tracking for MCP first-call auto-priming and session health."
trigger_phrases:
  - "tasks"
  - "non"
  - "hook"
  - "auto"
  - "priming"
  - "018"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/018-non-hook-auto-priming"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 018 — Non-Hook Auto-Priming & Session Health


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

**Overall phase state:** PARTIAL — the core MCP behavior shipped, but follow-up limitations and cross-phase doc ownership remain open.

### Completed

- [x] PrimePackage struct defined — memory-surface.ts (specFolder, codeGraphStatus, cocoIndexAvailable, recommendedCalls)
- [x] primeSessionIfNeeded() wired into context-server.ts — sessionPrimed flag + auto-prime on first tool call
- [x] Token budget enforcement on prime payload — enforceAutoSurfaceTokenBudget applied
- [x] session_health tool created — handlers/session-health.ts (132 lines), returns ok/warning/stale
- [x] recordToolCall/getSessionTimestamps exports — memory-surface.ts:101-107
- [x] Tool schema registration — session_health registered in tool-schemas.ts and schemas/tool-input-schemas.ts
- [x] Handler wired in lifecycle-tools.ts — session_health dispatched from tool dispatch
- [x] F045 fixed — sessionPrimed now flips after successful priming instead of before the try block
- [x] F046 fixed — CocoIndex availability now uses the shared helper instead of process.cwd()-based lookup

### Deferred / Follow-Up

- [x] session_health idle-gap timer limitation is documented explicitly
- [x] spec-folder-change warning path remains explicitly documented as not implemented in this phase
- [x] CLAUDE.md/GEMINI.md gate-doc parity follow-up is explicitly handed off to Phase 021
- [x] F047 dual `lastToolCallAt` state was tracked as tech debt and later addressed separately
