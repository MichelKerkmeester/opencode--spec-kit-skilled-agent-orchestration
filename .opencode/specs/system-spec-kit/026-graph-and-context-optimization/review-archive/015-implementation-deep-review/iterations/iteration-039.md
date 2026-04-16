# Iteration 39 - maintainability - pipeline

## Dispatcher
- iteration: 39 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:24:50.394Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts`
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts`
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts`
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts`
- `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **Duplicate reviewer check ID `DUP5` now represents two unrelated drift classes.** `reviewPostSaveQuality()` emits `DUP5` for `context_type` drift at `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:778-785` and again for `trigger_phrases` drift at `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:790-797`. That makes telemetry, grep-based triage, and future suppression logic ambiguous because one ID no longer maps to one invariant. The nearby tests exercise review outcomes, but none pin distinct IDs for these branches (`.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:22-57`, `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:104-123`, `.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:50-82`).
- **The core quality scorer hard-codes a double-quoted frontmatter title parser while sibling title parsing is quote-agnostic.** `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:85-101` only recognizes `title: "..."`, but `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:71-75` already accepts quoted or unquoted `title:` values. That split contract makes `hasSpecificPrimaryTitle()` brittle if templates or fixtures ever emit unquoted/single-quoted titles, and the current scorer tests only build quoted frontmatter (`.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:8-18`).
- **`extractSpecTitle()` silently discards all read/parse failures, which obscures why title fallback happened.** The helper returns `''` for every filesystem or frontmatter parse error at `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:67-81` and explicitly drops the caught error. That keeps the pipeline limping along, but it makes broken `spec.md` inputs hard to diagnose and hard to distinguish from legitimately missing titles. The current title-builder test coverage only exercises `buildMemoryDashboardTitle` compatibility, not `extractSpecTitle` success/failure paths (`.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:12-28`).

## Traceability Checks
- The current implementation still matches the intended Phase 2/3 review contract for the strongest guardrails I checked: overview truncation (`D1`) is implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:843-869` and exercised by `.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:50-82`; frontmatter/metadata tier drift (`D4`) is implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:899-907` and exercised by `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:104-123`.
- The dispatcher hint list is slightly stale for this packet: `canonical-continuity-shadow.ts` and `file-writer.ts` are not present under `scripts/core` in the current tree, so the live pipeline review surface is concentrated in `post-save-review.ts`, `frontmatter-editor.ts`, `memory-metadata.ts`, `quality-scorer.ts`, and `title-builder.ts`.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` is a clean type-only retirement shim; I did not find hidden write/index side effects.
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` looks internally consistent for the reviewed scope, and `resolveParentSpec()` is covered for nested vs top-level packets by `.opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts:9-37`.
- `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts` cleanly strips prior rendered quality fields before reinserting them, so the metadata injection path remains idempotent in the reviewed helpers.

## Next Focus
- Inspect the moved pipeline orchestration surface in `scripts/core/workflow.ts` plus the frontmatter-migration/render helpers to see whether the missing `file-writer`/`canonical-continuity-shadow` responsibilities were folded into larger modules without equivalent review IDs or tests.
