---
title: "Verification Checklist: Merge create README and install guide commands [017-create-readme-install-merger/checklist]"
description: "Verification Date: 2026-03-03"
# SPECKIT_TEMPLATE_SOURCE: checklist | v2.2
trigger_phrases:
  - "verification checklist"
  - "p0 p1 p2"
  - "merge validation"
  - "command migration readiness"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: Merge create README and install guide commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Must pass before implementation or deprecation rollout |
| **P1** | Required | Must pass or be deferred with explicit approval |
| **P2** | Optional | Can defer with documented follow-up |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` documents merge scope, requirements, and constraints [Evidence: `.opencode/specs/03--commands-and-skills/cmd-017-create-readme-install-merger/spec.md`]
- [x] CHK-002 [P0] `plan.md` defines canonical naming, routing, and migration strategy [Evidence: `.opencode/specs/03--commands-and-skills/cmd-017-create-readme-install-merger/plan.md`]
- [x] CHK-003 [P1] Source evidence captured from all six required assets [Evidence: `plan.md` section "Evidence baseline"]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Workflow Quality

- [x] CHK-010 [P0] Canonical command parser handles operation and mode with deterministic precedence [Evidence: static parity+safety suite PASS (20 checks, 0 failed), including `route:readme:auto`, `route:readme:confirm`, `route:install:auto`, `route:install:confirm`]
- [x] CHK-011 [P0] Shared setup prompt asks only missing fields and enforces explicit conflict handling [Evidence: static suite PASS, including `confirm-checkpoints` + `explicit-overwrite-options` checks for both confirm YAML variants]
- [x] CHK-012 [P1] Shared YAML kernel keeps operation-specific behavior intact [Evidence: static suite PASS for all four operation/mode routes with canonical-to-legacy equivalence matrix documented in `plan.md`]
- [x] CHK-013 [P1] No placeholder markers remain in merged command artifacts [Evidence: `validate_document.py` reported VALID for `.opencode/command/create/doc.md`, `.opencode/command/create/folder_readme.md`, `.opencode/command/create/install_guide.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Validation and Testing

- [x] CHK-020 [P0] Legacy alias parity passes for both operations in `:auto` and `:confirm` [Evidence: static parity+safety suite PASS (20 checks, 0 failed), alias-token + alias-source checks passed for markdown wrappers and `.agents` TOML wrappers]
- [x] CHK-021 [P0] Preferred unified command path passes end-to-end dry-run checks [Evidence: rollback dry-run simulation PASS (non-destructive), smoke readiness reports `/create:folder_readme` and `/create:install_guide` available in both `:auto` and `:confirm`]
- [x] CHK-022 [P1] DQI and structural validation gates documented and executed [Evidence: `python3 .opencode/skill/sk-doc/scripts/validate_document.py` VALID for preferred unified markdown wrapper (`.opencode/command/create/folder_readme.md`) plus compatibility/internal wrappers (`.opencode/command/create/doc.md`, `.opencode/command/create/install_guide.md`); TOML parse check passed via `python3.11`/`tomllib` for preferred unified `.agents` wrapper (`.agents/commands/create/folder_readme.toml`) plus compatibility wrappers (`.agents/commands/create/doc.toml`, `.agents/commands/create/install_guide.toml`)]
- [x] CHK-023 [P1] Rollback procedure tested and documented [Evidence: rollback dry-run simulation PASS with wrappers + canonical command present, simulated rollback commands listed, and `ROLLBACK_DRY_RUN_STATUS PASS`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Safety and Compatibility

- [x] CHK-030 [P0] No new secret collection fields introduced in setup contract [Evidence: static suite `no-secret-field` checks PASS for `api key`, `password`, `secret key`, `credentials` in `.opencode/command/create/folder_readme.md`]
- [x] CHK-031 [P0] Overwrite and merge conflict prompts remain explicit opt-in [Evidence: static suite `explicit-overwrite-options` checks PASS for both confirm YAML assets]
- [x] CHK-032 [P1] Deprecation window and warning messages documented before alias removal [Evidence: `plan.md` deprecation policy finalized (minimum 2 release cycles OR 30 days, whichever is longer); alias wrappers now emit deprecation warnings in `.opencode/command/create/folder_readme.md`, `.opencode/command/create/install_guide.md`, `.agents/commands/create/folder_readme.toml`, and `.agents/commands/create/install_guide.toml`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` are synchronized for this implementation cycle [Evidence: same preferred unified naming (`/create:folder_readme`) and compatibility strategy (`/create:doc`, `/create:install_guide`) across files]
- [x] CHK-041 [P1] Assumptions, risks, and out-of-scope boundaries documented [Evidence: `spec.md` sections 3 and 6]
- [x] CHK-042 [P2] Implementation summary accurately reflects current implementation-cycle status [Evidence: `implementation-summary.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Level 2 required docs exist in target spec folder [Evidence: five required files present]
- [x] CHK-051 [P1] No temporary artifacts stored outside spec folder [Evidence: no scratch files created]
- [x] CHK-052 [P2] Memory snapshot saved after implementation phase starts [Evidence: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/03--commands-and-skills/cmd-017-create-readme-install-merger` generated `memory/03-03-26_13-29__create-readme-install-merger.md` and `memory/metadata.json`; `memory_index_scan` for `03--commands-and-skills/cmd-017-create-readme-install-merger` returned `indexed=1 failed=0`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-03

Current status: P0, P1, and P2 verification items are complete for this phase with parity+safety, rollback dry-run, and memory snapshot/index evidence captured.
<!-- /ANCHOR:summary -->

---

## P0

- Canonical routing correctness for both operations and both modes is required before implementation completion.
- Conflict handling must remain explicit and non-destructive.
- Backward-compatibility alias parity must pass before any deprecation action.

---

## P1

- Migration communications, timeline, and rollback rehearsal are required for release readiness.
- DQI and structural validation gates must be documented and executed for both operation branches.
- Remaining non-blocking quality improvements can proceed after P0 closure.
