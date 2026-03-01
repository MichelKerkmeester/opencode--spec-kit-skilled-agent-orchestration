# Alert System Test Cases

Manual testing checklist for the notification/alert system.

---

<!-- ANCHOR:prerequisites -->
## Prerequisites

Before testing:
1. Ensure script is loaded on the page
2. Clear browser storage: `AnobelAlerts.clearDismissals()`
3. Enable debug mode: `AnobelAlerts.debug(true)`
<!-- /ANCHOR:prerequisites -->

---

<!-- ANCHOR:test-case-1-basic-display -->
## Test Case 1: Basic Display

**Goal:** Verify alert appears when Active is ON

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 1 |
| Heading | Test alert message |
| Active | ON |
| Closable | OFF |
| Office Hours | OFF |

### Steps
1. Publish CMS changes
2. Visit page with alert container
3. Open browser console

### Expected
- [ ] Alert is visible in navbar
- [ ] Console shows: `[Alert] Showing: test-alert-1`
- [ ] `AnobelAlerts.getVisible()` returns the alert object

### Cleanup
- Set Active to OFF or delete item
<!-- /ANCHOR:test-case-1-basic-display -->

---

<!-- ANCHOR:test-case-2-active-toggle -->
## Test Case 2: Active Toggle

**Goal:** Verify Active switch controls visibility

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 2 |
| Heading | Active toggle test |
| Active | OFF |

### Steps
1. Visit page - alert should NOT show
2. Edit CMS: Set Active to ON
3. Publish and refresh page
4. Alert should now show

### Expected
- [ ] Alert hidden when Active = OFF
- [ ] Alert visible when Active = ON
<!-- /ANCHOR:test-case-2-active-toggle -->

---

<!-- ANCHOR:test-case-3-date-range---future-start -->
## Test Case 3: Date Range - Future Start

**Goal:** Alert doesn't show before start date

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 3 |
| Heading | Future alert |
| Active | ON |
| Start Date | Tomorrow's date |
| End Date | (empty) |

### Steps
1. Visit page today

### Expected
- [ ] Alert NOT visible (before start date)
- [ ] Console shows: `[Alert] test-alert-3: outside date range`
<!-- /ANCHOR:test-case-3-date-range---future-start -->

---

<!-- ANCHOR:test-case-4-date-range---past-end -->
## Test Case 4: Date Range - Past End

**Goal:** Alert doesn't show after end date

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 4 |
| Heading | Expired alert |
| Active | ON |
| Start Date | (empty) |
| End Date | Yesterday's date |

### Steps
1. Visit page today

### Expected
- [ ] Alert NOT visible (past end date)
- [ ] Console shows: `[Alert] test-alert-4: outside date range`
<!-- /ANCHOR:test-case-4-date-range---past-end -->

---

<!-- ANCHOR:test-case-5-close-button---session-dismiss -->
## Test Case 5: Close Button - Session Dismiss

**Goal:** Dismissal persists until browser close

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 5 |
| Heading | Session dismiss test |
| Active | ON |
| Closable | ON |
| How long should dismissal last? | session |

### Steps
1. Visit page - alert shows
2. Click close button
3. Refresh page (same tab)
4. Close browser completely
5. Reopen browser and visit page

### Expected
- [ ] After step 2: Alert hidden
- [ ] After step 3: Alert still hidden (sessionStorage persists)
- [ ] After step 5: Alert visible again (new session)
<!-- /ANCHOR:test-case-5-close-button---session-dismiss -->

---

<!-- ANCHOR:test-case-6-close-button---day-dismiss -->
## Test Case 6: Close Button - Day Dismiss

**Goal:** Dismissal persists until midnight

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 6 |
| Heading | Day dismiss test |
| Active | ON |
| Closable | ON |
| How long should dismissal last? | day |

### Steps
1. Visit page - alert shows
2. Click close button
3. Refresh page
4. Close and reopen browser
5. (Next day) Visit page again

### Expected
- [ ] After steps 2-4: Alert hidden
- [ ] After step 5: Alert visible (new day)

**Alternative test:** Manually change system date or modify localStorage:
```javascript
// Force "yesterday" in storage
const key = 'anobel_alert_dismissed';
const data = JSON.parse(localStorage.getItem(key) || '{}');
data['test-alert-6'] = '2020-01-01'; // Past date
localStorage.setItem(key, JSON.stringify(data));
location.reload();
// Alert should now show
```
<!-- /ANCHOR:test-case-6-close-button---day-dismiss -->

---

<!-- ANCHOR:test-case-7-close-button---until-end-date-dismiss -->
## Test Case 7: Close Button - Until End Date Dismiss

**Goal:** Dismissal persists until alert's end date

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 7 |
| Heading | Until-end dismiss test |
| Active | ON |
| Closable | ON |
| End Date | 3 days from now |
| How long should dismissal last? | until-end-date |

### Steps
1. Visit page - alert shows
2. Click close button
3. Refresh, close browser, etc.

### Expected
- [ ] Alert stays hidden until end date passes
- [ ] After end date: Alert won't show anyway (expired)
<!-- /ANCHOR:test-case-7-close-button---until-end-date-dismiss -->

---

<!-- ANCHOR:test-case-8-office-hours---when-open -->
## Test Case 8: Office Hours - When Open

**Goal:** Alert shows only when office is OPEN

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 8 |
| Heading | Office open only |
| Active | ON |
| Office Hours | ON |
| When Office Hours is ON | when-open |

### Steps
1. Check current office status: `AnobelAlerts.getOfficeStatus()`
2. If "open": alert should show
3. If "closed": alert should NOT show

### Expected
- [ ] Alert visible when office status = "open"
- [ ] Alert hidden when office status = "closed"
- [ ] Console shows office hours mismatch when hidden

**Manual status change test:**
```javascript
// Find the indicator and change status
const indicator = document.querySelector('[data-office-hours="indicator"]');
indicator.setAttribute('data-status', 'open');  // or 'closed'
// Alert should update automatically via MutationObserver
```
<!-- /ANCHOR:test-case-8-office-hours---when-open -->

---

<!-- ANCHOR:test-case-9-office-hours---when-closed -->
## Test Case 9: Office Hours - When Closed

**Goal:** Alert shows only when office is CLOSED

### Setup (CMS)
| Field | Value |
|-------|-------|
| Name | Test Alert 9 |
| Heading | Office closed only |
| Active | ON |
| Office Hours | ON |
| When Office Hours is ON | when-closed |

### Steps
1. Same as Test Case 8, but inverted

### Expected
- [ ] Alert visible when office status = "closed"
- [ ] Alert hidden when office status = "open"
<!-- /ANCHOR:test-case-9-office-hours---when-closed -->

---

<!-- ANCHOR:test-case-10-cms-order-priority -->
## Test Case 10: CMS Order Priority

**Goal:** First eligible alert in CMS order wins

### Setup (CMS)
Create 3 alerts in this order (top to bottom):

**Alert A** (top)
| Field | Value |
|-------|-------|
| Name | Alert A |
| Heading | I should show first |
| Active | ON |

**Alert B** (middle)
| Field | Value |
|-------|-------|
| Name | Alert B |
| Heading | I'm second |
| Active | ON |

**Alert C** (bottom)
| Field | Value |
|-------|-------|
| Name | Alert C |
| Heading | I'm last |
| Active | ON |

### Steps
1. Visit page
2. Verify Alert A shows
3. In CMS, drag Alert C to the top
4. Publish and refresh

### Expected
- [ ] Step 2: Alert A visible, B & C hidden
- [ ] Step 4: Alert C visible, A & B hidden
<!-- /ANCHOR:test-case-10-cms-order-priority -->

---

<!-- ANCHOR:test-case-11-no-container -->
## Test Case 11: No Container

**Goal:** Script handles missing container gracefully

### Steps
1. Remove `data-alert="container"` from the page (temporarily)
2. Refresh page
3. Check console

### Expected
- [ ] No JavaScript errors
- [ ] Console shows: `[Alert] No alert container found`
- [ ] `AnobelAlerts.getAll()` returns empty array
<!-- /ANCHOR:test-case-11-no-container -->

---

<!-- ANCHOR:test-case-12-empty-collection -->
## Test Case 12: Empty Collection

**Goal:** Script handles no CMS items gracefully

### Setup
- Delete all items from Alerts collection (or set all to inactive)

### Steps
1. Publish
2. Visit page
3. Check console

### Expected
- [ ] No JavaScript errors
- [ ] Console shows: `[Alert] No alerts found`
- [ ] `AnobelAlerts.getVisible()` returns null
<!-- /ANCHOR:test-case-12-empty-collection -->

---

<!-- ANCHOR:console-commands-reference -->
## Console Commands Reference

```javascript
// Enable detailed logging
AnobelAlerts.debug(true);

// View all parsed alerts
AnobelAlerts.getAll();

// View currently visible alert
AnobelAlerts.getVisible();

// Check office hours status
AnobelAlerts.getOfficeStatus();

// Clear all dismissals (show alerts again)
AnobelAlerts.clearDismissals();

// Force refresh display
AnobelAlerts.refresh();
```
<!-- /ANCHOR:console-commands-reference -->

---

<!-- ANCHOR:quick-smoke-test -->
## Quick Smoke Test

Run these tests for a quick sanity check:

1. **Basic visibility:** Create active alert, verify it shows
2. **Close button:** Click close, refresh, verify it stays hidden
3. **Active toggle:** Turn off, verify hidden; turn on, verify shows
4. **Office hours:** Toggle indicator status, verify alert updates
<!-- /ANCHOR:quick-smoke-test -->

---

<!-- ANCHOR:notes -->
## Notes

- Tests assume script filename: `contact_notifications.js`
- Office hours indicator: `[data-office-hours="indicator"]` with `data-status`
- Storage keys: `anobel_alert_dismissed` (localStorage + sessionStorage)
<!-- /ANCHOR:notes -->
