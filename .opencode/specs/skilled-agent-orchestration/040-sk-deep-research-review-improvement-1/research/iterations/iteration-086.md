# Iteration 086
## Focus
Progress-based schedules and phase-aware control.

## Questions Evaluated
- How does the loop change learning behavior over time?
- What does the training loop treat as a phase boundary?
- How can that inform the internal research/review lifecycle?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:438-447`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:516-532`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/autoresearch-master/train.py:554-604`

## Analysis
Autoresearch uses training progress to control learning rate, momentum, and weight decay. That gives the loop a phase structure without introducing a complicated scheduler framework. It also explicitly skips counting warmup and compilation in the time budget, which avoids false progress.

The internal deep-research/deep-review system should do something similar, but for lifecycle rather than optimization. Phases like setup, iterate, stabilize, synthesize, and continue should be explicit and replayable. If a session is paused, restarted, or forked, the phase model should tell us exactly where we are and what is supposed to happen next.

## Findings
- Progress-based control is simpler than a large scheduler framework.
- Time and phase are related, but they are not the same thing.
- Warmup exclusion is a good example of protecting the measurement boundary.

## Compatibility Impact
- Phase logic built from packet state can run consistently in any CLI runtime.
- The internal system should prefer explicit lifecycle phases over hidden heuristics.

## Next Focus
Check the fixed preprocessing and evaluation contract, because that is what keeps the metric trustworthy.
