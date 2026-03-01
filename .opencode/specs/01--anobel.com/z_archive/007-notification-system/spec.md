---
title: "Feature Specification: Notification System - Requirements & User Stories [007-notification-system/spec]"
description: "CMS-driven notification system for navbar banners and hero toasts with office hours integration."
trigger_phrases:
  - "feature"
  - "specification"
  - "notification"
  - "system"
  - "requirements"
  - "spec"
  - "007"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Notification System - Requirements & User Stories

CMS-driven notification system for navbar banners and hero toasts with office hours integration.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Feature
- **Tags**: notifications, cms, office-hours, webflow
- **Priority**: P1
- **Feature Branch**: `008-notification-system`
- **Created**: 2025-12-20
- **Status**: In Progress
- **Input**: User request for CMS-connected notifications in navbar and hero, with office hours integration

### Stakeholders
- Development (implementation)
- Content team (CMS management)

### Purpose
Enable content managers to display site-wide notifications (maintenance alerts, special hours) via Webflow CMS, with automatic integration to existing office hours system for holiday closures.

### Assumptions
- Webflow CMS is the content source (confirmed)
- Notifications rendered via Webflow embed connected to CMS
- Only one notification displayed at a time (highest priority)
- Positioning/placement handled in Webflow Designer (not JavaScript)
- Office hours script (`contact_office_hours.js`) already deployed and working
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- CMS collection "Notifications" with scheduling and display fields
- JavaScript to filter active notifications by date/priority
- localStorage dismiss tracking with configurable reset behavior
- Office hours integration via MutationObserver
- Auto-show notifications on holidays (from office hours config)
- CMS override capability for holiday notifications
- Banner notifications (navbar area)
- Toast notifications (hero area, closable)

### Out of Scope
- CSS positioning/layout (handled in Webflow Designer)
- Animation effects (static appear/disappear per user preference)
- Multiple simultaneous notifications (only highest priority shown)
- Push notifications or browser notifications
- Email/SMS notification delivery
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:users--stories -->
## 3. USERS & STORIES

### User Story 1 - Content Manager Creates Notification (Priority: P0)

As a content manager, I need to create notifications in Webflow CMS so that visitors see important announcements without developer involvement.

**Why This Priority**: P0 because this is the core value proposition - CMS-driven content management.

**Independent Test**: Can create a notification in CMS, set dates, and see it appear on the live site.

**Acceptance Scenarios**:
1. **Given** I'm in Webflow CMS, **When** I create a notification with title, description, and date range, **Then** it appears on the site during that date range
2. **Given** a notification exists, **When** I set `is-active` to false, **Then** it stops displaying regardless of dates
3. **Given** multiple notifications exist, **When** they overlap in time, **Then** only the highest priority one displays

---

### User Story 2 - Visitor Dismisses Notification (Priority: P1)

As a visitor, I want to dismiss closable notifications so they don't obstruct my browsing experience.

**Why This Priority**: P1 because dismissal is essential UX but not blocking for basic functionality.

**Independent Test**: Can click X on a toast notification and it disappears, stays dismissed appropriately.

**Acceptance Scenarios**:
1. **Given** a closable toast notification is visible, **When** I click the X button, **Then** it disappears immediately
2. **Given** I dismissed a notification with `dismiss-behavior: day`, **When** I return the next day, **Then** the notification reappears
3. **Given** I dismissed a notification with `dismiss-behavior: session`, **When** I close and reopen the browser, **Then** the notification reappears

---

### User Story 3 - Auto-Holiday Notifications (Priority: P1)

As a visitor, I want to see when Nobel is closed for holidays so I know not to expect service.

**Why This Priority**: P1 because it leverages existing office hours logic and provides automatic value.

**Independent Test**: On a holiday (or simulated), a notification appears without CMS entry.

**Acceptance Scenarios**:
1. **Given** today is a holiday in the office hours config, **When** no CMS notification exists for today, **Then** an auto-generated holiday notification appears
2. **Given** today is a holiday, **When** a CMS notification exists for today, **Then** the CMS notification takes precedence (override)
3. **Given** the office hours indicator shows "closed", **When** a notification has `show-when: when-closed`, **Then** that notification becomes visible

---

### User Story 4 - Banner vs Toast Display (Priority: P1)

As a content manager, I want to choose where notifications appear (navbar banner or hero toast) based on the message importance.

**Why This Priority**: P1 because display location affects user attention and message hierarchy.

**Independent Test**: Can set notification type in CMS and see it render in correct location.

**Acceptance Scenarios**:
1. **Given** notification type is "banner", **When** it's active, **Then** it displays in the navbar area
2. **Given** notification type is "toast", **When** it's active, **Then** it displays in the hero area with close button
3. **Given** notification type is "both", **When** it's active, **Then** it displays in both locations
<!-- /ANCHOR:users--stories -->

---

<!-- ANCHOR:functional-requirements -->
## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** System MUST read notification data from Webflow CMS via DOM data attributes
- **REQ-FUNC-002:** System MUST filter notifications by current date (start-date ≤ now ≤ end-date)
- **REQ-FUNC-003:** System MUST respect `is-active` switch as manual override
- **REQ-FUNC-004:** System MUST display only the highest priority notification when multiple are active
- **REQ-FUNC-005:** System MUST support three notification types: banner, toast, both
- **REQ-FUNC-006:** System MUST track dismissals in localStorage with configurable reset behavior
- **REQ-FUNC-007:** System MUST observe office hours status changes via MutationObserver
- **REQ-FUNC-008:** System MUST auto-generate holiday notifications when no CMS override exists
- **REQ-FUNC-009:** System MUST allow CMS notifications to override auto-generated ones
- **REQ-FUNC-010:** Toast notifications MUST have a close button when `is-closable` is true

### Traceability Mapping

| User Story | Related Requirements |
|------------|---------------------|
| Story 1 - CMS Creation | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004 |
| Story 2 - Dismiss | REQ-FUNC-006, REQ-FUNC-010 |
| Story 3 - Auto-Holiday | REQ-FUNC-007, REQ-FUNC-008, REQ-FUNC-009 |
| Story 4 - Display Type | REQ-FUNC-005 |
<!-- /ANCHOR:functional-requirements -->

---

<!-- ANCHOR:non-functional-requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Notification check must complete within 50ms of page load
- **NFR-P02**: localStorage operations must not block main thread

### Usability
- **NFR-U01**: Notifications must be visible on all viewport sizes (responsive)
- **NFR-U02**: Close button must have minimum 44x44px touch target
- **NFR-U03**: Notifications must work without JavaScript (graceful degradation via CSS)

### Compatibility
- **NFR-C01**: Must work in Chrome, Firefox, Safari, Edge (latest 2 versions)
- **NFR-C02**: Must integrate with existing Webflow initialization pattern
- **NFR-C03**: Must not conflict with existing modal system or Lenis scroll
<!-- /ANCHOR:non-functional-requirements -->

---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Data Boundaries
- What happens when no notifications exist in CMS? → Nothing displays (silent)
- What happens when notification has no end-date? → Displays indefinitely until manually deactivated
- What happens when start-date is in the future? → Not displayed until start-date

### Error Scenarios
- What happens when CMS data attributes are malformed? → Skip that notification, log warning
- What happens when localStorage is unavailable? → Dismissals don't persist (show every time)

### State Transitions
- What happens when notification expires while page is open? → Remains visible until page refresh
- What happens when office hours status changes? → MutationObserver triggers re-evaluation
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

### Measurable Outcomes
- **SC-001**: Content manager can create and publish notification in < 2 minutes
- **SC-002**: Notification appears within 100ms of page load
- **SC-003**: Dismiss state persists correctly per configured behavior
- **SC-004**: Holiday notifications auto-appear without CMS entry
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:dependencies--risks -->
## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| contact_office_hours.js | Internal | ✅ Deployed | Holiday integration won't work |
| Webflow CMS | External | ✅ Available | Cannot store notifications |
| localStorage API | Browser | ✅ Standard | Dismissals won't persist |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | CMS structure changes break parsing | High | Low | Use defensive parsing with fallbacks |
| R-002 | Office hours script not loaded first | Med | Low | Check for indicator element before observing |
<!-- /ANCHOR:dependencies--risks -->

---

<!-- ANCHOR:out-of-scope -->
## 9. OUT OF SCOPE

- **PDF/print styling** - Not needed for notifications
- **Analytics tracking** - Can be added later via GTM
- **A/B testing** - Future enhancement
- **Notification sounds** - Not requested
<!-- /ANCHOR:out-of-scope -->

---

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

All questions resolved:
- ✅ Display location: Webflow handles positioning
- ✅ Multiple notifications: Show only highest priority
- ✅ Animation: Static (no animation)
- ✅ Holiday content: CMS-driven text via embed
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:appendix -->
## 11. APPENDIX

### CMS Collection Structure: "Notifications"

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `name` | Plain Text | Yes | Internal identifier |
| `notification-type` | Option | Yes | banner / toast / both |
| `title` | Plain Text | Yes | Main message text |
| `description` | Plain Text | No | Secondary text |
| `icon` | Option | No | bell / warning / info / maintenance |
| `priority` | Number | Yes | Sort order (higher = more important) |
| `is-closable` | Switch | Yes | Show X button (toast only) |
| `dismiss-behavior` | Option | Yes | session / day / until-end-date |
| `link-url` | URL | No | Optional CTA destination |
| `link-text` | Plain Text | No | CTA button text |
| `start-date` | DateTime | No | When to start showing |
| `end-date` | DateTime | No | When to stop showing |
| `is-active` | Switch | Yes | Manual override |
| `link-to-office-hours` | Switch | No | Enable office hours integration |
| `show-when` | Option | No | always / when-open / when-closed |

### Data Attribute Convention

```html
<!-- Hidden CMS Collection List -->
<div data-notification-container style="display:none">
  <div data-notification-item
       data-notification-id="[cms-id]"
       data-notification-type="toast"
       data-notification-priority="10"
       data-notification-closable="true"
       data-notification-dismiss="day"
       data-notification-start="2025-04-26T00:00:00"
       data-notification-end="2025-04-26T23:59:59"
       data-notification-office-hours="true"
       data-notification-show-when="when-closed">
    <span data-notification-title>Nobel sluit vandaag om 15:00</span>
    <span data-notification-description>Vanwege een feestdag</span>
    <span data-notification-link-url></span>
    <span data-notification-link-text></span>
  </div>
</div>

<!-- Visible Banner (CMS-bound) -->
<div data-notification-banner>
  <!-- Webflow binds CMS fields here -->
</div>

<!-- Visible Toast (CMS-bound) -->
<div data-notification-toast>
  <!-- Webflow binds CMS fields here -->
  <button data-notification-close>×</button>
</div>
```
<!-- /ANCHOR:appendix -->

---

<!-- ANCHOR:changelog -->
## 12. CHANGELOG

### v1.0 (2025-12-20)
**Initial specification**
- Defined CMS collection structure
- Documented office hours integration approach
- Established data attribute conventions
<!-- /ANCHOR:changelog -->
