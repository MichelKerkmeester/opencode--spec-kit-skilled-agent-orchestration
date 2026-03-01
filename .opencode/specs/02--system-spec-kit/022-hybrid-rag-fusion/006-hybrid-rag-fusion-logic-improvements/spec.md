---
title: "Feature Specification: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/spec.md]"
description: "This initiative broadens hybrid RAG hardening to all critical cross-system seams: retrieval/fusion, graph contracts, cognitive ranking, session-learning quality, memory CRUD re-embedding, parser/index invariants, storage reliability, telemetry governance, test hardening, and self-healing operations."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "hybrid rag"
  - "fusion logic improvements"
  - "cross-system hardening"
  - "automation interconnection"
  - "bug prevention"
importance_tier: "critical"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This initiative hardens the active Hybrid RAG stack across the full operational surface, not only retrieval/fusion internals. The delivery now spans ten integrated subsystems: retrieval/fusion, graph/causal contracts, cognitive ranking (attention-decay and FSRS), session manager and session-learning quality, memory CRUD re-embedding consistency, parser/indexing invariants with automated index health, storage reliability (transaction recovery and mutation ledger consistency), telemetry/trace schema governance with docs drift prevention, deferred/skipped-path test hardening, and self-healing automation runbooks.

The objective remains continuity-first: keep the architecture from `002` and convert high-risk seams identified through `003`, `004`, and `005` into measurable controls with release gates.

**Key Decisions**: retain SQLite-first tri-hybrid architecture; apply audit-first execution; extend hardening scope to all discovered risk-bearing subsystems; require traceable requirement -> phase -> task -> checklist mapping.

**Critical Dependencies**: stable MCP search/index contracts, regression harnesses from `002` through `005`, deterministic canonicalization behavior, mutation ledger integrity, and schema-governed telemetry events.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hybrid retrieval capabilities are active, but systemic risk remains at cross-module seams. Existing hardening is concentrated on fusion quality and confidence thresholds while other coupled systems still permit silent drift: graph relation scores can diverge from ranking expectations, cognitive decay signals may be inconsistently applied, session-learning can route stale context, memory CRUD can leave stale embeddings, parser/index invariants can degrade without automatic repair, transaction/mutation consistency can fail under interruption, telemetry schemas can drift from docs, deferred test paths can remain unverified, and operational checks can remain reactive instead of self-healing.

### Purpose
Deliver a broadened deep-audit and hardening pass that makes the complete retrieval-to-operations chain measurable, deterministic, and resilient so retrieval quality, context routing, data integrity, and run-time governance remain trustworthy under production pressure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
1. Retrieval/fusion pipeline hardening (parse -> index -> gather -> fusion -> fallback -> response metadata).
2. Graph/causal channel contracts and relation-scoring calibration.
3. Cognitive ranking integration: attention-decay and FSRS-aware score modulation.
4. Session manager and session-learning pipeline quality/performance upgrades.
5. Memory CRUD and metadata re-embedding consistency controls.
6. Parser/indexing invariants plus index-health automation checks.
7. Storage reliability: transaction recovery and mutation-ledger consistency.
8. Telemetry/trace schema governance and documentation drift prevention.
9. Test coverage hardening for deferred/skipped paths and prior-spec regressions.
10. Automation loops and operational runbooks for self-healing checks.

### Out of Scope
- Migration to external vector, graph, or search databases.
- Large schema redesign of the existing SQLite memory schema.
- UI changes or non-MCP client feature work.
- Broad refactors not tied to audit findings or required subsystem controls above.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Tighten retrieval/fusion orchestration, deterministic fallback, and metadata contracts. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts` | Modify | Enforce bounded channel weights and deterministic tie/merge policies. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/co-activation.ts` | Modify | Formalize graph-channel contract inputs/outputs and relation-score usage. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` | Modify | Recalibrate confidence thresholds and evidence-gap emissions from audited distributions. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/` | Modify | Integrate relation scoring, FSRS/attention decay modifiers, and normalization invariants. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/` | Modify | Improve session manager ranking, low-confidence behavior, and performance instrumentation. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session-learning/` | Modify | Harden learning-pipeline quality checks and stale-signal handling. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Harden debug diagnostics and ranking/routing rationale emission contracts used by hybrid retrieval decisions. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` | Modify | Enforce post-mutation embedding refresh workflow and metadata consistency guards. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Expand index invariant checks and auto-heal health probes. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Enforce parser invariants tied to canonicalization and frontmatter normalization continuity. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/sqlite-transaction-recovery.ts` | Modify | Add deterministic recovery path and replay checks for interrupted mutations. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` | Modify | Enforce append/replay consistency and integrity counters. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts` | Modify | Define and validate canonical trace payload schema. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts` | Modify | Add docs drift and contract-alignment checks for schema-governed diagnostics. |
| `.opencode/skill/system-spec-kit/scripts/ops/` | Modify | Add self-healing operational checks and runbook automation glue. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/` | Modify | Expand subsystem-specific regression and deferred/skipped-path coverage. |
<!-- /ANCHOR:scope -->

---

## 3.5 PRIOR-WORK CONTINUITY (002/003/004/005)

### Carry-Forward Assumptions
- **From `002-hybrid-rag-fusion`**: tri-hybrid retrieval (vector + FTS/BM25 + graph), MMR, and evidence-gap signaling remain architectural baseline.
- **From `003-index-tier-anomalies`**: canonical-path dedup and deterministic tier precedence remain mandatory invariants.
- **From `004-frontmatter-indexing`**: normalized frontmatter and idempotent reindex behavior remain required preconditions.
- **From `005-auto-detected-session-bug`**: confidence-aware session/folder detection and archive exclusion remain mandatory for workflow safety.

### Carry-Forward Expansion Matrix in `006`

| Prior Spec | Preserved Outcome | Expanded in 006 |
|------------|-------------------|-----------------|
| `002-hybrid-rag-fusion` | Tri-hybrid + fusion + evidence-gap baseline | Adds graph-contract scoring, cognitive decay integration, and telemetry-governed ranking diagnostics |
| `003-index-tier-anomalies` | Canonical path + tier invariants | Adds index-health automation, CRUD re-embed consistency, and ledger-backed integrity checks |
| `004-frontmatter-indexing` | Normalized metadata and idempotent reindex | Adds parser/index auto-heal checks, schema drift prevention, and re-embedding consistency gates |
| `005-auto-detected-session-bug` | Confidence-aware routing safeguards | Adds session-learning quality metrics, routing/retrieval confidence alignment, and operational runbook coverage |

### Carry-Forward Gaps Addressed in `006`
- Convert deferred operational controls into enforced release checks across all ten scoped subsystems.
- Add cross-system drift detection linking ranking quality, storage integrity, and telemetry/documentation consistency.
- Harden regression boundaries so canonicalization, session confidence, and mutation consistency issues cannot silently recur.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete deep audit across all ten scoped subsystems | Audit artifact enumerates each subsystem contract, top risks, owner, and mitigation with no uncovered subsystem. |
| REQ-002 | Retrieval/fusion pipeline remains deterministic and bounded | Regression fixtures show stable ranked outputs and deterministic fallback behavior across repeated runs. |
| REQ-003 | Graph/causal channel contracts and relation scoring are calibrated | Contract tests verify schema and score semantics; adjudicated relation fixture shows Kendall tau >= 0.75 against expected ordering. |
| REQ-004 | Cognitive/attention-decay and FSRS signals are integrated into ranking safely | Ablation tests show >= 8% NDCG@5 improvement on long-tail fixture with <= 3% regression on primary fixture and bounded cognitive weight contribution (5-25%). |
| REQ-005 | Session manager and session-learning quality/performance are hardened | Misroute rate <= 1% on ambiguity fixture and p95 session selection <= 250ms for 500 candidates. |
| REQ-006 | Memory CRUD mutations maintain re-embedding consistency | 100% create/update/delete mutations queue re-embed reconciliation within 5s and clear stale embedding backlog >15m to zero. |
| REQ-007 | Parser/indexing invariants and index health automation are enforced | CI fails when canonical path, tier precedence, or frontmatter invariants break; index health job reports pass/fail with actionable diagnostics. |
| REQ-008 | Storage reliability protects committed state under interruption | Transaction recovery replay yields RPO 0 for committed mutations and simulation replay SLA completes <= 120s on reference dataset. |
| REQ-009 | Telemetry/trace schema governance prevents drift | All emitted trace payloads validate against schema registry; documentation drift check fails on schema-doc mismatch. |
| REQ-010 | Deferred/skipped path coverage is hardened | All deferred/skipped test paths from `002`/`003`/`004`/`005` are converted to active tests or approved with explicit rationale and owner. |
| REQ-011 | Automation loops and operational runbooks support self-healing checks | Self-healing routines detect and remediate at least four known failure classes with simulated MTTR <= 10 minutes. |
| REQ-012 | Governance evidence is auditable and sign-off ready | Checklist, ADRs, and implementation summary include command-level evidence for each P0 requirement and sign-off state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Maintain latency and throughput budgets while adding controls | p95 `mode="auto" <= 120ms`, p95 `mode="deep" <= 180ms`, session-learning batch p95 <= 400ms, and net overhead <= 12% vs baseline corpus. |
| REQ-014 | Improve observability for ranking and routing decisions | Debug metadata includes per-channel contribution, cognitive modifier summary, relation score contribution, and session confidence rationale. |
| REQ-015 | Preserve continuity mapping from `002` to `005` across all artifacts | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` contain aligned continuity references. |
| REQ-016 | Approval/sign-off model is internally consistent | Same approver roles and status model appear in spec approval workflow and checklist sign-off sections. |
| REQ-017 | Operational drills validate recovery and runbook paths | At least one dry-run per runbook class (index drift, session ambiguity, ledger recovery, telemetry drift) is documented with outcomes. |
| REQ-018 | Deferred items are explicitly bounded | Any deferred P1 item includes owner, reason, impact, and re-entry condition in checklist and implementation summary. |
<!-- /ANCHOR:requirements -->

---

## 4.5 TRACEABILITY MATRIX (REQUIREMENTS -> PLAN PHASES -> TASKS)

| Requirement | Plan Phase | Task IDs |
|-------------|------------|----------|
| REQ-001 | Phase 1 | T001, T002, T003, T004 |
| REQ-002 | Phase 2 | T005, T008 |
| REQ-003 | Phase 1, Phase 2 | T025, T006 |
| REQ-004 | Phase 1, Phase 2 | T026, T007 |
| REQ-005 | Phase 3 | T009, T010 |
| REQ-006 | Phase 3 | T011 |
| REQ-007 | Phase 3 | T012 |
| REQ-008 | Phase 3 | T013, T014 |
| REQ-009 | Phase 4 | T015, T016 |
| REQ-010 | Phase 5 | T019 |
| REQ-011 | Phase 1, Phase 4 | T027, T017, T018 |
| REQ-012 | Phase 5 | T022, T023 |
| REQ-013 | Phase 5 | T020 |
| REQ-014 | Phase 2, Phase 4 | T008, T015 |
| REQ-015 | Phase 1, Phase 5 | T004, T022, T023 |
| REQ-016 | Phase 5 | T022, T023 |
| REQ-017 | Phase 4, Phase 5 | T017, T021 |
| REQ-018 | Phase 5 | T022, T023 |

## 4.6 SUBSYSTEM COVERAGE MAP

| Scoped Subsystem Area | Primary Requirement IDs | Primary Task IDs |
|-----------------------|-------------------------|------------------|
| Retrieval/fusion pipeline | REQ-002, REQ-013 | T005, T008, T020 |
| Graph/causal contracts + relation scoring | REQ-003 | T006 |
| Cognitive/attention-decay + FSRS ranking | REQ-004 | T007 |
| Session manager + session-learning quality/performance | REQ-005 | T009, T010 |
| Memory CRUD + metadata re-embedding consistency | REQ-006 | T011 |
| Parser/indexing invariants + index health automation | REQ-007 | T012, T014 |
| Storage reliability + mutation ledger consistency | REQ-008 | T013, T021 |
| Telemetry/trace schema governance + docs drift prevention | REQ-009 | T015, T016 |
| Deferred/skipped-path test hardening | REQ-010 | T019 |
| Automation loops + operational self-healing runbooks | REQ-011, REQ-017 | T017, T018, T021 |

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Audit artifacts fully cover all ten scoped subsystems with risk/owner/remediation mapping.
- **SC-002**: Retrieval/fusion outputs remain deterministic with bounded confidence behavior.
- **SC-003**: Graph relation scoring and cognitive modifiers improve ranking quality within defined safety bounds.
- **SC-004**: Session manager and session-learning quality/performance targets are met.
- **SC-005**: Memory CRUD and re-embedding consistency checks prevent stale embedding drift.
- **SC-006**: Parser/index invariants and storage reliability checks gate releases with actionable failures.
- **SC-007**: Telemetry schemas and documentation stay aligned through automated drift checks.
- **SC-008**: Deferred/skipped-path coverage is closed or formally approved with explicit ownership.
- **SC-009**: Self-healing runbooks are tested and operationally usable.
- **SC-010**: Governance sign-off reaches approved state across technical, QA, product, and operations roles.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing hybrid-search scoring contracts | Incorrect assumptions can break ranking semantics | Capture and lock baseline fixtures before tuning; compare deterministically post-change |
| Dependency | Parser/index normalization guarantees from `003` and `004` | Drift in metadata contract weakens ranking and retrieval confidence | Add invariant gates and auto-heal probes for parser/index paths |
| Dependency | Session confidence mechanics from `005` | Session-learning quality can regress routing behavior | Align routing/retrieval confidence policy and add ambiguity boundary tests |
| Risk | Overweighting cognitive modifiers | False precision in ranking and unstable output | Bound FSRS/decay contribution to 5-25% and enforce ablation regression checks |
| Risk | Re-embedding backlog under high mutation volume | Stale embeddings degrade retrieval quality | Add queue SLA checks and reconciliation loop with alert thresholds |
| Risk | Transaction recovery logic adds hidden complexity | Inconsistent data on interruption | Add recovery simulation suite and ledger replay assertions before release |
| Risk | Telemetry schema drift vs documentation | Operators lose diagnostic reliability | Enforce schema registry validation and docs drift gate |
| Risk | Expanded scope causes timeline pressure | Delivery quality drops or partial controls ship | Require phased completion gates and explicit deferral protocol |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Retrieval p95 remains <= 120ms for `mode="auto"` and <= 180ms for `mode="deep"` on baseline corpus.
- **NFR-P02**: Session selection p95 remains <= 250ms for 500 candidates; session-learning batch reconciliation p95 <= 400ms.
- **NFR-P03**: Health automation loop runtime remains <= 5 minutes per full sweep.

### Security
- **NFR-S01**: Path normalization and folder detection safeguards continue blocking traversal and unapproved roots.
- **NFR-S02**: Trace payloads exclude sensitive content and validate against allowed schema fields only.
- **NFR-S03**: Mutation ledger integrity checks detect tampering or out-of-order replay.

### Reliability
- **NFR-R01**: Same query and same index state yield deterministic ranking output.
- **NFR-R02**: Reindex + retrieval + session routing workflows remain idempotent across reruns.
- **NFR-R03**: Operational drill and incident-remediation workflows achieve documented RTO <= 10 minutes; this operational RTO target is distinct from the REQ-008 simulation replay SLA (<= 120s).
<!-- /ANCHOR:nfr -->

---

## 8. EDGE CASES

### Data Boundaries
- Empty or near-empty retrieval sets still emit deterministic confidence and trace metadata.
- High-cardinality graph neighborhoods are bounded before expensive relation-score fanout executes.
- Large mutation bursts do not leave stale embedding backlog after reconciliation SLA window.

### Error Scenarios
- Index anomaly during search emits safe fallback metadata and triggers health loop escalation.
- Session ambiguity with near-equal confidence scores triggers explicit confirmation or safe deterministic fallback.
- Interrupted write transaction triggers replay-recovery path and ledger consistency validation before marking success.
- Trace schema mismatch blocks release and reports doc/schema field diffs.

### Cross-System Consistency
- Canonical path aliases (`specs/` vs `.opencode/specs/`) remain unified across scan, index, search, and session detection.
- Tier precedence and frontmatter normalization remain consistent from parser output through ranking inputs.
- Telemetry field names and docs references remain synchronized by automated drift checks.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Ten tightly-coupled subsystems across retrieval, storage, telemetry, testing, and operations |
| Risk | 24/25 | Failures can silently misroute context or corrupt confidence in system behavior |
| Research | 18/20 | Requires multi-subsystem baseline, calibration, and continuity mapping |
| Multi-Agent | 13/15 | Multiple concurrent workstreams require strict synchronization and governance |
| Coordination | 14/15 | Cross-component dependencies and sign-off coordination are extensive |
| **Total** | **93/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fusion and graph scoring overfit benchmark fixtures | H | M | Use holdout fixtures, calibration review, and threshold caps |
| R-002 | FSRS/attention-decay signals regress high-confidence paths | H | M | Enforce ablation bounds and automatic rollback thresholds |
| R-003 | Session-learning feedback loop amplifies stale signals | H | M | Add freshness windows, confidence decay, and retraining guardrails |
| R-004 | Mutation ledger replay diverges from CRUD source-of-truth | H | L | Add transaction replay parity checks and invariant gates |
| R-005 | Telemetry schema/doc mismatch hides production drift | M | M | Gate releases on schema/docs validation and trace field linting |
| R-006 | Expanded verification set extends cycle time | M | M | Parallelize non-blocking suites and enforce critical-path order |

---

## 11. USER STORIES

### US-001: Deterministic Hybrid Retrieval with Causal and Cognitive Signals (Priority: P0)

**As a** retrieval maintainer, **I want** fusion, graph relation scoring, and cognitive decay signals to be consistent and bounded, **so that** ranking quality improves without nondeterministic behavior.

**Acceptance Criteria**:
1. Given fixed fixture queries, when retrieval executes repeatedly, then ranked outputs and metadata are deterministic.
2. Given long-tail recall fixtures, when cognitive modifiers are enabled, then NDCG@5 improves while primary-fixture regression remains bounded.

---

### US-002: Trustworthy Session and Memory State Integrity (Priority: P0)

**As a** platform owner, **I want** session routing, session-learning, CRUD re-embedding, parser/index invariants, and storage recovery to be synchronized, **so that** context state remains reliable under mutation and interruption.

**Acceptance Criteria**:
1. Given ambiguous sessions, when selection runs, then low-confidence handling is explicit and misroutes stay <= 1%.
2. Given write interruptions, when recovery runs, then committed mutations are preserved and replay remains consistent.

---

### US-003: Governance and Observability That Stay in Sync (Priority: P0)

**As an** operations lead, **I want** telemetry schema validation and docs drift prevention tied to release gates, **so that** diagnostics remain accurate and actionable.

**Acceptance Criteria**:
1. Given trace emission changes, when CI runs, then schema/doc mismatches fail fast.
2. Given production-like diagnostics, when debugging incidents, then per-channel/routing rationale is available.

---

### US-004: Prevention Controls That Cover Known and Deferred Paths (Priority: P1)

**As a** QA lead, **I want** deferred/skipped path coverage and self-healing runbooks to be explicit and test-backed, **so that** regressions are blocked and remediation is repeatable.

**Acceptance Criteria**:
1. Given deferred test inventory, when hardening completes, then each path is tested or approved with explicit owner.
2. Given known failure classes, when self-healing checks run, then remediation flow is documented and validated.

---

<!-- ANCHOR:acceptance-scenarios -->
## 11.5 ACCEPTANCE SCENARIOS

1. **Full-surface audit coverage**
   **Given** the ten scoped subsystem areas
   **When** Phase 1 audit completes
   **Then** each area has documented contracts, risks, and mitigation owner.

2. **Fusion determinism and fallback safety**
   **Given** fixed index state and fixture queries
   **When** retrieval runs repeatedly
   **Then** ranking and fallback behavior remain deterministic.

3. **Graph relation contract compliance**
   **Given** causal-edge fixtures with expected relation ordering
   **When** relation scoring executes
   **Then** output ordering meets contract thresholds and schema checks pass.

4. **Cognitive integration bounds**
   **Given** FSRS and attention-decay modifiers enabled
   **When** ranking executes on benchmark fixtures
   **Then** quality improvement and regression bounds remain within required limits.

5. **Session-learning quality and latency**
   **Given** 500-candidate session ambiguity fixtures
   **When** session manager and learning feedback run
   **Then** misroute and p95 latency targets are satisfied.

6. **CRUD re-embedding consistency**
   **Given** create/update/delete mutation events
   **When** re-embedding reconciliation runs
   **Then** stale embedding backlog does not exceed SLA thresholds.

7. **Parser/index and storage integrity**
   **Given** canonicalization and transaction interruption fixtures
   **When** invariants and recovery tests run
   **Then** CI fails on violations and recovery preserves committed state.

8. **Telemetry schema and docs drift gate**
   **Given** trace payload updates
   **When** validation runs
   **Then** schema violations or documentation mismatches fail release gates.

9. **Deferred/skipped path hardening**
   **Given** inherited deferred test list from `002` to `005`
   **When** coverage hardening completes
   **Then** all deferred paths are closed or explicitly approved with rationale.

10. **Self-healing operations readiness**
   **Given** index drift, session ambiguity, ledger mismatch, and telemetry drift simulations
   **When** runbook automation executes
   **Then** detection, remediation, and escalation follow documented flows within MTTR target.

11. **Governance closure**
   **Given** implementation completion
   **When** approvals are reviewed
   **Then** technical, QA, product, and operations sign-offs are present with evidence.
<!-- /ANCHOR:acceptance-scenarios -->

---

## 11.6 AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scope lock includes all ten subsystem areas in Section 3.
- Confirm continuity matrix for `002/003/004/005` is available.
- Confirm verification commands for regression, performance, recovery, telemetry, and validation gates.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Only change files mapped to this spec and current phase objectives. |
| Traceability | Every requirement must map to plan phase, task IDs, and checklist evidence. |
| Evidence | Record command-level evidence for completed P0/P1 items. |
| Safety | Stop and escalate on invariant, recovery, or schema-gate failures without approved fallback. |

### Status Reporting Format
- `STATE`: current phase and objective.
- `ACTIONS`: files/commands executed.
- `RESULT`: pass/fail and next planned action.

### Blocked Task Protocol
1. Stop edits for the blocked area and capture concrete failure output.
2. Attempt one bounded remediation that does not expand scope.
3. Escalate with options, impact, and recommended next step.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Technical Lead | Approved | 2026-02-22 |
| Verification Review | QA Lead | Approved | 2026-02-22 |
| Implementation Review | Engineering Lead | Approved | 2026-02-22 |
| Operational Readiness Review | Operations Lead | Approved | 2026-02-22 |
| Launch Approval | Product Owner | Approved | 2026-02-22 |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [x] Security review completed
- [x] Path, routing, and ledger integrity checks passed
- [x] Sensitive diagnostics and trace payload review completed

### Code Compliance
- [x] Coding standards followed
- [x] License compliance verified
- [x] Regression and deferred-path coverage policy validated

### Operational Compliance
- [x] Monitoring, alert, and self-healing hooks documented
- [x] Rollback and recovery playbook verified
- [x] Telemetry schema and documentation drift gate approved

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Retrieval Maintainer | Engineering | High | Daily async updates |
| Session/State Maintainer | Platform | High | Phase-end sync |
| QA Lead | Verification | High | Test-gate review |
| Operations Lead | Operations | High | Runbook and incident-drill review |
| Product Owner | Product | Medium | Milestone review |

---

## 15. CHANGE LOG

### v1.4 (2026-02-22)
Closure sync: updated status to `Completed`, approvals to `Approved` with date, compliance checkpoints to complete, and decision backlog statuses to closed based on final quality evidence closure.

### v1.3 (2026-02-22)
Consistency patch: added `handlers/memory-search.ts` to the files-to-change allowlist, clarified REQ-008 as simulation replay SLA (`<= 120s`), clarified NFR-R03 as operational drill/incident RTO (`<= 10 minutes`) distinct from REQ-008, mapped decision-lock tasks to REQ-003/REQ-004/REQ-011 traceability rows, and converted open questions into an active decision backlog.

### v1.1 (2026-02-22)
Broadened scope from retrieval/fusion-focused hardening to full cross-system hardening across ten audited subsystems; added explicit traceability matrix and expanded governance/verification requirements.

### v1.2 (2026-02-22)
Added explicit subsystem coverage map to tighten requirement/task traceability for all ten scoped areas.

### v1.0 (2026-02-22)
Initial Level 3+ specification for hybrid RAG fusion logic improvements.

---

<!-- ANCHOR:questions -->
## 16. ACTIVE DECISION BACKLOG

| Decision ID | Decision Topic | Owner | Due Phase | Required Evidence | Task Linkage | Status |
|-------------|----------------|-------|-----------|-------------------|--------------|--------|
| D-001 | Relation-score adjudication corpus policy (shared vs domain-specific corpus) | Retrieval Maintainer | Phase 1 | Corpus policy note, adjudication fixture manifest, and Kendall tau variance report from baseline replay | T025 -> REQ-003 | Closed |
| D-002 | Cognitive-weight policy scope (global bounds vs intent-scoped bounds) | Retrieval Maintainer + QA Lead | Phase 1 | Ablation comparison by intent class, bound-selection rationale, and approval note for rollout defaults | T026 -> REQ-004 | Closed |
| D-003 | Self-healing auto-remediation policy (auto-apply vs operator acknowledgement) | Operations Lead | Phase 1 | Failure-class policy matrix, rollback/escalation guardrail definition, and dry-run command evidence | T027 -> REQ-011 | Closed |
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ SPEC
Governance-focused high complexity specification with expanded cross-system continuity mapping.
-->
