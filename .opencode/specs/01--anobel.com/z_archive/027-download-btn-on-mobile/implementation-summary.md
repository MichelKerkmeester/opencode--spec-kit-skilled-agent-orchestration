---
title: "Implementation Summary [029-download-btn-on-mobile/implementation-summary]"
description: "Fixed mobile download button functionality on anobel.com. The root cause was Webflow's hidden anchor overlay (.btn--interaction > .btn--link) intercepting taps before our JavaSc..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "implementation summary"
  - "029"
  - "download"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.0 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-download-btn-on-mobile |
| **Completed** | 2026-02-01 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-was-built -->
## What Was Built

Fixed mobile download button functionality on anobel.com. The root cause was Webflow's hidden anchor overlay (`.btn--interaction > .btn--link`) intercepting taps before our JavaScript handler could process them. Added CSS to disable the overlay, a spinner animation for loading feedback, and updated the iOS code path to show a brief loading state before triggering the download.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/1_css/button/btn_download.css` | Modified | Added anchor overlay fix (`pointer-events: none`) + spinner keyframes + downloading state styles |
| `src/1_css/z_minified/button/btn_download.css` | Modified | Minified CSS (1,521 bytes) |
| `src/2_javascript/molecules/btn_download.js` | Modified | Updated iOS path: show `downloading` state for 400ms with spinner before triggering download |
| `src/2_javascript/z_minified/molecules/btn_download.js` | Modified | Minified JS (1,815 bytes) |
| `src/0_html/nobel/n1_dit_is_nobel.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/nobel/n2_isps_kade.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/nobel/n3_de_locatie.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/nobel/n5_brochures.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/contact.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/services/d1_bunkering.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/services/d2_filtratie.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/services/d3_uitrusting.html` | Modified | Version v1.2.0 → v1.3.0, added CSS link |
| `src/0_html/werken_bij.html` | Modified | Version v1.2.0 → v1.3.0 (commented out) |
<!-- /ANCHOR:what-was-built -->

---

<!-- ANCHOR:key-decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Disable Webflow anchor via CSS `pointer-events: none` | Less invasive than modifying Webflow templates; can be overridden via CDN CSS |
| Added `z-index: -1` as backup | User confirmed z-index was also needed for complete fix |
| Use 400ms delay on iOS before download | Shows spinner briefly so user knows something is happening |
| Use `trigger_download()` instead of `window.open()` on iOS | Direct anchor click works better than popup which may be blocked |
| Load CSS from CDN alongside JS | Ensures CSS fixes are applied without needing Webflow custom code update |
<!-- /ANCHOR:key-decisions -->

---

<!-- ANCHOR:root-cause-analysis -->
## Root Cause Analysis

### The Problem
Webflow buttons have a hidden anchor element (`.btn--interaction > .btn--link`) with:
- `position: absolute`
- `inset: 0` (covers entire button)
- `pointer-events: auto`

On mobile touch, this anchor intercepted taps before our JavaScript handler on the `<button>` could fire.

### The Flow (Before Fix)
```
User taps button
    ↓
Anchor intercepts tap (positioned on top)
    ↓
Browser navigates to PDF URL directly
    ↓
iOS opens PDF in viewer (no download)
    ↓
No JS animation triggers
```

### The Flow (After Fix)
```
User taps button
    ↓
Anchor has pointer-events: none (CSS fix)
    ↓
Button receives click event
    ↓
JS handler fires → set state "downloading"
    ↓
Spinner shows (400ms on iOS, fetch duration on desktop)
    ↓
Download triggered → state "ready"
    ↓
Checkmark animation plays
    ↓
Reset to idle after 3 seconds
```
<!-- /ANCHOR:root-cause-analysis -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Manual (Desktop) | Pass | Download works, spinner shows, checkmark animates |
| Manual (iOS emulation) | Pass | Verified via Chrome DevTools with iPhone UA |
| Manual (Real iOS) | Pass | User confirmed "works. was due to z-index" |
| Integration | N/A | No automated tests for this component |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:known-limitations -->
## Known Limitations

1. **iOS PDF behavior**: iOS Safari will open PDFs in the browser viewer rather than downloading. Users must use "Share → Save to Files" to save the PDF. This is an iOS platform limitation, not a bug.

2. **z-index dependency**: The fix requires both `pointer-events: none` AND a lower `z-index` to fully prevent the anchor from intercepting clicks. The final fix includes both.
<!-- /ANCHOR:known-limitations -->

---

<!-- ANCHOR:cdn-deployment -->
## CDN Deployment

Files need to be uploaded to Cloudflare R2:

```bash
# Login to Cloudflare
npx wrangler login

# Upload JS
npx wrangler r2 object put anobel-cdn/btn_download.js \
  --file=src/2_javascript/z_minified/molecules/btn_download.js \
  --content-type="application/javascript" --remote

# Upload CSS
npx wrangler r2 object put anobel-cdn/btn_download.css \
  --file=src/1_css/z_minified/button/btn_download.css \
  --content-type="text/css" --remote
```

CDN URLs:
- JS: `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/btn_download.js?v=1.3.0`
- CSS: `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/btn_download.css?v=1.3.0`
<!-- /ANCHOR:cdn-deployment -->

---
