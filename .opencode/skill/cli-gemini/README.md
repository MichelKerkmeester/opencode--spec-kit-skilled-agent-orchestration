---
title: "cli-gemini"
description: "Gemini CLI orchestrator for cross-AI task delegation via Google's Gemini CLI."
trigger_phrases:
  - "gemini cli"
  - "cli-gemini"
  - "gemini"
---

# cli-gemini

> Gemini CLI orchestrator enabling any AI assistant to invoke Google's Gemini CLI for supplementary AI tasks including code generation, web research via Google Search grounding, codebase architecture analysis, cross-AI validation, and parallel task processing.

> **Navigation**:
> - New to Gemini CLI? Start with [Quick Start](#2--quick-start)
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

This skill orchestrates Google's Gemini CLI for tasks that benefit from a second AI perspective, real-time web search, deep codebase architecture analysis, or parallel code generation. The calling AI acts as the conductor (planner, validator, integrator) while Gemini CLI executes targeted tasks.

### Key Statistics

| Category | Value |
|----------|-------|
| Model | `gemini-3.1-pro-preview` (only supported model) |
| Authentication | Google OAuth, API key, or Vertex AI |
| Agent System | 9 specialized agents in `.gemini/agents/` |
| Unique Tools | `google_web_search`, `codebase_investigator`, `save_memory` |
| Install | `npm install -g @google/gemini-cli` |

### When to Use

- **Cross-AI Validation** — Second perspective on code review, security audit, bug detection
- **Google Search Grounding** — Current internet information, latest versions, API changes
- **Codebase Architecture Analysis** — Dependency mapping, architecture documentation
- **Parallel Task Processing** — Background generation while the calling AI continues other work
- **Agent-Delegated Tasks** — Route to specialized Gemini agents for domain expertise

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

**Check availability and install:**

```bash
# Check if Gemini CLI is installed
command -v gemini || echo "Install: npm install -g @google/gemini-cli"

# Install
npm install -g @google/gemini-cli

# First-time authentication (interactive)
gemini
```

**Basic invocations:**

```bash
# Code review (second opinion)
gemini "Review @./src/auth.ts for security issues" -o text

# Web research (Google Search grounding)
gemini "What's new in Next.js 15? Use Google Search." -o text

# Architecture analysis
gemini "Use codebase_investigator to analyze this project" -o text

# Explicit model
gemini "Analyze this code" -m gemini-3.1-pro-preview -o text
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
cli-gemini/
├── SKILL.md                          # Entry point: routing logic, rules, invocation patterns
├── README.md                         # This file
├── references/
│   ├── cli_reference.md              # CLI flags, commands, config, troubleshooting
│   ├── agent_delegation.md           # 9 Gemini agents, routing table, invocation
│   ├── gemini_tools.md               # Built-in tools comparison with Claude Code
│   └── integration_patterns.md       # Cross-AI orchestration patterns
└── assets/
    └── prompt_templates.md           # Copy-paste ready templates
```

### Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | AI agent activation triggers, smart routing, rules |
| `references/cli_reference.md` | Complete CLI flag and command reference |
| `references/agent_delegation.md` | 9 Gemini agent roster and routing table |
| `references/gemini_tools.md` | Built-in tools (google_web_search, codebase_investigator) |
| `references/integration_patterns.md` | Cross-AI patterns (Generate-Review-Fix, background exec) |
| `assets/prompt_templates.md` | Copy-paste templates for common tasks |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

**Smart Routing**
- Automatic intent detection scores 7 intents: GENERATION, REVIEW, RESEARCH, ARCHITECTURE, AGENT_DELEGATION, TEMPLATES, PATTERNS
- Loads only the reference files relevant to the detected intent

**Single Model**
- `gemini-3.1-pro-preview` for all tasks — no model selection complexity

**9 Specialized Agents**

| Agent | Role | Modifies Files |
|-------|------|----------------|
| `@context` | Read-only codebase exploration | Never |
| `@debug` | Fresh-perspective debugging | Yes (fixes) |
| `@handover` | Session state capture | Yes (handover.md) |
| `@orchestrate` | Multi-agent coordination | Never |
| `@deep-research` | Iterative evidence gathering + web search | Yes (research.md) |
| `@review` | Code review, quality scoring | Never |
| `@speckit` | Spec folder documentation | Yes (spec docs) |
| `@ultra-think` | Multi-strategy planning | Never |
| `@write` | Documentation generation + web search | Yes (docs) |

**Unique Capabilities**

| Tool | Purpose |
|------|---------|
| `google_web_search` | Real-time Google Search with native integration |
| `codebase_investigator` | Holistic architecture analysis (leverages 1M+ token context) |
| `save_memory` | Cross-session persistent memory |
| `browser_agent` | Web automation via accessibility tree (experimental) |

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

**Authentication** (priority order):

| Method | Setup | Best For |
|--------|-------|----------|
| API Key | `export GEMINI_API_KEY=your-key` | Scripts, CI/CD |
| OAuth | Run `gemini` and follow browser prompt | Personal use |
| Vertex AI | `export GOOGLE_CLOUD_PROJECT=project-id` | Enterprise |

**Essential flags:**

| Flag | Purpose |
|------|---------|
| `-o text` | Human-readable output (default) |
| `-o json` | Structured output with stats |
| `-m gemini-3.1-pro-preview` | Explicit model selection |
| `--yolo` / `-y` | Auto-approve tool calls (requires user approval) |

**Context files:**
- `GEMINI.md` — Project context loaded automatically (global, workspace, JIT)
- `.geminiignore` — Exclude files from Gemini's context (gitignore syntax)
- `settings.json` — Cascading config: system → user → project

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

**Cross-AI code review:**
```bash
gemini "Review @./src/auth.ts for security vulnerabilities. Check for XSS, injection, and auth bypasses." -o text
```

**Web research:**
```bash
gemini "Use Google Search to find the latest security advisories for Express.js as of March 2026." -o text
```

**Agent-delegated architecture analysis:**
```bash
gemini "As @context agent: Map all authentication-related files and their dependencies" -o json
```

**Background task:**
```bash
gemini "Generate comprehensive Jest tests for @./src/utils.ts" --yolo -o text > /tmp/tests.ts 2>&1 &
```

**Generate-Review-Fix cycle:**
```bash
# Step 1: Gemini generates
gemini "Create a rate limiter middleware for Express" -o text -m gemini-3.1-pro-preview > /tmp/rate-limiter.ts

# Step 2: Calling AI reviews (within session), writes review to /tmp/review.md

# Step 3: Gemini fixes
gemini "Fix these issues: $(cat /tmp/review.md)" @/tmp/rate-limiter.ts -o text > /tmp/rate-limiter-v2.ts
```

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Solution |
|-------|----------|
| `gemini` not found | `npm install -g @google/gemini-cli` |
| `GEMINI_API_KEY not set` | `export GEMINI_API_KEY=your-key` or run `gemini` for OAuth |
| `429 Too Many Requests` | Wait for auto-retry; add delays between scripted calls |
| Auth expired | Run `gemini` interactively to re-authenticate |
| Context too large | Use `.geminiignore` or specify files with `@` explicitly |
| Agent not found | Verify agent name matches `.gemini/agents/` directory |
| Slow responses | Use `/compress`, reduce `@` references |

For detailed troubleshooting, see `references/cli_reference.md` Section 12.

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

- **SKILL.md** — Full routing logic, rules (ALWAYS/NEVER/ESCALATE IF), success criteria
- **cli-codex skill** — Parallel cross-AI validation via OpenAI's Codex CLI
- **sk-code--web** — Web development where Gemini provides second opinions
- **sk-code--full-stack** — Full-stack tasks with Gemini architecture analysis
- **External** — [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli) | [Google AI Studio](https://aistudio.google.com/apikey)

<!-- /ANCHOR:related -->
