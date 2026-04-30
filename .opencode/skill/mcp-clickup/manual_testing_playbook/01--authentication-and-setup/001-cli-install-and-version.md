---
title: "CLU-001 -- CLI install and version"
description: "This scenario validates that `cu` resolves to the ClickUp CLI, not system UUCP, and can print version/help output."
---

# CLU-001 -- CLI install and version

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-001`.

---

## 1. OVERVIEW

This scenario validates the first install-health checkpoint for `mcp-clickup`: the `cu` binary must be installed, must be the ClickUp CLI from `@krodak/clickup-cli`, and must not resolve to the system UUCP utility.

### Why This Matters

Every CLI scenario depends on the binary identity. A machine may already have `/usr/bin/cu` installed, but that is Taylor UUCP and cannot manage ClickUp tasks.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CLU-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu` exists, is not Taylor UUCP, and can print version/help output.
- Real user request: `Check whether my ClickUp CLI is installed correctly before I use it for task work.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, verify that the local cu binary is the ClickUp CLI rather than the system UUCP tool. Capture the resolved path, version line, help output status, and return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Run binary discovery, version check, UUCP guard, help check, and optional Node version check.
- Expected signals: `command -v cu` returns a path; `cu --version` exits 0; version output does not contain `Taylor UUCP`; `cu --help` exits 0.
- Desired user-visible outcome: A short PASS/FAIL report naming the `cu` path and whether it is safe to use.
- Pass/fail: PASS if all expected signals hold; FAIL if `cu` is missing, resolves to UUCP, or help/version fail.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request.
2. Run the exact commands.
3. Inspect outputs for the ClickUp-vs-UUCP signal.
4. Return a concise verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-001 | CLI install and version | Confirm `cu` is ClickUp CLI, not system UUCP | `As a ClickUp manual-testing orchestrator, verify that the local cu binary is the ClickUp CLI rather than the system UUCP tool. Capture the resolved path, version line, help output status, and return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: command -v cu` -> 2. `bash: cu --version 2>&1 \| tee /tmp/clu-001-version.txt` -> 3. `bash: ! grep -qi "Taylor UUCP" /tmp/clu-001-version.txt` -> 4. `bash: cu --help >/tmp/clu-001-help.txt 2>&1; echo "Exit: $?"` -> 5. `bash: node --version` | Step 1 returns a path; Step 2 returns version text; Step 3 exits 0; Step 4 prints `Exit: 0`; Step 5 reports Node 22+ for install compatibility | `/tmp/clu-001-version.txt`, `/tmp/clu-001-help.txt`, terminal transcript | PASS if `cu` resolves, version/help work, and output does not contain `Taylor UUCP`; FAIL otherwise | 1. If missing, install with `npm install -g @krodak/clickup-cli`; 2. If UUCP appears, put npm global bin earlier in PATH; 3. If Node is below 22, upgrade Node before reinstalling |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/SKILL.md` | Historical skill source for install and UUCP guard behavior |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical CLI command reference |

---

## 5. SOURCE METADATA

- Group: AUTHENTICATION AND SETUP
- Playbook ID: CLU-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--authentication-and-setup/001-cli-install-and-version.md`

