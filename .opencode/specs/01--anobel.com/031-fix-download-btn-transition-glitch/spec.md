---
title: "Feature Specification: Fix Download Button Transition Glitch [01--anobel.com/031-fix-download-btn-transition-glitch/spec]"
description: "The download button at /nl/locatie flashes both the success icon and the download arrow during the ready -> idle transition."
trigger_phrases:
  - "spec"
  - "fix"
  - "download"
  - "button"
  - "transition"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Fix Download Button Transition Glitch

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2024-02-07 |
| **Branch** | `031-fix-download-btn-transition-glitch` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The download button at `/nl/locatie` shows a visual glitch during the `ready -> idle` transition. The success checkmark SVG and the download arrow SVG become visible at the same time for roughly 200-400ms, which creates an overlap flash.

The current button uses CSS transitions driven by `data-download-state` across `idle`, `downloading`, `ready`, and `fallback`. When the component leaves `ready`, its delay values disappear and the reset animations start together, so the success icon does not clear before the arrow returns.

### Purpose
Stabilize the CSS-only state transition so the success icon hides cleanly before the button returns to idle, while keeping the existing JavaScript state machine unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `src/1_css/btn_download.css`.
- Hide the success icon in the base state.
- Reveal the success icon only in the `ready` state.
- Add defensive styling for the `fallback` state.
- Preserve the regression notes about the visibility and specificity fixes.

### Out of Scope
- JavaScript changes in `btn_download.js`.
- Other button variants or unrelated pages.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/1_css/btn_download.css` | Modify | Adjust success-icon visibility, transition behavior, and fallback styling |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Success icon is hidden by default | Base-state CSS sets the success icon to a non-visible state |
| REQ-002 | Ready-state exit does not show icon overlap | The checkmark clears before the arrow fully returns during `ready -> idle` |
| REQ-003 | Fallback state has defined styling | `fallback` no longer relies on missing CSS rules |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Regression hardening accounts for persistent transitions | Base-state rules enforce immediate disappearance when leaving `ready` |
| REQ-005 | Specificity conflicts with Webflow classes are neutralized | Critical visibility rules win over `.icon--download.is--success` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The button returns from `ready` to `idle` without showing both SVGs at once.
- **SC-002**: **Given** the button is in `ready`, **When** it returns to `idle`, **Then** the success icon disappears instantly before the arrow finishes sliding back.
- **SC-003**: **Given** the fetch flow enters `fallback`, **When** the fallback state is rendered, **Then** the button still has intentional defensive styling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `data-download-state` state machine | CSS must keep matching the current state names | Do not change JavaScript logic |
| Risk | Browser keeps transition properties active outside `ready` | Ghosting can persist after the initial fix | Force `visibility: hidden` and `transition: none` in the base state |
| Risk | Webflow class selectors outrank attribute selectors | Fix may not apply in production styling | Add `!important` to the critical visibility properties |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at present. The remaining work is verification after deployment into the live Webflow/CSS environment.
<!-- /ANCHOR:questions -->

---
