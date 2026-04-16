# Iteration 8 - correctness - lib

## Dispatcher
- iteration: 8 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:30:54.617Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`SPEC_DOC_SUFFICIENCY` ignores anchor-parse failures, so malformed required anchors can still produce a passing sufficiency result.**  
   **Evidence:** `validateSpecDocSufficiency()` builds `anchorMap` directly from `parseAnchors(document.content).anchors` and never checks `parsed.errors`, unlike `validateMergeLegality()` which explicitly blocks on anchor-parse errors first. That means orphaned/unclosed anchors are silently dropped from sufficiency evaluation instead of failing the rule.  
   **Refs:** `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:665-672`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:743-800`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:209-240`

   ```json
   {
     "claim": "Malformed anchor structure can slip through SPEC_DOC_SUFFICIENCY because parseAnchors() errors are ignored and only successfully closed anchors are evaluated.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:665-672",
       ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:743-800",
       ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:627-672",
       ".opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:209-240"
     ],
     "counterevidenceSought": "Looked for a parsed.errors guard in validateSpecDocSufficiency() or a dedicated malformed-anchor sufficiency test; only merge-legality blocks on parse errors and the tests cover empty/citation-poor anchors, not malformed ones.",
     "alternativeExplanation": "A separate validator may reject malformed anchors before sufficiency is consulted in some higher-level flows.",
     "finalSeverity": "P1",
     "confidence": 0.92,
     "downgradeTrigger": "Downgrade to P2 if every production caller is proven to run a mandatory anchor-integrity gate before trusting SPEC_DOC_SUFFICIENCY."
   }
   ```

2. **Folder-scoped spec-doc rules accept arbitrary absolute paths, so they can validate the wrong file entirely.**  
   **Evidence:** `resolveTargetPath()` returns any absolute candidate unchanged. `validateMergeLegality()` and `validatePostSaveFingerprint()` both consume that value without checking it stays under `folder`, even though both rules are documented and parameterized as folder-specific validation. A caller can therefore point either rule at an unrelated absolute path and obtain a pass/fail unrelated to the spec folder being checked.  
   **Refs:** `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:438-445`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:627-736`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:883-909`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:275-289`

   ```json
   {
     "claim": "The exported folder-scoped validators can be steered at any absolute path, so they may report success for files outside the target spec folder.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:438-445",
       ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:627-736",
       ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:883-909",
       ".opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:275-289"
     ],
     "counterevidenceSought": "Looked for a containment check after resolveTargetPath() or regression coverage for out-of-folder absolute inputs; found neither.",
     "alternativeExplanation": "Upstream planners may currently sanitize target paths before calling these validators.",
     "finalSeverity": "P1",
     "confidence": 0.89,
     "downgradeTrigger": "Downgrade to P2 if upstream invocation is guaranteed to canonicalize and reject any path outside the supplied folder before this module is reached."
   }
   ```

### P2 Findings
- **Whitespace-only trigger phrases count as real trigger coverage.** `scoreTriggerQuality()` uses raw array length with no trim/filter step, and `scoreContentQuality()` feeds that score straight into signal density. A payload like `['   ', '']` can therefore inflate the advisory quality score even though it carries no usable trigger metadata. Coverage only exercises populated strings. **Refs:** `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:493-497`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:603-648`, `.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:399-418`

## Traceability Checks
- `runQualityGate()`'s planner-advisory behavior matches the surrounding pipeline intent: in non-legacy mode it only blocks structural defects while surfacing `wouldReject` for content-quality and semantic-dedup concerns. The implementation and pipeline tests line up here. **Refs:** `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:832-848`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:993-1019`
- `SPEC_DOC_SUFFICIENCY` does **not** fully match its stated anchor-sufficiency role because malformed anchors are ignored rather than failing fast, so a "pass" can mean "anchors parsed cleanly enough to inspect" in tests but not in the implementation.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:245-298` - warn-only activation persistence is internally consistent: persisted timestamps are lazy-loaded, not clobbered on restart, and reset clears both in-memory and DB state.
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:761-860` - the planner-advisory vs `legacy` pass/fail split is deliberate and reflected in focused pipeline coverage.
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:685-736` - in-folder merge-shape compatibility, table-width checks, and task-id presence checks are coherent once the target path is trusted.

## Next Focus
- Iteration 9 should stay in `lib` and inspect adjacent path/containment and parser-integrity helpers that feed these validators, especially any callers that construct `mergePlan` / `postSavePlan` or normalize trigger metadata before scoring.
