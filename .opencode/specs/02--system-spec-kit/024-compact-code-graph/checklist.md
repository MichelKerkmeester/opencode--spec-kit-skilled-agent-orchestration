# Checklist: Hybrid Context Injection

## P0 — Must Pass

- [ ] PreCompact hook precomputes context and caches to temp file
- [ ] SessionStart(source=compact) hook injects cached context via stdout
- [ ] SessionStart(source=startup|resume) hook primes sessions with relevant context
- [ ] `profile: "resume"` passed in all resume paths (fixes iter 012 gap)
- [ ] Hook scripts complete in <2 seconds (PreCompact, SessionStart) or async (Stop)
- [ ] Hook scripts handle MCP server unavailability gracefully (no crash, no block)
- [ ] Compaction token budget enforced (≤4000 tokens via COMPACTION_TOKEN_BUDGET)
- [ ] Cross-runtime tool fallback works (Codex CLI tested)
- [ ] Existing Gate system not broken by hook additions
- [ ] `.claude/settings.local.json` hook registration is merge-safe (user has existing hooks at `~/.claude/settings.json`)

## P1 — Should Pass

- [ ] Stop hook (async) saves session context automatically
- [ ] Token usage parsed from transcript and stored in `session_token_snapshots` table
- [ ] CLAUDE.md compaction recovery section enhanced with explicit `memory_context({ mode: "resume", profile: "resume" })` call
- [ ] `.claude/CLAUDE.md` created with Claude-specific recovery (closes Gap B)
- [ ] Session priming detects source (startup/resume/clear/compact) and routes appropriately
- [ ] Constitutional memories surface on both hook and tool paths
- [ ] Hook-state bridges Claude `session_id` → Spec Kit `effectiveSessionId`
- [ ] Runtime detection outputs both `runtime` and `hookPolicy` (iter 015)
- [ ] CocoIndex integration tested alongside hook injection (structural + semantic context)
- [ ] Code graph queries complement (not duplicate) CocoIndex semantic search
- [ ] Architecture diagrams show 3-system integration (Hooks + Code Graph + CocoIndex)
- [ ] Token budget allocator implements floors + overflow pool (constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800)
- [ ] code_graph_context accepts CocoIndex file-range seeds and resolves to graph nodes
- [ ] Phase 008-011 child spec folders created within 024-compact-code-graph

## P2 — Nice to Have

- [ ] Token tracking viewable via `memory_stats` or new tool
- [ ] Session priming respects token pressure (reduce output when context window filling)
- [ ] Stop hook auto-detects spec folder from transcript/hook-state
- [ ] PreCompact hook includes working memory attention signals
- [ ] MCP-level compaction detection (time gap analysis, `SPECKIT_AUTO_COMPACT_DETECT`)
- [ ] Copilot/Gemini hook adapters planned for v2
- [ ] Cost estimates accurate per model (Opus/Sonnet/Haiku pricing)
- [ ] Query-intent routing distinguishes structural (code_graph) vs semantic (CocoIndex) queries
- [ ] CocoIndex ↔ Code Graph bidirectional enrichment bridge designed
- [ ] Code graph expansion accepts CocoIndex search results as seeds
- [ ] Compaction pipeline includes CocoIndex semantic neighbors as context source
- [ ] Query-intent router distinguishes structural/semantic/session/hybrid intents
- [ ] Reverse semantic augmentation: graph neighborhoods generate scoped CocoIndex queries
- [ ] Session working-set tracker feeds compaction priority ranking
- [ ] Allocator is observable: per-source tokens requested, granted, dropped in metadata
- [ ] Latency budget for PreCompact pipeline stays under 2s hard cap
