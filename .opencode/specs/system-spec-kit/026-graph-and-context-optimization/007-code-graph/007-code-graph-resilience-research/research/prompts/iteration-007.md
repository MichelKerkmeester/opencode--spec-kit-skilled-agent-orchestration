You are running iteration 7 of 7 (final synthesis) in a deep-research loop on code-graph resilience.

# Iteration 7 — Synthesis + Confidence-Floor + Self-Healing + Asset Materialization

## Research Questions
- Q9: Confidence-floor signaling — under what observable conditions should the doctor command tell the user "your graph is unreliable, do a full re-scan"?
- Q10: Self-healing thresholds — could the graph auto-trigger a partial re-scan when staleness exceeds a threshold, without operator intervention? What are the safety boundaries?

## Required reads
1. Strategy + ALL prior iteration outputs (1-6)
2. State log: `research/deep-research-state.jsonl`
3. All prior delta JSON files

## What to do (THIS IS THE SYNTHESIS ITERATION)

In addition to iteration 7's own findings (Q9 + Q10), synthesize the four required asset deliverables:

### Asset 1: Verification Battery JSON
Path: `assets/code-graph-gold-queries.json`

Build from iteration 4's seed queries. Must have ≥20 queries; each with `query`, `expected_count`, `expected_top_K_symbols`, `category` (mcp-tool|cross-module|exported-type|regression-detection), and `source_file:line`.

### Asset 2: Staleness Model
Path: `assets/staleness-model.md`

Build from iteration 2's threshold candidates. Must define `fresh` / `soft-stale` / `hard-stale` with action mapping and the iteration-2 confidence-floor signaling from this iteration's Q9 findings.

### Asset 3: Recovery Playbook
Path: `assets/recovery-playbook.md`

Build from iteration 3's procedures. Must cover SQLite corruption + partial-scan failure + bad-apply rollback. Each procedure idempotent with verification step.

### Asset 4: Exclude-Rule Confidence
Path: `assets/exclude-rule-confidence.json`

Build from iteration 5's tier definitions. Must have high/medium/low tiers with ≥5 patterns each + per-pattern rationale + false-positive examples.

### Plus: research.md and decision-record.md

`research/research.md` — aggregate findings across all iterations with ≥10 file:line citations.

`decision-record.md` (in packet root, NOT under research/) — captures threshold + tier choices with rationale and links to the 4 asset files.

## Iteration 7 Findings (Q9 + Q10)

In addition to the synthesis work, document new findings on:
- Confidence-floor signaling thresholds (when to tell user "graph is unreliable")
- Self-healing safety boundaries (when can we auto-trigger partial re-scan?)

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-007.md`

Required sections: Summary, Q9 Findings, Q10 Findings, Asset Materialization Status (which 4 + research.md + decision-record.md were written), Convergence Verdict, Files Reviewed, Convergence Signals.

Convergence Verdict block:
```
## Convergence Verdict
- newFindingsRatio: [number]
- research_questions_answered_total: 10/10
- assets_materialized: 4/4
- research_md_synthesized: true
- decision_record_written: true
- verdict: CONVERGED | PARTIAL | INCOMPLETE
- stop_reason: max_iterations | converged | all_questions_answered
```

### 2. Delta JSON
Path: `research/deltas/iteration-007.json`. Schema with `research_questions_answered: ["Q9", "Q10"]` plus an `assets_materialized` array.

### 3. State log append
JSONL line with iteration:7 and convergenceVerdict block.

### 4. Asset files (all four)
- `assets/code-graph-gold-queries.json`
- `assets/staleness-model.md`
- `assets/recovery-playbook.md`
- `assets/exclude-rule-confidence.json`

### 5. Research synthesis
- `research/research.md` (aggregated findings)
- `decision-record.md` (committed decisions, in packet root)

## Constraints
- Read-only on existing files; new files only under packet root + research/ + assets/.
- All 4 asset files MUST be created in this iteration.
- Synthesis must cite iteration source for each major decision.
- This is the final iteration — produce the deliverables, not just narrative.
