---
title: "Copilot CLI Orchestrator"
description: "Cross-AI task delegation to GitHub's Copilot CLI for multi-model flexibility, autonomous execution, cloud delegation, and collaborative planning."
trigger_phrases:
  - "copilot cli"
  - "copilot"
  - "delegate to copilot"
  - "autopilot"
  - "cloud delegation"
---

# Copilot CLI Orchestrator

> Delegate tasks from any AI assistant to GitHub's Copilot CLI for multi-provider model access, autonomous execution, and cloud-powered coding agents.

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

This skill lets external AI assistants (Claude Code, Gemini CLI, Codex CLI) invoke GitHub's Copilot CLI for tasks that benefit from multi-model flexibility, autonomous code generation, or cloud-delegated computing. The calling AI stays the conductor, choosing what to delegate and validating the results.

Copilot CLI is GitHub's standalone terminal interface for Copilot (GA February 2026), replacing the deprecated `gh copilot` extension. It provides access to 5 frontier models from 3 providers through a single binary. You can switch between OpenAI, Anthropic, and Google models mid-session without changing tools or authentication.

The defining feature is Autopilot mode. With `--allow-all-tools`, Copilot runs autonomously, reading files, writing code, and executing shell commands without pausing for approval. Combined with cloud delegation (`/delegate` or `&prompt`), this offloads heavy computation to GitHub's infrastructure rather than running everything locally.

For Spec Kit packet work, Copilot handoff should always point back to `/spec_kit:resume`. Canonical continuity still comes from `handover.md`, then `_memory.continuity`, then the remaining spec docs, and any generated memory artifacts stay secondary.

The skill includes a self-invocation guard: if you are already running inside Copilot CLI, activation is blocked to prevent circular delegation.

### Key Statistics

| Category | Value | Details |
|----------|-------|---------|
| **Models** | 5 | From 3 providers (OpenAI, Anthropic, Google) |
| **Agents** | 2 built-in | Explore (read-only analysis), Task (execution) |
| **Execution Modes** | 3 | Interactive, Autopilot (`--allow-all-tools`), Cloud delegation |
| **Reasoning Levels** | 4 | low, medium, high, xhigh (GPT-5.x models) |
| **References** | 4 | cli_reference, copilot_tools, agent_delegation, integration_patterns |
| **Version** | 1.3.4.0 | Max 5 concurrent processes |

### How This Compares

| Capability | Claude Code CLI | Codex CLI | Gemini CLI | Copilot CLI |
|------------|-----------------|-----------|------------|-------------|
| **Model providers** | Anthropic only | OpenAI only | Google only | OpenAI + Anthropic + Google |
| **Model count** | 3 | 2 | 1 | 5 |
| **Autonomous mode** | bypassPermissions | --full-auto | --yolo | Autopilot (`--allow-all-tools`) |
| **Cloud compute** | No | codex cloud | No | `/delegate` to GitHub coding agents |
| **Repo memory** | Session-based | Session-based | save_memory tool | Built-in repo memory across sessions |
| **Web search** | No | `--search` | Google Search | No |

### Key Features at a Glance

| Feature | What It Does |
|---------|-------------|
| **Multi-Model** | Switch between 5 models from 3 providers mid-session via `/model` |
| **Autopilot** | Fully autonomous execution with `--allow-all-tools` for hands-free coding |
| **Cloud Delegation** | Offload tasks to GitHub's cloud coding agents for heavy compute |
| **Explore Agent** | Read-only codebase analysis for architecture mapping and onboarding |
| **Task Agent** | Full-capability agent for implementation, refactoring, and testing |
| **Spec Kit handoff** | Return packet recovery through `/spec_kit:resume` and packet docs, not generated memory artifacts |
| **Repo Memory** | Persistent memory of project conventions and prior decisions across sessions |
| **MCP Support** | Connect to Model Context Protocol servers for external data access |

### Requirements

| Requirement | Value | Notes |
|-------------|-------|-------|
| **CLI** | `copilot` binary | Install via `npm install -g @github/copilot` |
| **Auth** | GitHub account | `GH_TOKEN` or `gh auth login` |
| **Plan** | GitHub Copilot subscription | Free, Pro, Business, or Enterprise |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 1. Verify Installation

```bash
command -v copilot || echo "Not installed. Run: npm install -g @github/copilot"
```

### 2. Authenticate

```bash
# OAuth flow
copilot login

# Non-interactive (CI/CD or automation)
export GH_TOKEN=your-github-pat
```

### 3. Run a Simple Task

```bash
copilot -p "Explain the data flow in src/" 2>&1
```

### 4. Run in Autopilot Mode

```bash
copilot -p "Implement the feature described in spec.md" --allow-all-tools 2>&1
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

Copilot CLI has one capability that no other AI CLI offers: multi-provider model access from a single tool.

You can start a session with GPT-5.4 for planning, switch to Claude Opus 4.6 for detailed architecture analysis, and then move to Gemini 3.1 Pro for tasks that benefit from its large context window. All through the same binary, same auth, same project context. This matters when different models have different strengths and you want to use the right one for each phase of a complex workflow rather than committing to a single provider.

Autopilot mode is the second major differentiator. When you pass `--allow-all-tools`, Copilot runs fully autonomously, reading codebases, writing files, executing tests, and iterating on failures without pausing for human approval. For the calling AI, this means you can delegate an entire implementation task and receive the completed result, not a half-finished draft that needs manual intervention.

Cloud delegation pushes this further. The `/delegate` command (or `&prompt` prefix) sends tasks to GitHub's cloud-hosted coding agents. These agents run on GitHub's infrastructure, which means they have access to repository metadata, issue history, and CI/CD context that local tools lack. For tasks like "analyze this repo for security hot-spots," cloud agents can process the full repository graph rather than relying on local file reads.

The Explore agent fills a distinct niche for read-only codebase analysis. It maps file relationships, traces data flows, and builds architecture summaries without touching any files. This is useful as a pre-implementation step where the calling AI needs to understand the codebase before deciding what to modify.

### 3.2 FEATURE REFERENCE

#### Models

| Model | ID | Provider | Best For |
|-------|----|----------|----------|
| **GPT-5.4** | `gpt-5.4` | OpenAI | Frontier reasoning with configurable effort levels |
| **GPT-5.3-Codex** | `gpt-5.3-codex` | OpenAI | Code generation and implementation |
| **Claude Opus 4.6** | `claude-opus-4.6` | Anthropic | Complex architecture and detailed logic |
| **Claude Sonnet 4.6** | `claude-sonnet-4.6` | Anthropic | General coding and speed (default) |
| **Gemini 3.1 Pro** | `gemini-3.1-pro-preview` | Google | Large context analysis |

#### Core Flags

| Flag | Short | Purpose | Example |
|------|-------|---------|---------|
| `-p` | | Non-interactive mode | `copilot -p "prompt"` |
| `--model` | `-m` | Model selection | `--model gpt-5.4` |
| `--allow-all-tools` | | Autopilot mode | `--allow-all-tools` |
| `--agent` | | Agent routing | `--agent explore` |

#### Reasoning Effort (GPT-5.x Models)

| Level | Use Case | Models Supporting |
|-------|----------|-------------------|
| `low` | Fast responses, less reasoning | All GPT-5.x |
| `medium` | Balanced (default for GPT-5.1) | All GPT-5.x |
| `high` | Thorough reasoning (default for GPT-5.4) | All GPT-5.x |
| `xhigh` | Maximum depth | GPT-5.4, GPT-5.3-Codex |

Set via `~/.copilot/config.json` under `"reasoning_effort"`. No CLI flag exists.

#### Agent Types

| Agent | Purpose | Invocation |
|-------|---------|------------|
| **Explore** | Read-only codebase analysis | `copilot -p "Explain src/ data flow" --agent explore 2>&1` |
| **Task** | Full execution with file access | `copilot -p "Refactor login" --agent task --allow-all-tools 2>&1` |
| **Cloud** | Remote GitHub coding agents | `copilot -p "/delegate Analyze security" 2>&1` |

#### Unique Capabilities

| Capability | What It Does |
|------------|-------------|
| **Autopilot** | Autonomous execution without approval prompts |
| **Repo Memory** | Remembers conventions and decisions across sessions |
| **Cloud Delegation** | Offloads to GitHub's cloud coding agents |
| **Multi-Model** | Toggle between 3 providers mid-session |
| **MCP Support** | Connect to external data via Model Context Protocol |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
cli-copilot/
  SKILL.md                              # Skill definition and smart routing logic
  README.md                             # This file
  assets/
    prompt_templates.md                 # Copy-paste ready prompts for common tasks
  references/
    agent_delegation.md                 # Explore/Task agents, custom agents, routing
    cli_reference.md                    # CLI flags, commands, models, auth, config
    copilot_tools.md                    # Autopilot, repo memory, MCP integration
    integration_patterns.md             # Cross-AI orchestration workflows
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Authentication

| Method | Setup | Best For |
|--------|-------|----------|
| **GH_TOKEN** | `export GH_TOKEN=your-token` | Programmatic use, CI/CD |
| **copilot login** | `copilot login` | Interactive OAuth flow |

### Config File

Copilot reads settings from `~/.copilot/config.json`:

```json
{
  "model": "claude-sonnet-4.6",
  "reasoning_effort": "high"
}
```

### Setting Reasoning Effort (GPT-5.x)

There is no `--reasoning-effort` CLI flag. Set it in config:

```bash
python3 -c "
import json
cfg_path = '$HOME/.copilot/config.json'
with open(cfg_path) as f: cfg = json.load(f)
cfg['reasoning_effort'] = 'high'
with open(cfg_path, 'w') as f: json.dump(cfg, f, indent=2)
"
```

Or select interactively: `/model` in interactive mode, choose GPT-5.x, select effort level.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Multi-Model Workflow

```bash
# Architecture analysis with Opus
copilot -p "Analyze authentication architecture" --model claude-opus-4.6 2>&1

# Implementation with GPT-5.3-Codex
copilot -p "Implement the auth refactor from the plan" --model gpt-5.3-codex --allow-all-tools 2>&1
```

### Cloud Delegation

```bash
copilot -p "/delegate Analyze this repository for security vulnerabilities and create issues for findings" 2>&1
```

### Autonomous Implementation

```bash
copilot -p "Add error handling to all API routes in src/routes/" \
  --allow-all-tools --model gpt-5.4 2>&1
```

### Explore Agent for Onboarding

```bash
copilot -p "Map the data flow from API request to database write in this project" \
  --agent explore 2>&1
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Copilot CLI Not Found

**What you see**: `command not found: copilot`
**Common causes**: CLI not installed, or using old `gh copilot` extension.
**Fix**: Install the standalone binary with `npm install -g @github/copilot`. The `gh copilot` extension is deprecated.

### Authentication Failure

**What you see**: `403 Forbidden` or login redirect.
**Common causes**: `GH_TOKEN` not set, GitHub auth expired, or no Copilot subscription.
**Fix**: Run `gh auth login` and verify your GitHub account has an active Copilot subscription.

### Model Not Available

**What you see**: "Model not available" or unexpected model used.
**Common causes**: Requested model not included in your Copilot plan tier.
**Fix**: Check available models with `/model` in interactive mode. Some models require Business or Enterprise plans.

### Autopilot Safety Block

**What you see**: Task pauses unexpectedly despite `--allow-all-tools`.
**Common causes**: Copilot's built-in safety system blocked a potentially destructive operation.
**Fix**: Review the blocked action and approve it manually, or restructure the task to avoid the flagged operation.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

### General

**Q: When should I use Copilot instead of other CLIs?**
A: Use Copilot when you need multi-provider model access (switch between OpenAI, Anthropic, Google), autonomous Autopilot execution, or cloud delegation to GitHub's infrastructure. For web search, use Codex or Gemini instead.

**Q: Does Copilot CLI replace the `gh copilot` extension?**
A: Yes. The standalone `copilot` binary is the current implementation. `gh copilot` is deprecated.

### Models

**Q: Can I switch models mid-session?**
A: Yes. Use `/model` in interactive mode to switch between all 5 available models from 3 providers. The selection persists to config automatically.

**Q: Which model is the default?**
A: Claude Sonnet 4.6 is the default for general coding tasks. Override with `--model` per invocation.

### Cloud Delegation

**Q: What can cloud agents access that local execution cannot?**
A: Cloud agents run on GitHub's infrastructure with access to repository metadata, issue history, PR context, and CI/CD status. They process the full repository graph, not just local files.

**Q: Is cloud delegation free?**
A: Cloud delegation uses your Copilot plan's compute allocation. Usage limits depend on your plan tier.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill Resources
- [SKILL.md](./SKILL.md): Skill definition, smart routing logic, and activation triggers
- [cli_reference.md](./references/cli_reference.md): CLI flags, commands, models, auth, and config
- [copilot_tools.md](./references/copilot_tools.md): Autopilot, repo memory, and MCP integration
- [agent_delegation.md](./references/agent_delegation.md): Explore/Task agents and custom agent creation
- [integration_patterns.md](./references/integration_patterns.md): Cross-AI orchestration workflows
- [prompt_templates.md](./assets/prompt_templates.md): Copy-paste ready prompts

### Related Skills
- [cli-claude-code](../cli-claude-code/): Anthropic Claude Code CLI orchestrator
- [cli-codex](../cli-codex/): OpenAI Codex CLI orchestrator
- [cli-gemini](../cli-gemini/): Google Gemini CLI orchestrator

<!-- /ANCHOR:related-documents -->
