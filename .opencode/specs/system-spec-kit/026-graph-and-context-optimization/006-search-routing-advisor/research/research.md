# Deep Research — 006-search-routing-advisor

## Summary
This investigation examined retrieval correctness, fusion-weight calibration, intent-mapping regressions, and adapter-tier boundary issues across the full `006-search-routing-advisor` phase tree. The strongest correctness defect is in `skill_advisor.py`, where graph conflict penalties raise uncertainty after `passes_threshold` is already frozen, allowing conflicting recommendations to remain marked as passing. On the retrieval side, the live hybrid path does not fully realize the adaptive-fusion contract: continuity remains an internal-only intent surface, document-type weighting is dropped, and the intent-specific recency model is replaced by a fixed Stage 2 recency bonus. Smart-router telemetry and measurement are intentionally observe-only, so the current reports explain predicted behavior but cannot yet prove live compliance or disprove the upstream correctness defects. Convergence was reached qualitatively by the final iterations, but the evidence still points to a small set of concrete code and doc repairs before additional measurement runs will be maximally informative.

## Scope
Investigated:
- The root packet docs for `006-search-routing-advisor` and all nested sub-packet spec docs.
- Retrieval and ranking code in the search pipeline, adaptive fusion helpers, graph calibration, and Stage 3 reranking.
- Skill-advisor routing code related to phrase boosts, graph boosts, dual-threshold gating, and conflict penalties.
- Smart-router telemetry, static measurement, and OpenCode plugin adapter surfaces.
- Cross-phase research and implementation summaries needed to connect earlier findings to the current shipped behavior.

Did not investigate:
- New external runtime behavior outside repo evidence.
- Live production telemetry outside committed packet artifacts.
- Modifications outside this phase's `research/` directory.

## Key Findings
### P0
- `F-001` Correctness: graph conflict penalties do not recompute `passes_threshold` after increasing uncertainty, so conflicting skills can remain marked as passing. Evidence: [iteration-06.md](./iterations/iteration-06.md), `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2829-2837`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:972-975`

### P1
- `F-002` Correctness: continuity retrieval tuning is only reachable through an internal `adaptiveFusionIntent` path, while the public classifier cannot emit `continuity`; this creates an intent-surface split that can silently drop continuity-specific behavior. Evidence: [iteration-01.md](./iterations/iteration-01.md), [iteration-10.md](./iterations/iteration-10.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/implementation-summary.md:39-41`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:47-48`
- `F-003` Correctness: the live hybrid path bypasses `adaptiveFuse()`, drops `documentType`, and ignores intent-specific `recencyWeight`, so the runtime behavior is looser than the documented adaptive-fusion model. Evidence: [iteration-02.md](./iterations/iteration-02.md), [iteration-10.md](./iterations/iteration-10.md), `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221-1253`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:138-187`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:193-249`
- `F-004` Architecture: Stage 2 graph calibration only directly calibrates aggregate `graphSignalDelta` and `communityDelta`, while `causalDelta` and `coActivationDelta` remain in the recomputed `totalDelta`; the documented cap surface is therefore only partial. Evidence: [iteration-03.md](./iterations/iteration-03.md), `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:24-30`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:361-390`
- `F-005` Docs: the Phase 023 implementation summary documents obsolete OpenCode hook lifecycle names, while the tested plugin contract uses `event`, `experimental.chat.system.transform`, and `tool`. Evidence: [iteration-08.md](./iterations/iteration-08.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/implementation-summary.md:117-123`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:126-145`

### P2
- `F-006` Correctness: Stage 3 now skips reranking for 2-3 row result sets, so small-list fusion mistakes are no longer corrected downstream; this matters more because the length penalty was also retired from live scoring. Evidence: [iteration-04.md](./iterations/iteration-04.md), `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:320-323`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md:39-42`
- `F-007` Other: smart-router telemetry and measurement remain intentionally observe-only, and static measurement writes `unknown_unparsed` records rather than live compliance, so current dashboards cannot prove routing correctness or live resource compliance by themselves. Evidence: [iteration-07.md](./iterations/iteration-07.md), [iteration-09.md](./iterations/iteration-09.md), `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:166-210`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:5-7`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:48-56`

## Evidence Trail
- [iteration-01.md](./iterations/iteration-01.md): continuity is "internal" in the fusion profile but absent from the public classifier surface.
- [iteration-02.md](./iterations/iteration-02.md): the live hybrid path uses `getAdaptiveWeights(intent)` but still goes directly to `fuseResultsMulti(...)`.
- [iteration-03.md](./iterations/iteration-03.md): graph calibration currently caps an aggregate surrogate, not every graph sub-signal that contributes to `totalDelta`.
- [iteration-04.md](./iterations/iteration-04.md): reranking only starts at four results, so Stage 2 ordering quality matters more than before.
- [iteration-05.md](./iterations/iteration-05.md): phrase and graph boosts strengthen matching, which makes later safety gates more important.
- [iteration-06.md](./iterations/iteration-06.md): `passes_threshold` is frozen before the conflict penalty raises uncertainty.
- [iteration-07.md](./iterations/iteration-07.md): telemetry can classify live reads, but the current evidence surface is still intentionally observe-only.
- [iteration-08.md](./iterations/iteration-08.md): plugin tests and packet prose disagree on the OpenCode hook interface.
- [iteration-09.md](./iterations/iteration-09.md): the 200-prompt measurement run still lands at 112/200 top-1 label matches and is explicit about being static.
- [iteration-10.md](./iterations/iteration-10.md): the failure chain spans caller intent injection, hybrid fusion, thresholding, and partially informative observability.

## Recommended Fixes
- `[P0][skill-advisor]` Recompute `passes_threshold` after `_apply_graph_conflict_penalty(...)`, or derive threshold pass/fail lazily after all mutators have run. Add a regression test where a pair passes before the penalty and fails after the `+0.15` uncertainty increase.
- `[P1][search-entrypoint]` Make the continuity pathway explicit at the public search boundary: either expose `continuity` as a first-class detected intent where appropriate, or add end-to-end tests that prove the required callers always thread `adaptiveFusionIntent='continuity'`.
- `[P1][hybrid-search]` Route live hybrid fusion through `adaptiveFuse()` or equivalent behavior so `documentType` and intent-specific `recencyWeight` are actually applied in runtime ranking, not just helper-level tests.
- `[P1][stage2-fusion]` Expose per-signal graph attribution on `PipelineRow` and calibrate each graph sub-signal before recomputing `totalDelta`; add assertions on total graph contribution, not only the zero-contribution warning path.
- `[P1][docs/plugin]` Update the Phase 023 implementation summary and any operator-facing setup notes to describe the tested OpenCode hook keys (`event`, `experimental.chat.system.transform`, `tool`) instead of the obsolete lifecycle names.
- `[P2][retrieval-tests]` Add a small-result-set regression suite for 2-3 row candidate lists so hybrid-fusion mistakes are visible even when reranking is intentionally skipped.
- `[P2][observability]` Separate static prediction accuracy from live compliance in dashboards and reports; avoid summarizing them under one correctness headline until live read capture is broadly wired.

## Convergence Report
The investigation did not trigger the early-stop rule because new information stayed above the `0.05` threshold, but it converged qualitatively by iterations 08-10. The highest-yield iterations were:
- Iteration 01: identified the continuity public/private intent split.
- Iteration 02: showed the live hybrid path bypasses part of the adaptive-fusion contract.
- Iteration 06: found the concrete threshold-freeze bug in `skill_advisor.py`.

Iterations 07-10 mainly tightened cross-phase implications and fix ordering rather than opening entirely new problem areas.

## Open Questions
- Which live callers currently set `adaptiveFusionIntent='continuity'`, and are any high-value entrypoints still omitting it?
- How large is the prompt set where the graph conflict penalty should flip a recommendation from passing to non-passing?
- Are `causalDelta` and `coActivationDelta` bounded strongly enough upstream to make the Stage 2 calibration gap harmless in practice?
- How much of the remaining 88/200 corpus mismatch gap is due to skill selection versus intra-skill route/resource selection?
- Which runtime adapters are already emitting real `actualReads` into smart-router telemetry, and which are still static-only?

## References
- Root packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/spec.md`
- Packet index: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/context-index.md`
- Iteration evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/research/iterations/iteration-01.md` through `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/research/iterations/iteration-10.md`
- Search and routing code: `.opencode/skill/system-spec-kit/mcp_server/lib/search/`, `.opencode/skill/system-spec-kit/shared/algorithms/`
- Skill-advisor code: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- Observability code: `.opencode/skill/system-spec-kit/scripts/observability/`
- Plugin tests: `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`
- External docs: none used
- CocoIndex note: `mcp__cocoindex_code__search` was attempted during exploration but the MCP call was cancelled, so repo-local exact reads were used as fallback evidence.
