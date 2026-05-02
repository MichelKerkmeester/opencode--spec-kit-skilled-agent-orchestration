# Iteration 64: Consolidation — Cross-Segment Contradiction Analysis and Prioritized Implementation Backlog

## Focus
Synthesize findings across segments 4-6 (iterations 36-63) to identify contradictions, overlaps, and gaps. Produce a prioritized implementation backlog ordered by impact-to-effort ratio. Cross-reference segment 6 (iterations 56-63) findings against segments 4-5 (iterations 36-55) to determine whether new findings change prior conclusions.

## Findings

### 1. Contradiction Analysis: Segments 4-5 vs Segment 6

**No fundamental contradictions found.** Segment 6 deepened and refined segment 4-5 findings without overturning any. Specific refinements:

| Segment 4-5 Claim | Segment 6 Refinement | Impact |
|---|---|---|
| tree-sitter recommended for parsing (iter 038) | 4-phase migration path: regex fix first, tree-sitter optional, then default, then only (iter 060) | **Softened** — immediate fix uses regex heuristic, not tree-sitter |
| CALLS edges extracted via regex (iter 044) | CALLS edges are **broken**: endLine=startLine bug means only declaration line scanned, zero body analysis (iter 060) | **Elevated** — existing feature is non-functional, not just improvable |
| code_graph_context accepts CocoIndex seeds (iter 054) | Seed resolution discards CocoIndex similarity score; needs near-exact tier (iter 059, 063) | **Deepened** — design gap at integration seam |
| Budget allocator uses floors+overflow (iter 049) | 5 specific improvements needed: intent-aware priority, proportional overflow, min-floor protection, telemetry, dynamic registry (iter 060) | **Expanded** — v1 design needs refinement for production |
| Independent index refresh (iter 051) | 3 auto-reindex triggers identified: branch switch, session start, debounced save (iter 059) | **Expanded** — more triggers than originally anticipated |
| Tool dispatch via dispatchTool (iter 044) | dispatchTool is pure pass-through; interception must be in context-server.ts pre-dispatch block (iter 061) | **Corrected** — wrong insertion point in segment 4 design |
| MCP servers stateless, can't detect sessions (iter 058) | resolveTrustedSession() already detects non-hook callers; TTL-based FirstCallTracker provides session detection (iter 062) | **Corrected** — session detection is possible via existing primitives |

[SOURCE: research/research.md lines 567-674, strategy.md Q11-Q16 answers, JSONL iterations 56-63]

### 2. Overlap Analysis: Redundant Findings Across Segments

Three areas of significant overlap were identified:

**A. Tree-sitter migration** — Discussed in iterations 031, 038, 043 (segment 3-4), then again 056, 060 (segment 6). The segment 6 findings supersede earlier work by providing the 4-phase migration path and revealing the endLine bug that makes tree-sitter more urgent than originally assessed.

**B. Budget allocator** — First designed in iteration 049 (segment 5), deepened in iterations 056, 060 (segment 6). The 5-improvement list from segment 6 is the definitive reference; earlier iteration 049 design is the baseline being improved.

**C. Query-intent routing** — Designed in iteration 048 (segment 5), refined in iterations 059, 063 (segment 6). Segment 6 adds keyword pre-classification, confidence-based fallback, and dual-query for ambiguous intents. No contradiction — pure additive.

[INFERENCE: based on cross-reading research.md synthesis and iteration files across both segments]

### 3. Gap Analysis: What Is Not Yet Covered

| Gap | Severity | Where Expected | Status |
|---|---|---|---|
| Testing strategy for auto-enrichment | Medium | Should follow from iter 061 | Not addressed in any segment 6 iteration |
| Performance benchmarks for 3-source merge | Low | Budget allocator iterations | Theoretical only; no actual measurement plan |
| Error recovery for failed auto-enrichment | Medium | iter 061 mentions degrade-not-fail but no concrete error paths | Needs design |
| Migration path from current code graph to improved version | Medium | Expected from iter 060 4-phase plan | Phase 1 (brace-counting fix) is detailed; phases 2-4 are sketch-level |
| CocoIndex availability detection at runtime | Low | iter 059, 062 | Partial — ccc_status check mentioned but no graceful degradation path |

[INFERENCE: based on systematic review of all segment 6 findings against implementation readiness requirements]

### 4. Prioritized Implementation Backlog

Ordered by **impact-to-effort ratio** (impact = functional value x number of dependent features; effort = LOC + complexity + risk):

| Priority | Item | Impact | Effort | Ratio | Depends On | Source |
|---|---|---|---|---|---|---|
| **P0-1** | Fix endLine bug (brace-counting heuristic) | 10/10 — unblocks CALLS edges, fixes contentHash | ~50-80 LOC, low risk | **Highest** | Nothing | iter 060 |
| **P0-2** | Fix `/spec_kit:resume` profile:"resume" | 8/10 — immediate UX improvement | ~4 LOC, trivial | **Highest** | Nothing | iter 029 |
| **P1-1** | MCP first-call priming (T1.5) | 9/10 — universal context recovery | ~150-200 LOC, medium complexity | **Very High** | resolveTrustedSession() exists | iter 062 |
| **P1-2** | Tool-dispatch auto-enrichment (Tier 2) | 9/10 — automatic graph context on every file operation | ~120-180 LOC, medium risk | **Very High** | endLine fix, context-server.ts interception | iter 057, 061 |
| **P1-3** | Near-exact seed resolution + score propagation | 7/10 — bridges CocoIndex to code graph | ~60-80 LOC, low risk | **High** | seed-resolver.ts exists | iter 059, 063 |
| **P1-4** | DECORATES + OVERRIDES + TYPE_OF edge types | 7/10 — richer graph relationships | ~120-160 LOC, medium complexity | **High** | endLine fix (for body scanning) | iter 056, 060 |
| **P2-1** | Auto-reindex triggers (branch switch, session start, debounced save) | 6/10 — index freshness without manual scans | ~100-150 LOC, medium complexity | **Good** | code_graph_scan, ccc_reindex APIs | iter 059 |
| **P2-2** | Budget allocator improvements (intent-aware priority + proportional overflow) | 6/10 — smarter token allocation | ~80-120 LOC, medium risk | **Good** | budget-allocator.ts exists | iter 060 |
| **P2-3** | Query-intent pre-classification + confidence fallback | 6/10 — better routing between sources | ~60-100 LOC, low-medium risk | **Good** | Intent router exists | iter 059, 063 |
| **P2-4** | Session lifecycle background preloading (Tier 1) | 7/10 — zero-latency context on session start | ~150-200 LOC, medium complexity | **Good** | Hook system, working set tracking | iter 057 |
| **P2-5** | Missing SymbolKinds (variable, parameter, decorator, property, constant) | 4/10 — completeness for graph queries | ~40-60 LOC, low risk | **Moderate** | endLine fix | iter 056, 060 |
| **P2-6** | Missing query API operations (extends, implements, tested_by, contains, search) | 5/10 — richer structural queries | ~100-150 LOC per operation, medium effort | **Moderate** | Storage schema supports them | iter 056 |
| **P3-1** | Instruction-file updates (CODEX.md code_graph_status, CLAUDE.md enrichments) | 4/10 — cross-runtime parity | ~20-40 LOC, trivial | **Moderate** | Nothing | iter 058, 062 |
| **P3-2** | ccc_feedback implicit positive feedback | 3/10 — CocoIndex quality improvement | ~30-50 LOC, low risk | **Moderate** | ccc_feedback API exists | iter 059 |
| **P3-3** | Hybrid query patterns (structural expansion, semantic enrichment, working set warm-up) | 5/10 — advanced integration | ~200-300 LOC, high complexity | **Low** | Near-exact seeds, intent router, both indexes | iter 059, 063 |
| **P3-4** | Tree-sitter WASM migration (phases 2-4) | 8/10 — 99% parse accuracy | ~400-600 LOC, high risk | **Low** (high effort) | Phase 1 brace-fix complete | iter 060 |
| **P3-5** | Min-floor trim protection + allocation telemetry | 3/10 — production hardening | ~40-60 LOC, low risk | **Low** | Budget allocator works | iter 060 |
| **P3-6** | Dynamic source registry for future sources | 2/10 — extensibility | ~60-80 LOC, low complexity | **Low** | Budget allocator exists | iter 060 |

### 5. Cross-Reference: Do Segment 6 Findings Change Prior Conclusions?

**Five prior conclusions that are modified:**

1. **"Code graph MVP is 850-1,200 LOC" (iter 055)** — Segment 6 reveals the endLine bug means the current code graph is partially non-functional. The MVP scope should be adjusted: the 850-1,200 LOC estimate holds for new code, but ~50-80 LOC of critical bugfix must precede it. Revised total: **900-1,280 LOC**.

2. **"Independent index refresh, no shared event bus" (iter 051)** — Segment 6 identifies 3 auto-reindex triggers that benefit from shared detection (branch switch, session start). While a full event bus is still unnecessary, a lightweight shared trigger mechanism (e.g., file-flag based) is warranted. This shifts from "no coordination" to "minimal coordination."

3. **"Phase 004 Cross-Runtime Fallback scored 3/5 readiness" (iter 035)** — Segment 6 elevates this to ~4/5 with the MCP first-call priming design (iter 062) providing a concrete universal mechanism. The `resolveTrustedSession()` primitive makes implementation more tractable than originally assessed.

4. **"Auto-surface at tool dispatch extends memory-surface.ts" (iter 057)** — Segment 6 deep dive (iter 061) corrects the insertion point: enrichment goes in context-server.ts pre-dispatch block, not in the tool handler layer. This is a design correction, not a conclusion reversal.

5. **"CocoIndex and Code Graph are independent" (iter 051)** — Partially revised. They are independent at the index level (no shared event bus), but at the query level they benefit from tighter integration: score propagation, near-exact seed resolution, hybrid query patterns. The relationship is "loosely coupled indexes, tightly integrated queries."

**Three prior conclusions that are reinforced:**

1. **"CocoIndex covers semantic, code graph covers structural"** (iter 036-045) — Fully reinforced. No segment 6 finding suggests overlap or redundancy.

2. **"SQLite for storage, not graph DB"** (iter 040) — Unchanged. Segment 6 findings add edge types and query operations but none require graph DB capabilities.

3. **"Hybrid hook+tool architecture with Claude hooks as Tier 1"** (iter 011-015) — Reinforced and enriched with Tier 1.5 (MCP first-call priming) as a universal complement.

[SOURCE: research/research.md Parts III-VI, strategy.md questions Q11-Q16, JSONL state iterations 36-63]

## Ruled Out
- No approaches were "tried and failed" in this consolidation iteration. This was an analytical iteration.

## Dead Ends
- None identified. All segment 6 research directions produced actionable findings.

## Sources Consulted
- research/research.md (674 lines, complete synthesis through iteration 063)
- research/deep-research-strategy.md (questions Q1-Q16 with answers)
- research/deep-research-state.jsonl (iterations 56-63 records with newInfoRatio, focusTracks, ruledOut)
- Cross-reference with segment 4-5 iteration records (iterations 36-55) in JSONL

## Assessment
- New information ratio: 0.45
- Questions addressed: Consolidation meta-question (no new Q# — this is a synthesis iteration)
- Questions answered: None new — all Q1-Q16 were previously answered; this iteration validates and prioritizes their findings

## Reflection
- What worked and why: Reading the complete research.md synthesis (674 lines) first gave a comprehensive view of all findings, making it efficient to identify contradictions and overlaps. The JSONL state records with focusTrack labels made it easy to group related iterations.
- What did not work and why: N/A — consolidation approach was appropriate for this iteration's goal.
- What I would do differently: For a more thorough consolidation, reading each individual iteration file (056-063) would catch nuances lost in synthesis. However, the research.md synthesis was comprehensive enough for this purpose and the tool budget constraint.

## Recommended Next Focus
Two options for remaining iterations (65-75):
1. **Implementation phasing**: Break the prioritized backlog into concrete implementation phases with file-level specifications, estimated LOC per file, and dependency graphs.
2. **Final synthesis update**: Update research.md with the prioritized backlog and contradiction analysis as Part VII, producing the final deliverable document.
