# Iteration 051
## Focus
Canonical lineage schema proposal grounded in observed gaps.

## Questions Evaluated
- Which minimum fields are required to represent evolution safely?
- How can schema remain file-first and runtime-agnostic?

## Evidence
- `.opencode/skill/sk-deep-research/references/state_format.md:219-231`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:119-129`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:124-132`

## Analysis
Current schema supports operational continuity but not lineage genealogy. A minimal extension can preserve backward compatibility while enabling explicit branch semantics.

## Findings
- Add fields: `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`.
- Emit lifecycle events for `restart_started`, `fork_started`, `continued_session`, `archive_snapshot_created`.

## Compatibility Impact
Backward-compatible if introduced as optional fields with dual-read behavior.

## Next Focus
Define deterministic reducer responsibilities and file ownership boundaries.

