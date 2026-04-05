# Webflow Implementation Guide: Image Decoding Optimization

> Per-page guide for adding `decoding="async"` to anobel.com images in Webflow

---

<!-- ANCHOR:quick-reference -->
## Quick Reference

### What is `decoding="async"`?

| Attribute          | What it does                              | When to use                             |
| ------------------ | ----------------------------------------- | --------------------------------------- |
| `decoding="async"` | Decodes image in background thread        | Below-fold images, galleries, carousels |
| `decoding="sync"`  | Decodes on main thread (blocks rendering) | Critical above-fold images              |
| `decoding="auto"`  | Browser decides (default)                 | When unsure                             |

### The Rule

| Image Position                    | Action                        |
| --------------------------------- | ----------------------------- |
| **Above the fold** (hero, banner) | Do NOT add `decoding="async"` |
| **Below the fold** (scrolled to)  | ADD `decoding="async"`        |

<!-- /ANCHOR:quick-reference -->

---

<!-- ANCHOR:how-to-add-in-webflow -->
## How to Add in Webflow

### Method 1: Custom Attribute (Recommended)

1. Select the image element in Webflow Designer
2. Open Element Settings panel (D)
3. Scroll to "Custom Attributes"
4. Click "+ Add Attribute"
5. Add:
   - **Name:** `decoding`
   - **Value:** `async`
6. Publish

### Method 2: Embed Code (For CMS images)

For CMS-driven images where you can't add attributes directly, add this to page's Before `</body>` code:

```html
<script>
document.querySelectorAll('.your-cms-image-class img').forEach(img => {
  img.setAttribute('decoding', 'async');
});
</script>
```

<!-- /ANCHOR:how-to-add-in-webflow -->

---

<!-- ANCHOR:page-by-page-implementation -->
## Page-by-Page Implementation

### Home (`/`)

| Image Location        | Class/Identifier    | Action                 | Reason                  |
| --------------------- | ------------------- | ---------------------- | ----------------------- |
| Hero video poster     | `.hero--video` area | SKIP                   | Above fold              |
| Brand logos marquee   | `.marquee--item`    | ADD `decoding="async"` | Below fold, many images |
| Product/service cards | Below hero section  | ADD `decoding="async"` | Below fold              |

**Webflow Steps:**
1. Navigate to Home page
2. Find marquee section with brand logos
3. Select each logo image OR the image component
4. Add custom attribute: `decoding` = `async`

---

### Contact (`/contact`)

| Image Location      | Class/Identifier                  | Action                 | Reason               |
| ------------------- | --------------------------------- | ---------------------- | -------------------- |
| Hero card images    | `[data-target='hero-card-image']` | SKIP                   | Above fold, animated |
| Brand logos marquee | `.marquee--item`                  | ADD `decoding="async"` | Below fold           |

**Webflow Steps:**
1. Navigate to Contact page
2. Leave hero card images unchanged
3. Find marquee section
4. Add `decoding="async"` to each logo image

---

### Dit is Nobel (`/nobel/dit-is-nobel`)

| Image Location      | Class/Identifier        | Action                 | Reason                          |
| ------------------- | ----------------------- | ---------------------- | ------------------------------- |
| Hero video          | `.hero--video` area     | SKIP                   | Above fold                      |
| Timeline photos     | `.swiper--slide` images | ADD `decoding="async"` | Below fold, historical carousel |
| Brand logos marquee | `.marquee--item`        | ADD `decoding="async"` | Below fold                      |

**Webflow Steps:**
1. Navigate to Dit is Nobel page
2. Find timeline/history swiper section
3. Select each timeline photo
4. Add custom attribute: `decoding` = `async`
5. Repeat for marquee logos

---

### Het Team (`/nobel/het-team`)

| Image Location      | Class/Identifier             | Action                 | Reason                      |
| ------------------- | ---------------------------- | ---------------------- | --------------------------- |
| Hero image          | `[data-target='hero-image']` | SKIP                   | Above fold                  |
| Team member photos  | Team grid section            | ADD `decoding="async"` | Below fold, multiple photos |
| Brand logos marquee | `.marquee--item`             | ADD `decoding="async"` | Below fold                  |

**Webflow Steps:**
1. Navigate to Het Team page
2. Leave hero image unchanged
3. Find team member grid
4. Add `decoding="async"` to each team photo
5. Repeat for marquee logos

---

### Brochures (`/nobel/brochures`)

| Image Location      | Class/Identifier             | Action                 | Reason     |
| ------------------- | ---------------------------- | ---------------------- | ---------- |
| Hero image          | `[data-target='hero-image']` | SKIP                   | Above fold |
| Brochure thumbnails | Download cards               | ADD `decoding="async"` | Below fold |
| Brand logos marquee | `.marquee--item`             | ADD `decoding="async"` | Below fold |

---

### Services: Bunkering (`/services/bunkering`)

| Image Location        | Class/Identifier             | Action                 | Reason                |
| --------------------- | ---------------------------- | ---------------------- | --------------------- |
| Hero image            | `[data-target='hero-image']` | SKIP                   | Above fold            |
| Department grid cards | `.grid--card-department`     | ADD `decoding="async"` | Below fold navigation |
| Brand logos marquee   | `.marquee--item`             | ADD `decoding="async"` | Below fold            |

**Webflow Steps:**
1. Navigate to Bunkering page
2. Leave hero image unchanged
3. Find department/service grid section
4. Add `decoding="async"` to each card image
5. Repeat for marquee logos

---

### Services: Filtratie (`/services/filtratie`)

Same as Bunkering - apply identical pattern.

---

### Services: Uitrusting (`/services/uitrusting`)

Same as Bunkering - apply identical pattern.

---

### Services: Maatwerk (`/services/maatwerk`)

Same as Bunkering - apply identical pattern.

---

### Blog (`/blog`)

| Image Location         | Class/Identifier             | Action                 | Reason                 |
| ---------------------- | ---------------------------- | ---------------------- | ---------------------- |
| Hero image             | `[data-target='hero-image']` | SKIP                   | Above fold             |
| Article thumbnail list | `.blog--list-item`           | ADD `decoding="async"` | Below fold, CMS-driven |

**Webflow Steps:**
1. Navigate to Blog page
2. Leave hero image unchanged
3. Find article list/grid
4. **For CMS images**: Add embed code (Method 2) targeting `.blog--list-item img`

**Embed Code for Blog:**
```html
<script>
document.querySelectorAll('.blog--list-item img').forEach(img => {
  img.setAttribute('decoding', 'async');
});
</script>
```

---

### Blog Template (CMS Template)

| Image Location     | Class/Identifier         | Action                 | Reason            |
| ------------------ | ------------------------ | ---------------------- | ----------------- |
| Article hero image | Blog post featured image | SKIP                   | Above fold, LCP   |
| Related articles   | `.blog--list-item`       | ADD `decoding="async"` | Below fold        |
| In-content images  | Rich text images         | ADD `decoding="async"` | Likely below fold |

**Webflow Steps:**
1. Open Blog Template in CMS collection
2. Leave featured/hero image unchanged
3. Add embed code for related articles (same as Blog page)

---

### Werken Bij (`/werken-bij`)

| Image Location      | Class/Identifier                  | Action                 | Reason     |
| ------------------- | --------------------------------- | ---------------------- | ---------- |
| Hero card images    | `[data-target='hero-card-image']` | SKIP                   | Above fold |
| Job listing images  | Vacature cards                    | ADD `decoding="async"` | Below fold |
| Brand logos marquee | `.marquee--item`                  | ADD `decoding="async"` | Below fold |

---

### Vacature Template (CMS Template)

| Image Location    | Class/Identifier             | Action                 | Reason     |
| ----------------- | ---------------------------- | ---------------------- | ---------- |
| Hero image        | `[data-target='hero-image']` | SKIP                   | Above fold |
| Related vacatures | List below content           | ADD `decoding="async"` | Below fold |

---

### Webshop (`/webshop`)

| Image Location      | Class/Identifier           | Action                 | Reason                       |
| ------------------- | -------------------------- | ---------------------- | ---------------------------- |
| Hero product image  | `.hero--image.is--webshop` | SKIP                   | Above fold, product showcase |
| Product grid images | Below hero                 | ADD `decoding="async"` | Below fold products          |
| Brand logos marquee | `.marquee--item`           | ADD `decoding="async"` | Below fold                   |

<!-- /ANCHOR:page-by-page-implementation -->

---

<!-- ANCHOR:bulk-implementation-marquee-logos -->
## Bulk Implementation: Marquee Logos

The brand/client logo marquee appears on **12+ pages**. Instead of editing each page:

### Option A: Edit the Symbol/Component

If marquee is a Webflow Symbol:
1. Find the Marquee symbol in Symbols panel
2. Edit the symbol
3. Add `decoding="async"` to each logo image
4. Changes apply to all instances automatically

### Option B: Global Embed Code

Add to Site Settings > Custom Code > Footer:

```html
<script>
// Apply async decoding to all marquee images site-wide
document.querySelectorAll('.marquee--item img').forEach(img => {
  img.setAttribute('decoding', 'async');
});
</script>
```

**Recommended**: Option B is fastest and most maintainable.

<!-- /ANCHOR:bulk-implementation-marquee-logos -->

---

<!-- ANCHOR:verification-checklist -->
## Verification Checklist

After implementation, verify:

- [ ] Hero images do NOT have `decoding="async"` (check in browser DevTools)
- [ ] Marquee logos have `decoding="async"`
- [ ] Timeline photos have `decoding="async"`
- [ ] Blog article thumbnails have `decoding="async"`
- [ ] Department grid cards have `decoding="async"`
- [ ] No visible loading jank on hero images
- [ ] Scrolling feels smooth on image-heavy pages

### How to Verify in Browser

1. Open Chrome DevTools (F12)
2. Go to Elements tab
3. Find an `<img>` element
4. Check for `decoding="async"` attribute
5. Verify hero images do NOT have this attribute

<!-- /ANCHOR:verification-checklist -->

---

<!-- ANCHOR:summary-table -->
## Summary Table

| Page              | Hero (SKIP)  | Marquee (ADD) | Other Below-Fold (ADD) |
| ----------------- | ------------ | ------------- | ---------------------- |
| Home              | Video        | Brand logos   | Product cards          |
| Contact           | Card images  | Brand logos   | -                      |
| Dit is Nobel      | Video        | Brand logos   | Timeline photos        |
| Het Team          | Image        | Brand logos   | Team photos            |
| Brochures         | Image        | Brand logos   | Brochure thumbs        |
| Bunkering         | Image        | Brand logos   | Department grid        |
| Filtratie         | Image        | Brand logos   | Department grid        |
| Uitrusting        | Image        | Brand logos   | Department grid        |
| Maatwerk          | Image        | Brand logos   | Department grid        |
| Blog              | Image        | -             | Article thumbs         |
| Blog Template     | Featured     | -             | Related articles       |
| Werken Bij        | Card images  | Brand logos   | Job cards              |
| Vacature Template | Image        | -             | Related vacatures      |
| Webshop           | Product hero | Brand logos   | Product grid           |

<!-- /ANCHOR:summary-table -->

---

<!-- ANCHOR:estimated-time -->
## Estimated Time

| Task                      | Time         |
| ------------------------- | ------------ |
| Add global marquee script | 5 min        |
| Update each page manually | 2-3 min/page |
| Total (14 pages)          | ~45 min      |

**Fastest approach**: Use global embed code for marquee + per-page updates for other images.
<!-- /ANCHOR:estimated-time -->
