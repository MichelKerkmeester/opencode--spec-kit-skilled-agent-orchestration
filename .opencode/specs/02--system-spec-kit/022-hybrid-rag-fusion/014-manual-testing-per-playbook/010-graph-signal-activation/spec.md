---
title: "Feature Specification: Phase 010 Graph Signal Activation Manual Testing"
description: "Structured manual test documentation for the graph-signal-activation phase of the Spec Kit Memory playbook. This packet maps fifteen assigned scenarios to their feature catalog entries and records the acceptance criteria reviewers will apply during execution."
trigger_phrases:
  - "phase 010 manual testing"
  - "graph signal activation tests"
  - "016 017 018"
  - "019 020 021 022"
  - "081 120"
  - "156 157 158"
  - "graph refresh mode"
  - "llm graph backfill"
  - "graph calibration profile"
  - "174 175"
  - "graph concept routing"
  - "typed traversal"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Phase 010 Graph Signal Activation Manual Testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
| **Predecessor Phase** | `009-evaluation-and-measurement` |
| **Successor Phase** | `011-scoring-and-calibration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for graph-signal-activation need structured per-phase documentation. The canonical playbook defines the prompts, commands, evidence, and pass or fail rules, but operators still need a focused phase packet that isolates the fifteen graph-signal scenarios assigned to Phase 010, including Wave 2-5 additions for graph refresh mode, LLM graph backfill, graph calibration profiles, graph concept routing, and typed traversal.

### Purpose
Create a phase-local specification that links each assigned test to its feature catalog entry and preserves the review-ready acceptance criteria for 016, 017, 018, 019, 020, 021, 022, 081, 091, 120, 156, 157, 158, 174, and 175.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the fifteen Phase 010 scenarios from the manual testing playbook.
- Link each scenario to the matching graph-signal-activation feature catalog entry.
- Preserve the acceptance criteria reviewers will use when issuing PASS, PARTIAL, or FAIL verdicts.

### Out of Scope
- Running the tests described in this packet.
- Changing MCP runtime code, feature flags, or the playbook itself.
- Covering unassigned graph-signal scenarios such as `F-10` and `F-11`.

### Assigned Tests

| Test ID | Scenario Name | Feature Catalog File |
|---------|---------------|----------------------|
| `016` | Typed-weighted degree channel (R4) | [`../../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md`](../../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md) |
| `017` | Co-activation boost strength increase (A7) | [`../../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md`](../../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md) |
| `018` | Edge density measurement | [`../../feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md`](../../feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md) |
| `019` | Weight history audit tracking | [`../../feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md`](../../feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md) |
| `020` | Graph momentum scoring (N2a) | [`../../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md`](../../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md) |
| `021` | Causal depth signal (N2b) | [`../../feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md`](../../feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md) |
| `022` | Community detection (N2c) | [`../../feature_catalog/10--graph-signal-activation/07-community-detection.md`](../../feature_catalog/10--graph-signal-activation/07-community-detection.md) |
| `081` | Graph and cognitive memory fixes | [`../../feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md`](../../feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md) |
| `091` | Implemented: graph centrality and community detection (N2) | [`../../feature_catalog/10--graph-signal-activation/07-community-detection.md`](../../feature_catalog/10--graph-signal-activation/07-community-detection.md) |
| `120` | Unified graph rollback and explainability (Phase 3) | [`../../feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md`](../../feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md) |
| `156` | Graph Refresh Mode | [`../../feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md`](../../feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md) |
| `157` | LLM Graph Backfill | [`../../feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md`](../../feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md) |
| `158` | Graph Calibration Profile | [`../../feature_catalog/10--graph-signal-activation/15-graph-calibration-profiles.md`](../../feature_catalog/10--graph-signal-activation/15-graph-calibration-profiles.md) |
| `174` | Graph Concept Routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | [`../../feature_catalog/12--query-intelligence/11-graph-concept-routing.md`](../../feature_catalog/12--query-intelligence/11-graph-concept-routing.md) |
| `175` | Typed Traversal (SPECKIT_TYPED_TRAVERSAL) | [`../../feature_catalog/10--graph-signal-activation/16-typed-traversal.md`](../../feature_catalog/10--graph-signal-activation/16-typed-traversal.md) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| `REQ-016` | Document the typed-weighted degree channel scenario and its bounded boost expectations. | PASS when boost values stay within `[0, cap]`, fallback returns the default when no typed edges exist, and varied edge types produce different scores. FAIL when boosts exceed the cap or fallback behavior does not appear. |
| `REQ-017` | Document the co-activation strength comparison scenario and its baseline delta expectations. | PASS when increasing strength yields a measurable positive contribution delta that scales with the multiplier change. FAIL when there is no measurable difference or the effect moves in the wrong direction. |
| `REQ-018` | Document the edge density measurement scenario and its gate-threshold expectations. | PASS when the ratio equals `edges/nodes` under manual calculation and the threshold gate flips correctly at the boundary. FAIL when the ratio is wrong or the gate ignores the threshold. |
| `REQ-019` | Document the weight history audit tracking scenario and its rollback expectations. | PASS when every mutation creates an audit row with old and new values, rollback restores the prior weights, and history remains append-only. FAIL when audit rows are missing or rollback loses state. |
| `REQ-020` | Document the graph momentum scoring scenario and its seven-day delta bonus expectations. | PASS when the momentum bonus equals the capped `current - 7d_ago` delta, nodes without history stay at zero bonus, and the cap is enforced. FAIL when the bonus is uncapped or non-zero for missing history. |
| `REQ-021` | Document the causal depth signal scenario and its normalized depth expectations. | PASS when all depth scores stay in `[0,1]` and deeper nodes score greater than or equal to shallower nodes on the same chain. FAIL when scores leave range or depth ordering is wrong. |
| `REQ-022` | Document the community detection scenario and its cluster-boost expectations. | PASS when cluster IDs are assigned, co-members receive a boost within the configured cap, and non-members receive zero boost. FAIL when cluster IDs are missing or the boost exceeds the cap. |
| `REQ-081` | Document the graph and cognitive memory fixes bundle and its guardrail expectations. | PASS when self-loops are blocked, depth remains inside the clamped bounds, and cache invalidation occurs correctly after mutation. FAIL when any guard or invalidation path is missing. |
| `REQ-091` | Document the implemented graph centrality and community detection status scenario and its activation expectations. | PASS when N2 tables are populated, feature flags are active, and graph queries include centrality or community score contributions. FAIL when any implementation signal is missing. |
| `REQ-120` | Document the unified graph rollback and explainability scenario and its kill-switch expectations. | PASS when enabled runs show graph contribution trace data, disabled runs remove graph-side effects while keeping deterministic baseline order, and repeated runs preserve exact ordering. FAIL when graph effects remain after disable or identical runs reorder ties. |
| `REQ-156` | Document the graph refresh mode scenario and its `SPECKIT_GRAPH_REFRESH_MODE` feature flag behavior. | PASS when `write_local` mode updates the local graph store on each mutation and `scheduled` mode defers updates to the configured interval; default (flag OFF or unset) keeps the existing synchronous write behavior. FAIL when `write_local` skips the local store, `scheduled` writes immediately, or disabling the flag still triggers the new refresh pathway. |
| `REQ-157` | Document the LLM graph backfill scenario and its `SPECKIT_LLM_GRAPH_BACKFILL` feature flag behavior. | PASS when enabling the flag triggers an async backfill job that populates missing graph edges from existing memory records, backfill progress is logged, and the live retrieval path is unblocked during backfill; default (flag OFF) performs no backfill. FAIL when backfill blocks retrieval, runs synchronously, or proceeds when the flag is disabled. |
| `REQ-158` | Document the graph calibration profile scenario and its `SPECKIT_GRAPH_CALIBRATION_PROFILE` feature flag behavior. | PASS when enabling the flag applies the named profile's weight caps and Louvain community detection thresholds, profile switching takes effect on the next query, and disabling the flag reverts to the default calibration values. FAIL when weight caps are ignored, Louvain thresholds do not change with the profile, or disabling the flag retains the custom profile values. |
| `REQ-174` | Document the graph concept routing scenario and its `SPECKIT_GRAPH_CONCEPT_ROUTING` feature flag behavior. | PASS when query-time alias matching activates the graph channel for matched concepts via noun phrase extraction and unmatched aliases do not activate graph routing. FAIL when alias matching does not trigger graph activation for matched concepts or activation occurs without noun phrase extraction support. |
| `REQ-175` | Document the typed traversal scenario and its `SPECKIT_TYPED_TRAVERSAL` feature flag behavior. | PASS when the sparse-first policy constrains traversal to 1-hop and intent-aware edge traversal applies the correct scoring formula for the selected edge types. FAIL when traversal exceeds 1-hop under sparse-first policy or intent-aware scoring does not use the required formula. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All fifteen assigned test IDs are documented with their exact prompt source, feature link, evidence target, and verdict expectations.
- **SC-002**: The paired plan documents the exact playbook command sequences by reference and tells operators to execute them verbatim.
- **SC-003**: Stateful scenarios identify sandbox, checkpoint, or rollback handling before execution begins.
- **SC-004**: Reviewers can apply the review protocol verdict rules without consulting any other phase packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Provides the canonical prompts, command sequences, evidence fields, and pass or fail rules. | Treat the playbook as the source of truth and copy scenario wording from its Phase 010 rows. |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Controls PASS, PARTIAL, FAIL, and coverage rules. | Reuse the review protocol verdict language in the plan and final evidence checklist. |
| Dependency | Graph-signal feature catalog files | Provide current-reality context for each assigned scenario. | Link every test to its category file and keep category scope limited to `10--graph-signal-activation`. |
| Dependency | MCP runtime with graph features enabled | Required to execute graph, causal, cache, and trace scenarios. | Confirm tool access and graph-related flags before running the packet. |
| Risk | Stateful scenarios mutate graph data or rollout flags | Shared environments can drift and invalidate later evidence. | Run rollback-sensitive checks in a disposable sandbox with checkpoints and isolated flag changes. |
| Dependency | `SPECKIT_GRAPH_REFRESH_MODE` feature flag | Required for 156; controls whether graph refresh uses `write_local` or `scheduled` mode | Confirm flag support in the runtime before running 156; default OFF preserves existing behavior |
| Dependency | `SPECKIT_LLM_GRAPH_BACKFILL` feature flag | Required for 157; controls the async backfill pathway | Confirm flag support and verify backfill job infrastructure before running 157 |
| Dependency | `SPECKIT_GRAPH_CALIBRATION_PROFILE` feature flag | Required for 158; controls weight caps and Louvain thresholds | Confirm named profiles are configured and verify fallback to defaults when flag is OFF |
| Risk | Scenario overlap with adjacent graph features | Operators might mix Phase 010 work with `F-10`, `F-11`, or deferred anchor-node work. | Keep this packet scoped to the fifteen listed scenarios only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `019` and `120` always run in a disposable sandbox runtime, even when the operator claims to have an isolated local dataset?
- For `081`, should reviewers capture one bundled evidence packet for the full fix set or one artifact per guardrail check?
<!-- /ANCHOR:questions -->

---
