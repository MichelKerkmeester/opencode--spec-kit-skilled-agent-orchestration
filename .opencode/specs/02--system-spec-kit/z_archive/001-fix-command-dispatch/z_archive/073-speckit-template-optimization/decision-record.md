---
title: "Decision Record: SpecKit Template Optimization [073-speckit-template-optimization/decision-record]"
description: "The existing SpecKit templates were monolithic - each level had its own complete set of templates with significant duplication. tasks.md L1 and L2 were 100% identical (278 lines..."
trigger_phrases:
  - "decision"
  - "record"
  - "speckit"
  - "template"
  - "optimization"
  - "decision record"
  - "073"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Decision Record: SpecKit Template Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: CORE + ADDENDUM Architecture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-19 |
| **Deciders** | Development team |

---

### Context

The existing SpecKit templates were monolithic - each level had its own complete set of templates with significant duplication. tasks.md L1 and L2 were 100% identical (278 lines). Higher levels added boilerplate rather than meaningful value.

### Constraints
- Must maintain backward compatibility
- Must support clear level differentiation
- Must enable single-source updates to shared content
- Must support parallel sub-agent spec creation

---

### Decision

**Summary**: Adopt a compositional CORE + ADDENDUM architecture where core templates are shared and addendums add level-specific value.

**Details**:
- Core templates (~270 LOC) contain essential what/why/how shared by all levels
- Level addendums add distinct VALUE sections:
  - L2: +Verification (NFRs, edge cases, checklist)
  - L3: +Architecture (executive summary, ADRs, risk matrix)
  - L3+: +Governance (approval workflow, compliance, AI protocols)
- Composed templates in level_1/2/3/3+ folders are pre-merged for convenience

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CORE + ADDENDUM** (Chosen) | Single source of truth, clear value scaling, modular maintenance | Requires understanding composition | 9/10 |
| Monolithic templates | Simple to understand | Duplication, no differentiation, maintenance burden | 4/10 |
| Marker-based templates | Runtime flexibility | Complex parsing, harder debugging | 5/10 |

**Why Chosen**: CORE + ADDENDUM provides the best balance of maintainability, clear level differentiation, and value-based scaling. Each level genuinely adds VALUE rather than just more lines.

---

### Consequences

**Positive**:
- Single source of truth for core content
- Clear level justification (each addendum has distinct purpose)
- Easier maintenance (change core once, all levels benefit)
- Value-based scaling (higher levels = more useful, not more verbose)

**Negative**:
- Requires understanding the composition model
- Mitigation: Pre-composed templates in level folders for direct use

---

## ADR-002: Value-Based Level Scaling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-19 |
| **Deciders** | Development team |

---

### Context

Analysis of real usage patterns showed that higher-level templates added boilerplate sections that were rarely used (stakeholders 0%, traceability mapping 0%, assumptions validation 0%) rather than adding genuinely useful content.

### Constraints
- Higher levels must justify their additional overhead
- Each level must provide clear value for its complexity tier
- Content must reflect real-world usage patterns

---

### Decision

**Summary**: Each level adds sections that provide genuine VALUE for that complexity tier.

**Details**:

| Level | Value Added | Justification |
|-------|-------------|---------------|
| L1 (Core) | Essential what/why/how | Every spec needs this |
| L2 (+Verify) | NFRs, edge cases, checklist | Quality-focused work needs verification |
| L3 (+Arch) | Executive summary, ADRs, risk matrix | Complex work needs architectural documentation |
| L3+ (+Govern) | Approval workflow, compliance, AI protocols | Enterprise work needs governance |

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Value-based scaling** (Chosen) | Clear purpose per level, useful content | Requires analysis of what's valuable | 9/10 |
| Length-based scaling | Simple rule | More lines ≠ more value | 3/10 |
| Feature-based scaling | Flexible | No clear level boundaries | 5/10 |

**Why Chosen**: Value-based scaling ensures every section in a template earns its place. Real usage analysis (9+ spec folders) validated which sections are actually used.

---

### Consequences

**Positive**:
- Higher levels genuinely more useful
- Clear guidance on when to use each level
- Reduced cognitive load (fewer unused sections)

**Negative**:
- Some enterprise features only available at L3+
- Mitigation: Clear level selection guidance in SKILL.md

---

## ADR-003: Workstream Notation for Parallel Agents

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-19 |
| **Deciders** | Development team |

---

### Context

Parallel sub-agent spec creation requires clear file ownership to prevent conflicts. Without explicit notation, multiple agents might modify the same files, causing merge conflicts.

### Constraints
- Must be simple to understand
- Must prevent file conflicts
- Must support clear sync points
- Must integrate with existing task notation

---

### Decision

**Summary**: Add workstream notation [W-A], [W-B], [SYNC] to tasks.md and plan.md templates.

**Details**:
- `[W-A]`: Task owned by Workstream A (agent 1)
- `[W-B]`: Task owned by Workstream B (agent 2)
- `[SYNC]`: Sync point where all workstreams must complete before proceeding

Configuration in parallel_dispatch_config.md defines:
- Tiered creation architecture (Tier 1 sequential, Tier 2 parallel, Tier 3 integration)
- Workstream file ownership rules
- Sync point definitions

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Workstream notation** (Chosen) | Clear ownership, simple syntax | Adds notation complexity | 8/10 |
| No notation (implicit) | Simpler templates | Conflict-prone | 3/10 |
| Lock-based system | Prevents conflicts | Complex infrastructure | 5/10 |

**Why Chosen**: Workstream notation is simple, explicit, and integrates naturally with existing task notation. It enables parallel creation while maintaining clear ownership.

---

### Consequences

**Positive**:
- Clear file ownership per workstream
- Defined sync points prevent premature integration
- Enables 40% faster spec creation via parallelization

**Negative**:
- Additional notation to learn
- Mitigation: Clear documentation in parallel_dispatch_config.md

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
