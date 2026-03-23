---
title: "Plan: Clean Deprecated Manual Testing Playbook References"
description: "Implementation plan for a documentation-only cleanup of stale manual-testing scenarios and audit pages in the system-spec-kit playbook."
---
# Implementation Plan: 020-clean-playbook-docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | System Spec Kit manual testing playbook |
| **Storage** | Git-tracked docs only |
| **Testing** | Manual doc review plus targeted repo search |

### Overview

This work updated a small set of playbook markdown files so they no longer describe removed or inert behavior as active manual-test requirements. The finished pass aligned the root playbook index, the linked scenario pages, and the sunset and dead-code audit docs, then verified wording, link behavior, and scope control with targeted checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Scoped playbook docs updated or removed as planned
- [x] No non-playbook files changed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation cleanup with a single source-of-truth pass across related playbook pages.

### Key Components
- **Playbook index**: `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` must stop routing testers toward stale checks.
- **Targeted scenarios**: The bulk-delete, graph-channel, RSF, memory-manage routing, and search-pipeline feature-flag pages form the scoped scenario set for this cleanup.
- **Audit pages**: The sunset and dead-code scenarios should explain the cleanup explicitly instead of implying the deprecated surface is still active.

### Data Flow

Requested stale-feature list → inspect current playbook pages → decide rewrite vs remove per page → update index and audit wording → search for leftover stale obligations in the scoped files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit
- [x] Confirm which scoped pages still mention stale runtime expectations
- [x] Decide whether each scoped scenario should be rewritten or removed
- [x] Map any index or cross-link updates required by those decisions

### Phase 2: Cleanup
- [x] Update the root playbook index
- [x] Rewrite the bulk-delete scenario to use temporary-tier examples instead of deprecated-tier examples
- [x] Rewrite the graph-channel scenario to remove channel-attribution wording
- [x] Convert the RSF shadow-mode scenario into a retired-note page
- [x] Rewrite the memory-manage routing and search-pipeline feature-flag reference scenarios to distinguish active behavior from retired or inert checks
- [x] Update the dead-code and sunset audit pages

### Phase 3: Verification
- [x] Search the scoped files for deprecated-topic wording that should no longer appear as an active requirement
- [x] Verify links and references remain valid after removals or rewrites
- [x] Confirm the final diff touches only the intended playbook markdown files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Content review | Prompts, expected signals, pass/fail language in the scoped playbook pages | Manual read-through |
| Search audit | Deprecated-topic terms in scoped files | `rg` |
| Link review | Index links after any removal or rewrite | Manual path check |
| Scope check | Confirm only requested playbook docs changed | `git diff --stat` |
| Spec validation | Confirm spec packet integrity after completion updates | `scripts/spec/validate.sh --strict` |
| Alignment drift | Confirm playbook and skill docs stay aligned | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` |
| Doc validity | Validate the root playbook document quality | `python3 .agents/skills/sk-doc/scripts/validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Requested stale-feature list from the user | Internal | Green | Defines the cleanup target set |
| Current playbook file layout | Internal | Green | Needed to keep links and references coherent |
| Current feature status in system-spec-kit docs | Internal | Green | Used to distinguish active checks from inert compatibility shims and retired topics |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The cleanup removes guidance that still reflects live behavior or breaks the playbook index.
- **Procedure**: Revert the affected playbook markdown files and re-run the targeted wording and link review before attempting the cleanup again.
<!-- /ANCHOR:rollback -->
