---
title: "Implementation Plan: Notification System - Technical Approach [01--anobel.com/z_archive/007-notification-system/plan]"
description: "Implementation plan for CMS-driven notification system with office hours integration."
trigger_phrases:
  - "implementation"
  - "plan"
  - "notification"
  - "system"
  - "technical"
  - "007"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Notification System - Technical Approach & Architecture

Implementation plan for CMS-driven notification system with office hours integration.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: notifications, cms, javascript, webflow
- **Priority**: P1
- **Branch**: `007-notification-system`
- **Date**: 2025-12-20
- **Spec**: [spec.md](./spec.md)

### Summary
Build a JavaScript notification system that reads from Webflow CMS via data attributes, filters by date/priority, tracks dismissals in localStorage, and integrates with the existing office hours script for automatic holiday notifications.

### Technical Context

- **Language/Version**: JavaScript ES6+ (vanilla, no framework)
- **Primary Dependencies**: None (standalone, optional Motion.dev for future animations)
- **Storage**: localStorage for dismiss state
- **Testing**: Manual browser testing + Webflow preview
- **Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Project Type**: Single script addition to existing Webflow project
- **Constraints**: Must not conflict with existing scripts, must follow project patterns
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] CMS structure defined
- [x] Data attribute convention established
- [x] Office hours integration approach confirmed

### Definition of Done (DoD)
- [ ] JavaScript passes lint (no errors)
- [ ] Works in all target browsers
- [ ] Dismissals persist correctly
- [ ] Office hours integration functional
- [ ] CMS can control all notification aspects

### Rollback Guardrails
- **Stop Signals**: Script errors in console, notifications not appearing, conflicts with other scripts
- **Recovery Procedure**: Remove script from Webflow, notifications fall back to CSS-only visibility
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:project-structure -->
## 3. PROJECT STRUCTURE

### Documentation (This Feature)

```
.opencode/specs/01--anobel.com/z_archive/007-notification-system/
  spec.md              # Feature specification ✅
  plan.md              # This file ✅
  checklist.md         # Validation checklist ✅
  scratch/             # Debug files, test data
  memory/              # Session context
```

### Source Code

```
src/
  2_javascript/
    notification_system.js     # NEW: Main notification logic
  1_css/
    notification/
      notification.css         # NEW: Base notification styles (optional)
```

**Note**: Primary styling handled in Webflow Designer. CSS file only for JavaScript-controlled states.
<!-- /ANCHOR:project-structure -->

---

<!-- ANCHOR:implementation-phases -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: CMS Setup (Webflow - Manual)

- **Goal**: Create CMS collection and page components
- **Deliverables**:
  - "Notifications" CMS collection with all fields
  - Hidden collection list on global embed (data source)
  - Banner component with CMS bindings
  - Toast component with CMS bindings and close button
- **Owner**: Developer + Webflow
- **Duration**: 1-2 hours

### Phase 2: Core JavaScript

- **Goal**: Implement notification parsing and display logic
- **Deliverables**:
  - `notification_system.js` with:
    - CMS data parsing from DOM
    - Date range filtering
    - Priority-based selection (highest only)
    - Show/hide logic for banner and toast
    - Close button handler
- **Owner**: Developer
- **Duration**: 2-3 hours
- **Parallel Tasks**: None (sequential)

### Phase 3: Dismiss Persistence

- **Goal**: Implement localStorage dismiss tracking
- **Deliverables**:
  - Dismiss state storage with notification ID
  - Reset behavior: session, day, until-end-date
  - Content hash for detecting notification changes
- **Owner**: Developer
- **Duration**: 1 hour

### Phase 4: Office Hours Integration

- **Goal**: Connect to existing office hours system
- **Deliverables**:
  - MutationObserver on `[data-office-hours="indicator"]`
  - Conditional display based on open/closed status
  - Auto-holiday notification generation (when no CMS override)
- **Owner**: Developer
- **Duration**: 1-2 hours

### Phase 5: Testing & Refinement

- **Goal**: Verify all scenarios work correctly
- **Deliverables**:
  - Test all dismiss behaviors
  - Test date range filtering
  - Test office hours integration
  - Test priority ordering
  - Cross-browser verification
- **Owner**: Developer
- **Duration**: 1 hour
<!-- /ANCHOR:implementation-phases -->

---

<!-- ANCHOR:technical-design -->
<!-- /ANCHOR:phases -->
## 5. TECHNICAL DESIGN

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PAGE LOAD                                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. PARSE CMS DATA                                                  │
│     - Query [data-notification-container]                           │
│     - Extract all [data-notification-item] elements                 │
│     - Build notification objects from data attributes               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. FILTER ACTIVE NOTIFICATIONS                                     │
│     - Check is-active === true                                      │
│     - Check start-date <= now <= end-date                           │
│     - Check localStorage for dismissals                             │
│     - Check office hours conditions (if linked)                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. SELECT HIGHEST PRIORITY                                         │
│     - Sort by priority (descending)                                 │
│     - Take first notification only                                  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. DISPLAY NOTIFICATION                                            │
│     - If type === 'banner': show [data-notification-banner]         │
│     - If type === 'toast': show [data-notification-toast]           │
│     - If type === 'both': show both                                 │
│     - Bind close button handler                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. OFFICE HOURS OBSERVER (Background)                              │
│     - MutationObserver on [data-office-hours="indicator"]           │
│     - On status change: re-run filter + display logic               │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Code Patterns

**1. Initialization (following project pattern)**
```javascript
(() => {
  const INIT_FLAG = '__notificationSystemCdnInit';
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;
  
  // ... implementation
  
  const start = () => { /* ... */ };
  
  if (window.Webflow?.push) {
    window.Webflow.push(start);
  } else {
    start();
  }
})();
```

**2. CMS Data Parsing**
```javascript
function parseNotifications() {
  const container = document.querySelector('[data-notification-container]');
  if (!container) return [];
  
  return Array.from(container.querySelectorAll('[data-notification-item]')).map(item => ({
    id: item.getAttribute('data-notification-id'),
    type: item.getAttribute('data-notification-type'),
    priority: parseInt(item.getAttribute('data-notification-priority') || '0', 10),
    closable: item.getAttribute('data-notification-closable') === 'true',
    dismissBehavior: item.getAttribute('data-notification-dismiss') || 'session',
    startDate: item.getAttribute('data-notification-start'),
    endDate: item.getAttribute('data-notification-end'),
    officeHoursLinked: item.getAttribute('data-notification-office-hours') === 'true',
    showWhen: item.getAttribute('data-notification-show-when') || 'always',
    title: item.querySelector('[data-notification-title]')?.textContent?.trim() || '',
    description: item.querySelector('[data-notification-description]')?.textContent?.trim() || '',
  }));
}
```

**3. localStorage Dismiss Pattern**
```javascript
const STORAGE_PREFIX = 'notif-dismissed-';

function isDismissed(notification) {
  const key = STORAGE_PREFIX + notification.id;
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (!data) return false;
    
    const { dismissedAt, behavior } = data;
    const now = Date.now();
    
    switch (behavior) {
      case 'session':
        return true; // Session = until page refresh (handled by sessionStorage instead)
      case 'day':
        return new Date(dismissedAt).toDateString() === new Date(now).toDateString();
      case 'until-end-date':
        return notification.endDate ? now < new Date(notification.endDate).getTime() : true;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

function setDismissed(notification) {
  const key = STORAGE_PREFIX + notification.id;
  const data = { dismissedAt: Date.now(), behavior: notification.dismissBehavior };
  
  if (notification.dismissBehavior === 'session') {
    sessionStorage.setItem(key, JSON.stringify(data));
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
```

**4. Office Hours Observer**
```javascript
function setupOfficeHoursObserver(onStatusChange) {
  const indicator = document.querySelector('[data-office-hours="indicator"]');
  if (!indicator) return;
  
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-status') {
        const status = indicator.getAttribute('data-status');
        onStatusChange(status); // 'open' or 'closed'
      }
    }
  });
  
  observer.observe(indicator, { attributes: true, attributeFilter: ['data-status'] });
  
  // Return current status
  return indicator.getAttribute('data-status');
}
```
<!-- /ANCHOR:technical-design -->

---

<!-- ANCHOR:testing-strategy -->
## 6. TESTING STRATEGY

### Manual Test Cases

| ID | Scenario | Steps | Expected Result |
|----|----------|-------|-----------------|
| T1 | Basic display | Create notification in CMS, load page | Notification appears |
| T2 | Date filtering | Set future start-date | Notification hidden |
| T3 | Priority | Create 2 notifications, different priorities | Higher priority shows |
| T4 | Dismiss (day) | Dismiss, reload same day | Stays dismissed |
| T5 | Dismiss (day) | Dismiss, change system date to tomorrow | Reappears |
| T6 | Dismiss (session) | Dismiss, close browser, reopen | Reappears |
| T7 | Office hours | Set show-when: when-closed, office is open | Hidden |
| T8 | Office hours | Set show-when: when-closed, office is closed | Visible |
| T9 | Type: banner | Set type to banner | Shows in navbar area |
| T10 | Type: toast | Set type to toast | Shows in hero area with X |
| T11 | is-active off | Toggle is-active to false | Notification hidden |

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
<!-- /ANCHOR:testing-strategy -->

---

<!-- ANCHOR:success-metrics -->
## 7. SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Script size | < 5KB minified | Build output |
| Init time | < 50ms | Performance.now() |
| No console errors | 0 errors | Browser DevTools |
| CMS control | 100% fields work | Manual testing |
<!-- /ANCHOR:success-metrics -->

---

<!-- ANCHOR:risks-mitigations -->
## 8. RISKS & MITIGATIONS

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CMS structure changes | High | Low | Defensive parsing, fallback values |
| localStorage unavailable | Low | Low | Graceful degradation (no persistence) |
| Office hours script not loaded | Med | Low | Check for element before observing |
| Conflicts with other scripts | Med | Low | Use IIFE, unique namespace |

### Rollback Plan

1. Remove `notification_system.js` from Webflow custom code
2. Notifications fall back to Webflow's native conditional visibility
3. No data migration needed (localStorage only)
<!-- /ANCHOR:risks-mitigations -->

---

<!-- ANCHOR:dependencies -->
## 9. DEPENDENCIES

| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| contact_office_hours.js | Internal | ✅ Deployed | Required for office hours integration |
| Webflow CMS | External | ✅ Available | Data source |
| localStorage API | Browser | ✅ Standard | Dismiss persistence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:references -->
## 10. REFERENCES

- **Specification**: [spec.md](./spec.md)
- **Checklist**: [checklist.md](./checklist.md)
- **Office Hours Script**: `src/2_javascript/contact_office_hours.js`
- **Project Patterns**: `src/2_javascript/modal_welcome.js` (reference for init pattern)
<!-- /ANCHOR:references -->
