---
title: "CG-015 -- JSON output processing pipeline (jq)"
description: "This scenario validates the JSON output processing integration pattern for `CG-015`. It focuses on confirming the orchestrator can extract structured fields from Gemini's JSON envelope using `jq` and feed those fields into downstream decision logic."
---

# CG-015 -- JSON output processing pipeline (jq)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-015`.

---

## 1. OVERVIEW

This scenario validates the JSON output processing pattern documented in `references/integration_patterns.md` §3 for `CG-015`. It focuses on confirming the orchestrator can ask Gemini for structured analysis as JSON, extract specific fields with `jq` and use those fields to drive a deterministic downstream decision (e.g. counting high-severity findings to gate a release).

### Why This Matters

Several cli-gemini integration patterns (validation pipelines, background-task aggregation, dashboards) depend on parsing structured JSON from Gemini and routing on the extracted values. Operators need to verify the structured-extraction contract holds for non-trivial responses, not just for trivial single-line answers.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-015` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Gemini returns a JSON-structured array of findings inside `.response`, that `jq` can parse the embedded JSON and that the orchestrator can compute a deterministic high-severity count from the parsed structure
- Real user request: `Have Gemini scan a tiny snippet for issues and give me a JSON array I can pipe through jq to count the highs — I want to wire that into a release gate.`
- Prompt: `As a cross-AI orchestrator wiring Gemini into a release-gate, invoke Gemini CLI in JSON mode against the cli-gemini skill in this repository to analyse a small Python snippet at /tmp/cg-015-snippet.py. Ask Gemini to return its findings as a JSON array embedded in the response field (each finding has line, severity, description). Verify the orchestrator can parse the embedded JSON with jq and compute the count of severity == "high" findings. Return a concise pass/fail verdict with the main reason, the high-severity count, and the first high finding.`
- Expected execution process: orchestrator drops a small flawed snippet into `/tmp/cg-015-snippet.py`, dispatches the JSON-mode call asking for `findings` as embedded JSON, then runs `jq '.response | fromjson | .findings | map(select(.severity == "high")) | length'` to compute the count
- Expected signals: command exits 0. `.response` contains a JSON array under a `findings` key. `jq` successfully parses the embedded JSON without errors, high-severity count is >= 1 (the snippet has obvious flaws) and first high finding has `line`, `severity`, `description` fields populated
- Desired user-visible outcome: PASS verdict + the high count + the first high finding's description
- Pass/fail: PASS if the embedded JSON parses, the high-count query returns a non-zero integer, AND the first high finding has the three required fields. FAIL if `jq` cannot parse, the count is 0 (the snippet has obvious flaws so 0 indicates Gemini returned malformed JSON) or required fields are missing

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify Gemini's JSON-in-JSON envelope is parseable end-to-end and feeds a downstream count".
2. Stay local. This is a direct CLI dispatch with `jq` post-processing.
3. Use a deterministic snippet with at least two obvious high-severity issues (eval + division by zero) so the count is predictable.
4. Save the raw envelope so failure modes can be inspected without re-burning quota.
5. Surface both the count and the first finding so the operator can sanity-check the parsing.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-015 | JSON output processing | Confirm Gemini's `.response`-embedded JSON parses cleanly with `jq` and supports a downstream high-severity count | `As a cross-AI orchestrator wiring Gemini into a release-gate, invoke Gemini CLI in JSON mode against the cli-gemini skill in this repository to analyse a small Python snippet at /tmp/cg-015-snippet.py. Ask Gemini to return its findings as a JSON array embedded in the response field (each finding has line, severity, description). Verify the orchestrator can parse the embedded JSON with jq and compute the count of severity == "high" findings. Return a concise pass/fail verdict with the main reason, the high-severity count, and the first high finding.` | 1. `bash: printf '%s\n' 'def divide(a, b):' '    return a / b' '' 'def run(user_input):' '    return eval(user_input)' '' 'print(divide(10, 0))' > /tmp/cg-015-snippet.py` -> 2. `bash: gemini "Analyse @/tmp/cg-015-snippet.py and return your findings as JSON. Output ONLY a JSON object of the form {\"findings\":[{\"line\":N,\"severity\":\"high\"\|\"medium\"\|\"low\",\"description\":\"...\"}]} inside the response field. No prose around the JSON." -m gemini-3.1-pro-preview -o json 2>&1 > /tmp/cg-015.json; echo EXIT=$?` -> 3. `bash: jq -r '.response' /tmp/cg-015.json > /tmp/cg-015-inner.json && head -c 80 /tmp/cg-015-inner.json` -> 4. `bash: jq -e '.findings \| length' /tmp/cg-015-inner.json` -> 5. `bash: jq -r '.findings \| map(select(.severity == "high")) \| length' /tmp/cg-015-inner.json` -> 6. `bash: jq -r '.findings \| map(select(.severity == "high")) \| .[0] \| "line=\(.line) severity=\(.severity) description=\(.description)"' /tmp/cg-015-inner.json` | Step 2: `EXIT=0`; Step 3: starts with `{` (parseable embedded JSON); Step 4: returns numeric findings count >= 1; Step 5: high count >= 1; Step 6: prints a populated `line=`/`severity=`/`description=` line | `/tmp/cg-015.json`, `/tmp/cg-015-inner.json`, outputs from Steps 4, 5, and 6 | PASS if Step 5 high count >= 1 AND Step 6 prints non-empty values for all three fields; FAIL if `jq` errors at any step, the high count is 0, or required fields are empty | 1. If Step 3 doesn't start with `{`, Gemini wrapped the JSON in markdown — re-run with stricter `Output ONLY raw JSON, no markdown code fences`; 2. If high count is 0, inspect Step 4 to see whether Gemini classified the eval/division flaws as medium/low — re-run with explicit `Treat eval(user_input) and division by zero as high severity`; 3. If `jq` errors on the inner JSON, the model emitted invalid JSON — log the inner content and escalate |

### Optional Supplemental Checks

If you want extra signal, also confirm `jq -e '.stats.toolCallCount' /tmp/cg-015.json` returns a numeric value > 0, proving Gemini actually ran tools rather than answering blind.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (output flag table in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | §3 JSON OUTPUT PROCESSING, canonical pattern this scenario validates |
| `../../references/cli_reference.md` | §6 OUTPUT FORMATS documents the JSON envelope schema |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CG-015
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--integration-patterns/002-json-output-processing-pipeline.md`
