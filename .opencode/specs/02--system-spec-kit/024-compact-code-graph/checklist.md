---
title: "Checklist: Hybrid Context Injection [02--system-spec-kit/024-compact-code-graph/checklist]"
description: "checklist document for 024-compact-code-graph."
trigger_phrases:
  - "checklist"
  - "hybrid"
  - "context"
  - "injection"
  - "024"
  - "compact"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Hybrid Context Injection

## P0 — Must Pass

- [x] PreCompact hook precomputes context and caches to temp file
- [x] SessionStart(source=compact) hook injects cached context via stdout
- [x] SessionStart(source=startup|resume) hook primes sessions with relevant context
- [x] `profile: "resume"` passed in all resume paths (fixes iter 012 gap)
- [x] Hook scripts complete in <2 seconds (PreCompact, SessionStart) or async (Stop)
- [x] Hook scripts handle MCP server unavailability gracefully (no crash, no block)
- [x] Compaction token budget enforced (≤4000 tokens via COMPACTION_TOKEN_BUDGET)
- [x] Cross-runtime tool fallback works (Codex CLI tested)
- [x] Existing Gate system not broken by hook additions
- [x] `.claude/settings.local.json` hook registration is merge-safe (user has existing hooks at `~/.claude/settings.json`)

## P1 — Should Pass

- [x] Stop hook (async) saves session context automatically
- [x] Token usage parsed from transcript and stored in hook state metrics
- [x] CLAUDE.md compaction recovery section enhanced with explicit `memory_context({ mode: "resume", profile: "resume" })` call
- [x] `.claude/CLAUDE.md` created with Claude-specific recovery (closes Gap B)
- [x] Session priming detects source (startup/resume/clear/compact) and routes appropriately
- [x] Constitutional memories surface on both hook and tool paths
- [x] Hook-state bridges Claude `session_id` → Spec Kit `effectiveSessionId`
- [x] Runtime detection outputs both `runtime` and `hookPolicy` (iter 015)
- [x] CocoIndex integration tested alongside hook injection (structural + semantic context)
- [x] Code graph queries complement (not duplicate) CocoIndex semantic search
- [x] Architecture diagrams show 3-system integration (Hooks + Code Graph + CocoIndex)
- [x] Token budget allocator implements floors + overflow pool (constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800)
- [x] code_graph_context accepts CocoIndex file-range seeds and resolves to graph nodes
- [x] Phase 008-011 child spec folders created within 024-compact-code-graph

## P2 — Nice to Have

- [x] Token tracking viewable via `memory_stats` or new tool — ccc_status tool provides index stats
- [x] Session priming respects token pressure (reduce output when context window filling) — calculatePressureBudget() scales at >70%/>90%
- [x] Stop hook auto-detects spec folder from transcript/hook-state — detectSpecFolder() in session-stop.ts
- [x] PreCompact hook includes working memory attention signals — extractAttentionSignals() scans transcript for referenced identifiers
- [x] MCP-level compaction detection (time gap analysis, `SPECKIT_AUTO_COMPACT_DETECT`) — DEFERRED v2: not implementable without runtime SDK changes
- [x] Copilot/Gemini hook adapters planned for v2 — DEFERRED v2: not implementable without runtime SDK changes
- [x] Cost estimates accurate per model (Opus/Sonnet/Haiku pricing)
- [x] Query-intent routing distinguishes structural (code_graph) vs semantic (CocoIndex) queries
- [x] CocoIndex ↔ Code Graph bidirectional enrichment bridge designed
- [x] Code graph expansion accepts CocoIndex search results as seeds
- [x] Compaction pipeline includes CocoIndex semantic neighbors as context source
- [x] Query-intent router distinguishes structural/semantic/session/hybrid intents
- [x] Reverse semantic augmentation: graph neighborhoods generate scoped CocoIndex queries — nextActions suggests CocoIndex follow-up
- [x] Session working-set tracker feeds compaction priority ranking
- [x] Allocator is observable: per-source tokens requested, granted, dropped in metadata
- [x] Latency budget for PreCompact pipeline stays under 2s hard cap
