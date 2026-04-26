---
title: "CC-020 -- CLEAR quality card 5-check"
description: "This scenario validates CLEAR quality card 5-check for `CC-020`. It focuses on confirming the prompt quality card defines the CLEAR 5-check, the framework selection table, and the escalation rule to `@improve-prompt`."
---

# CC-020 -- CLEAR quality card 5-check

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-020`.

---

## 1. OVERVIEW

This scenario validates CLEAR quality card 5-check for `CC-020`. It focuses on confirming the prompt quality card defines the CLEAR 5-check, the framework selection table and the escalation rule to `@improve-prompt`.

### Why This Matters

ALWAYS rule 10 in SKILL.md mandates loading `assets/prompt_quality_card.md` before building any dispatch prompt. The card is the lightweight always-on guidance that keeps cross-AI orchestrator prompts consistent without pulling in the full prompt-engineering skill. If the card is missing the CLEAR 5-check, the framework selection table or the escalation rule, the orchestrator's prompt-quality safety net collapses and prompts regress to ad-hoc construction.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the prompt quality card at `assets/prompt_quality_card.md` defines the CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), the framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and the escalation rule to `@improve-prompt` when complexity is `>= 7/10`.
- Real user request: `Open the cli-claude-code prompt quality card and confirm it has the CLEAR 5-check, the framework selection table, and the escalation rule - I want to know what the orchestrator should do before constructing a prompt.`
- Prompt: `As an external-AI conductor about to construct a non-trivial Claude Code prompt, load the prompt quality card and apply the CLEAR 5-check to a draft prompt for an architecture analysis task. Verify the card explicitly documents the 5-check, the framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) with complexity bands, and the escalation rule for complexity >= 7. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator reads `assets/prompt_quality_card.md`, scans for the CLEAR 5-check enumeration, the 7-framework selection table and the explicit escalation rule, then attests each is present.
- Expected signals: Card lists all 5 CLEAR criteria explicitly (Correctness, Logic, Expression, Arrangement, Reusability). Framework selection table includes all 7 frameworks with complexity bands. Escalation rule for complexity >= 7 to `@improve-prompt` is explicitly documented. Failure-pattern checklist is present.
- Desired user-visible outcome: Verdict naming each CLEAR criterion found, the framework count and the escalation threshold.
- Pass/fail: PASS if all 5 CLEAR criteria present AND all 7 frameworks listed AND escalation rule for >=7 complexity present. FAIL if any criterion is missing or escalation threshold differs from 7.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Read `assets/prompt_quality_card.md`.
3. Scan for each CLEAR criterion explicitly.
4. Scan for each of the 7 frameworks in the selection table.
5. Locate the escalation rule and verify the threshold is 7.
6. Return a verdict naming each item found.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-020 | CLEAR quality card 5-check | Confirm `assets/prompt_quality_card.md` documents the CLEAR 5-check, framework selection table, and escalation rule | `As an external-AI conductor about to construct a non-trivial Claude Code prompt, load the prompt quality card and apply the CLEAR 5-check to a draft prompt for an architecture analysis task. Verify the card explicitly documents the 5-check, the framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) with complexity bands, and the escalation rule for complexity >= 7. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: grep -ciE '(Correctness\|Logic\|Expression\|Arrangement\|Reusability)' .opencode/skill/cli-claude-code/assets/prompt_quality_card.md` -> 2. `bash: grep -E '\bRCAF\b\|\bCOSTAR\b\|\bRACE\b\|\bCIDI\b\|\bTIDD-EC\b\|\bCRISPE\b\|\bCRAFT\b' .opencode/skill/cli-claude-code/assets/prompt_quality_card.md \| sort -u \| wc -l` -> 3. `bash: grep -inE '(>=\s*7\|complexity.*7\|7/10\|@improve-prompt)' .opencode/skill/cli-claude-code/assets/prompt_quality_card.md` -> 4. `bash: grep -inE '(Failure Pattern\|failure pattern)' .opencode/skill/cli-claude-code/assets/prompt_quality_card.md` -> 5. `bash: grep -inE '(complexity band\|task to framework\|framework selection)' .opencode/skill/cli-claude-code/assets/prompt_quality_card.md` | Step 1: count of CLEAR criteria mentions >= 5; Step 2: count of distinct framework matches >= 7; Step 3: at least one match showing complexity >= 7 escalation to `@improve-prompt`; Step 4: failure-pattern section present; Step 5: framework selection table is present | Terminal grep output for steps 1-5 with line numbers | PASS if all 5 CLEAR criteria present AND all 7 frameworks listed AND escalation rule with threshold 7 present; FAIL if any criterion missing or threshold differs | 1. If a CLEAR criterion is missing, the card may have been edited - file a documentation bug; 2. If a framework is missing from the selection table, cross-check `sk-improve-prompt` skill to confirm the canonical framework list; 3. If the escalation threshold is something other than 7, decide whether to update the playbook to match the card or the card to match the documented threshold |

### Optional Supplemental Checks

For end-to-end validation, draft an architecture analysis prompt, manually score it against the CLEAR 5-check and confirm the failure-pattern checklist would have caught any obvious deficiencies. This is a cognitive exercise and does not need to dispatch `claude` itself.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../assets/prompt_quality_card.md` | The quality card under inspection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 10 mandating quality card load before any dispatch |
| `../../assets/prompt_quality_card.md` | Card sections: framework table, CLEAR 5-check, escalation rule, failure patterns |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CC-020
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--prompt-templates/002-clear-quality-card-5-check.md`
