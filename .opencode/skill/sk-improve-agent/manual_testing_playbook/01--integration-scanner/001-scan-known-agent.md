---
title: "IS-001 -- Scan Known Agent (Debug)"
description: "Manual validation scenario for IS-001: Scan Known Agent (Debug)."
feature_id: "IS-001"
category: "Integration Scanner"
---

# IS-001 -- Scan Known Agent (Debug)

This document captures the canonical manual-testing contract for `IS-001`.

---

## 1. OVERVIEW

This scenario validates that scanning a known agent discovers all integration surfaces and confirms mirror alignment.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Scan Known Agent (Debug) for the scanner, mirror-alignment, and JSON-output scenarios.
- Real user request: `Validate that scanning a known agent discovers all integration surfaces and confirms mirror alignment.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that scanning a known agent discovers all integration surfaces and confirms mirror alignment against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"` at root level. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the integration scanner against the documented agent target; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `status: "complete"` at root level; `surfaces.canonical.exists: true`; `surfaces.mirrors` array with 3 entries, each with `syncStatus: "aligned"`; `summary.totalSurfaces >= 20`; `summary.mirrorSyncStatus: "all-aligned"`; `summary.commandCount >= 1`; `summary.skillCount >= 1`; Exit code is 0
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: All mirrors report `syncStatus: "aligned"`, `summary.mirrorSyncStatus` equals `"all-aligned"`, `commandCount > 0`, `skillCount > 0`, and exit code is 0.

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
| IS-001 | Scan Known Agent (Debug) | Validate Scan Known Agent (Debug) | `` As a manual-testing orchestrator, validate that scanning a known agent discovers all integration surfaces and confirms mirror alignment against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"` at root level. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); assert d[&#x27;summary&#x27;][&#x27;mirrorSyncStatus&#x27;]==&#x27;all-aligned&#x27;; print(&#x27;PASS&#x27;)&quot; | `status: "complete"` at root level; `surfaces.canonical.exists: true`; `surfaces.mirrors` array with 3 entries, each with `syncStatus: "aligned"`; `summary.totalSurfaces >= 20`; `summary.mirrorSyncStatus: "all-aligned"`; `summary.commandCount >= 1`; `summary.skillCount >= 1`; Exit code is 0 | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | All mirrors report `syncStatus: "aligned"`, `summary.mirrorSyncStatus` equals `"all-aligned"`, `commandCount > 0`, `skillCount > 0`, and exit code is 0. | If `surfaces.canonical.exists` is `false`: check that the debug agent file exists at `.opencode/agent/debug.md`<br>If any mirror has `syncStatus` other than `&quot;aligned&quot;`: compare agent definitions across `.claude/agents/`, `.codex/agents/`, `.opencode/agent/`, and `.gemini/agents/` for inconsistencies<br>If `summary.commandCount` is 0: verify debug-related command definitions exist in `.opencode/skill/*/commands/` or `.agents/commands/`<br>If the script errors: verify Node.js version and that `scan-integration.cjs` has no syntax errors |

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
| `01--integration-scanner/001-scan-known-agent.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/scan-integration.cjs` | Implementation or verification anchor referenced by this scenario |
| `.claude/agents/` | Implementation or verification anchor referenced by this scenario |
| `.codex/agents/` | Implementation or verification anchor referenced by this scenario |
| `.gemini/agents/` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |
| `.opencode/skill/*/commands/` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Integration Scanner
- Playbook ID: IS-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--integration-scanner/001-scan-known-agent.md`
