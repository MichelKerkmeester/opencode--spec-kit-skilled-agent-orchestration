# Iteration 16 - correctness - commands

## Dispatcher
- iteration: 16 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:57:12.898Z

## Files Reviewed
- .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js
- .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **[P1] `spec_kit_implement_{auto,confirm}` default scope blocks non-spec code edits**
   - The implementation workflows declare `scope_empty: "specs/**"` and `scope_policy.default: "specs/**"`, then later instruct Step 6 to do "Core development (models, services, endpoints)". If the command is followed literally with no explicit scope input, the default scope excludes the very source files the workflow says to implement.  
   - Evidence: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:57-61`, `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:401-405`, `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:57-61`, `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:450-454`

   ```json
   {
     "claim": "Both implementation command assets default file operations to specs/** even though Step 6 requires editing application code such as models, services, and endpoints.",
     "evidenceRefs": [
       ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:57-61",
       ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:401-405",
       ".opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:57-61",
       ".opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:450-454"
     ],
     "counterevidenceSought": "I looked for a later step or tested contract that widens the default scope when Step 6 begins, but the reviewed implementation assets and tests do not define such an override.",
     "alternativeExplanation": "If the runtime treats scope_policy as advisory-only and derives write scope from tasks.md or repo context, this becomes latent workflow drift instead of an always-on blocker.",
     "finalSeverity": "P1",
     "confidence": 0.96,
     "downgradeTrigger": "Downgrade if the command executor has an implemented rule that ignores the specs/** default during implementation and expands scope from task execution context."
   }
   ```

2. **[P1] Implementation workflow encodes the wrong PREFLIGHT/POSTFLIGHT scoring contract**
   - Both implementation assets tell operators/agents to record PREFLIGHT and POSTFLIGHT on a `0-10` scale and to compute learning index as a simple average, but the shipped `task_preflight` / `task_postflight` tools and `generate-context` contract use `0-100` inputs and a weighted formula. Following the command verbatim produces incomparable learning telemetry and can lead agents to submit the wrong values into the actual tools.  
   - Evidence: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:367-381`, `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:473-490`, `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:410-424`, `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:531-548`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:398-406`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:130-134`, `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:549-564`, `.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:319-321`

   ```json
   {
     "claim": "The implementation commands define PREFLIGHT/POSTFLIGHT scores on a 0-10 scale and use an average-based learning index, but the shipped learning tools and save pipeline are defined on a 0-100 scale with weighted LI math.",
     "evidenceRefs": [
       ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:367-381",
       ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:473-490",
       ".opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:410-424",
       ".opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:531-548",
       ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:398-406",
       ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:130-134",
       ".opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:549-564",
       ".opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:319-321"
     ],
     "counterevidenceSought": "I looked for a normalization layer or tests that rescale 0-10 command inputs to 0-100 before task_preflight/task_postflight or continuity extraction, but the reviewed runtime examples and extractor tests stay on 0-100 semantics.",
     "alternativeExplanation": "If the YAML's PREFLIGHT/POSTFLIGHT sections are intended as prose-only notes and are never fed into the learning tools, the immediate impact is misleading workflow guidance rather than malformed runtime data.",
     "finalSeverity": "P1",
     "confidence": 0.9,
     "downgradeTrigger": "Downgrade if there is a documented/executed adapter that converts these command-level 0-10 values into the 0-100 weighted contract before any tool call or indexed save."
   }
   ```

### P2 Findings
- `test-phase-command-workflows.js` is a string-presence check only; it verifies phase-folder/template phrases but never asserts implementation scope semantics or PREFLIGHT/POSTFLIGHT score contracts, so both P1 defects can ship undetected (`.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:95-152`).
- The deep-review command tests are also mostly lexical parity checks (`toContain`, regex presence) over lifecycle wording, not executable behavior, so they would not catch command/runtime divergence of the same class (`.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:70-114`, `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:64-107`).

## Traceability Checks
- The implementation workflows claim "Spec-driven implementation" and explicitly direct Step 6 into "Core development (models, services, endpoints)", but their default scope narrows writes to `specs/**`; the command contract does not match the implementation behavior it advertises.
- The implementation workflows' learning sections drift from the actual `task_preflight` / `task_postflight` tool schema and from `generate-context`'s documented learning-index formula, so the command surface no longer reflects the shipped runtime contract.
- `spec_kit_deep-review_confirm.yaml` still points to canonical `review/deep-review-*` paths, and the live `deep-review-config.json` stores `reviewScopeFiles` as an array (`.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:83-90`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:254-283`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review/review/deep-review-config.json:1-16`), so that reviewed path serialization remains aligned with current runtime output.

## Confirmed-Clean Surfaces
- `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml`: inspected phase-decomposition, context-loading, template-scaffold, and canonical save/indexing sections; no new correctness drift surfaced in those reviewed sections.
- `spec_kit_deep-review_confirm.yaml`: canonical review-state paths and session config wiring remain aligned with the current live config snapshot, including `review/` targets and array-shaped `reviewScopeFiles`.

## Next Focus
- Iteration 17 should continue on command assets and inspect `complete` / `resume` / `debug` workflows for the same class of contract-vs-runtime mismatches: default scopes, numeric ranges, and tests that only assert string presence.
