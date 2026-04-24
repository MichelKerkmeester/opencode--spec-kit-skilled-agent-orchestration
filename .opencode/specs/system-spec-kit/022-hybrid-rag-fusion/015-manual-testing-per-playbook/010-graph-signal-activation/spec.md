---
title: "Feature [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/010-graph-signal-activation/spec]"
description: "Phase 010 manual testing packet for graph-signal-activation coverage. Documents the 15 mapped playbook scenarios, feature catalog links, and evidence-driven acceptance criteria for graph and causal linking validation."
trigger_phrases:
  - "graph signal activation manual testing"
  - "phase 010 graph tests"
  - "manual testing playbook 016"
  - "manual testing playbook 175"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/010-graph-signal-activation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: graph-signal-activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [009-evaluation-and-measurement](../009-evaluation-and-measurement/spec.md) |
| **Successor** | [011-scoring-and-calibration](../011-scoring-and-calibration/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for graph-signal-activation need structured per-phase documentation instead of relying on scattered playbook rows. Phase 010 covers 15 graph-focused scenarios spanning typed degree scoring, co-activation boost, causal depth signals, community detection, graph rollback and explainability, and feature-flag-driven graph lifecycle features, so reviewers need one packet that preserves the mapped feature links, acceptance criteria, and evidence expectations for each test.

### Purpose
Provide a single Phase 010 specification that maps every graph-signal-activation scenario to its feature catalog entry and defines the documentation requirements needed for consistent manual execution and verdicting.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 010 manual testing documentation for all 15 scenarios assigned to `10--graph-signal-activation` in the parent phase map.
- Per-scenario mapping from playbook test ID to the graph-signal-activation feature catalog entry.
- Documentation expectations for prompts, execution records, evidence, and verdict capture.

### Out of Scope
- Executing the tests and recording final runtime outcomes.
- Code or schema changes in the MCP server or graph libraries.
- Creating evidence artifacts beyond the documentation packet itself.

### Scenario Mapping

| Test ID | Scenario Name | Feature Catalog Link | Playbook Command Summary | Evidence Focus |
|---------|---------------|----------------------|--------------------------|----------------|
| 016 | Typed-weighted degree channel (R4) | [10--graph-signal-activation/01-typed-weighted-degree-channel.md](../../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md) | Run a retrieval with graph channel active, inspect the typed-weighted degree score contribution in the fusion trace. | Fusion trace showing degree-channel weight, typed edge counts, and weighted score. |
| 017 | Co-activation boost strength increase (A7) | [10--graph-signal-activation/02-co-activation-boost-strength-increase.md](../../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md) | Trigger co-activation for a memory pair, verify the boost magnitude against the configured strength multiplier. | Co-activation log showing boosted scores and strength multiplier applied. |
| 018 | Edge density measurement | [10--graph-signal-activation/03-edge-density-measurement.md](../../feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md) | Run `memory_causal_stats`, inspect edge density percentage and per-relation-type breakdown. | Causal stats output with total edges, coverage percentage, and relation-type counts. |
| 019 | Weight history audit tracking | [10--graph-signal-activation/04-weight-history-audit-tracking.md](../../feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md) | Create a causal link, update its strength, then inspect the weight history log for audit trail entries. | Weight history rows showing old value, new value, timestamp, and actor. |
| 020 | Graph momentum scoring (N2a) | [10--graph-signal-activation/05-graph-momentum-scoring.md](../../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md) | Run a search with graph channel enabled, verify momentum score contribution for memories with recent causal activity. | Search trace showing momentum score and recency-weighted graph activity. |
| 021 | Causal depth signal (N2b) | [10--graph-signal-activation/06-causal-depth-signal.md](../../feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md) | Create a multi-hop causal chain, run `memory_drift_why` with maxDepth, verify depth signal in scoring. | Drift-why output showing traversal depth and depth-signal contribution. |
| 022 | Community detection (N2c) | [10--graph-signal-activation/07-community-detection.md](../../feature_catalog/10--graph-signal-activation/07-community-detection.md) | Run community detection, inspect cluster assignments for memories with shared causal edges. | Community cluster output with member lists and cluster boundary rationale. |
| 081 | Graph and cognitive memory fixes | [10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md](../../feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md) | Inspect fix locations for graph and cognitive memory corrections, verify corrected behavior in representative flows. | Fix-location inspection notes and representative flow output. |
| 091 | Implemented: graph centrality and community detection (N2) | [10--graph-signal-activation/07-community-detection.md](../../feature_catalog/10--graph-signal-activation/07-community-detection.md) | Verify N2 implemented and active: N2 tables exist with data, feature flags show active status, graph queries include centrality/community contributions in scores. | N2 tables populated, flags active, graph queries include centrality and community scoring contributions. |
| 120 | Unified graph rollback and explainability (Phase 3) | [10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md](../../feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md) | Create causal links, trigger rollback, verify edge removal and explainability trace output. | Rollback confirmation, edge count before/after, and explainability trace. |
| 156 | Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) | [10--graph-signal-activation/13-graph-lifecycle-refresh.md](../../feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md) | Set SPECKIT_GRAPH_REFRESH_MODE, trigger a refresh cycle, inspect refresh log and updated graph state. | Refresh log output showing mode, affected edges, and post-refresh stats. |
| 157 | LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) | [10--graph-signal-activation/14-llm-graph-backfill.md](../../feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md) | Enable SPECKIT_LLM_GRAPH_BACKFILL, trigger backfill for unlinked memories, verify new edges created. | Backfill log showing memories processed, edges created, and LLM prompts used. |
| 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | [10--graph-signal-activation/15-graph-calibration-profiles.md](../../feature_catalog/10--graph-signal-activation/15-graph-calibration-profiles.md) | Set different calibration profiles, run searches, compare graph signal weights across profiles. | Search traces showing different graph weights per calibration profile. |
| 174 | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | [10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md](../../feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md) | Enable SPECKIT_GRAPH_CONCEPT_ROUTING, run a concept-based query, verify graph-routed results. | Search output showing concept-routed results with graph signal attribution. |
| 175 | Typed traversal (SPECKIT_TYPED_TRAVERSAL) | [10--graph-signal-activation/16-typed-traversal.md](../../feature_catalog/10--graph-signal-activation/16-typed-traversal.md) | Enable SPECKIT_TYPED_TRAVERSAL, run `memory_drift_why` filtering by relation type, verify typed edges only. | Drift-why output filtered to specific relation types with no cross-type leakage. |

### Acceptance Scenarios

#### Acceptance Scenario A: Core graph signal checks
- Cover MCP-backed execution for 016 through 022, 120, and 175.
- Verify the packet preserves prompts, command sequences, evidence targets, and PASS/FAIL verdict rules for typed-weighted degree scoring, co-activation boost, edge density, weight history audit, momentum scoring, causal depth, community detection, graph rollback/explainability, and typed traversal.

#### Acceptance Scenario B: Feature flag and lifecycle checks
- Cover feature-flag-driven scenarios 156, 157, 158, and 174.
- Verify the packet preserves flag configuration steps, expected behavior per mode, evidence expectations, and PASS/PARTIAL/FAIL decision paths for graph refresh, LLM backfill, calibration profiles, and concept routing.

#### Acceptance Scenario C: Fix verification and audit checks
- Cover inspection-heavy scenarios 081 and 091.
- Verify the packet preserves inspection guidance, evidence expectations, and PASS/PARTIAL/FAIL decision paths for graph/cognitive memory fix review and N2 centrality/community implementation verification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 010 requirements and scenario mapping for graph signal tests |
| `plan.md` | Create | Phase 010 execution plan for manual and MCP-based graph signal coverage |
| `tasks.md` | Create | Phase 010 task tracker for all 15 scenarios |
| `checklist.md` | Create | Phase 010 QA verification checklist |
| `implementation-summary.md` | Create | Phase 010 post-execution summary (blank until execution completes) |
| `description.json` | Create | Phase 010 folder metadata |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 016 | Typed-weighted degree channel (R4) | 10--graph-signal-activation/01-typed-weighted-degree-channel.md |
| 2 | 017 | Co-activation boost strength increase (A7) | 10--graph-signal-activation/02-co-activation-boost-strength-increase.md |
| 3 | 018 | Edge density measurement | 10--graph-signal-activation/03-edge-density-measurement.md |
| 4 | 019 | Weight history audit tracking | 10--graph-signal-activation/04-weight-history-audit-tracking.md |
| 5 | 020 | Graph momentum scoring (N2a) | 10--graph-signal-activation/05-graph-momentum-scoring.md |
| 6 | 021 | Causal depth signal (N2b) | 10--graph-signal-activation/06-causal-depth-signal.md |
| 7 | 022 | Community detection (N2c) | 10--graph-signal-activation/07-community-detection.md |
| 8 | 081 | Graph and cognitive memory fixes | 10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md |
| 9 | 091 | Implemented: graph centrality and community detection (N2) | 10--graph-signal-activation/07-community-detection.md |
| 10 | 120 | Unified graph rollback and explainability (Phase 3) | 10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md |
| 11 | 156 | Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) | 10--graph-signal-activation/13-graph-lifecycle-refresh.md |
| 12 | 157 | LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) | 10--graph-signal-activation/14-llm-graph-backfill.md |
| 13 | 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | 10--graph-signal-activation/15-graph-calibration-profiles.md |
| 14 | 174 | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | 12--query-intelligence/11-graph-concept-routing.md |
| 15 | 175 | Typed traversal (SPECKIT_TYPED_TRAVERSAL) | 10--graph-signal-activation/16-typed-traversal.md |
| 16 | 193 | ANCHOR tags as graph nodes | 10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md |
| 17 | 194 | Causal neighbor boost and injection | 10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md |
| 18 | 195 | Temporal contiguity layer | 10--graph-signal-activation/11-temporal-contiguity-layer.md |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 016 typed-weighted degree channel scoring. | PASS: Degree channel contributes a non-zero weighted score in the fusion trace with typed edge counts visible; FAIL: Degree channel absent from fusion trace or zero weight |
| REQ-002 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 017 co-activation boost strength increase. | PASS: Co-activation boost applies the configured strength multiplier and boosted scores are higher than unboosted; FAIL: No boost applied or multiplier mismatch |
| REQ-003 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 018 edge density measurement. | PASS: `memory_causal_stats` returns edge count, coverage percentage, and per-relation-type breakdown; FAIL: Missing fields or zero coverage when edges exist |
| REQ-004 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 019 weight history audit tracking. | PASS: Weight history contains timestamped entries with old/new values after a strength update; FAIL: No audit trail or missing entries |
| REQ-005 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 020 graph momentum scoring. | PASS: Momentum score is non-zero for memories with recent causal activity and zero for isolated memories; FAIL: Momentum score absent or applied to non-graph memories |
| REQ-006 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 021 causal depth signal. | PASS: Depth signal increases with longer causal chains and `memory_drift_why` traverses to configured maxDepth; FAIL: Depth signal flat regardless of chain length |
| REQ-007 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 022 community detection. | PASS: Community detection returns cluster assignments grouping memories with shared causal edges; FAIL: No clusters returned or all memories in one cluster |
| REQ-008 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 081 graph and cognitive memory fixes. | PASS: Fix locations produce corrected behavior and no regressions; FAIL: Fixes not applied or regression detected |
| REQ-009 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 091 graph centrality and community detection (N2) implementation verification. | PASS: N2 tables are populated, feature flags are active, and graph queries include centrality/community scoring contributions; FAIL: N2 tables missing, flags inactive, or no centrality/community scoring in graph queries |
| REQ-010 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 120 unified graph rollback and explainability. | PASS: Rollback removes specified edges, edge count decreases, and explainability trace shows removal rationale; FAIL: Rollback fails or edges persist |
| REQ-011 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 156 graph refresh mode. | PASS: Refresh cycle completes under configured mode with updated graph state and refresh log; FAIL: Refresh fails or mode ignored |
| REQ-012 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 157 LLM graph backfill. | PASS: Backfill creates new edges for previously unlinked memories with LLM-generated relation types; FAIL: No new edges or backfill errors |
| REQ-013 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 158 graph calibration profile. | PASS: Different calibration profiles produce measurably different graph signal weights in search traces; FAIL: Profiles produce identical weights |
| REQ-014 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 174 graph concept routing. | PASS: Concept-routed queries return graph-attributed results with concept labels; FAIL: No graph attribution or concept labels missing |
| REQ-015 | Document how Phase 010 captures prompt, execution record, evidence, and verdict details for 175 typed traversal. | PASS: `memory_drift_why` with relation filter returns only edges of the specified type; FAIL: Cross-type edges leak into filtered results |

### P1 - Required (complete OR user-approved deferral)
- No additional P1 requirements; Phase 010 readiness depends on complete P0 coverage for all 15 mapped scenarios.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 15 Phase 010 tests are documented with their exact prompts, mapped feature links, expected execution method, required evidence, and final verdict path.
- **SC-002**: The packet preserves the parent phase-map coverage for `10--graph-signal-activation` with no missing IDs and no duplicate scenario mappings.
- **SC-003**: Reviewers can evaluate every scenario against the playbook verdict model using prompts, commands or inspections, evidence notes, and PASS/PARTIAL/FAIL outcomes.
- **SC-004**: Release-readiness review for this phase can confirm 100% feature coverage with no scenario left undocumented.
### Acceptance Scenarios

**Given** the `010-graph-signal-activation` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `010-graph-signal-activation` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `010-graph-signal-activation` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `010-graph-signal-activation` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Manual testing playbook source | Source of prompts, evidence expectations, and pass/fail criteria | Keep Phase 010 language aligned to the playbook rows for 016-022, 081, 091, 120, 156-158, 174, and 175 |
| Dependency | Feature catalog group `10--graph-signal-activation` | Source of feature summaries such as typed degree channel, co-activation boost, community detection, graph lifecycle refresh, and typed traversal | Preserve one catalog link per test ID and use catalog summaries to frame execution context |
| Dependency | MCP runtime with graph tools | Needed for `memory_causal_link`, `memory_drift_why`, `memory_causal_stats`, and search with graph channel enabled | Limit runtime-oriented scenarios to environments where MCP graph tools are available |
| Risk | Graph state from prior sessions contaminates measurements | Re-runs may blur causal edge counts or community assignments | Use checkpoint/restore or fresh DB before graph-dependent scenarios |
| Risk | Feature flags for 156, 157, 158, 174, 175 may not be implemented | Scenarios targeting future flags cannot be executed | Mark as DEFERRED with rationale if flags are absent from the current build |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Graph signal scenarios should complete within 30 seconds per MCP call for databases under 1000 memories.
- **NFR-P02**: Community detection and typed traversal should not degrade search latency by more than 2x compared to non-graph searches.

### Security
- **NFR-S01**: No raw database file paths or credentials exposed in evidence artifacts.
- **NFR-S02**: Graph backfill LLM prompts must not contain PII from memory content.

### Reliability
- **NFR-R01**: Graph rollback must be deterministic -- repeated rollback of the same edge set produces identical results.
- **NFR-R02**: Feature flag toggles must not corrupt existing graph state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Empty graph (zero edges): `memory_causal_stats` returns 0 coverage, community detection returns no clusters.
- Single-node graph: Degree channel returns zero, momentum score is zero, depth signal is zero.
- Maximum depth traversal: `memory_drift_why` with maxDepth=10 on a chain of length 3 stops at depth 3.

### Error Scenarios
- Graph tools called when causal_edges table is empty: Graceful empty response, no crash.
- Invalid relation type in typed traversal filter: Error message returned, no partial results.
- LLM backfill fails mid-batch: Partial edges committed, error logged, remaining memories skipped.

### State Transitions
- Graph refresh during active search: Search completes with pre-refresh state, refresh applies after.
- Rollback of edges created during current session: Edges removed, no orphaned references.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 15 scenarios, documentation-only, no code changes |
| Risk | 10/25 | Feature flags may not exist, graph state contamination |
| Research | 5/20 | Playbook and feature catalog provide all inputs |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which graph state (edge count, community assignments) should be treated as the canonical baseline for reproducible comparisons in 018, 022, and 120?
- Are feature flags SPECKIT_GRAPH_REFRESH_MODE, SPECKIT_LLM_GRAPH_BACKFILL, SPECKIT_GRAPH_CALIBRATION_PROFILE, SPECKIT_GRAPH_CONCEPT_ROUTING, and SPECKIT_TYPED_TRAVERSAL implemented in the current build?
<!-- /ANCHOR:questions -->

---
