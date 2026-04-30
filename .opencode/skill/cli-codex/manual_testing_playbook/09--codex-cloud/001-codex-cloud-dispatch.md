---
title: "CX-028 -- codex cloud dispatch"
description: "This scenario validates the codex cloud subcommand for `CX-028`. It focuses on confirming the cloud subcommand surface (auth + dispatch contract) is documented and reachable in the live binary."
---

# CX-028 -- codex cloud dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-028`.

---

## 1. OVERVIEW

This scenario validates the `codex cloud` dispatch surface for `CX-028`. It focuses on confirming the `codex cloud` subcommand exists in the live binary, the help output documents the auth and dispatch contract and the SKILL.md surfaces `codex cloud` as a documented capability under §3 Unique Codex Capabilities.

### Why This Matters

The `codex cloud` subcommand is the documented remote-task-execution surface per cli-codex SKILL.md §3 Unique Codex Capabilities. Operators that need to offload long-running tasks rely on the cloud subcommand for unattended execution. If `codex cloud` is missing from the live binary or undocumented in the help output, the cloud-execution contract for cross-AI Codex dispatches is broken and operators have no entry point into the cloud surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-028` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex cloud` is a documented subcommand in the live binary's help output, the SKILL.md references it under §3 and the help output names the auth and dispatch flags.
- Real user request: `Confirm Codex cloud is wired up so I can offload a long task from my laptop later this week.`
- RCAF Prompt: `As a cross-AI orchestrator preparing to use Codex cloud for a long-running task, verify the cloud subcommand surface is intact. Run codex cloud --help against the live binary and confirm auth and dispatch flags are documented. Grep the cli-codex SKILL.md for "codex cloud" to confirm the skill references the subcommand. Return a verdict naming the help-output flags found and confirming SKILL.md references codex cloud.`
- Expected execution process: Cross-AI orchestrator runs `codex cloud --help`, captures the output, then greps SKILL.md for "codex cloud" to confirm the skill documents the subcommand.
- Expected signals: `codex cloud --help` (or `codex --help` showing `cloud` subcommand) exits 0. Help output names at least one auth-related flag such as `--auth` or `login` or a token-related variant. Help output names at least one dispatch-related flag such as `run` or `--task` or `--prompt`. SKILL.md mentions `codex cloud` at least once in §3.
- Desired user-visible outcome: Confirmation that the cloud subcommand is reachable end to end with a documented auth and dispatch contract operators can use for follow-up runs.
- Pass/fail: PASS if `codex cloud --help` exits 0 AND help output has auth and dispatch flags documented AND SKILL.md references `codex cloud`. FAIL if subcommand is missing from the binary or SKILL.md does not reference it.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Verify the live `codex` binary supports `codex cloud` via `codex --help` enumeration.
2. Run `codex cloud --help` and capture the output.
3. Confirm auth-related flags appear in the help text.
4. Confirm dispatch-related flags appear in the help text.
5. Grep cli-codex SKILL.md for `codex cloud` to confirm skill documentation.
6. Return a verdict naming the flags and SKILL.md anchor.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-028 | codex cloud dispatch | Verify codex cloud subcommand exists with documented auth and dispatch flags AND SKILL.md references it | `As a cross-AI orchestrator preparing to use Codex cloud for a long-running task, verify the cloud subcommand surface is intact. Run codex --help to confirm cloud appears as a subcommand, then run codex cloud --help and confirm auth and dispatch flags are documented. Grep the cli-codex SKILL.md for "codex cloud" to confirm the skill references the subcommand. Return a verdict naming the help-output flags found and confirming SKILL.md references codex cloud.` | 1. `bash: codex --help 2>&1 \| grep -ciE 'cloud' > /tmp/cli-codex-cx028-cloud-listed.txt && cat /tmp/cli-codex-cx028-cloud-listed.txt` -> 2. `bash: codex cloud --help > /tmp/cli-codex-cx028-help.txt 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: grep -ciE '(auth\|login\|token)' /tmp/cli-codex-cx028-help.txt` -> 5. `bash: grep -ciE '(run\|dispatch\|task\|prompt\|exec)' /tmp/cli-codex-cx028-help.txt` -> 6. `bash: grep -ciE 'codex cloud' .opencode/skill/cli-codex/SKILL.md` | Step 1: cloud appears in `codex --help` (count >= 1); Step 2: help captured; Step 3: exit 0; Step 4: auth-flag mention count >= 1; Step 5: dispatch-flag mention count >= 1; Step 6: SKILL.md mentions `codex cloud` (count >= 1) | `/tmp/cli-codex-cx028-cloud-listed.txt`, `/tmp/cli-codex-cx028-help.txt`, terminal grep counts | PASS if cloud subcommand is listed AND `codex cloud --help` exits 0 AND auth and dispatch flags documented AND SKILL.md references codex cloud; FAIL if any check misses | (1) If cloud is missing from `codex --help`, the live binary version may predate the cloud surface, run `codex --version` and check the cli-codex pinned baseline in cli_reference.md §9; (2) if help exits non-zero, capture stderr and confirm the subcommand spelling; (3) if SKILL.md does not reference codex cloud, the documentation drifted, file a doc-bug |

### Optional Supplemental Checks

If auth tokens are configured, dispatch a small benign cloud task and verify the response surfaces a remote session id distinct from local sessions. Live cloud execution is operator-environment-dependent and is out of scope for the playbook baseline. The baseline test validates documentation and CLI surface contract.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Subcommand reference |
| `../../references/codex_tools.md` | Unique Codex capability table |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 263) | Documents `codex cloud` in §3 Unique Codex Capabilities |
| `../../references/cli_reference.md` | Subcommand contract |

---

## 5. SOURCE METADATA

- Group: Codex Cloud
- Playbook ID: CX-028
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--codex-cloud/001-codex-cloud-dispatch.md`
