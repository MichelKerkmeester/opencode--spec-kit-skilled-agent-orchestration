---
title: "Plan: Form Attribute Audit - Consolidated Findings [020-form-attribute-audit/plan]"
description: "Comprehensive audit of form input components on anobel.com/nl/werkenbij completed via 10 parallel analysis agents. Critical issues found requiring immediate attention."
trigger_phrases:
  - "plan"
  - "form"
  - "attribute"
  - "audit"
  - "consolidated"
  - "020"
importance_tier: "important"
contextType: "decision"
---
# Plan: Form Attribute Audit - Consolidated Findings

<!-- ANCHOR:executive-summary -->
## Executive Summary

Comprehensive audit of form input components on anobel.com/nl/werkenbij completed via 10 parallel analysis agents. **Critical issues found** requiring immediate attention.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:critical-findings-p0---must-fix -->
## Critical Findings (P0 - Must Fix)

### 1. Empty `data-value` on Custom Select Options
**Source:** DOM Analysis Agent
**Impact:** Form submissions send empty strings instead of actual vacancy selection

```
FOUND ON PAGE:
- "Bunkerschipper" → data-value=""
- "Commercieel Medewerker" → data-value=""
- "Logistiek Medewerker" → data-value=""
```

**Root Cause:** CMS Collection items missing `data-value` attribute population
**Fix:** Update Webflow CMS binding to populate `data-value` from CMS field

---

### 2. Broken ARIA Label References (5 instances)
**Source:** Accessibility Audit Agent
**Impact:** Screen readers cannot associate labels with inputs - WCAG 2.1 A violation

```
BROKEN REFERENCES:
- aria-labelledby="label-voornaam" → ID does not exist
- aria-labelledby="label-email" → ID does not exist
- aria-labelledby="label-telefoon" → ID does not exist
- aria-labelledby="label-bericht" → ID does not exist
- aria-labelledby="label-terms-conditions" → ID does not exist
```

**Root Cause:** Labels missing `id` attributes that match `aria-labelledby` values
**Fix:** Add `id="label-voornaam"` etc. to corresponding label elements in Webflow

---

### 3. Broken ARIA Helper Text References (6 instances)
**Source:** Accessibility Audit Agent
**Impact:** Helper/error text not announced to screen readers

```
BROKEN REFERENCES:
- aria-describedby references helper text IDs that don't exist
```

**Fix:** Add matching IDs to helper text elements

<!-- /ANCHOR:critical-findings-p0---must-fix -->

---

<!-- ANCHOR:high-priority-findings-p1---should-fix -->
## High Priority Findings (P1 - Should Fix)

### 4. Empty ID Attributes (122 instances)
**Source:** DOM Analysis Agent
**Elements:** Buttons with `id=""` instead of valid IDs or no attribute

**Impact:** HTML validity issues, potential JS targeting problems
**Fix:** Remove empty `id=""` or assign meaningful IDs

### 5. Empty data-btn-* Attributes (478 instances)
**Source:** DOM Analysis Agent
```
- data-btn-action="" on 124 buttons (100%)
- data-btn-border-color="" on 120 buttons
- data-btn-hover="" on 96 buttons
```

**Impact:** Unnecessary DOM weight, potential confusion
**Fix:** Remove empty attributes or populate with valid values

### 6. Custom Dropdown Missing ARIA Attributes
**Source:** Accessibility Audit Agent
**Impact:** Keyboard users cannot navigate dropdown properly

**Expected (from code):**
- `role="combobox"` on trigger
- `aria-haspopup="listbox"`
- `aria-expanded="true/false"`
- `aria-controls="[dropdown-id]"`
- `role="listbox"` on dropdown
- `role="option"` on options

**Fix:** Verify CustomSelect script is initializing and adding attributes

### 7. Version Mismatch: input_select.js
**Source:** File Discovery Agent
**Issue:** Minified version (Jan 6) older than source (Jan 12)

**Fix:** Re-run minification for input_select.js

<!-- /ANCHOR:high-priority-findings-p1---should-fix -->

---

<!-- ANCHOR:medium-priority-findings-p2---consider -->
## Medium Priority Findings (P2 - Consider)

### 8. Main Contact Form Has Empty ID
**Source:** DOM Analysis Agent
**Impact:** Cannot target form by ID for analytics/scripting

### 9. Cookie Checkbox Name Mismatch
**Source:** DOM Analysis Agent
```
name="personalization" but fs-consent-element="checkbox-analytics"
```

### 10. Missing Landmark Regions
**Source:** Accessibility Audit Agent
- Missing `<header>` landmark
- Missing `<main>` landmark

### 11. Links Opening New Windows (18 instances)
**Source:** Accessibility Audit Agent
**Impact:** No warning for screen reader users about new window

### 12. Potentially Obsolete Scripts (Status 0)
**Source:** Network Analysis Agent
- `dropdown.js` - May be replaced by `nav_dropdown.js`
- `mobile_menu.js` - May be replaced by `nav_mobile_menu.js`

<!-- /ANCHOR:medium-priority-findings-p2---consider -->

---

<!-- ANCHOR:verification-whats-working-correctly -->
## Verification: What's Working Correctly

| Component | Status | Evidence |
|-----------|--------|----------|
| FilePond initialization | Working | 1 instance found, no errors |
| CustomSelect initialization | Working | 1 instance found, no errors |
| FormPersistence | Working | 1 form tracked |
| Form submission scripts | Loading | All from R2 CDN, correct versions |
| Attribute naming convention | Consistent | `data-{component}-{element}` pattern |
| Error handling | Good | Graceful degradation with console warnings |

<!-- /ANCHOR:verification-whats-working-correctly -->

---

<!-- ANCHOR:attribute-inventory-summary -->
## Attribute Inventory Summary

### Required Attributes Found

| Component | Expected | Found | Status |
|-----------|----------|-------|--------|
| `data-select="wrapper"` | 1 | 1 | OK |
| `data-select="trigger"` | 1 | 1 | OK |
| `data-select="input"` | 1 | 1 | OK |
| `data-select="dropdown"` | 1 | 1 | OK |
| `data-select="option"` | 3 | 3 | Values empty |
| `data-file-upload="wrapper"` | 1 | TBD | Needs verification |
| `data-file-upload="input"` | 1 | TBD | Needs verification |
| `data-file-upload="url"` | 1 | TBD | Needs verification |

### Unneeded Attributes

| Attribute | Count | Recommendation |
|-----------|-------|----------------|
| `id=""` (empty) | 122 | Remove |
| `data-btn-action=""` | 124 | Remove or populate |
| `data-btn-border-color=""` | 120 | Remove or populate |
| `data-btn-hover=""` | 96 | Remove or populate |

### Missing Attributes

| Attribute | Location | Impact |
|-----------|----------|--------|
| `id="label-voornaam"` | Label element | Accessibility |
| `id="label-email"` | Label element | Accessibility |
| `id="label-telefoon"` | Label element | Accessibility |
| `id="label-bericht"` | Label element | Accessibility |
| `id="label-terms-conditions"` | Label element | Accessibility |
| `data-value="[actual-value]"` | Select options | Form submission |

<!-- /ANCHOR:attribute-inventory-summary -->

---

<!-- ANCHOR:recommended-action-plan -->
## Recommended Action Plan

### Phase 1: Critical Fixes (Immediate)
1. [ ] Add `data-value` to CMS Collection binding for vacancy options
2. [ ] Add missing label IDs for ARIA references
3. [ ] Add missing helper text IDs for ARIA references

### Phase 2: High Priority (This Sprint)
4. [ ] Clean up empty `id=""` attributes on buttons
5. [ ] Remove empty `data-btn-*` attributes
6. [ ] Re-minify input_select.js
7. [ ] Verify ARIA attributes on custom dropdown

### Phase 3: Medium Priority (Backlog)
8. [ ] Add form ID for analytics targeting
9. [ ] Fix cookie checkbox naming
10. [ ] Add landmark regions
11. [ ] Add new window warnings to external links
12. [ ] Investigate obsolete script loading

<!-- /ANCHOR:recommended-action-plan -->

---

<!-- ANCHOR:files-created-by-analysis -->
## Files Created by Analysis

| File | Agent | Content |
|------|-------|---------|
| `scratch/dom-analysis.md` | DOM Analysis | Complete attribute inventory |
| `scratch/accessibility-audit.md` | Accessibility | WCAG violations |
| `scratch/console-errors.md` | Console | Error log analysis |
| `scratch/network-analysis.md` | Network | JS resource audit |
| `scratch/spec-requirements.md` | Research | FR/NFR mapping |
| `scratch/custom-select-analysis.md` | Research | CustomSelect code analysis |
| `scratch/filepond-analysis.md` | Research | FilePond code analysis |
| `scratch/form-submission-analysis.md` | Research | form_submission.js analysis |
| `scratch/pattern-review.md` | Review | Pattern consistency report |
| `scratch/file-discovery.md` | Explore | Complete file inventory |

<!-- /ANCHOR:files-created-by-analysis -->

---

<!-- ANCHOR:quality-metrics -->
## Quality Metrics

| Metric | Score |
|--------|-------|
| Pattern Consistency | 82/100 |
| Naming Convention | 85/100 |
| Error Handling | 78/100 |
| Code Robustness | 75/100 |
| **Overall** | **80/100** |

<!-- /ANCHOR:quality-metrics -->

---

<!-- ANCHOR:analysis-agents-used -->
## Analysis Agents Used

| # | Agent Type | Model | Focus |
|---|------------|-------|-------|
| 1 | general-purpose | opus | Chrome DevTools DOM analysis |
| 2 | general-purpose | opus | Chrome DevTools accessibility |
| 3 | general-purpose | opus | Chrome DevTools console errors |
| 4 | general-purpose | opus | Chrome DevTools network/JS |
| 5 | research | opus | Spec requirements analysis |
| 6 | research | opus | custom_select.js analysis |
| 7 | research | opus | filepond_upload.js analysis |
| 8 | research | opus | form_submission.js analysis |
| 9 | review | opus | Pattern validation |
| 10 | Explore | opus | File discovery |
<!-- /ANCHOR:analysis-agents-used -->
