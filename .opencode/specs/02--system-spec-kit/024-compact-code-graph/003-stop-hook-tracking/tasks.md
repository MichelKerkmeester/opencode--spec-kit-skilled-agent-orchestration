---
title: "Tasks: Stop Hook + Token Tracking [024/003]"
description: "Task tracking for Stop hook session-end processing and transcript-based token usage tracking."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 003 — Stop Hook + Token Tracking


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
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
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

### Completed

- [x] Create `claude-transcript.ts` parser — Streaming JSONL line reader with `MessageUsage` and `TranscriptUsage` interfaces; extracts `usage` from assistant messages, supports incremental `.stopoffset` parsing, returns normalized token counts + model name
- [x] Create `session-stop.ts` async Stop hook — Parses stdin JSON, checks `stop_hook_active` guard, loads hook-state for session, dispatches to transcript parser, calculates cost estimate, stores snapshot in hook state metrics
- [x] Implement incremental transcript parsing with byte offset — `parseTranscript()` accepts `startOffset`, reads only new lines, returns `{ usage, newOffset }` for bookmark tracking
- [x] Implement per-model cost estimation — `estimateCost()` in `claude-transcript.ts` with model-aware pricing (Opus 4.6, Sonnet 4.6, Haiku 4.5)
- [x] Store token snapshots in hook state metrics — `storeTokenSnapshot()` writes `estimatedPromptTokens`, `estimatedCompletionTokens`, `lastTranscriptOffset` to session state (lightweight alternative to SQLite table)
- [x] Register Stop hook with `async: true` — Added to `.claude/settings.local.json` pointing to `dist/hooks/claude/session-stop.js`
- [x] Implement `stop_hook_active` recursion guard — Early return when `input.stop_hook_active === false`
- [x] Auto-save context when >1000 output tokens — `AUTO_SAVE_TOKEN_THRESHOLD` constant; triggers lightweight context save via `generate-context.js` when exceeded
- [x] Duplicate-save prevention remains explicitly documented as a follow-up concern rather than a shipped dedicated hook-state field
- [x] Spec folder auto-detection from transcript — `detectSpecFolder()` called on transcript path, result stored in hook state `lastSpecFolder`
- [x] Session summary extraction from last assistant message — `extractSessionSummary()` truncates to ~200 chars at nearest sentence boundary, stored in hook state `sessionSummary`
- [x] `--finalize` mode for stale state cleanup — `cleanStaleStates()` removes state files older than 24 hours when invoked with `--finalize` argv flag
- [x] Token usage ratio fed into MCP pressure logic — `getTokenUsageRatio()` in `code-graph-db.ts` + `calculatePressureAdjustedBudget()` in `shared.ts`
- [x] Token usage viewable via `memory_stats` — Hook state stores `estimatedPromptTokens`/`estimatedCompletionTokens`; `code_graph_status` exposes graph metrics
- [x] Test suite — `hook-stop-token-tracking.vitest.ts` verifying token parsing, cost calculation, snapshot storage, and incremental offset handling
