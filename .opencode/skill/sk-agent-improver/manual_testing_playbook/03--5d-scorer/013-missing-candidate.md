---
title: "Missing Candidate File Returns infra_failure"
feature_id: "5D-013"
category: "5D Scorer"
---

# Missing Candidate File Returns infra_failure

Validates that providing a nonexistent candidate file results in an infra_failure status and exit code 1.

## Prompt / Command

```bash
node .opencode/skill/sk-agent-improver/scripts/score-candidate.cjs \
  --candidate=nonexistent-file.md --dynamic; echo "Exit: $?"
```

## Expected Signals

- Exit code is 1 (not 0)
- Output is valid JSON (no stack trace)
- `status` field equals `"infra_failure"`
- `failureModes` array contains `"profile-generation-failure"`
- No unhandled exception or stack trace is printed

## Pass Criteria

Graceful error output (valid JSON) with `status: "infra_failure"`, `failureModes: ["profile-generation-failure"]`, and exit code 1. No stack trace in output.

## Failure Triage

- If exit code is 0: the script is not validating file existence before scoring
- If output is not valid JSON or a stack trace appears: add try/catch around the file-read step with proper error classification and JSON error envelope
- If exit code is 2 instead of 1: review the exit code convention (1 = infra failure, 2 = scoring failure)
- If `failureModes` is missing or empty: check the error path in the dynamic profile generation pipeline

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
