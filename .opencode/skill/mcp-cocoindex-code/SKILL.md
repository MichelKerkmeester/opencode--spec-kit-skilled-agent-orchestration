---
name: mcp-cocoindex-code
description: "Semantic code search via vector embeddings. CocoIndex Code indexes the codebase into 105K+ chunks across 14 languages, enabling natural language queries to find relevant code, patterns, and implementations. CLI for direct use; MCP for AI agent integration."
allowed-tools: [Bash, Read, Grep, Glob]
version: 1.0.0
---

<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, all-MiniLM-L6-v2 -->

# CocoIndex Code - Semantic Code Search via Vector Embeddings

Natural language code search through two complementary approaches: CLI (ccc) for speed and one-off queries, MCP server for AI agent integration via stdio transport.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- User asks to "find code that does X" or "search for implementations of Y"
- User needs to discover code by concept or intent rather than exact text
- User wants to find similar code patterns across the codebase
- Grep/Glob exact matching is insufficient and fuzzy or semantic matching is needed
- User mentions "semantic search", "code search", "find similar code"
- User needs to locate logic handling a specific concern (e.g., "where is the retry logic")
- User wants to understand how a concept is implemented across multiple files

**Automatic Triggers**:
- "semantic search", "find code that", "search for implementations"
- "similar code", "code that handles", "where is the logic for"
- "cocoindex", "ccc", "vector search"
- "find similar", "code search", "search codebase"

### When NOT to Use

**Do not use for**:
- Exact text or regex search (use Grep instead)
- File name or path search (use Glob instead)
- Reading known files (use Read instead)
- The codebase has not been indexed yet (run `ccc index` first)
- Simple string matching where the exact token is known
- Non-code files (semantic search is optimized for source code)

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                                   |
| ----------- | ------------------------ | ------------------------------------------- |
| ALWAYS      | Every skill invocation   | references/tool_reference.md                |
| CONDITIONAL | If intent signals match  | references/search_patterns.md               |
| ON_DEMAND   | Only on explicit request | Full troubleshooting and configuration docs |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool_reference.md"

INTENT_SIGNALS = {
    "SEARCH": {"weight": 4, "keywords": ["search", "find", "where", "similar", "semantic", "code that"]},
    "INDEX": {"weight": 4, "keywords": ["index", "reindex", "update index", "build index", "refresh"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "configure", "ccc not found"]},
    "STATUS": {"weight": 3, "keywords": ["status", "stats", "how many files", "indexed"]},
    "TROUBLESHOOT": {"weight": 3, "keywords": ["error", "failed", "not working", "empty results"]},
}

RESOURCE_MAP = {
    "SEARCH": ["references/search_patterns.md", "references/tool_reference.md"],
    "INDEX": ["references/tool_reference.md"],
    "INSTALL": ["references/tool_reference.md"],
    "STATUS": ["references/tool_reference.md"],
    "TROUBLESHOOT": ["references/tool_reference.md", "references/search_patterns.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "all commands", "configuration guide"],
    "ON_DEMAND": ["references/tool_reference.md", "references/search_patterns.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and capability signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    if getattr(task, "index_missing", False):
        scores["INDEX"] += 5
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SEARCH"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_cocoindex_code_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Two Approaches

CocoIndex Code provides two access patterns for semantic code search:

1. **CLI (ccc)** - Direct terminal usage, fastest for one-off searches
2. **MCP server** - AI agent integration via `ccc mcp` (stdio mode)

### CLI Approach (Primary) - CocoIndex Code CLI

#### Semantic Search

```bash
# Basic semantic search
ccc search "error handling middleware" --limit 5

# Filter by language
ccc search "database connection" --lang typescript

# Filter by path
ccc search "authentication" --path "src/**"

# Combine filters
ccc search "retry logic" --lang python --path "lib/**" --limit 10
```

#### Index Management

```bash
# Check index status
ccc status

# Build or update the index
ccc index

# Force rebuild from scratch
ccc index --refresh

# Reset project databases (destructive)
ccc reset
```

#### Binary Location

```text
.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc
```

Add to PATH or use the full path for invocation.

### MCP Approach - AI Agent Integration

The MCP server exposes tools via `ccc mcp` running in stdio mode.

**MCP Tools:**

| Tool       | Purpose                           | Key Parameters                      |
| ---------- | --------------------------------- | ----------------------------------- |
| `search`   | Semantic search across codebase   | query, lang, path, limit, offset    |
| `status`   | Show project indexing status      | (none)                              |
| `index`    | Create or update the index        | (none)                              |
| `reset`    | Reset project databases           | (none - destructive)                |

### How Indexing Works

```text
STEP 1: File Scanning
       +-- Scans project files respecting .gitignore
       +-- Detects language from file extensions
       +-- Supports 14 languages (TypeScript, Python, Go, Rust, etc.)
       |
STEP 2: Chunk Splitting
       +-- Splits code into semantic chunks using language-aware splitters
       +-- Preserves function/class boundaries where possible
       +-- Produces 105K+ chunks for a typical large codebase
       |
STEP 3: Embedding Generation
       +-- Generates embeddings using all-MiniLM-L6-v2 (local model)
       +-- No API key required - runs entirely on-device
       +-- Each chunk mapped to a 384-dimensional vector
       |
STEP 4: Vector Storage
       +-- Stores vectors in SQLite via sqlite-vec extension
       +-- Indexes for fast approximate nearest neighbor search
       |
STEP 5: Search Execution
       +-- Query text embedded with the same model
       +-- Cosine similarity comparison against stored vectors
       +-- Results ranked by similarity score
       +-- Language and path filters applied post-ranking
```

### Search Result Interpretation

Each result includes:
- **File path** - Location of the matching code
- **Chunk content** - The code fragment that matched
- **Similarity score** - Cosine similarity (0.0 to 1.0, higher is better)
- **Language** - Detected programming language
- **Line range** - Start and end lines within the file

Scores above 0.5 typically indicate strong semantic relevance. Always verify results with the Read tool since semantic search can surface false positives.

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS check index status before searching**
   - Run `ccc status` before the first search in a session
   - Confirm files are indexed and the index is not stale

2. **ALWAYS use language filters when the target language is known**
   - `--lang typescript` narrows results and improves relevance
   - Reduces false positives from similar patterns in other languages

3. **ALWAYS use path filters to narrow scope**
   - `--path "src/**"` focuses on application code
   - Avoids noise from test files, vendor directories, or build output

4. **ALWAYS verify search results with the Read tool**
   - Semantic search can return false positives
   - Read the actual file to confirm the match before acting on it

5. **ALWAYS suggest reindexing if the codebase has changed significantly**
   - After major refactors, branch switches, or large merges
   - Run `ccc index --refresh` to rebuild from scratch

6. **ALWAYS use the full binary path if ccc is not on PATH**
   - `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc`

### NEVER

**NEVER do these:**

1. **NEVER assume semantic search is 100% accurate**
   - Vector similarity is approximate, not exact
   - Always cross-reference results with Grep for confirmation

2. **NEVER run `ccc reset` without user confirmation**
   - This destroys the entire index
   - Rebuilding requires a full reindex which takes time

3. **NEVER use semantic search for exact string matching**
   - Use Grep for known tokens, function names, or exact patterns
   - Semantic search is for conceptual or intent-based queries

4. **NEVER skip the index status check before first search**
   - An empty or missing index returns no results silently
   - Always verify with `ccc status` first

5. **NEVER ignore low similarity scores**
   - Results below 0.3 are likely noise
   - Focus on results above 0.5 for actionable matches

### ESCALATE IF

**Ask user when:**

1. **ESCALATE IF index is empty or missing**
   - Guide user through `ccc index` to build the initial index
   - Check if the binary is installed with `command -v ccc`

2. **ESCALATE IF search returns no results for reasonable queries**
   - Index may be stale - suggest `ccc index --refresh`
   - Query may need rephrasing with different terminology

3. **ESCALATE IF binary not found**
   - Run the install script: `bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh`
   - Verify Python 3.11+ is available

4. **ESCALATE IF index build fails**
   - Check Python version (requires 3.11+)
   - Check disk space for SQLite database
   - Review error output for missing dependencies

5. **ESCALATE IF results seem irrelevant despite high scores**
   - The embedding model may not capture domain-specific terminology well
   - Suggest combining semantic search with Grep for better coverage

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Essential CLI Commands

```bash
# Search
ccc search "query text"                    # Basic search
ccc search "query" --limit 10             # Limit results
ccc search "query" --lang typescript      # Filter by language
ccc search "query" --path "src/**"        # Filter by path

# Index management
ccc status                                 # Check index status
ccc index                                  # Build/update index
ccc index --refresh                        # Force full rebuild
ccc reset                                  # Reset databases (destructive)
```

### MCP Tool Summary

| Tool     | Description                    | Usage                              |
| -------- | ------------------------------ | ---------------------------------- |
| search   | Semantic search across code    | Primary tool for code discovery    |
| status   | Show indexing status           | Check before first search          |
| index    | Create or update index         | Run after major codebase changes   |
| reset    | Reset project databases        | Use only when index is corrupted   |

### Supported Languages

CocoIndex Code supports 14 languages with language-aware chunk splitting:

| Language   | Extension     | Language    | Extension  |
| ---------- | ------------- | ----------- | ---------- |
| TypeScript | .ts, .tsx     | Python      | .py        |
| JavaScript | .js, .jsx     | Go          | .go        |
| Rust       | .rs           | Java        | .java      |
| C          | .c, .h        | C++         | .cpp, .hpp |
| C#         | .cs           | Ruby        | .rb        |
| PHP        | .php          | Swift       | .swift     |
| Kotlin     | .kt           | Shell       | .sh        |

### Decision Tree: Which Search Tool?

```text
Need to find code?
  |
  +-- Know the exact text/token?
  |     YES --> Use Grep
  |
  +-- Know the file name?
  |     YES --> Use Glob
  |
  +-- Searching by concept/intent?
        YES --> Use ccc search
```
<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Semantic Search Completion Checklist

**Search workflow complete when:**

- Index status verified (`ccc status` shows files indexed)
- Search returns relevant results for the natural language query
- Results verified via Read tool match the semantic intent
- Language and path filters applied where appropriate
- False positives identified and filtered out
- User receives actionable file paths and code locations

### Quality Targets

- **Search relevance**: Top 3 results contain at least one true match
- **Response time**: Search returns results within 5 seconds
- **Filter accuracy**: Language/path filters narrow results to target scope
- **Verification rate**: All suggested matches confirmed via Read tool

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Complements Grep and Glob

Semantic search fills the gap between exact pattern matching and conceptual code discovery:

| Tool   | Best For                        | Limitation                          |
| ------ | ------------------------------- | ----------------------------------- |
| Grep   | Exact text, regex patterns      | Cannot find conceptual matches      |
| Glob   | File names, path patterns       | Cannot search file contents         |
| ccc    | Intent-based, conceptual search | Approximate - needs verification    |

**Combined workflow example:**
```bash
# Step 1: Semantic search to find candidate files
ccc search "rate limiting middleware" --lang typescript --limit 5

# Step 2: Grep to verify exact patterns in candidates
grep -rn "rateLimit" src/middleware/

# Step 3: Read to confirm implementation details
# Use Read tool on the matched files
```

### Related Skills

**mcp-code-mode**: For external tool integration via MCP
- CocoIndex Code handles code search; Code Mode handles external APIs

**system-spec-kit**: For context preservation
- Search results and decisions can be saved as memory for future sessions

### Tool Usage Guidelines

**Bash**: All ccc commands, index management, status checks
**Read**: Verify search results by reading matched files
**Grep**: Confirm exact patterns after semantic search narrows candidates
**Glob**: Locate files by name when semantic search identifies a module

### External Tools

**CocoIndex Code (ccc)**:
- Installation: `bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh`
- Update: `bash .opencode/skill/mcp-cocoindex-code/scripts/update.sh`
- Purpose: Semantic code search via vector embeddings
- Requires: Python 3.11+, SQLite with sqlite-vec extension

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### scripts/

| Script         | Purpose            | Usage                                                                         |
| -------------- | ------------------ | ----------------------------------------------------------------------------- |
| **install.sh** | Install CocoIndex  | `bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh`                  |
| **update.sh**  | Update to latest   | `bash .opencode/skill/mcp-cocoindex-code/scripts/update.sh`                   |

### references/

| Document                  | Purpose               | Key Insight                                  |
| ------------------------- | --------------------- | -------------------------------------------- |
| **tool_reference.md**     | Complete CLI/MCP docs | All commands, parameters, and options        |
| **search_patterns.md**    | Search query patterns | Effective query formulation and filter usage |

### assets/

| Asset                     | Purpose                |
| ------------------------- | ---------------------- |
| **config_templates.md**   | MCP server config examples |

### Guides

- [INSTALL_GUIDE.md](INSTALL_GUIDE.md) - Installation and initial setup
- [README.md](README.md) - Skill overview and quick start

### Related Skills

- **[mcp-code-mode](../mcp-code-mode/SKILL.md)** - MCP orchestration for external tools
- **[system-spec-kit](../system-spec-kit/SKILL.md)** - Context preservation and memory
<!-- /ANCHOR:related-resources -->
