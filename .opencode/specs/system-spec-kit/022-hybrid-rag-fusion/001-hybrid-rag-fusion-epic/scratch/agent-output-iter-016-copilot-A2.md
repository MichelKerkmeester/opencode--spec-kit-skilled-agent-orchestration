● skill(sk-deep-research)

I’m loading the research protocol, then I’ll inspect the search subsystem and trace its key flows so I can surface concrete Q1 synthesis findings with citations.

✗ Read plan.md
  │ ~/.copilot/session-state/c1a921ec-fd25-4bab-88e6-894f3fcf20d1/plan.md
  └ Path does not exist

● Read quick_reference.md
  │ .agents/skills/sk-deep-research/references/quick_reference.md
  └ 199 lines read

● Read loop_protocol.md
  │ .agents/skills/sk-deep-research/references/loop_protocol.md
  └ L1:220 (220 lines read)

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 16/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus: Q1
  │ synthesis. Read source files, trace data flows, find bugs, dead code, architecture issues.
  │ Report with file:line citations." --threshold 0.8
  └ 59 lines...

I’ve got the loop protocol and routing context. Next I’m mapping the search subsystem structure and pulling the highest-signal files so the findings stay grounded in actual data flow, not just filenames.

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 50 files found

● Search (glob)
  │ "**/*.ts" in .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 56 files found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/c1a921ec-fd25-4bab-88e6-894f3fcf20d1/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 9 lines...

● search Q1 synthesis hybrid rag fusion ranking aggregation result formatting in mcp_server lib/sea…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● Explore Explore search architecture
  │ Check if attentionScore is used in ranking (shell)
  │   │ sed -n '50,60p' "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │
  │   Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts"
  │   └ 11 lines...
  └ Verify score tie-breaking logic (shell)
      │ grep -A5 "compareDeteministic\|aScore.*bScore"
      │ "/Users/michelkerkmeester/MEGA/Development/Opencode
      │
      Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts"
       |
      │ head -25
      └ 6 lines...

The first pass surfaced a few plausible issues, but I’m verifying them directly in source now. I want the final report to cite only things the code actually proves.

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ 68 lines read

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:260 (260 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:260 (260 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L1:220 (220 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L400:520 (121 lines read)

● Search (grep)
  │ "resolveEffectiveScore|compareDeterministicRows|withSyncedScoreAliases|syncScoreAliasesInPlace|a
  │ ttentionScore|stage2Score|searchWithFallbackTiered|hybridSearch\(|applyIntentWeightsToResults|is
  │ Hybrid|verifyScoreInvariant|captureScoreSnapshot" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 59 lines found

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

I’ve verified one real inconsistency already: the deterministic sorter still hardcodes its own score fallback chain instead of using the shared resolver. I’m drilling into fallback behavior and late-stage invariants next.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:260 (260 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L260:640 (381 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:320 (320 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L320:640 (321 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L260:420 (161 lines read)

● Search (grep)
  │ "searchWithFallbackTiered|fallback|tiered|embedding.*reuse|cachedEmbedding|includeConstitutional
  │ |constitutionalInjected|enableSessionBoost|enableCausalBoost" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 58 lines found

I found a stronger candidate than the stale `attentionScore`: Stage 4’s evidence-gap scoring path appears to prefer `rrfScore` over the Stage 3 reranked `score`, which would make post-rerank analysis run on stale scores. I’m confirming that call path now.

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L220:420 (146 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1430:1560 (131 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L640:860 (214 lines read)

● Read evidence-gap-detector.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
  └ L1:260 (198 lines read)

● Search (grep)
  │ "extractScoringValue\(|detectEvidenceGap\(|formatEvidenceGapWarning\(|evidenceGap" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 15 lines found

I’ve confirmed the Stage 4/TRM bug. I’m doing one more pass on degraded hybrid fallback, because the current stage gating may keep treating vector fallback results as “hybrid” and skip the wrong scoring path.

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L500:740 (241 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1580:1640 (61 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1360:1455 (96 lines read)

● Search (grep)
  │ "const isHybrid|searchType === 'hybrid'|searchWithFallback\(|Hybrid search failed, falling back
  │ to vector|channel: 'vector'|reason: hybridMsg" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 13 lines found

● Search (grep)
  │ "@deprecated|deprecated|searchWithFallbackTiered\(|return searchWithFallbackTiered\(|return
  │ hybridSearch\(" (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 5 lines found

I’ve confirmed the degraded-path mismatch is real in structure: Stage 1 can fall back to vector, but Stage 2 still keys behavior off `config.searchType === 'hybrid'`. I’m pulling the exact wrapper lines around `searchWithFallback()` before I write the synthesis.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L860:940 (81 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L48:70 (23 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts
  └ L1:120 (36 lines read)

● Search (grep)
  │ "searchWithFallback\(|executePipeline\(|executeStage1\(|executeStage2\(|executeStage3\(|executeS
  │ tage4\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 17 lines found

I have enough for the main synthesis; I just want the exact `searchWithFallback()` wrapper lines so the degraded-path citation is crisp rather than inferred.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1260:1325 (65 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L203:216 (14 lines read)

● Search (grep)
  │ "async function searchWithFallback\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 1 line found

I’m just locating the tiny wrapper around `searchWithFallback()` so I can cite whether the legacy path is still reachable or merely retained. Then I’ll write up the Q1 synthesis findings cleanly.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1080:1160 (81 lines read)

● Search (grep)
  │ "searchWithFallbackTiered\(query, embedding, options\)|return hybridSearch\(query, embedding,
  │ options\)|async function searchWithFallback\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 3 lines found

I’ve confirmed `searchWithFallback()` itself no longer uses the deprecated naive path; now I’m checking whether that old `hybridSearch()` still has any live callers before I label it dead code instead of just “legacy.”

● Search (grep)
  │ "export\s*\{|module\.exports|export\s+\{[^}]*searchWithFallback|searchWithFallback\s*,|hybridSea
  │ rch\s*," (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 3 lines found

● Search (grep)
  │ "\bhybridSearch\(" in **/*.{ts,tsx,js,mjs,cjs}
  └ 23 lines found

One last pass: I’m checking the export surface so I can distinguish “dead code” from “deprecated but still intentionally supported.” That affects whether I call it cleanup debt or a real unused path.

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ L1:120 (120 lines read)

● Read pipeline-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts
  └ L1:90 (90 lines read)

● Read hybrid-search.ts
  └ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts

I confirmed the legacy API is still exercised by tests, so I won’t overstate it as dead code. I just need the export line itself to frame it correctly as a supported-but-deprecated surface.

● Read hybrid-search.ts
  └ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts

● Search (grep)
  │ "^export \{|^  hybridSearch,|^  searchWithFallback,"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 3 lines found

The export citation is oddly elusive via the read tools, so I’m using a quick numbered tail to anchor the exact lines without re-reading the whole file.

● Show numbered export lines (shell)
  │ nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' | tail -n 30
  └ 31 lines...

Got it — the export block is just above that tail. I’m grabbing the few lines that name `hybridSearch` and `searchWithFallback`, then I’ll write the synthesis.

● Show export block lines (shell)
  │ nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' | sed -n
  │ '1700,1738p'
  └ 40 lines...

Q1 synthesis: the live pipeline is `executePipeline()` → Stage 1 candidate generation → Stage 2 fusion/scoring → Stage 3 rerank/MPAB aggregation → Stage 4 filtering/annotation. Stage 1 can also inject constitutional rows before later stages treat them uniformly. [`pipeline/orchestrator.ts:42-77`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts), [`pipeline/stage1-candidate-gen.ts:192-217`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts), [`pipeline/stage2-fusion.ts:555-579`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts), [`pipeline/stage3-rerank.ts:127-156`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts), [`pipeline/stage4-filter.ts:243-345`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts)

Findings:

- `compareDeterministicRows()` still hardcodes its own score fallback order (`score → intentAdjustedScore → rrfScore`) while the canonical resolver is `intentAdjustedScore → rrfScore → score`, clamped. That means sorting can diverge from the shared scoring contract used elsewhere. [`pipeline/ranking-contract.ts:32-58`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts), [`pipeline/types.ts:48-68`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts)

- Stage 4 TRM/evidence-gap checks use `rrfScore` before final `score`, but Stage 3 reranking overwrites `score` and preserves prior Stage 2 state separately. So post-rerank confidence analysis can run on stale pre-rerank scores. [`pipeline/stage4-filter.ts:203-216`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts), [`pipeline/stage4-filter.ts:269-284`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts), [`pipeline/stage3-rerank.ts:373-380`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)

- Degraded hybrid fallback is semantically inconsistent: Stage 1 can catch hybrid failure and substitute pure vector candidates, but Stage 2 still decides behavior from `config.searchType === 'hybrid'`, so fallback-vector results still get hybrid-only treatment and skip non-hybrid intent weighting. [`pipeline/stage1-candidate-gen.ts:409-441`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts), [`pipeline/stage2-fusion.ts:578-617`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts), [`pipeline/stage2-fusion.ts:713-730`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)

- The Stage 4 immutability check is weaker than its comments imply: it snapshots all rows, but `verifyScoreInvariant()` skips any row filtered out later, so score mutations on rows removed during filtering would go undetected. [`pipeline/stage4-filter.ts:247-253`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts), [`pipeline/stage4-filter.ts:306-312`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts), [`pipeline/types.ts:384-397`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts)

- I did **not** confirm true dead code in the core path. The deprecated naive `hybridSearch()` is still exported, so it’s legacy surface area rather than unreachable code. [`hybrid-search.ts:413-419`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [`hybrid-search.ts:1083-1121`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [`hybrid-search.ts:1712-1721`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)

