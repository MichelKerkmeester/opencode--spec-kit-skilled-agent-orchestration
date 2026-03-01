---
title: "Implementation Plan: AI Auto-Populate on Spec Upgrade [128-upgrade-auto-populate/plan]"
description: "This implements a post-upgrade AI workflow step that automatically populates template placeholders injected by upgrade-level.sh. The approach is workflow-driven (AI agent instru..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "auto"
  - "populate"
  - "spec"
  - "128"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: AI Auto-Populate on Spec Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Shell (bash), AI workflow instructions |
| **Framework** | SpecKit v2.2 (template + addendum architecture) |
| **Storage** | Filesystem (spec folder .md files) |
| **Testing** | Manual verification via grep for placeholder patterns |

### Overview

This implements a post-upgrade AI workflow step that automatically populates template placeholders injected by `upgrade-level.sh`. The approach is workflow-driven (AI agent instructions), not code-driven (no script changes). After the shell script creates structural scaffolding, the AI agent reads existing spec context and replaces all `[placeholder]` patterns with derived, accurate content.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (zero placeholders remaining)
- [x] Dependencies identified (upgrade-level.sh must run first)

### Definition of Done
- [x] All acceptance criteria met (R-001 through R-007)
- [x] Demonstrated on at least one real spec folder upgrade
- [x] Workflow documentation updated with post-upgrade populate instructions

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow orchestration — the AI agent follows a defined sequence of read-extract-populate steps after the upgrade script completes.

### Key Components
- **Context Extractor**: AI reads all existing spec files and builds understanding of the spec's problem, scope, phases, requirements, and decisions
- **Placeholder Identifier**: AI scans injected template sections for `[...]` placeholder patterns and generic template text
- **Content Populator**: AI uses Edit tool to replace each placeholder with context-derived content
- **Verification Pass**: AI greps all files for remaining placeholder patterns to confirm zero remain

### Data Flow
```
upgrade-level.sh output → AI reads all .md files → AI extracts context
→ AI identifies placeholders → AI replaces with derived content → verification grep
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Context Extraction
- [x] Read all existing spec folder documents (spec.md, plan.md, tasks.md, implementation-summary.md)
- [x] Extract key context: problem statement, requirements, phases, decisions, files changed
- [x] Identify which files were modified/created by the upgrade script

### Phase 2: Placeholder Population
- [x] Populate spec.md L2 sections (NFRs, Edge Cases, Complexity Assessment)
- [x] Populate spec.md L3 sections (Risk Matrix, User Stories)
- [x] Populate spec.md L3+ sections (Approval Workflow, Compliance, Stakeholders, Change Log)
- [x] Create and populate plan.md with all L2/L3/L3+ sections
- [x] Populate checklist.md with spec-specific verification items
- [x] Populate decision-record.md with actual architectural decisions
- [x] Create tasks.md with real implementation tasks
- [x] Create implementation-summary.md

### Phase 3: Verification
- [x] Grep all files for remaining `[placeholder]` patterns
- [x] Verify original user content preserved unchanged
- [x] Confirm all SPECKIT_LEVEL markers show correct level (3+)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | All populated documents reviewed for accuracy | Human review |
| Automated | Grep for `[placeholder]` patterns across all .md files | `grep -rn '\[.*\]'` |
| Diff | Compare backup with populated files to verify original content preserved | `diff` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| upgrade-level.sh | Internal | Green | Cannot populate without scaffolding |
| Existing spec.md content | Internal | Green | Cannot derive context from empty spec |
| Edit tool availability | Internal | Green | Cannot replace placeholders without Edit |
| Template addendum files | Internal | Green | Need to understand what sections are injected |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Auto-populate produces inaccurate content or corrupts user content
- **Procedure**: Restore from `.backup-*` directory created by upgrade-level.sh, then re-run upgrade without populate step

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Context Extraction) ──► Phase 2 (Placeholder Population) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Context Extraction | upgrade-level.sh completion | Placeholder Population |
| Placeholder Population | Context Extraction | Verification |
| Verification | Placeholder Population | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Context Extraction | Low | ~30 seconds (AI reads files) |
| Placeholder Population | Medium | ~2-5 minutes (AI edits all files) |
| Verification | Low | ~15 seconds (grep scan) |
| **Total** | | **~3-6 minutes per upgrade** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created by upgrade-level.sh (automatic)
- [ ] Verify backup integrity before populate begins
- [ ] Original spec.md content noted for comparison

### Rollback Procedure
1. Stop the AI populate workflow immediately
2. Restore all .md files from `.backup-*` directory in spec folder
3. Re-run upgrade-level.sh to regenerate scaffolding
4. Optionally re-attempt populate with corrected approach

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File restore from backup directory

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐     ┌────────────────┐
│   upgrade-level.sh  │────►│  Context Extraction  │────►│   Populate     │
│   (scaffolding)     │     │  (read all files)    │     │   (edit files) │
└─────────────────────┘     └─────────────────────┘     └───────┬────────┘
                                                                │
                                                          ┌─────▼──────┐
                                                          │  Verify    │
                                                          │  (grep)    │
                                                          └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| upgrade-level.sh | spec.md exists | Scaffolded .md files | Context Extraction |
| Context Extraction | Scaffolded files | Understanding of spec context | Populate |
| Populate (spec.md) | Context | Populated spec sections | Verify |
| Populate (plan.md) | Context | Populated plan sections | Verify |
| Populate (checklist.md) | Context | Spec-specific checklist | Verify |
| Populate (decision-record.md) | Context | Actual ADRs | Verify |
| Verify | All populated files | Confirmation report | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **upgrade-level.sh execution** - ~5 seconds - CRITICAL
2. **Context extraction (read all files)** - ~10 seconds - CRITICAL
3. **spec.md population** - ~60 seconds - CRITICAL
4. **plan.md creation + population** - ~60 seconds - CRITICAL
5. **Supporting files (checklist, decision-record, tasks)** - ~90 seconds - PARALLELIZABLE

**Total Critical Path**: ~2.5 minutes

**Parallel Opportunities**:
- checklist.md and decision-record.md population can run simultaneously
- tasks.md and implementation-summary.md can be created in parallel

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Upgrade script completes | All scaffolding injected, backup created | Phase 1 start |
| M2 | All spec.md sections populated | Zero placeholders in spec.md | Phase 2 mid |
| M3 | All documents populated | Zero placeholders across all files | Phase 2 end |
| M4 | Verification passes | Grep confirms zero placeholder patterns | Phase 3 end |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: AI-Side Workflow vs Script Modification

**Status**: Accepted

**Context**: The upgrade script produces placeholder-filled files. We need to decide whether to modify the shell script to generate better content or have the AI agent populate after the script runs.

**Decision**: AI-side workflow — the shell script stays as-is (structural scaffolding only), and the AI agent populates content as a post-upgrade step.

**Consequences**:
- Positive: Shell script remains simple and deterministic
- Negative: Requires AI agent involvement for every upgrade (mitigated by workflow automation)

**Alternatives Rejected**:
- Script modification: Shell cannot reason about content; would require embedding templates with conditional logic

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md (read existing sections 1-6)
**Duration**: ~10s
**Agent**: Primary

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Primary Agent | spec.md population | L2/L3/L3+ sections (7-16) |
| Primary Agent | plan.md creation | All plan sections |
| Primary Agent | Supporting files | checklist.md, decision-record.md, tasks.md |

**Duration**: ~120s (sequential in single-agent, parallelizable with sub-agents)

### Tier 3: Integration
**Agent**: Primary
**Task**: Verify all files, grep for remaining placeholders, report results
**Duration**: ~15s

<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Spec Population | Primary Agent | spec.md | Active |
| W-B | Plan Creation | Primary Agent | plan.md | Active |
| W-C | Supporting Docs | Primary Agent | checklist.md, decision-record.md, tasks.md, implementation-summary.md | Active |
| W-D | Verification | Primary Agent | All .md files | Blocked on W-A, W-B, W-C |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A, W-B, W-C complete | Primary Agent | Full verification pass |
| SYNC-002 | Verification complete | Primary Agent | Populate report |

### File Ownership Rules
- Each file owned by ONE workstream (no conflicts in single-agent execution)
- Cross-file references (e.g., plan.md referencing spec.md sections) resolved during population
- Verification workstream reads all files but modifies none

<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per File**: Report what was populated in each document
- **Per Phase**: Summary of progress and remaining work
- **Completion**: Final report with placeholder count (target: 0)

### Escalation Path
1. Placeholder detection failure → Manual grep review
2. Content accuracy concern → Human review of populated sections
3. Upgrade script bug → Separate spec (EXECUTIVE SUMMARY false positive)

<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN (~260 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
-->
