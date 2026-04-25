You are running iteration 4 of 7 in a deep-research loop on code-graph resilience.

# Iteration 4 — Verification Battery Seeds + Canonical-Symbol Queries

## Research Questions
- Q5: Verification battery seeds — what are the canonical queries for this codebase that, if they fail, indicate a regression?

## Required reads
1. Strategy + iterations 1-3 outputs
2. Code-graph query API: locate `code_graph_query` implementation
3. MCP server tool registrations (well-known function names that must always resolve)
4. Existing skill_graph queries for patterns

## What to look for
- Canonical functions/symbols in this codebase that, if dropped from the index, indicate scope misconfiguration
- Sample queries that exercise different aspects of the graph (call edges, import edges, ref edges, define edges)
- MCP tool names + their handler functions (these MUST always resolve)
- Cross-package symbols that span scoring lanes / scanner / daemon boundaries
- Generic test fixtures that may legitimately not be indexed

## Output: gold queries seed list

Aim for ≥20 queries spanning these categories:
- 5+ MCP tool handler queries (e.g., "advisor_recommend handler", "code_graph_status handler")
- 5+ cross-module function queries (e.g., "skill-advisor scoring fusion")
- 5+ exported type / class queries
- 5+ regression-detection queries (queries designed to fail when an over-aggressive exclude rule drops canonical code)

Each query needs:
- query string
- expected_count (approx number of results, allow ±20% range)
- expected_top_K_symbols (top 3 symbol names that must appear)

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-004.md`

Required sections: Summary, Query Categories (table per category), Seed Queries List (≥20 with shape fields), Regression-Detection Queries (separate subsection), Files Reviewed, Convergence Signals.

### 2. Delta JSON
Path: `research/deltas/iteration-004.json`. Schema with `research_questions_answered: ["Q5"]` plus a `gold_queries: [...]` array containing the seed queries.

### 3. State log append
JSONL line to `research/deep-research-state.jsonl` with iteration:4.

## Constraints
- Read-only.
- Each query must cite the source file/symbol it's testing.
- Regression-detection queries must include rationale: "if this query fails, X is missing from the index".
