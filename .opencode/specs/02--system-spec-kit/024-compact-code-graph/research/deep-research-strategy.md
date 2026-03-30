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

---

## 7. WHAT WORKED
- WebFetch for docs and external analysis (segments 1-2)
- Codex GPT-5.4 parallel agents for deep codebase analysis (segments 2-3)
- 4-wave parallel dispatch for high throughput (segment 3)
- Direct file analysis produces higher-quality findings than web-only research
- Code-graph-focused parallel agents with clear topical scoping (segment 4)
- CocoIndex integration analysis saved significant implementation complexity

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

## 11. RESEARCH BOUNDARIES
- Max iterations: 55 (across 5 segments)
- Segments 3-5: 40 iterations via GPT-5.4, high reasoning
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Started: 2026-03-29T09:09:00.000Z
- Segment 3 started: 2026-03-30T10:00:00.000Z
