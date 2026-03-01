# Webflow Implementation Guide: Performance Optimization

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-guide | v2.0 -->

**Project**: anobel.com Performance Optimization  
**Version**: 1.0.0  
**Last Updated**: 2025-01-XX  
**Estimated Time**: 45-60 minutes

---

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [File Upload to R2 CDN](#2-file-upload-to-r2-cdn)
3. [Webflow Site Settings - Head Code](#3-webflow-site-settings---head-code)
4. [Webflow Site Settings - Footer Code](#4-webflow-site-settings---footer-code)
5. [Page-Specific Custom Code](#5-page-specific-custom-code)
6. [Verification Steps](#6-verification-steps)
7. [Rollback Procedure](#7-rollback-procedure)
8. [Performance Targets](#8-performance-targets)

---

## 1. Pre-Deployment Checklist

### Files to Prepare

Before deploying to Webflow, ensure these files are ready:

| File | Location | Status | Action |
|------|----------|--------|--------|
| `global.html` | `src/0_html/` | ✅ Updated | Contains critical CSS + all head/footer code |
| `shared_observers.js` | `src/2_javascript/global/` | ✅ New | Upload to R2 CDN |
| `service_worker.js` | `src/2_javascript/global/` | ✅ New | Upload to R2 CDN |
| `image_lazy_load.js` | `src/2_javascript/global/` | ✅ Updated | Already on R2 |
| Form page HTML files | `src/0_html/` | ✅ Updated | Has conditional CSS |
| Video page HTML files | `src/0_html/` | ✅ Updated | Has conditional CSS |

### Backup Current Code

**⚠️ IMPORTANT: Before making any changes in Webflow, take screenshots or copy the current custom code!**

1. Go to **Site Settings** → **Custom Code**
2. Screenshot or copy the **Head Code**
3. Screenshot or copy the **Footer Code**
4. For each page with custom code, screenshot the page-specific code

Save backups to: `.opencode/specs/01--anobel.com/029-anobel-performance-analysis/scratch/backup/`

---

## 2. File Upload to R2 CDN

### New Files to Upload

Upload these files to Cloudflare R2 CDN:

```bash
# From project root
cd /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com

# Upload shared observers
wrangler r2 object put anobel-cdn/shared_observers.js \
  --file src/2_javascript/global/shared_observers.js

# Upload service worker
wrangler r2 object put anobel-cdn/sw.js \
  --file src/2_javascript/global/service_worker.js

# Verify uploads
wrangler r2 object list anobel-cdn --prefix=shared
wrangler r2 object list anobel-cdn --prefix=sw
```

### Verify CDN URLs

After upload, verify these URLs are accessible:

- [ ] `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/shared_observers.js`
- [ ] `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/sw.js`

---

## 3. Webflow Site Settings - Head Code

### Navigation Path

1. Open **Webflow Designer**
2. Click the **⚙️ Gear icon** (Project Settings) in the left panel
3. Navigate to **Custom Code** tab
4. Find **Head Code** section

### Complete Head Code

Copy and paste the **entire content** from `src/0_html/global.html` starting from `<!-- HEADER -->` until `</script>` after the Motion.dev module (approximately lines 1-133).

The head code includes:

```html
<!-- HEADER ───────────────────────────────────────────────────── -->

<!-- 0. CRITICAL CSS (inline for FCP/LCP) -->
<style>
/* Critical CSS - ~3KB minified */
/* Includes: fluid_responsive, structure, typography, layout, performance */
:root{--font-from:18;--font-to:18;...}
/* ... rest of critical CSS ... */
</style>

<!-- 1. ANALYTICS (GTM with delay) -->
<script>
(function () {
  function loadGTM() { ... }
  // Delay: 5s mobile, 3s desktop
})();
</script>

<!-- 2. SECURITY META TAGS -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">

<!-- 3. CONNECTION HINTS -->
<link rel="preconnect" href="https://anobel-zn.b-cdn.net" crossorigin>
<link rel="preconnect" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev" crossorigin>
<!-- ... more preconnects ... -->

<!-- 4. PRELOADS -->
<link rel="preload" href="...silka-regular-webfont.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="...silka-semibold-webfont.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm" as="script" crossorigin>
<!-- ... more preloads ... -->

<!-- 5. JS DETECTION + LCP SAFETY -->
<script>
  document.documentElement.classList.add('js-enabled');
</script>
<script>
  // LCP Safety Timeout - Force page visible after timeout
  (function() {
    var isMobile = window.innerWidth < 992;
    var timeout = isMobile ? 2000 : 3000;
    setTimeout(function() {
      var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
      if (pw && !pw.classList.contains('page-ready')) {
        pw.classList.add('page-ready');
        console.warn('[LCP Safety] Force-revealed page after ' + timeout + 'ms timeout');
      }
    }, timeout);
  })();
</script>

<!-- 6. MOTION.DEV (tree-shaken) -->
<script type="module">
  try {
    const { animate, inView } = await import("https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm")
    window.Motion = { animate, inView }
    window.motion = window.Motion
    window.dispatchEvent(new CustomEvent('motion:ready'));
  } catch (error) {
    console.error('❌ Motion.dev failed to load:', error)
  }
</script>
```

---

## 4. Webflow Site Settings - Footer Code

### Navigation Path

1. Open **Webflow Designer**
2. Click the **⚙️ Gear icon** (Project Settings)
3. Navigate to **Custom Code** tab
4. Find **Footer Code** section

### Complete Footer Code

Copy and paste the content from `src/0_html/global.html` starting from `<!-- FOOTER -->` (approximately lines 137-212).

The footer code includes:

```html
<!-- FOOTER ───────────────────────────────────────────────────── -->

<!-- 1. THIRD-PARTY LIBRARIES -->
<!-- Lenis Smooth Scrolling (Desktop Only) -->
<script defer>
  if (window.matchMedia('(min-width: 992px)').matches) {
    // Dynamically load Lenis CSS and JS
    ...
  }
</script>

<!-- 2. CUSTOM SCRIPTS -->
<!-- NEW: Shared Observers (load early) -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/shared_observers.js?v=1.0.0" defer></script>

<!-- Image: Lazy Loading & Async Decoding -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/image_lazy_load.js?v=1.0.0" defer></script>

<!-- ... other existing scripts ... -->

<!-- Navigation -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_dropdown.js?v=1.3.1" defer></script>
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_mobile_menu.js?v=1.3.1" defer></script>
<!-- ... etc ... -->
```

### Add Shared Observers Script

**Important**: Add this new script near the top of the footer scripts (after Lenis, before other custom scripts):

```html
<!-- Shared Observers (consolidates IntersectionObservers) -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/shared_observers.js?v=1.0.0" defer></script>
```

---

## 5. Page-Specific Custom Code

### Form Pages (werken_bij, vacature, contact)

For each form page, add the conditional CSS loading in the page's custom code section.

#### Navigation Path

1. Open the page in **Webflow Designer**
2. Click the **⚙️ Gear icon** in the top-right (Page Settings)
3. Scroll to **Custom Code** section
4. Find **Inside <head> tag** field

#### Code for Form Pages

```html
<!-- Form CSS (conditional loading - only on form pages) -->
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_styling.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_styling.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_validation.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_validation.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_global.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_global.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_main.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_main.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_select.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_select.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_textarea.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_textarea.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_checkbox_radio.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_checkbox_radio.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_toggle.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_toggle.css?v=1.0.0"></noscript>

<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_submission.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_submission.css?v=1.0.0"></noscript>
```

**For pages with file upload (werken_bij, vacature)**, also add:
```html
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_upload.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_upload.css?v=1.0.0"></noscript>
```

### Video Pages (home, n1_dit_is_nobel, n2_isps_kade, n3_de_locatie)

#### Code for Video Pages

```html
<!-- Video CSS (conditional loading - only on video pages) -->
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/video_background_hls.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/video_background_hls.css?v=1.0.0"></noscript>
```

**For pages with hover video (n2_isps_kade)**, use instead:
```html
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/video_background_hover_hls.css?v=1.0.0" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/video_background_hover_hls.css?v=1.0.0"></noscript>
```

### Page Summary Table

| Page | Custom Head Code | Notes |
|------|------------------|-------|
| **werken_bij** | Form CSS (10 files) + Video CSS | Has file upload |
| **vacature** | Form CSS (10 files) | Has file upload |
| **contact** | Form CSS (9 files) | No file upload |
| **home** | Video CSS | Background video |
| **n1_dit_is_nobel** | Video CSS | Background video |
| **n2_isps_kade** | Video Hover CSS | Hover video |
| **n3_de_locatie** | Video CSS | Background video |

---

## 6. Verification Steps

### Pre-Publish Checks

Before publishing, verify in Webflow Designer:

- [ ] Site Settings > Custom Code > Head Code is updated
- [ ] Site Settings > Custom Code > Footer Code is updated
- [ ] Form pages have conditional CSS code
- [ ] Video pages have conditional CSS code
- [ ] Preview mode shows no console errors

### Post-Publish Verification

After publishing, test on the live site:

#### 6.1. Console Check (All Pages)

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Verify these messages appear:
   - `[SharedObservers] Registry initialized`
   - `[Lenis] Desktop smooth scrolling initialized` (desktop only)
   - No red errors

#### 6.2. Network Check (All Pages)

1. Open Chrome DevTools > Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Verify:
   - [ ] Critical CSS is inline (not separate request)
   - [ ] `shared_observers.js` loads
   - [ ] Motion.dev loads from jsdelivr

#### 6.3. Performance Check

Run Lighthouse on these pages:

| Page | Mobile Target | Desktop Target |
|------|---------------|----------------|
| Home | LCP < 4s, Score > 70 | LCP < 2.5s, Score > 85 |
| Contact | LCP < 4s, Score > 70 | LCP < 2.5s, Score > 85 |
| Service page | LCP < 4s, Score > 75 | LCP < 2.5s, Score > 90 |

#### 6.4. Functionality Check

Test these features work:

- [ ] Hero animations play on scroll
- [ ] Navigation dropdown works
- [ ] Mobile menu works
- [ ] Forms validate and submit
- [ ] Videos play (on video pages)
- [ ] Cookie consent modal works

---

## 7. Rollback Procedure

If issues occur after deployment:

### Quick Rollback (< 5 minutes)

1. Go to **Site Settings** > **Custom Code**
2. Replace Head Code with backed-up version
3. Replace Footer Code with backed-up version
4. Click **Save Changes**
5. Click **Publish**

### Per-Page Rollback

If only specific pages have issues:

1. Open the affected page in Designer
2. Go to **Page Settings** > **Custom Code**
3. Remove the conditional CSS code
4. Save and Publish

### CDN Rollback

If new JS files cause issues:

1. The old script versions are still on R2
2. Update version numbers in Webflow to use previous versions
3. Or remove the new script references entirely

---

## 8. Performance Targets

### Before Optimization (Baseline)

| Metric | Mobile | Desktop |
|--------|--------|---------|
| LCP | 20.2s | 4.1s |
| FCP | 6.2s | 1.8s |
| Lighthouse Score | 55% | 77% |

### Target After Optimization

| Metric | Mobile Target | Desktop Target |
|--------|---------------|----------------|
| LCP | < 4.0s | < 2.5s |
| FCP | < 3.0s | < 1.5s |
| Lighthouse Score | > 75% | > 90% |

### Measuring Progress

1. Run Lighthouse in Incognito mode
2. Use Mobile emulation for mobile scores
3. Run 3 times and take median
4. Record results in `.opencode/specs/01--anobel.com/029-anobel-performance-analysis/scratch/lighthouse-results.md`

---

## Appendix A: File Version History

| File | Version | Date | Changes |
|------|---------|------|---------|
| global.html | 1.3.0 | 2025-XX-XX | Added critical CSS inline |
| shared_observers.js | 1.0.0 | 2025-XX-XX | New file |
| service_worker.js | 1.0.0 | 2025-XX-XX | New file |
| image_lazy_load.js | 1.0.0 | 2025-XX-XX | New file |

---

## Appendix B: CSS Files for R2 Upload

If CSS files are not yet on R2, upload them:

```bash
# Form CSS files
for file in form_styling form_validation form_submission input_global input_main input_select input_textarea input_checkbox_radio input_toggle input_upload; do
  wrangler r2 object put anobel-cdn/${file}.css \
    --file src/1_css/form/${file}.css
done

# Video CSS files
for file in video_background_hls video_background_hover_hls video_player_hls; do
  wrangler r2 object put anobel-cdn/${file}.css \
    --file src/1_css/video/${file}.css
done
```

---

## Appendix C: Troubleshooting

### Issue: Styles not loading on form pages

**Cause**: CSS files not uploaded to R2 or wrong URLs  
**Fix**: Verify URLs are accessible, re-upload if needed

### Issue: Console error "SharedObservers is not defined"

**Cause**: Script not loaded or loaded after dependent scripts  
**Fix**: Ensure shared_observers.js is in footer code, before other scripts

### Issue: Page flashes unstyled content (FOUC)

**Cause**: Critical CSS missing or malformed  
**Fix**: Verify the `<style>` block is at the very top of head code

### Issue: LCP Safety fires unexpectedly

**Cause**: Hero scripts taking too long  
**Fix**: Check for Motion.dev loading issues in console

---

**Document End**

*Created by: Performance Optimization Analysis (10-agent parallel dispatch)*  
*Spec Folder: 029-anobel-performance-analysis*
