---
title: Worked Examples Reference
description: Practical scenarios demonstrating SpecKit workflows for different documentation levels.
---

# Worked Examples Reference

Practical scenarios demonstrating SpecKit workflows for different documentation levels.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Are Worked Examples?

These examples demonstrate real-world usage of the SpecKit system across different complexity levels and scenarios. Each example shows the complete flow from Gate 3 (spec folder question) through implementation and completion, providing practical templates you can follow.

**Core Purpose**:
- **Learn by Example** - See complete workflows in action
- **Level Selection** - Understand when to use Level 1, 2, or 3
- **Resume Patterns** - Learn how to continue interrupted work

### Core Principle

> "Every spec folder tells a story - from problem to solution with documented decisions."

### Example Overview

| Example | Scenario | Level | LOC | Key Learning |
|---------|----------|-------|-----|--------------|
| Simple Bug Fix | CSS alignment issue | 1 | ~50 | Minimal documentation |
| Feature Implementation | Notification system | 2 | ~300 | Checklist-driven QA |
| Architecture Change | REST to GraphQL migration | 3 | ~800 | Decision records |
| Resuming Work | Continue previous session | N/A | N/A | Context recovery |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:simple-bug-fix-level-1 -->
## 2. SIMPLE BUG FIX (LEVEL 1)

### Scenario

Fix a CSS alignment issue affecting button positioning on mobile viewports. Estimated scope: ~50 lines of code.

**Why Level 1**: Small, focused change with clear acceptance criteria. No complex dependencies or architectural decisions.

### Workflow

**Phase 1: Initiate with Command**

```bash
User: /spec_kit:complete
AI: Spec folder? A) Existing B) New C) Update related D) Skip
User: B
```

**Phase 2: Provide Details**

```bash
AI: Feature name?
User: fix-button-alignment
AI: Documentation level? (Recommended: 1 based on scope)
User: 1
AI: Creating specs/008-fix-button-alignment/ with Level 1 templates...
```

**Phase 3: Implementation**

The AI creates the spec folder and begins implementation following the generated plan.

### Files Created

```markdown
specs/008-fix-button-alignment/
├── spec.md      # Problem description, acceptance criteria
├── plan.md      # CSS changes needed
├── tasks.md     # [ ] Update button.css, [ ] Test in browsers
├── memory/      # (empty until context save)
└── scratch/     # (empty)
```

### Key Takeaways

| Aspect | Learning |
|--------|----------|
| Level Selection | Level 1 is appropriate for <100 LOC with clear scope |
| Templates | Minimal set: spec.md, plan.md, tasks.md |
| No Checklist | Level 1 skips checklist.md (QA via tasks.md) |
| Speed | Fast setup, immediate implementation |

---

<!-- /ANCHOR:simple-bug-fix-level-1 -->
<!-- ANCHOR:feature-implementation-level-2 -->
## 3. FEATURE IMPLEMENTATION (LEVEL 2)

### Scenario

Add a user notification system with toast messages, persistence, and dismissal functionality. Estimated scope: ~300 lines of code.

**Why Level 2**: Medium complexity feature requiring QA validation. Multiple components involved but no architectural decisions.

### Workflow

**Phase 1: Planning**

```bash
User: /spec_kit:plan
AI: Spec folder? 
User: B (New)
AI: Feature name?
User: notification-system
AI: Documentation level? (Recommended: 2 based on ~300 LOC estimate)
User: 2
```

**Phase 2: Implementation**

```bash
User: /spec_kit:implement specs/009-notification-system/
AI: Loading planning artifacts...
AI: Found: spec.md, plan.md, checklist.md
AI: Ready to implement. Starting with Phase 1 tasks...
```

### Files Created

```markdown
specs/009-notification-system/
├── spec.md        # Feature requirements, acceptance criteria
├── plan.md        # Implementation approach, component breakdown
├── tasks.md       # Granular task list with priorities
├── checklist.md   # QA validation checklist
├── memory/        # Context preservation for multi-session work
└── scratch/       # Debug logs, test scripts
```

### Key Takeaways

| Aspect | Learning |
|--------|----------|
| Two-Phase | Separating plan and implement allows review |
| Checklist | Level 2 adds checklist.md for QA validation |
| Multi-Session | memory/ folder enables context preservation |
| Priority Tags | P0/P1/P2 in checklist.md guide completion order |

---

<!-- /ANCHOR:feature-implementation-level-2 -->
<!-- ANCHOR:architecture-change-level-3 -->
## 4. ARCHITECTURE CHANGE (LEVEL 3)

### Scenario

Migrate from REST API to GraphQL for improved data fetching efficiency. Estimated scope: ~800 lines of code with high risk.

**Why Level 3**: Significant architectural change affecting multiple systems. Requires documented decision rationale for future reference.

### Workflow

**Phase 1: Initiate Planning**

```bash
User: /spec_kit:plan
AI: Spec folder?
User: B (New)
AI: Feature name?
User: graphql-migration
AI: Documentation level? (Recommended: 3 based on ~800 LOC and architectural impact)
User: 3
```

**Phase 2: Decision Record Creation**

Level 3 requires an Architecture Decision Record (ADR):

```markdown
# ADR-001: GraphQL Migration

## Status
Approved

## Context
Current REST API has N+1 query problems causing performance issues.
Mobile clients over-fetch data, increasing bandwidth usage.

## Decision
Migrate to GraphQL with Apollo Server for the API layer.

## Consequences

### Positive
- Reduced over-fetching
- Better developer experience
- Single endpoint simplicity

### Negative
- Learning curve for team
- Migration period complexity
- Caching strategy changes
```

### Files Created

```markdown
specs/010-graphql-migration/
├── spec.md            # Migration scope, success criteria
├── plan.md            # Phased migration approach
├── tasks.md           # Detailed task breakdown
├── checklist.md       # QA and rollback validation
├── decision-record.md # ADR documenting rationale
├── memory/            # Session context, blockers, decisions
└── scratch/           # Migration scripts, test queries
```

### Key Takeaways

| Aspect | Learning |
|--------|----------|
| Decision Record | Level 3 requires decision-record.md (ADR format) |
| Risk Documentation | Consequences section captures trade-offs |
| Rollback Planning | Checklist includes rollback validation |
| Future Reference | ADR serves as historical documentation |

### Phased Coordination Root (Level 3+)

Scenario: Large multi-phase effort requiring root coordination.
1. Create root spec folder (Level 3+): `specs/022-feature/`
2. Root `spec.md` is a coordination document with point-in-time snapshot: directory counts, phase status
3. Create child phases: `specs/022-feature/001-epic/`, `specs/022-feature/002-indexing/`
4. Each child has Parent Spec, Predecessor, Successor navigation metadata
5. Implementation/resume happens in the active child - root is coordination-only
6. Completion: validate recursively, verify root phase-map matches live children

---

<!-- /ANCHOR:architecture-change-level-3 -->
<!-- ANCHOR:resuming-work -->
## 5. RESUMING WORK

### Scenario

Continue work on a feature from a previous session where context was saved.

**Why This Matters**: Long-running features span multiple sessions. Context recovery prevents rework and maintains momentum.

### Workflow

**Phase 1: Resume Command**

```bash
User: /spec_kit:resume specs/009-notification-system/
```

**Phase 2: Context Recovery**

```bash
AI: Loading context for specs/009-notification-system/
    Found: handover.md (from 2 hours ago)
    
    CONTINUATION - Attempt 2
    Last: Completed notification component
    Next: Add notification API endpoint
    Blockers: None
    
    Progress: 60% (6/10 checklist items)
    
    Ready to continue. Starting with: Add notification API endpoint
```

### Files Created

| File | Purpose |
|------|---------|
| `memory/handover.md` | Session state snapshot |
| `checklist.md` | Progress tracking (6/10 items) |
| `tasks.md` | Next action identification |

### Key Takeaways

| Aspect | Learning |
|--------|----------|
| Handover Files | Created via `/spec_kit:handover` before session end |
| Progress Tracking | Checklist shows completion percentage |
| Blocker Awareness | Resume surfaces any documented blockers |
| Seamless Continuation | No need to re-explain context |

---

<!-- /ANCHOR:resuming-work -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

### Reference Files

| File | Purpose |
|------|---------|
| [level_specifications.md](../templates/level_specifications.md) | Detailed level requirements and thresholds |
| [template_guide.md](../templates/template_guide.md) | Template usage and customization |
| [folder_structure.md](../structure/folder_structure.md) | Spec folder organization |

### Commands Reference

| Command | Purpose |
|---------|---------|
| `/spec_kit:complete` | Full workflow (plan + implement) |
| `/spec_kit:plan` | Planning phase only |
| `/spec_kit:implement` | Implementation with existing plan |
| `/spec_kit:resume` | Continue from previous session |
| `/spec_kit:handover` | Save context before ending session |

### Level Selection Guide

| LOC | Risk | Level | Key File Added |
|-----|------|-------|----------------|
| <100 | Low | 1 | (base set only) |
| 100-499 | Medium | 2 | checklist.md |
| 500+ | High | 3 | decision-record.md |

> **Note**: Risk and complexity can override LOC thresholds. When in doubt, choose the higher level.
<!-- /ANCHOR:related-resources -->
