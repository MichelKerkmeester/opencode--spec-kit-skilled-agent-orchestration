---
title: "Tasks: Custom TOC ScrollSpy - Implementation [01--anobel.com/z_archive/004-table-of-content/001-toc-scrollspy/tasks]"
description: "Task list for implementing custom TOC scroll-spy with IntersectionObserver."
trigger_phrases:
  - "tasks"
  - "custom"
  - "toc"
  - "scrollspy"
  - "implementation"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Custom TOC ScrollSpy - Implementation Breakdown

Task list for implementing custom TOC scroll-spy with IntersectionObserver.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: toc, scrollspy, implementation
- **Priority**: P1

### Input
Design documents from `.opencode/specs/01--anobel.com/z_archive/004-table-of-content/`

### Prerequisites
- **Required**: `plan.md`, `spec.md`
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:conventions -->
## 2. CONVENTIONS

### Task Format
```text
- [ ] T### [P?] [Story] Description
```

### Path Conventions
- JavaScript: `src/2_javascript/cms/`
- CSS: `src/1_css/menu/`
<!-- /ANCHOR:conventions -->

---

<!-- ANCHOR:task-groups-by-phase -->
## 3. TASK GROUPS BY PHASE

### Phase 1: Setup

- [x] T001 Create spec folder structure (spec.md, plan.md, tasks.md)
- [x] T002 Document research findings from parallel agents

---

### Phase 2: Core Implementation (User Story 1 & 2)

**Goal**: Working scroll-spy with active state detection

- [x] T010 [P] [US1,US2] Create `src/2_javascript/menu/toc_scrollspy.js` with IIFE pattern
- [x] T011 [US2] Implement section collection from `[data-toc-section]` elements
- [x] T012 [US2] Implement IntersectionObserver with configurable rootMargin
- [x] T013 [US2] Implement "first visible in zone" detection algorithm
- [x] T014 [US2] Implement scroll position fallback for edge cases
- [x] T015 [US1] Implement state application (data-toc-active, aria-current, class)
- [x] T016 [US1] Implement RAF batching for DOM updates

**Checkpoint**: Scrolling updates active TOC link with multiple styling options

---

### Phase 3: CSS Implementation (User Story 1)

**Goal**: Multi-selector CSS for flexible styling

- [x] T020 [P] [US1] Create `src/1_css/menu/toc_scrollspy.css`
- [x] T021 [US1] Add `[data-toc-active="true"]` selector styles
- [x] T022 [US1] Add `.is--current` class selector styles
- [x] T023 [US1] Add `[aria-current="true"]` selector styles
- [x] T024 [US1] Add `.w--current` selector for Webflow compatibility
- [x] T025 [US1] Add focus indicator styles (`:focus-visible`)
- [x] T026 [US1] Add `prefers-reduced-motion` media query

**Checkpoint**: Active state can be styled via any of 4 selectors

---

### Phase 4: Configuration (User Story 4)

**Goal**: Data attribute configuration support

- [x] T030 [US4] Parse `data-toc-offset-top` from container
- [x] T031 [US4] Parse `data-toc-offset-bottom` from container
- [x] T032 [US4] Parse `data-toc-active-class` for custom class name
- [x] T033 [US4] Apply configuration to IntersectionObserver rootMargin

**Checkpoint**: Configuration via data attributes works

---

### Phase 5: Accessibility (User Story 3)

**Goal**: WCAG 2.1 AA compliance

- [x] T040 [US3] Implement focus management (move focus to target heading)
- [x] T041 [US3] Add `tabindex="-1"` to target headings for focusability
- [x] T042 [US3] Implement `prefers-reduced-motion` check for scroll behavior
- [x] T043 [US3] Handle hash URL on page load (pre-highlight)
- [x] T044 [US3] Handle hashchange event (in-page navigation)

**Checkpoint**: Keyboard and screen reader accessible

---

### Phase 6: Edge Cases & Polish

**Goal**: Robust handling of edge cases

- [x] T050 Implement graceful exit when no sections found
- [x] T051 Implement debounced resize handler for position cache
- [x] T052 Store observer reference for potential cleanup
- [x] T053 Add event delegation for TOC link clicks

**Checkpoint**: All edge cases handled gracefully

---

### Phase 7: Testing & Documentation

- [ ] T060 Test in Chrome, Firefox, Safari, Edge
- [ ] T061 Test on mobile (iOS Safari, Android Chrome)
- [ ] T062 Run axe accessibility audit
- [x] T063 Create usage example HTML in scratch/
- [x] T064 Save session context to memory/
<!-- /ANCHOR:task-groups-by-phase -->

---

<!-- ANCHOR:validation-checklist -->
## 4. VALIDATION CHECKLIST

### Code Quality
- [x] Lint passes
- [x] No console errors (code has try/catch + graceful exits)
- [x] IIFE pattern matches project convention

### Functionality
- [x] Active state updates on scroll
- [x] Multiple CSS selectors work (4 options implemented)
- [x] Configuration via data attributes works
- [x] Hash URLs handled correctly

### Accessibility
- [x] Keyboard navigation works (event delegation on click)
- [x] Screen reader announces current state (aria-current)
- [x] Focus management correct (tabindex=-1, focus())
- [x] Reduced motion respected (prefers-reduced-motion check)

### Cross-References
- **Specification**: See `spec.md` for requirements
- **Plan**: See `plan.md` for technical approach
<!-- /ANCHOR:validation-checklist -->
