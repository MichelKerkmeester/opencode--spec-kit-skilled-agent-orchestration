● skill(sk-deep-research)

I'll inspect the search subsystem and its tests in parallel, then trace the highest-risk flows for coverage gaps and latent bugs.

● Search (glob)
  │ "**/*search*" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 15 files found

● Search (glob)
  │ "**/*" in .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 58 files found

● Search (grep)
  │ "lib/search|search/|hybrid|fusion|rrf|rerank|score|format" in *.{ts,tsx,js,mjs,cjs}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 files found

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/1e77bec0-1c05-42b3-84f2-61eb71b56fc9/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 11 lines...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 15/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus: Test
  │ coverage analysis. Read source files, trace data flows, find bugs, dead code, architecture
  │ issues. Report with file:line citations." --threshold 0.8
  └ 75 lines...

● search test coverage and search pipeline implementation in .opencode/skill/system-spec-kit/mcp_se…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve got the file inventory and test map; next I’m reading the pipeline entry points and the search-focused test suite side by side to spot what isn’t exercised.

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ 1 line read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ 1 line read

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ 1 line read

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ 1 line read

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ 1 line read

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ 1 line read

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ 365 lines read

● Read integration-search-pipeline.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts
  └ 320 lines read

● Read hybrid-search-flags.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts
  └ 77 lines read

● Read search-results-format.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts
  └ 547 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ 59 lines read

The first pass already shows one big smell: several “integration” tests only assert that calls don’t blow up, which leaves most branch logic effectively unverified. I’m drilling into the stage modules and the hybrid search adapter now.

● Search (grep)
  │ "export (async )?function|function |const .* ="
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 66 lines found

● Search (grep)
  │ "export (async )?function|function |const .* ="
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 5 lines found

● Search (grep)
  │ "export (async )?function|function |const .* ="
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 5 lines found

● Search (grep)
  │ "export (async )?function|function |const .* ="
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
  └ 67 lines found

● Search (grep)
  │ "hybridSearchEnhanced|executePipeline|executeStage1|executeStage2|executeStage3|executeStage4|fi
  │ lterByMemoryState|extractScoringValue" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Map search source files to mentioning tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && python3 - <<'PY'
  │ from pathlib import Path
  │ src = Path('lib/search')
  │ tests = list(Path('tests').glob('*.vitest.ts'))…
  └ 120 lines...

I’ve mapped which files are even mentioned by tests. Some coverage is quite lopsided: `stage4-filter.ts` has one direct test file, while `stage1`/`stage3` have lots of behavior but only a few focused specs.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:240 (240 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L521:760 (181 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L261:520 (259 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:260 (259 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L261:560 (300 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L241:520 (280 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:260 (260 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L561:760 (104 lines read)

● Read stage1-expansion.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts
  └ 442 lines read

● Read stage2-fusion.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts
  └ 234 lines read

● Read stage3-rerank-regression.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts
  └ 90 lines read

● Read pipeline-v2.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts
  └ 396 lines read

I’ve got enough of the control flow to compare code paths against the actual assertions. Now I’m checking the “middle” of Stage 2 and the hybrid adapter for untested branches and any correctness traps hidden behind graceful fallbacks.

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ 1 line read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L520:860 (334 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L261:560 (300 lines read)

● Read search-limits-scoring.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts
  └ 270 lines read

● Search (grep)
  │ "applyValidationSignalScoring|applyIntentWeightsToResults|applyArtifactRouting|applyFeedbackSign
  │ als|applyTestingEffect|executeStage2|syncScoreAliasesInPlace|withGraphContribution|countGraphCon
  │ tribution|countGraphInjected"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 5 lines found

A second pattern is emerging: some suites verify implementation by source-string inspection rather than executing behavior. That keeps regressions “green” even when real runtime branches stay untested.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L981:1240 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L560:980 (421 lines read)

● Search (grep)
  │ "function searchWithFallback|async function hybridSearchEnhanced|function
  │ hybridSearch\(|function combinedLexicalSearch|function bm25Search|function ftsSearch|function
  │ init\(|export \{|__testables|getGraphMetrics|resetGraphMetrics"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 104 lines found

● Search (grep)
  │ "applyValidationSignalScoring|applyIntentWeightsToResults|applyArtifactRouting|applyTestingEffec
  │ t|strengthenOnAccess|enrichResultsWithAnchorMetadata|enrichResultsWithValidationMetadata" in
  │ *.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 44 lines found

● Search (grep)
  │ "applyCrossEncoderReranking|resolveDisplayText|collapseAndReassembleChunkResults|reassembleParen
  │ tRow|markFallback|electBestChunk" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 37 lines found

I’ve found one concrete correctness bug already: Stage 2’s `communityInjected` metric is computed from delta-based counting, but community-injected rows are tagged with a zero delta, so the metric under-reports by construction. I’m checking for a second issue in the hybrid adapter’s fallback/filtering behavior.

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ L1:260 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1452:1698 (246 lines read)

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ L261:620 (360 lines read)

● Search (grep)
  │ "communityInjected|communityDelta|withGraphContribution|applyCommunityBoost|specFolder|BM25|fail
  │ open|prepare\(|searchWithFallbackTiered|DegradationEvent|trigger:"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts)
  └ 114 lines found

● Search (grep)
  │ "communityInjected|communityDelta|withGraphContribution|applyCommunityBoost|countGraphContributi
  │ on|countGraphInjected" in *.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 20 lines found

I also found a test quality problem: one BM25 “specFolder filter” assertion is checking the returned `id` string for a folder path, but the implementation filters via DB lookup and keeps numeric IDs. That means the test isn’t validating the real contract at all.

● Read search-fallback-tiered.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts
  └ 386 lines read

● Search (grep)
  │ "searchWithFallbackTiered|_degradation|structuralSearch|checkDegradation|calibrateTier3Scores|ap
  │ plyResultLimit" in *.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 38 lines found

● Run focused search subsystem tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/stage1-expansion.vitest.ts tests/stage2-fusion.vitest.ts
  │ tests/stage3-rerank-regression.vitest.ts tests/pipeline-v2.vitest.ts
  │ tests/hybrid-search.vitest.ts tests/search-fallback-tiered.vitest.ts …
  └ 98 lines...

The focused test run passed, which is actually informative: the existing suite is green while several high-risk branches are still only smoke-tested or untested. I’m doing one last pass on entry-point wiring so I can separate “legacy but unused” paths from live architecture duplication.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:260 (260 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ L1:220 (219 lines read)

● Search (grep)
  │ "executePipeline|hybridSearchEnhanced|searchWithFallback|executeStage4|executeStage3|executeStag
  │ e2|executeStage1" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 23 lines found

● Search (grep)
  │ "hybridSearchEnhanced|searchWithFallback|combinedLexicalSearch|hybridSearch\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed the live wiring: `memory_search` goes through the new 4-stage pipeline, but `eval-reporting` still drives `hybridSearchEnhanced` directly. So there are genuinely two active retrieval paths, not just leftover code.

● Search (grep)
  │ "hybridSearch\(|hybridSearchEnhanced\(|searchWithFallback\("
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts)
  └ 50 lines found

● Search (grep)
  │ "applyIntentWeightsToResults|applyTestingEffect|strengthenOnAccess" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ No matches found

● Search (grep)
  │ "executeStage4\(|extractScoringValue\(|filterByMemoryState\(" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 10 lines found

✗ Memory stored search architecture
  └ memory-search uses the 4-stage executePipeline path, but eval-reporting still ca…

Focused search-subsystem suite passed: `8` files / `204` tests.

Key findings:

- Live path split: `memory_search` uses the 4-stage pipeline, but `eval-reporting` still calls `hybridSearchEnhanced` directly, so search behavior now has two active implementations. [handlers/memory-search.ts:15,968] [lib/search/pipeline/orchestrator.ts:42-77] [handlers/eval-reporting.ts:7,98]

- Real bug: Stage 2 marks community-injected rows with `communityDelta = 0`, then computes `communityInjected` by counting non-zero deltas, so the metric under-reports injected rows. The Stage 2 regression suite mocks community boost away entirely. [lib/search/pipeline/stage2-fusion.ts:218-223,665-667,799-803] [tests/stage2-fusion.vitest.ts:21-23,106-233]

- Stage 4 coverage is shallow: production `executeStage4()` handles filtering, evidence-gap annotation, trace emission, and invariant checks, but the direct tests only exercise `filterByMemoryState()`. [lib/search/pipeline/stage4-filter.ts:243-365] [tests/pipeline-v2.vitest.ts:164-273]

- The “integration” pipeline suite is mostly a smoke net: it explicitly tolerates infra errors/timeouts and mostly checks parameter acceptance, not ranking/filter semantics. [tests/integration-search-pipeline.vitest.ts:41-130,132-239]

- One BM25 test is validating the wrong contract: code filters by `spec_folder` via DB lookup but returns IDs unchanged, while the test asserts the returned `id` string contains the folder path. [lib/search/hybrid-search.ts:279-299] [tests/hybrid-search.vitest.ts:189-196]

- Docs drift: README says Stage 4 performs token-budget truncation, but that logic still lives in `hybrid-search.ts`, not `stage4-filter.ts`. [lib/search/README.md:117-119] [lib/search/pipeline/stage4-filter.ts:27-33,243-345] [lib/search/hybrid-search.ts:988-999]

