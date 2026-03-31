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
- [x] `profile: "resume"` passed in all resume paths (fixes iter 012 gap) — PARTIAL: canonical `/spec_kit:resume` still documents bare `memory_context({ mode: "resume" })` paths without `profile: "resume"`
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
- [x] Code graph queries complement (not duplicate) CocoIndex semantic search — PARTIAL: parent packet still presents tree-sitter-backed structural delivery, while the shipped indexer remains regex-based
- [x] Architecture diagrams show 3-system integration (Hooks + Code Graph + CocoIndex) — PARTIAL: docs and diagrams still describe a richer 3-source hook pipeline than the reviewed runtime executes
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
- [x] Compaction pipeline includes CocoIndex semantic neighbors as context source — PARTIAL: compaction currently emits CocoIndex follow-up guidance, not retrieved semantic-neighbor results
- [x] Query-intent router distinguishes structural/semantic/session/hybrid intents
- [x] Reverse semantic augmentation: graph neighborhoods generate scoped CocoIndex queries — nextActions suggests CocoIndex follow-up
- [x] Session working-set tracker feeds compaction priority ranking — PARTIAL: the tracker exists, but the active compaction path still relies on transcript heuristics instead of persisted working-set-driven ranking
- [x] Allocator is observable: per-source tokens requested, granted, dropped in metadata
- [x] Latency budget for PreCompact pipeline stays under 2s hard cap

---

## v2 Remediation — P0 (Must Fix)

- [x] endLine bug fixed: structural-indexer.ts parsers set correct end line for multi-line bodies (Phase 013, item 1) [F005]
- [x] Resume profile:"resume" passed in all resume paths (Phase 013, item 2)

## v2 Remediation — P1 (Should Fix)

- [x] Seed identity preserved through code_graph_context handler pipeline (Phase 013, item 3) [F006]
- [x] All tool args validated via schema validators before dispatch — not just rootDir (Phase 013, item 4) [F010]
- [x] Exception strings sanitized in memory-context.ts and code_graph_context.ts handlers (Phase 013, item 5)
- [x] Orphan inbound edges cleaned during re-index in replaceNodes() (Phase 013, item 6) [F007]
- [x] Budget allocator 4000-token ceiling removed + sessionState budgeted (Phase 013, item 7) [F011, F020]
- [x] Compact merger handles zero-budget sections without overflow marker outside budget (Phase 013, item 8) [F012]
- [x] code_graph_scan initializes DB on fresh runtime — no throw on first use (Phase 013, item 9) [F021]
- [x] initDb() has schema migration guard — no poisoned singleton on setup failure (Phase 013, item 10) [F023]
- [x] replaceNodes/Edges wrapped in transaction — constraint error cannot wipe file's graph (Phase 013, item 11) [F024]
- [x] Transitive code_graph_query respects maxDepth — no node leak or duplicate convergent paths (Phase 013, item 12) [F026]
- [x] includeTrace removed from schema (Phase 013, item 13) [F033]
- [x] pendingCompactPrime read-then-delete order fixed — no cache race (Phase 014, item 16) [F001]
- [x] saveState() errors propagated to callers — no false success (Phase 014, item 17) [F002]
- [x] Recovered context fenced with provenance markers — no injection via transcript replay (Phase 014, item 18) [F009]
- [x] Claude hook path wired through memory-surface.ts — constitutional/triggered payloads survive compaction (Phase 014, item 19) [F022]
- [x] Session_id hashing collision-resistant via SHA-256 (Phase 014, item 20) [F027]
- [x] Hook-state temp directory and files have 0700/0600 permissions (Phase 014, item 21) [F028]

## v2 Remediation — P2 (Improvements)

- [x] Working-set-tracker respects maxFiles without 2x overshoot (Phase 013, item 14) [F013]
- [x] ccc_feedback schema length bounds enforced before disk write (Phase 013, item 15) [F031]
- [x] MCP first-call priming detects new sessions and auto-loads context (Phase 014, item 22)
- [x] Tool-dispatch auto-enrichment via GRAPH_ENRICHABLE_TOOLS interceptor (Phase 014, item 23)
- [x] Stale-on-read: ensureFreshFiles() checks mtime before query results (Phase 014, item 24)
- [x] Cache freshness validated via cachedAt TTL check (Phase 014, item 25) [F003]
- [x] Stop-hook has dedicated save semantics via pendingStopSave (Phase 014, item 26)
- [x] Cache-token accounting includes cache bucket tokens in totals (Phase 014, item 27)
- [x] Dead workingSet branch removed from session-prime.ts (Phase 014, item 28) [F004]
- [x] Duplicated token-count sync logic consolidated (Phase 014, item 29) [F019]
- [x] Drifted pressure-budget helper replaced with shared tested helper (Phase 014, item 30) [F032]
- [x] Parser adapter interface created for tree-sitter/regex swap (Phase 015, item 31)
- [ ] Tree-sitter WASM parser implemented for JS/TS/Python/Bash (Phase 015, item 32) — DEFERRED: awaits web-tree-sitter integration
- [x] DECORATES, OVERRIDES, TYPE_OF edge types added (Phase 015, item 33)
- [x] Dead per-file TESTED_BY branch removed (Phase 015, item 36) [F015]
- [x] excludeGlobs option wired into glob pipeline (Phase 015, item 37) [F016]
- [x] .zsh language mapping fixed — globs discover .zsh files (Phase 015, item 38) [F017]
- [x] Near-exact seed resolution with graduated confidence (Phase 016, item 39)
- [ ] Query-intent pre-classification routes structural vs semantic queries (Phase 016, item 40) — DEFERRED
- [x] Auto-reindex triggers on branch switch and session start (Phase 016, item 41)
- [x] Recovery documentation consolidated to single source of truth (Phase 016, item 43) [F018]
- [x] Seed-resolver DB failures handled — throws instead of silent placeholder (Phase 016, item 44) [F014]
- [ ] Spec/settings SessionStart scope mismatch fixed (Phase 016, item 45) [F030] — DEFERRED

## v2 Remediation — P3 (Nice to Have)

- [x] Ghost SymbolKinds (variable, module, parameter, method) extracted by parser (Phase 015, item 34) [F008]
- [ ] Regex parser removed after tree-sitter stable (Phase 015, item 35) — DEFERRED
- [x] Cross-runtime instructions updated: CODEX.md, AGENTS.md, OpenCode agents, Gemini (Phase 016, item 42)
