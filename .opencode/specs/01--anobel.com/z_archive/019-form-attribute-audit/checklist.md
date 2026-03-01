---
title: "Checklist: Form Attribute Audit Remediation [020-form-attribute-audit/checklist]"
description: "checklist document for 020-form-attribute-audit."
trigger_phrases:
  - "checklist"
  - "form"
  - "attribute"
  - "audit"
  - "remediation"
  - "020"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Form Attribute Audit Remediation

<!-- ANCHOR:critical-p0---must-fix -->
## Critical (P0) - Must Fix

- [ ] **C1** Add `data-value` to vacancy select options in CMS
  - Location: Webflow CMS Collection "Vacatures"
  - Action: Bind `data-value` to vacancy name/slug field
  - Verify: Form submission includes actual vacancy name

- [ ] **C2** Add label IDs for ARIA references
  - `id="label-voornaam"` on Voornaam label
  - `id="label-email"` on Email label
  - `id="label-telefoon"` on Telefoon label
  - `id="label-bericht"` on Bericht label
  - `id="label-terms-conditions"` on Terms label
  - Verify: `aria-labelledby` references resolve

- [ ] **C3** Add helper text IDs for ARIA describedby
  - Add matching IDs to helper/error text elements
  - Verify: Screen reader announces helper text

<!-- /ANCHOR:critical-p0---must-fix -->

<!-- ANCHOR:high-priority-p1---should-fix -->
## High Priority (P1) - Should Fix

- [ ] **H1** Remove empty `id=""` attributes (122 buttons)
  - Location: Button elements throughout page
  - Action: Remove attribute or assign meaningful ID

- [ ] **H2** Clean up empty `data-btn-*` attributes
  - `data-btn-action=""` on 124 buttons
  - `data-btn-border-color=""` on 120 buttons
  - `data-btn-hover=""` on 96 buttons
  - Action: Remove or populate with valid values

- [ ] **H3** Re-minify input_select.js
  - Source: Jan 12, Minified: Jan 6
  - Run: minification script

- [ ] **H4** Verify custom dropdown ARIA initialization
  - Check: `role="combobox"` on trigger
  - Check: `aria-expanded` toggles correctly
  - Check: `role="listbox"` on dropdown
  - Check: `role="option"` on each option

<!-- /ANCHOR:high-priority-p1---should-fix -->

<!-- ANCHOR:medium-priority-p2---consider -->
## Medium Priority (P2) - Consider

- [ ] **M1** Add ID to main contact form
- [ ] **M2** Fix cookie checkbox name mismatch
- [ ] **M3** Add landmark regions (`<header>`, `<main>`)
- [ ] **M4** Add new window warnings to external links (18)
- [ ] **M5** Investigate obsolete script loading (dropdown.js, mobile_menu.js)

<!-- /ANCHOR:medium-priority-p2---consider -->

<!-- ANCHOR:verification -->
## Verification

- [ ] **V1** Re-run accessibility audit after fixes
- [ ] **V2** Test form submission with vacancy selection
- [ ] **V3** Test keyboard navigation through form
- [ ] **V4** Verify no console errors after changes
- [ ] **V5** Cross-browser test (Chrome, Firefox, Safari, Edge)
<!-- /ANCHOR:verification -->
