# FilePond Upload Implementation Analysis

**Source File:** `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/src/2_javascript/form/input_upload.js`
**Analysis Date:** 2026-01-24

---

## 1. Complete Attribute Inventory

### 1.1 Structure Attributes (data-file-upload="value")

These attributes define the HTML structure that the JavaScript expects.

| Attribute Value | Element Type | Required | Purpose |
|-----------------|--------------|----------|---------|
| `wrapper` | DIV | **REQUIRED** | Main container element |
| `input` | INPUT[type=file] | **REQUIRED** | Hidden file input for FilePond |
| `url` | INPUT[type=hidden] | **REQUIRED** | Stores uploaded file URL for form submission |
| `idle` | DIV | Optional | Idle state view container |
| `loader` | DIV | Optional | Upload/complete/error state container |
| `browse` | A/BUTTON | Optional | Clickable element to open file picker |
| `notice` | DIV/SPAN | Optional | Action notice text (cancel/delete/dismiss) |
| `text` | SPAN | Optional | Idle instruction text |
| `text-mobile` | SPAN | Optional | Mobile-specific idle text (CSS toggled) |
| `description` | DIV | Optional | File requirements description |
| `uploading` | DIV | Optional | Status text / filename display |
| `progress-bar` | DIV | Optional | Progress bar fill element (width animated) |
| `progress-track` | DIV | Optional | Progress bar track/background |
| `percentage` | DIV/SPAN | Optional | Percentage text (e.g., "40%") |
| `size` | DIV/SPAN | Optional | File size text (e.g., "178MB of 445MB") |
| `icon-upload` | DIV | Optional | Upload icon (visible during upload) |
| `icon-success` | DIV | Optional | Success checkmark (visible on complete) |

**Code Reference (lines 18-41):**
```javascript
const SELECTORS = {
  wrapper: '[data-file-upload="wrapper"]',
  input: '[data-file-upload="input"]',
  url: '[data-file-upload="url"]',
  idle: '[data-file-upload="idle"]',
  loader: '[data-file-upload="loader"]',
  browse: '[data-file-upload="browse"]',
  notice: '[data-file-upload="notice"]',
  idleText: '[data-file-upload="text"]',
  description: '[data-file-upload="description"]',
  uploading: '[data-file-upload="uploading"]',
  progressBar: '[data-file-upload="progress-bar"]',
  percentage: '[data-file-upload="percentage"]',
  size: '[data-file-upload="size"]',
};
```

### 1.2 Configuration Attributes (on wrapper)

| Attribute | Default | Type | Purpose |
|-----------|---------|------|---------|
| `data-upload-endpoint` | `https://r2-upload-proxy.cloudflare-decorated911.workers.dev` | URL | Upload destination endpoint |
| `data-max-size` | `5MB` | String | Maximum file size (e.g., "5MB", "10MB") |
| `data-accepted-types` | `application/pdf,.doc,.docx` | CSV | Comma-separated MIME types/extensions |

**Code Reference (lines 44-48):**
```javascript
const DEFAULTS = {
  maxSize: '5MB',
  acceptedTypes: 'application/pdf,.doc,.docx',
  uploadEndpoint: 'https://r2-upload-proxy.cloudflare-decorated911.workers.dev',
};
```

### 1.3 Label Customization Attributes (on wrapper)

All labels can be customized via data attributes for CMS/localization.

#### Idle State Labels

| Attribute | Default | Purpose |
|-----------|---------|---------|
| `data-label-idle-text` | `Drag & drop your file or` | Main instruction text |
| `data-label-browse` | `Browse` | Browse link text |
| `data-label-description` | `Max 5 MB: PDF, DOC, DOCX` | File requirements text |

#### Upload State Labels

| Attribute | Default | Purpose |
|-----------|---------|---------|
| `data-label-uploading` | `Uploading...` | Status during upload |
| `data-label-cancel` | `Click to cancel upload` | Notice during upload |
| `data-label-delete` | `Click to delete` | Notice when complete |
| `data-label-size-separator` | ` of ` | Separator between loaded/total size |

#### Error State Labels

| Attribute | Default | Purpose |
|-----------|---------|---------|
| `data-label-error-type` | `Invalid file type` | Error for wrong file type |
| `data-label-error-size` | `File too large` | Error for oversized file |
| `data-label-error-dismiss` | `Click to dismiss` | Notice on error state |

**Code Reference (lines 59-73, 81-97):**
```javascript
const DEFAULT_LABELS = {
  idleText: 'Drag & drop your file or',
  browse: 'Browse',
  description: 'Max 5 MB: PDF, DOC, DOCX',
  uploading: 'Uploading...',
  cancel: 'Click to cancel upload',
  delete: 'Click to delete',
  sizeSeparator: ' of ',
  errorInvalidType: 'Invalid file type',
  errorMaxSize: 'File too large',
  errorDismiss: 'Click to dismiss',
};

function getLabels(wrapper) {
  return {
    idleText: wrapper.getAttribute('data-label-idle-text') || DEFAULT_LABELS.idleText,
    browse: wrapper.getAttribute('data-label-browse') || DEFAULT_LABELS.browse,
    description: wrapper.getAttribute('data-label-description') || DEFAULT_LABELS.description,
    uploading: wrapper.getAttribute('data-label-uploading') || DEFAULT_LABELS.uploading,
    cancel: wrapper.getAttribute('data-label-cancel') || DEFAULT_LABELS.cancel,
    delete: wrapper.getAttribute('data-label-delete') || DEFAULT_LABELS.delete,
    sizeSeparator: wrapper.getAttribute('data-label-size-separator') || DEFAULT_LABELS.sizeSeparator,
    errorInvalidType: wrapper.getAttribute('data-label-error-type') || DEFAULT_LABELS.errorInvalidType,
    errorMaxSize: wrapper.getAttribute('data-label-error-size') || DEFAULT_LABELS.errorMaxSize,
    errorDismiss: wrapper.getAttribute('data-label-error-dismiss') || DEFAULT_LABELS.errorDismiss,
  };
}
```

### 1.4 Auto-Managed Attributes (Set by JavaScript)

| Attribute | Element | Values | Purpose |
|-----------|---------|--------|---------|
| `data-filepond-init` | wrapper | `"true"` | Prevents double initialization |
| `data-upload-state` | wrapper | `idle`, `uploading`, `complete`, `error` | Current upload state |

**Code Reference (lines 137-138, 645-646):**
```javascript
wrapper.dataset.uploadState = state;  // line 138
wrapper.dataset.filepondInit = 'true';  // line 646
```

---

## 2. CSS State Classes (on wrapper)

| Class | When Applied | CSS Effect |
|-------|--------------|------------|
| `.is--uploading` | File upload in progress | Shows loader, hides idle view |
| `.is--complete` | Upload successful | Shows loader with success styling |
| `.is--error` | Validation/upload failed | Shows error styling |
| `.is--drag-over` | File dragged over dropzone | Visual feedback (dashed border) |

**Code Reference (lines 140-152):**
```javascript
function setState(wrapper, state) {
  wrapper.dataset.uploadState = state;
  wrapper.classList.remove('is--uploading', 'is--complete', 'is--error');

  if (state === STATE.UPLOADING) {
    wrapper.classList.add('is--uploading');
  } else if (state === STATE.COMPLETE) {
    wrapper.classList.add('is--complete');
  } else if (state === STATE.ERROR) {
    wrapper.classList.add('is--error');
  }
}
```

---

## 3. FilePond Initialization Requirements

### 3.1 Required Container Structure

Minimum required elements:
1. Wrapper with `data-file-upload="wrapper"`
2. File input with `data-file-upload="input"`
3. Hidden URL input with `data-file-upload="url"`

### 3.2 FilePond Configuration

```javascript
FilePond.create(inputEl, {
  name: '',                          // Prevent FilePond form submission
  maxFiles: 1,                       // Single file mode
  allowMultiple: false,
  stylePanelLayout: null,            // Hide FilePond UI
  styleButtonRemoveItemPosition: 'left',
  credits: false,
  required: false,
  dropOnPage: false,                 // Manual drag-drop handling
  dropOnElement: false,
  acceptedFileTypes: acceptedTypesArray,  // From data-accepted-types
  maxFileSize: maxSize,                   // From data-max-size
  server: createServerConfig(endpoint, wrapper, urlInput),
});
```

### 3.3 FilePond Plugins Used

| Plugin | Version | Purpose |
|--------|---------|---------|
| `filepond-plugin-file-validate-type` | 1.2.8 | MIME type validation |
| `filepond-plugin-file-validate-size` | 2.2.8 | File size validation |
| `filepond` (core) | 4.30.4 | Base library |

**Load Order (CRITICAL):**
1. Plugins first (type validation, size validation)
2. FilePond core last
3. Custom connector script (`input_upload.js`)

---

## 4. Hidden Input Structure for Form Submission

### 4.1 URL Input

```html
<input type="hidden"
       data-file-upload="url"
       name="cv_url">
```

**Behavior:**
- Starts empty
- Set to uploaded file URL on successful upload (line 274)
- Cleared on file removal (line 311)
- Submitted with form data as `name` value

**Code Reference (lines 273-277):**
```javascript
// Store uploaded URL in hidden input
urlInput.value = response.url;
// Signal success to FilePond
load(response.url);
```

### 4.2 Form Submission Flow

1. User drops/selects file
2. FilePond validates (type, size)
3. If valid, uploads to endpoint via XHR
4. Server returns `{ url: "https://..." }`
5. URL stored in hidden input
6. Form submits normally with URL value

---

## 5. Integration with Form System

### 5.1 form_persistence.js Integration

**Selectors used:**
```javascript
fileUploadUrl: '[data-file-upload="url"]',
fileUploadWrapper: '[data-file-upload="wrapper"]',
```

**Behavior:**
- File upload URLs are persisted to localStorage
- Restored on page refresh (URL only, not actual file)
- Serialized as `type: 'file-url'`

### 5.2 Form Reset Handling

```javascript
form.addEventListener('reset', function () {
  setTimeout(function () {
    pond.removeFiles();
    resetUI(wrapper);
  }, 0);
});
```

---

## 6. Complete HTML Example

### Minimal Structure

```html
<div data-file-upload="wrapper">
  <input type="file" data-file-upload="input" style="display: none;">
  <input type="hidden" data-file-upload="url" name="cv_url">
</div>
```

### Full Structure with UI

```html
<div data-file-upload="wrapper"
     data-upload-endpoint="https://r2-upload-proxy.example.workers.dev"
     data-max-size="5MB"
     data-accepted-types="application/pdf,.doc,.docx"
     data-label-idle-text="Drag & drop your file or"
     data-label-browse="Browse"
     data-label-description="Max 5 MB: PDF, DOC, DOCX"
     data-label-uploading="Uploading..."
     data-label-cancel="Click to cancel upload"
     data-label-delete="Click to delete"
     data-label-size-separator=" of "
     data-label-error-type="Invalid file type"
     data-label-error-size="File too large"
     data-label-error-dismiss="Click to dismiss"
     class="input--container">

  <!-- Hidden file input -->
  <input type="file"
         data-file-upload="input"
         accept="application/pdf,.doc,.docx"
         style="display: none;">

  <!-- IDLE VIEW -->
  <div data-file-upload="idle" class="upload--input-w">
    <div class="upload-icon"><!-- SVG --></div>
    <div>
      <span data-file-upload="text">Drag & drop your file or </span>
      <a data-file-upload="browse" href="#">Browse</a>
    </div>
    <div data-file-upload="description">Max 5 MB: PDF, DOC, DOCX</div>
  </div>

  <!-- LOADER VIEW -->
  <div data-file-upload="loader" class="upload--input-w">
    <div class="icon-container">
      <div data-file-upload="icon-upload"><!-- Upload SVG --></div>
      <div data-file-upload="icon-success"><!-- Checkmark SVG --></div>
    </div>
    <div data-file-upload="uploading">Uploading...</div>
    <div class="progress-container">
      <div data-file-upload="progress-bar" class="progress-fill"></div>
      <div data-file-upload="progress-track" class="progress-track"></div>
    </div>
    <div>
      <span data-file-upload="percentage">0%</span>
      <span data-file-upload="size">0B of 0B</span>
    </div>
    <div data-file-upload="notice">Click to cancel upload</div>
  </div>

  <!-- Hidden URL field (submitted with form) -->
  <input type="hidden" data-file-upload="url" name="cv_url">
</div>
```

---

## 7. Attribute Summary Table

### Required Attributes

| Attribute | Element | Value Type |
|-----------|---------|------------|
| `data-file-upload` | wrapper | `"wrapper"` (literal) |
| `data-file-upload` | file input | `"input"` (literal) |
| `data-file-upload` | hidden input | `"url"` (literal) |

### Configuration Attributes (all optional)

| Attribute | Default |
|-----------|---------|
| `data-upload-endpoint` | R2 worker URL |
| `data-max-size` | `5MB` |
| `data-accepted-types` | `application/pdf,.doc,.docx` |

### Label Attributes (all optional, 10 total)

| Attribute | Default |
|-----------|---------|
| `data-label-idle-text` | `Drag & drop your file or` |
| `data-label-browse` | `Browse` |
| `data-label-description` | `Max 5 MB: PDF, DOC, DOCX` |
| `data-label-uploading` | `Uploading...` |
| `data-label-cancel` | `Click to cancel upload` |
| `data-label-delete` | `Click to delete` |
| `data-label-size-separator` | ` of ` |
| `data-label-error-type` | `Invalid file type` |
| `data-label-error-size` | `File too large` |
| `data-label-error-dismiss` | `Click to dismiss` |

### Auto-Managed Attributes (do not set manually)

| Attribute | Purpose |
|-----------|---------|
| `data-filepond-init` | Prevents double initialization |
| `data-upload-state` | Current state tracking |

---

## 8. External Dependencies

### Required Scripts (in order)

```html
<!-- FilePond Plugins -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type@1.2.8/dist/filepond-plugin-file-validate-type.min.js" defer></script>
<script src="https://unpkg.com/filepond-plugin-file-validate-size@2.2.8/dist/filepond-plugin-file-validate-size.min.js" defer></script>

<!-- FilePond Core -->
<script src="https://unpkg.com/filepond@4.30.4/dist/filepond.min.js" defer></script>

<!-- Custom Connector -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_upload.js?v=1.0.0" defer></script>
```

### Required CSS

```html
<!-- FilePond CSS (for internal elements, hidden via custom CSS) -->
<link href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css" rel="stylesheet">

<!-- Custom upload CSS -->
<link href="input_upload.css" rel="stylesheet">
```

---

## 9. Key Implementation Details

### FilePond UI Hiding

FilePond's native UI is completely hidden. The connector script:
1. Creates FilePond instance invisibly
2. Manages custom Webflow UI elements
3. Bridges events between FilePond and Webflow elements

**Code Reference (lines 389-403):**
```javascript
var filepondRoot = pond.element;
if (filepondRoot) {
  filepondRoot.style.position = 'absolute';
  filepondRoot.style.width = '1px';
  filepondRoot.style.height = '1px';
  filepondRoot.style.overflow = 'hidden';
  filepondRoot.style.opacity = '0';
  filepondRoot.style.pointerEvents = 'none';
  filepondRoot.style.top = '0';
  filepondRoot.style.left = '0';
  filepondRoot.setAttribute('aria-hidden', 'true');
}
```

### Custom Drag-Drop Handling

FilePond's drag-drop is disabled; custom handling:
```javascript
// FilePond config
dropOnPage: false,
dropOnElement: false,

// Custom handlers
wrapper.addEventListener('dragenter', ...);
wrapper.addEventListener('dragleave', ...);
wrapper.addEventListener('dragover', ...);
wrapper.addEventListener('drop', function (e) {
  e.preventDefault();
  pond.addFiles(Array.from(e.dataTransfer.files));
});
```

### Public API

```javascript
// Manual initialization
window.initFilepondConnector();

// Get FilePond instance from wrapper
window.getFilepondInstance(wrapper);
```
