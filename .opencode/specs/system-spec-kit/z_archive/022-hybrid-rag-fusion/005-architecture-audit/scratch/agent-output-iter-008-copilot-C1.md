● skill(sk-code-review)

I’m mapping the eval subsystem first, then I’ll audit the statistical logic and architecture boundaries for concrete findings.

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/eval
  └ 18 files found

● Read security_checklist.md
  │ .agents/skills/sk-code-review/references/security_checklist.md
  └ 206 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code-review/references/quick_reference.md
  └ 151 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code-review/references/code_quality_checklist.md
  └ 162 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/evals/*.ts"
  └ 18 files found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/29a870f1-2025-4b8b-86ef-a85a2a6d3616/plan.md'
  │ <<'EOF'
  │ # Eval subsystem audit plan…
  └ 9 lines...

I’ve got the file inventory. Next I’m checking import boundaries, dataset locations, and whether scripts duplicate the MCP-side eval implementations.

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/eval/data
  └ 1 file found

● Search (grep)
  │ "ground.?truth|ablation|bm25|shadow|dashboard|benchmark" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/evals)
  └ 43 lines found

● Search (grep)
  │ "lib/eval|eval/" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 79 lines found

● Search (grep)
  │ "SPECKIT_ABLATION|eval_metric_snapshots|ground_truth_queries|ground_truth_results|shadow" in
  │ **/*.{ts,json,md,sql} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Explore Exploring eval architecture
  │ Check quality proxy constants (shell)
  │   │ cd "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit" && grep -n "const.*="
  │   │ mcp_server/lib/eval/eval-quality-proxy.ts | head -20
  │   └ 12 lines...
  └ Find hardcoded thresholds (shell)
      │ cd "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit" && grep -n
      │ "HIGH_MRR_THRESHOLD\|DENSE_THRESHOLD\|MODERATE_THRESHOLD" mcp_server/lib/eval/*.ts
      └ 12 lines...

I’ve confirmed eval hooks are on live handler paths, so I’m now drilling into the actual formulas and storage patterns to separate acceptable observability from risky runtime coupling.

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s|^export\s+(const|class|type|interface)\s" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 5 lines found

● Search (grep)
  │ "from '../lib/eval|from '../../mcp_server/lib/eval|initEvalDb|getEvalDb|closeEvalDb|recordMetric
  │ Snapshot|loadGroundTruth|runAblation|runBm25" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/evals)
  └ 10 lines found

● Search (grep)
  │ "GROUND_TRUTH|groundTruth|relevance|MRR|NDCG|precision|recall|DCG|confidence|p95|median|percenti
  │ le|variance|std|wilson|bootstrap" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 5 lines found

● Get eval file line counts (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval' && wc -l *.ts
  │ data/ground-truth.json
  └ 19 lines...

● Read copilot-tool-output-1774015020053-gfoskt.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015020053-gfoskt.txt
  └ L1:220 (110 lines read)

● Read copilot-tool-output-1774015020052-eyy3nj.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015020052-eyy3nj.txt
  └ L1:260 (108 lines read)

● Read 1774015004118-copilot-tool-output-amlju7.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/1774015004118-copilot-tool-output-amlju7.txt
  └ L1:260 (260 lines read)

I found one important nuance: eval code is not fully isolated from runtime. Some handler paths call eval logging/feedback directly, so I’m verifying whether those hooks are properly gated and cheap enough.

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1:220 (220 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L1:180 (180 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:220 (219 lines read)

● Read eval-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ L1:220 (195 lines read)

● Read eval-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts
  └ L1:260 (252 lines read)

● Read quality-loop.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ L1:120 (120 lines read)

● Read eval-metrics.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts
  └ L1:260 (260 lines read)

● Read eval-metrics.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts
  └ L261:620 (345 lines read)

● Read ground-truth-data.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts
  └ L1:140 (78 lines read)

● Read ground-truth-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
  └ L1:220 (220 lines read)

● Read ground-truth-generator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts
  └ L1:220 (220 lines read)

● Read ground-truth.json
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json
  └ L1:180 (180 lines read)

● Read ground-truth-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
  └ L220:560 (333 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L281:620 (340 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L1:280 (280 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L621:820 (152 lines read)

● Read bm25-baseline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts
  └ L261:620 (344 lines read)

● Read bm25-baseline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts
  └ L1:260 (260 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ L1:260 (260 lines read)

● Read k-value-analysis.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts
  └ L1:240 (208 lines read)

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L1:280 (280 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ L261:520 (184 lines read)

● Read eval-quality-proxy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts
  └ L1:240 (214 lines read)

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L281:720 (381 lines read)

I’m on the script side now. The key question there is whether the scripts are just thin runners over the MCP eval lib or whether they fork behavior and become a maintenance burden.

● Read run-ablation.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts
  └ L1:240 (179 lines read)

● Read run-bm25-baseline.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts
  └ L1:220 (184 lines read)

● Read map-ground-truth-ids.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts
  └ L1:260 (260 lines read)

● Read run-performance-benchmarks.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts
  └ L1:220 (220 lines read)

● Read check-architecture-boundaries.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts
  └ L1:220 (220 lines read)

● Read deleted-phase3-telemetry-dashboard-script
  │ .opencode/skill/system-spec-kit/scripts/evals/deleted-phase3-telemetry-dashboard-script
  └ L1:240 (240 lines read)

● Read memory-state-baseline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts
  └ L1:260 (224 lines read)

● Read edge-density.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts
  └ L1:240 (213 lines read)

● Read eval-ceiling.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts
  └ L241:460 (170 lines read)

● Read eval-ceiling.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts
  └ L1:240 (240 lines read)

● Read channel-attribution.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts
  └ L1:280 (252 lines read)

● Read eval.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/eval.ts
  └ L1:200 (30 lines read)

● Read check-no-mcp-lib-imports.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "run-performance-benchmarks|allowlist|expiry|2026-06-04|@spec-kit/mcp-server/lib" in
  │ *.{ts,json,md} (.opencode/skill/system-spec-kit/scripts/evals)
  └ 5 lines found

● Read copilot-tool-output-1774015100398-obdl80.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015100398-obdl80.txt
  └ L1:160 (97 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/evals/*allowlist*.json"
  └ 1 file found

● Read import-policy-allowlist.json
  │ .opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json
  └ L1:120 (55 lines read)

● Search (grep)
  │ "logSearchQuery|logChannelResult|logFinalResult|recordUserSelection" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 13 lines found

● Search (grep)
  │ "compareShadowResults|getShadowStats|runShadowScoring" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit)
  └ 46 lines found

● Search (grep)
  │ "computeQualityProxy|computeCeilingFromGroundTruth|analyzeKValueSensitivity|measureEdgeDensity|g
  │ etChannelAttribution" in **/*.{ts,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read copilot-tool-output-1774015125202-acjvsh.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015125202-acjvsh.txt
  └ L1:180 (108 lines read)

I found a potentially important split-brain issue: the “quality proxy” exists both as an eval module and as separate logic inside retrieval telemetry. I’m verifying whether they’re actually the same metric or drifting copies.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L820:1240 (421 lines read)

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L460:540 (81 lines read)

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L260:340 (81 lines read)

● Search (grep)
  │ "baselineRunId" (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 1 line found

● Search (grep)
  │ "computeQualityProxy\(" in **/*.ts (.opencode/skill/system-spec-kit)
  └ 21 lines found

● Search (grep)
  │ "computeQualityProxy\(|DEFAULT_LATENCY_TARGET_MS|WEIGHTS"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts)
  └ 11 lines found

● Search (grep)
  │ "QUALITY_PROXY_COUNT_SATURATION_THRESHOLD|QUALITY_PROXY_LATENCY_CEILING_MS"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts)
  └ 7 lines found

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md
  └ L1:220 (152 lines read)

● Search (grep)
  │ "reporting-dashboard|eval-metrics|ground-truth-feedback|ablation-framework|bm25-baseline|shadow-
  │ scoring" in *.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 14 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/*{eval,ablation,bm25,ground-truth,shadow,edge-
  │ density,channel,ceiling,reporting}*.vitest.ts"
  └ 32 files found

I’ve got enough static evidence for the architecture, but I’m doing one more pass through the existing eval tests so I can tell you whether the subsystem is merely well-designed on paper or actually exercised.

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ L1:120 (59 lines read)

● Run eval-focused vitest suite (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/eval-metrics.vitest.ts tests/bm25-baseline.vitest.ts tests/ablation-framework.vitest.ts
  │ tests/reporting-dashboard.vitest.ts tests/ground-truth.vitest.ts
  │ tests/ground-truth-feedback.vitest.ts tests/ceiling-quality.vitest.ts tests/channel.vitest.ts …
  └ 20 lines...

● Read README.md
  │ .opencode/skill/system-spec-kit/scripts/evals/README.md
  └ L1:180 (87 lines read)

● Search (grep)
  │ "shadow|telemetry dashboard|reporting dashboard|ablation|BM25 baseline|ground truth" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/evals)
  └ 18 lines found

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L360:440 (81 lines read)

● Search (grep)
  │ "ground-truth.json|groundTruthData|ground-truth-data.ts"
  │ (.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts)
  └ 2 lines found

● Search (grep)
  │ "useTrigger" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 8 lines found

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L60:130 (71 lines read)

● Search (grep)
  │ "hybridSearchEnhanced\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 76 lines found

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L84:98 (15 lines read)

● Read run-ablation.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts
  └ L108:128 (21 lines read)

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L35:50 (16 lines read)

● Read deleted-phase3-telemetry-dashboard-script
  │ .opencode/skill/system-spec-kit/scripts/evals/deleted-phase3-telemetry-dashboard-script
  └ L95:160 (66 lines read)

● Search (grep)
  │ "runShadowScoring|compareShadowResults|logShadowComparison|getShadowStats" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/evals)
  └ No matches found

## Assessment

Mostly **yes**: the eval subsystem is structurally coherent, has a good public boundary at `mcp_server/api/eval.ts:4-30`, and is well tested. I ran a focused eval suite in `mcp_server`: **10 files, 403 tests passed**.

Core IR math in `eval-metrics.ts` looks standard and solid. The weaker areas are **maintenance fidelity**, **metric consistency**, and a few **script/runtime coupling** edges that can make some outputs less trustworthy than they appear.

## Findings

### P1 - `run-ablation.ts` does not actually ablate the trigger channel

- `scripts/evals/run-ablation.ts:114-124` builds `channelFlags.useTrigger` but never passes any trigger-disabling option to `hybridSearchEnhanced()`.
- The MCP path does it correctly at `mcp_server/handlers/eval-reporting.ts:84-98` via `triggerPhrases: channelFlags.useTrigger ? undefined : []`.
- Impact: CLI ablation results for `trigger` can be false-positive analysis.

### P1 - Ground-truth maintenance is brittle-to-broken

- `scripts/evals/map-ground-truth-ids.ts:79-208` regex-parses `ground-truth-data.ts` as if it still contains inline query objects.
- `mcp_server/lib/eval/ground-truth-data.ts:5,46-52` now imports `data/ground-truth.json` and re-exports arrays.
- Impact: the documented remapping workflow has drifted from the real source of truth, so dataset refresh/repair is unreliable.

### P1 - “Quality proxy” has split-brain implementations

- Eval implementation: `mcp_server/lib/eval/eval-quality-proxy.ts:17-26,166-207`
- Runtime telemetry implementation: `mcp_server/lib/telemetry/retrieval-telemetry.ts:41-44,271-296,483-500`
- They share weights, but not semantics: eval uses caller-supplied `expectedCount` and a `500ms` latency target; telemetry hardcodes saturation at `10` results and a `5000ms` latency ceiling.
- Impact: offline eval numbers and live telemetry numbers are not directly comparable even though they represent the same named metric.

### P2 - Eval code is on live request paths via synchronous SQLite writes

- Live handlers call eval hooks directly: `mcp_server/handlers/memory-search.ts:24,828-839,1199-1231`, `mcp_server/handlers/memory-context.ts:41`, `mcp_server/handlers/memory-triggers.ts:37`, `mcp_server/handlers/checkpoints.ts:16,404-412`.
- `mcp_server/lib/eval/eval-logger.ts:125-227` and `ground-truth-feedback.ts:226-258` use synchronous `better-sqlite3`.
- This is gated and fail-safe, so it is not catastrophic, but if enabled in production it adds real hot-path I/O and lock contention.

### P2 - Cold-start metric is time-dependent, so it drifts without code changes

- `mcp_server/lib/eval/eval-metrics.ts:469-500` uses `Date.now()` in `computeColdStartDetectionRate`.
- Impact: rerunning the same benchmark later can change the metric purely because time passed, reducing reproducibility.

### P2 - The Phase 3 telemetry dashboard script is simulated, not measured

- `scripts/evals/deleted-phase3-telemetry-dashboard-script:100-129` derives boost/pressure rates from query length, modulo arithmetic, and synthetic token usage.
- It does disclose that at `deleted-phase3-telemetry-dashboard-script:200`, but the artifact still looks dashboard-like and quantitative.
- Impact: useful as a placeholder, weak as rollout evidence.

## What is good

- `run-ablation.ts` and `run-bm25-baseline.ts` are mostly thin wrappers over the MCP eval API, so there is **not** widespread scripts-vs-lib duplication.
- `reporting-dashboard.ts:501-651` is genuinely useful: real snapshot aggregation, sprint grouping, channel summaries, and readable text/JSON output.
- Ground truth is versioned in-repo via `mcp_server/lib/eval/data/ground-truth.json`, but the maintenance loop around it needs work.

## Bottom line

**Well-structured overall, but not fully trustworthy end-to-end yet.**  
The architecture is good; the biggest risks are **broken dataset maintenance**, **metric drift**, and **one invalid ablation runner path**.

