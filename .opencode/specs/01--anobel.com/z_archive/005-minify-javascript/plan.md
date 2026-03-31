---
title: "Implementation Plan: minify-javascript - Technical Approach [01--anobel.com/z_archive/005-minify-javascript/plan]"
description: "Minify all JavaScript files in src/2_javascript/z_minified/ in-place, using conservative minifier settings to avoid behavior changes when embedded in Webflow and served from Clo..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "minify"
  - "javascript"
  - "technical"
  - "005"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: minify-javascript - Technical Approach

Minify all JavaScript files in `src/2_javascript/z_minified/` in-place, using conservative minifier settings to avoid behavior changes when embedded in Webflow and served from Cloudflare.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: minify-javascript, javascript-assets
- **Priority**: P0
- **Branch**: `013-minify-javascript`
- **Date**: 2025-12-14
- **Spec**: `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/spec.md`

### Summary
Use a local JS minifier (prefer `terser`) to apply compression + local identifier mangling, without property mangling and without top-level mangling. Overwrite the existing files in `src/2_javascript/z_minified/`, then verify every output parses (syntax check) and document the minification settings used.

### Technical Context
- **Runtime**: Browser scripts embedded via Webflow
- **Target Platform**: Modern evergreen browsers
- **Tooling**: Node.js + local dependency minifier (no network installs unless explicitly approved)
- **Source Folder**: `src/2_javascript/z_minified/`
- **Output**: Overwrite the same `.js` files (no new artifacts)
 - **Current Repo Check**: No local `terser`, `esbuild`, or `uglify-js` dependency found; minification will require either (a) installing a minifier dependency or (b) using `npx` to fetch `terser` (network approval required).
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:safety-rules-minification -->
## 2. SAFETY RULES (MINIFICATION)

Minification configuration must follow these constraints:
- **No property mangling** (never rename object keys)
- **No top-level mangling** (avoid renaming globals that may be referenced externally)
- **No `unsafe` transforms** (avoid semantics-changing compress options)
- **Keep names**: keep function/class names (reduces risk where code depends on `.name`)
- **Preserve important comments**: keep `/*! ... */` license banners if present

Preferred minifier and configuration (conceptual):
- `compress`: enabled, `unsafe: false`
- `mangle`: enabled, `toplevel: false`
- `keep_fnames: true`, `keep_classnames: true`
- `output`: `ascii_only: false`, `comments: /^!/`
<!-- /ANCHOR:safety-rules-minification -->

---

<!-- ANCHOR:execution-steps -->
## 3. EXECUTION STEPS

1. **Inventory files**
   - Enumerate all `.js` files under `src/2_javascript/z_minified/`.
   - Record pre-minify byte sizes (for later verification).
2. **Select minifier**
   - Prefer `terser` if present in `node_modules` / `package-lock.json`.
   - If unavailable, fall back to another already-installed minifier (only if it supports the same safety rules).
3. **Minify in-place**
   - Process each file individually and overwrite the original.
   - Fail fast on first parse/minify error; do not partially minify without reporting.
4. **Verify**
   - Run a syntax parse check for each file (e.g., `node --check`).
   - Record post-minify byte sizes.
5. **Rollback option**
   - If any error is discovered, restore originals by copying from `src/2_javascript/` (same relative paths as `src/2_javascript/z_minified/` but without `z_minified/`).
<!-- /ANCHOR:execution-steps -->

---

<!-- ANCHOR:quality-gates -->
## 4. QUALITY GATES

### Definition of Done
- All `.js` files in `src/2_javascript/z_minified/` were minified in-place.
- Every minified file passes a syntax check.
- No new files were added to `src/2_javascript/z_minified/`.
- Minification settings and verification evidence are recorded in `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/checklist.md`.
<!-- /ANCHOR:quality-gates -->
