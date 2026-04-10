# Iteration 084
## Focus
The train.py knob surface: a small number of high-leverage controls.

## Questions Evaluated
- Which settings actually control behavior in the training loop?
- How much hidden coupling exists between the knobs?
- What design lesson does this give the internal system?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:32-40`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:128-147`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:236-266`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:432-451`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:469-506`

## Analysis
The model exposes a compact set of levers: depth, aspect ratio, head shape, window pattern, batch size, and learning rates. That is a healthy pattern because a researcher can reason about the system without navigating a giant config graph. The tradeoff is that several derived values depend on `DEPTH`, so the surface is simple but not independent.

That is a good analogy for the internal deep-research/deep-review system. We should keep the number of visible lifecycle knobs small, but any derived state should be explicit and machine-owned. If a knob changes lineage, state shape, or migration behavior, that dependency should be visible in one canonical place.

## Findings
- A small number of knobs can still drive a rich system.
- Derived config is acceptable as long as it is explicit and deterministic.
- Hidden coupling is manageable in a training loop, but it would be risky in a lineage system unless it is encoded clearly.

## Compatibility Impact
- A small config surface is easier to keep mirrored across CLIs and agent runtimes.
- The internal system should favor canonical config data over runtime-specific command flags.

## Next Focus
Inspect the optimizer and its state handling, because that is where deterministic machine-owned state becomes very visible.
