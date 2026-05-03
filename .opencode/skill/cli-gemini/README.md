---
title: "Gemini CLI Orchestrator"
description: "Cross-AI task delegation to Google's Gemini CLI for web research via Google Search, codebase architecture analysis, and parallel task processing."
trigger_phrases:
  - "gemini cli"
  - "gemini"
  - "delegate to gemini"
  - "google search"
  - "web research"
---

# Gemini CLI Orchestrator

> Delegate tasks from any AI assistant to Google's Gemini CLI for real-time web research, deep architecture analysis, and parallel code generation.

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

This skill lets any AI assistant invoke Google's Gemini CLI for tasks that benefit from real-time web information, deep codebase analysis, or a second AI perspective. The calling AI stays the conductor, delegating specific jobs to Gemini and integrating the results.

Gemini CLI is Google's open-source terminal AI agent powered by one model: `gemini-3.1-pro-preview`. What it lacks in model variety, it makes up for with three built-in tools that no other CLI provides natively. `google_web_search` grounds responses in live Google Search results. `codebase_investigator` performs deep architecture analysis by mapping file relationships and dependency graphs. And `save_memory` persists context across sessions.

The CLI runs on Google's free tier (60 requests/minute, 1000 requests/day), making it accessible without paid subscriptions. For higher throughput, API key or Vertex AI authentication options are available.

When Gemini hands work back into a Spec Kit packet, `/spec_kit:resume` remains the canonical recovery surface. Packet continuity still rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay supporting only.

The skill includes a self-invocation guard: if you are already running inside Gemini CLI, activation is blocked to prevent circular delegation.

### Key Statistics

| Category | Value | Details |
|----------|-------|---------|
| **Models** | 1 | gemini-3.1-pro-preview |
| **Built-in Tools** | 3 | google_web_search, codebase_investigator, save_memory |
| **Free Tier** | 60 req/min, 1000 req/day | Google OAuth authentication |
| **Context Window** | 1M+ tokens | Largest context of any CLI agent |
| **References** | 4 | cli_reference, gemini_tools, agent_delegation, integration_patterns |
| **Version** | 1.2.1 | |

### How This Compares

| Capability | Claude Code CLI | Codex CLI | Copilot CLI | Gemini CLI |
|------------|-----------------|-----------|-------------|------------|
| **Web search** | No | `--search` (browsing) | No | Google Search grounding (native tool) |
| **Architecture analysis** | Agent-based | Manual | Explore agent | `codebase_investigator` (native tool) |
| **Context window** | Standard | Standard | Standard | 1M+ tokens |
| **Cost** | API key required | API key or OAuth | Subscription | Free tier available |
| **Open source** | No | No | No | Yes (Apache 2.0) |
| **Models** | 3 (Anthropic) | 2 (OpenAI) | 5 (3 providers) | 1 (Google) |

### Key Features at a Glance

| Feature | What It Does |
|---------|-------------|
| **Google Search Grounding** | Real-time web search results integrated into responses via `google_web_search` |
| **Codebase Investigator** | Deep architecture analysis mapping file relationships and dependencies |
| **Save Memory** | Persistent cross-session context via `save_memory` tool |
| **1M+ Context** | Process entire codebases without chunking or summarization |
| **Free Tier** | 60 req/min and 1000 req/day with Google OAuth, no API key required |
| **Open Source** | Apache 2.0 licensed, community-extensible |
| **Spec Kit handoff** | Return packet recovery through `/spec_kit:resume` with packet docs as the continuity source |

### Requirements

| Requirement | Value | Notes |
|-------------|-------|-------|
| **CLI** | `@google/gemini-cli` | Install via `npm install -g @google/gemini-cli` |
| **Auth** | Google OAuth (free) | Or `GEMINI_API_KEY` or Vertex AI for enterprise |
| **Node.js** | 18+ | Required for npm installation |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 1. Verify Installation

```bash
command -v gemini || echo "Not installed. Run: npm install -g @google/gemini-cli"
```

### 2. Authenticate

```bash
# First-time setup (interactive OAuth)
gemini
```

### 3. Run a Simple Task

```bash
gemini "Explain the architecture of this project" -o text 2>&1
```

### 4. Web Research

```bash
gemini "What's new in React 19? Use Google Search." -o text 2>&1
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

Gemini CLI earns its place in a multi-AI toolkit through one defining trait: native Google Search grounding.

When you ask Gemini a question that needs current information, it does not guess from training data. It runs a real Google Search, reads the results, and grounds its response in what it finds. This changes the reliability equation for questions about library versions, API deprecations, security advisories, or any topic where the answer might have changed since the model's training cutoff. Other CLIs either lack web search entirely (Claude Code, Copilot) or treat it as a browsing session (Codex `--search`). Gemini's approach is different: the search results become part of the model's context, producing responses that cite their sources.

The `codebase_investigator` tool provides the second reason to delegate to Gemini. It performs deep architecture analysis by scanning file structures, mapping import graphs, and identifying architectural patterns. For onboarding to an unfamiliar codebase, this tool produces a structured overview faster than manual grep-and-read exploration. The calling AI can use this output to build a mental model before deciding what to modify.

The context window sets the technical ceiling. At 1M+ tokens, Gemini can process entire codebases in a single prompt. This eliminates the chunking, summarization, and context management that other CLIs require for large-scale analysis. When you need to ask a question about how two distant parts of a codebase interact, Gemini can hold both parts in context simultaneously.

The free tier removes the cost barrier for exploratory use. Google OAuth gives you 60 requests per minute and 1000 per day without an API key. This makes Gemini practical for high-frequency tasks like research queries and validation passes where the per-request cost of other CLIs adds up.

### 3.2 FEATURE REFERENCE

#### Model

| Model | ID | Use Case |
|-------|----|----------|
| **Gemini 3.1 Pro Preview** | `gemini-3.1-pro-preview` | All tasks (only supported model) |

#### Core Flags

| Flag | Short | Purpose | Example |
|------|-------|---------|---------|
| (prompt) | | Inline prompt | `gemini "prompt"` |
| `-o` | | Output format | `-o text` or `-o json` |
| `-m` | | Model selection | `-m gemini-3.1-pro-preview` |
| `--yolo` | `-y` | Auto-approve all tool calls | `--yolo` |

#### Built-in Tools

| Tool | Purpose | How to Invoke |
|------|---------|---------------|
| **google_web_search** | Real-time Google Search results | "Use Google Search to find..." |
| **codebase_investigator** | Deep architecture and dependency analysis | "Use codebase_investigator to..." |
| **save_memory** | Persistent cross-session context | "Remember that..." |

#### Authentication Methods

| Method | Setup | Rate Limits |
|--------|-------|-------------|
| **Google OAuth** | `gemini` (interactive first run) | 60 req/min, 1000 req/day |
| **API Key** | `export GEMINI_API_KEY=your-key` | Per API plan |
| **Vertex AI** | Enterprise config | Per enterprise plan |

#### Agent Routing

| Agent | Purpose | Invocation |
|-------|---------|------------|
| `@review` | Code review, security audit | `gemini "As @review agent: Review @./src" -o text` |
| `@context` | Architecture exploration | `gemini "As @context agent: Analyze project" -o text` |
| `@deep-research` | Technical research | `gemini "As @deep-research agent: Research X" -o text` |
| `@debug` | Fresh-perspective debugging via Task-tool dispatch | `gemini "As @debug agent: Debug error X" -o text` |
| `@multi-ai-council` | Multi-strategy planning | `gemini "As @multi-ai-council agent: Plan redesign" -o text` |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
cli-gemini/
  SKILL.md                              # Skill definition and smart routing logic
  README.md                             # This file
  assets/
    prompt_templates.md                 # Copy-paste ready prompts for common tasks
  references/
    agent_delegation.md                 # Agent routing and invocation patterns
    cli_reference.md                    # CLI flags, commands, model, auth, config
    gemini_tools.md                     # Built-in tools and comparison table
    integration_patterns.md             # Cross-AI orchestration workflows
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Authentication

| Method | Setup | Best For |
|--------|-------|----------|
| **Google OAuth** | Run `gemini` interactively | Free tier, personal use |
| **API Key** | `export GEMINI_API_KEY=your-key` | Programmatic use, CI/CD |
| **Vertex AI** | Enterprise configuration | Production workloads |

### Settings File

Gemini reads settings from `~/.gemini/settings.json`:

```json
{
  "model": "gemini-3.1-pro-preview"
}
```

### Ignore Files

Control which files Gemini can access with `.geminiignore`:

```text
# Exclude large or sensitive directories
node_modules/
.env
dist/
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `GEMINI_API_KEY` | API key authentication | `export GEMINI_API_KEY=key` |
| `GEMINI_MODEL` | Default model override | `gemini-3.1-pro-preview` |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Web Research with Google Search

```bash
gemini "What are the latest security advisories for Express.js? Use Google Search." -o text 2>&1
```

### Architecture Analysis

```bash
gemini "Use codebase_investigator to analyze the architecture of this project. \
Map the main modules and their dependencies." -o text 2>&1
```

### Code Review (Second Opinion)

```bash
gemini "Review src/auth/middleware.ts for security issues and race conditions" -o text 2>&1
```

### Background Parallel Tasks

```bash
# Run multiple analyses simultaneously
gemini "Analyze src/api/ for error handling gaps" --yolo -o text 2>&1 &
gemini "Generate JSDoc for all exported functions in src/utils/" --yolo -o text 2>&1 &
wait
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Gemini CLI Not Found

**What you see**: `command not found: gemini`
**Common causes**: CLI not installed, or PATH not updated.
**Fix**: Run `npm install -g @google/gemini-cli` and restart your terminal.

### Rate Limit Exceeded

**What you see**: `429 Too Many Requests`
**Common causes**: Exceeded 60 req/min or 1000 req/day on the free tier.
**Fix**: Wait for the rate limit window to reset, reduce request frequency, or switch to API key authentication for higher limits.

### Authentication Expired

**What you see**: Auth error or unexpected login prompt.
**Common causes**: Google OAuth session expired.
**Fix**: Run `gemini` interactively to re-authenticate through the browser flow.

### Context Too Large

**What you see**: Slow responses or context truncation warnings.
**Common causes**: Too many files loaded via `@` references.
**Fix**: Use `.geminiignore` to exclude large directories (node_modules, dist). Specify files explicitly rather than using broad directory references.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

### General

**Q: When should I use Gemini instead of other CLIs?**
A: Use Gemini for tasks requiring real-time web information (Google Search grounding), deep architecture analysis (`codebase_investigator`), or when processing very large codebases that benefit from the 1M+ token context. For surgical code editing, use Claude Code. For sandbox-controlled generation, use Codex.

**Q: Is Gemini CLI free?**
A: Yes, with Google OAuth authentication. The free tier provides 60 requests per minute and 1000 per day. API key and Vertex AI options are available for higher throughput.

### Model

**Q: Can I use other Gemini models?**
A: Currently only `gemini-3.1-pro-preview` is supported. Use it for all tasks regardless of complexity.

**Q: How does the 1M+ context window help in practice?**
A: You can load entire codebases into a single prompt without chunking. This means questions about cross-file interactions, distant dependencies, or full-project architecture get answers based on the complete picture, not a summarized subset.

### Tools

**Q: How does Google Search grounding differ from Codex's `--search`?**
A: Codex `--search` opens a browsing session where the agent navigates web pages. Gemini's `google_web_search` runs a Google Search query and integrates the results directly into the model's context. The Gemini approach is faster and produces cited responses. The Codex approach allows deeper page-by-page exploration.

**Q: Can I disable built-in tools?**
A: The tools activate based on prompt content. If you do not mention web search or codebase analysis, the tools do not run. There is no explicit disable flag.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill Resources
- [SKILL.md](./SKILL.md): Skill definition, smart routing logic, and activation triggers
- [cli_reference.md](./references/cli_reference.md): CLI flags, commands, model, auth, and config
- [gemini_tools.md](./references/gemini_tools.md): Built-in tools and cross-CLI comparison
- [agent_delegation.md](./references/agent_delegation.md): Agent routing and invocation patterns
- [integration_patterns.md](./references/integration_patterns.md): Cross-AI orchestration workflows
- [prompt_templates.md](./assets/prompt_templates.md): Copy-paste ready prompts

### Related Skills
- [cli-claude-code](../cli-claude-code/): Anthropic Claude Code CLI orchestrator
- [cli-codex](../cli-codex/): OpenAI Codex CLI orchestrator
- [cli-copilot](../cli-copilot/): GitHub Copilot CLI orchestrator

<!-- /ANCHOR:related-documents -->
