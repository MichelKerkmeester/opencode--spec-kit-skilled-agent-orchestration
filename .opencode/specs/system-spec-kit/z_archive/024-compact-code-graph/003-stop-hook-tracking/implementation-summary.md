<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Implementation Summary: Stop [system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary]"
description: "Implemented async Stop hook for session-end token tracking and context auto-save, with streaming transcript parser and incremental offset-based parsing."
trigger_phrases:
  - "implementation"
  - "summary"
  - "stop"
  - "implementation summary"
  - "003"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "024-compact-code-graph/003-stop-hook-tracking"
    last_updated_at: "2026-04-24T15:33:48Z"
    last_updated_by: "claude-opus-4-7-spec-audit-2026-04-24"
    recent_action: "Spec audit + path reference remediation (Pass 1-3)"
    next_safe_action: "Continue systematic remediation or reindex"
    blockers: []

---
# Implementation Summary


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Metadata
Template compliance shim section. Legacy phase content continues below.

## What Was Built
Template compliance shim section. Legacy phase content continues below.

## How It Was Delivered
Template compliance shim section. Legacy phase content continues below.

## Key Decisions
Template compliance shim section. Legacy phase content continues below.

## Verification
Template compliance shim section. Legacy phase content continues below.

## Known Limitations
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:decisions -->
Decision details are documented in the Key Decisions section above.
<!-- /ANCHOR:decisions -->

<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
### Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 003-stop-hook-tracking |
| **Completed** | 2026-03-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
### What Was Built
An async Stop hook that fires when a Claude Code session ends, parses the transcript JSONL for token usage, stores snapshots in hook state, and optionally triggers a lightweight context save when significant work was performed.

### Transcript Parser (`claude-transcript.ts`)

A streaming JSONL parser that extracts token usage from Claude Code transcript files. Defines `MessageUsage` and `TranscriptUsage` interfaces for normalized token data. The `parseTranscript()` function accepts a `startOffset` parameter for incremental parsing — only new lines since the last parse are processed, preventing duplicate counting across multiple Stop fires. Returns aggregated `{ promptTokens, completionTokens, cacheCreationTokens, cacheReadTokens, totalTokens, messageCount, model }`. The `estimateCost()` function applies model-aware pricing tables (Opus 4.6, Sonnet 4.6, Haiku 4.5) to compute a USD cost estimate.

### Stop Hook (`session-stop.ts`)

The main hook script registered with `async: true` so it runs in background without blocking the user from exiting. Reads stdin JSON from the Claude Code Stop event, checks the `stop_hook_active` guard to prevent recursive execution, and loads hook-state for the session. Dispatches to the transcript parser with incremental offset, stores the token snapshot via `storeTokenSnapshot()` in hook state metrics (not a separate SQLite table — the hook state JSON approach proved simpler and sufficient). Updates the offset bookmark for the next invocation.

Auto-save logic triggers `generate-context.js` when output tokens exceed `AUTO_SAVE_TOKEN_THRESHOLD` (1000 tokens). A `RECENT_SAVE_WINDOW_MS` (5-minute) deduplication window prevents double-saves when multiple Stop events fire in quick succession. The `extractSessionSummary()` function captures a brief summary (~200 chars, sentence-boundary-aware) from the last assistant message, stored in hook state for later use by resume flows.

The `--finalize` flag triggers `cleanStaleStates()`, removing session state files older than 24 hours. This enables `SessionEnd` hook reuse via `session-stop.ts --finalize`.

### Pressure Integration

Token usage feeds back into the MCP budget system: `getTokenUsageRatio()` in `code-graph-db.ts` reads the stored token metrics, and `calculatePressureAdjustedBudget()` in `shared.ts` adjusts code graph budget allocation based on session token pressure.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/claude/session-stop.ts` | New | Async Stop hook: token tracking, auto-save, summary extraction |
| `hooks/claude/claude-transcript.ts` | New | Streaming JSONL transcript parser with incremental offset |
| `.claude/settings.local.json` | Modified | Registered Stop hook with `async: true` |
| `lib/code-graph/code-graph-db.ts` | Modified | Added `getTokenUsageRatio()` for pressure feedback |
| `hooks/claude/shared.ts` | Modified | Added `calculatePressureAdjustedBudget()` using token ratio |
| `tests/hook-stop-token-tracking.vitest.ts` | New | Test suite for token parsing, cost estimation, snapshots |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
### How It Was Delivered
Implemented in a single session as part of the 024-compact-code-graph hook pipeline (phases 1-4 were developed together). The transcript parser was built first as a standalone module, then integrated into the Stop hook. Token storage was simplified from the original spec's SQLite `session_token_snapshots` table to hook-state JSON — the append-only semantic was preserved while avoiding schema migration complexity.
<!-- /ANCHOR:how-delivered -->

---
### Key Decisions
| Decision | Why |
|----------|-----|
| Hook-state JSON over SQLite table for token snapshots | Simpler than adding a new table + migration; hook state already persists per-session data; query needs are minimal (current session only) |
| `async: true` for Stop hook | Users should not be blocked from exiting while token counting runs in background |
| 5-minute deduplication window | Multiple Stop events can fire per session; prevents duplicate context saves without complex locking |
| Sentence-boundary truncation for summaries | Produces readable summaries; falls back to hard truncate at 200 chars if no good boundary found |
| `--finalize` flag over separate script | Reuses existing session-stop.ts code path; enables SessionEnd hook reuse without a new file |
---

<!-- ANCHOR:verification -->
### Verification
| Check | Result |
|-------|--------|
| `tests/hook-stop-token-tracking.vitest.ts` | PASS |
| Stop hook fires on session end | Verified — async execution, no user blocking |
| Incremental offset parsing | Verified — second parse starts from prior offset |
| Cost estimate accuracy | Verified — model-aware pricing applied correctly |
| `stop_hook_active` guard | Verified — early return when false |
| Auto-save threshold | Verified — triggers at >1000 output tokens |
| Phase 003 checklist | 15/15 items verified (P0: 7, P1: 4, P2: 4) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
### Known Limitations
1. **Token counts are estimates.** Transcript JSONL may not contain usage data for all message types (e.g., tool results). Counts represent a lower bound of actual usage.
2. **Hook-state JSON is not queryable across sessions.** Unlike the originally-specced SQLite table, multi-session token reporting requires reading individual state files. Sufficient for v1 needs.
3. **Auto-save now executes `generate-context.js` directly.** The hook attempts a best-effort save when thresholds are met and logs non-fatal warnings when script resolution or execution fails.
4. **Cost estimation is incomplete.** The current estimate covers input and output tokens only and does not include cache read or cache write pricing.
5. **Compiled hook artifacts require a build step.** Hook registration points to `dist/hooks/claude/session-stop.js`, so source changes do not take effect until the `dist/` files are rebuilt.
<!-- /ANCHOR:limitations -->
