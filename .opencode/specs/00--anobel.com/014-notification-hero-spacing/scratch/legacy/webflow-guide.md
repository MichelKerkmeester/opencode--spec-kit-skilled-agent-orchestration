# Webflow Implementation Guide

<!-- ANCHOR:overview -->
## Overview

This guide provides step-by-step instructions to implement the notification-aware hero spacing in Webflow.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:step-1-add-the-spacer-div -->
## Step 1: Add the Spacer Div

### In Webflow Designer:

1. **Open your project** in Webflow Designer

2. **Navigate to the hero section**
   - If using a component: Edit the hero component
   - If page-specific: Go to each page with a hero

3. **Add a Div Block**
   - Click the `+` button to add elements
   - Drag a **Div Block** into the hero section
   - Position it as the **FIRST child** (top of the hero)

4. **Add custom attribute**
   - Select the new div
   - Open Element Settings panel (gear icon or `D` key)
   - Scroll to **Custom Attributes**
   - Click `+` to add new attribute
   - Name: `data-notification-spacer`
   - Value: leave empty (or use `true`)

5. **Set initial styles**
   - Display: `None`
   - Height: `0px`
   - (Optional) Add a class like `spacer` for easier selection in Designer

6. **Verify placement**
   - The div should be invisible in the Designer
   - It should be the first element inside the hero wrapper

### Visual Reference:

```
Hero Section
├── [data-notification-spacer]  ← Add this div with attribute (hidden by default)
├── Hero Content
├── Hero Image
└── ...
```

---
<!-- /ANCHOR:step-1-add-the-spacer-div -->

<!-- ANCHOR:step-2-add-custom-css -->
## Step 2: Add Custom CSS

### Option A: Site-Level Custom Code (Recommended)

1. Go to **Project Settings** (gear icon)
2. Click **Custom Code** tab
3. In the **Head Code** section, add:

```html
<style>
/* ─────────────────────────────────────────────────────────────
   HERO: Notification Spacer
   Shows spacing in hero when notification bar is active
   ───────────────────────────────────────────────────────────── */

[data-notification-spacer] {
  display: none;
}

/* Show spacer when notification is active */
body:has([data-alert-container-active]) [data-notification-spacer] {
  display: block;
}
</style>
```

4. Click **Save Changes**

### Option B: Page-Level Custom Code

If you only need this on specific pages:

1. Select the page in the Pages panel
2. Click the **gear icon** (Page Settings)
3. Scroll to **Custom Code**
4. Add the CSS in the **Head Code** section

---
<!-- /ANCHOR:step-2-add-custom-css -->

<!-- ANCHOR:step-3-adjust-the-height -->
## Step 3: Adjust the Height

The spacer height should match your notification bar height:

1. **Measure the notification bar**
   - Open your site in a browser
   - Open DevTools (F12 or Cmd+Option+I)
   - Select the notification bar element
   - Note the height (e.g., 52px, 64px)

2. **Update the CSS**
   - Change `height: 60px;` to match your measurement

### Using CSS Variables (Advanced)

For dynamic height management:

```css
:root {
  --notification-height: 60px;
}

body:has([data-alert-container-active]) [data-notification-spacer] {
  display: block;
  height: var(--notification-height);
}
```

---
<!-- /ANCHOR:step-3-adjust-the-height -->

<!-- ANCHOR:step-4-publish-and-test -->
## Step 4: Publish and Test

### Testing Checklist

1. **Publish to staging** (or use Webflow preview)

2. **Test Scenario 1: No Notification**
   - Ensure no notifications are active (check CMS)
   - Verify spacer is invisible
   - Check hero content position is normal

3. **Test Scenario 2: With Notification**
   - Activate a notification in CMS
   - Verify spacer appears
   - Check hero content shifts down appropriately

4. **Test Scenario 3: Dismiss Notification**
   - Click the close button on notification
   - Verify spacer disappears
   - Check hero content returns to normal position

5. **Test Scenario 4: Page Refresh**
   - With notification active, refresh the page
   - Verify spacer is visible immediately (no flash)

### Console Testing Commands

Open browser console and run:

```javascript
// Enable debug mode
AnobelAlerts.debug(true);

// Check current notification state
AnobelAlerts.getVisible();

// Force refresh visibility
AnobelAlerts.refresh();

// Clear dismissed notifications (for testing)
AnobelAlerts.clearDismissals();
```

---
<!-- /ANCHOR:step-4-publish-and-test -->

<!-- ANCHOR:troubleshooting -->
## Troubleshooting

### Spacer Not Showing

1. **Check CSS is loaded**
   - Open DevTools > Elements
   - Search for `data-notification-spacer`
   - Verify styles are applied

2. **Check notification has attribute**
   - Find `[data-alert="container"]` in Elements
   - Verify it has `data-alert-container-active="true"` when notification is visible

3. **Check browser support**
   - CSS `:has()` requires modern browsers
   - If issues, implement the JavaScript fallback (see below)

### Layout Jump on Load

Add this CSS to prevent flash:

```css
[data-notification-spacer] {
  opacity: 0;
  transition: opacity 0.3s ease, height 0.3s ease;
}

body:has([data-alert-container-active]) [data-notification-spacer] {
  opacity: 1;
}
```

### Need Legacy Browser Support?

If supporting older browsers, add this JavaScript to `nav_notifications.js`:

```javascript
// Add after line 310 in update_visibility()
document.body.toggleAttribute('data-notification-active', !!winner);
```

Then update CSS:

```css
body[data-notification-active] [data-notification-spacer] {
  display: block;
  height: 60px;
}
```

---
<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:summary -->
## Summary

| Step      | Action                    | Time        |
| --------- | ------------------------- | ----------- |
| 1         | Add spacer div in Webflow | 5 min       |
| 2         | Add custom CSS            | 5 min       |
| 3         | Adjust height value       | 2 min       |
| 4         | Test all scenarios        | 10 min      |
| **Total** |                           | **~20 min** |

---
<!-- /ANCHOR:summary -->

<!-- ANCHOR:files-reference -->
## Files Reference

- **Notification JS:** `src/2_javascript/navigation/nav_notifications.js`
- **Spec Folder:** `.opencode/specs/00--anobel.com/z_archive/014-notification-hero-spacing/`
<!-- /ANCHOR:files-reference -->
