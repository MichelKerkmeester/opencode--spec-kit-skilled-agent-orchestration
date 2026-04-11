---
title: "ALWAYS/NEVER Rules Extraction (Handover)"
feature_id: "PG-005"
category: "Profile Generator"
---

# ALWAYS/NEVER Rules Extraction (Handover)

Validates that the profile generator correctly extracts ALWAYS and NEVER behavioral rules from the handover agent definition.

## Prompt / Command

```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/handover.md
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/handover.md | python3 -c "import sys,json; d=json.load(sys.stdin); rc=d['derivedChecks']['ruleCoherence']; a=sum(1 for r in rc if r['type']=='always'); n=sum(1 for r in rc if r['type']=='never'); assert a>=3 and n>=2; print(f'PASS: {a} always, {n} never')"
```

## Expected Signals

- JSON output with `derivedChecks.ruleCoherence` array
- Each entry has `type` field set to `"always"` or `"never"` and a `rule` or `text` field with verbatim text from the agent file
- At least 3 entries with `type: "always"`
- At least 2 entries with `type: "never"`
- Exit code is 0

## Pass Criteria

`derivedChecks.ruleCoherence` array has >= 5 total entries, with at least 3 `type: "always"` and 2 `type: "never"` rules, each containing text matching the source agent file.

## Failure Triage

- If `derivedChecks.ruleCoherence` is missing or empty: check the regex patterns used to detect ALWAYS/NEVER keywords in the agent file
- If `type` field is missing: verify the profile generator annotates each rule with its `type` classification
- If counts are below threshold: inspect the handover agent file for ALWAYS/NEVER patterns and confirm the parser covers all formats (bold, uppercase, inline)
- If the script errors on file path: confirm the `--agent` path is resolved relative to the project root

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
