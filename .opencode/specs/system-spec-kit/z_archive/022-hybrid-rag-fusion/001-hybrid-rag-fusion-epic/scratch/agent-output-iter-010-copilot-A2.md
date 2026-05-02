● skill(sk-deep-research)

I’m loading the research context and the search subsystem files first so I can trace the cognitive flow end-to-end before reporting issues.

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 50 files found

● Read quick_reference.md
  │ .agents/skills/sk-deep-research/references/quick_reference.md
  └ 199 lines read

● Read convergence.md
  │ .agents/skills/sk-deep-research/references/convergence.md
  └ 524 lines read

● Read loop_protocol.md
  │ .agents/skills/sk-deep-research/references/loop_protocol.md
  └ 458 lines read

● Read state_format.md
  │ .agents/skills/sk-deep-research/references/state_format.md
  └ 341 lines read

● Search (grep)
  │ "cognitive|session boost|attention|working_memory|working
  │ memory|trigger|decay|co-activation|session_id|turnNumber" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● search cognitive subsystem session boost attention decay working memory trigger match search rera…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve got the deep-research protocol loaded. Next I’m narrowing to the actual cognitive files and internal call sites so the review is based on traced data flow, not keyword hits.

● Search (glob)
  │ "**/*{session,trigger,boost,transition}*.ts" in
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 3 files found

● Search (grep)
  │ "session[- ]boost|working[_-]memory|attention|decay|trigger|co-activation|coactivation|sessionId
  │ |turnNumber|session boost|cognitive" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (grep)
  │ "enableSessionBoost|enableCausalBoost|include_cognitive|memory_match_triggers|working_memory|att
  │ ention signals|tiered content|co-activation|coactivation|session-based" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 10/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus:
  │ Cognitive subsystem review. Read source files, trace data flows, find bugs, dead code,
  │ architecture issues. Report with file:line citations." --threshold 0.8
  └ 83 lines...

I found the likely core files: `session-boost.ts`, `session-transition.ts`, and the search pipeline entrypoints that call them. I’m reading those together now so I can map the actual execution path.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ 1 line read

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline
  └ 9 files found

● Read session-transition.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts
  └ 190 lines read

● Read session-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts
  └ 212 lines read

● Read search-types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts
  └ 10 lines read

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ 251 lines read

● Search (grep)
  │ "applySessionBoost|computeSessionBoost|recordAttention|getTieredInjection|coActivation|working
  │ memory|memory_match_triggers|include_cognitive|session transition|tiered" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 16 lines found

I have the core entrypoints; now I’m checking whether they’re actually wired into the live pipeline or just sitting as partial/unused infrastructure.

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L520:840 (321 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L180:320 (140 lines read)

● Search (grep)
  │ "sessionBoost\.init\(|applySessionBoost\(|getAttentionBoost\(|calculateSessionBoost\(|MAX_COMBIN
  │ ED_BOOST|SESSION_BOOST_MULTIPLIER" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 18 lines found

● Search (grep)
  │ "buildSessionTransitionTrace|attachSessionTransitionTrace|readSessionTransitionTrace|SESSION_TRA
  │ NSITION_SIGNAL_ORDER" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 22 lines found

The wiring is live: session boost is initialized in `context-server` and applied in Stage 2; session-transition traces are attached in both `memory_context` and `memory_search`. I’m drilling one level deeper into how session attention is written and how the formatter consumes these traces.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1080:1185 (106 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L680:810 (131 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L300:380 (81 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L880:920 (41 lines read)

● Read causal-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ L1:340 (326 lines read)

● Search (grep)
  │ "working_memory|attention_score|attention|recordAttention|boostAttention|coActivation|include_co
  │ gnitive|tiered injection|co-activation" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed the downstream consumers. The remaining gap is upstream: where `working_memory.attention_score` gets written and whether that aligns with the search-side assumptions.

● Search (glob)
  │ "**/*{working-memory,attention-decay,co-activation,rollout-policy}*.ts" in
  │ .opencode/skill/system-spec-kit/mcp_server/lib
  └ 4 files found

● Search (grep)
  │ "working_memory|attention_score|recordSelection|recordAccess|setSessionInferredMode|getSessionPr
  │ omptContext|DECAY_FLOOR|coActivation|attentionDecay" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Search (grep)
  │ "working_memory|attention_score|recordSelection|recordAccess|boost.*attention|touch.*working|ups
  │ ert.*working_memory" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read working-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ 1 line read

● Read attention-decay.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
  └ 361 lines read

● Read co-activation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
  └ 403 lines read

● Read rollout-policy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ 64 lines read

● Read working-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ L1:220 (220 lines read)

● Read working-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ L220:520 (301 lines read)

● Search (grep)
  │ "function (init|recordResultSelection|recordSessionAccess|setSessionInferredMode|getSessionPromp
  │ tContext|getSessionAttention|pruneSessionMemory|recordSelection|recordAccess)|export
  │ \{|DECAY_FLOOR|attention_score|working_memory"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
  └ 68 lines found

● Read working-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ L520:760 (241 lines read)

● Search (grep)
  │ "upsertExtractedEntry\(|setAttentionScore\(|decayAttention\(|cleanupOldSessions\(|getSessionProm
  │ ptContext\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 27 lines found

There’s a likely architectural seam here: search ranking consumes `working_memory`, but I haven’t yet seen a strong write path from actual search consumption back into that table. I’m checking the only known writers now.

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L240:330 (90 lines read)

● Read extraction-adapter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
  └ L220:320 (100 lines read)

● Search (grep)
  │ "setAttentionScore\(|upsertExtractedEntry\(|batchUpdateScores\(|cleanupOldSessions\(|getSessionP
  │ romptContext\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 3 lines found

● Search (grep)
  │ "batchUpdateScores\(|cleanupOldSessions\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 19 lines found

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L320:430 (111 lines read)

● Search (grep)
  │ "spreadActivation\(|getCausalNeighbors\(|boostScore\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 59 lines found

● Search (grep)
  │ "include_cognitive|tiered
  │ content|coActivatedMemories|coActivationApplied|sessionBoostApplied|systemPromptContextInjected"
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 33 lines found

I found one concrete correctness bug already in `memory-triggers`. I’m now validating whether the broader “cognitive subsystem” is also under-wired, so I can separate hard bugs from design gaps.

● Read extraction-adapter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
  └ L233:279 (47 lines read)

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L316:346 (31 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1170:1225 (56 lines read)

● Search (grep)
  │ "recordSearch|logSearch|consumption|initConsumptionLog|resultIds|workingMemory\.|setAttentionSco
  │ re\(|upsertExtractedEntry\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 7 lines found

● Search (grep)
  │ "workingMemory\.(setAttentionScore|upsertExtractedEntry|getSessionPromptContext|batchUpdateScore
  │ s)" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 19 lines found

I’ve got one hard bug and one clear dataflow gap. I’m doing a last pass for “dead code / architecture drift” inside the search package so the report is balanced, not just bug-centric.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1040:1115 (75 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:160 (160 lines read)

● Search (grep)
  │ "coActivationApplied|communityBoostApplied|graphSignalsApplied" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 4 lines found

● Search (grep)
  │ "isPipelineV2Enabled\(|executePipeline\(|hybridSearch\.search|searchHybrid|legacy|deprecated|V1
  │ pipeline|pipeline v2" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "searchWithFallback\(|hybridSearchEnhanced\(|hybridSearch\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "executePipeline\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 2 lines found

The live search path is `memory-search -> executePipeline`. I’m checking whether `hybrid-search.ts` is now mostly compatibility code, which would explain some duplicated cognitive logic.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1115:1185 (71 lines read)

● Search (grep)
  │ "export \{[^}]*searchWithFallback|export \{[^}]*hybridSearch|export
  │ \{[^}]*hybridSearchEnhanced|export type \{[^}]*HybridSearch"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ No matches found

● Search (grep)
  │ "from '../lib/search/hybrid-search'|from './lib/search/hybrid-search'|from
  │ './search/hybrid-search'|require\(.*hybrid-search" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 21 lines found

I found a stronger design mismatch: the trigger handler computes co-activated memories, but it appears to never return them as candidates. I’m pulling the schema/docs lines too so I can cite that mismatch precisely.

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L252:399 (147 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L221:240 (20 lines read)

● Read co-activation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
  └ L300:345 (45 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L176:186 (11 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L559:570 (12 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L642:694 (53 lines read)

I found another architecture gap: session cleanup exists as a module feature, but I can’t find any runtime caller outside tests. I’m pulling the exact lines so I can cite it cleanly.

● Read working-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ L23:31 (9 lines read)

● Read working-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ L251:267 (17 lines read)

● Search (grep)
  │ "sessionTimeoutMs|maxCapacity"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
  └ 7 lines found

● Search (grep)
  │ "cleanupOldSessions\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’m checking one last thing: whether the repo still has two live search implementations (`pipeline` and `hybrid-search`). If so, that’s a bigger architectural risk than a local bug.

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L1:120 (120 lines read)

● Read search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/search.ts
  └ 20 lines read

● Search (grep)
  │ "hybridSearchEnhanced\(|searchWithFallback\(|executePipeline\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/api)
  └ No matches found

● Search (grep)
  │ "hybridSearchEnhanced\(|searchWithFallback\(|executePipeline\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 2 lines found

I confirmed a genuine split-brain architecture: production `memory_search` runs the 4-stage pipeline, but ablation/eval still calls `hybridSearchEnhanced` directly. That means evaluation can drift from the behavior users actually get.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L948:976 (29 lines read)

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L76:100 (25 lines read)

● Check workspace status (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && git --no-pager status --short
  └ 165 lines...

Iteration 10 cognitive review findings:

- **Hard bug:** `memory_match_triggers` maps session memories with `wm.id` instead of the joined memory ID, so `wmEntry` lookup usually misses and the double-decay guard/tiering logic is bypassed. `handlers/memory-triggers.ts:320-344`, source row shape `lib/cognitive/working-memory.ts:301-306`.

- **Co-activation is computed but not surfaced:** neighbors are generated via `spreadActivation()`, but only original trigger matches are returned; co-activated memories never enter `enrichedResults`. That conflicts with the tool contract. `handlers/memory-triggers.ts:300-366`, `lib/cognitive/co-activation.ts:300-344`, `tool-schemas.ts:179-182`.

- **Session-boost dataflow is under-wired:** Stage 2 ranks from `working_memory`, but production `memory_search` only logs consumption; writes come mainly from trigger hits and extraction adapter. Boost state can be sparse/stale. `lib/search/session-boost.ts:73-109,125-193`, `handlers/memory-search.ts:1170-1197`, `handlers/memory-triggers.ts:285-293`, `lib/extraction/extraction-adapter.ts:265-279`.

- **Session timeout is effectively dead at runtime:** timeout config and `cleanupOldSessions()` exist, but callers appear limited to tests. `lib/cognitive/working-memory.ts:27-31,251-267`; only test hits via `cleanupOldSessions()` search.

- **Architecture drift:** production retrieval uses the 4-stage pipeline, but ablation/eval still uses `hybridSearchEnhanced`, so offline metrics can diverge from shipped behavior. `handlers/memory-search.ts:968-976`, `handlers/eval-reporting.ts:77-99`.

