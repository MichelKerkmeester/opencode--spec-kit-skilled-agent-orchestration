---
title: "Form Data Persistence [017-form-persistence/spec]"
description: "Implement automatic form data persistence to preserve user input across page refreshes, preventing data loss due to accidental navigation or browser refresh."
trigger_phrases:
  - "form"
  - "data"
  - "persistence"
  - "spec"
  - "017"
importance_tier: "important"
contextType: "decision"
---
# Form Data Persistence

<!-- ANCHOR:overview -->
## Overview
Implement automatic form data persistence to preserve user input across page refreshes, preventing data loss due to accidental navigation or browser refresh.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:problem -->
## Problem
Users filling out forms lose all entered data when:
- Accidentally refreshing the page
- Browser crashes
- Navigating away and returning
<!-- /ANCHOR:problem -->

<!-- ANCHOR:solution -->
## Solution
Create `form_persistence.js` that automatically saves form data to localStorage and restores it on page load.
<!-- /ANCHOR:solution -->

<!-- ANCHOR:scope -->
## Scope
- New file: `src/2_javascript/form/form_persistence.js`
- Opt-in via `data-persist-form` attribute on form elements
- Works with existing form components (validation, submission, custom select, file upload)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:out-of-scope -->
## Out of Scope
- Server-side persistence
- Cross-device sync
- File input restoration (browser security restriction)
<!-- /ANCHOR:out-of-scope -->

<!-- ANCHOR:technical-approach -->
## Technical Approach

### Storage Strategy
- **Storage type**: localStorage (persists across sessions)
- **Key format**: `form_persist_{formId|pageUrl}`
- **Expiry**: 24 hours (configurable)
- **Debounce**: 500ms on input events

### Supported Fields
| Field Type | Persisted | Notes |
|------------|-----------|-------|
| Text inputs | Yes | |
| Textareas | Yes | |
| Native select | Yes | |
| Custom select | Yes | Both value and display text |
| Checkboxes | Yes | Checked state |
| Radio buttons | Yes | Checked state |
| File upload URL | Yes | Hidden URL input only |
| File input | No | Browser security |
| Password | No | Security exclusion |

### Integration Points
- Listens for `form-submit-success` event to clear data
- Triggers `input`/`change` events after restore for validation
- Works with CustomSelect API for proper restoration
<!-- /ANCHOR:technical-approach -->

<!-- ANCHOR:webflow-implementation -->
## Webflow Implementation

### Required Attribute
Add to any form that should persist data:
```html
<form data-persist-form>
```

### Optional Configuration
```html
<form 
  data-persist-form
  data-persist-key="job-application"   <!-- Custom storage key -->
  data-persist-expiry="48"             <!-- Hours until expiry (default: 24) -->
>
```
<!-- /ANCHOR:webflow-implementation -->

<!-- ANCHOR:success-criteria -->
## Success Criteria
- [ ] Form data persists across page refresh
- [ ] Data clears on successful form submission
- [ ] Data clears on form reset
- [ ] Custom select values restore correctly
- [ ] File upload URLs restore correctly
- [ ] No conflicts with validation/submission scripts
- [ ] Expired data is automatically cleared
<!-- /ANCHOR:success-criteria -->
