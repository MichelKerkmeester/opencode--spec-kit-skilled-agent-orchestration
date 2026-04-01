---
title: "Implementation Summary: Non-Hook Auto-Priming & Session Health [024/018]"
description: "MCP first-call auto-priming with PrimePackage and session_health tool for traffic-light session monitoring."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/018-non-hook-auto-priming |
| **Completed** | 2026-03-31 (3 items deferred) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Non-hook CLIs (Codex, Copilot, Gemini, OpenCode) now receive automatic session context on their first MCP tool call, closing the parity gap with Claude Code's hook-based priming. A new `session_health` tool provides traffic-light monitoring for context freshness.

### MCP First-Call Auto-Prime

When the MCP server receives its first tool call in a session, `primeSessionIfNeeded()` in `context-server.ts` gathers a `PrimePackage` containing the last active spec folder, code graph freshness status, CocoIndex availability, and recommended next calls. This is injected as structured meta + human-readable hints into the tool response. The `enforceAutoSurfaceTokenBudget` keeps the payload bounded. A `sessionPrimed` boolean flag prevents re-priming on subsequent calls.

### Session Health Monitor

`handlers/session-health.ts` implements the `session_health` tool returning a traffic-light score:
- **ok** — session is fresh, context loaded, graph recent
- **warning** — session may have drifted (long gap between calls, spec folder changed)
- **stale** — probable context loss (should call `memory_context` to recover)

### Tool Call Tracking

`recordToolCall()` and `getSessionTimestamps()` in `memory-surface.ts` track first and last tool call timestamps per session, enabling both the session health calculation and the auto-prime trigger.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files-changed -->
## Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `hooks/memory-surface.ts` | Modified | PrimePackage struct, recordToolCall, getSessionTimestamps exports |
| `handlers/session-health.ts` | New | session_health handler with ok/warning/stale scoring |
| `context-server.ts` | Modified | primeSessionIfNeeded(), sessionPrimed flag, health warning injection |
| `hooks/index.ts` | Modified | Re-export of new memory-surface functions |
| `tool-schemas.ts` | Modified | session_health tool registration |
| `schemas/tool-input-schemas.ts` | Modified | session_health input schema |
| `tools/lifecycle-tools.ts` | Modified | session_health dispatch wiring |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:verification -->
## Verification

- TypeScript: 0 errors
- Tests: 327 passed, 23 failed (pre-existing, unrelated)
- Review: Opus CONDITIONAL PASS 78/100, GPT-5.4 CONDITIONAL 82%
<!-- /ANCHOR:verification -->
