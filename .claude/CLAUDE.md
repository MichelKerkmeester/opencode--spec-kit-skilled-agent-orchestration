# Claude Code — Hook-Aware Recovery Additions

> Claude-specific additions only. Universal recovery instructions live in the root CLAUDE.md.

## Hook-Aware Recovery

When context is compacted, Claude Code hooks automatically inject recovered context. If hook-injected context appears in the conversation, use it directly and avoid repeating the manual recovery flow unless the injected payload is missing, stale, or clearly incomplete.

If no hook context is present (hooks may be disabled or unavailable), follow the root `CLAUDE.md` recovery protocol.

## Session Start

On fresh sessions, SessionStart hooks may inject startup or resume context before the first user turn. Treat that payload as additive context; if no hook payload appears, fall back to the normal first-turn protocol defined by the active runtime instructions.

## Hook System

This project uses Claude Code hooks for automated context preservation:
- **PreCompact**: Caches critical context before compaction
- **SessionStart**: Injects context on session start (startup/resume/compact/clear)
- **Stop**: Tracks token usage and saves session state (async)

Hook scripts: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/`
Registration: `.claude/settings.local.json`

## Tool Routing Enforcement

Claude Code hooks inject tool routing rules via MCP server instructions and session priming. When hooks fire, routing is enforced automatically. When working without hooks (fallback mode), follow the decision tree in root CLAUDE.md.

### Hook-Injected Routing
- **SessionStart**: PrimePackage includes `routingRules.toolRouting` with search tool decision tree
- **buildServerInstructions()**: MCP server instructions include Tool Routing section with availability-aware rules
- **Tool response hints**: When memory_search/memory_context detects a code-search query, response includes a routing hint

### Routing Decision Tree (reinforcement)
- Semantic/concept search → `mcp__cocoindex_code__search`
- Structural queries (callers, imports) → `code_graph_query`
- Exact text/regex → `Grep`
