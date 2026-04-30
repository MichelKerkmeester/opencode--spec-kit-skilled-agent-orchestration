---
title: Prompt Quality Card
description: Fast-path framework selection and CLEAR checks for Gemini CLI prompt construction.
---

<!-- sync: 9d3a5fd2 -->

# Prompt Quality Card

Fast-path prompt-quality guidance for Gemini CLI dispatches. Use this asset before building a routine CLI prompt so the router stays lightweight while still applying framework selection and a quick CLEAR pass.

## 1. OVERVIEW

### Purpose

Provide a small, always-load asset for Gemini CLI prompt construction that improves quality without pulling in the full prompt-engineering skill on routine dispatches.

### Usage

Select a framework from the task map, run the CLEAR 5-check, and escalate to `@improve-prompt` when the task crosses the fast-path risk threshold.

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

## 3. Task to Framework Map

| Task | Framework |
|------|-----------|
| Generation | `RCAF` |
| Review | `TIDD-EC` |
| Research | `CRISPE` |
| Edit | `RCAF + TIDD-EC` |
| Analyze / plan | `CRAFT` |

---

## 4. CLEAR 5-Check

- Correctness: Does the prompt describe the real task and files without contradiction?
- Logic: Does it explain how Gemini should reason or decide?
- Expression: Is the wording specific enough to avoid guesswork?
- Arrangement: Is the order task -> context -> constraints -> output -> verification?
- Reusability: Could this prompt be reused by swapping placeholders?

---

## 5. Escalate to `@improve-prompt`

Use Task-based escalation when complexity is `>= 7/10`, compliance or security sensitivity appears, more than one stakeholder matters, or more than one requirement is unclear.

Gemini-specific example: if the task needs a long grounded prompt plus `-m gemini-3.1-pro-preview`, get the structured `ENHANCED_PROMPT` from `@improve-prompt` first and then hand that to Gemini CLI.

---

## 6. Failure Patterns

- Missing output format or success criteria
- Unbounded scope
- Vague verbs
- No repo or file anchors
- No "do not change" guardrails

---

## 7. Related Resources

- `../../sk-improve-prompt/assets/cli_prompt_quality_card.md`
- `./prompt_templates.md`
- `../SKILL.md`

