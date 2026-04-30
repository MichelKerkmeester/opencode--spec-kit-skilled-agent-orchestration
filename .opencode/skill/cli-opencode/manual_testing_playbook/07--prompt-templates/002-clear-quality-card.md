---
title: "CO-024 -- CLEAR quality card 5-check"
description: "This scenario validates the prompt quality card for `CO-024`. It focuses on confirming `assets/prompt_quality_card.md` documents the CLEAR 5-check, the 7-framework selection table, and the escalation rule to @improve-prompt at complexity >= 7/10."
---

# CO-024 -- CLEAR quality card 5-check

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-024`.

---

## 1. OVERVIEW

This scenario validates the CLEAR quality card 5-check for `CO-024`. It focuses on confirming `assets/prompt_quality_card.md` documents the full CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), the 7-framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) with complexity bands, the task-to-framework map and the escalation rule to `@improve-prompt` when complexity is `>= 7/10`.

### Why This Matters

ALWAYS rule 7 in SKILL.md mandates loading `assets/prompt_quality_card.md` before building any dispatch prompt. The card is the lightweight always-on guidance that keeps cross-AI orchestrator prompts consistent without pulling in the full sk-improve-prompt skill. If the card is missing the CLEAR 5-check, the framework table, the task map or the escalation rule, the orchestrator's prompt-quality safety net collapses and prompts regress to ad-hoc construction. This test validates all four required elements are present.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `assets/prompt_quality_card.md` documents the CLEAR 5-check, the 7-framework selection table, the task-to-framework map and the escalation rule for complexity `>= 7/10`.
- Real user request: `Open the cli-opencode prompt quality card and confirm it has the CLEAR 5-check, the framework selection table with all 7 frameworks, the task-to-framework map, and the escalation rule for complexity >= 7. I want to know what the orchestrator should do before constructing a prompt.`
- RCAF Prompt: `As an external-AI conductor about to construct a non-trivial OpenCode dispatch prompt, load the prompt quality card and verify it explicitly documents (a) the CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), (b) the framework selection table with all 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and complexity bands, (c) the task-to-framework map, and (d) the escalation rule for complexity >= 7/10 to @improve-prompt. Return a concise pass/fail verdict naming each missing element (or confirming all four are present).`
- Expected execution process: External-AI orchestrator reads `assets/prompt_quality_card.md`, scans for the CLEAR 5-check enumeration, the 7-framework table, the task map and the escalation rule, then attests each is present.
- Expected signals: All 5 CLEAR criteria explicitly listed. Framework selection table includes all 7 frameworks with complexity bands. Task-to-framework map present (task -> framework rows). Escalation rule for complexity `>= 7/10` to `@improve-prompt` is explicitly documented. Failure-pattern checklist present.
- Desired user-visible outcome: Verdict naming each found element and confirming the escalation threshold is exactly 7.
- Pass/fail: PASS if all 5 CLEAR criteria present AND all 7 frameworks listed AND task map present AND escalation rule with threshold 7 present. FAIL if any element missing or threshold differs from 7.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Grep for each CLEAR criterion explicitly.
3. Grep for each of the 7 frameworks in the selection table.
4. Grep for the task-to-framework map.
5. Grep for the escalation rule with threshold `>= 7`.
6. Return a verdict naming each item found.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-024 | CLEAR quality card 5-check | Confirm `assets/prompt_quality_card.md` documents CLEAR 5-check, 7-framework table, task map, and escalation rule | `As an external-AI conductor about to construct a non-trivial OpenCode dispatch prompt, load the prompt quality card and verify it explicitly documents (a) the CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), (b) the framework selection table with all 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and complexity bands, (c) the task-to-framework map, and (d) the escalation rule for complexity >= 7/10 to @improve-prompt. Return a concise pass/fail verdict naming each missing element (or confirming all four are present).` | 1. `bash: grep -ciE '(Correctness\|Logic\|Expression\|Arrangement\|Reusability)' .opencode/skill/cli-opencode/assets/prompt_quality_card.md` -> 2. `bash: grep -E '\bRCAF\b\|\bCOSTAR\b\|\bRACE\b\|\bCIDI\b\|\bTIDD-EC\b\|\bCRISPE\b\|\bCRAFT\b' .opencode/skill/cli-opencode/assets/prompt_quality_card.md \| sort -u \| wc -l` -> 3. `bash: grep -inE '(complexity band\|framework selection)' .opencode/skill/cli-opencode/assets/prompt_quality_card.md` -> 4. `bash: grep -inE '(task to framework\|task.*framework map)' .opencode/skill/cli-opencode/assets/prompt_quality_card.md` -> 5. `bash: grep -inE '(>=\s*7\|complexity.*7\|7/10)' .opencode/skill/cli-opencode/assets/prompt_quality_card.md` -> 6. `bash: grep -inE '@improve-prompt' .opencode/skill/cli-opencode/assets/prompt_quality_card.md` -> 7. `bash: grep -inE '(failure pattern\|Failure Pattern)' .opencode/skill/cli-opencode/assets/prompt_quality_card.md` | Step 1: count of CLEAR criteria mentions >= 5; Step 2: count of distinct framework matches >= 7; Step 3: at least one match showing complexity band table; Step 4: at least one match showing task-to-framework map; Step 5: at least one match showing complexity >= 7 escalation; Step 6: @improve-prompt referenced at least once; Step 7: failure-pattern section present | Terminal grep output for each check with line numbers | PASS if all 5 CLEAR criteria present AND all 7 frameworks listed AND task map present AND escalation rule with threshold 7 present AND @improve-prompt referenced; FAIL if any element missing or threshold differs | 1. If a CLEAR criterion is missing, the card may have been edited — file a documentation bug; 2. If a framework is missing, cross-check sk-improve-prompt skill to confirm the canonical framework list; 3. If the escalation threshold differs from 7, decide whether to update the playbook or the card to align; 4. If @improve-prompt is missing, the escalation path is broken — file a P0 documentation bug |

### Optional Supplemental Checks

For end-to-end validation, draft a non-trivial OpenCode dispatch prompt (e.g., a multi-agent orchestration plan), manually score it against the CLEAR 5-check and confirm the failure-pattern checklist would have caught any obvious deficiencies. This is a cognitive exercise and does not need to dispatch `opencode run` itself.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_quality_card.md` | The quality card under inspection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 7 (always load prompt_quality_card.md before any dispatch) |
| `../../assets/prompt_quality_card.md` | §2 framework table, §3 task map, §4 CLEAR 5-check, §5 escalation rule, §6 failure patterns |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/002-clear-quality-card.md`
