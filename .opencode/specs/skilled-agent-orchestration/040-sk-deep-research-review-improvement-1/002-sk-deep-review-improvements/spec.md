---
title: "Feature Specification: Phase 2 -- sk-deep-review Improvements [template:level_1/spec.md]"
description: "Bring sk-deep-review to the same lineage-aware, reducer-driven contract as Phase 1 by removing review-mode naming drift, aligning lifecycle semantics across workflows and runtime mirrors, and closing the packet with strict Spec Kit validation."
trigger_phrases:
  - "deep review"
  - "phase 2 spec"
  - "review lineage"
  - "review reducer"
  - "runtime parity"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: Phase 2 -- sk-deep-review Improvements

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `040-sk-deep-research-review-improvement-1` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Parent Plan** | [../plan.md](../plan.md) |
| **Phase** | 2 of 2 |
| **Predecessor** | [001-sk-deep-research-improvements/](../001-sk-deep-research-improvements/) |
| **Successor** | None |
| **Handoff Criteria** | Canonical review naming is frozen, lifecycle branches are documented across both workflows, reducer and registry surfaces are explicit, runtime mirrors are in parity, packet tasks are complete, and strict packet validation passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-deep-review` still described review mode with mixed `deep-review-*` and `deep-research-*` artifact names, partial lifecycle semantics, and uneven runtime-mirror coverage even after Phase 1 established the lineage and reducer model. The phase packet itself also lacked Level 1 template structure, which meant the implementation could land while the named spec folder still failed strict validation and could not be truthfully closed out.

### Purpose
Make Phase 2 the durable review-mode contract by aligning docs, assets, workflow YAML, runtime mirrors, manual testing playbook surfaces, and packet closeout evidence around one canonical deep-review packet model.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Align `sk-deep-review` docs, references, assets, runtime mirrors, and workflow YAML to canonical `deep-review-*` review-mode artifacts and `.deep-review-pause`.
- Document and verify lineage-aware lifecycle handling, reducer-owned findings registry semantics, release-readiness states, and machine-owned boundary markers.
- Restore this phase packet to the active Level 1 template and record verification evidence for full closeout.

### Out of Scope
- Changes to `sk-deep-research` beyond Phase 1 inheritance points. That work belongs to [001-sk-deep-research-improvements](../001-sk-deep-research-improvements/).
- New command-engine runtime code outside the named review target surfaces. This phase stays inside the review contract, workflow assets, mirrors, packet docs, and packet-local tests.
- Broader changelog or install-guide work outside the named review packet surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [../../../../skill/sk-deep-review/SKILL.md](../../../../skill/sk-deep-review/SKILL.md) | Modify | Freeze lifecycle, reducer, release-readiness, and runtime-parity guidance |
| [../../../../skill/sk-deep-review/README.md](../../../../skill/sk-deep-review/README.md) | Modify | Publish canonical review packet names, lifecycle modes, and operator guidance |
| [../../../../skill/sk-deep-review/references/state_format.md](../../../../skill/sk-deep-review/references/state_format.md) | Modify | Define review packet schemas, lineage fields, registry outputs, and report boundaries |
| [../../../../skill/sk-deep-review/references/loop_protocol.md](../../../../skill/sk-deep-review/references/loop_protocol.md) | Modify | Document lifecycle branches, reducer sequencing, pause handling, and synthesis expectations |
| [../../../../skill/sk-deep-review/references/convergence.md](../../../../skill/sk-deep-review/references/convergence.md) | Modify | Tie convergence output to release-readiness states |
| [../../../../skill/sk-deep-review/references/quick_reference.md](../../../../skill/sk-deep-review/references/quick_reference.md) | Modify | Publish canonical state files, lifecycle modes, and readiness terminology |
| [../../../../skill/sk-deep-review/assets/deep_review_config.json](../../../../skill/sk-deep-review/assets/deep_review_config.json) | Modify | Add lineage, reducer, file-protection, and release-readiness metadata |
| [../../../../skill/sk-deep-review/assets/deep_review_strategy.md](../../../../skill/sk-deep-review/assets/deep_review_strategy.md) | Modify | Mark reducer-owned sections and review boundaries |
| [../../../../skill/sk-deep-review/assets/deep_review_dashboard.md](../../../../skill/sk-deep-review/assets/deep_review_dashboard.md) | Modify | Carry machine-owned metrics and readiness data |
| [../../../../skill/sk-deep-review/assets/review_mode_contract.yaml](../../../../skill/sk-deep-review/assets/review_mode_contract.yaml) | Modify | Establish the canonical review-mode contract, reducer outputs, and output paths |
| [../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml) | Modify | Carry migration logic, lifecycle branches, reducer refresh, and synthesis guidance |
| [../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml) | Modify | Mirror the same contract for confirm mode |
| [../../../../agent/deep-review.md](../../../../agent/deep-review.md), [../../../../../../.claude/agents/deep-review.md](../../../../../../.claude/agents/deep-review.md), [../../../../../../.gemini/agents/deep-review.md](../../../../../../.gemini/agents/deep-review.md), [../../../../../../.codex/agents/deep-review.toml](../../../../../../.codex/agents/deep-review.toml) | Modify | Keep all runtime mirrors aligned to the same review packet contract |
| [../../../../skill/sk-deep-review/manual_testing_playbook/](../../../../skill/sk-deep-review/manual_testing_playbook/) | Modify | Remove stale review-mode `deep-research-*` references from operator scenarios |
| [../../../../skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts](../../../../skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts) and [../../../../skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts](../../../../skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts) | Create | Lock parity, reducer, lifecycle, and severity contracts with executable checks |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` in this phase packet | Modify/Create | Restore Level 1 template compliance and capture verified completion evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Freeze canonical review-mode artifact naming and migration behavior. | Review docs, assets, workflow YAML, runtime mirrors, and manual testing playbook surfaces use `deep-review-*` artifacts and `.deep-review-pause`, while legacy `deep-research-*` mentions remain only in the deliberate scratch migration path inside the two workflow assets. |
| REQ-002 | Propagate lineage, lifecycle, reducer, and release-readiness semantics across all active review surfaces. | [../../../../skill/sk-deep-review/assets/review_mode_contract.yaml](../../../../skill/sk-deep-review/assets/review_mode_contract.yaml), the two workflow YAML assets, [../../../../skill/sk-deep-review/SKILL.md](../../../../skill/sk-deep-review/SKILL.md), [../../../../skill/sk-deep-review/README.md](../../../../skill/sk-deep-review/README.md), and all four runtime mirrors agree on `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`, reducer-owned findings registry behavior, and `completed-continue`. |
| REQ-003 | Close the phase packet with executable verification evidence. | Packet docs are Level 1 template compliant, every task is marked complete, [implementation-summary.md](./implementation-summary.md) records the verification commands and outcomes, and strict packet validation passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add executable parity, reducer, and severity-schema checks for the review contract. | The two new Vitest files under [../../../../skill/system-spec-kit/scripts/tests/](../../../../skill/system-spec-kit/scripts/tests/) pass and cover canonical state names, lifecycle modes, reducer inputs/outputs, release-readiness states, and stable `P0`/`P1`/`P2` schema expectations. |
| REQ-005 | Make packet-local operator guidance truthful after implementation. | The packet summary and task tracking do not claim missing checklist surfaces, do not overstate out-of-scope runtime code, and record the packet as complete within the named review-contract scope. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/002-sk-deep-review-improvements --strict` passes.
- **SC-002**: The deep-review contract and reducer/schema Vitest files pass against the live workspace surfaces.
- **SC-003**: Packet docs, implementation summary, and task tracking all show the phase as complete with no remaining unchecked tasks.

### Acceptance Scenarios
1. **Given** a maintainer opens the deep-review skill package after this phase, **when** they trace packet state from the config asset through the workflow YAML and runtime mirrors, **then** they see one canonical `deep-review-*` review packet contract with explicit lifecycle and reducer semantics.
2. **Given** a maintainer opens this phase packet later, **when** they read [spec.md](./spec.md), [plan.md](./plan.md), [tasks.md](./tasks.md), and [implementation-summary.md](./implementation-summary.md), **then** they can verify that the packet is complete, validated, and backed by executable evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [../research/recommendations-sk-deep-review.md](../research/recommendations-sk-deep-review.md) | Parent research terminology and acceptance goals would drift if this phase diverged from the recommendations | Keep packet wording and lifecycle expectations tied to the parent research artifacts |
| Dependency | Existing runtime mirrors and workflow assets under `.opencode/`, `.claude/`, `.gemini/`, and `.codex/` | Runtime parity cannot be proven if a mirror is skipped | Validate all four mirrors and keep parity under test |
| Risk | Declarative workflow assets express behavior contractually rather than through a single reducer implementation file | Some guarantees are enforced by cross-surface contract rather than by one executable module | Back the contract with focused parity and reducer-schema tests, then record those results in the implementation summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None identified within the current phase scope.
<!-- /ANCHOR:questions -->

---
