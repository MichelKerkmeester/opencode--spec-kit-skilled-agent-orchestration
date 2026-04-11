<!-- sync: c2bf4c48 -->

# Prompt Quality Card

Source of truth: `sk-improve-prompt/assets/cli_prompt_quality_card.md`

## Framework Selection Table

| Framework | Best for | Complexity band | Core components |
|-----------|----------|-----------------|-----------------|
| `RCAF` | General implementation, edit, and documentation prompts | 1-6 | Role, Context, Action, Format |
| `COSTAR` | Audience-aware communication and content generation | 3-6 | Context, Objective, Style, Tone, Audience, Response |
| `RACE` | Fast single-output tasks where speed matters most | 1-3 | Role, Action, Context, Execute |
| `CIDI` | Process instructions, tutorials, and SOP-style prompts | 4-6 | Context, Instructions, Details, Input |
| `TIDD-EC` | Compliance, review, and quality-critical prompts | 6-8 | Task, Instructions, Do's, Don'ts, Examples, Context |
| `CRISPE` | Research, strategic exploration, and option generation | 5-7 | Capacity, Insight, Statement, Personality, Experiment |
| `CRAFT` | Complex multi-stakeholder planning and analysis | 7-10 | Context, Role, Action, Format, Target |

## Task -> Framework Map

| Task | Framework |
|------|-----------|
| Generation | `RCAF` |
| Review | `TIDD-EC` |
| Research | `CRISPE` |
| Edit | `RCAF + TIDD-EC` |
| Analyze / plan | `CRAFT` |

## CLEAR 5-Check

- Correctness: Does the prompt describe the real task and files without contradiction?
- Logic: Does it explain how Codex should reason or decide?
- Expression: Is the wording specific enough to avoid guesswork?
- Arrangement: Is the order task -> context -> constraints -> output -> verification?
- Reusability: Could this prompt be reused by swapping placeholders?

## Escalate to `@improve-prompt`

Use Task-based escalation when complexity is `>= 7/10`, compliance/security sensitivity appears, more than one stakeholder matters, or more than one requirement is unclear.

Codex-specific example: if the task needs a crowded `codex exec` prompt plus explicit `service_tier="fast"` or sandbox guidance, get the structured `ENHANCED_PROMPT` from `@improve-prompt` first and then hand that to Codex CLI.

## Failure Patterns

- Missing output format or success criteria
- Unbounded scope
- Vague verbs
- No repo/file anchors
- No "do not change" guardrails

Regenerate mirrors on upstream edit.
