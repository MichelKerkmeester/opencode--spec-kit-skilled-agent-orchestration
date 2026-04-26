---
title: "CC-003 -- Output format text vs json"
description: "This scenario validates Output format text vs json for `CC-003`. It focuses on confirming the difference between `--output-format text` (plain prose) and `--output-format json` (envelope with metadata)."
---

# CC-003 -- Output format text vs json

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-003`.

---

## 1. OVERVIEW

This scenario validates Output format text vs json for `CC-003`. It focuses on confirming the difference between `--output-format text` (plain prose) and `--output-format json` (envelope with metadata).

### Why This Matters

Many downstream scenarios depend on JSON output to capture `session_id` (CC-016), cost metadata (CC-008, CC-010) and pipeline-grade results (CC-018). A failure here cascades into every JSON-dependent test, so this baseline test is run early and re-validated whenever the dispatcher changes shape.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--output-format text` returns plain stdout while `--output-format json` returns a JSON envelope with `result`, `cost` and `session_id` fields.
- Real user request: `Run the same Claude Code prompt twice - once for a human-readable answer and once as JSON I can pipe into a script - so I can confirm the JSON envelope is parseable.`
- Prompt: `As an external-AI conductor needing both a human-readable answer and machine-parseable metadata for the same prompt, run the same claude -p request twice with --output-format text and --output-format json. Verify the text output is plain prose and the JSON output is parseable with jq and includes the expected metadata keys. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator dispatches both calls in sequence with identical prompt bodies, then parses the JSON output with `jq` to extract the answer and metadata.
- Expected signals: Step 1 returns plain text. Step 2 returns valid JSON. `jq -r '.result'` extracts the same answer content from JSON output. JSON output includes a non-empty `session_id` string.
- Desired user-visible outcome: One-line verdict confirming both formats work plus the captured `session_id` for use by future scenarios.
- Pass/fail: PASS if text run returns plain prose AND JSON run is valid JSON AND `jq -r '.result'` extracts answer content AND `session_id` is non-empty. FAIL if JSON is unparseable or `session_id` is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Run the same prompt body twice with the two output formats.
3. Validate JSON parseability before extracting fields.
4. Confirm `session_id` is present and non-empty for downstream use.
5. Return a verdict that names the captured `session_id`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-003 | Output format text vs json | Confirm `--output-format text` returns plain prose and `--output-format json` returns a JSON envelope with metadata | `As an external-AI conductor needing both a human-readable answer and machine-parseable metadata for the same prompt, run the same claude -p request twice with --output-format text and --output-format json. Verify the text output is plain prose and the JSON output is parseable with jq and includes the expected metadata keys. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: claude -p "Summarize what the os.path.join function does in one sentence." --output-format text 2>&1 \| tee /tmp/cc-003-text.txt` -> 2. `bash: claude -p "Summarize what the os.path.join function does in one sentence." --output-format json 2>&1 > /tmp/cc-003-json.json` -> 3. `bash: jq empty /tmp/cc-003-json.json && echo OK_PARSE` -> 4. `bash: jq -r '.result' /tmp/cc-003-json.json` -> 5. `bash: jq -r '.session_id // .session.id // .id' /tmp/cc-003-json.json` | Step 1: text file contains plain prose without `{` or `}` envelope wrappers; Step 2: file written; Step 3: `OK_PARSE` printed; Step 4: extracted result is a non-empty string; Step 5: session id is a non-empty string | `/tmp/cc-003-text.txt`, `/tmp/cc-003-json.json`, terminal transcript including extracted session_id | PASS if all 5 step conditions hold; FAIL if JSON unparseable, result empty, or `session_id` missing | 1. Re-run JSON dispatch with `--verbose` to expose envelope shape; 2. Try `jq '.' /tmp/cc-003-json.json` to inspect the full envelope manually; 3. If `session_id` is in a different key, update the playbook to use the discovered key path |

### Optional Supplemental Checks

Save the captured `session_id` to `/tmp/cc-003-session-id` for CC-016 (resume by ID) which depends on a real session id captured from JSON output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Output format flags (section 5) and structured output (section 9) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 4 (use text format unless JSON is needed) |
| `../../references/cli_reference.md` | Output format comparison table |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CC-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/003-output-format-text-vs-json.md`
