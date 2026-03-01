---
title: "Decision Record: Form Input Components Enhancement [012-form-input-upload-select/decision-record]"
description: "Date: 2024-12-27"
trigger_phrases:
  - "decision"
  - "record"
  - "form"
  - "input"
  - "components"
  - "decision record"
  - "012"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Form Input Components Enhancement

---

# Part A: Custom Select Decisions

<!-- ANCHOR:dr-001 -->
## DR-001: Custom JS vs Finsweet

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-001-context -->
### Context
The current select component uses Finsweet's `fs-selectcustom` attribute library. The user wants to populate select options from CMS while maintaining custom styling.
<!-- /ANCHOR:dr-001-context -->

<!-- ANCHOR:dr-001-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Keep Finsweet** | Already working, styled | Static options, external dependency |
| **B) Native select only** | No JS needed, CMS works | Limited styling (browser-controlled dropdown) |
| **C) Custom JS** | Full control, CMS support, no dependencies | More code to maintain |
<!-- /ANCHOR:dr-001-options-considered -->

<!-- ANCHOR:dr-001-decision -->
### Decision
**Option C: Custom JavaScript implementation**
<!-- /ANCHOR:dr-001-decision -->

<!-- ANCHOR:dr-001-rationale -->
### Rationale
1. CMS integration requires dynamic option population
2. Custom styling requires hiding native select and rendering custom UI
3. Removing Finsweet dependency reduces external dependencies
4. Full control over accessibility and behavior
5. Aligns with existing codebase pattern of custom components
<!-- /ANCHOR:dr-001-rationale -->
<!-- /ANCHOR:dr-001 -->

---

<!-- ANCHOR:dr-002 -->
## DR-002: Single Collection List with JS Sync

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-002-context -->
### Context
Need to render CMS options in both visual dropdown AND hidden native select for form submission.
<!-- /ANCHOR:dr-002-context -->

<!-- ANCHOR:dr-002-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Two Collection Lists** | Direct CMS binding for both | Duplicate markup, potential sync issues |
| **B) Collection List + Custom Element options** | Native options from CMS | Complex Webflow nesting, may not work |
| **C) Single Collection List, JS generates hidden options** | Single source of truth, simpler Webflow | Requires JS for form functionality |
<!-- /ANCHOR:dr-002-options-considered -->

<!-- ANCHOR:dr-002-decision -->
### Decision
**Option C: Single Collection List with JavaScript sync**
<!-- /ANCHOR:dr-002-decision -->

<!-- ANCHOR:dr-002-rationale -->
### Rationale
1. Webflow's Collection List inside Custom Element (select tag) has nesting limitations
2. Single Collection List is easier to maintain in Webflow
3. JS already handles all other interactions, adding option sync is minimal overhead
4. Eliminates risk of CMS data getting out of sync between two lists
<!-- /ANCHOR:dr-002-rationale -->

<!-- ANCHOR:dr-002-implementation -->
### Implementation
```javascript
syncOptionsToHiddenSelect() {
  this.hiddenSelect.innerHTML = '<option value="">Placeholder</option>';
  this.options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.dataset.value;
    opt.textContent = option.textContent.trim();
    this.hiddenSelect.appendChild(opt);
  });
}
```
<!-- /ANCHOR:dr-002-implementation -->
<!-- /ANCHOR:dr-002 -->

---

<!-- ANCHOR:dr-003 -->
## DR-003: Data Attributes for JS Hooks

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-003-context -->
### Context
Need to select elements in JavaScript for component functionality.
<!-- /ANCHOR:dr-003-context -->

<!-- ANCHOR:dr-003-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) CSS classes** | Already exist, familiar | Couples styling to behavior |
| **B) IDs** | Fast selection | Only one per page, conflicts |
| **C) Data attributes** | Decoupled from styling, semantic | Slightly more verbose |
<!-- /ANCHOR:dr-003-options-considered -->

<!-- ANCHOR:dr-003-decision -->
### Decision
**Option C: Data attributes (`data-select="*"` and `data-file-upload="*"`)**
<!-- /ANCHOR:dr-003-decision -->

<!-- ANCHOR:dr-003-rationale -->
### Rationale
1. Decouples JavaScript logic from CSS styling
2. CSS classes can be changed without breaking JS
3. Multiple instances work without ID conflicts
4. Self-documenting (clear intent)
5. Follows modern component patterns
<!-- /ANCHOR:dr-003-rationale -->

<!-- ANCHOR:dr-003-attribute-schema -->
### Attribute Schema - Select
```
data-select="wrapper"   → Container element
data-select="trigger"   → Click target
data-select="display"   → Text display element
data-select="dropdown"  → Dropdown container
data-select="option"    → Individual options
data-select="hidden"    → Native select
data-value="{value}"    → Option value
data-placeholder="{text}" → Default text
```
<!-- /ANCHOR:dr-003-attribute-schema -->
<!-- /ANCHOR:dr-003 -->

---

<!-- ANCHOR:dr-004 -->
## DR-004: Class-Based JavaScript Architecture

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-004-context -->
### Context
Need to structure JavaScript for maintainability and multiple instance support.
<!-- /ANCHOR:dr-004-context -->

<!-- ANCHOR:dr-004-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Functional/procedural** | Simple, familiar | Global state, hard to manage multiple instances |
| **B) Class-based** | Encapsulation, instance state | Slightly more complex |
| **C) Web Components** | Native encapsulation, shadow DOM | Browser support, Webflow integration |
<!-- /ANCHOR:dr-004-options-considered -->

<!-- ANCHOR:dr-004-decision -->
### Decision
**Option B: ES6 Class-based architecture**
<!-- /ANCHOR:dr-004-decision -->

<!-- ANCHOR:dr-004-rationale -->
### Rationale
1. Each select instance has isolated state
2. Methods are clearly organized
3. Easy to initialize multiple instances
4. No shadow DOM complexity (works with existing styles)
5. Good browser support (ES6 classes)
<!-- /ANCHOR:dr-004-rationale -->

<!-- ANCHOR:dr-004-structure -->
### Structure
```javascript
class CustomSelect {
  constructor(container) { /* init instance */ }
  toggle() { /* open/close */ }
  open() { /* show dropdown */ }
  close() { /* hide dropdown */ }
  selectOption(index) { /* handle selection */ }
  // ... other methods
}

// Initialize all instances
document.querySelectorAll('[data-select="wrapper"]')
  .forEach(el => new CustomSelect(el));
```
<!-- /ANCHOR:dr-004-structure -->
<!-- /ANCHOR:dr-004 -->

---

<!-- ANCHOR:dr-005 -->
## DR-005: CSS State Management via Container Class

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-005-context -->
### Context
Need to manage open/closed visual state of dropdown.
<!-- /ANCHOR:dr-005-context -->

<!-- ANCHOR:dr-005-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Inline styles via JS** | Direct control | Hard to override, no transitions |
| **B) Class on dropdown element** | Targeted | Multiple classes to manage |
| **C) Class on container element** | Single source of truth | Slightly more CSS selectors |
<!-- /ANCHOR:dr-005-options-considered -->

<!-- ANCHOR:dr-005-decision -->
### Decision
**Option C: Single `.is--open` class on container**
<!-- /ANCHOR:dr-005-decision -->

<!-- ANCHOR:dr-005-rationale -->
### Rationale
1. Single class controls all open state styles
2. CSS can target any descendant based on container state
3. Easier debugging (inspect container class)
4. Simpler JS (one classList operation)
<!-- /ANCHOR:dr-005-rationale -->

<!-- ANCHOR:dr-005-css-pattern -->
### CSS Pattern
```css
/* Closed state (default) */
.input--dropdown { opacity: 0; visibility: hidden; }
.input--icon.is--chevron { transform: rotate(0); }

/* Open state */
.input--container.is--open .input--dropdown { opacity: 1; visibility: visible; }
.input--container.is--open .input--icon.is--chevron { transform: rotate(180deg); }
```
<!-- /ANCHOR:dr-005-css-pattern -->
<!-- /ANCHOR:dr-005 -->

---

<!-- ANCHOR:dr-006 -->
## DR-006: Form Integration via Hidden Native Select

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-006-context -->
### Context
Selected value must be submitted with Webflow form.
<!-- /ANCHOR:dr-006-context -->

<!-- ANCHOR:dr-006-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Hidden input field** | Simple | Not semantic, no native validation |
| **B) Hidden native select** | Semantic, native validation | Must sync with visual |
| **C) FormData manipulation** | Full control | Complex, fragile |
<!-- /ANCHOR:dr-006-options-considered -->

<!-- ANCHOR:dr-006-decision -->
### Decision
**Option B: Hidden native `<select>` element**
<!-- /ANCHOR:dr-006-decision -->

<!-- ANCHOR:dr-006-rationale -->
### Rationale
1. Webflow forms work naturally with select elements
2. Native `required` validation works
3. Form data includes select automatically
4. Accessible (even if hidden)
5. Works with Webflow's form submission system
<!-- /ANCHOR:dr-006-rationale -->

<!-- ANCHOR:dr-006-implementation -->
### Implementation
- Native select styled with `display: none` or visually hidden
- JS syncs `<option>` elements from visual dropdown
- JS updates `select.value` on option selection
- Dispatch `change` event for form listeners
<!-- /ANCHOR:dr-006-implementation -->
<!-- /ANCHOR:dr-006 -->

---

# Part B: File Upload Decisions

<!-- ANCHOR:dr-007 -->
## DR-007: File Upload Library Choice

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-007-context -->
### Context
Need a file upload UI component for Webflow forms. User specifically requested FilePond.
<!-- /ANCHOR:dr-007-context -->

<!-- ANCHOR:dr-007-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Uploadcare Widget** | Simple setup, Formspark recommended | Limited customization, dependency |
| **B) Cloudinary Widget** | Powerful transformations | More complex setup |
| **C) FilePond** | Highly customizable, beautiful UI, user requested | Requires server/storage backend |
| **D) Native file input** | No dependencies | Poor UX, no preview, no progress |
<!-- /ANCHOR:dr-007-options-considered -->

<!-- ANCHOR:dr-007-decision -->
### Decision
**Option C: FilePond library**
<!-- /ANCHOR:dr-007-decision -->

<!-- ANCHOR:dr-007-rationale -->
### Rationale
1. User explicitly requested FilePond
2. Excellent drag-and-drop UX
3. Image preview built-in
4. Progress indicators
5. File validation plugins
6. Can be styled to match design system
7. Works with multiple storage backends
<!-- /ANCHOR:dr-007-rationale -->
<!-- /ANCHOR:dr-007 -->

---

<!-- ANCHOR:dr-008 -->
## DR-008: File Storage Backend

**Date:** 2024-12-27
**Status:** Superseded by DR-012

<!-- ANCHOR:dr-008-context -->
### Context
FilePond needs a server endpoint to upload files. Formspark does NOT support native file attachments.
<!-- /ANCHOR:dr-008-context -->

<!-- ANCHOR:dr-008-research-findings -->
### Research Findings
- `form_submission.js` explicitly **skips** file inputs (line 646-651)
- Formspark recommends Uploadcare as official solution
- Base64 encoding has ~10MB practical limit and 33% size overhead
- Files must be uploaded to external storage, URL sent to Formspark
<!-- /ANCHOR:dr-008-research-findings -->

<!-- ANCHOR:dr-008-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Uploadcare** | Formspark official, free tier (3k uploads/month) | Another service to manage |
| **B) Cloudinary** | Powerful, generous free tier (25 credits/month) | Not officially recommended |
| **C) AWS S3 + presigned URLs** | Full control, scalable | Complex setup, requires backend |
| **D) Base64 encoding** | No external service | Size limits, performance issues, not recommended |
<!-- /ANCHOR:dr-008-options-considered -->

<!-- ANCHOR:dr-008-decision -->
### Decision
**Option A: Uploadcare** (primary recommendation)
**Option B: Cloudinary** (alternative if more control needed)
<!-- /ANCHOR:dr-008-decision -->

<!-- ANCHOR:dr-008-rationale -->
### Rationale
1. Uploadcare is Formspark's official recommendation
2. Simple integration with FilePond
3. Free tier sufficient for typical usage (3,000 uploads/month)
4. CDN delivery included
5. No backend required (direct browser upload)
<!-- /ANCHOR:dr-008-rationale -->

<!-- ANCHOR:dr-008-implementation-pattern -->
### Implementation Pattern
```javascript
// Upload to Uploadcare, store URL
FilePond.create(input, {
  server: {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('UPLOADCARE_PUB_KEY', 'YOUR_KEY');

      fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        const url = `https://ucarecdn.com/${data.file}/`;
        load(url);
        document.querySelector('[data-file-upload="url"]').value = url;
      })
      .catch(err => error(err.message));
    }
  }
});
```
<!-- /ANCHOR:dr-008-implementation-pattern -->
<!-- /ANCHOR:dr-008 -->

---

<!-- ANCHOR:dr-009 -->
## DR-009: FilePond Mode

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-009-context -->
### Context
FilePond can operate in different modes: async upload, base64 encode, or no upload (preview only).
<!-- /ANCHOR:dr-009-context -->

<!-- ANCHOR:dr-009-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Async upload (server mode)** | Files upload immediately, URL returned | Requires storage backend |
| **B) Base64 encode mode** | No backend needed, files in form data | Size limits (~2MB practical), 33% overhead |
| **C) No upload (preview only)** | Simplest | Files not actually uploaded |
<!-- /ANCHOR:dr-009-options-considered -->

<!-- ANCHOR:dr-009-decision -->
### Decision
**Option A: Async upload to Uploadcare**
<!-- /ANCHOR:dr-009-decision -->

<!-- ANCHOR:dr-009-rationale -->
### Rationale
1. Files upload as soon as selected (better UX)
2. Progress indicator meaningful
3. No size overhead from encoding
4. Larger files supported (up to Uploadcare limits)
5. URL ready before form submission
<!-- /ANCHOR:dr-009-rationale -->

<!-- ANCHOR:dr-009-flow -->
### Flow
1. User selects file → FilePond validates
2. FilePond uploads to Uploadcare → Progress shown
3. Uploadcare returns file UUID → FilePond calls load()
4. JS stores URL in hidden input
5. User submits form → URL included in JSON payload
6. Formspark receives URL → Email contains clickable link
<!-- /ANCHOR:dr-009-flow -->
<!-- /ANCHOR:dr-009 -->

---

<!-- ANCHOR:dr-010 -->
## DR-010: Form Submission Integration

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-010-context -->
### Context
Need to ensure file URL is included in form submission and form cannot submit before upload completes.
<!-- /ANCHOR:dr-010-context -->

<!-- ANCHOR:dr-010-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Hidden input populated by JS** | Works with existing form system | Must prevent premature submission |
| **B) Modify form_submission.js** | Direct integration | More invasive changes |
| **C) Custom submit handler** | Full control | Bypasses existing form handling |
<!-- /ANCHOR:dr-010-options-considered -->

<!-- ANCHOR:dr-010-decision -->
### Decision
**Option A: Hidden input with submission guard**
<!-- /ANCHOR:dr-010-decision -->

<!-- ANCHOR:dr-010-rationale -->
### Rationale
1. Hidden input with `name` attribute works naturally with form system
2. No changes needed to `form_submission.js`
3. URL is just another string field (JSON serializable)
4. Add submission guard to prevent submit while uploading
<!-- /ANCHOR:dr-010-rationale -->

<!-- ANCHOR:dr-010-implementation -->
### Implementation
```html
<input type="hidden" name="cv_url" data-file-upload="url" />
```

```javascript
// Guard against submission while uploading
form.addEventListener('submit', (e) => {
  const uploadingFiles = pond.getFiles().filter(f => f.status !== 5); // 5 = complete
  if (uploadingFiles.length > 0) {
    e.preventDefault();
    alert('Please wait for file upload to complete');
  }
});
```
<!-- /ANCHOR:dr-010-implementation -->
<!-- /ANCHOR:dr-010 -->

---

<!-- ANCHOR:dr-011 -->
## DR-011: FilePond Plugins Selection

**Date:** 2024-12-27
**Status:** Accepted

<!-- ANCHOR:dr-011-context -->
### Context
FilePond has many plugins. Need to select which ones to include.
<!-- /ANCHOR:dr-011-context -->

<!-- ANCHOR:dr-011-plugins-considered -->
### Plugins Considered

| Plugin | Purpose | Include? |
|--------|---------|----------|
| `FilePondPluginImagePreview` | Show image thumbnails | **Yes** |
| `FilePondPluginFileValidateType` | Validate MIME types | **Yes** |
| `FilePondPluginFileValidateSize` | Validate file size | **Yes** |
| `FilePondPluginFileEncode` | Base64 encoding | No (using server mode) |
| `FilePondPluginImageCrop` | Crop before upload | No (not needed) |
| `FilePondPluginImageResize` | Resize before upload | No (not needed) |
| `FilePondPluginImageExifOrientation` | Fix mobile image rotation | Maybe (P2) |
<!-- /ANCHOR:dr-011-plugins-considered -->

<!-- ANCHOR:dr-011-decision -->
### Decision
Include: **ImagePreview, FileValidateType, FileValidateSize**
<!-- /ANCHOR:dr-011-decision -->

<!-- ANCHOR:dr-011-rationale -->
### Rationale
1. ImagePreview gives immediate visual feedback
2. FileValidateType prevents wrong file types before upload
3. FileValidateSize prevents oversized files before upload
4. Other plugins add complexity without clear need
<!-- /ANCHOR:dr-011-rationale -->

<!-- ANCHOR:dr-011-cdn-resources -->
### CDN Resources
```html
<!-- CSS -->
<link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet" />
<link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css" rel="stylesheet" />

<!-- JS (plugins must load before core) -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js"></script>
<script src="https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js"></script>
<script src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js"></script>
<script src="https://unpkg.com/filepond/dist/filepond.js"></script>
```
<!-- /ANCHOR:dr-011-cdn-resources -->
<!-- /ANCHOR:dr-011 -->

---

<!-- ANCHOR:dr-012 -->
## DR-012: Bunny Storage with Cloudflare Worker Proxy

**Date:** 2024-12-27
**Status:** Superseded by DR-013

<!-- ANCHOR:dr-012-context -->
### Context
Need a cost-effective file storage solution for FilePond uploads. User already has Bunny CDN (for video hosting) and Cloudflare accounts. Original recommendation was Uploadcare but user requested cheaper alternative.
<!-- /ANCHOR:dr-012-context -->

<!-- ANCHOR:dr-012-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Uploadcare** | Simple setup, Formspark recommended | $25+/month after free tier (3K uploads) |
| **B) Cloudflare R2** | Free egress, cheap storage | Needs Worker for presigned URLs |
| **C) Bunny Storage** | Very cheap ($0.01/GB), user has account | Needs proxy for secure uploads |
| **D) Cloudinary** | Simple unsigned uploads | Limited free tier (25 credits), expensive at scale |
<!-- /ANCHOR:dr-012-options-considered -->

<!-- ANCHOR:dr-012-decision -->
### Decision
**Option C: Bunny Storage with Cloudflare Worker as secure upload proxy**
<!-- /ANCHOR:dr-012-decision -->

<!-- ANCHOR:dr-012-rationale -->
### Rationale
1. User already has Bunny CDN account (video hosting)
2. User already has Cloudflare account
3. Extremely cheap: ~$0.10/month for 1,000 file uploads vs $25+/month for Uploadcare
4. Cloudflare Worker provides secure proxy (AccessKey never exposed to browser)
5. Worker is free (100K requests/day)
6. Files served via Bunny CDN (fast, global)
<!-- /ANCHOR:dr-012-rationale -->

<!-- ANCHOR:dr-012-architecture -->
### Architecture

```
Browser (FilePond)
    ↓ POST multipart/form-data
Cloudflare Worker (upload.anobel.com)
    ↓ PUT with AccessKey header
Bunny Storage Zone (anobel-uploads)
    ↓ linked to Pull Zone
Bunny CDN (anobel-uploads.b-cdn.net)
    ↓ returns URL
Hidden input stores URL
    ↓
Formspark receives URL in form submission
```
<!-- /ANCHOR:dr-012-architecture -->

<!-- ANCHOR:dr-012-implementation-requirements -->
### Implementation Requirements

**Bunny.net:**
- Storage Zone: `anobel-uploads` (or similar)
- Pull Zone: Linked to storage zone for CDN delivery
- Note the Storage Zone Password (AccessKey)

**Cloudflare:**
- Worker: `bunny-upload-proxy`
- Environment variables (secrets):
  - `BUNNY_STORAGE_ZONE`: Storage zone name
  - `BUNNY_ACCESS_KEY`: Storage zone password
  - `BUNNY_PULL_ZONE`: Pull zone hostname
- Custom domain: `upload.anobel.com` (optional)

**Worker Code Pattern:**
```javascript
// Receive file from browser
const file = await request.formData().get('file');

// Generate unique filename
const filename = `uploads/${Date.now()}-${randomId}.${ext}`;

// Upload to Bunny Storage
await fetch(`https://storage.bunnycdn.com/${ZONE}/${filename}`, {
  method: 'PUT',
  headers: { 'AccessKey': KEY },
  body: file
});

// Return CDN URL
return { url: `https://${PULL_ZONE}.b-cdn.net/${filename}` };
```
<!-- /ANCHOR:dr-012-implementation-requirements -->

<!-- ANCHOR:dr-012-cost-comparison -->
### Cost Comparison

| Scenario | Uploadcare | Bunny + Worker |
|----------|------------|----------------|
| 100 uploads/month | Free | ~$0.01 |
| 1,000 uploads/month | Free | ~$0.10 |
| 5,000 uploads/month | $25/month | ~$0.50 |
| 10,000 uploads/month | $25+/month | ~$1.00 |
<!-- /ANCHOR:dr-012-cost-comparison -->

<!-- ANCHOR:dr-012-trade-offs -->
### Trade-offs

**Advantages:**
- 95%+ cost savings at scale
- User already has both services
- Full control over file storage
- No vendor lock-in

**Disadvantages:**
- More complex initial setup (Worker deployment)
- Self-managed (vs Uploadcare's managed service)
- No built-in image transformations (not needed for form uploads)
<!-- /ANCHOR:dr-012-trade-offs -->
<!-- /ANCHOR:dr-012 -->

---

<!-- ANCHOR:dr-013 -->
## DR-013: Cloudflare R2 with Worker (Full Cloudflare Ecosystem)

**Date:** 2024-12-27
**Status:** Accepted (supersedes DR-012)

<!-- ANCHOR:dr-013-context -->
### Context
After considering Bunny Storage, user decided to keep everything within Cloudflare ecosystem for simplicity. Cloudflare R2 offers similar pricing with the major advantage of FREE egress (download bandwidth).
<!-- /ANCHOR:dr-013-context -->

<!-- ANCHOR:dr-013-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Bunny Storage + Worker** | Very cheap, user has account | Two vendors to manage |
| **B) Cloudflare R2 + Worker** | FREE egress, single vendor, R2 binding | Slightly more storage cost |
<!-- /ANCHOR:dr-013-options-considered -->

<!-- ANCHOR:dr-013-decision -->
### Decision
**Option B: Cloudflare R2 with Worker**
<!-- /ANCHOR:dr-013-decision -->

<!-- ANCHOR:dr-013-rationale -->
### Rationale
1. **Single ecosystem** - Everything in Cloudflare (DNS, Workers, R2, analytics)
2. **FREE egress** - No bandwidth costs for downloads (major advantage)
3. **R2 binding** - Worker connects directly to R2, no HTTP calls or API keys needed
4. **Generous free tier** - 10GB storage, 1M writes, 10M reads per month
5. **Simpler Worker code** - R2 binding is cleaner than HTTP to Bunny
<!-- /ANCHOR:dr-013-rationale -->

<!-- ANCHOR:dr-013-architecture -->
### Architecture

```
Browser (FilePond)
    ↓ POST multipart/form-data
Cloudflare Worker (r2-upload-proxy)
    ↓ R2 binding (env.UPLOADS_BUCKET.put())
Cloudflare R2 Bucket (anobel-uploads)
    ↓ public access enabled
R2 Public URL (pub-xxx.r2.dev/...)
    ↓
Hidden input stores URL
    ↓
Formspark receives URL in form submission
```
<!-- /ANCHOR:dr-013-architecture -->

<!-- ANCHOR:dr-013-implementation-requirements -->
### Implementation Requirements

**Cloudflare R2:**
- Create R2 bucket: `anobel-uploads`
- Enable public access (r2.dev subdomain)
- Note the public URL: `https://pub-{hash}.r2.dev`

**Cloudflare Worker:**
- Create Worker: `r2-upload-proxy`
- Add R2 binding: `UPLOADS_BUCKET` → `anobel-uploads`
- Add environment variable: `R2_PUBLIC_URL`
- Configure CORS for anobel.com

**Worker Code (with R2 Binding):**
```javascript
export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://anobel.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return Response.json({ error: 'No file' }, {
          status: 400, headers: corsHeaders
        });
      }

      // Generate unique key
      const timestamp = Date.now();
      const randomId = crypto.randomUUID().slice(0, 8);
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `uploads/${timestamp}-${randomId}-${safeName}`;

      // Upload to R2 via binding (no HTTP call, no API key)
      await env.UPLOADS_BUCKET.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type || 'application/octet-stream',
        },
      });

      // Return public URL
      const publicUrl = `${env.R2_PUBLIC_URL}/${key}`;

      return Response.json({ url: publicUrl }, { headers: corsHeaders });

    } catch (error) {
      return Response.json({ error: error.message }, {
        status: 500, headers: corsHeaders
      });
    }
  },
};
```
<!-- /ANCHOR:dr-013-implementation-requirements -->

<!-- ANCHOR:dr-013-cost-comparison -->
### Cost Comparison

| Scenario | Uploadcare | Bunny | Cloudflare R2 |
|----------|------------|-------|---------------|
| Storage (5GB) | Included | $0.05 | $0.075 |
| Writes (1K) | Included | Free | Free |
| Egress (10GB) | Included | $0.10 | **FREE** |
| Monthly after free tier | $25+ | ~$0.15 | ~$0.08 |
| Free tier | 3K uploads | None | 10GB + 1M ops |
<!-- /ANCHOR:dr-013-cost-comparison -->

<!-- ANCHOR:dr-013-trade-offs -->
### Trade-offs

**Advantages over Bunny:**
- Single vendor (Cloudflare only)
- FREE egress forever
- Simpler Worker code (R2 binding vs HTTP)
- Better free tier (10GB vs none)
- No API key management

**Disadvantages:**
- Slightly higher storage cost ($0.015 vs $0.01/GB)
- R2 is newer than Bunny (less mature)
<!-- /ANCHOR:dr-013-trade-offs -->

<!-- ANCHOR:dr-013-why-r2-over-bunny -->
### Why R2 over Bunny (Final Decision)
1. User wanted to stay fully within Cloudflare ecosystem
2. Free egress is significant for file downloads
3. R2 binding makes Worker code simpler and more secure
4. Generous free tier covers typical form upload volume
<!-- /ANCHOR:dr-013-why-r2-over-bunny -->
<!-- /ANCHOR:dr-013 -->

---

<!-- ANCHOR:dr-014 -->
## DR-014: Compact FilePond Layout for PDF/Word Only

**Date:** 2025-12-27
**Status:** ACTIVE

<!-- ANCHOR:dr-014-context -->
### Context
File upload is for CV/resume submissions on job application forms. Only PDF and Word documents needed, not images.
<!-- /ANCHOR:dr-014-context -->

<!-- ANCHOR:dr-014-decision -->
### Decision
**Use compact single-file FilePond layout without image preview plugin**
<!-- /ANCHOR:dr-014-decision -->

<!-- ANCHOR:dr-014-configuration -->
### Configuration
```javascript
{
  maxFiles: 1,
  allowMultiple: false,
  stylePanelLayout: 'compact',
  styleButtonRemoveItemPosition: 'right',
  acceptedFileTypes: ['application/pdf', '.doc', '.docx'],
  maxFileSize: '5MB',
  credits: false
}
```
<!-- /ANCHOR:dr-014-configuration -->

<!-- ANCHOR:dr-014-rationale -->
### Rationale
1. **Compact layout** - ~60-80px height vs default ~150px
2. **No image preview plugin** - Not needed for PDF/Word, reduces JS payload
3. **Single file only** - CV upload is one document
4. **PDF/Word restriction** - Prevents wrong file types, clearer UX
<!-- /ANCHOR:dr-014-rationale -->

<!-- ANCHOR:dr-014-css-overrides -->
### CSS Overrides
```css
.input--file-upload .filepond--root { max-height: 80px; }
.input--file-upload .filepond--panel-root { min-height: 60px; }
```
<!-- /ANCHOR:dr-014-css-overrides -->

<!-- ANCHOR:dr-014-plugins-used -->
### Plugins Used
- `FilePondPluginFileValidateType` - Restrict to PDF/Word
- `FilePondPluginFileValidateSize` - Max 5MB
<!-- /ANCHOR:dr-014-plugins-used -->

<!-- ANCHOR:dr-014-plugins-not-used -->
### Plugins NOT Used
- ~~`FilePondPluginImagePreview`~~ - Not needed for documents
<!-- /ANCHOR:dr-014-plugins-not-used -->
<!-- /ANCHOR:dr-014 -->

---

<!-- ANCHOR:dr-015 -->
## DR-015: Input Element as Display AND Form Submission

**Date:** 2025-01-03
**Status:** ACTIVE (supersedes DR-006)

<!-- ANCHOR:dr-015-context -->
### Context
The original implementation (DR-006) used a hidden native `<select>` element for form submission, with a separate display div showing the selected value. This required syncing between two elements.

User feedback suggested using a single `<input>` element inside `input--w` that serves BOTH as the display AND form submission element, matching the pattern used in Input | Main component.
<!-- /ANCHOR:dr-015-context -->

<!-- ANCHOR:dr-015-options-considered -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) Keep hidden select** | Native validation, semantic | Two elements to sync |
| **B) Use hidden input** | Simpler than select | Still two elements |
| **C) Use visible readonly input** | Single source of truth, native form attributes, consistent with other inputs | Need to style input to look like div |
<!-- /ANCHOR:dr-015-options-considered -->

<!-- ANCHOR:dr-015-decision -->
### Decision
**Option C: Single readonly input element for display AND form submission**
<!-- /ANCHOR:dr-015-decision -->

<!-- ANCHOR:dr-015-rationale -->
### Rationale
1. **Single source of truth** - One element handles display and submission
2. **Native form attributes** - `name`, `required`, `placeholder` work natively
3. **Better Webflow integration** - All attributes visible in Designer panel
4. **Simpler JavaScript** - No `syncOptionsToHiddenSelect()` needed
5. **Consistent pattern** - Matches Input | Main component structure
6. **Native placeholder** - Browser handles placeholder display
7. **Form validation compatible** - Works with `form_validation.js` (treats as text input)
<!-- /ANCHOR:dr-015-rationale -->

<!-- ANCHOR:dr-015-implementation -->
### Implementation

**HTML Structure:**
```html
<div class="input--w" data-select="trigger" role="combobox"
     aria-haspopup="listbox" aria-expanded="false">
  <div class="input--icon">...</div>
  <input type="text"
         class="input"
         name="referral_source"
         placeholder="Selecteer..."
         required
         readonly
         autocomplete="off"
         data-select="input">
  <div class="input--icon is--chevron">...</div>
</div>
```

**Key Changes:**
- `[data-select="display"]` → `[data-select="input"]`
- `[data-select="hidden"]` → Removed entirely
- `setDisplayText()` → Uses `input.value`
- `syncOptionsToHiddenSelect()` → Removed
- Events dispatch on input, not hidden select

**CSS Requirements:**
- Input styled to be transparent (no border, background)
- Cursor: pointer
- User-select: none (prevent text selection)
- Focus handled by trigger wrapper
<!-- /ANCHOR:dr-015-implementation -->

<!-- ANCHOR:dr-015-breaking-changes -->
### Breaking Changes
- HTML structure changed (no hidden select needed)
- Data attribute changed: `data-select="display"` → `data-select="input"`
- Legacy support added in CSS for backwards compatibility
<!-- /ANCHOR:dr-015-breaking-changes -->
<!-- /ANCHOR:dr-015 -->

---

# Summary

| # | Decision | Choice |
|---|----------|--------|
| 001 | Select: Library approach | Custom JS (no Finsweet) |
| 002 | Select: CMS integration | Single Collection List + JS sync |
| 003 | Shared: JS element selection | Data attributes |
| 004 | Shared: JS architecture | ES6 Classes |
| 005 | Select: State management | Container class (`.is--open`) |
| 006 | Select: Form integration | ~~Hidden native select~~ → Superseded by DR-015 |
| 007 | Upload: Library choice | FilePond |
| 008 | Upload: Storage backend | ~~Uploadcare~~ → Superseded by DR-012 |
| 009 | Upload: FilePond mode | Async upload (server mode) |
| 010 | Upload: Form integration | Hidden input with URL |
| 011 | Upload: Plugins | ~~ImagePreview~~, ValidateType, ValidateSize → Updated DR-014 |
| 012 | Upload: Storage backend (revised) | ~~Bunny Storage~~ → Superseded by DR-013 |
| 013 | Upload: Storage backend (final) | Cloudflare R2 + Worker |
| 014 | Upload: Compact layout for PDF/Word | Single file, no image preview |
| 015 | Select: Form integration (final) | Readonly input element (display + submission) |
