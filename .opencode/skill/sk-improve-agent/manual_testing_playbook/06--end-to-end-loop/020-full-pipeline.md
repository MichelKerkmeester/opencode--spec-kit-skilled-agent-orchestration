---
title: "Full Pipeline Loop with Debug Target"
feature_id: "E2E-020"
category: "End-to-End Loop"
---

# Full Pipeline Loop with Debug Target

Validates the complete `/improve:improve-agent` loop end-to-end using the debug agent as the target.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate the complete /improve:improve-agent loop end-to-end using the debug agent as the target against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Init phase creates `improvement/` directory with config, charter, strategy, and manifest. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```text
/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder=specs/skilled-agent-orchestration/041-sk-improve-agent-loop/008-sk-improve-agent-holistic-evaluation --iterations=1
```

## Expected

- Init phase creates `improvement/` directory with config, charter, strategy, and manifest
- Integration scan runs and produces `integration-report.json`
- Candidate generated under `improvement/candidates/`
- Score output produced via dynamic-mode 5-dimension scoring
- Dashboard generated at `improvement/agent-improvement-dashboard.md`
- Loop completes 1 iteration without errors

## Pass Criteria

All runtime artifacts present after 1 iteration (`improvement/` directory with config, charter, strategy, manifest, candidates, integration report, and dashboard), no errors in console output.

## Failure Triage

- If the pipeline stalls at a specific stage: run that stage's individual test (from its category folder) to isolate the failure
- If `improvement/` directory is not created: check the init phase logic and spec folder path resolution
- If integration scan fails: verify that `debug.md` is resolvable at the given path and the scanner can discover its surfaces
- If the command is not recognized: verify the skill is registered in `skill_advisor.py` and the command definition exists

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
