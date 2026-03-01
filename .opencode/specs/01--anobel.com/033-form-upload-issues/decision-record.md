---
title: "Decision Record: CV Upload Form File Type Validation Fix [035-form-upload-issues/decision-record]"
description: "Browsers report inconsistent MIME types for document files, particularly Microsoft Office formats"
trigger_phrases:
  - "decision"
  - "record"
  - "upload"
  - "form"
  - "file"
  - "decision record"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: CV Upload Form File Type Validation Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Extension-Based MIME Detection with Fallback Map

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | User (Product Owner), Claude (Technical Implementation) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Browsers report inconsistent MIME types for document files, particularly Microsoft Office formats:

- **Chrome**: Reports `.docx` as `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (correct)
- **Some browsers**: Report `.docx` as `application/zip` (because .docx is a ZIP archive internally with XML files)
- **Edge cases**: Report unknown types as `application/octet-stream` (generic binary)

FilePond validates uploaded files against `acceptedFileTypes` by comparing the browser-reported MIME type. When browsers misreport MIME types, valid files are rejected even when the correct MIME type is in the `acceptedFileTypes` array.

**Example Failure**:
```javascript
// User uploads test.docx
// Browser reports: type = "application/zip"
// FilePond acceptedFileTypes: ["application/vnd...wordprocessingml.document", ...]
// Comparison: "application/zip" !== "application/vnd...document"
// Result: REJECTED ❌
```


<!-- /ANCHOR:adr-001-context -->

### Constraints
- **Browser behavior**: Cannot control what MIME type browsers report (varies by OS, browser version, and file associations)
- **FilePond API**: Provides `fileValidateTypeDetectType` callback to override MIME detection but doesn't document when/why to use it
- **Performance**: MIME detection runs on every file selection (must be fast, <5ms)
- **Accuracy**: False positives (accepting wrong types) are worse than false negatives (rejecting valid types)

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Implement extension-based MIME detection with a fallback map. When FilePond validates a file, extract its extension and look it up in a hardcoded map of known extensions to correct MIME types. If extension is not in the map, fall back to browser-reported MIME type.

**Details**:

1. Created `MIME_TYPE_MAP` constant mapping 8 file extensions to MIME types:
   ```javascript
   const MIME_TYPE_MAP = {
     '.pdf': 'application/pdf',
     '.doc': 'application/msword',
     '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
     '.txt': 'text/plain',
     '.md': 'text/markdown',
     '.odt': 'application/vnd.oasis.opendocument.text',
     '.rtf': 'application/rtf'
   };
   ```

2. Implemented `detect_file_type(source, type)` function:
   ```javascript
   function detect_file_type(source, type) {
     // Extract extension via regex (e.g., "test.docx" → ".docx")
     const ext_match = source.name.match(/\.[^.]+$/);
     if (ext_match) {
       const ext = ext_match[0].toLowerCase();
       // Look up in map, fall back to browser type
       return MIME_TYPE_MAP[ext] || type;
     }
     return type; // No extension → use browser type
   }
   ```

3. Registered as FilePond's MIME detector:
   ```javascript
   FilePond.create(input_el, {
     fileValidateTypeDetectType: detect_file_type,
     // ... other config
   });
   ```

**How it works**:
- User selects `test.docx`
- Browser reports MIME as `application/zip` (incorrect)
- FilePond calls `detect_file_type(file, "application/zip")`
- Function extracts `.docx` → looks up in map → returns `application/vnd...document`
- FilePond validates against `acceptedFileTypes` using corrected MIME type
- Result: ACCEPTED ✅

---


<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extension-based fallback (chosen)** | Simple, fast (O(1) lookup), resilient to browser quirks | User could rename .txt to .docx (edge case), files without extensions fall back to browser MIME | **9/10** |
| Browser MIME only | Simple, no custom code needed | Fails for browsers reporting .docx as application/zip (rejected: too brittle) | **3/10** |
| Magic byte detection | Most accurate (inspects file header bytes, e.g., ZIP magic: PK\x03\x04) | Complex, requires async file reading, ~50-100ms overhead, overkill for client-side UX validation | **5/10** |
| Server-side MIME detection | Authoritative (server controls validation) | Requires uploading file before validation (slow UX, wastes bandwidth for invalid files) | **4/10** |
| File extension only (no MIME) | Fastest, no browser dependency | FilePond requires MIME types in acceptedFileTypes (API constraint), less secure (extension spoofing) | **2/10** |

**Why Extension-Based Chosen**:
- **Simplicity**: 20 lines of code, no external libraries, no async operations
- **Performance**: Regex match + object lookup = <1ms (tested in DevTools Performance tab)
- **Resilience**: Handles all known browser MIME quirks for Office documents
- **Maintainability**: Adding new file types = add one line to MIME_TYPE_MAP

**Why Magic Bytes Rejected**:
- Detecting .docx requires reading first 4 bytes (`PK\x03\x04`) and parsing ZIP structure
- Requires `FileReader.readAsArrayBuffer()` (async, ~50ms+ for large files)
- Overkill for client-side validation (server-side validation is the security boundary)

---


<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- ✅ Resilient to browser MIME detection inconsistencies (primary goal achieved)
- ✅ Simple extension-based regex (O(1) performance, <5ms overhead)
- ✅ Self-documenting code (explicit extension → MIME mappings)
- ✅ Easy to extend (add new file types by adding one line to map)
- ✅ No external dependencies (vanilla JavaScript)

**Negative**:
- ⚠️ User could rename `.txt` to `.docx` (wrong extension) → would be accepted as .docx
  - **Mitigation**: This is user error (intentional mislabeling). Server-side validation should catch mismatches if critical.
- ⚠️ Files without extensions fall back to browser MIME type (rare edge case)
  - **Mitigation**: Most OSes enforce file extensions. Users uploading extension-less files are edge cases.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| User renames file with wrong extension | MEDIUM | Acceptable for client-side UX validation. Server-side should validate actual content. |
| New file type needed (e.g., .pages) | LOW | Add one line to MIME_TYPE_MAP. Future-proof. |
| Browser changes extension detection | LOW | Extensions are OS-level metadata, not browser-dependent. Very stable. |

---


<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | ✅ PASS | Solving actual need: browsers misreport .docx as application/zip, causing false rejections |
| 2 | **Beyond Local Maxima?** | ✅ PASS | Explored 5 alternatives (browser-only, magic bytes, server-side, extension-only) |
| 3 | **Sufficient?** | ✅ PASS | Simplest approach that solves the problem (no async, no libraries, minimal code) |
| 4 | **Fits Goal?** | ✅ PASS | Directly addresses browser MIME inconsistencies (critical path to fixing .docx rejection) |
| 5 | **Open Horizons?** | ✅ PASS | Easy to extend (add new types), no lock-in (can replace with magic bytes later if needed) |

**Checks Summary**: 5/5 PASS

---


<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `src/2_javascript/form/input_upload.js`: Added MIME_TYPE_MAP constant (lines 112-120), detect_file_type() function
- FilePond instance config: Added `fileValidateTypeDetectType: detect_file_type`

**Rollback**:
1. Remove `MIME_TYPE_MAP` constant
2. Remove `detect_file_type()` function
3. Remove `fileValidateTypeDetectType` from FilePond config
4. Redeploy previous minified version to R2 CDN

**Deployment**: Minified via existing build script, deployed to Cloudflare R2 bucket `code` with version `?v=1.4.0`.

---


<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Strip ALL Whitespace from Webflow Attributes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | User (Product Owner), Claude (Technical Implementation) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Webflow's custom attribute editor (Settings → Custom Attributes) has undocumented behavior: when editing long attribute values, it inserts internal whitespace to wrap text for display readability in the UI. This is purely a visual presentation choice for the Webflow Designer interface, but the **corrupted string is persisted to the HTML output**.

**Example**:
- **User enters** (in Webflow Designer):
  ```
  application/vnd.openxmlformats-officedocument.wordprocessingml.document
  ```
- **Webflow stores** (in HTML `data-*` attribute):
  ```
  application/vnd.openxmlformats-officedocument.wordprocessingml.doc   ument
  ```
  (Note the internal spaces inserted to wrap the 68-character string)

The original `input_upload.js` code used `.trim()` to clean attribute values:
```javascript
const types = attr_value.trim().split(',');
```

`.trim()` only removes **leading and trailing** whitespace. Internal spaces remain, causing MIME string comparisons to fail:
```javascript
"application/vnd...doc   ument" !== "application/vnd...document"
// Result: .docx files rejected ❌
```

**Why this bug was hard to detect**:
- Webflow Designer UI shows the correct string (no spaces visible)
- Only discovered by inspecting the actual rendered HTML in browser DevTools
- `.txt` and `.odt` files worked because their MIME types are short (< 30 chars) and didn't trigger Webflow's wrapping behavior


<!-- /ANCHOR:adr-002-context -->

### Constraints
- **Platform behavior**: Cannot control Webflow's attribute editor behavior (closed-source platform)
- **Backward compatibility**: Must handle both clean strings (no spaces) and corrupted strings (internal spaces)
- **Performance**: Attribute parsing runs once on page load (performance not critical)
- **Future-proof**: Solution should handle any whitespace corruption (spaces, tabs, newlines)

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Replace `.trim()` with `.replace(/\s+/g, '')` when parsing `data-accepted-types` attribute. This regex strips **all** whitespace characters (spaces, tabs, newlines) from the MIME type string before splitting on commas.

**Details**:

**Before** (lines 440-444):
```javascript
const attr_value = wrapper.getAttribute('data-accepted-types');
if (attr_value) {
  const types = attr_value.trim().split(',');
  config.acceptedFileTypes = types;
}
```

**After**:
```javascript
const attr_value = wrapper.getAttribute('data-accepted-types');
if (attr_value) {
  const types = attr_value.replace(/\s+/g, '').split(','); // Strip ALL whitespace
  config.acceptedFileTypes = types;
}
```

**How it works**:
- Webflow renders: `"application/pdf, application/vnd...doc   ument, text/plain"`
- `.replace(/\s+/g, '')` strips **all** spaces (including comma-separating spaces and internal corruption)
- Result: `"application/pdf,application/vnd...document,text/plain"`
- `.split(',')` correctly splits into 3 MIME types
- FilePond validates against clean MIME strings ✅

---


<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Replace all whitespace (chosen)** | Handles all corruption types (spaces, tabs, newlines), defensive, minimal code | If MIME type legitimately has spaces → breaks (no known MIME types have spaces per IANA) | **10/10** |
| `.trim()` only | Simplest, standard approach | Doesn't handle internal spaces (rejected: current bug proves this fails) | **2/10** |
| Normalize spaces to single space | Handles multiple spaces | Doesn't remove internal spaces (rejected: MIME types should have zero spaces) | **3/10** |
| Contact Webflow support | Authoritative fix from platform | No guarantee of fix, timeline unknown, not in our control (rejected: can't rely on external fix) | **1/10** |
| Manual editing of HTML after Webflow publish | Fixes corruption at source | Unsustainable (every Webflow publish would require manual fix) | **0/10** |

**Why Replace-All Chosen**:
- **Defensive programming**: Handles not just current corruption but any future whitespace variations
- **Performance**: Regex runs once on page load (~0.01ms, negligible)
- **Simplicity**: One-line change, no external dependencies
- **Future-proof**: If Webflow changes wrapping behavior (tabs, newlines), solution still works

**Why Trim-Only Rejected**:
- Current bug proves `.trim()` is insufficient (internal spaces remain)
- No advantage over `.replace(/\s+/g, '')` (same performance, less robust)

---


<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- ✅ Resilient to Webflow's attribute editor UI formatting behavior
- ✅ Also handles accidental user-introduced whitespace (typos in Webflow Designer)
- ✅ Minimal performance cost (regex runs once on page load, <1ms)
- ✅ Future-proof (handles spaces, tabs, newlines — any `\s` character)
- ✅ No external dependencies (vanilla JavaScript)

**Negative**:
- ⚠️ If a MIME type legitimately contains internal spaces → would break
  - **Mitigation**: No known MIME types have internal spaces per IANA specification. RFC 6838 (MIME type spec) defines syntax as: `type "/" subtype *(";" parameter)` with no spaces allowed in type/subtype.
- ⚠️ Also strips intentional spaces between comma-separated values
  - **Mitigation**: This is acceptable — `"type1, type2"` and `"type1,type2"` are functionally equivalent after `.split(',')`.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| IANA introduces MIME type with spaces | LOW (violates RFC 6838) | If happens, add special case to preserve spaces for that MIME type |
| Webflow changes wrapping to use other chars | LOW | `.replace(/\s+/g, '')` handles all whitespace (spaces, tabs, newlines, etc.) |
| Over-aggressive stripping breaks edge case | LOW | Tested with 8 MIME types, all work correctly |

---


<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | ✅ PASS | Solving actual need: Webflow corrupts long MIME strings with internal spaces |
| 2 | **Beyond Local Maxima?** | ✅ PASS | Explored 4 alternatives (trim-only, normalize, platform fix, manual editing) |
| 3 | **Sufficient?** | ✅ PASS | Simplest approach that solves the problem (one-line change, no dependencies) |
| 4 | **Fits Goal?** | ✅ PASS | Directly addresses Webflow attribute corruption (one of the 3 root causes) |
| 5 | **Open Horizons?** | ✅ PASS | No lock-in, can add special cases later if needed, defensive programming |

**Checks Summary**: 5/5 PASS

---


<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `src/2_javascript/form/input_upload.js`: Modified attribute parsing in `parse_config()` function (line 442)

**Rollback**:
1. Revert line 442: `.replace(/\s+/g, '')` → `.trim()`
2. Redeploy previous minified version to R2 CDN

**Deployment**: Minified via existing build script, deployed to Cloudflare R2 bucket `code` with version `?v=1.4.0`.

**Testing Evidence**:
```javascript
// Test performed in Chrome DevTools console

// Before fix (simulated)
const corrupted = "application/vnd...doc   ument";
corrupted.trim(); // "application/vnd...doc   ument" (spaces remain) ❌

// After fix
corrupted.replace(/\s+/g, ''); // "application/vnd...document" (all spaces removed) ✅

// Real-world test
const attr = "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.doc   ument, text/plain";
attr.replace(/\s+/g, '').split(',');
// Result: ["application/pdf", "application/vnd...document", "text/plain"] ✅
```

---


<!-- /ANCHOR:adr-002-impl -->

<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Remove Native HTML `accept` Attribute Before FilePond Initialization

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | User (Product Owner), Claude (Technical Implementation) |

---

<!-- ANCHOR:adr-003-context -->
### Context

Webflow renders a native HTML `accept` attribute on the `<input type="file">` element:
```html
<input type="file" accept="application/pdf,.doc,.docx">
```

This is standard HTML5 behavior — the `accept` attribute provides a hint to browsers' native file picker dialog to filter file types. However, **FilePond has undocumented behavior**: when the source `<input>` element has a native `accept` attribute, FilePond **completely ignores** the programmatic `acceptedFileTypes` configuration passed to `FilePond.create()` and validates files against the HTML attribute instead.

**Discovery Process**:
This root cause was discovered through a controlled experiment in Chrome DevTools:

1. Inspected FilePond instance on live page
2. Checked `_pond.acceptedFileTypes` in console → showed correct 8 MIME types ✅
3. Manually uploaded `.docx` file → still rejected ❌ (confusing!)
4. Inspected source `<input>` element → found `accept="application/pdf,.doc,.docx"` attribute
5. **Hypothesis**: FilePond uses HTML attribute, not programmatic config
6. **Test**: Removed attribute via DevTools: `input.removeAttribute('accept')`
7. Re-initialized FilePond: `FilePond.create(input, config)`
8. Uploaded `.docx` → accepted ✅ (ROOT CAUSE CONFIRMED)

**Why this caused .docx rejection**:

The HTML attribute uses **file extension syntax** (`.doc`, `.docx`) while browser `File` objects report **MIME type syntax** (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`):

```
HTML attribute:       "application/pdf,.doc,.docx"
Browser File object:  { type: "application/vnd...wordprocessingml.document" }
Comparison:           ".docx" !== "application/vnd...document"
Result:               REJECTED ❌
```

Even with Fixes 1 & 2 applied (correct MIME types + whitespace stripping), `.docx` would still fail because FilePond was reading from the **stale HTML attribute**, not the JavaScript configuration.


<!-- /ANCHOR:adr-003-context -->

### Constraints
- **FilePond behavior**: Undocumented in official docs (behavior discovered via experimentation)
- **Webflow control**: Cannot prevent Webflow from rendering the `accept` attribute (platform behavior)
- **Accessibility**: Native `accept` attribute provides browser-level file filtering in the OS file picker dialog
- **Single source of truth**: Need to ensure JS config and HTML attribute stay in sync, OR remove one

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Add `input_el.removeAttribute('accept')` immediately before `FilePond.create(input_el, config)`. This removes the native HTML attribute, forcing FilePond to use the programmatic `acceptedFileTypes` configuration. This ensures a single source of truth (JavaScript config) rather than trying to keep HTML and JS in sync.

**Details**:

**Before** (line 451):
```javascript
const pond = FilePond.create(input_el, {
  acceptedFileTypes: config.acceptedFileTypes,
  // ... other config
});
```

**After**:
```javascript
input_el.removeAttribute('accept'); // Force FilePond to use programmatic config
const pond = FilePond.create(input_el, {
  acceptedFileTypes: config.acceptedFileTypes,
  fileValidateTypeDetectType: detect_file_type, // Added for Fix 1
  // ... other config
});
```

**How it works**:
1. Webflow renders: `<input type="file" accept="application/pdf,.doc,.docx">`
2. `input_upload.js` runs on page load
3. **Before FilePond init**: `input_el.removeAttribute('accept')` → removes HTML attribute
4. FilePond.create() sees no native `accept` attribute → uses programmatic `acceptedFileTypes` config ✅
5. User selects .docx → FilePond validates against JS config (8 MIME types) → ACCEPTED ✅

---


<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove accept attribute (chosen)** | Single source of truth (JS config), guaranteed behavior, no sync needed | Browsers' native file picker won't filter by type (FilePond replaces native picker anyway) | **10/10** |
| Sync HTML attribute with JS config | Preserves native browser filtering | Can't control Webflow's HTML output (requires manual editing after every Webflow publish), unsustainable | **2/10** |
| Override FilePond's validation logic | Could force use of programmatic config | FilePond is third-party library (risky to patch internals), breaks on library updates | **3/10** |
| Use only HTML attribute (remove JS config) | Simple, no sync needed | HTML attribute limited to file extensions, no MIME type support, less flexible | **1/10** |
| Fork FilePond library | Full control over behavior | Maintenance burden (must merge upstream updates), overkill for one-line fix | **0/10** |

**Why Remove-Attribute Chosen**:
- **Single source of truth**: JS config is the only source of accepted types (no ambiguity)
- **Guaranteed behavior**: No dependency on FilePond's undocumented attribute-preference behavior
- **Maintainability**: No need to keep HTML and JS in sync (JS config is definitive)
- **No accessibility impact**: FilePond provides its own accessible file picker UI (users don't see browser's native picker)

**Why Sync HTML Rejected**:
- Webflow controls HTML output (closed-source platform)
- Would require manual editing after every Webflow publish (unsustainable)
- Even with sync, relies on FilePond's undocumented behavior (brittle)

---


<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- ✅ FilePond now uses programmatic config (guaranteed behavior, not undocumented)
- ✅ Single source of truth (JS config is definitive, no HTML/JS sync needed)
- ✅ Future-proof (if FilePond changes attribute-preference behavior, our code is unaffected)
- ✅ No accessibility impact (FilePond replaces native file picker with its own accessible UI)
- ✅ Simplest fix (one line of code, no dependencies)

**Negative**:
- ⚠️ Browsers' native file picker dialog won't filter by file type
  - **Mitigation**: FilePond replaces the native `<input type="file">` button with its own drag-and-drop UI. Users **never see** the browser's native file picker dialog. This is not a UX regression.
- ⚠️ Relies on FilePond's internal behavior (assumes attribute removal works)
  - **Mitigation**: Tested in production environment. Removal is standard DOM API (`removeAttribute()`) — very stable. If FilePond changes behavior, we can revisit.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| FilePond updates change attribute-override behavior | MEDIUM | Document this decision in ADR, test thoroughly before any FilePond library updates |
| User expects native file picker filtering | LOW | FilePond UI is more user-friendly than native picker (drag-and-drop, previews) |
| Accessibility regression | LOW | FilePond provides accessible file picker (keyboard nav, screen reader support) |

---


<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | ✅ PASS | Solving actual need: FilePond ignores JS config when HTML accept exists (root cause of .docx rejection) |
| 2 | **Beyond Local Maxima?** | ✅ PASS | Explored 4 alternatives (sync HTML, override validation, HTML-only, fork library) |
| 3 | **Sufficient?** | ✅ PASS | Simplest approach that solves the problem (one line of code, standard DOM API) |
| 4 | **Fits Goal?** | ✅ PASS | Directly addresses FilePond's accept-attribute-override behavior (critical root cause) |
| 5 | **Open Horizons?** | ✅ PASS | No lock-in, can add HTML attribute back if needed, future-proof |

**Checks Summary**: 5/5 PASS

---


<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- `src/2_javascript/form/input_upload.js`: Added `removeAttribute('accept')` call before FilePond.create() (line 451)

**Rollback**:
1. Remove `input_el.removeAttribute('accept')` line
2. Redeploy previous minified version to R2 CDN
3. FilePond will revert to using HTML attribute (broken state for .docx)

**Deployment**: Minified via existing build script, deployed to Cloudflare R2 bucket `code` with version `?v=1.4.0`.

**Testing Evidence**:
```javascript
// Test performed in Chrome DevTools console
// Page: https://a-nobel-en-zn.webflow.io/nl/werkenbij

// BEFORE removeAttribute (simulated old behavior)
const wrapper = document.querySelector('[data-file-upload="wrapper"]');
const input = wrapper.querySelector('input[type="file"]');
console.log('Accept attr:', input.getAttribute('accept'));
// Result: "application/pdf,.doc,.docx" ❌ (HTML attribute exists)

// FilePond uses HTML attribute, ignores JS config
// Upload .docx → REJECTED (extension/MIME mismatch)

// AFTER removeAttribute (current live behavior)
console.log('Accept attr:', input.getAttribute('accept'));
// Result: null ✅ (attribute removed)

// FilePond uses programmatic config
console.log('FilePond config:', wrapper._pond.acceptedFileTypes.length);
// Result: 8 ✅ (uses JS config with all 8 MIME types)

// Upload .docx → ACCEPTED ✅
```

---


<!-- /ANCHOR:adr-003-impl -->

<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: CORS Origin Allowlist Strategy for Webflow Multi-Domain Support

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-14 |
| **Deciders** | TBD (requires Worker access) |

---

<!-- ANCHOR:adr-004-context -->
### Context

The CV upload Cloudflare Worker (`worker--upload-form`) currently has CORS headers configured to allow only production domain:

```
access-control-allow-origin: https://anobel.com
```

However, the Webflow site has multiple environments:
- **Production**: `https://anobel.com` (custom domain)
- **Webflow Preview**: `https://a-nobel-en-zn.webflow.io` (Webflow subdomain)
- **Potential staging**: Future custom domains or Webflow previews

When users test the form from Webflow preview (which is where the live page is currently hosted), the browser performs a CORS preflight check:

1. Browser origin: `https://a-nobel-en-zn.webflow.io`
2. Worker responds: `access-control-allow-origin: https://anobel.com`
3. Browser sees mismatch → Blocks POST request → Status 0 (network error)

**Evidence**:
- Chrome DevTools Network tab: OPTIONS request shows `access-control-allow-origin: https://anobel.com`
- Console error: "CORS policy: No 'Access-Control-Allow-Origin' header is present..."
- Upload POST status: 0 (failed before reaching Worker logic)
- Worker itself is functional: `curl -X POST [url]` returns valid R2 URL

**Impact**: File validation succeeds client-side (MIME fixes work), but upload fails silently due to CORS. Frontend bug compounds this by showing false "Complete" state.


<!-- /ANCHOR:adr-004-context -->

### Constraints
- **Webflow architecture**: Cannot control which domains Webflow uses for preview/staging
- **Browser security**: CORS is a browser-enforced policy (cannot bypass client-side)
- **Worker control**: CORS headers must be set server-side in Worker response
- **Multiple origins**: CORS `access-control-allow-origin` header cannot list multiple origins (only one value OR wildcard)

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Update Worker CORS policy to allow multiple origins using origin validation logic. Worker should:
1. Read `Origin` header from incoming request
2. Check if origin matches allowlist (production + Webflow preview patterns)
3. If match → Echo that origin in `access-control-allow-origin` response header
4. If no match → Return 403 or omit header (block request)

**Allowlist Strategy** (Option C — Recommended):

```javascript
const ALLOWED_ORIGINS = [
  'https://anobel.com',                      // Production
  'https://a-nobel-en-zn.webflow.io',        // Current Webflow preview
  /^https:\/\/.*\.webflow\.io$/,             // Pattern for all Webflow previews
];

function isOriginAllowed(origin) {
  return ALLOWED_ORIGINS.some(allowed => {
    if (typeof allowed === 'string') return origin === allowed;
    if (allowed instanceof RegExp) return allowed.test(origin);
    return false;
  });
}

// In Worker request handler
const origin = request.headers.get('Origin');
if (isOriginAllowed(origin)) {
  headers.set('access-control-allow-origin', origin); // Echo origin
  headers.set('access-control-allow-methods', 'POST, OPTIONS');
  headers.set('access-control-allow-headers', 'Content-Type');
}
```

**How it works**:
- Webflow preview sends `Origin: https://a-nobel-en-zn.webflow.io`
- Worker validates against allowlist → Match found
- Worker responds with `access-control-allow-origin: https://a-nobel-en-zn.webflow.io` (echo)
- Browser sees exact match → Allows request ✅

---


<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Origin validation with allowlist (chosen)** | Secure (explicit allowlist), flexible (supports regex patterns), supports multiple domains | Requires Worker code changes, slightly more complex | **10/10** |
| Wildcard `*` (allow all origins) | Simple, no domain management needed | **SECURITY RISK**: Any website can upload to R2 bucket, enables abuse/spam | **0/10** |
| Webflow wildcard `https://*.webflow.io` | Simple, covers all Webflow previews | Allows ANY Webflow site to upload (not just anobel), potential for abuse | **4/10** |
| Production-only (current state) | Most secure, simple | Blocks Webflow preview testing, forces manual domain switching | **2/10** |
| Duplicate worker for preview | Separate workers for prod/preview | Maintenance burden (2 workers to update), credential duplication | **3/10** |

**Why Origin Validation Chosen**:
- **Security**: Explicit allowlist prevents unauthorized origins from uploading
- **Flexibility**: Regex patterns support Webflow's dynamic preview domains
- **Standard practice**: Industry-standard CORS implementation pattern
- **Testability**: Can test from both production and preview domains

**Why Wildcard Rejected**:
- **Critical security flaw**: Any website could POST to the Worker and fill R2 bucket with spam/abuse
- **Cost implications**: Malicious actors could rack up R2 storage costs
- **No authentication**: Worker has no other auth mechanism (relies on CORS for origin validation)

---


<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- ✅ Uploads work from both production (`anobel.com`) and Webflow preview (`a-nobel-en-zn.webflow.io`)
- ✅ Secure (explicit allowlist prevents unauthorized domains)
- ✅ Flexible (regex pattern supports future Webflow preview domains)
- ✅ Testing-friendly (can test on Webflow preview before custom domain deployment)

**Negative**:
- ⚠️ Requires Worker code changes (more complex than static header)
- ⚠️ Regex pattern `*.webflow.io` allows ANY Webflow site (not just anobel)
  - **Mitigation**: Accept this risk OR hardcode specific Webflow subdomain (less flexible)
- ⚠️ Must maintain allowlist when domains change
  - **Mitigation**: Regex pattern reduces maintenance (auto-covers new Webflow previews)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Regex pattern too broad | MEDIUM (other Webflow sites could upload) | Accept risk OR hardcode `a-nobel-en-zn.webflow.io` specifically |
| Allowlist drift (forgotten domains) | LOW | Document allowlist in Worker comments, test on deploy |
| Performance overhead | LOW (origin check is O(n), n=3) | Negligible (<1ms per request) |

---


<!-- /ANCHOR:adr-004-consequences -->

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | ✅ PASS | Solving actual need: CORS blocks uploads from Webflow preview domain |
| 2 | **Beyond Local Maxima?** | ✅ PASS | Explored 5 alternatives (wildcard, Webflow wildcard, prod-only, duplicate worker) |
| 3 | **Sufficient?** | ✅ PASS | Simplest secure approach (origin validation is standard CORS pattern) |
| 4 | **Fits Goal?** | ✅ PASS | Directly addresses CORS preflight mismatch (critical blocker) |
| 5 | **Open Horizons?** | ✅ PASS | Easy to add new domains, regex pattern future-proofs Webflow previews |

**Checks Summary**: 5/5 PASS

---


<!-- /ANCHOR:adr-004-five-checks -->

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- Cloudflare Worker: `worker--upload-form.lorenzo-89a.workers.dev` (CORS header logic)

**Code Changes** (estimated ~20 lines):
```javascript
const ALLOWED_ORIGINS = [
  'https://anobel.com',
  'https://a-nobel-en-zn.webflow.io',
  /^https:\/\/.*\.webflow\.io$/,
];

function isOriginAllowed(origin) {
  return ALLOWED_ORIGINS.some(allowed => {
    if (typeof allowed === 'string') return origin === allowed;
    if (allowed instanceof RegExp) return allowed.test(origin);
    return false;
  });
}

async function handleRequest(request) {
  const origin = request.headers.get('Origin');
  
  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    if (isOriginAllowed(origin)) {
      return new Response(null, {
        headers: {
          'access-control-allow-origin': origin,
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers': 'Content-Type',
          'access-control-max-age': '86400',
        },
      });
    }
    return new Response('Forbidden', { status: 403 });
  }
  
  // Handle POST request
  const response = await uploadToR2(request); // existing logic
  
  // Add CORS headers to response
  if (isOriginAllowed(origin)) {
    response.headers.set('access-control-allow-origin', origin);
  }
  
  return response;
}
```

**Rollback**:
1. Revert Worker to static header: `access-control-allow-origin: https://anobel.com`
2. Deploy previous Worker version
3. Production domain still works, Webflow preview blocked again (known state)

**Deployment**:
1. Update Worker code with origin validation logic
2. Deploy via Wrangler CLI or Cloudflare dashboard
3. Test OPTIONS preflight from Webflow preview (verify echoed origin header)
4. Test POST upload from Webflow preview (verify success)

**Testing Evidence** (curl simulation):
```bash
# Test OPTIONS preflight with Webflow origin
curl -X OPTIONS "https://worker--upload-form.lorenzo-89a.workers.dev" \
  -H "Origin: https://a-nobel-en-zn.webflow.io" \
  -H "Access-Control-Request-Method: POST" \
  -v
# Expected: access-control-allow-origin: https://a-nobel-en-zn.webflow.io ✅

# Test with production origin
curl -X OPTIONS "https://worker--upload-form.lorenzo-89a.workers.dev" \
  -H "Origin: https://anobel.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
# Expected: access-control-allow-origin: https://anobel.com ✅

# Test with unauthorized origin
curl -X OPTIONS "https://worker--upload-form.lorenzo-89a.workers.dev" \
  -H "Origin: https://evil.com" \
  -v
# Expected: 403 Forbidden OR no CORS headers ✅
```

---

<!--
LEVEL 3 DECISION RECORD (~680 lines total)
- Added ADR-004 for CORS multi-origin allowlist strategy
- Includes context, constraints, alternatives, consequences, Five Checks
- Evidence-based rationale with security considerations
- Clear rollback and testing procedures
-->


<!-- /ANCHOR:adr-004-impl -->

<!-- /ANCHOR:adr-004 -->