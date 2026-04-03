# Iteration 085
## Focus
Optimizer design as a pattern for machine-owned state.

## Questions Evaluated
- How does autoresearch separate parameter families?
- Why does it keep optimizer state in compile-safe scalars and buffers?
- What should the internal system learn from that separation?

## Evidence
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/train.py:236-266`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/train.py:305-426`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/train.py:559-563`

## Analysis
MuonAdamW splits parameters into clear groups and keeps its update state in explicit tensors that the compiled model can reuse safely. That matters because it gives the optimizer a stable internal contract even when values change every step. The optimizer is stateful, but not fuzzy.

That is the right idea for the internal packet system too. The reducer should own machine-derived fields separately from human-authored narrative. The system should know which state is authoritative, which is derived, and which is just commentary. Without that boundary, resume and replay behavior become guesswork.

## Findings
- Grouping parameters by role keeps the update logic understandable.
- Compile-safe tensors are a strong example of explicit machine-owned state.
- State can be dynamic without becoming opaque.

## Compatibility Impact
- This pattern translates well to non-hook CLIs because it depends on reconstructible state, not hidden callbacks.
- The internal system can mirror this by making reducer-owned state explicit and serializable.

## Next Focus
Study the progress-based schedules, because they show how a loop can change behavior over time without changing its contract.
