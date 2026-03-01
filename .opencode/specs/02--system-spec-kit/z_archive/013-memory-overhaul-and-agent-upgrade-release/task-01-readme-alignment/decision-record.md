---
title: "Decision Record: Task 01 — README Audit & Alignment [task-01-readme-alignment/decision-record]"
description: "Task 01 requires systematic audit of 60+ README.md files across .opencode/ directory tree. The scope must balance completeness (catching all stale references) with feasibility (..."
trigger_phrases:
  - "decision"
  - "record"
  - "task"
  - "readme"
  - "audit"
  - "decision record"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Task 01 — README Audit & Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Audit Scope Definition

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Michel, @speckit agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

Task 01 requires systematic audit of 60+ README.md files across `.opencode/` directory tree. The scope must balance completeness (catching all stale references) with feasibility (not auditing irrelevant files outside `.opencode/`).

### Constraints
- Part of 7-task umbrella spec (130)
- Must be self-contained for independent agent execution
- Must produce actionable changes.md for implementer
- Time-boxed execution (5.5-8.5 hours estimated)
- Priority-tiered (P0/P1/P2) for focus
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Audit scope limited to `.opencode/` directory tree with 3-tier priority system (P0: 3 high-traffic files, P1: 55 sub-directory files, P2: HVR + anchor compliance).

**Details**: Task spec provides explicit file paths for P0/P1 items, audit criteria (5 sources, 7 intents, schema v13, missing features), and changes.md template. P2 items use grep-based checks for anchor tags and HVR violations.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-tier priority** | Focus on high-impact first, can defer P2 | Requires priority classification | 9/10 |
| All files equal priority | Simple | Risk of spending too much time on low-impact files | 5/10 |
| Wildcard-based audit | Flexible, catches new files | May miss files, hard to verify coverage | 4/10 |

**Why Chosen**: 3-tier priority ensures high-impact files (P0) get most attention, while P2 items can be deferred if needed without blocking completion.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Agent can focus on P0 items first (highest impact)
- P2 items deferrable without blocking task completion
- Explicit file lists enable coverage verification

**Negative**:
- More upfront classification work - Mitigation: Parent spec already classified files
- P2 items may be skipped - Mitigation: P2 is truly optional (compliance checks, not critical updates)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| File list becomes stale | M | Validate with Glob before audit |
| New README files missed | L | Glob `.opencode/**/*README.md` to catch any new files |
| Audit takes longer than estimated | M | P2 is deferrable, focus on P0/P1 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 60+ READMEs have stale references post-implementation |
| 2 | **Beyond Local Maxima?** | PASS | Considered equal-priority and wildcard approaches |
| 3 | **Sufficient?** | PASS | 3-tier priority matches impact distribution |
| 4 | **Fits Goal?** | PASS | Directly enables README documentation alignment |
| 5 | **Open Horizons?** | PASS | Reusable 3-tier audit pattern for future tasks |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- Task spec.md (audit criteria and file lists)
- Task checklist.md (P0/P1/P2 verification items)
- changes.md (output format with priority tagging)

**Rollback**: If P0/P1 scope proves too large, defer P1 items to P2 with user approval
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3+ Decision Record for Task 01
Documents audit scope with 3-tier priority system
Enables independent agent execution with clear completion criteria
-->
