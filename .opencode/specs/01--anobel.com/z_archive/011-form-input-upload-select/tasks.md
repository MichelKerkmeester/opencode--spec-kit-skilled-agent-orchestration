---
title: "Tasks: Form Input Components Enhancement [012-form-input-upload-select/tasks]"
description: "Cloudflare R2 Setup"
trigger_phrases:
  - "tasks"
  - "form"
  - "input"
  - "components"
  - "enhancement"
  - "012"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Form Input Components Enhancement

<!-- ANCHOR:overview -->
## Overview

| Component | Status | Priority | Estimated Hours |
|-----------|--------|----------|-----------------|
| Custom Select | Not Started | High | 4-6 |
| File Upload | Not Started | High | 4-6 |
| **Total** | | | **8-12** |

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:part-a-custom-select-tasks -->
## Part A: Custom Select Tasks

### Phase 1: CMS Setup
- [ ] Create CMS Collection "Form Select Options"
- [ ] Add fields: Name, Slug, Category, Sort Order
- [ ] Add test options (5-10 items)

### Phase 2: Webflow Structure
- [ ] Duplicate Input | Main to create Input | Select
- [ ] Remove input element from input--w
- [ ] Add input--text div with placeholder span
- [ ] Add chevron icon (input--icon.is--chevron)
- [ ] Add input--dropdown container after input--w
- [ ] Add Collection List inside dropdown
- [ ] Configure Collection Item with input--dropdown-option
- [ ] Add hidden select element
- [ ] Add all data attributes

### Phase 3: CSS Implementation
- [ ] Create `src/1_css/form/form_select_custom.css`
- [ ] Style dropdown positioning (absolute, below trigger)
- [ ] Style closed state (hidden)
- [ ] Style open state (.is--open)
- [ ] Style option hover/focus states
- [ ] Style selected option (.is--selected)
- [ ] Add chevron rotation animation
- [ ] Add dropdown open/close transition

### Phase 4: JavaScript Implementation
- [ ] Create `src/2_javascript/form/select_custom.js`
- [ ] Implement CustomSelect class structure
- [ ] Implement element discovery (data attributes)
- [ ] Implement toggle(), open(), close() methods
- [ ] Implement selectOption() method
- [ ] Implement syncOptionsToHiddenSelect()
- [ ] Implement click outside detection
- [ ] Implement keyboard navigation (Arrow, Enter, Escape, Tab)
- [ ] Implement ARIA attribute updates
- [ ] Implement form reset handler
- [ ] Add initialization function

### Phase 5: Integration
- [ ] Add CSS to Webflow custom code
- [ ] Add JS to Webflow custom code
- [ ] Test in Webflow Designer preview
- [ ] Test on published site

---
<!-- /ANCHOR:part-a-custom-select-tasks -->

<!-- ANCHOR:part-b-file-upload-tasks -->
## Part B: File Upload Tasks

### Phase 6: Cloudflare R2 + Worker Setup

**Cloudflare R2 Setup:**
- [ ] Log in to Cloudflare dashboard
- [ ] Go to R2 Object Storage
- [ ] Create bucket (name: `anobel-uploads`)
- [ ] Go to bucket Settings → Public Access
- [ ] Enable R2.dev subdomain (get public URL like `pub-xxx.r2.dev`)
- [ ] Note the public URL for Worker configuration

**Cloudflare Worker Setup:**
- [ ] Go to Workers & Pages
- [ ] Create new Worker (`r2-upload-proxy`)
- [ ] Paste Worker code (see webflow-guide.md)
- [ ] Go to Worker Settings → Variables
- [ ] Add R2 bucket binding:
  - [ ] Variable name: `UPLOADS_BUCKET`
  - [ ] Select R2 bucket: `anobel-uploads`
- [ ] Add environment variable:
  - [ ] R2_PUBLIC_URL = `https://pub-xxx.r2.dev` (your public URL)
- [ ] Deploy Worker
- [ ] Test with curl/Postman
- [ ] Optionally configure custom domain (e.g., `upload.anobel.com`)

### Phase 7: Webflow Structure
- [ ] Duplicate Input | Main to create Input | File Upload
- [ ] Remove input element from input--w
- [ ] Add input--file-upload container
- [ ] Add file input element with data attributes
- [ ] Add hidden input for URL storage
- [ ] Update helper text with file requirements
- [ ] Add all data attributes

### Phase 8: CSS Implementation
- [ ] Create `src/1_css/form/form_file_upload.css`
- [ ] Override FilePond default styles
- [ ] Style drop zone (border, background, hover)
- [ ] Style progress bar
- [ ] Style error state
- [ ] Style success state
- [ ] Style image preview container
- [ ] Ensure responsive behavior

### Phase 9: JavaScript Implementation
- [ ] Create `src/2_javascript/form/file_upload.js`
- [ ] Add FilePond CDN links to Webflow head
- [ ] Register FilePond plugins
- [ ] Implement FileUpload class
- [ ] Configure Uploadcare as server backend
- [ ] Implement upload success handler (store URL)
- [ ] Implement upload error handler
- [ ] Implement form submission guard
- [ ] Add initialization function

### Phase 10: Integration
- [ ] Add FilePond CSS to Webflow head
- [ ] Add FilePond JS to Webflow footer
- [ ] Add custom CSS to Webflow
- [ ] Add custom JS to Webflow
- [ ] Test file selection (browse)
- [ ] Test drag and drop
- [ ] Test file validation
- [ ] Test upload progress
- [ ] Test form submission with URL
- [ ] Verify Formspark receives URL
- [ ] Verify email contains clickable link

---
<!-- /ANCHOR:part-b-file-upload-tasks -->

<!-- ANCHOR:shared-tasks -->
## Shared Tasks

### Documentation
- [ ] Complete Webflow implementation guide
- [ ] Document CMS setup steps
- [ ] Document Uploadcare setup steps
- [ ] Add code comments
- [ ] Create usage examples

### Testing
- [ ] Test Chrome
- [ ] Test Firefox
- [ ] Test Safari
- [ ] Test Edge
- [ ] Test iOS Safari
- [ ] Test Android Chrome
- [ ] Test keyboard navigation
- [ ] Test screen reader
- [ ] Run WAVE accessibility tool

### Cleanup
- [ ] Remove Finsweet select (if applicable)
- [ ] Create minified versions
- [ ] Verify no console errors
- [ ] Monitor Uploadcare usage

---
<!-- /ANCHOR:shared-tasks -->

<!-- ANCHOR:dependencies -->
## Dependencies

```
Phase 1-2 → Phase 3-4 → Phase 5 (Select complete)
Phase 6   → Phase 7   → Phase 8-9 → Phase 10 (Upload complete)
```

**Critical Path:**
1. Cloudflare R2 + Worker setup needed before Phase 7
2. CMS Collection needed before Phase 2
3. CSS must be complete before JS integration testing
4. R2 bucket must have public access enabled before Worker deployment
5. Worker must be deployed and tested before Webflow integration

---
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:notes -->
## Notes

### Cloudflare R2 Pricing (FREE Egress!)
- Storage: $0.015/GB/month
- Egress: **FREE** (unlimited downloads)
- Class A ops (writes): $4.50/million (1M free/month)
- Class B ops (reads): $0.36/million (10M free/month)
- **Free tier: 10GB storage, 1M writes, 10M reads**
- Example: 1,000 uploads × 5MB = 5GB = **FREE** (under 10GB limit)

### Cloudflare Worker Limits (Free Tier)
- 100,000 requests/day
- 10ms CPU time per request
- More than enough for form uploads

### File Type Recommendations
```
Images: image/jpeg, image/png, image/gif, image/webp
Documents: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### Recommended Size Limits
- CV/Resume: 5MB
- Images: 2MB
- General documents: 10MB
<!-- /ANCHOR:notes -->
