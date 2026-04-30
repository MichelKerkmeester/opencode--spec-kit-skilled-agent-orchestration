---
title: "PG-006 -- OUTPUT VERIFICATION Checklist Extraction (Debug)"
description: "Manual validation scenario for PG-006: OUTPUT VERIFICATION Checklist Extraction (Debug)."
feature_id: "PG-006"
category: "Profile Generator"
---

# PG-006 -- OUTPUT VERIFICATION Checklist Extraction (Debug)

This document captures the canonical manual-testing contract for `PG-006`.

---

## 1. OVERVIEW

This scenario validates that the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition.

---

## 2. SCENARIO CONTRACT

- Objective: Validate OUTPUT VERIFICATION Checklist Extraction (Debug) for the dynamic profile generation and extracted-rule scenarios.
- Real user request: `Validate that the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.outputChecks` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the profile generator against the documented agent definition; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: JSON output with `derivedChecks.outputChecks` array; Each entry has `id`, `check`, and `weight` fields; Items correspond to checklist entries from the debug agent's OUTPUT VERIFICATION section; At least 5 items extracted; Exit code is 0
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: `derivedChecks.outputChecks` array has >= 5 entries, each with `id`, `check`, and `weight` fields, corresponding to the debug agent's OUTPUT VERIFICATION section.

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
| PG-006 | OUTPUT VERIFICATION Checklist Extraction (Debug) | Validate OUTPUT VERIFICATION Checklist Extraction (Debug) | `` As a manual-testing orchestrator, validate that the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.outputChecks` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); oc=d[&#x27;derivedChecks&#x27;][&#x27;outputChecks&#x27;]; assert len(oc)&gt;=5, f&#x27;Only {len(oc)} outputChecks&#x27;; assert all(&#x27;id&#x27; in c and &#x27;check&#x27; in c and &#x27;weight&#x27; in c for c in oc); print(f&#x27;PASS: {len(oc)} outputChecks&#x27;)&quot; | JSON output with `derivedChecks.outputChecks` array; Each entry has `id`, `check`, and `weight` fields; Items correspond to checklist entries from the debug agent's OUTPUT VERIFICATION section; At least 5 items extracted; Exit code is 0 | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | `derivedChecks.outputChecks` array has >= 5 entries, each with `id`, `check`, and `weight` fields, corresponding to the debug agent's OUTPUT VERIFICATION section. | If `derivedChecks.outputChecks` is missing or empty: verify the section heading detection matches the exact heading in the debug agent file (case sensitivity, whitespace)<br>If entries lack `id`, `check`, or `weight` fields: inspect the profile generator&#x27;s output check extraction logic for incomplete field mapping<br>If items are missing: check that the parser handles both `- [ ]` and `- [x]` checkbox formats<br>If the script errors: confirm the debug agent file exists at `.opencode/agent/debug.md` |

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
| `02--profile-generator/006-output-checks.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/generate-profile.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Profile Generator
- Playbook ID: PG-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--profile-generator/006-output-checks.md`
