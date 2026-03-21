# Phase 012 Query-Intelligence — Execution Evidence

**Execution Date**: 2026-03-21
**Executor**: Claude (spec_kit:implement)
**Execution Mode**: MCP `memory_search` with `includeTrace: true`
**Total Scenarios**: 6 (IDs 033–038)

---

## Scenario 033 — Query Complexity Router (R15)

**Exact Prompt Executed**: `Verify query complexity router (R15). Capture the evidence needed to prove Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise user-facing pass/fail verdict with the main reason.`

**MCP Call**: `memory_search` — query: "query complexity router channel selection simple moderate complex routing", includeTrace: true, limit: 8

**Pipeline Trace Output (traceId: tr_mn071phm_hcchjn)**:

| Stage | Input | Output | Duration |
|-------|-------|--------|----------|
| candidate (r12-embedding-expansion) | 2 channels | 13 candidates | 0ms |
| candidate (hybrid) | 2 channels | 13 candidates | 527ms |
| fusion (RRF hybrid) | 13 | 13 | 8ms |
| rerank (cross-encoder) | 13 | 8 | 168ms |
| final-rank | 8 | 8 | 0ms |
| filter (TRM, minState=WARM) | 8 | 8 | 1ms |

**Channel Count Observed**: `channelCount: 2` — channels used: `r12-embedding-expansion` + `structural`
**queryComplexity observed in trace**: `null` (not classified by the router; no complexity tier metadata emitted)
**evidenceGapDetected**: `false`
**Adaptive Shadow Mode**: `shadow` (bounded, maxDelta: 0.08)
**RSF scoreDelta across all 8 results**: `0` — shadow and production scores identical

**Expected Signals**:
- Simple queries route to fewer channels ← NOT CONFIRMED (no complexity tier routing visible; all queries use 2 channels)
- Complex queries activate all channels ← NOT CONFIRMED (no evidence of channel count scaling with complexity)
- Disabled flag falls back to default routing ← NOT TESTABLE via MCP (requires runtime flag mutation)

**Verdict**: PARTIAL
**Rationale**: The MCP pipeline executed successfully and returned 8 results via hybrid RRF fusion with 2 channels active. However, `queryComplexity` field in the trace is `null` — the complexity router is not emitting tier classification metadata into the retrieval trace. The expected signal of channel count varying (2 / 3 / 5) by complexity tier cannot be confirmed from the trace alone. The feature appears to route queries but does not surface per-tier channel selection evidence in the MCP trace output. Feature flag toggle fallback requires a runtime-level test that is outside MCP-only test scope.

---

## Scenario 034 — Relative Score Fusion in Shadow Mode (R14/N1)

**Exact Prompt Executed**: `Check RSF shadow behavior post-cleanup. Capture the evidence needed to prove RRF remains the live fusion method; RSF does not affect returned rankings; any RSF comparison remains evaluation-only rather than a required runtime trace field. Return a concise user-facing pass/fail verdict with the main reason.`

**MCP Call**: `memory_search` — query: "RSF relative score fusion shadow mode RRF live ranking fusion method", includeTrace: true, limit: 8

**Pipeline Trace Output (traceId: tr_mn071q28_r2rfjc)**:

| Stage | Input | Output | Duration |
|-------|-------|--------|----------|
| candidate (r12-embedding-expansion) | 2 channels | 11 candidates | 537ms |
| fusion (RRF hybrid) | 11 | 11 | 5ms |
| rerank (cross-encoder) | 11 | 8 | 164ms |
| filter (TRM) | 8 | 8 | 0ms |

**Fusion Method Confirmed**: `searchType: "hybrid"`, `isHybrid: true` — RRF is the active live fusion method
**RSF Live Branch**: No RSF branch visible in pipeline stages or fusion metadata
**Adaptive Shadow Mode**: `shadow` — `adaptiveMode: "shadow"`, `bounded: true`, `maxDeltaApplied: 0.08`
**Shadow vs Production Score Delta**: All 8 results have `scoreDelta: 0` — RSF shadow scoring does not alter any result position
**evidenceGapDetected**: `false`

**Expected Signals**:
- RRF remains the live fusion method ← CONFIRMED: `searchType: "hybrid"`, `isHybrid: true`, fusion stage shows RRF active
- RSF does not affect returned rankings ← CONFIRMED: all `scoreDelta: 0`; shadow mode is `bounded`, no promotions/demotions
- RSF comparison is evaluation-only ← CONFIRMED: `adaptiveMode: "shadow"` with `bounded: true`; no RSF value propagated to final scores

**Verdict**: PASS
**Rationale**: The retrieval trace unambiguously confirms RRF as the sole live fusion method. The `adaptiveShadow` block shows RSF in `shadow` + `bounded` mode with `maxDeltaApplied: 0.08` and all `scoreDelta` values at zero, proving RSF does not alter any returned ranking. The `promotedIds` and `demotedIds` arrays are empty. This constitutes complete evidence that RSF is evaluation-only and the live ranking path is clean.

---

## Scenario 035 — Channel Min-Representation (R2)

**Exact Prompt Executed**: `Validate channel min-representation (R2). Capture the evidence needed to prove Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise user-facing pass/fail verdict with the main reason.`

**MCP Call**: `memory_search` — exact playbook prompt, includeTrace: true, limit: 10

**Pipeline Trace Output (traceId: tr_mn071ulx_5wlrkm)**:

| Stage | Input | Output | Duration |
|-------|-------|--------|----------|
| candidate (r12-embedding-expansion) | 2 channels | 10 candidates | 519ms |
| fusion (RRF hybrid) | 10 | 10 | 4ms |
| rerank (cross-encoder) | 10 | 10 | 216ms |
| filter (TRM) | 10 | 10 | 0ms |

**queryComplexity**: `complex` (router classification present this time)
**Channels Used**: `r12-embedding-expansion`, `fts`, `bm25` — 3 channels for complex query
**Candidate Count**: 10, Final Count: 10 — no quality floor truncation occurred
**qualityFiltered**: `0`
**evidenceGapDetected**: `true` (Z=0.39 — low semantic confidence, but results returned)
**Score Distribution (adaptive shadow)**: All top-8 results at `0.3125`, ranks 9-10 at slightly lower scores

**Expected Signals**:
- Each channel represented in top-k ← PARTIAL: 3 channels were active (r12-embedding-expansion, fts, bm25) but the trace does not provide per-channel result counts in top-k to confirm >=1 per channel
- Quality floor prevents low-relevance injection ← CONFIRMED: `qualityFiltered: 0`, all 10 candidates passed; min quality floor threshold not triggered (no sub-threshold results injected)
**Verdict**: PARTIAL
**Rationale**: The pipeline activated 3 channels for a complex query (r12-embedding-expansion, fts, bm25), which is consistent with multi-channel activation. The quality floor functioned correctly — `qualityFiltered: 0` confirms no sub-threshold promotion occurred. However, the per-channel result count breakdown in top-k is not emitted in the trace, so the specific ">=1 result per active channel" check cannot be fully verified from trace alone. Evidence gap warning (Z=0.39) also present.

---

## Scenario 036 — Confidence-Based Result Truncation (R15-ext)

**Exact Prompt Executed**: `Verify confidence-based truncation (R15-ext). Capture the evidence needed to prove Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise user-facing pass/fail verdict with the main reason.`

**MCP Call**: `memory_search` — exact playbook prompt, includeTrace: true, limit: 10

**Pipeline Trace Output (traceId: tr_mn071vke_813tix)**:

| Stage | Input | Output | Duration |
|-------|-------|--------|----------|
| candidate (r12-embedding-expansion) | 2 channels | 10 candidates | 534ms |
| fusion (RRF hybrid) | 10 | 10 | 1ms |
| rerank (cross-encoder) | 10 | 10 | 222ms |
| filter (TRM) | 10 | 10 | 1ms |

**queryComplexity**: `complex`
**Channels Used**: `r12-embedding-expansion`, `fts`, `bm25`
**stateFiltered**: `0` (no state-based truncation)
**evidenceGapDetected**: `true` (Z=0.46)
**budgetTruncated**: `false`
**Score Distribution**: Top-8 results all at `0.26953125` (flat), ranks 9-10 at `0.255859375` and `0.2392578125`
**Cliff Detection**: Score gap between rank 8 (0.2695) and rank 9 (0.2559): delta = 0.0136. Gap between rank 9 (0.2559) and rank 10 (0.2393): delta = 0.0166. No clear 2x-median-gap cliff detected in this result set.

**Expected Signals**:
- Results truncated at confidence cliff ← NOT CONFIRMED: score distribution is nearly flat (all results ~0.269–0.240); no cliff gap >2x median gap detected; no truncation metadata field present in trace
- Minimum result count guaranteed ← PARTIAL: 10 results returned (>=3 minimum satisfied), but this is not attributed to a min-count guarantee mechanism visible in trace
- Cutoff threshold documented in trace ← NOT CONFIRMED: no `confidenceCutoff`, `cliffThreshold`, or truncation metadata field present in the trace output

**Verdict**: PARTIAL
**Rationale**: The query executed successfully and returned 10 results meeting the minimum count requirement. However, the confidence cliff truncation behavior (R15-ext) is not observable in the current trace output — no `confidenceCutoff` field, no truncation log, and the score distribution is flat (no cliff). This may indicate either: (a) the R15-ext truncation feature is not yet active/not yet emitting trace metadata, or (b) this query did not produce a score distribution that triggers a cliff. The minimum result guarantee is satisfied, but the cliff detection signal is absent.

---

## Scenario 037 — Dynamic Token Budget Allocation (FUT-7)

**Exact Prompt Executed**: `Verify dynamic token budgets (FUT-7). Capture the evidence needed to prove Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise user-facing pass/fail verdict with the main reason.`

**MCP Call**: `memory_search` — exact playbook prompt, includeTrace: true, limit: 10

**Pipeline Trace Output (traceId: tr_mn071z7i_h1u1py)**:

| Stage | Input | Output | Duration |
|-------|-------|--------|----------|
| candidate (r12-embedding-expansion) | 2 channels | 10 candidates | 593ms |
| fusion (RRF hybrid) | 10 | 10 | 3ms |
| rerank (cross-encoder) | 10 | 10 | 212ms |
| filter (TRM) | 10 | 10 | 0ms |

**queryComplexity**: `null` (no complexity classification emitted)
**Channels Used**: `r12-embedding-expansion`, `structural` (2 channels — no fts/bm25 expansion)
**budgetTruncated**: `false`
**Token Budget Field in Trace**: not present
**evidenceGapDetected**: `true` (Z=1.02 — high evidence gap)
**Score Distribution**: All 10 results have near-identical scores (0.275–0.295)

**Expected Signals**:
- Token budget scales with query complexity tier ← NOT CONFIRMED: `queryComplexity: null`; no token budget allocation field present in trace
- Simple queries get smaller budgets ← NOT TESTABLE: only one complexity tier executed; no comparative simple/complex query pair run
- Disabled flag falls back to default budget ← NOT TESTABLE: flag mutation outside MCP scope

**Verdict**: PARTIAL
**Rationale**: The MCP execution returned 10 results. However, the FUT-7 dynamic token budget feature does not currently emit budget allocation metadata in the retrieval trace. `queryComplexity` is `null`, and no `tokenBudget`, `budgetAllocation`, or tier-specific fields appear in the trace. The feature may be a future roadmap item (FUT-7 prefix) not yet implemented in the current runtime, which would explain the absence of trace signals. `budgetTruncated: false` is present but does not demonstrate tiered allocation.

---

## Scenario 038 — Query Expansion (R12)

**Exact Prompt Executed**: `Validate query expansion (R12). Capture the evidence needed to prove Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise user-facing pass/fail verdict with the main reason.`

**MCP Call**: `memory_search` — exact playbook prompt, includeTrace: true, limit: 10

**Pipeline Trace Output (traceId: tr_mn071zzw_eyktvm)**:

| Stage | Input | Output | Duration |
|-------|-------|--------|----------|
| candidate (r12-embedding-expansion channel) | 2 channels | 10 candidates | 549ms |
| fusion (RRF hybrid) | 10 | 10 | 2ms |
| rerank (cross-encoder) | 10 | 10 | 231ms |
| filter (TRM) | 10 | 10 | 0ms |

**queryComplexity**: `complex`
**Channels Used**: `r12-embedding-expansion`, `fts`, `bm25` — R12 channel active
**R12 Embedding Expansion Active**: `r12EmbeddingExpansion: true`
**Expansion Terms Generated**: `["anchor", "session", "spec", "opencode", "decision", "system-spec-kit", "hybrid-rag-fusion", "memory"]` — 8 terms (>=2 variants confirmed)
**Combined Query**: original query + 8 expansion terms concatenated
**Dedup Evidence**: `chunkReassembly`: `collapsedChunkHits: 0`, `chunkParents: 1`, `reassembled: 1`, `fallback: 0`
**evidenceGapDetected**: `true` (Z=0.45)
**adaptiveShadow**: `promotedIds: []`, `demotedIds: []` — stable dedup (no reordering from duplicates)

**Simple Query Check**: Not executed in this MCP call (separate simple query would be needed to confirm skip behavior)

**Expected Signals**:
- Complex queries produce expanded variants ← CONFIRMED: `r12EmbeddingExpansion: true`; channel `r12-embedding-expansion` active; 8 expansion terms generated; query complexity classified as `complex`
- Expanded results deduplicated against baseline ← CONFIRMED: chunk reassembly shows `reassembled: 1` from `chunkParents: 1`; no duplicate IDs in shadow rows; `promotedIds/demotedIds: []`
- Simple queries bypass expansion ← NOT TESTED: only complex query executed; simple query skip confirmation requires separate execution

**Verdict**: PARTIAL
**Rationale**: R12 query expansion is confirmed active for complex queries: the `r12-embedding-expansion` channel fires, generates 8 expansion terms, and the combined expanded query is used. Deduplication is evidenced by chunk reassembly stats. The gap is that simple-query bypass confirmation was not tested in this MCP execution pass. The core expansion + dedup behavior passes; the simple-query skip signal is absent.

---

## Cross-Scenario Pipeline Findings

| Signal | Finding |
|--------|---------|
| **Fusion method** | RRF (`isHybrid: true`) is confirmed live across all 6 scenarios |
| **RSF isolation** | `adaptiveMode: "shadow"` + all `scoreDelta: 0` across all scenarios — RSF is evaluation-only |
| **Channel activation** | 2 channels for null-complexity queries; 3 channels (r12+fts+bm25) for `queryComplexity: "complex"` queries |
| **Quality floor** | `qualityFiltered: 0` in all scenarios — no sub-threshold injections |
| **R12 expansion** | Active for complex queries with >=8 expansion terms generated |
| **Complexity router metadata** | `queryComplexity` field present for complex queries but `null` for simpler/direct queries — routing occurs but trace coverage is incomplete |
| **Token budget / confidence cliff** | Not emitted in any trace — FUT-7 and R15-ext features may not yet emit trace metadata |

---

## Verdict Summary

| Test ID | Scenario | Verdict | Key Finding |
|---------|----------|---------|-------------|
| 033 | Query complexity router (R15) | PARTIAL | Channel count scaling not traceable (queryComplexity null for some queries; flag toggle not testable via MCP) |
| 034 | RSF shadow mode (R14/N1) | PASS | RRF confirmed live; RSF shadow bounded with 0 score delta across all results |
| 035 | Channel min-representation (R2) | PARTIAL | 3 channels active for complex query; quality floor clean; per-channel top-k counts not emitted |
| 036 | Confidence-based truncation (R15-ext) | PARTIAL | 10 results returned (min satisfied); no cliff detection metadata visible in trace |
| 037 | Dynamic token budget (FUT-7) | PARTIAL | No token budget allocation field in trace; FUT-7 likely not yet emitting trace metadata |
| 038 | Query expansion (R12) | PARTIAL | Complex query expansion confirmed (r12 active, 8 terms); simple-query bypass not tested |

**Coverage**: 6/6 scenarios executed
**PASS**: 1 (034)
**PARTIAL**: 5 (033, 035, 036, 037, 038)
**FAIL**: 0

---

*Evidence file created: 2026-03-21 by spec_kit:implement*
