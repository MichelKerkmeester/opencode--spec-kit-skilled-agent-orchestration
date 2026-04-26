---
title: "CG-002 -- JSON output mode"
description: "This scenario validates structured JSON output from Gemini CLI (`-o json`) for `CG-002`. It focuses on confirming the response includes the documented `response`, `toolCalls`, and `stats` envelope so downstream automations can parse Gemini output deterministically."
---

# CG-002 -- JSON output mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-002`.

---

## 1. OVERVIEW

This scenario validates that `gemini "[prompt]" -o json` returns a parseable JSON envelope containing at least `response` and `stats` for `CG-002`. It focuses on the contract documented in `references/cli_reference.md` §6 OUTPUT FORMATS so cross-AI workflows that pipe Gemini output through `jq` or Node parsers can rely on the schema.

### Why This Matters

Several cli-gemini integration patterns (JSON output processing, validation pipelines, background execution) depend on structured output. If `-o json` silently regresses to text or omits the documented fields, downstream parsers will throw and the orchestrator will treat valid Gemini answers as failures.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `gemini "[prompt]" -o json 2>&1` returns parseable JSON containing `response` and `stats` keys at minimum
- Real user request: `Have Gemini count the markdown files under the cli-gemini references folder and give me back the answer plus token stats so I can log it.`
- Prompt: `As a cross-AI orchestrator preparing automated logging, invoke Gemini CLI with structured JSON output against the cli-gemini skill in this repository. Verify the result parses as JSON and exposes the documented response and stats envelope. Return a concise pass/fail verdict with the main reason, the parsed answer, and the totalInputTokens / totalOutputTokens from stats.`
- Expected execution process: orchestrator runs the JSON-mode call, pipes stdout into `jq` to confirm parseability and inspects the documented envelope keys
- Expected signals: command exits 0. Stdout starts with `{`. `jq -r '.response'` returns a non-empty string. `jq -e '.stats.totalInputTokens'` and `jq -e '.stats.totalOutputTokens'` succeed and return numeric values
- Desired user-visible outcome: orchestrator returns the natural-language count + a token-stats line such as `tokens in/out: 1234/56`
- Pass/fail: PASS if stdout parses as JSON AND the response + stats keys are present with non-empty values. FAIL if `jq` errors, response is empty or stats keys are missing

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify Gemini's JSON envelope schema is intact for downstream parsers".
2. Stay local. This is a direct CLI dispatch.
3. Capture stdout into a temp file so failures can be re-inspected without re-burning quota.
4. Validate JSON shape with `jq` rather than eyeballing the raw blob.
5. Return both the natural-language answer and the token stats so the operator sees real evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-002 | JSON output mode | Confirm `gemini -o json` returns the documented `{response, stats}` envelope and parses cleanly with `jq` | `As a cross-AI orchestrator preparing automated logging, invoke Gemini CLI with structured JSON output against the cli-gemini skill in this repository. Verify the result parses as JSON and exposes the documented response and stats envelope. Return a concise pass/fail verdict with the main reason, the parsed answer, and the totalInputTokens / totalOutputTokens from stats.` | 1. `bash: gemini "Count the markdown files under .opencode/skill/cli-gemini/references and answer with a single integer." -o json 2>&1 > /tmp/cg-002.json` -> 2. `bash: jq -r '.response' /tmp/cg-002.json` -> 3. `bash: jq -e '.stats.totalInputTokens, .stats.totalOutputTokens' /tmp/cg-002.json` | Step 1: command exits 0, `/tmp/cg-002.json` begins with `{`; Step 2: returns a non-empty string containing an integer answer; Step 3: returns two numeric lines, exit code 0 | `/tmp/cg-002.json` saved as evidence + stdout from Steps 2 and 3 | PASS if Steps 1-3 all succeed AND `.response` is non-empty AND both stats keys parse as numbers; FAIL if `jq` errors at any step, `.response` is empty, or stats keys are missing | 1. `head -c 200 /tmp/cg-002.json` to inspect raw envelope; 2. Re-run with `-o text` to confirm the model itself is responsive; 3. If schema differs, check `references/cli_reference.md` §6 to confirm Gemini CLI version still emits the documented envelope |

### Optional Supplemental Checks

If `.toolCalls` is present, spot-check that each entry has `name` and `args` fields. Missing tool-call structure is not a hard fail for this scenario, but should be noted in the evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (output flag table in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §6 OUTPUT FORMATS documents the JSON envelope schema |
| `../../references/integration_patterns.md` | §3 JSON OUTPUT PROCESSING shows the downstream parser contract that depends on this scenario |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CG-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/002-json-output-mode.md`
