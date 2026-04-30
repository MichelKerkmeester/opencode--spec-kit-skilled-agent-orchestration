---
title: "IS-003 -- Scan Diverse Agent (Debug)"
description: "Manual validation scenario for IS-003: Scan Diverse Agent (Debug)."
feature_id: "IS-003"
category: "Integration Scanner"
---

# IS-003 -- Scan Diverse Agent (Debug)

This document captures the canonical manual-testing contract for `IS-003`.

---

## 1. OVERVIEW

This scenario validates that scanning the debug agent discovers a broad set of integration surfaces (20+ expected).

---

## 2. SCENARIO CONTRACT

- Objective: Validate Scan Diverse Agent (Debug) for the scanner, mirror-alignment, and JSON-output scenarios.
- Real user request: `Validate that scanning the debug agent discovers a broad set of integration surfaces (20+ expected).`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that scanning the debug agent discovers a broad set of integration surfaces (20+ expected) against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the integration scanner against the documented agent target; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `status: "complete"`; `summary.totalSurfaces >= 20`; `surfaces.mirrors` entries with `syncStatus: "aligned"`; `summary.commandCount >= 1`; `summary.skillCount >= 5`; Surfaces span commands, skills, and global docs (CLAUDE.md, agent definitions, skill routing entries); Exit code is 0
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: `summary.totalSurfaces` is 20 or more, mirrors are aligned, `commandCount >= 1`, `skillCount >= 5`, with surfaces found across commands, skills, and global docs.

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
| IS-003 | Scan Diverse Agent (Debug) | Validate Scan Diverse Agent (Debug) | `` As a manual-testing orchestrator, validate that scanning the debug agent discovers a broad set of integration surfaces (20+ expected) against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); s=d[&#x27;summary&#x27;]; assert s[&#x27;totalSurfaces&#x27;]&gt;=20; assert s[&#x27;commandCount&#x27;]&gt;=1; assert s[&#x27;skillCount&#x27;]&gt;=5; print(f&#x27;PASS: {s[\&quot;totalSurfaces\&quot;]} surfaces, {s[\&quot;commandCount\&quot;]} commands, {s[\&quot;skillCount\&quot;]} skills&#x27;)&quot; | `status: "complete"`; `summary.totalSurfaces >= 20`; `surfaces.mirrors` entries with `syncStatus: "aligned"`; `summary.commandCount >= 1`; `summary.skillCount >= 5`; Surfaces span commands, skills, and global docs (CLAUDE.md, agent definitions, skill routing entries); Exit code is 0 | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | `summary.totalSurfaces` is 20 or more, mirrors are aligned, `commandCount >= 1`, `skillCount >= 5`, with surfaces found across commands, skills, and global docs. | If `summary.totalSurfaces &lt; 20`: review surface detection patterns to ensure all reference styles are covered (markdown links, inline mentions, routing tables, agent directory entries)<br>If `summary.skillCount &lt; 5`: check that skill routing entries referencing `debug` are being detected in CLAUDE.md and skill advisor config<br>If `summary.commandCount &lt; 1`: verify debug-related command definitions exist<br>If the script errors: verify the debug agent file exists at `.opencode/agent/debug.md` |

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
| `01--integration-scanner/003-scan-diverse-agent.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/scan-integration.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Integration Scanner
- Playbook ID: IS-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--integration-scanner/003-scan-diverse-agent.md`
