---
title: "Feature Specification: Custom TOC ScrollSpy - Requirements & User Stories [001-toc-scrollspy/spec]"
description: "Custom Table of Contents implementation with flexible styling options, replacing Finsweet's Webflow-dependent approach with a standalone IntersectionObserver-based solution."
trigger_phrases:
  - "feature"
  - "specification"
  - "custom"
  - "toc"
  - "scrollspy"
  - "spec"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Custom TOC ScrollSpy - Requirements & User Stories

Custom Table of Contents implementation with flexible styling options, replacing Finsweet's Webflow-dependent approach with a standalone IntersectionObserver-based solution.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Feature
- **Tags**: toc, navigation, scrollspy, accessibility
- **Priority**: P1
- **Feature Branch**: `011-finsweet-toc-custom`
- **Created**: 2024-12-13
- **Status**: In Progress
- **Input**: Reverse engineer Finsweet TOC Attributes and create custom flexible solution

### Stakeholders
- Developer (implementation)
- Content editors (usage in Webflow)

### Purpose
Enable flexible Table of Contents navigation with active state styling through standard CSS classes and data attributes, independent of Webflow's native current state mechanism.

### Assumptions

- **Browser Support**: ES6+ modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Framework**: Vanilla JavaScript, no dependencies required
- **Integration**: Works with Webflow but not dependent on it
- **Content**: Headings (H2-H6) within designated content areas
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- Custom IntersectionObserver-based scroll detection
- Multiple styling options: data attributes, CSS classes, aria-current
- Configurable viewport detection zone (rootMargin)
- Smooth scroll with reduced motion support
- Accessibility compliance (WCAG 2.1 AA)
- Focus management on link activation

### Out of Scope
- Automatic TOC generation from headings (manual HTML structure required)
- Nested/hierarchical TOC styling (CSS responsibility)
- Server-side rendering support
- IE11 support
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:users--stories -->
## 3. USERS & STORIES

### User Story 1 - Style Active TOC Link via CSS (Priority: P0)

As a developer, I need to style the currently active TOC link using standard CSS selectors (class or data attribute) so that I can customize the appearance without Webflow's Current state panel.

**Why This Priority**: P0 because this is the core differentiator from Finsweet - the primary reason for building a custom solution.

**Independent Test**: Add `[data-toc-active="true"]` styles to CSS, scroll page, verify active link updates.

**Acceptance Scenarios**:
1. **Given** a TOC with links, **When** user scrolls to a section, **Then** the corresponding link receives `data-toc-active="true"` attribute
2. **Given** a TOC link is active, **When** user scrolls to different section, **Then** previous link loses active state, new link gains it
3. **Given** CSS rule `[data-toc-active="true"] { font-weight: bold; }`, **When** link becomes active, **Then** it appears bold

---

### User Story 2 - Accurate Scroll Position Detection (Priority: P0)

As a user, I need the TOC to accurately highlight the section I'm currently reading so that I always know my position in the document.

**Why This Priority**: P0 because inaccurate detection defeats the purpose of a TOC.

**Independent Test**: Scroll through document, verify correct section highlighted at all scroll positions.

**Acceptance Scenarios**:
1. **Given** multiple sections, **When** first section enters top 20% of viewport, **Then** its TOC link becomes active
2. **Given** fast scrolling, **When** multiple sections pass quickly, **Then** correct section is highlighted without flicker
3. **Given** page load with URL hash (#section-id), **When** page renders, **Then** correct TOC link is pre-highlighted

---

### User Story 3 - Accessible Navigation (Priority: P1)

As a screen reader user, I need the TOC to announce the current section and support keyboard navigation so that I can navigate the document effectively.

**Why This Priority**: P1 because accessibility is essential but depends on core functionality working first.

**Independent Test**: Navigate TOC with keyboard and screen reader, verify announcements.

**Acceptance Scenarios**:
1. **Given** TOC container, **When** screen reader encounters it, **Then** announces "Table of contents, navigation"
2. **Given** active TOC link, **When** focused, **Then** screen reader announces "current" state via aria-current
3. **Given** reduced motion preference, **When** clicking TOC link, **Then** scroll is instant, not animated

---

### User Story 4 - Configurable Detection Zone (Priority: P2)

As a developer, I need to configure the viewport detection zone via data attributes so that I can adjust for fixed headers and different content layouts.

**Why This Priority**: P2 because default values work for most cases.

**Independent Test**: Set `data-toc-offset-top="100px"`, verify detection zone shifts.

**Acceptance Scenarios**:
1. **Given** `data-toc-offset-top="80px"` on container, **When** section reaches 80px from top, **Then** it becomes active
2. **Given** `data-toc-offset-bottom="70%"` on container, **When** section is in bottom 70%, **Then** it's ignored for activation
<!-- /ANCHOR:users--stories -->

---

<!-- ANCHOR:functional-requirements -->
## 4. FUNCTIONAL REQUIREMENTS

### Core Detection
- **REQ-FUNC-001:** System MUST use IntersectionObserver for scroll detection
- **REQ-FUNC-002:** System MUST detect sections via `[data-toc-section]` attribute
- **REQ-FUNC-003:** System MUST apply active state to links via `[data-toc-link]` attribute matching

### State Management
- **REQ-FUNC-010:** System MUST apply `data-toc-active="true"` to active link
- **REQ-FUNC-011:** System MUST apply `aria-current="true"` to active link
- **REQ-FUNC-012:** System MUST apply configurable CSS class (default: `is--current`) to active link
- **REQ-FUNC-013:** System MUST ensure only ONE link is active at any time

### Configuration
- **REQ-FUNC-020:** System MUST support `data-toc-offset-top` for top margin configuration
- **REQ-FUNC-021:** System MUST support `data-toc-offset-bottom` for bottom margin configuration
- **REQ-FUNC-022:** System MUST support `data-toc-active-class` for custom class name

### Accessibility
- **REQ-FUNC-030:** System MUST move focus to target section heading after TOC link click
- **REQ-FUNC-031:** System MUST respect `prefers-reduced-motion` for scroll behavior

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - CSS Styling | REQ-FUNC-010, REQ-FUNC-011, REQ-FUNC-012 | Multiple selector options |
| Story 2 - Detection | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-013 | Core IntersectionObserver |
| Story 3 - Accessibility | REQ-FUNC-011, REQ-FUNC-030, REQ-FUNC-031 | ARIA + focus + motion |
| Story 4 - Configuration | REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022 | Data attribute config |
<!-- /ANCHOR:functional-requirements -->

---

<!-- ANCHOR:non-functional-requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Observer callback must complete in <16ms (60fps budget)
- **NFR-P02**: DOM updates batched via requestAnimationFrame

### Usability
- **NFR-U01**: WCAG 2.1 Level AA compliance
- **NFR-U02**: Keyboard navigable (Tab, Enter/Space)
- **NFR-U03**: Focus indicators visible on all interactive elements
<!-- /ANCHOR:non-functional-requirements -->

---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Data Boundaries
- What happens when no sections have `[data-toc-section]`? → Script exits gracefully, no errors
- What happens when TOC links don't match any sections? → Links remain inactive

### Scroll Scenarios
- What happens with very short sections (<20% viewport)? → Fallback to scroll position calculation
- What happens with very long sections (>viewport height)? → "First visible" strategy keeps section active
- What happens on fast scroll? → RAF batching prevents flicker

### State Transitions
- What happens on page load with hash URL? → Pre-highlight matching link immediately
- What happens when content changes dynamically? → MutationObserver can re-observe (optional)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: Active state updates within 1 scroll frame (16ms)
- **SC-002**: Zero console errors during normal operation
- **SC-003**: Passes axe accessibility audit with 0 critical/serious issues
- **SC-004**: Works without Webflow dependency (standalone HTML test)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:dependencies--risks -->
## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| IntersectionObserver API | Browser | Green | Core functionality unavailable |
| requestAnimationFrame | Browser | Green | Performance degradation |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Short sections missed by IO | Med | Med | Scroll position fallback |
| R-002 | Browser IO inconsistency | Low | Low | Test across browsers |
<!-- /ANCHOR:dependencies--risks -->

---

<!-- ANCHOR:out-of-scope -->
## 9. OUT OF SCOPE

- **Auto-generation of TOC**: Developer must create HTML structure manually
- **Nested highlight propagation**: Parent links don't auto-highlight when child is active
- **Multiple active sections**: Only one section active at a time
<!-- /ANCHOR:out-of-scope -->

---

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

All questions resolved during research phase.
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:appendix -->
## 11. APPENDIX

### References
- Finsweet TOC Attributes: https://finsweet.com/attributes/table-of-contents
- Finsweet GitHub: https://github.com/finsweet/attributes/tree/master/packages/toc
- MDN IntersectionObserver: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
- WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/

### Key Finding from Research

**Finsweet does NOT use IntersectionObserver** - it relies entirely on Webflow's native `w--current` class mechanism. Our implementation provides true scroll-based detection with custom styling options.
<!-- /ANCHOR:appendix -->

---

<!-- ANCHOR:working-files -->
## 12. WORKING FILES

### File Organization During Development

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test HTML, draft code | Temporary (git-ignored) |
| `memory/` | Session context, research findings | Permanent (git-tracked) |
| Root | spec.md, plan.md, tasks.md | Permanent (git-tracked) |
<!-- /ANCHOR:working-files -->

---

<!-- ANCHOR:changelog -->
## 13. CHANGELOG

### Version History

#### v1.0 (2024-12-13)
**Initial specification based on Finsweet reverse engineering**
<!-- /ANCHOR:changelog -->
