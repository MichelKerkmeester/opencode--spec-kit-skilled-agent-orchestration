# Deep Review Report — Code Graph Session Start Injection Usefulness

## 1. Executive Summary

**Verdict: PASS** | hasAdvisories=true | Updated: 2026-04-02

All 3 P1 findings remediated in Phase 028. The 4 P2 advisories were addressed earlier (P2-001 orientation note, P2-002 diversity CTE, P2-003 configurable count). P2-004 (spec traceability) resolved via DR-017 and spec.md update.

| Severity | Original | Resolved | Active |
|----------|---------|----------|--------|
| P0 (Blockers) | 0 | 0 | 0 |
| P1 (Required) | 3 | 3 | 0 |
| P2 (Suggestions) | 4 | 4 | 0 |

**Review scope**: 3 files, 6 custom dimensions, 3 iterations, all dimensions covered.

---

## 2. Planning Trigger

`/spec_kit:plan` is recommended to address the 3 P1 findings before shipping further iterations.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 3, "P2": 4 },
  "remediationWorkstreams": [
    "WS-1: Fix queryStartupHighlights SQL (P1-001, P1-002, P1-003)",
    "WS-2: Reassess highlights value proposition (P2-001 through P2-004)"
  ],
  "specSeed": "028-startup-highlights-remediation",
  "planSeed": "Fix SQL GROUP BY, add path exclusion, replace outgoing-call heuristic"
}
```

---

## 3. Active Finding Registry

### P1-001: Duplicate Highlights Due to GROUP BY on symbol_id
- **Dimension**: deduplication (correctness)
- **File**: `code-graph-db.ts:363`
- **Evidence**: SQL `GROUP BY n.symbol_id` produces rows with identical `(name, kind, file_path)` tuples. `formatHighlight()` at `startup-brief.ts:42` renders only those display fields. Live output: `test_specific` appeared 3 times identically, wasting 2 of 5 highlight slots.
- **Impact**: 60% of highlights wasted on duplicates in observed session.
- **Fix**: Change to `GROUP BY n.name, n.kind, n.file_path` with `SUM(...)` aggregation.
- **Disposition**: Active

### P1-002: No Path Exclusion Filters for Vendored/Test Code
- **Dimension**: node_selection (correctness)
- **File**: `code-graph-db.ts:362`
- **Evidence**: WHERE clause filters only by `n.kind`. No filtering of `site-packages/`, `node_modules/`, `.venv/`, `tests/`, `test_` paths. Live output: 4/5 highlights from non-project code (`special/tests/test_legendre.py`, `site-packages/yaml/scanner.py`).
- **Impact**: Highlights dominated by irrelevant vendored/test code; only 1 of 5 was project code.
- **Fix**: Add `WHERE n.file_path NOT LIKE '%site-packages%' AND n.file_path NOT LIKE '%node_modules%' AND n.file_path NOT LIKE '%/tests/%'` (or configurable exclusion list).
- **Disposition**: Active (merges P1-002 + P1-004 from iterations 1-2)

### P1-003: Outgoing Call Count Heuristic Surfaces Wrong Nodes
- **Dimension**: node_selection (correctness)
- **File**: `code-graph-db.ts:353-364`
- **Evidence**: `ORDER BY call_count DESC` counts outgoing CALLS edges (source_id = symbol_id). This surfaces "chatty callers" — functions that call many others — not architecturally important nodes. A test method calling 51 functions is noisy, not important. Live evidence: `test_specific` with 51 outgoing calls is a test harness, not an entry point.
- **Impact**: The heuristic fundamentally misidentifies what makes a node "interesting" for session orientation.
- **Fix**: Replace with incoming-call-count (most-called = most depended upon), or PageRank centrality, or recency-weighted scoring via `code_files.file_mtime_ms`.
- **Disposition**: Active (absorbs P2-007 from iteration 3)

### P2-001: Highlights Provide No Value Over On-Demand MCP Tools
- **Dimension**: on_demand_comparison
- **File**: `startup-brief.ts:65-73`, `session-prime.ts:118-129`
- **Evidence**: Every capability of the proactive injection is available on-demand: scale stats via `code_graph_status`, neighborhoods via `code_graph_context`, structural queries via `code_graph_query`. On-demand is *superior* because it is task-targeted. The only advantage (saving one tool call) is marginal — the AI already knows these tools exist from the Session Priming section.
- **Impact**: ~100 tokens consumed unconditionally with information the AI didn't use and could get on-demand if needed.
- **Fix**: Consider removing the highlights section entirely, or replace with higher-signal data (recent git activity, active branch, last-session working set).
- **Disposition**: Active (merges P2-001 + P2-005 from iterations 1 and 3)

### P2-002: No Diversity Controls in Highlight Selection
- **Dimension**: node_selection (maintainability)
- **File**: `code-graph-db.ts:363-364`
- **Evidence**: No per-file limit or directory distribution constraint. A single hot file can monopolize all 5 highlight slots. No configurable exclusion mechanism for `node_modules/`, `dist/`, `build/`.
- **Fix**: Add per-file limit (max 1-2 per file) and configurable exclusion list.
- **Disposition**: Active (merges P2-002 + P2-004 from iterations 1 and 2)

### P2-003: Structural Context Token ROI Is Near Zero
- **Dimension**: token_roi
- **File**: `session-prime.ts:118-129`, `shared.ts:10`
- **Evidence**: ~100 tokens of the 2000-token `SESSION_PRIME_TOKEN_BUDGET` (~5%). While cost is low, information density is near-zero when highlights are test/vendored noise. The aggregate stats line is informational but not actionable.
- **Fix**: After fixing P1s, reassess ROI. If highlights become project-relevant, the ~100 tokens may be justified. Otherwise, replace with: (a) last 3-5 modified project files from git, (b) active branch name, (c) symbols from user's recent working set.
- **Disposition**: Active

### P2-004: Structural Context Section Not Traceable to Spec Requirements
- **Dimension**: architectural_alignment
- **File**: `spec.md:99-115`, `startup-brief.ts:47-87`
- **Evidence**: Spec describes SessionStart source=startup as "tool overview + stale-index detection." The highlights section is not mentioned. No DR specifically requires or justifies startup highlights. The tool overview and stale-index detection sections ARE traceable; the highlights are not.
- **Fix**: Either add a spec requirement/DR justifying highlights, or remove the section.
- **Disposition**: Active

---

## 4. Remediation Workstreams

### WS-1: Fix queryStartupHighlights SQL (P1-001, P1-002, P1-003)
**Priority**: Required before next release
1. Fix GROUP BY clause: `GROUP BY n.name, n.kind, n.file_path` (P1-001)
2. Add WHERE path exclusion filters for vendored/test code (P1-002)
3. Replace outgoing-call heuristic with incoming-call-count or multi-signal ranking (P1-003)

### WS-2: Reassess Highlights Value Proposition (P2-001 through P2-004)
**Priority**: Advisory — after WS-1, evaluate if highlights are worth keeping
1. After WS-1 fixes, test whether highlights become useful
2. If still low-value, consider removing the section entirely
3. If keeping, add diversity controls (P2-002), document spec rationale (P2-004)
4. Consider replacing with higher-signal alternatives: recent git activity, branch context, working set

---

## 5. Spec Seed

- Add spec requirement for startup highlights (if keeping): "SessionStart source=startup MAY inject top-N architecturally significant project symbols to orient the AI on the codebase structure."
- Add acceptance criteria: "Highlights must exclude vendored/test code, deduplicate by display fields, and surface nodes that are architecturally central (incoming callers, not outgoing calls)."
- Add decision record DR-017: "Startup highlights rationale and retention decision."

---

## 6. Plan Seed

1. **Task 1**: Modify `queryStartupHighlights()` — fix GROUP BY, add path exclusions, switch to incoming-call heuristic
2. **Task 2**: Add diversity controls — per-file limit, directory distribution
3. **Task 3**: Integration test — verify highlights produce project-relevant output on the actual codebase
4. **Task 4**: Spec update — document highlights rationale or remove section
5. **Task 5**: Token ROI reassessment — compare before/after signal quality

---

## 7. Traceability Status

### Core Protocols
| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | PARTIAL | Tool overview and stale-index detection are traceable. Highlights section is NOT traceable to any spec requirement. |

### Overlay Protocols
Not applicable for this review target.

---

## 8. Deferred Items

- **Session continuity section** (`buildSessionContinuity()` in startup-brief.ts:89-103): Reviewed and found genuinely useful — provides last spec folder and session summary. Not a finding.
- **Stale index detection** (session-prime.ts:139-153): Reviewed and found genuinely useful — traceable to spec. Not a finding.
- **Tool overview section** (session-prime.ts:101-115): Reviewed and found genuinely useful — traceable to spec. Not a finding.
- **handleCompact path**: Out of scope for this review.

---

## 9. Audit Appendix

### Convergence Summary
- Iterations: 3 (of 7 max)
- Stop reason: All 6 dimensions covered with coverage_age >= 1, findings well-evidenced
- Ratios: 1.00 → 0.71 → 1.00 (high because each iteration covered new dimensions — expected for first-pass coverage)

### Dimension Coverage
| Dimension | Iteration | Status |
|-----------|-----------|--------|
| signal_quality | 1 | Reviewed |
| deduplication | 1 | Reviewed |
| node_selection | 2 | Reviewed |
| token_roi | 2 | Reviewed |
| on_demand_comparison | 3 | Reviewed |
| architectural_alignment | 3 | Reviewed |

### Ruled-Out Claims
- Session-prime.ts calling queryStartupHighlights multiple times (it doesn't)
- formatHighlight rendering duplicates (it doesn't — maps 1:1)
- Token budget overflow from highlights (~100 tokens, well within 2000 budget)
- Security concern with file path exposure (local paths in AI context, not user-facing)
- Formatting bugs in startup-brief.ts utilities (clean code)
- Session continuity section being low-value (it's genuinely useful)
- Stale index detection being low-value (it's genuinely useful and traceable)

### Sources Reviewed
- `code-graph-db.ts:350-379` — queryStartupHighlights function
- `code-graph-db.ts:15-20` — StartupHighlight interface  
- `code-graph-db.ts:0-150` — Schema, table definitions
- `startup-brief.ts:1-113` — Full startup brief builder
- `session-prime.ts:1-253` — Full SessionStart hook handler
- `spec.md:86-167` — Solution architecture, SessionStart description
- `decision-record.md:39-161` — DR-002 through DR-012

### Cross-Reference Appendix

#### Core Protocols
- **spec_code**: Tool overview (session-prime.ts:101-115) traces to spec requirement. Stale-index detection (session-prime.ts:139-153) traces to spec requirement. Highlights section (startup-brief.ts:47-87) has NO spec traceability.
- **DR alignment**: DR-002 (hook transport) — followed. DR-003 (direct import) — followed. DR-010 (CocoIndex separation) — followed. DR-012 (token budget) — followed but budget spent without ROI on highlights.

#### Overlay Protocols
Not applicable.
