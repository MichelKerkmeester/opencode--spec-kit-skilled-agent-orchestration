---
title: Third-Party Library Integrations
description: Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns.
---

# Third-Party Library Integrations

Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns following code quality standards.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Reference guide for integrating external JavaScript libraries in Webflow projects.

### When to Use
- Integrating new third-party libraries
- Managing dependencies (CDN, versions)
- Handling external script loading

### Integration Principles

1. **CDN-first loading** - Use jsDelivr or unpkg for reliable delivery
2. **Version pinning** - Always pin to specific versions for stability
3. **Feature detection** - Check library availability before use
4. **Graceful fallbacks** - Handle missing/failed libraries gracefully
5. **Memory management** - Proper cleanup to prevent leaks

### Loading Pattern

```javascript
const LIBRARY_CDN_URL = 'https://cdn.jsdelivr.net/npm/library@{version}';

async function load_library() {
  if (typeof window.Library !== 'undefined') {
    return true;
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = LIBRARY_CDN_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:hls-js-video-streaming -->
## 2. HLS.JS (VIDEO STREAMING)

HTTP Live Streaming library for adaptive video playback in non-Safari browsers.

### CDN URL

```html
<!-- Preload for critical video pages -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/hls.js@{version}" as="script">

<!-- Load with defer -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@{version}" defer></script>
```

### Feature Detection

```javascript
const test_video = document.createElement('video');
const safari_native = !!test_video.canPlayType('application/vnd.apple.mpegurl');
const can_use_hls_js = !!(window.Hls && Hls.isSupported()) && !safari_native;
```

### Basic Setup

```javascript
if (safari_native) {
  video.src = hls_source_url;
  video.addEventListener('loadedmetadata', on_ready, { once: true });
} else if (can_use_hls_js) {
  const hls = new Hls({ maxBufferLength: 8 }); // Low buffer for hover videos
  hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(hls_source_url));
  hls.on(Hls.Events.MANIFEST_PARSED, on_ready);
  hls.attachMedia(video);
  player._hls = hls; // Store reference for cleanup
}
```

### Error Handling

```javascript
hls.on(Hls.Events.ERROR, function(event, data) {
  if (!data.fatal) return;
  
  switch (data.type) {
    case Hls.ErrorTypes.NETWORK_ERROR:
      console.warn('Network error, attempting recovery');
      hls.startLoad();
      break;
    case Hls.ErrorTypes.MEDIA_ERROR:
      console.warn('Media error, attempting recovery');
      hls.recoverMediaError();
      break;
    default:
      console.error('Fatal HLS error:', data);
      hls.destroy();
  }
});
```

### Cleanup Pattern

```javascript
function cleanup_hls_player(player) {
  if (player._hls) {
    try { player._hls.destroy(); } catch (_) {}
    player._hls = null;
  }
  
  const video = player.querySelector('video');
  if (video) {
    try {
      video.pause();
      video.removeAttribute('src');
      video.load();
    } catch (_) {}
  }
}
```

### When to Use

- **Use HLS.js** for:
  - Adaptive bitrate streaming (ABR)
  - Long-form video content
  - Variable network conditions
  - Quality level switching

- **Use native video** for:
  - Short clips (<30 seconds)
  - Single-quality sources
  - Safari-only deployments

### Source Files

- `src/javascript/video/video_background_hls_hover.js` - Hover player with lazy loading
- `src/javascript/video/video_background_hls.js` - Background autoplay player
- `src/javascript/video/video_player_hls.js` - Full player with controls
- `src/javascript/video/video_player_hls_scroll.js` - Scroll-triggered player

---

<!-- /ANCHOR:hls-js-video-streaming -->
<!-- ANCHOR:lenis-smooth-scroll -->
## 3. LENIS (SMOOTH SCROLL)

Smooth scroll library providing momentum-based scrolling with global accessibility.

### CDN URL

```html
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@latest"></script>
```

### Global Access Pattern

Lenis exposes a global instance at `window.lenis` for cross-script coordination:

```javascript
// Scroll to target element
if (window.lenis) {
  window.lenis.scrollTo(target_element, {
    offset: -100,
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 3)
  });
}
```

### Integration with Modals

```javascript
// Stop Lenis during modal open to prevent background scrolling
function open_modal() {
  if (window.lenis?.stop) {
    window.lenis.stop();
  }
  // ... modal open logic
}

function close_modal() {
  if (window.lenis?.start) {
    window.lenis.start();
  }
  // ... modal close logic
}
```

### Usage in Codebase

- Table of Contents smooth scrolling: `src/javascript/cms/table_of_content.js:363`
- Cookie consent modal: `src/javascript/modal/modal_cookie_consent.js:955`
- Welcome modal: `src/javascript/modal/modal_welcome.js:456`
- Form submission focus lock: `src/javascript/form/form_submission.js:178`

---

<!-- /ANCHOR:lenis-smooth-scroll -->
<!-- ANCHOR:botpoison-spam-protection -->
## 4. BOTPOISON (SPAM PROTECTION)

Invisible captcha alternative for form spam protection without user friction.

### CDN URL

```javascript
const BOTPOISON_SDK_URL = 'https://unpkg.com/@botpoison/browser';
```

### Loading Pattern

The SDK is loaded lazily on first form submission to avoid blocking page load.

```javascript
// Source: src/javascript/form/form_submission.js:47-117
let botpoison_loader = null;

async function load_botpoison_sdk() {
  if (typeof window.Botpoison !== 'undefined') {
    return true;
  }

  // Deduplicate concurrent load requests
  if (botpoison_loader) {
    return botpoison_loader;
  }

  botpoison_loader = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = BOTPOISON_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);  // Graceful degradation
    document.head.appendChild(script);
  }).then((loaded) => {
    if (!loaded) {
      botpoison_loader = null;  // Allow retry on failure
    }
    return loaded;
  });

  return botpoison_loader;
}
```

### Challenge Flow with Timeout

The challenge solving includes timeout protection and client instance caching.

```javascript
// Source: src/javascript/form/form_submission.js:119-179
const botpoison_clients = new Map();
const MAX_BOTPOISON_CLIENTS = 10;
const BOTPOISON_TIMEOUT_MS = 10000;

async function solve_botpoison_token(form) {
  // Support multiple attribute names for flexibility
  const raw_key = form.getAttribute('data-botpoison-public-key') ||
                  form.getAttribute('data-botpoison-key') ||
                  '';
  const public_key = raw_key.trim();
  if (!public_key) return null;

  const sdk_loaded = await load_botpoison_sdk();
  if (!sdk_loaded || typeof window.Botpoison === 'undefined') return null;

  // LRU-style client caching (max 10 instances)
  if (!botpoison_clients.has(public_key)) {
    if (botpoison_clients.size >= MAX_BOTPOISON_CLIENTS) {
      const first_key = botpoison_clients.keys().next().value;
      botpoison_clients.delete(first_key);
    }
    botpoison_clients.set(public_key, new window.Botpoison({ publicKey: public_key }));
  }

  const client = botpoison_clients.get(public_key);

  try {
    const challenge = client.challenge();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Botpoison timeout')), BOTPOISON_TIMEOUT_MS)
    );

    const result = await Promise.race([challenge, timeout]);
    if (!result) return null;

    const token =
      (typeof result.token === 'string' && result.token) ||
      (typeof result.solution === 'string' && result.solution) ||
      '';

    return token || null;
  } catch (error) {
    const errorMessage = error?.message || 'Unknown error';
    const errorType = errorMessage === 'Botpoison timeout' ? 'TIMEOUT' : 'ERROR';

    console.error(`[Botpoison] Verification failed (${errorType}):`, errorMessage);

    if (window.gtag) {
      window.gtag('event', 'botpoison_error', {
        error_type: errorType,
        error_message: errorMessage
      });
    }

    // Graceful degradation - form still works without bot protection
    return null;
  }
}
```

### Form Integration

```html
<!-- Attribute on form element -->
<form data-botpoison-public-key="pk_abc123..." data-formspark-url="https://submit-form.com/xxx">
  <!-- form fields -->
</form>
```

```javascript
// Source: src/javascript/form/form_submission.js:548-567
async function handle_submit(event) {
  const form_data = new FormData(this.form);

  const botpoison_key = (
    this.form.getAttribute('data-botpoison-public-key') ||
    this.form.getAttribute('data-botpoison-key') ||
    ''
  ).trim();
  const botpoison_required = botpoison_key.length > 0;

  const botpoison_token = botpoison_required
    ? await solve_botpoison_token(this.form)
    : null;

  // Fail submission if Botpoison is required but challenge failed
  if (botpoison_required && !botpoison_token) {
    throw new Error('Botpoison challenge failed');
  }

  if (botpoison_token) {
    form_data.set('_botpoison', botpoison_token);
  }

  await this.submit_with_retry(form_data);
}
```

### Error Handling Best Practices

```javascript
try {
  const token = await solve_botpoison_token(form);
  if (token) {
    form_data.set('_botpoison', token);
  }
  // Continue with submission even if token is null (graceful degradation)
} catch (error) {
  console.warn('Botpoison unavailable, continuing without bot protection');
  if (window.gtag) {
    window.gtag('event', 'botpoison_unavailable');
  }
}
```

### Source Files

- `src/javascript/form/form_submission.js:18-19` - Configuration constants
- `src/javascript/form/form_submission.js:93-117` - SDK loading
- `src/javascript/form/form_submission.js:119-179` - Token solving with timeout
- `src/javascript/form/form_submission.js:548-567` - Form integration

---

<!-- /ANCHOR:botpoison-spam-protection -->
<!-- ANCHOR:finsweet-attributes -->
## 5. FINSWEET ATTRIBUTES

Webflow enhancement library providing CMS filtering, sorting, cookie consent, and other utilities.

### CDN URLs

```html
<!-- Cookie Consent (Consent Pro) -->
<script async
  src="https://cdn.jsdelivr.net/npm/@finsweet/cookie-consent@1/fs-cc.js"
  fs-cc-mode="opt-in">
</script>

<!-- CMS Filter -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js"></script>

<!-- CMS Sort -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmssort@1/cmssort.js"></script>

<!-- CMS Load -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js"></script>
```

### Consent Pro Integration

The cookie consent modal integrates with Finsweet Consent Pro for GDPR compliance.

#### Attribute Patterns

```html
<!-- Consent form structure -->
<form fs-consent-element="form">
  <button fs-consent-element="allow">Accept All</button>
  <button fs-consent-element="deny">Reject All</button>
  <button type="submit">Save Preferences</button>
</form>

<!-- Open preferences button (can be placed anywhere) -->
<button fs-consent-element="open-preferences">Manage Cookies</button>

<!-- Close button -->
<button fs-consent-element="close">Close</button>
```

#### Consent Detection Pattern

```javascript
// Source: src/javascript/modal/modal_cookie_consent.js:800-869
function has_consent() {
  try {
    const cookies = document.cookie
      .split(';')
      .map((part) => part.trim())
      .filter((part) => part.length);

    const consentCookie = get_cookie_value(cookies, 'fs-consent');
    if (consentCookie) {
      const parsed = parse_json(consentCookie);
      if (consent_record_indicates_decision(parsed)) return true;
      return true; // Presence alone implies interaction
    }

    const consentStatus = get_cookie_value(cookies, 'fs-consent-status');
    if (consentStatus && consentStatus !== 'pending') {
      return true;
    }

    // Check for non-essential category grants (not just essential/security)
    const NON_ESSENTIAL = [
      'fs-consent-analytics_storage',
      'fs-consent-ad_storage',
      'fs-consent-ad_user_data',
      'fs-consent-ad_personalization',
      'fs-consent-personalization_storage',
    ];

    const hasNonEssentialGrant = cookies.some((cookie) => {
      const equalIndex = cookie.indexOf('=');
      if (equalIndex === -1) return false;
      const name = cookie.substring(0, equalIndex);
      const value = cookie.substring(equalIndex + 1);
      if (!NON_ESSENTIAL.includes(name)) return false;
      return value && value !== 'false' && value !== 'denied';
    });
    if (hasNonEssentialGrant) return true;

    const stored =
      window.localStorage?.getItem('fs-consent_preferences') ||
      window.localStorage?.getItem('fs-consent');
    if (stored) return true;

  } catch (_) {
    /* ignore storage access errors */
  }
  return false;
}
```

#### fsAttributes Queue Pattern

```javascript
// Source: src/javascript/modal/modal_cookie_consent.js:1233-1291
function bind_consent_status_listener() {
  // Initialize fsAttributes array if needed (works even before Consent Pro loads)
  window.fsAttributes = window.fsAttributes || [];

  // Push callback to queue - will execute when Consent Pro initializes
  window.fsAttributes.push([
    'consent',
    (consent) => {
      if (!consent || typeof consent !== 'object') return;

      const update = (reason = 'fs-consent-update') => {
        if (state.consent_resolved) return;

        if (typeof consent.status === 'string' && consent.status === 'complete') {
          handle_consent_action('fs-consent-complete');
          return;
        }
      };

      update('fs-consent-initial');

      if (typeof consent.on === 'function') {
        consent.on('change', () => update('fs-consent-change'));
        consent.on('save', () => update('fs-consent-save'));
      }
    },
  ]);
}
```

### CMS Sort Bridge Pattern

When using custom select components with Finsweet CMS Sort, a bridge is needed to sync state.

```javascript
// Source: src/javascript/form/input_select_fs_bridge.js:1-139
const FS_ATTR = 'fs-list-element';
const FS_VALUE = 'sort-trigger';

// Finsweet list-sort requires a native select to detect changes
function create_hidden_select(custom_select_instance) {
  const container = custom_select_instance.container;
  const options = custom_select_instance.options;

  const native_select = document.createElement('select');
  native_select.setAttribute(FS_ATTR, FS_VALUE);

  // Hide visually but keep accessible to Finsweet
  native_select.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    pointer-events: none;
  `;

  options.forEach((custom_opt) => {
    const native_opt = document.createElement('option');
    native_opt.value = custom_opt.dataset.value || '';
    native_opt.textContent = custom_opt.textContent.trim();
    native_select.appendChild(native_opt);
  });

  container.appendChild(native_select);

  // Remove attribute from wrapper so Finsweet only sees the native select
  container.removeAttribute(FS_ATTR);

  return native_select;
}

function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

#### Usage

```html
<!-- Custom select with Finsweet sort trigger -->
<div data-select="wrapper" fs-list-element="sort-trigger">
  <input data-select="input" readonly />
  <div data-select="dropdown">
    <div data-select="option" data-value="date-desc">Newest First</div>
    <div data-select="option" data-value="date-asc">Oldest First</div>
  </div>
</div>
```

### CMS Load/Filter Initialization

```javascript
// Source: src/html/blog.html:54
script.setAttribute("fs-list", "");

// Alternative: Hook into fsAttributes queue
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    listInstances.forEach((instance) => {
      // Custom logic after CMS items load
    });
  },
]);
```

### Integration Notes

1. **Self-initializing** - Finsweet scripts handle their own initialization
2. **Data attribute configuration** - Use `fs-*` attributes for configuration
3. **Queue pattern** - Use `window.fsAttributes.push()` for callbacks
4. **Event-driven** - Listen for `change`, `save`, `load` events via `.on()` method

### Source Files

- `src/javascript/modal/modal_cookie_consent.js` - Full Consent Pro integration (1419 lines)
- `src/javascript/form/input_select_fs_bridge.js` - CMS Sort bridge for custom selects
- `src/html/blog.html:54` - CMS List initialization example

---

<!-- /ANCHOR:finsweet-attributes -->
<!-- ANCHOR:filepond-file-upload -->
## 6. FILEPOND (FILE UPLOAD)

FilePond is a flexible file upload library with drag-and-drop and progress indicators. The connector bridges FilePond (invisible) to a Webflow-designed UI with custom state management.

### CDN URLs

```html
<!-- 1. Plugins FIRST (must load before core) -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type@1.2.8/dist/filepond-plugin-file-validate-type.min.js" defer></script>
<script src="https://unpkg.com/filepond-plugin-file-validate-size@2.2.8/dist/filepond-plugin-file-validate-size.min.js" defer></script>

<!-- 2. FilePond core SECOND -->
<script src="https://unpkg.com/filepond@4.30.4/dist/filepond.min.js" defer></script>

<!-- 3. Custom connector THIRD -->
<script src="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v={version}" defer></script>

<!-- CSS (async in <head>) -->
<link rel="preload" href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css" as="style"
     onload="this.rel='stylesheet'">
```

### Configuration

```javascript
// Source: src/2_javascript/form/input_upload.js
const SELECTORS = {
  wrapper:     '[data-file-upload="wrapper"]',
  input:       '[data-file-upload="input"]',
  url:         '[data-file-upload="url"]',
  idle:        '[data-file-upload="idle"]',
  loader:      '[data-file-upload="loader"]',
  browse:      '[data-file-upload="browse"]',
  notice:      '[data-file-upload="notice"]',
  idleText:    '[data-file-upload="text"]',
  description: '[data-file-upload="description"]',
  uploading:   '[data-file-upload="uploading"]',
  progressBar: '[data-file-upload="progress-bar"]',
  percentage:  '[data-file-upload="percentage"]',
  size:        '[data-file-upload="size"]',
};

const DEFAULTS = {
  maxSize: '5MB',
  acceptedTypes: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,application/vnd.oasis.opendocument.text,application/rtf,text/rtf',
  uploadEndpoint: 'https://worker--upload-form.lorenzo-89a.workers.dev',
};

const STATE = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  COMPLETE: 'complete',
  ERROR: 'error',
};

// Extension-to-MIME-type map for reliable file type detection
// Browsers may report incorrect MIME types for Office documents
const MIME_TYPE_MAP = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.rtf': 'application/rtf',
};
```

### Label Management (via data attributes)

Labels are configurable via `data-label-*` attributes on the wrapper element. Mobile overrides supported for idle text and browse labels.

```javascript
// Source: src/2_javascript/form/input_upload.js
const DEFAULT_LABELS = {
  // Idle state
  idleText: 'Drag & drop your file or',
  browse: 'Browse',
  description: 'Max 5 MB: PDF, DOC, DOCX, TXT, MD, ODT, RTF',
  // Uploading state
  uploading: 'Uploading...',
  cancel: 'Click to cancel upload',
  delete: 'Click to delete',
  sizeSeparator: ' of ',
  // Error state
  errorInvalidType: 'Invalid file type',
  errorMaxSize: 'File too large',
  errorUpload: 'Upload failed, please try again',
  errorDismiss: 'Click to dismiss',
};

function get_labels(wrapper) {
  var idle_text = wrapper.getAttribute('data-label-idle-text') || DEFAULT_LABELS.idleText;
  var browse = wrapper.getAttribute('data-label-browse') || DEFAULT_LABELS.browse;

  // Use mobile labels if on mobile and they exist
  if (is_mobile()) {
    idle_text = wrapper.getAttribute('data-label-idle-text-mobile') || idle_text;
    browse = wrapper.getAttribute('data-label-browse-mobile') || browse;
  }

  return {
    idleText: idle_text,
    browse: browse,
    description: wrapper.getAttribute('data-label-description') || DEFAULT_LABELS.description,
    uploading: wrapper.getAttribute('data-label-uploading') || DEFAULT_LABELS.uploading,
    cancel: wrapper.getAttribute('data-label-cancel') || DEFAULT_LABELS.cancel,
    delete: wrapper.getAttribute('data-label-delete') || DEFAULT_LABELS.delete,
    sizeSeparator: wrapper.getAttribute('data-label-size-separator') || DEFAULT_LABELS.sizeSeparator,
    errorInvalidType: wrapper.getAttribute('data-label-error-type') || DEFAULT_LABELS.errorInvalidType,
    errorMaxSize: wrapper.getAttribute('data-label-error-size') || DEFAULT_LABELS.errorMaxSize,
    errorUpload: wrapper.getAttribute('data-label-error-upload') || DEFAULT_LABELS.errorUpload,
    errorDismiss: wrapper.getAttribute('data-label-error-dismiss') || DEFAULT_LABELS.errorDismiss,
  };
}
```

### MIME Type Detection Fallback

Browsers inconsistently report MIME types for Office documents. The `detect_file_type` function provides extension-based fallback detection via FilePond's `fileValidateTypeDetectType` option.

```javascript
// Source: src/2_javascript/form/input_upload.js
function detect_file_type(source, type) {
  return new Promise(function (resolve) {
    // If browser already reports a known accepted MIME type, trust it
    var known_types = Object.values(MIME_TYPE_MAP);
    if (type && known_types.indexOf(type) !== -1) {
      resolve(type);
      return;
    }

    // Fallback: detect from file extension
    var ext = source.name ? source.name.match(/\.[^.]+$/) : null;
    if (ext && MIME_TYPE_MAP[ext[0].toLowerCase()]) {
      resolve(MIME_TYPE_MAP[ext[0].toLowerCase()]);
      return;
    }

    // No match — pass through original type
    resolve(type);
  });
}
```

### R2 Integration via Cloudflare Worker

```javascript
// Source: src/2_javascript/form/input_upload.js
function create_server_config(endpoint, wrapper, url_input) {
  return {
    process: function (_fieldName, file, _metadata, load, error, progress, abort) {
      const form_data = new FormData();
      form_data.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          progress(true, e.loaded, e.total);
          var percent = (e.loaded / e.total) * 100;
          update_ui(wrapper, { percentage: percent, loaded: e.loaded, total: e.total });
        }
      };

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var response = JSON.parse(xhr.responseText);
            if (response.error) { error(response.error); return; }
            url_input.value = response.url;
            load(response.url);
          } catch (_e) {
            error('Invalid server response');
          }
        } else {
          error('Upload failed: ' + xhr.status);
        }
      };

      xhr.onerror = function () { error('Network error - check your connection'); };
      xhr.onabort = function () { abort(); };
      xhr.send(form_data);

      return { abort: function () { xhr.abort(); abort(); } };
    },

    revert: function (_uniqueFileId, load, _error) {
      url_input.value = '';
      load();
    },
  };
}
```

### FilePond Instance Creation

```javascript
// Source: src/2_javascript/form/input_upload.js
function init_instance(wrapper) {
  var input_el = get_el(wrapper, SELECTORS.input);
  var url_input = get_el(wrapper, SELECTORS.url);

  var endpoint = wrapper.dataset.uploadEndpoint || DEFAULTS.uploadEndpoint;
  var max_size = wrapper.dataset.maxSize || DEFAULTS.maxSize;
  var accepted_types = wrapper.dataset.acceptedTypes || DEFAULTS.acceptedTypes;

  var accepted_types_array = accepted_types.split(',').map(function (t) {
    return t.replace(/\s+/g, '');
  });

  // Add extension aliases as a fallback for browsers/platforms that
  // report DOC/DOCX as generic zip/octet MIME types during selection.
  Object.keys(MIME_TYPE_MAP).forEach(function (ext) {
    if (accepted_types_array.indexOf(ext) === -1) {
      accepted_types_array.push(ext);
    }
  });

  // Keep native accept in sync with normalized FilePond configuration.
  // This prevents Webflow/editor stale values from drifting and ensures
  // extension fallbacks (.docx, etc.) are available in all browsers.
  input_el.setAttribute('accept', accepted_types_array.join(','));

  var pond = FilePond.create(input_el, {
    name: '',                    // Prevent FilePond form submission
    maxFiles: 1,
    allowMultiple: false,
    stylePanelLayout: null,      // Hide FilePond panel
    styleButtonRemoveItemPosition: 'left',
    credits: false,
    required: false,
    dropOnPage: false,           // Custom drop handling
    dropOnElement: false,

    // Validation
    acceptedFileTypes: accepted_types_array,
    fileValidateTypeDetectType: detect_file_type, // Extension-based MIME fallback
    maxFileSize: max_size,

    // Server configuration - Cloudflare R2 via Worker
    server: create_server_config(endpoint, wrapper, url_input),
  });

  // Hide FilePond's root element (custom UI handles all visuals)
  var filepond_root = pond.element;
  if (filepond_root) {
    filepond_root.style.position = 'absolute';
    filepond_root.style.width = '1px';
    filepond_root.style.height = '1px';
    filepond_root.style.overflow = 'hidden';
    filepond_root.style.opacity = '0';
    filepond_root.style.pointerEvents = 'none';
    filepond_root.setAttribute('aria-hidden', 'true');
  }

  wrapper._pond = pond;
  set_state(wrapper, STATE.IDLE);
}
```

### HTML Structure

```html
<!-- Upload Wrapper -->
<div data-file-upload="wrapper">

  <!-- Hidden inputs -->
  <input type="file" data-file-upload="input" style="display:none">
  <input type="hidden" data-file-upload="url" name="cv_url">

  <!-- IDLE View (visible by default) -->
  <div data-file-upload="idle">
    <div data-file-upload="text">Drag & drop your file or</div>
    <a href="#" data-file-upload="browse">Browse</a>
    <div data-file-upload="description">Max 5 MB: PDF, DOC, DOCX, TXT, MD, ODT, RTF</div>
  </div>

  <!-- LOADER View (hidden by default, shown during upload/complete) -->
  <div data-file-upload="loader">
    <div data-file-upload="uploading">Uploading...</div>
    <div data-file-upload="progress-bar" style="width: 0%"></div>
    <div data-file-upload="percentage">0%</div>
    <div data-file-upload="size"></div>
    <div data-file-upload="notice">Click to cancel upload</div>
  </div>

</div>
```

### State Machine

| State | CSS Class | Trigger | Exit |
|-------|-----------|---------|------|
| **IDLE** | *(none)* | Initial, file removed, error dismissed | File added |
| **UPLOADING** | `is--uploading` | `addfile` event (no error) | Upload completes or fails |
| **COMPLETE** | `is--complete` | `processfile` event | File removed |
| **ERROR** | `is--error` | `warning` event, `addfile` error | Click to dismiss |

### Plugin Registration

```javascript
// Source: src/2_javascript/form/input_upload.js
var plugins = [];
if (typeof FilePondPluginFileValidateType !== 'undefined') {
  plugins.push(FilePondPluginFileValidateType);
}
if (typeof FilePondPluginFileValidateSize !== 'undefined') {
  plugins.push(FilePondPluginFileValidateSize);
}
if (plugins.length > 0) {
  FilePond.registerPlugin.apply(FilePond, plugins);
}
```

### Public API

```javascript
// Source: src/2_javascript/form/input_upload.js
window.InputUpload = {
  init: init,                              // Re-initialize (after SPA navigation)
  cleanup: cleanupFilepondInstances,       // Cleanup all instances
  getInstance: function (wrapper) {        // Get FilePond instance from wrapper
    return wrapper._pond || null;
  },
};

// Also available as legacy globals:
window.initFilepondConnector = init;
window.getFilepondInstance = function (wrapper) { return wrapper._pond || null; };
window.cleanupFilepondInstances = function () { /* destroys all instances */ };
```

### Source Files

- `src/2_javascript/form/input_upload.js` — Full FilePond connector (948 lines)
- `src/2_javascript/z_minified/form/input_upload.min.js` — Minified CDN version
- See **[form_upload_workflows.md](./form_upload_workflows.md)** for complete architecture reference, including:
  - Full pipeline: browser → FilePond → Worker → R2 → Formspark
  - Upload URL validation guards (connector-level and form-level)
  - Extension alias fallback mechanism
  - Validation error mapping for wording variants
  - R2 bucket configuration (separate buckets for user files vs. project assets)
  - MIME type detection and browser compatibility notes

---

<!-- /ANCHOR:filepond-file-upload -->
<!-- ANCHOR:best-practices -->
## 7. BEST PRACTICES

### CDN Loading Pattern

```javascript
// ✅ Good: Version pinned, async, error handled
const CDN_URL = 'https://cdn.jsdelivr.net/npm/library@{version}';

async function load_with_timeout(url, timeout_ms = 10000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeout_ms);
    
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => { clearTimeout(timer); resolve(true); };
    script.onerror = () => { clearTimeout(timer); resolve(false); };
    document.head.appendChild(script);
  });
}

// ❌ Bad: No version, no error handling
document.write('<script src="https://cdn.example.com/lib.js"></script>');
```

### Version Pinning

```javascript
// ✅ Pinned to specific version (check HTML source for current versions)
'https://cdn.jsdelivr.net/npm/hls.js@{major.minor.patch}'

// ✅ Pinned to specific minor version
'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@{major.minor}'

// ❌ Avoid: Latest tag can break unexpectedly
'https://cdn.jsdelivr.net/npm/library@latest'

// ❌ Avoid: Unpinned versions
'https://cdn.jsdelivr.net/npm/library'
```

### Fallback Strategies

```javascript
// Pattern: Retry loader for race conditions
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 120;
let retry_count = 0;

function init_with_library() {
  if (typeof Library === 'undefined') {
    if (++retry_count < MAX_RETRIES) {
      console.warn(`Library not ready, retry ${retry_count}/${MAX_RETRIES}`);
      setTimeout(init_with_library, RETRY_DELAY_MS);
      return;
    }
    console.error('Library failed to load');
    return;
  }
  
  retry_count = 0;
  // ... initialization code
}
```

### Error Boundaries

```javascript
// Wrap third-party calls in try-catch
function safe_library_call(action) {
  try {
    return action();
  } catch (error) {
    console.warn('Library error:', error);
    return null;
  }
}

// Usage
safe_library_call(() => {
  window.lenis?.scrollTo(target);
});
```

### Preload Critical Libraries

```html
<!-- In <head> for critical path libraries -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/hls.js@{version}" as="script">

<!-- Then load with defer in body -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@{version}" defer></script>
```

### Cleanup on Destroy

```javascript
// Always provide cleanup for dynamically loaded libraries
function destroy_player(player) {
  // 1. Stop any pending operations
  if (player._abort_controller) {
    player._abort_controller.abort();
  }
  
  // 2. Remove event listeners
  if (player._cleanup_handlers) {
    player._cleanup_handlers.forEach(fn => fn());
  }
  
  // 3. Destroy library instances
  if (player._hls) {
    try { player._hls.destroy(); } catch (_) {}
    player._hls = null;
  }
  
  // 4. Clear element references
  player._video = null;
  player._container = null;
}
```

---

<!-- /ANCHOR:best-practices -->
<!-- ANCHOR:library-summary -->
## 8. LIBRARY SUMMARY

| Library | CDN | Version | Purpose |
|---------|-----|---------|---------|
| HLS.js | jsdelivr | 1.6.11 | Adaptive video streaming |
| Lenis | jsdelivr | latest | Smooth scrolling |
| Botpoison | unpkg | latest | Form spam protection |
| Finsweet | jsdelivr | 1.x | Webflow enhancements (CMS, consent) |
| FilePond | unpkg | latest | File upload with R2 integration |

---

<!-- /ANCHOR:library-summary -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Reference Files
- [code_quality_standards.md](../standards/code_quality_standards.md) - CDN-safe initialization pattern for all library integrations
- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting patterns for library loading
- [performance_patterns.md](./performance_patterns.md) - Lazy loading and code splitting strategies
<!-- /ANCHOR:related-resources -->
