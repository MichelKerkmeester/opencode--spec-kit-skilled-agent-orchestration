Verification complete for category `graph signal activation`.

I read:
- All 16 catalog entries in [10--graph-signal-activation](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation>)
- Prior audit summary [implementation-summary.md](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/implementation-summary.md:38>)
- Referenced code under `.opencode/skill/system-spec-kit/mcp_server/...`

For file existence: all `mcp_server/...` table references in features 01–16 exist on disk (feature 16 has one prose-only non-path fragment at [16-typed-traversal.md:51](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/16-typed-traversal.md:51>), but all table paths exist).

1. **01 Typed-weighted degree channel**
- File verification: OK (all refs at [01-...md:30](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md:30>)).
- Function verification: `computeTypedDegree(database, memoryId)` [graph-search-fn.ts:303](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:303>), `normalizeDegreeToBoostedScore(rawDegree, maxDegree)` [graph-search-fn.ts:337](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:337>), `computeDegreeScores(...)` [graph-search-fn.ts:388](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:388>).
- Flag defaults: `SPECKIT_DEGREE_BOOST` via `isDegreeBoostEnabled()` [search-flags.ts:199](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:199>) + default-on policy [rollout-policy.ts:53](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:53>).
- Unreferenced files found: [hybrid-search.ts:728](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:728>), [search-flags.ts:198](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:198>), [memory-crud-delete.ts:21](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:21>).
- Verdict: **MATCH**

2. **02 Co-activation boost strength increase**
- Files: OK ([02-...md:30](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md:30>)).
- Functions: `boostScore(...)` [co-activation.ts:90](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:90>), `clearRelatedCache()` [co-activation.ts:70](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:70>).
- Flags/defaults: `DEFAULT_COACTIVATION_STRENGTH=0.25` [co-activation.ts:22](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:22>), env override `SPECKIT_COACTIVATION_STRENGTH` [co-activation.ts:24](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:24>).
- Unreferenced: [stage2-fusion.ts:54](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:54>), [mutation-hooks.ts:83](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:83>).
- Verdict: **MATCH**

3. **03 Edge density measurement**
- Files: OK ([03-...md:28](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md:28>)).
- Functions: `measureEdgeDensity(database)` [edge-density.ts:71](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:71>).
- Flags/defaults: N/A.
- Unreferenced: entity-linking runtime guard uses same denominator in [entity-linker.ts:509](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:509>) and gating [entity-linker.ts:635](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:635>).
- Verdict: **MATCH**

4. **04 Weight history audit tracking**
- Files: OK ([04-...md:32](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md:32>)).
- Functions: `insertEdge(...)` [causal-edges.ts:144](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:144>), `cleanupOrphanedEdges()` [causal-edges.ts:617](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:617>), `rollbackWeights(edgeId,toTimestamp)` [causal-edges.ts:721](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:721>).
- Flags/defaults: N/A.
- Unreferenced: schema migration ownership for `weight_history`/`created_by`/`last_accessed` in [vector-index-schema.ts:662](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:662>).
- Verdict: **MATCH**

5. **05 Graph momentum scoring**
- Files: OK ([05-...md:34](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md:34>)).
- Functions: `snapshotDegrees(db)` [graph-signals.ts:67](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:67>), `computeMomentum(db,id)` [graph-signals.ts:156](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:156>), `computeMomentumScores(...)` [graph-signals.ts:173](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:173>), `clearGraphSignalsCache()` [graph-signals.ts:54](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:54>).
- Flags/defaults: `SPECKIT_GRAPH_SIGNALS` default-on [search-flags.ts:161](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:161>).
- Unreferenced: runtime application/wiring [stage2-fusion.ts:696](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:696>), restore rebuild hook [checkpoints.ts:904](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:904>).
- Verdict: **MATCH**

6. **06 Causal depth signal**
- Files: OK ([06-...md:34](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md:34>)).
- Functions: `computeCausalDepthScores(db,ids)` [graph-signals.ts:484](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:484>), `applyGraphSignals(rows,db,...)` [graph-signals.ts:563](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:563>).
- Flags/defaults: `SPECKIT_GRAPH_SIGNALS` default-on [search-flags.ts:161](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:161>).
- Unreferenced: stage2 wiring [stage2-fusion.ts:700](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:700>).
- Verdict: **MATCH**

7. **07 Community detection**
- Files: OK ([07-...md:34](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/07-community-detection.md:34>)).
- Functions: `detectCommunitiesBFS` [community-detection.ts:99](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:99>), `detectCommunitiesLouvain` [community-detection.ts:184](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:184>), `detectCommunities` [community-detection.ts:322](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:322>), `storeCommunityAssignments` [community-detection.ts:443](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:443>), `applyCommunityBoost` [community-detection.ts:525](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:525>).
- Flags/defaults: `SPECKIT_COMMUNITY_DETECTION` default-on [search-flags.ts:169](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:169>).
- Unreferenced: stage2 injection point [stage2-fusion.ts:677](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:677>), restore hook [checkpoints.ts:909](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:909>).
- Verdict: **MATCH**

8. **08 Graph and cognitive memory fixes**
- Files: OK (50/50 listed refs exist; source table starts at [08-...md:38](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md:38>)).
- Function verification (all claimed fixes present): self-loop reject [causal-edges.ts:165](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:165>), `maxDepth` clamp [causal-graph.ts:253](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:253>), community debounce hash [community-detection.ts:335](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:335>), orphan cleanup [causal-edges.ts:617](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:617>), WM clamp [working-memory.ts:611](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:611>), double-decay removal [memory-triggers.ts:339](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:339>), co-activation cache clear hook [mutation-hooks.ts:83](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:83>).
- Flags/defaults: N/A.
- Unreferenced: key handler files above are not in this entry’s implementation table.
- Verdict: **MATCH**

9. **09 ANCHOR tags as graph nodes**
- Files: OK ([09-...md:32](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md:32>)).
- Functions: `extractAnchorMetadata(content)` [anchor-metadata.ts:106](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:106>), `enrichResultsWithAnchorMetadata(results)` [anchor-metadata.ts:172](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:172>).
- Flags/defaults: N/A.
- Behavioral check: tests explicitly assert no causal-edge fields added [anchor-metadata.vitest.ts:582](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:582>).
- Unreferenced: stage wiring in [stage2b-enrichment.ts:25](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2b-enrichment.ts:25>) not listed.
- Verdict: **MATCH**

10. **10 Causal neighbor boost and injection**
- Files: OK ([10-...md:32](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md:32>)).
- Functions: `getNeighborBoosts(memoryIds,maxHops=2)` [causal-boost.ts:367](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:367>), `applyCausalBoost(results,options)` [causal-boost.ts:477](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:477>).
- Flags/defaults: `SPECKIT_CAUSAL_BOOST` gate [causal-boost.ts:137](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:137>) uses default-on rollout policy [rollout-policy.ts:53](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:53>).
- Behavioral checks: seed fraction/cap [causal-boost.ts:28](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:28>), [causal-boost.ts:503](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:503>); relation multipliers [causal-boost.ts:88](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:88>); combined 0.20 cap [causal-boost.ts:26](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:26>), [causal-boost.ts:575](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:575>), [session-boost.ts:9](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:9>).
- Unreferenced: none material.
- Verdict: **MATCH**

11. **11 Temporal contiguity layer**
- Files: OK ([11-...md:30](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md:30>)).
- Functions: `vectorSearchWithContiguity(...)` [temporal-contiguity.ts:57](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:57>), `getTemporalNeighbors(...)` [temporal-contiguity.ts:110](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:110>), `buildTimeline(...)` [temporal-contiguity.ts:155](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:155>).
- Flags/defaults: N/A.
- Behavioral mismatch: module is explicitly marked deprecated and not wired into production pipeline [temporal-contiguity.ts:7](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:7>), but catalog presents active feature behavior.
- Unreferenced: none material.
- Verdict: **PARTIAL**

12. **12 Unified graph retrieval, deterministic ranking, explainability, rollback**
- Files: OK ([12-...md:32](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md:32>)).
- Functions/contracts: deterministic comparator/sort [ranking-contract.ts:39](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:39>), [ranking-contract.ts:62](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:62>), used in Stage2 [stage2-fusion.ts:822](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:822>) and Stage3 [stage3-rerank.ts:511](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:511>).
- Flags/defaults: rollback gate `SPECKIT_GRAPH_UNIFIED` [graph-flags.ts:16](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:16>), stage2 kill-switch gating [stage2-fusion.ts:613](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:613>), [stage2-fusion.ts:636](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:636>), [stage2-fusion.ts:677](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:677>), [stage2-fusion.ts:696](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:696>).
- Explainability: graph contribution metadata and trace [stage2-fusion.ts:576](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:576>), [stage2-fusion.ts:869](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:869>), telemetry diagnostics [memory-search.ts:946](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:946>).
- Unreferenced: `graph-flags.ts` is core to this feature but not listed in this entry.
- Verdict: **MATCH**

13. **13 Graph lifecycle refresh**
- Files: OK ([13-...md:32](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md:32>)).
- Functions: `resolveGraphRefreshMode()` [graph-lifecycle.ts:53](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:53>), `onWrite(...)` [graph-lifecycle.ts:386](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:386>), `getGraphRefreshMode()` [search-flags.ts:342](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:342>).
- Flags/defaults: code default is `write_local` [graph-lifecycle.ts:57](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:57>) and [search-flags.ts:343](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:343>).
- Behavioral mismatch: catalog contains contradictory default statements (“default off” in overview [13-...md:12](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md:12>) vs “enabled by default” [13-...md:18](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md:18>)).
- Unreferenced: none material.
- Verdict: **PARTIAL**

14. **14 Async LLM graph backfill**
- Files: OK ([14-...md:30](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md:30>)).
- Functions: `isLlmGraphBackfillEnabled()` [search-flags.ts:351](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:351>), scheduling in `onIndex(...)` [graph-lifecycle.ts:552](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:552>) / [_scheduleLlmBackfill](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:599>).
- Flags/defaults: default-on behavior in code [search-flags.ts:349](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:349>) and tests [graph-lifecycle.vitest.ts:162](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:162>).
- Behavioral mismatch: catalog contradicts itself (“defaults to off” [14-...md:12](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md:12>) vs “enabled by default” [14-...md:18](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md:18>)).
- Unreferenced: none material.
- Verdict: **PARTIAL**

15. **15 Graph calibration profiles and community thresholds**
- Files: OK ([15-...md:32](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/15-graph-calibration-profiles.md:32>)).
- Functions: `applyCalibrationProfile(...)` [graph-calibration.ts:407](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:407>), `shouldActivateLouvain(...)` [graph-calibration.ts:433](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:433>), `isGraphCalibrationProfileEnabled()` [search-flags.ts:365](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:365>).
- Flags/defaults: profile values match catalog ([graph-calibration.ts:147](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:147>), [graph-calibration.ts:156](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:156>), [graph-calibration.ts:30](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:30>)).
- Behavioral mismatch: module is explicitly deprecated and “never wired into Stage 2” [graph-calibration.ts:14](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:14>); no runtime imports outside itself.
- Unreferenced: none material.
- Verdict: **PARTIAL**

16. **16 Typed traversal**
- Files: OK for table refs ([16-...md:36](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/16-typed-traversal.md:36>)).
- Functions: `isTypedTraversalEnabled()` [causal-boost.ts:145](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:145>) and [search-flags.ts:443](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:443>), sparse constants [causal-boost.ts:38](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:38>), [causal-boost.ts:41](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:41>), intent map [causal-boost.ts:56](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:56>), scoring formula [causal-boost.ts:241](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:241>).
- Flags/defaults: default-on [search-flags.ts:441](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:441>).
- Behavioral mismatch: live Stage2 call omits `graphDensity`/`intent` options [stage2-fusion.ts:616](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:616>), and community branch has no sparse suppression [stage2-fusion.ts:677](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:677>).
- Unreferenced: [stage2-fusion.ts:616](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:616>), dedicated test suite [typed-traversal.vitest.ts:1](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:1>) not listed.
- Verdict: **PARTIAL**

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | Typed-weighted degree channel | Yes | Yes | Yes | Yes | MATCH |
| 2 | Co-activation boost strength increase | Yes | Yes | Yes | Yes | MATCH |
| 3 | Edge density measurement | Yes | Yes | N/A | Yes | MATCH |
| 4 | Weight history audit tracking | Yes | Yes | N/A | Yes | MATCH |
| 5 | Graph momentum scoring | Yes | Yes | Yes | Yes | MATCH |
| 6 | Causal depth signal | Yes | Yes | Yes | Yes | MATCH |
| 7 | Community detection | Yes | Yes | Yes | Yes | MATCH |
| 8 | Graph and cognitive memory fixes | Yes | Yes | N/A | Yes | MATCH |
| 9 | ANCHOR tags as graph nodes | Yes | Yes | N/A | Yes | MATCH |
| 10 | Causal neighbor boost and injection | Yes | Yes | Yes | No | MATCH |
| 11 | Temporal contiguity layer | Yes | Yes | N/A | No | PARTIAL |
| 12 | Unified graph retrieval, deterministic ranking, explainability, rollback | Yes | Yes | Yes | Yes | MATCH |
| 13 | Graph lifecycle refresh | Yes | Yes | No (catalog default text conflicts) | No | PARTIAL |
| 14 | Async LLM graph backfill | Yes | Yes | No (catalog default text conflicts) | No | PARTIAL |
| 15 | Graph calibration profiles and community thresholds | Yes | Yes | Yes | No | PARTIAL |
| 16 | Typed traversal | Yes | Yes | Yes | Yes | PARTIAL |

Comparison to prior audit: prior summary reports 12 MATCH / 4 PARTIAL ([implementation-summary.md:38](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/implementation-summary.md:38>)); this verification finds **11 MATCH / 5 PARTIAL**, adding typed-traversal live-path wiring as a partial.