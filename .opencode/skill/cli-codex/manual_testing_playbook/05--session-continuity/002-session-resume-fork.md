---
title: "CX-017 -- session resume / fork"
description: "This scenario validates codex resume and codex fork for `CX-017`. It focuses on confirming a multi-turn session can be resumed and that fork creates a divergent branch."
---

# CX-017 -- session resume / fork

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-017`.

---

## 1. OVERVIEW

This scenario validates session resume and fork for `CX-017`. It focuses on confirming `codex exec` produces a session ID that can be resumed via `codex resume <session-id>` (or `--session-id`) and that `codex fork <session-id>` creates a divergent branch with full prior context.

### Why This Matters

`references/cli_reference.md` §11 + `references/codex_tools.md` §2 (Session Management) document `resume`/`fork` as the unique multi-turn continuity surface in Codex. They are the alternative to re-providing context via `@file` references. Validating that the surfaces actually preserve prior reasoning is essential for any long-running implementation task.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec` emits a session ID, `codex resume <session-id>` continues the session with full prior context and `codex fork <session-id>` creates a divergent branch.
- Real user request: `Run a 2-step Codex task as one session, then fork it so I can try an alternative approach.`
- Prompt: `As a cross-AI orchestrator running a multi-turn task, dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast" "Begin a 2-step plan: Step 1 sketch a TypeScript User type. Stop after Step 1 and announce the session ID." then resume the same session with codex exec --session-id <id> "Step 2: implement the validate(user) function for the type from Step 1." Verify Codex emits a session ID on Step 1, the resumed Step 2 references the User type, and a separate codex fork <session-id> creates a branch session ID distinct from the original. Return a verdict naming both session IDs and confirming continuity from Step 1 to Step 2.`
- Expected execution process: Operator dispatches Step 1 with explicit session-announce instruction -> captures the session ID from Codex stdout -> dispatches Step 2 with `--session-id <id>` -> verifies Step 2 references the User type from Step 1 -> runs `codex fork <session-id>` -> captures the new fork ID and confirms it differs from the original.
- Expected signals: Step 1 stdout includes a session ID (or operator captures it from log). Step 2 dispatch with `--session-id` exits 0 and references the Step 1 `User` type. `codex fork <id>` returns a new ID different from the original. Step 1 state is preserved across the resume.
- Desired user-visible outcome: A working multi-turn task plus a forked session ID the operator can use to explore an alternative implementation.
- Pass/fail: PASS if Step 1 emits a session ID, Step 2 references the Step 1 type, fork emits a distinct ID and all dispatches exit 0. FAIL if any session ID is missing, Step 2 has no Step 1 context or fork ID matches the original.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create the workspace temp dir.
2. Dispatch Step 1 with explicit "announce the session ID" instruction.
3. Extract the session ID from Step 1 stdout (regex for a UUID-like string or session-id label).
4. Dispatch Step 2 with `--session-id <id>` and verify the User type is referenced.
5. Run `codex fork <id>` and confirm a new ID is emitted that differs from the original.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-017 | session resume / fork | Verify session resume continues prior context and fork creates a distinct branch | `As a cross-AI orchestrator running a multi-turn task, dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast" "Begin a 2-step plan: Step 1 sketch a TypeScript User type. Stop after Step 1 and announce the session ID." then resume the same session with codex exec --session-id <id> "Step 2: implement the validate(user) function for the type from Step 1." Verify Codex emits a session ID on Step 1, the resumed Step 2 references the User type, and a separate codex fork <session-id> creates a branch session ID distinct from the original. Return a verdict naming both session IDs and confirming continuity from Step 1 to Step 2.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx017 && mkdir -p /tmp/cli-codex-playbook-cx017` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Begin a 2-step plan in /tmp/cli-codex-playbook-cx017/: Step 1 sketch a TypeScript User type with id, email, createdAt fields and write it to user.ts. Stop after Step 1 and announce 'SESSION_ID: <id>' on the last line of your output." > /tmp/cli-codex-cx017-step1.txt 2>&1` -> 3. `bash: SESSION_ID=$(grep -oE 'SESSION_ID: [a-zA-Z0-9_-]+' /tmp/cli-codex-cx017-step1.txt \| head -1 \| awk '{print $2}'); printf 'STEP 1 SESSION_ID: %s\n' "$SESSION_ID" > /tmp/cli-codex-cx017-ids.txt` -> 4. `bash: codex exec --session-id "$SESSION_ID" --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Step 2: implement validate(user: User): boolean for the type from Step 1 and write it to /tmp/cli-codex-playbook-cx017/validate.ts." > /tmp/cli-codex-cx017-step2.txt 2>&1` -> 5. `bash: codex fork "$SESSION_ID" > /tmp/cli-codex-cx017-fork.txt 2>&1; FORK_ID=$(grep -oE '[a-zA-Z0-9_-]{8,}' /tmp/cli-codex-cx017-fork.txt \| head -1); printf 'FORK_ID: %s\n' "$FORK_ID" >> /tmp/cli-codex-cx017-ids.txt; [ "$SESSION_ID" != "$FORK_ID" ] && echo "DISTINCT" >> /tmp/cli-codex-cx017-ids.txt \|\| echo "MATCH (FAIL)" >> /tmp/cli-codex-cx017-ids.txt` | Step 1: temp dir exists; Step 2: exit 0, stdout contains a `SESSION_ID:` line; Step 3: SESSION_ID extracted (non-empty); Step 4: exit 0, stdout references the `User` type from Step 1, validate.ts exists; Step 5: FORK_ID extracted, FORK_ID != SESSION_ID (DISTINCT) | Step 1 stdout, Step 2 stdout, fork stdout, IDs file, generated user.ts and validate.ts files, exit codes for all three dispatches | PASS if Step 1 emits a session ID, Step 2 references the User type and exits 0, fork emits a distinct ID, AND both files are written; FAIL if any session ID is missing, Step 2 lacks Step 1 context, or FORK_ID matches SESSION_ID | (1) Confirm `codex --version` >= the version that supports `--session-id` and `codex fork`; (2) re-run with `2>&1 \| tee` for stderr; (3) inspect Step 2 manually for the User type reference; (4) if Codex doesn't emit `SESSION_ID:` in stdout, capture it from `~/.codex/state/<id>/lock` filenames |

### Optional Supplemental Checks

- Open a TUI session with `codex` (no exec) and confirm the session picker lists the session created in Step 1.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§11 Session Management) | Authoritative session-management reference |
| `../../references/codex_tools.md` (§2 Session Management) | Documents resume/fork capabilities |
| `../../references/integration_patterns.md` (§11 Session Continuity) | Multi-turn workflow patterns |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §11 Session Subcommands + Scripted Session Resume |
| `../../references/codex_tools.md` | §2 Unique Capabilities - Session Management |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CX-017
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--session-continuity/002-session-resume-fork.md`
