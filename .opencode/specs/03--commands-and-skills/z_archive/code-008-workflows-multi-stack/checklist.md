---
title: "Checklist - workflows-code Conversion [008-workflows-code-multi-stack/checklist]"
description: "grep -ri \"barter\" .opencode/skill/workflows-code/"
trigger_phrases:
  - "checklist"
  - "workflows"
  - "code"
  - "conversion"
  - "027"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Checklist - workflows-code Conversion

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### Research & Documentation
- [x] Analyzed Barter's workflows-code structure
- [x] Identified all reference files (38 total across stacks)
- [x] Documented which files to keep/remove/anonymize
- [x] Created research.md with file inventory
- [x] Created decision-record.md with key decisions
- [x] Spec folder upgraded to Level 3+

### Key Decisions Made
- [x] Replace Angular with React/Next.js (user requirement)
- [x] Target stacks: React, React Native, Go, Swift, Node.js
- [x] Three-level anonymization approach
- [x] Directory structure by stack type
- [x] Replace existing workflows-code (not create new skill)

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Phase 1: Preparation (P0)

### T1: Setup & Research
- [ ] 1.1: Create target directory structure
  - [ ] `frontend/react/`
  - [ ] `mobile/react-native/`
  - [ ] `mobile/swift/`
  - [ ] `backend/go/`
  - [ ] `backend/nodejs/`
  - [ ] `devops/`
  - [ ] `debugging/`
  - [ ] `verification/`
  - [ ] `standards/`
- [ ] 1.2: Document React/Next.js pattern requirements
- [ ] 1.3: Document Swift/iOS pattern requirements
- [ ] 1.4: Finalize anonymization term mapping

---

## Phase 2: Core Conversion (P0)

### T2: SKILL.md Conversion
- [ ] Copy Barter SKILL.md
- [ ] Remove project-specific references:
  - [ ] fe-partners-app
  - [ ] fe-backoffice-app
  - [ ] backend-system
  - [ ] barter-expo
  - [ ] gaia-services
  - [ ] postgres-backup-system
- [ ] Update smart routing to generic paths
- [ ] Generalize code examples
- [ ] Update version to 3.0.0
- [ ] Grep verification passes

### T3: Go Backend Anonymization
- [ ] go_standards.md anonymized
- [ ] domain_layers.md anonymized
- [ ] database_patterns.md anonymized
- [ ] database_patterns_gorm_type_mappings.md anonymized
- [ ] testing_strategy.md anonymized
- [ ] di_configuration.md anonymized
- [ ] api_design.md anonymized
- [ ] deployment.md anonymized
- [ ] infrastructure_events.md anonymized
- [ ] microservice_bootstrap_architecture.md anonymized
- [ ] models_vs_entities_and_adapters.md anonymized
- [ ] validator_registration.md anonymized
- [ ] All domain-specific files excluded (deals, partners, companies, etc.)
- [ ] Grep verification: `grep -ri "barter\|deal\|partner" backend/go/` = 0

### T4: React Native Anonymization
- [ ] react-native-standards.md anonymized
- [ ] react-hooks-patterns.md anonymized
- [ ] expo-patterns.md anonymized
- [ ] navigation-patterns.md anonymized
- [ ] performance-optimization.md anonymized
- [ ] mobile_testing.md anonymized
- [ ] native-modules.md anonymized
- [ ] Grep verification: `grep -ri "barter" mobile/react-native/` = 0

### T5: React/Next.js Creation (Replace Angular)
- [ ] react_nextjs_standards.md created
  - [ ] Next.js 14+ App Router structure
  - [ ] TypeScript configuration
  - [ ] Project conventions
- [ ] component_architecture.md created
  - [ ] Server Components vs Client Components
  - [ ] Component composition patterns
  - [ ] Props and children patterns
- [ ] state_management.md created
  - [ ] React Context patterns
  - [ ] Zustand setup and patterns
  - [ ] Jotai atomic state
  - [ ] When to use Redux
- [ ] data_fetching.md created
  - [ ] React Query / TanStack Query
  - [ ] SWR patterns
  - [ ] Server Actions
  - [ ] Error handling
- [ ] forms_validation.md created
  - [ ] React Hook Form setup
  - [ ] Zod schema validation
  - [ ] Form state management
- [ ] testing_strategy.md created
  - [ ] React Testing Library
  - [ ] Jest configuration
  - [ ] Playwright E2E
  - [ ] MSW for API mocking
- [ ] api_patterns.md created
  - [ ] Route handlers
  - [ ] tRPC integration
  - [ ] API design patterns

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Phase 3: Secondary Stacks (P1)

### T6: Swift/iOS Patterns
- [ ] swift_standards.md created
- [ ] swiftui_patterns.md created
- [ ] mvvm_architecture.md created
- [ ] async_patterns.md created
- [ ] testing_strategy.md created
- [ ] core_data.md created

### T7: Node.js Patterns
- [ ] nodejs_standards.md created
- [ ] express_patterns.md created
- [ ] async_patterns.md created
- [ ] testing_strategy.md created

### T8: Cross-Stack Updates
- [ ] Debugging workflows updated for all stacks
- [ ] Verification workflows updated for all stacks
- [ ] stack_detection.md updated with all stacks
- [ ] Cross-stack standards updated

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Phase 4: Finalization (P0)

### T9: Integration & Validation
- [ ] skill_advisor.py updated with new keywords
- [ ] Full grep verification passes:
  - [ ] `grep -ri "barter" workflows-code/` = 0
  - [ ] `grep -ri "fe-partners" workflows-code/` = 0
  - [ ] `grep -ri "backend-system" workflows-code/` = 0
  - [ ] `grep -ri "gaia" workflows-code/` = 0
- [ ] Skill loading test passes
- [ ] Smart routing test passes (keywords → correct resources)
- [ ] README.md updated
- [ ] CHANGELOG.md created (v3.0.0)
- [ ] Original Webflow version archived

---

## Post-Implementation

### Documentation
- [ ] implementation-summary.md created
- [ ] All spec folder files updated with final status
- [ ] Memory file created with session context

### Validation
- [ ] Zero Barter references in entire skill
- [ ] All file paths resolve correctly
- [ ] skill_advisor.py routes correctly
- [ ] Stack detection works for all supported stacks

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:sign-off -->
## Quality Gates

### Anonymization Verification (MANDATORY)
```bash
# Run before claiming completion
grep -ri "barter" .opencode/skill/workflows-code/
grep -ri "fe-partners" .opencode/skill/workflows-code/
grep -ri "backend-system" .opencode/skill/workflows-code/
grep -ri "gaia" .opencode/skill/workflows-code/
grep -ri "deals\|partners\|companies" .opencode/skill/workflows-code/

# All must return 0 results
```

### Content Completeness (MANDATORY)
- [ ] React patterns cover equivalent topics as Angular (7 files)
- [ ] Go patterns maintain technical depth (12 files)
- [ ] React Native patterns fully functional (8 files)
- [ ] Stack detection covers all target stacks

<!-- /ANCHOR:sign-off -->

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Complete rewrite for conversion approach |
