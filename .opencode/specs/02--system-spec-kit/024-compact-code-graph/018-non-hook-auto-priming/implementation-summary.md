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
| **Spec Folder** | 018-non-hook-auto-priming |
| **Completed** | 2026-03-31 |
| **Status** | PARTIAL |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The core non-hook auto-priming work shipped for Codex, Copilot, Gemini, and OpenCode, closing most of the parity gap with Claude Code's hook-based priming. The phase is still PARTIAL because `session_health` has known signal gaps and some runtime gate-doc alignment is owned by Phase 021 rather than this phase.

### MCP First-Call Auto-Prime

When the MCP server receives its first tool call in a session, `primeSessionIfNeeded()` in `context-server.ts` gathers a `PrimePackage` containing the last active spec folder, code graph freshness status, CocoIndex availability, and recommended next calls. This is injected as structured meta + human-readable hints into the tool response. The `enforceAutoSurfaceTokenBudget` keeps the payload bounded. A `sessionPrimed` boolean flag prevents re-priming on subsequent calls.

### Session Health Monitor

`handlers/session-health.ts` implements the `session_health` tool returning a traffic-light score:
- **ok** — session is fresh, context loaded, graph recent
- **warning** — session may have drifted after a long gap between calls. The spec-folder-change warning described in the phase spec is still not emitted.
- **stale** — probable context loss (should call `memory_context` to recover)

Calling `session_health` currently records a tool call before the health calculation runs, so `lastToolCallAgoMs` reflects time since the health check itself rather than the previous external tool call.

### Tool Call Tracking

`recordToolCall()` and `getSessionTimestamps()` in `memory-surface.ts` track first and last tool call timestamps per session, enabling both the session health calculation and the auto-prime trigger. `session_health` now prefers `context-metrics.ts` as its primary `lastToolCallAt` source, but the duplicate timestamp retained in `memory-surface.ts` remains technical debt.
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

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This phase delivered the server-side pieces first: first-call auto-priming, the `session_health` handler, and the dispatch wiring needed to expose both without runtime hooks. Later fixes closed the two review findings tied to priming retry behavior and CocoIndex path detection, while leaving the remaining `session_health` signal gaps documented instead of overstating completion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mark the phase PARTIAL instead of DONE | The shipped code is real, but the health monitor still misses spec-folder-change warnings and self-resets its idle timer. |
| Close F045 and F046 in the phase record | The code now flips `sessionPrimed` after successful priming and uses `isCocoIndexAvailable()` for CocoIndex detection. |
| Keep F047 listed as deferred tech debt | `session_health` reads the metrics timestamp, but the duplicate timestamp in `memory-surface.ts` still exists and should be consolidated later. |
| Attribute CLAUDE.md and GEMINI.md parity to Phase 021 | Those gate-doc updates live in the later phase and should not be retroactively claimed here. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- TypeScript: 0 errors
- Tests: 327 passed, 23 failed (pre-existing, unrelated)
- Review: Opus CONDITIONAL PASS 78/100, GPT-5.4 CONDITIONAL 82%
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`session_health` resets its own idle timer.** Tool dispatch records a tool call before the handler computes inactivity, so the reported gap is shorter than intended on health-check calls.
2. **Spec-folder-change warnings are not implemented.** `context-metrics.ts` tracks `spec_folder_change`, but `session_health` does not currently lower status or emit a warning from that signal.
3. **Runtime gate docs are partial in this phase.** Shared/non-hook guidance landed here, but `CLAUDE.md` and `GEMINI.md` gate-doc parity is handled by Phase 021 and should not be claimed as Phase 018 completion.
4. **Dual `lastToolCallAt` state remains.** `memory-surface.ts` and `context-metrics.ts` both retain timestamp state. The handler prefers the metrics copy, but cleanup is still pending.
5. **Previously deferred F045/F046 are now closed.** `sessionPrimed` flips after successful priming, and CocoIndex availability now uses the shared helper instead of a `process.cwd()` lookup.
<!-- /ANCHOR:limitations -->
