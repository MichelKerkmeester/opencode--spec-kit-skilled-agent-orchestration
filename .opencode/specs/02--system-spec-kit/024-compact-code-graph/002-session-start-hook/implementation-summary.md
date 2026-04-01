---
title: "Implementation Summary: SessionStart Hook [024/002]"
description: "Auto-prime every new Claude Code session with source-aware context routing across startup, resume, clear, and compact lifecycle events."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/002-session-start-hook |
| **Completed** | 2026-03-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented a unified SessionStart hook that auto-primes every Claude Code session with relevant prior context. The `session-prime.ts` script handles all four SessionStart sources (startup, resume, clear, compact) with source-aware routing, each producing appropriately scoped context. Shared with Phase 1's compact injection path to eliminate code duplication.

### Source-Aware Routing

- **`source=compact`**: Reads `pendingCompactPrime` from hook-state cache (Phase 1). If cache exists and is fresh, outputs cached context (4000-token budget). Falls through to resume flow if no cache.
- **`source=startup`**: Outputs tool availability guidance listing Spec Kit Memory tools, CocoIndex status, and Code Graph tools. Checks for stale code graph index (>24h) and warns if needed. Does not perform active retrieval.
- **`source=resume`**: Outputs resume instructions directing the AI to call `memory_context` with resume profile. Shows `lastSpecFolder` from hook state if available. Does not call `memory_context` directly.
- **`source=clear`**: Outputs minimal guidance reminding that Spec Kit Memory is active and tools are available. Does not load constitutional memories.

### Key Fixes

- **`profile: "resume"` gap** (iteration 012): All resume paths now pass `profile: "resume"` for the compact brief format. The `/spec_kit:resume` command was also updated to pass this profile.
- **Token pressure awareness**: `calculatePressureBudget()` dynamically scales the output budget when context window is filling (>70% and >90% thresholds), reducing injection size under pressure.
- **Spec folder auto-detection**: `detectSpecFolder()` identifies the active spec folder from project context, and `lastSpecFolder` is persisted in hook state for cross-session continuity.

### Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `mcp_server/hooks/claude/session-prime.ts` | New | Unified SessionStart handler with 4-source routing |
| `mcp_server/hooks/claude/shared.ts` | Modified | Added session budget profiles (startup/resume/clear) |
| `mcp_server/hooks/claude/hook-state.ts` | Modified | Added lastSpecFolder, workingSet state persistence |
| `.claude/settings.local.json` | Modified | SessionStart hook registration (no matcher, all sources) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] SessionStart hook registered and fires on all 4 sources (startup, resume, clear, compact)
- [x] Source routing produces appropriate context for each source type
- [x] `profile: "resume"` passed for compact brief format (iter 012 gap fixed)
- [x] Output includes tool availability guidance on all paths
- [x] startup/resume output stays within 2000-token budget
- [x] compact output stays within 4000-token budget
- [x] Script completes in <3 seconds
- [x] Graceful fallback when MCP unavailable
- [x] No code duplication with Phase 1 compact path (shared session-prime.ts)
- [x] Token pressure awareness scales budget at >70%/>90% context window usage
- [x] Spec folder auto-detected from project context
<!-- /ANCHOR:verification -->
