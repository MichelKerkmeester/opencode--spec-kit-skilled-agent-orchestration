---
title: "cli-codex"
description: "Codex CLI orchestrator for cross-AI task delegation via OpenAI's Codex CLI."
trigger_phrases:
  - "codex cli"
  - "cli-codex"
  - "codex"
---

# cli-codex

> Codex CLI orchestrator enabling any AI assistant to invoke OpenAI's Codex CLI for supplementary AI tasks including code generation, code review, web research, codebase analysis, cross-AI validation, and parallel task processing.

> **Navigation**:
> - New to Codex CLI? Start with [Quick Start](#2--quick-start)
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

This skill orchestrates OpenAI's Codex CLI for tasks that benefit from a second AI perspective, sandbox-controlled code generation, built-in code review workflows, live web search, or parallel task processing. The calling AI acts as the conductor (planner, validator, integrator) while Codex CLI executes targeted tasks.

### Key Statistics

| Category | Value |
|----------|-------|
| Models | `GPT-5.4` (frontier reasoning) + `GPT-5.3-Codex` (code generation) |
| Authentication | `OPENAI_API_KEY` or ChatGPT OAuth |
| Agent System | 9 specialized agents in `.codex/agents/*.toml` |
| Unique Features | `/review` command, `--search`, session resume/fork, `--image` |
| Install | `npm i -g @openai/codex` |

### When to Use

- **Cross-AI Validation** — Second perspective on code review, security audit, bug detection
- **Built-in Code Review** — `/review` command for diff-aware review of staged changes
- **Web Research** — `--search` flag enables live web browsing during tasks
- **Parallel Task Processing** — Background generation while the calling AI continues other work
- **Agent-Delegated Tasks** — Route to specialized Codex agents via `.codex/agents/*.toml`
- **Visual Input** — `--image` flag for screenshot-to-code and design implementation

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

**Check availability and install:**

```bash
# Check if Codex CLI is installed
command -v codex || echo "Install: npm i -g @openai/codex"

# Install
npm i -g @openai/codex

# Authenticate — Option A: API key
export OPENAI_API_KEY=your-key-here

# Authenticate — Option B: ChatGPT OAuth
codex login
```

**Basic invocations:**

```bash
# Code review with frontier reasoning (GPT-5.4)
codex exec "Review @./src/auth.ts for security issues" --model gpt-5.4 --sandbox read-only

# Code generation with code-focused model (GPT-5.3-Codex)
codex exec "Create a rate limiter middleware for Express" --model gpt-5.3-codex --sandbox workspace-write

# Web research
codex exec "What's new in Next.js 15?" --model gpt-5.3-codex --search --sandbox read-only

# Profile-based task delegation
codex exec -p research "Research latest Express.js security advisories" --model gpt-5.4 --search
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
cli-codex/
├── SKILL.md                          # Entry point: routing logic, rules, invocation patterns
├── README.md                         # This file
├── references/
│   ├── cli_reference.md              # CLI flags, subcommands, sandbox modes, config
│   ├── agent_delegation.md           # 9 Codex agents, routing table, invocation
│   ├── codex_tools.md                # Built-in capabilities comparison with Claude Code
│   └── integration_patterns.md       # Cross-AI orchestration patterns
└── assets/
    └── prompt_templates.md           # Copy-paste ready templates
```

### Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | AI agent activation triggers, smart routing, rules |
| `references/cli_reference.md` | Complete CLI subcommands, flags, sandbox modes |
| `references/agent_delegation.md` | 9 Codex agent roster and routing table |
| `references/codex_tools.md` | Built-in capabilities (/review, --search, MCP, sessions) |
| `references/integration_patterns.md` | Cross-AI patterns (Generate-Review-Fix, background exec) |
| `assets/prompt_templates.md` | Copy-paste templates for common tasks |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

**Smart Routing**
- Automatic intent detection scores 7 intents: GENERATION, REVIEW, RESEARCH, ARCHITECTURE, AGENT_DELEGATION, TEMPLATES, PATTERNS
- Loads only the reference files relevant to the detected intent

**Dual Model Support**

| Model | ID | Use Case |
|-------|----|----------|
| GPT-5.4 | `gpt-5.4` | Frontier reasoning, complex analysis, architecture, security |
| GPT-5.3-Codex | `gpt-5.3-codex` | Code generation, standard review, implementation, docs |

Decision: reasoning-heavy tasks → GPT-5.4; code-focused tasks → GPT-5.3-Codex

**Sandbox Modes**

| Mode | Flag | Use For |
|------|------|---------|
| Read-only | `--sandbox read-only` | Review, analysis, research |
| Workspace write | `--sandbox workspace-write` | Code generation, bug fixes, docs |
| Full access | `--sandbox danger-full-access` | Requires explicit user approval |

**9 Specialized Agents** (`.codex/agents/*.toml`)

| Agent | Role | Sandbox |
|-------|------|---------|
| `context` | Read-only codebase exploration | read-only |
| `debug` | Systematic debugging | workspace-write |
| `handover` | Session state capture | workspace-write |
| `orchestrate` | Multi-agent coordination | read-only |
| `research` | Evidence gathering | workspace-write |
| `review` | Code review, quality scoring | read-only |
| `speckit` | Spec folder documentation | workspace-write |
| `ultra-think` | Multi-strategy planning | read-only |
| `write` | Documentation generation | workspace-write |

**Unique Capabilities**

| Feature | Purpose |
|---------|---------|
| `/review` command | Diff-aware code review in TUI (staged changes, commits, branches) |
| `--search` flag | Live web browsing integrated into reasoning |
| `codex mcp` | Connect to Model Context Protocol servers |
| `codex resume` | Continue a previous Codex session |
| `codex fork` | Branch from an existing session |
| `--image` / `-i` | Attach screenshots or designs as visual input |
| `codex cloud` | Remote task execution |

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

**Authentication:**

| Method | Setup | Best For |
|--------|-------|----------|
| API Key | `export OPENAI_API_KEY=your-key` | Scripts, CI/CD |
| ChatGPT OAuth | `codex login` | Personal use (Plus/Pro/Business/Edu/Enterprise) |

**Essential flags:**

| Flag | Purpose |
|------|---------|
| `--model gpt-5.3-codex` | Model selection (always include) |
| `--sandbox read-only` | Safe mode for review/analysis |
| `--sandbox workspace-write` | Allow file writes in workspace |
| `--search` | Enable live web browsing |
| `--image` / `-i` | Attach image input |
| `--full-auto` | Low-friction mode (requires user approval) |

**Configuration files:**
- `.codex/config.toml` — MCP servers, agent definitions
- `.codex/agents/*.toml` — Agent-specific configs (sandbox, reasoning, instructions)
- `instructions.md` — Project context loaded automatically

**Platform support:** macOS (full), Linux (full), Windows (experimental, WSL required).

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

**Cross-AI code review (GPT-5.4 for deep analysis):**
```bash
codex exec "Review @./src/auth.ts for security vulnerabilities. Check for XSS, injection, and auth bypasses." \
  --model gpt-5.4 --sandbox read-only
```

**Web research:**
```bash
codex exec "Search the web for the latest security advisories for Express.js as of March 2026." \
  --model gpt-5.3-codex --search --sandbox read-only
```

**Profile-based architecture analysis (GPT-5.4 for reasoning):**
```bash
codex exec -p context "Map all authentication-related files and their dependencies" \
  --model gpt-5.4
```

**Background task:**
```bash
codex exec "Generate comprehensive Jest tests for @./src/utils.ts" \
  --model gpt-5.3-codex --sandbox workspace-write > /tmp/tests.ts 2>&1 &
```

**Generate-Review-Fix cycle:**
```bash
# Step 1: Codex generates
codex exec "Create a rate limiter middleware for Express" \
  --model gpt-5.3-codex --sandbox workspace-write > /tmp/rate-limiter.ts

# Step 2: Calling AI reviews (within session), writes review to /tmp/review.md

# Step 3: Codex fixes
codex exec "Fix these issues: $(cat /tmp/review.md). Source: $(cat /tmp/rate-limiter.ts)" \
  --model gpt-5.3-codex --sandbox workspace-write > /tmp/rate-limiter-v2.ts
```

**Design-to-code with image:**
```bash
codex exec "Implement this UI component based on the attached design" \
  --model gpt-5.3-codex -i design.png --sandbox workspace-write
```

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Solution |
|-------|----------|
| `codex` not found | `npm i -g @openai/codex` |
| `OPENAI_API_KEY` not set | `export OPENAI_API_KEY=your-key` or run `codex login` |
| Rate limit exceeded | Wait for auto-retry; add delays between scripted calls |
| Auth expired | Run `codex login` to re-authenticate |
| Sandbox violation | Match `--sandbox` level to task requirements |
| Context too large | Specify files with `@` explicitly rather than broad prompts |
| Agent not found | Verify agent name matches `.codex/agents/` directory |
| Windows issues | Use WSL; PowerShell/Git Bash not supported |

For detailed troubleshooting, see `references/cli_reference.md` Section 13.

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

- **SKILL.md** — Full routing logic, rules (ALWAYS/NEVER/ESCALATE IF), success criteria
- **cli-gemini skill** — Parallel cross-AI validation via Google's Gemini CLI
- **sk-code--web** — Web development where Codex provides second opinions
- **sk-code--full-stack** — Full-stack tasks with Codex architecture analysis
- **External** — [Codex CLI GitHub](https://github.com/openai/codex) | [OpenAI Platform](https://platform.openai.com/api-keys)

<!-- /ANCHOR:related -->
