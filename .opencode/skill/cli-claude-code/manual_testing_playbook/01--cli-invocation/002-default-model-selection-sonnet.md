---
title: "CC-002 -- Default model selection (Sonnet)"
description: "This scenario validates Default model selection (Sonnet) for `CC-002`. It focuses on confirming that omitting `--model` and explicit `--model claude-sonnet-4-6` produce equivalent behavior."
---

# CC-002 -- Default model selection (Sonnet)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-002`.

---

## 1. OVERVIEW

This scenario validates Default model selection (Sonnet) for `CC-002`. It focuses on confirming that omitting `--model` and explicit `--model claude-sonnet-4-6` produce equivalent behavior.

### Why This Matters

The cli-claude-code skill defaults to Sonnet for general-purpose tasks. ALWAYS rule 7 in the skill instructs orchestrators to specify the model explicitly, so confirming the implicit default matches the explicit `claude-sonnet-4-6` is the safety check that lets orchestrators omit the flag in routine prompts when context already documents the model choice.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CC-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that omitting `--model` and explicit `--model claude-sonnet-4-6` produce equivalently-shaped responses and that the JSON output reports the expected model.
- Real user request: `Use Claude Code to suggest the cleanest way to refactor a 30-line callback-based function to async/await, using the project's existing patterns - make sure we're getting the balanced default model, not Opus.`
- Prompt: `As an external-AI conductor needing a balanced general-purpose dispatch, run two parallel claude -p invocations - one without --model, one with --model claude-sonnet-4-6 - and confirm both produce equivalently-shaped responses for a standard refactor question. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator dispatches both calls (one per model variant), captures both responses to disk, compares JSON metadata to confirm both used Sonnet, then summarizes the equivalence finding.
- Expected signals: Both invocations exit 0. Both responses describe the same refactor approach with comparable depth. JSON output (when requested) reports `claude-sonnet-4-6` as the model. Cost metadata is in the same order of magnitude.
- Desired user-visible outcome: One-line verdict confirming default-vs-explicit model equivalence plus the captured model id from JSON output.
- Pass/fail: PASS if both runs exit 0 AND both JSON responses include `claude-sonnet-4-6` (or the documented Sonnet model id) AND response shapes are comparable. FAIL if model ids differ or one run errors.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Construct two parallel dispatches sharing the same prompt body.
3. Capture both outputs to distinct files for diff and metadata inspection.
4. Compare model ids from JSON metadata.
5. Return a verdict that names the model id observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-002 | Default model selection (Sonnet) | Confirm omitting `--model` and explicit `--model claude-sonnet-4-6` produce equivalent behavior | `As an external-AI conductor needing a balanced general-purpose dispatch, run two parallel claude -p invocations - one without --model, one with --model claude-sonnet-4-6 - and confirm both produce equivalently-shaped responses for a standard refactor question. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: claude -p "Suggest the cleanest async/await refactor for: function getUser(id, cb) { db.find(id, (err, u) => cb(err, u && u.toJSON())) }" --output-format json 2>&1 > /tmp/cc-002-default.json` -> 2. `bash: claude -p "Suggest the cleanest async/await refactor for: function getUser(id, cb) { db.find(id, (err, u) => cb(err, u && u.toJSON())) }" --model claude-sonnet-4-6 --output-format json 2>&1 > /tmp/cc-002-explicit.json` -> 3. `bash: jq -r '.model // .session // .result' /tmp/cc-002-default.json /tmp/cc-002-explicit.json` -> 4. `bash: jq -r '.cost' /tmp/cc-002-default.json /tmp/cc-002-explicit.json` | Step 1: file written; Step 2: file written; Step 3: both files surface a `claude-sonnet-4-6`-shaped model identifier; Step 4: both costs are positive numbers in the same order of magnitude | `/tmp/cc-002-default.json`, `/tmp/cc-002-explicit.json`, terminal transcript | PASS if both runs exit 0 AND both JSON outputs reference Sonnet AND costs are within an order of magnitude; FAIL if model ids differ or either run errors | 1. Re-run each call individually with `--output-format text` to isolate failure; 2. Inspect `jq '.error // .message'` on the JSON outputs; 3. If model id is missing from JSON envelope, fall back to checking `--verbose` output for the model line |

### Optional Supplemental Checks

If costs differ by more than an order of magnitude, capture a third run with `--output-format json` and `--verbose`, then inspect `cost`, `usage` and any retry events that may have inflated one run.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Models table (section 6) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 7 (always specify model) |
| `../../references/cli_reference.md` | Sonnet model id and pricing tier reference |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CC-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/002-default-model-selection-sonnet.md`
