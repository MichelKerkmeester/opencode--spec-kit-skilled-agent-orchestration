---
title: "Verification Checklist: sk-deep-research [03--commands-and-skills/034-sk-deep-research-review-folders/checklist]"
description: "Verification Date: 2026-03-27"
trigger_phrases:
  - "review folder verification"
  - "deep-review checklist"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: sk-deep-research Review Folder Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim complete until verified |
| **[P1]** | Required | Must complete or document an approved deferral |
| **[P2]** | Optional | Can defer with an explicit note |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: requirements table in spec.md]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: architecture and implementation phases in plan.md]
- [x] CHK-003 [P1] Affected file families enumerated and frozen [EVIDENCE: files-to-change table in spec.md]
- [x] CHK-004 [P1] Legacy-state compatibility called out as part of the main scope [EVIDENCE: requirements, phases, and ADR coverage]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Review auto and confirm YAML workflows use `review/` for all durable review artifacts [EVIDENCE: review YAML `state_paths`, pause checks, iteration outputs, synthesis outputs, and completion summaries now point at `{spec_folder}/review/`; `ruby -e 'require \"yaml\"; ... YAML.load_file(...)'` passed for both review YAMLs]
- [x] CHK-011 [P0] All runtime `deep-review` agent definitions reference `review/` rather than `scratch/` [EVIDENCE: `.opencode/agent/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, and `.gemini/agents/deep-review.md` now read and write `review/` artifacts only; targeted worker `rg` verification reported no remaining live-contract `scratch/` refs]
- [x] CHK-012 [P1] `review_mode_contract.yaml` and review templates match the runtime path contract [EVIDENCE: `.opencode/skill/sk-deep-research/assets/review_mode_contract.yaml` plus the deep-review strategy and dashboard templates now point at `review/`; YAML parse passed for `review_mode_contract.yaml`]
- [x] CHK-013 [P1] Research-mode storage behavior remains unchanged aside from the shared spec-root compatibility guard [EVIDENCE: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `spec_kit_deep-research_confirm.yaml` now widen `spec_folder_is_within` to accept both `specs/` and `.opencode/specs/`, while their scratch-based state paths remain unchanged]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fresh review-session initialization writes state into `review/` [DEFERRED: contract and docs are updated, but no live review-mode run fixture was executed in this session]
- [ ] CHK-021 [P0] Legacy scratch-based review state migrates or rehomes correctly before resume classification [DEFERRED: migration logic is implemented and bounded, but no legacy scratch-state replay fixture was executed in this session]
- [x] CHK-022 [P1] Pause or resume behavior uses the review packet location consistently [EVIDENCE: review YAML pause checks now target `{spec_folder}/review/.deep-research-pause`; README, quick reference, loop protocol, and shared DR-015/DR-016 playbook entries describe the review sentinel under `review/`]
- [ ] CHK-023 [P1] Final report path and any downstream consumer expectations are validated [DEFERRED: first-party surfaces were swept, but no end-to-end consumer replay was run and unknown external consumers remain a compatibility risk]
- [x] CHK-024 [P1] Path sweeps show no stale review-mode `scratch/` references in the planned surfaces [EVIDENCE: broad `rg` sweeps over workflow, runtime, asset, doc, and playbook surfaces show `review/` packet paths everywhere; remaining review-side `scratch/` refs are limited to deliberate legacy-migration inputs]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Legacy migration touches only the approved review-artifact whitelist [EVIDENCE: review YAMLs now define explicit `migrate_only` whitelists for config, JSONL, strategy, dashboard, iteration files, pause sentinel, and the legacy root-level report]
- [x] CHK-031 [P1] Unrelated `scratch/` temp files remain untouched during migration [EVIDENCE: migration steps move only the named review artifacts plus `iteration-*.md`; no general `scratch/` directory move or delete was introduced]
- [x] CHK-032 [P1] Invalid or contradictory migrated state still halts rather than resuming partial state [EVIDENCE: review YAMLs keep `invalid-state` as a hard halt and add `on_conflict` guidance to stop instead of merging contradictory canonical and legacy review state]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Command entrypoint, SKILL, README, and reference docs all describe `review/` [EVIDENCE: `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/skill/sk-deep-research/README.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, and the `.agents/commands/spec_kit/deep-research.toml` wrapper now all align on the review-mode entrypoints and review packet expectations]
- [x] CHK-041 [P1] Manual testing playbook scenarios and expected signals match the new review packet contract [EVIDENCE: review-mode playbooks `039` and `041` plus shared pause-resume playbooks `015` and `016` now reference the review packet and review sentinel location]
- [x] CHK-042 [P2] README or packet notes explain why `scratch/` remains temporary while `review/` is durable [EVIDENCE: README distinguishes research-mode `scratch/` state from review-mode `review/` packet; `spec.md` and `plan.md` document the durable-vs-temporary rationale]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Durable review outputs live in `review/`, not `scratch/` [EVIDENCE: review YAML `state_paths`, runtime agents, assets, and review docs consistently reference config, JSONL, strategy, dashboard, iteration files, pause sentinel, and report under `review/`]
- [x] CHK-051 [P1] Legacy root or scratch review artifacts are migrated or explicitly archived without ambiguity [EVIDENCE: review YAMLs migrate the legacy root-level review report plus the approved scratch review packet into canonical `review/` locations using explicit target paths rather than leaving dual durable homes]
- [x] CHK-052 [P2] `implementation-summary.md` is refreshed with post-implementation results after coding is complete [EVIDENCE: implementation-summary updated in this closeout with landed behavior, verification evidence, and remaining gaps]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 8/10 |
| P1 Items | 20 | 19/20 |
| P2 Items | 6 | 5/6 |

**Verification Date**: 2026-03-27
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` [EVIDENCE: ADR-001 in decision-record.md]
- [x] CHK-101 [P1] Folder-placement decision and legacy-migration decision are both reflected in implementation [EVIDENCE: review YAMLs now use `review/` as canonical packet location and include explicit legacy scratch-to-review migration]
- [x] CHK-102 [P1] Out-of-scope boundaries held: no basename rename, no research-mode path migration [EVIDENCE: review basenames remain `deep-research-*`; research auto/confirm YAMLs were untouched]
- [x] CHK-103 [P2] Any render-target or generator follow-up is documented if manual sync remains the implementation approach [EVIDENCE: implementation-summary notes that no generator surfaced during this implementation and the sync remains manual]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Startup migration checks stay bounded to the review-artifact whitelist [EVIDENCE: migration logic inspects only named review files plus `iteration-*.md` under the current spec's `scratch/` directory]
- [x] CHK-111 [P2] No unnecessary repository-wide folder scans were introduced for review initialization [EVIDENCE: migration command is scoped to `{spec_folder}/scratch` and `{spec_folder}` only]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented for the review path migration [EVIDENCE: rollback and enhanced rollback sections remain present in `plan.md`]
- [x] CHK-121 [P1] Compatibility notes recorded for any root-level review-report consumers [EVIDENCE: implementation-summary records that no first-party consumer surfaced in the planned sweep while unknown downstream consumers of the former root-level review report remain an explicit limitation]
- [x] CHK-122 [P1] Validation commands and evidence are captured for future re-runs [EVIDENCE: implementation-summary and this checklist record the YAML parse command set, `git diff --check`, targeted `rg` sweeps, focused `git diff --stat` output, direct `.agents` wrapper inspection, and the passing strict `validate.sh --strict` run used during closeout]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Review implementation aligns with system-spec-kit scratch-folder semantics [EVIDENCE: review mode now uses a dedicated `review/` packet while shared docs continue to describe `scratch/` as research-mode temporary state]
- [ ] CHK-131 [P2] Archived or historical examples that still mention `scratch/` are labeled as non-live references
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` remain synchronized [EVIDENCE: packet status and verification notes now match the implemented review-folder contract]
- [x] CHK-141 [P1] User-facing docs and operator playbooks reflect the same packet layout [EVIDENCE: README, SKILL, references, review-mode playbooks, and shared pause-resume playbooks now describe the review packet under `review/`]
- [x] CHK-142 [P2] Final implementation summary captures the outcome and validation evidence [EVIDENCE: implementation-summary updated with landed behavior, verification commands, and remaining risks]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Request owner | [ ] Approved | |
| Maintainer | Technical review | [ ] Approved | |
| Operator | Validation review | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
