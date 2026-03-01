---
title: "Implementation Plan: Spec Document Anchor Tags [129-spec-doc-anchor-tags/plan]"
description: "Add <!-- ANCHOR:name --> / <!-- /ANCHOR:name --> tags to all spec kit templates, enabling section-level retrieval for spec documents. The anchor infrastructure (parser, indexer,..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "spec"
  - "document"
  - "anchor"
  - "129"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Spec Document Anchor Tags

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates, Bash |
| **Framework** | Spec Kit template system |
| **Storage** | File-based templates |
| **Testing** | Vitest (existing suite), check-anchors.sh |

### Overview
Add `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` tags to all spec kit templates, enabling section-level retrieval for spec documents. The anchor infrastructure (parser, indexer, search) already exists and works document-agnostically — this spec only modifies templates and validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (spec 126 complete)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template modification — no architectural changes

### Key Components
- **CORE templates**: Base anchors present at all levels (4 files)
- **Addendum templates**: Level-specific anchors (7+ files)
- **Composed templates**: Inherit anchors from CORE + addendums (21 files)
- **check-anchors.sh**: Validation script extended for spec docs
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: CORE Templates
- [x] Add 7 anchors to spec-core.md
- [x] Add 7 anchors to plan-core.md
- [x] Add 6 anchors to tasks-core.md
- [x] Add 5 anchors to impl-summary-core.md

### Phase 2: Addendum Templates
- [x] Add 3 anchors to spec-level2.md
- [x] Add 3 anchors to plan-level2.md
- [x] Add 8 anchors to checklist.md
- [x] Add 3 anchors to spec-level3.md
- [x] Add 3 anchors to plan-level3.md
- [x] Add 7 anchors to decision-record.md
- [x] Add 6 anchors to checklist-extended.md
- [x] Add 4 anchors to spec-level3plus.md
- [x] Add 3 anchors to plan-level3plus.md

### Phase 3: Composed Level Templates
- [x] Propagate anchors to level_1/ (4 files)
- [x] Propagate anchors to level_2/ (5 files)
- [x] Propagate anchors to level_3/ (6 files)
- [x] Propagate anchors to level_3+/ (6 files)

### Phase 4: Validation
- [x] Update check-anchors.sh to scan spec document files
- [x] Run full test suite
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | All modified templates | check-anchors.sh |
| Unit/Integration | Existing test suite | Vitest (4184+ tests) |
| Manual | Spot-check anchor pairs in templates | Visual inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 126 (full spec doc indexing) | Internal | Green (complete) | Anchors would have no effect without indexing |
| Anchor infrastructure (extractAnchors, resolveAnchorKey) | Internal | Green (existing) | Zero code changes needed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Anchor tags break template rendering or test suite
- **Procedure**: `git checkout HEAD~1 -- .opencode/skill/system-spec-kit/templates/` to revert all template changes
<!-- /ANCHOR:rollback -->

---
