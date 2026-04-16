# Iteration 28 - security - reducers

## Dispatcher
- iteration: 28 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:10:55.729Z

## Files Reviewed
- `.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs`
- `.opencode/skill/sk-deep-review/assets/runtime_capabilities.json`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`
- `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **The deep-review capability resolver advertises a legacy `agents` runtime that is not shipped in this repository.** `listRuntimeCapabilityIds()` and the CLI entrypoint expose every row from `runtime_capabilities.json`, and `resolveRuntimeCapability('agents')` returns `.agents/agents/deep-review.md` plus `.agents/commands/spec_kit/deep-review.toml` without any existence check (`.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:52-102`, `.opencode/skill/sk-deep-review/assets/runtime_capabilities.json:74-89`). In this checkout, repo-wide path searches found no matches for either emitted `.agents/...` file, so the resolver can hand callers a "known runtime" that is guaranteed to fail only after selection. The current deep-review parity suite never imports this module or validates the advertised runtime targets, so the broken contract ships undetected (`.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-158`).

```json
{
  "claim": "The deep-review runtime capability resolver publishes an `agents` runtime whose mirror/wrapper files are absent from the shipped repository, so callers can select a broken runtime from the advertised capability list.",
  "evidenceRefs": [
    ".opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:52-102",
    ".opencode/skill/sk-deep-review/assets/runtime_capabilities.json:74-89",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-158",
    "repo-glob:.agents/agents/deep-review.md (no matches)",
    "repo-glob:.agents/commands/spec_kit/deep-review.toml (no matches)"
  ],
  "counterevidenceSought": "I searched the reviewed deep-review sources/tests for an install-time generator or documented requirement that materializes the `.agents` wrapper later, and found none. I also confirmed the live resolver CLI really emits `agents` in its runtimeIds list.",
  "alternativeExplanation": "If the `.agents` wrapper is produced only in a downstream packaging step outside this repository, the bug is environment-specific rather than universal. Nothing in the reviewed implementation documents or enforces that assumption.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if a shipped bootstrap/install path is shown to create those exact `.agents` files before any caller can consume the resolver output, or if `agents` is intentionally hidden from all runtime selection surfaces."
}
```

### P2 Findings
- **Deep-review lacks executable coverage for `runtime-capabilities.cjs`.** Unlike the deep-research parity suite, which imports its sibling resolver and asserts both runtime IDs and on-disk target existence (`.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:3-18,109-123`), the deep-review suites stay lexical and never load `runtime-capabilities.cjs` or check matrix paths (`.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-158`, `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:15-129`). That test gap is why the stale `agents` row can persist without any failing review-side contract test.

## Traceability Checks
- `runtime-capabilities.cjs` still matches the intended "static capability matrix" design: it resolves a bundled JSON file, parses it locally, and never shells out (`.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:32-102`). The drift is in the shipped matrix contents, not in unexpected reducer-side execution behavior.
- Deep-review is now behind its deep-research sibling on runtime-capability traceability: deep-research has executable parity coverage for the resolver (`.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:109-123`), while deep-review's parity coverage does not reach the live capability resolver at all (`.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-158`).

## Confirmed-Clean Surfaces
- `.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:32-102` — no `child_process`, shell interpolation, environment-driven command construction, or network access; malformed capability data fails closed via thrown exceptions rather than silent fallback.
- `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs:32-102` — the sibling resolver is structurally identical and backed by an executable parity test, so I did not find a parallel security issue in the same reducer/capability family.

## Next Focus
- Review any dispatcher/runner that consumes `resolveRuntimeCapability()` output or opens mirror/wrapper paths, plus adjacent reducer entrypoints that trust runtime IDs from YAML/CLI state without validating the resolved targets exist.
