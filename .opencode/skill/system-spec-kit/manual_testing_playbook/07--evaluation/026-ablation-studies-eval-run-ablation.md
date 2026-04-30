---
title: "EX-026 -- Ablation studies (eval_run_ablation)"
description: "This scenario validates Ablation studies (eval_run_ablation) for `EX-026`. It focuses on Channel impact experiment."
---

# EX-026 -- Ablation studies (eval_run_ablation)

## 1. OVERVIEW

This scenario validates Ablation studies (eval_run_ablation) for `EX-026`. It focuses on Full plus focused channel-impact verification.

---

## 2. SCENARIO CONTRACT


- Objective: Full plus focused channel-impact verification.
- Real user request: `Please validate Ablation studies (eval_run_ablation) against eval_run_ablation({ mode:"ablation", storeResults:true, includeFormattedReport:true }) and tell me whether the expected signals are present: Baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are all explicit.`
- RCAF Prompt: `As an evaluation validation operator, validate Ablation studies (eval_run_ablation) against eval_run_ablation({ mode:"ablation", storeResults:true, includeFormattedReport:true }). Verify baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are all explicit. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are all explicit
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the runs either produce clean comparable metrics or clearly isolate why the benchmark is invalid

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, validate Full plus focused channel-impact verification against eval_run_ablation({ mode:"ablation", storeResults:true, includeFormattedReport:true }). Verify baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are explicit. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. eval_run_ablation({ mode:"ablation", storeResults:true, includeFormattedReport:true })
2. eval_run_ablation({ mode:"ablation", channels:["fts5"], groundTruthQueryIds:[1,99999], storeResults:true, includeFormattedReport:true })
3. eval_reporting_dashboard({ format:"json", limit:10 })

### Expected

Baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are explicit

### Evidence

Full ablation report, focused fts5 report with query-ID warnings, and dashboard output

### Pass / Fail

- **Pass**: the runs are cleanly comparable or the output isolates missing-ID/provenance/truncation invalidation before any channel verdict is trusted
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Validate ground-truth mapping against the active parent-memory DB; inspect missing-query-ID warnings and runtime logs for token-budget truncation if Recall@K collapses

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [07--evaluation/01-ablation-studies-evalrunablation.md](../../feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: EX-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--evaluation/026-ablation-studies-eval-run-ablation.md`
- audited_post_018: true
- phase_018_change: post-018 audit verified against `mcp_server/handlers/eval-reporting.ts`, `mcp_server/lib/eval/ablation-framework.ts`, `mcp_server/lib/eval/k-value-analysis.ts`, `mcp_server/tests/ablation-framework.vitest.ts`, and `mcp_server/tests/handler-eval-reporting.vitest.ts`
