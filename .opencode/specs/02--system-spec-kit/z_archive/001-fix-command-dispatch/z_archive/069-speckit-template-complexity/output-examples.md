# Output Examples: Complexity Detection & Template Scaling

This document demonstrates the complexity detection system across all levels with real examples showing how task descriptions affect recommended levels and template output.

---

## Overview: 5-Dimension Scoring Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLEXITY SCORING                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Scope         ████████████████████████████         25%         │
│  Risk          ████████████████████████████         25%         │
│  Research      ████████████████████                 20%         │
│  Multi-Agent   ████████████████                     15%         │
│  Coordination  ████████████████                     15%         │
│                                                    ─────        │
│                                              Total: 100%        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  LEVEL MAPPING                                                  │
│  ─────────────                                                  │
│  Score 0-25   → Level 1 (Baseline)                              │
│  Score 26-55  → Level 2 (Verification)                          │
│  Score 56-79  → Level 3 (Full)                                  │
│  Score 80-100 → Level 3+ (Extended)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Example 1: Level 1 (Baseline) - Simple Task

### Input
```
"Fix typo in README file"
```

### CLI Output
```
┌─────────────────────────────────────────────────────────────┐
│ COMPLEXITY ANALYSIS                                         │
│                                                             │
│   Recommended Level: 1 (Baseline)                           │
│   Score: 0/100 | Confidence: 60%                            │
│                                                             │
│   Breakdown:                                                │
│   ├── Scope: 0/25 (Minimal scope detected)                  │
│   ├── Risk: 0/25 (Low risk detected)                        │
│   ├── Research: 0/20 (Minimal research needed)              │
│   ├── Multi-Agent: 0/15 (Single-stream)                     │
│   ├── Coordination: 0/15 (Independent)                      │
│                                                             │
│   Accept Level? (Y) or Override (1/2/3):                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Signals Detected
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 0 | Minimal scope - no LOC/files mentioned |
| Risk | 0 | No auth, security, or API keywords |
| Research | 0 | No investigation or external deps |
| Multi-Agent | 0 | Single-stream - no phases/workstreams |
| Coordination | 0 | Independent - no dependencies |

### Required Files
```
specs/XXX-fix-typo/
├── spec.md                    ✓ Required
├── plan.md                    ✓ Required
├── tasks.md                   ✓ Required
└── implementation-summary.md  ✓ Required (after implementation)
```

### Template Scaling (spec.md)

**Level 1 EXCLUDES these sections** (via COMPLEXITY_GATE):
- ❌ Complexity Assessment table
- ❌ Executive Summary section

**Level 1 Section Counts:**
| Section | Min | Max |
|---------|-----|-----|
| User Stories | 1 | 2 |
| Phases | 2 | 3 |
| Tasks | 5 | 15 |
| Checklist Items | 10 | 20 |

### Features Available
```json
{
  "available": [],
  "required": []
}
```
*No advanced features at Level 1*

---

## Example 2: Level 2 (Verification) - Medium Task

### Input
```
"Full platform rewrite with 12 parallel workstreams, multiple agents
coordinating across frontend, backend, infrastructure. Phase 1 through
Phase 10 covering: authentication with OAuth2/SAML/MFA (1000 LOC),
database redesign (50 tables, 2000 LOC), API v2 migration (100 endpoints),
microservices architecture, Kubernetes deployment, comprehensive security
audit with penetration testing, external integrations with Stripe, AWS,
Auth0, Datadog."
```

### CLI Output
```
┌─────────────────────────────────────────────────────────────┐
│ COMPLEXITY ANALYSIS                                         │
│                                                             │
│   Recommended Level: 2 (Verification)                       │
│   Score: 48/100 | Confidence: 95%                           │
│                                                             │
│   Breakdown:                                                │
│   ├── Scope: 15/25 (~1000 LOC)                              │
│   ├── Risk: 14/25 (Security/Auth: authentication, security) │
│   ├── Research: 3/20 (External: external, service)          │
│   ├── Multi-Agent: 15/15 (Coordination: parallel, workstream)│
│   ├── Coordination: 2/15 (Integration: integration)         │
│                                                             │
│   Accept Level? (Y) or Override (1/2/3):                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Signals Detected
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 59 | ~1000 LOC, systems: database, api, frontend, backend, migration |
| Risk | 54 | High: authentication, security; Medium: api, database, migration |
| Research | 16 | External: external, service |
| Multi-Agent | 100 | Parallel, workstream, phases detected (3), workstreams (3) |
| Coordination | 10 | Integration keyword detected |

### Required Files
```
specs/XXX-platform-rewrite/
├── spec.md                    ✓ Required
├── plan.md                    ✓ Required
├── tasks.md                   ✓ Required
├── checklist.md               ✓ Required (Level 2+)
└── implementation-summary.md  ✓ Required (after implementation)
```

### Template Scaling (spec.md)

**Level 2 INCLUDES these sections** (via COMPLEXITY_GATE):
- ✅ **Complexity Assessment table** - Auto-populated with scores

**Level 2 EXCLUDES these sections:**
- ❌ Executive Summary section (Level 3+)

**Level 2 Section Counts:**
| Section | Min | Max |
|---------|-----|-----|
| User Stories | 2 | 4 |
| Phases | 3 | 5 |
| Tasks | 15 | 50 |
| Checklist Items | 30 | 50 |

### Features Available
```json
{
  "available": [
    "dependencyGraph",
    "effortEstimation",
    "researchMethodology",
    "milestones"
  ],
  "required": []
}
```

**Feature Details:**
| Feature | Status | Format |
|---------|--------|--------|
| Dependency Graph | Available | Table format |
| Effort Estimation | Available | Story points |
| Research Methodology | Available | For research specs |
| Milestones | Available | Progress checkpoints |

---

## Example 3: Level 3 (Full) - Complex Task

### Input
```
"Enterprise platform migration requiring 8 parallel workstreams with agent
coordination. Phase 1: Database migration (500 LOC, 20 files). Phase 2:
Authentication system with OAuth2, MFA, JWT. Phase 3: API redesign.
Dependencies: Auth blocks API, DB blocks Auth. External dependencies on
AWS, Stripe, SendGrid. Investigation needed for legacy code. Security
audit and encryption required."
```

### CLI Output
```
┌─────────────────────────────────────────────────────────────┐
│ COMPLEXITY ANALYSIS                                         │
│                                                             │
│   Recommended Level: 3 (Full)                               │
│   Score: 62/100 | Confidence: 95%                           │
│                                                             │
│   Breakdown:                                                │
│   ├── Scope: 19/25 (~500 LOC)                               │
│   ├── Risk: 25/25 (Security/Auth: authentication, auth, jwt...)│
│   ├── Research: 2/20 (External: external)                   │
│   ├── Multi-Agent: 15/15 (Coordination: parallel, workstream)│
│   ├── Coordination: 2/15 (Dependencies: blocks)             │
│                                                             │
│   Accept Level? (Y) or Override (1/2/3):                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Signals Detected
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 77 | ~500 LOC, 20 files, systems: database, db, api, migration |
| Risk | 99 | High: authentication, auth, jwt, security, encryption; Medium: api, database, migration |
| Research | 8 | External dependency detected |
| Multi-Agent | 100 | Parallel, workstream, 3 phases, 2 workstreams, full orchestration |
| Coordination | 12 | Dependencies: blocks keyword |

### Required Files
```
specs/XXX-enterprise-migration/
├── spec.md                    ✓ Required
├── plan.md                    ✓ Required
├── tasks.md                   ✓ Required
├── checklist.md               ✓ Required (Level 2+)
├── decision-record.md         ✓ Required (Level 3)
└── implementation-summary.md  ✓ Required (after implementation)
```

### Template Scaling (spec.md)

**Level 3 INCLUDES these sections** (via COMPLEXITY_GATE):
- ✅ **Complexity Assessment table** - Auto-populated with scores
- ✅ **Executive Summary section** - High-level overview for stakeholders

**Level 3 Section Counts:**
| Section | Min | Max |
|---------|-----|-----|
| User Stories | 4 | 8 |
| Phases | 5 | 8 |
| Tasks | 50 | 100 |
| Checklist Items | 60 | 100 |

### Features Available
```json
{
  "available": [
    "aiProtocol",
    "dependencyGraph",
    "effortEstimation",
    "executiveSummary",
    "researchMethodology",
    "workstreamOrganization",
    "milestones"
  ],
  "required": []
}
```

**Feature Details:**
| Feature | Status | Format |
|---------|--------|--------|
| AI Protocol | Available | Not required yet |
| Dependency Graph | Available | ASCII format |
| Effort Estimation | Available | Full estimation |
| Executive Summary | Available | Stakeholder overview |
| Research Methodology | Available | Investigation framework |
| Workstream Organization | Available | Parallel streams |
| Milestones | Available | Go/no-go decisions |

---

## Example 4: Level 3+ (Extended) - Enterprise Task

### Threshold
**Score 80+** triggers Level 3+ (Extended) which adds:
- AI Execution Protocol (REQUIRED)
- Extended Checklist (REQUIRED)
- Workstream Organization (REQUIRED)
- Full DAG dependency visualization

### Input Pattern for Level 3+
To achieve Level 3+, the task must score high across ALL dimensions:

```
"Enterprise SaaS platform complete rewrite with 20 parallel workstreams
requiring full AI agent orchestration. Investigation and research needed
for unknown legacy systems. 15 phases: Auth (3000 LOC), Database (5000 LOC,
100 tables), API v3 (300 endpoints), Microservices (100 services).
Critical blocking dependencies between ALL phases. External integrations
with 15 services. Comprehensive security audit, SOC2 compliance, HIPAA
requirements. Investigation of performance bottlenecks. Research needed
for caching strategy. 25 team members across 8 workstreams with complex
blocking relationships."
```

### Required Files (Level 3+)
```
specs/XXX-enterprise-rewrite/
├── spec.md                    ✓ Required
├── plan.md                    ✓ Required
├── tasks.md                   ✓ Required
├── checklist.md               ✓ Required
├── decision-record.md         ✓ Required
├── research.md                ✓ Optional (but recommended)
└── implementation-summary.md  ✓ Required (after implementation)
```

### Template Scaling (Level 3+)

**Level 3+ Section Counts:**
| Section | Min | Max |
|---------|-----|-----|
| User Stories | 8 | 15 |
| Phases | 8 | 12 |
| Tasks | 100+ | - |
| Checklist Items | 100 | 150 |

### Features (Level 3+)
```json
{
  "available": [
    "aiProtocol",
    "dependencyGraph",
    "effortEstimation",
    "extendedChecklist",
    "executiveSummary",
    "researchMethodology",
    "workstreamOrganization",
    "milestones"
  ],
  "required": [
    "aiProtocol",
    "extendedChecklist",
    "workstreamOrganization"
  ]
}
```

**Required Features at Level 3+:**
| Feature | Description |
|---------|-------------|
| AI Protocol | Pre-task checklist, execution rules, status reporting |
| Extended Checklist | 100-150 comprehensive validation items |
| Workstream Organization | Parallel workstreams and coordination protocol |

---

## Template Content Comparison

### COMPLEXITY_GATE Sections in spec.md

```markdown
<!-- Level 1: These sections are EXCLUDED -->

<!-- COMPLEXITY_GATE: level>=2 -->
### Complexity Assessment

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [AUTO]/25 | [AUTO: files, LOC, systems] |
| Risk | [AUTO]/25 | [AUTO: auth, api, breaking] |
| Research | [AUTO]/20 | [AUTO: investigation needs] |
| Multi-Agent | [AUTO]/15 | [AUTO: workstreams] |
| Coordination | [AUTO]/15 | [AUTO: dependencies] |
| **Overall** | **[AUTO]/100** | **Level [AUTO]** |
<!-- /COMPLEXITY_GATE -->

<!-- Level 2: Above section INCLUDED, below EXCLUDED -->

<!-- COMPLEXITY_GATE: level>=3, feature=executive-summary -->
### Executive Summary

[2-3 sentence high-level overview for stakeholders]

**Key Decisions**:
- Major decision 1
- Major decision 2

**Critical Dependencies**:
- Blocking dependency 1
<!-- /COMPLEXITY_GATE -->

<!-- Level 3+: ALL above sections INCLUDED -->
```

---

## Visual Summary: Level Progression

```
LEVEL 1 (Baseline)           LEVEL 2 (Verification)       LEVEL 3 (Full)              LEVEL 3+ (Extended)
Score: 0-25                  Score: 26-55                 Score: 56-79                Score: 80-100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REQUIRED FILES:
├── spec.md ✓               ├── spec.md ✓                ├── spec.md ✓               ├── spec.md ✓
├── plan.md ✓               ├── plan.md ✓                ├── plan.md ✓               ├── plan.md ✓
├── tasks.md ✓              ├── tasks.md ✓               ├── tasks.md ✓              ├── tasks.md ✓
└── impl-summary.md ✓       ├── checklist.md ✓           ├── checklist.md ✓          ├── checklist.md ✓
                            └── impl-summary.md ✓        ├── decision-record.md ✓    ├── decision-record.md ✓
                                                         └── impl-summary.md ✓       └── impl-summary.md ✓

SPEC.MD SECTIONS:
├── Complexity Assessment ❌ ├── Complexity Assessment ✓  ├── Complexity Assessment ✓ ├── Complexity Assessment ✓
└── Executive Summary ❌     └── Executive Summary ❌      ├── Executive Summary ✓     ├── Executive Summary ✓
                                                         └── AI Protocol (optional)  └── AI Protocol (REQUIRED)

FEATURES:
├── None                    ├── Dependency Graph (table) ├── Dependency Graph (ascii)├── Dependency Graph (DAG)
│                           ├── Effort Estimation        ├── Effort Estimation       ├── Effort Estimation
│                           ├── Milestones               ├── Milestones              ├── Milestones
│                           └── Research Methodology     ├── Research Methodology    ├── Research Methodology
│                                                        ├── Executive Summary       ├── Executive Summary
│                                                        ├── Workstream Org          ├── Workstream Org (REQ)
│                                                        └── AI Protocol             ├── AI Protocol (REQ)
│                                                                                    └── Extended Checklist (REQ)

SECTION COUNTS:
├── User Stories: 1-2       ├── User Stories: 2-4        ├── User Stories: 4-8       ├── User Stories: 8-15
├── Phases: 2-3             ├── Phases: 3-5              ├── Phases: 5-8             ├── Phases: 8-12
├── Tasks: 5-15             ├── Tasks: 15-50             ├── Tasks: 50-100           ├── Tasks: 100+
└── Checklist: 10-20        └── Checklist: 30-50         └── Checklist: 60-100       └── Checklist: 100-150
```

---

## CLI Usage Reference

### Basic Detection
```bash
# Human-readable output
node scripts/detect-complexity.js --request "Your task description"

# JSON output (for automation)
node scripts/detect-complexity.js --request "Your task description" --json

# Quiet mode (level number only)
node scripts/detect-complexity.js --request "Your task description" --quiet

# From file
node scripts/detect-complexity.js --file path/to/request.txt
```

### Template Expansion
```bash
# Single template at specific level
node scripts/expand-template.js --template spec.md --level 2

# All templates for spec folder
node scripts/expand-template.js --all --spec-folder specs/001/ --level 3

# Dry run (preview only)
node scripts/expand-template.js --template plan.md --level 3 --dry-run
```

### Create Spec Folder with Auto-Detection
```bash
# Auto-detect complexity from request
./scripts/create-spec-folder.sh --name "add-auth" --complexity --request "Add OAuth2..."

# With template expansion
./scripts/create-spec-folder.sh --name "add-auth" --level 2 --expand
```

---

## Dimension Signal Keywords

### Scope Signals
| Pattern | Points | Example |
|---------|--------|---------|
| `X LOC` or `X lines` | Up to 25 | "500 LOC" |
| `X files` | Up to 15 | "20 files" |
| System keywords | 3-5 each | database, api, frontend, backend, migration |

### Risk Signals
| Pattern | Points | Example |
|---------|--------|---------|
| High-risk keywords | 15 each | authentication, auth, jwt, security, encryption, password |
| Medium-risk keywords | 8 each | api, database, migration, config |
| Breaking change keywords | 20 | breaking, deprecat, major version |

### Research Signals
| Pattern | Points | Example |
|---------|--------|---------|
| Investigation keywords | 15 each | investigate, research, analyze, explore |
| Uncertainty keywords | 10 each | unknown, unclear, uncertain, maybe |
| External dependency keywords | 8 each | external, third-party, service, integration |

### Multi-Agent Signals
| Pattern | Points | Example |
|---------|--------|---------|
| Coordination keywords | 20 each | parallel, workstream, coordinate, orchestrat |
| Complexity keywords | 10 each | comprehensive, enterprise, platform, complex |
| Phase count | 15 per phase | "Phase 1", "Phase 2" |
| Workstream count | 10 per stream | "5 workstreams" |

### Coordination Signals
| Pattern | Points | Example |
|---------|--------|---------|
| Dependency keywords | 10 each | depends on, requires, blocks, blocking |
| Cross-system keywords | 8 each | integration, interface, handoff |
| Blocking keywords | 15 each | critical, blocker, must complete first |

---

## Summary

The complexity detection system provides:

1. **Automated Level Recommendation** - Based on 5-dimension scoring
2. **Template Scaling** - Content adapts via COMPLEXITY_GATE markers
3. **Feature Availability** - Appropriate tools unlock at each level
4. **Section Counts** - Guidelines for documentation depth
5. **Required Files** - Checklist, decision-record added at higher levels

This ensures documentation scales appropriately with task complexity.
