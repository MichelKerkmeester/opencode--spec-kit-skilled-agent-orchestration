# Iteration 067
## Focus
Event engine, group dispatch, and queue-based orchestration.

## Questions Evaluated
- What can the event engine teach us about loop orchestration?
- How are event groups and retries represented?
- What makes the dispatch model easy to reason about?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/flow/types.py:15-99`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/flow/types.py:123-146`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/flow/core.py:17-175`

## Analysis
The flow engine is a compact orchestration model. It gives every event a stable id, groups events by hashed parent sets, tracks task ids, and processes the queue asynchronously with clear `DISPATCH`, `GOTO`, `ABORT`, and `INPUT` behaviors. The debug string also helps explain loop structure without having to inspect the whole runtime state manually. That is a strong conceptual model for our own iterative research and review orchestration, even though this repo keeps the state in memory rather than on disk.

## Findings
- The dispatch model is explicit and branch-aware.
- Group hashing and event ids make orchestration stable and debuggable.
- The engine separates control flow from the underlying task implementation.

## Compatibility Impact
We should borrow the orchestration ideas, but keep our canonical state externalized in files so hook and non-hook CLIs can replay the same lineage.

## Next Focus
Inspect the registry and workflow auto-discovery mechanisms.
