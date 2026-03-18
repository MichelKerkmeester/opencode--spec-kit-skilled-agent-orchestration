---
title: "Decision Record - Performance Patterns Update [007-performance-patterns-update/decision-record]"
description: "This document records architectural and implementation decisions for updating the workflows-code skill with performance optimization patterns."
trigger_phrases:
  - "decision"
  - "record"
  - "performance"
  - "patterns"
  - "update"
  - "decision record"
  - "026"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Decision Record - Performance Patterns Update

## Overview

This document records architectural and implementation decisions for updating the workflows-code skill with performance optimization patterns.

---

<!-- ANCHOR:adr-001 -->
## DR-001: Phase 0 Research Stage

<!-- ANCHOR:adr-001-context -->
### Context
The anobel.com performance optimization project demonstrated that comprehensive research BEFORE implementation prevents costly rework. The 20.2s LCP root cause was only discovered through systematic 10-agent analysis.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**Add Phase 0: Research as an optional stage before Phase 1: Implementation in SKILL.md.**

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Rationale
- Research-first approach identified root cause efficiently
- 10-agent parallel analysis covered all performance vectors
- Prevents "fix symptoms, miss root cause" anti-pattern
- Makes skill more effective for complex performance work

### Alternatives Considered
1. **Inline research in Phase 1** - Rejected: Mixes concerns, less systematic
2. **Separate performance skill** - Rejected: Fragmentations, workflows-code should be comprehensive
3. **No change** - Rejected: Loses valuable methodology

<!-- /ANCHOR:adr-001-alternatives -->

### Status: **APPROVED**

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## DR-002: Reference File Structure

<!-- ANCHOR:adr-002-context -->
### Context
Need to organize 6+ new reference documents covering performance patterns, Webflow constraints, and research methodology.

<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
**Create new subdirectories under `references/`:**
- `references/performance/` - CWV, resource loading, Webflow, third-party
- `references/verification/` - Performance checklist (new directory)
- `references/research/` - Multi-agent patterns (new directory)

<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Rationale
- Logical grouping by domain
- Scalable for future additions
- Follows existing skill reference patterns
- Clear separation of concerns

### Alternatives Considered
1. **Flat structure** - Rejected: Too many files at one level
2. **Single performance.md** - Rejected: Would be too long (500+ lines)
3. **Separate from references/** - Rejected: Breaks skill convention

<!-- /ANCHOR:adr-002-alternatives -->

### Status: **APPROVED**

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## DR-003: Pattern Sourcing

<!-- ANCHOR:adr-003-context -->
### Context
All patterns should be derived from actual implementation experience, not theoretical best practices.

<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
**Source all patterns from 024-performance-optimization spec folder**, with specific file/line citations.

<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-impl -->
### Implementation
- CWV patterns: From research.md agent findings
- Code examples: From global.html/home.html implementations
- Webflow constraints: From decision-record.md DR-002, DR-003

<!-- /ANCHOR:adr-003-impl -->

<!-- ANCHOR:adr-003-alternatives -->
### Rationale
- Patterns are battle-tested
- Specific to Webflow context
- Includes real workarounds, not just ideals
- Traceable to source

<!-- /ANCHOR:adr-003-alternatives -->

### Status: **APPROVED**

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## DR-004: Multi-Agent Documentation Scope

<!-- ANCHOR:adr-004-context -->
### Context
The 10-agent research methodology was highly effective but is complex to document. Need to decide depth of documentation.

<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision
**Document the 10-agent specialization model at a practical level**, focusing on:
- When to use (complex codebase analysis, performance audits)
- Agent focus areas (what each analyzes)
- Coordination pattern (parallel dispatch, synthesis)

**Exclude:**
- Detailed prompting strategies
- Agent interaction protocols
- Edge case handling

<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Rationale
- Focus on "what" and "when", not detailed "how"
- Agent prompting is contextual, hard to template
- Users can adapt methodology to their needs
- Keeps documentation actionable

<!-- /ANCHOR:adr-004-alternatives -->

### Status: **APPROVED**

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## DR-005: Webflow Constraints Documentation

<!-- ANCHOR:adr-005-context -->
### Context
Webflow has specific platform limitations that affect performance optimization. These are not obvious to developers new to Webflow.

<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-decision -->
### Decision
**Create dedicated `webflow-constraints.md`** documenting:
- TypeKit sync loading (no async option)
- jQuery/webflow.js auto-injection
- CSS generation limitations
- Custom code injection timing
- Workarounds for each constraint

<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-alternatives -->
### Rationale
- Prevents wasted effort on impossible optimizations
- Documents non-obvious platform behavior
- Includes workarounds, not just limitations
- Specific to anobel.com tech stack

<!-- /ANCHOR:adr-005-alternatives -->

### Status: **APPROVED**

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## DR-006: Bundling Patterns Exclusion

<!-- ANCHOR:adr-006-context -->
### Context
Script bundling was originally planned in 024-performance-optimization but removed per user preference ("makes code harder to manage for me").

<!-- /ANCHOR:adr-006-context -->

<!-- ANCHOR:adr-006-decision -->
### Decision
**Exclude bundling patterns from skill documentation.**

<!-- /ANCHOR:adr-006-decision -->

<!-- ANCHOR:adr-006-alternatives -->
### Rationale
- User explicitly rejected bundling approach
- Individual scripts are preferred for maintainability
- Bundling adds build complexity
- HTTP/2 multiplexing reduces bundling benefit

<!-- /ANCHOR:adr-006-alternatives -->

### Status: **APPROVED (Excluded)**

<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## DR-007: Video Poster Pattern Exclusion

<!-- ANCHOR:adr-007-context -->
### Context
Video poster optimization was identified as a P0 pattern but removed from 024-performance-optimization per user preference.

<!-- /ANCHOR:adr-007-context -->

<!-- ANCHOR:adr-007-decision -->
### Decision
**Document video poster pattern in cwv-remediation.md but mark as "optional/context-dependent".**

<!-- /ANCHOR:adr-007-decision -->

<!-- ANCHOR:adr-007-alternatives -->
### Rationale
- Pattern is technically valid for LCP optimization
- User had specific reasons for exclusion
- Other projects may benefit from the pattern
- Documentation should cover options, implementation is context-specific

<!-- /ANCHOR:adr-007-alternatives -->

### Status: **APPROVED (Documented as optional)**

<!-- /ANCHOR:adr-007 -->

---

## Decision Summary

| ID | Decision | Status |
|----|----------|--------|
| DR-001 | Add Phase 0: Research stage | Approved |
| DR-002 | New reference subdirectories | Approved |
| DR-003 | Source patterns from 024-performance-optimization | Approved |
| DR-004 | Document 10-agent at practical level | Approved |
| DR-005 | Create webflow-constraints.md | Approved |
| DR-006 | Exclude bundling patterns | Approved (Excluded) |
| DR-007 | Document video poster as optional | Approved |

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial decision record created |
