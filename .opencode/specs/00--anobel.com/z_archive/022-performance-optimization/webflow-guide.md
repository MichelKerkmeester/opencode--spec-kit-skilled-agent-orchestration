# Webflow Configuration Guide - Performance Optimization


<!-- ANCHOR:overview -->
## Overview

This guide documents changes that need to be made in the Webflow Designer after the code-level performance optimizations are implemented. Some optimizations require Webflow platform configuration that cannot be done purely through custom code.

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:deployment-section -->
## DEPLOYMENT SECTION

### Pre-Deployment Checklist

Before deploying any changes to Webflow:

- [ ] **Backup Current Custom Code**
  - Go to **Project Settings > Custom Code**
  - Copy ALL code from Head Code section to a local file (e.g., `backup-head-YYYY-MM-DD.html`)
  - Copy ALL code from Body Code section to a local file (e.g., `backup-body-YYYY-MM-DD.html`)
  - For each page with custom code, backup those too

- [ ] **Document Current PageSpeed Scores**
  - Run PageSpeed Insights on https://www.anobel.com/
  - Record Mobile scores: Performance, LCP, TBT, CLS
  - Record Desktop scores: Performance, LCP, TBT, CLS
  - Save screenshot or export PDF for comparison

- [ ] **Verify CDN Script Versions**
  - Check that all R2-hosted scripts referenced in the code are deployed
  - Current CDN base: `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/`

---

### Deployment Steps

#### Step 1: Deploy Global Code (All Pages)

**Location:** Webflow Designer > Project Settings > Custom Code

##### Head Code (Project Settings > Custom Code > Head Code)

Copy the entire HEADER section from `src/0_html/global.html`:

```html
<!-- HEADER ───────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     1. ANALYTICS (inline, must fire early)
─────────────────────────────────────────────────────────────── -->

<!-- Google Tag Manager (Delayed for LCP) -->
<script>
  (function () {
    function loadGTM() {
      (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({
          'gtm.start':
            new Date().getTime(), event: 'gtm.js'
        }); var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', 'GTM-KG3LQ9MH');
    }
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadGTM, { timeout: 3000 });
    } else {
      setTimeout(loadGTM, 2000);
    }
  })();
</script>
<!-- End Google Tag Manager -->

<!-- ───────────────────────────────────────────────────────────────
     2. SECURITY META TAGS
─────────────────────────────────────────────────────────────── -->

<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">

<!-- ───────────────────────────────────────────────────────────────
     3. CONNECTION HINTS (preconnect, dns-prefetch)
─────────────────────────────────────────────────────────────── -->

<!-- Preconnect -->
<link rel="preconnect" href="https://anobel-zn.b-cdn.net" crossorigin>
<link rel="preconnect" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev" crossorigin>
<link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
<link rel="preconnect" href="https://d3e54v103j8qbb.cloudfront.net" crossorigin>

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://assets-global.website-files.com">
<link rel="dns-prefetch" href="https://unpkg.com">

<!-- ───────────────────────────────────────────────────────────────
     4. PRELOADS (critical resources)
─────────────────────────────────────────────────────────────── -->

<!-- Fonts -->
<link rel="preload"
  href="https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6726274a716cce6e0304c5a7_silka-regular-webfont.woff2"
  as="font" type="font/woff2" crossorigin>
<link rel="preload"
  href="https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6726274abd17ff787446fd05_silka-semibold-webfont.woff2"
  as="font" type="font/woff2" crossorigin>

<!-- Third-party -->
<link rel="preload" href="https://unpkg.com/lenis@1.2.3/dist/lenis.css" as="style">
<link rel="preload" href="https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm" as="script" crossorigin>

<!-- Custom Scripts -->
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/dropdown.js?v=1.2.31" as="script">
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/mobile_menu.js?v=1.2.31" as="script">
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/modal_cookie_consent.js?v=1.2.32"
  as="script">

<!-- ───────────────────────────────────────────────────────────────
     5. JS DETECTION
─────────────────────────────────────────────────────────────── -->

<script>
  document.documentElement.classList.add('js-enabled');
</script>

<script>
  // LCP Safety Timeout - Force page visible after 3s if hero animation fails
  setTimeout(function () {
    var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
    if (pw && !pw.classList.contains('page-ready')) {
      pw.classList.add('page-ready');
      console.warn('[LCP Safety] Force-revealed page after timeout');
    }
  }, 3000);
</script>

<!-- ───────────────────────────────────────────────────────────────
     6. MODULE SCRIPTS (ES modules, non-blocking)
─────────────────────────────────────────────────────────────── -->

<!-- Motion.dev -->
<script type="module">
  console.log('Motion.dev import starting...')

  try {
    const {
      // Core Animation Functions
      animate,
      scroll,
      inView,
      hover,
      press,
      resize,
      // Utility Functions
      delay,
      frame,
      mix,
      spring,
      stagger,
      transform,
      wrap,
      // Motion Values
      motionValue,
      mapValue,
      transformValue,
      springValue,
      // Renderers
      attrEffect,
      propEffect,
      styleEffect,
      svgEffect
    } = await import("https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm")

    // Make functions globally available
    window.Motion = {
      animate, scroll, inView, hover, press, resize,
      delay, frame, mix, spring, stagger, transform, wrap,
      motionValue, mapValue, transformValue, springValue,
      attrEffect, propEffect, styleEffect, svgEffect
    }

    // Also make available as lowercase for existing code
    window.motion = window.Motion

    console.log('Motion.dev loaded successfully!')
    console.log('Available at window.Motion:', Object.keys(window.Motion))

  } catch (negative) {
    console.negative('Motion.dev failed to load:', negative)
  }
</script>
```

##### Body Code (Project Settings > Custom Code > Footer Code)

Copy the entire FOOTER section from `src/0_html/global.html`:

```html
<!-- FOOTER ───────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     1. THIRD-PARTY LIBRARIES (load first, others depend on these)
─────────────────────────────────────────────────────────────── -->

<!-- Lenis Smooth Scrolling -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1.2.3/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.2.3/dist/lenis.min.js" defer></script>
<script defer>
  // Initialize Lenis after library loads
  function initLenis() {
    // Check if Lenis is loaded
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not loaded yet, retrying...');
      setTimeout(initLenis, 100);
      return;
    }

    // Initialize Lenis with autoRaf
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.25,
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      overscroll: true,
      infinite: false,
      anchors: true,
    });

    // Expose Lenis globally for modal scroll lock
    window.lenis = lenis;

    console.log('Lenis smooth scrolling initialized');
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else {
    // DOM is already loaded
    initLenis();
  }
</script>

<!-- ───────────────────────────────────────────────────────────────
     2. CUSTOM SCRIPTS
─────────────────────────────────────────────────────────────── -->

<!-- Attribute Cleanup -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/attribute_cleanup.js?v=1.1.1" defer></script>

<!-- Security: External Links -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/security_external_links.js?v=1.0.0" defer></script>

<!-- SEO: Hreflang Tags -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/seo_hreflang.js?v=1.0.0" defer></script>

<!-- CMS: Conditional Visibility -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/conditional_visibility.js?v=1.2.31" defer></script>

<!-- Browser -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/browser_change_page_title.js?v=1.2.31" defer></script>

<!-- Cookie Consent -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/modal_cookie_consent.js?v=1.2.32" defer></script>

<!-- Accordion -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/accordion.js?v=1.2.31" defer></script>

<!-- Navigation -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_notifications.js?v=1.1.23" defer></script>
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_dropdown.js?v=1.3.0" defer></script>
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_mobile_menu.js?v=1.3.0" defer></script>
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_language_selector.js?v=1.2.32" defer></script>
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_back_to_top.js?v=1.2.31" defer></script>

<!-- Copyright -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/copyright.js?v=1.2.31" defer></script>
```

---

#### Step 2: Deploy Home Page Code

**Location:** Webflow Designer > Pages > Home > Page Settings > Custom Code

##### Home Page Head Code

Copy the HEADER section from `src/0_html/home.html`:

```html
<!-- HEADER ───────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     1. CONNECTION HINTS (preconnect, dns-prefetch)
─────────────────────────────────────────────────────────────── -->

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev">

<!-- Preconnect -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev" crossorigin>

<!-- ───────────────────────────────────────────────────────────────
     2. PRELOADS (critical resources)
─────────────────────────────────────────────────────────────── -->

<!-- Third-party -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" as="script">
<link rel="preload" href="https://cdn.jsdelivr.net/npm/hls.js@1.6.11" as="script">

<!-- Custom Scripts -->
<link rel="preload" href="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/hero_video.js?v=1.3.13" as="script">

<!-- ───────────────────────────────────────────────────────────────
     3. THIRD-PARTY CSS
─────────────────────────────────────────────────────────────── -->

<!-- Swiper CSS (async - below fold) -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"></noscript>
```

##### Home Page Body Code (Footer)

Copy the FOOTER section from `src/0_html/home.html`:

```html
<!-- FOOTER ───────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     1. THIRD-PARTY LIBRARIES (load first, others depend on these)
─────────────────────────────────────────────────────────────── -->

<!-- Swiper -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>

<!-- HLS.js -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.6.11" defer></script>

<!-- ───────────────────────────────────────────────────────────────
     2. CUSTOM SCRIPTS (depend on libraries above)
─────────────────────────────────────────────────────────────── -->

<!-- Hero: Video (Depends on HLS) -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/hero_video.js?v=1.3.14" defer></script>

<!-- Video: HLS - Background (Depends on HLS) -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/video_background_hls.js?v=1.2.32" defer></script>

<!-- Marquee: Brands (Depends on Swiper) -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/marquee_brands.js?v=1.2.33" defer></script>

<!-- Link: Hero -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/link_hero.js?v=1.2.31" defer></script>

<!-- CMS: Responsive Limit -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/responsive_limit.js?v=1.2.31" defer></script>

<!-- ───────────────────────────────────────────────────────────────
     3. LAZY-LOADED (non-critical, load after page ready)
─────────────────────────────────────────────────────────────── -->

<!-- Finsweet: CMS Nest -->
<script>
     window.addEventListener("load", () => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsnest@1/cmsnest.js";
          document.body.appendChild(script);
     });
</script>
```

---

#### Step 3: Deployment Order

**Important:** Deploy in this exact order to avoid dependency issues:

1. **Project Settings > Custom Code > Head Code** (global.html HEADER)
2. **Project Settings > Custom Code > Footer Code** (global.html FOOTER)
3. **Home Page Settings > Custom Code > Head Code** (home.html HEADER)
4. **Home Page Settings > Custom Code > Body Code** (home.html FOOTER)
5. **Save all changes**
6. **Publish site**

---

### Post-Deployment Verification

#### Webflow Preview Testing

1. Open Webflow Designer
2. Click "Preview" button (eye icon)
3. Open browser DevTools (F12 or Cmd+Option+I)
4. Check Console tab for:
   - `Motion.dev loaded successfully!` message
   - `Lenis smooth scrolling initialized` message
   - No red errors related to scripts

#### Browser Console Checks

After publishing, visit the live site and verify:

```javascript
// Check Motion.dev loaded
console.log(window.Motion); // Should show object with animate, scroll, etc.

// Check Lenis loaded
console.log(window.lenis); // Should show Lenis instance

// Check for any script errors
// Look for red error messages in console
```

#### Expected Console Output (Healthy Site)

```
Motion.dev import starting...
Motion.dev loaded successfully!
Available at window.Motion: (18) ['animate', 'scroll', 'inView', ...]
Lenis smooth scrolling initialized
```

#### PageSpeed Testing After Publish

1. Wait 5-10 minutes after publish (CDN propagation)
2. Run PageSpeed Insights: https://pagespeed.web.dev/
3. Test URL: https://www.anobel.com/
4. Compare scores to pre-deployment baseline:
   - **Target Mobile Performance:** 70+ (from ~50)
   - **Target LCP:** <4s (from ~8s)
   - **Target TBT:** <600ms (from ~1200ms)

#### Functional Testing Checklist

- [ ] Homepage hero video plays correctly
- [ ] Navigation dropdown works on hover/click
- [ ] Mobile menu opens and closes
- [ ] Smooth scrolling works (Lenis)
- [ ] Cookie consent modal appears
- [ ] Brand marquee animates
- [ ] Back to top button appears on scroll
- [ ] Language selector functions

---

### Rollback Instructions

If issues occur after deployment:

#### Quick Rollback (Webflow UI)

1. Go to **Project Settings > Custom Code**
2. Replace Head Code with backed-up `backup-head-YYYY-MM-DD.html`
3. Replace Footer Code with backed-up `backup-body-YYYY-MM-DD.html`
4. Do the same for any page-specific custom code
5. **Save and Publish**

#### Webflow Version History Rollback

1. Open Webflow Designer
2. Click the clock icon (Version History) in the left sidebar
3. Select a backup point from before the deployment
4. Click "Restore" to revert

#### Partial Rollback (Script-by-Script)

If only specific functionality is broken:

1. Identify the problematic script in browser console
2. Comment out that specific `<script>` tag in Webflow
3. Test in preview
4. Publish if resolved
5. Debug the script separately

#### CDN Script Rollback

If a CDN-hosted script is broken:

1. Locate the previous version in R2 bucket
2. Update the version query parameter in Webflow custom code
   - Example: Change `?v=1.3.14` to `?v=1.3.13`
3. Save and publish

---

<!-- /ANCHOR:deployment-section -->

<!-- ANCHOR:priority-1-typekit-font-loading -->
## Priority 1: TypeKit Font Loading

### Current Issue
TypeKit scripts are loaded synchronously, blocking rendering by 500-2000ms.

### Check in Webflow

1. **Navigate to Project Settings > Fonts**
   - Check if TypeKit fonts are configured here
   - Verify which fonts are from TypeKit vs self-hosted (Silka)

2. **Audit Font Usage**
   - If TypeKit fonts are NOT used (Silka covers all needs):
     - Remove TypeKit integration from Project Settings
   - If TypeKit fonts ARE needed:
     - Custom code workaround is required (see global.html changes)

3. **Font Loading Options in Webflow**
   - Project Settings > Fonts > Custom Code
   - Add font-display CSS if Webflow allows:
   ```css
   @font-face {
     font-display: swap;
   }
   ```

---

<!-- /ANCHOR:priority-1-typekit-font-loading -->

<!-- ANCHOR:priority-2-image-widthheight-attributes -->
## Priority 2: Image Width/Height Attributes

### Why This Matters
Missing width/height causes layout shifts (CLS) as images load.

### Steps in Webflow Designer

1. **For CMS Images**
   - Go to CMS Collection settings
   - For each image field, set recommended dimensions
   - This helps Webflow output width/height attributes

2. **For Static Images**
   - Webflow typically handles this automatically
   - Verify in exported HTML that width/height are present

3. **Verification**
   - Use Chrome DevTools to check `<img>` elements have width/height
   - Run PageSpeed Insights and check CLS score

---

<!-- /ANCHOR:priority-2-image-widthheight-attributes -->

<!-- ANCHOR:priority-3-swipercarousel-configuration -->
## Priority 3: Swiper/Carousel Configuration

### Current Issue
Full Swiper bundle (140KB) loads but only ~30% of features are used.

### Steps in Webflow

1. **Identify Carousels Using Swiper**
   - Review pages using swiper components
   - Document which Swiper features are actually used:
     - Autoplay (marquee)
     - Navigation arrows
     - Pagination dots
     - Loop functionality

2. **Custom Swiper Build**
   - Cannot be done in Webflow directly
   - Requires custom code with modular Swiper import
   - Document features needed for custom build

---

<!-- /ANCHOR:priority-3-swipercarousel-configuration -->

<!-- ANCHOR:priority-4-consentpro-vs-custom-cookie-consent -->
## Priority 4: ConsentPro vs Custom Cookie Consent

### Current State
Site loads both:
- ConsentPro (301KB, Webflow/Finsweet injected)
- Custom modal_cookie_consent.js (56KB)

### Investigation Required

1. **Check Finsweet Integration**
   - Project Settings > Integrations
   - Is Finsweet Cookie Consent enabled?
   - What version/configuration?

2. **Document ConsentPro Features Used**
   - Banner display
   - Category management
   - Consent storage
   - Script blocking

3. **Compare with Custom Implementation**
   - Does custom modal duplicate ConsentPro functionality?
   - Can one be removed safely?
   - GDPR compliance implications (legal review needed)

---

<!-- /ANCHOR:priority-4-consentpro-vs-custom-cookie-consent -->

<!-- ANCHOR:priority-5-script-loading-order -->
## Priority 5: Script Loading Order

### What Webflow Manages
- jQuery loading (body end, currently blocking)
- webflow.js loading (body end, currently blocking)
- Custom code injection points

### Workaround via Custom Code

Since Webflow auto-injects jQuery/webflow.js, the defer attribute cannot be added directly. The custom code in global.html handles workarounds via:
- Resource hints (preconnect)
- Delayed loading patterns
- requestIdleCallback for non-critical scripts

---

<!-- /ANCHOR:priority-5-script-loading-order -->

<!-- ANCHOR:verification-checklist-after-webflow-changes -->
## Verification Checklist After Webflow Changes

### Before Publishing

- [ ] TypeKit status verified (needed vs removable)
- [ ] CMS image dimensions configured
- [ ] Swiper features documented for custom build
- [ ] ConsentPro configuration documented

### After Publishing

- [ ] Run PageSpeed Insights (Mobile)
- [ ] Check CLS score for layout shift issues
- [ ] Test video playback on mobile
- [ ] Test cookie consent functionality
- [ ] Verify all interactive elements work

---

<!-- /ANCHOR:verification-checklist-after-webflow-changes -->

<!-- ANCHOR:webflow-limitations -->
## Webflow Limitations

These optimizations **cannot** be done in Webflow and require custom code:

| Optimization            | Why Custom Code Needed             |
| ----------------------- | ---------------------------------- |
| TypeKit async loading   | Webflow injects script tags        |
| jQuery/webflow.js defer | Webflow auto-injects without defer |
| Critical CSS inlining   | Webflow generates single CSS file  |
| GTM delay               | Requires JavaScript wrapper        |
| Preconnect hints        | Requires `<head>` modification     |

---

<!-- /ANCHOR:webflow-limitations -->

<!-- ANCHOR:revision-history -->
## Revision History

| Date       | Author          | Changes                                        |
| ---------- | --------------- | ---------------------------------------------- |
| 2026-01-26 | Claude Opus 4.5 | Initial Webflow guide created                  |
| 2026-01-26 | Claude Opus 4.5 | Removed video poster section per user decision |
| 2026-01-26 | Claude Opus 4.5 | Added comprehensive deployment section         |

<!-- /ANCHOR:revision-history -->
