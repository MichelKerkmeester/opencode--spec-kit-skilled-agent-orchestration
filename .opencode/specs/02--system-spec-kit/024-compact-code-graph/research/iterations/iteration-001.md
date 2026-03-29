# Iteration 001 — Foundational Analysis: Dual-Graph Architecture & Repository Overview

**Focus:** Fetch and analyze Codex-CLI-Compact (Dual-Graph) repository — understand README, architecture, main source files, and core functionality. Answer Q1.

**Status:** complete
**newInfoRatio:** 0.95
**Novelty:** First contact with the Dual-Graph codebase; all information is new.

---

## Findings

### 1. Project Identity
- **Name:** Dual-Graph (marketed as "Codex-CLI-Compact")
- **URL:** https://github.com/kunal12203/Codex-CLI-Compact
- **Description:** Context optimization engine that reduces token consumption by 30-45% for Claude Code and Codex CLI
- **Language:** Python 3.10+ (core engine), Node.js 18+ (launcher scripts)
- **Stars:** 214 | Forks: 27 | Commits: 371 | Size: 2.7MB
- **Version:** 3.9.38+
- **License:** Apache 2.0 for launcher scripts; **PROPRIETARY** for core graph engine ("graperoot")

### 2. Architecture — Three-Stage Pipeline
1. **Graph Construction** — Scans project to extract files, functions, classes, and import relationships into a local semantic graph (`info_graph.json`)
2. **Context Injection** — When queries are made, the graph ranks relevant files and prepends them to AI prompts automatically
3. **Session Memory** — Files read/edited/queried are prioritized in subsequent turns via `chat_action_graph.json`, creating compounding token savings

### 3. Data Storage (per-project `.dual-graph/` directory)
- `info_graph.json` — semantic graph structure (files, functions, classes, imports)
- `chat_action_graph.json` — session memory (what files were accessed)
- `context-store.json` — persistent decisions and facts
- `mcp_server.log` — server logs
- Global installation: `~/.dual-graph/`

### 4. MCP Integration
- Runs a local HTTP MCP server on port 8080+
- **Claude Code:** HTTP transport via `claude mcp add`
- **Codex CLI:** stdio bridge using `mcp-remote`
- **Cursor/VS Code:** JSON config files
- Tools exposed: `graph_continue`, `graph_scan`, `graph_read`, `graph_add_memory`, `graph_register_edit`
- Token counter MCP at port 8899

### 5. Key MCP Tools
| Tool | Purpose |
|------|---------|
| `graph_continue` | Must be called FIRST before any file exploration |
| `graph_scan` | Scans project when `needs_project=true` |
| `graph_read` | Reads recommended files (supports `file::symbol` notation) |
| `graph_add_memory` | Stores decisions, tasks, blockers (15-word max descriptions) |
| `graph_register_edit` | Logs file modifications for context tracking |
| `count_tokens` | Token counting for cost awareness |
| `get_session_stats` | Session usage summary |

### 6. Claimed Performance Metrics
| Metric | Without Dual-Graph | With Dual-Graph |
|--------|-------------------|-----------------|
| Cost per prompt | $0.46 | $0.27 (41% reduction) |
| Average turns | 16.8 | 10.3 (39% fewer) |
| Response time | 186s | 134s (28% faster) |
| Quality score | 82.7/100 | 87.1/100 (5.3% better) |

### 7. Critical Finding: Proprietary Core
The graph engine **"graperoot"** is a **proprietary Python library** distributed via PyPI. The open-source repository contains only:
- Bash/PowerShell launcher scripts (`bin/dgc`, `bin/dg`, `bin/dual_graph_launch.sh`)
- Benchmark code
- Dashboard (token tracking)
- Installation scripts
- Configuration templates (CLAUDE.md, CODEX.md, CONTEXT.md)

**The actual graph construction, ranking, and context injection logic is NOT open source.**

### 8. Supported Languages
TypeScript, JavaScript, Python, Go, Swift, Rust, Java, Kotlin, C#, Ruby, PHP (11 languages)

### 9. Configuration
Environment variables control behavior:
- `DG_HARD_MAX_READ_CHARS` (default: 4000) — per-file character limit
- `DG_TURN_READ_BUDGET_CHARS` (default: 18000) — total read budget per turn
- `DG_FALLBACK_MAX_CALLS_PER_TURN` (default: 1) — grep fallback limit
- `DG_RETRIEVE_CACHE_TTL_SEC` (default: 900) — cache duration
- `DG_MCP_PORT` (default: auto-detect 8080-8099) — server port

---

## Dead Ends
- Cannot inspect core graph algorithm (proprietary graperoot library)
- No API documentation for graperoot beyond what the launcher script reveals

## Sources
- [SOURCE: https://github.com/kunal12203/Codex-CLI-Compact] — README
- [SOURCE: https://raw.githubusercontent.com/.../install.sh] — Installation script
- [SOURCE: https://raw.githubusercontent.com/.../CLAUDE.md] — Claude integration policy
- [SOURCE: https://raw.githubusercontent.com/.../CODEX.md] — Codex integration policy
- [SOURCE: https://raw.githubusercontent.com/.../dashboard/server.py] — Dashboard server
- [SOURCE: https://raw.githubusercontent.com/.../requirements.txt] — Python dependencies
- [SOURCE: https://raw.githubusercontent.com/.../bin/dual_graph_launch.sh] — Main orchestration script

## Q1 Answer
**Codex-CLI-Compact (Dual-Graph)** is a context optimization engine that builds a semantic graph of your codebase (files, functions, classes, imports) via a **proprietary Python library called graperoot**. It exposes this graph through an MCP server, allowing AI tools (Claude Code, Codex CLI) to efficiently pre-load only relevant context files into prompts. The open-source portion is limited to launcher scripts, benchmarks, and configuration — the core intelligence is closed-source.
