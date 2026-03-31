---
title: "Decision [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4/decision-record]"
description: "This document captures key architectural and implementation decisions made during the Post-Merge Refinement 4 project."
trigger_phrases:
  - "decision"
  - "record"
  - "post"
  - "merge"
  - "refinement"
  - "decision record"
  - "041"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record.md | v1.0 -->

# Decision Record: Post-Merge Refinement 4

## Overview

This document captures key architectural and implementation decisions made during the Post-Merge Refinement 4 project.

| Decision | Status | Date |
|----------|--------|------|
| DR-001: Agent File Resolution | Proposed | 2025-12-25 |
| DR-002: Template Consolidation | Proposed | 2025-12-25 |
| DR-003: Prioritization Approach | Proposed | 2025-12-25 |
| DR-004: UX Simplification Strategy | Proposed | 2025-12-25 |
| DR-005: Script Implementation | Proposed | 2025-12-25 |
| DR-006: Backward Compatibility | Proposed | 2025-12-25 |

---

## DR-001: Agent File Resolution Strategy

### Status
Proposed

### Context
AGENTS.md:877-884 references agent files that don't exist:
- `librarian/AGENT.md` - doesn't exist (only `research/AGENT.md`)
- `documentation-writer/AGENT.md` - doesn't exist
- `AGENT_TEMPLATE.md` - doesn't exist

Only 3 agents actually exist: `frontend-debug`, `research`, `webflow-mcp`

### Decision
**Option B: Update AGENTS.md to reflect reality**

Update AGENTS.md to list only the 3 existing agents and remove references to non-existent files.

### Alternatives Considered

**Option A: Create Missing Agent Files**
- Create `librarian/AGENT.md` (alias to research)
- Create `documentation-writer/AGENT.md`
- Create `AGENT_TEMPLATE.md`

Pros:
- Preserves documented agent capabilities
- Enables future agent expansion

Cons:
- Creates maintenance burden
- Librarian is just an alias for research
- Documentation-writer may not be needed

**Option B: Update AGENTS.md** (CHOSEN)

Pros:
- Simpler maintenance
- Single source of truth
- Reflects actual capabilities

Cons:
- Loses documented agent concepts
- May need to recreate later

### Rationale
Option B is simpler and reduces maintenance burden. The "Librarian" agent is functionally identical to "Research" agent. If documentation-writer is needed, it can be created when there's a concrete use case.

### Consequences
- AGENTS.md will list 3 agents instead of 5
- Agent registry section will be shorter
- Future agent additions will require both file creation AND AGENTS.md update

---

## DR-002: Template Consolidation Approach

### Status
Proposed

### Context
Two nearly identical context templates exist:
- `templates/context_template.md` (566 lines)
- `templates/memory/context.md` (559 lines)

The 7-line difference is the constitutional tier documentation missing from memory/context.md.

### Decision
**Merge into single template at templates/context_template.md**

1. Add constitutional tier to context_template.md (if missing)
2. Delete templates/memory/context.md
3. Update all references to use context_template.md

### Alternatives Considered

**Option A: Keep Both, Sync Manually**
- Maintain both files
- Manually sync changes

Cons: Maintenance burden, drift risk

**Option B: Merge into context_template.md** (CHOSEN)
- Single source of truth
- Delete duplicate

Pros: Simpler, no drift

**Option C: Merge into memory/context.md**
- Keep the nested location
- Delete root template

Cons: Less discoverable location

### Rationale
The root-level template is more discoverable and follows the pattern of other templates. The memory/ subfolder adds unnecessary nesting.

### Consequences
- Single template to maintain
- All generate-context.js references must use correct path
- memory/ subfolder may be empty (consider removing)

---

## DR-003: Prioritization Approach

### Status
Proposed

### Context
75+ issues identified across 10 analysis domains. Need systematic approach to prioritization.

### Decision
**Four-tier priority system with phase gates**

| Priority | Criteria | Phase |
|----------|----------|-------|
| P0 | Blocks workflows, causes errors | Phase 1 |
| P1 | Causes confusion, inconsistency | Phase 2 |
| P2 | Improves UX, reduces friction | Phase 3 |
| P3 | Nice to have, future work | Backlog |

Gate between each phase requires all items verified.

### Alternatives Considered

**Option A: Fix Everything at Once**
- Address all issues in single pass

Cons: High risk, hard to validate

**Option B: Domain-Based Phases**
- Phase by domain (docs, code, UX)

Cons: P0 issues spread across phases

**Option C: Priority-Based Phases** (CHOSEN)
- Phase by priority level

Pros: Critical issues first, clear gates

### Rationale
Priority-based phasing ensures critical issues are resolved before moving to improvements. Gates provide validation checkpoints.

### Consequences
- P0 issues resolved first (Day 1)
- P1 issues may wait until Day 2
- P2/P3 may be deferred if time constrained

---

## DR-004: UX Simplification Strategy

### Status
Proposed

### Context
UX analysis revealed significant friction:
- 8 gates to navigate
- 5+ steps for memory save
- 800+ line documentation files
- No beginner mode

### Decision
**Incremental UX improvements, not major overhaul**

Focus on quick wins:
1. Add /memory:save:quick command
2. Add inline command help
3. Auto-skip Gate 3 for trivial changes (future)

Defer major changes:
- Gate consolidation
- Beginner mode
- Progressive gate activation

### Alternatives Considered

**Option A: Major UX Overhaul**
- Redesign gate system
- Implement beginner mode
- Reduce to 3-4 gates

Cons: High risk, scope creep, breaking changes

**Option B: Incremental Improvements** (CHOSEN)
- Quick wins first
- Preserve existing behavior
- Plan major changes for future

Pros: Lower risk, measurable progress

### Rationale
Major UX changes require careful design and user testing. Quick wins provide immediate value while planning larger changes.

### Consequences
- Gate complexity remains (for now)
- Users get quick save option
- Future spec needed for major UX work

---

## DR-005: Script Implementation Approach

### Status
Proposed

### Context
Two scripts referenced but don't exist:
- validate-spec.sh
- recommend-level.sh

### Decision
**Create minimal viable scripts**

validate-spec.sh:
- Check required files per level
- Validate anchor format
- Return exit codes (0/1/2)

recommend-level.sh:
- Count LOC
- Check complexity indicators
- Output recommendation

### Alternatives Considered

**Option A: Full-Featured Scripts**
- Comprehensive validation
- Multiple output formats
- Configuration options

Cons: Over-engineering, delays delivery

**Option B: Minimal Viable Scripts** (CHOSEN)
- Core functionality only
- Simple output
- Extensible later

Pros: Quick delivery, meets immediate need

### Rationale
Scripts are blocking workflows. Minimal implementation unblocks users. Features can be added incrementally.

### Consequences
- Scripts may need enhancement later
- Core validation available immediately
- Documentation must match actual capabilities

---

## DR-006: Backward Compatibility

### Status
Proposed

### Context
Changes must not break:
- Existing memories in database
- Existing spec folders
- MCP tool signatures
- Command syntax

### Decision
**Strict backward compatibility**

Rules:
1. No MCP tool signature changes
2. No command syntax changes
3. Existing memories must remain searchable
4. Existing spec folders must validate

### Alternatives Considered

**Option A: Allow Breaking Changes**
- Clean up legacy patterns
- Simplify interfaces

Cons: Disrupts existing workflows

**Option B: Strict Compatibility** (CHOSEN)
- Preserve all existing behavior
- Add new features alongside

Pros: No disruption, safe rollout

### Rationale
Users have existing memories and spec folders. Breaking changes would require migration and cause disruption.

### Consequences
- Some legacy patterns preserved
- New features must be additive
- Migration path needed for future breaking changes

---

<!-- ANCHOR:decision -->
## Decision Log

| Date | Decision | Outcome |
|------|----------|---------|
| 2025-12-25 | DR-001 proposed | Pending approval |
| 2025-12-25 | DR-002 proposed | Pending approval |
| 2025-12-25 | DR-003 proposed | Pending approval |
| 2025-12-25 | DR-004 proposed | Pending approval |
| 2025-12-25 | DR-005 proposed | Pending approval |
| 2025-12-25 | DR-006 proposed | Pending approval |

<!-- /ANCHOR:decision -->
---

## Appendix: Analysis Source

All decisions informed by 10-agent analysis documented in:
`.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4/analysis-report.md`
