# Iteration 083
## Focus
The fixed 5-minute budget and why time-boxed experiments stay comparable.

## Questions Evaluated
- Why does autoresearch work as a loop instead of a one-off run?
- What makes the metric comparable across changes?
- What boundary should the internal system keep, even if it supports continuation?

## Evidence
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:17-19`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:63-65`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:23-35`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:108-114`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:30-32`

## Analysis
The 5-minute budget is the backbone of the experiment loop. It makes runs comparable even when architecture, batch size, or optimizer choices change. That is excellent for a model-training search loop because the metric is a single scalar and each run is meant to be judged quickly.

The internal research/review system should borrow the idea of a fixed iteration budget, but not the idea that completion ends the story. Here, time-boxing should shape each wave of research while leaving room for lineage continuation, because deep research and deep review are about accumulating durable understanding rather than optimizing one number.

## Findings
- Time-boxed runs make comparisons much easier.
- The metric stays meaningful because the evaluation envelope is fixed.
- A fixed budget is not the same as a closed history; the internal system still needs continuation branches.

## Compatibility Impact
- Budgeting by time works the same across hook and non-hook CLIs because it is derived from the packet and runtime, not from hidden agent memory.
- The internal loop can adopt the same discipline while keeping the packet as the canonical source of progress.

## Next Focus
Look at how the model and optimizer are structured so the mutable surface stays small but still expressive.
