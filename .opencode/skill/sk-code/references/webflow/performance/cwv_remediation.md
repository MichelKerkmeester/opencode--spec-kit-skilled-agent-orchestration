---
title: Core Web Vitals Remediation Guide
description: Actionable remediation patterns for LCP, FCP, TBT, and CLS issues in Webflow sites with custom JavaScript.
---

# Core Web Vitals Remediation Guide

Actionable remediation patterns for LCP, FCP, TBT, and CLS issues in Webflow sites with custom JavaScript.

---

## 1. OVERVIEW

### Core Principle

Measure first, optimize with evidence, verify improvement with before/after PageSpeed data.

### The Four Metrics

- **LCP (Largest Contentful Paint)** - Loading performance (target: <2.5s)
- **FCP (First Contentful Paint)** - Initial render speed (target: <1.8s)
- **TBT (Total Blocking Time)** - Interactivity/responsiveness (target: <200ms)
- **CLS (Cumulative Layout Shift)** - Visual stability (target: <0.1)

### When to Use This Guide

- Performance audit shows CWV failures
- PageSpeed score below 90
- LCP exceeds 2.5s (mobile or desktop)
- Users report slow page loads

---

## 2. LCP (Largest Contentful Paint)

### Problem Patterns

1. **Page hidden until JS completes** - JavaScript controls visibility via classes
2. **Large unoptimized images** - Hero images without preload or optimization
3. **Render-blocking resources** - CSS and scripts block the critical path
4. **Video without poster** - Video elements with no fallback image

### Solution: Safety Timeout Pattern

**When to use:** Pages where JavaScript controls visibility (e.g., hero animations that set a `.page-ready` class).

**Why it matters:** If the hero animation fails or takes too long, users see a blank page indefinitely. The safety timeout guarantees page visibility after a maximum wait time.

#### Timeout Hierarchy

From Spec 031 (ADR-001): Standardize timeouts across all hero scripts to create a layered safety net:

| Component | Timeout | Rationale |
|-----------|---------|-----------|
| **Motion.dev library wait** | 1000ms | Library should load in <500ms; 1s is generous fallback |
| **Image loading wait** | 2000ms | Preloaded images load fast; 2s catches 404s and slow CDN |
| **Safety timeout (desktop)** | 3000ms | Final guarantee — page always visible within 3s |
| **Safety timeout (mobile)** | 2000ms | Faster reveal for better perceived performance on mobile |

**The chain:** Each hero script has its own timeout (1s for libraries, 2s for images). The safety timeout is the last-resort guarantee that fires independently of hero scripts.

#### Implementation (with mobile detection)

```javascript
// LCP Safety Timeout — MUST be inline in <head> (not deferred)
// Guarantees page visibility regardless of hero script success/failure
(function () {
  var is_mobile = /Mobi|Android/i.test(navigator.userAgent)
    || window.innerWidth < 768;
  var timeout = is_mobile ? 2000 : 3000;

  setTimeout(function () {
    var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
    if (pw && !pw.classList.contains('page-ready')) {
      pw.classList.add('page-ready');
      console.warn('[LCP Safety] Force-revealed page after ' + timeout + 'ms');
    }
  }, timeout);
})();
```

#### Critical: `<head>` Positioning

**The safety timeout MUST be an inline `<script>` in `<head>`** (not in `</body>` custom code):

- `<head>` scripts execute **before** deferred scripts parse
- If placed after `</body>`, deferred hero scripts may already be blocking — the safety timeout runs too late
- By placing in `<head>`, the timeout starts counting from the earliest possible moment

```
Timeline (correct — <head> placement):
  0ms   ─── Safety timeout starts (inline <head>)
  ~100ms ─── Browser begins parsing body
  ~500ms ─── Deferred scripts start executing
  2000ms ─── Safety fires (mobile) if hero not done
  3000ms ─── Safety fires (desktop) if hero not done

Timeline (wrong — </body> placement):
  0ms   ─── Browser parsing
  ~500ms ─── Deferred scripts start executing
  ~600ms ─── Safety timeout starts (too late!)
  3600ms ─── Safety fires — 600ms later than expected
```

#### Image Timeout with Promise.race

Hero scripts should wrap image loading in `Promise.race` to guarantee resolution:

```javascript
// ✅ GOOD: Image promise with timeout
promises.push(
  Promise.race([
    new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    }),
    new Promise((resolve) => setTimeout(resolve, 2000)),  // 2s timeout
  ])
);

// ❌ BAD: Image promise without timeout (waits forever on 404/hang)
promises.push(
  new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  })
);
```

See `wait_patterns.js` → `wait_for_image_with_timeout()` for a reusable implementation.

### Solution: LCP Element Preload

**When to use:** Pages with hero images that are the largest contentful element.

```html
<!-- Preload LCP image with high priority -->
<link rel="preload"
      href="/path/to/hero-image.webp"
      as="image"
      fetchpriority="high"
      type="image/webp">

<!-- For responsive images, preload the most common viewport -->
<link rel="preload"
      href="/path/to/hero-mobile.webp"
      as="image"
      fetchpriority="high"
      media="(max-width: 768px)">
```

**Impact:** -300 to 800ms LCP improvement

### Solution: Video Poster (Optional)

**When to use:** Video hero sections where the video is the LCP element.

```html
<video
  autoplay
  muted
  loop
  playsinline
  poster="/path/to/video-poster.webp"
  fetchpriority="high">
  <source src="video.mp4" type="video/mp4">
</video>
```

**Notes:**
- Poster image should be the first frame or a representative frame
- Compress aggressively (it's temporary)
- Use WebP format for best compression
- **Impact:** -3 to 5 seconds LCP improvement for HLS/streaming video

---

## 3. FCP (First Contentful Paint)

### Problem Patterns

1. **Blocking external resources** - Third-party scripts in critical path
2. **Large CSS files** - All CSS loaded before any paint
3. **Synchronous script loading** - Scripts without `defer` or `async`
4. **Missing connection hints** - Browser discovers resources late

### Solution: Preconnect Hints

**When to use:** Any external domain that serves critical resources.

```html
<!-- Preconnect to critical third-party origins -->
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
<link rel="preconnect" href="https://d3e54v103j8qbb.cloudfront.net" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin>

<!-- DNS prefetch for less critical resources -->
<link rel="dns-prefetch" href="https://assets-global.website-files.com">
<link rel="dns-prefetch" href="https://unpkg.com">
```

**Guidelines:**
- `preconnect` for resources needed immediately (fonts, critical JS)
- `dns-prefetch` for resources needed later (analytics, lazy-loaded content)
- Always include `crossorigin` for font and CDN origins
- Limit to 4-6 preconnects (too many can backfire)
- **Impact:** -200 to 500ms FCP improvement

### Solution: Critical CSS

**Concept:** Inline the CSS needed for above-the-fold content directly in `<head>`.

```html
<head>
  <!-- Critical CSS inline -->
  <style>
    /* Only styles needed for initial viewport */
    .page--wrapper { opacity: 0; }
    .page--wrapper.page-ready { opacity: 1; transition: opacity 0.3s; }
    .nav { /* navigation styles */ }
    .hero { /* hero section styles */ }
  </style>

  <!-- Full CSS loaded asynchronously -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

**Impact:** -500 to 800ms LCP improvement

---

## 4. TBT (Total Blocking Time)

### Problem Patterns

1. **Long tasks on main thread** - JS execution blocks interactivity
2. **Synchronous third-party scripts** - Analytics, consent managers blocking
3. **Heavy initialization** - All scripts initializing on DOMContentLoaded

### Solution: requestIdleCallback for Non-Critical Scripts

**When to use:** Analytics, tracking, and other non-essential scripts.

```javascript
// Google Tag Manager (Delayed for LCP)
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
```

**Key points:**
- `requestIdleCallback` runs when browser is idle (not blocking user interaction)
- `timeout: 3000` ensures it eventually runs even if browser stays busy
- Fallback to `setTimeout` for Safari (no `requestIdleCallback` support)
- **Impact:** -200 to 400ms TBT improvement

### Solution: Script Deferral

**Understanding `defer` vs `async`:**

| Attribute | Download | Execution | Order | Use For |
|-----------|----------|-----------|-------|---------|
| (none) | Blocking | Blocking | In order | Never (legacy only) |
| `defer` | Parallel | After parse | In order | Most scripts |
| `async` | Parallel | When ready | Any order | Independent scripts |

```html
<!-- Recommended: defer for most scripts -->
<script src="navigation.js" defer></script>
<script src="accordion.js" defer></script>

<!-- async only for truly independent scripts -->
<script src="analytics.js" async></script>

<!-- Module scripts are deferred by default -->
<script type="module" src="app.mjs"></script>
```

**Rule of thumb:** Use `defer` unless the script is completely independent and order doesn't matter.

---

## 5. CLS (Cumulative Layout Shift)

### Problem Patterns

1. **Images without dimensions** - Browser doesn't know space to reserve
2. **Dynamic content injection** - Elements added after initial render
3. **Font loading shifts** - Text reflows when custom fonts load
4. **Ads and embeds** - Third-party content with unknown dimensions

### Solution: Explicit Dimensions

**Always set width and height on images:**

```html
<!-- Good: Dimensions specified -->
<img src="hero.webp" width="1200" height="630" alt="Hero image">

<!-- Better: With CSS for responsiveness -->
<img src="hero.webp"
     width="1200"
     height="630"
     style="width: 100%; height: auto;"
     alt="Hero image">

<!-- Best: With aspect-ratio for modern browsers -->
<img src="hero.webp"
     width="1200"
     height="630"
     style="aspect-ratio: 1200/630; width: 100%; height: auto;"
     alt="Hero image">
```

**For containers with dynamic content:**

```css
/* Reserve space for content */
.video-container {
  aspect-ratio: 16/9;
  width: 100%;
}

.ad-slot {
  min-height: 250px; /* Reserve space for ad */
}
```

### Solution: font-display: swap

**Prevent invisible text during font loading:**

```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately, swap when loaded */
}
```

**font-display values:**
- `swap` - Show fallback immediately, swap when loaded (recommended)
- `optional` - Short block period, may not show custom font (for slow connections)
- `fallback` - Short swap period, compromise between swap and optional

---

## 6. QUICK REFERENCE

| Metric | Target | Common Causes | Quick Fix |
|--------|--------|---------------|-----------|
| LCP | <2.5s | Hidden page, large images, no preload | Safety timeout, preload LCP, video poster |
| FCP | <1.8s | Blocking resources, missing hints | Preconnect, defer scripts, critical CSS |
| TBT | <200ms | Long tasks, sync scripts | requestIdleCallback, defer/async |
| CLS | <0.1 | Missing dimensions, font shifts | Set width/height, font-display: swap |

---

## 7. MEASUREMENT TOOLS

**Lab Data (Development):**
- Chrome DevTools > Lighthouse
- PageSpeed Insights (web.dev/measure)
- WebPageTest.org

**Field Data (Real Users):**
- Chrome UX Report (CrUX)
- Google Search Console > Core Web Vitals
- Real User Monitoring (RUM) tools

**Debugging Specific Issues:**
- Chrome DevTools > Performance panel (for TBT)
- Chrome DevTools > Network panel > Coverage (for unused CSS/JS)
- Layout Shift Debugger extension (for CLS)

---

## 8. IMPLEMENTATION CHECKLIST

### P0 - Critical (Immediate Impact)

- [ ] Add safety timeout for JS-controlled page visibility
- [ ] Add video poster for hero video sections
- [ ] Preload LCP image with `fetchpriority="high"`
- [ ] Add preconnect hints for critical origins
- [ ] Defer GTM/analytics with `requestIdleCallback`

### P1 - High Priority

- [ ] Add `defer` to all custom scripts
- [ ] Set explicit dimensions on all images
- [ ] Implement `font-display: swap` for custom fonts
- [ ] Move non-critical CSS to async loading

### P2 - Optimization

- [ ] Inline critical CSS
- [ ] Lazy-load below-fold images
- [ ] Code-split large JavaScript bundles
- [ ] Audit and remove unused CSS/JS

---

## 9. RELATED RESOURCES

### External Documentation

- [web.dev/vitals](https://web.dev/vitals/) - Official Core Web Vitals documentation
- [web.dev/optimize-lcp](https://web.dev/optimize-lcp/) - LCP optimization guide
- [web.dev/optimize-cls](https://web.dev/optimize-cls/) - CLS optimization guide
- [web.dev/optimize-fid](https://web.dev/optimize-fid/) - TBT/FID optimization guide

### Related Reference Files

- [resource_loading.md](./resource_loading.md) - Preconnect, preload, async patterns
- [third_party.md](./third_party.md) - GTM delay, analytics optimization
- [webflow_constraints.md](./webflow_constraints.md) - Platform limitations
