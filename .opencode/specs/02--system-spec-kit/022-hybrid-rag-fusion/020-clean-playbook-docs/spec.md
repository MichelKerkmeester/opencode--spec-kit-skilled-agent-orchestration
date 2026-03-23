---
title: "Clean Deprecated Manual Testing Playbook References"
description: "Remove or rewrite stale manual-testing scenarios under the system-spec-kit playbook so the documentation no longer tells operators to validate removed or inert features. Keep the cleanup focused on the playbook index plus the linked sunset and dead-code audit scenarios."
trigger_phrases:
  - "manual testing playbook cleanup"
  - "deprecated playbook references"
  - "020 clean playbook docs"
  - "hybrid rag fusion playbook cleanup"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: 020-clean-playbook-docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` |
| **Predecessor** | `../019-rewrite-repo-readme/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The manual testing playbook still includes scenarios and audit prompts that point testers toward removed or inert behavior. References to RSF live-runtime validation, channel attribution proof, and related cleanup targets can send reviewers to verify branches, trace fields, or policies that no longer exist or no longer matter.

### Purpose

Deliver a documentation-only cleanup that removes stale guidance, converts retired RSF coverage into a note page, and aligns the manual testing playbook with the live system surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Clean the playbook index so it no longer advertises stale scenarios for removed or inert features.
- Rewrite targeted scenario pages tied to deprecated topics such as channel-attribution proof requirements, context-budget examples, fusion-policy shadow V2, index refresh, PageRank, and entity-scope checks so they no longer read as active manual-test targets.
- Convert the RSF scenario into a retired-note page and mark the root playbook entry as retired.
- Update mutation, routing, feature-flag reference, sunset, and dead-code scenario docs so they distinguish active behavior from inert compatibility shims, retired topics, and concretely removed helpers, state, and exports.

### Out of Scope
- Any runtime, feature-flag, or test-code changes under `../../../../skill/system-spec-kit/mcp_server/`.
- Feature-catalog rewrites outside the specific playbook cleanup requested.
- Non-spec edits outside `../../../../skill/system-spec-kit/manual_testing_playbook/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Remove stale channel-attribution and RSF wording, retire the RSF index entry, and align scoring-and-fusion summaries to the finished cleanup. |
| `../../../../skill/system-spec-kit/manual_testing_playbook/02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md` | Modify | Replace deprecated-tier examples with temporary-tier examples in bulk-delete coverage. |
| `../../../../skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md` | Modify | Remove channel-attribution wording while keeping the graph-hit validation focused on live behavior. |
| `../../../../skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/034-relative-score-fusion-in-shadow-mode-r14-n1.md` | Modify | Convert the RSF scenario into a retired-note page and remove stale live-runtime expectations. |
| `../../../../skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/070-dead-code-removal.md` | Modify | List the concrete removed helper, state, and export set in the dead-code cleanup coverage. |
| `../../../../skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/186-memory-manage-command-routing.md` | Modify | Replace deprecated-tier examples with temporary-tier examples and remove stale routing references. |
| `../../../../skill/system-spec-kit/manual_testing_playbook/17--governance/064-feature-flag-sunset-audit.md` | Modify | Distinguish active flags from inert compatibility shims and retired topics. |
| `../../../../skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/028-1-search-pipeline-features-speckit.md` | Modify | Distinguish active search-pipeline flags from inert compatibility shims and retired topics such as fusion-policy shadow V2. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The playbook index must stop presenting removed or inert feature checks as active manual-test work. | `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` no longer tells operators to validate stale runtime paths, trace fields, or policies tied to the deprecated feature set in scope, and the RSF entry is marked retired. |
| REQ-002 | Targeted scenario pages must be rewritten to reflect current behavior. | The scoped scenario files describe only live, meaningful checks, or clearly identify retired content such as the RSF note page, with updated prompts, expected signals, and pass/fail language. |
| REQ-003 | Sunset and dead-code audit docs must reflect the cleanup explicitly. | `../../../../skill/system-spec-kit/manual_testing_playbook/17--governance/064-feature-flag-sunset-audit.md`, `../../../../skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/028-1-search-pipeline-features-speckit.md`, and `../../../../skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/070-dead-code-removal.md` distinguish active flags from inert shims, retired topics, and concrete removed code elements. |
| REQ-004 | The cleanup must remain documentation-only and tightly scoped. | No files outside `../../../../skill/system-spec-kit/manual_testing_playbook/` are modified by the implementation for this spec. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cross-links must remain valid after any removal or rewrite. | The playbook index does not contain broken links to removed scenario pages, and retained pages still point to the right catalog or feature references. |
| REQ-006 | Deprecated-topic wording must align with current reality. | No scoped playbook page instructs testers to prove RSF live ranking, channel attribution, fusion-policy shadow V2, full-context ceiling eval, index refresh, context budget, PageRank, or entity-scope behavior as active manual-test obligations unless the final text clearly reframes them as retired or compatibility-only items. |

### Acceptance Scenarios

1. **Given** the playbook index previously listed stale RSF and channel-attribution guidance, **when** the cleanup is complete, **then** the index marks RSF as retired and no longer asks reviewers to validate removed prompt language.
2. **Given** an audit or feature-flag page mentions deprecated runtime behavior, **when** a reviewer opens it after cleanup, **then** the page frames that behavior as retired, inert, compatibility-only, or concretely removed rather than as an active validation target.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The playbook index and scoped scenario pages read as current, not historical.
- **SC-002**: Bulk-delete and memory-manage routing coverage now use temporary-tier examples instead of deprecated-tier examples.
- **SC-003**: Reviewers can tell which topics are active, which are inert compatibility shims, which are retired, and which helper, state, and export items were removed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current playbook file structure | Broken links if scenario removals are not mirrored in the index | Update the index and scenario pages in one pass |
| Dependency | Current runtime and feature status | Docs can drift again if deprecated topics are misclassified | Use the requested stale-feature list as the authority for this cleanup |
| Risk | Over-removing a scenario that still has live value | Medium | Prefer rewrite over deletion when a narrower live check still exists |
| Risk | Audit docs become too vague after cleanup | Low | Keep the sunset and dead-code pages explicit about what was retired and why |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None remaining.
<!-- /ANCHOR:questions -->
