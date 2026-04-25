# Strategy - 007-code-graph-resilience-research

## Goal

Run a 7-iteration deep-research loop investigating code-graph staleness, error resilience, recovery procedures, and exclude-rule confidence. Produce four concrete output deliverables that gate Phase B of the sibling 006 doctor packet.

## Charter

### Non-Goals
- Implementing the doctor command itself (006 packet's job)
- Re-implementing code_graph_scan
- Changing the SQLite schema or storage layout
- Cross-language resolver improvements

### Stop Conditions
- newFindingsRatio < 0.10 (convergence)
- 7 iterations complete
- 3 consecutive iterations with zero new findings (stuck recovery)

### Success Criteria
- 4 asset files materialized matching spec REQ-001..REQ-004 acceptance criteria
- research.md aggregates findings with ≥10 file:line citations
- decision-record.md captures threshold + tier choices with rationale
- Synthetic regression test passes (gold-queries.json catches dropped canonical symbol)

## Scope

### Investigation targets
- Code-graph implementation under `.opencode/skill/system-spec-kit/mcp_server/lib/...`
- Existing scan logs under `.opencode/specs/.../research/iteration-*.log`
- SQLite schema and on-disk storage layout
- Scanner config / exclude-rule surfaces

### Outputs (after synthesis)
- assets/code-graph-gold-queries.json — verification battery (≥20 queries)
- assets/staleness-model.md — fresh / soft-stale / hard-stale thresholds + actions
- assets/recovery-playbook.md — SQLite corruption / partial-scan / bad-apply procedures
- assets/exclude-rule-confidence.json — high/medium/low tier definitions

## Iteration Plan

| Iter | Focus | Research Questions |
|------|-------|-------------------|
| 1 | Failure-mode survey from existing scan logs | Q3 |
| 2 | Staleness signals + threshold candidates | Q1, Q2 |
| 3 | SQLite corruption recovery procedures | Q4 |
| 4 | Verification battery seeds | Q5 |
| 5 | Exclude-rule confidence tier definitions | Q6 |
| 6 | Edge weight drift + symbol resolution failures | Q7, Q8 |
| 7 | Synthesis + confidence-floor + self-healing | Q9, Q10 |

## Research Questions (from spec.md)

1. Staleness signals: beyond mtime, what other signals indicate index staleness?
2. Threshold derivation: how do existing tools (Sourcegraph, ctags) define stale?
3. Failure modes in scan logs: what classes of scan failure recur?
4. SQLite corruption recovery: what does sqlite3 .recover produce on a damaged code-graph DB?
5. Verification battery seeds: canonical queries for this codebase
6. Exclude-rule false-positive rate: tail-risk for high-tier patterns
7. Edge weight drift: do current edge weights need re-tuning over time?
8. Symbol resolution failure modes: where do current resolvers fail?
9. Confidence-floor signaling: under what conditions should we tell the user "your graph is unreliable"?
10. Self-healing thresholds: could the graph auto-trigger a partial re-scan?

## Dispatch Notes

- Executor: cli-copilot, model gpt-5.5, reasoningEffort high
- Concurrency: sequential within this packet
- Per-iteration prompt: research/prompts/iteration-NNN.md
- Per-iteration findings: research/iterations/iteration-NNN.md
- Per-iteration delta JSON: research/deltas/iteration-NNN.json
- State log: research/deep-research-state.jsonl
- Final outputs synthesized post-loop into research.md + decision-record.md + assets/*

## Known Context

- Code-graph implementation is in `.opencode/skill/system-spec-kit/mcp_server/` (TS package)
- Existing doctor command pattern: `.opencode/command/doctor/skill-advisor.md` (5-phase, mutation_boundaries.validator, per-run rollback)
- The 006 sibling packet's Phase B is gated on these outputs
