---
title: "Decision Record - Performance Optimization [024-performance-optimization/decision-record]"
description: "This document records architectural and implementation decisions made during the performance optimization project for anobel.com."
trigger_phrases:
  - "decision"
  - "record"
  - "performance"
  - "optimization"
  - "decision record"
  - "024"
importance_tier: "important"
contextType: "decision"
---
# Decision Record - Performance Optimization

<!-- ANCHOR:overview -->
## Overview

This document records architectural and implementation decisions made during the performance optimization project for anobel.com.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:dr-001 -->
## DR-001: Page Visibility Safety Timeout

<!-- ANCHOR:dr-001-context -->
### Context
The site uses a `.page-ready` CSS class to reveal content after hero animations complete. If JavaScript fails or takes too long, the page remains invisible (white screen) indefinitely. This caused the 20.2s mobile LCP.
<!-- /ANCHOR:dr-001-context -->

<!-- ANCHOR:dr-001-decision -->
### Decision
**Implement a 3-second safety timeout** that force-reveals the page if `.page-ready` is not set.
<!-- /ANCHOR:dr-001-decision -->

<!-- ANCHOR:dr-001-implementation -->
### Implementation
```javascript
// global.html lines 83-92
setTimeout(function () {
  var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
  if (pw && !pw.classList.contains('page-ready')) {
    pw.classList.add('page-ready');
    console.warn('[LCP Safety] Force-revealed page after timeout');
  }
}, 3000);
```
<!-- /ANCHOR:dr-001-implementation -->

### Status: **IMPLEMENTED**

<!-- /ANCHOR:dr-001 -->

---

<!-- ANCHOR:dr-002 -->
## DR-002: TypeKit Loading Strategy

<!-- ANCHOR:dr-002-context -->
### Context
TypeKit loads synchronously in `<head>`, blocking HTML parsing and delaying all subsequent resources by 500-2000ms.
<!-- /ANCHOR:dr-002-context -->

<!-- ANCHOR:dr-002-decision -->
### Decision
**Add preconnect hints as workaround. Full async conversion deferred (Webflow-managed).**
<!-- /ANCHOR:dr-002-decision -->

<!-- ANCHOR:dr-002-implementation -->
### Implementation
```html
<!-- global.html lines 45-47 -->
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
```

### Rationale
- Preconnects provide partial improvement (-100-300ms)
- Full TypeKit async requires Webflow platform changes
- Silka fonts are self-hosted, TypeKit audit needed to determine if removable
<!-- /ANCHOR:dr-002-implementation -->

### Status: **PARTIAL (Preconnects only)**

<!-- /ANCHOR:dr-002 -->

---

<!-- ANCHOR:dr-003 -->
## DR-003: Script Bundling Strategy

<!-- ANCHOR:dr-003-context -->
### Context
14 global scripts load as separate HTTP requests, causing network overhead.
<!-- /ANCHOR:dr-003-context -->

<!-- ANCHOR:dr-003-decision -->
### Original Decision
Bundle scripts into 2 global bundles plus page-specific bundles.

### Final Decision
**REMOVED from scope per user preference.**

### Rationale
User prefers individual scripts for easier maintenance and debugging.
<!-- /ANCHOR:dr-003-decision -->

### Status: **REMOVED FROM SCOPE**

<!-- /ANCHOR:dr-003 -->

---

<!-- ANCHOR:dr-004 -->
## DR-004: GTM Delay Strategy

<!-- ANCHOR:dr-004-context -->
### Context
Google Tag Manager loads inline in head, blocking FCP by 200-400ms.
<!-- /ANCHOR:dr-004-context -->

<!-- ANCHOR:dr-004-decision -->
### Decision
**Delay GTM with requestIdleCallback + fallback.**
<!-- /ANCHOR:dr-004-decision -->

<!-- ANCHOR:dr-004-implementation -->
### Implementation
```javascript
// global.html lines 7-26
(function () {
  function loadGTM() {
    // GTM code here
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadGTM, { timeout: 3000 });
  } else {
    setTimeout(loadGTM, 2000); // Safari fallback
  }
})();
```
<!-- /ANCHOR:dr-004-implementation -->

### Status: **IMPLEMENTED**

<!-- /ANCHOR:dr-004 -->

---

<!-- ANCHOR:dr-005 -->
## DR-005: Swiper CSS Loading

<!-- ANCHOR:dr-005-context -->
### Context
Swiper CSS (18KB) loads as render-blocking, but carousel is below fold.
<!-- /ANCHOR:dr-005-context -->

<!-- ANCHOR:dr-005-decision -->
### Decision
**Convert to async loading with preload pattern.**
<!-- /ANCHOR:dr-005-decision -->

<!-- ANCHOR:dr-005-implementation -->
### Implementation
```html
<!-- home.html lines 30-32 -->
<link rel="preload" href="swiper-bundle.min.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="swiper-bundle.min.css"></noscript>
```
<!-- /ANCHOR:dr-005-implementation -->

### Status: **IMPLEMENTED**

<!-- /ANCHOR:dr-005 -->

---

<!-- ANCHOR:dr-006 -->
## DR-006: Video Poster / LCP Preload

<!-- ANCHOR:dr-006-context -->
### Context
Hero video has no poster attribute, causing 20s+ LCP on mobile.
<!-- /ANCHOR:dr-006-context -->

<!-- ANCHOR:dr-006-decision -->
### Original Decision
Add poster image as LCP element with preload.

### Final Decision
**REMOVED from scope per user preference.**
<!-- /ANCHOR:dr-006-decision -->

### Status: **REMOVED FROM SCOPE**

<!-- /ANCHOR:dr-006 -->

---

<!-- ANCHOR:dr-007 -->
## DR-007: Consent Script Architecture

<!-- ANCHOR:dr-007-context -->
### Context
Site loads both ConsentPro (301KB) and custom modal_cookie_consent.js (56KB).
<!-- /ANCHOR:dr-007-context -->

<!-- ANCHOR:dr-007-decision -->
### Decision
**Investigation required before changes. GDPR compliance is critical.**
<!-- /ANCHOR:dr-007-decision -->

### Status: **DEFERRED (Requires legal review)**

<!-- /ANCHOR:dr-007 -->

---

<!-- ANCHOR:decision-summary -->
## Decision Summary

| ID | Decision | Status |
|----|----------|--------|
| DR-001 | Safety timeout (3s) | **Implemented** |
| DR-002 | TypeKit preconnects | **Implemented (partial)** |
| DR-003 | Script bundling | **Removed from scope** |
| DR-004 | GTM delay | **Implemented** |
| DR-005 | Swiper CSS async | **Implemented** |
| DR-006 | Video poster / LCP preload | **Removed from scope** |
| DR-007 | Consent script audit | **Deferred** |

<!-- /ANCHOR:decision-summary -->

---

<!-- ANCHOR:revision-history -->
## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial decision record created |
| 2026-01-26 | Claude Opus 4.5 | Updated with final implementation status |
<!-- /ANCHOR:revision-history -->
