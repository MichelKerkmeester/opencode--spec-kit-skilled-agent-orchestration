---
title: "Implementation Plan: Documentation Alignment for Spec 126 [127-documentation-alignment/plan]"
description: "Update all documentation files to reflect spec 126 features: 5-source indexing pipeline, 7 intent types, 11 document types with scoring multipliers, schema v13, spec document cr..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "documentation"
  - "alignment"
  - "for"
  - "127"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->

# Implementation Plan: Documentation Alignment for Spec 126

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Overview

Update all documentation files to reflect spec 126 features: 5-source indexing pipeline, 7 intent types, 11 document types with scoring multipliers, schema v13, spec document crawler, and causal chains. Pure documentation changes across 10+ files.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec 126 implementation complete and merged
- [x] All spec 126 features identified and catalogued
- [x] Target files identified with specific sections and line numbers

### Definition of Done

- [ ] All modified files use "5-source" (not "4-source")
- [ ] All modified files use "7 intents" (not "5 intents")
- [ ] Changelogs created with sequential version numbers
- [ ] No broken ANCHOR tags

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION PHASES

### Phase 1: Create Spec Folder 127

- [ ] T001 Create spec folder structure with memory/ directory
- [ ] T002 Create spec.md (Level 1)
- [ ] T003 Create plan.md and tasks.md

### Phase 2: Root README.md

- [ ] T004 Add spec documents as 5th indexing source (~L81)
- [ ] T005 Add `find_spec` + `find_decision` to intent table, update "5 task types" -> "7 task types" (~L314)

### Phase 3: System Spec Kit README.md

- [ ] T006 Update Key Innovations table: "5 intent types" -> "7"; add Document-Type Scoring row (~L75)
- [ ] T007 Update memory_index_scan tool entry: add `includeSpecDocs` parameter (~L385)
- [ ] T008 Rename 4-Source -> 5-Source Pipeline, add spec documents row (~L490)
- [ ] T009 Add Spec 126 entry to Recent Changes section (~L783)

### Phase 4: MCP Server README.md

- [ ] T010 Update Key Innovations: 4-Source -> 5-Source; add Document-Type Scoring row (~L81)
- [ ] T011 Update memory_index_scan params: add `includeSpecDocs` + spec documents source row (~L263)
- [ ] T012 Add `find_spec` + `find_decision` to Intent-Aware Retrieval (5 -> 7 intents) (~L524)
- [ ] T013 Add `SPECKIT_INDEX_SPEC_DOCS` to Feature Flags section (~L893)
- [ ] T014 Note schema v13 columns in Database Schema section (~L920)
- [ ] T015 Update intent-classifier.ts comment (5 -> 7 intents) in Structure section (~L700)

### Phase 5: SKILL.md

- [ ] T016 Bump version header 2.2.8.0 -> 2.2.9.0
- [ ] T017 Add spec document indexing to memory_index_scan description (~L141)
- [ ] T018 Add document-type scoring bullet to Key Concepts (~L507)

### Phase 6: Reference Files

- [ ] T019 memory_system.md: Add spec documents as 5th source in Indexable Content Sources (~L33)
- [ ] T020 memory_system.md: Add `includeSpecDocs` to memory_index_scan params (~L128)
- [ ] T021 memory_system.md: Note `find_spec` + `find_decision` intents
- [ ] T022 readme_indexing.md: Update 4-Source -> 5-Source pipeline, add spec documents row (~L45)
- [ ] T023 save_workflow.md: Add spec documents row to Other Indexed Content table (~L323)

### Phase 7: Changelogs

- [ ] T024 Create `.opencode/changelog/01--system-spec-kit/v2.2.17.0.md`
- [ ] T025 Create `.opencode/changelog/00--opencode-environment/v2.0.5.0.md`

### Phase 8: Post-Implementation

- [ ] T026 Create implementation-summary.md

<!-- /ANCHOR:phases -->

## 4. EXECUTION ORDER

```
Phase 1 (spec folder)     FIRST
     |
Phases 2-6 (docs)         PARALLEL
     |
Phase 7 (changelogs)      AFTER docs
     |
Phase 8 (impl summary)    LAST
```

<!-- ANCHOR:rollback -->
## 5. ROLLBACK PLAN

- **Trigger**: Broken ANCHOR tags or inconsistent cross-references
- **Procedure**: Revert individual file changes via git; documentation-only changes are low-risk

<!-- /ANCHOR:rollback -->

## 6. RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [e.g., 4-8 hours] |
| Verification | [Low/Med/High] | [e.g., 1-2 hours] |
| **Total** | | **[e.g., 6-12 hours]** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]

<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| [Component A] | None | [Output] | B, C |
| [Component B] | A | [Output] | D |
| [Component C] | A | [Output] | D |
| [Component D] | B, C | [Final] | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **[Phase/Task]** - [Duration estimate] - CRITICAL
2. **[Phase/Task]** - [Duration estimate] - CRITICAL
3. **[Phase/Task]** - [Duration estimate] - CRITICAL

**Total Critical Path**: [Sum of durations]

**Parallel Opportunities**:
- [Task A] and [Task B] can run simultaneously
- [Task C] and [Task D] can run after Phase 1

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [Setup Complete] | [All dependencies ready] | [Date/Phase] |
| M2 | [Core Done] | [Main features working] | [Date/Phase] |
| M3 | [Release Ready] | [All tests pass] | [Date/Phase] |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: [Decision Title]

**Status**: [Proposed/Accepted/Deprecated]

**Context**: [What problem we're solving]

**Decision**: [What we decided]

**Consequences**:
- [Positive outcome 1]
- [Negative outcome + mitigation]

**Alternatives Rejected**:
- [Option B]: [Why rejected]

---

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md (sections 1-3)
**Duration**: ~60s
**Agent**: Primary

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Plan Agent | plan.md | Technical approach |
| Checklist Agent | checklist.md | Verification items |
| Requirements Agent | spec.md (4-6) | Requirements detail |

**Duration**: ~90s (parallel)

### Tier 3: Integration
**Agent**: Primary
**Task**: Merge outputs, resolve conflicts
**Duration**: ~60s

<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | [Core Logic] | [Primary] | [file1.ts, file2.ts] | [Active] |
| W-B | [UI Components] | [Secondary] | [comp1.tsx, comp2.tsx] | [Active] |
| W-C | [Tests] | [Primary] | [test/*.ts] | [Blocked on W-A] |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A, W-B complete | All agents | Integration test |
| SYNC-002 | All workstreams | All agents | Final verification |

### File Ownership Rules
- Each file owned by ONE workstream
- Cross-workstream changes require SYNC
- Conflicts resolved at sync points

<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: Status update in tasks.md
- **Per Phase**: Review meeting notes
- **Blockers**: Immediate escalation

### Escalation Path
1. Technical blockers → Engineering Lead
2. Scope changes → Product Owner
3. Resource issues → Project Manager

<!-- /ANCHOR:communication -->

---
