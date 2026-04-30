---
title: "PG-005 -- ALWAYS/NEVER Rules Extraction"
description: "Manual validation scenario for PG-005: ALWAYS/NEVER Rules Extraction."
feature_id: "PG-005"
category: "Profile Generator"
---

# PG-005 -- ALWAYS/NEVER Rules Extraction

This document captures the canonical manual-testing contract for `PG-005`.

---

## 1. OVERVIEW

This scenario validates that the profile generator correctly extracts ALWAYS and NEVER behavioral rules from a target agent definition.

---

## 2. SCENARIO CONTRACT

- Objective: Validate ALWAYS/NEVER Rules Extraction for the dynamic profile generation and extracted-rule scenarios.
- Real user request: `Validate that the profile generator correctly extracts ALWAYS and NEVER behavioral rules from a target agent definition.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the profile generator correctly extracts ALWAYS and NEVER behavioral rules from a target agent definition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.ruleCoherence` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the profile generator against the documented agent definition; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: JSON output with `derivedChecks.ruleCoherence` array; Each entry has `type` field set to `"always"` or `"never"` and a `rule` or `text` field with verbatim text from the agent file; At least 3 entries with `type: "always"`; At least 2 entries with `type: "never"`; Exit code is 0
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: `derivedChecks.ruleCoherence` array has >= 5 total entries, with at least 3 `type: "always"` and 2 `type: "never"` rules, each containing text matching the source agent file.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PG-005 | ALWAYS/NEVER Rules Extraction | Validate ALWAYS/NEVER Rules Extraction | `` As a manual-testing orchestrator, validate that the profile generator correctly extracts ALWAYS and NEVER behavioral rules from a target agent definition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.ruleCoherence` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); rc=d[&#x27;derivedChecks&#x27;][&#x27;ruleCoherence&#x27;]; a=sum(1 for r in rc if r[&#x27;type&#x27;]==&#x27;always&#x27;); n=sum(1 for r in rc if r[&#x27;type&#x27;]==&#x27;never&#x27;); assert a&gt;=3 and n&gt;=2; print(f&#x27;PASS: {a} always, {n} never&#x27;)&quot; | JSON output with `derivedChecks.ruleCoherence` array; Each entry has `type` field set to `"always"` or `"never"` and a `rule` or `text` field with verbatim text from the agent file; At least 3 entries with `type: "always"`; At least 2 entries with `type: "never"`; Exit code is 0 | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | `derivedChecks.ruleCoherence` array has >= 5 total entries, with at least 3 `type: "always"` and 2 `type: "never"` rules, each containing text matching the source agent file. | If `derivedChecks.ruleCoherence` is missing or empty: check the regex patterns used to detect ALWAYS/NEVER keywords in the agent file<br>If `type` field is missing: verify the profile generator annotates each rule with its `type` classification<br>If counts are below threshold: inspect the target agent file for ALWAYS/NEVER patterns and confirm the parser covers all formats (bold, uppercase, inline)<br>If the script errors on file path: confirm the `--agent` path is resolved relative to the project root |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `02--profile-generator/005-rules-extraction.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/generate-profile.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Profile Generator
- Playbook ID: PG-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--profile-generator/005-rules-extraction.md`
