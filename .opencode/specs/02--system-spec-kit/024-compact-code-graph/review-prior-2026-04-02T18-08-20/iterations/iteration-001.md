# Review Iteration 1: signal_quality, deduplication - Startup Highlights Analysis

## Focus
Two dimensions reviewed in a single pass: (1) signal_quality -- whether the startup highlights provide actionable intelligence to the AI; (2) deduplication -- why `test_specific` appears 3 times identically in the output.

## Scope
- Review target: Code Graph session start injection (hook output at startup)
- Files reviewed:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (lines 350-379: `queryStartupHighlights()`)
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` (full file: `buildGraphOutline()`, `formatHighlight()`)
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (full file: `handleStartup()`)
- Spec refs: Phase 026 (session start injection debug)
- Dimensions: signal_quality, deduplication

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| code-graph-db.ts (queryStartupHighlights) | 5/10 | N/A | 7/10 | 6/10 |
| startup-brief.ts | 7/10 | N/A | 7/10 | 8/10 |
| session-prime.ts (handleStartup) | 8/10 | N/A | 7/10 | 8/10 |

## Findings

### P1-001: Duplicate Highlights Due to GROUP BY on symbol_id Instead of Display Fields

- Dimension: correctness
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:363]
- Cross-reference: [SOURCE: Live session output showing `test_specific (method) - special/tests/test_legendre.py [calls: 51]` x3]
- Impact: Users see visually identical highlight lines, wasting 2 of 5 highlight slots and creating the appearance of a broken system. In the observed session, 3 of 5 highlights were duplicates, reducing useful highlights from 5 to 3.

**Root Cause Analysis:**

The SQL query at line 363 uses `GROUP BY n.symbol_id`. The `code_nodes` table enforces `symbol_id TEXT NOT NULL UNIQUE` (line 43), so each row has a unique symbol_id. However, a single Python method like `test_specific` can generate multiple `code_nodes` rows with different `symbol_id` values when the indexer treats each overload, decorator variant, or re-parsed occurrence as a separate symbol. These distinct symbol_ids share identical `name`, `kind`, and `file_path`.

The `formatHighlight()` function in startup-brief.ts (line 42) renders only `name`, `kind`, `filePath`, and `callCount` -- never `symbol_id`. So three symbols with different IDs but the same display-visible fields produce three identical output lines.

**Fix**: Change the GROUP BY clause from `GROUP BY n.symbol_id` to `GROUP BY n.name, n.kind, n.file_path` and use `MAX(call_count)` or `SUM(...)` as the aggregation. Alternatively, add deduplication in `formatHighlight()` or `buildGraphOutline()`.

- Skeptic: Could the three entries have different call counts that happen to be the same? Checked: all three show `[calls: 51]`, confirming they are visually identical. Even if counts differed, showing three lines for the same symbol name in the same file is confusing.
- Referee: Confirmed P1. This is a correctness bug in the query that produces user-facing duplicate output. It degrades the signal quality of every session start. Not P0 because it does not cause data loss or security exposure; it wastes highlight slots.

```json
{"type":"claim-adjudication","claim":"queryStartupHighlights() produces duplicate highlight lines because GROUP BY operates on symbol_id (unique per node row) rather than the display-visible fields (name, kind, file_path) that formatHighlight() renders.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:363",".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:43",".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:42"],"counterevidenceSought":"Checked whether symbol_id uniqueness in code_nodes table prevents duplicates. It does not, because multiple symbol_ids can map to the same (name, kind, file_path) tuple. Verified live output confirms 3 identical lines.","alternativeExplanation":"The three entries could represent genuinely different symbols that happen to share name/kind/file. However, displaying them identically without disambiguation is still a bug in the output layer even if the data model is correct.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If the indexer is proven to never create multiple symbol_ids for the same (name, kind, file_path) tuple, the bug would shift to a data quality issue in the indexer rather than a query bug. Severity would remain P1 either way."}
```

### P1-002: Startup Highlights Surface Vendored/Test Code Instead of Project Code

- Dimension: correctness
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:362]
- Cross-reference: [SOURCE: Live session output; SOURCE: strategy Known Context section]
- Impact: The "top by call count" heuristic surfaces high-connectivity nodes from vendored dependencies (`site-packages/yaml/scanner.py`) and test files (`special/tests/test_legendre.py`) rather than user project code. In the observed session, 4 of 5 highlights were from non-project code. The AI completely ignored these highlights, going directly to CocoIndex for the user's actual query.

**Root Cause Analysis:**

The SQL WHERE clause at line 362 filters only by `kind` (class, function, method, etc.) but applies no filtering for:
- Vendored directories (`node_modules/`, `site-packages/`, `.venv/`, `vendor/`)
- Test files (`**/test_*`, `**/tests/`, `**/*.test.*`, `**/*.spec.*`)
- Generated files, build outputs, or cache directories

In a workspace with 15,488 files (as observed), vendored Python packages and test suites vastly outnumber project source files. The ORDER BY `call_count DESC` naturally favors these high-connectivity non-project files.

**Fix**: Add a WHERE clause excluding common vendored/test paths: `WHERE n.file_path NOT LIKE '%/node_modules/%' AND n.file_path NOT LIKE '%/site-packages/%' AND n.file_path NOT LIKE '%/.venv/%'`. Optionally, prefer files matching a configurable project root prefix.

- Skeptic: Could vendored code highlights be useful? In some edge cases (debugging a dependency), yes. But for session start priming, the purpose is to orient the AI to the project structure, not to highlight third-party test utilities.
- Referee: Confirmed P1. This is the primary reason the highlights provide zero actionable signal. The fix is straightforward (path exclusion patterns). Not P0 because the AI can function without highlights; it merely wastes token budget and provides no value.

```json
{"type":"claim-adjudication","claim":"queryStartupHighlights() surfaces vendored dependency and test file nodes instead of project code because the SQL WHERE clause has no path-based exclusion filters.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:362","Live session output showing 4/5 highlights from non-project code"],"counterevidenceSought":"Checked whether the code_graph_scan indexer excludes vendored paths before insertion. It may partially exclude via glob patterns, but clearly test_legendre.py and yaml/scanner.py were indexed. The query is the last line of defense and has no exclusion logic.","alternativeExplanation":"The indexer is supposed to exclude these paths but failed. Even so, the query should have defense-in-depth exclusion for common non-project paths.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"If the indexer's exclude patterns are fixed to never index vendored/test code, the query-side exclusion becomes redundant (but still advisable as defense-in-depth). Severity could drop to P2 as a hardening suggestion."}
```

### P2-001: Startup Highlights Provide No Actionable Signal for Task Routing

- Dimension: signal_quality
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:65-73]
- Impact: Even if deduplication and vendored-path issues are fixed, "top 5 nodes by call count" is a generic connectivity metric that does not help the AI make better decisions. The AI needs to know what the user's project does, what the entry points are, or what was recently changed -- not which functions have the most outgoing edges. In the observed session, the AI went straight to CocoIndex semantic search, demonstrating that the highlights added no decision-making value.
- Final severity: P2

### P2-002: No Exclude Patterns for node_modules or Common Build Artifacts in Highlight Query

- Dimension: maintainability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:353-366]
- Impact: The query has no exclusion for `node_modules/`, `dist/`, `build/`, `.next/`, or other common artifact directories. While related to P1-002, this is a separate maintainability concern: as new vendored or build directories appear, the query will continue to surface irrelevant nodes without a configurable exclusion mechanism.
- Final severity: P2

## Cross-Reference Results
### Core Protocols
- Confirmed: The session-prime.ts hook correctly gates on `buildStartupBrief` availability (line 118) and handles the empty/missing graph states (lines 124-128)
- Confirmed: Token budget truncation is applied (line 236) so highlights cannot overflow the context window
- Contradictions: The highlights are injected unconditionally when the graph is "ready" -- no quality check on whether highlights are actually useful

### Overlay Protocols
- Confirmed: startup-brief.ts correctly isolates graph logic from hook logic (clean separation of concerns)
- Contradictions: None found
- Unknowns: Whether the code_graph_scan indexer's exclude patterns are supposed to prevent vendored code from entering the database

## Ruled Out
- **Session-prime.ts hook logic bug**: Investigated whether the hook incorrectly calls `queryStartupHighlights` multiple times or concatenates results. It does not -- the duplication is entirely in the SQL result set from code-graph-db.ts.
- **formatHighlight rendering bug**: Investigated whether the formatter adds duplicate lines. It does not -- it maps 1:1 from query results.
- **Token budget overflow**: Investigated whether highlights could consume excessive tokens. The `truncateToTokenBudget()` call at line 236 prevents this.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:0-150] -- Schema, table definitions
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:350-379] -- queryStartupHighlights function
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:1-114] -- Full file
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:1-254] -- Full file
- [SOURCE: .opencode/skill/sk-code--review/references/review_core.md:1-80] -- Severity definitions

## Assessment
- Confirmed findings: 4 (P0: 0, P1: 2, P2: 2)
- New findings ratio: 1.00
- noveltyJustification: First iteration; all 4 findings are new (weighted: 2*5.0 + 2*1.0 = 12.0 new out of 12.0 total)
- Dimensions addressed: signal_quality, deduplication

## Reflection
- What worked: Reading the SQL query directly and cross-referencing with live output evidence was highly effective. The GROUP BY mismatch was immediately visible when comparing the UNIQUE constraint on symbol_id with the display fields used in formatHighlight.
- What did not work: N/A (first iteration)
- Next adjustment: For next iteration, investigate the node_selection heuristic deeper -- what alternative selection strategies could replace "top by call count" to provide genuinely actionable highlights (e.g., recently changed files, entry points, files matching common task patterns).
