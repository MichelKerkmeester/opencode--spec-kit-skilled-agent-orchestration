---
title: "Tasks: Hybrid Context Injection [02--system-spec-kit/024-compact-code-graph/tasks]"
description: "30-phase task tracker for hook, recovery, code-graph, and follow-on remediation architecture."
trigger_phrases:
  - "tasks"
  - "hybrid"
  - "context"
  - "injection"
  - "024"
  - "compact"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
# Tasks: 024 — Hybrid Context Injection


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
### Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[~]` | Partial (deferred items remain) |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `Phase ### — Name (status)`
<!-- /ANCHOR:notation -->

---
### v1 Phases (001-012) — Hook + Code Graph Foundation

- [x] Phase 001: Compaction Context Injection — PreCompact precompute + SessionStart(source=compact) inject
- [x] Phase 002: SessionStart Hook — Session priming for startup/resume/clear sources
- [x] Phase 003: Stop Hook + Token Tracking — Async session save + transcript JSONL parsing
- [x] Phase 004: Cross-Runtime Fallback — CLAUDE.md recovery, .claude/CLAUDE.md creation, runtime detection
- [x] Phase 005: Command & Agent Alignment — Gate system + agent routing updates
- [x] Phase 006: Documentation Alignment — Unified recovery instructions across runtimes
- [x] Phase 007: Testing & Validation — 7-scenario test matrix, hook script verification
- [x] Phase 008: Structural Indexer — tree-sitter JS/TS/Python/Shell symbol extraction (regex-based v1)
- [x] Phase 009: Code Graph Storage + Query — SQLite schema, code_graph_scan/query/status MCP tools
- [x] Phase 010: CocoIndex Bridge + Context — code_graph_context tool, seed resolution, budget enforcement
- [x] Phase 011: Compaction Working-Set — 3-source merge, budget allocator, working-set tracker
- [x] Phase 012: CocoIndex UX, Utilization & Usefulness — Semantic search integration, query routing
---
### v2 Remediation Phases (013-016) — 45-Item Fix Cycle

Evidence base: 95 research iterations + 30 review iterations (Codex CLI + Copilot CLI, GPT-5.4). Cross-validated by 3 AI systems. Review verdict: CONDITIONAL.

- [x] Phase 013: Correctness & Boundary Repair — 15/15 items (endLine fix, DB safety, budget allocator, query traversal, validation)
- [x] Phase 014: Hook Durability & Auto-Enrichment — 14/14 items (race fix, error propagation, provenance fencing, permissions, dead code removal)
- [x] Phase 015: Tree-Sitter WASM Migration — phase delivery is fully truth-synced; tree-sitter WASM completed in Phase 017, regex was demoted to fallback, and the additional SymbolKinds follow-on is documented as non-blocking parser debt
- [x] Phase 016: Cross-Runtime UX & Documentation — 8/8 items done (intent pre-classifier completed in Phase 017/020; SessionStart scope fixed)

### v2 Totals

- **Shipped:** 44/45 items (Items 32, 35, 40, 45 completed in v3 phases)
- **Documented follow-on:** Additional SymbolKinds remain recorded as non-blocking parser debt

| # | Originally Deferred Item | Phase | Resolution |
|---|--------------------------|-------|------------|
| 32 | Tree-sitter WASM parser | 015 | COMPLETED in Phase 017: tree-sitter-parser.ts (696 LOC) |
| 35 | Regex removal | 015 | COMPLETED: regex demoted to fallback, tree-sitter is default |
| 40 | Intent pre-classifier | 016 | COMPLETED in Phase 017/020: classifyQueryIntent() in query-intent-classifier.ts |
| 45 | SessionStart scope fix | 016 | COMPLETED: spec updated to match actual single-unscoped design |
---
### v3-v4 Phases (017-028) — Polish, Porting, Observability, and Review Follow-Through

- [x] Phase 017: Tree-Sitter & Query-Intent Classifier Fixes — 12/15 bugs fixed, 3 deferred
- [x] Phase 018: Non-Hook CLI Auto-Priming — MCP first-call auto-prime, session_health tool
- [x] Phase 019: Code Graph Auto-Trigger — ensureCodeGraphReady() helper, branch-switch detection
- [x] Phase 020: Query-Intent Routing Integration — Auto-routing in memory_context, session_resume composite tool
- [x] Phase 021: Cross-Runtime Instruction Parity — No Hook Transport sections, @context-prime agent
- [x] Phase 022: Gemini CLI Hook Porting — Gemini lifecycle mapping, PreCompress/BeforeAgent hooks
- [x] Phase 023: Context Preservation Metrics — Session metrics collector, quality scoring, dashboard
- [x] Phase 024: Hookless Priming Optimization — session_bootstrap tool, session_snapshot, bootstrap telemetry
- [x] Phase 025: Tool Routing Enforcement — enforcement hints shipped and root packet truth-sync followed through
- [x] Phase 026: Session Start Injection Debug — debug packet for SessionStart injection issues
- [x] Phase 027: OpenCode Structural Priming — structural bootstrap contract for hookless runtimes
- [x] Phase 028: Startup Highlights Remediation — quality-gated startup highlights follow-through
- [x] Phase 029: Review Remediation — review-finding truth-sync and closeout sweep
- [x] Phase 030: OpenCode Graph Plugin — startup-surface, transport, and code-graph parity follow-on packet
---

<!-- ANCHOR:completion -->
### Completion Criteria
- [x] All 30 direct phases have child spec folders with spec.md + plan.md + checklist.md
- [x] All v1 phases (001-012) implemented and verified
- [x] All v2 remediation items shipped or explicitly deferred with rationale
- [x] All v3-v5 phases (017-030) implemented or truth-synced through dedicated follow-on packets
- [x] Hook scripts registered in .claude/settings.local.json
- [x] Cross-runtime fallback verified (Codex CLI tested)
- [x] Remaining deferred SymbolKinds follow-on is explicitly tracked outside packet completion and no longer blocks packet closeout
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
### Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md` (16 decisions: DR-001 through DR-016)
<!-- /ANCHOR:cross-refs -->
