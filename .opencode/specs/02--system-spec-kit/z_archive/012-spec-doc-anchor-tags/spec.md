---
title: "Feature Specification: Spec Document Anchor Tags [02--system-spec-kit/z_archive/012-spec-doc-anchor-tags/spec]"
description: "Spec 126 made all spec documents searchable by indexing them as whole documents. But unlike Memory files and READMEs — which use &lt;!-- ANCHOR:name --&gt; tags for section-leve..."
trigger_phrases:
  - "feature"
  - "specification"
  - "spec"
  - "document"
  - "anchor"
  - "012"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Spec Document Anchor Tags

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-16 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec 126 made all spec documents searchable by indexing them as whole documents. But unlike Memory files and READMEs — which use `&lt;!-- ANCHOR:name --&gt;` tags for section-level retrieval with 85-93% token savings — spec documents have no anchors. An agent searching for "what's the scope of spec 126?" must load the entire 2000-token spec.md instead of retrieving just the ~150-token scope section.

### Purpose
All spec kit templates gain anchor tags around their sections, enabling token-efficient section-level retrieval identical to Memory files and READMEs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `&lt;!-- ANCHOR:name --&gt;` / `&lt;!-- /ANCHOR:name --&gt;` tags to all CORE templates (4 files)
- Add anchor tags to all addendum templates (7+ files)
- Propagate anchors to all composed level templates (level_1/ through level_3+/, ~21 files)
- Update `check-anchors.sh` validation to scan spec document files (not just memory/)

### Out of Scope
- Migration of existing spec folders to use anchors - additive enhancement only
- Changes to indexing/search pipeline code - anchor infrastructure is already document-agnostic
- Changes to `extractAnchors()`, `resolveAnchorKey()`, or `validateAnchors()` functions

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `templates/core/*.md` | Modify | Add 25 anchors across 4 CORE templates |
| `templates/addendum/**/*.md` | Modify | Add anchors to 9 addendum templates |
| `templates/level_1/*.md` | Modify | Propagate CORE anchors to 4 composed files |
| `templates/level_2/*.md` | Modify | Propagate CORE+L2 anchors to 5 composed files |
| `templates/level_3/*.md` | Modify | Propagate CORE+L2+L3 anchors to 6 composed files |
| `templates/level_3+/*.md` | Modify | Propagate all anchors to 6 composed files |
| `scripts/rules/check-anchors.sh` | Modify | Extend to validate spec doc anchors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All CORE templates have anchor tags | 7+7+6+5=25 anchors across spec-core, plan-core, tasks-core, impl-summary-core |
| REQ-002 | All addendum templates have anchor tags | L2, L3, L3+ addendum files contain matching open/close anchors |
| REQ-003 | All composed level templates have anchor tags | level_1/ through level_3+/ templates have propagated anchors |
| REQ-004 | check-anchors.sh validates spec document anchors | Script scans spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Anchor naming follows existing conventions | Lowercase, hyphen-separated, semantic IDs consistent with memory anchors |
| REQ-006 | Full test suite passes with no regressions | `npx vitest run` passes 4184+ tests |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All template files have matching open/close anchor pairs (validated by check-anchors.sh)
- **SC-002**: Zero code changes to indexing/search pipeline — templates-only modification
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 126 (full spec doc indexing) | Anchors are useless without indexing | Spec 126 already complete |
| Risk | Anchor tag typos break validation | Low - validation catches mismatches | check-anchors.sh validates all pairs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Backward Compatibility
- Existing spec docs without anchors continue working (whole-document indexing via NULL `anchor_id`)
- No migration required — anchors are an additive enhancement
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Template Edge Cases
- Nested anchors in decision-record.md (adr-001 wrapping sub-anchors) - validated by pair matching
- Addendum templates that are fragments (no `# heading`) - anchors still work on `##` sections

### Validation Edge Cases
- Spec folder with no spec docs (only memory/) - check-anchors.sh still checks memory/ as before
- Spec folder with some but not all doc types - only existing files are validated
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | ~34 template files modified, ~200 anchor tags added |
| Risk | 5/25 | No code changes, additive only, validation catches errors |
| Research | 5/20 | Anchor format well-established in existing memory files |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — all design decisions resolved during planning.
<!-- /ANCHOR:questions -->

---
