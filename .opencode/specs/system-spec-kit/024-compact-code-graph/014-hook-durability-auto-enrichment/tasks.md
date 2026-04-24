---
title: "Tasks: Hook Durability & [system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment/tasks]"
description: "Task tracking for 15 items."
trigger_phrases:
  - "tasks"
  - "hook"
  - "durability"
  - "014"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 014 — Hook Durability & Auto-Enrichment


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

### Status

- [x] Item 1 (Spec 16): Narrow pendingCompactPrime delete-before-read race — Evidence: `readAndClearCompactPrime()` in hook-state.ts reads the value before clearing persisted state, but payload can still be lost if stdout fails after clear
- [x] Item 2 (Spec 17): Improve saveState() failure visibility — Evidence: `saveState()` returns boolean in hook-state.ts; current callers log `hookLog` warnings on failure and continue instead of propagating disk errors
- [x] Item 3 (Spec 18): Fence recovered context with provenance markers — Evidence: `[SOURCE: hook-cache, cachedAt: <timestamp>]...[/SOURCE]` markers in session-prime.ts; instruction-like patterns sanitized (strips `You are`, `SYSTEM:`, etc.)
- [x] Item 4 (Spec 19): Wire Claude hook path through memory-surface.ts — Evidence: `autoSurfaceAtCompaction()` called during merge pipeline in compact-inject.ts; constitutional sections prepended to output
- [x] Item 5 (Spec 20): Collision-resistant session_id hashing — Evidence: SHA-256 hash (16-char hex, 2^64 collision resistance) replaces naive character replacement in hook-state.ts
- [x] Item 6 (Spec 21): Set restrictive permissions on hook-state temp files — Evidence: directory created with 0o700, files written with 0o600 in hook-state.ts
- [x] Item 7 (Spec 25): Cache freshness validation — Evidence: `CACHE_TTL_MS = 30 * 60 * 1000` constant; cachedAt TTL check in session-prime.ts rejects stale compact caches
- [x] Item 8 (Spec 26): Stop-hook surrogate-save redesign remains explicitly documented as unimplemented because no dedicated `pendingStopSave` field shipped
- [x] Item 9 (Spec 27): Cache-token bucket accounting — Evidence: `cache_creation_tokens` and `cache_read_tokens` included in surfaced totals in response-hints.ts (imports from envelope.ts)
- [x] Item 10 (Spec 24): Stale-on-read mechanism (ensureFreshFiles) — Evidence: `file_mtime_ms` column added to `code_files` via schema migration in code-graph-db.ts; `isFileStale()` and `ensureFreshFiles()` compare stored vs filesystem mtimes using flat fresh/stale classification
- [x] Item 11 (Spec 22): MCP first-call priming — Evidence: module-level `sessionPrimed` flag in memory-surface.ts is process-global, not session-scoped; `primeSessionIfNeeded()` loads constitutional memories + code graph status via `meta.sessionPriming` in the response envelope
- [x] Item 12 (Spec 23): Tool-dispatch auto-enrichment — Evidence: `GRAPH_CONTEXT_EXCLUDED_TOOLS` set prevents recursion in context-server.ts; 1-hop graph context injected as `meta.graphContext`; 250ms `Promise.race` timeout ensures non-blocking enrichment
- [x] Item 13 (Spec 28): Remove dead workingSet branch — Evidence: unreachable workingSet branch and associated type references deleted from session-prime.ts
- [x] Item 14 (Spec 29): Consolidate duplicated token-count sync logic — Evidence: duplicated `syncEnvelopeTokenCount()` in response-hints.ts replaced with import from canonical envelope.ts (single source of truth with 5-iteration safety bound)
- [x] Item 15 (Spec 30): Replace drifted pressure-budget helper — Evidence: private `calculatePressureBudget()` in session-prime.ts replaced with shared `calculatePressureAdjustedBudget()` from shared.ts
