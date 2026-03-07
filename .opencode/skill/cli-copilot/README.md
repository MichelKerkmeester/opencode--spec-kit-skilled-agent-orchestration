---
title: "cli-copilot"
description: "GitHub Copilot CLI orchestrator for cross-AI task delegation via GitHub's Copilot CLI."
trigger_phrases:
  - "github copilot cli"
  - "cli-copilot"
  - "copilot cli"
---

# cli-copilot

> GitHub Copilot CLI orchestrator enabling external AI assistants (Gemini, Codex, Claude) to invoke GitHub's Copilot CLI for supplementary tasks including multi-model code generation, cloud delegation, repository-wide memory, and automated plan execution.

> **Navigation**:
> - New to Copilot CLI? Start with [Quick Start](#2--quick-start)
> - Need command reference? See [Features](#4--features)
> - Troubleshooting? See [Troubleshooting](#7--troubleshooting)

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. EXAMPLES](#6--examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. RELATED](#8--related)
<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This skill enables external AI assistants (Gemini CLI, Codex CLI, Claude Code, etc.) to invoke GitHub's Copilot CLI for tasks that benefit from its deep GitHub ecosystem integration, multi-model flexibility (GPT-5, Claude, Gemini), and cloud-side task delegation. The calling AI acts as the conductor (planner, validator, integrator) while Copilot CLI executes targeted repository operations.

### Key Statistics

| Category | Value |
|----------|-------|
| Models | `GPT-5.4`, `GPT-5.3-Codex`, `Claude Opus 4.6`, `Claude Sonnet 4.6`, `Gemini 3.1 Pro` |
| Authentication | `GH_TOKEN`, `GITHUB_TOKEN`, or OAuth via `copilot /login` |
| Agent System | Built-in `Explore` and `Task` agents + custom Markdown agents |
| Unique Features | `/delegate` (cloud), plan mode, autopilot, repo memory, MCP support |
| Install | `npm install -g @github/copilot` |

### When to Use

- **Multi-Model Validation** — Verify code logic across GPT-5.4, Claude Opus 4.6, and Gemini 3.1 Pro
- **Cloud Delegation** — Offload long-running tasks to GitHub's cloud via `/delegate`
- **Repository Memory** — Leverage Copilot's native indexing for large-scale codebase queries
- **Autopilot Execution** — Automated multi-step plan fulfillment with self-correction
- **GitHub Ecosystem Integration** — Seamless interaction with PRs, Issues, and Actions
- **Safe Exploration** — Use `plan mode` for read-only analysis and architectural discovery

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

**Check availability and install:**

```bash
# Check if Copilot CLI is installed
command -v copilot || echo "Install: npm install -g @github/copilot"

# Install
npm install -g @github/copilot

# Authenticate — Option A: OAuth (interactive browser flow)
copilot /login

# Authenticate — Option B: Environment variable (CI/CD)
export GITHUB_TOKEN=your-token-here
```

**CRITICAL nesting check:**

```bash
# Copilot CLI should not run recursively in automated flows without guardrails
[ -n "$COPILOT_SESSION" ] && echo "WARNING: Already inside a Copilot session"
```

**Basic invocations:**

```bash
# Non-interactive prompt execution
copilot -p "Explain the authentication flow in @src/auth/" --allow-all-tools 2>&1

# Targeted model execution (GPT-5 Codex)
copilot -p "Refactor this function for performance" --model gpt-5.3-codex --allow-all-tools 2>&1

# Plan mode (read-only analysis)
copilot -p "Map all dependencies of the billing module" --mode plan 2>&1

# Cloud delegation
copilot -p "Run exhaustive security scan and generate report" /delegate 2>&1

# Agent-specific task
copilot -p "Find and fix all memory leaks in the stream processor" --agent task 2>&1
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
cli-copilot/
├── SKILL.md                          # Entry point: routing logic, rules, invocation patterns
├── README.md                         # This file
├── references/
│   ├── cli_reference.md              # CLI flags, commands, models, auth, config
│   ├── agent_delegation.md           # Built-in agents, custom MD agents, routing
│   ├── copilot_tools.md              # Unique capabilities (Autopilot, Delegate, MCP)
│   └── integration_patterns.md       # Cross-AI orchestration patterns
└── assets/
    └── prompt_templates.md           # Copy-paste ready templates for Copilot
```

### Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | AI agent activation triggers, smart routing, rules |
| `references/cli_reference.md` | Complete CLI flags, commands, models, auth, config |
| `references/agent_delegation.md` | Explore/Task agents and custom agent configuration |
| `references/copilot_tools.md` | Unique capabilities and cross-tool comparison |
| `references/integration_patterns.md` | Cross-AI patterns (external AI conducts Copilot) |
| `assets/prompt_templates.md` | Copilot-optimized templates for common tasks |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

**Smart Routing**
- Automatic intent detection for 7 key workflows: CLOUD_DELEGATION, REPO_EXPLORATION, MULTI_MODEL_VALIDATION, PLAN_EXECUTION, AUTOPILOT, MCP_INTEGRATION, REFACTORING
- Context-aware loading of Copilot-specific reference documentation

**Multi-Model Ecosystem**

| Model | ID | Primary Use |
|-------|----|-------------|
| GPT-5.4 | `gpt-5.4` | Frontier reasoning with effort levels |
| GPT-5.3-Codex | `gpt-5.3-codex` | Advanced code generation |
| Claude Opus 4.6 | `claude-opus-4.6` | Architecture and complex logic |
| Claude Sonnet 4.6 | `claude-sonnet-4.6` | General coding and speed |
| Gemini 3.1 Pro | `gemini-3.1-pro-preview` | Large context analysis |

**Execution Modes**

| Mode | Flag/Cmd | Purpose |
|------|----------|---------|
| Plan | `--mode plan` | Analysis, exploration, and read-only reporting |
| Autopilot | `--autopilot` | Multi-step task fulfillment with auto-correction |
| Manual | (default) | Step-by-step approval for every tool call |
| Delegate | `/delegate` | Offload execution to GitHub's cloud infrastructure |

**Agent System**

| Agent | Scope | Description |
|-------|-------|-------------|
| `Explore` | Read-Only | Codebase navigation, dependency mapping, and discovery |
| `Task` | Read/Write | Implementation, refactoring, and bug fixing |
| `Custom` | Variable | Defined via Markdown files in `.github/copilot-agents/` |

**Unique Capabilities**

| Feature | Purpose |
|---------|---------|
| Cloud Delegation | Run intensive tasks on remote GitHub compute via `/delegate` |
| Repo Memory | Persistent indexing of the entire repository for fast retrieval |
| Autopilot | High-autonomy mode for complex, multi-file transformations |
| Multi-Model | Toggle between Anthropic, OpenAI, and Google models in one CLI |
| MCP Support | Integration with Model Context Protocol servers for external data |
| Plan Mode | Structured "think-before-act" phase for complex changes |

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

**Authentication:**

| Method | Setup | Best For |
|--------|-------|----------|
| OAuth | `copilot /login` | Personal/Local development |
| GitHub Token | `export GH_TOKEN=...` | Automation, Scripts, CI/CD |
| GITHUB_TOKEN | (Auto-detected) | GitHub Actions environments |

**Essential flags:**

| Flag | Purpose |
|------|---------|
| `-p "prompt"` | Non-interactive prompt (required for delegation) |
| `--allow-all-tools` | Bypass individual tool confirmations |
| `--model NAME` | Specific model selection (e.g., `gpt-5.3-codex`) |
| `--mode plan` | Read-only analysis mode |
| `--autopilot` | Enable automated plan fulfillment |
| `/delegate` | Invoke cloud-side execution |
| `--agent NAME` | Route to a specific built-in or custom agent |
| `--mcp CONFIG` | Load specific MCP server configurations |

**Context & Guardrails:**
- `.github/copilot-instructions.md` — Repository-specific rules
- `.github/copilot-agents/` — Custom agent definitions
- `.copilotignore` — File exclusion patterns for indexing

**Platform support:** macOS, Linux, Windows (GA Feb 2026).

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

**Multi-model verification cycle:**
```bash
# Step 1: Use GPT-5 to generate initial implementation
copilot -p "Implement a robust circuit breaker in @src/network.ts" --model gpt-5.3-codex --allow-all-tools 2>&1

# Step 2: Use Claude 3.5 to verify and review
copilot -p "Critically review the circuit breaker in @src/network.ts for edge cases" --model claude-sonnet-4.6 --mode plan 2>&1
```

**Cloud-delegated heavy lifting:**
```bash
copilot -p "Migrate the entire frontend from Webpack to Vite and update all configs" /delegate 2>&1
```

**Autopilot repository mapping:**
```bash
copilot -p "Identify all unused exported symbols across the entire project" --mode plan --autopilot 2>&1
```

**Targeted agent execution:**
```bash
copilot -p "Update all API endpoints to include new versioning headers" --agent task --allow-all-tools 2>&1
```

**Integration with External AI (Conductor Pattern):**
```bash
# External AI generates a plan.md
# External AI invokes Copilot to execute the heavy implementation
copilot -p "Apply the implementation plan described in @specs/005-refactor/plan.md" --autopilot --allow-all-tools 2>&1
```

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Solution |
|-------|----------|
| `copilot` not found | `npm install -g @github/copilot` |
| Authentication Error | Run `copilot /login` or verify `GH_TOKEN` validity |
| Delegation Failed | Ensure you have an active Copilot for Business/Enterprise seat |
| Model Not Available | Check model availability for your region/organization |
| Permission Denied | Use `--allow-all-tools` or check local file permissions |
| Indexing Outdated | Force a re-index via `copilot /index-repo` |
| Autopilot Halted | Review plan.md for logical loops or ambiguous instructions |

For detailed troubleshooting, see `references/cli_reference.md` Section 10.

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

- **SKILL.md** — Full routing logic, rules (ALWAYS/NEVER/ESCALATE IF), success criteria
- **cli-claude-code skill** — Anthropic's Claude Code CLI for deep extended thinking
- **cli-gemini skill** — Google Gemini CLI for Google Search grounding
- **sk-code--full-stack** — Full-stack tasks where Copilot provides cloud-delegated execution
- **mcp-code-mode** — Using MCP servers within the Copilot CLI ecosystem
- **External** — [GitHub Copilot Documentation](https://docs.github.com/en/copilot) | [GitHub CLI Repository](https://github.com/github/copilot-cli)

<!-- /ANCHOR:related -->