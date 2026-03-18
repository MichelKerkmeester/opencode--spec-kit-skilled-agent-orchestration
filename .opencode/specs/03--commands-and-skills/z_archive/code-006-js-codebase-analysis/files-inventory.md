# Files Inventory - JavaScript Codebase Analysis

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: files-inventory (custom) | v2.0 -->

> **Task Type:** Analysis (READ-ONLY)
> **Date:** 2026-01-24
> **Status:** Analysis Complete - No Files Modified
> **Documentation Level:** 3+ (Multi-Agent Orchestration)

---

## Summary

| Category | Count |
|----------|-------|
| Source JS Files Analyzed | 47 |
| Minified JS Files Verified | 44 |
| Spec Folder Files Created | 5 |
| HTML Files Modified | 0 |
| CDN Versions Updated | 0 |

**Note:** This was a compliance analysis task. No source files were modified.

---

## Files Created (Spec Folder)

| File | Path | Purpose |
|------|------|---------|
| `spec.md` | `.opencode/specs/03--commands-and-skills/sk-code/z_archive/006-js-codebase-analysis/spec.md` | Requirements document |
| `plan.md` | `.opencode/specs/03--commands-and-skills/sk-code/z_archive/006-js-codebase-analysis/plan.md` | 5-phase analysis plan |
| `tasks.md` | `.opencode/specs/03--commands-and-skills/sk-code/z_archive/006-js-codebase-analysis/tasks.md` | Task breakdown |
| `checklist.md` | `.opencode/specs/03--commands-and-skills/sk-code/z_archive/006-js-codebase-analysis/checklist.md` | Validation checklist |
| `decision-record.md` | `.opencode/specs/03--commands-and-skills/sk-code/z_archive/006-js-codebase-analysis/decision-record.md` | Architecture decisions |
| `files-inventory.md` | `.opencode/specs/03--commands-and-skills/sk-code/z_archive/006-js-codebase-analysis/files-inventory.md` | This file |

---

## JavaScript Files Analyzed

### CMS Files (`src/2_javascript/cms/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `contact_office_hours.js` | 650 | Partial | camelCase naming |
| `related_articles.js` | 130 | Partial | Minor naming |
| `responsive_limit.js` | 108 | **Compliant** | None |
| `social_share.js` | 230 | **Compliant** | None |
| `table_of_content.js` | 460 | **Compliant** | None |

### Form Files (`src/2_javascript/form/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `form_persistence.js` | 632 | **Compliant** | None |
| `form_submission.js` | 1,302 | Partial | P1: cleanup tracking |
| `form_validation.js` | 1,446 | **Compliant** | P1: observer cleanup |
| `input_focus_handler.js` | 80 | Partial | P0: no cleanup, camelCase |
| `input_placeholder.js` | 146 | Partial | P0: no cleanup, camelCase |
| `input_select.js` | 501 | **Compliant** | P1: partial cleanup |
| `input_select_fs_bridge.js` | 213 | Partial | P1: observer cleanup |
| `input_upload.js` | 689 | Partial | camelCase naming |
| `search_highlight.js` | 160 | **Compliant** | None |

### Global Files (`src/2_javascript/global/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `attribute_cleanup.js` | 265 | **Compliant** | None |
| `browser_change_page_title.js` | 92 | Partial | camelCase naming |
| `browser_force_start_at_top.js` | 60 | Partial | camelCase naming |
| `conditional_visibility.js` | 85 | Partial | camelCase, no cleanup |
| `copyright.js` | 43 | Partial | camelCase naming |
| `security_external_links.js` | 86 | **Compliant** | None |
| `seo_hreflang.js` | 161 | **Compliant** | None |

### Hero Files (`src/2_javascript/hero/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `hero_blog_article.js` | 116 | Partial | Missing INIT_DELAY_MS |
| `hero_cards.js` | 551 | Partial | camelCase, missing constant |
| `hero_general.js` | 674 | Partial | camelCase, no cleanup |
| `hero_video.js` | 707 | Partial | P0: resize listener cleanup |
| `hero_webshop.js` | 370 | Partial | camelCase naming |

### Menu Files (`src/2_javascript/menu/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `accordion.js` | 62 | Partial | camelCase, P1: cleanup |
| `tab_autoplay.js` | 320 | Partial | camelCase naming |
| `tab_button.js` | 320 | Partial | P0: no cleanup |
| `tab_main.js` | 440 | Partial | camelCase naming |

### Modal Files (`src/2_javascript/modal/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `modal_cookie_consent.js` | 1,447 | **Compliant** | None |
| `modal_welcome.js` | 817 | Partial | Minor init pattern |

### Molecules Files (`src/2_javascript/molecules/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `btn_download.js` | 160 | **Compliant** | None |
| `label_product.js` | 105 | Partial | P0: no cleanup |
| `link_grid.js` | 123 | Partial | P0: no cleanup, camelCase |
| `link_hero.js` | 202 | Partial | P0: no cleanup, camelCase |

### Navigation Files (`src/2_javascript/navigation/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `nav_back_to_top.js` | 73 | Partial | camelCase, P1: observer |
| `nav_dropdown.js` | 422 | **Compliant** | None |
| `nav_language_selector.js` | 185 | Partial | 13+ camelCase violations |
| `nav_mobile_menu.js` | 843 | **Compliant** | None |
| `nav_notifications.js` | 582 | Partial | P1: cleanup |

### Swiper Files (`src/2_javascript/swiper/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `marquee_brands.js` | 131 | Partial | camelCase, P1: observer |
| `marquee_clients.js` | 131 | Partial | Duplicate of brands |
| `timeline.js` | 158 | Partial | camelCase naming |

### Video Files (`src/2_javascript/video/`)

| File | LOC | Compliance | Issues |
|------|-----|------------|--------|
| `video_background_hls.js` | 290 | Partial | P1: observer cleanup |
| `video_background_hls_hover.js` | 996 | **Compliant** | None |
| `video_player_hls.js` | 724 | Partial | P1: no cleanup API |
| `video_player_hls_scroll.js` | 942 | **Compliant** | Section numbering |

---

## Minified Files Verified (`src/2_javascript/z_minified/`)

All 44 minified files verified as functional equivalents:

```
cms/
├── contact_office_hours.js
├── related_articles.js
├── responsive_limit.js
├── social_share.js
└── table_of_content.js

form/
├── form_persistence.js
├── form_submission.js
├── form_validation.js
├── input_focus_handler.js
├── input_placeholder.js
├── input_select.js
├── input_select_fs_bridge.js
├── input_upload.js
└── search_highlight.js

global/
├── attribute_cleanup.js
├── browser_change_page_title.js
├── browser_force_start_at_top.js
├── conditional_visibility.js
├── copyright.js
├── security_external_links.js
└── seo_hreflang.js

hero/
├── hero_blog_article.js
├── hero_cards.js
├── hero_general.js
├── hero_video.js
└── hero_webshop.js

menu/
├── accordion.js
├── tab_autoplay.js
├── tab_button.js
└── tab_main.js

modal/
├── modal_cookie_consent.js
└── modal_welcome.js

molecules/
├── btn_download.js
├── label_product.js
├── link_grid.js
└── link_hero.js

navigation/
├── nav_back_to_top.js
├── nav_dropdown.js
├── nav_language_selector.js
├── nav_mobile_menu.js
└── nav_notifications.js

swiper/
├── marquee_brands.js
├── marquee_clients.js
└── timeline.js

video/
├── video_background_hls.js
├── video_background_hls_hover.js
├── video_player_hls.js
└── video_player_hls_scroll.js
```

---

## HTML Files - NOT MODIFIED

No HTML files were modified in this analysis task.

**HTML files that REFERENCE the analyzed JS files** (for future CDN updates):

| HTML File | JS Files Referenced |
|-----------|---------------------|
| `src/0_html/global.html` | All global JS files |
| `src/0_html/services/*.html` | Service-specific JS |

---

## CDN Versions - NOT UPDATED

No CDN versions were updated in this analysis task.

**Current CDN pattern observed:**
```html
<script src="https://cdn.anobel.com/js/[file].js?v=X.Y.Z"></script>
```

**Files that would need version bumps if modified:**
- All files in `src/2_javascript/z_minified/` after source changes
- Update version parameter in corresponding HTML `<script>` tags

---

## Reference Documents Used

| Document | Path | Purpose |
|----------|------|---------|
| `code_quality_standards.md` | `.opencode/skill/workflows-code/references/standards/` | Quality patterns |
| `code_style_guide.md` | `.opencode/skill/workflows-code/references/standards/` | Style conventions |
| `orchestrate.md` | `.opencode/agent/` | Multi-agent orchestration |

---

## Next Steps (If Implementation Requested)

If the user requests implementation of fixes:

1. **P0 Fixes (7 files)** - Add cleanup functions
2. **Naming Standardization (19 files)** - Convert camelCase to snake_case
3. **Minification** - Re-run minification for changed files
4. **CDN Update** - Increment version parameters in HTML
5. **Browser Testing** - Verify at 375px, 768px, 1920px viewports

---

## Compliance Summary

| Category | Compliant | Partial | Non-Compliant |
|----------|-----------|---------|---------------|
| CMS | 3 | 2 | 0 |
| Form | 4 | 5 | 0 |
| Global | 3 | 4 | 0 |
| Hero | 0 | 5 | 0 |
| Menu | 0 | 4 | 0 |
| Modal | 1 | 1 | 0 |
| Molecules | 1 | 3 | 0 |
| Navigation | 2 | 3 | 0 |
| Swiper | 0 | 3 | 0 |
| Video | 2 | 2 | 0 |
| **TOTAL** | **16 (34%)** | **31 (66%)** | **0 (0%)** |

---

*Generated by JavaScript Codebase Analysis - 2024-01-24*
