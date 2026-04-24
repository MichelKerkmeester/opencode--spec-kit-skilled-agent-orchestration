# Iteration 23 - Dimension: security - Subset: 010+012

## Dispatcher
- iteration: 23 of 50
- dispatcher: cli-copilot (model gpt-5.4, effort high, parallel v2)
- timestamp: 2026-04-15T18:31:56.558Z

## Files Reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/implementation-summary.md`

## Findings - New This Iteration
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- `010-search-and-routing-tuning` still leaves resolved security-boundary choices phrased as open questions in completed phase specs. `002-content-routing-accuracy/005-task-update-merge-safety/spec.md:36` still says the guard-placement decision is open, even though `.../implementation-summary.md:89-91` records the chosen design (whole-document prevalidation in the merge module plus handler rejection reuse). `003-graph-metadata-validation/007-entity-quality-improvements/spec.md:36` likewise leaves the scope-guard shape open after `.../implementation-summary.md:88-90` records the final canonical-doc exception strategy. This is not a live security break, but it weakens the packet-local threat-model narrative because reviewers must leave `spec.md` to learn the actual protection boundary.

## Findings - Confirming / Re-validating Prior
- Revalidated the existing 012 P1 blocker from iteration 16: `012-command-graph-consolidation/spec.md:303-304` and `checklist.md:120-123` still present `/spec_kit:plan --intake-only` halt, resume reroute, and idempotence as closed security/safety behavior, while `tasks.md:228-230` and `implementation-summary.md:251` still say the corresponding manual integration tests were deferred to the user. No packet-local downgrade or superseding evidence was found in this pass.

## Traceability Checks
- `spec_code` (core): **partial** - 010's completed security phases still carry stale open-question text, and 012 still reproduces the previously logged runtime-proof gap.
- `checklist_evidence` (core): **partial** - 010 checklist evidence remains aligned with the implemented guards, but 012 checklist/task closure still overstates runtime proof versus deferred manual tests.
- `agent_cross_runtime` (overlay): **notApplicable** - this pass stayed on packet-local security contracts rather than cross-runtime mirror parity.

## Confirmed-Clean Surfaces
- `010-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety/checklist.md:17-21` remains aligned with the implementation summary's pre-mutation validation and explicit rejection-path decisions.
- `010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/checklist.md:18-21` remains aligned with the implementation summary's scoped canonical-doc rejection and zero-leak verification story.

## Next Focus (recommendation)
Probe whether 012's deferred intake-lock/manual-routing proofs are intentionally downgraded anywhere in its ADR or YAML-contract surfaces, or whether the packet still claims a stronger release-ready security posture than it has actually demonstrated.
