# Iteration 006: D6 Reliability

## Findings

No P0 issues found.

### [P1] `memory_save` collapses post-commit persistence failures into generic "anchor issues" warnings, obscuring partial-failure recovery
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:957-963`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:991-1005`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:370-398`
- **Issue**: When the quality loop produces corrected content, `processPreparedMemory()` commits the corrected content to the database first and only then best-effort persists that corrected file back to disk. If that post-commit file write fails, the handler records a warning and still returns success. The response builder then rewrites every warning into the same "anchor issues detected" message/hint path, so a real partial-failure warning is surfaced as if it were only a searchability advisory.
- **Evidence**: `finalizeWarning` is set specifically for "Quality-loop file persistence failed after DB commit" and appended to the `IndexResult`. `buildSaveResponse()` does not preserve warning semantics: any `result.warnings` array changes the user-visible message to `with N warning(s) - anchor issues detected` and adds only `Review anchor warnings for better searchability`. That means an operator can receive a success envelope that hides the fact that the DB accepted corrected content while the source file may still be stale.
- **Fix**: Preserve warning classes instead of flattening them into the anchor-warning path. At minimum, route persistence/rollback warnings to explicit partial-failure messaging and recovery hints; ideally add structured warning codes so the response can distinguish searchability advisories from post-commit file-consistency failures.

```json
{
  "type": "claim-adjudication",
  "claim": "memory_save currently misreports a post-commit file-persistence failure as a generic anchor/searchability warning, which weakens recovery and can hide DB-vs-file divergence from operators.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:957-963",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:991-1005",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:370-398"
  ],
  "counterevidenceSought": "The save response may expose the raw warning text elsewhere in the MCP envelope or client UX, making the generic summary text less important than it appears in the handler.",
  "alternativeExplanation": "The current response-builder warning text may have been written around anchor-quality advisories first, and later warning classes were added without updating the summary/hint copy.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if the actual client contract always renders the full warning payload prominently enough that operators reliably see the post-commit persistence failure and its recovery implications."
}
```

## Notes

- I did not find a new reliability break in `scripts/core/workflow.ts`'s manual-fallback path itself. The reviewed save workflow records failed embedding/index states in metadata and warns when the retry-manager import is unavailable instead of crashing the save flow.
- `mcp_server/lib/errors/core.ts` and `index.ts` remain ESM-clean in the reviewed paths: the lazy `retry.js` import degrades to legacy transient/permanent classification, and the barrel re-exports are extension-correct.
- `mcp_server/startup-checks.ts` is intentionally non-critical in the reviewed code: marker-file parse/write errors and SQLite version probe failures are caught and downgraded to warnings.
- `mcp_server/handlers/memory-ingest.ts` did not introduce an ESM-specific async-import hazard in this pass; the reviewed handler paths are static-import based and return structured MCP errors for invalid jobs/paths.
- `mcp_server/lib/storage/transaction-manager.ts` still preserves the important recovery contract after rename failures: pending files are left in place when the DB already committed, and startup recovery helpers can discover them later.

## Summary

- P0: 0 findings
- P1: 1 finding
- P2: 0 findings
- newFindingsRatio: 1.0
- Recommended next focus: D7 Completeness on checklist/task/plan closure drift and any remaining ESM-specific test coverage gaps
