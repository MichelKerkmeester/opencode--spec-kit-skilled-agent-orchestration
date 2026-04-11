---
title: "Feature Specification: Further Deep-Loop Improvements [008]"
description: "Completed Level 3 child-phase packet for the Phase 008 runtime-truth, graph-wiring, reducer-surfacing, fixture, and release-closeout work across sk-deep-research, sk-deep-review, sk-improve-agent, and the shared coverage-graph stack."
trigger_phrases:
  - "008"
  - "further deep-loop improvements"
  - "graph wiring"
  - "blocked stop surfacing"
  - "sample quality"
  - "session isolation"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Further Deep-Loop Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 008 completed the runtime-truth closeout for the 042 bundle. It landed the visible contract fixes that the deep-research audit had called out: blocked-stop emission, graph-aware stop gating, reducer-owned graph and blocked-stop surfacing, fail-closed review handling, improve-agent journal wiring, sample-size enforcement, replay consumers, durable fixtures, and release packaging across all three skills.

The shipped work is traceable through the phase commits `263820da8`, `32e3c1385`, `de922e718`, `466835f7c`, `38f07e065`, `c07c9fbcf`, and `f99739742`, plus the three skill release notes:

- `.opencode/changelog/12--sk-deep-research/v1.6.0.0.md`
- `.opencode/changelog/13--sk-deep-review/v1.3.0.0.md`
- `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md`

The packet’s final closeout also records the focused closing audit in `scratch/closing-review.md` and the remediation commits that closed the remaining release-readiness findings.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-11 |
| **Completed** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 8 of 8 |
| **Predecessor** | `../007-skill-rename-improve-agent-prompt/spec.md` |
| **Successor** | None |
| **Closing Audit** | `scratch/closing-review.md` |
| **Handoff Criteria** | Runtime-truth fixes, graph integration, reducer surfacing, fixtures, release notes, and closing-audit remediation are all recorded and validated. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Phase 008 work started from a simple but high-impact gap: the repo already shipped richer stop-state, graph, and replay helpers than the visible workflows actually called. Research, review, and improve-agent all had contract drift between what their docs promised and what the live loop paths emitted, consumed, or surfaced to operators. The deep-research audit showed that the graph was often emitted but not consulted, blocked-stop payloads were dropped or flattened, and improve-agent helpers existed without being fully wired into the operator path.

### Purpose

Capture the completed remediation as a clean Level 3 child packet that shows what Phase 008 actually shipped:

- contract-truth fixes on the visible loop path
- graph upsert and convergence calls on live research and review workflows
- reducer-owned blocked-stop, graph, sample-quality, and replay surfacing
- fail-closed review hardening
- durable fixtures, new Vitest suites, and playbook scenarios
- release notes and post-audit remediation commits that closed the last release-readiness gaps
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skill/sk-deep-research/` runtime docs, reducers, fixtures, and playbooks touched by the Phase 008 release.
- `.opencode/skill/sk-deep-review/` runtime docs, reducers, fixtures, and playbooks touched by the Phase 008 release.
- `.opencode/skill/sk-improve-agent/` runtime docs, reducers, fixtures, and playbooks touched by the Phase 008 release.
- `.opencode/skill/system-spec-kit/` shared coverage-graph helpers, handlers, and tests touched by graph convergence and session isolation work.
- `.opencode/command/spec_kit/` and `.opencode/command/improve/` workflow docs and YAMLs touched by visible-path wiring.
- Phase-local closeout artifacts in `scratch/closing-review.md` and the phase packet documentation itself.

### Out of Scope

- New runtime feature design outside the already shipped Phase 008 and closing-audit remediation work.
- Any packet work after Phase 008.
- Memory-folder edits under this phase.
- Reopening the implementation itself; this pass is documentation alignment and evidence cleanup only.

### Key Delivered Surfaces

| Surface | Delivered Outcome |
|---------|-------------------|
| Research workflows | Blocked-stop emission, pause normalization, graph upsert/convergence calls, graph-facing reducer fields, fixture and playbook coverage |
| Review workflows | Same visible-path graph and blocked-stop work plus fail-closed reducer handling and repeated-finding split |
| Improve-agent | Journal wiring, sample-size gates, replay consumers, sample-quality dashboard surfacing |
| Shared graph stack | Canonical graph regime, score harmonization, and session isolation on shared reads |
| Release packaging | `v1.6.0.0`, `v1.3.0.0`, `v1.2.0.0`, plus closing-audit follow-on fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research and review must emit typed blocked-stop and normalized pause events on the visible path. | Release notes and packet evidence show blocked-stop, `userPaused`, and `stuckRecovery` wiring on research and review workflows. |
| REQ-002 | Research and review must actively consult the coverage graph during live stop evaluation. | Graph upsert and graph convergence calls are documented in the shipped research and review releases. |
| REQ-003 | Shared graph convergence must have one canonical regime. | The decision record captures the canonical graph choice and the release evidence shows the harmonized implementation. |
| REQ-004 | Shared graph reads must be session-safe. | Session isolation is documented in release evidence and backed by the dedicated isolation suite. |
| REQ-005 | Improve-agent must emit journal events from the visible workflow and fix the broken CLI example. | `v1.2.0.0` documents YAML journal wiring and the corrected `--emit` command example. |
| REQ-006 | Improve-agent must enforce minimum data and replay counts before claiming trade-off or stability verdicts. | `v1.2.0.0` documents `insufficientData` and `insufficientSample` behavior plus updated tests. |
| REQ-007 | The phase packet must satisfy the current Level 3 contract. | `validate.sh --strict` passes for this phase folder. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Reducer-owned surfaces must show blocked-stop and graph convergence state, not just raw JSONL. | Research and review release notes describe blocked-stop and graph-convergence dashboard/registry surfacing. |
| REQ-009 | Review reducer must fail loudly on malformed JSONL and missing machine-owned anchors. | `v1.3.0.0` documents `corruptionWarnings`, non-zero exit, and missing-anchor failure behavior. |
| REQ-010 | Improve-agent reducer must consume replay artifacts instead of ignoring them. | `v1.2.0.0` documents journal, lineage, and mutation-coverage replay consumers. |
| REQ-011 | The final packet must acknowledge the closing audit and the remediation that followed it. | `implementation-summary.md` and `scratch/closing-review.md` are consistent with the later fix commits. |
| REQ-012 | The final packet must use only real repo paths and current release evidence. | No spec doc integrity errors remain under strict validation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet validates strictly as a Level 3 child phase.
- **SC-002**: The packet shows that the coverage graph is actively consulted on the live research and review loop paths.
- **SC-003**: The packet shows that blocked-stop, graph-convergence, and sample-quality state are surfaced in reducer-owned outputs.
- **SC-004**: The packet traces the work through the three release notes plus the closing-audit remediation commits.
- **SC-005**: The packet no longer depends on broken shorthand references or planning-era headings.

### Acceptance Scenarios

1. **Given** a maintainer wants to confirm that graph wiring shipped, **when** they read this packet, **then** they can see the research and review releases explicitly describe `deep_loop_graph_upsert` and `deep_loop_graph_convergence` on the visible path.
2. **Given** a maintainer wants proof that blocked-stop state reaches operator-visible surfaces, **when** they inspect the packet, **then** they can see the reducer-owned dashboard and strategy surfacing described in the release evidence.
3. **Given** a maintainer wants to verify improve-agent replay consumers and sample-quality surfacing, **when** they inspect this packet, **then** they can trace them through `v1.2.0.0` and the implementation summary.
4. **Given** a release auditor wants the final state of Phase 008, **when** they inspect the packet, **then** they can see both the initial phase release and the later closing-audit remediation commits.
5. **Given** strict validation is run on this phase folder, **when** the validator checks headings, anchors, and references, **then** the packet passes with no errors.
6. **Given** a future operator needs the closing review context, **when** they open `scratch/closing-review.md`, **then** they can understand the audit that led to the final two remediation commits without hunting through git history.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The phase outcome is spread across multiple release and fix commits. | High | Use the three skill changelogs plus the two closing-audit fix commits as the canonical evidence chain. |
| Dependency | The packet relies on phase-local `scratch/closing-review.md` rather than a full `review/` tree. | Medium | Cite the phase-local review artifact directly and avoid references to non-existent review paths. |
| Risk | Old planning language can misstate the shipped reality. | Medium | Rewrite the packet around completed A-E delivery and closing-audit remediation, not around the original task plan. |
| Risk | Broken shorthand references to research, skills, or playbooks can fail validation. | Medium | Use explicit repo-relative paths for every non-packet reference. |
| Risk | Release-readiness status can be overstated if the closing audit is omitted. | Medium | Keep the closing audit and the remediation commits in the packet narrative and verification evidence. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The closeout packet remains documentation-only and does not change runtime behavior.
- **NFR-P02**: Verification evidence stays grounded in committed files, release notes, and validator output rather than ad hoc claims.

### Reliability

- **NFR-R01**: The packet must be sufficient for a future maintainer to understand the shipped Phase 008 outcome without reconstructing the entire implementation timeline manually.
- **NFR-R02**: Parent and predecessor references remain valid after packet normalization.

### Maintainability

- **NFR-M01**: The packet preserves the substantive A-E delivery story while conforming to the current Level 3 template.
- **NFR-M02**: All external references must resolve cleanly under strict validation.

---

## 8. EDGE CASES

### Release Evidence

- Phase 008 completion is not represented by a single commit. The packet therefore has to reference the release notes and the closing-audit remediation commits together.
- The closing review exists as `scratch/closing-review.md`, not under a `review/` directory, so the packet must cite the phase-local scratch artifact instead of assuming a standard review tree.

### Runtime State

- The improve-agent path uses local replay artifacts rather than joining the shared SQLite graph namespace. The packet records that delivered choice instead of implying a broader migration that did not happen.
- Review fail-closed behavior includes escape hatches (`--lenient`, `--create-missing-anchors`) for legacy packets. The closeout packet should describe them as shipped compatibility behavior, not as unimplemented future work.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Three skills, shared graph infrastructure, workflow YAMLs, reducers, fixtures, playbooks, and release packaging |
| Risk | 17/25 | Visible stop-state, graph, and reducer behavior changed across operator-facing surfaces |
| Research | 13/20 | The phase directly implemented findings from the deep-research audit and later closing audit |
| Multi-Agent | 10/15 | The original delivery split across multiple parts and later remediation passes |
| Coordination | 10/15 | Multiple release notes and closing-audit commits needed to close the packet honestly |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Graph integration is described as active, but packet references are incomplete or broken. | High | Use the three release notes and explicit phase-local evidence. |
| R-002 | Closing-audit fixes are lost during packet cleanup. | Medium | Keep `scratch/closing-review.md`, `c07c9fbcf`, and `f99739742` in the packet evidence chain. |
| R-003 | The packet preserves planning language instead of shipped reality. | Medium | Reframe the packet as completed delivery plus remediation. |
| R-004 | Validator failures recur because of shorthand references. | Medium | Use explicit repo-relative paths and current packet-local links only. |
| R-005 | Future maintainers cannot tell whether the packet was actually finished. | Low | Mark every task and checklist item complete with concrete evidence, plus include strict-validation proof. |

---

## 11. USER STORIES

- As a maintainer, I want one clean phase packet that shows what Phase 008 actually shipped so I can audit the runtime-truth changes quickly.
- As a reviewer, I want the packet to show both the initial release and the later closing-audit remediation so I can trust the release-readiness story.
- As a validator, I want the packet to follow the current Level 3 template so recursive strict validation passes cleanly.
- As a future operator, I want the packet to point me at the correct release notes, fixtures, playbooks, and closing-review artifact instead of dead shorthand paths.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for packet closeout. The implementation and the release-readiness remediation are already shipped; this pass only reconciles the phase docs to the current template and evidence chain.
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

- `../research/research.md`
- `.opencode/changelog/12--sk-deep-research/v1.6.0.0.md`
- `.opencode/changelog/13--sk-deep-review/v1.3.0.0.md`
- `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/scratch/closing-review.md`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md`
- `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md`
- `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`
