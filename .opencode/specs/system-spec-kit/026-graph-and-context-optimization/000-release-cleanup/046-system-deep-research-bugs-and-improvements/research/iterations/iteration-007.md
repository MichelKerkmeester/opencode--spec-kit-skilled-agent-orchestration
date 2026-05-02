# Iteration 007 — B2: CLI orchestrator skill correctness

## Focus

Audited the five CLI orchestrator skills for dispatch-prompt template correctness, mode and flag drift, self-invocation guards, sandbox/approval wiring, and model defaults. The strongest signal is not missing guard coverage; it is drift between each skill's canonical SKILL.md rules and its copied reference/template examples.

## Actions Taken

- Enumerated relevant files with `rg --files` under `.opencode/skill/cli-codex/`, `cli-copilot/`, `cli-gemini/`, `cli-claude-code/`, and `cli-opencode/`.
- Read each SKILL.md with line numbers, including each `detect_self_invocation()` guard: Codex at `.opencode/skill/cli-codex/SKILL.md:58`, Copilot at `.opencode/skill/cli-copilot/SKILL.md:59`, Gemini at `.opencode/skill/cli-gemini/SKILL.md:58`, Claude Code at `.opencode/skill/cli-claude-code/SKILL.md:61`, and OpenCode at `.opencode/skill/cli-opencode/SKILL.md:65`.
- Checked OpenCode's `has_parallel_session_keywords(prompt)` exception surface at `.opencode/skill/cli-opencode/SKILL.md:89` against its agent routing examples.
- Read targeted prompt template and CLI reference slices for Codex, Copilot, Gemini, Claude Code, and OpenCode.
- Verified each potential issue against nearby context before recording it.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-007-B2-01 | P1 | `.opencode/skill/cli-opencode/SKILL.md:292-294` | `cli-opencode` says subagents are "NOT directly invokable via `opencode run --agent`" and must be routed through `--agent orchestrate`, but the same SKILL later gives direct `--agent deep-research` and `--agent review` invocations at `.opencode/skill/cli-opencode/SKILL.md:331-347`. This is a real dispatch contract conflict: either these slugs are direct agents or the examples will train callers to bypass the orchestrator/parent-command boundary. | Pick one contract. If `review`/`deep-research` are subagents, change direct examples to `--agent orchestrate` plus prompt routing. If they are direct run agents, delete the "NOT directly invokable" language and align the roster. |
| F-007-B2-02 | P1 | `.opencode/skill/cli-opencode/references/agent_delegation.md:202-205` | The OpenCode reference repeats that `deep-research` and `deep-review` are dispatched only by parent commands, then its routing matrix directly invokes them with `opencode run --agent deep-research` and `--agent deep-review` at `.opencode/skill/cli-opencode/references/agent_delegation.md:224-225`. The prompt template does the same at `.opencode/skill/cli-opencode/assets/prompt_templates.md:221-230`. | Make the reference and templates match the command-owned deep-loop rule: parent command owns loop state; cli-opencode may only run a single approved leaf iteration when the prompt and state files are explicit, or route through `orchestrate` if that is the supported path. |
| F-007-B2-03 | P1 | `.opencode/skill/cli-copilot/SKILL.md:280` | Copilot SKILL.md says non-interactive reasoning effort is set with `--effort` / `--reasoning-effort`, but its own CLI reference says "No CLI flag exists" and config is the only non-interactive mechanism at `.opencode/skill/cli-copilot/references/cli_reference.md:137-142`. The default story also drifts: SKILL.md claims reasoning effort `xhigh` at `.opencode/skill/cli-copilot/SKILL.md:202`, while the per-model table says `gpt-5.4` defaults to `high` at `.opencode/skill/cli-copilot/SKILL.md:269-272`. | Decide the supported Copilot version contract. If the flag now exists, update `references/cli_reference.md`; if not, remove `--effort`/`--reasoning-effort` from SKILL.md and make the default invocation include a config pre-step only when the user asked for non-default effort. |
| F-007-B2-04 | P2 | `.opencode/skill/cli-codex/assets/prompt_templates.md:52-55` | Codex SKILL.md requires every delegation to pin model, reasoning effort, and fast service tier at `.opencode/skill/cli-codex/SKILL.md:350`, but the prompt templates usually pin only `--model gpt-5.5` and sandbox. The same template also describes `--full-auto` as auto-approving all actions and requiring approval at `.opencode/skill/cli-codex/assets/prompt_templates.md:37`, while SKILL.md defines it as workspace-write plus on-request approval and says it does not require pre-approval at `.opencode/skill/cli-codex/SKILL.md:247` and `.opencode/skill/cli-codex/SKILL.md:359`. | Update Codex templates to include `-c model_reasoning_effort="medium" -c service_tier="fast"` unless intentionally omitted, and fix the `--full-auto` description so approval semantics match SKILL.md. |
| F-007-B2-05 | P2 | `.opencode/skill/cli-claude-code/assets/prompt_templates.md:52-55` | Claude Code SKILL.md says callers must specify `--model` explicitly and defaults to `claude-sonnet-4-6` at `.opencode/skill/cli-claude-code/SKILL.md:344`, but common code-generation templates omit `--model` at `.opencode/skill/cli-claude-code/assets/prompt_templates.md:52-55` and `.opencode/skill/cli-claude-code/assets/prompt_templates.md:70-72`. That weakens reproducibility and drifts from the default invocation at `.opencode/skill/cli-claude-code/SKILL.md:209-215`. | Add `--model claude-sonnet-4-6` to default Claude Code prompt templates, and keep Opus/Haiku overrides explicit only where the task calls for them. |
| F-007-B2-06 | P2 | `.opencode/skill/cli-gemini/assets/prompt_templates.md:45-47` | Gemini SKILL.md correctly warns that `--yolo` auto-approves writes/tool calls and requires explicit user approval at `.opencode/skill/cli-gemini/SKILL.md:232` and `.opencode/skill/cli-gemini/SKILL.md:312`, but multiple write templates embed `--yolo` directly, including code generation at `.opencode/skill/cli-gemini/assets/prompt_templates.md:45-47` and bug fixing at `.opencode/skill/cli-gemini/assets/prompt_templates.md:131-143`. The examples do not carry an approval precondition, so copy-paste use can bypass the skill's approval contract. | Add an approval preamble to every `--yolo` template or split safe/read-only templates from explicitly approved write templates. |

## Questions Answered

- Self-invocation guards exist across all five SKILL.md files through `detect_self_invocation()` pseudocode; OpenCode additionally has `has_parallel_session_keywords(prompt)` for its parallel detached exception.
- The biggest cross-skill drift is not guard absence, but copied examples drifting from canonical dispatch contracts.
- Codex, Copilot, Claude Code, and Gemini all have at least one model/effort/sandbox template that fails to mirror the SKILL.md default or approval rule.
- OpenCode has the most serious correctness problem because its direct-agent versus subagent contract contradicts itself in SKILL.md, references, and templates.

## Questions Remaining

- Confirm the live Copilot CLI version: does it now accept `--effort` / `--reasoning-effort`, or is the reference still authoritative?
- Confirm OpenCode's actual `opencode agent list` behavior for `review`, `deep-research`, and `deep-review`; the docs disagree on whether those slugs are direct run agents.
- Check whether Codex CLI's current `--full-auto` semantics changed since the SKILL.md prose was written.

## Next Focus

Follow-on iteration should inspect executable dispatch scripts or test fixtures, if any, that consume these templates. The docs drift is clear; the remaining risk is whether runtime helpers enforce the correct contract despite bad examples.
