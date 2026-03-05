---
title: "Wave 4 Synthesis: Phase 017 Verification + Bug Hunt"
date: 2026-03-02
sources: [wave4-opus-phase017-bugs.md]
---

# Wave 4 Synthesis: Phase 017 Verification + Bug Hunt

## Reviewer Profile

**Reviewer:** Claude Opus 4.6 (single-model wave)
**Scope:** `mcp_server/` subtree — Phase 017 fix verification (10-of-35 sample) + independent bug hunt

---

## Part 1: Phase 017 Fix Verification — All 10 PASS

| # | Fix | File | Verdict |
|---|-----|------|---------|
| 1 | Legacy V1 removal (`postSearchPipeline`, `STATE_PRIORITY`, `MAX_DEEP_QUERY_VARIANTS`) | `memory-search.ts` | PASS |
| 2 | `isPipelineV2Enabled()` hardcoded `return true` | `search-flags.ts` | PASS |
| 3 | Self-loop guard in `insertEdge()` | `causal-edges.ts` | PASS |
| 4 | `resolveEffectiveScore()` shared function with clamped fallback chain | `types.ts` | PASS |
| 5 | Stemmer double-consonant dedup after suffix removal | `bm25-index.ts` | PASS |
| 6 | 128-bit dedup hash (32 hex chars from SHA-256) | `session-manager.ts` | PASS |
| 7 | Orphaned chunk detection in `verify_integrity()` with auto-cleanup | `vector-index-impl.ts` | PASS |
| 8 | Exit handler cleanup with stored reference for `removeListener()` | `access-tracker.ts` | PASS |
| 9 | `parseArgs()` null/undefined guard (`== null` catches both) | `types.ts` | PASS |
| 10 | Postflight re-correction (`phase IN ('preflight', 'complete')` lookup) | `session-learning.ts` | PASS |

**Conclusion:** All 10 sampled Phase 017 fixes correctly applied and well-documented with `AI-WHY` comments. Line numbers and code snippets were meticulous. 25 remaining fixes were not sampled (scope constraint).

---

## Part 2: Bug Hunt — 6 P2 Findings, 0 Critical

### BH-1: `isFeatureEnabled()` Does Not Accept `"1"` as Truthy — P2

**File:** `mcp_server/lib/cognitive/rollout-policy.ts` L36-52

Only the literal `"true"` (after lowercasing) is accepted as truthy. `"1"` and `"yes"` — common Unix env var conventions — are treated as disabled. Documented behavior but could surprise users who set `SPECKIT_MMR=1`.

### BH-2: SQL Safety — No Issues Found

Full sweep of 9 handlers and 3 lib files. All user-controlled values parameterized; all dynamic SQL uses hardcoded column strings or explicit allowlists. **No vulnerabilities.**

### BH-3a: `handleMemoryUpdate` Missing Transaction Boundary — P2

**File:** `mcp_server/handlers/memory-crud-update.ts`

Five sequential operations (read, embed, write metadata, BM25 re-index, mutation ledger) are not wrapped in a transaction. The async embedding step prevents full atomicity anyway, but steps 3-5 could be grouped. Low real-world risk under single-process better-sqlite3.

### BH-3b: `handleMemoryDelete` Single-Delete Missing Transaction — P2

**File:** `mcp_server/handlers/memory-crud-delete.ts` L62-92

Three sequential calls (`deleteMemory`, `deleteEdgesForMemory`, `appendMutationLedgerSafe`) are not wrapped in a transaction. The bulk-delete path at L146 correctly uses `database.transaction()`. Orphaned edges would be caught by the next `cleanupOrphanedEdges()` health check.

### BH-3c: `specFolderLock` Is Process-Local Only — P2

**File:** `mcp_server/handlers/memory-save.ts` L63-79

In-process promise-chain mutex correctly serializes saves within one Node.js process. Multiple MCP server instances (different Claude sessions) would not share this lock. Acknowledged in code comments; correct for current single-process architecture.

### BH-4: Inconsistent `| undefined` Typing on `.get()` Results — P2

**Files:** `memory-crud-health.ts` L281-282, `memory-bulk-delete.ts` L89

`COUNT(*)` aggregates always return a row in SQLite, so missing `| undefined` is functionally safe. Inconsistent convention against handlers that correctly include `| undefined` (e.g., `memory-crud-update.ts` L140).

---

## Summary

| Severity | Count | Finding IDs |
|----------|:-----:|-------------|
| P0 (critical) | 0 | — |
| P1 (important) | 0 | — |
| P2 (minor) | 6 | BH-1, BH-3a, BH-3b, BH-3c, BH-4 |
| No issues | 1 | BH-2 (SQL safety) |

**Overall verdict:** The Phase 017 work is high quality. All sampled fixes are correctly applied with clear documentation. The codebase demonstrates solid defensive coding: parameterized SQL, explicit allowlists, error boundaries around all DB operations, and transactions for bulk paths. The 6 P2 findings are minor hygiene issues with low real-world impact.

---

## Cross-References

- **Source:** `scratch/z_archive/wave4-opus-phase017-bugs.md` (full evidence, code snippets, line refs)
- **Independent verification:** `scratch/z_archive/multi-agent-deep-review.md` Section 7 — all 6 BH findings confirmed by 11-agent review
