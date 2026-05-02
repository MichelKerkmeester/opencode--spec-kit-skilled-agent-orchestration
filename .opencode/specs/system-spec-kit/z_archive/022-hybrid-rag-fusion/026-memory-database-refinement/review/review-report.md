---
title: "Meta-Review Report: Memory Database Refinement (v2)"
description: "10-iteration meta-review of the 026 spec folder and all work done there. Reviewed fix quality, spec consistency, checklist evidence, security, and maintainability across 27 modified source files and 5 spec artifacts."
trigger_phrases:
  - "meta review report"
  - "026 review v2"
  - "memory database refinement review"
importance_tier: "critical"
contextType: "general"
---
# Meta-Review Report: Memory Database Refinement (v2)

10-iteration meta-review of spec folder `026-memory-database-refinement` and all work done there: the original 30-iteration audit, 121 findings, 4 fix sprints via 13 parallel GPT-5.4 agents, P2 triage, and documentation. Previous report preserved as `review-report-v1-original-audit.md`.

---

## 1. Executive Summary

**Verdict: CONDITIONAL**
hasAdvisories: true

| Severity | Count |
|----------|------:|
| **P0** | 1 |
| **P1** | 17 |
| **P2** | 11 |
| **Total** | **29** |

The original 121-finding audit and 80+ P0/P1 fix sprints represent substantial, well-organized work. However, this meta-review found **1 P0 blocker** (checkpoint restore can delete out-of-scope rows), **17 P1 issues** across code correctness, documentation drift, and spec inconsistency, and **11 P2 advisories**. The P0 blocks release readiness until addressed.

---

## 2. Planning Trigger

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 1, "P1": 17, "P2": 11 },
  "remediationWorkstreams": [
    "WS-1: Fix P0 checkpoint scope isolation",
    "WS-2: Fix 7 code correctness P1s",
    "WS-3: Fix 6 documentation/spec drift P1s",
    "WS-4: Fix 4 security/governance P1s"
  ],
  "specSeed": "Scope must include checkpoint restore, save pipeline lock, PE filtering, graph cache invalidation, and spec document reconciliation",
  "planSeed": "4 workstreams: 1 P0 immediate + 3 P1 clusters (code, docs, security)"
}
```

---

## 3. Active Finding Registry

### P0 Findings (Blockers)

#### F-001: Scoped checkpoint restore deletes out-of-scope rows
- **Severity:** P0
- **Dimension:** Security / Governance
- **File:** `lib/storage/checkpoints.ts:1563-1570`, `lib/storage/checkpoints.ts:861-863`
- **Evidence:** `getCurrentMemoryIdsForSpecFolder(database, checkpointSpecFolder)` ignores caller scope when `spec_folder` is present. Clear path deletes by `spec_folder` alone with no scope predicate.
- **Impact:** A tenant-scoped restore can erase or replace other tenants' data under the same spec folder. Data loss across governance boundaries.
- **Fix:** Keep restore targeting scope-first even when `spec_folder` is set. Use `getCurrentScopedMemoryIds()` and intersect `spec_folder` with tenant/user/agent/shared-space predicates.
- **Iterations:** 035, 036 (independent discovery, P0 in 036)

### P1 Findings (Required)

#### Correctness — Code

| ID | Title | File | Iter |
|----|-------|------|------|
| F-002 | Token-budget truncation can erase all matching results | `hybrid-search.ts:2136-2188` | 033 |
| F-003 | Atomic save promotes file before write lock acquired | `memory-save.ts:1210-1219` | 033 |
| F-004 | PE filtering recall-lossy after capped global search | `pe-gating.ts:79-96` | 033 |
| F-005 | Deferred chunk inserts lose anchor identity | `chunking-orchestrator.ts:316-327` | 033 |
| F-006 | Anchor extraction returns corrupted sections after malformed nesting | `memory-parser.ts:845-863` | 034 |
| F-007 | Graph-signal cache invalidation incomplete for direct causal_edges writers | `graph-signals.ts:24-57` | 034 |

#### Correctness — Documentation Drift

| ID | Title | File | Iter |
|----|-------|------|------|
| F-008 | Iteration count inconsistent across packet (spec says 20, actual 30) | `spec.md:126` | 032 |
| F-009 | Spec declares fixes out of scope but packet records fix execution | `spec.md:79` | 032 |
| F-010 | Phase 10 tasks [x] but checklist items unchecked | `tasks.md:241` | 032 |
| F-011 | "Full test suite green" claim while 1 file still fails | `checklist.md:68` | 032 |
| F-012 | Fallback threshold claim says "fractional" but code still uses percentage units | `implementation-summary.md:52` | 037 |
| F-013 | CHK-012 detailed tables show 82 findings, not 121 | `review-report.md:32-127` | 038 |
| F-014 | CHK-068 claims 8771 tests but tasks.md says 8748 | `checklist.md:68` vs `tasks.md:149` | 038 |

#### Security / Governance

| ID | Title | File | Iter |
|----|-------|------|------|
| F-015 | Shared-memory admin checks spoofable with caller-supplied actor IDs | `shared-memory.ts:143-212` | 035 |
| F-016 | Constitutional cache leaks results across database switches | `vector-index-store.ts:381-571` | 036 |

#### Maintainability

| ID | Title | File | Iter |
|----|-------|------|------|
| F-017 | Schema contracts defined in multiple places in vector-index-schema.ts | `vector-index-schema.ts:178-1989` | 039 |
| F-018 | Fallback policy duplicated in two orchestration paths | `hybrid-search.ts:1469-1603` | 039 |

### P2 Findings (Advisories)

| ID | Title | File | Iter |
|----|-------|------|------|
| F-019 | Embedding cache schema half-applied: dimension not in primary key | `embedding-cache.ts:37-133` | 033 |
| F-020 | Learning-history sessionId not normalized on read path | `session-learning.ts:661-783` | 034 |
| F-021 | Checkpoint scope accepts blank tenantId, weakening tenant guard | `checkpoints.ts:141-175` | 035 |
| F-022 | Failed DB rebind leaves consumers split between old and new handles | `db-state.ts:154-280` | 036 |
| F-023 | Savepoint-per-table attribution: handler vs lib mismatch in summary | `implementation-summary.md:46` | 037 |
| F-024 | Embedding dimension resolution attributed to wrong file | `implementation-summary.md:45` | 037 |
| F-025 | shared_memory_status auth claim only partially accurate | `implementation-summary.md:47` | 037 |
| F-026 | "upserts" overstates reconsolidation merge operations | `implementation-summary.md:48` | 037 |
| F-027 | CHK-067 reconciliation count (24 failures) not fully enumerated | `checklist.md` vs `tasks.md` | 038 |
| F-028 | Lineage-resolution boilerplate repeated across read helpers | `lineage-state.ts:801-980` | 039 |
| F-029 | Rollback-cleanup failures hidden behind catch-all handling | `memory-save.ts:275-380` | 039 |

---

## 4. Remediation Workstreams

### WS-1: P0 Immediate — Checkpoint Scope Isolation
- F-001: Make restore targeting scope-first, not folder-first
- Estimated: 1 file (`checkpoints.ts`), ~30 LOC change + tests

### WS-2: Code Correctness P1s (6 findings)
- F-002: Token-budget truncation fallback for empty results
- F-003: Acquire lock before file promotion in atomic save
- F-004: Push governance scope into vector query for PE filtering
- F-005: Pass anchorId to indexMemoryDeferred for chunks
- F-006: Gate anchor extraction on validation pass
- F-007: Centralize causal_edges writes behind invalidation hooks

### WS-3: Documentation/Spec Drift P1s (7 findings)
- F-008 through F-014: Update spec.md, implementation-summary.md, checklist.md, review-report-v1 to match actual state

### WS-4: Security/Governance P1s (2 findings)
- F-015: Resolve caller identity from server-owned auth context
- F-016: Key constitutional cache by database path, clear on DB switch

---

## 5. Spec Seed

- Spec scope must be updated to include the fix sprints (currently says "findings only")
- Iteration count should reflect actual 30 (not 20)
- Test count evidence should be reconciled across checklist and tasks
- Finding count in review report detailed tables should match summary (82 vs 121)
- Implementation summary claims need 5 corrections (F-012, F-023-F-026)

---

## 6. Plan Seed

1. **Fix P0 F-001** — Checkpoint restore scope isolation (~30 LOC + 3 tests)
2. **Fix code P1s F-002 through F-007** — 6 targeted fixes across 5 files (~150 LOC + tests)
3. **Reconcile documentation F-008 through F-014** — Update 4 spec artifacts to match reality
4. **Fix security P1s F-015, F-016** — Auth context binding + cache keying (~80 LOC + tests)
5. **Triage P2 advisories** — 11 items for fix/defer decision

---

## 7. Traceability Status

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 037 | 2/7 claims fully verified, 4 partially verified, 1 not verified (F-012) |
| `checklist_evidence` | core | partial | 038 | 3/6 items verified, 2 not verified (F-013, F-014), 1 verified with notes |
| `skill_agent` | overlay | notApplicable | - | No skill/agent contracts in scope |
| `agent_cross_runtime` | overlay | notApplicable | - | No cross-runtime agents in scope |
| `feature_catalog_code` | overlay | notApplicable | - | |
| `playbook_capability` | overlay | notApplicable | - | |

---

## 8. Deferred Items

- F-019 through F-029 (11 P2 advisories) are non-blocking but recommended for a follow-on cleanup pass
- The DB rebind split-brain issue (F-022) is low probability but architecturally concerning if multi-DB deployments are planned
- Lineage resolution boilerplate (F-028) and rollback error suppression (F-029) are maintainability items that increase future regression risk

---

## 9. Audit Appendix

### Convergence Summary
- Iterations: 10 (1 inventory + 3 correctness + 2 security + 2 traceability + 2 maintainability)
- Stop reason: max_iterations_reached
- Dimensions covered: 4 of 4 (correctness, security, traceability, maintainability)
- Agents used: 2 GPT-5.4 (codex exec), 7 Claude Sonnet, 1 orchestrator

### Coverage Summary
| Dimension | Iterations | Files Reviewed | Findings |
|-----------|-----------|----------------|----------|
| Correctness | 3 (032-034) | 19 | P0=0, P1=10, P2=2 |
| Security | 2 (035-036) | 11 | P0=1, P1=3, P2=3 |
| Traceability | 2 (037-038) | 12 | P0=0, P1=3, P2=5 |
| Maintainability | 2 (039-040) | 8+ | P0=0, P1=2, P2=2 |

### Cross-Reference Appendix

#### Core Protocols
- **spec_code**: Implementation summary claims vs actual code. 7 claims checked; 2 fully verified (SHA-256 prefix, per-path traversal), 4 partially verified (file attribution imprecise), 1 not verified (threshold units).
- **checklist_evidence**: 6 key items checked; 3 verified, 2 have evidence mismatches (finding count, test count), 1 has scope notes.

#### Overlay Protocols
- Not applicable for this review target (no skill/agent/catalog/playbook contracts in scope).

### Sources Reviewed
- 5 spec artifacts (952 LOC)
- 30 prior iteration files
- 1 prior review report (209 LOC)
- 27 MCP server source files (21,743 LOC)
- 14 scratch work files
- 4 memory files

### Iteration Artifacts
Iterations 031-040 in `review/iterations/`.
Prior review (v1) iterations 001-030 also in `review/iterations/`.
Original report backed up as `review/review-report-v1-original-audit.md`.
