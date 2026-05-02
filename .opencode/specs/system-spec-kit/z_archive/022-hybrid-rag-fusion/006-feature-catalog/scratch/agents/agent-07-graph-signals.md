● skill(sk-code-review)

I’m going to inventory the catalog files and the two source trees first, then I’ll cross-check each document against actual implementations and summarize any gaps.

● List directory .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation
  └ 16 files found

● List directory .opencode/skill/system-spec-kit/mcp_server
  └ 34 files found

● List directory .opencode/skill/system-spec-kit/scripts
  └ 34 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/*.md"
  └ 16 files found

I’ve got the file set. Next I’m pulling the catalog content and doing code searches against both `mcp_server` and `scripts` so I can classify each entry as fully aligned, partial, or misaligned.

● Search (grep)
  │ "graph|causal|co-activation|contiguity|community|typed
  │ traversal|anchor|momentum|density|backfill|calibration|explainability|rollback|degree|neighbor
  │ boost" in {mcp_server,scripts}/**/*.{ts,tsx,js,mjs,cjs,py,sh,json}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

✗ Read all feature catalog markdown files (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && for f in
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/*.md; do printf
  │ '\n===== %s =====\n' "$(basename "$f")"; sed -n '1,260p' "$f"; done
  └ Command blocked: contains dangerous shell expansion patterns (e.g., parameter transformation,
    indirect expansion, or nested command substitution) that could enable arbitrary code execution.
    Please rewrite the command without these expansion patterns.

● Create session plan file (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/94b07abe-e0d6-40ef-8247-40cf0346561c/plan.md'
  │ <<'EOF'
  │ 1. Read all 16 feature catalog markdown files under
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation.…
  └ 7 lines...

● search graph signal activation, causal edges, co-activation boost, temporal contiguity, community…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● Search (grep)
  │ "causal|co-activation|coactivation|contiguity|community|traversal|anchor|momentum|density|backfi
  │ ll|calibration|rollback|degree|neighbor boost|signal activation|graph" in
  │ **/*.{ts,js,mjs,cjs,py,sh,json} (.opencode/skill/system-spec-kit/scripts)
  └ 81 files found

● Search (grep)
  │ "causal|co-activation|coactivation|contiguity|community|traversal|anchor|momentum|density|backfi
  │ ll|calibration|rollback|degree|neighbor boost|signal activation|graph" in
  │ **/*.{ts,js,mjs,cjs,py,sh,json} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

● Print feature catalog markdown contents (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation')
  │ for path in sorted(base.glob('*.md')):…
  └ 13 lines...

I’ve got the raw catalog contents; now I’m extracting the concrete claims from each doc and matching them to code-level evidence instead of just keyword hits.

● Read copilot-tool-output-1774457034042-x0ql2b.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774457034042-x0ql2b.txt
  └ L1:220 (219 lines read)

● Read copilot-tool-output-1774457033530-7o6zdk.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774457033530-7o6zdk.txt
  └ L1:200 (149 lines read)

● Summarize feature catalog metadata and bullets (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation')…
  └ 127 lines...

● Extract referenced source file paths from feature docs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation')…
  └ 173 lines...

● Show current reality sections from feature docs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation')
  │ for path in sorted(base.glob('*.md')):…
  └ 252 lines...

I’ve narrowed the review to the concrete implementation anchors now: constants, flags, functions, tables, and claimed source files. That should make the mismatch calls much cleaner.

● Search (grep)
  │ "vectorSearchWithContiguity|getTemporalNeighbors|buildTimeline|SPECKIT_TEMPORAL_CONTIGUITY|TEMPO
  │ RAL_CONTIGUITY" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 23 lines found

● Search (grep)
  │ "MAX_TYPED_DEGREE|MAX_TOTAL_DEGREE|DEGREE_BOOST_CAP|getDegreeCacheForDb|clearDegreeCacheForDb|SP
  │ ECKIT_DEGREE_BOOST|constitutional" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_COACTIVATION_STRENGTH|0\.25|clearRelatedCache|co-activation" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "weight_history|created_by|last_accessed|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH|rollbackWeights|cl
  │ eanupOrphanedEdges|sourceId === targetId" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "degree_snapshots|computeMomentum|computeMomentumScores|computeCausalDepth|computeCausalDepthSco
  │ res|applyGraphSignals|SPECKIT_GRAPH_SIGNALS" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "community_assignments|detectCommunities|storeCommunityAssignments|applyCommunityBoost|SPECKIT_C
  │ OMMUNITY_DETECTION|Louvain|connected components" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_GRAPH_UNIFIED|ranking contract|deterministic|retrieval trace|trace
  │ metadata|applyCalibrationProfile|SPECKIT_GRAPH_CALIBRATION_PROFILE|SPECKIT_CALIBRATION_PROFILE_N
  │ AME|GRAPH_WEIGHT_CAP|COMMUNITY_SCORE_CAP|louvainMinDensity|louvainMinSize" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_GRAPH_REFRESH_MODE|SPECKIT_LLM_GRAPH_BACKFILL|isLlmGraphBackfillEnabled|write_local|sch
  │ eduled|dirty-node|dirty node|local
  │ recompute|LOCAL_RECOMPUTE_EDGE_LIMIT|DEFAULT_LOCAL_RECOMPUTE_THRESHOLD|SPARSE_DENSITY_THRESHOLD|
  │ SPARSE_MAX_HOPS|INTENT_EDGE_PRIORITY|SPECKIT_TYPED_TRAVERSAL|MAX_COMBINED_BOOST|MAX_HOPS" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "edge density|degree_snapshots|graph-signals|community_assignments|temporal contiguity|graph
  │ refresh|graph calibration|typed traversal|co-activation|causal boost|louvain|backfill" in
  │ **/*.{ts,js,py,sh,json} (.opencode/skill/system-spec-kit/scripts)
  └ 21 lines found

● Check whether doc-referenced source files exist (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')…
  └ 42 lines...

● Extract implementation and test file tables per doc (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')…
  └ 76 lines...

I’m switching from broad grep to a feature-by-feature evidence pass now, so I can separate “implemented but documented oddly” from “claim doesn’t exist in code.”

● Run feature-by-feature evidence scan against source files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')…
  └ 248 lines...

● Read graph-search-fn.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts
  └ L1:260 (260 lines read)

● Read causal-edges.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ L1:320 (320 lines read)

● Read graph-signals.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts
  └ L1:320 (320 lines read)

● Read community-detection.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts
  └ L1:320 (320 lines read)

● Read temporal-contiguity.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
  └ L1:260 (182 lines read)

● Read causal-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ L1:320 (320 lines read)

● Read graph-lifecycle.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts
  └ L1:320 (320 lines read)

● Read graph-calibration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "MAX_COMBINED_BOOST|SPECKIT_TYPED_TRAVERSAL|INTENT_EDGE_PRIORITY|SPARSE_DENSITY_THRESHOLD|SPARSE
  │ _MAX_HOPS" (.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts)
  └ 33 lines found

● Search (grep)
  │ "MAX_TYPED_DEGREE|DEFAULT_MAX_TYPED_DEGREE|DEGREE_BOOST_CAP|getDegreeCacheForDb|clearDegreeCache
  │ ForDb|constitutional|computeTyped"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts)
  └ 30 lines found

● Search (grep)
  │ "feature-eval-graph-signals|graph-signals" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 8 files found

● Search (grep)
  │ "clearRelatedCache|memory-bulk-delete" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 22 lines found

● Search (grep)
  │ "community detection is suppressed|suppress community|sparseModeActive|graphDensity"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ No matches found

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:360 (360 lines read)

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ L1:260 (64 lines read)

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L1:260 (260 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L180:320 (141 lines read)

● Read mutation-hooks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ L1:160 (106 lines read)

● Read causal-graph.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
  └ L1:220 (220 lines read)

● Read anchor-chunker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
  └ L1:220 (220 lines read)

● Read anchor-metadata.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
  └ L1:220 (188 lines read)

● Search (grep)
  │ "isGraphUnifiedEnabled|graphContribution|addTraceEntry|sortDeterministicRows|applyCommunityBoost
  │ |applyGraphSignals|applyCalibrationProfile|sparseModeActive|graphDensity|intent"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 73 lines found

● Search (grep)
  │ "llmBackfillScheduled|isLlmGraphBackfillEnabled|onIndex|createTypedEdges|scheduleGlobalRefresh|m
  │ arkDirty|recomputeLocal"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts)
  └ 31 lines found

● Search (grep)
  │ "SPECKIT_GRAPH_UNIFIED|isGraphUnifiedEnabled" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 87 lines found

● Search (grep)
  │ "SPECKIT_LLM_GRAPH_BACKFILL|isLlmGraphBackfillEnabled|scheduled|write_local|llmBackfillScheduled
  │ " (.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts)
  └ 2 lines found

● Search (grep)
  │ "MAX_TOTAL_BOOST|MAX_WINDOW|DEFAULT_WINDOW|SPECKIT_TEMPORAL_CONTIGUITY|window"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts)
  └ 13 lines found

● Search (grep)
  │ "weight_history|rollbackWeights|same-millisecond|oldest
  │ entry|created_by|last_accessed|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts)
  └ 21 lines found

● Search (grep)
  │ "weight_history|rollbackWeights|same-millisecond|oldest
  │ entry|created_by|last_accessed|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts)
  └ 5 lines found

I’ve found a few likely doc/code drifts already: some features are real but their “source files” tables are noisy or omit the actual wiring points, and at least one fix doc describes the wrong cache-clearing path.

● Read graph-search-fn.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts
  └ L300:580 (264 lines read)

● Read graph-signals.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts
  └ L319:620 (301 lines read)

● Read community-detection.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts
  └ L320:620 (269 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L700:1060 (360 lines read)

● Read graph-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
  └ L1:120 (42 lines read)

● Read post-insert.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
  └ L120:240 (75 lines read)

● Read graph-roadmap-finalization.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts
  └ L1:260 (217 lines read)

● Read typed-traversal.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts
  └ L380:460 (36 lines read)

● Read deterministic-extractor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts
  └ L1:260 (209 lines read)

● Read graph-lifecycle.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts
  └ L448:590 (143 lines read)

● Read graph-lifecycle.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts
  └ L1:320 (320 lines read)

● Search (grep)
  │ "applyCommunityBoost\(|detectCommunities\(|storeCommunityAssignments\(|community_assignments" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 90 lines found

● Search (grep)
  │ "created_by='auto'|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH|self-loop|sourceId ===
  │ targetId|rollbackWeights\(|oldest entry|same-millisecond"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
  └ 13 lines found

● Search (grep)
  │ "process.env.SPECKIT_COACTIVATION_STRENGTH|DEFAULT_COACTIVATION_STRENGTH|boostFactor"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts)
  └ 5 lines found

● Search (grep)
  │ "total_edges / total_memories|COUNT\(\*\).*memory_index|edge density|entity-linking|density
  │ threshold" (.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts)
  └ 4 lines found

I’m doing one last pass over `scripts/` now. Most of the graph work is clearly `mcp_server`-side, but I want to confirm whether any catalog entry wrongly implies a scripts implementation or misses one.

● Check scripts tree for feature-specific evidence (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ scripts = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts')…
  └ 141 lines...

● Re-scan scripts source excluding dist, node_modules, and tests (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ scripts = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts')…
  └ 74 lines...

● Read causal-edges.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ L700:780 (81 lines read)

● Read co-activation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
  └ L1:140 (140 lines read)

● Read edge-density.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts
  └ L1:220 (213 lines read)

● Read graph-signals.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts
  └ L1:260 (260 lines read)

● Read community-detection.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts
  └ L300:760 (415 lines read)

● Read graph-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "runPostMutationHooks|mutation-hooks|coactivationCacheCleared|graphSignalsCacheCleared"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
  └ 4 lines found

● Search (grep)
  │ "runPostMutationHooks" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 14 lines found

● Search (grep)
  │ "isGraphCalibrationProfileEnabled\(|applyCalibrationProfile\(|SPECKIT_CALIBRATION_PROFILE_NAME|l
  │ oadCalibrationProfile"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts)
  └ 6 lines found

● Search (grep)
  │ "SPECKIT_TYPED_TRAVERSAL|sparseModeActive|intentUsed|applyCausalBoost\("
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/intent-aware-traversal.vitest.ts)
  └ No matches found

● Search (grep)
  │ "SPECKIT_TYPED_TRAVERSAL|sparseModeActive|graphDensity|SPARSE_DENSITY_THRESHOLD|applyCausalBoost
  │ \(" (.opencode/skill/system-spec-kit/mcp_server/tests/sparse-first-graph.vitest.ts)
  └ 1 line found

● Read causal-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ L320:620 (301 lines read)

● Search (grep)
  │ "graphDensity|sparseModeActive|intentUsed|getNeighborBoosts|applyCausalBoost\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts)
  └ 20 lines found

● Read sparse-first-graph.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/sparse-first-graph.vitest.ts
  └ L1:220 (31 lines read)

● Read intent-aware-traversal.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/intent-aware-traversal.vitest.ts
  └ L1:220 (84 lines read)

● Search (grep)
  │ "applyCausalBoost\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 13 lines found

● Search (grep)
  │ "measureEdgeDensity\(|edgeDensity|densityThreshold|skippedByDensityGuard" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 68 lines found

01-typed-weighted-degree-channel.md | PARTIAL | P2: Core feature exists in `mcp_server/lib/search/graph-search-fn.ts` with typed weights, log normalization, caps, constitutional exclusion, and db-scoped cache. Mismatch: doc names `MAX_TYPED_DEGREE=15`, but code exports `DEFAULT_MAX_TYPED_DEGREE=15`; the actual flag owner is `mcp_server/lib/search/search-flags.ts`, not the doc’s listed source set. No scripts-side implementation found.

02-co-activation-boost-strength-increase.md | ALIGNED | `mcp_server/lib/cognitive/co-activation.ts` sets `DEFAULT_COACTIVATION_STRENGTH = 0.25` and reads `SPECKIT_COACTIVATION_STRENGTH`; covered by `mcp_server/tests/co-activation.vitest.ts`. No scripts-side implementation found.

03-edge-density-measurement.md | ALIGNED | `mcp_server/lib/eval/edge-density.ts` uses `edgeCount / totalMemories` with node-count fallback, and entity-linking density guards are present in `mcp_server/lib/search/entity-linker.ts`; covered by `mcp_server/tests/edge-density.vitest.ts`. No scripts-side implementation found.

04-weight-history-audit-tracking.md | ALIGNED | `mcp_server/lib/storage/causal-edges.ts` has `created_by`, `last_accessed`, `weight_history`, auto-edge caps (`MAX_EDGES_PER_NODE = 20`, `MAX_AUTO_STRENGTH = 0.5`), and `rollbackWeights()` fallback logic; covered by `mcp_server/tests/causal-edges*.vitest.ts`. No scripts-side implementation found.

05-graph-momentum-scoring.md | ALIGNED | `mcp_server/lib/graph/graph-signals.ts` implements `degree_snapshots`, `snapshotDegrees()`, `computeMomentum()`, `computeMomentumScores()`, cache invalidation, and +0.05 cap via `applyGraphSignals()`; covered by `mcp_server/tests/graph-signals.vitest.ts`. No scripts-side implementation found.

06-causal-depth-signal.md | ALIGNED | `mcp_server/lib/graph/graph-signals.ts` computes SCC-condensed longest-path depth via `computeCausalDepthScores()` and applies the bounded additive bonus in `applyGraphSignals()`; covered by `mcp_server/tests/graph-signals.vitest.ts`. No scripts-side implementation found.

07-community-detection.md | ALIGNED | `mcp_server/lib/graph/community-detection.ts` implements BFS components, Louvain escalation, persistence in `community_assignments`, and Stage 2 injection via `applyCommunityBoost()`; tests exist in `mcp_server/tests/community-detection.vitest.ts`. No scripts-side implementation found.

08-graph-and-cognitive-memory-fixes.md | PARTIAL | P2: Most fixes are real (`sourceId === targetId` rejection, `maxDepth` clamping, orphan cleanup, WM clamping). Mismatches: community debounce is now stronger than documented (`count:maxId:minId:checksum`, not just `count:maxId`), and co-activation cache clearing happens through `handlers/mutation-hooks.ts` invoked by `memory-bulk-delete.ts`, not directly in `memory-bulk-delete.ts`. No scripts-side implementation found.

09-anchor-tags-as-graph-nodes.md | ALIGNED | Correctly marked deferred/not implemented. `mcp_server/lib/chunking/anchor-chunker.ts` and `mcp_server/lib/search/anchor-metadata.ts` only parse/chunk/annotate anchors; they do not promote anchors into graph nodes. Scripts has adjacent anchor tooling, but no graph-node promotion.

10-causal-neighbor-boost-and-injection.md | ALIGNED | `mcp_server/lib/search/causal-boost.ts` implements 25%/max-5 seeding, 2-hop traversal, relation multipliers, and `MAX_COMBINED_BOOST = 0.20`; wired in `mcp_server/lib/search/pipeline/stage2-fusion.ts` and covered by tests. Scripts only has benchmark references.

11-temporal-contiguity-layer.md | ALIGNED | `mcp_server/lib/cognitive/temporal-contiguity.ts` implements pairwise boost, clamped window, `MAX_TOTAL_BOOST = 0.5`, `getTemporalNeighbors()`, and `buildTimeline()`; it is wired into Stage 1 via `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`. No scripts-side implementation found.

12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md | ALIGNED | Deterministic ranking is enforced by `ranking-contract.ts`; graph trace metadata is emitted from `stage2-fusion.ts`; rollback gate is `SPECKIT_GRAPH_UNIFIED` via `graph-flags.ts`, with supporting tests including `graph-roadmap-finalization.vitest.ts` and `graph-regression-flag-off.vitest.ts`. No scripts-side implementation found.

13-graph-lifecycle-refresh.md | ALIGNED | `mcp_server/lib/search/graph-lifecycle.ts` implements dirty-node tracking, `write_local`/`scheduled` refresh modes, local threshold `50`, edge limit `500`, and `post-insert.ts` wiring; covered by `mcp_server/tests/graph-lifecycle.vitest.ts`. No scripts-side implementation found.

14-llm-graph-backfill.md | ALIGNED | `mcp_server/lib/search/graph-lifecycle.ts` plus `search-flags.ts` implement `SPECKIT_LLM_GRAPH_BACKFILL`, high-value gating, and async scheduling; `handlers/save/post-insert.ts` logs scheduled backfill. No scripts-side implementation found.

15-graph-calibration-profiles.md | ALIGNED | `mcp_server/lib/search/graph-calibration.ts` defines the documented default/aggressive profiles, caps, Louvain thresholds, `applyCalibrationProfile()`, and MRR/NDCG ablation helpers; runtime wiring is in `stage2-fusion.ts`. Scripts has adjacent eval runners (`scripts/evals/run-ablation.ts`), but the documented runtime feature matches.

16-typed-traversal.md | MISALIGNED | P1: Helper code exists in `mcp_server/lib/search/causal-boost.ts`, but the documented live behavior is not fully wired. `stage2-fusion.ts` calls `applyCausalBoost(results)` without `graphDensity` or classified `intent`, so sparse-first suppression and classified-intent traversal are not active in runtime; `mcp_server/tests/sparse-first-graph.vitest.ts` is entirely skipped and explicitly says spec-ahead-of-implementation.

SUMMARY: total=16 aligned=13 partial=2 misaligned=1 P0=0 P1=1 P2=2

