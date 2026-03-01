---
title: "Feature Specification: Tab Main Component [002-tab-main-component/spec]"
description: "Attribute-based tab component for linking tab buttons to content panels via matching data attribute values."
trigger_phrases:
  - "feature"
  - "specification"
  - "tab"
  - "main"
  - "component"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Tab Main Component

Attribute-based tab component for linking tab buttons to content panels via matching data attribute values.

---

<!-- ANCHOR:objective -->
## 1. Objective

### Metadata

- **Category**: Feature
- **Tags**: tabs, navigation, components, accessibility
- **Priority**: P1
- **Created**: 2024-12-13
- **Status**: Complete

### Purpose

Enable tab-based content switching using data attributes, where tab buttons and content panels are linked by matching attribute values rather than positional index or IDs.

### Stakeholders

- Developer (implementation)
- Content editors (Webflow usage)
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:scope -->
## 2. Scope

### In Scope

- Attribute-based tab/content linking
- Animated state transitions (Motion.dev)
- Multiple styling options (data attributes, CSS classes, ARIA)
- Keyboard navigation
- Multiple tab systems per page
- Default tab configuration
- WCAG 2.1 AA accessibility

### Out of Scope

- Vertical tab orientation (CSS only)
- Tab reordering
- Dynamic tab creation
- Nested tabs
- URL hash integration
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:user-stories -->
## 3. User Stories

### US1: Switch Content by Tab Click (P0)

As a user, I want to click a tab button and see the corresponding content panel, so I can navigate between different content sections.

**Acceptance Criteria:**
- Given tabs with matching data-tab values
- When I click a tab button
- Then the matching content panel becomes visible
- And other content panels are hidden

### US2: Style Active Tab (P0)

As a developer, I want multiple ways to style the active tab, so I can customize appearance using CSS selectors.

**Acceptance Criteria:**
- Active tab receives `data-tab-active="true"`
- Active tab receives `.is--set` class
- Active tab receives `aria-selected="true"`

### US3: Set Default Active Tab (P1)

As a developer, I want to specify which tab should be active on page load, so I can control initial state.

**Acceptance Criteria:**
- Tab with `data-tab-default` attribute is active on load
- If no default specified, first tab is active

### US4: Keyboard Navigation (P1)

As a keyboard user, I want to navigate tabs using arrow keys, so I can use the interface without a mouse.

**Acceptance Criteria:**
- Arrow Right/Down activates next tab
- Arrow Left/Up activates previous tab
- Home activates first tab
- End activates last tab
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:functional-requirements -->
## 4. Functional Requirements

### Core Functionality

- **REQ-FUNC-001**: System MUST link tabs via matching data-tab values
- **REQ-FUNC-002**: System MUST show only one content panel at a time
- **REQ-FUNC-003**: System MUST apply active state to clicked tab
- **REQ-FUNC-004**: System MUST hide non-active content panels

### State Management

- **REQ-FUNC-010**: System MUST apply `data-tab-active="true"` to active tab
- **REQ-FUNC-011**: System MUST apply `.is--set` class to active tab
- **REQ-FUNC-012**: System MUST apply `aria-selected="true"` to active tab
- **REQ-FUNC-013**: System MUST apply `data-tab-visible="true"` to visible content

### Configuration

- **REQ-FUNC-020**: System MUST support `data-tab-default` for initial tab
- **REQ-FUNC-021**: System MUST support multiple independent tab containers
<!-- /ANCHOR:functional-requirements -->

---

<!-- ANCHOR:non-functional-requirements -->
## 5. Non-Functional Requirements

### Performance

- **NFR-P01**: Animation duration <=200ms
- **NFR-P02**: Layout stability (no CLS from font-weight changes)

### Accessibility

- **NFR-A01**: WCAG 2.1 Level AA compliance
- **NFR-A02**: Full keyboard navigation
- **NFR-A03**: ARIA attributes for screen readers
- **NFR-A04**: Reduced motion support
<!-- /ANCHOR:non-functional-requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. Success Criteria

- Tab click switches visible content panel
- Active state styling works via 3 selector options
- Default tab configuration works
- Keyboard navigation works
- Multiple tab systems work independently
- No console errors during operation
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:deliverables -->
## 7. Deliverables

| File | Location | Status |
|------|----------|--------|
| `tab_main.js` | `src/2_javascript/menu/` | Complete |
| `tab_main.css` | `src/1_css/menu/` | Complete |
| `README.md` | This spec folder | Complete |
<!-- /ANCHOR:deliverables -->

---

<!-- ANCHOR:references -->
## 8. References

- Related: `tab_menu.js` (visual-only tab styling)
- Related: `toc_scrollspy.js` (scroll-based navigation)
- Pattern: Follows existing IIFE + INIT_FLAG convention
<!-- /ANCHOR:references -->
