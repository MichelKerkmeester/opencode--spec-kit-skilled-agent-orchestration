---
title: "CP-020 -- `/delegate` explicit cloud command (DESTRUCTIVE — cloud write)"
description: "This scenario validates the explicit `/delegate` cloud-delegation surface for `CP-020`. It focuses on confirming the documented `/delegate <task>` syntax pushes a small read-only analysis task to GitHub's cloud coding agent and the response cites real local files."
---

# CP-020 -- `/delegate` explicit cloud command (DESTRUCTIVE, cloud write)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-020`.

---

## 1. OVERVIEW

This scenario validates the documented `/delegate` cloud-delegation surface for `CP-020`. It focuses on confirming `/delegate <task>` inside a `copilot -p` prompt body successfully pushes a small read-only analysis task to GitHub's cloud coding agent, the response cites the four real reference filenames in `references/` and the working tree remains untouched.

### Why This Matters

Cloud Delegation is one of the four cli-copilot unique capabilities documented in `references/copilot_tools.md` §2, it is the difference between Copilot and pure-local CLIs. The `/delegate` syntax is the documented explicit form (vs. the `&prompt` shorthand exercised in CP-021). If the cloud-delegation handshake silently fails (the call returns local-only output without ever reaching the cloud agent, or the cloud agent times out without a clear error), every cloud-offload scenario inherits the same defect. Marking this DESTRUCTIVE because cloud delegation may write logs and invocation receipts to GitHub-side state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `/delegate <task>` inside the prompt body pushes a small read-only analysis task to GitHub's cloud coding agent and the response cites at least 3 of the 4 real reference filenames
- Real user request: `Use Copilot's /delegate command to push a small analysis task to the GitHub cloud agent and confirm it returns a response that names real files from references/.`
- Prompt: `As a cross-AI orchestrator validating the explicit cloud-delegation surface, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and use the /delegate command inside the prompt body to push a small read-only analysis task to GitHub's cloud agent: 'analyse the references/ folder structure and list the four reference filenames'. Verify the call completes (cloud round-trip may take longer than local), the response cites the four real reference filenames (cli_reference.md, copilot_tools.md, agent_delegation.md, integration_patterns.md), and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the cited filenames.`
- Expected execution process: orchestrator captures pre-call tripwire, dispatches the prompt with `/delegate` inline, allows extra time for the cloud round-trip (typically 30-180s), then verifies the response cites real files and the working tree is unchanged
- Expected signals: `EXIT=0`. Response cites at least 3 of (`cli_reference.md`, `copilot_tools.md`, `agent_delegation.md`, `integration_patterns.md`). Response indicates cloud routing (e.g. mentions `/delegate`, `cloud agent`, `delegation receipt` or returns a session/run identifier). Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + the cited filenames + a one-line note that cloud delegation completed (with the round-trip duration if available)
- Pass/fail: PASS if EXIT=0 AND >= 3 real reference filenames cited AND response indicates cloud routing AND tripwire diff is empty. FAIL if Copilot did not delegate (response looks purely local), < 3 real files cited, project tree mutated or call times out

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the explicit /delegate cloud-delegation handshake actually reaches the cloud agent and returns useful content".
2. Stay local for orchestration. The heavy lifting goes to the cloud agent.
3. Capture pre-call tripwire and a wall-clock timestamp (cloud delegation may be slow).
4. Dispatch the prompt with `/delegate <task>` inline.
5. Verify cited filenames are real, look for cloud-routing markers in the response, confirm tripwire diff is empty.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-020 | `/delegate` explicit cloud command | Confirm `/delegate <task>` inside the prompt body pushes a small read-only analysis task to GitHub's cloud coding agent and the response cites real reference filenames | `As a cross-AI orchestrator validating the explicit cloud-delegation surface, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and use the /delegate command inside the prompt body to push a small read-only analysis task to GitHub's cloud agent: 'analyse the references/ folder structure and list the four reference filenames'. Verify the call completes (cloud round-trip may take longer than local), the response cites the four real reference filenames (cli_reference.md, copilot_tools.md, agent_delegation.md, integration_patterns.md), and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the cited filenames.` | 1. `bash: git status --porcelain > /tmp/cp-020-pre.txt; ls .opencode/skill/cli-copilot/references/ > /tmp/cp-020-real-files.txt; START_TS=$(date +%s); echo "START_TS=$START_TS"` -> 2. `bash: copilot -p "/delegate Analyse the directory .opencode/skill/cli-copilot/references/ and list the four reference filenames present, with a one-sentence purpose for each. Read-only analysis only — do not modify any files." --allow-all-tools 2>&1 \| tee /tmp/cp-020-out.txt; echo "EXIT=$?"; END_TS=$(date +%s); echo "END_TS=$END_TS DURATION_SEC=$((END_TS - START_TS))"` -> 3. `bash: git status --porcelain > /tmp/cp-020-post.txt && diff /tmp/cp-020-pre.txt /tmp/cp-020-post.txt && for f in cli_reference.md copilot_tools.md agent_delegation.md integration_patterns.md; do grep -c "$f" /tmp/cp-020-out.txt; done && grep -ciE '(/delegate\|cloud agent\|cloud-hosted\|delegation\|remote\|copilot agent)' /tmp/cp-020-out.txt` | Step 1: pre-tripwire captured, real-files snapshot taken, start timestamp recorded; Step 2: EXIT=0, transcript cites references files, end timestamp + duration recorded (typically 30-180s); Step 3: tripwire diff empty, >= 3 of the 4 expected filenames have grep count >= 1, cloud-routing grep count >= 1 | `/tmp/cp-020-out.txt` (transcript) + `/tmp/cp-020-real-files.txt` (ground-truth file list) + `/tmp/cp-020-pre.txt` and `/tmp/cp-020-post.txt` (tripwire pair) + per-file grep counts + cloud-routing grep count + start/end timestamps | PASS if EXIT=0 AND >= 3 of 4 real filenames cited AND cloud-routing grep >= 1 AND tripwire diff empty; FAIL if EXIT != 0 (timeout/error), < 3 real files cited, response shows no cloud-routing markers, or tripwire diff non-empty | 1. If timeout, GitHub's cloud agent quota may be exhausted — wait and retry; 2. If response looks purely local (no cloud-routing markers), `/delegate` may not have been recognised — verify the binary version supports `/delegate` per cli_reference.md §7; 3. If < 3 real files cited but cloud routing succeeded, the cloud agent may have invented filenames — flag for re-review |

### Optional Supplemental Checks

After PASS, capture the cloud-delegation receipt or session ID (if present) for audit trail purposes. The receipt is what links the local CLI invocation to the cloud-agent run record on GitHub's side.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Copilot CLI Agent Delegation row "Cloud Delegation: copilot -p \"/delegate ...\"" |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/copilot_tools.md` | §2 Cloud Delegation unique capability documentation |
| `../../references/cli_reference.md` | §7 INTERACTIVE COMMANDS includes `/delegate` |
| `../../references/agent_delegation.md` | §4 Cloud Delegation Remote Agent details |

---

## 5. SOURCE METADATA

- Group: Cloud Delegation
- Playbook ID: CP-020
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--cloud-delegation/001-delegate-explicit-cloud.md`
