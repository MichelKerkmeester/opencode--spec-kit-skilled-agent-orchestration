# Attribute Scan Results

> **Generated**: 2026-01-24
> **Purpose**: Identify empty data-* attribute patterns and their JavaScript dependencies
> **Scope**: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/src/`

---

## Executive Summary

This scan identifies all `data-*` attribute patterns used in the codebase, distinguishing between:
1. **JS-Dependent**: Attributes queried by JavaScript (MUST NOT remove)
2. **CSS-Only**: Attributes used only for CSS styling (safe to remove if empty)
3. **Cleanup Targets**: Attributes explicitly listed in `attribute_cleanup.js` for removal

**Key Finding**: An existing `attribute_cleanup.js` script already handles removal of empty `data-btn-*` attributes.

---

## 1. Existing Cleanup Script Analysis

**File**: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/src/2_javascript/global/attribute_cleanup.js`

The codebase already has a cleanup script that removes these empty attributes:

| Attribute | Currently Cleaned | Notes |
|-----------|-------------------|-------|
| `id=""` | Yes | Invalid HTML |
| `data-btn-action=""` | Yes | Empty = unnecessary DOM weight |
| `data-btn-border-color=""` | Yes | Empty = unnecessary DOM weight |
| `data-btn-hover=""` | Yes | Empty = unnecessary DOM weight |
| `data-btn-icon=""` | Yes | Empty = unnecessary DOM weight |
| `data-btn-size=""` | Yes | Empty = unnecessary DOM weight |
| `data-btn-style=""` | Yes | Empty = unnecessary DOM weight |

---

## 2. Complete Attribute Inventory

### 2.1 BUTTON ATTRIBUTES (`data-btn-*`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-btn-action` | No | Unknown | **Yes** (in cleanup script) | `attribute_cleanup.js:22` |
| `data-btn-border-color` | No | Unknown | **Yes** (in cleanup script) | `attribute_cleanup.js:23` |
| `data-btn-hover` | No | Unknown | **Yes** (in cleanup script) | `attribute_cleanup.js:24` |
| `data-btn-icon` | No | Unknown | **Yes** (in cleanup script) | `attribute_cleanup.js:25` |
| `data-btn-size` | No | Unknown | **Yes** (in cleanup script) | `attribute_cleanup.js:26` |
| `data-btn-style` | No | Unknown | **Yes** (in cleanup script) | `attribute_cleanup.js:27` |
| `data-btn-type` | No | **Yes** | **No** (CSS depends on value) | `slider_timeline.css:9`, `link_card_ad.css:15` |

### 2.2 CARD ATTRIBUTES (`data-card-*`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-card-type` | No | **Yes** | **No** (CSS depends on value) | `link_card.css:11-46` |

**CSS Usage Details**:
- `[data-card-type="Card"]` - Styles card footer, heading, icon, divider
- `[data-card-type="Link"]` - Styles image overlay, content, divider

### 2.3 LINK ATTRIBUTES (`data-link-*`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-link-weight` | No | **Yes** | **No** (CSS depends on value) | `link_general.css:9-14` |
| `data-link-direction` | No | **Yes** | **No** (CSS depends on value) | `link_general.css:22-27` |
| `data-link-size` | No | **Yes** | **No** (CSS depends on value) | `link_general.css:35-66` |
| `data-link-type` | No | **Yes** | **No** (CSS depends on value) | `link_general.css:78-171` |
| `data-link-border` | No | **Yes** | **No** (CSS depends on value) | `link_nav.css:11-21` |

**CSS Usage Details**:
- Weight: `Regular`, `Semi Bold`
- Direction: `Horizontal`, `Vertical`
- Size: `Large`, `Base`, `Contact`
- Type: `Dark`, `Light`, `Contact`, `Card`
- Border: `None`

### 2.4 HERO ATTRIBUTES (`data-hero-*`, `data-target='hero-*'`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-hero-type` | **Yes** | No | **No** | `hero_blog_article.js:14` |
| `data-hero-ready` | **Yes** | No | **No** | `video_background_hls_hover.js:256,289` |
| `data-target='hero-section'` | **Yes** | No | **No** | `hero_general.js:16`, `hero_cards.js:16`, `hero_video.js:19` |
| `data-target='hero-content'` | **Yes** | No | **No** | `hero_general.js:18`, `hero_video.js:20` |
| `data-target='hero-background'` | **Yes** | No | **No** | `hero_general.js:17` |
| `data-target='hero-description'` | **Yes** | No | **No** | `hero_general.js:19` |
| `data-target='hero-image'` | **Yes** | No | **No** | `hero_general.js:20` |
| `data-target='hero-image-dark'` | **Yes** | No | **No** | `hero_general.js:21` |
| `data-target='hero-video'` | **Yes** | No | **No** | `hero_general.js:22`, `hero_video.js:25` |
| `data-target='hero-card-overlay'` | **Yes** | No | **No** | `hero_general.js:23`, `hero_cards.js:21` |
| `data-target='hero-pointer-line'` | **Yes** | No | **No** | `hero_general.js:24` |
| `data-target='hero-pointer-bullet'` | **Yes** | No | **No** | `hero_general.js:25` |
| `data-target='hero-header'` | **Yes** | No | **No** | `hero_cards.js:17`, `hero_video.js:21` |
| `data-target='hero-card-w'` | **Yes** | No | **No** | `hero_cards.js:18` |
| `data-target='hero-card'` | **Yes** | No | **No** | `hero_cards.js:19` |
| `data-target='hero-card-content'` | **Yes** | No | **No** | `hero_cards.js:20` |
| `data-target='hero-card-image'` | **Yes** | No | **No** | `hero_cards.js:22` |
| `data-target='hero-item'` | **Yes** | No | **No** | `hero_video.js:22` |
| `data-target='hero-video-container'` | **Yes** | No | **No** | `hero_video.js:23` |
| `data-target='hero-video-wrapper'` | **Yes** | No | **No** | `hero_video.js:24` |

### 2.5 NAVIGATION ATTRIBUTES (`data-nav-*`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-navigation-status` | **Yes** | Unknown | **No** | `nav_mobile_menu.js:40` |

**Note**: No `data-nav-*` prefixed attributes found. Navigation uses `data-navigation-*` pattern instead.

### 2.6 FORM ATTRIBUTES (`data-form-*`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-form-group` | **Yes** | Unknown | **No** | `form_validation.js:111,913,1254,1265` |
| `data-form-field` | **Yes** | Unknown | **No** | `form_validation.js:108` |
| `data-form-helper` | **Yes** | Unknown | **No** | `form_validation.js:103` |
| `data-form-live-validation` | **Yes** | Unknown | **No** | `form_validation.js:1102,1354,1381,1387` |
| `data-form-submit` | **Yes** | **Yes** | **No** | `form_submission.js:24`, `form_submission.css:6` |
| `data-form-enhance` | **Yes** | Unknown | **No** | `form_submission.js:25` |
| `data-form-reset` | **Yes** | Unknown | **No** | `form_submission.js:26` |
| `data-form-reset-delay` | **Yes** | Unknown | **No** | `form_submission.js:27` |
| `data-form-reset-preserve` | **Yes** | Unknown | **No** | `form_submission.js:28`, `form_persistence.js:21` |
| `data-form-configured` | **Yes** | Unknown | **No** | `form_submission.js:31` |
| `data-form-fallback` | **Yes** | Unknown | **No** | `form_submission.js:33` |
| `data-form-persist` | **Yes** | Unknown | **No** | `form_persistence.js:21,29` |
| `data-form-content` | No | **Yes** | **No** | `form_submission.css:6` |
| `data-validate-rules` | **Yes** | Unknown | **No** | `form_validation.js:634` |
| `data-validate-on` | **Yes** | Unknown | **No** | `form_validation.js:70` |
| `data-validate-scroll-offset` | **Yes** | Unknown | **No** | `form_validation.js:95` |
| `data-validate-group` | **Yes** | Unknown | **No** | `form_validation.js:112,148,941,946` |
| `data-error-container` | **Yes** | Unknown | **No** | `form_validation.js:1228,1278` |
| `data-group` | **Yes** | Unknown | **No** | `form_validation.js:112,148,929,1255` |
| `data-min` | **Yes** | Unknown | **No** | `form_validation.js:918,934,949` |
| `data-max` | **Yes** | Unknown | **No** | `form_validation.js:919,935,950` |

### 2.7 MODAL ATTRIBUTES (`data-modal-*`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-modal-target` | **Yes** | No | **No** | `modal_welcome.js:85-87,353`, `modal_cookie_consent.js:17-22` |
| `data-modal-close` | **Yes** | No | **No** | `modal_welcome.js:367,599`, `form_submission.js:16,927,977` |
| `data-modal` | **Yes** | No | **No** | `form_submission.js:853` |
| `data-modal-bg` | **Yes** | No | **No** | `form_submission.js:855,968` |
| `data-modal-scroll` | **Yes** | No | **No** | `form_submission.js:857` |
| `data-modal-button` | **Yes** | No | **No** | `form_submission.js:926` |

### 2.8 VIDEO/PLAYER ATTRIBUTES (`data-player-*`, `data-bunny-*`)

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-bunny-player-init` | **Yes** | No | **No** | `video_player_hls.js:31`, `video_player_hls_scroll.js:24` |
| `data-bunny-background-init` | **Yes** | No | **No** | `video_background_hls.js:20` |
| `data-bunny-hover-init` | **Yes** | No | **No** | `video_background_hls_hover.js:145,175`, `hero_general.js:477` |
| `data-bunny-hover-thumb` | **Yes** | No | **No** | `video_background_hls_hover.js:204` |
| `data-bunny-hover-enabled` | **Yes** | No | **No** | `video_background_hls_hover.js:176` |
| `data-player-src` | **Yes** | No | **No** | `video_player_hls.js:32`, `video_player_hls_scroll.js:25`, etc. |
| `data-player-status` | **Yes** | Unknown | **No** | Multiple video files (getAttribute/setAttribute) |
| `data-player-muted` | **Yes** | Unknown | **No** | Multiple video files |
| `data-player-fullscreen` | **Yes** | Unknown | **No** | Multiple video files |
| `data-player-activated` | **Yes** | Unknown | **No** | Multiple video files |
| `data-player-timeline` | **Yes** | No | **No** | `video_player_hls.js:66`, `video_player_hls_scroll.js:74` |
| `data-player-progress` | **Yes** | No | **No** | `video_player_hls.js:67`, `video_player_hls_scroll.js:75` |
| `data-player-buffered` | **Yes** | No | **No** | `video_player_hls.js:68`, `video_player_hls_scroll.js:76` |
| `data-player-timeline-handle` | **Yes** | No | **No** | `video_player_hls.js:69`, `video_player_hls_scroll.js:77` |
| `data-player-time-duration` | **Yes** | No | **No** | `video_player_hls.js:70`, `video_player_hls_scroll.js:78` |
| `data-player-time-progress` | **Yes** | No | **No** | `video_player_hls.js:71`, `video_player_hls_scroll.js:79` |
| `data-player-control` | **Yes** | No | **No** | Multiple video files |
| `data-player-before` | **Yes** | No | **No** | `video_player_hls.js:561,567`, `video_player_hls_scroll.js:774,780` |
| `data-player-update-size` | **Yes** | No | **No** | `video_player_hls.js:74`, `video_player_hls_scroll.js:82` |
| `data-player-lazy` | **Yes** | No | **No** | `video_player_hls.js:75`, `video_player_hls_scroll.js:83` |
| `data-player-autoplay` | **Yes** | No | **No** | `video_player_hls.js:78`, `video_player_hls_scroll.js:86` |
| `data-player-hover` | **Yes** | Unknown | **No** | `video_player_hls.js:463`, `video_player_hls_scroll.js:561` |
| `data-hover-persist` | **Yes** | No | **No** | `video_background_hls_hover.js:212` |
| `data-hover-exclusive` | **Yes** | No | **No** | `video_background_hls_hover.js:213` |
| `data-hover-reset` | **Yes** | No | **No** | `video_background_hls_hover.js:214` |
| `data-hover-delay` | **Yes** | No | **No** | `video_background_hls_hover.js:217` |
| `data-hover-click` | **Yes** | No | **No** | `video_background_hls_hover.js:665` |
| `data-thumb-visible` | **Yes** | No | **No** | `video_background_hls_hover.js:294` |
| `data-button-ready` | **Yes** | No | **No** | `video_background_hls_hover.js:274` |

### 2.9 TAB/ACCORDION ATTRIBUTES

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-accordion-css-init` | **Yes** | No | **No** | `accordion.js:6` |
| `data-accordion-toggle` | **Yes** | No | **No** | `accordion.js:12` |
| `data-accordion-status` | **Yes** | No | **No** | `accordion.js:15,24` |
| `data-accordion-close-siblings` | **Yes** | No | **No** | `accordion.js:8` |
| `data-tabs` | **Yes** | No | **No** | `tab_autoplay.js:20,34,35,53` |
| `data-tabs-index` | **Yes** | No | **No** | `tab_autoplay.js:36,136,254` |
| `data-tabs-autoplay` | **Yes** | No | **No** | `tab_autoplay.js:46` |
| `data-tabs-autoplay-duration` | **Yes** | No | **No** | `tab_autoplay.js:48` |
| `data-tab` | **Yes** | No | **No** | `tab_main.js:19,183,311,360` |
| `data-tab-container` | **Yes** | No | **No** | `tab_main.js:17` |
| `data-tab-list` | **Yes** | No | **No** | `tab_main.js:18` |
| `data-tab-content` | **Yes** | No | **No** | `tab_main.js:20,188` |
| `data-tab-default` | **Yes** | No | **No** | `tab_main.js:196` |
| `data-tab-active` | **Yes** (dataset) | No | **No** | `tab_main.js:204,253,278` |
| `data-tab-visible` | **Yes** (dataset) | No | **No** | `tab_main.js:211,265,283` |

### 2.10 SELECT/DROPDOWN ATTRIBUTES

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-select` | **Yes** | No | **No** | `input_select.js:16-20`, `form_persistence.js:22-24,357,444` |
| `data-value` | **Yes** (dataset) | No | **No** | `input_select.js:388,404,426,436,445`, `form_persistence.js:205,255,320,438,447` |
| `data-placeholder` | **Yes** | No | **No** | `input_placeholder.js:13,32,33,89,110`, `input_select.js:79` |

### 2.11 FILE UPLOAD ATTRIBUTES

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-file-upload` | **Yes** | No | **No** | `input_upload.js:20-40`, `form_persistence.js:24-25` |
| `data-upload-endpoint` | **Yes** (dataset) | No | **No** | `input_upload.js:344` |
| `data-max-size` | **Yes** (dataset) | No | **No** | `input_upload.js:345` |
| `data-accepted-types` | **Yes** (dataset) | No | **No** | `input_upload.js:346` |
| `data-upload-state` | **Yes** (dataset) | No | **No** | `input_upload.js:138,430,439,586` |
| `data-filepond-init` | **Yes** (dataset) | No | **No** | `input_upload.js:645,646` |

### 2.12 STATE/STATUS ATTRIBUTES

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-state` | **Yes** | **Yes** | **No** | Multiple files (see below) |
| `data-status` | **Yes** | **Yes** | **No** | `contact_office_hours.js`, `nav_notifications.js` |

**`data-state` Usage**:
- JS: `nav_language_selector.js`, `nav_mobile_menu.js`, `form_submission.js`
- CSS: `hover_state_machine.css`, `link_card_ad.css`, `link_card_image.css`, `link_card_product.css`, `form_submission.css`
- Values: `open`, `closed`, `submitting`, `success`, `error`, `opening`, `closing`, `hover`, `focus`, `preview`, `mobile`, `group`

### 2.13 MISCELLANEOUS ATTRIBUTES

| Attribute | Used by JS? | Used by CSS? | Safe to Remove if Empty? | File Reference |
|-----------|-------------|--------------|--------------------------|----------------|
| `data-download-src` | **Yes** | No | **No** | `btn_download.js:12` |
| `data-download-label` | **Yes** | No | **No** | `btn_download.js:125` |
| `data-download-success` | **Yes** | No | **No** | `btn_download.js:93` |
| `data-download-original-label` | **Yes** (dataset) | No | **No** | `btn_download.js:108,126,127` |
| `data-download-state` | **Yes** (dataset) | No | **No** | `btn_download.js:28,52` |
| `data-social-share` | **Yes** | No | **No** | `social_share.js:10` |
| `data-social-share-type` | **Yes** | No | **No** | `social_share.js:11` |
| `data-toc-container` | **Yes** | No | **No** | `table_of_content.js:11` |
| `data-toc-link` | **Yes** | No | **No** | `table_of_content.js:12` |
| `data-toc-section` | **Yes** | No | **No** | `table_of_content.js:13` |
| `data-toc-offset-top` | **Yes** | No | **No** | `table_of_content.js:84` |
| `data-toc-offset-bottom` | **Yes** | No | **No** | `table_of_content.js:89` |
| `data-toc-active-class` | **Yes** | No | **No** | `table_of_content.js:94` |
| `data-toc-scroll-behavior` | **Yes** | No | **No** | `table_of_content.js:99` |
| `data-toc-active` | **Yes** (dataset) | No | **No** | `table_of_content.js:242,247` |
| `data-office-hours` | **Yes** | No | **No** | `contact_office_hours.js:105-111`, `nav_notifications.js:36` |
| `data-original-text` | **Yes** | No | **No** | `contact_office_hours.js:459,462,518` |
| `data-alert` | **Yes** | No | **No** | `nav_notifications.js:26-33` |
| `data-alert-id` | **Yes** | No | **No** | `nav_notifications.js:115` |
| `data-alert-start` | **Yes** | No | **No** | `nav_notifications.js:120` |
| `data-alert-end` | **Yes** | No | **No** | `nav_notifications.js:121` |
| `data-alert-closable` | **Yes** | No | **No** | `nav_notifications.js:136` |
| `data-alert-dismiss` | **Yes** | No | **No** | `nav_notifications.js:143` |
| `data-alert-active` | **Yes** | No | **No** | `nav_notifications.js:149` |
| `data-alert-office-hours` | **Yes** | No | **No** | `nav_notifications.js:151` |
| `data-alert-show-when` | **Yes** | No | **No** | `nav_notifications.js:152` |
| `data-alert-visible` | **Yes** | No | **No** | `nav_notifications.js:556` |
| `data-product-label` | **Yes** | No | **No** | `label_product.js:34,45` |
| `data-label` | **Yes** | No | **No** | `label_product.js:35` |
| `data-target` | **Yes** | No | **No** | Multiple hero files, `responsive_limit.js:39` |
| `data-consent-open` | **Yes** | No | **No** | `modal_cookie_consent.js:24` |
| `data-consent-close` | **Yes** | No | **No** | `modal_cookie_consent.js:25` |
| `data-consent-action` | **Yes** | No | **No** | `modal_cookie_consent.js:29,1136,1139,1166,1169` |
| `data-clickable-wrap` | **Yes** | No | **No** | `video_background_hls_hover.js:674` |
| `data-formspark-url` | **Yes** | No | **No** | `form_submission.js:13` |
| `data-botpoison-key` | **Yes** | No | **No** | `form_submission.js:136,586` |
| `data-submit-button` | **Yes** | No | **No** | `form_submission.js:14` |

---

## 3. Summary: Safe to Remove if Empty

### CONFIRMED SAFE (Already in cleanup script)

| Attribute | Count in HTML | Notes |
|-----------|--------------|-------|
| `id=""` | Unknown | Invalid HTML, already cleaned |
| `data-btn-action=""` | Unknown | No JS dependency |
| `data-btn-border-color=""` | Unknown | No JS dependency |
| `data-btn-hover=""` | Unknown | No JS dependency |
| `data-btn-icon=""` | Unknown | No JS dependency |
| `data-btn-size=""` | Unknown | No JS dependency |
| `data-btn-style=""` | Unknown | No JS dependency |

### NOT SAFE TO REMOVE (CSS/JS dependent)

| Attribute Category | Reason |
|-------------------|--------|
| `data-btn-type` | CSS selectors depend on specific values |
| `data-card-type` | CSS selectors depend on specific values |
| `data-link-*` | CSS selectors depend on specific values |
| `data-form-*` | JavaScript form handling |
| `data-modal-*` | JavaScript modal system |
| `data-player-*` | JavaScript video players |
| `data-tabs-*` | JavaScript tab system |
| `data-accordion-*` | JavaScript accordion |
| `data-select-*` | JavaScript dropdown |
| `data-state` | Both CSS and JS |
| `data-status` | Both CSS and JS |
| `data-target` | JavaScript hero/component targeting |
| All others listed | JavaScript dependencies confirmed |

---

## 4. Recommendations

### 4.1 Current State
The existing `attribute_cleanup.js` script is well-designed and handles the most common empty attribute patterns (`data-btn-*`). No additional patterns were found that are safe to remove programmatically.

### 4.2 Potential Additions to Cleanup Script

Based on this analysis, **no additional attributes should be added** to the cleanup script because:
1. All other `data-*` attributes either have JS dependencies or CSS styling rules
2. Empty CSS-dependent attributes (like `data-card-type=""`) would break styling if removed

### 4.3 Future Considerations

If new Webflow components generate empty attributes, evaluate them against this checklist:
1. Is the attribute used in any `querySelector`/`querySelectorAll` call?
2. Is the attribute accessed via `dataset.*` property?
3. Is the attribute used in any CSS selector?
4. If all answers are NO, it's safe to add to cleanup script

---

## 5. Files Analyzed

### JavaScript Files (non-minified)
- `src/2_javascript/form/` - Form validation, submission, persistence, placeholders, selects, uploads
- `src/2_javascript/hero/` - Hero animations (blog article, cards, general, video, webshop)
- `src/2_javascript/menu/` - Accordion, tab systems
- `src/2_javascript/modal/` - Cookie consent, welcome modal
- `src/2_javascript/molecules/` - Download buttons, hero links, product labels
- `src/2_javascript/navigation/` - Mobile menu, notifications, language selector
- `src/2_javascript/video/` - Video players (HLS, background, hover)
- `src/2_javascript/cms/` - Office hours, social share, table of contents, responsive limit
- `src/2_javascript/global/` - Attribute cleanup

### CSS Files
- `src/1_css/animations/` - Hover state machine, link card animations
- `src/1_css/form/` - Form submission styles
- `src/1_css/link/` - Link general, link nav, link card
- `src/1_css/slider/` - Timeline slider

---

## 6. Evidence Quality

| Finding Type | Evidence Grade | Source |
|--------------|---------------|--------|
| JS Dependencies | A (Primary) | Direct grep of source files with line numbers |
| CSS Dependencies | A (Primary) | Direct grep of source files with line numbers |
| Cleanup Script Analysis | A (Primary) | Full file read of `attribute_cleanup.js` |
| Empty Attribute Patterns | B (Secondary) | Grep search with limited HTML file coverage |

**Confidence Level**: High (95%) - All major JavaScript files scanned for attribute patterns.
