# Verdict Summary: Phase 001 Retrieval Manual Tests

**Execution Date**: 2026-03-19
**Executor**: Claude Opus 4.6 (native MCP context)
**Coverage**: 9/9 scenarios executed (0 skipped)

---

## Per-Test Verdicts

| # | Test ID | Scenario | Verdict | Rationale |
|---|---------|----------|---------|-----------|
| 1 | EX-001 | Intent-aware context pull | **PASS** | Both auto/focused memory_context executed full 4-stage pipeline; cognitive triggers returned with all contract fields |
| 2 | EX-002 | Hybrid precision check | **PASS** | Top results match intent; default and bypassCache runs produce identical rankings; cross-encoder reranking applied |
| 3 | EX-003 | Fast recall path | **PASS** | Triggers returned with all cognitive fields (attentionScore, tier, tierDistribution, tokenMetrics, decay, coActivation) |
| 4 | EX-004 | Channel fusion sanity | **PASS** | 3 channels contributed (r12-embedding-expansion, fts, bm25); no empty tail; stable rankings |
| 5 | EX-005 | Stage invariant verification | **PASS** | Zero score mutation across all results; production=shadow for all rows; no promotions/demotions |
| 6 | NEW-086 | BM25 trigger re-index gate | **PASS** | Trigger edit caused immediate cache invalidation + FTS re-index; new phrase searchable as #1 result; checkpoint restore clean |
| 7 | NEW-109 | 3-tier search fallback | **PARTIAL** | Structural fallback fires for nonsense queries (1 channel vs normal 2-3); _degradation property not surfaced; SPECKIT_SEARCH_FALLBACK=false comparison not executable |
| 8 | NEW-142 | Session trace contract | **PARTIAL** | Trace/non-trace gating works at pipeline level; sessionTransition fields absent (expected: fresh session, no prior state); full contract requires established session |
| 9 | NEW-143 | Bounded graph-walk rollout | **PARTIAL** | bounded_runtime state verified with correct trace data; 1/3 rollout states tested; trace_only/off require env var changes at MCP server level |

---

## 5-Point Review Protocol

| Check | EX-001 | EX-002 | EX-003 | EX-004 | EX-005 | NEW-086 | NEW-109 | NEW-142 | NEW-143 |
|-------|--------|--------|--------|--------|--------|---------|---------|---------|---------|
| 1. Preconditions satisfied | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| 2. Prompt/commands as written | Y | Y | Y | Y | Y | Y | Y* | Y | Y* |
| 3. Expected signals present | Y | Y | Y | Y | Y | Y | Partial | Partial | Partial |
| 4. Evidence complete/readable | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| 5. Outcome rationale explicit | Y | Y | Y | Y | Y | Y | Y | Y | Y |

*NEW-109/143: Partial command sequence — env var steps not executable from tool context.

---

## Coverage Summary

- **Total scenarios**: 9/9 executed
- **PASS**: 6 (EX-001, EX-002, EX-003, EX-004, EX-005, NEW-086)
- **PARTIAL**: 3 (NEW-109, NEW-142, NEW-143)
- **FAIL**: 0
- **Skipped**: 0

### PARTIAL Rationale

All 3 PARTIAL verdicts share a common root cause: **MCP server environment isolation**. The tool context cannot modify the MCP server's `process.env` or restart it between test runs. This limits:
- NEW-109: Cannot disable SPECKIT_SEARCH_FALLBACK
- NEW-142: Cannot establish prior session state for transition testing
- NEW-143: Cannot switch between rollout states (trace_only, bounded_runtime, off)

**Recommendation**: To achieve PASS on all 3 PARTIAL scenarios, execute them via a shell-level test harness that can restart the MCP server with different environment variables between runs.

---

## Flag Defaults Documented

| Flag | Default | Source |
|------|---------|--------|
| SPECKIT_SEARCH_FALLBACK | true (graduated) | search-flags.ts:57-61 |
| SPECKIT_GRAPH_WALK_ROLLOUT | not set → bounded_runtime | search-flags.ts:156-169 |
| SPECKIT_GRAPH_SIGNALS | true (enabled) | search-flags.ts:171-173 |
| SPECKIT_GRAPH_UNIFIED | true (enabled) | graph-flags.ts:16-18 |
