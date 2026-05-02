---
title: "Fe [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec]"
description: "Capture the completed graph-contract verification work that added cross-layer integration tests, stress coverage, and graph-specific manual playbook scenarios across the deep-loop skills."
trigger_phrases:
  - "042.006"
  - "graph testing"
  - "playbook alignment"
  - "coverage graph integration"
  - "graph stress tests"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Graph Testing and Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-10 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 6 of 8 |
| **Predecessor** | `../005-agent-improver-deep-loop-alignment/spec.md` |
| **Successor** | `../007-skill-rename-improve-agent-prompt/spec.md` |
| **Handoff Criteria** | Graph integration tests, stress coverage, playbook scenarios, and README references are in place so later phases can rely on the graph contract without re-auditing basic coverage. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 introduced the coverage-graph runtime, but the supporting verification surface was incomplete. The repo needed one phase that proved the CommonJS and TypeScript graph layers stayed aligned, that graph operations held up under larger loads, and that human-run playbooks across `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent` covered the new graph behaviors.

### Purpose
Document the completed verification pass that added graph integration tests, graph stress tests, graph-specific manual playbook scenarios, and README updates so the graph runtime is both testable and operator-visible.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cross-layer graph integration coverage between the CommonJS helper layer and the TypeScript MCP layer.
- Stress coverage for larger graph sizes and contradiction scanning.
- Manual playbook scenarios for graph convergence and graph-event emission in `sk-deep-research` and `sk-deep-review`.
- Manual playbook scenarios for mutation-coverage graph tracking, trade-off detection, and candidate lineage in `sk-improve-agent`.
- README updates that surface graph capabilities where they were previously missing.

### Out of Scope
- New graph features or schema changes.
- Changes to the four Phase 002 graph-tool contracts.
- Broad README rewrites outside the three affected skill surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Create | Verify relation names, weight clamping, self-loop handling, and namespace alignment across layers. |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` | Create | Exercise large-node graphs, contradiction scanning, and traversal behavior under load. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` | Create | Research playbook for graph-aware convergence. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md` | Create | Research playbook for `graphEvents` emission. |
| `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md` | Create | Review playbook for graph-aware convergence. |
| `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md` | Create | Review playbook for `graphEvents` emission. |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md` | Validate / Cross-reference | Existing improve-agent playbook for mutation-coverage graph tracking, created in Phase 005 and validated from this packet. |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md` | Validate / Cross-reference | Existing improve-agent playbook for trade-off detection, created in Phase 005 and validated from this packet. |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md` | Validate / Cross-reference | Existing improve-agent playbook for candidate-lineage tracking, created in Phase 005 and validated from this packet. |
| `.opencode/skill/sk-deep-research/README.md` | Modify | Surface graph capability coverage. |
| `.opencode/skill/sk-deep-review/README.md` | Modify | Surface graph capability coverage. |
| `.opencode/skill/sk-improve-agent/README.md` | Modify | Surface graph capability coverage. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Integration coverage must prove CommonJS and TypeScript graph contracts stay aligned. | `coverage-graph-integration.vitest.ts` verifies relation alignment, weight clamping, self-loop rejection, namespace isolation, and convergence-signal parity. |
| REQ-002 | Stress coverage must exercise larger graph workloads. | `coverage-graph-stress.vitest.ts` covers large graph construction, contradiction scanning, and traversal behavior at scale. |
| REQ-003 | Research and review playbooks must include graph-specific operator scenarios. | The four graph playbook files exist under the live `sk-deep-research` and `sk-deep-review` playbook trees. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Improve-agent playbooks must cover graph-adjacent runtime behaviors. | The three improve-agent playbook files exist under `06--end-to-end-loop/`. |
| REQ-005 | README surfaces must mention graph capability coverage where needed. | The three affected skill READMEs carry the updated graph references. |
| REQ-006 | The phase packet must satisfy the current Level 2 template contract. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` validate cleanly under `validate.sh --strict`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cross-layer graph behavior is covered by dedicated integration tests.
- **SC-002**: Large-graph and contradiction-heavy workloads are covered by stress tests.
- **SC-003**: Research, review, and improve-agent operators each have graph-related manual playbook scenarios.
- **SC-004**: The phase packet validates cleanly and records the delivered verification surface accurately.

### Acceptance Scenarios

1. **Given** a maintainer changes graph relation definitions, **when** they run the integration suite, **then** a drift between CommonJS and TypeScript surfaces is caught immediately.
2. **Given** a maintainer needs to reason about larger graph workloads, **when** they run the stress suite, **then** the graph runtime is exercised beyond small fixture sizes.
3. **Given** an operator needs to verify graph convergence by hand, **when** they open the deep-research or deep-review playbook trees, **then** they find dedicated graph convergence and graph-event scenarios.
4. **Given** an operator needs to verify improve-agent graph-adjacent behaviors, **when** they open the improve-agent playbook tree, **then** they find scenarios for mutation coverage, trade-off detection, and candidate lineage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 graph surfaces remain the source of truth. | High | Keep this phase verification-only and ground every claim in the shipped graph files. |
| Risk | Integration coverage becomes outdated as relation sets evolve. | Medium | Keep the integration suite focused on canonical relation, weight, and namespace contracts. |
| Risk | Manual playbooks drift away from live runtime behavior. | Medium | Point every playbook reference at the current live paths and keep the phase packet validation-driven. |
| Risk | Documentation closeout drifts behind the shipped verification surface. | Low | Rebuild the phase packet around the current Level 2 contract and strict validation. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The graph verification and playbook alignment work is complete, and this packet records the completed-state surface only.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Stress coverage must exercise larger graph sizes without introducing new runtime behavior.
- **NFR-P02**: Validation of this phase remains documentation-only and lightweight.

### Security
- **NFR-S01**: Playbooks and tests must reference public repo paths only.
- **NFR-S02**: No secret-bearing or environment-specific values should be added to the packet docs.

### Reliability
- **NFR-R01**: The phase packet should be enough for future maintainers to locate the shipped graph verification surfaces directly.
- **NFR-R02**: Cross-layer graph contract checks should remain discoverable from the packet without external context.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Integration coverage must account for relation-set differences that are intentional adapters rather than bugs.
- Stress coverage must handle empty or zero-state graph cases safely alongside large graph cases.

### Error Scenarios
- If a playbook path moves in a later phase, this packet must be updated or it will become misleading.
- If the CommonJS and TypeScript graph layers intentionally diverge in the future, the integration suite must be updated to reflect the new contract explicitly.

### State Transitions
- The phase remains the verification baseline for the graph runtime until a later packet supersedes it.
- If graph tools change shape in a later phase, this packet still documents the original verification surfaces delivered in Phase 006.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Cross-skill verification, playbook updates, and README alignment across three skill families. |
| Risk | 13/25 | Mostly contract-drift and coverage-drift risk rather than direct runtime-change risk. |
| Research | 8/20 | Low-to-medium because live paths and delivered surfaces are already known. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
