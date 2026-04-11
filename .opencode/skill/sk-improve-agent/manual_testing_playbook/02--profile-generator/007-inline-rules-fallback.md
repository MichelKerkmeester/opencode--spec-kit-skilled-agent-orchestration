---
title: "Inline NEVER Rules Fallback (No Dedicated Section)"
feature_id: "PG-007"
category: "Profile Generator"
---

# Inline NEVER Rules Fallback (No Dedicated Section)

Validates that NEVER rules embedded inline (outside a dedicated RULES section) are still extracted as a fallback.

## Prompt / Command

```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md | python3 -c "import sys,json; d=json.load(sys.stdin); rc=d['derivedChecks']['ruleCoherence']; nevers=[r for r in rc if r['type']=='never']; assert len(nevers)>=1, f'Only {len(nevers)} never-rules'; print(f'PASS: {len(nevers)} never-rules extracted via body scan')"
```

## Expected Signals

- JSON output with `derivedChecks.ruleCoherence` array
- At least 1 entry with `type: "never"` extracted from inline "NEVER" patterns in the debug agent body text
- The debug agent has no dedicated `## Rules` or `## Behavioral Rules` section, so these rules come from the body scan fallback
- No false positives from code examples or quoted text

## Pass Criteria

`derivedChecks.ruleCoherence` array contains at least 1 entry with `type: "never"` extracted via the body scan fallback (since the debug agent lacks a dedicated rules section).

## Failure Triage

- If `derivedChecks.ruleCoherence` has zero `type: "never"` entries: check whether the fallback regex scans the full document body or only specific sections
- If false positives appear: tighten the pattern to exclude code blocks and quoted text
- If the section-based extractor runs instead of fallback: verify the section detection correctly identifies when no dedicated rules section is present in the debug agent

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
