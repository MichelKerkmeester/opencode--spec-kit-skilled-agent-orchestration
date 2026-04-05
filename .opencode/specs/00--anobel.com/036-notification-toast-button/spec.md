---
title: "Feature Specification: CMS-Driven Button in Notification Toast"
description: "The notification toast on anobel.com supports a Button and URL field in the Meldingen CMS collection, but these fields are never rendered or used. Editors cannot add a call-to-action link to any alert."
trigger_phrases:
  - "notification toast button"
  - "meldingen button"
  - "alert button"
  - "toast cta"
  - "nav notifications button"
  - "data-alert button"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: CMS-Driven Button in Notification Toast

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-04 |
| **Branch** | `036-notification-toast-button` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Webflow CMS collection "Meldingen" already includes `Button` (plain text) and `URL` (link) fields intended to add a call-to-action link to notification toasts. However, neither the Webflow Designer template nor `nav_notifications.js` renders or handles these fields, so they are silently ignored. Editors who populate them see no effect on the live site.

### Purpose

Surface the CMS Button and URL fields as a visible, clickable text link inside the notification toast, shown only when the CMS Button field is non-empty.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a `data-alert="button"` link element to the Webflow Designer alert item template, with CMS bindings for text content (`Button` field) and `href` (`URL` field)
- Extend `nav_notifications.js` to parse the button element and hide it when its text content is empty (~10-15 LOC)
- Add `target="_blank" rel="noopener noreferrer"` when the URL is an external link
- Create a Webflow Designer configuration guide (webflow\_guide.md) in the spec folder

### Out of Scope

- Alert filtering, dismissal, or scheduling logic — these are unrelated to the button feature
- New CMS fields — `Button` and `URL` already exist in "Meldingen"
- Styling changes to the toast container itself (only the new button element is styled)
- Changes to any alert that does not have a Button value set

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/2_javascript/navigation/nav_notifications.js` | Modify | Add `button` selector to CONFIG.selectors; add button visibility logic (~10-15 LOC) |
| Webflow Designer — alert item template | Configure | Add `<a data-alert="button">` element; bind text to `Button` field, `href` to `URL` field |
| webflow\_guide.md (new file in spec folder) | Create | Step-by-step guide for the Webflow Designer configuration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Button element is hidden when the CMS `Button` field is empty or whitespace-only | Toast renders with no button visible; layout is unaffected |
| REQ-002 | Button element is visible and correctly labelled when `Button` field has text | Toast shows the button with the exact CMS-provided label |
| REQ-003 | Button links to the value of the CMS `URL` field | Clicking the button navigates to the correct URL |
| REQ-004 | The `data-alert="button"` selector is added to `CONFIG.selectors` in `nav_notifications.js` | Selector is declared alongside existing selectors; no magic strings elsewhere |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | External URLs open in a new tab with `target="_blank" rel="noopener noreferrer"` | Links to external domains open a new tab; same-domain links stay in the current tab |
| REQ-006 | The Webflow Designer configuration guide documents each step with element names, attribute values, and CMS binding instructions | A developer or editor can follow the guide without prior knowledge of the implementation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A toast with a non-empty `Button` field displays the button label and navigates to `URL` on click
- **SC-002**: A toast with an empty `Button` field displays no button element and the toast layout is unchanged
- **SC-003**: The JS change is limited to `CONFIG.selectors` and the button visibility block — no modifications to filtering, dismissal, or scheduling logic
- **SC-004**: External link detection correctly adds `target="_blank"` without false positives on same-domain URLs
- **SC-005**: The Webflow Designer configuration guide is present in the spec folder and covers all Designer steps end-to-end

### Acceptance Scenarios

**Given** a Meldingen CMS item with `Button = "Read more"` and `URL = "https://anobel.com/news"`, **When** the notification toast renders, **Then** a visible link labelled "Read more" is shown inside the toast and clicking it navigates to `https://anobel.com/news`.

**Given** a Meldingen CMS item with `Button = ""` (empty), **When** the notification toast renders, **Then** no button element is visible and the toast layout is identical to its current appearance.

**Given** a Meldingen CMS item with `Button = "Visit partner site"` and `URL = "https://example.com"` (external domain), **When** the notification toast renders, **Then** clicking the button opens `https://example.com` in a new tab with `rel="noopener noreferrer"` set.

**Given** a Meldingen CMS item with `Button = "See details"` and `URL = "/over-ons"` (same-domain path), **When** the notification toast renders, **Then** clicking the button navigates within the same tab (no `target="_blank"`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Webflow Designer access required to add the `<a>` element and bind CMS fields | Feature cannot be tested end-to-end without Designer changes | Complete Designer step before JS testing; guide ensures repeatability |
| Dependency | `nav_notifications.js` must be deployed to the live Webflow site after editing | JS change is inert without the Designer element in place | Deploy JS and Designer change together in the same publish cycle |
| Risk | CMS `URL` field may be empty even when `Button` has text | Button renders with an empty `href`, producing a non-functional link | JS visibility logic should also hide the button when `href` is empty or `#` |
| Risk | External link detection regex may misclassify URLs | Wrong `target` attribute applied | Use `hostname` comparison via `new URL()` against `window.location.hostname` rather than a fragile regex |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Button visibility logic executes synchronously during toast initialisation — no additional network requests, no measurable render delay
- **NFR-P02**: No new dependencies introduced; change is self-contained within the existing `nav_notifications.js` module

### Security

- **NFR-S01**: External links must include `rel="noopener noreferrer"` to prevent reverse tabnapping
- **NFR-S02**: URL values from the CMS are rendered as `href` attributes only — no `innerHTML` or `eval` usage

### Reliability

- **NFR-R01**: If `data-alert="button"` element is absent from the DOM (e.g., not yet published in Webflow), the JS must not throw — guard with a null check before accessing the element
- **NFR-R02**: Behaviour of existing alerts (no button) must be unchanged; zero regression on dismissal, scheduling, and office-hours logic
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty `Button` field: button element is hidden; toast layout falls back to its current single-line appearance
- Whitespace-only `Button` field: treat as empty — trim before checking length
- Empty `URL` field with non-empty `Button` field: hide the button to avoid a non-functional link (or render as disabled text if UX requires — confirm with designer)
- Very long button label: inherits toast container overflow rules; no special truncation needed unless design specifies otherwise

### Error Scenarios

- `data-alert="button"` element missing from DOM: null-guard in JS; log a warning in development mode, silent in production
- `new URL(href)` throws on a malformed URL: catch the exception, default to same-tab behaviour (no `target="_blank"`)

### State Transitions

- Alert with button dismissed by user: standard dismissal path unchanged; no button-specific state to persist
- Alert re-shown (e.g., new session, cookie cleared): button visibility is re-evaluated on each initialisation pass, so state is always derived from the current DOM
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 1 JS file (~10-15 LOC), 1 Webflow Designer step, 1 guide doc |
| Risk | 6/25 | No auth, no new API, no breaking changes; Webflow deploy coordination is the main risk |
| Research | 4/20 | Pattern already established by existing bullet/close-button visibility logic |
| **Total** | **18/70** | **Level 2 — low complexity; checklist provides QA gate** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- When `Button` has text but `URL` is empty, should the button be hidden entirely or rendered as non-linked text? (Current spec: hide it — confirm with designer)
- Should the button use `target="_blank"` for all URLs, or only for external ones? (Current spec: external only — adjust if simpler is preferred)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
