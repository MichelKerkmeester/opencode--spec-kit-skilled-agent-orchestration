---
title: "Verification Checklist: Create Skill Merger"
description: "Verification Date: 2026-03-03"
# SPECKIT_TEMPLATE_SOURCE: checklist | v2.2
trigger_phrases:
  - "verification checklist"
  - "create:sk-skill"
  - "migration validation"
importance_tier: "important"
contextType: "verification"
---
# Verification Checklist: Create Skill Merger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [Evidence: `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/spec.md`]
- [x] CHK-002 [P0] Technical approach defined in plan.md [Evidence: `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/plan.md`]
- [x] CHK-003 [P1] Dependencies identified and available [Evidence: dependency section in `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/plan.md` references `.opencode/command/create/` assets]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Canonical command entrypoint exists and is deterministic [Evidence: `.opencode/command/create/sk-skill.md`]
- [x] CHK-011 [P0] Unified mode workflows exist for both modes [Evidence: `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`]
- [x] CHK-012 [P1] Operation routing includes all supported operations [Evidence: operation tables in `.opencode/command/create/sk-skill.md`, `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`]
- [x] CHK-013 [P1] Deprecated command/workflow files removed [Evidence: missing paths `.opencode/command/create/skill.md`, `.opencode/command/create/skill_reference.md`, `.opencode/command/create/skill_asset.md`, and legacy `create_skill*.yaml` files in `.opencode/command/create/assets/`]
- [x] CHK-014 [P1] Canonical command and unified YAMLs aligned with sk-doc/create-command structure patterns [Evidence: `.opencode/command/create/sk-skill.md`, `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`]
- [x] CHK-015 [P1] Canonical artifact expansion completed with exact line counts [Evidence: `wc -l` = 523 (`sk-skill.md`), 470 (`create_sk_skill_auto.yaml`), 519 (`create_sk_skill_confirm.yaml`)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All migration acceptance criteria met [Evidence: canonical entrypoint + unified YAMLs present, deprecated files absent, prompt reference updated in `.opencode/command/create/prompt.md`]
- [x] CHK-021 [P0] Manual verification complete [Evidence: operation and mode support documented in `.opencode/command/create/sk-skill.md` and both `create_sk_skill_*.yaml` files]
- [x] CHK-022 [P1] Edge cases represented in routing contracts [Evidence: create-vs-update existence gate logic in `.opencode/command/create/sk-skill.md` and `gate_logic` sections in both unified YAMLs]
- [x] CHK-023 [P1] Error scenarios validated in workflow docs [Evidence: `error_recovery` and `violation_recovery` sections in `.opencode/command/create/assets/create_sk_skill_auto.yaml` and `.opencode/command/create/assets/create_sk_skill_confirm.yaml`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in migrated files [Evidence: `.opencode/command/create/sk-skill.md`, `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`]
- [x] CHK-031 [P0] Input/setup validation requirements documented [Evidence: setup hard stops and required field checks in `.opencode/command/create/sk-skill.md`]
- [x] CHK-032 [P1] Workflow gate model explicitly defined [Evidence: `gate_logic` sections in both unified YAML files]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [Evidence: `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/spec.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/plan.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/tasks.md`]
- [x] CHK-041 [P1] Canonical command references updated in related docs [Evidence: `.opencode/command/create/prompt.md` lines referencing `/create:sk-skill` variants]
- [x] CHK-042 [P1] Cross-runtime active docs synchronized to canonical command [Evidence: `.agents/agents/write.md`, `.opencode/agent/write.md`, `.opencode/agent/chatgpt/write.md`, `.codex/agents/write.toml`, `.opencode/README.md`, `README.md`, `.opencode/install_guides/README.md`, `.opencode/install_guides/SET-UP - AGENTS.md` reference `/create:sk-skill`]
- [x] CHK-043 [P2] Implementation summary completed [Evidence: `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/implementation-summary.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Documentation files created only in requested folder [Evidence: `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/spec.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/plan.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/tasks.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/checklist.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/implementation-summary.md`]
- [x] CHK-051 [P1] No temporary files introduced by migration documentation [Evidence: no `scratch/` usage required for this retrospective documentation set]
- [x] CHK-052 [P2] Memory save completed for this spec folder [Evidence: latest `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/memory/*.md` artifact plus `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/memory/metadata.json` with `embedding.status = indexed`]
- [x] CHK-053 [P1] `memory_index_scan` completed for this spec folder [Evidence: `memory_index_scan` run for `03--commands-and-skills/commands/016-create-skill-merger` with status `complete` and `failed = 0`]
- [x] CHK-054 [P1] No legacy `/create:skill*` references remain in key runtime directories [Evidence: `/create:skill` search returns no matches in `.agents/agents`, `.codex`, `.claude`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

## P0

- [x] Canonical command, mode routing, operation coverage, and migration cleanup are complete [Evidence: `.opencode/command/create/sk-skill.md`, `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`, deleted legacy command/workflow paths]

## P1

- [x] Related references and Level 2 documentation are synchronized [Evidence: `.opencode/command/create/prompt.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/spec.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/plan.md`, `.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/tasks.md`]

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 15 | 15/15 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-03
<!-- /ANCHOR:summary -->
