---
title: "CO-003 -- Working directory pinning via --dir"
description: "This scenario validates `--dir` for `CO-003`. It focuses on confirming the dispatched session's working directory matches the pinned path so the session loads the correct repository's plugins, skills, and MCP servers."
---

# CO-003 -- Working directory pinning via --dir

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-003`.

---

## 1. OVERVIEW

This scenario validates Working directory pinning via `--dir` for `CO-003`. It focuses on confirming `--dir <path>` correctly pins the dispatched OpenCode session's working directory and that the session loads plugins, skills and MCP servers from that path rather than the caller's CWD.

### Why This Matters

The cli-opencode default invocation always pins `--dir <repo-root>` to avoid CWD ambiguity (per SKILL.md §3 "Default Invocation"). If `--dir` is silently ignored or overridden by the caller's CWD, cross-repo dispatch (use case from CO-029) silently breaks and the dispatched session loads the wrong project's plugins. This is the foundational test that proves `--dir` actually pins the CWD inside the dispatched session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `--dir` flag pins the dispatched session's working directory so a `pwd`-equivalent inside the session returns the pinned path, not the caller's CWD.
- Real user request: `Run opencode run from /tmp but pin --dir to the Public repo, and have OpenCode tell me which directory it sees as its working dir. Confirm it matches the pinned path.`
- Prompt: `As an external-AI conductor verifying --dir pinning works, change to /tmp before dispatching, but pin --dir to the Public repo root. Ask the dispatched session to use its bash tool to print the working directory and the first three entries it sees. Verify the working directory matches the pinned --dir, not /tmp. Return a concise pass/fail verdict naming the observed working directory.`
- Expected execution process: External-AI orchestrator runs `cd /tmp` (or otherwise changes the parent shell's CWD), dispatches with `--dir /Users/.../Public` and a prompt that asks the session to surface its working directory, then validates the response references the Public repo root rather than `/tmp`.
- Expected signals: Dispatch exits 0. The session response references the Public repo path or names project-specific files like `AGENTS.md`, `opencode.json` or `.opencode/`. The response does NOT mention `/tmp` as the working directory.
- Desired user-visible outcome: Verdict naming the observed working directory and confirming it matches the pinned `--dir` path.
- Pass/fail: PASS if exit 0 AND response names the pinned directory or project-specific files AND does not name `/tmp`. FAIL if response says it sees `/tmp` or fails to surface the pinned path.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Change parent shell CWD to `/tmp` to make the difference observable.
3. Dispatch with `--dir <Public-repo-root>` and a prompt that asks the session to print its working directory and list a few entries.
4. Inspect the session's reply for the pinned path or project-specific markers.
5. Return a verdict naming the observed working directory.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-003 | Working directory pinning via --dir | Confirm `--dir` pins the dispatched session's working directory rather than inheriting the caller's CWD | `As an external-AI conductor verifying --dir pinning works, change to /tmp before dispatching, but pin --dir to the Public repo root. Ask the dispatched session to use its bash tool to print the working directory and the first three entries it sees. Verify the working directory matches the pinned --dir, not /tmp. Return a concise pass/fail verdict naming the observed working directory.` | 1. `bash: cd /tmp && pwd` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "Use the bash tool to run \`pwd\` and \`ls -1 \| head -3\`. In your final reply, name the working directory exactly as pwd printed it." > /tmp/co-003-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool.result") \| .payload' /tmp/co-003-events.jsonl \| grep -c "Code_Environment/Public"` -> 5. `bash: jq -r 'select(.type == "tool.result") \| .payload' /tmp/co-003-events.jsonl \| grep -c "/tmp"` | Step 1: parent CWD is `/tmp`; Step 2: events captured non-empty; Step 3: exit 0; Step 4: count of `Code_Environment/Public` references >= 1 (the dispatched session sees the pinned path); Step 5: count of `/tmp` references = 0 in tool.result payloads (the parent CWD did not leak in) | `/tmp/co-003-events.jsonl`, terminal transcript including parent CWD before dispatch | PASS if exit 0 AND pinned path appears in tool.result AND `/tmp` does not appear in tool.result; FAIL if dispatched session reports CWD as `/tmp` or fails to surface the pinned path | 1. Verify `--dir` is spelled exactly with two dashes and no equal sign; 2. Run `opencode run --help` and check `--dir` is still the canonical name (drift handled per `references/cli_reference.md` §9); 3. If the session's bash tool prints `/tmp`, the binary may be ignoring `--dir` — file a bug and fall back to running from the repo root directly |

### Optional Supplemental Checks

For cross-repo verification, repeat the test with `--dir /Users/.../Barter` (or any other repo on the machine) and confirm the dispatched session reports the second repo's path. This is the foundation for the cross-repo dispatch tested in CO-029.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 `--dir` row in flag table) | Documents the working directory contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 3 (pin `--dir <repo-root>`) and §3 default invocation shape |
| `../../references/opencode_tools.md` (§6 Cross-Repo Dispatch via --dir) | Documents the cross-repo capability that depends on this pinning |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/003-dir-flag-working-directory.md`
