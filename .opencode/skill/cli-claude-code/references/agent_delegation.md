---
title: "Claude Code Agent Delegation Reference"
description: "Reference for delegating tasks to 10 specialized Claude Code agents via the conductor/executor orchestration model."
---

# Claude Code Agent Delegation Reference

Routing reference for delegating tasks from external AI assistants to specialized Claude Code CLI agents.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

The calling AI decides WHAT to do, Claude Code decides HOW to do it within the delegated scope.

### Purpose

Documents the active Claude Code agents in `.opencode/agent/` and how external AI assistants orchestrate them. The calling AI (Gemini, Codex, Copilot, etc.) acts as the **conductor** (planner, validator, integrator) while Claude Code executes targeted tasks through its agent system.

### When to Use

- Delegating supplementary implementation or analysis tasks to Claude Code agents
- Cross-AI code review or architectural second opinion via `@review`
- Deep reasoning and extended thinking via `@ultra-think`
- Fresh-perspective debugging after the calling AI's attempts fail via Task-tool dispatch to `@debug`
- Codebase exploration in read-only mode via `@context`

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:orchestration-model -->

## 2. ORCHESTRATION MODEL

```
External AI (CONDUCTOR)               [Gemini / Codex / Copilot / etc.]
  |
  |-- Analyzes task, selects Claude Code agent
  |-- Constructs claude CLI command with --agent flag
  |-- Delegates via Bash/shell execution
  |
  v
Claude Code CLI (EXECUTOR)
  |
  |-- Loads agent definition from .opencode/agent/<name>.md
  |-- Loads CLAUDE.md context hierarchy (global → project → local)
  |-- Executes with agent-specific instructions and tool permissions
  |-- Returns output to stdout
  |
  v
External AI (CONDUCTOR)
  |
  |-- Validates output quality and relevance
  |-- Integrates findings into its own workflow
  |-- Decides next step (accept, iterate, delegate elsewhere)
```

### Invocation Pattern

Claude Code agents are routed using the `--agent` flag with an agent name. Agent definitions live in `.opencode/agent/<name>.md` files. For read-only tasks, combine with `--permission-mode plan`.

```bash
# Agent-based delegation (non-interactive)
claude -p "Review src/auth.ts for security issues" \
  --agent review --permission-mode plan --output-format text 2>&1

# Agent with specific model
claude -p "Plan the authentication redesign with multi-strategy analysis" \
  --agent ultra-think --model claude-opus-4-6 --permission-mode plan --output-format text 2>&1

# Agent with file context
claude -p "Debug this error in @src/auth/handler.ts: [paste error]" \
  --agent debug --output-format text 2>&1

# Capture output to file
claude -p "Map the dependency graph for src/" \
  --agent context --permission-mode plan --output-format text 2>&1 > /tmp/context-map.txt

# Agent with cost control
claude -p "Generate spec documentation for the new feature" \
  --agent speckit --max-budget-usd 0.50 --output-format text 2>&1
```

### Agent Definition Structure

Each agent is defined in a `.md` file in `.opencode/agent/`:

```
.opencode/agent/
├── context.md        # Read-only codebase exploration
├── debug.md          # Systematic debugging
├── orchestrate.md    # Multi-agent coordination
├── research.md       # Evidence gathering
├── review.md         # Code review, security audits
├── ultra-think.md    # Multi-strategy planning
└── write.md          # Documentation generation
```

<!-- /ANCHOR:orchestration-model -->

---

<!-- ANCHOR:agent-catalog -->

## 3. CLAUDE CODE AGENT CATALOG

### Agent Roster (10 Agents)

| Agent | Permission Mode | Purpose | Use When |
|-------|-----------------|---------|----------|
| `context` | `plan` (read-only) | Read-only codebase exploration, file discovery, pattern analysis | You need to understand code structure, dependencies, or patterns before implementing |
| `debug` | default | Systematic debugging, root cause analysis, fresh perspective | Calling AI's debugging attempts failed; need independent root cause analysis |
| `orchestrate` | `plan` (read-only) | Multi-agent coordination, complex workflow decomposition | Running multiple Claude Code agents for interconnected tasks |
| `research` | default | Evidence gathering, feasibility analysis, technical investigation | Need current best practices, technical comparisons, or feasibility assessment |
| `review` | `plan` (read-only) | Code review, security audits, quality scoring, architecture review | Second opinion on generated code, architecture, or security posture |
| `ultra-think` | `plan` (read-only) | Multi-strategy planning, diverse reasoning strategies, scored rubric | Complex planning requiring multiple perspectives scored by quality dimensions |
| `write` | default | Documentation generation, README creation, guide writing | Creating or updating technical documentation, guides, READMEs |

---

<!-- /ANCHOR:agent-catalog -->

<!-- ANCHOR:agent-details -->

## 4. AGENT DETAILS

### @context — Codebase Explorer

**Purpose:** Read-only codebase exploration, file discovery, dependency mapping, pattern analysis.

**Best for:** Understanding unfamiliar code before implementing, mapping cross-file dependencies, creating architecture overviews.

**Recommended flags:** `--permission-mode plan` (enforces read-only)

```bash
# Map project architecture
claude -p "Analyze the architecture of this project. Identify key modules, entry points, and dependency flow." \
  --agent context --permission-mode plan --output-format text 2>&1

# Find patterns
claude -p "Find all authentication-related files and describe the auth flow" \
  --agent context --permission-mode plan --output-format text 2>&1

# Dependency analysis
claude -p "Map the import graph for @src/services/ — what depends on what?" \
  --agent context --permission-mode plan --output-format text 2>&1
```

---

### @debug — Systematic Debugger

**Purpose:** Root cause analysis, systematic debugging with fresh perspective, error reproduction strategies.

**Best for:** When the calling AI's debugging attempts have failed and a fresh perspective is needed.

**Recommended flags:** default permission mode (may need to read and write debug artifacts)

```bash
# Fresh-perspective debugging
claude -p "Debug this error. My analysis so far: [paste context]. Error: [paste error]" \
  --agent debug --output-format text 2>&1

# Root cause analysis
claude -p "Users report intermittent 500 errors on /api/orders. Analyze @src/api/orders.ts and @src/services/order.ts for potential race conditions or unhandled errors." \
  --agent debug --output-format text 2>&1

# Error reproduction
claude -p "This test fails intermittently: [test name]. Analyze @[test file] and suggest reproduction steps." \
  --agent debug --output-format text 2>&1
```

---

### @orchestrate — Multi-Agent Coordinator

**Purpose:** Coordinate multiple Claude Code agents, decompose complex workflows, manage agent pipelines.

**Best for:** Complex tasks that benefit from multiple agent perspectives in sequence.

**Recommended flags:** `--permission-mode plan` (coordination is read-only planning)

```bash
# Coordinate review and testing
claude -p "Coordinate a comprehensive review of the payment module: first explore architecture, then review code, then identify test gaps." \
  --agent orchestrate --permission-mode plan --output-format text 2>&1
```

---

### @deep-research — Evidence Gatherer

**Purpose:** Iterative technical investigation, feasibility analysis, best practices research, comparative analysis.

**Best for:** Gathering evidence for architectural decisions, comparing technologies, assessing feasibility.

```bash
# Technology comparison
claude -p "Compare Redis vs Memcached for our session storage needs. Consider: performance, clustering, persistence, data structures." \
  --agent deep-research --output-format text 2>&1

# Feasibility analysis
claude -p "Assess the feasibility of migrating from REST to GraphQL for @src/api/. Consider codebase size, team impact, and migration path." \
  --agent deep-research --output-format text 2>&1
```

---

### @review — Code Reviewer

**Purpose:** Code review, security audits, architecture review, quality scoring.

**Best for:** Second-opinion code review, security vulnerability detection, architecture quality assessment.

**Recommended flags:** `--permission-mode plan` (review should be read-only)

```bash
# Security review
claude -p "Review @src/auth/ for security vulnerabilities. Check for: XSS, CSRF, injection, auth bypass, insecure defaults." \
  --agent review --permission-mode plan --output-format text 2>&1

# Architecture review
claude -p "Review the overall architecture of src/services/. Assess: coupling, cohesion, separation of concerns, error handling patterns." \
  --agent review --permission-mode plan --output-format text 2>&1

# Quality scoring
claude -p "Score the code quality of @src/utils.ts on: readability (1-10), maintainability (1-10), test coverage potential (1-10), security (1-10)." \
  --agent review --permission-mode plan --output-format text 2>&1
```

---

### @ultra-think — Multi-Strategy Planner

**Purpose:** Multi-strategy planning with diverse reasoning approaches, scored by quality dimensions.

**Best for:** Complex planning tasks that benefit from multiple reasoning strategies evaluated by rubric.

**Recommended flags:** `--permission-mode plan` (planning is read-only), `--model claude-opus-4-6` (deep reasoning)

```bash
# Multi-strategy architecture planning
claude -p "Plan the authentication system redesign. Consider: session-based vs JWT vs OAuth2. Evaluate each strategy across security, scalability, complexity, and team expertise." \
  --agent ultra-think --model claude-opus-4-6 --permission-mode plan --output-format text 2>&1

# Complex migration planning
claude -p "Plan the database migration from MongoDB to PostgreSQL. Evaluate strategies: big-bang, gradual, dual-write. Score each on risk, downtime, complexity, rollback ability." \
  --agent ultra-think --model claude-opus-4-6 --permission-mode plan --output-format text 2>&1
```

---

### @write — Documentation Writer

**Purpose:** Generate technical documentation, READMEs, guides, API documentation.

**Best for:** Creating or updating documentation that follows project conventions.

```bash
# Generate README
claude -p "Generate a comprehensive README.md for this project based on the codebase" \
  --agent write --output-format text 2>&1

# API documentation
claude -p "Generate API documentation for all endpoints in @src/api/" \
  --agent write --output-format text 2>&1

# Technical guide
claude -p "Write a developer onboarding guide for this project" \
  --agent write --output-format text 2>&1
```

<!-- /ANCHOR:agent-details -->

---

<!-- ANCHOR:routing-guide -->

## 5. ROUTING DECISION GUIDE

### Quick Selection

```
What is the primary need?

UNDERSTAND CODE       → @context (with --permission-mode plan)
FIX A BUG            → @debug
REVIEW CODE          → @review (with --permission-mode plan)
PLAN ARCHITECTURE    → @ultra-think (with --model claude-opus-4-6)
RESEARCH A TOPIC     → @deep-research
GENERATE DOCS        → @write
COORDINATE AGENTS    → @orchestrate (with --permission-mode plan)
SPEC PACKET WORK     → Main agent + `/spec_kit:plan --intake-only` or `/spec_kit:plan`
SAVE CONTINUITY      → `/memory:save`
```

### Model + Agent Combinations

| Scenario | Agent | Model | Flags |
|----------|-------|-------|-------|
| Quick code review | `review` | sonnet (default) | `--permission-mode plan` |
| Deep security audit | `review` | `claude-opus-4-6` | `--permission-mode plan --effort high` |
| Architecture planning | `ultra-think` | `claude-opus-4-6` | `--permission-mode plan --effort high` |
| Fast codebase scan | `context` | `claude-haiku-4-5-20251001` | `--permission-mode plan` |
| Research + write | `deep-research` | sonnet (default) | (default) |
| Emergency debugging | `debug` | `claude-opus-4-6` | `--effort high` |

<!-- /ANCHOR:routing-guide -->

---

<!-- ANCHOR:best-practices -->

## 6. BEST PRACTICES

### Do

- **Match agent to task** — Use the routing guide above instead of generic prompts
- **Use `--permission-mode plan`** for all read-only agents (context, review, orchestrate, ultra-think)
- **Include file references** with `@` for targeted analysis instead of broad prompts
- **Capture output** to files for multi-step workflows: `> /tmp/output.txt`
- **Use Opus for deep reasoning** but Sonnet for standard tasks to manage costs
- **Validate all output** before integrating into the calling AI's workflow

### Don't

- **Don't delegate trivial tasks** — CLI overhead isn't worth it for simple questions
- **Don't skip validation** — Claude Code output needs review like any AI output
- **Don't use `--permission-mode bypassPermissions`** without explicit user approval
- **Don't nest Claude Code** — check `$CLAUDECODE` env var before invoking
- **Don't forget `2>&1`** — always capture stderr for error handling
- **Don't ignore costs** — use `--max-budget-usd` for batch operations

<!-- /ANCHOR:best-practices -->
