---
title: "Claude Code CLI - Complete Command Reference"
description: "Comprehensive reference for Claude Code CLI flags, commands, models, configuration, authentication, permission modes, and troubleshooting."
---

# Claude Code CLI - Complete Command Reference

Comprehensive reference for all Claude Code CLI commands, flags, models, configuration, and troubleshooting.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Claude Code is Anthropic's official CLI for Claude, providing terminal-based AI coding assistance powered by Claude models (Opus, Sonnet, Haiku). It offers deep reasoning via extended thinking, surgical code editing, schema-validated structured output, agent delegation, and persistent memory — all from the command line.

### Purpose

Provide a comprehensive, single-source reference for all Claude Code CLI commands, flags, models, configuration options, permission modes, and troubleshooting guidance for external AI assistants delegating tasks.

### When to Use

- Setting up or configuring Claude Code CLI
- Looking up command-line flags, subcommands, or agent configurations
- Troubleshooting authentication, permission, or session issues
- Selecting the right model and permission mode for a task
- Understanding output formats and structured output options

### Key Sources

| Source | URL |
|--------|-----|
| **Repository** | https://github.com/anthropics/claude-code |
| **Documentation** | https://docs.anthropic.com/en/docs/claude-code |
| **License** | Proprietary (Anthropic) |
| **Runtime** | Node.js 18+ |

<!-- /ANCHOR:overview -->

<!-- ANCHOR:installation -->

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **npm global** | `npm install -g @anthropic-ai/claude-code` | Persistent install, recommended |
| **Upgrade** | `npm update -g @anthropic-ai/claude-code` or `claude update` | Update to latest version |

**Platform support:**

| Platform | Status |
|----------|--------|
| macOS | Full support |
| Linux | Full support |
| Windows | Experimental |

After installation, run `claude` for interactive mode or `claude -p "prompt"` for non-interactive use.

<!-- /ANCHOR:installation -->

<!-- ANCHOR:authentication -->

## 3. AUTHENTICATION

Claude Code CLI supports multiple authentication methods:

| Method | Setup | Best For |
|--------|-------|----------|
| **API Key** | `export ANTHROPIC_API_KEY=sk-ant-...` | Scripts, CI/CD, automation |
| **OAuth** | `claude auth login` (browser flow) | Personal use, interactive |
| **Token Setup** | `claude setup-token` | Non-interactive CI/CD pipelines |

**Priority order:** `ANTHROPIC_API_KEY` environment variable is checked first. If not set, OAuth credentials are used.

**Set API key via environment variable:**

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

**OAuth login/logout:**

```bash
# Authenticate via browser (opens OAuth flow)
claude auth login

# View authentication status
claude auth status

# Log out
claude auth logout
```

**Non-interactive token setup (CI/CD):**

```bash
# Pipe token from environment
echo "$ANTHROPIC_API_KEY" | claude setup-token
```

<!-- /ANCHOR:authentication -->

<!-- ANCHOR:core-invocation -->

## 4. CORE INVOCATION

### Non-Interactive Mode (Primary for Cross-AI)

The `-p` / `--print` flag is the primary invocation method for external AI delegation:

```bash
claude -p "prompt" --output-format text 2>&1
```

**CRITICAL**: Always append `2>&1` to capture both stdout and stderr.

### Interactive Mode

```bash
# Full-screen TUI (not suitable for cross-AI delegation)
claude

# Interactive with initial prompt
claude "Start by reviewing the auth module"
```

### Key Differences

| Mode | Flag | Output | Use Case |
|------|------|--------|----------|
| Non-interactive | `-p "prompt"` | stdout only, then exits | Cross-AI delegation, scripts, CI/CD |
| Interactive | (none) | Full TUI | Direct human use |

<!-- /ANCHOR:core-invocation -->

<!-- ANCHOR:flags-reference -->

## 5. FLAGS REFERENCE

### Primary Flags

| Flag | Short | Purpose | Example |
|------|-------|---------|---------|
| `--print` | `-p` | Non-interactive mode | `claude -p "Review this code"` |
| `--model` | | Model selection | `--model claude-sonnet-4-6` |
| `--output-format` | | Output format | `--output-format text` |
| `--permission-mode` | | Permission level | `--permission-mode plan` |
| `--agent` | | Route to agent | `--agent review` |
| `--json-schema` | | Schema validation | `--json-schema '{"type":"object",...}'` |
| `--max-budget-usd` | | Cost cap | `--max-budget-usd 1.00` |
| `--effort` | | Thinking effort | `--effort high` |

### Session Management Flags

| Flag | Purpose | Example |
|------|---------|---------|
| `--continue` | Continue most recent conversation | `claude -p "Now fix it" --continue` |
| `--resume` | Resume specific session by ID | `claude -p "Continue" --resume abc123` |
| `--fork-session` | Fork from a specific session | `claude --fork-session abc123` |

### Output Format Flags

| Format | Flag | Description |
|--------|------|-------------|
| **Text** | `--output-format text` | Plain text (default for `-p`) |
| **JSON** | `--output-format json` | JSON with metadata: `{role, content, cost, duration}` |
| **Stream JSON** | `--output-format stream-json` | Newline-delimited JSON for real-time processing |

### Permission Mode Flags

| Mode | Flag | Behavior |
|------|------|----------|
| **Default** | (no flag) | Prompts for approval on writes and commands |
| **Accept Edits** | `--permission-mode acceptEdits` | Auto-approves file edits, prompts for shell commands |
| **Plan** | `--permission-mode plan` | Read-only — no file writes, no shell commands |
| **Don't Ask** | `--permission-mode dontAsk` | Skips unapproved tools silently |
| **Bypass** | `--permission-mode bypassPermissions` | Auto-approves everything — **dangerous** |

### Effort Level

| Level | Flag | Behavior |
|-------|------|----------|
| **Default** | (no flag) | Standard reasoning depth |
| **High** | `--effort high` | Extended thinking with deep chain-of-thought |
| **Low** | `--effort low` | Faster, less detailed responses |

### Other Flags

| Flag | Purpose |
|------|---------|
| `--verbose` | Show detailed processing information |
| `--max-turns N` | Limit conversation turns |
| `--system-prompt "..."` | Override system prompt |
| `--append-system-prompt "..."` | Append to system prompt |
| `--allowedTools "tool1,tool2"` | Restrict available tools |
| `--disallowedTools "tool1,tool2"` | Disable specific tools |
| `--add-dir /path` | Add directory to context |

<!-- /ANCHOR:flags-reference -->

<!-- ANCHOR:models -->

## 6. MODELS

### Available Models

| Model | ID | Strengths | Cost | Best For |
|-------|----|-----------|------|----------|
| **Opus** | `claude-opus-4-6` | Deepest reasoning, highest quality | Highest | Architecture decisions, complex trade-offs, extended thinking |
| **Sonnet** | `claude-sonnet-4-6` | Balanced quality and speed | Medium | General tasks, code generation, reviews — **default** |
| **Haiku** | `claude-haiku-4-5-20251001` | Fastest, most cost-effective | Lowest | Classification, formatting, simple queries, batch ops |

### Model Selection Guide

```
Is the task complex (architecture, trade-offs, multi-step reasoning)?
  YES → claude-opus-4-6 with --effort high
  NO  → Is the task trivial (classify, format, simple extraction)?
          YES → claude-haiku-4-5-20251001
          NO  → claude-sonnet-4-6 (default)
```

### Usage Examples

```bash
# Opus for deep reasoning
claude -p "Design the data model for a multi-tenant SaaS platform" \
  --model claude-opus-4-6 --effort high --output-format text 2>&1

# Sonnet for general tasks (default)
claude -p "Refactor this function to use async/await" \
  --model claude-sonnet-4-6 --output-format text 2>&1

# Haiku for fast classification
claude -p "Classify these 50 log entries by severity" \
  --model claude-haiku-4-5-20251001 --output-format text 2>&1
```

<!-- /ANCHOR:models -->

<!-- ANCHOR:subcommands -->

## 7. SUBCOMMANDS

| Subcommand | Purpose | Example |
|------------|---------|---------|
| `claude agents` | List available agents | `claude agents list` |
| `claude auth` | Authentication management | `claude auth login` / `claude auth logout` |
| `claude mcp` | MCP server management | `claude mcp list` / `claude mcp serve` |
| `claude plugin` | Plugin management | `claude plugin list` |
| `claude setup-token` | Non-interactive auth setup | `echo "$KEY" \| claude setup-token` |
| `claude update` | Update CLI to latest version | `claude update` |

<!-- /ANCHOR:subcommands -->

<!-- ANCHOR:context-hierarchy -->

## 8. CONTEXT HIERARCHY (CLAUDE.md)

Claude Code automatically loads context from CLAUDE.md files in a hierarchy:

| Level | Path | Scope |
|-------|------|-------|
| **Global** | `~/.claude/CLAUDE.md` | All projects for this user |
| **Project** | `PROJECT_ROOT/CLAUDE.md` | Current project |
| **Local** | `SUBDIR/CLAUDE.md` | Current directory (additive) |

**Context loading**: All three levels are merged. Project and local instructions override global where they conflict. Local instructions are additive.

**File references**: Use `@./path/to/file` in prompts to include file contents:

```bash
claude -p "Review @./src/auth.ts and @./src/middleware.ts for security issues" \
  --permission-mode plan --output-format text 2>&1
```

<!-- /ANCHOR:context-hierarchy -->

<!-- ANCHOR:structured-output -->

## 9. STRUCTURED OUTPUT

### JSON Schema Validation

Claude Code can produce schema-validated JSON output using `--json-schema`:

```bash
claude -p "Analyze src/utils.ts" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"params":{"type":"string"},"returnType":{"type":"string"},"complexity":{"type":"string"}}}},"issues":{"type":"array","items":{"type":"object","properties":{"line":{"type":"number"},"severity":{"type":"string"},"description":{"type":"string"}}}}}}' \
  --output-format json 2>&1
```

### Output Format Comparison

| Format | Use When | Parsing |
|--------|----------|---------|
| `text` | Human consumption, simple integration | Direct string |
| `json` | Programmatic processing with metadata | `jq` or JSON parser |
| `json` + `--json-schema` | Guaranteed structure for pipelines | Schema-validated parse |
| `stream-json` | Real-time processing, progress tracking | Line-by-line JSON |

### Parsing JSON Output

```bash
# Extract content from JSON output
claude -p "List functions in src/utils.ts" --output-format json 2>&1 | jq -r '.result'

# With schema validation
claude -p "..." --json-schema '{"type":"object",...}' --output-format json 2>&1 | jq '.result'
```

<!-- /ANCHOR:structured-output -->

<!-- ANCHOR:session-management -->

## 10. SESSION MANAGEMENT

### Continue Last Session

```bash
# Continue the most recent conversation
claude -p "Now apply the suggested fixes" --continue --output-format text 2>&1
```

### Resume Specific Session

```bash
# Resume by session ID
claude -p "Continue where we left off" --resume SESSION_ID --output-format text 2>&1
```

### Fork Session

```bash
# Fork from an existing session to try a different approach
claude --fork-session SESSION_ID -p "Try a different approach" --output-format text 2>&1
```

### Session IDs

Session IDs appear in JSON output format:

```bash
# Get session ID from JSON output
claude -p "Start analyzing the auth module" --output-format json 2>&1 | jq -r '.session_id'
```

<!-- /ANCHOR:session-management -->

<!-- ANCHOR:environment-variables -->

## 11. ENVIRONMENT VARIABLES

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API key for authentication |
| `CLAUDECODE` | Set when running inside Claude Code (nesting detection) |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Disable telemetry |
| `CLAUDE_MODEL` | Default model override |

### Nesting Detection

**CRITICAL**: The `CLAUDECODE` environment variable is automatically set when running inside a Claude Code session. External AIs must check this before invoking:

```bash
# Check for nesting — abort if already inside Claude Code
if [ -n "$CLAUDECODE" ]; then
    echo "ERROR: Cannot invoke Claude Code from within a Claude Code session"
    exit 1
fi
```

<!-- /ANCHOR:environment-variables -->

<!-- ANCHOR:troubleshooting -->

## 12. TROUBLESHOOTING

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| `claude: command not found` | Not installed | `npm install -g @anthropic-ai/claude-code` |
| `ANTHROPIC_API_KEY not set` | No authentication | `export ANTHROPIC_API_KEY=sk-ant-...` |
| `Already inside Claude Code` | Nesting detected | Exit current session or use different terminal |
| Rate limit (429) | Too many requests | Wait for retry-after header; reduce frequency |
| Budget exceeded | `--max-budget-usd` cap hit | Increase budget or simplify prompt |
| Permission denied | Wrong permission mode | Use `--permission-mode plan` for read-only |
| Schema validation failed | JSON schema mismatch | Verify schema matches expected output structure |
| Context too large | Prompt + files exceed limit | Use `@` to reference specific files, not directories |
| Agent not found | Invalid agent name | Run `claude agents list` to see available agents |
| Session not found | Invalid resume ID | Check session ID from previous JSON output |
| Timeout | Long-running task | Use `--max-turns` to limit or run in background |

### Common Patterns

```bash
# Verbose mode for debugging
claude -p "..." --verbose --output-format text 2>&1

# Restrict tools for safety
claude -p "..." --allowedTools "Read,Glob,Grep" --output-format text 2>&1

# Cost-controlled execution
claude -p "..." --max-budget-usd 0.25 --output-format text 2>&1
```

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:quick-reference -->

## 13. QUICK REFERENCE CARD

```bash
# === ESSENTIAL PATTERNS ===

# Non-interactive (primary for cross-AI)
claude -p "prompt" --output-format text 2>&1

# Model selection
claude -p "prompt" --model claude-opus-4-6 --output-format text 2>&1
claude -p "prompt" --model claude-sonnet-4-6 --output-format text 2>&1
claude -p "prompt" --model claude-haiku-4-5-20251001 --output-format text 2>&1

# Permission modes
claude -p "prompt" --permission-mode plan --output-format text 2>&1          # read-only
claude -p "prompt" --permission-mode acceptEdits --output-format text 2>&1   # auto-approve edits

# Structured output
claude -p "prompt" --json-schema '{"type":"object",...}' --output-format json 2>&1

# Agent delegation
claude -p "prompt" --agent review --output-format text 2>&1

# Session management
claude -p "prompt" --continue --output-format text 2>&1
claude -p "prompt" --resume SESSION_ID --output-format text 2>&1

# Cost control
claude -p "prompt" --max-budget-usd 1.00 --output-format text 2>&1

# Background execution
claude -p "prompt" --output-format text 2>&1 &
```

<!-- /ANCHOR:quick-reference -->
