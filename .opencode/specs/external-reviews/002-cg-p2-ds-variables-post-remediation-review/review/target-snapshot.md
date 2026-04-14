# FE - Cg P.2 - DS: Variables - Label & Button Update

## ⌘ About

---

Aligns the canonical DS variable sources with the approved button, label, and follow-up dropdown variable updates.

Keeps CSS and TS in sync, restores the original approved DS variable scope in this task, and limits follow-up size changes to tiers that already exist.

**Owner:** `[TBD]`  
**Approver:** `[TBD]`  
**Last reviewed:** `[TBD]`  
**Approved CTA label content end state:** `--label-content-enabled-cta = var(--Content-Highlight-Primary)` and `--label-content-hover-cta = var(--Shades-Tertiary-Darker)`

**References**

---

Changed

- `Product Owner/context/4. DS Variables/barter-ds-variables.css`
- `Product Owner/context/4. DS Variables/barter-ds-variables.ts`
- `Product Owner/export/002 - report-ds-variable-update-audit.md`

**Provenance**

---

| Token bundle | Audit artifact | Audit anchor | Approved old -> new mapping |
| --- | --- | --- | --- |
| Button sizes | `Product Owner/export/002 - report-ds-variable-update-audit.md` | `[TBD:audit-row-button-sizes]` | `--size-extra-large-button-size-container: 4.5rem -> 4rem`; `--size-extra-large-button-size-icon: 2rem -> 1.75rem` |
| Label BG additions | `Product Owner/export/002 - report-ds-variable-update-audit.md` | `[TBD:audit-row-label-bg-additions]` | `N/A (new token) ->` `--label-bg-enabled-secondary-neutral`, `--label-bg-hover-secondary-neutral`, `--label-bg-active-secondary-neutral`, `--state-enabled-label-secondary-bg-ghost-neutral`, `--state-enabled-label-positive-bg-transparent-neutral`, `--state-enabled-label-caution-bg-transparent-neutral`, `--state-enabled-label-negative-bg-transparent-neutral` |
| CTA label content | `Product Owner/export/002 - report-ds-variable-update-audit.md` | `[TBD:audit-row-cta-label-content]` | `--label-content-enabled-cta: var(--tertiary-darker) -> var(--Content-Highlight-Primary)`; `--label-content-hover-cta: var(--tertiary-darkest) -> var(--Shades-Tertiary-Darker)` |
| Label close icons | `Product Owner/export/002 - report-ds-variable-update-audit.md` | `[TBD:audit-row-label-close-icons]` | `[TBD:audit-old-close-icon-values] ->` `0.875rem` for extra small / small / base, `1rem` for large / extra large / display / display large |
| Dropdown padding | `Product Owner/export/002 - report-ds-variable-update-audit.md` | `[TBD:audit-row-dropdown-padding]` | `[TBD:audit-old-dropdown-top-padding] -> --size-large-dropdown-padding-top: 0.625rem` |
| Label positive transparent aliases | `Product Owner/export/002 - report-ds-variable-update-audit.md` | `[TBD:audit-row-label-positive-transparent-aliases]` | `--label-bg-active-transparent: var(--transparent-black-50) -> var(--transparent-black-25, #0a0a0a40)`; `--label-bg-hover-transparent: var(--transparent-black-25) -> var(--transparent-black-10, #0a0a0a1a)` |

### ❖ Canonical Identifier Mapping

---

**Normalization rule**

- Start with the display label or task-line label exactly as written in this packet.
- Lowercase the label, replace `_`, `|`, and spaces with `-`, and collapse consecutive dashes.
- Prefix the canonical CSS variable with `--`.
- Remove the `--` prefix and camel-case the remaining segments for the canonical TS identifier.
- When a shorthand task label does not naturally land on the canonical source taxonomy, use the explicit mapping table below as the authority.

**Worked example**

`Label-BG-Enabled-Secondary-|-Neutral` -> `label-bg-enabled-secondary-neutral` -> `--label-bg-enabled-secondary-neutral` -> `labelBgEnabledSecondaryNeutral`

Preserve existing family placement on both canonical surfaces: `SIZE` tokens stay in the size sections, `LABEL.Bg` aliases stay in the label background blocks, and state tokens stay in `STATE.Enabled/Hover/Active.Label.Main`.

| Req | Display label / task line | Canonical CSS variable | Canonical TS identifier | Old value | New value |
| --- | --- | --- | --- | --- | --- |
| 1 | `button-main-container-size--extra-large` | `--size-extra-large-button-size-container` | `sizeExtraLargeButtonSizeContainer` | `4.5rem` | `4rem` |
| 1 | `button-main-icon-size--extra-large` | `--size-extra-large-button-size-icon` | `sizeExtraLargeButtonSizeIcon` | `2rem` | `1.75rem` |
| 2 | `Label-BG-Enabled-Secondary-|-Neutral` | `--label-bg-enabled-secondary-neutral` | `labelBgEnabledSecondaryNeutral` | `N/A (new token)` | `var(--bg-neutral-lightest)` |
| 2 | `Label-BG-Hover-Secondary-|-Neutral` | `--label-bg-hover-secondary-neutral` | `labelBgHoverSecondaryNeutral` | `N/A (new token)` | `var(--bg-neutral-light)` |
| 2 | `Label-BG-Active-Secondary-|-Neutral` | `--label-bg-active-secondary-neutral` | `labelBgActiveSecondaryNeutral` | `N/A (new token)` | `var(--bg-neutral-light)` |
| 2 | `Label-Main-Secondary-BG-Ghost-|-Neutral` | `--state-enabled-label-secondary-bg-ghost-neutral` | `stateEnabledLabelSecondaryBgGhostNeutral` | `N/A (new token)` | `var(--label-bg-enabled-secondary-neutral)` |
| 2 | `Label-Main-Positive-BG-Transparent-|-Neutral` | `--state-enabled-label-positive-bg-transparent-neutral` | `stateEnabledLabelPositiveBgTransparentNeutral` | `N/A (new token)` | `var(--label-bg-enabled-transparent)` |
| 2 | `Label-Main-Caution-BG-Transparent-|-Neutral` | `--state-enabled-label-caution-bg-transparent-neutral` | `stateEnabledLabelCautionBgTransparentNeutral` | `N/A (new token)` | `var(--label-bg-enabled-transparent)` |
| 2 | `Label-Main-Negative-BG-Transparent-|-Neutral` | `--state-enabled-label-negative-bg-transparent-neutral` | `stateEnabledLabelNegativeBgTransparentNeutral` | `N/A (new token)` | `var(--label-bg-enabled-transparent)` |
| 3 | `label-content-enabled-cta` | `--label-content-enabled-cta` | `labelContentEnabledCta` | `var(--tertiary-darker)` | `var(--Content-Highlight-Primary)` |
| 3 | `label-content-hover-cta` | `--label-content-hover-cta` | `labelContentHoverCta` | `var(--tertiary-darkest)` | `var(--Shades-Tertiary-Darker)` |
| 4 | `Extra small label close icon size` | `--size-extra-small-label-size-icon-close` | `sizeExtraSmallLabelSizeIconClose` | `[TBD:pre-change-baseline]` | `0.875rem` |
| 4 | `Small label close icon size` | `--size-small-label-size-icon-close` | `sizeSmallLabelSizeIconClose` | `[TBD:pre-change-baseline]` | `0.875rem` |
| 4 | `Base label close icon size` | `--size-base-label-size-icon-close` | `sizeBaseLabelSizeIconClose` | `[TBD:pre-change-baseline]` | `0.875rem` |
| 4 | `Large label close icon size` | `--size-large-label-size-icon-close` | `sizeLargeLabelSizeIconClose` | `[TBD:pre-change-baseline]` | `1rem` |
| 4 | `Extra large label close icon size` | `--size-extra-large-label-size-icon-close` | `sizeExtraLargeLabelSizeIconClose` | `[TBD:pre-change-baseline]` | `1rem` |
| 4 | `Display label close icon size` | `--size-display-label-size-icon-close` | `sizeDisplayLabelSizeIconClose` | `[TBD:pre-change-baseline]` | `1rem` |
| 4 | `Display large label close icon size` | `--size-display-large-label-size-icon-close` | `sizeDisplayLargeLabelSizeIconClose` | `[TBD:pre-change-baseline]` | `1rem` |
| 5 | `Large dropdown top padding` | `--size-large-dropdown-padding-top` | `sizeLargeDropdownPaddingTop` | `[TBD:pre-change-baseline]` | `0.625rem` |
| 6 | `--label-bg-active-transparent` | `--label-bg-active-transparent` | `labelBgActiveTransparent` | `var(--transparent-black-50)` | `var(--transparent-black-25, #0a0a0a40)` |
| 6 | `--label-bg-hover-transparent` | `--label-bg-hover-transparent` | `labelBgHoverTransparent` | `var(--transparent-black-25)` | `var(--transparent-black-10, #0a0a0a1a)` |

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

Use **Canonical Identifier Mapping** below for the exact CSS variable names, TS identifiers, and placement families.

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

The approved CTA label content end state for this task is `--label-content-enabled-cta = var(--Content-Highlight-Primary)` and `--label-content-hover-cta = var(--Shades-Tertiary-Darker)`.

**Requirements**

- `label-content-enabled-cta` changes from `var(--tertiary-darker)` to `var(--Content-Highlight-Primary)`
- `label-content-hover-cta` changes from `var(--tertiary-darkest)` to `var(--Shades-Tertiary-Darker)`

---

4.   **Update existing label close icon sizes**

---

Update the existing label main close icon size tokens on the canonical CSS and TS surfaces.

Use **Canonical Identifier Mapping** below for the exact canonical identifiers for each size tier.

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

Use **Canonical Identifier Mapping** below for the exact canonical identifier.

**Requirements**

- Large dropdown top padding is `0.625rem`

---

6.   **Update label BG design tokens**

---

Update the label BG design tokens to match new transparency. 

Use **Canonical Identifier Mapping** below for the exact canonical identifiers and approved end-state values.

**Requirements**

- `--label-bg-active-transparent` updates to `var(--transparent-black-25, #0a0a0a40)`
- `--label-bg-hover-transparent` updates to `var(--transparent-black-10, #0a0a0a1a)`

---

### ✓ Resolution Checklist

---

⚠️ Complete all items above AND below before moving to QA

---

**1. Canonical token updates**

---

- [ ] `--size-extra-large-button-size-container` equals `4rem`
- [ ] `--size-extra-large-button-size-icon` equals `1.75rem`
- [ ] `--label-bg-enabled-secondary-neutral` exists on both canonical surfaces
- [ ] `--label-bg-hover-secondary-neutral` exists on both canonical surfaces
- [ ] `--label-bg-active-secondary-neutral` exists on both canonical surfaces
- [ ] `--state-enabled-label-secondary-bg-ghost-neutral` exists on both canonical surfaces and equals `var(--label-bg-enabled-secondary-neutral)`
- [ ] `--state-enabled-label-positive-bg-transparent-neutral` exists on both canonical surfaces and equals `var(--label-bg-enabled-transparent)`
- [ ] `--state-enabled-label-caution-bg-transparent-neutral` exists on both canonical surfaces and equals `var(--label-bg-enabled-transparent)`
- [ ] `--state-enabled-label-negative-bg-transparent-neutral` exists on both canonical surfaces and equals `var(--label-bg-enabled-transparent)`
- [ ] `--label-content-enabled-cta` equals `var(--Content-Highlight-Primary)`
- [ ] `--label-content-hover-cta` equals `var(--Shades-Tertiary-Darker)` and matches the approved CTA label content end state
- [ ] `--size-extra-small-label-size-icon-close` equals `0.875rem`
- [ ] `--size-small-label-size-icon-close` equals `0.875rem`
- [ ] `--size-base-label-size-icon-close` equals `0.875rem`
- [ ] `--size-large-label-size-icon-close` equals `1rem`
- [ ] `--size-extra-large-label-size-icon-close` equals `1rem`
- [ ] `--size-display-label-size-icon-close` equals `1rem`
- [ ] `--size-display-large-label-size-icon-close` equals `1rem`
- [ ] `--size-large-dropdown-padding-top` equals `0.625rem`
- [ ] `--label-bg-active-transparent` equals `var(--transparent-black-25, #0a0a0a40)`
- [ ] `--label-bg-hover-transparent` equals `var(--transparent-black-10, #0a0a0a1a)`

---

**2. Parity, scope control, and validation**

---

- [ ] Capture a pre-change baseline for every identifier in the Scope Allowlist, grep both canonical files for that identifier list, and confirm that no token names outside the allowlist were added, removed, or value-mutated in either CSS or TS.

---

**3. Scope Allowlist**

---

- [ ] Button: `--size-extra-large-button-size-container`, `--size-extra-large-button-size-icon`
- [ ] Label BG additions: `--label-bg-enabled-secondary-neutral`, `--label-bg-hover-secondary-neutral`, `--label-bg-active-secondary-neutral`, `--state-enabled-label-secondary-bg-ghost-neutral`, `--state-enabled-label-positive-bg-transparent-neutral`, `--state-enabled-label-caution-bg-transparent-neutral`, `--state-enabled-label-negative-bg-transparent-neutral`
- [ ] CTA label content: `--label-content-enabled-cta`, `--label-content-hover-cta`
- [ ] Label close icons: `--size-extra-small-label-size-icon-close`, `--size-small-label-size-icon-close`, `--size-base-label-size-icon-close`, `--size-large-label-size-icon-close`, `--size-extra-large-label-size-icon-close`, `--size-display-label-size-icon-close`, `--size-display-large-label-size-icon-close`
- [ ] Dropdown padding: `--size-large-dropdown-padding-top`
- [ ] Transparent aliases: `--label-bg-active-transparent`, `--label-bg-hover-transparent`

---

### ❖ CTA Consumer Audit & Rollback

---

**Change classification**

- Treat `--label-content-enabled-cta` and `--label-content-hover-cta` as a **value swap**, not a rename or migration.

**Consumer search surface**

- Grep CSS, TS, and component template files for `--label-content-enabled-cta` and `--label-content-hover-cta` before and after the change.

**Pre-change baseline**

- Capture one rendered CTA baseline (screenshot or value snapshot) and record the current canonical CSS + TS value lines for both CTA tokens before editing.

**Rollback**

- If consumer verification fails, revert only the two CTA value lines for `--label-content-enabled-cta` and `--label-content-hover-cta` to the captured baseline, then rerun the consumer search before resuming QA.
