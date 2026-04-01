---
title: "Tasks: Cross-Runtime UX & Documentation [024/016]"
description: "Task tracking for 14 items across seed resolution, auto-reindex, instruction updates, and truth-sync."
---
# Tasks: Phase 016 — Cross-Runtime UX & Documentation

## Completed

- [x] Item 39: Near-exact seed resolution tier added — Evidence: seed-resolver.ts queries within +/-5 line window, confidence graduates 0.95 - 0.02*distance, composite index `idx_file_line ON code_nodes(file_path, start_line)` in code-graph-db.ts
- [x] Item 40: Intent pre-classifier routes structural vs semantic queries — Evidence: `classifyQueryIntent()` in query-intent-classifier.ts; structural keywords to code graph, semantic to CocoIndex, ambiguous to both
- [x] Item 41: Auto-reindex triggers on git branch switch — Evidence: scan.ts checks `git rev-parse HEAD` against stored `last_git_head` in `code_graph_metadata` table; stale entries pruned on HEAD change
- [x] Item 41: Auto-reindex on session start via first-call priming — Evidence: wired into Phase 014 first-call priming pattern in scan.ts
- [x] Item 42: CODEX.md updated with Session Start Protocol — Evidence: calls `memory_context()` with resume profile + `code_graph_status()` on first turn
- [x] Item 42: AGENTS.md updated with code graph auto-trigger — Evidence: Copilot CLI and Gemini CLI agents get auto-trigger instructions
- [x] Item 42: OpenCode context.md updated with code graph integration — Evidence: `.opencode/agent/context.md` has tool reference table and graph health check
- [x] Item 42: GEMINI.md updated with session start protocol — Evidence: shares AGENTS.md content via symlink
- [x] Item 42: CLAUDE.md (root) updated with universal Code Search Protocol — Evidence: recovery instructions work across all runtimes
- [x] Item 43: Recovery documentation consolidated — Evidence: universal recovery in root CLAUDE.md, Claude-specific hook behavior in `.claude/CLAUDE.md` only; no overlapping authority
- [x] Item 44: Seed-resolver DB failures now throw with logged context — Evidence: `throwResolutionError()` in seed-resolver.ts replaces silent placeholder anchor fallback [F014]
- [x] Item 45: Spec/settings SessionStart scope aligned — Evidence: spec updated to reflect single unscoped entry + in-script branching as correct design [F030]
- [x] Item 46: Truth-sync checklist annotations applied — Evidence: 5 PARTIAL annotations on v1 parent checklist for phases 005/006/008/011/012 per review iterations 14, 18, 29

## Deferred

- [ ] CocoIndex score propagation via blended confidence formula — DEFERRED: requires CocoIndex API changes to expose relevance scoring endpoint. Near-exact confidence currently based on line distance only.
- [ ] Runtime instruction file verification on target runtimes — DEFERRED: requires manual testing on all 5 CLIs (Claude Code, OpenCode, Codex CLI, Copilot CLI, Gemini CLI). Automated verification would need CI integration.
