---
iteration: 2
focus: "CLI target authority and remaining script-side value"
dimension: "runtime-flow"
timestamp: "2026-04-15T08:06:00Z"
tool_call_count: 7
---

# Iteration 002

## Findings

- `NEUTRAL` The wrapper still earns partial value because JSON/stdin payloads never outrank an explicit CLI spec-folder target; this protects operator intent before the workflow runs. [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:86] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:106]
- `NEUTRAL` The remaining workflow contract is consistent with the command docs: canonical saves still promise graph-metadata refresh and indexing, even though standalone memory markdown is retired. [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:81] [SOURCE: .opencode/command/memory/save.md:73]

## Ruled-out directions explored this iteration

- `generate-context.js` is not dead code; it still owns structured-input normalization and target validation for the full-save path. [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:68] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:228]

## newInfoRatio

- `0.28` — This pass narrowed the wrapper from "legacy shell" to a still-relevant CLI authority layer.
