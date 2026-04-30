---
title: "EX-027 -- Reporting dashboard (eval_reporting_dashboard)"
description: "This scenario validates Reporting dashboard (eval_reporting_dashboard) for `EX-027`. It focuses on Eval reporting pass."
---

# EX-027 -- Reporting dashboard (eval_reporting_dashboard)

## 1. OVERVIEW

This scenario validates Reporting dashboard (eval_reporting_dashboard) for `EX-027`. It focuses on Eval reporting pass.

---

## 2. SCENARIO CONTRACT


- Objective: Eval reporting pass.
- Real user request: `` Please validate Reporting dashboard (eval_reporting_dashboard) against eval_reporting_dashboard({ format:"text", limit:2 }) and tell me whether the expected signals are present: Trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; sprint grouping uses recency selection by `lastSeen` while report order stays chronological; chunk-backed rows aggregate to parent memory IDs. ``
- RCAF Prompt: `As an evaluation validation operator, validate Reporting dashboard (eval_reporting_dashboard) against eval_reporting_dashboard({ format:"text", limit:2 }). Verify trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; sprint grouping uses recency selection by lastSeen while report order stays chronological; chunk-backed rows aggregate to parent memory IDs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; sprint grouping uses recency selection by `lastSeen` while report order stays chronological; chunk-backed rows aggregate to parent memory IDs
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if report generated without error in supported format and latest rows stay parent-memory-normalized

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, validate Eval reporting pass against eval_reporting_dashboard({ format:"text", limit:2 }). Verify trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; most recent sprint groups are selected by lastSeen while output remains chronological; chunk-backed rows aggregate to parent memory IDs. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. eval_reporting_dashboard({ format:"text", limit:2 })` and `eval_reporting_dashboard({ format:"json", limit:2 })

### Expected

Trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; most recent sprint groups are selected by `lastSeen` while output remains chronological; chunk-backed rows aggregate to parent memory IDs

### Evidence

Dashboard output in text and JSON plus source-backed confirmation of parent-memory normalization and sprint ordering if needed

### Pass / Fail

- **Pass**: report generates without error in supported formats and the kept sprint groups plus ordering semantics match the documented contract
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Retry with `format:"json"` or `format:"text"`; inspect `handlers/eval-reporting.ts` and `lib/eval/reporting-dashboard.ts` if chunk IDs leak through or sprint ordering contradicts recency selection

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [07--evaluation/02-reporting-dashboard-evalreportingdashboard.md](../../feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md)

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: EX-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md`
- audited_post_018: true
- phase_018_change: post-018 audit verified against `mcp_server/handlers/eval-reporting.ts`, `mcp_server/lib/eval/reporting-dashboard.ts`, `mcp_server/tests/reporting-dashboard.vitest.ts`, and `mcp_server/tests/handler-eval-reporting.vitest.ts`
