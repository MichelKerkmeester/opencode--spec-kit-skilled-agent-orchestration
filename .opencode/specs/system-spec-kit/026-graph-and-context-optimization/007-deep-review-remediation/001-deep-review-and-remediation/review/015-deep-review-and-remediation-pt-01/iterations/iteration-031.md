# Iteration 31 - traceability - pipeline

## Dispatcher
- iteration: 31 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:12:13.525Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts`
- `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **`determineSessionStatus()` can mark sessions complete solely because the worktree is clean, even when unresolved next steps are still present.** The function returns `COMPLETED` as soon as `repositoryState` contains `clean` and either `commitRef` or `headRef` exists (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:408-419`). That happens before the JSON-mode next-step gate that is supposed to downgrade sessions with unresolved follow-up work to `IN_PROGRESS` (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:428-455`). Non-capture workflow runs populate exactly those git fields during the pipeline (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:943-950`), so a clean repository can erase explicit continuation work from the emitted resume state. The unit suite only covers the next-step branch without repository metadata, so this precedence bug is untested (`.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:141-184`).

```json
{
  "claim": "`determineSessionStatus()` returns `COMPLETED` too early for clean repositories, bypassing the unresolved-next-steps logic that should keep resumable work in `IN_PROGRESS`.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:408-419",
    ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:428-455",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:943-950",
    ".opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:141-184"
  ],
  "counterevidenceSought": "I looked for a later override that re-checks `nextSteps` after the repository-state shortcut, and for a test that combines `repositoryState: clean` with unresolved next steps. I found neither.",
  "alternativeExplanation": "If `repositoryState: clean` is intentionally being treated as a stronger source of truth than authored continuation data, this is a product decision rather than a bug. The surrounding comments and JSON-mode branch say the opposite: unresolved next steps should keep the session resumable.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if a higher-level contract explicitly defines clean git state as authoritative completion even when `nextSteps` still contain unfinished work."
}
```

- **`runWorkflow()` reports a perfect quality score even when the pipeline calculated something else.** The workflow computes and logs `filterStats.qualityScore` from the active filter/scoring pipeline (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1082-1100`), and the `WorkflowResult` contract documents `stats.qualityScore` as the returned quality score (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:309-320`). But the actual return object hardcodes `qualityScore: 100` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1509-1514`). Any caller consuming `runWorkflow()` gets a success-shaped telemetry value that no longer reflects the reviewed content quality. The tests around workflow execution never assert that returned field, and the few end-to-end workflow cases that would exercise it are skipped (`.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:76-124`, `.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:229-380`).

```json
{
  "claim": "`runWorkflow()` always returns `stats.qualityScore = 100`, so downstream consumers cannot trust the workflow result to reflect the actual pipeline quality score.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:309-320",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1082-1100",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1509-1514",
    ".opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:76-124",
    ".opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:229-380",
    "repo-rg:.opencode/skill/system-spec-kit/scripts/tests stats\\.qualityScore (no matches)"
  ],
  "counterevidenceSought": "I checked whether a later normalization step overwrote `filterStats.qualityScore` intentionally or whether any workflow test asserted `result.stats.qualityScore`; there is no such override or runtime assertion in the reviewed pipeline/tests.",
  "alternativeExplanation": "If `stats.qualityScore` was intentionally repurposed into a constant 'workflow succeeded' flag, then the interface comment and the live filter-score logging are stale. The implementation currently presents it as a real quality metric.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the public `WorkflowResult` contract is updated to define `qualityScore` as a fixed success sentinel and all downstream callers are migrated off score-based interpretation."
}
```

### P2 Findings
- **The pipeline tests leave both traceability regressions unguarded.** `collect-session-data.vitest.ts` validates next-step handling only without the clean-repo metadata branch (`.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:141-184`), while the workflow tests that would exercise returned status/quality telemetry are disabled with `describe.skip`/`it.skip` (`.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:76-124`, `.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:229-380`). That means the current suite checks local helper behavior in isolation but not the end-to-end traceability contract exposed by `runWorkflow()`.

## Traceability Checks
- `diagram-extractor.ts` intentionally keeps `AUTO_DECISION_TREES` empty to avoid duplicating per-decision trees already rendered elsewhere; the source comment and returned shape align with that non-duplication intent (`.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:180-222`).
- `collect-session-data.ts` correctly carries the resolved specs root from phase-1 folder resolution into related-doc discovery, so downstream canonical-doc pointers stay tied to the winning spec tree instead of falling back to the wrong root (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1194-1215`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1431-1481`).

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:44-82` - `buildMemoryTitle()` and `extractSpecTitle()` are deterministic and fail closed; missing or malformed `spec.md` content only removes the enrichment hint instead of fabricating a title.
- `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:123-223` - null input now returns an empty diagram payload instead of synthetic fallback data, and detected ASCII diagrams are bounded before rendering.
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:227-620` - manual decision inputs are validated and malformed authored entries are dropped before extraction, so this pass did not reveal a parallel traceability issue in the decision merge path.

## Next Focus
- Review downstream consumers of `ContinueSessionData.SESSION_STATUS` and `WorkflowResult.stats` plus any tests around resume/index telemetry, especially where helper-level assertions diverge from the values returned by `runWorkflow()`.
