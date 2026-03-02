---
title: "Codex CLI - Complete Command Reference"
description: "Comprehensive reference for Codex CLI flags, commands, models, configuration, authentication, sandbox modes, and troubleshooting."
---

# Codex CLI - Complete Command Reference

Comprehensive reference for all Codex CLI commands, flags, models, configuration, and troubleshooting.

---

<!-- ANCHOR:overview -->

## 1. OVERVIEW

### Core Principle

Codex CLI is OpenAI's terminal-based AI coding agent powered by the `gpt-5.3-codex` model with `xhigh` reasoning effort. It provides direct access to OpenAI's code-focused capabilities from the command line, including code generation, file manipulation, shell execution, web browsing, and multi-turn sessions — all governed by configurable sandbox modes.

### Purpose

Provide a comprehensive, single-source reference for all Codex CLI commands, flags, models, configuration options, sandbox modes, and troubleshooting guidance.

### When to Use

- Setting up or configuring Codex CLI
- Looking up command-line flags, subcommands, or agent configurations
- Troubleshooting authentication, sandbox, or session issues
- Configuring agents via `.codex/agents/*.toml`
- Selecting the right sandbox mode for a task

### Key Sources

| Source | URL |
|--------|-----|
| **Repository** | https://github.com/openai/codex |
| **License** | MIT |
| **Runtime** | Node.js 18+ |

<!-- /ANCHOR:overview -->

<!-- ANCHOR:installation -->

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **npm global** | `npm i -g @openai/codex` | Persistent install, recommended for scripts |
| **Homebrew** | `brew install --cask codex` | macOS-native, auto-updates via `brew upgrade` |
| **Upgrade (npm)** | `npm update -g @openai/codex` | Update to latest version |
| **Upgrade (Homebrew)** | `brew upgrade --cask codex` | Update via Homebrew |

**Platform support:**

| Platform | Status |
|----------|--------|
| macOS | Full support |
| Linux | Full support |
| Windows (WSL) | Experimental — use WSL 2 for best results |

After installation, run `codex` for the full-screen TUI or `codex exec "prompt" --model gpt-5.3-codex` for non-interactive use.

<!-- /ANCHOR:installation -->

<!-- ANCHOR:authentication -->

## 3. AUTHENTICATION

Codex CLI supports two authentication methods:

| Method | Setup | Best For |
|--------|-------|----------|
| **OpenAI API Key** | `export OPENAI_API_KEY=your-key` | Scripts, CI/CD, automation |
| **OAuth via ChatGPT** | `codex login` (browser flow) | Personal use; requires Plus/Pro/Business/Edu/Enterprise account |

**Priority order:** `OPENAI_API_KEY` environment variable is checked first. If not set, OAuth credentials from `codex login` are used.

**Set API key via environment variable:**

```bash
export OPENAI_API_KEY="sk-..."
```

**OAuth login/logout:**

```bash
# Authenticate via ChatGPT account (opens browser)
codex login

# View authentication status
codex features

# Log out and clear stored credentials
codex logout
```

**OAuth account eligibility:** ChatGPT Plus, Pro, Business, Edu, or Enterprise accounts only. Free-tier ChatGPT accounts are not supported.

<!-- /ANCHOR:authentication -->

<!-- ANCHOR:command-line-flags -->

## 4. COMMAND-LINE FLAGS

### Essential Flags

| Flag | Short | Values | Description |
|------|-------|--------|-------------|
| `--model` | `-m` | `gpt-5.3-codex` | Model to use (only one model supported) |
| `--sandbox` | `-s` | `read-only`, `workspace-write`, `danger-full-access` | Sandbox mode controlling file/shell access |
| `--ask-for-approval` | `-a` | `untrusted`, `on-request`, `never` | When to prompt for approval before executing actions |
| `--profile` | `-p` | profile-name | Load a named configuration profile |
| `--image` | `-i` | file-path | Attach an image (PNG or JPEG) to the prompt |
| `--full-auto` | | (none) | Low-friction mode with relaxed approvals (use sparingly) |
| `--oss` | | (none) | Use local open-source models via Ollama instead of OpenAI |
| `--search` | | (none) | Enable live web browsing during the session |

### Profile & Review Flags

| Flag | Description |
|------|-------------|
| `--profile <name>` / `-p` | Load a named configuration profile from `[profiles.<name>]` in config.toml |
| `exec review` | Built-in subcommand for git diff-aware code review (supports `--commit`, `--base`, `--uncommitted`) |

### Approval Mode Values

| Value | Behavior |
|-------|----------|
| `untrusted` | Prompt for approval on all actions (most cautious) |
| `on-request` | Prompt only when the agent marks an action as requiring approval |
| `never` | Never prompt; auto-approve all actions |

### Sandbox Mode Values

| Value | File Access | Shell Commands | Best For |
|-------|-------------|----------------|----------|
| `read-only` | Read files only | Restricted | Exploration, analysis, review |
| `workspace-write` | Read + write workspace files | Controlled | Code generation, documentation |
| `danger-full-access` | Full filesystem + shell | Unrestricted | Migration, scripted automation |

### Usage Examples

```bash
# Interactive TUI
codex

# Non-interactive: exec subcommand
codex exec "Refactor utils.ts to use async/await" --model gpt-5.3-codex

# With sandbox mode
codex exec "Add error handling to auth.ts" --sandbox workspace-write --model gpt-5.3-codex

# With approval control
codex exec "Clean up deprecated files" --ask-for-approval untrusted --model gpt-5.3-codex

# Full-auto mode (relaxed approvals)
codex exec "Run the test suite and fix failures" --full-auto --model gpt-5.3-codex

# Attach an image
codex exec "Implement this UI component" --image wireframe.png --model gpt-5.3-codex

# Enable web search
codex exec "Research and implement OAuth2 PKCE flow" --search --model gpt-5.3-codex

# Load a named profile
codex exec "Review this PR" --profile review --model gpt-5.3-codex

# Use local OSS model via Ollama
codex exec "Refactor this function" --oss
```

<!-- /ANCHOR:command-line-flags -->

<!-- ANCHOR:model-selection -->

## 5. MODEL SELECTION

### Supported Model

| Model | Reasoning Effort | Description |
|-------|-----------------|-------------|
| `gpt-5.3-codex` | `xhigh` | The only supported model. Code-focused, maximum reasoning effort. Use for all tasks. |

### Selection Strategy

`gpt-5.3-codex` is the only supported model and is always invoked with `xhigh` reasoning effort. Always specify `--model gpt-5.3-codex` explicitly in scripts for predictability; omitting it relies on the CLI default, which may change across versions.

### Command-Line Specification

```bash
# Always specify the model explicitly
codex exec "Analyze this architecture" --model gpt-5.3-codex
codex exec "Write unit tests for user.ts" --model gpt-5.3-codex
```

### Agent TOML Configuration

```toml
# .codex/agents/my-agent.toml
model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"
```

<!-- /ANCHOR:model-selection -->

<!-- ANCHOR:output-handling -->

## 6. OUTPUT HANDLING

### exec Mode Output

`codex exec` writes its output to stdout. Use shell redirection or command substitution to capture it.

```bash
# Capture to file
codex exec "Generate a TypeScript interface for the User model" \
  --model gpt-5.3-codex > /tmp/user-interface.ts

# Capture to variable
RESULT=$(codex exec "List all exported functions in src/" --model gpt-5.3-codex)
echo "$RESULT"

# Pipe to another command
codex exec "Generate SQL schema for users table" --model gpt-5.3-codex | psql -d mydb -f -

# Redirect stderr separately
codex exec "Analyze auth flow" --model gpt-5.3-codex > /tmp/analysis.txt 2>/tmp/errors.txt
```

### Requesting JSON Output

Codex does not have a native `--output json` flag. Instead, instruct the model to output JSON in the prompt:

```bash
# Request JSON explicitly in the prompt
codex exec "Analyze src/auth.ts. Return JSON: {functions: [{name, lines, complexity}], issues: [{line, severity, description}]}" \
  --model gpt-5.3-codex > /tmp/analysis.json

# Parse with jq
jq '.issues[] | select(.severity == "high")' /tmp/analysis.json
```

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| Non-zero | Error (check stderr for details) |

<!-- /ANCHOR:output-handling -->

<!-- ANCHOR:interactive-commands -->

## 7. INTERACTIVE COMMANDS

When running `codex` in interactive (full-screen TUI) mode, these slash commands are available:

| Command | Description |
|---------|-------------|
| `/review` | Review and approve/reject pending actions |
| `/model` | Display or switch the current model |
| `/help` | Show all available commands |

### Inline Prompting

In the TUI, type your prompt directly and press Enter. Multi-line input is supported. Use Ctrl+C to cancel the current generation.

### Session Operations in TUI

All session management is accessible from the TUI home screen when running `codex` without arguments:

- Select an existing session to resume it
- Start a new session from scratch
- Fork an existing session to branch it

<!-- /ANCHOR:interactive-commands -->

<!-- ANCHOR:special-input-syntax -->

## 8. SPECIAL INPUT SYNTAX

### File References

Codex supports `@file` references to include file contents in the prompt context:

```bash
# Single file
codex exec "@src/utils.ts Explain this file" --model gpt-5.3-codex

# Multiple files
codex exec "@src/auth.ts @src/session.ts Find the circular dependency" \
  --model gpt-5.3-codex

# In the TUI
# Type: @src/utils.ts refactor this to use the repository pattern
```

### Shell Integration

Use standard shell mechanisms to combine Codex with other tools:

```bash
# Pass git diff as context
git diff HEAD~1 | codex exec "Summarize these changes" --model gpt-5.3-codex

# Combine file content with prompt
cat src/auth.ts | codex exec "Add input validation to all functions" \
  --model gpt-5.3-codex

# Pass error output for debugging
npm test 2>&1 | codex exec "Fix these failing tests" --sandbox workspace-write \
  --model gpt-5.3-codex
```

### instructions.md Context File

Place an `instructions.md` in `.codex/` to inject persistent project context into every Codex session:

```markdown
# Project Context

## Architecture
- TypeScript monorepo with pnpm workspaces
- Express.js API with PostgreSQL (Prisma ORM)
- JWT authentication with refresh token rotation

## Conventions
- Functional style; avoid classes except for Error types
- All public exports must have JSDoc
- Use Result<T, E> pattern for error handling

## Do Not
- Modify prisma/schema.prisma without explicit instruction
- Add npm dependencies without justification
```

<!-- /ANCHOR:special-input-syntax -->

<!-- ANCHOR:configuration-files -->

## 9. CONFIGURATION FILES

### Directory Structure

```
.codex/
├── config.toml          # Global CLI configuration
├── instructions.md      # Persistent project context (injected into all sessions)
└── agents/
    ├── context.toml
    ├── debug.toml
    ├── handover.toml
    ├── orchestrate.toml
    ├── research.toml
    ├── review.toml
    ├── speckit.toml
    ├── ultra-think.toml
    └── write.toml
```

### config.toml Format

```toml
# .codex/config.toml
model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"
sandbox_mode = "workspace-write"
ask_for_approval = "on-request"
```

### Agent TOML Format

Each agent is a `.toml` file in `.codex/agents/`. Fields:

```toml
# .codex/agents/example.toml

# Model configuration
model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"

# Sandbox mode for this agent
sandbox_mode = "read-only"          # read-only | workspace-write | danger-full-access

# Agent instructions (developer-level system prompt)
developer_instructions = """
You are a specialized agent for [purpose].
[Detailed behavioral instructions here.]
"""
```

### Invocation with Named Profile

```bash
# Named profile via -p / --profile flag
codex exec -p review "Review src/auth.ts for security issues" --model gpt-5.3-codex

# Git diff review via built-in subcommand
codex exec review "Focus on security issues" --commit HEAD --model gpt-5.3-codex
codex review --uncommitted  # top-level shorthand

# Profile with sandbox override
codex exec -p debug "Fix the auth bug" -s workspace-write --model gpt-5.3-codex
```

### Profile Configuration

Named profiles allow switching between preset configurations. Profiles are defined in `config.toml` under `[profiles.<name>]` sections:

```toml
# ~/.codex/config.toml or .codex/config.toml
[profiles.review]
sandbox_mode = "read-only"
model_reasoning_effort = "xhigh"

[profiles.debug]
sandbox_mode = "workspace-write"
model_reasoning_effort = "xhigh"
```

```bash
# Use a named profile
codex exec -p review "Audit this codebase" --model gpt-5.3-codex
```

**Note:** The `.codex/agents/*.toml` files define agent personas for the interactive multi-agent TUI feature (requires `multi_agent` feature flag). They are NOT loaded by the `-p` profile flag. To use agent-specific settings in `codex exec`, define corresponding `[profiles.<name>]` sections in config.toml.

<!-- /ANCHOR:configuration-files -->

<!-- ANCHOR:sandbox-modes -->

## 10. SANDBOX MODES

Sandbox modes control what Codex is permitted to do during execution. Always choose the least-permissive mode that allows the task to complete.

### Mode Reference

| Mode | Flag Value | File Access | Shell Commands | Use Case |
|------|-----------|-------------|----------------|----------|
| **read-only** | `--sandbox read-only` | Read only | Restricted | Analysis, review, exploration, context mapping |
| **workspace-write** | `--sandbox workspace-write` | Read + write project files | Controlled | Code generation, refactoring, documentation |
| **danger-full-access** | `--sandbox danger-full-access` | Full filesystem | Unrestricted | System-level operations, migration scripts |

### Safety Guidance

```bash
# SAFE: Read-only for analysis
codex exec "Map the authentication flow" \
  --sandbox read-only --model gpt-5.3-codex

# STANDARD: Workspace-write for code changes
codex exec "Add error handling to all API routes" \
  --sandbox workspace-write --model gpt-5.3-codex

# ELEVATED RISK: Full access — use only when necessary and review all changes
codex exec "Migrate database schema and update all dependent files" \
  --sandbox danger-full-access --ask-for-approval untrusted --model gpt-5.3-codex
```

### Mode Selection Heuristic

1. **Read-only first:** Start with read-only for exploration and analysis tasks.
2. **Workspace-write for generation:** Use when Codex must create or modify files in the project.
3. **Full-access sparingly:** Reserve for tasks that genuinely require system-level access. Always pair with `--ask-for-approval untrusted`.

<!-- /ANCHOR:sandbox-modes -->

<!-- ANCHOR:session-management -->

## 11. SESSION MANAGEMENT

### Session Subcommands

| Subcommand | Description |
|------------|-------------|
| `codex` | Launch TUI; shows session picker on startup |
| `codex resume` | Resume a previous session interactively |
| `codex resume <session-id>` | Resume a specific session by ID |
| `codex fork` | Fork (branch) the current session to create a divergent copy |
| `codex fork <session-id>` | Fork a specific session by ID |

### Session Picker

Running `codex` without arguments opens the full-screen TUI with a session picker. Select an existing session to resume it, or start a new session.

### Scripted Session Resume

```bash
# Resume a known session ID non-interactively
codex exec --session-id abc123 "Continue implementing the rate limiter" \
  --model gpt-5.3-codex

# Fork a session before a risky operation
FORK_ID=$(codex fork abc123)
codex exec --session-id "$FORK_ID" "Attempt the migration" \
  --sandbox workspace-write --model gpt-5.3-codex
```

### When to Use Each Operation

| Operation | When to Use |
|-----------|-------------|
| `resume` | Continue a multi-step task with existing context |
| `fork` | Try a different approach without losing the original session |
| New session | Fresh context; previous session is not relevant |

<!-- /ANCHOR:session-management -->

<!-- ANCHOR:subcommands -->

## 12. SUBCOMMANDS

| Subcommand | Description |
|------------|-------------|
| `codex exec` | Non-interactive execution; runs a single prompt and exits |
| `codex resume` | Resume a previous session |
| `codex fork` | Fork (branch) the current or a named session |
| `codex login` | Authenticate via ChatGPT OAuth (opens browser) |
| `codex logout` | Log out and clear stored OAuth credentials |
| `codex features` | Display available features and authentication status |
| `codex mcp` | Manage MCP (Model Context Protocol) server connections |
| `codex cloud` | Manage cloud-based session storage and sync |
| `codex apply` | Apply a previously generated diff/patch |

<!-- /ANCHOR:subcommands -->

<!-- ANCHOR:troubleshooting -->

## 13. TROUBLESHOOTING

| Problem | Cause | Solution |
|---------|-------|----------|
| `OPENAI_API_KEY not set` | No authentication configured | Set `OPENAI_API_KEY` env var or run `codex login` for OAuth |
| `Authentication failed` | Expired or invalid credentials | Re-run `codex login` or regenerate API key at platform.openai.com |
| `OAuth not eligible` | Free-tier ChatGPT account | Upgrade to Plus/Pro/Business/Edu/Enterprise |
| `Permission denied` on file | Sandbox mode too restrictive | Upgrade to `workspace-write` or `danger-full-access` as needed |
| `Command not found: codex` | Not installed or not in PATH | Run `npm i -g @openai/codex`; verify with `which codex` |
| Session resume fails | Session ID invalid or expired | List sessions via TUI; start a new session |
| Slow response | Large context or complex task | Break task into smaller steps; use `--sandbox read-only` for analysis |
| Unexpected file changes | Sandbox too permissive | Use `--ask-for-approval untrusted` with elevated sandbox modes |
| `--oss` model not responding | Ollama not running or no model loaded | Start Ollama: `ollama serve`; pull a model: `ollama pull codellama` |
| Web search not working | `--search` flag not specified | Add `--search` flag to enable live browsing |
| Windows compatibility | WSL not configured | Use WSL 2; native Windows support is experimental |
| Image not accepted | Unsupported format | Use PNG or JPEG only; convert other formats first |

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:environment-variables -->

## 14. ENVIRONMENT VARIABLES

| Variable | Purpose | Example |
|----------|---------|---------|
| `OPENAI_API_KEY` | API key authentication (highest priority) | `sk-...` |
| `CODEX_MODEL` | Default model override | `gpt-5.3-codex` |
| `CODEX_SANDBOX` | Default sandbox mode | `read-only`, `workspace-write`, `danger-full-access` |
| `CODEX_APPROVAL` | Default approval mode | `untrusted`, `on-request`, `never` |
| `NO_COLOR` | Disable colored output | `1` |

<!-- /ANCHOR:environment-variables -->
