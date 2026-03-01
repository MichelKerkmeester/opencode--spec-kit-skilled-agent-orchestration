---
title: "Implementation Plan: [YOUR_VALUE_HERE: feature-name] - Technical Approach & Architecture [011-docs-alignment/plan]"
description: "Implementation plan defining technical approach, project structure, and execution strategy."
trigger_phrases:
  - "implementation"
  - "plan"
  - "your"
  - "value"
  - "here"
  - "011"
  - "docs"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: [YOUR_VALUE_HERE: feature-name] - Technical Approach & Architecture

Implementation plan defining technical approach, project structure, and execution strategy.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: [YOUR_VALUE_HERE: feature-name], [YOUR_VALUE_HERE: area]
- **Priority**: [NEEDS CLARIFICATION: What is the implementation priority? (a) P0-critical - blocks launch, must ship (b) P1-high - core MVP, essential (c) P2-medium - important enhancement (d) P3-low - nice to have, can defer]
- **Branch**: `[FORMAT: ###-feature-name]`
- **Date**: [FORMAT: YYYY-MM-DD]
- **Spec**: [OPTIONAL: link to spec.md if exists]

### Input
Feature specification from `/specs/[###-feature-name]/spec.md`

### Summary
[YOUR_VALUE_HERE: Extract primary requirement and technical approach from spec - 2-3 sentences]

### Technical Context

- **Language/Version**: [example: Python 3.11, Swift 5.9, Rust 1.75]
- **Primary Dependencies**: [example: FastAPI, UIKit, LLVM]
- **Storage**: [example: PostgreSQL, CoreData, files] [OPTIONAL: N/A if none]
- **Testing**: [example: pytest, XCTest, cargo test]
- **Target Platform**: [example: Linux server, iOS 15+, WASM]
- **Project Type**: [NEEDS CLARIFICATION: What project structure applies? (a) single-project - monolithic src/ (b) web-app - frontend/ + backend/ (c) mobile-app - api/ + ios/ or android/ (d) monorepo - packages/*]
- **Performance Goals**: [example: 1000 req/s, 10k lines/sec, 60 fps] [OPTIONAL: N/A if not performance-critical]
- **Constraints**: [example: <200ms p95, <100MB memory, offline-capable] [OPTIONAL: N/A if none]
- **Scale/Scope**: [example: 10k users, 1M LOC, 50 screens]

---

## 2. QUALITY GATES

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

### Definition of Ready (DoR)
- [ ] Problem statement clear; scope documented
- [ ] Stakeholders identified; decisions path agreed
- [ ] Constraints known; risks captured
- [ ] Success criteria measurable

### Definition of Done (DoD)
- [ ] All acceptance criteria met; tests passing
- [ ] Docs updated (spec/plan/tasks/README)
- [ ] Performance/error budgets respected
- [ ] Rollback verified or not needed

### Rollback Guardrails
- **Stop Signals**: [YOUR_VALUE_HERE: conditions that trigger stop/rollback - example: error rate >5%, critical bug in production]
- **Recovery Procedure**: [YOUR_VALUE_HERE: reference to recovery steps or document]

### Constitution Check (Complexity Tracking)

**Fill ONLY if Constitution Check has violations that must be justified**:

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [example: 4th project] | [current need] | [why 3 projects insufficient] |
| [example: Repository pattern] | [specific problem] | [why direct DB access insufficient] |

---

## 3. PROJECT STRUCTURE

### Documentation (This Feature)

```
specs/[###-feature]/
  spec.md              # Feature specification (see spec-template.md)
  plan.md              # This file (/spec_kit:plan command output)
  research.md          # Phase 0 output (/spec_kit:plan command)
  data-model.md        # Phase 1 output (/spec_kit:plan command)
  quickstart.md        # Phase 1 output (/spec_kit:plan command)
  contracts/           # Phase 1 output (/spec_kit:plan command)
  tasks.md             # Phase 2 output (/spec_kit:tasks command)
  scratch/             # Drafts, prototypes, debug logs (git-ignored, delete when done)
  memory/              # Session context preservation (auto-created, git-tracked)
```

> **Tip:** Use `scratch/` for throwaway work (test queries, debug output, draft code).
> Move valuable findings to spec.md, plan.md, or memory/ before completing the task.

### Source Code (Repository Root)

[YOUR_VALUE_HERE: Select ONE option below and expand with real paths. Delete unused options.]

```
# Option 1: Single project (DEFAULT)
src/
  models/
  services/
  cli/
  lib/

tests/
  contract/
  integration/
  unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
  src/
    models/
    services/
    api/
  tests/

frontend/
  src/
    components/
    pages/
    services/
  tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
  [same as backend above]

ios/ or android/
  [platform-specific structure: feature modules, UI flows, platform tests]
```

### Structure Decision

[YOUR_VALUE_HERE: Document the selected structure and reference the real directories captured above - example: "Selected Option 1 (single project) because feature is backend-only CLI tool"]

---

## 4. IMPLEMENTATION PHASES

### Phase 0: Research & Discovery

- **Goal**: [YOUR_VALUE_HERE: research objectives - example: evaluate GraphQL vs REST for API design]
- **Deliverables**:
  - Research findings documented in research.md
  - Technical feasibility assessment
  - Architecture decision records
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 3 days]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 1: Design & Setup

- **Goal**: [YOUR_VALUE_HERE: design objectives - example: define data models and API contracts]
- **Deliverables**:
  - Data models defined (data-model.md)
  - API contracts defined (contracts/)
  - Quick start guide (quickstart.md)
  - Development environment setup
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 1 week]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 2: Core Implementation

- **Goal**: [YOUR_VALUE_HERE: core functionality - example: implement user authentication and authorization]
- **Deliverables**:
  - [YOUR_VALUE_HERE: key feature 1 - example: User registration endpoint]
  - [YOUR_VALUE_HERE: key feature 2 - example: JWT token generation]
  - Unit tests coverage ≥ [YOUR_VALUE_HERE: percentage - example: 80%]
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 2 weeks]
- **Parallel Tasks**: [OPTIONAL: list tasks marked with [P] if parallel work possible]

### Phase 3: Integration & Testing

- **Goal**: [YOUR_VALUE_HERE: integration objectives - example: integrate with external payment API and verify end-to-end flows]
- **Deliverables**:
  - Integration tests passing
  - E2E tests passing
  - Performance benchmarks met
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 1 week]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 4: Deployment & Monitoring

- **Goal**: [YOUR_VALUE_HERE: deployment strategy - example: staged rollout to production with feature flags]
- **Deliverables**:
  - Production deployment completed
  - Monitoring/alerting configured
  - Documentation finalized
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 3 days]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

**Parallelization Note**: Use [P] tag to denote tasks that can run in parallel

---

## 5. TESTING STRATEGY

### Test Pyramid

```
        /\
       /E2E\      <- Few, high-value end-to-end tests
      /------\
     /  INTEG \   <- More integration tests
    /----------\
   /   UNIT     \  <- Many unit tests (foundation)
  /--------------\
```

### Unit Tests

- **Scope**: [YOUR_VALUE_HERE: components/functions requiring unit tests - example: all service layer functions, validation logic]
- **Tools**: [example: pytest, jest, XCTest]
- **Coverage Target**: [example: ≥80% line coverage]
- **Execution**: [example: Local + CI on every commit]

### Integration Tests

- **Scope**: [YOUR_VALUE_HERE: integrations requiring testing - example: database operations, external API calls, message queue interactions]
- **Tools**: [example: pytest + docker-compose, Postman, integration test framework]
- **Coverage Target**: [example: All API endpoints, all database operations]
- **Execution**: [example: CI on PR, nightly]

### End-to-End Tests

- **Scope**: [YOUR_VALUE_HERE: critical user journeys - example: complete checkout flow, user onboarding, data export process]
- **Tools**: [example: Playwright, Cypress, Selenium]
- **Coverage Target**: [example: Top 5 user flows, happy paths]
- **Execution**: [example: CI on PR to main, pre-release]

### Test Data & Environments

- **Test Data**: [YOUR_VALUE_HERE: strategy - example: factory pattern for dynamic data, fixtures for static data, snapshots for UI]
- **Environments**: [example: Development | Staging | Production-like]
- **Database**: [YOUR_VALUE_HERE: strategy - example: containerized PostgreSQL per test run, in-memory SQLite, shared test database]

### CI Quality Gates

- [ ] All tests must pass
- [ ] Code coverage ≥ [YOUR_VALUE_HERE: X%]
- [ ] No critical security vulnerabilities
- [ ] Linting/formatting checks pass
- [ ] Performance benchmarks met
- [ ] No breaking changes (or documented + approved)

---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [YOUR_VALUE_HERE: metric name - example: Feature completion] | 100% | [Acceptance criteria checklist] |
| [YOUR_VALUE_HERE: metric name - example: Bug count] | P0/P1 = 0 | [Issue tracker] |

### Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [YOUR_VALUE_HERE: metric name - example: API response time] | < [X] ms p95 | [APM tool] |
| [YOUR_VALUE_HERE: metric name - example: Throughput] | > [Y] req/sec | [Load testing] |
| [YOUR_VALUE_HERE: metric name - example: Memory usage] | < [Z] MB | [Monitoring] |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Test coverage | ≥ [X]% | [Coverage tool] |
| Code review turnaround | < [Y] hours | [PR metrics] |
| Documentation completeness | 100% | [Checklist] |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | [YOUR_VALUE_HERE: risk description - example: Third-party API rate limits] | High/Med/Low | High/Med/Low | [Mitigation plan] | [Name] |
| R-002 | [YOUR_VALUE_HERE: risk description] | High/Med/Low | High/Med/Low | [Mitigation plan] | [Name] |

### Rollback Plan

- **Rollback Trigger**: [YOUR_VALUE_HERE: conditions - example: error rate > 5%, critical bug detected, performance degradation >50%]
- **Rollback Procedure**:
  1. [YOUR_VALUE_HERE: step 1]
  2. [YOUR_VALUE_HERE: step 2]
  3. [YOUR_VALUE_HERE: step 3]
- **Data Migration Reversal**: [OPTIONAL: N/A if no data changes | describe how to reverse data migrations]
- **Verification**: [YOUR_VALUE_HERE: how to verify successful rollback]

---

## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Timeline | Impact if Blocked |
|------------|------|-------|--------|----------|-------------------|
| [System/API] | Internal | [Team] | [Green/Yellow/Red] | [Date] | [Impact description] |
| [Library/Tool] | Internal | [Team] | [Green/Yellow/Red] | [Date] | [Impact description] |

### External Dependencies

| Dependency | Type | Vendor | Status | Timeline | Impact if Blocked |
|------------|------|--------|--------|----------|-------------------|
| [Service/API] | External | [Company] | [Green/Yellow/Red] | [Date] | [Impact description] |
| [Library/Tool] | External | [Source] | [Green/Yellow/Red] | [Date] | [Impact description] |

---

## 9. COMMUNICATION & REVIEW

### Stakeholders

- **Product**: [Names]
- **Engineering**: [Names]
- **Design**: [Names]
- **QA**: [Names]
- **Operations**: [Names]

### Checkpoints

- **Standups**: [Cadence - example: Daily at 10am]
- **Sprint Planning**: [Cadence - example: Bi-weekly Monday]
- **Demo**: [Date/Cadence - example: Every sprint end]
- **Review Gates**: [Phase 0 review, Phase 1 review, Pre-launch review]

### Approvals

- **Technical Design**: [Name/Role]
- **Security Review**: [Name/Role]
- **Product Sign-off**: [Name/Role]
- **Launch Approval**: [Name/Role]

---

## 10. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for requirements and user stories
- **Task Breakdown**: See `tasks.md` for implementation task list
- **Checklist**: See `.opencode/skills/system-spec-kit/templates/checklist.md` for validation

### Additional References

- [Link additional docs]
- [Architecture diagrams]
- [API documentation]
- [Design mockups]

---

## WHEN TO USE THIS TEMPLATE

**Use plan.md when:**
- Creating Level 2 or Level 3 spec folders (moderate to complex features)
- Need to define technical approach and architecture before implementation
- Multiple phases of work requiring coordination
- Team needs shared understanding of implementation strategy
- Testing strategy and success metrics must be documented upfront

**Never skip plan.md:**
- plan.md is REQUIRED for ALL levels (Level 1, 2, and 3)
- Even simple features benefit from documented technical approach
- Use a minimal plan for straightforward features

**Related templates:**
- Start with `spec.md` for requirements and user stories
- Generate `tasks.md` after plan.md is complete
- Use `research.md` for deep technical investigation before planning
- Create `decision-record-*.md` for significant architectural decisions made during planning

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
