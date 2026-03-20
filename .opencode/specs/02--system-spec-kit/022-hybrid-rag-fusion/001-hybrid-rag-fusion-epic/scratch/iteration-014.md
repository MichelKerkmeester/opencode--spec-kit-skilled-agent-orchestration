# Iteration 14: Spec vs Code Reality Check -- 10 Claims Cross-Validated

## Focus
Cross-validate 10 specific claims from the epic spec and prior research findings against actual codebase evidence. This is a verification/falsification iteration to complete Q5 (code vs spec misalignments) and consolidate prior findings.

## Findings

### Claim 1: "4 search channels"
**VERDICT: FALSE -- Code has 5 or 6 channels**

The `SOURCE_TYPES` constant in `shared/algorithms/rrf-fusion.ts:12-18` defines 6 channel labels:
```
VECTOR, FTS, BM25, GRAPH, DEGREE, KEYWORD
```
The spec says "4 channels" but iteration 3 found 5 active channels (vector, BM25, FTS5, graph, degree). The code confirms `DEGREE` as a distinct channel in `SOURCE_TYPES`. `KEYWORD` is a 6th label but may not have a dedicated search path. The spec's "4 channels" claim undercounts by at least 1 (degree).

[SOURCE: shared/algorithms/rrf-fusion.ts:12-18]

### Claim 2: "15+ scoring signals" -> iter-2 found 30+ constants
**VERDICT: PARTIALLY TRUE -- 12 scoring steps, 99 const declarations**

Stage 2 has exactly **12 signal application steps** per its own comment block at line 21 and line 538:
```
// SIGNAL APPLICATION ORDER (must not be reordered -- 12 steps)
```
The file contains **99 `const` declarations** total, but many are configuration thresholds, temporary variables, and utility values -- not independent scoring signals. The "15+ signals" claim is directionally correct (12 steps + each step may apply multiple sub-signals), and "30+ constants" is accurate for raw const count, but the architectural truth is **12 ordered scoring steps** with nested sub-computations.

[SOURCE: mcp_server/lib/search/pipeline/stage2-fusion.ts:21, line 538, grep count 99]

### Claim 3: "Pipeline V2 feature flag -- always true, never toggleable"
**VERDICT: CONFIRMED**

Test file `mcp_server/tests/pipeline-v2.vitest.ts:299-300` explicitly tests:
```
it('R6-T20: SPECKIT_PIPELINE_V2=false still returns true (deprecated, V2 always on)')
process.env.SPECKIT_PIPELINE_V2 = 'false';
```
The flag is marked `@deprecated` (confirmed in iteration 7, search-flags.ts). Setting it to `false` still returns `true`. Pipeline V2 is graduated and permanently ON. The flag exists only as a vestigial artifact.

[SOURCE: mcp_server/tests/pipeline-v2.vitest.ts:289-300]

### Claim 4: "RRF K=60 from SIGIR 2009"
**VERDICT: CONFIRMED with full citation**

`shared/algorithms/rrf-fusion.ts:22-35` contains a JSDoc comment with the complete citation:
```
Origin: Cormack, Clarke, and Buettcher (SIGIR 2009), where Reciprocal Rank
Fusion is introduced with `k = 60` as a robust default for rank aggregation.
```
And `const DEFAULT_K = 60;` at line 36. This is one of only 2 literature-cited constants in the entire system (the other being FSRS v4).

[SOURCE: shared/algorithms/rrf-fusion.ts:22-36]

### Claim 5: "Graph channel is default-ON"
**VERDICT: CONFIRMED**

`mcp_server/lib/search/graph-flags.ts:14-17`:
```
Unified graph channel gate (default-on, explicit opt-out with `'false'`).
return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
```
The `isFeatureEnabled()` utility uses default-ON semantics (returns true unless explicitly set to 'false'). Graph is active by default.

[SOURCE: mcp_server/lib/search/graph-flags.ts:14-17]

### Claim 6: "FSRS v4 implementation" -- verify against FSRS paper constants
**VERDICT: CONFIRMED with exact paper constants**

`mcp_server/lib/cognitive/fsrs-scheduler.ts:29-35`:
```
const FSRS_FACTOR = 19 / 81;
const FSRS_DECAY = -0.5;
const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243
```
The formula is `R(t) = (1 + FACTOR * t/S)^DECAY` (line 10), matching the FSRS v4 power-law decay. Constants `19/81` for FACTOR and `-0.5` for DECAY are the canonical FSRS v4 values from the open-source FSRS algorithm. The half-life derivation `S = (FSRS_FACTOR / 3) * h` is algebraically correct.

[SOURCE: mcp_server/lib/cognitive/fsrs-scheduler.ts:10-35]

### Claim 7: "MMR diversity pruning" -- verify it is used in Stage 3
**VERDICT: CONFIRMED -- functional, flag-gated**

`mcp_server/lib/search/pipeline/stage3-rerank.ts` imports and uses MMR:
```
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
```
At line 159-163:
```
// -- Step 2: MMR diversity pruning ---
if (isMMREnabled() && results.length >= MMR_MIN_CANDIDATES) {
```
MMR is gated behind `SPECKIT_MMR` feature flag with `MMR_DEFAULT_LAMBDA = 0.7` (line 55) and per-intent lambda overrides via `INTENT_LAMBDA_MAP`. It is a real, functional implementation with proper try/catch (line 215-217) that degrades gracefully on failure.

[SOURCE: mcp_server/lib/search/pipeline/stage3-rerank.ts:8, 32-34, 51-55, 159-217]

### Claim 8: "Cross-encoder reranking" -- verify functional implementation
**VERDICT: CONFIRMED -- 3-provider implementation with graceful fallback**

`mcp_server/lib/search/cross-encoder.ts:1-60` reveals a full implementation with 3 providers:
1. **Voyage** (`rerank-2`, API endpoint, 15s timeout)
2. **Cohere** (`rerank-english-v3.0`, API endpoint, 15s timeout)
3. **Local** (`ms-marco-MiniLM-L-6-v2`, localhost:8765, 30s timeout)

When no provider API key is configured, it falls back to a positional scorer (scored 0-0.5) with `scoringMethod:'fallback'` discriminator. The module is imported by Stage 3 (`stage3-rerank.ts:30`). This is NOT a stub -- it is a complete neural reranking implementation with circuit breaker and latency tracking (from Q16 findings).

[SOURCE: mcp_server/lib/search/cross-encoder.ts:1-60, stage3-rerank.ts:30]

### Claim 9: "32 MCP tools" -- count actual tool registrations
**VERDICT: CONFIRMED -- exactly 32 tools**

Grep of `name:` in `mcp_server/tool-schemas.ts` yielded 37 matches, but filtering to snake_case tool names gives exactly 32:
- **memory_** group: 20 tools (search, context, match_triggers, save, list, stats, health, delete, update, validate, bulk_delete, index_scan, ingest_start, ingest_status, ingest_cancel, drift_why, causal_link, causal_stats, causal_unlink, get_learning_history)
- **checkpoint_** group: 4 tools (create, list, restore, delete)
- **eval_** group: 2 tools (run_ablation, reporting_dashboard)
- **shared_** group: 4 tools (memory_enable, memory_status, space_upsert, space_membership_set)
- **task_** group: 2 tools (preflight, postflight)

The remaining 5 `name:` matches are property descriptions within tool parameter schemas (e.g., 'Additional metadata', 'Display name...'), not tool registrations.

[SOURCE: mcp_server/tool-schemas.ts, grep count 37 total, 32 tool names]

### Claim 10: "Dedup uses cosine similarity"
**VERDICT: FALSE -- Dedup uses SHA-256 content hash, NOT cosine similarity**

`mcp_server/handlers/save/dedup.ts` contains zero references to cosine, dotProduct, or embedding-based similarity. Its dedup mechanism is:
1. **Same-path hash**: `content_hash = ?` comparison (SHA-256, line 146)
2. **Cross-path hash**: SQL query `WHERE content_hash = ? AND embedding_status IN (?, ?)` (lines 180-198)

The **Prediction Error (PE) gating** in `pe-gating.ts` may use embedding-based similarity, but `dedup.ts` itself is purely hash-based. The 3-layer dedup architecture from Q11 is: (a) same-path SHA-256 hash, (b) cross-path SHA-256 hash, (c) semantic PE gate -- but layers a and b are NOT cosine similarity. If "dedup uses cosine" was claimed, it is misleading: only the PE gate layer uses semantic comparison, and pe-gating.ts is a separate module.

[SOURCE: mcp_server/handlers/save/dedup.ts:9-11, 105-252 (zero cosine/embedding references)]

## Sources Consulted
- `shared/algorithms/rrf-fusion.ts` -- full read (540 lines)
- `mcp_server/lib/search/pipeline/stage2-fusion.ts` -- grep for const/step
- `mcp_server/tests/pipeline-v2.vitest.ts` -- grep for PIPELINE_V2
- `mcp_server/lib/search/graph-flags.ts` -- grep for default semantics
- `mcp_server/lib/cognitive/fsrs-scheduler.ts` -- grep for FSRS constants
- `mcp_server/lib/search/pipeline/stage3-rerank.ts` -- grep for MMR/applyMMR
- `mcp_server/lib/search/cross-encoder.ts` -- read first 60 lines
- `mcp_server/tool-schemas.ts` -- grep for name: registrations
- `mcp_server/handlers/save/dedup.ts` -- grep for similarity/cosine/hash
- `mcp_server/handlers/save/pe-gating.ts` -- grep for cosine/similarity

## Assessment
- New information ratio: 0.55
- Questions addressed: Q5 (misalignments), Q1 (peripheral -- channel count clarification)
- Questions answered: Q5 now substantially complete (3 original + 2 new misalignments = 5 total)

### Misalignment Summary (Q5 updated)
1. Dead `applyIntentWeights` export in intent-classifier.ts (iter-4)
2. Hydra/Speckit naming confusion in capability-flags.ts (iter-4)
3. **Spec says "4 channels" but code has 5-6** -- `SOURCE_TYPES` defines 6 labels, at least 5 are active (iter-3, confirmed iter-14)
4. **Spec says "15+ signals" -- actually 12 ordered steps with ~99 const declarations** -- directionally correct but architecturally misleading (iter-14)
5. **"Dedup uses cosine similarity" is misleading** -- dedup.ts is purely SHA-256 hash-based; only the separate PE-gating module uses semantic comparison (iter-14)

### Confirmed Claims (spec-to-code alignment)
- RRF K=60 from SIGIR 2009: CONFIRMED with full citation in code
- Pipeline V2 always-on: CONFIRMED, even `false` returns `true`
- Graph channel default-ON: CONFIRMED via `isFeatureEnabled` semantics
- FSRS v4 constants: CONFIRMED with exact `19/81` and `-0.5` values
- MMR diversity pruning in Stage 3: CONFIRMED, flag-gated
- Cross-encoder reranking: CONFIRMED, 3-provider functional implementation
- 32 MCP tools: CONFIRMED, exact count matches

## Reflection
- What worked and why: Grep-first verification approach was extremely efficient -- each claim could be confirmed or falsified with 1-2 targeted searches rather than reading entire files. The rrf-fusion.ts full read was the highest-ROI action because it answered claims 1, 4, and partially 2 in a single read.
- What did not work and why: macOS `grep -P` (PCRE) is not available -- had to fall back to standard grep patterns, adding 1 retry. The composite-scoring.ts file that was referenced in prior iterations no longer exists at the expected path -- this suggests either renaming or consolidation since iter-2 (NOT a current misalignment, just a codebase evolution).
- What I would do differently: For the scoring signal count (Claim 2), I should have directly read the 12-step comment block in stage2-fusion.ts rather than trying to grep const counts -- the step listing is the authoritative architectural answer, not the raw constant count.

## Recommended Next Focus
Iteration 15: Complete Q1 (pipeline improvements) by investigating the RSF path (dormant/shadow), error cascading between stages, and whether the 12-step signal order has dependencies that constrain future refactoring. Also investigate whether the 5th/6th channel labels (DEGREE, KEYWORD) have dedicated search paths or are just reuse labels for graph sub-results.
