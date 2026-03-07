---
title: "Webflow Implementation Guide: Honeypot-First Contact Form"
description: "Practical Webflow and Formspark setup guide that keeps the existing custom JS + Formspark architecture intact while adding a provider-enforced honeypot layer."
importance_tier: "important"
contextType: "implementation"
---

# Webflow Implementation Guide: Honeypot-First Contact Form

## 1. Goal and Scope

This guide explains exactly how to implement the honeypot-first mitigation in Webflow for the existing `/nl/contact` form architecture.

In scope:
- Add and configure a real DOM honeypot field in Webflow Designer.
- Keep alignment with current custom JS plus Formspark submit path (including native fallback behavior).
- Configure Formspark to enforce the same honeypot field name.
- Verify published behavior without claiming the spam issue is fixed.

Out of scope:
- Replatforming away from Formspark.
- Rewiring form handling to native Webflow submission flow.
- Declaring incident resolution before RC-A and RC-B are proven with provider evidence.

## 2. Exact Webflow Designer Steps

1. Open Webflow Designer and load the page containing `/nl/contact`.
2. Select the contact form that currently posts to Formspark/custom action.
3. Add one new Text Field inside that same form element.
4. Set Label text to something neutral (for example, `Leave this field empty`).
5. Set the field `name` to the final honeypot key `contact_website_check` (see Section 3).
6. Keep the field enabled and non-required:
   - Required = off
   - Disabled = off
7. Keep the field in the live form DOM. Do not place it behind conditional rendering logic.
8. Apply a dedicated class (for example `hp-field-wrap`) to the field wrapper for stable styling.
9. Hide it visually using a safe pattern from Section 4.
10. Save and publish to staging first, then production.

## 3. Recommended Final Field Name

Final recommended field name for this implementation:

- `contact_website_check`

Apply this exact key everywhere:
- Webflow input `name`
- Formspark honeypot/custom honeypot configuration
- Any optional client-side pre-check logic that reads this field

Notes:
- `_honeypot` and `_gotcha` remain provider-supported defaults, but they are not the selected final name for this spec.
- Keep exact case and spelling; do not rename post-publish without synchronized Formspark update and re-verification of both submit paths.

## 4. Safe Hiding Patterns and Anti-Patterns

Recommended stable CSS snippet (off-screen wrapper pattern):

```css
.hp-field-wrap {
  position: absolute !important;
  left: -10000px !important;
  top: auto !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}
```

Safe patterns:
- Apply `.hp-field-wrap` to the honeypot field wrapper and keep it in the same form DOM tree.
- Keep the honeypot input enabled and non-required so it remains part of payload construction.
- Keep styling deterministic and local to this field wrapper.

Anti-patterns:
- Do not set `disabled`.
- Do not set `required`.
- Do not use `type="hidden"` as the honeypot trap field.
- Do not remove or recreate the field with JavaScript at runtime.
- Do not hide using brittle selectors that can drift during Webflow edits.

## 5. Alignment With Custom JS and Formspark Architecture

These must remain true:
- Form still submits through current custom JS plus Formspark endpoint path.
- Existing action/data attributes used by current submit flow remain intact.
- Honeypot field is part of the same form DOM collected into `FormData`.
- Honeypot field survives both:
  - Enhanced custom JSON submit path
  - Native fallback submit path

Do not change architecture in this step:
- Do not switch to full native Webflow form processing.
- Do not treat Webflow native anti-spam as trusted boundary while posting via Formspark/custom action.

## 6. Formspark Configuration to Match

In Formspark dashboard:
1. Open the form endpoint used by `/nl/contact`.
2. Enable honeypot handling (or confirm it is enabled).
3. Set honeypot/custom honeypot key to match the exact Webflow field name.
4. Keep Botpoison integration as layered defense where configured.
5. Save configuration changes before publish verification.

Expected behavior to preserve truth:
- Honeypot or spam-verification failures should be silently ignored by provider policy.
- Silent ignore means not saved, not counted, and no notification for rejected attempts.

## 7. Publish Checklist

- [ ] Honeypot field exists in Webflow Designer inside the target contact form.
- [ ] Field name is `contact_website_check` in Webflow and Formspark.
- [ ] Field is enabled and non-required.
- [ ] Safe hiding class applied; no runtime removal logic.
- [ ] Formspark honeypot setting exactly matches field name.
- [ ] Staging publish completed.
- [ ] Production publish completed.

## 8. Post-Publish Verification Checklist

- [ ] Live page DOM includes honeypot input in the same form element.
- [ ] Network request for enhanced submit contains `contact_website_check` in payload.
- [ ] Native fallback path also includes `contact_website_check` when fallback is forced.
- [ ] Formspark receives `contact_website_check` as configured honeypot key.
- [ ] Operational notes explicitly state issue is still unresolved pending RC-A/RC-B evidence closure.

## 9. Cautions: What This Does Not Solve

- This guide does not prove root cause by itself.
- This guide does not close RC-A (direct endpoint abuse) or RC-B (fallback bypass).
- This guide does not make Webflow native anti-spam the trusted boundary in current architecture.
- This guide does not guarantee zero spam.
- Do not claim production issue is fixed until provider-side evidence confirms mitigation impact.
