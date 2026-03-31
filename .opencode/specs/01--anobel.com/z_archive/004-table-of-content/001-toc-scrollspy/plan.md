---
title: "Implementation Plan: Custom TOC ScrollSpy - [01--anobel.com/z_archive/004-table-of-content/001-toc-scrollspy/plan]"
description: "Implementation plan for a custom Table of Contents scroll-spy solution using IntersectionObserver with flexible styling options."
trigger_phrases:
  - "implementation"
  - "plan"
  - "custom"
  - "toc"
  - "scrollspy"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Custom TOC ScrollSpy - Technical Approach & Architecture

Implementation plan for a custom Table of Contents scroll-spy solution using IntersectionObserver with flexible styling options.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: toc, scrollspy, intersectionobserver, accessibility
- **Priority**: P1
- **Branch**: `004-table-of-content`
- **Date**: 2024-12-13
- **Spec**: `.opencode/specs/01--anobel.com/z_archive/004-table-of-content/001-toc-scrollspy/spec.md`

### Summary
Build a custom TOC scroll-spy implementation that detects active sections using IntersectionObserver and applies styling through multiple mechanisms (data attributes, CSS classes, ARIA attributes), providing more flexibility than Finsweet's Webflow-dependent approach.

### Technical Context

- **Language/Version**: JavaScript ES6+
- **Primary Dependencies**: None (vanilla JS)
- **Testing**: Manual browser testing
- **Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Project Type**: Single project - `src/2_javascript/menu/`
- **Constraints**: Must follow existing IIFE + INIT_FLAG pattern from project
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Research complete (Finsweet analysis, IO best practices, accessibility)
- [x] Constraints known (browser support, no dependencies)
- [x] Success criteria measurable

### Definition of Done (DoD)
- [ ] All acceptance criteria met; manual tests passing
- [ ] Docs updated (spec/plan/tasks)
- [ ] Performance within 16ms budget
- [ ] Accessibility audit passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:project-structure -->
## 3. PROJECT STRUCTURE

### Documentation (This Feature)

```
.opencode/specs/01--anobel.com/z_archive/004-table-of-content/001-toc-scrollspy/
  spec.md              # Feature specification
  plan.md              # This file
  tasks.md             # Task breakdown
  scratch/             # Test HTML, debug files
  memory/              # Session context
```

### Source Code

```
src/
  2_javascript/
    cms/
      table_of_content.js  # Main implementation
  1_css/
    menu/
      toc_scrollspy.css    # Styling with multiple selectors
```
<!-- /ANCHOR:project-structure -->

---

<!-- ANCHOR:implementation-phases -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core Implementation

- **Goal**: Build working scroll-spy with IntersectionObserver
- **Deliverables**:
  - `toc_scrollspy.js` with IIFE pattern
  - Section detection and link matching
  - Active state management
- **Duration**: ~2 hours

### Phase 2: Styling & Configuration

- **Goal**: Add configurable options and CSS
- **Deliverables**:
  - `toc_scrollspy.css` with multi-selector support
  - Data attribute configuration parsing
  - Custom class name support
- **Duration**: ~1 hour

### Phase 3: Accessibility & Polish

- **Goal**: WCAG compliance and edge case handling
- **Deliverables**:
  - Focus management
  - Reduced motion support
  - Hash URL handling
  - Edge case fallbacks
- **Duration**: ~1 hour
<!-- /ANCHOR:implementation-phases -->

---

<!-- ANCHOR:architecture-design -->
<!-- /ANCHOR:phases -->
## 5. ARCHITECTURE DESIGN

### Data Attributes API

```html
<!-- Container (optional - for configuration) -->
<nav data-toc-container
     data-toc-offset-top="80px"
     data-toc-offset-bottom="70%"
     data-toc-active-class="is--current"
     aria-label="Table of contents">

  <!-- Links -->
  <a href="#section-1" data-toc-link>Section 1</a>
  <a href="#section-2" data-toc-link>Section 2</a>
</nav>

<!-- Sections -->
<section id="section-1" data-toc-section>...</section>
<section id="section-2" data-toc-section>...</section>
```

### State Application (All Applied Simultaneously)

```javascript
// When a link becomes active:
link.dataset.tocActive = "true";           // data-toc-active="true"
link.setAttribute("aria-current", "true"); // aria-current="true"
link.classList.add(activeClass);           // .is--current (configurable)

// When a link becomes inactive:
link.dataset.tocActive = "false";
link.removeAttribute("aria-current");
link.classList.remove(activeClass);
```

### IntersectionObserver Configuration

```javascript
const observer = new IntersectionObserver(callback, {
  root: null,                           // Viewport
  rootMargin: "-10% 0px -70% 0px",     // 20% active zone at top
  threshold: [0]                        // Single threshold for efficiency
});
```

### Detection Algorithm

```
1. Track all visible sections in Map
2. On intersection change:
   - Add/remove from visible Map
   - Determine active = first visible in document order
   - If none visible, use nearest section (scroll fallback)
3. Apply state to matching TOC link
4. Batch DOM updates via RAF
```
<!-- /ANCHOR:architecture-design -->

---

<!-- ANCHOR:testing-strategy -->
## 6. TESTING STRATEGY

### Manual Testing Checklist

- [ ] Scroll through page - correct section highlights
- [ ] Fast scroll - no flicker
- [ ] Click TOC link - smooth scroll, focus moves
- [ ] Page load with hash - correct pre-highlight
- [ ] Keyboard navigation - Tab through links
- [ ] Screen reader - announces current state
- [ ] Reduced motion - instant scroll

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
<!-- /ANCHOR:testing-strategy -->

---

<!-- ANCHOR:success-metrics -->
## 7. SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Active state update | <16ms | Performance profiling |
| Console errors | 0 | Browser DevTools |
| Accessibility issues | 0 critical | axe DevTools |
| CSS styling works | 3 selectors | Manual verification |
<!-- /ANCHOR:success-metrics -->

---

<!-- ANCHOR:risks--mitigations -->
## 8. RISKS & MITIGATIONS

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Short sections missed | Med | Med | Scroll position fallback |
| Fast scroll flicker | Low | Med | RAF batching |
| Hash URL race condition | Low | Low | Delay initial highlight |
<!-- /ANCHOR:risks--mitigations -->

---

<!-- ANCHOR:dependencies -->
## 9. DEPENDENCIES

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| IntersectionObserver | Browser API | Green (97%+ support) |
| requestAnimationFrame | Browser API | Green (99%+ support) |

### Internal Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Project IIFE pattern | Convention | Green (documented) |
| Motion.dev | Optional | Green (available at window.Motion) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:references -->
## 10. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`

### Research Sources

- Finsweet TOC: https://finsweet.com/attributes/table-of-contents
- MDN IntersectionObserver: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
- WAI-ARIA Navigation: https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html
<!-- /ANCHOR:references -->
