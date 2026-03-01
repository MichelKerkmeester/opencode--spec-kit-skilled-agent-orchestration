---
title: "Implementation Plan: Image Decoding Async Analysis [023-decoding-async-analysis/plan]"
description: "Overview: This plan documents the analysis of anobel.com's image usage patterns and provides recommendations for implementing decoding=\"async\" to improve scrolling performance. ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "image"
  - "decoding"
  - "async"
  - "023"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Image Decoding Async Analysis

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Webflow + Custom JavaScript |
| **Framework** | Webflow CMS |
| **Storage** | Webflow CDN (cdn.prod.website-files.com) |

**Overview**: This plan documents the analysis of anobel.com's image usage patterns and provides recommendations for implementing `decoding="async"` to improve scrolling performance. Images are managed entirely in Webflow and served from Webflow's CDN - no local image files exist in the repository.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**Ready When:**
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable

**Done When:**
- [ ] All image categories identified and catalogued
- [ ] Recommendations documented with clear rationale
- [ ] Implementation guidance provided

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:key-findings -->
## 3. KEY FINDINGS

### 3.1 Current State: No decoding optimization in use

| Pattern | Status | Evidence |
|---------|--------|----------|
| `decoding="async"` | **Not used** | 0 occurrences in codebase |
| `loading="lazy"` | **Not used** | Only in documentation |
| `srcset` / `sizes` | **Not used** | No responsive image attributes |
| `fetchpriority` | **Not used** | No LCP prioritization |

### 3.2 Image Architecture

**Key Finding**: Images are NOT in the source code repository. All `<img>` elements are:
- Created in Webflow's visual editor
- Hosted on Webflow CDN (`cdn.prod.website-files.com`)
- Interacted with via JavaScript using CSS class and data-attribute selectors

**Evidence**: Grep for `<img` returned 0 files. JavaScript files reference images via selectors like:
- `[data-target='hero-image']`
- `.hero--image.is--webshop`
- `.marquee--item`

<!-- /ANCHOR:key-findings -->

---

<!-- ANCHOR:image-categorization -->
## 4. IMAGE CATEGORIZATION

### 4.1 DO NOT USE `decoding="async"` (Above-Fold / Critical)

| Image Type | Selector | Found In | Rationale |
|------------|----------|----------|-----------|
| Primary hero images | `[data-target='hero-image']` | hero_general.js:20-21 | LCP-critical, above-fold |
| Dark mode hero images | `[data-target='hero-image-dark']` | hero_general.js:20-21 | Above-fold variant |
| Hero card images | `[data-target='hero-card-image']` | hero_cards.js:22 | First visible images |
| Webshop hero images | `.hero--image.is--webshop` | hero_webshop.js:110 | Product hero images |

**Why**: These images are:
- Above the fold, visible immediately on page load
- Critical for Largest Contentful Paint (LCP)
- JavaScript waits for them to load before animating (`img.complete` checks)

### 4.2 SHOULD USE `decoding="async"` (Below-Fold)

| Image Type | Selector | Pages Present | Impact |
|------------|----------|---------------|--------|
| **Brand logos (marquee)** | `.marquee--item img` | 12+ pages | HIGH - many logos per page |
| **Client logos (marquee)** | `.marquee--item img` | Multiple pages | HIGH - infinite scroll carousel |
| **Timeline photos** | `.swiper--slide img` | n1_dit_is_nobel.html | MEDIUM - historical photos |
| **Related article images** | `.blog--list-item img` | blog_template.html | MEDIUM - 3-4+ thumbnails |
| **Department grid cards** | `.grid--card-department img` | d1-d4 service pages | MEDIUM - navigation cards |
| **Team photos** | Various | n4_het_team.html | LOW - single page |
| **Brochure thumbnails** | Various | n5_brochures.html | LOW - single page |

**Why**: These images are:
- Below the fold, not visible on initial load
- Not LCP-critical
- Often numerous (multiple per page)
- Users scroll to them, giving time for async decoding

<!-- /ANCHOR:image-categorization -->

---

<!-- ANCHOR:implementation-recommendations -->
## 5. IMPLEMENTATION RECOMMENDATIONS

### Option A: Webflow-Native (Recommended)

**Approach**: Configure `decoding="async"` directly in Webflow's image settings

**Pros**:
- No custom code required
- Applies automatically to all instances
- Survives Webflow updates

**Cons**:
- Webflow may not expose this attribute in UI
- Limited granular control

**Implementation**: Check Webflow's image settings for each image component. If attribute is not available, use Option B.

### Option B: JavaScript Attribution (Fallback)

**Approach**: Add JavaScript to apply `decoding="async"` to below-fold images

```javascript
// Add to global.js or create image_optimization.js
function applyAsyncDecoding() {
  // Below-fold image selectors
  const asyncSelectors = [
    '.marquee--item img',
    '.swiper--slide img',
    '.blog--list-item img',
    '.grid--card-department img'
  ];

  asyncSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(img => {
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  });
}

// Run after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAsyncDecoding);
} else {
  applyAsyncDecoding();
}
```

**Pros**:
- Full control over which images get the attribute
- Can be deployed via existing CDN pipeline

**Cons**:
- Adds JavaScript execution
- Must maintain selector list
- Attribute added after initial parse (reduces effectiveness slightly)

### Option C: Hybrid Approach

**Approach**:
1. Apply `decoding="async"` in Webflow for static images where possible
2. Use JavaScript for dynamically added images (marquee clones, etc.)

**Best for**: Maximum optimization with maintained flexibility

<!-- /ANCHOR:implementation-recommendations -->

---

<!-- ANCHOR:implementation-phases -->
## 6. IMPLEMENTATION PHASES

### Phase 1: Audit
- [ ] Verify current `decoding` attribute usage (confirmed: none)
- [ ] Identify all image selectors

### Phase 2: Implementation
- [ ] Choose approach (A, B, or C)
- [ ] Apply `decoding="async"` to identified below-fold images
- [ ] Ensure hero images do NOT get the attribute

### Phase 3: Verification
- [ ] Test scrolling performance
- [ ] Verify hero images still load synchronously
- [ ] Check no visual regressions

<!-- /ANCHOR:implementation-phases -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Webflow access | Required | Cannot modify image attributes directly |
| CDN deployment | Green | JavaScript solution uses existing pipeline |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK

- **Trigger**: Visible image loading jank or LCP regression
- **Procedure**: Remove `decoding="async"` attribute via Webflow or remove JavaScript

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:pages-with-highest-image-density -->
## 9. PAGES WITH HIGHEST IMAGE DENSITY

| Page | Hero Type | Marquee | Other Below-Fold Images |
|------|-----------|---------|------------------------|
| Home | Video | Yes | Product cards |
| n1_dit_is_nobel | Video | Yes | Timeline photos |
| Contact | Cards | Yes | - |
| Services (d1-d4) | General | Yes | Department grid |
| Blog | General | No | Article list |
| Blog Template | Blog Article | No | Related articles |
| n4_het_team | General | Yes | Team photos |

<!-- /ANCHOR:pages-with-highest-image-density -->

---

<!-- ANCHOR:answer-to-open-questions -->
## 10. ANSWER TO OPEN QUESTIONS

**Q: Does anobel.com already use `decoding="async"` anywhere?**
A: No. Zero occurrences found in the codebase.

**Q: Are there CMS-managed images that need different handling?**
A: Yes. Related articles (`.blog--list-item img`) are CMS-driven. These should receive `decoding="async"` via JavaScript approach since they're dynamically rendered from Webflow CMS.

<!-- /ANCHOR:answer-to-open-questions -->

---

<!--
CORE TEMPLATE (~150 lines)
- Analysis-focused plan for image optimization
- Implementation guidance included
-->
