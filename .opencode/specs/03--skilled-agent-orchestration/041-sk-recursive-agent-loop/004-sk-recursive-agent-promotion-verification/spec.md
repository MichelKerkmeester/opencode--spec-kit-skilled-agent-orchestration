---
title: "Feature Specification: Recursive Agent Promotion Verification [template:level_2/spec.md]"
description: "Phase 004 under packet 041 proves the guarded promotion path for handover, adds context-prime repeatability evidence, and records the no-net-drift rollback result."
trigger_phrases:
  - "recursive agent promotion verification"
  - "041 phase 004"
  - "context-prime repeatability"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Recursive Agent Promotion Verification

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
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [../003-sk-agent-improver-doc-alignment/](../003-sk-agent-improver-doc-alignment/) |
| **Successor** | [../005-sk-agent-improver-package-runtime-alignment/](../005-sk-agent-improver-package-runtime-alignment/) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase `003`, the agent-improver package and packet hierarchy were clean, but two important proof points were still missing: a successful guarded promotion path for the canonical handover target, and explicit repeatability evidence for the second target `context-prime`. Without those artifacts, the system said promotion was guarded, but it had not yet shown the full success path end to end in a child phase under `041`.

### Purpose
Create a verification-focused phase that proves a real `candidate-better` handover promotion can pass through the guardrails, validates the promoted target, rolls it back to the exact pre-promotion backup, and adds the missing `context-prime` repeatability artifact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Guarded promotion-path verification for `.opencode/agent/handover.md`
- A packet-local improved handover candidate used only for verification
- Repeatability evidence for both `handover` and `context-prime`
- A small scorer calibration so a structurally better handover candidate can beat the current baseline
- Parent packet `041` docs and registry metadata needed to record phase `004`

### Out of Scope
- Shipping the promoted handover candidate as the new canonical file
- Expanding promotion eligibility beyond the canonical handover target
- Broadening target families beyond `handover` and `context-prime`

### Files to Change
- `.opencode/skill/sk-agent-improver/scripts/score-candidate.cjs`
- `.opencode/skill/sk-agent-improver/references/evaluator_contract.md`
- `.opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/004-sk-agent-improver-promotion-verification/`
- `.opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/`
- `.opencode/specs/descriptions.json`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Handover promotion success path is proven | A packet-local score report returns `candidate-better`, benchmark and repeatability reports pass, and promotion emits a `promoted` artifact |
| REQ-002 | Promotion is followed by rollback proof | Rollback emits a `rolled_back` artifact and the restored canonical file matches the pre-promotion backup |
| REQ-003 | Promoted handover candidate is structurally valid | The promoted canonical handover file passes `validate_document.py --type agent` before rollback |
| REQ-004 | `context-prime` repeatability is explicit | Two `context-prime` benchmark runs plus a `repeatability.json` artifact exist and pass |
| REQ-005 | Phase evidence remains packet-local | All verification artifacts for this phase live under the phase `004` improvement folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Scorer calibration is documented and bounded | The handover scorer change is small, explicit, and reflected in the evaluator contract |
| REQ-007 | Parent packet records phase `004` | Root `041` docs list phase `004` and report `4 of 4 complete` |
| REQ-008 | Root `041` and phase `004` pass strict validation | `validate.sh --strict` passes for both |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase `004` contains a winning handover score file, promotion artifact, rollback artifact, and promoted-target validation log.
- **SC-002**: Phase `004` contains repeatability reports for both `handover` and `context-prime`.
- **SC-003**: The canonical handover file matches its backup after rollback, so the phase leaves no net mutation behind.
- **SC-004**: Root packet `041` clearly shows four completed phases and pushes future work to `005-*`.

### Acceptance Scenarios
1. **Given** the phase `004` improvement runtime, **when** a maintainer inspects the handover evidence, **then** they can see `candidate-better`, `promoted`, and `rolled_back` artifacts in one place.
2. **Given** the phase `004` improvement runtime, **when** a maintainer inspects the second-target evidence, **then** they can see repeatability for `context-prime`, not just a single passing run.
3. **Given** a maintainer opens root packet `041`, **when** they inspect the phase map and implementation summary, **then** phase `004` appears as the promotion-verification closeout step.
4. **Given** strict validation is re-run, **when** packet docs and references are synchronized, **then** root `041` and phase `004` both pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `promote-candidate.cjs` and `rollback-candidate.cjs` | They define the guarded path under test | Use the shipped scripts and save packet-local evidence from their outputs |
| Dependency | Current handover benchmark fixtures | They provide stable benchmark evidence for the promotion gate | Re-run them in the phase-local runtime and record repeatability |
| Risk | Promotion proof could leave accidental canonical drift | High | Roll back immediately and compare the restored file directly to the backup |
| Risk | A scorer tweak could become over-broad | Medium | Keep the calibration narrow and limited to explicit handover structure checks |
| Risk | `context-prime` still lacks rollout proof beyond repeatability | Low | Keep `context-prime` candidate-only and document that limitation explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This phase exists to close specific verification gaps with explicit artifacts.
<!-- /ANCHOR:questions -->

---
