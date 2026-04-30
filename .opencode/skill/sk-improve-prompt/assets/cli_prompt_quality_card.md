---
title: CLI Prompt Quality Card
description: Fast-path framework selection and CLEAR checks for CLI orchestrator prompt construction.
---

# CLI Prompt Quality Card

Lightweight prompt-quality guidance for CLI orchestrator skills. Use this card on the fast path so routine dispatches get framework selection, a quick CLEAR check, and explicit escalation triggers without loading the full `sk-improve-prompt` body.

## 1. OVERVIEW

### Purpose

Provide a compact, reusable asset for CLI prompt construction that improves prompt quality without paying the full `sk-improve-prompt` context cost on routine work.

### Usage

Load this card before building any CLI dispatch prompt. Select a framework from the task map, run the CLEAR pre-dispatch check, and escalate to `@improve-prompt` when the task crosses the fast-path risk threshold.

---

## 2. Framework Selection Table

| Framework | Best for | Complexity band | Core components |
|-----------|----------|-----------------|-----------------|
| `RCAF` | General implementation, edit, and documentation prompts | 1-6 | Role, Context, Action, Format |
| `COSTAR` | Audience-aware communication and content generation | 3-6 | Context, Objective, Style, Tone, Audience, Response |
| `RACE` | Fast single-output tasks where speed matters most | 1-3 | Role, Action, Context, Execute |
| `CIDI` | Process instructions, tutorials, and SOP-style prompts | 4-6 | Context, Instructions, Details, Input |
| `TIDD-EC` | Compliance, review, and quality-critical prompts | 6-8 | Task, Instructions, Do's, Don'ts, Examples, Context |
| `CRISPE` | Research, strategic exploration, and option generation | 5-7 | Capacity, Insight, Statement, Personality, Experiment |
| `CRAFT` | Complex multi-stakeholder planning and analysis | 7-10 | Context, Role, Action, Format, Target |

---

## 3. CLI Task to Framework Map

| CLI task type | Default framework | Notes |
|---------------|-------------------|-------|
| Generation | `RCAF` | Default for most code, docs, and implementation asks |
| Review | `TIDD-EC` | Use when correctness, policy, or security checks matter |
| Research | `CRISPE` | Prefer for comparison, investigation, and discovery |
| Edit | `RCAF + TIDD-EC` | Pair execution clarity with explicit guardrails |
| Analyze / plan | `CRAFT` | Prefer when dependencies, stakeholders, or phases matter |

---

## 4. CLEAR 5-Question Pre-Dispatch Checklist

Use one question per dimension before every CLI dispatch. If any answer is "no", tighten the prompt before running the CLI.

| Dimension | Floor | Pre-dispatch question |
|-----------|-------|-----------------------|
| Correctness | `>= 7/10` | Does the prompt accurately describe the task, constraints, and source files without contradictions? |
| Logic | `>= 7/10` | Does the prompt explain the reasoning path or decision criteria the delegated CLI should follow? |
| Expression | `>= 10/15` | Is the wording specific enough that a second AI will not have to guess what "good" looks like? |
| Arrangement | `>= 7/10` | Is the prompt structured in a clean order: task, context, constraints, output, verification? |
| Reusability | `>= 3/5` | Could this prompt be reused by swapping placeholders instead of rewriting it from scratch? |

---

## 5. Escalation Triggers

Dispatch `@improve-prompt` via the Task tool instead of loading `sk-improve-prompt` inline when any of the following are true:

- Complexity is `>= 7/10`
- Compliance, policy, privacy, or security sensitivity is present
- More than one stakeholder or audience must be satisfied
- More than one key requirement is still ambiguous
- The fast-path CLEAR check cannot be brought above the floor quickly

Expected structured return:

```text
FRAMEWORK: <name>
CLEAR_SCORE: <n>/50
RATIONALE: <short explanation>
ENHANCED_PROMPT: |
  <ready-to-dispatch prompt>
ESCALATION_NOTES: <open ambiguity or risk>
```

---

## 6. Common CLI Prompt Failure Patterns

- Missing output format or success criteria
- Unbounded scope that lets the delegated CLI wander
- Vague verbs such as "improve", "look at", or "handle" without specifics
- No file, artifact, or interface anchors when repo context matters
- No guardrails for security, compliance, or "do not change" boundaries
- No verification request when the delegated CLI should prove its work
- Overloaded prompts that mix research, implementation, and review with no order

---

## 7. Mirror Sync

Mirror paths:

- `../../cli-claude-code/assets/prompt_quality_card.md`
- `../../cli-codex/assets/prompt_quality_card.md`
- `../../cli-copilot/assets/prompt_quality_card.md`
- `../../cli-gemini/assets/prompt_quality_card.md`

When editing this file, also update the mirrors or run `.opencode/skill/scripts/check-prompt-quality-card-sync.sh`.

---

## 8. Related Resources

- `../SKILL.md`
- `../references/patterns_evaluation.md`
- `../references/depth_framework.md`
- `../../cli-claude-code/assets/prompt_quality_card.md`
- `../../cli-codex/assets/prompt_quality_card.md`
- `../../cli-copilot/assets/prompt_quality_card.md`
- `../../cli-gemini/assets/prompt_quality_card.md`

