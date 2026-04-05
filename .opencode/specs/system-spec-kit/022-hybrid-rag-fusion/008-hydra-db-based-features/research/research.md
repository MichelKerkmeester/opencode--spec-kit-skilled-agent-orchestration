---
title: "Research: Hydra DB Features Assessment [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/research]"
description: "Deep research audit of the Hydra DB features delivered during 008-hydra-db-based-features spec folder. The goal is to determine whether these features need refinement, upgrade, ..."
trigger_phrases:
  - "research"
  - "hydra"
  - "features"
  - "assessment"
  - "008"
importance_tier: "normal"
contextType: "research"
---
# Research: Hydra DB Features Assessment

## 1. Executive Summary

Deep research audit of the Hydra DB features delivered during 008-hydra-db-based-features spec folder. The goal is to determine whether these features need refinement, upgrade, or bugfix. The Hydra roadmap delivered 6 phases covering baseline safety, versioned memory state, unified graph retrieval, adaptive retrieval, scope governance, and shared memory rollout.

**Key finding after iterations 1-2**: The Hydra runtime has **systemic transaction boundary gaps**, **critical delete cleanup omissions**, and **notable test gaps** across its core modules. While the 7790-test suite passes, it masks latent issues in data integrity (orphaned lineage/projection rows), concurrent access (race conditions in conflict escalation and memory upserts), feature disable propagation, and embedding lifecycle management. The integration layer between modules is the weakest point — most bugs exist at module seams, not within individual modules.

---

## 2. Bug Findings (Severity-Ordered)

### Critical Bugs (Correctness Impact)

| # | Module | Bug | Impact | Source |
|---|--------|-----|--------|--------|
| B1 | shared-spaces.ts | Env `false` doesn't override persisted DB `true` for shared memory disable | Feature cannot be turned off via env var after DB enable — contradicts Tier 1 override contract | shared-spaces.ts:170-180 |
| B2 | shared-spaces.ts | `getAllowedSharedSpaceIds` bypasses global shared-memory disable | Retrieval pipeline and retention sweeps use shared-space allowlists even when feature is globally disabled | shared-spaces.ts:423; stage1-candidate-gen.ts:510; retention.ts:41 |
| B3 | lineage-state.ts | `backfillLineageState` dry-run counts diverge from actual execution | Dry-run uses different timestamp source and different conflict behavior than actual writes; reports misleading seeded/skipped counts | lineage-state.ts:909-928 vs 942-991 |
| B4 | capability-flags.ts | Invalid canonical phase suppresses valid legacy fallback | When `SPECKIT_MEMORY_ROADMAP_PHASE` is invalid but `SPECKIT_HYDRA_PHASE` is valid, falls back to `shared-rollout` instead of honoring legacy | capability-flags.ts:98-102 |

### Moderate Bugs (Data Integrity)

| # | Module | Bug | Impact | Source |
|---|--------|-----|--------|--------|
| B5 | shared-spaces.ts | Conflict escalation is race-prone | Two concurrent writers can both see `priorConflictCount = 0` and choose `append_version`, defeating escalation to `manual_merge` | shared-spaces.ts:127, 560 |
| B6 | lineage-state.ts | `recordLineageVersion` mock path returns wrong rootMemoryId | Mock returns `predecessorMemoryId` as root when a predecessor exists; should be predecessor's root | lineage-state.ts:1071-1080 |
| B7 | lineage-state.ts | `summarizeLineageInspection` produces false-positive gap warnings | After backfill, predecessor IDs may not match sorted order; gap detection incorrectly flags valid chains | lineage-state.ts:668-676 |
| B8 | scope-governance.ts | `validateGovernedIngest` normalizes empty strings for required fields | Empty string `tenantId` creates truthy/falsy confusion downstream; `Required<Pick>` type hides emptiness | scope-governance.ts:224-241, 277-301 |

---

## 3. Architecture Concerns

### Missing Transaction Boundaries

| # | Module | Issue | Impact | Source |
|---|--------|-------|--------|--------|
| A1 | lineage-state.ts | `recordLineageTransition` performs 4 related writes without transaction | Crash between writes leaves lineage in inconsistent state; direct callers (pe-gating.ts, create-record.ts) are unprotected | lineage-state.ts:465-557 |
| A2 | shared-spaces.ts | Conflict write + governance audit not atomic | Failure between conflict INSERT and audit INSERT leaves inconsistent state | shared-spaces.ts:560, 574 |

### Design Issues

| # | Module | Issue | Impact | Source |
|---|--------|-------|--------|--------|
| A3 | capability-flags.ts | Defaults snapshot rollout-sampled without identity | Telemetry and checkpoints report arbitrary hash-bucketed capability states instead of actual deployment defaults | capability-flags.ts:79 |
| A4 | shared-spaces.ts | Policy split across inconsistent entry points | `getAllowedSharedSpaceIds()` allows discovery without tenant guardrail; `assertSharedSpaceAccess()` denies without tenant — inconsistent security posture | shared-spaces.ts:423, 497 |
| A5 | shared-spaces.ts | No FK integrity on shared-space tables | Typos in `spaceId` create silent orphaned data in membership and conflict tables | vector-index-schema.ts:1134, 1146 |
| A6 | scope-governance.ts | `isDefaultOnFlagEnabled` defaults to `true` | Scope enforcement silently active by default; inconsistent with governed ingest trigger logic | scope-governance.ts:137-148 |
| A7 | handlers/shared-memory.ts | Duplicate interface definitions | `SharedSpaceUpsertArgs`, `SharedSpaceMembershipArgs`, `SharedMemoryStatusArgs` defined in both handler and tools/types.ts | handlers/shared-memory.ts:24,33,40; tools/types.ts:188,197,204 |

---

## 4. Dead Code

| # | Module | Issue | Source |
|---|--------|-------|--------|
| D1 | lineage-state.ts | Full `LineageMetadata` (7 fields) stored but only `.snapshot` ever read back | lineage-state.ts:237-247, 614, 734, 781 |
| D2 | capability-flags.ts | `isMemoryRoadmapCapabilityEnabled` exported but no runtime callers | capability-flags.ts:149 |
| D3 | capability-flags.ts | `CAPABILITY_ENV` only used by tests | capability-flags.ts:41 |

---

## 5. Refinement Opportunities

| # | Module | Opportunity | Source |
|---|--------|-------------|--------|
| R1 | lineage-state.ts | DRY violation: `seedLineageFromCurrentState` and `recordLineageTransition` share identical early-return logic | lineage-state.ts:401-411 vs 473-483 |
| R2 | lineage-state.ts | Two-step INSERT+UPDATE for anchor_id/content_hash could be single INSERT | lineage-state.ts:299-353 |
| R3 | lineage-state.ts | `::` separator in logical keys has no collision guard | lineage-state.ts:180-188 |
| R4 | scope-governance.ts | `reviewGovernanceAudit` fires 4 separate SQL queries; could use CTE/window functions | scope-governance.ts:467-526 |
| R5 | scope-governance.ts | `GovernanceDecision.normalized` type is an overly complex intersection | scope-governance.ts:44-45 |
| R6 | capability-flags.ts | `MemoryRoadmapPhase` type and `SUPPORTED_PHASES` duplicate source of truth | capability-flags.ts:10, 59 |
| R7 | shared-spaces.ts | `rolloutCohort` not normalized before persistence — whitespace creates different cohorts | shared-spaces.ts:227, 309, 393 |
| R8 | shared-spaces.ts | Conflict strategy should be a validated union, not open string | shared-spaces.ts:81, 117 |

---

## 6. Test Gaps

| # | Module | Gap | Source |
|---|--------|-----|--------|
| T1 | scope-governance.ts | No happy-path test for `validateGovernedIngest` | memory-governance.vitest.ts:21-33 |
| T2 | scope-governance.ts | No test for scope filter no-op predicate branch | scope-governance.ts:426-427 |
| T3 | lineage-state.ts | No boundary timestamp test for `resolveLineageAsOf` | memory-lineage-state.vitest.ts:107-116 |
| T4 | lineage-state.ts | No unit test for `createAppendOnlyMemoryRecord` rollback behavior | lineage-state.ts:565-578 |
| T5 | lineage-state.ts | Backfill idempotency test doesn't verify actual DB row state | memory-lineage-backfill.vitest.ts:146-148 |
| T6 | capability-flags.ts | No "invalid canonical phase + valid legacy phase" test | memory-roadmap-flags.vitest.ts:89, 99 |
| T7 | capability-flags.ts | No no-identity rollout test | memory-roadmap-flags.vitest.ts:76 |
| T8 | capability-flags.ts | Docs test misses canonical SPECKIT_MEMORY_* vars | feature-flag-reference-docs.vitest.ts:88 |
| T9 | shared-spaces.ts | No env=false precedence test against DB=true | shared-spaces.vitest.ts:575 |
| T10 | shared-spaces.ts | No disabled-feature bypass test for getAllowedSharedSpaceIds | shared-spaces.vitest.ts |
| T11 | shared-spaces.ts | No concurrency test for conflict escalation | shared-spaces.vitest.ts:292 |
| T12 | shared-spaces.ts | No negative test for nonexistent spaceId writes | shared-spaces.vitest.ts |

---

## 7. Cross-Cutting Themes

1. **Transaction boundaries are inconsistently applied**: lineage transitions, conflict recording, and audit writes are not wrapped in transactions. This is a systemic pattern, not isolated incidents.
2. **Feature disable propagation is incomplete**: `isSharedMemoryEnabled` is checked by `assertSharedSpaceAccess` but not by `getAllowedSharedSpaceIds`. Downstream callers (retrieval pipeline, retention sweeps) can bypass the global disable.
3. **Env var override semantics are inconsistent**: Some modules treat env vars as Tier 1 overrides but only check the `true` case, not `false`.
4. **Test suites focus on happy paths**: Despite 7790 tests and 53 Hydra-specific, edge cases like concurrent access, boundary timestamps, env=false overrides, and rollback behavior are largely untested.

---

## 8. Iteration 2: Integration Layer + Deep Module Findings

### New Critical Bugs (Iteration 2)

| # | Module | Bug | Impact | Source |
|---|--------|-----|--------|--------|
| B9 | vector-index-mutations.ts | Active projection writes best-effort — can desync from memory_index | Memories inserted but invisible to projection-joined queries (search misses) | vector-index-mutations.ts:210,286,294 |
| B10 | vector-index-mutations.ts | `delete_memory_from_database` doesn't clean lineage/projection/shared-space conflicts | Retention and manual deletes leave orphaned lineage rows; lineage validator flags these as integrity problems | vector-index-mutations.ts:448; vector-index-schema.ts:935,999,1146 |
| B11 | vector-index-mutations.ts | `update_memory` can create orphan `vec_memories` rows | UPDATE result ignored but vector delete/insert still runs; returns `id` regardless | vector-index-mutations.ts:403,408,426 |
| B12 | vector-index-mutations.ts | Deferred re-index stuck permanently — retry_count not reset | Setting `embedding_status='pending'` without resetting `retry_count` means retry queue filters it out forever | vector-index-mutations.ts:274; retry-manager.ts:154 |
| B13 | memory-save.ts | Governance metadata UPDATE after transaction commit | If UPDATE fails, memory exists without governance scope fields — violates governance contract | memory-save.ts (post-insert metadata path) |
| B14 | memory-save.ts | Double lineage recording — inside + outside transaction | `recordLineageTransition` in transaction, `recordLineageVersion` outside — lineage consistency gap | create-record.ts (save flow) |
| B15 | memory-save.ts | `atomicSaveMemory` retry can create orphan DB records | Attempt 1 inserts then fails; retry creates new records without cleaning up first set | memory-save.ts (retry loop) |

### New Architecture Concerns (Iteration 2)

| # | Module | Issue | Impact | Source |
|---|--------|-------|--------|--------|
| A8 | retention.ts | Sweep not atomic — delete/audit not atomic per memory | If delete succeeds but audit throws, memory gone with no audit trail. Mid-sweep failures leave partial results committed. | retention.ts:32-76; vector-index-mutations.ts:448-485 |
| A9 | vector-index-mutations.ts | Embedding state machine inconsistent (5 states, weak transitions) | `update_memory` marks `success` even when sqlite-vec unavailable; arbitrary status flips allowed | vector-index-mutations.ts:394,407,630,192 |
| A10 | vector-index-mutations.ts | Concurrency race for same logical memory (check-then-act) | Existence check outside serialized upsert; competing writers can duplicate logical records | vector-index-mutations.ts:161,194 |
| A11 | memory-save.ts | Three separate create-with-predecessor code paths | `createMemoryRecord`, `createAppendOnlyMemoryRecord`, `updateExistingMemory` have different transaction boundaries | create-record.ts, lineage-state.ts |
| A12 | memory-save.ts | Shared-space conflict detection runs after commit | Two concurrent saves both succeed; conflicts recorded post-hoc rather than prevented | memory-save.ts (save flow) |
| A13 | memory-save.ts | Governance audit asymmetric — denials logged, approvals only on success | No audit trail for approved-but-failed save attempts | memory-save.ts (save flow) |

### New Test Gaps (Iteration 2)

| # | Module | Gap | Source |
|---|--------|-----|--------|
| T13 | retention.ts | No test for mid-sweep delete failure or audit insert failure after delete | memory-governance.vitest.ts:201-312 |
| T14 | retention.ts | No test for lineage/projection/conflict cleanup after retention delete | memory-governance.vitest.ts |
| T15 | retention.ts | No test for retention behavior when shared-memory disabled | memory-governance.vitest.ts |
| T16 | memory-save.ts | No integration test for full handleMemorySave with governance + lineage + shared-space | (handler tests are export validation only) |

---

## 9. Modules Not Yet Audited

- adaptive-ranking modules — Phase 4 adaptive retrieval loops
- graph-roadmap modules — Phase 3 unified graph retrieval
- vector-index-schema.ts — migration paths and FK completeness
- Cross-cutting transaction/atomicity pattern analysis

---

## 10. Updated Verdict

| Category | Count | Severity |
|----------|-------|----------|
| **Bugs** | 15 | 8 critical, 7 moderate |
| **Architecture** | 13 | Systemic transaction/atomicity concerns |
| **Dead code** | 3 | Low priority |
| **Refinements** | 8 | Quality improvements |
| **Test gaps** | 16 | Missing integration and edge case coverage |
| **TOTAL** | **55** | |

**Recommendation**: The Hydra features need **bugfix** priority work:
1. **P0 — Delete cleanup**: Add lineage/projection/shared-space conflict cleanup to `delete_memory_from_database` (B10, B11)
2. **P0 — Feature disable propagation**: Fix `isSharedMemoryEnabled` bypass in `getAllowedSharedSpaceIds` (B2) and env=false override (B1)
3. **P0 — Deferred re-index stuck**: Reset retry_count when re-deferring (B12)
4. **P1 — Transaction wrapping**: Wrap retention sweep, lineage transitions, and governance metadata in proper transactions (A1, A2, A8, B13, B14)
5. **P1 — Projection desync**: Make active projection writes part of the indexing transaction (B9)
6. **P2 — Test expansion**: Add integration tests for the save flow and edge case tests for retention, mutations, and concurrency

No major architectural redesign needed — the system's modular design is sound, but module boundary integrity is weak.

---

## 11. Open Questions

- Are the transaction boundary gaps (A1, A2, A8) causing real-world data corruption, or is SQLite's single-writer model protecting against them in practice?
- Is the `isSharedMemoryEnabled` bypass (B2) exploitable in the retrieval pipeline, or do callers guard independently?
- How many orphaned lineage/projection rows exist in production databases? Can `validateLineageIntegrity` be used as a cleanup tool?
- Is the deferred re-index stuck bug (B12) actively causing search misses in production?
- Do the Phase 3 (graph) and Phase 4 (adaptive) modules have similar atomicity issues?

---

## 12. Convergence Report

*Updated progressively as iterations complete.*

| Iteration | Focus | Findings | newInfoRatio | Agents |
|-----------|-------|----------|-------------|--------|
| 1 | Runtime module audit (7 files) | 43 (8 bugs, 7 arch, 3 dead code, 8 refinements, 12 test gaps) | 0.90 | Opus + GPT-5.4 + Codex-5.3 |
| 2 | Handler integration + retention + vector mutations | 21 (7 bugs, 6 arch, 0 dead code, 0 refinements, 4 test gaps) | 0.80 | Opus + GPT-5.4 + Codex-5.3 |
