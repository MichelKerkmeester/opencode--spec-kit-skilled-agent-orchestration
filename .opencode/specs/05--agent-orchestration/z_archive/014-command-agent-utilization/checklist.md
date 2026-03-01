---
title: "Verification Checklist: Command Agent Utilization Audit [014-command-agent-utilization/checklist]"
description: "Verification Date: 2026-02-14"
trigger_phrases:
  - "verification"
  - "checklist"
  - "command"
  - "agent"
  - "utilization"
  - "014"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Command Agent Utilization Audit

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] AGENTS.md routing rules reviewed (Rules 4, 5, §3)
- [x] CHK-002 [P0] All 12 YAML files read to determine actual scope
- [x] CHK-003 [P1] Plan scope corrected (4 files for Phase 1+2, not 12)

<!-- /ANCHOR:pre-impl -->

---

## Phase 1: @speckit Routing

- [x] CHK-010 [P0] `create_skill_auto.yaml` has `agent_routing` with `agent: "@speckit"` in spec_folder_setup
- [x] CHK-011 [P0] `create_skill_confirm.yaml` has `agent_routing` with `agent: "@speckit"` in spec_folder_setup
- [x] CHK-012 [P0] `create_agent_auto.yaml` has `agent_routing` with `agent: "@speckit"` in spec_folder_setup
- [x] CHK-013 [P0] `create_agent_confirm.yaml` has `agent_routing` with `agent: "@speckit"` in spec_folder_setup
- [x] CHK-014 [P0] All 4 files reference `rule_reference: "AGENTS.md Rule 5"`
- [x] CHK-015 [P0] All 4 files output `created_via_speckit` (not `created_with_context`)
- [x] CHK-016 [P1] No remaining `Initialize spec.md` inline activities
- [x] CHK-017 [P1] 8 exempt files (folder_readme, install_guide, skill_asset, skill_reference) do NOT have @speckit routing

---

## Phase 2: @context Routing

- [x] CHK-020 [P0] `create_skill_auto.yaml` has `agent_routing` with `agent: "@context"` in discovery step
- [x] CHK-021 [P0] `create_skill_confirm.yaml` has `agent_routing` with `agent: "@context"` in discovery step
- [x] CHK-022 [P0] `create_agent_auto.yaml` has `agent_routing` with `agent: "@context"` in discovery step
- [x] CHK-023 [P0] `create_agent_confirm.yaml` has `agent_routing` with `agent: "@context"` in discovery step
- [x] CHK-024 [P0] All 4 files reference `rule_reference: "AGENTS.md Rule 4"`
- [x] CHK-025 [P0] No remaining `tool: Glob` or `tool: Grep` in discovery steps
- [x] CHK-026 [P1] Activities describe memory-first retrieval pattern
- [x] CHK-027 [P1] 8 exempt files do NOT have @context routing in non-discovery steps

---

<!-- ANCHOR:testing -->
## Phase 3: @review Quality Gate

### Structure (all 12 YAML files)
- [x] CHK-030 [P0] All 12 YAML files have quality_review step
- [x] CHK-031 [P0] All 12 have `agent: "@review"` in agent_routing
- [x] CHK-032 [P0] All 12 have `agent_file: ".opencode/agent/review.md"`
- [x] CHK-033 [P0] All 12 have `rule_reference` mentioning §3
- [x] CHK-034 [P0] All 12 have `blocking: false`
- [x] CHK-035 [P0] All 12 have `on_low_score` with threshold 70

### Mode Differentiation
- [x] CHK-036 [P0] All 6 auto files have NO checkpoint in quality_review step
- [x] CHK-037 [P0] All 6 confirm files have checkpoint with 3 options (Accept/View/Address)

### Rubric Consistency
- [x] CHK-038 [P1] All 12 files use identical rubric: Accuracy 40%, Completeness 35%, Consistency 25%
- [x] CHK-039 [P1] All 12 files output: quality_score, review_findings, improvement_suggestions

### Step Positioning
- [x] CHK-040 [P1] All 12 files place quality_review BEFORE save_context step

### MD Reference Files
- [x] CHK-041 [P1] `skill.md` has Agent Routing with 3 agents (@context, @speckit, @review)
- [x] CHK-042 [P1] `agent.md` has Agent Routing with 3 agents (@context, @speckit, @review)
- [x] CHK-043 [P1] `folder_readme.md` has Agent Routing with 1 agent (@review)
- [x] CHK-044 [P1] `install_guide.md` has Agent Routing with 1 agent (@review)
- [x] CHK-045 [P1] `skill_asset.md` has Agent Routing with 1 agent (@review)
- [x] CHK-046 [P1] `skill_reference.md` has Agent Routing with 1 agent (@review)

<!-- /ANCHOR:testing -->

---

## Cross-Cutting Verification

- [x] CHK-050 [P0] Symlink mirroring: .claude/commands/ auto-propagates (symlinks verified)
- [x] CHK-051 [P1] No inline Write calls for spec.md/plan.md in modified YAML files
- [x] CHK-052 [P1] Agent routing blocks use consistent 5-field structure across all files

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | 24/24 |
| P1 Items | 19 | 19/19 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-02-14

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (3 ADRs)
- [x] CHK-101 [P1] All ADRs have status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] N/A — no migration path needed

<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist)
- [x] CHK-141 [P1] Agent Routing tables complete in all 6 MD files
- [x] CHK-142 [P2] Implementation summary captures all changes

<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Review Agent (Phase 1+2) | Automated Verification | [x] 72/72 passed | 2026-02-14 |
| Review Agent (Phase 3) | Automated Verification | [x] 132/132 passed | 2026-02-14 |

<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist — Full verification for spec 014
All 43 checks passed + 3 L3+ architecture checks
-->
