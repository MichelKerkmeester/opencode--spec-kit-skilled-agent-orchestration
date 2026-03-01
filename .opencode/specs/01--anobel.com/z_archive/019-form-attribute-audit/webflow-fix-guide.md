# Webflow Fix Guide: Form Attribute Audit

> Step-by-step instructions for fixing form attribute issues on anobel.com/nl/werkenbij

---

<!-- ANCHOR:quick-reference -->
## Quick Reference

| Priority | Issue | Time | Page |
|----------|-------|------|------|
| **P0** | Empty vacancy select values | 5 min | CMS Settings |
| **P0** | Missing label IDs | 10 min | Werken Bij page |
| **P0** | Missing helper text IDs | 5 min | Werken Bij page |
| **P1** | Empty button IDs | 15 min | Global/Symbols |
| **P1** | Empty data-btn attributes | 15 min | Global/Symbols |

<!-- /ANCHOR:quick-reference -->

---

<!-- ANCHOR:p0-critical-fixes -->
## P0 Critical Fixes

### Fix 1: Empty `data-value` on Vacancy Select Options

**Problem:** When users select a vacancy, the form submits an empty string instead of the vacancy name.

**Location:** Werken Bij page → Contact Form → Custom Select dropdown

**Steps:**

1. Open **Webflow Designer** → Navigate to **Werken Bij** page
2. Find the **Custom Select** component (vacancy dropdown)
3. Click on the **Collection List** inside the dropdown
4. Select one of the **Collection Items** (e.g., "Bunkerschipper")
5. Open the **Settings Panel** (gear icon) or **Element Settings**
6. Find **Custom Attributes** section
7. Look for `data-value` attribute

**Current State:**
```
data-value = "" (empty)
```

**Fix - Option A (Static binding):**
```
Attribute: data-value
Value: Bunkerschipper
```

**Fix - Option B (CMS binding - Recommended):**
```
Attribute: data-value
Value: Click purple dot → Select "Name" or "Slug" field from CMS
```

8. Repeat for ALL vacancy options in the Collection List
9. **Publish** and test form submission

**Verification:**
- Submit form with vacancy selected
- Check Formspark submission includes actual vacancy name

---

### Fix 2: Missing Label IDs for ARIA References

**Problem:** Screen readers cannot associate labels with inputs because `aria-labelledby` references non-existent IDs.

**Location:** Werken Bij page → Contact Form → Each input field's label

**Steps:**

1. Open **Webflow Designer** → Navigate to **Werken Bij** page
2. Find the **Contact Form**
3. For each input below, select its **Label element**:

| Input | Label to Select | ID to Add |
|-------|-----------------|-----------|
| Voornaam | Label above Voornaam input | `label-voornaam` |
| Email | Label above Email input | `label-email` |
| Telefoon | Label above Telefoon input | `label-telefoon` |
| Bericht | Label above Bericht textarea | `label-bericht` |
| Terms checkbox | Label next to checkbox | `label-terms-conditions` |

4. For each label:
   - Select the label element
   - Open **Element Settings** panel (gear icon)
   - Scroll to **ID** field
   - Enter the ID from the table above

**Example for Voornaam:**
```
Element: Label (text "Voornaam")
ID: label-voornaam
```

5. **Publish** and verify with accessibility tool

**Visual Guide:**
```
┌─────────────────────────────────────┐
│ Form Field Structure                │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Label: "Voornaam"           │◄── Add ID here: label-voornaam
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Input                       │    │ Already has: aria-labelledby="label-voornaam"
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

### Fix 3: Missing Helper Text IDs

**Problem:** Helper/error text containers are referenced by inputs but don't have IDs.

**Location:** Werken Bij page → Contact Form → Helper text elements below inputs

**Steps:**

1. Find helper text elements (small text below inputs showing format hints or errors)
2. These are typically in an **Input Wrapper** structure:

```
Input | Main (wrapper)
├── Label
├── Input Field
└── Helper Text ◄── Add ID here
```

3. For each input with `aria-describedby`, find its helper text element
4. Add matching ID:

| Input | Helper Text ID |
|-------|----------------|
| Voornaam | `helper-voornaam` |
| Email | `helper-email` |
| Telefoon | `helper-telefoon` |
| Bericht | `helper-bericht` |

5. Verify the input's `aria-describedby` matches the ID you added

<!-- /ANCHOR:p0-critical-fixes -->

---

<!-- ANCHOR:p1-high-priority-fixes -->
## P1 High Priority Fixes

### Fix 4: Empty Button ID Attributes

**Problem:** 122 buttons have `id=""` which is invalid HTML.

**Location:** Global - Button symbols/components

**Option A - Remove Empty IDs (Recommended):**

1. Open **Webflow Designer**
2. Go to **Symbols** panel (if buttons are symbols)
3. Find the main **Button** symbol/component
4. Select the button element
5. In **Element Settings**, clear the ID field completely
6. If ID field shows empty quotes, delete the entire attribute

**Option B - In Custom Code:**
If buttons are generated dynamically, add this to page custom code (before `</body>`):

```javascript
// Remove empty ID attributes from buttons
document.querySelectorAll('button[id=""]').forEach(btn => {
  btn.removeAttribute('id');
});
```

---

### Fix 5: Empty data-btn-* Attributes

**Problem:** Buttons have empty custom attributes adding unnecessary DOM weight.

**Location:** Global - Button symbols/components

**Attributes to Clean:**
- `data-btn-action=""`
- `data-btn-border-color=""`
- `data-btn-hover=""`

**Steps:**

1. Open button symbol/component
2. Go to **Element Settings** → **Custom Attributes**
3. For each empty attribute:
   - If not used: **Delete** the attribute entirely
   - If used elsewhere: Add a meaningful value

**Decision Guide:**
```
Is the attribute used by JavaScript?
├── YES → Add proper value (e.g., data-btn-action="submit")
└── NO  → Delete the attribute
```

<!-- /ANCHOR:p1-high-priority-fixes -->

---

<!-- ANCHOR:p2-medium-priority-fixes -->
## P2 Medium Priority Fixes

### Fix 6: Add Form ID

**Location:** Werken Bij page → Contact Form

**Steps:**
1. Select the `<form>` element
2. Add ID: `contact-form-werkenbij`

**Benefit:** Enables analytics tracking and JS targeting

---

### Fix 7: Add Landmark Regions

**Location:** Global layout / Page structure

**Steps:**
1. Wrap header content in `<header>` element or add `role="banner"`
2. Wrap main content in `<main>` element or add `role="main"`

**In Webflow:**
- Select the header wrapper → Element Settings → Tag → Change to `header`
- Select the main content wrapper → Element Settings → Tag → Change to `main`

---

### Fix 8: External Link Warnings

**Problem:** 18 links open in new tabs without warning screen reader users.

**Location:** Various links across page

**Fix Option A - Add aria-label:**
```
Link text: "Read more"
aria-label: "Read more (opens in new tab)"
```

**Fix Option B - Add visual indicator:**
Add external link icon + screen-reader text:
```html
<span class="sr-only">(opens in new tab)</span>
```

<!-- /ANCHOR:p2-medium-priority-fixes -->

---

<!-- ANCHOR:verification-checklist -->
## Verification Checklist

After making fixes, verify:

### Form Submission Test
- [ ] Go to https://anobel.com/nl/werkenbij
- [ ] Fill out form with vacancy selected
- [ ] Submit form
- [ ] Check Formspark dashboard - vacancy name should appear (not empty)

### Accessibility Test
- [ ] Run WAVE browser extension on page
- [ ] Verify no "missing label" errors
- [ ] Verify no "broken ARIA reference" errors

### Keyboard Test
- [ ] Tab through entire form
- [ ] Can open dropdown with Enter/Space
- [ ] Can navigate dropdown with Arrow keys
- [ ] Can select option with Enter
- [ ] Can close dropdown with Escape

### Screen Reader Test (Optional)
- [ ] VoiceOver (Mac) or NVDA (Windows)
- [ ] Labels announced when focusing inputs
- [ ] Dropdown announces as "combobox"
- [ ] Options announced when navigating

<!-- /ANCHOR:verification-checklist -->

---

<!-- ANCHOR:element-selector-reference -->
## Element Selector Reference

Use these selectors to find elements in Webflow Navigator:

| Element | CSS Selector | Webflow Class |
|---------|--------------|---------------|
| Custom Select Wrapper | `[data-select="wrapper"]` | `.input--select-wrapper` |
| Select Trigger | `[data-select="trigger"]` | `.input--select-trigger` |
| Select Input | `[data-select="input"]` | `.input--select-input` |
| Select Dropdown | `[data-select="dropdown"]` | `.input--select-dropdown` |
| Select Options | `[data-select="option"]` | `.input--select-link` |
| File Upload Wrapper | `[data-file-upload="wrapper"]` | `.input--upload-wrapper` |
| Form | `form[action*="submit-form"]` | `.w-form` |

<!-- /ANCHOR:element-selector-reference -->

---

<!-- ANCHOR:quick-copy-paste-all-ids-to-add -->
## Quick Copy-Paste: All IDs to Add

```
Labels:
- label-voornaam
- label-email
- label-telefoon
- label-bericht
- label-terms-conditions

Helper Text:
- helper-voornaam
- helper-email
- helper-telefoon
- helper-bericht

Form:
- contact-form-werkenbij
```

<!-- /ANCHOR:quick-copy-paste-all-ids-to-add -->

---

<!-- ANCHOR:support -->
## Support

If issues persist after fixes:
1. Check browser console for JavaScript errors
2. Verify CustomSelect script is loading (v1.1.0+)
3. Check that CMS Collection is published
4. Clear Webflow cache and republish
<!-- /ANCHOR:support -->
