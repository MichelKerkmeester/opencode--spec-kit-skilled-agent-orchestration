---
title: "Implementation Plan: Notification Time-Based Scheduling [013-notification-time-scheduling/plan]"
description: "Step-by-step implementation plan for adding time-based scheduling to the notification system."
trigger_phrases:
  - "implementation"
  - "plan"
  - "notification"
  - "time"
  - "based"
  - "013"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Notification Time-Based Scheduling

Step-by-step implementation plan for adding time-based scheduling to the notification system.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Metadata
- **Category**: Implementation Plan
- **Estimated Effort**: 2-3 hours
- **Risk Level**: Low (additive change, backward compatible)
- **Created**: 2025-12-29

### Summary
Add time-based scheduling capability to nav_notifications.js by:
1. Detecting time presence in date strings
2. Implementing dual-mode comparison (exact time vs. midnight)
3. Updating CDN version for deployment

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:implementation-phases -->
## 2. IMPLEMENTATION PHASES

### Phase 1: Code Changes (nav_notifications.js)

#### Step 1.1: Add Time Detection Helper
**Location**: After line 91 (after `log()` function)

```javascript
function has_time_component(str) {
  if (!str) return false;
  // Matches: "9:50", "09:50", "AM", "PM", "T12:" (ISO)
  return /(\d{1,2}:\d{2})|([AP]M)|T\d{2}:/i.test(str);
}
```

#### Step 1.2: Modify parse_alert_item()
**Location**: Lines 124-136 (return object)

Add two new properties:
```javascript
return {
  // ... existing properties ...
  startHasTime: has_time_component(start_date_attr),
  endHasTime: has_time_component(end_date_attr),
};
```

#### Step 1.3: Rewrite is_within_date_range()
**Location**: Lines 189-225

Replace with dual-mode comparison:
```javascript
function is_within_date_range(alert) {
  const now = new Date();

  // START DATE CHECK
  if (alert.startDate) {
    if (alert.startHasTime) {
      // Exact time comparison
      log(`${alert.id}: comparing now (${now.toLocaleTimeString()}) vs startDate (${alert.startDate.toLocaleTimeString()}) [EXACT TIME]`);
      if (now < alert.startDate) {
        log(`${alert.id}: blocked - current time is before start time`);
        return false;
      }
    } else {
      // Date-only: compare at midnight (legacy behavior)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const start_local = new Date(
        alert.startDate.getFullYear(),
        alert.startDate.getMonth(),
        alert.startDate.getDate()
      );
      log(`${alert.id}: comparing today (${today.toDateString()}) vs startDate (${start_local.toDateString()}) [MIDNIGHT]`);
      if (today < start_local) {
        log(`${alert.id}: blocked - today is before startDate`);
        return false;
      }
    }
  } else {
    log(`${alert.id}: no startDate set, skipping start date check`);
  }

  // END DATE CHECK
  if (alert.endDate) {
    if (alert.endHasTime) {
      // Exact time comparison
      log(`${alert.id}: comparing now (${now.toLocaleTimeString()}) vs endDate (${alert.endDate.toLocaleTimeString()}) [EXACT TIME]`);
      if (now > alert.endDate) {
        log(`${alert.id}: blocked - current time is after end time`);
        return false;
      }
    } else {
      // Date-only: compare at END of day (23:59:59.999)
      const end_of_day = new Date(
        alert.endDate.getFullYear(),
        alert.endDate.getMonth(),
        alert.endDate.getDate(),
        23, 59, 59, 999
      );
      log(`${alert.id}: comparing now vs endDate end-of-day (${end_of_day.toLocaleString()}) [END OF DAY]`);
      if (now > end_of_day) {
        log(`${alert.id}: blocked - now is after end of day`);
        return false;
      }
    }
  }

  return true;
}
```

### Phase 2: Minification

Run the project's minification script:
```bash
node scripts/minify-webflow.mjs
```

Verify output at: `src/2_javascript/z_minified/navigation/nav_notifications.js`

### Phase 3: CDN Version Update

**File**: `src/0_html/global.html`
**Line**: ~150

Change:
```
nav_notifications.js?v=1.1.09
```
To:
```
nav_notifications.js?v=1.1.10
```

### Phase 4: Deployment

1. Upload minified script to R2 CDN
2. Verify new version loads on anobel.com
3. Test with debug mode enabled

---
<!-- /ANCHOR:implementation-phases -->

<!-- ANCHOR:testing-strategy -->
## 3. TESTING STRATEGY

### Unit Tests (Manual)
1. Parse date-only string → startHasTime should be false
2. Parse datetime string → startHasTime should be true
3. Regex matches: "9:50", "09:50", "AM", "PM", "T12:"

### Integration Tests (Browser)
1. Create alert with future time → should be hidden
2. Create alert with past time → should be visible
3. Existing date-only alerts → should work unchanged

### Debug Commands
```javascript
AnobelAlerts.debug(true);
AnobelAlerts.getAll(); // Check startHasTime/endHasTime
AnobelAlerts.refresh(); // See comparison mode in logs
```

---
<!-- /ANCHOR:testing-strategy -->

<!-- ANCHOR:rollback-plan -->
## 4. ROLLBACK PLAN

If issues occur:
1. Revert global.html to use v=1.1.09
2. Previous version remains on CDN
3. No database or CMS changes to revert

---
<!-- /ANCHOR:rollback-plan -->

<!-- ANCHOR:files-modified -->
## 5. FILES MODIFIED

| File | Change Type | Description |
|------|-------------|-------------|
| `src/2_javascript/navigation/nav_notifications.js` | Modified | Add time detection and dual-mode comparison |
| `src/2_javascript/z_minified/navigation/nav_notifications.js` | Regenerated | Minified version |
| `src/0_html/global.html` | Modified | CDN version bump |

---
<!-- /ANCHOR:files-modified -->

<!-- ANCHOR:changelog -->
## 6. CHANGELOG

### v1.0 (2025-12-29)
- Initial implementation plan
<!-- /ANCHOR:changelog -->
