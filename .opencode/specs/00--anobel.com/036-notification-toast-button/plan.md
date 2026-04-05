---
title: "Implementation Plan: CMS-Driven Button in Notification Toast"
description: "Extends nav_notifications.js to show/hide a CMS-bound button element in the alert toast, with a Webflow Designer guide for template binding."
trigger_phrases:
  - "notification toast button plan"
  - "alert button implementation"
  - "nav notifications button"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: CMS-Driven Button in Notification Toast

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (vanilla, IIFE module) |
| **Framework** | Webflow CMS + custom JS |
| **Storage** | None (CMS-driven, no client-side persistence for button state) |
| **Testing** | Manual browser testing + `AnobelAlerts` debug API |

### Overview

Add ~10-15 lines to `nav_notifications.js` to detect a `data-alert="button"` element inside each alert item, hide it when its text is empty, and set `target="_blank" rel="noopener noreferrer"` for external URLs. The Webflow Designer template needs an `<a>` element added to the alert item with CMS bindings to the existing `Button` and `URL` fields.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (4 acceptance scenarios defined)
- [x] Dependencies identified (Webflow Designer access, JS deployment)

### Definition of Done
- [ ] All acceptance criteria met (4 scenarios pass)
- [ ] No console errors or warnings
- [ ] Existing alert behavior unchanged (dismissal, scheduling, office hours)
- [ ] Webflow guide complete
- [ ] JS deployed to CDN, Webflow site published
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

CMS-Rendered + JS Visibility Controller (existing pattern)

### Key Components

- **CONFIG.selectors.button**: New selector `'[data-alert="button"]'` — matches the link element inside alert items
- **`update_button_visibility()`**: New function — iterates parsed alerts, hides button when `textContent.trim()` is empty or `href` is empty/`#`, sets `target`/`rel` for external links
- **Webflow `<a>` element**: CMS-bound link in alert item template — text from `Button` field, `href` from `URL` field

### Data Flow

```
CMS "Meldingen" item
  |-- Button field --> Webflow renders <a data-alert="button">Label</a>
  |-- URL field    --> Webflow binds href="/path-or-url"
                           |
                    nav_notifications.js
                           |
                    parse_all_alerts() --> (no change, button is DOM-only)
                           |
                    update_visibility() --> update_button_visibility()
                           |                      |
                           |               For each alert:
                           |                 |-- textContent.trim() empty? --> hide
                           |                 |-- href empty or "#"?        --> hide
                           |                 |-- external URL?             --> target="_blank"
                           |
                    Toast rendered with or without button
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: JS Changes (`nav_notifications.js`)

- [ ] Add `button: '[data-alert="button"]'` to `CONFIG.selectors` (line ~33 area)
- [ ] Create `update_button_visibility()` function after `update_bullet_visibility()` (after line ~382)
  - Iterate `state.alerts`, query `button` selector in each `alert.el`
  - If element missing: skip (null-guard)
  - If `textContent.trim()` is empty OR `href` is empty/`#`: set `display: 'none'`
  - Otherwise: set `display: ''`
  - For external URLs: set `target="_blank"` and `rel="noopener noreferrer"`
  - For same-domain URLs: ensure no `target="_blank"`
- [ ] Call `update_button_visibility()` from `update_visibility()` after bullet update (line ~347 area)
- [ ] Call `update_button_visibility()` from `init()` alongside initial bullet check (line ~549 area)

### Phase 2: Webflow Designer Configuration

- [ ] Add `<a>` element inside the alert item template
- [ ] Add custom attribute `data-alert="button"` to the element
- [ ] Bind text content to CMS `Button` field
- [ ] Bind `href` to CMS `URL` field
- [ ] Style as text link button (matching toast typography)

### Phase 3: Webflow Guide + Verification

- [ ] Create `webflow_guide.md` in spec folder with step-by-step instructions
- [ ] Test all 4 acceptance scenarios from spec.md
- [ ] Verify no regression on existing alert behaviors
- [ ] Deploy JS to CDN, publish Webflow site
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 4 acceptance scenarios (button with URL, empty button, external URL, same-domain URL) | Browser + DevTools |
| Manual | Regression — dismissal, scheduling, office hours, bullet visibility | Browser + `AnobelAlerts.debug(true)` |
| Manual | Edge cases — whitespace-only button, empty URL with text, malformed URL | Browser + DevTools |
| Debug API | Verify parsed alerts still correct | `AnobelAlerts.getAll()`, `AnobelAlerts.getVisible()` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Webflow Designer access | Internal | Green | Cannot add `<a>` element or bind CMS fields |
| CDN deployment (R2) | Internal | Green | JS changes not live without upload |
| CMS `Button` + `URL` fields | Internal | Green | Already exist in "Meldingen" collection |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Button causes layout issues or broken navigation
- **Procedure**: Revert `nav_notifications.js` to previous version on CDN; the `<a>` element in Webflow is inert without JS handling it, so no Designer rollback needed
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (JS) ------> Phase 3 (Guide + Verify)
                         ^
Phase 2 (Webflow) -------+
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| JS Changes | None | Guide + Verify |
| Webflow Config | None | Guide + Verify |
| Guide + Verify | JS Changes, Webflow Config | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| JS Changes | Low | ~15 min |
| Webflow Config | Low | ~10 min |
| Guide + Verify | Low | ~20 min |
| **Total** | **Low** | **~45 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Previous JS version noted (version query param)
- [ ] CMS test item created (not production alert)
- [ ] Debug mode tested (`AnobelAlerts.debug(true)`)

### Rollback Procedure
1. Revert JS file on CDN to previous version
2. Hard-refresh site to confirm old JS loaded
3. Webflow `<a>` element is harmless without JS — no Designer rollback needed
4. If layout broken: remove `data-alert="button"` element in Designer, republish

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no persistent data affected
<!-- /ANCHOR:enhanced-rollback -->

---
