---
title: "GitHub Copilot CLI Agent Delegation Reference"
description: "Reference for delegating tasks to built-in and custom GitHub Copilot CLI agents via the conductor/executor orchestration model."
---

# GitHub Copilot CLI Agent Delegation Reference

Routing reference for delegating tasks from external AI assistants to specialized GitHub Copilot CLI agents.

---

## 1. OVERVIEW

### Core Principle

The calling AI decides WHAT to do, GitHub Copilot CLI decides HOW to do it within the delegated scope.

### Purpose

Documents the built-in and custom GitHub Copilot CLI agents and how external AI assistants orchestrate them. The calling AI acts as the **conductor** (planner, validator, integrator) while Copilot executes targeted tasks as the **executor**.

### When to Use

- Delegating supplementary implementation or analysis tasks to Copilot agents.
- Offloading high-compute tasks to GitHub's cloud Copilot coding agent via delegation.
- Using specialized custom profiles for domain-specific expertise.
- Codebase exploration in read-only mode via `@Explore`.
- Task-oriented execution with tool access via `@Task`.

---

## 2. ORCHESTRATION MODEL

```
Calling AI (CONDUCTOR)
  |
  |-- Analyzes task, selects Copilot agent
  |-- Constructs copilot CLI command with prompt
  |-- Delegates via Bash/shell execution
  |
  v
GitHub Copilot CLI (EXECUTOR)
  |
  |-- Loads agent definition (built-in or custom profile)
  |-- Loads codebase context and tool permissions
  |-- Executes task (local or cloud via /delegate)
  |-- Returns output to stdout
  |
  v
Calling AI (CONDUCTOR)
  |
  |-- Validates output quality and relevance
  |-- Integrates findings into its own workflow
  |-- Decides next step (accept, iterate, delegate elsewhere)
```

### Invocation Pattern

Copilot agents are invoked using the `-p` (prompt) flag. Agent roles are specified using the `@` prefix within the prompt string. For custom agents, user-defined Markdown profiles are used.

```bash
# Built-in agent delegation (Explore - Read-only)
copilot -p "As @Explore: Review src/auth.ts for security issues" --allow-all-tools 2>&1

# Built-in agent delegation (Task - Read-write)
copilot -p "As @Task: Implement the login handler in src/auth.ts" --allow-all-tools 2>&1

# Cloud delegation (Explicit command)
copilot -p "/delegate Plan the authentication redesign with multi-strategy analysis" --allow-all-tools 2>&1

# Cloud delegation (Prefix shortcut)
copilot -p "&Implement the new API gateway" --allow-all-tools 2>&1

# Custom agent profile
copilot -p "As @SecurityExpert: Audit the storage layer" --allow-all-tools 2>&1

# Capture output to file
copilot -p "As @Explore: Map the dependency graph for src/" --allow-all-tools 2>&1 > /tmp/context-map.txt
```

### Agent Definition Structure

Copilot CLI supports built-in agents and custom profiles defined in Markdown. Custom profiles specify expertise, instructions, and tool permissions.

```
.github/copilot/
├── profiles/
│   ├── security-expert.md    # Domain-specific custom profile
│   └── architect.md         # Architecture-focused profile
```

---

## 3. COPILOT CLI AGENT CATALOG

### Agent Roster

| Agent | Permission Mode | Purpose | Use When |
|-------|-----------------|---------|----------|
| `@Explore` | Read-only | Codebase exploration, file discovery, pattern analysis | You need to understand code structure, dependencies, or patterns without making changes |
| `@Task` | Read-write | Task execution, code generation, file modification | You need to implement features, fix bugs, or perform refactoring |
| `Cloud (@copilot)` | Remote | Remote high-compute execution via GitHub's cloud agent | Complex reasoning, large-scale changes, or when local compute is insufficient (use `/delegate` or `&`) |
| `[Custom]` | Profile-defined | Domain-specific expertise and restricted tool sets | Specialized tasks (e.g., `@SecurityExpert`, `@DatabaseAdmin`) |

---

## 4. AGENT DETAILS

### @Explore — Codebase Explorer

**Purpose:** Read-only codebase exploration, file discovery, dependency mapping, pattern analysis.

**Best for:** Understanding unfamiliar code, mapping cross-file dependencies, creating architecture overviews.

```bash
# Map project architecture
copilot -p "As @Explore: Analyze the architecture of this project. Identify key modules and entry points." --allow-all-tools 2>&1

# Find patterns
copilot -p "As @Explore: Find all authentication-related files and describe the auth flow" --allow-all-tools 2>&1
```

---

### @Task — Task Executor

**Purpose:** Task execution, code generation, file modification, and bug fixing.

**Best for:** Implementation tasks where read-write access to the codebase is required.

```bash
# Feature implementation
copilot -p "As @Task: Implement a new JWT validation middleware in src/middleware/auth.ts" --allow-all-tools 2>&1

# Bug fixing
copilot -p "As @Task: Fix the race condition in the order processing service" --allow-all-tools 2>&1
```

---

### Cloud Delegation — Remote Agent

**Purpose:** Pushes tasks to GitHub's cloud-based Copilot coding agent for high-compute or long-running tasks.

**Best for:** Complex reasoning, architectural planning, or large-scale refactoring.

**Invocation:** Use the `/delegate` command or `&` prefix.

```bash
# Planning via cloud agent
copilot -p "/delegate Plan the migration from REST to GraphQL" --allow-all-tools 2>&1

# Implementation via cloud agent
copilot -p "&Refactor the entire data access layer to use Prisma" --allow-all-tools 2>&1
```

---

### [Custom Agents] — Specialized Profiles

**Purpose:** Custom-defined agents with specific instructions and tool constraints.

**Best for:** Enforcing specific standards, domain-specific tasks, or restricted environments.

```bash
# Use a custom security profile
copilot -p "As @SecurityExpert: Audit the new encryption module" --allow-all-tools 2>&1
```

---

## 5. ROUTING DECISION GUIDE

### Quick Selection

```
What is the primary need?

UNDERSTAND CODE       → @Explore
IMPLEMENT/FIX        → @Task
COMPLEX REASONING    → Cloud Delegation (/delegate or &)
SPECIALIZED EXPERTISE → [Custom Agent] (e.g., @SecurityExpert)
SPEC PACKET WORK     → Main agent + `/spec_kit:plan --intake-only` or `/spec_kit:plan`
SAVE CONTINUITY      → `/memory:save`
```

### Model + Agent Combinations

GitHub Copilot CLI supports multiple models (Anthropic, OpenAI, Google). The conductor can specify the model if supported by the CLI configuration.

| Scenario | Agent | Model Recommendation |
|----------|-------|----------------------|
| Quick code review | `@Explore` | Balanced (e.g., Claude Sonnet 4.6 / GPT-5.3-Codex) |
| Deep security audit | `@Explore` / `Cloud` | High-reasoning (e.g., GPT-5.4 / Claude Opus 4.6) |
| Architecture planning | `Cloud` | High-reasoning (e.g., GPT-5.4 / Claude Opus 4.6) |
| Fast codebase scan | `@Explore` | Fast (e.g., Claude Sonnet 4.6 / Gemini 3.1 Pro) |

---

## 6. SPEC-PACKET GOVERNANCE

When a Copilot delegation targets spec folder documentation (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`), the conductor must propagate the distributed-governance guardrails to GPT-5.4 / autopilot before invoking `@Task`, `@copilot` cloud, or any custom profile. Copilot has no exclusive `@speckit` agent — any agent writing spec docs inherits the same contract as every other runtime.

### Distributed-Governance Rule

The calling AI must ensure **three guardrails ride with every spec-doc write**, regardless of which Copilot agent holds the pen:

1. **Template-first** — All spec-doc writes use canonical templates under `.opencode/skill/system-spec-kit/templates/level_N/`. The conductor cites the target template in the prompt and forbids freehand rewrites of frontmatter, anchors, or table-of-contents scaffolding.
2. **Validate each write** — Immediately after any spec-doc write, run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`. Treat non-zero exit as a blocker; Copilot must fix the underlying issue (no `--no-verify`, no skip flags) before the conductor integrates the output.
3. **Continuity via `/memory:save`** — Route all continuity updates through `/memory:save` (or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`). Never let Copilot hand-author standalone continuity artifacts under `memory/`. `_memory.continuity` frontmatter blocks inside `implementation-summary.md` may be edited directly for doc-local continuity hints; everything else goes through the save script for DB indexing and embedding generation.

### Intake Lane

For fresh or repair-mode spec folders, route Copilot through the canonical intake instead of bespoke template copy:

```bash
# Conductor delegates only after main agent runs intake
copilot -p "As @Task: Fill plan.md sections 4-7 in specs/###-feature-name/ using the level_3 plan template. Do not touch frontmatter, TOC, or anchors. After write, run validate.sh --strict." --allow-all-tools 2>&1
```

The main agent (calling AI) runs `/spec_kit:plan --intake-only` to publish the canonical trio (`spec.md` + `description.json` + `graph-metadata.json`) via the shared intake contract at `.opencode/skill/system-spec-kit/references/intake-contract.md`. Only after the trio exists should Copilot agents be delegated doc-fill or doc-update work.

### Delegation Prompt Pattern

Every Copilot spec-doc delegation must embed the governance trio explicitly:

```bash
copilot -p "As @Task in <spec-folder>: [scope]. Rules: (1) use templates from .opencode/skill/system-spec-kit/templates/level_N/; (2) run validate.sh --strict after each file write and abort on non-zero exit; (3) do not author memory/ artifacts — continuity flows through /memory:save. Stay inside listed files only." --allow-all-tools 2>&1
```

### Cloud Delegation Caveat

`/delegate` and `&` cloud invocations must carry the same trio in the prompt body. The cloud agent has no implicit access to runtime CLAUDE.md, GEMINI.md, or .codex/ configs — explicit governance restatement is mandatory.

---

## 7. BEST PRACTICES

### Do

- **Match agent to task** — Use `@Explore` for discovery and `@Task` for changes.
- **Use Cloud Delegation for scale** — Leverage `/delegate` for complex architectural tasks.
- **Validate all output** — Conductors must review Copilot's output before integration.
- **Capture output** — Use redirection `> /tmp/output.txt` for multi-step workflows.
- **Include specific context** — Refer to specific files or directories in the prompt for better accuracy.

### Don't

- **Don't use @Task for discovery** — Prevent accidental modifications during analysis.
- **Don't skip validation** — Never assume the executor's output is perfect without verification.
- **Don't delegate trivial tasks** — CLI overhead is inefficient for simple questions.
- **Don't ignore tool permissions** — Ensure the calling environment allows the necessary operations.
