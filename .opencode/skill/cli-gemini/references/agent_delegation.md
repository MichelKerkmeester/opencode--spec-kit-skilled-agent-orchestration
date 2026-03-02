---
title: "Gemini Agent Delegation Reference"
description: "Reference for delegating tasks to 9 specialized Gemini agents via the conductor/executor orchestration model."
---

# Gemini Agent Delegation Reference

Routing reference for delegating tasks from Claude Code to specialized Gemini CLI agents.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Claude Code decides WHAT to do, Gemini CLI decides HOW to do it within the delegated scope.

### Purpose

Documents the 9 specialized Gemini agents in `.gemini/agents/` and how Claude Code orchestrates them. Claude Code acts as the **conductor** (planner, validator, integrator) while Gemini CLI executes targeted tasks through its agent system.

### When to Use

- Delegating supplementary tasks to Gemini CLI agents
- Cross-AI code review or architectural second opinion
- Web research via Google Search grounding (`@research`)
- Fresh-perspective debugging after Claude Code attempts fail (`@debug`)
- Multi-agent Gemini-side workflows (`@orchestrate`)

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:orchestration-model -->
## 2. ORCHESTRATION MODEL

```
Claude Code (CONDUCTOR)
  |
  |-- Analyzes task, selects Gemini agent
  |-- Constructs gemini CLI command with @agent
  |-- Delegates via Bash tool
  |
  v
Gemini CLI (EXECUTOR)
  |
  |-- Routes to specified @agent
  |-- Agent executes with its tools
  |-- Returns structured output
  |
  v
Claude Code (CONDUCTOR)
  |
  |-- Validates output quality
  |-- Integrates into workflow
  |-- Decides next step
```

### Invocation Pattern

Gemini CLI agents are invoked by referencing the agent name in the prompt with the `@` prefix. The agent definitions live in `.gemini/agents/` as markdown files.

```bash
# Basic agent delegation (agent referenced in prompt)
gemini "As @review agent: <task description>" -m gemini-3.1-pro-preview -o text

# With YOLO mode (auto-approve tool calls)
gemini "As @debug agent: <task description>" -y -m gemini-3.1-pro-preview -o text

# With JSON output for structured parsing
gemini "As @context agent: <task description>" -o json

# With file context
gemini "As @review agent: Review this file for bugs" @src/utils.ts -o text

# With directory scope
gemini "As @context agent: Explore the authentication module" --include-directories src/auth -o text
```

### Conductor Rules

1. Claude Code always **decomposes** complex tasks before delegating
2. Claude Code always **validates** Gemini output before integrating
3. Claude Code never **blindly forwards** user requests to Gemini
4. Gemini agents operate within their declared tool/scope boundaries
5. If an agent returns low-quality output, Claude Code retries with refined instructions or uses a different approach

<!-- /ANCHOR:orchestration-model -->

---

<!-- ANCHOR:agent-catalog -->
## 3. AGENT CATALOG

### @context — Codebase Explorer

| Property | Value |
|----------|-------|
| **Role** | Read-only codebase exploration |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, grep_search, list_directory |
| **Modifies files** | Never |
| **Max turns** | 10 |

**Best for:** File discovery, pattern analysis, dependency tracing, architecture mapping, gathering context before implementation.

**Delegate when:** You need a second perspective on codebase structure, want to cross-validate your understanding, or need comprehensive exploration of an unfamiliar area.

```bash
gemini "As @context agent: Map all authentication-related files and their dependencies" -o json
```

---

### @debug — Fresh Perspective Debugger

| Property | Value |
|----------|-------|
| **Role** | Systematic debugging with fresh perspective |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, write_file, replace, run_shell_command, grep_search, list_directory |
| **Modifies files** | Yes (fixes) |
| **Max turns** | 20 |

**Best for:** Bugs that resist initial debugging (3+ failed attempts), root cause analysis, reproducing elusive errors.

**Delegate when:** Claude Code's own debug attempts have failed. The fresh perspective (no prior conversation context) avoids inheriting wrong assumptions.

**Methodology:** Observe -> Analyze -> Hypothesize -> Fix (4-phase)

```bash
gemini "As @debug agent: Login returns 401 despite valid credentials. Error in src/auth/handler.go:45. Prior attempts: checked token expiry, verified DB connection." -y -o text
```

---

### @handover — Session Continuity

| Property | Value |
|----------|-------|
| **Role** | Session state capture and continuation documents |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, write_file, replace, grep_search, list_directory |
| **Modifies files** | Yes (handover.md only) |
| **Max turns** | 10 |

**Best for:** Creating handover documents, capturing session state, enabling continuation across sessions.

**Delegate when:** You need Gemini to summarize its own session state or create continuation artifacts from a Gemini-side workflow.

```bash
gemini "As @handover agent: Create handover document for the current authentication refactor in specs/042-auth-refactor/" -o text
```

---

### @orchestrate — Task Commander

| Property | Value |
|----------|-------|
| **Role** | Multi-agent coordination and task decomposition |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file |
| **Modifies files** | Never (delegates to sub-agents) |
| **Max turns** | 25 |

**Best for:** Complex multi-step Gemini-side tasks requiring coordination between multiple Gemini agents.

**Delegate when:** The task is too complex for a single Gemini agent and requires Gemini-internal orchestration. Claude Code remains the top-level conductor.

**Note:** Avoid double-orchestration. If Claude Code is already decomposing tasks, delegate directly to leaf agents instead of routing through @orchestrate.

```bash
gemini "As @orchestrate agent: Analyze this codebase: explore structure, review code quality, and produce a research document" -o text
```

---

### @research — Technical Investigator

| Property | Value |
|----------|-------|
| **Role** | Evidence gathering, feasibility analysis, technology comparison |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, write_file, replace, run_shell_command, grep_search, list_directory, google_web_search |
| **Modifies files** | Yes (research.md) |
| **Max turns** | 20 |

**Best for:** Technology comparison, API research, architecture exploration, external documentation lookup (via Google Search grounding).

**Delegate when:** You need Google Search grounding for real-time web information, framework documentation, or external API details that Claude Code cannot access directly.

**Unique capability:** `google_web_search` tool provides real-time web access.

```bash
gemini "As @research agent: Research the latest Next.js 15 App Router migration patterns. Compare with current Remix approach in this codebase." -o text
```

---

### @review — Code Quality Guardian

| Property | Value |
|----------|-------|
| **Role** | Code review, quality scoring (0-100), security audits |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, run_shell_command, grep_search, list_directory |
| **Modifies files** | Never |
| **Max turns** | 15 |

**Best for:** Cross-AI code review (second opinion), security audits, quality scoring with P0/P1/P2 severity classification.

**Delegate when:** You want a second perspective on code quality, or need to validate Claude Code's own implementation from a different model's viewpoint.

```bash
gemini "As @review agent: Review these files for security vulnerabilities and code quality" @src/auth/handler.go @src/auth/middleware.go -o json
```

---

### @speckit — Spec Documentation Specialist

| Property | Value |
|----------|-------|
| **Role** | Spec folder documentation (Level 1-3+) |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, write_file, replace, run_shell_command, grep_search, list_directory |
| **Modifies files** | Yes (spec folder docs only) |
| **Max turns** | 20 |

**Best for:** Creating spec folder documentation from templates (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md).

**Delegate when:** You need Gemini to create or update spec documentation following the CORE + ADDENDUM template architecture. Useful for parallel documentation generation.

```bash
gemini "As @speckit agent: Create Level 2 spec folder documentation for the authentication refactor at specs/042-auth-refactor/" -y -o text
```

---

### @ultra-think — Multi-Strategy Planner

| Property | Value |
|----------|-------|
| **Role** | Multi-strategy planning with diverse thinking lenses |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, grep_search, list_directory |
| **Modifies files** | Never |
| **Max turns** | 30 |

**Best for:** Architecture decisions, complex planning requiring multiple perspectives (Analytical, Creative, Critical, Pragmatic, Holistic lenses).

**Delegate when:** You need a fundamentally different planning approach from a different model, or want to compare Gemini's architectural thinking with Claude Code's plan.

```bash
gemini "As @ultra-think agent: Design the caching strategy for this API. Consider Redis, in-memory, and CDN approaches." -o json
```

---

### @write — Documentation Writer

| Property | Value |
|----------|-------|
| **Role** | Non-spec documentation (READMEs, guides, install docs) |
| **Model** | gemini-3.1-pro-preview |
| **Tools** | read_file, write_file, replace, run_shell_command, grep_search, list_directory, google_web_search |
| **Modifies files** | Yes (non-spec docs) |
| **Max turns** | 15 |

**Best for:** READMEs, guides, install documentation, project-level documentation.

**Delegate when:** You need documentation generated from a different model's perspective, or want Gemini's web search capability to enrich documentation with external references.

**Unique capability:** `google_web_search` for enriching docs with current external links.

```bash
gemini "As @write agent: Generate a comprehensive README.md for this project based on the codebase structure" -y -o text
```

<!-- /ANCHOR:agent-catalog -->

---

<!-- ANCHOR:routing-table -->
## 4. ROUTING TABLE

| Task Type | Primary Agent | Fallback | Rationale |
|-----------|---------------|----------|-----------|
| Codebase exploration | @context | (none) | Read-only, structured Context Packages |
| Cross-AI code review | @review | @context | Second opinion on quality |
| Web/API research | @research | @write | Google Search grounding |
| Architecture planning | @ultra-think | @research | Multi-lens analysis |
| Bug investigation | @debug | @context | Fresh perspective methodology |
| Documentation generation | @write | @speckit | Template-first, web-enriched |
| Spec folder docs | @speckit | (none) | Exclusive spec authority |
| Session state capture | @handover | (none) | Continuation artifacts |
| Complex multi-agent task | @orchestrate | (decompose manually) | Gemini-internal coordination |

<!-- /ANCHOR:routing-table -->

---

<!-- ANCHOR:anti-patterns -->
## 5. ANTI-PATTERNS

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Double orchestration | Claude Code orchestrates, then delegates to @orchestrate, which orchestrates again | Delegate directly to leaf agents |
| Blind forwarding | Passing user request verbatim to Gemini without decomposition | Decompose, add context, specify output format |
| Ignoring output validation | Using Gemini output without checking quality | Always validate before integrating |
| Wrong agent for task | Using @write for code review, @debug for exploration | Follow the routing table above |
| Stateful assumptions | Assuming Gemini remembers prior delegations | Each invocation is stateless; include all context |
| Interactive mode delegation | Starting Gemini in REPL mode from Claude Code | Always use non-interactive mode with prompt as argument |

<!-- /ANCHOR:anti-patterns -->

---

<!-- ANCHOR:output-handling -->
## 6. OUTPUT HANDLING

### JSON Output (Recommended for Integration)

```bash
gemini "As @review agent: Review this file for issues" -o json
```

Parse the response field from the JSON output and extract structured findings.

### Text Output (Readable Reports)

```bash
gemini "As @context agent: Explain the architecture of this codebase" -o text
```

Suitable when the output will be presented to the user directly.

### Error Handling

| Scenario | Detection | Recovery |
|----------|-----------|----------|
| Rate limit hit | Exit code non-zero, 429 in output | Wait and retry, or use `flash` model |
| Agent not found | Error message in output | Verify agent name matches `.gemini/agents/` |
| Timeout | No output within timeout_mins | Simplify task scope, break into smaller pieces |
| Low-quality output | Claude Code validation fails | Retry with refined prompt, or use different agent |

<!-- /ANCHOR:output-handling -->
