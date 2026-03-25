● skill(sk-code--review)

I’m loading the review/context guidance, then I’ll inspect the catalog files and trace each claimed feature into both `mcp_server` and `scripts` so the alignment call is evidence-based.

● skill(sk-code--opencode)

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ 98 lines read

● Read review_ux_single_pass.md
  │ .agents/skills/sk-code--review/references/review_ux_single_pass.md
  └ 82 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review ALL markdown files in
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/ and compare each
  │ described feature against implementations in .opencode/skill/system-spec-kit/mcp_server/ and
  │ .opencode/skill/system-spec-kit/scripts/ to flag mismatches." --threshold 0.8
  └ 43 lines...

I’ve got the review baseline loaded. Next I’m enumerating the 14 catalog entries and building an evidence map across both implementation trees so each status is tied to code, not just wording.

● List directory .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement
  └ 14 files found

● Read alignment_verification_automation.md
  │ .agents/skills/sk-code--opencode/references/shared/alignment_verification_automation.md
  └ 62 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/*.md"
  └ 14 files found

● search evaluation and measurement features in system-spec-kit, including preflight, postflight, l…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I found the 14 target files. I’m now doing two things in parallel: reading the catalog content itself and indexing the implementation surface for evaluation-related features, so the mismatch calls can be traced cleanly.

● Search (grep)
  │ "preflight|postflight|learning
  │ history|learning_history|task_preflight|task_postflight|ablation|dashboard|eval_metric|ground
  │ truth|ground_truth|bm25|observer|consumption|quantization|cross-ai|validation|score|scoring|metr
  │ ic" in *.{ts,js,py,sh,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "preflight|postflight|learning
  │ history|learning_history|task_preflight|task_postflight|ablation|dashboard|eval_metric|ground
  │ truth|ground_truth|bm25|observer|consumption|quantization|cross-ai|validation|score|scoring|metr
  │ ic" in *.{ts,js,py,sh,json,jsonc} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read all evaluation catalog markdown files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement')
  │ for p in sorted(base.glob('*.md')):
  │ print(f'===== {p.name} =====')…
  └ 12 lines...

● Create session plan and count catalog lines (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/7779bbf2-e972-4433-969f-2455e12fe7ba/plan.md'
  │ <<'EOF'
  │ 1. Read all 14 evaluation-and-measurement feature catalog markdown files.
  │ 2. Search both mcp_server and scripts for each described feature.…
  └ 20 lines...

● Read copilot-tool-output-1774456519587-bsyl8o.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456519587-bsyl8o.txt
  └ L1:260 (259 lines read)

● Read copilot-tool-output-1774456519587-bsyl8o.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456519587-bsyl8o.txt
  └ L261:520 (259 lines read)

● Read copilot-tool-output-1774456519587-bsyl8o.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456519587-bsyl8o.txt
  └ L521:900 (287 lines read)

I’ve read the catalog entries. Most are clearly “current reality” docs rather than aspirational specs, so the key now is validating the exact claims: counts, flags, tables, file names, and whether anything leaked into `scripts` or stayed `mcp_server`-only.

● Explore Cross-checking catalog
  └ Agent started in background with agent_id: catalog-alignment-review. You can ...

● Check referenced source files exist (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement')
  │ for p in sorted(base.glob('*.md')):…
  └ 101 lines...

● Search implementation terms across mcp_server and scripts (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ files = [
  │ ('01-evaluation-database-and-schema.md',['eval_queries','eval_channel_results','eval_final_res
  │ ults','eval_ground_truth','eval_metric_snapshots','SPECKIT_EVAL_LOGGING','memory_search','memo…
  └ 56 lines...

● Search (grep)
  │ "MRR|NDCG|Recall|Hit
  │ Rate|inversion|constitutional|importance|cold-start|Precision|F1|MAP|getRankAtIndex|intent" in
  │ eval-metrics.ts (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 5 lines found

● Search (grep)
  │ "eval_queries|eval_channel_results|eval_final_results|eval_ground_truth|eval_metric_snapshots|SP
  │ ECKIT_EVAL_LOGGING|memory_search|memory_context|memory_match_triggers" in eval-db.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 41 lines found

● Search (grep)
  │ "runShadowScoring|logShadowComparison|return null|return false|p95|10%|overhead" in
  │ shadow-scoring.ts (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 25 lines found

● Search (grep)
  │ "avgRelevance|topResult|countSaturation|latencyPenalty|0.40|0.25|0.20|0.15|quality
  │ proxy|correlation" in eval-quality-proxy.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 98 lines found

● Read copilot-tool-output-1774456604077-oks738.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456604077-oks738.txt
  └ L1:220 (140 lines read)

● Search (grep)
  │ "SPECKIT_EVAL_LOGGING|memory_search|memory_context|memory_match_triggers|logEval" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_EVAL_LOGGING|eval_run_ablation|eval_reporting_dashboard|task_preflight|task_postflight|
  │ captureMemoryStateBaselineSnapshot|SPECKIT_CONSUMPTION_LOG|scoring_observations|runShadowScoring
  │ |verify_alignment_drift" in *.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ 3 lines found

● Read copilot-tool-output-1774456610634-cfhfq9.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456610634-cfhfq9.txt
  └ L1:220 (138 lines read)

● Read copilot-tool-output-1774456610634-cfhfq9.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456610634-cfhfq9.txt
  └ L221:520 (123 lines read)

● Search (grep)
  │ "captureMemoryStateBaselineSnapshot|SPECKIT_ABLATION|eval_run_ablation|eval_reporting_dashboard|
  │ task_preflight|task_postflight" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "0.2083|ENABLE_BM25|FTS5|BM25|MRR" in bm25-baseline.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 5 lines found

● Search (grep)
  │ "110|intent|hard negative|G-NEW-2|complexity|hand-written|trigger phrases" in ground-truth-*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 123 lines found

● Search (grep)
  │ "SPECKIT_CONSUMPTION_LOG|isConsumptionLogEnabled|consumption_log|logConsumptionEvent" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "scoring_observations|SAMPLING_RATE|0.05|novelty|interference|console.error" in
  │ scoring-observability.ts (.opencode/skill/system-spec-kit/mcp_server/lib/telemetry)
  └ 5 lines found

● Read copilot-tool-output-1774456626051-w6xkqn.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456626051-w6xkqn.txt
  └ L1:160 (121 lines read)

● Read copilot-tool-output-1774456626056-apcq1p.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456626056-apcq1p.txt
  └ L1:220 (131 lines read)

● Read copilot-tool-output-1774456626049-hbl8fk.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456626049-hbl8fk.txt
  └ L1:220 (125 lines read)

● Search (grep)
  │ "captureMemoryStateBaselineSnapshot|memory-state-baseline|scopeDimensionsTracked|contextDbPath|p
  │ ersist: true|eval_metric_snapshots" in memory-state-baseline.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 59 lines found

● Search (grep)
  │ "0.2083|0\.208" in *.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "10000|50ms|1536|NO-GO|quantization|quantized|KL-divergence|7.1 MB|5.32%" in *.{ts,js,py,sh,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve confirmed a strong pattern already: these docs are mostly grounded in `mcp_server` code, while `scripts` is effectively uninvolved for this catalog slice. The remaining work is separating “accurate mcp_server-only documentation” from genuinely stale or unsupported claims.

✗ Search (grep)
  │ "task_preflight|task_postflight|phase IN \('preflight',
  │ 'complete'\)|MAX\(eval_run_id\)|cleanupExitHandlers|slice\(0, 32\)|parseArgs<|{} as T" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ rg: regex parse error:
    (?:task_preflight|task_postflight|phase IN \('preflight',
    'complete'\)|MAX\(eval_run_id\)|cleanupExitHandlers|slice\(0, 32\)|parseArgs<|{} as T)
    ^
    error: repetition operator missing expression

● Search (grep)
  │ "eval_run_ablation|eval_reporting_dashboard|SPECKIT_ABLATION|Recall@20|sign test|negative
  │ timestamp|isHigherBetter|tokenUsage|finite|limit" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "skipIf|parent_id IS NULL|Number\.isFinite|SPECKIT_DASHBOARD_LIMIT|SPEC_KIT_DB_DIR|SPECKIT_DB_DI
  │ R|cache.*embedding|embedding.*cache" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "int8|INT8|quantization|quantized|NO-GO|p95 latency|1536|10000" in *.{ts,md,py,sh}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

The independent cross-check finished, so I’m pulling that in now and reconciling it with the direct code evidence before I finalize the per-file statuses.

● Read (Explore agent — Cross-checking catalog)
  └ idle

● Read copilot-tool-output-1774456656285-wz2ego.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456656285-wz2ego.txt
  └ L1:220 (115 lines read)

● Read copilot-tool-output-1774456656286-dvttv7.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456656286-dvttv7.txt
  └ L1:220 (138 lines read)

● Search (glob)
  │ "**/*eval*.{ts,js,py,sh}" in .opencode/skill/system-spec-kit/scripts
  └ No matches found

● Search (glob)
  │ "**/*ablation*.{ts,js,py,sh}" in .opencode/skill/system-spec-kit/scripts
  └ 1 file found

● Search (glob)
  │ "**/*bm25*.{ts,js,py,sh}" in .opencode/skill/system-spec-kit/scripts
  └ 1 file found

● Search (glob)
  │ "**/*ground*truth*.{ts,js,py,sh}" in .opencode/skill/system-spec-kit/scripts
  └ 1 file found

I found a small but important nuance: `scripts/evals/` does exist, but only for a few evaluation features (`run-ablation.ts`, `run-bm25-baseline.ts`, `map-ground-truth-ids.ts`). So some entries are pure `mcp_server` features, while a few genuinely span both trees.

● Read run-ablation.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts
  └ 181 lines read

● Read run-bm25-baseline.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts
  └ 184 lines read

● Read map-ground-truth-ids.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts
  └ 501 lines read

● Search (grep)
  │ "sort\(|topK|feedback|slice\(0,|parent_id IS
  │ NULL|SPECKIT_DASHBOARD_LIMIT|SPEC_KIT_DB_DIR|SPECKIT_DB_DIR" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Search (grep)
  │ "task_preflight|task_postflight" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "phase IN \('preflight', 'complete'\)" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 17 lines found

● Search (grep)
  │ "MAX\(eval_run_id\)|cleanupExitHandlers|slice\(0, 32\)|parseArgs\<|\{\} as T" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 81 lines found

● Read copilot-tool-output-1774456696113-id4vw2.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456696113-id4vw2.txt
  └ L1:200 (135 lines read)

● Read copilot-tool-output-1774456696113-5ehem0.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456696113-5ehem0.txt
  └ L1:160 (112 lines read)

● Search (grep)
  │ "feedback|sort\(|slice\(0,|topK|top-K" in stage2-fusion.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 110 lines found

● Search (grep)
  │ "SPECKIT_DASHBOARD_LIMIT|getEvalDb\(|initEvalDb\(|isHigherBetter|Number\.isFinite|token" in
  │ reporting-dashboard.ts (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 24 lines found

● Search (grep)
  │ "parent_id IS NULL|AND parent_id IS NULL" in vector-index-queries.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_DB_DIR|SPEC_KIT_DB_DIR|cache|embedding readiness|Number\.isFinite" in
  │ {search/hybrid-search.ts,config/index.ts,config/*.ts,search/evidence-gap-detector.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ No matches found

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L930:1015 (86 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L556:640 (85 lines read)

● Search (grep)
  │ "parent_id IS NULL"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ 5 lines found

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|cache|embedding readiness|Number\.isFinite"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 101 lines found

● Search (grep)
  │ "Number\.isFinite"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts)
  └ 11 lines found

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/config)
  └ No matches found

● Search (grep)
  │ "cache|embedding|readiness|ready"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 5 lines found

● Search (grep)
  │ "5000|15000|db\.close|T007|skipIf|z_archive|7027|7003" in
  │ {memory-save-extended.vitest.ts,entity-linker.vitest.ts,integration-search-pipeline.vitest.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Read copilot-tool-output-1774456736023-e1jys8.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456736023-e1jys8.txt
  └ L1:180 (140 lines read)

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read copilot-tool-output-1774456736025-1eznxo.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456736025-1eznxo.txt
  └ L1:220 (125 lines read)

✗ Search (grep)
  │ "-Math\.floor\(Date\.now\(|negative|evalRunId|eval_run_id|Date\.now\(\) / 1000"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ rg: error parsing flag -M: value is not a valid number: invalid digit found in string

● Search (grep)
  │ "15000|timeout"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts)
  └ 5 lines found

● Search (grep)
  │ "z_archive" (.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts)
  └ 5 lines found

● Search (grep)
  │ "40|manual|hard_negative|queries"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts)
  └ 31 lines found

● Search (grep)
  │ "Date\.now\(\) / 1000|evalRunId|eval_run_id|timestamp"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 72 lines found

● Search (grep)
  │ "eval_run_ablation|eval_reporting_dashboard" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "5000|15000|db\.close\(|skipIf|T007|7027|7003" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Count ground truth dataset stats (shell)
  │ python3 - <<'PY'
  │ import json
  │ from pathlib import Path
  │ p=Path('.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json')
  │ data=json.loads(p.read_text())…
  └ 14 lines...

● Read copilot-tool-output-1774456765131-3gryom.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456765131-3gryom.txt
  └ L1:180 (125 lines read)

● Read copilot-tool-output-1774456765128-1mimxv.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456765128-1mimxv.txt
  └ L1:220 (139 lines read)

● Search (grep)
  │ "id != null" (.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
  └ 29 lines found

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "cache.*embedding|embedding.*cache|cache lookup|ready|readiness"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 9 lines found

● Search (grep)
  │ "recallK" (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 54 lines found

● Search (grep)
  │ "sortDeterministicRows|feedbackSignalsApplied"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 58 lines found

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR" in *.ts (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read copilot-tool-output-1774456793931-amztqu.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456793931-amztqu.txt
  └ L1:160 (132 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L1348:1366 (19 lines read)

● Search (grep)
  │ "parent_id IS NULL"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ 9 lines found

● Search (grep)
  │ "correlation|manual ground truth|quality proxy|tracks real quality" in *.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "p95 latency|Measure p95 latency|10% overhead" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 17 lines found

I hit one real discrepancy: the observer-effect doc says the formal p95 / `>10%` overhead check is “not implemented,” but there is dedicated benchmark coverage in `mcp_server/tests/eval-logger.vitest.ts`. I’m checking whether that’s test-only evidence or an actual feature mismatch before classing it.

● Read eval-logger.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts
  └ L360:470 (111 lines read)

● Read copilot-tool-output-1774456812528-uyoivo.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456812528-uyoivo.txt
  └ L1:180 (131 lines read)

● Search (grep)
  │ "correlation|tracks real quality|manual ground truth|quality proxy" in *.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "chunk rows|exclude chunk|parent_id IS NULL|duplicate|dedup"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ 5 lines found

● Search (grep)
  │ "5000ms|15000ms|7027|7003|24 tests|dead-code features" in *.{ts,md}
  │ (.opencode/skill/system-spec-kit)
  └ 27 lines found

● Search (grep)
  │ "correlation testing|tracks real quality|manual ground truth corpus|manual ground truth" in
  │ *.{ts,md} (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Search (grep)
  │ "SPECKIT_EVAL_LOGGING" in *.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "0\.2083|0\.208|0\.20"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts)
  └ 6 lines found

● Search (grep)
  │ "manual ground truth|correlation|quality proxy"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts)
  └ 11 lines found

● Search (grep)
  │ "5%|0\.05|scoring_observations|novelty|interference" in *.{ts,js,py,sh}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 65 lines found

● Search (grep)
  │ "110 queries|40|hard_negative|manualQueryCount|byIntentType|byComplexityTier"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts)
  └ 99 lines found

● Read 03-observer-effect-mitigation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effec
  │ t-mitigation.md
  └ L1:120 (53 lines read)

● Read 05-quality-proxy-formula.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-
  │ formula.md
  └ L1:120 (54 lines read)

● Read 16-int8-quantization-evaluation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/16-int8-quantizat
  │ ion-evaluation.md
  └ L1:120 (36 lines read)

● Read 14-cross-ai-validation-fixes.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-valid
  │ ation-fixes.md
  └ L1:160 (72 lines read)

● Read 12-test-quality-improvements.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-i
  │ mprovements.md
  └ L1:120 (60 lines read)

● Read 10-full-reporting-and-ablation-study-framework.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting
  │ -and-ablation-study-framework.md
  └ L1:120 (60 lines read)

● Search (grep)
  │ "cache|embedding readiness|waitForEmbeddingModel|isEmbeddingModelReady"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 33 lines found

● Search (grep)
  │ "partial.*transaction|withTransaction|BEGIN|rollback"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts)
  └ 5 lines found

● Search (grep)
  │ "skipIf\(" (.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts)
  └ 1 file found

```text
01-evaluation-database-and-schema.md | ALIGNED | Five-table eval schema and fail-safe logging exist in `mcp_server/lib/eval/eval-db.ts` and handlers; no `scripts` implementation found, which matches the doc’s mcp_server-only scope.
02-core-metric-computation.md | ALIGNED | `mcp_server/lib/eval/eval-metrics.ts` implements contiguous rank (`index + 1`) and the documented metric set; no scripts-side counterpart is expected.
03-observer-effect-mitigation.md | PARTIAL | Fail-safe degradation and disabled shadow-write paths match, but the doc says formal p95 / `>10%` overhead comparison is not implemented; benchmark tests for that exist in `mcp_server/tests/eval-logger.vitest.ts`.
05-quality-proxy-formula.md | PARTIAL | The formula and weights match `mcp_server/lib/eval/eval-quality-proxy.ts`; I found no source evidence for the claim that correlation testing against the manual ground-truth corpus confirmed the proxy.
06-synthetic-ground-truth-corpus.md | ALIGNED | Dataset, generator gates, and `scripts/evals/map-ground-truth-ids.ts` all exist; current JSON stats are consistent with the doc.
07-bm25-only-baseline.md | ALIGNED | Both the baseline implementation and `scripts/evals/run-bm25-baseline.ts` runner are present.
08-agent-consumption-instrumentation.md | ALIGNED | `consumption_log`, default-on flag behavior, and handler wiring are present; no scripts implementation is expected.
09-scoring-observability.md | ALIGNED | `SAMPLING_RATE = 0.05`, `scoring_observations`, novelty/interference fields, and fail-safe logging all match; mcp_server-only is consistent.
10-full-reporting-and-ablation-study-framework.md | ALIGNED | Ablation/reporting code, MCP tools, negative timestamp run IDs, finite token filtering, and `scripts/evals/run-ablation.ts` all exist.
12-test-quality-improvements.md | PARTIAL | Timeout hardening, `db.close()`, flag-test rewrites, and `/z_archive/` exclusion exist; the broader “18+ files updated” and `7027 -> 7003` / 24-test-deletion claims are not verifiable from the current source snapshot.
13-evaluation-and-housekeeping-fixes.md | ALIGNED | Session-learning phase fix, `parseArgs` object guard, 128-bit dedup hash, exit-handler cleanup, and eval-run bootstrap logic all match.
14-cross-ai-validation-fixes.md | PARTIAL | Most fixes are present (`skipIf`, re-sort, `id != null`, cache-before-embedding gate, env fallback, dashboard/evidence guards), but some catalog specifics drift: cache-ordering lands in `handlers/memory-search.ts`, and the exact `AND parent_id IS NULL` wording is only partially reflected (`parent.parent_id IS NULL` in `vector-index-queries.ts`).
15-memory-roadmap-baseline-snapshot.md | ALIGNED | `captureMemoryStateBaselineSnapshot()` and `eval_metric_snapshots` persistence exist; no scripts counterpart is expected.
16-int8-quantization-evaluation.md | ALIGNED | Correctly documented as a decision record with no dedicated `mcp_server` / `scripts` source files.

SUMMARY: total 14, aligned 10, partial 4, misaligned 0, P0 0, P1 1, P2 3
```

