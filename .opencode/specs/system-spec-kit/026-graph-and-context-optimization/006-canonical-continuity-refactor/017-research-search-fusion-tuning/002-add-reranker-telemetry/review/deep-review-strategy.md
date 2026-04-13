# Deep Review Strategy - 002 Add Reranker Telemetry

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Review the reranker telemetry lane with emphasis on cache counter correctness, status shape, reset lifecycle, and whether the packet promises stay within the shipped runtime contract.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Sub-phase review of `002-add-reranker-telemetry`

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Changing the TTL, cache bound, or eviction strategy.
- Adding dashboard or MCP-tool exposure outside the existing `getRerankerStatus()` surface.
- Editing any runtime code under review.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop after 2 iterations unless a P0/P1 issue appears in the counter semantics or reset lifecycle.

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
- Reading the cache lookup branch and the reset path together made the counter lifecycle easy to verify. (iteration 1)
- Checking the phase plan before escalating the lack of a separate handler confirmed that `getRerankerStatus()` is the intended primary surface. (iteration 2)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- Treating the missing MCP handler consumer as an automatic traceability defect did not hold up once the phase plan explicitly named `getRerankerStatus()` as the primary surface. (iteration 2)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Counter reset drift: `resetSession()` clears the cache counters, latency samples, and circuit breakers together. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counter reset drift: `resetSession()` clears the cache counters, latency samples, and circuit breakers together. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counter reset drift: `resetSession()` clears the cache counters, latency samples, and circuit breakers together. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`]

### Missing dedicated handler/tool as a phase defect: the phase plan explicitly says the clean primary surface is `getRerankerStatus()`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/plan.md:8`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Missing dedicated handler/tool as a phase defect: the phase plan explicitly says the clean primary surface is `getRerankerStatus()`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/plan.md:8`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing dedicated handler/tool as a phase defect: the phase plan explicitly says the clean primary surface is `getRerankerStatus()`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/plan.md:8`]

### Packet/code mismatch on cache block fields: the implementation summary and tests both reference the shipped `cache` block with `entries`, `maxEntries`, and `ttlMs`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/implementation-summary.md:36`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:160`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Packet/code mismatch on cache block fields: the implementation summary and tests both reference the shipped `cache` block with `entries`, `maxEntries`, and `ttlMs`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/implementation-summary.md:36`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:160`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet/code mismatch on cache block fields: the implementation summary and tests both reference the shipped `cache` block with `entries`, `maxEntries`, and `ttlMs`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/implementation-summary.md:36`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:160`]

### Searching for a hidden second telemetry payload outside `getRerankerStatus()` did not uncover contradictory runtime behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for a hidden second telemetry payload outside `getRerankerStatus()` did not uncover contradictory runtime behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a hidden second telemetry payload outside `getRerankerStatus()` did not uncover contradictory runtime behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516`]

### Security exposure from the new counters: the status payload adds aggregate numbers only and does not expose provider secrets or cached document content. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:530`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Security exposure from the new counters: the status payload adds aggregate numbers only and does not expose provider secrets or cached document content. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:530`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Security exposure from the new counters: the status payload adds aggregate numbers only and does not expose provider secrets or cached document content. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:530`]

### Trying to escalate stale-hit accounting into a correctness bug did not hold up; the spec explicitly wants stale hits tracked alongside misses and evictions. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/tasks.md:4`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Trying to escalate stale-hit accounting into a correctness bug did not hold up; the spec explicitly wants stale hits tracked alongside misses and evictions. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/tasks.md:4`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to escalate stale-hit accounting into a correctness bug did not hold up; the spec explicitly wants stale hits tracked alongside misses and evictions. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/tasks.md:4`]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- Counter reset drift: `resetSession()` clears cache counters alongside latency and circuit state as intended. (iteration 1, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`)
- Packet/runtime mismatch on the intended status surface: the plan names `getRerankerStatus()` as the primary telemetry surface. (iteration 2, evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/plan.md:8`)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. No active defects remain for this sub-phase.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- The phase intentionally scoped telemetry to the shared reranker module rather than adding new UI or handler surfaces.
- The next tuning passes can query `getRerankerStatus()` directly for cache telemetry.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Counter fields and status shape match the packet scope. |
| `checklist_evidence` | core | pass | 2 | Focused tests cover the new cache block and reset semantics. |
| `feature_catalog_code` | overlay | notApplicable | 2 | No catalog surface was changed in this narrow telemetry phase. |
| `playbook_capability` | overlay | notApplicable | 2 | No playbook surface is in scope. |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/plan.md` | D3, D4 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/002-add-reranker-telemetry/implementation-summary.md` | D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | D1, D2, D3, D4 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` | D1, D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` | D1, D4 | 2 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 2
- Convergence threshold: 0.10
- Session lineage: sessionId=2026-04-13T06:55:00Z-017-002-add-reranker-telemetry-review, parentSessionId=2026-04-13T06:15:00Z-017-search-fusion-tuning-review, generation=1, lineageMode=new
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=feature_catalog_code, playbook_capability
- Started: 2026-04-13T06:55:00Z
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->
