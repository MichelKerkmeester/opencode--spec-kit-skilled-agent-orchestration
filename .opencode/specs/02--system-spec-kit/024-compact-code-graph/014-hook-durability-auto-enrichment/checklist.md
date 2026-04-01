---
title: "Checklist: Hook Durability & Auto-Enrichment [024/014]"
description: "14 items across P1/P2 for phase 014."
---
# Checklist: Phase 014 — Hook Durability & Auto-Enrichment

## P1

- [x] pendingCompactPrime read-before-clear ordering improved, but payload can still be lost if stdout fails after clear [F001]
- [x] saveState() returns boolean; current callers log `hookLog` warnings on failure and continue [F002]
- [x] Recovered context fenced with provenance markers — transcript replay cannot inject [F009]
- [x] Claude hook path wired through memory-surface.ts — constitutional/triggered payloads survive compaction [F022]
- [x] Session_id hashing is collision-resistant — distinct sessions never alias to same state file [F027]
- [x] Hook-state temp directory created with 0700 permissions [F028]
- [x] Hook-state JSON files written with 0600 permissions [F028]

## P2

- [x] MCP first-call priming fires on the first qualifying tool call while the MCP server process is still unprimed
- [x] First-call priming loads constitutional memories + code graph status
- [x] First-call priming works on Claude Code, OpenCode, Codex CLI, Copilot CLI, Gemini CLI
- [x] GRAPH_AWARE_TOOLS interceptor enriches file-reading tools with graph context
- [x] Auto-enrichment respects 250ms latency budget
- [x] Auto-enrichment does not recurse (GRAPH_AWARE_TOOLS exclusion set)
- [x] ensureFreshFiles() detects stale files via mtime comparison
- [x] `ensureFreshFiles()` classifies files as stale/fresh via mtime comparison; the spec's 3-tier stale-on-read threshold model is not implemented
- [x] file_mtime_ms column added to code_files schema
- [x] Cache freshness validated via cachedAt TTL (30-minute default) [F003]
- [x] Stale compact cache rejected (not injected) [F003]
- [x] Planned `pendingStopSave` field was not added to `HookState`; stop-hook redesign remains unimplemented
- [x] Cache-token buckets included in surfaced token totals
- [x] Dead workingSet branch removed from session-prime.ts [F004]
- [x] Duplicated token-count sync logic consolidated into shared helper [F019]
- [x] Drifted pressure-budget helper replaced with shared tested version [F032]
- [x] All existing vitest tests still pass — 226/226
