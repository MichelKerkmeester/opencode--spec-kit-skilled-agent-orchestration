---
title: "CO-029 -- Cross-repo dispatch via --dir"
description: "This scenario validates cross-repo dispatch for `CO-029`. It focuses on confirming `--dir <other-repo-path>` targets a different repo's plugin / skill / MCP runtime without leaving the calling session."
---

# CO-029 -- Cross-repo dispatch via --dir

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-029`.

---

## 1. OVERVIEW

This scenario validates Cross-repo dispatch via `--dir` for `CO-029`. It focuses on confirming `--dir <other-repo-path>` (per `references/opencode_tools.md` §6 + `references/cli_reference.md` §4) successfully targets a different repository's plugin / skill / MCP runtime when the calling session is in a different repo or in a fresh shell.

### Why This Matters

Cross-repo dispatch is one of the unique value props of cli-opencode (per `references/opencode_tools.md` §7, where sibling cli-* skills' binaries have no equivalent of `--dir`). It enables a calling AI in repo A to dispatch into repo B's runtime without leaving session A. If `--dir` does not actually pin the dispatched session's CWD to the target repo (or silently uses the caller's CWD), cross-repo workflows regress. This test confirms the cross-repo contract by dispatching with `--dir` set to a sibling location and verifying the dispatched session sees that path as its working directory.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CO-029` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--dir` targets a different repository path so the dispatched session reports the cross-repo path as its working directory and lists files from that repo (not the caller's repo).
- Real user request: `From the Public repo (or fresh shell), dispatch opencode run with --dir pointing at a sibling repo path (or any other valid repo path on the machine) and have the session list the top-level files. Confirm the listing matches the cross-repo path, not the caller's repo.`
- Prompt: `As an external-AI conductor verifying cross-repo dispatch, dispatch opencode run with --dir set to a different valid repo path on the machine (e.g., the parent directory of Public, or any other directory containing project files). Ask the dispatched session to use the bash tool to list the top 5 entries in its working directory. Verify the listed files match the cross-repo path, not the Public repo. Return a concise pass/fail verdict naming the cross-repo working directory and at least one file from that repo.`
- Expected execution process: External-AI orchestrator picks a different valid directory on the machine (parent of Public is a safe choice, containing Public, Barter, etc. as siblings), dispatches with `--dir <that-path>` and asks the dispatched session to list its working directory contents. Validates the listing matches the cross-repo path.
- Expected signals: Dispatch exits 0. The dispatched session response references the cross-repo path or files unique to it. The response does NOT name files unique to the Public repo as the working dir. Runtime under 90 seconds.
- Desired user-visible outcome: Verdict naming the cross-repo path and at least one file the session listed.
- Pass/fail: PASS if exit 0 AND response references files from the cross-repo path AND not Public-only files. FAIL if response says it sees the Public repo or fails to list cross-repo files.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pick a valid different directory (parent of Public is safe and reachable).
3. Dispatch with `--dir <other-path>` and a list-top-files prompt.
4. Inspect the response for the cross-repo path or its files.
5. Return a verdict naming the path and one listed file.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-029 | Cross-repo dispatch via --dir | Confirm `--dir <other-repo-path>` targets a different repo's runtime and the dispatched session reports that path as CWD | `As an external-AI conductor verifying cross-repo dispatch, dispatch opencode run with --dir set to a different valid repo path on the machine (e.g., the parent directory of Public, or any other directory containing project files). Ask the dispatched session to use the bash tool to list the top 5 entries in its working directory. Verify the listed files match the cross-repo path, not the Public repo. Return a concise pass/fail verdict naming the cross-repo working directory and at least one file from that repo.` | 1. `bash: PARENT=$(dirname /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public) && echo "Cross-repo target: $PARENT" && ls -1 "$PARENT" \| head -5` -> 2. `bash: opencode run --model anthropic/claude-opus-4-7 --agent general --variant high --format json --dir "$PARENT" "Use the bash tool to run \`pwd\` and \`ls -1 \| head -5\`. In your final reply, name the working directory exactly as pwd printed it and list the top 5 entries you saw." > /tmp/co-029-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool.result" or .type == "session.completed" or .type == "message.delta") \| .payload' /tmp/co-029-events.jsonl \| grep -ciE 'Code_Environment'` -> 5. `bash: jq -r 'select(.type == "tool.result" or .type == "session.completed" or .type == "message.delta") \| .payload' /tmp/co-029-events.jsonl \| grep -ciE '(\.opencode/skill\|cli-opencode/SKILL\.md)'` | Step 1: PARENT path resolved (e.g., `/Users/michelkerkmeester/MEGA/Development/Code_Environment`) and listed; Step 2: events captured; Step 3: exit 0; Step 4: count of `Code_Environment` references >= 1 (the cross-repo path appeared); Step 5: count of Public-only file references = 0 (the dispatched session is NOT seeing Public as its CWD) | `/tmp/co-029-events.jsonl`, terminal listings, grep counts | PASS if exit 0 AND cross-repo path referenced AND zero Public-only file references in the listing; FAIL if response says CWD is Public or fails to list cross-repo files | 1. If the response says CWD is Public, the binary may be ignoring `--dir` — file a regression bug; 2. If the response is generic (no listing), re-prompt with stronger explicit "use the bash tool" instruction; 3. If the cross-repo target does not exist, swap to another known-good directory like `~` or `/tmp` (note: `/tmp` will not have plugins, but the CWD test still works); 4. Confirm version v1.3.17 and `--dir` is the canonical name |

### Optional Supplemental Checks

For full cross-repo plugin verification, dispatch with `--dir` pointing at a real second repo (e.g., a Barter repo if available) and ask the session to list its plugins/skills. Confirm the listing includes plugins/skills unique to that second repo, NOT plugins/skills from Public. This proves the entire plugin/skill/MCP runtime is loaded from the `--dir` target, not the caller's CWD.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/opencode_tools.md` (§6 CROSS-REPO DISPATCH VIA --dir) | Documents the cross-repo capability |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (cross-repo dispatch), §3 default invocation `--dir` pinning |
| `../../references/cli_reference.md` (§4 `--dir` row) | Flag documentation |

---

## 5. SOURCE METADATA

- Group: Cross-Repo and Cross-Server
- Playbook ID: CO-029
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--cross-repo-cross-server/001-cross-repo-dispatch.md`
