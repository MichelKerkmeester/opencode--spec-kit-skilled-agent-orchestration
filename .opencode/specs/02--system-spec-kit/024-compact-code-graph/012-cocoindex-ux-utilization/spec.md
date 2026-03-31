---
title: "Phase 012: CocoIndex UX, Utilization & [02--system-spec-kit/024-compact-code-graph/012-cocoindex-ux-utilization/spec]"
description: "Improve the UX, utilization, and usefulness of the CocoIndex Code MCP skill so that semantic code search is more prominent, more reliably invoked, and more deeply integrated wit..."
trigger_phrases:
  - "phase"
  - "012"
  - "cocoindex"
  - "utilization"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
# Phase 012: CocoIndex UX, Utilization & Usefulness

## Summary

Improve the UX, utilization, and usefulness of the CocoIndex Code MCP skill so that semantic code search is more prominent, more reliably invoked, and more deeply integrated with the hook system and code graph.

## Problem

CocoIndex Code is a mature semantic search tool (28+ languages, vector embeddings, CLI + MCP) but underutilized in practice due to several gaps:

1. **Hook compilation blocker** — SessionStart hook TS files (`hooks/claude/*.ts`) are not compiled to `dist/hooks/claude/*.js`. Every Claude Code session start fails with "SessionStart:startup hook error" because the registered JS files don't exist.
2. **MCP not in `.claude/mcp.json`** — CocoIndex is configured in `opencode.json` but NOT in `.claude/mcp.json`, so Claude Code users may not have it auto-loaded.
3. **Single MCP tool** — Only `search` is exposed via MCP. Index management (index, status, reset, daemon) requires CLI fallback.
4. **No auto-index on session start** — Users must manually run `ccc index` or rely on stale indexes.
5. **Agents underuse CocoIndex** — Despite CLAUDE.md and AGENTS.md mentioning "CocoIndex-first", agents frequently skip it in favor of Grep/Glob because the routing guidance is advisory, not enforced.
6. **No result quality feedback** — No way to tell CocoIndex which results were useful, so embedding quality can't improve over time.
7. **Concurrency issue** — Documented `ComponentContext` errors on concurrent MCP queries when `refresh_index=true`.
8. **No integration with compaction** — PreCompact hook doesn't query CocoIndex for semantic neighbors of active files (noted as optional in Phase 001 plan).

## What to Build

### A. Fix Hook Compilation (P0 — blocker)

1. Add `hooks/claude/*.ts` to the MCP server TypeScript build so `tsc --build` compiles them to `dist/hooks/claude/*.js`
2. Verify all 3 hook scripts (compact-inject, session-prime, session-stop) plus libraries (shared, hook-state, claude-transcript) compile and produce JS output
3. Add a build verification step that checks `dist/hooks/claude/` exists after `npm run build`

### B. Ensure CocoIndex MCP Availability (P1)

1. Add CocoIndex server config to `.claude/mcp.json` so it auto-loads in Claude Code sessions
2. Update SessionStart hook (`session-prime.ts`) to check CocoIndex MCP availability and include a status line in startup output (e.g., "CocoIndex: available (28 indexed files)" or "CocoIndex: not configured")
3. Add `ensure_ready.sh` call to SessionStart startup path (idempotent, fast if already running)

### C. Enhance MCP Tool Surface (P1)

1. Add `ccc_status` MCP tool — exposes index stats (file count, chunk count, embedding model, last indexed) without CLI
2. Add `ccc_reindex` MCP tool — triggers incremental re-index from MCP (useful after file changes)
3. Register new tools in CocoIndex MCP server config
4. Update skill docs (SKILL.md, README.md, tool_reference.md) to document new tools

### D. Improve Agent Routing & Utilization (P1)

1. Update `@context` agent to check CocoIndex FIRST before Grep/Glob when intent is semantic
2. Add CocoIndex result snippets to compaction context — PreCompact hook queries CocoIndex for semantic neighbors of working-set files, includes top results in cached payload
3. Update `code_graph_context` to optionally call CocoIndex for reverse semantic augmentation (already designed in Phase 010, needs wiring)
4. Add agent routing tests validating CocoIndex-first behavior

### E. Auto-Index and Freshness (P2)

1. Add optional auto-index trigger to SessionStart hook — if index is stale (>24h since last full index), trigger background `ccc index` via daemon
2. Add `refresh_index: false` default for MCP search to avoid concurrency issues, with explicit refresh available via `ccc_reindex`
3. Document freshness strategy in skill references

### F. Quality Feedback Loop (P2)

1. Add `ccc_feedback` MCP tool — accepts result ID + useful/not-useful signal
2. Store feedback in CocoIndex database for future retrieval quality tuning
3. Wire feedback into the existing `memory_validate` pattern (wasUseful, resultRank)

## Architecture

```
SessionStart hook
  ├── Check CocoIndex MCP availability
  ├── Report status in startup output
  └── Optional: trigger background re-index if stale

PreCompact hook
  ├── Get working-set files from session
  ├── Query CocoIndex for semantic neighbors of top files
  └── Include snippets in cached compact payload

code_graph_context (Phase 010)
  ├── Resolve seeds via seed-resolver
  ├── Expand graph neighborhoods
  └── Optional: reverse semantic augmentation via CocoIndex

Agent routing
  ├── Semantic intent → CocoIndex FIRST
  ├── Structural intent → code_graph
  └── Session intent → Memory
```

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| FIX | `mcp_server/tsconfig.json` | Ensure hooks/claude/*.ts included in build output |
| NEW | Build verification script | Check dist/hooks/claude/ after build |
| EDIT | `.claude/mcp.json` | Add cocoindex_code server entry |
| EDIT | `hooks/claude/session-prime.ts` | Add CocoIndex status check on startup |
| NEW | CocoIndex `ccc_status` MCP tool | Index stats without CLI |
| NEW | CocoIndex `ccc_reindex` MCP tool | Trigger re-index from MCP |
| EDIT | `hooks/claude/compact-inject.ts` | Query CocoIndex for semantic neighbors |
| EDIT | Agent `@context` definitions (4 runtimes) | CocoIndex-first routing enforcement |
| EDIT | `lib/code-graph/code-graph-context.ts` | Wire reverse semantic augmentation |
| EDIT | `mcp-coco-index/SKILL.md` | Document new MCP tools |
| EDIT | `mcp-coco-index/README.md` | Update tool count, add new tool docs |
| EDIT | `mcp-coco-index/references/tool_reference.md` | Add ccc_status and ccc_reindex |

## Acceptance Criteria

- [ ] `npm run build` in mcp_server produces `dist/hooks/claude/*.js` for all 6 files
- [ ] SessionStart hook no longer errors on fresh Claude Code sessions
- [ ] CocoIndex MCP server loads in Claude Code sessions (present in `.claude/mcp.json`)
- [ ] `ccc_status` MCP tool returns index stats
- [ ] `ccc_reindex` MCP tool triggers incremental re-index
- [ ] PreCompact hook includes CocoIndex semantic neighbors in cached payload
- [ ] `@context` agent checks CocoIndex before Grep/Glob for semantic queries
- [ ] No `ComponentContext` errors on sequential MCP queries (refresh_index defaults to false)
- [ ] All existing tests still pass after changes

## LOC Estimate

~300-450 lines across hook fixes, new MCP tools, agent updates, and documentation.

## Dependencies

- Phases 001-003 (hook scripts exist but need compilation)
- Phase 010 (code_graph_context reverse augmentation design)
- CocoIndex Code MCP server (external, already deployed)

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| CocoIndex daemon not running | Graceful fallback — skip CocoIndex sections, don't block hooks |
| MCP tool registration conflicts | New tools use `ccc_` prefix to avoid namespace collision |
| Auto-index slows startup | Background only, SessionStart doesn't wait for completion |
| Stale index gives bad results | Status output warns user, optional manual reindex |
