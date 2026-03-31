---
title: "Implementation Summary: [01--anobel.com/z_archive/004-table-of-content/001-toc-scrollspy/implementation-summary]"
description: "A custom Table of Contents scroll-spy implementation using IntersectionObserver with flexible styling options, providing more control than Finsweet's Webflow-dependent approach."
trigger_phrases:
  - "implementation"
  - "summary"
  - "custom"
  - "toc"
  - "scrollspy"
  - "implementation summary"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Custom TOC ScrollSpy

## Overview

A custom Table of Contents scroll-spy implementation using IntersectionObserver with flexible styling options, providing more control than Finsweet's Webflow-dependent approach.

---

<!-- ANCHOR:files-created -->
## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `src/2_javascript/cms/table_of_content.js` | ~350 | Main scroll-spy implementation |
| `src/1_css/menu/toc_scrollspy.css` | 225 | Multi-selector styling options |
| `.opencode/specs/01--anobel.com/z_archive/004-table-of-content/scratch/example.html` | - | Working usage example |
<!-- /ANCHOR:files-created -->

---

<!-- ANCHOR:key-implementation-details -->
## Key Implementation Details

### JavaScript (`table_of_content.js`)

**Architecture:**
- Arrow IIFE pattern with `__tableOfContentCdnInit` initialization guard
- IntersectionObserver for scroll detection
- RAF batching for DOM updates
- Event delegation for link clicks

**Detection Algorithm:**
1. Track visible sections in Map
2. On intersection change: add/remove from visible Map
3. Determine active = first visible in document order
4. If none visible: use nearest section (scroll position fallback)
5. Apply state to matching TOC link via RAF

**Configuration Support (via data attributes):**
```html
<nav data-toc-container
     data-toc-offset-top="80px"
     data-toc-offset-bottom="70%"
     data-toc-active-class="is--current">
```

### CSS (`toc_scrollspy.css`)

**Four Equivalent Selectors (all applied simultaneously):**
1. `[data-toc-active="true"]` - Data attribute (recommended)
2. `.is--current` - Custom class (project convention)
3. `[aria-current="true"]` - ARIA attribute (accessibility)
4. `.w--current` - Webflow native (designer compatibility)

**Accessibility Features:**
- `:focus-visible` indicators
- `prefers-reduced-motion` support
- Nested level indentation support
<!-- /ANCHOR:key-implementation-details -->

---

<!-- ANCHOR:data-attributes-api -->
## Data Attributes API

| Attribute | Location | Purpose |
|-----------|----------|---------|
| `data-toc-container` | `<nav>` | TOC navigation wrapper |
| `data-toc-link` | `<a>` | Individual TOC links |
| `data-toc-section` | `<section>` | Content sections to track |
| `data-toc-offset-top` | Container | Top viewport offset |
| `data-toc-offset-bottom` | Container | Bottom viewport offset |
| `data-toc-active-class` | Container | Custom active class name |
<!-- /ANCHOR:data-attributes-api -->

---

<!-- ANCHOR:user-stories-completed -->
## User Stories Completed

| Story | Priority | Status |
|-------|----------|--------|
| US1: Style active TOC link via CSS | P0 | Complete |
| US2: Accurate scroll position detection | P0 | Complete |
| US3: Accessible navigation | P1 | Complete |
| US4: Configurable detection zone | P2 | Complete |
<!-- /ANCHOR:user-stories-completed -->

---

<!-- ANCHOR:key-differences-from-finsweet -->
## Key Differences from Finsweet

| Aspect | Finsweet | Our Implementation |
|--------|----------|-------------------|
| Detection | Webflow's `w--current` | IntersectionObserver |
| Styling | Limited to `w--current` | 4 selector options |
| Configuration | Limited | Full data attributes |
| Dependency | Requires Webflow | Standalone (works anywhere) |
<!-- /ANCHOR:key-differences-from-finsweet -->

---

<!-- ANCHOR:remaining-tasks -->
## Remaining Tasks

| Task | Priority | Status |
|------|----------|--------|
| T060: Browser testing | P1 | Pending |
| T061: Mobile testing | P1 | Pending |
| T062: axe accessibility audit | P1 | Pending |
<!-- /ANCHOR:remaining-tasks -->

---

<!-- ANCHOR:hotfixes -->
## Hotfixes

### 2025-12-13

- Support `data-toc-link` wrapper elements (e.g. `<button>`) with nested `<a href="#...">` for click navigation
- Re-cache section positions when using the "nearest section" fallback to avoid stale layout issues
- Support multiple TOC containers / duplicate links by applying active state to all links that target the active section
- Only consider sections that have matching links and visible layout when computing the "nearest section" fallback
<!-- /ANCHOR:hotfixes -->

---

<!-- ANCHOR:usage-example -->
## Usage Example

```html
<!-- TOC Navigation -->
<nav data-toc-container aria-label="Table of contents">
  <a href="#intro" data-toc-link>Introduction</a>
  <a href="#features" data-toc-link>Features</a>
  <a href="#conclusion" data-toc-link>Conclusion</a>
</nav>

<!-- Content Sections -->
<section id="intro" data-toc-section>
  <h2>Introduction</h2>
  <p>Content...</p>
</section>

<section id="features" data-toc-section>
  <h2>Features</h2>
  <p>Content...</p>
</section>

<section id="conclusion" data-toc-section>
  <h2>Conclusion</h2>
  <p>Content...</p>
</section>

<!-- Scripts -->
<link rel="stylesheet" href="/src/1_css/menu/toc_scrollspy.css">
<script src="/src/2_javascript/cms/table_of_content.js"></script>
```
<!-- /ANCHOR:usage-example -->

---

<!-- ANCHOR:implementation-date -->
## Implementation Date

2024-12-13
<!-- /ANCHOR:implementation-date -->

<!-- ANCHOR:spec-folder -->
## Spec Folder

`.opencode/specs/01--anobel.com/z_archive/004-table-of-content/001-toc-scrollspy/`
<!-- /ANCHOR:spec-folder -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

No known limitations.
<!-- /ANCHOR:limitations -->
