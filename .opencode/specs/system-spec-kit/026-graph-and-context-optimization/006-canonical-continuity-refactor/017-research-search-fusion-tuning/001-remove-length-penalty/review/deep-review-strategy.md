# Deep Review Strategy - 001 Remove Length Penalty

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Review the length-penalty removal lane with emphasis on the live reranker path, cache key behavior, and packet/code parity for the compatibility-preserving no-op.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Sub-phase review of `001-remove-length-penalty`

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Reintroducing any size-based penalty or replacement normalization heuristic.
- Changing reranker provider selection, TTL policy, or circuit-breaker thresholds.
- Editing the review target code; this run is read-only.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop after 3 iterations unless a new P0/P1 issue appears in `cross-encoder.ts` or the handler wiring.

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
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Cross-checking the packet scope against the live cache-key branch exposed the remaining compatibility residue quickly. (iteration 1)
- Running the focused reranker suites confirmed the live ranking behavior is stable while the cleanup concern remains isolated. (iteration 2)
- Re-reading the handler default showed why the cache split is low-risk but still real tech debt. (iteration 3)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- Looking for a live ranking regression after the penalty removal did not yield a correctness issue; the remaining concern is cache hygiene, not relevance math. (iteration 2)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Chasing this issue as a correctness bug did not hold up after the focused tests and direct helper read; it remains maintainability-only debt. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:230`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Chasing this issue as a correctness bug did not hold up after the focused tests and direct helper read; it remains maintainability-only debt. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:230`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Chasing this issue as a correctness bug did not hold up after the focused tests and direct helper read; it remains maintainability-only debt. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:230`]

### Hidden live length penalties in the handler path: the handler still forwards `applyLengthPenalty`, but the downstream helper remains a no-op. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hidden live length penalties in the handler path: the handler still forwards `applyLengthPenalty`, but the downstream helper remains a no-op. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hidden live length penalties in the handler path: the handler still forwards `applyLengthPenalty`, but the downstream helper remains a no-op. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`]

### Live ranking regression: `applyLengthPenalty()` is a no-op clone and no longer changes scores. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Live ranking regression: `applyLengthPenalty()` is a no-op clone and no longer changes scores. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live ranking regression: `applyLengthPenalty()` is a no-op clone and no longer changes scores. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`]

### Looking for a second hidden size-based scoring branch in Stage 3 did not surface anything beyond the compatibility plumbing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a second hidden size-based scoring branch in Stage 3 did not surface anything beyond the compatibility plumbing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a second hidden size-based scoring branch in Stage 3 did not surface anything beyond the compatibility plumbing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146`]

### Packet/code mismatch on the shipped behavior: the implementation summary accurately describes a compatibility-preserving no-op. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:35`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Packet/code mismatch on the shipped behavior: the implementation summary accurately describes a compatibility-preserving no-op. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:35`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet/code mismatch on the shipped behavior: the implementation summary accurately describes a compatibility-preserving no-op. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:35`]

### Provider fallback or circuit-breaker behavior changed during the length-penalty removal: the provider resolution and fallback branches are untouched. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Provider fallback or circuit-breaker behavior changed during the length-penalty removal: the provider resolution and fallback branches are untouched. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Provider fallback or circuit-breaker behavior changed during the length-penalty removal: the provider resolution and fallback branches are untouched. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`]

### Re-checking the focused status tests did not reveal a stronger defect than the cache split already recorded. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:150`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-checking the focused status tests did not reveal a stronger defect than the cache split already recorded. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:150`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-checking the focused status tests did not reveal a stronger defect than the cache split already recorded. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:150`]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- Live score drift after penalty removal: ruled out by the no-op helpers and passing focused reranker suites. (iteration 2, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230`)
- Security regression in fallback/provider resolution: ruled out by direct review of the unchanged provider path. (iteration 2, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. The only sensible follow-on is a dedicated cleanup phase that retires the stale cache-key flag and no-op clone path together.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- This sub-phase intentionally kept the request surface stable and documented the cache-key residue as follow-on cleanup.
- The follow-up telemetry phase depends on cache counters staying meaningful after this compatibility-preserving change.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | The packet accurately describes a compatibility-preserving no-op removal. |
| `checklist_evidence` | core | pass | 3 | The implementation summary and focused tests align with the shipped code path. |
| `feature_catalog_code` | overlay | notApplicable | 3 | No additional catalog claims were needed for this narrow phase review. |
| `playbook_capability` | overlay | notApplicable | 3 | No manual playbook surface is in scope for this sub-phase. |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/001-remove-length-penalty/spec.md` | D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md` | D3, D4 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | D1, D2, D3, D4 | 3 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | D1, D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | D3, D4 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` | D1, D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` | D1, D4 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts` | D3, D4 | 3 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Session lineage: sessionId=2026-04-13T06:20:00Z-017-001-remove-length-penalty-review, parentSessionId=2026-04-13T06:15:00Z-017-search-fusion-tuning-review, generation=1, lineageMode=new
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=feature_catalog_code, playbook_capability
- Started: 2026-04-13T06:20:00Z
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->
