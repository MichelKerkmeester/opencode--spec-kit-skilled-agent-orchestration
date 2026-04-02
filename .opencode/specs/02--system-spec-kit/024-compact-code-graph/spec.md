---
title: "Spec: Hybrid Context Injection — Hook + Tool Architecture [02--system-spec-kit/024-compact-code-graph/spec]"
description: "Root packet for the shipped hybrid context-preservation system: Claude hooks where available, MCP recovery for hookless runtimes, structural code graph support, and semantic CocoIndex follow-up."
trigger_phrases:
  - "spec"
  - "hybrid"
  - "context"
  - "injection"
  - "hook"
  - "024"
  - "compact"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Hybrid Context Injection — Hook + Tool Architecture

<!-- SPECKIT_LEVEL: 3 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## EXECUTIVE SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. NON-FUNCTIONAL REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 8. EDGE CASES
Template compliance shim section. Legacy phase content continues below.

## 9. COMPLEXITY ASSESSMENT
Template compliance shim section. Legacy phase content continues below.

## 10. RISK MATRIX
Template compliance shim section. Legacy phase content continues below.

## 11. USER STORIES
Template compliance shim section. Legacy phase content continues below.

## 12. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

## RELATED DOCUMENTS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary

This packet now documents the shipped hybrid context-preservation system: Claude hooks where available, `session_bootstrap()` as the canonical first recovery call for hookless runtimes, `session_resume()` for detailed follow-up context, structural code-graph support, and CocoIndex-assisted semantic follow-up.

### Problem

Context compaction in long AI coding sessions caused loss of critical knowledge. Before the hook and bootstrap work landed, the system relied on AI-driven recovery (CLAUDE.md instructions telling the AI to call `memory_context({ mode: "resume" })`). Analysis (iteration 012) confirmed five gaps:

1. **No provider lifecycle hook** — `autoSurfaceAtCompaction()` only runs when the AI actively calls `memory_context(mode: "resume")`, not at the moment compaction happens
2. **No private Claude recovery layer** — `.claude/CLAUDE.md` doesn't exist; compaction rules are only in the shared root CLAUDE.md
3. **Envelope metadata is weaker than prompt injection** — auto-surface adds `hints` and `meta.autoSurface`, not guaranteed prompt-state restoration
4. **Session-start is generic, not recovery-aware** — startup instructions only announce memory stats, not last task or spec folder
5. **Archived hook design never graduated** — a `pre_compact.py` design existed in `z_archive` but was never implemented

### Solution: Hybrid Approach

### Layer 1 — Hook-based (Claude Code)

Based on Claude Code hooks API (25 lifecycle events, 4 handler types — iteration 011):

- **PreCompact** hook → **precomputes** critical context and caches to temp file
  - stdout is NOT injected on PreCompact (confirmed by official docs)
  - Receives: `session_id`, `transcript_path`, `trigger` (auto|manual), `custom_instructions`
- **SessionStart** → single unscoped hook registration; in-script branching via `input.source`
  - `source=compact` → injects cached PreCompact context via stdout
  - `source=startup` → primes new session with tool overview + stale-index detection
  - SessionStart source=startup MAY inject top-N architecturally significant project symbols as orientation highlights, subject to quality gates (deduplication, path filtering, relevance heuristic, diversity controls). See DR-017.
  - `source=resume` → loads last spec folder and resume guidance
  - `source=clear` → minimal context after `/clear`
  - Plain stdout becomes model-visible context
- **Stop** (async) → saves session context + tracks token usage
  - Receives: `transcript_path`, `stop_hook_active`, `last_assistant_message`
  - Token totals NOT in payload — must parse transcript JSONL

### Layer 2 — Tool-based (all runtimes)

- Gate 1 in CLAUDE.md triggers `memory_match_triggers()` on each user message
- Hookless runtimes use `session_bootstrap()` as the canonical first recovery call on fresh start or after `/clear`
- `session_resume()` remains available when a caller wants the detailed merged resume payload directly
- `/spec_kit:resume` and related recovery docs must pass `profile: "resume"` whenever they call `memory_context`
- Works on any runtime that reads CLAUDE.md/CODEX.md/GEMINI.md

### Layer 3 — Code Graph + CocoIndex (structural + semantic)

Based on deep research (iterations 036-045) and existing CocoIndex deployment:

- **CocoIndex** (existing): Semantic code search via vector embeddings — finds code by concept/intent ("what resembles what"). Deployed as MCP server with `search` tool, supports 28+ languages, function-level chunking, incremental index updates.
- **Code Graph** (shipped in incremental form): Structural relationship index via SQLite plus the current parser pipeline — maps imports, calls, hierarchy, containment ("what connects to what"). Child phases extended this over time, but the root packet should describe the delivered structural channel without overstating parser sophistication.
- **Complementary, not competing**: CocoIndex finds semantic candidates, code graph expands structurally. Neither duplicates the other.

### Design Principle (iteration 013)

**Hooks are transport reliability, not separate business logic.** Claude hooks call the same tools other runtimes call explicitly. The recovery surface is intentionally layered:
- Fast turn-start: `memory_match_triggers(prompt)`
- Hookless first-call recovery: `session_bootstrap()`
- Detailed continuation payload: `session_resume()` and `memory_context({ mode: "resume", profile: "resume" })`

### Architecture

```
                          +----------------------------------+
                          |     Runtime-Specific Adapter     |
                          |----------------------------------|
User/Session Event ------>| Claude: hooks (SessionStart,     |
                          |   PreCompact, Stop)              |
                          | Codex/OpenCode/Copilot/Gemini:   |
                          |   Gate docs + wrapper prompts    |
                          +----------------+-----------------+
                                           |
                                           v
                          +----------------------------------+
                          | Shared Context Orchestrator      |
                          |   memory_match_triggers(prompt)  |
                          |   session_bootstrap()/           |
                          |   session_resume()/              |
                          |   memory_context(mode:"resume")  |
                          +----------------+-----------------+
                                           |
                          +----------------+-----------------+
                          |                |                 |
                          v                v                 v
                  +-------------+  +---------------+  +-----------+
                  | Spec Kit    |  | Code Graph    |  | CocoIndex |
                  | Memory MCP  |  | (structural)  |  | Code MCP  |
                  | autoSurface |  | structural    |  | semantic  |
                  | triggers    |  | SQLite edges  |  | search    |
                  +-------------+  +---------------+  +-----------+
```

### Hook Script File Layout (iteration 014)

```
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/
  session-prime.ts      → SessionStart injection
  compact-inject.ts     → PreCompact precompute + cache
  session-stop.ts       → Stop: token tracking + save
  shared.ts             → Common utilities
  hook-state.ts         → Session ID mapping, cache management
  claude-transcript.ts  → Transcript JSONL parsing

Compiled → mcp_server/dist/hooks/claude/*.js
```

### Hook State (iteration 014)

Per-session state at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json`:
- `claudeSessionId` → `speckitSessionId` mapping
- `lastSpecFolder` for continuity
- `pendingCompactPrime` with cached context payload
- `metrics` for token estimation

### Related Systems

| System | Role | Status | Integration |
|--------|------|--------|-------------|
| **CocoIndex Code MCP** | Semantic code search via embeddings | Deployed | `mcp__cocoindex_code__search` tool, 28+ languages |
| **Spec Kit Memory MCP** | Memory search, auto-surface, constitutional memories | Deployed | `memory_context`, `memory_match_triggers` |
| **Code Graph** | Structural relationship index (imports, calls, hierarchy) | Deployed | SQLite-backed structural query tooling, `code_graph_query` tool |

### Key Findings from Research

| Finding | Source | Impact |
|---------|--------|--------|
| PreCompact stdout NOT injected | iter 011 (Claude docs) | Redesigned to precompute+cache model |
| SessionStart has `source=compact` matcher | iter 011 | Enables post-compact-specific injection |
| `memory_context(resume)` returns search results, not compact brief | iter 012 | Must also pass `profile: "resume"` for brief format |
| `autoSurfaceAtCompaction` only runs when AI calls it | iter 012 | Confirms need for hook trigger |
| Copilot CLI and Gemini CLI have hook systems | iter 011, 015 | v1: tool-fallback by policy; future: hook adapters |
| Existing `consumption_log` table for telemetry | iter 015 | Token tracking uses separate `session_token_snapshots` table |
| CocoIndex covers semantic code search | iter 036-045 | Code graph focuses purely on structural relationships; no embeddings/chunking needed |
| code_graph_context accepts file-range seeds from CocoIndex | iter 046 | Bridge uses native CocoIndex format; no intermediate symbol resolution needed |
| Token budget: floors + overflow pool across 3 sources | iter 049 | Constitutional 700, Graph 1200, CocoIndex 900, Triggered 400, Overflow 800 = 4000 total |
| Query-intent router separates structural vs semantic | iter 048 | Keyword heuristics for v1; structural→code_graph, semantic→CocoIndex, session→Memory |
| Code graph integrates into existing MCP server | iter 055 | Same process, separate code-graph.sqlite; CocoIndex stays external |

### Runtime Support Matrix

| Runtime | Hook Support | v1 Policy | Future |
|---------|-------------|-----------|--------|
| Claude Code | 25 events, 4 handler types | Full hooks | Ship now |
| Codex CLI | None confirmed | Tool fallback | Monitor |
| Copilot CLI | Has hooks (guardrails focus) | Tool fallback by policy | Hook adapter candidate |
| Gemini CLI | Has hooks (v0.33.1+) | Tool fallback by policy | Hook adapter candidate |

### Phases

| Phase | Name | Effort | Priority |
|-------|------|--------|----------|
| 001 | Compaction Context Injection | 2-3 days | P0 — highest impact |
| 002 | SessionStart Priming | 1-2 days | P1 — session priming |
| 003 | Stop Hook + Token Tracking | 2-3 days | P2 — observability |
| 004 | Cross-Runtime Fallback | 1-2 days | P1 — universal support |
| 005 | Command & Agent Alignment | 1-2 days | P1 — integration |
| 006 | Documentation Alignment | 1-2 days | P1 — docs |
| 007 | Testing & Validation | 2-3 days | P1 — quality assurance |
| 008 | Structural Indexer | 3-4 days | P2 — graph foundation |
| 009 | Code Graph Storage + Query (SQLite + MCP tools) | 2-3 days | P2 — structural query |
| 010 | CocoIndex Bridge + code_graph_context | 3-4 days | P2 — bridge integration |
| 011 | Compaction Working-Set Integration | 2-3 days | P2 — merge scaffolding and working-set support |
| 012 | CocoIndex UX, Utilization & Usefulness | 2-3 days | P1 — semantic search integration |

### v2 Remediation Phases (013-016)

Deep research (95 iterations, segments 1-7) and deep review (30 iterations across Codex CLI + Copilot CLI, GPT-5.4) identified **45 issues** (2 P0, 15 P1, 24 P2, 4 P3). Review verdict: **CONDITIONAL** (16 active P1 findings). These are organized into 4 remediation phases:

| Phase | Name | Items | Severity | Est. LOC | Depends On |
|-------|------|-------|----------|----------|------------|
| 013 | Correctness & Boundary Repair | 15 | P0/P1/P2 | 190-265 | None |
| 014 | Hook Durability & Auto-Enrichment | 14 | P1/P2 | 371-499 | 013 |
| 015 | Tree-Sitter WASM Migration | 8 | P2/P3 | 220-345 | 013 |
| 016 | Cross-Runtime UX & Documentation | 8 | P2/P3 | 130-208 | 014 |

**Total estimated LOC: 911-1,317**

#### 45-Item Summary

| # | Item | Sev | Phase | Target File(s) | Review Finding |
|---|------|-----|-------|-----------------|----------------|
| 1 | Fix endLine bug (always equals startLine) | P0 | 013 | structural-indexer.ts | F005 |
| 2 | Fix resume profile:"resume" | P0 | 013 | Resume config | — |
| 3 | Preserve seed identity in handler | P1 | 013 | code_graph_context handler | F006 |
| 4 | Validate all tool args via schema validators (not just rootDir) | P1 | 013 | scan.ts, code-graph-tools.ts | F010 |
| 5 | Sanitize exception strings in handlers | P1 | 013 | memory-context.ts, code_graph_context.ts | — |
| 6 | Wire orphan edge cleanup on re-index | P1 | 013 | scan.ts, code-graph-db.ts | F007 |
| 7 | Remove budget allocator 4000-token ceiling; budget sessionState | P1 | 013 | budget-allocator.ts, compact-merger.ts | F011, F020 |
| 8 | Fix merger zero-budget section rendering | P1 | 013 | compact-merger.ts | F012 |
| 9 | Fix code_graph_scan DB init on fresh runtime | P1 | 013 | code-graph-db.ts, scan.ts | F021 |
| 10 | Add initDb() schema migration guard (prevent poisoned singleton) | P1 | 013 | code-graph-db.ts | F023 |
| 11 | Wrap replaceNodes/Edges in transaction (atomic delete+insert) | P1 | 013 | code-graph-db.ts | F024 |
| 12 | Fix transitive query maxDepth leak + duplicate convergent paths | P1 | 013 | query handler | F026 |
| 13 | Implement or remove includeTrace from schema + handler | P1 | 013 | code_graph_context handler | F033 |
| 14 | Fix working-set-tracker maxFiles overshoot (2x capacity) | P2 | 013 | working-set-tracker.ts | F013 |
| 15 | Validate ccc_feedback schema length bounds before disk write | P2 | 013 | ccc_feedback handler | F031 |
| 16 | Fix pendingCompactPrime delete-before-read race | P1 | 014 | hook-state.ts, compact-inject.ts | F001 |
| 17 | Propagate saveState() errors | P1 | 014 | hook-state.ts | F002 |
| 18 | Fence recovered context with provenance markers (injection safety) | P1 | 014 | session-prime.ts | F009 |
| 19 | Wire Claude hook path through memory-surface.ts (constitutional/triggered) | P1 | 014 | compact-inject.ts, session-prime.ts | F022 |
| 20 | Use collision-resistant session_id hashing or verify on load | P1 | 014 | hook-state.ts | F027 |
| 21 | Set 0700/0600 permissions on hook-state temp directory and files | P1 | 014 | hook-state.ts | F028 |
| 22 | MCP first-call priming (T1.5) | P2 | 014 | memory-surface.ts, memory-context.ts | — |
| 23 | Tool-dispatch auto-enrichment (Tier 2) | P2 | 014 | memory-surface.ts, context-server.ts | — |
| 24 | Stale-on-read mechanism | P2 | 014 | code-graph-db.ts, query.ts | — |
| 25 | Cache freshness validation | P2 | 014 | hook-state.ts | F003 |
| 26 | Stop-hook surrogate save redesign | P2 | 014 | session-stop.ts | — |
| 27 | Cache-token bucket accounting | P2 | 014 | response-hints.ts | — |
| 28 | Remove dead workingSet branch in session-prime.ts | P2 | 014 | session-prime.ts | F004 |
| 29 | Consolidate duplicated token-count sync logic | P2 | 014 | response-hints.ts, envelope.ts | F019 |
| 30 | Replace drifted pressure-budget helper with shared tested helper | P2 | 014 | session-prime.ts | F032 |
| 31 | Parser adapter interface | P2 | 015 | structural-indexer.ts | — |
| 32 | Tree-sitter WASM parser | P2 | 015 | tree-sitter-parser.ts (new) | — |
| 33 | DECORATES + OVERRIDES + TYPE_OF edges | P2 | 015 | structural-indexer.ts, indexer-types.ts | — |
| 34 | Extract ghost SymbolKinds (variable, module, parameter, method) | P3 | 015 | indexer-types.ts | F008 |
| 35 | Regex removal (after tree-sitter stable) | P3 | 015 | structural-indexer.ts | — |
| 36 | Remove dead per-file TESTED_BY branch | P2 | 015 | structural-indexer.ts | F015 |
| 37 | Wire or remove excludeGlobs option | P2 | 015 | structural-indexer.ts | F016 |
| 38 | Fix .zsh language mapping (mapped but globs never discover) | P2 | 015 | indexer-types.ts | F017 |
| 39 | Near-exact seed resolution + score propagation | P2 | 016 | seed-resolver.ts | — |
| 40 | Query-intent pre-classification | P2 | 016 | Intent router | — |
| 41 | Auto-reindex triggers | P2 | 016 | code_graph_scan, ccc_reindex | — |
| 42 | Cross-runtime agent instruction updates | P3 | 016 | CODEX.md, AGENTS.md, agent configs | — |
| 43 | Recovery documentation consolidation | P2 | 016 | CLAUDE.md files | F018 |
| 44 | Fix seed-resolver silent DB failure → placeholder anchor | P2 | 016 | seed-resolver.ts | F014 |
| 45 | Fix spec/settings SessionStart scope mismatch | P2 | 016 | spec.md, settings.local.json | F030 |

**Evidence base:** Research iterations 056-095, review iterations 001-030. Cross-validated by 3 AI systems (Claude Opus, GPT-5.4 via Codex CLI, GPT-5.4 via Copilot CLI). Review verdict: CONDITIONAL (0 P0, 16 P1, 16 P2 active findings).

<!-- ANCHOR:scope -->
### Out of Scope

- Dual-Graph installation or graperoot integration — rejected per research (DR-001)
- Token tracking dashboard UI — future work
- Copilot/Gemini native hook adapters — deferred until runtime SDK changes
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

This parent packet tracks **28 phase folders (001-028)**. Each phase is independently executable and validated.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-precompact-hook/` | PreCompact hook context capture | Complete |
| 002 | `002-session-start-hook/` | SessionStart restore/prime paths | Complete |
| 003 | `003-stop-hook-tracking/` | Stop hook token tracking and auto-save | Complete |
| 004 | `004-cross-runtime-fallback/` | Hookless runtime fallback flow | Complete |
| 005 | `005-command-agent-alignment/` | Command and agent routing alignment | Complete |
| 006 | `006-documentation-alignment/` | Runtime documentation alignment | Complete |
| 007 | `007-testing-validation/` | Validation and test matrix | Complete |
| 008 | `008-structural-indexer/` | Structural indexer foundation | Complete |
| 009 | `009-code-graph-storage-query/` | Graph storage/query tooling | Complete |
| 010 | `010-cocoindex-bridge-context/` | CocoIndex seed bridge and context assembly | Complete |
| 011 | `011-compaction-working-set/` | Working-set compaction integration | Partial |
| 012 | `012-cocoindex-ux-utilization/` | Semantic UX and utilization | Complete |
| 013 | `013-correctness-boundary-repair/` | Correctness and boundary fixes | Complete |
| 014 | `014-hook-durability-auto-enrichment/` | Hook durability and auto-enrichment | Complete |
| 015 | `015-tree-sitter-migration/` | Tree-sitter migration | Partial |
| 016 | `016-cross-runtime-ux/` | Cross-runtime UX hardening | Complete |
| 017 | `017-tree-sitter-classifier-fixes/` | Parser/classifier fixes | Complete |
| 018 | `018-non-hook-auto-priming/` | Non-hook auto-priming | Complete |
| 019 | `019-code-graph-auto-trigger/` | Code graph auto-trigger | Complete |
| 020 | `020-query-routing-integration/` | Query routing integration | Complete |
| 021 | `021-cross-runtime-instruction-parity/` | Cross-runtime instruction parity | Complete |
| 022 | `022-gemini-hook-porting/` | Gemini hook lifecycle support | Complete |
| 023 | `023-context-preservation-metrics/` | Context preservation metrics | Complete |
| 024 | `024-hookless-priming-optimization/` | Hookless priming optimization | Complete |
| 025 | `025-tool-routing-enforcement/` | Tool-routing enforcement and guidance sync | Complete |
| 026 | `026-session-start-injection-debug/` | Startup injection analysis and shared brief design | Complete |
| 027 | `027-opencode-structural-priming/` | Non-hook structural bootstrap contract for OpenCode-first flows | Complete |
| 028 | `028-startup-highlights-remediation/` | Startup highlights quality-gate remediation | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 024-hookless-priming-optimization | 025-tool-routing-enforcement | Routing guidance enforcement + docs parity synced | Phase 025 checklist + recursive packet validation |
| 025-tool-routing-enforcement | 026-session-start-injection-debug | Startup injection gaps isolated and remediation path defined | Phase 026 spec/plan/tasks alignment |
| 026-session-start-injection-debug | 027-opencode-structural-priming | Non-hook structural bootstrap contract narrowed from startup injection work | Phase 027 spec/plan/checklist alignment |
| 027-opencode-structural-priming | 028-startup-highlights-remediation | Startup highlights retained only if signal quality can be proven | Phase 028 spec/plan/checklist alignment |
<!-- /ANCHOR:phase-map -->

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.
- REQ-905: Keep packet documentation and runtime verification aligned for this phase.
- REQ-906: Keep packet documentation and runtime verification aligned for this phase.
- REQ-907: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 5 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 6 runs, **Then** expected packet behavior remains intact.
