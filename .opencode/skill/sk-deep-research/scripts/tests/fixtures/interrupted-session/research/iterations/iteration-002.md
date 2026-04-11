# Iteration 2: Validate lenient recovery boundaries

## Focus
Define the smallest safe recovery surface that still lets the reducer resume after a crash.

## Findings
- Lenient recovery should salvage completed iterations without mutating the corrupted tail into a synthetic success.
- Partial iteration markdown may provide operator context, but it is not equivalent to a completed iteration result.
- Reducer-owned next focus should steer resume work toward corruption triage before new research branches.

## Ruled Out
- Replaying the interrupted iteration automatically as if the missing JSON fields had been written.

## Dead Ends
- Using only chronological order to decide safety without checking whether the final write completed.

## Sources Consulted
- research/deep-research-state.jsonl
- research/iterations/iteration-001.md
- research/iterations/iteration-002.md

## Reflection
- What worked and why: Contrasting strict and lenient expectations clarified which outputs must stay fail closed.
- What did not work and why: Treating partial markdown as equivalent to JSONL state blurred the durability boundary.
- What I would do differently: Capture corruption metadata alongside the recovered registry so resume guidance is explicit.

## Recommended Next Focus
Inspect the interrupted iteration-003 artifacts and confirm they remain quarantine-only unless a lenient escape hatch is chosen.
