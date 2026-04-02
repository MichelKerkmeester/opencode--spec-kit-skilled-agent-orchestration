# Deep Review Strategy — Code Graph Session Start Injection Usefulness

## Review Target
Code Graph session start injection (hook output at startup) — evaluating usefulness, signal quality, and ROI.

## Review Target Type
files

## Scope Files
1. `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` — Hook handler
2. `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` — Builds structural context
3. `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` — `queryStartupHighlights()` query

## Dimension Queue (ordered)
1. **signal_quality** — Are highlights actionable? Do they help the AI?
2. **deduplication** — `test_specific` appears 3x identically. Bug?
3. **node_selection** — Is top-by-call-count the right heuristic?
4. **token_roi** — ~100 tokens injected. Value-per-token justified?
5. **on_demand_comparison** — What does proactive injection add vs on-demand tools?
6. **architectural_alignment** — Does injection align with spec 024 goals?

## Convergence Criteria
- maxIterations: 7
- convergenceThreshold: 0.10
- Quality gates: evidence, scope, coverage

## Evidence from Live Session
- User asked "search for code regarding fusion"
- AI did NOT use the structural context highlights — they were irrelevant
- AI went to CocoIndex semantic search (correct per decision tree)
- Highlights provided zero signal for the actual task
- `test_specific` appeared 3 times (deduplication bug)
- Highlights were: test files, vendored dependencies — not task-relevant

## Known Context
This is the actual hook output observed in this session:
```
## Structural Context
15488 files, 382268 nodes, 198135 edges.
Last scan: 2026-04-02T09:24:57.646Z
Highlights:
- test_specific (method) - special/tests/test_legendre.py [calls: 51]
- test_specific (method) - special/tests/test_legendre.py [calls: 51]
- test_specific (method) - special/tests/test_legendre.py [calls: 51]
- executeStage1 (function) - search/pipeline/stage1-candidate-gen.ts [calls: 38]
- fetch_more_tokens (method) - site-packages/yaml/scanner.py [calls: 31]
```

## Dimension Coverage
| Dimension | Status | Iteration |
|-----------|--------|-----------|
| signal_quality | reviewed | 1 |
| deduplication | reviewed | 1 |
| node_selection | reviewed | 2 |
| token_roi | reviewed | 2 |
| on_demand_comparison | reviewed | 3 |
| architectural_alignment | reviewed | 3 |

## Running Findings
- P1-001: Duplicate highlights due to GROUP BY on symbol_id instead of display fields (correctness, iteration 1)
- P1-002: Startup highlights surface vendored/test code instead of project code (correctness, iteration 1)
- P1-003: queryStartupHighlights selects chatty callers (outgoing call count), not architecturally important nodes (correctness, iteration 2) -- refines P1-002 with root-cause SQL analysis
- P2-001: Startup highlights provide no actionable signal for task routing (signal_quality, iteration 1)
- P2-002: No exclude patterns for node_modules or common build artifacts (maintainability, iteration 1)
- P2-003: Structural context section provides near-zero actionable signal at ~100 tokens of 2000 budget (token_roi, iteration 2)
- P2-004: Startup highlights lack per-file diversity controls; single hot file can monopolize all slots (maintainability, iteration 2)
- P2-005: Structural context highlights provide no value over on-demand tools -- all data available via code_graph_status/code_graph_context (on_demand_comparison, iteration 3)
- P2-006: Startup injection structural section not traceable to any spec requirement or DR (architectural_alignment, iteration 3)
- P2-007: queryStartupHighlights outgoing-CALLS heuristic confirmed directionally wrong for architectural significance via on-demand comparison (on_demand_comparison, iteration 3) -- reinforces P1-003
- P2-008: Graph scale stats (file/node/edge counts) duplicate code_graph_status MCP tool output (on_demand_comparison, iteration 3)
- **Totals: P0=0, P1=3, P2=8**

## What Worked
- [Iteration 1] Direct SQL analysis cross-referenced with live output evidence. GROUP BY mismatch was immediately visible.
- [Iteration 1] Comparing the UNIQUE constraint on symbol_id with display fields used in formatHighlight exposed the deduplication gap.
- [Iteration 2] Reading SQL ORDER BY clause directly identified the heuristic flaw (outgoing vs incoming call count).
- [Iteration 2] Reading shared.ts token budget constants (SESSION_PRIME_TOKEN_BUDGET=2000) provided exact ROI numbers.
- [Iteration 3] Comparison matrix (proactive vs on-demand) for each capability made value gaps concrete and evidence-based.
- [Iteration 3] Tracing startup injection components back to specific spec requirements and DRs revealed the traceability gap: highlights have no spec basis.

## What Failed
(none yet)

## Exhausted Approaches
(none yet)

## Next Focus
All 6 dimensions are now covered. Next iterations should focus on cross-reference synthesis across dimensions, severity reassessment of cumulative findings, and convergence evaluation.
