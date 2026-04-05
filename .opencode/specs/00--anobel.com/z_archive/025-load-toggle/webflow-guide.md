# Webflow Implementation Guide - Load Toggle

Expand/collapse component with CMS-bindable button text, smooth animations, and multi-instance support.

---

<!-- ANCHOR:quick-reference -->
## Quick Reference

### Data Attributes

| Attribute | Element | Purpose | CMS Bindable |
|-----------|---------|---------|--------------|
| `data-target="load-toggle"` | Container | Identifies the toggle wrapper | No |
| `data-target="load-toggle-trigger"` | Button | Clickable trigger element | No |
| `data-target="load-toggle-text"` | Span | JS-controlled button text | No |
| `data-load="expanded"` | Any child | Hidden when collapsed | No |
| `data-target="load-icon"` | Icon/SVG | Rotates 180° on expand | No |
| `data-load-collapsed` | Button | Collapsed state text | **Yes** ✓ |
| `data-load-expanded` | Button | Expanded state text | **Yes** ✓ |

### State Flow

```
collapsed → click → expanded → click → collapsed
```
<!-- /ANCHOR:quick-reference -->

---

<!-- ANCHOR:cms-integration -->
## CMS Integration

The text attributes are on the **button element**, making them bindable to CMS fields:

```
📦 CMS Collection Item
│
├── 🔘 Button [data-target="load-toggle-trigger"]
│            [data-load-collapsed] ← Bind to CMS field "Button Text Collapsed"
│            [data-load-expanded]  ← Bind to CMS field "Button Text Expanded"
│
│   └── 📝 Text [data-target="load-toggle-text"]
```

**Webflow CMS binding:**
1. Select the button element
2. Click the attribute value field
3. Click the purple "+" icon to bind to CMS field
<!-- /ANCHOR:cms-integration -->

---

<!-- ANCHOR:prerequisites -->
## Prerequisites

Before starting in Webflow:

1. **Upload JS to CDN** - Upload `src/2_javascript/z_minified/menu/load_toggle.js` to Cloudflare R2
2. **Verify upload** - Test URL: `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/load_toggle.js?v=1.0.0`
<!-- /ANCHOR:prerequisites -->

---

<!-- ANCHOR:step-1-add-container-attribute -->
## Step 1: Add Container Attribute

**Select the container element** (wrapper around all items AND the button)

| Attribute | Value |
|-----------|-------|
| `data-target` | `load-toggle` |
<!-- /ANCHOR:step-1-add-container-attribute -->

---

<!-- ANCHOR:step-2-mark-hidden-items -->
## Step 2: Mark Hidden Items

### Always Visible Items

No attributes needed.

### Hidden Items (Expandable)

| Attribute | Value |
|-----------|-------|
| `data-load` | `expanded` |
<!-- /ANCHOR:step-2-mark-hidden-items -->

---

<!-- ANCHOR:step-3-configure-the-button -->
## Step 3: Configure the Button

**Select the toggle button** and add these attributes:

| Attribute | Value | CMS Bindable |
|-----------|-------|--------------|
| `data-target` | `load-toggle-trigger` | No |
| `aria-expanded` | `false` | No |
| `data-load-collapsed` | "View More" (or bind to CMS) | **Yes** ✓ |
| `data-load-expanded` | "View Less" (or bind to CMS) | **Yes** ✓ |

**Note:** If text attributes are omitted, defaults are "View More" / "View Less".
<!-- /ANCHOR:step-3-configure-the-button -->

---

<!-- ANCHOR:step-4-add-text-element-inside-button -->
## Step 4: Add Text Element Inside Button

Inside the button, create **ONE text element**:

| Attribute | Value |
|-----------|-------|
| `data-target` | `load-toggle-text` |

**Leave the text content empty** — JavaScript sets it automatically.
<!-- /ANCHOR:step-4-add-text-element-inside-button -->

---

<!-- ANCHOR:step-5-configure-the-caret-icon-optional -->
## Step 5: Configure the Caret Icon (Optional)

**Select the icon** inside the button:

| Attribute | Value |
|-----------|-------|
| `data-target` | `load-icon` |
<!-- /ANCHOR:step-5-configure-the-caret-icon-optional -->

---

<!-- ANCHOR:step-6-add-css -->
## Step 6: Add CSS

Go to **Page Settings** → **Custom Code** → **Inside <head> tag**

```html
<style>
/* ─────────────────────────────────────────────────────────────
   LOAD TOGGLE
   ───────────────────────────────────────────────────────────── */

/* 1. ITEM VISIBILITY */
[data-target="load-toggle" i][data-state="collapsed" i] [data-load="expanded" i] {
  display: none;
}

[data-target="load-toggle" i][data-state="expanded" i] [data-load="expanded" i] {
  display: flex;
}

/* 2. ICON ROTATION */
[data-target="load-toggle" i] [data-target="load-icon" i] {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

[data-target="load-toggle" i][data-state="collapsed" i] [data-target="load-icon" i] {
  transform: rotate(0deg);
}

[data-target="load-toggle" i][data-state="expanded" i] [data-target="load-icon" i] {
  transform: rotate(180deg);
}

/* 3. CONTENT ANIMATION */
@keyframes loadToggleFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-target="load-toggle" i][data-state="expanded" i] [data-load="expanded" i] {
  animation: loadToggleFadeIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
</style>
```
<!-- /ANCHOR:step-6-add-css -->

---

<!-- ANCHOR:step-7-add-script-tag -->
## Step 7: Add Script Tag

**Page Settings** → **Custom Code** → **Before </body> tag**

```html
<!-- Load Toggle -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/load_toggle.js?v=1.0.0" defer></script>
```
<!-- /ANCHOR:step-7-add-script-tag -->

---

<!-- ANCHOR:visual-reference -->
## Visual Reference

```
┌─────────────────────────────────────────────────────────────────┐
│ Container [data-target="load-toggle"]                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 1   (no attribute)                                   │ │  ← Visible
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 2   (no attribute)                                   │ │  ← Visible
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 3   [data-load="expanded"]                           │ │  ← HIDDEN
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 4   [data-load="expanded"]                           │ │  ← HIDDEN
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Button                                                    │ │
│  │   data-target="load-toggle-trigger"                       │ │
│  │   data-load-collapsed="Toon alle" ← CMS bindable          │ │
│  │   data-load-expanded="Toon minder" ← CMS bindable         │ │
│  │   aria-expanded="false"                                   │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────┐    │ │
│  │   │ Text [data-target="load-toggle-text"]           │    │ │
│  │   │ → JS sets text from button attributes           │    │ │
│  │   └─────────────────────────────────────────────────┘    │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────┐    │ │
│  │   │ Icon [data-target="load-icon"]  ↓ → ↑                 │    │ │
│  │   └─────────────────────────────────────────────────┘    │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
<!-- /ANCHOR:visual-reference -->

---

<!-- ANCHOR:cms-setup-example -->
## CMS Setup Example

### CMS Collection Fields

| Field Name | Type | Example Value |
|------------|------|---------------|
| `button_text_collapsed` | Plain Text | "Toon alle feestdagen" |
| `button_text_expanded` | Plain Text | "Toon minder feestdagen" |

### Binding in Webflow

1. Select the button element
2. Open Settings panel (gear icon)
3. Add attribute `data-load-collapsed`
4. Click the value field → Click purple "+" → Select CMS field
5. Repeat for `data-load-expanded`
<!-- /ANCHOR:cms-setup-example -->

---

<!-- ANCHOR:attributes-summary -->
## Attributes Summary

| Element | Attribute | Value | Required | CMS |
|---------|-----------|-------|----------|-----|
| Container | `data-target` | `load-toggle` | Yes | No |
| Hidden Items | `data-load` | `expanded` | Yes | No |
| Button | `data-target` | `load-toggle-trigger` | Yes | No |
| Button | `aria-expanded` | `false` | Yes | No |
| Button | `data-load-collapsed` | Text | No | **Yes** |
| Button | `data-load-expanded` | Text | No | **Yes** |
| Text | `data-target` | `load-toggle-text` | Yes | No |
| Icon | `data-target` | `load-icon` | No | No |
<!-- /ANCHOR:attributes-summary -->

---

<!-- ANCHOR:multiple-instances -->
## Multiple Instances

Each button can have unique CMS-driven text:

```
📦 Products Section
│   └── 🔘 Button [data-load-collapsed="View All Products"]
│                 [data-load-expanded="Show Less"]

📦 Team Section
│   └── 🔘 Button [data-load-collapsed="Meet The Team"]
│                 [data-load-expanded="Collapse"]

📦 FAQ Section (CMS Collection)
│   └── 🔘 Button [data-load-collapsed="{CMS: collapsed_text}"]
│                 [data-load-expanded="{CMS: expanded_text}"]
```
<!-- /ANCHOR:multiple-instances -->

---

<!-- ANCHOR:animations -->
## Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Expanded items | Fade in + slide up | 0.3s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Icon rotation | 0° → 180° | 0.3s | `cubic-bezier(0.22, 1, 0.36, 1)` |
<!-- /ANCHOR:animations -->

---

<!-- ANCHOR:troubleshooting -->
## Troubleshooting

| Issue | Solution |
|-------|----------|
| Items not hiding | Check `data-load="expanded"` on hidden items |
| Button not working | Verify `data-target="load-toggle-trigger"` on button |
| Text not appearing | Ensure `data-target="load-toggle-text"` on text element inside button |
| Text not changing | Verify text element is inside the button |
| CMS text not working | Check `data-load-collapsed` / `data-load-expanded` are on the **button** |
| Icon not rotating | Check `data-target="load-icon"` and CSS rules |
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:files-reference -->
## Files Reference

| File | Location |
|------|----------|
| JS Source | `src/2_javascript/menu/load_toggle.js` |
| JS Minified | `src/2_javascript/z_minified/menu/load_toggle.js` |
| CSS | `src/1_css/menu/menu_load_toggle.css` |
| CDN URL | `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/load_toggle.js?v=1.1.0` |
<!-- /ANCHOR:files-reference -->
