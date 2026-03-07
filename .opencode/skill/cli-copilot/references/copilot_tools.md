---
title: "Copilot CLI Built-in Tools Reference"
description: "Reference for Copilot CLI unique capabilities including Cloud Delegation, Plan Mode, Autopilot, Multi-Provider models, and 4-way comparison with Claude Code, Gemini CLI, and Codex CLI."
---

# Copilot CLI Built-in Tools Reference

Reference for all Copilot CLI capabilities, highlighting unique features and comparison with Claude Code, Gemini CLI, and Codex CLI.

---

## 1. OVERVIEW

### Core Principle

Delegate to Copilot CLI for GitHub-native workflows, multi-provider model flexibility (Anthropic, OpenAI, Google), and high-velocity autonomous execution via Autopilot and Cloud Delegation.

### Purpose

Covers all built-in capabilities of Copilot CLI, highlights what is unique compared to other CLIs, and provides a 4-way comparison table for task routing decisions.

### When to Use

- Performing repository-wide changes that benefit from GitHub-native context (issues, PRs, Actions)
- Needing to switch between different model providers (e.g., Anthropic to OpenAI) mid-session
- Executing long-running tasks autonomously using Autopilot or Cloud Delegation
- Collaborative architecture planning using Plan Mode before committing to implementation

---

## 2. UNIQUE CAPABILITIES

### Cloud Delegation

**Server-side task execution.** Push heavy computation or long-running coding tasks to GitHub’s cloud-hosted agents, freeing up local resources.

**Capabilities:**
- Use `/delegate` or `&prompt` to offload tasks
- Background execution in the cloud
- Automatic synchronization of results back to the local workspace
- Access to high-compute environments for complex refactoring

---

### Plan Mode

**Collaborative pre-implementation strategy.** A specialized mode for architectural design and intent validation before any code is modified.

**Capabilities:**
- Toggle via `Shift+Tab` in interactive sessions
- Read-only exploration and strategy drafting
- Interactive feedback loop to refine the execution plan
- Prevents premature implementation mistakes

---

### Autopilot

**Fully autonomous execution.** Autopilot allows the CLI to proceed through multi-step tasks without requiring manual approval for every action.

**Capabilities:**
- Continuous tool-use loops until task completion
- Self-correcting behavior based on terminal output and test failures
- Ideal for bulk migrations or comprehensive test generation
- Configurable safety guardrails for autonomous operations

---

### Multi-Provider Models

**Unparalleled model choice.** Access a curated selection of the world's leading models from Anthropic, OpenAI, and Google within a single interface.

**Capabilities:**
- **OpenAI:** GPT-5.4, GPT-5.3-Codex
- **Anthropic:** Claude Opus 4.6, Claude Sonnet 4.6
- **Google:** Gemini 3.1 Pro Preview
- Seamless switching via `/model` command

---

### Repository Memory

**Cross-session convention awareness.** Copilot CLI maintains a persistent understanding of your project's coding standards, patterns, and architectural decisions.

**Capabilities:**
- Learns local style guides automatically
- Recalls prior implementation decisions to ensure consistency
- Reduces the need for repetitive prompting about project structure

---

### GitHub-Native Integration

**Deep ecosystem synergy.** Direct access to GitHub-specific objects and workflows without leaving the CLI.

**Capabilities:**
- Context-aware interaction with Repositories, Issues, and Pull Requests
- Integration with GitHub Actions for CI/CD automation
- Native authentication via GitHub CLI flow

---

### Custom Agents

**Tailored AI personas.** Create specialized agent profiles using simple Markdown definitions to handle specific domains or project roles.

**Capabilities:**
- Define agent behavior, constraints, and tools in `.md` files
- Share agent profiles across teams via the repository
- Isolate expertise (e.g., a "Security Agent" vs. a "Frontend Agent")

---

## 3. FOUR-WAY COMPARISON TABLE

### Copilot vs Claude Code vs Gemini vs Codex

| Capability | Copilot CLI | Claude Code CLI | Gemini CLI | Codex CLI |
|------------|-------------|-----------------|------------|-----------|
| **Reasoning** | Multi-model reasoning | Extended thinking | Thinking mode | `xhigh` reasoning |
| **Editing** | Surgical & Autopilot | Edit tool (diff-based) | Code execution | Workspace-write |
| **Structured Output** | JSON mode | `--json-schema` | `--output_format json` | Prompt-based JSON |
| **Read-Only Mode** | Plan Mode | `--permission-mode plan` | N/A | `--sandbox read-only` |
| **Web Search** | Bing Search | N/A | Google Search | `--search` flag |
| **Cost Control** | Subscription-based | `--max-budget-usd` | N/A | N/A |
| **Agents** | Custom MD Agents | Built-in Agents | `.gemini/agents/` | profiles (-p) |
| **Sessions** | Continuous | `--continue`, `--resume` | `--session` | `resume`, `fork` |
| **Image Input** | Vision support | N/A | `--image` | `--image` / `-i` |
| **Memory** | Repository Memory | Spec Kit Memory MCP | N/A | N/A |
| **Hooks** | N/A | Pre/post tool hooks | N/A | N/A |
| **Models** | 5 (3 providers) | 3 (Anthropic) | 1 (Google) | 1 (OpenAI) |
| **Auth** | GitHub Auth | API key / OAuth | API key / OAuth | API key / OAuth |
| **Non-interactive** | `copilot -p "..."` | `-p "..."` | `-p "..."` | `exec "..."` |
| **Review** | PR Integration | `--agent review` | Agent definition | `/review` (TUI) |
| **Background** | `&` (native) | `& 2>&1` (shell) | `& 2>&1` (shell) | `& 2>&1` (shell) |
| **MCP Support** | Yes | Yes (Built-in) | Yes | Yes |
| **Cloud Delegation** | Yes (`/delegate`) | N/A | N/A | N/A |
| **Plan Mode** | Yes (`Shift+Tab`) | Yes (Read-only) | N/A | Yes (Sandbox) |
| **Autopilot** | Yes (Autonomous) | N/A | N/A | N/A |

### When to Choose Each

| Need | Best Choice | Why |
|------|-------------|-----|
| GitHub ecosystem tasks | **Copilot** | Native integration with PRs, Issues, and Repos |
| Deep extended thinking | **Claude Code** | Explicit, visible chain-of-thought with `--effort high` |
| Autonomous execution | **Copilot** | Autopilot mode handles multi-step tasks without prompts |
| Multi-model flexibility | **Copilot** | Access Anthropic, OpenAI, and Google in one CLI |
| Google Search grounding | **Gemini** | Native Google Search integration for real-time info |
| Surgical diff-based edits | **Claude Code** | Edit tool is highly precise for targeted changes |
| Cloud-offloaded tasks | **Copilot** | Cloud Delegation for long-running operations |
| TUI-based code review | **Codex** | `/review` command is native and diff-optimized |
| Schema-validated JSON | **Claude Code** | `--json-schema` provides the strongest structural guarantee |
| Web search & browsing | **Gemini / Codex** | Native support for Google or Bing search |

---

## 4. INTEGRATION TIPS FOR CALLING AIs

### Orchestrating Copilot CLI

```bash
# Running a task in Autopilot mode
copilot -p "Refactor the authentication module to use JWT" --autopilot --output-format text

# Delegating a heavy task to the cloud
copilot -p "Run a full security audit and fix all high-severity issues" --delegate

# Switching models for specific tasks
copilot -p "Analyze this logic" --model gpt-5.3-codex
copilot -p "Apply surgical edits" --model claude-sonnet-4.6
```

### Handling Multi-Model Output

When using Copilot CLI, your scripts should be prepared for varying output styles depending on the model selected. Always use `--output-format json` for programmatic parsing:

```bash
# Reliable JSON extraction
RESULT=$(copilot -p "List all API routes" --output-format json | jq -r '.result')
```

### Using Plan Mode for Safety

Before executing any destructive commands, use Plan Mode to verify the AI's intent:

```bash
# Generate a plan first
copilot -p "Restructure the project directories" --plan-only
```
