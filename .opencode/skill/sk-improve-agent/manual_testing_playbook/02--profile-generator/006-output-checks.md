---
title: "OUTPUT VERIFICATION Checklist Extraction (Debug)"
feature_id: "PG-006"
category: "Profile Generator"
---

# OUTPUT VERIFICATION Checklist Extraction (Debug)

Validates that the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate that the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.outputChecks` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md | python3 -c "import sys,json; d=json.load(sys.stdin); oc=d['derivedChecks']['outputChecks']; assert len(oc)>=5, f'Only {len(oc)} outputChecks'; assert all('id' in c and 'check' in c and 'weight' in c for c in oc); print(f'PASS: {len(oc)} outputChecks')"
```

## Expected

- JSON output with `derivedChecks.outputChecks` array
- Each entry has `id`, `check`, and `weight` fields
- Items correspond to checklist entries from the debug agent's OUTPUT VERIFICATION section
- At least 5 items extracted
- Exit code is 0

## Pass Criteria

`derivedChecks.outputChecks` array has >= 5 entries, each with `id`, `check`, and `weight` fields, corresponding to the debug agent's OUTPUT VERIFICATION section.

## Failure Triage

- If `derivedChecks.outputChecks` is missing or empty: verify the section heading detection matches the exact heading in the debug agent file (case sensitivity, whitespace)
- If entries lack `id`, `check`, or `weight` fields: inspect the profile generator's output check extraction logic for incomplete field mapping
- If items are missing: check that the parser handles both `- [ ]` and `- [x]` checkbox formats
- If the script errors: confirm the debug agent file exists at `.opencode/agent/debug.md`

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
