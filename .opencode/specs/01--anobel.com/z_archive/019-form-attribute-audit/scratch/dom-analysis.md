# DOM Attribute Analysis: anobel.com/nl/werkenbij

**Analysis Date:** 2026-01-24
**Target URL:** https://anobel.com/nl/werkenbij
**Tool:** Chrome DevTools CLI (bdg)

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total Form Elements** | 148 |
| **Forms** | 3 |
| **Inputs** | 12 |
| **Selects** | 0 (custom implementation) |
| **Textareas** | 1 |
| **Buttons** | 132 |
| **Elements With Issues** | 128 |
| **Empty Attribute Instances (buttons only)** | 478 |

---

## Form Inventory

### Form 1: Cookie Preferences
| Property | Value |
|----------|-------|
| **ID** | `cookie-preferences` |
| **Name** | `wf-form-Cookie-Preferences` |
| **Method** | GET |
| **Action** | Current page |
| **Input Count** | 5 (4 checkboxes + 1 submit) |
| **Purpose** | Cookie consent settings |

**Attributes:**
```json
{
  "id": "cookie-preferences",
  "name": "wf-form-Cookie-Preferences",
  "data-name": "Cookie Preferences",
  "method": "get",
  "fs-consent-element": "form",
  "class": "form is--cc-settings",
  "data-wf-page-id": "6741ee7bd36f8c4832149760",
  "data-wf-element-id": "619fb452-be6c-e7b6-7724-2a7e670a9d56",
  "data-wf-locale-id": "6723d26a4aa4a278cad8f5c7",
  "aria-label": "Cookie Preferences"
}
```

### Form 2: Contact/Application Form (Main)
| Property | Value |
|----------|-------|
| **ID** | `` (EMPTY) |
| **Name** | `Contact Form` |
| **Method** | POST |
| **Action** | `https://submit-form.com/M9fFFhN0D` |
| **Input Count** | 10 |
| **Purpose** | Job application submission |

**Attributes:**
```json
{
  "name": "Contact Form",
  "aria-label": "Contact Form",
  "method": "post",
  "action": "https://submit-form.com/M9fFFhN0D",
  "class": "contact--form",
  "data-formspark-url": "https://submit-form.com/M9fFFhN0D",
  "data-botpoison-public-key": "pk_e9dad87a-1068-421c-b150-75e18916014e",
  "data-form-submit": "true",
  "data-form-enhance": "true",
  "data-form-reset": "true",
  "data-form-reset-preserve": "[name='Voornaam'], [name='Achternaam'], [name='Email Adres'], [name='Telefoon']",
  "data-form-persist": "",
  "data-form-live-validation": "",
  "data-success-modal": "[data-modal-target='contact-success']",
  "data-validation-bound": "1",
  "data-form-reset-delay": "200",
  "data-form-configured": "true",
  "data-form-submit-enhanced": "true",
  "data-persist-bound": "1"
}
```

### Form 3: Email Form (Unused/Empty)
| Property | Value |
|----------|-------|
| **ID** | `email-form` |
| **Name** | `email-form` |
| **Method** | GET |
| **Action** | Current page |
| **Input Count** | 0 |
| **Purpose** | Unknown (appears unused) |

---

## Complete Attribute Inventory

### Attribute Usage Statistics

| Attribute | Count | Notes |
|-----------|-------|-------|
| class | 147 | Present on nearly all elements |
| type | 145 | |
| id | 129 | 122 are EMPTY |
| data-btn-type | 124 | Button styling |
| data-btn-variant | 124 | Button styling |
| data-btn-size | 124 | Button styling |
| data-btn-padding | 124 | Button styling |
| data-btn-content | 124 | Button styling |
| data-btn-gap | 124 | Button styling |
| data-btn-border | 124 | Button styling |
| data-btn-weight | 124 | Button styling |
| data-btn-align | 124 | Button styling |
| data-btn-hover | 124 | 96 are EMPTY |
| data-btn-action | 124 | ALL 124 are EMPTY |
| data-btn-border-color | 120 | 120 are EMPTY |
| name | 16 | |
| data-autofill-bound | 13 | Runtime binding flag |
| aria-labelledby | 12 | Accessibility |
| aria-describedby | 10 | Accessibility |
| fs-consent-element | 10 | Finsweet consent |
| aria-required | 7 | |
| required | 7 | |
| placeholder | 6 | |
| data-placeholder | 6 | |
| inputmode | 6 | |
| autocomplete | 6 | |
| data-input-icon | 6 | |
| data-form-input | 6 | |
| data-error-required | 6 | |
| data-original-placeholder | 6 | |
| data-validate-rules | 5 | |
| role | 5 | |
| tabindex | 5 | |
| style | 5 | |
| data-alert | 4 | |
| data-scroll | 3 | |
| aria-label | 3 | |
| data-error-minlength | 3 | |
| data-name | 2 | |
| data-wf-page-id | 2 | Webflow IDs |
| data-wf-element-id | 2 | Webflow IDs |
| data-wf-locale-id | 2 | Webflow IDs |
| data-modal-close | 2 | |

---

## Anomalies Detected

### CRITICAL: Empty `data-value` on Select Options

**Location:** Custom select dropdown for "Vacature" (job position)

| Option Text | data-value |
|-------------|------------|
| Bunkerschipper | `""` (EMPTY) |
| Commercieel Medewerker | `""` (EMPTY) |
| Logistiek Medewerker | `""` (EMPTY) |

**Impact:** When users select an option, the form will submit an empty string instead of the actual selection value. This breaks form submission data integrity.

**Full Option Attributes:**
```json
{
  "role": "option",
  "data-select": "option",
  "data-value": "",
  "tabindex": "-1",
  "class": "input--select-link",
  "aria-selected": "false"
}
```

### HIGH: Empty ID Attributes (122 instances)

122 buttons have `id=""` instead of either:
- A valid unique ID
- No ID attribute at all

**Example:**
```html
<button id="" type="button" class="button" ...>
```

**Impact:**
- May cause issues with JavaScript targeting
- Creates invalid HTML (duplicate empty IDs)
- Accessibility tools may behave unexpectedly

### HIGH: Empty data-btn-* Attributes

| Attribute | Empty Count | Total |
|-----------|-------------|-------|
| data-btn-action | 124 | 124 (100%) |
| data-btn-border-color | 120 | 120 |
| data-btn-hover | 96 | 124 |
| data-btn-padding | 4 | 124 |
| data-btn-content | 3 | 124 |
| data-btn-weight | 3 | 124 |
| data-btn-variant | 1 | 124 |
| data-btn-border | 1 | 124 |

**Impact:** These empty attributes add DOM weight without purpose. `data-btn-action=""` on all 124 buttons suggests a pattern where the attribute was added but never populated.

### MEDIUM: FilePond Input Has Empty Name

**Element:**
```json
{
  "tagName": "input",
  "type": "file",
  "name": "",
  "id": "filepond--browser-97nldlyeq",
  "allAttributes": {
    "class": "filepond--browser",
    "type": "file",
    "id": "filepond--browser-97nldlyeq",
    "name": "",
    "aria-controls": "filepond--assistant-97nldlyeq",
    "aria-labelledby": "filepond--drop-label-97nldlyeq",
    "accept": "application/pdf,.doc,.docx"
  }
}
```

**Note:** This appears to be intentional FilePond behavior - the library handles file uploads via JavaScript and stores the URL in a hidden input (`cv_url`).

### MEDIUM: Cookie Form Checkbox with Wrong Name

```json
{
  "type": "checkbox",
  "name": "personalization",
  "fs-consent-element": "checkbox-analytics"
}
```

**Issue:** The checkbox has `name="personalization"` but `fs-consent-element="checkbox-analytics"`. This mismatch between the form field name and the consent element type could cause confusion in consent tracking.

### LOW: Empty Form ID

The main contact form has no ID:
```json
{
  "id": "",
  "name": "Contact Form"
}
```

**Impact:** Cannot be targeted by ID for JavaScript operations. Currently works via class selector (`.contact--form`).

---

## Custom Select Component Analysis

The page uses a custom select implementation (not native `<select>` elements):

**Structure:**
```
[data-select="wrapper"]           - Container div
  [data-select="trigger"]         - Combobox trigger (role="combobox")
    [data-select="input"]         - Hidden input (type="select", name="Vacature")
  [data-select="dropdown"]        - Listbox container (role="listbox")
    [data-select="option"]        - Individual options (role="option")
```

**Accessibility Attributes Present:**
- `role="combobox"` on trigger
- `role="listbox"` on dropdown
- `role="option"` on each option
- `aria-haspopup="listbox"`
- `aria-expanded` (toggles)
- `aria-controls` linking trigger to listbox
- `aria-selected` on options

**Issue:** Despite good accessibility structure, the missing `data-value` attributes prevent functional form submission.

---

## FilePond Configuration

**Component Found:**
```json
{
  "class": "filepond--root input is--upload filepond--hopper",
  "data-style-button-remove-item-position": "left",
  "data-style-button-process-item-position": "right",
  "data-style-load-indicator-position": "right",
  "data-style-progress-indicator-position": "right",
  "data-style-button-remove-item-align": "false",
  "aria-hidden": "true"
}
```

**Associated Hidden Input:**
```json
{
  "type": "hidden",
  "data-file-upload": "url",
  "name": "cv_url"
}
```

**Accepted Files:** `application/pdf,.doc,.docx`

---

## Raw Data for Cross-Reference

### Form Element Input Details

**Contact Form Inputs:**

| # | Type | Name | Required | Validation Rules |
|---|------|------|----------|------------------|
| 1 | text | Voornaam | Yes | required\|minlength:2 |
| 2 | text | Achternaam | Yes | required\|minlength:2 |
| 3 | email | Email Adres | Yes | required\|email |
| 4 | tel | Telefoon | Yes | required |
| 5 | select | Vacature | Yes | (none - custom) |
| 6 | textarea | Bericht | Yes | required\|minlength:10 |
| 7 | file | (FilePond) | No | - |
| 8 | hidden | cv_url | No | - |
| 9 | checkbox | Agreed to Legal terms | Yes | - |
| 10 | submit | (button) | No | - |

### All Button data-btn-type Values

| Type | Count |
|------|-------|
| Tertiary-Transparent-Black | Multiple |
| Secondary-Ghost | Multiple |
| Secondary-Full | Multiple |
| Primary-Full | Multiple |
| Tertiary-Transparent-White | Multiple |

---

## Recommendations

### P0 - Critical (Fix Immediately)

1. **Add `data-value` to select options**
   - Each option must have a unique, non-empty `data-value`
   - Suggested values: Match the text content or use slugs
   ```html
   <div data-select="option" data-value="bunkerschipper">Bunkerschipper</div>
   ```

### P1 - High Priority

2. **Remove or populate empty ID attributes**
   - Either remove `id=""` entirely from buttons
   - Or generate unique IDs if needed for functionality

3. **Clean up empty data-btn-* attributes**
   - Remove `data-btn-action=""` if unused
   - Remove `data-btn-border-color=""` if using defaults
   - Consider CSS fallback patterns instead of empty attributes

### P2 - Medium Priority

4. **Add ID to main contact form**
   - Add `id="contact-form"` or similar for easier targeting

5. **Fix cookie consent checkbox name mismatch**
   - Align `name` attribute with `fs-consent-element` type

---

## Appendix: Session Information

- **bdg version:** Latest
- **Chrome:** Headful mode
- **Page Load:** Complete (verified via screenshot)
- **Screenshot Dimensions:** 2152x8490 pixels
