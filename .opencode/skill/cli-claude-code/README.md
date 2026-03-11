---
title: "cli-claude-code"
description: "Claude Code CLI orchestrator for cross-AI task delegation via Anthropic's Claude Code CLI."
trigger_phrases:
  - "claude code cli"
  - "cli-claude-code"
  - "claude code"
---

# cli-claude-code

> Claude Code CLI orchestrator enabling external AI assistants (Gemini, Codex, Copilot) to invoke Anthropic's Claude Code CLI for supplementary tasks including deep reasoning, code editing, structured output, code review, agent delegation, and extended thinking.

> **Navigation**:
> - New to Claude Code CLI? Start with [Quick Start](#2--quick-start)
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

This skill enables external AI assistants (Gemini CLI, Codex CLI, GitHub Copilot, etc.) to invoke Anthropic's Claude Code CLI for tasks that benefit from deep extended thinking, surgical code editing, schema-validated structured output, agent delegation, or persistent memory context. The calling AI acts as the conductor (planner, validator, integrator) while Claude Code executes targeted tasks.

### Key Statistics

| Category | Value |
|----------|-------|
| Models | `claude-opus-4-6` (deep), `claude-sonnet-4-6` (default), `claude-haiku-4-5-20251001` (fast) |
| Authentication | `ANTHROPIC_API_KEY` or OAuth via `claude auth login` |
| Agent System | 9 specialized agents in `.opencode/agent/*.md` |
| Unique Features | Extended thinking, `--json-schema`, `--permission-mode plan`, `--max-budget-usd` |
| Install | `npm install -g @anthropic-ai/claude-code` |

### When to Use

- **Deep Reasoning** — Extended thinking with chain-of-thought for complex architecture/trade-offs
- **Code Editing** — Surgical diff-based edits with codebase context awareness
- **Structured Output** — JSON schema-validated output via `--json-schema`
- **Code Review** — Second AI perspective on security, architecture, quality
- **Agent Delegation** — Route to specialized agents (review, debug, research, ultra-think)
- **Cost-Controlled Execution** — `--max-budget-usd` for predictable spend

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

**Check availability and install:**

```bash
# Check if Claude Code CLI is installed
command -v claude || echo "Install: npm install -g @anthropic-ai/claude-code"

# Install
npm install -g @anthropic-ai/claude-code

# Authenticate — Option A: API key
export ANTHROPIC_API_KEY=your-key-here

# Authenticate — Option B: OAuth (interactive browser flow)
claude auth login

# Authenticate — Option C: Non-interactive token setup (CI/CD)
claude setup-token
```

**CRITICAL nesting check:**

```bash
# Claude Code cannot run inside another Claude Code session
[ -n "$CLAUDECODE" ] && echo "ERROR: Already inside Claude Code session"
```

**Basic invocations:**

```bash
# Deep reasoning (Opus with extended thinking)
claude -p "Analyze trade-offs between REST and GraphQL for this project" \
  --model claude-opus-4-6 --effort high --output-format text 2>&1

# Code review (read-only safe mode)
claude -p "Review @src/auth.ts for security issues" \
  --permission-mode plan --output-format text 2>&1

# Structured JSON output
claude -p "List all exported functions in src/utils.ts" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}}}' \
  --output-format json 2>&1

# Agent-delegated task
claude -p "Research best practices for OAuth2 PKCE" \
  --agent research --output-format text 2>&1

# Fast classification (Haiku)
claude -p "Is this error a syntax, runtime, or logic error: [paste error]" \
  --model claude-haiku-4-5-20251001 --output-format text 2>&1
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
cli-claude-code/
├── SKILL.md                          # Entry point: routing logic, rules, invocation patterns
├── README.md                         # This file
├── references/
│   ├── cli_reference.md              # CLI flags, commands, models, auth, config
│   ├── agent_delegation.md           # 9 Claude Code agents, routing table, invocation
│   ├── claude_tools.md               # Unique capabilities, 3-way comparison table
│   └── integration_patterns.md       # Cross-AI orchestration patterns (reversed)
└── assets/
    └── prompt_templates.md           # Copy-paste ready templates
```

### Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | AI agent activation triggers, smart routing, rules |
| `references/cli_reference.md` | Complete CLI flags, commands, models, auth, config |
| `references/agent_delegation.md` | 9 agent roster and routing table |
| `references/claude_tools.md` | Unique capabilities and 3-way comparison |
| `references/integration_patterns.md` | Cross-AI patterns (reversed: external AI conducts) |
| `assets/prompt_templates.md` | Copy-paste templates for common tasks |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

**Smart Routing**
- Automatic intent detection scores 7 intents: DEEP_REASONING, CODE_EDITING, STRUCTURED_OUTPUT, REVIEW, AGENT_DELEGATION, TEMPLATES, PATTERNS
- Loads only the reference files relevant to the detected intent

**Three Model Tiers**

| Model | ID | Use Case |
|-------|----|----------|
| Opus | `claude-opus-4-6` | Deep reasoning, complex architecture, extended thinking |
| Sonnet | `claude-sonnet-4-6` | Balanced performance/cost — **default** |
| Haiku | `claude-haiku-4-5-20251001` | Fast classification, formatting, simple queries |

**Permission Modes**

| Mode | Flag | Use For |
|------|------|---------|
| Default | (no flag) | Standard operation with approval prompts |
| Accept edits | `--permission-mode acceptEdits` | Auto-approve file edits only |
| Plan (read-only) | `--permission-mode plan` | Review, analysis, exploration — no writes |
| Bypass | `--permission-mode bypassPermissions` | Full auto-approve — **requires user approval** |

**9 Specialized Agents** (`.opencode/agent/*.md`)

| Agent | Role | Safe Mode |
|-------|------|-----------|
| `context` | Read-only codebase exploration | `--permission-mode plan` |
| `debug` | Systematic debugging, root cause analysis | default |
| `handover` | Session state capture | default |
| `orchestrate` | Multi-agent coordination | `--permission-mode plan` |
| `research` | Evidence gathering, feasibility analysis | default |
| `review` | Code review, security audits | `--permission-mode plan` |
| `speckit` | Spec folder documentation | default |
| `ultra-think` | Multi-strategy planning | `--permission-mode plan` |
| `write` | Documentation generation | default |

**Unique Capabilities**

| Feature | Purpose |
|---------|---------|
| Extended Thinking | Deep chain-of-thought reasoning with `--effort high` |
| `--json-schema` | Schema-validated structured output |
| `--permission-mode plan` | Read-only safe exploration mode |
| `--max-budget-usd` | Cost cap for predictable spend |
| Edit Tool | Surgical diff-based code editing (built-in) |
| Agent Tool | Spawn focused subagents (built-in) |
| Skills System | On-demand specialized workflows |
| Spec Kit Memory | Persistent structured context via MCP |
| Hooks | Pre/post tool-call automation configured in settings |
| Session continuity | `--continue` / `--resume SESSION_ID` |

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

**Authentication:**

| Method | Setup | Best For |
|--------|-------|----------|
| API Key | `export ANTHROPIC_API_KEY=your-key` | Scripts, CI/CD |
| OAuth | `claude auth login` | Personal use (browser flow) |
| Token setup | `claude setup-token` | Non-interactive CI/CD |

**Essential flags:**

| Flag | Purpose |
|------|---------|
| `-p "prompt"` | Non-interactive mode (required) |
| `--output-format text` | Plain text output (default) |
| `--output-format json` | JSON with metadata |
| `--output-format stream-json` | Streaming JSON for real-time processing |
| `--model claude-sonnet-4-6` | Model selection |
| `--permission-mode plan` | Read-only safe mode |
| `--json-schema '{...}'` | Schema-validated output |
| `--max-budget-usd N` | Cost cap |
| `--agent NAME` | Agent routing |
| `--continue` | Continue last conversation |
| `--resume ID` | Resume specific session |

**Context hierarchy (CLAUDE.md):**
- `~/.claude/CLAUDE.md` — Global instructions
- `PROJECT_ROOT/CLAUDE.md` — Project instructions
- `SUBDIR/CLAUDE.md` — Local instructions (additive)

**Platform support:** macOS (full), Linux (full), Windows (experimental).

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

**Deep reasoning with Opus:**
```bash
claude -p "Analyze the trade-offs between event sourcing and CRUD for our order management system. Consider: consistency, complexity, team expertise, query patterns." \
  --model claude-opus-4-6 --effort high --output-format text 2>&1
```

**Cross-AI code review:**
```bash
claude -p "Review @src/auth.ts for security vulnerabilities. Check for XSS, injection, and auth bypasses." \
  --permission-mode plan --output-format text 2>&1
```

**Structured output with schema:**
```bash
claude -p "Analyze src/api/ and return all endpoint definitions" \
  --json-schema '{"type":"object","properties":{"endpoints":{"type":"array","items":{"type":"object","properties":{"method":{"type":"string"},"path":{"type":"string"},"handler":{"type":"string"}}}}}}' \
  --output-format json 2>&1
```

**Agent-delegated research:**
```bash
claude -p "Research the latest security advisories for Express.js middleware" \
  --agent research --output-format text 2>&1
```

**Cost-controlled background task:**
```bash
claude -p "Generate comprehensive Jest tests for @src/utils.ts" \
  --max-budget-usd 0.50 --output-format text 2>&1 &
```

**Fast classification with Haiku:**
```bash
claude -p "Classify these 20 error messages by category (syntax/runtime/logic/config)" \
  --model claude-haiku-4-5-20251001 --output-format text 2>&1
```

**Generate-Review-Fix cycle (external AI conducts):**
```bash
# Step 1: External AI generates code, saves to /tmp/generated.ts

# Step 2: Claude Code reviews
claude -p "Review @/tmp/generated.ts for bugs, security issues, and style violations" \
  --permission-mode plan --output-format text 2>&1 > /tmp/review.md

# Step 3: External AI reads review, applies fixes
```

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Solution |
|-------|----------|
| `claude` not found | `npm install -g @anthropic-ai/claude-code` |
| `ANTHROPIC_API_KEY` not set | `export ANTHROPIC_API_KEY=your-key` or run `claude auth login` |
| Nested session error | Cannot run `claude` inside Claude Code — exit or use different terminal |
| Rate limit exceeded | Wait for auto-retry; reduce request frequency |
| Budget cap hit | Increase `--max-budget-usd` or simplify prompt |
| Permission denied | Match `--permission-mode` to task requirements |
| Context too large | Specify files with `@` explicitly rather than broad prompts |
| Agent not found | Verify agent name matches `.opencode/agent/` directory |

For detailed troubleshooting, see `references/cli_reference.md` Section 12.

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

- **SKILL.md** — Full routing logic, rules (ALWAYS/NEVER/ESCALATE IF), success criteria
- **cli-gemini skill** — Google Gemini CLI for Google Search grounding and cross-AI validation
- **cli-codex skill** — OpenAI Codex CLI for sandbox execution and cross-AI validation
- **sk-code--web** — Web development where Claude Code provides deep reasoning
- **sk-code--full-stack** — Full-stack tasks with Claude Code architecture analysis
- **External** — [Claude Code GitHub](https://github.com/anthropics/claude-code) | [Anthropic Console](https://console.anthropic.com/settings/keys)

<!-- /ANCHOR:related -->
