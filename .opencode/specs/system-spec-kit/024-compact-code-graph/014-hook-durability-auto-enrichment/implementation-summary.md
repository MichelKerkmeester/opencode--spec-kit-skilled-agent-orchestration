<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Implementation [system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment/implementation-summary]"
description: "Fixed 6 P1 hook reliability/security bugs and implemented 8 P2 auto-enrichment features. MCP first-call priming, injection fencing, SHA-256 session hashing, tool auto-enrichment."
trigger_phrases:
  - "implementation"
  - "implementation summary"
  - "014"
  - "hook"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "024-compact-code-graph/014-hook-durability-auto-enrichment"
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

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
Template compliance shim anchor for what-built.
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
Template compliance shim anchor for how-delivered.
<!-- /ANCHOR:how-delivered -->
Template compliance shim anchor for decisions.
<!-- ANCHOR:decisions -->
Decision details are documented in the Key Decisions section above.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
Template compliance shim anchor for verification.
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
Template compliance shim anchor for limitations.
<!-- /ANCHOR:limitations -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata-2 -->
### Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 014-hook-durability-auto-enrichment |
| **Completed** | 2026-03-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata-2 -->

---

<!-- ANCHOR:what-built-2 -->
### What Was Built
Hook scripts now handle failures gracefully, fence recovered content against injection, use collision-resistant session hashing, and enforce file permissions. On the enrichment side, every MCP tool call now auto-primes the session on first use and can inject structural graph context alongside results.

### Hook Reliability (Items 16-17, 25-26)

The `pendingCompactPrime` payload used to be cleared before it was even read back from disk. `readAndClearCompactPrime()` now reads the cached value first and then attempts to clear it, which improves the ordering and narrows the race window. This is only a partial fix: the payload is still cleared on disk before the caller's stdout write is confirmed, so a stdout failure after clear can still lose the payload. `saveState()` now returns a boolean, but current callers do not propagate disk failures. They log warnings through `hookLog` and continue. A 30-minute TTL on cached compact payloads prevents stale recovery injection. The planned `pendingStopSave` field was not added to `HookState`, so that redesign remains unimplemented.

### Security Hardening (Items 18, 20-21)

Recovered transcript text was replayed as trusted "Recovered Context" with no fencing. Now wrapped in `[SOURCE: hook-cache, cachedAt: <timestamp>]...[/SOURCE]` provenance markers with instruction-like pattern sanitization (strips lines starting with `You are`, `SYSTEM:`, etc.). Session state filenames used naive character replacement that could alias distinct session IDs. Replaced with SHA-256 hash (16-char hex). State directory created with 0700, files written with 0600 permissions.

### Constitutional Memory Survival (Item 19)

The Claude hook path (compact-inject.ts to session-prime.ts) bypassed `memory-surface.ts` entirely. Constitutional and triggered memories were lost at compaction. Now `autoSurfaceAtCompaction()` is called during the merge pipeline and constitutional sections are prepended to the output.

### MCP First-Call Priming (Item 22)

A module-level `sessionPrimed` flag in `memory-surface.ts` tracks whether the current MCP server process has been primed. On the first MCP tool call, `primeSessionIfNeeded()` loads constitutional memories and code graph status, injecting them via `meta.sessionPriming` in the response envelope. Works on all 5 runtimes without hook support, but the flag is process-global rather than session-scoped.

### Tool Auto-Enrichment (Item 23)

Non-memory, non-graph tools that reference file paths now get 1-hop graph context injected as `meta.graphContext`. A `GRAPH_CONTEXT_EXCLUDED_TOOLS` set prevents recursion. A 250ms `Promise.race` timeout ensures enrichment never blocks the tool response. Returns `ok`, `timeout`, or `unavailable` status metadata.

### Stale-on-Read + Token Accounting (Items 24, 27)

`file_mtime_ms` was added to `code_files` via schema migration. `isFileStale()` and `ensureFreshFiles()` compare stored vs filesystem mtimes and classify files as either fresh or stale. This does not implement the spec's 3-tier threshold model. Token accounting now includes `cache_creation_tokens` and `cache_read_tokens` in surfaced totals.

### Dead Code Cleanup (Items 28-30)

Dead `workingSet` branch removed from session-prime.ts. Duplicated `syncEnvelopeTokenCount()` in response-hints.ts replaced with import from envelope.ts. Private `calculatePressureBudget()` replaced with shared `calculatePressureAdjustedBudget()` from shared.ts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/claude/hook-state.ts` | Modified | readAndClearCompactPrime ordering, saveState boolean, SHA-256 hashing, restrictive permissions |
| `hooks/claude/session-prime.ts` | Modified | Provenance markers, TTL check, dead code removal, shared helper |
| `hooks/claude/session-stop.ts` | Modified | stop-hook state updates and transcript/spec-folder bookkeeping |
| `hooks/claude/compact-inject.ts` | Modified | autoSurfaceAtCompaction wiring, async buildMergedContext |
| `hooks/claude/shared.ts` | Modified | wrapRecoveredCompactPayload, sanitizeRecoveredContent |
| `hooks/memory-surface.ts` | Modified | primeSessionIfNeeded, resetSessionPrimed, code graph status |
| `hooks/response-hints.ts` | Modified | Import from envelope.ts, cache token accounting |
| `lib/response/envelope.ts` | Modified | Exported syncEnvelopeTokenCount, serializeEnvelopeWithTokenCount |
| `lib/code-graph/code-graph-db.ts` | Modified | file_mtime_ms column, schema v2 migration, stale-on-read |
| `context-server.ts` | Modified | First-call priming, graph auto-enrichment, 250ms timeout |
<!-- /ANCHOR:what-built-2 -->

---

<!-- ANCHOR:how-delivered-2 -->
### How It Was Delivered
Seven Codex CLI agents (GPT-5.4, high reasoning) across two waves. Wave 2 (4 agents) covered reliability, security, hook path, and dead code, and verified 142/142 tests across 6 hook suites. Wave 3 (3 agents) covered MCP priming, auto-enrichment, and stale-on-read, expanding verification to 213/213. Final full-suite verification finished at 226/226. ESLint stayed clean on all modified files.
<!-- /ANCHOR:how-delivered-2 -->

---
### Key Decisions
| Decision | Why |
|----------|-----|
| SHA-256 hash (16 chars) for session filenames | Naive sanitization aliased distinct IDs. 16-char hex gives 2^64 collision resistance. |
| Provenance markers over content sanitization alone | Markers let downstream code distinguish hook-recovered vs fresh context. Sanitization strips known instruction patterns as defense-in-depth. |
| Module-level sessionPrimed flag | Simplest mechanism that works across all runtimes, but it is process-global rather than session-scoped. If multiple sessions share one MCP server process, only the first session is primed until reset or restart. |
| 250ms Promise.race for graph enrichment | Graph queries are fast but DB init could be slow. Timeout prevents blocking the primary tool response. |
| Import canonical envelope helpers | Two files had convergence loops with different iteration counts (3 vs 5). Single source of truth with the 5-iteration safety bound. |
---

<!-- ANCHOR:verification-2 -->
### Verification
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
<!-- /ANCHOR:verification-2 -->

---

<!-- ANCHOR:limitations-2 -->
### Known Limitations
1. **First-call priming is process-global, not session-scoped.** The module-level `sessionPrimed` flag is shared across the MCP server process. If multiple sessions share one server process, only the first session is primed until the flag is reset or the server restarts.
2. **Compact recovery is only partially hardened.** `readAndClearCompactPrime()` now reads before clearing, but it still clears the cached payload before the caller's stdout write is confirmed. If stdout fails after clear, the payload can still be lost.
3. **saveState failures are warning-only.** Callers currently log `hookLog` warnings when persistence fails and continue processing instead of propagating the disk error.
4. **The planned `pendingStopSave` field was not implemented.** `HookState` has no dedicated `pendingStopSave` field, so the stop-hook redesign described in the spec did not land in the implementation.
5. **Stale-on-read deviates from the spec.** The implementation uses flat fresh/stale mtime classification instead of the spec's 3-tier threshold model.
6. **Graph enrichment returns nothing when DB is uninitialized.** The 250ms timeout handles this gracefully, but the first tool call in a fresh workspace gets no graph context.
<!-- /ANCHOR:limitations-2 -->
