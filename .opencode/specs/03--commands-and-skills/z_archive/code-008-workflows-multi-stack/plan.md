---
title: "Plan - workflows-code Skill Conversion [008-workflows-code-multi-stack/plan]"
description: "Objective: Complete analysis and prepare conversion infrastructure"
trigger_phrases:
  - "plan"
  - "workflows"
  - "code"
  - "skill"
  - "conversion"
  - "027"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan - workflows-code Skill Conversion

<!-- ANCHOR:summary -->
## Execution Strategy

### Phase 1: Preparation (Research & Setup)

**Objective**: Complete analysis and prepare conversion infrastructure

| Step | Action | Output |
|------|--------|--------|
| 1.1 | Inventory all Barter files | File catalog with keep/remove/anonymize flags |
| 1.2 | Create anonymization mapping | Term replacement dictionary |
| 1.3 | Set up target directory structure | Empty directories in public repo |
| 1.4 | Research React/Next.js patterns | React pattern outline |
| 1.5 | Research Swift/iOS patterns | Swift pattern outline |

**Exit Criteria**: All research documents complete, directory structure created

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
### Phase 2: Core Conversion (P0)

**Objective**: Convert essential components to universal format

#### 2.1 SKILL.md Conversion

| Step | Action | Notes |
|------|--------|-------|
| 2.1.1 | Copy Barter SKILL.md | Starting point |
| 2.1.2 | Remove Barter project references | fe-partners-app, backend-system, etc. |
| 2.1.3 | Update smart routing | Generic stack-based routing |
| 2.1.4 | Update resource paths | New directory structure |
| 2.1.5 | Generalize examples | Remove domain-specific code |
| 2.1.6 | Update version to 3.0.0 | Major version bump |

#### 2.2 Go Backend Conversion

| Step | Action | Files |
|------|--------|-------|
| 2.2.1 | Copy reusable files | 12 files from research.md |
| 2.2.2 | Run Level 1 anonymization | Find/replace names |
| 2.2.3 | Run Level 2 anonymization | Domain term replacement |
| 2.2.4 | Run Level 3 anonymization | Code example generalization |
| 2.2.5 | Verify with grep | Zero Barter references |

Files to process:
- go_standards.md
- domain_layers.md
- database_patterns.md
- database_patterns_gorm_type_mappings.md
- testing_strategy.md
- di_configuration.md
- api_design.md
- deployment.md
- infrastructure_events.md
- microservice_bootstrap_architecture.md
- models_vs_entities_and_adapters.md
- validator_registration.md

#### 2.3 React Native Conversion

| Step | Action | Files |
|------|--------|-------|
| 2.3.1 | Copy all 8 files | Full retention |
| 2.3.2 | Run anonymization | Replace barter-expo references |
| 2.3.3 | Generalize app examples | Generic mobile app context |
| 2.3.4 | Verify with grep | Zero Barter references |

Files to process:
- react-native-standards.md
- react-hooks-patterns.md
- expo-patterns.md
- navigation-patterns.md
- performance-optimization.md
- mobile_testing.md
- native-modules.md

#### 2.4 React/Next.js Creation (Replace Angular)

| Step | Action | Output |
|------|--------|--------|
| 2.4.1 | Create react_nextjs_standards.md | Project structure, conventions |
| 2.4.2 | Create component_architecture.md | Server/Client Components, patterns |
| 2.4.3 | Create state_management.md | Context, Zustand, Jotai, Redux |
| 2.4.4 | Create data_fetching.md | React Query, SWR, Server Actions |
| 2.4.5 | Create forms_validation.md | React Hook Form, Zod |
| 2.4.6 | Create testing_strategy.md | RTL, Jest, Playwright |
| 2.4.7 | Create api_patterns.md | Route handlers, tRPC |

**Exit Criteria**: All P0 content complete, grep verification passes

---

### Phase 3: Secondary Stacks (P1)

**Objective**: Add Swift and Node.js patterns

#### 3.1 Swift/iOS Patterns

| Step | Action | Output |
|------|--------|--------|
| 3.1.1 | Create swift_standards.md | Project structure, conventions |
| 3.1.2 | Create swiftui_patterns.md | View composition, state |
| 3.1.3 | Create mvvm_architecture.md | MVVM with Combine |
| 3.1.4 | Create async_patterns.md | async/await, Combine |
| 3.1.5 | Create testing_strategy.md | XCTest patterns |
| 3.1.6 | Create core_data.md | Persistence patterns |

#### 3.2 Node.js/TypeScript Patterns

| Step | Action | Output |
|------|--------|--------|
| 3.2.1 | Create nodejs_standards.md | Project structure |
| 3.2.2 | Create express_patterns.md | Routes, middleware |
| 3.2.3 | Create async_patterns.md | Promises, error handling |
| 3.2.4 | Create testing_strategy.md | Jest, Supertest |

#### 3.3 Cross-Stack Updates

| Step | Action | Output |
|------|--------|--------|
| 3.3.1 | Update debugging workflows | Add stack-specific sections |
| 3.3.2 | Update verification workflows | Add stack-specific commands |
| 3.3.3 | Update stack_detection.md | Add Swift, update paths |

**Exit Criteria**: P1 content complete, stack detection works for all stacks

---

### Phase 4: Finalization

**Objective**: Integration, testing, deployment

| Step | Action | Output |
|------|--------|--------|
| 4.1 | Update skill_advisor.py | New keywords for all stacks |
| 4.2 | Run full grep verification | Zero Barter references |
| 4.3 | Test skill loading | All paths resolve |
| 4.4 | Test smart routing | Keywords trigger correct resources |
| 4.5 | Update README.md | Document skill changes |
| 4.6 | Create CHANGELOG.md | Version 3.0.0 notes |
| 4.7 | Archive original | Backup Webflow-only version |

**Exit Criteria**: Skill fully functional in public repo

<!-- /ANCHOR:phases -->

---

## Target Directory Structure

```
.opencode/skill/workflows-code/
├── SKILL.md                    # Main orchestrator (v3.0.0)
├── CHANGELOG.md                # Version history
├── references/
│   ├── stack_detection.md      # Auto-detection logic
│   │
│   ├── frontend/
│   │   └── react/              # React/Next.js (NEW - replaces Angular)
│   │       ├── react_nextjs_standards.md
│   │       ├── component_architecture.md
│   │       ├── state_management.md
│   │       ├── data_fetching.md
│   │       ├── forms_validation.md
│   │       ├── testing_strategy.md
│   │       └── api_patterns.md
│   │
│   ├── mobile/
│   │   ├── react-native/       # From Barter (anonymized)
│   │   │   ├── react-native-standards.md
│   │   │   ├── react-hooks-patterns.md
│   │   │   ├── expo-patterns.md
│   │   │   ├── navigation-patterns.md
│   │   │   ├── performance-optimization.md
│   │   │   ├── mobile_testing.md
│   │   │   └── native-modules.md
│   │   │
│   │   └── swift/              # NEW
│   │       ├── swift_standards.md
│   │       ├── swiftui_patterns.md
│   │       ├── mvvm_architecture.md
│   │       ├── async_patterns.md
│   │       ├── testing_strategy.md
│   │       └── core_data.md
│   │
│   ├── backend/
│   │   ├── go/                 # From Barter (anonymized)
│   │   │   ├── go_standards.md
│   │   │   ├── domain_layers.md
│   │   │   ├── database_patterns.md
│   │   │   ├── testing_strategy.md
│   │   │   ├── di_configuration.md
│   │   │   ├── api_design.md
│   │   │   └── ... (12 files total)
│   │   │
│   │   └── nodejs/             # NEW
│   │       ├── nodejs_standards.md
│   │       ├── express_patterns.md
│   │       ├── async_patterns.md
│   │       └── testing_strategy.md
│   │
│   ├── devops/                 # From Barter (anonymized)
│   │   ├── docker_patterns.md
│   │   ├── ci_cd_patterns.md
│   │   └── deployment.md
│   │
│   ├── debugging/              # Cross-stack (from Barter)
│   │   ├── debugging_workflows.md
│   │   └── debugging_checklist.md
│   │
│   ├── verification/           # Cross-stack (from Barter)
│   │   ├── verification_workflows.md
│   │   └── verification_checklist.md
│   │
│   ├── implementation/         # Cross-stack patterns
│   │   └── ... (generic patterns only)
│   │
│   └── standards/              # Cross-stack standards
│       ├── code_quality_standards.md
│       └── code_style_guide.md
```

---

<!-- ANCHOR:rollback -->
## Risk Mitigation

### Risk: Incomplete Anonymization

**Mitigation**:
1. Automated grep checks after each file
2. Batch verification at end of each phase
3. Manual review of code examples

### Risk: React Patterns Insufficient

**Mitigation**:
1. Research modern React/Next.js best practices
2. Reference official Next.js documentation
3. Include App Router patterns (current standard)

### Risk: Lost Valuable Patterns

**Mitigation**:
1. Document all removals in research.md
2. Keep Barter version as reference
3. Extract generic patterns before removal

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependencies -->
## Dependencies

| Dependency | Phase | Status |
|------------|-------|--------|
| research.md complete | Phase 1 | Done |
| decision-record.md complete | Phase 1 | Done |
| Barter skill access | Phase 2 | Available |
| React/Next.js knowledge | Phase 2 | Research needed |
| Swift/iOS knowledge | Phase 3 | Research needed |

<!-- /ANCHOR:dependencies -->

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Complete rewrite for conversion focus |
