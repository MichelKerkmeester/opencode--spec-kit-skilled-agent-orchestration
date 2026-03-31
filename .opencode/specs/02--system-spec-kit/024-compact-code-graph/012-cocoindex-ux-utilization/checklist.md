---
title: "Checklist: Phase 012 — CocoIndex [02--system-spec-kit/024-compact-code-graph/012-cocoindex-ux-utilization/checklist]"
description: "checklist document for 012-cocoindex-ux-utilization."
trigger_phrases:
  - "checklist"
  - "phase"
  - "012"
  - "cocoindex"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 012 — CocoIndex UX, Utilization & Usefulness

## P0 — Must Pass

- [x] `npm run build` produces `dist/hooks/claude/*.js` for all 6 hook files
- [x] SessionStart hook no longer errors on fresh Claude Code sessions
- [x] `echo '{}' | node dist/hooks/claude/session-prime.js` exits 0
- [x] `echo '{}' | node dist/hooks/claude/compact-inject.js` exits 0
- [x] `echo '{}' | node dist/hooks/claude/session-stop.js` exits 0
- [x] All existing MCP server tests still pass after build changes

## P1 — Should Pass

- [x] CocoIndex server entry present in `.claude/mcp.json`
- [x] SessionStart startup output includes CocoIndex availability status
- [x] `@context` agent (all 4 runtimes) checks CocoIndex before Grep/Glob for semantic queries
- [x] PreCompact hook queries CocoIndex for semantic neighbors (when available)
- [x] `code_graph_context` supports reverse semantic augmentation (optional, latency-guarded) — nextActions suggests CocoIndex
- [x] CocoIndex skill docs updated with new tools and integration points — SKILL.md MCP Tool Summary updated with ccc_status/ccc_reindex/ccc_feedback
- [x] No `ComponentContext` errors with `refresh_index: false` default — documented in SKILL.md + search_patterns.md, ccc_reindex provides explicit refresh

## P2 — Nice to Have

- [x] `ccc_status` MCP tool returns index stats — handlers/code-graph/ccc-status.ts
- [x] `ccc_reindex` MCP tool triggers incremental re-index — handlers/code-graph/ccc-reindex.ts
- [x] `ccc_feedback` MCP tool accepts result quality feedback — handlers/code-graph/ccc-feedback.ts
- [x] SessionStart auto-detects stale index (>24h) and triggers background re-index — handleStartup checks getStats().lastScanTimestamp, adds warning section
- [x] Freshness strategy documented in search_patterns.md — section 8b added with re-index triggers, refresh_index guidance, freshness signals, feedback loop
- [ ] Agent routing tests validate CocoIndex-first behavior
