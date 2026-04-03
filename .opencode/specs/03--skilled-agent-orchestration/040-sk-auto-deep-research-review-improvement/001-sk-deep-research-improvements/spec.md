---
title: "Feature Specification: Phase 1 -- sk-deep-research Improvements [template:level_1/spec.md]"
description: "Complete the Phase 1 lineage-aware, reducer-driven runtime contract for sk-deep-research across docs, runtime mirrors, executable helpers, and verification surfaces."
trigger_phrases:
  - "deep research"
  - "lineage"
  - "reducer"
  - "runtime parity"
  - "phase 1 spec"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: Phase 1 -- sk-deep-research Improvements

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
| **Branch** | `040-sk-auto-deep-research-review-improvement` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Parent Plan** | [../plan.md](../plan.md) |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | `002-sk-deep-review-improvements/` |
| **Handoff Criteria** | Lineage schema defined, canonical naming frozen, lifecycle branches documented in both workflow assets, reducer contract established, runtime parity evidence captured, and ownership boundaries marked. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-deep-research` already uses packet files as the continuity boundary, but the workflow still drifted across runtime mirrors, lifecycle naming, and reducer ownership. The phase packet also lacked template-compliant structure, which blocked strict spec validation even after runtime-facing edits landed.

### Purpose
Make Phase 1 the durable contract for research lineage, reducer-owned state, and runtime parity so later deep-review work inherits a stable packet model instead of ambiguous conventions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Align the `sk-deep-research` skill, references, assets, and runtime mirrors to the lineage and reducer contract defined by the parent research packet.
- Update the auto and confirm deep-research workflow YAML assets so lifecycle modes, migration handling, registry ownership, and parity expectations are explicit.
- Add the executable reducer and capability-resolver surfaces needed to make the contract machine-verifiable instead of documentation-only.
- Bring this phase packet back into Level 1 template compliance so strict validation can reason about the work accurately.

### Out of Scope
- Changes to `sk-deep-review` or sibling review-mode packets. Phase 2 owns those follow-on surfaces.
- Broader install-guide or changelog sweeps beyond what is necessary to document this phase packet truthfully.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Freeze research-only contract, lifecycle vocabulary, and reducer ownership rules |
| `.opencode/skill/sk-deep-research/README.md` | Modify | Replace stale mixed-mode guidance with research-only, parity-aware documentation |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Define lineage schema, event fields, reducer contract, and ownership boundaries |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document lifecycle branches, reducer sequencing, and hook/non-hook equivalence |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Tie convergence output to reducer-owned metrics |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Modify | Reflect registry, lifecycle modes, and reducer-aware iteration flow |
| `.opencode/skill/sk-deep-research/references/capability_matrix.md` | Create | Capture runtime parity and allowed provider-specific adaptations |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add lineage, reducer, registry, archive, and migration metadata |
| `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json` | Create | Publish the machine-readable runtime capability matrix |
| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Modify | Reflect reducer-owned dashboard metrics and lifecycle state |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Mark machine-owned sections and reducer boundaries |
| `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs` | Create | Resolve runtime capability records from the machine-readable matrix |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Create | Reduce JSONL and iteration artifacts into registry, strategy, and dashboard outputs |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Carry lineage, migration, registry, reducer, and completed-continue contract details |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Mirror the same contract for confirm mode |
| `.opencode/agent/deep-research.md` | Modify | Keep OpenCode mirror aligned to reducer-owned state and registry inputs |
| `.claude/agents/deep-research.md` | Modify | Keep Claude mirror aligned to the same contract |
| `.gemini/agents/deep-research.md` | Modify | Keep Gemini mirror aligned to the same contract |
| `.codex/agents/deep-research.toml` | Modify | Keep Codex mirror aligned to the same contract |
| `.agents/agents/deep-research.md` | Modify | Keep the compatibility wrapper aligned to the same contract |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Create | Enforce contract parity across docs, runtime mirrors, and command assets |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Create | Prove reducer idempotency and packet-integrity behavior |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md` | Modify | Align DR-008 scenario wording with reducer-owned refresh behavior |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md` | Modify | Align the concrete iteration playbook scenario with the reducer contract |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` in this phase packet | Modify | Restore strict template compliance and accurate completion tracking |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define and propagate a canonical lineage contract for deep-research packet state. | [../../../../skill/sk-deep-research/references/state_format.md](../../../../skill/sk-deep-research/references/state_format.md), [../../../../skill/sk-deep-research/references/loop_protocol.md](../../../../skill/sk-deep-research/references/loop_protocol.md), the config asset, and both YAML assets all use `sessionId`, `parentSessionId`, `lineageMode`, `generation`, and `continuedFromRun`. |
| REQ-002 | Freeze canonical research artifact naming and the pause sentinel. | Skill docs, references, assets, runtime mirrors, and both YAML assets consistently use `deep-research-*`, `findings-registry.json`, and `research/.deep-research-pause`; migration handling is documented for legacy names. |
| REQ-003 | Establish reducer-owned packet surfaces and runtime parity expectations. | Strategy/dashboard/registry ownership is documented, runtime mirrors read registry as input, and [../../../../skill/sk-deep-research/references/capability_matrix.md](../../../../skill/sk-deep-research/references/capability_matrix.md) defines invariant parity rules. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bring the named phase packet back into strict Spec Kit template compliance. | `spec.md`, `plan.md`, and `tasks.md` pass `validate.sh --strict` structural checks for anchors, headers, and template markers. |
| REQ-005 | Close the previously deferred executable gaps for reducer verification and portability lookup. | Reducer and runtime-capability helper scripts land in `sk-deep-research/scripts/`, focused Vitest coverage passes, and command/runtime docs point to the live `.cjs` helper surfaces. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All edited deep-research reference, asset, and runtime files parse or validate cleanly with targeted checks.
- **SC-002**: The phase packet validates structurally under `validate.sh --strict`.
- **SC-003**: The packet truthfully records Phase 1 as fully complete, with no remaining reducer-test or portability deferrals inside this phase.

### Acceptance Scenarios
1. **Given** a maintainer opens the deep-research skill surfaces after this phase, **when** they trace lifecycle state from the config asset through the workflow YAML and runtime mirrors, **then** the lineage keys, registry ownership, and canonical artifact names stay consistent.
2. **Given** a maintainer opens this phase packet during a later follow-on pass, **when** they read `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`, **then** they see a fully completed Phase 1 packet with executable reducer and parity verification evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [../research/recommendations-sk-deep-research.md](../research/recommendations-sk-deep-research.md) | Parent recommendations define the intended Phase 1 contract | Keep this phase packet tied to the parent research findings and preserve the same terminology |
| Risk | Helper scripts live under `.opencode/skill/sk-deep-research/scripts/` inside an ESM package boundary | CommonJS helpers can fail if their extension does not match package loading rules | Use `.cjs` helpers and prove them through direct CLI execution plus Vitest |
| Risk | Runtime YAML assets are declarative workflow contracts, not a conventional application code path | "Operational" behavior may remain partly contract-driven | Keep lifecycle and reducer expectations synchronized across docs, assets, and mirrors, then validate the reachable surfaces directly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions block Phase 1 completion. Phase 2 may build on these surfaces, but this packet no longer carries unresolved completion debt.
<!-- /ANCHOR:questions -->

---
