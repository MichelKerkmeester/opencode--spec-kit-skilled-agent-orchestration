---
title: "Plan: Hybrid Context Injection — Hook + Tool Architecture [02--system-spec-kit/024-compact-code-graph/plan]"
description: "Phased approach: each phase is independently deployable and testable. Phase 1 (Compaction Context Injection) delivers the highest-value feature immediately."
trigger_phrases:
  - "plan"
  - "hybrid"
  - "context"
  - "injection"
  - "hook"
  - "024"
  - "compact"
importance_tier: "important"
contextType: "planning"
---
# Plan: Hybrid Context Injection — Hook + Tool Architecture

## Implementation Strategy

Phased approach: each phase is independently deployable and testable. Phase 1 (Compaction Context Injection) delivers the highest-value feature immediately.

**CORRECTED (iteration 011, 014):** PreCompact stdout is NOT injected into model context. The design uses PreCompact for precomputation and SessionStart(source=compact) for injection.

## Implementation Order

1. **Immediate**: Fix `/spec_kit:resume` `profile: "resume"` (1 hour)
2. **Phase 1+2**: Hook scripts (PreCompact + SessionStart) with hook-state bridge (1 week)
3. **Phase 4**: `.claude/CLAUDE.md` + CLAUDE.md compaction section (2 days)
4. **Phase 008**: tree-sitter structural indexer for JS/TS/Python/Shell (3-4 days)
5. **Phase 009**: SQLite storage + code_graph_scan/query/status tools (2-3 days)
6. **Phase 010**: code_graph_context + CocoIndex bridge (3-4 days)
7. **Phase 011**: Working-set tracking + 3-source compaction merge (2-3 days)
8. **Phase 3**: Stop hook + token tracking (1 week)
9. **Phase 5-7**: Agent/command alignment, documentation, testing (2 weeks)

## Phase Overview

### Phase 1: Compaction Context Injection (P0 — 2-3 days)
**Goal:** Automatically inject critical context when Claude Code compacts the conversation.

**Two-step flow (corrected per iteration 011):**
1. `PreCompact` hook → `compact-inject.ts` precomputes context, caches to temp file
2. `SessionStart(source=compact)` hook → `session-prime.ts` reads cache, outputs to stdout

**What exists:**
- `autoSurfaceAtCompaction(sessionContext, options)` in `hooks/memory-surface.ts`
- `COMPACTION_TOKEN_BUDGET = 4000` tokens
- Constitutional memories auto-surface infrastructure
- `context-server.ts` already treats `memory_context(resume)` as compaction lifecycle call (iter 012)

**What to build:**
- `scripts/hooks/claude/compact-inject.ts` — PreCompact precompute + cache
- `scripts/hooks/claude/session-prime.ts` — SessionStart injection (handles both compact and startup)
- `scripts/hooks/claude/shared.ts` — Common utilities (stdin parsing, error handling)
- `scripts/hooks/claude/hook-state.ts` — Per-session state management
- Register hooks in `.claude/settings.local.json`

**Key finding (iteration 012):** `memory_context({ mode: "resume" })` returns search results, not a compact brief. Must ALSO pass `profile: "resume"` for the brief `{ state, nextSteps, blockers }` format.

**Hook state (iteration 014):** Per-session state at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json` bridges Claude's `session_id` → Spec Kit's `effectiveSessionId`, stores `pendingCompactPrime`, and tracks transcript deltas.

### Phase 2: SessionStart Hook (P1 — 1-2 days)
**Goal:** Auto-prime every new Claude Code session with relevant prior context.

**Shares `session-prime.ts` with Phase 1** — the same script handles both:
- `source=compact` → reads cached compact payload, injects
- `source=startup` → calls `memory_context({ mode: "resume", profile: "resume" })`
- `source=resume` → loads resume context with session continuity

**Design considerations (iteration 013):**
- Keep one retrieval contract across all runtimes — hooks call same tools as manual flows
- `/spec_kit:resume` remains the canonical continuation surface
- Token budget: ~2000 tokens (don't overwhelm the initial prompt)

### Phase 3: Stop Hook + Token Tracking (P2 — 2-3 days)
**Goal:** Auto-save session context and track token usage on session end.

**What to build:**
- `scripts/hooks/claude/session-stop.ts` — Async Stop hook
- `scripts/hooks/claude/claude-transcript.ts` — Transcript JSONL parser

**Stop hook input (iteration 011):** `transcript_path`, `stop_hook_active`, `last_assistant_message`
Token totals are NOT in the payload — must parse transcript JSONL.

**Token storage (iteration 015):** New `session_token_snapshots` table (not overloading `consumption_log`):
```sql
CREATE TABLE session_token_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  runtime TEXT NOT NULL,
  spec_folder TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  cache_creation_tokens INTEGER,
  cache_read_tokens INTEGER,
  total_tokens INTEGER,
  estimated_cost_usd REAL,
  captured_at TEXT NOT NULL
);
```

**Design: Append-only snapshots** (not mutable session rows) because Stop hooks can fire multiple times per session and resume flows are easier to debug.

### Phase 4: Cross-Runtime Fallback (P1 — 1-2 days)
**Goal:** Ensure all runtimes get context injection via tool-based approach.

**Runtime detection (iteration 015):** Two outputs, not one:
- `runtime`: `claude-code | codex-cli | copilot-cli | gemini-cli | unknown`
- `hookPolicy`: `enabled | disabled_by_scope | unavailable | unknown`

**What to update:**
- CLAUDE.md: Enhance compaction recovery with explicit `memory_context({ mode: "resume", profile: "resume" })`
- CODEX.md: Add equivalent recovery instructions
- Gate 1: Ensure `memory_match_triggers()` fires post-compaction
- Close Gap B (iteration 012): Create `.claude/CLAUDE.md` with Claude-specific recovery

**Validation (iteration 015):** 7-scenario test matrix across 4 runtimes

### Phase 008: Structural Indexer (P2 — 3-4 days)
**Goal:** Extract structural symbols from JS/TS/Python/Shell via tree-sitter.

**What to build:**
- tree-sitter parser with standardized capture vocabulary (@definition.function, @definition.class, etc.)
- Normalized node/edge extraction pipeline
- Content-hash-based incremental re-indexing
- Parser health metadata (clean parse vs recovered tree)

**LOC estimate:** 300-420 lines

### Phase 009: Code Graph Storage + Query (P2 — 2-3 days)
**Goal:** SQLite schema and MCP query tools for structural relationships.

**What to build:**
- `code-graph.sqlite` with `code_files`, `code_nodes`, `code_edges` tables
- Edge vocabulary: CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS
- `code_graph_scan` MCP tool (build/refresh index)
- `code_graph_query` MCP tool (outline, calls_from, calls_to, imports_from, imports_to)
- `code_graph_status` MCP tool (freshness, coverage, errors)
- Directional indexes for hot queries

**LOC estimate:** 220-320 lines

### Phase 010: CocoIndex Bridge + code_graph_context (P2 — 3-4 days)
**Goal:** LLM-oriented compact graph neighborhoods with CocoIndex seed support.

**What to build:**
- `code_graph_context` MCP tool with 3 query modes (neighborhood, outline, impact)
- CocoIndex seed normalization (file:line → graph node resolution)
- Seed resolution: exact symbol → enclosing symbol → file anchor
- Reverse semantic augmentation (graph neighborhoods → scoped CocoIndex queries)
- Budget enforcement within tool (accept budgetTokens parameter)
- Compact repo-map style output with CocoIndex-boosted ranking

**LOC estimate:** 330-460 lines

### Phase 011: Compaction Working-Set Integration (P2 — 2-3 days)
**Goal:** Wire code graph + CocoIndex into the compaction pipeline.

**What to build:**
- Session working-set tracker (files/symbols touched during session)
- 3-source merge: Memory + CocoIndex + Code Graph under 4000-token budget
- Token budget allocator: floors + overflow pool (constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800)
- Priority order: constitutional > code graph > CocoIndex > triggered
- Structured output sections for merged compact brief
- Mixed-freshness coordination and metadata

**LOC estimate:** 200-300 lines

## File Locations (iteration 014)

```
.opencode/skill/system-spec-kit/scripts/hooks/claude/
  session-prime.ts       ← Phases 1+2 (SessionStart injection)
  compact-inject.ts      ← Phase 1 (PreCompact precompute)
  session-stop.ts        ← Phase 3 (Stop: save + tokens)
  shared.ts              ← Common utilities
  hook-state.ts          ← Session ID mapping, cache
  claude-transcript.ts   ← Transcript parsing

Compiled → scripts/dist/hooks/claude/*.js

.opencode/skill/system-spec-kit/mcp_server/api/
  hooks.ts               ← Hook-safe public API bridge

.claude/
  settings.local.json    ← Hook registration (Phases 1-3)

CLAUDE.md                ← Phase 4 updates
```

---

## v2 Remediation Phases (013-016)

Post-implementation review (30 iterations across Codex CLI + Copilot CLI, GPT-5.4) and research (95 iterations, 3 AI systems) identified 45 issues organized into 4 remediation phases. **Implementation completed 2026-03-31** via 16 parallel Codex CLI agents (GPT-5.4, high reasoning) in 5 waves. 41/45 items shipped; 4 deferred (external dependencies).

### Phase 013: Correctness & Boundary Repair (P0/P1/P2 — 3-4 days)
**Goal:** Fix all critical bugs, DB safety issues, and security boundaries before new feature work.

**Items (15):**
1. endLine fix in structural-indexer.ts — brace-counting heuristic for JS/TS, indentation for Python, marker for Bash
2. Resume profile:"resume" fix
3. Seed identity preservation in code_graph_context handler
4. Tool arg validation via schema validators (widened from rootDir-only) [F010]
5. Exception string sanitization in handlers
6. Orphan edge cleanup wiring in replaceNodes()
7. Budget allocator 4000-token ceiling removal + sessionState budgeting [F011, F020]
8. Merger zero-budget section rendering fix
9. **NEW:** DB init guard — code_graph_scan must not throw on fresh runtime [F021]
10. **NEW:** initDb() schema migration guard — prevent poisoned singleton on failure [F023]
11. **NEW:** Wrap replaceNodes/Edges in transaction — atomic delete+insert [F024]
12. **NEW:** Fix transitive query maxDepth leak + deduplicate convergent paths [F026]
13. **NEW:** Implement or remove includeTrace from schema + handler [F033]
14. **NEW:** Fix working-set-tracker maxFiles overshoot [F013]
15. **NEW:** Validate ccc_feedback schema length bounds before disk write [F031]

**LOC estimate:** 190-265 | **Dependencies:** None | **Risk:** LOW-MEDIUM | **Status:** COMPLETE (15/15)

### Phase 014: Hook Durability & Auto-Enrichment (P1/P2 — 5-6 days)
**Goal:** Fix hook reliability and security bugs, add automatic context loading.

**Items (14):**
16. Fix pendingCompactPrime delete-before-read race [F001]
17. Propagate saveState() errors [F002]
18. **NEW:** Fence recovered context with provenance markers (injection safety) [F009]
19. **NEW:** Wire Claude hook path through memory-surface.ts (constitutional/triggered survive compaction) [F022]
20. **NEW:** Collision-resistant session_id hashing or exact-match on state load [F027]
21. **NEW:** Set 0700/0600 permissions on hook-state temp directory and files [F028]
22. MCP first-call priming (T1.5 universal session detection)
23. Tool-dispatch auto-enrichment (GRAPH_AWARE_TOOLS interceptor)
24. Stale-on-read mechanism (ensureFreshFiles with mtime fast-path)
25. Cache freshness validation (cachedAt TTL check) [F003]
26. Stop-hook surrogate save redesign
27. Cache-token bucket accounting
28. **NEW:** Remove dead workingSet branch [F004]
29. **NEW:** Consolidate duplicated token-count sync logic [F019]
30. **NEW:** Replace drifted pressure-budget helper with shared tested helper [F032]

**LOC estimate:** 371-499 | **Dependencies:** Phase 013 | **Risk:** MEDIUM | **Status:** COMPLETE (14/14)

### Phase 015: Tree-Sitter WASM Migration (P2/P3 — 3-4 days)
**Goal:** Replace regex parser with tree-sitter WASM for 99% parse accuracy. Clean up dead code paths.

**Items (8):**
31. Parser adapter interface (ParseResult stays parser-agnostic)
32. Tree-sitter WASM implementation (~1.5MB bundle: JS, TS, Python, Bash grammars)
33. New edge types: DECORATES, OVERRIDES, TYPE_OF
34. Extract ghost SymbolKinds (variable, module, parameter, **method**) [F008 adds method]
35. Regex removal (after tree-sitter stable, keep as fallback initially)
36. **NEW:** Remove dead per-file TESTED_BY branch [F015]
37. **NEW:** Wire or remove excludeGlobs option [F016]
38. **NEW:** Fix .zsh language mapping — globs never discover .zsh files [F017]

**LOC estimate:** 220-345 | **Dependencies:** Phase 013 (endLine fix) | **Risk:** HIGH | **Status:** PARTIAL (6/8 done; Items 32, 35 deferred)

### Phase 016: Cross-Runtime UX & Documentation (P2/P3 — 2-3 days)
**Goal:** Achieve ~85-90% context preservation parity across all 5 runtimes. Fix spec/settings mismatches.

**Items (8):**
39. Near-exact seed resolution + CocoIndex score propagation
40. Query-intent pre-classification with confidence fallback
41. Auto-reindex triggers (branch switch, session start, debounced save)
42. Cross-runtime agent instruction updates (CODEX.md, AGENTS.md, OpenCode agents, Gemini)
43. Recovery documentation consolidation (single source of truth) [F018]
44. **NEW:** Fix seed-resolver silent DB failure → placeholder anchor [F014]
45. **NEW:** Fix spec/settings SessionStart scope mismatch [F030]
46. **TRUTH-SYNC:** Downgrade checklist claims for phases 005/006/008/011/012 per review findings

**LOC estimate:** 130-208 | **Dependencies:** Phase 014 (MCP first-call priming) | **Risk:** LOW | **Status:** PARTIAL (6/8 done; Items 40, 45 deferred)

### v2 Dependency Graph

```
Phase 013 (P0/P1 fixes, no deps)
    ├── Phase 014 (hook durability + auto-enrichment)
    │       └── Phase 016 (cross-runtime UX)
    └── Phase 015 (tree-sitter migration, independent of 014)
```

**Critical path:** 013 → 014 → 016
**Parallel path:** 015 can run alongside 014

### v2 Deferred Items (4)

| Item | Phase | Dependency | Estimated LOC |
|------|-------|------------|---------------|
| 32: Tree-sitter WASM | 015 | `web-tree-sitter` npm package + WASM grammars | 200-280 |
| 35: Regex removal | 015 | Item 32 stable in production | -120 to -150 |
| 40: Intent pre-classifier | 016 | CocoIndex API relevance scoring | 60-100 |
| 45: SessionStart scope | 016 | settings.local.json schema investigation | 5-20 |

<!-- ANCHOR:dependencies -->
## Dependencies

### v1 Phases (001-012) — Complete
- Phase 1 has no dependencies — can start immediately
- Phase 2 shares `session-prime.ts` with Phase 1 (tight coupling)
- Phase 3 depends on Phase 1 patterns + transcript parsing
- Phase 4 can run in parallel with Phases 1-3
- Code Graph MVP depends on Phases 1-2 patterns; can start after Phase 2
- CocoIndex bridge is independent — CocoIndex already deployed as MCP server

### v2 Phases (013-016) — Pending
- Phase 013 has no dependencies — can start immediately (all P0/P1 fixes)
- Phase 014 depends on Phase 013 (correctness fixes first)
- Phase 015 depends on Phase 013 (endLine fix enables tree-sitter comparison testing)
- Phase 016 depends on Phase 014 (MCP first-call priming enables cross-runtime UX)
<!-- /ANCHOR:dependencies -->

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Hook script timeout | Keep scripts fast (<2s), direct imports not MCP calls |
| MCP server not running | Graceful fallback — empty output, don't block Claude |
| Token budget overflow | Hard cap at COMPACTION_TOKEN_BUDGET (4000 tokens) |
| Cross-runtime divergence | CLAUDE.md instructions work everywhere as baseline |
| Settings.local.json conflict | Merge-safe registration (user already has hooks at `~/.claude/settings.json`) |
| `profile: "resume"` not passed | Explicitly pass in all hook scripts (gap found in iter 012) |
| Session ID mismatch | Hook-state maps Claude `session_id` → Spec Kit `effectiveSessionId` |
| CocoIndex unavailable | Code graph still provides structural context independently; graceful degradation |
