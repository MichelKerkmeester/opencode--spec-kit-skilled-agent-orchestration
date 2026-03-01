# Phase 2: Code Alignment Changes

> Date: 2025-12-22
> Spec: 03--commands-and-skills/sk-code/z_archive/001-workflows-code-codebase-alignment

---

## Summary

| Change Type | Files Modified |
|-------------|----------------|
| snake_case refactor | 1 JS file |
| prefers-reduced-motion | 3 JS files |
| Minification | 4 JS files |
| Version updates | 16 HTML files |

---

## JavaScript Changes

### 1. nav_notifications.js (snake_case refactor)

**Path:** `src/2_javascript/navigation/nav_notifications.js`

| Old Name | New Name |
|----------|----------|
| `getStorage` | `get_storage` |
| `setStorage` | `set_storage` |
| `getTodayKey` | `get_today_key` |
| `parseDate` | `parse_date` |
| `parseBool` | `parse_bool` |
| `hashCode` | `hash_code` |
| `parseAlertItem` | `parse_alert_item` |
| `parseAllAlerts` | `parse_all_alerts` |
| `isDismissed` | `is_dismissed` |
| `isWithinDateRange` | `is_within_date_range` |
| `passesOfficeHoursCondition` | `passes_office_hours_condition` |
| `shouldShow` | `should_show` |
| `updateVisibility` | `update_visibility` |
| `dismissAlert` | `dismiss_alert` |
| `bindCloseHandlers` | `bind_close_handlers` |
| `getOfficeHoursStatus` | `get_office_hours_status` |
| `observeOfficeHours` | `observe_office_hours` |
| `closeBtn` | `close_btn` |
| `newStatus` | `new_status` |
| `startLocal` | `start_local` |
| `endLocal` | `end_local` |
| `hasExplicitAttrs` | `has_explicit_attrs` |
| `startDateAttr` | `start_date_attr` |
| `endDateAttr` | `end_date_attr` |
| `textContent` (var) | `text_content` |

**Preserved:** Public API (`getAll`, `getVisible`, `getOfficeStatus`, `clearDismissals`), CONFIG properties, object properties

---

### 2. hero_general.js (prefers-reduced-motion)

**Path:** `src/2_javascript/hero/hero_general.js`

**Added:**
- Line 8: `const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;`
- Lines 140-146: Early return in `setup_initial_states()`
- Lines 319-327: Early return in `init_hero_animation()` with event dispatch

---

### 3. hero_cards.js (prefers-reduced-motion)

**Path:** `src/2_javascript/hero/hero_cards.js`

**Added:**
- Line 8: `const PREFERS_REDUCED_MOTION = ...`
- Lines 194-200: Early return in `setup_initial_states()`
- Lines 318-326: Early return in `init_hero_animation()` with event dispatch

---

### 4. hero_video.js (prefers-reduced-motion)

**Path:** `src/2_javascript/hero/hero_video.js`

**Added:**
- Line 11: `const PREFERS_REDUCED_MOTION = ...`
- Lines 248-254: Early return in `setup_initial_states()`
- Lines 384-392: Early return in `init_video_animation()` with event dispatch

---

## Minified Files

**Path:** `src/2_javascript/z_minified/`

| File | Status |
|------|--------|
| `nav_notifications.js` | Updated |
| `hero_general.js` | Updated |
| `hero_cards.js` | Updated |
| `hero_video.js` | Updated |

---

## HTML Version Updates

### nav_notifications.js (1.0.06 → 1.0.07)

| File | References |
|------|------------|
| `src/0_html/global.html` | 1 |

### hero_general.js (1.2.21 → 1.2.22)

| File | References |
|------|------------|
| `src/0_html/cms/vacature.html` | 2 |
| `src/0_html/cms/blog.html` | 2 |
| `src/0_html/nobel/n4_het_team.html` | 2 |
| `src/0_html/nobel/n2_isps_kade.html` | 2 |
| `src/0_html/nobel/n5_brochures.html` | 2 |
| `src/0_html/services/d1_bunkering.html` | 2 |
| `src/0_html/services/d2_filtratie.html` | 2 |
| `src/0_html/services/d3_uitrusting.html` | 2 |
| `src/0_html/services/d4_maatwerk.html` | 2 |

### hero_cards.js (1.2.03 → 1.2.04)

| File | References |
|------|------------|
| `src/0_html/voorwaarden.html` | 2 |
| `src/0_html/contact.html` | 2 |
| `src/0_html/cms/werken_bij.html` | 2 |

### hero_video.js (1.2.05 → 1.2.06)

| File | References |
|------|------------|
| `src/0_html/home.html` | 2 |
| `src/0_html/nobel/n1_dit_is_nobel.html` | 2 |
| `src/0_html/nobel/n3_de_locatie.html` | 2 |

---

## Pending

- [ ] Upload minified files to Cloudflare R2
- [ ] Browser verification
