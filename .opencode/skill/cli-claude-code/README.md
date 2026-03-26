---
title: "Claude Code CLI Orchestrator"
description: "Cross-AI task delegation to Anthropic's Claude Code CLI for deep reasoning, surgical code editing, structured output, and agent-based workflows."
trigger_phrases:
  - "claude code cli"
  - "claude code"
  - "delegate to claude"
  - "extended thinking"
  - "deep reasoning"
---

# Claude Code CLI Orchestrator

> Delegate tasks from any AI assistant to Anthropic's Claude Code CLI for deep reasoning, precise code editing, and structured analysis.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
  - [3.1 FEATURE HIGHLIGHTS](#31-feature-highlights)
  - [3.2 FEATURE REFERENCE](#32-feature-reference)
- [4. STRUCTURE](#4-structure)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

This skill lets external AI assistants (Gemini CLI, Codex CLI, GitHub Copilot) invoke Anthropic's Claude Code CLI as a specialist tool. The calling AI stays the conductor, delegating specific tasks to Claude Code and integrating the results back into its own workflow.

Claude Code brings capabilities that other CLIs lack or handle differently. Extended thinking with chain-of-thought reasoning gives it an edge on complex architecture decisions. The Edit tool performs surgical, diff-based code modifications rather than rewriting entire files. Schema-validated structured output guarantees machine-readable JSON. And 9 specialized agents handle everything from code review to session handover.

The skill includes a self-invocation guard: if you are already running inside Claude Code, the skill blocks activation to prevent circular delegation.

### Key Statistics

| Category | Value | Details |
|----------|-------|---------|
| **Models** | 3 | Opus 4.6, Sonnet 4.6, Haiku 4.5 |
| **Agents** | 9 | context, debug, handover, orchestrate, research, review, speckit, ultra-think, write |
| **Permission Modes** | 3 | plan (read-only), default (ask), bypassPermissions (auto-approve) |
| **Output Formats** | 3 | text, json, stream-json |
| **References** | 4 | cli_reference, claude_tools, agent_delegation, integration_patterns |
| **Version** | 1.1.1 | |

### How This Compares

| Capability | Codex CLI | Gemini CLI | Copilot CLI | Claude Code CLI |
|------------|-----------|------------|-------------|-----------------|
| **Deep reasoning** | Configurable effort | Standard | Configurable effort | Extended thinking with chain-of-thought |
| **Code editing** | Sandbox-based | File writes | Autopilot | Surgical diff-based Edit tool |
| **Structured output** | Standard JSON | JSON mode | Standard JSON | Schema-validated `--json-schema` |
| **Agent system** | Profile-based TOML | Markdown agents | Explore/Task agents | 9 specialized agents with routing |
| **Session continuity** | Resume/fork | Memory tool | Repo memory | `--continue` / `--resume` with full context |
| **Cost control** | Token limits | Free tier | Subscription | `--max-budget-usd` per session |

### Key Features at a Glance

| Feature | What It Does |
|---------|-------------|
| **Extended Thinking** | Deep chain-of-thought reasoning via `--effort high` with Opus for complex trade-off analysis |
| **Edit Tool** | Surgical diff-based code editing that modifies specific lines without rewriting files |
| **Structured Output** | Schema-validated JSON via `--json-schema` for pipeline integration |
| **Agent Delegation** | 9 agents (review, debug, context, write, etc.) routed via `--agent` flag |
| **Permission Modes** | Read-only exploration (`plan`), interactive approval (`default`), or full auto (`bypassPermissions`) |
| **Session Continuity** | Resume prior conversations with `--continue` or `--resume SESSION_ID` |
| **Cost Control** | Hard budget cap per session via `--max-budget-usd` |
| **Skills System** | On-demand specialized workflows loaded via SKILL.md files |

### Requirements

| Requirement | Value | Notes |
|-------------|-------|-------|
| **CLI** | `@anthropic-ai/claude-code` | Install via `npm install -g @anthropic-ai/claude-code` |
| **Auth** | `ANTHROPIC_API_KEY` or OAuth | API key for programmatic use, OAuth for interactive |
| **Node.js** | 18+ | Required for npm installation |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 1. Verify Installation

```bash
command -v claude || echo "Not installed. Run: npm install -g @anthropic-ai/claude-code"
```

### 2. Check Self-Invocation Guard

```bash
# If this returns a value, you are already inside Claude Code. Do not use this skill.
echo $CLAUDECODE
```

### 3. Run a Simple Task

```bash
claude -p "Explain the architecture of src/auth/" --output-format text 2>&1
```

### 4. Use a Specialized Agent

```bash
claude -p "Review this module for security issues" --agent review --permission-mode plan --output-format text 2>&1
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

Claude Code CLI stands apart from other AI CLIs through three core strengths: deep reasoning, precision editing, and structured output.

Extended thinking is the headline capability. When Opus receives a complex prompt with `--effort high`, it generates an internal chain-of-thought before responding. This matters for architecture trade-off analysis, root cause debugging, and multi-dimensional decision-making where surface-level pattern matching falls short. The reasoning is not just longer responses. It is a fundamentally different processing mode that considers alternatives, backtracks, and synthesizes before committing to an answer.

The Edit tool changes how code gets modified. Instead of regenerating entire files (the approach most CLIs take), Claude Code applies surgical diffs to specific lines. This preserves surrounding code, respects existing formatting, and reduces the blast radius of every change. For multi-file refactors where a single misplaced character can break a build, diff-based editing is significantly safer than whole-file replacement.

Structured output through `--json-schema` fills a gap that other CLIs handle loosely. You define a JSON schema, and Claude Code validates its response against it before returning. The output either matches the schema or the request fails. No parsing surprises, no malformed JSON. This makes Claude Code a reliable node in data pipelines where downstream systems expect exact formats.

The agent system adds specialization on top of these foundations. Nine agents cover distinct domains: `context` for codebase exploration, `review` for security audits, `debug` for root cause analysis, `write` for documentation, and five more. Each agent loads domain-specific instructions that shape how Claude Code approaches the task.

### 3.2 FEATURE REFERENCE

#### Models

| Model | ID | Best For | Cost |
|-------|----|----------|------|
| **Opus** | `claude-opus-4-6` | Deep reasoning, architecture decisions, extended thinking | Highest |
| **Sonnet** | `claude-sonnet-4-6` | General tasks, code generation, reviews (default) | Medium |
| **Haiku** | `claude-haiku-4-5-20251001` | Classification, formatting, simple queries, batch ops | Lowest |

#### Core Flags

| Flag | Short | Purpose | Example |
|------|-------|---------|---------|
| `--print` | `-p` | Non-interactive mode | `claude -p "prompt"` |
| `--model` | | Model selection | `--model claude-opus-4-6` |
| `--output-format` | | Output type | `--output-format json` |
| `--permission-mode` | | Access control | `--permission-mode plan` |
| `--json-schema` | | Structured output | `--json-schema '{"type":"object",...}'` |
| `--agent` | | Agent routing | `--agent review` |
| `--effort` | | Reasoning depth | `--effort high` |
| `--max-budget-usd` | | Cost cap | `--max-budget-usd 1.00` |
| `--continue` | | Resume latest session | `--continue` |
| `--resume` | | Resume specific session | `--resume SESSION_ID` |

#### Agent Roster

| Agent | Purpose | Invocation |
|-------|---------|------------|
| `context` | Codebase exploration | `--agent context --permission-mode plan` |
| `debug` | Root cause analysis | `--agent debug` |
| `handover` | Session state capture | `--agent handover` |
| `orchestrate` | Multi-agent coordination | `--agent orchestrate` |
| `research` | Evidence gathering | `--agent research` |
| `review` | Code review and audit | `--agent review --permission-mode plan` |
| `speckit` | Spec documentation | `--agent speckit` |
| `ultra-think` | Multi-strategy planning | `--agent ultra-think --permission-mode plan` |
| `write` | Documentation generation | `--agent write` |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
cli-claude-code/
  SKILL.md                              # Skill definition and smart routing logic
  README.md                             # This file
  assets/
    prompt_templates.md                 # Copy-paste ready prompts for common tasks
  references/
    agent_delegation.md                 # Agent roster, routing patterns, invocation examples
    claude_tools.md                     # Unique capabilities and comparison table
    cli_reference.md                    # CLI flags, commands, models, auth, config
    integration_patterns.md             # Cross-AI orchestration patterns
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Authentication

| Method | Setup | Best For |
|--------|-------|----------|
| **API Key** | `export ANTHROPIC_API_KEY=your-key` | Programmatic use, CI/CD |
| **OAuth** | `claude auth login` | Interactive browser flow |
| **Token Setup** | `claude setup-token` | Non-interactive CI/CD pipelines |

### Model Defaults

Sonnet is the default model. Override per invocation with `--model`:

```bash
claude -p "prompt" --model claude-opus-4-6 --output-format text 2>&1
```

### Permission Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `plan` | Read-only, no file writes | Safe exploration and analysis |
| (default) | Asks before each operation | Standard interactive use |
| `bypassPermissions` | Auto-approves everything | Automation (requires user consent) |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Deep Reasoning with Extended Thinking

```bash
claude -p "Analyze the trade-offs between microservices and monolith for this project. \
Consider scalability, team size, deployment complexity." \
  --model claude-opus-4-6 --effort high --output-format text 2>&1
```

### Schema-Validated Structured Output

```bash
claude -p "Extract all API endpoints from src/routes/" \
  --json-schema '{"type":"object","properties":{"endpoints":{"type":"array","items":{"type":"object","properties":{"method":{"type":"string"},"path":{"type":"string"}}}}}}' \
  --output-format json 2>&1
```

### Agent-Based Code Review

```bash
claude -p "Review @src/auth.ts for security vulnerabilities" \
  --agent review --permission-mode plan --output-format text 2>&1
```

### Background Processing with Cost Control

```bash
claude -p "Generate full test coverage for src/utils/" \
  --model claude-sonnet-4-6 --max-budget-usd 2.00 --output-format text 2>&1 &
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Claude Code CLI Not Found

**What you see**: `command not found: claude`
**Common causes**: CLI not installed globally, or PATH not updated after install.
**Fix**: Run `npm install -g @anthropic-ai/claude-code` and restart your terminal.

### Self-Invocation Error

**What you see**: "ERROR: Already inside Claude Code session"
**Common causes**: The skill detected `$CLAUDECODE` environment variable, meaning you are running inside Claude Code and trying to delegate back to yourself.
**Fix**: Use native Claude Code capabilities directly (Edit tool, Agent tool, etc.) instead of invoking via CLI.

### Authentication Failure

**What you see**: `401 Unauthorized` or "API key invalid"
**Common causes**: `ANTHROPIC_API_KEY` not set, expired, or incorrect.
**Fix**: Verify with `claude auth status`. Re-authenticate with `claude auth login` or set `export ANTHROPIC_API_KEY=your-key`.

### Budget Exceeded

**What you see**: Session terminates mid-task with budget warning.
**Common causes**: `--max-budget-usd` set too low for the task complexity.
**Fix**: Increase the budget or use a cheaper model (Haiku for batch operations, Sonnet for general tasks).

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

### General

**Q: When should I use Claude Code instead of other CLIs?**
A: Use Claude Code for tasks requiring deep extended thinking (Opus), surgical code editing (diff-based), schema-validated structured output, or access to its 9 specialized agents. For web search, use Gemini or Codex instead.

**Q: Can Claude Code search the web?**
A: No. Claude Code has no web search capability. Delegate web research to Gemini CLI (Google Search grounding) or Codex CLI (`--search` flag).

### Models

**Q: Which model should I default to?**
A: Sonnet for most tasks. Opus when you need deep reasoning or extended thinking. Haiku for batch operations where speed matters more than depth.

**Q: What does `--effort high` actually do?**
A: It activates extended thinking, a processing mode where the model generates internal chain-of-thought reasoning before responding. This produces more thorough analysis but takes longer and costs more.

### Agents

**Q: How do I pick the right agent?**
A: Match the task type to the agent roster in Section 3.2. For read-only exploration, use `context` with `--permission-mode plan`. For code review, use `review`. When unsure, skip the `--agent` flag and let Claude Code handle the task with its general capabilities.

**Q: Can I create custom agents?**
A: Yes. Add markdown files to `.opencode/agent/` (for Claude Code) or `.claude/agents/` (for Claude-specific definitions). See `agent_delegation.md` for the agent definition format.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill Resources
- [SKILL.md](./SKILL.md) -- Skill definition, smart routing logic, and activation triggers
- [cli_reference.md](./references/cli_reference.md) -- CLI flags, commands, models, auth, and config
- [claude_tools.md](./references/claude_tools.md) -- Unique capabilities and cross-CLI comparison
- [agent_delegation.md](./references/agent_delegation.md) -- Agent roster, routing, and invocation patterns
- [integration_patterns.md](./references/integration_patterns.md) -- Cross-AI orchestration workflows
- [prompt_templates.md](./assets/prompt_templates.md) -- Copy-paste ready prompts

### Related Skills
- [cli-codex](../cli-codex/) -- OpenAI Codex CLI orchestrator
- [cli-copilot](../cli-copilot/) -- GitHub Copilot CLI orchestrator
- [cli-gemini](../cli-gemini/) -- Google Gemini CLI orchestrator

<!-- /ANCHOR:related-documents -->
