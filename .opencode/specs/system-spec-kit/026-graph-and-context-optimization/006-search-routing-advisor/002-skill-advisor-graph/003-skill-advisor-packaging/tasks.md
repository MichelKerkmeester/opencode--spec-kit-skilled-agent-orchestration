---
title: "Tasks: Skill Advisor Packaging"
description: "Task ledger for packet remediation, metadata repair, and strict-validation recovery."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "packaging tasks"
  - "packet remediation tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-21T14:15:00Z"
    last_updated_by: "codex-phase-consolidation"
    recent_action: "Tasks updated"
    next_safe_action: "Validate packet"
    key_files: ["tasks.md", "checklist.md"]
---
# Tasks: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (scope)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `../../../review/011-skill-advisor-graph-pt-04/deep-review-findings.md` and all packet docs before editing (packet review scope) [Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `description.json`, and `graph-metadata.json` were read]
- [x] T002 Inspect the live `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/` root and confirm that `feature_catalog/`, `manual_testing_playbook/`, and `scripts/` sit alongside `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/README.md`, the package setup guide, and `graph-metadata.json` (package layout evidence) [Evidence: folder listing confirmed the shipped root layout]
- [x] T003 Read the Level 3 templates for `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` (template contract) [Evidence: template files in `.opencode/skill/system-spec-kit/templates/level_3/` were read before the rewrite]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` onto the required template headers and ANCHOR pairs (core packet docs) [Evidence: the four core docs now use the Level 3 section headers and anchors required by strict validation]
- [x] T005 Replace packet `graph-metadata.json` key-file placeholders with concrete evidence files such as `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`, and `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py` (packet metadata) [Evidence: `graph-metadata.json` now lists concrete files only]
- [x] T006 Update packet wording so runtime paths use `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/` where appropriate and the root layout shows `feature_catalog/` plus `manual_testing_playbook/` alongside `scripts/` (path accuracy) [Evidence: `spec.md`, `plan.md`, and this task ledger now reference the live paths]
- [x] T007 Add ADR-003 to `decision-record.md` to document the move into `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/` as the convention-aligned runtime subfolder (decision history) [Evidence: `decision-record.md` now includes ADR-003]
- [x] T008 Correct the root-catalog rule so the 18 per-feature files keep the 4-section snippet contract while the root feature catalog follows its own multi-section format (checklist wording) [Evidence: `checklist.md` now states the corrected rule]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run strict packet validation after the remediation pass (validation gate) [Evidence: strict validation now exits without error status]
- [x] T010 Confirm that packet markdown references resolve to real local or relative files (integrity gate) [Evidence: packet docs now reference local packet files or valid `../../../../../skill/...` paths only]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All remediation tasks are marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Strict validation no longer returns exit code `2`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Review Findings**: `../../../review/011-skill-advisor-graph-pt-04/deep-review-findings.md`
<!-- /ANCHOR:cross-refs -->
