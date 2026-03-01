# Accessibility Audit Report

**Page:** https://anobel.com/nl/werkenbij
**Date:** 2026-01-24
**Tool:** Chrome DevTools CDP via browser-debugger-cli (bdg) v0.6.10

---

## Executive Summary

The accessibility audit of the "Werken bij Nobel" (Work at Nobel) page reveals **multiple WCAG violations** primarily related to:

1. **Broken ARIA references** - aria-labelledby and aria-describedby point to non-existent IDs
2. **Missing form label associations** - Labels exist visually but lack programmatic association
3. **Custom dropdown accessibility gaps** - Missing required ARIA attributes for combobox pattern
4. **Modal accessibility issues** - Modals lack proper ARIA roles and focus management
5. **Missing landmark regions** - No `<header>` or `<main>` landmarks defined

**Critical Issues: 5**
**Serious Issues: 8**
**Moderate Issues: 6**

---

## 1. WCAG Violation List with Element References

### 1.1 Critical (WCAG Level A Failures)

| ID | WCAG SC | Issue | Element | Impact |
|----|---------|-------|---------|--------|
| C1 | 1.3.1 | Broken aria-labelledby references | `input[name="Voornaam"]` | Screen readers cannot determine input purpose |
| C2 | 1.3.1 | Broken aria-labelledby references | `input[name="Achternaam"]` | Same - references `label-voornaam` which doesn't exist |
| C3 | 1.3.1 | Broken aria-labelledby references | `input[name="Email Adres"]` | References `label-email` which doesn't exist |
| C4 | 1.3.1 | Broken aria-labelledby references | `input[name="Telefoon"]` | References `label-telefoon` which doesn't exist |
| C5 | 1.3.1 | Broken aria-labelledby references | `textarea[name="Bericht"]` | References `label-bericht` which doesn't exist |

### 1.2 Serious (WCAG Level A/AA Failures)

| ID | WCAG SC | Issue | Element | Impact |
|----|---------|-------|---------|--------|
| S1 | 1.3.1 | All aria-describedby references broken | All form inputs | Helper text not announced |
| S2 | 4.1.2 | Buttons without accessible names | `button.button` (index 0, 7) | Empty buttons are meaningless to AT |
| S3 | 4.1.2 | Custom combobox missing aria-label | `div.input--w[role="combobox"]` | No accessible name for dropdown |
| S4 | 4.1.2 | Listbox missing aria-label | `div.input--dropdown[role="listbox"]` | No accessible name for options |
| S5 | 1.3.1 | Missing landmark: header | Document structure | Page structure unclear |
| S6 | 1.3.1 | Missing landmark: main | Document structure | Main content not identified |
| S7 | 2.4.4 | Links open new window without warning | 18 links with `target="_blank"` | Users not warned of context change |
| S8 | 4.1.2 | Modal dialogs missing role="dialog" | `.modal.is--cc-settings`, etc. | AT doesn't recognize modal context |

### 1.3 Moderate (WCAG Level AA/Best Practices)

| ID | WCAG SC | Issue | Element | Impact |
|----|---------|-------|---------|--------|
| M1 | 1.3.1 | Labels not programmatically associated | All form labels except filepond | Labels need `for` attribute or wrap inputs |
| M2 | 4.1.2 | Checkbox missing accessible name | `input.input--checkbox-click` | References broken `label-terms-conditions` |
| M3 | 2.4.1 | Skip links pointing to `#` only | "Sluiten" links | Skip links should point to main content |
| M4 | 4.1.3 | Modals missing aria-modal="true" | All modals | Focus trap may not work correctly |
| M5 | 2.4.7 | Non-focusable clickable elements | `div.accordion--button` (4 instances) | Keyboard users cannot activate |
| M6 | 1.3.1 | Excessive H2 elements | 149 h2 headings | Heading structure diluted |

---

## 2. Missing ARIA Attributes Inventory

### 2.1 Missing aria-labelledby Target Elements

The following IDs are referenced by `aria-labelledby` but **do not exist** in the DOM:

| Referenced ID | Used By | Status |
|---------------|---------|--------|
| `label-voornaam` | `input[name="Voornaam"]`, `input[name="Achternaam"]` | MISSING |
| `label-email` | `input[name="Email Adres"]` | MISSING |
| `label-telefoon` | `input[name="Telefoon"]` | MISSING |
| `label-bericht` | `textarea[name="Bericht"]` | MISSING |
| `label-terms-conditions` | `input.input--checkbox-click` | MISSING |
| `label-vacancy` | `input[name="Vacature"]` | EXISTS |
| `filepond--drop-label-*` | FilePond input | EXISTS |

### 2.2 Missing aria-describedby Target Elements

All helper text references are broken:

| Referenced ID | Status |
|---------------|--------|
| `helper_voornaam_default` | MISSING |
| `helper_achternaam_default` | MISSING |
| `helper_email_default` | MISSING |
| `helper_telefoon_default` | MISSING |
| `helper-upload` | MISSING |
| `helper_bericht_default` | MISSING |

### 2.3 Custom Dropdown Component - Missing Attributes

**Vacancy Dropdown (`div.input--w[role="combobox"]`):**

| Attribute | Current Value | Required Value |
|-----------|---------------|----------------|
| `aria-label` | none | "Vacature" or similar |
| `aria-labelledby` | none | ID of associated label |
| `tabindex` | none | "0" for keyboard access |
| `aria-activedescendant` | none | ID of currently focused option |
| `aria-autocomplete` | none | "list" or "none" |

**Options Listbox (`div.input--dropdown[role="listbox"]`):**

| Attribute | Current Value | Required Value |
|-----------|---------------|----------------|
| `aria-label` | none | "Vacature opties" or similar |
| `id` | none | Required for aria-controls reference |

---

## 3. Form Label Association Status

### 3.1 Contact Form (`form.contact--form`)

| Field | Label Text | `for` Attribute | `id` on Label | Association Type | Status |
|-------|-----------|-----------------|---------------|-----------------|--------|
| Voornaam | "Voornaam" | none | none | None | BROKEN |
| Achternaam | "Achternaam" | none | none | None | BROKEN |
| Email | "Email" | none | none | None | BROKEN |
| Telefoon | "Telefoon" | none | none | None | BROKEN |
| Vacature | "Vacature" | none | `label-vacancy` | aria-labelledby | WORKS |
| Bericht | "Bericht" | none | none | None | BROKEN |
| CV | "CV" | none | none | None | BROKEN |
| FilePond | "Drag & Drop..." | `filepond--browser-*` | `filepond--drop-label-*` | Explicit (for) | WORKS |
| Terms | "Ik machtig..." | none | none | None | BROKEN |

### 3.2 Input Field Summary

| Field Name | Type | Has ID | Has aria-labelledby | Reference Exists |
|------------|------|--------|---------------------|------------------|
| Voornaam | text | NO | YES (`label-voornaam`) | NO |
| Achternaam | text | NO | YES (`label-voornaam`) | NO |
| Email Adres | email | NO | YES (`label-email`) | NO |
| Telefoon | tel | NO | YES (`label-telefoon`) | NO |
| Vacature | text | NO | YES (`label-vacancy`) | YES |
| Bericht | textarea | NO | YES (`label-bericht`) | NO |
| cv_url | hidden | NO | NO | N/A |
| Agreed to Legal terms | checkbox | NO | YES (`label-terms-conditions`) | NO |

---

## 4. Keyboard Accessibility Gaps

### 4.1 Focus Order Issues

The form has **15 focusable elements** with natural tab order (no positive tabindex values found):

1. `input[name="Voornaam"]`
2. `input[name="Achternaam"]`
3. `input[name="Email Adres"]`
4. `input[name="Telefoon"]`
5. `input[name="Vacature"]`
6. `textarea[name="Bericht"]`
7. FilePond file input
8. FilePond "Browse" span (tabindex="0")
9. "selecteer een bestand" link
10. Terms checkbox
11. Terms link
12. Submit button
13. Hidden "Verstuur bericht" link (not visible)
14. WhatsApp button
15. WhatsApp link

### 4.2 Non-Focusable Interactive Elements

The following elements have click behavior but are **not keyboard accessible**:

| Element | Class | Issue |
|---------|-------|-------|
| DIV | `css__button` | No tabindex, no role |
| DIV | `accordion--button` (x4) | No tabindex, no role |
| DIV | `button--group` | Container, not interactive |

### 4.3 Modal Focus Management

Three modals found with potential focus trap issues:

| Modal | Class | Issues |
|-------|-------|--------|
| Cookie Settings | `modal.is--cc-settings` | No `role="dialog"`, no `aria-modal` |
| Cookie Banner | `modal.is--cc-banner` | No `role="dialog"`, no `aria-modal` |
| Success Modal | `modal.is--success` | No `role="dialog"`, no `aria-modal` |

---

## 5. Additional Findings

### 5.1 Language Attribute
- **Status:** PASS
- `<html lang="nl">` correctly set

### 5.2 Landmark Structure

| Landmark | Count | Status |
|----------|-------|--------|
| `<header>` / `[role="banner"]` | 0 | MISSING |
| `<nav>` / `[role="navigation"]` | 1 | OK |
| `<main>` / `[role="main"]` | 0 | MISSING |
| `<footer>` / `[role="contentinfo"]` | 1 | OK |
| `<aside>` / `[role="complementary"]` | 0 | None expected |
| `[role="search"]` | 0 | None expected |

### 5.3 Heading Structure

| Level | Count | Note |
|-------|-------|------|
| H1 | 1 | OK - Single H1 |
| H2 | 149 | EXCESSIVE - Review structure |
| H3 | 1 | OK |
| H4 | 0 | - |

**Note:** No heading level skip issues detected.

### 5.4 Images

| Metric | Count |
|--------|-------|
| Total Images | 302 |
| Missing alt | 0 |
| Decorative (empty alt) | 118 |

**Status:** PASS - All images have alt attributes.

### 5.5 Links Opening in New Windows

18 links use `target="_blank"` without warning users:
- Privacy voorwaarden (x2)
- Klant worden (x2)
- Webshop (x3)
- Sluiten buttons (x3)
- Various other links

---

## 6. Remediation Recommendations

### 6.1 Priority 1 - Critical (Fix Immediately)

1. **Add missing label IDs to the DOM**
   ```html
   <!-- Add these elements or add id attributes to existing labels -->
   <label id="label-voornaam">Voornaam</label>
   <label id="label-email">Email</label>
   <label id="label-telefoon">Telefoon</label>
   <label id="label-bericht">Bericht</label>
   <label id="label-terms-conditions">Ik machtig Nobel...</label>
   ```

2. **Add missing helper text IDs**
   ```html
   <span id="helper_voornaam_default">Helper text</span>
   <!-- Same for all other helper references -->
   ```

3. **Add accessible names to empty buttons**
   ```html
   <button class="button" aria-label="Menu openen">
     <!-- icon -->
   </button>
   ```

### 6.2 Priority 2 - Serious (Fix Within 2 Weeks)

1. **Add landmark regions**
   ```html
   <header role="banner">...</header>
   <main role="main">...</main>
   ```

2. **Fix modal accessibility**
   ```html
   <div class="modal is--cc-settings" role="dialog" aria-modal="true" aria-label="Cookie instellingen">
   ```

3. **Add new window warnings**
   ```html
   <a href="..." target="_blank">
     Webshop <span class="sr-only">(opent in nieuw venster)</span>
   </a>
   ```

### 6.3 Priority 3 - Moderate (Fix Within 1 Month)

1. **Improve custom dropdown accessibility**
   ```html
   <div class="input--w"
        role="combobox"
        aria-expanded="false"
        aria-haspopup="listbox"
        aria-label="Vacature selecteren"
        tabindex="0"
        aria-controls="vacancy-listbox">
   ```

2. **Make accordion buttons keyboard accessible**
   ```html
   <div class="accordion--button" role="button" tabindex="0">
   ```

3. **Review heading structure** - Consider if 149 H2s are appropriate or if some should be other elements.

---

## 7. Test Evidence

- **Screenshot:** `werkenbij-page.png` (1.4 MB, 792x9483px)
- **CDP Methods Used:**
  - `Accessibility.enable`
  - `Accessibility.getFullAXTree`
  - `Audits.enable`
  - `Audits.checkContrast`
  - `Audits.checkFormsIssues`
  - `Runtime.evaluate` (custom scripts)

---

## 8. Compliance Summary

| WCAG Level | Pass | Fail | N/A |
|------------|------|------|-----|
| Level A | Partial | 5 critical | - |
| Level AA | Partial | 3 serious | - |
| Level AAA | Not tested | - | - |

**Overall Assessment:** The page does NOT meet WCAG 2.1 Level A or AA compliance due to broken ARIA references and missing label associations in the contact form.
