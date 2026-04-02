# Spec Kit Memory MCP Server: Installation Guide

> MCP Server v1.7.2 | 2026-03-15

Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 33 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and auto-indexing.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.

---

## 1. AI-FIRST INSTALL GUIDE

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install Spec Kit Memory MCP server from .opencode/skill/system-spec-kit/mcp_server

Please help me:
1. Verify I have Node.js >=18 and npm installed
2. Install dependencies and build the MCP server
3. Configure for my environment (I'm using: [OpenCode / Claude Code / Codex / Gemini / Copilot / Claude Desktop])
4. Verify the installation with a test search query
5. Handle any native module rebuild issues if they occur

My project is located at: [your project path]

Guide me through each step with the exact commands I need to run.
```

Your AI assistant will:
- Verify Node.js and npm are available
- Install Spec Kit Memory dependencies
- Build the MCP server via `npm run build`
- Configure the MCP server for your AI platform
- Test semantic search with a sample query
- Troubleshoot native module issues if needed

**Expected setup time:** 3-5 minutes (clean install), 2-5 minutes (recovery)

---

## TABLE OF CONTENTS

1. [AI-FIRST INSTALL GUIDE](#1-ai-first-install-guide)
2. [OVERVIEW](#2-overview)
3. [PREREQUISITES](#3-prerequisites)
4. [INSTALLATION](#4-installation)
5. [CONFIGURATION](#5-configuration)
6. [VERIFICATION](#6-verification)
7. [USAGE](#7-usage)
8. [FEATURES](#8-features)
9. [EXAMPLES](#9-examples)
10. [TROUBLESHOOTING](#10-troubleshooting)
11. [RESOURCES](#11-resources)

---

## 2. OVERVIEW

Spec Kit Memory is an MCP (Model Context Protocol) server that gives AI assistants semantic memory and context retrieval. It indexes markdown documentation and conversation memories to surface relevant information during AI interactions.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│        AI Clients (OpenCode, Claude Code, Codex, Gemini, Copilot) │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ MCP stdio
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              Spec Kit Memory MCP Server (Node.js)               │
│                                                                 │
│  Context indexing    Semantic search    Trigger matching        │
│  Causal lineage      Adaptive fusion    Extended telemetry      │
│                                                                 │
│  SQLite + sqlite-vec for vector storage                         │
│  Canonical DB: mcp_server/dist/database/context-index.sqlite    │
└────────────────────┬────────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
┌─────────────────┐   ┌────────────────────────────────┐
│ Markdown Docs   │   │ Causal Graph (memory lineage)   │
│ specs/**/memory │   │ Decision-chain relationships     │
│ Constitutional  │   │ Graph-aware reranking signals   │
│ Spec documents  │   │ Runtime graph cache + telemetry │
└─────────────────┘   └────────────────────────────────┘
```

### What This Guide Covers

This guide addresses the full installation lifecycle and common failures after major updates:

- `Error: Cannot find module ...`
- `Cannot find module '@spec-kit/shared/...'`
- `ERR_DLOPEN_FAILED` or `NODE_MODULE_VERSION` mismatch
- sqlite extension load issues (`sqlite-vec unavailable`)
- Server starts but search returns empty or stale results

### Current Runtime Paths (Canonical)

| Path | Purpose |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | MCP entry script |
| `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite` | Canonical database |
| `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Compatibility symlink to dist/database/ |

If documentation references `mcp_server/database/...`, treat that as a compatibility view. The canonical runtime storage is `mcp_server/dist/database/`.

The Code Graph system uses a separate database stored alongside the memory index:

- `code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)
- Tables: `code_files` (indexed source files), `code_nodes` (symbols), `code_edges` (relationships)
- Edge types: `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `DECORATES`, `OVERRIDES`, `TYPE_OF`

### Runtime Coverage Note (2026-03-17)

The repo currently contains checked-in `spec_kit_memory` wiring for five CLI runtimes:

| Runtime | Repo-backed setup evidence | Current proof boundary |
|---|---|---|
| OpenCode | `opencode.json` | Shared MCP backend wiring plus operator-facing setup and verification steps in this guide |
| Claude Code | `.claude/mcp.json` | Shared MCP backend wiring plus operator-facing setup and verification steps in this guide |
| Codex | `.codex/config.toml` | Shared MCP backend wiring plus native capture/save-path coverage in scripts/playbook docs; not a full Hydra end-to-end CLI proof set |
| Gemini | `.gemini/settings.json` | Shared MCP backend wiring plus native capture/save-path coverage in scripts/playbook docs; not a full Hydra end-to-end CLI proof set |
| Copilot | `.vscode/mcp.json` | Shared MCP backend wiring plus native capture/save-path coverage in scripts/playbook docs; not a full Hydra end-to-end CLI proof set |

`Claude Desktop` remains documented here as a generic MCP configuration example, but it is outside the current five-CLI repo-proof set above.
Treat this table as configuration and automation coverage evidence from the repository, not as fresh live-authenticated end-to-end proof for every listed CLI.

---

## 3. PREREQUISITES

Phase 1 verifies the required software on your machine.

### Required Software

1. **Node.js** (version 18 or higher)
   ```bash
   node --version
   # Must show v18.0.0 or higher
   ```

2. **npm** (bundled with Node.js)
   ```bash
   npm --version
   # Must show a version number
   ```

3. **MCP client**: OpenCode, Claude Code, Codex CLI, Gemini CLI, or Copilot MCP/VS Code integration

`Claude Desktop` is also shown below as a generic MCP configuration example.

No additional system dependencies are required beyond Node.js and npm.

### Validation: `phase_1_complete`

```bash
node --version    # v18.0.0 or higher
npm --version     # 9.0.0 or higher
```

Checklist:
- [ ] `node --version` returns v18 or higher
- [ ] `npm --version` returns a version number

❌ **STOP if validation fails.** Install Node.js from https://nodejs.org/ before continuing.

---

## 4. INSTALLATION

This section covers Phase 2 (install) and Phase 3 (initialize).

### Step 1: Navigate to the Skill Directory

```bash
cd .opencode/skill/system-spec-kit
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `better-sqlite3` (SQLite with native bindings)
- `sqlite-vec` (vector extension for semantic search)
- `web-tree-sitter` (WASM-based tree-sitter bindings, no native compilation)
- `tree-sitter-wasms` (pre-compiled WASM grammar bundles for JS, TS, Python, Bash)
- `@huggingface/transformers` (local embedding model)
- `@modelcontextprotocol/sdk` (MCP protocol implementation)
- `chokidar` (file watching for auto-indexing)
- `onnxruntime-common` (ONNX model runtime)
- `zod` (schema validation)

Platform-specific optional packages installed automatically when the platform matches:
- `sqlite-vec-darwin-arm64` (Apple Silicon vector extension, optional)

### Step 3: Build the MCP Server

```bash
npm run build
```

If workspace type errors occur and you only need a runtime build, use:

```bash
npx tsc --build --noCheck --force
```

### Validation: `phase_2_complete`

```bash
ls mcp_server/dist/context-server.js
# Must show the file

ls mcp_server/node_modules/better-sqlite3
# Must show the directory
```

Checklist:
- [ ] `mcp_server/dist/context-server.js` exists
- [ ] `mcp_server/node_modules/better-sqlite3` exists

❌ **STOP if validation fails.** Check the installation output for errors before continuing.

### Step 4: Verify Native Modules (Recommended)

```bash
bash scripts/setup/check-native-modules.sh
```

If the native check reports a mismatch or failure, run:

```bash
bash scripts/setup/rebuild-native-modules.sh
```

### Validation: `phase_3_complete`

```bash
# Smoke test: server should start without crashing
node mcp_server/dist/context-server.js
# Process starts and waits for MCP stdio input
# Press Ctrl+C to exit
```

Checklist:
- [ ] Server starts without immediate crash
- [ ] No `ERR_DLOPEN_FAILED` errors in output

❌ **STOP if validation fails.** Run native module rebuild and see the Troubleshooting section.

---

## 5. CONFIGURATION

Phase 4 connects Spec Kit Memory to your AI assistant.

The repo ships checked-in configuration examples for OpenCode, Claude Code, Codex, Gemini, and Copilot. This guide keeps full copy-paste walkthroughs for OpenCode and Claude surfaces, while the checked-in project configs are the canonical setup references for the other repo-backed CLIs:

- `opencode.json`
- `.claude/mcp.json`
- `.codex/config.toml`
- `.gemini/settings.json`
- `.vscode/mcp.json`

### Option A: OpenCode

Add the following to `opencode.json` in your project root:

```json
{
  "mcp": {
    "spec_kit_memory": {
      "type": "local",
      "command": [
        "node",
        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "environment": {
        "EMBEDDINGS_PROVIDER": "hf-local",
        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite"
      },
      "enabled": true
    }
  }
}
```

Paths are relative to the project root. Use absolute paths if your client requires them:
`/Users/YOUR_USERNAME/path/to/project/.opencode/skill/...`

> **Codex CLI users**: If running in a read-only workspace, override `MEMORY_DB_PATH` with a writable path outside the repo (e.g., `~/.speckit/database/context-index.sqlite`). See `.codex/config.toml` for the default configuration.

### Option B: Claude Code CLI

Add the following to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "spec_kit_memory": {
      "command": "node",
      "args": [
        "${workspaceFolder}/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "env": {
        "EMBEDDINGS_PROVIDER": "hf-local"
      },
      "disabled": false
    }
  }
}
```

Also add the following to `settings.local.json`:

```json
{
  "enabledMcpjsonServers": ["spec_kit_memory"]
}
```

### Option C: Claude Desktop

Config file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following to that file:

```json
{
  "mcpServers": {
    "spec_kit_memory": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/path/to/project/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "env": {
        "EMBEDDINGS_PROVIDER": "hf-local"
      }
    }
  }
}
```

Replace `YOUR_USERNAME` and `path/to/project` with your actual values. Find your username with `whoami`.

### Feature Flag Environment Variables

Add these flags to the `environment` (or `env`) block of any configuration option above. Most runtime retrieval flags use an opt-out pattern and are enabled by default unless you set them to `false`. Observability and memory-roadmap metadata flags remain explicit opt-in.

| Variable | Default | Description |
|---|---|---|
| `SPECKIT_ADAPTIVE_FUSION` | `true` | Controls adaptive intent-based fusion weights. Set to `false` to disable (7 task types). |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | Controls 4-dimension per-retrieval telemetry. Set to `true` to enable metrics collection. |
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | Records the current memory roadmap phase in telemetry, eval baselines, and migration checkpoint metadata. |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | Default-on memory-roadmap graph capability metadata. Distinct from the live `SPECKIT_GRAPH_UNIFIED` runtime retrieval gate. |

**Example** (OpenCode with all flags explicit):

```json
{
  "mcp": {
    "spec_kit_memory": {
      "type": "local",
      "command": [
        "node",
        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "environment": {
        "EMBEDDINGS_PROVIDER": "hf-local",
        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite",
        "SPECKIT_ADAPTIVE_FUSION": "true",
        "SPECKIT_EXTENDED_TELEMETRY": "true",
        "SPECKIT_MEMORY_ROADMAP_PHASE": "graph",
        "SPECKIT_MEMORY_GRAPH_UNIFIED": "true"
      },
      "enabled": true
    }
  }
}
```

### Validation: `phase_4_complete`

```bash
# Verify JSON syntax is valid
python3 -m json.tool < opencode.json > /dev/null
# Or for Claude Code:
python3 -m json.tool < .mcp.json > /dev/null

# Verify the binary path exists
ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
```

Checklist:
- [ ] Configuration file has valid JSON syntax
- [ ] Binary path in config exists on disk
- [ ] Your actual username replaces `YOUR_USERNAME` (for absolute paths)

❌ **STOP if validation fails.** Fix configuration syntax or paths before continuing.

---

## 6. VERIFICATION

Phase 5 verifies the end-to-end connection inside your AI assistant.

### Step 1: Restart Your AI Client

```bash
# OpenCode:
opencode

# Claude Code: Restart VS Code
# Claude Desktop: Quit and reopen the application
```

### Step 2: Check That the MCP Server Is Loaded

Ask your AI assistant:

```
What MCP tools are available?
```

You should see `spec_kit_memory` tools listed, including:
- `memory_context` (unified context retrieval)
- `memory_search` (semantic search)
- `memory_match_triggers` (fast trigger matching)
- `memory_save` (index new memories)
- `memory_index_scan` (bulk indexing)
- `memory_stats` (system statistics)
- `code_graph_scan` (structural code indexing)
- `code_graph_query` (structural relationship queries)
- `code_graph_status` (graph health check)
- `code_graph_context` (LLM-oriented graph neighborhoods)
- `session_health` (session readiness check)
- `session_bootstrap` (complete session bootstrap)
- `session_resume` (combined session resume)

### Step 3: Run a Test Query

Ask your AI assistant:

```
Search memory for documentation about Gate 3
```

You should get relevant memories about Gate 3 (the spec folder question) from AGENTS.md or related documentation.

### Validation: `phase_5_complete`

Checklist:
- [ ] MCP server appears in the tool list
- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
- [ ] No connection errors in responses
- [ ] No `ERR_DLOPEN_FAILED` or module resolution errors

❌ **STOP if validation fails.** Check your MCP configuration, restart the client and consult the Troubleshooting section.

---

## 7. USAGE

### Daily Workflow

The MCP server starts automatically when your AI client launches. No manual start is required.

```bash
# Start your AI client; the MCP server starts in the background
opencode
```

### Common Operations

**Index new memories:**
```
# Ask your AI assistant:
"Scan for new memory files and index them"
# This calls memory_index_scan() internally
```

**Search for context:**
```
# Ask your AI assistant:
"Search memory for [topic]"
"What do we remember about [feature]?"
"Find documentation related to [keyword]"
```

**Resume previous work:**
```
# Ask your AI assistant:
"Load context from spec folder 005-memory"
"Continue work on the authentication feature"
```

### When to Rebuild

Rebuild after:
- Updating your Node.js version
- Pulling updates that change `mcp_server/` code
- Experiencing module resolution errors

```bash
cd .opencode/skill/system-spec-kit
npm install
npm run build
bash scripts/setup/rebuild-native-modules.sh
```

### Phase System Support

The server supports phase folders for multi-phase spec work. Phase folders follow the pattern `specs/NNN-name/001-phase/`. Use the `--recursive` flag in `validate.sh` to validate all phases in a spec folder at once. The `recommend-level.sh` script applies phase detection scoring automatically.

---

## 8. FEATURES

### memory_context: Unified Context Retrieval

`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.

**Modes:**
- `auto` (default): Detect intent and route optimally
- `quick`: Fast trigger-based matching
- `deep`: Full semantic search with query expansion
- `focused`: Intent-optimized retrieval
- `resume`: Session recovery (loads previous state)

**Parameters:**
- `input`: Your query or task description
- `mode`: Retrieval mode (see above)
- `tokenUsage`: Optional float (0.0-1.0) to override pressure-aware mode selection

Query expansion activates automatically when you use `mode="deep"`.

### memory_search: Semantic Search

`memory_search()` runs vector-based similarity search across all indexed memories.

**Key parameters:**
- `query`: Natural language search query
- `limit`: Max results (default 10)
- `minState`: Minimum memory state (HOT, WARM, COLD, DORMANT, ARCHIVED)
- `intent`: Task intent for weight adjustments (add_feature, fix_bug, refactor, etc.)
- `includeContent`: Embed full file content in results

### memory_match_triggers: Fast Keyword Lookup

`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.

### memory_save: Index a Memory File

`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.

### memory_index_scan: Bulk Indexing

`memory_index_scan()` scans the workspace for new or changed memory files and indexes them.

**Options:**
- `force`: Re-index all files, ignoring content hash
- `specFolder`: Limit scan to a specific folder
- `includeConstitutional`: Include `.opencode/skill/*/constitutional/`
- `includeSpecDocs`: Include spec folder documents (spec.md, plan.md, etc.)

### memory_stats: System Statistics

`memory_stats()` returns counts, dates and top-ranked folders for the memory system. Use it to confirm indexing is working and to inspect database health.

### Causal Lineage System

Causal support in the current runtime is relationship-driven and runs in-process.

**Behavior:**
- Causal traversal augments memory retrieval for lineage/"why" queries
- Causal relationship tools support explicit dependency and provenance tracing
- Retrieval metrics are emitted when extended telemetry is enabled

**Link validation:** Run `check-links.sh` to validate markdown links in skill docs.

### Adaptive Hybrid Fusion

**Flag:** `SPECKIT_ADAPTIVE_FUSION` (default: on)

When enabled, this feature adjusts the balance between vector similarity and keyword relevance based on the detected task type. It supports 7 task types: `add_feature`, `fix_bug`, `refactor`, `understand`, `plan`, `debug` and `resume`. For example, `fix_bug` boosts exact-match keyword signals while `understand` emphasizes semantic similarity.

### Cross-Encoder Reranking

Cross-encoder reranking is enabled by default. The reranker applies a second-pass scoring pass over the top-K candidates returned by the initial retrieval, improving result ordering for ambiguous queries.

### Evidence Gap Warnings

When Z-score analysis signals low-confidence retrieval (insufficient signal in the indexed corpus), the server prepends an evidence gap warning to the LLM payload. This tells the AI assistant that results may be incomplete rather than letting it treat sparse results as authoritative.

### Extended Telemetry

**Flag:** `SPECKIT_EXTENDED_TELEMETRY` (default: off)

Collects 4-dimension metrics per retrieval operation:
- `latency`: End-to-end retrieval time (ms)
- `mode`: Which retrieval mode was selected
- `fallback`: Whether degraded-mode fallback triggered
- `quality`: Result quality score based on embedding confidence and match density

Enable by setting `SPECKIT_EXTENDED_TELEMETRY: "true"`.

### Artifact-Class Routing

Routes retrieval requests through per-type strategies based on the artifact being queried. Supports 8 artifact types: `spec`, `plan`, `checklist`, `decision-record`, `memory`, `implementation-summary`, `research` and `handover`. Each type applies its own indexing and ranking rules (for example, `memory` uses recency-weighted scoring while `decision-record` boosts causal edges).

### Append-Only Mutation Ledger

Every memory mutation (index, update, delete, force-reindex) appends a timestamped record to an immutable audit trail. No entry is ever overwritten or removed. Use the ledger to debug unexpected index state or audit what changed during a session.

### Typed Retrieval Contracts

Enforces schema contracts on retrieval inputs and outputs. Three contract types apply:
- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
- `RetrievalTrace`: Attached to search results, records which retrieval path was taken and why
- `DegradedModeContract`: Emitted when the server falls back to non-vector behavior, describes what capability is reduced and the recovery path

---

## 9. EXAMPLES

### Example 1: Fresh Install and First Search

```bash
# Install
cd .opencode/skill/system-spec-kit
npm install
npm run build

# Add config to opencode.json (see Configuration section)

# Restart OpenCode
opencode

# Ask your AI:
"Search memory for documentation about spec folders"
```

**Expected result:** Memories from AGENTS.md and system-spec-kit about spec folder creation.

### Example 2: Post-Update Recovery

```bash
# Symptom: Server won't start, module errors

cd .opencode/skill/system-spec-kit
npm install
npm run build
bash scripts/setup/rebuild-native-modules.sh

# Verify:
node mcp_server/dist/context-server.js
# Must start without errors (Ctrl+C to exit)

# Restart your AI client
```

### Example 3: Resume Previous Work

Ask your AI assistant:

```
Load context from spec folder 012-authentication and show me what we were working on
```

**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.

### Example 4: Intent-Aware Context Loading

Ask your AI assistant:

```
I need to add a new feature for user profiles
```

**Behind the scenes:**
1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
2. Intent detected: `add_feature`
3. Returns memories about feature implementation patterns, related code and similar features

### Example 5: Bulk Indexing After Creating Memories

```bash
# After creating multiple memory files in specs/*/memory/

# Ask your AI:
"Scan for new memory files and index them"
```

**Behind the scenes:**
1. AI calls `memory_index_scan({ force: false })`
2. Server scans `specs/**/memory/`, `.opencode/skill/**/constitutional/` and spec documents
3. Indexes changed or new files, skipping unchanged ones based on content hash

### Example 6: Enabling Adaptive Fusion for a Debug Session

Add to your config and restart:

```json
"environment": {
  "SPECKIT_ADAPTIVE_FUSION": "true"
}
```

Then ask your AI:

```
Search memory for why we chose SQLite over PostgreSQL
```

**Behind the scenes:** Intent is classified as `understand`. Adaptive fusion applies a semantic-heavy weight profile, improving recall for conceptual queries over exact keyword matches.

### Example 7: Troubleshooting Empty Search Results

```bash
# Symptom: Search returns no results

# Check the database:
sqlite3 .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite \
  "SELECT COUNT(*) FROM memory_index"
# Shows the memory count

# If 0 or very low:
# Ask your AI: "Index all memory files"

# Restart your AI client after indexing completes
```

### Example 8: Troubleshooting Codex MCP Startup Failure

```bash
# Symptom: Codex cannot initialize spec_kit_memory MCP server

# Check 1: MEMORY_DB_PATH must be writable
# In .codex/config.toml, verify the path is writable:
ls -la "$(grep MEMORY_DB_PATH .codex/config.toml | cut -d'"' -f2)"

# Check 2: No stdout contamination
# All MCP server logging must use stderr (console.error).
# stdout is reserved for MCP JSON-RPC protocol messages.

# Fix: Override MEMORY_DB_PATH to a writable location:
# In .codex/config.toml, set:
#   MEMORY_DB_PATH = "/Users/YOUR_USERNAME/.speckit/database/context-index.sqlite"
```

### Example 9a: Validating Markdown Links

```bash
# From the skill root:
bash .opencode/skill/system-spec-kit/scripts/check-links.sh
# Reports broken markdown links across skill documentation
```

### Example 9: Phase Folder Validation

```bash
# Validate all phases in a spec folder recursively:
bash .opencode/skill/system-spec-kit/scripts/validate.sh \
  specs/012-authentication --recursive
```

---

## 10. TROUBLESHOOTING

### Error Reference Table

| Error | Cause | Fix |
|---|---|---|
| `Cannot find module '@spec-kit/shared/...'` | Workspace dependency state is incomplete or stale | Run `npm install && npm run build` from the skill root |
| `ERR_DLOPEN_FAILED` | Native module compiled for a different Node.js ABI | Run `bash scripts/setup/rebuild-native-modules.sh` |
| `NODE_MODULE_VERSION mismatch` | Node.js was updated after native modules were compiled | Run `bash scripts/setup/rebuild-native-modules.sh` |
| `sqlite-vec unavailable` | Platform-specific native package failed to load | Run `npm install && npm rebuild` in both `mcp_server/` and `scripts/` |
| Server starts but returns no memories | No indexed memories yet, or embeddings are pending | Run `memory_index_scan({ force: true })` via your AI |
| Database appears stale after restore | Client still uses old MCP process with in-memory state | Fully restart OpenCode or Claude Code |
| MCP server not in tools list | Configuration file error or path is wrong | Validate JSON syntax and verify binary path (see below) |
| Wikilink validation fails | Broken `[[node-name]]` reference in a skill node file | Run `check-links.sh` and fix the reported broken links |

### Detailed Fixes

**"Cannot find module '@spec-kit/shared/...'"**

Run from the skill root:

```bash
cd .opencode/skill/system-spec-kit
npm install
npm run build
```

If still failing, remove and reinstall all local workspace modules:

```bash
rm -rf .opencode/skill/system-spec-kit/node_modules
rm -rf .opencode/skill/system-spec-kit/mcp_server/node_modules
rm -rf .opencode/skill/system-spec-kit/shared/node_modules
cd .opencode/skill/system-spec-kit
npm install
npm run build
```

**`ERR_DLOPEN_FAILED` or `NODE_MODULE_VERSION` mismatch**

```bash
cd .opencode/skill/system-spec-kit
bash scripts/setup/rebuild-native-modules.sh
bash scripts/setup/check-native-modules.sh
```

Inspect runtime and module versions:

```bash
node -e "console.log('Node', process.version, 'MODULE_VERSION', process.versions.modules)"
```

**`sqlite-vec unavailable`**

```bash
cd .opencode/skill/system-spec-kit
npm install
npm rebuild
```

Verify the platform package is present:

```bash
ls mcp_server/node_modules/sqlite-vec-darwin-arm64/vec0.dylib
ls scripts/node_modules/sqlite-vec-darwin-arm64/vec0.dylib
```

`sqlite-vec-darwin-arm64` is an optional dependency installed automatically on Apple Silicon. On other platforms, the equivalent platform package is resolved by npm. The server degrades to non-vector behavior when sqlite-vec is unavailable. Semantic similarity quality drops until you fix the extension.

**Server runs but returns no memories**

Check the database:

```bash
sqlite3 .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite \
  "SELECT COUNT(*) FROM memory_index"

sqlite3 .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite \
  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"
```

Recovery: ask your AI "Index all memory files" (calls `memory_index_scan({ force: true })`). Restart your MCP client after manual database operations.

**MCP server not appearing in tools**

1. Validate config syntax:
   ```bash
   python3 -m json.tool < opencode.json
   ```
2. Verify the binary path exists:
   ```bash
   ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
   ```
3. Restart your AI client completely.

### Build Fails with TypeScript Errors

If `npm run build` fails with type errors in workspace packages:

```bash
cd .opencode/skill/system-spec-kit
npx tsc --build --noCheck --force
```

This bypasses type checking for a runtime-only build. Use this when you need the server running quickly and will address type errors separately.

### Stale Search Results After Database Restore

After restoring a database backup or switching branches, the MCP server process may hold cached state from the previous database.

```bash
# Fully restart your AI client (not just reload)
# OpenCode: exit and re-launch
# Claude Code: restart VS Code
# Claude Desktop: quit and reopen the application
```

The MCP process loads the database on startup. A client reload does not always restart the MCP server process.

### Root Cause Summary (Post-Update Failures)

The four most common failure modes after a major update:

1. **Install or build run from wrong directory.** Partial installs leave workspace links unresolved, particularly `@spec-kit/shared`.
2. **Native module ABI mismatch after a Node.js update.** `better-sqlite3` and `sqlite-vec` were compiled for an older `MODULE_VERSION`.
3. **Stale build output after dependency changes.** The `dist/` folder was not rebuilt, or was rebuilt without the required workspace state.
4. **Database path confusion.** Users inspect `mcp_server/database/...` while the runtime writes to `dist/database/...`. These point to the same data via a symlink, but direct file system tools may see different apparent paths.

---

### Rollback Procedure

Use this procedure when an update leaves the server broken and you need to restore a working state.

**Step 1: Back up the current database (if it has data you want to keep)**

```bash
cp .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite \
   .opencode/skill/system-spec-kit/mcp_server/dist/database/rollback-$(date +%Y%m%d-%H%M%S).sqlite
```

**Step 2: Remove built output and reinstalled modules**

```bash
cd .opencode/skill/system-spec-kit
rm -rf mcp_server/dist
rm -rf mcp_server/node_modules
rm -rf shared/node_modules
rm -rf node_modules
```

**Step 3: Reinstall and rebuild from a clean state**

```bash
cd .opencode/skill/system-spec-kit
npm install
npm run build
```

**Step 4: Verify the server starts**

```bash
node mcp_server/dist/context-server.js
# Must start without errors — press Ctrl+C to exit
```

**Step 5: Rebuild native modules if needed**

```bash
bash scripts/setup/rebuild-native-modules.sh
bash scripts/setup/check-native-modules.sh
```

**Step 6: Restore the database backup if the fresh database is empty**

```bash
cp .opencode/skill/system-spec-kit/mcp_server/dist/database/rollback-YYYYMMDD-HHMMSS.sqlite \
   .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite
```

**Step 7: Restart your AI client and re-index**

Restart OpenCode, Claude Code, or Claude Desktop. Then ask your AI assistant to index all memory files:

```
Index all memory files
```

This calls `memory_index_scan({ force: true })` to repopulate the search index from the restored database.

---

## 11. RESOURCES

### File Locations

| Path | Purpose |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | MCP server entry point |
| `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite` | Canonical database (runtime) |
| `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Compatibility symlink |
| `.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh` | Verify Node.js version and prerequisites |
| `.opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh` | Native module diagnostics |
| `.opencode/skill/system-spec-kit/scripts/setup/rebuild-native-modules.sh` | Native module rebuild |
| `.opencode/skill/system-spec-kit/scripts/check-links.sh` | Documentation wikilink validator |
| `.opencode/skill/system-spec-kit/scripts/validate.sh` | Spec folder validator (supports --recursive) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts` | Vector index implementation |
| `.opencode/skill/system-spec-kit/mcp_server/database/README.md` | Database path notes |

### CLI Command Reference

```bash
# Install and build
cd .opencode/skill/system-spec-kit
npm install
npm run build

# Prerequisites check
bash scripts/setup/check-prerequisites.sh

# Native module diagnostics
bash scripts/setup/check-native-modules.sh
bash scripts/setup/rebuild-native-modules.sh

# Smoke test
node mcp_server/dist/context-server.js

# Validate configuration
python3 -m json.tool < opencode.json > /dev/null

# Database inspection
sqlite3 mcp_server/dist/database/context-index.sqlite \
  "SELECT COUNT(*) FROM memory_index"

sqlite3 mcp_server/dist/database/context-index.sqlite \
  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"

# Backup database
cp mcp_server/dist/database/context-index.sqlite \
  mcp_server/dist/database/backup-$(date +%Y%m%d-%H%M%S).sqlite

# Validate documentation wikilinks
bash .opencode/skill/system-spec-kit/scripts/check-links.sh

# Validate spec folder phases recursively
bash .opencode/skill/system-spec-kit/scripts/validate.sh specs/NNN-name --recursive
```

### Quick Reference Card

```
INSTALL:      cd .opencode/skill/system-spec-kit && npm install && npm run build
PREREQS:      bash scripts/setup/check-prerequisites.sh
NATIVE CHECK: bash scripts/setup/check-native-modules.sh
NATIVE FIX:   bash scripts/setup/rebuild-native-modules.sh
SMOKE TEST:   node mcp_server/dist/context-server.js
DB PATH:      mcp_server/dist/database/context-index.sqlite
GRAPH LINKS:  bash scripts/check-links.sh
PHASE VALID:  bash scripts/validate.sh specs/NNN-name --recursive

FEATURE FLAGS (env vars):
  SPECKIT_ADAPTIVE_FUSION    default: true     (false = disable intent-based fusion)
  SPECKIT_EXTENDED_TELEMETRY default: false    (true = enable metrics)
  SPECKIT_MEMORY_ROADMAP_PHASE default: shared-rollout (final roadmap default)

MCP TOOLS: memory_context, memory_search, memory_match_triggers,
           memory_save, memory_index_scan, memory_stats
```

### External Resources

- MCP package manifest: `.opencode/skill/system-spec-kit/mcp_server/package.json`
- Skill README: `.opencode/skill/system-spec-kit/README.md`
- Memory context in spec folders: `specs/*/memory/`

---

## VERSION HISTORY

| Version | Date | Summary |
|---|---|---|
| v1.7.2 | 2026-03-15 | Dependency audit: `sqlite-vec-darwin-arm64` moved to `optionalDependencies`. Added `@huggingface/transformers`, `chokidar`, `onnxruntime-common`, `zod`. `node-llama-cpp` added as optional. Rollback procedure added. Prerequisites script (`check-prerequisites.sh`) documented. |
| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
| v1.x | 2025 | Adaptive fusion, extended telemetry, artifact-class routing, append-only mutation ledger, typed retrieval contracts. Semantic search, trigger matching, intent-aware context, session deduplication. |
