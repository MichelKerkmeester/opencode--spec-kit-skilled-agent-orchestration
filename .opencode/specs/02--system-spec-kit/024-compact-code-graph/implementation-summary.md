---
title: "Implementation Summary: Hybrid Context Injection [02--system-spec-kit/024-compact-code-graph]"
description: "24-phase hybrid context injection system: Claude hooks, code graph, CocoIndex bridge, cross-runtime fallback, v2 remediation (41/45 items), and hookless priming optimization."
trigger_phrases:
  - "implementation"
  - "summary"
  - "hybrid"
  - "context"
  - "injection"
  - "024"
  - "compact"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 02--system-spec-kit/024-compact-code-graph |
| **Started** | 2026-03-29 |
| **Completed** | 2026-03-31 (v1+v2+v3; 4 items deferred) |
| **Level** | 3 |
| **Phases** | 24 (001-024) |
| **Total LOC** | ~3,500+ across all phases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Context compaction in long AI coding sessions no longer causes knowledge loss. The system now automatically preserves and restores critical context at every lifecycle boundary -- compaction, session start, resume, and stop -- across Claude Code (via hooks) and all other runtimes (via MCP-level auto-priming). A structural code graph provides "what connects to what" alongside CocoIndex's "what resembles what", and a 3-source budget allocator merges memory, structural, and semantic context within a 4000-token budget.

### Layer 1: Claude Code Hooks (Phases 001-003)

Three hook scripts handle the full Claude Code lifecycle. `compact-inject.ts` (PreCompact) precomputes critical context and caches it to a temp file. `session-prime.ts` (SessionStart) reads that cache on `source=compact` and injects it via stdout; on `source=startup|resume|clear` it primes sessions with memory context, code graph status, and spec folder continuity. `session-stop.ts` (Stop, async) parses the transcript JSONL for token usage and saves session state. Per-session state at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json` bridges Claude's session_id to Spec Kit's effectiveSessionId.

### Layer 2: Cross-Runtime Fallback (Phases 004-007)

All runtimes that read CLAUDE.md/CODEX.md/GEMINI.md get context injection via the existing Gate 1 system. `memory_match_triggers()` fires on each user message. After compaction, instruction files direct the AI to call `memory_context({ mode: "resume", profile: "resume" })`. `.claude/CLAUDE.md` was created with Claude-specific recovery instructions. Runtime detection outputs both `runtime` and `hookPolicy` fields.

### Layer 3: Structural Code Graph (Phases 008-011)

A regex-based structural indexer (later upgraded to tree-sitter WASM default in v2/v3) extracts symbols from JS/TS/Python/Shell files. SQLite stores nodes and edges (CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, DECORATES, OVERRIDES, TYPE_OF) in `code-graph.sqlite`. Three MCP tools expose the graph: `code_graph_scan` (build/refresh), `code_graph_query` (outline, calls_from, calls_to, imports), `code_graph_status` (freshness, coverage). `code_graph_context` accepts CocoIndex file-range seeds and resolves them to graph neighborhoods with budget enforcement.

### Layer 4: CocoIndex Integration (Phase 012)

CocoIndex (already deployed as MCP server with `search` tool) provides semantic code search via vector embeddings across 28+ languages. The integration wires CocoIndex results as seeds for code graph structural expansion. Query-intent routing distinguishes structural queries (code_graph) from semantic queries (CocoIndex) from session queries (Memory).

### Layer 5: 3-Source Compaction Merge (Phase 011)

A working-set tracker records files and symbols touched during the session. The budget allocator splits the compaction budget across sources using reserved floors with a shared overflow pool: constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800 tokens. Priority order: constitutional > code graph > CocoIndex > triggered. When a source returns nothing, its floor flows to overflow.

### v2 Remediation (Phases 013-016)

A 95-iteration deep research and 30-iteration deep review (Codex CLI + Copilot CLI, GPT-5.4) identified 45 issues. Sixteen parallel Codex CLI agents implemented fixes in 5 waves:

- **Phase 013** (15 items): endLine brace-counting fix, DB init guard, schema migration safety, transaction atomicity for replaceNodes/Edges, budget allocator ceiling removal, query maxDepth leak fix, input validation widened to all tool args, exception string sanitization.
- **Phase 014** (14 items): pendingCompactPrime race fix, saveState error propagation, provenance fencing for injection safety, session_id SHA-256 hashing, 0700/0600 file permissions, dead code removal, duplicated logic consolidation.
- **Phase 015** (6/8 items): Parser adapter interface, DECORATES/OVERRIDES/TYPE_OF edges, ghost SymbolKinds, dead TESTED_BY branch removal, excludeGlobs wiring, .zsh mapping fix. Deferred: tree-sitter WASM parser, regex removal.
- **Phase 016** (6/8 items): Near-exact seed resolution, auto-reindex triggers, cross-runtime instruction updates, recovery doc consolidation, seed-resolver DB failure handling. Deferred: intent pre-classifier, SessionStart scope fix.

### v3 Polish (Phases 017-024)

- **Phase 017**: Fixed 12/15 tree-sitter parser and classifier bugs (abstract methods, class expressions, multi-import, init poisoning recovery, confidence scaling).
- **Phase 018**: MCP first-call auto-priming for hookless runtimes. Session_health tool for stale context detection.
- **Phase 019**: `ensureCodeGraphReady()` auto-trigger on branch switch, session start, and stale detection.
- **Phase 020**: Query-intent auto-routing in `memory_context`. `session_resume` composite tool for one-call resume.
- **Phase 021**: "No Hook Transport" sections in CODEX.md, AGENTS.md, GEMINI.md. `@context-prime` agent for OpenCode.
- **Phase 022**: Gemini CLI hook porting -- PreCompress/BeforeAgent lifecycle mapping.
- **Phase 023**: Session metrics collector, bootstrap quality scoring, dashboard via eval_reporting_dashboard.
- **Phase 024**: `session_bootstrap` composite tool, `getSessionSnapshot()`, bootstrap telemetry, urgency-aware skip logic.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded in three waves. v1 phases (001-012) were built sequentially over the initial design period, with each phase tested independently before proceeding. v2 remediation (013-016) was executed by 16 parallel Codex CLI agents (GPT-5.4, high reasoning effort) in 5 simultaneous waves, completing 41/45 items in a single session. v3 phases (017-024) were implemented in a follow-up cycle addressing polish, cross-runtime parity, and observability gaps. Each phase has its own child spec folder with spec.md, plan.md, checklist.md, and implementation-summary.md. Verification was performed via vitest test suites (code-graph-indexer, crash-recovery, budget-allocator, compact-merger) and ESLint on all modified TypeScript files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| # | Decision | Why |
|---|----------|-----|
| DR-001 | Reject Dual-Graph (Codex-CLI-Compact) | Proprietary core (Cython), CLAUDE.md auto-generation conflict, telemetry with no opt-out, single maintainer |
| DR-002 | Hybrid hook + tool architecture | Hooks for reliability on Claude Code; tool fallback for universal runtime support |
| DR-003 | Direct import over MCP call for hooks | Hook scripts must complete in <2s; MCP call adds network overhead |
| DR-006 | PreCompact precompute + SessionStart inject | PreCompact stdout is NOT injected per Claude docs; two-step cache model required |
| DR-007 | Pass `profile: "resume"` everywhere | Without it, hook scripts get verbose search results that break the 4000-token budget |
| DR-010 | CocoIndex as complementary semantic layer | CocoIndex handles embeddings/vectors; code graph stays purely structural |
| DR-012 | Floors + overflow pool budget allocation | Fixed splits waste budget; pure pooling risks starving constitutional memories |
| DR-013 | Brace-counting heuristic before tree-sitter | 60 LOC vs 200+ LOC with WASM dependencies; sufficient for regex parser phase |
| DR-014 | Tree-sitter WASM with regex fallback | 99% parse accuracy via adapter pattern; regex stays as permanent fallback |
| DR-015 | MCP first-call priming for all runtimes | Works on all 5 runtimes without hooks; achieves ~85-90% parity with Claude hooks |
| DR-016 | 45-item remediation scope expansion | 30-iteration review found 19 additional issues beyond the initial 26 |

Full decision record: see `decision-record.md` (16 decisions, DR-001 through DR-016).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| v1 phases 001-012 | All 12 phases implemented, child spec folders verified |
| v2 phase 013 checklist | PASS — 15/15 items, 20/20 checklist entries |
| v2 phase 014 checklist | PASS — 14/14 items |
| v2 phase 015 checklist | PARTIAL — 6/8 items (2 deferred: WASM parser, regex removal) |
| v2 phase 016 checklist | PARTIAL — 6/8 items (2 deferred: intent classifier, scope fix) |
| v3 phases 017-024 | All 8 phases implemented with implementation summaries |
| vitest suites | PASS — code-graph-indexer (18), crash-recovery (36), budget-allocator (15), compact-merger (15) |
| ESLint | PASS on all modified TypeScript files (0 errors) |
| Root checklist (v1 + v2) | All P0 items PASS, all P1 items PASS, P2 items PASS with noted partials |
| Deep review verdict | CONDITIONAL (0 P0, 16 P1 addressed, 16 P2 addressed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **4 deferred items remain.** Tree-sitter WASM parser (item 32), regex removal (item 35), intent pre-classifier (item 40), and SessionStart scope fix (item 45) are blocked on external dependencies. Tracked in tasks.md.
2. **Regex parser is still available.** Tree-sitter is the default parser, but the regex fallback remains via `SPECKIT_PARSER=regex` env var. Brace-counting for endLine is approximate -- string literals with `{`/`}` can shift the count.
3. **Compaction pipeline emits CocoIndex follow-up guidance, not retrieved results.** The 3-source merge includes semantic neighbor suggestions rather than fetched CocoIndex content.
4. **Working-set tracker exists but compaction still relies on transcript heuristics.** The tracker feeds priority ranking but the active path uses transcript-based attention signals.
5. **MCP-level compaction detection is not implementable** without runtime SDK changes. Deferred indefinitely.
6. **Pre-existing TypeScript errors** in `memory-search.ts` and `shadow-evaluation-runtime.ts` prevent `npm run build` from passing clean. Unrelated to spec 024.
<!-- /ANCHOR:limitations -->
