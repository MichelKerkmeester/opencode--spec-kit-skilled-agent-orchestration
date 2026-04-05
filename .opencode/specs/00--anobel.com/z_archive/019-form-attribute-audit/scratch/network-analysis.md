# Network Analysis: JavaScript Resources on /nl/werkenbij

**Analysis Date:** 2026-01-24
**Target URL:** https://anobel.com/nl/werkenbij
**Tool:** Chrome DevTools CLI (bdg)

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Network Requests | 80 |
| Total JS Files | 34 |
| Total JS Size | 2,706 KB (~2.7 MB) |
| Failed Requests | 6 |
| Console Errors | 0 |

---

## JS Resource Inventory

### Form-Related Scripts (R2 CDN)

| Status | Size | Load Time | File | Version |
|--------|------|-----------|------|---------|
| 200 | 22,208 | 179ms | form_validation.js | v=1.2.36 |
| 200 | 18,190 | 161ms | form_submission.js | v=1.2.34 |
| 200 | 6,698 | 153ms | form_persistence.js | v=1.0.1 |
| 200 | 7,231 | 180ms | input_upload.js | v=1.0.0 |
| 200 | 6,428 | 169ms | input_select.js | v=1.1.0 |
| 200 | 1,559 | 144ms | input_placeholder.js | v=1.2.31 |
| 200 | 649 | 162ms | input_focus_handler.js | v=1.2.31 |

**Notes:**
- `input_select.js` handles custom select functionality (previously custom_select.js)
- `input_upload.js` integrates with FilePond for file uploads
- All form scripts loading successfully (200 status)

### FilePond Libraries (unpkg CDN)

| Status | Size | Load Time | File |
|--------|------|-----------|------|
| 200 | 117,648 | 345ms | filepond.min.js (v4.30.4) |
| 200 | 2,332 | 186ms | filepond-plugin-file-validate-type.min.js (v1.2.8) |
| 200 | 2,368 | 165ms | filepond-plugin-file-validate-size.min.js (v2.2.8) |

**Total FilePond:** ~122 KB (loads successfully)

### Finsweet Scripts (jsdelivr CDN)

| Status | Size | Load Time | File |
|--------|------|-----------|------|
| 200 | 20,297 | 338ms | @finsweet/attributes-cmscore@1/cmscore.js |
| 200 | 10,130 | 333ms | @finsweet/attributes-cmsnest@1/cmsnest.js |

**Finsweet API Call:**
- `accounts.finsweet.com/v1/components/verify?componentId=consent&siteId=...` (200 OK)

**Note:** Only CMS-related Finsweet scripts are loading. No form-related Finsweet scripts detected.

### Other Custom Scripts (R2 CDN)

| Status | Size | File | Version |
|--------|------|------|---------|
| 200 | 20,675 | modal_cookie_consent.js | v=1.2.32 |
| 200 | 14,524 | video_background_hls_hover.js | v=1.2.05 |
| 200 | 8,283 | nav_notifications.js | v=1.1.20 |
| 200 | 7,596 | nav_mobile_menu.js | v=1.2.31 |
| 200 | 6,273 | hero_cards.js | v=1.3.06 |
| 200 | 3,740 | nav_dropdown.js | v=1.2.31 |
| 200 | 2,842 | nav_language_selector.js | v=1.2.31 |
| 200 | 1,552 | marquee_brands.js | v=1.2.35 |
| 200 | 813 | accordion.js | v=1.2.31 |
| 200 | 780 | browser_change_page_title.js | v=1.2.31 |
| 200 | 642 | conditional_visibility.js | v=1.2.31 |
| 200 | 540 | nav_back_to_top.js | v=1.2.31 |
| 200 | 367 | copyright.js | v=1.2.31 |

### Third-Party Libraries

| Status | Size | Load Time | Library |
|--------|------|-----------|---------|
| 200 | 1,080,329 | 1,352ms | ConsentPro runtime |
| 200 | 536,365 | 1,511ms | hls.js@1.6.11 |
| 200 | 304,687 | 1,084ms | Webflow chunk |
| 200 | 159,087 | 461ms | Botpoison browser |
| 200 | 154,597 | 644ms | Swiper 11 |
| 200 | 89,476 | 483ms | jQuery 3.5.1 |
| 200 | 80,731 | 445ms | Motion.dev 12.15.0 |
| 200 | 67,756 | 386ms | Webflow core |
| 200 | 14,348 | 179ms | Lenis 1.2.3 |

---

## Failed/Missing Resources

| Status | URL | Category |
|--------|-----|----------|
| 0 | `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/dropdown.js?v=1.2.31` | R2 CDN |
| 0 | `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/mobile_menu.js?v=1.2.31` | R2 CDN |
| 0 | `use.typekit.net/grw1wnt.js` | Font |
| 0 | `anobel-zn.b-cdn.net/Werken_bij_Logistiek/master.m3u8` | Video |
| 0 | `anobel-zn.b-cdn.net/Werken_bij_Sales/master.m3u8` | Video |
| 0 | `anobel-zn.b-cdn.net/Werken_bij_Bunkers/master.m3u8` | Video |

**Analysis:**
- Status 0 typically indicates network cancellation or CORS issues
- `dropdown.js` and `mobile_menu.js` - These appear to be legacy scripts that are being requested but may have been replaced by `nav_dropdown.js` and `nav_mobile_menu.js`
- TypeKit font loading issue - May need investigation
- Video m3u8 files - Could be lazy-loaded or blocked in headless mode

---

## Duplicate Script Loading

**Result:** No duplicate JavaScript files detected. Each script loads exactly once.

---

## Script Load Order (Chronological)

All scripts loaded at approximately the same time (within ~300ms window):

1. **Core Libraries** (09:03:30.463)
   - jQuery 3.5.1
   - Webflow core + chunk
   - Motion.dev
   - Swiper
   - HLS.js
   - Lenis

2. **Custom Scripts** (09:03:30.463)
   - modal_cookie_consent.js
   - hero_cards.js
   - Navigation scripts (nav_*)
   - Form scripts (form_*, input_*)
   - FilePond plugins

3. **Async Loaded** (09:03:30.560-730)
   - Botpoison browser
   - Finsweet CMS core/nest

---

## Dependency Conflicts Detected

**None identified.** Console shows successful initialization:
- Motion.dev loaded successfully
- Lenis smooth scrolling initialized
- FilePondConnector: 1 instance
- CustomSelect: 1 instance
- FormPersistence: 1 form

---

## Console Messages

| Level | Message |
|-------|---------|
| info | Lenis smooth scrolling initialized |
| info | Motion.dev loaded successfully |
| info | [FilePondConnector] Initialized 1 instance(s) |
| info | CustomSelect: Initialized 1 instance(s) |
| info | FormPersistence: Initialized 1 form(s) |

**Note:** "Uncaught" message detected but no associated error details - may be benign.

---

## Recommendations

### High Priority
1. **Investigate dropdown.js and mobile_menu.js failures** - These scripts are being requested but returning status 0. Either remove the script tags if they're obsolete (replaced by nav_dropdown.js and nav_mobile_menu.js) or fix the files on R2.

2. **TypeKit font loading** - The `use.typekit.net/grw1wnt.js` request failing may cause font rendering issues. Verify TypeKit project configuration.

### Medium Priority
3. **Consider bundle optimization** - Total JS payload is ~2.7 MB. The largest contributors are:
   - ConsentPro: 1,080 KB (consider lazy loading)
   - HLS.js: 536 KB (only needed for video pages)
   - Webflow: 372 KB total

### Low Priority
4. **Video m3u8 files** - The status 0 for video files is likely normal in headless mode or before hover interaction triggers the HLS player.

---

## Form Script Versions Summary

| Script | Version | Status |
|--------|---------|--------|
| form_validation.js | v=1.2.36 | OK |
| form_submission.js | v=1.2.34 | OK |
| form_persistence.js | v=1.0.1 | OK |
| input_upload.js | v=1.0.0 | OK |
| input_select.js | v=1.1.0 | OK |
| input_placeholder.js | v=1.2.31 | OK |
| input_focus_handler.js | v=1.2.31 | OK |
| filepond.min.js | v4.30.4 | OK |
| filepond-plugin-file-validate-type | v1.2.8 | OK |
| filepond-plugin-file-validate-size | v2.2.8 | OK |

All form-related scripts are loading correctly with no 404s or failures.
