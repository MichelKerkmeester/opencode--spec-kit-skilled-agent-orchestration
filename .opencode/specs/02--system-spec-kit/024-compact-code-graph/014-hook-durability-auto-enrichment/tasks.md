---
title: "Tasks: Hook Durability & Auto-Enrichment [024/014]"
description: "Task tracking for 15 items."
---
# Tasks: Phase 014 — Hook Durability & Auto-Enrichment

## Completed

- [x] Item 1 (Spec 16): Fix pendingCompactPrime delete-before-read race — Evidence: `readAndClearCompactPrime()` in hook-state.ts reads value, verifies clear succeeds, then returns; payload not lost on injection failure
- [x] Item 2 (Spec 17): Propagate saveState() errors — Evidence: saveState() returns boolean in hook-state.ts; callers detect disk failures instead of assuming success
- [x] Item 3 (Spec 18): Fence recovered context with provenance markers — Evidence: `[SOURCE: hook-cache, cachedAt: <timestamp>]...[/SOURCE]` markers in session-prime.ts; instruction-like patterns sanitized (strips `You are`, `SYSTEM:`, etc.)
- [x] Item 4 (Spec 19): Wire Claude hook path through memory-surface.ts — Evidence: `autoSurfaceAtCompaction()` called during merge pipeline in compact-inject.ts; constitutional sections prepended to output
- [x] Item 5 (Spec 20): Collision-resistant session_id hashing — Evidence: SHA-256 hash (16-char hex, 2^64 collision resistance) replaces naive character replacement in hook-state.ts
- [x] Item 6 (Spec 21): Set restrictive permissions on hook-state temp files — Evidence: directory created with 0o700, files written with 0o600 in hook-state.ts
- [x] Item 7 (Spec 25): Cache freshness validation — Evidence: `CACHE_TTL_MS = 30 * 60 * 1000` constant; cachedAt TTL check in session-prime.ts rejects stale compact caches
- [x] Item 8 (Spec 26): Stop-hook surrogate save redesign — Evidence: dedicated `pendingStopSave` field in hook-state.ts; session-stop.ts updated to use new field instead of overloading pendingCompactPrime
- [x] Item 9 (Spec 27): Cache-token bucket accounting — Evidence: `cache_creation_tokens` and `cache_read_tokens` included in surfaced totals in response-hints.ts (imports from envelope.ts)
- [x] Item 10 (Spec 24): Stale-on-read mechanism (ensureFreshFiles) — Evidence: `file_mtime_ms` column added to code_files (schema v2 migration) in code-graph-db.ts; `isFileStale()` and `ensureFreshFiles()` compare stored vs filesystem mtimes
- [x] Item 11 (Spec 22): MCP first-call priming — Evidence: module-level `sessionPrimed` flag in memory-surface.ts; `primeSessionIfNeeded()` loads constitutional memories + code graph status via `meta.sessionPriming` in response envelope; works on all 5 runtimes
- [x] Item 12 (Spec 23): Tool-dispatch auto-enrichment — Evidence: `GRAPH_CONTEXT_EXCLUDED_TOOLS` set prevents recursion in context-server.ts; 1-hop graph context injected as `meta.graphContext`; 250ms `Promise.race` timeout ensures non-blocking enrichment
- [x] Item 13 (Spec 28): Remove dead workingSet branch — Evidence: unreachable workingSet branch and associated type references deleted from session-prime.ts
- [x] Item 14 (Spec 29): Consolidate duplicated token-count sync logic — Evidence: duplicated `syncEnvelopeTokenCount()` in response-hints.ts replaced with import from canonical envelope.ts (single source of truth with 5-iteration safety bound)
- [x] Item 15 (Spec 30): Replace drifted pressure-budget helper — Evidence: private `calculatePressureBudget()` in session-prime.ts replaced with shared `calculatePressureAdjustedBudget()` from shared.ts
