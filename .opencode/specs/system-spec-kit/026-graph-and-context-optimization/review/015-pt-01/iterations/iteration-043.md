# Iteration 43 - maintainability - commands

## Dispatcher
- iteration: 43 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:29:58.552Z

## Files Reviewed
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review/review/deep-review-config.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review/review/deep-review-state.jsonl
- .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml
- .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`/complete`'s repeated-failure path advertises `@debug`, but the executable dispatch is wired to the generic agent.** The same workflow file first defines the intended debug specialist path (`agent_file: "[runtime_agent_path]/debug.md"`) and tells the operator to "dispatch `@debug` via Task tool" after 3 failures, but the concrete `debug_dispatch` block still sets `subagent_type: "general-purpose"` instead of `debug`. That means the contractually advertised escalation path is not the one the workflow would actually invoke when the threshold is hit. Evidence: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:329-335`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:917-930`, `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:876-887`.

```json
{
  "claim": "The /complete workflow's 3-failure escalation path is miswired: the user-facing contract says to dispatch @debug, but the dispatch block actually targets the generic general-purpose agent.",
  "evidenceRefs": [
    ".opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:329-335",
    ".opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:917-930",
    ".opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:876-887"
  ],
  "counterevidenceSought": "Looked for a nearby remap showing that on_A=dispatch_debug is hard-bound elsewhere to the custom debug agent rather than debug_dispatch.subagent_type; none was present in the reviewed command assets or command-focused tests.",
  "alternativeExplanation": "The authors may have intended general-purpose to be a portability fallback when the custom debug agent is unavailable, but if that were the design the prompt should not explicitly promise @debug as the action taken on option A.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if the runtime dispatcher ignores debug_dispatch.subagent_type and resolves dispatch_debug to the custom debug agent through an external binding that is not represented in these command assets."
}
```

### P2 Findings
- **`spec_kit_complete_auto.yaml` contains a duplicated `D)` option in the debug-escalation prompt.** The prompt first prints `D) Pause workflow` and then immediately prints a second `D) Pause - Stop workflow and review`, which makes the operator-facing choice block noisy and harder to keep synchronized with confirm-mode wording. Evidence: `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:876-884`.
- **Parity coverage currently skips the `/complete` command assets, which is why the escalation drift above can land unnoticed.** The contract tests enumerate only the deep-research and deep-review command assets; none of the reviewed command-focused tests load `spec_kit_complete_confirm.yaml` or `spec_kit_complete_auto.yaml`. Evidence: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:42-45`, `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:31-34`.

## Traceability Checks
- The dedicated deep-research command pair still matches its documented execution contract on the reviewed surfaces: both YAMLs pin the canonical `agent_file: ".opencode/agent/deep-research.md"` and the parity test asserts reducer invocation plus that canonical path. Evidence: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:67-75`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:67-75`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:73-107`.
- The iteration focus listed `spec_kit_debug_auto.yaml` and `spec_kit_debug_confirm.yaml`, but no such shipped asset exists under `.opencode/command/spec_kit/assets/`; the currently shipped debug behavior for SpecKit commands is embedded inside `/implement` and `/complete` escalation blocks instead.

## Confirmed-Clean Surfaces
- **`spec_kit_deep-research_auto.yaml` and `spec_kit_deep-research_confirm.yaml`**: the reviewed command pair stays aligned on the canonical deep-research agent path, reducer invocation, and canonical state artifact names, and that alignment is enforced by a dedicated parity test.
- **`deep-research-contract-parity.vitest.ts`**: the assertions are targeted and meaningful for the assets it does cover; it checks the reducer command, canonical agent path, and runtime-capability references rather than just snapshotting large files.

## Next Focus
- Iteration 44 should review the remaining SpecKit command surfaces that still embed debug/save contracts indirectly (`spec_kit_complete_auto.yaml`, `spec_kit_implement_auto.yaml`, `spec_kit_implement_confirm.yaml`) and verify whether any runtime test actually exercises those escalation branches end to end.
