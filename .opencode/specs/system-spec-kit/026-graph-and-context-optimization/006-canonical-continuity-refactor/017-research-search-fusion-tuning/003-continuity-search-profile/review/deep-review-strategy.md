# Deep Review Strategy - 003 Continuity Search Profile

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Review the continuity-profile lane with emphasis on whether the new internal `continuity` intent actually survives through the full ranking path when the default Stage 3 MMR pass runs.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Sub-phase review of `003-continuity-search-profile`

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Expanding the public intent union with `continuity`.
- Tuning graph-edge priors or other intent-aware subsystems outside the targeted files.
- Editing runtime code during review.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop after 3 iterations unless a second P1/P0 ranking defect appears in the continuity path.

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
- P1 (Required): 1
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Reading the handler wiring and Stage 1 handoff before Stage 3 made the partial propagation issue obvious. (iteration 1)
- Checking `SPECKIT_MMR` defaults and the lambda map confirmed this is live under default settings, not a dormant edge case. (iteration 2)
- Re-running the focused adaptive and handler test suites helped separate existing coverage from the missing Stage 3 continuity assertion. (iteration 3)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- Treating the issue as fusion-only did not hold up once the final ranking path was traced into Stage 3 MMR. (iteration 1)
- Looking for an existing continuity-aware lambda or Stage 3 override failed; none exists in the current code. (iteration 2)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Additional handler or Stage 1 defect: the continuity intent is passed into Stage 1 correctly. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Additional handler or Stage 1 defect: the continuity intent is passed into Stage 1 correctly. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Additional handler or Stage 1 defect: the continuity intent is passed into Stage 1 correctly. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538`]

### Dormant-edge-case downgrade: MMR is enabled by default, so the Stage 3 intent choice matters in normal runs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:69`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Dormant-edge-case downgrade: MMR is enabled by default, so the Stage 3 intent choice matters in normal runs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:69`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dormant-edge-case downgrade: MMR is enabled by default, so the Stage 3 intent choice matters in normal runs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:69`]

### Public intent API expansion bug: the phase intentionally keeps `continuity` out of the public intent union. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/tasks.md:3`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Public intent API expansion bug: the phase intentionally keeps `continuity` out of the public intent union. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/tasks.md:3`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Public intent API expansion bug: the phase intentionally keeps `continuity` out of the public intent union. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/tasks.md:3`]

### Searching for a hidden continuity-aware Stage 3 lambda or override did not surface any alternate path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a hidden continuity-aware Stage 3 lambda or override did not surface any alternate path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a hidden continuity-aware Stage 3 lambda or override did not surface any alternate path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641`]

### Security regression from the new handler/profile wiring: the change affects intent selection only and does not broaden scope or expose data. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Security regression from the new handler/profile wiring: the change affects intent selection only and does not broaden scope or expose data. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Security regression from the new handler/profile wiring: the change affects intent selection only and does not broaden scope or expose data. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830`]

### The current adaptive and handler suites do not rebut the P1 because they stop at Stage 2/handler-level continuity assertions instead of checking the Stage 3 MMR lambda choice. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The current adaptive and handler suites do not rebut the P1 because they stop at Stage 2/handler-level continuity assertions instead of checking the Stage 3 MMR lambda choice. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The current adaptive and handler suites do not rebut the P1 because they stop at Stage 2/handler-level continuity assertions instead of checking the Stage 3 MMR lambda choice. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]

### Treating the issue as a Stage 2-only concern does not hold up because Stage 3 still performs ranking work after fusion. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:167`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the issue as a Stage 2-only concern does not hold up because Stage 3 still performs ranking work after fusion. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:167`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the issue as a Stage 2-only concern does not hold up because Stage 3 still performs ranking work after fusion. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:167`]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- Public intent API regression: the phase intentionally keeps `continuity` internal-only. (iteration 2, evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/tasks.md:3`)
- Security regression from the new profile wiring: no auth or scope surface changed in the handler or adaptive-fusion profile definition. (iteration 2, evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830`)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. Fix the Stage 3 handoff first, then add a regression that proves resume-profile continuity survives through MMR.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- This phase intentionally avoided changing the public intent classifier or router surfaces.
- `SPECKIT_MMR` defaults to enabled, so Stage 3's intent choice affects the default runtime ordering.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 2 | The packet promises continuity-oriented pipeline wiring, but Stage 3 still ignores the internal continuity intent. |
| `checklist_evidence` | core | pass | 3 | Focused tests cover Stage 1/Stage 2 continuity surfaces, but they do not contradict the Stage 3 gap. |
| `feature_catalog_code` | overlay | notApplicable | 3 | No catalog update is in scope for this narrow phase review. |
| `playbook_capability` | overlay | notApplicable | 3 | No playbook surface is in scope. |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/spec.md` | D3 | 2 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/tasks.md` | D3 | 2 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/implementation-summary.md` | D3, D4 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts` | D1, D3, D4 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | D1, D2, D3, D4 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D1, D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | D1, D3, D4 | 2 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | D1, D3 | 2 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts` | D1, D3 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts` | D1, D3 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts` | D3 | 3 | 0 P0, 1 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Session lineage: sessionId=2026-04-13T07:15:00Z-017-003-continuity-search-profile-review, parentSessionId=2026-04-13T06:15:00Z-017-search-fusion-tuning-review, generation=1, lineageMode=new
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=feature_catalog_code, playbook_capability
- Started: 2026-04-13T07:15:00Z
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->
