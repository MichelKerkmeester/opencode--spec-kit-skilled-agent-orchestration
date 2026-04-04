---
title: "Profile JSON File Output via --output Flag"
feature_id: "PG-008"
category: "Profile Generator"
---

# Profile JSON File Output via --output Flag

Validates that the --output flag writes a valid profile JSON file for the review agent.

## Prompt / Command

```bash
node .opencode/skill/sk-agent-improver/scripts/generate-profile.cjs --agent=.opencode/agent/review.md --output=/tmp/test-profile.json && cat /tmp/test-profile.json | python3 -c "import sys,json; d=json.load(sys.stdin); assert 'id' in d and 'derivedChecks' in d; print('Valid profile')"
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-agent-improver/scripts/generate-profile.cjs --agent=.opencode/agent/review.md --output=/tmp/test-profile.json && python3 -c "import json; d=json.load(open('/tmp/test-profile.json')); assert 'id' in d; assert 'derivedChecks' in d; assert 'agentMeta' in d; print(f'PASS: id={d[\"id\"]}, keys={list(d.keys())}')"
```

## Expected Signals

- File `/tmp/test-profile.json` is created after the command completes
- The file contains valid JSON (parseable without errors)
- JSON structure includes top-level fields: `id`, `derivedChecks`, `agentMeta`
- `derivedChecks` contains `ruleCoherence` and `outputChecks` sub-fields
- Exit code is 0

## Pass Criteria

File exists at `/tmp/test-profile.json`, parses as valid JSON, and contains the required top-level fields `id`, `derivedChecks`, and `agentMeta`.

## Failure Triage

- If the file is not created: check file write permissions and path handling in the `--output` logic
- If JSON is invalid: inspect serialization for unescaped characters or incomplete writes
- If `id` or `derivedChecks` are missing: verify the review agent file has parseable content and the generator produces these fields
- If `agentMeta` is missing: check that the generator extracts metadata (agent name, source path) from the agent file header

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
