---
title: "EX-026 -- Ablation studies (eval_run_ablation)"
description: "This scenario validates Ablation studies (eval_run_ablation) for `EX-026`. It focuses on Channel impact experiment."
---

# EX-026 -- Ablation studies (eval_run_ablation)

## 1. OVERVIEW

This scenario validates Ablation studies (eval_run_ablation) for `EX-026`. It focuses on Full plus focused channel-impact verification.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-026` and confirm the expected signals without contradicting evidence.

- Objective: Full plus focused channel-impact verification
- Prompt: `Run one full ablation plus one focused fts5 ablation with an intentionally mixed query-ID subset. Capture the evidence needed to prove baseline recall, per-channel deltas, focused fts5 verdict, requested versus resolved versus missing query IDs, and provenance/truncation status are all reported, that the active eval DB matches the remapped ground-truth parent IDs, and that any run returning fewer than recallK candidates because of token-budget truncation is flagged as investigation-only rather than treated as a clean benchmark. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are all explicit
- Pass/fail: PASS if the runs either produce clean comparable metrics or clearly isolate why the benchmark is invalid

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-026 | Ablation studies (eval_run_ablation) | Full plus focused channel-impact verification | `Run one full ablation plus one focused fts5 ablation with an intentionally mixed query-ID subset. Capture the evidence needed to prove baseline recall, per-channel deltas, focused fts5 verdict, requested versus resolved versus missing query IDs, and provenance/truncation status are all reported, that the active eval DB matches the remapped ground-truth parent IDs, and that any run returning fewer than recallK candidates because of token-budget truncation is flagged as investigation-only rather than treated as a clean benchmark. Return a concise user-facing pass/fail verdict with the main reason.` | `eval_run_ablation({ mode:"ablation", storeResults:true, includeFormattedReport:true })` -> `eval_run_ablation({ mode:"ablation", channels:["fts5"], groundTruthQueryIds:[1,99999], storeResults:true, includeFormattedReport:true })` -> `eval_reporting_dashboard({ format:"json", limit:10 })` | Baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are explicit | Full ablation report, focused fts5 report with query-ID warnings, and dashboard output | PASS if the runs are cleanly comparable or the output isolates missing-ID/provenance/truncation invalidation before any channel verdict is trusted | Validate ground-truth mapping against the active parent-memory DB; inspect missing-query-ID warnings and runtime logs for token-budget truncation if Recall@K collapses |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [07--evaluation/01-ablation-studies-evalrunablation.md](../../feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: EX-026
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--evaluation/026-ablation-studies-eval-run-ablation.md`
