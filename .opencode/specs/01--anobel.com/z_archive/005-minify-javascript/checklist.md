---
title: "Testing & QA Checklist: minify-javascript - Validation Items [005-minify-javascript/checklist]"
description: "Validation checklist for in-place JS minification in src/2_javascript/z_minified/."
trigger_phrases:
  - "testing"
  - "checklist"
  - "minify"
  - "javascript"
  - "validation"
  - "005"
importance_tier: "normal"
contextType: "implementation"
---
# Testing & QA Checklist: minify-javascript - Validation Items

Validation checklist for in-place JS minification in `src/2_javascript/z_minified/`.

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v1.0 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Checklist
- **Tags**: minify-javascript, javascript-assets
- **Priority**: P0
- **Type**: Testing & QA

### Context
- **Created**: 2025-12-14
- **Status**: In Progress
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:checklist -->
## 2. CHECKLIST

### Pre-Implementation
- [x] CHK001 [P0] Spec/plan/tasks exist | Evidence: `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/spec.md`, `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/plan.md`, `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/tasks.md`
- [x] CHK002 [P0] Rollback approach documented | Evidence: restore originals from `src/2_javascript/` (same relative paths) per `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/plan.md`; verified all 40 have corresponding sources
- [x] CHK003 [P0] Minifier available | Evidence: used `npx terser@5`; version recorded in `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/terser-version.txt`

### Minification Safety
- [x] CHK010 [P0] Minify settings are conservative | Evidence: `npx --yes terser@5 "$file" -c -m --keep-fnames --keep-classnames --comments '/^!/' -o ...` (no `--mangle-props`, no `toplevel` mangling, no `unsafe` flags)
- [x] CHK011 [P0] No new files added to `src/2_javascript/z_minified/` | Evidence: `find src/2_javascript/z_minified -type f -name '*.js' | wc -l` => `40` (in-place overwrite)

### Verification
- [x] CHK020 [P0] Every output passes syntax check | Evidence: `node --check` run for all 40 files with no errors
- [x] CHK021 [P1] Size reduced for most files | Evidence: totals `627065` → `215096` bytes; details in `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/sizes-before.tsv` and `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/sizes-after.tsv`
- [x] CHK023 [P0] Init guard flag strings preserved | Evidence: extracted `__*CdnInit` values from `src/2_javascript/**` vs `src/2_javascript/z_minified/**` and confirmed sets match
- [x] CHK024 [P0] Webflow usage remains safe-guarded | Evidence: no `Webflow.push` / `Webflow?.push` without `window.` found in minified outputs
- [x] CHK025 [P0] Re-minified requested files | Evidence: re-minified `src/2_javascript/z_minified/modal/modal_cookie_consent.js`, `src/2_javascript/z_minified/cms/table_of_content.js`, `src/2_javascript/z_minified/menu/tab_main.js` and re-ran `node --check` for all 40 files; regenerated `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/sizes-after.tsv`
- [ ] CHK022 [P1] Webflow embed smoke test (manual) | Evidence: pending your confirmation after embedding in Webflow (or approve deferral)

### File Hygiene
- [x] CHK030 [P1] No temp/debug files outside spec scratch | Evidence: minification used temporary output under `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/scratch/` and removed it
- [x] CHK031 [P1] `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/scratch` cleaned | Evidence: `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/scratch` is empty
<!-- /ANCHOR:checklist -->

---

<!-- ANCHOR:verification-summary-fill-at-end -->
## 3. VERIFICATION SUMMARY (fill at end)

- **P0 Status**: COMPLETE
- **P1 Status**: CHK022 pending
- **Verification Date**: 2025-12-15
<!-- /ANCHOR:verification-summary-fill-at-end -->
