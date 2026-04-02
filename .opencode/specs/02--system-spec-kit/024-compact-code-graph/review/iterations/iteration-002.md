# Review Iteration 2: node_selection + token_roi

## Focus
Node selection heuristic analysis and token ROI assessment for the structural context injection at session start.

## Scope
- Review target: `code-graph-db.ts:350-379` (queryStartupHighlights), `startup-brief.ts` (buildGraphOutline), `session-prime.ts` (handleStartup)
- Spec refs: Phase 026 session start injection
- Dimensions: node_selection, token_roi

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| code-graph-db.ts (queryStartupHighlights) | 5/10 | N/A | 6/10 | 7/10 |
| startup-brief.ts | 7/10 | N/A | 7/10 | 8/10 |
| session-prime.ts | 8/10 | N/A | 7/10 | 8/10 |

## Findings

### P1-003: queryStartupHighlights selects chatty callers, not architecturally important nodes
- Dimension: correctness
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:353-364]
- Relationship: Refines P1-002 (iteration 1) with root-cause SQL analysis of the ranking heuristic
- Impact: The SQL query ranks nodes by outgoing CALLS edge count (`ORDER BY call_count DESC`). This surfaces methods that call many other functions (chatty callers), not the most architecturally important or relevant symbols. In the live session, this produced 3 identical `test_specific` entries from a vendored test file and `fetch_more_tokens` from `site-packages/yaml/scanner.py`. Only 1 of 5 highlights (`executeStage1`) was from project source code. The heuristic fundamentally misidentifies what makes a node "interesting" for an AI agent starting a session.
- Recommendation: Replace outgoing-call-count heuristic with one or more of: (a) incoming-call-count (most-called = most depended upon), (b) PageRank-style centrality, (c) recency weighting via `code_files.file_mtime_ms`, or (d) file-path relevance filtering to exclude test and vendored code before ranking.
- Skeptic: Could outgoing call count be intentional, targeting "hub" functions that orchestrate behavior? In theory, a function calling 50 others is a pipeline entry point. However, the live data shows this heuristic is dominated by test harnesses and library internals, which are chatty by nature but not architecturally revealing.
- Referee: The skeptic's alternative explanation is plausible in principle but refuted by the observed output. The heuristic does not distinguish between architectural orchestrators and test/library boilerplate. Finding confirmed at P1.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"queryStartupHighlights ranks by outgoing CALLS count, surfacing test harnesses and vendored library methods instead of architecturally important project symbols.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:353-364"],"counterevidenceSought":"Checked whether outgoing-call-count intentionally targets orchestrator/pipeline functions. Reviewed live output showing 4/5 results are test/vendored code.","alternativeExplanation":"Outgoing call count could target pipeline entry points that orchestrate behavior. Rejected because live data shows test harnesses and library internals dominate.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Evidence that outgoing-call-count reliably surfaces project orchestration functions across diverse codebases, not just test/vendor noise."}
```

### P1-004: No file-path filtering excludes test files and vendored dependencies
- Dimension: correctness
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:362]
- Relationship: Refines P1-002 (iteration 1) with specific SQL WHERE clause analysis and concrete filter recommendations
- Impact: The `WHERE` clause filters only by `n.kind` (symbol type) but applies no file-path filter. The code graph indexes 15,488 files including vendored packages (`site-packages/`), test suites (`tests/`, `test_`), and node_modules. Without exclusion patterns, highlights are dominated by non-project code. In the live session, `special/tests/test_legendre.py` (vendored SciPy test) and `site-packages/yaml/scanner.py` occupied 4 of 5 highlight slots.
- Recommendation: Add a `WHERE` clause filter excluding common non-project paths: `n.file_path NOT LIKE '%site-packages%' AND n.file_path NOT LIKE '%node_modules%' AND n.file_path NOT LIKE '%/tests/%' AND n.file_path NOT LIKE '%/test_%'`. Alternatively, join against `code_files` and filter by a project-source flag or use a configurable exclusion list.
- Skeptic: Test files could be valuable if the user works on testing. And a static exclusion list might be too rigid. However, the purpose of startup highlights is to orient the AI on the project structure, not on vendored test harnesses. The current zero-filtering approach is clearly wrong even if the exact filter is debatable.
- Referee: The absence of any filtering is the core issue. The exact filter design is a follow-up concern. Finding confirmed at P1.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"queryStartupHighlights applies no file-path filtering, allowing vendored code (site-packages, node_modules) and test files to dominate highlights.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:362"],"counterevidenceSought":"Checked for any upstream filtering in startup-brief.ts or session-prime.ts that might post-filter results. Found none. Checked if code_graph_scan excludes vendored files at index time. It does not appear to exclude them from the database.","alternativeExplanation":"Test files might be relevant if user works on testing. Rejected because startup highlights aim to orient on project architecture, not testing infrastructure.","finalSeverity":"P1","confidence":0.90,"downgradeTrigger":"Evidence that code_graph_scan already excludes vendored/test files at index time, making query-time filtering unnecessary."}
```

### P2-003: Structural context section provides near-zero actionable signal at ~100 tokens
- Dimension: maintainability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:118-129], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:10]
- Impact: The structural context consumes approximately 100 tokens of the 2000-token `SESSION_PRIME_TOKEN_BUDGET`. While the absolute cost is low (~5%), the information density is near zero when highlights are test/vendored noise. The aggregate stats line (`15488 files, 382268 nodes, 198135 edges`) provides orientation but is not actionable. The highlights list, which should be the high-value payload, carries no useful signal due to P1-003 and P1-004. Token ROI is therefore very low: the 100 tokens could carry higher-signal data such as recently modified project files, active git branch, or last-session working set.
- Recommendation: After fixing P1-003 and P1-004, reassess token ROI. If highlights become project-relevant, the ~100 tokens may be justified. Additionally, consider replacing or supplementing with: (a) last 3-5 modified project files from git, (b) active branch name, (c) symbols from the user's recent working set via hook state.
- Final severity: P2

### P2-004: Startup highlights lack diversity controls
- Dimension: maintainability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:363-364]
- Impact: The query uses `GROUP BY n.symbol_id` and `ORDER BY call_count DESC, n.start_line ASC`. There is no diversity constraint ensuring highlights come from different files or different parts of the codebase. Combined with the deduplication bug (same symbol appearing 3x), a single hot file can monopolize all 5 highlight slots. Even after dedup is fixed, the query could return 5 functions from the same file.
- Recommendation: Add a per-file limit (e.g., max 1-2 highlights per file) or apply a diversity heuristic that distributes highlights across different directories/languages.
- Final severity: P2

## Cross-Reference Results
### Core Protocols
- Confirmed: `session-prime.ts` correctly gates on `graphState` before injecting highlights (line 119-129). Token budget application via `truncateToTokenBudget` is sound (line 236).
- Contradictions: The purpose of startup highlights (orient AI on project structure) is contradicted by the actual output (test/vendor noise).
- Unknowns: Whether `code_graph_scan` applies exclusion patterns at index time that might mitigate P1-002 at the source.

### Overlay Protocols
- Confirmed: N/A (no overlay-specific protocols for this review target)
- Contradictions: N/A
- Unknowns: N/A

## Ruled Out
- **Token budget overflow**: The structural context at ~100 tokens is well within the 2000-token budget. No overflow risk.
- **Security concern with highlights**: The highlights expose file paths but these are local paths injected into the AI's context, not user-facing output. No security issue.
- **startup-brief.ts formatting bugs**: `compactPath()` and `formatHighlight()` are clean utility functions. No correctness issues found.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:350-379] -- queryStartupHighlights function
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:15-20] -- StartupHighlight interface
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:1-113] -- Full startup brief builder
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:1-254] -- Full session prime hook
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:8-10] -- Token budget constants

## Assessment
- Confirmed findings: 4
- New findings ratio: 1.00
- noveltyJustification: All 4 findings are new (first iteration covering node_selection and token_roi dimensions). Weighted: (2 * P1_weight_5.0 + 2 * P2_weight_1.0) / (2 * 5.0 + 2 * 1.0) = 12.0/12.0 = 1.00
- Dimensions addressed: node_selection, token_roi

## Reflection
- What worked: Reading the SQL query directly and cross-referencing with live session output provided clear evidence of the heuristic failure. The token budget constants in shared.ts gave exact numbers for ROI calculation.
- What did not work: N/A -- first iteration on these dimensions, all approaches were productive.
- Next adjustment: on_demand_comparison dimension should examine whether the highlights (even if fixed) add value beyond what `code_graph_query` and `code_graph_context` provide on demand.
