---
title: "CC-006 -- AcceptEdits mode auto-approve writes (SANDBOXED)"
description: "This scenario validates AcceptEdits mode auto-approve writes for `CC-006`. It focuses on confirming `--permission-mode acceptEdits` allows file writes without per-edit prompts. Runs only against `/tmp/cli-claude-code-playbook/scratch.ts`."
---

# CC-006 -- AcceptEdits mode auto-approve writes (SANDBOXED)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-006`. **DESTRUCTIVE - sandboxed scenario. MUST run only against `/tmp/cli-claude-code-playbook/scratch.ts`.**

---

## 1. OVERVIEW

This scenario validates AcceptEdits mode auto-approve writes for `CC-006`. It focuses on confirming `--permission-mode acceptEdits` allows file writes without per-edit prompts.

### Why This Matters

`acceptEdits` is the most common write-enabled mode for non-interactive cross-AI orchestration. Unlike default mode (which prompts for each edit) or `bypassPermissions` (which is dangerous), `acceptEdits` enables headless refactor delegations while still requiring approval for shell commands. Confirming the boundary (writes yes, shell no) is critical for trust.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CC-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--permission-mode acceptEdits` allows file writes without per-edit prompts while still requiring approval for shell commands. Sandboxed against `/tmp/cli-claude-code-playbook/scratch.ts`.
- Real user request: `Use Claude Code to fix a small bug in this throwaway scratch file - I'm OK with auto-approving the edit since the file is sandboxed.`
- Prompt: `As an external-AI conductor delegating a small refactor of an isolated scratch file, dispatch claude -p with --permission-mode acceptEdits against /tmp/cli-claude-code-playbook/scratch.ts. Verify Claude Code applies the requested edit without interactive approval and that the file mtime advances. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator creates the sandbox scratch file with a known defect, captures the before-mtime, dispatches with `--permission-mode acceptEdits`, captures the after-mtime, then verifies the file was actually rewritten and the bug is fixed.
- Expected signals: Run exits 0. The scratch file's mtime advances. The file's contents reflect the requested change (the bug is fixed). No shell commands were executed without prompting (verify via verbose log).
- Desired user-visible outcome: Verdict confirming the file was edited in-place plus a snippet of the fixed content.
- Pass/fail: PASS if mtime advances AND fixed content present AND exit 0 AND no unprompted shell commands. FAIL if mtime unchanged, content not fixed or shell command ran without prompt.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Recreate the sandbox file with a known defect.
3. Capture before-mtime.
4. Dispatch with `--permission-mode acceptEdits` and a clear edit instruction.
5. Capture after-mtime and inspect resulting content.
6. Return a verdict naming the before/after mtimes and the fix observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-006 | AcceptEdits mode auto-approve writes (SANDBOXED) | Confirm `--permission-mode acceptEdits` allows writes without per-edit prompts; sandboxed against `/tmp/cli-claude-code-playbook/scratch.ts` | `As an external-AI conductor delegating a small refactor of an isolated scratch file, dispatch claude -p with --permission-mode acceptEdits against /tmp/cli-claude-code-playbook/scratch.ts. Verify Claude Code applies the requested edit without interactive approval and that the file mtime advances. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: mkdir -p /tmp/cli-claude-code-playbook && printf 'function add(a, b) { return a - b }\n' > /tmp/cli-claude-code-playbook/scratch.ts` -> 2. `bash: stat -f '%m' /tmp/cli-claude-code-playbook/scratch.ts > /tmp/cc-006-mtime-before.txt` -> 3. `bash: claude -p "Fix the bug in @/tmp/cli-claude-code-playbook/scratch.ts - the function should add, not subtract. Edit the file in place." --permission-mode acceptEdits --verbose --output-format text 2>&1 \| tee /tmp/cc-006-output.txt` -> 4. `bash: stat -f '%m' /tmp/cli-claude-code-playbook/scratch.ts > /tmp/cc-006-mtime-after.txt` -> 5. `bash: cat /tmp/cli-claude-code-playbook/scratch.ts` -> 6. `bash: diff /tmp/cc-006-mtime-before.txt /tmp/cc-006-mtime-after.txt \|\| echo OK_CHANGED` | Step 1: scratch file with `a - b` defect written; Step 2: mtime captured; Step 3: output describes the edit and exits 0; Step 4: mtime captured; Step 5: file contents now contain `a + b`; Step 6: `OK_CHANGED` printed (mtimes differ) | `/tmp/cli-claude-code-playbook/scratch.ts` (post-edit), `/tmp/cc-006-mtime-before.txt`, `/tmp/cc-006-mtime-after.txt`, `/tmp/cc-006-output.txt` | PASS if mtime advances AND file contents now contain `a + b` AND exit 0 AND no unprompted shell commands; FAIL if any condition fails | 1. If mtime unchanged, inspect verbose log for permission denials; 2. Verify the prompt is direct enough to trigger an edit (some prompts may be interpreted as analysis); 3. If shell commands ran without prompting, file a critical bug - acceptEdits should NOT auto-approve shell |

### Optional Supplemental Checks

After the test, restore the scratch file to its original defective state via the same `printf` command so the test can be re-run idempotently. Optionally verify that a follow-up shell-command request in the same dispatch IS prompted (confirming the writes-yes/shell-no boundary), though this is not required to pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Permission mode flags (section 5) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Permission Mode Flags table including `acceptEdits` semantics |
| `../../references/claude_tools.md` | Edit Tool section explaining surgical diff-based editing |

---

## 5. SOURCE METADATA

- Group: Permission Modes
- Playbook ID: CC-006
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--permission-modes/002-accept-edits-auto-approve-writes-sandboxed.md`
