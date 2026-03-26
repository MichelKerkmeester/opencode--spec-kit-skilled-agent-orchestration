● skill(sk-code--review)

I’m gathering the audit targets and maintainability signals first, then I’ll verify the claimed mismatches against source and test conventions.

✗ memory_match_triggers
  └ Permission denied and could not request permission from user

✗ Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep audit of Spec Kit Memory MCP server
  │ feature catalog maintainability findings, verifying mismatches 009/F11, 010/F15, 011/F23,
  │ 013/F21, 016/F11 and TypeScript/test/documentation alignment" --threshold 0.8
  └ Permission denied and could not request permission from user

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ 1 line read

● Search (grep)
  │ "F11|F15|F21|F23|shadow scoring|graph calibration|fusion policy shadow|assistive
  │ reconsolidation|catalog references|AUDIT FINDINGS" in **/spec.md
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ 60 lines read

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/mcp_server/tsconfig.json
  └ 28 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/spec.md"
  └ 87 files found

I found the server config surface; next I’m tracing the child specs and the exact source files behind the five reported mismatches.

✗ Read eslint.config.js
  │ .opencode/skill/system-spec-kit/mcp_server/eslint.config.js
  └ Path does not exist

● Search (grep)
  │ "shadow scoring|graph calibration|fusion policy shadow|assistive reconsolidation|catalog
  │ references|F11|F15|F21|F23|AUDIT FINDINGS" in **/spec.md (.opencode/specs)
  └ 5 lines found

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/tsconfig.json
  └ 23 lines read

● Search (glob)
  │ ".opencode/specs/**/{009*,010*,011*,013*,016*}/spec.md"
  └ 45 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/**/*"
  └ 5 files found

● Search (grep)
  │ "AUDIT FINDINGS|F11|F15|F21|F23|shadow scoring|graph calibration|fusion policy shadow|assistive
  │ reconsolidation|catalog references" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/0
  │ 07-code-audit-per-feature-catalog/009-evaluation-and-measurement/spec.md)
  └ 4 lines found

● Search (grep)
  │ "AUDIT FINDINGS|F11|F15|F21|F23|shadow scoring|graph calibration|fusion policy shadow|assistive
  │ reconsolidation|catalog references" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/0
  │ 07-code-audit-per-feature-catalog/010-graph-signal-activation/spec.md)
  └ 5 lines found

● Search (grep)
  │ "AUDIT FINDINGS|F11|F15|F21|F23|shadow scoring|graph calibration|fusion policy shadow|assistive
  │ reconsolidation|catalog references" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/0
  │ 07-code-audit-per-feature-catalog/011-scoring-and-calibration/spec.md)
  └ 4 lines found

● Search (grep)
  │ "AUDIT FINDINGS|AUDIT FINDINGS|F11|F15|F21|F23|shadow scoring|graph calibration|fusion policy
  │ shadow|assistive reconsolidation|catalog references" (.opencode/specs/02--system-spec-kit/022-hy
  │ brid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/spec.md)
  └ 7 lines found

● Search (grep)
  │ "AUDIT FINDINGS|F11|F15|F21|F23|shadow scoring|graph calibration|fusion policy shadow|assistive
  │ reconsolidation|catalog references" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/0
  │ 07-code-audit-per-feature-catalog/016-tooling-and-scripts/spec.md)
  └ 4 lines found

✗ search shadow scoring feature implementation or related code in Spec Kit Memory MCP server
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "shadow scoring|graph calibration|fusion policy shadow|assistive reconsolidation|feature catalog
  │ code references|F11|F15|F21|F23"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

✗ search graph calibration stage 2 pipeline deprecated but implemented not wired feature in Spec Ki…
  └ Permission denied and could not request permission from user

✗ search assistive reconsolidation implementation or memory reconsolidation in Spec Kit Memory MCP …
  └ Permission denied and could not request permission from user

✗ search feature catalog code references comment conventions module map feature catalog in system-s…
  └ Permission denied and could not request permission from user

The catalog already exposes one likely mismatch: it claims assistive reconsolidation is “Default ON,” while the feature section text says it’s default OFF. I’m now pinning that against code and the child specs.

● Search (grep)
  │ "\.test\.ts$|\.spec\.ts$" in **/* (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ No matches found

● Search (grep)
  │ "runShadowScoring|logShadowComparison|shadow scoring|shadow-feedback|shadow
  │ feedback|holdout|promotion gate|kendall|ndcg|mrr" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "graph calibration|Graph calibration|@deprecated|deprecated|Stage 2|stage 2|calibration" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "assistive reconsolidation|reconsolidation|SPECKIT_ASSISTIVE_RECONSOLIDATION|auto-merge|keep-sep
  │ arate|supersede|complement" in **/*.{ts,md,json} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "Feature catalog:|MODULE:" in **/*.{ts,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "runShadowScoring|logShadowComparison|compareRankings|kendall|ndcg|mrr" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 22 files found

● Search (grep)
  │ "SPECKIT_ASSISTIVE_RECONSOLIDATION|reconsolidation-bridge|similarity >= 0\.96|0\.88|auto-merge"
  │ in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 28 files found

● Search (grep)
  │ "@deprecated" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 1 file found

● Search (grep)
  │ "Feature catalog:|MODULE:" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/**/*{shadow,calibration,reconsolidation,contiguity,f
  │ srs,feature*catalog*,MODULE_MAP,ARCHITECTURE}*"
  └ 21 files found

● Search (grep)
  │ "runShadowScoring|logShadowComparison|return null|return false|SPECKIT_SHADOW_FEEDBACK"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts)
  └ 5 lines found

● Search (grep)
  │ "@deprecated|never wired|Stage 2|graph
  │ calibration|calibrateGraphScores|applyGraphCalibration|SPECKIT_GRAPH_CALIBRATION"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts)
  └ 5 lines found

● Search (grep)
  │ "@deprecated|Never wired|Superseded by FSRS v4 decay|temporal contiguity|contiguity"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts)
  └ 7 lines found

● Search (grep)
  │ "SPECKIT_ASSISTIVE_RECONSOLIDATION|auto-merge|keep-separate|review|supersede|complement|enableAs
  │ sistiveReconsolidation"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts)
  └ 29 lines found

● Search (grep)
  │ "applyHybridDecayPolicy|export \{|hybrid decay"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts)
  └ 6 lines found

● Read MODULE_MAP.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md
  └ 1 line read

● Search (grep)
  │ "applyGraphCalibration|calibrateGraphScores|graph-calibration" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "applyTemporalContiguity|temporal-contiguity|buildTimeline|getTemporalNeighbors" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 18 lines found

● Read copilot-tool-output-1774387306642-ju8b7q.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774387306642-ju8b7q.txt
  └ L1:120 (94 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/**/ARCHITECTURE.md"
  └ No matches found

I’ve confirmed two important review leads: `graph-calibration` is actually wired into Stage 2 now, and the feature-catalog-reference feature page already says coverage is only a “measured majority,” not universal. I’m reading the exact source/docs next to separate real mismatches from stale audit claims.

● Read MODULE_MAP.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md
  └ 1 line read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016
  │ -tooling-and-scripts/spec.md
  └ L145:190 (46 lines read)

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ 56 lines read

● Read 15-module-boundary-map.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.m
  │ d
  └ 58 lines read

● Search (grep)
  │ "ARCHITECTURE\.md" in **/* (.opencode/skill/system-spec-kit)
  └ 14 files found

● Read graph-calibration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts
  └ L1:220 (220 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L60:290 (231 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ L230:390 (161 lines read)

● Read reconsolidation-bridge.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
  └ L1:180 (180 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/ARCHITECTURE.md"
  └ 1 file found

● Search (grep)
  │ "# .*graph calibration|graph calibration|SPECKIT_GRAPH_CALIBRATION_PROFILE" in **/*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 3 files found

● Search (grep)
  │ "# .*shadow scoring|shadow scoring|Adaptive shadow ranking|SPECKIT_SHADOW_FEEDBACK" in **/*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 7 files found

● Search (grep)
  │ "# .*assistive reconsolidation|Assistive reconsolidation|SPECKIT_ASSISTIVE_RECONSOLIDATION" in
  │ **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 4 files found

● Search (grep)
  │ "# .*hybrid decay policy|Hybrid decay policy|applyHybridDecayPolicy" in **/*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 3 files found

● Search (grep)
  │ "# .*module boundary map|Module boundary map|ARCHITECTURE.md" in **/*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 13 lines found

I’m not seeing naming or type-system red flags so far; the maintainability risk is clustering around stale or internally contradictory documentation, especially where the audit marked things as “MATCH.”

● Read 20-shadow-feedback-holdout-evaluation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/20-shadow-feedback-h
  │ oldout-evaluation.md
  └ 47 lines read

● Read 15-graph-calibration-profiles.md
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/15-graph-calibration
  │ -profiles.md
  └ 47 lines read

● Read 21-assistive-reconsolidation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/21-assistive-rec
  │ onsolidation.md
  └ 55 lines read

● Read 23-hybrid-decay-policy.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/23-hybrid-decay-
  │ policy.md
  └ 53 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/index.ts
  └ 111 lines read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011
  │ -scoring-and-calibration/spec.md
  └ L180:230 (51 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010
  │ -graph-signal-activation/spec.md
  └ L174:220 (47 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013
  │ -memory-quality-and-indexing/spec.md
  └ L184:235 (52 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts
  └ L1:260 (260 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:220 (220 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L220:360 (141 lines read)

● Read temporal-contiguity.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
  └ L1:220 (182 lines read)

● Read graph-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts
  └ L1:220 (220 lines read)

● Read assistive-reconsolidation.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts
  └ L1:220 (220 lines read)

● Read ARCHITECTURE.md
  │ .opencode/skill/system-spec-kit/ARCHITECTURE.md
  └ L1:220 (220 lines read)

I’ve got enough evidence now to distinguish “stale audit claim” from “real maintainability problem.” One big theme is naming/documentation drift: similarly named shadow-scoring features and contradictory default-state comments are making the catalog easy to mis-audit.

● Read 03-observer-effect-mitigation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effec
  │ t-mitigation.md
  └ 53 lines read

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1238:1260 (23 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L2210:2235 (25 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L2926:2942 (17 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L4386:4396 (11 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L770:782 (13 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:80 (79 lines read)

● Search (grep)
  │ "isAssistiveReconsolidationEnabled"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 1 line found

● Read shadow-scoring-holdout.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts
  └ L1:120 (119 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
  └ L1:80 (80 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L474:490 (17 lines read)

● Read shadow-scoring.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts
  └ L230:390 (161 lines read)

● Read temporal-contiguity.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts
  └ L1:80 (80 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts
  └ L124:140 (16 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ L240:380 (140 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
  └ L20:70 (51 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3858:3868 (11 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3742:3754 (13 lines read)

● Read graph-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts
  └ L66:104 (39 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/index.ts
  └ L1:25 (25 lines read)

● Read 15-module-boundary-map.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.m
  │ d
  └ L15:35 (21 lines read)

● Search (grep)
  │ "28|26|Module Inventory|feedback/|spec/"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md)
  └ 2 lines found

● Search (grep)
  │ "\.vitest\.ts$" in **/* (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 1 file found

● Search (grep)
  │ "\.ts$" in **/* (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 11 files found

● Search (grep)
  │ "module\.exports|require\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 21 files found

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/tests/README.md
  └ L1:40 (39 lines read)

● Search (grep)
  │ "isGraphCalibrationProfileEnabled|SPECKIT_GRAPH_CALIBRATION_PROFILE"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 3 lines found

● Read MODULE_MAP.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md
  └ L1:80 (80 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/009
  │ -evaluation-and-measurement/spec.md
  └ L179:215 (37 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L372:395 (23 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/tests/README.md
  └ L35:40 (5 lines read)

● Search (grep)
  │ "^### `[^`]+/`$" (.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md)
  └ 1 file found

● Search (grep)
  │ "^### `" (.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md)
  └ 28 lines found

● Search (grep)
  │ "isGraphCalibrationProfileEnabled\(|isTemporalContiguityEnabled\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 2 lines found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010
  │ -graph-signal-activation/spec.md
  └ L188:201 (14 lines read)

✗ Memory stored testing practices
  └ The mcp_server test suite uses Vitest with `.vitest.ts` filenames; tests/README …

# Summary

- P0: 0
- P1: 3
- P2: 3
- Files reviewed: 34
- Dimension coverage: correctness, security, traceability, maintainability

This pass found several **audit inaccuracies and documentation drifts**, but no maintainability issue that rises to P0. The strongest problems are stale audit verdicts for live pipeline features and contradictory catalog/default-state documentation.

## Findings

### `R5-M1` — `P1` — 010/F11 incorrectly marks temporal contiguity as deprecated and unwired

- Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/spec.md:190,199-200`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28-30,41-42`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:181-186`; `.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:1-10,59-73`
- Impact: The audit says the feature is “never wired into production pipeline,” but Stage 1 imports and applies `vectorSearchWithContiguity`, the flag is default-on, and dedicated tests exist. That makes the audit verdict inaccurate and risks deprecating a live behavior.
- Fix recommendation: Change 010/F11 from `PARTIAL/@deprecated` to `MATCH` unless the implementation is intentionally being removed; if deprecation is intended, remove Stage 1 wiring, flag exposure, and tests first.

### `R5-M2` — `P1` — 010/F15 incorrectly marks graph calibration as deprecated and not in Stage 2

- Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/spec.md:194,199-200`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:67,776-778`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:371-374`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:75-103`
- Impact: The audit asserts graph calibration is “never wired into Stage 2,” but Stage 2 explicitly invokes `applyGraphCalibrationProfileToResults()` behind `isGraphCalibrationProfileEnabled()`, and tests assert the feature is graduated/default-on. This is a direct audit false positive.
- Fix recommendation: Reclassify 010/F15 to `MATCH`; separately clean up stale comments in `graph-calibration.ts` so future audits do not repeat this mistake.

### `R5-M3` — `P1` — 013/F21 missed an internal catalog contradiction on assistive reconsolidation defaults

- Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/spec.md:212`; `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2934,4391`; `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/21-assistive-reconsolidation.md:20-30`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:69-75`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:479-485`; `.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:22-25`
- Impact: The child audit marked F21 as `MATCH`, but the main catalog says “Default OFF” while the flag table, leaf page, runtime accessor, and tests all say default-on/graduated. That is a real catalog inconsistency with operational consequences.
- Fix recommendation: Make the monolithic catalog and child page agree on the implemented default (`ON`), then re-audit 013/F21 against the corrected source of truth.

### `R5-M4` — `P2` — 016/F11 overstates feature-catalog traceability coverage as universal

- Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016-tooling-and-scripts/spec.md:162`; `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md:18-22`; `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:3862-3866`
- Impact: The audit says the convention is “verified across files,” but the feature page explicitly says coverage is only about `191/257` non-test TS files and “not yet universal.” This over-certifies traceability compliance and hides remaining annotation gaps.
- Fix recommendation: Downgrade 016/F11 to `PARTIAL`, or narrow the claim to `MODULE:` headers only.

### `R5-M5` — `P2` — `graph-calibration.ts` contains contradictory default-state comments

- Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:12,166-169`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:371-374`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:75-103`
- Impact: The file header says the feature is “default OFF,” but the canonical flag wiring and tests say default-on/graduated. This is exactly the kind of comment drift that causes bad audits.
- Fix recommendation: Remove or correct the stale line-12 comment and defer all default-state truth to `search-flags.ts`.

### `R5-M6` — `P2` — The monolithic module-boundary-map entry is stale on module count

- Evidence: `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:3746-3750`; `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md:17-18,27-33`; `.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:21-24,179,337`; `.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md` has 28 top-level `### \`...\`` entries
- Impact: The main catalog says `26` lib subdirectories, while the leaf page and the actual module map say `28` including `feedback/` and `spec/`. This is architecture-document drift and should have blocked a `MATCH`.
- Fix recommendation: Update the monolithic catalog to `28` and re-check any audit notes that cite the older count.

## Cross-references checked

- `lib/eval/shadow-scoring.ts` vs `lib/feedback/shadow-scoring.ts` vs catalog entries for observer-effect and holdout evaluation
- `lib/search/graph-calibration.ts` vs `lib/search/pipeline/stage2-fusion.ts` vs `search-flags.ts` vs `graph-calibration.vitest.ts`
- `lib/cognitive/temporal-contiguity.ts` vs `lib/search/pipeline/stage1-candidate-gen.ts` vs `search-flags.ts` vs `temporal-contiguity.vitest.ts`
- `handlers/save/reconsolidation-bridge.ts` vs `search-flags.ts` vs `assistive-reconsolidation.vitest.ts` vs monolithic/leaf catalog docs
- `lib/MODULE_MAP.md` vs `ARCHITECTURE.md` vs feature-catalog leaf/main entries
- `mcp_server/api/index.ts`, `tests/README.md`, `package.json`, and `tsconfig.json` for boundary/test/tooling compliance

## Dimension-specific notes

- Maintainability: TypeScript strict mode and package/module structure look aligned (`.opencode/skill/system-spec-kit/tsconfig.json:6`; `mcp_server/api/index.ts:4-6`). Sampled public APIs in reviewed files do have JSDoc; the dominant problem is **documentation drift**, not missing typing.
- Traceability: This is the weakest area. The monolithic catalog, leaf feature pages, and child audit specs are no longer fully synchronized.
- Correctness: The two biggest audit misses are pipeline wiring facts, not prose nuance: temporal contiguity and graph calibration are both live in the pipeline paths inspected.
- Security: No security-specific defect surfaced in this maintainability slice. Test naming/documentation also align with repo standards (`mcp_server/tests/README.md:37-39`).

