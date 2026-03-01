---
title: "Spec: Form Input Components Enhancement [012-form-input-upload-select/spec]"
description: "Enhance form input capabilities with two new components"
trigger_phrases:
  - "spec"
  - "form"
  - "input"
  - "components"
  - "enhancement"
  - "012"
importance_tier: "important"
contextType: "decision"
---
# Spec: Form Input Components Enhancement

<!-- ANCHOR:overview -->
## Overview

Enhance form input capabilities with two new components:

1. **Custom Select** - CMS-driven dropdown replacing Finsweet's `fs-selectcustom`
2. **File Upload** - FilePond-based file upload with cloud storage

Both components integrate with the existing Input | Main component structure and Webflow/Formspark form system.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:part-a-cms-driven-custom-select -->
## Part A: CMS-Driven Custom Select

### Problem Statement

Current select implementation uses Finsweet's select attribute which:
- Requires external JS dependency
- Has static/hardcoded options
- Cannot be updated by non-developers
- Adds maintenance overhead

### Solution

Build a custom select component with:
- Native JavaScript (no Finsweet dependency)
- CMS Collection List for dynamic options
- Hidden native `<select>` for form submission
- Full ARIA accessibility support

---
<!-- /ANCHOR:part-a-cms-driven-custom-select -->

<!-- ANCHOR:part-b-filepond-file-upload -->
## Part B: FilePond File Upload

### Problem Statement

Current forms have no file upload capability. Users need to:
- Upload CVs/resumes for job applications
- Attach documents to contact forms
- Submit images for service requests

### Solution

Integrate FilePond file upload library with:
- Cloud storage backend (Cloudflare R2 + Worker)
- Image preview for uploaded images
- File type and size validation
- Progress indicator during upload
- File URL submitted with form to Formspark

### Key Findings (Research)

| Finding | Implication |
|---------|-------------|
| Formspark does NOT support native file attachments | Must use cloud storage + URL approach |
| `form_submission.js` explicitly skips file inputs | Files converted to URLs before submission |
| Base64 encoding has ~10MB practical limit | Not suitable for larger files |
| User already has Cloudflare account | Use existing infrastructure, single ecosystem |
| Cloudflare R2: FREE egress, 10GB free storage | Most cost-effective at any scale |

---
<!-- /ANCHOR:part-b-filepond-file-upload -->

<!-- ANCHOR:requirements -->
## Requirements

### Functional Requirements - Custom Select

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Dropdown opens on trigger click | P0 |
| FR-2 | Dropdown closes on option selection | P0 |
| FR-3 | Selected value updates display text | P0 |
| FR-4 | Selected value syncs to hidden select | P0 |
| FR-5 | Form submission includes selected value | P0 |
| FR-6 | Dropdown closes on click outside | P0 |
| FR-7 | Dropdown closes on Escape key | P0 |
| FR-8 | Options populated from CMS Collection | P0 |
| FR-9 | Keyboard navigation (Arrow keys) | P1 |
| FR-10 | Enter/Space selects focused option | P1 |
| FR-11 | Tab closes dropdown and moves focus | P1 |
| FR-12 | Placeholder shown when no selection | P1 |
| FR-13 | Selected option visually highlighted | P1 |
| FR-14 | Form reset resets visual state | P2 |
| FR-15 | Multiple instances work independently | P2 |

### Functional Requirements - File Upload

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-16 | File upload UI using FilePond library | P0 |
| FR-17 | Files upload to cloud storage (Uploadcare) | P0 |
| FR-18 | File URL stored in hidden input | P0 |
| FR-19 | Form submission includes file URL | P0 |
| FR-20 | Image preview for image files | P1 |
| FR-21 | File type validation (images, PDF, DOC) | P1 |
| FR-22 | File size limit validation (5MB default) | P1 |
| FR-23 | Upload progress indicator | P1 |
| FR-24 | Error message for failed uploads | P1 |
| FR-25 | Drag & drop support | P1 |
| FR-26 | Remove/replace uploaded file | P1 |
| FR-27 | Multiple file upload support | P2 |
| FR-28 | Camera capture on mobile | P2 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | No Finsweet dependency for select | P0 |
| NFR-2 | Works with Webflow form system | P0 |
| NFR-3 | Works with existing form_submission.js | P0 |
| NFR-4 | Smooth animations (open/close, progress) | P1 |
| NFR-5 | WCAG 2.1 AA accessibility | P1 |
| NFR-6 | < 5KB minified JS (custom select) | P2 |
| NFR-7 | < 2KB minified CSS (custom select) | P2 |
| NFR-8 | Upload completes within 10s for 5MB file | P2 |
| NFR-9 | FilePond loaded from CDN | P1 |

---
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## Scope

### In Scope
- Custom select component (HTML structure, CSS, JS)
- CMS Collection setup for select options
- FilePond integration with Uploadcare
- File upload CSS customization
- Webflow Designer implementation guide
- Integration with existing Input component styling
- Integration with existing form submission system

### Out of Scope
- Multi-select functionality
- Search/filter within dropdown
- Grouped options (optgroup)
- Server-side file processing
- File transformation/manipulation
- Custom file storage backend (only Uploadcare/Cloudinary)

---
<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

### Custom Select
1. User can select an option from CMS-driven dropdown
2. Form submission includes correct selected value
3. Full keyboard navigation works
4. Passes WAVE accessibility check
5. No console errors
6. Works on Chrome, Firefox, Safari, Edge

### File Upload
1. User can drag & drop or browse to upload file
2. Image preview shows for image files
3. Upload progress is visible
4. File URL is submitted with form
5. Formspark email includes clickable file URL
6. Invalid files are rejected with clear error
7. Works on desktop and mobile

---
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:dependencies -->
## Dependencies

- Existing Input | Main component in Webflow
- CMS Collection "Form Select Options" (to be created)
- FilePond library (CDN)
- Cloudflare R2 bucket with public access
- Cloudflare Worker with R2 binding
- Existing `form_submission.js` system

---
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:risks -->
## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CMS Collection List nesting issues | Medium | High | Test in Webflow before full implementation |
| Cloudflare Worker configuration errors | Low | High | Test Worker thoroughly before deployment |
| R2 public access misconfigured | Low | High | Verify r2.dev URL works before Webflow integration |
| FilePond styling conflicts | Medium | Low | Use scoped CSS, test thoroughly |
| Large file upload timeouts | Medium | Medium | Set appropriate size limits, show progress |
| Form submission before upload complete | Medium | High | Disable submit until upload done |

---
<!-- /ANCHOR:risks -->

<!-- ANCHOR:timeline -->
## Timeline

- Estimated LOC: ~600 (JS: ~400, CSS: ~200)
- Documentation Level: 3
- Estimated effort: 8-12 hours total
  - Custom Select: 4-6 hours
  - File Upload: 4-6 hours
<!-- /ANCHOR:timeline -->
