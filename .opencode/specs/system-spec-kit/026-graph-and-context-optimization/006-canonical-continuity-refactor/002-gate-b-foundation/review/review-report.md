# Deep Review Report: Gate B - Foundation

## 1. Executive Summary
- Verdict: **CONDITIONAL**
- Scope: Gate B schema, storage helpers, and packet/runtime traceability
- Active findings: 0 P0 / 2 P1 / 0 P2
- hasAdvisories: false

## 2. Planning Trigger
Gate B needs a focused remediation packet because one defect is in live code and the second leaves the completed packet contract internally contradictory.

## 3. Active Finding Registry
### P1-001 [P1] Anchor-aware causal edges still collapse distinct anchor pairs into a single row
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:621`
- Evidence: the schema and upsert path still key edges only by `(source_id,target_id,relation)` even after adding anchor columns [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:621] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:267]
- Recommendation: extend the identity model or dedupe behavior so anchor-distinct edges persist separately.

### P1-002 [P1] Gate B spec still requires removed archive-ranking and telemetry work
- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:81`
- Evidence: `spec.md` still demands archived-row ranking and `archived_hit_rate`, while the task ledger and implementation summary say those items were removed by cleanup [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/tasks.md:76] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/implementation-summary.md:149]
- Recommendation: rewrite the complete packet spec so the live Gate B contract matches the cleanup reality.

## 4. Remediation Workstreams
- Workstream A: Fix causal-edge identity/upsert semantics for anchor-distinct edges.
- Workstream B: Reconcile Gate B `spec.md` with the cleanup contract and remove stale archived-tier requirements.

## 5. Spec Seed
- Add a clear supersession note or rewrite the Gate B requirements so removed ranking/telemetry items are no longer active acceptance criteria.

## 6. Plan Seed
- Update the `causal_edges` uniqueness model and its write helpers.
- Add/adjust tests for multiple anchor-distinct edges between the same memory pair.
- Rewrite Gate B `spec.md` to match `tasks.md` and `implementation-summary.md`.

## 7. Traceability Status
- Core protocols: `spec_code=fail`, `checklist_evidence=partial`
- Overlay protocols: not applicable in this slice

## 8. Deferred Items
- Maintainability and downgrade-path review were outside this batch allocation.

## 9. Audit Appendix
- Iterations completed: 3
- Dimensions covered: correctness, traceability, security
- Ruled out: checkpoint snapshot dropping anchor columns; new SQL injection in reviewed storage paths
