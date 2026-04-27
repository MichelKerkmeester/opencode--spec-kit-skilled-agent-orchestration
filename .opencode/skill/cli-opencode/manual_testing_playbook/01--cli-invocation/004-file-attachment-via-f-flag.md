---
title: "CO-004 -- File attachment via -f / --file flag"
description: "This scenario validates the `-f` / `--file` flag for `CO-004`. It focuses on confirming the dispatched session can read attached file contents without manual @./path embedding in the prompt body."
---

# CO-004 -- File attachment via -f / --file flag

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-004`.

---

## 1. OVERVIEW

This scenario validates File attachment via `-f` / `--file` for `CO-004`. It focuses on confirming the `-f <path>` flag attaches a file to the message so the dispatched session has direct access to its contents without the operator pasting them inline.

### Why This Matters

`-f` / `--file` is the documented attachment vector in `references/cli_reference.md` §4 (Core flags table). When external runtimes need to send code, configs or evidence to a dispatched OpenCode session, file attachment is more reliable than inline embedding (no quoting, no truncation, no shell escaping). If `-f` silently drops the file or the session cannot reference it, every documentation, review and analysis dispatch that uses an attachment regresses. This test proves the attachment vector actually works.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `-f <path>` attaches a file to the message and the dispatched session correctly references its contents in its reply.
- Real user request: `I have a small TypeScript file at /tmp/co-004-sample.ts. Use opencode run with -f to attach it and ask OpenCode to summarize what the file does, without pasting the file contents inline.`
- Prompt: `As an external-AI conductor verifying file attachment works without inline pasting, write a tiny TypeScript snippet to /tmp/co-004-sample.ts and dispatch opencode run with -f /tmp/co-004-sample.ts and a prompt that asks the session to summarize the attached file's purpose in one sentence. Verify the reply names the function or class defined in the attachment, not generic text. Return a concise pass/fail verdict naming the function the session identified.`
- Expected execution process: External-AI orchestrator writes a tiny TS file, dispatches with `-f` and a prompt asking for a summary, then verifies the reply mentions the function name or unique identifier from the attachment.
- Expected signals: Dispatch exits 0. The session reply references the function name `helloWorld` (or whatever unique identifier was in the attachment). JSON event stream may include `tool.call` events for file reads inside the session.
- Desired user-visible outcome: Verdict naming the function the session identified plus the attachment path used.
- Pass/fail: PASS if exit 0 AND reply mentions the unique identifier from the attachment. FAIL if reply is generic and does not reference the attachment contents.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Write a tiny TypeScript file with a uniquely-named function to `/tmp/co-004-sample.ts`.
3. Dispatch with `-f /tmp/co-004-sample.ts` and a summary prompt.
4. Inspect the reply for the unique function name.
5. Return a verdict naming the identified function.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-004 | File attachment via -f / --file flag | Confirm `-f <path>` attaches a file and the dispatched session references its contents in its reply | `As an external-AI conductor verifying file attachment works without inline pasting, write a tiny TypeScript snippet to /tmp/co-004-sample.ts and dispatch opencode run with -f /tmp/co-004-sample.ts and a prompt that asks the session to summarize the attached file's purpose in one sentence. Verify the reply names the function or class defined in the attachment, not generic text. Return a concise pass/fail verdict naming the function the session identified.` | 1. `bash: printf 'export function helloWorld_co004(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n' > /tmp/co-004-sample.ts && cat /tmp/co-004-sample.ts` -> 2. `bash: opencode run --model github-copilot/gpt-5.4 --agent general --variant high --format json --dir "$(pwd)" -f /tmp/co-004-sample.ts "Summarize the attached TypeScript file in one short sentence. Name the function it exports." > /tmp/co-004-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-004-events.jsonl \| grep -c "helloWorld_co004"` | Step 1: file written and confirmed via cat; Step 2: events captured non-empty; Step 3: exit 0; Step 4: count of `helloWorld_co004` references in message deltas or session.completed >= 1 | `/tmp/co-004-sample.ts`, `/tmp/co-004-events.jsonl`, terminal transcript | PASS if exit 0 AND reply mentions `helloWorld_co004`; FAIL if reply is generic or does not reference the unique function name | 1. Verify `-f` is the documented short flag in `opencode run --help` (drift handled per `references/cli_reference.md` §9); 2. If reply is generic, the attachment may have been silently dropped — re-run with `--print-logs` and look for an attachment confirmation event; 3. Try `--file` (long form) instead of `-f` if the short form fails; 4. Confirm `/tmp/co-004-sample.ts` is readable from the working directory by the binary process |

### Optional Supplemental Checks

For multi-file attachments, repeat the test passing `-f /tmp/co-004-a.ts -f /tmp/co-004-b.ts` and confirm the reply references both unique identifiers. This validates the array-typed `-f` flag documented in the cli_reference flag table.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 `-f`/`--file` row in flag table) | Documents the file attachment contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 default invocation shape and core flag table |
| `../../references/cli_reference.md` | §4 `-f`/`--file` documented as `array` type allowing repeated use |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/004-file-attachment-via-f-flag.md`
