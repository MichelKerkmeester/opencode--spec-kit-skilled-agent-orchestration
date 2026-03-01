---
title: "Plan: Form Input Components Enhancement [012-form-input-upload-select/plan]"
description: "This plan covers two components"
trigger_phrases:
  - "plan"
  - "form"
  - "input"
  - "components"
  - "enhancement"
  - "012"
importance_tier: "important"
contextType: "decision"
---
# Plan: Form Input Components Enhancement

This plan covers two components:
- **Part A**: CMS-Driven Custom Select
- **Part B**: FilePond File Upload

---

# Part A: CMS-Driven Custom Select

<!-- ANCHOR:architecture-overview-v20-dr-015 -->
## Architecture Overview (v2.0 - DR-015)

```
┌─────────────────────────────────────────────────────────────┐
│ label.input--container [data-select="wrapper"]              │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ input--header                                          │ │
│  │   └── input--label, input--required                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ input--w [data-select="trigger"]                       │ │
│  │   ├── input--icon (left, optional)                     │ │
│  │   ├── <input type="text" readonly                      │ │
│  │   │         name="field_name"                          │ │
│  │   │         placeholder="Selecteer..."                 │ │
│  │   │         required                                   │ │
│  │   │         [data-select="input"]>                     │ │
│  │   └── input--icon.is--chevron (right)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ input--dropdown [data-select="dropdown"]               │ │
│  │   └── Collection List Wrapper                          │ │
│  │         └── Collection List                            │ │
│  │               └── Collection Item                      │ │
│  │                     └── input--dropdown-option         │ │
│  │                         [data-select="option"]         │ │
│  │                         [data-value="{CMS slug}"]      │ │
│  │                         Text: {CMS name}               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ input--helper-w (optional)                             │ │
│  │   └── error container + helper text                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Note: No hidden <select> needed! The input element serves as both
display AND form submission element. (See DR-015)
```
<!-- /ANCHOR:architecture-overview-v20-dr-015 -->

<!-- ANCHOR:state-machine -->
## State Machine

```
     ┌──────────────────────────────────────────┐
     │                                          │
     ▼                                          │
 ┌────────┐  click/Enter/Space/ArrowDown   ┌────────┐
 │ CLOSED │ ──────────────────────────────►│  OPEN  │
 └────────┘                                └────────┘
     ▲                                          │
     │    click outside/Escape/Tab/Select       │
     └──────────────────────────────────────────┘
```
<!-- /ANCHOR:state-machine -->

<!-- ANCHOR:data-flow-v20-dr-015 -->
## Data Flow (v2.0 - DR-015)

```
User clicks option
       │
       ▼
┌──────────────────┐
│ JS: selectOption │
└────────┬─────────┘
         │
         ▼
┌─────────────────────┐
│ Update input.value  │
│ (display text)      │
│                     │
│ Set data-value      │
│ (actual value)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Dispatch 'change'   │
│ + 'input' events    │
│ on input element    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Form submission     │
│ includes input      │
│ name + value        │
└─────────────────────┘

Note: Single element (input) handles both display and submission.
No syncing between separate elements needed.
```
<!-- /ANCHOR:data-flow-v20-dr-015 -->

<!-- ANCHOR:implementation-phases-custom-select -->
## Implementation Phases - Custom Select

### Phase 1: CMS Setup
1. Create CMS Collection "Form Select Options"
   - Fields: `name` (text), `slug` (auto), `category` (option), `sort-order` (number)
2. Add sample options for testing

### Phase 2: Webflow Structure
1. Duplicate Input | Main to create Input | Select variant
2. Modify structure per architecture diagram
3. Add data attributes for JS hooks
4. Add Collection List with CMS binding

### Phase 3: CSS Implementation
1. Create `src/1_css/form/form_select_custom.css`
2. Implement dropdown positioning
3. Implement open/closed states
4. Implement option hover/focus/selected states
5. Add transitions for smooth animation

### Phase 4: JavaScript Implementation
1. Create `src/2_javascript/form/select_custom.js`
2. Implement CustomSelect class
3. Implement toggle, open, close methods
4. Implement option selection and sync
5. Implement keyboard navigation
6. Implement click outside detection
7. Implement form reset handling

### Phase 5: Integration & Testing
1. Integrate CSS/JS into Webflow
2. Test all functional requirements
3. Test accessibility with keyboard
4. Test form submission
5. Test multiple instances
6. Cross-browser testing

---

# Part B: FilePond File Upload
<!-- /ANCHOR:implementation-phases-custom-select -->

<!-- ANCHOR:architecture-overview -->
## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ input--container [data-file-upload="wrapper"]               │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ input--header                                          │ │
│  │   └── label, required indicator                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ input--file-upload [data-file-upload="dropzone"]       │ │
│  │                                                        │ │
│  │   ┌──────────────────────────────────────────────────┐ │ │
│  │   │ FilePond Component (auto-generated)              │ │ │
│  │   │                                                  │ │ │
│  │   │ ┌──────────────────────────────────────────────┐ │ │ │
│  │   │ │ Sleep PDF/Word of klik om te uploaden        │ │ │ │
│  │   │ └──────────────────────────────────────────────┘ │ │ │
│  │   │                                                  │ │ │
│  │   │ ┌──────────────────────────────────────────────┐ │ │ │
│  │   │ │ [Progress Bar - Compact ~60-80px height]     │ │ │ │
│  │   │ └──────────────────────────────────────────────┘ │ │ │
│  │   │                                                  │ │ │
│  │   └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │   <input type="file" [data-file-upload="input"]>       │ │
│  │   (FilePond transforms this)                           │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ <input type="hidden" name="file_url"                   │ │
│  │        [data-file-upload="url"]>                       │ │
│  │ (Stores uploaded file URL for form submission)         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ input--helper-w (optional)                             │ │
│  │   └── "Geaccepteerd: PDF, DOC, DOCX. Max 5MB"          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
<!-- /ANCHOR:architecture-overview -->

<!-- ANCHOR:upload-flow -->
## Upload Flow

```
1. User drops/selects file
       │
       ▼
2. FilePond validates (type, size)
       │
       ├── Invalid? → Show error, stop
       │
       ▼
3. FilePond POSTs to Cloudflare Worker
       │ (Shows progress bar)
       ▼
4. Worker uploads to R2 via binding
       │ (No API key needed - binding handles auth)
       ▼
5. Worker returns R2 public URL
       │
       ▼
6. JS stores URL in hidden input
       │
       ▼
7. User submits form
       │
       ▼
8. Formspark receives form data + file URL
       │
       ▼
9. Email notification includes clickable file URL
```
<!-- /ANCHOR:upload-flow -->

<!-- ANCHOR:state-machine -->
## State Machine

```
     ┌─────────────────────────────────────────────────────┐
     │                                                     │
     ▼                                                     │
 ┌────────┐  file selected   ┌────────────┐  upload done  ┌──────────┐
 │  IDLE  │ ────────────────►│ UPLOADING  │ ─────────────►│ COMPLETE │
 └────────┘                  └────────────┘               └──────────┘
     ▲                            │                            │
     │                            │ error                      │ remove
     │                            ▼                            │
     │                       ┌─────────┐                       │
     └───────────────────────│  ERROR  │◄──────────────────────┘
         retry/remove        └─────────┘
```
<!-- /ANCHOR:state-machine -->

<!-- ANCHOR:implementation-phases-file-upload -->
## Implementation Phases - File Upload

### Phase 6: Cloudflare R2 + Worker Setup ✅ COMPLETED
1. ✅ Created R2 bucket: `uploads`
2. ✅ Enabled public access: `https://pub-c638c7d6fac14551a3b2609c336ee4ab.r2.dev`
3. ✅ Created Cloudflare Worker: `r2-upload-proxy`
4. ✅ Added R2 binding: `UPLOADS_BUCKET` → `uploads`
5. ✅ Added environment variable: `R2_PUBLIC_URL`
6. ✅ CORS configured for all origins (can restrict to anobel.com later)
7. ✅ Worker deployed and tested: `https://r2-upload-proxy.cloudflare-decorated911.workers.dev`

### Phase 7: Webflow Structure
1. Create Input | File Upload variant based on Input | Main
2. Add file input element with data attributes
3. Add hidden input for URL storage
4. Add helper text with file requirements

### Phase 8: CSS Implementation
1. Create `src/1_css/form/form_file_upload.css`
2. Style FilePond to match design system
3. Style progress states
4. Style error states
5. Ensure responsive behavior

### Phase 9: JavaScript Implementation
1. Create `src/2_javascript/form/file_upload.js`
2. Load FilePond from CDN (core + validation plugins only)
3. Register plugins: `FileValidateType`, `FileValidateSize` (no ImagePreview)
4. Initialize FilePond with compact layout:
   - `maxFiles: 1`, `allowMultiple: false`
   - `stylePanelLayout: 'compact'` (~60-80px height)
   - `acceptedFileTypes: ['application/pdf', '.doc', '.docx']`
5. Configure R2 Worker as server backend
6. Handle upload success (store URL in hidden input)
7. Handle upload errors (Dutch error messages)
8. Integrate with form submission (block if uploading)

### Phase 10: Integration & Testing
1. Add CSS/JS to Webflow
2. Test file selection (drag & drop, browse)
3. Test file validation (type, size)
4. Test upload progress
5. Test form submission with file URL
6. Test error handling
7. Test on mobile devices

---
<!-- /ANCHOR:implementation-phases-file-upload -->

<!-- ANCHOR:file-structure -->
## File Structure

```
src/
├── 1_css/
│   └── form/
│       ├── form_select_custom.css    # Custom select styling
│       └── form_file_upload.css      # FilePond customization
└── 2_javascript/
    └── form/
        ├── select_custom.js          # Custom select component
        └── file_upload.js            # FilePond initialization
```

---
<!-- /ANCHOR:file-structure -->

<!-- ANCHOR:technical-details -->
## Technical Details

### Data Attributes - Custom Select (v2.0)

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `data-select="wrapper"` | Container (label) | JS initialization target |
| `data-select="trigger"` | input--w wrapper | Click handler, ARIA combobox |
| `data-select="input"` | Input element | Display AND form submission |
| `data-select="dropdown"` | Dropdown container | Toggle visibility, listbox |
| `data-select="option"` | Option element | Click selection |
| `data-value` | Option element | Submitted value (different from display text) |

### Input Element Attributes

| Attribute | Purpose |
|-----------|---------|
| `name` | Field name for form submission |
| `placeholder` | Default text when empty |
| `required` | Makes field required |
| `readonly` | Prevents typing (JS sets this) |
| `autocomplete="off"` | Prevents browser autocomplete |

### Data Attributes - File Upload

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `data-file-upload="wrapper"` | Container | JS initialization target |
| `data-file-upload="input"` | File input | FilePond transforms this |
| `data-file-upload="url"` | Hidden input | Stores uploaded file URL |
| `data-max-size` | Container | Max file size (e.g., "5MB") |
| `data-accepted-types` | Container | Allowed MIME types |
| `data-upload-endpoint` | Container | Cloudflare Worker URL |

### CSS Classes

| Class | Purpose |
|-------|---------|
| `is--open` | Dropdown open state (on wrapper) |
| `is--selected` | Selected option (on option element) |
| `is--has-value` | Input has selected value (on input) |
| `is--chevron` | Chevron icon modifier |
| `is--disabled` | Disabled state |
| `is--uploading` | Upload in progress |
| `is--complete` | Upload complete |
| `is--error` | Error/validation state |
| `is--success` | Success/valid state |

### FilePond Plugins Required

| Plugin | Purpose |
|--------|---------|
| `FilePondPluginImagePreview` | Show image thumbnails |
| `FilePondPluginFileValidateType` | Validate file types |
| `FilePondPluginFileValidateSize` | Validate file size |

### CDN Resources

```html
<!-- FilePond CSS -->
<link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet" />
<link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css" rel="stylesheet" />

<!-- FilePond JS -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js"></script>
<script src="https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js"></script>
<script src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js"></script>
<script src="https://unpkg.com/filepond/dist/filepond.js"></script>
```

---
<!-- /ANCHOR:technical-details -->

<!-- ANCHOR:webflow-designer-steps -->
## Webflow Designer Steps

### CMS Collection Setup (Select)
1. Go to CMS panel
2. Create new Collection: "Form Select Options"
3. Add fields:
   - `Name` (Plain Text, required)
   - `Slug` (Auto-generated)
   - `Category` (Option: "referral-source", "service-type", etc.)
   - `Sort Order` (Number)
4. Add sample items

### Custom Select Component Structure
1. Select Input | Main component
2. Duplicate as Input | Select
3. In `input--w`:
   - Remove `input` element
   - Add Div Block with class `input--text`
   - Inside, add Text Block for display text
   - Add second `input--icon` with chevron SVG
4. After `input--w`:
   - Add Div Block with class `input--dropdown`
   - Inside, add Collection List bound to "Form Select Options"
   - In Collection Item, add Div Block with class `input--dropdown-option`
5. After dropdown:
   - Add Form Select (will become hidden)
   - Add placeholder option with empty value
6. Add custom attributes via Element Settings panel

### File Upload Component Structure
1. Select Input | Main component
2. Duplicate as Input | File Upload
3. Replace `input--w` contents:
   - Add Div Block with class `input--file-upload`
   - Inside, add Form File Upload element
   - Add custom attributes for FilePond
4. After file upload container:
   - Add Hidden Input for URL storage
   - Set name attribute (e.g., "cv_url")
5. Update helper text with file requirements

### Custom Attributes - Select

**On container (input--container):**
```
data-select = wrapper
```

**On trigger (input--w):**
```
data-select = trigger
tabindex = 0
role = combobox
aria-haspopup = listbox
aria-expanded = false
```

**On display text wrapper:**
```
data-select = display
data-placeholder = Selecteer...
```

**On dropdown:**
```
data-select = dropdown
role = listbox
```

**On each option (in Collection Item):**
```
data-select = option
data-value = {bind to CMS slug field}
role = option
tabindex = -1
```

**On hidden select:**
```
data-select = hidden
```

### Custom Attributes - File Upload

**On container (input--container):**
```
data-file-upload = wrapper
data-max-size = 5MB
data-accepted-types = image/*,application/pdf,.doc,.docx
data-upload-endpoint = https://upload.anobel.com
```

**On file input:**
```
data-file-upload = input
```

**On hidden URL input:**
```
data-file-upload = url
name = file_url
```

---
<!-- /ANCHOR:webflow-designer-steps -->

<!-- ANCHOR:testing-checklist -->
## Testing Checklist

See `checklist.md` for full QA validation items.
<!-- /ANCHOR:testing-checklist -->
