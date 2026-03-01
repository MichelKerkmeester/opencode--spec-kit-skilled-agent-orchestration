---
title: "Implementation Plan: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/plan.md]"
description: "This plan executes audit-first hardening across retrieval, ranking, session/state integrity, telemetry governance, and self-healing operations with explicit traceability to expanded requirements."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "hybrid rag fusion"
  - "cross-system hardening"
  - "automation interconnection"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js), Markdown spec tooling |
| **Framework** | system-spec-kit MCP server + command scripts |
| **Storage** | SQLite + markdown-based spec and memory artifacts |
| **Testing** | Vitest, script-level functional tests, spec validation scripts |

### Overview
This plan now covers all risk-bearing systems discovered in research, not only retrieval/fusion internals. Delivery runs in five phases: cross-system audit, ranking/channel hardening, state-integrity hardening, telemetry/operations governance, and verification/sign-off closure. The plan preserves architecture decisions from `002` and converts fragile seams from `003`, `004`, and `005` into measured controls and release gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented for ten subsystems
- [x] Success criteria and thresholds measurable
- [x] Dependencies identified with continuity from `002` to `005`
- [x] Requirement -> phase -> task traceability map established

### Definition of Done
- [x] All P0 acceptance criteria met
- [x] P1 items complete or explicitly deferred with approval
- [x] Regression, recovery, and telemetry gates passing
- [x] Latency/reliability budgets verified
- [x] Governance docs synchronized (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-first, contract-driven hardening with release-gated invariants and self-healing operations.

### Key Components
- **Cross-System Audit Orchestrator**: maps subsystem contracts, captures baselines, and ranks seam risks.
- **Ranking and Contract Guardrails**: retrieval/fusion determinism, graph relation contract checks, and cognitive modifier bounds.
- **Session/State Integrity Layer**: session manager quality controls, session-learning hygiene, CRUD re-embedding consistency, parser/index invariants, and storage recovery checks.
- **Telemetry Governance Layer**: trace schema registry, payload validation, and docs drift enforcement.
- **Prevention and Operations Layer**: deferred/skipped-path test hardening and self-healing runbooks.

### Data Flow
1. Capture baseline metrics and continuity constraints for all ten subsystem areas.
2. Apply ranking/channel hardening (fusion, graph, cognitive) with deterministic contracts.
3. Apply session/state-integrity controls (routing quality, learning hygiene, CRUD re-embed, parser/index health, storage recovery).
4. Govern diagnostics through telemetry schema validation and docs drift checks.
5. Run prevention, recovery, and operational self-heal drills before sign-off.
<!-- /ANCHOR:architecture -->

---

## 3.5 CARRY-FORWARD IMPLEMENTATION NOTES (002/003/004/005)

| Prior Spec | Carry-Forward Asset | 006 Usage |
|------------|---------------------|-----------|
| `002-hybrid-rag-fusion` | Tri-hybrid retrieval + MMR/TRM pipeline | Baseline for retrieval/fusion determinism and channel governance |
| `003-index-tier-anomalies` | Canonical path dedup + tier precedence | Elevated to parser/index + storage integrity gates |
| `004-frontmatter-indexing` | Frontmatter normalization + idempotent reindex | Enforced as parser/index invariant and metadata consistency precondition |
| `005-auto-detected-session-bug` | Confidence-aware folder/session detection | Extended into session manager and session-learning quality/performance controls |

| Expanded Area | Primary Continuity Source | Implementation Note |
|---------------|---------------------------|---------------------|
| Graph/causal relation scoring | `002` | Contract tests and relation score calibration are now mandatory release-gated checks |
| Cognitive decay + FSRS ranking | `002` + `005` | Confidence/ranking alignment requires bounded cognitive weighting and ablation checks |
| CRUD re-embed consistency | `003` + `004` | Canonical metadata and index consistency now include mutation-to-embedding SLA controls |
| Storage recovery + mutation ledger | `003` | Index integrity now extends to transactional recovery parity and replay consistency |
| Telemetry/docs drift governance | `004` + `005` | Diagnostic schema changes require matching docs updates and gate validation |

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Cross-System Audit and Continuity Lock
- [x] Build subsystem contract map for all ten scoped areas.
- [x] Capture baseline fixtures, latency/reliability metrics, and deferred/skipped-path inventory.
- [x] Produce risk register and continuity mapping from `002/003/004/005` to 006 controls.
- [x] Lock decision gates `T025`/`T026`/`T027` (relation corpus policy, cognitive-weight scope, self-healing auto-remediation policy) before Phase 2 execution.

### Phase 2: Ranking and Channel Contract Hardening
- [x] Harden retrieval/fusion determinism, graph relation scoring contracts, and cognitive ranking bounds.
- [x] Align low-confidence policy across retrieval and session routing behavior.
- [x] Emit ranked-channel diagnostics and confidence rationale in debug metadata.

### Phase 3: Session and State Integrity Hardening
- [x] Improve session manager/session-learning quality and performance.
- [x] Enforce CRUD re-embedding consistency SLAs.
- [x] Enforce parser/index invariants and index-health automation.
- [x] Add storage recovery and mutation-ledger parity checks.

### Phase 4: Telemetry Governance and Operational Automation
- [x] Implement trace schema registry and validation gates.
- [x] Add docs drift prevention checks tied to telemetry and runbook contracts.
- [x] Build self-healing checks and operational runbooks for known failure classes.

### Phase 5: Verification Hardening and Governance Closure
- [x] Convert deferred/skipped-path tests into active coverage or approved deferrals.
- [x] Run full performance/reliability/recovery verification suite.
- [x] Finalize evidence, ADR updates, checklist closure, and sign-offs.

### Requirement-to-Phase Mapping

| Requirement IDs | Phase |
|-----------------|-------|
| REQ-001, REQ-015 | Phase 1 |
| REQ-002, REQ-003, REQ-004, REQ-014 | Phase 2 |
| REQ-005, REQ-006, REQ-007, REQ-008 | Phase 3 |
| REQ-009, REQ-011, REQ-017 | Phase 4 |
| REQ-010, REQ-012, REQ-013, REQ-016, REQ-018 | Phase 5 |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | fusion bounds, relation scoring, cognitive weighting, session confidence math | Vitest |
| Integration | retrieval + session + CRUD + parser/index + telemetry contracts | Vitest + script harness |
| Regression | known failures and deferred/skipped paths from `002`/`003`/`004`/`005` | functional suites + fixture replay |
| Recovery | transaction interruption, ledger replay, index repair | script harness + deterministic replay fixtures |
| Performance | retrieval/session latency budgets, automation overhead, health loop runtime | benchmark scripts + CI metrics |
| Operational | runbook drills for index drift, session ambiguity, ledger mismatch, telemetry drift | command-line runbooks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Baseline fixtures for retrieval/session/storage/telemetry paths | Internal | Green | Hardening cannot be validated against real behavior |
| Parser/index normalization guarantees from `003` and `004` | Internal | Green | State-integrity controls can produce false positives |
| Session confidence hooks from `005` | Internal | Green | Routing/retrieval policy alignment is incomplete |
| Mutation ledger + transaction recovery hooks | Internal | Yellow | Storage reliability criteria cannot be proven |
| CI support for schema-gate and self-healing verification | Internal | Yellow | Prevention controls cannot be release-enforced |

Status criteria:
- `Green`: validated in the current branch with passing evidence available.
- `Yellow`: dependency is identified, but one or more validation artifacts are still pending.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sustained latency regression, elevated session misroute rate, re-embedding backlog growth, recovery replay mismatch, or telemetry-schema gate failures.
- **Procedure**: roll back by phase in reverse critical-path order while preserving audit baselines and replay fixtures; restore previous thresholds/contracts; rerun critical regression + recovery suites before reattempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit + Continuity)
  ├──► Phase 2 (Ranking/Channel Hardening)
  └──► Phase 3 (Session/State Integrity)

Phase 2 outputs ─┐
                 ├──► Phase 4 (Telemetry/Ops Governance)
Phase 3 outputs ─┘
                          └──► Phase 5 (Verification + Sign-off)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 Audit | Prior-spec continuity mapping | Phases 2, 3, 4, 5 |
| Phase 2 Ranking/Channel | Phase 1 baselines | Phases 4, 5 |
| Phase 3 Session/State | Phase 1 baselines + Phase 2 confidence contracts | Phases 4, 5 |
| Phase 4 Telemetry/Ops | Phases 2 and 3 outputs | Phase 5 |
| Phase 5 Verification | Phases 2, 3, 4 complete | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Cross-System Audit | High | 1.5-2.5 days |
| Phase 2: Ranking/Channel Hardening | High | 2-3 days |
| Phase 3: Session/State Integrity | High | 2-3 days |
| Phase 4: Telemetry/Ops Governance | High | 1.5-2.5 days |
| Phase 5: Verification/Closure | Medium-High | 1-2 days |
| **Total** | | **8-13 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline audit fixtures archived for retrieval, session, and storage paths
- [x] Threshold and contract deltas documented with before/after metrics
- [x] Recovery replay artifacts captured and verifiable
- [x] Emergency gate override protocol documented with approver list

### Rollback Procedure
1. Disable newly introduced gates only when verified false positives are documented.
2. Revert phase-specific changes in reverse order (Phase 5 -> Phase 2).
3. Restore prior stable thresholds/contracts from archived baseline artifacts.
4. Re-run deterministic regression, recovery replay, and telemetry schema checks.
5. Record incident details and decision-record updates before redeployment.

### Data Reversal
- **Has data migrations?** No direct schema migrations expected
- **Reversal procedure**: restore previous index snapshots and mutation-ledger checkpoint, then replay validated transaction set to confirm parity
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────────────┐
│ A: Cross-System Baselines  │
└──────────────┬─────────────┘
               │
      ┌────────▼─────────┐
      │ B: Ranking Guard │
      │ (fusion/graph/cog)
      └───────┬──────────┘
              │
      ┌───────▼──────────┐
      │ C: Session/State │
      │ Integrity Layer  │
      └───────┬──────────┘
              │
      ┌───────▼──────────┐
      │ D: Telemetry/Ops │
      │ Governance Layer │
      └───────┬──────────┘
              │
      ┌───────▼──────────┐
      │ E: Verification  │
      │ and Sign-off     │
      └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| A Baselines | Prior-spec continuity mapping | Contract map + fixture corpus + risk register | B, C, D, E |
| B Ranking Guard | A | Deterministic fusion/graph/cognitive behavior | C, D, E |
| C Session/State | A + B | Session quality controls + CRUD/index/storage invariants | D, E |
| D Telemetry/Ops | B + C | Schema-gated diagnostics + self-healing runbooks | E |
| E Verification | B + C + D | Release-gate evidence and approvals | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Cross-system baselines and continuity lock complete** - 1.5 days - CRITICAL
2. **Ranking/channel hardening stabilized** - 2 days - CRITICAL
3. **Session/state integrity controls validated** - 2 days - CRITICAL
4. **Telemetry/ops governance checks operational** - 1.5 days - CRITICAL
5. **Verification/recovery/sign-off closure** - 1 day - CRITICAL

**Total Critical Path**: ~8 days

**Parallel Opportunities**:
- Telemetry schema authoring can start during Phase 3 once diagnostic contracts stabilize.
- Runbook drafting can proceed in parallel with verification fixture expansion.
- Documentation evidence updates can run concurrently with Phase 5 gate execution.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines Locked | Ten-subsystem audit and continuity matrix approved | End Phase 1 |
| M2 | Ranking Contracts Hardened | Fusion/graph/cognitive suites pass deterministic and quality bounds | End Phase 2 |
| M3 | State Integrity Hardened | Session/CRUD/index/storage gates pass with required thresholds | End Phase 3 |
| M4 | Governance and Ops Ready | Telemetry schema/docs drift checks and runbooks validated | End Phase 4 |
| M5 | Release Ready | Full verification evidence and sign-offs complete | End Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Broad cross-system hardening over retrieval-only tuning

**Status**: Accepted

**Context**: Research identified high-risk seams outside retrieval/fusion. Limiting work to ranking internals would leave unresolved state-integrity and operational failure modes.

**Decision**: Execute full ten-subsystem hardening with explicit requirement mapping and release gates.

**Consequences**:
- Positive: failure prevention is systemic rather than local.
- Negative: implementation complexity and verification scope increase.

**Alternatives Rejected**:
- Retrieval/fusion-only plan: rejected because it does not cover discovered systemic risks.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md` sections 1-5 + continuity and traceability mappings
**Duration**: one focused pass
**Agent**: Primary

### Tier 2: Controlled Parallel Preparation
| Agent | Focus | Files |
|-------|-------|-------|
| Primary (single-owner) | Plan + tasks synchronization | `plan.md`, `tasks.md` |
| Primary (single-owner) | Checklist + governance synchronization | `checklist.md`, `decision-record.md`, `implementation-summary.md` |

**Execution Rule**: Workflow runs in one LEAF execution context; no nested dispatch is used.

### Tier 3: Integration
**Agent**: Primary
**Task**: Validate requirement-to-task mapping, sign-off consistency, and gate readiness across all docs
**Duration**: final verification pass
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Ranking Contracts | Retrieval Maintainer | search/scoring modules + tests | Planned |
| W-B | Session and State Integrity | Platform Maintainer | session, CRUD, parser/index, storage modules + tests | Planned |
| W-C | Governance and Operations | QA + Operations | telemetry schema, runbooks, checklist, ADRs | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | M1 complete | W-A, W-B, W-C | Approved baselines and locked contract map |
| SYNC-002 | M2 complete | W-A, W-B | Confidence and ranking contract freeze |
| SYNC-003 | M3 complete | W-B, W-C | State-integrity and recovery evidence packet |
| SYNC-004 | M4 complete | W-A, W-B, W-C | Release-gate readiness packet |

### File Ownership Rules
- Each implementation file has one primary owner and one reviewer.
- Cross-workstream edits require sync checkpoint evidence.
- Unplanned scope additions require explicit deferral entry and approval.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: status updates in `tasks.md` and blockers in `checklist.md`.
- **Per Phase**: milestone review with continuity and risk register updates.
- **Operational Drill**: runbook simulation summary at end of Phase 4.
- **Blockers**: immediate escalation with command-level evidence.

### Escalation Path
1. Technical blocker -> Engineering Lead
2. Verification failure -> QA Lead
3. Operational readiness blocker -> Operations Lead
4. Scope or timeline risk -> Product Owner
<!-- /ANCHOR:communication -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target files, tests, and subsystem focus for active phase.
- Confirm continuity constraints from `002/003/004/005` remain valid.
- Confirm no schema migration and no out-of-scope refactor.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Edit only planned files for the current phase. |
| Verification | Run mapped tests/checks before claiming completion. |
| Evidence | Record concrete command/file evidence for completed P0/P1 items. |

### Status Reporting Format
- `STATE`: current checkpoint.
- `ACTIONS`: files edited and commands executed.
- `RESULT`: pass/fail plus next action.

### Blocked Task Protocol
1. Stop edits for the blocked area and capture error evidence.
2. Attempt one bounded workaround that does not expand scope.
3. Escalate with impact and options if unresolved.

---

<!--
LEVEL 3+ PLAN
Audit-first cross-system hardening with governance and prevention controls.
-->
