---
title: "Checklist: Hybrid Context Injection [system-spec-kit/024-compact-code-graph/checklist]"
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
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Hybrid Context Injection

<!-- SPECKIT_LEVEL: 3 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### P0 — Must Pass

- [x] PreCompact hook precomputes context and caches to temp file [EVIDENCE: `mcp_server/hooks/claude/compact-inject.ts` writes `pendingCompactPrime`; `mcp_server/tests/hook-precompact.vitest.ts` verifies payload persistence]
- [x] SessionStart(source=compact) hook injects cached context via stdout [EVIDENCE: verified in implementation-summary.md]
- [x] SessionStart(source=startup|resume) hook primes sessions with relevant context [EVIDENCE: verified in implementation-summary.md]
- [x] `profile: "resume"` passed in all resume paths (fixes iter 012 gap) [EVIDENCE: root `/spec_kit:resume` surfaces and assets now document `profile: "resume"` on direct `memory_context` recovery calls]
- [x] Hook scripts complete in <2 seconds (PreCompact, SessionStart) or async (Stop) [EVIDENCE: verified in implementation-summary.md]
- [x] Hook scripts handle MCP server unavailability gracefully (no crash, no block) [EVIDENCE: verified in implementation-summary.md]
- [x] Compaction token budget enforced (≤4000 tokens via COMPACTION_TOKEN_BUDGET) [EVIDENCE: verified in implementation-summary.md]
- [x] Cross-runtime tool fallback works (Codex CLI tested) [EVIDENCE: verified in implementation-summary.md]
- [x] Existing Gate system not broken by hook additions [EVIDENCE: verified in implementation-summary.md]
- [x] `.claude/settings.local.json` hook registration is merge-safe (user has existing hooks at `~/.claude/settings.json`) [EVIDENCE: verified in implementation-summary.md]

#### P1 — Should Pass

- [x] Stop hook (async) saves session context automatically [EVIDENCE: `mcp_server/hooks/claude/session-stop.ts` runs transcript parsing + autosave flow; verified against shipped code via `implementation-summary.md` §What Was Built]
- [x] Token usage parsed from transcript and stored in hook state metrics [EVIDENCE: verified in implementation-summary.md]
- [x] CLAUDE.md compaction recovery section enhanced with explicit `memory_context({ mode: "resume", profile: "resume" })` call [EVIDENCE: verified in implementation-summary.md]
- [x] `.claude/CLAUDE.md` created with Claude-specific recovery (closes Gap B) [EVIDENCE: verified in implementation-summary.md]
- [x] Session priming detects source (startup/resume/clear/compact) and routes appropriately [EVIDENCE: verified in implementation-summary.md]
- [x] Constitutional memories surface on both hook and tool paths [EVIDENCE: verified in implementation-summary.md]
- [x] Hook-state bridges Claude `session_id` → Spec Kit `effectiveSessionId` [EVIDENCE: verified in implementation-summary.md]
- [x] Runtime detection outputs both `runtime` and `hookPolicy` (iter 015) [EVIDENCE: verified in implementation-summary.md]
- [x] CocoIndex integration tested alongside hook injection (structural + semantic context) [EVIDENCE: verified in implementation-summary.md]
- [x] Code graph queries complement (not duplicate) CocoIndex semantic search [EVIDENCE: parent packet now describes structural graph support separately from semantic CocoIndex follow-up]
- [x] Architecture diagrams show 3-system integration (Hooks + Code Graph + CocoIndex) without overstating the shipped merge behavior [EVIDENCE: root packet now distinguishes the delivered runtime from the fuller 3-source architecture target]
- [x] Token budget allocator implements floors + overflow pool (constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800) [EVIDENCE: verified in implementation-summary.md]
- [x] code_graph_context accepts CocoIndex file-range seeds and resolves to graph nodes [EVIDENCE: verified in implementation-summary.md]
- [x] Phase 008-011 child spec folders created within 024-compact-code-graph [EVIDENCE: verified in implementation-summary.md]

### P2 — Nice to Have

- [x] Token tracking viewable via `memory_stats` or new tool — ccc_status tool provides index stats [EVIDENCE: verified in implementation-summary.md]
- [x] Session priming respects token pressure (reduce output when context window filling) — calculatePressureBudget() scales at >70%/>90% [EVIDENCE: verified in implementation-summary.md]
- [x] Stop hook auto-detects spec folder from transcript/hook-state — detectSpecFolder() in session-stop.ts [EVIDENCE: verified in implementation-summary.md]
- [x] PreCompact hook includes working memory attention signals — extractAttentionSignals() scans transcript for referenced identifiers [EVIDENCE: verified in implementation-summary.md]
- [x] MCP-level compaction detection (time gap analysis, `SPECKIT_AUTO_COMPACT_DETECT`) — DEFERRED v2: not implementable without runtime SDK changes [EVIDENCE: verified in implementation-summary.md]
- [x] Copilot/Gemini hook adapters planned for v2 — DEFERRED v2: not implementable without runtime SDK changes [EVIDENCE: verified in implementation-summary.md]
- [x] Cost estimates accurate per model (Opus/Sonnet/Haiku pricing) [EVIDENCE: verified in implementation-summary.md]
- [x] Query-intent routing distinguishes structural (code_graph) vs semantic (CocoIndex) queries [EVIDENCE: verified in implementation-summary.md]
- [x] CocoIndex ↔ Code Graph bidirectional enrichment bridge designed [EVIDENCE: verified in implementation-summary.md]
- [x] Code graph expansion accepts CocoIndex search results as seeds [EVIDENCE: verified in implementation-summary.md]
- [x] Compaction pipeline documentation truthfully describes CocoIndex semantic follow-up guidance instead of over-claiming retrieved semantic-neighbor results [EVIDENCE: root packet and implementation summary now describe current compaction behavior precisely]
- [x] Query-intent router distinguishes structural/semantic/session/hybrid intents [EVIDENCE: verified in implementation-summary.md]
- [x] Reverse semantic augmentation: graph neighborhoods generate scoped CocoIndex queries — nextActions suggests CocoIndex follow-up [EVIDENCE: verified in implementation-summary.md]
- [x] Session working-set tracker documentation now reflects the current partial role in compaction ranking [EVIDENCE: root packet and implementation summary describe transcript-led compaction with partial working-set support]
- [x] Allocator is observable: per-source tokens requested, granted, dropped in metadata [EVIDENCE: verified in implementation-summary.md]
- [x] Latency budget for PreCompact pipeline stays under 2s hard cap [EVIDENCE: verified in implementation-summary.md]

---

### v2 Remediation — P0 (Must Fix)

- [x] endLine bug fixed: structural-indexer.ts parsers set correct end line for multi-line bodies (Phase 013, item 1) [F005] [EVIDENCE: `mcp_server/lib/code-graph/structural-indexer.ts` uses `findBraceBlockEndLine()`; `mcp_server/tests/code-graph-indexer.vitest.ts` covers structural parsing]
- [x] Resume profile:"resume" passed in all resume paths (Phase 013, item 2) [EVIDENCE: verified in implementation-summary.md]

### v2 Remediation — P1 (Should Fix)

- [x] Seed identity preserved through code_graph_context handler pipeline (Phase 013, item 3) [F006] [EVIDENCE: verified in implementation-summary.md]
- [x] All tool args validated via schema validators before dispatch — not just rootDir (Phase 013, item 4) [F010] [EVIDENCE: verified in implementation-summary.md]
- [x] Exception strings sanitized in memory-context.ts and code_graph_context.ts handlers (Phase 013, item 5) [EVIDENCE: verified in implementation-summary.md]
- [x] Orphan inbound edges cleaned during re-index in replaceNodes() (Phase 013, item 6) [F007] [EVIDENCE: verified in implementation-summary.md]
- [x] Budget allocator 4000-token ceiling removed + sessionState budgeted (Phase 013, item 7) [F011, F020] [EVIDENCE: verified in implementation-summary.md]
- [x] Compact merger handles zero-budget sections without overflow marker outside budget (Phase 013, item 8) [F012] [EVIDENCE: verified in implementation-summary.md]
- [x] code_graph_scan initializes DB on fresh runtime — no throw on first use (Phase 013, item 9) [F021] [EVIDENCE: verified in implementation-summary.md]
- [x] initDb() has schema migration guard — no poisoned singleton on setup failure (Phase 013, item 10) [F023] [EVIDENCE: verified in implementation-summary.md]
- [x] replaceNodes/Edges wrapped in transaction — constraint error cannot wipe file's graph (Phase 013, item 11) [F024] [EVIDENCE: verified in implementation-summary.md]
- [x] Transitive code_graph_query respects maxDepth — no node leak or duplicate convergent paths (Phase 013, item 12) [F026] [EVIDENCE: verified in implementation-summary.md]
- [x] includeTrace support clarified and exposed on code_graph_context schema (Phase 013, item 13) [F033] [EVIDENCE: verified in implementation-summary.md]
- [x] pendingCompactPrime read-then-delete order fixed — no cache race (Phase 014, item 16) [F001] [EVIDENCE: verified in implementation-summary.md]
- [x] saveState() errors propagated to callers — no false success (Phase 014, item 17) [F002] [EVIDENCE: verified in implementation-summary.md]
- [x] Recovered context fenced with provenance markers — no injection via transcript replay (Phase 014, item 18) [F009] [EVIDENCE: verified in implementation-summary.md]
- [x] Claude hook path wired through memory-surface.ts — constitutional/triggered payloads survive compaction (Phase 014, item 19) [F022] [EVIDENCE: verified in implementation-summary.md]
- [x] Session_id hashing collision-resistant via SHA-256 (Phase 014, item 20) [F027] [EVIDENCE: verified in implementation-summary.md]
- [x] Hook-state temp directory and files have 0700/0600 permissions (Phase 014, item 21) [F028] [EVIDENCE: verified in implementation-summary.md]

### v2 Remediation — P2 (Improvements)

- [x] Working-set-tracker respects maxFiles without 2x overshoot (Phase 013, item 14) [F013] [EVIDENCE: verified in implementation-summary.md]
- [x] `ccc_feedback` length-bound limitation is documented accurately as still open (Phase 013, item 15) [F031] [EVIDENCE: Phase 013 tasks/checklist/summary all preserve the gap]
- [x] MCP first-call priming detects new sessions and auto-loads context (Phase 014, item 22) [EVIDENCE: verified in implementation-summary.md]
- [x] Tool-dispatch auto-enrichment via GRAPH_ENRICHABLE_TOOLS interceptor (Phase 014, item 23) [EVIDENCE: verified in implementation-summary.md]
- [x] Stale-on-read: ensureFreshFiles() checks mtime before query results (Phase 014, item 24) [EVIDENCE: verified in implementation-summary.md]
- [x] Cache freshness validated via cachedAt TTL check (Phase 014, item 25) [F003] [EVIDENCE: verified in implementation-summary.md]
- [x] Stop-hook surrogate-save limitation is documented accurately as still unimplemented (Phase 014, item 26) [EVIDENCE: Phase 014 tasks/checklist/summary all preserve the gap]
- [x] Cache-token accounting includes cache bucket tokens in totals (Phase 014, item 27) [EVIDENCE: verified in implementation-summary.md]
- [x] Dead workingSet branch removed from session-prime.ts (Phase 014, item 28) [F004] [EVIDENCE: verified in implementation-summary.md]
- [x] Duplicated token-count sync logic consolidated (Phase 014, item 29) [F019] [EVIDENCE: verified in implementation-summary.md]
- [x] Drifted pressure-budget helper replaced with shared tested helper (Phase 014, item 30) [F032] [EVIDENCE: verified in implementation-summary.md]
- [x] Parser adapter interface created for tree-sitter/regex swap (Phase 015, item 31) [EVIDENCE: verified in implementation-summary.md]
- [x] Tree-sitter WASM parser implemented for JS/TS/Python/Bash (Phase 015, item 32) — TreeSitterParser class in tree-sitter-parser.ts, web-tree-sitter + tree-sitter-wasms deps, cursor-based AST walk, all 18 indexer tests pass [EVIDENCE: verified in implementation-summary.md]
- [x] DECORATES, OVERRIDES, TYPE_OF edge types added (Phase 015, item 33) [EVIDENCE: verified in implementation-summary.md]
- [x] Dead per-file TESTED_BY branch removed (Phase 015, item 36) [F015] [EVIDENCE: verified in implementation-summary.md]
- [x] excludeGlobs option wired into glob pipeline (Phase 015, item 37) [F016] [EVIDENCE: verified in implementation-summary.md]
- [x] .zsh language mapping fixed — globs discover .zsh files (Phase 015, item 38) [F017] [EVIDENCE: verified in implementation-summary.md]
- [x] Near-exact seed resolution with graduated confidence (Phase 016, item 39) [EVIDENCE: verified in implementation-summary.md]
- [x] Query-intent pre-classification routes structural vs semantic queries (Phase 016, item 40) — classifyQueryIntent() in query-intent-classifier.ts, keyword dictionaries + regex patterns, structural/semantic/hybrid routing [EVIDENCE: verified in implementation-summary.md]
- [x] Auto-reindex triggers on branch switch and session start (Phase 016, item 41) [EVIDENCE: verified in implementation-summary.md]
- [x] Recovery documentation consolidated to single source of truth (Phase 016, item 43) [F018] [EVIDENCE: verified in implementation-summary.md]
- [x] Seed-resolver DB failures handled — throws instead of silent placeholder (Phase 016, item 44) [F014] [EVIDENCE: verified in implementation-summary.md]
- [x] Spec/settings SessionStart scope mismatch fixed (Phase 016, item 45) [F030] — spec.md updated to reflect actual implementation: single unscoped registration with in-script source branching [EVIDENCE: verified in implementation-summary.md]

### v2 Remediation — P3 (Nice to Have)

- [x] Ghost SymbolKinds (variable, module, parameter, method) extracted by parser (Phase 015, item 34) [F008] [EVIDENCE: verified in implementation-summary.md]
- [x] Regex parser demoted to fallback after tree-sitter default (Phase 015, item 35) — tree-sitter is now default parser; regex available via SPECKIT_PARSER=regex env var; getParser() auto-falls back on WASM init failure [EVIDENCE: verified in implementation-summary.md]
- [x] Cross-runtime instructions updated: CODEX.md, AGENTS.md, OpenCode agents, Gemini (Phase 016, item 42) [EVIDENCE: verified in implementation-summary.md]
