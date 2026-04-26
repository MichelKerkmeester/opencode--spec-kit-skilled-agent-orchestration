---
title: "CX-022 -- CLEAR scoring via prompt_quality_card.md"
description: "This scenario validates the CLEAR 5-check from prompt_quality_card.md for `CX-022`. It focuses on confirming an under-scored prompt is escalated to a structured framework before dispatch."
---

# CX-022 -- CLEAR scoring via prompt_quality_card.md

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-022`.

---

## 1. OVERVIEW

This scenario validates the CLEAR 5-check workflow from `prompt_quality_card.md` for `CX-022`. It focuses on confirming the documented quality-card discipline is applied before dispatch and that an under-scored prompt is upgraded to a structured framework (RCAF, COSTAR, etc.) before being sent to Codex.

### Why This Matters

`assets/prompt_quality_card.md` §4 (CLEAR 5-Check) and §3 (Task to Framework Map) are the explicit quality gate before any non-trivial dispatch. SKILL.md §4 ALWAYS rule 10 makes loading the card mandatory. This scenario keeps the discipline auditable by requiring operators to record CLEAR scores BEFORE dispatch and produce evidence the upgrade actually mattered.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-022` and confirm the expected signals without contradictory evidence.

- Objective: Verify the prompt_quality_card.md CLEAR 5-check is applied and an under-scored prompt is upgraded via the RCAF (or other) framework before dispatch.
- Real user request: `Walk me through the CLEAR check on a weak prompt, upgrade it via RCAF, and show me the result is better.`
- Prompt: `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator constructing a non-trivial dispatch, FIRST take a deliberately weak prompt ("Fix auth"), score it with the prompt_quality_card.md CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), THEN escalate it to a structured prompt by applying the RCAF framework from §3 of the card. Dispatch the improved prompt against /tmp/cli-codex-playbook-cx022/auth.ts with --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast". Verify the operator records the CLEAR scores for both versions, names the framework selected, and Codex produces a meaningfully better implementation from the improved prompt than the weak prompt would have. Return a verdict including both CLEAR score sets and the framework selected.`
- Expected execution process: Operator scores the weak prompt "Fix auth" against the 5 CLEAR axes (low on Expression, Arrangement and Reusability) -> applies RCAF (Role + Context + Action + Format) to produce a structured upgraded prompt -> records both score sets in evidence -> pre-creates a deliberately weak `auth.ts` -> dispatches the upgraded prompt -> verifies the result.
- Expected signals: Operator records CLEAR scores for the weak prompt (low on Expression and Arrangement). Operator names the chosen framework from `prompt_quality_card.md` §2 (e.g., RCAF). Improved prompt scores higher. Dispatched command line uses the improved prompt and exits 0.
- Desired user-visible outcome: An auditable trail showing the prompt-quality discipline was applied before the dispatch and a working file demonstrating the upgrade actually mattered.
- Pass/fail: PASS if both CLEAR score sets are recorded, the improved prompt scores higher than the weak prompt, the framework is named, AND the dispatch exits 0 with a generated file. FAIL if scores are missing, framework is not named or dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `assets/prompt_quality_card.md` §4 (CLEAR check) and §3 (Task to Framework Map).
2. Score the weak prompt "Fix auth" on Correctness, Logic, Expression, Arrangement, Reusability.
3. Pick a framework from §2 (RCAF for general implementation) and rewrite the prompt.
4. Re-score the improved prompt and confirm it scores higher.
5. Dispatch the improved prompt against a deliberately weak `auth.ts` seed file and inspect the result.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-022 | CLEAR scoring via prompt_quality_card.md | Verify the CLEAR 5-check is applied and an under-scored prompt is upgraded before dispatch | `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator constructing a non-trivial dispatch, FIRST take a deliberately weak prompt ("Fix auth"), score it with the prompt_quality_card.md CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), THEN escalate it to a structured prompt by applying the RCAF framework from §3 of the card. Dispatch the improved prompt against /tmp/cli-codex-playbook-cx022/auth.ts with --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast". Verify the operator records the CLEAR scores for both versions, names the framework selected, and Codex produces a meaningfully better implementation from the improved prompt than the weak prompt would have. Return a verdict including both CLEAR score sets and the framework selected.` | 1. `bash: grep -A 5 "CLEAR 5-Check" .opencode/skill/cli-codex/assets/prompt_quality_card.md > /tmp/cli-codex-cx022-check.txt` -> 2. `bash: printf 'WEAK PROMPT: "Fix auth"\nCLEAR scores (1-5):\n- Correctness: 2 (no specific bug named)\n- Logic: 1 (no reasoning given)\n- Expression: 1 (vague verb, no anchors)\n- Arrangement: 1 (no order)\n- Reusability: 2 (placeholder-free but trivial)\n\nIMPROVED PROMPT (RCAF framework, prompt_quality_card.md §3):\nRole: TypeScript backend engineer.\nContext: @/tmp/cli-codex-playbook-cx022/auth.ts has a token-validation function that accepts an empty string as valid.\nAction: Add explicit null/empty checks at the start of validate(), throw AuthError for empty/null input and add 2 minimal jest-style test stubs.\nFormat: Output the modified file path on success and a one-line summary of the change.\n\nCLEAR scores (1-5):\n- Correctness: 5 (specific bug named)\n- Logic: 4 (action and verification spelled out)\n- Expression: 5 (clear verbs, file anchor, framework labels)\n- Arrangement: 5 (Role -> Context -> Action -> Format)\n- Reusability: 4 (placeholders in Context and Action are swappable)\nFRAMEWORK SELECTED: RCAF (Role + Context + Action + Format) from prompt_quality_card.md §2.\n' > /tmp/cli-codex-cx022-scores.txt` -> 3. `bash: rm -rf /tmp/cli-codex-playbook-cx022 && mkdir -p /tmp/cli-codex-playbook-cx022 && printf 'export function validate(token: string): boolean {\n  return true; // accepts empty string as valid - bug\n}\n' > /tmp/cli-codex-playbook-cx022/auth.ts` -> 4. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Role: TypeScript backend engineer. Context: @/tmp/cli-codex-playbook-cx022/auth.ts has a token-validation function that accepts an empty string as valid. Action: Add explicit null/empty checks at the start of validate(), throw AuthError for empty/null input and add 2 minimal jest-style test stubs. Format: Output the modified file path on success and a one-line summary of the change." > /tmp/cli-codex-cx022-stdout.txt 2>&1` -> 5. `bash: cat /tmp/cli-codex-playbook-cx022/auth.ts && grep -E "AuthError\|throw\|null\|empty\|''\|\"\"" /tmp/cli-codex-playbook-cx022/auth.ts` | Step 1: CLEAR check captured; Step 2: scores file shows weak prompt low scores AND improved prompt high scores AND framework named; Step 3: temp dir + seed auth.ts created; Step 4: exit 0; Step 5: auth.ts now has explicit empty/null check, throw, AuthError | Quality-card grep, scores file with both CLEAR score sets, seed file, generated stdout, modified auth.ts, dispatched command line, exit code | PASS if both CLEAR score sets recorded, improved prompt scores higher, framework named, dispatch exits 0, AND the modified file has explicit empty/null validation; FAIL if any check misses or the file doesn't reflect the upgrade | (1) Re-read `assets/prompt_quality_card.md` §4 to confirm the CLEAR axes; (2) re-run with `2>&1 \| tee` for stderr inline; (3) inspect modified auth.ts manually for the validation logic |

### Optional Supplemental Checks

- For complexity >= 7/10 prompts, escalate to `@improve-prompt` per `assets/prompt_quality_card.md` §5 Escalation. Capture the returned `ENHANCED_PROMPT` as additional evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_quality_card.md` (§2 Framework Selection, §3 Task to Framework Map, §4 CLEAR 5-Check, §5 Escalation) | Authoritative quality card |
| `../../SKILL.md` (§4 ALWAYS rule 10) | Mandates loading the quality card |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_quality_card.md` | §4 CLEAR 5-Check |
| `../../assets/prompt_templates.md` | §1 OVERVIEW Flag Reference + §11 Template Variables |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CX-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/002-clear-scoring-quality-card.md`
