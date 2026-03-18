---
title: "Implementation Plan: Workflows-Code Skill Alignment [001-workflows-code-codebase-alignment/plan]"
description: "Implementation plan for aligning workflows-code skill documentation with actual anobel.com codebase patterns."
trigger_phrases:
  - "implementation"
  - "plan"
  - "workflows"
  - "code"
  - "skill"
  - "020"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Workflows-Code Skill Alignment

Implementation plan for aligning workflows-code skill documentation with actual anobel.com codebase patterns.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: workflows-code, skill-alignment, documentation
- **Priority**: P1-high
- **Branch**: `002-workflows-code-alignment`
- **Date**: 2024-12-22
- **Spec**: [spec.md](./spec.md)

### Summary
Update workflows-code skill files to match production patterns discovered in the anobel.com codebase. The primary gap is polling-based patterns in skill assets vs Observer-based patterns in actual code.

### Technical Context
- **Language/Version**: JavaScript ES6+
- **Primary Dependencies**: Motion.dev, Lenis, HLS.js, Botpoison
- **Target Platform**: Webflow CDN (browser)
- **Project Type**: Webflow custom code library

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Files to modify identified
- [x] Source patterns from codebase captured
- [x] Priority levels assigned

### Definition of Done (DoD)
- [ ] All P1 files rewritten/updated
- [ ] All P2 files created/updated
- [ ] P3 files created or documented for future
- [ ] Checklist verification complete

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. PROJECT STRUCTURE

### Documentation (This Feature)
```
.opencode/specs/03--commands-and-skills/z_archive/code-001-workflows-codebase-alignment/
  spec.md              # Analysis findings (complete)
  plan.md              # This file
  tasks.md             # Task breakdown
  checklist.md         # Verification items
  scratch/             # Any temp files during implementation
  memory/              # Session context
```

### Source (Skill Files to Modify)
```
.opencode/skills/workflows-code/
  assets/
    wait_patterns.js        # P1: REWRITE
    validation_patterns.js  # P1: UPDATE
    lenis_patterns.js       # P2: CREATE
    hls_patterns.js         # P3: CREATE
  references/
    observer_patterns.md    # P2: CREATE
    animation_workflows.md  # P2: UPDATE
    code_quality_standards.md # P2: UPDATE
    third_party_integrations.md # P3: CREATE
    quick_reference.md      # P3: UPDATE
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Priority 1 - Critical Fixes (2 files)

**Goal**: Fix misleading asset templates that teach deprecated patterns

**Deliverables**:
1. **wait_patterns.js** - Complete rewrite
   - Replace all polling patterns with Observer patterns
   - Add MutationObserver wrapper from `nav_notifications.js`
   - Add IntersectionObserver wrapper from `table_of_content.js`
   - Keep event-based patterns (already good)

2. **validation_patterns.js** - Update
   - Add Webflow form integration pattern from `form_submission.js`
   - Add Botpoison challenge flow
   - Keep existing SafeDOM and APIClient (still valid)

**Duration**: ~1 hour

---

### Phase 2: Priority 2 - Important Additions (4 files)

**Goal**: Document patterns that exist in code but not in skill

**Deliverables**:
1. **observer_patterns.md** (CREATE)
   - MutationObserver patterns
   - IntersectionObserver patterns
   - ResizeObserver patterns
   - Cleanup and disconnect patterns

2. **lenis_patterns.js** (CREATE)
   - Global lenis reference access
   - scrollTo() integration
   - Scroll event coordination

3. **animation_workflows.md** (UPDATE)
   - Add Motion.dev timeline() examples
   - Add stagger() patterns
   - Add inView() trigger patterns

4. **code_quality_standards.md** (UPDATE)
   - Add CSS section
   - Document custom property naming
   - Document fluid typography formula

**Duration**: ~1.5 hours

---

### Phase 3: Priority 3 - Nice to Have (3 files)

**Goal**: Complete coverage of all third-party integrations

**Deliverables**:
1. **hls_patterns.js** (CREATE)
   - HLS.js CDN loading
   - Feature detection
   - Quality management
   - Error recovery

2. **third_party_integrations.md** (CREATE)
   - Overview of all external libraries
   - CDN loading patterns
   - Version management

3. **quick_reference.md** (UPDATE)
   - Add one-liner patterns for common tasks

**Duration**: ~1 hour

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Verification Approach
Since these are documentation/template files, testing is manual:

1. **Pattern Accuracy**: Compare each updated file against source code
2. **Completeness**: Verify all patterns from source are documented
3. **Usability**: Ensure code examples are copy-paste ready

### Checklist Items
See `checklist.md` for full verification protocol

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| P1 files complete | 2/2 | Manual verification |
| P2 files complete | 4/4 | Manual verification |
| P3 files complete | 3/3 | Manual verification |
| Pattern accuracy | 100% | Compare vs source files |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. RISKS & MITIGATIONS

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Missing patterns | Med | Low | Re-scan codebase after Phase 2 |
| Over-documentation | Low | Med | Focus on patterns actually used |
| Breaking existing references | High | Low | Preserve backward-compatible APIs |

<!-- /ANCHOR:rollback -->

---

## 8. REFERENCES

### Source Files Analyzed
- `src/2_javascript/navigation/nav_notifications.js` - MutationObserver patterns
- `src/2_javascript/cms/table_of_content.js` - IntersectionObserver patterns
- `src/2_javascript/hero/hero_general.js` - Motion.dev patterns, Lenis
- `src/2_javascript/video/video_background_hls_hover.js` - HLS.js patterns
- `src/2_javascript/form/form_submission.js` - Botpoison, Webflow forms
- `src/1_css/global/fluid_responsive.css` - CSS custom properties

### Skill Files
- `.opencode/skills/workflows-code/SKILL.md` - Main orchestrator
- `.opencode/skills/workflows-code/references/` - All reference docs
- `.opencode/skills/workflows-code/assets/` - All code templates
