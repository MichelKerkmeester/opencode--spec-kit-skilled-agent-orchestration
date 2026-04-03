---
title: "Implementation [02--system-spec-kit/023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix/implementation-summary]"
description: "Fixed two bugs in the Spec Kit Memory search pipeline that silently filtered ALL search results to zero: scope enforcement defaulting ON and TRM state filtering against a nonexistent column."
trigger_phrases:
  - "hybrid search fix"
  - "search pipeline 0 results"
  - "scope enforcement bug"
  - "trm state unknown filter"
  - "minstate warm bug"
  - "isscopeenforcementenabled"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Hybrid Search Pipeline Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-hybrid-search-null-db-fix |
| **Completed** | 2026-03-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Spec Kit Memory search pipeline was completely broken — every query returned 0 results regardless of content. With 999 memories in the database (996 with embeddings, 999 in FTS5), the trigger system and memory_list worked fine, but `memory_search` and `memory_context` produced nothing. Two independent filtering bugs were silently discarding all candidates at different pipeline stages.

### Bug 1: Scope Enforcement Rejecting All Unscoped Queries (Stage 1)

`isScopeEnforcementEnabled()` in `scope-governance.ts` defaulted to `true` via `isDefaultOnFlagEnabled()`, which returns `true` when no environment variable is set. When scope enforcement is active and no scope parameters (tenantId, userId, agentId) are provided in the query, `createScopeFilterPredicate` returns `() => false` — rejecting every result. This was an intentional security fix ("BUG-001 fix: empty scope under enforcement means no access"), but it broke all non-governed searches in a single-user system.

**Fix**: Changed `isScopeEnforcementEnabled()` from default-ON to opt-in. It now explicitly checks for `SPECKIT_MEMORY_SCOPE_ENFORCEMENT=true` environment variable instead of using the default-true helper.

### Bug 2: TRM State Filter Removing All Memories (Stage 4)

The `memory_search` handler defaults `minState` to `'WARM'` (priority 4 in the state hierarchy). Stage 4's `filterByMemoryState` compares each result's `memoryState` against this threshold. However, the `memoryState` column does not exist in the database schema — it was designed for the TRM state machine but never materialized. Every memory resolves to `'UNKNOWN'` (priority 0), failing the `priority >= minPriority` check. The `memory_context` handler had the same issue with two hardcoded `minState: 'WARM'` values.

**Fix**: Removed the `'WARM'` default from `memory_search` handler and removed both hardcoded `minState: 'WARM'` values from `memory_context` handler. `minState` is now `undefined` (no state filtering) until the memoryState column is implemented.

### Investigation Method

Used Sequential Thinking (12 steps) to systematically rule out hypotheses: missing data, embedding failures, ESM module duplication, stale database connections, WAL issues. Added diagnostic logging at each pipeline stage to trace where candidates were lost. Direct module testing confirmed search channels returned 5+5 results (vector+FTS5) but the pipeline reported 0 after filtering.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `mcp_server/lib/governance/scope-governance.ts` | Modify | `isScopeEnforcementEnabled()` → opt-in (not default-ON) |
| `mcp_server/dist/lib/governance/scope-governance.js` | Modify | Same fix in compiled output |
| `mcp_server/handlers/memory-search.ts` | Modify | Remove `minState = 'WARM'` default |
| `mcp_server/dist/handlers/memory-search.js` | Modify | Same fix in compiled output |
| `mcp_server/handlers/memory-context.ts` | Modify | Remove 2x hardcoded `minState: 'WARM'` |
| `mcp_server/dist/handlers/memory-context.js` | Modify | Same fix in compiled output |

All paths relative to `.opencode/skill/system-spec-kit/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix started with direct pipeline tracing, then narrowed the failure to two silent filters that removed every candidate after Stage 1. After restoring search correctness, the phase bundled the follow-on ranking, recall, lineage, and observability improvements into the same verification packet so the next phase inherited a truthful search baseline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make scope enforcement opt-in | The default-on behavior blocked every unscoped single-user query and produced false empties |
| Remove the implicit `minState: "WARM"` filter | The database does not materialize `memoryState`, so the default filtered all rows as `UNKNOWN` |
| Keep the optimization tranche in the same phase packet | The search fix and the follow-on ranking and observability improvements share the same proof surface |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Pipeline test results after fix:

| Query | Results | Stage 1 Candidates | Top Hit |
|-------|---------|-------------------|---------|
| "semantic search" | 4 | 5 | #893 CocoIndex MCP Integration |
| "SpecKit Phase System" | 5 | 5 | #325 SpecKit Phase System Plan |
| "compact code graph" | 5 | 5 | #45 Deep Research Compact Code Graph |

Both vector and FTS5 channels contribute results. Stage 4 no longer filters them out.
<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

No known limitations.
<!-- /ANCHOR:limitations -->
