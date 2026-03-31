---
title: "Deep Research Strategy: Hybrid Context Injection [02--system-spec-kit/024-compact-code-graph/research/deep-research-strategy]"
description: "Research strategy for evaluating Codex-CLI-Compact Dual-Graph and designing hybrid hook+tool context injection architecture for automated context preservation."
trigger_phrases:
  - "deep research strategy"
  - "codex-cli-compact evaluation"
  - "hybrid context injection"
  - "hook tool architecture"
  - "context preservation research"
importance_tier: "normal"
contextType: "research"
---
# Deep Research Strategy — Hybrid Context Injection

## 2. TOPIC
Evaluate Codex-CLI-Compact (Dual-Graph) for upgrading our Spec Kit Memory MCP system, then design and research the implementation of a hybrid hook+tool context injection architecture for automated context preservation across AI session lifecycle events.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: What is Codex-CLI-Compact's architecture? (iteration 1) — Proprietary graperoot core
- [x] Q2: How does it compare to our system? (iterations 2-3) — Complementary, not competitive
- [x] Q3: Can we extract its logic? (iteration 4) — NO, proprietary
- [x] Q4: Should we install standalone? (iterations 5, 9) — NO, critical blockers
- [x] Q5: How well does it fit our architecture? (iteration 6) — POOR FIT (2/10)
- [x] Q6: How should hook+tool hybrid work? (iterations 11-15) — PreCompact+SessionStart+Stop
- [x] Q7: What are the exact API contracts? (iterations 16-20) — Documented with call chains
- [x] Q8: What existing patterns can we reuse? (iterations 21-25) — Test, budget, recovery patterns
- [x] Q9: How do cross-runtime hooks compare? (iterations 26-30) — Claude strongest, others limited
- [x] Q10: Is the implementation ready? (iterations 31-35) — Yes for Phases 1-3, partial for 4-7
- [x] Q11: How does CocoIndex change the code graph architecture? (iterations 036-045 + CocoIndex analysis) — Complementary: CocoIndex handles semantic, code graph handles structural only
- [x] Q12: How should CocoIndex and Code Graph be wired together? (iterations 046-055) — Bridge via file-range seeds, intent router, floors+overflow budget, 3-source merge, repo maps
- [x] Q13: What feature improvements can be made to code graph, budget allocator, merger, and hook system? (iterations 56, 60) — Critical endLine bug confirmed in source: all parsers set endLine=startLine, CALLS edges scan only declaration line (zero body analysis), contentHash also broken. Fix: brace-counting heuristic (JS/TS) + indentation-based (Python). 3 missing edge types with concrete regex: DECORATES (@decorator lookahead, 0.85), OVERRIDES (name-match+extends chain OR override keyword, 0.7-0.95), TYPE_OF (typed vars/params/returns, 0.85). Tree-sitter WASM: 4-phase migration (brace-fix, optional, default, regex-removal), ~8-15MB grammars, 99% vs 70% accuracy. Budget allocator: 5 improvements (intent-aware priority, proportional overflow, min-floor trim protection, metrics telemetry, dynamic source registry). 3 ghost SymbolKinds never extracted. 5 missing query API operations
- [x] Q14: How can code graph + CocoIndex be utilized automatically without explicit tool calls? (iteration 057) — Three-tier auto-enrichment: (1) session lifecycle background preloading, (2) tool dispatch inline file-context injection via memory-surface.ts pattern, (3) query-aware deferred enrichment via 3-source allocator. GRAPH_AWARE_TOOLS set prevents recursion. Non-hook runtimes get Tier 2+3 via MCP-native interception. Lazy per-file staleness checks for background indexing.
- [x] Q15: How can non-hook CLI runtimes (OpenCode, Codex, Copilot, Gemini) achieve equivalent context preservation UX? (iteration 058) — Four-tier fallback: T1 hooks (Claude only), T2 instruction-file triggers (CODEX.md/CLAUDE.md forcing memory_context calls), T3 command-based (/spec_kit:resume), T4 Gate 1 auto (memory_match_triggers). Enhancement: MCP "first-call priming" as T1.5 universal mechanism
- [x] Q16: How can CocoIndex utilization be improved? (iteration 059) — 5 improvement areas: near-exact seed resolution + CocoIndex score propagation, 3 auto-reindex triggers (branch switch/session start/debounced save), intent-router keyword pre-classification + confidence fallback, 3 hybrid query patterns (structural expansion, semantic enrichment, working set warm-up), 3 underutilized features (language filters, refresh_index management, ccc_feedback)

---

## 4. NON-GOALS
- Not evaluating Codex CLI itself (already have cli-codex skill)
- Not redesigning the entire memory system
- Not benchmarking performance metrics
- Not implementing changes — research only

---

## 5. STOP CONDITIONS
- All research questions answered with evidence ✓
- Source code and APIs fully analyzed ✓
- Clear recommendations formed ✓
- Implementation readiness assessed ✓

---

## 6. SEGMENTS

### Segment 1 (iterations 1-10): Dual-Graph Evaluation
- Status: COMPLETE
- Outcome: REJECTED — build clean-room code graph instead
- Stop reason: All 5 questions answered + convergence

### Segment 2 (iterations 11-15): Hook+Tool Architecture Design
- Status: COMPLETE
- Outcome: Architecture spec with 7 implementation phases
- Stop reason: All questions answered

### Segment 3 (iterations 16-35): Implementation-Ready Research
- Status: COMPLETE (19/20, iteration 022 pending)
- Method: All iterations via GPT-5.4 codex agents, high reasoning, 4 waves of 5 parallel
- Outcome: Implementation-ready findings across all 7 phases
- Key findings: API contracts documented, test patterns identified, cross-runtime analysis complete, readiness scorecard produced

### Segment 4 (iterations 36-45): Code Graph Research
- Status: COMPLETE
- Method: All iterations via GPT-5.4 codex agents, high reasoning, 2 waves of 5 parallel
- Outcome: Structural code graph architecture + CocoIndex complementary integration
- Key findings: tree-sitter deep dive, SQLite schema, compact representations, code-aware RAG, MCP API design, CocoIndex covers semantic search
- Stop reason: Architecture complete, CocoIndex integration analyzed, all questions answered

### Segment 5 (iterations 46-55): CocoIndex + Code Graph Integration
- Status: COMPLETE
- Method: All iterations via GPT-5.4 codex agents, high reasoning, 2 waves of 5 parallel
- Outcome: Complete integration architecture for CocoIndex + Code Graph + Memory
- Key findings: code_graph_context accepts file-range seeds from CocoIndex, 3-source budget allocator (floors + overflow pool: constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800), query-intent router with heuristic classifier, independent index refresh with freshness metadata, 3-source merge with constitutional priority, repo maps with CocoIndex-boosted ranking, session working set tracking via structural expansion
- Stop reason: All 10 iterations complete, architecture integration fully designed

### Segment 6 (iterations 56-75): Feature Improvement + Non-Hook Runtime UX
- Status: COMPLETE
- Method: Claude Opus deep-research agent iterations
- Focus: 4 research questions (Q13-Q16)
  1. Feature improvements: code graph edge types, parsing strategies, budget allocation
  2. Automatic AI utilization: auto-triggering code graph/CocoIndex without explicit tool calls
  3. Non-hook CLI runtime UX: OpenCode, Codex, Copilot, Gemini context preservation
  4. CocoIndex utilization: re-indexing triggers, seed resolution, query routing
- Key deliverables: Prioritized 18-item backlog, 4-phase implementation plan (654-932 LOC), performance budget, error recovery design, testing strategy
- Stop reason: All 16 questions answered, convergence achieved at iteration 075

### Segment 7 (iterations 76-95): Verification + Cross-Runtime Deepening via Copilot CLI
- Status: COMPLETE
- Method: GPT-5.4 via Copilot CLI (copilot -p), high reasoning, 5 waves of 4 parallel
- Focus: Verify segment 6 findings against current code, deepen cross-runtime UX, validate review P1 findings
  1. Verify core findings Q13-Q16 against current code (wave 1)
  2. Verify implementation plans, testing, performance, error recovery (wave 2)
  3. Deepen cross-runtime UX per runtime: OpenCode, Codex, Copilot, Gemini (wave 3)
  4. Verify deep review P1 findings 1-10 against code (wave 4)
  5. Synthesis, updated roadmap, parity matrix (wave 5)
- Outcome: Segment 6 design claims were truth-synced against live code; the final roadmap now puts hardening ahead of transparent auto-enrichment, the cross-runtime startup surfaces were clarified per runtime, and the locally available P1 verification set ended with 6 confirmed active items and 1 false positive.
- Stop reason: Final synthesis completed at iteration 095. The local workspace contained direct Segment 7 artifacts for 076-089 and 091 plus the canonical state log; expected standalone 090/092/093/094 markdown files were absent and were reconstructed from the available evidence.

---

## 7. WHAT WORKED
- WebFetch for docs and external analysis (segments 1-2)
- Codex GPT-5.4 parallel agents for deep codebase analysis (segments 2-3)
- 4-wave parallel dispatch for high throughput (segment 3)
- Direct file analysis produces higher-quality findings than web-only research
- Code-graph-focused parallel agents with clear topical scoping (segment 4)
- CocoIndex integration analysis saved significant implementation complexity
- Cross-reading seed-resolver.ts alongside CocoIndex SKILL.md reveals concrete improvement gaps (iteration 059)
- Direct source code reading for implementation-gap analysis (iteration 56) — revealed critical endLine bug not discoverable from design-level research
- Direct codebase analysis of existing auto-surface patterns (memory-surface.ts, session-prime.ts) for extending to code graph auto-enrichment (iteration 057)
- Direct file reading of runtime-specific configs (CODEX.md, agent definitions) reveals existing patterns more efficiently than web research (iteration 058)
- Multi-file source tracing (structural-indexer.ts + indexer-types.ts + budget-allocator.ts) reveals implementation-level bugs and improvement paths impossible to find from design docs alone (iteration 060)
- Reading actual source code (context-server.ts, memory-surface.ts, session-prime.ts) for implementation-deep-dive reveals constraints invisible from design-level research: 250ms latency budget, process.exit in hooks, inverted MEMORY_AWARE_TOOLS double-check pattern (iteration 061)
- Sequential reading of seed-resolver.ts -> code-graph-db.ts -> code-graph-context.ts revealed complete data flow and exact code insertion points for near-exact matching, score propagation, and hybrid queries (iteration 063)
- Reading resolveTrustedSession() revealed the universal session detection primitive: trusted:false + requestedSessionId:null signals "non-hook client, new session" -- only discoverable from source code (iteration 062)
- Cross-segment consolidation (iteration 064): reading complete research.md synthesis (674 lines) first, then JSONL state with focusTrack labels, efficiently identified contradictions, overlaps, and produced prioritized backlog
- Direct source reading of 5 error-handling files (hooks + DB + runtime-detection) revealed concrete gaps: initDb() has no try/catch, getRecoveryApproach() is unwired, no SQLITE_BUSY handling (iteration 071)
- Reading OpenCode agent definitions (context.md frontmatter + 3-layer retrieval) and command YAML workflows (resume_auto.yaml) revealed exact injection points for code graph integration -- 4-tier design emerged from understanding the extension surface (iteration 065)
- Cross-system pattern discovery: reading memory system's incremental-index.ts mtime fast-path alongside code-graph-db.ts isFileStale() revealed the missing optimization and provided a proven pattern to adapt; latency budget from expandAnchor made sync/async threshold design concrete (iteration 067)
- Source code analysis of structural-indexer.ts (474 lines) reveals exact adapter boundary for tree-sitter migration: ParseResult interface is parser-agnostic, extractEdges() is parser-independent, downstream code needs zero changes; concrete S-expression query patterns designed for CALLS/IMPORTS/DECORATES/OVERRIDES; bundle size revised down from 8-15MB to ~1.5MB (iteration 066)
- Multi-file performance analysis (iteration 070): reading all 6 performance-critical files (shared.ts, compact-inject.ts, code-graph-db.ts, code-graph-context.ts, compact-merger.ts, budget-allocator.ts) in 2 parallel batches provided complete latency picture; existing performance.now() instrumentation confirmed merge pipeline is <5ms, establishing ~1700ms headroom for auto-enrichment; SQLite 1-hop expansion ~1-9ms; token estimation error ~15-25%
- Reading existing test files (code-graph-indexer, budget-allocator, graph-flags) before designing new tests ensures proposed test strategy follows established patterns (inline content strings, direct module imports, env var save/restore) -- prevents test style drift (iteration 069)
- Using `wc -l` on all 14+ target files before estimating LOC changes produced realistic phase estimates (654-932 net LOC across 4 phases, 11 sub-phases); cross-referencing iterations 060/064/065/066/067 in a single pass yielded a coherent dependency graph not visible from any single iteration (iteration 068)
- Cross-referencing deep review findings against research findings (iteration 072): reading the review strategy summary first provided a complete finding index (F001-F019), then selective reading of 3 key iterations covered all P1s efficiently. Revealed 3 P1s our research missed entirely (F001 cache race, F011 budget ceiling, F012 merger overflow) -- all only discoverable via runtime validation, not source reading
- Reading all 4 critical dependency-chain files (DB schema, indexer, tests, seed-resolver) in one pass revealed the complete migration risk profile: zero test breakage, no schema change, transactional safety, and cascading quality improvement from endLine fix (iteration 073)

---

## 8. WHAT FAILED
- Initial codex exec syntax had wrong flags (--reasoning → -c model_reasoning_effort)
- `-o` flag overwrites agent's own file writes — must not use `-o` when agent writes directly
- Cannot inspect graperoot source (proprietary) — limits Dual-Graph understanding

---

## 9. EXHAUSTED APPROACHES
- Dual-Graph integration (proprietary core, workflow conflicts)
- LSP-based code graph (per-language server overhead)

---

## 10. RULED OUT DIRECTIONS
- Installing Dual-Graph standalone (CLAUDE.md overwrite blocker)
- Using graperoot as dependency (vendor lock-in)
- Pure embedding approach for structural queries (need explicit graph)

---

## 10b. NEXT FOCUS
RESEARCH COMPLETE (iteration 095). All 16 questions remain answered across 7 segments. Next action: implementation, starting with truth-sync and P1 hardening (hook cache lifecycle, stale reuse, validation boundaries, budget integrity), then the Phase A endLine fix as the first structural correction. See research.md Parts X-XI for the revised roadmap.

## 10c. WHAT WORKED (iteration 74)
- Direct file reading of 3 runtimes' agent definitions + settings revealed format differences (TOML vs YAML frontmatter vs plain markdown) and exact tool registration patterns
- Cross-runtime comparison of instruction files (CODEX.md vs AGENTS.md/GEMINI.md vs CLAUDE.md) exposed the gap: code graph is listed as available but never auto-triggered
- Official Copilot CLI docs plus repo scans cleanly separated auto-loaded instruction files from optional custom-agent profiles, correcting older assumptions that repo-local markdown agent files alone described Copilot startup behavior (iteration 86)

## 10d. WHAT FAILED (iteration 74)
- Expected COPILOT.md to exist by analogy with CODEX.md -- it does not; Copilot CLI uses the universal AGENTS.md instead
- Treating repo-local markdown agent layouts as the authoritative Copilot CLI startup surface overfit to local structure; current docs place universal Copilot startup behavior in AGENTS.md / `.github/copilot-instructions.md` / `.github/instructions/**/*.instructions.md`, with `.github/agents/*.agent.md` as optional custom-agent profiles (iteration 86)

## 10e. WHAT WORKED (iteration 87)
- Combining repo-local evidence with official Gemini CLI docs cleanly separated **current repo configuration** from **upstream Gemini runtime capability**, which corrected the stale assumption that Gemini is just another hookless runtime.
- Verifying official Gemini MCP configuration against the repo's shared `.mcp.json` avoided over-claiming direct `.mcp.json` compatibility and clarified that parity requires a `.gemini/settings.json` bridge.

## 10f. WHAT FAILED (iteration 87)
- The older "non-Claude runtimes lack hooks" framing no longer holds for upstream Gemini CLI; future parity analysis must treat Gemini separately from OpenCode and Codex.

## 10g. NEXT FOCUS (iteration 87)
- Choose whether Phase D should target **instruction-only Gemini parity** (`GEMINI.md` + `.gemini/settings.json` + shared MCP mirroring) or **near-Claude Gemini parity** by also wiring Gemini hooks (`SessionStart` + `PreCompress`).
- If Gemini remains in scope for implementation, define whether `.mcp.json` should be mirrored/generated into `.gemini/settings.json` as part of the cross-runtime setup.

---

## 11. RESEARCH BOUNDARIES
- Max iterations: 75 (across 6 segments)
- Segments 3-5: 40 iterations via GPT-5.4, high reasoning
- Segment 6: 20 iterations via Claude Opus (deep-research agent)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Started: 2026-03-29T09:09:00.000Z
- Segment 3 started: 2026-03-30T10:00:00.000Z
- Segment 6 started: 2026-03-31T12:00:00.000Z
## 10h. WHAT WORKED (iteration 91)
- Tracing `scan.ts` into `structural-indexer.ts` confirmed the P1-10 boundary issue quickly because the caller-controlled `rootDir` stays unvalidated all the way into the recursive walker.
- Pairing source reads with targeted tests (`edge-cases.vitest.ts`, `hook-stop-token-tracking.vitest.ts`) helped distinguish still-live behavior from stale review prose.
- A repo-wide search for `workingSet` was the fastest way to verify that the startup Working Memory branch has no in-repo producer.

## 10i. WHAT FAILED (iteration 91)
- Prior markdown artifacts for iterations 088-090 were not present locally, so direct prose-to-prose comparison was not possible; the verification had to rely on current source plus the JSONL state log.

## 10j. NEXT FOCUS (iteration 91)
- Continue the verification wave by checking remaining caller-controlled boundaries, stale-data paths, and error-sanitization gaps directly against handlers, hook-state producers, and tests.

## 10k. WHAT WORKED (iteration 094)
- Cross-reading iterations 078 and 084-087 produced a much cleaner separation between **current repo wiring** and **runtime capability ceiling**, which is the key distinction behind the parity matrix.
- Verifying the live Copilot hook file (`.github/hooks/superset-notify.json`) alongside official Copilot instruction docs prevented classifying Copilot as purely instruction-only.

## 10l. WHAT FAILED (iteration 094)
- Earlier parity shorthand blurred "the runtime can support this" with "the repo already wires this today," which especially distorted Gemini and, to a lesser extent, Copilot.

## 10m. NEXT FOCUS (iteration 094)
- Final iteration 095 should convert the parity matrix into one prioritized Phase D rollout: shared Session Start Protocol first, MCP first-call priming second, runtime-specific glue third.

## 10n. WHAT WORKED (iteration 093)
- Re-reading the original roadmap (iteration 068) and the review adjustment pass (iteration 072) **after** the verification wave made it possible to separate mandatory stabilization work from deferred feature work.
- The strongest roadmap signal came from convergence across multiple verification passes: the same themes (boundary enforcement, seed identity, hook durability, instruction-first runtime parity) recurred independently in iterations 076, 088, 089, and 091.

## 10o. WHAT FAILED (iteration 093)
- The local artifact set is incomplete for the requested verification window: `iteration-090.md` is absent and `deep-research-state.jsonl` has no local `run: 90` entry, so one slot in the 076-091 range cannot be cited directly.
- Earlier roadmap language blurred "current seam" and "future feature," which forced this iteration to spend time de-mixing proposal work from verified defects.

## 10p. NEXT FOCUS (iteration 093)
- Use this revised phase ordering as the basis for the final synthesis: stabilization path (Phases 1-3) first, deferred feature path (Phase 4) second.
- Keep the final parity matrix aligned to verified runtime surfaces: shared docs/config first, server-side priming only as an explicitly deferred enhancement.
