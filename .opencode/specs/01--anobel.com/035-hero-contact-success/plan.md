---
title: "Implementation Plan: Hero Webshop Selector Scoping [01--anobel.com/035-hero-contact-success/plan]"
description: "Replace broad hero_webshop.js selectors with webshop-specific data-target selectors to stop the blue bar artifact on contact-success."
trigger_phrases:
  - "plan"
  - "hero"
  - "webshop"
  - "contact-success"
  - "035"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Hero Webshop Selector Scoping

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Vanilla JavaScript, Webflow-rendered HTML |
| **Framework** | Frontend animation script using DOM selectors |
| **Storage** | None |
| **Testing** | Chrome DevTools inspection and manual browser verification |

### Overview
This plan scopes `hero_webshop.js` to webshop-specific `data-target` selectors so the contact-success hero is no longer treated like a webshop hero. The work mirrors the established selector strategy already used by `hero_cards.js`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed in DevTools
- [x] Target script identified as `src/2_javascript/hero/hero_webshop.js`
- [x] Follow-up deployment work separated from the selector fix itself

### Definition of Done
- [ ] Selector mapping updated to webshop-specific `data-target` selectors
- [ ] Non-webshop match risk documented and addressed
- [ ] Verification plan covers both contact-success and webshop pages
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Selector-scoped frontend enhancement.

### Key Components
- **`hero_webshop.js`**: The script whose selectors currently over-match non-webshop hero markup.
- **Webflow hero markup**: The source of `data-target` attributes and `.is--webshop` scoping.

### Data Flow
The page loads `hero_webshop.js`, the script queries DOM selectors, and the matched elements receive hero animation logic. Tightening the selectors changes which pages participate in that flow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inspect the contact-success DOM and confirm which selectors over-match
- [x] Compare `hero_webshop.js` with the scoped selector approach in `hero_cards.js`
- [ ] Confirm the expected `data-target` names for each webshop hero element

### Phase 2: Core Implementation
- [ ] Replace the broad selector entries in `SELECTORS`
- [ ] Scope the section selector with `.is--webshop`
- [ ] Preserve the selector mapping needed for follow-up rollout and verification

### Phase 3: Verification
- [ ] Verify the contact-success page no longer shows the blue bar artifact
- [ ] Verify the intended webshop page still matches the selector set
- [ ] Record any remaining deployment dependencies
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Contact-success regression check | Browser + DevTools |
| Manual | Webshop hero behavior check | Browser + DevTools |
| Review | Selector mapping completeness | Side-by-side code review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Webflow `data-target` attributes | External | Yellow | Scoped selectors cannot work until markup matches the new targeting contract |
| Minification and CDN deployment | External | Yellow | Live pages will not reflect the fix until assets are rebuilt and deployed |
| Browser verification on affected pages | Internal | Green | Regression confidence drops if contact-success and webshop pages are not tested |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scoped selectors stop the intended webshop hero from animating correctly.
- **Procedure**: Revert the selector changes in `hero_webshop.js`, restore the previous selector map, and revisit the `data-target` contract before redeploying.
<!-- /ANCHOR:rollback -->

---
