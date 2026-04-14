---
title: "Implementation Plan: Add User Authentication [template:examples/level_3+/plan.md]"
description: "Note the AI Execution Framework, Workstream Coordination, and Communication Plan"
trigger_phrases:
  - "implementation"
  - "plan"
  - "add"
  - "user"
  - "authentication"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Add User Authentication

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + all addendums | v2.2 -->

<!-- EXAMPLE: This is a filled-in Level 3+ plan demonstrating full governance features.
Note the AI Execution Framework, Workstream Coordination, and Communication Plan
sections. Use this for enterprise-scale changes requiring multi-agent coordination. -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES6+), Node.js 18+ |
| **Framework** | Express.js 4.x with EJS templates |
| **Storage** | PostgreSQL 14+ with Prisma ORM 5.x |
| **Testing** | Jest 29.x, Supertest for integration |

### Overview
This implementation adds a complete email/password authentication system using bcrypt for password hashing and JWT tokens for stateless session management. The architecture follows established patterns in the codebase (MVC) while introducing reusable utilities for hashing and token management. Given the complexity score (82), this plan includes AI execution protocols for multi-agent coordination.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] NFRs defined with targets
- [x] Architecture decisions documented (ADRs)
- [x] Security review scheduled
- [x] Stakeholder matrix defined

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (unit and integration)
- [x] Coverage > 80%
- [x] Docs updated (spec/plan/tasks)
- [x] Checklist items verified
- [x] Security review passed
- [x] All approvals obtained
- [x] Compliance checkpoints verified


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
MVC - Following existing Express.js application structure

### Key Components
- **AuthController** (`src/auth/`): Handles registration, login, logout requests
- **UserModel** (`prisma/`): Prisma model for user data with hashed passwords
- **AuthMiddleware** (`src/middleware/auth.js`): Validates JWT tokens on protected routes
- **HashService** (`src/utils/hash.js`): Encapsulates bcrypt hashing logic
- **TokenService** (`src/utils/token.js`): JWT generation and validation
- **AuthValidator** (`src/validators/auth.js`): Input validation schemas

### Component Diagram
```
┌──────────────────────────────────────────────────────────────┐
│                        Express App                            │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Register   │  │    Login    │  │   Logout    │          │
│  │  Controller │  │  Controller │  │  Controller │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│         ┌────────────────────────────────┐                   │
│         │         Auth Middleware         │                   │
│         └────────────────┬───────────────┘                   │
│                          ▼                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ HashService │  │TokenService │  │  Validator  │          │
│  │   (bcrypt)  │  │    (JWT)    │  │ (express-v) │          │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘          │
│         │                │                                   │
│         └────────────────┼───────────────────────────────────┤
│                          ▼                                   │
│         ┌────────────────────────────────┐                   │
│         │      Prisma ORM (User Model)    │                   │
│         └────────────────┬───────────────┘                   │
└──────────────────────────┼───────────────────────────────────┘
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    └─────────────┘
```


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (Day 1 AM)
- [x] Project structure created (auth/ directory)
- [x] Dependencies installed (bcrypt, jsonwebtoken, express-validator)
- [x] Environment variables configured
- [x] Development environment ready (test database seeded)

### Phase 2: Database Layer (Day 1 PM)
- [x] User model with email and passwordHash fields
- [x] Prisma migration created and applied
- [x] Database indexes on email field

### Phase 3: Core Services (Day 2)
- [x] HashService with bcrypt wrapper
- [x] TokenService with JWT generation/validation
- [x] Input validation schemas

### Phase 4: API Endpoints (Day 3)
- [x] Registration endpoint with validation
- [x] Login endpoint with token generation
- [x] Logout endpoint
- [x] Auth middleware for protected routes

### Phase 5: UI (Day 4 AM)
- [x] Registration form view
- [x] Login form view
- [x] Error message styling
- [x] Success feedback

### Phase 6: Verification (Day 4 PM - Day 5)
- [x] Unit tests for services
- [x] Integration tests for endpoints
- [x] Manual testing complete
- [x] Security review
- [x] Documentation updated


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Unit | Hash, Token, Validators | Jest | 100% |
| Integration | API endpoints | Supertest | 85% |
| Manual | User journeys, edge cases | Browser | Critical paths |
| Security | OWASP auth items | Manual + SAST | Auth-specific |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bcrypt@5.1.1 | External | Green | Use crypto.scrypt fallback |
| jsonwebtoken@9.0.0 | External | Green | Cannot generate tokens |
| express-validator@7.0.1 | External | Green | Manual validation fallback |
| Prisma@5.x | Internal | Green | Cannot persist users |
| PostgreSQL@14+ | Internal | Green | All auth features blocked |
| Security Team | Human | Green | Blocks launch approval |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Critical security vulnerability, or breaks existing functionality
- **Procedure**: Revert commits, drop users table, remove auth routes


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┬──────────────────────────────────────────┐
                      │                                          │
Phase 2 (Database) ───┴──> Phase 3 (Services) ──> Phase 4 (API) ─┴──> Phase 5 (UI) ──> Phase 6 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Database, Services |
| Database | Setup | Services, API |
| Services | Setup, Database | API |
| API | Services | UI |
| UI | API | Verify |
| Verify | All | None |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 2 hours |
| Database | Low | 2 hours |
| Services | Medium | 4 hours |
| API Endpoints | Medium | 6 hours |
| UI | Low | 3 hours |
| Verification | Medium | 5 hours |
| **Total** | | **22 hours (~3 days)** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Database backup created
- [x] Git tag created (pre-auth)
- [x] Monitoring alerts configured
- [x] Rollback procedure tested

### Rollback Procedure
1. **Immediate**: Disable auth routes in app.js
2. **Revert code**: `git revert HEAD~N` for auth commits
3. **Database**: Run down migration to drop users table
4. **Verify**: Confirm app loads without auth routes
5. **Notify**: Post in #engineering channel

### Data Reversal
- **Has data migrations?** Yes (users table)
- **Reversal procedure**: `npx prisma migrate rollback` or manual DROP TABLE


<!-- /ANCHOR:l2-rollback -->
---

<!-- ANCHOR:l3-dep-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐
│   Setup     │
│  (Phase 1)  │
└──────┬──────┘
       │
       ├────────────────────┐
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Database   │      │  Services   │
│  (Phase 2)  │◄─────│  (Phase 3)  │
└──────┬──────┘      └──────┬──────┘
       │                    │
       └────────┬───────────┘
                │
                ▼
         ┌─────────────┐
         │     API     │
         │  (Phase 4)  │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │     UI      │
         │  (Phase 5)  │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │   Verify    │
         │  (Phase 6)  │
         └─────────────┘
```


<!-- /ANCHOR:l3-dep-graph -->
---

<!-- ANCHOR:l3-critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 2 hours - CRITICAL
2. **Database** - 2 hours - CRITICAL
3. **Services** - 4 hours - CRITICAL
4. **API** - 6 hours - CRITICAL
5. **Security Review** - 4 hours - CRITICAL (external dependency)
6. **Verification** - 5 hours - CRITICAL

**Total Critical Path**: 23 hours + external review time


<!-- /ANCHOR:l3-critical-path -->
---

<!-- ANCHOR:l3-milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Foundation | Setup complete, Prisma model ready | Day 1 EOD |
| M2 | Core Services | Hash and Token services working | Day 2 EOD |
| M3 | API Complete | All endpoints functional | Day 3 EOD |
| M4 | UI Complete | Forms rendering, submitting | Day 4 noon |
| M5 | Security Review | Security team sign-off | Day 4 EOD |
| M6 | Release Ready | All tests pass, all approvals | Day 5 EOD |


<!-- /ANCHOR:l3-milestones -->
---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | JWT over sessions | Accepted |
| ADR-002 | bcrypt with 10 rounds | Accepted |
| ADR-003 | localStorage for tokens (MVP) | Accepted |


<!-- /ANCHOR:l3-adr-summary -->
---

<!-- ANCHOR:l3plus-ai-exec -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (Primary Agent)
**Files**: spec.md (sections 1-5), prisma/schema.prisma
**Duration**: ~60s
**Agent**: Primary
**Tasks**: Initial spec review, database model creation

### Tier 2: Parallel Execution
| Agent | Focus | Files | Duration |
|-------|-------|-------|----------|
| Core Agent | Hash/Token services | src/utils/*.js | ~90s |
| API Agent | Endpoints | src/auth/*.js | ~120s |
| Test Agent | Test suite | tests/*.js | ~90s |

**Sync Point**: SYNC-001 after Tier 2

### Tier 3: Integration (Primary Agent)
**Agent**: Primary
**Task**: Wire up routes, integration testing, merge outputs
**Duration**: ~60s

### Pre-Task Checklist (9 steps)
1. Load spec.md and verify scope hasn't changed
2. Load plan.md and identify current phase
3. Load tasks.md and find next uncompleted task
4. Verify task dependencies are satisfied
5. Load checklist.md and identify relevant P0/P1 items
6. Check for blocking issues in decision-record.md
7. Review `handover.md` and `_memory.continuity` for prior session context
8. Confirm understanding of success criteria
9. Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against acceptance criteria |
| TASK-DOC | Update status immediately on completion |
| TASK-SYNC | Wait at sync points for all workstreams |

### Status Reporting Format
```

<!-- /ANCHOR:l3plus-ai-exec -->
<!-- ANCHOR:status-update-timestamp -->
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Workstream**: [W-A | W-B | W-C]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Link to code/test/artifact]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```


<!-- /ANCHOR:status-update-timestamp -->
---

<!-- ANCHOR:l3plus-workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Core Services | Primary Agent | src/utils/*.js, src/middleware/*.js | Complete |
| W-B | API & UI | API Agent | src/auth/*.js, views/auth/*.ejs | Complete |
| W-C | Testing | Test Agent | tests/*.js | Complete |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | W-A, W-B | Services ready for API integration |
| SYNC-002 | W-A, W-B complete | W-A, W-B, W-C | Full integration test suite |
| SYNC-003 | All workstreams | All agents | Final verification, launch approval |

### File Ownership Rules
- Each file owned by ONE workstream
- Cross-workstream changes require SYNC
- Conflicts resolved at sync points
- Primary agent has override authority

### Workstream Dependencies
```
W-A (Core Services) ─────────────────┐
         │                           │
         ▼                           │
W-B (API & UI) ──────────────────────┼──> SYNC-002 ──> SYNC-003 ──> Done
         │                           │
         ▼                           │
W-C (Testing) ◄──────────────────────┘
```


<!-- /ANCHOR:l3plus-workstreams -->
---

<!-- ANCHOR:l3plus-communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Task**: Status update in tasks.md
- **Per Phase**: Sync point review
- **Per Day**: Summary to stakeholders
- **Blockers**: Immediate escalation

### Escalation Path
1. Technical blockers → Tech Lead (Jordan)
2. Security issues → Security Lead (Alex)
3. Scope changes → Product Owner (Sarah)
4. Resource issues → Engineering Manager (Pat)

### Notification Matrix

| Event | Notify | Channel |
|-------|--------|---------|
| Phase complete | Team | #auth-project Slack |
| Blocker identified | Tech Lead | Direct message |
| Security concern | Security Lead | Security channel |
| Launch ready | All stakeholders | Email + Slack |

<!-- /ANCHOR:l3plus-communication -->

---

<!--
LEVEL 3+ PLAN (~300 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
-->
