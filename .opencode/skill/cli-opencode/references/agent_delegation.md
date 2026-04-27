---
title: "OpenCode CLI - Agent Delegation"
description: "Agent routing matrix for opencode run dispatches. Documents the agent slugs available via .opencode/agent/, the cli pattern As @<agent> for prompt-time routing, and the orchestration principle: calling AI decides WHAT, agent shapes HOW."
---

# OpenCode CLI - Agent Delegation

How cli-opencode routes dispatches to specialized OpenCode agents via the `--agent <slug>` flag. The calling AI decides WHAT to delegate. The agent's frontmatter shapes HOW the dispatched session processes it.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

OpenCode agents are markdown files under `.opencode/agent/<slug>.md`. Each file's frontmatter pins the model, tool permissions, system prompt, and behavioral constraints. When `opencode run --agent <slug>` is invoked, the dispatched session inherits all of that.

The cli-opencode skill exposes the project's full agent roster. The calling AI selects the right slug based on the task type. The agent then shapes the dispatched session — different model, different tool permissions, different system prompt.

### Discovery commands

| Command | Purpose |
|---------|---------|
| `opencode agent list` | List all registered agent slugs across project + user scopes |
| `opencode debug agent <slug>` | Print resolved frontmatter and system prompt for a slug |
| `opencode debug skill <slug>` | Print skill resolution if the agent loads one |

Project-local agents resolve from `.opencode/agent/<slug>.md`. User-level agents fall back from `~/.opencode/agent/<slug>.md` when the project file is missing. The `debug agent` subcommand prints the merged result so the calling AI can confirm which file the dispatch will load.

### Orchestration principle

The calling AI decides WHAT to delegate. The agent's frontmatter shapes HOW the dispatched session processes the task. The calling AI always validates and integrates the output.

This separation of concerns is load-bearing for the cli-opencode skill: the calling AI owns the task graph and the integration step, while the dispatched OpenCode session owns the per-task execution under the agent's tool permissions and system prompt.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:orchestration-model -->
## 2. ORCHESTRATION MODEL

```text
Calling AI (CONDUCTOR)
  |
  |-- Analyzes task, selects OpenCode agent slug
  |-- Constructs opencode run command with --agent <slug> flag
  |-- Delegates via Bash tool
  |
  v
opencode run --agent <slug> (EXECUTOR ENTRY)
  |
  |-- Resolves .opencode/agent/<slug>.md frontmatter
  |-- Pins model, tool permissions, system prompt, behavioral rules
  |-- Loads project plugins, skills, and MCP servers
  |
  v
OpenCode Session (AGENT EXECUTION)
  |
  |-- Agent shapes the dispatch under its frontmatter constraints
  |-- Streams JSON events (session.started, message.delta, tool.call,
  |    tool.result, session.completed) to the calling AI
  |-- Honors LEAF agent restrictions (no nested dispatches, read-only)
  |
  v
Calling AI (CONDUCTOR — RESULT HANDBACK)
  |
  |-- Parses the JSON event stream
  |-- Validates agent output quality
  |-- Integrates findings into the parent workflow
  |-- Decides next step (next dispatch, completion, escalation)
```

### Invocation pattern

cli-opencode dispatches use the `--agent <slug>` flag. The flag loads the agent definition from `.opencode/agent/<slug>.md` (project-local) or the user-level fallback. The dispatch shape pins model, variant, format, and working directory alongside the agent slug:

```bash
opencode run \
  --model github-copilot/gpt-5.4 \
  --agent <slug> \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>"
```

The `--variant high` flag is the cli-opencode default for cross-AI dispatches. The agent's own frontmatter may override the model selection if the agent pins a specific model. When an agent does NOT pin a model, the `--model` flag wins.

### Conductor rules

1. The calling AI always **decomposes** complex tasks before delegating to a single agent.
2. The calling AI always **validates** OpenCode output before integrating.
3. The calling AI never **blindly forwards** user requests to OpenCode without picking the right agent.
4. OpenCode agents operate within their declared tool-permission boundaries — LEAF agents may not write files or dispatch sub-agents.
5. If an agent returns low-quality output, the calling AI retries with refined instructions or selects a different agent.
6. Each `opencode run` invocation is **stateless** by default — include all necessary context in the prompt or use `--continue` / `--session <id>` for explicit continuation.
7. The calling AI surfaces the JSON event stream to the operator when relevant, especially `tool.call` events.

### Orchestration boundaries

| Concern | Owner |
|---------|-------|
| Task selection and decomposition | Calling AI |
| Agent slug selection | Calling AI |
| Prompt construction (RCAF / TIDD-EC / etc.) | Calling AI |
| Model and variant selection | Calling AI (agent frontmatter may pin) |
| Tool permissions inside the dispatch | Agent frontmatter |
| System prompt and behavioral rules | Agent frontmatter |
| Result validation and integration | Calling AI |
| Memory handback extraction | Calling AI |

<!-- /ANCHOR:orchestration-model -->

<!-- ANCHOR:agent-roster -->
## 3. AGENT ROSTER

The repo ships these agents under `.opencode/agent/`. The cli-opencode skill can route to any of them. The summary table below is followed by per-agent property tables for the most-dispatched roles.

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

---

### @context — Read-Only Codebase Explorer

| Property | Value |
|----------|-------|
| **Role** | Read-only codebase exploration and pattern discovery |
| **Sandbox** | Read-only (no writes, no sub-dispatches) |
| **Modifies files** | Never |
| **LEAF constraint** | YES — single iteration, no nested dispatches |

**Best for:** File discovery, pattern analysis, dependency tracing, architecture mapping, gathering context before implementation.

**Delegate when:** The calling AI needs structured codebase exploration with read-only safety guarantees.

---

### @debug — Fresh-Perspective Debugger

| Property | Value |
|----------|-------|
| **Role** | Systematic debugging with fresh context |
| **Sandbox** | Workspace-write (bug fixes only) |
| **Modifies files** | Yes (bug fixes plus exclusive write access for `debug-delegation.md`) |
| **LEAF constraint** | No |

**Best for:** Bugs that resist initial debugging (3+ failed attempts), root cause analysis, reproducing elusive errors.

**Delegate when:** The calling AI's own debug attempts have failed. The fresh perspective avoids inheriting wrong assumptions from the parent conversation.

**Methodology:** Observe -> Analyze -> Hypothesize -> Fix.

---

### @review — Code Quality Guardian

| Property | Value |
|----------|-------|
| **Role** | Code review, severity scoring, security audits |
| **Sandbox** | Read-only |
| **Modifies files** | Never |
| **LEAF constraint** | No |

**Best for:** Pre-merge reviews, security audits, P0 / P1 / P2 severity classification.

**Delegate when:** The calling AI wants a second perspective on code quality, or needs to validate its own implementation from a different model's viewpoint.

---

### @write — Documentation Writer

| Property | Value |
|----------|-------|
| **Role** | Documentation generation (READMEs, skills, guides) |
| **Sandbox** | Workspace-write |
| **Modifies files** | Yes (documentation files only) |
| **LEAF constraint** | No |

**Best for:** READMEs, skill SKILL.md files, install guides, project-level documentation.

**Delegate when:** The calling AI needs documentation generated with sk-doc template enforcement and DQI scoring.

---

### @ultra-think — Multi-Strategy Planning Architect

| Property | Value |
|----------|-------|
| **Role** | Multi-strategy planning across diverse thinking lenses |
| **Sandbox** | Read-only |
| **Modifies files** | Never |
| **LEAF constraint** | PLANNING-ONLY (no file modifications) |

**Best for:** Architecture decisions, complex planning that benefits from comparing 3+ solution strategies.

**Delegate when:** The calling AI needs a fundamentally different planning approach or wants to compare strategies before committing to one.

---

### @deep-research and @deep-review — Loop Executors

These two agents are dispatched only by their parent commands. The calling AI does NOT route to them directly.

| Slug | Parent command | Loop role |
|------|----------------|-----------|
| `deep-research` | `/spec_kit:deep-research` | Single research iteration with externalized JSONL + strategy.md state |
| `deep-review` | `/spec_kit:deep-review` | Single review iteration with P0/P1/P2 findings and severity-weighted convergence |

Both are LEAF agents. Each iteration is fresh-context. The parent command owns convergence detection and state continuity.

<!-- /ANCHOR:agent-roster -->

<!-- ANCHOR:routing-matrix -->
## 4. AGENT ROUTING MATRIX

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
## 5. THE `As @<agent>` PROMPT-TIME PATTERN

Mirroring the sibling cli-* skills, cli-opencode supports an inline routing pattern where the calling AI prefixes the prompt with `As @<agent>:` instead of using the `--agent` flag. This is useful when the calling AI dispatches a single `opencode run` and shifts agent behavior mid-session.

```bash
opencode run \
  --model github-copilot/gpt-5.4 \
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
## 6. MULTI-AGENT WORKFLOWS

cli-opencode dispatches that touch multiple agents follow this pattern:

1. Use `--agent orchestrate` for the entry-point dispatch.
2. The orchestrator spawns sub-agents through OpenCode's native Task tool (NOT through nested `opencode run` invocations — that breaks the orchestration tree).
3. The calling AI parses the JSON event stream to surface tool calls and partial messages.

Example:

```bash
opencode run \
  --model github-copilot/gpt-5.4 \
  --agent orchestrate \
  --variant high \
  --format json \
  --dir /repo \
  "Coordinate a code review and a doc update on packet 047. Dispatch @review for the code, @write for the docs. Aggregate findings."
```

### Avoiding double orchestration

If the calling AI is already decomposing tasks, delegate directly to leaf agents instead of routing through `@orchestrate`. Stacking orchestrators wastes a turn and obscures the task graph.

| Anti-pattern | Why it fails | Correct approach |
|--------------|--------------|------------------|
| Calling AI -> `@orchestrate` -> single leaf agent | Orchestrator overhead with no coordination benefit | Delegate directly to the leaf agent |
| Calling AI -> `@orchestrate` -> `@orchestrate` -> leaf | Two orchestration layers with the same task graph | Pick one orchestrator, decompose once |

<!-- /ANCHOR:multi-agent -->

<!-- ANCHOR:leaf-agents -->
## 7. LEAF-AGENT CONSTRAINTS

Some agents are LEAF agents by design. They MUST NOT dispatch sub-agents, use the Task tool, or write files (read-only). The cli-opencode skill MUST honor these constraints:

| Agent | Constraint |
|-------|-----------|
| `context` | LEAF — no sub-dispatches, no writes. All results returned to the caller |
| `deep-research` | LEAF — single iteration, externalized state, no nested dispatches |
| `deep-review` | LEAF — single iteration, externalized state, no nested dispatches |
| `ultra-think` | PLANNING-ONLY — no file modifications |

The calling AI must NOT request a write or sub-dispatch from a LEAF agent. If the prompt would require either, route to `general` or `orchestrate` instead.

<!-- /ANCHOR:leaf-agents -->

<!-- ANCHOR:worked-examples -->
## 8. WORKED EXAMPLES

Three end-to-end examples covering the most common dispatch patterns.

### Example 1: Code review via `@review`

The calling AI wants a security-focused review of a single file.

```bash
opencode run \
  --model github-copilot/claude-sonnet-4.6 \
  --agent review \
  --variant high \
  --format json \
  --dir /Users/me/repo \
  "As @review: audit @src/auth/handler.ts for OWASP Top 10 issues. Surface findings as P0 / P1 / P2 with file:line citations. READ-ONLY — do not propose fixes."
```

**Expected handback:** JSON event stream with `tool.call` events for file reads, plus a final assistant message containing the structured P0 / P1 / P2 list.

**Calling AI follow-up:** Validate that every cited line resolves in the source file. Re-dispatch with refined scope if a finding lacks evidence.

---

### Example 2: Doc generation via `@write`

The calling AI wants a fresh README for a new skill.

```bash
opencode run \
  --model github-copilot/gpt-5.4 \
  --agent write \
  --variant high \
  --format json \
  --dir /Users/me/repo \
  "As @write: generate README.md for .opencode/skill/cli-opencode/. Load the sk-doc readme_template.md, fill it with the three orthogonal use cases, run the DQI score, surface any HIGH issues for manual patching."
```

**Expected handback:** JSON event stream with `tool.call` events for template load + write operations, plus a final summary listing the DQI score and any HIGH issues.

**Calling AI follow-up:** Read the generated README. If DQI flagged HIGH issues, dispatch a follow-up `@write` invocation with the patch list.

---

### Example 3: Root cause debugging via `@debug`

The calling AI's first 3 debug attempts failed. Escalate to a fresh-context dispatch.

```bash
opencode run \
  --model github-copilot/gpt-5.4 \
  --agent debug \
  --variant high \
  --format json \
  --dir /Users/me/repo \
  "As @debug: Login returns 401 despite valid credentials. Error at @src/auth/handler.ts:45. Prior attempts: verified token expiry, checked DB connection, confirmed env vars. Run the Observe -> Analyze -> Hypothesize -> Fix methodology. Write findings to debug-delegation.md."
```

**Expected handback:** JSON event stream including a write to `debug-delegation.md` and a final summary with root cause + applied fix (or refusal with rationale).

**Calling AI follow-up:** Read `debug-delegation.md`. If a fix was applied, run the project's test suite. If `@debug` declined to fix, surface the rationale to the operator.

<!-- /ANCHOR:worked-examples -->

<!-- ANCHOR:output-handling -->
## 9. FAILURE MODES AND OUTPUT HANDLING

### Capturing output

```bash
# Capture JSON event stream to file
opencode run --agent review --variant high --format json --dir /repo \
  "Review @src/auth.ts" > /tmp/review-events.jsonl

# Capture stdout to a variable
RESULT=$(opencode run --agent context --variant high --format json --dir /repo \
  "List exported symbols in src/")

# Check exit status
if [ $? -eq 0 ]; then
  echo "Success"
else
  echo "opencode run failed" >&2
fi
```

### Parsing structured output

`--format json` emits newline-delimited JSON events. Each event has at minimum `type`, `timestamp`, `session_id`, and `payload`. The calling AI parses incrementally:

```bash
jq -r 'select(.type == "tool.call") | .payload' /tmp/review-events.jsonl
jq -r 'select(.type == "session.completed") | .payload.summary' /tmp/review-events.jsonl
```

### Failure modes

| Symptom | Likely cause | Recovery |
|---------|--------------|----------|
| `unknown agent <slug>` | Slug not present in `.opencode/agent/` or user-level fallback | Run `opencode agent list` to enumerate, fix the slug, retry |
| Agent loaded but writes refused | LEAF agent constraint or read-only sandbox | Re-route to `general` / `orchestrate` for write operations |
| Session never finishes | Tool call hung or infinite loop | Inspect `~/.opencode/state/<session_id>/messages.jsonl`, abort the session, retry with refined scope |
| Empty output stream | `--format default` with non-TTY parent | Pass `--format json` and parse the event stream |
| Plugin load crash | Misconfigured plugin in agent context | Rerun with `--pure` to bypass plugins, then root-cause the plugin |
| `provider/model not found` | Model not configured for the agent's chosen provider | Run `opencode providers` to enumerate, then `auth login <provider>` |
| Self-invocation refused | cli-opencode detected an in-OpenCode runtime | Use a sibling cli-* skill or restate the request with parallel-session keywords (see ADR-001) |
| Low-quality agent output | Wrong agent for the task or under-specified prompt | Re-route per the routing matrix, refine the prompt with more context |

### Recovery patterns

When a dispatch produces low-quality output, the calling AI has three escalation paths:

1. **Refine the prompt** — add file anchors, success criteria, or "do not change" guardrails. Re-dispatch with the same agent.
2. **Re-route to a different agent** — if `@write` produced thin docs, escalate to `@write` with `--variant max`, or hand off to `@orchestrate` for multi-pass refinement.
3. **Decompose the task** — break the dispatch into smaller sub-tasks with explicit handoffs between agents. Each sub-task gets its own validation step.

The conductor (calling AI) decides which path. The agent has no visibility into the parent task graph.

<!-- /ANCHOR:output-handling -->

<!-- ANCHOR:related -->
## 10. RELATED RESOURCES

- `./cli_reference.md` - The `--agent` flag and agent discovery commands
- `./integration_patterns.md` - Three use cases that drive agent selection
- `./opencode_tools.md` - Why agent dispatch matters relative to sibling cli-* skills
- `../assets/prompt_templates.md` - Copy-paste templates per agent
- `../SKILL.md` - Smart router pseudocode

<!-- /ANCHOR:related -->
