---
title: "Tasks: [YOUR_VALUE_HERE: feature-name] - Implementation Breakdown [011-docs-alignment/tasks]"
description: "Task list template for feature implementation with user story organization and independent testing."
trigger_phrases:
  - "tasks"
  - "your"
  - "value"
  - "here"
  - "feature"
  - "011"
  - "docs"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: [YOUR_VALUE_HERE: feature-name] - Implementation Breakdown

Task list template for feature implementation with user story organization and independent testing.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

---

## IMPORTANT: REPLACE SAMPLE TASKS

**⚠️ THIS TEMPLATE CONTAINS SAMPLE TASKS FOR ILLUSTRATION ONLY**

The `/spec_kit:tasks` command MUST replace these with actual tasks based on:
- User stories from spec.md (with their priorities P1, P2, P3...)
- Feature requirements from plan.md
- Entities from data-model.md
- Endpoints from contracts/

Tasks MUST be organized by user story so each story can be:
- Implemented independently
- Tested independently
- Delivered as an MVP increment

**DO NOT keep these sample tasks in the generated tasks.md file.**

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: [YOUR_VALUE_HERE: feature-name], [YOUR_VALUE_HERE: area]
- **Priority**: [NEEDS CLARIFICATION: What is the task priority? (a) P0-critical - must complete first (b) P1-high - core functionality (c) P2-medium - important but not blocking (d) P3-low - can defer]

### Input
Design documents from `/specs/[###-feature-name]/`

### Prerequisites
- **Required**: `plan.md`, `spec.md` (for user stories)
- **Optional**: `research.md`, `data-model.md`, `contracts/`

### Organization
Tasks are grouped by user story to enable independent implementation and testing of each story.

### Tests
The examples below include test tasks. Tests are **OPTIONAL** - only include them if explicitly requested in the feature specification.

---

## 2. CONVENTIONS

### Task Format

**Basic Format** (backward compatible):
```text
- [ ] T### [P?] [Story] Description
```

**Enhanced Format** (with requirement linking):
```markdown
- [ ] TASK-NNN: Task description
  - **Requirement:** REQ-XXX (spec.md#section-anchor)
  - **Acceptance:** Specific acceptance criteria
  - **Verification:** How to verify completion
```

**Format Elements:**
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to [example: US1, US2, US3]
- Include exact file paths in descriptions
- ID format: `T###` or `TASK-NNN` [example: T012, TASK-001]
- Avoid parallel edits to the same file in different tasks

### Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths below assume single project - adjust based on `plan.md` structure

### Example Task Lines

**Basic Format:**
```text
T012 [P] [US1] Implement service in src/services/[service].py (depends on T010, T011)
```

**Enhanced Format with Requirement Linking:**
```markdown
- [ ] TASK-012: Implement OAuth service in src/services/auth.py
  - **Requirement:** REQ-AUTH-010 (spec.md#authentication)
  - **Acceptance:** OAuth login flow works end-to-end
  - **Verification:** Integration test passes, manual QA sign-off
```

### Commit Message Hint
```text
tasks([SPEC_ID]): short action
```
[OPTIONAL: use if linking commits to spec]

---

## WORKING FILES LOCATION

**IMPORTANT:** During implementation, use appropriate directories:

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

**MUST:** Place ALL temporary/debug files in `scratch/`
**NEVER:** Create temp files in spec folder root or project root

> **OpenCode Users:** Verify file placement manually. No automated validation to enforce.

---

### Task Completion Criteria
**Mark a task complete when:**
- [ ] Code implementation finished
- [ ] Code passes local tests (if tests exist)
- [ ] Code passes lint/format checks
- [ ] File paths match conventions
- [ ] Dependencies satisfied (if any)
- [ ] Peer review completed (if required)

---

## Task-Requirement Linking

Each task SHOULD reference its source requirement from spec.md for better traceability.

### Format
- **TASK-NNN:** Unique task identifier (sequential numbering)
- **Requirement:** Links to spec.md requirement (e.g., REQ-AUTH-001, REQ-DATA-005)
- **Acceptance:** What "done" looks like (specific, measurable criteria)
- **Verification:** How to test/verify (automated tests, manual checks, QA sign-off)

### Example
```markdown
- [ ] TASK-001: Implement OAuth provider integration
  - **Requirement:** REQ-AUTH-010 (spec.md#authentication)
  - **Acceptance:** OAuth login flow works end-to-end
  - **Verification:** Integration test passes, manual QA sign-off

- [ ] TASK-002: Create user session management
  - **Requirement:** REQ-AUTH-020 (spec.md#session-management)
  - **Acceptance:** Sessions persist across page reloads, timeout after 30 min inactivity
  - **Verification:** Unit tests for session logic, E2E test for timeout behavior
```

### When to Use Enhanced Format
- **Level 2-3 specs:** Recommended for complex features requiring audit trail
- **Regulated domains:** Required for compliance (healthcare, finance, etc.)
- **Team collaboration:** Helpful when multiple developers work on same feature
- **Level 1 specs:** Basic format (T###) is sufficient

### Backward Compatibility
Both formats are valid:
- Basic: `T012 [P] [US1] Description` (simpler, faster)
- Enhanced: `TASK-NNN:` with sub-bullets (more traceable)

Choose based on project complexity and traceability requirements.

---

## 3. TASK GROUPS BY PHASE/STORY

### Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

### Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

**Examples of foundational tasks** (adjust based on your project):
- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

### Phase 3: User Story 1 - [YOUR_VALUE_HERE: title] (Priority: P1) MVP

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Tests for User Story 1** (OPTIONAL - only if tests requested):
- [ ] T010 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py

**Implementation for User Story 1**:
- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T014 [US1] Implement [Service] in src/services/[service].py (depends on T012, T013)
- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T016 [US1] Add validation and error handling
- [ ] T017 [US1] Add logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

### Phase 4: User Story 2 - [YOUR_VALUE_HERE: title] (Priority: P2)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Tests for User Story 2** (OPTIONAL - only if tests requested):
- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

**Implementation for User Story 2**:
- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

### Phase 5: User Story 3 - [YOUR_VALUE_HERE: title] (Priority: P3)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Tests for User Story 3** (OPTIONAL - only if tests requested):
- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

**Implementation for User Story 3**:
- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

### Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## 4. VALIDATION CHECKLIST

### Code Quality
- [ ] Lint passes
- [ ] Format checks pass
- [ ] Tests pass (unit/integration as applicable)
- [ ] No console warnings or errors

### Documentation
- [ ] Docs updated (README/spec/plan/tasks)
- [ ] Code comments added where needed
- [ ] API documentation updated (if applicable)

### Review & Sign-off
- [ ] Owner review and sign-off
- [ ] Paths and naming follow conventions
- [ ] Commit messages clear and linked to spec where needed

### Cross-References
- **Specification**: See `spec.md` for requirements
- **Plan**: See `plan.md` for technical approach
- **Checklist**: See `.opencode/skills/system-spec-kit/templates/checklist.md` for validation

---

## 5. OPTIONAL TESTS GUIDANCE

### Unit Tests
- **What**: [YOUR_VALUE_HERE: components/functions requiring unit tests - example: all service layer functions, validation logic]
- **Where**: [YOUR_VALUE_HERE: test file locations - example: tests/unit/]
- **Coverage Target**: [YOUR_VALUE_HERE: percentage - example: 70-80% line coverage]

### Integration Tests
- **What**: [YOUR_VALUE_HERE: integrations requiring testing - example: all API endpoints, all database operations]
- **Where**: [YOUR_VALUE_HERE: test file locations - example: tests/integration/]
- **Coverage Target**: [YOUR_VALUE_HERE: description - example: all API endpoints, all DB operations]

### Test Data
- **Fixtures**: [YOUR_VALUE_HERE: location and description]
- **Factories**: [YOUR_VALUE_HERE: test data generation strategy]
- **Snapshots**: [YOUR_VALUE_HERE: snapshot testing approach if applicable]

### Execution
- **Local**: [YOUR_VALUE_HERE: command to run tests locally - example: npm test, pytest]
- **CI**: [YOUR_VALUE_HERE: when tests run - example: on every PR, nightly builds]

---

## WHEN TO USE THIS TEMPLATE

**Use tasks.md when:**
- Creating Level 2 or Level 3 spec folders (moderate to complex features)
- Feature requires breaking down into discrete, trackable tasks
- Multiple user stories need independent implementation tracking
- Team needs clear task assignments and dependencies
- Tasks span multiple phases or team members

**Never skip tasks.md:**
- tasks.md is REQUIRED for ALL levels (Level 1, 2, and 3)
- Even simple features benefit from task tracking
- Use a minimal task list for straightforward features
- Single-developer work still benefits from task organization

**Related templates:**
- Generate tasks.md AFTER completing plan.md
- Reference spec.md for user stories and priorities
- Use checklist.md for validation criteria (different from task tracking)

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
