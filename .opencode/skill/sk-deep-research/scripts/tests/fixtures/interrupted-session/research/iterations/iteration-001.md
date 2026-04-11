# Iteration 1: Map crash-safe resume requirements

## Focus
Identify which research-loop artifacts are durable enough to trust after an interrupted write.

## Findings
- Fully written iteration markdown can be recovered as durable evidence.
- A malformed JSONL tail record must not be treated as a completed iteration.
- Resume semantics should anchor to the last complete iteration instead of reconstructing missing state.

## Ruled Out
- Treating any parseable fragment from the interrupted write as authoritative without explicit lenient mode.

## Dead Ends
- Assuming dashboard or strategy freshness proves the state log tail is intact.

## Sources Consulted
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
- .opencode/skill/sk-deep-research/assets/deep_research_strategy.md
- research/deep-research-state.jsonl

## Reflection
- What worked and why: Comparing durable files against the state log made the last trustworthy boundary obvious.
- What did not work and why: Looking only at top-level status fields hid the mid-write corruption risk.
- What I would do differently: Start by classifying artifacts by durability before interpreting any progress markers.

## Recommended Next Focus
Probe how lenient recovery should preserve iterations 1-2 while isolating the interrupted iteration 3 tail.
