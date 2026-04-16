# Iteration 41 - maintainability - reducers

## Dispatcher
- iteration: 41 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:28:19.192Z

## Files Reviewed
- .opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs
- .opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs
- .opencode/skill/sk-deep-review/assets/runtime_capabilities.json
- .opencode/skill/sk-deep-research/assets/runtime_capabilities.json
- .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **Line-for-line duplicate resolver creates avoidable drift risk across the review/research runtimes.**  
  Evidence: `.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:32-113` and `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs:32-113` implement the same load/list/resolve/CLI flow with only product-name strings changed. That means any future validation or CLI behavior fix has to be applied in two files and kept manually in sync, even though both files read the same shape of matrix and expose the same API.
- **The deep-review parity suite does not exercise the resolver module or its machine-readable matrix, so this duplicated surface can drift silently.**  
  Evidence: `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:1-158` only performs string assertions over docs/YAMLs and never imports `runtime-capabilities.cjs`, inspects `runtime_capabilities.json`, or asserts resolved runtime IDs. By contrast, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:3-18,109-123` imports the resolver, asserts the runtime ID list, and checks each `mirrorPath` / `commandWrapperPath` on disk. Today that means the extra legacy `agents` entry in `.opencode/skill/sk-deep-review/assets/runtime_capabilities.json:73-90` has no equivalent executable parity check on the deep-review side.

## Traceability Checks
- The shipped deep-review resolver does match its asset-driven contract on the happy path: `DEFAULT_CAPABILITY_PATH` points at `.opencode/skill/sk-deep-review/assets/runtime_capabilities.json`, `listRuntimeCapabilityIds()` enumerates `matrix.runtimes`, and `resolveRuntimeCapability()` returns the matching runtime record by exact `id` (`.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:19,52-78`; `.opencode/skill/sk-deep-review/assets/runtime_capabilities.json:4-90`).
- Traceability risk is in coverage, not current behavior: unlike the deep-research side, deep-review has no executable test that proves the resolver and matrix remain aligned as the runtime list evolves.

## Confirmed-Clean Surfaces
- `.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs` is otherwise small and deterministic: it only reads one local JSON file, resolves paths via `path.resolve`, emits structured JSON in CLI mode, and provides a specific unknown-runtime diagnostic that includes the known IDs (`:33-43`, `:69-72`, `:85-102`).
- No hidden writes, shell execution, or cross-file mutation were found in the reviewed resolver path.

## Next Focus
- Inspect `sk-deep-review/scripts/reduce-state.cjs` for similar copy/paste drift versus `sk-deep-research/scripts/reduce-state.cjs`, especially where behavior is enforced mostly by doc-parity tests instead of executable reducer assertions.
