# Iteration 25 - Dimension: security - Subset: 010+012+014

## Dispatcher
- iteration: 25 of 50
- dispatcher: cli-copilot (model gpt-5.4, effort high, parallel v2)
- timestamp: 2026-04-15T18:38:35Z

## Files Reviewed
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-config.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-strategy.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-state.jsonl
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/decision-record.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/implementation-summary.md

## Findings - New This Iteration
### P0 Findings
- None.

### P1 Findings
1. **010/002/004 still tells operators that Tier 3 is always on and has no operator-controlled flag, which now contradicts 014's shipped opt-in/manual-review guard.** Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/spec.md:164-170` says docs must describe an "always-on Tier 3 contract" and must not imply a flag; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/checklist.md:91-96` closes the phase by asserting the active docs now describe Tier 3 as always on and that `SPECKIT_TIER3_ROUTING` is removed; but `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:59,103-104,158,179-180,256-257` ships the opposite contract (`SPECKIT_ROUTER_TIER3_ENABLED` default-off, scoped manual-review guard, and caller-authorized target protections). That leaves 010's operator guidance stale on a routing-control seam with direct safety implications.

```json
{
  "claim": "The 010/002/004 doc-alignment packet now misstates the live Tier 3 routing security contract by insisting Tier 3 is always on and has no operator-controlled flag, even though 014 ships Tier 3 as an explicit opt-in with a default-disable/manual-review guard.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/spec.md:164-170",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/checklist.md:91-96",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:59",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:103-104",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:158",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:179-180",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:256-257"
  ],
  "counterevidenceSought": "Checked the combined-review state log for an existing security finding on Tier 3 contract drift and found none. Also looked for an in-scope 010 caveat marking 004-doc-surface-alignment as historical-only, but its checklist still presents the wording as active runtime reality.",
  "alternativeExplanation": "If 010/002/004 were explicitly archived historical evidence, the always-on wording could be tolerated as time-scoped context. The packet instead closes the phase as current doc alignment, so readers are told the stale contract is still live.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade to P2 if an in-scope successor doc explicitly marks 010/002/004 as superseded historical guidance and points operators at the 014 planner-first contract for current routing behavior."
}
```

### P2 Findings
- **012 should add a planner-first caveat anywhere it repositions `/memory:save` as the canonical handover maintainer.** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md:53,104,273,314` frames `/memory:save` as owning handover maintenance via `handover_state` routing, but `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:59,99-100,155-156` now makes default `/memory:save` runs planner-only/non-mutating unless callers explicitly choose `full-auto`. The wording is survivable, but clarifying the planner-first default would reduce operator confusion around whether handover docs are actually mutated on the default path.

## Findings - Confirming / Re-validating Prior
- Revalidated the clean result from security iteration 17 on packet 014: `spec.md`, `decision-record.md`, `checklist.md`, and `implementation-summary.md` still align on non-mutating planner-first default, explicit `full-auto` fallback, and caller-authorized target safety.
- Revalidated `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/*`: the phase still documents pre-mutation rejection of ambiguous task updates and does not show a new write-before-validate regression.

## Traceability Checks
- **spec_code (core): fail** — `010/002/004` still publishes the old always-on/no-flag Tier 3 guidance, while `014` ships the current opt-in/default-disable/manual-review contract.
- **checklist_evidence (core): partial** — `010/002/004/checklist.md:91-96` reproduces the stale Tier 3 claim instead of independently clearing it, but `010/002/005/checklist.md:18` still cleanly corroborates the pre-mutation task-update guard.
- **agent_cross_runtime (overlay): notApplicable** — this iteration stayed on packet-local security wording and did not need runtime-mirror parity review.

## Confirmed-Clean Surfaces
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/checklist.md`

## Next Focus (recommendation)
Check 010/012 for any remaining command/reference surfaces that still describe pre-014 `/memory:save` or Tier 3 behavior as the live operator contract.
