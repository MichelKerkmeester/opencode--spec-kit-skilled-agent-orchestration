# S4.1 Pipeline Stage Boundary Cleanup Design

## CURRENT STATE MAP

### Architectural mismatch

`executeStage1()` claims Stage 1 returns raw candidates without score mutation, but the hybrid branch delegates to `hybridSearch.searchWithFallback()` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:288-292`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:322-326`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:331-335`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:368-380`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:421-425`. That call enters a legacy mini-pipeline that already performs routing, fusion, reranking, MPAB aggregation, co-activation, token-budget truncation, and header injection before Stage 2 or Stage 3 ever run. This conflicts directly with the Stage 1 contract at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:6-8`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:190-191`, the orchestrator contract at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:49-52`, and the shared type contract at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:183-186`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:215-255`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:278-309`.

### Function map: legacy scoring/fusion/rerank logic inside `hybrid-search.ts`

| Function | Lines | What it does today | Which V2 stage duplicates it |
| --- | --- | --- | --- |
| `toHybridResult` | `111-122` | Normalizes fused RRF output into `score`/`source`. | Stage 2 scoring contract (`score`/`rrfScore`) at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:167-189` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:229-248` |
| `combinedLexicalSearch` | `397-423` | Merges FTS+BM25, dedupes by ID, sorts by score. | Stage 1 raw candidate collection, but today it is an implicit mini-fusion helper that should not leak past raw retrieval |
| `hybridSearch` | `433-550` | Legacy normalization, per-source score scaling, dedupe, final rank sort. | Stage 2 fusion/scoring (`executeStage2`) at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:562-834` |
| `hybridSearchEnhanced` | `557-1079` | Full legacy hybrid pipeline: routing, channel collection, adaptive fusion, MPAB, enforcement, truncation, rerank, MMR, co-activation, folder scoring, token budget, trace metadata, header injection. | Spans Stage 1, Stage 2, Stage 3, and Stage 4 simultaneously |
| `searchWithFallback` | `1092-1136` | Mini-orchestrator: enhanced search, threshold fallback, FTS fallback, BM25 fallback. | Orchestrator + Stage 1 fallback handling at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:62-178` |
| `structuralSearch` | `1148-1205` | Tier-3 structural fallback that synthesizes ranked `score` values. | Stage 1 retrieval plus Stage 2 score calibration; currently leaks scoring into retrieval |
| `injectContextualTree` | `1320-1344` | Header injection into `content`. | Stage 4 filter/format (`Filter + Annotate`) at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:146-178` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:278-309` |
| `applyResultLimit` | `1347-1352` | Final post-merge truncation. | Stage 4 final shaping |
| `calibrateTier3Scores` | `1363-1388` | Re-scales structural fallback scores under existing results. | Stage 2 fusion/scoring |
| `checkDegradation` | `1396-1422` | Score-driven quality gate deciding whether fallback tiers should run. | Orchestrator-level degradation decision using Stage 2 outputs |
| `mergeResults` | `1427-1445` | Dedupes scored result arrays and keeps higher score. | Stage 2 fusion |
| `searchWithFallbackTiered` | `1466-1547` | Full tiered fallback controller: run Tier 1, widen to Tier 2, inject Tier 3, attach degradation metadata. | Orchestrator + Stage 1 retrieval policy + Stage 2 score-aware degrade policy |
| `estimateTokenCount` | `1579-1582` | Token estimation helper. | Stage 4 format/filter helper |
| `estimateResultTokens` | `1589-1602` | Result-size estimation for token budget. | Stage 4 format/filter helper |
| `getTokenBudget` | `1609-1616` | Reads effective token budget. | Stage 4 format/filter helper |
| `createSummaryFallback` | `1621-1635` | Builds summary output when one result exceeds budget. | Stage 4 format/filter helper |
| `truncateToBudget` | `1644-1711` | Budget-aware truncation and overflow logging. | Stage 4 filter/format |

### Internal sub-pipeline leaks inside `hybridSearchEnhanced`

These are the exact subranges that conflict with the V2 stage layout:

| Legacy sub-step in `hybridSearchEnhanced` | Lines | Should belong to | Current V2 duplicate or conflict |
| --- | --- | --- | --- |
| Query routing + dynamic token budget | `572-609` | Stage 1 routing (`routeQuery`) and Stage 4 budgeting | Stage 1 says raw candidates only; Stage 4 already owns filtering/annotation by contract |
| Vector/FTS/BM25/graph channel collection | `619-680` | Stage 1 raw candidate generation | Correct stage in principle, but currently embedded inside the legacy pipeline rather than Stage 1 |
| Degree pseudo-channel | `682-723` | Stage 2 boosting/fusion | Conflicts with Stage 2 score ownership at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:17-45` |
| Adaptive fusion + fused result normalization | `746-773` | Stage 2 fusion | Duplicates Stage 2’s stated role as single scoring point |
| Legacy MPAB chunk collapse | `775-813` | Stage 3 rerank/aggregate | Duplicates `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:221-229` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:443-513` |
| Channel enforcement + confidence truncation | `815-871` | Stage 2 score-window shaping | Runs before Stage 2 ever sees “raw” candidates |
| Local reranker hook | `878-885` | Stage 3 rerank | Duplicates `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:303-339` |
| MMR diversity pruning | `887-942` | Stage 3 rerank | Duplicates `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:159-219` |
| Co-activation score boost | `944-969` | Stage 2 boosting | Duplicates `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:628-663` |
| Folder scoring / two-phase retrieval | `971-994` | Stage 2 boosting/fusion | Another ranking mutation before Stage 2 |
| Token budget truncation | `1002-1014` | Stage 4 filter/format | Duplicates Stage 4 final-shaping responsibility |
| Trace metadata promotion | `1031-1055` | Stage 4 annotation | Conflicts with Stage 4 annotation role in `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:297-309` |
| Context header injection | `1057-1062` | Stage 4 format | Duplicates Stage 4 formatting |

### Existing V2 scoring/rerank owners

The intended V2 owners already exist:

- Stage 2 owns score mutation and boosting in `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:17-45` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:538-834`.
- Stage 3 owns reranking and MPAB in `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:6-13`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:115-257`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:277-399`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:443-513`.
- Stage 4 is explicitly score-immutable and meant for filtering/annotation only at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:70-105` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:278-309`.

## PROPOSED STAGE BOUNDARIES

### Stage 1: Raw candidates only

Stage 1 should own retrieval planning and raw candidate collection, not final ranking:

- Keep query expansion, query routing, and channel execution in Stage 1.
  Evidence: current routing lives in `hybridSearchEnhanced()` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:572-580`, while Stage 1 is already the retrieval dispatcher at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:183-195`.
- Keep raw channels here: vector, FTS, BM25, graph, summary embeddings, constitutional injection, scope filters, archive/tier/context filters.
  Evidence: Stage 1 already owns those responsibilities at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:485-663`.
- Return either per-channel buckets or a unioned candidate set with provenance, but do not normalize, rerank, truncate, or inject headers.
- Remove all calls from Stage 1 to `searchWithFallback()`. Replace them with a retrieval-only API such as `collectHybridCandidates()` that stops after raw channel collection.

### Stage 2: Fusion and boosting

Stage 2 should become the only score-synthesizing stage before rerank:

- Move adaptive fusion/RRF and result normalization here from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:746-773`.
- Keep all score-boosting signals here: session boost, causal boost, co-activation, community, graph signals, intent weights, artifact routing, feedback signals, validation signal scoring.
  Evidence: Stage 2 already implements those at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:588-805`.
- Put degree-based reordering here, not in Stage 1. It is a score contribution over existing IDs, not a raw retrieval channel.
  Evidence: legacy degree logic depends on IDs harvested from other channels at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:685-719`.
- Keep confidence truncation and score-aware degradation checks here or immediately after Stage 2 in the orchestrator, because both depend on fused scores rather than raw retrieval.
  Evidence: legacy quality gate uses ranked scores at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1396-1422`.
- If structural fallback remains, Stage 2 should calibrate its synthetic scores after insertion using logic derived from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1363-1388`.

### Stage 3: Rerank only

Stage 3 should own every post-fusion ranking mutation:

- Cross-encoder reranking stays here.
  Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:134-157` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:277-399`
- MMR stays here.
  Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:159-219`
- MPAB chunk collapse and parent reassembly stay here.
  Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:221-229` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:443-513`
- Remove all rerank/MMR/MPAB logic from `hybrid-search.ts` once Stage 3 is the sole owner.

### Stage 4: Filter and format

Stage 4 should be the last-mile shaping step and remain score-immutable:

- Own token budget truncation and summary fallback.
  Move logic from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1579-1711`.
- Own header injection and trace/annotation materialization.
  Move logic from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1031-1062` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1320-1344`.
- Own final result limiting and non-score filters.
  Move `applyResultLimit()` from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1347-1352`.
- Preserve the Stage 4 invariant from `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:396-440`: formatting may drop rows or annotate rows, but may not mutate score fields.

## MIGRATION PLAN

### 1. Split retrieval from ranking without deleting legacy behavior

- Introduce a retrieval-only function in `hybrid-search.ts` or a new Stage 1 helper that stops after routing + raw channel collection.
  Source ranges to split out of `hybridSearchEnhanced()`: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:572-723`
- Update `executeStage1()` call sites to use that raw API instead of `searchWithFallback()`.
  Current call sites: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:288-292`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:322-326`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:331-335`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:368-380`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:421-425`
- Make the raw Stage 1 output carry channel provenance so Stage 2 can fuse intentionally instead of inheriting pre-fused rows.

### 2. Move fusion into Stage 2

- Port the RRF/adaptive fusion block from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:746-773` into Stage 2 before the existing signal stack at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:588-805`.
- Port legacy degree scoring from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:682-723` into Stage 2 as another graph-derived signal.
- Decide whether confidence truncation remains part of Stage 2 or becomes an orchestrator guard immediately after Stage 2; in either case it must consume Stage 2 fused scores, not Stage 1 output.

### 3. Delete rerank duplication by making Stage 3 the only owner

- Remove the local reranker, MMR, and MPAB blocks from `hybridSearchEnhanced()`:
  - Local reranker: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:878-885`
  - MMR: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:887-942`
  - MPAB: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:775-813`
- Keep the existing Stage 3 implementations:
  - Rerank: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:277-399`
  - MMR: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:159-219`
  - MPAB: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:443-513`

### 4. Move final shaping into Stage 4

- Port token-budget and summary-fallback helpers from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1579-1711`.
- Port header injection from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1057-1062` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1320-1344`.
- Port final result limiting from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1347-1352`.
- Preserve score snapshots with `captureScoreSnapshot()` / `verifyScoreInvariant()` from `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:380-440`.

### 5. Collapse legacy wrapper only after parity

- Keep `searchWithFallback()` as a compatibility wrapper during rollout.
- After parity, either:
  - Rewrite it as a thin wrapper around `executePipeline()`, or
  - Remove Stage 1’s dependency on it entirely and limit it to external legacy callers.

### Equivalence tests

Minimum parity coverage before deleting the legacy path:

- `hybrid_baseline_parity`: same top-K IDs and stable ordering for ordinary hybrid queries.
- `hybrid_rerank_parity`: compare Stage 3 output after cross-encoder/local rerank.
- `hybrid_mmr_parity`: same diversified top-K when MMR is enabled.
- `hybrid_mpab_parity`: same parent IDs and same chunk collapse stats.
- `hybrid_graph_signal_parity`: same co-activation, causal, community, and graph-signal effects when flags are on.
- `hybrid_fallback_tier_parity`: same degrade-tier decision and same structural fallback activation.
- `hybrid_token_budget_parity`: same truncated count and same single-result summary fallback behavior.
- `hybrid_header_injection_parity`: same contextual header prefix for identical `file_path` inputs.
- `stage_boundary_guard`: assert Stage 1 output does not already contain fully-fused/reranked markers for the new path, and assert Stage 4 does not mutate scores.

## RISK ANALYSIS

### 1. Score double-application

This is the main failure mode. Today Stage 1 can already return rows that have passed fusion/rerank logic from `hybrid-search.ts`, and then Stage 2 applies another score stack on top. The risk is visible in the mismatch between the Stage 1 contract (`raw candidates`) at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:190-191` and the legacy hybrid path that mutates ranking at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:746-1062`.

### 2. Score alias drift

Both Stage 2 and Stage 3 synchronize multiple aliases (`score`, `rrfScore`, `intentAdjustedScore`, `attentionScore`):

- Stage 2 sync helpers: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:167-189`
- Stage 3 overwrite logic: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:320-331` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:377-389`

If the migration moves only part of the legacy logic, the “effective score” fallback chain at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:48-68` can start reading stale aliases.

### 3. Hidden shared state carried on arrays

Legacy hybrid search attaches non-enumerable metadata directly to arrays:

- `_s4shadow`, `_s4attribution`, `_degradation` definitions at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:103-108`
- preservation and re-attachment at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996-1029`
- `_s3meta` attachment at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064-1069`
- degradation metadata attachment at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1481-1485`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1515-1519`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1540-1544`

Those side channels are not modeled in `PipelineResult` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:317-330`, so moving logic between stages can silently drop metadata.

### 4. Side-effect duplication in shadow or dual-run mode

Stage 2 can write FSRS updates when `trackAccess` is true at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:708-720`. `hybrid-search.ts` also mutates module-level graph metrics at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:215-241` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:664-676`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:732-744`. Shadow execution must not double-write or double-count.

### 5. Structural fallback is not a pure retrieval operation

`structuralSearch()` synthesizes ranked scores (`1.0 - index * 0.05`) at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1191-1199`. If Stage 1 is made truly raw, structural fallback either needs:

- a raw candidate representation without final `score`, or
- an explicit “synthetic channel score” contract consumed only by Stage 2.

### 6. Token budget and header timing can change output shape

Legacy token truncation happens before legacy header injection at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1002-1014` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1057-1062`, while the header overhead is reserved earlier at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1003-1008`. Moving those to Stage 4 is correct, but the exact ordering must stay the same or output counts and content payloads will drift.

## SHADOW SCORING

### Goal

Run legacy V1 and cleaned-up V2 side by side, keep one branch live, and record parity gaps until V2 is safe to promote.

### Recommended shape

1. Keep Stage 1 raw retrieval shared if possible.
   Build raw channel output once, then feed:
   - V1 compatibility path: legacy `searchWithFallback()` behavior reconstructed from the same raw candidates, or the current `searchWithFallback()` if a shared-input adapter is not ready.
   - V2 path: `executeStage2()` -> `executeStage3()` -> `executeStage4()`
2. Mark the shadow branch as read-only.
   Force `trackAccess=false` on the shadow side so FSRS write-back at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:708-720` does not execute twice.
3. Namespace metrics.
   Do not let shadow runs update production graph metrics or rollout counters from `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:215-241`.
4. Compare at each boundary, not only final results.
   Record:
   - Stage 2 top-K IDs and score deltas
   - Stage 3 top-K IDs, rerank-applied flag, MPAB stats
   - Stage 4 truncated count, header injection, annotation parity
   - degrade-tier decision parity from legacy `checkDegradation()` / `searchWithFallbackTiered()`
5. Attach the diff to trace metadata, not ranking.
   Use the existing `trace` plumbing from `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:182-194` and Stage trace hooks in Stage 1/2/3 at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:669-684`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:807-826`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:148-157`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:233-247`.

### Parity metrics

Use a small fixed set of metrics so rollout decisions stay objective:

- Exact top-1 match
- Top-K overlap ratio
- Mean absolute score delta after normalization to the `resolveEffectiveScore()` contract at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:58-68`
- MPAB parent-ID parity
- Token-truncated count parity
- Degradation-tier parity

### Promotion rule

Promote V2 only after shadow runs show stable parity on:

- normal hybrid queries
- chunk-heavy corpora
- graph-signal-enabled queries
- low-recall queries that trigger structural fallback
- oversized payload queries that trigger token-budget truncation
