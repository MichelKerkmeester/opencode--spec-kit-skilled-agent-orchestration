---
title: "Gemini CLI Built-in Tools Reference"
description: "Reference for Gemini CLI built-in tools including google_web_search, codebase_investigator, save_memory, and browser_agent with Claude Code equivalents comparison."
---

# Gemini CLI Built-in Tools Reference

Reference for all Gemini CLI tools, highlighting unique capabilities and Claude Code equivalents.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Delegate to Gemini CLI for tools Claude Code lacks natively — especially `google_web_search` for live web results and `codebase_investigator` for holistic architecture analysis.

### Purpose

Covers all built-in tools available in Gemini CLI, highlights what is unique compared to Claude Code, and provides a comparison table for task routing decisions.

### When to Use

- Choosing whether to delegate a task to Gemini CLI or handle it in Claude Code
- Understanding which Gemini tools to request explicitly via `--allowed-tools`
- Mapping Claude Code capabilities to Gemini CLI equivalents
- Leveraging Gemini-exclusive tools (web search, codebase investigator, memory, browser agent)

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:unique-tools -->
## 2. UNIQUE TOOLS (NOT IN CLAUDE CODE)

These tools are exclusive to Gemini CLI or provide significantly different capabilities.

### google_web_search

**Native Google Search integration.** Gemini can search the live web using Google's search infrastructure, returning current, ranked results.

**Capabilities:**
- Full Google Search quality and index
- Real-time results (not cached/stale)
- Understands search intent, reformulates queries automatically
- Returns snippets, URLs, and structured data where available
- Supports follow-up searches to refine results

**Usage Examples:**

```
"What are the latest security advisories for Express.js?"
-> Gemini invokes google_web_search automatically

"Find the official migration guide for Prisma 5 to 6"
-> Searches, returns relevant documentation links

"What npm packages provide rate limiting for Redis?"
-> Searches, compares options, provides recommendations
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

**Compared to Claude Code:** Claude Code has a web search tool that provides search results, but Gemini's `google_web_search` leverages Google's full search infrastructure natively, often providing more comprehensive web results.

---

### codebase_investigator

**Architectural analysis tool.** Performs deep codebase investigation to understand structure, dependencies, and patterns at scale.

**Capabilities:**
- Analyzes project structure and architecture holistically
- Maps dependency graphs between modules
- Identifies design patterns in use
- Understands build systems and configuration
- Traces data flow through the application
- Can process very large codebases (leveraging Gemini's 1M+ token context)

**Output Format:**
- Structured analysis with sections (architecture, dependencies, patterns)
- File-level and module-level summaries
- Dependency trees and call graphs (textual)
- Identified patterns with file references

**Usage Examples:**

```
"How is authentication implemented in this project?"
-> codebase_investigator traces auth flow across files

"What design patterns does this codebase use?"
-> Analyzes structure, identifies patterns with examples

"Map the data flow from API request to database write"
-> Traces the full request lifecycle with file references

"What would break if I removed src/legacy/adapter.ts?"
-> Impact analysis across the codebase
```

**Best For:**
- Understanding unfamiliar codebases quickly
- Impact analysis before major refactoring
- Architecture documentation generation
- Onboarding to new projects
- Finding all usages of a pattern or module

**Compared to Claude Code:** Claude Code uses individual tools (Grep, Glob, Read) composed by the model. Gemini's `codebase_investigator` is a single tool that performs holistic analysis, potentially more efficient for broad architectural questions.

---

### save_memory

**Persistent memory across sessions.** Stores information that persists beyond the current conversation and is automatically surfaced in future sessions.

**Capabilities:**
- Save arbitrary key-value information
- Automatically loaded in future sessions
- Scoped to project or global
- Supports structured data (preferences, decisions, context)
- Managed via `/memory` interactive commands

**Usage:**

```
"Remember that we decided to use the repository pattern for data access"
-> save_memory stores this decision

"Save that the production database is PostgreSQL 15 on port 5433"
-> Persists as project context

"/memory show"       -> View all saved memories
"/memory refresh"    -> Reload from disk
"/memory add <text>" -> Manually add entry
```

**Storage Location:**
- Project-level: `.gemini/memory.json`
- Global: `~/.gemini/memory.json`

**Best For:**
- Preserving architectural decisions across sessions
- Storing project-specific conventions that GEMINI.md does not cover
- Remembering user preferences for a project
- Tracking progress on multi-session tasks

**Compared to Claude Code:** Claude Code does not have built-in persistent memory. Projects use external memory systems (like Spec Kit Memory MCP) or CLAUDE.md files for persistence. Gemini's `save_memory` is simpler but less structured.

---

### browser_agent (Experimental)

**Web automation via accessibility tree.** Navigates websites, interacts with elements, and extracts information using the browser's accessibility representation.

**Capabilities:**
- Navigate to URLs and interact with page elements
- Fill forms, click buttons, follow links
- Extract text and structured data from web pages
- Operates via accessibility tree (not visual rendering)
- Supports multi-step web workflows

**Usage Examples:**

```
"Go to the GitHub Actions page for this repo and check the latest CI status"
-> Navigates to GitHub, reads CI results

"Fill out the deployment form at internal-tool.example.com"
-> Navigates, identifies form fields, fills in values
```

**Status:** Experimental. May not be available in all installations. Behavior may change between versions.

**Best For:**
- Checking CI/CD status on web UIs
- Extracting information from web dashboards
- Simple web automation tasks during development

**Compared to Claude Code:** Claude Code does not have a built-in browser automation tool. Browser interaction requires external MCP servers (e.g., Chrome DevTools MCP). Gemini's `browser_agent` is built-in but experimental.

<!-- /ANCHOR:unique-tools -->

---

<!-- ANCHOR:standard-tools -->
## 3. STANDARD TOOLS (SIMILAR TO CLAUDE CODE)

These tools provide functionality comparable to Claude Code's built-in tools, with Gemini-specific syntax variations.

### File System Tools

| Tool | Description | Gemini Syntax |
|------|-------------|---------------|
| `list_directory` | List files and directories | Automatic or `@./path/` |
| `read_file` | Read file contents | Automatic or `@file.ts` |
| `write_file` | Create or overwrite a file | Automatic (requires approval unless YOLO) |
| `replace` | Replace text in a file | Automatic (surgical edits) |
| `read_many_files` | Read multiple files at once | `@file1.ts @file2.ts` or `@src/**/*.ts` |
| `glob` | Find files by pattern | Automatic pattern matching |
| `search_file_content` | Search for text/regex in files | Automatic content search |

### Interaction Tools

| Tool | Description | Notes |
|------|-------------|-------|
| `ask_user` | Prompt user for input/clarification | Used when Gemini needs more information |
| `write_todos` | Create/update TODO tracking | Task management within session |
| `activate_skill` | Load and activate a linked skill | Skills system integration |
| `get_internal_docs` | Retrieve internal documentation | Loads GEMINI.md and project context |

### External Tools

| Tool | Description | Gemini Syntax |
|------|-------------|---------------|
| `web_fetch` | Fetch URL content | Automatic or explicit request |
| `run_shell_command` | Execute shell commands | Automatic or `!command` prefix |

<!-- /ANCHOR:standard-tools -->

---

<!-- ANCHOR:comparison-table -->
## 4. CLAUDE CODE VS. GEMINI CLI TOOL COMPARISON

| Capability | Claude Code Tool | Gemini CLI Tool | Notes |
|------------|-----------------|-----------------|-------|
| **File listing** | `Bash: ls`, `Glob` | `list_directory`, `glob` | Functionally equivalent |
| **File reading** | `Read` | `read_file`, `@file` | Gemini `@` syntax is more concise |
| **File writing** | `Write`, `Edit` | `write_file`, `replace` | Both support create and surgical edit |
| **Code search** | `Grep` (ripgrep) | `search_file_content` | Claude's Grep is ripgrep-powered |
| **Web fetch** | `WebFetch` | `web_fetch` | Similar capabilities |
| **Web search** | `WebSearch` | `google_web_search` | Gemini uses native Google Search |
| **Architecture analysis** | Manual (Grep+Read+Glob) | `codebase_investigator` | Gemini has dedicated tool |
| **Memory/persistence** | External (Spec Kit MCP) | `save_memory` (built-in) | Different approaches |
| **Task tracking** | External (TodoWrite) | `write_todos` | Both track TODOs |
| **Shell commands** | `Bash` | `run_shell_command`, `!cmd` | Functionally equivalent |
| **Browser automation** | External MCP | `browser_agent` (experimental) | Gemini built-in but experimental |
| **MCP integration** | Native + Code Mode | `settings.json` mcpServers | Both support MCP protocol |
| **Multi-file read** | Multiple `Read` calls | `read_many_files`, `@glob` | Gemini batches natively |
| **Image analysis** | `Read` (multimodal) | Multimodal input | Both support image understanding |

<!-- /ANCHOR:comparison-table -->

---

<!-- ANCHOR:tool-invocation -->
## 5. TOOL INVOCATION

### Automatic Selection

Gemini automatically selects and invokes tools based on the prompt. No explicit tool calls needed.

| Prompt Pattern | Tool Selected | Example |
|---------------|---------------|---------|
| Questions about code | `read_file`, `search_file_content` | "What does the auth middleware do?" |
| Modify/create requests | `write_file`, `replace` | "Add error handling to utils.ts" |
| Search/find requests | `search_file_content`, `glob` | "Find all TODO comments" |
| Web/current info | `google_web_search` | "Latest Express.js version?" |
| Architecture questions | `codebase_investigator` | "How is the app structured?" |
| Shell operations | `run_shell_command` | "Run the test suite" |
| File exploration | `list_directory`, `glob` | "What files are in src/?" |

### Explicit Tool Requests

You can explicitly request specific tools:

```
"Use google_web_search to find the latest CVEs for lodash"
"Run codebase_investigator to map the dependency graph"
"Use search_file_content to find all console.log statements"
```

### Tool Approval Modes

| Mode | Flag | Behavior |
|------|------|----------|
| Always ask | `--approval-mode always` | Every tool call requires approval |
| Allow-listed | `--approval-mode unless-allow-listed` | Approved tools run freely (default) |
| Never ask (YOLO) | `--approval-mode never` or `-y` | All tools run without approval |

<!-- /ANCHOR:tool-invocation -->

---

<!-- ANCHOR:tool-statistics -->
## 6. TOOL STATISTICS IN JSON OUTPUT

When using `-o json`, the response includes tool usage statistics:

```json
{
  "response": "...",
  "toolCalls": [
    {
      "name": "read_file",
      "args": { "path": "src/auth.ts" },
      "result": "// file contents..."
    },
    {
      "name": "search_file_content",
      "args": { "query": "validateToken", "path": "src/" },
      "result": "src/auth.ts:42: function validateToken(...)"
    },
    {
      "name": "google_web_search",
      "args": { "query": "JWT best practices 2025" },
      "result": "..."
    }
  ],
  "stats": {
    "totalInputTokens": 15230,
    "totalOutputTokens": 2840,
    "totalTurns": 3,
    "toolCallCount": 5,
    "duration": "12.4s"
  }
}
```

### Stats Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalInputTokens` | number | Total tokens sent to the model |
| `totalOutputTokens` | number | Total tokens generated by the model |
| `totalTurns` | number | Number of model turns (prompt-response cycles) |
| `toolCallCount` | number | Total number of tool invocations |
| `duration` | string | Wall-clock time for the full interaction |

<!-- /ANCHOR:tool-statistics -->

---

<!-- ANCHOR:tool-restrictions -->
## 7. TOOL RESTRICTIONS

### Command-Line Restriction

Restrict available tools per invocation:

```bash
# Only allow read operations
gemini --allowed-tools read_file,search_file_content,list_directory,glob \
  "Analyze the authentication flow"

# Allow reads and web search
gemini --allowed-tools read_file,search_file_content,google_web_search \
  "Compare our auth approach with industry best practices"

# Deny write operations for review-only workflows
gemini --allowed-tools read_file,search_file_content,glob,list_directory,google_web_search \
  "Review this PR for issues"
```

### Settings-Based Restriction

In `settings.json`:

```json
{
  "allowedTools": [
    "read_file",
    "search_file_content",
    "list_directory",
    "glob",
    "google_web_search",
    "web_fetch"
  ]
}
```

### Restriction Strategy

| Use Case | Allowed Tools | Rationale |
|----------|---------------|-----------|
| Code review (read-only) | read_file, search_file_content, glob, list_directory | Prevent accidental modifications |
| Research only | google_web_search, web_fetch, read_file | Prevent file system changes |
| File editing only | read_file, write_file, replace, glob | Prevent external access |
| Full access (YOLO) | All (default) | Development with auto-approve |

<!-- /ANCHOR:tool-restrictions -->

---

<!-- ANCHOR:best-practices -->
## 8. BEST PRACTICES

### When to Use google_web_search

- Checking latest package versions, changelogs, and migration guides
- Looking up CVEs and security advisories
- Finding current API documentation (especially for rapidly evolving APIs)
- Comparing libraries or frameworks with current community sentiment
- Verifying deprecated features or breaking changes

**Avoid for:** Information already in the codebase or GEMINI.md context.

### When to Use codebase_investigator

- First encounter with an unfamiliar codebase
- Before major refactoring to understand impact
- Mapping dependencies and data flow
- Generating architecture documentation
- Understanding how a feature is implemented across multiple files

**Avoid for:** Simple file lookups (use read_file) or text searches (use search_file_content).

### When to Use save_memory

- After making architectural decisions that affect future work
- Recording project-specific conventions discovered during exploration
- Preserving findings from research that will be needed in later sessions
- Storing configuration details that are not in code or docs

**Avoid for:** Information already in GEMINI.md or code comments.

### Tool Combination Patterns

| Goal | Tool Combination | Flow |
|------|-----------------|------|
| **Understand then modify** | codebase_investigator -> read_file -> replace | Analyze, focus, edit |
| **Research then implement** | google_web_search -> read_file -> write_file | Learn, contextualize, create |
| **Audit codebase** | codebase_investigator -> search_file_content -> google_web_search | Map, find issues, verify against best practices |
| **Fix with context** | search_file_content -> read_file -> replace | Locate, understand, fix |
| **Document architecture** | codebase_investigator -> save_memory -> write_file | Analyze, persist, document |
| **Security review** | search_file_content -> google_web_search -> read_file | Find patterns, check CVEs, verify |

### Orchestration from Claude Code

When calling Gemini CLI from Claude Code, choose tools strategically:

```bash
# Use codebase_investigator for broad analysis
echo "Use codebase_investigator to map the module dependency graph" | \
  gemini -o json -m gemini-3.1-pro-preview

# Use google_web_search for current information
echo "Use google_web_search to find the latest Prisma migration guide" | \
  gemini -o json -m gemini-3.1-pro-preview

# Restrict to read-only for safe analysis
echo "Review src/auth/ for security issues" | \
  gemini --allowed-tools read_file,search_file_content,glob,google_web_search -o json
```

<!-- /ANCHOR:best-practices -->
