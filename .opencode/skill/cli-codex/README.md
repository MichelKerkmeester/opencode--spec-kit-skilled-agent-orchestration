---
title: "Codex CLI Orchestrator"
description: "Cross-AI task delegation to OpenAI's Codex CLI for code generation, web research, code review, and parallel task processing."
trigger_phrases:
  - "codex cli"
  - "codex exec"
  - "delegate to codex"
  - "web search codex"
  - "gpt-5"
---

# Codex CLI Orchestrator

> Delegate tasks from any AI assistant to OpenAI's Codex CLI for code generation, live web research, and diff-aware code review.

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

This skill lets any AI assistant invoke OpenAI's Codex CLI for tasks that benefit from a second perspective, real-time web information, or parallel code generation. The calling AI stays the conductor, delegating specific jobs to Codex and integrating the results.

Codex CLI runs two models. GPT-5.4 handles frontier reasoning tasks: architecture analysis, security audits, and complex planning. GPT-5.3-Codex focuses on code: generation, refactoring, documentation, and test suites. The split means you can route each task to the model built for it rather than using one model for everything.

Three capabilities set Codex apart from other CLIs. The `--search` flag gives the agent live web browsing during execution, useful for checking library versions or finding community solutions. The built-in `/review` command runs diff-aware code review directly in the TUI. And configurable sandbox modes (read-only, workspace-write, full-access) let you match permissions to task risk.

The skill includes a self-invocation guard: if you are already running inside Codex CLI, activation is blocked to prevent circular delegation.

### Key Statistics

| Category | Value | Details |
|----------|-------|---------|
| **Models** | 2 | GPT-5.4 (reasoning), GPT-5.3-Codex (code generation) |
| **Sandbox Modes** | 3 | read-only, workspace-write, danger-full-access |
| **Reasoning Levels** | 6 | none, minimal, low, medium, high, xhigh |
| **Agent Profiles** | 7 | review, context, research, write, debug, ultra-think, speckit |
| **References** | 4 | cli_reference, codex_tools, agent_delegation, integration_patterns |
| **Version** | 1.3.1 | |

### How This Compares

| Capability | Claude Code CLI | Gemini CLI | Copilot CLI | Codex CLI |
|------------|-----------------|------------|-------------|-----------|
| **Web search** | No | Google Search | No | `--search` live browsing |
| **Code review** | Agent-based | Manual prompt | PR-oriented | Built-in `/review` with diff awareness |
| **Sandbox control** | Permission modes | `--yolo` flag | `--allow-all-tools` | 3 sandbox modes + approval policies |
| **Image input** | No | No | No | `--image` flag for visual context |
| **Session management** | Continue/resume | Memory tool | Repo memory | Resume, fork, session history |
| **Cloud execution** | No | No | Cloud delegation | `codex cloud` subcommand |

### Key Features at a Glance

| Feature | What It Does |
|---------|-------------|
| **Web Search** | `--search` enables live web browsing during task execution for current information |
| **Diff-Aware Review** | `/review` command analyzes code changes with full diff context |
| **Sandbox Modes** | Three levels of filesystem access control matching task risk |
| **Reasoning Effort** | Six levels from `none` to `xhigh` for tuning depth vs speed |
| **Image Input** | `--image` flag attaches screenshots or designs as visual context |
| **Session Fork** | Branch from any prior session to explore alternative approaches |
| **Agent Profiles** | TOML-based profiles in `config.toml` with model and sandbox overrides |

### Requirements

| Requirement | Value | Notes |
|-------------|-------|-------|
| **CLI** | `@openai/codex` | Install via `npm i -g @openai/codex` or `brew install --cask codex` |
| **Auth** | `OPENAI_API_KEY` or ChatGPT OAuth | API key for programmatic use, `codex login` for interactive |
| **Node.js** | 18+ | Required for npm installation |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 1. Verify Installation

```bash
command -v codex || echo "Not installed. Run: npm i -g @openai/codex"
```

### 2. Authenticate

```bash
# Option A: API key
export OPENAI_API_KEY=your-key-here

# Option B: ChatGPT OAuth (interactive)
codex login
```

### 3. Run a Simple Task

```bash
codex exec "Explain the architecture of this project" -m gpt-5.4 2>&1
```

### 4. Generate Code with Auto-Approval

```bash
codex exec "Add error handling to src/api.ts" --model gpt-5.3-codex --full-auto 2>&1
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

Codex CLI bridges the gap between code generation and real-world context through three differentiating capabilities.

Live web search is the first. The `--search` flag lets the agent browse the web mid-task. When generating code that depends on a third-party API, the agent can check current documentation rather than relying on training data. For debugging, it can look up recent issue reports and community solutions. This is not a separate tool or follow-up step. The browsing happens inline during execution, so the agent's code output reflects current information.

The sandbox model is the second differentiator. Most CLIs offer binary permission control: either ask before everything or auto-approve everything. Codex provides three graduated levels. `read-only` restricts the agent to file reads and analysis. `workspace-write` allows file modifications within the project directory. `danger-full-access` opens shell execution for tasks like running test suites. You can also layer approval policies (`untrusted`, `on-request`, `never`) on top of sandbox modes for fine-grained control.

Session management rounds out the picture. Codex tracks conversation history and lets you resume where you left off or fork from any prior session. Forking is particularly useful when you want to explore two different implementation approaches from the same starting point without losing either thread.

The reasoning effort system adds another dimension. GPT-5.4 supports six effort levels from `none` (fastest, cheapest) through `xhigh` (maximum depth). This means you can run quick formatting tasks at `low` effort and deep architecture reviews at `high` effort, paying only for the reasoning depth each task actually needs.

### 3.2 FEATURE REFERENCE

#### Models

| Model | ID | Best For | Default Effort |
|-------|----|----------|---------------|
| **GPT-5.4** | `gpt-5.4` | Reasoning, architecture, security audits, deep review | high (configurable) |
| **GPT-5.3-Codex** | `gpt-5.3-codex` | Code generation, implementation, documentation, tests | xhigh (fixed) |

#### Core Flags

| Flag | Short | Purpose | Example |
|------|-------|---------|---------|
| `exec` | | Non-interactive execution | `codex exec "prompt"` |
| `--model` | `-m` | Model selection | `-m gpt-5.4` |
| `-c` | | Config override | `-c model_reasoning_effort="high"` |
| `--sandbox` | | Filesystem access level | `--sandbox read-only` |
| `--full-auto` | | Auto-approve all operations | `--full-auto` |
| `--search` | | Enable web browsing | `--search` |
| `--image` | `-i` | Attach visual input | `-i screenshot.png` |
| `--ask-for-approval` | | Approval policy | `--ask-for-approval never` |

> **Common flag mistakes:** `--reasoning`, `--reasoning-effort` and `--quiet` do NOT exist in Codex CLI. Use `-c model_reasoning_effort="high"` for reasoning effort (or set it in `config.toml`). There is no quiet flag.

#### Sandbox Modes

| Mode | Allows | Use Case |
|------|--------|----------|
| `read-only` | File reads only | Safe analysis and exploration |
| `workspace-write` | File reads + writes in project | Standard code generation |
| `danger-full-access` | Full shell access | Running tests, installing deps |

#### Agent Profiles

| Profile | Purpose | Invocation |
|---------|---------|------------|
| `review` | Code review, security audit | `codex exec -p review "Review @./src" -m gpt-5.4` |
| `context` | Architecture exploration | `codex exec -p context "Analyze architecture" -m gpt-5.4` |
| `research` | Technical research with web | `codex exec -p research "Research X" -m gpt-5.4 --search` |
| `write` | Documentation generation | `codex exec -p write "Generate README" -m gpt-5.3-codex` |
| `debug` | Fresh-perspective debugging | `codex exec -p debug "Debug error: X" -m gpt-5.3-codex` |
| `ultra-think` | Multi-strategy planning | `codex exec -p ultra-think "Plan redesign" -m gpt-5.4` |
| `speckit` | Spec documentation | `codex exec -p speckit "Create spec folder" -m gpt-5.3-codex` |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
cli-codex/
  SKILL.md                              # Skill definition and smart routing logic
  README.md                             # This file
  assets/
    prompt_templates.md                 # Copy-paste ready prompts for common tasks
  references/
    agent_delegation.md                 # Agent profiles, routing, invocation patterns
    codex_tools.md                      # Unique capabilities and comparison table
    cli_reference.md                    # CLI flags, commands, models, sandbox, config
    integration_patterns.md             # Cross-AI orchestration workflows
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Authentication

| Method | Setup | Best For |
|--------|-------|----------|
| **API Key** | `export OPENAI_API_KEY=your-key` | Programmatic use, CI/CD |
| **ChatGPT OAuth** | `codex login` | Interactive use (Plus/Pro/Business account required) |

### Config File

Codex reads settings from `~/.codex/config.toml`. Key settings:

```toml
model = "gpt-5.4"
model_reasoning_effort = "high"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

### Agent Profiles

Profiles override global settings per task type. Defined in `config.toml` under `[profiles.<name>]`:

```toml
[profiles.review]
model = "gpt-5.4"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
```

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Code Generation with Sandbox Control

```bash
codex exec "Refactor utils.ts to use async/await" \
  --model gpt-5.3-codex --sandbox workspace-write 2>&1
```

### Web Research During Task

```bash
codex exec "Research and implement OAuth2 PKCE flow based on current best practices" \
  --model gpt-5.4 --search --full-auto 2>&1
```

### Image-Based Implementation

```bash
codex exec "Implement this UI component matching the wireframe" \
  --image wireframe.png --model gpt-5.3-codex --full-auto 2>&1
```

### Parallel Background Tasks

```bash
# Run multiple tasks simultaneously
codex exec "Generate tests for src/auth/" -m gpt-5.3-codex --full-auto 2>&1 &
codex exec "Generate tests for src/api/" -m gpt-5.3-codex --full-auto 2>&1 &
wait
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Codex CLI Not Found

**What you see**: `command not found: codex`
**Common causes**: CLI not installed, or PATH not updated.
**Fix**: Run `npm i -g @openai/codex` or `brew install --cask codex`. Restart terminal.

### Non-Existent Flag Error

**What you see**: Error when using `--reasoning`, `--reasoning-effort`, or `--quiet`.
**Common causes**: These flags do not exist in Codex CLI.
**Fix**: Use `-c model_reasoning_effort="high"` for reasoning effort. There is no quiet equivalent. Use `-o file.txt` to capture output to a file.

### Authentication Failure

**What you see**: `401 Unauthorized` or login prompt.
**Common causes**: `OPENAI_API_KEY` not set, or OAuth session expired.
**Fix**: Set `export OPENAI_API_KEY=your-key` or run `codex login` to re-authenticate.

### Gate 3 Blocking in CLAUDE.md Projects

**What you see**: Agent asks "Which spec folder?" instead of executing the task.
**Common causes**: The project has a `CLAUDE.md` with mandatory gate checks that intercept Codex agents.
**Fix**: This is a known issue when using Codex agents in projects with Claude Code gate systems. Consider running the task from outside the project directory or handling the task directly.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

### General

**Q: When should I use Codex instead of other CLIs?**
A: Use Codex for tasks requiring live web search (`--search`), diff-aware code review (`/review`), image input, or when you need graduated sandbox control. For deep extended thinking, use Claude Code instead.

**Q: What is the difference between GPT-5.4 and GPT-5.3-Codex?**
A: GPT-5.4 is the frontier reasoning model for analysis, planning, and review. GPT-5.3-Codex is optimized for code generation, refactoring, and implementation. Route accordingly.

### Configuration

**Q: How do I set reasoning effort without a CLI flag?**
A: Use `-c model_reasoning_effort="high"` on the command line, or set `model_reasoning_effort = "high"` in `~/.codex/config.toml` for a persistent default.

**Q: Can I use local models instead of OpenAI?**
A: Yes. The `--oss` flag switches to local open-source models via Ollama.

### Sessions

**Q: How do I resume a previous session?**
A: Use `codex resume [session-id]` to continue where you left off. Use `codex fork [session-id]` to branch from a prior session.

**Q: Can Codex run in the cloud?**
A: Yes. The `codex cloud` subcommand offloads execution to remote infrastructure.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill Resources
- [SKILL.md](./SKILL.md): Skill definition, smart routing logic, and activation triggers
- [cli_reference.md](./references/cli_reference.md): CLI flags, commands, models, sandbox, and config
- [codex_tools.md](./references/codex_tools.md): Unique capabilities and cross-CLI comparison
- [agent_delegation.md](./references/agent_delegation.md): Agent profiles, routing, and invocation patterns
- [integration_patterns.md](./references/integration_patterns.md): Cross-AI orchestration workflows
- [prompt_templates.md](./assets/prompt_templates.md): Copy-paste ready prompts

### Related Skills
- [cli-claude-code](../cli-claude-code/): Anthropic Claude Code CLI orchestrator
- [cli-copilot](../cli-copilot/): GitHub Copilot CLI orchestrator
- [cli-gemini](../cli-gemini/): Google Gemini CLI orchestrator

<!-- /ANCHOR:related-documents -->
