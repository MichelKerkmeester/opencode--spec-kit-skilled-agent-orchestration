# Codex CLI — Context Recovery

> Codex-specific compaction recovery instructions. Supplements the root CLAUDE.md framework.

## After Context Compaction

Codex CLI does not have hook-based context injection. After context compaction, manually recover:

1. **FIRST ACTION** — call: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
2. Review the recovered state: current task, spec folder, blockers, next steps
3. Re-read this CODEX.md and the root CLAUDE.md
4. Present a summary to the user and WAIT for confirmation before proceeding

## Session Start Protocol

On the first turn of each Codex CLI session:

1. Call `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume" })`
2. Call `code_graph_status({})`
3. Use the recovered task/spec context plus code-graph health to decide whether structural retrieval can rely on code graph tools immediately or should fall back to CocoIndex plus file reads first

## Context Retrieval Primitives

Two retrieval primitives work across all runtimes:
1. `memory_match_triggers(prompt)` — fast turn-start context (constitutional + triggered)
2. `memory_context({ mode: "resume", profile: "resume" })` — session recovery after compaction

## Query-Intent Routing

Route queries to the appropriate system:
- **Semantic discovery** ("find code that...", "how is X implemented") → `mcp__cocoindex_code__search`
- **Structural navigation** ("what calls...", "what imports...") → `code_graph_query`, `code_graph_context`
- **Session continuity** ("previous work", "resume") → `memory_search`, `memory_context`

## Available MCP Tools

- **Spec Kit Memory**: 37 tools for semantic memory, context retrieval, session management
- **CocoIndex Code**: `search` tool for semantic code search across 28+ languages
- **Code Graph**: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`
