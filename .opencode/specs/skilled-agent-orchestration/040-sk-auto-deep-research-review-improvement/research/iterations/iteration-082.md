# Iteration 082
## Focus
Branch identity and append-only result logging as the experiment ledger.

## Questions Evaluated
- How does autoresearch separate one experiment from the next?
- What part of the loop captures keep/discard decisions?
- What should the internal system borrow, and what should it not copy directly?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:7-17`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:64-78`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:90-106`

## Analysis
Autoresearch uses a fresh git branch per run and an untracked `results.tsv` to record whether a change is kept, discarded, or crashes. That makes the experiment history simple to read and easy to reset. The branch is the coarse boundary, and the TSV is the fine-grained log.

For our internal deep-research/deep-review system, that is a useful idea, but branch state alone is not enough. We need explicit lineage IDs, parent-child links, and a canonical packet ledger so completed sessions can continue without relying on git history as the only source of truth.

## Findings
- Fresh branch per run is a clean way to isolate experimentation.
- `results.tsv` is a good low-friction ledger for keep/discard/crash outcomes.
- The repo has clear operator semantics, but it still lacks lineage-aware continuation.

## Compatibility Impact
- Branch + TSV logging is easy to use from any CLI because it is just git and plain text.
- The internal system can adopt the same simplicity while still adding richer packet lineage and recovery data.

## Next Focus
Examine how the fixed 5-minute budget shapes the meaning of "comparison" and "continuation".
