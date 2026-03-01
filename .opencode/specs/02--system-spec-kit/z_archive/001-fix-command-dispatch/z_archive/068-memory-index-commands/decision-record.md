---
title: "Decision: Memory Command Separation - Architecture Decision Record [068-memory-index-commands/decision-record]"
description: "Architecture Decision Record documenting the decision to separate /memory:search into two focused commands."
trigger_phrases:
  - "decision"
  - "memory"
  - "command"
  - "separation"
  - "architecture"
  - "decision record"
  - "068"
importance_tier: "important"
contextType: "decision"
---
# Decision: Memory Command Separation - Architecture Decision Record

Architecture Decision Record documenting the decision to separate `/memory:search` into two focused commands.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

## 1. METADATA

- **Decision ID**: ADR-070
- **Status**: Accepted
- **Date**: 2026-01-16
- **Deciders**: Developer
- **Related Feature**: [spec.md](./spec.md)
- **Supersedes**: N/A
- **Superseded By**: N/A

---

## 2. CONTEXT

### Problem Statement
The current `/memory:search` command (667 lines) combines two fundamentally different concerns:
1. **Read operations**: Dashboard, search, load by ID/folder/anchor, triggers view
2. **Write operations**: Cleanup (delete), tier management, trigger editing, validation

This unified approach creates several problems:
- **Cognitive overload**: Users searching for memories see cleanup/management options
- **Safety risk**: Destructive operations are accessible during search workflows
- **Complexity**: Single 667-line file is difficult to maintain
- **Mixed concerns**: Read-only queries share gates with destructive operations

### Current Situation
The `/memory:search` command currently handles:

| Operation Type | Operations | Safety Level |
|----------------|------------|--------------|
| Read | Dashboard, Search, Load, Triggers View | Safe (no data changes) |
| Write | Cleanup, Tier, Triggers Edit, Validate | Requires gates |
| Delete | Cleanup deletion, Individual delete | Destructive (gated) |

All these operations share:
- One argument-hint (cluttered)
- One allowed-tools list (mixed read/write)
- One routing table (complex)
- Mixed gates (cleanup gate during read workflows)

### Constraints
- Must preserve ALL existing functionality (no operations lost)
- Must maintain backward-compatible argument patterns
- Must keep gates for destructive operations
- Should reduce per-command complexity

### Assumptions
- Users prefer focused commands over unified "do everything" commands
- Separating read/write operations improves discoverability
- Two 350-400 line files are easier to maintain than one 667-line file
- Users can learn the new `/memory:database` command quickly

---

## 3. DECISION

### Summary
Separate `/memory:search` into two commands: a read-only `/memory:search` (~350 lines) and a management-focused `/memory:database` (~400 lines).

### Detailed Description

**New Command Structure:**

| Command | Purpose | Operations | Safety |
|---------|---------|------------|--------|
| `/memory:search` | Read-only memory access | Dashboard, Search, Load, Triggers View | No gates needed |
| `/memory:database` | Database management | Scan, Cleanup, Tier, Triggers Edit, Validate, Delete, Health | Gates for destructive ops |

**Key Design Decisions:**

1. **Search becomes read-only**: All write operations removed
2. **DB command owns all mutations**: Cleanup, tier, triggers, validate, delete
3. **DB command adds new features**: Scan (index), Health check
4. **Gates isolated to DB command**: Only `/memory:database` has confirmation gates
5. **Cross-references**: Each command references the other

### Technical Approach

```
BEFORE (Unified):
┌─────────────────────────────────────────────┐
│         /memory:search (667 lines)          │
├─────────────────────────────────────────────┤
│ Frontmatter: Mixed read/write tools         │
│ Gate 1: Cleanup confirmation (mixed UX)     │
│ Sections 1-8: Read operations               │
│ Section 9: Trigger Edit (write)             │
│ Section 10: Triggers View (read)            │
│ Section 11: Cleanup Mode (destructive)      │
│ Section 12: Tier Promotion (write)          │
│ Sections 13-16: Misc                        │
└─────────────────────────────────────────────┘

AFTER (Separated):
┌────────────────────────────────┐   ┌────────────────────────────────┐
│ /memory:search (~350 lines)    │   │ /memory:database (~400 lines)        │
├────────────────────────────────┤   ├────────────────────────────────┤
│ Frontmatter: Read-only tools   │   │ Frontmatter: All write tools   │
│ NO GATES (nothing destructive) │   │ Gate 1: Cleanup confirmation   │
│ Section 1: Purpose             │   │ Gate 2: Delete confirmation    │
│ Section 2: Contract            │   │ Section 1: Purpose             │
│ Section 3: Argument Routing    │   │ Section 2: Contract            │
│ Section 4: MCP Enforcement     │   │ Section 3: Argument Routing    │
│ Section 5: Direct Load         │   │ Section 4: MCP Enforcement     │
│ Section 6: Dashboard           │   │ Section 5: Stats Dashboard     │
│ Section 7: Search              │   │ Section 6: Scan Mode           │
│ Section 8: Memory Detail       │   │ Section 7: Cleanup Mode        │
│ Section 9: Triggers View       │   │ Section 8: Tier Management     │
│ Section 10: Quick Reference    │   │ Section 9: Trigger Edit        │
│ Section 11: Error Handling     │   │ Section 10: Validate           │
│ Section 12: Related Commands   │   │ Section 11: Delete Mode        │
│                                │   │ Section 12: Health Check       │
│ Cross-ref: /memory:database          │   │ Section 13: Quick Reference    │
│                                │   │ Section 14: Error Handling     │
│                                │   │ Section 15: Related Commands   │
│                                │   │                                │
│                                │   │ Cross-ref: /memory:search      │
└────────────────────────────────┘   └────────────────────────────────┘
```

---

## 4. ALTERNATIVES CONSIDERED

### Option 1: [CHOSEN] Command Separation (Read/Write Split)

**Description**: Split into `/memory:search` (read-only) and `/memory:database` (management)

**Pros**:
- Single Responsibility Principle enforced
- Clear mental model (search = safe, db = careful)
- Reduced cognitive load for common search tasks
- Destructive operations isolated with explicit gates
- Easier maintenance (smaller, focused files)
- Enables future expansion of either command independently

**Cons**:
- Users must learn new command
- Breaking change for users expecting cleanup in search
- Two files to maintain instead of one

**Score**: 9/10

**Why Chosen**: Best balance of safety, usability, and maintainability. The separation follows established patterns (read vs. write separation) and reduces risk of accidental destructive operations.

---

### Option 2: Keep Unified with Sub-Commands

**Description**: Keep single command but add explicit sub-command syntax: `/memory:search query`, `/memory:search --admin cleanup`

**Pros**:
- Single entry point
- No new command to learn
- Clear admin flag separates concerns

**Cons**:
- Still one large file (667+ lines)
- Mixed tools in frontmatter
- Sub-command parsing adds complexity
- Admin operations still visible in help output

**Score**: 6/10

**Why Rejected**: Doesn't solve the maintenance complexity or cognitive overload problems. The `--admin` flag is an incomplete solution.

---

### Option 3: Three-Way Split (Search/Edit/Delete)

**Description**: Create three commands: `/memory:search`, `/memory:edit`, `/memory:delete`

**Pros**:
- Very granular separation
- Each command is small and focused
- Clear purpose for each

**Cons**:
- Too many commands (command proliferation)
- Edit and Delete are closely related
- Users must remember three commands
- Increases mental model complexity

**Score**: 5/10

**Why Rejected**: Over-engineering. The two-command split (read/write) is sufficient. Edit and delete are both "management" operations that belong together.

---

### Comparison Matrix

| Criterion | Weight | Option 1: Separation | Option 2: Unified | Option 3: Three-Way |
|-----------|--------|---------------------|-------------------|---------------------|
| Safety | 10 | 10/10 | 6/10 | 10/10 |
| Usability | 10 | 9/10 | 7/10 | 6/10 |
| Maintainability | 8 | 9/10 | 5/10 | 7/10 |
| Learning Curve | 6 | 7/10 | 9/10 | 5/10 |
| Future Extensibility | 6 | 9/10 | 6/10 | 8/10 |
| **Weighted Score** | - | **8.85/10** | 6.55/10 | 7.35/10 |

---

## 5. CONSEQUENCES

### Positive Consequences
- **Safety**: Destructive operations isolated with explicit gates
- **Simplicity**: Each command has clear, single purpose
- **Discoverability**: Users know where to find what they need
- **Maintainability**: Smaller files (~350-400 lines each vs. 667)
- **Extensibility**: Can add features to either command independently
- **Mental Model**: "search = safe to explore, db = be careful"

### Negative Consequences
- **Learning Curve**: Users must learn new `/memory:database` command
  - *Mitigation*: Cross-references, clear documentation
- **Breaking Change**: Users expecting `/memory:search cleanup` will see error
  - *Mitigation*: Helpful error message suggesting `/memory:database cleanup`
- **Two Files**: Two files to maintain instead of one
  - *Mitigation*: Each file is smaller and more focused

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Users confused by split | Medium | Medium | Clear documentation, cross-references, helpful errors |
| Missing operation in refactor | High | Low | Comprehensive mapping checklist |
| Inconsistent behavior | Medium | Low | Test both commands thoroughly |

### Technical Debt Introduced
- None - this decision reduces technical debt by improving separation of concerns

---

## 6. IMPLEMENTATION NOTES

**Implementation Order:**

1. Create backup of original search.md
2. [P] Create new database.md with management operations
3. Refactor search.md to remove management operations (after database.md complete)
4. Add cross-references to both files
5. Test all operations in both commands
6. Update any external documentation

---

## 7. IMPACT ASSESSMENT

### Systems Affected
- `.opencode/command/memory/search.md` - Major refactoring
- `.opencode/command/memory/database.md` - New file created
- User workflows that use `/memory:search cleanup` - Must use `/memory:database cleanup`

### Teams Impacted
- Developers using memory commands - Must learn new pattern

### Migration Path
1. New database.md created with all management operations
2. search.md refactored to remove management operations
3. Users encountering `/memory:search cleanup` will get helpful error
4. Documentation updated to reflect new structure

### Rollback Strategy
If issues arise:
1. Revert search.md from git: `git checkout HEAD~1 -- .opencode/command/memory/search.md`
2. Delete database.md: `rm .opencode/command/memory/database.md`
3. Original unified command restored

---

## 8. TIMELINE

- **Decision Made**: 2026-01-16
- **Implementation Start**: 2026-01-16
- **Target Completion**: 2026-01-16
- **Review Date**: 2026-02-16 (1 month review)

---

## 9. REFERENCES

### Related Documents
- **Feature Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Task List**: [tasks.md](./tasks.md)
- **Validation Checklist**: [checklist.md](./checklist.md)

### Design Principles Referenced
- Single Responsibility Principle (SRP)
- Separation of Concerns
- Command-Query Responsibility Segregation (CQRS) - inspiration

---

## 10. APPROVAL & SIGN-OFF

### Approvers

| Name | Role | Approved | Date | Comments |
|------|------|----------|------|----------|
| Developer | Owner | Yes | 2026-01-16 | Approved after Sequential Thinking analysis |

### Status Changes

| Date | Previous Status | New Status | Reason |
|------|----------------|------------|--------|
| 2026-01-16 | - | Proposed | Initial proposal after analysis |
| 2026-01-16 | Proposed | Accepted | Sequential Thinking validated approach |

---

## 11. UPDATES & AMENDMENTS

### Amendment History

| Date | Change | Reason | Updated By |
|------|--------|--------|------------|
| 2026-01-16 | Initial creation | Document decision | Developer |

---

**Review Schedule**: This decision should be reviewed on 2026-02-16 to assess if the command separation is working well for users.
