# Cloudflare R2 + Worker Setup Guide

Step-by-step guide for setting up R2 storage buckets and an upload proxy Worker on A. Nobel's Cloudflare account.

---

## Overview

Two R2 buckets and one Worker need to be created:

| Resource                 | Purpose                                | Used By                             |
| ------------------------ | -------------------------------------- | ----------------------------------- |
| **R2 Bucket: CDN**       | Serves minified JS/CSS site-wide       | 18 HTML files + `service_worker.js` |
| **R2 Bucket: Uploads**   | Stores user file uploads (CV/resume)   | `input_upload.js`                   |
| **Worker: Upload Proxy** | Receives browser uploads, stores in R2 | `input_upload.js` (endpoint)        |

---

## Section 1: Create R2 Buckets

### 1.1 Navigate to R2

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. In the left sidebar, click **R2 Object Storage**
3. If prompted, complete the R2 activation (requires payment method on file — no charges for free tier)

### 1.2 Create the CDN Bucket

This bucket serves all minified JavaScript and CSS files used across the website.

1. Click **Create bucket**
2. Set the name: `anobel-cdn`
3. Location: **Automatic** (recommended) or select **Western Europe** if available
4. Click **Create bucket**

### 1.3 Create the Uploads Bucket

This bucket stores file uploads from the job application form (CV/resume files).

1. Click **Create bucket**
2. Set the name: `anobel-uploads`
3. Location: **Automatic**
4. Click **Create bucket**

### 1.4 Enable Public Access

Both buckets need public read access so files can be loaded by browsers.

**For each bucket** (`anobel-cdn` and `anobel-uploads`):

1. Click the bucket name to open it
2. Go to the **Settings** tab
3. Scroll to **Public access**
4. Under **R2.dev subdomain**, click **Allow Access**
5. Confirm by typing "allow" in the dialog
6. A public URL will appear — it looks like:
   ```
   https://pub-XXXXXXXXXXXXXXXXXXXXXXXXXXXX.r2.dev
   ```
7. **Copy and save this URL** — you'll need it later

> **Important:** Each bucket gets a **different** `pub-XXX` URL. Make sure to note which URL belongs to which bucket.

**Expected result:**

| Bucket           | Public URL (example)        |
| ---------------- | --------------------------- |
| `anobel-cdn`     | `https://pub-abc123.r2.dev` |
| `anobel-uploads` | `https://pub-def456.r2.dev` |

---

## Section 2: Upload CDN Assets

### 2.1 Which Files to Upload

All minified JS and CSS files from the project need to be uploaded to the **anobel-cdn** bucket. These are located in:

```
src/2_javascript/z_minified/
```

The files to upload (flat structure, no subfolders in the bucket):

| Local Path                                                | Upload As                       |
| --------------------------------------------------------- | ------------------------------- |
| `z_minified/cms/table_of_content.min.js`                  | `table_of_content.js`           |
| `z_minified/form/input_upload.min.js`                     | `input_upload.js`               |
| `z_minified/global/attribute_cleanup.min.js`              | `attribute_cleanup.js`          |
| `z_minified/global/service_worker.min.js`                 | `service_worker.js`             |
| `z_minified/molecules/label_product.min.js`               | `label_product.js`              |
| `z_minified/video/video_background_hls_hover.min.js`      | `video_background_hls_hover.js` |
| `z_minified/video/video_player_hls_scroll.min.js`         | `video_player_hls_scroll.js`    |
| *(and all other minified files currently on the old CDN)* | *(same filename pattern)*       |

> **Note:** Files are uploaded with their short name (e.g., `attribute_cleanup.js`), not the `.min.js` suffix. This matches the current CDN URL pattern.

### 2.2 How to Upload via Dashboard

1. Open the **anobel-cdn** bucket
2. Click **Upload** (or drag and drop files into the browser)
3. Select the minified files from your local machine
4. Click **Upload**
5. Verify each file appears in the object list

### 2.3 Verify Files Are Accessible

Test a file by opening its public URL in a browser:

```
https://pub-[YOUR-CDN-HASH].r2.dev/attribute_cleanup.js
```

You should see the minified JavaScript content. If you get a 404 or access denied, check:
- Public access is enabled (Section 1.4)
- The filename matches exactly (case-sensitive)

---

## Section 3: Create the Upload Worker

The upload proxy Worker receives file uploads from the browser and stores them in the `anobel-uploads` R2 bucket. This keeps the R2 API credentials secure (never exposed to the browser).

### 3.1 Create the Worker

1. In the Cloudflare Dashboard sidebar, click **Workers & Pages**
2. Click **Create**
3. Select **Create Worker**
4. Name it: `r2-upload-proxy`
5. Click **Deploy** (deploys the default "Hello World" — we'll replace it next)

### 3.2 Add the Worker Code

1. After deployment, click **Edit code** (or go to the Worker → **Code** tab)
2. **Delete all existing code** in the editor
3. Paste the following complete Worker code:

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

4. Click **Save and deploy**

### 3.3 Add R2 Bucket Binding

The binding connects the Worker to the R2 bucket without needing API keys.

1. Go to the Worker → **Settings** tab
2. Click **Bindings**
3. Click **Add**
4. Select **R2 Bucket**
5. Configure:
   - **Variable name:** `UPLOADS_BUCKET`
   - **R2 bucket:** Select `anobel-uploads` from the dropdown
6. Click **Save**

### 3.4 Add Environment Variable

The Worker needs to know the public URL of the uploads bucket to return download links.

1. Still in **Settings** → **Variables and Secrets**
2. Click **Add**
3. Configure:
   - **Variable name:** `R2_PUBLIC_URL`
   - **Value:** `https://pub-[YOUR-UPLOADS-HASH].r2.dev` (the public URL from Section 1.4 for the `anobel-uploads` bucket)
4. Click **Save and deploy**

### 3.5 Find the Worker URL

After deployment, your Worker URL is shown at the top of the Worker page:

```
https://r2-upload-proxy.[YOUR-ACCOUNT-SUBDOMAIN].workers.dev
```

**Copy this URL** — it replaces the old endpoint in `input_upload.js`.

---

## Section 4: Test & Verify

### 4.1 Test the Worker with curl

Open a terminal and run:

```bash
curl -X POST \
  https://r2-upload-proxy.[YOUR-ACCOUNT-SUBDOMAIN].workers.dev \
  -F "file=@/path/to/test-file.pdf"
```

**Expected response:**
```json
{
  "url": "https://pub-[YOUR-UPLOADS-HASH].r2.dev/uploads/1234567890-abcd1234-test-file.pdf"
}
```

### 4.2 Verify CORS

Open the browser DevTools console on `anobel.com` and run:

```javascript
fetch('https://r2-upload-proxy.[YOUR-ACCOUNT-SUBDOMAIN].workers.dev', {
  method: 'OPTIONS'
}).then(r => {
  console.log('CORS Allow-Origin:', r.headers.get('Access-Control-Allow-Origin'));
  console.log('Status:', r.status);
});
```

**Expected output:**
```
CORS Allow-Origin: https://anobel.com
Status: 200
```

### 4.3 Verify Uploaded File Is Accessible

Copy the URL from the curl response and open it in a browser. The file should download.

---

## Section 5: Codebase URL Updates

After the new account is set up and tested, the following files need URL replacements. This will be done as a separate task.

### 5.1 Worker Endpoint (1 file)

| File                                    | Line | Current Value                                                 | Replace With                                      |
| --------------------------------------- | ---- | ------------------------------------------------------------- | ------------------------------------------------- |
| `src/2_javascript/form/input_upload.js` | 47   | `https://r2-upload-proxy.cloudflare-decorated911.workers.dev` | `https://r2-upload-proxy.lorenzo-89a.workers.dev` |

### 5.2 CDN URLs (19 files)

**Current CDN domain:** `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev`
**Replace with:** `pub-[NEW-CDN-HASH].r2.dev`

**HTML files (18):**

| #   | File                                     |
| --- | ---------------------------------------- |
| 1   | `src/0_html/global.html`                 |
| 2   | `src/0_html/home.html`                   |
| 3   | `src/0_html/blog.html`                   |
| 4   | `src/0_html/contact.html`                |
| 5   | `src/0_html/werken_bij.html`             |
| 6   | `src/0_html/voorwaarden.html`            |
| 7   | `src/0_html/cms/blog_template.html`      |
| 8   | `src/0_html/cms/vacature.html`           |
| 9   | `src/0_html/nobel/n1_dit_is_nobel.html`  |
| 10  | `src/0_html/nobel/n2_isps_kade.html`     |
| 11  | `src/0_html/nobel/n3_de_locatie.html`    |
| 12  | `src/0_html/nobel/n4_het_team.html`      |
| 13  | `src/0_html/nobel/n5_brochures.html`     |
| 14  | `src/0_html/services/d1_bunkering.html`  |
| 15  | `src/0_html/services/d2_filtratie.html`  |
| 16  | `src/0_html/services/d3_uitrusting.html` |
| 17  | `src/0_html/services/d4_maatwerk.html`   |
| 18  | `src/0_html/services/d5_webshop.html`    |

**JavaScript files (1):**

| #   | File                                        |
| --- | ------------------------------------------- |
| 19  | `src/2_javascript/global/service_worker.js` |

> **Note:** After updating `service_worker.js`, bump the `CACHE_VERSION` constant and update the URLs in the `PRECACHE_ASSETS` array.

---

## Troubleshooting

| Issue                               | Solution                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| R2.dev subdomain option not showing | Complete R2 activation first (may require payment method)                          |
| 403 Forbidden on public URL         | Verify "Allow Access" was confirmed in Public access settings                      |
| Worker returns "Method not allowed" | Ensure you're sending a POST request, not GET                                      |
| CORS error in browser               | Check `Access-Control-Allow-Origin` matches exactly `https://anobel.com`           |
| "No such bucket" in Worker          | Verify the R2 binding variable name is exactly `UPLOADS_BUCKET`                    |
| Upload succeeds but URL returns 404 | Check `R2_PUBLIC_URL` environment variable matches the uploads bucket's public URL |
| Worker not appearing                | Check you're in the correct Cloudflare account                                     |

---

## Quick Checklist

```
□ R2 activated on the company Cloudflare account
□ anobel-cdn bucket created with public access enabled
□ anobel-uploads bucket created with public access enabled
□ Both public URLs noted (pub-XXX.r2.dev)
□ CDN assets uploaded to anobel-cdn bucket
□ r2-upload-proxy Worker created and deployed
□ Worker code pasted and saved
□ R2 binding added: UPLOADS_BUCKET → anobel-uploads
□ Environment variable added: R2_PUBLIC_URL → uploads bucket public URL
□ curl test successful
□ CORS test successful from anobel.com
□ File accessible via public URL
```
