# Iteration 6 — Assistive reconsolidation contract drift (6/10)

## Investigation Thread
I audited the save-time reconsolidation bridge, with emphasis on the assistive lane that sits beside the canonical `memory_save` write path. The goal was to verify whether the public "assistive reconsolidation" contract is actually reachable and behaviorally consistent in planner-first runtime mode.

## Findings

### Finding R6-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `66-73`, `243-255`, `446-454`
- **Severity:** P1
- **Description:** The file documents assistive reconsolidation as a separate, default-on advisory feature, but the runtime gates it behind the same planner/full-auto switch used for save-time reconsolidation. In the default planner-first runtime, assistive review never executes unless the caller explicitly enables full-auto mode or the opt-in save-time reconsolidation flag.
- **Evidence:** `isAssistiveReconsolidationEnabled()` is presented as default ON at `72-73`, and the assistive block claims it "Runs independently of the TM-06 flag" at `446-449`. But the actual guard at `453` requires `allowSaveTimeReconsolidation`, which is derived at `254-255` from `plannerMode === 'full-auto' || isSaveReconsolidationEnabled()`. The surrounding runtime defaults make that guard false by default: `resolveSavePlannerMode()` returns `'plan-only'` (`lib/search/search-flags.ts:123-145`), and `isSaveReconsolidationEnabled()` is opt-in false (`lib/search/search-flags.ts:139-145`). The tests codify this mismatch: `tests/reconsolidation-bridge.vitest.ts:116-168` expects the default path to skip both `reconsolidate` and `vectorSearch`, while `tests/assistive-reconsolidation.vitest.ts:22-50` only proves the helper flag/classifier defaults, not the live save path.
- **Downstream Impact:** Default `memory_save` calls never emit borderline review recommendations or high-similarity compatibility notes, so operators and agent flows receive no assistive dedup guidance unless they explicitly switch into the legacy mutation-first/full-auto path.

### Finding R6-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `55-66`, `80-83`, `478-482`
- **Severity:** P1
- **Description:** The exported assistive threshold contract promises "auto-merge" behavior for similarity `>= 0.96`, but the live runtime performs no merge, archive, or cleanup at that tier. It only logs a compatibility note and then falls through to the normal create path.
- **Evidence:** The constant/JSDoc surface says memories above `0.96` are "considered near-duplicates and auto-merged" (`55-59`), and the tier table repeats `similarity >= 0.96 -> auto-merge` (`80-83`). In the live branch, the `auto_merge` tier only calls `console.warn(...)` with the explicit note that "archived-tier side effects are disabled" (`478-482`), and `runReconsolidationIfEnabled()` still returns `earlyReturn: null` so the caller continues with the standard save. The direct tests lock this behavior in: `tests/reconsolidation-bridge.vitest.ts:210-253` asserts no archive/BM25 cleanup side effects and `earlyReturn === null`, while `tests/gate-d-regression-reconsolidation.vitest.ts:135-159` expects the same for canonical-doc writes.
- **Downstream Impact:** Very-high-similarity saves that callers believe will be deduplicated are still persisted as ordinary new memories, which can inflate duplicate rows and mislead any runtime or operator workflow that trusts the published "auto-merge" label.

## Novel Insights
This seam is weaker than the public surface suggests in two different ways. First, the assistive lane is not actually independent of TM-06/planner mode; the planner-first default disables it before similarity search even runs. Second, even when the lane does run, its highest-severity tier is advisory-only, so the system advertises an "auto-merge" outcome that never materializes in live write behavior.

## Next Investigation Angle
Stay on the save pipeline and inspect `handlers/save/post-insert.ts` plus its consumers to determine whether deferred enrichment/backfill reporting is similarly success-shaped by default, especially where planner-first flows promise follow-up work without a guaranteed executor.
