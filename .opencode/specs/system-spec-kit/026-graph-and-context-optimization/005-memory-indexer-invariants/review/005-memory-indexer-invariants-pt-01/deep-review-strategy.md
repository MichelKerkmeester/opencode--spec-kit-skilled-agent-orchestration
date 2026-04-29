---
title: Deep Review Strategy — 005-memory-indexer-invariants
description: Session strategy for autonomous deep review of memory-indexer-invariants packet.
---

# Deep Review Strategy — 005-memory-indexer-invariants

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Autonomous deep review session for the `005-memory-indexer-invariants` packet. Validates Track A (lineage + concurrency) and Track B (index scope + constitutional tier) invariants across runtime code, focused regression tests, and live-DB verification claims. Session runs 7 iterations max with severity-weighted convergence at 0.10. Executor is `cli-codex` model `gpt-5.5` reasoning `high` service-tier `fast`.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:topic -->
## 2. TOPIC

Validate that the memory-indexer-invariants packet is RELEASE-READY despite its `code-complete-pending-track-a-live-rescan` status. Specifically:

- Confirm A2 lineage post-filter at PE decision point covers all cross-file mutation paths.
- Confirm B2 `fromScan` flag does not leak across save passes and only suppresses the transactional reconsolidation recheck for scan-originated saves.
- Verify the shared SSOT (`lib/utils/index-scope.ts`) is consistently consulted at every mutation surface (save, SQL update, checkpoint restore, code-graph walker, post-insert metadata, cleanup CLI).
- Audit Wave-1 storage-layer remediation (SQL-layer downgrade, atomic checkpoint restore, governance audit emission).
- Audit Wave-2 hardening (cleanup TOCTOU closure, realpath canonicalization, walker DoS caps, governance audit helpers).
- Verify 7 vitest files match documented invariants without false-positive coverage gaps.
- Surface any P0/P1 issues hidden under the aggregate code-complete claim.
- Identify whether CHK-T15 (live MCP rescan) is truly the only release blocker or whether other gaps remain.
<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants. Covered in iteration 1.
- [x] D2 Security — Injection, auth bypass, secrets exposure, unsafe deserialization. Covered in iteration 2.
- [x] D3 Traceability — Spec/code alignment, checklist evidence, cross-reference integrity. Covered in iteration 3.
- [x] D4 Maintainability — Patterns, clarity, documentation quality, safe follow-on change cost. Covered in iteration 4.
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Re-running the live MCP rescan (CHK-T15 P0 blocker) — that requires user MCP restart and is a separate gate.
- Modifying any reviewed code (review target is READ-ONLY).
- Auditing carryover failures in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` — explicitly out-of-scope per implementation-summary §Known Limitations.
- Re-doing dead-code audit on adjacent packets (covered by 026/000-release-cleanup).
<!-- /ANCHOR:non-goals -->

---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Composite weighted-stop score >= 0.60 with all 4 dimensions covered AND zero active P0/P1 findings.
- Hard stop at iteration 7.
- Stuck recovery if newFindingsRatio <= 0.05 for 2 consecutive iterations.
- Claim adjudication gate must pass for any new P0/P1 finding before STOP is legal.
<!-- /ANCHOR:stop-conditions -->

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | A2, B2, SQL update, and restore transaction mechanics mostly hold; P1 remains for constitutional README storage-boundary invariant gap. |
| D2 Security | CONDITIONAL | 2 | No new P0/P1; three P2 hardening advisories around walker caps, stable save-time error code, and chunking helper guard parity. |
| D3 Traceability | CONDITIONAL | 3 | No new P0/P1; four P2 advisories around packet identity drift, catalog identifiers, playbook adversarial scenarios, and runtime trace comments. |
| D4 Maintainability | CONDITIONAL | 4 | No new P0/P1; four P2 advisories around cleanup-policy drift, README repair flow, late ADR alternatives, and duplicated DB fixtures. |
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Blockers):** 0 active
- **P1 (Required):** 1 active
- **P2 (Suggestions):** 13 active
- **Delta this iteration:** +0 P0, +0 P1, +4 P2
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- A2 PE post-filter covers both `UPDATE` and `REINFORCE`, with a null `canonical_file_path` same-file fallback test.
- B2 `fromScan` propagation is constrained to scan-originated saves, with non-scan controls keeping the transactional recheck active.
- Checkpoint restore validates rows before clear/insert inside the restore transaction for clearExisting rollback safety.

---

<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- Shared constitutional-path logic does not encode the README exclusion at storage-layer boundaries.
- The strategy artifact map contains stale `code-graph` / `handlers/memory-parser.ts` paths.
- `checklist.md` evidence is not machine-replayable as `file:line` citations.
- Cleanup repair SQL can drift from `index-scope.ts` because it retypes excluded path segments.
- Operator README documents action strings but not the repair/verify/rollback flow in the invariant section.
- ADR-008 through ADR-012 omit alternatives, making late-stage decisions harder to maintain.
- Invariant tests duplicate partial `memory_index` schemas instead of sharing a DB-shape fixture.

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
[None yet]

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
**STOP candidate — all 4 dimensions covered:**
- Dimension coverage is now correctness, security, traceability, and maintainability.
- Iteration 4 added no P0/P1 findings; cumulative active findings remain P0=0, P1=1, P2=13.
- Loop manager should evaluate STOP gates, noting the existing conditional verdict due to the active P1 and advisory P2 set.
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT

### Packet status (from frontmatter)
- `completion_pct: 95`, `status: code-complete-pending-track-a-live-rescan`
- Single open blocker: `Track A live MCP rescan on 026/009 still pending`
- Verification summary: 12/13 P0, 29/29 P1, 1/1 P2 (CHK-T15 pending)

### Critical runtime files (touched by Track A + Track B)
- `mcp_server/handlers/save/pe-orchestration.ts` — A2 lineage post-filter
- `mcp_server/handlers/save/types.ts` — canonical-path plumbing
- `mcp_server/handlers/pe-gating.ts` — canonical-path threading
- `mcp_server/handlers/memory-index.ts` — fromScan propagation, default BATCH_SIZE
- `mcp_server/handlers/memory-save.ts` — guarded transactional reconsolidation recheck, save-time invariant guard
- `mcp_server/handlers/memory-crud-update.ts` — constitutional → critical transition audit
- `mcp_server/handlers/memory-index-discovery.ts` — SSOT consumer for memory walker
- `mcp_server/lib/utils/index-scope.ts` — SSOT (shouldIndexForMemory, shouldIndexForCodeGraph, EXCLUDED_FOR_MEMORY)
- `mcp_server/lib/utils/canonical-path.ts` — realpath SSOT for symlink hardening
- `mcp_server/lib/config/spec-doc-paths.ts` — spec-doc classification calling SSOT
- `mcp_server/lib/search/vector-index-mutations.ts` — SQL-layer tier downgrade
- `mcp_server/lib/storage/checkpoints.ts` — atomic restore validation
- `mcp_server/lib/storage/post-insert-metadata.ts` — post-insert metadata guard
- `mcp_server/lib/governance/scope-governance.ts` — GOVERNANCE_AUDIT_ACTIONS, recordTierDowngradeAudit()
- `mcp_server/code_graph/lib/structural-indexer.ts` — code-graph walker SSOT consumer + walker DoS caps + realpath
- `mcp_server/code-graph/lib/indexer-types.ts` — exclusion type defs
- `scripts/memory/cleanup-index-scope-violations.ts` — apply/verify cleanup CLI with TOCTOU closure
- `mcp_server/lib/parsing/memory-parser.ts` — admissibility check using SSOT

### Test files (focused regressions)
- `tests/pe-orchestration.vitest.ts` (sibling-doc lineage)
- `tests/handler-memory-index.vitest.ts` (fromScan propagation + non-scan control)
- `tests/index-scope.vitest.ts` (predicate logic)
- `tests/full-spec-doc-indexing.vitest.ts`
- `tests/memory-save-index-scope.vitest.ts` (save-time invariant + tier downgrade)
- `tests/memory-crud-update-constitutional-guard.vitest.ts`
- `tests/checkpoint-restore-invariant-enforcement.vitest.ts`
- `tests/cleanup-script-audit-emission.vitest.ts`
- `tests/exclusion-ssot-unification.vitest.ts`
- `tests/symlink-realpath-hardening.vitest.ts`
- `stress_test/code-graph/walker-dos-caps.vitest.ts`
- `tests/memory-governance.vitest.ts`
- `tests/memory-parser-extended.vitest.ts`
- `tests/gate-d-regression-constitutional-memory.vitest.ts`

### ADRs
- ADR-001: A2 PE post-filter chosen over A1 vector-search rewrite (preserves search surface)
- ADR-002: B2 fromScan flag chosen over B1 batch-size adjust (live evidence proved transactional recheck was the source)
- ADR-003: Delete z_future rather than downgrade (absolute invariant)
- ADR-004: Downgrade invalid constitutional to important (preserves valid saves)
- ADR-005: Constitutional README excluded (human-facing, not rule surface)
- ADR-006..ADR-012: Wave-1 SQL-layer enforcement, cleanup audit durability, SSOT unification, realpath, TOCTOU, governance audit helpers

### Live evidence (Track A acceptance)
- Before: E_LINEAGE=68, candidate_changed=58
- After A+B1: E_LINEAGE=0, candidate_changed=159 (B1 insufficient)
- After A+B2: focused regressions 26/26 PASS; live packet rerun PENDING

### Live evidence (Track B cleanup)
- Before: 5700 constitutional rows (only 2 in folder), 5947 z_future, 0 external, 5698 invalid constitutional, 2 duplicate gate-enforcement
- After: 2 constitutional (both in folder), 0 z_future, 0 external, 0 invalid, 1 gate-enforcement
- Cleanup --apply: deleted 254 memory rows, 5945 vector rows, idempotent on second apply
<!-- /ANCHOR:known-context -->

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | REQ-001..REQ-016 → runtime code |
| `checklist_evidence` | core | pending | - | CHK-* items → cited file:line evidence |
| `skill_agent` | overlay | notApplicable | - | No skill or agent under review |
| `agent_cross_runtime` | overlay | notApplicable | - | N/A |
| `feature_catalog_code` | overlay | pending | - | Check whether feature-catalog references new invariant surface |
| `playbook_capability` | overlay | pending | - | Check whether testing-playbook covers cleanup CLI scenarios |
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Scope discovery — populated from spec docs + Known Context]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|--------------------:|---------------:|---------:|--------|
| spec.md | - | - | - | pending |
| plan.md | - | - | - | pending |
| tasks.md | - | - | - | pending |
| checklist.md | - | - | - | pending |
| implementation-summary.md | - | - | - | pending |
| decision-record.md | - | - | - | pending |
| mcp_server/handlers/save/pe-orchestration.ts | - | - | - | pending |
| mcp_server/handlers/memory-save.ts | - | - | - | pending |
| mcp_server/handlers/memory-index.ts | - | - | - | pending |
| mcp_server/lib/utils/index-scope.ts | - | - | - | pending |
| mcp_server/lib/search/vector-index-mutations.ts | - | - | - | pending |
| mcp_server/lib/storage/checkpoints.ts | - | - | - | pending |
| mcp_server/lib/storage/post-insert-metadata.ts | - | - | - | pending |
| mcp_server/lib/governance/scope-governance.ts | - | - | - | pending |
| mcp_server/code-graph/lib/structural-indexer.ts | - | - | - | pending |
| scripts/memory/cleanup-index-scope-violations.ts | - | - | - | pending |
| tests/pe-orchestration.vitest.ts | - | - | - | pending |
| tests/handler-memory-index.vitest.ts | - | - | - | pending |
| tests/index-scope.vitest.ts | - | - | - | pending |
| tests/memory-save-index-scope.vitest.ts | - | - | - | pending |
| tests/memory-crud-update-constitutional-guard.vitest.ts | - | - | - | pending |
| tests/checkpoint-restore-invariant-enforcement.vitest.ts | - | - | - | pending |
| tests/symlink-realpath-hardening.vitest.ts | - | - | - | pending |
| stress_test/code-graph/walker-dos-caps.vitest.ts | - | - | - | pending |
| tests/cleanup-script-audit-emission.vitest.ts | - | - | - | pending |
| tests/exclusion-ssot-unification.vitest.ts | - | - | - | pending |
| tests/memory-governance.vitest.ts | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-28T13:57:00.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-04-28T13:57:00.000Z
- Executor: cli-codex / gpt-5.5 / reasoning=high / service-tier=fast / sandbox=workspace-write / timeout=900s
<!-- MACHINE-OWNED: END -->
