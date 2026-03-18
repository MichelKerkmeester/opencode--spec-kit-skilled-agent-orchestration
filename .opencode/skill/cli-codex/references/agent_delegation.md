---
title: "Codex Agent Delegation Reference"
description: "Reference for delegating tasks to 9 specialized Codex agents via the conductor/executor orchestration model."
---

# Codex Agent Delegation Reference

Routing reference for delegating tasks to specialized Codex CLI agents.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

The calling AI decides WHAT to do, Codex CLI decides HOW to do it within the delegated scope.

### Purpose

Documents the 9 specialized Codex agents in `.codex/agents/` and how any AI assistant orchestrates them. The calling AI acts as the **conductor** (planner, validator, integrator) while Codex CLI executes targeted tasks through its agent system.

### When to Use

- Delegating supplementary implementation or analysis tasks to Codex CLI agents
- Cross-AI code review or architectural second opinion
- Web research via `--search` flag (`@deep-research`)
- Fresh-perspective debugging after the calling AI's attempts fail (`@debug`)
- Spec folder documentation generation (`@speckit`)
- Multi-agent Codex-side workflows (`@orchestrate`)

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:orchestration-model -->

## 2. ORCHESTRATION MODEL

```
Calling AI (CONDUCTOR)
  |
  |-- Analyzes task, selects Codex profile
  |-- Constructs codex CLI command with -p <profile> flag
  |-- Delegates via Bash tool
  |
  v
Codex CLI (EXECUTOR)
  |
  |-- Loads profile config (sandbox mode, model, reasoning effort)
  |-- Executes with profile settings
  |-- Returns output to stdout
  |
  v
Calling AI (CONDUCTOR)
  |
  |-- Validates output quality
  |-- Integrates into workflow
  |-- Decides next step
```

### Invocation Pattern

Codex CLI tasks are routed using the `-p` / `--profile` flag with a profile name. Profiles are defined in `config.toml` under `[profiles.<name>]` sections. For git diff reviews, use the built-in `codex exec review` subcommand.

```bash
# Profile-based delegation via exec (non-interactive)
codex exec -p review "Review src/auth.ts for security issues" \
  --model gpt-5.3-codex

# Git diff review via built-in subcommand
codex exec review "Focus on security" --commit HEAD --model gpt-5.3-codex

# With sandbox override
codex exec -p debug -s workspace-write \
  "Fix the authentication bug in src/auth/handler.ts" --model gpt-5.3-codex

# With file context
codex exec -p review "@src/utils.ts @src/auth.ts Review these files for bugs" \
  --model gpt-5.3-codex

# With web search enabled
codex exec -p research --search \
  "Research and document the best OAuth2 PKCE patterns" --model gpt-5.3-codex

# Capture output to file
codex exec -p context "Map the dependency graph for src/" \
  --model gpt-5.3-codex > /tmp/context-map.txt
```

### Profile Setup

Profiles must be defined in `config.toml`. Example configuration matching the agent catalog below:

```toml
# .codex/config.toml
[profiles.review]
sandbox_mode = "read-only"
model_reasoning_effort = "xhigh"

[profiles.context]
sandbox_mode = "read-only"
model_reasoning_effort = "xhigh"

[profiles.debug]
sandbox_mode = "workspace-write"
model_reasoning_effort = "xhigh"

[profiles.research]
sandbox_mode = "workspace-write"
model_reasoning_effort = "xhigh"

[profiles.write]
sandbox_mode = "workspace-write"
model_reasoning_effort = "xhigh"

[profiles.ultra-think]
sandbox_mode = "read-only"
model_reasoning_effort = "xhigh"
```

**Note:** The `.codex/agents/*.toml` files define agent personas for the interactive multi-agent TUI feature. They are NOT loaded by the `-p` profile flag. To use agent-specific behavior in `codex exec`, define corresponding `[profiles.<name>]` sections in config.toml and include context in the prompt.

### Conductor Rules

1. The calling AI always **decomposes** complex tasks before delegating.
2. The calling AI always **validates** Codex output before integrating.
3. The calling AI never **blindly forwards** user requests to Codex.
4. Codex agents operate within their declared `sandbox_mode` boundaries.
5. If an agent returns low-quality output, the calling AI retries with refined instructions or uses a different approach.
6. Each `codex exec` invocation is **stateless** by default; include all necessary context in the prompt.

<!-- /ANCHOR:orchestration-model -->

---

<!-- ANCHOR:agent-catalog -->

## 3. AGENT CATALOG

### Model Selection for Agents

| Agent Type | Recommended Model | Rationale |
|-----------|-------------------|-----------|
| Analysis / exploration | `gpt-5.4` | Frontier reasoning for architectural understanding |
| Code review / security | `gpt-5.4` | Deep reasoning catches subtle issues |
| Planning / strategy | `gpt-5.4` | Multi-faceted analysis benefits from higher reasoning |
| Implementation / fixes | `gpt-5.3-codex` | Code-focused model for generation tasks |
| Documentation / specs | `gpt-5.3-codex` | Efficient for structured content |
| Research (with web) | `gpt-5.4` | Better synthesis of web findings |

---

### @context — Codebase Explorer

| Property           | Value                          |
| ------------------ | ------------------------------ |
| **Role**           | Read-only codebase exploration |
| **Model**          | gpt-5.4 (recommended) or gpt-5.3-codex |
| **Sandbox Mode**   | read-only                      |
| **Modifies Files** | Never                          |

**Best for:** File discovery, pattern analysis, dependency tracing, architecture mapping, gathering context before implementation.

**Delegate when:** You need a second perspective on codebase structure, want to cross-validate your understanding, or need comprehensive exploration of an unfamiliar area.

```bash
codex exec -p context \
  "Map all authentication-related files and their dependencies" \
  -s read-only --model gpt-5.3-codex > /tmp/context-map.txt
```

---

### @debug — Fresh Perspective Debugger

| Property           | Value                                       |
| ------------------ | ------------------------------------------- |
| **Role**           | Systematic debugging with fresh perspective |
| **Model**          | gpt-5.3-codex (fixes) or gpt-5.4 (analysis) |
| **Sandbox Mode**   | workspace-write                             |
| **Modifies Files** | Yes (bug fixes)                             |

**Best for:** Bugs that resist initial debugging (3+ failed attempts), root cause analysis, reproducing elusive errors.

**Delegate when:** The calling AI's own debug attempts have failed. The fresh perspective (no prior conversation context) avoids inheriting wrong assumptions.

**Methodology:** Observe -> Analyze -> Hypothesize -> Fix (4-phase)

```bash
codex exec -p debug -s workspace-write \
  "Login returns 401 despite valid credentials. Error at src/auth/handler.ts:45. Prior attempts: verified token expiry, checked DB connection, confirmed env vars." \
  --model gpt-5.3-codex
```

---

### @handover — Session Continuity

| Property           | Value                                            |
| ------------------ | ------------------------------------------------ |
| **Role**           | Session state capture and continuation documents |
| **Model**          | gpt-5.3-codex                                    |
| **Sandbox Mode**   | workspace-write                                  |
| **Modifies Files** | Yes (handover.md only)                           |

**Best for:** Creating handover documents, capturing session state, enabling continuation across sessions.

**Delegate when:** You need Codex to summarize its own session state or create continuation artifacts from a Codex-side workflow.

```bash
codex exec -p handover -s workspace-write \
  "Create handover document for the authentication refactor in specs/042-auth-refactor/" \
  --model gpt-5.3-codex
```

---

### @orchestrate — Task Commander

| Property           | Value                                           |
| ------------------ | ----------------------------------------------- |
| **Role**           | Multi-agent coordination and task decomposition |
| **Model**          | gpt-5.3-codex                                   |
| **Sandbox Mode**   | read-only                                       |
| **Modifies Files** | Never (delegates to sub-agents)                 |

**Best for:** Complex multi-step Codex-side tasks requiring coordination between multiple Codex agents.

**Delegate when:** The task is too complex for a single Codex agent and requires Codex-internal orchestration. The calling AI remains the top-level conductor.

**Note:** Avoid double-orchestration. If the calling AI is already decomposing tasks, delegate directly to leaf agents instead of routing through @orchestrate.

```bash
codex exec -p orchestrate \
  "Analyze this codebase: explore structure, review code quality, and produce a research document" \
  -s read-only --model gpt-5.3-codex
```

---

### @deep-research — Technical Investigator

| Property           | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| **Role**           | Iterative evidence gathering, feasibility analysis, technology comparison |
| **Model**          | gpt-5.4 (recommended for synthesis) or gpt-5.3-codex           |
| **Sandbox Mode**   | workspace-write                                                 |
| **Modifies Files** | Yes (research.md)                                               |

**Best for:** Technology comparison, API research, architecture exploration, external documentation lookup via web browsing.

**Delegate when:** You need live web information for framework documentation, external API details, or current best practices.

**Unique capability:** `--search` flag enables real-time web browsing.

```bash
codex exec -p research --search -s workspace-write \
  "Research the latest Next.js 15 App Router migration patterns. Compare with current Remix approach in this codebase." \
  --model gpt-5.3-codex
```

---

### @review — Code Quality Guardian

| Property           | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| **Role**           | Code review, quality scoring (0-100), security audits |
| **Model**          | gpt-5.4 (deep review, security) or gpt-5.3-codex (standard review) |
| **Sandbox Mode**   | read-only                                             |
| **Modifies Files** | Never                                                 |

**Best for:** Cross-AI code review (second opinion), security audits, quality scoring with P0/P1/P2 severity classification.

**Delegate when:** You want a second perspective on code quality, or need to validate the calling AI's own implementation from a different model's viewpoint.

```bash
codex exec -p review \
  "@src/auth/handler.ts @src/auth/middleware.ts Review these files for security vulnerabilities and code quality" \
  -s read-only --model gpt-5.3-codex > /tmp/review-output.txt
```

---

### @speckit — Spec Documentation Specialist

| Property           | Value                                  |
| ------------------ | -------------------------------------- |
| **Role**           | Spec folder documentation (Level 1-3+) |
| **Model**          | gpt-5.3-codex                          |
| **Sandbox Mode**   | workspace-write                        |
| **Modifies Files** | Yes (spec folder docs only)            |

**Best for:** Creating spec folder documentation from templates (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md).

**Delegate when:** You need Codex to create or update spec documentation following the CORE + ADDENDUM template architecture. Useful for parallel documentation generation.

```bash
codex exec -p speckit -s workspace-write \
  "Create Level 2 spec folder documentation for the authentication refactor at specs/042-auth-refactor/" \
  --model gpt-5.3-codex
```

---

### @ultra-think — Multi-Strategy Planner

| Property           | Value                                                |
| ------------------ | ---------------------------------------------------- |
| **Role**           | Multi-strategy planning with diverse thinking lenses |
| **Model**          | gpt-5.4 (recommended for complex planning)          |
| **Sandbox Mode**   | read-only                                            |
| **Modifies Files** | Never                                                |

**Best for:** Architecture decisions, complex planning requiring multiple perspectives (Analytical, Creative, Critical, Pragmatic, Holistic lenses).

**Delegate when:** You need a fundamentally different planning approach from a different model, or want to compare Codex's architectural thinking with the calling AI's plan.

```bash
codex exec -p ultra-think -s read-only \
  "Design the caching strategy for this API. Consider Redis, in-memory, and CDN approaches." \
  --model gpt-5.3-codex > /tmp/ultra-think-output.txt
```

---

### @write — Documentation Writer

| Property           | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| **Role**           | Non-spec documentation (READMEs, guides, install docs) |
| **Model**          | gpt-5.3-codex                                          |
| **Sandbox Mode**   | workspace-write                                        |
| **Modifies Files** | Yes (non-spec docs)                                    |

**Best for:** READMEs, guides, install documentation, project-level documentation. Can use `--search` to enrich docs with current external references.

**Delegate when:** You need documentation generated from a different model's perspective, or want Codex's web search capability to enrich documentation with external references.

```bash
codex exec -p write -s workspace-write \
  "Generate a comprehensive README.md for this project based on the codebase structure" \
  --model gpt-5.3-codex
```

<!-- /ANCHOR:agent-catalog -->

---

<!-- ANCHOR:routing-table -->

## 4. ROUTING TABLE

| Task Type                | Primary Agent          | Fallback             | Rationale                            |
| ------------------------ | ---------------------- | -------------------- | ------------------------------------ |
| Codebase exploration     | @context               | (none)               | Read-only, structured exploration    |
| Cross-AI code review     | @review                | @context             | Second opinion on quality, read-only |
| Web/API research         | @deep-research (`--search`) | @write          | Live web browsing capability         |
| Architecture planning    | @ultra-think           | @deep-research       | Multi-lens analysis, no file changes |
| Bug investigation        | @debug                 | @context             | Fresh perspective methodology        |
| Documentation generation | @write                 | @speckit             | Template-first, web-enrichable       |
| Spec folder docs         | @speckit               | (none)               | Exclusive spec authority             |
| Session state capture    | @handover              | (none)               | Continuation artifacts               |
| Complex multi-agent task | @orchestrate           | (decompose manually) | Codex-internal coordination          |

<!-- /ANCHOR:routing-table -->

---

<!-- ANCHOR:anti-patterns -->

## 5. ANTI-PATTERNS

| Anti-Pattern                   | Why It Fails                                                                       | Correct Approach                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Double orchestration           | The calling AI orchestrates, then delegates to @orchestrate, which orchestrates again | Delegate directly to leaf agents                                 |
| Blind forwarding               | Passing user request verbatim to Codex without decomposition                       | Decompose, add context, specify expected output                  |
| Ignoring output validation     | Using Codex output without checking quality                                        | Always validate before integrating                               |
| Wrong agent for task           | Using @write for code review, @debug for exploration                               | Follow the routing table above                                   |
| Stateful assumptions           | Assuming Codex remembers prior exec invocations                                    | Each `exec` is stateless; include all context in the prompt      |
| Interactive mode delegation    | Starting Codex TUI from the calling AI                                                | Always use `codex exec` for non-interactive delegation           |
| Over-permissive sandbox        | Using `danger-full-access` when `workspace-write` suffices                         | Use the least-permissive mode that works                         |
| Missing approval for risky ops | Using `--ask-for-approval never` with `danger-full-access`                         | Always pair elevated sandbox with `--ask-for-approval untrusted` |

<!-- /ANCHOR:anti-patterns -->

---

<!-- ANCHOR:output-handling -->

## 6. OUTPUT HANDLING

### Capturing exec Output

```bash
# Capture to file
codex exec -p review "@src/auth.ts Review for issues" \
  --model gpt-5.3-codex > /tmp/review.txt

# Capture to variable
RESULT=$(codex exec -p context "List all exported functions" \
  --model gpt-5.3-codex)

# Check result
if [ $? -eq 0 ]; then
  echo "Success: $RESULT"
else
  echo "Codex exec failed" >&2
fi
```

### Requesting Structured Output

```bash
# Ask for JSON in the prompt (no native --output flag)
codex exec -p review \
  "@src/auth.ts Review and return JSON: {score: number, issues: [{line, severity, description}]}" \
  --model gpt-5.3-codex > /tmp/review.json

# Parse with jq
jq '.issues[] | select(.severity == "critical")' /tmp/review.json
```

### Error Handling

| Scenario            | Detection                           | Recovery                                              |
| ------------------- | ----------------------------------- | ----------------------------------------------------- |
| Auth failure        | Non-zero exit, auth error in output | Re-run `codex login` or check `OPENAI_API_KEY`        |
| Profile not found   | Error: profile not defined          | Verify profile name matches `[profiles.<name>]` in config.toml |
| Sandbox restriction | Permission denied in output         | Upgrade sandbox mode or adjust task scope             |
| Timeout / hung      | No output within expected time      | Simplify task scope; break into smaller steps         |
| Low-quality output  | Calling AI validation fails        | Retry with refined prompt; use different agent        |

<!-- /ANCHOR:output-handling -->
