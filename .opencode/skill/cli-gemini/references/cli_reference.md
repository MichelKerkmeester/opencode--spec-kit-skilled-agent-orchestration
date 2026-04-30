---
title: "Gemini CLI - Complete Command Reference"
description: "Comprehensive reference for Gemini CLI flags, commands, models, configuration, authentication, rate limits, and troubleshooting."
---

# Gemini CLI - Complete Command Reference

Comprehensive reference for all Gemini CLI commands, flags, models, configuration, and troubleshooting.

---

## 1. OVERVIEW

### Core Principle

Gemini CLI is Google's open-source, terminal-based AI agent powered by Gemini models. It provides direct access to Gemini's capabilities from the command line, including code generation, file manipulation, web search, and multi-turn conversations.

### Purpose

Provide a comprehensive, single-source reference for all Gemini CLI commands, flags, models, configuration options, and troubleshooting guidance.

### When to Use

- Setting up or configuring Gemini CLI
- Looking up command-line flags, slash commands, or input syntax
- Troubleshooting authentication, rate limits, or configuration issues
- Selecting the right model for a task
- Configuring MCP servers or environment variables

### Key Sources

| Source | URL |
|--------|-----|
| **Repository** | https://github.com/google-gemini/gemini-cli |
| **License** | Apache 2.0 |
| **Runtime** | Node.js 20+ |

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **npx (recommended)** | `npx https://github.com/google-gemini/gemini-cli` | Always latest, no install |
| **npm global** | `npm install -g @google/gemini-cli` | Persistent install |
| **Homebrew** | `brew install gemini-cli` | macOS/Linux |
| **From source** | `git clone` + `npm install` + `npm run build` | Development |

After installation, run `gemini` to start the interactive REPL or pipe input for non-interactive use.

## 3. AUTHENTICATION

Gemini CLI supports three authentication methods, checked in priority order:

| Method | Setup | Best For |
|--------|-------|----------|
| **Google AI API Key** | `export GEMINI_API_KEY=your-key` or set in `settings.json` | Quick start, scripts, CI/CD |
| **OAuth (Google Login)** | Run `gemini` and follow browser prompt | Personal use, full quota |
| **Vertex AI** | `export GOOGLE_CLOUD_PROJECT=project-id` + `gcloud auth` | Enterprise, GCP integration |

**Priority order:** API Key > OAuth > Vertex AI (first available is used).

Set API key in settings.json:
```json
{
  "apiKey": "AIza..."
}
```

Or use environment variable:
```bash
export GEMINI_API_KEY="AIza..."
```

## 4. COMMAND-LINE FLAGS

### Essential Flags

| Flag | Short | Values | Description |
|------|-------|--------|-------------|
| `--yolo` | `-y` | (none) | Auto-approve all tool calls without confirmation |
| `--output` | `-o` | `text`, `json`, `stream-json` | Output format (default: text) |
| `--model` | `-m` | model name | Override default model selection |
| `--resume` | `-r` | session-id | Resume a previous session |
| `--sandbox` | `-s` | `docker`, `none` | Sandbox mode for tool execution |
| `--debug` | `-d` | (none) | Enable debug logging |
| `--version` | `-v` | (none) | Print version information |
| `--approval-mode` | | `always`, `unless-allow-listed`, `never` | Tool approval behavior |
| `--include-directories` | | path(s) | Additional directories to include in context |
| `--allowed-tools` | | tool names | Restrict which tools Gemini can use |
| `--prompt-interactive` | `-i` | (none) | Enter interactive mode after processing piped input |

### Session Management Flags

| Flag | Description |
|------|-------------|
| `--list-sessions` | List all saved sessions |
| `--resume <id>` | Resume a specific session by ID |
| `--delete-session <id>` | Delete a saved session |
| `--checkpoint` | Create a named checkpoint in current session |

### Usage Examples

```bash
# Non-interactive with text output
echo "Explain this codebase" | gemini

# Non-interactive with JSON output
echo "List all TODO comments" | gemini -o json

# YOLO mode (auto-approve all actions)
gemini -y "Refactor utils.ts to use async/await"

# Specific model
gemini -m gemini-3.1-pro-preview "Analyze this architecture"

# Resume previous session
gemini -r abc123

# Restrict tools
gemini --allowed-tools read_file,search_file_content "Find the bug"

# Piped input then interactive
cat error.log | gemini -i "What caused this?"
```

## 5. MODEL SELECTION

### Supported Model

| Model | Description |
|-------|-------------|
| `gemini-3.1-pro-preview` | The only supported model. Use for all tasks. |

### Selection Strategy

`gemini-3.1-pro-preview` is the only supported model. Use it for all tasks regardless of complexity.

### Command-Line Override

```bash
gemini -m gemini-3.1-pro-preview "Quick formatting fix"
gemini -m gemini-3.1-pro-preview "Design the authentication system"
```

### Settings Override

```json
{
  "model": "gemini-3.1-pro-preview"
}
```

## 6. OUTPUT FORMATS

### Text (default)

```bash
echo "Summarize this file" | gemini -o text
```

Standard human-readable output with markdown formatting.

### JSON

```bash
echo "List all functions in src/" | gemini -o json
```

Returns structured JSON response:

```json
{
  "response": "...",
  "toolCalls": [
    {
      "name": "read_file",
      "args": { "path": "src/index.ts" },
      "result": "..."
    }
  ],
  "stats": {
    "totalInputTokens": 1250,
    "totalOutputTokens": 340,
    "totalTurns": 2,
    "toolCallCount": 3,
    "duration": "4.2s"
  }
}
```

### Stream JSON

```bash
echo "Generate tests" | gemini -o stream-json
```

Outputs newline-delimited JSON objects as they are produced, suitable for real-time processing.

## 7. INTERACTIVE SLASH COMMANDS

When running in interactive (REPL) mode, these commands are available:

| Command | Description |
|---------|-------------|
| `/help` | Show all available commands |
| `/chat save` | Save current conversation |
| `/chat resume` | Resume a saved conversation |
| `/chat share` | Share conversation (generates link) |
| `/clear` | Clear conversation history |
| `/compress` | Compress context to reduce token usage |
| `/copy` | Copy last response to clipboard |
| `/memory show` | Display current memory contents |
| `/memory refresh` | Reload memory from disk |
| `/memory add <text>` | Add entry to persistent memory |
| `/mcp list` | List connected MCP servers |
| `/mcp refresh` | Reconnect MCP servers |
| `/mcp auth` | Re-authenticate MCP connections |
| `/model set <model>` | Switch model mid-conversation |
| `/restore` | Restore from a checkpoint |
| `/directory add <path>` | Add directory to context |
| `/skills list` | List available skills |
| `/skills link <url>` | Link an external skill |
| `/skills enable <name>` | Enable a skill |
| `/skills disable <name>` | Disable a skill |
| `/init` | Initialize GEMINI.md in current directory |
| `/plan` | Enter planning mode for complex tasks |
| `/quit` | Exit the REPL |

## 8. SPECIAL INPUT SYNTAX

### File References

Use `@` prefix to include file contents in the prompt:

```
@src/utils.ts Explain this file
@package.json @tsconfig.json Compare these configs
@./relative/path.md Summarize this document
```

Multiple `@` references can be combined in a single prompt. Glob patterns are supported:

```
@src/**/*.test.ts Review all test files
```

### Shell Execution

Use `!` prefix to run shell commands and include output:

```
!git log --oneline -10  Show recent changes
!npm test              Fix failing tests
!ls -la src/           What files are here?
```

### MCP Resource References

Use `@server://resource` syntax to reference MCP server resources:

```
@memory://recent  Load recent memory entries
@github://issues  List open issues
```

## 9. CONFIGURATION FILES

### settings.json

Settings are loaded in cascading priority order:

| Level | Path | Scope |
|-------|------|-------|
| **System** | `/etc/gemini/settings.json` | Machine-wide defaults |
| **User** | `~/.gemini/settings.json` | User preferences |
| **Project** | `.gemini/settings.json` | Project-specific overrides |

**Key settings:**

```json
{
  "model": "gemini-3.1-pro-preview",
  "apiKey": "AIza...",
  "theme": "dark",
  "sandbox": "none",
  "approvalMode": "unless-allow-listed",
  "allowedTools": ["read_file", "write_file", "search_file_content"],
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "server-package"],
      "env": {}
    }
  },
  "coreTools": {
    "webSearch": true,
    "codeExecution": true
  }
}
```

### GEMINI.md Context Hierarchy

GEMINI.md files provide persistent context to Gemini CLI, loaded in cascading order:

| Level | Path | Purpose |
|-------|------|---------|
| **Global** | `~/.gemini/GEMINI.md` | Universal instructions across all projects |
| **Workspace** | `GEMINI.md` (repo root) | Project-level conventions and architecture |
| **JIT (Just-In-Time)** | `path/to/GEMINI.md` | Directory-specific context, loaded when working in that directory |

All levels are merged, with more specific files taking precedence.

### .geminiignore

Works like `.gitignore` to exclude files from Gemini's context:

```
# .geminiignore
node_modules/
dist/
*.min.js
.env
secrets/
```

Placed at repository root. Patterns follow gitignore syntax.

## 10. RATE LIMITS

### Free Tier Limits

| Metric | Limit | Reset |
|--------|-------|-------|
| Requests per minute | 60 | Rolling window |
| Requests per day | 1,000 | 24-hour rolling |
| Tokens per minute | 4,000,000 | Rolling window |

### Rate Limit Behavior

When rate limits are hit, Gemini CLI automatically:
1. Detects the 429 response
2. Applies exponential backoff (1s, 2s, 4s, 8s...)
3. Retries the request
4. Retries the request

### Strategies to Avoid Rate Limits

- Batch related questions into single prompts
- Add delays between automated/scripted calls: `sleep 2`
- Use API key for higher quotas vs. OAuth free tier
- Monitor usage via Google AI Studio dashboard

## 11. KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Clear the terminal screen |
| `Ctrl+V` | Paste from clipboard |
| `Ctrl+Y` | Toggle YOLO mode on/off |
| `Ctrl+X` | Open prompt in external editor ($EDITOR) |
| `Ctrl+C` | Cancel current generation |
| `Ctrl+D` | Exit the REPL |
| `Up/Down` | Navigate prompt history |
| `Tab` | Auto-complete file paths and commands |

## 12. TROUBLESHOOTING

| Problem | Cause | Solution |
|---------|-------|----------|
| `GEMINI_API_KEY not set` | No authentication configured | Set `GEMINI_API_KEY` env var or run `gemini` for OAuth flow |
| `429 Too Many Requests` | Rate limit exceeded | Wait for reset, use lighter model, or add delays |
| `Model not found` | Invalid model name | Check available models with `gemini -m list` |
| `Permission denied` on tool call | Sandbox restrictions | Use `--sandbox none` or approve manually |
| MCP server connection failed | Server not running or misconfigured | Check `settings.json` mcpServers config, run `/mcp refresh` |
| `GEMINI.md not loaded` | File not in expected location | Verify path matches hierarchy (global/workspace/JIT) |
| Slow responses | Large context or complex model | Use `/compress`, reduce `@` references, try `flash` model |
| `Cannot read file` | Path outside allowed directories | Add directory with `--include-directories` or `/directory add` |
| Session resume fails | Session expired or deleted | List sessions with `--list-sessions`, start new session |
| Output truncated | Token limit reached | Break task into smaller steps, use `/compress` |
| `npm ERR!` on install | Node.js version mismatch | Ensure Node.js 20+ is installed: `node --version` |
| Garbled output in pipe mode | Terminal control codes in non-TTY | Use `-o text` or `-o json` explicitly |

## 13. ENVIRONMENT VARIABLES

| Variable | Purpose | Example |
|----------|---------|---------|
| `GEMINI_API_KEY` | API key authentication | `AIzaSy...` |
| `GOOGLE_CLOUD_PROJECT` | Vertex AI project | `my-project-123` |
| `GEMINI_MODEL` | Default model override | `gemini-3.1-pro-preview` |
| `EDITOR` | External editor for Ctrl+X | `vim`, `code --wait` |
| `GEMINI_DEBUG` | Enable debug output | `1` or `true` |
| `GEMINI_SANDBOX` | Default sandbox mode | `docker`, `none` |
| `NO_COLOR` | Disable colored output | `1` |

