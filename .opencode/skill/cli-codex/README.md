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

Codex CLI runs on **GPT-5.5** at `medium` reasoning on the `fast` service tier — a balanced pick for code generation, standard review, implementation, documentation, architecture, and research. Callers can tune reasoning effort with explicit phrasing like "Use gpt 5.5 high fast" (deeper analysis) or "Use gpt 5.5 low" (lighter lookups). Only the reasoning-effort dimension varies; the model stays on `gpt-5.5` and the service tier stays on `fast`.

Three capabilities set Codex apart from other CLIs. The `--search` flag gives the agent live web browsing during execution, useful for checking library versions or finding community solutions. The built-in `/review` command runs diff-aware code review directly in the TUI. And configurable sandbox modes (read-only, workspace-write, full-access) let you match permissions to task risk.

The skill includes a self-invocation guard: if you are already running inside Codex CLI, activation is blocked to prevent circular delegation.

### Key Statistics

| Category | Value | Details |
|----------|-------|---------|
| **Model** | 1 | GPT-5.5 (balanced, used for every delegation) |
| **Default Dispatch** | `gpt-5.5` · `medium` · `fast` | Zero-input default; user can override explicitly ("Use gpt 5.5 high fast") |
| **Sandbox Modes** | 3 | read-only, workspace-write, danger-full-access |
| **Reasoning Levels** | 6 | none, minimal, low, medium, high, xhigh |
| **Agent Profiles** | 7 | review, context, research, write, debug, ultra-think, speckit |
| **References** | 4 | cli_reference, codex_tools, agent_delegation, integration_patterns |
| **Version** | 1.4.0.0 | |

### How This Compares

| Capability | Claude Code CLI | Gemini CLI | Copilot CLI | Codex CLI |
|------------|-----------------|------------|-------------|-----------|
| **Web search** | No | Google Search | No | `--search` live browsing |
| **Code review** | Agent-based | Manual prompt | PR-oriented | Built-in `/review` with diff awareness |
| **Sandbox control** | Permission modes | `--yolo` flag | `--allow-all-tools` | 3 sandbox modes + approval policies |
| **Image input** | No | No | No | `--image` flag for visual context |
| **Session management** | Continue/resume | Memory tool | Repo memory | Resume, fork, session history |
| **Spec Kit handoff** | Packet docs via `/spec_kit:resume` | Canonical packet continuity | Supporting artifacts only | `handover.md -> _memory.continuity -> spec docs` |
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
| **Native Hooks** | `SessionStart` startup context and `UserPromptSubmit` advisor briefs via `~/.codex/hooks.json` |

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

### 3. Run a Simple Task (Skill Default)

```bash
# Zero-input default: gpt-5.5 · medium · fast
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  "Explain the architecture of this project" 2>&1
```

### 4. Generate Code with Auto-Approval (Default Model)

```bash
codex exec "Add error handling to src/api.ts" \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  --full-auto 2>&1
```

### 5. User-Override Examples

```bash
# "Use gpt 5.5 high fast" — deeper reasoning for architecture/security
codex exec "Review src/auth.ts for edge cases" \
  --model gpt-5.5 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  --sandbox read-only 2>&1

# "Use gpt 5.5 low" — trivial lookups or formatting
codex exec "List all exported functions in src/" \
  --model gpt-5.5 \
  -c model_reasoning_effort="low" \
  -c service_tier="fast" \
  --sandbox read-only 2>&1
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

When Codex work feeds back into a Spec Kit packet, `/spec_kit:resume` is still the canonical recovery surface. Packet continuity rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts remain support only.

The reasoning effort system adds another dimension. GPT-5.5 supports six effort levels from `none` (fastest, cheapest) through `xhigh` (maximum depth). This means you can run quick formatting tasks at `low` effort and deep architecture reviews at `high` effort, paying only for the reasoning depth each task actually needs. The skill dispatches `medium` by default and honors explicit user phrasing like "Use gpt 5.5 high fast" as an override.

### 3.2 FEATURE REFERENCE

#### Models

| Model | ID | Best For | Default Effort |
|-------|----|----------|---------------|
| **GPT-5.5** ★ skill default | `gpt-5.5` | Balanced default for code generation, standard review, implementation, docs, most delegations | **medium** (configurable; `fast` service tier) |

> **Default dispatch**: `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"`. Caller may override reasoning effort — e.g. "Use gpt 5.5 high fast" → `-c model_reasoning_effort="high"`. Model and service tier stay fixed.

#### Core Flags

| Flag | Short | Purpose | Example |
|------|-------|---------|---------|
| `exec` | | Non-interactive execution | `codex exec "prompt"` |
| `--model` | `-m` | Model selection | `-m gpt-5.5` |
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
| `review` | Code review, security audit | `codex exec -p review "Review @./src" -m gpt-5.5` |
| `context` | Architecture exploration | `codex exec -p context "Analyze architecture" -m gpt-5.5` |
| `research` | Technical research with web | `codex exec -p research "Research X" -m gpt-5.5 --search` |
| `write` | Documentation generation | `codex exec -p write "Generate README" -m gpt-5.5` |
| `debug` | Fresh-perspective debugging | `codex exec -p debug "Debug error: X" -m gpt-5.5` |
| `ultra-think` | Multi-strategy planning | `codex exec -p ultra-think "Plan redesign" -m gpt-5.5` |
| `speckit` | Spec documentation | `codex exec -p speckit "Create spec folder" -m gpt-5.5` |

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
    prompt_quality_card.md              # Framework-per-task selector, CLEAR 5-check
  references/
    agent_delegation.md                 # Agent profiles, routing, invocation patterns
    codex_tools.md                      # Unique capabilities and comparison table
    cli_reference.md                    # CLI flags, commands, models, sandbox, config
    hook_contract.md                    # Hook contract, codex_hooks flag, startup/advisor parity
    integration_patterns.md             # Cross-AI orchestration workflows
```

> **Voice guidance lives outside this skill**: user-level voice/tone/reasoning instructions for Codex CLI are installed at `<repo>/.codex/AGENTS.md` (symlinked to `~/.codex/AGENTS.md`). That file governs how Codex talks in the user's own sessions and is **not** used by this skill when an AI delegates work to Codex. See §8 FAQ for the full rationale.

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

Codex reads settings from `~/.codex/config.toml`. Key settings (matching the skill's default dispatch):

```toml
model = "gpt-5.5"
model_reasoning_effort = "medium"
service_tier = "fast"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

> **Note**: The skill passes `--model`, `-c model_reasoning_effort`, and `-c service_tier` explicitly on every dispatch so the invocation is self-documenting. The `config.toml` above is what the user's own interactive Codex sessions will use when they don't override, and keeps per-run behavior aligned with skill dispatches.

### Agent Profiles

Profiles override global settings per task type. Defined in `config.toml` under `[profiles.<name>]`:

```toml
[profiles.review]
model = "gpt-5.5"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
```

### Native Hooks

Codex native hooks require the feature flag in `~/.codex/config.toml`:

```toml
[features]
codex_hooks = true
```

Spec Kit Memory registers two model-visible hooks in `~/.codex/hooks.json`:
`SessionStart` injects startup context with code-graph and recovery status, and
`UserPromptSubmit` injects the compact `Advisor: ...` skill-routing line. Keep
existing Superset `notify.sh` entries in place; append Spec Kit Memory entries
beside them. See [hook_contract.md](./references/hook_contract.md) for the
stdin/stdout schema, exit semantics, and smoke checks.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Code Generation with Sandbox Control

```bash
codex exec "Refactor utils.ts to use async/await" \
  --model gpt-5.5 --sandbox workspace-write 2>&1
```

### Web Research During Task

```bash
codex exec "Research and implement OAuth2 PKCE flow based on current best practices" \
  --model gpt-5.5 --search --full-auto 2>&1
```

### Image-Based Implementation

```bash
codex exec "Implement this UI component matching the wireframe" \
  --image wireframe.png --model gpt-5.5 --full-auto 2>&1
```

### Parallel Background Tasks

```bash
# Run multiple tasks simultaneously
codex exec "Generate tests for src/auth/" -m gpt-5.5 --full-auto 2>&1 &
codex exec "Generate tests for src/api/" -m gpt-5.5 --full-auto 2>&1 &
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

**Q: Which model does the skill use, and can I choose a different one?**
A: Every delegation runs on `gpt-5.5`. The only tunable dimension is reasoning effort — `medium` by default, or explicitly override with phrasing like "Use gpt 5.5 high fast" (for deeper analysis) or "Use gpt 5.5 low" (for lighter lookups). The service tier stays on `fast`.

### Configuration

**Q: How do I set reasoning effort without a CLI flag?**
A: Use `-c model_reasoning_effort="high"` on the command line, or set `model_reasoning_effort = "high"` in `~/.codex/config.toml` for a persistent default.

**Q: Can I use local models instead of OpenAI?**
A: Yes. The `--oss` flag switches to local open-source models via Ollama.

**Q: Why does a Codex session say no startup context or advisor brief was injected?**
A: Check `codex features list` and confirm `codex_hooks` is `true`. Then inspect `~/.codex/hooks.json` for Spec Kit Memory `SessionStart` and `UserPromptSubmit` commands. The required command shapes and smoke tests live in [hook_contract.md](./references/hook_contract.md).

### Sessions

**Q: How do I resume a previous session?**
A: Use `codex resume [session-id]` to continue where you left off. Use `codex fork [session-id]` to branch from a prior session.

**Q: Can Codex run in the cloud?**
A: Yes. The `codex cloud` subcommand offloads execution to remote infrastructure.

### Voice Personalization (Codex CLI Global)

**Q: How do I make Codex CLI sound more like Claude Opus — calibrated, diplomatically honest, scope-disciplined, no filler?**
A: It's already configured at `<repo>/.codex/AGENTS.md` (symlinked to `~/.codex/AGENTS.md`). Codex CLI loads that file at every session start and combines it with the project-level `AGENTS.md` framework. The global file contains voice, tone, and reasoning-visibility guidance only — scope/gates/memory rules come from the project-level file.

For the **Codex APP chat UI** (not CLI), the same content can be pasted into the app's custom-instructions field directly; the source prose is in `<repo>/.codex/AGENTS.md`.

**Q: Should an AI orchestrator (Claude Code, Gemini CLI, Copilot CLI) inject this voice content when delegating to Codex via this skill?**
A: **No.** The global voice file is for the user's own Codex CLI sessions. When an AI delegates a task to Codex, the calling AI's own system instructions already govern voice. Injecting `~/.codex/AGENTS.md` contents into a delegated prompt would add redundant or conflicting guidance and inflate token cost. SKILL.md §4 RULE #10 formalizes this: voice is the calling AI's responsibility, not Codex's.

**Q: Does this conflict with the project-level `AGENTS.md` framework?**
A: No — they're complementary. The project `AGENTS.md` is authoritative for gates, scope, and memory; the global voice file only shapes how responses sound. The global file's header explicitly defers to the project file for anything framework-level.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill Resources
- [SKILL.md](./SKILL.md): Skill definition, smart routing logic, and activation triggers
- [cli_reference.md](./references/cli_reference.md): CLI flags, commands, models, sandbox, and config
- [codex_tools.md](./references/codex_tools.md): Unique capabilities and cross-CLI comparison
- [hook_contract.md](./references/hook_contract.md): Native hook contract and startup/advisor parity wiring
- [agent_delegation.md](./references/agent_delegation.md): Agent profiles, routing, and invocation patterns
- [integration_patterns.md](./references/integration_patterns.md): Cross-AI orchestration workflows
- [prompt_templates.md](./assets/prompt_templates.md): Copy-paste ready prompts
- [prompt_quality_card.md](./assets/prompt_quality_card.md): Framework-per-task selector and CLEAR 5-check

### User-Level Voice Configuration (outside this skill)
- `<repo>/.codex/AGENTS.md` (symlinked to `~/.codex/AGENTS.md`) — global voice, tone, and reasoning-visibility instructions loaded by Codex CLI at every session start. Origin: spec `046-cli-codex-tone-of-voice`.

### Related Skills
- [cli-claude-code](../cli-claude-code/): Anthropic Claude Code CLI orchestrator
- [cli-copilot](../cli-copilot/): GitHub Copilot CLI orchestrator
- [cli-gemini](../cli-gemini/): Google Gemini CLI orchestrator

<!-- /ANCHOR:related-documents -->
