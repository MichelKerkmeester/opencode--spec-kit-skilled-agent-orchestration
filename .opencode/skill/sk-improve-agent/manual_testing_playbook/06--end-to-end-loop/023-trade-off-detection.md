---
title: "Trade-Off Detection Across Dimensions"
feature_id: "E2E-023"
category: "End-to-End Loop"
---

# Trade-Off Detection Across Dimensions

Validates that the improvement loop detects when a mutation improves one dimension at the cost of another, reports the trade-off explicitly, and does not auto-promote candidates with unresolved trade-offs.

## Prompt / Command

```text
/improve:agent ".opencode/agent/debug.md" :confirm --spec-folder=specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --iterations=3
```

## Expected Signals

- Dimension trajectory tracked per iteration (at least 3 data points before convergence claim)
- Trade-off detected when one dimension delta is positive and another is negative beyond threshold
- Trade-off report includes: affected dimensions, magnitude of change, Pareto assessment
- Journal emits `trade-off-detected` event with structured data
- Candidate with unresolved trade-off is flagged for human review, not auto-promoted
- Dashboard shows dimension trajectories with trade-off annotations

## Pass Criteria

When a candidate improves ruleCoherence but regresses integration, the trade-off detector fires a `trade-off-detected` journal event identifying both dimensions and the direction of change -- the candidate is not auto-promoted and the operator sees a clear trade-off warning.

## Failure Triage

- If no trade-off is detected when expected: check threshold configuration in `tradeOff.thresholds` and verify the dimension deltas are computed correctly
- If trade-off is detected but candidate is auto-promoted: check the promotion gate for the trade-off block condition
- If trajectory has insufficient data points: verify minimum 3 data points enforcement before trade-off computation
- If journal event is missing: check that `improvement-journal.cjs` emits `trade-off-detected` event type and the orchestrator calls the emitter

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output showing trade-off detection and dimension trajectories]
```
