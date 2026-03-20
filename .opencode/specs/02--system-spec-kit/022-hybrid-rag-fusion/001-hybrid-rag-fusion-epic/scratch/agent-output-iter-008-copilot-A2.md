● skill(sk-deep-research)

I’m mapping the eval pipeline first, then I’ll trace the code paths and turn that into concrete, cited findings.

● Read quick_reference.md
  │ .agents/skills/sk-deep-research/references/quick_reference.md
  └ 199 lines read

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/eval/**/*.ts"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/ablation-framework.ts"
  └ No matches found

● search evaluation and measurement infrastructure under lib/search/eval, ablation framework, recal…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

The first pass showed my path glob was too narrow, so I’m resolving the actual file layout and loading the relevant prior context before tracing internals.

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 50 files found

● Search (grep)
  │ "ablation|eval|ground truth|Recall@|snapshot|metric" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 29 files found

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Run skill advisor for research task (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3
  │ .opencode/skill/scripts/skill_advisor.py 'Deep research iteration 8/20 on hybrid-rag-fusion
  │ system. Focus: Eval/measurement infrastructure quality in
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/ eval directory and
  │ ablation-framework.ts. Investigate code, trace data flows, identify bugs, architecture issues,…
  └ 68 lines...

I found the search package but not the expected `eval/` path, so I’m widening the search to locate the actual measurement code and cross-check whether the requested path is stale or renamed.

● Search (glob)
  │ "**/eval/**/*.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ 16 files found

● Search (glob)
  │ "**/ablation-framework.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ 1 file found

● Search (grep)
  │ "ablation-framework|eval_run_ablation|Recall@|ground
  │ truth|ground_truth|metric_snapshots|ablation" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Explore Map eval infrastructure
  │ Find ablation public functions (shell)
  │   │ grep -n "export function runAblation\|export function storeAblation"
  │   │ "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts"
  │   └ 2 lines...
  └ View public exports from api/eval.ts (shell)
      │ grep -A 10 "export {$" "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/eval.ts"
      └ 23 lines...

I’ve got the module map; now I’m reading the concrete implementations and checking which pieces are actually wired versus just present on disk.

● Search (grep)
  │ "eval_metric_snapshots|getEvalDb|getDb|CREATE TABLE|UNIQUE|FOREIGN KEY|WAL|closeEvalDb"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts)
  └ 15 lines found

● Search (grep)
  │ "generateDashboardReport|eval_metric_snapshots|metric_name|channel|limit|SPECKIT_DASHBOARD_LIMIT
  │ |GROUP BY|ORDER BY" (.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts)
  └ 76 lines found

● Search (grep)
  │ "export function|export async function|function |const
  │ ALL_CHANNELS|eval_metric_snapshots|Date\.parse|getEvalDb|getDb|TODO|FIXME|permanently
  │ disabled|disabled|not yet|stub"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 47 lines found

● Search (grep)
  │ "logSearchQuery|logChannelResult|logFinalResult|getDb|getEvalDb|enabled|feature
  │ flag|SPECKIT_EVAL_LOGGING" (.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts)
  └ 18 lines found

● Search (grep)
  │ "channel-attribution|eval-quality-proxy|edge-density|k-value-analysis|shadow-scoring|ground-trut
  │ h-feedback|ground-truth-generator|bm25-baseline|memory-state-baseline|eval-ceiling" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 34 lines found

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L221:420 (200 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L1:220 (220 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L421:820 (352 lines read)

● Read eval-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ L1:240 (195 lines read)

● Read eval-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts
  └ L1:260 (252 lines read)

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L1:260 (260 lines read)

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L261:680 (401 lines read)

I’ve confirmed a few likely seams in `ablation-framework.ts`; now I’m tracing whether the handler and search-layer contracts actually match those assumptions.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read search-types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts
  └ L1:240 (10 lines read)

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L1:260 (175 lines read)

● Read eval.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/eval.ts
  └ L1:220 (30 lines read)

● Search (grep)
  │ "useVector|useBm25|useFts|useGraph|useTrigger|HybridSearchOptions|trigger" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

The ablation handler is the critical junction, so I’m now verifying its channel-disable semantics and whether the dashboard can actually compare runs meaningfully once data lands.

● Read ground-truth-data.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts
  └ L1:220 (78 lines read)

● Read ground-truth-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
  └ L1:240 (240 lines read)

● Read channel-attribution.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts
  └ L1:220 (220 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "logSearchQuery|logChannelResult|logFinalResult" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 11 lines found

● Search (grep)
  │ "triggerPhrases|useTrigger|routeQuery|forceAllChannels|useFts|useGraph|useVector|useBm25"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 30 lines found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L548:676 (129 lines read)

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ L1:240 (166 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L820:1255 (436 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L575:935 (361 lines read)

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L200:250 (51 lines read)

I found one likely contract drift already: the ablation config advertises capabilities the runner never actually uses. I’m checking for more of those “paper API vs live behavior” mismatches.

● Read bm25-baseline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts
  └ L430:560 (131 lines read)

● Search (grep)
  │ "token_usage|latency_p50|latency_p95|AblationMetrics"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 13 lines found

● Read eval-metrics.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "sprint|sprintLabel" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 59 lines found

● Search (grep)
  │ "baselineRunId" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 1 line found

I found a more serious one: the ablation handler may never exercise the graph channel at all. I’m verifying that against the only `initHybridSearch(...)` call sites now.

● Read memory-state-baseline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts
  └ L1:240 (224 lines read)

● Read eval-ceiling.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts
  └ L1:240 (240 lines read)

● Search (grep)
  │ "graphSearchFn|computeDegreeScores|initHybridSearch" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 2 lines found

● Search (grep)
  │ "initHybridSearch\(|init\(" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed the graph ablation issue is real. Next I’m tracing channel naming across logger, ablation, and dashboard to see if comparisons are getting fragmented by inconsistent labels.

● Read eval-quality-proxy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts
  └ L1:220 (214 lines read)

● Read k-value-analysis.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts
  └ L1:220 (208 lines read)

● Search (grep)
  │ "collectEvalChannelsFromRow|buildEvalChannelPayloads|fts5|fts'|channel: 'fts|channel:
  │ 'bm25|channel: 'graph|channel: 'trigger"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 6 lines found

● Search (grep)
  │ "fts5|fts\b|trigger\b|bm25\b|graph\b|vector\b" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 52 lines found

● Search (grep)
  │ "source: 'fts'|source: 'bm25'|source: 'graph'|source: 'vector'|source: 'trigger'" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 15 lines found

● Read edge-density.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts
  └ L180:240 (34 lines read)

● Read ground-truth-generator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts
  └ L240:320 (80 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L180:380 (201 lines read)

● Search (grep)
  │ "source[s]?|collectEvalChannelsFromRow|buildEvalChannelPayloads"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 4 lines found

I’ve now got enough evidence for the quality picture: one hard functional bug, a couple of API/measurement drifts, and a small cluster of “analysis-only” modules that aren’t actually part of the live path.

● Search (grep)
  │ "queryId: string|queryId: number|recordUserSelection\(|computeLLMJudgeLabel|lexical
  │ overlap|deterministic judge"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts)
  └ 9 lines found

● Search (grep)
  │ "source: 'memory-state-baseline'|phase:|capabilities:|scopeDimensionsTracked:"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts)
  └ 4 lines found

● Search (grep)
  │ "not production code|tests only|permanently disabled|Use .* instead" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 9 lines found

● Search (grep)
  │ "INSERT INTO eval_metric_snapshots|metadata:|JSON\.stringify\(|sprintLabel|sprint" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 77 lines found

I’m doing one last pass on the feedback path so I don’t overstate it — there’s a difference between “future-facing naming” and an actual broken integration.

● Read ground-truth-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
  └ L320:460 (140 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "recordUserSelection\(" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 25 lines found

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L380:430 (51 lines read)

● Search (grep)
  │ "queryId\s*=|const queryId" (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 1 line found

I found the eval infra under `lib/eval/` (not `lib/search/eval`). Main flow is `handlers/eval-reporting.ts -> ablation-framework.ts -> eval_metric_snapshots`, while live search instrumentation is `memory-search/context/triggers -> eval-logger.ts -> eval_* tables`, and the dashboard reads `eval_metric_snapshots` plus `eval_channel_results` (`handlers/eval-reporting.ts:57-152`, `lib/eval/eval-logger.ts:143-233`, `lib/eval/reporting-dashboard.ts:182-243,511-568`).

Key findings:

- **Graph ablation is effectively broken.** The ablation handler initializes hybrid search without a graph function (`initHybridSearch(db, vectorIndex.vectorSearch)`), but hybrid search only executes graph when `graphSearchFn` exists (`handlers/eval-reporting.ts:77`, `lib/search/hybrid-search.ts:245-255,647-648`).

- **“Trigger” ablation does not ablate a retrieval channel.** The handler only empties `triggerPhrases`; hybrid search routes over `vector/fts/bm25/graph/degree` and has no trigger channel in its execution set (`handlers/eval-reporting.ts:84-98`, `lib/search/hybrid-search.ts:561-573`, `lib/search/query-router.ts:21-39,57-61,119-141`).

- **Channel naming is inconsistent.** Ablation uses `fts5`, but runtime/search/dashboard use `fts`, so channel-level comparisons are fragmented (`lib/eval/ablation-framework.ts:51-59,766-770`, `lib/search/hybrid-search.ts:632`, `handlers/memory-search.ts:191-218,330-363`, `lib/eval/reporting-dashboard.ts:35`).

- **`baselineRunId` is dead API surface.** It is declared in `AblationConfig` but never read in the runner (`lib/eval/ablation-framework.ts:63-71,361-500`).

- **Sprint reporting is mostly aspirational.** The dashboard groups by `metadata.sprint/sprintLabel`, but ablation and BM25 writers never persist those fields, so reports fall back to `run-{eval_run_id}` (`lib/eval/reporting-dashboard.ts:147-158,250-262`, `lib/eval/ablation-framework.ts:555-560,573-599`, `lib/eval/bm25-baseline.ts:449-458`).

- **There is shipped-but-dormant analysis code.** `shadow-scoring.ts` explicitly says its write path was permanently disabled, and `k-value-analysis.ts` says it is not production code (`lib/eval/shadow-scoring.ts:14-17,241-263,343-360`, `lib/eval/k-value-analysis.ts:4-6`).

