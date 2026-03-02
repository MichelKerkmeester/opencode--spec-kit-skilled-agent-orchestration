---
title: "Codex CLI Built-in Tools Reference"
description: "Reference for Codex CLI built-in capabilities including /review command, web search, MCP integration, session management, and image input, with Claude Code equivalents comparison."
---

# Codex CLI Built-in Tools Reference

Reference for all Codex CLI capabilities, highlighting unique features and Claude Code equivalents.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Delegate to Codex CLI for capabilities Claude Code lacks natively — especially `/review` for diff-aware code review workflows, `--search` for live web browsing, and session management (resume, fork) for multi-turn task continuity.

### Purpose

Covers all built-in capabilities available in Codex CLI, highlights what is unique compared to Claude Code, and provides a comparison table for task routing decisions.

### When to Use

- Choosing whether to delegate a task to Codex CLI or handle it in Claude Code
- Understanding which Codex flags and modes to use for different task types
- Mapping Claude Code capabilities to Codex CLI equivalents
- Leveraging Codex-exclusive features (/review workflow, --search, MCP, session management)

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:unique-capabilities -->
## 2. UNIQUE CAPABILITIES (NOT IN CLAUDE CODE)

These capabilities are exclusive to Codex CLI or provide significantly different workflows.

### /review Command

**Built-in diff-aware code review.** The `/review` interactive command analyzes staged changes, recent commits, or branch differences using Codex's reasoning, producing structured review output.

**Capabilities:**
- Reviews staged git changes (diff-aware — only reviews what changed)
- Supports commit review: review a specific commit's changes
- Supports branch comparison: review all changes between two branches
- Produces categorized findings (bugs, security, style, performance)
- Interactive — runs inside the Codex TUI session

**Usage (Interactive TUI):**

```bash
# Start interactive session
codex

# Inside TUI — review staged changes
/review

# Inside TUI — review a specific commit
/review HEAD~1

# Inside TUI — review branch diff
/review main..feature/auth
```

**Best For:**
- Pre-commit review of staged changes
- Pull request preparation (branch comparison)
- Catching issues before pushing
- Generating review summaries for human reviewers

**Compared to Claude Code:** Claude Code performs code review by reading files directly. Codex's `/review` command is diff-aware — it focuses only on changed lines, reducing noise and improving relevance for incremental reviews.

---

### Web Search (--search)

**Live web browsing during task execution.** The `--search` flag enables Codex to browse the web during an `exec` session, retrieving current documentation, advisories, and community resources.

**Capabilities:**
- Searches the live web using OpenAI's browsing capability
- Returns current, ranked results with source citations
- Understands search intent and reformulates queries automatically
- Integrates web findings directly into code generation or analysis
- Supports follow-up searches within a single exec session

**Usage Examples:**

```bash
# Research current library security advisories
codex exec "What are the latest security advisories for Express.js? Search the web." \
  --model gpt-5.3-codex --search --sandbox read-only

# Find migration guide
codex exec "Find the official Prisma 5 to 6 migration guide and summarize the breaking changes." \
  --model gpt-5.3-codex --search --sandbox read-only

# Compare packages with current data
codex exec "Compare zod vs yup for TypeScript validation as of 2026. Search for benchmarks." \
  --model gpt-5.3-codex --search --sandbox read-only
```

**Output Format:**
- Inline citations with source URLs
- Summarized findings with links to originals
- Multiple sources cross-referenced when appropriate

**Best For:**
- Current documentation and API references
- Security advisories and CVE lookups
- Package discovery and comparison
- Checking latest versions and changelog entries
- Verifying claims against live sources

**Compared to Claude Code:** Claude Code has a WebSearch tool that provides search results. Codex's `--search` integrates web browsing directly into the reasoning loop, allowing Codex to use retrieved information immediately in code generation or analysis within the same session.

---

### MCP Server Integration (codex mcp)

**Model Context Protocol server support.** Codex CLI can connect to MCP servers, extending its capabilities with custom tools and data sources.

**Capabilities:**
- Connect to any MCP-compatible server
- Use MCP tools during `exec` sessions
- Configure MCP servers in `.codex/settings.json`
- Access custom data sources and APIs via MCP protocol

**Configuration:**

```json
// .codex/settings.json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "MY_API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

**Usage:**

```bash
# Start MCP management
codex mcp

# Use MCP tools in exec
codex exec "Use the database MCP tool to query user records" \
  --model gpt-5.3-codex --sandbox read-only
```

**Best For:**
- Integrating custom data sources into Codex sessions
- Extending Codex with domain-specific tools
- Connecting to internal APIs or databases via MCP

**Compared to Claude Code:** Claude Code supports MCP natively via `opencode.json` configuration. Codex CLI's MCP support follows the same protocol but is configured separately in `.codex/settings.json`.

---

### Session Management (resume, fork)

**Multi-turn workflow continuity.** Codex CLI supports resuming and forking sessions, enabling complex multi-step tasks that span multiple executions.

**Capabilities:**
- `codex resume [session-id]` — Continue a previous session with full context
- `codex fork [session-id]` — Branch from an existing session to explore alternatives
- Sessions persist tool call history and conversation context
- Useful for long-running tasks split across time

**Usage:**

```bash
# List recent sessions
codex sessions list

# Resume the most recent session
codex resume

# Resume a specific session by ID
codex resume abc123

# Fork from a session to try an alternative approach
codex fork abc123

# Start exec and save session for later continuation
codex exec "Begin implementing the auth module. Stop after designing the interface." \
  --model gpt-5.3-codex --sandbox workspace-write
# Note the session ID from output, then later:
codex resume [session-id]
```

**Best For:**
- Long implementation tasks split across multiple work sessions
- Exploring alternative implementation approaches (fork)
- Iterative refinement where prior context matters
- Multi-phase workflows where each phase builds on the last

**Compared to Claude Code:** Claude Code does not have built-in session persistence between invocations. The Spec Kit Memory MCP provides structured memory across sessions, but Codex's `resume`/`fork` maintains full conversation and tool-call context from the previous session.

---

### Image Input (--image / -i)

**Visual input for design-to-code and screenshot analysis.** Codex can accept image files as input, enabling workflows that start from visual artifacts.

**Capabilities:**
- Attach screenshots, mockups, diagrams, or design files
- Implement UI components directly from design images
- Analyze error screenshots or visual bugs
- Document visual outputs (charts, diagrams) via description
- Supports common image formats (PNG, JPEG, WebP, GIF)

**Usage:**

```bash
# Implement a UI component from a design mockup
codex exec "Implement this React component to match the design." \
  --model gpt-5.3-codex -i ./designs/login-form.png --sandbox workspace-write

# Debug a visual error from a screenshot
codex exec "This screenshot shows a layout bug. Diagnose and fix @./src/components/Layout.tsx." \
  --model gpt-5.3-codex -i ./screenshots/layout-bug.png --sandbox workspace-write

# Multiple images
codex exec "Compare these two design versions and implement the better one." \
  --model gpt-5.3-codex -i design-v1.png -i design-v2.png --sandbox workspace-write
```

**Best For:**
- Design-to-code workflows (Figma exports, mockups, wireframes)
- Visual bug reports (screenshot → root cause analysis)
- UI consistency audits (screenshot comparison)
- Diagram-to-implementation (architecture diagrams, ERDs)

**Compared to Claude Code:** Claude Code supports image reading via the `Read` tool (multimodal). Codex's `-i` flag passes images as direct session context, integrated into the exec workflow with sandbox controls.

---

### Cloud Tasks (codex cloud)

**Remote task execution.** The `codex cloud` subcommand enables running tasks in OpenAI's cloud environment rather than locally.

**Capabilities:**
- Execute tasks remotely on OpenAI infrastructure
- Useful for tasks requiring resources not available locally
- Managed environment with OpenAI's runtime

**Usage:**

```bash
# Run a task in the cloud
codex cloud "Generate comprehensive unit tests for this project" \
  --model gpt-5.3-codex
```

**Best For:**
- Resource-intensive generation tasks
- Tasks where local environment setup is complex
- Offloading long-running work to remote execution

**Note:** Requires appropriate account permissions and may incur additional usage costs.

<!-- /ANCHOR:unique-capabilities -->

---

<!-- ANCHOR:standard-tools -->
## 3. STANDARD TOOLS (SIMILAR TO CLAUDE CODE)

These capabilities provide functionality comparable to Claude Code's built-in tools, with Codex-specific syntax variations.

### File System Operations

| Capability | Description | Codex Syntax / Behavior |
|------------|-------------|------------------------|
| File reading | Read file contents | Automatic or `@./path/to/file.ts` |
| File writing | Create or overwrite a file | Automatic (requires `--sandbox workspace-write`) |
| Surgical edits | Replace text in a file | Automatic (targeted edits within files) |
| Multi-file read | Read multiple files | `@./file1.ts @./file2.ts` or `@./src/**/*.ts` |
| Directory listing | List files and directories | Automatic pattern exploration |
| File search | Find files by pattern | Automatic glob matching |
| Content search | Search for text/regex in files | Automatic code search |

### Shell Execution

| Capability | Description | Notes |
|------------|-------------|-------|
| Command execution | Run shell commands | Requires `--sandbox workspace-write` or higher |
| Build and test | Run npm, cargo, pytest, etc. | Allowed at workspace-write and above |
| Git operations | git status, diff, add, commit | Allowed at workspace-write and above |

### Interaction

| Capability | Description | Notes |
|------------|-------------|-------|
| Clarification | Ask for input when needed | Automatic within TUI sessions |
| Task tracking | Internal task management | Built into session context |

<!-- /ANCHOR:standard-tools -->

---

<!-- ANCHOR:comparison-table -->
## 4. CLAUDE CODE VS. CODEX CLI CAPABILITY COMPARISON

| Capability | Claude Code Tool | Codex CLI Capability | Notes |
|------------|-----------------|---------------------|-------|
| **File reading** | `Read` | `read_file`, `@file` | Codex `@` syntax is concise |
| **File writing** | `Write`, `Edit` | Automatic write/edit | Codex requires `--sandbox workspace-write` |
| **Code search** | `Grep` (ripgrep) | Automatic content search | Claude's Grep is ripgrep-powered |
| **File discovery** | `Glob` | Automatic glob matching | Functionally equivalent |
| **Shell commands** | `Bash` | Automatic shell execution | Both require appropriate permissions |
| **Web fetch** | `WebFetch` | Automatic URL fetching | Similar capabilities |
| **Web search** | `WebSearch` | `--search` flag | Codex integrates browsing into reasoning loop |
| **Architecture analysis** | Manual (Grep+Read+Glob) | Agent-assisted analysis | Codex uses `@context` agent |
| **Memory/persistence** | External (Spec Kit MCP) | Session resume/fork | Different approaches; Spec Kit is more structured |
| **Task tracking** | External (TodoWrite) | Internal session context | Codex tracks within session |
| **Browser automation** | External MCP | Not built-in | Both need external tools |
| **MCP integration** | Native + Code Mode | `.codex/settings.json` | Both support MCP protocol |
| **Multi-file read** | Multiple `Read` calls | `@glob` pattern | Codex batches natively |
| **Image analysis** | `Read` (multimodal) | `--image` / `-i` flag | Both support image input |
| **Code review (diff)** | Manual diff + Read | `/review` command | Codex `/review` is diff-aware |
| **Session continuity** | Spec Kit Memory MCP | `resume`, `fork` | Codex preserves tool-call history |
| **Cloud execution** | Not built-in | `codex cloud` | Codex-exclusive |
| **Agent system** | `.claude/agents/` | `.codex/agents/*.toml` | Both support specialized agents |

<!-- /ANCHOR:comparison-table -->

---

<!-- ANCHOR:sandbox-modes -->
## 5. SANDBOX MODES

Codex CLI uses sandbox modes to control what actions are permitted during execution. Always select the most restrictive mode that allows the task to complete.

### Mode Reference

| Mode | Flag | Permitted Actions | When to Use |
|------|------|-------------------|-------------|
| **Read-only** | `--sandbox read-only` | Read files, no writes, no shell commands | Review, audit, analysis, research |
| **Workspace-write** | `--sandbox workspace-write` | Read + write files in workspace, run build/test commands | Code generation, bug fixing, documentation |
| **Danger full access** | `--sandbox danger-full-access` | Full shell access including system operations | **Requires explicit user approval** |

### Selection Guide

```
What does the task need to do?
    │
    ├─► Read files only (review, analyze, explain)
    │   └─► --sandbox read-only
    │
    ├─► Write files within workspace (generate, fix, refactor)
    │   └─► --sandbox workspace-write
    │
    └─► System-level operations (install, configure OS)
        └─► --sandbox danger-full-access  ← ASK USER FIRST
```

### Approval Modes

| Mode | Flag | Behavior |
|------|------|----------|
| Prompt for untrusted | `--ask-for-approval untrusted` | Asks before potentially dangerous operations (default) |
| Prompt on request | `--ask-for-approval on-request` | Asks only when Codex explicitly requests approval |
| Never ask | `--ask-for-approval never` | Auto-approves all operations |
| Full auto | `--full-auto` | Low-friction mode — combine with caution |

<!-- /ANCHOR:sandbox-modes -->

---

<!-- ANCHOR:tool-invocation -->
## 6. CAPABILITY INVOCATION

### Automatic Selection

Codex automatically selects appropriate tools based on the prompt. No explicit tool calls needed for file operations and standard capabilities.

| Prompt Pattern | Capability Used | Example |
|----------------|-----------------|---------|
| Questions about code | File reading + analysis | "What does the auth middleware do?" |
| Modify/create requests | File writing (workspace-write) | "Add error handling to utils.ts" |
| Search/find requests | Content search | "Find all TODO comments" |
| Web/current info | `--search` flag | "Latest Express.js version?" |
| Architecture questions | Multi-file analysis | "How is the app structured?" |
| Shell operations | Command execution | "Run the test suite" |

### Explicit Capability Requests

You can explicitly request specific Codex capabilities:

```bash
# Request web search explicitly
codex exec "Use web search to find the latest CVEs for lodash" \
  --model gpt-5.3-codex --search --sandbox read-only

# Request diff-aware review (interactive)
codex  # then type: /review

# Request image-based implementation
codex exec "Implement this component based on the design" \
  --model gpt-5.3-codex -i mockup.png --sandbox workspace-write

# Resume a specific session
codex resume abc123
```

<!-- /ANCHOR:tool-invocation -->

---

<!-- ANCHOR:best-practices -->
## 7. BEST PRACTICES

### When to Use --search

- Checking latest package versions, changelogs, and migration guides
- Looking up CVEs and security advisories
- Finding current API documentation (especially for rapidly evolving APIs)
- Comparing libraries or frameworks with current community sentiment
- Verifying deprecated features or breaking changes

**Avoid for:** Information already in the codebase or project context files.

### When to Use /review

- Staged changes before committing (catch issues early)
- Branch diffs before opening a pull request
- Reviewing specific commits for audit purposes
- When review should focus only on changed lines (not entire files)

**Avoid for:** First-look reviews of large existing codebases (use architecture analysis instead).

### When to Use Session Resume/Fork

- Long implementation tasks that span multiple work sessions
- Iterative refinement where you need to revisit earlier decisions
- Exploring alternative approaches from the same starting point (fork)
- Multi-phase projects where each phase builds on the previous

**Avoid for:** Independent tasks that do not share context.

### When to Use --image

- Starting from design mockups or wireframes (design-to-code)
- Reporting visual bugs via screenshot
- Implementing UI components that must match a visual spec
- Architecture diagrams that describe system structure

**Avoid for:** Tasks where the visual content can be described in text.

### Sandbox Mode Selection Patterns

| Use Case | Sandbox Mode | Rationale |
|----------|-------------|-----------|
| Code review | `read-only` | Prevent accidental modifications |
| Security audit | `read-only` | Strict isolation for safety analysis |
| Research | `read-only` | No file system changes needed |
| Code generation | `workspace-write` | Files must be created |
| Bug fixing | `workspace-write` | Files must be modified |
| Test generation | `workspace-write` | Test files must be written |
| Documentation | `workspace-write` | Docs must be written |
| System configuration | `danger-full-access` | Ask user first |

### Capability Combination Patterns

| Goal | Capability Combination | Flow |
|------|----------------------|------|
| **Understand then fix** | `read-only` analysis → `workspace-write` fix | Analyze, focus, edit |
| **Research then implement** | `--search` research → `workspace-write` generation | Learn, contextualize, create |
| **Audit codebase** | `read-only` analysis → `--search` validation | Map patterns, verify against best practices |
| **Design to code** | `--image` input → `workspace-write` generation | Import design, create implementation |
| **Review PR** | `/review` (TUI) or `read-only` exec | Diff-aware analysis |
| **Multi-session task** | Initial exec → `resume` → `fork` alternatives | Start, continue, branch |

### Orchestration from the Calling AI

When calling Codex CLI from any AI assistant, choose capabilities strategically:

```bash
# Use --search for current information
codex exec "Find the latest Prisma migration guide" \
  --model gpt-5.3-codex --search --sandbox read-only 2>&1

# Use read-only for safe analysis
codex exec "Review src/auth/ for security issues" \
  --model gpt-5.3-codex --sandbox read-only 2>&1

# Use workspace-write for generation
codex exec "Generate comprehensive tests for @./src/utils/" \
  --model gpt-5.3-codex --sandbox workspace-write 2>&1
```

<!-- /ANCHOR:best-practices -->
