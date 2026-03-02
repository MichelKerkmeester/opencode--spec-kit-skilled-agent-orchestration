# Gemini CLI Installation Guide

Complete installation and configuration guide for Gemini CLI, a terminal-based AI assistant powered by Google Gemini. Enables cross-AI validation, real-time web search grounding, codebase architecture analysis, and parallel task delegation directly from the Bash tool. This is a documentation-only skill, not an MCP server, no adapter, no proxy. Gemini CLI is invoked as a standard CLI via Bash using your own Google credentials.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
> **Package:** `@google/gemini-cli` | **Dependencies:** Node.js 20+ | **License:** Apache 2.0

**Version:** 1.0.0 | **Updated:** 2026-02-28 | **Binary:** `gemini`

---

## 0. AI-First Install Guide

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install Gemini CLI for cross-AI validation and Google Search grounding.

Please help me:
1. Check if I have Node.js 20+ installed
2. Install @google/gemini-cli globally
3. Verify the gemini binary is available
4. Set up authentication (API key, OAuth, or Vertex AI)
5. Run a basic test to confirm everything works

My platform is: [macOS / Linux / Windows with WSL]
My preferred auth method is: [API key / Google OAuth / Vertex AI]

Guide me through each step with the exact commands needed.
```

The AI will:
- Verify Node.js 20+ is available on your system
- Install `@google/gemini-cli` globally via npm
- Walk through the authentication method you selected
- Run a verification prompt to confirm the CLI is operational
- Optionally configure `settings.json` and `GEMINI.md` for your project

**Expected setup time:** 2 to 3 minutes

### Quick Success Check (30 seconds)

After installation, run these two tests immediately:

1. Open your terminal and run: `gemini --version`
2. Version output appears: CLI is working
3. Run: `echo "Say hello" | gemini -o text`
4. Response appears: authentication and CLI are working

Not working? Go to [Troubleshooting](#9-troubleshooting).

---

## Table of Contents

0. [AI-First Install Guide](#0-ai-first-install-guide)
1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Verification](#5-verification)
6. [Usage](#6-usage)
7. [Features](#7-features)
8. [Examples](#8-examples)
9. [Troubleshooting](#9-troubleshooting)
10. [Resources](#10-resources)

---

## 1. Overview

Gemini CLI gives AI assistants a second AI perspective by invoking Google's Gemini models directly from the Bash tool. It is not an MCP server and requires no `opencode.json` configuration. The CLI runs as a standard terminal command using your own Google credentials (API key, OAuth, or Vertex AI) and is controlled entirely through Bash calls.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### What This Is Not

This is not an MCP integration. There is no adapter, no proxy, and no `opencode.json` or `.utcp_config.json` configuration required. Gemini CLI is installed globally as a binary and called directly via Bash.

### Source Repository

| Property        | Value                                                                 |
| --------------- | --------------------------------------------------------------------- |
| **GitHub**      | [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) |
| **npm**         | `@google/gemini-cli`                                                  |
| **Binary**      | `gemini`                                                              |
| **License**     | Apache 2.0                                                            |
| **Runtime**     | Node.js 20+                                                           |

### Authentication Methods

| Method          | When to Use                          | Setup Required                        |
| --------------- | ------------------------------------ | ------------------------------------- |
| **API Key**     | Scripts, CI/CD, quickest start       | `export GEMINI_API_KEY=your-key`      |
| **OAuth**       | Personal use, interactive sessions   | Run `gemini`, follow browser prompt   |
| **Vertex AI**   | Enterprise, GCP project billing      | `gcloud auth` + `GOOGLE_CLOUD_PROJECT` |

Authentication is checked in the order above. API key takes priority when set.

### Model Selection

| Alias         | Maps To           | Best For                        |
| ------------- | ----------------- | ------------------------------- |
| `auto`        | gemini-2.5-pro    | Default, complex reasoning      |
| `pro`         | gemini-2.5-pro    | Complex reasoning, large tasks  |
| `flash`       | gemini-2.5-flash  | Fast responses, routine tasks   |
| `flash-lite`  | flash-lite        | Trivial tasks, high throughput  |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│   AI Client (Claude Code / OpenCode)                            │
│   - Invokes gemini binary via Bash tool                         │
│   - No MCP config needed                                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Bash tool call
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│   gemini CLI binary (npm install -g @google/gemini-cli)         │
│   - Reads auth from env vars or ~/.gemini/settings.json         │
│   - Reads context from GEMINI.md at repo root                   │
│   - Reads agent definitions from .gemini/agents/               │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS API call
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│   Google Gemini API / Vertex AI                                 │
│   - Gemini 2.5 Pro / Flash models                               │
│   - google_web_search (real-time grounding)                     │
│   - codebase_investigator (architecture analysis)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Prerequisites

### Required Tools

- **Node.js 20 or higher**
  ```bash
  node --version
  # Should show v20.x or higher
  ```

- **npm** (comes with Node.js)
  ```bash
  npm --version
  ```

- **One of the following for authentication:**
  - A Gemini API key from [aistudio.google.com](https://aistudio.google.com)
  - A Google account (for OAuth login)
  - A Google Cloud project with Vertex AI enabled (for enterprise use)

### Platform Support

| Platform    | Status         | Notes                                       |
| ----------- | -------------- | ------------------------------------------- |
| **macOS**   | Native support | Recommended                                 |
| **Linux**   | Native support | All major distributions supported           |
| **Windows** | WSL only       | PowerShell and Git Bash not supported        |

### Validation: `phase_1_complete`

Run these prerequisite checks before continuing:

```bash
node --version    # Must be v20.x or higher
npm --version     # Must return a version number
```

**Checklist:**
- [ ] `node --version` returns v20 or higher
- [ ] `npm --version` returns a version number
- [ ] At least one authentication method is available (API key, Google account, or GCP project)

**Windows users:** WSL is required. Install it first with: `wsl --install`

❌ **STOP if validation fails** - fix prerequisites before continuing.

---

## 3. Installation

### Step 1: Install Gemini CLI globally

```bash
npm install -g @google/gemini-cli
```

### Step 2: Verify the binary

```bash
# Confirm installation
command -v gemini || echo "Installation failed - check PATH"

# Check version
gemini --version
```

### Step 3: Fix PATH if binary is not found

```bash
# Find where npm installs global binaries
npm config get prefix

# Add to PATH (replace with actual prefix output)
export PATH="$(npm config get prefix)/bin:$PATH"

# Persist to shell profile
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Validation: `phase_2_complete`

| Check         | Command              | Expected                        |
| ------------- | -------------------- | ------------------------------- |
| CLI installed | `command -v gemini`  | Path to gemini binary           |
| Version       | `gemini --version`   | Version number returned         |

**Checklist:**
- [ ] `command -v gemini` returns a binary path
- [ ] `gemini --version` returns a version number

❌ **STOP if validation fails** - review install output and PATH configuration.

---

## 4. Configuration

Gemini CLI requires no `opencode.json` or `.utcp_config.json` configuration. All configuration is done through environment variables, a user-level settings file, a project-level context file, and optional agent definitions.

### Step 1: Set Up Authentication

Choose one method. API key is fastest to configure. OAuth is recommended for personal interactive use.

#### Method 1: API Key (Quickest, Recommended for Scripts and CI)

```bash
# Set for current session
export GEMINI_API_KEY=your-api-key-here

# Persist to shell profile
echo 'export GEMINI_API_KEY=your-api-key-here' >> ~/.zshrc
source ~/.zshrc
```

Get an API key at: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

#### Method 2: OAuth (Google Login, Recommended for Personal Use)

```bash
# Run gemini with no API key set. It will open a browser for login
gemini
```

Follow the browser prompt to authenticate with your Google account. Credentials are stored locally after first login.

#### Method 3: Vertex AI (Enterprise / GCP Billing)

```bash
# Install Google Cloud SDK if not present
# macOS: brew install --cask google-cloud-sdk
# Linux: https://cloud.google.com/sdk/docs/install

# Authenticate with gcloud
gcloud auth application-default login

# Set your GCP project
export GOOGLE_CLOUD_PROJECT=your-project-id

# Persist to shell profile
echo 'export GOOGLE_CLOUD_PROJECT=your-project-id' >> ~/.zshrc
source ~/.zshrc
```

### Step 2: User-Level Settings (Optional)

Create `~/.gemini/settings.json` to set defaults for all projects:

```json
{
  "model": "gemini-2.5-flash",
  "theme": "Default",
  "autoAccept": false
}
```

| Setting      | Values                              | Purpose                         |
| ------------ | ----------------------------------- | ------------------------------- |
| `model`      | `auto`, `pro`, `flash`, `flash-lite` | Default model for all sessions  |
| `theme`      | `Default`, `Dark`, `Light`          | Terminal color theme            |
| `autoAccept` | `true` / `false`                    | Skip confirmation prompts (YOLO) |

### Step 3: Project-Level Context File (Optional)

Create `GEMINI.md` at your repository root. This is the equivalent of `CLAUDE.md` for Gemini. Content is automatically injected into every Gemini session for that project.

```bash
# Create a project-level context file
touch GEMINI.md
```

Example `GEMINI.md`:

```markdown
# Project Context for Gemini

This is a Node.js TypeScript project.
- Package manager: pnpm
- Test runner: vitest
- Linter: eslint with flat config
- Build tool: vite

When reviewing code, focus on correctness, performance, and consistency with existing patterns.
```

### Step 4: Ignore File (Optional)

Create `.geminiignore` at the repository root to exclude files from context loading (same syntax as `.gitignore`):

```
node_modules/
dist/
.env
*.log
coverage/
```

### Step 5: Project-Level Settings (Optional)

Create `.gemini/settings.json` at the repository root to override user-level settings for this project:

```json
{
  "model": "gemini-2.5-pro",
  "autoAccept": false
}
```

Project-level settings take priority over user-level settings.

### Step 6: Gemini Agent Files (Optional)

Place agent definition files in `.gemini/agents/` to enable specialized Gemini agent personas. These mirror the agent system used by Claude in `.claude/agents/`.

```bash
mkdir -p .gemini/agents/
```

Available agents when using the `cli-gemini` skill:

| Agent          | File                              | Purpose                               |
| -------------- | --------------------------------- | ------------------------------------- |
| `@context`     | `.gemini/agents/context.md`       | Codebase exploration and search       |
| `@debug`       | `.gemini/agents/debug.md`         | Root cause analysis                   |
| `@handover`    | `.gemini/agents/handover.md`      | Session continuation                  |
| `@orchestrate` | `.gemini/agents/orchestrate.md`   | Multi-agent coordination              |
| `@research`    | `.gemini/agents/research.md`      | Evidence gathering and planning       |
| `@review`      | `.gemini/agents/review.md`        | Code review, read-only                |
| `@speckit`     | `.gemini/agents/speckit.md`       | Spec folder creation                  |
| `@ultra-think` | `.gemini/agents/ultra-think.md`   | Multi-strategy planning               |
| `@write`       | `.gemini/agents/write.md`         | Documentation creation                |

### Validation: `phase_3_complete`

| Check              | Method                                          | Expected                          |
| ------------------ | ----------------------------------------------- | --------------------------------- |
| Auth configured    | `echo $GEMINI_API_KEY` or `gcloud auth list`    | Key present or account listed     |
| Basic response     | `echo "Say hello" \| gemini -o text`            | Text response returned            |
| Settings readable  | `cat ~/.gemini/settings.json`                   | Valid JSON (if file was created)  |

**Checklist:**
- [ ] Authentication method is configured (API key, OAuth, or Vertex AI)
- [ ] `echo "Say hello" | gemini -o text` returns a response
- [ ] Settings file parses correctly (if created)
- [ ] `GEMINI.md` exists at repo root (if desired)

❌ **STOP if validation fails** - fix configuration before proceeding.

---

## 5. Verification

### One-Command Health Check

```bash
echo "Respond with exactly: GEMINI_CLI_OK" | gemini -o text 2>&1 && echo "SUCCESS: Gemini CLI is working" || echo "FAILED: Check error output above"
```

### Full Verification Checklist

| #   | Check            | Command                                  | Expected Result              |
| --- | ---------------- | ---------------------------------------- | ---------------------------- |
| 1   | CLI installed    | `command -v gemini`                      | Path to gemini binary        |
| 2   | Version          | `gemini --version`                       | Version number returned      |
| 3   | Basic prompt     | `echo "Say hello" \| gemini -o text`     | Text response from Gemini    |
| 4   | Model flag       | `gemini -m flash "Quick test" -o text`   | Fast response returned       |
| 5   | JSON output      | `echo "Count to 3" \| gemini -o json`    | JSON-formatted response      |
| 6   | YOLO mode        | `gemini -y "Echo: test" -o text`         | Response without prompts     |

### Verify in Your AI Client

In Claude Code or OpenCode, run via Bash:

```bash
echo "List three advantages of code review" | gemini -o text
```

Expected result: A structured text response from Gemini appears in the Bash output.

### Validation: `phase_4_complete`

All 6 checklist items above pass with no errors.

❌ **STOP if validation fails.** The system is not ready for use until all checks pass.

### Validation: `phase_5_complete`

Your AI client successfully invokes Gemini via Bash and receives a coherent response. The system is operational.

❌ **STOP if validation fails** - Check authentication credentials, verify the gemini binary is in PATH, and review [Troubleshooting](#9-troubleshooting).

---

## 6. Usage

### Basic Invocation Patterns

```bash
# Text output (most common)
gemini "prompt here" -o text

# Pipe input
echo "Explain this codebase" | gemini -o text

# JSON output for parsing
echo "List all TODO items as JSON" | gemini -o json

# Specific model
gemini -m flash "Quick formatting fix" -o text

# YOLO mode (skip confirmation prompts)
gemini -y "Refactor this function" -o text

# Non-interactive (safe for scripts)
echo "prompt" | gemini -o text
```

### Agent Delegation

```bash
# Delegate to a specialized agent
gemini "As @review agent: Review @./src/auth.ts for security issues" -o text

# Research agent for planning
gemini "As @research agent: Analyze the architecture of @./src/" -o text

# Debug agent for root cause analysis
gemini "As @debug agent: Why would this test fail? @./tests/auth.test.ts" -o text
```

### Cross-AI Validation (Primary Use Case)

```bash
# Get a second opinion on a code change
cat src/auth.ts | gemini "Review this code for security vulnerabilities. Be concise." -o text

# Validate a plan before implementing
echo "Plan: Add rate limiting to the API using Redis. Is this the right approach?" | gemini -o text

# Architecture review
gemini "Analyze the overall architecture of @./src/ and identify any concerns" -o text
```

### Google Search Grounding

```bash
# Real-time web information
gemini "What is the current stable version of React?" -o text

# Research with web context
gemini "What are the known security vulnerabilities in express 4.18?" -o text

# Combine web search with codebase context
gemini "Is our usage of @./src/crypto.ts aligned with current best practices?" -o text
```

### Command Reference

| Command                                    | Purpose                                       |
| ------------------------------------------ | --------------------------------------------- |
| `gemini "prompt" -o text`                  | Basic text output                             |
| `gemini "prompt" -o json`                  | JSON-formatted output                         |
| `gemini -m flash "prompt" -o text`         | Use flash model for speed                     |
| `gemini -m pro "prompt" -o text`           | Use pro model for complex reasoning           |
| `gemini -y "prompt" -o text`               | YOLO mode, skip confirmation prompts          |
| `echo "prompt" \| gemini -o text`          | Pipe input to Gemini                          |
| `gemini "As @review agent: ..." -o text`   | Delegate to named agent                       |
| `gemini --version`                         | Show installed version                        |

---

## 7. Features

### Core Capabilities

| Feature                       | Description                                                              |
| ----------------------------- | ------------------------------------------------------------------------ |
| **Cross-AI Validation**       | Code review and planning from a second AI perspective (Google Gemini)    |
| **Google Search Grounding**   | Real-time web search via `google_web_search` for current, factual answers |
| **Codebase Analysis**         | Architecture-level analysis via `codebase_investigator`                  |
| **Agent Delegation**          | 9 specialized agents (@context, @debug, @handover, @orchestrate, etc.)   |
| **Parallel Task Delegation**  | Run multiple Gemini instances simultaneously via Bash for parallel work   |
| **Multiple Output Formats**   | Text, JSON output suitable for scripting and AI parsing                   |
| **Model Selection**           | Switch between pro, flash, and flash-lite per task                        |
| **YOLO Mode**                 | Non-interactive batch processing with `-y` flag                           |
| **Project Context**           | Auto-injects `GEMINI.md` for project-aware responses                      |

### No MCP Configuration Required

| Aspect               | Status                                              |
| -------------------- | --------------------------------------------------- |
| `opencode.json`      | Not required. No MCP server to register             |
| `.utcp_config.json`  | Not required. No Code Mode provider needed          |
| Tool invocation      | Bash tool only: `gemini "prompt" -o text`           |
| Auth                 | Your own credentials via env vars or gcloud auth    |
| Token cost           | Only what the Gemini API charges, no proxy overhead  |

### Specialized Gemini Tools (Built-in)

| Tool                    | Capability                                      |
| ----------------------- | ----------------------------------------------- |
| `google_web_search`     | Real-time web search with source grounding      |
| `codebase_investigator` | Deep architecture and dependency analysis        |

---

## 8. Examples

### Example 1: Code Review from a Second Perspective

```bash
# Review a specific file
cat src/services/auth.ts | gemini "Review this TypeScript code for:
1. Security vulnerabilities
2. Error handling gaps
3. Performance concerns
Be concise. Use bullet points." -o text
```

### Example 2: Parallel Review of Multiple Files

```bash
# Run two reviews in parallel using background processes
gemini "Review @./src/auth.ts for security issues" -o text > /tmp/review-auth.txt &
gemini "Review @./src/db.ts for performance issues" -o text > /tmp/review-db.txt &
wait

# Combine results
echo "=== Auth Review ===" && cat /tmp/review-auth.txt
echo "=== DB Review ===" && cat /tmp/review-db.txt
```

### Example 3: Google Search Grounding for Research

```bash
# Get current, factual information from the web
gemini "What breaking changes were introduced in Node.js 22 that could affect Express apps?" -o text

# Security advisory lookup
gemini "Are there known CVEs for jsonwebtoken versions below 9.0.0?" -o text
```

### Example 4: Architecture Analysis

```bash
# Analyze the full source directory
gemini "Analyze the architecture of @./src/. Identify:
1. Main entry points
2. Key dependencies between modules
3. Potential circular dependencies
4. Suggested improvements" -o text
```

### Example 5: Agent Delegation

```bash
# Delegate to the review agent for a structured code review
gemini "As @review agent: Perform a security-focused review of @./src/api/routes.ts" -o text

# Delegate to the research agent for planning input
gemini "As @research agent: What is the best approach to implement distributed rate limiting in a Node.js microservices architecture?" -o text

# Delegate to the debug agent for root cause analysis
gemini "As @debug agent: This test is failing intermittently: @./tests/sync.test.ts. Identify the likely root cause." -o text
```

### Example 6: JSON Output for Scripting

```bash
# Get structured output that can be parsed
echo "List the top 5 JavaScript testing frameworks in JSON format with name, github_stars estimate, and primary_use fields" | gemini -o json | jq '.'

# Parse Gemini output in a pipeline
gemini "Review @./src/auth.ts and return issues as JSON array with fields: severity, line, description" -o json | \
  jq '.[] | select(.severity == "critical")'
```

### Example 7: CI/CD Integration

```bash
#!/bin/bash
# Non-interactive code review in CI pipeline
set -e

# API key must be set in CI environment
if [ -z "$GEMINI_API_KEY" ]; then
  echo "ERROR: GEMINI_API_KEY is not set"
  exit 1
fi

# Review changed files
git diff --name-only HEAD~1 | grep '\.ts$' | while read file; do
  echo "Reviewing: $file"
  cat "$file" | gemini -y "Review for security issues. Output: PASS or FAIL with brief reason." -o text
done
```

### Example 8: Model Selection by Task Complexity

```bash
# Trivial formatting fix, use flash-lite for speed and cost efficiency
gemini -m flash-lite "Fix the indentation in this JSON: {\"a\":1,\"b\":2}" -o text

# Routine task, use flash
gemini -m flash "Write a docstring for this function: $(cat src/utils/format.ts)" -o text

# Complex reasoning, use pro (default)
gemini "Design a database schema for a multi-tenant SaaS application with row-level security" -o text
```

---

## 9. Troubleshooting

### Error/Cause/Fix Reference

| Error                              | Cause                                    | Fix                                                              |
| ---------------------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| `command not found: gemini`        | CLI not installed or not in PATH         | Run `npm install -g @google/gemini-cli`. Check PATH with `npm config get prefix` |
| `GEMINI_API_KEY not set`           | API key env var is missing               | `export GEMINI_API_KEY=your-key` or use OAuth login             |
| `401 Unauthorized`                 | API key is invalid or expired            | Generate a new key at aistudio.google.com/apikey                |
| `403 Forbidden`                    | API key lacks permissions or quota       | Check API key restrictions in Google AI Studio                   |
| `GOOGLE_CLOUD_PROJECT not set`     | Vertex AI project not configured         | `export GOOGLE_CLOUD_PROJECT=your-project-id`                   |
| `gcloud: command not found`        | Google Cloud SDK not installed           | Install from cloud.google.com/sdk/docs/install                  |
| `No credentials found`             | Neither API key nor gcloud auth is set   | Set `GEMINI_API_KEY` or run `gcloud auth application-default login` |
| `gemini fails on Windows`          | Native Windows not supported             | Install WSL with `wsl --install`, then install inside WSL       |
| Slow responses                     | Using `pro` model for simple tasks       | Use `gemini -m flash` for faster, cheaper responses             |
| Response cut off or incomplete     | Prompt is too long or output limit hit   | Break prompt into smaller parts or use `-m pro` for larger context |

### CLI: Command Not Found

```bash
# Install
npm install -g @google/gemini-cli

# If still not found, fix PATH
npm config get prefix
export PATH="$(npm config get prefix)/bin:$PATH"

# Persist
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
command -v gemini
```

### Authentication: API Key Not Working

```bash
# Check if the key is set
echo $GEMINI_API_KEY

# Re-export if empty
export GEMINI_API_KEY=your-key-here

# Test immediately
echo "Say hello" | gemini -o text
```

### Authentication: OAuth Flow Not Completing

```bash
# Run gemini interactively to trigger the browser login
gemini

# If the browser does not open, check if a URL was printed to the terminal
# Copy it manually and open in your browser
# After completing login, credentials are stored at ~/.gemini/
ls ~/.gemini/
```

### Authentication: Vertex AI Errors

```bash
# Check gcloud is authenticated
gcloud auth list

# Re-authenticate if needed
gcloud auth application-default login

# Confirm project is set
echo $GOOGLE_CLOUD_PROJECT

# Verify the project has Vertex AI API enabled
gcloud services list --enabled | grep aiplatform
```

### Windows: Not Supported Natively

```bash
# Install WSL
wsl --install

# Inside WSL, install Node.js and Gemini CLI
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g @google/gemini-cli

# Verify
gemini --version
```

---

## 10. Resources

### Related Documentation

| Document             | Location                                                                    | Purpose                              |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------ |
| SKILL.md             | `.opencode/skill/cli-gemini/SKILL.md`                                   | Complete skill workflows             |
| CLI Reference        | `.opencode/skill/cli-gemini/references/cli_reference.md`                | Full command and flag reference      |
| Agent Delegation     | `.opencode/skill/cli-gemini/references/agent_delegation.md`             | Using Gemini agents                  |
| Gemini Tools         | `.opencode/skill/cli-gemini/references/gemini_tools.md`                 | google_web_search, codebase_investigator |
| Integration Patterns | `.opencode/skill/cli-gemini/references/integration_patterns.md`         | Patterns for cross-AI workflows      |

### Configuration Paths

| Scope          | File / Variable                  | Purpose                                      |
| -------------- | -------------------------------- | -------------------------------------------- |
| **Auth**       | `GEMINI_API_KEY` env var         | API key authentication                       |
| **Auth**       | `GOOGLE_CLOUD_PROJECT` env var   | Vertex AI project ID                         |
| **User**       | `~/.gemini/settings.json`        | User-level defaults (model, theme)           |
| **Project**    | `.gemini/settings.json`          | Project-level overrides                      |
| **Context**    | `GEMINI.md` (repo root)          | Project context injected into every session  |
| **Ignore**     | `.geminiignore` (repo root)      | Files excluded from context loading          |
| **Agents**     | `.gemini/agents/`                | Specialized Gemini agent definitions         |

### External Resources

| Resource               | URL                                                                      |
| ---------------------- | ------------------------------------------------------------------------ |
| GitHub Repository      | [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) |
| API Key (AI Studio)    | [aistudio.google.com/apikey](https://aistudio.google.com/apikey)        |
| npm Package            | [npmjs.com/package/@google/gemini-cli](https://www.npmjs.com/package/@google/gemini-cli) |
| Vertex AI Docs         | [cloud.google.com/vertex-ai](https://cloud.google.com/vertex-ai)        |
| Google Cloud SDK       | [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install) |

---

## Quick Reference Card

### Installation

```bash
npm install -g @google/gemini-cli
```

### Authentication

```bash
# Option 1: API key (fastest)
export GEMINI_API_KEY=your-key-here

# Option 2: OAuth (personal use)
gemini    # Follow browser prompt

# Option 3: Vertex AI (enterprise)
export GOOGLE_CLOUD_PROJECT=your-project-id
gcloud auth application-default login
```

### Basic Usage

```bash
gemini "prompt" -o text               # Text output
echo "prompt" | gemini -o text        # Pipe input
gemini "prompt" -o json               # JSON output
gemini -y "prompt" -o text            # YOLO mode (no prompts)
gemini -m flash "prompt" -o text      # Fast model
gemini -m pro "prompt" -o text        # Pro model (default)
```

### Agent Delegation

```bash
gemini "As @review agent: Review @./src/auth.ts" -o text
gemini "As @debug agent: Diagnose @./tests/failing.test.ts" -o text
gemini "As @research agent: Plan a caching strategy for @./src/api/" -o text
```

### Model Quick Guide

```bash
gemini -m flash-lite "..." -o text    # Trivial tasks, fastest
gemini -m flash "..." -o text         # Routine tasks, fast
gemini "..." -o text                  # Complex tasks, default (pro)
```

### Validation Checkpoints Summary

| Checkpoint         | Meaning                                          |
| ------------------ | ------------------------------------------------ |
| `phase_1_complete` | Node.js 20+ and npm available                    |
| `phase_2_complete` | `gemini` binary installed and in PATH            |
| `phase_3_complete` | Authentication configured and basic call works   |
| `phase_4_complete` | Full verification checklist passes               |
| `phase_5_complete` | System operational. Gemini responds via Bash     |

---

## Version History

| Version | Date       | Changes                                           |
| ------- | ---------- | ------------------------------------------------- |
| 1.0.0   | 2026-02-28 | Initial guide. CLI-only, three auth methods, agent delegation, parallel patterns |

---

**Need help?** See [Troubleshooting](#9-troubleshooting) or load the `cli-gemini` skill for detailed workflows.
