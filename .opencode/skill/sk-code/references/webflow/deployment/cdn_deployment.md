---
title: CDN Deployment Guide
description: Complete workflow for deploying minified JavaScript to Cloudflare R2 CDN.
---

# CDN Deployment Guide

Complete workflow for deploying minified JavaScript to Cloudflare R2 CDN.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides systematic workflows for deploying minified JavaScript files to Cloudflare R2, managing version parameters for cache-busting, and updating HTML references across the project.

### When to Use

- After making JavaScript changes
- After minifying JavaScript files
- When updating production scripts
- Cache-busting required

### Core Principle

Version parameters are your cache-busting mechanism - increment on EVERY change, update ALL references, verify BEFORE deploying.

### CDN Infrastructure

| Component     | Value                                                    |
| ------------- | -------------------------------------------------------- |
| Provider      | Cloudflare R2                                            |
| Bucket URL    | `https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/`   |
| File Structure| Flat (no folders)                                        |
| Access        | Public bucket                                            |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:version-management -->
## 2. VERSION MANAGEMENT

### Semantic Versioning Format

Version parameters use the format `?v=major.minor.patch`:

```
https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/script_name.js?v=X.Y.Z
                                                                      └─┬─┘
                                                                major.minor.patch
```

### When to Increment

| Change Type | Version Part | Pattern             | Use When                                         |
| ----------- | ------------ | ------------------- | ------------------------------------------------ |
| **Patch**   | `x.x.X`      | X.Y.Z → X.Y.(Z+1)  | Bug fixes, timing adjustments, minor tweaks      |
| **Minor**   | `x.X.0`      | X.Y.Z → X.(Y+1).0  | New features, new functionality, non-breaking    |
| **Major**   | `X.0.0`      | X.Y.Z → (X+1).0.0  | Breaking changes, API changes, major refactors   |

### Examples

```html
<!-- Patch: Fixed animation timing -->
script.js?v=X.Y.Z → script.js?v=X.Y.(Z+1)

<!-- Minor: Added new feature -->
script.js?v=X.Y.Z → script.js?v=X.(Y+1).0

<!-- Major: Rewrote system -->
script.js?v=X.Y.Z → script.js?v=(X+1).0.0
```

---

<!-- /ANCHOR:version-management -->
<!-- ANCHOR:html-file-update-workflow -->
## 3. HTML FILE UPDATE WORKFLOW

### File Locations

All HTML files are in: `src/0_html/`

```
src/0_html/
├── global.html          # Global scripts (nav, footer, cookies)
├── home.html            # Homepage
├── contact.html         # Contact page
├── voorwaarden.html     # Terms page
├── about/               # About section pages
│   ├── about_company.html
│   ├── about_location.html
│   ├── about_team.html
│   └── about_brochures.html
├── services/            # Services pages
│   ├── service_one.html
│   ├── service_two.html
│   ├── service_three.html
│   └── service_four.html
└── cms/                 # CMS template pages
    ├── blog.html
    ├── blog_template.html
    ├── vacature.html
    └── werken_bij.html
```

### Finding References

Use grep to find all HTML files that reference a specific script:

```bash
# Find all references to hero_video.js
grep -r "hero_video.js" src/0_html/ --include="*.html"

# Find all R2 CDN references
grep -r "pub-53729c3289024c618f90a09ec4c63bf9.r2.dev" src/0_html/ --include="*.html"
```

### Update Pattern

Each script typically has TWO references per HTML file:

1. **Preload link** (in `<head>`)
```html
<link rel="preload" href="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/script_name.js?v={version}" as="script">
```

2. **Script tag** (in footer)
```html
<script src="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/script_name.js?v={version}" defer></script>
```

**IMPORTANT:** Both must be updated to the same version!

### Batch Update Command

For updating a specific script across all files:

```bash
# Find and replace version
# Use your editor's find/replace or sed:

# Preview changes first:
grep -r "script_name.js?v=" src/0_html/

# Then update each file or use sed:
# sed -i '' 's/script_name.js?v=OLD/script_name.js?v=NEW/g' src/0_html/**/*.html
```

---

<!-- /ANCHOR:html-file-update-workflow -->
<!-- ANCHOR:cloudflare-r2-upload -->
## 4. CLOUDFLARE R2 UPLOAD

### Manual Upload via Dashboard

**Step 1: Access Cloudflare Dashboard**
1. Go to https://dash.cloudflare.com
2. Select your account
3. Navigate to R2 Object Storage
4. Select the bucket (pub-53729c3289024c618f90a09ec4c63bf9)

**Step 2: Upload File**
1. Click "Upload" button
2. Select the minified file from `src/2_javascript/z_minified/`
3. File will be named same as source (e.g., `hero_video.js`)
4. Click "Upload" to confirm

**Step 3: Verify Upload**
1. File should appear in bucket file list
2. Click on file to view details
3. Copy public URL to verify accessibility
4. Test URL in browser: `https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/hero_video.js`

### File Naming

| Source File                              | Minified File                        | R2 Upload Name       |
| ---------------------------------------- | ------------------------------------ | -------------------- |
| `src/2_javascript/hero/hero_video.js`    | `z_minified/hero/hero_video.js`      | `hero_video.js`      |
| `src/2_javascript/form/form_validation.js` | `z_minified/form/form_validation.js` | `form_validation.js` |

**Note:** R2 bucket uses flat structure - upload files directly without folder paths.

---

<!-- /ANCHOR:cloudflare-r2-upload -->
<!-- ANCHOR:deployment-checklist -->
## 5. DEPLOYMENT CHECKLIST

### Pre-Deployment

```
□ JavaScript changes made and tested locally
□ Minified using terser (see minification_guide.md)
□ AST verification passed (node .opencode/skill/sk-code/scripts/verify-minification.mjs)
□ Runtime test passed (node .opencode/skill/sk-code/scripts/test-minified-runtime.mjs)
□ Browser test passed (no console errors)
```

### Deployment

```
□ Version incremented in ALL HTML files (preload + script tags)
□ Minified file uploaded to Cloudflare R2
□ Upload successful (file visible in bucket)
```

### Post-Deployment

```
□ Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
□ Verify new version loads (check Network tab for ?v=X.X.X)
□ Check DevTools console for errors
□ Test key functionality on live site
□ Test on mobile viewport
```

### Quick Workflow Summary

```
1. Edit JS      → src/2_javascript/[folder]/[file].js
2. Minify       → npx terser [source] --compress --mangle -o z_minified/[folder]/[file].js
3. Verify       → node .opencode/skill/sk-code/scripts/verify-minification.mjs
4. Test         → node .opencode/skill/sk-code/scripts/test-minified-runtime.mjs
5. Update HTML  → Increment ?v=X.X.X in all referencing HTML files
6. Upload       → Cloudflare Dashboard → R2 → Upload minified file
7. Verify live  → Hard refresh, check console, test functionality
```

---

<!-- /ANCHOR:deployment-checklist -->
<!-- ANCHOR:rules -->
## 6. RULES

### ✅ ALWAYS

- Increment version after ANY JavaScript change
- Update ALL HTML files that reference the changed script
- Update BOTH preload and script tags to same version
- Verify minified file before uploading
- Hard refresh browser after deployment to bypass cache
- Test on live site after deployment

### ❌ NEVER

- Use the same version number after making changes
- Update only some HTML files (must be ALL)
- Upload non-minified source files to R2
- Skip verification steps
- Deploy without testing locally first

### ⚠️ ESCALATE IF

- Upload fails repeatedly
- File not accessible after upload (404)
- Old version still loading after hard refresh (CDN cache issue)
- CORS errors when loading script
- Console errors on live site after deployment

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Old Version Still Loading

**Symptoms:** Changes not visible, Network tab shows old version parameter

**Solutions:**
1. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache completely
3. Test in incognito/private window
4. Verify HTML files have new version parameter
5. Verify new file was actually uploaded to R2

### 404 Not Found

**Symptoms:** Script fails to load, 404 error in Network tab

**Solutions:**
1. Check filename exact match (case-sensitive)
2. Verify file exists in R2 bucket
3. Check bucket is public
4. Verify URL is correct (no typos)

### CORS Errors

**Symptoms:** Console shows CORS policy error

**Solutions:**
1. Verify R2 bucket has public access enabled
2. Check bucket CORS configuration in Cloudflare dashboard
3. Ensure no authentication required for public files

### Script Errors After Deployment

**Symptoms:** Console errors, functionality broken

**Solutions:**
1. Compare deployed version with local minified version
2. Re-run verification scripts locally
3. Check if correct file was uploaded
4. Rollback: upload previous version and decrement HTML version

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files

- [minification_guide.md](./minification_guide.md) - Safe minification workflow with verification
- [implementation_workflows.md](../implementation/implementation_workflows.md) - General implementation patterns
- [verification_workflows.md](../verification/verification_workflows.md) - Browser verification workflows

### Scripts

- `.opencode/skill/sk-code/scripts/verify-minification.mjs` - AST verification
- `.opencode/skill/sk-code/scripts/test-minified-runtime.mjs` - Runtime testing
- `.opencode/skill/sk-code/scripts/minify-webflow.mjs` - Batch minification

### External

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
<!-- /ANCHOR:related-resources -->
