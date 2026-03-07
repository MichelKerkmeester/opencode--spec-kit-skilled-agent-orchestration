---
title: "Tasks: Marquee Drag/Swipe With Persistent Autoplay - anobel.com"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "marquee"
  - "swiper"
  - "drag"
  - "swipe"
  - "autoplay"
  - "036"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Marquee Drag/Swipe With Persistent Autoplay - anobel.com

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm release query version target replacing `v=1.2.35` (HTML bundle references)
- [ ] T002 Confirm complete reference inventory for marquee bundles in HTML files (`src/0_html/**/*.html`)
- [ ] T003 [P] Capture baseline behavior notes for desktop/mobile marquee interaction (`marquee_brands.js`, `marquee_clients.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update Swiper config to allow drag/swipe in brands marquee while preserving autoplay (`src/2_javascript/swiper/marquee_brands.js`)
- [ ] T005 Update Swiper config to allow drag/swipe in clients marquee while preserving autoplay (`src/2_javascript/swiper/marquee_clients.js`)
- [ ] T006 Regenerate minified brands bundle (`src/2_javascript/z_minified/swiper/marquee_brands.min.js`)
- [ ] T007 Regenerate minified clients bundle (`src/2_javascript/z_minified/swiper/marquee_clients.min.js`)
- [ ] T008 Bump brands bundle query version in all referencing pages (`src/0_html/home.html`, `src/0_html/contact.html`, `src/0_html/werken_bij.html`, `src/0_html/services/d1_bunkering.html`, `src/0_html/services/d2_filtratie.html`, `src/0_html/services/d3_uitrusting.html`, `src/0_html/services/d4_maatwerk.html`, `src/0_html/nobel/n1_dit_is_nobel.html`, `src/0_html/nobel/n2_isps_kade.html`, `src/0_html/nobel/n3_de_locatie.html`, `src/0_html/nobel/n4_het_team.html`, `src/0_html/nobel/n5_brochures.html`)
- [ ] T009 Bump clients bundle query version in webshop page (`src/0_html/services/d5_webshop.html`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Test desktop drag interaction and autoplay continuity for brands marquee (representative brands pages)
- [ ] T011 Test mobile swipe interaction and autoplay continuity for brands marquee (mobile viewport/device)
- [ ] T012 Test desktop/mobile interaction and autoplay continuity for clients marquee (`src/0_html/services/d5_webshop.html`)
- [ ] T013 Verify observer-driven off-screen pause and in-view restart still function (both marquee variants)
- [ ] T014 Verify no remaining `v=1.2.35` references for `marquee_brands.min.js` or `marquee_clients.min.js` (`src/0_html/**/*.html`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Interaction + autoplay verification passed on desktop and mobile
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
