---
title: "Decision Record - workflows-code Conversion [008-workflows-code-multi-stack/decision-record]"
description: "Document key architectural and strategic decisions for converting Barter's workflows-code skill to a universal version."
trigger_phrases:
  - "decision"
  - "record"
  - "workflows"
  - "code"
  - "conversion"
  - "decision record"
  - "027"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Decision Record - workflows-code Conversion

## Purpose

Document key architectural and strategic decisions for converting Barter's workflows-code skill to a universal version.

---

<!-- ANCHOR:adr-001 -->
## Decision 1: Replace Angular with React

**Date**: 2026-01-26
**Status**: Approved (User Requirement)
**Decider**: User

<!-- ANCHOR:adr-001-context -->
### Context

Barter's skill includes Angular frontend patterns (7 reference files). Need to decide what replaces them for the universal skill.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-alternatives -->
### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A) React/Next.js** | Most popular, largest ecosystem, user preference | Different paradigm from Angular |
| B) Vue.js | Growing, easy transition | Smaller ecosystem than React |
| C) Keep Angular | Less work | User explicitly rejected |
| D) Support multiple | Comprehensive | Maintenance burden |

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**Option A: React/Next.js**

<!-- /ANCHOR:adr-001-decision -->

### Rationale

1. User explicitly stated: "Something with React (not angular)"
2. React has ~40% market share vs Angular's ~18%
3. Next.js is the dominant React framework for production
4. Better alignment with React Native (code sharing)
5. Most tech companies use React

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Need to create 7 new reference files for React patterns
- Angular-specific patterns (RxJS, NGXS) not directly transferable
- React Query/SWR replace Angular's HttpClient patterns

<!-- /ANCHOR:adr-001-consequences -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## Decision 2: Target Stack Combinations

**Date**: 2026-01-26
**Status**: Approved
**Decider**: Claude Opus 4.5 (based on user guidance)

<!-- ANCHOR:adr-002-context -->
### Context

User requested "popular stack combi seen in tech companies" with "React, Go, Swift, etc."

<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-alternatives -->
### Options Considered

| Option | Stacks | Target Audience |
|--------|--------|-----------------|
| A) Full coverage | All major stacks | Everyone |
| **B) Popular combos** | React, Go, Swift, RN | Modern tech companies |
| C) Minimal | React, Node.js only | Web-focused |

<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-decision -->
### Decision

**Option B: Popular combinations with priority tiers**

P0 (Must): React/Next.js, React Native, Go
P1 (Should): Swift, Node.js/TypeScript
P2 (Nice): Python, DevOps patterns

<!-- /ANCHOR:adr-002-decision -->

### Rationale

1. Covers 80%+ of modern tech company stacks
2. React/Next.js dominates web frontend
3. React Native provides cross-platform mobile
4. Go is increasingly popular for backend services
5. Swift adds iOS native option for performance-critical apps
6. Node.js provides familiar backend for frontend developers

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- Primary focus on React ecosystem (web + mobile)
- Go backend patterns are comprehensive (from Barter)
- Swift patterns need to be created from scratch
- Python/DevOps are lower priority (P2)

<!-- /ANCHOR:adr-002-consequences -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## Decision 3: Anonymization Depth

**Date**: 2026-01-26
**Status**: Approved
**Decider**: Claude Opus 4.5

<!-- ANCHOR:adr-003-context -->
### Context

Barter's skill contains project-specific references that must be removed. Need to decide how deep to anonymize.

<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-alternatives -->
### Options Considered

| Option | Approach | Risk |
|--------|----------|------|
| A) Surface only | Replace names only | May miss context |
| **B) Full anonymization** | Names + domain + examples | Thorough |
| C) Rewrite from scratch | Don't use Barter content | Loses value |

<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-decision -->
### Decision

**Option B: Full anonymization**

Three-level approach:
1. **Find/Replace**: Direct name substitution
2. **Domain Terms**: Context-aware replacement
3. **Code Examples**: Review and generalize

<!-- /ANCHOR:adr-003-decision -->

### Rationale

1. Barter-specific domain terms (Deal, Partner, etc.) would confuse users
2. Code examples with Barter entities aren't reusable
3. Complete removal ensures no accidental leakage
4. Still preserves valuable architectural patterns

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- All 23 Go files need review (12 keep, 8 remove, 3 partial)
- Domain-specific files (deals, partners, etc.) removed entirely
- Code examples rewritten with generic entities
- Verification step with grep checks

<!-- /ANCHOR:adr-003-consequences -->

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## Decision 4: Directory Structure

**Date**: 2026-01-26
**Status**: Approved
**Decider**: Claude Opus 4.5

<!-- ANCHOR:adr-004-context -->
### Context

Barter uses project-specific folder names (barter-expo, fe-partners-app). Need universal naming.

<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-alternatives -->
### Options Considered

| Option | Structure | Example |
|--------|-----------|---------|
| A) By project type | `mobile/`, `web/`, `backend/` | Generic but flat |
| **B) By stack** | `frontend/react/`, `backend/go/` | Clear and extensible |
| C) Flat | All in `references/` | Simple but cluttered |

<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-decision -->
### Decision

**Option B: By stack with platform grouping**

```
references/
├── frontend/
│   └── react/          # React/Next.js patterns
├── mobile/
│   ├── react-native/   # Cross-platform
│   └── swift/          # iOS native
├── backend/
│   ├── go/             # Go microservices
│   └── nodejs/         # Node.js services
├── devops/             # Infrastructure patterns
├── debugging/          # Cross-stack
├── verification/       # Cross-stack
├── implementation/     # Cross-stack
└── standards/          # Cross-stack
```

<!-- /ANCHOR:adr-004-decision -->

### Rationale

1. Clear separation by technology
2. Easy to add new stacks (e.g., `mobile/kotlin/`)
3. Cross-stack patterns remain shared
4. Mirrors how developers think about projects

<!-- ANCHOR:adr-004-consequences -->
### Consequences

- Need to create new directory structure
- Barter's flat structure needs reorganization
- Stack detection updates to use new paths
- More files to maintain but better organized

<!-- /ANCHOR:adr-004-consequences -->

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## Decision 5: Skill Name and Identity

**Date**: 2026-01-26
**Status**: Pending Discussion

<!-- ANCHOR:adr-005-context -->
### Context

Need to decide if this replaces the existing `workflows-code` skill in public repo or becomes a new skill.

<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-alternatives -->
### Options Considered

| Option | Name | Impact |
|--------|------|--------|
| **A) Replace existing** | `workflows-code` | Single universal skill |
| B) New skill | `workflows-code-universal` | Two skills to maintain |
| C) Separate skills | Per-stack skills | Many skills |

<!-- /ANCHOR:adr-005-alternatives -->

<!-- ANCHOR:adr-005-decision -->
### Decision

**Option A: Replace existing `workflows-code`**

The current public repo `workflows-code` is Webflow-specific. Replace it with the universal version that includes all stacks.

<!-- /ANCHOR:adr-005-decision -->

### Rationale

1. Single source of truth for code workflows
2. Webflow patterns can be a subset (references/webflow/)
3. Avoids skill proliferation
4. Maintains existing skill_advisor.py routing

<!-- ANCHOR:adr-005-consequences -->
### Consequences

- Current Webflow-specific skill archived
- Webflow patterns become one reference subdirectory
- skill_advisor.py keywords updated
- SKILL.md version bumps to 3.0.0

<!-- /ANCHOR:adr-005-consequences -->

<!-- /ANCHOR:adr-005 -->

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial decisions documented |
