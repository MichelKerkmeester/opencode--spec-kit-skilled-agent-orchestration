---
title: "OpenCode CLI - Agent Delegation"
description: "Agent routing matrix for opencode run dispatches. Documents the agent slugs available via .opencode/agent/, the cli pattern As @<agent> for prompt-time routing, and the orchestration principle: calling AI decides WHAT, agent shapes HOW."
---

# OpenCode CLI - Agent Delegation

How cli-opencode routes dispatches to specialized OpenCode agents via the `--agent <slug>` flag. The calling AI decides WHAT to delegate — the agent's frontmatter shapes HOW the dispatched session processes it.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

OpenCode agents are markdown files under `.opencode/agent/<slug>.md`. Each file's frontmatter pins the model, tool permissions, system prompt, and behavioral constraints. When `opencode run --agent <slug>` is invoked, the dispatched session inherits all of that.

The cli-opencode skill exposes the project's full agent roster. The calling AI selects the right slug based on the task type. The agent then shapes the dispatched session — different model, different tool permissions, different system prompt.

### Discovery commands

| Command | Purpose |
|---------|---------|
| `opencode agent list` | List all registered agent slugs |
| `opencode debug agent <slug>` | Print resolved frontmatter and system prompt |
| `opencode debug skill <slug>` | Print skill resolution if the agent loads one |

### Orchestration principle

The calling AI decides WHAT to delegate. The agent's frontmatter shapes HOW the dispatched session processes the task. The calling AI always validates and integrates the output.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:agent-roster -->
## 2. AGENT ROSTER

The repo ships these agents under `.opencode/agent/`. The cli-opencode skill can route to any of them.

| Slug | Role | When to dispatch |
|------|------|-------------------|
| `general` | Default subagent — implementation, complex tasks | Routine multi-step work that does not match a specialist |
| `context` | Read-only retrieval and codebase exploration | Search, pattern discovery, context loading. LEAF agent — no sub-dispatches, no writes |
| `orchestrate` | Multi-agent coordination | Complex workflows that span several agents |
| `write` | Documentation generation | Creating READMEs, skills, guides |
| `review` | Code review and PR analysis | Pre-merge reviews, quality gates. READ-ONLY |
| `debug` | Fresh-perspective debugging | Root cause analysis after 3+ failed debug attempts. Exclusive write access for `debug-delegation.md` |
| `deep-research` | Iterative research loop executor | Single research-cycle dispatches. State externalized to JSONL + strategy.md. Dispatched only by `/spec_kit:deep-research` command |
| `deep-review` | Iterative code review loop executor | Single review-cycle dispatches. P0/P1/P2 findings, severity-weighted convergence. Dispatched only by `/spec_kit:deep-review` command |
| `ultra-think` | Multi-strategy planning architect | Complex planning that benefits from comparing multiple solution strategies. PLANNING-ONLY |
| `improve-agent` | Proposal-only mutator for bounded agent improvement | Agent evaluation via `/improve:agent` command loop |

<!-- /ANCHOR:agent-roster -->

<!-- ANCHOR:routing-matrix -->
## 3. AGENT ROUTING MATRIX

Pick the agent that matches the task type. Default to `general` when no specialist fits.

| Task type | Agent | Invocation pattern |
|-----------|-------|---------------------|
| Codebase exploration | `context` | `opencode run --agent context --variant high --format json --dir /repo "Map the dependency graph for src/"` |
| Multi-agent coordination | `orchestrate` | `opencode run --agent orchestrate --variant high --format json --dir /repo "Coordinate review and testing of auth module"` |
| Documentation generation | `write` | `opencode run --agent write --variant high --format json --dir /repo "Generate README for the cli-opencode skill"` |
| Code review | `review` | `opencode run --agent review --variant high --format json --dir /repo "Review @src/auth.ts for security issues"` |
| Root cause debugging | `debug` | `opencode run --agent debug --variant high --format json --dir /repo "Debug this error: <error>"` |
| Iterative research loop | `deep-research` | `opencode run --agent deep-research --variant high --format json --dir /repo "Run iteration 3 of the deep-research loop on packet 047. State at scratch/iteration-3.jsonl."` |
| Iterative code review loop | `deep-review` | `opencode run --agent deep-review --variant high --format json --dir /repo "Run iteration 5 of the deep-review loop on packet 047. State at review/deep-review-state.jsonl."` |
| Multi-strategy planning | `ultra-think` | `opencode run --agent ultra-think --variant high --format json --dir /repo "Plan the authentication redesign — compare three strategies."` |
| Agent improvement | `improve-agent` | `opencode run --agent improve-agent --variant high --format json --dir /repo "Evaluate the @debug agent on 5 dimensions. Propose improvements."` |
| Default / unspecified | `general` | `opencode run --agent general --variant high --format json --dir /repo "<prompt>"` |

<!-- /ANCHOR:routing-matrix -->

<!-- ANCHOR:as-agent-pattern -->
## 4. THE `As @<agent>` PROMPT-TIME PATTERN

Mirroring the sibling cli-* skills, cli-opencode supports an inline routing pattern where the calling AI prefixes the prompt with `As @<agent>:` instead of using the `--agent` flag. This is useful when the calling AI dispatches a single `opencode run` and shifts agent behavior mid-session.

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --variant high \
  --format json \
  --dir /repo \
  "As @review: Inspect @src/auth.ts for security issues. Surface any P0 / P1 findings with file:line citations."
```

The dispatched session parses the `As @review:` prefix and loads the review agent's frontmatter from `.opencode/agent/review.md`. The remaining prompt is passed to that agent.

### When to prefer `--agent` vs `As @<agent>:`

| Pattern | When |
|---------|------|
| `--agent <slug>` | Routine routing — the calling AI knows the right agent up front |
| `As @<agent>:` | The calling AI wants the agent slug to be visible in the prompt for debugging or telemetry |

<!-- /ANCHOR:as-agent-pattern -->

<!-- ANCHOR:multi-agent -->
## 5. MULTI-AGENT WORKFLOWS

cli-opencode dispatches that touch multiple agents follow this pattern:

1. Use `--agent orchestrate` for the entry-point dispatch.
2. The orchestrator spawns sub-agents through OpenCode's native Task tool (NOT through nested `opencode run` invocations — that breaks the orchestration tree).
3. The calling AI parses the JSON event stream to surface tool calls and partial messages.

Example:

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent orchestrate \
  --variant high \
  --format json \
  --dir /repo \
  "Coordinate a code review and a doc update on packet 047. Dispatch @review for the code, @write for the docs. Aggregate findings."
```

<!-- /ANCHOR:multi-agent -->

<!-- ANCHOR:leaf-agents -->
## 6. LEAF-AGENT CONSTRAINTS

Some agents are LEAF agents by design. They MUST NOT dispatch sub-agents, use the Task tool, or write files (read-only). The cli-opencode skill MUST honor these constraints:

| Agent | Constraint |
|-------|-----------|
| `context` | LEAF — no sub-dispatches, no writes. All results returned to the caller |
| `deep-research` | LEAF — single iteration, externalized state, no nested dispatches |
| `deep-review` | LEAF — single iteration, externalized state, no nested dispatches |
| `ultra-think` | PLANNING-ONLY — no file modifications |

The calling AI must NOT request a write or sub-dispatch from a LEAF agent. If the prompt would require either, route to `general` or `orchestrate` instead.

<!-- /ANCHOR:leaf-agents -->

<!-- ANCHOR:related -->
## 7. RELATED RESOURCES

- `./cli_reference.md` - The `--agent` flag and agent discovery commands
- `./integration_patterns.md` - Three use cases that drive agent selection
- `./opencode_tools.md` - Why agent dispatch matters relative to sibling cli-* skills
- `../assets/prompt_templates.md` - Copy-paste templates per agent
- `../SKILL.md` - Smart router pseudocode

<!-- /ANCHOR:related -->
