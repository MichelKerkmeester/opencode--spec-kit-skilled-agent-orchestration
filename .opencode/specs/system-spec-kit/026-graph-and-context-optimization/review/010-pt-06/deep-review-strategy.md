# Deep Review Strategy - 004 Raise Rerank Minimum

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Review the Stage 3 minimum-rerank threshold change with emphasis on the 3-result/4-result boundary, local-reranker parity, and whether the packet claims match the shipped gate.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Sub-phase review of `004-raise-rerank-minimum`

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Re-tuning the threshold beyond `4` in this review run.
- Changing the provider fallback order or local-reranker implementation.
- Editing runtime or tests.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop after 2 iterations unless a new correctness or security regression appears around the 4-result gate.

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Reading the Stage 3 guard and the dedicated regression suite together made the threshold behavior easy to verify. (iteration 1)
- Rechecking the implementation summary against the local-reranker boundary assertions confirmed the phase stayed narrow and coherent. (iteration 2)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- Looking for a hidden 2-result/3-result rerank path outside Stage 3 did not surface any contradiction once the boundary tests were read directly. (iteration 2)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Local-path threshold drift: the local GGUF reranker follows the same 4-result minimum boundary. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Local-path threshold drift: the local GGUF reranker follows the same 4-result minimum boundary. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Local-path threshold drift: the local GGUF reranker follows the same 4-result minimum boundary. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164`]

### Missing evidence for the local-path change: the regression suite includes an explicit local-reranker boundary assertion. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Missing evidence for the local-path change: the regression suite includes an explicit local-reranker boundary assertion. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing evidence for the local-path change: the regression suite includes an explicit local-reranker boundary assertion. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164`]

### Packet/code mismatch on the threshold boundary: the implementation summary correctly describes the 3-row skip and 4-row apply behavior. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md:35`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Packet/code mismatch on the threshold boundary: the implementation summary correctly describes the 3-row skip and 4-row apply behavior. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md:35`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet/code mismatch on the threshold boundary: the implementation summary correctly describes the 3-row skip and 4-row apply behavior. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md:35`]

### Rechecking provider-specific reranker internals did not reveal anything relevant to this narrow Stage 3 policy change. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:332`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Rechecking provider-specific reranker internals did not reveal anything relevant to this narrow Stage 3 policy change. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:332`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rechecking provider-specific reranker internals did not reveal anything relevant to this narrow Stage 3 policy change. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:332`]

### Searching for a second threshold gate outside Stage 3 did not uncover any conflicting runtime path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a second threshold gate outside Stage 3 did not uncover any conflicting runtime path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a second threshold gate outside Stage 3 did not uncover any conflicting runtime path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49`]

### Three-row candidate sets still rerank: the Stage 3 guard returns early for fewer than four results, and the regression suite asserts that behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:136`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Three-row candidate sets still rerank: the Stage 3 guard returns early for fewer than four results, and the regression suite asserts that behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:136`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Three-row candidate sets still rerank: the Stage 3 guard returns early for fewer than four results, and the regression suite asserts that behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:136`]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- Boundary regression in the local GGUF path: the local-path tests assert the same 4-result minimum. (iteration 1, evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164`)
- Packet/code mismatch on the shipped threshold: the implementation summary accurately describes the 3-row skip and 4-row apply behavior. (iteration 2, evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md:35`)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. No active defects remain for this sub-phase.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- The phase explicitly scoped the change to Stage 3 policy rather than provider internals.
- The threshold can still be revisited later with production telemetry, but this review did not find a current defect in the shipped value of `4`.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | The Stage 3 guard and local-path behavior match the packet scope. |
| `checklist_evidence` | core | pass | 2 | Focused regression tests prove the 3-row/4-row boundary. |
| `feature_catalog_code` | overlay | notApplicable | 2 | No catalog surface changed in this narrow policy phase. |
| `playbook_capability` | overlay | notApplicable | 2 | No playbook surface is in scope. |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/004-raise-rerank-minimum/spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md` | D3, D4 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | D1, D2, D3, D4 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts` | D1, D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts` | D1, D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 2
- Convergence threshold: 0.10
- Session lineage: sessionId=2026-04-13T07:50:00Z-017-004-raise-rerank-minimum-review, parentSessionId=2026-04-13T06:15:00Z-017-search-fusion-tuning-review, generation=1, lineageMode=new
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=feature_catalog_code, playbook_capability
- Started: 2026-04-13T07:50:00Z
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->
