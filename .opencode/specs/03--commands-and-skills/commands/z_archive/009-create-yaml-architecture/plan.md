---
title: "Implementation Plan: Create Commands YAML-First Architecture Refactor [009-create-yaml-architecture/plan]"
description: "Refactor all 6 create commands from an inverted inline-workflow model to YAML-first architecture matching the spec_kit command pattern. The refactor proceeds in 4 phases: bug fi..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "create"
  - "commands"
  - "yaml"
  - "009"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Create Commands YAML-First Architecture Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_DECLARED_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (.md), YAML (.yaml) |
| **Framework** | OpenCode command framework |
| **Storage** | File-based (no database) |
| **Testing** | Manual command execution, structural validation |

### Overview
Refactor all 6 create commands from an inverted inline-workflow model to YAML-first architecture matching the spec_kit command pattern. The refactor proceeds in 4 phases: bug fixes, .md refactor, YAML refactor, and sk-doc alignment. The golden reference strategy refactors skill.md first, then replicates the pattern to the remaining 5 commands.

- **Level**: 3

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (spec_kit reference, sk-doc skill)
- [x] Golden reference pattern established (spec_kit commands)

### Definition of Done
- [ ] All 6 .md files refactored with EXECUTION PROTOCOL banner
- [ ] All 12 YAML files (6 confirm + 6 auto) present and structurally complete
- [ ] All acceptance criteria met (SC-001 through SC-005)
- [ ] Checklist.md fully verified
- [ ] No regression in existing command functionality

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
YAML-First Command Architecture (matching spec_kit convention)

### Key Components
- **`.md` Command Files**: Routing layer with EXECUTION PROTOCOL banner, setup/context, REFERENCE ONLY inline content
- **`_confirm.yaml` Files**: Primary workflow engine with confirmation pauses at each step
- **`_auto.yaml` Files**: Auto-mode workflow engine, identical logic without confirmation pauses
- **Structural Sections**: circuit_breaker, workflow_enforcement, validation gates in all YAMLs

### Data Flow
```
User invokes /create:{command} → .md file loads
  → .md determines mode (auto vs confirm)
  → .md performs Phase 0 setup (pre-YAML guardrail)
  → .md routes to appropriate YAML (_auto or _confirm)
  → YAML executes workflow steps
  → YAML calls validate_document.py in verification
  → Output: generated document
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Bug Fixes
- [ ] Fix step count metadata in existing YAMLs (counts don't match actual steps)
- [ ] Fix orphaned create_agent.yaml (agent.md doesn't reference it correctly)
- [ ] Verify and document current state of all 6 commands

### Phase 2: .md Refactor (Golden Reference Strategy)
- [ ] Refactor skill.md as golden reference:
  - Add EXECUTION PROTOCOL banner
  - Add YAML-first routing logic
  - Annotate inline workflow as REFERENCE ONLY
  - Keep Phase 0 (@write verification) in .md
  - Keep setup/context gathering in .md
- [ ] Replicate skill.md pattern to agent.md
- [ ] Replicate to folder_readme.md
- [ ] Replicate to install_guide.md
- [ ] Replicate to skill_asset.md
- [ ] Replicate to skill_reference.md

### Phase 3: YAML Refactor
- [ ] Rename 6 existing YAMLs to `_confirm` variants
- [ ] Create 6 new `_auto` YAML variants
- [ ] Add missing structural sections to all 12 YAMLs:
  - circuit_breaker
  - workflow_enforcement
  - validation gates
  - mode-specific configuration
- [ ] Verify YAML-MD cross-references are correct

### Phase 4: Workflows-Documentation Alignment
- [ ] Integrate DQI enforcement in YAML verification steps
- [ ] Add validate_document.py calls to verification phase
- [ ] Ensure canonical templates are referenced correctly
- [ ] Verify all generated documents meet DQI standards

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | YAML section completeness | Manual inspection, grep for required sections |
| Functional | Each command produces correct output | Manual command execution (all 6 in both modes) |
| Regression | Confirm mode matches pre-refactor output | Diff comparison of generated documents |
| Integration | DQI validation works end-to-end | validate_document.py execution |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| spec_kit commands (reference architecture) | Internal | Green | Cannot establish pattern to replicate |
| sk-doc skill | Internal | Green | Cannot integrate DQI enforcement |
| validate_document.py | Internal | Green | Cannot verify document quality |
| Existing create command functionality | Internal | Green | Must preserve as regression baseline |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression in command output or broken command execution
- **Procedure**: Git revert to pre-refactor state; each phase is a separate commit for granular rollback

<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Bug Fixes) ───► Phase 2 (.md Refactor) ───► Phase 3 (YAML Refactor) ───► Phase 4 (DQI Alignment)
                              │
                              └── skill.md first (golden reference)
                                    └── then 5 remaining .md files
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Bug Fixes | None | Phase 2 (clean baseline needed) |
| Phase 2: .md Refactor | Phase 1 | Phase 3 (routing must exist before YAML split) |
| Phase 3: YAML Refactor | Phase 2 | Phase 4 (YAMLs must exist before DQI integration) |
| Phase 4: DQI Alignment | Phase 3 | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Bug Fixes | Low | 30-60 min |
| Phase 2: .md Refactor | High | 2-4 hours (skill.md golden ref + 5 replications) |
| Phase 3: YAML Refactor | High | 2-3 hours (6 renames + 6 creates + structural sections) |
| Phase 4: DQI Alignment | Medium | 1-2 hours |
| **Total** | | **5.5-9.5 hours (likely multi-session)** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git branch created for isolation
- [ ] Pre-refactor state committed as baseline
- [ ] Each phase committed separately

### Rollback Procedure
1. Identify failing phase via command testing
2. Git revert to last known-good phase commit
3. Re-test all 6 commands in confirm mode
4. Investigate failure before re-attempting

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (file-based, git-managed)

<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    Phase 1       │────►│    Phase 2       │────►│    Phase 3       │────►│    Phase 4       │
│   Bug Fixes      │     │  .md Refactor    │     │  YAML Refactor   │     │  DQI Alignment   │
│  (30-60 min)     │     │  (2-4 hours)     │     │  (2-3 hours)     │     │  (1-2 hours)     │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘     └──────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │  skill.md first   │
                         │  (golden ref)     │
                         │       │           │
                         │  then 5 others    │
                         │  (parallel-able)  │
                         └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1: Bug Fixes | None | Clean baseline | Phase 2 |
| Phase 2: skill.md (golden ref) | Phase 1 | Replicable pattern | Phase 2 remaining, Phase 3 |
| Phase 2: 5 remaining .md files | skill.md golden ref | All .md files refactored | Phase 3 |
| Phase 3: YAML rename + create | Phase 2 | 12 YAML files | Phase 4 |
| Phase 4: DQI integration | Phase 3 | Quality-enforced commands | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Bug Fixes** - 30-60 min - CRITICAL
2. **Phase 2: skill.md golden reference** - 1-2 hours - CRITICAL
3. **Phase 2: Replicate to 5 .md files** - 1-2 hours - CRITICAL
4. **Phase 3: Rename + Create 12 YAMLs** - 2-3 hours - CRITICAL
5. **Phase 4: DQI alignment** - 1-2 hours - CRITICAL

**Total Critical Path**: 5.5-9.5 hours (all phases serial)

**Parallel Opportunities**:
- Within Phase 2: After skill.md golden ref, the 5 remaining .md files can be done in parallel
- Within Phase 3: The 6 rename + 6 create operations are independent per command
- Phase 4 sub-tasks (DQI per command) are independent

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Bug Fixes Complete | Step counts correct, agent.yaml connected | End of Phase 1 |
| M2 | Golden Reference Done | skill.md fully refactored and tested | End of Phase 2a |
| M3 | All .md Files Refactored | All 6 .md files have EXECUTION PROTOCOL | End of Phase 2 |
| M4 | YAML Architecture Complete | All 12 YAMLs present with full sections | End of Phase 3 |
| M5 | Full Alignment | DQI enforced, all commands tested both modes | End of Phase 4 |

<!-- /ANCHOR:milestones -->

---

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 PLAN - Create Commands YAML-First Architecture Refactor
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
