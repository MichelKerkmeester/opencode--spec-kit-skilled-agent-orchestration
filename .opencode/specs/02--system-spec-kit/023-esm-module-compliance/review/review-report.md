# Deep Review Report: ESM Module Compliance (spec-023)

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | true |
| **Active P0** | 0 |
| **Active P1** | 14 |
| **Active P2** | 4 |
| **Iterations** | 10 |
| **Stop Reason** | max_iterations_reached |
| **Dimensions Covered** | 7/7 (correctness, security, traceability, maintainability, performance, reliability, completeness) |
| **Agent Model** | GPT-5.4 via codex exec, reasoning: high |
| **Total Tokens** | ~1,956K across 10 iterations |

The 10-iteration deep review of the completed 5-phase ESM migration finds **no P0 blockers** but **14 active P1 findings** that cluster into five remediation families. The ESM migration itself is technically sound at the import-graph level, but trust-boundary gaps, runtime contract drift, packet documentation staleness, and incomplete verification evidence prevent a clean PASS.

---

## 2. Planning Trigger

`/spec_kit:plan` is **required** before this review can be promoted to PASS.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 14, "P2": 4 },
  "remediationWorkstreams": [
    "WS-1: Security — shared-memory trust boundary + scope governance (3 P1)",
    "WS-2: Runtime — ESM contract correctness + Node engine alignment (3 P1)",
    "WS-3: Traceability — packet truth-sync + child-packet closure (3 P1)",
    "WS-4: Completeness — verification evidence for CHK-005/CHK-006 (2 P1)",
    "WS-5: Reliability/Maintainability — warning flattening + import degradation contracts (2 P1 + 1 P2)"
  ],
  "specSeed": [
    "Truth-sync parent packet (spec.md, plan.md, tasks.md, checklist.md) to match implementation-summary.md",
    "Close Phase 4 child packet or document why it remains open",
    "Add whole-tree import hygiene proof for CHK-005 and emitted-artifact proof for CHK-006",
    "Remove stale phase-parent addendum from spec.md"
  ],
  "planSeed": [
    "Phase A: Fix ESM __dirname in mcp_server/scripts/ wrappers and align Node engine contracts",
    "Phase B: Harden shared-memory auth binding and scope-aware duplicate preflight",
    "Phase C: Truth-sync all parent packet docs and close Phase 4 child packet",
    "Phase D: Add verification evidence for open P0 checklist items",
    "Phase E: Re-run targeted D3/D7 closure review after remediation"
  ]
}
```

---

## 3. Active Finding Registry

### P1 Findings (14 active)

#### WS-1: Security — Shared-Memory Trust Boundary (3 P1)

| ID | Title | Dimension | File:Line | Iteration |
|----|-------|-----------|-----------|-----------|
| P1-SEC-01 | Shared-memory admin auth spoofable via caller-supplied actorUserId | Security | `mcp_server/handlers/shared-memory.ts:224,424,613,764` | 2 |
| P1-SEC-02 | V-rule bridge fails open — save continues without enforcement when module unavailable | Security | `mcp_server/handlers/v-rule-bridge.ts:49`; `memory-save.ts:186` | 2 |
| P1-SEC-03 | Path discovery cwd-steerable — launch directory redirects persistence outside workspace | Security | `shared/paths.ts:31,62` | 2 |

#### WS-2: Runtime — ESM Contract Correctness (3 P1)

| ID | Title | Dimension | File:Line | Iteration |
|----|-------|-----------|-----------|-----------|
| P1-COR-01 | mcp_server root export executes main() on import — side-effectful package entry | Correctness | `mcp_server/package.json:6`; `context-server.ts:1156` | 1 |
| P1-COR-02 | Node engine contract drift — ESM needs 20.11+ but workspace/scripts advertise Node 18 | Correctness | `shared/package.json:16`; `mcp_server/package.json:37`; root `package.json:11` | 1 |
| P1-COR-03 | mcp_server/scripts/ wrappers use __dirname — ReferenceError in ESM context | Correctness | `mcp_server/scripts/map-ground-truth-ids.ts:10`; `reindex-embeddings.ts:9` | 8 |

#### WS-3: Traceability — Packet Truth-Sync (3 P1)

| ID | Title | Dimension | File:Line | Iteration |
|----|-------|-----------|-----------|-----------|
| P1-TRC-01 | CHK-010 false positive — checklist claims sync but docs diverge from implementation | Traceability | `checklist.md:32`; `spec.md:49`; `tasks.md:37`; `impl-summary.md:23` | 3 |
| P1-TRC-02 | Closure trackers stale — plan/tasks/checklist all open while impl-summary says PASS | Traceability | `plan.md:43`; `tasks.md:47`; `checklist.md:55`; `impl-summary.md:84` | 3 |
| P1-TRC-03 | spec.md carries stale phase-parent addendum with future-phase placeholder | Traceability | `spec.md:213` | 3 |

#### WS-4: Completeness — Verification Evidence (3 P1)

| ID | Title | Dimension | File:Line | Iteration |
|----|-------|-----------|-----------|-----------|
| P1-CMP-01 | Phase 4 child packet still unfinished despite parent claiming completion | Completeness | `004-verification/plan.md:80`; `004-verification/tasks.md:47`; `004-verification/impl-summary.md:1` | 7 |
| P1-CMP-02 | CHK-005/CHK-006 genuinely unproven — ESM tests lack whole-tree import hygiene proof | Completeness | `checklist.md:55`; `modularization.vitest.ts:141`; `import-policy-rules.vitest.ts:6` | 7 |
| P1-CMP-03 | Preflight duplicate check ignores governed scope — cross-scope metadata leak | Security/Completeness | `mcp_server/lib/validation/preflight.ts:419-447` | 9 |

#### WS-5: Reliability/Maintainability (2 P1)

| ID | Title | Dimension | File:Line | Iteration |
|----|-------|-----------|-----------|-----------|
| P1-REL-01 | memory_save hides partial failures behind generic "anchor issues" warning | Reliability | `memory-save.ts:957,991`; `response-builder.ts:370` | 6 |
| P1-MNT-01 | workflow.ts uses 3 different dynamic-import degradation contracts for same API surface | Maintainability | `workflow.ts:214,1139,1633` | 4 |

### P2 Findings (4 active, advisory only)

| ID | Title | Dimension | File:Line | Iteration |
|----|-------|-----------|-----------|-----------|
| P2-COR-01 | shared/package.json root export points to embeddings.js instead of index.js | Correctness | `shared/package.json:6-10`; `shared/index.ts:4` | 1 |
| P2-MNT-02 | mcp-server/api barrel re-exports wide set of deep lib/ internals | Maintainability | `mcp_server/api/index.ts:4,60` | 4 |
| P2-PRF-01 | vector-index-store.ts pays per-call async import overhead on hot retrieval paths | Performance | `vector-index-store.ts:20,942` | 5 |
| P2-PRF-02 | cli.ts front-loads heavy DB/native imports before command dispatch | Performance | `mcp_server/cli.ts:15,364` | 5 |

---

## 4. Remediation Workstreams

### Priority Order

1. **WS-2: Runtime fixes** (P1-COR-01, P1-COR-02, P1-COR-03) — Fix the __dirname crash, align Node engine floors, and guard the package root entrypoint. These are the most directly actionable.

2. **WS-1: Security hardening** (P1-SEC-01, P1-SEC-02, P1-SEC-03, P1-CMP-03) — Bind shared-memory admin to trusted principal, fail closed on V-rule unavailability, scope-filter duplicate preflight, and validate path discovery boundaries.

3. **WS-3: Packet truth-sync** (P1-TRC-01, P1-TRC-02, P1-TRC-03) — Close or correct CHK-010, truth-sync plan/tasks/checklist to match shipped state, remove stale addendum from spec.md.

4. **WS-4: Verification closure** (P1-CMP-01, P1-CMP-02) — Close Phase 4 child packet, add whole-tree import hygiene proof for CHK-005/CHK-006.

5. **WS-5: Reliability/Maintainability** (P1-REL-01, P1-MNT-01) — Fix warning flattening in response builder, consolidate dynamic-import degradation patterns in workflow.ts.

### P2 Advisories (deferred)

P2 items are advisory and do not block promotion to PASS. Address during normal maintenance or next feature iteration.

---

## 5. Spec Seed

- Truth-sync parent packet (spec.md, plan.md, tasks.md, checklist.md) to match implementation-summary.md shipped state
- Close Phase 4 child packet verification matrix or document why it remains open
- Add whole-tree ESM import hygiene proof for CHK-005 and emitted-artifact correctness proof for CHK-006
- Remove stale phase-parent addendum and future-phase placeholder from spec.md
- Update checklist summary counts after truth-sync
- Align Node engine `engines` fields across workspace root, scripts, shared, and mcp_server packages

---

## 6. Plan Seed

| Phase | Focus | P1s Addressed | Estimated Effort |
|-------|-------|---------------|------------------|
| A | Fix ESM __dirname in mcp_server/scripts/ + align Node engine contracts | P1-COR-02, P1-COR-03 | Low (1-2h) |
| B | Guard package root entrypoint against side-effectful import | P1-COR-01 | Low (1h) |
| C | Harden shared-memory auth + scope-aware preflight + V-rule fail-closed | P1-SEC-01, P1-SEC-02, P1-SEC-03, P1-CMP-03 | Medium (3-5h) |
| D | Truth-sync parent packet docs + close Phase 4 child | P1-TRC-01, P1-TRC-02, P1-TRC-03, P1-CMP-01 | Medium (2-3h) |
| E | Add verification evidence for CHK-005/CHK-006 | P1-CMP-02 | Medium (2-3h) |
| F | Fix warning flattening + consolidate import degradation contracts | P1-REL-01, P1-MNT-01 | Low (1-2h) |
| G | Re-run targeted D3/D7 closure review | — | Low (1h) |

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Notes |
|----------|--------|----------|-------|
| `spec_code` | **findings** | Iterations 3, 7, 10 | Parent packet claims shipped completion but plan/tasks/checklist remain open; Phase 4 child packet unfinished |
| `checklist_evidence` | **findings** | Iterations 3, 7, 10 | CHK-010 is false positive; CHK-005, CHK-006, CHK-008 lack reviewed proof; CHK-015 looks closeable |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `skill_agent` | notApplicable | No skill/agent boundary in spec-023 scope |
| `agent_cross_runtime` | notApplicable | No agent definitions in scope |
| `feature_catalog_code` | notApplicable | No feature catalog in scope |
| `playbook_capability` | notApplicable | No playbook in scope |

---

## 8. Deferred Items

- **P2-COR-01**: shared/package.json root export mismatch — cosmetic, does not break consumers today
- **P2-MNT-02**: API barrel breadth — maintainability concern for future changes, not a current defect
- **P2-PRF-01/02**: Startup and hot-path overhead — advisory, no measured regression, optimize when profiling data is available
- **JSONL state continuity**: Iterations 7-9 missing from JSONL (recovered from markdown by iteration 10) — review bookkeeping gap, not a finding

---

## 9. Audit Appendix

### Convergence Summary

| Iteration | Dimension | New P0 | New P1 | New P2 | Ratio | Status |
|-----------|-----------|--------|--------|--------|-------|--------|
| 1 | D1 Correctness | 0 | 2 | 1 | 1.00 | complete |
| 2 | D2 Security | 0 | 3 | 0 | 1.00 | complete |
| 3 | D3 Traceability | 0 | 3 | 0 | 1.00 | complete |
| 4 | D4 Maintainability | 0 | 1 | 1 | 1.00 | complete |
| 5 | D5 Performance | 0 | 0 | 2 | 0.20 | complete |
| 6 | D6 Reliability | 0 | 1 | 0 | 1.00 | complete |
| 7 | D7 Completeness | 0 | 2 | 0 | 0.55 | complete |
| 8 | D1 Correctness (deep) | 0 | 1 | 0 | 1.00 | complete |
| 9 | D2+D6 Cross-ref | 0 | 1 | 0 | 0.45 | complete |
| 10 | Final synthesis | 0 | 0 | 0 | 0.00 | complete |

### Coverage Summary

| Dimension | Iterations | Verdict | Key Finding Areas |
|-----------|-----------|---------|-------------------|
| D1 Correctness | 1, 8 | findings | Package root side effects, Node engine drift, __dirname in ESM wrappers |
| D2 Security | 2, 9 | findings | Admin auth spoofing, fail-open V-rule, cwd-steerable paths, unscoped preflight |
| D3 Traceability | 3 | findings | CHK-010 false positive, packet closure drift, stale addenda |
| D4 Maintainability | 4 | findings | Fragmented import degradation contracts, wide API barrel |
| D5 Performance | 5 | clean (P2 only) | Advisory hot-path overhead, CLI startup cost |
| D6 Reliability | 6 | findings | Warning flattening hides partial failures |
| D7 Completeness | 7 | findings | Phase 4 child open, CHK-005/CHK-006 unproven |

### Core Protocol Cross-References

| Protocol | Source | Target | Status | Finding |
|----------|--------|--------|--------|---------|
| spec_code | spec.md REQ-001-008 | Implementation | findings | REQ-003, REQ-004, REQ-008 failed in reviewed evidence |
| checklist_evidence | checklist.md [x] items | Cited evidence | findings | CHK-010 false positive, 5 P0 items lack proof |

### Overlay Protocol Cross-References

All overlay protocols marked `notApplicable` — no skill/agent/catalog/playbook boundaries within spec-023 scope.

### Sources Reviewed

**Spec artifacts**: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, 5 phase sub-folders
**Implementation**: 230 files across shared/, mcp_server/, scripts/ (spot-checked ~40 key files)
**Tests**: modularization.vitest.ts, import-policy-rules.vitest.ts, tool-input-schema.vitest.ts
**Git history**: 18 commits on branch `system-speckit/023-esm-module-compliance`
