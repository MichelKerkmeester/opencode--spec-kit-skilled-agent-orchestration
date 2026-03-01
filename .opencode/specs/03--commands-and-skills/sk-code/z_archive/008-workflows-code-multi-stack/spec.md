---
title: "workflows-code-multi-stack Skill - Conversion Spec [008-workflows-code-multi-stack/spec]"
description: "Convert Barter's comprehensive multi-stack workflows-code skill into a universal, fully anonymized version for the public OpenCode Dev Environment. The skill must work for any t..."
trigger_phrases:
  - "workflows"
  - "code"
  - "multi"
  - "stack"
  - "skill"
  - "spec"
  - "027"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# workflows-code-multi-stack Skill - Conversion Spec

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec ID** | 008 |
| **Title** | Universal Code Workflows Skill (Barter Conversion) |
| **Status** | Planning |
| **Level** | 3+ (Complex multi-stack conversion with anonymization) |
| **Created** | 2026-01-26 |
| **Author** | Claude Opus 4.5 |
| **LOC Estimate** | ~3,000-5,000 (SKILL.md + extensive reference files) |
| **Source** | Barter's `.opencode/skill/workflows-code/` |
| **Target** | Public repo: `.opencode/skill/workflows-code/` (replaces Webflow version) |

<!-- /ANCHOR:metadata -->

---

## Overview

Convert Barter's comprehensive multi-stack `workflows-code` skill into a universal, fully anonymized version for the public OpenCode Dev Environment. The skill must work for any technology stack without project-specific references.

### Problem Statement

Barter's `workflows-code` is a powerful development orchestrator covering:
- Go backend microservices (23 reference files)
- React Native/Expo mobile (8 reference files)
- Angular web frontends (7 reference files)
- DevOps/infrastructure patterns

However, it contains Barter-specific:
1. Domain vocabulary (deals, partners, payments, companies)
2. Project names (fe-partners-app, backend-system, barter-expo)
3. Business logic patterns tied to Barter's architecture
4. Angular patterns (user wants React instead)

### Goal

Create a universal skill that:
1. **Anonymizes** all Barter-specific references
2. **Replaces Angular with React/Next.js** (per user requirement)
3. **Adds Swift/iOS patterns** (popular stack addition)
4. **Keeps Go, React Native** patterns (anonymized)
5. **Maintains the 3-phase lifecycle** (Implementation → Debugging → Verification)

---

## Target Stack Matrix

### Primary Stacks (P0)

| Stack | Web | Mobile | Backend |
|-------|-----|--------|---------|
| **React/Next.js** | ✓ | - | - |
| **React Native/Expo** | - | ✓ | - |
| **Go** | - | - | ✓ |

### Secondary Stacks (P1)

| Stack | Platform | Use Case |
|-------|----------|----------|
| **Swift** | iOS Native | Performance-critical mobile |
| **Node.js/TypeScript** | Backend | API services, BFF |
| **Python** | Backend | ML/Data services |

### Tertiary Stacks (P2)

| Stack | Notes |
|-------|-------|
| **Kotlin** | Android Native (future) |
| **Rust** | Systems/Performance (future) |

---

<!-- ANCHOR:scope -->
## Scope

### In Scope (P0 - Must Have)

| Item | Description | Source |
|------|-------------|--------|
| SKILL.md | Unified orchestrator with smart routing | Barter's SKILL.md (adapt) |
| Stack detection | Auto-detect via marker files | Barter's stack_detection.md |
| 3-Phase Lifecycle | Implementation → Debugging → Verification | Barter pattern (keep) |
| React/Next.js patterns | Components, hooks, state, testing | NEW (replace Angular) |
| Go patterns | Domain layers, testing, DI | Barter (anonymize) |
| React Native patterns | Hooks, navigation, performance | Barter (anonymize) |

### In Scope (P1 - Should Have)

| Item | Description | Source |
|------|-------------|--------|
| Swift patterns | iOS patterns, SwiftUI, testing | NEW |
| Node.js patterns | Express, async patterns, testing | NEW |
| Smart routing | Keyword-based resource loading | Barter (adapt) |
| Debugging workflows | Cross-stack debugging patterns | Barter (keep) |
| Verification workflows | Cross-stack verification | Barter (keep) |

### In Scope (P2 - Nice to Have)

| Item | Description |
|------|-------------|
| Python patterns | Flask, FastAPI, pytest |
| DevOps patterns | Docker, CI/CD, Kubernetes |
| Performance patterns | Cross-stack optimization |

### Out of Scope

| Item | Reason |
|------|--------|
| Webflow patterns | Separate skill for anobel.com only |
| CDN deployment | Project-specific |
| Barter domain vocabulary | Must be removed |
| Angular patterns | Replaced by React |
| Project-specific references | Must be anonymized |

<!-- /ANCHOR:scope -->

---

## Anonymization Requirements

### Must Remove

| Category | Examples to Remove |
|----------|-------------------|
| **Project names** | barter-expo, fe-partners-app, backend-system, gaia-services |
| **Domain terms** | Deals, Partners, Payments, Companies, Transactions |
| **Business logic** | Barter-specific workflows, state machines |
| **Internal URLs** | Any Barter-specific endpoints or services |
| **Team references** | Any developer names or team structures |

### Must Generalize

| Original | Generalized |
|----------|-------------|
| `barter-expo/` | `mobile-app/` or `react-native/` |
| `fe-partners-app/` | `web-app/` or `react/` |
| `backend-system/` | `backend/` or `go-services/` |
| Domain-specific entities | Generic entities (User, Order, Product) |
| Barter's DI patterns | Generic DI patterns (fx, wire) |

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| Zero Barter references | `grep -r "barter\|Barter" skill/` returns 0 |
| Zero project names | No fe-partners-app, backend-system, gaia-services |
| Zero domain vocabulary | No deals, partners, payments specific logic |
| React patterns complete | Equivalent coverage to removed Angular patterns |
| Go patterns anonymized | All domain examples use generic entities |
| React Native anonymized | All examples use generic app contexts |
| Skill loads correctly | skill_advisor.py routes correctly |
| Stack detection works | All marker files detected properly |

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:dependencies -->
## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Barter's workflows-code | Source for conversion | Available |
| Public repo | Target location | Available |
| React/Next.js expertise | New content | Research needed |
| Swift/iOS expertise | New content | Research needed |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:risks -->
## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Incomplete anonymization | Medium | High | Automated grep checks, manual review |
| Lost valuable patterns | Low | High | Document what's removed vs kept |
| React patterns insufficient | Medium | Medium | Research modern React/Next.js best practices |
| Swift patterns too basic | Medium | Low | Start with fundamentals, iterate |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:changelog -->
## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Complete rewrite for Level 3+ conversion focus |

<!-- /ANCHOR:changelog -->
