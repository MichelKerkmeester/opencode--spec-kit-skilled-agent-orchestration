# Webflow Deployment Guide: anobel.com Performance Optimization

**Last Updated**: February 2, 2025  
**Version**: 1.0.0  
**Project**: Comprehensive Performance Optimization

---

## Table of Contents

1. [Overview](#overview)
2. [What Changed](#what-changed)
3. [Deployment Checklist](#deployment-checklist)
4. [Step-by-Step Instructions](#step-by-step-instructions)
5. [Files Reference](#files-reference)
6. [Verification Steps](#verification-steps)
7. [Rollback Plan](#rollback-plan)

---

## Overview

### Goal
Reduce mobile LCP from **20.2s to <4.0s** and improve mobile Lighthouse score from **55% to >75%**.

### Summary of Changes
- **26 performance optimizations** completed
- **53 JavaScript files** minified (70.3% size reduction)
- **Service worker** for caching static assets
- **Critical CSS** inlined for faster FCP
- **Resource hints** (preload, prefetch, preconnect) added
- **Motion.dev tree-shaking** (18 → 2 functions)

### What Needs Webflow Access
| Item | Where in Webflow |
|------|------------------|
| Global HTML snippets | Project Settings → Custom Code → Head/Footer |
| Page-specific HTML | Page Settings → Custom Code → Head/Footer |
| Service Worker file | Upload to site root (requires hosting access) |

---

## What Changed

### 1. Global Changes (All Pages)

**File**: `src/0_html/global.html`  
**Apply to**: Webflow Project Settings → Custom Code

#### HEAD Section Changes

| Change | Description | Impact |
|--------|-------------|--------|
| **Critical CSS inlined** | Lines 6-50: CSS for FCP now inline in `<style>` tag | Faster First Contentful Paint |
| **Motion.dev modulepreload** | Line 126: Changed from `preload as="script"` to `modulepreload` | Proper ES module loading |
| **Speculative prefetch** | Lines 137-139: Added `/contact` and `/over-ons` prefetch | Faster navigation |
| **Service worker registration** | Lines 165-199: New registration script | Caching for repeat visits |
| **LCP Safety Timeout** | Lines 149-163: 2s mobile / 3s desktop timeout | Prevents infinite waits |
| **Motion.dev tree-shaking** | Lines 206-225: Only imports `animate` + `inView` | ~15KB saved |
| **GTM delay** | Lines 57-86: 5s mobile / 3s desktop delay | Doesn't block LCP |

#### FOOTER Section Changes

| Change | Description | Impact |
|--------|-------------|--------|
| **Lenis desktop-only** | Lines 236-263: Only loads on screens >991px | Mobile saves ~2.5s |
| **Script preloads fixed** | Lines 129-131: Correct file names (`nav_dropdown.js`, `nav_mobile_menu.js`) | Faster script loading |

### 2. Video Pages (4 Pages)

**Files**: 
- `src/0_html/home.html`
- `src/0_html/nobel/n1_dit_is_nobel.html`
- `src/0_html/nobel/n2_isps_kade.html`
- `src/0_html/nobel/n3_de_locatie.html`

**Apply to**: Each page's Page Settings → Custom Code → Head

| Change | Description |
|--------|-------------|
| **HLS manifest preload** | Added `<link rel="preload" href="[video]/master.m3u8" as="fetch" crossorigin>` |

**HLS URLs by Page**:

| Page | HLS Manifest URL |
|------|------------------|
| Home | `https://anobel-zn.b-cdn.net/Hero_Homepage/master.m3u8` |
| Dit is Nobel | `https://anobel-zn.b-cdn.net/Dit_is_Nobel/master.m3u8` |
| ISPS Kade | `https://anobel-zn.b-cdn.net/ISPS_Kade/master.m3u8` |
| De Locatie | `https://anobel-zn.b-cdn.net/De_Locatie/master.m3u8` |

### 3. Form Pages (2 Pages)

**Files**:
- `src/0_html/werken_bij.html`
- `src/0_html/cms/vacature.html`

**Apply to**: Each page's Page Settings → Custom Code → Head

| Change | Description |
|--------|-------------|
| **FilePond CSS async** | Changed to `<link rel="preload" as="style" onload="this.rel='stylesheet'">` |
| **unpkg.com preconnect** | Added `<link rel="preconnect" href="https://unpkg.com" crossorigin>` |
| **Form CSS page-specific** | Form CSS only loads on these pages, not globally |

### 4. JavaScript Files Modified

All source files in `src/2_javascript/` - need to upload **minified versions** to R2 CDN.

| Category | Files Modified | Key Changes |
|----------|----------------|-------------|
| **hero/** | 5 files | Fixed infinite loops, added timeouts, Motion.dev event listener |
| **navigation/** | 5 files | Batched reflows, removed premature will-change |
| **modal/** | 2 files | Motion.dev event listener pattern |
| **global/** | 11 files | New: `image_lazy_load.js`, `shared_observers.js`, `service_worker.js` |
| **video/** | 4 files | Skip video wait on all devices |

### 5. New Files Created

| File | Purpose | Deploy To |
|------|---------|-----------|
| `src/2_javascript/global/service_worker.js` | Service worker for caching | Site root as `/service-worker.js` |
| `src/2_javascript/global/shared_observers.js` | Consolidated IntersectionObservers | R2 CDN |
| `src/2_javascript/global/image_lazy_load.js` | Lazy loading for images | R2 CDN |

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run `npm run minify:webflow` to generate minified files
- [ ] Verify all 53 files in `src/2_javascript/z_minified/`
- [ ] Review changes in this document

### R2 CDN Upload

- [ ] Upload all `.min.js` files from `z_minified/` to R2 CDN
- [ ] Bump version numbers in URLs (e.g., `?v=1.3.1` → `?v=1.4.0`)
- [ ] Verify files are accessible via CDN URLs

### Service Worker

- [ ] Upload `service_worker.js` to site root as `/service-worker.js`
- [ ] Test service worker registration in browser DevTools

### Webflow Custom Code

- [ ] Update Project Settings → Custom Code → Head Code
- [ ] Update Project Settings → Custom Code → Footer Code
- [ ] Update each video page's Page Settings → Custom Code
- [ ] Update each form page's Page Settings → Custom Code

### Post-Deployment

- [ ] Clear CDN cache (if applicable)
- [ ] Run Lighthouse test on mobile
- [ ] Verify service worker is active
- [ ] Check console for any errors

---

## Step-by-Step Instructions

### Step 1: Run Minification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com
npm run minify:webflow
```

Expected output:
```
Files processed: 53
Successful: 53
Failed: 0
Total size: 842.9 KB → 250.6 KB (70.3% reduction)
```

### Step 2: Upload to R2 CDN

Upload all files from `src/2_javascript/z_minified/` to your R2 bucket.

**Important**: Update version query strings to bust cache:

```html
<!-- Old -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_dropdown.js?v=1.3.1" defer></script>

<!-- New (bump version) -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/nav_dropdown.min.js?v=1.4.0" defer></script>
```

### Step 3: Deploy Service Worker

1. Copy `src/2_javascript/global/service_worker.js`
2. Upload to your site root as `/service-worker.js`
3. The registration code in `global.html` will automatically register it

**Note**: Service workers require HTTPS and must be at the root level.

### Step 4: Update Webflow Custom Code

#### 4a. Project Settings → Custom Code → Head Code

Copy the **HEAD section** from `src/0_html/global.html` (lines 1-227).

Key sections to include:
- Critical CSS (`<style>` block)
- Security meta tags
- Preconnect/DNS-prefetch hints
- Font preloads
- Modulepreload for Motion.dev
- Script preloads
- Speculative prefetch
- JS detection
- LCP Safety Timeout
- Service Worker registration
- Motion.dev import (tree-shaken)

#### 4b. Project Settings → Custom Code → Footer Code

Copy the **FOOTER section** from `src/0_html/global.html` (lines 229-284).

Key sections:
- Lenis smooth scrolling (desktop-only)
- All global script tags

#### 4c. Video Pages (4 pages)

For each video page, go to **Page Settings → Custom Code → Before </head>**:

**Home page** (`home.html`):
```html
<!-- HLS Video Manifest Preload -->
<link rel="preload" href="https://anobel-zn.b-cdn.net/Hero_Homepage/master.m3u8" as="fetch" crossorigin>
```

**Dit is Nobel** (`n1_dit_is_nobel.html`):
```html
<link rel="preload" href="https://anobel-zn.b-cdn.net/Dit_is_Nobel/master.m3u8" as="fetch" crossorigin>
```

**ISPS Kade** (`n2_isps_kade.html`):
```html
<link rel="preload" href="https://anobel-zn.b-cdn.net/ISPS_Kade/master.m3u8" as="fetch" crossorigin>
```

**De Locatie** (`n3_de_locatie.html`):
```html
<link rel="preload" href="https://anobel-zn.b-cdn.net/De_Locatie/master.m3u8" as="fetch" crossorigin>
```

#### 4d. Form Pages (2 pages)

For **Werken Bij** and **Vacature** pages, add to **Page Settings → Custom Code → Before </head>**:

```html
<!-- unpkg.com Preconnect -->
<link rel="preconnect" href="https://unpkg.com" crossorigin>

<!-- FilePond CSS (async) -->
<link rel="preload" href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css" as="style" onload="this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css">
</noscript>
```

### Step 5: Publish

1. Click **Publish** in Webflow
2. Wait for deployment to complete
3. Proceed to verification

---

## Files Reference

### Source Files (Full Code)

| Location | Description |
|----------|-------------|
| `src/0_html/global.html` | Global custom code (head + footer) |
| `src/0_html/home.html` | Homepage custom code |
| `src/0_html/werken_bij.html` | Werken Bij page custom code |
| `src/0_html/cms/vacature.html` | Vacature template custom code |
| `src/0_html/nobel/*.html` | Nobel section pages |
| `src/2_javascript/` | All JavaScript source files |
| `src/2_javascript/z_minified/` | Minified JavaScript files |

### Minified Files for CDN

```
src/2_javascript/z_minified/
├── cms/                    # 5 files
├── form/                   # 9 files  
├── global/                 # 11 files (including service_worker, shared_observers)
├── hero/                   # 5 files
├── menu/                   # 5 files
├── modal/                  # 2 files
├── molecules/              # 4 files
├── navigation/             # 5 files
├── swiper/                 # 3 files
└── video/                  # 4 files
```

**Total**: 53 minified files

### CDN URLs

| CDN | URL Pattern | Content |
|-----|-------------|---------|
| R2 (Custom) | `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/` | JavaScript, CSS |
| BunnyCDN | `https://anobel-zn.b-cdn.net/` | Videos, images |
| jsDelivr | `https://cdn.jsdelivr.net/` | Third-party libs |
| unpkg | `https://unpkg.com/` | FilePond, Lenis |
| Webflow | `https://cdn.prod.website-files.com/` | Fonts, assets |

---

## Verification Steps

### 1. Service Worker Check

Open browser DevTools → Application → Service Workers

- [ ] Service Worker shows as "activated and is running"
- [ ] Scope is `/`
- [ ] Version matches `v1.1.0`

### 2. Network Waterfall Check

Open DevTools → Network → Reload page

- [ ] HLS manifest preload appears early (video pages)
- [ ] Fonts preload before render
- [ ] Scripts load with `defer` attribute
- [ ] Motion.dev loads via `modulepreload`

### 3. Console Check

Open DevTools → Console

Expected logs:
```
[SW] Registered, scope: /
[Lenis] Desktop smooth scrolling initialized  (desktop only)
```

Should NOT see:
- `[LCP Safety] Force-revealed page after Xms timeout` (unless testing slow connection)
- Any JavaScript errors

### 4. Lighthouse Test

Run Lighthouse on mobile emulation:

| Metric | Target | Previous |
|--------|--------|----------|
| Performance Score | >75% | 55% |
| LCP | <4.0s | 20.2s |
| FCP | <2.0s | - |
| CLS | <0.1 | - |

### 5. Cache Check

After first visit:

1. Go to DevTools → Application → Cache Storage
2. Find `anobel-cache-v1.1.0`
3. Verify critical assets are cached (fonts, scripts)
4. Reload page - network should show `(from service worker)` for cached assets

---

## Rollback Plan

### If Issues Occur

1. **Immediate**: Revert Webflow Custom Code to previous version
2. **CDN**: Keep old script versions available (don't delete old files)
3. **Service Worker**: 
   - To disable: Remove registration code from `global.html`
   - To clear cache: Run in console: `navigator.serviceWorker.controller.postMessage('clearCache')`

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.4.0 | 2025-02-02 | Performance optimization (this release) |
| 1.3.1 | Previous | Pre-optimization baseline |

### Emergency Rollback Script

Paste in browser console to clear service worker:

```javascript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
caches.keys().then(function(names) {
  for (let name of names) caches.delete(name);
});
console.log('Service worker and caches cleared. Reload page.');
```

---

## Blocked Tasks (Require Additional Access)

These optimizations are ready but need BunnyCDN or Webflow Designer access:

| Task | What's Needed | Impact |
|------|---------------|--------|
| **T006**: Video poster images | Extract first frame, upload to BunnyCDN | Prevents blank hero during video load |
| **T007**: LCP image preload | Get hero image URLs from Webflow | Faster LCP |
| **T008**: fetchpriority="high" | Add attribute to hero images in Designer | Browser prioritizes hero images |
| **T024**: Responsive images | Create srcset variants, upload to CDN | Mobile downloads smaller images |

---

## Questions?

If you encounter issues:

1. Check browser console for errors
2. Verify service worker registration in DevTools
3. Compare deployed code with source files in this repo
4. Review the spec documentation in `.opencode/specs/01--anobel.com/029-anobel-performance-analysis`

---

*Document created by Claude AI based on performance optimization work completed January-February 2025.*
