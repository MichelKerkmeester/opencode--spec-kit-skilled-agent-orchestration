---
title: "IS-002 -- Scan Missing Agent (Nonexistent)"
description: "Manual validation scenario for IS-002: Scan Missing Agent (Nonexistent)."
feature_id: "IS-002"
category: "Integration Scanner"
---

# IS-002 -- Scan Missing Agent (Nonexistent)

This document captures the canonical manual-testing contract for `IS-002`.

---

## 1. OVERVIEW

This scenario validates that scanning a nonexistent agent produces graceful error handling instead of a crash.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Scan Missing Agent (Nonexistent) for the scanner, mirror-alignment, and JSON-output scenarios.
- Real user request: `Validate that scanning a nonexistent agent produces graceful error handling instead of a crash.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that scanning a nonexistent agent produces graceful error handling instead of a crash against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"` (exit code 0 -- the script completes gracefully, it does not crash). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the integration scanner against the documented agent target; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `status: "complete"` (exit code 0 -- the script completes gracefully, it does not crash); `surfaces.canonical.exists: false`; All entries in `surfaces.mirrors` have `syncStatus: "missing"`; `summary.missingCount > 0`; No unhandled exception or stack trace
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Script completes with exit code 0, reports `surfaces.canonical.exists: false`, all mirrors show `syncStatus: "missing"`, and `summary.missingCount > 0` -- without crashing or throwing an unhandled exception.

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
| IS-002 | Scan Missing Agent (Nonexistent) | Validate Scan Missing Agent (Nonexistent) | `` As a manual-testing orchestrator, validate that scanning a nonexistent agent produces graceful error handling instead of a crash against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"` (exit code 0 -- the script completes gracefully, it does not crash). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=nonexistent-agent-xyz<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=nonexistent-agent-xyz &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); assert d[&#x27;status&#x27;]==&#x27;complete&#x27;; assert d[&#x27;surfaces&#x27;][&#x27;canonical&#x27;][&#x27;exists&#x27;]==False; assert d[&#x27;summary&#x27;][&#x27;missingCount&#x27;]&gt;0; print(&#x27;PASS&#x27;)&quot; | `status: "complete"` (exit code 0 -- the script completes gracefully, it does not crash); `surfaces.canonical.exists: false`; All entries in `surfaces.mirrors` have `syncStatus: "missing"`; `summary.missingCount > 0`; No unhandled exception or stack trace | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Script completes with exit code 0, reports `surfaces.canonical.exists: false`, all mirrors show `syncStatus: "missing"`, and `summary.missingCount > 0` -- without crashing or throwing an unhandled exception. | If the script crashes with a stack trace: check error handling around file resolution logic in `scan-integration.cjs`<br>If `surfaces.canonical.exists` is `true`: the agent name is resolving to an actual file unexpectedly -- use a more unique nonexistent name<br>If `summary.missingCount` is 0: the script is not counting missing surfaces correctly<br>If exit code is non-zero: the script should handle missing agents gracefully rather than erroring out |

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
| `01--integration-scanner/002-scan-missing-agent.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/scan-integration.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Integration Scanner
- Playbook ID: IS-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--integration-scanner/002-scan-missing-agent.md`
