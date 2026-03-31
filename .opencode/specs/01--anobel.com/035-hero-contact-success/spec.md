---
title: "Feature Specification: Hero Webshop Selector Scoping [01--anobel.com/035-hero-contact-success/spec]"
description: "Scope hero_webshop.js selectors to webshop-specific targets so the script stops mutating the contact-success hero."
trigger_phrases:
  - "spec"
  - "hero"
  - "webshop"
  - "contact-success"
  - "blue bar"
  - "035"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Hero Webshop Selector Scoping

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-14 |
| **Branch** | `035-hero-contact-success` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`hero_webshop.js` uses broad CSS class selectors such as `.hero--section`, `.hero--pointer-line`, and `.hero--pointer-bullet`. Those selectors also match hero markup on non-webshop pages like `/en/contact-success`, so the script partially initializes the wrong hero and leaves a persistent blue bar artifact at the top of the page.

### Purpose
Restrict `hero_webshop.js` to webshop-specific hero targets so non-webshop pages stop receiving unintended DOM manipulation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace broad CSS class selectors in `src/2_javascript/hero/hero_webshop.js` with `data-target`-based selectors.
- Add webshop-specific scoping to the hero section selector.
- Preserve the existing investigation evidence that explains the blue bar artifact.

### Out of Scope
- Webflow HTML updates that add missing `data-target` attributes.
- Minification and CDN deployment.
- Changes to other hero scripts such as `hero_cards.js` or `hero_video.js`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/01--anobel.com/035-hero-contact-success/spec.md` | Modify | Normalize the Level 1 feature specification |
| `.opencode/specs/01--anobel.com/035-hero-contact-success/plan.md` | Modify | Document the selector-scoping implementation plan |
| `.opencode/specs/01--anobel.com/035-hero-contact-success/tasks.md` | Modify | Track the investigation, implementation, and verification steps |
| `src/2_javascript/hero/hero_webshop.js` | Modify | Replace broad selectors with webshop-specific `data-target` selectors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `hero_webshop.js` must target only webshop hero sections. | The section selector requires `[data-target='hero-section'].is--webshop` or equivalent webshop-only scoping. |
| REQ-002 | Non-webshop pages must stop receiving webshop hero pointer-line and pointer-bullet mutations. | The selector set no longer matches the contact-success hero unless it is explicitly marked as webshop. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The spec package must keep follow-up deployment work clearly separated from selector scoping. | Minification, CDN deployment, and Webflow attribute rollout stay documented as follow-up work rather than claimed complete. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The contact-success hero no longer qualifies for webshop animation selector matches.
- **SC-002**: The selector mapping stays aligned with the `hero_cards.js` pattern that uses `data-target` and type-specific scoping.

### Acceptance Scenarios
- **Given** a non-webshop page such as `/en/contact-success`, **when** `hero_webshop.js` runs, **then** it does not apply webshop-only inline styles to the page hero.
- **Given** a webshop page with the expected `data-target` markers, **when** `hero_webshop.js` runs, **then** the intended webshop hero elements still match the selector set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Webflow markup must expose the expected `data-target` attributes | Scoped selectors will fail if the markup does not carry the new targeting scheme | Keep attribute rollout documented as a required follow-up step |
| Risk | Selector changes could break legitimate webshop hero behavior | Webshop animation may stop working if any required selector is missed | Verify the full selector mapping against the existing `hero_cards.js` pattern |
| Risk | Deployment remains pending | Users may still see the issue until minified assets and Webflow markup are updated | Keep deployment and verification work explicit in plan and tasks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- When will the corresponding `data-target` attributes be added in Webflow Designer?
- Will minification and CDN deployment happen in the same follow-up task as the Webflow markup rollout?
<!-- /ANCHOR:questions -->

---
