---
title: Deep Review Strategy
description: Gate B batch-local review tracking for the canonical continuity refactor.
---

# Deep Review Strategy - Gate B Foundation

## 1. OVERVIEW

### Purpose
Track the Gate B slice of Batch 1/5 with emphasis on anchor-aware causal-edge behavior and packet/runtime traceability.

### Usage
- Batch scope: Gate B iterations 3-5 only
- Current phase focus: schema correctness, packet/code traceability, and security rule-out
- Reducer handoff: `deep-review-findings-registry.json`

## 2. TOPIC
Gate B foundation review for causal-edge anchor semantics, migration contract fidelity, and storage-layer safety.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — reviewed in iteration 001
- [x] D2 Security — reviewed in iteration 003
- [x] D3 Traceability — reviewed in iteration 002
- [ ] D4 Maintainability — not allocated in Batch 1 for Gate B
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Do not re-run the archive flip or checkpoint restore in this review packet.
- Do not review Gate C writer surfaces here except where the Gate B docs cross-reference them.
- Do not edit the reviewed storage code.

## 5. STOP CONDITIONS
- Stop after the allocated three Gate B iterations for this batch.
- Stop early only for a confirmed P0 on schema corruption or security exposure.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 001 | Anchor-aware edges still collapse on `(source_id,target_id,relation)` uniqueness. |
| D3 Traceability | CONDITIONAL | 002 | The complete packet spec still requires removed ranking/telemetry work, contradicting the cleanup contract. |
| D2 Security | PASS | 003 | Reviewed queries stay parameterized; no new SQL injection or direct string-splice risk surfaced. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Schema-to-write-path tracing: following the uniqueness key from DDL into `insertEdge()` and `reconsolidation.ts` exposed the anchor-collision defect quickly (iteration 001)
- Packet-vs-closeout comparison: reading `spec.md` against `tasks.md` and `implementation-summary.md` isolated cleanup drift without needing to mutate runtime files (iteration 002)
- Prepared-statement spot checks: enough to rule out new SQL injection risk in the reviewed storage paths (iteration 003)

## 9. WHAT FAILED
- None. Every review pass either produced a concrete finding or cleanly ruled out the target risk.

## 10. EXHAUSTED APPROACHES (do not retry)
### Storage query safety -- PRODUCTIVE (iteration 003)
- What worked: inspect SQL callsites that still use placeholders
- Prefer for: future Gate B security stability passes

## 11. RULED OUT DIRECTIONS
- Checkpoint snapshot dropping anchor columns: ruled out because checkpoint snapshots serialize `SELECT *` rows for `causal_edges`.
- New SQL injection risk in the reviewed Gate B storage helpers: ruled out by placeholder-based statements in the inspected callsites.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Gate B batch slice complete. If a later extension pass is requested, review maintainability and downgrade-path behavior rather than rechecking the same uniqueness and packet-drift issues.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- Gate B is supposed to make `causal_edges` anchor-aware without reopening superseded archive-tier ranking work.
- The packet is marked complete, so spec/tasks/implementation-summary drift is materially relevant to downstream planning.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 001 | Schema and upsert logic still collapse anchor-distinct edges. |
| `checklist_evidence` | core | partial | 002 | Tasks and implementation summary reflect the cleanup contract, but `spec.md` still requires removed ranking/telemetry work. |
| `skill_agent` | overlay | notApplicable | 003 | No skill/agent runtime overlays reviewed here. |
| `agent_cross_runtime` | overlay | notApplicable | 003 | No cross-runtime surfaces in Gate B scope. |
| `feature_catalog_code` | overlay | notApplicable | 003 | No feature-catalog surface in Gate B scope. |
| `playbook_capability` | overlay | notApplicable | 003 | No playbook surface in Gate B scope. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | D1 | 001 | 1 P1 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | D1, D2 | 003 | 1 P1 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | D1, D2 | 003 | 0 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts` | D1, D2 | 003 | 1 P1 | partial |
| `002-gate-b-foundation/spec.md` | D3 | 002 | 1 P1 | partial |
| `002-gate-b-foundation/tasks.md` | D3 | 002 | 0 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.15
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=4F1FCBD8-91BF-4802-8F12-1EF32FB1FD71, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: unknown | converged | release-blocking
- Per-iteration budget: review-only batch slice
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=`spec_code`, `checklist_evidence`; overlay=`feature_catalog_code`, `playbook_capability`
- Started: 2026-04-12T17:01:22Z
<!-- MACHINE-OWNED: END -->
