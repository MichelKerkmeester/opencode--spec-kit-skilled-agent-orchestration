# TOC ScrollSpy - Webflow Implementation Guide

A custom Table of Contents scroll-spy implementation for Webflow that provides flexible styling options beyond Finsweet's native approach.

---

## TABLE OF CONTENTS

- [1.  OVERVIEW]](#1--overview)
- [2.  QUICK START]](#2--quick-start)
- [3.  WEBFLOW SETUP (DETAILED)]](#3--webflow-setup-detailed)
- [4. CONFIGURATION]](#4--configuration)
- [5.  STYLING THE ACTIVE STATE]](#5--styling-the-active-state)
- [6. TROUBLESHOOTING]](#6--troubleshooting)
- [7.  API REFERENCE]](#7--api-reference)
- [8.  SOURCE FILES]](#8--source-files)
- [9.  VERSION HISTORY]](#9--version-history)
- [10.  RELATED DOCUMENTATION]](#10--related-documentation)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What It Does

Automatically highlights the currently visible section in your Table of Contents navigation as users scroll through your page.

### Why Use This Over Finsweet

| Feature | Finsweet | TOC ScrollSpy |
|---------|----------|---------------|
| Active state styling | `w--current` only | 4 selector options |
| Detection method | Webflow native | IntersectionObserver |
| Custom offset | Limited | Fully configurable |
| Webflow dependency | Required | Optional |
| Custom class names | No | Yes |

### Key Features

- Style active state via data attributes, CSS classes, or ARIA
- Configurable detection zone for fixed headers
- WCAG 2.1 AA accessible (keyboard, screen reader, reduced motion)
- Works with or without Webflow
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Minimum setup in 3 steps:**

### Step 1: Add Attributes to TOC Container

Select your TOC navigation wrapper in Webflow Designer:

```
Element Settings > Custom attributes:
  Name: data-toc-container
  Value: (leave empty)
```

### Step 2: Add Attributes to TOC Links

For each link in your TOC:

```
Element Settings > Custom attributes:
  Name: data-toc-link
  Value: (leave empty)

Element Settings > Link settings:
  URL: #section-id (matches your section's ID)
```

**Webflow wrapper pattern (supported):**
If your clickable TOC item is a wrapper element (e.g. a `<button>` or `<div>`) containing a nested `<a href="#...">`, add `data-toc-link` to the wrapper. The script will read the nested anchor's hash.

**Multiple TOC instances (supported):**
If the same sections are linked from multiple TOC lists (e.g. desktop + mobile, or duplicated inside tabs), add `data-toc-link` to each item. The script will keep all matching links in sync for the active section.

### Step 3: Add Attributes to Content Sections

For each content section:

```
Element Settings > ID:
  section-1 (or your preferred ID, no # symbol)

Element Settings > Custom attributes:
  Name: data-toc-section
  Value: (leave empty)
```

### Step 4: Add Custom Code

In **Project Settings > Custom Code > Footer Code**, add the JavaScript file content wrapped in `<script>` tags.

In **Project Settings > Custom Code > Head Code** (or page-level), add the CSS file content wrapped in `<style>` tags.

**Important:** Don't leave `http://localhost:3000/...` references in published Webflow projects. Use inline code or a public CDN URL for production.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:webflow-setup-detailed -->
## 3. WEBFLOW SETUP (DETAILED)

### 3.1 Create TOC Navigation Structure

**Recommended Webflow Structure:**

```
Nav Block (or Div Block)
  └── data-toc-container attribute
  └── aria-label="Table of contents" (custom attribute)
  │
  ├── Link Block
  │     └── data-toc-link attribute
  │     └── href="#introduction"
  │     └── Text: "Introduction"
  │
  ├── Link Block
  │     └── data-toc-link attribute
  │     └── href="#features"
  │     └── Text: "Features"
  │
  └── Link Block
        └── data-toc-link attribute
        └── href="#conclusion"
        └── Text: "Conclusion"
```

### 3.2 Adding Custom Attributes in Webflow Designer

1. Select the element
2. Open **Element Settings** panel (gear icon on right sidebar)
3. Scroll to **Custom attributes** section
4. Click **+ Add attribute**
5. Enter attribute name (e.g., `data-toc-container`)
6. Leave value empty (presence-only attributes)
7. Press Enter to save

### 3.3 Mark Content Sections

Each section you want tracked needs:

1. **An ID** (Element Settings > ID field, no # symbol)
2. **The data-toc-section attribute** (Custom attributes section)

**Example Section Structure:**

```
Section (or Div Block)
  └── ID: introduction
  └── data-toc-section attribute
  │
  ├── Heading (H2)
  │     └── Text: "Introduction"
  │
  └── Paragraph
        └── Your content...
```

### 3.4 Adding the Code to Webflow

#### JavaScript (Required)

**Location:** Project Settings > Custom Code > Footer Code

```html
<script>
// Paste the entire contents of toc_scrollspy.js here
</script>
```

#### CSS (Required)

**Location:** Project Settings > Custom Code > Head Code

```html
<style>
/* Paste the entire contents of toc_scrollspy.css here */
</style>
```

**Alternative:** Page Settings > Inside `<head>` tag (for page-specific loading)
<!-- /ANCHOR:webflow-setup-detailed -->

---

<!-- ANCHOR:configuration -->
## 4. CONFIGURATION

All configuration is done via data attributes on the `data-toc-container` element.

### Available Options

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-toc-offset-top` | `10%` | Distance from viewport top to start detection zone |
| `data-toc-offset-bottom` | `70%` | Distance from viewport bottom to end detection zone |
| `data-toc-active-class` | `is--current` | Custom class name for active state |

### Configuration Examples

**For Fixed Header (80px tall):**

```
data-toc-container
data-toc-offset-top="80px"
```

**For Larger Detection Zone:**

```
data-toc-container
data-toc-offset-top="5%"
data-toc-offset-bottom="50%"
```

**With Custom Active Class:**

```
data-toc-container
data-toc-active-class="toc-active"
```

### Understanding the Detection Zone

```
┌──────────────────────────────┐ ← Viewport Top
│                              │
│   (offset-top: 10%)          │ ← Ignored zone
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                              │
│   ★ ACTIVE DETECTION ZONE ★  │ ← Sections here become active
│                              │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│   (offset-bottom: 70%)       │ ← Ignored zone
│                              │
└──────────────────────────────┘ ← Viewport Bottom
```
<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:styling-the-active-state -->
## 5. STYLING THE ACTIVE STATE

The script applies **all four** styling mechanisms simultaneously, giving you flexibility in how you style the active TOC link.

### Available Selectors (Pick Any)

| Selector | Usage |
|----------|-------|
| `[data-toc-active="true"]` | Data attribute (recommended) |
| `.is--current` | CSS class (project convention) |
| `[aria-current="true"]` | ARIA attribute (accessibility) |
| `.w--current` | Webflow native class |

### Custom CSS Examples

**Basic Active Style:**

```css
[data-toc-link][data-toc-active="true"] {
  font-weight: 600;
  color: #0066cc;
}
```

**With Left Border Indicator:**

```css
[data-toc-link][data-toc-active="true"] {
  border-left: 3px solid currentColor;
  padding-left: 12px;
  margin-left: -12px;
}
```

**Using Webflow Variables:**

If you have CSS variables defined in Webflow:

```css
[data-toc-link][data-toc-active="true"] {
  color: var(--brand-primary);
}
```

### Using Webflow's Current State

If you prefer using Webflow Designer's native Current state styling:

1. The script automatically adds `.w--current` class
2. In Designer, select your TOC link
3. Use the States dropdown > Current
4. Style as normal in Webflow
<!-- /ANCHOR:styling-the-active-state -->

---

<!-- ANCHOR:troubleshooting -->
## 6. TROUBLESHOOTING

### Active State Not Updating

**Check these common issues:**

1. **Missing IDs on sections**
   - Each section needs both an ID AND the `data-toc-section` attribute
   - IDs must NOT have the `#` symbol

2. **Mismatched hrefs**
   - Link href must exactly match section ID
   - href: `#features` → ID: `features`

3. **Script not loaded**
   - Open browser console (F12)
   - Look for: `[TOC ScrollSpy] Initialized successfully`
   - If missing, check code placement

### Wrong Section Highlighted

**Adjust detection zone:**

```
data-toc-offset-top="80px"    (increase if header is tall)
data-toc-offset-bottom="60%"  (decrease for larger zone)
```

### Styling Not Applied

**Check selector specificity:**

Webflow styles may override. Solutions:

1. Add `!important` to your custom CSS
2. Use more specific selector: `nav[data-toc-container] [data-toc-link][data-toc-active="true"]`
3. Place custom CSS after Webflow's styles

### Works in Preview But Not Published

1. Clear Webflow cache and republish
2. Check published site source for script presence
3. Verify custom code is in correct location (Project vs Page settings)

### CMS Dynamic Content Not Working

If your sections are CMS-generated and load after the script:

**Option 1:** Increase initialization delay

Edit line in JS: `var INIT_DELAY_MS = 100;` (or higher)

**Option 2:** Manual re-initialization

```javascript
// After CMS content loads
window.__tocScrollspyCdnInit = false;
// Script will re-run on next page interaction
```
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:api-reference -->
## 7. API REFERENCE

### Data Attributes

| Attribute | Element | Required | Description |
|-----------|---------|----------|-------------|
| `data-toc-container` | Nav/Div | No | TOC wrapper (for configuration) |
| `data-toc-link` | Link | Yes | Identifies TOC links |
| `data-toc-section` | Section/Div | Yes | Identifies tracked sections |
| `data-toc-offset-top` | Container | No | Top detection zone offset |
| `data-toc-offset-bottom` | Container | No | Bottom detection zone offset |
| `data-toc-active-class` | Container | No | Custom active class name |

### CSS Classes Applied

| Class/Attribute | When Applied | Use Case |
|-----------------|--------------|----------|
| `data-toc-active="true"` | Link is active | Custom styling |
| `data-toc-active="false"` | Link is inactive | Reset styling |
| `.is--current` | Link is active | Project convention |
| `.w--current` | Link is active | Webflow compatibility |
| `aria-current="true"` | Link is active | Screen readers |

### Console Messages

| Message | Meaning |
|---------|---------|
| `[Table of Content] Initializing...` | Script starting |
| `[Table of Content] Found X sections` | Sections detected |
| `[Table of Content] Found X TOC links` | Links mapped |
| `[Table of Content] Initialized successfully` | Ready to use |
| `[Table of Content] No sections found` | Check data-toc-section |
| `[Table of Content] No TOC links found` | Check data-toc-link |
<!-- /ANCHOR:api-reference -->

---

<!-- ANCHOR:source-files -->
## 8. SOURCE FILES

| File | Location | Purpose |
|------|----------|---------|
| `table_of_content.js` | `src/2_javascript/cms/` | Main implementation |
| `toc_scrollspy.css` | `src/1_css/menu/` | Styling options |
| `example.html` | `.opencode/specs/01--anobel.com/z_archive/004-table-of-content/001-toc-scrollspy/scratch` | Working demo |
<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:version-history -->
## 9. VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-13 | Initial release |
<!-- /ANCHOR:version-history -->

---

<!-- ANCHOR:related-documentation -->
## 10. RELATED DOCUMENTATION

- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Task Breakdown](./tasks.md)
- [Implementation Summary](./implementation-summary.md)
<!-- /ANCHOR:related-documentation -->
