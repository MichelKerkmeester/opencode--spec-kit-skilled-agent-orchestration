---
title: "Feature Specification: Notification Time-Based Scheduling [013-notification-time-scheduling/spec]"
description: "Enable time-based scheduling for CMS alerts, allowing notifications to appear at specific times rather than just dates."
trigger_phrases:
  - "feature"
  - "specification"
  - "notification"
  - "time"
  - "based"
  - "spec"
  - "013"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Notification Time-Based Scheduling

Enable time-based scheduling for CMS alerts, allowing notifications to appear at specific times rather than just dates.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: notifications, scheduling, time, cms, alerts
- **Priority**: P1
- **Feature Branch**: `013-notification-time-scheduling`
- **Created**: 2025-12-29
- **Status**: In Progress
- **Input**: User report that 09:50 AM scheduled notification didn't appear at the specified time

### Stakeholders
- Development (implementation)
- Content team (CMS management)

### Purpose
Enable content managers to schedule notifications for specific times (e.g., "show at 09:50 AM") in addition to dates. Currently, the system only supports date-based scheduling where all times are normalized to midnight.

### Problem Statement
The current notification system ignores time components in CMS date fields:
1. CMS outputs date strings like "December 29, 2025" (no time)
2. JavaScript normalizes all dates to midnight for comparison
3. Result: Cannot schedule alerts for specific times within a day

### Assumptions
- Webflow CMS DateTime fields CAN include time when configured
- JavaScript Date() constructor handles various date/time string formats
- Backward compatibility with existing date-only alerts is required

---
<!-- /ANCHOR:objective -->

<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- Detect time presence in CMS date attribute strings
- Implement dual-mode date comparison (exact time vs. midnight)
- Maintain backward compatibility with date-only scheduling
- Update debug logging to show comparison mode
- CDN version update for cache busting
- Webflow configuration guide for enabling time in date fields

### Out of Scope
- Timezone selection (uses browser local time)
- Recurring schedules (e.g., "every day at 9 AM")
- Separate time fields in CMS (uses existing DateTime fields)
- Toast notifications (only banner alerts currently implemented)

---
<!-- /ANCHOR:scope -->

<!-- ANCHOR:users-stories -->
## 3. USERS & STORIES

### User Story 1 - Time-Based Alert Scheduling (Priority: P0)

As a content manager, I need to schedule alerts for specific times so that time-sensitive announcements appear exactly when needed.

**Why This Priority**: P0 because this is the core feature request.

**Acceptance Scenarios**:
1. **Given** I set start time to "December 29, 2025 2:00 PM", **When** it's 1:59 PM, **Then** the alert is hidden
2. **Given** I set start time to "December 29, 2025 2:00 PM", **When** it's 2:01 PM, **Then** the alert is visible
3. **Given** I set end time to "December 29, 2025 5:00 PM", **When** it's 5:01 PM, **Then** the alert is hidden

### User Story 2 - Backward Compatibility (Priority: P0)

As a content manager with existing date-only alerts, I need them to continue working without modification.

**Why This Priority**: P0 because breaking existing functionality is unacceptable.

**Acceptance Scenarios**:
1. **Given** an existing alert with start date "December 29, 2025" (no time), **When** it's any time on Dec 29, **Then** the alert shows all day
2. **Given** an existing alert with end date "December 29, 2025" (no time), **When** it's 11:59 PM on Dec 29, **Then** the alert is still visible
3. **Given** an existing alert with end date "December 29, 2025" (no time), **When** it's 12:01 AM on Dec 30, **Then** the alert is hidden

---
<!-- /ANCHOR:users-stories -->

<!-- ANCHOR:functional-requirements -->
## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** System MUST detect time presence in date attribute strings using pattern matching
- **REQ-FUNC-002:** System MUST use exact timestamp comparison when time is present
- **REQ-FUNC-003:** System MUST use midnight comparison for start dates without time (backward compatible)
- **REQ-FUNC-004:** System MUST use end-of-day (23:59:59) comparison for end dates without time
- **REQ-FUNC-005:** System MUST log comparison mode in debug output
- **REQ-FUNC-006:** System MUST handle mixed scenarios (start with time, end without time)

### Time Detection Pattern
The system detects time using regex: `/(\d{1,2}:\d{2})|([AP]M)|T\d{2}:/i`

Matches:
- "9:50" or "09:50" (colon-separated time)
- "AM" or "PM" (12-hour format indicators)
- "T12:" (ISO 8601 format)

---
<!-- /ANCHOR:functional-requirements -->

<!-- ANCHOR:non-functional-requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Time detection must add < 1ms per alert
- **NFR-P02**: No additional DOM queries required

### Compatibility
- **NFR-C01**: Must work with all existing Webflow date formats
- **NFR-C02**: Must not break existing alerts without time

---
<!-- /ANCHOR:non-functional-requirements -->

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

| Scenario | Input | Expected Behavior |
|----------|-------|-------------------|
| Date only, start | "December 29, 2025" | Show from midnight (00:00:00) |
| Date only, end | "December 29, 2025" | Show until 23:59:59 |
| DateTime, start | "December 29, 2025 9:50 AM" | Show from 09:50:00 exactly |
| DateTime, end | "December 29, 2025 3:00 PM" | Hide after 15:00:00 exactly |
| Mixed: time start, date end | Start: "Dec 29 9:50 AM", End: "Dec 30" | Start at 9:50, end at Dec 30 23:59:59 |
| Empty dates | null/undefined | No date restriction (always show) |
| Malformed date | "invalid" | Treated as no date (null) |

---
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

- **SC-001**: Alerts with time show/hide at exact specified times
- **SC-002**: Existing date-only alerts continue working unchanged
- **SC-003**: Debug logging shows "exact time" vs "midnight" comparison mode
- **SC-004**: No console errors or warnings
- **SC-005**: CDN version updated for cache busting

---
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| nav_notifications.js | Internal | ✅ Exists | Cannot implement |
| Webflow DateTime fields | External | ⚠️ Needs verification | May need workaround |
| CDN (R2) | External | ✅ Available | Cannot deploy |

---
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:changelog -->
## 9. CHANGELOG

### v1.0 (2025-12-29)
- Initial specification
- Defined time detection pattern
- Established backward compatibility requirements
<!-- /ANCHOR:changelog -->
