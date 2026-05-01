# Deep-Research Iteration 3 - Stream 03 Internal Agent Inventory

## STATE

Iteration 3 of 8. Iterations 1-2 answered Q3 (caller-restriction = convention-only) and Q4 (write-safety bounded by workflow/prose, not allowed_paths frontmatter or runtime allowlist).

Iteration: 3 of 8
Focus Area: Q5 sub-agent dispatch contracts and depth/nesting rules - what does LEAF mean concretely, what enforces `task: deny` at runtime.

Remaining Key Questions:
- Q1 (open): Skill auto-loading patterns
- Q2 (open): Stack-agnostic detection in sk-code
- Q5 (open): Sub-agent dispatch contracts and depth/nesting rules - THIS ITERATION

Last 3 Iterations Summary:
- Iter 1 (Q3 answered): No machine-readable caller-restriction frontmatter. Convention-only via prose+workflow ownership+permissions+NDP-prompt instructions. ratio=0.86.
- Iter 2 (Q4 answered): Write-capable agents bounded by workflow/prose/script checks, not by universal allowed_paths frontmatter or runtime write allowlist. Each write-capable agent (write, debug, deep-research, deep-review, improve-agent) declares its own scope rules in body + command workflows. ratio=0.72.

## STATE FILES

All paths are relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-config.json
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-state.jsonl
- Strategy: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-strategy.md
- Registry: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/findings-registry.json
- Write iteration narrative to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/iterations/iteration-003.md
- Write per-iteration delta file to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deltas/iter-003.jsonl

## CONSTRAINTS

- LEAF agent. NO sub-agent dispatch. Max 12 tool calls.
- Read iter 1 + iter 2 narratives first to avoid duplicate inventory.

## TASK FOR THIS ITERATION

Focus Q5 — Sub-agent dispatch contracts and depth/nesting rules:

1. Find every `permission.task` declaration in `.opencode/agent/*.md`. Map each: which agents have `task: allow` vs `task: deny`. Especially:
   - `.opencode/agent/orchestrate.md` — must be `task: allow`
   - `.opencode/agent/context.md` — LEAF, expect `task: deny`
   - `.opencode/agent/deep-research.md`, `deep-review.md` — LEAF, expect `task: deny`
   - `.opencode/agent/improve-agent.md`, `improve-prompt.md`, `write.md`, `debug.md`, `review.md`, `ultra-think.md` — verify each
2. Search runtime code for where `permission.task` is interpreted: `.opencode/skill/system-spec-kit/`, `.opencode/plugin/`, OpenCode binary. Probable place: how the harness loads agent frontmatter and gates Task tool calls. Use grep for `permission`, `task`, `denyTask`, `task: deny`, `agent.permission`. Also check `.opencode/skill/sk-code/`, `.opencode/skill/sk-deep-research/scripts/` for any per-agent permission validators.
3. Identify all "leaf" markers: comments saying "LEAF agent", "LEAF constraint", "do not dispatch sub-agents", "Task tool", `leaf_only`, `agentConfig.leafOnly`. List file:line for each.
4. Inspect `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` for `agent_config.leaf_only: true` (the prompt mentions this). Find the corresponding loader/dispatcher that reads `agent_config`.
5. Inspect `.opencode/agent/orchestrate.md` body for the dispatch contract: how does it list sub-agents, are there explicit depth limits, retry policies?
6. Are there any tests verifying LEAF enforcement? grep for `leaf` under `.opencode/skill/*/tests/`, `vitest`, etc.

Goal: produce a clear answer to "what enforces LEAF at runtime?" — is it (a) `permission.task: deny` interpreted by the OpenCode binary itself, (b) advisor/workflow steps refusing to dispatch, or (c) prose convention in agent body? Cite file:line.

## OUTPUT CONTRACT

Same format as iter 1/2. JSONL state-log append uses exact `"type":"iteration"` form. Three artifacts: iterations/iteration-003.md, state-log append, deltas/iter-003.jsonl.

newInfoRatio expectation: 0.55-0.75.

Begin now.
