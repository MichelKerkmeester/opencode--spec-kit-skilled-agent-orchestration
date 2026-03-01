---
title: "Form Persistence Checklist [017-form-persistence/checklist]"
description: "checklist document for 017-form-persistence."
trigger_phrases:
  - "form"
  - "persistence"
  - "checklist"
  - "017"
importance_tier: "normal"
contextType: "implementation"
---
# Form Persistence Checklist

<!-- ANCHOR:implementation -->
## Implementation
- [x] Create `form_persistence.js` script
- [x] Implement localStorage save/restore
- [x] Handle text inputs and textareas
- [x] Handle checkboxes and radio buttons
- [x] Handle native select elements
- [x] Handle custom select (data-select)
- [x] Handle file upload URL (data-file-upload="url")
- [x] Implement debounced auto-save on input
- [x] Implement restore on page load
- [x] Implement clear on form submit success
- [x] Implement clear on form reset
- [x] Implement 24-hour expiry
- [x] Copy to staging folder
- [x] Run minification
- [x] Verify code quality standards (header, IIFE, snake_case)
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:html-integration -->
## HTML Integration
- [x] Add script to `contact.html` (line 60)
- [x] Add script to `werken_bij.html` (line 82)
- [x] Add script to `cms/vacature.html` (line 59)
<!-- /ANCHOR:html-integration -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Test text input persistence
- [ ] Test textarea persistence
- [ ] Test checkbox persistence
- [ ] Test radio button persistence
- [ ] Test native select persistence
- [ ] Test custom select persistence
- [ ] Test file upload URL persistence
- [ ] Test clear on submission
- [ ] Test clear on reset
- [ ] Test expiry after 24 hours
- [ ] Test no conflicts with validation
- [ ] Test no conflicts with submission
<!-- /ANCHOR:testing -->

<!-- ANCHOR:webflow-deployment -->
## Webflow Deployment
- [ ] Upload minified `form_persistence.js` to R2 CDN
- [ ] Update Webflow page custom code (copy from HTML files)
- [ ] Add `data-persist-form` attribute to forms in Webflow Designer
- [ ] Test in Webflow preview
- [ ] Publish to production
<!-- /ANCHOR:webflow-deployment -->
