---
title: "Deep Review Strategy - 010-fts-capability-cascade-floor"
description: "Session tracking for Batch B review of 010-fts-capability-cascade-floor."
---

# Deep Review Strategy - 010-fts-capability-cascade-floor

## 1. OVERVIEW

Batch review packet for `010-fts-capability-cascade-floor`.

## 2. TOPIC

Batch review of `010-fts-capability-cascade-floor`

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness - FTS capability detection, fallback labeling, and response metadata truth
- [ ] D2 Security - Fail-open versus fail-closed degrade behavior and truthful runtime signaling
- [ ] D3 Traceability - Spec/checklist/implementation-summary alignment
- [ ] D4 Maintainability - Vocabulary consistency, bounded scope, and documentation honesty
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- No broader search product work or UI changes.
- No runtime fixes; review only the shipped capability-cascade contract.

## 5. STOP CONDITIONS

- Stop at 10 iterations max.
- Stop early on convergence if two consecutive iterations add no new findings.
- Stop immediately if the forced-degrade matrix cannot be traced consistently from runtime to tests to docs.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | The packet records degraded capability states, but the runtime returns empty lexical results while still labeling the request as `bm25_fallback`. |
| D2 Security | PASS | 2 | Fallback state is explicit and does not fail the whole search call closed, but the named lane remains overstated. |
| D3 Traceability | CONDITIONAL | 3 | Spec, implementation summary, README, and tests all describe a degraded fallback lane that the runtime does not actually execute. |
| D4 Maintainability | CONDITIONAL | 4 | The terminology is internally consistent but misleading, which risks propagating the wrong contract to successor packets. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Reading `sqlite-fts.ts` together with the README and the handler metadata made it clear where the capability-status truth ends and the claimed fallback-lane truth begins.
- The tests were useful for proving the current label semantics, which helped isolate the issue as a contract overstatement rather than a missing status field.

## 9. WHAT FAILED

- The focused test suite freezes the degraded labels but never asserts that a real fallback lexical query executed, so it cannot catch the overstatement.

## 10. EXHAUSTED APPROACHES (do not retry)

- None yet.

## 11. RULED OUT DIRECTIONS

- The issue is not missing status metadata; `fallbackState` is explicit. The problem is that `lexicalPath` claims a fallback lane that never actually runs.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Complete after 10 iterations. Active finding remains on the degraded-lane contract: either the runtime must execute a real fallback lexical path or the docs and metadata must stop calling the empty-lane behavior `bm25_fallback`.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Implementation summary claims packet `010` distinguishes `compile_probe_miss`, `missing_table`, `no_such_module_fts5`, and `bm25_runtime_failure` while preserving degraded retrieval behavior.
- It also claims `memory_search` exposes `lexicalPath` and `fallbackState` directly on the response envelope.
- Known limitation: this runtime seam currently emits `fts5` or `bm25_fallback`, even though the broader schema can represent `like`.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 3 | Runtime returns empty lexical results while packet docs and metadata call the lane `bm25_fallback`. |
| `checklist_evidence` | core | partial | 3 | Focused tests freeze the labels but do not prove an actual fallback lexical execution path. |
| `skill_agent` | overlay | notApplicable | 0 | No skill-agent cross-runtime surface in packet scope |
| `agent_cross_runtime` | overlay | notApplicable | 0 | No agent runtime parity work in packet scope |
| `feature_catalog_code` | overlay | notApplicable | 0 | No feature catalog surface in packet scope |
| `playbook_capability` | overlay | notApplicable | 0 | No playbook surface in packet scope |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | [D1, D2, D3, D4] | 10 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | [D1, D2] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts` | [D1, D3] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts` | [D1, D4] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` | [D3, D4] | 10 | 0 P0, 1 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-09T14:20:47Z-010-fts-capability-cascade-floor, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code`,`checklist_evidence`; overlay=`skill_agent`,`agent_cross_runtime`,`feature_catalog_code`,`playbook_capability`
- Started: 2026-04-09T14:20:47Z
<!-- MACHINE-OWNED: END -->
