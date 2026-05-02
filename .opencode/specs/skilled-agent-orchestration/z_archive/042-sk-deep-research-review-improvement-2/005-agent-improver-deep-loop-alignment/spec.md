---
title: "Feat [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec]"
description: "Completed Level 3 phase packet for the deep-loop runtime-truth alignment that introduced journal wiring, mutation coverage, trade-off detection, candidate lineage, and benchmark stability for the skill now published as sk-improve-agent."
trigger_phrases:
  - "005"
  - "agent improver"
  - "sk-improve-agent"
  - "deep loop alignment"
  - "mutation coverage"
  - "benchmark stability"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 005 completed the runtime-truth alignment for the improve-agent skill family. The delivered work added an append-only audit journal, an improvement-scoped mutation coverage graph, dimension trade-off detection, candidate lineage tracking for optional parallel waves, and benchmark stability scoring so the improver loop could behave like the deeper research and review loops instead of remaining an isolated evaluator.

The implementation landed in commit `080cf549e` and shipped in `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md`. Phase 007 later renamed the live skill surface from `sk-agent-improver` to `sk-improve-agent`, so this closeout packet now points at the current runtime paths while preserving the historical phase slug.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-10 |
| **Completed** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 5 of 8 |
| **Predecessor** | `../004-offline-loop-optimizer/spec.md` |
| **Successor** | `../006-graph-testing-and-playbook-alignment/spec.md` |
| **Runtime Target** | `.opencode/skill/sk-improve-agent/` |
| **Historical Note** | The phase slug keeps `agent-improver`, but the active runtime surface was renamed to `sk-improve-agent` in Phase 007. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Before this phase shipped, the improve-agent loop had strong evaluator logic but weak runtime truth. It lacked a dedicated audit journal, had no improvement-scoped coverage graph, could not detect cross-dimension trade-offs, had no candidate-lineage model for parallel exploration, and could not measure benchmark replay stability. That left the loop harder to audit, less explainable, and less aligned with the runtime-truth contracts already established for `sk-deep-research` and `sk-deep-review`.

### Purpose

Record the delivered alignment work as a completed Level 3 packet so the spec accurately reflects what landed:

- append-only journal wiring through `improvement-journal.cjs`
- coverage tracking through `mutation-coverage.cjs`
- trade-off analysis through `trade-off-detector.cjs`
- optional parallel-wave lineage through `candidate-lineage.cjs`
- stability and advisory optimizer support through `benchmark-stability.cjs`

This closeout packet also avoids reintroducing stale static-profile wording. The current packet describes the shipped runtime in current `sk-improve-agent` terms and uses dynamic target-family language rather than freezing older `context-prime` or static `handover` examples as the canonical contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Document the delivered journal, coverage, trade-off, lineage, and stability runtime surfaces now living under `.opencode/skill/sk-improve-agent/`.
- Document the delivered command and runtime-agent updates for `.opencode/command/improve/agent.md` and `.opencode/agent/improve-agent.md`.
- Record the shipped verification surfaces: 5 dedicated Vitest suites, playbook scenarios, changelog evidence, and implementation commit.
- Bring the phase packet into current Level 3 template alignment with completed-state metadata, evidence-backed tasks, and verification checklist items.

### Out of Scope

- Changing the shipped improve-agent runtime behavior.
- Reopening the later lifecycle-contract retraction captured in `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md`.
- Updating current repo files outside this phase folder.
- Renaming the historical phase slug.

### Files Delivered by the Phase

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Created | Append-only improvement-session journal with validated event types. |
| `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` | Created | Improvement-scoped coverage graph and exhausted-mutation tracking. |
| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Created | Pareto-aware cross-dimension trade-off detection. |
| `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs` | Created | Directed lineage graph for optional parallel candidates. |
| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` | Created | Replay stability scoring and advisory optimizer support. |
| `.opencode/skill/sk-improve-agent/scripts/tests/*.vitest.ts` | Created | Dedicated tests for each new runtime-truth helper. |
| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Modified | Added journal, coverage, trajectory, parallel-wave, and optimizer settings. |
| `.opencode/skill/sk-improve-agent/assets/improvement_charter.md` | Modified | Added audit-trail and legal-stop obligations. |
| `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md` | Modified | Added convergence, trade-off, and exhaustion guidance. |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modified | Published the runtime-truth contract for improve-agent. |
| `.opencode/agent/improve-agent.md` | Modified | Kept journaling orchestrator-side and aligned the runtime mirror. |
| `.opencode/command/improve/agent.md` | Modified | Documented journal emission, stop-state reporting, and runtime-truth workflow steps. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The phase must add a dedicated audit journal for improve-agent sessions. | `improvement-journal.cjs` exists and the release notes describe orchestrator-owned journal emission. |
| REQ-002 | The phase must add improvement-scoped mutation coverage tracking. | `mutation-coverage.cjs` exists and uses the improvement loop namespace described in the release evidence. |
| REQ-003 | The phase must add dimension-aware trade-off detection. | `trade-off-detector.cjs` exists and shipped with dedicated test coverage. |
| REQ-004 | The phase must add candidate-lineage tracking for optional parallel exploration. | `candidate-lineage.cjs` exists, with supporting tests and playbook coverage. |
| REQ-005 | The phase must add benchmark stability measurement for replay quality. | `benchmark-stability.cjs` exists and is referenced in changelog and test evidence. |
| REQ-006 | The phase packet must reflect the current runtime surface names. | Phase documentation points to `.opencode/skill/sk-improve-agent/` and `.opencode/agent/improve-agent.md`, not missing `agent-improver` runtime paths. |
| REQ-007 | The phase packet must satisfy the current Level 3 contract. | `validate.sh --strict` passes for this phase folder with all required headings, anchors, and template markers present. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The packet must preserve the five architectural decisions from the original phase. | `decision-record.md` captures journal ownership, graph reuse, trajectory gating, opt-in parallel waves, and backward-compatible config defaults. |
| REQ-009 | Verification evidence must show the work landed, not just that files exist. | Tasks and checklist entries cite commit `080cf549e`, changelog `v1.1.0.0`, post-release note `v1.2.1.0`, or concrete repo paths. |
| REQ-010 | The packet must use current dynamic-mode language. | The packet avoids presenting `context-prime` or static `handover` profiles as the live canonical contract. |
| REQ-011 | The packet must record follow-on reality where later releases narrowed unsupported lifecycle promises. | `implementation-summary.md` and `decision-record.md` mention the later `v1.2.1.0` retraction so this packet does not re-freeze superseded lifecycle wording. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase packet validates strictly as a Level 3 child phase.
- **SC-002**: The packet records the five delivered runtime-truth helpers and their live `sk-improve-agent` paths.
- **SC-003**: The packet shows evidence for the landing commit, release note, playbook additions, and dedicated test surfaces.
- **SC-004**: The packet preserves the important design choices without reintroducing stale static-profile or unsupported lifecycle claims.
- **SC-005**: Parent and successor cross-links resolve cleanly for downstream packet navigation.

### Acceptance Scenarios

1. **Given** a maintainer opens Phase 005 to understand the improve-agent runtime-truth work, **when** they inspect the packet, **then** they see the current `sk-improve-agent` paths, the shipped helper files, and the release evidence in one place.
2. **Given** a validator checks this phase, **when** strict validation runs, **then** the packet satisfies the Level 3 template with no blocking integrity errors.
3. **Given** a reader needs the architectural rationale, **when** they open `decision-record.md`, **then** they can see why journal writes stayed in the orchestrator, why coverage graph reuse was chosen, and how backward compatibility was protected.
4. **Given** a future audit compares phase docs against current runtime naming, **when** it reads this packet, **then** it is not sent to retired runtime-mirror paths or static-profile wording that no longer represents the live surface.
5. **Given** a release auditor wants proof that the phase shipped, **when** they inspect the packet, **then** they can trace the delivery through commit `080cf549e`, `v1.1.0.0`, and the live helper files.
6. **Given** a maintainer checks whether later packet work changed the Phase 005 story, **when** they read this packet, **then** they can see that Phase 007 renamed live surfaces and `v1.2.1.0` narrowed unsupported lifecycle wording without undoing the runtime delivery.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Commit `080cf549e` is the primary landing point for the phase. | High | Cite the commit directly and tie closeout evidence to live repo paths plus `v1.1.0.0`. |
| Dependency | Phase 007 renamed the active runtime surfaces after Phase 005 landed. | Medium | Preserve historical context in prose, but point all live references at `sk-improve-agent` and `.opencode/agent/improve-agent.md`. |
| Risk | Packet docs can accidentally reintroduce the retired `agent-improver` runtime path. | Medium | Use only live runtime paths in specs, tasks, checklist, and implementation summary. |
| Risk | Packet docs can freeze unsupported lifecycle wording that `v1.2.1.0` later retracted. | Medium | Explicitly note that the later patch release narrowed the lifecycle surface and keep this packet aligned to current reality. |
| Risk | Static-profile examples from older improve-agent docs could be copied forward as canon. | Low | Use dynamic target-family wording and cite current `supportedProfiles: []` state in the active config. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The packet remains documentation-only and does not introduce runtime changes.
- **NFR-P02**: Verification remains file-, commit-, changelog-, and validator-driven so packet closeout stays fast and auditable.

### Reliability

- **NFR-R01**: The packet must be sufficient for future maintainers to locate the shipped helper files and release evidence without reconstructing repo history.
- **NFR-R02**: Cross-links to parent and successor phases must remain valid after strict validation.

### Maintainability

- **NFR-M01**: The packet must preserve substantive phase content while normalizing it to the current Level 3 template.
- **NFR-M02**: The packet must avoid stale terminology that no longer matches current improve-agent naming and dynamic-mode positioning.
---

## 8. EDGE CASES

### Historical Naming

- The phase slug still says `agent-improver`, but the active skill and runtime files are now `sk-improve-agent` and `.opencode/agent/improve-agent.md`.
- The landing commit created files under the pre-rename skill path; Phase 007 later renamed those runtime surfaces without invalidating the phase outcome.

### Lifecycle Drift

- `v1.1.0.0` documented broader lifecycle semantics that `v1.2.1.0` later retracted. The packet must not present those superseded lifecycle modes as current runtime truth.

### Verification Drift

- A file can exist without proving the phase shipped correctly. This packet treats file existence as supporting evidence and relies on commit/release evidence for closure, not on filename checks alone.
---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 5 new runtime helpers, 5 dedicated test files, multiple asset and command updates. |
| Risk | 15/25 | Runtime-truth changes touched promotion, journaling, coverage, and benchmark evaluation. |
| Research | 12/20 | The phase adapted patterns from earlier 042 work and introduced improve-agent-specific decisions. |
| Multi-Agent | 9/15 | Orchestrator-owned journaling and optional parallel candidates created coordination complexity. |
| Coordination | 9/15 | Later rename and lifecycle retraction required careful closeout wording. |
| **Total** | **63/100** | **Level 3** |
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Packet points to retired `agent-improver` runtime paths. | High | All live references now target `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`. |
| R-002 | Packet repeats unsupported multi-session lifecycle promises. | Medium | Current packet cites the `v1.2.1.0` retraction and avoids freezing superseded wording. |
| R-003 | Architectural rationale is lost during template cleanup. | Medium | `decision-record.md` consolidates the five accepted phase decisions with rationale and consequences. |
| R-004 | Phase evidence appears weak because the packet only cites files. | Medium | Tasks and checklist items cite commit `080cf549e`, `v1.1.0.0`, current file paths, and strict validation. |
| R-005 | Parent packet navigation breaks. | Low | Parent and successor links use explicit relative spec paths. |
---

## 11. USER STORIES

- As a maintainer, I want a single packet that shows what Phase 005 actually delivered so I can audit improve-agent runtime-truth work without replaying git history.
- As a validator, I want the phase packet to follow the current Level 3 contract so recursive strict validation passes cleanly.
- As a future closeout editor, I want the packet to use current runtime names so I do not get sent to retired improve-agent runtime paths.
- As a release auditor, I want commit and changelog evidence embedded in the packet so completed-state checklist items are traceable.
---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for packet closeout. The delivered runtime work is already shipped; this phase only needed documentation alignment to current template and naming reality.
<!-- /ANCHOR:questions -->

---

---

## 13. RELATED DOCUMENTS

- `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md`
- `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md`
- `.opencode/skill/sk-improve-agent/SKILL.md`
- `.opencode/skill/sk-improve-agent/assets/improvement_config.json`
- `.opencode/skill/sk-improve-agent/assets/improvement_charter.md`
- `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md`
- `.opencode/skill/sk-improve-agent/references/loop_protocol.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/026-audit-journal-emission.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuation.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/029-benchmark-stability.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md`
