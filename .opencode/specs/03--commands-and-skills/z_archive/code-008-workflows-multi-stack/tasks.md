---
title: "Tasks - workflows-code Conversion [008-workflows-code-multi-stack/tasks]"
description: "Status: Pending | Priority: P0 | Est. Hours: 8-12"
trigger_phrases:
  - "tasks"
  - "workflows"
  - "code"
  - "conversion"
  - "027"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks - workflows-code Conversion

## Task Overview

| ID | Task | Status | Priority | Est. Hours |
|----|------|--------|----------|------------|
| T1 | Phase 1: Preparation | `[ ]` Pending | P0 | 8-12 |
| T2 | SKILL.md Conversion | `[ ]` Pending | P0 | 4-6 |
| T3 | Go Backend Anonymization | `[ ]` Pending | P0 | 8-12 |
| T4 | React Native Anonymization | `[ ]` Pending | P0 | 4-6 |
| T5 | React/Next.js Creation | `[ ]` Pending | P0 | 12-16 |
| T6 | Swift/iOS Patterns | `[ ]` Pending | P1 | 8-12 |
| T7 | Node.js Patterns | `[ ]` Pending | P1 | 4-6 |
| T8 | Cross-Stack Updates | `[ ]` Pending | P1 | 4-6 |
| T9 | Finalization | `[ ]` Pending | P0 | 4-6 |

---

## P0 Tasks (Must Complete)

<!-- ANCHOR:phase-1 -->
### T1: Phase 1 - Preparation
**Status:** Pending | **Priority:** P0 | **Est. Hours:** 8-12

**Subtasks:**
- [ ] 1.1: Complete file inventory (research.md content table)
- [ ] 1.2: Create anonymization term mapping document
- [ ] 1.3: Set up target directory structure in public repo
- [ ] 1.4: Research React/Next.js patterns (App Router, RSC)
- [ ] 1.5: Research Swift/iOS patterns (SwiftUI, MVVM)

**Exit Criteria:**
- research.md has complete file inventory
- decision-record.md has all key decisions
- Empty directory structure exists in public repo
- React pattern outline documented
- Swift pattern outline documented

<!-- /ANCHOR:phase-1 -->

---

### T2: SKILL.md Conversion
**Status:** Pending | **Priority:** P0 | **Est. Hours:** 4-6

**Source:** Barter's `.opencode/skill/workflows-code/SKILL.md`

**Subtasks:**
- [ ] 2.1: Copy SKILL.md to working location
- [ ] 2.2: Remove all Barter project references
  - [ ] fe-partners-app → remove
  - [ ] backend-system → remove
  - [ ] barter-expo → remove
  - [ ] gaia-services → remove
- [ ] 2.3: Update smart routing to use generic stack paths
- [ ] 2.4: Update resource paths to new directory structure
- [ ] 2.5: Generalize all code examples
- [ ] 2.6: Update version to 3.0.0
- [ ] 2.7: Verify with grep (zero Barter references)

**Exit Criteria:**
- SKILL.md fully converted
- `grep -i "barter\|fe-partners\|backend-system\|gaia" SKILL.md` returns 0

---

### T3: Go Backend Anonymization
**Status:** Pending | **Priority:** P0 | **Est. Hours:** 8-12

**Source:** Barter's `references/backend-system/` (12 files)

**Files to Process:**
| File | Anonymization Level | Status |
|------|---------------------|--------|
| go_standards.md | High | `[ ]` Pending |
| domain_layers.md | High | `[ ]` Pending |
| database_patterns.md | Medium | `[ ]` Pending |
| database_patterns_gorm_type_mappings.md | Low | `[ ]` Pending |
| testing_strategy.md | High | `[ ]` Pending |
| di_configuration.md | High | `[ ]` Pending |
| api_design.md | High | `[ ]` Pending |
| deployment.md | Medium | `[ ]` Pending |
| infrastructure_events.md | High | `[ ]` Pending |
| microservice_bootstrap_architecture.md | High | `[ ]` Pending |
| models_vs_entities_and_adapters.md | Medium | `[ ]` Pending |
| validator_registration.md | Low | `[ ]` Pending |

**Subtasks per file:**
- [ ] Level 1: Find/replace project names
- [ ] Level 2: Replace domain terms (Deal→Order, Partner→Vendor, etc.)
- [ ] Level 3: Generalize code examples
- [ ] Verify with grep

**Files to REMOVE (not copy):**
- business_domain_vocabulary.md (Barter-specific)
- companies_domain.md (Barter-specific)
- deals_domain.md (Barter-specific)
- partners_domain.md (Barter-specific)
- payments_domain.md (Barter-specific)
- social_media_api_content_gallery_capabilities.md (Barter-specific)
- cron_tracking_readme.md (Barter-specific)

**Exit Criteria:**
- 12 files anonymized in `backend/go/`
- `grep -ri "barter\|deal\|partner\|company" backend/go/` returns 0 (except generic uses)

---

### T4: React Native Anonymization
**Status:** Pending | **Priority:** P0 | **Est. Hours:** 4-6

**Source:** Barter's `references/barter-expo/` (8 files)

**Files to Process:**
| File | Anonymization Level | Status |
|------|---------------------|--------|
| react-native-standards.md | Medium | `[ ]` Pending |
| react-hooks-patterns.md | Low | `[ ]` Pending |
| expo-patterns.md | Medium | `[ ]` Pending |
| navigation-patterns.md | Medium | `[ ]` Pending |
| performance-optimization.md | Low | `[ ]` Pending |
| mobile_testing.md | Low | `[ ]` Pending |
| native-modules.md | Low | `[ ]` Pending |

**Subtasks:**
- [ ] Copy all 8 files to `mobile/react-native/`
- [ ] Find/replace "barter-expo" with "mobile-app"
- [ ] Generalize app-specific examples
- [ ] Verify with grep

**Exit Criteria:**
- 8 files in `mobile/react-native/`
- `grep -ri "barter" mobile/react-native/` returns 0

---

### T5: React/Next.js Creation
**Status:** Pending | **Priority:** P0 | **Est. Hours:** 12-16

**Target:** `frontend/react/` (7 files - replacing Angular)

**Files to Create:**
| File | Content | Status |
|------|---------|--------|
| react_nextjs_standards.md | Project structure, conventions, App Router | `[ ]` Pending |
| component_architecture.md | Server/Client Components, composition | `[ ]` Pending |
| state_management.md | Context, Zustand, Jotai, Redux comparison | `[ ]` Pending |
| data_fetching.md | React Query, SWR, Server Actions | `[ ]` Pending |
| forms_validation.md | React Hook Form, Zod validation | `[ ]` Pending |
| testing_strategy.md | RTL, Jest, Playwright, MSW | `[ ]` Pending |
| api_patterns.md | Route handlers, tRPC, API design | `[ ]` Pending |

**Content Requirements:**
- Modern Next.js 14+ with App Router
- TypeScript throughout
- Server Components vs Client Components guidance
- React 19 features where applicable
- Testing with React Testing Library

**Exit Criteria:**
- 7 files created with comprehensive patterns
- Coverage equivalent to removed Angular patterns
- All examples use TypeScript

---

### T9: Finalization
**Status:** Pending | **Priority:** P0 | **Est. Hours:** 4-6

**Subtasks:**
- [ ] 9.1: Update skill_advisor.py with new keywords
- [ ] 9.2: Run full grep verification
  - [ ] `grep -ri "barter" workflows-code/`
  - [ ] `grep -ri "fe-partners" workflows-code/`
  - [ ] `grep -ri "backend-system" workflows-code/`
  - [ ] `grep -ri "gaia" workflows-code/`
- [ ] 9.3: Test skill loading (all paths resolve)
- [ ] 9.4: Test smart routing (keywords → correct resources)
- [ ] 9.5: Update README.md (skill documentation)
- [ ] 9.6: Create CHANGELOG.md (v3.0.0)
- [ ] 9.7: Archive original Webflow-specific version

**Exit Criteria:**
- All grep checks return 0
- Skill loads correctly
- README updated
- CHANGELOG created

---

## P1 Tasks (Should Complete)

### T6: Swift/iOS Patterns
**Status:** Pending | **Priority:** P1 | **Est. Hours:** 8-12

**Target:** `mobile/swift/` (6 files - NEW)

**Files to Create:**
| File | Content | Status |
|------|---------|--------|
| swift_standards.md | Project structure, conventions | `[ ]` Pending |
| swiftui_patterns.md | View composition, state, navigation | `[ ]` Pending |
| mvvm_architecture.md | MVVM with Combine, @Observable | `[ ]` Pending |
| async_patterns.md | async/await, Combine, Task | `[ ]` Pending |
| testing_strategy.md | XCTest, UI testing, mocking | `[ ]` Pending |
| core_data.md | Persistence, SwiftData | `[ ]` Pending |

**Exit Criteria:**
- 6 files with iOS development patterns
- SwiftUI-focused (modern iOS development)
- Swift 5.9+ patterns

---

### T7: Node.js Patterns
**Status:** Pending | **Priority:** P1 | **Est. Hours:** 4-6

**Target:** `backend/nodejs/` (4 files - NEW)

**Files to Create:**
| File | Content | Status |
|------|---------|--------|
| nodejs_standards.md | Project structure, TypeScript | `[ ]` Pending |
| express_patterns.md | Routes, middleware, error handling | `[ ]` Pending |
| async_patterns.md | Promises, async/await, error handling | `[ ]` Pending |
| testing_strategy.md | Jest, Supertest, mocking | `[ ]` Pending |

**Exit Criteria:**
- 4 files with Node.js/Express patterns
- TypeScript-first approach
- Modern async patterns

---

### T8: Cross-Stack Updates
**Status:** Pending | **Priority:** P1 | **Est. Hours:** 4-6

**Subtasks:**
- [ ] 8.1: Update debugging workflows with stack-specific sections
- [ ] 8.2: Update verification workflows with stack-specific commands
- [ ] 8.3: Update stack_detection.md
  - [ ] Add Swift detection (Package.swift, .xcodeproj)
  - [ ] Update all paths to new structure
- [ ] 8.4: Update cross-stack standards

**Exit Criteria:**
- Debugging covers all stacks
- Verification has stack-specific commands
- Stack detection works for React, RN, Go, Swift, Node.js

---

## P2 Tasks (Nice to Have)

### T10: Python Patterns
**Status:** Deferred | **Priority:** P2

Files: Flask/FastAPI standards, pytest patterns

### T11: DevOps Patterns
**Status:** Deferred | **Priority:** P2

Files: Docker patterns, CI/CD workflows, Kubernetes basics

---

<!-- ANCHOR:completion -->
## Progress Summary

**Total Tasks:** 9 (P0+P1)
**P0 (Must):** 5 tasks - 0/5 complete
**P1 (Should):** 3 tasks - 0/3 complete
**P2 (Nice):** 2 tasks - Deferred

**Overall Progress:** 0/9 (0%)

<!-- /ANCHOR:completion -->

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Complete rewrite for conversion approach |
