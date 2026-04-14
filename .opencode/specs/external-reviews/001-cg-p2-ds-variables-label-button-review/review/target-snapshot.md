# FE - Cg P.2 - DS: Variables - Label & Button Update

## ⌘ About

---

Aligns the canonical DS variable sources with the approved button, label, and follow-up dropdown variable updates.

Keeps CSS and TS in sync, restores the original approved DS variable scope in this task, and limits follow-up size changes to tiers that already exist.

**References**

---

Changed

- `Product Owner/context/4. DS Variables/barter-ds-variables.css`
- `Product Owner/context/4. DS Variables/barter-ds-variables.ts`

### ❖ Requirements

---

1.   **Apply the extra large main button token changes**

---

Apply the approved extra large main button token changes to the canonical sources.

**Requirements**

- `button-main-container-size--extra-large` is updated from `4.5rem` to `4rem`
- `button-main-icon-size--extra-large` is updated from `2rem` to `1.75rem`

---

2.   **Add the label token additions**

---

Add the approved label token additions from the audit to the canonical sources.

**Requirements**

- Add `Label-BG-Enabled-Secondary-|-Neutral`
- Add `Label-BG-Hover-Secondary-|-Neutral`
- Add `Label-BG-Active-Secondary-|-Neutral`
- Add `Label-Main-Secondary-BG-Ghost-|-Neutral`
- Add `Label-Main-Positive-BG-Transparent-|-Neutral`
- Add `Label-Main-Caution-BG-Transparent-|-Neutral`
- Add `Label-Main-Negative-BG-Transparent-|-Neutral`

---

3.   **Apply the CTA label content token changes**

---

Apply the approved CTA label content token changes to the canonical sources.

**Requirements**

- `label-content-enabled-cta` changes from `var(--tertiary-darker)` to `var(--Content-Highlight-Primary)`
- `label-content-hover-cta` changes from `var(--tertiary-darkest)` to `var(--Shades-Tertiary-Darker)`

---

4.   **Update existing label close icon sizes**

---

Update the existing label main close icon size tokens on the canonical CSS and TS surfaces.

**Requirements**

- Extra small label close icon size is `0.875rem`
- Small label close icon size is `0.875rem`
- Base label close icon size is `0.875rem`
- Large label close icon size is `1rem`
- Extra large label close icon size is `1rem`
- Display label close icon size is `1rem`
- Display large label close icon size is `1rem`

---

5.   **Update the existing large dropdown top padding**

---

Update the existing large dropdown top padding token on the canonical CSS and TS surfaces.

**Requirements**

- Large dropdown top padding is `0.625rem`

---

6.   **Align the positive transparent label state aliases**

---

Update the positive transparent label hover and active neutral state mappings to reflect the changed transparency design tokens.

**Requirements**

- Hover positive transparent neutral resolves through the updated `label-bg-hover-transparent` token
- Active positive transparent neutral resolves through the updated `label-bg-active-transparent` token

---

### ✓ Resolution Checklist

---

⚠️ Complete all items above AND below before moving to QA

---

**1. Canonical token updates**

---

- [ ] All named label close icon sizes match this task on both canonical surfaces
- [ ] `--size-extra-large-button-size-container` equals `4rem`
- [ ] `--size-extra-large-button-size-icon` equals `1.75rem`
- [ ] Secondary neutral label background tokens exist on both canonical surfaces
- [ ] Secondary ghost neutral and positive, caution, and negative transparent-neutral label state aliases exist on both canonical surfaces
- [ ] `--label-content-enabled-cta` equals `var(--content-highlight-primary)` on the canonical surfaces
- [ ] `--label-content-hover-cta` equals `var(--tertiary-darker)` on the canonical surfaces
- [ ] `--size-large-dropdown-padding-top` equals `0.625rem`
- [ ] Positive transparent hover and active neutral mappings resolve through the updated label transparency tokens

---

**2. Parity and scope control**

---

- [ ] CSS and TS sources expose the same named value changes
- [ ] Token naming stays consistent across canonical sources

---

**3. Validation**

---

- [ ] Verified: canonical CSS and TS remain aligned for all named token updates
- [ ] Verified: no unrelated size tiers changed outside the named update set
