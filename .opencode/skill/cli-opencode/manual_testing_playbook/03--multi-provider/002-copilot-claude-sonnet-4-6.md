---
title: "CO-010 -- github-copilot provider Anthropic alternative (claude-sonnet-4.6)"
description: "This scenario validates the github-copilot Anthropic alternative for `CO-010`. It focuses on confirming `--model github-copilot/claude-sonnet-4.6 --variant high` runs successfully via the github-copilot provider and produces a code-generation response."
---

# CO-010 -- github-copilot provider Anthropic alternative (claude-sonnet-4.6)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-010`.

---

## 1. OVERVIEW

This scenario validates the github-copilot Anthropic alternative for `CO-010`. It focuses on confirming the documented user override path "use copilot claude-sonnet-4.6 high" actually resolves to `--model github-copilot/claude-sonnet-4.6 --variant high` and produces a successful code-generation response. Sonnet 4.6 is the cli-opencode skill's surfaced Anthropic option for balanced reasoning and code review under the GitHub Copilot subscription (no separate Anthropic credentials required).

### Why This Matters

The skill exposes exactly two github-copilot models by name: `gpt-5.4` (default) and `claude-sonnet-4.6` (Anthropic alternative). When an operator wants Anthropic-flavored reasoning for a code review or balanced response without leaving the Copilot OAuth boundary, they should be able to override via `--model github-copilot/claude-sonnet-4.6` and have the dispatch resolve cleanly. If the override silently falls through to gpt-5.4 (the default) or fails resolution, the surfaced two-model surface loses its value.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model github-copilot/claude-sonnet-4.6 --variant high` resolves successfully via the github-copilot provider, executes a small code-generation prompt and the JSON event stream's session.completed payload identifies the model as `claude-sonnet-4.6`.
- Real user request: `Run opencode run with the github-copilot Anthropic alternative (claude-sonnet-4.6) and have it write a small TypeScript helper. Confirm the model id in the JSON event stream is claude-sonnet-4.6 and the generated code compiles.`
- Prompt: `As an external-AI conductor exercising the github-copilot Anthropic alternative path documented in SKILL.md, dispatch --model github-copilot/claude-sonnet-4.6 --variant high with a small code-generation prompt (write a TypeScript helper). Verify the dispatch exits 0, the JSON event stream identifies the model as claude-sonnet-4.6, and the generated TypeScript code is syntactically valid (compiles via tsc --noEmit). Return a concise pass/fail verdict naming the resolved model id and the compile status.`
- Expected execution process: External-AI orchestrator dispatches with `--model github-copilot/claude-sonnet-4.6 --variant high` plus a code-generation prompt, captures the JSON event stream, parses the session.completed event for the model identifier and saves the extracted helper to a .ts file for tsc validation.
- Expected signals: Dispatch exits 0. Session.completed payload references `claude-sonnet-4.6`. Generated TypeScript helper compiles cleanly via `tsc --noEmit` (when tsc is installed). Runtime under 90 seconds.
- Desired user-visible outcome: Verdict naming the resolved model id and the compile status.
- Pass/fail: PASS if exit 0 AND model id is `claude-sonnet-4.6` AND helper compiles (or content-only validation passes when tsc not installed). FAIL if model resolves to a different id, helper is missing or tsc reports errors.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `--model github-copilot/claude-sonnet-4.6 --variant high` plus a TypeScript helper prompt.
3. Parse the JSON event stream and extract the model identifier from session.completed.
4. Save the generated helper to a .ts file and run `tsc --noEmit` (or fall back to content-only validation).
5. Return a verdict naming model id and compile status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-010 | github-copilot Anthropic alternative (claude-sonnet-4.6) | Confirm `--model github-copilot/claude-sonnet-4.6 --variant high` resolves and produces compileable TypeScript | `As an external-AI conductor exercising the github-copilot Anthropic alternative path documented in SKILL.md, dispatch --model github-copilot/claude-sonnet-4.6 --variant high with a small code-generation prompt (write a TypeScript helper). Verify the dispatch exits 0, the JSON event stream identifies the model as claude-sonnet-4.6, and the generated TypeScript code is syntactically valid (compiles via tsc --noEmit). Return a concise pass/fail verdict naming the resolved model id and the compile status.` | 1. `bash: opencode run --model github-copilot/claude-sonnet-4.6 --agent general --variant high --format json --dir "$(pwd)" "Write a TypeScript helper function called formatBytesCO010(bytes: number): string that converts a byte count to a human-readable string (B/KB/MB/GB). Output ONLY the function code (no markdown fences) so it can be saved directly to a .ts file." > /tmp/co-010-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-010-events.jsonl \| grep -ciE 'claude-sonnet-4.6'` -> 4. `bash: jq -r 'select(.type == "message.delta") \| .payload' /tmp/co-010-events.jsonl \| sed -n '/function formatBytesCO010/,/^}/p' > /tmp/co-010-helper.ts && cat /tmp/co-010-helper.ts \| head -20` -> 5. `bash: cd /tmp && (command -v tsc && tsc --noEmit /tmp/co-010-helper.ts && echo "TSC_OK") \|\| echo "TSC_NOT_INSTALLED — content-only validation"` -> 6. `bash: grep -ciE '(formatBytesCO010\|return.*string)' /tmp/co-010-helper.ts` | Step 1: events captured non-empty; Step 2: exit 0; Step 3: model `claude-sonnet-4.6` referenced in session.completed (count >= 1); Step 4: helper.ts contains the formatBytesCO010 function; Step 5: prints `TSC_OK` (when tsc installed) OR fallback message; Step 6: count of `formatBytesCO010` mentions >= 1 | `/tmp/co-010-events.jsonl`, `/tmp/co-010-helper.ts`, terminal output of tsc/grep | PASS if exit 0 AND model id is claude-sonnet-4.6 AND helper.ts contains the function (and compiles when tsc available); FAIL if model resolves differently, helper is missing, or tsc reports errors | 1. If dispatch fails with `provider/model not found`, run `opencode providers` to confirm github-copilot is registered and `auth login github-copilot` has succeeded; 2. If model id is missing from JSON, fall back to `--print-logs --log-level DEBUG` and look for the resolution event; 3. If extracted code is wrapped in markdown fences, strip them with `sed -e '/^```/d'` before saving; 4. If `claude-sonnet-4.6` is not surfaced as a slug, run `opencode models github-copilot` to confirm the exact id |

### Optional Supplemental Checks

For variant range coverage, repeat the test with `--variant max` (claude-sonnet-4.6 accepts the Claude variant range: `minimal`, `low`, `medium`, `high`, `max`) and confirm the response materially deepens. This validates that the underlying-model variant convention applies even when the model is routed via the github-copilot OAuth surface.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 MODEL SELECTION) | github-copilot model surface (gpt-5.4 + claude-sonnet-4.6) and variant range |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 user override table — github-copilot/claude-sonnet-4.6 as Anthropic alternative |
| `../../references/cli_reference.md` | §5 github-copilot model id (`github-copilot/claude-sonnet-4.6`) and Claude variant range |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--multi-provider/002-copilot-claude-sonnet-4-6.md`
