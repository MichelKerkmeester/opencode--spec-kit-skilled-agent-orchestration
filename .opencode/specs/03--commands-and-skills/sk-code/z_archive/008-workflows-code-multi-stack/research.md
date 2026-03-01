---
title: "Research - Barter workflows-code Skill Analysis [008-workflows-code-multi-stack/research]"
description: "Deep analysis of Barter's workflows-code skill to inform conversion strategy. This document catalogs all content, identifies what to keep/remove/replace, and documents the anony..."
trigger_phrases:
  - "research"
  - "barter"
  - "workflows"
  - "code"
  - "skill"
  - "027"
importance_tier: "normal"
contextType: "research"
---
# Research - Barter workflows-code Skill Analysis

## Purpose

Deep analysis of Barter's `workflows-code` skill to inform conversion strategy. This document catalogs all content, identifies what to keep/remove/replace, and documents the anonymization approach.

---

## Source Analysis

### Location
`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/workflows-code/`

### Directory Structure

```
workflows-code/
├── SKILL.md                     # Main orchestrator (736 lines)
├── references/
│   ├── stack_detection.md       # Stack identification patterns
│   ├── backend-system/          # Go microservices (23 files, ~350KB)
│   ├── barter-expo/             # React Native mobile (8 files, ~150KB)
│   ├── fe-partners-app/         # Angular web (7 files, ~140KB)
│   ├── fe-backoffice-app/       # Angular backoffice (similar to fe-partners-app)
│   ├── gaia-services/           # Internal services
│   ├── postgres-backup-system/  # DevOps/Infrastructure
│   ├── debugging/               # Cross-stack debugging (4 files)
│   ├── deployment/              # Deployment patterns
│   ├── implementation/          # General implementation patterns
│   ├── standards/               # Code quality standards
│   └── verification/            # Verification workflows
```

---

## Content Inventory

### Go Backend (`backend-system/`) - 23 Files

| File | LOC | Keep | Anonymize | Notes |
|------|-----|------|-----------|-------|
| go_standards.md | ~800 | Yes | High | Project structure, patterns |
| domain_layers.md | ~1200 | Yes | High | Layer architecture, transactions |
| database_patterns.md | ~600 | Yes | Medium | GORM patterns (generic) |
| database_patterns_gorm_type_mappings.md | ~600 | Yes | Low | Type mappings (mostly generic) |
| testing_strategy.md | ~1000 | Yes | High | Table-driven tests |
| di_configuration.md | ~900 | Yes | High | fx dependency injection |
| api_design.md | ~550 | Yes | High | REST patterns |
| deployment.md | ~400 | Yes | Medium | Deploy scripts |
| infrastructure_events.md | ~850 | Yes | High | Event sourcing |
| microservice_bootstrap_architecture.md | ~600 | Yes | High | Service bootstrap |
| models_vs_entities_and_adapters.md | ~500 | Yes | Medium | Clean architecture |
| validator_registration.md | ~400 | Yes | Low | Validation patterns |
| cli_commands.md | ~500 | Partial | High | CLI patterns (some Barter-specific) |
| business_domain_vocabulary.md | ~400 | NO | N/A | Barter-specific domain terms |
| companies_domain.md | ~450 | NO | N/A | Barter domain |
| deals_domain.md | ~1100 | NO | N/A | Barter domain |
| partners_domain.md | ~600 | NO | N/A | Barter domain |
| payments_domain.md | ~650 | NO | N/A | Barter domain |
| cron_execution_tracking.md | ~600 | Partial | High | Generic cron patterns useful |
| cron_tracking_deployment.md | ~400 | Partial | High | Deployment patterns |
| cron_tracking_readme.md | ~250 | NO | N/A | Project-specific |
| social_media_api_content_gallery_capabilities.md | ~1000 | NO | N/A | Barter-specific feature |

**Summary**: 12 files fully usable, 3 partially usable, 8 Barter-specific (remove)

### React Native (`barter-expo/`) - 8 Files

| File | LOC | Keep | Anonymize | Notes |
|------|-----|------|-----------|-------|
| react-native-standards.md | ~650 | Yes | Medium | Component patterns |
| react-hooks-patterns.md | ~1600 | Yes | Low | Hook patterns (mostly generic) |
| expo-patterns.md | ~550 | Yes | Medium | Expo-specific patterns |
| navigation-patterns.md | ~650 | Yes | Medium | React Navigation |
| performance-optimization.md | ~650 | Yes | Low | Performance patterns |
| mobile_testing.md | ~350 | Yes | Low | Testing patterns |
| native-modules.md | ~500 | Yes | Low | Native integration |

**Summary**: All 8 files usable with medium-to-low anonymization effort

### Angular (`fe-partners-app/`) - 7 Files (TO BE REPLACED)

| File | LOC | Replace With |
|------|-----|--------------|
| angular_standards.md | ~900 | React/Next.js standards |
| component_architecture.md | ~1200 | React component architecture |
| state_management.md | ~600 | React state (Context, Zustand, Redux) |
| api_patterns.md | ~650 | React Query / SWR patterns |
| rxjs_best_practices.md | ~650 | React hooks / async patterns |
| testing_strategy.md | ~450 | React Testing Library / Jest |

**Summary**: All 7 files need replacement with React equivalents

### Cross-Stack References

| Directory | Files | Keep | Notes |
|-----------|-------|------|-------|
| debugging/ | 4 | Yes | Generic debugging patterns |
| verification/ | 3 | Yes | Generic verification workflows |
| implementation/ | 9 | Partial | Some Webflow-specific |
| standards/ | 6 | Yes | Code quality (adapt) |
| deployment/ | 2 | Yes | Generic deployment |

---

## Anonymization Strategy

### Level 1: Find & Replace

Terms that can be directly replaced:

| Original | Replacement |
|----------|-------------|
| `barter-expo` | `mobile-app` |
| `barter` (lowercase) | Remove or `example` |
| `Barter` (capitalized) | Remove or `Example` |
| `fe-partners-app` | `web-app` |
| `fe-backoffice-app` | `admin-app` |
| `backend-system` | `backend` |
| `gaia-services` | `services` |

### Level 2: Domain Terms

Terms requiring context-aware replacement:

| Domain Term | Generic Replacement | Context |
|-------------|-------------------|---------|
| `Deal` | `Order` | E-commerce generic |
| `Partner` | `Vendor` or `Merchant` | Generic marketplace |
| `Company` | `Organization` | Generic entity |
| `Payment` | Keep as-is | Generic enough |
| `Transaction` | Keep as-is | Generic enough |
| `Offer` | `Product` | Generic e-commerce |

### Level 3: Code Examples

All code examples need review for:
- Barter-specific imports
- Domain-specific entity names
- Internal URL patterns
- Team/developer references

---

## Popular Tech Stack Analysis

### Why React over Angular?

| Factor | React | Angular |
|--------|-------|---------|
| Market share (2024-2025) | ~40% | ~18% |
| Job postings | Higher | Lower |
| Startup adoption | Very High | Medium |
| Learning curve | Lower | Higher |
| Ecosystem | Largest | Structured |
| Meta (backing) | Yes | Google |

**Decision**: React/Next.js aligns with majority of tech companies

### Modern Stack Combinations (2024-2025)

#### Combo 1: "MERN-ish" (Most Common)
- **Frontend**: React/Next.js
- **Mobile**: React Native/Expo
- **Backend**: Node.js (TypeScript)
- **DB**: PostgreSQL or MongoDB
- **Infra**: Vercel/AWS

#### Combo 2: "Gopher Stack" (High Performance)
- **Frontend**: React/Next.js
- **Mobile**: React Native or Native (Swift/Kotlin)
- **Backend**: Go
- **DB**: PostgreSQL
- **Infra**: Kubernetes/AWS

#### Combo 3: "Apple Native" (iOS Focus)
- **Frontend**: React/Next.js (web)
- **Mobile**: Swift/SwiftUI
- **Backend**: Node.js or Go
- **DB**: PostgreSQL
- **Infra**: AWS/GCP

**Recommendation**: Support all three combos with primary focus on:
1. **React/Next.js** - Web (P0)
2. **React Native/Expo** - Cross-platform mobile (P0)
3. **Go** - High-performance backend (P0)
4. **Swift** - iOS native option (P1)
5. **Node.js/TypeScript** - Backend alternative (P1)

---

## New Content Requirements

### React/Next.js Patterns (Replace Angular)

| Topic | Priority | Source |
|-------|----------|--------|
| Project structure | P0 | New (Next.js App Router) |
| Component architecture | P0 | New (Server/Client Components) |
| State management | P0 | New (Context, Zustand, Jotai) |
| Data fetching | P0 | New (React Query, SWR) |
| Forms | P1 | New (React Hook Form, Zod) |
| Testing | P1 | New (RTL, Jest, Playwright) |
| TypeScript patterns | P1 | Partially from Angular |
| API patterns | P1 | New (Route handlers, tRPC) |

### Swift Patterns (New)

| Topic | Priority | Source |
|-------|----------|--------|
| Project structure | P1 | New |
| SwiftUI basics | P1 | New |
| MVVM architecture | P1 | New |
| Combine/async-await | P1 | New |
| Testing (XCTest) | P2 | New |
| Core Data | P2 | New |

---

## File Mapping: Barter → Universal

### SKILL.md Transformation

| Section | Barter | Universal |
|---------|--------|-----------|
| When to Use | Barter projects listed | Generic stack triggers |
| Smart Routing | Project-specific folders | Stack-based folders |
| Resource Router | Barter project refs | Generic stack refs |
| Phase 1-3 | Keep structure | Keep structure |
| Rules | Keep most | Generalize examples |
| Success Criteria | Keep | Keep |
| Integration Points | Barter AGENTS.md | Generic framework ref |
| Quick Reference | Barter-specific | Stack-specific |

### Reference Directory Mapping

| Barter | Universal | Action |
|--------|-----------|--------|
| `backend-system/` | `backend/go/` | Anonymize |
| `barter-expo/` | `mobile/react-native/` | Anonymize |
| `fe-partners-app/` | `frontend/react/` | REPLACE with React |
| `fe-backoffice-app/` | Remove | Redundant |
| `gaia-services/` | Remove | Barter-specific |
| `postgres-backup-system/` | `devops/` | Anonymize |
| `debugging/` | `debugging/` | Keep |
| `verification/` | `verification/` | Keep |
| `implementation/` | `implementation/` | Filter Webflow |
| `standards/` | `standards/` | Adapt |
| `deployment/` | `deployment/` | Keep |
| NEW | `mobile/swift/` | Create |
| NEW | `backend/nodejs/` | Create |

---

## Estimated Effort

### P0 Tasks (Must Complete)

| Task | Files | Hours Est. | Complexity |
|------|-------|------------|------------|
| SKILL.md conversion | 1 | 4-6 | High |
| Go patterns anonymization | 12 | 8-12 | Medium |
| React Native anonymization | 8 | 4-6 | Medium |
| React/Next.js creation | 7 | 12-16 | High |
| Stack detection update | 1 | 2 | Low |

**P0 Total**: 30-42 hours

### P1 Tasks (Should Complete)

| Task | Files | Hours Est. | Complexity |
|------|-------|------------|------------|
| Swift patterns creation | 6 | 8-12 | High |
| Node.js patterns creation | 4 | 4-6 | Medium |
| Cross-stack debugging update | 4 | 2-4 | Low |
| Verification workflow update | 3 | 2-3 | Low |

**P1 Total**: 16-25 hours

### P2 Tasks (Nice to Have)

| Task | Files | Hours Est. |
|------|-------|------------|
| Python patterns | 4 | 4-6 |
| DevOps patterns | 4 | 4-6 |
| Performance patterns | 2 | 2-4 |

**P2 Total**: 10-16 hours

---

## Validation Checklist

### Anonymization Verification

```bash
# Run these commands to verify anonymization
grep -ri "barter" .opencode/skill/workflows-code/
grep -ri "fe-partners" .opencode/skill/workflows-code/
grep -ri "backend-system" .opencode/skill/workflows-code/
grep -ri "gaia" .opencode/skill/workflows-code/
grep -ri "deals\|partners\|companies" .opencode/skill/workflows-code/
```

All commands should return 0 results.

### Content Completeness

- [ ] React patterns cover same topics as removed Angular
- [ ] Go patterns maintain technical depth after anonymization
- [ ] React Native patterns remain functional
- [ ] Swift patterns provide meaningful iOS guidance
- [ ] Stack detection works for all supported stacks
- [ ] Smart routing loads correct resources

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial research document |
