---
title: "CO-012 -- Variant levels (minimal/low/medium/high/max)"
description: "This scenario validates the `--variant` flag levels for `CO-012`. It focuses on confirming the documented variant range (minimal, low, medium, high, max) maps to provider-specific reasoning effort and produces materially different response depth between extremes."
---

# CO-012 -- Variant levels (minimal/low/medium/high/max)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-012`.

---

## 1. OVERVIEW

This scenario validates Variant levels for `CO-012`. It focuses on confirming the `--variant` flag accepts the documented range (`minimal`, `low`, `medium`, `high`, `max` for Anthropic) and that the response depth materially differs between extremes when the same prompt is dispatched.

### Why This Matters

The cli-opencode skill defaults to `--variant high` because routine dispatches benefit from elevated reasoning effort (per SKILL.md §3 and `references/cli_reference.md` §5). If the variant flag is silently ignored or the levels do not actually shift reasoning depth, the skill default loses its value and operators have no real way to dial cost vs depth. This test proves the variant flag is functional by comparing `minimal` vs `max` for the same prompt and confirming the response token count and depth differ materially.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--variant minimal` and `--variant max` produce materially different response depth for the same prompt, proving the variant flag actually drives provider reasoning effort.
- Real user request: `Run the same prompt twice — once with --variant minimal and once with --variant max — and show me how much longer and more detailed the max response is.`
- Prompt: `As an external-AI conductor verifying the variant flag truly drives reasoning depth, dispatch the same multi-dimensional architecture trade-off prompt twice with --variant minimal and --variant max. Verify both runs exit 0, the max-variant response is at least 2x longer than the minimal response, and the max response weighs at least 2 more dimensions than the minimal response. Return a concise pass/fail verdict naming both response byte counts and dimension counts.`
- Expected execution process: External-AI orchestrator dispatches the same prompt twice, captures both event streams, computes the response byte count for each, counts trade-off dimensions in each and validates the max variant produces materially deeper output.
- Expected signals: Both dispatches exit 0. Max-variant response byte count is at least 2x the minimal-variant byte count. Max response weighs at least 2 more distinct trade-off dimensions than minimal. Both runs identify the same model.
- Desired user-visible outcome: Verdict naming both byte counts, both dimension counts and the variant ratio.
- Pass/fail: PASS if both exit 0 AND max byte count >= 2x minimal AND max dimensions >= minimal + 2. FAIL if variant flag has no effect (counts are roughly equal) or either dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `--variant minimal` and capture the response.
3. Dispatch with `--variant max` and capture the response.
4. Compute byte counts and count trade-off dimensions for each.
5. Compare and return a verdict naming both metrics.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-012 | Variant levels (minimal/low/medium/high/max) | Confirm `--variant minimal` and `--variant max` produce materially different response depth for the same prompt | `As an external-AI conductor verifying the variant flag truly drives reasoning depth, dispatch the same multi-dimensional architecture trade-off prompt twice with --variant minimal and --variant max. Verify both runs exit 0, the max-variant response is at least 2x longer than the minimal response, and the max response weighs at least 2 more dimensions than the minimal response. Return a concise pass/fail verdict naming both response byte counts and dimension counts.` | 1. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant minimal --format json --dir "$(pwd)" "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-minimal.jsonl 2>&1 && echo "MINIMAL: $?"` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant max --format json --dir "$(pwd)" "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-max.jsonl 2>&1 && echo "MAX: $?"` -> 3. `bash: MIN=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-minimal.jsonl \| wc -c); MAX=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-max.jsonl \| wc -c); echo "MIN_BYTES=$MIN MAX_BYTES=$MAX RATIO=$(echo "scale=2; $MAX/$MIN" \| bc)"` -> 4. `bash: MIN_DIMS=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-minimal.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); MAX_DIMS=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-max.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); echo "MIN_DIMS=$MIN_DIMS MAX_DIMS=$MAX_DIMS"` | Step 1: MINIMAL exit 0; Step 2: MAX exit 0; Step 3: MAX_BYTES is at least 2x MIN_BYTES (RATIO >= 2.0); Step 4: MAX_DIMS is at least MIN_DIMS + 2 (or both at the cap of 5, whichever indicates the depth lever moved) | `/tmp/co-012-minimal.jsonl`, `/tmp/co-012-max.jsonl`, terminal byte and dimension counts | PASS if both exit 0 AND MAX_BYTES >= 2x MIN_BYTES AND MAX response covers more dimensions; FAIL if variant has no effect or either dispatch fails | 1. If RATIO is close to 1.0, the variant flag may be silently ignored — re-run with `--print-logs --log-level DEBUG` and look for a variant resolution log line; 2. If the model id resolution differs between runs, the variant may be coercing model selection — verify both runs use the same model id; 3. If the Anthropic provider rejects `max` (unsupported by current model), fall back to `--variant high` for the upper bound and document the constraint; 4. Confirm version v1.3.17 — older versions may use a different flag name (`--reasoning`) per `references/cli_reference.md` §9 |

### Optional Supplemental Checks

For full-spectrum validation, run all five variant levels (minimal, low, medium, high, max) and confirm the byte counts increase monotonically. This catches regressions where two adjacent variants produce identical responses (effectively halving the operator's tuning surface).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 MODEL SELECTION + variant table) | Documents the variant range per provider |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 default invocation `--variant high` and user override table |
| `../../references/cli_reference.md` | §5 variant flag mapping per provider, §9 version drift handling for `--variant` rename history |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--multi-provider/004-variant-levels-comparison.md`
