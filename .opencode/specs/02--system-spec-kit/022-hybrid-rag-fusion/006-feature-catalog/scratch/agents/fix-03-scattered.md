● skill(sk-doc)

I’m verifying each doc claim against the current `mcp_server` and `scripts` code first, then I’ll patch only the targeted catalog files and run a lightweight validation pass.

● Read quick_reference.md
  │ .agents/skills/sk-doc/references/global/quick_reference.md
  └ 392 lines read

● Read feature_catalog_creation.md
  │ .agents/skills/sk-doc/references/specific/feature_catalog_creation.md
  └ 203 lines read

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor and create session plan (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Fix specific feature catalog markdown
  │ inaccuracies by verifying claims against .opencode/skill/system-spec-kit/mcp_server and
  │ scripts, then editing the docs and showing the changes" --threshold 0.8 && mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/9110f89d-49b6-4a0e-996b-530fcaf63cd5' && cat
  │ > …
  └ 61 lines...

I’ve got the doc-writing guidance and started source verification. Next I’m reading the seven target files alongside the exact implementation/test files that drive each correction so the edits stay narrowly grounded.

✗ Search (grep)
  │ "export function is[A-Za-z0-9_]+"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search-flags.ts)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search-flags.ts: IO error for
    operation on /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search-flags.ts: No such file or
    directory (os error 2)

● Read 02-feature-flag-sunset-audit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
  └ 38 lines read

● Read 02-relative-score-fusion-in-shadow-mode.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-
  │ in-shadow-mode.md
  └ 48 lines read

● Read 16-typed-traversal.md
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/16-typed-traversal.m
  │ d
  └ 51 lines read

● Read 13-scoring-and-fusion-corrections.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusio
  │ n-corrections.md
  └ 73 lines read

● Read 03-checkpoint-restore-checkpointrestore.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointre
  │ store.md
  └ 150 lines read

● Read 05-quality-proxy-formula.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-
  │ formula.md
  └ 54 lines read

● Read 08-mathmax-min-stack-overflow-elimination.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-
  │ stack-overflow-elimination.md
  └ 78 lines read

● Search (grep)
  │ "RSF|relative score fusion|fuseResultsRsf|shadow mode" in *.{ts,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "typed traversal|spec-ahead-of-implementation|describe\.skip|it\.skip|skip\(" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "fuseResultsMulti|fuseResultsCrossVariant|fuseResultsRsfMulti|fuseResultsRsfCrossVariant" in
  │ *.ts (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "clearExisting|rollback|restoreCheckpoint|CheckpointRestore" in *.ts
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "quality proxy|correlat|ground-truth|manual assessment" in *.{ts,md,py}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "Math\.(max|min)\((\.\.\.)" in *.{ts,js} (.opencode/skill/system-spec-kit)
  └ 22 lines found

I found the target docs. A couple of repo-wide searches were too broad, so I’m narrowing to the exact implementation files now to pin each wording change to a concrete source line.

● Search (grep)
  │ "fuseResultsMulti|fuseResultsCrossVariant|fuseResultsRsfMulti|fuseResultsRsfCrossVariant|canonic
  │ alRrfId" (.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts)
  └ 13 lines found

● Search (glob)
  │ "**/search-flags.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (grep)
  │ "RSF|relative score fusion|rsfShadow|fuseResultsRsf|shadow" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "RSF|relative score fusion|rsfShadow|fuseResultsRsf|shadow" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Search (grep)
  │ "spec-ahead-of-implementation|describe\.skip|it\.skip|skip\(" in *sparse-first-graph*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 2 lines found

● Search (grep)
  │ "clearExisting|BEGIN|ROLLBACK|transaction|merge|skip rather than
  │ duplicated|spec_folder|file_path|anchor_id"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 14 lines found

● Search (grep)
  │ "quality proxy|avgRelevance|topResult|countSaturation|latencyPenalty|manual|ground
  │ truth|correlat" (.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts)
  └ 36 lines found

● Search (grep)
  │ "Math\.(min|max)\(\.\.\.|reduce\(|AI-WHY"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts)
  └ 4 lines found

● Search (grep)
  │ "Math\.(min|max)\(\.\.\.|reduce\(|AI-WHY"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts)
  └ 1 line found

● Search (grep)
  │ "Math\.(min|max)\(\.\.\.|reduce\(|AI-WHY"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts)
  └ 1 line found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "export function is[A-Za-z0-9_]+"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 1 file found

● Read causal-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ L1:260 (260 lines read)

● Read sparse-first-graph.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/sparse-first-graph.vitest.ts
  └ L1:120 (31 lines read)

● Search (grep)
  │ "RSF|relative score fusion|rsfShadow|fuseResultsRsf|Stage 2|stage 2" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 53 lines found

● Search (grep)
  │ "RSF|relative score fusion|rsfShadow|fuseResultsRsf" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L340:470 (131 lines read)

● Read eval-quality-proxy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts
  └ L1:240 (214 lines read)

● Read rrf-fusion.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
  └ L250:540 (291 lines read)

I’ve confirmed the `53` helper count and the skipped typed-traversal test. I’m pulling the remaining precise evidence for RSF residual references and checkpoint restore behavior before patching the docs in one pass.

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L520:760 (241 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L30:60 (31 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L430:450 (21 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L900:915 (16 lines read)

● Read feature-eval-query-intelligence.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts
  └ L35:55 (21 lines read)

● Read cross-feature-integration-eval.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts
  └ L145:250 (105 lines read)

● Read search-fallback-tiered.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts
  └ L20:40 (21 lines read)

● Search (grep)
  │ "fully removed from the codebase|fully removed|module, tests, and shadow metadata deleted"
  │ (.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion
  │ -in-shadow-mode.md)
  └ 2 lines found

● Search (grep)
  │ "function restoreCheckpoint|restoreCheckpoint\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
  └ 1 line found

● Search (grep)
  │ "function isTypedTraversalEnabled|export function isTypedTraversalEnabled"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 1 line found

● Search (grep)
  │ "Runtime|runtime|partial|planned|spec-ahead|pending implementation" (.opencode/skill/system-spec
  │ -kit/feature_catalog/10--graph-signal-activation/16-typed-traversal.md)
  └ No matches found

● Search (grep)
  │ "fuseResultsRsfMulti|fuseResultsRsfCrossVariant" (.opencode/skill/system-spec-kit/feature_catalo
  │ g/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)
  └ 1 line found

● Search (grep)
  │ "Correlation testing|confirmed the proxy" (.opencode/skill/system-spec-kit/feature_catalog/09--e
  │ valuation-and-measurement/05-quality-proxy-formula.md)
  └ 1 line found

● Search (grep)
  │ "elimination|residual production spread sites" (.opencode/skill/system-spec-kit/feature_catalog/
  │ 08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md)
  └ 4 lines found

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1478:1685 (208 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L480:520 (41 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1680:1805 (126 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1805:1885 (22 lines read)

I’ve got the remaining evidence. I’m patching the seven markdown files now, with the changes limited to the inaccurate claims you flagged and the nearby wording needed to keep each entry internally consistent.

● Edit
  │ Edit
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fu
  │ sion-in-shadow-mode.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/16-typed-traver
  │ sal.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-
  │ fusion-corrections.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpo
  │ intrestore.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-p
  │ roxy-formula.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax
    -min-stack-overflow-elimination.md

The edits are in. I’m running the markdown validator against the seven touched catalog files and then I’ll surface the exact diffs for each file so you can review the remediation quickly.

● Validate edited docs and summarize diff (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.agents/skills/sk-doc' &&
  │ python3 scripts/validate_document.py '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-suns
  │ et-audit.md' && python3 scripts/validate_document.py
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit…
  └ 31 lines...

The content edits are sound, but the repo’s validator is treating these per-feature catalog files like README-style docs and flagging a missing TOC. I’m checking whether that validator has a mode switch; otherwise I’ll use a narrower sanity check and call out the validator mismatch explicitly.

● Read validate_document.py
  │ .agents/skills/sk-doc/scripts/validate_document.py
  └ L1:240 (239 lines read)

● Run diff sanity checks on edited docs (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && git --no-pager diff
  │ --check -- '.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sun
  │ set-audit.md' '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relat
  │ ive-score-fusion-in-shadow-mode.md' '.opencode/skill/system-spec-kit/feature_catalog/10--graph
  │ -signal-activation/16-typed-traversal.md' '.opencode/skill/system-spec-kit/feature_catalog/11-…
  └ 22 lines...

● Search (grep)
  │ "tocRequired" (.agents/skills/sk-doc/assets/template_rules.json)
  └ 9 lines found

● Search (grep)
  │ ""(readme|reference|spec|asset|install_guide|skill|agent|command)"\s*:\s*\{"
  │ (.agents/skills/sk-doc/assets/template_rules.json)
  └ 8 lines found

● Read template_rules.json
  │ .agents/skills/sk-doc/assets/template_rules.json
  └ L189:228 (40 lines read)

● Read template_rules.json
  │ .agents/skills/sk-doc/assets/template_rules.json
  └ L308:318 (11 lines read)

I found the validator mismatch: it auto-detects any generic `.md` file as `readme`, which incorrectly requires a TOC for these feature-catalog entries. I’m re-running validation with an explicit non-TOC document type so we still get a real structural check.

● Validate edited docs as reference entries (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.agents/skills/sk-doc' &&
  │ python3 scripts/validate_document.py '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-suns
  │ et-audit.md' --type reference && python3 scripts/validate_document.py
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit…
  └ 43 lines...

● Search (grep)
  │ "53 exported `is\*` functions"
  │ (.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md)
  └ 1 line found

● Search (grep)
  │ "runtime code was removed|residual test references|RRF / RSF" (.opencode/skill/system-spec-kit/f
  │ eature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md)
  └ 5 lines found

● Search (grep)
  │ "partially wired|spec-ahead-of-implementation|partial/planned" (.opencode/skill/system-spec-kit/
  │ feature_catalog/10--graph-signal-activation/16-typed-traversal.md)
  └ 3 lines found

● Search (grep)
  │ "fuseResultsMulti\(|fuseResultsCrossVariant\(|RRF ID canonicalization" (.opencode/skill/system-s
  │ pec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)
  └ 3 lines found

● Search (grep)
  │ "clearExisting=true|partial restore|best-effort partial" (.opencode/skill/system-spec-kit/featur
  │ e_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md)
  └ 2 lines found

● Search (grep)
  │ "designed to correlate|verified correlation study" (.opencode/skill/system-spec-kit/feature_cata
  │ log/09--evaluation-and-measurement/05-quality-proxy-formula.md)
  └ 1 line found

● Search (grep)
  │ "hardening|Residual production spread sites still remain|cleanup is not complete"
  │ (.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min
  │ -stack-overflow-elimination.md)
  └ 4 lines found

✗ Memory stored documentation
  └ Validate system-spec-kit feature_catalog entry files with validate_document.py u…

● Show diff 02-feature-flag-sunset-audit.md
  │
  │ 17
  │ 18    A comprehensive audit at Sprint 7 exit found 79 unique `SPECKIT_` flags across the
  │       codebase. Its disposition buckets were historical planning inputs: 27 flags were marked
  │       for graduation to permanent-ON defaults, 9 were marked as dead code for removal and 2 were
  │        tracked as operational knobs (`COACTIVATION_STRENGTH`, `PRESSURE_POLICY`). Those audit
  │       actions have since been completed or superseded. `ADAPTIVE_FUSION` graduated to always-on
  │       behavior and is no longer counted as an active knob.
  │ 19
  │ 20 -  The current active flag-helper inventory in `search-flags.ts` is 46 exported `is*`
  │       functions. There is no `isPipelineV2Enabled()` function; the helper was removed along with
  │        the legacy V1 pipeline. Sprint 0 core flags remain default ON, sprint-graduated flags
  │       from Sprints 3-6 remain default ON and deferred-feature flags (including GRAPH_SIGNALS,
  │       COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default
  │       ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.
  │ 20 +  The current active flag-helper inventory in `search-flags.ts` is 53 exported `is*`
  │       functions. There is no `isPipelineV2Enabled()` function; the helper was removed along with
  │        the legacy V1 pipeline. Sprint 0 core flags remain default ON, sprint-graduated flags
  │       from Sprints 3-6 remain default ON and deferred-feature flags (including GRAPH_SIGNALS,
  │       COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default
  │       ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.
  │ 21
  │ 22    **Pipeline status:** The 4-stage pipeline is the sole runtime path. The
  │       `SPECKIT_PIPELINE_V2` environment variable is not consumed by runtime code.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md

● Show diff 02-relative-score-fusion-in-shadow-mode.md
  │
  │  1     ---
  │  2     title: "Relative score fusion in shadow mode"
  │  3 -  description: "Relative score fusion (RSF) was fully removed — module, tests, and shadow
  │       metadata deleted. RRF is the sole fusion method."
  │  3 +  description: "Relative score fusion (RSF) runtime code was removed, while residual test
  │       references and Stage 2 comments remain for regression coverage. RRF is the sole live
  │       fusion method."
  │  4     ---
  │  5
  │  6     # Relative score fusion in shadow mode
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Removed from live ranking in Sprint 8. RSF implementation code, dedicated test files, and
  │       the `rsfShadow` metadata field were fully deleted during the v3 remediation sweep (updated
  │        2026-03-25 per deep review).
  │ 10 +  Removed from live ranking in Sprint 8. RSF implementation code and the `rsfShadow`
  │       metadata field were deleted during the v3 remediation sweep, while residual test
  │       references and Stage 2 comments remain as regression/historical breadcrumbs (updated
  │       2026-03-25 per deep review).
  │ 11
  │ 12    When multiple search methods return ranked lists, RSF was one alternative way to merge
  │       them. RRF won the evaluation and RSF was deprecated. The module was retained temporarily
  │       for offline comparison but was never reactivated — it was removed as dead code.
  │ 13
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -   RRF remains the sole live fusion method. RSF has been fully removed from the codebase.
  │ 18 +  RRF remains the sole live fusion method. RSF runtime code has been removed, but residual
  │       test references and Stage 2 comments still remain in the codebase.
  │ 19
  │ 20 -  The standalone RSF implementation and dedicated RSF test files have been deleted. RSF
  │       references in mixed test files (`cross-feature-integration-eval`,
  │       `feature-eval-query-intelligence`, `dead-code-regression`) have been surgically removed.
  │       The `rsfShadow` metadata field in `Sprint3PipelineMeta` has been removed from
  │       `hybrid-search.ts`.
  │ 20 +  The standalone RSF implementation and dedicated RSF test files have been deleted. The
  │       `rsfShadow` metadata field in `Sprint3PipelineMeta` has been removed from
  │       `hybrid-search.ts`. Residual mentions still exist in mixed regression files such as
  │       `cross-feature-integration-eval.vitest.ts`, `feature-eval-query-intelligence.vitest.ts`,
  │       and `search-fallback-tiered.vitest.ts`, and Stage 2 comments in
  │       `pipeline/stage2-fusion.ts` still say `RRF / RSF` even though the runtime path is
  │       RRF-only.
  │ 21
  │ 22    `SPECKIT_RSF_FUSION` may still appear as an inert config surface in documentation but has
  │       no runtime effect.
  │ 23
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 30     | File | Layer | Role |
  │ 31     |------|-------|------|
  │ 32     | `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm (sole live method) |
  │ 33 +  | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Residual comments still
  │       mention `RRF / RSF`; runtime fusion flow is RRF-only |
  │ 34
  │ 35     ### Tests
  │ 36
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 38     |------|-------|
  │ 39     | `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
  │ 40     | `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |
  │ 41 +  | `mcp_server/tests/cross-feature-integration-eval.vitest.ts` | Residual
  │       `SPECKIT_RSF_FUSION` references kept in mixed regression coverage |
  │ 42 +  | `mcp_server/tests/feature-eval-query-intelligence.vitest.ts` | Residual
  │       `SPECKIT_RSF_FUSION` env backup for evaluation coverage |
  │ 43 +  | `mcp_server/tests/search-fallback-tiered.vitest.ts` | Residual `SPECKIT_RSF_FUSION` env
  │       backup for fallback regression coverage |
  │ 44
  │ 45     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-
    in-shadow-mode.md

● Show diff 16-typed-traversal.md
  │
  │  1     ---
  │  2     title: "Typed traversal"
  │  3 -  description: "Typed traversal enables sparse-first graph policy and intent-aware edge
  │       traversal for causal boost scoring, constraining traversal to typed 1-hop expansion in
  │       sparse graphs and mapping query intents to edge-type priority orderings, gated by the
  │       SPECKIT_TYPED_TRAVERSAL flag."
  │  3 +  description: "Typed traversal is partially wired for sparse-first graph policy and
  │       intent-aware edge traversal in `causal-boost.ts`, behind the `SPECKIT_TYPED_TRAVERSAL`
  │       flag, with some runtime/export coverage still planned."
  │  4     ---
  │  5
  │  6     # Typed traversal
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Typed traversal enables sparse-first graph policy and intent-aware edge traversal for
  │       causal boost scoring, constraining traversal to typed 1-hop expansion in sparse graphs and
  │        mapping query intents to edge-type priority orderings, gated by the
  │       `SPECKIT_TYPED_TRAVERSAL` flag.
  │ 10 +  Typed traversal introduces sparse-first graph policy and intent-aware edge traversal
  │       helpers in `causal-boost.ts`, gated by the `SPECKIT_TYPED_TRAVERSAL` flag, but the runtime
  │        wiring is still only partially complete.
  │ 11
  │ 12    When the graph has few edges relative to the number of memories, deep multi-hop traversal
  │       is unreliable and expensive. This feature detects sparse graphs (density below 0.5) and
  │       automatically constrains the causal boost walk to a single typed hop. For all graphs, it
  │       introduces intent-aware traversal that maps query intents (fix_bug, add_feature,
  │       find_decision, etc.) to prioritized edge types, so the graph walk follows the most
  │       relevant relationships first.
  │ 13
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -   Enabled by default (graduated). Set `SPECKIT_TYPED_TRAVERSAL=false` to disable.
  │ 18 +  The flag surface is enabled by default (graduated). Set `SPECKIT_TYPED_TRAVERSAL=false` to
  │        disable.
  │ 19
  │ 20 -  The `isTypedTraversalEnabled()` function in `causal-boost.ts` checks the flag. When
  │       enabled, two D3 Phase A requirements activate:
  │ 20 +  `search-flags.ts` exports `isTypedTraversalEnabled()`, and `causal-boost.ts` contains
  │       helper logic for the D3 Phase A sparse-first and intent-aware traversal behavior. However,
  │        the dedicated `sparse-first-graph.vitest.ts` file is entirely `describe.skip(...)` and
  │       marked "spec-ahead-of-implementation", so this should be treated as partial/planned
  │       runtime wiring rather than fully validated live behavior.
  │ 21 +
  │ 22 +   When the flag is on, the current helper logic covers two D3 Phase A requirements:
  │ 23
  │ 24    **D3-001 Sparse-first policy**: When graph density (`edgeCount / totalMemories`) falls
  │       below `SPARSE_DENSITY_THRESHOLD = 0.5`, community detection is disabled and traversal is
  │       constrained to `SPARSE_MAX_HOPS = 1` typed expansion. This prevents noisy results from
  │       sparse graphs.
  │ 25
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 43     | File | Focus |
  │ 44     |------|-------|
  │ 45    | `mcp_server/tests/causal-boost.vitest.ts` | Causal boost with typed traversal,
  │       sparse-first gating, intent-aware scoring |
  │ 46 +   | `mcp_server/tests/sparse-first-graph.vitest.ts` | Skipped spec-ahead-of-implementation
  │        coverage documenting planned sparse-first export/runtime wiring |
  │ 47
  │ 48     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/16-typed-traversal.m
    d

● Show diff 13-scoring-and-fusion-corrections.md
  │
  │  1     ---
  │  2     title: "Scoring and fusion corrections"
  │  3 -  description: "Covers nine scoring fixes including intent weight recency, five-factor
  │       weight normalization, stack overflow prevention, BM25 specFolder filter, shared
  │       `resolveEffectiveScore` consolidation, and RSF ID canonicalization."
  │  3 +  description: "Covers nine scoring fixes including intent weight recency, five-factor
  │       weight normalization, stack overflow prevention, BM25 specFolder filter, shared
  │       `resolveEffectiveScore` consolidation, and RRF ID canonicalization."
  │  4     ---
  │  5
  │  6     # Scoring and fusion corrections
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Covers nine scoring fixes including intent weight recency, five-factor weight
  │       normalization, stack overflow prevention, BM25 specFolder filter, shared
  │       `resolveEffectiveScore` consolidation, and RSF ID canonicalization.
  │ 10 +  Covers nine scoring fixes including intent weight recency, five-factor weight
  │       normalization, stack overflow prevention, BM25 specFolder filter, shared
  │       `resolveEffectiveScore` consolidation, and RRF ID canonicalization.
  │ 11
  │ 12    These nine fixes address problems in how scores are calculated and combined. Issues ranged
  │        from weights that did not add up to 100% to a method that crashed when processing large
  │       batches and a filter that compared apples to oranges. Each fix makes the scoring math more
  │        accurate and stable, ensuring the final ranking truly reflects which results are most
  │       relevant to your question.
  │ 13
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 25    - **Adaptive fusion normalization (#10):** Core weights (semantic + keyword + recency) now
  │        normalize to sum 1.0 after doc-type adjustments. Only applied when doc-type shifts alter
  │       the balance.
  │ 26    - **Shared resolveEffectiveScore (#11):** A single function in `pipeline/types.ts`
  │       replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. Uses
  │       the canonical fallback chain: `intentAdjustedScore -> rrfScore -> score ->
  │       similarity/100`, all clamped [0,1].
  │ 27    - **Configurable interference threshold (#12):** `computeInterferenceScoresBatch()` now
  │       accepts an optional `threshold` parameter (defaults to
  │       `INTERFERENCE_SIMILARITY_THRESHOLD`).
  │ 28 -  - **RSF ID canonicalization (#13):** `fuseResultsRsfMulti()` and
  │       `fuseResultsRsfCrossVariant()` now use `canonicalRrfId()` for map keys and variant
  │       appearance tracking, preventing numeric/string ID splits such as `42` vs "42" from
  │       surfacing as duplicate RSF items.
  │ 28 +  - **RRF ID canonicalization (#13):** `fuseResultsMulti()` and `fuseResultsCrossVariant()`
  │       now use `canonicalRrfId()` for map keys and variant appearance tracking, preventing
  │       numeric/string ID splits such as `42` vs "42" from surfacing as duplicate fused items.
  │ 29
  │ 30    In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline
  │       steps (artifact routing, feedback signals, session boost, and causal boost) can mutate
  │       `score`. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later
  │        modifications were invisible in final ranking. A synchronization pass now flat-overwrites
  │        the score aliases by clamping the current value and writing the same number into `score`,
  │        `rrfScore`, and `intentAdjustedScore` via `withSyncedScoreAliases()` and
  │       `syncScoreAliasesInPlace()`. This keeps downstream ranking consistent with the latest
  │       pipeline score; it does not preserve the prior value with `Math.max(...)`.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusio
    n-corrections.md

● Show diff 03-checkpoint-restore-checkpointrestore.md
  │
  │  1     ---
  │  2     title: "Checkpoint restore (checkpoint_restore)"
  │  3 -  description: "Covers the checkpoint restore tool that decompresses snapshots and merges or
  │        replaces memory state atomically."
  │  3 +  description: "Covers the checkpoint restore tool that decompresses snapshots and either
  │       replaces memory state atomically with `clearExisting=true` or merges with best-effort
  │       partial restore semantics by default."
  │  4     ---
  │  5
  │  6     # Checkpoint restore (checkpoint_restore)
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Covers the checkpoint restore tool that decompresses snapshots and merges or replaces
  │       memory state atomically.
  │ 10 +  Covers the checkpoint restore tool that decompresses snapshots and either replaces memory
  │       state atomically with `clearExisting=true` or merges with best-effort partial restore
  │       semantics by default.
  │ 11
  │ 12 -  This brings your knowledge base back to a previous snapshot, like using the undo button on
  │        a massive scale. If the restore fails partway through, nothing changes and your current
  │       data stays safe. Restored memories are immediately searchable without any extra steps.
  │
  │ 12 +  This brings your knowledge base back to a previous snapshot, like using the undo button on
  │        a massive scale. If a replace-style restore fails partway through, nothing changes and
  │       your current data stays safe. In merge mode, successful rows can still commit while
  │       failures are reported as warnings. Restored memories are immediately searchable without
  │       any extra steps.
  │ 13
  │ 14     ---
  │ 15
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 19
  │ 20    The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a
  │        database transaction. If the restore encounters an error halfway through, the transaction
  │        rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is
  │       critical because clearing existing data and then failing to restore would leave you with
  │       an empty database and no way back.
  │ 21
  │ 22 -  When merging (the default), the system checks for duplicates using a logical key of
  │       `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are
  │       skipped rather than duplicated.
  │ 22 +  When merging (the default), the system checks for duplicates using a logical key of
  │       `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are
  │       skipped rather than duplicated, but row-level/table-level errors are accumulated and the
  │       successful subset can still commit. In other words, merge mode is intentionally
  │       best-effort and may return a partial-restore warning instead of full rollback semantics
  │ 23
  │ 24    After restore, vectors are restored from the checkpoint snapshot when vector payloads are
  │       present. The restore handler then clears in-memory search/constitutional caches, rebuilds
  │       BM25 from live DB content when BM25 is enabled and refreshes the trigger cache. This keeps
  │        restored memories immediately discoverable without forcing a full re-embedding pass.
  │
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointre
    store.md

● Show diff 05-quality-proxy-formula.md
  │
  │ 19
  │ 20    The quality proxy formula produces a single 0-1 score from four components: `avgRelevance
  │       * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs
  │       automatically on logged data and flags regressions without human review.
  │ 21
  │ 22 -  The weights were chosen to prioritize relevance over speed while still penalizing latency
  │       spikes. Correlation testing against the manual ground truth corpus confirmed the proxy
  │       tracks real quality well enough for regression detection.
  │ 22 +  The weights were chosen to prioritize relevance over speed while still penalizing latency
  │       spikes. The proxy is designed to correlate with manual assessment well enough to act as a
  │       regression signal, but this feature entry should not claim a separately verified
  │       correlation study against the manual ground-truth corpus.
  │ 23
  │ 24     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-
    formula.md

● Show diff 08-mathmax-min-stack-overflow-elimination.md
  │
  │  1     ---
  │  2 -   title: "Math.max/min stack overflow elimination"
  │  3 -  description: "Tracks the replacement of `Math.max(...array)` spread patterns with
  │       `reduce()` to prevent stack overflows on large arrays."
  │  2 +   title: "Math.max/min stack overflow hardening"
  │  3 +   description: "Tracks targeted replacement of `Math.max(...array)` spread patterns with
  │        stack-safe extrema logic, while noting residual production sites that still remain."
  │  4     ---
  │  5
  │  6 -   # Math.max/min stack overflow elimination
  │  6 +   # Math.max/min stack overflow hardening
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Tracks the replacement of `Math.max(...array)` spread patterns with `reduce()` to prevent
  │       stack overflows on large arrays.
  │ 10 +  Tracks targeted replacement of `Math.max(...array)` spread patterns with stack-safe
  │       extrema logic to reduce stack-overflow risk on large arrays.
  │ 11
  │ 12 -  A common way of finding the largest or smallest number in a list was crashing the system
  │       when the list got too big. Seven places in the code used this risky approach. All were
  │       replaced with a safer method that works no matter how large the list grows, preventing
  │       crashes on big knowledge bases.
  │ 12 +  A common way of finding the largest or smallest number in a list was crashing the system
  │       when the list got too big. A prior remediation pass replaced several of the riskiest
  │       spread-based extrema sites with safer logic, but the cleanup is not complete. Residual
  │       production spread sites still remain and are called out below.
  │ 13
  │ 14     ---
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -  `Math.max(...array)` and `Math.min(...array)` push all elements onto the call stack,
  │       causing `RangeError` on arrays exceeding ~100K elements. Seven production files were
  │       converted from spread patterns to `reduce()`:
  │ 18 +  `Math.max(...array)` and `Math.min(...array)` push all elements onto the call stack,
  │       causing `RangeError` on arrays exceeding ~100K elements. Several production sites were
  │       converted from spread patterns to `reduce()` or equivalent stack-safe extrema logic:
  │ 19
  │ 20     - `rsf-fusion.ts` (deleted): 6 instances were fixed before module removal
  │ 21     - `causal-boost.ts`: 1 instance
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-
    stack-overflow-elimination.md

Done. I fixed the seven feature-catalog entries and showed the diff for each above.

- `17--governance/...sunset-audit.md`: updated `is*` helper count from `46` to `53`.
- `12--query-intelligence/...relative-score-fusion...md`: softened “fully removed” to runtime-removed, with residual test refs/comments noted.
- `10--graph-signal-activation/...typed-traversal.md`: marked runtime wiring as partial/planned and cited the skipped sparse-first test.
- `11--scoring-and-calibration/...corrections.md`: updated stale function names to `fuseResultsMulti` / `fuseResultsCrossVariant`.
- `05--lifecycle/...checkpointrestore.md`: clarified atomic replace vs best-effort merge restore behavior.
- `09--evaluation...quality-proxy-formula.md`: softened the unverified correlation claim.
- `08--bug-fixes...stack-overflow...md`: changed “elimination” to “hardening” and kept residual spread sites explicit.

Validation passed with `validate_document.py --type reference` for all 7 files, and `git diff --check` passed.

