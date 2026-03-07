---
title: "Feature Specification: Marquee Drag/Swipe With Persistent Autoplay - anobel.com"
description: "Enable user drag interaction for Swiper logo marquees on desktop and mobile while preserving autoplay behavior, then ship updated minified bundles and CDN query version bumps across all referencing HTML files."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "marquee"
  - "swiper"
  - "drag"
  - "swipe"
  - "autoplay"
  - "cdn version"
  - "036"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Marquee Drag/Swipe With Persistent Autoplay - anobel.com

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-07 |
| **Branch** | `036-marquee-manipulation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Current marquee Swiper instances disable touch/mouse movement, so users cannot drag on desktop or swipe on mobile. The same modules rely on autoplay, and interaction changes must not leave autoplay permanently stopped.

The release also requires operational parity: updated source files must be minified into CDN bundles, and every HTML page referencing those bundles must receive a query version bump to avoid stale cache behavior.

### Purpose
Ship interactive logo marquees (drag + swipe) with persistent autoplay behavior, then publish synchronized minified bundles and versioned HTML references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enable pointer drag on desktop and swipe on mobile for marquee Swiper instances.
- Preserve autoplay continuity so interaction does not permanently stop marquee motion.
- Regenerate both minified marquee bundles.
- Bump CDN query versions in all HTML files that reference the touched bundles.

### Out of Scope
- Changes to non-marquee Swiper modules.
- Visual redesign or CSS spacing updates for marquee content.
- Any script version bump unrelated to `marquee_brands.min.js` and `marquee_clients.min.js`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/2_javascript/swiper/marquee_brands.js` | Modify | Enable desktop drag and mobile swipe while keeping autoplay behavior intact |
| `src/2_javascript/swiper/marquee_clients.js` | Modify | Enable desktop drag and mobile swipe while keeping autoplay behavior intact |
| `src/2_javascript/z_minified/swiper/marquee_brands.min.js` | Modify | Regenerated minified output for brands marquee source updates |
| `src/2_javascript/z_minified/swiper/marquee_clients.min.js` | Modify | Regenerated minified output for clients marquee source updates |
| `src/0_html/home.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/contact.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/werken_bij.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/services/d1_bunkering.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/services/d2_filtratie.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/services/d3_uitrusting.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/services/d4_maatwerk.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/services/d5_webshop.html` | Modify | Bump CDN query version for `marquee_clients.min.js` |
| `src/0_html/nobel/n1_dit_is_nobel.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/nobel/n2_isps_kade.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/nobel/n3_de_locatie.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/nobel/n4_het_team.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
| `src/0_html/nobel/n5_brochures.html` | Modify | Bump CDN query version for `marquee_brands.min.js` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Marquee interaction is enabled on desktop and mobile in both source modules | Desktop click-drag and mobile swipe both move the marquee in pages using `marquee_brands` and `marquee_clients` |
| REQ-002 | Autoplay remains active after user interaction | After drag/swipe ends, marquee resumes continuous autoplay without manual refresh |
| REQ-003 | Minified bundles are synchronized with source changes | `marquee_brands.min.js` and `marquee_clients.min.js` are regenerated from updated sources |
| REQ-004 | CDN query versions are bumped everywhere touched bundles are referenced | All 13 known HTML references update from `v=1.2.35` to the same new version value in this release |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Existing visibility-based autoplay pause/resume behavior still works | Off-screen marquees stop and in-view marquees restart using existing observer logic |
| REQ-006 | Decorative marquee baseline behavior is preserved | Existing loop, speed, and non-interactive accessibility intent remain unchanged except drag/swipe enablement |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both marquee variants support desktop drag and mobile swipe on their target pages.
- **SC-002**: Autoplay recovers after interaction and does not remain permanently stopped.
- **SC-003**: Both minified bundles and all HTML CDN query references are updated in one consistent release version.
<!-- /ANCHOR:success-criteria -->

---

## 5.1 ACCEPTANCE SCENARIOS

- **AS-001**: Given a page using `marquee_brands.min.js`, when a user drags/swipes the marquee, then slides move with input and autoplay resumes afterward.
- **AS-002**: Given a page using `marquee_clients.min.js`, when a user drags/swipes the marquee, then slides move with input and autoplay resumes afterward.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Swiper runtime is loaded before marquee init retries expire | Marquee interaction config does not apply if Swiper never initializes | Keep existing retry path and verify initialization on representative pages |
| Dependency | Minification/deploy pipeline availability for `z_minified/swiper` outputs | Source updates may not reach CDN bundle artifacts | Regenerate both minified files in same change set and verify file diffs |
| Risk | Interaction changes accidentally interrupt autoplay state | Marquee appears stuck after drag/swipe | Keep autoplay persistence settings and test start/stop behavior after interaction |
| Risk | One or more HTML references miss the version bump | Mixed cache versions across pages | Use full known reference list and verify no remaining `v=1.2.35` for touched bundles |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Final query target version will be set to one consistent increment for this release (planned next patch value from `1.2.35`).
<!-- /ANCHOR:questions -->

---
