---
title: "PG-007 -- Inline NEVER Rules Fallback (No Dedicated Section)"
description: "Manual validation scenario for PG-007: Inline NEVER Rules Fallback (No Dedicated Section)."
feature_id: "PG-007"
category: "Profile Generator"
---

# PG-007 -- Inline NEVER Rules Fallback (No Dedicated Section)

This document captures the canonical manual-testing contract for `PG-007`.

---

## 1. OVERVIEW

This scenario validates that NEVER rules embedded inline (outside a dedicated RULES section) are still extracted as a fallback.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Inline NEVER Rules Fallback (No Dedicated Section) for the dynamic profile generation and extracted-rule scenarios.
- Real user request: `Validate that NEVER rules embedded inline (outside a dedicated RULES section) are still extracted as a fallback.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that NEVER rules embedded inline (outside a dedicated RULES section) are still extracted as a fallback against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.ruleCoherence` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the profile generator against the documented agent definition; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: JSON output with `derivedChecks.ruleCoherence` array; At least 1 entry with `type: "never"` extracted from inline "NEVER" patterns in the debug agent body text; The debug agent has no dedicated `## Rules` or `## Behavioral Rules` section, so these rules come from the body scan fallback; No false positives from code examples or quoted text
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: `derivedChecks.ruleCoherence` array contains at least 1 entry with `type: "never"` extracted via the body scan fallback (since the debug agent lacks a dedicated rules section).

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
| PG-007 | Inline NEVER Rules Fallback (No Dedicated Section) | Validate Inline NEVER Rules Fallback (No Dedicated Section) | `` As a manual-testing orchestrator, validate that NEVER rules embedded inline (outside a dedicated RULES section) are still extracted as a fallback against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.ruleCoherence` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); rc=d[&#x27;derivedChecks&#x27;][&#x27;ruleCoherence&#x27;]; nevers=[r for r in rc if r[&#x27;type&#x27;]==&#x27;never&#x27;]; assert len(nevers)&gt;=1, f&#x27;Only {len(nevers)} never-rules&#x27;; print(f&#x27;PASS: {len(nevers)} never-rules extracted via body scan&#x27;)&quot; | JSON output with `derivedChecks.ruleCoherence` array; At least 1 entry with `type: "never"` extracted from inline "NEVER" patterns in the debug agent body text; The debug agent has no dedicated `## Rules` or `## Behavioral Rules` section, so these rules come from the body scan fallback; No false positives from code examples or quoted text | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | `derivedChecks.ruleCoherence` array contains at least 1 entry with `type: "never"` extracted via the body scan fallback (since the debug agent lacks a dedicated rules section). | If `derivedChecks.ruleCoherence` has zero `type: &quot;never&quot;` entries: check whether the fallback regex scans the full document body or only specific sections<br>If false positives appear: tighten the pattern to exclude code blocks and quoted text<br>If the section-based extractor runs instead of fallback: verify the section detection correctly identifies when no dedicated rules section is present in the debug agent |

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
| `02--profile-generator/007-inline-rules-fallback.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/generate-profile.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Profile Generator
- Playbook ID: PG-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--profile-generator/007-inline-rules-fallback.md`
