---
title: "CC-004 -- Stream-json incremental output"
description: "This scenario validates Stream-json incremental output for `CC-004`. It focuses on confirming that `--output-format stream-json` emits newline-delimited JSON events for real-time progress consumption."
---

# CC-004 -- Stream-json incremental output

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-004`.

---

## 1. OVERVIEW

This scenario validates Stream-json incremental output for `CC-004`. It focuses on confirming that `--output-format stream-json` emits newline-delimited JSON events for real-time progress consumption.

### Why This Matters

Long-running Claude Code dispatches (deep analysis with Opus, multi-file reviews, structured audits) benefit from incremental progress streaming so the external-AI conductor can surface partial state to the user. If `stream-json` emits a single buffered JSON blob instead of newline-delimited events, every long-running scenario stalls visibly and progress reporting breaks.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--output-format stream-json` emits newline-delimited JSON events suitable for real-time progress tracking.
- Real user request: `Run a longer Claude Code analysis but show me incremental progress events as they happen, not just one big blob at the end.`
- Prompt: `As an external-AI conductor wanting incremental progress events for a longer Claude Code analysis, run claude -p with --output-format stream-json against a multi-step analysis prompt and stream the result through a line-by-line consumer. Verify each stdout line is independently parseable JSON and that distinct event types appear before the final result. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator dispatches the call piped through a `while read line` consumer that parses each line with `jq` and counts distinct event types, then summarizes the count.
- Expected signals: Each non-empty stdout line parses as a single JSON object via `jq`. At least 2 distinct event types appear (for example a progress/intermediate event and a final result event). The stream terminates cleanly with the process exiting 0.
- Desired user-visible outcome: Verdict naming the number of events observed and the distinct event types.
- Pass/fail: PASS if stream produces multiple parseable lines AND at least 2 distinct event types AND exit 0. FAIL if any line is unparseable, only one event type appears (suggests buffering not streaming) or process errors.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Construct a multi-step prompt that should produce intermediate events (e.g., analyze multiple files).
3. Pipe stream-json output through a line-by-line `jq` consumer.
4. Count distinct event types observed.
5. Return a verdict naming the count and types.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-004 | Stream-json incremental output | Confirm `--output-format stream-json` emits newline-delimited JSON events suitable for real-time progress consumption | `As an external-AI conductor wanting incremental progress events for a longer Claude Code analysis, run claude -p with --output-format stream-json against a multi-step analysis prompt and stream the result through a line-by-line consumer. Verify each stdout line is independently parseable JSON and that distinct event types appear before the final result. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: claude -p "List 5 things to look at when reviewing a Node.js Express app for security. For each item, give one short example." --permission-mode plan --output-format stream-json 2>&1 \| tee /tmp/cc-004-stream.jsonl` -> 2. `bash: while IFS= read -r line; do [ -n "$line" ] && echo "$line" \| jq -c -r '.type // .event // "no-type"'; done < /tmp/cc-004-stream.jsonl \| sort -u > /tmp/cc-004-types.txt` -> 3. `bash: wc -l /tmp/cc-004-stream.jsonl` -> 4. `bash: cat /tmp/cc-004-types.txt` | Step 1: file written with multiple non-empty lines; Step 2: all non-empty lines parse as JSON; Step 3: line count > 1; Step 4: at least 2 distinct event types | `/tmp/cc-004-stream.jsonl`, `/tmp/cc-004-types.txt`, terminal transcript with line count and distinct types | PASS if multiple parseable lines AND >=2 distinct event types AND exit 0; FAIL if any line unparseable, only 1 type, or process errors | 1. Confirm output is not buffered by shell - force unbuffered with `stdbuf -oL claude -p ...`; 2. Inspect raw file with `head /tmp/cc-004-stream.jsonl` to see actual envelope shape; 3. If `stream-json` produces a single line, fall back to checking the CLI version with `claude --version` for compatibility |

### Optional Supplemental Checks

If only one event type appears, re-run with a longer multi-step prompt (e.g., "Review @./src/auth.ts and @./src/middleware/auth.ts for security issues, then summarize") to force intermediate events. Some short prompts may legitimately complete in a single event.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Output format flags (section 5) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Stream-json description in output format comparison |
| `../../references/integration_patterns.md` | Background execution and incremental processing patterns |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CC-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/004-stream-json-incremental-output.md`
