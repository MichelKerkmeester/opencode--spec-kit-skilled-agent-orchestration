# Iteration 18 - correctness - scripts_misc

## Dispatcher
- iteration: 18 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:57:18.224Z

## Files Reviewed
- .opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs
- .opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs
- .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs
- .opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json
- .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Bounded search contract is broken for valid custom parameter spaces.** `sampleConfig()` computes the number of admissible steps with `Math.round(range / step)` and then emits `min + stepIndex * step` without clamping, so any valid custom step that does not divide the range evenly can produce candidates above `bounds.max`. `randomSearch()` explicitly accepts custom `paramSpace` values after manifest validation, so it can evaluate and record out-of-bounds candidates while still claiming REQ-007 bounded search behavior. A direct probe with `{ min: 0.01, max: 0.20, step: 0.07 }` emitted `0.22`, and `randomSearch(..., 50)` recorded that illegal value in the audit trail.  
  **Evidence:** `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:181-194`, `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:277-284`, `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:227-242`

  ```json
  {
    "claim": "The optimizer can generate and score candidates outside the caller-supplied max bound even when the custom parameter space passes validation.",
    "evidenceRefs": [
      ".opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:181-194",
      ".opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:277-284",
      ".opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:227-242",
      "runtime-probe-2026-04-16: sampleConfig({convergenceThreshold:{min:0.01,max:0.20,step:0.07}}) => 0.22; randomSearch(...,50) audit trail included 0.22"
    ],
    "counterevidenceSought": "Looked for clamping/rejection of non-divisible step sizes in validateParamSpaceAgainstManifest() and for a custom-space regression test; neither exists.",
    "alternativeExplanation": "This would be lower severity if the module were hard-wired to DEFAULT_PARAM_SPACE only, but randomSearch() exposes and validates caller-supplied paramSpace objects.",
    "finalSeverity": "P1",
    "confidence": 0.98,
    "downgradeTrigger": "Downgrade if custom paramSpace is proven unreachable in production and the API contract is narrowed to manifest-derived default space only."
  }
  ```

### P2 Findings
- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:98-112`, `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:118-127`, `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:202-204` - `newInfoRatio` is never type-checked before arithmetic/comparison. String inputs are silently coerced by JS (`"0.01"` becomes `0.01` in the rolling average and threshold check), so malformed replay data can report `belowThreshold: true` / `converged: true` instead of failing closed. Probe: `evaluateConvergence({ newInfoRatio: "0.01" }, ...)` returned a converged result.
- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:227-242`, `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:355-379` - The REQ-007 test coverage only checks the manifest-derived default space and manifest allow/deny validation. There is no test for a custom-but-valid `paramSpace` whose step does not tile the range cleanly, which is why the `0.22 > 0.20` overflow path shipped undetected.

## Traceability Checks
- `search.cjs` claims REQ-007 bounded numeric search, and the tests restate that contract, but the implementation only satisfies it for the default manifest-derived space currently exercised by tests. Custom spaces that pass validation can still escape the declared max bound.
- `rubric.cjs` does match its stated REQ-003 / REQ-009 behavior: per-dimension breakdown is emitted, and unknown dimensions are marked unavailable rather than fabricated.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs` - The scorer wiring is internally consistent: unavailable dimensions are excluded from the normalized composite, and the exported per-dimension scorers match the expectations encoded in `optimizer-rubric.vitest.ts`.
- `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs` manifest gating - `validateParamSpaceAgainstManifest()` correctly rejects unknown and locked fields before search begins; the bug is in bound-preserving sampling after validation, not in the manifest allow/deny checks themselves.

## Next Focus
- Check downstream optimizer consumers (`optimizer-promote` / CLI wrappers) for trust in audit-trail candidates, especially whether they assume sampled configs always satisfy caller bounds and numeric type invariants.
