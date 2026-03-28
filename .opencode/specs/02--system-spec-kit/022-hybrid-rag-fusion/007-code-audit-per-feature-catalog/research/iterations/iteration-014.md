● skill(sk-code--review)

I’m loading the review context and setting up a small audit plan first, then I’ll verify the catalog references against the actual MCP server files.

✗ memory_match_triggers
  └ Permission denied and could not request permission from user

✗ Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep audit of Spec Kit Memory MCP server
  │ feature catalog traceability. Verify FEATURE_CATALOG.md sections 2-21 source file references
  │ against .opencode/skill/system-spec-kit/mcp_server code and child spec.md audit findings, check
  │ orphaned source files and 32 unreferenced files." --threshold 0.8
  └ Permission denied and could not request permission from user

✗ Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/c5967920-b53b-4d39-b2a9-c197873e2040/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read review guidance, feature catalog, and relevant child specs.…
  └ Permission denied and could not request permission from user

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ L1:220 (98 lines read)

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ L1:220 (162 lines read)

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ L1:220 (206 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:320 (190 lines read)

● Search (grep)
  │ "AUDIT FINDINGS|MISMATCH|F11|F15|F21|F23" in **/spec.md (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (glob)
  │ "**/spec.md" in .opencode/skill/system-spec-kit
  └ 87 files found

I’ve loaded the review rubric and the catalog. Next I’m mapping the catalog’s section files to the actual `mcp_server` tree, then I’ll cross-check the five previously flagged mismatches.

● List directory .opencode/skill/system-spec-kit/mcp_server
  └ 34 files found

● List directory .opencode/skill/system-spec-kit/feature_catalog
  └ 24 files found

● Search (grep)
  │ "^## (2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21)\."
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 20 lines found

● Search (glob)
  │ "**/*.md" in .opencode/skill/system-spec-kit/feature_catalog
  └ 5 files found

● Search (grep)
  │ "5 MISMATCH|shadow scoring|graph calibration|fusion policy shadow|assistive
  │ reconsolidation|catalog references|AUDIT FINDINGS" in **/spec.md
  └ 5 lines found

● Search (grep)
  │ "catalog references" in **/*.{md,ts,js,json}
  └ 5 lines found

● Search (grep)
  │ "shadow scoring" in **/*.{md,ts,js,json}
  └ 5 lines found

● Search (grep)
  │ "graph calibration" in **/*.{md,ts,js,json}
  └ 5 lines found

● Search (grep)
  │ "fusion policy shadow" in **/*.{md,ts,js,json}
  └ 23 lines found

● Search (grep)
  │ "assistive reconsolidation" in **/*.{md,ts,js,json}
  └ 5 lines found

● Search (grep)
  │ "32 unreferenced files|unreferenced files identified|gap analysis" in **/*.{md,ts,js,json}
  └ 5 lines found

I found the prior re-audit notes that mention the same five mismatches. I’m delegating one pass to a code-exploration agent to enumerate references and orphans while I verify the critical mismatches directly.

● Explore Mapping catalog refs
  │ List first 5 category folders (shell)
  │   │ ls -d /Users/michelkerkmeester/MEGA/Development/Opencode\
  │   │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/0* | head -5
  │   └ 6 lines...
  └ List first 5 of remaining category folders (shell)
      │ ls -d /Users/michelkerkmeester/MEGA/Development/Opencode\
      │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/1* | head -5
      └ 6 lines...

● List directory .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts
  └ 18 files found

● Read deep-review-strategy.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/scr
  │ atch/deep-review-strategy.md
  └ L128:170 (43 lines read)

● Search (grep)
  │ "32 unreferenced files|unreferenced files" in **/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog)
  └ 5 lines found

● List directory .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation
  └ 16 files found

● List directory .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration
  └ 22 files found

● List directory .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing
  └ 24 files found

● Read 18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-r
  │ anking-bounded-proposals-and-rollback.md
  └ L1:260 (55 lines read)

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ L1:260 (56 lines read)

● Read 15-graph-calibration-profiles.md
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/15-graph-calibration
  │ -profiles.md
  └ L1:260 (47 lines read)

● Read 21-assistive-reconsolidation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/21-assistive-rec
  │ onsolidation.md
  └ L1:260 (55 lines read)

● Search (grep)
  │ "unreferenced|orphan|32/286|zero mentions|session-manager 85%" in **/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog)
  └ 5 lines found

I’ve confirmed two of the disputed child docs already contain strong self-contradictory clues: `assistive-reconsolidation` explicitly says “shadow-archive (not merge),” and the “feature catalog code references” doc leans on representative files rather than proving broad coverage. I’m now checking the live source to see whether those claims are actually wired.

● Read adaptive-ranking.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "adaptive-ranking|adaptive ranking|SPECKIT_MEMORY_ADAPTIVE_RANKING|shadow proposal|proposal
  │ delta" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read graph-calibration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "applyCalibrationProfile|isGraphCalibrationProfileEnabled|SPECKIT_GRAPH_CALIBRATION_PROFILE|SPEC
  │ KIT_CALIBRATION_PROFILE_NAME" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read reconsolidation-bridge.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
  └ L330:410 (81 lines read)

● Search (grep)
  │ "Feature catalog:|MODULE:" in {mcp_server,shared,scripts}/**/*.ts
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "getAdaptiveMode\(|recordAdaptiveSignal\(|summarizeAdaptiveSignals\(|tuneAdaptiveThresholds\(|lo
  │ adAdaptiveShadowProposal\(|persistAdaptiveShadowRun\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "applyCalibrationProfile\(|shouldActivateLouvain\(|runAblation\(|getCalibrationProfile\(" in
  │ **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_GRAPH_CALIBRATION_PROFILE|SPECKIT_CALIBRATION_PROFILE_NAME" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_MEMORY_ADAPTIVE_RANKING|SPECKIT_MEMORY_ADAPTIVE_MODE|adaptiveShadowProposal|shadowPropo
  │ sal" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 124 lines found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:240 (240 lines read)

● Search (grep)
  │ "buildAdaptiveShadowProposal|getAdaptiveMode|persistAdaptiveShadowRun|recordAdaptiveSignal"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts)
  └ 23 lines found

● Search (grep)
  │ "graph calibration|Graph
  │ calibration|isGraphCalibrationProfileEnabled|getCalibrationProfile|applyCalibrationProfile"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 12 lines found

● Search (grep)
  │ "buildAdaptiveShadowProposal"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 19 lines found

● Search (grep)
  │ "Feature catalog:" (.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts)
  └ 1 line found

● Search (grep)
  │ "Feature catalog:" (.opencode/skill/system-spec-kit/shared/trigger-extractor.ts)
  └ 1 line found

● Search (grep)
  │ "MODULE:" (.opencode/skill/system-spec-kit/scripts/utils/workspace-identity.ts)
  └ 1 line found

● Read graph-calibration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts
  └ L260:420 (160 lines read)

● Search (grep)
  │ "applyCalibrationProfile\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 39 lines found

● Search (grep)
  │ "getCalibrationProfile\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "shouldActivateLouvain\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 106 lines found

● Search (grep)
  │ "runAblation\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L360:390 (30 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L740:770 (31 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L248:290 (43 lines read)

● Read adaptive-ranking.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts
  └ L488:560 (73 lines read)

● Read graph-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts
  └ L500:550 (51 lines read)

● Read adaptive-ranking.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts
  └ L80:130 (51 lines read)

● Search (grep)
  │ "adaptive|shadow" (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 5 lines found

● Search (grep)
  │ "adaptive|shadow" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 18 lines found

● Search (grep)
  │ "adaptive|shadow" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 48 lines found

● Search (grep)
  │ "reconsolidation|assistive"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts)
  └ 63 lines found

● Search (grep)
  │ "Feature catalog:" (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts)
  └ 2 lines found

● Search (grep)
  │ "Feature catalog:"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts)
  └ 1 line found

● Search (grep)
  │ "Feature catalog:|MODULE:|feature catalog"
  │ (.opencode/skill/system-spec-kit/mcp_server/README.md)
  └ No matches found

● Read verify_alignment_drift.py
  │ .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py
  └ L1:240 (239 lines read)

● Search (grep)
  │ "Feature catalog:|MODULE:|feature catalog" (.opencode/skill/system-spec-kit/README.md)
  └ 5 lines found

● Search (grep)
  │ "Feature catalog:" (.opencode/skill/system-spec-kit/scripts/utils/workspace-identity.ts)
  └ No matches found

● Search (grep)
  │ "Feature catalog:" (.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts)
  └ 1 line found

● Search (grep)
  │ "Feature catalog:" (.opencode/skill/system-spec-kit/shared/trigger-extractor.ts)
  └ 1 line found

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L1:80 (80 lines read)

● Search (grep)
  │ "MODULE:|header" (.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py)
  └ 21 lines found

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ L1:40 (40 lines read)

● Read workspace-identity.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/workspace-identity.ts
  └ L1:30 (30 lines read)

● Search (grep)
  │ "Feature catalog:" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

● Search (grep)
  │ "Feature catalog:" in **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ 9 files found

● Search (grep)
  │ "session-manager.ts|history.ts|graph-calibration.ts|adaptive-ranking.ts|reconsolidation-bridge.t
  │ s" in **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 5 lines found

● Search (grep)
  │ "32/286 source files unreferenced by any audit phase|4 modules with zero mentions|zero
  │ mentions|unaudited|orphaned source file|unreferenced source file" in **/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_GRAPH_CALIBRATION_PROFILE|graph-calibration|Graph calibration profiles and community
  │ thresholds" in **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 71 lines found

● Search (grep)
  │ "Feature catalog code references|191|257|74%|verify_alignment_drift" in **/*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 62 lines found

I found a concrete documentation bug: the main catalog says feature-catalog annotations exist in “every source file,” but the child doc immediately downgrades that to ~74%, and its cited verifier only checks `MODULE:` headers. I’m now waiting on the exploration pass for the broader orphan/unreferenced-file inventory so I can finish with evidence instead of guesses.

● Read (Explore agent — Mapping catalog refs)
  └ Running

● Read gpt54-cross-cutting.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019
  │ -decisions-and-deferrals/scratch/reaudit-2026-03-23/gpt54-cross-cutting.md
  └ L1:110 (80 lines read)

● Search (grep)
  │ "history\.ts|session-manager\.ts|workspace-identity\.ts|adaptive-ranking\.ts|graph-calibration\.
  │ ts|reconsolidation-bridge\.ts" in **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 5 lines found

● Search (glob)
  │ "**/history.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ 1 file found

● Search (glob)
  │ "**/session-manager.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ 1 file found

● Search (glob)
  │ "**/*workspace-identity.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (grep)
  │ "zero mentions|unreferenced|orphan|history.ts|session-manager"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/01
  │ 9-decisions-and-deferrals/scratch/reaudit-2026-03-23/gpt54-cross-cutting.md)
  └ 23 lines found

The exploration pass finished. I’m pulling its results now and then I’ll synthesize them with the direct source checks I already have.

● Read (Explore agent — Mapping catalog refs)
  └ idle

The exploration result overreached and contradicted direct source reads, so I’m not treating it as authoritative. I’m doing a final targeted pass on the specific under-documented files (`history.ts`, `session-manager.ts`) and then I’ll give you a findings-only audit backed by lines from the actual code and catalog.

● Read session-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts
  └ L1:180 (180 lines read)

● Search (grep)
  │ "history\.ts" in **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 39 lines found

● Search (grep)
  │ "session-manager\.ts" in **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 53 lines found

● Read history.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
  └ L1:200 (200 lines read)

● Read 01-memory-indexing-memorysave.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
  └ L1:140 (85 lines read)

● Read 02-memory-metadata-update-memoryupdate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupd
  │ ate.md
  └ L1:120 (64 lines read)

● Read 02-2-session-and-cache.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cach
  │ e.md
  └ L18:28 (11 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3858:3869 (11 lines read)

● Search (grep)
  │ "Feature catalog:" in **/*.ts (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Read 11-session-recovery-memory-continue.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-continu
  │ e.md
  └ L56:64 (8 lines read)

● Read 09-session-manager-transaction-gap-fixes.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/09-session-mana
  │ ger-transaction-gap-fixes.md
  └ L16:32 (17 lines read)

● Read 10-per-memory-history-log.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md
  └ L18:34 (17 lines read)

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ L16:43 (27 lines read)

● Search (grep)
  │ "function enforceEntryLimit|enforceEntryLimit\(|DELETE FROM session_sent_memories|ORDER BY
  │ sent_at ASC" (.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
  └ 67 lines found

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/README.md
  └ L1:140 (140 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L1:120 (119 lines read)

## Summary

- **P0:** 0
- **P1:** 2
- **P2:** 2
- **Files reviewed:** 24 direct file reads plus targeted catalog/code searches across `feature_catalog/` and `mcp_server/`
- **Dimensions covered:** correctness, security, traceability, maintainability
- **Primary conclusion:** the biggest live traceability issue is **catalog self-contradiction around code-reference coverage**; several March 23 re-audit mismatch claims are **stale on current HEAD**.

## Findings

### P1-001 [P1] Section 16 overstates universal `Feature catalog:` coverage and cites a verifier that does not enforce it

- **Evidence:** `feature_catalog/FEATURE_CATALOG.md:3862-3866` says “every source file” carries `// Feature catalog:` comments. The child spec downgrades this to **~74%** coverage: `feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md:18-22`. The cited verifier only checks `MODULE:` headers, not feature annotations: `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py:266-274`. A representative script file has a `MODULE:` header but no `Feature catalog:` tag: `scripts/utils/workspace-identity.ts:1-4`.
- **Impact:** operators and auditors cannot rely on grep-based feature tracing as a complete inventory; the catalog currently presents partial coverage as universal coverage.
- **Fix recommendation:** change the main catalog wording to match the measured partial-coverage claim, or add enforcement for `// Feature catalog:` annotations if universal coverage is intended.

### P1-002 [P1] Section 21 still misdescribes `SESSION_MAX_ENTRIES` behavior

- **Evidence:** `feature_catalog/FEATURE_CATALOG.md:4511` says entries beyond the cap “are not tracked.” The child flag reference says the opposite: `feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md:24` documents **LRU eviction**. Code confirms eviction of oldest rows via `DELETE ... ORDER BY sent_at ASC LIMIT ?`: `mcp_server/lib/session/session-manager.ts:610-628`.
- **Impact:** debugging session dedup behavior from the top-level catalog will be wrong; readers may expect silent overflow dropping instead of eviction churn.
- **Fix recommendation:** align the top-level feature-flag row with the child spec and code: oldest tracked entries are evicted when the cap is exceeded.

### P2-001 [P2] The “32 unreferenced files” gap-analysis claim is stale for at least the named `history.ts` examples

- **Evidence:** the audit strategy still reports `32/286` unreferenced files: `.../scratch/deep-review-strategy.md:137-142`. Cross-cutting notes specifically say `history.ts` must be added to mutation/lifecycle features: `.../gpt54-cross-cutting.md:22,33,65`. On current HEAD, `history.ts` is already referenced in multiple catalog entries, including `02--mutation/01-memory-indexing-memorysave.md:67`, `02--mutation/02-memory-metadata-update-memoryupdate.md:46`, and `02--mutation/10-per-memory-history-log.md:20,30`.
- **Impact:** the old gap-analysis should not be reused as current evidence without a fresh recount.
- **Fix recommendation:** rerun the orphan/unreferenced-file inventory against current HEAD before carrying the “32 files” number forward.

### P2-002 [P2] The March 23 claim that graph calibration is “never wired into Stage 2” is not reproducible on current HEAD

- **Evidence:** the re-audit notes mark 010/F15 as a mismatch: `.../scratch/deep-review-strategy.md:135` and `.../gpt54-cross-cutting.md:19,50`. Current child catalog says Stage 2 applies calibration: `feature_catalog/10--graph-signal-activation/15-graph-calibration-profiles.md:18-22`. Code matches: `mcp_server/lib/search/pipeline/stage2-fusion.ts:253-279` calls `applyCalibrationProfile(...)`; the flag accessor exists at `mcp_server/lib/search/search-flags.ts:368-375`; the implementation is live at `mcp_server/lib/search/graph-calibration.ts:405-415`; tests cover the enabled path at `mcp_server/tests/graph-calibration.vitest.ts:516-529`.
- **Impact:** this is a stale false positive in the re-audit trail and can misdirect remediation work.
- **Fix recommendation:** downgrade/remove the 010/F15 mismatch unless it was scoped to an older commit.

## Cross-references checked

- `16--tooling-and-scripts/11-feature-catalog-code-references.md` ↔ `verify_alignment_drift.py`, `handlers/index.ts`, `shared/trigger-extractor.ts`, `scripts/utils/workspace-identity.ts`
- `19--feature-flag-reference/02-2-session-and-cache.md` ↔ `lib/session/session-manager.ts`
- Mutation history references ↔ `lib/storage/history.ts`
- Session recovery / transaction-gap child docs ↔ `lib/session/session-manager.ts`
- Graph calibration child doc ↔ `stage2-fusion.ts`, `graph-calibration.ts`, `search-flags.ts`, `graph-calibration.vitest.ts`

## Dimension-specific notes

- **Correctness:** the March 23 mismatch list is partly stale on current HEAD. Graph calibration is wired; assistive reconsolidation now explicitly documents “shadow-archive, not merge” in `13--memory-quality-and-indexing/21-assistive-reconsolidation.md:8,20-29`, matching `handlers/save/reconsolidation-bridge.ts:334-377`.
- **Security:** no security-critical traceability break surfaced in this pass.
- **Traceability:** the main problem is **catalog drift between top-level and child entries**, especially where broad claims are only backed by representative files.
- **Maintainability:** representative source files are useful examples, but they are not sufficient proof for repo-wide percentage or “every file” claims.

