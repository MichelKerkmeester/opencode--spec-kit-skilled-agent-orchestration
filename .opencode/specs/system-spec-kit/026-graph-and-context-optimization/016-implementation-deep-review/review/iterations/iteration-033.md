# Iteration 33 - traceability - tests

## Dispatcher
- iteration: 33 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:15:53Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`reconsolidation-bridge.vitest.ts` never exercises the planner-default safety branch it claims to protect.**  
   The test named `skips reconsolidation on planner-default saves until explicit follow-up is requested` leaves `plannerMode` at the default `plan-only` and keeps save-time reconsolidation disabled via the mocked flag, so `runReconsolidationIfEnabled()` exits before either the TM-06 or assistive reconsolidation branches are reachable. In other words, this assertion passes because the global gate is off, not because planner-default saves are being held until explicit follow-up. A regression that accidentally removed the planner-mode safeguard would still pass this suite as long as the mocked flag remained `false`.  
   **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:90-95`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:114-140`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:170-183`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:187-196`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:380-389`

   ```json
   {
     "claim": "The planner-default reconsolidation regression test is false-positive because it never enables the code path gated by plannerMode/save-time reconsolidation, so it does not prove planner-default saves are held until explicit follow-up.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:90-95",
       ".opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:114-140",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:170-183",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:187-196",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:380-389"
     ],
     "counterevidenceSought": "Checked whether the test passed plannerMode:'full-auto' or enabled isSaveReconsolidationEnabled(); it does neither. Checked whether planner-default logic was enforced somewhere outside allowSaveTimeReconsolidation; it is not.",
     "alternativeExplanation": "The author may have intended this as a broad 'reconsolidation disabled by default' regression, but the test name and assertion text explicitly claim planner-default follow-up behavior.",
     "finalSeverity": "P1",
     "confidence": 0.97,
     "downgradeTrigger": "Downgrade if the contract is reworded so this test is only meant to verify the global opt-in gate, not planner-default follow-up safety."
   }
   ```

### P2 Findings
- **`search-limits-scoring.vitest.ts` has source-grep integration checks whose names overstate what they prove.** `T211-HI2`/`T211-HI3`/`T211-HI4` only assert that source files still contain the strings `calculateLengthPenalty`, `shouldApplyLengthPenalty`, and `applyLengthPenalty` (`.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:239-266`). That is much weaker than the test names imply, especially because the current implementation has already reduced `calculateLengthPenalty()` to a constant `1.0` and `applyLengthPenalty()` to a no-op clone (`.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230-240`). The suite would keep passing after substantial runtime drift as long as those identifiers remained in the source.

## Traceability Checks
- **TM-04/TM-06 boundary remains internally consistent across the dedicated suites.** `save-quality-gate.vitest.ts` correctly locks `0.89` as below the TM-04 duplicate threshold (`.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:864-891`), while `reconsolidation.vitest.ts` separately locks `0.88` as the TM-06 merge threshold and checks the boundary behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:317-340`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1049-1099`). The intended split between quality-gate rejection and reconsolidation takeover is traceable in tests.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts` - good coverage of handover -> continuity -> spec-doc fallback order, malformed continuity fallback, and explicit `specFolder` override precedence.
- `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts` - redaction checks are behavior-level, not just shape checks; the suite explicitly verifies that sensitive fields are omitted from serialized telemetry.
- `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts` - classifier examples and the ambiguity-refusal guard both map cleanly to the current router contract.
- `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts` - the failure-path assertion is narrow but meaningful: it proves history writes are suppressed when cleanup does not actually delete an orphaned predecessor.

## Next Focus
- Stay on test traceability around CLI/script-facing suites: `progressive-validation.vitest.ts` and `quality-loop.vitest.ts` are large enough to hide more name-vs-assertion mismatches, especially where shell output or advisory/default-ON behavior is involved.
