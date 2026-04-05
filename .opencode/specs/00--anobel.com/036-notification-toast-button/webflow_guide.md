# Webflow Configuration & Testing Guide: Notification Toast Button

Step-by-step guide for adding a CMS-driven link button inside the notification toast template in Webflow.

---

<!-- ANCHOR:prerequisites -->
## 1. PREREQUISITES

Before configuring Webflow, ensure:

- [ ] Updated `nav_notifications.js` with button support is deployed to the CDN
- [ ] Webflow site embed/script points to the updated JS file
- [ ] You have access to **Webflow Designer** and the **Meldingen** CMS collection
- [ ] The CMS collection already contains the fields **Button** and **URL**

> ⚠️ **IMPORTANT**: If the updated JS is not live yet, the `<a data-alert="button">` element may render incorrectly or stay visible when Button/URL is empty.

---
<!-- /ANCHOR:prerequisites -->

<!-- ANCHOR:webflow-template-setup -->
## 2. ADD THE LINK ELEMENT INSIDE THE ALERT TEMPLATE

### Step 2.1: Open the alert item template

1. Open **Webflow Designer**
2. Go to the page or component that contains the notification toast
3. Select the **Alerts** collection list
4. Click into one **alert item** so you are editing the repeated CMS template element

### Step 2.2: Add a Link element

1. Press `A` or use the **Add Elements** panel
2. Drag a **Text Link** (or Link Block, if needed) into the alert item
3. Place it inside the existing toast content area, after the text content
4. Confirm the element renders as an `<a>` tag in Webflow

### Recommended structure

```text
[data-alert="item"]
├── Title
├── Bullet / Description
└── <a data-alert="button">Button label</a>
```

> Keep the link inside the same alert item wrapper that already contains the title and description.

---
<!-- /ANCHOR:webflow-template-setup -->

<!-- ANCHOR:custom-attribute -->
## 3. ADD THE CUSTOM ATTRIBUTE

1. Select the new link element
2. Open **Element Settings** (gear icon)
3. Scroll to **Custom Attributes**
4. Click `+ Add Custom Attribute`
5. Set:
   - **Name:** `data-alert`
   - **Value:** `button`

### Expected result

Your link should now be:

```html
<a data-alert="button">...</a>
```

> This attribute is required. The JS looks specifically for `[data-alert="button"]`.

---
<!-- /ANCHOR:custom-attribute -->

<!-- ANCHOR:cms-binding -->
## 4. BIND THE CMS FIELDS

### Step 4.1: Bind the link text to the Button field

1. Select the new link element
2. In the link text content, click **Get text from CMS**
3. Choose the **Button** field
4. Confirm the preview shows the CMS label

### Step 4.2: Bind the link URL to the URL field

1. With the same link selected, open **Element Settings**
2. In **Link Settings**, choose **Get URL from CMS**
3. Select the **URL** field
4. Save the binding

### Verify both bindings

- **Text content** → `Button`
- **Href / Link target** → `URL`

> If only the text is bound and the URL is not, the JS will hide the button.

---
<!-- /ANCHOR:cms-binding -->

<!-- ANCHOR:styling -->
## 5. STYLE THE BUTTON AS A TEXT LINK

Style the new link so it matches the existing toast typography.

### Recommended Webflow styling

1. Add a class such as `alert_button` or `notification_button`
2. Match the existing toast text settings:
   - Font family: same as toast body text
   - Font size: same or one emphasis step up
   - Font weight: medium or semibold
   - Line height: match surrounding text
3. Set link styling:
   - Text decoration: underline or brand-standard link style
   - Background: none
   - Border: none
   - Padding: 0
4. Add a small top or left gap only if needed
5. Verify hover and focus styles are visible

### Layout guidance

- Treat it like a **text link button**, not a solid CTA button
- Avoid large padding, fixed widths, or block-level button styles unless the toast design already supports that
- Keep the link readable on one line where possible

---
<!-- /ANCHOR:styling -->

<!-- ANCHOR:testing-scenarios -->
## 6. TESTING SCENARIOS

Publish to staging or preview, then test these scenarios.

### Test 1: Button with URL

**Setup**
1. In **Meldingen**, set:
   - **Button:** `Read more`
   - **URL:** `/nieuws`
2. Ensure the alert is active
3. Publish the site

**Expected**
- The toast shows a visible link labelled `Read more`
- Clicking it opens `/nieuws`

---

### Test 2: Empty Button field

**Setup**
1. In **Meldingen**, leave:
   - **Button:** empty
   - **URL:** populated or empty
2. Publish the site

**Expected**
- No button is visible
- Toast spacing/layout remains clean

---

### Test 3: External URL

**Setup**
1. In **Meldingen**, set:
   - **Button:** `Visit partner site`
   - **URL:** `https://example.com`
2. Publish the site

**Expected**
- The button is visible
- Clicking opens a **new tab**
- The link gets `target="_blank"` and `rel="noopener noreferrer"`

---

### Test 4: Same-domain URL

**Setup**
1. In **Meldingen**, set:
   - **Button:** `See details`
   - **URL:** `/over-ons`
2. Publish the site

**Expected**
- The button is visible
- Clicking opens in the **same tab**
- No forced `target="_blank"` is added

---
<!-- /ANCHOR:testing-scenarios -->

<!-- ANCHOR:debug-commands -->
## 7. DEBUG COMMANDS

Open browser Console (`F12` or `Cmd+Option+I`) and run:

```javascript
// Enable debug logging
AnobelAlerts.debug(true);

// Clear dismissed alerts so your test alert can re-appear
AnobelAlerts.clearDismissals();

// Re-run visibility logic
AnobelAlerts.refresh();

// Inspect all parsed alerts
AnobelAlerts.getAll();

// Check which alert is currently visible
AnobelAlerts.getVisible();
```

### Helpful DOM checks

```javascript
// Inspect the visible button element
document.querySelector('[data-alert-visible="true"] [data-alert="button"]');

// Check current button label
document.querySelector('[data-alert-visible="true"] [data-alert="button"]')?.textContent?.trim();

// Check current button href
document.querySelector('[data-alert-visible="true"] [data-alert="button"]')?.getAttribute('href');

// Check target behavior
document.querySelector('[data-alert-visible="true"] [data-alert="button"]')?.getAttribute('target');
```

---
<!-- /ANCHOR:debug-commands -->

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

### Issue: Button never appears

Check:
1. The link element exists inside the alert item template
2. The link has `data-alert="button"`
3. The **Button** field contains non-empty text
4. The **URL** field is bound to the link
5. The updated JS is deployed and loaded on the page

### Issue: Button text appears, but it is not clickable

Check:
1. The element is a real **Link** element, not a Text Block
2. **Link Settings** are bound to the CMS **URL** field
3. `href` is not empty or `#`

Console check:

```javascript
document.querySelector('[data-alert-visible="true"] [data-alert="button"]')?.outerHTML;
```

### Issue: External link opens in same tab

Check:
1. The URL is a fully qualified external URL such as `https://example.com`
2. Run:

```javascript
document.querySelector('[data-alert-visible="true"] [data-alert="button"]')?.getAttribute('target');
```

Expected:

```javascript
"_blank"
```

### Issue: Same-domain link opens in a new tab

Check the CMS URL value:
- Use `/page-slug`
- Or `https://anobel.com/page-slug`

If needed, refresh the alert logic:

```javascript
AnobelAlerts.refresh();
```

### Issue: Button space looks too large

Check:
1. Margin or padding on the new link class
2. Whether the link is set to `display: block`
3. Whether the toast stack or flex settings need a smaller gap

---
<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:deployment-checklist -->
## 9. DEPLOYMENT CHECKLIST

- [ ] Updated `nav_notifications.js` deployed
- [ ] Webflow link element added inside the alert item
- [ ] `data-alert="button"` attribute added
- [ ] Text bound to CMS **Button** field
- [ ] URL bound to CMS **URL** field
- [ ] Styling matches toast typography
- [ ] Button with URL tested
- [ ] Empty Button tested
- [ ] External URL tested
- [ ] Same-domain URL tested
- [ ] Webflow site published

---
<!-- /ANCHOR:deployment-checklist -->
