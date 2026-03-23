---
title: "Tasks: Clean Deprecated Manual Testing Playbook References"
description: "Task breakdown for the documentation-only cleanup of stale manual-testing playbook references."
---
# Tasks: 020-clean-playbook-docs

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Review the scoped playbook pages and confirm which deprecated topics still appear (`../../../../skill/system-spec-kit/manual_testing_playbook/`)
- [x] T002 Decide rewrite versus removal for each targeted scenario page in the scoped playbook set
- [x] T003 [P] Capture the final list of stale topics that must disappear as active obligations (RSF live path, channel attribution, fusion-policy shadow V2, full-context ceiling eval, index refresh, context budget, PageRank, entity scope)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update the root playbook index and scenario summaries (`../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`)
- [x] T005 Rewrite the bulk-delete scenario if it still carries deprecated context-budget or related inert guidance (`../../../../skill/system-spec-kit/manual_testing_playbook/02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md`)
- [x] T006 Rewrite or remove the graph-channel scenario (`../../../../skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md`)
- [x] T007 Rewrite or remove the RSF shadow-mode scenario (`../../../../skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/034-relative-score-fusion-in-shadow-mode-r14-n1.md`)
- [x] T008 Update the dead-code audit page (`../../../../skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/070-dead-code-removal.md`)
- [x] T009 Rewrite the memory-manage routing scenario if it still points to retired index-refresh, PageRank, or entity-scope checks (`../../../../skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/186-memory-manage-command-routing.md`)
- [x] T010 Update the sunset-audit page (`../../../../skill/system-spec-kit/manual_testing_playbook/17--governance/064-feature-flag-sunset-audit.md`)
- [x] T011 Rewrite the search-pipeline feature-flag reference scenario if it still advertises inert flags or fusion-policy shadow V2 checks (`../../../../skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/028-1-search-pipeline-features-speckit.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Search the scoped files for deprecated-topic wording that should not remain as active manual-test guidance
- [x] T013 [P] Verify index links and retained catalog references after any removals or rewrites
- [x] T014 [P] Confirm the final diff touches only the intended playbook markdown files plus this spec folder
- [x] T015 Record the completed cleanup in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Scoped playbook docs no longer advertise stale manual-test obligations
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Previous Phase**: See `../019-rewrite-repo-readme/spec.md`
<!-- /ANCHOR:cross-refs -->
