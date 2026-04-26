---
title: "CU-026 -- destructive cu delete --confirm guard (DESTRUCTIVE)"
description: "This scenario validates the `cu delete --confirm` guard for `CU-026`. It focuses on confirming `cu delete` without `--confirm` refuses, and `--confirm` actually deletes a freshly created throwaway task."
---

# CU-026 -- destructive cu delete --confirm guard (DESTRUCTIVE)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-026`. **DESTRUCTIVE** — must run only against a freshly created throwaway task; never against real data.

---

## 1. OVERVIEW

This scenario validates the `cu delete <id> --confirm` guard for `CU-026`. It focuses on confirming the safety contract: `cu delete <id>` without `--confirm` MUST refuse, and `cu delete <id> --confirm` MUST actually delete the named task. **DESTRUCTIVE — must run only against a throwaway task created in this scenario.**

### Why This Matters

`cu delete` is the only command in the CLI surface that is irreversible. The `--confirm` guard is the single defense between operator typos and lost work. Without rigorous validation that the guard fires, a user typing `cu delete <wrongId>` could destroy real data. The scenario locks the contract in both directions and explicitly forbids running against non-throwaway tasks.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu delete <id>` without `--confirm` refuses AND `cu delete <id> --confirm` actually deletes a freshly created throwaway task.
- Real user request: `"Delete this throwaway test task — and confirm the safety guard works."`
- Prompt: `As a manual-testing orchestrator, attempt cu delete <id> first without --confirm and then with --confirm against a freshly created throwaway task through the cu CLI against the live ClickUp API. Verify the unconfirmed call refuses and the confirmed call deletes. NEVER run this scenario against real data. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: create a brand-new throwaway task via `cu create`, attempt unguarded delete, attempt confirmed delete, verify deletion.
- Expected signals: unguarded delete refuses; confirmed delete exits 0; post-delete `cu task <id>` returns "not found" or 404.
- Desired user-visible outcome: A short report quoting the unguarded refusal and the post-delete absence verdict.
- Pass/fail: PASS if both halves verified; FAIL on any unguarded deletion succeeding, confirmed delete failing, or task still present after delete.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, attempt cu delete <id> first without --confirm and then with --confirm against a freshly created throwaway task through the cu CLI against the live ClickUp API. Verify the unconfirmed call refuses and the confirmed call deletes. NEVER run this scenario against real data. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu create -n "CU-026 throwaway DELETE-ME" -l <testListId> 2>&1` — create a fresh throwaway task
2. Extract the new task `id` from stdout (this id MUST come from this scenario; never reuse an id from elsewhere)
3. `bash: cu delete <newTaskId> 2>&1` — attempt unguarded delete (expect refusal)
4. `bash: echo $?` — capture exit code (expect non-zero OR a deterministic refusal message)
5. `bash: cu delete <newTaskId> --confirm 2>&1` — confirmed delete
6. `bash: echo $?` — capture exit code (expect 0)
7. `bash: cu task <newTaskId> 2>&1` — verify task is gone (expect "not found" or 404)

### Expected

- Step 1: creates throwaway task; output includes new id
- Step 2: id extracted
- Step 3: unguarded delete REFUSES (does not delete)
- Step 4: exit code is non-zero OR output contains "confirm" / "use --confirm" / "irreversible"
- Step 5: confirmed delete produces success output
- Step 6: exit code is 0
- Step 7: `cu task <id>` returns "not found" or 404

### Evidence

Capture the verbatim create output (with new id), the verbatim unguarded-delete output (proving refusal), the verbatim confirmed-delete output, and the verbatim post-delete `cu task` output (proving deletion).

### Pass / Fail

- **Pass**: Unguarded delete refused, confirmed delete succeeded, post-delete task is absent.
- **Fail**: Unguarded delete actually deleted (CRITICAL safety bug), confirmed delete failed, OR post-delete task is still present.

### Failure Triage

1. **CRITICAL**: If unguarded `cu delete <id>` actually deletes: this is a P0 safety bug — capture the verbatim flow and escalate immediately; do NOT run this scenario again on the same CLI version until the guard is fixed.
2. If confirmed delete returns "task not found": the create step's id may have been mistyped — re-run from step 1; do NOT broaden the id used.
3. If post-delete `cu task <id>` succeeds (task still present): eventual-consistency gap — wait 2 seconds and re-fetch; if still present, this is a critical delete-doesn't-delete bug.
4. If `--confirm` flag is named differently on the installed CLI version: consult `cu delete --help`; the flag MAY be `-y` or `--yes` in some versions.
5. If the throwaway task creation fails: route to CU-011 first; CU-026 cannot run without a freshly created task.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (`cu delete --confirm`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (write commands: `cu delete --confirm` destructive) |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND RATE LIMITS
- Playbook ID: CU-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-rate-limits/003-destructive-delete-confirm.md`
