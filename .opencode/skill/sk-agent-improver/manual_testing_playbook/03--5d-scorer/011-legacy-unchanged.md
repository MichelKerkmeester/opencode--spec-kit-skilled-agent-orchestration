---
title: "Legacy Profile Mode Produces Identical Output"
feature_id: "5D-011"
category: "5D Scorer"
---

# Legacy Profile Mode Produces Identical Output

Validates that the legacy --profile mode produces output identical to the pre-refactor scorer, ensuring backward compatibility.

## Prompt / Command

```bash
node .opencode/skill/sk-agent-improver/scripts/score-candidate.cjs \
  --candidate=.opencode/agent/handover.md \
  --profile=handover \
  --target=.opencode/agent/handover.md
```

### Verification one-liner

```bash
node .opencode/skill/sk-agent-improver/scripts/score-candidate.cjs \
  --candidate=.opencode/agent/handover.md \
  --profile=handover \
  --target=.opencode/agent/handover.md \
  | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['evaluationMode']=='prompt-surface'; assert 'dimensions' not in d; print(f'PASS: legacy score={d[\"score\"]}')"
```

## Expected Signals

- `evaluationMode` field equals `"prompt-surface"`
- NO `dimensions` field in output (this is the pre-Phase-008 legacy format)
- `score` is a single numeric value
- `recommendation` is one of: `candidate-better`, `keep-baseline`, `tie`, `reject-candidate`
- `checks` object with `candidate` and `baseline` arrays
- Exit code is 0

## Pass Criteria

Output has `evaluationMode: "prompt-surface"`, NO `dimensions` field, same format as pre-Phase-008 scorer. Score is deterministic and matches the known baseline.

## Failure Triage

- If `dimensions` field appears: the refactor is accidentally merging dynamic 5D fields into legacy output; check the output serializer
- If `evaluationMode` is `"dynamic-5d"`: the `--profile` flag is being ignored in favor of `--dynamic` mode
- If `--profile` flag is not recognized: verify the argument parser still supports the legacy flag alongside `--dynamic`
- If the score differs from baseline: compare the scoring logic in the current version against the last known-good commit

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
