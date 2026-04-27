---
title: "CO-002 -- Output format default vs json"
description: "This scenario validates `--format default` vs `--format json` for `CO-002`. It focuses on confirming the formatted log and the newline-delimited JSON event stream both run successfully and produce the expected output shape."
---

# CO-002 -- Output format default vs json

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-002`.

---

## 1. OVERVIEW

This scenario validates Output format default vs json for `CO-002`. It focuses on confirming `--format default` returns a human-readable log while `--format json` returns a stable newline-delimited JSON event stream that downstream tools can parse incrementally.

### Why This Matters

The cli-opencode skill defaults to `--format json` because external runtimes parse the stream incrementally (per ALWAYS rule 4 in SKILL.md and `references/cli_reference.md` §7). If `--format default` and `--format json` are not both functional, every downstream pattern that relies on the JSON event schema (CO-003 through CO-031) silently degrades. This test proves both surfaces work for the same prompt.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--format default` returns formatted human-readable output and `--format json` returns a parseable newline-delimited event stream for the same prompt.
- Real user request: `Run the same opencode run prompt twice — once with --format default and once with --format json — and show me both outputs side by side.`
- Prompt: `As an external-AI conductor verifying both opencode run output formats are intact, dispatch the same short prompt twice with --format default and --format json, then compare. Verify the default output is human-readable and the JSON output parses with jq and contains the documented event shape (type, timestamp, session_id, payload). Return a concise pass/fail verdict naming the event types found in the JSON variant.`
- Expected execution process: External-AI orchestrator dispatches the same prompt twice with each format, captures both outputs, validates the default output contains plain text and validates the JSON output parses cleanly and contains `session.started` and `session.completed` events.
- Expected signals: Step 1 (`--format default`) writes a non-empty human-readable log with the assistant's reply. Step 2 (`--format json`) writes one JSON object per line. `jq -r '.type'` enumerates at least 3 distinct event types. Both invocations exit 0.
- Desired user-visible outcome: Verdict naming the format with the formatted log line count and the JSON event-type histogram.
- Pass/fail: PASS if both formats exit 0 AND default output is human-readable AND JSON output parses with jq AND JSON has `session.started` + `session.completed`. FAIL if either invocation fails or the JSON is malformed.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch the same prompt with `--format default` and capture stdout.
3. Dispatch the same prompt with `--format json` and capture stdout.
4. Validate the default output contains a human-readable assistant reply.
5. Parse the JSON output with `jq` and enumerate event types.
6. Return a verdict naming both shapes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-002 | Output format default vs json | Confirm `--format default` returns formatted human output and `--format json` returns a parseable event stream for the same prompt | `As an external-AI conductor verifying both opencode run output formats are intact, dispatch the same short prompt twice with --format default and --format json, then compare. Verify the default output is human-readable and the JSON output parses with jq and contains the documented event shape (type, timestamp, session_id, payload). Return a concise pass/fail verdict naming the event types found in the JSON variant.` | 1. `bash: opencode run --model github-copilot/gpt-5.4 --agent general --variant high --format default --dir "$(pwd)" "Reply with one short sentence: what is the cli-opencode skill?" > /tmp/co-002-default.log 2>&1` -> 2. `bash: opencode run --model github-copilot/gpt-5.4 --agent general --variant high --format json --dir "$(pwd)" "Reply with one short sentence: what is the cli-opencode skill?" > /tmp/co-002-json.jsonl 2>&1` -> 3. `bash: wc -l /tmp/co-002-default.log /tmp/co-002-json.jsonl` -> 4. `bash: grep -ciE '(opencode\|cli-opencode\|skill)' /tmp/co-002-default.log` -> 5. `bash: jq -r '.type' /tmp/co-002-json.jsonl \| sort \| uniq -c` -> 6. `bash: jq -e 'select(.type == "session.completed")' /tmp/co-002-json.jsonl > /dev/null && echo OK` | Step 1: default log written non-empty; Step 2: JSON lines written non-empty; Step 3: both files have line counts > 0; Step 4: default log mentions opencode/cli-opencode/skill at least once; Step 5: histogram shows `session.started`, `message.delta`, `session.completed`; Step 6: prints `OK` | `/tmp/co-002-default.log`, `/tmp/co-002-json.jsonl`, terminal histogram from step 5 | PASS if both exits 0 AND default output is human-readable AND JSON parses with jq AND has session.started + session.completed; FAIL if any check fails | 1. If default log is empty, the assistant may be filtered by a parent process — re-run interactively; 2. If JSON output has stray non-JSON lines (e.g. `--print-logs` was on), re-run without `--print-logs` and only use stderr for logs; 3. If `jq -r '.type'` errors, validate the file is line-delimited JSON with `head -1 /tmp/co-002-json.jsonl \| jq .`; 4. Confirm version is v1.3.17 — older versions may emit `--format json` as the default and reject the flag |

### Optional Supplemental Checks

For format stability, run a third dispatch with the same prompt and confirm the JSON event types are identical between two runs (modulo timestamps and session ids). This catches regressions where a new event type is introduced in a binary upgrade.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§7 Output Format and Event Stream) | JSON event schema and line-delimited contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 4 (always pass `--format json` unless human formatted output requested) |
| `../../references/cli_reference.md` | §4 `opencode run` flag table, §7 event stream documentation |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/002-format-default-vs-json.md`
