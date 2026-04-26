---
title: "CC-008 -- Opus extended thinking"
description: "This scenario validates Opus extended thinking for `CC-008`. It focuses on confirming `--model claude-opus-4-6 --effort high` produces deeper multi-dimensional analysis than the Sonnet default."
---

# CC-008 -- Opus extended thinking

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-008`.

---

## 1. OVERVIEW

This scenario validates Opus extended thinking for `CC-008`. It focuses on confirming `--model claude-opus-4-6 --effort high` produces deeper multi-dimensional analysis than the Sonnet default.

### Why This Matters

Opus + `--effort high` is the cli-claude-code skill's most expensive dispatch tier and only justified when the depth payoff is real. If Opus + `--effort high` produces output indistinguishable from Sonnet for a multi-dimensional architecture trade-off, the skill's deep-reasoning routing pattern (CC-014, deep-reasoning-delegation in integration_patterns.md) is broken and the cost premium is wasted.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model claude-opus-4-6 --effort high` produces deeper, more detailed chain-of-thought analysis than the Sonnet default for a multi-dimensional architecture trade-off prompt.
- Real user request: `Use Claude Code in deep-reasoning mode to weigh event sourcing vs CRUD for our order management system - I need a real recommendation with confidence level, not a hand-wave.`
- Prompt: `As an external-AI conductor facing a complex architecture trade-off (event sourcing vs CRUD for an order management system), dispatch claude -p with --model claude-opus-4-6 --effort high --permission-mode plan and capture the response. Verify the response weighs at least 4 dimensions (consistency, query performance, learning curve, scalability), produces a recommendation with confidence level, and is materially longer than a Sonnet baseline for the same prompt. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator runs Opus + high-effort dispatch in JSON mode, optionally captures a Sonnet baseline for comparison, parses the response for dimensional coverage and explicit recommendation, then summarizes both depth and cost.
- Expected signals: Response weighs at least 4 trade-off dimensions explicitly. Produces an explicit recommendation with confidence level (high/medium/low or numeric). Response token count is materially larger than a Sonnet-default baseline for the same prompt. Cost metadata (when JSON output is captured) reflects Opus pricing tier.
- Desired user-visible outcome: Verdict naming the recommendation, confidence level and dimensional count.
- Pass/fail: PASS if response weighs >=4 dimensions AND includes an explicit recommendation with confidence AND is materially longer than Sonnet baseline. FAIL if any condition fails or cost is implausibly low (suggests model fallback).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Apply `--max-budget-usd 1.00` cost cap (Opus + `--effort high` is expensive).
3. Optionally capture a Sonnet baseline for length comparison.
4. Parse Opus output for dimensional coverage and recommendation clarity.
5. Return a verdict naming the recommendation and dimensional count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-008 | Opus extended thinking | Confirm `--model claude-opus-4-6 --effort high` produces deeper multi-dimensional analysis than Sonnet default | `As an external-AI conductor facing a complex architecture trade-off (event sourcing vs CRUD for an order management system), dispatch claude -p with --model claude-opus-4-6 --effort high --permission-mode plan and capture the response. Verify the response weighs at least 4 dimensions (consistency, query performance, learning curve, scalability), produces a recommendation with confidence level, and is materially longer than a Sonnet baseline for the same prompt. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: claude -p "Compare event sourcing vs CRUD for an order management system. Weigh trade-offs across data consistency, query performance, team learning curve, operational complexity, and future scalability. Recommend one with confidence level (high/medium/low) and reasoning." --model claude-opus-4-6 --effort high --permission-mode plan --max-budget-usd 1.00 --output-format json 2>&1 > /tmp/cc-008-opus.json` -> 2. `bash: claude -p "Compare event sourcing vs CRUD for an order management system. Weigh trade-offs across data consistency, query performance, team learning curve, operational complexity, and future scalability. Recommend one with confidence level (high/medium/low) and reasoning." --model claude-sonnet-4-6 --permission-mode plan --output-format json 2>&1 > /tmp/cc-008-sonnet.json` -> 3. `bash: jq -r '.result' /tmp/cc-008-opus.json \| wc -w > /tmp/cc-008-opus-words.txt` -> 4. `bash: jq -r '.result' /tmp/cc-008-sonnet.json \| wc -w > /tmp/cc-008-sonnet-words.txt` -> 5. `bash: jq -r '.result' /tmp/cc-008-opus.json \| grep -iE '(consistency\|performance\|learning\|complexity\|scalability)' \| wc -l > /tmp/cc-008-dim-count.txt` -> 6. `bash: jq -r '.result' /tmp/cc-008-opus.json \| grep -iE 'confidence' \| head -3` | Step 1: Opus JSON written; Step 2: Sonnet JSON written; Step 3: Opus word count captured; Step 4: Sonnet word count captured; Step 5: dimensional keyword count >= 4; Step 6: at least one explicit confidence reference in Opus output | `/tmp/cc-008-opus.json`, `/tmp/cc-008-sonnet.json`, word counts, dimensional count file | PASS if Opus weighs >=4 dimensions AND has an explicit recommendation with confidence AND Opus word count > Sonnet word count; FAIL if any condition fails | 1. If Opus runs out of budget (`--max-budget-usd 1.00` exceeded), increase to 2.00 and retry; 2. If Opus output looks shallow, double-check the model id surfaced in JSON to confirm Opus actually ran (not a fallback); 3. If Sonnet baseline cannot be obtained, mark this scenario as PARTIAL (Opus depth verified, equivalence comparison incomplete) |

### Optional Supplemental Checks

If both Opus and Sonnet runs succeed but the cost difference is less than 5x, double-check the cost field in JSON output - some account tiers may have different pricing. Capture pricing notes in evidence so future runs can recalibrate the threshold.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Models table (section 6) and effort levels (section 5) |
| `../../references/claude_tools.md` | Extended Thinking section |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | Deep Reasoning Delegation pattern |
| `../../references/cli_reference.md` | Model selection guide showing when to use Opus + `--effort high` |

---

## 5. SOURCE METADATA

- Group: Reasoning And Models
- Playbook ID: CC-008
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--reasoning-and-models/001-opus-extended-thinking.md`
