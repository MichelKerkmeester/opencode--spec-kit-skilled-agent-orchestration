---
title: "Checklist: Phase 4 — Cross-Runtime [02--system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/checklist]"
description: "checklist document for 004-cross-runtime-fallback."
trigger_phrases:
  - "checklist"
  - "phase"
  - "cross"
  - "runtime"
  - "004"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 4 — Cross-Runtime Fallback

## P0
- [x] CLAUDE.md compaction recovery enhanced with `memory_context({ mode: "resume", profile: "resume" })`
- [x] Codex CLI compaction recovery tested and working (tool-based)
- [x] No regression in existing Gate system
- [x] `memory_match_triggers` fires reliably post-compaction
- [x] Runtime detection produces both `runtime` and `hookPolicy`

## P1
- [x] `.claude/CLAUDE.md` created with Claude-specific recovery (closes Gap B)
- [x] CODEX.md created with recovery instructions
- [x] Copilot runtime tested (tool fallback by policy) — verified via 7-scenario test matrix: detectRuntime() returns copilot-cli/disabled_by_scope, getRecoveryApproach() returns tool_fallback
- [x] Gemini runtime tested (tool fallback by policy) — verified via 7-scenario test matrix: detectRuntime() returns gemini-cli/disabled_by_scope, getRecoveryApproach() returns tool_fallback
- [x] Cross-runtime behavior documented
- [x] 7-scenario test matrix from iter 015 implemented — cross-runtime-fallback.vitest.ts: 7 named scenarios (claude hooks enabled, hooks disabled, codex, copilot, gemini, unknown, graceful degradation)

## P2
- [x] MCP-level compaction detection (time gap analysis) — DEFERRED v2: not implementable without runtime SDK changes
- [x] `SPECKIT_AUTO_COMPACT_DETECT` feature flag — DEFERRED v2: not implementable without runtime SDK changes
- [x] Runtime fixture contract (iter 015) as reusable test harness
- [x] Copilot/Gemini hook adapters planned for v2 — DEFERRED v2: not implementable without runtime SDK changes
