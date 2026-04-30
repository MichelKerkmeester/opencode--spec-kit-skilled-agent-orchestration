---
title: "CC-026 -- Max budget USD cap behavior"
description: "This scenario validates `--max-budget-usd` cost cap behavior for `CC-026`. It focuses on confirming the budget flag is accepted and that JSON cost metadata stays within the cap."
---

# CC-026 -- Max budget USD cap behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-026`.

---

## 1. OVERVIEW

This scenario validates Max budget USD cap behavior for `CC-026`. It focuses on confirming `--max-budget-usd <value>` is accepted by the CLI, that the dispatched session honors the cap and that JSON output metadata reports a `cost` value not exceeding the supplied budget for a small read-only prompt.

### Why This Matters

The `--max-budget-usd` flag is the documented cost-control surface for cross-AI Claude Code dispatches per SKILL.md §3 (How It Works) and is referenced by the cli-claude-code rules as the canonical lever for batch operations. If the budget cap is silently ignored or the cost metadata reports values above the cap, automated operators that rely on the cap for unattended runs lose their financial guardrail.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-026` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--max-budget-usd 0.50` is accepted by the CLI, that the dispatch completes successfully for a small read-only prompt and that the JSON output reports a `cost` value not exceeding the cap.
- Real user request: `Run a quick code review with a 50-cent budget cap so I can guarantee unattended runs do not run away.`
- RCAF Prompt: `As an external-AI conductor enforcing cost discipline on an unattended run, dispatch claude -p --max-budget-usd 0.50 --output-format json --permission-mode plan against a small TypeScript file. Verify the dispatch exits 0, the JSON output contains a numeric cost field, and that cost is at or below 0.50. Return a verdict naming the cost value reported and confirming it is within the cap.`
- Expected execution process: External-AI orchestrator picks a small target file, dispatches with `--max-budget-usd 0.50 --output-format json`, captures the JSON envelope, then validates the `cost` field is present and within the cap.
- Expected signals: Dispatch exits 0. JSON output is parseable via `jq`. JSON output contains a numeric `cost` (or `total_cost_usd`) field. Reported cost is at or below 0.50. Dispatched command line includes `--max-budget-usd 0.50`.
- Desired user-visible outcome: A successful review output plus provable cost evidence the operator can attach to a budget audit.
- Pass/fail: PASS if exit 0 AND JSON parseable AND cost <= 0.50. FAIL if dispatch errors, JSON malformed or cost exceeds the cap.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pick a small target file for the review.
3. Dispatch with `--max-budget-usd 0.50 --output-format json --permission-mode plan`.
4. Parse the JSON envelope and extract the cost value.
5. Verify cost is at or below the cap.
6. Return a verdict naming the cost and confirming the cap was honored.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-026 | Max budget USD cap behavior | Confirm `--max-budget-usd 0.50` is accepted and the reported cost is at or below the cap | `As an external-AI conductor enforcing cost discipline on an unattended run, dispatch claude -p --max-budget-usd 0.50 --output-format json --permission-mode plan against @./.opencode/skill/cli-claude-code/SKILL.md and ask for a one-paragraph summary. Verify the dispatch exits 0, the JSON envelope contains a numeric cost field, and that cost is at or below 0.50. Return a verdict naming the cost value reported and confirming it is within the cap.` | 1. `bash: claude -p "Summarize the cli-claude-code skill in one paragraph based on @./.opencode/skill/cli-claude-code/SKILL.md." --max-budget-usd 0.50 --output-format json --permission-mode plan 2>&1 > /tmp/cc-026-output.json` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -e '.' /tmp/cc-026-output.json > /dev/null && echo OK_JSON` -> 4. `bash: jq -r '(.total_cost_usd // .cost // empty)' /tmp/cc-026-output.json` -> 5. `bash: jq -e '((.total_cost_usd // .cost // 0) \| tonumber) <= 0.50' /tmp/cc-026-output.json && echo OK_UNDER_CAP` | Step 1: dispatch captured; Step 2: exit 0; Step 3: JSON parseable; Step 4: cost value extracted as a number; Step 5: cost is <= 0.50 (`OK_UNDER_CAP` printed) | `/tmp/cc-026-output.json`, terminal exit codes and jq output | PASS if exit 0 AND JSON parseable AND cost <= 0.50; FAIL if dispatch errors or JSON is malformed or cost exceeds the cap | 1. If the dispatch fails immediately, the budget cap may be too low for any meaningful response, raise to 1.00 and re-test with the same prompt; 2. If JSON omits the cost field, check the CLI version supports the field, otherwise log as a documentation drift; 3. If cost exceeds the cap, the budget guardrail regressed, file a high-severity bug |

### Optional Supplemental Checks

For batch-budget validation, dispatch the same prompt twice with a single `--max-budget-usd 1.00` allocated across the pair and confirm the cumulative cost stays under 1.00. This validates the cap is per-session and not per-call.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Documents the `--max-budget-usd` flag |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 189) | Documents `--max-budget-usd` in the §3 flag table |
| `../../references/cli_reference.md` | Cost control surface and budget contract |

---

## 5. SOURCE METADATA

- Group: Cost And Background
- Playbook ID: CC-026
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--cost-and-background/001-max-budget-usd-cap.md`
