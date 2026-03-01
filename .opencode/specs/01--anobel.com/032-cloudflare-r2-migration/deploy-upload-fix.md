# Deploy & Test: Upload File Type Fix

Step-by-step guide for deploying the `.doc/.docx` upload fix to production via Cloudflare R2 and verifying it works in Webflow.

---

## What Changed

The `input_upload.js` file was updated to fix `.doc/.docx` files being rejected with "Ongeldig bestandstype" (Invalid file type) on career forms.

**Root cause**: Browsers inconsistently report MIME types for Office documents (e.g., `.docx` reported as `application/zip` instead of the correct MIME type). FilePond's validation then rejects the file.

**Fix**: Added `MIME_TYPE_MAP` and `detect_file_type()` function that falls back to extension-based MIME type detection when the browser reports an incorrect type. Wired into FilePond via `fileValidateTypeDetectType`.

**Files modified**:
- `src/2_javascript/form/input_upload.js` (source)
- `src/2_javascript/z_minified/form/input_upload.min.js` (minified — this gets deployed)

---

## Step 1: Upload to Cloudflare R2

Upload the minified file to the **CDN bucket** (`anobel-cdn`).

### Option A: Cloudflare Dashboard (no CLI needed)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **R2 Object Storage** > **anobel-cdn** bucket
3. Click **Upload**
4. Select `src/2_javascript/z_minified/form/input_upload.min.js` from your local machine
5. Confirm the upload — it will overwrite the existing file

### Option B: Wrangler CLI

```bash
npx wrangler r2 object put anobel-cdn/input_upload.min.js \
  --file src/2_javascript/z_minified/form/input_upload.min.js
```

### Verify Upload

Open this URL in a browser — it should return minified JavaScript (not a 404 or old version):

```
https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js
```

To confirm the fix is present, search the response for `fileValidateTypeDetectType` — it should appear in the minified code. You can also search for `".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document"` to confirm the MIME type map is present (the variable name `MIME_TYPE_MAP` is shortened by the minifier).

---

## Step 2: Bump Version in Webflow

The HTML files use a `?v=` query parameter for cache busting. The current version is `1.2.5`. Bump to `1.3.0` (minor version bump for new feature).

### Pages to Update

Both pages load `input_upload.min.js` and need the version bump:

| Page | Webflow Location | Current |
|------|-------------------|---------|
| **Werken bij** (Careers) | Pages > Werken bij | `?v=1.2.5` |
| **Vacature** (Job template) | CMS Templates > Vacature | `?v=1.2.5` |

### In Webflow Designer

1. Open the **Werken bij** page
2. Go to **Page Settings** (gear icon) > **Custom Code** > **Before `</body>` tag**
3. Find the line:
   ```html
   <script src="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v=1.2.5" defer></script>
   ```
4. Change `?v=1.2.5` to `?v=1.3.0`
5. **Save** and **Publish**
6. Repeat for the **Vacature** CMS template page

### In Source Files (keep in sync)

Also update the local HTML source files to match:

| File | Line |
|------|------|
| `src/0_html/werken_bij.html` | ~80 |
| `src/0_html/cms/vacature.html` | ~57 |

Change `?v=1.2.5` to `?v=1.3.0` in both files.

---

## Step 3: Test Upload

### Test Files to Prepare

Prepare these test files before testing:

| # | File | Type | Expected Result |
|---|------|------|-----------------|
| 1 | `test.pdf` | PDF | Accepted |
| 2 | `test.doc` | Word 97-2003 | Accepted (was broken) |
| 3 | `test.docx` | Word modern | Accepted (was broken) |
| 4 | `test.xlsx` | Excel | Rejected (not in accepted types) |
| 5 | `test.jpg` | Image | Rejected (not in accepted types) |
| 6 | Large file (>5MB) | Any accepted type | Rejected ("File too large") |

### Test on Werken bij Page

1. Go to [anobel.com/werken-bij](https://anobel.com/werken-bij)
2. Scroll to the application form
3. **Test each file** from the table above:
   - Click the upload area or drag & drop the file
   - Verify the expected result
4. For accepted files, verify:
   - Progress bar animates from 0% to 100%
   - Filename appears after upload completes
   - "Click to delete" notice appears
   - Clicking the upload area again deletes the file and resets to idle

### Test on Vacature Page

1. Navigate to any job posting page (vacature)
2. Repeat the same upload tests

### Browser Testing Matrix

Test on at least these combinations (MIME type reporting varies by browser/OS):

| Browser | OS | Priority |
|---------|-----|----------|
| Chrome | Windows | High (most common) |
| Chrome | macOS | High |
| Safari | macOS | High |
| Safari | iOS | High (mobile) |
| Firefox | Any | Medium |
| Edge | Windows | Medium |

### DevTools Verification (Optional)

For deeper verification, open DevTools Console before uploading:

1. Open DevTools (F12 / Cmd+Shift+I)
2. Go to **Console** tab
3. Upload a `.docx` file
4. Look for `[FilePondConnector] Initialized 1 instance(s)` — confirms script loaded
5. Go to **Network** tab
6. Upload a `.docx` file
7. Look for a POST request to `worker--upload-form.lorenzo-89a.workers.dev`
8. Verify response is `200 OK` with JSON containing `{ "url": "https://pub-..." }`

---

## Step 4: Verify End-to-End

After confirming upload works:

1. Fill out the full career form with a `.docx` file attached
2. Submit the form
3. Check Formspark (or wherever submissions go) to verify the `file_url` field contains the R2 CDN URL
4. Open the URL from the submission — the uploaded file should download correctly

---

## Rollback

If something goes wrong:

1. Re-upload the previous `input_upload.min.js` from git history:
   ```bash
   git show HEAD~1:src/2_javascript/z_minified/form/input_upload.min.js > /tmp/input_upload_old.min.js
   npx wrangler r2 object put anobel-cdn/input_upload.min.js --file /tmp/input_upload_old.min.js
   ```
2. Revert the `?v=` parameter back to `1.2.5` in Webflow
3. Publish in Webflow

---

## Quick Reference

| Item | Value |
|------|-------|
| **CDN bucket** | `anobel-cdn` |
| **CDN domain** | `pub-53729c3289024c618f90a09ec4c63bf9.r2.dev` |
| **File to deploy** | `input_upload.min.js` |
| **Old version** | `1.2.5` |
| **New version** | `1.3.0` |
| **Pages affected** | Werken bij, Vacature (CMS template) |
| **Worker endpoint** | `worker--upload-form.lorenzo-89a.workers.dev` |
