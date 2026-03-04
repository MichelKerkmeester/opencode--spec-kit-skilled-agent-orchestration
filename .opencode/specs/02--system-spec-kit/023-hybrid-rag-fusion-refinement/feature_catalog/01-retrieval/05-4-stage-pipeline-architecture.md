# 4-stage pipeline architecture

## Current Reality

The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.

Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. Nine signals apply in a fixed, documented order: session boost, causal boost, FSRS testing effect, intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.

Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.

Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.

The pipeline is the sole runtime path. `SPECKIT_PIPELINE_V2` is deprecated — `isPipelineV2Enabled()` is hardcoded to `true` and the legacy `postSearchPipeline` was removed in Phase 017.

---

## Source Metadata

- Group: Retrieval
- Source feature title: 4-stage pipeline architecture
- Summary match found: No
- Current reality source: feature_catalog.md
