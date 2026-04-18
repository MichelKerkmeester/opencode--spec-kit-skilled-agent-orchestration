# Iteration 11 - correctness - pipeline

## Dispatcher
- iteration: 11 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:49:00Z

## Files Reviewed
- .opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts
- .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
- .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts
- .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts
- .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
- .opencode/skill/system-spec-kit/scripts/core/title-builder.ts
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts
- .opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts
- .opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts
- .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js
- .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json
- .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json
- .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json
- .opencode/skill/system-spec-kit/scripts/package.json

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **The shipped post-save reviewer is not wired into the real scripts pipeline, so its guardrails never execute outside tests.**
   - Evidence: the only repo references to `reviewPostSaveQuality()` / `printPostSaveReview()` are the definitions in `post-save-review.ts` plus test files; there is no production caller in the scripts or MCP codepaths (repo-wide `rg "reviewPostSaveQuality\\(|printPostSaveReview\\("` on 2026-04-16). The only reachable save pipeline I found, `runWorkflow()`, explicitly skips the legacy memory artifact write and then returns after Step 11.5 indexing without invoking any post-save review surface (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1242-1255`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1356-1515`). That means every PSR-1..6 / D1..D8 check in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:572-1125` is currently test-only logic.
   - Test gap: the dedicated suite only exercises a green path and the penalty-cap helper (`.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:22-68`), so current coverage would still pass even if the reviewer never runs in production.

```json
{
  "claim": "The post-save quality reviewer is dead production code: it is defined and tested, but no shipped save path calls it, so reviewer guardrails never execute on real saves.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:572-1125",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1242-1255",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1356-1515",
    ".opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:22-68",
    "Repo-wide rg \"reviewPostSaveQuality\\(|printPostSaveReview\\(\" on 2026-04-16 returned only post-save-review.ts and test files"
  ],
  "counterevidenceSought": "Looked for any production import or dynamic call in scripts/, mcp_server/, dist/, or hooks that invokes reviewPostSaveQuality/printPostSaveReview; none was present in the repository search results.",
  "alternativeExplanation": "The canonical save path may have intentionally moved equivalent guardrails into another module, but this specific shipped reviewer surface is not the one enforcing them.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if a runtime-only caller outside the repository invokes this module in production, or if another live save path is shown to execute an equivalent post-save review contract before reporting success."
}
```

### P2 Findings
- **`reviewPostSaveQuality()` cannot escalate PSR baseline HIGH findings into a rejected save.** The reviewer emits HIGH severity for `PSR-1` and `PSR-2` (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:635-657`), but `countGuardrailSeverities()` deliberately ignores every check whose id does not start with `D` or `DUP` (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:449-474`). The blocker gate then derives `REJECTED` solely from those filtered counts (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1012-1019`), so even multiple baseline HIGH findings can only surface as non-blocking `ISSUES_FOUND`.
- **Coverage is too shallow to catch either the dead wiring or the blocker bug above.** `post-save-review.vitest.ts` only asserts the all-green path and penalty cap (`.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:22-68`), while the adjacent targeted suites only pin isolated D1 and D4 checks (`.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:50-82`, `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:104-155`). There is no test that proves a real save path calls the reviewer, and no test that asserts PSR HIGH findings can flip `status` to `REJECTED`.

## Traceability Checks
- The implementation currently disagrees with the intended "post-save quality review" surface: the reviewer exists, logs detailed issue types, and has fixtures for D7/D8, but the live scripts workflow bypasses it entirely and exits after indexing.
- Two dispatcher-suggested files, `.opencode/skill/system-spec-kit/scripts/core/canonical-continuity-shadow.ts` and `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts`, were not present at those paths in this checkout, so this iteration covered the extant pipeline files that are still reachable from the scripts workflow.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts` looked correct in the reviewed slice: both metadata injectors strip old render/spec-health keys before reinserting them and preserve the file's prevailing newline style, so I did not find a duplicate-key or CRLF/LF corruption bug there.
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` stayed internally consistent for the reviewed helpers. `buildSessionDedupContext()`, `buildCausalLinksContext()`, and `buildWorkflowMemoryEvidenceSnapshot()` all normalize mixed snake/camel input without silent drops, and `resolveParentSpec()` has focused coverage in `.opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts`.
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` handled title parsing more robustly than the frontmatter regex alone suggests because it falls back to the H1 heading. A direct runtime probe under `node --import tsx` produced identical `contentLength=8` / `score=70` outputs for quoted, unquoted, and single-quoted `title:` frontmatter variants, so I did not keep that as a finding.
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` is a type-only shim with no executable pipeline logic left to break.

## Next Focus
- Iteration 12 should inspect the canonical save path under `mcp_server/handlers/memory-save.ts` / `content-router` to determine whether the post-save-review guardrails were replaced elsewhere or whether packet 014 left the save pipeline without any live post-render reviewer at all.
