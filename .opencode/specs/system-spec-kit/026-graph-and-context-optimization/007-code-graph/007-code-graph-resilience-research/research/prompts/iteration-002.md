You are running iteration 2 of 7 in a deep-research loop on code-graph resilience.

# Iteration 2 — Staleness Signals + Threshold Candidates

## Research Questions
- Q1: Staleness signals — beyond mtime, what other signals indicate index staleness?
- Q2: Threshold derivation — how do existing tools (Sourcegraph, ctags) define stale?

## Required reads
1. Strategy + iteration 1 output
2. Code-graph scan implementation under `.opencode/skill/system-spec-kit/mcp_server/lib/` — focus on the function that determines if a file needs re-indexing
3. detect_changes implementation if exposed
4. Schema definitions (look for stale_at, last_scanned_at, file_hash columns)

## What to look for
- Signals beyond mtime: file content hash, size, schema version, dependency-of-dependency invalidation
- How `detect_changes` decides what's stale (per-file vs per-tree)
- Quantitative thresholds: hours since last scan? percent files changed? absolute file count?
- Are there existing mechanisms that auto-flag stale state vs require manual checking?
- What signals would let us classify fresh / soft-stale / hard-stale?

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-002.md`

Required sections: Summary, Signals Catalog (table with signal name + cost-to-compute + reliability), Threshold Candidates (proposed N1/N2 boundaries with rationale), Cross-References to iteration 1, Files Reviewed, Convergence Signals.

### 2. Delta JSON
Path: `research/deltas/iteration-002.json`. Schema mirrors iter 1 but with `research_questions_answered: ["Q1", "Q2"]`.

### 3. State log append
JSONL line to `research/deep-research-state.jsonl` with iteration:2.

## Constraints
- Read-only.
- Cite file:line.
- Threshold candidates must be defensible with quantitative basis (not just "feels right").
