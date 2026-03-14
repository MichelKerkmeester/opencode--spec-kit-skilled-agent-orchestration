---
title: "Feature Specification: 003-unified-graph-retrieval"
description: "Level 3+ phase spec for deterministic graph-aware retrieval fusion."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "phase 3"
  - "unified graph retrieval"
  - "graph fusion"
  - "deterministic ranking"
importance_tier: "critical"
contextType: "decision"
---
<!-- ANCHOR:document -->
# Feature Specification: 003-unified-graph-retrieval

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 3 unifies the current fragmented graph-related retrieval signals into one deterministic retrieval path. It combines causal, entity, and summary context with explainable scoring, graph-health metrics, and regression gates so retrieval quality improves without turning ranking behavior into a black box.

**Key Decisions**: integrate graph fusion inside the current MCP retrieval pipeline rather than building a separate service; make tie-break and score tracing explicit so regressions can be explained and reversed.

**Critical Dependencies**: Phase 2 lineage semantics, existing candidate generation and causal boost modules, and parent ADR-002.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-13 |
| **Branch** | `022-hybrid-rag-fusion` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 3 of 6 |
| **Predecessor** | `002-versioned-memory-state` |
| **Successor** | `004-adaptive-retrieval-loops` |
| **Handoff Criteria** | Unified graph scoring, deterministic ranking, explainability traces, and regression benchmarks verified |

### Phase Context

This phase pulls graph context into the main retrieval contract rather than leaving it split across isolated heuristics. The work must keep ranking predictable, explainable, and fast enough that later adaptive and collaboration phases have a stable retrieval baseline.

**Scope Boundary**: graph-aware scoring, ranking determinism, score tracing, and regression validation. No adaptive learning or shared-memory policy work ships here.

**Dependencies**:
- Phase 2 lineage identifiers and temporal state semantics
- Existing Stage 1 candidate generation and causal-boost logic
- Parent ADR-002 in-process unification strategy

**Deliverables**:
- Unified graph-aware retrieval stage
- Deterministic tie-break and score-trace model
- Graph-health telemetry and regression suite

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The current server contains useful graph-related signals, but they are distributed across subsystems and do not form one coherent retrieval path. That makes ranking behavior harder to explain, tune, and trust.

### Purpose
Build a single deterministic graph-aware retrieval contract that uses causal, entity, and summary context consistently and measurably.

---

## 3. SCOPE

### In Scope
- Unified scoring model for causal, entity, and summary relationships.
- Deterministic tie-break policy and score tracing.
- Graph-health metrics and retrieval regression coverage.
- Integration into the current MCP retrieval pipeline.

### Out of Scope
- Adaptive feedback loops that change ranking over time.
- Scope/governance enforcement and policy decisions.
- Shared-memory collaboration interfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Integrate unified graph-aware candidate enrichment |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Modify | Refactor causal weighting into a broader graph-scoring contract |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/` | Create/Modify | Add graph-fusion helpers and deterministic tie-break logic |
| `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/` | Modify | Capture graph-health and score-trace telemetry |
| `.opencode/skill/system-spec-kit/mcp_server/tests/` | Create/Modify | Add regression, explainability, and determinism coverage |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add graph retrieval validation procedures |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-301 | Unify graph-aware scoring | Retrieval consumes causal, entity, and summary relationships through one bounded scoring model |
| REQ-302 | Keep ranking deterministic | Repeated runs with identical inputs produce the same ordering and tie-break results |
| REQ-303 | Provide score explainability | Maintainers can inspect how graph signals influenced a result |
| REQ-304 | Guard latency and regression | Benchmarks and regression tests show graph fusion stays within agreed limits |
| REQ-305 | Keep rollback simple | A graph-fusion kill switch or equivalent path returns retrieval to the prior stable baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-306 | Capture graph-health metrics | Telemetry reports signal coverage and graph contribution rates |
| REQ-307 | Document manual graph validation | Playbook includes explainability and regression checks |
| REQ-308 | Keep docs in sync with retrieval behavior | Spec, plan, tasks, and user-facing docs reflect shipped graph behavior |

---

## 5. SUCCESS CRITERIA

- **SC-301**: Unified graph scoring runs through one predictable path.
- **SC-302**: Identical inputs produce identical ranked outputs.
- **SC-303**: Explainability traces show the contribution of graph signals clearly enough for debugging.
- **SC-304**: Recall or ranking quality improves without unacceptable latency growth.
- **SC-305**: Phase 4 can consume stable retrieval traces without redefining the graph contract.

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 lineage identifiers | Without them, graph relationships lack stable temporal anchoring | Block Phase 3 on Phase 2 handoff |
| Dependency | Existing retrieval pipeline | Integration point must remain understandable and testable | Extend current stages instead of duplicating them |
| Risk | Graph scoring becomes non-deterministic | High | Explicit tie-break rules and regression tests |
| Risk | Weak graph signals overpower stronger lexical/semantic matches | High | Bound score contributions and benchmark changes |
| Risk | Cycles or sparse graphs degrade quality | Medium | Add cycle handling and sparse-graph fallbacks |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P31**: Retrieval with graph fusion stays within agreed latency budgets.
- **NFR-P32**: Explainability tracing can be sampled or bounded so it does not dominate cost.

### Security
- **NFR-S31**: Graph fusion must not bypass future scope/governance filters.
- **NFR-S32**: Trace outputs must avoid leaking protected context by default.

### Reliability
- **NFR-R31**: Ranking remains deterministic under identical inputs.
- **NFR-R32**: Kill-switch rollback restores baseline retrieval behavior cleanly.

### Operability
- **NFR-O31**: Maintainers can inspect graph contribution traces during debugging.
- **NFR-O32**: Benchmarks and regression suites are easy to rerun locally.

---

## 8. EDGE CASES

### Data Boundaries
- Graph is sparse and offers little extra context.
- Graph is dense and multiple signals point in conflicting directions.
- Cycles create repeated expansion opportunities.

### Error Scenarios
- Graph trace generation fails mid-request.
- Tie-break logic becomes order-dependent on map iteration or query timing.
- A relationship exists but points to a stale or filtered-out node.

### Behavioral Cases
- Strong lexical match conflicts with strong causal context.
- Summary nodes and entity nodes both reference the same concept with different confidence.
- Historical `asOf` state affects which graph neighbors are valid.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Retrieval pipeline, telemetry, tests, and explainability all move together |
| Risk | 22/25 | Ranking quality and determinism are highly sensitive |
| Research | 16/20 | Need careful fusion design and measurement |
| Multi-Agent | 10/15 | Later adaptive and collaboration phases depend on stable traces |
| Coordination | 13/15 | Depends on Phase 2 and blocks Phase 4 and Phase 6 confidence |
| **Total** | **82/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-301 | Ranking becomes unstable | High | Medium | Deterministic scoring and tie-break rules |
| R-302 | Latency increases too much | High | Medium | Bounded graph contributions and benchmarks |
| R-303 | Explainability is too vague to debug regressions | Medium | Medium | Emit stage-level traces and contribution summaries |
| R-304 | Graph cycles distort results | Medium | Medium | Add cycle guards and capped expansion |

---

## 11. USER STORIES

### US-301: Explainable Graph Retrieval (Priority: P0)

**As a** retrieval engineer, **I want** graph signals to flow through one explainable scoring path, **so that** I can understand why a result moved up or down.

**Acceptance Criteria**:
1. ****Given**** a result influenced by causal or entity context, when tracing is enabled, then the contributing graph signals are visible.
2. ****Given**** repeated runs with the same inputs, when ranking executes, then the same order is returned.

### US-302: Safe Graph Rollback (Priority: P0)

**As a** maintainer, **I want** graph fusion to be reversible, **so that** I can disable it quickly if quality or latency regresses.

**Acceptance Criteria**:
1. ****Given**** a graph-fusion regression, when the rollback path is triggered, then retrieval returns to the previous stable baseline.
2. ****Given**** the rollback path, when smoke tests run, then baseline retrieval behavior is restored predictably.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | System-spec-kit maintainer | Approved | 2026-03-14 |
| Retrieval Design Review | Search/retrieval maintainer | Approved | 2026-03-14 |
| Implementation Review | Runtime and QA reviewers | Approved | 2026-03-14 |
| Rollout Approval | Roadmap owner | Approved | 2026-03-14 |

---

## 13. COMPLIANCE CHECKPOINTS

### Retrieval Quality and Safety
- [x] Deterministic ranking rules reviewed
- [x] Kill-switch rollback path defined
- [x] Explainability traces reviewed for safe defaults

### Code and Process
- [x] `sk-code--opencode` alignment verified during implementation
- [x] Benchmark and regression plan approved
- [x] Manual graph validation steps added to the playbook

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| System-spec-kit maintainer | Phase owner | High | Spec and roadmap review |
| Search/retrieval maintainer | Technical reviewer | High | Fusion design and benchmark review |
| QA/release reviewer | Validation reviewer | Medium | Regression evidence review |

---

## 15. CHANGE LOG

### v0.1 (2026-03-13)
- Created the Phase 3 Level 3+ execution package.
- Defined deterministic graph-fusion scope and verification boundaries without claiming implementation.

---

## 16. ACCEPTANCE SCENARIOS

1. **Unified graph contribution**
   **Given** related causal, entity, and summary context, when retrieval runs, then the signals contribute through one bounded scoring contract.
2. **Deterministic tie-break**
   **Given** two candidates with equal base scores, when graph fusion executes, then tie-break behavior remains stable across repeated runs.
3. **Safe rollback**
   **Given** a latency or quality regression, when graph fusion is disabled, then retrieval returns to the baseline path without schema rollback.

---

## 17. OPEN QUESTIONS

- Should score traces be emitted inline, sampled, or written to a separate debug surface?
- Which graph-health metrics are essential for Phase 3 versus nice-to-have for later phases?

---

## RELATED DOCUMENTS

- **Parent Roadmap**: `../spec.md`
- **Phase 2 Handoff**: `../002-versioned-memory-state/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

<!-- /ANCHOR:document -->
