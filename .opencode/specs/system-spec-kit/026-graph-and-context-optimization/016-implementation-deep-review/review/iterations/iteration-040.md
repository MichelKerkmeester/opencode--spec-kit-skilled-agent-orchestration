# Iteration 40 - maintainability - scripts_lib

## Dispatcher
- iteration: 40 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:28:24Z

## Files Reviewed
- .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs
- .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts
- .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts
- .opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts
- .opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts
- .opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts
- .opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts
- .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
- .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
- .opencode/skill/system-spec-kit/scripts/types/session-types.ts
- .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts
- .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js
- .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js

## Findings - New
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **Dead branch in adjacency construction hides the real invariant** - `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:89-92`: line 91 can never execute because line 90 already `continue`s when `edge.source` is absent from `adjacency`. The metric logic still works, but this kind of unreachable guard makes future changes harder to reason about because it suggests a fallback path that does not actually exist.
- **`sanitizeTriggerPhrases()` is order-sensitive when removing shadowed phrases** - `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:190-198`: shadowing is only checked against phrases that were already accepted, so `['semantic memory', 'memory']` collapses to one phrase while `['memory', 'semantic memory']` keeps both. A local built-module probe reproduced the same asymmetry for `memory/semantic memory` and `context/context generation`, and the reviewed tests never exercise order permutations.
- **The claimed shared semantic contract has already drifted across short-term allowlists** - `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:289-314`, `.opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts:18-38`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:39-57,135-170`: topic extraction and trigger sanitization keep separate short-token allowlists, so maintenance changes can land in one surface without the other. Today that already shows up for `pr`: the sanitizer explicitly preserves it, but a local probe of `SemanticSignalExtractor.extract({ text: 'PR review automation for adapter rollout', mode: 'topics', ... })` drops `pr` entirely, and `semantic-signal-golden.vitest.ts` has no abbreviation coverage that would catch the drift.
- **Three exported simulation helpers are effectively orphaned inside this tree** - `.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:514-549`: `createFullSimulation`, `addSimulationWarning`, and `markAsSimulated` are exported, but the only matches under `scripts/**` are their own declarations, and the reviewed tests (`.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:908-951,1824-1865`) never touch them. That leaves a public mutation surface with no caller pressure and no regression coverage, which increases maintenance cost if the API is ever revived.

## Traceability Checks
- `coverage-graph-signals.cjs` still matches the intended signal semantics in the paths reviewed: degree/depth/activity/cluster calculations remain session-aware, and the dedicated Vitest file covers linear, diamond, SCC, rootless-cycle, and cluster cases.
- `semantic-signal-extractor.ts` only partially satisfies its "one contract" promise (`.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:8-10,326-329`): it centralizes the pipeline, but short-term vocabulary policy is still split across `topic-keywords.ts` and `trigger-phrase-sanitizer.ts`, so the contract can drift silently.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs` - aside from the unreachable guard above, the actual signal math is internally consistent and directly exercised by `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts`.
- `.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts` + `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` - the real/simulated gate looked coherent in the reviewed path: `workflow.ts` defers to `requiresSimulation()` (`workflow.ts:1239`), while `input-normalizer.ts:377-390,731-742,925-977` synthesizes observations, prompts, and recent context from structured JSON summaries so non-empty JSON-mode saves do not accidentally fall back to placeholder mode.

## Next Focus
- Iteration 41 should stay on maintainability/test-quality around the script-side callers that consume these helpers (`core/frontmatter-editor.ts`, residual migration scripts, and any remaining semantic/topic extractors) to see where the order-sensitive sanitizer and split vocabulary rules leak into persisted output.
