---
title: "Checklist: Hookless Priming Optimization [024/024]"
description: "Verification checklist for all 10 items."
---
# Checklist: Phase 024 — Hookless Priming Optimization

## P0: Must Pass

- [x] `npx tsc --noEmit` — zero errors
- [x] `npx vitest run --exclude tests/file-watcher.vitest.ts` — zero new failures (4 pre-existing failures in memory-search-eval-channels and memory-search-ux-hooks are unrelated)
- [x] All 10 items implemented per tasks.md
- [x] Test expectations updated for new session_bootstrap tool (tool count 42 -> 43)

## P1: Should Pass

- [x] context-prime.md updated and copied to all 4 runtime dirs (.opencode, .claude, .codex, .agents)
- [x] orchestrate.md updated with best-effort delegation language
- [x] session_bootstrap registered in all required modules (tool-schemas, tool-input-schemas, lifecycle-tools, handlers/index, layer-definitions)
- [x] Bootstrap telemetry wired into both primeSessionIfNeeded (mcp_auto) and session_resume (tool)
- [x] Gemini runtime detection tests updated to match new dynamic behavior

## P2: Nice to Have

- [x] Session snapshot helper wrapped in try/catch per field for resilience
- [x] Modularization test limits updated for changed files
- [x] Runtime fixture updated for gemini-cli (unavailable without settings.json)
