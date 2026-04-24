---
title: "Implementation Plan: Non-System Playbook Prompt Modernization"
description: "This implementation plan captures Non-System Playbook Prompt Modernization for non system playbook prompts."
trigger_phrases:
  - "non system playbook prompts"
  - "skilled agent orchestration"
  - "non system playbook prompt modernization"
  - "non system playbook prompts plan"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/044-non-system-playbook-prompts"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: Non-System Playbook Prompt [skilled-agent-orchestration/044-non-system-playbook-prompts/plan]"
description: "Execute a target-by-target documentation rewrite that modernizes prompt wording across 126 non-system manual testing playbook files while preserving file topology and scenario truth."
trigger_phrases:
  - "playbook prompt modernization plan"
  - "non-system playbook rewrite plan"
  - "manual testing prompt rewrite plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/044-non-system-playbook-prompts"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined Level 2 execution plan for the prompt rewrite batch"
    next_safe_action: "Implement target-by-target prompt modernization with parity checks after each batch"
    blockers: []
    key_files:
      - ".opencode/skill/mcp-coco-index/manual_testing_playbook/"
      - ".opencode/skill/sk-improve-agent/manual_testing_playbook/"
      - ".opencode/skill/sk-deep-research/manual_testing_playbook/"
      - ".opencode/skill/sk-deep-review/manual_testing_playbook/"
      - ".opencode/skill/sk-doc/assets/documentation/testing_playbook/"
    session_dedup:
      fingerprint: "sha256:044-plan-non-system-playbook-prompts"
      session_id: "044-plan-non-system-playbook-prompts"
      parent_session_id: "044-non-system-playbook-prompts"
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Work proceeds by documentation target, not by cross-repo search-and-replace, to preserve local wording truth."
---
# Implementation Plan: Non-System Playbook Prompt Modernization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit Level 2 packet + `sk-doc` testing playbook templates |
| **Storage** | Git-tracked docs only |
| **Testing** | Spec validation, file-count parity checks, prompt-contract sweeps, manual spot checks |

### Overview
This work modernizes prompt wording and scenario-contract prose across 126 non-system manual testing playbook files. The approach is to align the five scoped targets to one shared prompt contract while preserving scenario IDs, filenames, command sequences, and live-source truth.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [Spec: spec.md §§2-6]
- [x] Success criteria measurable [Spec: spec.md §5]
- [x] Dependencies identified [Spec: spec.md §6]

### Definition of Done
- [ ] All acceptance criteria met [Spec: spec.md §4]
- [ ] Rewrite completed only inside the five scoped targets [Scope Sweep: target-only diff review]
- [ ] Prompt-contract parity verified across templates, root playbooks, and scenario files [Audit: rg-based prompt-contract sweep]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-driven documentation batch rewrite

### Key Components
- **`sk-doc` testing playbook templates**: Define the canonical modernization contract future playbooks should inherit.
- **Target root playbooks**: Carry package-level guidance, coverage notes, and scenario indexes that must reflect the updated prompt style.
- **Per-scenario markdown files**: Hold the bulk of the rewrite and must preserve each published scenario identity while improving prompt clarity.

### Data Flow
Start from the `sk-doc` template contract and newer rich-style playbooks, then inventory the five scoped targets. Rewrite one target at a time so the root playbook and its scenario files stay aligned, then run parity checks across the whole batch before closing the workstream.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 126-file inventory across the five scoped targets
- [ ] Define the shared modernization checklist for prompt wording, expected process, evidence, and user-facing outcome language
- [ ] Identify which files already match the richer style and which need heavier rewrite work

### Phase 2: Core Implementation
- [ ] Update the two `sk-doc` testing playbook template assets first
- [ ] Rewrite each target root playbook so package-level guidance reflects the same contract
- [ ] Rewrite per-scenario files target by target: `mcp-coco-index`, `sk-improve-agent`, `sk-deep-research`, and `sk-deep-review`

### Phase 3: Verification
- [ ] Re-run file-count parity checks to confirm no scenario inventory drift
- [ ] Spot-check destructive, recovery, and orchestration-heavy scenarios in every target
- [ ] Review the final diff to confirm nothing outside the five scoped targets changed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A for this documentation-only rewrite | N/A |
| Integration | Cross-target prompt-contract parity and path preservation | `rg`, directory inventories, git diff |
| Manual | Root playbook spot checks plus representative scenario-file review in each target | Read-through + targeted shell checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-doc/assets/documentation/testing_playbook/` | Internal | Green | Without template alignment, future playbooks will regress to older wording |
| Existing playbook roots and scenario files in the four skill targets | Internal | Green | Without stable source docs, wording cannot be modernized safely |
| Rich-style reference patterns already present in newer non-system playbooks | Internal | Green | Provide the target wording model for older packages |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Prompt updates introduce wording drift, broken path references, or scope escapes outside the five allowed targets.
- **Procedure**: Revert the affected documentation-only commits for the impacted target batch, then re-run target inventory and parity checks before attempting a smaller corrective pass.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Inventory + contract) ──► Phase 2 (Rewrite by target) ──► Phase 3 (Parity + spot checks)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory + contract | None | All target rewrites |
| Template + root alignment | Inventory + contract | Scenario rewrites |
| Scenario rewrites | Template + root alignment | Final verification |
| Final verification | Scenario rewrites | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 6-10 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **9-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Inventory snapshot captured per target
- [ ] File-count parity recorded before edits
- [ ] Diff review limited to the five scoped targets

### Rollback Procedure
1. Revert the affected documentation batch for the target that drifted.
2. Re-run directory inventory to confirm file counts and filenames match the pre-edit state.
3. Re-compare root playbook wording against the `sk-doc` templates before reattempting the rewrite.
4. Resume only after the diff is back inside the approved scope.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
