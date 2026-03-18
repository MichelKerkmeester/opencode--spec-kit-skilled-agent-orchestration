---
title: "Feature Research: CocoIndex Code MCP Integration - Comprehensive Technical Investigation"
description: "Complete research documentation for integrating CocoIndex Code semantic code search into the OpenCode multi-CLI ecosystem."
trigger_phrases:
  - "cocoindex"
  - "semantic code search"
  - "code indexing"
  - "coco-index"
  - "code intelligence"
importance_tier: "important"
contextType: "research"
---
# Feature Research: CocoIndex Code MCP Integration - Comprehensive Technical Investigation

Complete research documentation for integrating CocoIndex Code semantic code search into the OpenCode multi-CLI ecosystem as a 4th MCP server.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. METADATA

- **Research ID**: RESEARCH-022
- **Feature/Spec**: 022-mcp-coco-integration
- **Status**: Complete
- **Date Started**: 2026-03-18
- **Date Completed**: 2026-03-18
- **Researcher(s)**: Claude Opus 4.6 (3 sub-agents) + GPT-5.4 via Copilot CLI (3 agents) — 6 parallel investigators
- **Reviewers**: Michel Kerkmeester
- **Last Updated**: 2026-03-18

**Related Documents**:
- Source: [cocoindex-io/cocoindex-code](https://github.com/cocoindex-io/cocoindex-code)
- Parent project: [CocoIndex](https://cocoindex.io)

---

## 2. INVESTIGATION REPORT

### Request Summary

Investigate CocoIndex Code MCP server for smart integration into the OpenCode multi-CLI ecosystem. The goal is not merely adding another MCP server but finding synergies with existing systems (Spec Kit Memory, Code Mode, Sequential Thinking) and enhancing the agent workflow (@context, @research) with semantic code search capabilities.

### Current Behavior

OpenCode currently has **no semantic code search**. Code exploration relies on:
- **Grep** (ripgrep): Exact/regex text pattern matching
- **Glob**: File path pattern matching
- **Read**: Full file content retrieval
- **@context agent**: 3-layer retrieval (Memory triggers → Codebase scan → Deep memory)

All current code tools are **stateless and ephemeral** — no persistent index, no semantic understanding, no code graph. The @context agent must re-discover code structure every session.

### Key Findings

1. **CocoIndex Code is a Python MCP server** exposing a single `search` tool for semantic code search via vector embeddings. It uses a Rust-powered indexing engine, SQLite with sqlite-vec for storage, and a persistent background daemon. Installation is `pipx install cocoindex-code`, MCP launch is `ccc mcp`. [SOURCE: GitHub README, pyproject.toml, server.py]

2. **Genuine gap filled**: OpenCode has zero semantic code search capability. CocoIndex enables natural-language queries ("find authentication middleware") without knowing exact function/variable names. This is the primary value proposition. [SOURCE: @context agent definition at `.claude/agents/context.md`]

3. **Fully compatible architecture**: MCP uses stdio transport (JSON-RPC over stdin/stdout), making language runtime irrelevant. A Python MCP server coexists with Node.js MCP servers with zero conflicts. The existing config pattern (`.mcp.json`, `opencode.json`) supports it natively. [SOURCE: `.mcp.json`, `opencode.json`]

4. **Chunking is text-based, NOT AST-based**: Despite README marketing, the actual `indexer.py` uses `RecursiveSplitter` (1000-char text chunks with 150-char overlap), not tree-sitter AST node extraction. Language-aware but not structure-aware. [SOURCE: `indexer.py` source code]

5. **Alpha dependency risk**: Core dependency `cocoindex==1.0.0a33` is pre-release. PyPI package version is `0.2.3`. 927 GitHub stars, 145 commits, 13 open issues. Very actively maintained (daily commits) but young. [SOURCE: GitHub repository, PyPI]

7. **PATH collision warning**: An existing `/opt/homebrew/bin/ccc` binary (unrelated Node package) conflicts with CocoIndex's `ccc` CLI. Must install with `pipx install --python python3.11 cocoindex-code` and may need explicit path resolution. [SOURCE: GPT-5.4 Agent 1 practical testing]

8. **Cold start is 20-30 seconds**: Test suites allow 20-30s for daemon startup and index readiness, significantly longer than initially estimated. Warm daemon queries are fast. [SOURCE: GPT-5.4 Agent 1 analysis of test_e2e_daemon.py timeouts]

9. **Competitive landscape validates choice**: CocoIndex is the best OSS MCP-native option. Sourcegraph MCP is enterprise/commercial, DeepContext MCP (271 stars) covers only TS/Python, Bloop is archived, Aider has no MCP server. [SOURCE: GPT-5.4 Agent 2 competitive analysis]

6. **No hybrid search**: Vector-only retrieval — no BM25/keyword complement. Known gap tracked in issue #44. Our Spec Kit Memory has 4-stage hybrid search (Vector + BM25 + FTS5 with RRF fusion), making this a notable limitation. [SOURCE: CocoIndex issue tracker]

### Recommendations

**Primary Recommendation:**
- **Conditional GO with phased rollout via pipx as direct MCP server**. Rationale: fills genuine capability gap, minimal integration effort (4-line config change), full dependency isolation, opt-in activation, follows existing patterns exactly.

**Alternative Approaches:**
- **Node.js wrapper**: REJECTED — adds complexity with no measurable benefit since MCP abstracts transport
- **Docker container**: REJECTED — massive overhead for a local development tool
- **Build custom semantic search into Spec Kit Memory**: Higher effort but would avoid external dependency; consider for long-term if CocoIndex proves unstable

### Addendum: Phase 2 Follow-Up Hardening

Follow-up deep-research iterations after Phase 2 showed that the highest-value next step is not new runtime routing logic, but a sibling-repo adoption bundle plus stricter readiness semantics.

- `doctor.sh` should remain the read-only inspection boundary and grow explicit strict failure states for binary, skill, index, daemon, and config readiness.
- `ensure_ready.sh` should remain the mutating bootstrap boundary for install/init/index and may optionally fail on missing config requirements, but should not silently author downstream config.
- A sibling repo like Barter needs both the local `mcp-cocoindex-code` skill payload and repo-specific `cocoindex_code` MCP wiring in the config files it actually uses; advisor-side CocoIndex heuristics alone are not enough.

---

## 3. EXECUTIVE OVERVIEW

### Executive Summary

CocoIndex Code is a Python-based MCP server that provides semantic code search through vector embeddings stored in SQLite. It fills a genuine capability gap in the OpenCode ecosystem — currently, code exploration is limited to pattern matching (Grep/Glob) with no way to search by intent or concept.

The integration is straightforward: install via `pipx`, add 4-line config entries to `.mcp.json` and `opencode.json`, and the `search` tool becomes available to all CLI agents. The smart integration goes further by enhancing the @context agent with a conditional "Layer 2b" semantic search step that activates when fuzzy/conceptual queries are detected — avoiding token waste on queries where Grep suffices.

Key risks are manageable: alpha dependency (pin version), token budget (limit results to 3), and Python dependency (isolated via pipx). The project is very actively maintained but young. Recommend opt-in activation (`disabled: true` by default) with a 4-phase rollout from basic config to full agent integration.

### Architecture Diagram

```
                     OpenCode MCP Ecosystem (Post-Integration)
                     ==========================================

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  Claude Code  │  │   Copilot    │  │  Gemini CLI  │  │  Codex CLI   │
  │  (.mcp.json)  │  │(opencode.json│  │(.agents/     │  │(.codex/      │
  └──────┬───────┘  └──────┬───────┘  │settings.json)│  │config)       │
         │                  │          └──────┬───────┘  └──────┬───────┘
         └──────────┬───────┴─────────────────┴────────────────┘
                    │              MCP Protocol (stdio)
         ┌──────────┼──────────────────────────────────┐
         │          │                                   │
    ┌────▼────┐ ┌───▼──────────┐ ┌──────────┐ ┌───────▼────────┐
    │Sequential│ │  Spec Kit    │ │Code Mode │ │ CocoIndex Code │
    │Thinking │ │  Memory      │ │(UTCP)    │ │ (NEW)          │
    │[Node.js]│ │  [Node.js]   │ │[Node.js] │ │ [Python/Rust]  │
    └─────────┘ └──────────────┘ └──────────┘ └────────────────┘
    Multi-step   Decision/context  External     Semantic code
    reasoning    memory + search   tool bridge  search + index

    Complementary Domains:
    ├─ "How should I think about X?" → Sequential Thinking
    ├─ "What did we decide about X?" → Spec Kit Memory
    ├─ "Can you do X in ClickUp?"    → Code Mode
    └─ "Where is the code that does X?" → CocoIndex Code (NEW)
```

### Quick Reference Guide

**When to use CocoIndex:**
- Natural language code queries ("find auth middleware", "where is error handling?")
- Fuzzy/conceptual search when you don't know exact function names
- Code chunk retrieval (relevant snippets instead of whole files)
- Language-filtered search across large codebases

**When NOT to use CocoIndex:**
- Exact text pattern matching (use Grep — faster, more precise)
- File discovery by name/path (use Glob)
- Reading specific known files (use Read)
- Decision/context memory retrieval (use Spec Kit Memory)

**Key considerations:**
- Token budget: default `limit=3` to avoid context window bloat
- Index freshness: `refresh_index=true` (default) adds ~1s latency per query
- Startup: first query after boot takes 3-8s (daemon startup + model load)
- Storage: ~50-200 MB per project for the index

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Source Code | CocoIndex Code repository | [GitHub](https://github.com/cocoindex-io/cocoindex-code) | High |
| Source Code | server.py (MCP implementation) | GitHub raw | High |
| Source Code | indexer.py (chunking pipeline) | GitHub raw | High |
| Source Code | query.py (search execution) | GitHub raw | High |
| Config | pyproject.toml (dependencies) | GitHub raw | High |
| Documentation | README.md | GitHub | High |
| Documentation | CocoIndex parent project | [cocoindex.io](https://cocoindex.io) | Medium |
| Issues | GitHub issue tracker | GitHub issues | High |
| Codebase | OpenCode MCP configs | `.mcp.json`, `opencode.json` | High |
| Codebase | @context agent definition | `.claude/agents/context.md` | High |

---

## 4. CORE ARCHITECTURE

### System Components

#### Component 1: CocoIndex Code MCP Server (FastMCP)
**Purpose**: Exposes semantic code search as an MCP tool over stdio transport

**Responsibilities**:
- Accept `search` tool calls from MCP clients
- Delegate to daemon for query execution
- Return structured results with file paths, code chunks, line numbers, scores

**Dependencies**:
- `mcp[cli]` (FastMCP library for Python)
- Background daemon process (Unix domain socket IPC)

**Key APIs/Interfaces**:
```python
@mcp.tool(name="search")
async def search(
    query: str,
    limit: int = 5,
    offset: int = 0,
    refresh_index: bool = True,
    languages: list[str] | None = None,
    paths: list[str] | None = None
) -> SearchResultModel
```

---

#### Component 2: Background Daemon
**Purpose**: Manages code indexes, handles concurrent queries, persists across sessions

**Responsibilities**:
- Project registry (multi-project support)
- Index lifecycle (create, update, refresh)
- Query execution (vector search via sqlite-vec)
- IPC via Unix domain socket (`~/.cocoindex_code/daemon.sock`)

**Dependencies**:
- `cocoindex==1.0.0a33` (Rust engine via Python bindings)
- `sqlite-vec` extension
- `msgspec` (msgpack serialization)

---

#### Component 3: Indexer (Rust-powered)
**Purpose**: Splits code into chunks, generates embeddings, stores in SQLite

**Responsibilities**:
- File discovery (respects .gitignore, configurable patterns)
- Language detection (28+ languages)
- Text chunking (RecursiveSplitter: 1000-char chunks, 150-char overlap)
- Embedding generation (default: all-MiniLM-L6-v2, 384 dimensions)
- SQLite storage with vec0 virtual table

---

### Data Flow

```
CLI/Agent Query ("find authentication middleware")
       │
       ▼ (stdio JSON-RPC)
  MCP Server (server.py)
       │
       ▼ (msgpack over Unix socket)
  Daemon (daemon.py)
       │
       ├─ refresh_index=true? → Indexer re-scans changed files
       │
       ▼
  Query Engine (query.py)
       │
       ├─ Embed query string → 384-dim vector
       ├─ KNN search in vec0 table (L2 distance)
       └─ Convert to cosine similarity: score = 1.0 - distance²/2.0
       │
       ▼
  Return: [{file_path, language, content, start_line, end_line, score}]
```

### Integration Points

**External Systems**:
- **MCP Clients**: Any CLI supporting MCP (Claude Code, Copilot, Gemini, Codex)
- **File System**: Reads source code files for indexing, writes index to `.cocoindex_code/`

**Internal Modules (OpenCode)**:
- **@context agent**: Layer 2b semantic search step (proposed Phase 2)
- **@research agent**: Semantic code queries during investigation (proposed Phase 3)
- **Spec Kit Memory**: Potential memory enrichment with code references (proposed Phase 4)

### Dependencies

| Dependency | Version | Purpose | Critical? | Alternative |
|------------|---------|---------|-----------|-------------|
| cocoindex | 1.0.0a33 | Rust indexing engine | Yes | None (core) |
| mcp[cli] | >=1.8.0 | FastMCP server framework | Yes | stdio manual impl |
| sentence-transformers | >=3.0 | Local embedding model | Yes | LiteLLM (cloud) |
| sqlite-vec | >=0.1.6 | Vector search in SQLite | Yes | None |
| msgspec | >=0.19 | Binary IPC serialization | Yes | msgpack |
| typer | >=0.15 | CLI framework | No | Click, argparse |
| Python | >=3.11 | Runtime | Yes | None |

---

## 5. TECHNICAL SPECIFICATIONS

### API Documentation

#### Tool: `search`

**Purpose**: Semantic code search across the indexed codebase

**Signature**:
```python
async def search(
    query: str,
    limit: int = 5,
    offset: int = 0,
    refresh_index: bool = True,
    languages: list[str] | None = None,
    paths: list[str] | None = None
) -> SearchResultModel
```

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| query | str | Yes | — | Natural language query or code snippet |
| limit | int | No | 5 | Number of results (1-100) |
| offset | int | No | 0 | Pagination offset for large result sets |
| refresh_index | bool | No | True | Incrementally update index before search |
| languages | list[str] | No | None | Filter by programming language(s) |
| paths | list[str] | No | None | Filter by glob file path patterns |

**Returns**:
```python
class SearchResultModel:
    success: bool
    results: list[SearchResult]
    total_returned: int
    offset: int
    message: str | None  # Error message on failure

class SearchResult:
    file_path: str      # Relative path from project root
    language: str       # Detected programming language
    content: str        # Code chunk text (~1000 chars)
    start_line: int     # Start line number in file
    end_line: int       # End line number in file
    score: float        # Similarity score (0.0-1.0)
```

**Example Usage**:
```json
{
  "tool": "search",
  "arguments": {
    "query": "authentication middleware handling JWT tokens",
    "limit": 3,
    "languages": ["typescript", "javascript"],
    "paths": ["src/**"]
  }
}
```

---

### Search Execution Strategies

| Strategy | Condition | Method | Performance |
|----------|-----------|--------|-------------|
| KNN Index | Single language or no filter | vec0 virtual table ANN | O(log n) |
| Full Scan | Path glob filters active | Brute-force L2 distance | O(n) |
| Multi-language Merge | Multiple language filters | Per-language KNN, merge-sort | O(k * log n) |

### Embedding Model Specifications

| Model | Dimensions | Size | Device Support | API Key |
|-------|-----------|------|----------------|---------|
| all-MiniLM-L6-v2 (default) | 384 | ~80 MB | CPU, MPS, CUDA | No |
| LiteLLM providers (optional) | Varies | Cloud | N/A | Yes |

---

## 6. CONSTRAINTS & LIMITATIONS

### Platform Limitations
- **macOS system Python**: `/usr/bin/python3` (3.9.6) lacks SQLite extension support. Must use Homebrew Python 3.11+.
- **Windows daemon**: Console window visible during daemon operation. Known issues with Codex CLI timeouts.
- **No hybrid search**: Vector-only retrieval. Exact keyword matches may be missed. Issue #44 tracks this.

### Performance Boundaries
- **Index size**: ~250-600 MB per project (mostly `target_sqlite.db`; scales with total source bytes more than file count) [CORRECTED by GPT-5.4 Agent 1]
- **Initial indexing**: 5-15 minutes for ~23K files (CPU), 1-5 minutes with MPS/GPU
- **Incremental update**: <5 seconds for small changes
- **Search latency**: <500ms per query (warm daemon)
- **Cold start**: **20-30 seconds** (daemon startup + embedding model load + initial index) [CORRECTED by GPT-5.4 Agent 1 — test suites use 20-30s timeouts]
- **Warm start**: <1 second (daemon already running, client connects to socket)
- **Chunk size**: Fixed 1000 characters with 150-char overlap — not configurable at query time
- **Storage**: Two SQLite databases per project: `target_sqlite.db` (chunks + vectors) and `cocoindex.db` (incremental indexing state)

### Security Restrictions
- **Local storage only**: Index stored in `.cocoindex_code/` within project directory
- **No network exposure**: Daemon uses Unix domain socket, not TCP
- **Source code in SQLite**: Full code chunks are stored in the database — must `.gitignore` the index directory

### Rate Limiting
- No explicit rate limiting (local tool)
- Daemon handles concurrent queries via asyncio event loop
- `refresh_index` on every query adds ~1s latency; disable for rapid successive queries

---

## 7. INTEGRATION PATTERNS

### Pattern 1: Direct MCP Server Registration (Phase 1)

**Purpose**: Add CocoIndex as 4th MCP server available to all CLI agents

**`.mcp.json` (Claude Code)**:
```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public"
      },
      "disabled": true
    }
  }
}
```

**`opencode.json` (Copilot/OpenCode)**:
```json
{
  "mcp": {
    "cocoindex_code": {
      "type": "local",
      "command": ["ccc", "mcp"],
      "environment": {
        "COCOINDEX_CODE_ROOT_PATH": ".",
        "_NOTE_1": "Requires: pipx install cocoindex-code (Python 3.11+)",
        "_NOTE_2": "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)",
        "_NOTE_3": "Index stored in .cocoindex_code/ (add to .gitignore)"
      }
    }
  }
}
```

**Error Handling**: If `ccc` not on PATH, use full path: `~/.local/bin/ccc` (pipx default)

**PATH Collision Warning**: An existing `/opt/homebrew/bin/ccc` (unrelated Node.js package) may shadow CocoIndex's `ccc`. Use `pipx ensurepath` to ensure `~/.local/bin` precedes `/opt/homebrew/bin`, or use the full path in MCP config: `"command": "/Users/michelkerkmeester/.local/bin/ccc"`

### Pattern 2: @context Agent Layer 2b Enhancement (Phase 2)

**Purpose**: Add conditional semantic search to the @context agent workflow

```markdown
## Enhanced @context Agent Workflow

Layer 1: Memory Check (UNCHANGED)
  ├─ memory_match_triggers()
  └─ memory_context()

Layer 2: Codebase Scan (UNCHANGED)
  ├─ Glob (5-10 patterns)
  ├─ Grep (3-5 patterns)
  └─ Read (5-8 key files)

Layer 2b: Semantic Code Search (NEW — CONDITIONAL)
  ├─ TRIGGER: Query is conceptual/fuzzy OR Layer 2 results insufficient
  ├─ Tool: cocoindex_code.search(query, limit=3, languages=[...])
  └─ OUTPUT: Relevant code chunks with file paths and line numbers

Layer 3: Deep Memory Search (UNCHANGED)
  └─ memory_search(includeContent: true)
```

**Conditional Logic**: Layer 2b activates when:
- Query contains conceptual terms ("find the auth logic", "where is error handling")
- Grep returns 0 results or >50 results (too narrow or too broad)
- User explicitly requests semantic search

### Pattern 3: Skill Structure (Phase 2+)

**Purpose**: Create proper OpenCode skill wrapper for CocoIndex

```
.opencode/skill/mcp-cocoindex-code/
├── SKILL.md                     # 8-section documentation
├── README.md                    # Quick reference
├── references/
│   ├── smart-routing.md         # Skill advisor integration
│   └── agent-integration.md     # @context/@research agent prompts
├── assets/
│   ├── setup.sh                 # Automated installation script
│   └── config-templates.md      # MCP config examples per CLI
└── package.json                 # Metadata (no Node.js code)
```

---

## 8. IMPLEMENTATION GUIDE

### Installation

```bash
# Step 1: Install CocoIndex Code (isolated Python environment)
pipx install cocoindex-code

# Step 2: Initialize project index
cd /path/to/project
ccc init

# Step 3: Build initial index
ccc index

# Step 4: Verify search works
ccc search "authentication middleware"

# Step 5: Test MCP server mode
ccc mcp  # Starts stdio MCP server
```

### Configuration

**Global Settings** (`~/.cocoindex_code/global_settings.yml`):
```yaml
embedding:
  provider: sentence-transformers
  model: sentence-transformers/all-MiniLM-L6-v2
  device: mps  # Apple Silicon acceleration
```

**Project Settings** (`.cocoindex_code/settings.yml`):
```yaml
include_patterns:
  - "**/*.ts"
  - "**/*.js"
  - "**/*.py"
  - "**/*.md"
  - "**/*.sh"
exclude_patterns:
  - "**/.*"
  - "**/node_modules"
  - "**/dist"
  - "**/build"
  - "**/.cocoindex_code"
```

**`.gitignore` Addition**:
```
.cocoindex_code/
```

### OpenCode Agent Prompt Integration

For @context agent, add to Layer 2b section:
```
When the user's query is conceptual or fuzzy (not an exact pattern):
1. Use cocoindex_code.search(query="{user_query}", limit=3)
2. Review returned code chunks for relevance
3. Use file_path and start_line to Read the full context if needed
4. Combine with Grep/Glob results for comprehensive answer
```

---

## 9. CODE EXAMPLES & SNIPPETS

### Basic MCP Search Call

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search",
    "arguments": {
      "query": "MCP server initialization and tool registration",
      "limit": 3,
      "languages": ["typescript"]
    }
  }
}
```

### Expected Response

```json
{
  "success": true,
  "results": [
    {
      "file_path": ".opencode/skill/system-spec-kit/mcp_server/src/context-server.ts",
      "language": "typescript",
      "content": "// MCP server setup\nconst server = new Server({\n  name: 'spec-kit-memory',\n  version: '2.2.26.0'\n});\n\nserver.setRequestHandler(ListToolsRequestSchema, async () => ({\n  tools: [...memoryTools, ...searchTools]\n}));",
      "start_line": 15,
      "end_line": 42,
      "score": 0.87
    }
  ],
  "total_returned": 1,
  "offset": 0,
  "message": null
}
```

### Filtered Search (Path + Language)

```json
{
  "query": "database migration and schema changes",
  "limit": 5,
  "languages": ["typescript", "sql"],
  "paths": [".opencode/skill/system-spec-kit/**"]
}
```

### Edge Case: Empty Results

When no matching code is found, fall back to Grep:
```
1. cocoindex_code.search("payment processing") → 0 results
2. Grep("payment|billing|charge") → find exact text matches
3. Report: "No semantic matches found; text search found N references"
```

---

## 10. TESTING & DEBUGGING

### Test Strategy

**Phase 1 Validation**:
1. Install CocoIndex Code via pipx
2. Run `ccc init` and `ccc index` on OpenCode project
3. Test CLI search: `ccc search "MCP server initialization"`
4. Test MCP mode: start `ccc mcp`, send search JSON-RPC
5. Verify results include correct file paths and line numbers

**Integration Testing**:
1. Add config entries to `.mcp.json` and `opencode.json`
2. Start Claude Code / Copilot with CocoIndex enabled
3. Ask agent: "Find the code that handles memory search"
4. Verify agent receives and uses CocoIndex search results
5. Compare quality with Grep-only results

**Performance Benchmarks**:
| Test | Target | Method |
|------|--------|--------|
| Initial indexing time | <15 min | `time ccc index` |
| Search latency (warm) | <500ms | Multiple search calls |
| Search latency (cold) | <10s | Kill daemon, then search |
| Index size | <200 MB | `du -sh .cocoindex_code/` |
| RAM usage | <700 MB | `ps aux | grep ccc` during search |

### Debugging

**Common Issues**:
1. **`ccc: command not found`**: pipx install path not in PATH. Fix: `export PATH="$HOME/.local/bin:$PATH"`
2. **SQLite extension error**: Using system Python. Fix: use Homebrew Python 3.11+
3. **Daemon socket stale**: `rm ~/.cocoindex_code/daemon.sock` and retry
4. **Empty search results**: Index not built. Run `ccc index` first.

---

## 11. PERFORMANCE OPTIMIZATION

### Token Budget Management

**Problem**: Default `limit=5` returns up to 5,000 characters (~1,250 tokens) per search.

**Solution**: Configure agents to use `limit=3` and apply language/path filters:
```json
{
  "query": "authentication middleware",
  "limit": 3,
  "languages": ["typescript"],
  "paths": ["src/**", ".opencode/**"]
}
```

**Impact**: Reduces token consumption by ~40% while maintaining relevance.

### Indexing Performance

| Optimization | Technique | Impact |
|-------------|-----------|--------|
| Use MPS device | `device: mps` in global_settings.yml | 3-5x faster indexing |
| Narrow include patterns | Only index relevant file types | Fewer chunks to embed |
| Disable refresh_index | `refresh_index: false` for rapid queries | Skip re-scan overhead |
| Daemon warm-up | Start daemon at session begin | Avoid cold-start penalty |

### Caching Strategies

- **Daemon persistence**: Index stays in memory across queries (no cold load)
- **Incremental indexing**: Only changed files re-indexed (memoized via `@coco.fn(memo=True)`)
- **Query caching**: Not implemented (potential Phase 4 enhancement)

---

## 12. SECURITY CONSIDERATIONS

### Data Protection

- **Code chunks stored in SQLite**: Full source code text is stored in `.cocoindex_code/target_sqlite.db`
- **Mitigation**: Add `.cocoindex_code/` to `.gitignore` to prevent accidental commit
- **No network exposure**: Daemon uses Unix domain socket only; no TCP/HTTP listener
- **Embedding model**: Local by default (no API calls, no code sent to cloud)

### Validation

- **File path validation**: CocoIndex respects `.gitignore` patterns
- **No arbitrary code execution**: Search is read-only; no write/execute capabilities
- **Daemon permissions**: Runs as user process, inherits user file permissions

### Supply Chain

- **Alpha dependency**: `cocoindex==1.0.0a33` is pre-release. Pin version in installation docs.
- **Apache 2.0 license**: Permissive, commercial-friendly. No copyleft concerns.
- **Python package**: Published on PyPI, standard supply chain risk profile.

---

## 13. FUTURE-PROOFING & MAINTENANCE

### Upgrade Paths

| From | To | Steps | Breaking Changes |
|------|-----|-------|-----------------|
| Phase 1 (config only) | Phase 2 (agent integration) | Update agent .md files | None |
| Phase 2 | Phase 3 (@research) | Add search calls to research workflow | None |
| Phase 3 | Phase 4 (memory enrichment) | Build bridge between CocoIndex and Spec Kit Memory | Custom code needed |
| cocoindex alpha | cocoindex stable | `pipx upgrade cocoindex-code` | Possible API changes |

### Compatibility Matrix

| CocoIndex Version | OpenCode Compatibility | Notes |
|-------------------|----------------------|-------|
| Current (alpha) | Compatible | Pin version |
| Future stable | Expected compatible | Test before upgrade |

### Decision Trees

```
Should I use CocoIndex or Grep for this query?
├─ Is the query an exact text pattern? → Use Grep
│   └─ Because: Grep is faster and more precise for exact matches
├─ Is the query conceptual/fuzzy? → Use CocoIndex
│   └─ Because: Vector search finds semantic matches
└─ Are Grep results too broad (>50 hits)? → Use CocoIndex
    └─ Because: Semantic ranking surfaces most relevant code
```

---

## 14. API REFERENCE

### MCP Tool: `search`

| Attribute | Type | Default | Required | Description | Example |
|-----------|------|---------|----------|-------------|---------|
| query | str | — | Yes | Natural language or code snippet | "JWT token validation" |
| limit | int | 5 | No | Max results (1-100) | 3 |
| offset | int | 0 | No | Pagination offset | 0 |
| refresh_index | bool | true | No | Update index before search | false |
| languages | list[str] | null | No | Language filter | ["typescript"] |
| paths | list[str] | null | No | Path glob filter | ["src/**"] |

### CLI Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `ccc init` | Initialize project index directory | `ccc init` |
| `ccc index` | Build/rebuild code index | `ccc index` |
| `ccc search` | CLI code search | `ccc search "auth middleware"` |
| `ccc mcp` | Start MCP server (stdio) | `ccc mcp` |
| `ccc config` | View/edit configuration | `ccc config show` |

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| COCOINDEX_CODE_ROOT_PATH | Project root override | Auto-detected |
| COCOINDEX_CODE_EMBEDDING_MODEL | Embedding model | sbert/all-MiniLM-L6-v2 |
| COCOINDEX_CODE_DEVICE | Compute device | Auto (CPU/MPS/CUDA) |
| COCOINDEX_CODE_EXCLUDED_PATTERNS | Additional exclusions | Respects .gitignore |
| COCOINDEX_CODE_EXTRA_EXTENSIONS | Additional file types | None |

---

## 15. TROUBLESHOOTING GUIDE

### Common Issues

#### Issue 1: `ccc: command not found`
**Symptoms**: MCP server fails to start, CLI not recognized
**Causes**: pipx install path not in shell PATH
**Solution**: Add `export PATH="$HOME/.local/bin:$PATH"` to `.zshrc` / `.bashrc`
**Prevention**: Document PATH requirement in setup guide

#### Issue 2: SQLite Extension Load Failure
**Symptoms**: `RuntimeError: cannot load sqlite-vec extension`
**Causes**: macOS system Python (3.9.6) blocks SQLite extensions
**Solution**: Use Homebrew Python: `pipx install --python /opt/homebrew/bin/python3.12 cocoindex-code`
**Prevention**: Installation guide specifies Homebrew Python requirement

#### Issue 3: Stale Daemon Socket
**Symptoms**: Connection refused, search hangs
**Causes**: Daemon crashed without cleanup
**Solution**: `rm ~/.cocoindex_code/daemon.sock && ccc search "test"`
**Prevention**: Daemon implements signal handlers for cleanup

#### Issue 4: Empty Search Results
**Symptoms**: `search` returns 0 results for valid queries
**Causes**: Index not built, or files excluded by patterns
**Solution**: Run `ccc index` and check `.cocoindex_code/settings.yml` include patterns
**Prevention**: Phase 1 testing validates index completeness

---

## 16. ACKNOWLEDGEMENTS

### Research Contributors
- **Claude Opus 4.6**: Primary orchestrator + 3 sub-agent parallel investigation
  - Sub-agent 1 (Codebase Explorer): OpenCode architecture analysis
  - Sub-agent 2 (External Researcher): CocoIndex Code source code deep dive
  - Sub-agent 3 (Technical Analyzer): Feasibility assessment + GO/NO-GO recommendation
- **GPT-5.4 via Copilot CLI**: 3 complementary research agents
  - Agent 1 (Practical Testing): macOS installation validation, PATH collision discovery, cold start measurement
  - Agent 2 (Competitive Analysis): 8-tool competitive landscape, alternative MCP servers comparison
  - Agent 3 (Integration Design): Exact config snippets, Layer 2b routing logic, setup.sh script

### Resources & References
- [CocoIndex Code GitHub](https://github.com/cocoindex-io/cocoindex-code): Primary source
- [CocoIndex Parent Project](https://cocoindex.io): Framework documentation
- OpenCode `.mcp.json` and `opencode.json`: Integration patterns
- OpenCode `@context` agent definition: Current exploration workflow

### External Tools & Libraries
- CocoIndex Code: v0.x (alpha), Apache 2.0
- FastMCP: MCP server framework for Python
- sentence-transformers: Local embedding generation
- sqlite-vec: Vector search extension for SQLite

---

## APPENDIX

### Glossary
- **MCP**: Model Context Protocol — standard for AI tool integration via stdio/SSE
- **FastMCP**: Python library for building MCP servers
- **sqlite-vec**: SQLite extension adding vector similarity search (vec0 virtual table)
- **RecursiveSplitter**: Text chunking algorithm that splits on character boundaries with overlap
- **Daemon**: Background process that persists indexes and handles queries
- **pipx**: Python tool for installing and running applications in isolated environments
- **ANN**: Approximate Nearest Neighbor — fast vector similarity search

### Competitive Analysis (GPT-5.4 Agent 2)

Only a few options are true MCP-native semantic code search servers. Many popular names are MCP clients, review tools, or non-MCP products.

| Tool | Type | Stars | MCP Tools | Indexing | Best For |
|------|------|-------|-----------|----------|----------|
| **CocoIndex Code** | MCP server (Python) | 927 | `search` | Text chunking + embeddings + sqlite-vec | Self-hosted multi-CLI default |
| **Sourcegraph MCP** | MCP server (Enterprise) | 10.3K+ | `keyword_search`, `nls_search`, `go_to_definition`, `find_references`, `diff_search` + more | SCIP/Zoekt code intel graph | Enterprise orgs on Sourcegraph |
| **DeepContext MCP** | MCP server (TS) | 271 | `index_codebase`, `search_codebase`, `get_indexing_status`, `clear_index` | tree-sitter + BM25 + reranker | Hosted agent workflows (TS/Python) |
| **codebase-rag** | MCP server (Python) | 7 | `search_codebase`, `reindex_project`, `list_indexed_projects` | tree-sitter + ChromaDB + MiniLM | Budget local setup |
| **Bloop** | Search engine | 9.5K | None (archived) | Qdrant + Tantivy + tree-sitter | N/A (discontinued) |
| **Aider** | AI coding tool | 42K | None (community bridge only) | N/A | Task delegation, not search |
| **Continue.dev** | MCP client/framework | 31.9K | N/A (builds servers, not provides) | N/A | Building custom RAG MCP servers |
| **Greptile** | MCP server (SaaS) | N/A | PR review + context tools | Proprietary | Code review, not search |

**Verdict**: CocoIndex is the strongest OSS MCP-native default for multi-CLI. Choose Sourcegraph for enterprise code intel, DeepContext for hosted TS/Python workflows.

### Comparison: CocoIndex vs Spec Kit Memory

| Aspect | CocoIndex Code | Spec Kit Memory |
|--------|---------------|----------------|
| Domain | Source code files | Project decisions/context |
| Content | Code chunks (1000 chars) | Markdown memories |
| Embeddings | 384-dim MiniLM-L6-v2 | 1024-dim Voyage/OpenAI/HF |
| Search | Vector only (single-stage) | 4-stage hybrid (Vector+BM25+FTS5+RRF) |
| Storage | SQLite + sqlite-vec | SQLite + FTS5 + embeddings |
| Updates | Auto on file change | Manual save/index |
| Question answered | "Where is the code?" | "What did we decide?" |

### Phased Implementation Roadmap

| Phase | Scope | Effort | Dependencies |
|-------|-------|--------|-------------|
| **Phase 1** | Install + MCP config entries + .gitignore + basic test | 30 min | pipx, Python 3.11+ |
| **Phase 2** | Create skill folder + update @context agent with Layer 2b | 2-4 hours | Phase 1 validated |
| **Phase 3** | Integrate into @research agent workflow | 1-2 hours | Phase 2 |
| **Phase 4** | Explore Spec Kit Memory enrichment synergy | 4-8 hours | Phase 2-3 |

### Layer 2b Routing Logic (GPT-5.4 Agent 3)

The @context agent should use this conditional routing to decide Grep vs CocoIndex:

```
if exact_token or known_path or error_string or stack_trace:
  Glob -> Grep -> Read                          # Skip CocoIndex (exact match is better)
elif conceptual_query or unknown_names:
  Glob -> search(paths=glob_hits) -> Grep -> Read  # CocoIndex first for semantic match
else:
  Glob -> Grep
  if grep_hits <= 2:                             # Grep found too few results
    search(paths=glob_hits) -> Grep -> Read      # Escalate to CocoIndex
  else:
    Read                                         # Grep was sufficient
```

**Use CocoIndex when**: user asks by concept/behavior, unknown file/function names, "where does X happen?", first Grep pass returns 0-2 weak hits, exploring unfamiliar architecture.

**Skip CocoIndex when**: exact identifier/error text/env var/flag/path/regex/stack trace is known, counting literal usages, precise rename prep, grepable token already exists.

### setup.sh Draft (GPT-5.4 Agent 3)

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

command -v python3 >/dev/null || { echo "python3 required"; exit 1; }
command -v pipx >/dev/null || { echo "pipx required"; exit 1; }

pipx install cocoindex-code >/dev/null 2>&1 || pipx upgrade cocoindex-code
command -v ccc >/dev/null || { echo "ccc not on PATH; run: pipx ensurepath"; exit 1; }

grep -qxF '.cocoindex_code/' "$ROOT/.gitignore" || \
  printf '\n# CocoIndex semantic index\n.cocoindex_code/\n' >> "$ROOT/.gitignore"

python3 - "$ROOT" <<'PY'
import json, pathlib, sys
root = pathlib.Path(sys.argv[1])
mcp_path = root / ".mcp.json"
mcp = json.loads(mcp_path.read_text())
mcp.setdefault("mcpServers", {})["cocoindex_code"] = {
    "command": "ccc", "args": ["mcp"], "disabled": False,
}
mcp_path.write_text(json.dumps(mcp, indent=2) + "\n")
oc_path = root / "opencode.json"
oc = json.loads(oc_path.read_text())
oc.setdefault("mcp", {})["cocoindex_code"] = {
    "type": "local", "command": ["ccc", "mcp"],
}
oc_path.write_text(json.dumps(oc, indent=2) + "\n")
PY

(cd "$ROOT" && ccc init >/dev/null 2>&1 || true && ccc index)
echo "CocoIndex Code MCP installed and indexed."
```

### Risk Matrix Summary

| Risk | Likelihood | Impact | Score | Status |
|------|-----------|--------|-------|--------|
| Python version mismatch | Low | High | Medium | Mitigated (Homebrew python3.11) |
| Token budget bloat | Medium | High | **High** | Mitigated (limit=3) |
| Alpha dependency instability | Medium | Medium | Medium | Mitigated (pin version) |
| **PATH collision with existing `ccc`** | **High** | **High** | **High** | Mitigated (full path in config) |
| **Cold start 20-30s** | High | Medium | **High** | Mitigated (persistent daemon) |
| Disk usage 250-600 MB | Medium | Low | Low | Acceptable |
| Daemon resource leak | Low | Medium | Low | Acceptable |
| Stale index results | Low | Medium | Low | Mitigated (auto-refresh) |

---

## CHANGELOG & UPDATES

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-03-18 | 1.0.0 | Initial research completed — 3 Opus sub-agents parallel investigation | Claude Opus 4.6 |
| 2026-03-18 | 1.1.0 | Enhanced with 3 GPT-5.4 agents: practical testing, competitive analysis, integration design | Claude Opus 4.6 + GPT-5.4 |

### Recent Updates
- 2026-03-18: v1.1.0 — Incorporated GPT-5.4 findings: PATH collision warning, cold start correction (20-30s not 3-8s), disk estimate correction (250-600 MB), competitive analysis of 8 alternatives, Layer 2b routing logic, setup.sh script
- 2026-03-18: v1.0.0 — Initial research completed with comprehensive 17-section documentation
