---
title: "Implementation Plan: Fix Download Button Transition Glitch [01--anobel.com/031-fix-download-btn-transition-glitch/plan]"
description: "CSS-only plan to remove the ready -> idle overlap glitch on the download button."
trigger_phrases:
  - "plan"
  - "fix"
  - "download"
  - "button"
  - "transition"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Fix Download Button Transition Glitch

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CSS in a Webflow-integrated front end |
| **Framework** | Attribute-driven component states |
| **Storage** | None |
| **Testing** | Manual browser verification / screenshot capture |

### Overview
The fix stays in `src/1_css/btn_download.css`. It hides the success icon in the base state, reveals it only in `ready`, adds fallback-state styling, and hardens the rules against persistent transitions and Webflow specificity conflicts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Glitch reproduced on `/nl/locatie`
- [x] Root cause identified in the CSS state transition
- [x] Scope limited to CSS only

### Definition of Done
- [ ] Ready-to-idle transition no longer shows overlapping icons
- [ ] Ready state still shows the intended success animation
- [ ] Fallback state has defensive styling
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CSS-only state refinement on top of the existing `data-download-state` state machine

### Key Components
- **Base state selector**: Forces the success icon to stay hidden outside `ready`.
- **Ready state selector**: Allows the success icon to appear with the intended timing.
- **Fallback state selector**: Mirrors a safe idle-like presentation when fetch fails.

### Data Flow
JavaScript continues to toggle `data-download-state`, while CSS now controls whether the success icon is visible during each state and transition path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inspect the HTML structure and existing state selectors
- [x] Reproduce the overlap glitch and identify the root cause

### Phase 2: Core Implementation
- [ ] Hide `[data-download-success]` in the base state
- [ ] Reveal the success icon only in the `ready` state
- [ ] Add fallback-state styling
- [ ] Harden the base state with `visibility: hidden` and `transition: none`
- [ ] Add `!important` where Webflow selector specificity overrides the attribute rules

### Phase 3: Verification
- [ ] Verify the overlap glitch is gone in browser testing
- [ ] Verify the success drawing animation still works in `ready`
- [ ] Verify the fallback state renders defensively
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Ready, idle, and fallback button states | Browser |
| Visual Regression | Fast screenshot capture during `ready -> idle` | `bdg` / browser-debugger-cli |
| Source Review | Specificity and transition behavior in CSS rules | Code review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `src/1_css/btn_download.css` | Internal | Green | No place to apply the CSS-only fix |
| Existing `data-download-state` values | Internal | Green | Selector logic would not match the runtime states |
| Webflow-generated icon classes | External-to-file | Yellow | Specificity can override the intended visibility rules |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new CSS breaks the success animation or causes the button to render incorrectly.
- **Procedure**: Revert the visibility, transition, and fallback-state rules added to `src/1_css/btn_download.css` and restore the prior state styling.
<!-- /ANCHOR:rollback -->

---
