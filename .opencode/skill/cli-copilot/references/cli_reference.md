---
title: "Copilot CLI - Complete Command Reference"
description: "Comprehensive reference for GitHub Copilot CLI flags, commands, models, configuration, authentication, and autonomous execution."
---

# Copilot CLI - Complete Command Reference

Comprehensive reference for all Copilot CLI commands, flags, models, configuration, and troubleshooting.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Copilot CLI is GitHub's official standalone interface for Copilot (GA Feb 2026), replacing the deprecated `gh copilot` extension. It provides terminal-based AI coding assistance powered by frontier models including GPT-5 and Claude 4.6. It features autonomous execution (Autopilot), repository-wide memory, and seamless cloud delegation for complex tasks.

### Purpose

Provide a comprehensive, single-source reference for all Copilot CLI commands, flags, models, configuration options, and autonomous modes for developers and external agents.

### When to Use

- Executing autonomous implementation tasks via Autopilot
- Looking up flags for target-specific context (shell, gh, git)
- Switching between frontier models mid-session
- Troubleshooting authentication and permission issues
- Configuring repository-level conventions and memory

### Key Sources

| Source | URL |
|--------|-----|
| **Repository** | https://github.com/github/copilot |
| **Documentation** | https://docs.github.com/copilot/cli |
| **License** | Proprietary (GitHub) |
| **Runtime** | Node.js, Homebrew, WinGet |

<!-- /ANCHOR:overview -->

<!-- ANCHOR:installation -->
## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **npm global** | `npm install -g @github/copilot` | Standalone binary: `copilot` |
| **Homebrew** | `brew install github-copilot-cli` | macOS and Linux support |
| **WinGet** | `winget install GitHub.CopilotCLI` | Windows native support |

**Platform support:**

| Platform | Status |
|----------|--------|
| macOS | Full support |
| Linux | Full support |
| Windows | Full support |

<!-- /ANCHOR:installation -->

<!-- ANCHOR:authentication -->
## 3. AUTHENTICATION

Copilot CLI requires an active GitHub Copilot subscription.

| Method | Setup | Best For |
|--------|-------|----------|
| **OAuth** | `/login` command (interactive) | Personal use, local development |
| **PAT (Primary)** | `export GH_TOKEN=...` | Scripts, CI/CD, automation |
| **PAT (Fallback)** | `export GITHUB_TOKEN=...` | Alternative environment variable |

<!-- /ANCHOR:authentication -->

<!-- ANCHOR:core-invocation -->
## 4. CORE INVOCATION

### Non-Interactive Mode (Primary for Cross-AI)

The `-p` / `--prompt` flag is the primary invocation method for external AI delegation:

```bash
copilot -p "Refactor the database schema" --allow-all-tools 2>&1
```

**CRITICAL**: Always append `2>&1` to capture both stdout and stderr.

### Interactive Mode

```bash
# Start full-screen interactive TUI
copilot

# Interactive with initial prompt
copilot "Help me debug the middleware"
```

<!-- /ANCHOR:core-invocation -->

<!-- ANCHOR:flags-reference -->
## 5. FLAGS REFERENCE

### Primary Flags

| Flag | Short | Purpose | Example |
|------|-------|---------|---------|
| `--prompt` | `-p` | Non-interactive mode | `copilot -p "Analyze logs"` |
| `--allow-all-tools` | | Auto-approve all actions | `--allow-all-tools` |
| `--target` | `-t` | Target specific context | `--target shell` |
| `--hostname` | | Enterprise hostname | `--hostname github.acme.com` |
| `--help` | `-h` | Show help information | `copilot -h` |
| `--version` | `-v` | Show version info | `copilot -v` |

### Target Contexts (`-t` / `--target`)

| Target | Description |
|--------|-------------|
| `shell` | Generic shell commands and scripting |
| `gh` | GitHub CLI specific operations |
| `git` | Git version control commands |

<!-- /ANCHOR:flags-reference -->

<!-- ANCHOR:models -->
## 6. MODELS

Copilot CLI supports a wide range of frontier models (7+).

### Available Models

| Model | Provider | Best For |
|-------|----------|----------|
| **Claude Opus 4.6** | Anthropic | Architecture & complex logic |
| **Claude Sonnet 4.6** | Anthropic | General coding & speed (Default) |
| **Claude Haiku 4.5** | Anthropic | Rapid classification & scripting |
| **GPT-5.3-Codex** | OpenAI | Advanced reasoning & code generation |
| **GPT-5 mini** | OpenAI | High-speed, cost-efficient tasks |
| **GPT-4.1** | OpenAI | Stable legacy task performance |
| **Gemini 3 Pro** | Google | Large context analysis |

### Model Switching

You can switch the active model mid-session using the interactive command:
```bash
/model
```

<!-- /ANCHOR:models -->

<!-- ANCHOR:subcommands -->
## 7. INTERACTIVE COMMANDS

Commands available within the interactive TUI environment:

| Command | Purpose |
|---------|---------|
| `/suggest` | Get command suggestions |
| `/explain` | Explain code or terminal commands |
| `/config` | Configure CLI settings and behavior |
| `/plan` | Enter Plan Mode for multi-step tasks |
| `/delegate` | Delegate task to cloud agents |
| `/model` | Switch the active AI model |
| `/login` | Authenticate with GitHub |
| `/alias` | Manage shell aliases |

<!-- /ANCHOR:subcommands -->

<!-- ANCHOR:context-hierarchy -->
## 8. CONTEXT & REPO MEMORY

### Repo Memory

Copilot CLI automatically identifies and adheres to repository-specific conventions. It maintains a memory of:
- Coding standards and style guides
- Frequently used architectural patterns
- Project-specific terminology and dependencies

### Cloud Delegation

Complex tasks can be offloaded to cloud agents for deeper processing:
- **Command**: `/delegate "Task description"`
- **Shorthand**: `&"Task description"` prefix

<!-- /ANCHOR:context-hierarchy -->

<!-- ANCHOR:session-management -->
## 9. SESSION MANAGEMENT

### Plan Mode

Plan Mode allows users to decompose complex requests into actionable, multi-step implementation plans.
- **Trigger**: `/plan` or `Shift+Tab` during an interactive session.

### Autopilot (Autonomous Execution)

Copilot CLI can operate autonomously to execute plans, run commands, and verify changes.
- **Auto-Approval**: Enabled via the `--allow-all-tools` flag in non-interactive mode.

<!-- /ANCHOR:session-management -->

<!-- ANCHOR:environment-variables -->
## 10. ENVIRONMENT VARIABLES

| Variable | Purpose |
|----------|---------|
| `GH_TOKEN` | Primary GitHub Personal Access Token |
| `GITHUB_TOKEN` | Fallback GitHub Personal Access Token |

<!-- /ANCHOR:environment-variables -->

<!-- ANCHOR:troubleshooting -->
## 11. TROUBLESHOOTING

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| `copilot: command not found` | Not installed | `npm install -g @github/copilot` |
| `Permission denied` | No subscription | Ensure your GitHub account has Copilot |
| `Auth required` | Not logged in | Execute `/login` within the CLI |
| `Tool execution blocked` | Permission mode | Use `--allow-all-tools` for autonomy |
| `Legacy extension error` | `gh copilot` active | Use standalone binary `copilot` |

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:quick-reference -->
## 12. QUICK REFERENCE CARD

```bash
# === CORE PATTERNS ===

# Non-interactive autonomous execution
copilot -p "Implement the user profile API" --allow-all-tools 2>&1

# Target specific assistance
copilot -t git -p "Fix the merge conflict in src/main.ts"

# Explain a command or script
copilot /explain "docker-compose up -d"

# Delegate to cloud agent
copilot /delegate "Audit security of @./src"

# Switch model (interactive)
/model

# Plan mode (interactive)
Shift+Tab
```
<!-- /ANCHOR:quick-reference -->
