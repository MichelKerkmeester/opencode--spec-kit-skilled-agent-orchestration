---
title: "Tasks: CocoIndex UX, Utilization & Usefulness [024/012]"
description: "Task tracking for hook compilation fix, MCP availability, enhanced tools, agent routing, auto-index, and quality feedback."
---
# Tasks: Phase 012 — CocoIndex UX, Utilization & Usefulness

## Completed

### A. Hook Compilation Fix (P0)

- [x] Verify `hooks/claude/*.ts` included in MCP server TypeScript build scope — tsconfig.json includes pattern covers hooks/claude/
- [x] `npm run build` produces compiled JS for all 6 hook files (shared, hook-state, compact-inject, session-prime, session-stop, claude-transcript) — dist/hooks/claude/ populated
- [x] `echo '{}' | node dist/hooks/claude/session-prime.js` exits 0 — verified
- [x] `echo '{}' | node dist/hooks/claude/compact-inject.js` exits 0 — verified
- [x] `echo '{}' | node dist/hooks/claude/session-stop.js` exits 0 — verified
- [x] All existing MCP server tests still pass after build changes — verified

### B. CocoIndex MCP Availability (P1)

- [x] CocoIndex server entry added to `.claude/mcp.json` with `cocoindex_code` key — .claude/mcp.json
- [x] SessionStart startup output includes CocoIndex availability status — session-prime.ts `handleStartup` checks `getStats().lastScanTimestamp`
- [x] Stale index detection (>24h) triggers warning section in startup output — session-prime.ts

### C. Enhanced MCP Tools (P2)

- [x] `ccc_status` MCP tool returns index stats (file count, chunk count, model, last indexed) — handlers/code-graph/ccc-status.ts
- [x] `ccc_reindex` MCP tool triggers incremental re-index — handlers/code-graph/ccc-reindex.ts
- [x] `ccc_feedback` MCP tool accepts result quality feedback (wasUseful, resultRank, queryTerms) — handlers/code-graph/ccc-feedback.ts
- [x] New tools registered in handler index — handlers/code-graph/index.ts

### D. Agent Routing & Utilization (P1)

- [x] `@context` agent updated to check CocoIndex FIRST before Grep/Glob for semantic queries — .opencode/agent/context.md
- [x] `@context` agent updated across all 4 runtimes — .claude/agents/context.md, .codex/agents/context.toml, .gemini/agents/context.md, .agents/agents/context.md
- [x] PreCompact hook queries CocoIndex for semantic neighbors of working-set files (when available) — hooks/claude/compact-inject.ts
- [x] `code_graph_context` supports reverse semantic augmentation (latency-guarded, nextActions suggests CocoIndex) — lib/code-graph/code-graph-context.ts
- [x] Runtime routing tests validate CocoIndex-first behavior — tests/runtime-routing.vitest.ts: 12 tests in 5 groups (semantic, structural, session, ambiguous, case-insensitive)

### E. Auto-Index & Freshness (P2)

- [x] SessionStart auto-detects stale index (>24h) and adds warning section — session-prime.ts `handleStartup`
- [x] `refresh_index: false` documented as default to avoid concurrency issues — SKILL.md + search_patterns.md
- [x] Freshness strategy documented with re-index triggers, refresh_index guidance, freshness signals, and feedback loop — search_patterns.md section 8b

### F. Quality Feedback & Documentation (P2)

- [x] `ccc_feedback` MCP tool stores feedback for retrieval quality tuning — handlers/code-graph/ccc-feedback.ts
- [x] CocoIndex skill docs updated with new tools and integration points — mcp-coco-index/SKILL.md MCP Tool Summary updated with ccc_status/ccc_reindex/ccc_feedback
- [x] No `ComponentContext` errors with `refresh_index: false` default — documented in SKILL.md + search_patterns.md, ccc_reindex provides explicit refresh path

## Not Applicable

- None — all planned items delivered across P0, P1, and P2
