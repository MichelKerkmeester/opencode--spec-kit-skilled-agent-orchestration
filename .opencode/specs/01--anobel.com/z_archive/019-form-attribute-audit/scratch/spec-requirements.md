# Form Input Components - Spec Requirements Analysis

> **Analysis Date:** 2026-01-24
> **Source Spec:** `specs/005-anobel.com/012-form-input-components`
> **Purpose:** Complete requirements extraction for form attribute audit

---

## Table of Contents

1. [Functional Requirements - Custom Select (FR-1 to FR-15)](#functional-requirements---custom-select)
2. [Functional Requirements - File Upload (FR-16 to FR-28)](#functional-requirements---file-upload)
3. [Non-Functional Requirements (NFR-1 to NFR-9)](#non-functional-requirements)
4. [Attribute Requirements Matrix](#attribute-requirements-matrix)
5. [Implementation Status Summary](#implementation-status-summary)
6. [Verification Checklist for Live Page](#verification-checklist-for-live-page)
7. [Gaps Analysis](#gaps-analysis)

---

## Functional Requirements - Custom Select

### FR-1 to FR-15: Custom Select Dropdown

| ID | Requirement | Priority | Implied Attributes | Status |
|----|-------------|----------|-------------------|--------|
| **FR-1** | Dropdown opens on trigger click | P0 | `data-select="trigger"`, `data-select="dropdown"` | Code Complete |
| **FR-2** | Dropdown closes on option selection | P0 | `data-select="option"` | Code Complete |
| **FR-3** | Selected value updates display text | P0 | `data-select="input"` (v2.0 uses input element) | Code Complete |
| **FR-4** | Selected value syncs to hidden select | P0 | **SUPERSEDED by DR-015** - No hidden select in v2.0; input element IS the form element | Code Complete |
| **FR-5** | Form submission includes selected value | P0 | `name` attribute on input | Pending Webflow |
| **FR-6** | Dropdown closes on click outside | P0 | Document click listener | Code Complete |
| **FR-7** | Dropdown closes on Escape key | P0 | Keyboard event handler | Code Complete |
| **FR-8** | Options populated from CMS Collection | P0 | `data-value="{CMS slug}"` on options | Pending CMS Setup |
| **FR-9** | Keyboard navigation (Arrow keys) | P1 | `tabindex`, `role="option"` | Code Complete |
| **FR-10** | Enter/Space selects focused option | P1 | Keyboard event handler | Code Complete |
| **FR-11** | Tab closes dropdown and moves focus | P1 | Tab key handler | Code Complete |
| **FR-12** | Placeholder shown when no selection | P1 | `placeholder` attribute on input | Code Complete |
| **FR-13** | Selected option visually highlighted | P1 | `.is--selected` class, `aria-selected` | Code Complete |
| **FR-14** | Form reset resets visual state | P2 | Form reset event handler | Code Complete |
| **FR-15** | Multiple instances work independently | P2 | Instance isolation via class | Code Complete |

### Custom Select - Required HTML Attributes (per plan.md)

**On container (label.input--container):**
```
data-select="wrapper"
```

**On trigger (div.input--w):**
```
data-select="trigger"
tabindex="0"
role="combobox"
aria-haspopup="listbox"
aria-expanded="false"
aria-controls="{dropdown-id}"
```

**On input element (input.input):**
```
data-select="input"
type="text"
name="{field_name}"
placeholder="Selecteer..."
required (if applicable)
readonly
autocomplete="off"
```

**On dropdown (div.input--dropdown):**
```
data-select="dropdown"
role="listbox"
id="{dropdown-id}"
```

**On each option (div.input--dropdown-option):**
```
data-select="option"
data-value="{CMS slug}"
role="option"
tabindex="-1"
id="{option-id}"
aria-selected="false"
```

---

## Functional Requirements - File Upload

### FR-16 to FR-28: FilePond File Upload

| ID | Requirement | Priority | Implied Attributes | Status |
|----|-------------|----------|-------------------|--------|
| **FR-16** | File upload UI using FilePond library | P0 | `data-file-upload="input"` | Code Complete |
| **FR-17** | Files upload to cloud storage (Cloudflare R2) | P0 | Worker endpoint configured | Code Complete |
| **FR-18** | File URL stored in hidden input | P0 | `data-file-upload="url"`, `name="file_url"` | Code Complete |
| **FR-19** | Form submission includes file URL | P0 | Hidden input with `name` attribute | Pending Webflow |
| **FR-20** | Image preview for image files | P1 | **INTENTIONALLY REMOVED** (DR-014) - PDF/Word only | N/A |
| **FR-21** | File type validation (images, PDF, DOC) | P1 | `data-accepted-types`, `acceptedFileTypes` | Code Complete |
| **FR-22** | File size limit validation (5MB default) | P1 | `data-max-size="5MB"`, `maxFileSize` | Code Complete |
| **FR-23** | Upload progress indicator | P1 | Custom Webflow UI progress bar | Code Complete |
| **FR-24** | Error message for failed uploads | P1 | `data-label-error-type`, `data-label-error-size`, `data-label-error-dismiss` | Code Complete |
| **FR-25** | Drag & drop support | P1 | FilePond native | Code Complete |
| **FR-26** | Remove/replace uploaded file | P1 | Click-to-delete on complete state | Code Complete |
| **FR-27** | Multiple file upload support | P2 | **BY DESIGN: Single file only** (`maxFiles: 1`) | N/A |
| **FR-28** | Camera capture on mobile | P2 | FilePond native capture | Code Complete |

### File Upload - Required HTML Attributes (per plan.md + memory)

**On container (div.input--container):**
```
data-file-upload="wrapper"
data-max-size="5MB"
data-accepted-types="application/pdf,.doc,.docx"
data-upload-endpoint="https://r2-upload-proxy.cloudflare-decorated911.workers.dev"
```

**On file input (input[type="file"]):**
```
data-file-upload="input"
```

**On hidden URL input:**
```
data-file-upload="url"
name="file_url" (or custom name like "cv_url")
type="hidden"
```

**On custom Webflow UI elements (per 2026-01-18 memory):**
```
data-file-upload="icon-upload"    (upload icon shown during idle/uploading)
data-file-upload="icon-success"   (checkmark shown on complete)
data-file-upload="loader"         (clickable area for delete on complete)
data-file-upload="filename"       (displays uploaded filename)
data-file-upload="progress"       (progress bar element)
data-file-upload="status"         (status text element)
```

**Configurable labels (CMS integration):**
```
data-label-drag="Sleep bestand hierheen"
data-label-browse="of klik om te selecteren"
data-label-description="PDF of Word, max 5MB"
data-label-error-type="Ongeldig bestandstype"
data-label-error-size="Bestand te groot"
data-label-error-dismiss="Klik om te verwijderen"
```

---

## Non-Functional Requirements

| ID | Requirement | Priority | Implied Attributes/Config | Status | Notes |
|----|-------------|----------|--------------------------|--------|-------|
| **NFR-1** | No Finsweet dependency for select | P0 | Remove `fs-selectcustom` | Code Complete | Custom JS replaces Finsweet |
| **NFR-2** | Works with Webflow form system | P0 | Standard form element structure | Pending Webflow | |
| **NFR-3** | Works with existing form_submission.js | P0 | `name` attributes on inputs | Code Complete | Hidden inputs approach |
| **NFR-4** | Smooth animations (open/close, progress) | P1 | CSS transitions (0.2s) | Code Complete | |
| **NFR-5** | WCAG 2.1 AA accessibility | P1 | Full ARIA attributes (see above) | Code Complete | WAI-ARIA 1.2 Combobox pattern |
| **NFR-6** | < 5KB minified JS (custom select) | P2 | - | **EXCEEDED** | 5.8KB minified (slightly over) |
| **NFR-7** | < 2KB minified CSS (custom select) | P2 | - | **EXCEEDED** | 10.1KB (includes focus states, validation) |
| **NFR-8** | Upload completes within 10s for 5MB file | P2 | Worker performance | Not Tested | Requires live testing |
| **NFR-9** | FilePond loaded from CDN | P1 | unpkg.com URLs in head | Pending Webflow | |

---

## Attribute Requirements Matrix

### Custom Select Component

| Element | Required Attributes | ARIA Attributes | Status |
|---------|-------------------|-----------------|--------|
| **Container** | `data-select="wrapper"` | - | Ready |
| **Trigger** | `data-select="trigger"`, `tabindex="0"` | `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` | Ready |
| **Input** | `data-select="input"`, `type="text"`, `name`, `placeholder`, `readonly`, `autocomplete="off"` | - | Ready |
| **Dropdown** | `data-select="dropdown"`, `id` | `role="listbox"` | Ready |
| **Option** | `data-select="option"`, `data-value`, `tabindex="-1"`, `id` | `role="option"`, `aria-selected` | Ready |

### File Upload Component

| Element | Required Attributes | Purpose |
|---------|-------------------|---------|
| **Container** | `data-file-upload="wrapper"`, `data-max-size`, `data-accepted-types`, `data-upload-endpoint` | JS initialization, validation config |
| **File Input** | `data-file-upload="input"` | FilePond transforms this |
| **Hidden URL** | `data-file-upload="url"`, `name`, `type="hidden"` | Stores R2 URL for form submission |
| **Icon Upload** | `data-file-upload="icon-upload"` | Shows during idle/uploading |
| **Icon Success** | `data-file-upload="icon-success"` | Shows on complete state |
| **Loader** | `data-file-upload="loader"` | Clickable delete area |
| **Filename** | `data-file-upload="filename"` | Displays uploaded filename |
| **Progress** | `data-file-upload="progress"` | Progress bar |
| **Status** | `data-file-upload="status"` | Status text |

### Label Configuration Attributes

| Attribute | Default Value | Purpose |
|-----------|---------------|---------|
| `data-label-drag` | "Sleep bestand hierheen" | Drag area text |
| `data-label-browse` | "of klik om te selecteren" | Browse link text |
| `data-label-description` | "PDF of Word, max 5MB" | File requirements |
| `data-label-error-type` | "Ongeldig bestandstype" | Type validation error |
| `data-label-error-size` | "Bestand te groot" | Size validation error |
| `data-label-error-dismiss` | "Klik om te verwijderen" | Error dismiss hint |

---

## Implementation Status Summary

### Code Status (from checklist.md)

| Category | Complete | Pending | Partial |
|----------|----------|---------|---------|
| CSS Implementation | 21 | 0 | 0 |
| JS Implementation | 35 | 0 | 4 |
| Webflow Integration | 6 | 16 | 0 |
| Testing | 4 | 28 | 4 |
| Documentation | 6 | 0 | 0 |
| **Total** | **72** | **44** | **8** |

### Key Files Created

| File | Location | Status |
|------|----------|--------|
| `input_select.js` | `src/2_javascript/form/` | Complete (v2.0) |
| `input_upload.js` | `src/2_javascript/form/` | Complete |
| `form_select_custom.css` | `src/1_css/form/` | Complete |
| `form_file_upload.css` | `src/1_css/form/` | Complete |
| `input_upload_webflow.css` | `src/1_css/form/` | Complete |
| Minified versions | `src/2_javascript/z_minified/form/` | Complete |

### Infrastructure Status

| Resource | Status | URL |
|----------|--------|-----|
| R2 Bucket | Active | `uploads` |
| R2 Public URL | Active | `https://pub-c638c7d6fac14551a3b2609c336ee4ab.r2.dev` |
| Upload Worker | Active | `https://r2-upload-proxy.cloudflare-decorated911.workers.dev` |

---

## Verification Checklist for Live Page

### Custom Select - Attributes to Verify

- [ ] Container has `data-select="wrapper"`
- [ ] Trigger has `data-select="trigger"`
- [ ] Trigger has `tabindex="0"`
- [ ] Trigger has `role="combobox"`
- [ ] Trigger has `aria-haspopup="listbox"`
- [ ] Trigger has `aria-expanded` (starts "false")
- [ ] Input has `data-select="input"`
- [ ] Input has `type="text"`
- [ ] Input has appropriate `name` attribute
- [ ] Input has `placeholder`
- [ ] Input has `readonly` attribute
- [ ] Input has `autocomplete="off"`
- [ ] Input has `required` if field is required
- [ ] Dropdown has `data-select="dropdown"`
- [ ] Dropdown has `role="listbox"`
- [ ] Each option has `data-select="option"`
- [ ] Each option has `data-value` with CMS value
- [ ] Each option has `role="option"`
- [ ] Each option has `tabindex="-1"`

### File Upload - Attributes to Verify

- [ ] Container has `data-file-upload="wrapper"`
- [ ] Container has `data-max-size` (e.g., "5MB")
- [ ] Container has `data-accepted-types` (e.g., "application/pdf,.doc,.docx")
- [ ] Container has `data-upload-endpoint` with Worker URL
- [ ] File input has `data-file-upload="input"`
- [ ] Hidden URL input has `data-file-upload="url"`
- [ ] Hidden URL input has `type="hidden"`
- [ ] Hidden URL input has appropriate `name` attribute
- [ ] Icon upload element has `data-file-upload="icon-upload"`
- [ ] Icon success element has `data-file-upload="icon-success"`
- [ ] Loader element has `data-file-upload="loader"`
- [ ] Filename element has `data-file-upload="filename"`
- [ ] Progress element has `data-file-upload="progress"`
- [ ] Status element has `data-file-upload="status"`

### Label Configuration (Optional CMS)

- [ ] Check for `data-label-drag` if customized
- [ ] Check for `data-label-browse` if customized
- [ ] Check for `data-label-description` if customized
- [ ] Check for `data-label-error-type` if customized
- [ ] Check for `data-label-error-size` if customized
- [ ] Check for `data-label-error-dismiss` if customized

---

## Gaps Analysis

### Architecture Changes Not Reflected in Original Spec

1. **DR-015 (v2.0)**: Original spec (FR-4) mentions "syncs to hidden select" but v2.0 architecture eliminates the hidden select entirely. The `<input>` element with `[data-select="input"]` now serves as BOTH display AND form submission element.

2. **FR-20 Intentionally Removed**: Original spec includes "Image preview for image files" but DR-014 explicitly removes this for PDF/Word-only upload (CV use case).

3. **FR-27 By Design**: Multiple file upload marked P2 but explicitly disabled (`maxFiles: 1`) for single-document CV uploads.

### Requirements Marked Incomplete

| ID | Requirement | Reason |
|----|-------------|--------|
| FR-5 | Form submission includes selected value | Pending Webflow integration |
| FR-8 | Options populated from CMS | Pending CMS Collection setup |
| FR-19 | Form submission includes file URL | Pending Webflow integration |
| NFR-2 | Works with Webflow form system | Pending Webflow integration |
| NFR-9 | FilePond loaded from CDN | Pending Webflow head code |

### Requirements Deferred or Changed

| ID | Original | Current Status |
|----|----------|----------------|
| FR-4 | Sync to hidden select | **Removed in DR-015** - No hidden select needed |
| FR-20 | Image preview | **Removed in DR-014** - PDF/Word only |
| FR-27 | Multiple file upload | **By design**: Single file only |
| NFR-6 | JS < 5KB | Exceeded (5.8KB) - accepted |
| NFR-7 | CSS < 2KB | Exceeded (10.1KB) - includes validation states |

### Webflow-Side Work Required

1. **CMS Collection "Form Select Options"**
   - Fields: Name, Slug, Category, Sort Order
   - Sample options for testing

2. **Component Structures in Designer**
   - Input | Select component with all data attributes
   - Input | File Upload component with all data attributes

3. **Custom Code in Webflow**
   - CSS in head section
   - JS in footer section
   - FilePond CDN resources

4. **Testing After Integration**
   - All functional testing items (28 pending)
   - Cross-browser testing
   - Accessibility testing with screen reader

---

## Summary

**Total Functional Requirements:** 28 (FR-1 to FR-28)
- Custom Select: 15 (FR-1 to FR-15)
- File Upload: 13 (FR-16 to FR-28)

**Total Non-Functional Requirements:** 9 (NFR-1 to NFR-9)

**Requirements Status:**
- Code Complete: 22
- Pending Webflow: 4
- Intentionally Removed/Changed: 3
- Exceeded Target: 2

**Critical for Audit:**
1. All `data-select="*"` attributes on select elements
2. All `data-file-upload="*"` attributes on upload elements
3. ARIA attributes for accessibility
4. `name` attributes for form submission
5. `required` attributes for validation
6. Label configuration attributes for CMS integration

---

*Generated from spec folder analysis - 2026-01-24*
