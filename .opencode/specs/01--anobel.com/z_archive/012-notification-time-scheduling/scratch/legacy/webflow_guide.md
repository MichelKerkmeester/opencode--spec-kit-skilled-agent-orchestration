# Webflow Configuration & Testing Guide: Time-Based Scheduling

Step-by-step guide for configuring and testing time-based notification scheduling.

---

<!-- ANCHOR:prerequisites -->
## 1. PREREQUISITES

Before testing, ensure:
- [ ] Updated `nav_notifications.js` (v1.1.10) is uploaded to R2 CDN
- [ ] Webflow site is published with latest embed code
- [ ] You have access to Webflow CMS

---
<!-- /ANCHOR:prerequisites -->

<!-- ANCHOR:webflow-cms-configuration -->
## 2. WEBFLOW CMS CONFIGURATION

### Step 2.1: Verify DateTime Field Settings

1. Go to **Webflow Designer** → **CMS** → **Alerts** collection
2. Click on the **Start Date** field settings (gear icon)
3. Verify **"Include time"** is enabled
4. Repeat for **End Date** field

> ⚠️ **CRITICAL**: If "Include time" is NOT enabled, the time component will not be saved or output to the data attribute.

### Step 2.2: Check Attribute Binding

1. In Webflow Designer, select the alert item element
2. Open **Settings** panel → **Custom Attributes**
3. Verify `data-alert-start` is bound to the Start Date field
4. Verify `data-alert-end` is bound to the End Date field

---
<!-- /ANCHOR:webflow-cms-configuration -->

<!-- ANCHOR:testing-scenarios -->
## 3. TESTING SCENARIOS

### Test 1: Verify Time is Output (CRITICAL FIRST TEST)

**Purpose**: Confirm Webflow outputs time in the data attribute.

**Steps**:
1. In CMS, edit an alert and set Start Date to a specific time (e.g., "December 30, 2025 2:00 PM")
2. Publish the site
3. Open browser DevTools (F12) → Console
4. Run: `document.querySelector('[data-alert-start]')?.getAttribute('data-alert-start')`

**Expected Result**:
```
"December 30, 2025 2:00 PM"  ← Time included ✅
```

**If you see**:
```
"December 30, 2025"  ← Time NOT included ❌
```
→ The CMS field doesn't have "Include time" enabled, or Webflow strips time from attribute bindings.

---

### Test 2: Future Start Time (Alert Should Be Hidden)

**Setup**:
1. Create/edit an alert in CMS
2. Set Start Date to **30 minutes from now** (e.g., if it's 2:00 PM, set to 2:30 PM)
3. Set End Date to tomorrow
4. Ensure Active = ON
5. Publish

**Verify**:
1. Open the site in a new incognito window
2. The alert should NOT be visible
3. In Console, run:
   ```javascript
   AnobelAlerts.debug(true);
   AnobelAlerts.refresh();
   ```
4. Look for log: `[Alert] alert-xxx: blocked - current time is before start time`

**Wait 30 minutes**, then refresh:
- The alert should now be visible
- Log should show: `[Alert] Showing: alert-xxx`

---

### Test 3: Past Start Time (Alert Should Be Visible)

**Setup**:
1. Create/edit an alert in CMS
2. Set Start Date to **30 minutes ago** (e.g., if it's 2:00 PM, set to 1:30 PM)
3. Set End Date to tomorrow
4. Ensure Active = ON
5. Publish

**Verify**:
1. Open the site - alert should be visible immediately
2. In Console with debug enabled, look for:
   ```
   [Alert] alert-xxx: comparing now (2:00:00 PM) vs startDate (1:30:00 PM) [EXACT TIME]
   [Alert] Showing: alert-xxx
   ```

---

### Test 4: Past End Time (Alert Should Be Hidden)

**Setup**:
1. Create/edit an alert in CMS
2. Set Start Date to yesterday
3. Set End Date to **30 minutes ago** (e.g., if it's 2:00 PM, set to 1:30 PM today)
4. Ensure Active = ON
5. Publish

**Verify**:
1. Open the site - alert should NOT be visible
2. In Console with debug enabled, look for:
   ```
   [Alert] alert-xxx: blocked - current time is after end time
   ```

---

### Test 5: Backward Compatibility (Date-Only)

**Setup**:
1. Create/edit an alert in CMS
2. Set Start Date to **today** (date only, no specific time)
3. Set End Date to **today** (date only, no specific time)
4. Ensure Active = ON
5. Publish

**Verify**:
1. Alert should be visible ALL DAY (from midnight to 23:59:59)
2. In Console with debug enabled, look for:
   ```
   [Alert] alert-xxx: comparing today (Mon Dec 30 2025) vs startDate (Mon Dec 30 2025) [MIDNIGHT]
   [Alert] alert-xxx: comparing now vs endDate end-of-day (12/30/2025, 11:59:59 PM) [END OF DAY]
   ```

---
<!-- /ANCHOR:testing-scenarios -->

<!-- ANCHOR:debug-commands -->
## 4. DEBUG COMMANDS

Open browser Console (F12) and use these commands:

```javascript
// Enable debug logging
AnobelAlerts.debug(true);

// See all parsed alerts with time flags
AnobelAlerts.getAll();
// Look for: startHasTime: true/false, endHasTime: true/false

// Force refresh and see comparison logs
AnobelAlerts.refresh();

// Check current visible alert
AnobelAlerts.getVisible();

// Clear any dismissed alerts (for testing)
AnobelAlerts.clearDismissals();
```

---
<!-- /ANCHOR:debug-commands -->

<!-- ANCHOR:expected-log-output -->
## 5. EXPECTED LOG OUTPUT

### With Time (Exact Comparison)
```
[Alert] alert-xxx: comparing now (2:15:30 PM) vs startDate (2:00:00 PM) [EXACT TIME]
[Alert] alert-xxx: comparing now (2:15:30 PM) vs endDate (5:00:00 PM) [EXACT TIME]
[Alert] Showing: alert-xxx
```

### Without Time (Legacy Comparison)
```
[Alert] alert-xxx: comparing today (Mon Dec 30 2025) vs startDate (Mon Dec 30 2025) [MIDNIGHT]
[Alert] alert-xxx: comparing now vs endDate end-of-day (12/30/2025, 11:59:59 PM) [END OF DAY]
[Alert] Showing: alert-xxx
```

---
<!-- /ANCHOR:expected-log-output -->

<!-- ANCHOR:troubleshooting -->
## 6. TROUBLESHOOTING

### Issue: Time Not Appearing in Attribute

**Symptom**: `data-alert-start="December 30, 2025"` (no time)

**Solutions**:
1. Check CMS field has "Include time" enabled
2. Re-bind the attribute in Webflow Designer
3. Clear Webflow cache and republish

### Issue: Alert Not Showing at Expected Time

**Check**:
1. Is the alert Active = ON?
2. Is there another alert with higher priority (earlier in CMS order)?
3. Was the alert previously dismissed? Run `AnobelAlerts.clearDismissals()`
4. Is office hours blocking it? Check `AnobelAlerts.getOfficeStatus()`

### Issue: Script Not Updated

**Verify version**:
```javascript
// In Console, check the script src
document.querySelector('script[src*="nav_notifications"]')?.src
// Should show: ...nav_notifications.js?v=1.1.10
```

If showing old version, hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---
<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:deployment-checklist -->
## 7. DEPLOYMENT CHECKLIST

- [ ] Upload `nav_notifications.js` (minified) to R2 CDN
- [ ] Verify CDN URL returns v1.1.10 content
- [ ] Update Webflow embed if needed
- [ ] Publish Webflow site
- [ ] Test in incognito window
- [ ] Verify debug logs show [EXACT TIME] for datetime alerts
- [ ] Verify backward compatibility with date-only alerts

---
<!-- /ANCHOR:deployment-checklist -->

<!-- ANCHOR:rollback -->
## 8. ROLLBACK

If issues occur:
1. Change `global.html` back to `v=1.1.09`
2. Previous version remains on CDN
3. No CMS changes needed
<!-- /ANCHOR:rollback -->
