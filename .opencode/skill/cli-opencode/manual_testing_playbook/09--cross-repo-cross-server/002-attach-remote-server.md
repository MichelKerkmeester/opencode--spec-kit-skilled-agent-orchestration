---
title: "CO-030 -- Cross-server dispatch via --attach"
description: "This scenario validates cross-server dispatch for `CO-030`. It focuses on confirming the documented `--attach <url>` flag combined with `--dir <remote-path>` is documented and reachable; live remote server execution is out-of-scope (operator-environment-dependent)."
---

# CO-030 -- Cross-server dispatch via --attach

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-030`.

---

## 1. OVERVIEW

This scenario validates Cross-server dispatch via `--attach` for `CO-030`. It focuses on confirming the documented `--attach <url>` flag combined with `--dir <remote-path>` is part of the cli-opencode skill surface and that the documentation contract for cross-server dispatch is intact. Live cross-server execution requires a running remote OpenCode server with credentials and is intentionally out-of-scope for this scenario. Operators in the right environment can extend the test, but the playbook validates the documentation and dry-run path only.

### Why This Matters

Cross-server dispatch is the documented capability that lets an operator target a remote OpenCode server's runtime via `--attach <url>` (per `references/opencode_tools.md` §6 + `references/cli_reference.md` §3 subcommand map). It is the path for "OpenCode A wants to dispatch into OpenCode B running on a remote machine". If the documentation contract is broken or the flag does not appear in `opencode run --help`, the entire cross-server workflow loses its anchor. This test validates the documentation and CLI surface. The actual remote dispatch is exercised only by operators with a real server.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-030` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `--attach <url>` flag is documented in the cli-opencode references AND appears in the `opencode run --help` output, AND that the SKILL.md documents `attach` as a supported subcommand.
- Real user request: `Verify the cross-server dispatch documentation: --attach <url> should be in the CLI flag table, and `opencode attach <url>` should be in the subcommand map. Confirm both surfaces exist before we attempt a real remote dispatch.`
- Prompt: `As an external-AI conductor preparing to dispatch into a remote OpenCode server, verify the cli-opencode documentation contract for cross-server dispatch is intact. Grep the cli_reference.md flag table for --attach, grep the subcommand map for opencode attach, and run opencode run --help to confirm the flag is in the live binary's help output. Return a concise pass/fail verdict naming each evidence source and confirming the flag is documented and reachable.`
- Expected execution process: External-AI orchestrator greps `references/cli_reference.md` for the `--attach` flag in §4, greps the §3 subcommand map for `opencode attach`, runs `opencode run --help` and confirms `--attach` appears in the help output.
- Expected signals: cli_reference.md §4 includes a row for `--attach <url>`. Cli_reference.md §3 documents `opencode attach <url>` as a supported subcommand. `opencode run --help` output mentions `--attach`. SKILL.md §1 activation triggers mention "Cross-server dispatch".
- Desired user-visible outcome: Verdict naming each documented surface (flag table, subcommand map, help output, SKILL.md trigger).
- Pass/fail: PASS if all four surfaces document `--attach`/`attach`. FAIL if any surface is missing the documentation.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Grep cli_reference.md flag table for `--attach`.
3. Grep cli_reference.md subcommand map for `opencode attach`.
4. Run `opencode run --help` and grep for `--attach`.
5. Grep SKILL.md activation triggers for cross-server.
6. Return a verdict naming each found surface.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-030 | Cross-server dispatch via --attach | Confirm `--attach <url>` is documented in references and surfaces in the live `opencode run --help` output | `As an external-AI conductor preparing to dispatch into a remote OpenCode server, verify the cli-opencode documentation contract for cross-server dispatch is intact. Grep the cli_reference.md flag table for --attach, grep the subcommand map for opencode attach, and run opencode run --help to confirm the flag is in the live binary's help output. Return a concise pass/fail verdict naming each evidence source and confirming the flag is documented and reachable.` | 1. `bash: grep -nE '\| .--attach.' .opencode/skill/cli-opencode/references/cli_reference.md` -> 2. `bash: grep -nE 'opencode attach' .opencode/skill/cli-opencode/references/cli_reference.md` -> 3. `bash: opencode run --help 2>&1 \| grep -iE 'attach' \| head -3` -> 4. `bash: grep -inE 'cross-server\|Cross-server' .opencode/skill/cli-opencode/SKILL.md \| head -3` -> 5. `bash: grep -inE 'remote opencode server' .opencode/skill/cli-opencode/references/opencode_tools.md \| head -3` | Step 1: cli_reference.md flag table includes `--attach` row (count >= 1); Step 2: subcommand map mentions `opencode attach <url>` (count >= 1); Step 3: live binary help output includes `--attach` (count >= 1); Step 4: SKILL.md activation triggers mention cross-server dispatch (count >= 1); Step 5: opencode_tools.md references "remote opencode server" or equivalent (count >= 1) | Terminal grep output for each check | PASS if all 5 surfaces show the documented `--attach` / `attach` / cross-server contract; FAIL if any surface is missing | 1. If `--attach` is missing from the live binary's help, the version may have renamed or removed the flag — see `references/cli_reference.md` §9 version drift; 2. If documentation is missing, the cli-opencode skill has regressed — file a P0 documentation bug naming the missing surface; 3. NEVER attempt a real `--attach <url>` dispatch in this test — that requires a running remote server and credentials, both out-of-scope for the playbook; 4. If the operator wants to extend with a real remote dispatch, document the URL, password, and `--dir` separately and treat it as an environment-specific add-on |

### Optional Supplemental Checks

For operators in environments with a running remote OpenCode server, optionally extend with a real `opencode run --attach <url> -p <password> --dir <remote-path>` dispatch and validate the JSON event stream. Document the remote URL and the dispatched response. This is an environment-specific extension, not a baseline playbook requirement.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/opencode_tools.md` (§6 CROSS-REPO DISPATCH, extended cross-server note) | Cross-server documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (cross-server dispatch), §3 unique OpenCode capabilities table (cross-server row) |
| `../../references/cli_reference.md` (§3 subcommand map + §4 `--attach` row) | Subcommand and flag documentation |

---

## 5. SOURCE METADATA

- Group: Cross-Repo and Cross-Server
- Playbook ID: CO-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--cross-repo-cross-server/002-attach-remote-server.md`
