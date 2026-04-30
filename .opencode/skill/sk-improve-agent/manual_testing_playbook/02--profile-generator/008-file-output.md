---
title: "PG-008 -- Profile JSON File Output via --output Flag"
description: "Manual validation scenario for PG-008: Profile JSON File Output via --output Flag."
feature_id: "PG-008"
category: "Profile Generator"
---

# PG-008 -- Profile JSON File Output via --output Flag

This document captures the canonical manual-testing contract for `PG-008`.

---

## 1. OVERVIEW

This scenario validates that the --output flag writes a valid profile JSON file for the review agent.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Profile JSON File Output via --output Flag for the dynamic profile generation and extracted-rule scenarios.
- Real user request: `Validate that the --output flag writes a valid profile JSON file for the review agent.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the --output flag writes a valid profile JSON file for the review agent against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify File `/tmp/test-profile.json` is created after the command completes. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the profile generator against the documented agent definition; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: File `/tmp/test-profile.json` is created after the command completes; The file contains valid JSON (parseable without errors); JSON structure includes top-level fields: `id`, `derivedChecks`, `agentMeta`; `derivedChecks` contains `ruleCoherence` and `outputChecks` sub-fields; Exit code is 0
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: File exists at `/tmp/test-profile.json`, parses as valid JSON, and contains the required top-level fields `id`, `derivedChecks`, and `agentMeta`.

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
| PG-008 | Profile JSON File Output via --output Flag | Validate Profile JSON File Output via --output Flag | `` As a manual-testing orchestrator, validate that the --output flag writes a valid profile JSON file for the review agent against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify File `/tmp/test-profile.json` is created after the command completes. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/review.md --output=/tmp/test-profile.json &amp;&amp; cat /tmp/test-profile.json &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); assert &#x27;id&#x27; in d and &#x27;derivedChecks&#x27; in d; print(&#x27;Valid profile&#x27;)&quot;<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/review.md --output=/tmp/test-profile.json &amp;&amp; python3 -c &quot;import json; d=json.load(open(&#x27;/tmp/test-profile.json&#x27;)); assert &#x27;id&#x27; in d; assert &#x27;derivedChecks&#x27; in d; assert &#x27;agentMeta&#x27; in d; print(f&#x27;PASS: id={d[\&quot;id\&quot;]}, keys={list(d.keys())}&#x27;)&quot; | File `/tmp/test-profile.json` is created after the command completes; The file contains valid JSON (parseable without errors); JSON structure includes top-level fields: `id`, `derivedChecks`, `agentMeta`; `derivedChecks` contains `ruleCoherence` and `outputChecks` sub-fields; Exit code is 0 | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | File exists at `/tmp/test-profile.json`, parses as valid JSON, and contains the required top-level fields `id`, `derivedChecks`, and `agentMeta`. | If the file is not created: check file write permissions and path handling in the `--output` logic<br>If JSON is invalid: inspect serialization for unescaped characters or incomplete writes<br>If `id` or `derivedChecks` are missing: verify the review agent file has parseable content and the generator produces these fields<br>If `agentMeta` is missing: check that the generator extracts metadata (agent name, source path) from the agent file header |

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
| `02--profile-generator/008-file-output.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/generate-profile.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/review.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Profile Generator
- Playbook ID: PG-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--profile-generator/008-file-output.md`
