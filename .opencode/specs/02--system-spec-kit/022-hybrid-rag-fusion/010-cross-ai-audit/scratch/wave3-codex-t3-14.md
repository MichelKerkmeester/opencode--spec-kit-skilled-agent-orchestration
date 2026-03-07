# T3-14: Phase 017 Fix Verification Audit (Codex gpt-5.3-codex)

## Agent: Codex CLI (read-only sandbox)
## Date: 2026-03-07
## Source: `/tmp/t3-14-phase017-verify.md` + `/tmp/codex-t3-14.txt`

---

## Summary

Extended verification of Phase 017 fixes #1-#10 (canonical `Fix #N` markers), follow-up on suspicious #18/#22/#28, and verification of #36-#38.

### A) Fixes #1-#10

| Fix | Marker Location(s) | Status |
|:---:|---------------------|:------:|
| #1 | Non-canonical `Fix 1` in quality-loop.ts:304 | MISSING (no canonical marker) |
| #2 | Non-canonical `Fix 2` in quality-loop.ts:318 | MISSING (no canonical marker) |
| #3 | Non-canonical `Fix 3` in quality-loop.ts:325 | MISSING (no canonical marker) |
| #4 | No marker found anywhere | MISSING |
| #5 | intent-classifier.ts:490 + test at intent-weighting.vitest.ts:460 | VERIFIED — recency in intent-adjusted score |
| #6 | composite-scoring.ts:555 | VERIFIED — normalize 5-factor weights |
| #7 | composite-scoring.ts:795 | VERIFIED — loop-based min/max |
| #8 | hybrid-search.ts:260 | VERIFIED — BM25 spec-folder filtering |
| #9 | No marker found | MISSING |
| #10 | No marker found | MISSING |

### B) Suspicious Fixes Follow-up

| Fix | Evidence | Verdict |
|:---:|----------|:-------:|
| #18 | bm25-index.ts:74-93 — `suffixRemoved` guard before double-consonant collapse | **VERIFIED** — words like "bell" no longer collapsed |
| #22 | transaction-manager.ts:183 claims SAVEPOINT atomicity, but NO actual `SAVEPOINT`/`ROLLBACK TO` SQL exists; memory-save.ts:406-412 call-site is no-op | **SUSPICIOUS CONFIRMED** — comment misleading |
| #28 | causal-edges.ts:519 defines cleanup function, exported at :748, but no call-site in mcp_server/ | **SUSPICIOUS CONFIRMED** — dead export, never auto-invoked |

### C) Fixes #36-#38

| Fix | Location | Status |
|:---:|----------|:------:|
| #36 | tools/types.ts:22 — `parseArgs` guards null/undefined/non-object before cast | VERIFIED |
| #37 | session-manager.ts:305 + test at session-manager.vitest.ts:141 — hash length upgraded to 128-bit (32 hex chars) | VERIFIED |
| #38 | access-tracker.ts:196 + cleanup at :233-239 — handler reference stored and removed via `process.removeListener` | VERIFIED |

### Grand Totals

| Category | Count |
|----------|:-----:|
| VERIFIED | 8 |
| MISSING (no marker/implementation) | 6 |
| SUSPICIOUS CONFIRMED | 2 |
| **Total checked** | **16** |

### Observations

- Fixes #1-#3 exist with non-canonical markers (`Fix 1` vs `Fix #1`) in quality-loop.ts — the implementations may be present but don't match the expected marker format
- Fix #22 (SAVEPOINT comment) is misleading — should be corrected or removed
- Fix #28 (`cleanupOrphanEdges`) is exported but never called — should be wired up or documented as manual-only
- Fixes #4, #9, #10 have no trace whatsoever — may never have been implemented
