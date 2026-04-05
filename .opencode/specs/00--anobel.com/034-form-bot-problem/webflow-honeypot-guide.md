---
title: "Webflow Guide: Add Honeypot Field to Contact Form"
description: "Step-by-step Webflow Designer and Formspark guide to add a provider-enforced honeypot field to the /nl/contact form."
importance_tier: "important"
contextType: "implementation"
---

# Webflow Guide: Add Honeypot Field to Contact Form

This guide walks through adding a Formspark-enforced honeypot field to the `/nl/contact` form. The form keeps its current custom JS + Formspark submit architecture — no replatforming.

**How it works:** A hidden text field is added to the form. Bots auto-fill it, humans never see it. Formspark silently drops any submission where this field has a value — no save, no notification, no count.

---

## Step 1 — Add the Field in Webflow Designer

1. Open **Webflow Designer** and navigate to the `/nl/contact` page
2. Select the **contact form element** (the one posting to Formspark via custom action)
3. Add a new **Text Field** inside that same form element
4. Configure the field:

| Setting      | Value                    |
|--------------|--------------------------|
| **Name**     | `contact_website_check`  |
| **Required** | Off                      |
| **Disabled** | Off                      |

5. Set the label text to something neutral, e.g. `Leave this field empty`

> The field name `contact_website_check` is the agreed name from the investigation spec. It must match exactly in Webflow and Formspark.

---

## Step 2 — Hide the Field From Humans

1. Wrap the honeypot field (input + label) in a **Div Block**
2. Give the wrapper div the class: `hp-field-wrap`
3. Add this CSS via Webflow custom code (page-level or site-level `<head>`):

```css
<style>
.hp-field-wrap {
  position: absolute !important;
  left: -10000px !important;
  top: auto !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}
</style>
```

This moves the field off-screen. Bots still find and fill it. Humans never see it.

### Why This Pattern

Bots detect and skip common hiding methods. The off-screen approach avoids detection while keeping the field in the form DOM and in the submission payload.

| Pattern                  | Safe? | Why                                              |
|--------------------------|-------|--------------------------------------------------|
| Off-screen positioning   | Yes   | Field stays in DOM and payload, hard for bots to detect |
| `display: none`          | No    | Bots skip fields with `display: none`            |
| `visibility: hidden`     | No    | Same detection risk as `display: none`           |
| `type="hidden"`          | No    | Bots typically ignore hidden inputs               |
| `disabled` attribute     | No    | Disabled fields are excluded from form submission |
| JS removal/recreation    | No    | Fragile, breaks fallback path                    |

---

## Step 3 — Configure Formspark

1. Open the **Formspark dashboard**
2. Go to the form endpoint used by `/nl/contact`
3. **Enable honeypot** handling (or confirm it is already enabled)
4. Set the **custom honeypot field name** to exactly: `contact_website_check`
5. Keep **Botpoison** enabled as a secondary defense layer
6. **Save** the configuration

### Expected Formspark Behavior

When `contact_website_check` has any value in a submission:
- Submission is **silently dropped**
- Not saved to inbox
- Not counted in submission totals
- No email notification sent

When `contact_website_check` is empty (legitimate user):
- Submission proceeds normally through Botpoison check and inbox delivery

---

## Step 4 — Publish and Verify

### Publish Order

1. **Staging first** — publish to staging and run all checks below
2. **Production** — publish to production only after staging passes

### Verification Checklist

**DOM check:**
- [ ] Open browser DevTools on the live page
- [ ] Confirm an `<input name="contact_website_check">` exists inside the contact form
- [ ] Confirm the field is visually hidden (off-screen, not visible to users)
- [ ] Confirm the field is not `disabled` and not `required`

**Enhanced submit path (JS enabled):**
- [ ] Submit the form normally
- [ ] In DevTools Network tab, inspect the POST request payload
- [ ] Confirm `contact_website_check` appears in the JSON body (empty string)

**Native fallback path (JS disabled):**
- [ ] Disable JavaScript in the browser
- [ ] Submit the form via native HTML submission
- [ ] Confirm `contact_website_check` is included in the form data

**Formspark match:**
- [ ] Confirm Formspark dashboard shows `contact_website_check` as the active honeypot key
- [ ] Send a test submission with `contact_website_check` filled in — confirm it is silently dropped
- [ ] Send a test submission with `contact_website_check` empty — confirm it arrives in inbox

---

## Do NOT

- **Do not** use `type="hidden"` — bots ignore hidden inputs
- **Do not** set `disabled` — disabled fields are excluded from form submissions
- **Do not** set `required` — legitimate users cannot fill a hidden field
- **Do not** remove or recreate the field with JavaScript at runtime
- **Do not** use `display: none` or `visibility: hidden` to hide the field
- **Do not** switch to Webflow native form processing — the form posts via Formspark/custom action
- **Do not** rename the field after publishing without updating Formspark to match
- **Do not** place the field behind Webflow conditional visibility logic

---

## Architecture Notes

This honeypot is one layer in the defense strategy. The current form architecture is:

```
User submits form
  → JS intercepts, builds FormData, injects _botpoison token
  → POST JSON to Formspark endpoint
  → (on failure) native HTML fallback submit

Honeypot field (contact_website_check) travels with both paths
  → Formspark checks honeypot value server-side
  → Filled = silently drop | Empty = proceed to Botpoison check → inbox
```

**Botpoison** remains active as a complementary layer — it is not removed or replaced by the honeypot.

---

## Limitations

- This does not prove root cause of existing spam (RC-A/RC-B still need provider-side evidence)
- This does not guarantee zero spam — sophisticated bots may avoid filling honeypots
- This does not make Webflow native anti-spam the trust boundary (form posts to Formspark)
- Do not claim the spam issue is fully resolved until provider-side evidence confirms impact
