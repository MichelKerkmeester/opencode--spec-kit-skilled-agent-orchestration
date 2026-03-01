---
title: "Tasks: Notification System with In-App Alerts and Email Delivery [complete-happy/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "notification"
  - "system"
  - "with"
  - "app"
  - "complete"
  - "happy"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Notification System with In-App Alerts and Email Delivery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Setup

- [x] T001 Create database migration for notifications table (src/migrations/20260214_notifications.sql)
- [x] T002 Create Prisma models for Notification and NotificationPreference (src/models/notification.ts)
- [x] T003 [P] Install and configure SendGrid SDK, Socket.IO, BullMQ dependencies (package.json)
- [x] T004 [P] Configure Redis connection for BullMQ worker queue (src/config/redis.ts)

---

## Phase 2: Implementation

- [x] T005 Implement NotificationService with dispatch, preference filtering, and channel routing (src/services/notification-service.ts)
- [x] T006 Implement WebSocketChannel with connection registry and room-based routing (src/services/websocket-service.ts)
- [x] T007 Implement EmailChannel with SendGrid integration and template rendering (src/services/email-service.ts)
- [x] T008 Implement EmailWorker with BullMQ job processing, retry logic, and dead-letter queue (src/workers/email-worker.ts)
- [x] T009 Implement NotificationPreference model and preference CRUD operations (src/models/notification-preference.ts)
- [x] T010 Create REST API endpoints: GET /notifications, PATCH /notifications/:id/read, PUT /preferences (src/api/notifications.ts)
- [x] T011 Implement NotificationBell component with unread count badge and real-time updates (src/components/NotificationBell.tsx)
- [x] T012 Implement NotificationPanel component with notification list, grouping, and mark-all-read (src/components/NotificationPanel.tsx)
- [x] T013 Implement email digest batching logic for non-urgent notifications (src/workers/email-worker.ts)
- [x] T014 Add notification grouping for repeated events within 5-minute window (src/services/notification-service.ts)

---

## Phase 3: Verification

- [x] T015 Write unit tests for NotificationService dispatch and preference filtering (tests/notification-service.test.ts)
- [x] T016 Write unit tests for EmailChannel and email worker retry logic (tests/email-service.test.ts)
- [x] T017 [P] Write integration tests for notification API endpoints (tests/api/notifications.test.ts)
- [x] T018 [P] Write component tests for NotificationBell and NotificationPanel (tests/components/notification.test.tsx)
- [x] T019 Manual end-to-end testing: create notification, verify in-app delivery, verify email receipt
- [x] T020 Edge case testing: WebSocket reconnection, high-volume dispatch, preference changes mid-stream

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
