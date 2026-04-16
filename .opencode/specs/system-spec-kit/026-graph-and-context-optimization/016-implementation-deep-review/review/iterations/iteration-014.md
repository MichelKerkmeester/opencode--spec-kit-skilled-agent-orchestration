# Iteration 14 - correctness - reducers

## Dispatcher
- iteration: 14 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:41:59.250Z

## Files Reviewed
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
- .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Parseable schema drift crashes the reducer outside its advertised fail-closed path** — `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:39-40`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:487-505`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:831-868`
   - `normalizeText()` calls `value.replace(...)` without coercion, and `buildRegistry()` feeds `answeredQuestions` through it with no type guard. A JSON-valid row such as `answeredQuestions:[42]` therefore throws `TypeError: value.replace is not a function` even when `lenient:true`, so the reducer never reaches the structured `STATE_CORRUPTION` pathway it advertises.
   - This also diverges from the workflow contract in `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:477-481` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:557-561`, which declare `malformed_delta: skip + warn` and `schema_mismatch: reject + conflict event` for the reducer step.

```json
{
  "claim": "JSON-valid but schema-invalid state rows can crash reduceResearchState with a raw TypeError instead of being surfaced as structured corruption/schema handling.",
  "evidenceRefs": [
    ".opencode/skill/sk-deep-research/scripts/reduce-state.cjs:39-40",
    ".opencode/skill/sk-deep-research/scripts/reduce-state.cjs:487-505",
    ".opencode/skill/sk-deep-research/scripts/reduce-state.cjs:831-868",
    ".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:477-481",
    ".opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:557-561",
    "Bash probe 2026-04-16: reduceResearchState(spec, { write:false, lenient:true }) with answeredQuestions:[42] -> TypeError: value.replace is not a function"
  ],
  "counterevidenceSought": "Checked whether the reducer had a later schema-validation pass or a String() coercion guard before answeredQuestions/sourcesQueried are normalized; it does not.",
  "alternativeExplanation": "If upstream writers provably guarantee string-only arrays forever, this stays latent, but the reducer's own failure-mode contract explicitly talks about malformed/schema-mismatched deltas rather than assuming perfect input.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if the reducer is intentionally allowed to crash on any JSON-valid schema drift and the YAML failure-mode contract is non-authoritative."
}
```

2. **Graph convergence rollup ignores the canonical top-level `score` and can emit impossible values** — `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:236-271`
   - The convergence handler explicitly emits a canonical numeric `score` for reducer consumption at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:238-248`, but `buildGraphConvergenceRollup()` only passes `event.signals` into `computeGraphConvergenceScore()`.
   - When `signals.score` is absent, the fallback averages all numeric signal fields, including raw-count metrics like `sourceDiversity` and `evidenceDepth`; reproduced with the handler-shaped payload, the reducer returned `graphConvergenceScore: 1.37` for a canonical `score: 0.74`.

```json
{
  "claim": "The reducer does not consume graph_convergence.score directly, so handler-shaped events without mirrored signals.score can be mis-scored and even exceed the expected 0..1 range.",
  "evidenceRefs": [
    ".opencode/skill/sk-deep-research/scripts/reduce-state.cjs:236-271",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:238-248",
    "Bash probe 2026-04-16: buildGraphConvergenceRollup([{event:'graph_convergence', score:0.74, signals:{questionCoverage:0.8, claimVerificationRate:0.7, contradictionDensity:0.05, sourceDiversity:2.1, evidenceDepth:3.2}}]) -> graphConvergenceScore 1.37"
  ],
  "counterevidenceSought": "Checked whether buildGraphConvergenceRollup reads event.score anywhere or clamps fallback averages into [0,1]; it does neither.",
  "alternativeExplanation": "The current deep-research YAML serializes the handler's signals object, which usually includes signals.score and masks the defect, but the reducer still violates the handler's canonical event contract.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if every producer that can append graph_convergence events is guaranteed to persist a numeric score inside signals before the reducer ever reads the log."
}
```

### P2 Findings
- **False-positive regression test** — `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:246-266` claims to verify direct consumption of the canonical handler shape, but the fixture includes both top-level `score` and `signals.score`; that lets the test pass even though `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:261-271` never reads `event.score`.
- **Missing coverage for parseable schema corruption** — `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:69-71` and `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:267-270` only exercise string-shaped `answeredQuestions` / `sourcesQueried`; there is no test that JSON-valid schema drift is downgraded to structured corruption handling instead of a raw TypeError.

## Traceability Checks
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:477-481` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:557-561` describe reducer-step handling for malformed/schema-mismatched deltas, but the implementation currently generic-crashes on parseable type drift rather than surfacing a typed conflict/corruption outcome.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:238-248` says the handler's top-level `score` is the authoritative reducer input; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:261-271` still derives the rollup from nested `signals` only.

## Confirmed-Clean Surfaces
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:279-320` — `buildLineageState()` correctly prefers the newest `resumed` / `restarted` event over config fallback and preserves `continuedFromRun` vs `fromIteration` parity.
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:323-355` — `buildTerminalStopState()` correctly drops stale `synthesis_complete` events once a later iteration or lifecycle event exists; `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:261-297` exercises that path.

## Next Focus
- Check reducer siblings for the same two edge cases: typed schema drift in JSONL fields and tests that only pass because score/severity data is redundantly mirrored.
