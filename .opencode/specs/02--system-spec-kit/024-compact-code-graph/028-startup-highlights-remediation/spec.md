---
title: "Spec: Startup Highlights Remediation [024/028]"
description: "Fix 3 P1 findings in queryStartupHighlights(): deduplication by display fields, path exclusion for vendored/test code, and incoming-call-count heuristic."
trigger_phrases:
  - "startup highlights"
  - "028"
  - "remediation"
  - "queryStartupHighlights"
  - "highlights fix"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 28 (`028-startup-highlights-remediation`) |
| **Predecessor** | `027-opencode-structural-priming` |
| **Successor** | `029-review-remediation` |
| **Handoff Criteria** | Startup highlights are deduplicated, filtered to project-relevant files, and ranked by incoming architectural importance |

# Spec: Startup Highlights Remediation

<!-- ANCHOR:metadata -->
Fix 3 P1 correctness findings from the deep review (2026-04-02) in `queryStartupHighlights()`. The function currently produces low-signal output due to duplicate entries, vendored/test code domination, and a wrong ranking heuristic. See DR-017.

## 1. METADATA

- **Phase**: 028 (child of 024-compact-code-graph)
- **Level**: 2 (100-499 LOC, QA validation needed)
- **Origin**: Deep review report at `../review/review-report.md`
- **Decision**: DR-017 — Startup Highlights Retention with Quality Gates
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE

<!-- ANCHOR:problem -->
### Problem Statement

The `queryStartupHighlights()` function in `code-graph-db.ts` has 3 correctness issues that render the session start highlights useless:

1. **P1-001: Duplicate highlights** — `GROUP BY n.symbol_id` produces rows with identical `(name, kind, file_path)` tuples because multiple symbol_ids can map to the same display fields. In a live session, `test_specific` appeared 3 times identically, wasting 2 of 5 slots.

2. **P1-002: Vendored/test code dominates** — The WHERE clause filters only by `n.kind` with no path exclusion. In a 15,488-file workspace, vendored packages (`site-packages/yaml/scanner.py`) and test files (`special/tests/test_legendre.py`) occupied 4 of 5 highlight slots. Only 1 highlight was project code.

3. **P1-003: Wrong ranking heuristic** — `ORDER BY call_count DESC` counts outgoing CALLS edges (source_id = symbol_id), surfacing "chatty callers" — functions that call many others. Test harnesses score high because they call many functions. The heuristic should surface nodes that are *called by* many others (incoming calls = architectural importance).
<!-- /ANCHOR:problem -->

## 3. SCOPE

<!-- ANCHOR:scope -->
### In Scope
- `queryStartupHighlights()` in `code-graph-db.ts` — SQL query rewrite
- Integration test to verify highlights produce project-relevant output

### Out of Scope
- `startup-brief.ts` — P2 fixes already applied (diversity CTE, configurable count, orientation note)
- `session-prime.ts` — No changes needed
- Other code graph functions
- Indexer-level exclusion patterns (defense-in-depth, not primary fix)

**Files to Change**

| File | Change |
|------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` | Rewrite `queryStartupHighlights()` SQL |
| `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts` | Add test for dedup, exclusion, incoming-call ranking |
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS

<!-- ANCHOR:requirements -->
### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Startup highlights deduplicate by display fields | Returned output contains no duplicate `(name, kind, file_path)` tuples |
| REQ-002 | Vendored and generated directories are excluded from startup highlights | `site-packages`, `node_modules`, `.venv`, `vendor`, `dist`, `build`, and `__pycache__` do not appear in the top results |
| REQ-003 | Test-heavy paths are excluded from startup highlights | `tests`, `test_`, and `__tests__` entries do not appear in the top results |
| REQ-004 | Ranking uses incoming architectural importance rather than outgoing chatter | The query joins call edges on `target_id` and surfaces depended-upon symbols first |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Existing per-file diversity remains intact after the rewrite | The ranked CTE still caps startup highlights to two entries per file |
| REQ-006 | The remediation stays scoped to startup-highlight quality fixes | No unrelated startup-hook or bootstrap-contract surfaces are claimed by this phase |
| REQ-007 | Focused verification proves the new query shape works in practice | Startup-brief tests and live query evidence confirm deduplication, filtering, and ranking behavior |
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA

<!-- ANCHOR:success-criteria -->
- **SC-001**: Running `queryStartupHighlights(5)` on the current codebase returns zero duplicates and zero vendored/test paths.
- **SC-002**: The top startup highlights are recognizable project entry points or depended-upon symbols.
- **SC-003**: Existing `startup-brief.vitest.ts` verification remains green after the query rewrite.
- **SC-004**: Packet documentation stays aligned to the same deep-review remediation scope and does not reopen unrelated packet work.

### Acceptance Scenarios

- **Given** duplicate symbol rows that share the same display tuple, **When** `queryStartupHighlights(5)` runs, **Then** only one highlight line for that tuple is returned.
- **Given** vendored or test-code paths in the graph, **When** highlights are queried, **Then** those paths are excluded from the returned top results.
- **Given** symbols with many outgoing calls but low reuse, **When** ranking is computed, **Then** incoming architectural importance wins over chatty-caller volume.
- **Given** the existing diversity rule from the sibling startup brief work, **When** the query is rewritten, **Then** the max-two-results-per-file behavior remains intact.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES

<!-- ANCHOR:risks -->
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Incoming-call heuristic returns empty results (no edges indexed as CALLS with target_id) | Medium | High | Verify edge indexing direction in tree-sitter-parser.ts; fall back to outgoing if incoming is empty |
| Path exclusion is too aggressive (filters legitimate project files) | Low | Medium | Use conservative patterns; prefer false negatives over false positives |
| CTE composition with existing diversity CTE is complex | Low | Low | Flatten into single CTE chain; test with EXPLAIN QUERY PLAN |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None for this remediation slice. The implementation follows the deep-review findings and remains scoped to startup-highlight quality fixes only.
<!-- /ANCHOR:questions -->
