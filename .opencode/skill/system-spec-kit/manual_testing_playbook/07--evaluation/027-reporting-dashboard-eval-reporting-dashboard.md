---
title: "EX-027 -- Reporting dashboard (eval_reporting_dashboard)"
description: "This scenario validates Reporting dashboard (eval_reporting_dashboard) for `EX-027`. It focuses on Eval reporting pass."
---

# EX-027 -- Reporting dashboard (eval_reporting_dashboard)

## 1. OVERVIEW

This scenario validates Reporting dashboard (eval_reporting_dashboard) for `EX-027`. It focuses on Eval reporting pass.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-027` and confirm the expected signals without contradicting evidence.

- Objective: Eval reporting pass
- Prompt: `Generate the latest dashboard report. Capture the evidence needed to prove Trend/channel/summary data present in supported runtime formats, the active eval DB remains selected, request limit trims sprint groups rather than raw runs, and chunk-backed eval rows roll up to parent memory IDs instead of transient chunk IDs. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; chunk-backed rows aggregate to parent memory IDs
- Pass/fail: PASS if report generated without error in supported format and latest rows stay parent-memory-normalized

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-027 | Reporting dashboard (eval_reporting_dashboard) | Eval reporting pass | `Generate the latest dashboard report. Capture the evidence needed to prove Trend/channel/summary data present in supported runtime formats, the active eval DB remains selected, request limit trims sprint groups rather than raw runs, and chunk-backed eval rows roll up to parent memory IDs instead of transient chunk IDs. Return a concise user-facing pass/fail verdict with the main reason.` | `eval_reporting_dashboard(format:text)` and `eval_reporting_dashboard(format:json)` | Trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; chunk-backed rows aggregate to parent memory IDs | Dashboard output in text or JSON plus source-backed confirmation of parent-memory normalization if needed | PASS if report generated without error in supported format and latest rows stay parent-memory-normalized | Retry with `format:json` or `format:text`; inspect `handlers/eval-reporting.ts` and stored eval rows if chunk IDs leak through |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [07--evaluation/02-reporting-dashboard-evalreportingdashboard.md](../../feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md)

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: EX-027
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md`
