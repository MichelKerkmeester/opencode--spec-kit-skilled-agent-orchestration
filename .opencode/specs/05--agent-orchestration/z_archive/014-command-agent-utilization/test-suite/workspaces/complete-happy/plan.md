---
title: "Implementation Plan: Notification System with In-App Alerts and Email Delivery [complete-happy/plan]"
description: "This plan implements a unified notification system with two delivery channels: real-time in-app alerts via WebSocket and email delivery via SendGrid. The architecture follows an..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "notification"
  - "system"
  - "with"
  - "complete"
  - "happy"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Notification System with In-App Alerts and Email Delivery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.3, Node.js 20 LTS |
| **Framework** | React 18 (frontend), Express.js (backend) |
| **Storage** | PostgreSQL 15 with Prisma ORM |
| **Testing** | Jest (unit), Supertest (integration), React Testing Library (component) |

### Overview
This plan implements a unified notification system with two delivery channels: real-time in-app alerts via WebSocket and email delivery via SendGrid. The architecture follows an event-driven pattern with a central NotificationService that dispatches to channel-specific handlers, backed by a PostgreSQL notification store and an async worker queue for email processing.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (unit + integration)
- [x] Docs updated (spec/plan/tasks)

---

## 3. ARCHITECTURE

### Pattern
Event-Driven Service Architecture with Worker Queue

### Key Components
- **NotificationService**: Central dispatch orchestrator; receives events, applies user preferences, routes to channels
- **WebSocketChannel**: Real-time in-app delivery via Socket.IO; manages connection registry and room-based routing
- **EmailChannel**: Async email delivery via SendGrid SDK; supports immediate and batched (digest) modes
- **EmailWorker**: Background job processor using BullMQ; handles retry logic, dead-letter queue, and digest compilation
- **NotificationStore**: Prisma-backed persistence layer; handles CRUD, read/unread state, and preference management
- **NotificationBell**: React component; renders unread count badge and notification panel with real-time updates

### Data Flow
1. System event triggers NotificationService.dispatch(event, recipientIds)
2. NotificationService queries user preferences to determine active channels per recipient
3. For in-app: Notification persisted to DB, then pushed via WebSocket to connected clients
4. For email: Urgent notifications queued immediately; non-urgent batched for hourly digest
5. EmailWorker processes queue, sends via SendGrid, updates delivery status in DB
6. Client-side NotificationBell receives WebSocket events and updates UI in real-time

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Database schema and Prisma models for notifications and preferences
- [x] Project structure with service/worker/API separation
- [x] SendGrid SDK and Socket.IO dependencies installed
- [x] BullMQ worker infrastructure with Redis connection

### Phase 2: Core Implementation
- [x] NotificationService with dispatch logic and preference filtering
- [x] WebSocket channel with connection registry and room routing
- [x] EmailChannel with SendGrid integration and template rendering
- [x] EmailWorker with retry logic and dead-letter handling
- [x] REST API endpoints (GET /notifications, PATCH /notifications/:id/read, PUT /preferences)
- [x] NotificationBell and NotificationPanel React components

### Phase 3: Verification
- [x] Unit tests for NotificationService, EmailChannel, WebSocketChannel
- [x] Integration tests for API endpoints
- [x] Manual testing of real-time delivery and email receipt
- [x] Edge case testing (disconnection, high volume, preference changes)
- [x] Documentation updated

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | NotificationService, EmailChannel, WebSocketChannel, NotificationStore | Jest with mocks |
| Integration | API endpoints, worker processing, WebSocket events | Supertest, Socket.IO client |
| Component | NotificationBell, NotificationPanel | React Testing Library |
| Manual | End-to-end notification flow, email delivery, preference management | Browser + SendGrid dashboard |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SendGrid SDK (@sendgrid/mail) | External | Green | Email delivery unavailable; in-app unaffected |
| Socket.IO | External | Green | Real-time delivery falls back to polling |
| BullMQ + Redis | External | Green | Email queue unavailable; direct send fallback |
| Prisma ORM | Internal | Green | Database access blocked; core feature blocked |
| PostgreSQL 15 | Internal | Green | All persistence blocked |

---

## 7. ROLLBACK PLAN

- **Trigger**: Critical bug in notification dispatch causing data loss or spam; SendGrid quota exhaustion
- **Procedure**: Disable notification feature flag; revert migration if schema changes caused issues; drain email queue

---

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──> Phase 2 (Core) ──> Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | High | 6-10 hours |
| Verification | Medium | 2-4 hours |
| **Total** | | **9-16 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (database snapshot before migration)
- [x] Feature flag configured (NOTIFICATION_SYSTEM_ENABLED)
- [x] Monitoring alerts set (SendGrid delivery rate, WebSocket connection count, worker queue depth)

### Rollback Procedure
1. Set NOTIFICATION_SYSTEM_ENABLED=false in environment config
2. Drain email worker queue (allow in-flight emails to complete)
3. Revert code deployment to previous version
4. If schema rollback needed: run prisma migrate revert for notification tables
5. Verify core application functionality unaffected via smoke tests

### Data Reversal
- **Has data migrations?** Yes
- **Reversal procedure**: Drop notifications and notification_preferences tables; no user data loss as these are new tables

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
