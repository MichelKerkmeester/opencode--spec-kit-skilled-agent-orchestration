---
title: "Handover: Form Upload File Type Issues [035-form-upload-issues/handover]"
description: "Spec: 035-form-upload-issues"
trigger_phrases:
  - "handover"
  - "form"
  - "upload"
  - "file"
  - "type"
  - "035"
importance_tier: "normal"
contextType: "general"
---
# Handover: Form Upload File Type Issues

**Spec:** `035-form-upload-issues`
**Date:** 2026-02-14
**Page:** https://a-nobel-en-zn.webflow.io/nl/werkenbij
**Status:** REOPENED — Phase 1 complete (MIME validation), Phase 2 blocked (CORS + error handling)

---

## Current Status Summary

**Phase 1 (COMPLETED — v1.3.4):** Client-side MIME validation fixes deployed and working. All 7 file types (.pdf, .doc, .docx, .txt, .md, .odt, .rtf) accepted by FilePond without "Invalid file type" error.

**Phase 2 (BLOCKED — Reopened 2026-02-14 Evening):** Live production debugging revealed uploads fail due to:
1. **CORS misconfiguration**: Worker allows `https://anobel.com`, browser origin is `https://a-nobel-en-zn.webflow.io`
2. **Frontend error handling bug**: `processfile` ignores `_error`, shows false "Complete" state
3. **No submission guard**: Form allows submission with empty `cv_url`

**Impact**: File validation works, but uploads fail silently → Users see "Complete" → Form submits with empty `cv_url` → Formspark entries missing CV attachments.

---

## Problem Statement

The CV upload form on the careers page should accept: PDF, DOC, DOCX, TXT, MD, ODT, RTF.
Currently .docx files are rejected with "Ongeldig bestandstype" (client-side FilePond validation error).

---

## Architecture

```
Webflow HTML (data attributes)
    ↓ overrides JS defaults
input_upload.js (FilePond connector)
    ↓ creates
FilePond instance (file validation + upload)
    ↓ uploads to
Cloudflare Worker (https://worker--upload-form.lorenzo-89a.workers.dev)
    ↓ stores in
R2 Bucket (anobel-uploads)
```

### Key Files

| File | Purpose |
|---|---|
| `src/2_javascript/form/input_upload.js` | Source — FilePond connector (modified) |
| `src/2_javascript/z_minified/form/input_upload.min.js` | Minified — deployed to CDN |
| `src/0_html/werken_bij.html` | Page HTML (script tags, line 80) |
| `src/0_html/cms/vacature.html` | CMS template HTML (script tags, line 57) |

### CDN URL (v1.3.4 — Current Deployed Version)

```
https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v=1.3.4
```

**DEPLOYED STATUS**: v1.3.4 is live on CDN with all Phase 1 MIME fixes:
- ✅ Extension-based MIME detection with fallback map (`MIME_TYPE_MAP`)
- ✅ Aggressive whitespace stripping for Webflow corruption (`replace(/\s+/g, '')`)
- ✅ Native `accept` attribute removed before FilePond init (`removeAttribute('accept')`)
- ✅ Custom `fileValidateTypeDetectType` function registered

**Verification**: 
```bash
curl "https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v=1.3.4" | grep removeAttribute
# Output: removeAttribute("accept") ✅

curl "https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v=1.3.4" | grep fileValidateTypeDetectType
# Output: fileValidateTypeDetectType ✅
```

---

## What Was Fixed (Phase 1 — DEPLOYED v1.3.4)

### Fix 1: Added MIME types for new file formats (COMPLETE)

**`DEFAULTS.acceptedTypes`** — Added: `text/plain`, `text/markdown`, `application/vnd.oasis.opendocument.text`, `application/rtf`, `text/rtf`

**`MIME_TYPE_MAP`** — Added: `.txt`, `.md`, `.odt`, `.rtf` extension mappings

**`DEFAULT_LABELS.description`** — Updated to include all 7 types

### Fix 2: Whitespace stripping for MIME types (COMPLETE)

Changed `.trim()` to `.replace(/\s+/g, '')` to strip internal whitespace from MIME types. Webflow's attribute editor was inserting spaces inside `application/vnd.openxmlformats-officedocument.wordprocessingml.document` → `doc   ument`.

### Fix 3: Remove native `accept` attribute before FilePond init (COMPLETE)

```javascript
input_el.removeAttribute('accept');
```

**HISTORICAL NOTE**: Phase 1 MIME validation fixes are deployed and working correctly. Root cause for Phase 2 is **CORS infrastructure issue** (Worker allows wrong origin) + **frontend error handling bug** (`processfile` ignores `_error` parameter), NOT MIME type configuration. Client-side validation is working as designed.

---

## What Was Fixed (Webflow Designer — VALIDATED Live)

User updated these attributes on `[data-file-upload="wrapper"]` (verified in live HTML):

| Attribute | Status |
|---|---|
| `data-accepted-types` | ✅ Validated — Contains 8 MIME types |
| `data-upload-endpoint` | ✅ Validated — Points to `https://worker--upload-form.lorenzo-89a.workers.dev` |
| `data-label-error-type` | ⚠️ Partial — Shows some types, not all 7 |

---

## Current Blockers (Phase 2 — CRITICAL)

### Blocker 1: CORS Preflight Mismatch

**Live debugging evidence (2026-02-14 evening on https://a-nobel-en-zn.webflow.io/nl/werkenbij):**

```
Live script URL: https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v=1.3.4
Script contains: removeAttribute("accept") ✅ | fileValidateTypeDetectType ✅ | replace(/\s+/g,'') ✅

Browser origin: https://a-nobel-en-zn.webflow.io (Webflow preview domain)
Worker CORS header: access-control-allow-origin: https://anobel.com (production only)
Result: Browser blocks POST → Status 0 (network error, CORS policy violation)
```

**Proof Worker is functional:**
```bash
curl -X POST "https://worker--upload-form.lorenzo-89a.workers.dev" \
  -F "file=@test.docx"
# Returns: {"success": true, "cv_url": "https://pub-XXXXX.r2.dev/uploads/test.docx"}
# Worker backend works outside browser ✅
```

**Impact**: File validation succeeds client-side (v1.3.4 MIME fixes work correctly), but upload POST is blocked by browser CORS policy before reaching Worker.

### Blocker 2: Frontend Error Handling Bug

**Source code inspection (`input_upload.js` v1.3.4 on CDN):**

```javascript
pond.on('processfile', function (_error, file) {
  // BUG: _error parameter is ignored completely
  set_state(COMPLETE); // Always sets COMPLETE state, even when upload failed
  // ... rest of completion logic executes regardless of error
});
```

**Behavior**:
- When upload fails (CORS block, network error, Worker error) → FilePond calls `processfile` callback with `_error` parameter populated
- Frontend code ignores `_error` → Sets UI state to `COMPLETE` unconditionally
- User sees green checkmark + "Upload complete" message (false positive)
- Hidden field `cv_url` remains empty (no R2 URL was returned due to upload failure)
- Form submission proceeds with empty `cv_url`

**Impact**: False-positive UI state + Formspark receives submissions with `cv_url: ""` (missing CV attachment). This is why client reported ".docx not working" — uploads appear successful but fail silently.

### Blocker 3: No Submission Guard

**Current behavior**: Form allows submission even when `cv_url` is empty.

**Impact**: Combined with Blocker 2, users can submit forms without CV attachment. Formspark entries have empty `cv_url` fields.

---

## Action Required for Next Agent (Phase 2 Resolution)

### Step 1: Fix Worker CORS Policy

**Access Cloudflare Workers:**
1. Login to Cloudflare dashboard → Workers & Pages
2. Select `worker--upload-form`
3. Edit Worker code

**Implement origin validation** (see ADR-004 in `decision-record.md` for full implementation):

```javascript
const ALLOWED_ORIGINS = [
  'https://anobel.com',                      // Production
  'https://a-nobel-en-zn.webflow.io',        // Webflow preview
  /^https:\/\/.*\.webflow\.io$/,             // All Webflow previews (optional)
];

function isOriginAllowed(origin) {
  return ALLOWED_ORIGINS.some(allowed => {
    if (typeof allowed === 'string') return origin === allowed;
    if (allowed instanceof RegExp) return allowed.test(origin);
    return false;
  });
}

// In request handler
const origin = request.headers.get('Origin');

if (request.method === 'OPTIONS') {
  if (isOriginAllowed(origin)) {
    return new Response(null, {
      headers: {
        'access-control-allow-origin': origin, // Echo origin
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'Content-Type',
        'access-control-max-age': '86400',
      },
    });
  }
  return new Response('Forbidden', { status: 403 });
}

// Add CORS to POST response
if (isOriginAllowed(origin)) {
  response.headers.set('access-control-allow-origin', origin);
}
```

**Deploy** and test:
```bash
# Test OPTIONS preflight
curl -X OPTIONS "https://worker--upload-form.lorenzo-89a.workers.dev" \
  -H "Origin: https://a-nobel-en-zn.webflow.io" \
  -H "Access-Control-Request-Method: POST" \
  -v
# Expected: access-control-allow-origin: https://a-nobel-en-zn.webflow.io ✅
```

### Step 2: Fix Frontend Error Handling

**Edit `src/2_javascript/form/input_upload.js`:**

Locate `pond.on('processfile')` handler and add error check:

```javascript
pond.on('processfile', function (_error, file) {
  if (_error) {
    // Upload failed — surface error to user
    set_state(ERROR); // New state needed
    show_error_message(_error.main); // Show error text
    return; // Exit early, do NOT set COMPLETE
  }
  
  // Upload succeeded
  set_state(COMPLETE);
  // ... rest of completion logic
});
```

**Implement ERROR state:**
```javascript
const ERROR = 'error';

function set_state(state) {
  // ... existing IDLE, PROCESSING, COMPLETE cases
  if (state === ERROR) {
    wrapper.classList.add('upload--error');
    wrapper.classList.remove('upload--processing', 'upload--complete');
    // Show red indicator, error message
  }
}
```

### Step 3: Add Submission Guard

**Locate form submit handler** (likely in same file or form init script):

```javascript
form.addEventListener('submit', function(e) {
  const cv_url = document.querySelector('input[name="cv_url"]').value;
  
  if (!cv_url || cv_url.trim() === '') {
    e.preventDefault(); // Block submission
    alert('Please upload your CV before submitting.'); // User-friendly error
    // OR show inline error message
    return false;
  }
  
  // Allow submission if cv_url is populated
});
```

### Step 4: Deploy Frontend Changes

```bash
# Minify updated source
node scripts/minify.js # Or whatever minification script is used

# Deploy to R2
npx wrangler r2 object put code/input_upload.min.js \
  --file=src/2_javascript/z_minified/form/input_upload.min.js

# Update version strings to v1.4.0
# Edit src/0_html/werken_bij.html line 80
# Edit src/0_html/cms/vacature.html line 57
```

### Step 5: Verification

**Test from Webflow preview domain:**
```
1. Navigate to https://a-nobel-en-zn.webflow.io/nl/werkenbij
2. Select .docx file → Should show upload progress
3. Check Network tab → POST should succeed (no CORS error)
4. Verify UI shows "Complete" after successful upload
5. Check hidden cv_url field → Should contain R2 URL
6. Submit form → Verify Formspark receives cv_url

TEST ERROR SCENARIO:
1. Disconnect network mid-upload (Chrome DevTools → Network → Offline)
2. Select file → Upload will fail
3. Verify UI shows ERROR state (not false "Complete")
4. Verify form submission is blocked

TEST SUBMISSION GUARD:
1. Don't upload file (cv_url empty)
2. Try to submit form
3. Verify submission is blocked with error message
```

### Step 6: If Issues Persist

**Debug checklist:**
1. Verify Worker CORS: Check Network tab → OPTIONS response → `access-control-allow-origin` header should match request origin
2. Verify frontend error handling: Add `console.log('Error:', _error)` in `processfile` handler
3. Verify submission guard: Add `console.log('cv_url:', cv_url)` in submit handler
4. Check for JavaScript errors in console
5. Hard refresh browser (Cmd+Shift+R) to clear cache

---

## Webflow Attributes Reference

See: `035-form-upload-issues/scratch/webflow-attributes.md`

Contains copy-paste values for:
- `data-accepted-types` (8 MIME types)
- `data-label-description` (Dutch, all 7 extensions)
- `data-label-error-type` (Dutch, all 7 extensions)
- `data-upload-endpoint` (worker--upload-form.lorenzo-89a.workers.dev)

---

## Cloudflare Setup Reference

See: `034-cloudflare-r2-migration/` for full Cloudflare account details.

| Resource | Value |
|---|---|
| Account subdomain | `lorenzo-89a` |
| CDN bucket | `anobel-cdn` → `pub-53729c3289024c618f90a09ec4c63bf9.r2.dev` |
| Uploads bucket | `anobel-uploads` |
| Upload worker | `worker--upload-form.lorenzo-89a.workers.dev` |
| Worker env var | `R2_PUBLIC_URL` → uploads bucket public URL |

---

## Session Timeline

1. Identified missing MIME types for .txt, .md, .odt, .rtf → Fixed in source
2. Discovered Webflow `data-accepted-types` had internal spaces breaking DOCX MIME → Fixed with `.replace(/\s+/g, '')`
3. Discovered Webflow native `accept` attribute overrides FilePond programmatic config → Fixed with `removeAttribute('accept')`
4. Discovered upload endpoint was 404 (wrong worker name) → User fixed in Webflow
5. .docx still fails → Most likely the CDN JS has not been updated (all fixes are local only)
