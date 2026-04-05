# Iteration 090
## Focus
Integrated synthesis: what autoresearch-master teaches the internal deep-research/deep-review system.

## Questions Evaluated
- What are the strongest ideas worth adopting from autoresearch?
- What limitation remains after all the strong ideas are combined?
- How should the internal packet use this repo without copying it blindly?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:7-37`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:90-114`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:11-17`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:63-81`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:30-32`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:343-365`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/train.py:236-266`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/train.py:432-451`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/train.py:516-604`

## Analysis
autoresearch is a strong example of a tight autonomy loop: one small mutable file, one fixed metric, one branch per run, one append-only log, and one fixed time budget. That makes it easy to run, easy to compare, and easy to reason about. Its biggest strength is discipline.

Its biggest limitation, from the perspective of the internal deep-research/deep-review system, is that it is optimized for search over a scalar objective rather than for evolving lineage history. It knows how to keep or discard experiments, but it does not natively solve continuation across completed work, review history accumulation, or canonical reducer ownership. That is the missing piece we need to add internally.

## Findings
- The best lessons are contract clarity, fixed metric discipline, and a small mutable surface.
- The missing piece is lineage-aware continuation and deterministic state reduction.
- The repo is a good model for autonomy, but not a complete model for durable research/review history.

## Compatibility Impact
- The lessons remain fully compatible with hook and non-hook CLIs because they are built around files, git, and explicit contracts.
- The internal system should adopt the discipline, not the exact scope boundaries, of autoresearch.

## Next Focus
Convert these lessons into the internal packet's implementation priorities: lineage schema, reducer, and parity gates.
