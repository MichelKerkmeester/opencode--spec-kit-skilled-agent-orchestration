---
title: "CO-009 -- github-copilot provider default (gpt-5.5)"
description: "This scenario validates the github-copilot provider default for `CO-009`. It focuses on confirming `--model github-copilot/gpt-5.5 --variant high` is the canonical cli-opencode skill default and produces a deep-reasoning response."
---

# CO-009 -- github-copilot provider default (gpt-5.5)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-009`.

---

## 1. OVERVIEW

This scenario validates the github-copilot provider default for `CO-009`. It focuses on confirming `--model github-copilot/gpt-5.5 --variant high` is the canonical cli-opencode skill default (per SKILL.md §3) and produces a deep-reasoning response routed through the GitHub Copilot subscription.

### Why This Matters

The skill's default invocation pins `github-copilot/gpt-5.5` plus `--variant high` because routine cli-opencode dispatches benefit from elevated reasoning effort and the GitHub Copilot subscription provides pre-authenticated access to the newest GPT model for active subscribers. If the default model resolution silently falls back to a different Copilot model (claude-sonnet-4.6, gpt-5.4, etc.), every subsequent scenario's reasoning depth, cost expectations and output quality shift in ways that make playbook results unrepeatable. This test proves the documented default is what actually runs when the operator does not override.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model github-copilot/gpt-5.5 --variant high` runs successfully against the github-copilot provider, produces a deep-reasoning response and the JSON event stream's session.completed payload reports a model id containing `gpt-5.5`.
- Real user request: `Run opencode run with the cli-opencode default model (github-copilot/gpt-5.5 at variant high) and have it explain a small architectural trade-off in detail. Confirm the response is detailed (not a 1-line answer) and that the model id in the JSON shows gpt-5.5.`
- Prompt: `As an external-AI conductor verifying the cli-opencode default model resolution, dispatch with --model github-copilot/gpt-5.5 --variant high and a multi-dimensional architecture trade-off prompt (event sourcing vs CRUD). Verify the response weighs at least 3 dimensions, the JSON session.completed event identifies the model as gpt-5.5, and the response is materially longer than a one-paragraph reply. Return a concise pass/fail verdict naming the model id and the trade-off dimensions discussed.`
- Expected execution process: External-AI orchestrator dispatches with the explicit gpt-5.5 + high default, captures the JSON event stream, parses the session.completed event for the model identifier and counts trade-off dimensions in the response.
- Expected signals: Dispatch exits 0. Session.completed payload references `gpt-5.5` as the model. Response weighs at least 3 distinct trade-off dimensions. Runtime under 180 seconds. Cost (when surfaced) is at the GitHub Copilot subscription tier.
- Desired user-visible outcome: Verdict naming the resolved model id and the dimension count.
- Pass/fail: PASS if exit 0 AND model id contains `gpt-5.5` AND response weighs >= 3 dimensions. FAIL if model resolves to a different id, response is shallow or exit code is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with the explicit cli-opencode default (`--model github-copilot/gpt-5.5 --variant high`).
3. Parse the JSON event stream and extract the model identifier from session.completed.
4. Count distinct trade-off dimensions in the response text.
5. Return a verdict naming model id, dimension count and runtime.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-009 | github-copilot provider default (gpt-5.5) | Confirm `--model github-copilot/gpt-5.5 --variant high` resolves correctly and produces a deep-reasoning response | `As an external-AI conductor verifying the cli-opencode default model resolution, dispatch with --model github-copilot/gpt-5.5 --variant high and a multi-dimensional architecture trade-off prompt (event sourcing vs CRUD). Verify the response weighs at least 3 dimensions, the JSON session.completed event identifies the model as gpt-5.5, and the response is materially longer than a one-paragraph reply. Return a concise pass/fail verdict naming the model id and the trade-off dimensions discussed.` | 1. `bash: opencode run --model github-copilot/gpt-5.5 --agent general --variant high --format json --dir "$(pwd)" "Compare event sourcing vs traditional CRUD for an order management system. Weigh consistency, query performance, learning curve, and scalability. Recommend one with a confidence level." > /tmp/co-009-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-009-events.jsonl \| grep -ciE 'gpt-5.5'` -> 4. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-009-events.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability)' \| awk '{print $1}'` -> 5. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-009-events.jsonl \| wc -c` | Step 1: events captured non-empty; Step 2: exit 0; Step 3: session.completed references the resolved model id `gpt-5.5` (count >= 1); Step 4: count of distinct dimension keywords >= 3; Step 5: total response byte count > 1000 (deep reasoning, not one-paragraph) | `/tmp/co-009-events.jsonl`, terminal grep counts | PASS if exit 0 AND model id contains `gpt-5.5` AND >= 3 dimensions discussed AND response > 1000 bytes; FAIL if any check fails | 1. If model id resolves to a different value, run `opencode models github-copilot` to confirm `gpt-5.5` is the correct slug for this version; 2. If response is shallow, the variant flag may have been ignored — re-run with `--variant xhigh` and compare; 3. If `gpt-5.5` is not surfaced in JSON, the event schema may strip the provider prefix — fall back to `--print-logs --log-level DEBUG` and inspect log lines for the model resolution; 4. Confirm the GitHub Copilot subscription is active and `opencode auth list` shows `github-copilot` as a registered provider |

### Optional Supplemental Checks

For variant comparison, repeat the test with `--variant minimal` and confirm the response is materially shorter and shallower IF the github-copilot provider honors the variant flag for gpt-5.5. If both variants produce identical output, document that the variant flag is a no-op at that level; gpt-5.5 accepts the GPT variant range (`minimal`, `low`, `medium`, `high`, `xhigh`).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 MODEL SELECTION) | Provider/model id table and variant flag mapping |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation (github-copilot/gpt-5.5 high) and ALWAYS rule 3 |
| `../../references/cli_reference.md` | §5 model selection, §4 `--variant` flag |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--multi-provider/001-copilot-default-gpt-5-5.md`
