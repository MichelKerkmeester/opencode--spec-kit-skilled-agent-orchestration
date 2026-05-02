# Iteration 004: CocoIndex Semantic Search Dedup and Telemetry

## Focus

Assess the semantic search fork for precision/recall controls and downstream fusion affordances.

## Sources

- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:8`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:21`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:39`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:158`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:176`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:253`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:52`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:194`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:46`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md:243`

## Findings

- CocoIndex results now carry `source_realpath`, `content_hash`, `path_class`, `raw_score`, and `rankingSignals` (`schema.py:8`, `:24`). That is enough to expose duplicate collapse and path-class rerank evidence downstream.
- Dedup keys use real path when available, otherwise content hash plus line range (`query.py:158`). Query execution overfetches at `4x` the requested unique window before dedup/ranking (`query.py:282`, `:283`).
- Path-class rerank is intent-aware: implementation-intent queries get a small implementation-path bonus and non-implementation penalty while preserving raw score (`query.py:176`).
- v1.0.2 evidence confirmed telemetry was visible: `dedupedAliases:26`, `uniqueResultCount:10`, and `path_class` surfaced in the S2 rerun (`010-stress-test-rerun-v1-0-2/findings.md:46`).
- Follow-up research correctly reframed the remaining CocoIndex work as seed-fidelity passthrough and downstream use, not duplicated rerank (`011-post-stress-followup-research/research/research.md:243`, `:255`).

## Insights

The semantic search fork is no longer the weakest link. The optimization opportunity is to use its telemetry as fusion evidence: duplicate collapse should affect confidence, path_class should inform trust, and raw_score should remain visible for cross-source calibration.

## Open Questions

- Is `fetch_k = 4 * (limit + offset)` enough for generated/vendor-heavy repos, or should the multiplier be adaptive?
- Should `path_class` be part of a global artifact classifier shared with memory search and advisor?

## Next Focus

Inspect skill graph and advisor lane fusion, especially ambiguous query behavior and learned weights readiness.

## Convergence

newInfoRatio: 0.68. New source-backed details are still above convergence threshold.

