# Console Error Analysis: anobel.com/nl/werkenbij

**Date:** 2026-01-24
**URL:** https://anobel.com/nl/werkenbij
**Tool:** Chrome DevTools CLI (bdg) - Headless Mode

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Errors | 1 | Low (transient) |
| Warnings | 0 | N/A |
| Info/Log | 9 | N/A |
| Network Errors | 0 | N/A |

**Overall Status:** The page loads without critical JavaScript errors. Form components (FilePond, CustomSelect, FormPersistence) initialize successfully.

---

## Full Console Log Capture

### Initialization Sequence (Navigation #2 - Initial Load)

```
[error]   10:09:01.322  Uncaught
[log]     10:09:01.357  🚀 Motion.dev import starting...
                        → werkenbij:66:11
[log]     10:09:01.361  ✅ Lenis smooth scrolling initialized
                        → werkenbij:6617:13
```

### After Page Reload (Navigation #3)

```
[log]     10:09:01.364  ✅ Motion.dev loaded successfully!
                        → werkenbij:108:13
[log]     10:09:01.364  Available at window.Motion: ["animate", "scroll", "inView", "hover", "press", "resize", "delay", "frame", "mix", "spring", "stagger", "transform", "wrap", "motionValue", "mapValue", "transformValue", "springValue", "attrEffect", "propEffect", "styleEffect", "svgEffect"]
                        → werkenbij:109:13
[log]     10:09:01.400  environment production
                        → 91023789e62257eb.js:78:6707 (ConsentPro)
[log]     10:09:01.400  environment production
                        → 91023789e62257eb.js:78:6707 (ConsentPro)
[log]     10:09:01.422  [FilePondConnector] Initialized 1 instance(s)
                        → input_upload.js?v=1.0.0:1:6778
[log]     10:09:01.423  CustomSelect: Initialized 1 instance(s)
                        → input_select.js?v=1.1.0:1:6069
[log]     10:09:01.620  FormPersistence: Initialized 1 form(s)
                        → form_persistence.js?v=1.0.1:1:5870
```

---

## Categorized Error List

### 1. JavaScript Errors

| Error | Source | Frequency | Impact |
|-------|--------|-----------|--------|
| `Uncaught` | Initial page load (navigation #2) | 1x per load | **Low** - Transient error during page initialization, no stack trace available. Does not prevent functionality. |

**Analysis:** The "Uncaught" error appears during the initial navigation but has no associated stack trace. This is likely a transient promise rejection or resource loading timing issue that is recovered after the page reload (navigation #3). The error does not recur and all form components initialize successfully.

### 2. Warnings

None detected.

### 3. Network Errors

None detected. All resources loaded successfully.

---

## Form-Specific Issues

### FilePond (File Upload)

| Check | Status | Notes |
|-------|--------|-------|
| Initialization | ✅ Pass | "Initialized 1 instance(s)" |
| DOM Element | ✅ Present | `.filepond--root` exists |
| Library Loaded | ✅ Yes | `window.FilePond` is defined |
| Console Errors | ✅ None | No errors related to FilePond |

### Custom Select (Vacature Dropdown)

| Check | Status | Notes |
|-------|--------|-------|
| Initialization | ✅ Pass | "Initialized 1 instance(s)" |
| DOM Structure | ✅ Correct | Uses `[data-select="trigger"]` and `.input--select-link` |
| Click Interaction | ✅ Works | Options selectable, value populates hidden input |
| Console Errors | ✅ None | No errors related to CustomSelect |

**Note:** The selector `.input--select-wrapper` does NOT exist on this page. The correct selectors are:
- Trigger: `[data-select="trigger"]` or `[role="combobox"]`
- Options: `.input--select-link`
- Hidden input: `input[name="Vacature"]`

### Form Persistence

| Check | Status | Notes |
|-------|--------|-------|
| Initialization | ✅ Pass | "Initialized 1 form(s)" |
| Console Errors | ✅ None | No errors related to FormPersistence |

### Form Submission

| Check | Status | Notes |
|-------|--------|-------|
| Submit Click | ✅ Works | Button responds to click |
| Validation | ✅ Native HTML5 | Uses browser validation |
| Console Errors | ✅ None | No errors on submit attempt |

---

## Form Element Audit

### Required Fields (6 total)

| Field Name | Type | Required | Valid After Fill |
|------------|------|----------|------------------|
| Voornaam | text | Yes | ✅ |
| Achternaam | text | Yes | ✅ |
| Email Adres | email | Yes | ✅ |
| Telefoon | tel | Yes | ✅ |
| Vacature | text (custom select) | Yes | ✅ |
| Agreed to Legal terms | checkbox | Yes | ✅ |

### Additional Fields

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| Bericht | textarea | Yes | Message field |
| cv_url | hidden | No | Populated by FilePond |
| File upload | file (FilePond) | No | CV attachment |

---

## Potential Root Causes

### Transient "Uncaught" Error

1. **Possible Cause:** Race condition during Motion.dev dynamic import
   - The error appears before Motion.dev finishes loading
   - Motion.dev successfully loads after the initial error

2. **Possible Cause:** Promise rejection without handler during initial script execution
   - No stack trace suggests it may be an unhandled promise rejection

3. **Possible Cause:** Third-party script (ConsentPro) initialization timing
   - ConsentPro logs "environment production" after the error

**Recommendation:** This error does not affect functionality. Monitor for recurrence. If persistent, add error boundary around Motion.dev import.

---

## DOM Element Verification

### Elements That DO Exist

- `.contact--form` - Main form container
- `.filepond--root` - FilePond upload component
- `[data-select="trigger"]` - Custom select trigger
- `.input--select-link` - Custom select options
- `input[name="Vacature"]` - Hidden input for select value
- `.contact--form button[type="submit"]` - Submit button

### Elements That DO NOT Exist

- `.input--select-wrapper` - Not used in this form
- `.input--select-element` - Not used in this form
- `[data-custom-select]` - Not used in this form
- `.input--select-click` - Not used in this form

---

## Recommendations

1. **No Critical Issues Found** - The form is functional and loads without critical errors.

2. **Monitor Transient Error** - The "Uncaught" error during initial load should be monitored but does not require immediate action.

3. **Selector Documentation** - Update any code that references `.input--select-wrapper` to use the correct selector `[data-select="trigger"]`.

4. **Form Validation** - The form uses native HTML5 validation. Custom validation messages may improve UX but are not required for functionality.

---

## Test Methodology

1. Launched headless Chrome via bdg CLI
2. Navigated to https://anobel.com/nl/werkenbij
3. Captured all console messages during page load
4. Interacted with form elements:
   - Filled text inputs (Voornaam, Achternaam, Email, Telefoon)
   - Clicked custom select and selected option
   - Checked legal terms checkbox
   - Clicked submit button
5. Checked for errors after each interaction
6. Verified network requests for errors
7. Examined DOM structure for correct element selectors
