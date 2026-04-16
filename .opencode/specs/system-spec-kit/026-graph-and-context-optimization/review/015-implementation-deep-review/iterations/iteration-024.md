# Iteration 24 - security - pipeline

## Dispatcher
- iteration: 24 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:48:21.923Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`
- `.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js`
- `.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- None.

## Traceability Checks
- `loadCollectedData()` still matches the structured-input-only contract: it rejects missing inputs, permission failures, invalid JSON, and out-of-bound file paths before parsing session payloads (`scripts/loaders/data-loader.ts:59-139`, `scripts/utils/path-utils.ts:23-92`). The intended failure modes are exercised in `scripts/tests/runtime-memory-inputs.vitest.ts:15-166`.
- The pipeline still re-checks canonical containment before reading packet docs: `collectSessionData()` resolves `SPEC_FOLDER`, then gates `detectRelatedDocs()` behind a `realpathSync` boundary check so prefixed or symlinked folder hints do not trigger out-of-root doc reads (`scripts/extractors/collect-session-data.ts:1435-1469`), which is consistent with the folder-detector path-safety intent covered elsewhere (`scripts/tests/auto-detection-fixes.vitest.ts:446-458`).

## Confirmed-Clean Surfaces
- `scripts/core/workflow.ts:392-419,717-758,1257-1319` — no user-controlled shell execution; the only dynamic imports use fixed package specifiers, spec-folder usage is validated via `ensureSpecFolderExists()`, and the retry/description update path stays inside the validated packet path.
- `scripts/extractors/collect-session-data.ts:1156-1184,1442-1471` and `scripts/extractors/session-extractor.ts:97-107,465-516` — the only subprocess calls are fixed `git rev-parse` / `git status` commands with bounded timeout and explicit cwd; related-doc discovery is filesystem-only and root-bounded.
- `scripts/loaders/data-loader.ts:71-139` — explicit path sanitization happens before file reads, with deterministic error surfacing instead of silent fallback.
- `scripts/graph/backfill-graph-metadata.ts:110-227` — traversal is filesystem-only, excludes hidden/scratch/memory trees, and invokes no shell; dry-run vs write behavior is explicitly covered by `scripts/tests/graph-metadata-backfill.vitest.ts:77-127`.

## Next Focus
- Review adjacent pipeline security surfaces that consume spec-folder or filesystem roots indirectly, especially folder-detector/validator call chains and any save-follow-up code paths that bridge from validated packet paths into MCP indexing APIs.
