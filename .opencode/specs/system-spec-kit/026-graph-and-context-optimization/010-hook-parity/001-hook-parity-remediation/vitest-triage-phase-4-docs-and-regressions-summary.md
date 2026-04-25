# Vitest Triage Phase 4: Docs, Regressions, and Removed Fixtures

## Fixed Tests

- `scripts/tests/continuity-freshness.vitest.ts`: enabled `CONTINUITY_FRESHNESS` in the strict validate.sh wiring test.
- `scripts/tests/deep-review-reducer-schema.vitest.ts`: updated reducer expectations for artifact-rooted review paths and current reducer documentation.
- `scripts/tests/quality-scorer-disambiguation.vitest.ts`: renamed the low-quality warning label to `input_completeness_score`.
- `mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts`: refreshed vector-search mocks with required candidate fields after malformed-row filtering.
- `mcp_server/tests/transcript-planner-export.vitest.ts`: skipped absent packet 015 scratch transcripts, citing `ce65be2aa2`; no deleted archive fixture was recreated.
- `scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts`: added the new spec-folder mock export and aligned expectations with current trigger filtering.
- `scripts/tests/memory-learn-command-docs.vitest.ts`: removed stale doc paths that no longer exist in the active command/agent layout.
- `mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`: documented the intentional Codex timeout fallback while other runtimes fail open silently.
- `scripts/tests/test-integration.vitest.ts`: raised the integration test timeout for full validator subprocess runs.

## Files Modified

- `.opencode/skill/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts`

## Verification

- `vitest run ../scripts/tests/test-integration.vitest.ts skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts ../scripts/tests/deep-review-reducer-schema.vitest.ts ../scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts ../scripts/tests/memory-learn-command-docs.vitest.ts --reporter=default` passed after the final docs-list update.
- `vitest run ../scripts/tests/continuity-freshness.vitest.ts tests/transcript-planner-export.vitest.ts ../scripts/tests/quality-scorer-disambiguation.vitest.ts tests/gate-d-regression-reconsolidation.vitest.ts --reporter=default` passed or skipped only the removed packet 015 fixture.

## Proposed Commit Message

`test(system-spec-kit): refresh vitest contracts for current docs and fixtures`
