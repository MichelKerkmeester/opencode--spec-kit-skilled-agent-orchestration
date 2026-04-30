---
title: "IS-004 -- JSON Output File via --output Flag"
description: "Manual validation scenario for IS-004: JSON Output File via --output Flag."
feature_id: "IS-004"
category: "Integration Scanner"
---

# IS-004 -- JSON Output File via --output Flag

This document captures the canonical manual-testing contract for `IS-004`.

---

## 1. OVERVIEW

This scenario validates that the --output flag writes scan results to a valid JSON file at the specified path.

---

## 2. SCENARIO CONTRACT

- Objective: Validate JSON Output File via --output Flag for the scanner, mirror-alignment, and JSON-output scenarios.
- Real user request: `Validate that the --output flag writes scan results to a valid JSON file at the specified path.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the --output flag writes scan results to a valid JSON file at the specified path against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify File `/tmp/test-scan-output.json` is created after the command completes. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the integration scanner against the documented agent target; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: File `/tmp/test-scan-output.json` is created after the command completes; The file contains valid JSON (parseable without errors); JSON structure matches stdout output: `status`, `surfaces`, `summary` top-level fields; `surfaces.canonical.exists: true`, `surfaces.mirrors` array present; `summary.totalSurfaces`, `summary.mirrorSyncStatus` fields present
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: File exists at `/tmp/test-scan-output.json`, parses as valid JSON, and contains the same structure as stdout output (`status`, `surfaces`, `summary` fields).

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
| IS-004 | JSON Output File via --output Flag | Validate JSON Output File via --output Flag | `` As a manual-testing orchestrator, validate that the --output flag writes scan results to a valid JSON file at the specified path against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify File `/tmp/test-scan-output.json` is created after the command completes. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug --output=/tmp/test-scan-output.json &amp;&amp; cat /tmp/test-scan-output.json &#124; python3 -c &quot;import sys,json; json.load(sys.stdin); print(&#x27;Valid JSON&#x27;)&quot;<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug --output=/tmp/test-scan-output.json &amp;&amp; python3 -c &quot;import json; d=json.load(open(&#x27;/tmp/test-scan-output.json&#x27;)); assert d[&#x27;status&#x27;]==&#x27;complete&#x27;; assert &#x27;surfaces&#x27; in d; assert &#x27;summary&#x27; in d; print(&#x27;PASS: valid JSON with expected structure&#x27;)&quot; | File `/tmp/test-scan-output.json` is created after the command completes; The file contains valid JSON (parseable without errors); JSON structure matches stdout output: `status`, `surfaces`, `summary` top-level fields; `surfaces.canonical.exists: true`, `surfaces.mirrors` array present; `summary.totalSurfaces`, `summary.mirrorSyncStatus` fields present | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | File exists at `/tmp/test-scan-output.json`, parses as valid JSON, and contains the same structure as stdout output (`status`, `surfaces`, `summary` fields). | If the file is not created: check file write permissions and path resolution in the `--output` handler<br>If JSON is invalid: inspect the serialization logic for unescaped characters or truncated output<br>If structure differs from stdout: verify the `--output` code path serializes the same result object as the stdout code path<br>If the file is empty: verify that results are being passed to the file writer, not only to stdout |

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
| `01--integration-scanner/004-json-output-file.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/scan-integration.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Integration Scanner
- Playbook ID: IS-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--integration-scanner/004-json-output-file.md`
