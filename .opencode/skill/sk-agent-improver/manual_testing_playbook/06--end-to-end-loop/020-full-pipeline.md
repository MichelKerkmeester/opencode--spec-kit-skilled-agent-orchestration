---
title: "Full Pipeline Loop with Handover Target"
feature_id: "E2E-020"
category: "End-to-End Loop"
---

# Full Pipeline Loop with Handover Target

Validates the complete `/improve:agent-improver` loop end-to-end using the handover agent as the target.

## Prompt / Command

```text
/improve:agent-improver ".opencode/agent/handover.md" :confirm --spec-folder=specs/skilled-agent-orchestration/041-sk-agent-improver-loop/008-sk-agent-improver-holistic-evaluation --iterations=1
```

## Expected Signals

- Init phase creates `improvement/` directory with config, charter, strategy, and manifest
- Integration scan runs and produces `integration-report.json`
- Candidate generated under `improvement/candidates/`
- Score output produced (with or without `--dynamic` depending on profile)
- Dashboard generated at `improvement/agent-improvement-dashboard.md`
- Loop completes 1 iteration without errors

## Pass Criteria

All runtime artifacts present after 1 iteration (`improvement/` directory with config, charter, strategy, manifest, candidates, integration report, and dashboard), no errors in console output.

## Failure Triage

- If the pipeline stalls at a specific stage: run that stage's individual test (from its category folder) to isolate the failure
- If `improvement/` directory is not created: check the init phase logic and spec folder path resolution
- If integration scan fails: verify that `handover.md` is resolvable at the given path and the scanner can discover its surfaces
- If the command is not recognized: verify the skill is registered in `skill_advisor.py` and the command definition exists

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
