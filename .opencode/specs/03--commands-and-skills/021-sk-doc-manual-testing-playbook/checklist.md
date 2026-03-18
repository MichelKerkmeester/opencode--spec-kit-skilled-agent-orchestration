---
title: "Verification Checklist: sk-doc Manual Testing Playbook Feature-Catalog Refactor [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-18"
trigger_phrases:
  - "manual testing playbook checklist"
  - "root category folder checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: sk-doc Manual Testing Playbook Feature-Catalog Refactor

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: `spec.md` defines scope, requirements, success criteria, and target files for the playbook refactor]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: `plan.md` defines the root-folder migration plan and verification checks PC-001 through PC-007]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `plan.md` lists the current playbook packages, sk-doc authoring surface, and validator behavior dependencies]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Root playbook files are ledger/index docs only and no longer carry full scenario-table payloads [EVIDENCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/` and `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/` were converted to root directory pages]
- [x] CHK-011 [P0] Required root-folder per-feature files exist and hold the scenario-detail source of truth for both playbook packages [EVIDENCE: per-feature-file counts matched exactly at `system-spec-kit 195/195` and `mcp-cocoindex-code 20/20`]
- [x] CHK-012 [P1] Review protocol and subagent ledger language matches the final package contract [EVIDENCE: both playbook packages updated their review protocol and subagent ledger to treat the root page plus numbered category folders as canonical/root-folder-backed coverage]
- [x] CHK-013 [P1] `sk-doc` templates and rules describe the same package structure shipped in the example playbooks [EVIDENCE: the sk-doc skill guide, README, quick reference, workflows reference, playbook template, per-feature file template, and template-rules manifest were aligned]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stale merged-playbook or alternate-subtree language is removed from touched files [EVIDENCE: playbook-coupled docs now describe the root page plus numbered category folders instead of merged or alternate-subtree models]
- [x] CHK-021 [P0] Coverage-ledger counts match feature IDs present in root-folder per-feature files for both packages [EVIDENCE: `system-spec-kit 195/195`, `mcp-cocoindex-code 20/20`]
- [x] CHK-022 [P1] Root-file paths listed by each root ledger resolve successfully [EVIDENCE: root links to per-feature files resolved with zero missing links for both playbooks]
- [x] CHK-023 [P1] Applicable markdown validation checks pass on touched `sk-doc` docs [EVIDENCE: the sk-doc validator passed for the skill guide, README, quick reference, workflows reference, playbook template, and per-feature file template; template docs may retain only non-blocking numbering warnings from fenced example headings]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credentials or environment-specific secrets were introduced while restructuring docs [EVIDENCE: scope was limited to markdown, JSON rules, and one test file for doc assertions]
- [x] CHK-031 [P0] Destructive-scenario warnings and sandbox guidance are preserved after the split [EVIDENCE: review protocol and subagent ledger updates were alignment changes, not removals of destructive-scenario guidance]
- [x] CHK-032 [P1] Validator-limit language stays honest where root-folder file traversal is not yet enforced automatically [EVIDENCE: updated sk-doc playbook docs continue to call out current validator limitations instead of overstating root-folder file validation]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` are synchronized for the completed work [EVIDENCE: all three files now describe the same completed root-page plus category-folder implementation and verification results]
- [x] CHK-041 [P1] `implementation-summary.md` captures the delivered work and validation evidence honestly [EVIDENCE: the implementation summary now records the completed package refactor, test updates, and verification outcomes]
- [x] CHK-042 [P2] Follow-on README or cross-reference updates captured where the sweep revealed broader stale wording [EVIDENCE: the sk-doc README and workflows reference were updated alongside the core playbook template docs]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] This spec folder contains only the expected spec-doc markdown files [EVIDENCE: target folder remains limited to `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`]
- [x] CHK-051 [P1] No extra `scratch/` or temp artifacts were needed for the packet update [EVIDENCE: completion evidence is recorded directly in the spec docs]
- [ ] CHK-052 [P2] Memory save is handled separately if continuation context is needed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-03-18
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
