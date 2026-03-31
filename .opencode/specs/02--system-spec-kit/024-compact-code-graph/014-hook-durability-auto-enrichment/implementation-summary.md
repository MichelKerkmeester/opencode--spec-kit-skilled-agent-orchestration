---
title: "Implementation Summary: Hook Durability & Auto-Enrichment [024/014]"
description: "Fixed 6 P1 hook reliability/security bugs and implemented 8 P2 auto-enrichment features. MCP first-call priming, injection fencing, SHA-256 session hashing, tool auto-enrichment."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/014-hook-durability-auto-enrichment |
| **Completed** | 2026-03-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Hook scripts now handle failures gracefully, fence recovered content against injection, use collision-resistant session hashing, and enforce file permissions. On the enrichment side, every MCP tool call now auto-primes the session on first use and can inject structural graph context alongside results.

### Hook Reliability (Items 16-17, 25-26)

The `pendingCompactPrime` payload was cleared before the injection write completed. If stdout failed, the payload was permanently lost. `readAndClearCompactPrime()` now reads the value, verifies the clear succeeds, and only then returns it. `saveState()` returns a boolean so callers detect disk failures instead of assuming success. A 30-minute TTL on cached compact payloads prevents stale recovery injection. The stop hook now uses a dedicated `pendingStopSave` field instead of overloading `pendingCompactPrime`.

### Security Hardening (Items 18, 20-21)

Recovered transcript text was replayed as trusted "Recovered Context" with no fencing. Now wrapped in `[SOURCE: hook-cache, cachedAt: <timestamp>]...[/SOURCE]` provenance markers with instruction-like pattern sanitization (strips lines starting with `You are`, `SYSTEM:`, etc.). Session state filenames used naive character replacement that could alias distinct session IDs. Replaced with SHA-256 hash (16-char hex). State directory created with 0700, files written with 0600 permissions.

### Constitutional Memory Survival (Item 19)

The Claude hook path (compact-inject.ts to session-prime.ts) bypassed `memory-surface.ts` entirely. Constitutional and triggered memories were lost at compaction. Now `autoSurfaceAtCompaction()` is called during the merge pipeline and constitutional sections are prepended to the output.

### MCP First-Call Priming (Item 22)

A module-level `sessionPrimed` flag in `memory-surface.ts` tracks whether the current session has been primed. On the first MCP tool call, `primeSessionIfNeeded()` loads constitutional memories and code graph status, injecting them via `meta.sessionPriming` in the response envelope. Works on all 5 runtimes without hook support.

### Tool Auto-Enrichment (Item 23)

Non-memory, non-graph tools that reference file paths now get 1-hop graph context injected as `meta.graphContext`. A `GRAPH_CONTEXT_EXCLUDED_TOOLS` set prevents recursion. A 250ms `Promise.race` timeout ensures enrichment never blocks the tool response. Returns `ok`, `timeout`, or `unavailable` status metadata.

### Stale-on-Read + Token Accounting (Items 24, 27)

`file_mtime_ms` column added to `code_files` (schema v2 migration). `isFileStale()` and `ensureFreshFiles()` compare stored vs filesystem mtimes. Token accounting now includes `cache_creation_tokens` and `cache_read_tokens` in surfaced totals.

### Dead Code Cleanup (Items 28-30)

Dead `workingSet` branch removed from session-prime.ts. Duplicated `syncEnvelopeTokenCount()` in response-hints.ts replaced with import from envelope.ts. Private `calculatePressureBudget()` replaced with shared `calculatePressureAdjustedBudget()` from shared.ts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/claude/hook-state.ts` | Modified | readAndClearCompactPrime, saveState boolean, SHA-256, permissions, pendingStopSave |
| `hooks/claude/session-prime.ts` | Modified | Provenance markers, TTL check, dead code removal, shared helper |
| `hooks/claude/session-stop.ts` | Modified | pendingStopSave field |
| `hooks/claude/compact-inject.ts` | Modified | autoSurfaceAtCompaction wiring, async buildMergedContext |
| `hooks/claude/shared.ts` | Modified | wrapRecoveredCompactPayload, sanitizeRecoveredContent |
| `hooks/memory-surface.ts` | Modified | primeSessionIfNeeded, resetSessionPrimed, code graph status |
| `hooks/response-hints.ts` | Modified | Import from envelope.ts, cache token accounting |
| `lib/response/envelope.ts` | Modified | Exported syncEnvelopeTokenCount, serializeEnvelopeWithTokenCount |
| `lib/code-graph/code-graph-db.ts` | Modified | file_mtime_ms column, schema v2 migration, stale-on-read |
| `context-server.ts` | Modified | First-call priming, graph auto-enrichment, 250ms timeout |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven Codex CLI agents (GPT-5.4, high reasoning) across two waves. Wave 2 (4 agents) covered reliability, security, hook path, and dead code. Wave 3 (3 agents) covered MCP priming, auto-enrichment, and stale-on-read. After both waves: 142/142 tests across 6 hook suites, then 213/213 including enrichment tests. ESLint clean on all modified files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| SHA-256 hash (16 chars) for session filenames | Naive sanitization aliased distinct IDs. 16-char hex gives 2^64 collision resistance. |
| Provenance markers over content sanitization alone | Markers let downstream code distinguish hook-recovered vs fresh context. Sanitization strips known instruction patterns as defense-in-depth. |
| Module-level sessionPrimed flag | Simplest mechanism that works across all runtimes. Reset on server restart. No persistent state needed. |
| 250ms Promise.race for graph enrichment | Graph queries are fast but DB init could be slow. Timeout prevents blocking the primary tool response. |
| Import canonical envelope helpers | Two files had convergence loops with different iteration counts (3 vs 5). Single source of truth with the 5-iteration safety bound. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tests/hook-state.vitest.ts` | PASS (18/18 including SHA-256 and permission checks) |
| `tests/hook-session-start.vitest.ts` | PASS |
| `tests/hook-precompact.vitest.ts` | PASS |
| `tests/dual-scope-hooks.vitest.ts` | PASS (82/82) |
| `tests/edge-cases.vitest.ts` | PASS |
| `tests/envelope.vitest.ts` | PASS |
| `tests/hooks-ux-feedback.vitest.ts` | PASS (43/43 including cache token tests) |
| `tests/crash-recovery.vitest.ts` | PASS (stale-on-read tests) |
| ESLint on all modified files | PASS (0 errors) |
| Phase 014 checklist | 17/17 items verified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **First-call priming is per-process.** If the MCP server restarts mid-session, priming fires again. This is acceptable since priming is idempotent.
2. **Graph enrichment returns nothing when DB is uninitialized.** The 250ms timeout handles this gracefully, but the first tool call in a fresh workspace gets no graph context.
3. **Stale-on-read checks filesystem mtime.** Files modified outside the indexed workspace (e.g., by git operations) trigger reindex correctly, but symlinked files may report stale mtimes on some platforms.
<!-- /ANCHOR:limitations -->
